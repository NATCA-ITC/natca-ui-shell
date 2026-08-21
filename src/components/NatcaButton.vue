<script setup lang="ts">
/**
 * NatcaButton — Native Vue button matching the design system exactly.
 *
 * Replaces VBtn for the 5 design-system button variants. No Vuetify dependency.
 *
 * @example
 * <NatcaButton variant="primary" @click="save">Save</NatcaButton>
 * <NatcaButton variant="secondary">Export</NatcaButton>
 * <NatcaButton variant="danger">Delete</NatcaButton>
 * <NatcaButton variant="ghost">Cancel</NatcaButton>
 * <NatcaButton variant="link">View Details</NatcaButton>
 *
 * @example Action tier (use inside dialog/card actions)
 * <NatcaButton variant="primary" size="md">Submit Request</NatcaButton>
 */
import { computed } from 'vue'
import {
  RouterLink,
  type NavigationFailure,
  type RouteLocationRaw,
} from 'vue-router'

type RouterNavigate = (e?: MouseEvent) => Promise<void | NavigationFailure>

const props = withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'link'
  size?: 'sm' | 'md'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  block?: boolean
  /** External link target — renders as `<a href>`. */
  href?: string
  /** Internal route — renders as `<router-link>`. Takes precedence over `href`. */
  to?: RouteLocationRaw
}>(), {
  variant: 'primary',
  size: 'sm',
  type: 'button',
  disabled: false,
  block: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const classes = computed(() => [
  'natca-btn',
  `natca-btn--${props.variant}`,
  `natca-btn--${props.size}`,
  { 'natca-btn--block': props.block, 'natca-btn--disabled': props.disabled },
])

function handleClick(e: MouseEvent) {
  if (props.disabled) {
    e.preventDefault()
    return
  }
  emit('click', e)
}

// RouterLink click handler — forwards to router-link's navigate() unless
// disabled or the user used a modifier (Cmd/Ctrl/Shift/middle-click) which
// the browser handles natively (open in new tab/window).
function handleRouterClick(e: MouseEvent, navigate: RouterNavigate) {
  if (props.disabled) {
    e.preventDefault()
    return
  }
  emit('click', e)
  if (e.defaultPrevented) return
  // Let router-link decide whether to call router.push or fall through to the
  // browser (modifier-key + middle-click are passed through automatically).
  void navigate(e)
}

// Space-bar activation for anchor-rendered buttons (mirrors native <button>).
function handleRouterKeydown(e: KeyboardEvent, navigate: RouterNavigate) {
  if (e.key !== ' ') return
  if (props.disabled) {
    e.preventDefault()
    return
  }
  e.preventDefault()
  void navigate()
}
</script>

<template>
  <RouterLink
    v-if="to"
    :to="to"
    custom
    v-slot="{ href: rlHref, navigate }"
  >
    <a
      :href="rlHref"
      :class="classes"
      :aria-disabled="disabled"
      :tabindex="disabled ? -1 : 0"
      @click="(e) => handleRouterClick(e, navigate)"
      @keydown="(e) => handleRouterKeydown(e, navigate)"
    >
      <slot />
    </a>
  </RouterLink>
  <a
    v-else-if="href"
    :href="href"
    :class="classes"
    :aria-disabled="disabled"
    @click="handleClick"
  >
    <slot />
  </a>
  <button
    v-else
    :type="type"
    :class="classes"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<style>
.natca-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-family: var(--font-body);
  font-weight: 600;
  letter-spacing: 0.2px;
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
  white-space: nowrap;
  text-transform: none; /* override any ambient uppercase */
  box-sizing: border-box;
}

.natca-btn:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 1px;
}

/* ── Sizes ── */
.natca-btn--sm {
  font-size: 12px;
  padding: 4px 12px;
  height: 28px;
}

.natca-btn--md {
  font-size: 13px;
  padding: 6px 18px;
  height: 36px;
}

.natca-btn--block {
  display: flex;
  width: 100%;
}

.natca-btn--disabled,
.natca-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

/* ── Variants ──
 *
 * NAT-954: every variant colour rule doubles its base class
 * (`.natca-btn.natca-btn--primary`, not `.natca-btn--primary`) to reach
 * specificity (0,2,0). This is deliberate — do not "simplify" it back.
 *
 * Vuetify ships a CSS reset (vuetify/lib/styles/generic/_reset.scss:172)
 * containing:
 *
 *     button, [type="button"], [type="reset"], [type="submit"], [role="button"]
 *       { cursor: pointer; color: inherit }
 *
 * `[type="button"]` is (0,1,0) — a dead tie with a single-class variant rule,
 * broken only by which stylesheet loads last. Consuming apps sequence their
 * CSS differently: the playground injects SFC styles after Vuetify and wins
 * the tie by luck, while BID loads ui-shell's prebuilt CSS before
 * vite-plugin-vuetify's virtual sheet and loses it, so every button took its
 * parent's colour (primary rendered black on navy, ~1.9:1). Winning a tie by
 * load order is not a contract we can offer consumers — so we outrank it.
 */

/* Primary — navy in light, red in dark */
.natca-btn.natca-btn--primary {
  background: var(--natca-navy);
  color: #FFFFFF;
}
.natca-btn--primary:hover { opacity: 0.9; }
[data-theme="dark"] .natca-btn--primary,
.v-theme--natcaDark .natca-btn--primary {
  background: var(--natca-red);
}

/* Secondary — subtle bg with border */
.natca-btn.natca-btn--secondary {
  background: var(--color-bg-subtle);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}
.natca-btn--secondary:hover { background: var(--overlay-hover); }

/* Danger — outlined red, fills on hover */
.natca-btn.natca-btn--danger {
  background: transparent;
  color: var(--color-danger);
  border: 1px solid var(--color-danger);
}
.natca-btn--danger:hover {
  background: var(--color-danger);
  color: #FFFFFF;
}

/* Ghost — transparent, muted text */
.natca-btn.natca-btn--ghost {
  background: transparent;
  color: var(--color-text-muted);
}
.natca-btn--ghost:hover {
  background: var(--overlay-hover);
  color: var(--color-text-primary);
}

/* Link — blue text, no border */
.natca-btn.natca-btn--link {
  background: transparent;
  color: var(--natca-blue);
}
.natca-btn--link:hover {
  background: var(--overlay-hover);
}
</style>
