// The 3D scene's waits before its canvas joins the page have a limit (#136, ADR 0003): a WebGL
// driver whose fence never completes, or whose shaders never report ready, must still get the
// canvas on the page. Each case is simulated by patching WebGL before the page loads, and the
// time from the 3D chunk's arrival to the first frame (track's data-scene="ready") is compared
// with an unpatched load. Exits 1 when a patched load never gets ready, or takes longer than the
// unpatched one plus the limit and SLACK.
// Run after `npm run build`: node scripts/design/scene-wait.mjs

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer-core';
import { serve } from '../lib/static-server.mjs';

// Headless Chromium renders WebGL with SwiftShader (software)
export const LAUNCH_ARGS = ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'];

const DIST = resolve(import.meta.dirname, '../../dist');
// The home page is the only page with the scene (ADR 0003「ribbon-route」, #167). The waits are
// measured on the zh-TW home; the other locales' homes must get ready too, since a locale whose
// copy lacks an element the scene needs falls back to the static pictures without an error on the
// page (#167: en and vi had no 3D)
const PATH = '/';
export const OTHER_LOCALE_PATHS = ['/en', '/vi'];
// Read from the runtime, so the limit is written in one place
const RUNTIME = resolve(import.meta.dirname, '../../src/lib/scene/ribbon/runtime.ts');
const WAIT_LIMIT_MS = Number(/const WAIT_LIMIT_MS = (\d+);/.exec(readFileSync(RUNTIME, 'utf8'))?.[1]);
if (!WAIT_LIMIT_MS) throw new Error(`no "const WAIT_LIMIT_MS = <ms>;" in ${RUNTIME}`);
// SwiftShader timings vary between loads
const SLACK_MS = 1500;
const SCENE_TIMEOUT = 20_000;

export const CASES = {
  unpatched: '',
  // gpuDone: the fence never signals
  fence: `WebGL2RenderingContext.prototype.clientWaitSync = function () { return this.TIMEOUT_EXPIRED; };`,
  // compileAsync: KHR_parallel_shader_compile is offered and never reports a program complete.
  // Headless Chromium lacks the extension, so three.js would otherwise treat shaders as ready.
  shaders: `{
    const P = WebGL2RenderingContext.prototype;
    const { getExtension, getSupportedExtensions, getProgramParameter } = P;
    const COMPLETION_STATUS_KHR = 0x91b1;
    P.getExtension = function (name) {
      return name === 'KHR_parallel_shader_compile' ? { COMPLETION_STATUS_KHR } : getExtension.call(this, name);
    };
    P.getSupportedExtensions = function () { return [...getSupportedExtensions.call(this), 'KHR_parallel_shader_compile']; };
    P.getProgramParameter = function (program, name) {
      return name === COMPLETION_STATUS_KHR ? false : getProgramParameter.call(this, program, name);
    };
  }`,
};

// Records when the track gets data-scene="ready"
const MARK_READY = `new MutationObserver((records, observer) => {
  if (records.some((r) => r.target.dataset?.scene === 'ready')) {
    window.__sceneReadyAt = performance.now();
    observer.disconnect();
  }
}).observe(document, { subtree: true, attributeFilter: ['data-scene'] });`;

/**
 * Milliseconds from the 3D chunk's response to data-scene="ready", or undefined if not ready in time.
 * @param {import('puppeteer-core').Browser} browser
 */
async function timeToReady(browser, url, patch) {
  const page = await browser.newPage();
  try {
    await page.setViewport({ width: 1280, height: 800 });
    await page.evaluateOnNewDocument(MARK_READY);
    if (patch) await page.evaluateOnNewDocument(patch);
    await page.goto(url, { waitUntil: 'load' });
    const ready = await page
      .waitForFunction(() => /** @type {any} */ (window).__sceneReadyAt, { timeout: SCENE_TIMEOUT })
      .then(() => true, () => false);
    if (!ready) return undefined;
    return await page.evaluate(() => {
      const chunk = performance.getEntriesByType('resource').find((e) => /\/_astro\/runtime\.[\w-]+\.js$/.test(e.name));
      if (!chunk) throw new Error('no 3D chunk request');
      return /** @type {any} */ (window).__sceneReadyAt - /** @type {PerformanceResourceTiming} */ (chunk).responseEnd;
    });
  } finally {
    await page.close();
  }
}

async function main() {
  const server = await serve(DIST);
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('server has no port');
  const url = `http://localhost:${address.port}${PATH}`;
  const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH, headless: true, args: LAUNCH_ARGS });
  const errors = [];
  try {
    const base = await timeToReady(browser, url, CASES.unpatched);
    if (base === undefined) throw new Error(`${PATH}: the scene never got ready without a patch`);
    console.log(`${PATH} unpatched: ready ${Math.round(base)} ms after the 3D chunk`);
    for (const path of OTHER_LOCALE_PATHS) {
      const ms = await timeToReady(browser, `http://localhost:${address.port}${path}`, CASES.unpatched);
      console.log(`${path} unpatched: ${ms === undefined ? 'never ready' : `ready ${Math.round(ms)} ms after the 3D chunk`}`);
      if (ms === undefined) errors.push(`${path} never ready`);
    }
    for (const [name, patch] of Object.entries(CASES).filter(([n]) => n !== 'unpatched')) {
      const ms = await timeToReady(browser, url, patch);
      const limit = base + WAIT_LIMIT_MS + SLACK_MS;
      console.log(`${PATH} ${name}: ${ms === undefined ? `not ready in ${SCENE_TIMEOUT} ms` : `ready ${Math.round(ms)} ms after the 3D chunk`} (limit ${Math.round(limit)} ms)`);
      if (ms === undefined || ms > limit) errors.push(name);
    }
  } finally {
    await browser.close();
    server.close();
  }
  if (errors.length) {
    console.error(`3D scene waits without a limit: ${errors.join(', ')} (src/lib/scene/ribbon/runtime.ts, WAIT_LIMIT_MS; a locale never ready: see the browser console)`);
    process.exitCode = 1;
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) await main();
