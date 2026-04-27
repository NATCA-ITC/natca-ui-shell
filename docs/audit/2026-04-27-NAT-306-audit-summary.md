# NAT-306 Audit Summary — 2026-04-27

Full code audit of `@natca-itc/ui-shell` (v0.4.0-beta.4) against design rules in `CLAUDE.md` and `platform/dev-standards/rules/frontend-shell-standard.md`. See [NAT-306](https://linear.app/natca/issue/NAT-306) for scope.

## Findings (filed as sub-issues)

| # | Severity | Sub-issue | Title |
|---|---|---|---|
| 1 | HIGH | [NAT-308](https://linear.app/natca/issue/NAT-308) | Rewrite or remove ADOPTION-GUIDE.md (outdated, recommends forbidden imports) |
| 2 | HIGH | [NAT-309](https://linear.app/natca/issue/NAT-309) | Refresh README.md (stale version, missing three-step wiring, incomplete component list) |
| 3 | MEDIUM | [NAT-310](https://linear.app/natca/issue/NAT-310) | BID frontend imports forbidden `@natca-itc/ui-shell/components` |
| 4 | MEDIUM | [NAT-311](https://linear.app/natca/issue/NAT-311) | Platform Vue 3 client imports forbidden `@natca-itc/ui-shell/components` |
| 5 | LOW | [NAT-312](https://linear.app/natca/issue/NAT-312) | natcaDefaults table omits `VTabs.sliderColor` and `VRadioGroup.hideDetails` |
| 6 | LOW | [NAT-313](https://linear.app/natca/issue/NAT-313) | SASS overrides table omits `$button-text-letter-spacing` and `$button-border-radius` |
| 7 | LOW | [NAT-314](https://linear.app/natca/issue/NAT-314) | Extend `/sync-to-notion` mappings for UI Shell doc paths |

## Audit checklist (all items run)

| Check | Result |
|---|---|
| Every export in `src/index.ts` listed in `frontend-shell-standard.md` Component Hierarchy | All 21 ✅ |
| `natcaDefaults` matches the rule's table | Drift: see NAT-312 |
| `src/scss/settings.scss` matches the rule's SASS table | Drift: see NAT-313 |
| `data-theme` values used by components are documented | `light` + `dark` documented in `natca-tokens.css` ✅ |
| No `!important` in `src/styles/vuetify-overrides.css` | Clean ✅ |
| No `@natca-itc/ui-shell/components` import in Vuetify apps | BID + Platform-client offending — see NAT-310, NAT-311. Hub + DMS clean. Pay/GATS not yet integrated. |
| Shell components handle compact density in dark theme | ✅ — natcaDefaults applies globally; verified via screenshots |
| Playground covers each variant + new switcher | ✅ — `/admin`, `/member` (Area tab exercises switcher children), `/minimal` |

## Notion deliverables

Under [DEV / UI SHELL](https://www.notion.so/33cd00a63edf8129bba2e8162d48b057):

- **Overview** (parent page — rewritten)
- [Component Catalog](https://www.notion.so/34fd00a63edf811f9d7adf381b6105d0)
- [Shell Variants](https://www.notion.so/34fd00a63edf81b7a9e3f183aa86c8a2) (with playground screenshots)
- [Theme & Tokens](https://www.notion.so/34fd00a63edf81018a64ea9b025483a7)
- [SASS Customization](https://www.notion.so/34fd00a63edf814b86dfce4f4809769b)
- [Density & Defaults](https://www.notion.so/34fd00a63edf81a0a762f81d759b26c5)
- [Build & Publish](https://www.notion.so/34fd00a63edf81a19ddede2551ab3857)
- [Breaking-Change Protocol](https://www.notion.so/34fd00a63edf81bf8147fb53c51eb00d)
- [Version History](https://www.notion.so/34fd00a63edf8132abefe3eda28b9552)

## Repo changes

- `docs/agent_docs/architecture.md` — three-step wiring section, build pipeline corrections, Notion pointer at top
- `docs/agent_docs/component-usage.md` — Notion pointer at top
- `docs/screenshots/` (new) — `admin-variant.png`, `member-variant.png`, `minimal-variant.png`, `tabnav-switcher-open.png`, `tabnav-more-open.png`
- `tests/screenshots.spec.ts` (new) — Playwright spec to regenerate screenshots

## Reproducing the screenshots

```bash
npm run dev                                           # in one terminal
npx playwright test tests/screenshots.spec.ts         # in another
```

Outputs go to `docs/screenshots/`.
