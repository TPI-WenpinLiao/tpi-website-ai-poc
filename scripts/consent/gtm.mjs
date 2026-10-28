// Checks the cookie consent banner and GTM loading (M6-04, #36, ADR 0007) in a real browser.
// 1. dist/ (built without PUBLIC_GTM_ID) has no banner and no GTM on any page
// 2. A second build with a test container ID (PUBLIC_GTM_ID=GTM-TEST0000, CONSENT_ALLOW_DRAFT=1, into
//    .consent-dist/, gitignored) is served, every off-site request recorded, gtm.js answered with an empty
//    script and everything else off-site aborted. Per page, in a fresh browser context (no stored choice):
//    - first load: the banner shows, nothing is requested off-site, there is no dataLayer, one h1,
//      no axe violation, no horizontal scroll at 375 and 1280px
//    - Tab reaches the banner; 偏好設定 opens the dialog with focus inside, Tab never reaches the page
//      behind it, axe passes with it open, Esc closes it and focus goes back to the button
//    - 全部拒絕: the banner goes, focus moves to <main>, and after a reload the banner stays away and
//      nothing is requested off-site
//    - the footer's Cookie 設定 opens the dialog with every switch off; switching one category on and
//      saving requests gtm.js once, with the test ID, after a consent default and update that grant
//      only that category's types
//    - reopening shows the switch on; switching it off and saving reloads the page, which then
//      requests nothing off-site
//    - in another fresh context, 全部接受 on the banner requests gtm.js
// Part of `npm run check`, after the build: node scripts/consent/gtm.mjs
// Uses CHROME_PATH (set by the SessionStart hook), else CHROME_BIN (set on GitHub's runners), else the installed Chrome.

import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import axe from 'axe-core';
import puppeteer from 'puppeteer-core';
import { serve } from '../lib/static-server.mjs';
import { offSite } from '../design/video-facade.mjs';
import { TAGS } from '../design/axe.mjs';
import { consent } from '../../src/data/consent.ts';

const ROOT = resolve(import.meta.dirname, '../..');
const DIST = join(ROOT, 'dist');
// Inside the repo, not the OS temp dir: Astro moves the built assets into outDir with rename(), which
// fails across file systems (EXDEV on the CI container, where /tmp is another mount)
const OUT = join(ROOT, '.consent-dist');
const GTM_ID = 'GTM-TEST0000';
const GTM_JS = 'https://www.googletagmanager.com/gtm.js';
// The three home pages and a reading page (light surface)
const PAGES = ['/', '/en', '/vi', '/privacy'];
const WIDTHS = [375, 1280];
const MAX_TABS = 400;

const MARKERS = ['data-consent-config', 'googletagmanager'];
const optional = consent.categories.filter((c) => !c.required);

/** Pages of a build that carry the banner or GTM. @param {string} dir */
export function pagesWithConsent(dir) {
  return readdirSync(dir, { recursive: true })
    .map(String)
    .filter((f) => f.endsWith('.html') && MARKERS.some((m) => readFileSync(join(dir, f), 'utf8').includes(m)))
    .sort();
}

function build(out) {
  try {
    execFileSync('npx', ['astro', 'build', '--outDir', out], {
      cwd: ROOT,
      env: { ...process.env, PUBLIC_GTM_ID: GTM_ID, CONSENT_ALLOW_DRAFT: '1' },
      stdio: 'pipe',
    });
  } catch (e) {
    const err = /** @type {{ stdout?: Buffer, stderr?: Buffer }} */ (e);
    console.error(`${err.stdout ?? ''}${err.stderr ?? ''}`.split('\n').slice(-30).join('\n'));
    throw new Error(`the build with PUBLIC_GTM_ID=${GTM_ID} failed`);
  }
}

/** dataLayer entries, gtag's arguments objects turned into arrays. @param {import('puppeteer-core').Page} page */
const dataLayer = (page) =>
  page.evaluate(() => {
    const layer = /** @type {any} */ (window).dataLayer;
    if (layer === undefined) return undefined;
    return /** @type {unknown[]} */ (layer).map((e) => (Object.prototype.toString.call(e) === '[object Arguments]' ? Array.from(/** @type {any} */ (e)) : e));
  });

/** @param {import('puppeteer-core').Page} page */
const axeViolations = async (page) => {
  await page.evaluate(axe.source);
  return page.evaluate(
    (tags) =>
      /** @type {any} */ (window).axe
        .run(document, { runOnly: { type: 'tag', values: tags }, resultTypes: ['violations'] })
        .then((/** @type {any[]} */ r) => /** @type {any} */ (r).violations.map((/** @type {any} */ v) => `${v.id} (${v.nodes.length})`)),
    TAGS,
  );
};

