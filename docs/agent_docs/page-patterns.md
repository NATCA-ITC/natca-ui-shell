# Page Patterns — required reading before building any NATCA page

This document is the contract every new or modified page in a NATCA app
must satisfy. The Design Standards page in this repo's playground
(`http://localhost:1310/admin/design-standards`) is the rendered source of
truth — if a pattern below disagrees with that page, the page wins.

**Audience:** Claude Code agents and humans building or modifying any UI
in `mynatca/hub`, `mynatca/bid`, `mynatca/dms`, `mynatca/pay`,
`mynatca/gats`, the email app, or any future MyNATCA Vue 3 application.

> Inspirations: GitHub (page chrome, table affordances) and Supabase
> (sidebar + data-density rhythm). When in doubt, lean denser, not airier
> — these are productivity tools, not marketing sites.

## 1. Page anatomy — the rhythm every page follows

```
┌─────────────────────────────────────────────────────┐
│ NatcaPageHeader                                     │  ← always first, full width
│   Title (left)             Actions (right)          │
│   Subtitle (under title)                            │
├─────────────────────────────────────────────────────┤
│                                                     │
│ <h3 class="section-title">Section name</h3>         │  ← red 3px underline, inline
│ Body text explaining the section…                   │  ← 14px, color-text-body
│                                                     │
│  ┌── content (card / table / form / grid) ──┐     │
│  │                                            │     │
│  └────────────────────────────────────────────┘     │
│                                                     │
│ <h3 class="section-title">Next section</h3>         │
│ Body text…                                          │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### The contract

1. **Every page opens with `<NatcaPageHeader>`.** Title, subtitle, and a
   right-slot for actions. There is exactly one per page, always at the
   top, always full width of the content area.

2. **Sections, not big cards.** Each logical block of the page is its own
   section with a red-underlined title and a 14px body paragraph
   explaining what's in it. The actual content (a card, a table, a form,
   a grid) lives below the body paragraph.

3. **Filters / search / tabs go inside the section's content area** —
   never in the page header. The page header is for actions on the page
   as a whole (Create, Export, Settings), not for filters on a single
   section.

4. **Cards group; they don't introduce.** A `NatcaCard` is what wraps a
   form, table, or list. The section title + body paragraph is what
   introduces a section. Don't wrap an entire section in a
   `NatcaHeaderCard` "for visual separation" — use the section title.

### Section title styling

Every section title uses the same red-underline pattern:

```vue
<h3 class="section-title">Members</h3>
<p class="section-body">
  All bargaining-unit members assigned to this facility, including
  pending and suspended accounts.
</p>
<NatcaCard no-body-padding>
  <!-- table -->
