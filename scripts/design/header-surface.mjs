// Checks that the sticky header follows the purple bands (#179): SiteHeader's script sets the header's
// data-surface to "dark" while a data-surface="dark" section (OrientAI, contact, ContactCta, the
// footer) is under the header's bottom edge, and back to "light" elsewhere.
// On the three home pages and one inner page (an offering page: ContactCta and the footer), on a
// phone, a desktop (on the home pages the live 3D layout, html.want-3d) and a desktop that prefers
// reduced motion: scroll to the top, to just above and just inside each band,
// then back to the top. At every stop the header's data-surface must match what the bands' boxes say,
// and the header's text must reach 4.5:1 on its background. On the desktop the keyboard focus ring of
// the header's first link must show and reach 3:1 on both surfaces; under reduced motion the header's
// color change must not be animated.
// --shots <dir> also saves the top of the viewport before and after the OrientAI band on the three
// home pages, at 1280 and 375 px, for a design review in a PR.
// Part of `npm run check`, after the build: node scripts/design/header-surface.mjs [--shots <dir>]
// Uses CHROME_PATH (set by the SessionStart hook), else CHROME_BIN (set on GitHub's runners), else the installed Chrome.

import { mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer-core';
import { serve } from '../lib/static-server.mjs';
import { contrastRatio } from './contrast.mjs';
import { LAUNCH_ARGS } from './scene-wait.mjs';

const DIST = resolve(import.meta.dirname, '../../dist');
export const HOMES = ['/', '/en', '/vi'];
export const PATHS = [...HOMES, '/products/digirunner'];
export const MODES = [
  { name: 'phone', width: 375, height: 760, reduced: false },
  { name: 'desktop', width: 1280, height: 800, reduced: false },
  { name: 'desktop, reduced motion', width: 1280, height: 800, reduced: true },
];
// How far above and below a band's top edge the header's bottom edge is put
const OFFSET = 80;
// Longer than --duration-fast, the header's color transition
const SETTLE_MS = 400;

/**
 * The surface the header should be on: dark while any band's box crosses the header's bottom pixel
 * row, [height - 1, height).
 * @param {{ top: number, bottom: number }[]} bands viewport boxes of the data-surface="dark" sections
 * @param {number} height the header's height
 * @returns {'light' | 'dark'}
 */
export function expectedSurface(bands, height) {
  return bands.some((b) => b.top < height && b.bottom > height - 1) ? 'dark' : 'light';
}

/**
 * A computed CSS color (rgb() or rgba(), comma or space separated) as #rrggbb; alpha is dropped.
 * @param {string} css
 */
export function cssToHex(css) {
  const m = /^rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/.exec(css);
  if (!m) throw new Error(`not an rgb() color: ${css}`);
  return `#${m.slice(1, 4).map((c) => Number(c).toString(16).padStart(2, '0')).join('')}`;
}

/**
 * Problems at one scroll stop.
 * @param {{ actual: string | undefined, expected: string, text: string, bg: string }} stop
 * @returns {string[]}
 */
export function stopProblems({ actual, expected, text, bg }) {
  const out = [];
  if (actual !== expected) out.push(`header is ${actual ?? 'unset'}, expected ${expected}`);
  const ratio = contrastRatio(cssToHex(text), cssToHex(bg));
  if (ratio < 4.5) out.push(`header text ${ratio.toFixed(2)}:1 on its background, below 4.5:1`);
  return out;
}

/**
 * Problems with the focus ring of the header's first link.
 * @param {{ style: string, color: string, bg: string }} ring
 * @returns {string[]}
 */
export function focusProblems({ style, color, bg }) {
  if (style === 'none') return ['no focus outline'];
  const ratio = contrastRatio(cssToHex(color), cssToHex(bg));
  return ratio < 3 ? [`focus outline ${ratio.toFixed(2)}:1 on the header, below 3:1`] : [];
}

/** @param {import('puppeteer-core').Page} page */
const settle = (page) =>
  page.evaluate(
    (ms) => new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(done, ms)))),
    SETTLE_MS,
  );

/**
 * The header's state and what the bands say it should be.
 * @param {import('puppeteer-core').Page} page
 */
const readStop = (page) =>
  page.evaluate(() => {
    const header = /** @type {HTMLElement} */ (document.querySelector('.site-header'));
    const bands = [...document.querySelectorAll('[data-surface="dark"]')]
      .filter((el) => !el.closest('.site-header'))
      .map((el) => {
        const r = el.getBoundingClientRect();
        return { top: r.top, bottom: r.bottom };
      });
    const style = getComputedStyle(header);
    return {
      actual: header.dataset.surface,
      height: header.offsetHeight,
      bands,
      text: style.color,
      bg: style.backgroundColor,
      transition: style.transitionDuration,
      scrollY,
    };
  });

/**
 * Scroll positions to stop at: the top, each band's top edge OFFSET px below and above the header's
 * bottom edge, the top again.
 * @param {import('puppeteer-core').Page} page
 * @returns {Promise<{ label: string, y: number }[]>}
 */
