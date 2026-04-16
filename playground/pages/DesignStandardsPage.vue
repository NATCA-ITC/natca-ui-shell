<script setup lang="ts">
import { ref } from 'vue'
import {
  NatcaTabs,
  NatcaHeaderCard,
  NatcaStatCard,
  NatcaStatGrid,
  NatcaEmptyState,
  NatcaPageHeader,
  NatcaAnnotation,
  NatcaMemberCard,
} from '@/index'
import type { NatcaTabItem } from '@/components/NatcaTabs.vue'
import type { MemberCardData } from '@/components/NatcaMemberCard.vue'
import {
  VBtn, VCard, VCardTitle, VCardSubtitle, VCardText, VCardActions,
  VSpacer, VChip, VAlert, VProgressLinear, VTextField, VSelect,
  VAutocomplete, VCheckbox, VSwitch, VDataTable, VDialog, VDivider,
  VBtnToggle, VIcon,
} from 'vuetify/components'

// ── Button demos ──

// ── Tabs demo ──
const localTab = ref('details')
const localTabItems: NatcaTabItem[] = [
  { id: 'details', label: 'Details', icon: 'mdi-information-outline' },
  { id: 'members', label: 'Members', badge: 198 },
  { id: 'history', label: 'History' },
]

const pillTab = ref('30d')
const pillItems: NatcaTabItem[] = [
  { id: '7d', label: '7d' },
  { id: '30d', label: '30d' },
  { id: '90d', label: '90d' },
  { id: '1y', label: '1y' },
]

const viewTab = ref('list')
const viewItems: NatcaTabItem[] = [
  { id: 'list', label: 'List' },
  { id: 'grid', label: 'Grid' },
  { id: 'map', label: 'Map' },
]

// ── Pill nav (VBtnToggle) demo ──
const filterPill = ref('all')

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
]

function statusColor(status: string) {
  const map: Record<string, string> = { Active: 'success', Pending: 'warning', Disabled: 'error' }
  return map[status] || 'default'
}