</NatcaCard>
```

```css
.section-title {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 8px;
  padding-bottom: 6px;
  border-bottom: 3px solid var(--natca-red);
  display: inline-block;
}
.section-body {
  font-size: 14px;
  color: var(--color-text-body);
  line-height: 1.55;
  margin: 0 0 14px;
  max-width: 760px;
}
```

These two classes are part of the rhythm — don't reinvent them per app.
If they're not yet hoisted into a shared stylesheet for your app, paste
them as scoped page styles for now and file an issue on `natca-ui-shell`
to promote them to a global helper.

## 2. Buttons — the 16px problem and how to never have it

The single most common UI bug in MyNATCA apps is a button rendering at
16-20px tall. The cause is the same every time: someone wrote `<v-btn
size="x-small">` or `<v-btn density="compact" size="small">`, and under
`natcaDefaults` that collapses to a tiny chip. **The fix is structural:
never use a bare `v-btn` for an app action.**

### Hard rule

- For any user-visible action (Save, Create, Delete, Cancel, Filter,
  View, Open, Export, …) use **`NatcaButton`**, never `v-btn`.
- `NatcaButton` has exactly two sizes: **`sm`** (28px, default — for
  toolbars and table actions) and **`md`** (36px — for card / dialog /
  form footers). There is no smaller size by design.
- If you find yourself writing a `<v-btn>`, stop and replace it with the
  matching NatcaButton variant.

### When you have to render a Vuetify-internal button

`VMenu`, `VPagination`, `VDataTable`, and a few other components render
their own `<v-btn>` instances internally. For those, `natcaDefaults`
sets `VBtn` to `density: 'default'`, `size: 'default'` — they will land
at ~36px. You don't write the button; Vuetify does. Trust the defaults
and don't override them. If a third-party component needs a custom
`VBtn`, set `size="default"` explicitly — never `"small"` or `"x-small"`.

### Cheat sheet

| Need | Component | Size |
|---|---|---|
| Toolbar / table action / filter / page-header right slot | `NatcaButton variant="…"` | `size="sm"` (default) |
| Card footer / dialog footer / form submit row | `NatcaButton variant="…"` | `size="md"` |
| Inline navigation in body text | `NatcaButton variant="link"` | `size="sm"` |
| Vuetify-internal | leave it to Vuetify | — |

### Variant decision

| Variant | Use for |
|---|---|
| `primary` | The single main action of the section (Save, Submit, Confirm) |
| `secondary` | Equally weighted secondary action (Export, Edit, Filter) |
| `danger` | Destructive — Delete, Remove, Revoke. Always confirm. |
| `ghost` | Tertiary or dismissive — Cancel, Close, Skip |
| `link` | Inline navigation — View details, Open report |

## 3. Cards — three components, one decision

Three card components exist and they each have one job. **Don't reach
for `NatcaHeaderCard` by default** — the navy strip is loud and belongs
to a small number of feature callouts.

| Component | Use when… | Don't use when… |
|---|---|---|
| `NatcaCard` (default) | Wrapping a form, list, table, or any sectioned content. This is the workhorse. | — |
| `NatcaCard accent="info\|success\|warning\|danger"` | Single page-level callout / call-to-action with a brand color. One per page max. | As the default style for all cards on the page. |
| `NatcaHeaderCard` | Hero feature card on a member-facing landing page (e.g. "My Email Account" hero on `/email`). Navy strip + icon + title. | Wrapping every section. Wrapping forms. Wrapping data lists. |
| `NatcaStatCard` (in `NatcaStatGrid`) | KPI tiles on a dashboard. | Anywhere actionable — they have no body slot. |

### Dashboard layouts

For a member dashboard with mixed-size tiles (think MyNATCA portal home:
member detail card on the left, four small KPI cards on the right), use
`NatcaCard` and `NatcaStatCard` together inside a CSS Grid. Spans
control which card grows:

```vue
<div class="dashboard-grid">
  <NatcaCard title="Jason T Doss" subtitle="Member 40162 · ZJX"
             style="grid-column: span 2; grid-row: span 2;">
    <!-- detail body -->
    <template #title-actions>
      <NatcaButton variant="link">View profile</NatcaButton>
    </template>
  </NatcaCard>
  <NatcaStatCard label="Membership status" value="Active" change="Since 07/22/2008" />
  <NatcaStatCard label="Career level"      value="CPC"    change="EOD 01/14/2008" />
  <NatcaStatCard label="PAC contributions" value="$•••"   change="+$25 this month" />
  <NatcaStatCard label="Pay grade"         value="KH"     change="Yearly $•••" />
</div>

<style>
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  align-items: stretch;
}
@media (max-width: 900px) { .dashboard-grid { grid-template-columns: repeat(2, 1fr); } }
</style>
```

The `#title-actions` slot is for icon buttons, link buttons, or chips
next to a card's title — useful for "Edit", "View profile", or a status
chip.

### Card title sizing

`NatcaCard` already renders `title` at 17px / 700 weight Barlow with a
14px top padding. Don't override it from the consumer. If you need a
larger title, the section title above the card is the right place.

## 4. Data tables

Tables always sit inside a `NatcaCard no-body-padding` so the card's
rounded corners and outer border give the table its frame.

