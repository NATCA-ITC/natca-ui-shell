import { test } from '@playwright/test'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const BASE = 'http://localhost:1310'
const OUT = resolve(__dirname, '../docs/screenshots')

test.describe('UI Shell variant screenshots (NAT-306)', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('admin variant — sidebar + tabs + breadcrumbs', async ({ page }) => {
    await page.goto(`${BASE}/admin/facilities/zjx`)
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(800)
    await page.screenshot({ path: `${OUT}/admin-variant.png`, fullPage: false })
  })

  test('member variant — tabs + breadcrumbs, no sidebar', async ({ page }) => {
    await page.goto(`${BASE}/member`)
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(800)
    await page.screenshot({ path: `${OUT}/member-variant.png`, fullPage: false })
  })

  test('minimal variant — tabs only', async ({ page }) => {
    await page.goto(`${BASE}/minimal`)
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(800)
    await page.screenshot({ path: `${OUT}/minimal-variant.png`, fullPage: false })
  })

  test('tab nav switcher dropdown open (NAT-304)', async ({ page }) => {
    await page.goto(`${BASE}/member/area/south`)
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)
    const switcher = page.locator('.natca-shell-tab-switcher').first()
    await switcher.click()
    await page.waitForTimeout(400)
    await page.screenshot({ path: `${OUT}/tabnav-switcher-open.png`, fullPage: false })
  })

  test('tab nav More dropdown overflow', async ({ page }) => {
    await page.setViewportSize({ width: 900, height: 700 })
    await page.goto(`${BASE}/admin`)
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(800)
    const more = page.locator('button', { hasText: 'More' }).first()
    if (await more.count()) {
      await more.click()
      await page.waitForTimeout(400)
    }
    await page.screenshot({ path: `${OUT}/tabnav-more-open.png`, fullPage: false })
  })
})
