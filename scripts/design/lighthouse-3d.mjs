// Lighthouse for the pages with the 3D scroll scene (M3-07, #54; the home page since M3-04), mobile
// and desktop. `npm run check` audits only mobile, and until #127 its performance assertion on these
// pages only warns (lighthouserc.cjs, ADR 0004).
// Each page and form factor runs RUNS times; the run with the median performance score is
// reported, as a Markdown table for the PR. The 3D chunk (src/lib/scene/runtime, with three.js)
// loads after the load event and an idle callback, so it lands inside Lighthouse's trace: the
// numbers include its cost. Scene3D also stops loading under Save-Data and reduced motion, which
// Lighthouse does not emulate.
// The score uses Lighthouse's simulated throttling, but the page's work runs on this machine's
// CPU, and headless Chromium draws WebGL in software (SwiftShader). Treat TBT as an upper bound.
// Run after `npm run build`: node scripts/design/lighthouse-3d.mjs [path ...]

import { resolve } from 'node:path';
import lighthouse from 'lighthouse';
import desktopConfig from 'lighthouse/core/config/desktop-config.js';
import puppeteer from 'puppeteer-core';
import { serve } from '../lib/static-server.mjs';
import { PATHS } from './scene-capture.mjs';

const DIST = resolve(import.meta.dirname, '../../dist');
const RUNS = 3;
const FORM_FACTORS = [
  { name: 'mobile', config: undefined },
  { name: 'desktop', config: desktopConfig },
];
const SCENE_CHUNK = /\/_astro\/runtime\.[\w-]+\.js$/;

const ms = (v) => (v === undefined ? '–' : `${Math.round(v)} ms`);

/** Pick what the table needs from a Lighthouse result. @param {any} lhr */
export function summarize(lhr) {
  const audit = (id) => lhr.audits[id];
  const requests = audit('network-requests')?.details?.items ?? [];
  const chunk = requests.find((r) => SCENE_CHUNK.test(new URL(r.url).pathname));
  const lcpItem = audit('largest-contentful-paint-element')?.details?.items?.[0]?.items?.[0]?.node;
  // Observed (unthrottled) timings share the network-requests time origin: navigation start
  const observed = audit('metrics')?.details?.items?.[0] ?? {};
  return {
    score: lhr.categories.performance.score,
    fcp: audit('first-contentful-paint')?.numericValue,
    lcp: audit('largest-contentful-paint')?.numericValue,
    tbt: audit('total-blocking-time')?.numericValue,
    cls: audit('cumulative-layout-shift')?.numericValue,
    si: audit('speed-index')?.numericValue,
    lcpElement: lcpItem?.nodeLabel ?? lcpItem?.snippet ?? '–',
    lcpIsImage: /^<img\b/.test(lcpItem?.snippet ?? ''),
    chunkStart: chunk?.networkRequestTime,
    observedLoad: observed.observedLoad,
    observedLcp: observed.observedLargestContentfulPaint,
  };
}

/** @template T @param {T[]} runs @param {(r: T) => number} key */
const median = (runs, key) => [...runs].sort((a, b) => key(a) - key(b))[Math.floor(runs.length / 2)];

async function main() {
  const paths = process.argv.slice(2);
  const server = await serve(DIST);
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('server has no port');
  // Same flags as LHCI in this repo (scripts/session-start.sh)
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--remote-debugging-port=0'],
  });
  const port = Number(new URL(browser.wsEndpoint()).port);
  const rows = [];
  try {
    for (const path of paths.length ? paths : PATHS) {
      for (const { name, config } of FORM_FACTORS) {
        const runs = [];
        for (let i = 0; i < RUNS; i += 1) {
          const result = await lighthouse(
            `http://localhost:${address.port}${path}`,
            { port, output: 'json', logLevel: 'error', onlyCategories: ['performance'] },
            config,
          );
          if (!result) throw new Error(`no Lighthouse result for ${path}`);
          runs.push(summarize(result.lhr));
          process.stderr.write(`${path} ${name} run ${i + 1}: ${result.lhr.categories.performance.score}\n`);
        }
        rows.push({ path, formFactor: name, scores: runs.map((r) => r.score), ...median(runs, (r) => r.score) });
      }
    }
  } finally {
    await browser.close();
    server.close();
  }

  console.log(`| 頁面 | 裝置 | Performance（${RUNS} 次） | FCP | LCP | TBT | CLS | SI | LCP 元素 | 實測 LCP／load／3D chunk 請求 |`);
  console.log('|---|---|---|---|---|---|---|---|---|---|');
  for (const r of rows) {
    console.log(
      `| \`${r.path}\` | ${r.formFactor} | **${r.score}**（${r.scores.join('、')}） | ${ms(r.fcp)} | ${ms(r.lcp)} | ${ms(r.tbt)} | ${r.cls?.toFixed(3)} | ${ms(r.si)} | ${r.lcpIsImage ? 'hero 靜態圖' : r.lcpElement} | ${ms(r.observedLcp)}／${ms(r.observedLoad)}／${ms(r.chunkStart)} |`,
    );
  }
  // Acceptance (#54): the LCP is the static image and the 3D chunk is requested after it and after load
  const late = (r) => r.chunkStart !== undefined && r.chunkStart > r.observedLoad && r.chunkStart > r.observedLcp;
  if (rows.some((r) => !r.lcpIsImage || !late(r))) process.exitCode = 1;
}

if (import.meta.url === `file://${process.argv[1]}`) await main();
