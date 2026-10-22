// Accessibility checks that need a real browser, run against the built /design-system page:
// - text over images: every text line inside a section with a Backdrop must reach WCAG 2.2 AA
//   (4.5:1, or 3:1 for large text) against the worst pixel behind it. contrast.mjs can only check
//   token pairs; this measures what the image actually puts behind the text, at several widths.
// - text over the 3D scene (Scene3D): with motion on, the same measurement over what the running
//   scene draws, at several positions of the scene track
// - no horizontal scrolling at any of those widths
// - keyboard: every focusable element shows a visible focus indicator when reached with Tab
// - prefers-reduced-motion: no element is still animating and nothing is left transparent
// Results depend on the installed fonts and on Chromium, so this is not part of `npm run check`;
// run it after changing hero images, Backdrop, Surface, Scene3D or focus styles.
// Run after `npm run build`: node scripts/design/a11y-smoke.mjs [path=/design-system]

import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer-core';
import sharp from 'sharp';
import { serve } from '../lib/static-server.mjs';

const DIST = resolve(import.meta.dirname, '../../dist');
export const VIEWPORTS = [
  [375, 800],
  [768, 1024],
  [1024, 768],
  [1280, 860],
  [1440, 900],
];

/** @param {number} c */
function channel(c) {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
}

/** @param {number[]} rgb */
export function luminance([r, g, b]) {
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** WCAG large text: at least 24px, or 18.66px bold. @param {number} size @param {number} weight */
export function minimumRatio(size, weight) {
  return size >= 24 || (size >= 18.66 && weight >= 700) ? 3 : 4.5;
}

/**
 * Lowest contrast between `text` and any pixel of `image` inside `rect`.
 * @param {{ data: Uint8Array | Buffer, width: number, height: number, channels: number }} image
 * @param {{ x: number, y: number, w: number, h: number }} rect
 * @param {number[]} text rgb
 */
export function worstContrast(image, rect, text) {
  const lt = luminance(text);
  let worst = Infinity;
  const x0 = Math.max(0, Math.floor(rect.x));
  const y0 = Math.max(0, Math.floor(rect.y));
  const x1 = Math.min(image.width, Math.ceil(rect.x + rect.w));
  const y1 = Math.min(image.height, Math.ceil(rect.y + rect.h));
  for (let y = y0; y < y1; y += 1) {
    for (let x = x0; x < x1; x += 1) {
      const i = (y * image.width + x) * image.channels;
      const lb = luminance([image.data[i], image.data[i + 1], image.data[i + 2]]);
      const ratio = (Math.max(lt, lb) + 0.05) / (Math.min(lt, lb) + 0.05);
      if (ratio < worst) worst = ratio;
    }
  }
  return worst;
}

/**
 * Text lines inside the elements matching `selector` that are in the viewport, measured against the
 * worst pixel behind them: the text is made transparent and the page screenshotted.
 * @param {import('puppeteer-core').Page} page @param {string} selector
 */
async function textContrast(page, selector) {
  const lines = await page.evaluate((selector) => {
    const out = [];
    for (const root of document.querySelectorAll(selector)) {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        const el = node.parentElement;
        if (!el || !node.textContent?.trim() || el.closest('[aria-hidden="true"], .sr-only')) continue;
        const style = getComputedStyle(el);
        const range = document.createRange();
        range.selectNodeContents(node);
        for (const r of range.getClientRects()) {
          if (r.bottom < 0 || r.top > innerHeight || r.width === 0) continue;
          out.push({
            text: node.textContent.trim().slice(0, 24),
            color: style.color,
            size: parseFloat(style.fontSize),
            weight: Number(style.fontWeight),
            rect: { x: r.x, y: r.y, w: r.width, h: r.height },
          });
        }
      }
    }
    return out;
  }, selector);
  const hide = await page.addStyleTag({
    // Transitions off: otherwise the screenshot catches text halfway through fading to transparent
    content: `:is(${selector}) * { color: transparent !important; text-shadow: none !important; caret-color: transparent !important; transition: none !important; }`,
  });
  const { data, info } = await sharp(await page.screenshot()).raw().toBuffer({ resolveWithObject: true });
  await hide.evaluate((el) => el.remove());
  const problems = [];
  for (const line of lines) {
    const ratio = worstContrast({ data, ...info }, line.rect, line.color.match(/\d+/g).slice(0, 3).map(Number));
    const min = minimumRatio(line.size, line.weight);
    if (ratio < min) problems.push(`"${line.text}" ${ratio.toFixed(2)} < ${min}`);
  }
  return { checked: lines.length, problems };
}

/**
 * Text-over-image problems in one section with a Backdrop, scrolled into view.
 * @param {import('puppeteer-core').Page} page @param {number} index
 */
async function textOverImages(page, index) {
  await page.evaluate((index) => {
    document.querySelector('[data-a11y-measure]')?.removeAttribute('data-a11y-measure');
    const section = document.querySelectorAll('section:has(.backdrop)')[index];
    section.setAttribute('data-a11y-measure', '');
    section.scrollIntoView({ block: 'start' });
  }, index);
  return textContrast(page, '[data-a11y-measure]');
}

