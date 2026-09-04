<script setup lang="ts">
/**
 * Callout — a NatcaAlert with author-supplied text.
 *
 * NatcaAlert's body is a flex row, so loose text beside a <strong> renders as
 * two columns. Everything goes inside one child element, always.
 */
import NatcaAlert from '../components/NatcaAlert.vue'

withDefaults(defineProps<{
  type?: 'info' | 'success' | 'warning' | 'danger'
  title?: string
  body?: string
}>(), {
  type: 'info',
  title: '',
  body: '',
})
</script>

<template>
  <NatcaAlert :type="type">
    <div class="natca-block-callout">
      <strong v-if="title">{{ title }}</strong>
      <span v-if="body">{{ body }}</span>
    </div>
  </NatcaAlert>
</template>

<style scoped>
.natca-block-callout {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
</style>
