// Unit tests for the problems policy-dialog.mjs reports. Run with `npm run test:scripts`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { problems } from './policy-dialog.mjs';

const OK = {
  policy: '/privacy',
  onLoad: 0,
  opened: { modal: true, focusInside: true, blocks: 20, loadingShown: false, pageScrolls: false },
  violations: [],
  closed: { open: false, focusOnLink: true, value: '王小明' },
  fetches: 1,
  backdropClosed: true,
  narrow: { dialogWidth: 343, viewport: 375 },
  noJs: '/privacy',
};

test('a dialog that behaves has no problems', () => {
  assert.deepEqual(problems(OK), []);
});

test('each broken behavior is reported', () => {
  const found = problems({
    policy: '/privacy',
    onLoad: 1,
    opened: { modal: false, focusInside: false, blocks: 0, loadingShown: true, pageScrolls: true },
    violations: ['aria-dialog-name: dialog'],
    closed: { open: true, focusOnLink: false, value: '' },
    fetches: 2,
    backdropClosed: false,
    narrow: { dialogWidth: 400, viewport: 375 },
    noJs: '/contact-us',
  });
  assert.equal(found.length, 14);
  assert.ok(found.includes('axe in the open dialog: aria-dialog-name: dialog'));
});