```vue
<NatcaCard no-body-padding>
  <div class="table-toolbar">
    <NatcaPillNav v-model="filter" :items="…" />
    <VSpacer />
    <VTextField placeholder="Search…" prepend-inner-icon="mdi-magnify"
                hide-details density="compact" style="max-width: 240px;" />
    <NatcaButton variant="primary">New account</NatcaButton>
  </div>
  <VDataTable :headers="…" :items="…" :items-per-page="10">
    <template #item.status="{ item }">
      <VChip :color="statusChipColor(item.status)" variant="tonal">{{ item.status }}</VChip>
    </template>
    <template #item.actions>
      <NatcaButton variant="ghost">View</NatcaButton>
    </template>
  </VDataTable>
</NatcaCard>

<style>
.table-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background: var(--overlay-subtle);
  border-bottom: 1px solid var(--overlay-border);
}
</style>
```

### Rules

- **Wrap with `<NatcaCard no-body-padding>`** — never let a `VDataTable`
  sit raw on the page background.
- **Use a tinted toolbar row** for filters + search + primary action.
  The tint is `var(--overlay-subtle)` with a `1px var(--overlay-border)`
  bottom border. This separates filter chrome from data rows.
- **Search input** must be `hide-details density="compact"` with
  `max-width: 240px`. Do not let it grow to fill the row — `VSpacer`
  pushes it right.
- **Filters** belong to `<NatcaPillNav>` (segmented). For single
  multi-select filters use a `<VSelect>`.
- **Primary actions** (New, Export) sit at the right end of the toolbar,
  after the search input.
- **Pagination + items-per-page** are styled by `vuetify-overrides.css`
  to read at compact density. Pass `:items-per-page="10"` (or 5/25/50)
  and let Vuetify render its footer — don't roll a custom one.
- **Status columns** use `<VChip variant="tonal" color="…">` for the
  semantic colors (`success`, `warning`, `error`, `info`).

## 5. Forms

