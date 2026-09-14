<script setup lang="ts">
/**
 * NatcaStepper — numbered step strip for non-linear wizards (NAT-1338).
 *
 * This is deliberately NOT a Vuetify `v-stepper-header`: that chrome was
 * rejected for the Employer Data wizard (2026-09-13) as oversized and
 * marketing-styled. What survived review was `NatcaTabs` with a badge per
 * step, so this component is that strip — same 40px underline tabs — plus
 * a step marker (number, or ✓ when `done`) and a *toned* badge that can
 * carry a count or a state word (`59`, `ready`, `blocked`, `posted`).
 *
 * Header only. Step content is page-specific; pass it via `#panel-<id>`
 * slots (rendered in a `VWindow`, like `NatcaTabs`) or render it yourself
 * below the strip.
 *
 * States per step:
 *  • `done`     — marker shows a check; label muted unless active.
 *  • `blocked`  — still NAVIGABLE (the operator must be able to open the
 *                 step and see why the gate is closed). Marker gets a
 *                 warning ring; pair it with `badge: 'blocked', tone: 'warning'`.
 *  • `disabled` — not navigable. Use sparingly; prefer `blocked`.
 * Steps are non-linear: any step can be selected in any order.
 *
 * @example
 * <NatcaStepper v-model="step" :steps="[
 *   { id: 'roadmap',    label: 'Roadmap',             badge: 59 },
 *   { id: 'exceptions', label: 'Pay-file exceptions', badge: 34 },
 *   { id: 'review',     label: 'Review batch',        done: true },
 *   { id: 'post',       label: 'Post batch',          badge: 'blocked', tone: 'warning', blocked: true },
 * ]">
 *   <template #panel-roadmap>…</template>
 * </NatcaStepper>
 */
import { computed, useSlots } from 'vue'
import { VIcon, VTab, VTabs, VWindow, VWindowItem } from 'vuetify/components'

export type NatcaStepTone = 'neutral' | 'success' | 'warning' | 'error' | 'info'

export interface NatcaStep {
  id: string
  label: string
  /** Count or state word shown after the label. Pre-format numbers yourself. */
  badge?: number | string
  /** Badge colour. Default `neutral` (primary-filled while the step is active). */
  tone?: NatcaStepTone
  /** Marker shows ✓ instead of the step number. */
  done?: boolean
  /** Visibly gated but still navigable. Warning ring on the marker. */
  blocked?: boolean
  /** Not navigable. Prefer `blocked`. */
  disabled?: boolean
}

