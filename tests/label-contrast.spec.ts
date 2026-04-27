import { test } from '@playwright/test'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const BASE = 'http://localhost:1310'
const OUT = resolve(__dirname, '../docs/screenshots')

/**
 * NAT-307 — verify form-field labels are readable in both themes.
 *
 * Regression check: $label-opacity must stay 1 in src/scss/settings.scss.
 * If a future change reverts to the Vuetify default (var(--v-medium-emphasis-opacity)),
 * the rendered opacity drops to 0.7/0.87 and labels merge with the outline.
 */
test.describe('NAT-307 — form field label contrast', () => {
  test.use({ viewport: { width: 1200, height: 900 } })

  for (const theme of ['light', 'dark'] as const) {
    test(`design-standards page renders fields with full-opacity labels (${theme})`, async ({ page, context }) => {
      // Playground reads localStorage 'natca-theme' on boot (see playground/main.ts).
      // Seed it before page load to render directly in the right theme.
      await context.addInitScript((t) => {
        localStorage.setItem('natca-theme', t)
      }, theme)

      await page.goto(`${BASE}/admin/design-standards`)
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(400)

      const label = page.locator('.v-field-label').first()
      await label.scrollIntoViewIfNeeded()
      await page.waitForTimeout(200)

      // Floating label opacity must be exactly 1 (not 0.7 / 0.87).
      const opacity = await label.evaluate((el) => parseFloat(getComputedStyle(el).opacity))
      if (opacity < 0.99) {
        throw new Error(`Label opacity is ${opacity} (expected 1.0). $label-opacity may have regressed.`)
      }

      await page.screenshot({
        path: `${OUT}/form-fields-${theme}.png`,
        fullPage: false,
        clip: { x: 0, y: 0, width: 1200, height: 900 },
      })
    })
  }
})
