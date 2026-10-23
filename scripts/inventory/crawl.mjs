#!/usr/bin/env node
// Content inventory crawler for the current site (issue #2, M1-01).
// Usage: node scripts/inventory/crawl.mjs [--limit N]
// Output: docs/research/inventory.csv, docs/research/inventory-summary.json
// Method and field definitions: docs/research/inventory.md
import { writeFile, mkdir } from 'node:fs/promises';
import { parse } from 'node-html-parser';
import { request } from './http.mjs';
import { csvCell } from './csv.mjs';
import { payloadArticleBody } from '../lib/nuxt-payload.mjs';

const COM = 'https://www.tpisoftware.com';
const VN = 'https://www.tpisoftware.vn';
const IN_SCOPE_HOSTS = new Set(['www.tpisoftware.com', 'www.tpisoftware.vn']);
// Separate applications mounted on the same host: list the entry page only, do not crawl inside.
const SUBSITE_PREFIXES = ['/tpu', '/hr'];
const ASSET_RE = /\.(css|js|json|png|jpe?g|gif|svg|webp|ico|woff2?|ttf|eot|mp4|zip)$/i;
const LOCALE_HOMES = [
  { locale: 'zh-TW', url: `${COM}/` },
  { locale: 'en', url: `${COM}/en` },
  { locale: 'ja', url: `${COM}/ja` },
  { locale: 'vi', url: `${VN}/` },
];
const BLOG_SOURCES = [
  { locale: 'zh-TW', lang: 'ZH-TW', origin: COM },
  { locale: 'en', lang: 'EN-US', origin: COM },
  { locale: 'vi', lang: 'VI-VN', origin: VN },
];
const NEWS_SOURCES = [
  { locale: 'zh-TW', lang: 'tw', base: `${COM}/media-center/` },
  { locale: 'en', lang: 'en', base: `${COM}/en/media-center/` },
  { locale: 'vi', lang: 'vn', base: `${VN}/media-center/` },
];

const CONCURRENCY = 2;
const limitArg = process.argv.indexOf('--limit');
const PAGE_LIMIT = limitArg > -1 ? Number(process.argv[limitArg + 1]) : Infinity;

// ---------- HTTP ----------

async function getJson(url, init) {
  const res = await request(url, init);
  return res.json();
}

