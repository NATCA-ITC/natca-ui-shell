/**
 * Structural validation and construction helpers for block documents.
 *
 * Deliberately free of Vue imports so a Node backend can import this from the
 * package and validate a payload before it hits the database. (BID's backend is
 * PHP and needs its own port — the rules below are the specification.)
 */
import {
  NATCA_BLOCK_SCHEMA_VERSION,
  NATCA_SECTION_COLUMN_COUNT,
  type NatcaBlockColumn,
  type NatcaBlockDocument,
  type NatcaBlockInstance,
  type NatcaBlockSection,
  type NatcaSectionLayout,
} from '../types/blocks'

export interface NatcaBlockValidationResult {
  valid: boolean
  /** Human-readable, path-prefixed: `sections[0].columns[1].blocks[0].type`. */
  errors: string[]
}

const LAYOUTS = Object.keys(NATCA_SECTION_COLUMN_COUNT) as NatcaSectionLayout[]

/** Collision-resistant enough for ids that only need to be unique in one document. */
export function createBlockId(prefix = 'b'): string {
  const cryptoRef = (globalThis as any).crypto
  if (cryptoRef?.randomUUID) return `${prefix}_${cryptoRef.randomUUID().slice(0, 8)}`
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`
}

export function createBlockColumn(blocks: NatcaBlockInstance[] = []): NatcaBlockColumn {
  return { id: createBlockId('col'), blocks }
}

export function createBlockSection(layout: NatcaSectionLayout = 'one'): NatcaBlockSection {
  return {
    id: createBlockId('sec'),
    layout,
    columns: Array.from({ length: NATCA_SECTION_COLUMN_COUNT[layout] }, () => createBlockColumn()),
  }
}

export function emptyBlockDocument(): NatcaBlockDocument {
  return { schema_version: NATCA_BLOCK_SCHEMA_VERSION, sections: [] }
}

/**
 * Reshapes a section's columns to match a new layout. Blocks are never dropped:
 * when the column count shrinks, the contents of the removed columns are
 * appended to the last surviving column, in order. Losing an author's work to a
 * layout click would be unforgivable, and undo does not exist yet.
 */
export function relayoutSection(section: NatcaBlockSection, layout: NatcaSectionLayout): NatcaBlockSection {
  const target = NATCA_SECTION_COLUMN_COUNT[layout]
  const columns = section.columns.slice(0, target)
  while (columns.length < target) columns.push(createBlockColumn())

  const orphaned = section.columns.slice(target).flatMap((c) => c.blocks)
  if (orphaned.length) {
    const last = columns[columns.length - 1]
    columns[columns.length - 1] = { ...last, blocks: [...last.blocks, ...orphaned] }
  }

  return { ...section, layout, columns }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Structural validation only — block `props` are NOT checked against their
 * propsSchema here, because the validating backend does not have the registry.
 * Unknown block types are legal by design: that is what lets one app ship a
 * block another has not registered yet.
 */
export function validateBlockDocument(input: unknown): NatcaBlockValidationResult {
  const errors: string[] = []
  const seen = new Set<string>()

  const requireId = (value: unknown, path: string) => {
    if (typeof value !== 'string' || value.length === 0) {
      errors.push(`${path}.id must be a non-empty string`)
      return
    }
    if (seen.has(value)) errors.push(`${path}.id "${value}" is not unique within the document`)
    seen.add(value)
  }

  if (!isPlainObject(input)) {
    return { valid: false, errors: ['document must be an object'] }
  }
  if (input.schema_version !== NATCA_BLOCK_SCHEMA_VERSION) {
    errors.push(`schema_version must be ${NATCA_BLOCK_SCHEMA_VERSION}, got ${JSON.stringify(input.schema_version)}`)
  }
  if (!Array.isArray(input.sections)) {
    return { valid: false, errors: [...errors, 'sections must be an array'] }
  }

  input.sections.forEach((section: unknown, si: number) => {
    const sp = `sections[${si}]`
    if (!isPlainObject(section)) {
      errors.push(`${sp} must be an object`)
      return
    }
    requireId(section.id, sp)

    if (!LAYOUTS.includes(section.layout as NatcaSectionLayout)) {
      errors.push(`${sp}.layout must be one of ${LAYOUTS.join(' | ')}, got ${JSON.stringify(section.layout)}`)
    }
    if (!Array.isArray(section.columns)) {
      errors.push(`${sp}.columns must be an array`)
      return
    }
    const expected = NATCA_SECTION_COLUMN_COUNT[section.layout as NatcaSectionLayout]
    if (expected !== undefined && section.columns.length !== expected) {
      errors.push(`${sp}.columns must have ${expected} entries for layout "${section.layout}", got ${section.columns.length}`)
    }

    section.columns.forEach((column: unknown, ci: number) => {
      const cp = `${sp}.columns[${ci}]`
      if (!isPlainObject(column)) {
        errors.push(`${cp} must be an object`)
        return
      }
      requireId(column.id, cp)
      if (!Array.isArray(column.blocks)) {
        errors.push(`${cp}.blocks must be an array`)
        return
      }

      column.blocks.forEach((block: unknown, bi: number) => {
        const bp = `${cp}.blocks[${bi}]`
        if (!isPlainObject(block)) {
          errors.push(`${bp} must be an object`)
          return
        }
        requireId(block.id, bp)
        if (typeof block.type !== 'string' || block.type.length === 0) {
          errors.push(`${bp}.type must be a non-empty string`)
        }
        if (!isPlainObject(block.props)) {
          errors.push(`${bp}.props must be an object`)
        }
      })
    })
  })

  return { valid: errors.length === 0, errors }
}
