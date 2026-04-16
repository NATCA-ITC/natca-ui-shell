<script setup lang="ts">
import { computed, watch } from 'vue'
import { useTheme } from 'vuetify'
import { useShellState } from '../composables/useShellState'
import { useNatcaTheme } from '../composables/useNatcaTheme'
import type { NatcaShellProps } from '../types'
import NatcaTopBar from './NatcaTopBar.vue'
import NatcaTabNav from './NatcaTabNav.vue'
import NatcaBreadcrumbRow from './NatcaBreadcrumbRow.vue'
import NatcaSidebar from './NatcaSidebar.vue'
import NatcaSearchDrawer from './NatcaSearchDrawer.vue'
import NatcaAppSwitcher from './NatcaAppSwitcher.vue'

const props = withDefaults(defineProps<NatcaShellProps>(), {
  showSearch: true,
  showNotifications: false,
  showThemeToggle: true,
  notificationCount: 0,
})

const emit = defineEmits<{
  search: [query: string]
  'app-select': [app: any]
  'profile-action': [action: string]
  'theme-change': [preference: string]
}>()

defineSlots<{
  default: () => any
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
    vuetifyTheme.global.name.value = `natca${theme.charAt(0).toUpperCase()}${theme.slice(1)}`
  },
  { immediate: true }
)

const hasSidebar = computed(() => !!props.sidebarSections && props.sidebarSections.length > 0)
const hasBreadcrumbs = computed(() => !!props.breadcrumbs && props.breadcrumbs.length > 0)

// Apply Vuetify theme class to shell root so --v-theme-* CSS variables propagate
// to all Vuetify components inside the shell (same role as <v-app> but without
// its layout/background interference).
const vuetifyThemeClass = computed(() => vuetifyTheme.global.name.value ? `v-theme--${vuetifyTheme.global.name.value}` : '')

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
      :show-search="showSearch"
      :show-notifications="showNotifications"
      :show-theme-toggle="showThemeToggle"
      :notification-count="notificationCount"
      :apps="apps"
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

      <NatcaBreadcrumbRow
        v-if="hasBreadcrumbs"
        :breadcrumbs="breadcrumbs!"
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
      v-if="state.appSwitcherOpen && apps?.length"
      :apps="apps!"
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
