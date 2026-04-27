<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useNatcaTheme } from '../composables/useNatcaTheme'
import type { NatcaTab } from '../types'

const props = defineProps<{
  tabs: NatcaTab[]
}>()

const route = useRoute()
const { resolved: resolvedTheme } = useNatcaTheme()

// ── Refs ──
const containerRef = ref<HTMLElement | null>(null)
const dropdownRef = ref<HTMLElement | null>(null)
const moreButtonRef = ref<HTMLElement | null>(null)
const switcherButtonRefs = ref<Record<string, HTMLElement | null>>({})
const switcherDropdownRef = ref<HTMLElement | null>(null)

// ── State ──
const overflowStartIndex = ref(Infinity)
const collapsedSet = ref(new Set<string>())
const moreOpen = ref(false)
const openSwitcherId = ref<string | null>(null)

// ── Helpers ──
function shouldCollapseToIcon(tab: NatcaTab): boolean {
  if (!tab.icon) return false
  if (tab.collapseToIcon) return true
  if (tab.id === 'home') return true
  return false
}

function isSwitcher(tab: NatcaTab): boolean {
  return Array.isArray(tab.children) && tab.children.length > 0
}

function tabPath(tab: NatcaTab): string {
  return typeof tab.to === 'string' ? tab.to : (tab.to as any).path ?? ''
}

const visibleTabs = computed(() =>
  overflowStartIndex.value >= props.tabs.length
    ? props.tabs
    : props.tabs.slice(0, overflowStartIndex.value)
)
const overflowTabs = computed(() =>
  overflowStartIndex.value >= props.tabs.length
    ? []
    : props.tabs.slice(overflowStartIndex.value)
)
const hasOverflow = computed(() => overflowTabs.value.length > 0)

// Flat list of every navigable tab (top-level + every child) — used for longest-prefix
// active detection so a child route doesn't accidentally activate its parent's `to`.
const allLeafTabs = computed<NatcaTab[]>(() => {
  const out: NatcaTab[] = []
  for (const t of props.tabs) {
    out.push(t)
    if (isSwitcher(t)) out.push(...(t.children as NatcaTab[]))
  }
  return out
})

// ── Active detection (longest prefix match) ──
function isPathActive(path: string): boolean {
  if (!path) return false
  if (route.path === path) return true
  if (!route.path.startsWith(path + '/')) return false
  // Don't activate when a longer sibling/child path is the better match.
  return !allLeafTabs.value.some(other => {
    const otherPath = tabPath(other)
    if (otherPath === path) return false
    return otherPath.length > path.length
      && (route.path === otherPath || route.path.startsWith(otherPath + '/'))
  })
}

function activeChild(tab: NatcaTab): NatcaTab | null {
  if (!isSwitcher(tab)) return null
  // Pick the longest-matching child path so deeper children win.
  let best: NatcaTab | null = null
  let bestLen = -1
  for (const child of tab.children as NatcaTab[]) {
    const p = tabPath(child)
    if (route.path === p || route.path.startsWith(p + '/')) {
      if (p.length > bestLen) {
        best = child
        bestLen = p.length
      }
    }
  }
  return best
}

function isActive(tab: NatcaTab): boolean {
  if (isSwitcher(tab)) {
    if (activeChild(tab)) return true
    return isPathActive(tabPath(tab))
  }
  return isPathActive(tabPath(tab))
}

const overflowHasActive = computed(() => overflowTabs.value.some(t => isActive(t)))

// Position dropdowns below their button (since they're teleported to body)
function dropdownPosition(btn: HTMLElement | null) {
  if (!btn) return {}
  const rect = btn.getBoundingClientRect()
  const viewportWidth = window.innerWidth
  let right = viewportWidth - rect.right
  if (right > viewportWidth - 200) right = 8
  return {
    position: 'fixed' as const,
    top: `${rect.bottom + 2}px`,
    right: `${right}px`,
  }
}

const moreDropdownStyle = computed(() => dropdownPosition(moreButtonRef.value))
const switcherDropdownStyle = computed(() => {
  const id = openSwitcherId.value
  if (!id) return {}
  return dropdownPosition(switcherButtonRefs.value[id] ?? null)
})

const openSwitcherTab = computed<NatcaTab | null>(() => {
  const id = openSwitcherId.value
  if (!id) return null
  return props.tabs.find(t => t.id === id) ?? null
})

// Items rendered inside the More dropdown — flattens any switcher's children one level
// (overflowed switchers don't open nested menus; their children appear flat). Children carry
// a flag so the dropdown can render them with an indent + left border for hierarchy.
type OverflowFlatItem = { tab: NatcaTab; isChild: boolean; parentLabel?: string }
const overflowFlatItems = computed<OverflowFlatItem[]>(() => {
  const out: OverflowFlatItem[] = []
  for (const t of overflowTabs.value) {
    if (isSwitcher(t)) {
      for (const c of t.children as NatcaTab[]) {
        out.push({ tab: c, isChild: true, parentLabel: t.label })
      }
    } else {
      out.push({ tab: t, isChild: false })
    }
  }
  return out
})

