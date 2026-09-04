<script setup lang="ts">
/**
 * Rich-text editing surface — the only place in ui-shell that touches TipTap.
 *
 * TipTap is an OPTIONAL peer dependency, imported dynamically with
 * `@vite-ignore` so a consuming app that never registers a rich-text block
 * neither bundles it nor fails to resolve it at build time. This is the
 * pdfjs-dist arrangement from NatcaDocumentViewer, for the same reason.
 *
 * Only @tiptap/core and @tiptap/starter-kit are needed — the editor mounts onto
 * a plain element, so @tiptap/vue-3 is not a dependency either. StarterKit v3
 * already bundles Underline and Link; registering Underline separately raises
 * a duplicate-extension warning, so it is deliberately not imported.
 *
 * The HTML this produces is NOT trusted. The host app sanitizes on write.
 */
import { ref, shallowRef, onMounted, onBeforeUnmount, watch } from 'vue'
import NatcaAlert from '../../../NatcaAlert.vue'
import NatcaIconButton from '../../../NatcaIconButton.vue'

const props = withDefaults(defineProps<{
  modelValue?: string
  label?: string
  help?: string
}>(), {
  modelValue: '',
  label: 'Content',
})

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const host = ref<HTMLElement | null>(null)
const editor = shallowRef<any>(null)
const unavailable = ref(false)
/** Bumped on every transaction so the toolbar's active states re-evaluate. */
const revision = ref(0)

onMounted(async () => {
  let Editor: any, StarterKit: any
  try {
    const [core, starter] = await Promise.all([
      import(/* @vite-ignore */ '@tiptap/core'),
      import(/* @vite-ignore */ '@tiptap/starter-kit'),
    ])
    Editor = core.Editor
    StarterKit = starter.default ?? starter.StarterKit
  } catch (e) {
    // Not installed. Say so plainly rather than silently degrading to a
    // textarea that would mangle the stored markup.
    unavailable.value = true
    console.warn('[natca-blocks] rich text editing needs @tiptap/core and @tiptap/starter-kit', e)
    return
  }

  if (!host.value) return

  editor.value = new Editor({
    element: host.value,
    content: props.modelValue || '',
    extensions: [
      StarterKit.configure({ link: { openOnClick: false, defaultProtocol: 'https' } }),
    ],
    onUpdate: ({ editor: e }: any) => {
      const html = e.getHTML()
      emit('update:modelValue', html === '<p></p>' ? '' : html)
    },
    onTransaction: () => { revision.value++ },
  })
})

// External replacement (block switched, document reloaded) — never echo our own
// emit back into the editor, or the caret jumps to the end on every keystroke.
watch(() => props.modelValue, (next) => {
  const e = editor.value
  if (!e) return
  const current = e.getHTML()
  if (next === current || (!next && current === '<p></p>')) return
  e.commands.setContent(next || '', { emitUpdate: false })
})

onBeforeUnmount(() => editor.value?.destroy())

function run(fn: (chain: any) => any) {
  const e = editor.value
  if (!e) return
  fn(e.chain().focus()).run()
}

function isActive(name: string, attrs?: Record<string, unknown>): boolean {
  void revision.value
  return !!editor.value?.isActive(name, attrs)
}

function toggleLink() {
  const e = editor.value
  if (!e) return
  if (e.isActive('link')) {
    e.chain().focus().unsetLink().run()
    return
  }
  const url = window.prompt('Link URL')
  if (!url) return
  const href = /^(https?:|mailto:|tel:)/i.test(url) ? url : `https://${url}`
  e.chain().focus().extendMarkRange('link').setLink({ href }).run()
}
</script>

