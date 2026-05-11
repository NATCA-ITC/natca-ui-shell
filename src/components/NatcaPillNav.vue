<script setup lang="ts">
/**
 * NatcaPillNav — Native Vue pill toggle group matching the design system exactly.
 *
 * Replaces VBtnToggle for the `.auth-pills` pattern. Inline pill container with
 * active state showing a raised pill on subtle background.
 *
 * @example
 * <NatcaPillNav
 *   v-model="filter"
 *   :items="[
 *     { value: 'all', label: 'All' },
 *     { value: 'active', label: 'Active' },
 *     { value: 'pending', label: 'Pending' },
 *   ]"
 * />
 */
export interface NatcaPillItem {
  value: string | number
  label: string
}

const props = defineProps<{
  modelValue: string | number
  items: NatcaPillItem[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

function select(value: string | number) {
  emit('update:modelValue', value)
}
</script>

<template>
  <div class="natca-pills" role="tablist">
    <button
      v-for="item in items"
      :key="item.value"
      type="button"
      role="tab"
      class="natca-pill"
      :class="{ 'natca-pill--active': item.value === modelValue }"
      :aria-selected="item.value === modelValue"
      @click="select(item.value)"
    >
      {{ item.label }}
    </button>
  </div>
</template>

<style scoped>
.natca-pills {
  display: inline-flex;
  gap: 2px;
  background: var(--overlay-hover);
  border: 1px solid var(--overlay-border);
  border-radius: var(--radius-full);
  padding: 3px;
}

.natca-pill {
  display: flex;
  align-items: center;
  padding: 4px 14px;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-muted);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all 150ms;
  background: none;
  border: none;
  font-family: var(--font-body);
  white-space: nowrap;
}

.natca-pill:hover {
  color: var(--color-text-primary);
  background: var(--overlay-subtle);
}

/* Active pill — navy in light theme, red in dark theme. Always white text. */
.natca-pill--active,
.natca-pill--active:hover {
  background: var(--natca-navy);
  color: #FFFFFF;
  box-shadow: var(--shadow-sm);
}

[data-theme="dark"] .natca-pill--active,
[data-theme="dark"] .natca-pill--active:hover,
.v-theme--natcaDark .natca-pill--active,
.v-theme--natcaDark .natca-pill--active:hover {
  background: var(--natca-red);
  color: #FFFFFF;
}
</style>
