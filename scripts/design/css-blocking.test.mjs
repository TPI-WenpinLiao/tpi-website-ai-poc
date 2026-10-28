import assert from 'node:assert/strict';
import { test } from 'node:test';
import { usedBytes } from './css-blocking.mjs';

test('usedBytes sums the coverage ranges per stylesheet URL', () => {
  const coverage = [
    { url: 'http://x/a.css', text: '', ranges: [{ start: 0, end: 10 }, { start: 20, end: 25 }] },
    { url: 'http://x/page', text: '', ranges: [{ start: 0, end: 3 }] },
    { url: 'http://x/page', text: '', ranges: [{ start: 5, end: 9 }] },
  ];
  assert.deepEqual([...usedBytes(coverage)], [
    ['http://x/a.css', 15],
    ['http://x/page', 7],
  ]);
});
