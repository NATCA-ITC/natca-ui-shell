<script setup lang="ts">
/**
 * NatcaHeaderCard — Branded feature card with a single-line accent header.
 *
 * Layout: a compact ~44px header strip with [icon] [title · subtitle] [right slot]
 * all on one line, sitting under a 4px brand-accent top border. Body and
 * action slots below render exactly like NatcaCard.
 *
 * **Accent vs icon contrast is enforced.** The `accent` prop drives the
 * top-border color; the icon color is derived as the *opposite* brand
 * color so the two never clash (`accent="navy"` → red icon, `accent="red"`
 * → navy icon). Don't try to set the icon color manually — the contrast
 * is intentional and is what visually anchors the card.
 *
 * @example
 * <NatcaHeaderCard icon="mdi-email-outline"
 *                  title="My Email Account"
 *                  subtitle="jason.doss@natca.net · ZJX">
 *   <div>Card body content</div>
 *   <template #actions>
 *     <NatcaButton variant="ghost" size="md">Settings</NatcaButton>
 *     <NatcaButton variant="primary" size="md">Manage account</NatcaButton>
 *   </template>
 * </NatcaHeaderCard>
 *
 * @example Red accent (e.g. for a critical action panel)
 * <NatcaHeaderCard accent="red" icon="mdi-shield-alert-outline" title="Access review" />
 */
import { VIcon } from 'vuetify/components'

withDefaults(defineProps<{
  title: string
  subtitle?: string
  icon?: string
  /** Top-border accent color. Icon auto-contrasts to the opposite brand color. */
  accent?: 'navy' | 'red'
  noBodyPadding?: boolean
}>(), {
  icon: 'mdi-card-account-details',
  accent: 'navy',
  noBodyPadding: false,
})

defineSlots<{
  default?: () => any
  actions?: () => any
  /** Right side of the header strip — for chips, icon buttons, or a link button. */
  'header-right'?: () => any
}>()
</script>

<template>
  <div class="natca-header-card" :class="`natca-header-card--accent-${accent}`">
    <div class="natca-header-card__header">
      <div class="natca-header-card__icon">
        <VIcon :icon="icon" size="16" />
      </div>
      <div class="natca-header-card__text">
        <h3 class="natca-header-card__title">{{ title }}</h3>
        <span v-if="subtitle" class="natca-header-card__sep">·</span>
        <span v-if="subtitle" class="natca-header-card__subtitle">{{ subtitle }}</span>
      </div>
      <div v-if="$slots['header-right']" class="natca-header-card__header-right">
        <slot name="header-right" />
      </div>
    </div>
    <div
      v-if="$slots.default"
      class="natca-header-card__body"
      :class="{ 'natca-header-card__body--no-padding': noBodyPadding }"
    >
      <slot />
    </div>
    <div v-if="$slots.actions" class="natca-header-card__actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<style scoped>
/* NatcaHeaderCard — single-line branded header.
 *
 * Layout invariants:
 *   - Header is one row, ~44px tall (icon 28px square + 8px vertical padding).
 *   - Title and subtitle share the row, separated by a middot.
 *   - Top border is the accent color; icon color is the opposite brand
 *     color (enforced by .natca-header-card--accent-{navy|red}).
 */
.natca-header-card {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-top-width: 4px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  font-family: var(--font-body);
}

.natca-header-card--accent-navy { border-top-color: var(--natca-navy); }
.natca-header-card--accent-red  { border-top-color: var(--natca-red); }

.natca-header-card__header {
  background: var(--overlay-subtle);
  border-bottom: 1px solid var(--overlay-border);
  padding: 8px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 44px;
}

.natca-header-card__icon {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* Icon color = OPPOSITE brand color of the accent so they never collide.
   Navy accent → red icon, red accent → navy icon. */
.natca-header-card--accent-navy .natca-header-card__icon {
  background: rgba(var(--natca-red-rgb), 0.12);
  border: 1px solid rgba(var(--natca-red-rgb), 0.24);
  color: var(--natca-red);
}
.natca-header-card--accent-red .natca-header-card__icon {
  background: rgba(var(--natca-blue-rgb), 0.12);
  border: 1px solid rgba(var(--natca-blue-rgb), 0.24);
  color: var(--natca-navy);
}
/* Dark theme: navy reads dim, so the navy-icon variant uses our dark
   theme's lightened blue for contrast. */
[data-theme="dark"] .natca-header-card--accent-red .natca-header-card__icon,
.v-theme--natcaDark .natca-header-card--accent-red .natca-header-card__icon {
  color: var(--natca-blue);
  background: rgba(91, 163, 217, 0.18);
  border-color: rgba(91, 163, 217, 0.32);
}

.natca-header-card__text {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: baseline;
  gap: 6px;
  overflow: hidden;
}

.natca-header-card__title {
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1.2;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-shrink: 0;
}

.natca-header-card__sep {
  color: var(--color-text-faint);
  font-size: 12px;
  line-height: 1.2;
  flex-shrink: 0;
}

.natca-header-card__subtitle {
  font-size: 12px;
  color: var(--color-text-muted);
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}

.natca-header-card__header-right {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.natca-header-card__body {
  padding: 14px 16px;
  font-size: var(--text-sm);
  color: var(--color-text-body);
}

.natca-header-card__body--no-padding {
  padding: 0;
}

.natca-header-card__actions {
  padding: 10px 16px 14px;
  display: flex;
  gap: var(--space-2);
  justify-content: flex-end;
  align-items: center;
}
</style>
