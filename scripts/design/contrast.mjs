// Checks the semantic color pairs in src/styles/tokens.css against WCAG 2.2 AA contrast:
// 4.5:1 for text (1.4.3), 3:1 for UI components and focus indicators (1.4.11).
// PAIRS is the single list of foreground/background combinations components are allowed to use;
// adding a color token that pairs with another means adding the pair here.
// Disabled controls are exempt from 1.4.3, so --color-disabled-* has no pair.
// Exits non-zero when a pair fails or a token can't be resolved to a hex color.
// Run: node scripts/design/contrast.mjs [tokens.css]

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const TEXT = 4.5;
const UI = 3;

const pair = (fg, bgs, min) => bgs.map((bg) => ({ fg, bg, min }));

export const PAIRS = [
  ...pair('--color-text', ['--color-bg', '--color-bg-subtle', '--color-bg-muted', '--color-bg-brand-subtle', '--color-bg-accent-subtle'], TEXT),
  ...pair('--color-text-muted', ['--color-bg', '--color-bg-subtle', '--color-bg-muted', '--color-bg-brand-subtle', '--color-bg-accent-subtle'], TEXT),
  ...pair('--color-text-brand', ['--color-bg', '--color-bg-subtle', '--color-bg-brand-subtle'], TEXT),
  ...pair('--color-text-accent', ['--color-bg', '--color-bg-subtle', '--color-bg-accent-subtle'], TEXT),
  ...pair('--color-text-inverse', ['--color-bg-brand', '--color-bg-brand-strong'], TEXT),
  ...pair('--color-text-inverse-muted', ['--color-bg-brand', '--color-bg-brand-strong'], TEXT),
  ...pair('--color-action-text', ['--color-action', '--color-action-hover'], TEXT),
  ...pair('--color-action', ['--color-bg', '--color-bg-subtle', '--color-action-subtle-hover'], TEXT),
  ...pair('--color-link', ['--color-bg', '--color-bg-subtle', '--color-bg-brand-subtle'], TEXT),
  ...pair('--color-link-hover', ['--color-bg', '--color-bg-subtle'], TEXT),
  ...pair('--color-link-inverse', ['--color-bg-brand', '--color-bg-brand-strong'], TEXT),
  ...pair('--color-error', ['--color-bg', '--color-error-bg'], TEXT),
  ...pair('--color-success', ['--color-bg', '--color-success-bg'], TEXT),
  ...pair('--color-border-strong', ['--color-bg', '--color-bg-subtle'], UI),
  ...pair('--color-error', ['--color-bg-subtle'], UI),
  // Focus rings use outline-offset, so they sit on the surrounding surface, not on the control fill
  ...pair('--color-focus', ['--color-bg', '--color-bg-subtle', '--color-bg-brand-subtle'], UI),
  ...pair('--color-focus-inverse', ['--color-bg-brand', '--color-bg-brand-strong'], UI),
];

// Declarations of the first top-level :root block; later blocks (e.g. reduced motion) only
// override non-color tokens.
/** @param {string} css @returns {Map<string, string>} */
export function parseTokens(css) {
  const block = /:root\s*\{([^}]*)\}/.exec(css.replace(/\/\*[\s\S]*?\*\//g, ''));
  if (!block) throw new Error('no :root block found');
  const tokens = new Map();
  for (const m of block[1].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) tokens.set(m[1], m[2].trim());
  return tokens;
}

/** @param {Map<string, string>} tokens @param {string} name @param {string[]} [seen] @returns {string} */
export function resolveColor(tokens, name, seen = []) {
  if (seen.includes(name)) throw new Error(`circular reference: ${[...seen, name].join(' -> ')}`);
  const value = tokens.get(name);
  if (value === undefined) throw new Error(`${name} is not defined`);
  const ref = /^var\((--[\w-]+)\)$/.exec(value);
  if (ref) return resolveColor(tokens, ref[1], [...seen, name]);
  if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value)) throw new Error(`${name}: "${value}" is not a hex color`);
  return value.toLowerCase();
}

/** @param {string} hex */
function luminance(hex) {
  const h = hex.length === 4 ? hex.replace(/[0-9a-f]/gi, (c) => c + c) : hex;
  const [r, g, b] = [1, 3, 5].map((i) => {
    const v = parseInt(h.slice(i, i + 2), 16) / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** @param {string} a @param {string} b */
export function contrastRatio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * @param {Map<string, string>} tokens
 * @param {{ fg: string, bg: string, min: number }[]} pairs
 * @returns {{ fg: string, bg: string, min: number, ratio: number, ok: boolean }[]}
 */
export function checkPairs(tokens, pairs) {
  return pairs.map(({ fg, bg, min }) => {
    const ratio = contrastRatio(resolveColor(tokens, fg), resolveColor(tokens, bg));
    return { fg, bg, min, ratio, ok: ratio >= min };
  });
}

function main([file = resolve(import.meta.dirname, '../../src/styles/tokens.css')]) {
  const results = checkPairs(parseTokens(readFileSync(file, 'utf8')), PAIRS);
  for (const r of results) {
    console.log(`${r.ok ? 'ok  ' : 'FAIL'} ${r.ratio.toFixed(2).padStart(5)} >= ${r.min}  ${r.fg} on ${r.bg}`);
  }
  const failed = results.filter((r) => !r.ok).length;
  console.log(`${results.length - failed}/${results.length} pairs pass`);
  if (failed) process.exitCode = 1;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    main(process.argv.slice(2));
  } catch (err) {
    console.error(err.message);
    process.exitCode = 1;
  }
}
