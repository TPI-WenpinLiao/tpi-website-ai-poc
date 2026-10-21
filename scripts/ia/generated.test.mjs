// Tests for scripts/ia/generated.mjs. Run: npm run test:scripts

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { depth, emit, replaceSection } from './generated.mjs';

const START = '<!-- start -->';
const END = '<!-- end -->';

test('depth counts parents up to the root', () => {
  const byId = new Map([['home', { id: 'home' }], ['a', { id: 'a', parent: 'home' }], ['b', { id: 'b', parent: 'a' }]]);
  assert.deepEqual([...byId.values()].map((n) => depth(n, byId)), [0, 1, 2]);
});

test('replaceSection swaps the marked section and keeps the rest', () => {
  const doc = `intro\n${START}\nold\n${END}\noutro\n`;
  assert.equal(replaceSection(doc, 'x.md', START, END, `${START}\nnew\n${END}`), `intro\n${START}\nnew\n${END}\noutro\n`);
});

test('replaceSection rejects missing or reversed markers', () => {
  assert.throws(() => replaceSection('no markers', 'x.md', START, END, ''), /^Error: x\.md: generated section markers not found$/);
  assert.throws(() => replaceSection(`${END}\n${START}`, 'x.md', START, END, ''), /markers not found/);
});

test('emit writes outputs, and in check mode reports stale or missing files without writing', async (t) => {
  const dir = mkdtempSync(join(tmpdir(), 'ia-generated-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const fresh = join(dir, 'fresh.md');
  const stale = join(dir, 'stale.md');
  const missing = join(dir, 'missing.md');

  assert.deepEqual(await emit([[fresh, 'a\n'], [stale, 'b\n']], { check: false, rerun: 'x' }), []);
  assert.equal(readFileSync(fresh, 'utf8'), 'a\n');

  writeFileSync(stale, 'old\n');
  const before = statSync(stale).mtimeMs;
  const errors = [];
  t.mock.method(console, 'error', (msg) => errors.push(msg));
  const result = await emit([[fresh, 'a\n'], [stale, 'b\n'], [missing, 'c\n']], { check: true, rerun: 'node x.mjs' });
  assert.deepEqual(result, [stale, missing]);
  assert.deepEqual(errors, [`${stale} is out of date; run: node x.mjs`, `${missing} is out of date; run: node x.mjs`]);
  assert.equal(readFileSync(stale, 'utf8'), 'old\n');
  assert.equal(statSync(stale).mtimeMs, before);
  assert.throws(() => statSync(missing), /ENOENT/);
});
