# Block Layout — Implementation Spec

**ADR:** BID ADR-048 (`bid/docs/architecture/decisions/048-facility-pages-are-composed-of-blocks.md`)
**Status:** Implemented on `nat-1241` — the file tables below record what shipped
**Version:** 0.4.0-beta.25 (additive — no breaking-change protocol required)

A page-composition engine: authors build a page from blocks arranged in preset
column layouts. ui-shell owns the engine, the registry contract, the
schema-driven config panel and the generic content blocks. It knows nothing
about any app's data — same contract as `NatcaDocumentViewer` ("URL + metadata
in, events out; zero DMS knowledge").

First consumer is BID's facility home page. MyNATCA v2 is the second.

---

## New files

| File | Purpose |
|------|---------|
| `src/components/blocks/NatcaBlockCanvas.vue` | Read-only renderer — document + registry in, page out |
| `src/components/blocks/NatcaBlockEditor.vue` | Authoring surface — sections, layout picker, inserter, block chrome |
| `src/components/blocks/internal/BlockRenderer.vue` | Renders one instance; the only place that runs `resolve()` |
| `src/components/blocks/internal/BlockInserter.vue` | "Add block" menu, built from the registry |
| `src/components/blocks/internal/BlockConfigPanel.vue` | Config form generated from a block's `propsSchema` |
| `src/components/blocks/internal/LayoutPicker.vue` | The five section presets as a visual picker |
| `src/components/blocks/internal/UnknownBlock.vue` | Placeholder for a type the registry does not have |
| `src/components/blocks/internal/fields/BlockField.vue` | Dispatches one `propsSchema` entry to an input |
| `src/components/blocks/internal/fields/TableField.vue` | Editable grid behind the `table` field type |
| `src/components/blocks/internal/fields/ListField.vue` | Repeating group behind the `list` field type |
| `src/components/blocks/internal/fields/RichTextField.vue` | TipTap surface — the only file that touches TipTap |
| `src/blocks/NatcaRichTextBlock.vue` | Renders stored HTML (host sanitizes on write) |
| `src/blocks/NatcaTableBlock.vue` | Table with a mobile stack mode |
| `src/blocks/NatcaHeadingBlock.vue` | Section heading |
| `src/blocks/NatcaCalloutBlock.vue` | Wraps `NatcaAlert` |
| `src/blocks/NatcaLinkListBlock.vue` | Repeatable label + URL rows |
| `src/blocks/NatcaDividerBlock.vue` | Rule / spacer |
| `src/blocks/index.ts` | The six definitions + `natcaContentBlocks` |
| `src/composables/useBlockRegistry.ts` | `createBlockRegistry`, `defineBlock`, provide/inject |
| `src/lib/blockDocument.ts` | `validateBlockDocument` + document construction helpers |
| `src/types/blocks.ts` | All block types |
| `playground/pages/BlocksPage.vue` | Dev harness: in-memory document, fake data block, unknown type |
| `playground/pages/blocks/FakeRosterBlock.vue` | Stand-in host-app data block |

**Deviations from the plan, and why.**

- *No `BlockSection.vue` / `BlockColumn.vue`.* Sections and columns are a grid
  class and a `v-for`. The canvas needs eight lines for both; the editor needs
  the section chrome inline anyway, since every control mutates the document it
  already owns. Two components that only drill props are two more places to look.
- *Blocks are `.vue` files with their definitions in `index.ts`,* not a
  `.ts` + `.vue` pair each. Twelve files for six blocks bought nothing.
- *Rich text is edited in the config panel's `richText` field, not in the block.*
  The block component is a pure renderer, which is why the read-only canvas
  never loads TipTap at all — better than the plan, which had it in the block.
- *Only `@tiptap/core` and `@tiptap/starter-kit`.* StarterKit v3 already bundles
  Underline and Link; registering Underline separately raises a duplicate-name
  warning. One fewer optional peer.
- *Added `shiftBlock`* — move a block sideways between columns. Without
  drag-and-drop there was otherwise no way to get a block out of the column it
  was created in, which authors hit immediately.

## Modified files

