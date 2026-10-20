// Content audit for M1-02 (#3).
// Reads docs/research/inventory.csv (crawl columns), applies rule-based dispositions plus
// docs/research/audit-overrides.csv, then writes the audit columns back into inventory.csv
// and statistics into docs/research/audit-summary.json.
// Re-run after every crawl: node scripts/inventory/audit.mjs

import { writeFile } from 'node:fs/promises';
import { readCsv, csvCell } from './csv.mjs';

const INVENTORY = 'docs/research/inventory.csv';
const BROKEN = 'docs/research/broken-links.csv';
const OVERRIDES = 'docs/research/audit-overrides.csv';
const SUMMARY = 'docs/research/audit-summary.json';

// Keep news published on or after this date; older news is not migrated.
const NEWS_CUTOFF = '2024-01-01';
// Blog posts published before this date get flagged for an outdated-content check.
const BLOG_STALE_BEFORE = '2022-01-01';

const CRAWL_COLUMNS = [
  'url', 'final_url', 'status', 'locale', 'page_type', 'title', 'h1', 'last_updated', 'last_updated_source',
  'word_count', 'image_count', 'embedded_media', 'forms', 'nav_location', 'discovered_via', 'notes',
];
const AUDIT_COLUMNS = ['disposition', 'disposition_reason', 'to_confirm'];
const DISPOSITIONS = ['keep', 'rewrite', 'merge', 'drop'];

// ---------- Helpers ----------

const pathOf = (url) => new URL(url).pathname;
// Locale-independent route key, e.g. /en/products/x and tpisoftware.vn/products/x -> /products/x
const routeKey = (url) => pathOf(url).replace(/^\/(en|ja|vn)(?=\/|$)/, '') || '/';
const inNav = (row) => /(^|\| )(header|footer):/.test(row.nav_location);
const hasCjk = (s) => /[一-鿿]/.test(s);
const noteHas = (row, s) => row.notes.split('; ').some((n) => n.startsWith(s));
const LEGAL_PDF = /\/pdf\/(%E8%B3%87%E8%A8%8A%E5%AE%89%E5%85%A8%E6%94%BF%E7%AD%96|\d-\d(PrivacyPolicy|Use|Disclaimer))/;
// Subpages that sit under a product route but act as campaign / lead-gen landing pages.
const LANDING = /^\/products\/(systalk-ai-phison|systalk-viki\/vikibundle|systalk-audit\/quality-analysis(\/quiz)?|systalk-rpa\/enterp-diagnosis|digirunner\/awsmarketplace)$/;

// ---------- Rules ----------

