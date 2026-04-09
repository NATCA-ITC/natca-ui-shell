import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import '../src/css/natca-tokens.css'
import '../src/css/natca-components.css'
import '@mdi/font/css/materialdesignicons.css'

// Use the shared theme preset — same thing consuming apps will import
import { natcaVuetifyTheme, natcaDefaults } from '../src/theme/index'

import App from './App.vue'
import { router } from './router'

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
