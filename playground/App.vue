<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { NatcaShell, NatcaAppFooter, NatcaTopBarAction } from '@/index'
import type { NatcaTab, NatcaNavSection, NatcaBreadcrumb, NatcaApp, NatcaUser, NatcaProfileMenuItem } from '@/types'

const route = useRoute()

// ── Shared data ──

const user: NatcaUser = { name: 'Jason D.', initials: 'JD', memberNumber: '12345', facility: 'ZJX', region: 'NSO' }
const facility = 'ZJX'

const apps: NatcaApp[] = [
  { id: 'hub', name: 'Hub', url: '/admin', description: 'Admin Dashboard', icon: 'mdi-view-dashboard' },
  { id: 'bid', name: 'BID', url: '/member', description: 'Bid Management', icon: 'mdi-file-document' },
  { id: 'pay', name: 'PayChecker', url: '/minimal', description: 'Pay Verification', icon: 'mdi-currency-usd' },
  { id: 'dms', name: 'DMS', url: '#', description: 'Document Management', icon: 'mdi-folder' },
  { id: 'gats', name: 'GATS', url: '#', description: 'Grievance Archive', icon: 'mdi-shield' },
]

// ── Admin config (Hub — Variant 1: sidebar + breadcrumbs) ──

const adminTabs: NatcaTab[] = [
  { id: 'home', label: 'Dashboard', icon: 'mdi-view-dashboard', to: '/admin', collapseToIcon: true },
  { id: 'members', label: 'Members', icon: 'mdi-account-group', to: '/admin/members' },
  { id: 'facilities', label: 'Facilities', icon: 'mdi-office-building', to: '/admin/facilities' },
  { id: 'regions', label: 'Regions', icon: 'mdi-map', to: '/admin/regions', collapseToIcon: true },
  { id: 'reports', label: 'Reports', icon: 'mdi-chart-bar', to: '/admin/reports' },
  { id: 'email', label: 'Email', icon: 'mdi-email', to: '/admin/email' },
  { id: 'components', label: 'Components', icon: 'mdi-puzzle', to: '/admin/components' },
  { id: 'blocks', label: 'Block layout', icon: 'mdi-view-grid-plus', to: '/admin/blocks' },
  { id: 'design-standards', label: 'Design Standards', icon: 'mdi-palette', to: '/admin/design-standards' },
  { id: 'settings', label: 'Settings', icon: 'mdi-cog', to: '/admin/settings' },
]

const adminSidebar: NatcaNavSection[] = [
  {
    title: 'Overview',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: 'mdi-view-dashboard', to: '/admin' },
      { id: 'activity', label: 'Activity', icon: 'mdi-pulse', to: '/admin/activity' },
    ],
  },
  {
    title: 'Management',
    items: [
      { id: 'members', label: 'Members', icon: 'mdi-account-group', to: '/admin/members', badge: '2.4k' },
      { id: 'facilities', label: 'Facilities', icon: 'mdi-office-building', to: '/admin/facilities' },
      { id: 'regions', label: 'Regions', icon: 'mdi-map', to: '/admin/regions' },
    ],
  },
  {
    title: 'Tools',
    items: [
      { id: 'reports', label: 'Reports', icon: 'mdi-chart-bar', to: '/admin/reports' },
      { id: 'infrastructure', label: 'Infrastructure', icon: 'mdi-server', to: '/admin/infrastructure' },
      { id: 'config', label: 'Config', icon: 'mdi-cog', to: '/admin/config' },
      { id: 'components', label: 'Components', icon: 'mdi-puzzle', to: '/admin/components' },
      { id: 'blocks', label: 'Block layout', icon: 'mdi-view-grid-plus', to: '/admin/blocks' },
      { id: 'design-standards', label: 'Design Standards', icon: 'mdi-palette', to: '/admin/design-standards' },
      { id: 'auth-landing', label: 'Auth Landing (demo)', icon: 'mdi-login', to: '/auth' },
    ],
  },
]

// ── Member config (BID — Variant 2: tabs only, no sidebar) ──

