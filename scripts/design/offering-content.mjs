// Checks that the copy in the offering and hub entries is still on their current-site pages
// (M3-05, #18; all locales since M5-02, #27; hubs and merged pages since M5-01, #26; ESG advisors
// since #107): tagline, features, useCases, faq and highlights of every entry that isn't a draft, and
// the name, job title, affiliation and lists of every person entry. A line counts as found
// when it is on any of the entry's sourceUrl pages (merged pages list several), after correcting the
// typos in CORRECTIONS. Same matching as scripts/design/home-content.mjs, except that a FAQ answer
// that isn't on the page as a whole is checked sentence by sentence: offerings.mjs joins an answer's
// paragraph and list items (#106).
// Needs network access to www.tpisoftware.com, so it is not part of `npm run check`.
//
//   node scripts/design/offering-content.mjs
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { parse } from 'yaml';
import { request } from '../inventory/http.mjs';
import { pageText, squash } from '../lib/page-text.mjs';

// Typos on the current site that the entries correct, as [current site, entry]; matched after squash
const CORRECTIONS = [
  ['開放式APl', '開放式API'],
  ['HRM等,', 'HRM等，'],
  ['簡化驗證流程,無需記憶複雜密碼,實現', '簡化驗證流程，無需記憶複雜密碼，實現'],
  ['提升盤查效率.', '提升盤查效率。'],
];

const COLLECTIONS = ['offering', 'hub', 'person'];

const frontmatter = (md) => parse(/^---\n([\s\S]*?)\n---/.exec(md)?.[1] ?? '');
const pairs = (items, key, fields) => (items ?? []).flatMap((item, i) => fields.map((f) => [`${key}.${i}.${f}`, item[f]]));
// Sentences and 「title：description」 parts, without the punctuation that joined them
const pieces = (text) => text.split(/[。.!?！？：:]\s+|[。！？：]/).map((p) => p.replace(/[。.]$/, '')).filter((p) => squash(p));
const lines = (items, key) => (items ?? []).map((item, i) => [`${key}.${i}`, item]);
// person entries: the title is the advisor's name; string fields and lists as on the page
const PERSON_FIELDS = ['title', 'jobTitle', 'affiliation'];
const PERSON_LISTS = ['experience', 'education', 'expertise', 'certifications'];

const checks = [];
for (const collection of COLLECTIONS) {
  const dir = new URL(`../../src/content/${collection}/`, import.meta.url).pathname;
  const files = (await readdir(dir, { recursive: true })).filter((f) => f.endsWith('.md')).sort();
  for (const file of files) {
    const data = frontmatter(await readFile(join(dir, file), 'utf8'));
    const urls = [data.sourceUrl].flat().filter(Boolean);
    if (data.draft || urls.length === 0) continue;
    const texts = [
      ...(data.tagline ? [['tagline', data.tagline]] : []),
      ...pairs(data.features, 'features', ['title', 'body']),
      ...pairs(data.useCases, 'useCases', ['title', 'body']),
      ...pairs(data.faq, 'faq', ['question', 'answer']),
      ...pairs(data.highlights, 'highlights', ['title', 'body']),
      ...(collection === 'person'
        ? [...PERSON_FIELDS.filter((k) => data[k]).map((k) => [k, data[k]]), ...PERSON_LISTS.flatMap((k) => lines(data[k], k))]
        : []),
    ];
    checks.push(...texts.map(([path, text]) => ({ file: `${collection}/${file}`, path, text, urls })));
  }
}

const pages = new Map();
for (const url of new Set(checks.flatMap((c) => c.urls))) {
  const res = await request(url);
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  pages.set(url, CORRECTIONS.reduce((text, [from, to]) => text.replaceAll(from, to), squash(pageText(await res.text()))));
}
let failed = 0;
for (const c of checks) {
  const found = (parts) => c.urls.some((url) => parts.every((p) => pages.get(url).includes(squash(p))));
  const ok = found([c.text]) || (/^faq\.\d+\.answer$/.test(c.path) && found(pieces(c.text)));
  if (!ok) failed += 1;
  console.log(`${ok ? 'ok  ' : 'MISS'} ${c.file} ${c.path}: ${c.text}`);
}
console.log(`${checks.length - failed}/${checks.length} lines found on ${pages.size} pages`);
process.exit(failed ? 1 : 0);
