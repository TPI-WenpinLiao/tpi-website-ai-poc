// Enforces the CLAUDE.md rule "新元件必須同步加到 design-system 展示頁": every component in
// src/components/ui must be imported by the showcase page, src/pages/design-system/index.astro.
// Also checks that every token in src/styles/tokens.css belongs to a group in token-groups.mjs,
// which is what the page renders, and that no group pattern is stale.
// Run: node scripts/design/showcase.mjs

import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseTokens } from './contrast.mjs';
import { groupTokens } from './token-groups.mjs';

const ROOT = resolve(import.meta.dirname, '../..');
const COMPONENTS = 'src/components/ui';
const PAGE = 'src/pages/design-system/index.astro';
const TOKENS = 'src/styles/tokens.css';

/**
 * Components the page source does not import from components/ui.
 * @param {string[]} components file names such as "Button.astro"
 * @param {string} page source of the showcase page
 */
export function missingComponents(components, page) {
  const imported = new Set([...page.matchAll(/from\s+['"][^'"]*components\/ui\/([\w-]+\.astro)['"]/g)].map((m) => m[1]));
  return components.filter((c) => !imported.has(c));
}

function main() {
  const components = readdirSync(join(ROOT, COMPONENTS)).filter((f) => f.endsWith('.astro'));
  const missing = missingComponents(components, readFileSync(join(ROOT, PAGE), 'utf8'));
  for (const m of missing) console.log(`${COMPONENTS}/${m} is not shown on ${PAGE}`);
  console.log(`${components.length - missing.length}/${components.length} components on the showcase page`);

  const names = [...parseTokens(readFileSync(join(ROOT, TOKENS), 'utf8')).keys()];
  const { groups, ungrouped, unused } = groupTokens(names);
  for (const t of ungrouped) console.log(`${t} is in no group of scripts/design/token-groups.mjs`);
  for (const p of unused) console.log(`scripts/design/token-groups.mjs pattern matches no token: ${p}`);
  const grouped = groups.reduce((n, g) => n + g.tokens.length, 0);
  console.log(`${grouped}/${grouped + ungrouped.length} tokens grouped for the showcase page`);
  if (missing.length || ungrouped.length || unused.length) process.exitCode = 1;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) main();
