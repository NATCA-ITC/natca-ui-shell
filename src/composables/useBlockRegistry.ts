/**
 * Block registry — one registry for author-content and data-bound blocks alike.
 *
 * The host app builds a registry once, hands it to NatcaBlockCanvas /
 * NatcaBlockEditor, and both provide it down to the internals.
 *
 * @example
 * const registry = createBlockRegistry([
 *   ...natcaContentBlocks,
 *   defineBlock({ type: 'bid.roster', label: 'Roster', icon: 'mdi-account-group',
 *                 component: RosterBlock, propsSchema: [...],
 *                 resolve: (props, ctx) => api.roster(props.areaId, ctx.scope) }),
 * ])
 */
import { inject, provide, type InjectionKey } from 'vue'
import type { NatcaBlockDefinition, NatcaBlockRegistry } from '../types/blocks'

export const NatcaBlockRegistryKey: InjectionKey<NatcaBlockRegistry> = Symbol('natca-block-registry')

/** Identity helper — exists purely so TypeScript infers the props generic. */
export function defineBlock<P extends Record<string, any>>(
  definition: NatcaBlockDefinition<P>,
): NatcaBlockDefinition<P> {
  return definition
}

export function createBlockRegistry(definitions: NatcaBlockDefinition<any>[] = []): NatcaBlockRegistry {
  const map = new Map<string, NatcaBlockDefinition<any>>()

  const register = (definition: NatcaBlockDefinition<any>) => {
    if (map.has(definition.type) && import.meta.env?.DEV) {
      console.warn(`[natca-blocks] block type "${definition.type}" registered twice — the later definition wins.`)
    }
    map.set(definition.type, definition)
  }

  definitions.forEach(register)

  return {
    register,
    get: (type) => map.get(type),
    has: (type) => map.has(type),
    list: () => [...map.values()],
  }
}

export function provideBlockRegistry(registry: NatcaBlockRegistry): void {
  provide(NatcaBlockRegistryKey, registry)
}

/**
 * Read the registry provided by the nearest canvas or editor. Returns an empty
 * registry rather than throwing, so a stray block component outside a canvas
 * degrades to "unknown block" instead of crashing the page.
 */
export function useBlockRegistry(): NatcaBlockRegistry {
  return inject(NatcaBlockRegistryKey, createBlockRegistry())
}
