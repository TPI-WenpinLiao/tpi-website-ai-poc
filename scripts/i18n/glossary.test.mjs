// Tests for scripts/i18n/glossary.mjs. Run: npm run test:scripts

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildRows, flattenStrings, mergeRows, navLabels, toCsv, validate } from './glossary.mjs';

const nodes = [
  { id: 'home', parent: '', title: '首頁', template: 'home' },
  { id: 'products', parent: 'home', title: '產品總覽', template: 'hub' },
  { id: 'family-dx', parent: 'products', title: '數位轉型（DigiLism）', template: 'hub' },
  { id: 'digirunner', parent: 'family-dx', title: 'digiRunner API 管理平台', template: 'offering' },
  { id: 'about', parent: 'home', title: '關於我們', template: 'content' },
  { id: 'blog-post', parent: 'home', title: '文章', template: 'article' },
];
const nav = [
  { area: 'utility', parent: '', node: 'home', label: '（logo）' },
  { area: 'utility', parent: '', node: '', label: '語系切換' },
  { area: 'header', parent: '', node: '', label: '產品' },
  { area: 'header', parent: '產品', node: 'products', label: '產品總覽' },
  { area: 'header', parent: '', node: '', label: '公司' },
  { area: 'header', parent: '公司', node: 'about', label: '' },
];
const pageMap = [
  { url: 'https://www.tpisoftware.com/en/digirunner-api-management', locale: 'en', node: 'digirunner' },
  { url: 'https://www.tpisoftware.com/en/about-us', locale: 'en', node: 'about' },
];
const inventory = [
  { url: 'https://www.tpisoftware.com/en/digirunner-api-management', nav_location: 'footer: API Management | header: Product & Services > Digital Transformation > Enterprise API Management' },
  { url: 'https://www.tpisoftware.com/en/about-us', nav_location: 'header: Company > About Us' },
];
const titles = [{ node: 'about', locale: 'en', title: 'About Us', file: 'src/content/page/en/about.md' }];
const derive = (strings = [['menu', '選單']]) => buildRows({ nodes, nav, strings, pageMap, inventory, titles });

test('flattenStrings renders functions with placeholders and skips page descriptions', () => {
  const rows = flattenStrings({ menu: '選單', pages: { blog: '…' }, listing: { pageSuffix: (n) => `（第 ${n} 頁）` } });
  assert.deepEqual(rows, [['menu', '選單'], ['listing.pageSuffix', '（第 {n} 頁）']]);
});

test('navLabels keeps the shallowest header items and every footer label', () => {
  const labels = navLabels('header: Resources > Success Stories | header: Resources > Success Stories > Finance | footer: Cases');
  assert.deepEqual(labels, { header: ['Success Stories'], footer: ['Cases'] });
  assert.deepEqual(navLabels('not in nav'), { header: [], footer: [] });
});

test('buildRows lists visible nav labels, products, nav pages and strings', () => {
  const rows = derive();
  assert.deepEqual(rows.map((r) => [r.id, r.category]), [
    ['nav:產品', 'nav'],
    ['nav:公司', 'nav'],
    ['node:products', 'page'],
    ['node:family-dx', 'product'],
    ['node:digirunner', 'product'],
    ['node:about', 'page'],
    ['ui:menu', 'ui'],
  ]);
  const about = rows.find((r) => r.id === 'node:about');
  // A content file title comes before the menu label; the same text is listed once
  assert.deepEqual(about['candidates:en'].map((c) => c.text), ['About Us']);
  const digirunner = rows.find((r) => r.id === 'node:digirunner');
  assert.deepEqual(digirunner['candidates:en'].map((c) => c.text), ['Enterprise API Management', 'API Management']);
  assert.equal(digirunner.source, 'https://www.tpisoftware.com/en/digirunner-api-management');
});

test('mergeRows seeds new rows from the current site and keeps edited columns', () => {
  const first = mergeRows([], derive());
  const digirunner = first.find((r) => r.id === 'node:digirunner');
  assert.equal(digirunner.en, 'Enterprise API Management');
  assert.equal(digirunner.vi, '');
  assert.equal(digirunner.status, 'to-confirm');
  assert.equal(digirunner.note, '現站 en 其他寫法：API Management');

  const edited = first.map((r) => (r.id === 'ui:menu' ? { ...r, en: 'Menu', vi: 'Menu', status: 'confirmed', note: 'ok' } : r));
  edited.unshift({ id: 'brand:tpisoftware', category: 'brand', 'zh-TW': '昕力資訊', en: 'TPIsoftware', vi: '', status: 'to-confirm', source: '', note: '' });
  const again = mergeRows(edited, derive());
  assert.equal(toCsv(again), toCsv(mergeRows(again, derive())), 're-running gives the same file');
  assert.equal(again[0].id, 'brand:tpisoftware', 'hand-added rows stay on top');
  assert.deepEqual(again.find((r) => r.id === 'ui:menu'), { ...edited.find((r) => r.id === 'ui:menu') });

  // zh-TW changed: the confirmed translation goes back to to-confirm; removed strings drop out
  const changed = mergeRows(again, derive([['menu', '主選單']]));
  assert.equal(changed.find((r) => r.id === 'ui:menu').status, 'to-confirm');
  assert.equal(changed.find((r) => r.id === 'ui:menu').en, 'Menu');
  assert.equal(mergeRows(again, derive([])).some((r) => r.id === 'ui:menu'), false);
});

test('validate rejects bad rows', () => {
  const ok = { id: 'ui:menu', category: 'ui', 'zh-TW': '選單', en: 'Menu', vi: 'Menu', status: 'confirmed' };
  assert.deepEqual(validate([ok]), []);
  assert.deepEqual(validate([ok, ok]), ['ui:menu: duplicate id']);
  assert.deepEqual(validate([{ ...ok, vi: '' }]), ['ui:menu: a confirmed row needs both en and vi']);
  assert.deepEqual(validate([{ ...ok, status: 'done' }]), ['ui:menu: status must be one of to-confirm, draft, confirmed']);
  assert.deepEqual(validate([{ ...ok, id: 'menu' }]), ['menu: a ui row\'s id starts with ui:']);
  assert.deepEqual(validate([{ ...ok, id: 'x:y', category: 'other' }]), ['x:y: category must be one of brand, term, nav, product, page, ui']);
});
