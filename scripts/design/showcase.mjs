// Enforces the CLAUDE.md rule "新元件必須同步加到 design-system 展示頁": every component in
// src/components/ui must be imported by the showcase page, src/pages/design-system/index.astro.
// Run: node scripts/design/showcase.mjs

import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = resolve(import.meta.dirname, '../..');
const COMPONENTS = 'src/components/ui';
const PAGE = 'src/pages/design-system/index.astro';

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
  if (missing.length) process.exitCode = 1;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) main();