/** What the page shows. @param {import('puppeteer-core').Page} page */
const state = (page) =>
  page.evaluate(() => {
    const banner = document.querySelector('[data-consent-config] section');
    const dialog = document.getElementById('consent-dialog');
    const active = document.activeElement;
    return {
      banner: banner instanceof HTMLElement && !banner.hidden && banner.getBoundingClientRect().height > 0,
      dialog: dialog instanceof HTMLDialogElement && dialog.open,
      focusInBanner: !!banner?.contains(active),
      focusInDialog: !!dialog?.contains(active),
      focusOnMain: active?.id === 'main',
      // Past the dialog's last control, Tab goes to the browser's own UI (the page behind is inert):
      // document.body here. Anything else outside the dialog means focus reached the page behind it.
      focusBehindDialog: !!dialog?.open && !!active && active !== document.body && !dialog.contains(active),
      focusOn: active?.getAttribute('data-consent-open') ?? null,
      h1: document.querySelectorAll('h1').length,
      switches: Object.fromEntries([...(dialog?.querySelectorAll('input[role="switch"]:not(:disabled)') ?? [])].map((s) => [/** @type {HTMLInputElement} */ (s).name, /** @type {HTMLInputElement} */ (s).checked])),
      overflow: document.documentElement.scrollWidth - window.innerWidth,
    };
  });

/** Consent commands in the dataLayer, as [command, params]. @param {unknown[] | undefined} layer */
export const consentCommands = (layer) => (layer ?? []).filter((e) => Array.isArray(e) && e[0] === 'consent').map((e) => [e[1], e[2]]);

/**
 * @param {import('puppeteer-core').Browser} browser
 * @param {string} origin
 * @param {string} path
 * @returns {Promise<string[]>}
 */
