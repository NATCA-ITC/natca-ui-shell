<script setup lang="ts">
/**
 * NatcaEmptyState — Centered placeholder for empty lists, no-results, etc.
 *
 * Matches the `.auth-empty` pattern from the design system.
 * Wrap in a VCard or use standalone.
 *
 * @example
 * <NatcaEmptyState
 *   icon="mdi-file-document-outline"
 *   title="No accounts found"
 *   description="No email accounts match your current filters."
 *   action-label="Reset Filters"
 *   @action="resetFilters"
 * />
 */
import { VIcon, VBtn } from 'vuetify/components'

withDefaults(defineProps<{
  icon?: string
  title: string
  description?: string
  actionLabel?: string
}>(), {
  icon: 'mdi-file-document-outline',
})

const emit = defineEmits<{
  action: []
}>()
</script>

<template>
  <div class="natca-empty-state">
    <div class="natca-empty-state__icon">
      <VIcon :icon="icon" size="24" />
    </div>
    <div class="natca-empty-state__title">{{ title }}</div>
    <div v-if="description" class="natca-empty-state__desc">{{ description }}</div>
    <VBtn
      v-if="actionLabel"
      variant="text"
      size="small"
      @click="emit('action')"
    >
      {{ actionLabel }}
    </VBtn>
  </div>
</template>

<style scoped>
.natca-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
}

.natca-empty-state__icon {
  width: 48px;
  height: 48px;
  background: var(--overlay-subtle);
  border: 1px solid var(--overlay-border);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-faint);
  margin-bottom: 12px;
}

.natca-empty-state__title {
  font-family: var(--font-display);
  font-size: var(--text-base);
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 4px;
}

.natca-empty-state__desc {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  margin-bottom: 16px;
  max-width: 320px;
}
</style>
