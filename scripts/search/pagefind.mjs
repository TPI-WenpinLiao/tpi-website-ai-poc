// Checks the site search on the built site (M6-02, #34). Fails when:
// - an index's page count differs from the built pages of that <html lang> with data-pagefind-body
// - a zh-TW query finds fewer pages than its floor (the segmentation of src/lib/search/segment.ts
//   broke: Pagefind's own zh segmentation found 企業 on 7 pages, the ICU one on 53)
// - a locale's /search links to a page of another locale
// - a page other than /search requests /pagefind/, on load or with the header's search box open
//   (one page per template, the lighthouserc.cjs PAGES but /search)
// - the keyboard alone can't get from the search field to a result, or 顯示更多 doesn't move focus
//   to the first result it adds
// - the role="status" live region is out of the accessibility tree while empty (display: none),
//   so its first text may not be announced
// - two quick clicks on 顯示更多 list a result twice
// - axe finds a WCAG 2.2 A/AA violation on /search with results or with none (scripts/design/axe.mjs
//   only sees the page before a search)
// Part of `npm run check`, after the build: node scripts/search/pagefind.mjs
// Uses CHROME_PATH (set by the SessionStart hook), else CHROME_BIN (set on GitHub's runners), else the installed Chrome.

import { readdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import axe from 'axe-core';
import puppeteer from 'puppeteer-core';
import { serve } from '../lib/static-server.mjs';
import { urlPath } from '../i18n/routes.mjs';
import { TAGS } from '../design/axe.mjs';

const DIST = resolve(import.meta.dirname, '../../dist');
const { PAGES } = createRequire(import.meta.url)('../../lighthouserc.cjs');

// The zh-TW queries and the fewest pages each must find (2026-10-27: 53, 19, 37)
export const ZH_QUERIES = [
  { q: '企業', min: 30 },
  { q: '數位轉型', min: 10 },
  { q: '昕力資訊', min: 20 },
];
// Each locale's search page and a query found in all three
export const LOCALES = [
  { lang: 'zh-tw', search: '/search', prefix: '' },
  { lang: 'en', search: '/en/search', prefix: '/en' },
  { lang: 'vi', search: '/vi/search', prefix: '/vi' },
];
const SHARED_QUERY = 'API';
// Tab presses from the top of /search to its field, and from the field to the first result
const MAX_TABS = 60;
const RESULT_TABS = 5;
// Results SearchResults shows at a time
const PAGE_SIZE = 10;
// /search states axe runs on: results, and a query nothing matches
const AXE_PATHS = [`/search?q=${encodeURIComponent('企業')}`, '/search?q=zzzzqqqq'];

const within = (/** @type {string} */ url, /** @type {string} */ prefix) => url === prefix || url.startsWith(`${prefix}/`);

/** URLs of `urls` that belong to another locale than `prefix` ('' is zh-TW, unprefixed) */
export const foreign = (/** @type {string[]} */ urls, /** @type {string} */ prefix) =>
  urls.filter((u) => (prefix ? !within(u, prefix) : within(u, '/en') || within(u, '/vi')));

/**
 * @typedef {{ lang: string, indexed: number | undefined, built: number }} IndexCount
 * @typedef {{ q: string, found: number, min: number }} Query
 * @typedef {{ search: string, foreign: string[], found: number }} Locale
 * @typedef {{ path: string, requests: string[] }} Load
 * @typedef {{ field: boolean, results: number, result: boolean, moreFocus: boolean }} Keyboard
 * @typedef {{ liveRegion: boolean, repeated: string[] }} Results
 * @typedef {{ path: string, violations: string[] }} Axe
 * @param {{ counts: IndexCount[], queries: Query[], locales: Locale[], loads: Load[], keyboard: Keyboard, axe: Axe[], list: Results }} r
 * @returns {string[]}
 */
export function problems({ counts, queries, locales, loads, keyboard, axe, list }) {
  const out = [];
  for (const c of counts) {
    if (c.indexed === undefined) out.push(`no ${c.lang} index in pagefind-entry.json (${c.built} pages to index)`);
    else if (c.indexed !== c.built) out.push(`the ${c.lang} index has ${c.indexed} pages, ${c.built} built pages have data-pagefind-body`);
  }
  for (const q of queries) if (q.found < q.min) out.push(`zh-TW "${q.q}" found ${q.found} pages, at least ${q.min} expected`);
  for (const l of locales) {
    if (l.found === 0) out.push(`${l.search}?q=${SHARED_QUERY} found nothing`);
    for (const u of l.foreign) out.push(`${l.search} links to another locale: ${u}`);
  }
  for (const l of loads) for (const u of l.requests) out.push(`${l.path} requested ${u}`);
  if (!keyboard.field) out.push(`/search: no search field within ${MAX_TABS} Tab presses`);
  else if (keyboard.results === 0) out.push('/search: typing in the field showed no results');
  else if (!keyboard.result) out.push(`/search: no result link within ${RESULT_TABS} Tab presses after the field`);
  else if (!keyboard.moreFocus) out.push(`/search: Enter on 顯示更多結果 did not move focus to result ${PAGE_SIZE + 1}`);
  for (const a of axe) for (const v of a.violations) out.push(`${a.path}: axe ${v}`);
  if (!list.liveRegion) out.push('/search: the empty role="status" region is display: none, out of the accessibility tree');
  for (const u of list.repeated) out.push(`/search: two clicks on 顯示更多結果 listed ${u} twice`);
  return out;
}

// Built pages with data-pagefind-body per lowercased <html lang>
function builtCounts() {
  /** @type {Record<string, number>} */
  const counts = {};
  for (const f of readdirSync(DIST, { recursive: true }).map(String)) {
    if (!f.endsWith('.html') || f.startsWith('pagefind')) continue;
    const html = readFileSync(join(DIST, f), 'utf8');
    const lang = html.match(/<html lang="([^"]+)"/)?.[1]?.toLowerCase();
    if (lang && html.includes('data-pagefind-body')) counts[lang] = (counts[lang] ?? 0) + 1;
  }
  return counts;
}