function decide(row, ctx) {
  const key = routeKey(row.url);
  const type = row.page_type;
  const confirm = [];
  const out = (disposition, reason) => {
    // Broken links only matter for pages that will be migrated
    const broken = ctx.brokenOn.get(row.url) ?? ctx.brokenOn.get(row.final_url);
    if (broken && disposition !== 'drop') confirm.push(`內文含失效連結 ${broken} 筆（見 broken-links.csv），遷移時修正或移除`);
    return { disposition, disposition_reason: reason, to_confirm: confirm };
  };

  // Cross-cutting flags (do not decide disposition)
  if ((row.locale === 'en' || row.locale === 'vi') && (hasCjk(row.title) || hasCjk(row.h1))) {
    confirm.push(`${row.locale} 頁面的 title／h1 含中文，疑似未翻譯`);
  }
  const redirects = row.notes.match(/redirected from: (.*)$/)?.[1].split(' ').filter((u) => routeKey(u) !== key);
  const legacyRedirects = redirects?.filter((u) => routeKey(u) !== routeKey(row.final_url)) ?? [];
  if (type === 'home' && legacyRedirects.length) {
    confirm.push(`現站已將 ${legacyRedirects.map(routeKey).join('、')} 轉址到首頁；新站是否需要對應頁面或 301 由 M2 決定`);
  }

  // Broken routes
  if (row.status !== '200') {
    if (row.locale === 'ja') confirm.push('新站是否支援日文版待 M2 決定（現站 /ja 回 500）');
    return out('drop', `HTTP ${row.status}，現站頁面錯誤，無內容可遷移`);
  }

  // Case-variant duplicates: the variant not linked from nav merges into the canonical route
  const twin = ctx.caseTwins.get(row.url);
  if (twin) return out('merge', `大小寫不同的重複路由，內容與 ${twin} 相同，合併至該頁（新站以小寫路由為準並 301）`);

  switch (type) {
    case 'home':
      return out('rewrite', '首頁，依新 IA 重新規劃區塊與內容');
    case 'product':
    case 'service':
    case 'solution': {
      if (key.startsWith('/esg-advisory/')) {
        confirm.push('人物頁：確認顧問仍合作中、經歷內容與照片授權');
        return out('keep', 'ESG 顧問個人介紹，內容為人物經歷，原文保留，版面依新設計調整');
      }
      if (LANDING.test(key)) {
        confirm.push('不在導覽的行銷 landing page，確認是否仍在投放或有外部連結');
        return out('rewrite', '產品行銷／名單收集頁，依新 IA 與 M6 表單元件重做');
      }
      if (!inNav(row)) confirm.push('不在導覽，確認此產品／方案是否仍在銷售');
      return out('rewrite', `${{ product: '產品', service: '服務', solution: '解決方案' }[type]}頁，依新 IA 與內容模型重寫結構`);
    }
    case 'product-index':
    case 'solution-index':
      return out('rewrite', '列表頁，依新 IA 的產品分類重建');
    case 'about':
    case 'contact':
      return out('rewrite', `${type === 'about' ? '公司' : '聯絡'}資訊頁，依新 IA 重寫結構`);
    case 'case-study':
      return out('rewrite', '成功案例列表頁，依新 IA 與內容模型重建');
    case 'events':
    case 'news-index':
    case 'blog-index':
    case 'resource':
      return out('rewrite', '列表／入口頁，依新 IA 重建，內容由各篇文章組成');
    case 'search':
      return out('rewrite', '站內搜尋功能頁，M6 重做');
    case 'utility':
      return out('rewrite', '電子報訂閱／退訂等功能頁，M6 重做');
    case 'download':
      if (key.startsWith('/download/')) return out('rewrite', '檔案下載中繼頁，M6 的下載流程重做');
      return out('rewrite', '白皮書下載頁（名單收集），依新 IA 與 M6 表單元件重做');
    case 'subsite':
      return out('keep', '獨立應用，不在改版範圍；新站只保留入口連結');
    case 'pdf':
      if (LEGAL_PDF.test(row.url)) {
        confirm.push('法務文件：確認目前有效版本，以及轉為 HTML 頁是否需法務審閱');
        return out('rewrite', '法務／政策文件，轉為 HTML 頁以利閱讀與 SEO');
      }
      if (ctx.pdfCanonical.get(row.url)) return out('merge', `與 ${ctx.pdfCanonical.get(row.url)} 為同一份檔案，新站只保留一份`);
      return out('keep', '產品文件下載資產，原檔保留');
    case 'newsletter':
      return out('drop', '2018–2020 已停刊的歷史電子報，資訊已過時');
    case 'campaign':
      if (key === '/carbon') {
        confirm.push('用途不明的 GreenSwift 推廣頁，與 GreenSwift 產品頁（/products/greenswift）內容重疊；確認是否仍在投放');
        return out('drop', '不在導覽的產品推廣頁，產品內容由 GreenSwift 產品頁承接');
      }
      return out('drop', '已結束的年度活動頁');
    case 'blog-category': {
      // Listing pages share the blog header as h1; anything else is a single article
      if (!/^Blog /.test(row.h1)) {
        confirm.push('h1 為單篇文章標題但不在 blog API 清單，疑似未來排程或已下架的文章；確認是否發布');
        return out('keep', '內容為單篇 blog 文章（page_type 誤判為分類），依 blog 文章規則保留');
      }
      return out('merge', '分類列表頁，併入新 IA 的 blog 分類（M2 定案）');
    }
    case 'blog-post': {
      if (ctx.blogDupes.get(row.url)) {
        confirm.push(`與 ${ctx.blogDupes.get(row.url)} 標題相同，確認哪一篇為正式版本`);
        return out('merge', `與 ${ctx.blogDupes.get(row.url)} 標題相同的重複文章，合併至較新版本`);
      }
      if (row.last_updated && row.last_updated < BLOG_STALE_BEFORE) {
        confirm.push(`${row.last_updated.slice(0, 4)} 年發布，確認技術與產品資訊是否仍正確`);
      }
      return out('keep', '已發布的 blog 文章，內文保留，依新內容模型轉換格式');
    }
    case 'news': {
      if (noteHas(row, 'news body')) return out('drop', '現站內文檔不存在，頁面只有標題');
      if (!row.last_updated) {
        confirm.push('不在新聞 API 已發布清單、無發布日期，內容為英文但掛在 zh-TW 路由；確認是否為已下架新聞');
        return out('drop', '不在新聞 API 已發布清單，無日期可判斷時效');
      }
      if (ctx.newsDupes.get(row.url)) confirm.push(`與 ${ctx.newsDupes.get(row.url)} 標題相同，疑似重複發布`);
      if (row.last_updated >= NEWS_CUTOFF) return out('keep', `${NEWS_CUTOFF.slice(0, 4)} 年起的新聞，保留`);
      return out('drop', `${NEWS_CUTOFF} 前的新聞，依保留門檻不遷移`);
    }
    default:
      confirm.push('page_type 未分類，需人工判斷');
      return out('rewrite', '未分類頁面');
  }
}