Forms sit inside a `NatcaCard` with a meaningful title (the title acts
as the form heading — give it real weight; don't ship a card titled "
" with the heading inside the body):

```vue
<NatcaCard title="Create email account"
           subtitle="Members only — must already exist in the public schema">
  <VAutocomplete label="Member" placeholder="Search members…" :items="…" />
  <VTextField label="Email address" placeholder="first.last@natca.net" />
  <div class="d-flex ga-3">
    <VSelect label="Provider" :items="['Mailcow', 'O365']" v-model="provider" style="flex: 1;" />
    <VTextField label="Quota (GB)" type="number" v-model="quota" style="flex: 1;" />
  </div>
  <VCheckbox v-model="welcome" label="Send welcome email" hide-details />
  <VSwitch v-model="forward" label="Enable forwarding" inset hide-details />
  <template #actions>
    <NatcaButton variant="ghost" size="md">Cancel</NatcaButton>
    <NatcaButton variant="primary" size="md">Create account</NatcaButton>
  </template>
</NatcaCard>
```

### Rules

- Form fields are always raw Vuetify (`VTextField`, `VSelect`,
  `VAutocomplete`, `VTextarea`, `VCheckbox`, `VSwitch`, `VRadio`).
  `natcaDefaults` already styles them outlined / compact / primary
  focus.
- Submit / cancel buttons go in `#actions` at `size="md"` — primary
  rightmost, ghost (Cancel) before it.
- For grouped fields use a flex row with `ga-3` (12px gap) and `flex: 1`
  on each field.
- **Never wrap form fields in `<v-form>` for layout.** Use it only when
  you need its built-in validation submit handler.

## 6. Pills (`NatcaPillNav`)

Segmented filter / view-toggle. Active pill is **solid navy in light,
solid red in dark**, white text.

```vue
<NatcaPillNav
  v-model="filterStatus"
  :items="[
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' },
    { value: 'disabled', label: 'Disabled' },
  ]"
/>
```

### When to use

- **Pills** — binary or 3-5 way toggle. Quick filter, time range, view
  switcher. No icons.
- **Tabs** (`NatcaTabs`) — when you have ≥5 options, need icons or
  badges, or the toggle scopes the entire screen rather than filtering a
  list.
- Don't combine — never put pills inside a tab panel for the same axis.

## 7. Tabs (`NatcaTabs`)

Two layouts:

| Layout | Use when… |
|---|---|
| **Standalone** — tabs sit on the page background | The tabs scope the entire screen (e.g. a member-detail page with Overview / Roster / Documents / Audit log). |
| **Inside a `NatcaCard no-body-padding`** | The tabs scope a sub-section of the page; the card border separates it from neighboring content. |

Active tab gets primary accent color (navy in light, red in dark) and a
2px slider. Icons are optional — drop them when labels alone are clear.

```vue
<!-- Standalone -->
<NatcaTabs v-model="tab" :items="items">
  <template #panel-overview>…</template>
  <template #panel-roster>…</template>
</NatcaTabs>

<!-- Inside a card -->
<NatcaCard no-body-padding>
  <NatcaTabs v-model="tab" :items="items">
    <template #panel-details>…</template>
  </NatcaTabs>
</NatcaCard>
```

## 8. Chips (`VChip`)

Always `variant="tonal"`. Colors: `success`, `warning`, `error`, `info`,
default (no `color` prop = neutral pill).

```vue
<VChip color="success" variant="tonal">Active</VChip>
<VChip variant="tonal">Archived</VChip>
```

`vuetify-overrides.css` raises the tonal background opacity in dark mode
and lifts the default-chip text color so neutral chips stay readable.
Don't set custom backgrounds; just pick the right `color`.

## 9. Alerts (`NatcaAlert`)

```vue
<NatcaAlert type="info"><div><strong>Info:</strong> …</div></NatcaAlert>
<NatcaAlert type="success">…</NatcaAlert>
<NatcaAlert type="warning">…</NatcaAlert>
<NatcaAlert type="danger">…</NatcaAlert>
```

No icons by design (Vuetify's `VAlert` forces them; we don't want that).
Use for transient or contextual messages within page content. For a
page-level callout that needs an action button, reach for
`NatcaCard accent="…"` instead.

## 10. Dialogs (`NatcaDialog`)

```vue
<NatcaDialog v-model="show" title="Confirm migration"
             subtitle="Batch #12 · 34 accounts"
             icon="mdi-swap-horizontal-circle">
  Are you sure you want to migrate 34 accounts?
  <template #actions>
    <NatcaButton variant="ghost"   size="md" @click="show = false">Cancel</NatcaButton>
    <NatcaButton variant="primary" size="md" @click="confirm">Migrate now</NatcaButton>
  </template>
</NatcaDialog>
```

For destructive confirmation use `variant="danger"` on the dialog (red
header) and `variant="danger"` on the confirm button.

## 11. Annotations (`NatcaAnnotation`)

Inline guidance callouts within a page or document. Three variants:
`info` (default), `tip`, `warning`. Use sparingly — for a one-off
page-level callout that needs an action button, reach for
`NatcaCard accent="…"` instead.

## 12. Empty / loading / error states

Each is a card-shaped container so the page layout stays predictable:

- **Loading** — `<NatcaCard>` with `<VProgressLinear color="primary">`
  and a short status line.
- **Empty** — `<NatcaCard no-body-padding>` wrapping
  `<NatcaEmptyState icon title description action-label />`.
- **Error** — `<NatcaAlert type="danger">` with a `<NatcaButton
  variant="danger">Retry</NatcaButton>` on the right side of the alert
  body.

Don't render a bare spinner or a centered "No data" string — always wrap
in the matching component.

## 13. Color, spacing, and typography

Hard rules — you should never see hardcoded values in a NATCA app:

- **Colors:** `var(--natca-red)`, `var(--natca-navy)`,
  `var(--color-text-primary)`, `var(--color-bg-surface)`, etc. For
  Vuetify components, prefer the `color` prop (`color="primary"`,
  `color="error"`).
- **Spacing:** Vuetify utility classes (`pa-4`, `ga-3`, `mt-2`) or
  `var(--space-2)` through `var(--space-16)`.
- **Type:** `var(--font-display)` for headings, `var(--font-body)` for
  text. Sizes: `var(--text-xs)` (12px) through `var(--text-3xl)` (38px).

For programmatic use (charts, canvas, dynamic styles) import
`natcaColors` from `@natca-itc/ui-shell`.

## 14. Validating in Chrome — required for every UI change

Every UI change must be validated visually in Chrome before being
committed. The agent should follow this loop:

1. **Open both themes.** Start the playground at `http://localhost:1310`,
   navigate to the screen you're editing, and use the topbar sun/moon
   button to toggle themes. Both must look correct.
2. **Compare to the Design Standards page.** Open
   `/admin/design-standards` in a second tab and confirm your
   page matches the rhythm, spacing, and visual language defined there.
   If a component on your page doesn't match, fix the page (not the
   standards page).
