// Checks every built page with a sending form (FormPanel `form`, M6-01 #33) in a real browser, with
// the page's Pages Function served by handleSubmission (src/lib/forms/handler.ts) and Turnstile
// replaced by a stand-in script: a token is "pass" unless the test asks for "fail", and the server
// side accepts "pass" only. Per page:
// 1. Loading the page requests nothing outside the site (Turnstile loads on the first focus)
// 2. Submitting the empty form shows the error summary, focused, with one row per error, and the same
//    fields the Function reports for the same data; each field shows its error and aria-invalid
// 3. Filled in, the form sends once to the adapter and goes to the form's `next` page
// 4. When Turnstile refuses the token the form shows the spam check message, stays on the page, the
//    adapter gets nothing and the widget is reset
// 5. The widget is flexible at 1280px and compact at 375px, where the reserved space is narrower than 300px
// Part of `npm run check`, after the build: node scripts/forms/contact.mjs
// Uses CHROME_PATH (set by the SessionStart hook), else CHROME_BIN (set on GitHub's runners), else the installed Chrome.

import { readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer-core';
import { serve } from '../lib/static-server.mjs';
import { urlPath } from '../i18n/routes.mjs';
import { offSite } from '../design/video-facade.mjs';
import { handleSubmission } from '../../src/lib/forms/handler.ts';
import { isFormId } from '../../src/lib/forms/rules.ts';

const DIST = resolve(import.meta.dirname, '../../dist');
const MARKER = 'data-form="';
const TURNSTILE = 'https://challenges.cloudflare.com/turnstile/v0/api.js';

// Stand-in for Turnstile's api.js: render() adds the token input Turnstile adds, and records the size
const FAKE_TURNSTILE = `window.turnstile = {
  render(el, options) {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'cf-turnstile-response';
    input.value = window.__turnstileToken ?? 'pass';
    el.append(input);
    el.dataset.testSize = options.size;
    return 'widget';
  },
  reset() { window.__turnstileResets = (window.__turnstileResets ?? 0) + 1; },
};`;

/**
 * @typedef {{
 *   loadRequests: string[],
 *   empty: { rows: string[], server: string[], focused: boolean, unmarked: string[] },
 *   sent: { path: string, next: string, submissions: number },
 *   refused: { path: string, start: string, message: string, expected: string, submissions: number, resets: number, buttonEnabled: boolean },
 *   sizes: { wide: string, narrow: string },
 * }} Result
 */

/** @param {Result} r @returns {string[]} */
export function problems({ loadRequests, empty, sent, refused, sizes }) {
  const out = loadRequests.map((u) => `requested on load: ${u}`);
  if (!empty.rows.length) out.push('the empty form shows no error summary');
  if (empty.rows.join() !== empty.server.join()) out.push(`errors differ: page ${empty.rows.join(', ')}; server ${empty.server.join(', ')}`);
  if (!empty.focused) out.push('focus does not move to the error summary');
  for (const field of empty.unmarked) out.push(`${field} shows no error of its own`);
  if (sent.path !== sent.next) out.push(`after sending the page is ${sent.path}, not ${sent.next}`);
  if (sent.submissions !== 1) out.push(`a valid submit reached the adapter ${sent.submissions} times`);
  if (refused.path !== refused.start) out.push(`a refused token left the page for ${refused.path}`);
  if (refused.message !== refused.expected) out.push(`a refused token shows "${refused.message}", not "${refused.expected}"`);
  if (refused.submissions !== 0) out.push('a refused token still reached the adapter');
  if (refused.resets < 1) out.push('the widget was not reset after a refused token');
  if (!refused.buttonEnabled) out.push('the submit button stays disabled after a refused token');
  if (sizes.wide !== 'flexible') out.push(`the widget at 1280px is ${sizes.wide || 'missing'}, not flexible`);
  if (sizes.narrow !== 'compact') out.push(`the widget at 375px is ${sizes.narrow || 'missing'}, not compact`);
  return out;
}

/** @param {import('puppeteer-core').Browser} browser @param {number} width @param {string} [token] */
async function open(browser, width, token) {
  const page = await browser.newPage();
  await page.setViewport({ width, height: 900 });
  if (token) await page.evaluateOnNewDocument((t) => Object.assign(window, { __turnstileToken: t }), token);
  await page.setRequestInterception(true);
  /** @type {string[]} */
  const offsite = [];
  page.on('request', (req) => {
    const url = req.url();
    if (url.startsWith(TURNSTILE)) return void req.respond({ contentType: 'text/javascript', body: FAKE_TURNSTILE });
    if (offSite([url], new URL(page.url() === 'about:blank' ? url : page.url()).origin).length) {
      offsite.push(url);
      return void req.abort();
    }
    req.continue();
  });
  return { page, offsite };
}

/** Focus the form so the widget loads, then wait for its token input. @param {import('puppeteer-core').Page} page */
async function startWidget(page) {
  await page.focus('form[data-form] input:not([type="hidden"])');
  await page.waitForSelector('form[data-form] [data-form-challenge] input[name="cf-turnstile-response"]');
}

/** The size the widget was rendered at, read in the page; '' when there is none. */
const widgetSize = () => {
  const slot = document.querySelector('[data-form-challenge]');
  return slot instanceof HTMLElement ? slot.dataset.testSize ?? '' : '';
};

/** @param {import('puppeteer-core').Page} page */
async function fill(page) {
  for (const [selector, text] of [
    ['#name', '王小明'],
    ['#phone', '02 2658 0508'],
    ['#email', 'name@example.com'],
    ['#company', '昕力資訊'],
    ['#subject', '產品諮詢'],
  ]) {
    await page.$eval(selector, (el) => {
      if (el instanceof HTMLInputElement) el.value = '';
    });
    await page.type(selector, text);
  }
  // Clicked through the DOM: a coordinate click can land on the sticky header
  for (const selector of ['#offerings input[type="checkbox"]', '#consent']) await page.$eval(selector, (el) => el instanceof HTMLElement && el.click());
}

/** @param {import('puppeteer-core').Browser} browser @param {string} url @param {() => number} submissions */
async function check(browser, url, submissions) {
  // 1, 2: load, then submit the form as it is
  const first = await open(browser, 1280);
  await first.page.goto(url, { waitUntil: 'networkidle0' });
  const loadRequests = [...first.offsite];
  await startWidget(first.page);
  await first.page.$$eval('form[data-form] input:not([type="hidden"]), form[data-form] textarea', (els) =>
    els.forEach((el) => {
      if (el instanceof HTMLInputElement && el.type === 'checkbox') el.checked = false;
      else if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) el.value = '';
    }),
  );
  // The /templates preview starts with a drawn summary; only the script's own should count
  await first.page.$eval('[data-form-status]', (el) => el.replaceChildren());
  await first.page.click('form[data-form] button[type="submit"]');
  await first.page.waitForSelector('[data-form-status] ol li');
  const empty = await first.page.evaluate(async () => {
    const form = /** @type {HTMLFormElement} */ (document.querySelector('form[data-form]'));
    const status = form.querySelector('[data-form-status]');
    const rows = [...(status?.querySelectorAll('ol a') ?? [])].map((a) => a.getAttribute('href')?.slice(1) ?? '');
    const unmarked = rows.filter((field) => {
      const target = document.getElementById(field);
      const wrapper = target?.closest('[data-form-field]');
      const error = wrapper?.querySelector(':scope > [data-form-error]');
      const invalid = target instanceof HTMLFieldSetElement || target?.getAttribute('aria-invalid') === 'true';
      return !wrapper?.classList.contains('has-error') || !(error instanceof HTMLElement) || error.hidden || !error.textContent || !invalid;
    });
    const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { accept: 'application/json' } });
    const reply = await res.json();
    const server = (reply.errors ?? []).map((/** @type {{ field: string }} */ e) => e.field);
    return { rows, server, focused: document.activeElement === status, unmarked };
  });

  // 3: fill in and send
  const before = submissions();
  await fill(first.page);
  const next = await first.page.$eval('form[data-form] input[name="next"]', (el) => (el instanceof HTMLInputElement ? el.value : ''));
  await Promise.all([first.page.waitForNavigation({ waitUntil: 'load' }), first.page.click('form[data-form] button[type="submit"]')]);
  const sent = { path: new URL(first.page.url()).pathname, next, submissions: submissions() - before };
  await first.page.close();

  // 4: Turnstile refuses the token
  const second = await open(browser, 1280, 'fail');
  await second.page.goto(url, { waitUntil: 'networkidle0' });
  await startWidget(second.page);
  await fill(second.page);
  const start = submissions();
  const expected = await second.page.$eval('form[data-form]', (el) => (el instanceof HTMLFormElement ? String(JSON.parse(el.dataset.messages ?? '{}').challenge) : ''));
  // A wrong page sends the visitor on to `next` instead: wait for the message or a navigation
  await Promise.race([
    second.page.waitForNavigation({ waitUntil: 'load' }),
    second.page.waitForFunction(() => document.querySelector('[data-form-status] .message .text')?.textContent),
    second.page.click('form[data-form] button[type="submit"]').then(() => new Promise((r) => setTimeout(r, 10_000))),
  ]).catch(() => {});
  const refused = await second.page.evaluate(() => {
    const form = document.querySelector('form[data-form]');
    const button = form?.querySelector('button[type="submit"]');
    return {
      path: location.pathname,
      message: form?.querySelector('[data-form-status] .message .text')?.textContent ?? '',
      resets: Number(Reflect.get(window, '__turnstileResets') ?? 0),
      buttonEnabled: button instanceof HTMLButtonElement && !button.disabled,
    };
  });
  const wide = await second.page.evaluate(widgetSize);
  await second.page.close();

  // 5: the narrow widget
  const third = await open(browser, 375);
  await third.page.goto(url, { waitUntil: 'networkidle0' });
  await startWidget(third.page);
  const narrow = await third.page.evaluate(widgetSize);
  await third.page.close();

  return problems({
    loadRequests,
    empty,
    sent,
    refused: { ...refused, expected, start: new URL(url).pathname, submissions: submissions() - start },
    sizes: { wide, narrow },
  });
}

