<script setup lang="ts">
import type { NatcaApp } from '../types'

defineProps<{
  apps: NatcaApp[]
  currentAppId: string
}>()

const emit = defineEmits<{
  select: [app: NatcaApp]
}>()

function handleSelect(app: NatcaApp) {
  emit('select', app)
}
</script>

<template>
  <div class="natca-shell-app-switcher">
    <div class="natca-shell-app-switcher-header">
      <span class="natca-shell-app-switcher-title">Applications</span>
    </div>
    <div class="natca-shell-app-switcher-grid">
      <a
        v-for="app in apps"
        :key="app.id"
        :href="app.url"
        class="natca-shell-app-switcher-item"
        :class="{ 'natca-shell-app-switcher-active': app.id === currentAppId }"
        @click.prevent="handleSelect(app)"
      >
        <span class="natca-shell-app-switcher-icon">
          <v-icon v-if="app.icon" :icon="app.icon" size="22" />
          <span v-else class="natca-shell-app-switcher-letter">
            {{ app.name.charAt(0) }}
          </span>
        </span>
        <span class="natca-shell-app-switcher-name">{{ app.name }}</span>
        <span v-if="app.description" class="natca-shell-app-switcher-desc">
          {{ app.description }}
        </span>
      </a>
    </div>
  </div>
</template>

<style scoped>
.natca-shell-app-switcher {
  position: absolute;
  top: 52px;
  left: 140px;
  width: 320px;
  background: var(--color-shell-surface);
  border: 1px solid var(--overlay-border);
  border-radius: 10px;
  box-shadow: var(--shadow-lg);
  z-index: 110;
  overflow: hidden;
}

.natca-shell-app-switcher-header {
  padding: 12px 16px 8px;
  border-bottom: 1px solid var(--overlay-border);
}

.natca-shell-app-switcher-title {
  font-family: var(--font-display);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--color-text-faint);
}

.natca-shell-app-switcher-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2px;
  padding: 6px;
}

.natca-shell-app-switcher-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  text-decoration: none;
  color: var(--color-text-body);
  transition: all 150ms;
  cursor: pointer;
}

.natca-shell-app-switcher-item:hover {
  background: var(--overlay-hover);
  color: var(--color-text-primary);
}

.natca-shell-app-switcher-active {
  background: rgba(var(--natca-red-rgb), 0.12);
  color: var(--color-text-primary);
}

.natca-shell-app-switcher-icon {
  width: 36px;
  height: 36px;
  background: var(--overlay-hover);
  border: 1px solid var(--overlay-border);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--natca-sky);
}

.natca-shell-app-switcher-active .natca-shell-app-switcher-icon {
  background: rgba(var(--natca-red-rgb), 0.2);
  border-color: rgba(var(--natca-red-rgb), 0.3);
  color: var(--natca-red);
}

.natca-shell-app-switcher-letter {
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 700;
}

.natca-shell-app-switcher-name {
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 600;
  flex: 1;
}

.natca-shell-app-switcher-desc {
  display: block;
  font-size: 11px;
  color: var(--color-text-faint);
  font-weight: 400;
}
</style>
