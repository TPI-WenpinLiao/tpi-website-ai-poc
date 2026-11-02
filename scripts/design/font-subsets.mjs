// Checks the webfont subsets against the built site (#143). src/styles/base.css declares only the
// latin, vietnamese and greek subsets of Inter and JetBrains Mono: a page downloads every subset its
// text touches before the first paint, and one "ō" cost the contact pages the 83 KB latin-ext file.
// Greek stays for "π" in the SysTalk.Chat product name (a 19 KB file on the pages that name it).
// This fails when
// - the built CSS declares other subsets, or ranges that differ from the package's unicode.json
//   (a fontsource upgrade that moved a range, or an import of the package's own CSS), or
// - a page has a character the font covers but these subsets do not (it would show in the system
//   font), unless ALLOWED lists it; an ALLOWED character no page uses any more also fails.
// Characters the font does not cover at all (Chinese, emoji) use the system font by design.
// The serif heading font (#167) is checked too: it fails when a page sets a character in serif that
// the committed source subset does not list (rerun scripts/design/serif-subset.mjs), when the source
// grew past SERIF_MAX_BYTES, or when a page's own font (src/integrations/serif-fonts.ts) is over
// PAGE_FONT_MAX_BYTES.
// Run after `astro build`: node scripts/design/font-subsets.mjs [dist]

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parse } from 'node-html-parser';
import { SERIF_CHARS, SERIF_FONT, SERIF_MAX_BYTES, serialize, siteSerifChars } from './serif-subset.mjs';

const require = createRequire(import.meta.url);
export const SUBSETS = ['latin', 'vietnamese', 'greek'];
const FONTS = [
  { family: 'Inter Variable', unicode: '@fontsource-variable/inter/unicode.json' },
  { family: 'JetBrains Mono Variable', unicode: '@fontsource-variable/jetbrains-mono/unicode.json' },
];
// Characters that may fall back to the system font, and why
// A page's own serif font: the largest is about 40 KB (the finance page, 186 characters, #167)
export const PAGE_FONT_MAX_BYTES = 64 * 1024;
export const ALLOWED = new Map([['ō', 'Tokyo office address (2-chōme) on the contact pages; latin-ext is 83 KB (#143)']]);

/**
 * "U+0000-00FF,U+0131" → [[0, 255], [305, 305]]. Lightning CSS writes U+0-FF as the wildcard U+??.
 * @param {string} ranges @returns {Array<[number, number]>}
 */
export function parseRanges(ranges) {
  return ranges.split(',').map((r) => {
    const value = r.trim().replace(/^U\+/i, '');
    if (value.includes('?')) return [parseInt(value.replaceAll('?', '0'), 16), parseInt(value.replaceAll('?', 'F'), 16)];
    const [a, b = a] = value.split('-');
    return [parseInt(a, 16), parseInt(b, 16)];
  });
}

/** @param {number} code @param {Array<[number, number]>} ranges */
const inRanges = (code, ranges) => ranges.some(([a, b]) => code >= a && code <= b);

/**
 * The unicode-range of every @font-face in the CSS, by family. Lightning CSS writes the ranges
 * without zero padding (U+0-FF), so they are compared as numbers.
 * @param {string} css @returns {Map<string, Array<Array<[number, number]>>>}
 */
