<script setup lang="ts">
/**
 * NatcaAppFooter — the standard NATCA footer bar.
 *
 * Every app was re-implementing the same strip against the same tokens
 * (`--color-footer-bg` / `-text` / `-link`, shipped in natca-tokens.css since
 * 0.1). This is that strip, once. Pair it with `NatcaShell`'s `#footer` slot,
 * which handles the positioning — the slot is chrome-free precisely so an app
 * can stack a release banner or an offline notice directly above the footer
 * and have the whole block travel together (NAT-1082).
 *
 * @example Standard usage
 * <NatcaShell …>
 *   <router-view />
 *   <template #footer>
 *     <NatcaAppFooter>
 *       BID v{{ version }} · build {{ buildId }}
 *       <template #right><a :href="legacyUrl">Go to BID v5</a></template>
 *     </NatcaAppFooter>
 *   </template>
 * </NatcaShell>
 *
 * @example Something glued directly above the footer
 * <template #footer>
 *   <NewVersionBanner />
 *   <NatcaAppFooter>…</NatcaAppFooter>
 * </template>
 */
defineSlots<{
  /** Footer body — centred by default. */
  default?: () => any
  /** Pinned to the left edge. */
  left?: () => any
  /** Pinned to the right edge. */
  right?: () => any
}>()
</script>

<template>
  <footer class="natca-app-footer">
    <div v-if="$slots.left" class="natca-app-footer__side natca-app-footer__side--left">
      <slot name="left" />
    </div>

    <div class="natca-app-footer__body">
      <slot />
    </div>

    <div v-if="$slots.right" class="natca-app-footer__side natca-app-footer__side--right">
      <slot name="right" />
    </div>
  </footer>
</template>

<style scoped>
/* The bar itself is styled globally in shell.css (.natca-app-footer) so the
   footer tokens stay in one place with the rest of the shell chrome. Only the
   internal three-column layout lives here. */
.natca-app-footer__body {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
  min-width: 0;
}

.natca-app-footer__side {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
