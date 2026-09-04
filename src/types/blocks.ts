/**
 * Block layout engine — public types (NAT-1241, BID ADR-048).
 *
 * ui-shell owns the engine, the registry contract, the schema-driven config
 * panel and the generic content blocks. It knows nothing about any app's data:
 * same boundary as NatcaDocumentViewer ("URL + metadata in, events out").
 * Data-bound blocks are registered by the host app and resolve their own data.
 */
import type { Component } from 'vue'

// ── Document shape ───────────────────────────────────────────────────────

/**
 * Preset row layouts. Two levels only — sections hold columns, columns hold
 * blocks. There is no third level, deliberately: nested sections are how
 * page builders become unmaintainable, and every layout below collapses to a
 * single column at --natca-content-stack-width (900px) in author order.
 */
export type NatcaSectionLayout = 'one' | '50-50' | '67-33' | '33-67' | 'thirds'

/** Number of columns each preset renders above the stack breakpoint. */
export const NATCA_SECTION_COLUMN_COUNT: Record<NatcaSectionLayout, number> = {
  'one': 1,
  '50-50': 2,
  '67-33': 2,
  '33-67': 2,
  'thirds': 3,
}

/** One placed block. `props` is validated by the block's own propsSchema. */
export interface NatcaBlockInstance {
  id: string
  type: string
  props: Record<string, unknown>
}

export interface NatcaBlockColumn {
  id: string
  blocks: NatcaBlockInstance[]
}

export interface NatcaBlockSection {
  id: string
  layout: NatcaSectionLayout
  columns: NatcaBlockColumn[]
}

/**
 * The stored document. `schema_version` is written on every save so a future
 * migration can be applied on read rather than in a batch job.
 */
export interface NatcaBlockDocument {
  schema_version: 1
  sections: NatcaBlockSection[]
}

/** Current schema version emitted by the editor. */
export const NATCA_BLOCK_SCHEMA_VERSION = 1

// ── Config-form schema ───────────────────────────────────────────────────

interface NatcaBlockFieldBase {
  key: string
  label: string
  /** Helper text under the input. */
  help?: string
  required?: boolean
}

/** One row of a `list` field, or one column of a `table` field. */
export type NatcaBlockField =
  | (NatcaBlockFieldBase & {
      type: 'text' | 'textarea' | 'richText' | 'url' | 'number' | 'boolean'
      placeholder?: string
    })
  | (NatcaBlockFieldBase & {
      type: 'select'
      options: Array<{ value: string | number; label: string }>
    })
  | (NatcaBlockFieldBase & {
      /** Editable grid — the value is a NatcaBlockTableValue. */
      type: 'table'
    })
  | (NatcaBlockFieldBase & {
      /** Repeating group — the value is an array of objects shaped by `item`. */
      type: 'list'
      item: NatcaBlockField[]
      addLabel?: string
    })

/** Value shape behind a `table` field. */
export interface NatcaBlockTableValue {
  columns: string[]
  rows: string[][]
}

// ── Registry ─────────────────────────────────────────────────────────────

/**
 * Handed to a data-bound block's `resolve()`. `scope` is whatever the host app
 * passed to NatcaBlockCanvas — ui-shell never reads inside it.
 */
export interface NatcaBlockContext {
  scope: Record<string, unknown>
  /** Aborts when the block unmounts or its props change. */
  signal: AbortSignal
}

export interface NatcaBlockDefinition<P = Record<string, any>> {
  /** Stable identifier stored in the document. Namespace app blocks: `bid.roster`. */
  type: string
  /** Shown in the inserter and the config panel header. */
  label: string
  /** MDI icon name, e.g. 'mdi-table'. */
  icon: string
  description?: string
  /** Rendered with `v-bind` of the resolved props, plus `resolved` when async. */
  component: Component
  /** Drives the generated config form. Never hand-write a per-block form. */
  propsSchema: NatcaBlockField[]
  /** Props for a freshly inserted block. */
  defaults?: () => P
  /**
   * Data-bound blocks only. Runs on the canvas before render; the result is
   * passed to the component as `resolved`. Throwing renders the error state.
   */
  resolve?: (props: P, context: NatcaBlockContext) => Promise<unknown>
  /**
   * Names of props holding raw HTML. The host app MUST sanitize these on write
   * — ui-shell renders them, it does not clean them. Used by backends to know
   * which fields to run through their sanitizer.
   */
  htmlProps?: string[]
}

export interface NatcaBlockRegistry {
  register: (definition: NatcaBlockDefinition<any>) => void
  get: (type: string) => NatcaBlockDefinition<any> | undefined
  has: (type: string) => boolean
  /** Insertion order — drives the inserter menu. */
  list: () => NatcaBlockDefinition<any>[]
}