export function fontFaces(css) {
  const faces = new Map();
  for (const [, body] of css.matchAll(/@font-face\s*\{([^}]*)\}/g)) {
    const family = body.match(/font-family\s*:\s*["']?([^;"']+)/)?.[1]?.trim();
    const range = body.match(/unicode-range\s*:\s*([^;]+)/)?.[1];
    if (!family || !range) continue;
    faces.set(family, [...(faces.get(family) ?? []), parseRanges(range)]);
  }
  return faces;
}

/**
 * Characters of the text the font covers (`all`) but the loaded subsets do not (`loaded`).
 * @param {string} text @param {Array<[number, number]>} all @param {Array<[number, number]>} loaded
 */
export function uncovered(text, all, loaded) {
  const found = new Set();
  for (const char of text) {
    const code = /** @type {number} */ (char.codePointAt(0));
    if (inRanges(code, all) && !inRanges(code, loaded)) found.add(char);
  }
  return found;
}

/** The text a page renders: no script, style or template content. @param {string} html */
export function pageText(html) {
  const root = parse(html);
  for (const el of root.querySelectorAll('script, style, template, noscript')) el.remove();
  return root.querySelector('body')?.text ?? '';
}

/** @param {Array<[number, number]>} ranges */
const key = (ranges) => JSON.stringify(ranges.map(([a, b]) => `${a}-${b}`).sort());

/** @param {string[]} args */
function main([dist = resolve(import.meta.dirname, '../../dist')]) {
  const files = readdirSync(dist, { recursive: true }).map(String);
  const css = files.filter((f) => f.endsWith('.css')).map((f) => readFileSync(join(dist, f), 'utf8')).join('\n');
  const faces = fontFaces(css);
  let failures = 0;

  /** @type {Array<[number, number]>} */
  let all = [];
  /** @type {Array<[number, number]>} */
  let loaded = [];
  for (const { family, unicode } of FONTS) {
    const subsets = /** @type {Record<string, string>} */ (JSON.parse(readFileSync(require.resolve(unicode), 'utf8')));
    const expected = SUBSETS.map((s) => key(parseRanges(subsets[s]))).sort();
    const actual = (faces.get(family) ?? []).map(key).sort();
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      console.log(`${family}: built CSS declares ${actual.length} faces, expected the ${SUBSETS.join(' and ')} ranges of ${unicode}`);
      failures += 1;
    }
    all = [...all, ...Object.values(subsets).flatMap(parseRanges)];
    loaded = [...loaded, ...SUBSETS.flatMap((s) => parseRanges(subsets[s]))];
  }

  /** @type {Map<string, string[]>} */
  const pages = new Map();
  for (const file of files.filter((f) => f.endsWith('.html') && !f.startsWith('_astro') && !f.startsWith('pagefind'))) {
    for (const char of uncovered(pageText(readFileSync(join(dist, file), 'utf8')), all, loaded)) {
      pages.set(char, [...(pages.get(char) ?? []), file]);
    }
  }
  for (const [char, list] of pages) {
    const code = `U+${(char.codePointAt(0) ?? 0).toString(16).toUpperCase().padStart(4, '0')}`;
    if (ALLOWED.has(char)) {
      console.log(`allowed ${char} (${code}) on ${list.length} pages: ${ALLOWED.get(char)}`);
      continue;
    }
    console.log(`${char} (${code}) is outside the ${SUBSETS.join(' and ')} subsets, on ${list.length} pages: ${list.slice(0, 5).join(', ')}`);
    failures += 1;
  }
  for (const char of ALLOWED.keys()) {
    if (!pages.has(char)) {
      console.log(`${char} is in ALLOWED but no page uses it any more: remove it`);
      failures += 1;
    }
  }
  const subset = new Set(readFileSync(SERIF_CHARS, 'utf8').replace(/\n$/, ''));
  const stale = [...siteSerifChars(dist)].filter((c) => !subset.has(c));
  if (stale.length) {
    console.log(`serif headings use ${stale.length} characters not in ${SERIF_CHARS}: ${serialize(stale)}; run node scripts/design/serif-subset.mjs`);
    failures += 1;
  }
  const serifBytes = statSync(SERIF_FONT).size;
  if (serifBytes > SERIF_MAX_BYTES) {
    console.log(`serif font is ${serifBytes} bytes, over ${SERIF_MAX_BYTES}`);
    failures += 1;
  }
  const pageFonts = files.filter((f) => /^_astro\/serif-[0-9a-f]+\.woff2$/.test(f));
  for (const f of pageFonts) {
    const size = statSync(join(dist, f)).size;
    if (size > PAGE_FONT_MAX_BYTES) {
      console.log(`${f} is ${size} bytes, over ${PAGE_FONT_MAX_BYTES}: a page sets too much text in serif`);
      failures += 1;
    }
  }
  console.log(`${pageFonts.length} page serif fonts, largest ${Math.max(0, ...pageFonts.map((f) => statSync(join(dist, f)).size))} bytes`);
  console.log(`${failures} font subset problems`);
  if (failures) process.exitCode = 1;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) main(process.argv.slice(2));
