# UI Shell Component Usage Guide

Complete pattern catalog for building pages in NATCA apps. **READ THIS before writing any UI code.**

Every pattern on this page has a matching live demo in the playground at `/admin/design-standards`.

## Setup (every app — mandatory)

### 1. Vuetify Plugin

```ts
// plugins/vuetify.ts
import { createVuetify } from 'vuetify'
import { natcaVuetifyTheme, natcaDefaults } from '@natca-itc/ui-shell'
import '@natca-itc/ui-shell/tokens'
import '@mdi/font/css/materialdesignicons.css'

export default createVuetify({
  theme: natcaVuetifyTheme,
  defaults: natcaDefaults,   // <-- MANDATORY — controls density, variant, sizing globally
})
```

### 2. Theme Initialization

```ts
// main.ts
import { useNatcaTheme } from '@natca-itc/ui-shell'
const { setTheme } = useNatcaTheme()
setTheme(localStorage.getItem('natca-theme') ?? 'dark')
```

### 3. Shell Layout

```vue
<!-- layouts/default.vue -->
<NatcaShell
  :app-id="'hub'"
  :app-name="'Hub'"
  :tabs="tabs"
  :user="user"
  :facility="'ZJX'"
  @theme-change="pref => localStorage.setItem('natca-theme', pref)"
  @profile-action="handleProfileAction"
>
  <router-view />
</NatcaShell>
```

The shell includes a sun/moon theme toggle in the topbar by default. To disable: `:show-theme-toggle="false"`.

### 4. Fonts (automatic)

Barlow and Public Sans are **auto-loaded** by the package — no manual `<link>` tags needed. Any app that imports from `@natca-itc/ui-shell` gets the fonts via a CSS `@import` in the bundled styles.

For faster initial load, apps can optionally add a preconnect hint to `index.html`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
```

---

## What natcaDefaults Handles (DO NOT set these props manually)

| Component | Auto-set Props |
|-----------|---------------|
| `VBtn` | `variant: 'flat'`, `rounded: 'md'`, `density: 'compact'`, `size: 'small'` |
| `VCard` | `rounded: 'lg'`, `elevation: 0`, `border: true`, `density: 'compact'` |
| `VTextField` | `variant: 'outlined'`, `density: 'compact'`, `color: 'primary'` |
| `VSelect` | `variant: 'outlined'`, `density: 'compact'`, `color: 'primary'` |
| `VAutocomplete` | `variant: 'outlined'`, `density: 'compact'`, `color: 'primary'` |
| `VTextarea` | `variant: 'outlined'`, `density: 'compact'`, `color: 'primary'` |
| `VCheckbox` | `density: 'compact'`, `color: 'primary'`, `hideDetails: 'auto'` |
| `VSwitch` | `density: 'compact'`, `color: 'primary'`, `hideDetails: 'auto'`, `inset: true` |
| `VAlert` | `variant: 'tonal'`, `density: 'compact'`, `rounded: 'md'`, `border: 'start'` |
| `VChip` | `rounded: 'pill'`, `size: 'small'`, `density: 'compact'` |
| `VDataTable` | `hover: true`, `density: 'compact'` |
| `VDialog` | `maxWidth: 600`, inner `VCard`: `rounded: 'lg'`, `elevation: 8`, `border: false` |
| `VProgressLinear` | `color: 'primary'`, `rounded: true`, `height: 4` |
| `VTabs` | `color: 'primary'`, `height: 36`, `density: 'compact'` |

**Inside `v-card-actions`**, buttons auto-scale to `size: 'default'`, `density: 'default'` (NAT-281).

---

## What You MUST Still Set

### Button Variants

natcaDefaults only handles the PRIMARY button automatically. For all other button intents, you MUST set `variant` and/or `color`:

| Intent | Code | Notes |
|--------|------|-------|
| **Primary** (save, submit) | `<v-btn color="primary">Save</v-btn>` | Default flat variant works |
| **Secondary** (export, edit) | `<v-btn variant="outlined">Export</v-btn>` | Must set outlined |
| **Danger** (delete, remove) | `<v-btn variant="outlined" color="error">Delete</v-btn>` | Outlined to distinguish from primary |
| **Ghost** (cancel, dismiss) | `<v-btn variant="text">Cancel</v-btn>` | Must set text |
| **Link** (view details) | `<v-btn variant="text" color="info">View Details</v-btn>` | Must set text + color |

### Semantic Colors

Always use the `color` prop for semantic meaning:

| Intent | Prop | Light theme | Dark theme |
|--------|------|------------|------------|
| Primary action | `color="primary"` | Navy #003366 | Red #CE0E2D |
| Secondary / brand | `color="secondary"` | Red #CE0E2D | Navy #003366 |
| Accent / highlight | `color="accent"` | Sky #6AC9FF | Sky #6AC9FF |
| Success | `color="success"` | #2E7D32 | #66BB6A |
| Warning | `color="warning"` | #A65D00 | #FFA726 |
| Error / danger | `color="error"` | #CE0E2D | #EF5350 |
| Info | `color="info"` | #003366 | #5BA3D9 |

---

## NEVER Do These Things

### NEVER hardcode colors
```vue
<!-- WRONG --> <div style="color: #CE0E2D">
<!-- RIGHT --> <v-chip color="error">
<!-- RIGHT --> <div style="color: var(--color-danger);">
```

### NEVER hardcode spacing
```vue
<!-- WRONG --> <div style="padding: 16px; gap: 12px;">
<!-- RIGHT --> <div class="pa-4 ga-3">
```
Vuetify spacing: 1=4px, 2=8px, 3=12px, 4=16px, 5=20px, 6=24px, 8=32px.

### NEVER hardcode fonts
```vue
<!-- WRONG --> <h2 style="font-family: 'Barlow'">
<!-- RIGHT --> <h2 style="font-family: var(--font-display);">
```

### NEVER use !important
If you need `!important`, the fix belongs in ui-shell, not your app.

### NEVER set props that natcaDefaults handles
```vue
<!-- WRONG: redundant --> <v-text-field variant="outlined" density="compact" color="primary" />
<!-- RIGHT: natcaDefaults does it --> <v-text-field label="Email" />
```

---

## Component Pattern Catalog

### Page Header

```vue
<NatcaPageHeader title="Member Accounts" subtitle="1,247 accounts across all facilities">
  <template #actions>
    <v-btn color="primary">Create Account</v-btn>
  </template>