// ---------- Context ----------

function buildContext(rows, brokenLinks) {
  const brokenOn = new Map();
  for (const b of brokenLinks) {
    for (const page of b.found_on.split(' ')) brokenOn.set(page, (brokenOn.get(page) ?? 0) + 1);
  }

  // Case variants: group by final host + lowercased path; canonical = linked from nav, else lowercase path
  const caseTwins = new Map();
  const groups = Map.groupBy(rows, (r) => `${new URL(r.final_url).host}${pathOf(r.final_url).toLowerCase()}`);
  for (const group of groups.values()) {
    if (group.length < 2) continue;
    const isLower = (r) => pathOf(r.final_url) === pathOf(r.final_url).toLowerCase();
    const canonical = group.find(inNav) ?? group.find(isLower) ?? group[0];
    for (const r of group) if (r !== canonical) caseTwins.set(r.url, canonical.final_url);
  }

  // Same PDF filename on .com and .vn
  const pdfCanonical = new Map();
  const pdfs = Map.groupBy(rows.filter((r) => r.page_type === 'pdf'), (r) => pathOf(r.url));
  for (const group of pdfs.values()) {
    const canonical = group.find((r) => r.url.includes('tpisoftware.com')) ?? group[0];
    for (const r of group) if (r !== canonical) pdfCanonical.set(r.url, canonical.url);
  }

  // Same title within locale: older blog post merges into the newer one; news only gets flagged
  const dupes = (type) => {
    const map = new Map();
    const byTitle = Map.groupBy(rows.filter((r) => r.page_type === type), (r) => `${r.locale}|${r.title}`);
    for (const group of byTitle.values()) {
      if (group.length < 2) continue;
      group.sort((a, b) => a.last_updated.localeCompare(b.last_updated));
      const newest = group.at(-1);
      for (const r of group.slice(0, -1)) map.set(r.url, newest.url);
      if (type === 'news') map.set(newest.url, group.slice(0, -1).map((r) => r.url).join('、'));
    }
    return map;
  };

  return { brokenOn, caseTwins, pdfCanonical, blogDupes: dupes('blog-post'), newsDupes: dupes('news') };
}