3. **Take screenshots via the chrome-devtools MCP.** For non-trivial
   pages capture the major sections in both themes:
   ```
   mcp__chrome-devtools__new_page → http://localhost:1310/your/page
   mcp__chrome-devtools__resize_page → 1440 × 900
   mcp__chrome-devtools__take_screenshot → save somewhere under TEMP/
   ```
   Save under your project's `TEMP/` directory (gitignored).
4. **Specifically check:** button heights (must be ≥ 28px / never 16-20px),
   chips readable in dark, table toolbar is tinted, pills active state is
   navy/red (not white), tabs use the underline accent, no `!important`
   leaked into your scoped styles.
5. **Console check.** Run `mcp__chrome-devtools__list_console_messages
   types=["error","warn"]` and resolve anything unexpected before
   committing.

If chrome-devtools MCP isn't available in the environment, capture
screenshots manually and attach them to the PR. Never claim "looks
correct" without visual confirmation — type-check passing is not visual
correctness.

## 15. Anti-patterns — refuse to ship these

- ❌ Wrapping every section in a `NatcaHeaderCard` "for visual
  separation" — use the section title.
- ❌ Bare `<v-btn>` for app actions — always `NatcaButton`.
- ❌ `<v-btn size="small">` or `<v-btn density="compact" size="small">`
  — both produce ~16-20px chips. There is no design-system size below
  `NatcaButton size="sm"` (28px).
- ❌ Filters / search / tabs in the page header row — they belong in a
  section toolbar inside a card.
- ❌ Hardcoded hex (`#CE0E2D`), font name, or pixel spacing — always a
  CSS custom property or a Vuetify utility class.
- ❌ `!important` in app code. If a shell style needs overriding the
  fix lives in `@natca-itc/ui-shell`, not in your app's CSS.
- ❌ `optimizeDeps.include: ['vuetify/components/…']` in `vite.config.ts`
  — pre-bundling Vuetify components routes them through esbuild and
  silently drops every SASS override. Let Vite compile on demand.
- ❌ Custom theme switching logic — use `useNatcaTheme()` and
  `<NatcaThemeToggle />`.
- ❌ Custom topbar / sidebar / app switcher — use `<NatcaShell>` and its
  sub-components.

## 16. Quick reference — copy-paste page skeleton

```vue
<script setup lang="ts">
import {
  NatcaPageHeader, NatcaCard, NatcaButton, NatcaPillNav,
} from '@natca-itc/ui-shell'
</script>

<template>
  <div class="page">
    <NatcaPageHeader title="Members" subtitle="1,247 members across all facilities">
      <template #actions>
        <NatcaButton variant="ghost">Export</NatcaButton>
        <NatcaButton variant="primary">Add member</NatcaButton>
      </template>
    </NatcaPageHeader>

    <section class="page-section">
      <h3 class="section-title">All members</h3>
      <p class="section-body">Active and pending bargaining-unit members.</p>
      <NatcaCard no-body-padding>
        <!-- toolbar + table here -->
      </NatcaCard>
    </section>

    <section class="page-section">
      <h3 class="section-title">Recent activity</h3>
      <p class="section-body">The last 50 changes across the directory.</p>
      <NatcaCard no-body-padding>
        <!-- list -->
      </NatcaCard>
    </section>
  </div>
</template>

<style scoped>
.page         { padding: 0 24px 48px; max-width: 1080px; }
.page-section { padding: 24px 0; }
.section-title {
  font-family: var(--font-display);
  font-size: 20px; font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 8px;
  padding-bottom: 6px;
  border-bottom: 3px solid var(--natca-red);
  display: inline-block;
}
.section-body {
  font-size: 14px;
  color: var(--color-text-body);
  line-height: 1.55;
  margin: 0 0 14px;
  max-width: 760px;
}
</style>
```
