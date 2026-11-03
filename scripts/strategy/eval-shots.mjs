#!/usr/bin/env node
// Prepares what the reviewers look at for docs/strategy/evaluation.md (#168, .claude/skills/site-review
// 「評審對象的準備」): screenshots and HTML of the pilot pages in each group being compared.
//
//   1. groups: `new` and `old` are built sites (dist/ directories given on the command line) served
//      locally; `current` is the live site; `competitors` are the competitor home pages
//   2. every page is opened at 375×812 and 1280×800 with prefers-reduced-motion: reduce, so scroll and
//      entrance animations show their end state and the home page shows its static ribbon instead of
//      WebGL (headless Chromium renders WebGL in software, which is not what a visitor sees)
//   3. the page waits for networkidle (or a fixed timeout), is scrolled to the bottom and back so lazy
//      images load, then two images are saved per width in docs/strategy/evaluation/<group>/:
//      <page>-<width>-first.jpg (first screen, for rubric item D1 and the five-second test) and
//      <page>-<width>-full.jpg (full page). JPEG quality 80 and 60, so the 44 images stay small in the repo
//   4. the reviewers' working copy goes to --work, which is not committed (the live site and the
//      competitors are third-party content): <group>/<page>.html, and the full page cut into parts of
//      1600 px (1400 px at 375), <group>/<page>-<width>-partNN.jpg, so a reviewer can read the text,
//      which a 7,000 px image shrunk to fit cannot. A built page's HTML is copied from dist/ as built,
//      since the SEO rubric reads the head as shipped; a remote page is saved as rendered, since the
//      live site is a client-rendered Nuxt app
//   5. --work/blind/ holds the same material under neutral codes, so a reviewer does not see which group
//      a page belongs to (site-review「輸入」): rNN/ are the pages (page.html, page-<width>-first.jpg,
//      page-<width>-partNN.jpg), fNN/ are the home first screens of new, old and current for the
//      five-second test (screen-<width>-first.jpg). The codes are ordered by a hash of the page, so a re-run
//      gives the same ones; blind/map.tsv says which is which and is for the main session only
//
// Nothing on a page is clicked or closed. A page that fails to load is reported with the error and the
// run goes on with the others, then exits 1 without writing blind/. Re-running overwrites the same files.
//
// Usage: node scripts/strategy/eval-shots.mjs --new <dist> --old <old dist> [--work <dir>] [--only new,current]
import { createHash } from 'node:crypto';
import { copyFile, mkdir, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import { chromium } from 'playwright';
import { fileKind, servedFile, serve } from '../lib/static-server.mjs';

const OUT_DIR = 'docs/strategy/evaluation';
const FIRST_QUALITY = 80;
const FULL_QUALITY = 60;
const VIEWPORTS = [
  { width: 375, height: 812, part: 1400 },
  { width: 1280, height: 800, part: 1600 },
];
const IDLE_TIMEOUT = 30_000;
const SETTLE_MS = 2_000;

/** The pilot pages (docs/strategy/site-profile.md「試點頁面」) by slug; paths on the new site. */
const PILOT = [
  { slug: 'home', path: '/' },
  { slug: 'digirunner', path: '/products/digirunner' },
  { slug: 'finance', path: '/industries/finance' },
];

/** The live pages for the pilot nodes, from docs/ia/page-map.csv (finance merges /products/open-banking). */
const CURRENT = [
  { slug: 'home', url: 'https://www.tpisoftware.com/' },
  { slug: 'digirunner', url: 'https://www.tpisoftware.com/products/digirunner' },
  { slug: 'finance', url: 'https://www.tpisoftware.com/products/open-banking' },
];

/** The two competitors of docs/strategy/competitors.md whose audience overlaps the most (#168). */
const COMPETITORS = [
  { slug: 'systex', url: 'https://www.systex.com/' },
  { slug: 'syscom', url: 'https://www.syscom.com.tw/' },
];

/** Groups with a five-second test (home first screen only). */
const FIVE_SECOND = ['new', 'old', 'current'];

const { values } = parseArgs({
  options: {
    new: { type: 'string' },
    old: { type: 'string' },
    work: { type: 'string', default: join(tmpdir(), 'eval-work') },
    only: { type: 'string' },
  },
});
const want = (group) => !values.only || values.only.split(',').includes(group);

/**
 * Orders `items` by the SHA-256 of their key, so codes do not follow the group order and a re-run gives
 * the same codes. The #168 reviews were blinded by a one-off command before this function existed, so
 * their codes (written at the top of each review) differ from what map.tsv gives on a re-run.
 */
function shuffle(items, key) {
  const hash = (item) => createHash('sha256').update(key(item)).digest('hex');
  return [...items].sort((a, b) => (hash(a) < hash(b) ? -1 : 1));
}

async function removeParts(dir, prefix) {
  for (const file of await readdir(dir)) {
    if (file.startsWith(prefix) && /-part\d+\.jpg$/.test(file)) await rm(join(dir, file));
  }
}

/** Opens one page at one width and saves its images; resolves to the rendered HTML. */
async function shoot(browser, group, slug, url, { width, height, part }) {
  const context = await browser.newContext({ viewport: { width, height }, locale: 'zh-TW', reducedMotion: 'reduce' });
  try {
    const page = await context.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 });
    await page.waitForLoadState('networkidle', { timeout: IDLE_TIMEOUT }).catch(() => {});
    await page.waitForTimeout(SETTLE_MS);
    await page.evaluate(() => document.fonts.ready);
    const base = join(OUT_DIR, group, `${slug}-${width}`);
    await page.screenshot({ path: `${base}-first.jpg`, type: 'jpeg', quality: FIRST_QUALITY });
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += window.innerHeight) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 150));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForLoadState('networkidle', { timeout: IDLE_TIMEOUT }).catch(() => {});
    await page.screenshot({ path: `${base}-full.jpg`, fullPage: true, type: 'jpeg', quality: FULL_QUALITY });

    const work = join(values.work, group);
    await removeParts(work, `${slug}-${width}-`);
    const total = await page.evaluate(() => document.documentElement.scrollHeight);
    let parts = 0;
    for (let y = 0; y < total; y += part) {
      parts += 1;
      const path = join(work, `${slug}-${width}-part${String(parts).padStart(2, '0')}.jpg`);
      const clip = { x: 0, y, width, height: Math.min(part, total - y) };
      await page.screenshot({ path, fullPage: true, clip, type: 'jpeg', quality: FIRST_QUALITY });
    }
    for (const kind of ['first', 'full']) {
      const file = `${base}-${kind}.jpg`;
      console.log(`${file}\t${Math.round((await stat(file)).size / 1024)} KB\t${page.url()}`);
    }
    console.log(`${join(work, `${slug}-${width}-partNN.jpg`)}\t${parts} parts`);
    return await page.content();
  } finally {
    await context.close();
  }
}

