#!/usr/bin/env node
// Feature inventory of the current site: forms, search, media, trackers and third-party embeds (issue #5, M1-04).
// Loads sampled pages in headless Chromium and records the requests actually sent, since trackers and
// embeds are mostly injected client-side and do not show up in the SSR HTML that crawl.mjs parsed.
// Never submits forms or clicks anything that writes data; search is exercised with a read-only query.
// Usage: node scripts/inventory/features.mjs [--only <url substring>]
// Input: docs/research/inventory.csv. Requires CHROME_PATH (set by scripts/session-start.sh in cloud sessions).
// Output: docs/research/features-requests.csv, docs/research/features-summary.json
// Method and findings: docs/research/features.md
import { writeFile } from 'node:fs/promises';
import puppeteer from 'puppeteer-core';
import { request, sleep } from './http.mjs';
import { readCsv, csvCell } from './csv.mjs';

const INVENTORY = 'docs/research/inventory.csv';
const OUT_REQUESTS = 'docs/research/features-requests.csv';
const OUT_SUMMARY = 'docs/research/features-summary.json';
const FIRST_PARTY = new Set(['www.tpisoftware.com', 'tpisoftware.com', 'www.tpisoftware.vn', 'tpisoftware.vn']);
// First-party static assets are noise for this inventory; keep only requests that move data or embed content.
const FIRST_PARTY_TYPES = new Set(['document', 'xhr', 'fetch', 'other', 'ping', 'eventsource', 'websocket']);
const SEARCH_QUERY = 'API';
const NAV_RETRIES = 3;
const SETTLE_MS = 4000;
// Nuxt API client (bundled): `name:function(..){..e.post("".concat(m,"/Path"),..)` with `m="tpi/api"` declared nearby.
const API_PREFIX_DECL_RE = /var [^;]*"tpi\/api"[^;]*/;
const API_METHOD_RE = /([A-Za-z_$][\w$]*):function\([^)]*\)\{/g;
const API_CALL_RE = /\b[a-z]\.(get|post|put|patch|delete)\((""\.concat\([^)]*\)(?:\.concat\([^)]*\))*|"[^"]*"|[A-Za-z_$][\w$]*)/;
const API_USE_RE = /\$api\.([A-Za-z_$][\w$]*)\(/g;
const TRACKING_ID_RES = {
  gtm: /\bGTM-[A-Z0-9]{4,10}\b/g,
  ga4: /\bG-[A-Z0-9]{6,12}\b/g,
  ua: /\bUA-\d{4,10}-\d{1,4}\b/g,
  googleAds: /\bAW-\d{6,12}\b/g,
  facebookPixel: /fbq\(\s*['"]init['"]\s*,\s*['"](\d+)['"]/g,
};

const argValue = (name) => {
  const i = process.argv.indexOf(name);
  return i > -1 ? process.argv[i + 1] : undefined;
};
const ONLY = argValue('--only');
const byString = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
const uniqSorted = (xs) => [...new Set(xs)].sort(byString);

// Sample: every page with a form or embedded media in the SSR inventory, plus one page per
// page_type × locale (the first URL in sort order), so templates without SSR markers are covered too.
async function samplePages() {
  const rows = (await readCsv(INVENTORY)).filter((r) => r.status === '200' && r.page_type !== 'pdf');
  const picked = new Map();
  const add = (r, reason) => {
    const key = r.final_url;
    if (!picked.has(key)) picked.set(key, { url: key, pageType: r.page_type, locale: r.locale, ssrForms: r.forms, ssrMedia: r.embedded_media, reasons: [] });
    picked.get(key).reasons.push(reason);
  };
  const sorted = [...rows].sort((a, b) => byString(a.final_url, b.final_url));
  sorted.filter((r) => r.forms || r.embedded_media).forEach((r) => add(r, 'ssr-form-or-media'));
  const seen = new Set();
  for (const r of sorted) {
    const key = `${r.page_type}|${r.locale}`;
    if (seen.has(key)) continue;
    seen.add(key);
    add(r, 'template-sample');
  }
  return [...picked.values()].sort((a, b) => byString(a.url, b.url)).filter((p) => !ONLY || p.url.includes(ONLY));
}

const isFirstParty = (url) => FIRST_PARTY.has(new URL(url).hostname);

function trackingIds(text) {
  return Object.fromEntries(Object.entries(TRACKING_ID_RES).map(([k, re]) => [k, uniqSorted([...text.matchAll(re)].map((m) => m[1] ?? m[0]))]));
}

// Runs in the page. Reports the rendered DOM, not the SSR HTML.
function inspectDom() {
  const text = (el) => (el?.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, 80);
  const labelOf = (el) => {
    if (el.id) {
      const l = document.querySelector(`label[for="${CSS.escape(el.id)}"]`);
      if (l) return text(l);
    }
    const own = text(el.closest('label')) || el.getAttribute('placeholder') || el.getAttribute('aria-label');
    if (own) return own;
    // Custom checkbox/inputs: the label is usually a sibling inside a small wrapper.
    for (let box = el.parentElement, depth = 0; box && depth < 3; box = box.parentElement, depth++) {
      const t = text(box);
      if (t && t.length <= 60) return t;
    }
    return '';
  };
  const field = (el) => ({
    tag: el.tagName.toLowerCase(),
    type: el.getAttribute('type') ?? '',
    name: el.getAttribute('name') ?? '',
    label: labelOf(el),
    required: el.required || el.getAttribute('aria-required') === 'true',
  });
  const FIELD_SEL = 'input:not([type=hidden]):not([type=submit]):not([type=button]), textarea, select';
  const forms = [...document.querySelectorAll('form')].map((f) => ({
    id: f.id,
    className: f.className,
    action: f.getAttribute('action') ?? '',
    method: (f.getAttribute('method') ?? '').toLowerCase(),
    heading: text(f.closest('section, [class*=form], [class*=contact]')?.querySelector('h1, h2, h3, h4')),
    fields: [...f.querySelectorAll(FIELD_SEL)].map(field),
    submit: [...f.querySelectorAll('button, input[type=submit]')].map((b) => text(b) || b.value).filter(Boolean),
  }));
  // SPA forms often have no <form>; group loose fields by their nearest sectioning ancestor.
  const groups = new Map();
  for (const el of document.querySelectorAll(FIELD_SEL)) {
    if (el.closest('form')) continue;
    const box = el.closest('section, [class*=form], [class*=search], header, footer, dialog, [role=dialog]') ?? document.body;
    if (!groups.has(box)) groups.set(box, []);
    groups.get(box).push(field(el));
  }
  const looseFields = [...groups.entries()].map(([box, fields]) => ({
    container: `${box.tagName.toLowerCase()}${box.className && typeof box.className === 'string' ? `.${box.className.trim().split(/\s+/).join('.')}` : ''}`.slice(0, 120),
    heading: text(box.querySelector('h1, h2, h3, h4')),
    fields,
    buttons: [...box.querySelectorAll('button')].map(text).filter(Boolean).slice(0, 5),
  }));
  return {
    forms,
    looseFields,
    iframes: [...document.querySelectorAll('iframe')].map((f) => f.src || f.getAttribute('data-src') || ''),
    videos: [...document.querySelectorAll('video')].map((v) => v.currentSrc || v.src || v.querySelector('source')?.src || ''),
    audios: [...document.querySelectorAll('audio')].map((a) => a.currentSrc || a.src || ''),
    scripts: [...document.querySelectorAll('script[src]')].map((s) => s.src),
    inlineScripts: [...document.querySelectorAll('script:not([src])')].map((s) => s.textContent ?? '').join('\n'),
    globals: ['dataLayer', 'gtag', 'ga', 'fbq', '_hsq', 'hj', 'clarity', 'Tawk_API', 'LiveChatWidget', '$crisp', 'zE', 'grecaptcha', 'turnstile']
      .filter((g) => g in window),
  };
}

async function visit(browser, page) {
  const requests = [];
  for (let attempt = 0; attempt <= NAV_RETRIES; attempt++) {
    if (attempt > 0) await sleep(1000 * 2 ** (attempt - 1));
    requests.length = 0;
    // Fresh context per page: no cookies or consent state carried over, as a first-time visitor sees it.
    const context = await browser.createBrowserContext();
    const tab = await context.newPage();
    const byId = new Map();
    tab.on('request', (req) => {
      const entry = { url: req.url(), method: req.method(), resourceType: req.resourceType(), status: '', failure: '' };
      byId.set(req, entry);
      requests.push(entry);
    });
    tab.on('response', (res) => {
      const entry = byId.get(res.request());
      if (entry) entry.status = String(res.status());
    });
    tab.on('requestfailed', (req) => {
      const entry = byId.get(req);
      if (entry) entry.failure = req.failure()?.errorText ?? 'failed';
    });
    try {
      const res = await tab.goto(page.url, { waitUntil: 'networkidle2', timeout: 60_000 });
      if (!res || res.status() >= 500) throw new Error(`HTTP ${res?.status()}`);
      await tab.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 600) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 150));
        }
      });
      await sleep(SETTLE_MS);
      const dom = await tab.evaluate(inspectDom);
      let search;
      if (page.pageType === 'search') search = await trySearch(tab, requests);
      await context.close();
      return { requests: [...requests], dom, search };
    } catch (error) {
      await context.close();
      if (attempt === NAV_RETRIES) return { requests: [...requests], error: String(error.message ?? error) };
    }
  }
}

