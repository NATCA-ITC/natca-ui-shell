<script setup lang="ts">
/**
 * NatcaBlockEditor — the authoring surface for a block document.
 *
 * Everything an author can do is here: add sections, pick a preset layout, drop
 * blocks into columns, reorder them, configure the selected one. There is no
 * drag-and-drop in phase 1 — blocks move with up/down controls, which works on
 * a touch screen and needs no library.
 *
 * The editor never saves. It emits `update:document`; when and how to persist
 * is the host app's call. Save/Cancel go in the `footer` slot rather than
 * sitting beside the editor as the host's own sibling markup, so they land in
 * the same row as "Add section" instead of a second stacked row underneath it
 * (found 2026-09-05, BID's facility-home editor).
 *
 * @example
 * <NatcaBlockEditor v-model:document="draft" :registry="registry">
 *   <template #footer>
 *     <NatcaButton variant="ghost" @click="cancel">Cancel</NatcaButton>
 *     <NatcaButton variant="primary" @click="save(draft)">Save</NatcaButton>
 *   </template>
 * </NatcaBlockEditor>
 */
import { computed, ref, watch } from 'vue'
import type {
  NatcaBlockDocument,
  NatcaBlockInstance,
  NatcaBlockRegistry,
  NatcaSectionLayout,
} from '../../types/blocks'
import {
  createBlockId,
  createBlockSection,
  emptyBlockDocument,
  relayoutSection,
} from '../../lib/blockDocument'
import { provideBlockRegistry } from '../../composables/useBlockRegistry'
import BlockRenderer from './internal/BlockRenderer.vue'
import BlockConfigPanel from './internal/BlockConfigPanel.vue'
import BlockInserter from './internal/BlockInserter.vue'
import LayoutPicker from './internal/LayoutPicker.vue'
import NatcaButton from '../NatcaButton.vue'
import NatcaIconButton from '../NatcaIconButton.vue'

const props = withDefaults(defineProps<{
  document?: NatcaBlockDocument | null
  registry: NatcaBlockRegistry
  /** Handed to every data-bound block's resolve() so previews show real data. */
  scope?: Record<string, unknown>
}>(), {
  document: null,
  scope: () => ({}),
})

const emit = defineEmits<{ 'update:document': [document: NatcaBlockDocument] }>()

defineSlots<{
  /** Save/Cancel (or equivalent) — rendered right-aligned beside "Add section". */
  footer?: () => any
}>()

provideBlockRegistry(props.registry)

const doc = ref<NatcaBlockDocument>(clone(props.document) ?? emptyBlockDocument())
const selectedId = ref<string | null>(null)

function clone<T>(value: T): T {
  return value == null ? value : (JSON.parse(JSON.stringify(value)) as T)
}

// Adopt an externally replaced document (reload, discard) without clobbering
// the author mid-edit: only re-seed when the incoming value differs from ours.
// `null` is a reset — the host discarded the draft — not "leave it alone".
watch(
  () => props.document,
  (next) => {
    const incoming = next ?? emptyBlockDocument()
    if (JSON.stringify(incoming) === JSON.stringify(doc.value)) return
    doc.value = clone(incoming)
    selectedId.value = null
  },
)

function commit() {
  emit('update:document', clone(doc.value))
}

const definitions = computed(() => props.registry.list())

const selected = computed<NatcaBlockInstance | null>(() => {
  if (!selectedId.value) return null
  for (const section of doc.value.sections) {
    for (const column of section.columns) {
      const found = column.blocks.find((b) => b.id === selectedId.value)
      if (found) return found
    }
  }
  return null
})

const selectedDefinition = computed(() =>
  selected.value ? props.registry.get(selected.value.type) : undefined,
)

// ── Sections ───────────────────────────────────────────────────────────

function addSection(layout: NatcaSectionLayout = 'one') {
  doc.value.sections.push(createBlockSection(layout))
  commit()
}

function setLayout(index: number, layout: NatcaSectionLayout) {
  doc.value.sections[index] = relayoutSection(doc.value.sections[index], layout)
  commit()
}

function moveSection(index: number, delta: number) {
  const target = index + delta
  const sections = doc.value.sections
  if (target < 0 || target >= sections.length) return
  ;[sections[index], sections[target]] = [sections[target], sections[index]]
  commit()
}

