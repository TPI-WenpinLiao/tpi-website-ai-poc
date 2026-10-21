// Fails when a component's <style> hard-codes a value that should come from src/styles/tokens.css:
// hex colors, color functions, or lengths and durations with a unit (12px, 1.5rem, 200ms).
// Unitless numbers (line-height factors, flex, aspect-ratio), percentages, fr and 0 are allowed.
// Breakpoints come from src/styles/media.css, so a literal in @media is caught by the same rule.
// Scope: FILES below. Wireframe pages (M3-01) are out of scope; they are removed after M4-04.
// Run: node scripts/design/token-usage.mjs

import { readFileSync, readdirSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = resolve(import.meta.dirname, '../..');
const DIRS = ['src/components/ui', 'src/pages/design-system'];
const FILES = ['src/layouts/BaseLayout.astro'];

const RULES = [
  { name: 'hex color', re: /#[0-9a-f]{3,8}\b/gi },
  { name: 'color function', re: /\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color-mix)\(/gi },
  { name: 'length or duration', re: /(?<![\w-])-?(?:\d*\.)?\d+(?:px|rem|em|vw|vh|vmin|vmax|vi|vb|ch|ex|ms|s|deg)\b/gi },
];

// Returns [{ line, rule, text }] for every hard-coded value inside <style> blocks.
export function findViolations(source) {
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
  let count = 0;
  for (const file of files) {
    for (const v of findViolations(readFileSync(join(ROOT, file), 'utf8'))) {
      console.log(`${relative(ROOT, join(ROOT, file))}:${v.line}  ${v.rule}: ${v.text}`);
      count += 1;
    }
  }
  console.log(`${files.length} files checked, ${count} hard-coded values`);
  if (count) process.exitCode = 1;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) main();
