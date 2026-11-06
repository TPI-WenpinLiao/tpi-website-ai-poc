// Tests for scripts/strategy/facts.mjs. Run: npm run test:scripts

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bodyCopy, checkPage, checkStrategyDoc, copyStrings, cutAtPunctuation, factCalls, fixTypos, markdownPage, numbers, standaloneStrings, validateFacts, wording } from './facts.mjs';

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
  // text may trim the quote but not change its numbers
  assert.match(validateFacts([entry({ text: '節省逾90%人工作業時間' })])[0], /smartclaim-result: 90% in text is not in source.quote/);
});

test('a readable text may add punctuation and line breaks to the quote, not words (#186)', () => {
  const stage = entry({ id: 'stage', text: '', source: { url: 'https://www.tpisoftware.com/', quote: '2019 第一階段 公開資訊開放 開放商品資訊， 如：匯率、房貸利息等。' } });
  assert.deepEqual(validateFacts([{ ...stage, text: '2019 第一階段：公開資訊開放。開放商品資訊，如：匯率、房貸利息等。' }]), []);
  assert.deepEqual(validateFacts([{ ...stage, text: '2019 第一階段\n公開資訊開放\n開放商品資訊' }]), []);
  assert.deepEqual(validateFacts([entry({ text: '節省逾80%' })]), []);
  assert.match(validateFacts([{ ...stage, text: '2019 年第一階段：公開資訊開放' }])[0], /stage: text changes or adds words/);
  assert.match(validateFacts([{ ...stage, text: '2019 第一階段：公開資訊全面開放' }])[0], /stage: text changes or adds words/);
  // to_confirm facts never reach a page, so their text may still label a table's columns
  assert.deepEqual(validateFacts([{ ...stage, text: '比較：2019 第一階段', status: 'to_confirm', note: 'comparison' }]), []);
});