async function main() {
  const pages = readdirSync(DIST, { recursive: true })
    .map(String)
    .filter((f) => f.endsWith('.html'))
    .flatMap((f) => {
      const html = readFileSync(join(DIST, f), 'utf8');
      const form = html.match(/data-form="([^"]+)"/)?.[1];
      const action = html.match(/<form[^>]*\baction="([^"]+)"/)?.[1];
      return html.includes(MARKER) && form && action ? [{ path: urlPath(f), form, action }] : [];
    })
    .sort((a, b) => a.path.localeCompare(b.path));

  let count = 0;
  /** @type {Record<string, import('../lib/static-server.mjs').Route>} */
  const routes = {};
  for (const { form, action } of pages) {
    if (!isFormId(form)) throw new Error(`data-form="${form}" is not in src/lib/forms/rules.ts`);
    routes[`POST ${action}`] = (request) =>
      handleSubmission(request, {
        form,
        secret: 'test-secret',
        verify: async ({ token }) => token === 'pass',
        adapter: { send: async () => void count++ },
      });
  }
  const server = await serve(DIST, 0, routes);
  const { port } = /** @type {import('node:net').AddressInfo} */ (server.address());
  const executablePath = process.env.CHROME_PATH || process.env.CHROME_BIN;
  const chrome = executablePath ? { executablePath } : { channel: /** @type {const} */ ('chrome') };
  const browser = await puppeteer.launch({ ...chrome, headless: true, args: ['--no-sandbox'] });
  let failing = 0;
  try {
    for (const { path } of pages) {
      const found = await check(browser, `http://localhost:${port}${path}`, () => count);
      for (const p of found) console.log(`${path}: ${p}`);
      if (found.length) failing++;
    }
  } finally {
    await browser.close();
    server.close();
  }
  console.log(`${pages.length} pages with a sending form checked, ${failing} with problems`);
  if (!pages.length || failing) process.exitCode = 1;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) await main();
