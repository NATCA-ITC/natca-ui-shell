import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import { resolve } from 'path'
import { readFileSync, existsSync } from 'fs'

// Serve static HTML files from repo root (design system, nav variants)
function serveRepoRoot() {
  const repoRoot = resolve(__dirname, '..')
  return {
    name: 'serve-repo-root',
    configureServer(server: any) {
      server.middlewares.use((req: any, res: any, next: any) => {
        const url = req.url?.split('?')[0]
        if (url?.endsWith('.html') && url !== '/') {
          const filePath = resolve(repoRoot, url.slice(1))
          if (existsSync(filePath)) {
            res.setHeader('Content-Type', 'text/html')
            res.end(readFileSync(filePath, 'utf-8'))
            return
          }
        }
        // Serve repo-root files referenced by the HTML pages (src/, assets/)
        if (url?.startsWith('/src/') || url?.startsWith('/assets/')) {
          const filePath = resolve(repoRoot, url.slice(1))
          if (existsSync(filePath)) {
            const ext = url.split('.').pop()
            const types: Record<string, string> = { css: 'text/css', js: 'text/javascript', json: 'application/json', png: 'image/png', jpg: 'image/jpeg', svg: 'image/svg+xml', ico: 'image/x-icon' }
            res.setHeader('Content-Type', types[ext!] || 'application/octet-stream')
            res.end(readFileSync(filePath))
            return
          }
        }
        next()
      })
    },
  }
}

export default defineConfig({
  root: resolve(__dirname),
  plugins: [
    serveRepoRoot(),
    vue(),
    vuetify({ autoImport: true }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, '../src'),
    },
  },
  publicDir: resolve(__dirname, '../assets'),
  server: {
    port: 1310,
    strictPort: true,
    fs: {
      allow: [resolve(__dirname, '..')],
    },
  },
})
