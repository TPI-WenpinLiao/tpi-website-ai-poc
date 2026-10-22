// hreflangAlternates in src/lib/seo/hreflang.ts: the hreflang and x-default rules in ADR 0002.
// Node strips the types.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { localeLinks } from '../../src/lib/i18n/alternates.ts';
import { hreflangAlternates } from '../../src/lib/seo/hreflang.ts';

const site = new URL('https://example.com');
const alternates = (path, routes) => hreflangAlternates(localeLinks({ path, routes: new Set(routes) }), site).map((a) => `${a.hreflang} ${a.href}`);

test('a page in every locale lists all three versions and x-default to zh-TW', () => {
  const routes = ['/', '/about', '/en', '/en/about', '/vi', '/vi/about'];
  const expected = [
    'zh-TW https://example.com/about',
    'en https://example.com/en/about',
    'vi https://example.com/vi/about',
    'x-default https://example.com/about',
  ];
  assert.deepEqual(alternates('/about', routes), expected);
  // Every version lists the same set, so each link is answered by the page it points at
  assert.deepEqual(alternates('/en/about', routes), expected);
});

test('an untranslated page lists only itself, not the locale homes the switcher falls back to', () => {
  assert.deepEqual(alternates('/about', ['/', '/about', '/en']), ['zh-TW https://example.com/about', 'x-default https://example.com/about']);
});

test('a page without a zh-TW version has no x-default', () => {
  assert.deepEqual(alternates('/vi/blog/x', ['/', '/vi', '/vi/blog/x']), ['vi https://example.com/vi/blog/x']);
});

test('the home page uses the root and locale prefixes without a trailing slash', () => {
  assert.deepEqual(alternates('/', ['/', '/en']), ['zh-TW https://example.com/', 'en https://example.com/en', 'x-default https://example.com/']);
});
