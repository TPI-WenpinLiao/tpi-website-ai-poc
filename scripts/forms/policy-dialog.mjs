// Checks every built page with a privacy policy link that opens PolicyDialog (data-policy-open, #250)
// in a real browser. Per page:
// 1. Loading the page doesn't request the policy page
// 2. With a field of the page's form filled in, Enter on the link opens the dialog as a modal, puts
//    focus inside it, shows the policy's text (the loading text hidden) marked with the policy page's
//    lang, and stops the page scrolling
// 3. axe-core finds no WCAG 2.2 A/AA violation in the open dialog
// 4. Esc closes it, focus goes back to the link and the field keeps its value; opening it again
//    doesn't fetch the policy again; a drag from the text to the backdrop (selecting text) leaves it
//    open, a click on the backdrop closes it
// 5. At 375px the open dialog fits the viewport's width
// 6. Without JS the link goes to the policy page
// 7. When the policy fails to load after the dialog was closed, the page stays (the form keeps what
//    was typed); the next open loads it
// Part of `npm run check`, after the build: node scripts/forms/policy-dialog.mjs
// Uses CHROME_PATH (set by the SessionStart hook), else CHROME_BIN (set on GitHub's runners), else the installed Chrome.

import { readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import axe from 'axe-core';
import puppeteer from 'puppeteer-core';
import { serve } from '../lib/static-server.mjs';
import { urlPath } from '../i18n/routes.mjs';
import { offSite } from '../design/video-facade.mjs';
import { TAGS } from '../design/axe.mjs';

const DIST = resolve(import.meta.dirname, '../../dist');
const MARKER = 'data-policy-open="';
const LINK = 'a[data-policy-open]';
const FIELD = 'form input[type="text"]';
const VALUE = '王小明';

/**
 * @typedef {{
 *   policy: string,
 *   onLoad: number,
 *   opened: { modal: boolean, focusInside: boolean, blocks: number, loadingShown: boolean, pageScrolls: boolean, lang: string, policyLang: string },
 *   violations: string[],
 *   closed: { open: boolean, focusOnLink: boolean, value: string },
 *   fetches: number,
 *   dragClosed: boolean,
 *   backdropClosed: boolean,
 *   narrow: { dialogWidth: number, viewport: number },
 *   noJs: string,
 *   failedLate: { path: string, start: string, retried: boolean },
 * }} Result
 */

/** @param {Result} r @returns {string[]} */
export function problems({ policy, onLoad, opened, violations, closed, fetches, dragClosed, backdropClosed, narrow, noJs, failedLate }) {
  const out = [];
  if (onLoad) out.push(`${policy} requested ${onLoad} times on load`);
  if (!opened.modal) out.push('Enter on the link does not open the dialog as a modal');
  if (!opened.focusInside) out.push('focus is not inside the open dialog');
  if (!opened.blocks) out.push('the open dialog shows no policy text');
  if (opened.loadingShown) out.push('the loading text still shows after the policy loaded');
  if (opened.pageScrolls) out.push('the page under the open dialog still scrolls');
  if (opened.lang !== opened.policyLang) out.push(`the policy text has lang "${opened.lang}", not the policy page's "${opened.policyLang}"`);
  for (const v of violations) out.push(`axe in the open dialog: ${v}`);
  if (closed.open) out.push('Esc does not close the dialog');
  if (!closed.focusOnLink) out.push('focus does not go back to the link after closing');
  if (closed.value !== VALUE) out.push(`the filled field reads "${closed.value}" after closing, not "${VALUE}"`);
  if (fetches !== 1) out.push(`${policy} fetched ${fetches} times over two opens, not once`);
  if (dragClosed) out.push('a drag from the text to the backdrop closes the dialog');
  if (!backdropClosed) out.push('a click on the backdrop does not close the dialog');
  if (narrow.dialogWidth > narrow.viewport) out.push(`at ${narrow.viewport}px the dialog is ${narrow.dialogWidth}px wide`);
  if (noJs !== policy) out.push(`without JS the link goes to ${noJs}, not ${policy}`);
  if (failedLate.path !== failedLate.start) out.push(`a load that failed after closing the dialog left the page for ${failedLate.path}`);
  if (!failedLate.retried) out.push('after a failed load the next open does not load the policy');
  return out;
}

/**
 * @param {import('puppeteer-core').Browser} browser @param {number} width
 * @param {(req: import('puppeteer-core').HTTPRequest) => boolean} [hold] requests to leave unanswered until released
 */
async function open(browser, width, hold) {
  const page = await browser.newPage();
  await page.setViewport({ width, height: 900 });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.setRequestInterception(true);
  /** @type {string[]} */
  const requested = [];
  /** @type {import('puppeteer-core').HTTPRequest[]} */
  const held = [];
  page.on('request', (req) => {
    const url = req.url();
    // Turnstile loads when focus enters a sending form; nothing outside the site is needed here
    if (offSite([url], new URL(page.url() === 'about:blank' ? url : page.url()).origin).length) return void req.abort();
    requested.push(new URL(url).pathname);
    if (hold?.(req)) return void held.push(req);
    req.continue();
  });
  return { page, requested, held };
}

/** Opens the dialog from the keyboard and waits for the policy's text. @param {import('puppeteer-core').Page} page */
async function openDialog(page) {
  await page.focus(LINK);
  await page.keyboard.press('Enter');
  await page.waitForFunction(() => document.querySelector('[data-policy-status]')?.hasAttribute('hidden'));
}

/** @param {import('puppeteer-core').Browser} browser @param {string} url @returns {Promise<string[]>} */
async function check(browser, url) {
  const { page, requested } = await open(browser, 1280);
  await page.goto(url, { waitUntil: 'networkidle0' });
  const policy = await page.$eval(LINK, (a) => new URL(/** @type {HTMLAnchorElement} */ (a).href).pathname);
  const fetched = () => requested.filter((p) => p === policy).length;
  const onLoad = fetched();
  // Set without focusing it, the way a visitor's earlier typing left it
  await page.$eval(FIELD, (el, v) => void (/** @type {HTMLInputElement} */ (el).value = v), VALUE);

  await openDialog(page);
  const policyLang = readFileSync(join(DIST, `${policy}.html`), 'utf8').match(/<html[^>]*\blang="([^"]*)"/)?.[1] ?? '';
  const opened = await page.evaluate((policyLang) => {
    const dialog = document.querySelector('dialog:has([data-policy-body])');
    return {
      lang: dialog?.querySelector('[data-policy-body]')?.getAttribute('lang') ?? '',
      policyLang,
      modal: dialog?.matches(':modal') ?? false,
      focusInside: dialog?.contains(document.activeElement) ?? false,
      blocks: dialog?.querySelector('[data-policy-body]')?.children.length ?? 0,
      loadingShown: !(dialog?.querySelector('[data-policy-status]')?.hasAttribute('hidden') ?? true),
      pageScrolls: getComputedStyle(document.documentElement).overflow !== 'hidden',
    };
  }, policyLang);
  await page.evaluate(axe.source);
  /** @type {string[]} */
  const violations = await page.evaluate(
    (tags) =>
      /** @type {any} */ (window).axe
        .run('dialog:has([data-policy-body])', { runOnly: { type: 'tag', values: tags }, resultTypes: ['violations'] })
        .then((/** @type {any} */ r) => r.violations.map((/** @type {any} */ v) => `${v.id}: ${v.nodes[0]?.target.join(' ')}`)),
    TAGS,
  );

  await page.keyboard.press('Escape');
  const closed = await page.evaluate(
    (link, field) => ({
      open: document.querySelector('dialog:has([data-policy-body])')?.open ?? false,
      focusOnLink: document.activeElement?.matches(link) ?? false,
      value: /** @type {HTMLInputElement | null} */ (document.querySelector(field))?.value ?? '',
    }),
    LINK,
    FIELD,
  );

  await openDialog(page);
  const text = await page.$eval('dialog [data-policy-body] p', (p) => {
    const r = p.getBoundingClientRect();
    return { x: r.left + 8, y: r.top + 8 };
  });
  await page.mouse.move(text.x, text.y);
  await page.mouse.down();
  await page.mouse.move(2, 2, { steps: 4 });
  await page.mouse.up();
  const dragClosed = await page.evaluate(() => !document.querySelector('dialog:has([data-policy-body])')?.open);
  await page.mouse.click(2, 2);
  const backdropClosed = await page.evaluate(() => !document.querySelector('dialog:has([data-policy-body])')?.open);
  const fetches = fetched();
  await page.close();

  const small = await open(browser, 375);
  await small.page.goto(url, { waitUntil: 'networkidle0' });
  await openDialog(small.page);
  const narrow = await small.page.evaluate(() => ({
    dialogWidth: Math.ceil(document.querySelector('dialog:has([data-policy-body])')?.getBoundingClientRect().width ?? 0),
    viewport: document.documentElement.clientWidth,
  }));
  await small.page.close();

  const plain = await browser.newPage();
  await plain.setJavaScriptEnabled(false);
  await plain.goto(url, { waitUntil: 'load' });
  await Promise.all([plain.waitForNavigation({ waitUntil: 'load' }), plain.$eval(LINK, (a) => /** @type {HTMLElement} */ (a).click())]);
  const noJs = new URL(plain.url()).pathname;
  await plain.close();

  // The first policy request waits until the dialog is closed, then fails
  let failNext = true;
  const late = await open(browser, 1280, (req) => new URL(req.url()).pathname === policy && failNext);
  await late.page.goto(url, { waitUntil: 'networkidle0' });
  await late.page.focus(LINK);
  await late.page.keyboard.press('Enter');
  await late.page.waitForFunction(() => document.querySelector('dialog:has([data-policy-body])')?.open);
  await late.page.keyboard.press('Escape');
  failNext = false;
  for (const req of late.held.splice(0)) await req.respond({ status: 500, body: '' });
  await new Promise((done) => setTimeout(done, 500));
  const start = new URL(url).pathname;
  const path = new URL(late.page.url()).pathname;
  let retried = false;
  if (path === start) {
    await openDialog(late.page);
    retried = await late.page.evaluate(() => (document.querySelector('dialog [data-policy-body]')?.children.length ?? 0) > 0);
  }
  await late.page.close();

  return problems({ policy, onLoad, opened, violations, closed, fetches, dragClosed, backdropClosed, narrow, noJs, failedLate: { path, start, retried } });
}

async function main() {
  const paths = readdirSync(DIST, { recursive: true })
    .map(String)
    .filter((f) => f.endsWith('.html') && readFileSync(join(DIST, f), 'utf8').includes(MARKER))
    .map(urlPath)
    .sort();
  const server = await serve(DIST);
  const { port } = /** @type {import('node:net').AddressInfo} */ (server.address());
  const executablePath = process.env.CHROME_PATH || process.env.CHROME_BIN;
  const chrome = executablePath ? { executablePath } : { channel: /** @type {const} */ ('chrome') };
  const browser = await puppeteer.launch({ ...chrome, headless: true, args: ['--no-sandbox'] });
  let failing = 0;
  try {
    for (const path of paths) {
      const found = await check(browser, `http://localhost:${port}${path}`);
      for (const p of found) console.log(`${path}: ${p}`);
      if (found.length) failing++;
    }
  } finally {
    await browser.close();
    server.close();
  }
  console.log(`${paths.length} pages with a privacy policy dialog checked, ${failing} with problems`);
  if (!paths.length || failing) process.exitCode = 1;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) await main();