</NatcaPageHeader>
```

### Header Card (navy header + icon)

```vue
<NatcaHeaderCard icon="mdi-account" title="My Email Account" subtitle="jason.doss@natca.net · ZJX">
  <div>Card body content — data fields, progress bars, etc.</div>
  <template #actions>
    <v-btn variant="text">Settings</v-btn>
    <v-btn color="primary">Manage Account</v-btn>
  </template>
</NatcaHeaderCard>
```

Props: `icon` (MDI icon name), `title`, `subtitle`. Slots: `default` (body), `actions`, `header-right`.

### Stat Cards

```vue
<NatcaStatGrid :cols="4">
  <NatcaStatCard label="Total Members" value="19,847" change="+127 this month" />
  <NatcaStatCard label="Active Facilities" value="312" />
  <NatcaStatCard label="Open Grievances" value="84" change="+12 pending" change-color="warning" />
  <NatcaStatCard label="Sync Status" value="OK" change="Last run 4m ago" change-color="info" />
</NatcaStatGrid>
```

`NatcaStatGrid` props: `cols` (2, 3, or 4). `NatcaStatCard` props: `label`, `value`, `change?`, `changeColor?` ('success' | 'warning' | 'error' | 'info').

### Card with Actions

```vue
<v-card>
  <v-card-title>Email Account</v-card-title>
  <v-card-subtitle>jason@natca.net · Active</v-card-subtitle>
  <v-card-text>
    <!-- content -->
  </v-card-text>
  <v-card-actions>
    <v-spacer />
    <v-btn variant="text">Cancel</v-btn>
    <v-btn color="primary">Save Changes</v-btn>
  </v-card-actions>
</v-card>
```

### Data Table

```vue
<v-data-table :headers="headers" :items="items">
  <template #item.status="{ item }">
    <v-chip :color="item.status === 'active' ? 'success' : 'warning'">
      {{ item.status }}
    </v-chip>
  </template>
  <template #item.actions="{ item }">
    <v-btn variant="text" size="small">View</v-btn>
  </template>
</v-data-table>
```

### Pill Nav / Filter Toggle

```vue
<v-btn-toggle v-model="filter" mandatory>
  <v-btn value="all">All</v-btn>
  <v-btn value="active">Active</v-btn>
  <v-btn value="pending">Pending</v-btn>
</v-btn-toggle>
```

natcaDefaults configures VBtnToggle with pill shape, compact density, divided layout.

### Form in Card

```vue
<v-card>
  <v-card-title>Create Account</v-card-title>
  <v-card-text>
    <v-autocomplete label="Member" :items="members" />
    <v-text-field label="Email" />
    <v-select label="Provider" :items="['Mailcow', 'O365']" />
    <v-checkbox label="Send welcome email" />
    <v-switch label="Enable forwarding" />
  </v-card-text>
  <v-card-actions>
    <v-spacer />
    <v-btn variant="text">Cancel</v-btn>
    <v-btn color="primary">Create</v-btn>
  </v-card-actions>
