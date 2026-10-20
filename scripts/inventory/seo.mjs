#!/usr/bin/env node
// SEO baseline of the current site (issue #4, M1-03).
// Usage: node scripts/inventory/seo.mjs [--limit N]
// Input: docs/research/inventory.csv (status 200 HTML pages)
// Output: docs/research/seo-pages.csv, docs/research/seo-summary.json
// Method and findings: docs/research/seo-baseline.md
import { writeFile } from 'node:fs/promises';
import { parse } from 'node-html-parser';
import { request } from './http.mjs';
import { readCsv, csvCell } from './csv.mjs';

const INVENTORY = 'docs/research/inventory.csv';
const PAGES = 'docs/research/seo-pages.csv';
const SUMMARY = 'docs/research/seo-summary.json';
const ORIGINS = ['https://www.tpisoftware.com', 'https://www.tpisoftware.vn'];
const CONCURRENCY = 2;
const limitArg = process.argv.indexOf('--limit');
const PAGE_LIMIT = limitArg > -1 ? Number(process.argv[limitArg + 1]) : Infinity;
const LOCALES = ['zh-TW', 'en', 'vi'];
// Redirect priority by URL importance; traffic and backlink data would refine it (needs-input).
const P2_TYPES = new Set([
  'product-index', 'product', 'solution-index', 'solution', 'service', 'case-study', 'about', 'contact',
  'blog-index', 'news-index', 'events', 'download', 'resource',
]);

const COLUMNS = [
  'url', 'locale', 'page_type', 'priority', 'nav_location', 'disposition', 'status',
  'title', 'title_length', 'description', 'description_length', 'canonical', 'canonical_check',
  'html_lang', 'hreflang', 'hreflang_check', 'robots', 'og_missing', 'twitter_card',
  'h1_count', 'jsonld_types', 'jsonld_errors', 'img_count', 'img_no_alt', 'img_no_size',
];
const OG_KEYS = ['og:type', 'og:title', 'og:description', 'og:url', 'og:image', 'og:locale', 'og:site_name'];

const clean = (s) => (s ?? '').replace(/\s+/g, ' ').trim();
// Counts code points, matching seo-checklist length rules (one per CJK or Latin character).
const length = (s) => [...s].length;

// Same URL form as inventory.csv: https, no query/hash/trailing slash, vn domain without /vn prefix.
function normalize(href, base) {
  let u;
  try {
    u = new URL(href, base);
  } catch {
    return null;
  }
  u.protocol = 'https:';
  u.hash = '';
  u.search = '';
  if (u.hostname === 'tpisoftware.com') u.hostname = 'www.tpisoftware.com';
  if (u.hostname === 'www.tpisoftware.com' && /^\/vn(\/|$)/.test(u.pathname)) {
    u.hostname = 'www.tpisoftware.vn';
    u.pathname = u.pathname.replace(/^\/vn/, '') || '/';
  }
  if (u.hostname === 'www.tpisoftware.vn') u.pathname = u.pathname.replace(/^\/vn(?=\/|$)/, '') || '/';
  if (u.pathname.length > 1) u.pathname = u.pathname.replace(/\/+$/, '');
  return u.href;
}

function priorityOf(row) {
  if (row.page_type === 'home' || /(^| \| )header:/.test(row.nav_location)) return 'P1';
  if (/(^| \| )footer:/.test(row.nav_location) || P2_TYPES.has(row.page_type)) return 'P2';
  return 'P3';
}

function jsonLdTypes(root) {
  const types = [];
  let errors = 0;
  const collect = (node) => {
    if (Array.isArray(node)) return node.forEach(collect);
    if (!node || typeof node !== 'object') return;
    if (node['@type']) types.push(...[node['@type']].flat());
    if (node['@graph']) collect(node['@graph']);
  };
  for (const s of root.querySelectorAll('script[type="application/ld+json"]')) {
    try {
      collect(JSON.parse(s.text));
    } catch {
      errors++;
    }
  }
  return { types, errors };
}

