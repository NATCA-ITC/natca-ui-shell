/**
 * NAT-1986 / NAT-1987 — phone chrome.
 *
 * Measured with bounding rects, never by eye:
 *   - the shell's own topbar controls (theme toggle, avatar / sign-in, search,
 *     notifications) stay fully on-screen and are the topmost element at their
 *     centre (i.e. clickable) with deliberately oversized #toolbar-actions
 *     content, at 390 / 360 / 320px, in both themes;
 *   - the user menu still opens fully below the bar (NAT-335 not regressed);
 *   - NatcaTopBarAction collapses to a 32px icon at the phone breakpoint and
 *     keeps its label as the accessible name;
 *   - the breadcrumb row keeps its right side on-screen and one line tall;
 *   - page content (.natca-page) and the breadcrumb crumbs share one left edge
 *     at 1440 / 1024 / 768 / 600 / 390 / 320px, and (beta.34) so does the
 *     topbar's logo;
 *   - (beta.34) a v-badge overhanging the LAST slot item — BID's bell,
 *     offset-x="-3", "1" and "99+" — is inside the slot region's clip box at
 *     320 / 360 / 390 / 768 / 1024 / 1440px, squeezed or not, and is painted
 *     where it does not meet a shell control, while the shell controls stay
 *     topmost and clickable over their whole box.
 *
 * Run against the playground: `npm run dev`, then
 *   PLAYGROUND_URL=http://localhost:1310 npx playwright test tests/phone-chrome.spec.ts
 */
import { test, expect, type Page } from '@playwright/test'

const BASE = process.env.PLAYGROUND_URL ?? 'http://localhost:1310'

type Rect = { left: number; right: number; top: number; bottom: number; width: number; height: number }

async function rectOf(page: Page, selector: string): Promise<Rect & { hit: boolean }> {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel) as HTMLElement | null
    if (!el) throw new Error(`missing ${sel}`)
    const r = el.getBoundingClientRect()
    const hitEl = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2)
    return {
      left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: r.width, height: r.height,
      hit: !!hitEl && (hitEl === el || el.contains(hitEl)),
    }
  }, selector)
}

/** Width of the slot region vs the extent of what the app put in it. */
async function slotExtent(page: Page): Promise<{ box: number; content: number }> {
  return page.evaluate(() => {
    const el = document.querySelector('.natca-shell-topbar-actions') as HTMLElement
    const kids = Array.from(el.children).map((c) => c.getBoundingClientRect())
    const left = Math.min(...kids.map((r) => r.left))
    const right = Math.max(...kids.map((r) => r.right))
    // Content box, not border box: since beta.34 the region carries an
    // inline-end overhang allowance (padding cancelled by a negative margin)
    // that slot content never occupies.
    const cs = getComputedStyle(el)
    const box = el.getBoundingClientRect().width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)
    return { box, content: right - left }
  })
}

async function expectOnScreen(page: Page, selector: string) {
  const vw = page.viewportSize()!.width
  const r = await rectOf(page, selector)
  expect(r.width, `${selector} rendered`).toBeGreaterThan(0)
  expect(r.left, `${selector} left edge`).toBeGreaterThanOrEqual(0)
  expect(r.right, `${selector} right edge (viewport ${vw})`).toBeLessThanOrEqual(vw)
  expect(r.hit, `${selector} is clickable at its centre`).toBe(true)
}

async function setTheme(page: Page, theme: 'light' | 'dark') {
  const current = await page.evaluate(() =>
    document.querySelector('.natca-shell')?.getAttribute('data-theme'))
  if (current !== theme) {
    await page.click('.natca-shell-topbar-trail .natca-shell-top-icon')
    await expect(page.locator('.natca-shell')).toHaveAttribute('data-theme', theme)
  }
}

const PHONES = [390, 360, 320]
const THEMES = ['dark', 'light'] as const

