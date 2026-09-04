<script setup lang="ts">
/**
 * One generated config input. Config forms are generated from a block's
 * propsSchema — no block ever hand-writes its own form, which is what keeps a
 * new block cheap to add.
 */
import { computed, defineAsyncComponent } from 'vue'
import { VTextField, VTextarea, VSelect, VSwitch } from 'vuetify/components'
import type { NatcaBlockField, NatcaBlockTableValue } from '../../../../types/blocks'
import TableField from './TableField.vue'
import ListField from './ListField.vue'

/** TipTap only loads when an author actually opens a rich-text field. */
const RichTextField = defineAsyncComponent(() => import('./RichTextField.vue'))

const props = defineProps<{
  field: NatcaBlockField
  modelValue: unknown
}>()

const emit = defineEmits<{ 'update:modelValue': [value: unknown] }>()

const value = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const selectItems = computed(() =>
  props.field.type === 'select' ? props.field.options.map((o) => ({ title: o.label, value: o.value })) : [],
)
</script>

<template>
  <VTextField
    v-if="field.type === 'text' || field.type === 'url'"
    v-model="value"
    :label="field.label"
    :placeholder="(field as any).placeholder"
    :hint="field.help"
    :persistent-hint="!!field.help"
    :type="field.type === 'url' ? 'url' : 'text'"
  />

  <VTextField
    v-else-if="field.type === 'number'"
    v-model.number="value"
    :label="field.label"
    :hint="field.help"
    :persistent-hint="!!field.help"
    type="number"
  />

  <VTextarea
    v-else-if="field.type === 'textarea'"
    v-model="value"
    :label="field.label"
    :placeholder="(field as any).placeholder"
    :hint="field.help"
    :persistent-hint="!!field.help"
    rows="3"
    auto-grow
  />

  <VSelect
    v-else-if="field.type === 'select'"
    v-model="value"
    :label="field.label"
    :items="selectItems"
    :hint="field.help"
    :persistent-hint="!!field.help"
  />

  <VSwitch
    v-else-if="field.type === 'boolean'"
    v-model="value"
    :label="field.label"
    :hint="field.help"
    :persistent-hint="!!field.help"
    color="primary"
  />

  <RichTextField
    v-else-if="field.type === 'richText'"
    :model-value="(value as string | undefined)"
    :label="field.label"
    :help="field.help"
    @update:model-value="value = $event"
  />

  <TableField
    v-else-if="field.type === 'table'"
    :model-value="(value as NatcaBlockTableValue | undefined)"
    :label="field.label"
    :help="field.help"
    @update:model-value="value = $event"
  />

  <ListField
    v-else-if="field.type === 'list'"
    :field="field"
    :model-value="value as any"
    @update:model-value="value = $event"
  />
</template>
