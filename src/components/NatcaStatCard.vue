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
 */
withDefaults(defineProps<{
  label: string
  value: string | number
  change?: string
  changeColor?: 'success' | 'warning' | 'error' | 'info'
}>(), {
  changeColor: 'success',
})
</script>

<template>
  <div class="natca-stat-card">
    <div class="natca-stat-card__label">{{ label }}</div>
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

.natca-stat-card__label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: var(--color-text-faint);
  margin-bottom: 6px;
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
