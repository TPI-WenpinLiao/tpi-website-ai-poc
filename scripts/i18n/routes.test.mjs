// routeProblems in scripts/i18n/routes.mjs: the dist-level check of the ADR 0002 locale rules.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { externalPaths, routeProblems, urlPath } from './routes.mjs';

const page = (lang, switcher = '') => `<!doctype html><html lang="${lang}"><body>${switcher}</body></html>`;
const switcher = (...links) =>
  `<nav class="locale-switcher"><ul>${links.map(([href, lang]) => `<li><a href="${href}" lang="${lang}">x</a></li>`).join('')}</ul></nav>`;

test('urlPath maps dist files to URL paths', () => {
  assert.equal(urlPath('index.html'), '/');
  assert.equal(urlPath('en.html'), '/en');
  assert.equal(urlPath('vi/blog/post.html'), '/vi/blog/post');
  assert.equal(urlPath('products\\digirunner.html'), '/products/digirunner');
});

test('pages in their own locale with working switcher links pass', () => {
  const pages = new Map([
    ['/', page('zh-TW', switcher(['/', 'zh-TW'], ['/en', 'en']))],
    ['/en', page('en', switcher(['/', 'zh-TW'], ['/en', 'en']))],
    ['/design-system', page('zh-TW', switcher(['#demo', 'en']))],
  ]);
  assert.deepEqual(routeProblems(pages), []);
});

test('a zh-TW fallback page under /en fails', () => {
  assert.deepEqual(routeProblems(new Map([['/en/about', page('zh-TW')]])), ['/en/about: <html lang="zh-TW">, expected en']);
});

test('switcher links to unbuilt pages or with the wrong lang fail', () => {
  const pages = new Map([
    ['/', page('zh-TW')],
    ['/about', page('zh-TW', switcher(['/en/about', 'en'], ['/', 'vi']))],
  ]);
  assert.deepEqual(routeProblems(pages), [
    '/about: locale switcher links to /en/about, which was not built',
    '/about: locale switcher link / has lang="vi"',
  ]);
});

test('site links on an en page must stay under /en where /en has the page, except language links and external sub-sites', () => {
  const body = '<a href="/en/about">ok</a><a href="/about">bad</a><a href="/" hreflang="zh-TW">lang</a><a href="/tpu">tpu</a><a href="/en#x">ok</a>';
  const pages = new Map([['/en', page('en', body)], ['/en/about', page('en')], ['/about', page('zh-TW')]]);
  assert.deepEqual(routeProblems(pages, new Set(['/tpu'])), ['/en: links to /about, outside its locale en, which has the page']);
});

test('an untranslated page is linked in zh-TW; an en or vi link to a page that was not built fails', () => {
  const body = '<a href="/privacy">fallback</a><a href="/vi/privacy">missing</a><a href="/industries">zh-TW page not built yet</a>';
  const pages = new Map([['/vi', page('vi', body)], ['/privacy', page('zh-TW')]]);
  assert.deepEqual(routeProblems(pages), ['/vi: links to /vi/privacy, which was not built']);
});

test('file links are not locale pages but must exist in dist', () => {
  const body = '<a href="/pdf/guide%20v1.pdf">ok</a><a href="/pdf/gone.pdf">missing</a>';
  const pages = new Map([['/en/download/x', page('en', body)]]);
  assert.deepEqual(routeProblems(pages, new Set(), new Set(['/pdf/guide v1.pdf'])), ['/en/download/x: links to the file /pdf/gone.pdf, which is not in dist']);
});

test('external sub-sites come from nodes.csv kind external', () => {
  const csv = 'id,parent,title,template,kind,path,note\nhome,,首頁,home,page,/,\ntpu,home,昕力大學,,external,/tpu,\n';
  assert.deepEqual([...externalPaths(csv)], ['/tpu']);
});
