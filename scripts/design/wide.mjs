// Measures the built site on wide screens (#238): how tall the home page grows, whether the cases
// section's picture fits the screen, whether the header and the home grid share a left edge, and how
// wide an inner page's content runs. Prints a table; it fails nothing (not part of `npm run check`).
// After the build: node scripts/design/wide.mjs [widths=1440,1920,2560,3440,5120] [height=1440]
// Uses CHROME_PATH (set by the SessionStart hook), else CHROME_BIN (set on GitHub's runners), else the installed Chrome.
import { resolve } from 'node:path';
import puppeteer from 'puppeteer-core';
import { serve } from '../lib/static-server.mjs';

const DIST = resolve(import.meta.dirname, '../../dist');
const INNER = '/about-us';
// Long enough for the live layout (html.want-3d) to mount and lay the scene out after the load
const SETTLE_MS = 1500;

const round = (/** @type {number} */ n) => Math.round(n);

async function main([widths = '1440,1920,2560,3440,5120', height = '1440']) {
  const server = await serve(DIST);
  const { port } = /** @type {import('node:net').AddressInfo} */ (server.address());
  const executablePath = process.env.CHROME_PATH || process.env.CHROME_BIN;
  const chrome = executablePath ? { executablePath } : { channel: /** @type {const} */ ('chrome') };
  const browser = await puppeteer.launch({ ...chrome, headless: true, args: ['--no-sandbox', '--enable-unsafe-swiftshader'] });
  const h = Number(height);
  const rows = [];
  try {
    for (const w of widths.split(',').map(Number)) {
      const page = await browser.newPage();
      await page.setViewport({ width: w, height: h });
      await page.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle0' });
      await new Promise((r) => setTimeout(r, SETTLE_MS));
      const home = await page.evaluate(() => {
        const box = (/** @type {string} */ s) => document.querySelector(s)?.getBoundingClientRect();
        return {
          live: document.documentElement.classList.contains('want-3d'),
          docH: document.documentElement.scrollHeight,
          logo: box('.site-header .logo')?.left ?? NaN,
          h1: box('#hero-title')?.left ?? NaN,
          casesTop: (box('.cases')?.top ?? 0) + scrollY,
        };
      });
      // The cases section holds its stage on screen: scroll it to the top and measure the picture there
      await page.evaluate((y) => scrollTo(0, y + 10), home.casesTop);
      await new Promise((r) => setTimeout(r, SETTLE_MS));
      const slot = await page.evaluate(() => {
        const r = document.querySelector('.slot')?.getBoundingClientRect();
        return r ? { w: r.width, h: r.height, bottom: r.bottom } : undefined;
      });
      await page.goto(`http://localhost:${port}${INNER}`, { waitUntil: 'load' });
      const inner = await page.evaluate(() => document.querySelector('main .surface .inner')?.getBoundingClientRect().width ?? NaN);
      await page.close();
      rows.push({
        width: `${w}×${h}`,
        live: home.live ? 'yes' : 'no',
        'home height': home.docH,
        'slot size': slot ? `${round(slot.w)}×${round(slot.h)}` : '-',
        'slot bottom / screen': slot ? `${round(slot.bottom)} / ${h}${slot.bottom > h ? ' (cut off)' : ''}` : '-',
        'logo x / h1 x': `${round(home.logo)} / ${round(home.h1)}`,
        [`${INNER} content`]: `${round(inner)} (${round((inner / w) * 100)}%)`,
      });
    }
  } finally {
    await browser.close();
    server.close();
  }
  const keys = Object.keys(rows[0] ?? {});
  console.log(`| ${keys.join(' | ')} |\n|${keys.map(() => '---').join('|')}|`);
  for (const r of rows) console.log(`| ${keys.map((k) => r[/** @type {keyof typeof r} */ (k)]).join(' | ')} |`);
}

await main(process.argv.slice(2));
