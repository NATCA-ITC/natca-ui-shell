<script setup lang="ts">
/**
 * NatcaDocumentViewer — Two-layer document presentation primitive.
 *
 * Renders an inline PDF (via pdf.js), image, or download-CTA depending on
 * mime-type. Zero DMS knowledge — takes URL + metadata, emits events.
 *
 *   • `mode="inline"`  — renders in the page. Use inside NatcaCard.
 *   • `mode="lightbox"`— wrapped in NatcaDialog `bare` for full-screen preview.
 *
 * pdf.js is a peer dependency. Consumers must:
 *   npm install pdfjs-dist
 * The component lazy-imports it so apps that never preview PDFs don't pay
 * the bundle cost.
 *
 * @example Inline preview
 * <NatcaDocumentViewer
 *   :document-url="signedUrl"
 *   :metadata="{ title: doc.title, period: 'FY2025', version: 'v3' }"
 *   :chapters="chapters"
 *   @download="logDownload"
 * />
 *
 * @example Lightbox
 * <NatcaDocumentViewer
 *   v-model:open="showLightbox"
 *   mode="lightbox"
 *   :document-url="signedUrl"
 *   :metadata="{ title: doc.title }"
 * />
 */
import { computed, onBeforeUnmount, ref, shallowRef, useSlots, watch } from 'vue'
import { VIcon, VProgressLinear, VSelect } from 'vuetify/components'
import NatcaButton from './NatcaButton.vue'
import NatcaIconButton from './NatcaIconButton.vue'
import NatcaDialog from './NatcaDialog.vue'
import type {
  DocumentViewerMetadata,
  DocumentViewerVersionRef,
  DocumentViewerChapterRef,
} from '../types'

const props = withDefaults(defineProps<{
  documentUrl: string
  /** Hint for routing rendering when the URL lacks a recognizable extension. */
  mimeType?: string
  metadata?: DocumentViewerMetadata
  versions?: DocumentViewerVersionRef[]
  chapters?: DocumentViewerChapterRef[]
  /** Chapter id to highlight in the TOC rail. */
  anchor?: string | null
  mode?: 'inline' | 'lightbox'
  /** Lightbox visibility (v-model:open). Ignored in inline mode. */
  open?: boolean
  /** Maximum render scale; default 1.5 (Retina-friendly without ballooning memory). */
  maxScale?: number
  /**
   * Override for pdf.js worker URL. Default fetches the version-matched worker
   * from jsdelivr. Set this to a self-hosted absolute URL for CSP-strict or
   * offline deployments. Has no effect if `pdfjs.GlobalWorkerOptions.workerSrc`
   * is already set elsewhere in the app.
   */
  workerSrc?: string
}>(), {
  mode: 'inline',
  open: false,
  maxScale: 1.5,
})

const emit = defineEmits<{
  view: [url: string]
  download: [url: string]
  'version-change': [versionId: string]
  'chapter-change': [chapterId: string]
  'update:open': [value: boolean]
}>()

defineSlots<{
  /** Override the default metadata strip. Receives metadata + version refs. */
  header?: (props: {
    metadata?: DocumentViewerMetadata
    versions?: DocumentViewerVersionRef[]
  }) => any
  /** Override the default footer (download + open-in-new-tab). */
  footer?: (props: { documentUrl: string }) => any
}>()

const slots = useSlots()

// ── Kind detection ────────────────────────────────────────────────────────────
const kind = computed<'pdf' | 'image' | 'other'>(() => {
  const mt = (props.mimeType || '').toLowerCase()
  if (mt.startsWith('application/pdf')) return 'pdf'
  if (mt.startsWith('image/')) return 'image'
  const url = (props.documentUrl || '').toLowerCase().split('?')[0]
  if (url.endsWith('.pdf')) return 'pdf'
  if (/\.(png|jpe?g|gif|webp|svg|avif)$/.test(url)) return 'image'
  return 'other'
})

