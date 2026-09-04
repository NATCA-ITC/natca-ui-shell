# Block layout engine — implementation guide

_Applies to `@natca-itc/ui-shell` 0.4.0-beta.26 and later. Decision record: ADR-003. Contract: `docs/specs/block-layout.md`. Rules: `page-patterns.md` §13b._

This is the step-by-step for adding an admin-composed page to a NATCA app. Read it top to bottom the first time; the **Backend write path** section is the part most likely to be skipped and most costly to skip.

## What you get

| Export | What it is |
|---|---|
| `NatcaBlockCanvas` | Read-only renderer. Document + registry in, page out. |
| `NatcaBlockEditor` | Authoring surface. Sections, layouts, inserter, config panel. Never saves. |
| `createBlockRegistry`, `defineBlock` | Build the registry your app passes to both. |
| `natcaContentBlocks` | The six shipped content blocks: text, heading, table, callout, links, divider. |
| `validateBlockDocument`, `emptyBlockDocument`, `createBlockSection`, `relayoutSection` | Document helpers, Vue-free. |
| `isSafeBlockUrl` | The URL allow-list. |
| `@natca-itc/ui-shell/block-document` | Separate CSS-free entry for Node backends (the main entry will not load in Node). |

A document is `{ schema_version: 1, sections: [{ id, layout, columns: [{ id, blocks: [{ id, type, props }] }] }] }`. Layouts are `one`, `50-50`, `67-33`, `33-67`, `thirds`; every one stacks to a single column at 900px.

## Step 0 — prerequisites

- ui-shell pinned **exactly** (`"0.4.0-beta.26"`, no caret) and the three-step Vuetify wiring from `component-usage.md` in place.
- If admins will open the editor and your registry includes `natca.richText` (it does if you spread `natcaContentBlocks`), add the two optional peers:

  ```bash
  npm i @tiptap/core@^3 @tiptap/starter-kit@^3
  ```

  They load only when an author opens a rich-text field. Read-only pages never touch them. Without them the field shows an "editor unavailable" notice; nothing else breaks.

## Step 1 — build the registry once

```ts
// src/blocks/registry.ts
import { createBlockRegistry, natcaContentBlocks } from '@natca-itc/ui-shell'
import { rosterBlock } from './rosterBlock'

export const blockRegistry = createBlockRegistry([
  ...natcaContentBlocks,
  rosterBlock,          // your app's data-bound blocks go here
])
```

One registry per app. Both the canvas and the editor take it as a prop.

## Step 2 — render the page members see

```vue
<script setup lang="ts">
import { NatcaBlockCanvas } from '@natca-itc/ui-shell'
import { blockRegistry } from '@/blocks/registry'
const props = defineProps<{ page: { layout: NatcaBlockDocument | null }, facilityCode: string }>()
</script>

<template>
  <NatcaBlockCanvas
    :document="page.layout"
    :registry="blockRegistry"
    :scope="{ facilityCode }"
    empty-text="Nothing has been posted here yet."
  />
</template>
```

`scope` is opaque to ui-shell. It is handed to every data-bound block's `resolve()` as `context.scope`, so put whatever your fetches need in it (facility, bid year, area).

## Step 3 — give admins the editor

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { NatcaBlockEditor, NatcaButton, emptyBlockDocument } from '@natca-itc/ui-shell'
import type { NatcaBlockDocument } from '@natca-itc/ui-shell'

const draft = ref<NatcaBlockDocument | null>(structuredClone(props.page.layout) ?? emptyBlockDocument())
const saving = ref(false)

async function save() {
  saving.value = true
  try { await api.saveLayout(props.page.id, draft.value) } finally { saving.value = false }
}
function discard() { draft.value = null }   // null resets the editor to empty
</script>

<template>
  <NatcaBlockEditor v-model:document="draft" :registry="blockRegistry" :scope="{ facilityCode }" />
  <div class="natca-form-footer">
    <NatcaButton variant="ghost" @click="discard">Discard</NatcaButton>
    <NatcaButton variant="primary" :loading="saving" @click="save">Save</NatcaButton>
  </div>
