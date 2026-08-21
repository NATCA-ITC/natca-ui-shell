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
  /** When true, collapse to icon-only on narrow viewports before overflowing into "More".
   *  Tabs with id 'home' auto-collapse by default (convention). Requires `icon` to be set. */
  collapseToIcon?: boolean
  /** When set, the tab renders as a switcher button that opens a dropdown of children
   *  instead of navigating directly. The parent label updates to reflect the active child
   *  (longest-prefix match). Children are flat router-links — nested switchers are not supported. */
  children?: NatcaTab[]
  /** Render this tab as a bordered "chip" button instead of an underline tab.
   *  Intended for leading controls (Home / area switcher) and trailing actions
   *  (Admin). The active state fills instead of underlining. Default: 'tab'. */
  variant?: 'tab' | 'button'
  /** Push this tab — and any tabs after it — to the trailing (right) edge of
   *  the bar (via margin-left: auto, same mechanism as the "More" button). */
  align?: 'start' | 'end'
  /** Render a thin vertical divider ("pipe") immediately after this tab, e.g.
   *  to separate a leading control from the content tabs. */
  dividerAfter?: boolean
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
  /** When true, the app is omitted from the switcher. Used for apps that exist
   *  in the canonical registry but aren't launched yet (e.g. DMS). */
  hidden?: boolean
}

/** A capability tile shown on the NatcaAuthLayout identity panel. */
export interface NatcaCapability {
  icon: string   // MDI icon name, e.g. 'mdi-lightning-bolt'
  title: string
  text: string
}

export interface NatcaAuthLayoutProps {
  /** App name shown as "NATCA {appName}" and in the switcher trigger. */
  appName: string
  /** This app's id, used to mark the current app in the switcher. */
  appId?: string
  tagline?: string
  logoSrc?: string
  /** Switcher list. Defaults to the built-in `natcaApps` registry (hidden apps filtered). */
  apps?: NatcaApp[]
  eyebrow?: string
  /** Sign-in card heading. Defaults to "Welcome back" (rendered uppercase). */
  heading?: string
  subheading?: string
  /** Identity-panel capability tiles. Omit to hide them. */
  capabilities?: NatcaCapability[]
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
  /** Required when `authenticated` is true (default). Omit when unauthenticated. */
  user?: NatcaUser
  /** Defaults to `true`. When `false`, the profile dropdown is replaced with a sign-in icon button that emits `profile-action: 'signin'`. */
  authenticated?: boolean
  facility?: string
  sidebarSections?: NatcaNavSection[]
  breadcrumbs?: NatcaBreadcrumb[]
  apps?: NatcaApp[]
  showSearch?: boolean
  showNotifications?: boolean
  showThemeToggle?: boolean
  notificationCount?: number
  /**
   * Profile dropdown entries, forwarded to NatcaTopBar. Omit for the default
   * menu (My Profile / Settings / Sign Out). See `NatcaProfileMenuItem`.
   */
  profileMenuItems?: NatcaProfileMenuItem[]
}

/**
 * NatcaDocumentViewer types — viewer takes URLs and metadata, emits events.
 * Zero DMS knowledge; consumers (like @natca-itc/dms-client) wrap this.
 */
export interface DocumentViewerMetadata {
  title?: string
  summary?: string
  period?: string
  version?: string
  lastUpdated?: string | Date | null
}

export interface DocumentViewerVersionRef {
  id: string
  label: string
  isCurrent?: boolean
  publishedAt?: string | null
}

export interface DocumentViewerChapterRef {
  id: string
  /** Index marker, e.g. "Article III" or "1.2". */
  index: string
  name: string
  /** Optional sub-sections rendered nested under the chapter. */
  sections?: Array<{ id: string; index: string; name?: string | null }>
}

/**
 * Re-export component-level types for convenience.
 * Canonical definitions live in each component file.
 */
export type { NatcaTabItem } from '../components/NatcaTabs.vue'
export type { MemberCardData } from '../components/NatcaMemberCard.vue'

/**
 * One entry in the topbar's profile dropdown (NAT-392).
 *
 * The shell owns the menu's chrome; the consuming app owns what is in it. When
 * an item is clicked the shell emits `profile-action` with this item's `id`,
 * so an app adds a menu entry without the shell knowing what it does.
 *
 * Leave `profileMenuItems` unset to keep the historical three-item default
 * (My Profile / Settings / Sign Out) — passing it is opt-in and additive.
 */
export interface NatcaProfileMenuItem {
  /** Emitted as the `profile-action` payload when this item is clicked. */
  id: string
  label: string
  /** Destructive treatment — red text. Used by Sign Out in the default menu. */
  danger?: boolean
  /** Draw a divider directly above this item. */
  dividerBefore?: boolean
}
