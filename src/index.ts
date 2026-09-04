import './styles/shell.css'
import './styles/vuetify-overrides.css'

import type { App } from 'vue'

// Shell layout components
import NatcaShell from './components/NatcaShell.vue'
import NatcaTopBar from './components/NatcaTopBar.vue'
import NatcaTabNav from './components/NatcaTabNav.vue'
import NatcaBreadcrumbRow from './components/NatcaBreadcrumbRow.vue'
import NatcaSidebar from './components/NatcaSidebar.vue'
import NatcaSearchDrawer from './components/NatcaSearchDrawer.vue'
import NatcaAppSwitcher from './components/NatcaAppSwitcher.vue'
import NatcaAuthLayout from './components/NatcaAuthLayout.vue'
import NatcaAppFooter from './components/NatcaAppFooter.vue'

// Shared Vuetify-wrapped components
import NatcaTabs from './components/NatcaTabs.vue'
import NatcaMemberCard from './components/NatcaMemberCard.vue'

// Native primitives (no Vuetify — exact design-system visual fidelity)
// For VSwitch / VCheckbox / VChip / VProgressLinear use the Vuetify components
// directly; the SASS settings at src/scss/settings.scss match them to the
// design system. They used to have Natca* wrappers which were removed in 0.4.0.
import NatcaButton from './components/NatcaButton.vue'
import NatcaIconButton from './components/NatcaIconButton.vue'
import NatcaAlert from './components/NatcaAlert.vue'
import NatcaPillNav from './components/NatcaPillNav.vue'
import NatcaDialog from './components/NatcaDialog.vue'

// Composite pattern components
import NatcaCard from './components/NatcaCard.vue'
import NatcaHeaderCard from './components/NatcaHeaderCard.vue'
import NatcaTabbedCard from './components/NatcaTabbedCard.vue'
import NatcaStatCard from './components/NatcaStatCard.vue'
import NatcaStatGrid from './components/NatcaStatGrid.vue'
import NatcaEmptyState from './components/NatcaEmptyState.vue'
import NatcaPageHeader from './components/NatcaPageHeader.vue'
import NatcaAnnotation from './components/NatcaAnnotation.vue'
import NatcaSlugLabel from './components/NatcaSlugLabel.vue'

// Document viewer (DMS Phase 2 — URL + metadata in, events out; zero DMS knowledge)
import NatcaDocumentViewer from './components/NatcaDocumentViewer.vue'

// Block layout engine (NAT-1241 — page composition; app registers its own blocks)
import NatcaBlockCanvas from './components/blocks/NatcaBlockCanvas.vue'
import NatcaBlockEditor from './components/blocks/NatcaBlockEditor.vue'

// Theme components
import NatcaThemeToggle from './components/NatcaThemeToggle.vue'

// Shell layout
export {
  NatcaShell,
  NatcaTopBar,
  NatcaTabNav,
  NatcaBreadcrumbRow,
  NatcaSidebar,
  NatcaSearchDrawer,
  NatcaAppSwitcher,
  NatcaAuthLayout,
  NatcaAppFooter,
}

// Shared components
export {
  NatcaTabs,
  NatcaMemberCard,
}

// Native primitives
export {
  NatcaButton,
  NatcaIconButton,
  NatcaAlert,
  NatcaPillNav,
  NatcaDialog,
}

// Composite pattern components
export {
  NatcaCard,
  NatcaHeaderCard,
  NatcaTabbedCard,
  NatcaStatCard,
  NatcaStatGrid,
  NatcaEmptyState,
  NatcaPageHeader,
  NatcaAnnotation,
  NatcaSlugLabel,
}

// Document viewer
export { NatcaDocumentViewer }

// ── Block layout engine ───────────────────────────────────────────────────
// The engine and the generic content blocks. Data-bound blocks are registered
// by the host app: createBlockRegistry([...natcaContentBlocks, myDataBlock]).
export { NatcaBlockCanvas, NatcaBlockEditor }

export {
  createBlockRegistry,
  defineBlock,
  provideBlockRegistry,
  useBlockRegistry,
  NatcaBlockRegistryKey,
} from './composables/useBlockRegistry'

