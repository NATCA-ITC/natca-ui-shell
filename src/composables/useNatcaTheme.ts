import { ref, computed, readonly } from 'vue'

interface NatcaThemeOptions {
  systemLight?: string
  systemDark?:  string
}

// ── Singleton state ──

const _preference = ref('system')
let _systemLight = 'light'
let _systemDark  = 'dark'
const _osDark    = ref(false)
let _initialized = false

export const resolvedTheme = computed(() =>
  _preference.value === 'system'
    ? (_osDark.value ? _systemDark : _systemLight)
    : _preference.value
)

// ── Composable ──

export function useNatcaTheme(options?: NatcaThemeOptions) {
  if (!_initialized) {
    _initialized = true
    if (options?.systemLight) _systemLight = options.systemLight
    if (options?.systemDark)  _systemDark  = options.systemDark

    if (typeof window !== 'undefined') {
      const mql = window.matchMedia('(prefers-color-scheme: dark)')
      _osDark.value = mql.matches
      mql.addEventListener('change', e => { _osDark.value = e.matches })
    }
  }

  return {
    preference: readonly(_preference),
    resolved:   resolvedTheme,
    isDark:     computed(() => resolvedTheme.value === _systemDark),
    setTheme(pref: string) { _preference.value = pref },
  }
}
