// Checks that the copy in src/data/home.ts and src/data/site.ts is still on the current site
// (M3-04, #17).
// Every entry names the page it was taken from; this fetches each page once and looks for the
// entry's quote (or its text) in the page's visible text, ignoring whitespace and U+200B.
// Needs network access to www.tpisoftware.com, so it is not part of `npm run check`.
//
//   node scripts/design/home-content.mjs
import { request } from '../inventory/http.mjs';
import { pageText, squash } from '../lib/page-text.mjs';
import * as home from '../../src/data/home.ts';
import * as site from '../../src/data/site.ts';

// Every { text, source } entry anywhere in the module's exports
function collect(value, path = []) {
  if (Array.isArray(value)) return value.flatMap((v, i) => collect(v, [...path, i]));
  if (typeof value !== 'object' || value === null) return [];
  if (typeof value.text === 'string' && typeof value.source?.url === 'string') return [{ path: path.join('.'), ...value }];
  return Object.entries(value).flatMap(([k, v]) => collect(v, [...path, k]));
}

const entries = [...collect(home, ['home']), ...collect(site, ['site'])];
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
