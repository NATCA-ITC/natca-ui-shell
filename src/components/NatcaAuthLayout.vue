<!--
  NatcaAuthLayout — reusable pre-login sign-in landing for any NATCA app.

  Promoted from BID's AuthLandingLayout (NAT-834). The signed-in NatcaTopBar has
  a logged-out mode now, but it still surfaces a Sign-in pill + search/theme that
  a landing page doesn't want — so this keeps a slim, purpose-built topbar (brand
  + app switcher only) and reuses ui-shell's real NatcaAppSwitcher for the panel.

  Everything app-specific is a prop or a slot, so a consuming app turns pieces
  on/off without forking the layout:

    props:  app-name, app-id, tagline, logo-src, apps, eyebrow, heading,
            subheading, capabilities
    slots:  #identity      (override the whole left brand block)
            #capabilities  (override the default tiles)
            #action        (the sign-in button — each app wires its own auth)
            #subtext       (optional fine print, e.g. a legacy-system link)

  The `apps` prop defaults to the built-in `natcaApps` registry (NAT-833), so a
  consuming app gets a correct, DMS-hidden switcher with zero configuration.
-->
<template>
  <div class="natca-auth-landing">
    <!-- Slim logged-out topbar: brand + app switcher (no profile menu).
         The switcher trigger sits on the LEFT so it aligns with the
         NatcaAppSwitcher's fixed drop position (top:52px, left:140px). -->
    <header class="natca-auth-topbar">
      <div class="natca-auth-topbar__brand">
        <span class="natca-auth-topbar__natca">NATCA</span>
        <span class="natca-auth-topbar__sep" aria-hidden="true" />
        <button
          v-if="visibleApps.length"
          type="button"
          class="natca-auth-topbar__app-switch"
          :class="{ 'is-open': shellState.appSwitcherOpen }"
          aria-label="Switch NATCA apps"
          @click="toggleAppSwitcher"
        >
          <v-icon size="17">mdi-apps</v-icon>
          <span class="natca-auth-topbar__app">{{ appName }}</span>
          <v-icon size="16" class="natca-auth-topbar__caret">mdi-chevron-down</v-icon>
        </button>
        <span v-else class="natca-auth-topbar__app">{{ appName }}</span>
      </div>
    </header>

    <!-- App-switcher panel: reuses ui-shell's NatcaAppSwitcher (self-positions) -->
    <transition name="natca-switcher-fade">
      <div
        v-if="shellState.appSwitcherOpen"
        class="natca-switcher-overlay"
        @click.self="closeAppSwitcher"
      >
        <NatcaAppSwitcher
          :apps="visibleApps"
          :current-app-id="appId"
          @select="onAppSelect"
        />
      </div>
    </transition>

    <div class="natca-auth-body">
      <!-- LEFT — identity -->
      <aside class="natca-auth-identity">
        <div class="natca-identity-brand">
          <slot name="identity">
            <div v-if="logoSrc" class="natca-identity-logo">
              <img :src="logoSrc" :alt="`NATCA ${appName} logo`" />
            </div>
            <h1 class="natca-identity-name">NATCA {{ appName }}</h1>
            <p v-if="tagline" class="natca-identity-tagline">{{ tagline }}</p>
          </slot>
        </div>

        <div v-if="hasCapabilities" class="natca-identity-capabilities">
          <slot name="capabilities">
            <div v-for="c in capabilities" :key="c.title" class="natca-cap-tile">
              <v-icon size="26" class="natca-cap-icon">{{ c.icon }}</v-icon>
              <div class="natca-cap-text">
                <span class="natca-cap-title">{{ c.title }}</span>
                <span class="natca-cap-sub">{{ c.text }}</span>
              </div>
            </div>
          </slot>
        </div>
      </aside>

      <!-- RIGHT — sign in + details -->
      <main class="natca-auth-signin">
        <div class="natca-signin-card">
          <div v-if="eyebrow" class="natca-signin-eyebrow">{{ eyebrow }}</div>
          <h2 class="natca-signin-heading">{{ heading }}</h2>
          <p v-if="subheading" class="natca-signin-sub">{{ subheading }}</p>

          <div class="natca-signin-action">
            <slot name="action" />
          </div>

          <div v-if="$slots.subtext" class="natca-signin-subtext">
            <slot name="subtext" />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'