<template>
  <div class="natca-richtext-field">
    <p v-if="label" class="natca-richtext-field__label">{{ label }}</p>

    <NatcaAlert v-if="unavailable" type="warning">
      <div>
        <strong>Rich text editor unavailable.</strong>
        This app hasn't installed <code>@tiptap/core</code> and
        <code>@tiptap/starter-kit</code>. Existing content is unchanged.
      </div>
    </NatcaAlert>

    <template v-else>
      <div class="natca-richtext-field__toolbar">
        <NatcaIconButton
          variant="ghost" size="sm" icon="mdi-format-bold" aria-label="Bold"
          :class="{ 'is-active': isActive('bold') }" @click="run(c => c.toggleBold())"
        />
        <NatcaIconButton
          variant="ghost" size="sm" icon="mdi-format-italic" aria-label="Italic"
          :class="{ 'is-active': isActive('italic') }" @click="run(c => c.toggleItalic())"
        />
        <NatcaIconButton
          variant="ghost" size="sm" icon="mdi-format-underline" aria-label="Underline"
          :class="{ 'is-active': isActive('underline') }" @click="run(c => c.toggleUnderline())"
        />
        <span class="natca-richtext-field__divider" />
        <NatcaIconButton
          variant="ghost" size="sm" icon="mdi-format-header-2" aria-label="Heading"
          :class="{ 'is-active': isActive('heading', { level: 2 }) }"
          @click="run(c => c.toggleHeading({ level: 2 }))"
        />
        <NatcaIconButton
          variant="ghost" size="sm" icon="mdi-format-list-bulleted" aria-label="Bulleted list"
          :class="{ 'is-active': isActive('bulletList') }" @click="run(c => c.toggleBulletList())"
        />
        <NatcaIconButton
          variant="ghost" size="sm" icon="mdi-format-list-numbered" aria-label="Numbered list"
          :class="{ 'is-active': isActive('orderedList') }" @click="run(c => c.toggleOrderedList())"
        />
        <span class="natca-richtext-field__divider" />
        <NatcaIconButton
          variant="ghost" size="sm" icon="mdi-link-variant" aria-label="Link"
          :class="{ 'is-active': isActive('link') }" @click="toggleLink"
        />
        <NatcaIconButton
          variant="ghost" size="sm" icon="mdi-format-clear" aria-label="Clear formatting"
          @click="run(c => c.unsetAllMarks().clearNodes())"
        />
      </div>

      <div ref="host" class="natca-richtext-field__surface" />
    </template>

    <p v-if="help" class="natca-richtext-field__help">{{ help }}</p>
  </div>
</template>

<style scoped>
.natca-richtext-field { display: flex; flex-direction: column; gap: 6px; }

.natca-richtext-field__label {
  font-size: var(--text-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--color-text-muted);
  margin: 0;
}

.natca-richtext-field__toolbar {
  display: flex;
  align-items: center;
  gap: 2px;
  flex-wrap: wrap;
  padding: 4px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md) var(--radius-md) 0 0;
  border-bottom: 0;
  background: var(--color-shell-elevated);
}

.natca-richtext-field__toolbar :deep(.is-active) {
  background: rgba(var(--natca-red-rgb), 0.12);
  color: var(--natca-red);
}

.natca-richtext-field__divider {
  width: 1px;
  align-self: stretch;
  margin: 2px 4px;
  background: var(--color-border);
}

.natca-richtext-field__surface {
  border: 1px solid var(--color-border);
  border-radius: 0 0 var(--radius-md) var(--radius-md);
  background: var(--color-bg-surface);
  padding: 10px 12px;
  min-height: 140px;
  font-size: var(--text-sm);
  line-height: 1.6;
  color: var(--color-text-body);
  font-family: var(--font-body);
}

.natca-richtext-field__surface :deep(.ProseMirror) { outline: none; min-height: 120px; }
.natca-richtext-field__surface :deep(p) { margin: 0 0 10px; }
.natca-richtext-field__surface :deep(h2) { font-family: var(--font-display); font-size: var(--text-md); margin: 14px 0 8px; }
.natca-richtext-field__surface :deep(ul),
.natca-richtext-field__surface :deep(ol) { margin: 0 0 10px; padding-left: 20px; }
.natca-richtext-field__surface :deep(a) { color: var(--natca-red); text-decoration: underline; }

.natca-richtext-field__help {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  margin: 0;
}
</style>
