<script setup lang="ts">
import { computed } from 'vue'
import { useShellState } from '../composables/useShellState'
import type { NatcaBreadcrumb } from '../types'

const props = defineProps<{
  breadcrumbs: NatcaBreadcrumb[]
  hasSidebar?: boolean
}>()

const hasCrumbs = computed(() => props.breadcrumbs.length > 0)

defineSlots<{
  right?: () => any
}>()

const { state, toggleSidebar, toggleMobileDrawer } = useShellState()

function handleHamburgerClick() {
  // On mobile, toggle the drawer; on desktop, toggle sidebar collapse
  if (window.innerWidth <= 768) {
    toggleMobileDrawer()
  } else {
    toggleSidebar()
  }
}
</script>

<template>
  <div
    class="natca-shell-breadcrumb-row"
    :class="{ 'natca-shell-breadcrumb-row--bare': !hasCrumbs }"
  >
    <!-- Hamburger toggle (visible when sidebar exists) -->
    <button
      v-if="hasSidebar"
      class="natca-shell-breadcrumb-hamburger"
      type="button"
      aria-label="Toggle sidebar"
      @click="handleHamburgerClick"
    >
      <!-- Left arrow when sidebar expanded, hamburger when collapsed -->
      <svg v-if="!state.sidebarCollapsed" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15 18 9 12 15 6" />
      </svg>
      <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    </button>

    <!-- Breadcrumb trail -->
    <nav v-if="hasCrumbs" class="natca-shell-breadcrumb">
      <template v-for="(crumb, i) in breadcrumbs" :key="i">
        <span v-if="i > 0" class="natca-shell-sep">/</span>
        <router-link
          v-if="crumb.to && i < breadcrumbs.length - 1"
          :to="crumb.to"
        >
          {{ crumb.label }}
        </router-link>
        <span v-else class="natca-shell-current">{{ crumb.label }}</span>
      </template>
    </nav>

    <!--
      NAT-1126: shell-owned teleport target. ALWAYS in the DOM, including when
      the row is bare — apps teleport contextual chrome (status pills, live
      badges, view toggles) in here from page components:

        <Teleport to="#page-breadcrumb-extras"> … </Teleport>

      Never wrap this in a v-if and never let it be conditionally unmounted:
      Vue's Teleport throws on unmount when its target is gone, which aborts
      the render patch and freezes router-view. The id is deliberately the one
      apps already used when they hand-rolled this inside #breadcrumb-right.
    -->
    <div id="page-breadcrumb-extras" class="natca-shell-page-extras" />

    <!-- Right slot — app-owned row chrome. Hidden when the row is bare (see
         shell.css): an app that hides its breadcrumbs on a page is also
         choosing to hide what it parked beside them, while teleported extras
         above stay visible. Documented in page-patterns.md so the next app
         doesn't debug a slot that vanished. -->
    <div class="natca-shell-breadcrumb-right">
      <slot name="right" />
    </div>
  </div>
</template>
