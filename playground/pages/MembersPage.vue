<template>
  <div class="members-page">
    <div class="natca-shell-content-head">
      <div>
        <div class="natca-shell-content-title">Members</div>
        <div class="natca-shell-content-sub">2,412 members across all facilities</div>
      </div>
    </div>

    <div class="members-table-wrap">
      <table class="members-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Facility</th>
            <th>Region</th>
            <th>Position</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="member in members" :key="member.name">
            <td class="member-name">{{ member.name }}</td>
            <td>{{ member.facility }}</td>
            <td>{{ member.region }}</td>
            <td>{{ member.position }}</td>
            <td>
              <span class="status-badge" :class="member.status === 'Active' ? 'status-active' : 'status-inactive'">
                {{ member.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
const members = [
  { name: 'Anderson, K.', facility: 'ZJX', region: 'Southern', position: 'CPC', status: 'Active' },
  { name: 'Brooks, M.', facility: 'ZTL', region: 'Southern', position: 'CPC-IT', status: 'Active' },
  { name: 'Chen, L.', facility: 'ZOB', region: 'Central', position: 'CPC', status: 'Active' },
  { name: 'Davis, R.', facility: 'ZNY', region: 'Eastern', position: 'D-Side', status: 'Active' },
  { name: 'Evans, T.', facility: 'ZAU', region: 'Central', position: 'CPC', status: 'Inactive' },
  { name: 'Foster, J.', facility: 'ZLA', region: 'Western', position: 'CPC-IT', status: 'Active' },
  { name: 'Garcia, S.', facility: 'ZHU', region: 'Southwest', position: 'CPC', status: 'Active' },
  { name: 'Harris, D.', facility: 'ZDC', region: 'Eastern', position: 'CPC', status: 'Active' },
]
</script>

<style scoped>
.members-page {
  height: 100%;
  overflow-y: auto;
}

.members-table-wrap {
  padding: 16px 24px;
  overflow-x: auto;
}

.members-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.members-table th {
  text-align: left;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: var(--color-text-faint);
  padding: 10px 12px;
  border-bottom: 1px solid var(--overlay-border);
}

.members-table td {
  padding: 10px 12px;
  color: var(--color-text-body);
  border-bottom: 1px solid var(--color-sep);
}

.member-name {
  color: var(--color-text-primary) !important;
  font-weight: 600;
}

.status-badge {
  display: inline-block;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 20px;
  letter-spacing: 0.3px;
}

.status-active {
  background: rgba(76, 175, 80, 0.15);
  color: #4caf50;
}

.status-inactive {
  background: rgba(255, 152, 0, 0.15);
  color: #ff9800;
}
</style>