// ── Overflow detection ──
// Strategy: show all tabs, check which overflow the container, then hide them.
// Uses actual DOM positions — no width caching, no timing issues.

let settling = false
let settleTimer: ReturnType<typeof setTimeout> | null = null

function settle() {
  if (settleTimer) clearTimeout(settleTimer)
  settleTimer = setTimeout(doSettle, 16)
}

function doSettle() {
  if (settling) return
  settling = true

  overflowStartIndex.value = Infinity
  collapsedSet.value = new Set()

  nextTick(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        doOverflowCheck()
        settling = false
      })
    })
  })
}

function doOverflowCheck() {
  const container = containerRef.value
  if (!container) return

  const containerRight = container.getBoundingClientRect().right
  const tabEls = container.querySelectorAll<HTMLElement>(':scope > .natca-shell-tab')
  if (!tabEls.length) return

  const lastTab = tabEls[tabEls.length - 1]
  if (lastTab.getBoundingClientRect().right <= containerRight) {
    return
  }

  const newCollapsed = new Set<string>()
  for (let i = 0; i < props.tabs.length; i++) {
    if (shouldCollapseToIcon(props.tabs[i])) {
      newCollapsed.add(props.tabs[i].id)
    }
  }
  collapsedSet.value = newCollapsed

  nextTick(() => {
    requestAnimationFrame(() => {
      doOverflowCheckPhase2()
    })
  })
}

const MORE_BUTTON_WIDTH = 80

function doOverflowCheckPhase2() {
  const container = containerRef.value
  if (!container) return

  const containerRight = container.getBoundingClientRect().right
  const tabEls = container.querySelectorAll<HTMLElement>(':scope > .natca-shell-tab')

  if (tabEls.length > 0) {
    const lastTab = tabEls[tabEls.length - 1]
    if (lastTab.getBoundingClientRect().right <= containerRight) {
      return
    }
  }

  const budget = containerRight - MORE_BUTTON_WIDTH
  let cutoff = props.tabs.length

  for (let i = 0; i < tabEls.length; i++) {
    if (tabEls[i].getBoundingClientRect().right > budget) {
      cutoff = i
      break
    }
  }

  overflowStartIndex.value = Math.max(1, cutoff)
}

// ── Resize ──
let resizeObserver: ResizeObserver | null = null

// ── Dropdown handlers ──
function toggleMore() {
  moreOpen.value = !moreOpen.value
  if (moreOpen.value) openSwitcherId.value = null
}

function toggleSwitcher(id: string) {
  openSwitcherId.value = openSwitcherId.value === id ? null : id
  if (openSwitcherId.value) moreOpen.value = false
}

function onOverflowLinkClick() {
  moreOpen.value = false
}

function onSwitcherChildClick() {
  openSwitcherId.value = null
}

function onClickOutside(e: MouseEvent) {
  const target = e.target as Node

  if (moreOpen.value) {
    if (!moreButtonRef.value?.contains(target) && !dropdownRef.value?.contains(target)) {
      moreOpen.value = false
    }
  }

  if (openSwitcherId.value) {
    const btn = switcherButtonRefs.value[openSwitcherId.value]
    if (!btn?.contains(target) && !switcherDropdownRef.value?.contains(target)) {
      openSwitcherId.value = null
    }
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    moreOpen.value = false
    openSwitcherId.value = null
  }
}

function setSwitcherButtonRef(id: string, el: Element | any) {
  switcherButtonRefs.value[id] = (el as HTMLElement) ?? null
}

// ── Lifecycle ──
onMounted(() => {
  settle()

  if (document.fonts?.ready) {
    document.fonts.ready.then(() => settle())
  }

  resizeObserver = new ResizeObserver(() => settle())
  if (containerRef.value) {
    resizeObserver.observe(containerRef.value)
  }
  document.addEventListener('click', onClickOutside, true)
  document.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  document.removeEventListener('click', onClickOutside, true)
  document.removeEventListener('keydown', onKeydown)
})

watch(() => props.tabs, () => settle(), { deep: true })

watch(() => route.path, () => {
  moreOpen.value = false
  openSwitcherId.value = null
})
</script>