// ── PDF rendering (pdf.js) ────────────────────────────────────────────────────
const pdfLoading = ref(false)
const pdfError = ref<string | null>(null)
const pageCount = ref(0)
const scale = ref(1)
const pdfHost = ref<HTMLDivElement | null>(null)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pdfDoc = shallowRef<any>(null)
let renderToken = 0

async function loadPdf() {
  if (kind.value !== 'pdf') return
  if (!props.documentUrl) return
  pdfLoading.value = true
  pdfError.value = null
  const token = ++renderToken
  try {
    const pdfjs = await import(/* @vite-ignore */ 'pdfjs-dist/legacy/build/pdf.mjs')
    if (pdfjs.GlobalWorkerOptions && !pdfjs.GlobalWorkerOptions.workerSrc) {
      // Resolve a worker source without using a bundler-specific `?url` import,
      // so consuming apps don't need `optimizeDeps.exclude: ['@natca-itc/ui-shell']`.
      // Default: version-matched worker from jsdelivr.
      // Override via the `workerSrc` prop or by setting GlobalWorkerOptions.workerSrc
      // before this component mounts (e.g., in main.ts).
      pdfjs.GlobalWorkerOptions.workerSrc =
        props.workerSrc ??
        `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`
    }
    const task = pdfjs.getDocument({ url: props.documentUrl })
    const doc = await task.promise
    if (token !== renderToken) return
    pdfDoc.value = doc
    pageCount.value = doc.numPages
    emit('view', props.documentUrl)
    await renderAllPages()
  } catch (err) {
    if (token !== renderToken) return
    pdfError.value = err instanceof Error ? err.message : 'Failed to load PDF'
  } finally {
    if (token === renderToken) pdfLoading.value = false
  }
}

async function renderAllPages() {
  const host = pdfHost.value
  const doc = pdfDoc.value
  if (!host || !doc) return
  const token = renderToken
  host.innerHTML = ''
  const effectiveScale = Math.min(scale.value, props.maxScale)
  const dpr = typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1
  for (let i = 1; i <= doc.numPages; i++) {
    if (token !== renderToken) return
    const page = await doc.getPage(i)
    const viewport = page.getViewport({ scale: effectiveScale })
    const canvas = document.createElement('canvas')
    canvas.className = 'natca-doc-viewer__page'
    canvas.width = Math.floor(viewport.width * dpr)
    canvas.height = Math.floor(viewport.height * dpr)
    canvas.style.width = `${Math.floor(viewport.width)}px`
    canvas.style.height = `${Math.floor(viewport.height)}px`
    const ctx = canvas.getContext('2d')
    if (!ctx) continue
    ctx.scale(dpr, dpr)
    host.appendChild(canvas)
    await page.render({ canvasContext: ctx, viewport }).promise
  }
}

function zoomIn() {
  scale.value = Math.min(props.maxScale, +(scale.value + 0.2).toFixed(2))
  void renderAllPages()
}
function zoomOut() {
  scale.value = Math.max(0.6, +(scale.value - 0.2).toFixed(2))
  void renderAllPages()
}

watch(() => [props.documentUrl, kind.value] as const, () => {
  if (kind.value === 'pdf') void loadPdf()
})
loadPdf()

onBeforeUnmount(() => {
  renderToken++
  pdfDoc.value?.destroy?.()
  pdfDoc.value = null
})

// ── Version selector ──────────────────────────────────────────────────────────
const currentVersion = computed(() => {
  const v = props.versions?.find(v => v.isCurrent)
  return v?.id ?? null
})
const versionItems = computed(() =>
  (props.versions ?? []).map(v => ({ value: v.id, title: v.label })),
)
function onVersionChange(id: string) {
  emit('version-change', id)
}

// ── Chapter TOC ───────────────────────────────────────────────────────────────
const hasChapters = computed(() => (props.chapters?.length ?? 0) > 0)
function onChapterClick(id: string) {
  emit('chapter-change', id)
}