| File | Change |
|------|--------|
| `src/index.ts` | Export the two components, registry helpers, `natcaContentBlocks`, validator, types |
| `src/types/index.ts` | Re-export `./blocks` |
| `src/styles/shell.css` | `--natca-content-stack-width: 900px` + section/column grid rules |
| `playground/router.ts` | Route `/admin/blocks` |
| `playground/App.vue` | Sidebar + tab entry for the harness |
| `package.json` | `@tiptap/*` as **peerDependenciesMeta.optional**, not a hard dep |
| `vite.config.ts` | `/^@tiptap\//` external, so the dynamic import stays unresolved at build |
| `src/components/NatcaIconButton.vue` | Fixes an unrelated pre-existing bug — see below |
| `docs/agent_docs/page-patterns.md` | New §13b — block layouts, when to use vs. a hand-built page |
| `docs/agent_docs/component-usage.md` | Registering an app block; the data-bound pattern |

---

## Types

```ts
// ── Document ──────────────────────────────────────────────────────────────
export type NatcaSectionLayout = 'one' | '50-50' | '67-33' | '33-67' | 'thirds'

export interface NatcaBlockDocument {
  schema_version: 1
  sections: NatcaBlockSection[]
}

export interface NatcaBlockSection {
  id: string
  layout: NatcaSectionLayout
  /** Length must equal the layout's column count. */
  columns: NatcaBlockColumn[]
}

export interface NatcaBlockColumn {
  id: string
  blocks: NatcaBlockInstance[]
}

export interface NatcaBlockInstance {
  id: string
  /** Registry key. An unregistered type renders UnknownBlock, never throws. */
  type: string
  props: Record<string, unknown>
}

// ── Registration ──────────────────────────────────────────────────────────
export interface NatcaBlockDefinition<P = Record<string, unknown>> {
  type: string
  label: string
  icon: string                  // mdi-*
  description?: string
  /** Rendered with { props, context, editing }. */
  component: Component
  /** Drives the generated config form. Empty = no configuration. */
  propsSchema: NatcaBlockField[]
  defaults?: () => P
  /**
   * Data-bound blocks only. Resolved at render time by the host app — this is
   * where an events feed or a DMS document reference becomes real data.
   * Absent = author-content block.
   */
  resolve?: (props: P, context: NatcaBlockContext) => Promise<unknown>
  /**
   * Prop keys whose values carry HTML. Apps MUST sanitise these server-side on
   * write; the list is the contract that tells them which ones.
   */
  htmlProps?: string[]
}

export type NatcaBlockField =
  | { key: string; label: string; type: 'text' | 'textarea' | 'richText' | 'url' | 'number' | 'boolean'; required?: boolean; help?: string }
  | { key: string; label: string; type: 'select'; options: { value: string; label: string }[]; required?: boolean }
  | { key: string; label: string; type: 'table' }
  | { key: string; label: string; type: 'list'; item: NatcaBlockField[] }

/** Opaque app-supplied context handed to every block and every resolve(). */
export interface NatcaBlockContext {
  [key: string]: unknown
}

export interface NatcaBlockRegistry {
  get(type: string): NatcaBlockDefinition | undefined
  list(): NatcaBlockDefinition[]
  has(type: string): boolean
}
```

---

## API

```ts
import {
  NatcaBlockCanvas, NatcaBlockEditor,
  createBlockRegistry, defineBlock, natcaContentBlocks,
  validateBlockDocument,
} from '@natca-itc/ui-shell'

// An app registers the shipped content blocks plus its own data-bound ones.
const registry = createBlockRegistry([
  ...natcaContentBlocks,
  defineBlock({
    type: 'upcomingEvents',
    label: 'Upcoming events',
    icon: 'mdi-calendar',
    component: UpcomingEventsBlock,
    propsSchema: [
      { key: 'limit', label: 'How many to show', type: 'number' },
    ],
    resolve: (props, ctx) => api.getEvents(ctx.facilityCode, props.limit),
  }),
])
```

```vue
<!-- Read -->
<NatcaBlockCanvas :document="doc" :registry="registry" :context="{ facilityCode }" />

<!-- Edit -->
<NatcaBlockEditor v-model:document="doc" :registry="registry" :saving="saving" @save="persist" />
```

