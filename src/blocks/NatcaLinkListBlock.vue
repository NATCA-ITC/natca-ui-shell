<script setup lang="ts">
/**
 * Link list — the phase-1 stand-in for a document block.
 *
 * A document block stores a DMS *reference* and resolves a signed URL per
 * render; storing the URL would rot when the signature expires, and the
 * permission check belongs to the viewer, not the author. That makes it a
 * data-bound block for phase 2. Until then, authors link out.
 */
interface LinkItem {
  label?: string
  url?: string
}

withDefaults(defineProps<{
  title?: string
  links?: LinkItem[]
}>(), {
  title: '',
  links: () => [],
})

/** External links get the noopener/noreferrer pair; same-origin ones stay in-tab. */
function isExternal(url = ''): boolean {
  return /^https?:\/\//i.test(url)
}
</script>

<template>
  <div v-if="links.length" class="natca-block-linklist">
    <p v-if="title" class="natca-block-linklist__title">{{ title }}</p>
    <ul>
      <li v-for="(link, i) in links" :key="i">
        <a
          v-if="link.url"
          :href="link.url"
          :target="isExternal(link.url) ? '_blank' : undefined"
          :rel="isExternal(link.url) ? 'noopener noreferrer' : undefined"
        >{{ link.label || link.url }}</a>
        <span v-else>{{ link.label }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.natca-block-linklist__title {
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 6px;
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

li a,
li span {
  display: block;
  padding: 5px 8px;
  border-radius: var(--radius-sm, 4px);
  font-size: var(--text-sm);
  color: var(--color-text-body);
  text-decoration: none;
}

li a {
  color: var(--natca-red);
  transition: background 120ms;
}

li a:hover {
  background: rgba(var(--natca-red-rgb), 0.08);
  text-decoration: underline;
}
</style>
