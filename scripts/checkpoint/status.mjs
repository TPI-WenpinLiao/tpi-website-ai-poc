// Derives the stage status of a checkpointed issue from its commits, so the progress file
// (.claude/progress/<N>.md) never carries a hand-edited status that can drift.
// Stages come from the progress file's table; status comes from commit subjects of the form
// `<type>: 階段 <k> 完成|進行中：<summary>（#N）`, the latest commit per stage winning.
// Exits non-zero when a `wip:` commit or any subject mentioning `階段 <k>` doesn't parse, names an
// unknown stage or another issue, or the stages aren't in order: done ones first, then at most one
// in progress, then not started. Rules: .claude/skills/checkpoint/SKILL.md
// Run: node scripts/checkpoint/status.mjs <N> [ref=HEAD] [base=origin/main]

import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const SUBJECT = /^[a-z]+: 階段 (\d+) (完成|進行中)：.+（#(\d+)）$/;
const MENTIONS_STAGE = /階段 *\d/;

export function parseStages(markdown) {
  const section = markdown.split(/^## /m).find((s) => s.startsWith('階段\n'));
  if (!section) throw new Error('progress file has no "## 階段" section');
  const rows = section
    .split('\n')
    .filter((line) => /^\|\s*\d+\s*\|/.test(line))
    .map((line) => line.split('|').slice(1, -1).map((cell) => cell.trim()));
  if (rows.length === 0) throw new Error('"## 階段" table has no stage rows');
  return rows.map(([n, name, criteria], i) => {
    if (Number(n) !== i + 1) throw new Error(`stage rows must be numbered 1..n, got ${n} at row ${i + 1}`);
    return { n: i + 1, name, criteria };
  });
}

// commits: oldest first, [{ sha, subject }]
export function deriveStatus(issue, stages, commits) {
  const status = new Map(stages.map((s) => [s.n, { status: '未開始', sha: '' }]));
  for (const { sha, subject } of commits) {
    const m = SUBJECT.exec(subject);
    if (!m) {
      if (subject.startsWith('wip:') || MENTIONS_STAGE.test(subject)) {
        throw new Error(`${sha} "${subject}": doesn't match "<type>: 階段 <k> 完成|進行中：<摘要>（#N）"`);
      }
      continue;
    }
    const [, n, st, num] = m;
    if (Number(num) !== issue) throw new Error(`${sha} "${subject}": refers to #${num}, expected #${issue}`);
    if (!status.has(Number(n))) throw new Error(`${sha} "${subject}": stage ${n} isn't in the progress file`);
    status.set(Number(n), { status: st, sha });
  }
  const rows = stages.map((s) => ({ ...s, ...status.get(s.n) }));
  const current = rows.findIndex((r) => r.status !== '完成');
  const ahead = current === -1 ? undefined : rows.slice(current + 1).find((r) => r.status !== '未開始');
  if (ahead) throw new Error(`stage ${ahead.n} is ${ahead.status} but stage ${rows[current].n} is ${rows[current].status}`);
  return rows;
}

function git(...args) {
  return execFileSync('git', args, { encoding: 'utf8' });
}

function main([issueArg, ref = 'HEAD', base = 'origin/main']) {
  const issue = Number(issueArg);
  if (!Number.isInteger(issue) || issue <= 0) {
    console.error('usage: node scripts/checkpoint/status.mjs <N> [ref=HEAD] [base=origin/main]');
    process.exit(2);
  }
  const stages = parseStages(git('show', `${ref}:.claude/progress/${issue}.md`));
  const commits = git('log', '--reverse', '--no-merges', '--format=%h%x09%s', `${base}..${ref}`)
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const [sha, ...rest] = line.split('\t');
      return { sha, subject: rest.join('\t') };
    });
  const rows = deriveStatus(issue, stages, commits);
  console.log('| # | 階段 | 完成條件 | 狀態 | commit |\n|---|---|---|---|---|');
  for (const r of rows) console.log(`| ${r.n} | ${r.name} | ${r.criteria} | ${r.status} | ${r.sha} |`);
  const next = rows.find((r) => r.status !== '完成');
  console.log(next ? `\n下一步：階段 ${next.n}（${next.status}）` : '\n所有階段都已完成');
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    main(process.argv.slice(2));
  } catch (err) {
    console.error(`checkpoint status: ${err.message}`);
    process.exit(1);
  }
}
