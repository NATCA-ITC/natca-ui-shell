# NATCA UI Shell

> **Status: Phase 2 BETA** — `@natca-itc/ui-shell@0.4.0-beta.4` on GitHub Packages. Vue shell + Vuetify theme preset + 21 shared components + SASS customization.

Design system, shared Vuetify theme, and component library for all NATCA web properties. Single source of truth for visual direction, design tokens, shell layout, and cross-app components.

**Human-facing docs live in Notion** under DEV / UI SHELL — Overview, Component Catalog, Shell Variants, Theme & Tokens, SASS Customization, Density & Defaults, Build & Publish, Breaking-Change Protocol, Version History.

## Install

```bash
# .npmrc (one-time per project)
echo "@natca-itc:registry=https://npm.pkg.github.com" >> .npmrc

# Install + the SASS peer that vite-plugin-vuetify needs to compile
npm install @natca-itc/ui-shell@beta
npm install -D sass
```

## Vuetify-app setup — three required steps

Since 0.4.0, all three are mandatory. Skipping any produces wrong font sizes, uppercase buttons, oversized form fields, or invisible field labels.

### 1. `main.ts` / `main.js`

```ts
import 'vuetify/styles'                           // Vuetify reset + utilities — DO NOT skip
import '@natca-itc/ui-shell/tokens'               // NATCA CSS custom properties
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

> **Forbidden in Vuetify apps:** `import '@natca-itc/ui-shell/components'` (standalone CSS, WordPress only) and `optimizeDeps.include` for `vuetify/components/*` paths (esbuild bypasses `vite-plugin-vuetify`'s SASS injection).

## Fonts — consumer loading

UI Shell does not ship webfonts. Consuming apps load the three brand families themselves so the package stays lightweight and CSP-friendly.

Three families back the tokens:

| Token | Family | Weights | Used for |
|-------|--------|---------|----------|
| `--font-body` | Public Sans | 300, 400, 500, 600, 700 | Body text |
| `--font-display` | Barlow | 400, 500, 600, 700 | Headings, eyebrows |
| `--font-mono` | JetBrains Mono | 400, 500, 600 | Slugs, identifiers, code (e.g. `NatcaSlugLabel`) |

The mono stack falls back to the system monospace stack (`ui-monospace`, `SF Mono`, `Menlo`, `Consolas`) when JetBrains Mono isn't loaded — text still renders, just without the brand mono face.

### With `unplugin-fonts` (recommended)

```ts
// vite.config.ts
import unfonts from 'unplugin-fonts/vite'

unfonts({
  google: {
    families: [
      { name: 'Public Sans', styles: 'wght@300;400;500;600;700' },
      { name: 'Barlow', styles: 'wght@400;500;600;700' },
      { name: 'JetBrains Mono', styles: 'wght@400;500;600' },
    ],
  },
})
```

### With a `<link>` tag

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Public+Sans:wght@300;400;500;600;700&display=swap"
>
```

## Wrap your app

```vue
<template>
  <NatcaShell
    app-id="hub"
    app-name="Hub"
    :tabs="tabs"
    :user="user"
    :facility="user.facility"
    :sidebar-sections="sidebarSections"
    :breadcrumbs="breadcrumbs"
    :apps="apps"
  >
    <router-view />
  </NatcaShell>
</template>
```

See **Shell Variants** in Notion for Admin / Member / Minimal patterns.

## What ships

### For Vuetify apps

| Export | Import | Purpose |
|--------|--------|---------|
| Theme preset | `import { natcaVuetifyTheme, natcaDefaults }` | Vuetify theme + defaults — drop into `createVuetify()` |
| Color palette | `import { natcaColors }` | Brand colors as JS object (charts, canvas, dynamic styles) |
| SASS settings | `@natca-itc/ui-shell/scss/settings.scss` | Vuetify SASS variable overrides (consumed via `vite-plugin-vuetify` `configFile`) |
| Tokens CSS | `import '@natca-itc/ui-shell/tokens'` | CSS custom properties (light + dark) |
| Shell components | `import { NatcaShell, NatcaTopBar, ... }` | App shell layout |
| Native primitives | `import { NatcaButton, NatcaAlert, NatcaPillNav, NatcaDialog }` | Brand-specific button/alert/etc. |
| Composite patterns | `import { NatcaCard, NatcaHeaderCard, NatcaStatCard, NatcaStatGrid, NatcaEmptyState, NatcaPageHeader, NatcaAnnotation }` | Higher-level patterns |
| Cross-app shared | `import { NatcaTabs, NatcaMemberCard, NatcaThemeToggle }` | Cross-app data + theme components |
| Composables | `import { useShellState, useNatcaTheme }` | Reactive shell + theme state |
| Types | `import type { NatcaTab, NatcaUser, NatcaApp, NatcaBreadcrumb, NatcaNavSection, ... }` | TypeScript interfaces |

### For WordPress / static HTML only

| Export | Import | Purpose |
|--------|--------|---------|
| Tokens CSS | `@natca-itc/ui-shell/tokens` | CSS custom properties |
| Components CSS | `@natca-itc/ui-shell/components` | Standalone class-based components — **NOT for Vuetify apps** |
| `theme.json` | `@natca-itc/ui-shell/theme.json` | Gutenberg block editor token mapping |

## Component summary (21 exports)

### Shell layout (7)

`NatcaShell`, `NatcaTopBar`, `NatcaTabNav`, `NatcaBreadcrumbRow`, `NatcaSidebar`, `NatcaSearchDrawer`, `NatcaAppSwitcher`

### Native primitives (4)

`NatcaButton` (5 variants: primary/secondary/danger/ghost/link), `NatcaAlert` (no-icon border-start), `NatcaPillNav` (segmented toggles), `NatcaDialog` (navy/red headers)

### Composite patterns (7)

`NatcaCard`, `NatcaHeaderCard`, `NatcaStatCard`, `NatcaStatGrid`, `NatcaEmptyState`, `NatcaPageHeader`, `NatcaAnnotation`

### Cross-app shared (3)

`NatcaTabs` (in-page tabs), `NatcaMemberCard`, `NatcaThemeToggle`

For when-to-use vs. raw Vuetify, see Notion → **Component Catalog**.

## Theme

| Theme | Use | `data-theme` |
|-------|-----|----|
| `natcaDark` | Authenticated apps | `dark` |
| `natcaLight` | Public pages, WordPress | `light` |

Both themes share brand tokens — Red `#CE0E2D`, Navy `#003366`, Sky `#6AC9FF`. Fonts: Barlow 600 (display) + Public Sans (body). `natcaDefaults` enforces compact density globally for authenticated views.

## Development

```bash
npm run dev            # Playground at http://localhost:1310
npm run build          # Build CSS + Vue library
npm publish --tag beta # Publish to GitHub Packages
```

Playground demos (`/admin`, `/member`, `/minimal`, `/admin/components`, `/admin/design-standards`) live at port 1310.

## Repo structure

```
natca-ui-shell/
├── src/
│   ├── components/       # Vue shell + shared + primitive + composite components (21 total)
│   ├── composables/      # useShellState, useNatcaTheme
│   ├── theme/            # Vuetify theme preset (natcaLight, natcaDark, natcaDefaults)
│   ├── scss/             # settings.scss — Vuetify SASS variable overrides
│   ├── styles/           # shell.css, vuetify-overrides.css (color decisions only, no !important)
│   ├── css/              # natca-tokens.css, natca-components.css (standalone)
│   ├── types/            # TypeScript interfaces
│   └── index.ts          # Package entry point
├── playground/           # Live dev environment (:1310)
├── docs/
│   ├── agent_docs/       # In-repo agent reference (architecture.md, component-usage.md)
│   ├── architecture/
│   │   └── decisions/    # ADRs
│   ├── audit/            # Audit reports (NAT-306)
│   └── screenshots/      # Playwright captures used in Notion
├── tests/                # Playwright specs
├── dist/                 # Built output
├── natca-design-system.html       # Static token + component reference
└── natca-header-variants.html     # Static nav variants reference
```

## Architecture deep-dive

- [`docs/agent_docs/architecture.md`](docs/agent_docs/architecture.md) — package layers, Vuetify integration, build pipeline (in-repo agent reference)
- [`docs/agent_docs/component-usage.md`](docs/agent_docs/component-usage.md) — patterns and anti-patterns (in-repo agent reference, **read first** when building UI)
- Notion DEV / UI SHELL — human-facing canonical content