// ── Lightbox open state ───────────────────────────────────────────────────────
const lightboxOpen = computed({
  get: () => props.open,
  set: (v: boolean) => emit('update:open', v),
})

function onDownload() {
  emit('download', props.documentUrl)
}

const lastUpdatedLabel = computed(() => {
  const v = props.metadata?.lastUpdated
  if (!v) return null
  try {
    const d = v instanceof Date ? v : new Date(v)
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return null
  }
})

// Expose for both branches of the template
defineExpose({ loadPdf })
// Silence unused warning — slots is consumed in template via $slots
void slots
</script>

<template>
  <NatcaDialog
    v-if="mode === 'lightbox'"
    v-model="lightboxOpen"
    variant="bare"
    :max-width="1100"
  >
    <div class="natca-doc-viewer natca-doc-viewer--lightbox">
      <div class="natca-doc-viewer__header">
        <slot name="header" :metadata="metadata" :versions="versions">
          <div class="natca-doc-viewer__meta">
            <div class="natca-doc-viewer__meta-text">
              <h3 v-if="metadata?.title" class="natca-doc-viewer__title">
                {{ metadata.title }}
              </h3>
              <p v-if="metadata?.summary" class="natca-doc-viewer__summary">
                {{ metadata.summary }}
              </p>
              <div v-if="metadata?.period || metadata?.version || lastUpdatedLabel" class="natca-doc-viewer__chips">
                <span v-if="metadata?.period" class="natca-doc-viewer__chip">{{ metadata.period }}</span>
                <span v-if="metadata?.version" class="natca-doc-viewer__chip">{{ metadata.version }}</span>
                <span v-if="lastUpdatedLabel" class="natca-doc-viewer__chip natca-doc-viewer__chip--muted">
                  Updated {{ lastUpdatedLabel }}
                </span>
              </div>
            </div>
            <div v-if="(versions?.length ?? 0) > 1" class="natca-doc-viewer__version">
              <VSelect
                :model-value="currentVersion"
                :items="versionItems"
                label="Version"
                variant="outlined"
                density="compact"
                hide-details
                @update:model-value="onVersionChange"
              />
            </div>
          </div>
        </slot>
      </div>

      <div class="natca-doc-viewer__layout" :class="{ 'has-toc': hasChapters }">
        <aside v-if="hasChapters" class="natca-doc-viewer__toc" aria-label="Document contents">
          <p class="natca-doc-viewer__toc-title">Contents</p>
          <ul class="natca-doc-viewer__toc-list">
            <li
              v-for="chap in chapters"
              :key="chap.id"
              :class="{ 'is-active': chap.id === anchor }"
            >
              <button
                type="button"
                class="natca-doc-viewer__toc-link"
                @click="onChapterClick(chap.id)"
              >
                <span class="natca-doc-viewer__toc-index">{{ chap.index }}</span>
                <span class="natca-doc-viewer__toc-name">{{ chap.name }}</span>
              </button>
            </li>
          </ul>
        </aside>

        <div class="natca-doc-viewer__body">
          <template v-if="kind === 'pdf'">
            <div v-if="!pdfLoading && !pdfError && pageCount" class="natca-doc-viewer__toolbar">
              <div class="natca-doc-viewer__toolbar-left">
                <VIcon icon="mdi-file-pdf-box" size="18" />
                <span>{{ pageCount }} page{{ pageCount === 1 ? '' : 's' }}</span>
              </div>
              <div class="natca-doc-viewer__toolbar-right">
                <NatcaIconButton icon="mdi-magnify-minus-outline" variant="ghost" size="sm" aria-label="Zoom out" @click="zoomOut" />
                <span class="natca-doc-viewer__zoom">{{ Math.round(scale * 100) }}%</span>
                <NatcaIconButton icon="mdi-magnify-plus-outline" variant="ghost" size="sm" aria-label="Zoom in" @click="zoomIn" />
              </div>
            </div>
            <div v-if="pdfLoading" class="natca-doc-viewer__state">
              <VProgressLinear color="primary" indeterminate />
              <p class="natca-doc-viewer__state-text">Loading PDF…</p>
            </div>
            <div v-else-if="pdfError" class="natca-doc-viewer__state natca-doc-viewer__state--error">
              <VIcon icon="mdi-alert-circle-outline" />
              <p class="natca-doc-viewer__state-text">{{ pdfError }}</p>
            </div>
            <div ref="pdfHost" class="natca-doc-viewer__pdf" :class="{ 'is-hidden': pdfLoading || pdfError }" />
          </template>
          <template v-else-if="kind === 'image'">
            <img :src="documentUrl" :alt="metadata?.title || 'Document image'" class="natca-doc-viewer__image" @load="emit('view', documentUrl)">
          </template>
          <template v-else>
            <div class="natca-doc-viewer__fallback">
              <VIcon icon="mdi-file-outline" size="40" />
              <p class="natca-doc-viewer__fallback-title">Preview not available</p>
              <p class="natca-doc-viewer__fallback-text">
                This file type can't be previewed in the browser. Download it to view.
              </p>
              <NatcaButton variant="primary" icon="mdi-download" :href="documentUrl" :download="metadata?.title || true" @click="onDownload">
                Download file
              </NatcaButton>
            </div>
          </template>
        </div>
      </div>

      <div class="natca-doc-viewer__footer">
        <slot name="footer" :document-url="documentUrl">
          <NatcaButton variant="ghost" size="sm" icon="mdi-download" :href="documentUrl" :download="metadata?.title || true" @click="onDownload">
            Download
          </NatcaButton>
          <NatcaButton variant="link" size="sm" icon="mdi-open-in-new" :href="documentUrl" target="_blank" rel="noopener">
            Open in new tab
          </NatcaButton>
        </slot>
      </div>
    </div>
  </NatcaDialog>

  <div v-else class="natca-doc-viewer natca-doc-viewer--inline">
    <div class="natca-doc-viewer__header">
      <slot name="header" :metadata="metadata" :versions="versions">
        <div class="natca-doc-viewer__meta">
          <div class="natca-doc-viewer__meta-text">
            <h3 v-if="metadata?.title" class="natca-doc-viewer__title">
              {{ metadata.title }}
            </h3>
            <p v-if="metadata?.summary" class="natca-doc-viewer__summary">
              {{ metadata.summary }}
            </p>
            <div v-if="metadata?.period || metadata?.version || lastUpdatedLabel" class="natca-doc-viewer__chips">
              <span v-if="metadata?.period" class="natca-doc-viewer__chip">{{ metadata.period }}</span>
              <span v-if="metadata?.version" class="natca-doc-viewer__chip">{{ metadata.version }}</span>
              <span v-if="lastUpdatedLabel" class="natca-doc-viewer__chip natca-doc-viewer__chip--muted">
                Updated {{ lastUpdatedLabel }}
              </span>
            </div>
          </div>
          <div v-if="(versions?.length ?? 0) > 1" class="natca-doc-viewer__version">
            <VSelect
              :model-value="currentVersion"
              :items="versionItems"
              label="Version"
              variant="outlined"
              density="compact"
              hide-details
              @update:model-value="onVersionChange"
            />
          </div>
        </div>
      </slot>
    </div>

    <div class="natca-doc-viewer__layout" :class="{ 'has-toc': hasChapters }">
      <aside v-if="hasChapters" class="natca-doc-viewer__toc" aria-label="Document contents">
        <p class="natca-doc-viewer__toc-title">Contents</p>
        <ul class="natca-doc-viewer__toc-list">
          <li
            v-for="chap in chapters"
            :key="chap.id"
            :class="{ 'is-active': chap.id === anchor }"
          >
            <button
              type="button"
              class="natca-doc-viewer__toc-link"
              @click="onChapterClick(chap.id)"
            >
              <span class="natca-doc-viewer__toc-index">{{ chap.index }}</span>
              <span class="natca-doc-viewer__toc-name">{{ chap.name }}</span>
            </button>
          </li>
        </ul>
      </aside>

      <div class="natca-doc-viewer__body">
        <template v-if="kind === 'pdf'">
          <div v-if="!pdfLoading && !pdfError && pageCount" class="natca-doc-viewer__toolbar">
            <div class="natca-doc-viewer__toolbar-left">
              <VIcon icon="mdi-file-pdf-box" size="18" />
              <span>{{ pageCount }} page{{ pageCount === 1 ? '' : 's' }}</span>
            </div>
            <div class="natca-doc-viewer__toolbar-right">
              <NatcaIconButton icon="mdi-magnify-minus-outline" variant="ghost" size="sm" aria-label="Zoom out" @click="zoomOut" />
              <span class="natca-doc-viewer__zoom">{{ Math.round(scale * 100) }}%</span>
              <NatcaIconButton icon="mdi-magnify-plus-outline" variant="ghost" size="sm" aria-label="Zoom in" @click="zoomIn" />
            </div>
          </div>
          <div v-if="pdfLoading" class="natca-doc-viewer__state">
            <VProgressLinear color="primary" indeterminate />
            <p class="natca-doc-viewer__state-text">Loading PDF…</p>
          </div>
          <div v-else-if="pdfError" class="natca-doc-viewer__state natca-doc-viewer__state--error">
            <VIcon icon="mdi-alert-circle-outline" />
            <p class="natca-doc-viewer__state-text">{{ pdfError }}</p>
          </div>
          <div ref="pdfHost" class="natca-doc-viewer__pdf" :class="{ 'is-hidden': pdfLoading || pdfError }" />
        </template>
        <template v-else-if="kind === 'image'">
          <img :src="documentUrl" :alt="metadata?.title || 'Document image'" class="natca-doc-viewer__image" @load="emit('view', documentUrl)">
        </template>
        <template v-else>
          <div class="natca-doc-viewer__fallback">
            <VIcon icon="mdi-file-outline" size="40" />
            <p class="natca-doc-viewer__fallback-title">Preview not available</p>
            <p class="natca-doc-viewer__fallback-text">
              This file type can't be previewed in the browser. Download it to view.
            </p>
            <NatcaButton variant="primary" icon="mdi-download" :href="documentUrl" :download="metadata?.title || true" @click="onDownload">
              Download file
            </NatcaButton>
          </div>
        </template>
      </div>
    </div>

    <div class="natca-doc-viewer__footer">
      <slot name="footer" :document-url="documentUrl">
        <NatcaButton variant="ghost" size="sm" icon="mdi-download" :href="documentUrl" :download="metadata?.title || true" @click="onDownload">
          Download
        </NatcaButton>
        <NatcaButton variant="link" size="sm" icon="mdi-open-in-new" :href="documentUrl" target="_blank" rel="noopener">
          Open in new tab
        </NatcaButton>
      </slot>
    </div>
  </div>
