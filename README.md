# NATCA UI Shell

> **Status: DRAFT** — Design proposals ready for team review. Not yet implemented as production code.

Unified design system and style guide for all NATCA web properties (natca.org, MyNATCA portal, Hub, BID, DMS, Pay, GATS, Discord). This repo is the single source of truth for visual direction, design tokens, component patterns, and navigation architecture across the ecosystem.

## What's Inside

### `natca-design-system.html`
Full design token reference and component library covering:
- **Color tokens** — Brand palette (red, navy, blue, sky), neutrals, semantic colors
- **Light + Dark themes** — `data-theme="light"` for public pages, `data-theme="dark"` for authenticated views
- **Typography** — Barlow (display/headings), Inter (body), type scale from 12px–48px
- **Spacing** — 4px base grid system
- **Components** — Buttons (primary, secondary, danger, ghost, accent), cards, badges, alerts, form elements, data tables
- **Navigation** — Two-tier pattern (utility bar + primary nav) with dropdowns

### `natca-header-variants.html`
Navigation design proposals for team review:
- **Option 1 — Classic Refined** — White primary bar, navy utility, red accent border
- **Option 2 — Navy Command** — Full navy primary bar, bold brand presence
- **Option 3 — Red Impact** — Red utility bar, white primary, strong CTA focus
- **Option 4 — Compact Modern** — Single-bar minimal layout with sub-nav
- **Option 5 — Floating Glass** — Glassmorphism nav over hero, modern/editorial feel
- **Auth Option A — Admin Portal Shell** — Full sidebar for admins, light variant for focused admin tasks
- **Auth Option B — Member App Shell** — Horizontal nav for all BUEs, app switcher in system chip

## How to View

Open either HTML file in a browser. No build step or dependencies required.

## Brand Tokens (Quick Reference)

| Token | Value | Use |
|-------|-------|-----|
| `--natca-red` | `#CB092F` | Primary brand red |
| `--natca-navy` | `#032449` | Primary brand navy |
| `--natca-blue` | `#1490D7` | UI action blue |
| `--natca-sky` | `#6AC9FF` | Accent / dark surfaces |
| `--natca-gold` | `#D4A017` | Accent highlight |

## Typography

| Role | Font | Fallback |
|------|------|----------|
| Display / Headings | Outfit, Barlow | sans-serif |
| Body | DM Sans, Inter | sans-serif |
| Monospace | Courier New | monospace |

## Theme Architecture

