// Tests for scripts/docs/claude-md.mjs. Run: npm run test:scripts

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { directories, isListed, missing, structureBlock } from './claude-md.mjs';

const md = [
  '# CLAUDE.md',
  '',
  '## 目錄結構',
  '',
  '```',
  'src/pages/        首頁',
  'src/lib/          i18n/（語系）、ia/（導覽）',
  'scripts/          design/（對比，含 `tokens/`）、lib/（共用）、multimedia/（影音）',
  'tests/visual/     Playwright',
  '```',
  '',
  '## IA 與 URL',
].join('\n');

test('extracts the block under 目錄結構', () => {
  assert.match(structureBlock(md), /^src\/pages\//);
  assert.throws(() => structureBlock('# no block'), /目錄結構/);
});

test('collects direct subdirectories of each parent', () => {
  const dirs = directories(['src/lib/ia/nodes.ts', 'src/pages/index.astro', 'README.md', 'scripts/lib/x.mjs']);
  assert.deepEqual([...(dirs.get('') ?? [])].sort(), ['scripts', 'src']);
  assert.deepEqual([...(dirs.get('src') ?? [])].sort(), ['lib', 'pages']);
  assert.deepEqual([...(dirs.get('src/lib') ?? [])], ['ia']);
  assert.deepEqual([...(dirs.get('scripts') ?? [])], ['lib']);
});

test('accepts a full-path line or a name on the parent line', () => {
  const block = structureBlock(md);
  assert.ok(isListed(block, 'src', 'pages'));
  assert.ok(isListed(block, 'src', 'lib'));
  assert.ok(isListed(block, 'src/lib', 'ia'));
  assert.ok(isListed(block, 'scripts', 'lib'));
  assert.ok(isListed(block, '', 'tests'));
});

test('does not match a name inside another word or on another line', () => {
  const block = structureBlock(md);
  // `multimedia/` must not count as `ia/`, and `src/lib/ia/` is not on the scripts line.
  assert.equal(isListed(block, 'scripts', 'ia'), false);
  // A name inside another directory's （…） note is not a listing of its own.
  assert.equal(isListed(block, 'scripts', 'tokens'), false);
  assert.equal(isListed(block, 'src', 'assets'), false);
});

test('reports unlisted directories', () => {
  const files = ['src/assets/a.png', 'src/pages/index.astro', 'scripts/ci/x.mjs', 'docs/design/a.md', 'tests/visual/a.ts'];
  assert.deepEqual(missing(md, files), ['docs/', 'src/assets/', 'scripts/ci/', 'docs/design/']);
});
