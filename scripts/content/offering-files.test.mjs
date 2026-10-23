// Tests for scripts/content/offering-files.mjs. Run: npm run test:scripts

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { targets } from './offering-files.mjs';

const url = 'https://www.tpisoftware.com/pdf/a%20b_%E8%B2%B7.pdf';

test('targets keeps the current-site path under public/', () => {
  assert.deepEqual(targets({ files: [url] }), [{ url, path: 'public/pdf/a b_買.pdf' }]);
  assert.deepEqual(targets({}), []);
});

test('targets rejects bad URLs, directories and two entries on one path', () => {
  assert.throws(() => targets({ files: ['pdf/a.pdf'] }), /Invalid URL/);
  assert.throws(() => targets({ files: ['https://www.tpisoftware.com/pdf/'] }), /not a file/);
  assert.throws(() => targets({ files: [url, url] }), /more than one/);
});
