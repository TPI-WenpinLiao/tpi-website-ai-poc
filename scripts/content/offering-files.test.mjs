// Tests for scripts/content/offering-files.mjs. Run: npm run test:scripts

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { targets } from './offering-files.mjs';

const file = { name: 'guide-zh-tw.pdf', url: 'https://www.tpisoftware.com/pdf/a b.pdf' };

test('targets puts files under public/files', () => {
  assert.deepEqual(targets({ files: [file] }), [{ url: 'https://www.tpisoftware.com/pdf/a%20b.pdf', path: 'public/files/guide-zh-tw.pdf' }]);
  assert.deepEqual(targets({}), []);
});

test('targets rejects bad names, bad URLs and two entries on one path', () => {
  assert.throws(() => targets({ files: [{ ...file, name: 'Guide.pdf' }] }), /lowercase/);
  assert.throws(() => targets({ files: [{ ...file, name: 'guide' }] }), /extension/);
  assert.throws(() => targets({ files: [{ name: 'guide.pdf' }] }), /Invalid URL/);
  assert.throws(() => targets({ files: [file, file] }), /more than one/);
});