</template>
```

The editor emits `update:document` on every change and nothing else. When and how to persist is yours. Previews inside the editor are inert (`pointer-events: none`), so a link in a preview selects the block rather than navigating away from unsaved work.

## Step 4 — add a data-bound block

A data-bound block is a content block with a `resolve()`. The component stays dumb and reads `resolved`; the fetch lives in the definition.

```ts
// src/blocks/rosterBlock.ts
import { defineBlock } from '@natca-itc/ui-shell'
import RosterBlock from './RosterBlock.vue'

export const rosterBlock = defineBlock<{ areaId: string; limit: number }>({
  type: 'bid.roster',                  // namespace it; natca.* is reserved
  label: 'Area roster',
  icon: 'mdi-account-group',
  description: 'Members of one area, by seniority.',
  component: RosterBlock,
  defaults: () => ({ areaId: '', limit: 20 }),
  propsSchema: [
    { key: 'areaId', label: 'Area', type: 'select', options: areaOptions, required: true },
    { key: 'limit', label: 'How many to show', type: 'number' },
  ],
  resolve: (props, { scope, signal }) =>
    api.roster(scope.facilityCode as string, props.areaId, props.limit, { signal }),
})
```

```vue
<!-- src/blocks/RosterBlock.vue -->
<script setup lang="ts">
defineProps<{ areaId?: string; limit?: number; resolved?: { names: string[] } | null }>()
</script>
<template>
  <ul><li v-for="n in resolved?.names ?? []" :key="n">{{ n }}</li></ul>
</template>
```

Rules that bite:

- **Only `propsSchema` keys reach the component** (plus `resolved`). A prop that is not in the schema is dropped before render, deliberately, so a stored `innerHTML` can never fall through as a DOM attribute. Declare everything the component needs.
- **`resolve()` runs on the canvas and in editor previews.** In the editor it is debounced 400ms and the previous result stays on screen while it reloads. Honour `signal`; an aborted fetch is normal.
- **Throwing inside `resolve()` renders a contained error box**, not a broken page. Throwing inside the component is caught too. Neither reaches the rest of the document.
- **An unregistered `type` renders a placeholder.** That is what lets MyNATCA store a block BID has not registered. Do not "fix" it by registering a stub.

## Step 5 — the backend write path (do not skip)

ui-shell trusts what it is given. The server is the boundary. On every write:

1. **Validate structure.** Node: `import { validateBlockDocument } from '@natca-itc/ui-shell/block-document'` and reject when `valid` is false. PHP or anything else: port the rules from `docs/specs/block-layout.md` (schema version, known layouts, column count per layout, unique ids, non-empty `type`, `props` an object). It checks structure only and takes no registry.
2. **Sanitise HTML props.** Every key a block lists in `htmlProps` (`natca.richText` lists `html`) goes through your HTML allow-list. Your allow-list and the TipTap schema must agree, or markup is silently unwrapped on save.
3. **Gate URL props.** `htmlProps` does not cover hrefs. `natca.linkList` stores `links[].url` as a plain string. Apply the same rule ui-shell uses on the client: allow `http:`, `https:`, `mailto:`, `tel:` and same-origin paths; reject `javascript:`, `data:` and everything else. Reject on write so the admin sees why, rather than blanking.
4. **Persist only schema-declared keys.** Strip anything not in the block's `propsSchema`. The renderer drops them too; do not rely on one layer.
5. **Cap the size.** BID uses 256KB on the serialised document.

Store the document in a JSONB column. Keep any legacy HTML column; render it when the layout is null and convert it to one rich-text block in a one-column section on first save. No flag day.

## Step 6 — test it

- The playground page `/admin/blocks` in the ui-shell repo is the reference implementation, including a fake data-bound block and a **Load hostile fixture** button that stores an `innerHTML` prop and a `javascript:` link. Your integration tests should cover the same two payloads plus: unknown block type renders a placeholder, mismatched column count is rejected, legacy content converts exactly once.
- Check both themes at compact density. The editor is an authenticated surface; if it looks spacious, something is wrong.

## What is deliberately not there (phase 1)

Drag-and-drop (blocks move with arrow controls), image blocks (no upload path), revision history, per-block permissions, nested sections, a phone-width preview toggle. Ask in NAT before building any of them app-side; they belong in the engine.

## Cross-repo contract

The document shape and each shipped block's `propsSchema` are shared by every app that stores documents and every backend that validates them. A change is a change in two or more repositories. `docs/specs/block-layout.md` is the source of truth; propose changes there first.