async function analyze(row) {
  const res = await request(row.final_url);
  const html = await res.text();
  const root = parse(html);
  const meta = (sel) => root.querySelector(sel)?.getAttribute('content');
  const finalUrl = normalize(res.url);

  const canonicals = root.querySelectorAll('link[rel="canonical"]').map((l) => l.getAttribute('href') ?? '');
  let canonicalCheck;
  if (!canonicals.length) canonicalCheck = 'missing';
  else if (new Set(canonicals).size > 1) canonicalCheck = 'multiple';
  else if (!/^https?:\/\//.test(canonicals[0])) canonicalCheck = 'relative';
  else if (normalize(canonicals[0]) === finalUrl) canonicalCheck = 'self';
  else canonicalCheck = 'other';

  const hreflang = root
    .querySelectorAll('link[rel="alternate"][hreflang]')
    .map((l) => ({ lang: l.getAttribute('hreflang'), href: normalize(l.getAttribute('href') ?? '', res.url) }));

  const robots = [meta('meta[name="robots"]'), res.headers.get('x-robots-tag')].filter(Boolean).join('; ');
  const ogMissing = OG_KEYS.filter((k) => !meta(`meta[property="${k}"]`));
  const body = root.querySelector('body') ?? root;
  const imgs = body.querySelectorAll('img');
  const { types, errors } = jsonLdTypes(root);
  const title = clean(root.querySelector('title')?.text);
  const description = clean(meta('meta[name="description"]'));

  return {
    status: res.status,
    finalUrl,
    title,
    title_length: length(title),
    description,
    description_length: length(description),
    canonical: canonicals.join(' '),
    canonical_check: canonicalCheck,
    html_lang: root.querySelector('html')?.getAttribute('lang') ?? '',
    hreflangList: hreflang,
    robots,
    og_missing: ogMissing.join(' '),
    twitter_card: meta('meta[name="twitter:card"]') ?? '',
    h1_count: root.querySelectorAll('h1').length,
    jsonld_types: [...new Set(types)].sort().join(' '),
    jsonld_errors: errors,
    img_count: imgs.length,
    img_no_alt: imgs.filter((i) => i.getAttribute('alt') === undefined).length,
    img_no_size: imgs.filter((i) => !i.getAttribute('width') || !i.getAttribute('height')).length,
  };
}

// Valid when it lists the page itself and an x-default, and every listed page that we crawled links back.
function hreflangCheck(page, byUrl, resolve) {
  if (!page.hreflangList.length) return 'missing';
  const problems = [];
  const hrefs = page.hreflangList.map((h) => resolve(h.href));
  if (!hrefs.includes(page.url)) problems.push('no-self');
  if (!page.hreflangList.some((h) => h.lang === 'x-default')) problems.push('no-x-default');
  const notReturned = hrefs.filter((h) => {
    const target = byUrl.get(h);
    return target && h !== page.url && !target.hreflangList.some((t) => resolve(t.href) === page.url);
  });
  if (notReturned.length) problems.push(`not-reciprocal:${notReturned.length}`);
  const unknown = hrefs.filter((h) => h && !byUrl.has(h));
  if (unknown.length) problems.push(`target-not-200:${unknown.length}`);
  return problems.length ? problems.join(' ') : 'ok';
}

async function siteLevel() {
  const out = {};
  for (const origin of ORIGINS) {
    const robots = await request(`${origin}/robots.txt`);
    const sitemap = await request(`${origin}/sitemap.xml`);
    const sitemapText = sitemap.ok ? await sitemap.text() : '';
    out[origin] = {
      robotsTxt: { status: robots.status, body: robots.ok ? (await robots.text()).trim() : '' },
      sitemapXml: { status: sitemap.status, urls: (sitemapText.match(/<loc>/g) ?? []).length },
    };
  }
  return out;
}

const tally = (items) =>
  Object.fromEntries(
    Object.entries(items.reduce((acc, k) => ((acc[k] = (acc[k] ?? 0) + 1), acc), {})).sort(([a], [b]) => a.localeCompare(b)),
  );

// Groups of 2+ pages within a locale sharing the same non-empty value.
function duplicates(pages, key) {
  const groups = new Map();
  for (const p of pages) {
    if (!p[key]) continue;
    const k = `${p.locale}\t${p[key]}`;
    groups.set(k, [...(groups.get(k) ?? []), p.url]);
  }
  return [...groups]
    .filter(([, urls]) => urls.length > 1)
    .map(([k, urls]) => ({ locale: k.split('\t')[0], value: k.split('\t')[1], count: urls.length, urls: urls.sort() }))
    .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
}

function stats(pages) {
  const n = pages.length;
  const count = (fn) => pages.filter(fn).length;
  const dupTitle = new Set(duplicates(pages, 'title').flatMap((g) => g.urls));
  const dupDesc = new Set(duplicates(pages, 'description').flatMap((g) => g.urls));
  return {
    pages: n,
    title: { missing: count((p) => !p.title), duplicated: dupTitle.size },
    description: { missing: count((p) => !p.description), duplicated: dupDesc.size },
    canonical: tally(pages.map((p) => p.canonical_check)),
    hreflang: {
      present: count((p) => p.hreflangList.length),
      ok: count((p) => p.hreflang_check === 'ok'),
      noXDefault: count((p) => p.hreflang_check.includes('no-x-default')),
      notReciprocal: count((p) => p.hreflang_check.includes('not-reciprocal')),
      targetNot200: count((p) => p.hreflang_check.includes('target-not-200')),
    },
    noindex: count((p) => /noindex/i.test(p.robots)),
    ogComplete: count((p) => !p.og_missing),
    ogMissingByKey: Object.fromEntries(OG_KEYS.map((k) => [k, count((p) => p.og_missing.split(' ').includes(k))])),
    twitterCard: count((p) => p.twitter_card),
    h1: { none: count((p) => p.h1_count === 0), one: count((p) => p.h1_count === 1), multiple: count((p) => p.h1_count > 1) },
    jsonld: { withAny: count((p) => p.jsonld_types), parseErrors: count((p) => p.jsonld_errors > 0) },
    images: {
      total: pages.reduce((s, p) => s + p.img_count, 0),
      noAlt: pages.reduce((s, p) => s + p.img_no_alt, 0),
      noSize: pages.reduce((s, p) => s + p.img_no_size, 0),
    },
  };
}

async function main() {
  const measuredAt = new Date().toISOString();
  const allRows = await readCsv(INVENTORY);
  // Old URLs that redirect resolve to the inventory row they land on.
  const aliases = new Map(
    allRows.flatMap((r) => [r.url, ...(r.notes.match(/redirected from: ([^;]+)/)?.[1].split(' ') ?? [])].map((u) => [normalize(u), r.final_url])),
  );
  const resolve = (url) => aliases.get(url) ?? url;
  const inventory = allRows.filter((r) => r.status === '200' && r.page_type !== 'pdf');
  const queue = inventory.slice(0, PAGE_LIMIT);
  const pages = [];
  const failures = [];
  let done = 0;
  const worker = async () => {
    while (queue.length) {
      const row = queue.shift();
      try {
        const r = await analyze(row);
        pages.push({ ...r, url: row.final_url, locale: row.locale, page_type: row.page_type, nav_location: row.nav_location, disposition: row.disposition, priority: priorityOf(row) });
      } catch (error) {
        failures.push({ url: row.final_url, error: error.message });
      }
      if (++done % 50 === 0) console.log(`  ${done} fetched`);
    }
  };
  console.log(`Fetching ${queue.length} pages…`);
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  const byUrl = new Map(pages.map((p) => [p.url, p]));
  for (const p of pages) {
    p.hreflang = p.hreflangList.map((h) => `${h.lang}=${h.href}`).join(' ');
    p.hreflang_check = hreflangCheck(p, byUrl, resolve);
    if (p.finalUrl !== p.url) failures.push({ url: p.url, error: `now redirects to ${p.finalUrl}` });
  }
  pages.sort((a, b) => LOCALES.indexOf(a.locale) - LOCALES.indexOf(b.locale) || a.url.localeCompare(b.url));

  const csv = [COLUMNS.join(','), ...pages.map((p) => COLUMNS.map((c) => csvCell(p[c])).join(','))].join('\n');
  await writeFile(PAGES, `﻿${csv}\n`);

  const byGroup = (key) =>
    Object.fromEntries([...new Set(pages.map((p) => p[key]))].sort().map((v) => [v, stats(pages.filter((p) => p[key] === v))]));
  const summary = {
    measuredAt,
    node: process.version,
    source: 'SSR HTML fetched with Node fetch (no JavaScript executed); input = inventory.csv rows with status 200, excluding PDFs',
    site: await siteLevel(),
    all: stats(pages),
    byLocale: byGroup('locale'),
    byPageType: byGroup('page_type'),
    byPriority: tally(pages.map((p) => `${p.locale} ${p.priority}`)),
    titleLength: Object.fromEntries(LOCALES.map((l) => {
      const lens = pages.filter((p) => p.locale === l && p.title).map((p) => p.title_length).sort((a, b) => a - b);
      return [l, { min: lens[0], median: lens[Math.floor(lens.length / 2)], max: lens.at(-1) }];
    })),
    jsonldTypes: tally(pages.flatMap((p) => p.jsonld_types.split(' ').filter(Boolean))),
    htmlLang: tally(pages.map((p) => `${p.locale}: ${p.html_lang || '(none)'}`)),
    topDuplicateTitles: duplicates(pages, 'title').slice(0, 15).map(({ urls, ...g }) => ({ ...g, examples: urls.slice(0, 3) })),
    topDuplicateDescriptions: duplicates(pages, 'description').slice(0, 15).map(({ urls, ...g }) => ({ ...g, examples: urls.slice(0, 3) })),
    failures,
  };
  await writeFile(SUMMARY, `${JSON.stringify(summary, null, 2)}\n`);
  console.log(`Done: ${pages.length} pages, ${failures.length} failures.`);
}

await main();
