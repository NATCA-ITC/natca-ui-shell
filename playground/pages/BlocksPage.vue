<script setup lang="ts">
/**
 * Block layout engine harness (NAT-1241).
 *
 * Exercises the whole contract in one page: the six content blocks, all five
 * preset layouts, a fake data-bound block that resolves asynchronously, and an
 * unregistered block type so the placeholder path is always on screen rather
 * than only discovered in production.
 */
import { computed, ref } from 'vue'
import NatcaBlockEditor from '../../src/components/blocks/NatcaBlockEditor.vue'
import NatcaBlockCanvas from '../../src/components/blocks/NatcaBlockCanvas.vue'
import NatcaCard from '../../src/components/NatcaCard.vue'
import NatcaButton from '../../src/components/NatcaButton.vue'
import NatcaPillNav from '../../src/components/NatcaPillNav.vue'
import { createBlockRegistry, defineBlock } from '../../src/composables/useBlockRegistry'
import { natcaContentBlocks } from '../../src/blocks/index'
import { validateBlockDocument } from '../../src/lib/blockDocument'
import type { NatcaBlockDocument } from '../../src/types/blocks'
import FakeRosterBlock from './blocks/FakeRosterBlock.vue'

/** Stands in for a real app block — proves resolve() + scope reach the component. */
const rosterBlock = defineBlock<{ areaCode: string }>({
  type: 'demo.roster',
  label: 'Area roster (demo)',
  icon: 'mdi-account-group',
  description: 'A data-bound block. Resolves from a fake API.',
  component: FakeRosterBlock,
  defaults: () => ({ areaCode: 'SOUTH' }),
  propsSchema: [
    {
      key: 'areaCode',
      label: 'Area',
      type: 'select',
      options: [
        { value: 'SOUTH', label: 'South' },
        { value: 'EAST', label: 'East' },
        { value: 'FAIL', label: 'Broken area (throws)' },
      ],
      help: 'Pick "Broken area" to see the per-block error state.',
    },
  ],
  resolve: async (props, context) => {
    await new Promise((r) => setTimeout(r, 400))
    if (context.signal.aborted) return null
    if (props.areaCode === 'FAIL') throw new Error('Roster service is unavailable.')
    const names = props.areaCode === 'SOUTH'
      ? ['Reece, B.', 'Wiseman, H.', 'Doss, J.']
      : ['Alvarez, M.', 'Chen, K.']
    return { facility: context.scope.facility, names }
  },
})

const registry = createBlockRegistry([...natcaContentBlocks, rosterBlock])

const scope = { facility: 'ZJX', bidYear: 2027 }

const document = ref<NatcaBlockDocument>({
  schema_version: 1,
  sections: [
    {
      id: 'sec_intro',
      layout: 'one',
      columns: [
        {
          id: 'col_intro',
          blocks: [
            { id: 'b_h', type: 'natca.heading', props: { text: 'Welcome to ZJX', level: '2' } },
            {
              id: 'b_t',
              type: 'natca.richText',
              props: {
                html: '<p>Round 3 opens <strong>Monday at 0700 local</strong>. Check your window before you bid — it is listed on your summary page.</p>',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'sec_split',
      layout: '67-33',
      columns: [
        {
          id: 'col_wide',
          blocks: [
            {
              id: 'b_table',
              type: 'natca.table',
              props: {
                caption: 'Round schedule',
                firstRowHeader: false,
                data: {
                  columns: ['Round', 'Opens', 'Closes'],
                  rows: [
                    ['1', 'Sep 8', 'Sep 12'],
                    ['2', 'Sep 15', 'Sep 19'],
                    ['3', 'Sep 22', 'Sep 26'],
                  ],
                },
              },
            },
          ],
        },
        {
          id: 'col_narrow',
          blocks: [
            {
              id: 'b_callout',
              type: 'natca.callout',
              props: { type: 'warning', title: 'Heads up', body: 'Leave slots are recalculated overnight.' },
            },
            {
              id: 'b_links',
              type: 'natca.linkList',
              props: {
                title: 'Resources',
                links: [
                  { label: 'Bidding guide', url: 'https://natca.org' },
                  { label: 'Contact your rep', url: 'mailto:rep@natca.org' },
                ],
              },
            },
          ],
        },
      ],
    },
    {
      id: 'sec_data',
      layout: '50-50',
      columns: [
        { id: 'col_data', blocks: [{ id: 'b_roster', type: 'demo.roster', props: { areaCode: 'SOUTH' } }] },
        {
          id: 'col_unknown',
          blocks: [{ id: 'b_unknown', type: 'mn.eventsFeed', props: { limit: 3 } }],
        },
      ],
    },
  ],
})

const mode = ref('edit')
const modes = [
  { value: 'edit', label: 'Edit' },
  { value: 'view', label: 'Member view' },
  { value: 'json', label: 'JSON' },
]

const validation = computed(() => validateBlockDocument(document.value))
const json = computed(() => JSON.stringify(document.value, null, 2))

function reset() {
  document.value = { schema_version: 1, sections: [] }
}
</script>

<template>
  <div class="blocks-page">
    <div class="natca-shell-content-head">
      <div>
        <div class="natca-shell-content-title">Block layout</div>
        <div class="natca-shell-content-sub">
          NatcaBlockEditor / NatcaBlockCanvas — page composition (NAT-1241)
        </div>
      </div>
      <NatcaButton variant="ghost" size="sm" @click="reset">Clear document</NatcaButton>
    </div>

    <div class="blocks-page__body">
      <NatcaPillNav v-model="mode" :items="modes" />

      <p class="blocks-page__status" :class="{ 'is-bad': !validation.valid }">
        <template v-if="validation.valid">Document is structurally valid.</template>
        <template v-else>{{ validation.errors.length }} validation error(s): {{ validation.errors[0] }}</template>
      </p>

      <NatcaBlockEditor
        v-if="mode === 'edit'"
        v-model:document="document"
        :registry="registry"
        :scope="scope"
      />

      <NatcaCard v-else-if="mode === 'view'" title="Facility home" subtitle="Exactly what a member sees">
        <NatcaBlockCanvas
          :document="document"
          :registry="registry"
          :scope="scope"
          empty-text="Nothing has been posted here yet."
        />
      </NatcaCard>

      <pre v-else class="blocks-page__json">{{ json }}</pre>
    </div>
  </div>
</template>

<style scoped>
.blocks-page__body {
  padding: 16px 24px 40px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.blocks-page__status {
  font-size: var(--text-xs);
  color: var(--color-success);
  margin: 0;
}
.blocks-page__status.is-bad { color: var(--color-danger); }

.blocks-page__json {
  margin: 0;
  padding: 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg-surface);
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 12px;
  line-height: 1.5;
  color: var(--color-text-body);
  overflow-x: auto;
}
</style>
