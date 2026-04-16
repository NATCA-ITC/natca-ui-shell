<script setup lang="ts">
/**
 * NatcaAnnotation — Info/tip callout box for guidance and documentation.
 *
 * Matches the `.auth-annotation` pattern from the design system.
 * Use for inline guidance, tips, and contextual help within pages.
 *
 * @example
 * <NatcaAnnotation>
 *   <strong>How it works:</strong> natcaDefaults sets density and variant automatically.
 * </NatcaAnnotation>
 *
 * @example
 * <NatcaAnnotation type="warning">
 *   <strong>Breaking change:</strong> This will affect all consuming apps.
 * </NatcaAnnotation>
 */
withDefaults(defineProps<{
  type?: 'info' | 'tip' | 'warning'
}>(), {
  type: 'info',
})
</script>

<template>
  <div class="natca-annotation" :class="`natca-annotation--${type}`">
    <slot />
  </div>
</template>

<style scoped>
.natca-annotation {
  font-size: var(--text-sm);
  color: var(--color-text-body);
  background: var(--color-info-bg);
  border-left: 3px solid var(--color-info);
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
  padding: 10px 14px;
  line-height: 1.5;
}

.natca-annotation :deep(strong) {
  font-weight: 700;
  color: var(--color-info);
}

.natca-annotation :deep(code) {
  font-size: 10px;
  background: var(--overlay-subtle);
  padding: 1px 4px;
  border-radius: 3px;
  font-family: var(--font-mono);
}

.natca-annotation--tip {
  background: var(--color-success-bg);
  border-left-color: var(--color-success);
}

.natca-annotation--tip :deep(strong) {
  color: var(--color-success);
}

.natca-annotation--warning {
  background: var(--color-warning-bg);
  border-left-color: var(--color-warning);
}

.natca-annotation--warning :deep(strong) {
  color: var(--color-warning);
}
</style>
