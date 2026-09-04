# ADR-003: Admin-Composed Pages Use a Shared Block Layout Engine

## Status
Accepted

## Date
2026-09-04

## Notion Page
https://app.notion.com/p/3d1d00a63edf81c199d1fca5304de6af

## Context
Several NATCA apps need pages that an administrator composes rather than a developer lays out: BID's facility home page today, MyNATCA v2 landing pages next, and any "announcements plus a data feed" surface after that. BID's current approach is a single admin-authored HTML string edited with TipTap and sanitised on write. Every formatting request costs a TipTap extension **plus** a sanitiser widening, the sanitiser silently unwraps anything it does not know (an admin saves a table and gets loose text back with no error), and a single string has nowhere to put live data such as an events feed.

Left alone, each app would grow its own page builder with its own document shape, its own editor, and its own sanitisation rules. BID ADR-048 chose blocks over a richer HTML blob for BID; this ADR records why the engine lives in ui-shell and what contract it imposes on every consumer.

Constraints that shaped it:
1. **ui-shell knows nothing about any app's data.** Same contract as `NatcaDocumentViewer`: the host app supplies data and decides persistence; ui-shell supplies layout, editing and rendering.
2. **Documents are shared across apps.** MyNATCA may store a block that BID has not registered; that must degrade, never crash.
3. **"Keep the package lightweight" is not negotiable.** A rich-text editor must not be paid for by apps that never open one.
4. **Authenticated pages are compact and dark-first.** The editor is a productivity tool, not a marketing site.

## Decision

### 1. One engine, published from `@natca-itc/ui-shell`
`NatcaBlockCanvas` renders a document read-only; `NatcaBlockEditor` authors one. Both take a registry built with `createBlockRegistry([...natcaContentBlocks, ...appBlocks])`. Apps never build a bespoke page builder; they register blocks with this one.

### 2. One block contract for content and data
A block is `{ type, label, icon, component, propsSchema, defaults?, resolve?, htmlProps? }`. A block without `resolve()` is filled from the config form; a block with one fetches at render time through the host's `resolve(props, { scope, signal })`. Same inserter, same config panel, same document. There is no second system for data-bound blocks.

### 3. Config forms are generated, never hand-written
The config panel is produced from `propsSchema` (`text`, `textarea`, `richText`, `url`, `number`, `boolean`, `select`, `table`, `list`). A missing field type is added to the engine, not worked around in an app.

### 4. Layout is preset rows, two levels deep
`sections → columns → blocks`. Five presets (`one`, `50-50`, `67-33`, `33-67`, `thirds`), all collapsing to one column at `--natca-content-stack-width` (900px) in author order. No nesting, no drag-resize, no free-form grid. Three columns is the cap because every layout is one column on a phone.

### 5. Unknown block types render a placeholder
An unregistered `type` renders a quiet bordered notice naming the type. It never throws. This is what lets one app ship a block another has not registered.

### 6. Security boundaries are explicit and live in two places
- **The renderer binds only `propsSchema` keys** (plus `resolved`). A stored document is author input; an undeclared key such as `innerHTML` never reaches the component, so it cannot fall through as a DOM attribute. Fails closed for keys nobody has thought of yet.
- **`isSafeBlockUrl` gates every author-entered href** (http, https, mailto, tel, same-origin paths). The link list renders anything else as text; the rich-text link dialog rejects it.
- **The backend sanitises on write.** `htmlProps` names the props that carry HTML; the server runs those through its allow-list, applies the same URL rule to URL props, and persists only schema-declared keys. ui-shell does not sanitise and must not be relied on to.
- `validateBlockDocument()` is structural only (schema version, layouts, column counts, unique ids, types and props present). It takes no registry and is exported Vue- and CSS-free as `@natca-itc/ui-shell/block-document` so a Node backend can import it. PHP backends port the rules; the spec is the source of truth for both.

### 7. TipTap is an optional peer, loaded only in the editor's rich-text field
`@tiptap/core` and `@tiptap/starter-kit` are `peerDependenciesMeta.optional`, dynamically imported when an author opens a `richText` field, and marked external at build. The read-only canvas never loads them. An app without them gets an "editor unavailable" notice in that one field, not a crash.

## Consequences

### Positive
- One document shape, one editor and one set of security rules across BID, MyNATCA and whatever follows.
- Adding a block to an app is one `defineBlock()` and one component; adding a field type improves every app at once.
- Read-only pages pay nothing for editing; apps that never edit install nothing extra.
- Cross-app documents degrade gracefully instead of white-screening.

### Trade-offs
- The document shape is now a cross-repo contract. A change to it, or to a shipped block's `propsSchema`, is a change in ui-shell **and** every backend that validates or sanitises documents.
- No drag-and-drop, image blocks, revision history or per-block permissions in phase 1. Blocks move with up/down/left/right controls.
- Undo does not exist; shrinking a section's layout appends orphaned blocks to the last surviving column rather than dropping them.
- `window.confirm`/`prompt` are used in the editor rather than `NatcaDialog`; acceptable for phase 1, noted for follow-up.

### Version bump
`0.4.0-beta.24` → `0.4.0-beta.26` (additive: new exports, one new subpath export, two optional peers; no existing prop, token or export changed).

### Files
| Area | Files |
|------|-------|
| Engine | `src/components/blocks/NatcaBlockCanvas.vue`, `NatcaBlockEditor.vue`, `internal/*` |
| Blocks | `src/blocks/*` (`natcaContentBlocks`) |
| Contract | `src/types/blocks.ts`, `src/composables/useBlockRegistry.ts`, `src/lib/blockDocument.ts`, `src/lib/safeUrl.ts` |
| Styles | `src/styles/shell.css` (section grid, `--natca-content-stack-width`) |
| Docs | `docs/specs/block-layout.md`, `docs/agent_docs/block-engine-tutorial.md`, `page-patterns.md` §13b, `component-usage.md` |

## Alternatives Considered
- **Richer HTML blob per app** (widen TipTap and the sanitiser). Rejected: every feature is two changes that must agree, failures are silent, and there is still no home for live data.
- **Per-app page builders.** Rejected: divergent document shapes and three sets of security rules for the same problem.
- **Free-form grid / drag-resize.** Rejected deliberately: on a phone every layout is one column, so the extra freedom buys a worse desktop layout and a harder mobile story.
- **Rich text edited inside the block component.** Rejected in favour of editing in the config panel, so the read-only canvas never loads TipTap.

## Related Decisions
- BID ADR-048 — Facility pages are composed of blocks (the consumer-side decision that prompted this).
- ADR-001 — Vuetify wrapping (blocks and fields wrap Vuetify, never raw equivalents).
- Linear: NAT-1241 (engine), NAT-1242 (BID adoption), NAT-1239 (first real data-bound block).

---
**Accepted By**: NATCA ITC
**Implementation Status**: Shipped in `0.4.0-beta.26`