// Types a read-only query into the first text field and records what the search calls.
async function trySearch(tab, requests) {
  const before = requests.length;
  const input = await tab.$('input[type=search], input[type=text], input:not([type])');
  if (!input) return { attempted: false };
  await input.type(SEARCH_QUERY);
  await input.press('Enter');
  await tab.waitForNetworkIdle({ idleTime: 1000, timeout: 20_000 }).catch(() => {});
  await sleep(SETTLE_MS);
  const calls = requests.slice(before).filter((r) => ['xhr', 'fetch', 'document'].includes(r.resourceType));
  return {
    attempted: true,
    query: SEARCH_QUERY,
    resultUrl: tab.url(),
    calls: calls.map((r) => ({ method: r.method, url: r.url, status: r.status })),
  };
}

function resolvePath(expr, prefixes) {
  if (!expr.startsWith('"')) return prefixes[expr] ?? `{${expr}}`;
  if (!expr.startsWith('"".')) return expr.slice(1, -1);
  return [...expr.matchAll(/\.concat\(([^)]*)\)/g)]
    .flatMap((m) => m[1].split(','))
    .map((arg) => arg.trim())
    .map((arg) => (arg.startsWith('"') ? arg.slice(1, -1) : prefixes[arg] ?? `{${arg}}`))
    .join('');
}

