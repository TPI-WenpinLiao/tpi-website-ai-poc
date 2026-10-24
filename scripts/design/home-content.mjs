// Checks that the home page copy of every locale (src/data/home/<locale>.ts) and src/data/site.ts
// is still on the current site (M3-04, #17).
// Every entry names the page it was taken from (the current site's page in that locale); this
// fetches each page once and looks for the entry's quote (or its text) in the page's visible text,
// ignoring whitespace and U+200B.
// Needs network access to www.tpisoftware.com, so it is not part of `npm run check`.
//
//   node scripts/design/home-content.mjs
import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { request } from '../inventory/http.mjs';
import { pageText, squash } from '../lib/page-text.mjs';
import * as site from '../../src/data/site.ts';

const HOME_DIR = resolve(import.meta.dirname, '../../src/data/home');
const homes = await Promise.all(
  readdirSync(HOME_DIR)
    .filter((f) => f.endsWith('.ts') && f !== 'index.ts')
    .map(async (f) => [f.replace(/\.ts$/, ''), (await import(pathToFileURL(resolve(HOME_DIR, f)).href)).home]),
);

// Every { text, source } entry anywhere in the module's exports
function collect(value, path = []) {
  if (Array.isArray(value)) return value.flatMap((v, i) => collect(v, [...path, i]));
  if (typeof value !== 'object' || value === null) return [];
  if (typeof value.text === 'string' && typeof value.source?.url === 'string') return [{ path: path.join('.'), ...value }];
  return Object.entries(value).flatMap(([k, v]) => collect(v, [...path, k]));
}

const entries = [...homes.flatMap(([locale, home]) => collect(home, ['home', locale])), ...collect(site, ['site'])];
const pages = new Map();
let failed = 0;
for (const url of new Set(entries.map((e) => e.source.url))) {
  const res = await request(url);
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  pages.set(url, squash(pageText(await res.text())));
}
for (const e of entries) {
  const quote = e.source.quote ?? e.text;
  const ok = pages.get(e.source.url)?.includes(squash(quote));
  if (!ok) failed += 1;
  console.log(`${ok ? 'ok  ' : 'MISS'} ${e.path}: ${quote} (${e.source.url})`);
}
console.log(`${entries.length - failed}/${entries.length} quotes found on ${pages.size} pages`);
process.exit(failed ? 1 : 0);
