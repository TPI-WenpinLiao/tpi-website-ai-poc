// Imports the company logo files (Illustrator files from the brand team, #122) into the site: the
// logos the pages use go to src/assets/brand/ as SVG cropped to their artwork, and the favicons are
// rendered from the color symbol into public/.
// The .ai files are PDF compatible, so pdftocairo (poppler-utils) converts them to SVG. Two things in
// the exports are not part of the logo and are removed: the white versions carry an artboard-sized
// dark rectangle (the brand team's preview background), and some files reference an empty glyph.
// Sources keep the brand team's file names ("TPI_Logo_OL_<Color|White|Black> <Kind>.ai"); this script
// maps the ones the site needs to kebab-case names. The other exports (black, Chinese only) are not
// used yet.
// sharp comes with Astro (its image service). Rerunning with the same input writes the same files.
// Run: node scripts/design/import-brand.mjs <dir with the .ai files>

import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import sharp from 'sharp';

const ROOT = resolve(import.meta.dirname, '../..');
const ASSETS = join(ROOT, 'src/assets/brand');
const PUBLIC = join(ROOT, 'public');

// White on the dark surfaces (the symbol in the header; the horizontal logo in the footer and the OG
// image); color for light surfaces; the color symbol for icons; the color vertical logo is the
// organization logo (src/content/organization, JSON-LD). `background` is whether the export has the
// preview background, so a change in the brand team's files fails here instead of shipping a box.
export const LOGOS = [
  { source: 'TPI_Logo_OL_Color Vertical Logo_Ch.ai', name: 'logo-vertical-color', background: false },
  { source: 'TPI_Logo_OL_White Symbol.ai', name: 'logo-symbol-white', background: true },
  { source: 'TPI_Logo_OL_White Horizontal Logo_Ch-En.ai', name: 'logo-horizontal-white', background: true },
  { source: 'TPI_Logo_OL_Color Horizontal Logo_Ch-En.ai', name: 'logo-horizontal-color', background: false },
  { source: 'TPI_Logo_OL_Color Symbol.ai', name: 'logo-symbol-color', background: false },
];

// Browser tab icon and the iOS home screen icon. The symbol is wider than tall, so it is centered
// on a square canvas; the touch icon gets an opaque white background because iOS fills
// transparency with black.
export const ICONS = [
  { name: 'favicon.png', size: 48, padding: 2, background: { alpha: 0 } },
  { name: 'apple-touch-icon.png', size: 180, padding: 24, background: { r: 255, g: 255, b: 255, alpha: 1 } },
];
const SYMBOL = 'logo-symbol-color';

// Pixels per SVG unit when rasterizing to find the artwork's bounds: 0.1 unit precision
const SCALE = 10;

const NUMBER = String.raw`-?\d+(?:\.\d+)?`;

/** @param {string} svg @returns {[number, number, number, number]} */
export function viewBox(svg) {
  const match = svg.match(/<svg\b[^>]*\bviewBox="([^"]+)"/);
  if (!match) throw new Error('svg has no viewBox');
  const box = match[1].trim().split(/[\s,]+/).map(Number);
  if (box.length !== 4 || box.some(Number.isNaN)) throw new Error(`bad viewBox: ${match[1]}`);
  return /** @type {[number, number, number, number]} */ (box);
}

/**
 * Bounds of a path made only of one axis-aligned rectangle (pdftocairo writes rectangles as
 * "M x y L x y L x y L x y Z M x y"), or null.
 * @param {string} d
 */
export function rectangle(d) {
  const point = String.raw`(${NUMBER}) (${NUMBER})`;
  const match = d.trim().match(new RegExp(String.raw`^M ${point} L ${point} L ${point} L ${point} Z(?: M ${NUMBER} ${NUMBER})?$`));
  if (!match) return null;
  const xs = [match[1], match[3], match[5], match[7]].map(Number);
  const ys = [match[2], match[4], match[6], match[8]].map(Number);
  // Each corner shares one coordinate with each neighbor, so there are two distinct xs and ys
  if (new Set(xs).size !== 2 || new Set(ys).size !== 2) return null;
  return { x: Math.min(...xs), y: Math.min(...ys), width: Math.max(...xs) - Math.min(...xs), height: Math.max(...ys) - Math.min(...ys) };
}

/**
 * Removes filled rectangles covering (almost) the whole artboard, then the clip groups and clip
 * paths left empty by that. Returns how many rectangles were removed.
 * @param {string} svg
 */
