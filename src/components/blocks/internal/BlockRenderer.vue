<script setup lang="ts">
/**
 * Renders one block instance. The only place that knows about `resolve()`.
 *
 * Data-bound blocks resolve here, on the canvas, so the block component itself
 * stays a dumb renderer — the same component works with live data in BID and
 * fixture data in the playground.
 */
import { ref, shallowRef, watch, onScopeDispose, computed } from 'vue'
import type { NatcaBlockContext, NatcaBlockInstance, NatcaBlockRegistry } from '../../../types/blocks'
import UnknownBlock from './UnknownBlock.vue'

const props = withDefaults(defineProps<{
  block: NatcaBlockInstance
  registry: NatcaBlockRegistry
  /** Passed to every resolve() as `context.scope`. ui-shell never reads inside it. */
  scope?: Record<string, unknown>
  /** Loosens the unknown-block copy for authors. */
  editing?: boolean
}>(), {
  scope: () => ({}),
  editing: false,
})

const definition = computed(() => props.registry.get(props.block.type))

const resolved = shallowRef<unknown>(undefined)
const loading = ref(false)
const error = ref<string | null>(null)

let controller: AbortController | null = null

async function run() {
  const def = definition.value
  if (!def?.resolve) {
    resolved.value = undefined
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
  } catch (e: unknown) {
    if (signal.aborted) return
    // A failing data block must not take the page with it.
    error.value = e instanceof Error ? e.message : 'This section could not be loaded.'
    console.error(`[natca-blocks] resolve() failed for "${props.block.type}"`, e)
  } finally {
    if (!signal.aborted) loading.value = false
  }
}

watch(
  () => [props.block.type, props.block.props, props.scope],
  run,
  { immediate: true, deep: true },
)

onScopeDispose(() => controller?.abort())
</script>

<template>
  <UnknownBlock v-if="!definition" :type="block.type" :editing="editing" />

  <div v-else-if="loading" class="natca-block-loading">
    <v-progress-circular indeterminate size="16" width="2" />
    <span>Loading…</span>
  </div>

  <div v-else-if="error" class="natca-block-error">{{ error }}</div>

  <component
    v-else
    :is="definition.component"
    v-bind="block.props"
    v-bind:resolved="definition.resolve ? resolved : undefined"
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
