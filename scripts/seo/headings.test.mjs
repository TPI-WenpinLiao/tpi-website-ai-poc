// Tests for scripts/seo/headings.mjs. Run: npm run test:scripts

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { headingProblems } from './headings.mjs';

test('accepts one h1 and levels that step down one at a time or go back up', () => {
  assert.deepEqual(headingProblems('<h1>a</h1><h2>b</h2><h3>c</h3><h4>d</h4><h2>e</h2><h3>f</h3>'), []);
});

test('reports a missing or repeated h1', () => {
  assert.deepEqual(headingProblems('<h2>a</h2>'), ['expected 1 h1, found 0']);
  assert.deepEqual(headingProblems('<h1>a</h1><h1>b</h1>'), ['expected 1 h1, found 2']);
});

test('reports skipped levels going down', () => {
  assert.deepEqual(headingProblems('<h1>a</h1><h2>b</h2><h4>deep</h4>'), ['h2 → h4 skips a level at "deep"']);
});
