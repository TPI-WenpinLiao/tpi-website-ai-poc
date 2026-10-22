// Imports the company logo files (PNG exports from the brand team, M3-04 #17) into the site:
// the logos the pages use go to src/assets/brand/ with their transparent padding trimmed, and the
// favicons are rendered from the color symbol into public/.
// Sources keep the brand team's file names ("TPI_Logo_<Color|White|Black> <Kind>.png"); this script
// maps the ones the site needs to kebab-case names. The other exports (black, vertical, Chinese
// only) are not used yet.
// sharp comes with Astro (its image service). Rerunning with the same input writes the same files.
// Run: node scripts/design/import-brand.mjs <dir with the PNG exports>

import { mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import sharp from 'sharp';

const ROOT = resolve(import.meta.dirname, '../..');
const ASSETS = join(ROOT, 'src/assets/brand');
const PUBLIC = join(ROOT, 'public');

// White on the dark surfaces (the symbol in the header; the horizontal logo in the footer and the OG
// image); color for light surfaces; the color symbol for icons
export const LOGOS = [
  { source: 'TPI_Logo_White Symbol.png', name: 'logo-symbol-white' },
  { source: 'TPI_Logo_White Horizontal Logo_Ch-En.png', name: 'logo-horizontal-white' },
  { source: 'TPI_Logo_Color Horizontal Logo_Ch-En.png', name: 'logo-horizontal-color' },
  { source: 'TPI_Logo_Color Symbol.png', name: 'logo-symbol-color' },
];

// Browser tab icon and the iOS home screen icon. The symbol is wider than tall, so it is centered
// on a square canvas; the touch icon gets an opaque white background because iOS fills
// transparency with black.
export const ICONS = [
  { name: 'favicon.png', size: 48, padding: 2, background: { alpha: 0 } },
  { name: 'apple-touch-icon.png', size: 180, padding: 24, background: { r: 255, g: 255, b: 255, alpha: 1 } },
];
const SYMBOL = 'TPI_Logo_Color Symbol.png';

async function main([dir]) {
  if (!dir) throw new Error('usage: import-brand.mjs <dir with the PNG exports>');
  mkdirSync(ASSETS, { recursive: true });
  for (const { source, name } of LOGOS) {
    const out = join(ASSETS, `${name}.png`);
    const info = await sharp(join(dir, source)).trim().png({ compressionLevel: 9 }).toFile(out);
    console.log(`${source} -> ${out} (${info.width}×${info.height})`);
  }
  const symbol = await sharp(join(dir, SYMBOL)).trim().toBuffer();
  for (const { name, size, padding, background } of ICONS) {
    const inner = size - padding * 2;
    const out = join(PUBLIC, name);
    const icon = await sharp(symbol)
      .resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .extend({ top: padding, bottom: padding, left: padding, right: padding, background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .toBuffer();
    const image = sharp(icon);
    if (background.alpha === 1) image.flatten({ background });
    await image.png({ compressionLevel: 9 }).toFile(out);
    console.log(`${SYMBOL} -> ${out} (${size}×${size})`);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(process.argv.slice(2)).catch((err) => {
    console.error(err instanceof Error ? err.message : err);
    process.exitCode = 1;
  });
}