// ---------- Main ----------

// .vn keeps the legacy product routes that .com redirects to /products/*
const ROUTE_ALIASES = {
  '/digilogs-logs-management': '/products/digilogs',
  '/digirunner-api-management': '/products/digirunner',
};

function countBy(rows, ...keys) {
  const out = {};
  for (const r of rows) {
    let node = out;
    keys.forEach((k, i) => {
      const v = r[k] || '(empty)';
      if (i === keys.length - 1) node[v] = (node[v] ?? 0) + 1;
      else node = node[v] ??= {};
    });
  }
  return out;
}

async function main() {
  const rows = await readCsv(INVENTORY);
  const brokenLinks = await readCsv(BROKEN);
  const overrides = new Map((await readCsv(OVERRIDES)).map((o) => [o.url, o]));
  const ctx = buildContext(rows, brokenLinks);

  const unusedOverrides = new Set(overrides.keys());
  for (const row of rows) {
    const result = decide(row, ctx);
    const o = overrides.get(row.url);
    if (o) {
      unusedOverrides.delete(row.url);
      if (o.disposition) result.disposition = o.disposition;
      if (o.disposition_reason) result.disposition_reason = o.disposition_reason;
      if (o.to_confirm) result.to_confirm.push(o.to_confirm);
    }
    row.disposition = result.disposition;
    row.disposition_reason = result.disposition_reason;
    row.to_confirm = result.to_confirm.join('; ');
  }

  const errors = [];
  for (const url of unusedOverrides) errors.push(`override url not in inventory: ${url}`);
  for (const r of rows) {
    if (!DISPOSITIONS.includes(r.disposition)) errors.push(`invalid disposition "${r.disposition}": ${r.url}`);
    if (!r.disposition_reason) errors.push(`missing reason: ${r.url}`);
  }
  if (errors.length) {
    console.error(errors.join('\n'));
    process.exit(1);
  }

  const columns = [...CRAWL_COLUMNS, ...AUDIT_COLUMNS];
  const csv = [columns.join(','), ...rows.map((r) => columns.map((c) => csvCell(r[c])).join(','))].join('\n');
  await writeFile(INVENTORY, `﻿${csv}\n`);

  // Route coverage across locales for content pages (input for M7)
  const contentTypes = new Set(['product', 'service', 'solution', 'about']);
  const coverage = Map.groupBy(
    rows.filter((r) => contentTypes.has(r.page_type) && r.status === '200' && r.disposition !== 'merge'),
    (r) => ROUTE_ALIASES[routeKey(r.final_url)] ?? routeKey(r.final_url).toLowerCase(),
  );
  const localeGaps = [...coverage]
    .map(([route, group]) => ({ route, missing: ['zh-TW', 'en', 'vi'].filter((l) => !group.some((r) => r.locale === l)) }))
    .filter((g) => g.missing.length)
    .sort((a, b) => a.route.localeCompare(b.route));

  const summary = {
    rows: rows.length,
    newsCutoff: NEWS_CUTOFF,
    blogStaleBefore: BLOG_STALE_BEFORE,
    byDisposition: countBy(rows, 'disposition'),
    byDispositionLocale: countBy(rows, 'disposition', 'locale'),
    byPageTypeDisposition: countBy(rows, 'page_type', 'disposition'),
    toConfirm: rows.filter((r) => r.to_confirm).length,
    overrides: overrides.size,
    localeGaps,
  };
  await writeFile(SUMMARY, `${JSON.stringify(summary, null, 2)}\n`);

  console.log(`${rows.length} rows audited:`, summary.byDisposition, `| to_confirm: ${summary.toConfirm}`);
}

await main();
