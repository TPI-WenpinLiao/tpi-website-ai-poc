// Fails when a component's <style> hard-codes a value that should come from src/styles/tokens.css:
// hex colors, color functions, or lengths and durations with a unit (12px, 1.5rem, 200ms).
// Unitless numbers (line-height factors, flex, aspect-ratio), percentages, fr and 0 are allowed.
// Breakpoints come from src/styles/media.css, so a literal in @media is caught by the same rule.
// Easing comes from --ease-* as well: easing keywords and functions are reported, and `linear` is
// allowed only in a rule that sets animation-timeline (scroll-driven: progress is the scroll position). A `transition`
// or `animation` shorthand item without one, and a rule with `transition-duration` or
// `animation-name` but no timing function, fall back to the browser's `ease` and are reported too.
// Also fails when var(--x) names a custom property that neither tokens.css nor the same file
// declares, so a renamed or removed token can't silently fall back to nothing.
// Scope: every .astro file under DIRS, so new pages and templates are checked without listing them,
// and src/styles/base.css (BASE).
// Run: node scripts/design/token-usage.mjs

import { readFileSync, readdirSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = resolve(import.meta.dirname, '../..');
const DIRS = ['src/components/ui', 'src/layouts', 'src/pages'];
const TOKENS = 'src/styles/tokens.css';
const BASE = 'src/styles/base.css';

const RULES = [
  { name: 'hex color', re: /#[0-9a-f]{3,8}\b/gi },
  { name: 'color function', re: /\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color-mix)\(/gi },
  { name: 'length or duration', re: /(?<![\w-])-?(?:\d*\.)?\d+(?:px|rem|em|vw|vh|vmin|vmax|vi|vb|ch|ex|ms|s|deg)\b/gi },
  { name: 'easing', re: /(?<![\w-])(?:ease(?:-in-out|-in|-out)?|step-start|step-end)(?![\w-])|(?<![\w-])(?:cubic-bezier|steps|linear)\(/gi },
];

/** Splits a declaration value on the commas that are not inside parentheses. @param {string} value */
const topLevelItems = (value) => {
  const items = [''];
  let depth = 0;
  for (const ch of value) {
    if (ch === '(') depth += 1;
    if (ch === ')') depth -= 1;
    if (ch === ',' && depth === 0) items.push('');
    else items[items.length - 1] += ch;
  }
  return items.map((i) => i.trim());
};

const EASED = /var\(\s*--ease-|(?<![\w-])linear(?![\w(-])/;

// Transitions and animations that leave the timing function to the browser default. `css` has
// comments blanked out; returns [{ index, text }] with the offset into `css`.
/** @param {string} css */
function implicitEasing(css) {
  const found = [];
  for (const m of css.matchAll(/(?<![\w-])(transition|animation)\s*:\s*([^;{}]*)/g)) {
    for (const item of topLevelItems(m[2])) {
      if (item && item !== 'none' && !(m[1] === 'transition' ? /var\(\s*--ease-/ : EASED).test(item)) {
        found.push({ index: m.index, text: `${m[1]}: ${item}` });
      }
    }
  }
  for (const m of css.matchAll(/\{([^{}]*)\}/g)) {
    const body = m[1];
    for (const [longhand, timing, shorthand] of [
      ['transition-duration', 'transition-timing-function', /(?<![\w-])transition\s*:/],
      ['animation-name', 'animation-timing-function', /(?<![\w-])animation\s*:/],
    ]) {
      const at = body.search(new RegExp(`(?<![\\w-])${longhand}\\s*:`));
      if (at !== -1 && !body.includes(`${timing}`) && !shorthand.test(body)) {
        found.push({ index: m.index + 1 + at, text: `${longhand} without ${timing}` });
      }
    }
    // `linear` is only for scroll-driven animations: a rule that also sets animation-timeline
    const scrollDriven = /(?<![\w-])animation-timeline\s*:/.test(body);
    for (const d of body.matchAll(/(?<![\w-])(transition-timing-function|animation-timing-function|animation)\s*:\s*([^;]*)/g)) {
      if (!/(?<![\w-])linear(?![\w(-])/.test(d[2])) continue;
      if (d[1] === 'transition-timing-function' || !scrollDriven) {
        found.push({ index: m.index + 1 + /** @type {number} */ (d.index), text: `${d[1]}: linear without animation-timeline` });
      }
    }
  }
  return found;
}

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
  for (const block of source.matchAll(/<style([^>]*)>([\s\S]*?)<\/style>/g)) {
    const offset = source.slice(0, block.index + block[0].indexOf('>') + 1).split('\n').length - 1;
    // Blank out comments and @import lines but keep line breaks so line numbers stay right
    const css = block[2]
      .replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, ' '))
      .replace(/@import[^;]*;/g, (c) => c.replace(/[^\n]/g, ' '));
    for (const v of implicitEasing(css)) {
      found.push({ line: offset + css.slice(0, v.index).split('\n').length, rule: 'implicit easing', text: v.text });
    }
    css.split('\n').forEach((text, i) => {
      for (const { name, re } of RULES) {
        for (const m of text.matchAll(re)) found.push({ line: offset + i + 1, rule: name, text: m[0] });
      }
      for (const m of text.matchAll(/var\(\s*(--[\w-]+)/g)) {
        if (!declared.has(m[1])) found.push({ line: offset + i + 1, rule: 'undefined token', text: m[1] });
      }
    });
  }
  return found.sort((a, b) => a.line - b.line);
}

function sourceFiles() {
  const astro = DIRS.flatMap((dir) =>
    readdirSync(join(ROOT, dir), { recursive: true })
      .filter((f) => String(f).endsWith('.astro'))
      .map((f) => join(dir, String(f)).split('\\').join('/')),
  );
  return [...astro, BASE];
}

// A plain CSS file is checked as one <style> block, on the same lines
const asSource = (file, text) => (file.endsWith('.css') ? `<style>${text}</style>` : text);

function main() {
  const files = sourceFiles();
  const tokens = declaredProperties(readFileSync(join(ROOT, TOKENS), 'utf8'));
  let count = 0;
  for (const file of files) {
    for (const v of findViolations(asSource(file, readFileSync(join(ROOT, file), 'utf8')), tokens)) {
      console.log(`${relative(ROOT, join(ROOT, file))}:${v.line}  ${v.rule}: ${v.text}`);
      count += 1;
    }
  }
  console.log(`${files.length} files checked, ${count} hard-coded values or undefined tokens`);
  if (count) process.exitCode = 1;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) main();
