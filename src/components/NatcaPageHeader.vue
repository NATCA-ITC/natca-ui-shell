<script setup lang="ts">
/**
 * NatcaPageHeader — Page title + subtitle + actions row.
 *
 * Matches the content area header pattern from the design system shell preview.
 *
 * @example
 * <NatcaPageHeader title="Member Accounts" subtitle="1,247 accounts across all facilities">
 *   <template #actions>
 *     <v-btn color="primary">Create Account</v-btn>
 *   </template>
 * </NatcaPageHeader>
 */
defineProps<{
  title: string
  subtitle?: string
}>()

defineSlots<{
  actions?: () => any
}>()
</script>

<template>
  <div class="natca-page-header">
    <div class="natca-page-header__text">
      <h2 class="natca-page-header__title">{{ title }}</h2>
      <p v-if="subtitle" class="natca-page-header__subtitle">{{ subtitle }}</p>
    </div>
    <div v-if="$slots.actions" class="natca-page-header__actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<style scoped>
.natca-page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  gap: 16px;
}

.natca-page-header__title {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1.2;
}

.natca-page-header__subtitle {
  font-size: 12px;
  color: var(--color-text-faint);
  margin-top: 2px;
}

.natca-page-header__actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}
</style>
