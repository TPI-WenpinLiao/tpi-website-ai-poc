// Screenshots of the 3D scroll scene (M3-07, #54; the home page since M3-04) at several scroll
// positions, on desktop and mobile, plus a reduced-motion run that must show no canvas and request
// no 3D chunk, and a switch to reduced motion while the scene plays, which must remove the canvas
// and leave the static image.
// Headless Chromium renders WebGL with SwiftShader (software), so frames show the look of the
// scene, not its real frame rate.
// With --video it records instead: one WebM per page and viewport, scrolling through the whole
// track at a steady pace (needs ffmpeg on PATH, used by puppeteer's screencast).
// Run after `npm run build`:
//   node scripts/design/scene-capture.mjs [--video] <out-dir> [path ...]
// Then for each page, a resize across the low-power breakpoint while the scene plays (mobile →
// desktop and back): the scene must rebuild with the new tier (data-scene-tier) and one canvas.
// Paths default to PATHS. Prints one JSON line per page and viewport, and per resize.

import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import puppeteer from 'puppeteer-core';
import { serve } from '../lib/static-server.mjs';

const DIST = resolve(import.meta.dirname, '../../dist');
// Pages with a Scene3D track: the home page (M3-04, #17) and the product page (M3-05, #18)
export const PATHS = ['/', '/products/digirunner'];
export const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900, isMobile: false },
  { name: 'mobile', width: 390, height: 844, isMobile: true },
];
// Fractions of the scene track (hero plus chapters)
const STOPS = [0, 0.25, 0.5, 0.75, 1];
// SwiftShader is slow; give the deferred import and the first frames time to land
const SCENE_TIMEOUT = 20_000;
// Chunks of src/lib/scene: three.js lives in runtime's. Scene3D's own loader is not one of them.
const SCENE_CHUNK = /\/(runtime|modular-stack)\.[\w-]+\.js$/;
export const LAUNCH_ARGS = ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'];