</template>

<style scoped>
.natca-doc-viewer {
  display: flex;
  flex-direction: column;
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  font-family: var(--font-body);
}

.natca-doc-viewer--lightbox {
  border: 0;
  border-radius: 0;
  max-height: 90vh;
}

/* ── Header strip ──────────────────────────────────────────────────────────── */
.natca-doc-viewer__header {
  padding: 14px 16px;
  border-bottom: 1px solid var(--color-border);
  background: var(--overlay-subtle);
}
.natca-doc-viewer__meta {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}
.natca-doc-viewer__meta-text {
  flex: 1;
  min-width: 0;
}
.natca-doc-viewer__title {
  font-family: var(--font-display);
  font-size: var(--text-md);
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
  line-height: 1.25;
}
.natca-doc-viewer__summary {
  margin: 4px 0 0;
  font-size: var(--text-sm);
  color: var(--color-text-body);
  line-height: 1.4;
}
.natca-doc-viewer__chips {
  display: flex;
  gap: 6px;
  margin-top: 8px;
  flex-wrap: wrap;
}
.natca-doc-viewer__chip {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11.5px;
  font-weight: 600;
  color: var(--color-text-primary);
  background: var(--overlay-strong);
}
.natca-doc-viewer__chip--muted {
  color: var(--color-text-muted);
  background: transparent;
  border: 1px solid var(--color-border);
}
.natca-doc-viewer__version {
  flex-shrink: 0;
  min-width: 200px;
}

