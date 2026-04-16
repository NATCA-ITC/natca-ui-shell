import { test } from '@playwright/test'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const BASE = 'http://localhost:1310'
const SCREENSHOTS = resolve(__dirname, '../TEMP/visual-audit')

test.describe('Playground Design Standards Verification', () => {
  test('design-standards-dark', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto(`${BASE}/admin/design-standards`)
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)
    await page.screenshot({ path: `${SCREENSHOTS}/playground-ds-dark-full.png`, fullPage: true })

    // Screenshot key sections
    const sections = ['Button Tiers', 'Cards', 'Data Table', 'Forms', 'Alerts', 'Chips', 'Tabs', 'States', 'Annotations']
    for (const name of sections) {
      const section = page.locator(`section:has(h3:text("${name}"))`)
      if (await section.count() > 0) {
        await section.first().screenshot({
          path: `${SCREENSHOTS}/playground-ds-dark-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`
        })
      }
    }
  })

  test('design-standards-light', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    // Set localStorage before navigating so the theme initializes as light
    await page.goto(`${BASE}/admin/design-standards`)
    await page.evaluate(() => localStorage.setItem('natca-theme', 'light'))
    await page.reload()
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)

    await page.screenshot({ path: `${SCREENSHOTS}/playground-ds-light-full.png`, fullPage: true })

    const sections = ['Button Tiers', 'Cards', 'Data Table', 'Alerts', 'States', 'Annotations']
    for (const name of sections) {
      const section = page.locator(`section:has(h3:text("${name}"))`)
      if (await section.count() > 0) {
        await section.first().screenshot({
          path: `${SCREENSHOTS}/playground-ds-light-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`
        })
      }
    }
  })

  test('topbar-theme-toggle', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto(`${BASE}/admin/design-standards`)
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)

    // Screenshot topbar
    const topbar = page.locator('.natca-shell-topbar')
    await topbar.screenshot({ path: `${SCREENSHOTS}/playground-topbar-dark.png` })

    // Toggle theme
    const toggle = page.locator('button[aria-label="Switch to light theme"]')
    if (await toggle.count() > 0) {
      await toggle.click()
      await page.waitForTimeout(500)
      await topbar.screenshot({ path: `${SCREENSHOTS}/playground-topbar-light.png` })
    }
  })
})