// ── Dialog demo ──
const showConfirmDialog = ref(false)
const showDangerDialog = ref(false)

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
    <NatcaPageHeader title="Design Standards" subtitle="Every component from @natca-itc/ui-shell, rendered live with Vuetify + natcaDefaults">
      <template #actions>
        <a href="/natca-design-system.html" target="_blank" class="ds-link">
          Open Static Reference
        </a>
      </template>
    </NatcaPageHeader>

    <NatcaAnnotation>
      <strong>This page uses the real package components.</strong>
      Toggle light/dark with the sun/moon button in the topbar. Every pattern below should match the static design system reference exactly.
    </NatcaAnnotation>

    <!-- ═══════════ BUTTONS ═══════════ -->
    <section class="ds-section">
      <h3 class="ds-section-title">Button Tiers</h3>

      <p class="eyebrow">Button Colors</p>
      <NatcaAnnotation style="margin-bottom: 16px; max-width: 600px;">
        <strong>natcaDefaults.VBtn</strong> sets <code>variant: 'flat', size: 'small', density: 'compact'</code>.
        You MUST still set <code>variant</code> for non-primary buttons and <code>color</code> for semantic meaning.
      </NatcaAnnotation>

      <table class="ds-props-table">
        <thead><tr><th>Variant</th><th>Vuetify Code</th><th>When to Use</th></tr></thead>
        <tbody>
          <tr>
            <td><VBtn color="primary">Primary</VBtn></td>
            <td><code>color="primary"</code></td>
            <td>Main action (save, submit, confirm)</td>
          </tr>
          <tr>
            <td><VBtn variant="outlined">Secondary</VBtn></td>
            <td><code>variant="outlined"</code></td>
            <td>Secondary actions (export, edit)</td>
          </tr>
          <tr>
            <td><VBtn variant="outlined" color="error">Danger</VBtn></td>
            <td><code>variant="outlined" color="error"</code></td>
            <td>Destructive (delete, remove)</td>
          </tr>
          <tr>
            <td><VBtn variant="text">Ghost</VBtn></td>
            <td><code>variant="text"</code></td>
            <td>Cancel, dismiss, tertiary</td>
          </tr>
          <tr>
            <td><VBtn variant="text" color="info">Link</VBtn></td>
            <td><code>variant="text" color="info"</code></td>
            <td>Inline navigation (view details)</td>
          </tr>
        </tbody>
      </table>

      <div class="ds-row" style="margin-top: 16px;">
        <div>
          <p class="eyebrow">Toolbar Tier (default VBtn)</p>
          <p class="ds-hint">density: compact, size: small. Filters, table actions, toolbars.</p>
          <div class="ds-btn-row">
            <VBtn color="primary">Save</VBtn>
            <VBtn variant="outlined">Export</VBtn>
            <VBtn variant="outlined" color="error">Delete</VBtn>
            <VBtn variant="text">Cancel</VBtn>
            <VBtn variant="text" color="info">View Details</VBtn>
          </div>
        </div>
        <div>
          <p class="eyebrow">Action Tier (VCardActions / Dialogs)</p>
          <p class="ds-hint">density: default, size: default. Auto-applied inside v-card-actions.</p>
          <VCard style="max-width: 400px;">
            <VCardActions>
              <VSpacer />
              <VBtn variant="text">Cancel</VBtn>
              <VBtn color="primary">Submit Request</VBtn>
            </VCardActions>
          </VCard>
        </div>
      </div>
    </section>

    <VDivider />

    <!-- ═══════════ CARDS ═══════════ -->
    <section class="ds-section">
      <h3 class="ds-section-title">Cards</h3>

      <p class="eyebrow">Header Card</p>
      <p class="ds-hint">Navy header with icon + title. Use for profile sections, account details, feature cards.</p>
      <div class="ds-row">
        <div style="flex: 1;">
          <NatcaHeaderCard icon="mdi-account" title="My Email Account" subtitle="jason.doss@natca.net · ZJX">
            <div class="ds-field-grid">
              <div><span class="ds-field-label">Provider</span><br><span class="ds-field-value">Mailcow</span></div>
              <div><span class="ds-field-label">Storage</span><br><span class="ds-field-value">2.1 / 5 GB</span></div>
              <div><span class="ds-field-label">Status</span><br><VChip color="success">Active</VChip></div>
            </div>
            <template #actions>
              <VBtn variant="text">Settings</VBtn>
              <VBtn color="primary">Manage Account</VBtn>
            </template>
          </NatcaHeaderCard>
        </div>
        <div style="flex: 1;">
          <NatcaHeaderCard icon="mdi-briefcase" title="Migration Status" subtitle="Batch #12 · 34 accounts">
            <VProgressLinear :model-value="65" style="margin-bottom: 8px;" />
            <div class="d-flex justify-space-between" style="font-size: 11px;">
              <span style="color: var(--color-text-muted);">22 of 34 migrated</span>
              <span style="color: var(--color-success); font-weight: 600;">65%</span>
            </div>
          </NatcaHeaderCard>
        </div>
      </div>

      <p class="eyebrow" style="margin-top: 20px;">Card with Actions</p>
      <div class="ds-row">
        <div style="flex: 1;">
          <VCard>
            <VCardTitle>Email Account</VCardTitle>
            <VCardSubtitle>jason@natca.net · Active</VCardSubtitle>
            <VCardText>
              <div class="ds-field-grid">
                <div><span class="ds-field-label">Provider</span><br><span class="ds-field-value">Mailcow</span></div>
                <div><span class="ds-field-label">Quota</span><br><span class="ds-field-value">2.1 / 5 GB</span></div>
                <div><span class="ds-field-label">Status</span><br><VChip color="success">Active</VChip></div>
              </div>
            </VCardText>
            <VCardActions>
              <VSpacer />
              <VBtn variant="text">Cancel</VBtn>
              <VBtn color="primary">Save Changes</VBtn>
            </VCardActions>
          </VCard>
        </div>
        <div style="flex: 1;">
          <p class="eyebrow">Stat Cards</p>
          <NatcaStatGrid :cols="2">
            <NatcaStatCard label="Total Accounts" value="1,247" change="+12 this week" />
            <NatcaStatCard label="Active" value="1,198" />
            <NatcaStatCard label="Pending Migration" value="34" />
            <NatcaStatCard label="Disabled" value="15" />
          </NatcaStatGrid>
        </div>
      </div>
    </section>

    <VDivider />

    <!-- ═══════════ DATA TABLE ═══════════ -->
    <section class="ds-section">
      <h3 class="ds-section-title">Data Table</h3>
      <p class="ds-hint">Compact density with hover. Uses <code>&lt;v-data-table&gt;</code> with natcaDefaults.</p>

      <div class="d-flex align-center ga-2" style="margin-bottom: 12px;">
        <VBtnToggle v-model="filterPill">
          <VBtn value="all">All</VBtn>
          <VBtn value="active">Active</VBtn>
          <VBtn value="pending">Pending</VBtn>
          <VBtn value="disabled">Disabled</VBtn>
        </VBtnToggle>
        <VSpacer />
        <VTextField placeholder="Search accounts..." style="max-width: 200px;" hide-details />
      </div>

      <VCard>
        <VDataTable :headers="tableHeaders" :items="tableItems" :items-per-page="-1" hide-default-footer>
          <template #item.status="{ item }">
            <VChip :color="statusColor(item.status)">{{ item.status }}</VChip>
          </template>
          <template #item.actions="{ item }">
            <VBtn variant="text" size="small">View</VBtn>
          </template>
        </VDataTable>
      </VCard>
    </section>

    <VDivider />

    <!-- ═══════════ FORMS ═══════════ -->
    <section class="ds-section">
      <h3 class="ds-section-title">Forms</h3>
      <p class="ds-hint">All form fields use outlined variant, compact density, primary focus color via natcaDefaults.</p>

      <div class="ds-row">
        <div style="flex: 1;">
          <VCard>
            <VCardTitle>Create Email Account</VCardTitle>
            <VCardText>
              <VAutocomplete label="Member" placeholder="Search members..." :items="['Jason Doss', 'Sarah Mitchell']" />
              <VTextField label="Email Address" placeholder="first.last@natca.net" />
              <div class="d-flex ga-3">
                <VSelect label="Provider" :items="['Mailcow', 'O365']" v-model="formProvider" style="flex: 1;" />
                <VTextField label="Quota (GB)" type="number" v-model="formQuota" style="flex: 1;" />
              </div>
              <VCheckbox v-model="formWelcome" label="Send welcome email" />
              <VSwitch v-model="formForward" label="Enable forwarding" />
            </VCardText>
            <VCardActions>
              <VSpacer />
              <VBtn variant="text">Cancel</VBtn>
              <VBtn color="primary">Create Account</VBtn>
            </VCardActions>
          </VCard>
        </div>
        <div style="flex: 1;">
          <NatcaAnnotation style="margin-bottom: 12px;">
            <strong>natcaDefaults handles:</strong><br>
            <code>VTextField</code> → outlined, compact, primary focus<br>
            <code>VSelect</code> → outlined, compact, primary focus<br>
            <code>VAutocomplete</code> → outlined, compact, primary focus<br>
            <code>VCheckbox</code> → compact, primary, hideDetails auto<br>
            <code>VSwitch</code> → compact, primary, inset, hideDetails auto
          </NatcaAnnotation>
          <NatcaAnnotation type="warning">
            <strong>Never do this:</strong><br>
            <code style="color: var(--color-danger);">&lt;v-text-field variant="outlined" density="compact" color="primary" /&gt;</code><br>
            All three props are already set by natcaDefaults. Just use:<br>
            <code style="color: var(--color-success);">&lt;v-text-field label="Email" /&gt;</code>
          </NatcaAnnotation>
        </div>
      </div>
    </section>

    <VDivider />

    <!-- ═══════════ ALERTS ═══════════ -->
    <section class="ds-section">
      <h3 class="ds-section-title">Alerts</h3>
      <p class="ds-hint">Tonal variant with border-start. All set by natcaDefaults.VAlert.</p>

      <div style="max-width: 600px; display: flex; flex-direction: column; gap: 8px;">
        <VAlert type="info">Migration batch #12 is scheduled for tonight at 0200 ET.</VAlert>
        <VAlert type="success">47 accounts migrated successfully to Mailcow.</VAlert>
        <VAlert type="warning">3 accounts have exceeded their quota limit.</VAlert>
        <VAlert type="error">Failed to connect to Mailcow API. Check credentials.</VAlert>
      </div>
    </section>

    <VDivider />

    <!-- ═══════════ CHIPS ═══════════ -->
    <section class="ds-section">
      <h3 class="ds-section-title">Chips &amp; Status Badges</h3>
      <p class="ds-hint">Pill-shaped, small, compact. Use Vuetify <code>color</code> prop for semantic coloring.</p>

      <div class="d-flex ga-2 flex-wrap" style="margin-bottom: 12px;">
        <VChip color="success">Active</VChip>
        <VChip color="warning">Pending</VChip>
        <VChip color="error">Disabled</VChip>
        <VChip color="info">Migrating</VChip>
        <VChip>Archived</VChip>
      </div>

      <NatcaAnnotation style="max-width: 500px;">
        <strong>Usage:</strong> <code>&lt;v-chip color="success"&gt;Active&lt;/v-chip&gt;</code><br>
        natcaDefaults sets <code>rounded: 'pill', size: 'small', density: 'compact'</code>.
      </NatcaAnnotation>
    </section>

    <VDivider />

    <!-- ═══════════ TABS ═══════════ -->
    <section class="ds-section">
      <h3 class="ds-section-title">Tabs</h3>

      <div class="ds-row">
        <div style="flex: 1;">
          <p class="eyebrow">Underline (Default)</p>
          <VCard style="overflow: hidden;">
            <NatcaTabs v-model="localTab" :items="localTabItems">
              <template #panel-details>
                <p style="font-size: 12px; color: var(--color-text-muted);">Tab panel content. Compact 36px height, Barlow font, red slider for active state.</p>
              </template>
              <template #panel-members>
                <p style="font-size: 12px; color: var(--color-text-muted);">198 members assigned.</p>
              </template>
              <template #panel-history>
                <p style="font-size: 12px; color: var(--color-text-muted);">Audit log and change history.</p>
              </template>
            </NatcaTabs>
          </VCard>
        </div>
        <div style="flex: 1;">
          <p class="eyebrow">Pills (Inline Toggle)</p>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div>
              <span class="ds-field-label" style="margin-bottom: 4px; display: block;">Time Range</span>
              <NatcaTabs v-model="pillTab" :items="pillItems" variant="pills" />
            </div>
            <div>
              <span class="ds-field-label" style="margin-bottom: 4px; display: block;">View</span>
              <NatcaTabs v-model="viewTab" :items="viewItems" variant="pills" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <VDivider />

    <!-- ═══════════ DIALOGS ═══════════ -->
    <section class="ds-section">
      <h3 class="ds-section-title">Dialogs</h3>
      <p class="ds-hint">natcaDefaults.VDialog sets max-width 600px. Cards inside get rounded-lg, elevation 8, no border.</p>

      <div class="ds-btn-row">
        <VBtn color="primary" @click="showConfirmDialog = true">Open Confirm Dialog</VBtn>
        <VBtn variant="outlined" color="error" @click="showDangerDialog = true">Open Danger Dialog</VBtn>
      </div>

      <VDialog v-model="showConfirmDialog">
        <VCard>
          <VCardTitle>Confirm Migration</VCardTitle>
          <VCardText>Are you sure you want to migrate <strong>34 accounts</strong> from O365 to Mailcow? This action cannot be undone.</VCardText>
          <VCardActions>
            <VSpacer />
            <VBtn variant="text" @click="showConfirmDialog = false">Cancel</VBtn>
            <VBtn color="primary" @click="showConfirmDialog = false">Migrate Now</VBtn>
          </VCardActions>
        </VCard>
      </VDialog>

      <VDialog v-model="showDangerDialog">
        <VCard>
          <VCardTitle>Delete Account</VCardTitle>
          <VCardText>This will permanently delete <strong>jason.doss@natca.net</strong> and all associated data.</VCardText>
          <VCardActions>
            <VSpacer />
            <VBtn variant="text" @click="showDangerDialog = false">Cancel</VBtn>
            <VBtn variant="outlined" color="error" @click="showDangerDialog = false">Delete Account</VBtn>
          </VCardActions>
        </VCard>
      </VDialog>
    </section>

    <VDivider />

    <!-- ═══════════ STATES ═══════════ -->
    <section class="ds-section">
      <h3 class="ds-section-title">States</h3>

      <div class="ds-row">
        <div style="flex: 1;">
          <p class="eyebrow">Loading</p>
          <VCard>
            <VCardText>
              <VProgressLinear :model-value="65" style="margin-bottom: 8px;" />
              <span style="font-size: 11px; color: var(--color-text-faint);">Migrating accounts... 22 of 34</span>
            </VCardText>
          </VCard>
        </div>
        <div style="flex: 1;">
          <p class="eyebrow">Empty State</p>
          <VCard>
            <NatcaEmptyState
              icon="mdi-file-document-outline"
              title="No accounts found"
              description="No email accounts match your current filters. Try adjusting the search or filter criteria."
              action-label="Reset Filters"
            />
          </VCard>
        </div>
      </div>

      <div style="max-width: 50%; margin-top: 16px;">
        <p class="eyebrow">Error State (Inline)</p>
        <VAlert type="error" style="align-items: center;">
          <div class="d-flex align-center ga-3" style="width: 100%;">
            <div style="flex: 1;">
              <strong>Failed to load accounts</strong>
              <div style="margin-top: 2px; font-size: 11px; color: var(--color-text-muted);">The Mailcow API returned an error.</div>
            </div>
            <VBtn variant="outlined" color="error" size="small">Retry</VBtn>
          </div>
        </VAlert>
      </div>
    </section>

    <VDivider />

    <!-- ═══════════ ANNOTATION ═══════════ -->
    <section class="ds-section">
      <h3 class="ds-section-title">Annotations</h3>
      <p class="ds-hint">Info callout boxes for guidance and contextual help.</p>

      <div style="display: flex; flex-direction: column; gap: 8px; max-width: 600px;">
        <NatcaAnnotation>
          <strong>Info:</strong> Use annotations to explain how a feature works or provide guidance to users.
        </NatcaAnnotation>
        <NatcaAnnotation type="tip">
          <strong>Tip:</strong> You can use <code>NatcaAnnotation</code> with type <code>"tip"</code> for positive guidance.
        </NatcaAnnotation>
        <NatcaAnnotation type="warning">
          <strong>Warning:</strong> Breaking changes should always use the warning variant.
        </NatcaAnnotation>
      </div>
    </section>

    <VDivider />

    <!-- ═══════════ MEMBER CARD ═══════════ -->
    <section class="ds-section">
      <h3 class="ds-section-title">Member Card</h3>

      <div class="ds-row">
        <div style="flex: 1;">
          <p class="eyebrow">Default</p>
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <NatcaMemberCard v-for="m in members" :key="m.memberNumber" :member="m" clickable />
          </div>
        </div>
        <div style="flex: 1;">
          <p class="eyebrow">Detailed + Actions</p>
          <NatcaMemberCard :member="members[0]" variant="detailed" accent-border>
            <template #actions>
              <VBtn size="small" variant="text" color="info">View Profile</VBtn>
              <VBtn size="small" variant="text">Message</VBtn>
            </template>
          </NatcaMemberCard>
        </div>
      </div>
    </section>

    <VDivider />

    <!-- ═══════════ PAGE HEADER ═══════════ -->
    <section class="ds-section">
      <h3 class="ds-section-title">Page Header</h3>

      <VCard>
        <VCardText>
          <NatcaPageHeader title="Member Accounts" subtitle="1,247 accounts across all facilities">
            <template #actions>
              <VBtn color="primary">Create Account</VBtn>
            </template>
          </NatcaPageHeader>
        </VCardText>
      </VCard>
    </section>
  </div>
