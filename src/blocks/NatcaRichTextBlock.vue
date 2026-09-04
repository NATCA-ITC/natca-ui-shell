<script setup lang="ts">
/**
 * Rich text — renders stored HTML.
 *
 * This component does NOT sanitize. The host app sanitizes on write, against an
 * allow-list it controls (BID: app/Support/HtmlSanitizer.php). The block
 * declares `htmlProps: ['html']` so a backend knows which field that is.
 * Authoring happens in the config panel's `richText` field, which is where
 * TipTap is lazy-loaded — the read-only canvas never pulls the editor in.
 */
defineProps<{ html?: string }>()
</script>

<template>
  <!-- eslint-disable-next-line vue/no-v-html -- sanitized by the host on write; see block comment -->
  <div v-if="html" class="natca-block-richtext" v-html="html" />
</template>

<style scoped>
.natca-block-richtext {
  font-size: var(--text-sm);
  line-height: 1.6;
  color: var(--color-text-body);
  font-family: var(--font-body);
}
.natca-block-richtext :deep(> *:first-child) { margin-top: 0; }
.natca-block-richtext :deep(> *:last-child) { margin-bottom: 0; }
.natca-block-richtext :deep(p) { margin: 0 0 10px; }
.natca-block-richtext :deep(h2),
.natca-block-richtext :deep(h3) {
  font-family: var(--font-display);
  color: var(--color-text-primary);
  margin: 16px 0 8px;
  line-height: 1.3;
}
.natca-block-richtext :deep(h2) { font-size: var(--text-md); }
.natca-block-richtext :deep(h3) { font-size: var(--text-sm); }
.natca-block-richtext :deep(ul),
.natca-block-richtext :deep(ol) { margin: 0 0 10px; padding-left: 20px; }
.natca-block-richtext :deep(li) { margin-bottom: 4px; }
.natca-block-richtext :deep(a) { color: var(--natca-red); text-decoration: underline; }
.natca-block-richtext :deep(blockquote) {
  margin: 0 0 10px;
  padding-left: 12px;
  border-left: 3px solid var(--color-border);
  color: var(--color-text-muted);
}
.natca-block-richtext :deep(code) {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.92em;
  background: var(--color-bg-subtle, rgba(127, 127, 127, 0.12));
  padding: 1px 4px;
  border-radius: var(--radius-sm, 3px);
}
</style>
