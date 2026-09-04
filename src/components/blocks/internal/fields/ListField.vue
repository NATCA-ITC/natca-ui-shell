<script setup lang="ts">
/** Repeating group — the `list` field type. Rows are shaped by `field.item`. */
import { computed } from 'vue'
import { VTextField } from 'vuetify/components'
import type { NatcaBlockField } from '../../../../types/blocks'
import NatcaButton from '../../../NatcaButton.vue'
import NatcaIconButton from '../../../NatcaIconButton.vue'

const props = defineProps<{
  field: Extract<NatcaBlockField, { type: 'list' }>
  modelValue?: Record<string, unknown>[]
}>()

const emit = defineEmits<{ 'update:modelValue': [value: Record<string, unknown>[]] }>()

const rows = computed(() => props.modelValue ?? [])

function emitRows(next: Record<string, unknown>[]) {
  emit('update:modelValue', next)
}

function setCell(rowIndex: number, key: string, value: unknown) {
  emitRows(rows.value.map((row, i) => (i === rowIndex ? { ...row, [key]: value } : row)))
}

function addRow() {
  emitRows([...rows.value, Object.fromEntries(props.field.item.map((f) => [f.key, '']))])
}

function removeRow(index: number) {
  emitRows(rows.value.filter((_, i) => i !== index))
}

function move(index: number, delta: number) {
  const next = [...rows.value]
  const target = index + delta
  if (target < 0 || target >= next.length) return
  ;[next[index], next[target]] = [next[target], next[index]]
  emitRows(next)
}
</script>

<template>
  <div class="natca-list-field">
    <p class="natca-list-field__label">{{ field.label }}</p>

    <div v-for="(row, i) in rows" :key="i" class="natca-list-field__row">
      <div class="natca-list-field__inputs">
        <VTextField
          v-for="item in field.item"
          :key="item.key"
          :model-value="row[item.key] as string"
          :label="item.label"
          :placeholder="(item as any).placeholder"
          @update:model-value="setCell(i, item.key, $event)"
        />
      </div>
      <div class="natca-list-field__actions">
        <NatcaIconButton
          variant="ghost" size="sm" icon="mdi-arrow-up"
          aria-label="Move up" :disabled="i === 0" @click="move(i, -1)"
        />
        <NatcaIconButton
          variant="ghost" size="sm" icon="mdi-arrow-down"
          aria-label="Move down" :disabled="i === rows.length - 1" @click="move(i, 1)"
        />
        <NatcaIconButton
          variant="danger" size="sm" icon="mdi-close"
          aria-label="Remove" @click="removeRow(i)"
        />
      </div>
    </div>

    <NatcaButton variant="secondary" size="sm" @click="addRow">
      {{ field.addLabel || 'Add row' }}
    </NatcaButton>
  </div>
</template>

<style scoped>
.natca-list-field { display: flex; flex-direction: column; gap: 8px; align-items: flex-start; }

.natca-list-field__label {
  font-size: var(--text-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--color-text-muted);
  margin: 0;
}

.natca-list-field__row {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  width: 100%;
  padding: 8px;
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
}

.natca-list-field__inputs { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; }
.natca-list-field__actions { display: flex; gap: 2px; padding-top: 4px; }
</style>
