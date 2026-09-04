<script setup lang="ts">
/**
 * Table — the block this whole engine was asked for.
 *
 * Two things a table has to get right on a phone, and neither is optional:
 * it must never widen the page (the body scrolls horizontally, the table does
 * not), and below --natca-content-stack-width it stacks into labelled rows so a
 * three-column table is still readable at 390px.
 */
import { computed } from 'vue'
import type { NatcaBlockTableValue } from '../types/blocks'

const props = withDefaults(defineProps<{
  caption?: string
  data?: NatcaBlockTableValue
  /** Treat the first data row as a header instead of the declared column names. */
  firstRowHeader?: boolean
}>(), {
  caption: '',
  firstRowHeader: false,
})

const columns = computed(() => props.data?.columns ?? [])
const allRows = computed(() => props.data?.rows ?? [])

const headers = computed(() =>
  props.firstRowHeader && allRows.value.length ? allRows.value[0] : columns.value,
)
const bodyRows = computed(() =>
  props.firstRowHeader ? allRows.value.slice(1) : allRows.value,
)

const isEmpty = computed(() => headers.value.length === 0 && bodyRows.value.length === 0)
</script>

<template>
  <div v-if="!isEmpty" class="natca-block-table">
    <p v-if="caption" class="natca-block-table__caption">{{ caption }}</p>
    <div class="natca-block-table__scroll">
      <table>
        <thead v-if="headers.length">
          <tr>
            <th v-for="(header, i) in headers" :key="i" scope="col">{{ header }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, ri) in bodyRows" :key="ri">
            <td
              v-for="(cell, ci) in row"
              :key="ci"
              :data-label="headers[ci] || ''"
            >{{ cell }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.natca-block-table__caption {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  margin: 0 0 6px;
}

/* The scroll container, not the table, owns the overflow — otherwise a wide
   table pushes the whole page sideways on mobile. */
.natca-block-table__scroll {
  overflow-x: auto;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--text-sm);
  font-family: var(--font-body);
}

th,
td {
  text-align: left;
  padding: 8px 12px;
  border-bottom: 1px solid var(--color-border-light);
  color: var(--color-text-body);
  vertical-align: top;
}

th {
  font-weight: 700;
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--color-text-muted);
  background: var(--color-shell-elevated);
  white-space: nowrap;
}

tbody tr:last-child td { border-bottom: 0; }

/* Stack mode — one card per row, each cell labelled by its column. */
@media (max-width: 900px) {
  .natca-block-table__scroll { border: 0; border-radius: 0; overflow-x: visible; }
  table, thead, tbody, tr, th, td { display: block; }

  thead { display: none; }

  tbody tr {
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    margin-bottom: 8px;
    padding: 4px 0;
  }

  tbody td {
    border-bottom: 1px solid var(--color-border-light);
    display: flex;
    gap: 12px;
    justify-content: space-between;
    align-items: baseline;
    padding: 6px 12px;
  }

  tbody td:last-child { border-bottom: 0; }

  tbody td[data-label]:not([data-label=''])::before {
    content: attr(data-label);
    flex-shrink: 0;
    font-size: var(--text-xs);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    color: var(--color-text-muted);
  }
}
</style>
