<script setup lang="ts">
/**
 * NatcaTabbedCard — a bordered card whose header IS a tab strip.
 *
 * The "detail page with peer sections" pattern: Settings / Subscribers /
 * Senders / Messages, each a full panel inside one card. Before this
 * component every app hand-rolled `v-card > v-toolbar > v-tabs > v-window`
 * and hand-tuned the header tint and a min-height (NAT-387) — both of which
 * are design decisions and belong here, not in app CSS.
 *
 * Relationship to the other tab components:
 *   NatcaTabNav     — shell-level, below the topbar, route-driven
 *   NatcaTabs       — in-page tab strip on the page background, no card
 *   NatcaTabbedCard — this: tabs are the card's header, panels are its body
 *
 * The strip is tinted one step darker than the panel body so it reads as
 * chrome rather than content — that separation is the whole point of the
 * pattern. `minHeight` keeps the card from reflowing its neighbours when
 * the user switches from a dense tab to a sparse one.
 *
 * @example
 * <NatcaTabbedCard v-model="tab" :tabs="[
 *   { id: 'settings',    label: 'Settings',    icon: 'mdi-cog-outline' },
 *   { id: 'subscribers', label: 'Subscribers', badge: 128 },
 * ]">
 *   <template #panel-settings>…</template>
 *   <template #panel-subscribers>…</template>
 * </NatcaTabbedCard>
 *
 * @example Data table filling the panel edge-to-edge, with a header action
 * <NatcaTabbedCard v-model="tab" :tabs="tabs" no-body-padding :min-height="480">
 *   <template #header-right>
 *     <NatcaButton variant="ghost" size="sm">Export</NatcaButton>
 *   </template>
 *   <template #panel-members><v-data-table … /></template>
 * </NatcaTabbedCard>
 */
import { computed } from 'vue'
import { VTabs, VTab, VWindow, VWindowItem } from 'vuetify/components'
import type { NatcaTabItem } from './NatcaTabs.vue'

