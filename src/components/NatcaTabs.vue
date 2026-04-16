<script setup lang="ts">
/**
 * NatcaTabs — Wraps Vuetify v-tabs with NATCA styling and router integration.
 *
 * Two modes:
 *  1. Router tabs — each tab navigates to a route (like NatcaTabNav but inside content)
 *  2. Local tabs — v-model driven, no routing, for switching panels within a page
 *
 * Usage (router):
 *   <NatcaTabs :items="[{ id: 'overview', label: 'Overview', to: '/facility/overview' }]" />
 *
 * Usage (local):
 *   <NatcaTabs v-model="activeTab" :items="[{ id: 'details', label: 'Details' }]">
 *     <template #panel-details>...</template>
 *     <template #panel-history>...</template>
 *   </NatcaTabs>
 */
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { VTabs, VTab, VWindow, VWindowItem } from 'vuetify/components'
import type { RouteLocationRaw } from 'vue-router'

export interface NatcaTabItem {
  id: string
  label: string
  icon?: string
  to?: RouteLocationRaw
  badge?: string | number
  disabled?: boolean
}

const props = withDefaults(defineProps<{
  items: NatcaTabItem[]
  modelValue?: string
  variant?: 'default' | 'pills'
  grow?: boolean
  color?: string
  sliderColor?: string
}>(), {
  variant: 'default',
  grow: false,
  color: 'primary',
  sliderColor: 'primary',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

defineSlots<{
  [key: `panel-${string}`]: () => any
}>()

const route = useRoute()
const router = useRouter()

const isRouterMode = computed(() => props.items.some(item => item.to))

const activeTab = computed({
  get() {
    if (isRouterMode.value) {
      let best: NatcaTabItem | undefined
      for (const item of props.items) {
        if (!item.to) continue
        const resolved = typeof item.to === 'string' ? item.to : (item.to as any).path ?? ''
        if (route.path === resolved || route.path.startsWith(resolved + '/')) {
          if (!best) {
            best = item
          } else {
            const bestPath = typeof best.to === 'string' ? best.to : (best.to as any).path ?? ''
            if (resolved.length > bestPath.length) best = item
          }
        }
      }
      return best?.id ?? props.items[0]?.id
    }
    return props.modelValue ?? props.items[0]?.id
  },
  set(val: string) {
    if (isRouterMode.value) {
      const item = props.items.find(i => i.id === val)
      if (item?.to) router.push(item.to)
    }
    emit('update:modelValue', val)
  },
})

const hasPanels = computed(() => props.items.some(item => !item.to))
</script>

<template>
  <div :class="['natca-tabs-wrap', { 'natca-tabs-wrap--pills': variant === 'pills' }]">
    <VTabs
      v-model="activeTab"
      :grow="grow"
      density="compact"
      :height="32"
      :color="color"
      :slider-color="variant === 'pills' ? 'transparent' : sliderColor"
      :class="['natca-tabs', { 'natca-tabs--pills': variant === 'pills' }]"
    >
      <VTab
        v-for="item in items"
        :key="item.id"
        :value="item.id"
        :disabled="item.disabled"
        :prepend-icon="item.icon"
        density="compact"
        size="small"
        class="natca-tab"
      >
        {{ item.label }}
        <span
          v-if="item.badge != null"
          class="natca-tab-badge"
        >{{ item.badge }}</span>
      </VTab>
    </VTabs>

    <VWindow v-if="hasPanels && !isRouterMode" v-model="activeTab">
      <VWindowItem
        v-for="item in items"
        :key="item.id"
        :value="item.id"
      >
        <div class="natca-tab-panel">
          <slot :name="`panel-${item.id}`" />
        </div>
      </VWindowItem>
    </VWindow>
  </div>
</template>

<style scoped>
.natca-tabs-wrap {
  width: 100%;
}

/* ── Default underline tabs ── */

/* Strip Vuetify's built-in background so tabs sit on the parent surface,
   then add a subtle bottom border for visual separation from panel content */
.natca-tabs :deep(.v-tabs__container) {
  /* Remove any Vuetify-injected background */
}

.natca-tabs {
  border-bottom: 1px solid var(--overlay-border);
  background: transparent !important;
  position: relative;
}

/* Slider must sit at the very bottom edge of the container */
.natca-tabs :deep(.v-tabs-slider),
.natca-tabs :deep(.v-tab__slider) {
  bottom: 0;
}

/* Override Vuetify's CSS variable height so container matches actual button height */
.natca-tabs {
  --v-tabs-height: 32px !important;
}

/* Force Barlow display font, compact sizing, kill Vuetify bloat */
.natca-tabs :deep(.v-tab) {
  min-width: 0;
  padding: 0 12px;
  font-family: var(--font-display, 'Barlow', sans-serif);
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  min-height: 32px;
  height: 32px;
  color: var(--color-text-muted);
}

/* Active tab gets full primary color from Vuetify — inactive needs readable contrast */
.natca-tabs :deep(.v-tab--selected) {
  color: rgb(var(--v-theme-primary));
}

/* Ensure slide-group content aligns flush — no gap below buttons */
.natca-tabs :deep(.v-slide-group__content) {
  align-items: stretch;
}

.natca-tabs :deep(.v-tab .v-icon) {
  font-size: 13px;
  margin-inline-end: 4px;
}

/* Remove Vuetify's default button padding/margin on tab internals */
.natca-tabs :deep(.v-tab .v-btn__content) {
  gap: 4px;
}

/* Kill Vuetify's default hover overlay — we handle our own */
.natca-tabs :deep(.v-tab .v-btn__overlay) {
  display: none !important;
}

/* Badge inside tab */
.natca-tab-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 16px;
  height: 14px;
  padding: 0 4px;
  margin-left: 5px;
  background: var(--overlay-active);
  color: var(--color-text-primary);
  border-radius: 7px;
  font-family: var(--font-body, 'Public Sans', sans-serif);
  font-size: 9px;
  font-weight: 700;
  line-height: 1;
}

/* Panel below tabs */
.natca-tab-panel {
  padding: 10px 12px;
}

/* ── Pills variant ── */

/* Pills wrapper = inline, not full width */
.natca-tabs-wrap--pills {
  width: auto;
  display: inline-block;
}

.natca-tabs--pills {
  background: var(--overlay-hover) !important;
  border-radius: 5px;
  border-bottom: none;
  padding: 2px;
  display: inline-flex;
  height: auto !important;
}

/* Kill the height variable so the container shrinks to fit buttons */
.natca-tabs--pills :deep(.v-slide-group__container),
.natca-tabs--pills :deep(.v-slide-group__content) {
  align-items: center;
}

.natca-tabs--pills :deep(.v-tab) {
  font-size: 10.5px;
  padding: 0 10px;
  min-height: 22px;
  height: 22px;
  border-radius: 3px;
  color: var(--color-text-muted);
}

.natca-tabs--pills :deep(.v-tab--selected) {
  color: var(--color-text-primary);
  background: var(--overlay-active);
  border-radius: 3px;
}

/* Kill Vuetify's overlay on hover — we handle our own */
.natca-tabs--pills :deep(.v-tab .v-btn__overlay) {
  display: none !important;
}

/* Subtle hover for inactive pills */
.natca-tabs--pills :deep(.v-tab:hover) {
  background: var(--overlay-hover);
}

/* Active pill hover — slightly brighter, keep text visible */
.natca-tabs--pills :deep(.v-tab--selected:hover) {
  background: var(--overlay-active);
}

/* Kill slider on pills — selection shown by bg highlight */
.natca-tabs--pills :deep(.v-tabs-slider),
.natca-tabs--pills :deep(.v-tab__slider) {
  display: none !important;
}
</style>
