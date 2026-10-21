// Tests for scripts/design/import-image.mjs. Run: npm run test:scripts

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseArgs } from './import-image.mjs';

test('parseArgs pairs sources with names', () => {
  assert.deepEqual(parseArgs(['a.png', 'hero-data-flow', 'b.png', 'cover-data']), [
    { source: 'a.png', name: 'hero-data-flow' },
    { source: 'b.png', name: 'cover-data' },
  ]);
});

test('parseArgs rejects odd arguments and names that are not lowercase kebab-case', () => {
  assert.throws(() => parseArgs([]), /usage/);
  assert.throws(() => parseArgs(['a.png']), /usage/);
  assert.throws(() => parseArgs(['a.png', 'Hero.webp']), /lowercase/);
});