const memberTabs: NatcaTab[] = [
  { id: 'home', label: 'My Facility', icon: 'mdi-office-building', to: '/member' },
  { id: 'lines', label: 'Lines', icon: 'mdi-format-list-bulleted', to: '/member/lines' },
  { id: 'leave', label: 'Leave', icon: 'mdi-calendar', to: '/member/leave' },
  { id: 'summary', label: 'Bid Summary', icon: 'mdi-clipboard-check', to: '/member/summary' },
  { id: 'schedule', label: 'Schedule', icon: 'mdi-clock-outline', to: '/member/schedule' },
  {
    id: 'area',
    label: 'Area',
    icon: 'mdi-map-marker',
    to: '/member/area',
    children: [
      { id: 'area-south', label: 'South', icon: 'mdi-compass', to: '/member/area/south' },
      { id: 'area-east', label: 'East', icon: 'mdi-compass', to: '/member/area/east' },
      { id: 'area-central', label: 'Central', icon: 'mdi-compass', to: '/member/area/central' },
      { id: 'area-western', label: 'Western', icon: 'mdi-compass', to: '/member/area/western' },
      { id: 'area-northwest', label: 'Northwest Mountain', icon: 'mdi-compass', to: '/member/area/northwest' },
    ],
  },
  { id: 'training', label: 'Training', icon: 'mdi-school', to: '/member/training' },
  { id: 'grievances', label: 'Grievances', icon: 'mdi-gavel', to: '/member/grievances' },
]

// ── Minimal config (PayChecker — Variant 3: minimal tabs, no sidebar) ──

const minimalTabs: NatcaTab[] = [
  { id: 'home', label: 'Home', icon: 'mdi-home', to: '/minimal' },
  { id: 'upload', label: 'Upload', icon: 'mdi-upload', to: '/minimal/upload' },
  { id: 'history', label: 'History', icon: 'mdi-history', to: '/minimal/history' },
]

// ── Derived props based on route ──

type ShellMode = 'admin' | 'member' | 'minimal'

const mode = computed<ShellMode>(() => {
  const path = route.path
  if (path.startsWith('/member')) return 'member'
  if (path.startsWith('/minimal')) return 'minimal'
  return 'admin'
})

const bidProfileMenu: NatcaProfileMenuItem[] = [
  { id: 'profile', label: 'My Profile' },
  { id: 'signout', label: 'Sign Out', danger: true, dividerBefore: true },
]

const shellConfig = computed(() => {
  switch (mode.value) {
    case 'admin':
      return { appId: 'hub', appName: 'Hub', tabs: adminTabs, sidebarSections: adminSidebar }
    case 'member':
      // NAT-392 demo: BID has no Settings screen — its profile menu is two items.
      // Admin/minimal below deliberately omit `profileMenuItems` so the default
      // three-item menu stays exercised in the playground too.
      return { appId: 'bid', appName: 'BID', tabs: memberTabs, sidebarSections: undefined, profileMenuItems: bidProfileMenu }
    case 'minimal':
      return { appId: 'pay', appName: 'PayChecker', tabs: minimalTabs, sidebarSections: undefined }
  }
})

// Append ?guest=1 to any URL to preview the unauthenticated topbar (sign-in icon button).
const isGuest = computed(() => route.query.guest !== undefined && route.query.guest !== 'false')

// Append ?overflow=1 to stress the topbar slot + breadcrumb row (NAT-1986).
const isOverflow = computed(() => route.query.overflow !== undefined && route.query.overflow !== 'false')

// Standalone routes (e.g. the pre-login NatcaAuthLayout) render full-page, no shell.
const isStandalone = computed(() => route.meta.standalone === true)

function onProfileAction(action: string) {
  // eslint-disable-next-line no-console
  console.log('[playground] profile-action:', action)
}

