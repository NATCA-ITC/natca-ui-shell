# NATCA Favicons

Canonical favicon set for all NATCA web properties. Consuming apps (`email`, `mn`, `bid`, `dms`, `pay`, `gats`) reference these paths so we maintain one set, not six.

## Chosen design

**Navy "N" monogram with red accent underbar.**

- Rounded-square plate, NATCA navy (`#003366`)
- Bold sans "N" letterform in white, ~12% inner padding so it stays legible at 16×16
- Red (`#CE0E2D`) underbar — nods to the radar/scope element in the full brand mark while staying simple enough to survive small sizes

Master vector: [`favicon.svg`](./favicon.svg). All raster outputs are generated from it.

## File list

| File | Size | Purpose |
|---|---|---|
| `favicon.svg` | vector | Modern browsers; master source of truth |
| `favicon-32.png` | 32×32 | Standard browser tab |
| `favicon-64.png` | 64×64 | Retina browser tab |
| `favicon-192.png` | 192×192 | Android home screen / PWA |
| `favicon-512.png` | 512×512 | High-DPI / PWA install |
| `apple-touch-icon.png` | 180×180 | iOS Safari home screen |
| `favicon.ico` | 16+32+48 multi-res | Legacy fallback (IE, embedded browsers) |

## Regenerating

After editing `favicon.svg`:

```bash
npm run favicons
```

This runs `scripts/build-favicons.mjs`, which uses `sharp` to render the SVG at every required size and `png-to-ico` to bundle the multi-resolution ICO. All outputs are overwritten in this directory.

## Consumer wire-up

Each app copies these into its own `public/` at build time so the browser sees them at canonical paths (`/favicon.svg`, `/favicon-32.png`, etc.). Typical pattern in a Vite-based app:

```ts
// vite.config.ts
import { viteStaticCopy } from 'vite-plugin-static-copy'

plugins: [
  viteStaticCopy({
    targets: [
      {
        src: 'node_modules/@natca-itc/ui-shell/assets/favicons/*',
        dest: '.',
      },
    ],
  }),
]
```

Then in `index.html`:

```html
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon-32.png" type="image/png" sizes="32x32">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="alternate icon" href="/favicon.ico">
```

## Status

- [x] SVG mark designed (navy plate, white "N", red underbar)
- [x] PNG set generated (32, 64, 180, 192, 512)
- [x] ICO generated (16+32+48 multi-res)
- [x] README updated with chosen design
- [ ] Released in next ui-shell version
