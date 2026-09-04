<script setup lang="ts">
/** Section heading. h1 is the page title, owned by the shell — blocks start at h2. */
withDefaults(defineProps<{
  text?: string
  level?: '2' | '3'
}>(), {
  text: '',
  level: '2',
})
</script>

<template>
  <component :is="`h${level}`" v-if="text" class="natca-block-heading" :class="`natca-block-heading--h${level}`">
    {{ text }}
  </component>
</template>

<style scoped>
.natca-block-heading {
  font-family: var(--font-display);
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
  line-height: 1.25;
}
.natca-block-heading--h2 { font-size: var(--text-lg); }
.natca-block-heading--h3 { font-size: var(--text-md); }
</style>
