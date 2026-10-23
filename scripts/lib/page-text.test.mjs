// Tests for scripts/lib/page-text.mjs. Run: npm run test:scripts

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pageText, squash } from './page-text.mjs';

test('pageText drops markup and decodes the entities the site writes', () => {
  const html = '<p>models of &quot;Archive&quot; &amp; it&#39;s&nbsp;&lt;ok&gt;</p><script>x()</script>';
  assert.equal(pageText(html).trim(), 'models of "Archive" & it\'s <ok>');
  assert.equal(pageText('&amp;quot;').trim(), '&quot;');
  assert.equal(squash('a b​c'), 'abc');
});
