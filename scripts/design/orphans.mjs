// Checks that no zh-TW text in a built page ends on a line holding one Han character or punctuation
// alone (服／務。, 評／估, a lone 。): design-principles.md「斷行」, #225. base.css sets body text to
// `text-wrap: pretty`, src/lib/content/phrases.ts puts <wbr> in the long runs of headings and
// .text-phrase, and FactText puts long-item lists in one column on narrow screens; this catches a
// layout where those still leave one character behind. en and vi aren't checked: a last line of one
// Latin word is not this rule.
// Part of `npm run check`, after the build: node scripts/design/orphans.mjs [path prefix=/] [widths=375,768,1280]
// Uses CHROME_PATH (set by the SessionStart hook), else CHROME_BIN (set on GitHub's runners), else the installed Chrome.
import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import puppeteer from 'puppeteer-core';
import { serve } from '../lib/static-server.mjs';
import { urlPath } from '../i18n/routes.mjs';
import { localeFromPath } from '../../src/lib/i18n/paths.ts';

const DIST = resolve(import.meta.dirname, '../../dist');
const TABS = 4;
// The text blocks the rule covers: paragraphs, list items, definitions, headings, footer links
const SELECTOR = 'main :is(p, li, dd, h1, h2, h3), footer a';

/**
 * In the page: each text block whose last line is one Han character or only punctuation, as
 * "<tag.class>: …<last characters> → 「<last line>」". Lines come from each character's box, so
 * what is measured is what the reader sees.
 */
function lastLines(selector) {
  const out = [];
  for (const el of document.querySelectorAll(selector)) {
    // A block that holds other blocks is measured through them. Hidden text isn't read: a closed
    // <details> still gives its content boxes (checkVisibility), and a box this narrow is clipped
    // out of sight (sr-only, the breadcrumb's current page below --bp-lg-up)
    if (el.querySelector('p, li, ul, ol, div') || !el.checkVisibility({ visibilityProperty: true }) || el.getBoundingClientRect().width < 8) continue;
    const chars = [];
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    for (let node; (node = walker.nextNode()); ) {
      for (let i = 0; i < node.length; i++) {
        const range = document.createRange();
        range.setStart(node, i);
        range.setEnd(node, i + 1);
        const rect = range.getClientRects()[0];
        if (rect && rect.width > 0) chars.push({ c: node.data[i], mid: rect.top + rect.height / 2 });
      }
    }
    if (chars.length < 2) continue;
    const last = Math.max(...chars.map((x) => x.mid));
    const lineHeight = Math.min(...chars.map((x) => Math.abs(x.mid - last)).filter((d) => d > 4));
    if (!Number.isFinite(lineHeight)) continue; // one line
    const line = chars
      .filter((x) => Math.abs(x.mid - last) <= 4)
      .map((x) => x.c)
      .join('')
      .trim();
    const core = [...line.replace(/[\p{P}\p{S}\s]/gu, '')];
    const lone = core.length === 0 || (core.length === 1 && /\p{Script=Han}/u.test(core[0] ?? ''));
    if (lone) {
      const name = `${el.tagName.toLowerCase()}${el.classList[0] ? `.${el.classList[0]}` : ''}`;
      out.push(`${name}: …${chars.slice(-14).map((x) => x.c).join('')} → 「${line}」`);
    }
  }
  return out;
}

async function main([prefix = '/', widths = '375,768,1280']) {
  const paths = readdirSync(DIST, { recursive: true })
    .map(String)
    .filter((f) => f.endsWith('.html'))
    .map(urlPath)
    .filter((p) => p.startsWith(prefix) && localeFromPath(p) === 'zh-TW')
    .sort();
  const server = await serve(DIST);
  const { port } = /** @type {import('node:net').AddressInfo} */ (server.address());
  const executablePath = process.env.CHROME_PATH || process.env.CHROME_BIN;
  const chrome = executablePath ? { executablePath } : { channel: /** @type {const} */ ('chrome') };
  const browser = await puppeteer.launch({ ...chrome, headless: true, args: ['--no-sandbox'] });
  const sizes = widths.split(',').map(Number);
  const problems = [];
  const queue = [...paths];
  // Each tab loads a page once and resizes it through every width (as overflow.mjs); the fonts are
  // awaited, since the fallback face sets wider or narrower and moves every break
  async function worker() {
    const page = await browser.newPage();
    // Layout only: the 3D scene and other scripts don't move the text, and WebGL can stall headless Chromium
    await page.setJavaScriptEnabled(false);
    for (let path; (path = queue.shift()); ) {
      await page.setViewport({ width: sizes[0], height: 800 });
      await page.goto(`http://localhost:${port}${path}`, { waitUntil: 'load' });
      for (const width of sizes) {
        await page.setViewport({ width, height: 800 });
        await page.evaluate(() => document.fonts.ready);
        for (const hit of await page.evaluate(lastLines, SELECTOR)) problems.push(`${path} at ${width}px: ${hit}`);
      }
    }
  }
  try {
    await Promise.all(Array.from({ length: TABS }, worker));
  } finally {
    await browser.close();
    server.close();
  }
  problems.sort();
  for (const p of problems) console.log(p);
  console.log(`${paths.length} zh-TW pages × ${sizes.length} widths checked, ${problems.length} last lines with one character`);
  if (problems.length) process.exitCode = 1;
}

await main(process.argv.slice(2));
