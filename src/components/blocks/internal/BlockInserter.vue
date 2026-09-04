<script setup lang="ts">
/** The "+" menu — every registered block, app blocks included, in one list. */
import { ref } from 'vue'
import { VMenu, VList, VListItem, VListItemTitle, VListItemSubtitle } from 'vuetify/components'
import type { NatcaBlockDefinition } from '../../../types/blocks'
import NatcaButton from '../../NatcaButton.vue'

defineProps<{ definitions: NatcaBlockDefinition<any>[] }>()
const emit = defineEmits<{ select: [type: string] }>()

const open = ref(false)

function choose(type: string) {
  open.value = false
  emit('select', type)
}
</script>

<template>
  <VMenu v-model="open" :close-on-content-click="false" location="bottom start">
    <template #activator="{ props: activator }">
      <NatcaButton v-bind="activator" variant="ghost" size="sm" block>+ Add block</NatcaButton>
    </template>

    <VList class="natca-block-inserter" density="compact">
      <VListItem
        v-for="definition in definitions"
        :key="definition.type"
        :prepend-icon="definition.icon"
        @click="choose(definition.type)"
      >
        <VListItemTitle>{{ definition.label }}</VListItemTitle>
        <VListItemSubtitle v-if="definition.description">{{ definition.description }}</VListItemSubtitle>
      </VListItem>
    </VList>
  </VMenu>
</template>

<style scoped>
.natca-block-inserter { max-width: 300px; }
</style>
