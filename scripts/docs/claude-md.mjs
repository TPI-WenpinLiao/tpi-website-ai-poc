// Checks that CLAUDE.md's 目錄結構 block lists every directory the project is organised by (tracked, or new and not ignored):
// top-level directories and the direct subdirectories of each directory in PARENTS.
// The block is hand-written and fell behind at every milestone wrap-up (M8-03 found src/assets
// and docs/design missing), so drift fails `npm run check` instead of waiting for a review.
// Run: node scripts/docs/claude-md.mjs

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

/** Parents whose direct subdirectories must each be listed. '' is the repo root. */
export const PARENTS = ['', '.claude', 'src', 'src/lib', 'scripts', 'docs', 'public', 'functions', 'tests', '.github'];

/** The fenced code block under `## 目錄結構`. @param {string} md @returns {string} */
export function structureBlock(md) {
  const match = /^## 目錄結構\n+```\n([\s\S]*?)\n```/m.exec(md);
  if (!match) throw new Error('CLAUDE.md has no fenced block under "## 目錄結構"');
  return match[1];
}

/** Direct subdirectories of each parent, from tracked file paths. @param {string[]} files */
export function directories(files) {
  /** @type {Map<string, Set<string>>} */
  const dirs = new Map(PARENTS.map((p) => [p, new Set()]));
  for (const file of files) {
    for (const parent of PARENTS) {
      const prefix = parent ? `${parent}/` : '';
      if (!file.startsWith(prefix)) continue;
      const rest = file.slice(prefix.length).split('/');
      if (rest.length > 1) dirs.get(parent)?.add(rest[0]);
    }
  }
  return dirs;
}

const escape = (/** @type {string} */ s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Drops `（…）` notes, innermost first, so a name mentioned inside one does not count. @param {string} line */
const withoutNotes = (line) => {
  let previous;
  do {
    previous = line;
    line = line.replace(/（[^（）]*）/g, '');
  } while (line !== previous);
  return line;
};

/**
 * A directory counts as listed when the block has a line starting with its full path
 * (`src/assets/`, `tests/visual/`), or the line for its parent (`scripts/  …`) names it as
 * `name/` after a space, `、`, `；` or `：`, outside the `（…）` notes.
 * @param {string} block @param {string} parent @param {string} name
 */
export function isListed(block, parent, name) {
  const path = parent ? `${parent}/${name}/` : `${name}/`;
  const lines = block.split('\n');
  if (lines.some((line) => line.startsWith(path))) return true;
  if (!parent) return false;
  const parentLine = lines.find((line) => new RegExp(`^${escape(parent)}/\\s`).test(line));
  return Boolean(parentLine && new RegExp(`[\\s、；：]${escape(name)}/`).test(withoutNotes(parentLine)));
}

/** @param {string} md @param {string[]} files @returns {string[]} */
export function missing(md, files) {
  const block = structureBlock(md);
  const result = [];
  for (const [parent, names] of directories(files)) {
    for (const name of [...names].sort()) {
      if (!isListed(block, parent, name)) result.push(parent ? `${parent}/${name}/` : `${name}/`);
    }
  }
  return result;
}

function main() {
  const root = resolve(import.meta.dirname, '../..');
  const ls = (/** @type {string[]} */ args) =>
    execFileSync('git', ['ls-files', '-z', ...args], { cwd: root, encoding: 'utf8' })
      .split('\0')
      .filter((f) => f && existsSync(join(root, f)));
  // Untracked files count too, so a new directory fails here before it is committed, not only in CI.
  // Only inside the listed parents: untracked top-level directories are local editor state
  // (.vscode/, .idea/), not project structure.
  // Not .claude/: Claude Code keeps local, unignored state there (worktrees/, settings.local.json), so
  // only its tracked directories count.
  const insideParent = (/** @type {string} */ f) =>
    PARENTS.some((p) => p && p !== '.claude' && f.startsWith(`${p}/`));
  const files = [...ls(['--cached']), ...ls(['--others', '--exclude-standard']).filter(insideParent)];
  const problems = missing(readFileSync(resolve(root, 'CLAUDE.md'), 'utf8'), files);
  for (const dir of problems) console.error(`CLAUDE.md 目錄結構 does not list ${dir}`);
  if (problems.length) {
    console.error('Add each directory to the block (its own line, or `name/（…）` on the parent line).');
    process.exit(1);
  }
  console.log('CLAUDE.md 目錄結構: ok');
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) main();
