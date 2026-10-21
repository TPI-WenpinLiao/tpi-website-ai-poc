// Tests for scripts/design/dist-css.mjs. Run: npm run test:scripts

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findTimelineShorthands } from './dist-css.mjs';

test('flags animation shorthands that carry scroll(), view() or a named timeline', () => {
  const css =
    '.a{animation:linear both x scroll(root)}.b{animation:linear both y view()}.c{animation:linear both z --stack}';
  assert.deepEqual(findTimelineShorthands(css), ['linear both x scroll(root)', 'linear both y view()', 'linear both z --stack']);
});

test('allows longhands and time-based shorthands that use var()', () => {
  const css =
    '.a{animation-name:x;animation-timeline:view();animation-range:cover 50%}' +
    '.b{animation:calc(var(--duration-slow) * 5) var(--ease-standard) infinite alternate ui-pulse}';
  assert.deepEqual(findTimelineShorthands(css), []);
});