</template>

<style scoped>
.ds-page {
  padding: 0 20px 40px;
  max-width: 960px;
}

.ds-section {
  padding: 20px 0;
}

.ds-section-title {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 4px;
  padding-bottom: 4px;
  border-bottom: 3px solid var(--natca-red);
  display: inline-block;
}

.eyebrow {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--color-text-faint);
  margin-bottom: 6px;
}

.ds-hint {
  font-size: 12px;
  color: var(--color-text-muted);
  margin-bottom: 12px;
}

.ds-hint code {
  font-size: 11px;
  background: var(--overlay-hover);
  padding: 1px 4px;
  border-radius: 3px;
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

.ds-field-label {
  font-size: 10px;
  color: var(--color-text-faint);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 700;
}

.ds-field-value {
  font-weight: 600;
  font-size: 13px;
}

.ds-link {
  color: var(--natca-blue);
  text-decoration: none;
  font-size: 12px;
  font-weight: 600;
}

.ds-link:hover {
  text-decoration: underline;
}

.ds-props-table {
  width: 100%;
  max-width: 700px;
  border-collapse: collapse;
  font-size: 13px;
  margin-bottom: 16px;
}

.ds-props-table th {
  background: var(--color-bg-subtle);
  padding: 6px 12px;
  text-align: left;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--color-text-muted);
}

.ds-props-table td {
  padding: 8px 12px;
  border-bottom: 1px solid var(--color-border-light);
  vertical-align: middle;
}

.ds-props-table code {
  font-size: 11px;
  background: var(--overlay-subtle);
  padding: 1px 4px;
  border-radius: 3px;
  font-family: var(--font-mono);
}
</style>
