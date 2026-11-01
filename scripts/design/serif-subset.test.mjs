import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseRanges, pickSlices, serialize, serifChars } from './serif-subset.mjs';

test('serifChars reads headings and .serif, folds whitespace to one space', () => {
  const html = '<h1>金融\n  業</h1><p>內文</p><span class="serif">A1</span><h4>不算</h4>';
  assert.equal(serialize(serifChars(html)), ' 1A業融金');
});

test('parseRanges reads single code points and ranges', () => {
  assert.deepEqual(parseRanges('U+3401, U+3d18-3d19'), [
    [0x3401, 0x3401],
    [0x3d18, 0x3d19],
  ]);
});

test('pickSlices returns the slices that cover the characters and what no slice covers', () => {
  const unicode = { '[0]': 'U+91d1', '[1]': 'U+878d', latin: 'U+0000-00FF' };
  assert.deepEqual(pickSlices(['金', 'A', '🚀'], unicode), { slices: ['0', 'latin'], missing: ['🚀'] });
});
