<!--
  Playground demo for NatcaAuthLayout (NAT-834).

  Note: no `:apps` is passed — the layout falls back to the built-in `natcaApps`
  registry (NAT-833), so the switcher shows MyNATCA/BID/Pay/GATS with DMS hidden,
  zero config. This is a thin consumer, exactly like an app's LandingPage.vue.
-->
<template>
  <NatcaAuthLayout
    app-name="MyNATCA"
    app-id="mn"
    tagline="Your union account — profile, teams, and the updates that need you, all in one place."
    :logo-src="natcaLogo"
    :capabilities="capabilities"
    subheading="Sign in with your MyNATCA credentials."
  >
    <template #action>
      <NatcaButton variant="primary" size="lg" @click="onSignIn">
        <v-icon size="20" class="mr-2">mdi-login-variant</v-icon>
        Sign in
      </NatcaButton>
    </template>

    <template #subtext>
      Trouble signing in? <a href="#" @click.prevent>Contact ITC &rarr;</a>
    </template>
  </NatcaAuthLayout>
</template>

<script setup lang="ts">
import { NatcaAuthLayout, NatcaButton } from '@/index'
import type { NatcaCapability } from '@/types'
import natcaLogo from '../../assets/natca-logo.png'

const capabilities: NatcaCapability[] = [
  { icon: 'mdi-account-group', title: 'Membership', text: 'Your profile, dues, and status at a glance.' },
  { icon: 'mdi-account-multiple', title: 'Teams', text: 'Committees, positions, and assignments.' },
  { icon: 'mdi-bell', title: 'Updates', text: 'News and action items that need your attention.' },
]

function onSignIn() {
  // eslint-disable-next-line no-console
  console.log('[playground] auth-landing sign in')
}
</script>