async function check(browser, origin, path) {
  const out = [];
  const fail = (/** @type {string} */ m) => out.push(m);
  const context = await browser.createBrowserContext();
  const page = await context.newPage();
  await page.setViewport({ width: 1280, height: 860 });
  await page.setRequestInterception(true);
  /** @type {string[]} */
  let requests = [];
  page.on('request', (req) => {
    const url = req.url();
    if (!offSite([url], origin).length) return void req.continue();
    requests.push(url);
    if (url.startsWith(`${GTM_JS}?`)) void req.respond({ status: 200, contentType: 'application/javascript', body: '' });
    else void req.abort();
  });
  const load = async () => {
    requests = [];
    await page.goto(`${origin}${path}`, { waitUntil: 'networkidle0' });
  };
  const gtmRequests = () => requests.filter((u) => u === `${GTM_JS}?id=${GTM_ID}`);

  // First load
  await load();
  let s = await state(page);
  if (!s.banner) fail('first load: the banner is not shown');
  if (requests.length) fail(`first load: requested off-site: ${requests.join(', ')}`);
  if ((await dataLayer(page)) !== undefined) fail('first load: there is a dataLayer before any choice');
  if (s.h1 !== 1) fail(`first load: ${s.h1} h1 elements`);
  for (const v of await axeViolations(page)) fail(`axe with the banner: ${v}`);
  for (const width of WIDTHS) {
    await page.setViewport({ width, height: 860 });
    const { overflow } = await state(page);
    if (overflow > 0) fail(`${width}px: ${overflow}px wider than the viewport`);
  }
  await page.setViewport({ width: 1280, height: 860 });

  // Keyboard: Tab reaches the banner, its 偏好設定 opens the dialog
  let reached = false;
  for (let i = 0; i < MAX_TABS && !reached; i++) {
    await page.keyboard.press('Tab');
    reached = (await state(page)).focusInBanner;
  }
  if (!reached) fail(`no banner button within ${MAX_TABS} Tab presses`);
  await page.focus('[data-consent-config] section [data-consent-open]');
  await page.keyboard.press('Enter');
  s = await state(page);
  if (!s.dialog) fail('Enter on 偏好設定 did not open the dialog');
  if (!s.focusInDialog) fail('the dialog opened without focus inside it');
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press('Tab');
    if ((await state(page)).focusBehindDialog) {
      fail('Tab reached the page behind the open dialog');
      break;
    }
  }
  for (const v of await axeViolations(page)) fail(`axe with the dialog open: ${v}`);
  await page.keyboard.press('Escape');
  s = await state(page);
  if (s.dialog) fail('Esc did not close the dialog');
  if (s.focusOn !== 'consent-dialog') fail('after Esc, focus is not back on 偏好設定');

  // 全部拒絕
  await page.click('[data-consent-config] section [data-consent-action="reject"]');
  s = await state(page);
  if (s.banner) fail('全部拒絕: the banner is still shown');
  if (!s.focusOnMain) fail('全部拒絕: focus did not move to <main>');
  await load();
  if ((await state(page)).banner) fail('after 全部拒絕 and a reload, the banner shows again');
  if (requests.length) fail(`after 全部拒絕: requested off-site: ${requests.join(', ')}`);

  // The footer's Cookie 設定: grant one category
  const [first] = optional;
  await page.click('footer [data-consent-open="consent-dialog"]');
  s = await state(page);
  if (!s.dialog) fail('the footer button did not open the dialog');
  if (Object.values(s.switches).some(Boolean)) fail(`after 全部拒絕 the dialog shows switches on: ${JSON.stringify(s.switches)}`);
  await page.click(`#consent-dialog-${first.id}`);
  await page.click('#consent-dialog [data-consent-action="save"]');
  await page.waitForNetworkIdle();
  if (gtmRequests().length !== 1) fail(`granting ${first.id}: gtm.js requested ${gtmRequests().length} times`);
  const others = requests.filter((u) => !u.startsWith(GTM_JS));
  if (others.length) fail(`granting ${first.id}: also requested ${others.join(', ')}`);
  const commands = consentCommands(await dataLayer(page));
  const update = commands.find(([c]) => c === 'update')?.[1] ?? {};
  if (commands[0]?.[0] !== 'default') fail('the consent default is not the first consent command');
  for (const c of consent.categories) {
    const expected = c.required || c.id === first.id ? 'granted' : 'denied';
    for (const t of c.consentTypes) if (update[t] !== expected) fail(`consent update: ${t} is ${update[t]}, expected ${expected}`);
  }

  // Taking it back reloads the page, which then loads nothing
  await page.click('footer [data-consent-open="consent-dialog"]');
  s = await state(page);
  if (!s.switches[first.id]) fail(`reopened, the dialog does not show ${first.id} on`);
  await page.click(`#consent-dialog-${first.id}`);
  requests = [];
  await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle0' }), page.click('#consent-dialog [data-consent-action="save"]')]);
  if (requests.length) fail(`after taking ${first.id} back: requested off-site: ${requests.join(', ')}`);
  await context.close();

  // 全部接受 on the banner, from scratch
  const fresh = await browser.createBrowserContext();
  const second = await fresh.newPage();
  await second.setRequestInterception(true);
  /** @type {string[]} */
  const loaded = [];
  second.on('request', (req) => {
    const url = req.url();
    if (!offSite([url], origin).length) return void req.continue();
    loaded.push(url);
    if (url.startsWith(`${GTM_JS}?`)) void req.respond({ status: 200, contentType: 'application/javascript', body: '' });
    else void req.abort();
  });
  await second.goto(`${origin}${path}`, { waitUntil: 'networkidle0' });
  await second.click('[data-consent-config] section [data-consent-action="accept"]');
  await second.waitForNetworkIdle();
  if (!loaded.includes(`${GTM_JS}?id=${GTM_ID}`)) fail('全部接受 did not load gtm.js');
  await fresh.close();
  return out;
}

async function main() {
  // /design-system shows the component: its script names GTM, but its previews have no config, so it
  // never loads it
  const unexpected = pagesWithConsent(DIST).filter((f) => f !== 'design-system.html');
  for (const f of unexpected) console.log(`dist/${f}: has the consent banner or GTM without PUBLIC_GTM_ID`);

  const out = OUT;
  rmSync(out, { recursive: true, force: true });
  let failing = unexpected.length ? 1 : 0;
  try {
    build(out);
    const server = await serve(out);
    const { port } = /** @type {import('node:net').AddressInfo} */ (server.address());
    const origin = `http://localhost:${port}`;
    const executablePath = process.env.CHROME_PATH || process.env.CHROME_BIN;
    const chrome = executablePath ? { executablePath } : { channel: /** @type {const} */ ('chrome') };
    const browser = await puppeteer.launch({ ...chrome, headless: true, args: ['--no-sandbox'] });
    try {
      for (const path of PAGES) {
        const found = await check(browser, origin, path);
        for (const p of found) console.log(`${path}: ${p}`);
        if (found.length) failing++;
      }
    } finally {
      await browser.close();
      server.close();
    }
  } finally {
    rmSync(out, { recursive: true, force: true });
  }
  console.log(`no banner or GTM in dist/ (${unexpected.length} pages with one); ${PAGES.length} pages checked with ${GTM_ID}, ${failing} with problems`);
  if (failing) process.exitCode = 1;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) await main();