test('wording drops spaces, break points and punctuation, folding full-width', () => {
  assert.equal(wording('整合性： 一站式平台，開箱即用'), wording('整合性 一站式平台，開箱即用'));
  assert.equal(wording('ＡＰＩ​Log'), 'APILog');
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

test('copyStrings skips the ids of linked entries (#202: a section linking news 559), but not copy under those keys', () => {
  assert.deepEqual(copyStrings({ label: '聯盟的新聞', news: 'zh-TW/559', caseStudy: 'zh-TW/case-2024' }), ['聯盟的新聞']);
  assert.deepEqual(copyStrings({ news: { title: '服務 80 家企業' } }), ['服務 80 家企業']);
  assert.deepEqual(copyStrings({ news: '服務 80 家企業' }), ['服務 80 家企業']);
});

test('copyStrings skips blog and news dates, which the yaml parser leaves as strings', () => {
  assert.deepEqual(copyStrings({ title: '標題', publishedAt: '2026-11-03', updatedAt: '2026-11-04' }), ['標題']);
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

test('bodyCopy drops code, tags, link targets and ordered-list markers', () => {
  assert.equal(bodyCopy('導入步驟：\n\n1. 盤點需求\n2) 建置平台\n  10. 上線').replace(/\s+/g, ' ').trim(), '導入步驟： 盤點需求 建置平台 上線');
  const page = markdownPage('src/content/hub/zh-TW/x.md', '---\ntitle: 測試\nsourceUrl: []\nfacts: []\n---\n\n1. 盤點需求\n2. 建置平台\n');
  assert.deepEqual(checkPage(page, facts), []);
  assert.equal(bodyCopy('見[案例](/case/2024)與 `v2` <img src="a1.png"> 文字').replace(/\s+/g, ' '), '見[案例]與 文字');
});

test('a strategy document cites confirmed zh-TW facts, and pending ones only under a missing-evidence heading', () => {
  const doc = (md) => checkStrategyDoc('messaging.md', md, facts).errors;
  assert.deepEqual(doc('## 價值主張\n\n- 省人力：`fact:smartclaim-result`'), []);
  assert.match(doc('## 價值主張\n\n- `fact:nope`')[0], /messaging\.md:3: fact nope is not in/);
  assert.match(doc('- `fact:smartclaim-result-en`')[0], /is en, the document is zh-TW/);
  assert.match(doc('## 價值主張\n\n- `fact:pending-award`')[0], /to_confirm; cite it only under/);
  // Allowed under a 缺少證據 or 待確認 heading, including its subsections, until a sibling heading ends it
  assert.deepEqual(doc('## 缺少證據的主張\n\n### 得獎\n\n- `fact:pending-award`'), []);
  assert.deepEqual(doc('## 待確認\n\n- `fact:pending-award`'), []);
  assert.equal(doc('## 缺少證據的主張\n\n## 證據對照\n\n- `fact:pending-award`').length, 1);
  // A heading inside a code fence is not a heading (citations in fences are still checked)
  assert.equal(doc('## 缺少證據\n\n```\n## x\n```\n- `fact:pending-award`').length, 0);
  // A citation in a heading is checked too
  assert.match(doc('## 價值主張 `fact:nope`')[0], /messaging\.md:1: fact nope is not in/);
  // Plain backticked ids (paths, nodes, labels) are not citations
  assert.deepEqual(checkStrategyDoc('b.md', '`industry-finance` `pending-award`', facts).cited, []);
});

test('a trimmed text is cut at punctuation, or marked partial with a note (#214)', () => {
  const faq = entry({ id: 'faq', type: 'feature', text: 'GreenSwift 支援顧問公司使用。', source: { url: 'https://www.tpisoftware.com/', quote: '是的，GreenSwift 支援顧問公司使用。顧問可以登入系統。' } });
  assert.deepEqual(validateFacts([faq]), []);
  // The site writes a space for a comma between two Han characters
  const title = entry({ id: 'title', type: 'company', text: '聯盟成軍，主打整合式交付', source: { url: 'https://www.tpisoftware.com/', quote: '聯盟成軍 主打整合式交付 加速導入' } });
  assert.deepEqual(validateFacts([title]), []);
  const cut = entry({ id: 'cut', type: 'company', text: '開放自研軟體產品原始碼', source: { url: 'https://www.tpisoftware.com/', quote: '不僅開放自研軟體產品原始碼' } });
  assert.match(validateFacts([cut])[0], /cut: text is cut out of source.quote mid-sentence/);
  assert.match(validateFacts([{ ...cut, partial: true }])[0], /\(cut\) note: a partial fact needs a note/);
  assert.deepEqual(validateFacts([{ ...cut, partial: true, note: 'drops 不僅' }]), []);
  // en: a space is not a break
  const en = entry({ id: 'en', type: 'feature', locale: 'en', text: 'Ready-to-use console', source: { url: 'https://tpi.dev/', quote: 'Ready-to-use console with proven adoption.' } });
  assert.match(validateFacts([en])[0], /en: text is cut out of source.quote mid-sentence/);
  // to_confirm facts never reach pages
  assert.deepEqual(validateFacts([{ ...cut, status: 'to_confirm', note: 'license' }]), []);
});

test('cutAtPunctuation tries every place the text occurs and needs a break at both ends', () => {
  assert.equal(cutAtPunctuation('系統', '系統管理，系統', 'zh-TW'), true);
  assert.equal(cutAtPunctuation('系統管', '系統管理，系統', 'zh-TW'), false);
  assert.equal(cutAtPunctuation('主權 AI', '主權 AI 產業', 'zh-TW'), false);
  assert.equal(cutAtPunctuation('A, B', 'A, B, C', 'en'), true);
});

test('a text may fix only the typos in TYPOS (#214)', () => {
  const ipaas = entry({ id: 'ipaas', type: 'feature', text: '可在地雲混合環境中部署。', source: { url: 'https://www.tpisoftware.com/', quote: '可在地雲混和環境中佈署。' } });
  assert.equal(fixTypos('地雲混和環境中佈署'), '地雲混合環境中部署');
  assert.deepEqual(validateFacts([ipaas]), []);
  assert.deepEqual(validateFacts([{ ...ipaas, text: '可在地雲混和環境中部署。' }]), []);
  assert.match(validateFacts([{ ...ipaas, text: '可在雲地混合環境中部署。' }])[0], /ipaas: text changes or adds words/);
});

test('a partial fact is never a whole item or hero point on a page (#214)', () => {
  const half = entry({ id: 'half', type: 'feature', text: '此次產品組合結合自研軟體與地端硬體', partial: true, note: 'half a news sentence' });
  const lib = library(half);
  assert.match(checkPage(page({ uses: ['half'], standalone: ['此次產品組合結合自研軟體與地端硬體'] }), lib)[0], /whole text of partial fact half/);
  assert.match(checkPage(page({ uses: ['half'], standalone: ['此次產品組合，結合自研軟體與地端硬體。'] }), lib)[0], /partial fact half/);
  // Inside a sentence, as a label or not used at all: fine
  assert.deepEqual(checkPage(page({ uses: ['half'], standalone: ['給企業：此次產品組合結合自研軟體與地端硬體'] }), lib), []);
  assert.deepEqual(checkPage(page({ uses: [], standalone: ['此次產品組合結合自研軟體與地端硬體'] }), lib), []);
});

test('standaloneStrings finds hero points and item bodies at any depth', () => {
  const data = {
    tagline: 't',
    heroPoints: ['a', { text: 'b', note: 'n' }],
    sections: [{ heading: 'h', items: [{ title: 'x', body: 'c' }, { body: 'd' }], rows: [{ label: 'l', values: ['v'] }] }],
  };
  assert.deepEqual(standaloneStrings(data), ['a', 'b', 'c', 'd']);
  assert.deepEqual(markdownPage('src/content/offering/zh-TW/p.md', '---\nsourceUrl: []\nheroPoints:\n  - a\n---\n').standalone, ['a']);
});
