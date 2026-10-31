#!/usr/bin/env node
// Takes the first-screen screenshots of the competitor home pages for docs/strategy/competitors.md
// (#164, .claude/skills/site-research「3. 競品分析」).
//
//   1. each home page is opened with a desktop Chrome user agent at 375×812 and 1280×800
//   2. the page waits for networkidle (or a fixed timeout when the network never goes idle),
//      then the viewport (not the full page) is saved as docs/strategy/competitors/<slug>-<width>.png
//   3. cookie banners are left as they are; nothing on the page is clicked or closed
//   4. a screenshot over 1 MB is saved as JPEG quality 80 instead (<slug>-<width>.jpg), so the repo stays small
//
// A page that fails to load is reported with the error and the time; the run goes on with the others
// and exits 1 at the end. Re-running overwrites the same files.
//
// Usage: node scripts/strategy/competitor-shots.mjs [--only systex,gss]
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

export const COMPETITORS = [
  { slug: 'systex', url: 'https://www.systex.com/' },
  { slug: 'gss', url: 'https://www.gss.com.tw/' },
  { slug: 'syscom', url: 'https://www.syscom.com.tw/' },
  { slug: 'fpt', url: 'https://www.fptsoftware.com/' },
];

async function shoot(browser, { slug, url }, viewport) {
  const context = await browser.newContext({ viewport, userAgent: USER_AGENT, locale: 'zh-TW' });
  const page = await context.newPage();
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 });
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
    console.error(`FAIL ${slug} ${viewport.width} ${new Date().toISOString()}: ${error.message}`);
    return false;
  } finally {
    await context.close();
  }
}

const { values } = parseArgs({ options: { only: { type: 'string' } } });
const only = values.only?.split(',');
await mkdir(OUT_DIR, { recursive: true });
const browser = await chromium.launch();
let ok = true;
for (const competitor of COMPETITORS.filter((c) => !only || only.includes(c.slug))) {
  for (const viewport of VIEWPORTS) ok = (await shoot(browser, competitor, viewport)) && ok;
}
await browser.close();
if (!ok) process.exit(1);
