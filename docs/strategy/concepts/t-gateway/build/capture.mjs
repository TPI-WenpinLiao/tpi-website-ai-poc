// Renders the stills of t-gateway from the live scene (README「靜態圖」) into the direction's assets/.
// node .taste-skill/t-gateway/capture.mjs
import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { writeFileSync } from 'node:fs';
const DIR = 'docs/strategy/concepts/t-gateway/assets';
const SHOTS = [
  ['poster-hero', 1600, 1000], ['still-hero', 1600, 1000], ['phone-hero', 900, 860], ['still-industries', 1600, 800],
  ['still-products', 1600, 1100], ['still-logo', 1200, 1000], ['door-fin', 840, 300], ['door-gov', 840, 300], ['case-claim', 800, 600], ['case-filing', 800, 600], ['case-fraud', 800, 600],
];
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
page.on('pageerror', (e) => console.error('pageerror', e.message));
await page.goto(pathToFileURL(resolve(DIR, '../index.html')).href);
await page.waitForSelector('.is-ready', { timeout: 60000 });
for (const [name, w, h] of SHOTS) {
  const url = await page.evaluate(([n, w, h]) => window.__tg.capture(n, w, h, 0.86), [name, w, h]);
  const buf = Buffer.from(url.split(',')[1], 'base64');
  writeFileSync(`${DIR}/${name}.webp`, buf);
  const tags = name === 'still-hero' || name === 'phone-hero' ? await page.evaluate(() => window.__tg.project(window.__tg.tagAt())) : '';
  console.log(name, w, h, Math.round(buf.length / 1024) + ' KB', url.slice(5, 15), tags ? JSON.stringify(tags.map((p) => p.map((v) => +(v * 100).toFixed(1)))) : '');
}
await browser.close();
