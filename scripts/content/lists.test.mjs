// Fact texts as lists (#200, #225): src/lib/content/lists.ts. Part of `npm run test:scripts`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { factList, textWidth } from '../../src/lib/content/lists.ts';

test('Han and full-width punctuation count 1, Latin ½', () => {
  assert.equal(textWidth('風險評估'), 4);
  assert.equal(textWidth('ISO 27001'), 4.5);
  assert.equal(textWidth('評估：'), 3);
});

test('a text of five lines or more is a list, led by a line ending in a colon', () => {
  assert.equal(factList('一\n二\n三\n四'), undefined);
  const list = factList('適用：\n銀行\n證券\n保險\n票券');
  assert.equal(list?.lead, '適用：');
  assert.deepEqual(list?.items, ['銀行', '證券', '保險', '票券']);
});

test('short words stay a two-column list; an item longer than 8 characters makes it long', () => {
  assert.equal(factList('銀行\n證券\n保險\n票券\nAWS Cloud')?.long, false);
  assert.equal(factList('銀行\n證券\n保險\n票券\n定期盤點作業及風險評估')?.long, true);
});
