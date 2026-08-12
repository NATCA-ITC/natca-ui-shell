import type { NatcaApp } from '../types'

/**
 * Canonical NATCA app registry — production URLs baked in so consuming apps
 * don't each hardcode (and get wrong) their own list.
 *
 * Motivation: NAT-825. The app switcher used to be app-owned — every app
 * hardcoded its own `natcaApps` array. BID and GATS both shipped the same bug:
 * dead *relative* URLs (`/bid`, `/pay`) that 404'd within the current origin,
 * plus DMS wrongly included. This registry is the single source of truth;
 * `NatcaShell` defaults its `apps` prop to it when the consumer omits it, so a
 * bare `<NatcaShell app-id="gats" …>` gets a correct, fully-linked switcher for
 * free.
 *
 * DMS is `hidden: true` until it launches — the switcher filters hidden apps.
 * When DMS goes live, drop the flag here (one edit) and every app picks it up
 * on their next ui-shell bump.
 */
export const natcaApps: NatcaApp[] = [
  { id: 'mn',   name: 'MyNATCA', icon: 'mdi-account-group',   url: 'https://my.natca.org',   description: 'Member Portal' },
  { id: 'bid',  name: 'BID',     icon: 'mdi-swap-horizontal', url: 'https://bid.natca.org',  description: 'Facility Bids' },
  { id: 'pay',  name: 'Pay',     icon: 'mdi-currency-usd',    url: 'https://pay.natca.org',  description: 'PayChecker' },
  { id: 'gats', name: 'GATS',    icon: 'mdi-gavel',           url: 'https://gats.natca.org', description: 'Case Tracking' },
  { id: 'dms',  name: 'DMS',     icon: 'mdi-file-document',   url: 'https://dms.natca.org',  description: 'Document Management', hidden: true },
]
