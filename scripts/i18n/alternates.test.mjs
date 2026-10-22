// localeLinks and routeFromPageFile in src/lib/i18n/alternates.ts: the untranslated-page rule in
// ADR 0002. Node strips the types.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { localeLinks, routeFromPageFile } from '../../src/lib/i18n/alternates.ts';

const targets = (links) => links.map(({ locale, href, target, current }) => `${locale} ${href} ${target}${current ? ' current' : ''}`);

test('routeFromPageFile maps page files to URL paths and skips partials and dynamic routes', () => {
  assert.equal(routeFromPageFile('/src/pages/index.astro'), '/');
  assert.equal(routeFromPageFile('/src/pages/en/index.astro'), '/en');
  assert.equal(routeFromPageFile('/src/pages/about.astro'), '/about');
  assert.equal(routeFromPageFile('/src/pages/vi/products/digirunner/index.md'), '/vi/products/digirunner');
  assert.equal(routeFromPageFile('/src/pages/design-system/_TokenGroup.astro'), null);
  assert.equal(routeFromPageFile('/src/pages/blog/[slug].astro'), null);
  assert.equal(routeFromPageFile('/src/pages/blog/page/[n].astro'), null);
});

test('a translated page links to the same page in every locale', () => {
  const routes = new Set(['/', '/about', '/en', '/en/about', '/vi', '/vi/about']);
  assert.deepEqual(targets(localeLinks({ path: '/en/about', routes })), [
    'zh-TW /about page',
    'en /en/about page current',
    'vi /vi/about page',
  ]);
});

test('an untranslated page falls back to that locale home', () => {
  const routes = new Set(['/', '/about', '/en', '/vi', '/vi/about']);
  assert.deepEqual(targets(localeLinks({ path: '/about', routes })), [
    'zh-TW /about page current',
    'en /en home',
    'vi /vi/about page',
  ]);
});

test('a locale without a home is left out', () => {
  const routes = new Set(['/', '/about']);
  assert.deepEqual(targets(localeLinks({ path: '/about', routes })), ['zh-TW /about page current']);
});

test('the current page counts even when routes does not list it (dynamic routes)', () => {
  const routes = new Set(['/', '/en']);
  assert.deepEqual(targets(localeLinks({ path: '/en/blog/some-post.html', routes })), [
    'zh-TW / home',
    'en /en/blog/some-post page current',
  ]);
});
