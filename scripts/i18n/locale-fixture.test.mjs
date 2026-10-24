// Pure parts of scripts/i18n/locale-fixture.mjs: the placeholder copy and the name check.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { fillGlossary, homeSource, nameProblems, stringsSource } from './locale-fixture.mjs';

test('strings take glossary values and turn {n} into the function parameter', () => {
  const zh = { menu: '選單', listing: { pageSuffix: (n) => `（第 ${n} 頁）` }, pages: { blog: '部落格' } };
  const names = new Map([['ui:menu', 'Menu'], ['ui:listing.pageSuffix', ' (page {n})']]);
  const src = stringsSource(zh, names, 'en');
  assert.match(src, /"menu": "Menu"/);
  assert.match(src, /"pageSuffix": \(n: number\) => ` \(page \$\{n\}\)`/);
  assert.match(src, /"blog": "\[en\] pages.blog"/);
});

test('home copy keeps sources and node ids', () => {
  const src = homeSource({ hero: { title: { text: '標題', source: { url: 'https://x' } } }, cases: [{ node: 'smartclaim' }] }, 'vi');
  assert.match(src, /"text": "\[vi\] hero.title.text"/);
  assert.match(src, /"url": "https:\/\/x"/);
  assert.match(src, /"node": "smartclaim"/);
});

test('empty glossary cells get a placeholder', () => {
  assert.deepEqual(fillGlossary([{ id: 'node:a', en: '' }, { id: 'node:b', en: 'B' }], 'en'), [{ id: 'node:a', en: '[en] node:a' }, { id: 'node:b', en: 'B' }]);
});

test('Han characters outside lang-marked elements and missing header labels are reported', () => {
  const page = (header, crumb = '') =>
    `<html lang="en"><body><header class="site-header">${header}<a lang="zh-TW">中文</a></header><nav class="breadcrumb">${crumb}</nav></body></html>`;
  const pages = new Map([
    ['/en', page('Products')],
    ['/en/about', page('Products', 'Home 關於我們')],
    ['/about', page('產品')],
  ]);
  assert.deepEqual(nameProblems(pages, 'en', ['Products', 'Company']), [
    '/en/about: <nav class="breadcrumb"> shows 關於我們',
    '/en: header does not show Company',
  ]);
});
