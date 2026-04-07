# NATCA UI Shell

Design system and style guide for all NATCA web properties.

## Project Context

- **Status:** Draft — design proposals, not production code yet
- **Org:** NATCA-ITC
- **Repo:** `NATCA-ITC/natca-ui-shell`
- **Purpose:** Single source of truth for visual direction, design tokens, component patterns, and navigation architecture across all MyNATCA apps

## What This Repo Contains

Static HTML design documents (no build step) that serve as the design source for the `@natca/ui-shell` Vue component package:
- `natca-design-system.html` — Full token reference + component library (colors, typography, spacing, buttons, cards, badges, alerts, forms, tables, light/dark themes)
- `natca-header-variants.html` — 5 public nav options + 2 authenticated shell options (Auth A = admin shell, Auth B = member shell) for team review

## Relationship to Other Projects

This repo defines the visual language that all other MyNATCA apps should follow:
- **Platform** owns auth and data — UI Kit owns the look
- **Hub, BID, DMS, Pay, GATS** should consume tokens from this design system
- Tokens use CSS custom properties with `data-theme` attribute for light/dark switching

## Architecture Direction

- **Phase 1 (current):** Static HTML design proposals — the files in this repo
- **Phase 2:** `@natca/ui-shell` Vue + Vuetify component package — shared shell that all apps import
- **Phase 3:** Module Federation — Hub becomes a unified portal that loads app admin modules at runtime

Key patterns documented in header variants:
- **Auth A = Admin portal shell** — full sidebar for admins, light variant for focused admin tasks
- **Auth B = Member app shell** — horizontal nav for all BUEs, app switcher in system chip
- **App switcher** — cross-app navigation within the ecosystem, lives in the system chip area
- **Contextual second row** — sub-links at section roots, breadcrumbs when deep in a record
- **Shell contract (tentative)** — apps provide `appId`, `navItems[]`, and route `meta.subNav` or `meta.breadcrumb`; shell provides layout, auth context, and theme; active states driven by Vue Router automatically

## Key Design Decisions

- **Fonts:** Outfit/Barlow (display), DM Sans/Inter (body)
- **Light theme:** Public-facing pages (`data-theme="light"`)
- **Dark theme:** Authenticated/member views (`data-theme="dark"`)
- **Brand colors:** Red (#CB092F), Navy (#032449), Blue (#1490D7), Sky (#6AC9FF)

## Rules

- Do not add build tooling until the team has finalized design direction
- Keep HTML files self-contained — they're meant to be opened directly in a browser
- Any token changes here should be propagated to consuming apps once finalized
- When building Vue components later, Auth A (admin shell) and Auth B (member shell) are separate layout components — apps choose between them based on user role/permissions, never combine them into one
