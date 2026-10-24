// Tests for scripts/content/legal-pdf.mjs. Run: npm run test:scripts

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { blocks, english, englishMarkdown, markdown, plain, textLines } from './legal-pdf.mjs';

const convert = (text, options) => markdown(blocks(textLines(text).lines, options));

test('drops the title line and page numbers', () => {
  const { title, lines } = textLines('隱私權聲明\n\n第一段。\n   1\n\f第二段。');
  assert.equal(title, '隱私權聲明');
  assert.deepEqual(lines.filter(Boolean), ['第一段。', '第二段。']);
});

test('splits Chinese and English paragraphs and joins wrapped lines', () => {
  const md = convert('標題\n昕力資訊重視並尊重您的個人隱私。為保障\n您的權益，告知下列事項：\nTPIsoftware values\nyour privacy:\n');
  assert.equal(md, '昕力資訊重視並尊重您的個人隱私。為保障您的權益，告知下列事項：\n\nTPIsoftware values your privacy:\n');
});

test('a Chinese line that is mostly Latin stays in its paragraph', () => {
  const md = convert('標題\n適用於關係企業（包含 TPIsoftware Company Limited、\nTPIsoftware PTE. LTD、TPIsoftware CO., LTD.、Alpaca Vietnam Company\nLimited 及子公司）。\n');
  assert.equal(md.split('\n\n').length, 1);
});

test('a section title takes the English title on the next line', () => {
  assert.equal(convert('標題\n3. 個人資料利用之期間\nPeriod of Personal Data Use\n'), '## 3. 個人資料利用之期間 Period of Personal Data Use\n');
});

test('list items keep their translation and wrapped lines', () => {
  const md = convert('標題\n l 查詢您的個人資料。\n   Inquire about your personal data.\n  l ○六三 非公務機關之蒐集 Collection, processing,\n     and use of personal data\n');
  assert.equal(md, '- 查詢您的個人資料。\n\n  Inquire about your personal data.\n\n- ○六三 非公務機關之蒐集 Collection, processing, and use of personal data\n');
});

test('a page break between a list item and its translation keeps the translation in the item', () => {
  const md = convert('標題\n l 請求停止利用您的個人資料。\n\f\n   Request to discontinue use of your personal data.\n l 請求刪除。\n   Request deletion.\n');
  assert.equal(md, '- 請求停止利用您的個人資料。\n\n  Request to discontinue use of your personal data.\n\n- 請求刪除。\n\n  Request deletion.\n');
});

test('a page break inside a sentence does not split the paragraph', () => {
  assert.equal(convert('標題\nno Content may be publicly\n\nrecited in any way.\n'), 'no Content may be publicly recited in any way.\n');
});

test('punctuation on a line of its own joins the line before', () => {
  assert.equal(convert('標題\n您不得使用「深層連結」\n                  、\n「網頁擷取」。\n'), '您不得使用「深層連結」、「網頁擷取」。\n');
});

test('clause numbers: short titles become h3, clauses stay paragraphs', () => {
  const md = convert('標題\n四、政策內容\n4.1   資訊安全及隱私政策\n4.1.1 依營運要求提供管理指導方針及\n支持。\n4.10.1\n確保資訊安全。\n');
  assert.equal(md, '## 四、政策內容\n\n### 4.1 資訊安全及隱私政策\n\n4.1.1 依營運要求提供管理指導方針及支持。\n\n4.10.1 確保資訊安全。\n');
});

test('without numbered headings, "1. …" lines form an ordered list', () => {
  const md = convert('標題\n二、依據\n1. ISO/IEC 27001:2022 (Information security and\nprivacy protection)\n2. 個人資料保護法\n', { numberedHeadings: false });
  assert.equal(md, '## 二、依據\n\n1. ISO/IEC 27001:2022 (Information security and privacy protection)\n2. 個人資料保護法\n');
});

test('plain() strips only the Markdown added by the conversion', () => {
  const md = convert('標題\n## 不是標題 a_b\n l 項目\n');
  assert.equal(plain(md), '##不是標題a_b項目');
});

test('english() keeps the English half: paragraphs, translations, bilingual titles and coded items', () => {
  const text = [
    '標題',
    '1. 個人資料蒐集之目的',
    'Purposes of Personal Data Collection',
    '昕力資訊重視您的隱私。',
    '',
    'TPIsoftware values your privacy.',
    ' l ○一三 公共關係 Public Relations',
    ' l Ｃ○一一 個人描述 Personal description',
    ' l 查詢您的個人資料。',
    '   Inquire about your personal data.',
    ' l 利用對象：昕力資訊及其關係企業（包含 TPIsoftware 株式會社）。',
    '   Target Entities of Use: TPIsoftware and its affiliates (including TPIsoftware 株式會社).',
    '',
  ].join('\n');
  const en = english(blocks(textLines(text).lines));
  assert.deepEqual(en.map((b) => [b.kind, b.text]), [
    ['h2', '1. Purposes of Personal Data Collection'],
    ['p', 'TPIsoftware values your privacy.'],
    ['item', '013 Public Relations'],
    ['item', 'C011 Personal description'],
    ['item', 'Inquire about your personal data.'],
    ['item', 'Target Entities of Use: TPIsoftware and its affiliates (including TPIsoftware 株式會社).'],
  ]);
  // The number and code are not part of what is checked against the PDF
  assert.deepEqual(en.slice(0, 3).map((b) => b.source), ['Purposes of Personal Data Collection', 'TPIsoftware values your privacy.', 'Public Relations']);
  assert.match(englishMarkdown(en), /TPIsoftware <span lang="ja">株式會社<\/span>\)\.$/m);
});
