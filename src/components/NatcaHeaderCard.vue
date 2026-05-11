<script setup lang="ts">
/**
 * NatcaHeaderCard — Card with a navy header zone containing an icon + title/subtitle.
 *
 * Matches the `.auth-card-header` pattern from the design system exactly.
 * The header is ALWAYS navy regardless of theme (brand identity).
 * Fully native — no Vuetify dependency.
 *
 * @example
 * <NatcaHeaderCard icon="mdi-account" title="My Email Account" subtitle="jason.doss@natca.net · ZJX">
 *   <div>Card body content</div>
 *   <template #actions>
 *     <NatcaButton variant="ghost" size="md">Settings</NatcaButton>
 *     <NatcaButton variant="primary" size="md">Manage Account</NatcaButton>
 *   </template>
 * </NatcaHeaderCard>
 */
import { VIcon } from 'vuetify/components'

withDefaults(defineProps<{
  title: string
  subtitle?: string
  icon?: string
  noBodyPadding?: boolean
}>(), {
  icon: 'mdi-card-account-details',
  noBodyPadding: false,
})

defineSlots<{
  default?: () => any
  actions?: () => any
  'header-right'?: () => any
}>()
</script>

<template>
  <div class="natca-header-card">
    <div class="natca-header-card__header">
      <div class="natca-header-card__icon">
        <VIcon :icon="icon" size="18" />
      </div>
      <div class="natca-header-card__text">
        <h3 class="natca-header-card__title">{{ title }}</h3>
        <p v-if="subtitle" class="natca-header-card__subtitle">{{ subtitle }}</p>
      </div>
      <div v-if="$slots['header-right']" class="natca-header-card__header-right">
        <slot name="header-right" />
      </div>
    </div>
    <div
      v-if="$slots.default"
      class="natca-header-card__body"
      :class="{ 'natca-header-card__body--no-padding': noBodyPadding }"
    >
      <slot />
    </div>
    <div v-if="$slots.actions" class="natca-header-card__actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<style scoped>
/* NatcaHeaderCard — branded feature card.
 *   • Top border: 4px navy (matches accent-card pattern, stamps the brand)
 *   • Header zone: a tinted strip — slightly darker than the card body in
 *     dark theme, slightly lighter in light theme. Reads as a banded
 *     "header" without screaming navy through the whole strip.
 *   • Icon: navy-tinted square so the brand color still anchors the card.
 *   • Title/subtitle: theme-aware text (no more white-on-navy).
 */
.natca-header-card {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-top: 4px solid var(--natca-navy);
  border-radius: var(--radius-lg);
  overflow: hidden;
  font-family: var(--font-body);
}

.natca-header-card__header {
  background: var(--overlay-subtle);
  border-bottom: 1px solid var(--overlay-border);
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.natca-header-card__icon {
  width: 36px;
  height: 36px;
  background: rgba(var(--natca-blue-rgb), 0.10);
  border: 1px solid rgba(var(--natca-blue-rgb), 0.18);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--natca-navy);
  flex-shrink: 0;
}

[data-theme="dark"] .natca-header-card__icon,
.v-theme--natcaDark .natca-header-card__icon {
  background: rgba(var(--natca-red-rgb), 0.14);
  border-color: rgba(var(--natca-red-rgb), 0.30);
  color: var(--natca-red);
}

.natca-header-card__text {
  flex: 1;
  min-width: 0;
}

.natca-header-card__title {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1.2;
  margin: 0;
}

.natca-header-card__subtitle {
  font-size: 12px;
  color: var(--color-text-muted);
  margin: 2px 0 0;
  line-height: 1.3;
}

.natca-header-card__header-right {
  flex-shrink: 0;
}

.natca-header-card__body {
  padding: 14px 16px;
  font-size: var(--text-sm);
  color: var(--color-text-body);
}

.natca-header-card__body--no-padding {
  padding: 0;
}

.natca-header-card__actions {
  padding: 10px 16px 14px;
  display: flex;
  gap: var(--space-2);
  justify-content: flex-end;
  align-items: center;
}
</style>