const props = withDefaults(defineProps<{
  steps: NatcaStep[]
  /** Active step id (v-model). Defaults to the first step. */
  modelValue?: string
  /** Show the 1..N marker before each label. */
  numbered?: boolean
  grow?: boolean
}>(), {
  numbered: true,
  grow: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

defineSlots<{
  [key: `panel-${string}`]: () => any
}>()

const slots = useSlots()
const hasPanels = computed(() => props.steps.some(s => !!slots[`panel-${s.id}`]))

const active = computed({
  get: () => props.modelValue ?? props.steps[0]?.id,
  set: (id: string) => emit('update:modelValue', id),
})
</script>

<template>
  <div class="natca-stepper-wrap">
    <VTabs
      v-model="active"
      :grow="grow"
      density="compact"
      :height="40"
      color=""
      slider-color="primary"
      class="natca-stepper"
    >
      <VTab
        v-for="(step, i) in steps"
        :key="step.id"
        :value="step.id"
        :disabled="step.disabled"
        density="compact"
        size="small"
        class="natca-step"
        :class="{ 'natca-step--done': step.done, 'natca-step--blocked': step.blocked }"
        :aria-current="active === step.id ? 'step' : undefined"
      >
        <span v-if="numbered" class="natca-step__marker" aria-hidden="true">
          <VIcon v-if="step.done" icon="mdi-check" size="12" />
          <template v-else>{{ i + 1 }}</template>
        </span>
        <span class="natca-step__label">{{ step.label }}</span>
        <span
          v-if="step.badge != null"
          class="natca-step__badge"
          :class="`natca-step__badge--${step.tone ?? 'neutral'}`"
        >{{ step.badge }}</span>
      </VTab>
    </VTabs>

    <VWindow v-if="hasPanels" v-model="active">
      <VWindowItem v-for="step in steps" :key="step.id" :value="step.id">
        <div class="natca-step-panel">
          <slot :name="`panel-${step.id}`" />
        </div>
      </VWindowItem>
    </VWindow>
  </div>
</template>

<style scoped>
.natca-stepper-wrap {
  width: 100%;
}

/* Same strip as NatcaTabs' default variant — keep these in step with it. */
.natca-stepper {
  --v-tabs-height: 40px !important;
  border-bottom: 1px solid var(--overlay-border);
  background: transparent !important;
  position: relative;
}
.natca-stepper :deep(.v-tabs-slider),
.natca-stepper :deep(.v-tab__slider) {
  bottom: 0;
  height: 2px;
}
.natca-stepper :deep(.v-slide-group__content) {
  align-items: stretch;
}
.natca-stepper :deep(.v-tab .v-btn__overlay) {
  display: none !important;
}
.natca-stepper :deep(.v-tab .v-btn__content) {
  gap: 6px;
}

.natca-stepper :deep(.v-tab) {
  min-width: 0;
  padding: 0 14px;
  font-family: var(--font-display, 'Barlow', sans-serif);
  font-size: 13.5px;
  font-weight: 600;
  letter-spacing: 0.1px;
  text-transform: none;
  min-height: 40px;
  height: 40px;
  color: var(--color-text-muted);
}
/* Active step: primary (navy light / red dark). `color=""` on VTabs keeps
   Vuetify's `text-primary` utility off the tab so this rule is the only
   source of truth (see NAT-1346 for why that matters). */
.natca-stepper :deep(.v-tab--selected) {
  color: rgb(var(--v-theme-primary));
  font-weight: 700;
}

/* ── Marker ── */
.natca-step__marker {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1px solid currentColor;
  font-family: var(--font-body, 'Public Sans', sans-serif);
  font-size: 10px;
  font-weight: 700;
  line-height: 1;
  flex-shrink: 0;
}
.natca-stepper :deep(.v-tab--selected) .natca-step__marker {
  background: rgb(var(--v-theme-primary));
  border-color: rgb(var(--v-theme-primary));
  color: #FFFFFF;
}
.natca-step--done .natca-step__marker {
  background: rgba(var(--v-theme-success), 0.18);
  border-color: rgb(var(--v-theme-success));
  color: rgb(var(--v-theme-success));
}
.natca-stepper :deep(.v-tab--selected.natca-step--done) .natca-step__marker {
  background: rgb(var(--v-theme-success));
  border-color: rgb(var(--v-theme-success));
  color: #FFFFFF;
}
.natca-step--blocked .natca-step__marker {
  border-color: rgb(var(--v-theme-warning));
  box-shadow: 0 0 0 2px rgba(var(--v-theme-warning), 0.25);
}

/* ── Badge — same footprint as NatcaTabs' badge, plus tones ── */
.natca-step__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 16px;
  padding: 0 6px;
  border-radius: 8px;
  font-family: var(--font-body, 'Public Sans', sans-serif);
  font-size: 10px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0.2px;
}
.natca-step__badge--neutral {
  background: var(--overlay-active);
  color: var(--color-text-primary);
}
.natca-stepper :deep(.v-tab--selected) .natca-step__badge--neutral {
  background: rgb(var(--v-theme-primary));
  color: #FFFFFF;
}
.natca-step__badge--success { background: rgba(var(--v-theme-success), 0.18); color: rgb(var(--v-theme-success)); }
.natca-step__badge--warning { background: rgba(var(--v-theme-warning), 0.18); color: rgb(var(--v-theme-warning)); }
.natca-step__badge--error   { background: rgba(var(--v-theme-error),   0.18); color: rgb(var(--v-theme-error)); }
.natca-step__badge--info    { background: rgba(var(--v-theme-info),    0.18); color: rgb(var(--v-theme-info)); }

.natca-step-panel {
  padding: 14px 16px;
  font-size: var(--text-sm);
  color: var(--color-text-body);
}
</style>
