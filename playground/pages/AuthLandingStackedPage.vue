<!--
  Playground demo for NatcaAuthLayout layout="stacked" (NAT-2637): a navy band
  with the heading and sign-in, then app content full width below.
-->
<template>
  <NatcaAuthLayout
    layout="stacked"
    app-name="Pay Calculator"
    app-id="pay"
    eyebrow="Pay Calculator"
    heading="Check your pay against your LES"
    subheading="Upload your LES PDFs and see, line by line, what you should have been paid."
  >
    <template #action>
      <NatcaButton variant="primary" size="lg" @click="onSignIn">Sign in</NatcaButton>
    </template>

    <div class="demo-tools">
      <NatcaHeaderCard title="Retro Pay Calculator" icon="mdi-cash-plus" accent="red">
        <p>Upload your LES PDFs to calculate your retro pay. No shift entry.</p>
      </NatcaHeaderCard>
      <NatcaHeaderCard title="LES Validator" icon="mdi-file-check-outline">
        <p>Enter your shifts for a pay period and check your LES line by line.</p>
      </NatcaHeaderCard>
    </div>
  </NatcaAuthLayout>
</template>

<script setup lang="ts">
import { NatcaAuthLayout, NatcaButton, NatcaHeaderCard } from '@/index'

function onSignIn() {
  // eslint-disable-next-line no-console
  console.log('[playground] auth-landing (stacked) sign in')
}
</script>

<style scoped>
.demo-tools { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
@media (max-width: 860px) { .demo-tools { grid-template-columns: minmax(0, 1fr); } }
.demo-tools p { margin: 0; }
</style>