<template>
  <nav ref="containerRef" class="natca-shell-tabs">
    <!-- Visible tabs -->
    <template v-for="tab in visibleTabs" :key="tab.id">
      <!-- Switcher tab (renders as button + dropdown) -->
      <button
        v-if="isSwitcher(tab)"
        :ref="(el) => setSwitcherButtonRef(tab.id, el)"
        type="button"
        class="natca-shell-tab natca-shell-tab-switcher"
        :class="{
          'natca-shell-tab-active': isActive(tab),
          'natca-shell-tab-icon-only': collapsedSet.has(tab.id),
          'natca-shell-tab-switcher-open': openSwitcherId === tab.id,
        }"
        :title="collapsedSet.has(tab.id) ? (activeChild(tab)?.label ?? tab.label) : undefined"
        :aria-haspopup="true"
        :aria-expanded="openSwitcherId === tab.id"
        @click.stop="toggleSwitcher(tab.id)"
      >
        <v-icon
          v-if="tab.icon"
          class="natca-shell-tab-icon"
          :icon="tab.icon"
          size="14"
        />
        <span v-if="!collapsedSet.has(tab.id)">
          {{ activeChild(tab)?.label ?? tab.label }}
        </span>
        <span
          v-if="tab.badge != null && !collapsedSet.has(tab.id)"
          class="natca-shell-nav-badge"
          style="font-size: 9px;"
        >
          {{ tab.badge }}
        </span>
        <v-icon
          v-if="!collapsedSet.has(tab.id)"
          class="natca-shell-tab-chevron"
          icon="mdi-chevron-down"
          size="14"
        />
      </button>

      <!-- Plain tab (router-link) -->
      <router-link
        v-else
        :to="tab.to"
        class="natca-shell-tab"
        :class="{
          'natca-shell-tab-active': isActive(tab),
          'natca-shell-tab-icon-only': collapsedSet.has(tab.id),
        }"
        :title="collapsedSet.has(tab.id) ? tab.label : undefined"
      >
        <v-icon
          v-if="tab.icon"
          class="natca-shell-tab-icon"
          :icon="tab.icon"
          size="14"
        />
        <span v-if="!collapsedSet.has(tab.id)">{{ tab.label }}</span>
        <span
          v-if="tab.badge != null && !collapsedSet.has(tab.id)"
          class="natca-shell-nav-badge"
          style="font-size: 9px;"
        >
          {{ tab.badge }}
        </span>
      </router-link>
    </template>

    <!-- More button -->
    <button
      v-if="hasOverflow"
      ref="moreButtonRef"
      type="button"
      class="natca-shell-tab-more"
      :class="{ 'natca-shell-tab-more-active': moreOpen || overflowHasActive }"
      @click.stop="toggleMore"
    >
      <v-icon :icon="moreOpen ? 'mdi-close' : 'mdi-dots-horizontal'" size="14" />
      <span>{{ moreOpen ? 'Close' : 'More' }}</span>
    </button>

  </nav>

  <!-- More dropdown — teleported so it escapes the tab bar's overflow:hidden -->
  <Teleport to="body">
    <div
      v-if="hasOverflow && moreOpen"
      ref="dropdownRef"
      class="natca-shell-tab-dropdown"
      :data-theme="resolvedTheme"
      :style="moreDropdownStyle"
    >
      <router-link
        v-for="item in overflowFlatItems"
        :key="item.tab.id"
        :to="item.tab.to"
        class="natca-shell-tab-dropdown-item"
        :class="{
          'natca-shell-tab-dropdown-item-active': isActive(item.tab),
          'natca-shell-tab-dropdown-item-child': item.isChild,
        }"
        :title="item.isChild && item.parentLabel ? `${item.parentLabel} › ${item.tab.label}` : undefined"
        @click="onOverflowLinkClick"
      >
        <v-icon
          v-if="item.tab.icon"
          :icon="item.tab.icon"
          size="14"
          class="natca-shell-tab-dropdown-icon"
        />
        <span>{{ item.tab.label }}</span>
        <span
          v-if="item.tab.badge != null"
          class="natca-shell-nav-badge"
          style="font-size: 9px;"
        >
          {{ item.tab.badge }}
        </span>
      </router-link>
    </div>
  </Teleport>

  <!-- Switcher dropdown — teleported, positioned under its parent button -->
  <Teleport to="body">
    <div
      v-if="openSwitcherTab"
      ref="switcherDropdownRef"
      class="natca-shell-tab-dropdown"
      :data-theme="resolvedTheme"
      :style="switcherDropdownStyle"
    >
      <router-link
        v-for="child in (openSwitcherTab.children as NatcaTab[])"
        :key="child.id"
        :to="child.to"
        class="natca-shell-tab-dropdown-item"
        :class="{ 'natca-shell-tab-dropdown-item-active': isActive(child) }"
        @click="onSwitcherChildClick"
      >
        <v-icon
          v-if="child.icon"
          :icon="child.icon"
          size="14"
          class="natca-shell-tab-dropdown-icon"
        />
        <span>{{ child.label }}</span>
        <span
          v-if="child.badge != null"
          class="natca-shell-nav-badge"
          style="font-size: 9px;"
        >
          {{ child.badge }}
        </span>
      </router-link>
    </div>
  </Teleport>
</template>
