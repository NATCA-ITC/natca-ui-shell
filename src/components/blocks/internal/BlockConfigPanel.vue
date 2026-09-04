<script setup lang="ts">
/**
 * The config form for the selected block, generated from its propsSchema.
 * Nothing here is block-specific — adding a block never means adding a form.
 */
import { computed } from 'vue'
import type { NatcaBlockDefinition, NatcaBlockInstance } from '../../../types/blocks'
import BlockField from './fields/BlockField.vue'
import NatcaIconButton from '../../NatcaIconButton.vue'

const props = defineProps<{
  block: NatcaBlockInstance
  definition?: NatcaBlockDefinition<any>
}>()

const emit = defineEmits<{
  'update:props': [props: Record<string, unknown>]
  close: []
}>()

const schema = computed(() => props.definition?.propsSchema ?? [])

function setField(key: string, value: unknown) {
  emit('update:props', { ...props.block.props, [key]: value })
}
</script>

<template>
  <aside class="natca-block-config">
    <header class="natca-block-config__head">
      <div class="natca-block-config__title">
        <v-icon v-if="definition" :icon="definition.icon" size="16" />
        <span>{{ definition?.label ?? block.type }}</span>
      </div>
      <NatcaIconButton variant="ghost" size="sm" icon="mdi-close" aria-label="Close settings" @click="emit('close')" />
    </header>

    <div class="natca-block-config__body">
      <p v-if="!definition" class="natca-block-config__note">
        This block type isn't registered in this app, so it can't be edited here.
      </p>
      <p v-else-if="schema.length === 0" class="natca-block-config__note">
        Nothing to configure.
      </p>

      <BlockField
        v-for="field in schema"
        :key="field.key"
        :field="field"
        :model-value="block.props[field.key]"
        @update:model-value="setField(field.key, $event)"
      />
    </div>
  </aside>
</template>

<style scoped>
.natca-block-config {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-bg-surface);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: var(--font-body);
}

.natca-block-config__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 12px;
  border-bottom: 1px solid var(--color-border-light);
  background: var(--color-shell-elevated);
}

.natca-block-config__title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--color-text-primary);
}

.natca-block-config__body {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
}

.natca-block-config__note {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  margin: 0;
}
</style>
