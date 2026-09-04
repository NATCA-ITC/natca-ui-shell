/**
 * The generic content blocks ui-shell ships. Every one of these is filled from
 * the config form — none of them talk to an API. Data-bound blocks are the host
 * app's job and are registered alongside these:
 *
 *   createBlockRegistry([...natcaContentBlocks, myDataBlock])
 */
import { defineBlock } from '../composables/useBlockRegistry'
import type { NatcaBlockDefinition, NatcaBlockTableValue } from '../types/blocks'

import NatcaHeadingBlock from './NatcaHeadingBlock.vue'
import NatcaRichTextBlock from './NatcaRichTextBlock.vue'
import NatcaTableBlock from './NatcaTableBlock.vue'
import NatcaCalloutBlock from './NatcaCalloutBlock.vue'
import NatcaLinkListBlock from './NatcaLinkListBlock.vue'
import NatcaDividerBlock from './NatcaDividerBlock.vue'

export const headingBlock = defineBlock<{ text: string; level: '2' | '3' }>({
  type: 'natca.heading',
  label: 'Heading',
  icon: 'mdi-format-header-2',
  description: 'A section title.',
  component: NatcaHeadingBlock,
  defaults: () => ({ text: '', level: '2' }),
  propsSchema: [
    { key: 'text', label: 'Heading', type: 'text', required: true, placeholder: 'Section title' },
    {
      key: 'level',
      label: 'Size',
      type: 'select',
      options: [
        { value: '2', label: 'Large (H2)' },
        { value: '3', label: 'Small (H3)' },
      ],
      help: 'The page title is H1, so headings inside content start at H2.',
    },
  ],
})

export const richTextBlock = defineBlock<{ html: string }>({
  type: 'natca.richText',
  label: 'Text',
  icon: 'mdi-text',
  description: 'Formatted paragraphs, lists, and links.',
  component: NatcaRichTextBlock,
  defaults: () => ({ html: '' }),
  htmlProps: ['html'],
  propsSchema: [
    { key: 'html', label: 'Content', type: 'richText' },
  ],
})

export const tableBlock = defineBlock<{
  caption: string
  data: NatcaBlockTableValue
  firstRowHeader: boolean
}>({
  type: 'natca.table',
  label: 'Table',
  icon: 'mdi-table',
  description: 'Rows and columns. Stacks into labelled cards on a phone.',
  component: NatcaTableBlock,
  defaults: () => ({
    caption: '',
    data: { columns: ['Column 1', 'Column 2'], rows: [['', ''], ['', '']] },
    firstRowHeader: false,
  }),
  propsSchema: [
    { key: 'data', label: 'Table', type: 'table' },
    { key: 'caption', label: 'Caption', type: 'text', placeholder: 'Optional line above the table' },
    {
      key: 'firstRowHeader',
      label: 'Use the first row as the header',
      type: 'boolean',
      help: 'Off by default — the column names above are the header.',
    },
  ],
})

export const calloutBlock = defineBlock<{
  type: 'info' | 'success' | 'warning' | 'danger'
  title: string
  body: string
}>({
  type: 'natca.callout',
  label: 'Callout',
  icon: 'mdi-alert-circle-outline',
  description: 'A tinted notice. One per page, at most.',
  component: NatcaCalloutBlock,
  defaults: () => ({ type: 'info', title: '', body: '' }),
  propsSchema: [
    {
      key: 'type',
      label: 'Tone',
      type: 'select',
      options: [
        { value: 'info', label: 'Info' },
        { value: 'success', label: 'Success' },
        { value: 'warning', label: 'Warning' },
        { value: 'danger', label: 'Important' },
      ],
    },
    { key: 'title', label: 'Lead-in', type: 'text', placeholder: 'Bidding closes Friday' },
    { key: 'body', label: 'Message', type: 'textarea', required: true },
  ],
})

export const linkListBlock = defineBlock<{ title: string; links: Array<{ label: string; url: string }> }>({
  type: 'natca.linkList',
  label: 'Links',
  icon: 'mdi-link-variant',
  description: 'A short list of links.',
  component: NatcaLinkListBlock,
  defaults: () => ({ title: '', links: [{ label: '', url: '' }] }),
  propsSchema: [
    { key: 'title', label: 'List title', type: 'text' },
    {
      key: 'links',
      label: 'Links',
      type: 'list',
      addLabel: 'Add link',
      item: [
        { key: 'label', label: 'Label', type: 'text', required: true },
        { key: 'url', label: 'URL', type: 'url', required: true, placeholder: 'https://' },
      ],
    },
  ],
})

export const dividerBlock = defineBlock<Record<string, never>>({
  type: 'natca.divider',
  label: 'Divider',
  icon: 'mdi-minus',
  description: 'A horizontal rule.',
  component: NatcaDividerBlock,
  defaults: () => ({} as Record<string, never>),
  propsSchema: [],
})

/** Insertion order in the block picker. */
export const natcaContentBlocks: NatcaBlockDefinition<any>[] = [
  richTextBlock,
  headingBlock,
  tableBlock,
  calloutBlock,
  linkListBlock,
  dividerBlock,
]

export {
  NatcaHeadingBlock,
  NatcaRichTextBlock,
  NatcaTableBlock,
  NatcaCalloutBlock,
  NatcaLinkListBlock,
  NatcaDividerBlock,
}
