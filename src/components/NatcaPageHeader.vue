<script setup lang="ts">
/**
 * NatcaPageHeader — Title + subtitle + right-slot actions row that opens
 * every page in a NATCA app. Companion of NatcaShell — sits at the very
 * top of the routed content area, above any section dividers or cards.
 *
 * RULES (read this before laying out a new page):
 *   • One NatcaPageHeader per page, always at the top.
 *   • The right-slot accepts any combination of buttons, icon buttons,
 *     chips, link buttons. Use NatcaButton (primary/secondary/ghost/link)
 *     — never a bare VBtn (it'll render too small under natcaDefaults).
 *   • Subtitle is optional but recommended — it's where you put the
 *     count, last-updated timestamp, or short context.
 *   • Don't put filter pills, search inputs, or tabs in the header.
 *     Those belong in a section toolbar inside a card.
 *
 * @example
 * <NatcaPageHeader title="Member Accounts" subtitle="1,247 accounts across all facilities">
 *   <template #actions>
 *     <NatcaButton variant="ghost">Export</NatcaButton>
 *     <NatcaButton variant="primary">Create Account</NatcaButton>
 *   </template>
 * </NatcaPageHeader>
 */
defineProps<{
  title: string
  subtitle?: string
}>()

defineSlots<{
  actions?: () => any
}>()
</script>

<template>
  <div class="natca-page-header">
    <div class="natca-page-header__text">
      <h2 class="natca-page-header__title">{{ title }}</h2>
      <p v-if="subtitle" class="natca-page-header__subtitle">{{ subtitle }}</p>
    </div>
    <div v-if="$slots.actions" class="natca-page-header__actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<style scoped>
.natca-page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 18px 0 14px;
  gap: 16px;
  border-bottom: 1px solid var(--overlay-border);
  margin-bottom: 16px;
}

.natca-page-header__title {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1.2;
  margin: 0;
}

.natca-page-header__subtitle {
  font-size: 13.5px;
  color: var(--color-text-muted);
  margin: 4px 0 0;
  line-height: 1.4;
}

.natca-page-header__actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}
</style>