/* ── Layout (TOC + body) ───────────────────────────────────────────────────── */
.natca-doc-viewer__layout {
  display: grid;
  grid-template-columns: 1fr;
  min-height: 0;
}
.natca-doc-viewer__layout.has-toc {
  grid-template-columns: 220px 1fr;
}
@media (max-width: 720px) {
  .natca-doc-viewer__layout.has-toc {
    grid-template-columns: 1fr;
  }
}

.natca-doc-viewer__toc {
  border-right: 1px solid var(--color-border);
  background: var(--color-bg-canvas);
  padding: 14px 8px;
  max-height: 70vh;
  overflow-y: auto;
}
.natca-doc-viewer__toc-title {
  margin: 0 0 6px;
  padding: 0 8px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-muted);
}
.natca-doc-viewer__toc-list {
  margin: 0;
  padding: 0;
  list-style: none;
}
.natca-doc-viewer__toc-link {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  width: 100%;
  padding: 6px 8px;
  background: transparent;
  border: 0;
  text-align: left;
  cursor: pointer;
  border-radius: var(--radius-sm);
  font-size: 13px;
  color: var(--color-text-primary);
  font-family: inherit;
}
.natca-doc-viewer__toc-link:hover {
  background: var(--overlay-subtle);
}
.natca-doc-viewer__toc-list li.is-active .natca-doc-viewer__toc-link {
  background: var(--overlay-strong);
  font-weight: 600;
}
.natca-doc-viewer__toc-index {
  flex-shrink: 0;
  font-variant-numeric: tabular-nums;
  color: var(--color-text-muted);
  font-size: 12px;
  min-width: 32px;
}
.natca-doc-viewer__toc-name {
  flex: 1;
  min-width: 0;
}

