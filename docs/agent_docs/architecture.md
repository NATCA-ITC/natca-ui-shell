# UI Shell Architecture

> **Human-facing source of truth lives in Notion.** This file is the in-repo agent reference — it ships with the npm package and is consumed by other apps' agent tooling. For overview, component catalog, theme details, density tables, and the breaking-change protocol, see **DEV / UI SHELL** in Notion.

## Overview

`@natca-itc/ui-shell` is the shared design system and component library for all NATCA web properties. It wraps Vuetify and exports a unified theme, shell layout components, and shared business components.

## Package Layers

| Layer | Export Path | Consumers |
|-------|------------|-----------|
| CSS Tokens | `@natca-itc/ui-shell/tokens` | All (Vuetify apps, WordPress, static) |
| Vuetify Theme Preset | `import { natcaVuetifyTheme, natcaDefaults }` | Vuetify apps only |
| Shell Components | `import { NatcaShell, NatcaTopBar, ... }` | Vuetify apps only |
| Shared Components | `import { NatcaTabs, NatcaMemberCard }` | Vuetify apps only |
| Composite Patterns | `import { NatcaHeaderCard, NatcaStatCard, ... }` | Vuetify apps only |
| Standalone CSS | `@natca-itc/ui-shell/components` | WordPress, static HTML — NOT Vuetify apps |
| WordPress theme.json | `@natca-itc/ui-shell/theme.json` | WordPress block editor |

## Vuetify Integration Strategy

UI Shell does NOT replace Vuetify — it wraps it:

- **Tokens CSS** provides design values as CSS custom properties
- **Vuetify theme preset** maps those tokens into Vuetify's `createVuetify()` config
- **natcaDefaults** sets component-level defaults (compact density, rounded corners, etc.)
- **Shared components** wrap Vuetify components internally (v-tabs, v-card, v-avatar) and expose a simplified NATCA-specific API

Apps should use Vuetify components directly for standard UI (buttons, forms, dialogs, tables). They should use ui-shell components for:
- Shell layout (NatcaShell, NatcaTopBar, NatcaSidebar, NatcaTabNav)
- Cross-app patterns (NatcaTabs, NatcaMemberCard)
- Composite patterns that have no single Vuetify equivalent (NatcaHeaderCard, NatcaStatCard, NatcaStatGrid, NatcaEmptyState, NatcaPageHeader, NatcaAnnotation)

## Shell Contract

**Shell provides:** topbar (with theme toggle + toolbar-actions slot), tab navigation, sidebar, breadcrumbs, search drawer, app switcher, theme

**App provides via props:**
- `appId` / `appName` — identifies the app in the switcher
- `tabs: NatcaTab[]` — top-level navigation tabs
- `sidebarSections?: NatcaNavSection[]` — sidebar nav (omit for no sidebar)
- `breadcrumbs?: NatcaBreadcrumb[]` — contextual breadcrumb trail (from route meta)
- `user: NatcaUser` — current user info for avatar/menu
- `apps?: NatcaApp[]` — apps available in the switcher

## Theme Architecture

Two Vuetify themes are registered: `natcaLight` and `natcaDark`. Both have matching `[data-theme]` CSS token blocks in `natca-tokens.css`.

**Theme selection (ADR-002):** Apps control which theme is active via `useNatcaTheme()`. The composable manages a `preference` (`'light' | 'dark' | 'system' | …`), resolves `'system'` via `prefers-color-scheme`, and syncs the result to Vuetify's active theme. `NatcaShell` reads the resolved value and sets its `data-theme` attribute accordingly — nothing is hardcoded.

**App boot pattern:**
```ts
import { useNatcaTheme } from '@natca-itc/ui-shell'
const { setTheme } = useNatcaTheme()
setTheme(localStorage.getItem('natca-theme') ?? 'dark')  // restore saved or default to dark
```

**User-facing toggle:** `NatcaThemeToggle` is a standalone `VSelect` component. Apps drop it wherever they want (settings page, profile view). It emits `'change'` with the new preference string so the app can persist it. The `themes` prop accepts `(string | NatcaThemeOption)[]` for custom theme lists and icons.

**Extensibility:** Theme names are open strings. Adding a new theme (e.g. `'glass'`) requires only a Vuetify theme definition (`natcaGlass`) + a `[data-theme="glass"]` CSS block — no type changes.

- Brand: Red #CE0E2D, Navy #003366, Sky #6AC9FF
- Fonts: Barlow 600 (display), Public Sans (body)
- Compact density enforced globally for authenticated views

## Build Pipeline

- `npm run build:css` — copies `src/css/` + `src/theme.json` + `src/scss/settings.scss` to `dist/` (CommonJS script: `build-css.cjs`)
- `npm run build:vue` — Vite library build: `src/index.ts` → `dist/vue/natca-ui-shell.js` + `.css` + `.d.ts`
- `npm run build` — runs both
- Externals: vue, vue-router, vuetify (peer deps, not bundled)
- `prepublishOnly` automatically runs `npm run build` before `npm publish`

## Consuming App Setup

Three steps are mandatory since 0.4.0. Skipping any of them produces wrong font sizes, uppercase buttons, or oversized form fields.

### 1. `main.ts`

```ts
import 'vuetify/styles'                                  // Vuetify reset + utilities — DO NOT skip
import '@natca-itc/ui-shell/tokens'                      // NATCA CSS custom properties
import '@mdi/font/css/materialdesignicons.css'

import { createVuetify } from 'vuetify'
import { natcaVuetifyTheme, natcaDefaults } from '@natca-itc/ui-shell'

const vuetify = createVuetify({
  theme: natcaVuetifyTheme,
  defaults: natcaDefaults,
})
```

### 2. `vite.config.ts`

```ts
import vuetify from 'vite-plugin-vuetify'
import { fileURLToPath } from 'url'

vuetify({
  autoImport: true,
  styles: {
    configFile: fileURLToPath(
      import.meta.resolve('@natca-itc/ui-shell/scss/settings.scss')
    ),
  },
})
```

### 3. `package.json`

```json
"devDependencies": { "sass": "^1.99" }
```

`vite-plugin-vuetify` uses Sass to compile NATCA's settings file at build time. Without it, the SASS overrides silently don't apply.

> **Forbidden in Vuetify apps:** `import '@natca-itc/ui-shell/components'`. That standalone CSS bundle is for WordPress / static HTML only.

## Key Files

| Path | Purpose |
|------|---------|
| `src/theme/index.ts` | Vuetify theme definitions + defaults |
| `src/components/NatcaShell.vue` | Main shell orchestrator |
| `src/components/NatcaTabs.vue` | Shared tabs (wraps v-tabs) |
| `src/components/NatcaMemberCard.vue` | Member display card (wraps v-card) |
| `src/composables/useShellState.ts` | Reactive shell UI state (sidebar, search, app switcher) |
| `src/composables/useNatcaTheme.ts` | Theme preference composable — singleton, syncs to Vuetify |
| `src/components/NatcaThemeToggle.vue` | Standalone theme select dropdown |
| `src/types/index.ts` | All TypeScript interfaces |
| `src/css/natca-tokens.css` | Design token definitions |
| `src/css/natca-components.css` | Standalone component CSS (non-Vuetify) |

## Related Docs

- **[Component Usage Guide](./component-usage.md)** — patterns, anti-patterns, and examples for building pages in consuming apps. **Read this before writing UI code.**
- **`natca-design-system.html`** — visual reference with Public/Authenticated toggle (open in browser)
- **Playground** — interactive Vue component demos at http://localhost:1310 (`npm run dev`)
