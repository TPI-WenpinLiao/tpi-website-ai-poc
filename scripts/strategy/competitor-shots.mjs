#!/usr/bin/env node
// Takes the first-screen screenshots of the competitor pages for docs/strategy/competitors.md
// (.claude/skills/site-research「3. 競品分析」): the home pages (#164), and one page per pilot template
// other than home (#186): API management product pages for the offering template, finance industry
// pages for the hub template. Each entry's `template` says which pilot template it is compared with.
//
//   1. each page is opened with a desktop Chrome user agent at 375×812 and 1280×800
//   2. the page waits for networkidle (or a fixed timeout when the network never goes idle),
//      then the viewport (not the full page) is saved as docs/strategy/competitors/<slug>-<width>.png
//   3. cookie banners are left as they are; nothing on the page is clicked or closed
//   4. a response that is not 2xx (for example the proxy's "upstream request failed" page) is not saved,
//      so an earlier screenshot of that page stays; the page is tried up to ATTEMPTS times before it fails
//   5. a screenshot over 1 MB is saved as JPEG quality 80 instead (<slug>-<width>.jpg), so the repo stays small
//
// A page that fails to load is reported with the error and the time; the run goes on with the others
// and exits 1 at the end. Re-running overwrites the same files.
//
// Usage: node scripts/strategy/competitor-shots.mjs [--only systex,gss] [--template offering,hub]
import { mkdir, rm, stat } from 'node:fs/promises';
import { parseArgs } from 'node:util';
import { chromium } from 'playwright';

const OUT_DIR = 'docs/strategy/competitors';
const MAX_BYTES = 1024 * 1024;
const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';
const VIEWPORTS = [
  { width: 375, height: 812 },
  { width: 1280, height: 800 },
];
const IDLE_TIMEOUT = 30_000;
const SETTLE_MS = 3_000;
const ATTEMPTS = 3;

export const COMPETITORS = [
  { slug: 'systex', template: 'home', url: 'https://www.systex.com/' },
  { slug: 'gss', template: 'home', url: 'https://www.gss.com.tw/' },
  { slug: 'syscom', template: 'home', url: 'https://www.syscom.com.tw/' },
  { slug: 'fpt', template: 'home', url: 'https://www.fptsoftware.com/' },
  { slug: 'kong-product', template: 'offering', url: 'https://konghq.com/products/kong-gateway' },
  { slug: 'apigee-product', template: 'offering', url: 'https://cloud.google.com/apigee?hl=zh-TW' },
  {
    slug: 'syscom-bantalk',
    template: 'offering',
    url: 'https://www.syscom.com.tw/Products_Solution_Detail.aspx?id=77',
  },
  {
    slug: 'systex-finance',
    template: 'hub',
    url: 'https://tw.systex.com/systex/ch/app/data/list?module=moduleB0005&id=22224',
  },
  { slug: 'syscom-finance', template: 'hub', url: 'https://www.syscom.com.tw/Products_Solution.aspx' },
  {
    slug: 'fpt-finance',
    template: 'hub',
    url: 'https://fptsoftware.com/industries/banking-and-financial-services',
  },
];

async function shoot(browser, competitor, viewport) {
  for (let attempt = 1; attempt <= ATTEMPTS; attempt += 1) {
    if (await shootOnce(browser, competitor, viewport, attempt)) return true;
  }
  return false;
}

async function shootOnce(browser, { slug, url }, viewport, attempt) {
  const context = await browser.newContext({ viewport, userAgent: USER_AGENT, locale: 'zh-TW' });
  const page = await context.newPage();
  try {
    const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 });
    if (!response?.ok()) throw new Error(`HTTP ${response?.status()} ${response?.url()}`);
    await page.waitForLoadState('networkidle', { timeout: IDLE_TIMEOUT }).catch(() => {});
    await page.waitForTimeout(SETTLE_MS);
    const base = `${OUT_DIR}/${slug}-${viewport.width}`;
    await rm(`${base}.jpg`, { force: true });
    await page.screenshot({ path: `${base}.png` });
    let file = `${base}.png`;
    if ((await stat(file)).size > MAX_BYTES) {
      await page.screenshot({ path: `${base}.jpg`, type: 'jpeg', quality: 80 });
      await rm(file);
      file = `${base}.jpg`;
    }
    const { size } = await stat(file);
    console.log(`${file}\t${Math.round(size / 1024)} KB\t${page.url()}`);
    return true;
  } catch (error) {
    console.error(
      `FAIL ${slug} ${viewport.width} attempt ${attempt}/${ATTEMPTS} ${new Date().toISOString()}: ${error.message}`,
    );
    return false;
  } finally {
    await context.close();
  }
}

const { values } = parseArgs({ options: { only: { type: 'string' }, template: { type: 'string' } } });
const only = values.only?.split(',');
const templates = values.template?.split(',');
await mkdir(OUT_DIR, { recursive: true });
const browser = await chromium.launch();
let ok = true;
for (const competitor of COMPETITORS.filter(
  (c) => (!only || only.includes(c.slug)) && (!templates || templates.includes(c.template)),
)) {
  for (const viewport of VIEWPORTS) ok = (await shoot(browser, competitor, viewport)) && ok;
}
await browser.close();
if (!ok) process.exit(1);
