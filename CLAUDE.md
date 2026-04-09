# NATCA UI Shell

Design system, Vuetify theme preset, and shared Vue components for all NATCA web properties.

## Project Context

- **Status:** Phase 2 (BETA) — Vue + Vuetify component library with shared theme
- **Package:** `@natca-itc/ui-shell@0.2.0-beta.1` on GitHub Packages
- **Org:** NATCA-ITC
- **Repo:** `NATCA-ITC/natca-ui-shell`
- **Port:** 1310 (playground dev server, `strictPort: true`)
- **Purpose:** Single source of truth for visual direction, design tokens, Vuetify theme, shell layout, and shared components across all MyNATCA apps

## What This Repo Contains

### Published Package (`dist/`)
- Vue shell components (NatcaShell, NatcaTopBar, NatcaTabNav, NatcaSidebar, etc.)
- Shared Vuetify-wrapped components (NatcaTabs, NatcaMemberCard)
- Vuetify theme preset (`natcaVuetifyTheme`, `natcaDefaults`)
- `natca-tokens.css` — CSS custom properties (colors, typography, spacing, light/dark)
- `natca-components.css` — Standalone component styles (non-Vuetify pages only)
- `theme.json` — WordPress block editor token mapping

### Source (`src/`)
- `components/` — Vue shell + shared components
- `composables/` — `useShellState` reactive state singleton
- `theme/` — Vuetify theme definitions (light, dark, defaults)
- `css/` — Design tokens + standalone component CSS
- `styles/` — Shell layout CSS
- `types/` — TypeScript interfaces

### Design Previews (HTML)
- `natca-design-system.html` — Full token reference + component library (standalone CSS)
- `natca-header-variants.html` — Nav options (standalone CSS)

### Playground (`playground/`)
- Live dev environment at http://localhost:1310
- Three shell variants: Admin (Hub), Member (BID), Minimal (PayChecker)
- Components demo page at `/admin/components`

## Architecture

### Package Layers — What Apps Consume

| Layer | Import | Who Uses It |
|-------|--------|-------------|
| **Tokens CSS** | `@natca-itc/ui-shell/tokens` | Everyone (Vuetify apps, WordPress, static) |
| **Vuetify theme preset** | `import { natcaVuetifyTheme, natcaDefaults }` | All Vuetify apps (Hub, BID, DMS, Pay, GATS) |
| **Shell components** | `import { NatcaShell }` | All Vuetify apps |
| **Shared components** | `import { NatcaTabs, NatcaMemberCard }` | All Vuetify apps |
| **Standalone CSS** | `@natca-itc/ui-shell/components` | WordPress, static HTML only — NOT Vuetify apps |

### Consuming App Setup

```ts
import { createVuetify } from 'vuetify'
import { natcaVuetifyTheme, natcaDefaults } from '@natca-itc/ui-shell'
import '@natca-itc/ui-shell/tokens'

const vuetify = createVuetify({
  theme: natcaVuetifyTheme,
  defaults: natcaDefaults,
})
```

### Relationship to Other Projects

- **Platform** owns auth and data — UI Shell owns the look
- **Hub** — first consumer, fully integrated
- **BID, DMS, Pay, GATS** — should consume theme + shell + shared components
- **WordPress (natca.org)** — consumes tokens CSS + `theme.json` only, not Vue components
- Vuetify apps NEVER load `natca-components.css` — that's for non-Vuetify pages only

### Phases

- **Phase 1 (complete):** Extracted CSS tokens + components published as npm package
- **Phase 2 (current):** Vue + Vuetify component package — shared shell + theme + components
- **Phase 3:** Module Federation — Hub becomes a unified portal loading app modules at runtime

## Key Design Decisions

- **Fonts (finalized):** Barlow 600 (display/headings) + Public Sans (body)
- **Light theme:** Public-facing pages (`data-theme="light"`)
- **Dark theme:** Authenticated/member views (`data-theme="dark"`)
- **Brand colors:** Red (#CE0E2D), Navy/Blue (#003366), Sky (#6AC9FF)
- **Vuetify wrapping:** Shared components wrap Vuetify internally, expose simplified NATCA-specific props. Apps use NatcaTabs (not raw v-tabs), NatcaMemberCard (not raw v-card), etc.

## Build & Publish

```bash
npm run dev            # Playground at :1310
npm run build          # Build CSS + Vue components
npm publish --tag beta # Publish to GitHub Packages
```

## Rules

### Source & Build
- Source of truth is `src/` — never edit `dist/` directly
- HTML preview files consume `src/css/` via `<link>` tags — they are living proof the standalone CSS works
- Token changes must be verified in HTML previews AND playground before publishing
- The `src/theme.json` file exists at the same level as `src/theme/` directory — always use explicit `./theme/index` imports to avoid resolution ambiguity

### Component Design
- All shared components wrap Vuetify — never build raw HTML/CSS equivalents for Vuetify apps
- Auth A (admin shell) and Auth B (member shell) are separate layout configs, not separate components
- Keep the shell contract simple: apps provide data via props, shell provides layout + behavior

### Density & Sizing (HARD REQUIREMENT)
- **All authenticated (dark theme) pages MUST use compact density.** Vuetify components on auth'd pages must minimize padding, margins, and font sizes. The shell is a productivity tool, not a marketing site.
- NatcaDefaults must enforce `density: 'compact'` for VTabs, VTab, VBtn, VDataTable, and other high-frequency components in authenticated contexts
- When adding or modifying shared components, always test at compact density in the dark theme playground before committing
- If a component looks "spacious" or "marketing-site-like" in the dark shell, it's wrong — fix it

### Breaking Change Protocol (CRITICAL)
- **This package is consumed by Hub, BID, DMS, Pay, GATS, and WordPress.** Any change to exports, props, types, theme values, token names, or component behavior is potentially breaking.
- **Before making ANY of these changes, you MUST:**
  1. Explicitly warn the developer that the change is breaking
  2. List every consuming app that will be affected
  3. Describe what will break and what each app needs to update
  4. **REQUIRE CONFIRMATION before proceeding** — do not continue without explicit approval
  5. Advise the developer to communicate the breaking change to the dev team before publishing
- Examples of breaking changes: renaming/removing a CSS token, changing a component prop name or type, changing theme color values, removing an export, changing the package export map
- Non-breaking additions (new components, new optional props, new tokens) do not require this protocol

### Version History
- **Every commit to `main` must be documented** in the UI Shell version history page on Notion (sub-page of the main UI Shell page under DEV/UI Shell)
- Include: date, what changed, whether it's breaking, and which apps are affected
- Use `/sync-to-notion` when available, or document manually

### General
- Keep the package lightweight — minimize dependencies beyond Vue, Vue Router, and Vuetify peer deps
- Test all changes in both light and dark themes before publishing
- Port 1310 is reserved for this project — `strictPort: true` is set, do not change it
