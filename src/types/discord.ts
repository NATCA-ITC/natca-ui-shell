/**
 * NatcaDiscordSupport types (NAT-2230).
 */

/**
 * The shared, non-expiring invite to the NATCA national Discord (public, so
 * safe to ship). Apps that want their own pass `inviteUrl`.
 */
export const NATCA_DISCORD_INVITE_URL = 'https://discord.gg/FUnnWBHwWy'

export interface NatcaDiscordSupportOutcome {
  type: 'success' | 'warning' | 'info' | 'error'
  message: string
}

export interface NatcaDiscordSupportProps {
  /** The private support channel, without the `#`: "pay-support". */
  channel: string
  /**
   * The app's own request for access. It should forward the member's token to
   * the Discord bot and resolve `{ linked, granted }`. A thrown error with
   * status 403 reads as "members who hold a position only"; anything else as
   * a generic failure.
   */
  requestAccess: () => Promise<{ linked: boolean; granted: boolean }>
  /** Discord server invite. Defaults to {@link NATCA_DISCORD_INVITE_URL}; set it per app to use a different one. */
  inviteUrl?: string
  /**
   * Who the channel is for, as one sentence ending the intro paragraph. Defaults to
   * "The channel is restricted to members who hold a position."
   */
  restriction?: string
  /** Topbar label. Defaults to "Discord Support". */
  label?: string
}
