import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import '../src/css/natca-tokens.css'
// natca-components.css is for WordPress/static pages ONLY — Vuetify apps must NOT load it
import '@mdi/font/css/materialdesignicons.css'

// Use the shared theme preset — same thing consuming apps will import
import { natcaVuetifyTheme, natcaDefaults } from '../src/theme/index'

import { useNatcaTheme } from '../src/composables/useNatcaTheme'

import App from './App.vue'
import { router } from './router'

// Initialize theme — auth'd apps default to dark, or restore user preference
const { setTheme } = useNatcaTheme()
setTheme(localStorage.getItem('natca-theme') ?? 'dark')

const vuetify = createVuetify({
  components,
  directives,
  theme: natcaVuetifyTheme,
  defaults: natcaDefaults,
})

const app = createApp(App)
app.use(vuetify)
app.use(router)
app.mount('#app')
