# NATCA Favicons (NAT-507)

Drop favicon files in this directory. Each consuming app (`email`, `mn`, `bid`, `dms`, `pay`, `gats`) will pull from these canonical paths at build time so we maintain one set, not six.

## File list

| File | Size | Purpose |
|---|---|---|
| `favicon-32.png` | 32×32 | Standard browser tab |
| `favicon-64.png` | 64×64 | Retina browser tab |
| `favicon-192.png` | 192×192 | Android home screen / PWA |
| `favicon-512.png` | 512×512 | High-DPI / PWA install |
| `apple-touch-icon.png` | 180×180 | iOS Safari home screen |
| `favicon.svg` | vector | Modern browsers, scales for theme-aware dark/light |
| `favicon.ico` | 16+32+48 multi-res | Legacy fallback |

## Design constraints

Favicons need to be legible at **16×16**. The full NATCA wordmark renders as mush at that size — use either:

- The **"N" monogram** from the brand mark, padded a few px from the edges
- A **simplified radar/scope motif** from the logo

Once you commit the chosen design, document it here (which symbol, source SVG path) so future regenerations stay consistent.

## Source SVG

Keep the master source SVG in this directory too (`favicon.svg`). PNG/ICO outputs can be regenerated from it via:

```bash
# Each PNG size
for size in 32 64 192 512; do
  rsvg-convert -w $size -h $size favicon.svg -o favicon-${size}.png
done
# Apple touch (180×180)
rsvg-convert -w 180 -h 180 favicon.svg -o apple-touch-icon.png
# Multi-res ICO
convert favicon-16.png favicon-32.png favicon-48.png favicon.ico
```

(`rsvg-convert` is part of librsvg; `convert` is ImageMagick.)

## Status

- [ ] SVG mark designed
- [ ] PNG set generated
- [ ] ICO generated
- [ ] README updated with chosen design
- [ ] Released in next ui-shell version
