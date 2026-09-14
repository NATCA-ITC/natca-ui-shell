/**
 * useUnknownPropsWarning — dev-only guard for props people keep guessing.
 *
 * Vue silently forwards an undeclared binding (`:loading`, `color`, `icon`…)
 * to the root element as an inert HTML attribute, so a wrong prop name fails
 * without a trace. Shared components list the names consumers reach for and
 * get a one-line console warning in dev builds when one shows up in `attrs`.
 *
 * Zero cost in production: the whole body is behind `import.meta.env.DEV`.
 * Warns once per component + key per page load, not per instance.
 *
 * @example
 * useUnknownPropsWarning('NatcaButton', {
 *   color: 'use `variant`',
 *   icon: 'put the icon in the default slot, or use NatcaIconButton',
 * })
 */
import { onMounted, useAttrs } from 'vue'

const warned = new Set<string>()

const toKebab = (key: string) => key.replace(/[A-Z]/g, m => '-' + m.toLowerCase())

export function useUnknownPropsWarning(component: string, guessed: Record<string, string>): void {
  if (!import.meta.env?.DEV) return
  const attrs = useAttrs()
  onMounted(() => {
    if (typeof console === 'undefined') return
    for (const [key, advice] of Object.entries(guessed)) {
      const present = key in attrs || toKebab(key) in attrs
      if (!present) continue
      const id = `${component}:${key}`
      if (warned.has(id)) continue
      warned.add(id)
      console.warn(`[${component}] \`${key}\` is not a prop and does nothing here — ${advice}.`)
    }
  })
}
