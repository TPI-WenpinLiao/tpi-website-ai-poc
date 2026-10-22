// Checks docs/status.md for lines that only make sense while a PR is open. status.md describes main
// after the PR merges, so another PR's in-flight state ("待合併") is stale the moment it lands, and
// tracking other open PRs made every new PR outdate all the others. Rule: issue-ship step 3.
// Run: node scripts/status/check.mjs [docs/status.md]

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

// Matches the old open-PR line format `（#20，PR #91），待合併`, not prose quoting the word.
const OPEN_PR = /），\s*待合併/;

/** Lines that write another PR's open state. @param {string} md @returns {string[]} */
export function statusProblems(md) {
  return md
    .split('\n')
    .map((line, i) => ({ line, n: i + 1 }))
    .filter(({ line }) => OPEN_PR.test(line))
    .map(({ line, n }) => `line ${n}: open PR state ("待合併") does not belong in status.md: ${line.trim()}`);
}

/** @param {string[]} args */
function main([file = resolve(import.meta.dirname, '../../docs/status.md')]) {
  const problems = statusProblems(readFileSync(file, 'utf8'));
  for (const p of problems) console.error(p);
  if (problems.length) {
    console.error('Remove these lines; see .claude/skills/issue-ship/SKILL.md step 3.');
    process.exit(1);
  }
  console.log('status.md: ok');
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) main(process.argv.slice(2));
