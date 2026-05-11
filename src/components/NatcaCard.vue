<script setup lang="ts">
/**
 * NatcaCard — The default page-content card. Use this for almost everything.
 *
 * Decision matrix (read this before adding a new component):
 *   • Form, list, or section of a page? → NatcaCard (this).
 *   • Dashboard tile / KPI grid? → NatcaCard (auto), NatcaStatCard for metrics.
 *   • Callout / call-to-action with brand color? → NatcaCard with `accent` prop
 *     (info|success|warning|danger). Use sparingly — one per page max.
 *   • Hero / navy-strip feature card? → NatcaHeaderCard. Reserved for member-
 *     facing feature pages (e.g. "My Email Account" hero on /email landing),
 *     NOT for default content sections.
 *
 * @example Default card with title + actions
 * <NatcaCard title="Email Account" subtitle="jason@natca.net · Active">
 *   <div>Provider: Mailcow · Quota: 2.1/5 GB</div>
 *   <template #actions>
 *     <NatcaButton variant="ghost" size="md">Cancel</NatcaButton>
 *     <NatcaButton variant="primary" size="md">Save Changes</NatcaButton>
 *   </template>
 * </NatcaCard>
 *
 * @example Yellow-accent callout (e.g. "migrate your email account")
 * <NatcaCard accent="warning" title="Action required" subtitle="Migrate by 6/1">
 *   Your @natca.net account moves to the new mail platform on June 1.
 *   <template #actions>
 *     <NatcaButton variant="primary" size="md">Start migration</NatcaButton>
 *   </template>
 * </NatcaCard>
 *
 * @example Body without padding (tables, full-bleed content)
 * <NatcaCard title="Members" no-body-padding>
 *   <v-data-table ... />
 * </NatcaCard>
 */
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  title?: string
  subtitle?: string
  /** Optional brand accent applied to the title strip. Use for callouts only. */
  accent?: 'info' | 'success' | 'warning' | 'danger'
  /** Removes inner padding from the body slot — use for tables / full-bleed content. */
  noBodyPadding?: boolean
}>(), {
  noBodyPadding: false,
})

defineSlots<{
  default?: () => any
  header?: () => any
  /** Right-aligned content next to the title (icon button, chip, link). */
  'title-actions'?: () => any
  actions?: () => any
}>()

const bodyClasses = computed(() => ({
  'natca-card__body': true,
  'natca-card__body--no-padding': props.noBodyPadding,
}))
</script>

<template>
  <div :class="['natca-card', accent ? `natca-card--accent-${accent}` : null]">
    <!-- Custom header slot overrides title/subtitle -->
    <div v-if="$slots.header" class="natca-card__header">
      <slot name="header" />
    </div>
    <template v-else-if="title || subtitle">
      <div class="natca-card__title-row">
        <div class="natca-card__title-text">
          <h3 v-if="title" class="natca-card__title">{{ title }}</h3>
          <p v-if="subtitle" class="natca-card__subtitle">{{ subtitle }}</p>
        </div>
        <div v-if="$slots['title-actions']" class="natca-card__title-actions">
          <slot name="title-actions" />
        </div>
      </div>
    </template>

    <div v-if="$slots.default" :class="bodyClasses">
      <slot />
    </div>

    <div v-if="$slots.actions" class="natca-card__actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<style scoped>
.natca-card {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  font-family: var(--font-body);
}

.natca-card__title-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px 10px;
}

.natca-card__title-text {
  flex: 1;
  min-width: 0;
}

.natca-card__title-actions {
  flex-shrink: 0;
  display: flex;
  gap: 6px;
  align-items: center;
}

.natca-card__title {
  font-family: var(--font-display);
  font-size: var(--text-md);
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
  line-height: 1.25;
}

.natca-card__subtitle {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  margin: 4px 0 0;
  line-height: 1.4;
}

.natca-card__body {
  padding: 14px 16px;
  font-size: var(--text-sm);
  color: var(--color-text-body);
}

.natca-card__body--no-padding {
  padding: 0;
}

.natca-card__actions {
  padding: 10px 16px 14px;
  display: flex;
  gap: var(--space-2);
  justify-content: flex-end;
  align-items: center;
}

/* When a card has BOTH title-row AND body, the body loses its top padding
   because the title-row already provides the gap. */
.natca-card__title-row + .natca-card__body {
  padding-top: 4px;
}

/* ── Accent variants — colored title strip for callouts only ─────────── */
.natca-card--accent-info,
.natca-card--accent-success,
.natca-card--accent-warning,
.natca-card--accent-danger {
  border-top-width: 4px;
}
.natca-card--accent-info     { border-top-color: var(--color-info); }
.natca-card--accent-success  { border-top-color: var(--color-success); }
.natca-card--accent-warning  { border-top-color: var(--color-warning); }
.natca-card--accent-danger   { border-top-color: var(--color-danger); }

.natca-card--accent-info    .natca-card__title { color: var(--color-info); }
.natca-card--accent-success .natca-card__title { color: var(--color-success); }
.natca-card--accent-warning .natca-card__title { color: var(--color-warning); }
.natca-card--accent-danger  .natca-card__title { color: var(--color-danger); }
</style>
