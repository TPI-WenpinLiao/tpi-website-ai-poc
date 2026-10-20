// Tests for scripts/checkpoint/status.mjs. Run: npm run test:scripts
// The CLI cases build a throwaway git repo, so they exercise real `git log` output.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { parseStages, deriveStatus } from './status.mjs';

const SCRIPT = resolve(import.meta.dirname, 'status.mjs');
const PROGRESS = `# #7 測試

## 階段

| # | 階段 | 完成條件 |
|---|---|---|
| 1 | 第一 | a |
| 2 | 第二 | b |
| 3 | 第三 | c |

## 目前狀態

x
`;
const stages = parseStages(PROGRESS);
const c = (subject) => ({ sha: 'abc1234', subject });

test('parseStages reads the stage table', () => {
  assert.deepEqual(stages.map((s) => [s.n, s.name, s.criteria]), [
    [1, '第一', 'a'],
    [2, '第二', 'b'],
    [3, '第三', 'c'],
  ]);
});

test('parseStages rejects a missing section or misnumbered rows', () => {
  assert.throws(() => parseStages('# x\n'), /no "## 階段"/);
  assert.throws(() => parseStages('## 階段\n\n| 1 | a | b |\n| 3 | c | d |\n'), /numbered 1..n/);
});

test('status comes from commits, latest per stage wins', () => {
  const rows = deriveStatus(7, stages, [
    c('wip: 階段 1 完成：一（#7）'),
    c('wip: 階段 2 進行中：等回覆（#7）'),
    c('wip: 階段 2 完成：二（#7）'),
    c('chore: 依審查修正（#7）'),
  ]);
  assert.deepEqual(rows.map((r) => r.status), ['完成', '完成', '未開始']);
});

test('a commit after a PR opens may use its normal type', () => {
  const rows = deriveStatus(7, stages, [c('wip: 階段 1 完成：一（#7）'), c('feat: 階段 2 進行中：二（#7）')]);
  assert.deepEqual(rows.map((r) => r.status), ['完成', '進行中', '未開始']);
});

test('rejects malformed wip, unknown stage, other issue, and gaps', () => {
  assert.throws(() => deriveStatus(7, stages, [c('wip: 新增 skill（#7）')]), /doesn't match/);
  assert.throws(() => deriveStatus(7, stages, [c('wip: 階段 4 完成：x（#7）')]), /stage 4 isn't/);
  assert.throws(() => deriveStatus(7, stages, [c('wip: 階段 1 完成：x（#8）')]), /expected #7/);
  assert.throws(() => deriveStatus(7, stages, [c('wip: 階段 2 完成：x（#7）')]), /stage 2 is 完成 but stage 1 is 未開始/);
});

test('CLI reads the progress file and git log of a real repo', (t) => {
  const dir = mkdtempSync(join(tmpdir(), 'checkpoint-status-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const git = (...args) => execFileSync('git', ['-C', dir, ...args], { encoding: 'utf8' });
  const run = (...args) => spawnSync('node', [SCRIPT, ...args], { cwd: dir, encoding: 'utf8' });

  git('init', '-q', '-b', 'main');
  git('config', 'user.email', 't@example.com');
  git('config', 'user.name', 't');
  git('commit', '-q', '--allow-empty', '-m', 'base');
  git('branch', 'base');
  mkdirSync(join(dir, '.claude/progress'), { recursive: true });
  writeFileSync(join(dir, '.claude/progress/7.md'), PROGRESS);
  git('add', '.');
  git('commit', '-q', '-m', 'wip: 階段 1 完成：一（#7）');

  const ok = run('7', 'HEAD', 'base');
  assert.equal(ok.status, 0, ok.stderr);
  assert.match(ok.stdout, /\| 1 \| 第一 \| a \| 完成 \|/);
  assert.match(ok.stdout, /下一步：階段 2（未開始）/);

  git('commit', '-q', '--allow-empty', '-m', 'wip: 收尾（#7）');
  const bad = run('7', 'HEAD', 'base');
  assert.equal(bad.status, 1);
  assert.match(bad.stderr, /doesn't match/);

  assert.equal(run('x').status, 2);
});
