// Live (non-reduced) screenshots of t-gateway at given scroll fractions of the page or of a scene.
// node live.mjs <outPrefix> <width> <height> <spec...>   spec = "y:<px>" | "gate:<p>" | "mod:<p>" | "logo:<p>" | "cases"
import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
const [prefix, w, h, ...specs] = process.argv.slice(2);
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: +w, height: +h } });
const errs = [];
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errs.push(`${m.type()}: ${m.text()}`); });
page.on('pageerror', (e) => errs.push('pageerror: ' + e.message));
page.on('request', (r) => { if (!r.url().startsWith('file:')) errs.push('external: ' + r.url()); });
await page.goto(pathToFileURL(resolve('docs/strategy/concepts/t-gateway/index.html')).href);
await page.waitForFunction(() => document.querySelector('.is-ready') || !document.documentElement.classList.contains('motion'), null, { timeout: 60000 });
console.log('classes', await page.evaluate(() => document.documentElement.className));
for (const [i, spec] of specs.entries()) {
  const [k, v] = spec.split(':');
  const y = await page.evaluate(([k, v]) => {
    const sel = { gate: '.gate', mod: '[data-scene="t-gateway-modules"]', logo: '[data-scene="t-gateway-logo"]', cases: '#cases' }[k];
    if (k === 'y') return +v;
    const el = document.querySelector(sel);
    const top = el.getBoundingClientRect().top + scrollY;
    if (k === 'cases') return top;
    if (k === 'logo') return top - innerHeight + (el.offsetHeight) * +v;
    return top + (el.offsetHeight - innerHeight) * +v;
  }, [k, v]);
  await page.evaluate((y) => window.scrollTo(0, y), y);
  await page.waitForTimeout(1500); await page.evaluate(() => document.fonts.ready);
  const file = `${prefix}-${String(i).padStart(2, '0')}-${spec.replace(':', '')}.png`;
  await page.screenshot({ path: file });
  console.log(file, Math.round(y), JSON.stringify(await page.evaluate(() => window.__tg?.state())));
}
console.log(errs.join('\n'));
await browser.close();