const stops = (page) =>
  page.evaluate((offset) => {
    const header = /** @type {HTMLElement} */ (document.querySelector('.site-header'));
    const out = [{ label: 'top', y: 0 }];
    for (const el of document.querySelectorAll('[data-surface="dark"]')) {
      if (el.closest('.site-header')) continue;
      const top = el.getBoundingClientRect().top + scrollY - header.offsetHeight;
      const name = el.className.toString().split(' ')[0] || el.tagName.toLowerCase();
      out.push({ label: `above ${name}`, y: top - offset }, { label: `inside ${name}`, y: top + offset });
    }
    out.push({ label: 'top again', y: 0 });
    return out;
  }, OFFSET);

/**
 * Tab to the header's first link (past the skip link) and read its focus ring.
 * @param {import('puppeteer-core').Page} page
 */
async function focusRing(page) {
  await page.evaluate(() => /** @type {HTMLElement} */ (document.activeElement)?.blur());
  for (let i = 0; i < 2; i++) await page.keyboard.press('Tab');
  return page.evaluate(() => {
    const el = document.activeElement;
    const header = document.querySelector('.site-header');
    if (!el || !header?.contains(el)) return { style: 'none', color: 'rgb(0, 0, 0)', bg: 'rgb(0, 0, 0)' };
    const s = getComputedStyle(el);
    return { style: s.outlineStyle, color: s.outlineColor, bg: getComputedStyle(header).backgroundColor };
  });
}

/**
 * @param {import('puppeteer-core').Browser} browser
 * @param {string} url
 * @param {(typeof MODES)[number]} mode
 * @returns {Promise<string[]>}
 */
async function check(browser, url, mode) {
  const page = await browser.newPage();
  const out = [];
  try {
    await page.setViewport({ width: mode.width, height: mode.height });
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: mode.reduced ? 'reduce' : 'no-preference' }]);
    await page.goto(url, { waitUntil: 'load' });
    await settle(page);
    const live = await page.evaluate(() => document.documentElement.classList.contains('want-3d'));
    if (mode.name === 'desktop' && HOMES.includes(new URL(url).pathname) && !live) out.push('the live 3D layout did not start');
    const surfaces = new Set();
    for (const { label, y } of await stops(page)) {
      await page.evaluate((top) => scrollTo(0, top), y);
      await settle(page);
      const s = await readStop(page);
      const expected = expectedSurface(s.bands, s.height);
      surfaces.add(expected);
      out.push(...stopProblems({ ...s, expected }).map((p) => `${label}: ${p}`));
      if (mode.reduced && !/^0m?s$/.test(s.transition)) out.push(`${label}: color change animated (${s.transition}) under reduced motion`);
      if (mode.name === 'desktop' && (label === 'top' || label.startsWith('inside'))) {
        out.push(...focusProblems(await focusRing(page)).map((p) => `${label} (${s.actual}): ${p}`));
      }
    }
    if (!surfaces.has('dark')) out.push('no stop put a band under the header');
  } finally {
    await page.close();
  }
  return out;
}

/**
 * The top of the viewport just before and just inside the OrientAI band.
 * @param {import('puppeteer-core').Browser} browser
 * @param {string} origin
 * @param {string} dir
 */
async function shots(browser, origin, dir) {
  mkdirSync(dir, { recursive: true });
  for (const path of HOMES) {
    for (const { width, height } of [MODES[1], MODES[0]]) {
      const page = await browser.newPage();
      await page.setViewport({ width, height, deviceScaleFactor: 2 });
      await page.goto(`${origin}${path}`, { waitUntil: 'load' });
      await settle(page);
      const locale = path.slice(1) || 'zh-tw';
      for (const [n, offset] of /** @type {const} */ ([['1-before', -OFFSET], ['2-after', OFFSET]])) {
        await page.evaluate((off) => {
          const band = document.querySelector('.orient');
          const header = /** @type {HTMLElement} */ (document.querySelector('.site-header'));
          if (band) scrollTo(0, band.getBoundingClientRect().top + scrollY - header.offsetHeight + off);
        }, offset);
        await settle(page);
        const y = await page.evaluate(() => scrollY);
        await page.screenshot({ path: join(dir, `header-${locale}-${width}-${n}.png`), clip: { x: 0, y, width, height: 320 } });
      }
      await page.close();
    }
  }
  console.log(`screenshots in ${dir}`);
}

async function main() {
  const at = process.argv.indexOf('--shots');
  const shotDir = at > 0 ? process.argv[at + 1] : undefined;
  const server = await serve(DIST);
  const { port } = /** @type {import('node:net').AddressInfo} */ (server.address());
  const origin = `http://localhost:${port}`;
  const executablePath = process.env.CHROME_PATH || process.env.CHROME_BIN;
  const chrome = executablePath ? { executablePath } : { channel: /** @type {const} */ ('chrome') };
  const browser = await puppeteer.launch({ ...chrome, headless: true, args: LAUNCH_ARGS });
  let failing = 0;
  try {
    for (const path of PATHS) {
      for (const mode of MODES) {
        const found = await check(browser, `${origin}${path}`, mode);
        for (const p of found) console.log(`${path} (${mode.name}): ${p}`);
        if (found.length) failing++;
      }
    }
    if (shotDir) await shots(browser, origin, resolve(shotDir));
  } finally {
    await browser.close();
    server.close();
  }
  console.log(`${PATHS.length * MODES.length} page and viewport combinations checked, ${failing} with problems`);
  if (failing) process.exitCode = 1;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) await main();
