// Tests for scripts/search/pagefind.mjs. Run: npm run test:scripts

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { foreign, problems } from './pagefind.mjs';

const OK = {
  counts: [
    { lang: 'zh-tw', indexed: 133, built: 133 },
    { lang: 'en', indexed: 122, built: 122 },
  ],
  queries: [{ q: '企業', found: 53, min: 30 }],
  locales: [{ search: '/en/search', found: 23, foreign: [] }],
  loads: [{ path: '/', requests: [] }],
  keyboard: { field: true, results: 10, result: true, moreFocus: true },
  axe: [{ path: '/search?q=企業', violations: [] }],
  list: { liveRegion: true, repeated: [], ordered: true, retried: true, researched: true },
};

test('a search that behaves has no problems', () => {
  assert.deepEqual(problems(OK), []);
});

test('index counts that differ from the built pages, or a missing index, are reported', () => {
  const found = problems({
    ...OK,
    counts: [
      { lang: 'zh-tw', indexed: 120, built: 133 },
      { lang: 'vi', indexed: undefined, built: 146 },
    ],
  });
  assert.deepEqual(found, ['the zh-tw index has 120 pages, 133 built pages have data-pagefind-body', 'no vi index in pagefind-entry.json (146 pages to index)']);
});

test('a zh-TW query under its floor, other-locale results and /pagefind/ requests are reported', () => {
  const found = problems({
    ...OK,
    queries: [{ q: '企業', found: 7, min: 30 }],
    locales: [{ search: '/en/search', found: 2, foreign: ['/about-us'] }],
    loads: [{ path: '/about-us', requests: ['http://localhost:1/pagefind/pagefind.js'] }],
  });
  assert.deepEqual(found, [
    'zh-TW "企業" found 7 pages, at least 30 expected',
    '/en/search links to another locale: /about-us',
    '/about-us requested http://localhost:1/pagefind/pagefind.js',
  ]);
});

test('the keyboard failing at any step is reported once, at the first step that fails', () => {
  assert.match(problems({ ...OK, keyboard: { field: false, results: 0, result: false, moreFocus: false } })[0], /no search field/);
  assert.deepEqual(problems({ ...OK, keyboard: { field: true, results: 0, result: false, moreFocus: false } }), ['/search: typing in the field showed no results']);
  assert.match(problems({ ...OK, keyboard: { field: true, results: 10, result: false, moreFocus: false } })[0], /no result link/);
  assert.deepEqual(problems({ ...OK, keyboard: { field: true, results: 10, result: true, moreFocus: false } }), ['/search: Enter on 顯示更多結果 did not move focus to result 11']);
});

test('axe violations are reported per search state', () => {
  assert.deepEqual(problems({ ...OK, axe: [{ path: '/search?q=企業', violations: ['color-contrast (2)'] }] }), ['/search?q=企業: axe color-contrast (2)']);
});

test('foreign() keeps the URLs outside a locale: zh-TW is every URL without /en or /vi', () => {
  const urls = ['/about-us', '/en/about-us', '/vi', '/vietnam', '/en'];
  assert.deepEqual(foreign(urls, ''), ['/en/about-us', '/vi', '/en']);
  assert.deepEqual(foreign(urls, '/en'), ['/about-us', '/vi', '/vietnam']);
});

test('a hidden live region and results listed twice are reported', () => {
  assert.deepEqual(problems({ ...OK, list: { liveRegion: false, repeated: ['/about-us'], ordered: false, retried: false, researched: false } }), [
    '/search: the empty role="status" region is display: none, out of the accessibility tree',
    '/search: two clicks on 顯示更多結果 listed /about-us twice',
    '/search: after a page of results failed to load, the status line did not say so or the next click did not add results 11-20',
    '/search: after the first page of results failed to load, sending the query again did not show results',
    "/search: after two clicks on 顯示更多結果 with slow responses, the first 30 results are not in Pagefind's order",
  ]);
});
