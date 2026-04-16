<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  search: [query: string]
}>()

defineSlots<{
  recent?: () => any
  'quick-links'?: () => any
}>()

const query = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

watch(() => props.modelValue, (open) => {
  if (open) {
    nextTick(() => inputRef.value?.focus())
  } else {
    query.value = ''
  }
})

function close() {
  emit('update:modelValue', false)
}

function handleSubmit() {
  const q = query.value.trim()
  if (q) {
    emit('search', q)
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    close()
  }
}
</script>

<template>
  <!-- Single wrapper — always in DOM, always absolutely positioned, never affects layout -->
  <div
    v-show="modelValue"
    class="natca-shell-search-overlay"
    @keydown="handleKeydown"
  >
    <!-- Backdrop -->
    <div class="natca-shell-search-backdrop" @click="close" />

    <!-- Drawer panel -->
    <div class="natca-shell-search-drawer" :class="{ 'natca-shell-search-drawer-open': modelValue }">
      <!-- Header -->
      <div class="natca-shell-search-header">
        <span class="natca-shell-search-title">Search</span>
        <button
          class="natca-shell-top-icon"
          type="button"
          aria-label="Close search"
          @click="close"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <!-- Search input -->
      <form class="natca-shell-search-form" @submit.prevent="handleSubmit">
        <div class="natca-shell-search-input-wrap">
          <svg class="natca-shell-search-input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            ref="inputRef"
            v-model="query"
            type="text"
            placeholder="Search members, facilities, records..."
            class="natca-shell-search-input"
          />
        </div>
      </form>

      <!-- Content sections -->
      <div class="natca-shell-search-body">
        <div v-if="$slots.recent" class="natca-shell-search-section">
          <div class="natca-shell-search-section-title">Recent Searches</div>
          <slot name="recent" />
        </div>
        <div v-if="$slots['quick-links']" class="natca-shell-search-section">
          <div class="natca-shell-search-section-title">Quick Links</div>
          <slot name="quick-links" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Overlay wrapper — always in DOM via v-show, always absolutely positioned, zero layout impact */
.natca-shell-search-overlay {
  position: absolute;
  inset: 0;
  z-index: 199;
  pointer-events: none;
  overflow: hidden;
}

.natca-shell-search-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  pointer-events: auto;
}

.natca-shell-search-drawer {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 380px;
  max-width: 100%;
  background: var(--color-shell-surface);
  border-left: 1px solid var(--color-border);
  z-index: 1;
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.4);
  pointer-events: auto;
}

.natca-shell-search-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid var(--overlay-border);
}

.natca-shell-search-title {
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 700;
  color: var(--color-text-primary);
}

.natca-shell-search-form {
  padding: 12px 16px;
}

.natca-shell-search-input-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--overlay-subtle);
  border: 1px solid var(--overlay-border);
  border-radius: 8px;
  padding: 8px 12px;
}

.natca-shell-search-input-icon {
  color: var(--color-text-faint);
  flex-shrink: 0;
}

.natca-shell-search-input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: var(--color-text-primary);
  font-family: var(--font-body);
  font-size: 13px;
}

.natca-shell-search-input::placeholder {
  color: var(--color-text-faint);
}

.natca-shell-search-body {
  flex: 1;
  overflow-y: auto;
  padding: 8px 16px;
}

.natca-shell-search-section {
  margin-bottom: 16px;
}

.natca-shell-search-section-title {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--color-text-faint);
  padding: 8px 0 6px;
}
</style>
