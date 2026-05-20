<script setup lang="ts">
/**
 * NatcaSlugLabel — Friendly human name paired with a machine identifier.
 *
 * Used across NATCA apps for surfacing document type slugs, grant slugs,
 * permission keys, role identifiers, etc. The slug renders in the brand
 * mono stack (`--font-mono` → JetBrains Mono); an optional info badge
 * carries the description on hover/focus.
 *
 * Consuming apps must load JetBrains Mono themselves — see the README's
 * "Fonts — consumer loading" section.
 *
 * @example DMS document-type detail
 * <NatcaSlugLabel
 *   name="Facility Constitution"
 *   slug="facility-constitution"
 *   description="The governing document for facility-level union operations."
 * />
 *
 * @example MN v2 permission feature key (slug-only, text)
 * <NatcaSlugLabel variant="slug-only" :slug="feature.key" />
 *
 * @example DMS browse — slug as a chip, clickable
 * <NatcaSlugLabel
 *   :slug="doc.document_type_id"
 *   variant="slug-only"
 *   render="chip"
 *   clickable
 *   @click="onChipClick"
 * />
 */
import { computed } from 'vue'
import { VTooltip, VChip } from 'vuetify/components'

const props = withDefaults(defineProps<{
  /** Human-readable label, e.g. "Facility Constitution". Ignored when variant is 'slug-only'. */
  name?: string
  /** Machine identifier, e.g. "facility-constitution" or "mn.officer_admin:ZLA" */
  slug: string
  /** Optional description — drives the i-tooltip. If absent, no info badge is rendered. */
  description?: string
  /** `default` = name + i + slug. `compact` = name + i (no slug). `slug-only` = slug only. */
  variant?: 'default' | 'compact' | 'slug-only'
  /** `sm` (10px slug / 12px name) · `md` (11px / 13px, default) · `lg` (12px / 14px) */
  size?: 'sm' | 'md' | 'lg'
  /** `text` (inline mono span, default) or `chip` (wraps output in a VChip). */
  render?: 'text' | 'chip'
  /** When true, the component becomes a focusable button surface and emits `click`. */
  clickable?: boolean
}>(), {
  variant: 'default',
  size: 'md',
  render: 'text',
  clickable: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const showName = computed(() => props.variant !== 'slug-only' && !!props.name)
const showSlug = computed(() => props.variant !== 'compact')
const showInfo = computed(() => !!props.description && props.variant !== 'slug-only')

const rootClasses = computed(() => [
  'natca-slug-label',
  `natca-slug-label--${props.size}`,
  {
    'natca-slug-label--clickable': props.clickable && props.render === 'text',
  },
])

const chipSize = computed(() => (props.size === 'lg' ? 'small' : 'x-small'))

// Accepts the union because VChip emits `click` for both mouse and keyboard
// activation. We narrow to MouseEvent before re-emitting so the public event
// type stays predictable for consumers — keyboard activation goes through
// `handleKey`, which dispatches a native click on the element.
function handleClick(e: MouseEvent | KeyboardEvent) {
  if (!props.clickable) return
  if (e instanceof MouseEvent) emit('click', e)
}

function handleKey(e: KeyboardEvent) {
  if (!props.clickable) return
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    ;(e.currentTarget as HTMLElement | null)?.click()
  }
}
</script>

<template>
  <!-- Chip render — Vuetify VChip wrapper -->
  <VChip
    v-if="render === 'chip'"
    :size="chipSize"
    variant="tonal"
    density="compact"
    :class="rootClasses"
    :tabindex="clickable ? 0 : undefined"
    :role="clickable ? 'button' : undefined"
    @click="handleClick"
    @keydown="handleKey"
  >
    <span class="natca-slug-label__inner">
      <span v-if="showName" class="natca-slug-label__name">
        <slot>{{ name }}</slot>
      </span>

      <VTooltip
        v-if="showInfo"
        location="top"
        :open-on-focus="true"
        :open-on-hover="true"
      >
        <template #activator="{ props: tipProps }">
          <span
            v-bind="tipProps"
            class="natca-slug-label__info"
            tabindex="0"
            :aria-label="description"
          >i</span>
        </template>
        <span class="natca-slug-label__tooltip-body">{{ description }}</span>
      </VTooltip>

      <span v-if="showSlug" class="natca-slug-label__slug">{{ slug }}</span>
    </span>
  </VChip>

  <!-- Text render — inline span -->
  <span
    v-else
    :class="rootClasses"
    :tabindex="clickable ? 0 : undefined"
    :role="clickable ? 'button' : undefined"
    @click="handleClick"
    @keydown="handleKey"
  >
    <span class="natca-slug-label__inner">
      <span v-if="showName" class="natca-slug-label__name">
        <slot>{{ name }}</slot>
      </span>

      <VTooltip
        v-if="showInfo"
        location="top"
        :open-on-focus="true"
        :open-on-hover="true"
      >
        <template #activator="{ props: tipProps }">
          <span
            v-bind="tipProps"
            class="natca-slug-label__info"
            tabindex="0"
            :aria-label="description"
          >i</span>
        </template>
        <span class="natca-slug-label__tooltip-body">{{ description }}</span>
      </VTooltip>

      <span v-if="showSlug" class="natca-slug-label__slug">{{ slug }}</span>
    </span>
  </span>
</template>

<style scoped>
.natca-slug-label {
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
  line-height: 1.2;
  color: var(--color-text-primary);
}

.natca-slug-label__inner {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

/* ── Name ───────────────────────────────────────────────── */
.natca-slug-label__name {
  font-family: var(--font-body);
  font-weight: 500;
  color: inherit;
}

/* ── Slug (mono) ─────────────────────────────────────────── */
.natca-slug-label__slug {
  font-family: var(--font-mono);
  font-weight: 500;
  color: var(--color-text-muted);
}

/* ── Info badge ─────────────────────────────────────────── */
.natca-slug-label__info {
  display: inline-grid;
  place-items: center;
  border-radius: 999px;
  background: var(--color-bg-subtle);
  color: var(--color-text-muted);
  font-family: var(--font-display);
  font-weight: 700;
  cursor: help;
  user-select: none;
  line-height: 1;
  transition: background-color 120ms ease, color 120ms ease;
}

.natca-slug-label__info:hover,
.natca-slug-label__info:focus-visible {
  background: var(--natca-navy);
  color: #FFFFFF;
  outline: none;
}

.natca-slug-label__tooltip-body {
  font-size: 12px;
  line-height: 1.45;
  max-width: 320px;
  display: inline-block;
}

/* ── Sizes ──────────────────────────────────────────────── */
.natca-slug-label--sm .natca-slug-label__name { font-size: 12px; }
.natca-slug-label--sm .natca-slug-label__slug { font-size: 10px; }
.natca-slug-label--sm .natca-slug-label__info { width: 12px; height: 12px; font-size: 8px; }

.natca-slug-label--md .natca-slug-label__name { font-size: 13px; }
.natca-slug-label--md .natca-slug-label__slug { font-size: 11px; }
.natca-slug-label--md .natca-slug-label__info { width: 14px; height: 14px; font-size: 9px; }

.natca-slug-label--lg .natca-slug-label__name { font-size: 14px; }
.natca-slug-label--lg .natca-slug-label__slug { font-size: 12px; }
.natca-slug-label--lg .natca-slug-label__info { width: 16px; height: 16px; font-size: 10px; }

/* ── Clickable (text render only — VChip handles its own hover/focus) ── */
.natca-slug-label--clickable {
  cursor: pointer;
  border-radius: var(--radius-sm);
  padding: 2px 4px;
  margin: -2px -4px;
  transition: background-color 120ms ease;
}

.natca-slug-label--clickable:hover {
  background: var(--overlay-hover);
}

.natca-slug-label--clickable:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
}
</style>
