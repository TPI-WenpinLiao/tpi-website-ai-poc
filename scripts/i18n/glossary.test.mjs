// Tests for scripts/i18n/glossary.mjs. Run: npm run test:scripts

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildRows, flattenStrings, mergeRows, navLabels, stringsMismatches, toCsv, validate } from './glossary.mjs';

const nodes = [
  { id: 'home', parent: '', title: '首頁', template: 'home' },
  { id: 'products', parent: 'home', title: '產品總覽', template: 'hub' },
  { id: 'family-dx', parent: 'products', title: '數位轉型（DigiLism）', template: 'hub' },
  { id: 'digirunner', parent: 'family-dx', title: 'digiRunner API 管理平台', template: 'offering' },
  { id: 'about', parent: 'home', title: '關於我們', template: 'content' },
  { id: 'resources', parent: 'home', title: '資源', template: 'hub' },
  { id: 'whitepaper-digirunner', parent: 'resources', title: 'digiRunner 白皮書', template: 'gated-download' },
  { id: 'whitepaper-digilogs', parent: 'resources', title: 'digiLogs 白皮書', template: 'gated-download' },
  { id: 'blog-post', parent: 'home', title: '文章', template: 'article', kind: 'collection' },
  // Groups and assets show no name, so they get no row
  { id: 'legal', parent: 'home', title: '法務與政策', template: '', kind: 'group' },
  { id: 'aws-guide', parent: 'digirunner', title: '買家指南（PDF）', template: '', kind: 'asset' },
];
const nav = [
  { area: 'utility', parent: '', node: 'home', label: '（logo）' },
  { area: 'utility', parent: '', node: '', label: '語系切換' },
  { area: 'header', parent: '', node: '', label: '產品' },
  { area: 'header', parent: '產品', node: 'products', label: '產品總覽' },
  { area: 'header', parent: '', node: '', label: '公司' },
  { area: 'header', parent: '公司', node: 'about', label: '' },
  // 資源 is the resources node's title, so it is that node's row
  { area: 'header', parent: '', node: '', label: '資源' },
  { area: 'header', parent: '資源', node: 'whitepaper-digirunner', label: '' },
  { area: 'header', parent: '資源', node: 'whitepaper-digilogs', label: '' },
];
const pageMap = [
  { url: 'https://www.tpisoftware.com/en/open-banking', locale: 'en', node: 'digirunner', disposition: 'merge' },
  { url: 'https://www.tpisoftware.com/en/digirunner-api-management', locale: 'en', node: 'digirunner', disposition: 'rewrite' },
  { url: 'https://www.tpisoftware.com/en/about-us', locale: 'en', node: 'about', disposition: 'rewrite' },
  { url: 'https://www.tpisoftware.com/en', locale: 'en', node: 'home', disposition: 'rewrite' },
  { url: 'https://www.tpisoftware.com/en/whitepaper/api-strategies', locale: 'en', node: 'whitepaper-digirunner', disposition: 'rewrite' },
  { url: 'https://www.tpisoftware.com/en/whitepaper/digiLogs', locale: 'en', node: 'whitepaper-digilogs', disposition: 'rewrite' },
];
const inventory = [
  { url: 'https://www.tpisoftware.com/en/digirunner-api-management', nav_location: 'footer: API Management | header: Product & Services > Digital Transformation > Enterprise API Management' },
  { url: 'https://www.tpisoftware.com/en/about-us', nav_location: 'header: Company > About Us' },
  { url: 'https://www.tpisoftware.com/en', nav_location: 'header: (logo)' },
  { url: 'https://www.tpisoftware.com/en/open-banking', nav_location: 'header: Product & Services > Open Banking' },
  { url: 'https://www.tpisoftware.com/en/whitepaper/api-strategies', nav_location: 'header: Resources > digiRunner > White Paper' },
  { url: 'https://www.tpisoftware.com/en/whitepaper/digiLogs', nav_location: 'header: Resources > digiLogs > White Paper' },
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
  // A trailing call-to-action link gives way to the item it sits under
  assert.deepEqual(navLabels('header: Sản Phẩm > Nền tảng digiRunner trên Cloud > Thị trường trực tuyến AWS →').header, ['Nền tảng digiRunner trên Cloud']);
});

