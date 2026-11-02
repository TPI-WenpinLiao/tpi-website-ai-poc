// Tests for scripts/strategy/eval-scores.mjs. Run: npm run test:scripts

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkReview, parseReview, score } from './eval-scores.mjs';

const rubric = (name, prefix, scores, heading) =>
  [
    `## ${name}：${heading}`,
    '',
    '| 項目 | 分數 | 理由 |',
    '|---|---|---|',
    ...scores.map((s, i) => `| ${prefix}${i + 1} 某項 | ${s} | 理由 |`),
    '',
  ].join('\n');

const review = (design = '平均 4.2，通過') =>
  [
    '# 評審',
    rubric('設計', 'D', [5, 4, 4, 4, 4, 4], design),
    rubric('文案與行銷', 'C', [4, 4, 4, 4, 4, 4], '平均 4.0，通過'),
    rubric('SEO', 'S', ['不適用', 3, 3, 3, '不適用', 3], '平均 3.0，未通過（S1、S5 不適用）'),
    '## 評審依據不足',
    '| D1 不是分數表 | 1 | x |',
  ].join('\n');

test('parses scores, 不適用 and stops at the next section', () => {
  const sections = parseReview(review());
  assert.deepEqual(
    sections.map((s) => [s.rubric, s.declared, s.items.length]),
    [
      ['設計', 4.2, 6],
      ['文案與行銷', 4, 6],
      ['SEO', 3, 6],
    ],
  );
  assert.equal(sections[2].items[0].score, null);
});

test('averages skip 不適用 and round to one decimal', () => {
  assert.deepEqual(score(parseReview(review())[0].items), { average: 4.2, pass: true, low: [] });
  assert.equal(score(parseReview(review())[2].items).average, 3);
});

test('an item below 3 fails the rubric even with a high average', () => {
  const items = [5, 5, 5, 5, 5, 2].map((s, i) => ({ id: `D${i + 1}`, score: s }));
  assert.deepEqual(score(items), { average: 4.5, pass: false, low: ['D6 = 2'] });
});

test('a heading that disagrees with the scores is reported', () => {
  assert.deepEqual(checkReview('x', parseReview(review())), []);
  assert.deepEqual(checkReview('x', parseReview(review('平均 4.3，通過'))), [
    'x 設計: heading says 4.3, the items average 4.2',
  ]);
  assert.deepEqual(checkReview('x', parseReview(review('平均 4.2，未通過'))), [
    'x 設計: heading says 未通過, the scores say 通過',
  ]);
});

test('a missing rubric or item is reported', () => {
  const short = review().replace('| D6 某項 | 4 | 理由 |\n', '').replace(/## SEO[^#]*/, '');
  assert.deepEqual(checkReview('x', parseReview(short)), [
    'x 設計: items are D1,D2,D3,D4,D5, want D1,D2,D3,D4,D5,D6',
    'x: no「## SEO：平均 …」section',
  ]);
});
