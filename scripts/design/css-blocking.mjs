// The render-blocking CSS of built pages (#143): what a phone downloads before the first paint.
// For each page: the HTML and every stylesheet it links or inlines, raw and gzipped (the
// static server and Cloudflare Pages send gzip; Lighthouse simulates the network from those
// bytes), and how much of each the page uses once loaded at a phone width (Chrome's CSS
// coverage, no interaction: rules for open menus, hover or other breakpoints count as unused).
// Run after `npm run build`: node scripts/design/css-blocking.mjs [path ...]

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { gzipSync } from 'node:zlib';
import puppeteer from 'puppeteer-core';
import { serve } from '../lib/static-server.mjs';

const DIST = resolve(import.meta.dirname, '../../dist');
// The pages at exactly 0.95 in the full-site run (ADR 0004 "M8-01 重跑"), and the home page
export const PATHS = ['/en/contact-us', '/vi/contact-us', '/vi', '/media-center/572', '/'];
// Lighthouse's mobile viewport
const VIEWPORT = { width: 412, height: 823, deviceScaleFactor: 1.75, isMobile: true, hasTouch: true };

const gz = (text) => gzipSync(text).length;
const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;

/**
 * Sums Chrome's coverage ranges per stylesheet. Inline <style> sheets have no URL: they are keyed
 * `inline #n` in document order, like the sheets returned by the page.
 * @param {Array<{ url: string, text: string, ranges: Array<{ start: number, end: number }> }>} coverage
 */
export function usedBytes(coverage) {
  const used = new Map();
  for (const { url, ranges } of coverage) {
    const bytes = ranges.reduce((sum, r) => sum + r.end - r.start, 0);
    used.set(url, (used.get(url) ?? 0) + bytes);
  }
  return used;
}

/** @param {import('puppeteer-core').Browser} browser @param {string} origin @param {string} path */
async function measure(browser, origin, path) {
  const page = await browser.newPage();
  await page.setViewport(VIEWPORT);
  await page.coverage.startCSSCoverage({ resetOnNavigation: false });
  const response = await page.goto(`${origin}${path}`, { waitUntil: 'load' });
  if (!response?.ok()) throw new Error(`${path}: HTTP ${response?.status()}`);
  const html = await response.text();
  // Render-blocking: <link rel=stylesheet> without a non-matching media, and <style> in the head
  const sheets = await page.$$eval('link[rel="stylesheet"], head style', (els) =>
    els
      .filter((el) => !(el instanceof HTMLLinkElement) || !el.media || matchMedia(el.media).matches)
      .map((el) => (el instanceof HTMLLinkElement ? { href: new URL(el.href).pathname } : { inline: el.textContent ?? '' })),
  );
  const used = usedBytes(await page.coverage.stopCSSCoverage());
  await page.close();

  let inlineIndex = 0;
  const files = sheets.map((sheet) => {
    if ('href' in sheet) {
      const text = readFileSync(resolve(DIST, `.${sheet.href}`), 'utf8');
      return { name: sheet.href.replace('/_astro/', ''), raw: text.length, gzip: gz(text), used: used.get(`${origin}${sheet.href}`) ?? 0 };
    }
    // Coverage reports inline sheets with the page URL, all together
    inlineIndex += 1;
    return { name: `inline #${inlineIndex}`, raw: sheet.inline.length, gzip: undefined, used: undefined };
  });
  const inlineUsed = used.get(`${origin}${path}`);
  return { path, html: { raw: Buffer.byteLength(html), gzip: gz(html) }, files, inlineUsed };
}

async function main() {
  const paths = process.argv.slice(2);
  const server = await serve(DIST);
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('server has no port');
  const origin = `http://localhost:${address.port}`;
  const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH, headless: true, args: ['--no-sandbox'] });
  const results = [];
  try {
    for (const path of paths.length ? paths : PATHS) results.push(await measure(browser, origin, path));
  } finally {
    await browser.close();
    server.close();
  }

  console.log('| 頁面 | HTML（gzip） | CSS 檔 | CSS 合計（gzip） | 載入時用到 |');
  console.log('|---|---|---|---|---|');
  for (const r of results) {
    const external = r.files.filter((f) => f.gzip !== undefined);
    const raw = r.files.reduce((s, f) => s + f.raw, 0);
    const gzip = external.reduce((s, f) => s + (f.gzip ?? 0), 0);
    const used = external.reduce((s, f) => s + (f.used ?? 0), 0) + (r.inlineUsed ?? 0);
    console.log(
      `| \`${r.path}\` | ${kb(r.html.raw)}（${kb(r.html.gzip)}） | ${external.length} 個外部${r.files.length - external.length ? `、${r.files.length - external.length} 個 inline` : ''} | ${kb(raw)}（外部 ${kb(gzip)}） | ${Math.round((used / raw) * 100)}% |`,
    );
  }
  console.log('');
  console.log('| 頁面 | CSS | bytes | gzip | 載入時用到 |');
  console.log('|---|---|---|---|---|');
  for (const r of results) {
    for (const f of r.files) {
      const share = f.used === undefined ? '–' : `${Math.round((f.used / f.raw) * 100)}%`;
      console.log(`| \`${r.path}\` | \`${f.name}\` | ${f.raw} | ${f.gzip ?? '–'} | ${share} |`);
    }
  }
}

if (import.meta.url === `file://${process.argv[1]}`) await main();
