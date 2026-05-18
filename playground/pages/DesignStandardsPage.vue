<script setup lang="ts">
import { ref } from 'vue'
import {
  NatcaTabs,
  NatcaCard,
  NatcaHeaderCard,
  NatcaStatCard,
  NatcaStatGrid,
  NatcaEmptyState,
  NatcaPageHeader,
  NatcaAnnotation,
  NatcaMemberCard,
  NatcaButton,
  NatcaIconButton,
  NatcaAlert,
  NatcaPillNav,
  NatcaDialog,
  NatcaDocumentViewer,
} from '@/index'
import type { NatcaTabItem } from '@/components/NatcaTabs.vue'
import type { MemberCardData } from '@/components/NatcaMemberCard.vue'
import {
  VSpacer, VTextField, VSelect, VAutocomplete,
  VDataTable, VChip, VProgressLinear,
  VSwitch, VCheckbox, VIcon,
} from 'vuetify/components'

// ── Tabs demo ──
const localTab = ref('details')
const localTabItems: NatcaTabItem[] = [
  { id: 'details', label: 'Details', icon: 'mdi-information-outline' },
  { id: 'members', label: 'Members', icon: 'mdi-account-group-outline', badge: 198 },
  { id: 'history', label: 'History', icon: 'mdi-history' },
]

const standaloneTab = ref('overview')
const standaloneItems: NatcaTabItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'roster', label: 'Roster', badge: 42 },
  { id: 'documents', label: 'Documents' },
  { id: 'audit', label: 'Audit log' },
]

// ── Pill nav demo ──
const timeRange = ref('30d')
const viewMode = ref('list')
const filterStatus = ref('all')
const dashScope = ref('me')

// ── Data table demo ──
const tableHeaders = [
  { title: 'Member', key: 'name' },
  { title: 'Facility', key: 'facility' },
  { title: 'Email', key: 'email' },
  { title: 'Provider', key: 'provider' },
  { title: 'Status', key: 'status' },
  { title: '', key: 'actions', sortable: false },
]
const tableItems = [
  { name: 'Jason Doss', facility: 'ZJX', email: 'jason.doss@natca.net', provider: 'Mailcow', status: 'Active' },
  { name: 'Sarah Mitchell', facility: 'ZDC', email: 's.mitchell@natca.net', provider: 'O365', status: 'Active' },
  { name: 'Marcus Chen', facility: 'ZLA', email: 'm.chen@natca.net', provider: 'Mailcow', status: 'Pending' },
  { name: 'Emily Rodriguez', facility: 'ZAU', email: 'e.rodriguez@natca.net', provider: 'Mailcow', status: 'Disabled' },
  { name: 'Mike Thompson', facility: 'ZOB', email: 'm.thompson@natca.net', provider: 'O365', status: 'Active' },
  { name: 'Anita Patel', facility: 'ZBW', email: 'a.patel@natca.net', provider: 'Mailcow', status: 'Active' },
]

function statusChipColor(status: string): string | undefined {
  const map: Record<string, string> = {
    Active: 'success', Pending: 'warning', Disabled: 'error'
  }
  return map[status]
}

// ── Dialog demo ──
const showConfirmDialog = ref(false)
const showDangerDialog = ref(false)
const showBareDialog = ref(false)

// ── Document viewer demo ──
// Mozilla's reference PDF — public, stable, has a few pages and a clear layout.
const demoPdfUrl = 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf'
const showViewerLightbox = ref(false)
const demoChapters = [
  { id: 'c1', index: 'I',   name: 'Introduction', sections: [] },
  { id: 'c2', index: 'II',  name: 'Method',       sections: [] },
  { id: 'c3', index: 'III', name: 'Results',      sections: [] },
  { id: 'c4', index: 'IV',  name: 'Discussion',   sections: [] },
]
const demoChapterAnchor = ref<string | null>('c1')
const demoVersions = [
  { id: 'v1', label: 'v1 — 2024 edition', isCurrent: false },
  { id: 'v2', label: 'v2 — 2025 edition (current)', isCurrent: true },
]

// ── Form demo ──
const formProvider = ref('Mailcow')
const formQuota = ref(5)
const formWelcome = ref(true)
const formForward = ref(false)

// ── Member card demo ──
const members: MemberCardData[] = [
  { name: 'Jason Doss', initials: 'JD', facility: 'ZJX', region: 'Southern', memberType: 'BUE', memberNumber: '12345' },
  { name: 'Sarah Mitchell', initials: 'SM', facility: 'ZDC', region: 'Eastern', memberType: 'CPC', memberNumber: '23456' },
]
</script>

