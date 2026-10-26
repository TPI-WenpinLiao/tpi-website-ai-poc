// Checks every built page with a VideoFacade (M6-03, #35): the first load requests nothing outside the
// site, and the keyboard alone starts the video. Per page, with every off-site request blocked and
// recorded: load the page, fail on any off-site request; Tab to the first facade button, press Enter,
// then the facade must hold a player (iframe or video) with a title, and the player must have focus.
// Part of `npm run check`, after the build: node scripts/design/video-facade.mjs
// Uses CHROME_PATH (set by the SessionStart hook), else CHROME_BIN (set on GitHub's runners), else the installed Chrome.

import { readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer-core';
import { serve } from '../lib/static-server.mjs';
import { urlPath } from '../i18n/routes.mjs';

const DIST = resolve(import.meta.dirname, '../../dist');
const MARKER = 'data-video-facade';
// Tab presses before giving up on reaching a facade button
const MAX_TABS = 400;

/**
 * Requests that leave the site: anything but the page's own origin, data: and blob: URLs.
 * @param {string[]} urls
 * @param {string} origin
 */
export const offSite = (urls, origin) => urls.filter((u) => !u.startsWith('data:') && !u.startsWith('blob:') && new URL(u).origin !== origin);

/**
 * @typedef {{ tag: string, title: string, focused: boolean } | null} Player
 * @param {{ loadRequests: string[], reached: boolean, player: Player }} result
 * @returns {string[]}
 */
export function problems({ loadRequests, reached, player }) {
  const out = loadRequests.map((u) => `requested on load: ${u}`);
  if (!reached) return [...out, `no facade button within ${MAX_TABS} Tab presses`];
  if (!player) return [...out, 'Enter on the button did not add an iframe or video'];
  if (!player.title.trim()) out.push(`the ${player.tag} has no title`);
  if (!player.focused) out.push(`the ${player.tag} does not have focus`);
  return out;
}

/** @param {import('puppeteer-core').Page} page @param {string} url @param {string} origin */
async function check(page, url, origin) {
  /** @type {string[]} */
  const requests = [];
  const record = (/** @type {import('puppeteer-core').HTTPRequest} */ req) => {
    requests.push(req.url());
    // Nothing off-site is fetched, before or after the click
    if (offSite([req.url()], origin).length) req.abort();
    else req.continue();
  };
  page.on('request', record);
  await page.goto(url, { waitUntil: 'networkidle0' });
  const loadRequests = offSite(requests, origin);

  let reached = false;
  for (let i = 0; i < MAX_TABS && !reached; i++) {
    await page.keyboard.press('Tab');
    reached = await page.evaluate((m) => document.activeElement?.matches(`[${m}] button`) ?? false, MARKER);
  }
  /** @type {Player} */
  let player = null;
  if (reached) {
    const root = await page.evaluateHandle((m) => document.activeElement?.closest(`[${m}]`), MARKER);
    await page.keyboard.press('Enter');
    // A <template>'s content is not part of the document, so only a swapped-in player matches
    player = await root.evaluate((el) => {
      const live = el?.querySelector('iframe, video');
      if (!live) return null;
      return { tag: live.tagName.toLowerCase(), title: live.getAttribute('title') ?? '', focused: document.activeElement === live };
    });
  }
  page.off('request', record);
  return problems({ loadRequests, reached, player });
}

async function main() {
  const paths = readdirSync(DIST, { recursive: true })
    .map(String)
    .filter((f) => f.endsWith('.html') && readFileSync(join(DIST, f), 'utf8').includes(MARKER))
    .map(urlPath)
    .sort();
  const server = await serve(DIST);
  const { port } = /** @type {import('node:net').AddressInfo} */ (server.address());
  const origin = `http://localhost:${port}`;
  const executablePath = process.env.CHROME_PATH || process.env.CHROME_BIN;
  const chrome = executablePath ? { executablePath } : { channel: /** @type {const} */ ('chrome') };
  const browser = await puppeteer.launch({ ...chrome, headless: true, args: ['--no-sandbox'] });
  let failing = 0;
  try {
    for (const path of paths) {
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 860 });
      await page.setRequestInterception(true);
      const found = await check(page, `${origin}${path}`, origin);
      await page.close();
      for (const p of found) console.log(`${path}: ${p}`);
      if (found.length) failing++;
    }
  } finally {
    await browser.close();
    server.close();
  }
  console.log(`${paths.length} pages with a video facade checked, ${failing} with problems`);
  if (failing) process.exitCode = 1;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) await main();
