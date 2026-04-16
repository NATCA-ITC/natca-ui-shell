<script setup lang="ts">
/**
 * NatcaHeaderCard — Card with a navy header zone containing an icon + title/subtitle.
 *
 * Matches the `.auth-card-header` pattern from the design system.
 * The header is ALWAYS navy regardless of theme (brand identity).
 *
 * @example
 * <NatcaHeaderCard icon="mdi-account" title="My Email Account" subtitle="jason.doss@natca.net · ZJX">
 *   <template #default>Card body content</template>
 *   <template #actions>
 *     <v-btn variant="text">Settings</v-btn>
 *     <v-btn color="primary">Manage Account</v-btn>
 *   </template>
 * </NatcaHeaderCard>
 */
import { VCard, VCardText, VCardActions, VSpacer } from 'vuetify/components'

withDefaults(defineProps<{
  title: string
  subtitle?: string
  icon?: string
}>(), {
  icon: 'mdi-card-account-details',
})

defineSlots<{
  default?: () => any
  actions?: () => any
  'header-right'?: () => any
}>()
</script>

<template>
  <VCard class="natca-header-card">
    <div class="natca-header-card__header">
      <div class="natca-header-card__icon">
        <v-icon :icon="icon" size="18" />
      </div>
      <div class="natca-header-card__text">
        <h3 class="natca-header-card__title">{{ title }}</h3>
        <p v-if="subtitle" class="natca-header-card__subtitle">{{ subtitle }}</p>
      </div>
      <div v-if="$slots['header-right']" class="natca-header-card__header-right">
        <slot name="header-right" />
      </div>
    </div>
    <VCardText v-if="$slots.default" class="natca-header-card__body">
      <slot />
    </VCardText>
    <VCardActions v-if="$slots.actions">
      <VSpacer />
      <slot name="actions" />
    </VCardActions>
  </VCard>
</template>

<style scoped>
.natca-header-card {
  overflow: hidden;
}

.natca-header-card__header {
  background: var(--natca-navy);
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.natca-header-card__icon {
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.7);
  flex-shrink: 0;
}

.natca-header-card__text {
  flex: 1;
  min-width: 0;
}

.natca-header-card__title {
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 700;
  color: #FFFFFF;
  line-height: 1.2;
}

.natca-header-card__subtitle {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 2px;
  line-height: 1.2;
}

.natca-header-card__header-right {
  flex-shrink: 0;
}

.natca-header-card__body {
  padding: 14px 16px;
}
</style>
