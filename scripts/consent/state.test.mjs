// Unit tests for the stored cookie choice and the consent parameters (src/lib/consent/state.ts).
// Run with `npm run test:scripts`.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { STORAGE_KEY, consentParams, makeChoice, readChoice, revokes, wantsGtm, writeChoice } from '../../src/lib/consent/state.ts';

const CATEGORIES = [
  { id: 'necessary', required: true, consentTypes: ['security_storage'] },
  { id: 'analytics', consentTypes: ['analytics_storage'] },
  { id: 'marketing', consentTypes: ['ad_storage', 'ad_user_data'] },
];

const memory = (value) => {
  const data = new Map(value === undefined ? [] : [[STORAGE_KEY, value]]);
  return { getItem: (k) => data.get(k) ?? null, setItem: (k, v) => data.set(k, v), removeItem: (k) => data.delete(k), data };
};

test('a stored choice of the current version is read back, unknown and required ids dropped', () => {
  const stored = JSON.stringify({ version: 2, granted: ['analytics', 'necessary', 'gone', 3], at: '2026-10-28T00:00:00.000Z' });
  assert.deepEqual(readChoice(memory(stored), 2, CATEGORIES), { version: 2, granted: ['analytics'], at: '2026-10-28T00:00:00.000Z' });
});

test('no choice: nothing stored, another version, malformed JSON or data, no storage, a throwing storage', () => {
  const throwing = { getItem: () => { throw new Error('blocked'); } };
  for (const storage of [
    memory(),
    memory(JSON.stringify({ version: 1, granted: [], at: 'x' })),
    memory('{'),
    memory('null'),
    memory(JSON.stringify({ version: 2, granted: 'analytics', at: 'x' })),
    undefined,
    throwing,
  ]) {
    assert.equal(readChoice(storage, 2, CATEGORIES), null);
  }
});

test('writeChoice stores JSON readChoice accepts, and reports a refusing storage', () => {
  const storage = memory();
  const choice = makeChoice(2, CATEGORIES, ['marketing', 'marketing', 'necessary'], new Date('2026-10-28T00:00:00Z'));
  assert.deepEqual(choice.granted, ['marketing']);
  assert.equal(writeChoice(storage, choice), true);
  assert.deepEqual(readChoice(storage, 2, CATEGORIES), choice);
  assert.equal(writeChoice(undefined, choice), false);
});

test('a refused write drops the stored choice, so an older consent is not read back', () => {
  const granted = makeChoice(2, CATEGORIES, ['analytics']);
  const storage = memory(JSON.stringify(granted));
  const full = { ...storage, setItem: () => { throw new Error('quota'); } };
  assert.equal(writeChoice(full, makeChoice(2, CATEGORIES, [])), false);
  assert.equal(readChoice(storage, 2, CATEGORIES), null);
  const locked = { setItem: () => { throw new Error('quota'); }, removeItem: () => { throw new Error('blocked'); } };
  assert.equal(writeChoice(locked, granted), false);
});

test('consentParams: required types always granted, the rest only for granted categories', () => {
  assert.deepEqual(consentParams(CATEGORIES, []), {
    security_storage: 'granted',
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
  });
  assert.deepEqual(consentParams(CATEGORIES, ['marketing']), {
    security_storage: 'granted',
    analytics_storage: 'denied',
    ad_storage: 'granted',
    ad_user_data: 'granted',
  });
});

test('GTM loads only after an optional category is granted', () => {
  assert.equal(wantsGtm(CATEGORIES, null), false);
  assert.equal(wantsGtm(CATEGORIES, makeChoice(2, CATEGORIES, [])), false);
  assert.equal(wantsGtm(CATEGORIES, makeChoice(2, CATEGORIES, ['necessary'])), false);
  assert.equal(wantsGtm(CATEGORIES, makeChoice(2, CATEGORIES, ['analytics'])), true);
});

test('revokes: taking back a granted category, not adding one or choosing for the first time', () => {
  const both = makeChoice(2, CATEGORIES, ['analytics', 'marketing']);
  const one = makeChoice(2, CATEGORIES, ['analytics']);
  assert.equal(revokes(both, one), true);
  assert.equal(revokes(one, both), false);
  assert.equal(revokes(null, one), false);
});
