<script setup lang="ts">
/**
 * NatcaBlockCanvas — read-only renderer for a block document.
 *
 * This is what members see. It has no authoring UI and imports no editor: a
 * page that only ever displays content pays nothing for the editing surface,
 * and TipTap is never pulled in on the read path.
 *
 * @example
 * <NatcaBlockCanvas
 *   :document="page.layout"
 *   :registry="registry"
 *   :scope="{ facilityId, bidYear }"
 * />
 */
import { computed } from 'vue'
import type { NatcaBlockDocument, NatcaBlockRegistry } from '../../types/blocks'
import { provideBlockRegistry } from '../../composables/useBlockRegistry'
import BlockRenderer from './internal/BlockRenderer.vue'

const props = withDefaults(defineProps<{
  document?: NatcaBlockDocument | null
  registry: NatcaBlockRegistry
  /** Handed to every data-bound block's resolve(). Opaque to ui-shell. */
  scope?: Record<string, unknown>
  /** Shown when the document has no blocks at all. */
  emptyText?: string
}>(), {
  document: null,
  scope: () => ({}),
  emptyText: '',
})

provideBlockRegistry(props.registry)

const sections = computed(() => props.document?.sections ?? [])
const isEmpty = computed(() =>
  sections.value.every((s) => s.columns.every((c) => c.blocks.length === 0)),
)
</script>

<template>
  <div class="natca-block-doc">
    <p v-if="isEmpty && emptyText" class="natca-block-doc__empty">{{ emptyText }}</p>

    <section
      v-for="section in sections"
      :key="section.id"
      class="natca-block-section"
      :class="`natca-block-section--${section.layout}`"
    >
      <div v-for="column in section.columns" :key="column.id" class="natca-block-column">
        <BlockRenderer
          v-for="block in column.blocks"
          :key="block.id"
          :block="block"
          :registry="registry"
          :scope="scope"
        />
      </div>
    </section>
  </div>
</template>

<style scoped>
.natca-block-doc__empty {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  font-family: var(--font-body);
  margin: 0;
}
</style>