`validateBlockDocument(doc, registry)` returns `{ ok, errors[] }` — structural
only: known layout ids, column count matching the layout, known block types,
props matching `propsSchema`. It does **not** sanitise HTML.

---

## Layout presets and mobile

| Preset | Desktop columns | Grid template |
|---|---|---|
| `one` | 1 | `1fr` |
| `50-50` | 2 | `1fr 1fr` |
| `67-33` | 2 | `2fr 1fr` |
| `33-67` | 2 | `1fr 2fr` |
| `thirds` | 3 | `1fr 1fr 1fr` |

**Every preset collapses to a single column at `≤ 900px`**, stacking in author
order. Columns are reordered by moving them in the editor — there are no
per-column mobile-order flags in phase 1, and the editor carries a phone-width
preview toggle so the author sees the stack they are creating.

Three columns is the cap. On a phone every layout is one column, so a fourth
buys a worse desktop layout and nothing else.

**Breakpoint note:** `NatcaStatGrid` collapses at 768px and the dashboard-grid
pattern in `page-patterns.md` documents 900px. Content layouts standardise on
**900px** (`--natca-content-stack-width`) — three columns of prose at 850px is
unreadable. `NatcaStatGrid` is deliberately left at 768px; changing it would be
a visual break for every current consumer, and KPI tiles tolerate narrower
columns than prose does.

---

## Block notes

- **richText** — the TipTap setup lifts out of BID's `RichTextEditor.vue`
  (StarterKit + Underline + the link dialog, which is worth keeping as-is).
  TipTap is an **optional peer dependency, lazy-imported inside the block**,
  exactly as `NatcaDocumentViewer` treats `pdfjs-dist`. An app that registers no
  rich-text block pays nothing. `htmlProps: ['html']`.
- **table** — `overflow-x: auto` always, plus a `stackOnMobile` prop that renders
  each row as a label/value card below the breakpoint. Tables are the one block
  that cannot reflow, so this ships with it rather than after it.
- **callout** — wraps `NatcaAlert`. Note the two live constraints: `NatcaAlert`
  takes `type` (not `variant`), and its body is a flex row, so the block must
  pass **one** child element — loose text next to a `<strong>` renders as
  columns.
- **linkList** — `type: 'list'` field of `{ label, url }`. Screens URLs against
  the same scheme allow-list the rich-text link dialog uses.
- **UnknownBlock** — renders a quiet bordered placeholder naming the missing
  type. Never throws. This is what lets MN ship a block BID has not registered
  without white-screening a shared document.

---

## Cross-language seam (read this before changing the contract)

`validateBlockDocument` is TypeScript. BID's backend is PHP and re-implements
the same structural rules plus HTML sanitisation of `htmlProps`. **They cannot
share code**, so this spec is the source of truth for both, and a change to the
document shape or a block's `propsSchema` is a change in two repositories.

The same applies to the rich-text allow-list: BID's `App\Support\HtmlSanitizer`
and the TipTap schema must agree, or an admin saves markup and gets it silently
unwrapped. Widening one without the other is the failure this whole design
exists to stop — do not do it in a hurry.

---

## Non-goals for this version

Drag-and-drop reordering (blocks move with up/down controls), image blocks (no
upload path exists yet), revision history, per-block permissions, nested
sections, and data-bound blocks beyond the playground's fake one — those are
registered by apps, and BID's first real ones land with NAT-1239.


---

## Incidental fix: `NatcaIconButton` had no accessible name

Found while validating this work, and fixed here because the editor adds ~20
icon buttons that would otherwise all be nameless.

`NatcaIconButton` declared its prop as `'aria-label'` and read it back with
`$props['aria-label']`. Vue camelizes incoming attribute names when matching
props, so the value written as `aria-label="Close"` was stored under `ariaLabel`
and the template's lookup returned `undefined` — **every icon button in every
NATCA app rendered with no `aria-label` and no `title`**, silently, since the
component was written.

The fix declares both keys and reads whichever is populated, so the public type
contract (`aria-label`) is unchanged and no call site in any app needs editing.
Verified in the browser: buttons now carry both the accessible name and the
tooltip. This deserves its own ticket for the record — it is not a block-engine
change and it improves every existing page.
