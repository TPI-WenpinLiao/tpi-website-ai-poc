// Checks that the copy in the offering entries is still on their current-site page
// (M3-05, #18; all locales since M5-02, #27): tagline, features and useCases of every entry that
// isn't a draft, against the first sourceUrl. Same matching as scripts/design/home-content.mjs.
// Needs network access to www.tpisoftware.com, so it is not part of `npm run check`.
//
//   node scripts/design/offering-content.mjs
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { parse } from 'yaml';
import { request } from '../inventory/http.mjs';
import { pageText, squash } from '../lib/page-text.mjs';

const DIR = new URL('../../src/content/offering/', import.meta.url);

const frontmatter = (md) => parse(/^---\n([\s\S]*?)\n---/.exec(md)?.[1] ?? '');

const checks = [];
const files = (await readdir(DIR.pathname, { recursive: true })).filter((f) => f.endsWith('.md')).sort();
for (const file of files) {
  const data = frontmatter(await readFile(join(DIR.pathname, file), 'utf8'));
  const url = [data.sourceUrl].flat()[0];
  if (data.draft || !url) continue;
  const texts = [
    ...(data.tagline ? [['tagline', data.tagline]] : []),
    ...(data.features ?? []).flatMap((f, i) => [[`features.${i}.title`, f.title], [`features.${i}.body`, f.body]]),
    ...(data.useCases ?? []).flatMap((u, i) => [[`useCases.${i}.title`, u.title], [`useCases.${i}.body`, u.body]]),
  ];
  checks.push(...texts.map(([path, text]) => ({ file, path, text, url })));
}

const pages = new Map();
for (const url of new Set(checks.map((c) => c.url))) {
  const res = await request(url);
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  pages.set(url, squash(pageText(await res.text())));
}
let failed = 0;
for (const c of checks) {
  const ok = pages.get(c.url).includes(squash(c.text));
  if (!ok) failed += 1;
  console.log(`${ok ? 'ok  ' : 'MISS'} ${c.file} ${c.path}: ${c.text}`);
}
console.log(`${checks.length - failed}/${checks.length} lines found on ${pages.size} pages`);
process.exit(failed ? 1 : 0);
