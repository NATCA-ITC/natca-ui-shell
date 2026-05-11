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
import NatcaStatCard from './components/NatcaStatCard.vue'
import NatcaStatGrid from './components/NatcaStatGrid.vue'
import NatcaEmptyState from './components/NatcaEmptyState.vue'
import NatcaPageHeader from './components/NatcaPageHeader.vue'
import NatcaAnnotation from './components/NatcaAnnotation.vue'

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
  NatcaStatCard,
  NatcaStatGrid,
  NatcaEmptyState,
  NatcaPageHeader,
  NatcaAnnotation,
}

export type { NatcaPillItem } from './components/NatcaPillNav.vue'

// Theme components
export { NatcaThemeToggle }

// Types
export * from './types'
export type { NatcaTabItem } from './components/NatcaTabs.vue'
export type { MemberCardData } from './components/NatcaMemberCard.vue'

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
    app.component('NatcaStatCard', NatcaStatCard)
    app.component('NatcaStatGrid', NatcaStatGrid)
    app.component('NatcaEmptyState', NatcaEmptyState)
    app.component('NatcaPageHeader', NatcaPageHeader)
    app.component('NatcaAnnotation', NatcaAnnotation)
    // Theme
    app.component('NatcaThemeToggle', NatcaThemeToggle)
  },
}

export default NatcaUiShell