- **Public pages** (`data-theme="light"`) — Light backgrounds, dark text, warm off-white (#FAF9F5)
- **Authenticated views** (`data-theme="dark"`) — Dark navy backgrounds, light text, elevated surfaces

All NATCA apps should consume these tokens. The design system CSS can be dropped into any project and themed via the `data-theme` attribute.

## Architecture Direction

This repo will evolve into a **`@natca/ui-shell`** Vue + Vuetify component package (Option 2 from the architecture discussion):

- **Shared shell, not duplicated chrome.** Each app imports the shared shell package — header, sidebar, app switcher, and layout are owned in one place.
- **App switcher** provides cross-app navigation within the MyNATCA ecosystem. Apps register themselves in a central app registry with routes and metadata.
- **Contextual second row pattern:** Sub-links appear at section roots (e.g., BID > Facilities, BID > Reports). When the user navigates deep into a record, the second row switches to breadcrumbs.
- **Future: Module Federation (Option 3).** The long-term path is for Hub to become a true unified portal that loads app admin modules at runtime via Module Federation. The shared shell package is a prerequisite — once apps share a common shell contract, they can be loaded as federated modules without visual seams.
- **Design proposals inform Vue components.** The static HTML files in this repo are the design source that directly drives the Vue components to be built in the `@natca/ui-shell` package.

### Shell Contract (Tentative)

The shell provides layout and platform context. Each app provides its own nav config and route metadata. Active states are automatic via Vue Router.

**Shell provides:**
| Concern | Details |
|---------|---------|
| Topbar | Logo, app switcher, notifications, avatar |
| Sidebar / horizontal nav | Renders from app-provided `navItems[]` |
| Contextual second row | Reads route `meta.subNav` or `meta.breadcrumb` |
| Auth context | User, facility, permissions (from Platform) |
| Theme tokens | CSS custom properties, light/dark switching |

**App provides:**
| Concern | Details |
|---------|---------|
| `appId` / `appName` | Identifies the app in the switcher |
| `navItems[]` | Array of `{ label, icon, to }` objects |
| Route `meta.subNav` | Array of sub-links for section roots |
| Route `meta.breadcrumb` | Function returning breadcrumb trail for deep pages |

**How active state works:** Vue Router's `router-link-active` class handles sidebar/tab highlighting automatically — no custom event bus or postMessage needed. The shell renders `<router-link>` elements from the app's `navItems`, and Vue Router manages the rest.

**How the contextual second row works:** Each route declares either `meta.subNav` (array of tab links) or `meta.breadcrumb` (function that returns trail from route params). The shell checks which is present and renders the appropriate component. If neither exists, the second row is hidden.

This contract carries forward into Module Federation — the shape of what apps provide doesn't change, only the loading mechanism.

### Deliverables

| Deliverable | What it is | Consumers |
|---|---|---|
| `natca-tokens.css` | CSS custom properties (`:root` block only) | Everything — WordPress, Vue apps, email templates |
| `natca-components.css` | Buttons, cards, badges, alerts, forms, tables, loading/empty/error/toast states | WordPress theme + Vue apps |
| `@natca/ui-shell` | Vue layout components (Auth A, Auth B, app switcher, contextual nav) | Vue apps only |
| `theme.json` mappings | WordPress-native token registration (colors, fonts) | WordPress theme only |

### WordPress Integration

The NATCA public site (natca.org) runs WordPress. It consumes the design system through CSS, not Vue components:

- **Tokens:** WordPress theme enqueues `natca-tokens.css` as the first stylesheet. All custom CSS uses token variables.
- **Components:** `natca-components.css` provides `.btn`, `.card`, `.alert`, `.badge`, etc. — usable directly in PHP templates, Gutenberg blocks, or shortcodes.
- **Navigation:** The public nav options (1–5) translate directly into a WordPress `header.php` template or FSE template part once the team picks a direction.
- **`theme.json`:** WordPress 6.x maps tokens natively — colors appear in the block editor palette, fonts in the typography picker.
- **Theme:** WordPress is always `data-theme="light"` (public-facing). The dark theme is for authenticated Vue apps only.

WordPress does NOT use the Vue shell components, app switcher, or auth context — those are for Platform-authenticated apps.

## Where This Fits

This repo sits alongside the other MyNATCA ecosystem projects:

| Project | Purpose |
|---------|---------|
| **natca-ui-shell** (this repo) | Design system, tokens, style guide |
| **Platform** | Auth, Supabase, data sync, API services |
| **Hub** | Admin dashboard (Vue 3 + Vuetify) |
| **BID** | Facility bid management (Laravel + Vue) |
| **Discord** | Bot — verification, role sync |
| **DMS** | Document management |
| **Pay** | PayChecker — LES parsing |
| **GATS** | Grievance tracking viewer |

## Next Steps

1. Team reviews nav options (1–5) and picks public navigation direction
2. Team reviews auth shell (Option A vs B) for authenticated apps
3. Finalize token values and extract CSS into standalone `natca-tokens.css`
4. Extract shared shell into `@natca/ui-shell` Vue + Vuetify component package
5. Define app switcher app registry and routing
6. Build as importable package for Vue/Vuetify apps (Hub, BID, DMS, Pay, GATS)
7. Enable GitHub Pages for shareable review link
8. Design shell contract with Module Federation migration in mind — keep layout components decoupled so they can be loaded as federated modules later
