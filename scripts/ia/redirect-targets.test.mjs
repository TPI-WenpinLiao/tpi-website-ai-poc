// Tests for scripts/ia/redirect-targets.mjs. Run: npm run test:scripts

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { redirectProblems } from './redirect-targets.mjs';

const files = new Set(['index.html', 'en.html', 'about-us.html', 'media-center.html', 'pdf/資訊安全政策.pdf']);
/** @param {string} file */
const kind = (file) => (files.has(file) ? 'file' : undefined);
const row = (from, to, status = '301') => ({ from, to, status });

test('targets resolve like Cloudflare Pages, percent-encoding decoded', () => {
  const rows = [
    row('https://www.tpisoftware.com/about-us', '/about-us', '200'),
    row('https://www.tpisoftware.com/media-center/1', '/media-center'),
    row('https://www.tpisoftware.com/x.pdf', '/pdf/%E8%B3%87%E8%A8%8A%E5%AE%89%E5%85%A8%E6%94%BF%E7%AD%96.pdf'),
  ];
  const { checked, missing, chains } = redirectProblems({ rows, kind });
  assert.equal(checked, 3);
  assert.equal(missing.size, 0);
  assert.deepEqual(chains, []);
});

test('an unbuilt target fails unless it is an external node', () => {
  const rows = [
    row('https://www.tpisoftware.com/a', '/gone'),
    row('https://www.tpisoftware.com/b', '/tpu'),
  ];
  const { missing, known } = redirectProblems({ rows, kind, external: new Set(['/tpu']) });
  assert.deepEqual([...missing], [['/gone', ['https://www.tpisoftware.com/a']]]);
  assert.deepEqual([...known.keys()], ['/tpu']);
});

test('a target that is another redirect source on the main host is a chain', () => {
  const rows = [
    row('https://www.tpisoftware.com/a', '/about-us'),
    row('https://www.tpisoftware.com/about-us', '/'),
    // Another host's source never shadows a path of the new site
    row('https://www.tpisoftware.vn/media-center', '/en'),
    row('https://www.tpisoftware.com/b', '/media-center'),
  ];
  const { chains } = redirectProblems({ rows, kind });
  assert.deepEqual(chains, ['https://www.tpisoftware.com/a → /about-us, which redirects again']);
});

test('an overridden page that got built is reported, whatever the source path', () => {
  const overrides = [
    { url: 'https://www.tpisoftware.vn/blog/x/media-center', unbuilt: '/media-center', to: '/' },
    { url: 'https://www.tpisoftware.com/download/a', unbuilt: '/download/a', to: '/' },
    // A built page in the wrong locale has no `unbuilt`
    { url: 'https://www.tpisoftware.com/pdf/a(en).pdf', unbuilt: '', to: '/en' },
  ];
  const { builtOverrides } = redirectProblems({ rows: [], kind, overrides });
  assert.deepEqual(builtOverrides, ['/media-center']);
});

test('catch-alls are skipped', () => {
  const rows = [row('https://www.tpisoftware.com/ja/*', '/en')];
  const { checked, missing } = redirectProblems({ rows, kind });
  assert.equal(checked, 0);
  assert.equal(missing.size, 0);
});
