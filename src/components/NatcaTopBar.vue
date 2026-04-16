<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import natcaLogo from '../../assets/natca-logo.png'
import { useShellState } from '../composables/useShellState'
import { useNatcaTheme } from '../composables/useNatcaTheme'
import type { NatcaUser, NatcaApp } from '../types'

const props = withDefaults(defineProps<{
  appName: string
  facility?: string
  user: NatcaUser
  showSearch?: boolean
  showNotifications?: boolean
  showThemeToggle?: boolean
  notificationCount?: number
  apps?: NatcaApp[]
}>(), {
  showSearch: true,
  showNotifications: false,
  showThemeToggle: true,
  notificationCount: 0,
})

defineSlots<{
  'toolbar-actions'?: () => any
}>()

const emit = defineEmits<{
  'profile-action': [action: string]
  'theme-change': [preference: string]
}>()

const { toggleSearch, toggleAppSwitcher } = useShellState()
const { isDark, setTheme } = useNatcaTheme()

function toggleTheme() {
  const next = isDark.value ? 'light' : 'dark'
  setTheme(next)
  emit('theme-change', next)
}

const hasNotifications = computed(() => (props.notificationCount ?? 0) > 0)

const userMenuOpen = ref(false)

function toggleUserMenu() {
  userMenuOpen.value = !userMenuOpen.value
}

function handleUserAction(action: string) {
  userMenuOpen.value = false
  emit('profile-action', action)
}

function handleClickOutside(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (userMenuOpen.value && !target.closest('.natca-shell-user-menu-wrap')) {
    userMenuOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside, true))
onUnmounted(() => document.removeEventListener('click', handleClickOutside, true))
</script>

<template>
  <div class="natca-shell-topbar">
    <!-- Logo zone -->
    <a href="/" class="natca-shell-logo-zone">
      <img :src="natcaLogo" alt="NATCA" />
    </a>

    <!-- Divider -->
    <span class="natca-shell-divider" />

    <!-- Wordmark -->
    <span class="natca-shell-wordmark">NATCA</span>

    <!-- App switcher chip -->
    <button
      class="natca-shell-app-chip"
      @click="toggleAppSwitcher"
      type="button"
    >
      <!-- Grid icon -->
      <svg class="natca-shell-chip-grid" width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
        <rect x="0" y="0" width="3" height="3" rx="0.75" />
        <rect x="4.5" y="0" width="3" height="3" rx="0.75" />
        <rect x="9" y="0" width="3" height="3" rx="0.75" />
        <rect x="0" y="4.5" width="3" height="3" rx="0.75" />
        <rect x="4.5" y="4.5" width="3" height="3" rx="0.75" />
        <rect x="9" y="4.5" width="3" height="3" rx="0.75" />
        <rect x="0" y="9" width="3" height="3" rx="0.75" />
        <rect x="4.5" y="9" width="3" height="3" rx="0.75" />
        <rect x="9" y="9" width="3" height="3" rx="0.75" />
      </svg>
      {{ appName }}
      <span class="natca-shell-chip-caret">&#9662;</span>
    </button>

    <!-- Right section -->
    <div class="natca-shell-topbar-right">
      <!-- Facility badge -->
      <span v-if="facility" class="natca-shell-facility">
        <!-- Map pin icon -->
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
          <circle cx="12" cy="9" r="2.5" />
        </svg>
        {{ facility }}
      </span>

      <!-- Search icon -->
      <button
        v-if="showSearch"
        class="natca-shell-top-icon"
        @click="toggleSearch"
        type="button"
        aria-label="Search"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
      </button>

      <!-- Notifications icon -->
      <button
        v-if="showNotifications"
        class="natca-shell-top-icon"
        type="button"
        aria-label="Notifications"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        <span v-if="hasNotifications" class="natca-shell-top-badge" />
      </button>

      <!-- App-provided toolbar actions (auto-styled) -->
      <slot name="toolbar-actions" />

      <!-- Theme toggle (sun/moon) -->
      <button
        v-if="showThemeToggle"
        class="natca-shell-top-icon"
        type="button"
        :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
        @click="toggleTheme"
      >
        <!-- Sun icon (shown in dark mode — click to go light) -->
        <svg v-if="isDark" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
        <!-- Moon icon (shown in light mode — click to go dark) -->
        <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </button>

      <!-- User avatar + dropdown -->
      <div class="natca-shell-user-menu-wrap">
        <div class="natca-shell-avatar" :title="user.name" @click="toggleUserMenu">
          <img
            v-if="user.avatarUrl"
            :src="user.avatarUrl"
            :alt="user.name"
            style="width: 100%; height: 100%; border-radius: 8px; object-fit: cover;"
          />
          <template v-else>{{ user.initials }}</template>
        </div>

        <Transition name="natca-user-menu">
          <div v-if="userMenuOpen" class="natca-shell-user-menu">
            <div class="natca-shell-user-menu-header">
              <div class="natca-shell-user-menu-name">
                {{ user.name }}<span v-if="user.memberNumber" class="natca-shell-user-menu-member-num">({{ user.memberNumber }})</span>
              </div>
              <div v-if="user.region || user.facility" class="natca-shell-user-menu-meta">
                <span v-if="user.region">{{ user.region }}</span>
                <span v-if="user.region && user.facility" class="natca-shell-user-menu-meta-sep">|</span>
                <span v-if="user.facility">{{ user.facility }}</span>
              </div>
            </div>
            <div class="natca-shell-user-menu-divider" />
            <button class="natca-shell-user-menu-item" type="button" @click="handleUserAction('profile')">My Profile</button>
            <button class="natca-shell-user-menu-item" type="button" @click="handleUserAction('settings')">Settings</button>
            <div class="natca-shell-user-menu-divider" />
            <button class="natca-shell-user-menu-item natca-shell-user-menu-signout" type="button" @click="handleUserAction('signout')">Sign Out</button>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
.natca-shell-user-menu-wrap {
  position: relative;
}

.natca-shell-user-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 220px;
  background: var(--color-shell-surface);
  border: 1px solid var(--overlay-border);
  border-radius: 8px;
  box-shadow: var(--shadow-lg);
  z-index: 200;
  overflow: hidden;
}

.natca-shell-user-menu-header {
  padding: 12px 14px;
}

.natca-shell-user-menu-name {
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 700;
  color: var(--color-text-primary);
}

.natca-shell-user-menu-member-num {
  font-weight: 400;
  color: var(--color-text-faint);
  margin-left: 4px;
  font-size: 11px;
}

.natca-shell-user-menu-meta {
  font-size: 11px;
  color: var(--color-text-faint);
  margin-top: 3px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.natca-shell-user-menu-meta-sep {
  color: var(--overlay-divider);
}

.natca-shell-user-menu-divider {
  height: 1px;
  background: var(--overlay-hover);
}

.natca-shell-user-menu-item {
  display: block;
  width: 100%;
  text-align: left;
  padding: 8px 14px;
  font-size: 12.5px;
  font-weight: 500;
  color: var(--color-text-body);
  background: none;
  border: none;
  cursor: pointer;
  transition: all 150ms;
}

.natca-shell-user-menu-item:hover {
  background: var(--overlay-hover);
  color: var(--color-text-primary);
}

.natca-shell-user-menu-signout {
  color: var(--natca-red);
}

.natca-shell-user-menu-signout:hover {
  background: rgba(var(--natca-red-rgb), 0.1);
  color: var(--natca-red);
}

.natca-user-menu-enter-active,
.natca-user-menu-leave-active {
  transition: opacity 150ms ease, transform 150ms ease;
}

.natca-user-menu-enter-from,
.natca-user-menu-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
