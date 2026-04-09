<script setup lang="ts">
import { ref } from 'vue'
import { NatcaTabs, NatcaMemberCard } from '@/index'
import type { NatcaTabItem } from '@/components/NatcaTabs.vue'
import type { MemberCardData } from '@/components/NatcaMemberCard.vue'
import { VBtn, VDivider } from 'vuetify/components'

// ── Tabs demo data ──

const localTab = ref('details')

const localTabItems: NatcaTabItem[] = [
  { id: 'details', label: 'Details', icon: 'mdi-information-outline' },
  { id: 'members', label: 'Members', badge: 198 },
  { id: 'bids', label: 'Open Bids', badge: 3 },
  { id: 'history', label: 'History' },
]

const pillTab = ref('30d')
const pillItems: NatcaTabItem[] = [
  { id: '7d', label: '7d' },
  { id: '30d', label: '30d' },
  { id: '90d', label: '90d' },
  { id: '1y', label: '1y' },
]

const statusTab = ref('all')
const statusItems: NatcaTabItem[] = [
  { id: 'all', label: 'All' },
  { id: 'open', label: 'Open' },
  { id: 'closed', label: 'Closed' },
]

const viewTab = ref('list')
const viewItems: NatcaTabItem[] = [
  { id: 'list', label: 'List' },
  { id: 'grid', label: 'Grid' },
  { id: 'map', label: 'Map' },
]

const routerTabItems: NatcaTabItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'mdi-view-dashboard', to: '/admin' },
  { id: 'members', label: 'Members', icon: 'mdi-account-group', to: '/admin/members' },
  { id: 'facilities', label: 'Facilities', icon: 'mdi-office-building', to: '/admin/facilities' },
]

// ── Member card demo data ──

const members: MemberCardData[] = [
  { name: 'Jason Doss', initials: 'JD', facility: 'ZJX', region: 'Southern', memberType: 'BUE', memberNumber: '12345', email: 'jason.doss@natca.net' },
  { name: 'Sarah Mitchell', initials: 'SM', facility: 'ZDC', region: 'Eastern', memberType: 'CPC', memberNumber: '23456' },
  { name: 'Marcus Chen', initials: 'MC', facility: 'ZLA', region: 'Western', memberType: 'DEV', memberNumber: '34567' },
  { name: 'Emily Rodriguez', initials: 'ER', facility: 'ZAU', region: 'Central', memberType: 'NATCA Staff', memberNumber: '45678' },
]

function handleMemberClick(member: MemberCardData) {
  alert(`Clicked: ${member.name}`)
}
</script>

<template>
  <div class="components-page">
    <h2 class="page-title">Shared Components</h2>
    <p class="page-desc">
      Vuetify-wrapped components from <code>@natca-itc/ui-shell</code>.
      Compact density enforced for all authenticated pages.
    </p>

    <!-- ═══════════ NATCA TABS ═══════════ -->
    <h3 class="section-title">NatcaTabs</h3>

    <!-- Default underline tabs -->
    <p class="eyebrow">Default — Underline</p>
    <div class="demo-card">
      <NatcaTabs v-model="localTab" :items="localTabItems">
        <template #panel-details>
          <p class="demo-text"><strong>Jacksonville ARTCC (ZJX)</strong></p>
          <p class="demo-text-muted">Region: Southern · Type: ARTCC · Level: 12</p>
        </template>
        <template #panel-members>
          <p class="demo-text-muted">198 members assigned. Use the member directory for full details.</p>
        </template>
        <template #panel-bids>
          <p class="demo-text-muted">3 open bids: TMU Specialist (Apr 15), CIC (Apr 20), FLM (May 1).</p>
        </template>
        <template #panel-history>
          <p class="demo-text-muted">Audit log and change history.</p>
        </template>
      </NatcaTabs>
    </div>

    <!-- Pills -->
    <p class="eyebrow">Pills — Inline Toggles</p>
    <div class="demo-row">
      <div>
        <span class="demo-label">Time Range</span>
        <NatcaTabs v-model="pillTab" :items="pillItems" variant="pills" />
      </div>
      <div>
        <span class="demo-label">Status</span>
        <NatcaTabs v-model="statusTab" :items="statusItems" variant="pills" />
      </div>
      <div>
        <span class="demo-label">View</span>
        <NatcaTabs v-model="viewTab" :items="viewItems" variant="pills" />
      </div>
    </div>

    <!-- Router tabs -->
    <p class="eyebrow">Router Tabs</p>
    <div class="demo-card">
      <NatcaTabs :items="routerTabItems" />
      <p class="demo-text-muted" style="margin-top: 8px;">
        These navigate via Vue Router. Click one to change the active shell route.
      </p>
    </div>

    <VDivider class="section-divider" />

    <!-- ═══════════ NATCA MEMBER CARD ═══════════ -->
    <h3 class="section-title">NatcaMemberCard</h3>

    <p class="eyebrow">Default</p>
    <div class="member-list">
      <NatcaMemberCard
        v-for="member in members"
        :key="member.memberNumber"
        :member="member"
        clickable
        @click="handleMemberClick"
      />
    </div>

    <p class="eyebrow">Compact</p>
    <div class="member-list member-list--tight">
      <NatcaMemberCard
        v-for="member in members.slice(0, 3)"
        :key="member.memberNumber"
        :member="member"
        variant="compact"
      />
    </div>

    <p class="eyebrow">Detailed + Actions</p>
    <div style="max-width: 460px;">
      <NatcaMemberCard :member="members[0]" variant="detailed" accent-border>
        <template #actions>
          <VBtn size="small" variant="text" color="primary">View Profile</VBtn>
          <VBtn size="small" variant="text">Message</VBtn>
        </template>
      </NatcaMemberCard>
    </div>
  </div>
</template>

<style scoped>
.components-page {
  padding: 16px 20px;
  max-width: 860px;
}

.page-title {
  font-family: var(--font-display, 'Barlow', sans-serif);
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 4px;
}

.page-desc {
  font-size: 12px;
  color: var(--color-text-muted);
  margin-bottom: 24px;
}

.page-desc code {
  font-size: 11px;
  background: rgba(255,255,255,0.06);
  padding: 1px 4px;
  border-radius: 3px;
}

.section-title {
  font-family: var(--font-display, 'Barlow', sans-serif);
  font-size: 15px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 12px;
}

.eyebrow {
  font-family: var(--font-display, 'Barlow', sans-serif);
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--color-text-faint);
  margin-bottom: 6px;
}

.demo-card {
  background: rgba(255,255,255,0.025);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 6px;
  padding: 0;
  margin-bottom: 20px;
}

.demo-row {
  display: flex;
  gap: 24px;
  align-items: flex-start;
  margin-bottom: 20px;
}

.demo-label {
  display: block;
  font-size: 10px;
  font-weight: 600;
  color: var(--color-text-faint);
  margin-bottom: 4px;
}

.demo-text {
  font-size: 13px;
  color: var(--color-text-body);
}

.demo-text-muted {
  font-size: 12px;
  color: var(--color-text-muted);
  margin-top: 4px;
}

.section-divider {
  margin: 24px 0;
}

.member-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 20px;
}

.member-list--tight {
  gap: 3px;
}
</style>