const breadcrumbs = computed<NatcaBreadcrumb[] | undefined>(() => {
  const meta = route.meta as { breadcrumbs?: NatcaBreadcrumb[] }
  if (!meta.breadcrumbs || meta.breadcrumbs.length === 0) return undefined

  // Replace :id tokens with actual param values
  return meta.breadcrumbs.map((bc) => {
    if (bc.label.startsWith(':')) {
      const paramName = bc.label.slice(1)
      const paramVal = route.params[paramName] as string | undefined
      return { ...bc, label: paramVal?.toUpperCase() ?? bc.label }
    }
    return bc
  })
})
</script>

<template>
  <!-- Standalone (no shell): pre-login landing, full-page -->
  <router-view v-if="isStandalone" />

  <NatcaShell
    v-else
    :app-id="shellConfig.appId"
    :app-name="shellConfig.appName"
    :tabs="shellConfig.tabs"
    :authenticated="!isGuest"
    :user="isGuest ? undefined : user"
    :facility="facility"
    :sidebar-sections="shellConfig.sidebarSections"
    :breadcrumbs="breadcrumbs"
    :apps="apps"
    :profile-menu-items="shellConfig.profileMenuItems"
    :show-search="true"
    :show-notifications="true"
    :notification-count="3"
    @profile-action="onProfileAction"
    @theme-change="pref => localStorage.setItem('natca-theme', pref)"
  >
    <!-- NAT-1986: BID ships two pills here. The member variant mirrors that
         with NatcaTopBarAction; append ?overflow=1 to any route to add a
         deliberately oversized, non-collapsing control and prove the shell's
         own theme toggle + avatar stay on-screen anyway. -->
    <template v-if="mode === 'member' || isOverflow" #toolbar-actions>
      <NatcaTopBarAction icon="mdi-help-circle-outline" label="Support" />
      <NatcaTopBarAction icon="mdi-open-in-new" label="Go to BID v5" href="#" variant="warning" />
      <button v-if="isOverflow" type="button" class="playground-oversized">
        A deliberately oversized app control that never collapses on phones
      </button>
    </template>

    <template v-if="isOverflow" #breadcrumb-right>
      <span class="playground-crumb-pill">Bidding open · 08:00–16:00</span>
      <span class="playground-crumb-pill">Live updates</span>
    </template>

    <router-view />

    <!-- NAT-1082: the shell pins this block. No wrapper, no min-height:100%,
         no margin-top:auto in app CSS. The notice sits INSIDE the slot above
         NatcaAppFooter, so the two travel together instead of the notice
         stranding at the end of short page content — the shape BID needs. -->
    <template #footer>
      <div class="playground-notice">A new version is available — reload to update.</div>
      <NatcaAppFooter>
        NATCA UI Shell · playground · {{ shellConfig.appName }}
        <template #right><a href="#">Legacy app</a></template>
      </NatcaAppFooter>
    </template>
  </NatcaShell>
</template>

<style>
/* Reset for playground */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body, #app {
  height: 100%;
  width: 100%;
  background: var(--color-shell-base, #0a0f1a);
  color: var(--color-text-primary);
  overflow-x: hidden;
}

/* Override shell margin for full-viewport playground */
.natca-shell {
  margin: 0 !important;
  border-radius: 0 !important;
  border: none !important;
  width: 100% !important;
  height: calc(100vh - 52px) !important;
}

/* NAT-1986 stress content — deliberately hostile: wide, labelled, no phone form. */
.playground-oversized { flex-shrink: 0; height: 32px; padding: 0 14px; border-radius: 7px; border: 1px solid rgba(255,255,255,0.3); background: rgba(255,255,255,0.1); color: #FFFFFF; font-size: 12px; font-weight: 600; white-space: nowrap; cursor: pointer; }
.playground-crumb-pill { display: inline-flex; align-items: center; height: 22px; padding: 0 8px; margin-left: 6px; border-radius: 999px; background: var(--overlay-active); color: var(--color-text-primary); font-size: 11px; font-weight: 600; }
.playground-notice { background: var(--overlay-active); color: var(--color-text-primary); font-size: 11.5px; padding: 6px 16px; text-align: center; }
</style>
