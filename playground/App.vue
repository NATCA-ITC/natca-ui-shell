<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { NatcaShell } from '@/index'
import type { NatcaTab, NatcaNavSection, NatcaBreadcrumb, NatcaApp, NatcaUser } from '@/types'

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
      { id: 'design-standards', label: 'Design Standards', icon: 'mdi-palette', to: '/admin/design-standards' },
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

const shellConfig = computed(() => {
  switch (mode.value) {
    case 'admin':
      return { appId: 'hub', appName: 'Hub', tabs: adminTabs, sidebarSections: adminSidebar }
    case 'member':
      return { appId: 'bid', appName: 'BID', tabs: memberTabs, sidebarSections: undefined }
    case 'minimal':
      return { appId: 'pay', appName: 'PayChecker', tabs: minimalTabs, sidebarSections: undefined }
  }
})

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
  <NatcaShell
    :app-id="shellConfig.appId"
    :app-name="shellConfig.appName"
    :tabs="shellConfig.tabs"
    :user="user"
    :facility="facility"
    :sidebar-sections="shellConfig.sidebarSections"
    :breadcrumbs="breadcrumbs"
    :apps="apps"
    :show-search="true"
    :show-notifications="true"
    :notification-count="3"
    @theme-change="pref => localStorage.setItem('natca-theme', pref)"
  >
    <router-view />
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
</style>
