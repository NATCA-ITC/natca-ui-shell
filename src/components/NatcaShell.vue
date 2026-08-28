<script setup lang="ts">
import { computed, watch } from 'vue'
import { useTheme } from 'vuetify'
import { useShellState } from '../composables/useShellState'
import { useNatcaTheme } from '../composables/useNatcaTheme'
import type { NatcaShellProps } from '../types'
import { natcaApps } from '../data/natcaApps'
import NatcaTopBar from './NatcaTopBar.vue'
import NatcaTabNav from './NatcaTabNav.vue'
import NatcaBreadcrumbRow from './NatcaBreadcrumbRow.vue'
import NatcaSidebar from './NatcaSidebar.vue'
import NatcaSearchDrawer from './NatcaSearchDrawer.vue'
import NatcaAppSwitcher from './NatcaAppSwitcher.vue'

const props = withDefaults(defineProps<NatcaShellProps>(), {
  authenticated: true,
  showSearch: true,
  showNotifications: false,
  showThemeToggle: true,
  notificationCount: 0,
  // Consuming apps that omit `apps` get the canonical NATCA registry for free.
  apps: () => natcaApps,
})

const emit = defineEmits<{
  search: [query: string]
  'app-select': [app: any]
  'profile-action': [action: string]
  'theme-change': [preference: string]
}>()

defineSlots<{
  default: () => any
  /**
   * Bottom block. Rendered as the last child of the scrolling content area
   * with `margin-top: auto`, so it sits at the bottom of the viewport on short
   * pages and scrolls away naturally on long ones. Apps must NOT hand-roll
   * this with a `min-height: 100%` wrapper — that fights the shell (NAT-1082).
   *
   * Positioning only: the shell adds no chrome, so anything you put above the
   * footer (a release banner, an offline notice) travels with it instead of
   * stranding at the end of short page content. For the standard NATCA footer
   * bar, put `<NatcaAppFooter>` in here.
   */
  footer?: () => any
  'breadcrumb-right'?: () => any
  'sidebar-footer'?: () => any
  'search-recent'?: () => any
  'search-quick-links'?: () => any
  'toolbar-actions'?: () => any
}>()

const { state, closeSearch, closeAppSwitcher } = useShellState()

const vuetifyTheme = useTheme()
const { resolved: resolvedTheme } = useNatcaTheme()

// Sync resolved NATCA theme → Vuetify active theme
// 'light' → 'natcaLight', 'dark' → 'natcaDark', 'glass' → 'natcaGlass', etc.
watch(
  resolvedTheme,
  (theme) => {
    vuetifyTheme.change(`natca${theme.charAt(0).toUpperCase()}${theme.slice(1)}`)
  },
  { immediate: true }
)

const hasSidebar = computed(() => !!props.sidebarSections && props.sidebarSections.length > 0)
const hasBreadcrumbs = computed(() => !!props.breadcrumbs && props.breadcrumbs.length > 0)

// Apps shown in the switcher — drop any flagged `hidden` (e.g. DMS pre-launch).
const visibleApps = computed(() => (props.apps ?? []).filter((app) => !app.hidden))

// Apply Vuetify theme class to shell root so --v-theme-* CSS variables propagate
// to all Vuetify components inside the shell (same role as <v-app> but without
// its layout/background interference).
const vuetifyThemeClass = computed(() => vuetifyTheme.name.value ? `v-theme--${vuetifyTheme.name.value}` : '')

const shellClasses = computed(() => ({
  'natca-shell': true,
  [vuetifyThemeClass.value]: true,
  'natca-shell-collapsed': state.sidebarCollapsed,
  'natca-shell-no-sidebar': !hasSidebar.value,
  'natca-shell-no-breadcrumb': !hasBreadcrumbs.value,
}))

// Sync search drawer state with composable
const searchOpen = computed({
  get: () => state.searchOpen,
  set: (val: boolean) => {
    if (!val) closeSearch()
  },
})

function handleSearch(query: string) {
  emit('search', query)
}

function handleAppSelect(app: any) {
  closeAppSwitcher()
  emit('app-select', app)
}

// Close app switcher on click outside
function handleShellClick(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (state.appSwitcherOpen && !target.closest('.natca-shell-app-chip') && !target.closest('.natca-shell-app-switcher')) {
    closeAppSwitcher()
  }
}
</script>

<template>
  <div
    :class="shellClasses"
    :data-theme="resolvedTheme"
    @click="handleShellClick"
  >
    <NatcaTopBar
      :app-name="appName"
      :facility="facility"
      :user="user"
      :authenticated="authenticated"
      :show-search="showSearch"
      :show-notifications="showNotifications"
      :show-theme-toggle="showThemeToggle"
      :notification-count="notificationCount"
      :apps="apps"
      :profile-menu-items="profileMenuItems"
      @profile-action="(action: string) => emit('profile-action', action)"
      @theme-change="(pref: string) => emit('theme-change', pref)"
    >
      <template v-if="$slots['toolbar-actions']" #toolbar-actions>
        <slot name="toolbar-actions" />
      </template>
    </NatcaTopBar>

    <!-- Everything below topbar wrapped for search overlay positioning -->
    <div class="natca-shell-below-topbar">
      <NatcaTabNav :tabs="tabs" />

      <!-- NAT-1126: the row is ALWAYS rendered, never v-if'd. It owns the
           #page-breadcrumb-extras teleport target, and a Teleport whose target
           unmounts throws on a null parentNode — which aborts the patch and
           leaves router-view frozen while sibling branches keep rendering. A
           stable target is the only way apps can teleport into shell chrome
           safely. With no crumbs the row goes bare and collapses to nothing
           unless something has actually teleported in. -->
      <NatcaBreadcrumbRow
        :breadcrumbs="breadcrumbs ?? []"
        :has-sidebar="hasSidebar"
      >
        <template #right>
          <slot name="breadcrumb-right" />
        </template>
      </NatcaBreadcrumbRow>

      <div class="natca-shell-body">
        <NatcaSidebar v-if="hasSidebar" :sections="sidebarSections!">
          <template #footer>
            <slot name="sidebar-footer" />
          </template>
        </NatcaSidebar>

        <main class="natca-shell-content">
          <slot />
          <!-- NAT-1082: shell-owned bottom block. POSITIONING ONLY — no
               border, no background, no padding, no type styles. Apps put
               arbitrary content here (a release banner glued above the footer,
               for instance) and reach for NatcaAppFooter when they want the
               standard footer chrome. Rendered as a SIBLING of the default
               slot, never a wrapper around it, so it can't become the
               containing block for an app's position:sticky elements. -->
          <div v-if="$slots.footer" class="natca-shell-foot">
            <slot name="footer" />
          </div>
        </main>
      </div>

      <NatcaSearchDrawer
        v-model="searchOpen"
        @search="handleSearch"
      >
        <template #recent>
          <slot name="search-recent" />
        </template>
        <template #quick-links>
          <slot name="search-quick-links" />
        </template>
      </NatcaSearchDrawer>
    </div>

    <NatcaAppSwitcher
      v-if="state.appSwitcherOpen && visibleApps.length"
      :apps="visibleApps"
      :current-app-id="appId"
      @select="handleAppSelect"
    />
  </div>
</template>

<style scoped>
.natca-shell {
  position: relative;
}
</style>
