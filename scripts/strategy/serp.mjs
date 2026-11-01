#!/usr/bin/env node
// 抓 Bing 台灣繁中的搜尋結果前 10 筆（標題、網址、摘要），印成 JSON。
// 用途：docs/strategy/search-intent.md 的搜尋意圖觀察。
//
//   node scripts/strategy/serp.mjs "昕力資訊" "API 管理平台"
//
// 每組查詢之間等 5 秒。結果裡有 `related` 欄位：標題或摘要是否含查詢詞的任一個字詞，
// 用來判斷 Bing 是否回了跟查詢無關的結果（2026-10-31 實測全部無關，見 search-intent.md「限制」）。
import { chromium } from 'playwright';

const queries = process.argv.slice(2);
if (queries.length === 0) {
  console.error('用法：node scripts/strategy/serp.mjs <查詢詞> [<查詢詞> ...]');
  process.exit(1);
}

const searchUrl = (q) =>
  `https://www.bing.com/search?q=${encodeURIComponent(q)}&cc=TW&setlang=zh-Hant&mkt=zh-TW`;

const browser = await chromium.launch();
const context = await browser.newContext({ locale: 'zh-TW' });
const page = await context.newPage();
const out = [];

for (const [i, q] of queries.entries()) {
  if (i > 0) await page.waitForTimeout(5000);
  const url = searchUrl(q);
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  const results = await page.$$eval('li.b_algo', (items) =>
    items.slice(0, 10).map((li) => ({
      title: li.querySelector('h2')?.textContent?.trim() ?? '',
      cite: li.querySelector('cite')?.textContent?.trim() ?? '',
      snippet: (li.querySelector('.b_caption p, [class^="b_lineclamp"]')?.textContent ?? '').trim().slice(0, 160),
    })),
  );
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  for (const r of results) {
    const text = `${r.title} ${r.snippet} ${r.cite}`.toLowerCase();
    r.related = terms.some((t) => text.includes(t));
  }
  out.push({ query: q, url, title: await page.title(), results });
}

await browser.close();
console.log(JSON.stringify(out, null, 2));