function removeSection(index: number) {
  const blockCount = doc.value.sections[index].columns.reduce((n, c) => n + c.blocks.length, 0)
  if (blockCount > 0 && !window.confirm(`Delete this section and its ${blockCount} block(s)?`)) return
  doc.value.sections.splice(index, 1)
  commit()
}

// ── Blocks ─────────────────────────────────────────────────────────────

function addBlock(sectionIndex: number, columnIndex: number, type: string) {
  const definition = props.registry.get(type)
  const block: NatcaBlockInstance = {
    id: createBlockId(),
    type,
    props: clone(definition?.defaults?.() ?? {}),
  }
  doc.value.sections[sectionIndex].columns[columnIndex].blocks.push(block)
  selectedId.value = block.id
  commit()
}

function moveBlock(sectionIndex: number, columnIndex: number, blockIndex: number, delta: number) {
  const blocks = doc.value.sections[sectionIndex].columns[columnIndex].blocks
  const target = blockIndex + delta
  if (target < 0 || target >= blocks.length) return
  ;[blocks[blockIndex], blocks[target]] = [blocks[target], blocks[blockIndex]]
  commit()
}

/** Sideways move — the only way to get a block from one column into another
 *  without drag-and-drop, and the thing authors reach for first. */
function shiftBlock(sectionIndex: number, columnIndex: number, blockIndex: number, delta: number) {
  const columns = doc.value.sections[sectionIndex].columns
  const target = columnIndex + delta
  if (target < 0 || target >= columns.length) return
  const [block] = columns[columnIndex].blocks.splice(blockIndex, 1)
  columns[target].blocks.push(block)
  commit()
}

function removeBlock(sectionIndex: number, columnIndex: number, blockIndex: number) {
  const blocks = doc.value.sections[sectionIndex].columns[columnIndex].blocks
  if (blocks[blockIndex].id === selectedId.value) selectedId.value = null
  blocks.splice(blockIndex, 1)
  commit()
}

function updateSelectedProps(next: Record<string, unknown>) {
  const block = selected.value
  if (!block) return
  block.props = next
  commit()
}
</script>

