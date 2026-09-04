<script setup lang="ts">
/**
 * Placeholder for a block type this app has not registered.
 *
 * This exists so MyNATCA can ship a block BID has not adopted without BID's
 * page exploding — and so a typo'd type in stored data degrades to a visible
 * note instead of a white screen. It never throws.
 */
defineProps<{ type: string; editing?: boolean }>()
</script>

<template>
  <div class="natca-unknown-block">
    <v-icon icon="mdi-help-rhombus-outline" size="16" />
    <span v-if="editing">This block type (<code>{{ type }}</code>) isn't available in this app.</span>
    <span v-else>This content isn't available here.</span>
  </div>
</template>

<style scoped>
.natca-unknown-block {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  font-family: var(--font-body);
}
.natca-unknown-block code {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.95em;
}
</style>