import type { NatcaApp, NatcaAuthLayoutProps } from '../types'
import { natcaApps } from '../data/natcaApps'
import { useShellState } from '../composables/useShellState'
import NatcaAppSwitcher from './NatcaAppSwitcher.vue'

const props = withDefaults(defineProps<NatcaAuthLayoutProps>(), {
  appId: '',
  tagline: '',
  logoSrc: '',
  // Zero-config: fall back to the canonical NATCA registry (DMS hidden).
  apps: () => natcaApps,
  eyebrow: '',
  heading: 'Welcome back',
  subheading: '',
  capabilities: () => [],
})

defineSlots<{
  identity?: () => any
  capabilities?: () => any
  action?: () => any
  subtext?: () => any
}>()

const slots = useSlots()
const { state: shellState, toggleAppSwitcher, closeAppSwitcher } = useShellState()

// Drop any app flagged `hidden` (e.g. DMS pre-launch).
const visibleApps = computed(() => props.apps.filter((app) => !app.hidden))

const hasCapabilities = computed(
  () => props.capabilities.length > 0 || !!slots.capabilities,
)

function onAppSelect(_app: NatcaApp) {
  // NatcaAppSwitcher owns navigation (native href, current-app no-op) — here we
  // just dismiss the panel.
  closeAppSwitcher()
}
</script>

<style scoped>
.natca-auth-landing {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-bg-surface);
}

