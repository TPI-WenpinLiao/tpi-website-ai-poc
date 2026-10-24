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

test('site links on an en page must stay under /en, except language links and external sub-sites', () => {
  const body = '<a href="/en/about">ok</a><a href="/about">bad</a><a href="/" hreflang="zh-TW">lang</a><a href="/tpu">tpu</a><a href="/en#x">ok</a>';
  const pages = new Map([['/en', page('en', body)]]);
  assert.deepEqual(routeProblems(pages, new Set(['/tpu'])), ['/en: links to /about, outside its locale en']);
});

test('links to downloadable files are not locale pages', () => {
  const body = '<a href="/upload/guide.pdf">pdf</a><a href="/products/x.html">page</a>';
  assert.deepEqual(routeProblems(new Map([['/en', page('en', body)]])), ['/en: links to /products/x.html, outside its locale en']);
});

test('Chinese text on an en or vi page fails, except inside a zh-TW lang element', () => {
  const body =
    '<p>Hello</p><p>TPIsoftware <span lang="ja">株式會社</span></p><p>聯絡我們</p><img src="a.png" alt="圖"><a href="/" hreflang="zh-TW" lang="zh-TW">中文</a><span title="a｜b">x</span><script>"不算"</script>';
  const head = '<meta name="description" content="說明">';
  const html = `<!doctype html><html lang="vi"><head>${head}</head><body>${body}</body></html>`;
  assert.deepEqual(routeProblems(new Map([['/vi', html]])), [
    '/vi: Chinese meta description="說明"',
    '/vi: Chinese text "聯絡我們"',
    '/vi: Chinese img alt="圖"',
    '/vi: Chinese span title="a｜b"',
  ]);
  assert.deepEqual(routeProblems(new Map([['/', html.replace('lang="vi"', 'lang="zh-TW"')]])), []);
});

test('external sub-sites come from nodes.csv kind external', () => {
  const csv = 'id,parent,title,template,kind,path,note\nhome,,首頁,home,page,/,\ntpu,home,昕力大學,,external,/tpu,\n';
  assert.deepEqual([...externalPaths(csv)], ['/tpu']);
});
