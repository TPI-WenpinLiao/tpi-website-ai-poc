// Builds the source subset of the serif heading font (#167): Noto Serif TC 700, cut down to every
// character the built site sets in serif (SERIF_SELECTOR in src/lib/fonts/serif.ts). Pages don't load
// this file: at build time src/integrations/serif-fonts.ts cuts each page's own woff2 from it with
// the npm package subset-font, so the build needs no Python. Latin and Vietnamese text in headings
// use it too, so a heading never mixes two typefaces.
//
// The characters come from dist/, so the order is: astro build → this script → astro build again.
// The font and the character list are committed; scripts/design/font-subsets.mjs fails when the
// built site sets a character in serif that SERIF_CHARS does not list, so a new heading with a new
// character fails `npm run check` until this script is rerun (it needs fonttools, below).
//
// Needs fonttools and brotli: python3 -m venv /tmp/ft && /tmp/ft/bin/pip install fonttools brotli
// Run: node scripts/design/serif-subset.mjs [dist] [--python /tmp/ft/bin/python]

import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { serialize, serifChars } from '../../src/lib/fonts/serif.ts';
export { serialize, serifChars };

const require = createRequire(import.meta.url);
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
export const SERIF_FONT = join(ROOT, 'src/assets/fonts/noto-serif-tc-700.woff2');
export const SERIF_CHARS = join(ROOT, 'src/assets/fonts/noto-serif-tc-700.txt');
/** The source subset; past this size the approach needs a rethink */
export const SERIF_MAX_BYTES = 500 * 1024;

/** @param {string} dir @returns {string[]} */
export function htmlFiles(dir) {
  return readdirSync(dir, { recursive: true, encoding: 'utf8' })
    .filter((f) => f.endsWith('.html'))
    .map((f) => join(dir, f));
}

/** @param {string} dist @returns {Set<string>} */
export function siteSerifChars(dist) {
  const all = new Set();
  for (const file of htmlFiles(dist)) for (const c of serifChars(readFileSync(file, 'utf8'))) all.add(c);
  return all;
}

/** "U+3401,U+3d18-3d19" → [[0x3401, 0x3401], [0x3d18, 0x3d19]] @param {string} ranges */
export function parseRanges(ranges) {
  return ranges.split(',').map((r) => {
    const [a, b = a] = r.trim().replace(/^U\+/i, '').split('-');
    return /** @type {[number, number]} */ ([parseInt(a, 16), parseInt(b, 16)]);
  });
}

/**
 * The fontsource slices that cover the characters, and the characters no slice covers.
 * @param {Iterable<string>} chars @param {Record<string, string>} unicode the package's unicode.json
 */
export function pickSlices(chars, unicode) {
  const slices = Object.entries(unicode).map(([key, ranges]) => ({ name: key.replace(/^\[|\]$/g, ''), ranges: parseRanges(ranges) }));
  const used = new Set();
  const missing = [];
  for (const c of chars) {
    const cp = /** @type {number} */ (c.codePointAt(0));
    const slice = slices.find((s) => s.ranges.some(([a, b]) => cp >= a && cp <= b));
    if (slice) used.add(slice.name);
    else missing.push(c);
  }
  return { slices: [...used].sort(), missing };
}

function main() {
  const args = process.argv.slice(2);
  const pyAt = args.indexOf('--python');
  const python = pyAt >= 0 ? args.splice(pyAt, 2)[1] : 'python3';
  const dist = resolve(args[0] ?? 'dist');
  const chars = siteSerifChars(dist);
  const unicode = require('@fontsource/noto-serif-tc/unicode.json');
  const { slices, missing } = pickSlices(chars, unicode);
  if (missing.length) console.log(`not in Noto Serif TC (fallback font): ${serialize(missing)}`);
  const files = slices.map((s) => require.resolve(`@fontsource/noto-serif-tc/files/noto-serif-tc-${s}-700-normal.woff2`));
  const tmp = mkdtempSync(join(tmpdir(), 'serif-'));
  const list = join(tmp, 'chars.txt');
  writeFileSync(list, serialize(chars));
  execFileSync(python, [join(ROOT, 'scripts/design/serif-subset.py'), SERIF_FONT, list, ...files], { stdio: 'inherit' });
  writeFileSync(SERIF_CHARS, `${serialize(chars)}\n`);
  const bytes = statSync(SERIF_FONT).size;
  console.log(`${chars.size} characters from ${slices.length} slices → ${(bytes / 1024).toFixed(1)} KB`);
  if (bytes > SERIF_MAX_BYTES) {
    console.log(`over ${SERIF_MAX_BYTES / 1024} KB`);
    process.exitCode = 1;
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) main();