/** @param {import('puppeteer-core').Browser} browser @param {string} origin @param {string} path */
async function open(browser, origin, path) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 860 });
  /** @type {string[]} */
  const requests = [];
  page.on('request', (r) => requests.push(r.url()));
  // load, then network idle: goto's networkidle0 does not settle on the home page at 1280px while
  // the 3D scene starts in headless Chromium, though no request is pending
  await page.goto(`${origin}${path}`, { waitUntil: 'load' });
  await page.waitForNetworkIdle({ idleTime: 500 });
  return { page, requests };
}

// The result URLs of `q` through Pagefind's own API on `search` (its index is the page's locale)
/** @param {import('puppeteer-core').Browser} browser @param {string} origin @param {string} search @param {string} q */
async function results(browser, origin, search, q) {
  const { page } = await open(browser, origin, search);
  const urls = await page.evaluate(async (query) => {
    const pagefind = await import('/pagefind/pagefind.js');
    const found = await pagefind.search(query);
    return Promise.all(found.results.map(async (/** @type {{ data: () => Promise<{ url: string }> }} */ r) => (await r.data()).url));
  }, q);
  await page.close();
  return urls;
}

// Loads `path`, opens the header's search box and returns the /pagefind/ requests
/** @param {import('puppeteer-core').Browser} browser @param {string} origin @param {string} path */
async function load(browser, origin, path) {
  const { page, requests } = await open(browser, origin, path);
  await page.$eval('.site-header details.search > summary', (el) => el instanceof HTMLElement && el.click());
  await page.waitForNetworkIdle();
  await page.close();
  return { path, requests: requests.filter((u) => new URL(u).pathname.startsWith('/pagefind/')) };
}

/** @param {import('puppeteer-core').Browser} browser @param {string} origin */
async function keyboard(browser, origin) {
  const { page } = await open(browser, origin, '/search');
  const active = (/** @type {string} */ selector) => page.evaluate((s) => document.activeElement?.matches(s) ?? false, selector);
  let field = false;
  for (let i = 0; i < MAX_TABS && !field; i++) {
    await page.keyboard.press('Tab');
    field = await active('#search-form input[name="q"]');
  }
  if (!field) return { field, results: 0, result: false, moreFocus: false };
  await page.keyboard.type(ZH_QUERIES[0].q);
  await page.waitForSelector('[data-search-results]:is([data-state="results"], [data-state="none"], [data-state="error"])');
  const shown = await page.$$eval('[data-list] a', (links) => links.length);
  let result = false;
  for (let i = 0; i < RESULT_TABS && !result; i++) {
    await page.keyboard.press('Tab');
    result = await active('[data-list] a');
  }
  await page.focus('[data-more] button');
  await page.keyboard.press('Enter');
  const next = `[data-list] li:nth-child(${PAGE_SIZE + 1}) a`;
  const moreFocus = await page.waitForFunction((s) => document.activeElement?.matches(s), { timeout: 5000 }, next).then(
    () => true,
    () => false,
  );
  await page.close();
  return { field, results: shown, result, moreFocus };
}

