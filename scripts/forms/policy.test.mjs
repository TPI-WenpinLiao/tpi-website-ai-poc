// Unit tests for which clicks on the privacy policy link open the dialog (src/lib/forms/policy.ts).
// Run with `npm run test:scripts`.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { opensInDialog } from '../../src/lib/forms/policy.ts';

const PLAIN = { button: 0, ctrlKey: false, metaKey: false, shiftKey: false, altKey: false, defaultPrevented: false };

test('a plain primary click opens the dialog', () => {
  assert.equal(opensInDialog(PLAIN), true);
});

test('modified, middle and already handled clicks keep the link behaviour', () => {
  for (const change of [{ button: 1 }, { ctrlKey: true }, { metaKey: true }, { shiftKey: true }, { altKey: true }, { defaultPrevented: true }]) {
    assert.equal(opensInDialog({ ...PLAIN, ...change }), false, JSON.stringify(change));
  }
});
