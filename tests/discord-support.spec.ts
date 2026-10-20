/**
 * NAT-2230 — NatcaDiscordSupport (topbar action + modal).
 *
 * Measured, not eyeballed:
 *   - the action is the 32px topbar tier on desktop and a 32px icon-only square
 *     at the phone breakpoint, keeps its aria-label, and is clickable;
 *   - it never pushes the shell's own controls off-screen at 390 / 360 / 320px;
 *   - the modal's Join link carries the `inviteUrl` it was given (default and
 *     per-app override), and every outcome renders inline.
 *
 * Run against the playground: `npm run dev`, then
 *   PLAYGROUND_URL=http://localhost:1310 npx playwright test tests/discord-support.spec.ts
 */
import { test, expect } from '@playwright/test'

const BASE = process.env.PLAYGROUND_URL ?? 'http://localhost:1310'
const DEFAULT_INVITE = 'https://discord.gg/FUnnWBHwWy'
const BTN = '[data-testid="discord-support-button"]'

test.describe('NatcaDiscordSupport', () => {
  test('desktop: 32px pill with a visible label', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(`${BASE}/admin?discord=1`)
    const box = await page.locator(BTN).boundingBox()
    expect(box!.height).toBe(32)
    expect((await page.locator(`${BTN} .natca-topbar-action__label`).boundingBox())!.width).toBeGreaterThan(40)
    await expect(page.locator(BTN)).toHaveAttribute('aria-label', /bid-support/)
  })

  for (const width of [390, 360, 320]) {
    test(`phone ${width}px: icon-only, clickable, shell controls stay on-screen`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 })
      await page.goto(`${BASE}/admin?discord=1`)
      const box = await page.locator(BTN).boundingBox()
      expect(box!.width).toBe(32)
      // visually hidden, not removed: still the accessible name
      const label = await page.locator(`${BTN} .natca-topbar-action__label`).boundingBox()
      expect(label!.width).toBeLessThanOrEqual(1)
      await expect(page.locator(BTN)).toHaveAttribute('aria-label', /bid-support/)
      const avatarRight = await page.evaluate(() => {
        const el = document.querySelector('.natca-shell-topbar-trail') as HTMLElement
        return el.getBoundingClientRect().right
      })
      expect(avatarRight).toBeLessThanOrEqual(width)
      await page.locator(BTN).click()
      await expect(page.getByRole('dialog')).toBeVisible()
    })
  }

  test('modal copy: intro, per-channel restriction, join prompt', async ({ page }) => {
    await page.goto(`${BASE}/admin?discord=1`)
    await page.locator(BTN).click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toContainText('#bid-support is a private channel in the national NATCA Discord server. Get answers and support from the ITC and other NATCA members. The channel is restricted to FacReps, VPs, and members helping to run bidding for your local.')
    await expect(dialog).toContainText('Not on the NATCA Discord yet? Join first, then link and verify your Discord account in MyNATCA so the channel can be applied to you.')
  })

  test('join link uses the default invite', async ({ page }) => {
    await page.goto(`${BASE}/admin?discord=1`)
    await page.locator(BTN).click()
    await expect(page.getByRole('link', { name: 'Join the NATCA Discord' })).toHaveAttribute('href', DEFAULT_INVITE)
  })

  test('join link uses a per-app invite when one is given', async ({ page }) => {
    await page.goto(`${BASE}/admin?discord=1&invite=${encodeURIComponent('https://discord.gg/custom123')}`)
    await page.locator(BTN).click()
    await expect(page.getByRole('link', { name: 'Join the NATCA Discord' })).toHaveAttribute('href', 'https://discord.gg/custom123')
  })

  const outcomes: Array<[string, RegExp]> = [
    ['1', /You're in\. Find #bid-support/],
    ['unlinked', /Access saved\. Link and verify/],
    ['noposition', /members who hold a position/],
    ['down', /temporarily unavailable/],
    ['fail', /couldn't complete the request/],
  ]
  for (const [mode, text] of outcomes) {
    test(`outcome ${mode}`, async ({ page }) => {
      await page.goto(`${BASE}/admin?discord=${mode}`)
      await page.locator(BTN).click()
      await page.getByRole('button', { name: 'Request access' }).click()
      await expect(page.getByTestId('discord-support-outcome')).toContainText(text)
    })
  }

  test('a settled grant disables a second click; reopening starts clean', async ({ page }) => {
    await page.goto(`${BASE}/admin?discord=1`)
    await page.locator(BTN).click()
    await page.getByRole('button', { name: 'Request access' }).click()
    await expect(page.getByRole('button', { name: 'Request access' })).toBeDisabled()
    await page.getByRole('button', { name: 'Close' }).click()
    await page.locator(BTN).click()
    await expect(page.getByTestId('discord-support-outcome')).toHaveCount(0)
  })
})
