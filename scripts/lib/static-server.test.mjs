// Tests for scripts/lib/static-server.mjs. Run: npm run test:scripts

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { servedFile } from './static-server.mjs';

const FILES = new Set(['index.html', 'blog.html', 'blog/index.html', 'blog/post.html', 'docs/index.html', 'a.webp']);
const DIRS = new Set(['', 'blog', 'docs']);
const kind = (f) => (FILES.has(f) ? 'file' : DIRS.has(f) ? 'dir' : undefined);

test('resolves like Cloudflare Pages: path.html, then the file, then path/index.html', () => {
  assert.equal(servedFile('/', kind), 'index.html');
  assert.equal(servedFile('/blog', kind), 'blog.html');
  assert.equal(servedFile('/blog/post', kind), 'blog/post.html');
  assert.equal(servedFile('/docs', kind), 'docs/index.html');
  assert.equal(servedFile('/docs/', kind), 'docs/index.html');
  assert.equal(servedFile('/a.webp', kind), 'a.webp');
});

test('returns nothing for missing paths and never leaves the root', () => {
  assert.equal(servedFile('/missing', kind), undefined);
  assert.equal(servedFile('/a.webp/', kind), undefined);
  assert.equal(servedFile('/../../etc/passwd', kind), undefined);
});