/** Shoots one page at both widths; resolves to the rendered HTML at 1280, or undefined on a failure. */
async function shootBoth(browser, group, slug, url) {
  let html;
  for (const viewport of VIEWPORTS) {
    try {
      html = await shoot(browser, group, slug, url, viewport);
    } catch (error) {
      console.error(`FAIL ${group}/${slug} ${viewport.width}: ${error.message}`);
      return undefined;
    }
  }
  return html;
}

/** Copies the working copy into blind/ under neutral codes and writes blind/map.tsv. */
async function writeBlind(pages) {
  const blind = join(values.work, 'blind');
  await rm(blind, { recursive: true, force: true });
  const map = ['code\tgroup\tpage'];
  for (const [i, { group, slug }] of shuffle(pages, (p) => `${p.group}/${p.slug}`).entries()) {
    const code = `r${String(i + 1).padStart(2, '0')}`;
    const dir = join(blind, code);
    await mkdir(dir, { recursive: true });
    await copyFile(join(values.work, group, `${slug}.html`), join(dir, 'page.html'));
    for (const { width } of VIEWPORTS) {
      await copyFile(join(OUT_DIR, group, `${slug}-${width}-first.jpg`), join(dir, `page-${width}-first.jpg`));
    }
    for (const file of await readdir(join(values.work, group))) {
      if (file.startsWith(`${slug}-`) && file.endsWith('.jpg')) {
        await copyFile(join(values.work, group, file), join(dir, file.replace(`${slug}-`, 'page-')));
      }
    }
    map.push(`${code}\t${group}\t${slug}`);
  }
  for (const [i, group] of shuffle(FIVE_SECOND.filter((g) => pages.some((p) => p.group === g)), (g) => g).entries()) {
    const code = `f${String(i + 1).padStart(2, '0')}`;
    const dir = join(blind, code);
    await mkdir(dir, { recursive: true });
    for (const { width } of VIEWPORTS) {
      await copyFile(join(OUT_DIR, group, `home-${width}-first.jpg`), join(dir, `screen-${width}-first.jpg`));
    }
    map.push(`${code}\t${group}\thome (five-second test)`);
  }
  await writeFile(join(blind, 'map.tsv'), `${map.join('\n')}\n`);
  console.log(`${blind}\t${pages.length} pages; map in map.tsv`);
}

const browser = await chromium.launch();
let ok = true;
/** @type {{ group: string, slug: string }[]} */
const done = [];

for (const group of ['new', 'old']) {
  if (!want(group)) continue;
  const root = values[group];
  if (!root) {
    console.error(`FAIL ${group}: pass --${group} <dist directory>`);
    ok = false;
    continue;
  }
  await mkdir(join(OUT_DIR, group), { recursive: true });
  await mkdir(join(values.work, group), { recursive: true });
  const server = await serve(root);
  const { port } = /** @type {import('node:net').AddressInfo} */ (server.address());
  for (const { slug, path } of PILOT) {
    const file = servedFile(path, fileKind(root));
    const html = await shootBoth(browser, group, slug, `http://localhost:${port}${path}`);
    if (html === undefined || !file) {
      if (!file) console.error(`FAIL ${group}/${slug}: ${path} is not in ${root}`);
      ok = false;
      continue;
    }
    await copyFile(join(root, file), join(values.work, group, `${slug}.html`));
    done.push({ group, slug });
  }
  server.close();
}

for (const [group, pages] of [
  ['current', CURRENT],
  ['competitors', COMPETITORS],
]) {
  if (!want(group)) continue;
  await mkdir(join(OUT_DIR, group), { recursive: true });
  await mkdir(join(values.work, group), { recursive: true });
  for (const { slug, url } of pages) {
    const html = await shootBoth(browser, group, slug, url);
    if (html === undefined) {
      ok = false;
      continue;
    }
    await writeFile(join(values.work, group, `${slug}.html`), html);
    done.push({ group, slug });
  }
}

await browser.close();
if (!ok) process.exit(1);
await writeBlind(done);
