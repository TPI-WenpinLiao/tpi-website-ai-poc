// Checks that the sticky header follows the purple bands (#179): SiteHeader's script sets the header's
// data-surface to "dark" while a data-surface="dark" section (OrientAI, contact, ContactCta, the
// footer) is under the header's bottom edge, and back to "light" elsewhere. Over the footer the
// header, and the stuck InPageNav, must have the footer's background, not the purple of the bands
// (#212).
// On the three home pages and one inner page (an offering page: ContactCta, the footer, and from
// 64rem the InPageNav stuck under the header, which has to switch with it), on a phone, a desktop (on the home pages the live 3D layout, html.want-3d), a desktop that prefers
// reduced motion and a short desktop (1280×450, where the footer reaches the stuck InPageNav): scroll to the top, to just above and just inside each band,
// then back to the top. At every stop the header's data-surface must match what the bands' boxes say,
// and the header's text must reach 4.5:1 on its background. On the desktop the keyboard focus ring of
// the header's first link must show and reach 3:1 on both surfaces; under reduced motion the header's
// color change must not be animated. On the phone, a resize while the 選單 sheet is open must not
// stop the header from following the bands afterwards; on the desktop a resize inside a band must
// not leave the header dark, and a viewport that grows before the observer is rebuilt must not turn
// it dark.
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
  // `footer`: the page scrolls far enough for the footer to reach the bar's bottom edge, so some stop
  // must check the bar against the footer (#212). At 1280×800 it never does; the short desktop is
  // the one where the stuck InPageNav meets the footer
  { name: 'phone', width: 375, height: 760, reduced: false, footer: true },
  { name: 'desktop', width: 1280, height: 800, reduced: false, footer: false },
  { name: 'desktop, reduced motion', width: 1280, height: 800, reduced: true, footer: false },
  { name: 'short desktop', width: 1280, height: 450, reduced: false, footer: true },
];
// How far above and below a band's top edge the header's bottom edge is put
const OFFSET = 80;
// Longer than --duration-fast, the header's color transition
const SETTLE_MS = 400;

/**
 * The surface the header should be on: dark while any band's box crosses the bar's bottom pixel row,
 * [line - 1, line). The bar is the header, plus the InPageNav stuck under it from 64rem.
 * @param {{ top: number, bottom: number }[]} bands viewport boxes of the data-surface="dark" sections
 * @param {number} line the bar's bottom edge
 * @returns {'light' | 'dark'}
 */
export function expectedSurface(bands, line) {
  return bands.some((b) => b.top < line && b.bottom > line - 1) ? 'dark' : 'light';
}

/**
 * The background the bar must match: that of the footer (found by its <footer> element, not by the
 * data-depth it sets, so a footer that lost the attribute still fails) crossing the
 * bar's bottom pixel row, else null (the bands' purple is the dark surface's own --color-bg).
 * @param {{ top: number, bottom: number, deep?: boolean, bg?: string }[]} bands
 * @param {number} line the bar's bottom edge
 * @returns {string | null}
 */