<template>
  <div class="natca-block-editor" :class="{ 'natca-block-editor--with-panel': !!selected }">
    <div class="natca-block-editor__canvas">
      <section
        v-for="(section, si) in doc.sections"
        :key="section.id"
        class="natca-block-editor__section"
      >
        <header class="natca-block-editor__section-bar">
          <LayoutPicker
            :model-value="section.layout"
            @update:model-value="setLayout(si, $event)"
          />
          <span class="natca-block-editor__spacer" />
          <NatcaIconButton
            variant="ghost" size="sm" icon="mdi-arrow-up" aria-label="Move section up"
            :disabled="si === 0" @click="moveSection(si, -1)"
          />
          <NatcaIconButton
            variant="ghost" size="sm" icon="mdi-arrow-down" aria-label="Move section down"
            :disabled="si === doc.sections.length - 1" @click="moveSection(si, 1)"
          />
          <NatcaIconButton
            variant="danger" size="sm" icon="mdi-delete-outline" aria-label="Delete section"
            @click="removeSection(si)"
          />
        </header>

        <div class="natca-block-section" :class="`natca-block-section--${section.layout}`">
          <div
            v-for="(column, ci) in section.columns"
            :key="column.id"
            class="natca-block-column natca-block-editor__column"
          >
            <div
              v-for="(block, bi) in column.blocks"
              :key="block.id"
              class="natca-block-editor__block"
              :class="{ 'is-selected': block.id === selectedId }"
              @click="selectedId = block.id"
            >
              <div class="natca-block-editor__block-bar">
                <span class="natca-block-editor__block-label">
                  {{ registry.get(block.type)?.label ?? block.type }}
                </span>
                <NatcaIconButton
                  variant="ghost" size="sm" icon="mdi-cog-outline" aria-label="Block settings"
                  @click.stop="selectedId = block.id"
                />
                <NatcaIconButton
                  variant="ghost" size="sm" icon="mdi-arrow-up" aria-label="Move block up"
                  :disabled="bi === 0" @click.stop="moveBlock(si, ci, bi, -1)"
                />
                <NatcaIconButton
                  variant="ghost" size="sm" icon="mdi-arrow-down" aria-label="Move block down"
                  :disabled="bi === column.blocks.length - 1" @click.stop="moveBlock(si, ci, bi, 1)"
                />
                <NatcaIconButton
                  v-if="section.columns.length > 1"
                  variant="ghost" size="sm" icon="mdi-arrow-left" aria-label="Move block to the previous column"
                  :disabled="ci === 0" @click.stop="shiftBlock(si, ci, bi, -1)"
                />
                <NatcaIconButton
                  v-if="section.columns.length > 1"
                  variant="ghost" size="sm" icon="mdi-arrow-right" aria-label="Move block to the next column"
                  :disabled="ci === section.columns.length - 1" @click.stop="shiftBlock(si, ci, bi, 1)"
                />
                <NatcaIconButton
                  variant="danger" size="sm" icon="mdi-delete-outline" aria-label="Delete block"
                  @click.stop="removeBlock(si, ci, bi)"
                />
              </div>

              <div class="natca-block-editor__block-body">
                <BlockRenderer :block="block" :registry="registry" :scope="scope" editing />
              </div>
            </div>

            <BlockInserter :definitions="definitions" @select="addBlock(si, ci, $event)" />
          </div>
        </div>
      </section>

      <div class="natca-block-editor__add-section">
        <div class="natca-block-editor__add-section-start">
          <NatcaButton variant="secondary" size="md" @click="addSection('one')">Add section</NatcaButton>
          <span v-if="doc.sections.length === 0" class="natca-block-editor__hint">
            A section is a row. Pick how many columns it has, then add blocks to it.
          </span>
        </div>
        <div v-if="$slots.footer" class="natca-block-editor__add-section-end">
          <slot name="footer" />
        </div>
      </div>
    </div>

    <BlockConfigPanel
      v-if="selected"
      class="natca-block-editor__panel"
      :block="selected"
      :definition="selectedDefinition"
      @update:props="updateSelectedProps"
      @close="selectedId = null"
    />
  </div>
</template>

<style scoped>
.natca-block-editor {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  align-items: start;
  font-family: var(--font-body);
}

/* The config panel sits beside the canvas on a desktop and below it on a
   tablet — same stack width as the content layouts, so the editor never
   disagrees with what it is previewing. */
@media (min-width: 1100px) {
  .natca-block-editor--with-panel { grid-template-columns: minmax(0, 1fr) 340px; }
  .natca-block-editor__panel { position: sticky; top: 12px; max-height: calc(100vh - 120px); }
}

.natca-block-editor__canvas { display: flex; flex-direction: column; gap: 20px; min-width: 0; }

.natca-block-editor__section {
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-lg);
  padding: 8px;
}

.natca-block-editor__section-bar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 2px 8px;
}

.natca-block-editor__spacer { flex: 1; }

.natca-block-editor__column { gap: 8px; }

.natca-block-editor__block {
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  transition: border-color 120ms;
  cursor: pointer;
}

.natca-block-editor__block:hover { border-color: var(--color-border); }
.natca-block-editor__block.is-selected { border-color: var(--natca-red); }

.natca-block-editor__block-bar {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 2px 4px;
  border-bottom: 1px solid transparent;
  opacity: 0;
  transition: opacity 120ms;
}

.natca-block-editor__block:hover .natca-block-editor__block-bar,
.natca-block-editor__block.is-selected .natca-block-editor__block-bar {
  opacity: 1;
  border-bottom-color: var(--color-border-light);
}

.natca-block-editor__block-label {
  flex: 1;
  min-width: 0;
  font-size: var(--text-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--color-text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Previews are pictures, not controls: a same-origin link or a host block's
   button inside one would navigate away from an editor that never saves. Every
   click lands on the wrapper and selects the block instead. */
.natca-block-editor__block-body { padding: 8px; pointer-events: none; user-select: none; }

.natca-block-editor__add-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.natca-block-editor__add-section-start,
.natca-block-editor__add-section-end {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.natca-block-editor__hint { font-size: var(--text-xs); color: var(--color-text-muted); }
</style>
