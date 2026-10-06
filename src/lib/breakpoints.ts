/**
 * The shell's ONE phone breakpoint (NAT-1986 / NAT-1987).
 *
 * At `max-width: 768px` the shell hides the sidebar, tightens its chrome,
 * drops the page gutter (`--natca-page-gutter`) from 24px to 12px and collapses
 * `NatcaTopBarAction` to icon-only. Apps that need the same switch in JS (or in
 * their own media queries) use this value rather than inventing another one.
 *
 * Mirrors `--natca-phone-breakpoint` in shell.css. CSS media conditions cannot
 * read custom properties, so the two must be changed together.
 */
export const NATCA_PHONE_BREAKPOINT = 768

/** `window.matchMedia(NATCA_PHONE_MEDIA_QUERY).matches` is true on phones. */
export const NATCA_PHONE_MEDIA_QUERY = `(max-width: ${NATCA_PHONE_BREAKPOINT}px)`
