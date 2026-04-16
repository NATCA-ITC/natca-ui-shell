<script setup lang="ts">
/**
 * NatcaStatGrid — Grid container for NatcaStatCard components.
 *
 * Matches the `.auth-stat-grid` pattern from the design system.
 * Default 4 columns, responsive to 2 on smaller screens.
 *
 * @example
 * <NatcaStatGrid>
 *   <NatcaStatCard label="Total" value="247" change="+3 this month" />
 *   <NatcaStatCard label="CPCs" value="182" />
 *   <NatcaStatCard label="Devs" value="41" />
 *   <NatcaStatCard label="Open Bids" value="24" />
 * </NatcaStatGrid>
 *
 * @example
 * <NatcaStatGrid :cols="2">
 *   <NatcaStatCard label="Active" value="1,198" />
 *   <NatcaStatCard label="Disabled" value="15" />
 * </NatcaStatGrid>
 */
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  cols?: 2 | 3 | 4
}>(), {
  cols: 4,
})

const style = computed(() => ({
  gridTemplateColumns: `repeat(${props.cols}, 1fr)`,
}))
</script>

<template>
  <div class="natca-stat-grid" :style="style">
    <slot />
  </div>
</template>

<style scoped>
.natca-stat-grid {
  display: grid;
  gap: 12px;
}

@media (max-width: 768px) {
  .natca-stat-grid {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}
</style>
