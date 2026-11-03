// Renders the static pictures of ribbon-route's world (#167, ADR 0003「ribbon-route」): the home
// page's pictures for phones, reduced motion and the first frame before WebGL, the inner pages'
// heroes and the product thumbnails. They come from the same three.js world as the live scene
// (src/lib/scene/ribbon/world.ts), so the static and live versions show the same map.
//
// Bundles src/lib/scene/ribbon/capture.ts with Vite, opens it in headless Chromium (SwiftShader),
// renders each job in JOBS and writes
// - src/assets/design/ribbon/<name>.webp (quality 90; astro:assets re-encodes at build time), and
// - src/lib/scene/ribbon/pictures.json: each picture's size and where the labelled blocks land on
//   it, 0–1 from the top left. HomeTemplate places the HTML labels from it (no hand-copied numbers).
// Colors come from src/styles/tokens.css (the --map-* and --ribbon-* tokens).
// The fork pictures start their trunk where the hero picture's ribbon leaves its bottom edge, so
// the two pictures stacked read as one ribbon.
// Rerunning with the same world and tokens writes the same files (SwiftShader is deterministic).
// Run: node scripts/design/ribbon-capture.mjs

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer-core';
import sharp from 'sharp';
import { build } from 'vite';
import { LAUNCH_ARGS } from './scene-wait.mjs';

const ROOT = resolve(import.meta.dirname, '../..');
const OUT = join(ROOT, 'src/assets/design/ribbon');
const PICTURES = join(ROOT, 'src/lib/scene/ribbon/pictures.json');
const TOKENS = join(ROOT, 'src/styles/tokens.css');
const PALETTE = ['--map-ground', '--map-block-tint', '--map-legacy', '--map-core', '--ribbon-start', '--ribbon-mid', '--ribbon-end'];

/**
 * The :root value of each token, following var() to a hex color.
 * @param {string} css @param {string[]} names @returns {Record<string, string>}
 */
export function resolveTokens(css, names) {
  const root = css.slice(css.indexOf(':root'), css.indexOf('}', css.indexOf(':root')));
  /** @param {string} name @param {number} depth @returns {string} */
  const value = (name, depth = 0) => {
    const m = new RegExp(`^\\s*${name}:\\s*([^;]+);`, 'm').exec(root);
    if (!m?.[1] || depth > 5) throw new Error(`${name} is not set in :root`);
    const v = m[1].trim();
    const ref = /^var\((--[\w-]+)\)$/.exec(v);
    return ref?.[1] ? value(ref[1], depth + 1) : v;
  };
  return Object.fromEntries(names.map((n) => [n, value(n)]));
}

const CASES = [
  { name: 'case-1', p: 0, levels: [1, 0, 0] },
  { name: 'case-2', p: 0.5, levels: [1, 1, 0] },
  { name: 'case-3', p: 1, levels: [1, 1, 1] },
];
const PRODUCTS = ['digirunner', 'viki', 'gadodido', 'greenswift'];
// The tall hero frames the core-to-model stretch from higher up: centre, half width (world units), pitch
const TALL = { x: -5.3, halfW: 5.4, pitch: 42 };

/** Jobs that depend on nothing; the fork pictures follow from the heroes */
export const JOBS = [
  { name: 'hero-wide', w: 2560, h: 1120, view: { kind: 'hero' } },
  { name: 'hero-tall', w: 900, h: 820, view: { kind: 'hero' }, override: { target: [TALL.x, 0, 10.45], halfW: TALL.halfW, pitch: TALL.pitch, fog: undefined } },
  ...CASES.map((c) => ({ name: c.name, w: 1600, h: 1200, view: { kind: 'cases', p: c.p }, levels: c.levels })),
  ...PRODUCTS.map((p) => ({ name: `prod-${p}`, w: 768, h: 432, view: { kind: 'product', name: p } })),
  { name: 'orientai', w: 1600, h: 1200, view: { kind: 'enclosure' } },
  // Inner pages' heroes (#167): the product's own block on the map; the finance page sees the AI stretch.
  // Framed wide enough (#187) that the blocks their briefs name are on the picture: digiRunner's core,
  // existing systems, digiRunner and the AI model; finance's core system, the AI work and the services
  { name: 'page-digirunner', w: 1600, h: 1200, view: { kind: 'product', name: 'digirunner' }, override: { halfW: 9, pitch: 34 } },
  { name: 'page-finance', w: 1600, h: 1200, view: { kind: 'cases', p: 0 }, override: { halfW: 12, pitch: 36 }, levels: [1, 1, 1] },
];

