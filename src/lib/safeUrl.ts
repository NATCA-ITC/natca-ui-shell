/**
 * Scheme allow-list for author-entered URLs.
 *
 * Block documents are written by facility admins and rendered to every member,
 * so an `href` is an injection surface: `javascript:` and `data:` URLs execute
 * on click. This is the single rule the link-list block, the rich-text link
 * dialog and the `url` field type all share. Vue-free so a backend can port it
 * (BID's PHP sanitizer must agree with this list).
 *
 * Allowed: http(s), mailto, tel, and same-origin paths (`/…`, `./…`, `../…`,
 * `#…`, `?…`). Everything else — including protocol-relative `//host` and any
 * other scheme — is rejected.
 */
export function isSafeBlockUrl(url: unknown): url is string {
  if (typeof url !== 'string') return false
  const value = url.trim()
  if (!value) return false
  if (/^(https?:|mailto:|tel:)/i.test(value)) return true
  if (value.startsWith('//')) return false
  // A relative path: nothing before the first "/" or "?" or "#" may look like a scheme.
  if (/^(\/|\.\/|\.\.\/|#|\?)/.test(value)) return true
  return !/^[a-z][a-z0-9+.-]*:/i.test(value) && !value.includes(':')
}

/** True for absolute http(s) URLs — the ones that open in a new tab. */
export function isExternalUrl(url: string): boolean {
  return /^https?:\/\//i.test(url)
}