export {
  natcaContentBlocks,
  headingBlock,
  richTextBlock,
  tableBlock,
  calloutBlock,
  linkListBlock,
  dividerBlock,
  NatcaHeadingBlock,
  NatcaRichTextBlock,
  NatcaTableBlock,
  NatcaCalloutBlock,
  NatcaLinkListBlock,
  NatcaDividerBlock,
} from './blocks/index'

export {
  validateBlockDocument,
  emptyBlockDocument,
  createBlockId,
  createBlockColumn,
  createBlockSection,
  relayoutSection,
} from './lib/blockDocument'

export {
  NATCA_BLOCK_SCHEMA_VERSION,
  NATCA_SECTION_COLUMN_COUNT,
} from './types/blocks'

export type {
  NatcaBlockDocument,
  NatcaBlockSection,
  NatcaBlockColumn,
  NatcaBlockInstance,
  NatcaBlockDefinition,
  NatcaBlockRegistry,
  NatcaBlockField,
  NatcaBlockContext,
  NatcaBlockTableValue,
  NatcaSectionLayout,
} from './types/blocks'
export type { NatcaBlockValidationResult } from './lib/blockDocument'

export type { NatcaPillItem } from './components/NatcaPillNav.vue'

// Theme components
export { NatcaThemeToggle }

// Types
export * from './types'
export type { NatcaTabItem } from './components/NatcaTabs.vue'
export type { MemberCardData } from './components/NatcaMemberCard.vue'

// Canonical app registry — default apps list for the switcher (production URLs
// baked in so consuming apps don't hardcode their own; see NAT-833 / NAT-825)
export { natcaApps } from './data/natcaApps'

// Composables
export { useShellState } from './composables/useShellState'
export { useNatcaTheme } from './composables/useNatcaTheme'

// Vuetify theme preset
export {
  natcaVuetifyTheme,
  natcaLightTheme,
  natcaDarkTheme,
  natcaColors,
  natcaDefaults,
} from './theme/index'

// Vue plugin — registers all components globally
export const NatcaUiShell = {
  install(app: App) {
    // Shell
    app.component('NatcaShell', NatcaShell)
    app.component('NatcaTopBar', NatcaTopBar)
    app.component('NatcaTabNav', NatcaTabNav)
    app.component('NatcaBreadcrumbRow', NatcaBreadcrumbRow)
    app.component('NatcaSidebar', NatcaSidebar)
    app.component('NatcaSearchDrawer', NatcaSearchDrawer)
    app.component('NatcaAppSwitcher', NatcaAppSwitcher)
    app.component('NatcaAuthLayout', NatcaAuthLayout)
    app.component('NatcaAppFooter', NatcaAppFooter)
    // Shared components
    app.component('NatcaTabs', NatcaTabs)
    app.component('NatcaMemberCard', NatcaMemberCard)
    // Native primitives
    app.component('NatcaButton', NatcaButton)
    app.component('NatcaIconButton', NatcaIconButton)
    app.component('NatcaAlert', NatcaAlert)
    app.component('NatcaPillNav', NatcaPillNav)
    app.component('NatcaDialog', NatcaDialog)
    // Composite pattern components
    app.component('NatcaCard', NatcaCard)
    app.component('NatcaHeaderCard', NatcaHeaderCard)
    app.component('NatcaTabbedCard', NatcaTabbedCard)
    app.component('NatcaStatCard', NatcaStatCard)
    app.component('NatcaStatGrid', NatcaStatGrid)
    app.component('NatcaEmptyState', NatcaEmptyState)
    app.component('NatcaPageHeader', NatcaPageHeader)
    app.component('NatcaAnnotation', NatcaAnnotation)
    app.component('NatcaSlugLabel', NatcaSlugLabel)
    // Document viewer
    app.component('NatcaDocumentViewer', NatcaDocumentViewer)
    // Block layout engine
    app.component('NatcaBlockCanvas', NatcaBlockCanvas)
    app.component('NatcaBlockEditor', NatcaBlockEditor)
    // Theme
    app.component('NatcaThemeToggle', NatcaThemeToggle)
  },
}

export default NatcaUiShell
