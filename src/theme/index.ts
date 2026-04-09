/**
 * NATCA Vuetify Theme Preset
 *
 * Single source of truth for Vuetify theme configuration across all NATCA apps.
 * Apps import this instead of defining their own theme colors.
 *
 * Usage:
 *   import { natcaVuetifyTheme } from '@natca-itc/ui-shell'
 *   const vuetify = createVuetify({ theme: natcaVuetifyTheme })
 *
 * Or merge with app-specific overrides:
 *   import { natcaLightTheme, natcaDarkTheme } from '@natca-itc/ui-shell'
 */

import type { ThemeDefinition } from 'vuetify'

/**
 * Brand palette — matches natca-tokens.css exactly.
 * Exported for programmatic use (charts, canvas, dynamic styles).
 */
export const natcaColors = {
  red: '#CE0E2D',
  redDark: '#A30B24',
  redSubtle: '#FDE8EC',
  navy: '#003366',
  navyDeep: '#002952',
  navyDark: '#00254D',
  navySubtle: '#E6EDF5',
  sky: '#6AC9FF',
  success: '#2E7D32',
  warning: '#A65D00',
  danger: '#CE0E2D',
  info: '#003366',
} as const

export const natcaLightTheme: ThemeDefinition = {
  dark: false,
  colors: {
    primary: '#003366',
    'primary-darken-1': '#002952',
    secondary: '#CE0E2D',
    'secondary-darken-1': '#A30B24',
    accent: '#6AC9FF',
    background: '#FAF9F5',
    surface: '#FFFFFF',
    'surface-variant': '#EFEFEF',
    error: '#CE0E2D',
    warning: '#A65D00',
    success: '#2E7D32',
    info: '#003366',
    'on-primary': '#FFFFFF',
    'on-secondary': '#FFFFFF',
    'on-background': '#333333',
    'on-surface': '#333333',
    'on-error': '#FFFFFF',
    'on-warning': '#FFFFFF',
    'on-success': '#FFFFFF',
    'on-info': '#FFFFFF',
  },
  variables: {
    'border-color': '#DDDDDD',
    'border-opacity': 1,
    'high-emphasis-opacity': 1,
    'medium-emphasis-opacity': 0.7,
    'disabled-opacity': 0.38,
    'theme-kbd': '#333333',
    'theme-on-kbd': '#FFFFFF',
    'theme-code': '#E6EDF5',
    'theme-on-code': '#003366',
  },
}

export const natcaDarkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    primary: '#CE0E2D',
    'primary-darken-1': '#A30B24',
    secondary: '#003366',
    'secondary-darken-1': '#002952',
    accent: '#6AC9FF',
    background: '#0a0f1a',
    surface: '#111825',
    'surface-bright': '#1A1D27',
    'surface-variant': '#2E3347',
    error: '#EF5350',
    warning: '#FFA726',
    success: '#66BB6A',
    info: '#5BA3D9',
    'on-primary': '#FFFFFF',
    'on-secondary': '#FFFFFF',
    'on-background': '#E8EAF0',
    'on-surface': '#E8EAF0',
    'on-error': '#FFFFFF',
    'on-warning': '#000000',
    'on-success': '#000000',
    'on-info': '#FFFFFF',
  },
  variables: {
    'border-color': '#2E3347',
    'border-opacity': 1,
    'high-emphasis-opacity': 1,
    'medium-emphasis-opacity': 0.7,
    'disabled-opacity': 0.38,
    'theme-kbd': '#22263A',
    'theme-on-kbd': '#E8EAF0',
    'theme-code': '#0D1E2F',
    'theme-on-code': '#5BA3D9',
  },
}

/**
 * Complete Vuetify theme config — drop into createVuetify().
 *
 * Dark theme is default because authenticated NATCA apps use dark.
 * Public-facing pages (WordPress, marketing) use light.
 */
export const natcaVuetifyTheme = {
  defaultTheme: 'natcaDark',
  themes: {
    natcaLight: natcaLightTheme,
    natcaDark: natcaDarkTheme,
  },
} as const

/**
 * Vuetify defaults preset — typography, border radius, density.
 * Merge into createVuetify({ defaults: natcaDefaults }).
 */
export const natcaDefaults = {
  global: {
    ripple: true,
    density: 'compact' as const,
  },
  VBtn: {
    variant: 'flat' as const,
    rounded: 'md',
    density: 'compact' as const,
    size: 'small',
  },
  VCard: {
    rounded: 'lg',
    elevation: 0,
    border: true,
    density: 'compact' as const,
  },
  VTextField: {
    variant: 'outlined' as const,
    density: 'compact' as const,
    color: 'primary',
  },
  VSelect: {
    variant: 'outlined' as const,
    density: 'compact' as const,
    color: 'primary',
  },
  VTextarea: {
    variant: 'outlined' as const,
    density: 'compact' as const,
    color: 'primary',
  },
  VTabs: {
    color: 'primary',
    sliderColor: 'primary',
    density: 'compact' as const,
    height: 36,
  },
  VTab: {
    density: 'compact' as const,
    size: 'small',
  },
  VChip: {
    rounded: 'pill',
    size: 'small',
    density: 'compact' as const,
  },
  VBadge: {
    density: 'compact' as const,
  },
  VDataTable: {
    hover: true,
    density: 'compact' as const,
  },
  VList: {
    density: 'compact' as const,
  },
  VListItem: {
    density: 'compact' as const,
  },
} as const
