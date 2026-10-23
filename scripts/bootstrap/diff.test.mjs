// Tests for scripts/bootstrap/diff.mjs. Run: npm run test:scripts

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { diffIssues, splitSections } from './diff.mjs';

const require = createRequire(import.meta.url);
const { renderBody, validate } = require('../../.github/scripts/bootstrap.cjs');

const milestones = [{ id: 'M1', title: 'M1 盤點' }];
const base = { milestone: 'M1', labels: ['type:docs'], goal: 'g', deliverables: ['d'], acceptance: ['a'], dependsOn: [] };
const issues = [
  { ...base, id: 'M1-01', title: '第一' },
  { ...base, id: 'M1-02', title: '第二', dependsOn: ['M1-01'], gate: 'ia-approved' },
];
const numbers = new Map([['M1-01', 2], ['M1-02', 3]]);
const gh = () =>
  issues.map((i) => ({
    number: numbers.get(i.id),
    title: `[${i.id}] ${i.title}`,
    body: renderBody(i, numbers),
    labels: [...i.labels],
    milestone: 'M1 盤點',
  }));

test('identical data has no differences', () => {
  assert.deepEqual(diffIssues({ issues, milestones, gh: gh() }), { problems: [], wouldCreate: [] });
});

test('ignores checked boxes, gate labels and a missing bootstrap-id comment', () => {
  const remote = gh();
  remote[1].body = remote[1].body.replace('- [ ] a', '- [x] a').replace(/<!--.*-->\n/, '');
  remote[1].labels.push('ia-approved');
  assert.deepEqual(diffIssues({ issues, milestones, gh: remote }).problems, []);
});

test('reports title, milestone, label and body section differences', () => {
  const remote = gh();
  remote[0].title = '[M1-01] 改過';
  remote[0].milestone = null;
  remote[0].labels = ['type:chore'];
  remote[1].body = remote[1].body.replace('- #2（M1-01）', '無');
  const { problems, wouldCreate } = diffIssues({ issues, milestones, gh: remote });
  assert.deepEqual(
    problems.map((p) => `${p.id} ${p.field}`),
    ['M1-01 #2 標題', 'M1-01 #2 milestone', 'M1-01 #2 label', 'M1-02 #3 依賴'],
  );
  assert.deepEqual(wouldCreate, ['[M1-01] 第一']);
});

test('reports issues missing on either side and duplicate ids', () => {
  const remote = gh();
  remote.push({ ...remote[0], number: 11 });
  remote.push({ number: 9, title: '[M1-09] 手動新增', body: '', labels: [], milestone: null });
  remote.push({ number: 10, title: '[chore] 不是 milestone issue', body: '', labels: [], milestone: null });
  remote.splice(1, 1);
  const { problems, wouldCreate } = diffIssues({ issues, milestones, gh: remote });
  assert.deepEqual(
    problems.map((p) => `${p.id} ${p.detail}`),
    ['M1-01 GitHub 上有多張：#2、#11', 'M1-02 GitHub 上沒有', 'M1-09 #9 issues.yml 沒有'],
  );
  assert.deepEqual(wouldCreate, ['[M1-02] 第二']);
});

test('a bootstrap-id mentioned in prose does not count as one', () => {
  assert.equal(splitSections('## 目標\n\n比對 `<!-- bootstrap-id: … -->`').get('目標'), '比對 `<!-- bootstrap-id: … -->`');
});

test('renderBody replaces the default gate sentence with gateNote', () => {
  const body = renderBody({ ...issues[1], gateNote: '選定後加上 `ia-approved`。' }, numbers);
  assert.equal(splitSections(body).get('關卡'), '本 issue 為關卡 issue：選定後加上 `ia-approved`。');
});

test('renderBody writes { issue, note } dependencies as the issue number and note', () => {
  const body = renderBody({ ...issues[1], dependsOn: ['M1-01', { issue: 106, note: '服務頁遷移' }] }, numbers);
  assert.equal(splitSections(body).get('依賴'), '- #2（M1-01）\n- #106（服務頁遷移）');
});

test('validate accepts { issue, note } dependencies and rejects malformed ones', () => {
  const labels = [{ name: 'type:docs' }, { name: 'ia-approved' }];
  const withDeps = (...deps) => [issues[0], { ...issues[1], dependsOn: deps }];
  assert.doesNotThrow(() => validate(labels, milestones, withDeps('M1-01', { issue: 106, note: '服務頁遷移' })));
  assert.throws(() => validate(labels, milestones, withDeps({ issue: 0, note: 'x' })), /positive integer/);
  assert.throws(() => validate(labels, milestones, withDeps({ issue: '106', note: 'x' })), /positive integer/);
  assert.throws(() => validate(labels, milestones, withDeps({ issue: 106 })), /needs a note/);
  assert.throws(() => validate(labels, milestones, withDeps({ issue: 106, note: ' ' })), /needs a note/);
  assert.throws(() => validate(labels, milestones, withDeps(null)), /dependency null must be defined earlier/);
});
