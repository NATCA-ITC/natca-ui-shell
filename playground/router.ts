import { createRouter, createWebHistory } from 'vue-router'
import DashboardPage from './pages/DashboardPage.vue'
import MembersPage from './pages/MembersPage.vue'
import PlaceholderPage from './pages/PlaceholderPage.vue'
import ComponentsPage from './pages/ComponentsPage.vue'
import DesignStandardsPage from './pages/DesignStandardsPage.vue'
import BlocksPage from './pages/BlocksPage.vue'
import AuthLandingPage from './pages/AuthLandingPage.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/admin',
    },

    // ── Standalone (no shell): pre-login landing (NatcaAuthLayout) ──
    {
      path: '/auth',
      component: AuthLandingPage,
      meta: { title: 'Auth Landing', standalone: true },
    },

    // ── Hub Admin (Variant 1: sidebar + breadcrumbs) ──
    {
      path: '/admin',
      component: DashboardPage,
      meta: {
        title: 'Dashboard',
        breadcrumbs: [{ label: 'Hub' }, { label: 'Dashboard' }],
      },
    },
    {
      path: '/admin/members',
      component: MembersPage,
      meta: {
        title: 'Members',
        breadcrumbs: [
          { label: 'Hub', to: '/admin' },
          { label: 'Members' },
        ],
      },
    },
    {
      path: '/admin/facilities',
      component: PlaceholderPage,
      meta: {
        title: 'Facilities',
        breadcrumbs: [
          { label: 'Hub', to: '/admin' },
          { label: 'Facilities' },
        ],
      },
    },
    {
      path: '/admin/facilities/:id',
      component: PlaceholderPage,
      meta: {
        title: 'Facility Detail',
        breadcrumbs: [
          { label: 'Hub', to: '/admin' },
          { label: 'Facilities', to: '/admin/facilities' },
          { label: ':id' },
        ],
      },
    },
    {
      path: '/admin/regions',
      component: PlaceholderPage,
      meta: { title: 'Regions', breadcrumbs: [{ label: 'Hub', to: '/admin' }, { label: 'Regions' }] },
    },
    {
      path: '/admin/reports',
      component: PlaceholderPage,
      meta: { title: 'Reports', breadcrumbs: [{ label: 'Hub', to: '/admin' }, { label: 'Reports' }] },
    },
    {
      path: '/admin/infrastructure',
      component: PlaceholderPage,
      meta: { title: 'Infrastructure', breadcrumbs: [{ label: 'Hub', to: '/admin' }, { label: 'Infrastructure' }] },
    },
    {
      path: '/admin/config',
      component: PlaceholderPage,
      meta: { title: 'Config', breadcrumbs: [{ label: 'Hub', to: '/admin' }, { label: 'Config' }] },
    },
    {
      path: '/admin/activity',
      component: PlaceholderPage,
      meta: { title: 'Activity', breadcrumbs: [{ label: 'Hub', to: '/admin' }, { label: 'Activity' }] },
    },
    {
      path: '/admin/components',
      component: ComponentsPage,
      meta: {
        title: 'Components',
        breadcrumbs: [
          { label: 'Hub', to: '/admin' },
          { label: 'Components' },
        ],
      },
    },
    {
      // NAT-1126 regression surface: sidebar present, breadcrumbs absent. The
      // row must stay visible for the hamburger (collapse the sidebar on any
      // crumbed admin page, land here, and without it the sidebar is stuck
      // shut — sidebarCollapsed is in-memory state with no way back).
      path: '/admin/no-crumbs',
      component: PlaceholderPage,
      meta: { title: 'No breadcrumbs (bare row)' },
    },
    {
      path: '/admin/blocks',
      component: BlocksPage,
      meta: {
        title: 'Block layout',
        breadcrumbs: [
          { label: 'Hub', to: '/admin' },
          { label: 'Block layout' },
        ],
      },
    },
    {
      path: '/admin/design-standards',
      component: DesignStandardsPage,
      meta: {
        title: 'Design Standards',
        breadcrumbs: [
          { label: 'Hub', to: '/admin' },
          { label: 'Design Standards' },
        ],
      },
    },
    {
      path: '/admin/email',
      component: PlaceholderPage,
      meta: { title: 'Email', breadcrumbs: [{ label: 'Hub', to: '/admin' }, { label: 'Email' }] },
    },
    {
      path: '/admin/settings',
      component: PlaceholderPage,
      meta: { title: 'Settings', breadcrumbs: [{ label: 'Hub', to: '/admin' }, { label: 'Settings' }] },
    },

    // ── BID Member (Variant 2: tabs only, no sidebar) ──
    {
      path: '/member',
      component: PlaceholderPage,
      meta: {
        title: 'My Facility',
        breadcrumbs: [{ label: 'BID' }, { label: 'My Facility' }],
      },
    },
    {
      path: '/member/lines',
      component: PlaceholderPage,
      meta: {
        title: 'Lines',
        breadcrumbs: [
          { label: 'BID', to: '/member' },
          { label: 'Lines' },
        ],
      },
    },
    {
      path: '/member/leave',
      component: PlaceholderPage,
      meta: {
        title: 'Leave',
        breadcrumbs: [
          { label: 'BID', to: '/member' },
          { label: 'Leave' },
        ],
      },
    },
    {
      path: '/member/summary',
      component: PlaceholderPage,
      meta: {
        title: 'Bid Summary',
        breadcrumbs: [
          { label: 'BID', to: '/member' },
          { label: 'Bid Summary' },
        ],
      },
    },
    {
      path: '/member/schedule',
      component: PlaceholderPage,
      meta: { title: 'Schedule', breadcrumbs: [{ label: 'BID', to: '/member' }, { label: 'Schedule' }] },
    },
    {
      path: '/member/area',
      component: PlaceholderPage,
      meta: { title: 'Area', breadcrumbs: [{ label: 'BID', to: '/member' }, { label: 'Area' }] },
    },
    {
      path: '/member/area/:area',
      component: PlaceholderPage,
      meta: {
        title: 'Area Detail',
        breadcrumbs: [
          { label: 'BID', to: '/member' },
          { label: 'Area', to: '/member/area' },
          { label: ':area' },
        ],
      },
    },
    {
      path: '/member/training',
      component: PlaceholderPage,
      meta: { title: 'Training', breadcrumbs: [{ label: 'BID', to: '/member' }, { label: 'Training' }] },
    },
    {
      path: '/member/grievances',
      component: PlaceholderPage,
      meta: { title: 'Grievances', breadcrumbs: [{ label: 'BID', to: '/member' }, { label: 'Grievances' }] },
    },

    // ── PayChecker Minimal (Variant 3: minimal tabs, no sidebar) ──
    {
      path: '/minimal',
      component: PlaceholderPage,
      meta: {
        title: 'Home',
      },
    },
    {
      path: '/minimal/upload',
      component: PlaceholderPage,
      meta: {
        title: 'Upload',
        breadcrumbs: [
          { label: 'PayChecker', to: '/minimal' },
          { label: 'Upload' },
        ],
      },
    },
    {
      path: '/minimal/history',
      component: PlaceholderPage,
      meta: {
        title: 'History',
        breadcrumbs: [
          { label: 'PayChecker', to: '/minimal' },
          { label: 'History' },
        ],
      },
    },
  ],
})
