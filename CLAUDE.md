# NATCA UI Shell

Design system, Vuetify theme preset, and shared Vue components for all NATCA web properties.

## Project Context

- **Status:** Phase 2 (BETA) — Vue + Vuetify component library with shared theme + SASS overrides
- **Package:** `@natca-itc/ui-shell@0.4.0-beta.26` on GitHub Packages
- **Org:** NATCA-ITC
- **Repo:** `NATCA-ITC/natca-ui-shell`
- **Port:** 1310 (playground dev server, `strictPort: true`)
- **Purpose:** Single source of truth for visual direction, design tokens, Vuetify theme, shell layout, and shared components across all MyNATCA apps

## What This Repo Contains

### Published Package (`dist/`)
- Vue shell components (NatcaShell, NatcaTopBar, NatcaTabNav, NatcaSidebar, etc.)
- Shared Vuetify-wrapped components (NatcaTabs, NatcaMemberCard)
- Block layout engine (NatcaBlockCanvas, NatcaBlockEditor, `natcaContentBlocks`, `createBlockRegistry`) — admin-composed pages; see `docs/agent_docs/block-engine-tutorial.md`
- `@natca-itc/ui-shell/block-document` — Vue-free validator entry for Node backends
- Vuetify theme preset (`natcaVuetifyTheme`, `natcaDefaults`)
- `natca-tokens.css` — CSS custom properties (colors, typography, spacing, light/dark)
- `natca-components.css` — Standalone component styles (non-Vuetify pages only)
- `scss/settings.scss` — Vuetify SASS variable overrides (fonts, field sizing, chip/button weights — consuming apps point vite-plugin-vuetify's `styles.configFile` at this)
- `theme.json` — WordPress block editor token mapping

### Source (`src/`)
- `components/` — Vue shell + shared components
- `composables/` — `useShellState`, `useNatcaTheme` reactive state singletons
- `theme/` — Vuetify theme definitions (light, dark, defaults)
- `scss/settings.scss` — Vuetify SASS variable overrides (single source of truth for SASS-level customization; loaded by vite-plugin-vuetify before every component compile)
- `css/` — Design tokens + standalone component CSS
- `styles/` — Shell layout CSS + Vuetify color-token overrides (color decisions only — NO `!important`, no SASS-addressable rules)
- `types/` — TypeScript interfaces

### Agent Docs (`docs/agent_docs/`)
- **`architecture.md`** — Package layers, Vuetify integration strategy, shell contract, build pipeline
- **`component-usage.md`** — **READ THIS FIRST** when building UI in consuming apps. Patterns, anti-patterns, color/spacing/typography rules, and code examples for every common component pattern. Prevents hardcoding.
- **`block-engine-tutorial.md`** — step-by-step adoption of the block layout engine in an app: registry, canvas, editor, a data-bound block, the backend write-path rules. ADR-003 records the decision.

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
| **Vuetify SASS settings** | `@natca-itc/ui-shell/scss/settings.scss` | All Vuetify apps (wired via `vite-plugin-vuetify` `styles.configFile`) |
| **Shell components** | `import { NatcaShell }` | All Vuetify apps |
| **Shared components** | `import { NatcaTabs, NatcaMemberCard }` | All Vuetify apps |
| **Standalone CSS** | `@natca-itc/ui-shell/components` | WordPress, static HTML only — NOT Vuetify apps |

### Consuming App Setup (since 0.4.0)

Three wiring steps are all required — without SASS settings, form fields render at Vuetify's 16px default and VBtn uppercases everything.

**main.ts:**
```ts
import 'vuetify/styles'                                        // Vuetify's own reset + utilities — don't skip!
import '@natca-itc/ui-shell/tokens'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import { natcaVuetifyTheme, natcaDefaults } from '@natca-itc/ui-shell'

const vuetify = createVuetify({
  theme: natcaVuetifyTheme,
  defaults: natcaDefaults,
})
```

**vite.config.ts:**
```ts
import vuetify from 'vite-plugin-vuetify'
import { fileURLToPath } from 'url'

export default defineConfig({
  plugins: [
    vuetify({
      autoImport: true,
      styles: {
        configFile: fileURLToPath(
          import.meta.resolve('@natca-itc/ui-shell/scss/settings.scss')
        ),
      },
    }),
  ],
})
```

**package.json:** `"sass": "^1.99"` as a devDependency (vite-plugin-vuetify compiles SASS at build time).

Full details in `docs/agent_docs/component-usage.md` → "Consuming-app setup".

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

### Pre-release verification by a consuming app

To let an app verify an unpublished build, `npm pack` and hand over the tarball
path. Two ways for them to consume it, with what is actually known about each
(BID, 2026-08-28, beta.24):

- **`npm i <tarball>` — works, but leaves damage to undo.** Proven: it rewrote
  `package.json` to a `file:` spec (which must never be committed) and removed
  `@rollup/rollup-linux-x64-gnu` via npm's optional-deps bug, which broke the
  test run until it was reinstalled with `--no-save`. Recoverable — BID did,
  and all 68 of their tests then passed — but the app must revert
  `package.json` and the lockfile afterwards.
- **Swapping `dist/` into `node_modules/@natca-itc/ui-shell/` — UNTESTED.**
  Should avoid both problems by leaving `package.json` and the lockfile alone.
  Nobody has run it for a whole package yet, so do not present it as proven.
  Caveat if someone does: it is only picked up on dev-server restart, and an
  app that pre-bundles ui-shell (rather than `optimizeDeps.exclude`-ing it)
  must clear its Vite dep cache or it will keep serving the old build and the
  verification silently tests nothing.

Either way the app should NOT commit the version bump until the release is
published; it bumps to the real `^0.4.0-beta.N` afterwards.

## Rules

### Source & Build
- Source of truth is `src/` — never edit `dist/` directly
- HTML preview files consume `src/css/` via `<link>` tags — they are living proof the standalone CSS works
- Token changes must be verified in HTML previews AND playground before publishing
- The `src/theme.json` file exists at the same level as `src/theme/` directory — always use explicit `./theme/index` imports to avoid resolution ambiguity

### SASS-first for Vuetify customization
- **SASS variables are the primary customization path** — anything with a Vuetify SASS var goes in `src/scss/settings.scss`, not in `src/styles/vuetify-overrides.css`. Addressable vars live in `node_modules/vuetify/lib/components/VFoo/_variables.scss` (per-component) and `vuetify/lib/styles/settings/_variables.scss` (global).
- **Dart Sass only permits `with (...)` once per module.** All SASS overrides must live in a single `@forward 'vuetify/settings' with (...)` call — that file resolves to `node_modules/vuetify/_settings.scss` which re-exports all three aggregators (global, component-variables, component-variables-labs).
- **`vuetify-overrides.css` is for color-only tweaks** that can't be expressed as Vuetify theme colors or SASS vars (e.g., outline uses border token not text token, list-item overlay opacity tuning). No `!important` — if you feel like you need it, you're fighting Vuetify and breaking something (the focus-notch bug of April 2026 was caused by `opacity: 1 !important` on `.v-field__outline__notch::before`, which broke Vuetify's own `.v-field--active { opacity: 0 }` notch-cutout rule).
- **Vuetify ships a CSS reset** in `vuetify/lib/styles/generic/_reset.scss` (enabled by `$reset: true`). It runs when the consuming app imports `vuetify/styles` in main.ts. That reset includes `input, textarea, select { border-style: none; background-color: transparent }` — don't hand-write that rule in `vuetify-overrides.css`.

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

## graphify — code knowledge graph

This repo has a graphify knowledge graph at `.graphify/` (gitignored). Rebuild
with `graphify update . --no-description --no-label` (~30s, no LLM, no tokens).

**It is an orientation tool, not a grep replacement** — grep is measurably
faster and adequate for a known symbol name. Use the graph for what grep cannot
express: orienting in unfamiliar code, git co-change coupling, centrality, and
cross-repo inventory via `graphify merge-graphs`.

**Do not trust it for blast radius** — call-edge coverage is thin and never
crosses file types. Treat an empty result as "unknown", never as "nothing
depends on this."

Full guidance, measured limits, and the grammar fix: the `graphify-code-graphs`
shared rule (symlinked in `.claude/rules/shared/`).