// File name for a page; the home page (/) is `home`
const slug = (path) => path.replace(/^\//, '').replaceAll('/', '-') || 'home';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Scrolls so that `fraction` of the scene track has passed. @param {import('puppeteer-core').Page} page */
export async function scrollTrack(page, fraction) {
  await page.evaluate((f) => {
    const track = document.querySelector('[data-scene-track]');
    if (!track) throw new Error('no [data-scene-track] on the page');
    const top = track.getBoundingClientRect().top + scrollY;
    scrollTo(0, top + (track.offsetHeight - innerHeight) * f);
  }, fraction);
}

/** @param {import('puppeteer-core').Browser} browser */
async function capture(browser, base, path, viewport, outDir, reducedMotion) {
  const page = await browser.newPage();
  const errors = [];
  const sceneRequests = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('request', (r) => {
    if (SCENE_CHUNK.test(new URL(r.url()).pathname)) sceneRequests.push(r.url());
  });
  await page.setViewport({ width: viewport.width, height: viewport.height, isMobile: viewport.isMobile, hasTouch: viewport.isMobile });
  if (reducedMotion) await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.goto(`${base}${path}`, { waitUntil: 'load' });

  const name = `${slug(path)}-${viewport.name}${reducedMotion ? '-reduced' : ''}`;
  let ready = false;
  if (reducedMotion) {
    // Give a deferred load every chance to (wrongly) start
    await sleep(3000);
  } else {
    ready = await page
      .waitForSelector('[data-scene="ready"]', { timeout: SCENE_TIMEOUT })
      .then(() => true)
      .catch(() => false);
  }
  const stops = reducedMotion ? [0] : STOPS;
  for (const stop of stops) {
    await scrollTrack(page, stop);
    await sleep(800);
    await page.screenshot({ path: `${outDir}/${name}-${String(stop * 100).padStart(3, '0')}.png` });
  }
  const state = await page.evaluate(() => ({
    canvas: document.querySelectorAll('canvas').length,
    scrollWidth: document.documentElement.scrollWidth,
    width: innerWidth,
  }));
  // Turning reduced motion on while the scene plays must drop back to the static image
  let switchedOff;
  if (!reducedMotion && ready) {
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await sleep(500);
    switchedOff = await page.evaluate(
      () =>
        document.querySelectorAll('canvas').length === 0 &&
        !document.querySelector('[data-scene-track]')?.hasAttribute('data-scene') &&
        Boolean(document.querySelector('.backdrop img')?.checkVisibility()),
    );
  }
  await page.close();
  return { page: path, viewport: viewport.name, reducedMotion, ready, switchedOff, sceneRequests: sceneRequests.length, ...state, errors };
}

// Scene3D waits TIER_DEBOUNCE (200 ms) before rebuilding; then the first frames need SwiftShader time
const REBUILD_WAIT = 2500;

/**
 * Loads at `from`, resizes to `to` while the scene plays, and screenshots the hero. Only the size
 * changes: switching isMobile or hasTouch makes puppeteer reload the page, which would pick the new
 * tier on its own and never exercise Scene3D's rebuild. Without touch the tier follows the width
 * alone. The page must not reload, the canvas must be a new one, and the host must never be left
 * without a canvas while the scene rebuilds.
 * @param {import('puppeteer-core').Browser} browser
 */
async function resized(browser, base, path, from, to, outDir) {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.setViewport({ width: from.width, height: from.height });
  await page.goto(`${base}${path}`, { waitUntil: 'load' });
  const ready = await page
    .waitForSelector('[data-scene="ready"]', { timeout: SCENE_TIMEOUT })
    .then(() => true)
    .catch(() => false);
  const before = await page.evaluate(() => {
    Reflect.set(window, '__sceneCaptureNoReload', true);
    document.querySelector('canvas')?.setAttribute('data-capture-before', '');
    // The old scene must keep its canvas until the new one is on the page (#127): record any
    // moment the host is left without one
    const host = document.querySelector('[data-scene-host]');
    if (host) {
      new MutationObserver(() => {
        if (!host.querySelector('canvas')) Reflect.set(window, '__sceneCaptureEmpty', true);
      }).observe(host, { childList: true });
    }
    return document.querySelector('[data-scene-tier]')?.getAttribute('data-scene-tier');
  });
  await page.setViewport({ width: to.width, height: to.height });
  await sleep(REBUILD_WAIT);
  await page.screenshot({ path: `${outDir}/${slug(path)}-${from.name}-to-${to.name}.png` });
  const state = await page.evaluate(() => ({
    reloaded: Reflect.get(window, '__sceneCaptureNoReload') !== true,
    rebuilt: document.querySelectorAll('canvas').length === 1 && !document.querySelector('canvas[data-capture-before]'),
    gap: Reflect.get(window, '__sceneCaptureEmpty') === true,
    tier: document.querySelector('[data-scene-tier]')?.getAttribute('data-scene-tier'),
    canvas: document.querySelectorAll('canvas').length,
    ready: document.querySelector('[data-scene-track]')?.getAttribute('data-scene') === 'ready',
  }));
  await page.close();
  const expected = to.isMobile ? 'mobile' : 'desktop';
  return { page: path, resize: `${from.name} → ${to.name}`, loaded: ready, before, ...state, expected, errors };
}

// Seconds of hold on the hero, then of scrolling through the track
const VIDEO_HOLD = 2;
const VIDEO_SCROLL = 14;

/** @param {import('puppeteer-core').Browser} browser */
async function record(browser, base, path, viewport, outDir) {
  const page = await browser.newPage();
  await page.setViewport({ width: viewport.width, height: viewport.height, isMobile: viewport.isMobile, hasTouch: viewport.isMobile });
  await page.goto(`${base}${path}`, { waitUntil: 'load' });
  const ready = await page
    .waitForSelector('[data-scene="ready"]', { timeout: SCENE_TIMEOUT })
    .then(() => true)
    .catch(() => false);
  // Let the canvas finish fading in before the recording starts
  await sleep(1000);
  const file = `${outDir}/${slug(path)}-${viewport.name}.webm`;
  const recorder = await page.screencast({ path: /** @type {`${string}.webm`} */ (file) });
  await sleep(VIDEO_HOLD * 1000);
  await page.evaluate(
    (seconds) =>
      new Promise((done) => {
        const track = document.querySelector('[data-scene-track]');
        if (!(track instanceof HTMLElement)) throw new Error('no [data-scene-track] on the page');
        const top = track.getBoundingClientRect().top + scrollY;
        const span = track.offsetHeight - innerHeight;
        const start = performance.now();
        const step = (now) => {
          const t = Math.min(1, (now - start) / (seconds * 1000));
          scrollTo(0, top + span * t);
          if (t < 1) requestAnimationFrame(step);
          else done(null);
        };
        requestAnimationFrame(step);
      }),
    VIDEO_SCROLL,
  );
  await sleep(VIDEO_HOLD * 1000);
  await recorder.stop();
  await page.close();
  return { page: path, viewport: viewport.name, ready, video: file };
}

async function main() {
  const args = process.argv.slice(2);
  const video = args.includes('--video');
  const [outArg, ...paths] = args.filter((a) => a !== '--video');
  if (!outArg) throw new Error('usage: node scripts/design/scene-capture.mjs <out-dir> [path ...]');
  const outDir = resolve(outArg);
  mkdirSync(outDir, { recursive: true });
  const server = await serve(DIST);
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('server has no port');
  const base = `http://localhost:${address.port}`;
  const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH, headless: true, args: LAUNCH_ARGS });
  let failed = false;
  try {
    for (const path of paths.length ? paths : PATHS) {
      for (const viewport of VIEWPORTS) {
        if (video) {
          const result = await record(browser, base, path, viewport, outDir);
          console.log(JSON.stringify(result));
          if (!result.ready) failed = true;
          continue;
        }
        for (const reducedMotion of [false, true]) {
          const result = await capture(browser, base, path, viewport, outDir, reducedMotion);
          console.log(JSON.stringify(result));
          const bad = reducedMotion ? result.canvas > 0 || result.sceneRequests > 0 : !result.ready || !result.switchedOff;
          if (bad || result.errors.length || result.scrollWidth > result.width) failed = true;
        }
      }
      if (video) continue;
      for (const [from, to] of [VIEWPORTS.toReversed(), VIEWPORTS]) {
        const result = await resized(browser, base, path, from, to, outDir);
        console.log(JSON.stringify(result));
        if (!result.loaded || result.reloaded || !result.rebuilt || result.gap || result.tier !== result.expected || !result.ready || result.errors.length) failed = true;
      }
    }
  } finally {
    await browser.close();
    server.close();
  }
  console.log(failed ? 'FAILED' : `${video ? 'videos' : 'screenshots'} in ${outDir}`);
  process.exitCode = failed ? 1 : 0;
}

if (import.meta.url === `file://${process.argv[1]}`) await main();
