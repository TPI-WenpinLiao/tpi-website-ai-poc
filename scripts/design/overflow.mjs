// Checks that no built page scrolls sideways: at each width, the document is no wider than the
// viewport. en and vi headings never break inside a word (src/styles/base.css), so a long word can
// push a page wider than a phone screen; this catches it (M7-02, #39).
// Part of `npm run check`, after the build: node scripts/design/overflow.mjs [path prefix=/] [widths=320,390,1024,1440]
// Uses CHROME_PATH (set by the SessionStart hook) or else the installed Chrome, which the CI runner has.
import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import puppeteer from 'puppeteer-core';
import { serve } from '../lib/static-server.mjs';
import { urlPath } from '../i18n/routes.mjs';

const DIST = resolve(import.meta.dirname, '../../dist');

async function main([prefix = '/', widths = '320,390,1024,1440']) {
  const paths = readdirSync(DIST, { recursive: true })
    .map(String)
    .filter((f) => f.endsWith('.html'))
    .map(urlPath)
    .filter((p) => p.startsWith(prefix))
    .sort();
  const server = await serve(DIST);
  const { port } = /** @type {import('node:net').AddressInfo} */ (server.address());
  const chrome = process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : { channel: /** @type {const} */ ('chrome') };
  const browser = await puppeteer.launch({ ...chrome, headless: true, args: ['--no-sandbox'] });
  const problems = [];
  try {
    const page = await browser.newPage();
    // Layout only: the 3D scene and other scripts don't change the page width, and WebGL can stall headless Chromium
    await page.setJavaScriptEnabled(false);
    for (const width of widths.split(',').map(Number)) {
      await page.setViewport({ width, height: 800 });
      for (const path of paths) {
        await page.goto(`http://localhost:${port}${path}`, { waitUntil: 'load' });
        const wide = await page.evaluate(() => document.documentElement.scrollWidth);
        if (wide > width) problems.push(`${path} at ${width}px: ${wide}px wide`);
      }
    }
  } finally {
    await browser.close();
    server.close();
  }
  for (const p of problems) console.log(p);
  console.log(`${paths.length} pages × ${widths.split(',').length} widths checked, ${problems.length} overflowing`);
  if (problems.length) process.exitCode = 1;
}

await main(process.argv.slice(2));
