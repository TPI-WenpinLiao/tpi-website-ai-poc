// Checks the line breaks of zh-TW text in a built page against design-principles.md「斷行」:
// - no text ends on a line holding one Han character or punctuation alone (服／務。, 評／估, a lone 。,
//   #225). base.css sets body text to `text-wrap: pretty`, src/lib/content/phrases.ts puts <wbr> in
//   the long runs of headings and .text-phrase, and FactText puts long-item lists in one column on
//   narrow screens; this catches a layout where those still leave one character behind
// - names, labels and headings (header cells, and whatever has `word-break: keep-all`: headings,
//   .text-phrase, the names in SpecTable) break only at a space, after punctuation, at a <wbr> or a <br>, never inside a
//   word (業／務培訓, 4-／GPU, #233). A break anywhere else is `overflow-wrap: anywhere` at work: the
//   text had no break opportunity where it needed one
// - the h2 of an offering or hub page's sections (PageSections' data-section) is two lines at most at
//   768 and 1280 wide (#233); at 375 a long heading may take three, breaking at its punctuation
// en and vi aren't checked: a last line of one Latin word is not this rule.
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
// Where names and labels may sit: header cells, and whatever has `word-break: keep-all`, are checked
// for breaks inside a word (a header cell is a label even when its component forgot .text-phrase)
const NAMES = 'main :is(h1, h2, h3, h4, h5, h6, .text-phrase, th, td), footer :is(a, .text-phrase)';
// The h2 of the sections an offering or hub page lays out by its brief, and the widths they must fit two lines at
const SECTION_H2 = 'main [data-section] h2';
const SECTION_H2_WIDTHS = [768, 1280];

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

/**
 * In the page: each keep-all name or heading that breaks inside a word, as "<tag.class>: <lines> [<break>]".
 * A break is allowed after a space or punctuation, or at a <wbr> or <br>; a break between two letters
 * or digits (a hyphen counts as part of the word) with none of those is a break inside a word.
 */
function midWordBreaks(selector) {
  const out = [];
  const els = [...document.querySelectorAll(selector)];
  for (const el of els) {
    const name = (e) => e.tagName === 'TH' || getComputedStyle(e).wordBreak === 'keep-all';
    if (!name(el)) continue;
    if (el.closest('.sr-only') || !el.checkVisibility({ visibilityProperty: true }) || el.getBoundingClientRect().width < 8) continue;
    // A name inside another matching block is measured on its own
    if (els.some((other) => other !== el && el.contains(other) && name(other))) continue;
    const chars = [];
    let opening = false;
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
    for (let node; (node = walker.nextNode()); ) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.tagName === 'WBR' || node.tagName === 'BR') opening = true;
        continue;
      }
      for (let i = 0; i < node.length; i++) {
        const range = document.createRange();
        range.setStart(node, i);
        range.setEnd(node, i + 1);
        const rect = range.getClientRects()[0];
        if (rect && rect.width > 0) {
          chars.push({ c: node.data[i], mid: rect.top + rect.height / 2, opening });
          opening = false;
        } else if (/\s/u.test(node.data[i] ?? '')) opening = true;
      }
    }
    const lines = [''];
    const breaks = [];
    for (let i = 0; i < chars.length; i++) {
      const [prev, cur] = [chars[i - 1], chars[i]];
      if (prev && Math.abs(cur.mid - prev.mid) > 4) {
        if (!cur.opening && /[\p{L}\p{N}-]/u.test(prev.c) && /[\p{L}\p{N}]/u.test(cur.c)) breaks.push(`${lines.at(-1)?.slice(-4)}／${cur.c}`);
        lines.push('');
      }
      lines[lines.length - 1] += cur.c;
    }
    if (breaks.length) {
      const tag = `${el.tagName.toLowerCase()}${el.classList[0] ? `.${el.classList[0]}` : ''}`;
      out.push(`${tag} breaks inside a word: ${lines.join('｜')} [${breaks.join(', ')}]`);
    }
  }
  return out;
}

/** In the page: each section h2 longer than two lines, as "section h2 takes <n> lines …: <text>" */
function longHeadings(selector) {
  const out = [];
  for (const el of document.querySelectorAll(selector)) {
    if (!el.checkVisibility({ visibilityProperty: true })) continue;
    // The text's boxes come one or more a line; lines are the distinct vertical middles
    const range = document.createRange();
    range.selectNodeContents(el);
    const mids = [];
    for (const rect of range.getClientRects()) {
      const mid = rect.top + rect.height / 2;
      if (rect.width > 0 && !mids.some((m) => Math.abs(m - mid) <= 4)) mids.push(mid);
    }
    if (mids.length > 2) out.push(`section h2 takes ${mids.length} lines (two at most): ${el.textContent?.trim()}`);
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
        for (const hit of await page.evaluate(midWordBreaks, NAMES)) problems.push(`${path} at ${width}px: ${hit}`);
        if (SECTION_H2_WIDTHS.includes(width)) for (const hit of await page.evaluate(longHeadings, SECTION_H2)) problems.push(`${path} at ${width}px: ${hit}`);
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
  console.log(`${paths.length} zh-TW pages × ${sizes.length} widths checked, ${problems.length} problems`);
  if (problems.length) process.exitCode = 1;
}

await main(process.argv.slice(2));