export function stripBackground(svg) {
  const [, , width, height] = viewBox(svg);
  let removed = 0;
  let out = svg.replace(/<path\b[^>]*\bfill="[^"]+"[^>]*\bd="([^"]+)"[^>]*\/>\n?/g, (element, d) => {
    const rect = rectangle(d);
    if (!rect || rect.width < width * 0.99 || rect.height < height * 0.99) return element;
    removed += 1;
    return '';
  });
  out = out.replace(/<g clip-path="url\(#([\w-]+)\)">\s*<\/g>\n?/g, '');
  out = removeUnreferenced(out, /<clipPath id="([\w-]+)">[\s\S]*?<\/clipPath>\n?/g, (id) => `url(#${id})`);
  return { svg: removeEmptyDefs(out), removed };
}

/**
 * Removes glyphs with no outline and the <use> elements that reference them (they draw nothing),
 * then groups left empty by that.
 * @param {string} svg
 */
export function stripEmptyGlyphs(svg) {
  const empty = [...svg.matchAll(/<g id="(glyph-[\w-]+)">\s*<\/g>/g)].map((m) => m[1]);
  let out = svg;
  for (const id of empty) {
    out = out.replace(new RegExp(String.raw`<g id="${id}">\s*</g>\n?`), '');
    out = out.replace(new RegExp(String.raw`<use xlink:href="#${id}"[^>]*/>\n?`, 'g'), '');
  }
  // Groups emptied above: repeat for nested ones
  for (let previous; previous !== out; ) {
    previous = out;
    out = out.replace(/<g\b[^>]*>\s*<\/g>\n?/g, '');
  }
  return removeEmptyDefs(out);
}

/** @param {string} svg @param {RegExp} pattern @param {(id: string) => string} reference */
function removeUnreferenced(svg, pattern, reference) {
  return svg.replace(pattern, (element, id) => (svg.includes(reference(id)) ? element : ''));
}

/** @param {string} svg */
function removeEmptyDefs(svg) {
  return svg.replace(/<defs>\s*<\/defs>\n?/g, '');
}

/**
 * Sets the viewBox, width and height to `box` (x, y, width, height in SVG units).
 * @param {string} svg @param {[number, number, number, number]} box
 */
export function setViewBox(svg, box) {
  const [x, y, width, height] = box.map((n) => +n.toFixed(3));
  return svg.replace(/<svg\b[^>]*>/, (tag) =>
    tag
      .replace(/\bwidth="[^"]*"/, `width="${width}"`)
      .replace(/\bheight="[^"]*"/, `height="${height}"`)
      .replace(/\bviewBox="[^"]*"/, `viewBox="${x} ${y} ${width} ${height}"`),
  );
}

/**
 * Crops the viewBox to the drawn artwork, like trimming the transparent edge of a PNG. The bounds
 * come from a raster at SCALE pixels per unit (curves make path coordinates overshoot the shape).
 * @param {string} svg
 */
export async function cropToArtwork(svg) {
  const [x0, y0] = viewBox(svg);
  const { info } = await sharp(Buffer.from(svg), { density: 72 * SCALE })
    .trim({ threshold: 0 })
    .toBuffer({ resolveWithObject: true });
  const left = -(info.trimOffsetLeft ?? 0);
  const top = -(info.trimOffsetTop ?? 0);
  return setViewBox(svg, [x0 + left / SCALE, y0 + top / SCALE, info.width / SCALE, info.height / SCALE]);
}

/** @param {string} file */
function aiToSvg(file) {
  return execFileSync('pdftocairo', ['-svg', file, '-'], { encoding: 'utf8' });
}

async function main([dir]) {
  if (!dir) throw new Error('usage: import-brand.mjs <dir with the .ai files>');
  mkdirSync(ASSETS, { recursive: true });
  /** @type {Record<string, string>} */
  const logos = {};
  for (const { source, name, background } of LOGOS) {
    const stripped = stripBackground(aiToSvg(join(dir, source)));
    if (stripped.removed !== (background ? 1 : 0)) {
      throw new Error(`${source}: expected ${background ? 1 : 0} background rectangle, found ${stripped.removed}`);
    }
    const svg = await cropToArtwork(stripEmptyGlyphs(stripped.svg));
    const out = join(ASSETS, `${name}.svg`);
    writeFileSync(out, svg);
    logos[name] = svg;
    const [, , width, height] = viewBox(svg);
    console.log(`${source} -> ${out} (${width}×${height})`);
  }
  const symbol = await sharp(Buffer.from(logos[SYMBOL]), { density: 72 * SCALE }).png().toBuffer();
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
    console.log(`${SYMBOL}.svg -> ${out} (${size}×${size})`);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(process.argv.slice(2)).catch((err) => {
    console.error(err instanceof Error ? err.message : err);
    process.exitCode = 1;
  });
}
