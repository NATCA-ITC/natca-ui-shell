<template>
  <div class="dashboard-page">
    <div class="natca-shell-content-head">
      <div>
        <div class="natca-shell-content-title">Dashboard</div>
        <div class="natca-shell-content-sub">Overview of membership and activity</div>
      </div>
    </div>

    <div class="natca-shell-stat-grid">
      <div class="natca-shell-stat-card">
        <div class="natca-shell-stat-label">Total Members</div>
        <div class="natca-shell-stat-val">19,847</div>
        <div class="natca-shell-stat-change">+127 this month</div>
      </div>
      <div class="natca-shell-stat-card">
        <div class="natca-shell-stat-label">Active Facilities</div>
        <div class="natca-shell-stat-val">312</div>
        <div class="natca-shell-stat-change">All reporting</div>
      </div>
      <div class="natca-shell-stat-card">
        <div class="natca-shell-stat-label">Open Grievances</div>
        <div class="natca-shell-stat-val">84</div>
        <div class="natca-shell-stat-change" style="color: #ff9800;">+12 pending</div>
      </div>
      <div class="natca-shell-stat-card">
        <div class="natca-shell-stat-label">Sync Status</div>
        <div class="natca-shell-stat-val">OK</div>
        <div class="natca-shell-stat-change">Last run 4m ago</div>
      </div>
    </div>

    <div class="dashboard-activity">
      <div class="natca-shell-content-head" style="border-top: 1px solid var(--overlay-border);">
        <div class="natca-shell-content-title" style="font-size: 15px;">Recent Activity</div>
      </div>
      <div class="activity-list">
        <div class="activity-item">
          <span class="activity-dot" style="background: #4caf50;"></span>
          <span class="activity-text">Member sync completed — 47 records updated</span>
          <span class="activity-time">4 min ago</span>
        </div>
        <div class="activity-item">
          <span class="activity-dot" style="background: var(--natca-sky);"></span>
          <span class="activity-text">New facility ZOB onboarded to BID</span>
          <span class="activity-time">1 hour ago</span>
        </div>
        <div class="activity-item">
          <span class="activity-dot" style="background: #ff9800;"></span>
          <span class="activity-text">Grievance GR-2024-0312 escalated to Region</span>
          <span class="activity-time">3 hours ago</span>
        </div>
        <div class="activity-item">
          <span class="activity-dot" style="background: var(--natca-red);"></span>
          <span class="activity-text">Auth0 token refresh — 2 failures logged</span>
          <span class="activity-time">5 hours ago</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-page {
  height: 100%;
  overflow-y: auto;
}

.dashboard-activity {
  padding-bottom: 24px;
}

.activity-list {
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--color-sep);
  font-size: 13px;
}

.activity-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.activity-text {
  flex: 1;
  color: var(--color-text-body);
}

.activity-time {
  font-size: 11px;
  color: var(--color-text-faint);
  white-space: nowrap;
}
</style>