const props = withDefaults(defineProps<{
  /** Tabs, in display order. `to` is ignored here — this card is v-model driven. */
  tabs: NatcaTabItem[]
  modelValue?: string
  /**
   * Floor for the panel area, so switching to a sparse tab doesn't collapse
   * the card and reflow whatever sits beside it. Number = px.
   * Admin pages with data tables usually want 480.
   */
  minHeight?: number | string
  /** Let panel content run to the card edge — for data tables and lists. */
  noBodyPadding?: boolean
  /** Stretch tabs to fill the strip width. */
  grow?: boolean
}>(), {
  minHeight: 320,
  noBodyPadding: false,
  grow: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

defineSlots<{
  /** One per tab id: `#panel-settings` for `{ id: 'settings' }`. */
  [key: `panel-${string}`]: () => any
  /** Right end of the tab strip — chips, an icon button, a small action. */
  'header-right'?: () => any
  /** Footer row below the panel, right-aligned. */
  actions?: () => any
}>()

const activeTab = computed({
  get: () => props.modelValue ?? props.tabs[0]?.id,
  set: (val: string) => emit('update:modelValue', val),
})

const resolvedMinHeight = computed(() =>
  typeof props.minHeight === 'number' ? `${props.minHeight}px` : props.minHeight
)
</script>

<template>
  <div class="natca-tabbed-card">
    <div class="natca-tabbed-card__strip">
      <VTabs
        v-model="activeTab"
        :grow="grow"
        density="compact"
        :height="40"
        color="primary"
        slider-color="primary"
        class="natca-tabbed-card__tabs"
      >
        <VTab
          v-for="item in tabs"
          :key="item.id"
          :value="item.id"
          :disabled="item.disabled"
          :prepend-icon="item.icon"
          density="compact"
          size="small"
        >
          {{ item.label }}
          <span
            v-if="item.badge != null"
            class="natca-tabbed-card__badge"
          >{{ item.badge }}</span>
        </VTab>
      </VTabs>

      <div v-if="$slots['header-right']" class="natca-tabbed-card__strip-right">
        <slot name="header-right" />
      </div>
    </div>

    <VWindow
      v-model="activeTab"
      class="natca-tabbed-card__window"
      :style="{ minHeight: resolvedMinHeight }"
    >
      <VWindowItem
        v-for="item in tabs"
        :key="item.id"
        :value="item.id"
      >
        <div
          class="natca-tabbed-card__panel"
          :class="{ 'natca-tabbed-card__panel--no-padding': noBodyPadding }"
        >
          <slot :name="`panel-${item.id}`" />
        </div>
      </VWindowItem>
    </VWindow>

    <div v-if="$slots.actions" class="natca-tabbed-card__actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<style scoped>
/* Layout invariants:
 *   - Strip is 40px tall and tinted with --overlay-subtle, the same token
 *     NatcaHeaderCard uses for its header, so the two read as siblings.
 *   - Panel body sits on --color-bg-surface — one step lighter than the
 *     strip in both themes.
 *   - Tab type matches NatcaTabs (13.5px Barlow 600, sentence case) so a
 *     card tab and a page tab don't look like different systems.
 */
.natca-tabbed-card {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  font-family: var(--font-body);
}

.natca-tabbed-card__strip {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--overlay-subtle);
  border-bottom: 1px solid var(--overlay-border);
  padding-right: 10px;
}

.natca-tabbed-card__tabs {
  flex: 1;
  min-width: 0;
  background: transparent !important;
  --v-tabs-height: 40px !important;
}

.natca-tabbed-card__strip-right {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.natca-tabbed-card__tabs :deep(.v-tab) {
  min-width: 0;
  padding: 0 16px;
  font-family: var(--font-display, 'Barlow', sans-serif);
  font-size: 13.5px;
  font-weight: 600;
  letter-spacing: 0.1px;
  text-transform: none;
  min-height: 40px;
  height: 40px;
  color: var(--color-text-muted);
}

.natca-tabbed-card__tabs :deep(.v-tab--selected) {
  color: rgb(var(--v-theme-primary));
  font-weight: 700;
  background: var(--color-bg-surface);
}

/* Slider sits on the strip's bottom border so the active tab reads as
   connected to the panel below it. */
.natca-tabbed-card__tabs :deep(.v-tabs-slider),
.natca-tabbed-card__tabs :deep(.v-tab__slider) {
  bottom: 0;
  height: 2px;
}

.natca-tabbed-card__tabs :deep(.v-tab .v-icon) {
  font-size: 16px;
  margin-inline-end: 6px;
}

/* Vuetify's own hover overlay fights the strip tint — we do our own. */
.natca-tabbed-card__tabs :deep(.v-tab .v-btn__overlay) {
  display: none !important;
}

.natca-tabbed-card__tabs :deep(.v-tab:hover) {
  color: var(--color-text-primary);
  background: var(--overlay-hover);
}

.natca-tabbed-card__tabs :deep(.v-tab--selected:hover) {
  background: var(--color-bg-surface);
}

.natca-tabbed-card__tabs :deep(.v-slide-group__content) {
  align-items: stretch;
}

.natca-tabbed-card__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 16px;
  padding: 0 5px;
  margin-left: 6px;
  background: var(--overlay-active);
  color: var(--color-text-primary);
  border-radius: 8px;
  font-family: var(--font-body, 'Public Sans', sans-serif);
  font-size: 10px;
  font-weight: 700;
  line-height: 1;
}

.natca-tabbed-card__tabs :deep(.v-tab--selected) .natca-tabbed-card__badge {
  background: rgb(var(--v-theme-primary));
  color: #FFFFFF;
}

.natca-tabbed-card__panel {
  padding: 14px 16px;
  font-size: var(--text-sm);
  color: var(--color-text-body);
}

.natca-tabbed-card__panel--no-padding {
  padding: 0;
}

.natca-tabbed-card__actions {
  padding: 10px 16px 14px;
  border-top: 1px solid var(--overlay-border);
  display: flex;
  gap: var(--space-2);
  justify-content: flex-end;
  align-items: center;
}
</style>
