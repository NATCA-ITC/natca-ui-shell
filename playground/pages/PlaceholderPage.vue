<template>
  <div class="placeholder-page">
    <div class="natca-shell-content-head">
      <div>
        <div class="natca-shell-content-title">{{ title }}</div>
        <div class="natca-shell-content-sub">{{ route.path }}</div>
      </div>
    </div>

    <div class="placeholder-body">
      <div class="placeholder-card">
        <v-icon size="48" :color="'var(--color-text-faint)'">mdi-view-grid-outline</v-icon>
        <p class="placeholder-text">This is the <strong>{{ title }}</strong> page.</p>
        <p class="placeholder-sub">Content goes here. This placeholder shows the shell is rendering correctly for this route.</p>
      </div>

      <div class="placeholder-info">
        <div class="info-row">
          <span class="info-label">Route</span>
          <code class="info-val">{{ route.path }}</code>
        </div>
        <div class="info-row">
          <span class="info-label">Params</span>
          <code class="info-val">{{ JSON.stringify(route.params) }}</code>
        </div>
        <div class="info-row">
          <span class="info-label">Shell mode</span>
          <code class="info-val">{{ shellMode }}</code>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const title = computed(() => {
  const meta = route.meta as { title?: string }
  return meta.title ?? 'Page'
})

const shellMode = computed(() => {
  if (route.path.startsWith('/member')) return 'member (BID)'
  if (route.path.startsWith('/minimal')) return 'minimal (PayChecker)'
  return 'admin (Hub)'
})
</script>

<style scoped>
.placeholder-page {
  height: 100%;
  overflow-y: auto;
}

.placeholder-body {
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.placeholder-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 48px;
  border: 1px dashed var(--overlay-border);
  border-radius: 12px;
  text-align: center;
}

.placeholder-text {
  font-size: 15px;
  color: var(--color-text-body);
}

.placeholder-text strong {
  color: var(--color-text-primary);
}

.placeholder-sub {
  font-size: 12px;
  color: var(--color-text-faint);
  max-width: 400px;
}

.placeholder-info {
  background: var(--overlay-subtle);
  border: 1px solid var(--overlay-border);
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
}

.info-label {
  font-weight: 700;
  color: var(--color-text-faint);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 10px;
  width: 80px;
  flex-shrink: 0;
}

.info-val {
  color: var(--color-text-muted);
  font-family: monospace;
  font-size: 12px;
  background: var(--overlay-subtle);
  padding: 2px 8px;
  border-radius: 4px;
}
</style>
