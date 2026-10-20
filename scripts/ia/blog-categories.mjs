// Fetches the main and secondary category of every published blog article from the current site's
// blog API, so scripts/ia/sitemap.mjs can place articles by subcategory (article URLs only carry
// the main category). Writes docs/ia/blog-categories.csv. Run: node scripts/ia/blog-categories.mjs

import { writeFile } from 'node:fs/promises';
import { request } from '../inventory/http.mjs';
import { csvCell } from '../inventory/csv.mjs';

const OUT = 'docs/ia/blog-categories.csv';
const COM = 'https://www.tpisoftware.com';
const VN = 'https://www.tpisoftware.vn';
// Same sources as scripts/inventory/crawl.mjs
const BLOG_SOURCES = [
  { locale: 'zh-TW', lang: 'ZH-TW', origin: COM },
  { locale: 'en', lang: 'EN-US', origin: COM },
  { locale: 'vi', lang: 'VI-VN', origin: VN },
];

async function cmsPost(path, lang, body) {
  const res = await request(`${COM}/cms/api/v1/f/article/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Lang': lang },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`blog API ${path} ${lang}: HTTP ${res.status}`);
  return res.json();
}

const rows = [];
for (const { locale, lang, origin } of BLOG_SOURCES) {
  const cats = await cmsPost('category', lang, {});
  const catUrl = new Map();
  for (const c of cats.data.content) {
    catUrl.set(c.categoryNo, c.custUrl);
    for (const s of c.subcategories) catUrl.set(s.categoryNo, s.custUrl);
  }
  const articles = [];
  let total = 0;
  for (let page = 1; page < 100 && (page === 1 || articles.length < total); page++) {
    const res = await cmsPost('home', lang, { page, limit: 50 });
    total = res.data.totalCount;
    articles.push(...res.data.content.articles);
  }
  for (const a of articles) {
    const main = catUrl.get(a.multiCate?.[0]?.mainCate);
    if (!main) continue;
    const sub = catUrl.get(a.multiCate[0].secCate) ?? '';
    rows.push({ url: new URL(`${main}/${a.articleCustUrl}`, origin).href.replace(/\/$/, ''), locale, main_category: main, sub_category: sub });
  }
}

rows.sort((a, b) => a.url.localeCompare(b.url));
const columns = ['url', 'locale', 'main_category', 'sub_category'];
await writeFile(OUT, `${[columns.join(','), ...rows.map((r) => columns.map((c) => csvCell(r[c])).join(','))].join('\n')}\n`);
console.log(`${rows.length} articles written to ${OUT}`);
