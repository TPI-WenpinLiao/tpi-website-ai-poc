// Checks the semantic color pairs in src/styles/tokens.css against WCAG 2.2 AA contrast:
// 4.5:1 for text (1.4.3), 3:1 for UI components and focus indicators (1.4.11).
// Every pair is checked on both surfaces: light (:root) and dark ([data-surface="dark"], which
// overrides :root). PAIRS is the single list of foreground/background combinations components are
// allowed to use; adding a color token that pairs with another means adding the pair here.
// Translucent backgrounds (glass) are composited over `over` (default --color-bg); glass pairs use
// --scene-worst, the backdrop that gives the lowest contrast on that surface.
// Disabled controls are exempt from 1.4.3, so --color-disabled-* has no pair.
// Exits non-zero when a pair fails or a token can't be resolved to a color.
// Run: node scripts/design/contrast.mjs [tokens.css]

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const TEXT = 4.5;
const UI = 3;

/** @param {string} fg @param {string[]} bgs @param {number} min @param {string} [over] */
const pair = (fg, bgs, min, over) => bgs.map((bg) => ({ fg, bg, min, over }));

const BACKGROUNDS = ['--color-bg', '--color-bg-subtle', '--color-bg-muted', '--color-bg-brand-subtle', '--color-bg-accent-subtle'];

export const PAIRS = [
  ...pair('--color-text', BACKGROUNDS, TEXT),
  ...pair('--color-text-muted', BACKGROUNDS, TEXT),
  ...pair('--color-text-brand', ['--color-bg', '--color-bg-subtle', '--color-bg-muted', '--color-bg-brand-subtle'], TEXT),
  ...pair('--color-text-accent', ['--color-bg', '--color-bg-subtle', '--color-bg-accent-subtle'], TEXT),
  ...pair('--color-text', ['--glass-bg'], TEXT, '--scene-worst'),
  ...pair('--color-text-muted', ['--glass-bg'], TEXT, '--scene-worst'),
  ...pair('--color-text-brand', ['--glass-bg'], TEXT, '--scene-worst'),
  ...pair('--color-link', ['--glass-bg'], TEXT, '--scene-worst'),
  ...pair('--color-action-text', ['--color-action', '--color-action-hover'], TEXT),
  ...pair('--color-action', ['--color-bg', '--color-bg-subtle', '--color-action-subtle-hover'], TEXT),
  ...pair('--color-link', ['--color-bg', '--color-bg-subtle', '--color-bg-muted', '--color-bg-brand-subtle'], TEXT),
  ...pair('--color-link-hover', ['--color-bg', '--color-bg-subtle'], TEXT),
  ...pair('--color-error', ['--color-bg', '--color-bg-subtle', '--color-error-bg'], TEXT),
  ...pair('--color-success', ['--color-bg', '--color-success-bg'], TEXT),
  ...pair('--color-border-strong', ['--color-bg', '--color-bg-subtle'], UI),
  // Focus rings use outline-offset, so they sit on the surrounding surface, not on the control fill
  ...pair('--color-focus', ['--color-bg', '--color-bg-subtle', '--color-bg-muted', '--color-bg-brand-subtle'], UI),
  ...pair('--color-focus', ['--glass-bg'], UI, '--scene-worst'),
];

export const SURFACES = [
  { name: 'light', selector: ':root' },
  { name: 'dark', selector: '[data-surface="dark"]' },
];

/**
 * Declarations of the first top-level block with this exact selector. Blocks nested in @media
 * (reduced motion) only override non-color tokens and are skipped.
 * @param {string} css @param {string} [selector] @returns {Map<string, string>}
 */
export function parseTokens(css, selector = ':root') {
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, '');
  let depth = 0;
  let prelude = 0;
  for (let i = 0; i < clean.length; i += 1) {
    if (clean[i] === '{') {
      if (depth === 0 && clean.slice(prelude, i).trim() === selector) {
        const tokens = new Map();
        const body = clean.slice(i + 1, clean.indexOf('}', i));
        for (const m of body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) tokens.set(m[1], m[2].trim());
        return tokens;
      }
      depth += 1;
    } else if (clean[i] === '}') {
      depth -= 1;
      if (depth === 0) prelude = i + 1;
    }
  }
  throw new Error(`no top-level "${selector}" block found`);
}