// Fractions of the 3D scene track (Scene3D) at which text over the running scene is measured
const SCENE_STOPS = [0, 0.25, 0.5, 0.75, 1];
const SCENE_VIEWPORTS = [
  [375, 800],
  [1280, 860],
];
const SCENE_TIMEOUT = 20_000;

/**
 * Text over the running 3D scene, at each SCENE_STOPS position of the track. Empty when the page
 * has no scene track; a problem when the scene never draws.
 * @param {import('puppeteer-core').Page} page
 */
async function textOverScene(page) {
  if (!(await page.$('[data-scene-track]'))) return [];
  const ready = await page
    .waitForSelector('[data-scene="ready"]', { timeout: SCENE_TIMEOUT })
    .then(() => true)
    .catch(() => false);
  if (!ready) return [{ stop: 0, checked: 0, problems: ['3D scene never reached data-scene="ready"'] }];
  const results = [];
  for (const stop of SCENE_STOPS) {
    await page.evaluate((f) => {
      const track = document.querySelector('[data-scene-track]');
      const top = track.getBoundingClientRect().top + scrollY;
      scrollTo(0, top + (track.offsetHeight - innerHeight) * f);
    }, stop);
    // Let the canvas fade in and the camera settle on the new position
    await new Promise((r) => setTimeout(r, 1200));
    results.push({ stop, ...(await textContrast(page, '[data-scene-track]')) });
  }
  return results;
}

/** Focusable elements without a visible focus indicator. @param {import('puppeteer-core').Page} page */
async function focusProblems(page) {
  const total = await page.evaluate(
    () => document.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, textarea, summary').length,
  );
  const problems = [];
  for (let i = 0; i < total; i += 1) {
    await page.keyboard.press('Tab');
    const state = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const own = getComputedStyle(el);
      // A card's title link is drawn by the card; other links in a card (a Tag in a static card) draw their own
      const card = el.closest('.card .title') ? el.closest('.card') : null;
      const ring = card ? getComputedStyle(card) : own;
      return {
        label: `${el.tagName.toLowerCase()} "${(el.textContent || el.getAttribute('name') || '').trim().slice(0, 20)}"`,
        visible: ring.outlineStyle !== 'none' && parseFloat(ring.outlineWidth) > 0,
      };
    });
    if (!state) break;
    if (!state.visible) problems.push(`${state.label} has no visible focus ring`);
  }
  return { checked: total, problems };
}

/** Elements still animating or left transparent under reduced motion. @param {import('puppeteer-core').Page} page */
async function reducedMotionProblems(page) {
  return page.evaluate(() =>
    [...document.querySelectorAll('main *, .page-hero *')]
      .filter((el) => {
        const s = getComputedStyle(el);
        const animated = s.animationName !== 'none' && s.animationTimeline !== 'auto';
        return animated || (s.opacity === '0' && el.closest('.reveal'));
      })
      .map((el) => `${el.tagName.toLowerCase()}.${el.className} still animated or hidden`),
  );
}

async function main([path = '/design-system']) {
  const server = await serve(DIST);
  const url = `http://127.0.0.1:${server.address().port}${path}`;
  const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH, headless: true, args: ['--no-sandbox'] });
  let failures = 0;
  const report = (label, problems) => {
    console.log(`${problems.length ? 'FAIL' : 'ok  '} ${label}`);
    for (const p of problems) console.log(`     ${p}`);
    failures += problems.length;
  };
  try {
    for (const [width, height] of VIEWPORTS) {
      const page = await browser.newPage();
      await page.setViewport({ width, height });
      // Reduced motion so scroll-driven reveals sit at their final state when measured
      await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
      await page.goto(url, { waitUntil: 'networkidle0' });
      await page.evaluate(() => document.fonts.ready);
      const scroll = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      report(`${width}×${height} no horizontal scroll`, scroll > 0 ? [`overflows by ${scroll}px`] : []);
      const sections = await page.evaluate(() => document.querySelectorAll('section:has(.backdrop)').length);
      for (let i = 0; i < sections; i += 1) {
        await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => r(null))));
        const text = await textOverImages(page, i);
        report(`${width}×${height} text over image, section ${i + 1}/${sections} (${text.checked} lines in view)`, text.problems);
      }
      await page.close();
    }

    // Motion on: the 3D scene runs, so text is measured over what it actually draws
    for (const [width, height] of SCENE_VIEWPORTS) {
      const page = await browser.newPage();
      await page.setViewport({ width, height });
      await page.goto(url, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      for (const r of await textOverScene(page)) {
        report(`${width}×${height} text over 3D scene at ${r.stop * 100}% (${r.checked} lines in view)`, r.problems);
      }
      await page.close();
    }

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 860 });
    // Not networkidle0: a running 3D scene (Scene3D) keeps the renderer busy and it never fires
    await page.goto(url, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    const focus = await focusProblems(page);
    report(`keyboard focus (${focus.checked} focusable elements)`, focus.problems);

    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await page.reload({ waitUntil: 'networkidle0' });
    report('reduced motion', await reducedMotionProblems(page));
  } finally {
    await browser.close();
    server.close();
  }
  if (failures) process.exitCode = 1;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(process.argv.slice(2)).catch((err) => {
    console.error(err instanceof Error ? err.message : err);
    process.exitCode = 1;
  });
}
