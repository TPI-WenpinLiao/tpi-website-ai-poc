// Tests for scripts/design/header-surface.mjs. Run: npm run test:scripts

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cssToHex, expectedSurface, focusProblems, stopProblems } from './header-surface.mjs';

test('the header is dark only while a band crosses the bar\'s bottom pixel row', () => {
  assert.equal(expectedSurface([], 64), 'light');
  assert.equal(expectedSurface([{ top: 200, bottom: 900 }], 64), 'light');
  assert.equal(expectedSurface([{ top: -100, bottom: 400 }], 64), 'dark');
  // A band starting right at the header's bottom edge isn't under it yet
  assert.equal(expectedSurface([{ top: 64, bottom: 900 }], 64), 'light');
  assert.equal(expectedSurface([{ top: 63, bottom: 900 }], 64), 'dark');
  // A band that ended above it no longer counts
  assert.equal(expectedSurface([{ top: -900, bottom: 63 }], 64), 'light');
  // With an InPageNav stuck under the header the line is the nav's bottom edge
  assert.equal(expectedSurface([{ top: 100, bottom: 900 }], 64 + 52), 'dark');
  assert.equal(expectedSurface([{ top: 100, bottom: 900 }], 64), 'light');
});

test('cssToHex reads computed rgb() and rgba() colors', () => {
  assert.equal(cssToHex('rgb(56, 24, 80)'), '#381850');
  assert.equal(cssToHex('rgba(255, 255, 255, 0.5)'), '#ffffff');
  assert.equal(cssToHex('rgb(18 15 29)'), '#120f1d');
  assert.throws(() => cssToHex('transparent'), /not an rgb/);
});

test('a stop fails on the wrong surface and on low text contrast', () => {
  const ok = { actual: 'dark', expected: 'dark', text: 'rgb(255, 255, 255)', bg: 'rgb(56, 24, 80)' };
  assert.deepEqual(stopProblems(ok), []);
  assert.match(stopProblems({ ...ok, actual: 'light' })[0] ?? '', /is light, expected dark/);
  assert.match(stopProblems({ ...ok, actual: undefined })[0] ?? '', /is unset/);
  assert.match(stopProblems({ ...ok, actual: 'light', name: 'in-page nav' })[0] ?? '', /^in-page nav is light/);
  assert.match(stopProblems({ ...ok, text: 'rgb(118, 118, 118)', bg: 'rgb(56, 24, 80)' })[0] ?? '', /below 4\.5:1/);
});

test('the focus ring has to show and reach 3:1 on the header', () => {
  assert.deepEqual(focusProblems({ style: 'solid', color: 'rgb(255, 122, 69)', bg: 'rgb(56, 24, 80)' }), []);
  assert.deepEqual(focusProblems({ style: 'none', color: 'rgb(0, 0, 0)', bg: 'rgb(255, 255, 255)' }), ['no focus outline']);
  assert.match(focusProblems({ style: 'solid', color: 'rgb(79, 35, 112)', bg: 'rgb(56, 24, 80)' })[0] ?? '', /below 3:1/);
});