export function deepBackground(bands, line) {
  return bands.find((b) => b.deep && b.top < line && b.bottom > line - 1)?.bg ?? null;
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
 * Problems at one scroll stop, for the header or the stuck InPageNav (`name`). `deep` is the
 * footer's background while it is under the bar (deepBackground).
 * @param {{ actual: string | undefined, expected: string, text: string, bg: string, deep?: string | null, name?: string }} stop
 * @returns {string[]}
 */
export function stopProblems({ actual, expected, text, bg, deep = null, name = 'header' }) {
  const out = [];
  if (actual !== expected) out.push(`${name} is ${actual ?? 'unset'}, expected ${expected}`);
  if (deep && cssToHex(bg) !== cssToHex(deep)) out.push(`${name} background ${cssToHex(bg)} over the footer, expected its ${cssToHex(deep)}`);
  const ratio = contrastRatio(cssToHex(text), cssToHex(bg));
  if (ratio < 4.5) out.push(`${name} text ${ratio.toFixed(2)}:1 on its background, below 4.5:1`);
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
 * The header's state (and that of the InPageNav stuck under it from 64rem), the bar's bottom edge
 * and where the bands are.
 * @param {import('puppeteer-core').Page} page
 */
const readStop = (page) =>
  page.evaluate(() => {
    const header = /** @type {HTMLElement} */ (document.querySelector('.site-header'));
    const found = /** @type {HTMLElement | null} */ (header.parentElement?.querySelector(':scope > .in-page-nav.header') ?? null);
    const nav = found && getComputedStyle(found).position === 'sticky' ? found : null;
    const bands = [...document.querySelectorAll('[data-surface="dark"]')]
      .filter((el) => !el.closest('.site-header, .in-page-nav'))
      .map((el) => {
        const r = el.getBoundingClientRect();
        const name = el.className.toString().split(' ')[0] || el.tagName.toLowerCase();
        const deep = el.tagName === 'FOOTER';
        return { name, top: r.top, bottom: r.bottom, deep, bg: getComputedStyle(el).backgroundColor };
      });
    const style = getComputedStyle(header);
    const link = nav?.querySelector('a');
    return {
      actual: header.dataset.surface,
      line: header.offsetHeight + (nav?.offsetHeight ?? 0),
      bands,
      text: style.color,
      bg: style.backgroundColor,
      transition: style.transitionDuration,
      scrollY,
      nav: nav && link ? { actual: nav.dataset.surface, text: getComputedStyle(link).color, bg: getComputedStyle(nav).backgroundColor } : null,
    };
  });

/**
 * Scroll positions to stop at: the top, each band's top edge OFFSET px below and above the bar's
 * bottom edge, the top again.
 * @param {Awaited<ReturnType<typeof readStop>>} at a stop read anywhere on the page
 * @returns {{ label: string, y: number }[]}
 */
function stops(at) {
  const out = [{ label: 'top', y: 0 }];
  for (const b of at.bands) {
    const top = b.top + at.scrollY - at.line;
    out.push({ label: `above ${b.name}`, y: top - OFFSET }, { label: `inside ${b.name}`, y: top + OFFSET });
  }
  out.push({ label: 'top again', y: 0 });
  return out;
}

/**
 * Tab to the header's first link: focus the skip link (the first focusable element) and press Tab
 * once, so every call reads the same element.
 * @param {import('puppeteer-core').Page} page
 */
async function focusRing(page) {
  await page.evaluate(() => /** @type {HTMLElement | null} */ (document.querySelector('.site-header .skip'))?.focus());
  await page.keyboard.press('Tab');
  return page.evaluate(() => {
    const el = document.activeElement;
    const header = document.querySelector('.site-header');
    if (!el?.matches('.site-header .brand') || !header) return { style: 'none', color: 'rgb(0, 0, 0)', bg: 'rgb(0, 0, 0)' };
    const s = getComputedStyle(el);
    return { style: s.outlineStyle, color: s.outlineColor, bg: getComputedStyle(header).backgroundColor };
  });
}

/**
 * On a phone: open the 選單 sheet (the page goes inert), rotate the viewport while it is open, close
 * it and, still rotated, scroll the last band under the header. The header must still turn dark (#179 review).
 * @param {import('puppeteer-core').Page} page
 * @param {(typeof MODES)[number]} mode
 * @returns {Promise<string[]>}
 */
async function afterSheetResize(page, mode) {
  await page.evaluate(() => scrollTo(0, 0));
  await page.click('.site-header .mobile summary');
  await settle(page);
  if (!(await page.evaluate(() => document.querySelector('main')?.inert))) return ['the 選單 sheet did not make the page inert'];
  await page.setViewport({ width: mode.height, height: mode.width });
  await settle(page);
  await page.click('.site-header .mobile summary');
  await settle(page);
  await page.evaluate(() => {
    const header = /** @type {HTMLElement} */ (document.querySelector('.site-header'));
    const bands = [...document.querySelectorAll('[data-surface="dark"]')].filter((el) => !el.closest('.site-header, .in-page-nav'));
    const last = bands.at(-1);
    if (last) scrollTo(0, last.getBoundingClientRect().top + scrollY - header.offsetHeight + 40);
  });
  await settle(page);
  const s = await readStop(page);
  const expected = expectedSurface(s.bands, s.line);
  return s.actual === expected ? [] : [`after a resize with the 選單 sheet open: header is ${s.actual}, expected ${expected}`];
}

/**
 * A resize while the bar is dark (inside the last band): the rebuilt observer must not take the
 * InPageNav, dark at that moment, for a band. Back at the top the header must be light again.
 * @param {import('puppeteer-core').Page} page
 * @param {(typeof MODES)[number]} mode
 * @returns {Promise<string[]>}
 */
async function afterDarkResize(page, mode) {
  const at = await readStop(page);
  const last = at.bands.at(-1);
  if (!last) return [];
  await page.evaluate((y) => scrollTo(0, y), last.top + at.scrollY - at.line + OFFSET);
  await settle(page);
  await page.setViewport({ width: mode.width, height: mode.height + 1 });
  await settle(page);
  await page.evaluate(() => scrollTo(0, 0));
  await settle(page);
  const s = await readStop(page);
  const expected = expectedSurface(s.bands, s.line);
  return s.actual === expected ? [] : [`after a resize inside a band, back at the top: header is ${s.actual}, expected ${expected}`];
}

/**
 * A viewport that grows before the observer is rebuilt (a full-page screenshot, a phone's address bar
 * hiding): with requestAnimationFrame held, make the viewport as tall as the page while at the top.
 * The header must stay on the surface of what is under it, not of everything in the taller viewport.
 * @param {import('puppeteer-core').Page} page
 * @param {(typeof MODES)[number]} mode
 * @returns {Promise<string[]>}
 */
async function afterGrow(page, mode) {
  await page.evaluate(() => scrollTo(0, 0));
  await settle(page);
  const tall = await page.evaluate(() => {
    window.requestAnimationFrame = () => 0;
    return document.documentElement.scrollHeight;
  });
  await page.setViewport({ width: mode.width, height: Math.min(tall, 16000) });
  await new Promise((done) => setTimeout(done, SETTLE_MS));
  const s = await readStop(page);
  const expected = expectedSurface(s.bands, s.line);
  return s.actual === expected ? [] : [`after the viewport grew before the rebuild: header is ${s.actual}, expected ${expected}`];
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
    for (const { label, y } of stops(await readStop(page))) {
      await page.evaluate((top) => scrollTo(0, top), y);
      await settle(page);
      const s = await readStop(page);
      const expected = expectedSurface(s.bands, s.line);
      const deep = deepBackground(s.bands, s.line);
      surfaces.add(expected);
      if (deep) surfaces.add('deep');
      out.push(...stopProblems({ ...s, expected, deep }).map((p) => `${label}: ${p}`));
      if (s.nav) out.push(...stopProblems({ ...s.nav, expected, deep, name: 'in-page nav' }).map((p) => `${label}: ${p}`));
      if (mode.reduced && !/^0m?s$/.test(s.transition)) out.push(`${label}: color change animated (${s.transition}) under reduced motion`);
      if (mode.name === 'desktop' && (label === 'top' || label.startsWith('inside'))) {
        out.push(...focusProblems(await focusRing(page)).map((p) => `${label} (${s.actual}): ${p}`));
      }
    }
    if (!surfaces.has('dark')) out.push('no stop put a band under the header');
    if (mode.footer && !surfaces.has('deep')) out.push('no stop put the footer under the bar');
    if (mode.name === 'phone') out.push(...(await afterSheetResize(page, mode)));
    if (mode.name === 'desktop') out.push(...(await afterDarkResize(page, mode)), ...(await afterGrow(page, mode)));
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
