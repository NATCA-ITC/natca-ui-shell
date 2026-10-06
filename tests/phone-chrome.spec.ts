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
 *     at 1440 / 1024 / 768 / 600 / 390 / 320px.
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
    return { box: el.getBoundingClientRect().width, content: right - left }
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