test.describe('NAT-1986 — shell controls survive oversized slot content', () => {
  for (const route of ['/member', '/admin', '/minimal']) {
    for (const width of PHONES) {
      for (const theme of THEMES) {
        test(`${route} @ ${width}px, ${theme}`, async ({ page }) => {
          await page.setViewportSize({ width, height: 800 })
          await page.goto(`${BASE}${route}?overflow=1`)
          await page.waitForSelector('.natca-shell-topbar-actions', { state: 'attached' }) // may be 0px wide — that is the point
          await setTheme(page, theme)

          // The slot really is oversized — otherwise this proves nothing.
          // (Not scrollWidth: overflow-x: clip is not a scroll container, so
          // scrollWidth == clientWidth however much is clipped.)
          const slot = await slotExtent(page)
          expect(slot.content).toBeGreaterThan(slot.box + 100)

          await expectOnScreen(page, '.natca-shell-topbar-trail .natca-shell-top-icon') // theme toggle
          await expectOnScreen(page, '.natca-shell-avatar')
          await expectOnScreen(page, '.natca-shell-topbar-lead .natca-shell-top-icon') // search
          // Slot content never truncates the app chip (it only gives way to
          // the shell's own controls, e.g. a long app name at 320px).
          if (route === '/member') {
            const chip = await page.evaluate(() => {
              const el = document.querySelector('.natca-shell-chip-label') as HTMLElement
              return { client: el.clientWidth, scroll: el.scrollWidth }
            })
            expect(chip.scroll).toBeLessThanOrEqual(chip.client)
          }
          // …and inside the bar's 12px phone padding, not merely inside the viewport.
          expect((await rectOf(page, '.natca-shell-avatar')).right).toBeLessThanOrEqual(width - 12 + 0.5)

          // No page-level horizontal scroll.
          const scroll = await page.evaluate(() => document.documentElement.scrollWidth)
          expect(scroll).toBeLessThanOrEqual(width)

          // NAT-335: the user menu escapes the bar vertically and is usable.
          await page.click('.natca-shell-avatar')
          const menu = page.locator('.natca-shell-user-menu')
          await expect(menu).toBeVisible()
          await page.waitForTimeout(250) // 150ms enter transition
          const bar = await rectOf(page, '.natca-shell-topbar')
          const m = await rectOf(page, '.natca-shell-user-menu')
          // Hangs well below the 52px bar; the hit-test on Sign Out below
          // proves the overhang is painted and clickable, not clipped.
          expect(m.bottom).toBeGreaterThan(bar.bottom + 60)
          expect(m.left).toBeGreaterThanOrEqual(0)
          expect(m.right).toBeLessThanOrEqual(width)
          await expectOnScreen(page, '.natca-shell-user-menu-signout')
        })
      }
    }
  }

  for (const width of PHONES) {
    test(`guest sign-in CTA @ ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 })
      await page.goto(`${BASE}/member?overflow=1&guest=1`)
      await page.waitForSelector('.natca-shell-signin')
      await expectOnScreen(page, '.natca-shell-signin')
      expect((await rectOf(page, '.natca-shell-signin')).right).toBeLessThanOrEqual(width - 12 + 0.5)
      await expectOnScreen(page, '.natca-shell-topbar-trail .natca-shell-top-icon')
    })
  }
})

test.describe('NAT-1986 — NatcaTopBarAction', () => {
  test('collapses to icon-only at 390px, keeps its accessible name', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 })
    await page.goto(`${BASE}/member`)
    const link = page.getByRole('link', { name: 'Go to BID v5' })
    await expect(link).toBeVisible()
    const box = (await link.boundingBox())!
    expect(Math.round(box.width)).toBe(32)
    const btn = page.getByRole('button', { name: 'Support' })
    await expect(btn).toBeVisible()
    expect(Math.round((await btn.boundingBox())!.width)).toBe(32)
    await expectOnScreen(page, '.natca-shell-avatar')
  })

  test('shows its label at 1280px with ordinary slot content, nothing clipped', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto(`${BASE}/member`)
    const link = page.getByRole('link', { name: 'Go to BID v5' })
    expect((await link.boundingBox())!.width).toBeGreaterThan(60)
    const slot = await slotExtent(page)
    expect(slot.content).toBeGreaterThan(0)
    expect(slot.content).toBeLessThanOrEqual(slot.box + 0.5)
  })
})

test.describe('NAT-1986 — breadcrumb row gives way on the crumb side', () => {
  for (const width of PHONES) {
    test(`/member/page?overflow=1 @ ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 })
      await page.goto(`${BASE}/member/page?overflow=1`)
      await page.waitForSelector('.natca-shell-breadcrumb')
      const row = await rectOf(page, '.natca-shell-breadcrumb-row')
      expect(Math.round(row.height)).toBe(38) // border-box 38px: still one line
      const right = await rectOf(page, '.natca-shell-breadcrumb-right')
      expect(right.right).toBeLessThanOrEqual(width)
      expect(right.left).toBeGreaterThanOrEqual(0)
      const crumbs = await rectOf(page, '.natca-shell-breadcrumb')
      expect(crumbs.right).toBeLessThanOrEqual(right.left)
      // The current page's crumb keeps a visible stub — it never vanishes.
      const current = await rectOf(page, '.natca-shell-breadcrumb .natca-shell-current')
      expect(current.width).toBeGreaterThan(20)
      expect(current.right).toBeLessThanOrEqual(crumbs.right + 0.5)
    })
  }
})

