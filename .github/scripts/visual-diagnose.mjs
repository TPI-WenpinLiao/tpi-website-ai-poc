// TEMPORARY (#24): prints what the visual regression depends on, to compare CI with the cloud session.
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { chromium } from '@playwright/test';
import { serve } from '../../scripts/lib/static-server.mjs';

const sh = (c) => { try { return execSync(c, { encoding: 'utf8' }).trim(); } catch (e) { return `ERR ${e.message.split('\n')[0]}`; } };
const hash = (f) => createHash('sha256').update(readFileSync(f)).digest('hex').slice(0, 12);
console.log('dist/templates/content.html', hash('dist/templates/content.html'));
console.log('dist/index.html', hash('dist/index.html'));
console.log('css', readdirSync('dist/_astro').filter((f) => f.endsWith('.css')).sort().join(' '));
console.log('woff2', readdirSync('dist/_astro').filter((f) => f.endsWith('.woff2')).length);
for (const q of ['sans-serif:lang=zh-tw', 'sans-serif:lang=vi', 'sans-serif', 'system-ui', 'Inter', 'monospace', 'Noto Sans TC', 'PingFang TC']) console.log('fc-match', q, '→', sh(`fc-match "${q}"`));
console.log('families', sh('fc-list : family | sort -u | tr "\\n" "|"'));
const server = await serve(`${process.cwd()}/dist`);
const { port } = server.address();
const browser = await chromium.launch();
console.log('chromium', browser.version());
const page = await browser.newPage({ viewport: { width: 768, height: 900 }, reducedMotion: 'reduce', locale: 'zh-TW' });
await page.goto(`http://127.0.0.1:${port}/templates/content`, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
console.log('height', await page.evaluate(() => document.documentElement.scrollHeight));
console.log('fonts loaded', await page.evaluate(() => [...document.fonts].filter((f) => f.status === 'loaded').map((f) => `${f.family}/${f.weight}`).join(', ')));
const cdp = await page.context().newCDPSession(page);
await cdp.send('DOM.enable');
await cdp.send('CSS.enable');
const { root } = await cdp.send('DOM.getDocument', { depth: -1 });
const { nodeIds } = await cdp.send('DOM.querySelectorAll', { nodeId: root.nodeId, selector: 'h1, h2, h3, p, li, a, span, button' });
const seen = new Map();
const perNode = [];
for (const [i, nodeId] of nodeIds.entries()) {
  const { fonts } = await cdp.send('CSS.getPlatformFontsForNode', { nodeId }).catch(() => ({ fonts: [] }));
  if (fonts.length) perNode.push(`${i}:${fonts.map((f) => `${f.familyName}${f.isCustomFont ? '*' : ''}=${f.glyphCount}`).join('+')}`);
  for (const f of fonts) seen.set(`${f.familyName}${f.isCustomFont ? ' (web)' : ''}`, (seen.get(`${f.familyName}${f.isCustomFont ? ' (web)' : ''}`) ?? 0) + f.glyphCount);
}
console.log('platform fonts', JSON.stringify(Object.fromEntries(seen)));
console.log('per node', perNode.join(' '));
console.log('env', JSON.stringify({ lang: process.env.LANG, lc: process.env.LC_ALL, tz: process.env.TZ, nproc: sh('nproc'), kernel: sh('uname -r'), cpu: sh('grep -m1 "model name" /proc/cpuinfo'), avx512: sh('grep -c avx512f /proc/cpuinfo') }));
console.log('rects', await page.evaluate(() => [...document.querySelectorAll('main p, main h2, main h3, main li')].map((e, i) => `${i}:${Math.round(e.getBoundingClientRect().width)}x${Math.round(e.getBoundingClientRect().height * 10) / 10}`).join(' ')));
const boxes = await page.evaluate(() => [...document.querySelectorAll('main > *, main section, header, footer')].map((e) => `${e.tagName.toLowerCase()}.${[...e.classList][0] ?? ''}:${Math.round(e.getBoundingClientRect().height * 10) / 10}`).join(' '));
console.log('boxes', boxes);
await browser.close();
server.close();
