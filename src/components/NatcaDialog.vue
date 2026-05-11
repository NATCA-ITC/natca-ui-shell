<script setup lang="ts">
/**
 * NatcaDialog — Modal dialog with three layouts:
 *   • `default` — navy header strip + icon + title + subtitle. Confirm dialogs, forms.
 *   • `danger`  — red header strip + alert icon. Destructive confirmations.
 *   • `bare`    — chromeless: no header strip, no title. Lightboxes, image previews,
 *                 single-content overlays where the dialog *is* the content.
 *
 * For `bare`, `title` is not used; pass a `#close` slot to override the default
 * close button, or rely on the auto-rendered ghost X in the top-right corner.
 *
 * @example Confirm dialog
 * <NatcaDialog v-model="show" title="Confirm migration" subtitle="Batch #12">
 *   Are you sure you want to migrate <strong>34 accounts</strong>?
 *   <template #actions>
 *     <NatcaButton variant="ghost"   size="md" @click="show = false">Cancel</NatcaButton>
 *     <NatcaButton variant="primary" size="md" @click="confirm">Migrate now</NatcaButton>
 *   </template>
 * </NatcaDialog>
 *
 * @example Danger dialog
 * <NatcaDialog v-model="show" variant="danger" title="Delete account">
 *   This will permanently delete <strong>jason.doss@natca.net</strong>.
 *   <template #actions>
 *     <NatcaButton variant="ghost"  size="md" @click="show = false">Cancel</NatcaButton>
 *     <NatcaButton variant="danger" size="md" @click="del">Delete account</NatcaButton>
 *   </template>
 * </NatcaDialog>
 *
 * @example Bare lightbox
 * <NatcaDialog v-model="show" variant="bare" :max-width="900">
 *   <img :src="logo.url" alt="Logo preview" style="width:100%; display:block;" />
 * </NatcaDialog>
 */
import { computed } from 'vue'
import { VDialog, VIcon } from 'vuetify/components'
import NatcaIconButton from './NatcaIconButton.vue'

const props = withDefaults(defineProps<{
  modelValue: boolean
  /** Not used when variant="bare". */
  title?: string
  subtitle?: string
  icon?: string
  variant?: 'default' | 'danger' | 'bare'
  maxWidth?: number | string
  persistent?: boolean
}>(), {
  variant: 'default',
  maxWidth: 480,
  persistent: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const resolvedIcon = computed(() => {
  if (props.icon) return props.icon
  return props.variant === 'danger' ? 'mdi-alert-octagon' : 'mdi-help-circle'
})

const open = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:modelValue', v),
})

function close() {
  open.value = false
}

defineSlots<{
  default?: () => any
  actions?: () => any
  /** Bare variant only — override the default close button. Receives a `close` fn. */
  close?: (props: { close: () => void }) => any
}>()
</script>

<template>
  <VDialog v-model="open" :max-width="maxWidth" :persistent="persistent">
    <!-- ─────────── Bare variant — chromeless lightbox ─────────── -->
    <div v-if="variant === 'bare'" class="natca-dialog natca-dialog--bare">
      <div class="natca-dialog__bare-close">
        <slot name="close" :close="close">
          <NatcaIconButton
            icon="mdi-close"
            variant="ghost"
            size="sm"
            aria-label="Close"
            @click="close"
          />
        </slot>
      </div>
      <slot />
    </div>

    <!-- ─────────── default / danger — header strip + body + actions ─────────── -->
    <div v-else class="natca-dialog">
      <div class="natca-dialog__header" :class="`natca-dialog__header--${variant}`">
        <div class="natca-dialog__icon">
          <VIcon :icon="resolvedIcon" size="20" />
        </div>
        <div class="natca-dialog__text">
          <h3 class="natca-dialog__title">{{ title }}</h3>
          <p v-if="subtitle" class="natca-dialog__subtitle">{{ subtitle }}</p>
        </div>
      </div>

      <div class="natca-dialog__body">
        <slot />
      </div>

      <div v-if="$slots.actions" class="natca-dialog__actions">
        <slot name="actions" />
      </div>
    </div>
  </VDialog>
</template>

<style scoped>
.natca-dialog {
  background: var(--color-bg-surface);
  border-radius: var(--radius-lg);
  overflow: hidden;
  font-family: var(--font-body);
  box-shadow: var(--shadow-lg);
}

.natca-dialog__header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
}

.natca-dialog__header--default {
  background: var(--natca-navy);
  color: #FFFFFF;
}

.natca-dialog__header--danger {
  background: var(--color-danger);
  color: #FFFFFF;
}

.natca-dialog__icon {
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.9);
  flex-shrink: 0;
}

.natca-dialog__text {
  flex: 1;
  min-width: 0;
}

.natca-dialog__title {
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 700;
  color: #FFFFFF;
  margin: 0;
  line-height: 1.2;
}

.natca-dialog__subtitle {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  margin: 2px 0 0;
  line-height: 1.3;
}

.natca-dialog__body {
  padding: 16px 20px;
  font-size: 13px;
  color: var(--color-text-body);
  line-height: 1.5;
}

.natca-dialog__body :deep(strong) {
  font-weight: 700;
  color: var(--color-text-primary);
}

.natca-dialog__actions {
  padding: 8px 16px 16px;
  display: flex;
  gap: var(--space-2);
  justify-content: flex-end;
  align-items: center;
}

/* ── Bare variant — chromeless container ──────────────────────────────── */
.natca-dialog--bare {
  position: relative;
  padding: 0;
  /* No border / header — the body slot is the entire dialog. The close
     button is absolute-positioned over the content. */
}

.natca-dialog__bare-close {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 2;
  /* Slightly tinted backdrop so the close button stays visible on top of
     dark images or photo content. */
  background: rgba(0, 0, 0, 0.32);
  border-radius: var(--radius-md);
  backdrop-filter: blur(6px);
}

[data-theme="light"] .natca-dialog__bare-close,
.v-theme--natcaLight .natca-dialog__bare-close {
  background: rgba(255, 255, 255, 0.72);
}

/* The close icon itself stays high-contrast against either backdrop. */
.natca-dialog__bare-close :deep(.natca-icon-btn--ghost) {
  color: #FFFFFF;
}
[data-theme="light"] .natca-dialog__bare-close :deep(.natca-icon-btn--ghost),
.v-theme--natcaLight .natca-dialog__bare-close :deep(.natca-icon-btn--ghost) {
  color: var(--color-text-primary);
}
</style>