<template>
  <div class="ds-page">
    <NatcaPageHeader
      title="Design Standards"
      subtitle="The single source of truth for layout, components, and color in any NATCA app."
    >
      <template #actions>
        <NatcaPillNav
          v-model="dashScope"
          :items="[
            { value: 'me', label: 'For me' },
            { value: 'all', label: 'All' },
          ]"
        />
        <NatcaButton variant="ghost">Export</NatcaButton>
        <NatcaButton variant="primary">New section</NatcaButton>
      </template>
    </NatcaPageHeader>

    <NatcaAnnotation>
      <strong>Read this before building any page.</strong>
      Every pattern below is a hard requirement — when you build a page in any consuming app
      (Hub, BID, Pay, DMS, GATS, Email), it should look exactly like the matching section here.
      Toggle light / dark with the sun-moon button in the topbar.
    </NatcaAnnotation>

    <!-- ═══════════ PAGE ANATOMY ═══════════ -->
    <section class="ds-section">
      <h3 class="ds-section-title">Page anatomy</h3>
      <p class="ds-body">
        Every page opens with <code>NatcaPageHeader</code> — title on the left, subtitle below it,
        action buttons / pills / chips on the right. Below the header, content is organized into
        sections with a red-underlined section title; descriptive body text sits directly under the
        title; the actual content (card, table, form, grid) follows. Filters, search, and tabs live
        inside the section's content area — never in the page header.
      </p>

      <p class="eyebrow">Section helpers — now global</p>
      <p class="ds-body">
        The <code>.section-title</code> and <code>.section-body</code> classes are shipped from
        <code>@natca-itc/ui-shell/shell-styles</code> (already imported by <code>NatcaShell</code>).
        Apps used to paste this CSS into every page; that's no longer needed. The card below
        uses the global classes directly — no scoped overrides:
      </p>

      <NatcaCard>
        <h3 class="section-title">Members</h3>
        <p class="section-body">
          All bargaining-unit members assigned to this facility, including pending and suspended accounts.
          Renders here with zero scoped CSS — only the global <code>section-title</code> /
          <code>section-body</code> classes.
        </p>
      </NatcaCard>

      <NatcaAnnotation type="warning" style="margin-top: 16px;">
        <strong>Anti-patterns to avoid:</strong> wrapping every section in a NatcaHeaderCard
        (the navy strip is for hero callouts only); using bare <code>v-btn</code> anywhere
        (always <code>NatcaButton</code> or <code>NatcaIconButton</code>); dropping a search
        input in the page header row; rendering buttons at 16-20px (always <code>size="sm"</code>
        or <code>size="md"</code>); pasting <code>.section-title</code>/<code>.section-body</code>
        CSS into a page — they're global helpers now.
      </NatcaAnnotation>
    </section>

    <!-- ═══════════ BUTTONS ═══════════ -->
    <section class="ds-section">
      <h3 class="ds-section-title">Button tiers</h3>
      <p class="ds-body">
        <code>NatcaButton</code> has 5 variants and 2 sizes. Primary is filled navy in light /
        filled red in dark. Secondary is a subtle filled neutral. Danger is outlined red. Ghost
        is transparent muted text. Link is blue text. <strong>Never use a bare v-btn for app
        actions</strong> — under <code>natcaDefaults</code> Vuetify buttons render at the wrong
        scale.
      </p>

      <p class="eyebrow">Variants</p>
      <table class="ds-props-table">
        <thead><tr><th>Example</th><th>Code</th><th>When to use</th></tr></thead>
        <tbody>
          <tr>
            <td><NatcaButton variant="primary">Primary</NatcaButton></td>
            <td><code>variant="primary"</code></td>
            <td>The single main action of the section (Save, Submit, Confirm).</td>
          </tr>
          <tr>
            <td><NatcaButton variant="secondary">Secondary</NatcaButton></td>
            <td><code>variant="secondary"</code></td>
            <td>Equally weighted secondary action (Export, Edit, Filter).</td>
          </tr>
          <tr>
            <td><NatcaButton variant="danger">Danger</NatcaButton></td>
            <td><code>variant="danger"</code></td>
            <td>Destructive — Delete, Remove, Revoke. Always confirm.</td>
          </tr>
          <tr>
            <td><NatcaButton variant="ghost">Ghost</NatcaButton></td>
            <td><code>variant="ghost"</code></td>
            <td>Tertiary or dismissive — Cancel, Close, Skip.</td>
          </tr>
          <tr>
            <td><NatcaButton variant="link">Link</NatcaButton></td>
            <td><code>variant="link"</code></td>
            <td>Inline navigation — View details, Open report.</td>
          </tr>
        </tbody>
      </table>

      <p class="eyebrow" style="margin-top: 16px;">Sizes — pick one of these two, never smaller</p>
      <table class="ds-props-table">
        <thead><tr><th>Example</th><th>Size</th><th>When to use</th></tr></thead>
        <tbody>
          <tr>
            <td>
              <div class="ds-btn-row">
                <NatcaButton variant="primary">Save</NatcaButton>
                <NatcaButton variant="secondary">Export</NatcaButton>
                <NatcaButton variant="ghost">Cancel</NatcaButton>
              </div>
            </td>
            <td><code>size="sm"</code> (default — 28px)</td>
            <td>Toolbars, table actions, page-header right slot, filter rows.</td>
          </tr>
          <tr>
            <td>
              <div class="ds-btn-row">
                <NatcaButton variant="primary" size="md">Submit Request</NatcaButton>
                <NatcaButton variant="ghost" size="md">Cancel</NatcaButton>
              </div>
            </td>
            <td><code>size="md"</code> (36px)</td>
            <td>Card / dialog footers, form submit rows, anywhere primary CTAs live.</td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- ═══════════ ICON BUTTONS ═══════════ -->
    <section class="ds-section">
      <h3 class="ds-section-title">Icon buttons</h3>
      <p class="ds-body">
        <code>NatcaIconButton</code> is the icon-only companion to <code>NatcaButton</code> —
        same five variants, two square sizes (28×28 and 36×36). Use this anywhere you'd
        otherwise reach for <code>&lt;v-btn icon&gt;</code> — dialog close X, table row actions,
        lightbox toolbars, expand/collapse, copy-to-clipboard. <strong>Required
        <code>aria-label</code></strong> (TS enforces it; runtime warns if empty).
      </p>

      <table class="ds-props-table">
        <thead><tr><th>Example</th><th>Size</th><th>When to use</th></tr></thead>
        <tbody>
          <tr>
            <td>
              <div class="ds-btn-row">
                <NatcaIconButton variant="ghost"     size="sm" icon="mdi-pencil"   aria-label="Edit" />
                <NatcaIconButton variant="ghost"     size="sm" icon="mdi-content-copy" aria-label="Copy" />
                <NatcaIconButton variant="ghost"     size="sm" icon="mdi-share-variant" aria-label="Share" />
                <NatcaIconButton variant="danger"    size="sm" icon="mdi-delete"   aria-label="Delete" />
                <NatcaIconButton variant="link"      size="sm" icon="mdi-open-in-new" aria-label="Open in new tab" />
                <NatcaIconButton variant="secondary" size="sm" icon="mdi-dots-horizontal" aria-label="More actions" />
              </div>
            </td>
            <td><code>size="sm"</code> (28×28)</td>
            <td>Table-row actions, dense list affordances, dialog close X, toolbar.</td>
          </tr>
          <tr>
            <td>
              <div class="ds-btn-row">
                <NatcaIconButton variant="primary"   size="md" icon="mdi-download"      aria-label="Download" />
                <NatcaIconButton variant="secondary" size="md" icon="mdi-printer"       aria-label="Print" />
                <NatcaIconButton variant="danger"    size="md" icon="mdi-trash-can"     aria-label="Delete record" />
                <NatcaIconButton variant="ghost"     size="md" icon="mdi-refresh"       aria-label="Refresh" />
              </div>
            </td>
            <td><code>size="md"</code> (36×36)</td>
            <td>Form-footer / dialog-footer rows when paired with <code>NatcaButton size="md"</code>.</td>
          </tr>
        </tbody>
      </table>

      <NatcaAnnotation type="warning" style="margin-top: 8px; max-width: 760px;">
        <strong>Don't use <code>&lt;v-btn icon size="small"&gt;</code>.</strong> It collapses to a
        16-20px chip under <code>natcaDefaults</code> — the exact bug page-patterns §2 forbids.
        <code>NatcaIconButton</code> is the only correct primitive for icon-only actions.
      </NatcaAnnotation>
    </section>

    <!-- ═══════════ CARDS ═══════════ -->
    <section class="ds-section">
      <h3 class="ds-section-title">Cards</h3>
      <p class="ds-body">
        Three card components, each for a specific job. Use the decision matrix to choose —
        don't reach for <code>NatcaHeaderCard</code> by default; the navy strip is loud and
        belongs to a small number of feature callouts only.
      </p>

      <table class="ds-props-table">
        <thead><tr><th>Component</th><th>When to use</th><th>When NOT to use</th></tr></thead>
        <tbody>
          <tr>
            <td><code>NatcaCard</code></td>
            <td>Default — forms, lists, dashboard tiles, sectioned content.</td>
            <td>—</td>
          </tr>
          <tr>
            <td><code>NatcaCard accent="…"</code></td>
            <td>Single callout / call-to-action with brand color (info / success / warning / danger).
              One per page max.</td>
            <td>Don't use as the default card style — it's loud.</td>
          </tr>
          <tr>
            <td><code>NatcaHeaderCard</code></td>
            <td>Hero feature card with navy strip — e.g. "My Email Account" hero on the
              member-facing email landing page.</td>
            <td>Don't wrap every section in one. Don't use for forms or lists.</td>
          </tr>
          <tr>
            <td><code>NatcaStatCard</code> / <code>NatcaStatGrid</code></td>
            <td>KPI tiles in a dashboard grid (Total accounts, Active, Pending …).</td>
            <td>Don't use for actionable content — they have no body.</td>
          </tr>
        </tbody>
      </table>

      <p class="eyebrow" style="margin-top: 20px;">Default card with title, body, and actions</p>
      <NatcaCard title="Email Account" subtitle="jason@natca.net · Active">
        <div class="ds-field-grid">
          <div><span class="ds-field-label">Provider</span><br><span class="ds-field-value">Mailcow</span></div>
          <div><span class="ds-field-label">Quota</span><br><span class="ds-field-value">2.1 / 5 GB</span></div>
          <div><span class="ds-field-label">Status</span><br><VChip color="success" variant="tonal">Active</VChip></div>
        </div>
        <template #actions>
          <NatcaButton variant="ghost" size="md">Cancel</NatcaButton>
          <NatcaButton variant="primary" size="md">Save changes</NatcaButton>
        </template>
      </NatcaCard>

      <p class="eyebrow" style="margin-top: 20px;">Accent card — call-to-action</p>
      <NatcaCard
        accent="warning"
        title="Migrate your @natca.net account"
        subtitle="Action required by June 1, 2026"
      >
        Your email account is on the legacy mail platform. Migrate now to keep sending /
        receiving after the cutover. Migration takes about 5 minutes and is fully reversible
        for 30 days.
        <template #actions>
          <NatcaButton variant="ghost" size="md">Remind me later</NatcaButton>
          <NatcaButton variant="primary" size="md">Start migration</NatcaButton>
        </template>
      </NatcaCard>

      <p class="eyebrow" style="margin-top: 20px;">Dashboard layout — mixed cards + stat grid</p>
      <p class="ds-body">
        Variable-size dashboard tiles using a CSS grid. Cards span columns based on the data
        density they need — left-side member detail spans 2 columns, the four right-side cards
        each span 1.
      </p>
      <div class="ds-dashboard-grid">
        <NatcaCard title="Jason T Doss" subtitle="Member 40162 · ZJX · Current Member" style="grid-column: span 2; grid-row: span 2;">
          <template #title-actions>
            <NatcaButton variant="link">View profile</NatcaButton>
          </template>
          <div class="ds-field-grid ds-field-grid--2col">
            <div><span class="ds-field-label">Member type</span><br><span class="ds-field-value">Current Member</span></div>
            <div><span class="ds-field-label">Bargaining unit</span><br><VChip color="success" variant="tonal">Active</VChip></div>
            <div><span class="ds-field-label">Facility</span><br><span class="ds-field-value">ZJX · Southern</span></div>
            <div><span class="ds-field-label">Career level</span><br><span class="ds-field-value">CPC</span></div>
            <div><span class="ds-field-label">Email</span><br><span class="ds-field-value">jason.doss@natca.net</span></div>
            <div><span class="ds-field-label">Phone</span><br><span class="ds-field-value">(859) 757-9223</span></div>
          </div>
        </NatcaCard>
        <NatcaStatCard label="Membership status" value="Active" change="Since 07/22/2008" change-color="info" />
        <NatcaStatCard label="Career level" value="CPC" change="EOD 01/14/2008" change-color="info" />
        <NatcaStatCard label="PAC contributions" value="$•••" change="+$25 this month" />
        <NatcaStatCard label="Pay grade" value="KH" change="Yearly $•••" change-color="info" />
      </div>

      <p class="eyebrow" style="margin-top: 20px;">Hero header card — feature landing</p>
      <p class="ds-body">
        Reserved for member-facing feature landing pages. Single-line header strip with a
        4px brand top border. The icon color auto-contrasts to the opposite brand color so
        nothing ever clashes with the accent — pass <code>accent="navy"</code> (default) or
        <code>accent="red"</code>.
      </p>
      <NatcaHeaderCard
        accent="navy"
        icon="mdi-email-outline"
        title="My Email Account"
        subtitle="jason.doss@natca.net · ZJX · Mailcow"
      >
        <template #header-right>
          <VChip color="success" variant="tonal">Active</VChip>
        </template>
        <div class="ds-field-grid">
          <div><span class="ds-field-label">Storage</span><br><span class="ds-field-value">2.1 / 5 GB</span></div>
          <div><span class="ds-field-label">Quota</span><br><span class="ds-field-value">5 GB</span></div>
          <div><span class="ds-field-label">Last sign-in</span><br><span class="ds-field-value">2h ago</span></div>
        </div>
        <template #actions>
          <NatcaButton variant="ghost" size="md">Settings</NatcaButton>
          <NatcaButton variant="primary" size="md">Manage account</NatcaButton>
        </template>
      </NatcaHeaderCard>

      <div style="height: 12px;"></div>
      <NatcaHeaderCard
        accent="red"
        icon="mdi-shield-alert-outline"
        title="Access review required"
        subtitle="3 admin grants pending review"
      >
        <template #header-right>
          <NatcaButton variant="link">View all</NatcaButton>
        </template>
        <p style="margin: 0;">Review the pending grant requests before the next compliance window
          on June 30. Each grant requires sign-off from the area chair.</p>
      </NatcaHeaderCard>
    </section>

    <!-- ═══════════ DATA TABLE ═══════════ -->
    <section class="ds-section">
      <h3 class="ds-section-title">Data table</h3>
      <p class="ds-body">
        Tables sit inside a <code>NatcaCard no-body-padding</code> so the rounded corners and
        outer border stand alone from the page background. The toolbar row at the top holds
        filter pills and a search input; the footer row holds pagination and items-per-page —
        both tinted to read as distinct from the data rows.
      </p>

      <NatcaCard no-body-padding>
        <div class="ds-table-toolbar">
          <NatcaPillNav
            v-model="filterStatus"
            :items="[
              { value: 'all', label: 'All' },
              { value: 'active', label: 'Active' },
              { value: 'pending', label: 'Pending' },
              { value: 'disabled', label: 'Disabled' },
            ]"
          />
          <VSpacer />
          <VTextField placeholder="Search accounts…" prepend-inner-icon="mdi-magnify" hide-details density="compact" style="max-width: 240px;" />
          <NatcaButton variant="primary">New account</NatcaButton>
        </div>
        <VDataTable :headers="tableHeaders" :items="tableItems" :items-per-page="5">
          <template #item.status="{ item }">
            <VChip :color="statusChipColor(item.status)" variant="tonal">{{ item.status }}</VChip>
          </template>
          <template #item.actions="{}">
            <NatcaButton variant="ghost">View</NatcaButton>
          </template>
        </VDataTable>
      </NatcaCard>
    </section>

    <!-- ═══════════ FORMS ═══════════ -->
    <section class="ds-section">
      <h3 class="ds-section-title">Forms</h3>
      <p class="ds-body">
        Vuetify form fields with <code>natcaDefaults</code>. All fields render outlined,
        compact, with primary-color focus. The card title ("Create email account") is the
        form heading — give it real weight at the top. Submit / cancel buttons go in
        <code>#actions</code> at <code>size="md"</code>.
      </p>

      <div class="ds-row">
        <div style="flex: 1; min-width: 320px;">
          <NatcaCard title="Create email account" subtitle="Members only — must already exist in the public schema">
            <VAutocomplete label="Member" placeholder="Search members…" :items="['Jason Doss', 'Sarah Mitchell']" />
            <VTextField label="Email address" placeholder="first.last@natca.net" />
            <div class="d-flex ga-3">
              <VSelect label="Provider" :items="['Mailcow', 'O365']" v-model="formProvider" style="flex: 1;" />
              <VTextField label="Quota (GB)" type="number" v-model="formQuota" style="flex: 1;" />
            </div>
            <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 4px;">
              <VCheckbox v-model="formWelcome" label="Send welcome email" hide-details />
              <VSwitch v-model="formForward" label="Enable forwarding" color="primary" inset hide-details />
            </div>
            <template #actions>
              <NatcaButton variant="ghost" size="md">Cancel</NatcaButton>
              <NatcaButton variant="primary" size="md">Create account</NatcaButton>
            </template>
          </NatcaCard>
        </div>
        <div style="flex: 1; min-width: 280px;">
          <NatcaAnnotation style="margin-bottom: 12px;">
            <strong>natcaDefaults handles for you:</strong><br>
            <code>VTextField</code> · <code>VSelect</code> · <code>VAutocomplete</code> · <code>VTextarea</code> all render outlined / compact / primary focus.<br>
            <code>VCheckbox</code> · <code>VSwitch</code> · <code>VRadio</code> render at compact density with primary color and hideDetails="auto".
          </NatcaAnnotation>
          <NatcaAnnotation type="warning">
            <strong>Use NatcaButton for the submit row.</strong>
            VBtn defaults to size "default" — fine for Vuetify-internal buttons (menus, dialogs)
            but you almost never want it as your form submit. Always reach for
            <code>NatcaButton size="md"</code>.
          </NatcaAnnotation>
        </div>
      </div>
    </section>

    <!-- ═══════════ ALERTS ═══════════ -->
    <section class="ds-section">
      <h3 class="ds-section-title">Alerts</h3>
      <p class="ds-body">
        <code>NatcaAlert</code> — colored strong text + border-start + tonal background.
        No icons (Vuetify's VAlert forces them; we don't want that here).
      </p>

      <div style="max-width: 640px; display: flex; flex-direction: column; gap: 8px;">
        <NatcaAlert type="info"><div><strong>Info:</strong> Migration batch #12 is scheduled for tonight at 0200 ET.</div></NatcaAlert>
        <NatcaAlert type="success"><div><strong>Success:</strong> 47 accounts migrated successfully to Mailcow.</div></NatcaAlert>
        <NatcaAlert type="warning"><div><strong>Warning:</strong> 3 accounts have exceeded their quota limit.</div></NatcaAlert>
        <NatcaAlert type="danger"><div><strong>Error:</strong> Failed to connect to Mailcow API. Check credentials.</div></NatcaAlert>
      </div>
    </section>

    <!-- ═══════════ CHIPS ═══════════ -->
    <section class="ds-section">
      <h3 class="ds-section-title">Chips &amp; status badges</h3>
      <p class="ds-body">
        <code>VChip color="…" variant="tonal"</code>. NATCA SASS handles the pill shape, weight,
        and 11.5px size; <code>vuetify-overrides.css</code> bumps the tonal background opacity
        in dark mode so neutral chips stay legible.
      </p>

      <div class="d-flex ga-2 flex-wrap" style="margin-bottom: 12px;">
        <VChip color="success" variant="tonal">Active</VChip>
        <VChip color="warning" variant="tonal">Pending</VChip>
        <VChip color="error" variant="tonal">Disabled</VChip>
        <VChip color="info" variant="tonal">Migrating</VChip>
        <VChip variant="tonal">Archived</VChip>
        <VChip variant="tonal">Draft</VChip>
      </div>

      <NatcaAnnotation style="max-width: 640px;">
        <strong>Color map:</strong> <code>success</code> · <code>warning</code> ·
        <code>error</code> · <code>info</code> · default. Default (no <code>color</code> prop)
        is the neutral pill — use it for low-emphasis labels like "Archived" or "Draft".
      </NatcaAnnotation>
    </section>

    <!-- ═══════════ TABS ═══════════ -->
    <section class="ds-section">
      <h3 class="ds-section-title">Tabs</h3>
      <p class="ds-body">
        Two layouts: <strong>standalone</strong> (tabs sit on the page background, panels render
        inline) and <strong>inside a card</strong> (tabs become the card's header). Both use
        <code>NatcaTabs</code> — same component, different parent. The active tab gets primary
        accent (navy in light, red in dark) and a 2px slider. Icons are optional.
      </p>

      <p class="eyebrow">Standalone — sits on the page background</p>
      <div style="margin-bottom: 24px;">
        <NatcaTabs v-model="standaloneTab" :items="standaloneItems">
          <template #panel-overview>
            <p>Page-level tabs sit directly on the content background. Use this when the tabbed
              region <em>is</em> the page (e.g. a member-detail screen with Overview / Roster /
              Documents / Audit log).</p>
          </template>
          <template #panel-roster>
            <p>42 members assigned to this section.</p>
          </template>
          <template #panel-documents>
            <p>Documents tab content.</p>
          </template>
          <template #panel-audit>
            <p>Audit log tab content.</p>
          </template>
        </NatcaTabs>
      </div>

      <p class="eyebrow">Inside a card — tabs as card header</p>
      <NatcaCard no-body-padding>
        <NatcaTabs v-model="localTab" :items="localTabItems">
          <template #panel-details>
            <p>Use this layout when the tabs scope a sub-section of the page rather than the
              whole page. The card's outer border separates it from neighboring content.
              Icons are supported but optional — drop them when labels alone are clear.</p>
          </template>
          <template #panel-members>
            <p>198 members assigned.</p>
          </template>
          <template #panel-history>
            <p>Audit log and change history.</p>
          </template>
        </NatcaTabs>
      </NatcaCard>
    </section>

    <!-- ═══════════ PILLS ═══════════ -->
    <section class="ds-section">
      <h3 class="ds-section-title">Pills</h3>
      <p class="ds-body">
        <code>NatcaPillNav</code> — segmented filter / view-toggle. Active pill is solid navy
        in light theme, solid red in dark theme. Use for binary or 3-5 way filters; reach for
        tabs once you cross 5 options or need icons + counts.
      </p>

      <div class="ds-row" style="gap: 28px;">
        <div>
          <p class="eyebrow">Status filter</p>
          <NatcaPillNav
            v-model="filterStatus"
            :items="[
              { value: 'all', label: 'All' },
              { value: 'active', label: 'Active' },
              { value: 'pending', label: 'Pending' },
              { value: 'disabled', label: 'Disabled' },
            ]"
          />
        </div>
        <div>
          <p class="eyebrow">View</p>
          <NatcaPillNav
            v-model="viewMode"
            :items="[
              { value: 'list', label: 'List' },
              { value: 'grid', label: 'Grid' },
              { value: 'map', label: 'Map' },
            ]"
          />
        </div>
        <div>
          <p class="eyebrow">Time range</p>
          <NatcaPillNav
            v-model="timeRange"
            :items="[
              { value: '7d', label: '7d' },
              { value: '30d', label: '30d' },
              { value: '90d', label: '90d' },
              { value: '1y', label: '1y' },
            ]"
          />
        </div>
      </div>
    </section>

    <!-- ═══════════ DIALOGS ═══════════ -->
    <section class="ds-section">
      <h3 class="ds-section-title">Dialogs</h3>
      <p class="ds-body">
        <code>NatcaDialog</code> wraps VDialog with three layouts:
        <strong>default</strong> (navy header strip + icon + title + subtitle — confirm dialogs, forms),
        <strong>danger</strong> (red header strip — destructive confirmation),
        and <strong>bare</strong> (chromeless — image preview / lightbox / single-content overlay).
      </p>

      <div class="ds-btn-row">
        <NatcaButton variant="primary" @click="showConfirmDialog = true">Open confirm dialog</NatcaButton>
        <NatcaButton variant="danger" @click="showDangerDialog = true">Open danger dialog</NatcaButton>
        <NatcaButton variant="secondary" @click="showBareDialog = true">Open bare dialog</NatcaButton>
      </div>

      <NatcaDialog
        v-model="showConfirmDialog"
        title="Confirm migration"
        subtitle="Batch #12 · 34 accounts"
        icon="mdi-swap-horizontal-circle"
      >
        Are you sure you want to migrate <strong>34 accounts</strong> from O365 to Mailcow? This action cannot be undone.
        <template #actions>
          <NatcaButton variant="ghost" size="md" @click="showConfirmDialog = false">Cancel</NatcaButton>
          <NatcaButton variant="primary" size="md" @click="showConfirmDialog = false">Migrate now</NatcaButton>
        </template>
      </NatcaDialog>

      <NatcaDialog
        v-model="showDangerDialog"
        title="Delete account"
        subtitle="This action cannot be undone"
        variant="danger"
        icon="mdi-trash-can"
      >
        This will permanently delete <strong>jason.doss@natca.net</strong> and all associated data.
        <template #actions>
          <NatcaButton variant="ghost" size="md" @click="showDangerDialog = false">Cancel</NatcaButton>
          <NatcaButton variant="danger" size="md" @click="showDangerDialog = false">Delete account</NatcaButton>
        </template>
      </NatcaDialog>

      <NatcaDialog v-model="showBareDialog" variant="bare" :max-width="720">
        <div style="background: linear-gradient(135deg, #003366 0%, #6AC9FF 100%); aspect-ratio: 16/9; display: flex; align-items: center; justify-content: center; color: #FFFFFF; font-family: var(--font-display); font-size: 32px; font-weight: 700; letter-spacing: 1px;">
          Bare dialog content
        </div>
      </NatcaDialog>
    </section>

    <!-- ═══════════ DOCUMENT VIEWER ═══════════ -->
    <section class="ds-section">
      <h3 class="ds-section-title">Document viewer</h3>
      <p class="ds-body">
        <code>NatcaDocumentViewer</code> renders PDFs inline via <code>pdf.js</code>, images
        directly, and falls back to a download CTA for unsupported types. Two modes:
        <strong>inline</strong> (this card) for a doc detail page, and <strong>lightbox</strong>
        (the button below) for browse / search results. The component knows nothing about DMS
        — pass it a URL + metadata and listen for <code>view</code>, <code>download</code>,
        <code>version-change</code>, and <code>chapter-change</code> events. App-level wrappers
        like <code>@natca-itc/dms-client</code>'s <code>DmsViewer</code> add the API plumbing.
      </p>

      <p class="eyebrow">Inline — with chapter TOC and version selector</p>
      <NatcaDocumentViewer
        :document-url="demoPdfUrl"
        :metadata="{
          title: 'Trace-based Just-in-Time Type Specialization',
          summary: 'Demo PDF — paper from Mozilla\'s pdf.js test corpus.',
          period: 'FY2009',
          version: 'v2',
          lastUpdated: '2024-09-15',
        }"
        :versions="demoVersions"
        :chapters="demoChapters"
        :anchor="demoChapterAnchor"
        @chapter-change="demoChapterAnchor = $event"
      />

      <p class="eyebrow" style="margin-top: 24px;">Lightbox — full-screen preview</p>
      <div class="ds-btn-row">
        <NatcaButton variant="primary" @click="showViewerLightbox = true">
          Open in lightbox
        </NatcaButton>
      </div>
      <NatcaDocumentViewer
        v-model:open="showViewerLightbox"
        mode="lightbox"
        :document-url="demoPdfUrl"
        :metadata="{ title: 'Lightbox preview', version: 'v2' }"
      />

      <NatcaAnnotation style="margin-top: 16px; max-width: 760px;">
        <strong>pdf.js is an optional peer dep.</strong> Install <code>pdfjs-dist</code> in the
        consuming app to enable PDF rendering; image and download-CTA paths work without it.
        The worker URL is auto-resolved via <code>import.meta.url</code>.
      </NatcaAnnotation>
    </section>

    <!-- ═══════════ STATES ═══════════ -->
    <section class="ds-section">
      <h3 class="ds-section-title">States</h3>
      <p class="ds-body">
        Loading, empty, and error states. Each is a card-shaped container so the page layout
        stays predictable while data arrives or recovers.
      </p>

      <div class="ds-row">
        <div style="flex: 1; min-width: 280px;">
          <p class="eyebrow">Loading</p>
          <NatcaCard>
            <VProgressLinear :model-value="65" color="primary" rounded height="4" style="margin-bottom: 8px;" />
            <span style="font-size: 12px; color: var(--color-text-faint);">Migrating accounts… 22 of 34</span>
          </NatcaCard>
        </div>
        <div style="flex: 1; min-width: 280px;">
          <p class="eyebrow">Empty</p>
          <NatcaCard no-body-padding>
            <NatcaEmptyState
              icon="mdi-file-document-outline"
              title="No accounts found"
              description="No email accounts match your current filters."
              action-label="Reset filters"
            />
          </NatcaCard>
        </div>
      </div>

      <div style="margin-top: 16px; max-width: 640px;">
        <p class="eyebrow">Error</p>
        <NatcaAlert type="danger">
          <div style="display: flex; align-items: center; gap: 12px; width: 100%;">
            <div style="flex: 1;">
              <strong>Failed to load accounts</strong>
              <div style="margin-top: 2px; font-size: 12px; color: var(--color-text-muted);">The Mailcow API returned an error.</div>
            </div>
            <NatcaButton variant="danger">Retry</NatcaButton>
          </div>
        </NatcaAlert>
      </div>
    </section>

    <!-- ═══════════ ANNOTATIONS ═══════════ -->
    <section class="ds-section">
      <h3 class="ds-section-title">Annotations</h3>
      <p class="ds-body">
        Inline guidance callouts. Three variants — <code>info</code>, <code>tip</code>,
        <code>warning</code>. Use sparingly within page content; for one-off page-level
        callouts reach for <code>NatcaCard accent="…"</code> instead.
      </p>

      <div style="display: flex; flex-direction: column; gap: 8px; max-width: 640px;">
        <NatcaAnnotation>
          <strong>Info:</strong> Use annotations to explain how a feature works or provide
          guidance to users.
        </NatcaAnnotation>
        <NatcaAnnotation type="tip">
          <strong>Tip:</strong> You can use <code>NatcaAnnotation type="tip"</code> for positive
          guidance.
        </NatcaAnnotation>
        <NatcaAnnotation type="warning">
          <strong>Warning:</strong> Breaking changes should always use the warning variant.
        </NatcaAnnotation>
      </div>
    </section>

    <!-- ═══════════ MEMBER CARD ═══════════ -->
    <section class="ds-section">
      <h3 class="ds-section-title">Member card</h3>
      <p class="ds-body">
        Domain-specific component for displaying a NATCA member. Two layouts — default (compact
        row) and detailed (with optional accent border + actions).
      </p>

      <div class="ds-row">
        <div style="flex: 1; min-width: 280px;">
          <p class="eyebrow">Default — compact</p>
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <NatcaMemberCard v-for="m in members" :key="m.memberNumber" :member="m" clickable />
          </div>
        </div>
        <div style="flex: 1; min-width: 280px;">
          <p class="eyebrow">Detailed + actions</p>
          <NatcaMemberCard :member="members[0]" variant="detailed" accent-border>
            <template #actions>
              <NatcaButton variant="link">View profile</NatcaButton>
              <NatcaButton variant="ghost">Message</NatcaButton>
            </template>
          </NatcaMemberCard>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.ds-page {
  padding: 0 24px 48px;
  max-width: 1080px;
}

