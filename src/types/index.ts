import type { RouteLocationRaw } from 'vue-router'

export interface NatcaThemeOption {
  value: string   // theme name, e.g. 'glass'
  label?: string  // display label — defaults to title-cased value
  icon?:  string  // emoji or MDI icon name ('mdi-*' renders as <v-icon>, else inline text)
}

export interface NatcaTab {
  id: string
  label: string
  icon?: string // MDI icon name, e.g. 'mdi-account-group'
  to: RouteLocationRaw
  badge?: string | number
}

export interface NatcaNavItem {
  id: string
  label: string
  icon?: string
  to?: RouteLocationRaw
  badge?: string | number
  section?: string // When set, renders as a section header
}

export interface NatcaNavSection {
  title: string
  items: NatcaNavItem[]
}

export interface NatcaApp {
  id: string
  name: string
  icon?: string
  url: string
  description?: string
}

export interface NatcaUser {
  name: string
  initials: string
  email?: string
  avatarUrl?: string
  memberNumber?: string
  region?: string
  facility?: string
}

export interface NatcaBreadcrumb {
  label: string
  to?: RouteLocationRaw
}

export interface NatcaShellProps {
  appId: string
  appName: string
  tabs: NatcaTab[]
  user: NatcaUser
  facility?: string
  sidebarSections?: NatcaNavSection[]
  breadcrumbs?: NatcaBreadcrumb[]
  apps?: NatcaApp[]
  showSearch?: boolean
  showNotifications?: boolean
  showThemeToggle?: boolean
  notificationCount?: number
}

/**
 * Re-export component-level types for convenience.
 * Canonical definitions live in each component file.
 */
export type { NatcaTabItem } from '../components/NatcaTabs.vue'
export type { MemberCardData } from '../components/NatcaMemberCard.vue'
