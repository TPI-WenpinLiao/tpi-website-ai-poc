// Tests for scripts/ci/lighthouse-scope.mjs. Run: npm run test:scripts

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { changedFiles, isDocsOnly, scope, treeDiff } from './lighthouse-scope.mjs';

test('DOCS_ONLY covers .claude/, Markdown under docs/ and Markdown at the root', () => {
  for (const f of ['.claude/skills/checkpoint/SKILL.md', '.claude/progress/129.md', 'docs/status.md', 'docs/decisions/0004-lighthouse-scope.md', 'CLAUDE.md', 'README.md']) {
    assert.equal(isDocsOnly(f), true, f);
  }
});

test('files the build reads are outside DOCS_ONLY', () => {
  for (const f of ['docs/ia/nodes.csv', 'docs/i18n/glossary.csv', 'docs/research/inventory.csv', 'src/content/blog/zh-TW/a.md', 'scripts/README.md', 'package.json', '.github/workflows/quality-gate.yml', 'public/robots.txt']) {
    assert.equal(isDocsOnly(f), false, f);
  }
});

test('skips only when every changed file is in DOCS_ONLY', () => {
  assert.deepEqual(scope(['docs/status.md', '.claude/skills/a/SKILL.md']), { skip: true, outside: [] });
  assert.deepEqual(scope(['docs/status.md', 'docs/ia/nodes.csv']), { skip: false, outside: ['docs/ia/nodes.csv'] });
  assert.deepEqual(scope([]), { skip: false, outside: [] });
});

test('treeDiff lists removed, added and changed files', () => {
  const a = new Map([['a.html', '1'], ['b.html', '2'], ['c.html', '3']]);
  const b = new Map([['a.html', '1'], ['b.html', 'x'], ['d.html', '4']]);
  assert.deepEqual(treeDiff(a, b), ['~ b.html', '- c.html', '+ d.html']);
  assert.deepEqual(treeDiff(a, a), []);
});

test('changedFiles lists both sides of a move and non-ASCII paths unquoted', () => {
  const repo = mkdtempSync(join(tmpdir(), 'lighthouse-scope-test-'));
  const git = (...args) => execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', ...args], { cwd: repo });
  try {
    git('init', '-q');
    mkdirSync(join(repo, 'src'));
    mkdirSync(join(repo, 'docs'));
    writeFileSync(join(repo, 'src/x.ts'), 'export const x = 1;\n');
    writeFileSync(join(repo, 'docs/買家指南.md'), 'a\n');
    git('add', '-A');
    git('commit', '-qm', 'base');
    git('mv', 'src/x.ts', 'docs/x.md');
    writeFileSync(join(repo, 'docs/買家指南.md'), 'b\n');
    git('commit', '-qam', 'move');
    const files = changedFiles(repo).sort();
    assert.deepEqual(files, ['docs/x.md', 'docs/買家指南.md', 'src/x.ts']);
    assert.equal(scope(files).skip, false);
  } finally {
    rmSync(repo, { recursive: true, force: true });
  }
});
