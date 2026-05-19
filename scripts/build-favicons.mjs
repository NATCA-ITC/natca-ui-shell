#!/usr/bin/env node
// Regenerates the favicon raster set + favicon.ico from assets/favicons/favicon.svg.
// Source of truth: favicon.svg. Run with `npm run favicons` after editing it.

import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import pngToIco from 'png-to-ico'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')
const faviconsDir = join(root, 'assets', 'favicons')
const sourceSvg = join(faviconsDir, 'favicon.svg')
const svgBuffer = readFileSync(sourceSvg)

const pngTargets = [
  { name: 'favicon-32.png', size: 32 },
  { name: 'favicon-64.png', size: 64 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'favicon-192.png', size: 192 },
  { name: 'favicon-512.png', size: 512 },
]

async function renderPng(size) {
  return sharp(svgBuffer, { density: 384 })
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toBuffer()
}

console.log(`Source: ${sourceSvg}`)

for (const { name, size } of pngTargets) {
  const out = join(faviconsDir, name)
  const buf = await renderPng(size)
  writeFileSync(out, buf)
  console.log(`  wrote ${name} (${size}x${size}, ${buf.length} bytes)`)
}

// favicon.ico bundles 16+32+48 raster planes for legacy browsers.
const icoSizes = [16, 32, 48]
const icoBuffers = await Promise.all(icoSizes.map(renderPng))
const icoBuffer = await pngToIco(icoBuffers)
writeFileSync(join(faviconsDir, 'favicon.ico'), icoBuffer)
console.log(`  wrote favicon.ico (${icoSizes.join('+')}, ${icoBuffer.length} bytes)`)

console.log('Done.')
