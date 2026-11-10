// Measures the built site on wide screens (#238): how tall the home page grows, whether the cases
// section's picture fits the screen, whether the header and the home grid share a left edge, and how
// wide an inner page's content runs. Then, for every picture on the home page and the template
// previews, whether its `sizes` picks the same srcset candidate as its rendered width would: a
// different pick downloads a smaller (blurry) or a larger (wasted) file. Prints tables; it fails
// nothing (not part of `npm run check`).
// After the build: node scripts/design/wide.mjs [widths=1440,1920,2560,3440,5120] [height=1440] [shots dir]
// With a shots dir it also saves one screen of each page it measures, for comparing by eye:
// <width>-home.png, <width>-home-cases.png, <width>-about-us.png, <width>-templates-<id>.png
// Uses CHROME_PATH (set by the SessionStart hook), else CHROME_BIN (set on GitHub's runners), else the installed Chrome.
import { mkdirSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import puppeteer from 'puppeteer-core';
import { serve } from '../lib/static-server.mjs';

const DIST = resolve(import.meta.dirname, '../../dist');
const INNER = '/about-us';
// Long enough for the live layout (html.want-3d) to mount and lay the scene out after the load
const SETTLE_MS = 1500;

const round = (/** @type {number} */ n) => Math.round(n);

/**
 * Every picture with `sizes` on the page: its rendered width, the width its `sizes` resolves to at
 * this viewport, and the srcset candidates (DPR 1) each of them picks. Runs in the page.
 */
function pictures() {
  const px = (/** @type {string} */ length) => {
    const probe = document.createElement('div');
    probe.style.cssText = `position:absolute;visibility:hidden;inline-size:${length}`;
    document.body.append(probe);
    const w = probe.getBoundingClientRect().width;
    probe.remove();
    return w;
  };
  // `(media) length, (media) length, length`: the first entry whose media matches
  const sizeOf = (/** @type {string} */ sizes) => {
    for (const entry of sizes.split(/,(?![^(]*\))/).map((e) => e.trim())) {
      const m = entry.match(/^(\(.*\))\s+(.+)$/);
      if (!m) return px(entry);
      if (matchMedia(/** @type {string} */ (m[1])).matches) return px(/** @type {string} */ (m[2]));
    }
    return NaN;
  };
  const pick = (/** @type {number[]} */ ws, /** @type {number} */ w) => ws.find((c) => c >= w) ?? ws.at(-1) ?? NaN;
  return [...document.querySelectorAll('img')].flatMap((img) => {
    // In a <picture> the matching <source> carries srcset and sizes
    const source = [...(img.parentElement?.tagName === 'PICTURE' ? img.parentElement.querySelectorAll('source') : [])].find(
      (s) => !s.media || matchMedia(s.media).matches,
    );
    const sizes = source?.getAttribute('sizes') ?? img.getAttribute('sizes');
    const srcset = source?.getAttribute('srcset') ?? img.getAttribute('srcset');
    const rendered = img.getBoundingClientRect().width;
    if (!sizes || !srcset || !rendered) return [];
    const ws = [...srcset.matchAll(/\s(\d+)w(?:,|$)/g)].map((m) => Number(m[1])).sort((a, b) => a - b);
    const wanted = sizeOf(sizes);
    const name = img.className.split(' ')[0] || img.closest('[class]')?.className.split(' ')[0] || 'img';
    return [{ name, sizes, rendered, wanted, fits: pick(ws, rendered), picked: pick(ws, wanted) }];
  });
}

async function main([widths = '1440,1920,2560,3440,5120', height = '1440', shots = '']) {
  if (shots) mkdirSync(shots, { recursive: true });
  /** @param {import('puppeteer-core').Page} page @param {number} w @param {string} name */
  const shoot = async (page, w, name) => {
    if (shots) await page.screenshot({ path: /** @type {`${string}.png`} */ (resolve(shots, `${w}-${name}.png`)) });
  };
  const previews = readdirSync(resolve(DIST, 'templates'))
    .filter((f) => f.endsWith('.html'))
    .map((f) => `/templates/${f.replace(/\.html$/, '')}`)
    .sort();
  const server = await serve(DIST);
  const { port } = /** @type {import('node:net').AddressInfo} */ (server.address());
  const executablePath = process.env.CHROME_PATH || process.env.CHROME_BIN;
  const chrome = executablePath ? { executablePath } : { channel: /** @type {const} */ ('chrome') };
  const browser = await puppeteer.launch({ ...chrome, headless: true, args: ['--no-sandbox', '--enable-unsafe-swiftshader'] });
  const h = Number(height);
  const rows = [];
  /** @type {Map<string, number>} a miss and how many pictures on that page share it */
  const misses = new Map();
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
      await shoot(page, w, 'home');
      // The cases section holds its stage on screen: scroll it to the top and measure the picture there
      await page.evaluate((y) => scrollTo(0, y + 10), home.casesTop);
      await new Promise((r) => setTimeout(r, SETTLE_MS));
      const slot = await page.evaluate(() => {
        const r = document.querySelector('.slot')?.getBoundingClientRect();
        return r ? { w: r.width, h: r.height, bottom: r.bottom } : undefined;
      });
      await shoot(page, w, 'home-cases');
      await page.goto(`http://localhost:${port}${INNER}`, { waitUntil: 'load' });
      const inner = await page.evaluate(() => document.querySelector('main .surface .inner')?.getBoundingClientRect().width ?? NaN);
      for (const path of ['/', INNER, ...previews]) {
        await page.goto(`http://localhost:${port}${path}`, { waitUntil: 'load' });
        if (path !== '/') await shoot(page, w, path.slice(1).replaceAll('/', '-'));
        for (const p of await page.evaluate(pictures)) {
          if (p.fits === p.picked) continue;
          const way = p.picked < p.fits ? 'too small' : 'too large';
          const key = `${w}px ${path} .${p.name}: rendered ${round(p.rendered)}, sizes "${p.sizes}" = ${round(p.wanted)} → picks ${p.picked}w, ${way} (fits ${p.fits}w)`;
          misses.set(key, (misses.get(key) ?? 0) + 1);
        }
      }
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
  const total = [...misses.values()].reduce((a, b) => a + b, 0);
  console.log(`\nPictures whose sizes picks another srcset candidate than their rendered width (DPR 1): ${total}`);
  for (const [m, n] of misses) console.log(`- ${m}${n > 1 ? ` ×${n}` : ''}`);
}

await main(process.argv.slice(2));