const cmsPost = (path, lang, body) =>
  getJson(`${COM}/cms/api/v1/f/article/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Lang': lang },
    body: JSON.stringify(body),
  });

// ---------- URL helpers ----------

function normalize(href, base) {
  let u;
  try {
    u = new URL(href, base);
  } catch {
    return null;
  }
  if (!['http:', 'https:'].includes(u.protocol)) return null;
  u.protocol = 'https:';
  u.hash = '';
  u.search = '';
  u.pathname = u.pathname.replace(/\/{2,}/g, '/').replace(/(%20)+$/, '');
  // www.tpisoftware.vn serves /vn/* as a duplicate of /* (200, no redirect); keep the unprefixed form.
  if (u.hostname === 'www.tpisoftware.vn') u.pathname = u.pathname.replace(/^\/vn(?=\/|$)/, '') || '/';
  if (u.pathname.length > 1) u.pathname = u.pathname.replace(/\/+$/, '');
  return u.href;
}

const isInScope = (url) => IN_SCOPE_HOSTS.has(new URL(url).hostname);
const isPdf = (url) => /\.pdf$/i.test(new URL(url).pathname);
const subsiteOf = (url) => {
  const { pathname } = new URL(url);
  return SUBSITE_PREFIXES.find((p) => pathname === p || pathname.startsWith(`${p}/`));
};

// ---------- Discovery ----------

const candidates = new Map(); // normalized url -> { via: Set, meta }
const navMap = new Map(); // normalized url -> Set of nav trails
const outOfScope = new Map(); // host -> count of links
const notes = []; // run-level findings for the summary

// Returns the candidate key when the url is newly added, otherwise null.
function addCandidate(url, via, meta = {}) {
  if (!url) return null;
  if (!isInScope(url)) {
    const host = new URL(url).hostname;
    if (host.includes('tpisoftware') || host === 'tpi.dev') outOfScope.set(host, (outOfScope.get(host) ?? 0) + 1);
    return null;
  }
  if (ASSET_RE.test(new URL(url).pathname)) return null;
  const sub = subsiteOf(url);
  if (sub) url = normalize(sub, url);
  const isNew = !candidates.has(url);
  const entry = candidates.get(url) ?? { via: new Set(), meta: {} };
  entry.via.add(via);
  Object.assign(entry.meta, meta);
  candidates.set(url, entry);
  return isNew ? url : null;
}

function addNav(url, trail) {
  if (!url) return;
  const set = navMap.get(url) ?? new Set();
  set.add(trail);
  navMap.set(url, set);
}

// Extracts a JS array literal starting at `start` (index of '['), honoring string quotes.
function sliceArrayLiteral(src, start) {
  let depth = 0;
  let inStr = false;
  for (let i = start; i < src.length; i++) {
    const c = src[i];
    if (inStr) {
      if (c === '\\') i++;
      else if (c === '"') inStr = false;
    } else if (c === '"') inStr = true;
    else if (c === '[') depth++;
    else if (c === ']' && --depth === 0) return src.slice(start, i + 1);
  }
  return null;
}

// A bundle carries one navbar config per language; tell them apart by their link prefixes.
function navbarLocale(tree) {
  const links = [];
  const collect = (n) => {
    if (Array.isArray(n)) return n.forEach(collect);
    if (!n || typeof n !== 'object') return;
    if (n.link?.startsWith('/')) links.push(n.link);
    for (const key of ['list', 'secondSub']) if (n[key]) collect(n[key]);
  };
  collect(tree);
  const share = (re) => links.filter((l) => re.test(l)).length / (links.length || 1);
  if (share(/^\/en(\/|$)/) > 0.5) return 'en';
  if (share(/^\/vn(\/|$)/) > 0.5) return 'vi';
  if (share(/^\/ja(\/|$)/) > 0.5) return 'ja';
  return 'zh-TW';
}

// The header dropdowns are rendered client-side; their config lives in the layout bundle as
// `navbar:[...]` object literals. Convert each literal to JSON (no eval) and walk it.
function parseNavbarConfigs(bundle, origin, locale) {
  let idx = 0;
  let found = 0;
  while ((idx = bundle.indexOf('navbar:[', idx)) !== -1) {
    const literal = sliceArrayLiteral(bundle, idx + 7);
    idx += 8;
    if (!literal) continue;
    const json = literal
      .replace(/!0/g, 'true')
      .replace(/!1/g, 'false')
      .replace(/([{,])([A-Za-z_$][\w$]*):/g, '$1"$2":');
    let tree;
    try {
      tree = JSON.parse(json);
    } catch {
      notes.push(`navbar literal at ${origin} bundle offset ${idx} could not be parsed`);
      continue;
    }
    if (navbarLocale(tree) !== locale) continue;
    found++;
    const walk = (node, trail) => {
      if (Array.isArray(node)) return node.forEach((n) => walk(n, trail));
      if (!node || typeof node !== 'object') return;
      const t = node.title ? [...trail, node.title] : trail;
      if (node.link) {
        const url = normalize(node.link, origin);
        addNav(url, `header: ${t.join(' > ')}`);
        addCandidate(url, 'nav');
      }
      for (const key of ['list', 'secondSub']) if (node[key]) walk(node[key], t);
    };
    walk(tree, []);
  }
  return found;
}

const bundleCache = new Map();
async function fetchBundles(html, origin) {
  const srcs = [...html.matchAll(/src="(\/_nuxt\/[\w.-]+\.js)"/g)].map((m) => origin + m[1]);
  const out = [];
  for (const src of new Set(srcs)) {
    if (!bundleCache.has(src)) bundleCache.set(src, await (await request(src)).text());
    out.push(bundleCache.get(src));
  }
  return out;
}

async function discoverFromHomes() {
  for (const { locale, url } of LOCALE_HOMES) {
    addCandidate(normalize(url), 'home');
    const res = await request(url);
    const html = await res.text();
    if (!res.ok) {
      notes.push(`${locale} home ${url} returned ${res.status}`);
      continue;
    }
    const origin = new URL(res.url).origin;
    const root = parse(html);
    root.querySelectorAll('header.site-header a[href]').forEach((a) => {
      const u = normalize(a.getAttribute('href'), res.url);
      addNav(u, `header: ${clean(a.text) || '(logo)'}`);
      addCandidate(u, 'nav');
    });
    root.querySelectorAll('.footer a[href]').forEach((a) => {
      const u = normalize(a.getAttribute('href'), res.url);
      addNav(u, `footer: ${clean(a.text) || '(icon)'}`);
      addCandidate(u, 'nav');
    });
    const bundles = await fetchBundles(html, origin);
    let navbars = 0;
    for (const b of bundles) {
      navbars += parseNavbarConfigs(b, origin, locale);
      // Static routes registered in the Nuxt router; dynamic segments are covered by the APIs below.
      // The vn build also registers /en and /ja routes, which 404 on that host.
      for (const m of b.matchAll(/path:"(\/[^":*?]*)"/g)) {
        if (origin === VN && /^\/(en|ja)(\/|$)/.test(m[1])) continue;
        addCandidate(normalize(m[1], origin), 'router');
      }
    }
    if (!navbars) notes.push(`${locale}: no navbar config found in bundles`);
  }
}

async function discoverBlog() {
  const now = new Date();
  const blogMeta = new Map();
  for (const { locale, lang, origin } of BLOG_SOURCES) {
    const cats = await cmsPost('category', lang, {});
    const catUrl = new Map();
    for (const c of cats.data.content) {
      catUrl.set(c.categoryNo, c.custUrl);
      addCandidate(normalize(c.custUrl, origin), 'blog-api', { pageType: 'blog-category' });
      for (const s of c.subcategories) {
        catUrl.set(s.categoryNo, s.custUrl);
        addCandidate(normalize(s.custUrl, origin), 'blog-api', { pageType: 'blog-category' });
      }
    }
    let page = 1;
    let total = 0;
    let hidden = 0;
    const seen = [];
    do {
      const res = await cmsPost('home', lang, { page, limit: 50 });
      total = res.data.totalCount;
      seen.push(...res.data.content.articles);
      page++;
    } while (seen.length < total && page < 100);
    for (const a of seen) {
      // The site itself hides scheduled posts whose date is in the future.
      if (new Date(a.atcDate.replace(/\//g, '-')) > now) {
        hidden++;
        continue;
      }
      const cat = catUrl.get(a.multiCate?.[0]?.mainCate);
      if (!cat) {
        notes.push(`${locale} article ${a.articleCustUrl} has unknown category`);
        continue;
      }
      const url = normalize(`${cat}/${a.articleCustUrl}`, origin);
      addCandidate(url, 'blog-api', { pageType: 'blog-post' });
      blogMeta.set(url, { lastUpdated: a.atcDate.slice(0, 10).replace(/\//g, '-'), source: 'cms-api:atcDate' });
    }
    notes.push(`blog ${locale}: API totalCount=${total}, listed=${seen.length}, hidden (future date)=${hidden}`);
  }
  return blogMeta;
}

async function discoverNews() {
  const newsMeta = new Map();
  for (const { locale, lang, base } of NEWS_SOURCES) {
    const res = await getJson(`${COM}/tpi/api/News?languages=${lang}`);
    let unpublished = 0;
    for (const n of res.data) {
      if (String(n.status) !== '1') {
        unpublished++;
        continue;
      }
      const url = normalize(`${base}${n.id}`);
      addCandidate(url, 'news-api', { pageType: 'news' });
      const date = n.updateDate ?? n.showDate;
      newsMeta.set(url, {
        lastUpdated: date ? date.slice(0, 10) : '',
        source: date ? (n.updateDate ? 'news-api:updateDate' : 'news-api:showDate') : '',
        htmlpath: n.htmlpath,
      });
    }
    notes.push(`news ${locale}: API total=${res.total}, unpublished (status!=1)=${unpublished}`);
  }
  return newsMeta;
}

async function discoverSitemaps() {
  for (const origin of [COM, VN]) {
    const res = await request(`${origin}/sitemap.xml`);
    const body = await res.text();
    if (!res.ok || !body.includes('<urlset')) {
      notes.push(`${origin}/sitemap.xml returned ${res.status}${res.ok ? ' (not a sitemap)' : ''}`);
      continue;
    }
    const locs = [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
    locs.forEach((l) => addCandidate(normalize(l), 'sitemap'));
    notes.push(`${origin}/sitemap.xml: ${locs.length} urls`);
  }
}

// ---------- Page analysis ----------

const clean = (s) => (s ?? '').replace(/\s+/g, ' ').trim();

// CJK ideographs/kana/hangul count one word per character; other text is split on whitespace.
function countWords(text) {
  const cjk = text.match(/[぀-ヿ㐀-䶿一-鿿豈-﫿가-힯]/g)?.length ?? 0;
  const rest = text
    .replace(/[぀-ヿ㐀-䶿一-鿿豈-﫿가-힯]/g, ' ')
    .split(/\s+/)
    .filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
  return cjk + rest;
}

function contentRoot(root) {
  const layout = root.querySelector('.layout') ?? root.querySelector('body') ?? root;
  layout
    .querySelectorAll('header.site-header, .footer, .modal, script, style, noscript, template')
    .forEach((n) => n.remove());
  return layout;
}

function embeddedMedia(nodes) {
  const counts = {};
  const bump = (k) => (counts[k] = (counts[k] ?? 0) + 1);
  const all = (sel) => nodes.flatMap((n) => n.querySelectorAll(sel));
  all('iframe').forEach((f) => {
    const src = f.getAttribute('src') ?? f.getAttribute('data-src') ?? '';
    if (/youtube|youtu\.be/.test(src)) bump('youtube');
    else if (/vimeo/.test(src)) bump('vimeo');
    else if (/google\.[^/]+\/maps|maps\.google/.test(src)) bump('google-maps');
    else bump('iframe');
  });
  all('video').forEach(() => bump('video'));
  all('audio').forEach(() => bump('audio'));
  return Object.entries(counts)
    .map(([k, v]) => `${k}:${v}`)
    .join(';');
}

function forms(node) {
  const formCount = node.querySelectorAll('form').length;
  const fields = node.querySelectorAll('input:not([type=hidden]), textarea, select').length;
  if (!formCount && !fields) return '';
  return `form:${formCount};fields:${fields}`;
}

function localeOf(htmlLang = '', url) {
  const { hostname, pathname } = new URL(url);
  if (hostname.endsWith('.vn')) return 'vi';
  if (/^\/en(\/|$)/.test(pathname)) return 'en';
  if (/^\/ja(\/|$)/.test(pathname)) return 'ja';
  if (/^\/vn(\/|$)/.test(pathname)) return 'vi';
  return htmlLang.startsWith('zh') || !htmlLang ? 'zh-TW' : htmlLang;
}

function pageTypeOf(url, hint) {
  if (hint) return hint;
  if (isPdf(url)) return 'pdf';
  if (subsiteOf(url)) return 'subsite';
  const p = new URL(url).pathname.replace(/^\/(en|ja|vn)(?=\/|$)/, '') || '/';
  const rules = [
    [/^\/$/, 'home'],
    [/^\/products$/, 'product-index'],
    [/^\/products\//, 'product'],
    [/^\/(digirunner-api-management|digilogs-logs-management)$/, 'product'],
    [/^\/solutions$/, 'solution-index'],
    [/^\/solutions\//, 'solution'],
    [/^\/(cloudservice|chatgpt-enterprise|chatgpt-solution|esg-advisory|outsourcing|genai-solution|aiso|orient-ai)(\/|$)/i, 'service'],
    [/^\/success-story$/, 'case-study'],
    [/^\/blog$/, 'blog-index'],
    [/^\/blog\//, 'blog-category'],
    [/^\/media-center$/, 'news-index'],
    [/^\/media-center\//, 'news'],
    [/^\/events$/, 'events'],
    [/^\/\d{4}tpiday$/, 'campaign'],
    [/^\/carbon$/, 'campaign'],
    [/^\/(whitepaper|download)\//, 'download'],
    [/^\/(about-us|partners)$/, 'about'],
    [/^\/contact-us$/, 'contact'],
    [/^\/resource$/, 'resource'],
    [/^\/(epaper|edm)\//, 'newsletter'],
    [/^\/search$/, 'search'],
    [/^\/(subscribe|subscribe\/result|unsubscribe|cancelrecord|thanks)$/, 'utility'],
  ];
  return rules.find(([re]) => re.test(p))?.[1] ?? 'other';
}

async function analyzePdf(url) {
  const res = await request(url, { method: 'HEAD' });
  const lm = res.headers.get('last-modified');
  const size = res.headers.get('content-length');
  return {
    status: res.status,
    finalUrl: normalize(res.url),
    lastUpdated: lm ? new Date(lm).toISOString().slice(0, 10) : '',
    lastUpdatedSource: lm ? 'http:last-modified' : '',
    extraNotes: size ? [`size:${Math.round(size / 1024)}KB`] : [],
    links: [],
  };
}

// News bodies are separate HTML files fetched client-side from /file{htmlpath}.
async function newsBody(htmlpath) {
  const res = await request(`${COM}/file${htmlpath}`);
  return res.ok ? res.text() : null;
}

async function analyzeHtml(url, { pageType, htmlpath } = {}) {
  const res = await request(url);
  const html = await res.text();
  const root = parse(html);
  const htmlLang = root.querySelector('html')?.getAttribute('lang') ?? '';
  const title = clean(root.querySelector('title')?.text);
  const meta = (sel) => root.querySelector(sel)?.getAttribute('content');
  const extraNotes = [];
  const body = contentRoot(root);
  const parts = [body];
  if (res.ok && pageType === 'blog-post') {
    const article = payloadArticleBody(html);
    if (article) parts.push(parse(article));
    else extraNotes.push('article body not found in payload');
  }
  if (res.ok && pageType === 'news' && htmlpath) {
    const fragment = await newsBody(htmlpath);
    if (fragment) parts.push(parse(fragment));
    else extraNotes.push(`news body ${htmlpath} not found`);
  }
  if (parts.length > 1) extraNotes.push(pageType === 'news' ? 'body: /file fragment' : 'body: nuxt payload');
  const links = [root, ...parts.slice(1)]
    .flatMap((p) => p.querySelectorAll('a[href]'))
    .map((a) => normalize(a.getAttribute('href'), res.url))
    .filter(Boolean);
  const h1s = body.querySelectorAll('h1').map((h) => clean(h.text)).filter(Boolean);
  const imgs = new Set(
    parts
      .flatMap((p) => p.querySelectorAll('img'))
      .map((i) => i.getAttribute('src') ?? i.getAttribute('data-src') ?? i.toString()),
  );
  const modified = meta('meta[property="article:modified_time"]') ?? meta('meta[property="article:published_time"]');
  const lm = res.headers.get('last-modified');
  if (h1s.length > 1) extraNotes.push(`h1 x${h1s.length}`);
  if (!h1s.length) extraNotes.push('no h1');
  if (/Server error|Page not found/i.test(title)) extraNotes.push('error page');
  return {
    status: res.status,
    finalUrl: normalize(res.url),
    htmlLang,
    title,
    h1: h1s.join(' | '),
    lastUpdated: modified ? modified.slice(0, 10) : lm ? new Date(lm).toISOString().slice(0, 10) : '',
    lastUpdatedSource: modified ? 'meta:article' : lm ? 'http:last-modified' : '',
    wordCount: parts.reduce((n, p) => n + countWords(clean(p.text)), 0),
    imageCount: imgs.size,
    embeddedMedia: embeddedMedia(parts),
    forms: forms(body),
    extraNotes,
    links,
  };
}

// ---------- Main ----------

const COLUMNS = [
  'url', 'final_url', 'status', 'locale', 'page_type', 'title', 'h1', 'last_updated', 'last_updated_source',
  'word_count', 'image_count', 'embedded_media', 'forms', 'nav_location', 'discovered_via', 'notes',
];

async function main() {
  const started = new Date();
  console.log('Discovering…');
  await discoverFromHomes();
  await discoverSitemaps();
  const apiMeta = new Map([...(await discoverBlog()), ...(await discoverNews())]);
  console.log(`  ${candidates.size} candidate urls`);

  const results = new Map(); // final url -> row
  const visited = new Set();
  const failures = [];
  const referrers = new Map(); // url -> Set of pages linking to it
  const queue = [...candidates.keys()];
  let processed = 0;

  const worker = async () => {
    while (queue.length && processed < PAGE_LIMIT) {
      const url = queue.shift();
      if (visited.has(url)) continue;
      visited.add(url);
      processed++;
      const entry = candidates.get(url);
      let r;
      try {
        r = isPdf(url)
          ? await analyzePdf(url)
          : await analyzeHtml(url, { pageType: entry.meta.pageType, htmlpath: apiMeta.get(url)?.htmlpath });
      } catch (error) {
        failures.push({ url, error: error.message });
        r = { status: 'fetch-error', finalUrl: url, extraNotes: [error.message], links: [] };
      }
      // Follow in-page links, but never into subsites or across to other hosts.
      if (!subsiteOf(url)) {
        for (const link of r.links) {
          if (!referrers.has(link)) referrers.set(link, new Set());
          referrers.get(link).add(r.finalUrl ?? url);
          const added = addCandidate(link, 'link');
          if (added) queue.push(added);
        }
      }
      const finalUrl = r.finalUrl ?? url;
      const api = apiMeta.get(url) ?? apiMeta.get(finalUrl);
      const existing = results.get(finalUrl);
      if (existing) {
        existing.aliases.add(url);
        entry.via.forEach((v) => existing.via.add(v));
        continue;
      }
      results.set(finalUrl, {
        url: finalUrl,
        requested: url,
        aliases: new Set(url === finalUrl ? [] : [url]),
        via: new Set(entry.via),
        pageTypeHint: entry.meta.pageType,
        ...r,
        lastUpdated: api?.lastUpdated || r.lastUpdated || '',
        lastUpdatedSource: api?.lastUpdated ? api.source : r.lastUpdatedSource || '',
      });
      if (processed % 50 === 0) console.log(`  ${processed} fetched, ${queue.length} queued`);
    }
  };
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  const allRows = [...results.values()].map((r) => {
    const locale = localeOf(r.htmlLang, r.url);
    const trails = new Set([...(navMap.get(r.url) ?? []), ...[...r.aliases].flatMap((a) => [...(navMap.get(a) ?? [])])]);
    const pageType = pageTypeOf(r.url, r.pageTypeHint);
    const navLocation = trails.size
      ? [...trails].sort().join(' | ')
      : pageType === 'blog-post' || pageType === 'blog-category'
        ? 'blog listing'
        : pageType === 'news'
          ? 'media-center listing'
          : 'not in nav';
    const rowNotes = [...(r.extraNotes ?? [])];
    if (r.aliases.size) rowNotes.push(`redirected from: ${[...r.aliases].sort().join(' ')}`);
    return {
      url: r.aliases.size ? [...r.aliases].sort()[0] : r.url,
      final_url: r.url,
      status: r.status,
      locale,
      page_type: pageType,
      title: r.title ?? '',
      h1: r.h1 ?? '',
      last_updated: r.lastUpdated,
      last_updated_source: r.lastUpdatedSource,
      word_count: r.wordCount ?? '',
      image_count: r.imageCount ?? '',
      embedded_media: r.embeddedMedia ?? '',
      forms: r.forms ?? '',
      nav_location: navLocation,
      discovered_via: [...r.via].sort().join(';'),
      notes: rowNotes.join('; '),
      found_on: [r.requested, ...r.aliases].flatMap((u) => [...(referrers.get(u) ?? [])]),
    };
  });

  // URLs reached only through in-page links that do not resolve are broken links, not pages.
  const isBroken = (r) => r.status !== 200 && r.discovered_via === 'link';
  const rows = allRows.filter((r) => !isBroken(r));
  const broken = allRows
    .filter(isBroken)
    .map((r) => ({ ...r, found_on: [...new Set(r.found_on)].sort().join(' ') }))
    .sort((a, b) => a.url.localeCompare(b.url));

  const localeOrder = ['zh-TW', 'en', 'vi', 'ja'];
  rows.sort(
    (a, b) =>
      localeOrder.indexOf(a.locale) - localeOrder.indexOf(b.locale) || a.final_url.localeCompare(b.final_url),
  );

  const csv = [COLUMNS.join(','), ...rows.map((r) => COLUMNS.map((c) => csvCell(r[c])).join(','))].join('\n');
  await mkdir('docs/research', { recursive: true });
  await writeFile('docs/research/inventory.csv', `\uFEFF${csv}\n`);
  const brokenColumns = ['url', 'status', 'found_on'];
  const brokenCsv = [brokenColumns.join(','), ...broken.map((r) => brokenColumns.map((c) => csvCell(r[c])).join(','))];
  await writeFile('docs/research/broken-links.csv', `\uFEFF${brokenCsv.join('\n')}\n`);

  const tally = (key, filter = () => true) =>
    rows.filter(filter).reduce((acc, r) => ((acc[r[key]] = (acc[r[key]] ?? 0) + 1), acc), {});
  const summary = {
    crawledAt: started.toISOString().slice(0, 10),
    node: process.version,
    rows: rows.length,
    brokenLinks: broken.length,
    byLocale: tally('locale'),
    byPageType: tally('page_type'),
    byStatus: tally('status'),
    byLocaleOk: tally('locale', (r) => r.status === 200),
    nonOk: rows.filter((r) => r.status !== 200).map((r) => ({ url: r.url, status: r.status, notes: r.notes })),
    navTargetsMissing: [...navMap.keys()].filter((u) => isInScope(u) && !results.has(u) && ![...results.values()].some((r) => r.aliases.has(u))),
    outOfScopeHosts: Object.fromEntries([...outOfScope].sort()),
    fetchFailures: failures,
    notes,
  };
  await writeFile('docs/research/inventory-summary.json', `${JSON.stringify(summary, null, 2)}\n`);
  console.log(`Done: ${rows.length} rows, ${broken.length} broken links, ${failures.length} fetch failures.`);
}

await main();
