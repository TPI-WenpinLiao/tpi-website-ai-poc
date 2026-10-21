// Screenshots of the 3D scroll prototypes (M3-07, #54) at several scroll positions, on desktop and
// mobile, plus a reduced-motion run that must show no canvas and request no 3D chunk.
// Headless Chromium renders WebGL with SwiftShader (software), so frames show the look of the
// scene, not its real frame rate.
// With --video it records instead: one WebM per page and viewport, scrolling through the whole
// track at a steady pace (needs ffmpeg on PATH, used by puppeteer's screencast).
// Run after `npm run build`:
//   node scripts/design/scene-capture.mjs [--video] <out-dir> [path ...]
// Paths default to both prototypes. Prints one JSON line per page and viewport.

import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import puppeteer from 'puppeteer-core';
import { serve } from '../lib/static-server.mjs';

const DIST = resolve(import.meta.dirname, '../../dist');
export const PATHS = ['/prototypes/data-flow', '/prototypes/modular-stack'];
export const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900, isMobile: false },
  { name: 'mobile', width: 390, height: 844, isMobile: true },
];
// Fractions of the scene track (hero plus chapters)
const STOPS = [0, 0.25, 0.5, 0.75, 1];
// SwiftShader is slow; give the deferred import and the first frames time to land
const SCENE_TIMEOUT = 20_000;
// Chunks of src/lib/scene: three.js lives in runtime's. Scene3D's own loader is not one of them.
const SCENE_CHUNK = /\/(runtime|data-flow|modular-stack)\.[\w-]+\.js$/;
export const LAUNCH_ARGS = ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'];

const slug = (path) => path.replace(/^\//, '').replaceAll('/', '-');
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
  await page.close();
  return { page: path, viewport: viewport.name, reducedMotion, ready, sceneRequests: sceneRequests.length, ...state, errors };
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
          const bad = reducedMotion ? result.canvas > 0 || result.sceneRequests > 0 : !result.ready;
          if (bad || result.errors.length || result.scrollWidth > result.width) failed = true;
        }
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