// The live region before a search, then two clicks on 顯示更多 in a row
/** @param {import('puppeteer-core').Browser} browser @param {string} origin */
async function resultList(browser, origin) {
  const idle = await open(browser, origin, '/search');
  const liveRegion = await idle.page.$eval('[data-search-results] [role="status"]', (el) => getComputedStyle(el).display !== 'none');
  await idle.page.close();
  const { page } = await open(browser, origin, `/search?q=${encodeURIComponent(ZH_QUERIES[0].q)}`);
  await page.waitForSelector('[data-search-results][data-state="results"]');
  await page.$eval('[data-more] button', (b) => {
    if (!(b instanceof HTMLElement)) return;
    b.click();
    b.click();
  });
  await page.waitForFunction((n) => document.querySelectorAll('[data-list] li').length >= n, { timeout: 5000 }, PAGE_SIZE * 3).catch(() => undefined);
  const hrefs = await page.$$eval('[data-list] a', (links) => links.map((a) => a.getAttribute('href') ?? ''));
  await page.close();
  return { liveRegion, repeated: [...new Set(hrefs.filter((h, i) => hrefs.indexOf(h) !== i))] };
}

/** @param {import('puppeteer-core').Browser} browser @param {string} origin @param {string} path */
async function axeState(browser, origin, path) {
  const { page } = await open(browser, origin, path);
  await page.waitForSelector('[data-search-results]:is([data-state="results"], [data-state="none"])');
  await page.evaluate(axe.source);
  const violations = await page.evaluate(
    (tags) => /** @type {any} */ (window).axe.run(document, { runOnly: { type: 'tag', values: tags }, resultTypes: ['violations'] }).then((/** @type {any} */ r) => r.violations.map((/** @type {any} */ v) => `${v.id} (${v.nodes.length})`)),
    TAGS,
  );
  await page.close();
  return { path: decodeURIComponent(path), violations };
}

async function main() {
  const entry = JSON.parse(readFileSync(join(DIST, 'pagefind/pagefind-entry.json'), 'utf8'));
  const built = builtCounts();
  const counts = LOCALES.map(({ lang }) => ({ lang, indexed: entry.languages[lang]?.page_count, built: built[lang] ?? 0 }));

  const server = await serve(DIST);
  const { port } = /** @type {import('node:net').AddressInfo} */ (server.address());
  const origin = `http://localhost:${port}`;
  const executablePath = process.env.CHROME_PATH || process.env.CHROME_BIN;
  const chrome = executablePath ? { executablePath } : { channel: /** @type {const} */ ('chrome') };
  const browser = await puppeteer.launch({ ...chrome, headless: true, args: ['--no-sandbox'] });
  let found;
  try {
    const queries = [];
    for (const { q, min } of ZH_QUERIES) queries.push({ q, min, found: (await results(browser, origin, '/search', q)).length });
    const locales = [];
    for (const { search, prefix } of LOCALES) {
      const urls = await results(browser, origin, search, SHARED_QUERY);
      locales.push({ search, found: urls.length, foreign: foreign(urls, prefix) });
    }
    const loads = [];
    // Every PAGES entry but the search page itself, which PAGES lists with a query
    const others = PAGES.map((/** @type {{ path: string }} */ p) => urlPath(p.path.split('?')[0].replace(/^\//, ''))).filter((p) => !LOCALES.some((l) => l.search === p));
    for (const path of others) loads.push(await load(browser, origin, path));
    const axeResults = [];
    for (const path of AXE_PATHS) axeResults.push(await axeState(browser, origin, path));
    found = problems({ counts, queries, locales, loads, keyboard: await keyboard(browser, origin), axe: axeResults, list: await resultList(browser, origin) });
    const summary = queries.map((q) => `${q.q} ${q.found}`).join(', ');
    console.log(`search: ${counts.map((c) => `${c.lang} ${c.indexed}`).join(', ')} pages indexed; zh-TW ${summary}; ${loads.length} pages without /pagefind/ requests checked`);
  } finally {
    await browser.close();
    server.close();
  }
  for (const p of found) console.log(p);
  console.log(`${found.length} search problems`);
  if (found.length) process.exitCode = 1;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) await main();
