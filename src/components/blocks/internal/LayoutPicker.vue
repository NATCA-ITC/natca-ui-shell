<script setup lang="ts">
/** Preset row layouts, drawn as proportional bars. No free-form resizing. */
import type { NatcaSectionLayout } from '../../../types/blocks'

defineProps<{ modelValue: NatcaSectionLayout }>()
const emit = defineEmits<{ 'update:modelValue': [value: NatcaSectionLayout] }>()

const LAYOUTS: Array<{ value: NatcaSectionLayout; label: string; widths: number[] }> = [
  { value: 'one', label: 'One column', widths: [100] },
  { value: '50-50', label: 'Two equal columns', widths: [50, 50] },
  { value: '67-33', label: 'Wide left, narrow right', widths: [67, 33] },
  { value: '33-67', label: 'Narrow left, wide right', widths: [33, 67] },
  { value: 'thirds', label: 'Three columns', widths: [33, 33, 33] },
]
</script>

<template>
  <div class="natca-layout-picker" role="radiogroup" aria-label="Section layout">
    <button
      v-for="option in LAYOUTS"
      :key="option.value"
      type="button"
      role="radio"
      class="natca-layout-picker__option"
      :class="{ 'is-active': modelValue === option.value }"
      :aria-checked="modelValue === option.value"
      :title="option.label"
      :aria-label="option.label"
      @click="emit('update:modelValue', option.value)"
    >
      <span
        v-for="(width, i) in option.widths"
        :key="i"
        class="natca-layout-picker__bar"
        :style="{ flexBasis: `${width}%` }"
      />
    </button>
  </div>
</template>

<style scoped>
.natca-layout-picker { display: flex; gap: 4px; }

.natca-layout-picker__option {
  display: flex;
  gap: 2px;
  width: 44px;
  height: 24px;
  padding: 3px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-bg-surface);
  cursor: pointer;
  transition: border-color 120ms, background 120ms;
}

.natca-layout-picker__option:hover { border-color: var(--color-text-muted); }

.natca-layout-picker__option.is-active {
  border-color: var(--natca-red);
  background: rgba(var(--natca-red-rgb), 0.08);
}

.natca-layout-picker__bar {
  /* --color-border is a hairline token (#DDDDDD light / #2E3347 dark) —
     right for the option's own 1px outline, wrong for a bar that has to
     read as a filled shape against --color-bg-surface. Same color on both
     meant every non-active option rendered as one undifferentiated block:
     the whole point of drawing proportional bars was invisible (found
     2026-09-05, via BID's block editor in dark mode). --color-text-muted
     has real contrast against the surface in both themes. */
  background: var(--color-text-muted);
  border-radius: 1px;
  flex-grow: 1;
}

.natca-layout-picker__option.is-active .natca-layout-picker__bar { background: var(--natca-red); }
</style>
