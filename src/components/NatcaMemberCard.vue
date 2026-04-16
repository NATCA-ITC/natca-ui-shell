<script setup lang="ts">
/**
 * NatcaMemberCard — Reusable member display card wrapping Vuetify components.
 *
 * Shows member name, avatar/initials, facility, region, member type badge,
 * and optional actions. Used across Hub dashboard, BID member lists, DMS directory.
 *
 * Usage:
 *   <NatcaMemberCard
 *     :member="{ name: 'Jason Doss', initials: 'JD', facility: 'ZJX', region: 'Southern', memberType: 'BUE' }"
 *     @click="goToMember"
 *   />
 */
import { computed } from 'vue'
import { VCard, VCardText, VAvatar, VChip, VIcon } from 'vuetify/components'

export interface MemberCardData {
  name: string
  initials: string
  avatarUrl?: string
  facility?: string
  region?: string
  memberType?: string
  memberNumber?: string
  email?: string
}

const props = withDefaults(defineProps<{
  member: MemberCardData
  variant?: 'default' | 'compact' | 'detailed'
  clickable?: boolean
  accentBorder?: boolean
}>(), {
  variant: 'default',
  clickable: false,
  accentBorder: false,
})

defineEmits<{
  click: [member: MemberCardData]
}>()

defineSlots<{
  actions?: () => any
  append?: () => any
}>()

const memberTypeColor = computed(() => {
  switch (props.member.memberType?.toUpperCase()) {
    case 'BUE': return 'info'
    case 'CPC': return 'success'
    case 'DEVELOPMENTAL': case 'DEV': return 'warning'
    case 'STAFF': case 'NATCA STAFF': return 'secondary'
    default: return undefined
  }
})
</script>

<template>
  <VCard
    :class="[
      'natca-member-card',
      `natca-member-card--${variant}`,
      { 'natca-member-card--accent': accentBorder },
    ]"
    :hover="clickable"
    :ripple="clickable"
    @click="clickable ? $emit('click', member) : undefined"
  >
    <VCardText class="natca-member-card__body">
      <!-- Avatar -->
      <VAvatar
        :size="variant === 'compact' ? 28 : 36"
        :color="member.avatarUrl ? undefined : 'primary'"
        class="natca-member-card__avatar"
      >
        <img
          v-if="member.avatarUrl"
          :src="member.avatarUrl"
          :alt="member.name"
        />
        <span v-else class="natca-member-card__initials">{{ member.initials }}</span>
      </VAvatar>

      <!-- Info -->
      <div class="natca-member-card__info">
        <div class="natca-member-card__name">
          {{ member.name }}
          <span v-if="member.memberNumber" class="natca-member-card__member-num">
            #{{ member.memberNumber }}
          </span>
        </div>

        <div v-if="member.facility || member.region" class="natca-member-card__meta">
          <span v-if="member.facility" class="natca-member-card__facility">
            <VIcon icon="mdi-map-marker-outline" size="12" />
            {{ member.facility }}
          </span>
          <span v-if="member.facility && member.region" class="natca-member-card__sep">|</span>
          <span v-if="member.region">{{ member.region }}</span>
        </div>

        <div v-if="variant === 'detailed' && member.email" class="natca-member-card__email">
          {{ member.email }}
        </div>
      </div>

      <!-- Type badge -->
      <VChip
        v-if="member.memberType"
        :color="memberTypeColor"
        size="x-small"
        variant="tonal"
        class="natca-member-card__type"
      >
        {{ member.memberType }}
      </VChip>

      <!-- Append slot (for custom right-side content) -->
      <slot name="append" />
    </VCardText>

    <!-- Actions slot -->
    <div v-if="$slots.actions" class="natca-member-card__actions">
      <slot name="actions" />
    </div>
  </VCard>
</template>

<style scoped>
/* Override Vuetify's white hover overlay on dark theme */
.natca-member-card :deep(.v-card__overlay) {
  display: none;
}
.natca-member-card[clickable]:hover,
.natca-member-card:deep(:hover > .v-card__overlay) {
  display: none;
}

/* Custom hover: subtle border + bg shift instead of white overlay */
.natca-member-card {
  transition: background 150ms, border-color 150ms;
}
.natca-member-card:hover {
  background: var(--overlay-subtle) !important;
  border-color: var(--overlay-active) !important;
}

.natca-member-card--accent {
  border-top: 3px solid rgb(var(--v-theme-primary));
}

.natca-member-card__body {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px !important;
}

.natca-member-card__initials {
  font-family: var(--font-display, 'Barlow', sans-serif);
  font-size: 14px;
  font-weight: 700;
  color: white;
}

.natca-member-card__info {
  flex: 1;
  min-width: 0;
}

.natca-member-card__name {
  font-family: var(--font-display, 'Barlow', sans-serif);
  font-size: 13px;
  font-weight: 700;
  color: rgb(var(--v-theme-on-surface));
  line-height: 1.2;
}

.natca-member-card__member-num {
  font-weight: 400;
  font-size: 12px;
  opacity: 0.5;
  margin-left: 4px;
}

.natca-member-card__meta {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  opacity: 0.6;
  margin-top: 2px;
}

.natca-member-card__facility {
  display: inline-flex;
  align-items: center;
  gap: 3px;
}

.natca-member-card__sep {
  opacity: 0.3;
}

.natca-member-card__email {
  font-size: 12px;
  opacity: 0.5;
  margin-top: 2px;
}

.natca-member-card__type {
  flex-shrink: 0;
}

.natca-member-card__actions {
  padding: 0 12px 8px;
  display: flex;
  gap: 6px;
  justify-content: flex-end;
}

/* Compact variant */
.natca-member-card--compact .natca-member-card__body {
  padding: 6px 10px !important;
  gap: 8px;
}
.natca-member-card--compact .natca-member-card__name {
  font-size: 12px;
}
.natca-member-card--compact .natca-member-card__meta {
  font-size: 11px;
}
</style>
