<script setup lang="ts">
/**
 * NatcaStatCard — Single stat display with label, value, and optional change indicator.
 *
 * Matches the `.auth-stat-card` pattern from the design system.
 * Use inside a NatcaStatGrid or any flex/grid container.
 *
 * @example
 * <NatcaStatCard label="Total Members" value="19,847" change="+127 this month" />
 * <NatcaStatCard label="Sync Status" value="OK" change="Last run 4m ago" change-color="info" />
 * <NatcaStatCard label="Open rows" value="84" icon="mdi-table-alert" hint="Rows still awaiting a decision" />
 *
 * Props this component does NOT have: `color` — the only semantic colour a
 * stat card carries is `changeColor`. Anything else you bind falls through as
 * an inert HTML attribute.
 */
import { VIcon, VTooltip } from 'vuetify/components'
import { useUnknownPropsWarning } from '../composables/useUnknownPropsWarning'

// NAT-1339: dev-only warning for the props consumers keep guessing.
useUnknownPropsWarning('NatcaStatCard', {
  color: 'the only colour a stat card carries is `changeColor`',
})

withDefaults(defineProps<{
  label: string
  value: string | number
  change?: string
  changeColor?: 'success' | 'warning' | 'error' | 'info'
  /** NAT-1339: MDI icon name rendered muted at the top-right. Decorative. */
  icon?: string
  /** NAT-1339: explanatory text behind an ⓘ next to the label (hover / focus). */
  hint?: string
}>(), {
  changeColor: 'success',
})
</script>

<template>
  <div class="natca-stat-card">
    <div class="natca-stat-card__head">
      <div class="natca-stat-card__label">
        <span>{{ label }}</span>
        <VTooltip v-if="hint" location="top" :open-on-focus="true" :open-on-hover="true">
          <template #activator="{ props: tipProps }">
            <span
              v-bind="tipProps"
              class="natca-stat-card__hint"
              tabindex="0"
              role="img"
              :aria-label="hint"
            >
              <VIcon icon="mdi-information-outline" size="12" />
            </span>
          </template>
          <span class="natca-stat-card__hint-body">{{ hint }}</span>
        </VTooltip>
      </div>
      <VIcon v-if="icon" :icon="icon" size="18" class="natca-stat-card__icon" aria-hidden="true" />
    </div>
    <div class="natca-stat-card__value">{{ value }}</div>
    <div v-if="change" class="natca-stat-card__change" :class="`natca-stat-card__change--${changeColor}`">
      {{ change }}
    </div>
  </div>
</template>

<style scoped>
.natca-stat-card {
  background: var(--overlay-subtle);
  border: 1px solid var(--overlay-border);
  border-radius: 8px;
  padding: 14px;
}

.natca-stat-card__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 6px;
}

.natca-stat-card__label {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: var(--color-text-faint);
  min-width: 0;
}

.natca-stat-card__hint {
  display: inline-flex;
  color: var(--color-text-muted);
  cursor: help;
  border-radius: 50%;
}
.natca-stat-card__hint:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 1px;
}
.natca-stat-card__hint-body {
  font-size: 12px;
  text-transform: none;
  letter-spacing: normal;
}

.natca-stat-card__icon {
  color: var(--color-text-muted);
  opacity: 0.7;
  flex-shrink: 0;
  margin-top: -2px;
}

.natca-stat-card__value {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 800;
  color: var(--color-text-primary);
  line-height: 1;
}

.natca-stat-card__change {
  font-size: 11px;
  margin-top: 4px;
}

.natca-stat-card__change--success { color: var(--color-success); }
.natca-stat-card__change--warning { color: var(--color-warning); }
.natca-stat-card__change--error { color: var(--color-danger); }
.natca-stat-card__change--info { color: var(--color-info); }
</style>
