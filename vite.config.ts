import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    vuetify({
      autoImport: true,
      styles: {
        configFile: resolve(__dirname, 'src/scss/settings.scss'),
      },
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: 'natca-ui-shell',
    },
    rollupOptions: {
      external: [
        'vue',
        'vue-router',
        'vuetify',
        /^vuetify\//,
        '@mdi/font',
        'pdfjs-dist',
        /^pdfjs-dist\//,
        // Optional peer — the rich-text field imports these dynamically, so an
        // app that registers no rich-text block never resolves them.
        /^@tiptap\//,
      ],
      output: {
        dir: 'dist/vue',
        assetFileNames: '[name][extname]',
      },
    },
    cssCodeSplit: false,
  },
})
