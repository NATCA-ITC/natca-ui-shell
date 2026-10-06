<script setup lang="ts">
/**
 * NatcaTopBarAction — the control apps put in NatcaShell's `#toolbar-actions`
 * slot (NAT-1986).
 *
 * Icon + label on desktop; icon-only at the shell's phone breakpoint
 * (`max-width: 768px`). The label is visually hidden there, never removed, so
 * it remains the control's accessible name and screen readers announce it at
 * every width. A `title` tooltip defaults to the label so sighted users can
 * still discover what the bare icon does.
 *
 * Renders an `<a>` when `href` is set, otherwise a `<button>`.
 *
 * The slot region is the only part of the topbar that gives way when the bar is
 * too narrow — the shell's theme toggle, notifications and avatar never move.
 * A labelled control that does NOT collapse on phones is therefore clipped
 * rather than pushing the shell off-screen; use this component (or its
 * classes) so that never happens to yours.
 *
 * Styles live in shell.css as global classes, so an app control that must stay
 * its own component can opt in without wrapping: put `natca-topbar-action` on
 * its root and wrap its text in `<span class="natca-topbar-action__label">`.
 *
 * @example
 * <NatcaShell …>
 *   <template #toolbar-actions>
 *     <NatcaTopBarAction icon="mdi-help-circle-outline" label="Support" @click="openSupport" />
 *     <NatcaTopBarAction icon="mdi-open-in-new" label="Go to BID v5"
 *                        :href="legacyUrl" target="_blank" variant="warning" />
 *   </template>
 * </NatcaShell>
 */
import { computed } from 'vue'
import { VIcon } from 'vuetify/components'

const props = withDefaults(defineProps<{
  /** MDI icon name, e.g. "mdi-open-in-new". Always visible. */
  icon: string
  /**
   * Visible label on desktop; the accessible name at every width. Required —
   * it is the only thing a screen reader has once the control is icon-only.
   */
  label: string
  /**
   * `ghost` (default) — translucent white on the navy bar, like the shell's
   * own icons. `warning` — filled amber, for an escape hatch that must be
   * findable. `primary` — filled NATCA red.
   */
  variant?: 'ghost' | 'warning' | 'primary'
  /**
   * `phone` (default) collapses to icon-only at the phone breakpoint.
   * `never` keeps the label at every width — only for a control that is
   * genuinely the one thing in the slot, and it will be clipped, not
   * wrapped, if the bar runs out of room.
   */
  collapse?: 'phone' | 'never'
  /** Render as a link. */
  href?: string
  target?: string
  /** Defaults to `noopener noreferrer` when `target="_blank"`. */
  rel?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  /** Tooltip. Defaults to `label`. */
  title?: string
}>(), {
  variant: 'ghost',
  collapse: 'phone',
  type: 'button',
  disabled: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const isLink = computed(() => !!props.href)

const classes = computed(() => [
  'natca-topbar-action',
  `natca-topbar-action--${props.variant}`,
  { 'natca-topbar-action--no-collapse': props.collapse === 'never' },
])

const resolvedRel = computed(() =>
  props.rel ?? (props.target === '_blank' ? 'noopener noreferrer' : undefined),
)

function onClick(e: MouseEvent) {
  if (props.disabled) {
    e.preventDefault()
    return
  }
  emit('click', e)
}
</script>

<template>
  <a
    v-if="isLink"
    :class="classes"
    :href="disabled ? undefined : href"
    :target="target"
    :rel="resolvedRel"
    :title="title ?? label"
    :aria-disabled="disabled ? 'true' : undefined"
    @click="onClick"
  >
    <VIcon class="natca-topbar-action__icon" :icon="icon" size="15" aria-hidden="true" />
    <span class="natca-topbar-action__label">{{ label }}</span>
  </a>
  <button
    v-else
    :class="classes"
    :type="type"
    :disabled="disabled"
    :title="title ?? label"
    @click="onClick"
  >
    <VIcon class="natca-topbar-action__icon" :icon="icon" size="15" aria-hidden="true" />
    <span class="natca-topbar-action__label">{{ label }}</span>
  </button>
</template>