// Static scan of first-party JS bundles: the API client's methods and which bundles call them.
// Shows the endpoint each form posts to without submitting anything.
async function scanBundles(bundlePages) {
  const bodies = {};
  for (const url of Object.keys(bundlePages).sort(byString)) {
    try {
      const res = await request(url);
      if (res.ok) bodies[url] = await res.text();
    } catch (error) {
      console.warn(`  bundle fetch failed: ${error.message}`);
    }
  }
  const methods = {};
  for (const body of Object.values(bodies)) {
    const decl = body.match(API_PREFIX_DECL_RE);
    if (!decl) continue;
    const prefixes = Object.fromEntries([...decl[0].matchAll(/([A-Za-z_$][\w$]*)="([^"]*)"/g)].map((m) => [m[1], m[2]]));
    const starts = [...body.matchAll(API_METHOD_RE)];
    starts.forEach((m, i) => {
      const chunk = body.slice(m.index, starts[i + 1]?.index ?? m.index + 2000);
      const call = chunk.match(API_CALL_RE);
      if (!call) return;
      const path = resolvePath(call[2], prefixes);
      // The same pattern matches unrelated library code; keep only calls rooted at an API prefix.
      if ([...Object.values(prefixes), 'api'].some((p) => path === p || path.startsWith(`${p}/`) || path.startsWith(`${p}?`))) {
        methods[m[1]] ??= { http: call[1].toUpperCase(), path };
      }
    });
  }
  for (const [url, body] of Object.entries(bodies)) {
    for (const [, name] of body.matchAll(API_USE_RE)) {
      const m = (methods[name] ??= { http: '?', path: '?' });
      (m.calledFrom ??= new Set()).add(new URL(url).pathname);
      (m.pages ??= new Set());
      bundlePages[url].forEach((p) => m.pages.add(p));
    }
  }
  return Object.fromEntries(Object.keys(methods).sort(byString).map((k) => [k, {
    http: methods[k].http,
    path: methods[k].path,
    calledFrom: uniqSorted(methods[k].calledFrom ?? []),
    loadedOnSampledPages: uniqSorted(methods[k].pages ?? []),
  }]));
}

// First-party script URL → sampled pages that loaded it (includes lazily loaded Nuxt chunks).
function bundlePagesOf(results) {
  const map = {};
  for (const r of results) {
    for (const q of r.requests.filter((x) => x.resourceType === 'script' && /^https?:/.test(x.url) && isFirstParty(x.url))) {
      (map[q.url.split('?')[0]] ??= new Set()).add(r.url);
    }
  }
  return map;
}

const keepRequest = (r) => /^https?:/.test(r.url) && (!isFirstParty(r.url) || FIRST_PARTY_TYPES.has(r.resourceType));

async function main() {
  const measuredAt = new Date().toISOString();
  const pages = await samplePages();
  console.log(`Sampling ${pages.length} pages`);
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME_PATH,
    headless: true,
    // Chrome does not read HTTPS_PROXY; pass it explicitly (cloud sessions).
    args: ['--no-sandbox', ...(process.env.HTTPS_PROXY ? [`--proxy-server=${process.env.HTTPS_PROXY}`] : [])],
  });
  const browserVersion = await browser.version();
  const results = [];
  try {
    for (const [i, page] of pages.entries()) {
      const r = await visit(browser, page);
      results.push({ ...page, ...r });
      const third = r.requests.filter((q) => !isFirstParty(q.url) && /^https?:/.test(q.url)).length;
      console.log(`  [${i + 1}/${pages.length}] ${page.url} ${r.error ? `ERROR ${r.error}` : `${r.requests.length} req, ${third} third-party`}`);
      await sleep(500);
    }
  } finally {
    await browser.close();
  }

  const header = ['page_url', 'page_type', 'locale', 'party', 'host', 'path', 'resource_type', 'method', 'status', 'failure'];
  const lines = [header.join(',')];
  for (const r of results) {
    for (const q of r.requests.filter(keepRequest)) {
      const u = new URL(q.url);
      lines.push([r.url, r.pageType, r.locale, isFirstParty(q.url) ? 'first' : 'third', u.hostname, u.pathname + u.search, q.resourceType, q.method, q.status, q.failure]
        .map((v) => csvCell(String(v).slice(0, 400)))
        .join(','));
    }
  }
  await writeFile(OUT_REQUESTS, `${lines.join('\n')}\n`);

  // Per third-party host: on which pages, as what, and whether the session proxy blocked it.
  const hosts = {};
  for (const r of results) {
    for (const q of r.requests.filter((x) => /^https?:/.test(x.url) && !isFirstParty(x.url))) {
      const h = (hosts[new URL(q.url).hostname] ??= { pages: new Set(), pageTypes: new Set(), resourceTypes: new Set(), failures: new Set(), sampleUrls: new Set() });
      h.pages.add(r.url);
      h.pageTypes.add(`${r.pageType}/${r.locale}`);
      h.resourceTypes.add(q.resourceType);
      if (q.failure) h.failures.add(q.failure);
      if (h.sampleUrls.size < 3) h.sampleUrls.add(q.url.slice(0, 200));
    }
  }
  const firstPartyApis = {};
  for (const r of results) {
    for (const q of r.requests.filter((x) => /^https?:/.test(x.url) && isFirstParty(x.url) && ['xhr', 'fetch'].includes(x.resourceType))) {
      const u = new URL(q.url);
      const key = `${q.method} ${u.hostname}${u.pathname}`;
      (firstPartyApis[key] ??= new Set()).add(r.pageType);
    }
  }
  const allText = results.map((r) => [r.dom?.inlineScripts ?? '', ...r.requests.map((q) => q.url)].join('\n')).join('\n');
  const summary = {
    measuredAt,
    node: process.version,
    browser: browserVersion,
    environment: 'Claude Code cloud container, headless Chromium via the session HTTPS proxy (third-party hosts may be blocked)',
    sampledPages: results.length,
    trackingIds: trackingIds(allText),
    thirdPartyHosts: Object.fromEntries(Object.keys(hosts).sort(byString).map((k) => [k, {
      pageCount: hosts[k].pages.size,
      pageTypes: uniqSorted(hosts[k].pageTypes),
      resourceTypes: uniqSorted(hosts[k].resourceTypes),
      blockedOrFailed: uniqSorted(hosts[k].failures),
      sampleUrls: [...hosts[k].sampleUrls],
    }])),
    firstPartyApis: Object.fromEntries(Object.keys(firstPartyApis).sort(byString).map((k) => [k, uniqSorted(firstPartyApis[k])])),
    apiClient: await scanBundles(bundlePagesOf(results)),
    pages: results.map((r) => ({
      url: r.url,
      pageType: r.pageType,
      locale: r.locale,
      reasons: r.reasons,
      ssr: { forms: r.ssrForms, media: r.ssrMedia },
      error: r.error,
      forms: r.dom?.forms,
      looseFields: r.dom?.looseFields,
      iframes: r.dom?.iframes,
      videos: r.dom?.videos,
      audios: r.dom?.audios,
      globals: r.dom?.globals,
      thirdPartyScripts: uniqSorted((r.dom?.scripts ?? []).filter((s) => /^https?:/.test(s) && !isFirstParty(s))),
      search: r.search,
    })),
  };
  await writeFile(OUT_SUMMARY, `${JSON.stringify(summary, null, 2)}\n`);
  console.log(`Done: ${results.length} pages, ${lines.length - 1} request rows, ${Object.keys(hosts).length} third-party hosts.`);
}

await main();
