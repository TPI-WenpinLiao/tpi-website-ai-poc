// Tests for the pure helpers in scripts/design/a11y-smoke.mjs (the browser checks need a build).
// Run: npm run test:scripts

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { minimumRatio, worstContrast } from './a11y-smoke.mjs';

test('minimumRatio: 3:1 for large text, 4.5:1 otherwise (WCAG 2.2)', () => {
  assert.equal(minimumRatio(24, 400), 3);
  assert.equal(minimumRatio(19, 700), 3);
  assert.equal(minimumRatio(19, 400), 4.5);
  assert.equal(minimumRatio(16, 700), 4.5);
});

test('worstContrast finds the least contrasting pixel inside the rect only', () => {
  // 3×1 RGB image: black, white, black; white text
  const image = { data: Uint8Array.from([0, 0, 0, 255, 255, 255, 0, 0, 0]), width: 3, height: 1, channels: 3 };
  assert.equal(worstContrast(image, { x: 0, y: 0, w: 1, h: 1 }, [255, 255, 255]).toFixed(2), '21.00');
  assert.equal(worstContrast(image, { x: 0, y: 0, w: 3, h: 1 }, [255, 255, 255]).toFixed(2), '1.00');
});
