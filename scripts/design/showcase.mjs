// Enforces the CLAUDE.md rule "新元件必須同步加到 design-system 展示頁": every component in
// src/components/ui must be imported by the showcase page, src/pages/design-system/index.astro.
// Also checks that every token in src/styles/tokens.css belongs to a group in token-groups.mjs,
// which is what the page renders, that no group pattern is stale, and that no group mixes `value`
// tokens with ones that have a specimen.
// Internal pages (/design-system, /wireframes, /prototypes) must stay out of docs/ia/nodes.csv: navigation.csv can
// only point at nodes and the sitemap is built from them, so this keeps them out of both.
// Run: node scripts/design/showcase.mjs

import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseCsv } from '../inventory/csv.mjs';
import { groupTokens, tokenNames } from './token-groups.mjs';

const ROOT = resolve(import.meta.dirname, '../..');
const COMPONENTS = 'src/components/ui';
const PAGE = 'src/pages/design-system/index.astro';
const TOKENS = 'src/styles/tokens.css';
const NODES = 'docs/ia/nodes.csv';
const INTERNAL = ['/design-system', '/wireframes', '/prototypes'];

/**
 * Components the page source does not import from components/ui.
 * @param {string[]} components file names such as "Button.astro"
 * @param {string} page source of the showcase page
 */
export function missingComponents(components, page) {
  const imported = new Set([...page.matchAll(/from\s+['"][^'"]*components\/ui\/([\w-]+\.astro)['"]/g)].map((m) => m[1]));
  return components.filter((c) => !imported.has(c));
}

/**
 * IA nodes whose path is an internal page or below one.
 * @param {{ id: string, path: string }[]} nodes rows of docs/ia/nodes.csv
 * @param {string[]} [internal]
 */
export function internalNodes(nodes, internal = INTERNAL) {
  return nodes.filter((n) => internal.some((p) => n.path === p || n.path.startsWith(`${p}/`)));
}

function main() {
  const components = readdirSync(join(ROOT, COMPONENTS)).filter((f) => f.endsWith('.astro'));
  const missing = missingComponents(components, readFileSync(join(ROOT, PAGE), 'utf8'));
  for (const m of missing) console.log(`${COMPONENTS}/${m} is not shown on ${PAGE}`);
  console.log(`${components.length - missing.length}/${components.length} components on the showcase page`);

  const names = tokenNames(readFileSync(join(ROOT, TOKENS), 'utf8'));
  const { groups, ungrouped, unused, mixed } = groupTokens(names);
  for (const t of ungrouped) console.log(`${t} is in no group of scripts/design/token-groups.mjs`);
  for (const p of unused) console.log(`scripts/design/token-groups.mjs pattern matches no token: ${p}`);
  for (const id of mixed) console.log(`scripts/design/token-groups.mjs group mixes value with specimen kinds: ${id}`);
  const grouped = groups.reduce((n, g) => n + g.tokens.length, 0);
  console.log(`${grouped}/${grouped + ungrouped.length} tokens grouped for the showcase page`);

  const listed = internalNodes(parseCsv(readFileSync(join(ROOT, NODES), 'utf8').replace(/^\uFEFF/, '')));
  for (const n of listed) console.log(`${NODES}: ${n.id} (${n.path}) is an internal page; keep it out of the IA`);
  console.log(`${INTERNAL.join(', ')}: ${listed.length ? 'listed' : 'not listed'} in ${NODES}`);
  if (missing.length || ungrouped.length || unused.length || mixed.length || listed.length) process.exitCode = 1;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) main();
