<script setup lang="ts">
/**
 * NatcaIconButton — Native Vue square icon-only button matching the design system.
 *
 * The companion to NatcaButton for actions that don't carry text: dialog close
 * buttons, table-row delete / edit / share, lightbox toolbars, expand-collapse.
 * **Always reach for this instead of `<v-btn icon>`** — bare VBtn lands at the
 * wrong scale under natcaDefaults and forces consumers into the size="small"
 * (16-20px) bug that page-patterns §2 explicitly forbids.
 *
 * Two sizes, exactly:
 *   • `sm` — 28×28px square. Toolbars, table-row actions, dense list affordances.
 *   • `md` — 36×36px square. Form-footer / dialog-footer / hero-card buttons.
 * No third size by design.
 *
 * @example Row action (dense list)
 * <NatcaIconButton variant="ghost"  size="sm" icon="mdi-pencil"  aria-label="Edit member" @click="edit" />
 * <NatcaIconButton variant="danger" size="sm" icon="mdi-delete"  aria-label="Remove member" @click="remove" />
 *
 * @example Form footer
 * <NatcaIconButton variant="primary" size="md" icon="mdi-download" aria-label="Download report" />
 *
 * @example Dialog close
 * <NatcaIconButton variant="ghost" size="sm" icon="mdi-close" aria-label="Close" @click="show=false" />
 */
import { computed } from 'vue'
import { VIcon } from 'vuetify/components'

const props = withDefaults(defineProps<{
  /** MDI icon name, e.g. "mdi-delete". Required. */
  icon: string
  /** Visual style. Mirrors NatcaButton. */
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'link'
  /** Square size in px. 28 (sm) or 36 (md). */
  size?: 'sm' | 'md'
  /** Required when no visible label — describes the action for screen readers. */
  'aria-label': string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  /** Optional href to render as <a> instead of <button>. */
  href?: string
  /** `title` attribute — falls back to aria-label if not given. */
  title?: string
}>(), {
  variant: 'ghost',
  size: 'sm',
  type: 'button',
  disabled: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const classes = computed(() => [
  'natca-icon-btn',
  `natca-icon-btn--${props.variant}`,
  `natca-icon-btn--${props.size}`,
  { 'natca-icon-btn--disabled': props.disabled },
])

const iconSize = computed(() => (props.size === 'md' ? 20 : 16))

function handleClick(e: MouseEvent) {
  if (props.disabled) {
    e.preventDefault()
    return
  }
  emit('click', e)
}
</script>

<template>
  <a
    v-if="href"
    :href="href"
    :class="classes"
    :aria-label="$props['aria-label']"
    :title="title ?? $props['aria-label']"
    :aria-disabled="disabled"
    @click="handleClick"
  >
    <VIcon :icon="icon" :size="iconSize" />
  </a>
  <button
    v-else
    :type="type"
    :class="classes"
    :aria-label="$props['aria-label']"
    :title="title ?? $props['aria-label']"
    :disabled="disabled"
    @click="handleClick"
  >
    <VIcon :icon="icon" :size="iconSize" />
  </button>
</template>

<style>
.natca-icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  /* NAT-954: never transition `color`. CSS transitions sit at the very top of
     the cascade — above `!important` author declarations — so an in-flight or
     just-applied colour transition makes this element's text colour
     un-overridable by a consuming app, `!important` included. Transition only
     the properties that actually animate on hover/focus. */
  transition: background-color 150ms, border-color 150ms, opacity 150ms, box-shadow 150ms;
  text-decoration: none;
  flex-shrink: 0;
  box-sizing: border-box;
}

.natca-icon-btn:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 1px;
}

/* ── Sizes ── */
.natca-icon-btn--sm {
  width: 28px;
  height: 28px;
}

.natca-icon-btn--md {
  width: 36px;
  height: 36px;
}

.natca-icon-btn--disabled,
.natca-icon-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

/* ── Variants — mirror NatcaButton's color logic ──
 *
 * NAT-954: doubled base class for specificity (0,2,0), for the same reason as
 * NatcaButton — see the long note there. Vuetify's reset declares
 * `[type="button"] { color: inherit }` at (0,1,0), which ties with a
 * single-class variant rule and wins on load order in some consuming apps.
 */

/* Primary — navy in light, red in dark */
.natca-icon-btn.natca-icon-btn--primary {
  background: var(--natca-navy);
  color: #FFFFFF;
}
.natca-icon-btn--primary:hover { opacity: 0.9; }
[data-theme="dark"] .natca-icon-btn--primary,
.v-theme--natcaDark .natca-icon-btn--primary {
  background: var(--natca-red);
}

/* Secondary — subtle filled neutral with border */
.natca-icon-btn.natca-icon-btn--secondary {
  background: var(--color-bg-subtle);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}
.natca-icon-btn--secondary:hover { background: var(--overlay-hover); }

/* Danger — outlined red, fills on hover */
.natca-icon-btn.natca-icon-btn--danger {
  background: transparent;
  color: var(--color-danger);
  border: 1px solid var(--color-danger);
}
.natca-icon-btn--danger:hover {
  background: var(--color-danger);
  color: #FFFFFF;
}

/* Ghost — transparent, muted icon, hover background */
.natca-icon-btn.natca-icon-btn--ghost {
  background: transparent;
  color: var(--color-text-muted);
}
.natca-icon-btn--ghost:hover {
  background: var(--overlay-hover);
  color: var(--color-text-primary);
}

/* Link — blue icon, transparent background */
.natca-icon-btn.natca-icon-btn--link {
  background: transparent;
  color: var(--natca-blue);
}
.natca-icon-btn--link:hover {
  background: var(--overlay-hover);
}
</style>