/** The fork pictures: a plan whose top edge is the city edge, the trunk entering at the hero's exit */
const forkJobs = (/** @type {Record<string, any>} */ shots) => {
  const CITY_EDGE = 10.45;
  /** @param {string} name @param {'wide'|'tall'} box @param {number} w @param {number} h @param {number} cx @param {number} halfW @param {string} hero */
  const job = (name, box, w, h, cx, halfW, hero) => ({
    name,
    w,
    h,
    view: { kind: 'custom', view: { target: [cx, 0, CITY_EDGE + (halfW * h) / w], pitch: 90, yaw: 0, halfW, sx: 0, sy: 0 } },
    tail: { box, cx, fe: shots[hero].where.exit.x },
  });
  return [job('fork-wide', 'wide', 2560, 720, 0, 10.6, 'hero-wide'), job('fork-tall', 'tall', 900, 720, TALL.x, 6.4, 'hero-tall')];
};

async function bundle() {
  const out = await build({
    configFile: false,
    logLevel: 'warn',
    build: {
      write: false,
      minify: false,
      lib: { entry: join(ROOT, 'src/lib/scene/ribbon/capture.ts'), formats: ['iife'], name: 'RibbonCapture', fileName: 'capture' },
    },
  });
  const output = Array.isArray(out) ? out[0] : out;
  if (!output || !('output' in output)) throw new Error('vite build returned no output');
  const chunk = output.output.find((o) => o.type === 'chunk');
  if (!chunk || chunk.type !== 'chunk') throw new Error('no chunk in the capture bundle');
  return chunk.code;
}

async function main() {
  const tokens = resolveTokens(readFileSync(TOKENS, 'utf8'), PALETTE);
  const code = await bundle();
  const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH, headless: true, args: LAUNCH_ARGS });
  try {
    const page = await browser.newPage();
    page.on('console', (m) => m.type() === 'error' && console.log(`console: ${m.text()}`));
    await page.setContent('<!doctype html><html><body style="margin:0"></body></html>');
    await page.addScriptTag({ content: code });
    await page.evaluate((t) => {
      /** @type {any} */ (window).__ribbon = /** @type {any} */ (window).RibbonCapture.install(t);
    }, tokens);
    mkdirSync(OUT, { recursive: true });
    /** @type {Record<string, { w: number, h: number, where: Record<string, { x: number, y: number }> }>} */
    const shots = {};
    const run = async (/** @type {any} */ job) => {
      const { url, where } = await page.evaluate((j) => /** @type {any} */ (window).__ribbon.shot(j), job);
      const png = Buffer.from(url.slice(url.indexOf(',') + 1), 'base64');
      await sharp(png).webp({ quality: 90, effort: 6 }).toFile(join(OUT, `${job.name}.webp`));
      const round = (/** @type {number} */ n) => Math.round(n * 10000) / 10000;
      shots[job.name] = { w: job.w, h: job.h, where: Object.fromEntries(Object.entries(where).map(([k, p]) => [k, { x: round(p.x), y: round(p.y) }])) };
      console.log(`${job.name}.webp ${job.w}×${job.h}`);
    };
    for (const job of JOBS) await run(job);
    for (const job of forkJobs(shots)) await run(job);
    writeFileSync(PICTURES, `${JSON.stringify(shots, null, 2)}\n`);
  } finally {
    await browser.close();
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) await main();