/* ---- slim topbar ---- */
.natca-auth-topbar {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  height: 52px;
  padding: 0 20px;
  background: var(--natca-navy, #003366);
  color: #fff;
}
.natca-auth-topbar__brand {
  display: flex;
  align-items: center;
  gap: 12px;
}
.natca-auth-topbar__natca {
  font-family: var(--font-display, 'Barlow', sans-serif);
  font-weight: 800;
  letter-spacing: 0.08em;
  font-size: 17px;
}
.natca-auth-topbar__sep {
  width: 1px;
  height: 20px;
  background: rgba(255, 255, 255, 0.28);
}
/* App-name doubles as the switcher trigger (mirrors the signed-in shell). */
.natca-auth-topbar__app-switch {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 5px 9px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #fff;
  cursor: pointer;
}
.natca-auth-topbar__app-switch:hover,
.natca-auth-topbar__app-switch.is-open {
  background: rgba(255, 255, 255, 0.1);
}
.natca-auth-topbar__caret {
  opacity: 0.7;
  transition: transform 0.18s ease;
}
.natca-auth-topbar__app-switch.is-open .natca-auth-topbar__caret {
  transform: rotate(180deg);
}
.natca-auth-topbar__app {
  font-family: var(--font-display, 'Barlow', sans-serif);
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 0.04em;
  color: var(--natca-sky, #5BA3D9);
}

/* ---- body split ---- */
.natca-auth-body {
  flex: 1 1 auto;
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  min-height: 0;
}

/* ---- LEFT: identity on navy ---- */
.natca-auth-identity {
  background: var(--natca-navy, #003366);
  color: #fff;
  padding: 3.25rem 3.25rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.natca-identity-brand {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.1rem;
}
.natca-identity-logo {
  background: #fff;
  border-radius: 16px;
  padding: 12px;
  display: inline-flex;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
}
.natca-identity-logo img {
  display: block;
  height: 52px;
  width: auto;
}
.natca-identity-name {
  font-family: var(--font-display, 'Barlow', sans-serif);
  font-size: clamp(28px, 3.2vw, 42px);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.05;
  margin: 0;
  text-wrap: balance;
}
.natca-identity-tagline {
  margin: 0;
  font-size: 1.05rem;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.82);
  max-width: 34ch;
  text-wrap: balance;
}

/* capability tiles sit directly beneath the brand block */
.natca-identity-capabilities {
  margin-top: 1.75rem;
  display: grid;
  gap: 10px;
  max-width: 440px;
}
.natca-cap-tile {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 13px 15px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: var(--radius, 8px);
}
.natca-cap-icon {
  flex: 0 0 auto;
  color: var(--natca-sky, #5BA3D9);
}
.natca-cap-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.natca-cap-title {
  font-family: var(--font-display, 'Barlow', sans-serif);
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #fff;
}
.natca-cap-sub {
  font-size: 12.5px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.35;
}

/* ---- RIGHT: sign in ---- */
.natca-auth-signin {
  background: var(--color-bg-surface);
  display: grid;
  place-items: center;
  padding: 2.5rem;
}
.natca-signin-card {
  width: 100%;
  max-width: 360px;
}
.natca-signin-eyebrow {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-text-faint);
}
.natca-signin-heading {
  font-family: var(--font-display, 'Barlow', sans-serif);
  font-size: 30px;
  font-weight: 800;
  letter-spacing: -0.01em;
  text-transform: uppercase;
  color: var(--color-text-primary);
  margin: 6px 0 8px;
}
.natca-signin-sub {
  margin: 0 0 22px;
  font-size: 14px;
  color: var(--color-text-muted);
}
.natca-signin-action {
  margin-top: 22px;
}
/* Beefy, tactile primary CTA. Height + weight overrides are layout polish for
   the hero action; the color/shape still come from NatcaButton's primary variant. */
.natca-signin-action :deep(button) {
  width: 100%;
  min-height: 54px;
  padding: 0 22px;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  border-radius: 10px;
  transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease;
}
.natca-signin-action :deep(button:hover) {
  transform: translateY(-2px);
  box-shadow: 0 10px 26px rgba(var(--natca-red-rgb, 206, 14, 45), 0.42);
  filter: brightness(1.05);
}
.natca-signin-action :deep(button:active) {
  transform: translateY(0);
  box-shadow: 0 4px 12px rgba(var(--natca-red-rgb, 206, 14, 45), 0.3);
}
@media (prefers-reduced-motion: reduce) {
  .natca-signin-action :deep(button) {
    transition: none;
  }
  .natca-signin-action :deep(button:hover) {
    transform: none;
  }
}
.natca-signin-subtext {
  margin-top: 18px;
  font-size: 13px;
  color: var(--color-text-muted);
}
.natca-signin-subtext :deep(a) {
  color: var(--color-info);
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
}
.natca-signin-subtext :deep(a:hover) {
  text-decoration: underline;
}

/* ---- app-switcher overlay (NatcaAppSwitcher self-positions at 52/140) ---- */
.natca-switcher-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(0, 0, 0, 0.24);
}
.natca-switcher-fade-enter-active,
.natca-switcher-fade-leave-active {
  transition: opacity 0.15s ease;
}
.natca-switcher-fade-enter-from,
.natca-switcher-fade-leave-to {
  opacity: 0;
}

/* ---- responsive: stack, drop the identity panel's tiles ---- */
@media (max-width: 860px) {
  .natca-auth-body {
    grid-template-columns: 1fr;
  }
  .natca-auth-identity {
    padding: 2.25rem 1.75rem;
  }
  .natca-identity-brand {
    align-items: center;
    text-align: center;
  }
  .natca-identity-capabilities {
    display: none;
  }
  .natca-auth-signin {
    padding: 2.25rem 1.5rem 3rem;
  }
}
@media (prefers-reduced-motion: reduce) {
  .natca-switcher-fade-enter-active,
  .natca-switcher-fade-leave-active {
    transition: none;
  }
}
</style>
