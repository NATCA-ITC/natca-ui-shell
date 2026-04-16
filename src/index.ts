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
    // Theme
    app.component('NatcaThemeToggle', NatcaThemeToggle)
  },
}

export default NatcaUiShell
