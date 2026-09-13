<script setup lang="ts">
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { useShellState } from '../composables/useShellState'
import type { NatcaNavSection, NatcaNavItem } from '../types'

const props = defineProps<{
  sections: NatcaNavSection[]
}>()

defineSlots<{
  footer?: () => any
}>()

const route = useRoute()

// NAT-1340: `id` is required by the NatcaNavItem type, but a plain-JS or
// `as`-cast consumer can omit it and nothing fails loudly. Say so once.
watch(() => props.sections, sections => {
  const missing = sections.flatMap(s => s.items).filter(i => !i.id)
  if (missing.length && typeof console !== 'undefined') {
    console.warn(
      `[NatcaSidebar] ${missing.length} nav item(s) have no \`id\` (${missing.map(i => JSON.stringify(i.label)).join(', ')}). ` +
      '`id` is required by NatcaNavItem and is used as the render key.',
    )
  }
}, { immediate: true })
const { state, toggleSidebar } = useShellState()

function isActive(item: NatcaNavItem): boolean {
  if (!item.to) return false
  const resolved = typeof item.to === 'string' ? item.to : (item.to as any).path ?? ''
  if (route.path === resolved) return true
  if (!route.path.startsWith(resolved + '/')) return false
  // Only match if this is the longest matching prefix among all nav items
  const allItems = props.sections.flatMap(s => s.items)
  return !allItems.some(other => {
    // NAT-1340: skip *this* item by reference, not by id — with id-less items
    // `undefined === undefined` skipped every other item and the shortest
    // prefix (e.g. `/admin` Overview) lit on every nested route.
    if (other === item || !other.to) return false
    const otherPath = typeof other.to === 'string' ? other.to : (other.to as any).path ?? ''
    return otherPath.length > resolved.length && (route.path.startsWith(otherPath + '/') || route.path === otherPath)
  })
}
</script>

<template>
  <aside class="natca-shell-sidebar">
    <div class="natca-shell-sidebar-inner">
      <template v-for="section in sections" :key="section.title">
        <div class="natca-shell-sec-title">{{ section.title }}</div>
        <router-link
          v-for="item in section.items"
          :key="item.id"
          :to="item.to ?? '#'"
          class="natca-shell-nav-link"
          :class="{ 'natca-shell-active': isActive(item) }"
        >
          <span class="natca-shell-nav-icon">
            <v-icon v-if="item.icon" :icon="item.icon" size="18" />
          </span>
          <span class="natca-shell-nav-label">{{ item.label }}</span>
          <span v-if="item.badge != null" class="natca-shell-nav-badge">
            {{ item.badge }}
          </span>
        </router-link>
      </template>
    </div>

    <!-- Footer slot -->
    <div v-if="$slots.footer" class="natca-shell-sidebar-foot">
      <slot name="footer" />
    </div>

    <!-- Collapse toggle -->
    <button
      class="natca-shell-sidebar-toggle"
      type="button"
      aria-label="Collapse sidebar"
      @click="toggleSidebar"
    >
      <svg
        class="natca-shell-toggle-icon"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </button>
  </aside>
</template>