.ds-section {
  padding: 24px 0;
}

.ds-section-title {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 8px;
  padding-bottom: 6px;
  border-bottom: 3px solid var(--natca-red);
  display: inline-block;
}

.ds-body {
  font-size: 14px;
  color: var(--color-text-body);
  line-height: 1.55;
  margin: 0 0 14px;
  max-width: 760px;
}

.ds-body code {
  font-size: 12px;
  background: var(--overlay-hover);
  padding: 1px 5px;
  border-radius: 3px;
  font-family: var(--font-mono);
  color: var(--color-text-primary);
}

.eyebrow {
  font-family: var(--font-display);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: var(--color-text-muted);
  margin: 0 0 8px;
}

.ds-row {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.ds-btn-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
}

.ds-field-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
}

.ds-field-grid--2col {
  grid-template-columns: 1fr 1fr;
}

.ds-field-label {
  font-size: 10px;
  color: var(--color-text-faint);
  text-transform: uppercase;
  letter-spacing: 0.6px;
  font-weight: 700;
}

.ds-field-value {
  font-weight: 600;
  font-size: 13.5px;
  color: var(--color-text-primary);
}

/* Dashboard grid — 4 columns of equal width, cards span columns/rows */
.ds-dashboard-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  align-items: stretch;
}

@media (max-width: 900px) {
  .ds-dashboard-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Table toolbar inside a card-wrapped data table */
.ds-table-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background: var(--overlay-subtle);
  border-bottom: 1px solid var(--overlay-border);
}

.ds-table-toolbar :deep(.v-input) {
  font-size: 12px;
}

/* Props tables — Light: visible row dividers + dark header text.
   Dark: dark header background, lifted body text, no disappearing rows. */
.ds-props-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 13.5px;
  margin-bottom: 8px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.ds-props-table thead th {
  background: var(--color-bg-subtle);
  padding: 10px 14px;
  text-align: left;
  font-family: var(--font-display);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: var(--color-text-primary);
  font-weight: 700;
  border-bottom: 1px solid var(--color-border);
}

.ds-props-table tbody td {
  padding: 10px 14px;
  border-bottom: 1px solid var(--color-border);
  vertical-align: middle;
  color: var(--color-text-body);
}

.ds-props-table tbody tr:last-child td {
  border-bottom: none;
}

.ds-props-table tbody tr:nth-child(even) td {
  background: var(--overlay-subtle);
}

.ds-props-table code {
  font-size: 12px;
  background: var(--overlay-hover);
  padding: 2px 6px;
  border-radius: 3px;
  font-family: var(--font-mono);
  color: var(--color-text-primary);
}
</style>
