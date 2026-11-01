#!/usr/bin/env node
// Takes the screenshots of the design-concept prototypes (#166, .claude/skills/design-concept
// 「3. 三個方向的原型」) and checks that each one opens on its own.
//
//   1. every docs/strategy/concepts/<direction>/index.html is opened from file:// at 375×812 and 1280×800
//      with prefers-reduced-motion: reduce, so scroll and entrance animations show their end state
//   2. a request to anything but a file:// URL, a console error or an uncaught exception fails the
//      direction: a prototype must open offline, with its fonts and images in its own directory
//   3. after the web fonts finish loading, two images are saved per width in the direction's directory:
//      shot-<width>.png (full page) and shot-<width>-first.png (first screen, for rubric item D1)
//   4. an image over 1 MB is saved as JPEG quality 80 instead (.jpg), so the repo stays small
//
// Re-running overwrites the same files. Exits 1 when any direction failed.
//
// Usage: node scripts/strategy/concept-shots.mjs [--only <direction>,<direction>]
import { readdir, rm, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import { chromium } from 'playwright';

const ROOT = 'docs/strategy/concepts';
const MAX_BYTES = 1024 * 1024;
const VIEWPORTS = [
  { width: 375, height: 812 },
  { width: 1280, height: 800 },
];

/** Saves a screenshot as PNG, or as JPEG when the PNG is over MAX_BYTES. Returns the file written. */
async function save(page, base, options) {
  await rm(`${base}.png`, { force: true });
  await rm(`${base}.jpg`, { force: true });
  await page.screenshot({ ...options, path: `${base}.png` });
  if ((await stat(`${base}.png`)).size <= MAX_BYTES) return `${base}.png`;
  await page.screenshot({ ...options, path: `${base}.jpg`, type: 'jpeg', quality: 80 });
  await rm(`${base}.png`);
  return `${base}.jpg`;
}

async function shoot(browser, dir, viewport) {
  const context = await browser.newContext({ viewport, reducedMotion: 'reduce', locale: 'zh-TW' });
  const page = await context.newPage();
  const problems = [];
  await page.route(/^(?!file:)/, (route) => {
    problems.push(`external request ${route.request().url()}`);
    return route.abort();
  });
  page.on('console', (msg) => msg.type() === 'error' && problems.push(`console error: ${msg.text()}`));
  page.on('pageerror', (error) => problems.push(`uncaught: ${error.message}`));
  page.on('requestfailed', (req) => req.url().startsWith('file:') && problems.push(`missing ${req.url()}`));
  try {
    await page.goto(pathToFileURL(resolve(dir, 'index.html')).href, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    const files = [
      await save(page, join(dir, `shot-${viewport.width}`), { fullPage: true }),
      await save(page, join(dir, `shot-${viewport.width}-first`), {}),
    ];
    const scroll = await page.evaluate(() => document.documentElement.scrollWidth);
    if (scroll > viewport.width) problems.push(`horizontal overflow: scrollWidth ${scroll} > ${viewport.width}`);
    for (const file of files) console.log(`${file}\t${Math.round((await stat(file)).size / 1024)} KB`);
  } catch (error) {
    problems.push(error.message);
  } finally {
    await context.close();
  }
  for (const problem of problems) console.error(`FAIL ${dir} ${viewport.width}: ${problem}`);
  return problems.length === 0;
}

const { values } = parseArgs({ options: { only: { type: 'string' } } });
const only = values.only?.split(',');
const dirs = (await readdir(ROOT, { withFileTypes: true }))
  .filter((d) => d.isDirectory() && (!only || only.includes(d.name)))
  .map((d) => join(ROOT, d.name))
  .filter((dir) => existsSync(join(dir, 'index.html')))
  .sort();
if (dirs.length === 0) {
  console.error(`no ${ROOT}/<direction>/index.html found`);
  process.exit(1);
}
const browser = await chromium.launch();
let ok = true;
for (const dir of dirs) {
  for (const viewport of VIEWPORTS) ok = (await shoot(browser, dir, viewport)) && ok;
}
await browser.close();
if (!ok) process.exit(1);