test.describe('NAT-1987 — page content and breadcrumb row share one left edge', () => {
  for (const width of [1440, 1024, 768, 600, 390, 320]) {
    test(`@ ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto(`${BASE}/member/page`)
      await page.waitForSelector('.natca-page .natca-page-header')
      const crumbs = await rectOf(page, '.natca-shell-breadcrumb')
      const header = await rectOf(page, '.natca-page .natca-page-header')
      expect(header.left).toBeCloseTo(crumbs.left, 0)
      expect(header.left).toBe(width <= 768 ? 12 : 24)
    })
  }
})

/** The box overflow-x: clip cuts at: the padding box (border box minus borders). */
async function clipBoxOf(page: Page, selector: string): Promise<{ left: number; right: number }> {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel) as HTMLElement
    const r = el.getBoundingClientRect()
    const cs = getComputedStyle(el)
    return { left: r.left + parseFloat(cs.borderLeftWidth), right: r.right - parseFloat(cs.borderRightWidth) }
  }, selector)
}

/** Is the topmost element at (x, y) inside `selector`? */
async function topmostIn(page: Page, x: number, y: number, selector: string): Promise<boolean> {
  return page.evaluate(([px, py, sel]) => {
    const hit = document.elementFromPoint(px, py)
    return !!hit && !!hit.closest(sel)
  }, [x, y, selector] as [number, number, string])
}

test.describe('beta.34 — slot overhang (a badge) is not clipped; shell controls stay on top', () => {
  // /minimal?lean=1: the bell is the only slot item and the shell drops search
  //   + notifications — the region is NOT squeezed at any width.
  // /member: BID's shape — two NatcaTopBarActions, then the bell. Squeezed at
  //   phone widths (the first action is cut), but the bell is whole: exactly
  //   what BID measured at 320px.
  // /member?overflow=1: hostile content before the bell — squeezed at phones.
  const FIXTURES = [
    { route: '/minimal', extra: '&lean=1', squeezedAt: () => false },
    { route: '/member', extra: '', squeezedAt: () => null },
    { route: '/member', extra: '&overflow=1', squeezedAt: (w: number) => (w <= 390 ? true : null) },
  ]
  for (const { route, extra, squeezedAt } of FIXTURES) {
    for (const badge of ['1', '100'] as const) {
      for (const width of [320, 360, 390, 768, 1024, 1440]) {
        test(`${route}?badge=${badge}${extra} @ ${width}px`, async ({ page }) => {
          await page.setViewportSize({ width, height: 800 })
          await page.goto(`${BASE}${route}?badge=${badge}${extra}`)
          await page.waitForSelector('.natca-shell-topbar-actions .v-badge__badge')
          await expect(page.locator('.v-badge__badge')).toHaveText(badge === '100' ? '99+' : badge)

          // The fixture is in the state it claims — otherwise this proves nothing.
          const slot = await slotExtent(page)
          const squeezed = squeezedAt(width)
          if (squeezed === false) expect(slot.content, 'fixture is not squeezed').toBeLessThanOrEqual(slot.box + 0.5)
          if (squeezed === true) expect(slot.content, 'fixture is squeezed').toBeGreaterThan(slot.box + 0.5)

          // The fixture really overhangs the last item (BID: 4px for "1", 18.4px for "99+").
          const bell = await rectOf(page, '.natca-shell-topbar-actions .playground-bell')
          const b = await rectOf(page, '.natca-shell-topbar-actions .v-badge__badge')
          expect(b.right - bell.right, 'badge overhangs the bell').toBeGreaterThan(badge === '100' ? 15 : 3)

          // Not clipped: the whole badge is inside the region's clip box.
          const clip = await clipBoxOf(page, '.natca-shell-topbar-actions')
          expect(bell.left, 'the last item itself is whole (squeezing cuts from the left)').toBeGreaterThanOrEqual(clip.left - 0.5)
          expect(b.left, 'badge left vs clip box').toBeGreaterThanOrEqual(clip.left - 0.5)
          expect(b.right, 'badge right vs clip box').toBeLessThanOrEqual(clip.right + 0.5)
          expect(b.right, 'badge is on-screen').toBeLessThanOrEqual(width)
          // ...and painted. Overhang wider than the slot->trail gap (6px
          // desktop, 2px phone) runs UNDER the theme toggle by design — the
          // shell's controls stack above the slot — so probe the part of the
          // badge left of the trail: the topmost element there is the bell.
          const trail = await rectOf(page, '.natca-shell-topbar-trail')
          const probeX = (b.left + Math.min(b.right, trail.left)) / 2
          expect(await topmostIn(page, probeX, b.top + b.height / 2, '.playground-bell'), 'badge is painted').toBe(true)

          // Shell controls: on-screen, clickable at their centre, and topmost
          // even at their inline-start edge, which is where an overhang lands.
          for (const sel of ['.natca-shell-topbar-trail .natca-shell-top-icon', '.natca-shell-avatar']) {
            await expectOnScreen(page, sel)
            const r = await rectOf(page, sel)
            expect(await topmostIn(page, r.left + 1.5, r.top + r.height / 2, sel), `${sel} left edge is topmost`).toBe(true)
          }
          expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
        })
      }
    }
  }
})

test.describe('beta.34 — topbar, crumbs and page content share one left edge', () => {
  for (const width of [1440, 1280, 1024, 768, 390, 320]) {
    test(`/member/page @ ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto(`${BASE}/member/page`)
      await page.waitForSelector('.natca-page .natca-page-header')
      const gutter = width <= 768 ? 12 : 24
      const logo = await rectOf(page, '.natca-shell-logo-zone')
      const crumbs = await rectOf(page, '.natca-shell-breadcrumb')
      const header = await rectOf(page, '.natca-page .natca-page-header')
      expect(logo.left).toBeCloseTo(gutter, 0)
      expect(crumbs.left).toBeCloseTo(gutter, 0)
      expect(header.left).toBeCloseTo(gutter, 0)
      // The right edge too: the avatar sits on the same gutter.
      expect((await rectOf(page, '.natca-shell-avatar')).right).toBeCloseTo(width - gutter, 0)
    })
  }
})

test.describe('beta.34 — NatcaPageHeader stacks on the one phone breakpoint', () => {
  // 601-768 is the band that moved (NAT-1335 used 600px).
  for (const [width, stacked] of [[768, true], [700, true], [601, true], [769, false]] as const) {
    test(`@ ${width}px ${stacked ? 'stacks' : 'stays in a row'}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto(`${BASE}/member/page`)
      await page.waitForSelector('.natca-page-header__actions')
      const dir = await page.evaluate(() =>
        getComputedStyle(document.querySelector('.natca-page-header') as HTMLElement).flexDirection)
      expect(dir).toBe(stacked ? 'column' : 'row')
      const title = await rectOf(page, '.natca-page-header__text')
      const actions = await rectOf(page, '.natca-page-header__actions')
      if (stacked) expect(actions.top).toBeGreaterThanOrEqual(title.bottom)
      else expect(actions.left).toBeGreaterThan(title.left)
    })
  }
})
