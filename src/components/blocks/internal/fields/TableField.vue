<script setup lang="ts">
/** Editable grid behind the `table` field type. */
import { computed } from 'vue'
import type { NatcaBlockTableValue } from '../../../../types/blocks'
import NatcaButton from '../../../NatcaButton.vue'
import NatcaIconButton from '../../../NatcaIconButton.vue'

const props = withDefaults(defineProps<{
  modelValue?: NatcaBlockTableValue
  label?: string
  help?: string
}>(), {
  label: 'Table',
})

const emit = defineEmits<{ 'update:modelValue': [value: NatcaBlockTableValue] }>()

const columns = computed(() => props.modelValue?.columns ?? [])
const rows = computed(() => props.modelValue?.rows ?? [])

function emitValue(next: Partial<NatcaBlockTableValue>) {
  emit('update:modelValue', {
    columns: next.columns ?? columns.value,
    rows: next.rows ?? rows.value,
  })
}

/** Every row is padded to the column count — a ragged table renders as holes. */
function normalizedRows(width: number, source = rows.value): string[][] {
  return source.map((row) => {
    const next = row.slice(0, width)
    while (next.length < width) next.push('')
    return next
  })
}

function setHeader(index: number, value: string) {
  const nextColumns = [...columns.value]
  nextColumns[index] = value
  emitValue({ columns: nextColumns })
}

function setCell(rowIndex: number, colIndex: number, value: string) {
  const nextRows = rows.value.map((row, i) => {
    if (i !== rowIndex) return row
    const next = [...row]
    next[colIndex] = value
    return next
  })
  emitValue({ rows: nextRows })
}

function addColumn() {
  const nextColumns = [...columns.value, `Column ${columns.value.length + 1}`]
  emitValue({ columns: nextColumns, rows: normalizedRows(nextColumns.length) })
}

function removeColumn(index: number) {
  if (columns.value.length <= 1) return
  emitValue({
    columns: columns.value.filter((_, i) => i !== index),
    rows: rows.value.map((row) => row.filter((_, i) => i !== index)),
  })
}

function addRow() {
  emitValue({ rows: [...rows.value, Array(columns.value.length).fill('')] })
}

function removeRow(index: number) {
  emitValue({ rows: rows.value.filter((_, i) => i !== index) })
}

function moveRow(index: number, delta: number) {
  const target = index + delta
  if (target < 0 || target >= rows.value.length) return
  const next = [...rows.value]
  ;[next[index], next[target]] = [next[target], next[index]]
  emitValue({ rows: next })
}
</script>

<template>
  <div class="natca-table-field">
    <p v-if="label" class="natca-table-field__label">{{ label }}</p>

    <div class="natca-table-field__scroll">
      <table>
        <thead>
          <tr>
            <th v-for="(header, ci) in columns" :key="ci">
              <div class="natca-table-field__header-cell">
                <input
                  class="natca-table-field__input natca-table-field__input--header"
                  :value="header"
                  :aria-label="`Column ${ci + 1} name`"
                  @input="setHeader(ci, ($event.target as HTMLInputElement).value)"
                />
                <NatcaIconButton
                  variant="ghost" size="sm" icon="mdi-close"
                  :aria-label="`Remove column ${ci + 1}`"
                  :disabled="columns.length <= 1"
                  @click="removeColumn(ci)"
                />
              </div>
            </th>
            <th class="natca-table-field__gutter" aria-hidden="true" />
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, ri) in rows" :key="ri">
            <td v-for="(cell, ci) in columns" :key="ci">
              <input
                class="natca-table-field__input"
                :value="row[ci] ?? ''"
                :aria-label="`Row ${ri + 1}, ${columns[ci]}`"
                @input="setCell(ri, ci, ($event.target as HTMLInputElement).value)"
              />
            </td>
            <td class="natca-table-field__gutter">
              <NatcaIconButton
                variant="ghost" size="sm" icon="mdi-arrow-up"
                aria-label="Move row up" :disabled="ri === 0" @click="moveRow(ri, -1)"
              />
              <NatcaIconButton
                variant="ghost" size="sm" icon="mdi-arrow-down"
                aria-label="Move row down" :disabled="ri === rows.length - 1" @click="moveRow(ri, 1)"
              />
              <NatcaIconButton
                variant="danger" size="sm" icon="mdi-close"
                aria-label="Remove row" @click="removeRow(ri)"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="natca-table-field__actions">
      <NatcaButton variant="secondary" size="sm" @click="addRow">Add row</NatcaButton>
      <NatcaButton variant="secondary" size="sm" @click="addColumn">Add column</NatcaButton>
    </div>

    <p v-if="help" class="natca-table-field__help">{{ help }}</p>
  </div>
</template>

<style scoped>
.natca-table-field { display: flex; flex-direction: column; gap: 8px; }

.natca-table-field__label {
  font-size: var(--text-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--color-text-muted);
  margin: 0;
}

.natca-table-field__scroll {
  overflow-x: auto;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

table { border-collapse: collapse; width: 100%; }

th, td {
  border-bottom: 1px solid var(--color-border-light);
  border-right: 1px solid var(--color-border-light);
  padding: 0;
  vertical-align: middle;
}

th:last-child, td:last-child { border-right: 0; }
tbody tr:last-child td { border-bottom: 0; }

th { background: var(--color-shell-elevated); }

.natca-table-field__header-cell { display: flex; align-items: center; }

.natca-table-field__input {
  width: 100%;
  min-width: 120px;
  border: 0;
  background: transparent;
  padding: 7px 10px;
  font-size: var(--text-sm);
  font-family: var(--font-body);
  color: var(--color-text-body);
  outline: none;
}

.natca-table-field__input:focus {
  background: rgba(var(--natca-red-rgb), 0.06);
  box-shadow: inset 0 0 0 1px var(--natca-red);
}

.natca-table-field__input--header { font-weight: 700; }

.natca-table-field__gutter {
  width: 1%;
  white-space: nowrap;
  padding: 0 4px;
  background: var(--color-shell-elevated);
}

.natca-table-field__actions { display: flex; gap: 8px; }

.natca-table-field__help { font-size: var(--text-xs); color: var(--color-text-muted); margin: 0; }
</style>
