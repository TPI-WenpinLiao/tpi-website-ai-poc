// routeProblems in scripts/i18n/routes.mjs: the dist-level check of the ADR 0002 locale rules.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { routeProblems, urlPath } from './routes.mjs';

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
