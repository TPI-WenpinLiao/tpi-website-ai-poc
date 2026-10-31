// Tests for scripts/strategy/facts.mjs. Run: npm run test:scripts

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bodyCopy, checkPage, copyStrings, factCalls, markdownPage, numbers, quoteOnPage, validateFacts } from './facts.mjs';

const entry = (over = {}) => ({
  id: 'smartclaim-result',
  type: 'case',
  text: '節省逾80%​人工作業時間',
  source: { url: 'https://www.tpisoftware.com/', quote: '節省逾80%人工作業時間' },
  locale: 'zh-TW',
  status: 'confirmed',
  ...over,
});

const library = (...list) => new Map(list.map((f) => [f.id, f]));
const facts = library(
  entry(),
  entry({ id: 'smartclaim-result-en', text: 'reducing manual effort by 80%', locale: 'en' }),
  entry({ id: 'client-cathay', type: 'client', text: 'Cathay United Bank', locale: 'en' }),
  entry({ id: 'pending-award', type: 'award', text: '2025 award', status: 'to_confirm', note: 'possibly outdated' }),
);
const page = (over) => ({ name: 'home', locale: 'zh-TW', strings: [], uses: [], ...over });

test('validateFacts accepts a valid library and names the entry and field of each problem', () => {
  assert.deepEqual(validateFacts([entry()]), []);
  const errors = validateFacts([entry(), entry({ type: 'rumour', source: { url: 'http://x' }, extra: 1 })]);
  assert.ok(errors.some((e) => /entry 2 \(smartclaim-result\) type/.test(e)));
  assert.ok(errors.some((e) => /source\.url/.test(e)));
  assert.ok(errors.some((e) => /source\.quote/.test(e)));
  assert.ok(errors.some((e) => /extra|Unrecognized/.test(e)));
  assert.match(validateFacts([entry({ status: 'to_confirm' })])[0], /entry 1 \(smartclaim-result\) note: a to_confirm fact needs a note/);
  assert.deepEqual(validateFacts([entry({ status: 'to_confirm', note: 'license unclear' })]), []);
  // Duplicates are reported once every entry is valid
  assert.match(validateFacts([entry(), entry()])[0], /entry 2 \(smartclaim-result\) id: duplicate id smartclaim-result/);
  assert.notDeepEqual(validateFacts({}), []);
});

test('numbers folds full-width digits and drops thousands separators', () => {
  assert.deepEqual(numbers('節省逾80%人工'), ['80%']);
  assert.deepEqual(numbers('ＮＴ$1,200 and 3.5x, ８０％'), ['1200', '3.5', '80%']);
  assert.deepEqual(numbers('四個產品家族'), []);
});

test('a number in the copy fails unless a fact the page uses has it', () => {
  assert.equal(checkPage(page({ strings: ['服務超過 500 家企業'] }), facts).length, 1);
  assert.match(checkPage(page({ strings: ['節省逾90%人工'], uses: ['smartclaim-result'] }), facts)[0], /90% .* none of the page's facts/);
  assert.deepEqual(checkPage(page({ strings: ['節省逾80%​人工作業時間'], uses: ['smartclaim-result'] }), facts), []);
  // A bare number is covered by the same number with %, not the other way round
  assert.deepEqual(checkPage(page({ strings: ['80 的人工'], uses: ['smartclaim-result'] }), facts), []);
  assert.equal(checkPage(page({ strings: ['8%'], uses: ['smartclaim-result'] }), facts).length, 1);
});

test('a client name in the copy fails unless a fact the page uses has it', () => {
  const en = (over) => page({ locale: 'en', ...over });
  assert.match(checkPage(en({ strings: ['Trusted by cathay united bank'] }), facts)[0], /client Cathay United Bank/);
  assert.deepEqual(checkPage(en({ strings: ['Trusted by Cathay United Bank'], uses: ['client-cathay'] }), facts), []);
  // Clients of another locale are not looked for
  assert.deepEqual(checkPage(page({ strings: ['Cathay United Bank'] }), facts), []);
});

test('a page only uses confirmed facts that exist, in its own locale', () => {
  assert.match(checkPage(page({ uses: ['nope'] }), facts)[0], /nope is not in/);
  assert.match(checkPage(page({ uses: ['pending-award'] }), facts)[0], /to_confirm/);
  assert.match(checkPage(page({ uses: ['smartclaim-result-en'] }), facts)[0], /is en, the page is zh-TW/);
  // site.ts has no locale and may use any
  assert.deepEqual(checkPage(page({ locale: undefined, uses: ['smartclaim-result-en'] }), facts), []);
});

test('copyStrings skips functions, ids, paths and URLs', () => {
  const mod = { home: { node: 'case-2024', title: '標題', link: '/blog/2024-x', ext: 'https://x/1', all: (x) => `所有${x}`, list: ['一', { translationKey: 'k1' }] } };
  assert.deepEqual(copyStrings(mod), ['標題', '一']);
});

test('factCalls finds every fact id in a TypeScript source, not in comments', () => {
  assert.deepEqual(factCalls(`title: fact('a-1'),\n  x: fact( "b" ), y: notfact('c')`), ['a-1', 'b']);
  assert.deepEqual(factCalls(`// through fact('<id>')\n/* fact('x') */\nconst t = fact('c');`), ['c']);
});

test('markdownPage checks original entries and entries with facts, not verbatim migrations', () => {
  const md = (front, body = '') => `---\n${front}\n---\n${body}`;
  const name = 'src/content/hub/zh-TW/x.md';
  assert.equal(markdownPage(name, md('title: 標題 2024\nsourceUrl: https://www.tpisoftware.com/x\nmigratedAt: 2026-01-01')), null);

  const original = markdownPage(name, md('title: 標題\nsourceUrl: []\nnode: x-1', '提升 30% 效率\n\n![圖](../../assets/a-2024.png)'));
  assert.equal(original.locale, 'zh-TW');
  assert.deepEqual(original.uses, []);
  assert.equal(checkPage(original, facts).length, 1);

  const rewritten = markdownPage(name, md('title: 標題\nsourceUrl: https://www.tpisoftware.com/x\nmigratedAt: 2026-01-01\nfacts: [smartclaim-result]', '節省逾80%人工'));
  assert.deepEqual(rewritten.uses, ['smartclaim-result']);
  assert.deepEqual(checkPage(rewritten, facts), []);
});

test('bodyCopy drops code, tags and link targets', () => {
  assert.equal(bodyCopy('見[案例](/case/2024)與 `v2` <img src="a1.png"> 文字').replace(/\s+/g, ' '), '見[案例]與 文字');
});

test('quoteOnPage ignores tags, whitespace and U+200B', () => {
  const html = '<h3>AI</h3>\n<h3>智慧理賠</h3><p>節省逾<b>80%</b>人工</p>';
  assert.ok(quoteOnPage(html, 'AI 智慧​理賠'));
  assert.ok(quoteOnPage(html, '節省逾80%人工'));
  assert.ok(!quoteOnPage(html, '節省逾90%人工'));
});
