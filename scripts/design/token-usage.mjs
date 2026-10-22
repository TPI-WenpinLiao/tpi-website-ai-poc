// Fails when a component's <style> hard-codes a value that should come from src/styles/tokens.css:
// hex colors, color functions, or lengths and durations with a unit (12px, 1.5rem, 200ms).
// Unitless numbers (line-height factors, flex, aspect-ratio), percentages, fr and 0 are allowed.
// Breakpoints come from src/styles/media.css, so a literal in @media is caught by the same rule.
// Also fails when var(--x) names a custom property that neither tokens.css nor the same file
// declares, so a renamed or removed token can't silently fall back to nothing.
// Scope: FILES below. Wireframe pages (M3-01) are out of scope; they are removed after M4-04.
// Run: node scripts/design/token-usage.mjs

import { readFileSync, readdirSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = resolve(import.meta.dirname, '../..');
const DIRS = ['src/components/ui', 'src/pages/design-system'];
const FILES = ['src/layouts/BaseLayout.astro', 'src/pages/index.astro'];
const TOKENS = 'src/styles/tokens.css';

const RULES = [
  { name: 'hex color', re: /#[0-9a-f]{3,8}\b/gi },
  { name: 'color function', re: /\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color-mix)\(/gi },
  { name: 'length or duration', re: /(?<![\w-])-?(?:\d*\.)?\d+(?:px|rem|em|vw|vh|vmin|vmax|vi|vb|ch|ex|ms|s|deg)\b/gi },
];

/** Custom properties declared anywhere in a CSS or .astro source. @param {string} source */
export function declaredProperties(source) {
  return new Set([...source.matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1]));
}

// Returns [{ line, rule, text }] for every hard-coded value or undefined var() inside <style>
// blocks. `tokens` is the set of custom properties declared in tokens.css.
/** @param {string} source @param {Set<string>} [tokens] */
export function findViolations(source, tokens = new Set()) {
  const declared = new Set([...tokens, ...declaredProperties(source)]);
  const found = [];
  for (const block of source.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) {
    const offset = source.slice(0, block.index + block[0].indexOf('>') + 1).split('\n').length - 1;
    // Blank out comments and @import lines but keep line breaks so line numbers stay right
    const css = block[1]
      .replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, ' '))
      .replace(/@import[^;]*;/g, (c) => c.replace(/[^\n]/g, ' '));
    css.split('\n').forEach((text, i) => {
      for (const { name, re } of RULES) {
        for (const m of text.matchAll(re)) found.push({ line: offset + i + 1, rule: name, text: m[0] });
      }
      for (const m of text.matchAll(/var\(\s*(--[\w-]+)/g)) {
        if (!declared.has(m[1])) found.push({ line: offset + i + 1, rule: 'undefined token', text: m[1] });
      }
    });
  }
  return found;
}

function astroFiles() {
  const fromDirs = DIRS.flatMap((dir) =>
    readdirSync(join(ROOT, dir), { recursive: true })
      .filter((f) => String(f).endsWith('.astro'))
      .map((f) => join(dir, String(f))),
  );
  return [...fromDirs, ...FILES];
}

function main() {
  const files = astroFiles();
  const tokens = declaredProperties(readFileSync(join(ROOT, TOKENS), 'utf8'));
  let count = 0;
  for (const file of files) {
    for (const v of findViolations(readFileSync(join(ROOT, file), 'utf8'), tokens)) {
      console.log(`${relative(ROOT, join(ROOT, file))}:${v.line}  ${v.rule}: ${v.text}`);
      count += 1;
    }
  }
  console.log(`${files.length} files checked, ${count} hard-coded values or undefined tokens`);
  if (count) process.exitCode = 1;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) main();
