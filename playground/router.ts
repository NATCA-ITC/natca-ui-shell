import { createRouter, createWebHistory } from 'vue-router'
import DashboardPage from './pages/DashboardPage.vue'
import MembersPage from './pages/MembersPage.vue'
import PlaceholderPage from './pages/PlaceholderPage.vue'
import ComponentsPage from './pages/ComponentsPage.vue'
import DesignStandardsPage from './pages/DesignStandardsPage.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/admin',
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
