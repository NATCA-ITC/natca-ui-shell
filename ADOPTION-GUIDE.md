# NATCA Design System — Adoption Guide

> **This file has moved.** Earlier versions of this guide predated the Vuetify integration and recommended imports that are now forbidden in Vuetify apps. To prevent confusion, all setup guidance now lives in one of two places, depending on your audience.

## For Vue 3 + Vuetify apps (Hub, BID, DMS, Pay, GATS, Platform Vue 3 client)

- **Three-step Vuetify wiring**, the `natcaDefaults` table, the `frontend-shell-standard.md` rules, and the package contract:
  - [`platform/dev-standards/rules/frontend-shell-standard.md`](https://github.com/NATCA-ITC/platform/blob/main/dev-standards/rules/frontend-shell-standard.md) — the canonical rule
  - [`docs/agent_docs/architecture.md`](docs/agent_docs/architecture.md) — in-repo agent reference (architecture deep-dive)
  - [`docs/agent_docs/component-usage.md`](docs/agent_docs/component-usage.md) — in-repo agent reference (patterns + anti-patterns, READ FIRST when building UI)
- **Human-facing docs in Notion**: DEV / UI SHELL — Overview, Component Catalog, Shell Variants, Theme & Tokens, SASS Customization, Density & Defaults, Build & Publish, Breaking-Change Protocol, Version History.

## For WordPress (`natca.org`) and static HTML

Consume tokens CSS + `theme.json` only — Vue components do not apply.

```bash
npm install @natca-itc/ui-shell@beta
```

```php
// functions.php
function natca_enqueue_design_system() {
  wp_enqueue_style('natca-tokens', get_template_directory_uri() . '/assets/css/natca-tokens.css', [], '0.4.0-beta.4');
  wp_enqueue_style('natca-components', get_template_directory_uri() . '/assets/css/natca-components.css', ['natca-tokens'], '0.4.0-beta.4');
}
add_action('wp_enqueue_scripts', 'natca_enqueue_design_system');
```

Copy `dist/theme.json` to your theme root for Gutenberg block editor support. WordPress is always `data-theme="light"`.

## NEVER (forbidden in Vuetify apps)

```js
import '@natca-itc/ui-shell/components'   // ← this CSS is for WordPress/static HTML only
```

Importing the standalone components CSS in a Vuetify app conflicts with Vuetify's own component styles and silently breaks `natcaDefaults` + SASS overrides. See `frontend-shell-standard.md` "Forbidden" section for the full list.