/** Tokens per surface; later surfaces override the first. @param {string} css */
export function parseSurfaces(css) {
  const base = parseTokens(css, SURFACES[0].selector);
  return SURFACES.map(({ name, selector }, i) => ({
    name,
    tokens: i === 0 ? base : new Map([...base, ...parseTokens(css, selector)]),
  }));
}

/**
 * Hex (#rgb, #rrggbb) or rgb(r g b / a) to [r, g, b, a], channels 0-255 and alpha 0-1.
 * @param {string} value @param {string} [name] @returns {number[]}
 */
export function parseColor(value, name = value) {
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(value);
  if (hex) {
    const h = hex[1].length === 3 ? hex[1].replace(/./g, (c) => c + c) : hex[1];
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)).concat(1);
  }
  const rgb = /^rgb\(\s*(\d+)\s+(\d+)\s+(\d+)\s*(?:\/\s*([\d.]+)\s*)?\)$/i.exec(value);
  if (rgb) return [Number(rgb[1]), Number(rgb[2]), Number(rgb[3]), rgb[4] === undefined ? 1 : Number(rgb[4])];
  throw new Error(`${name}: "${value}" is not a hex or rgb() color`);
}

/**
 * Follows var() chains to a literal color value.
 * @param {Map<string, string>} tokens @param {string} name @param {string[]} [seen] @returns {string}
 */
export function resolveColor(tokens, name, seen = []) {
  if (seen.includes(name)) throw new Error(`circular reference: ${[...seen, name].join(' -> ')}`);
  const value = tokens.get(name);
  if (value === undefined) throw new Error(`${name} is not defined`);
  const ref = /^var\((--[\w-]+)\)$/.exec(value);
  if (ref) return resolveColor(tokens, ref[1], [...seen, name]);
  parseColor(value, name);
  return value.toLowerCase();
}

/** Alpha-composites `top` over an opaque `bottom`. @param {number[]} top @param {number[]} bottom */
function composite(top, bottom) {
  const a = top[3];
  return [0, 1, 2].map((i) => top[i] * a + bottom[i] * (1 - a)).concat(1);
}

/** @param {number[]} rgb */
function luminance(rgb) {
  const [r, g, b] = rgb.slice(0, 3).map((c) => {
    const v = c / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** @param {number[]} rgb */
function toHex(rgb) {
  return `#${rgb.slice(0, 3).map((c) => Math.round(c).toString(16).padStart(2, '0')).join('')}`;
}

/** Contrast ratio; a translucent foreground is composited over the opaque background. @param {string} a @param {string} b */
export function contrastRatio(a, b) {
  const bg = parseColor(b);
  if (bg[3] < 1) throw new Error(`background "${b}" must be opaque; composite it first`);
  const fg = composite(parseColor(a), bg);
  const [hi, lo] = [luminance(fg), luminance(bg)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * @param {Map<string, string>} tokens
 * @param {{ fg: string, bg: string, min: number, over?: string }[]} pairs
 * @returns {{ fg: string, bg: string, min: number, over?: string, ratio: number, ok: boolean }[]}
 */
export function checkPairs(tokens, pairs) {
  return pairs.map((p) => {
    const backdrop = parseColor(resolveColor(tokens, p.over ?? '--color-bg'));
    const bg = toHex(composite(parseColor(resolveColor(tokens, p.bg)), backdrop));
    const ratio = contrastRatio(resolveColor(tokens, p.fg), bg);
    return { ...p, ratio, ok: ratio >= p.min };
  });
}

/** @param {string[]} args */
function main([file = resolve(import.meta.dirname, '../../src/styles/tokens.css')]) {
  let total = 0;
  let failed = 0;
  for (const { name, tokens } of parseSurfaces(readFileSync(file, 'utf8'))) {
    for (const r of checkPairs(tokens, PAIRS)) {
      const on = r.over ? `${r.bg} over ${r.over}` : r.bg;
      console.log(`${r.ok ? 'ok  ' : 'FAIL'} ${name.padEnd(5)} ${r.ratio.toFixed(2).padStart(5)} >= ${r.min}  ${r.fg} on ${on}`);
      total += 1;
      if (!r.ok) failed += 1;
    }
  }
  console.log(`${total - failed}/${total} pairs pass`);
  if (failed) process.exitCode = 1;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    main(process.argv.slice(2));
  } catch (err) {
    console.error(err instanceof Error ? err.message : err);
    process.exitCode = 1;
  }
}