/* ── Body / toolbar ────────────────────────────────────────────────────────── */
.natca-doc-viewer__body {
  position: relative;
  background: var(--overlay-subtle);
  min-height: 320px;
  overflow: auto;
  max-height: 78vh;
}

.natca-doc-viewer__toolbar {
  position: sticky;
  top: 0;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 12px;
  background: var(--color-bg-surface);
  border-bottom: 1px solid var(--color-border);
  font-size: 12px;
  color: var(--color-text-muted);
}
.natca-doc-viewer__toolbar-left,
.natca-doc-viewer__toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}
.natca-doc-viewer__zoom {
  font-variant-numeric: tabular-nums;
  min-width: 38px;
  text-align: center;
  font-weight: 600;
}

.natca-doc-viewer__pdf {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 16px;
}
.natca-doc-viewer__pdf.is-hidden { display: none; }
:deep(.natca-doc-viewer__page) {
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
  background: white;
  max-width: 100%;
  height: auto;
}

.natca-doc-viewer__image {
  display: block;
  max-width: 100%;
  max-height: 78vh;
  margin: 0 auto;
}

.natca-doc-viewer__state,
.natca-doc-viewer__fallback {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 48px 24px;
  text-align: center;
  color: var(--color-text-muted);
}
.natca-doc-viewer__state-text {
  margin: 0;
  font-size: 13px;
}
.natca-doc-viewer__state--error {
  color: var(--color-danger);
}
.natca-doc-viewer__fallback-title {
  margin: 4px 0 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
}
.natca-doc-viewer__fallback-text {
  margin: 0 0 8px;
  font-size: 13px;
}

/* ── Footer ───────────────────────────────────────────────────────────────── */
.natca-doc-viewer__footer {
  display: flex;
  gap: 8px;
  padding: 10px 12px;
  border-top: 1px solid var(--color-border);
  background: var(--color-bg-surface);
}
</style>
