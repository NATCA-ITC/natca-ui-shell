<script setup lang="ts">
/**
 * A stand-in for a host-app data block. It reads `resolved` and nothing else —
 * exactly the shape BID's real blocks will take. The fetch itself lives in the
 * registry definition's resolve(), not here.
 */
defineProps<{
  areaCode?: string
  resolved?: { facility?: unknown; names?: string[] } | null
}>()
</script>

<template>
  <div class="fake-roster">
    <p class="fake-roster__title">{{ areaCode }} — {{ resolved?.facility ?? '—' }}</p>
    <ul>
      <li v-for="name in resolved?.names ?? []" :key="name">{{ name }}</li>
    </ul>
  </div>
</template>

<style scoped>
.fake-roster {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 10px 12px;
  font-size: var(--text-sm);
  color: var(--color-text-body);
}
.fake-roster__title {
  font-weight: 700;
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--color-text-muted);
  margin: 0 0 6px;
}
ul { margin: 0; padding-left: 18px; }
</style>
