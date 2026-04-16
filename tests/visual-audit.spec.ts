import { test } from '@playwright/test'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const BASE = 'http://localhost:1310'
const SCREENSHOTS = resolve(__dirname, '../TEMP/visual-audit')

test.describe('Visual Audit — Design System vs Playground', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
  })

  // ── Design System HTML (auth context, dark theme) ──
  test('design-system-auth-dark', async ({ page }) => {
    await page.goto(`${BASE}/natca-design-system.html`)
    await page.waitForLoadState('networkidle')
    // Switch to auth context + dark theme
    await page.evaluate(() => {
      (window as any).setContext('auth');
      (window as any).setTheme('dark')
    })
    await page.waitForTimeout(300)

    // Screenshot each section
    const sections = await page.locator('.auth-only .ds-section').all()
    for (let i = 0; i < sections.length; i++) {
      const title = await sections[i].locator('.ds-section-title').textContent().catch(() => `section-${i}`)
      const slug = (title || `section-${i}`).toLowerCase().replace(/[^a-z0-9]+/g, '-')
      await sections[i].screenshot({ path: `${SCREENSHOTS}/ds-dark-${slug}.png` })
    }
    // Full page
    await page.screenshot({ path: `${SCREENSHOTS}/ds-dark-full.png`, fullPage: true })
  })

  test('design-system-auth-light', async ({ page }) => {
    await page.goto(`${BASE}/natca-design-system.html`)
    await page.waitForLoadState('networkidle')
    await page.evaluate(() => {
      (window as any).setContext('auth');
      (window as any).setTheme('light')
    })
    await page.waitForTimeout(300)

    const sections = await page.locator('.auth-only .ds-section').all()
    for (let i = 0; i < sections.length; i++) {
      const title = await sections[i].locator('.ds-section-title').textContent().catch(() => `section-${i}`)
      const slug = (title || `section-${i}`).toLowerCase().replace(/[^a-z0-9]+/g, '-')
      await sections[i].screenshot({ path: `${SCREENSHOTS}/ds-light-${slug}.png` })
    }
    await page.screenshot({ path: `${SCREENSHOTS}/ds-light-full.png`, fullPage: true })
  })

  // ── Playground components page (dark theme — default) ──
  test('playground-components-dark', async ({ page }) => {
    await page.goto(`${BASE}/admin/components`)
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)
    await page.screenshot({ path: `${SCREENSHOTS}/pg-dark-components.png`, fullPage: true })
  })

  // ── Playground dashboard (dark) ──
  test('playground-dashboard-dark', async ({ page }) => {
    await page.goto(`${BASE}/admin`)
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)
    await page.screenshot({ path: `${SCREENSHOTS}/pg-dark-dashboard.png`, fullPage: true })
  })

  // ── Standalone Vuetify component audit ──
  // Create a test page with bare Vuetify components to compare against design system
  test('vuetify-bare-components-dark', async ({ page }) => {
    await page.goto(`${BASE}/admin/components`)
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)

    // Inject test components directly to see how bare Vuetify renders
    const html = await page.evaluate(() => {
      const el = document.createElement('div')
      el.id = 'vuetify-audit'
      el.style.padding = '20px'
      el.style.maxWidth = '800px'
      el.innerHTML = `
        <h3 style="font-family: var(--font-display); margin-bottom: 16px; color: var(--color-text-primary);">Vuetify Bare Component Audit</h3>

        <div style="margin-bottom: 24px;">
          <p style="font-size: 11px; color: var(--color-text-faint); margin-bottom: 8px;">BUTTONS — All 5 design system variants</p>
          <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 8px;">
            <button class="v-btn v-btn--flat v-theme--natcaDark v-btn--density-compact v-btn--size-small v-btn--variant-flat" style="background: rgb(var(--v-theme-primary)); color: rgb(var(--v-theme-on-primary));">Primary</button>
          </div>
        </div>
      `
      document.querySelector('.components-page')?.appendChild(el)
      return el.outerHTML
    })

    await page.screenshot({ path: `${SCREENSHOTS}/pg-dark-vuetify-audit.png`, fullPage: true })
  })
})