</v-card>
```

### Dialog

```vue
<v-dialog v-model="showDialog">
  <v-card>
    <v-card-title>Confirm Migration</v-card-title>
    <v-card-text>Are you sure you want to migrate 34 accounts?</v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn variant="text" @click="showDialog = false">Cancel</v-btn>
      <v-btn color="primary" @click="migrate">Migrate Now</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
```

For danger dialogs, use `<v-btn variant="outlined" color="error">Delete Account</v-btn>` as the confirm button.

### Alerts

```vue
<v-alert type="info">Migration scheduled for tonight.</v-alert>
<v-alert type="success">47 accounts migrated.</v-alert>
<v-alert type="warning">3 accounts over quota.</v-alert>
<v-alert type="error">API connection failed.</v-alert>
```

### Status Chips

```vue
<v-chip color="success">Active</v-chip>
<v-chip color="warning">Pending</v-chip>
<v-chip color="error">Disabled</v-chip>
<v-chip color="info">Migrating</v-chip>
<v-chip>Archived</v-chip>
```

### Empty State

```vue
<NatcaEmptyState
  icon="mdi-file-document-outline"
  title="No accounts found"
  description="Try adjusting your filters."
  action-label="Reset Filters"
  @action="resetFilters"
/>
```

Wrap in a `<v-card>` if you want a bordered container.

### Loading State

```vue
<v-progress-linear :model-value="progress" />
<span style="font-size: 11px; color: var(--color-text-faint);">
  Migrating... {{ completed }} of {{ total }}
</span>
```

### Error State (Inline)

```vue
<v-alert type="error">
  <div class="d-flex align-center ga-3" style="width: 100%;">
    <div style="flex: 1;">
      <strong>Failed to load accounts</strong>
      <div style="font-size: 11px; color: var(--color-text-muted);">API returned an error.</div>
    </div>
    <v-btn variant="outlined" color="error" size="small">Retry</v-btn>
  </div>
</v-alert>
```

### Annotation / Info Callout

```vue
<NatcaAnnotation>
  <strong>How it works:</strong> natcaDefaults handles density and variant.
</NatcaAnnotation>

<NatcaAnnotation type="tip">
  <strong>Tip:</strong> Use the tip variant for positive guidance.
</NatcaAnnotation>

<NatcaAnnotation type="warning">
  <strong>Warning:</strong> This change affects all consuming apps.
</NatcaAnnotation>
```

### Login / Unauthenticated Page

```vue
<div class="d-flex align-center justify-center" style="min-height: 100vh; background: rgb(var(--v-theme-background));">
  <v-card max-width="440" class="pa-6">
    <v-card-title>Sign In</v-card-title>
    <v-card-text><!-- Auth0 button or form --></v-card-text>
  </v-card>
</div>
```

---

## Quick Reference: "I want X → use Y"

| I want... | Use |
|-----------|-----|
| Page title + subtitle + action button | `<NatcaPageHeader>` |
| Card with navy header and icon | `<NatcaHeaderCard>` |
| Grid of KPI/metric numbers | `<NatcaStatGrid>` + `<NatcaStatCard>` |
| "No results" placeholder | `<NatcaEmptyState>` |
| Info/tip/warning callout box | `<NatcaAnnotation>` |
| Underline tabs (router or local) | `<NatcaTabs>` |
| Pill toggle filters | `<NatcaTabs variant="pills">` or `<v-btn-toggle>` |
| Member display card | `<NatcaMemberCard>` |
| Status indicator | `<v-chip color="success/warning/error/info">` |
| Feedback message | `<v-alert type="info/success/warning/error">` |
| Confirmation modal | `<v-dialog>` with `<v-card>` |
| Data table with filters | `<v-btn-toggle>` + `<v-data-table>` |
| Form | `<v-text-field>`, `<v-select>`, etc. (no extra props needed) |
| Light/dark toggle | Built into topbar via `NatcaShell` (automatic) |

---

## Design Reference

- **Live playground:** `npm run dev` → http://localhost:1310/admin/design-standards
- **Static reference:** Open `natca-design-system.html` (toggle Public/Authenticated + Light/Dark)
- **Tokens:** `src/css/natca-tokens.css`
- **Vuetify defaults:** `src/theme/index.ts`
