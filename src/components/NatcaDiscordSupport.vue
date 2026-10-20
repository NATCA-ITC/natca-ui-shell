<script setup lang="ts">
/**
 * NatcaDiscordSupport — a topbar "Discord Support" action that opens a modal
 * with the join link and a "Request access" button for one private support
 * channel in the NATCA national Discord (NAT-2230).
 *
 * The shell owns the chrome and the copy; the app owns the call. `requestAccess`
 * is the app's own request to its backend (which forwards the member's token to
 * the Discord bot), and resolves `{ linked, granted }`. The modal reports the
 * four outcomes inline, where the member can act on them, rather than in a toast
 * that vanishes.
 *
 * Put it in `#toolbar-actions`, or hand NatcaShell a `discordSupport` object and
 * it renders this for you. Either way the pill collapses to the mark alone at
 * the phone breakpoint; the label stays the accessible name.
 *

 * `restriction` is the one sentence about who may join, because it differs per channel:
 * "The channel is restricted to FacReps, VPs, and members helping to run bidding for your
 * local." Everything else in the modal is the same for every support channel.
 *
 * `inviteUrl` is per app on purpose: the default is the shared non-expiring
 * invite, but an app that wants its own (separate analytics, a different server)
 * passes it.
 *
 * @example
 * <NatcaShell …>
 *   <template #toolbar-actions>
 *     <NatcaDiscordSupport channel="pay-support" :request-access="api.requestDiscordSupportAccess" />
 *   </template>
 * </NatcaShell>
 *
 * @example Let the shell render it
 * <NatcaShell … :discord-support="{ channel: 'bid-support', requestAccess }" />
 */
import { computed, ref, watch } from 'vue'
import NatcaDialog from './NatcaDialog.vue'
import NatcaButton from './NatcaButton.vue'
import NatcaDiscordMark from './NatcaDiscordMark.vue'
import { VAlert } from 'vuetify/components'
import {
  NATCA_DISCORD_INVITE_URL,
  type NatcaDiscordSupportOutcome,
  type NatcaDiscordSupportProps,
} from '../types/discord'

const props = withDefaults(defineProps<NatcaDiscordSupportProps>(), {
  inviteUrl: NATCA_DISCORD_INVITE_URL,
  label: 'Discord Support',
  restriction: 'The channel is restricted to members who hold a position.',
})

const open = ref(false)
const requesting = ref(false)
const outcome = ref<NatcaDiscordSupportOutcome | null>(null)

const channelTag = computed(() => `#${props.channel}`)

const OUTCOMES = computed(() => ({
  in: { type: 'success', message: `You're in. Find ${channelTag.value} under the ITC category in the NATCA national Discord.` },
  unlinked: { type: 'warning', message: `Access saved. Link and verify your Discord account in MyNATCA, and ${channelTag.value} (under ITC) will appear once you do.` },
  noPosition: { type: 'info', message: `Access to ${channelTag.value} is for members who hold a position. If you have just taken one, it can take a day to show here.` },
  unavailable: { type: 'error', message: 'Discord support access is temporarily unavailable. Please try again later.' },
  failed: { type: 'error', message: "We couldn't complete the request. Please try again in a moment." },
}) satisfies Record<string, NatcaDiscordSupportOutcome>)

// A settled grant needs no second click; everything else may be retried. A flag, not
// an identity check on `outcome`: a ref hands back a reactive proxy, never the object.
const done = ref(false)

// Each opening starts clean, so an old outcome is never read as this visit's answer.
watch(open, (isOpen) => { if (isOpen) { outcome.value = null; done.value = false } })

/** The status of whatever the app's HTTP client threw, whichever shape it uses. */
function statusOf(error: unknown): number | undefined {
  const e = error as { status?: number; response?: { status?: number } } | null
  return e?.status ?? e?.response?.status
}

async function request() {
  requesting.value = true
  outcome.value = null
  try {
    const { linked, granted } = await props.requestAccess()
    done.value = granted
    if (granted && linked) outcome.value = OUTCOMES.value.in
    else if (granted) outcome.value = OUTCOMES.value.unlinked
    else outcome.value = OUTCOMES.value.unavailable
  } catch (error) {
    outcome.value = statusOf(error) === 403 ? OUTCOMES.value.noPosition : OUTCOMES.value.failed
  } finally {
    requesting.value = false
  }
}
</script>

<template>
  <button
    type="button"
    class="natca-topbar-action natca-topbar-action--discord"
    :title="`Get access to the ${channelTag} channel in the NATCA national Discord`"
    :aria-label="`${label}: open the ${channelTag} access request`"
    data-testid="discord-support-button"
    @click="open = true"
  >
    <NatcaDiscordMark class="natca-topbar-action__icon natca-discord-mark" />
    <span class="natca-topbar-action__label">{{ label }}</span>
  </button>

  <NatcaDialog
    v-model="open"
    title="Discord support"
    :subtitle="`${channelTag} in the NATCA national Discord`"
    icon="mdi-lifebuoy"
    :max-width="520"
  >
    <p class="natca-discord-copy">
      <strong>{{ channelTag }}</strong> is a private channel in the national NATCA Discord server. Get answers
      and support from the ITC and other NATCA members. {{ restriction }}
    </p>
    <p class="natca-discord-copy">
      Not on the NATCA Discord yet? Join first, then link and verify your Discord account in MyNATCA so
      the channel can be applied to you.
    </p>

    <VAlert v-if="outcome" :type="outcome.type" :icon="false" class="mt-3" data-testid="discord-support-outcome">
      {{ outcome.message }}
    </VAlert>

    <template #actions>
      <div class="natca-discord-actions">
        <NatcaButton class="natca-discord-actions__join" variant="secondary" size="md" :href="inviteUrl" target="_blank" rel="noopener">
          Join the NATCA Discord
        </NatcaButton>
        <NatcaButton class="natca-discord-actions__close" variant="ghost" size="md" @click="open = false">Close</NatcaButton>
        <NatcaButton variant="primary" size="md" :loading="requesting" :disabled="done" @click="request">
          Request access
        </NatcaButton>
      </div>
    </template>
  </NatcaDialog>
</template>

<style scoped>
.natca-discord-copy { margin: 0 0 var(--space-3); font-size: 13px; line-height: 1.5; }
.natca-discord-mark { width: 14px; height: 14px; }
.natca-discord-actions { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-2); width: 100%; }
.natca-discord-actions__close { margin-left: auto; }
/* On a phone the three buttons do not fit one row (Join alone is ~190px of a 340px card):
   Join takes its own full-width row above Close and Request access. */
@media (max-width: 600px) {
  .natca-discord-actions__join { flex: 1 1 100%; }
  .natca-discord-actions__close { margin-left: auto; }
}
</style>
