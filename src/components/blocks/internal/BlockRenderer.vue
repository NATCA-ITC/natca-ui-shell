<script setup lang="ts">
/**
 * Renders one block instance. The only place that knows about `resolve()`.
 *
 * Data-bound blocks resolve here, on the canvas, so the block component itself
 * stays a dumb renderer — the same component works with live data in BID and
 * fixture data in the playground.
 *
 * Two safety rules live here and nowhere else:
 *
 * 1. Only keys named in the definition's `propsSchema` reach the component.
 *    A stored document is author input; spreading it verbatim would let an
 *    undeclared key such as `innerHTML` fall through as a DOM attribute on the
 *    block's root element. The allow-list closes that for every block, shipped
 *    or host-registered, without asking each one to set `inheritAttrs: false`.
 * 2. A block that throws while rendering is contained to its own slot. The
 *    canvas is a shared document — one bad block must not blank the page.
 */
import { ref, shallowRef, watch, onScopeDispose, onErrorCaptured, computed } from 'vue'
import type { NatcaBlockContext, NatcaBlockInstance, NatcaBlockRegistry } from '../../../types/blocks'
import UnknownBlock from './UnknownBlock.vue'

const props = withDefaults(defineProps<{
  block: NatcaBlockInstance
  registry: NatcaBlockRegistry
  /** Passed to every resolve() as `context.scope`. ui-shell never reads inside it. */
  scope?: Record<string, unknown>
  /** Editor preview: loosens the unknown-block copy and debounces resolve(). */
  editing?: boolean
}>(), {
  scope: () => ({}),
  editing: false,
})

/** How long the editor waits after the last config keystroke before re-resolving. */
const EDITING_RESOLVE_DEBOUNCE_MS = 400

const definition = computed(() => props.registry.get(props.block.type))

/** The props the component actually receives — schema keys only (rule 1). */
const boundProps = computed<Record<string, unknown>>(() => {
  const def = definition.value
  if (!def) return {}
  const out: Record<string, unknown> = {}
  for (const field of def.propsSchema) {
    if (field.key in props.block.props) out[field.key] = props.block.props[field.key]
  }
  return out
})

const resolved = shallowRef<unknown>(undefined)
const hasResolved = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)
const renderError = ref<string | null>(null)

let controller: AbortController | null = null
let timer: ReturnType<typeof setTimeout> | null = null

async function run() {
  const def = definition.value
  if (!def?.resolve) {
    resolved.value = undefined
    hasResolved.value = false
    loading.value = false
    error.value = null
    return
  }

  controller?.abort()
  controller = new AbortController()
  const signal = controller.signal

  loading.value = true
  error.value = null

  const context: NatcaBlockContext = { scope: props.scope, signal }
  try {
    const value = await def.resolve(props.block.props as any, context)
    if (signal.aborted) return
    resolved.value = value
    hasResolved.value = true
  } catch (e: unknown) {
    if (signal.aborted) return
    // A failing data block must not take the page with it.
    error.value = e instanceof Error ? e.message : 'This section could not be loaded.'
    console.error(`[natca-blocks] resolve() failed for "${props.block.type}"`, e)
  } finally {
    if (!signal.aborted) loading.value = false
  }
}

/** In the editor every config keystroke replaces `props`; coalesce those. */
function schedule() {
  if (timer) clearTimeout(timer)
  if (!props.editing || !hasResolved.value) {
    void run()
    return
  }
  timer = setTimeout(() => { timer = null; void run() }, EDITING_RESOLVE_DEBOUNCE_MS)
}

// Deep on the block's own props (they are replaced wholesale by the config
// panel, but a host may mutate in place); by identity on scope, which can be a
// large host object that must not be walked on every trigger.
watch(() => [props.block.type, props.block.props], schedule, { immediate: true, deep: true })
watch(() => props.scope, schedule)

onScopeDispose(() => {
  controller?.abort()
  if (timer) clearTimeout(timer)
})

// Rule 2: contain a throwing block. Returning false stops propagation.
onErrorCaptured((e) => {
  renderError.value = e instanceof Error ? e.message : String(e)
  console.error(`[natca-blocks] "${props.block.type}" failed to render`, e)
  return false
})

/** Show the spinner only until the first result; after that keep stale content up. */
const showSpinner = computed(() => loading.value && !hasResolved.value)
</script>

<template>
  <UnknownBlock v-if="!definition" :type="block.type" :editing="editing" />

  <div v-else-if="renderError" class="natca-block-error" role="alert">
    This block could not be displayed.
  </div>

  <div v-else-if="showSpinner" class="natca-block-loading">
    <v-progress-circular indeterminate size="16" width="2" />
    <span>Loading…</span>
  </div>

  <div v-else-if="error" class="natca-block-error" role="alert">{{ error }}</div>

  <component
    v-else
    :is="definition.component"
    v-bind="boundProps"
    :resolved="definition.resolve ? resolved : undefined"
  />
</template>

<style scoped>
.natca-block-loading,
.natca-block-error {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  font-family: var(--font-body);
}
.natca-block-error {
  border-left: 3px solid var(--color-danger);
  background: var(--color-danger-bg);
  border-radius: var(--radius-md);
}
</style>