test('buildRows lists visible nav labels, every named node and strings', () => {
  const rows = derive();
  assert.deepEqual(rows.map((r) => [r.id, r.category]), [
    ['nav:產品', 'nav'],
    ['nav:公司', 'nav'],
    ['node:home', 'page'],
    ['node:products', 'page'],
    ['node:family-dx', 'product'],
    ['node:digirunner', 'product'],
    ['node:about', 'page'],
    ['node:resources', 'page'],
    ['node:whitepaper-digirunner', 'page'],
    ['node:whitepaper-digilogs', 'page'],
    ['node:blog-post', 'page'],
    ['ui:menu', 'ui'],
  ]);
  // White Paper labels two different nodes, so it is no one's name
  assert.deepEqual(rows.find((r) => r.id === 'node:whitepaper-digirunner')['candidates:en'], []);
  assert.equal(rows.find((r) => r.id === 'node:whitepaper-digirunner').source, 'docs/ia/nodes.csv');
  // The current site's (logo) menu entry is not a name
  assert.deepEqual(rows.find((r) => r.id === 'node:home')['candidates:en'], []);
  const about = rows.find((r) => r.id === 'node:about');
  // A content file title comes before the menu label; the same text is listed once
  assert.deepEqual(about['candidates:en'].map((c) => c.text), ['About Us']);
  const digirunner = rows.find((r) => r.id === 'node:digirunner');
  // Header labels of the node's own page (rewrite) come before the page merged into it, footer labels last
  assert.deepEqual(digirunner['candidates:en'].map((c) => c.text), ['Enterprise API Management', 'Open Banking', 'API Management']);
  assert.equal(digirunner.source, 'https://www.tpisoftware.com/en/digirunner-api-management https://www.tpisoftware.com/en/open-banking');
});

test('mergeRows seeds new rows from the current site and keeps edited columns', () => {
  const first = mergeRows([], derive());
  const digirunner = first.find((r) => r.id === 'node:digirunner');
  assert.equal(digirunner.en, 'Enterprise API Management');
  assert.equal(digirunner.vi, '');
  assert.equal(digirunner.status, 'to-confirm');
  assert.equal(digirunner.note, '現站 en 其他寫法：Open Banking、API Management');

  const edited = first.map((r) => (r.id === 'ui:menu' ? { ...r, en: 'Menu', vi: 'Menu', status: 'confirmed', note: 'ok' } : r));
  edited.unshift({ id: 'brand:tpisoftware', category: 'brand', 'zh-TW': '昕力資訊', en: 'TPIsoftware', vi: '', status: 'to-confirm', source: '', note: '' });
  const again = mergeRows(edited, derive());
  assert.equal(toCsv(again), toCsv(mergeRows(again, derive())), 're-running gives the same file');
  assert.equal(again[0].id, 'brand:tpisoftware', 'hand-added rows stay on top');
  assert.deepEqual(again.find((r) => r.id === 'ui:menu'), { ...edited.find((r) => r.id === 'ui:menu') });

  // zh-TW changed: the translation goes back to to-confirm with the old text noted; removed strings drop out
  const changed = mergeRows(again, derive([['menu', '主選單']]));
  assert.deepEqual(changed.find((r) => r.id === 'ui:menu'), { ...edited.find((r) => r.id === 'ui:menu'), 'zh-TW': '主選單', status: 'to-confirm', note: 'zh-TW 原為「選單」；ok' });
  const draft = again.map((r) => (r.id === 'ui:menu' ? { ...r, status: 'draft', note: '' } : r));
  assert.equal(mergeRows(draft, derive([['menu', '主選單']])).find((r) => r.id === 'ui:menu').status, 'to-confirm');
  assert.equal(mergeRows(again, derive([])).some((r) => r.id === 'ui:menu'), false);
});

test('an existing row keeps the source it was created with', () => {
  const [row] = mergeRows([], derive()).filter((r) => r.id === 'node:digirunner');
  const later = buildRows({ nodes, nav, strings: [], pageMap, inventory, titles: [...titles, { node: 'digirunner', locale: 'en', title: 'digiRunner', file: 'src/content/offering/en/digirunner.md' }] });
  assert.equal(mergeRows([row], later).find((r) => r.id === 'node:digirunner').source, row.source);
});

test('toCsv quotes values with leading or trailing spaces', () => {
  const csv = toCsv([{ id: 'ui:x', en: ' (page {n})', vi: 'Ngôn ngữ: ', note: 'a, b' }]);
  assert.equal(csv.split('\n')[1], 'ui:x,,," (page {n})","Ngôn ngữ: ",,,"a, b"');
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

test('stringsMismatches names interface strings that differ from the glossary', () => {
  const rows = [
    { id: 'ui:menu', vi: 'Menu' },
    { id: 'ui:listing.pageSuffix', vi: ' (trang {n})' },
  ];
  const flat = flattenStrings({ menu: 'Menu', listing: { pageSuffix: (n) => ` (trang ${n})` }, pages: { blog: 'x' } });
  assert.deepEqual(stringsMismatches(rows, 'vi', flat), []);
  assert.deepEqual(stringsMismatches(rows, 'vi', flattenStrings({ menu: 'Danh mục', toc: 'Mục lục' })), [
    'src/data/strings/vi.ts menu: "Danh mục" is not the glossary\'s vi value "Menu"',
    'src/data/strings/vi.ts toc: "Mục lục" is not the glossary\'s vi value ""',
  ]);
});
