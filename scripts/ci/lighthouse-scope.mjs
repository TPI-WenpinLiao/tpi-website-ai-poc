// Decides whether quality-gate can skip Lighthouse: a PR whose changed files are all in DOCS_ONLY
// cannot change dist/, so Lighthouse would measure the same pages as on the base (#129).
// --verify backs the list: it builds the repo with every DOCS_ONLY file removed and fails when
// dist/ differs from a full build, so the list cannot go stale when the build starts reading one.
// Run: node scripts/ci/lighthouse-scope.mjs --changed   (in CI, on the PR's merge commit)
//      node scripts/ci/lighthouse-scope.mjs --verify
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { appendFileSync, cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, symlinkSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

// Paths the build never reads. Only list what --verify can prove: docs/ also holds CSVs the build
// imports (nodes.csv, navigation.csv, glossary.csv), so it is listed by extension, not whole.
export const DOCS_ONLY = [
  { pattern: '.claude/**', test: (f) => f.startsWith('.claude/') },
  { pattern: 'docs/**/*.md', test: (f) => f.startsWith('docs/') && f.endsWith('.md') },
  { pattern: '*.md', test: (f) => !f.includes('/') && f.endsWith('.md') },
];

/** @param {string} file repo-relative path */
export const isDocsOnly = (file) => DOCS_ONLY.some((p) => p.test(file));

/**
 * Lighthouse is skipped only when there are changed files and every one is in DOCS_ONLY.
 * @param {string[]} files
 */
export function scope(files) {
  const outside = files.filter((f) => !isDocsOnly(f));
  return { skip: files.length > 0 && outside.length === 0, outside };
}

// -z: without it git quotes non-ASCII paths (public/pdf/…買家指南….pdf) and they match nothing
/** @param {string[]} args @param {string} [cwd] */
const git = (args, cwd) => execFileSync('git', args, { cwd, encoding: 'utf8' }).split('\0').filter(Boolean);

/**
 * Files the PR changes. CI checks out the PR's merge commit, whose first parent is the base branch.
 * --no-renames lists both sides of a move, so moving src/x.ts to docs/x.md counts src/x.ts.
 * diff-tree, not diff: outside a repository git diff falls back to --no-index and reports
 * "Could not access 'HEAD^1'" instead of the real cause.
 */
export function changedFiles() {
  return git(['diff-tree', '-r', '--name-only', '--no-renames', '-z', 'HEAD^1', 'HEAD']);
}

/** sha256 of every file under dir, keyed by path relative to dir. @param {string} dir */
function hashTree(dir) {
  /** @type {Map<string, string>} */
  const hashes = new Map();
  const walk = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, e.name);
      if (e.isDirectory()) walk(p);
      else hashes.set(relative(dir, p), createHash('sha256').update(readFileSync(p)).digest('hex'));
    }
  };
  walk(dir);
  return hashes;
}

/** @param {Map<string, string>} a @param {Map<string, string>} b */
export function treeDiff(a, b) {
  const paths = [...new Set([...a.keys(), ...b.keys()])].sort();
  return paths.filter((p) => a.get(p) !== b.get(p)).map((p) => (!b.has(p) ? `- ${p}` : !a.has(p) ? `+ ${p}` : `~ ${p}`));
}

/** @param {string} cwd @param {string} outDir */
function build(cwd, outDir) {
  execFileSync('npx', ['astro', 'build', '--outDir', outDir], { cwd, stdio: ['ignore', 'ignore', 'inherit'] });
}

function verify() {
  const root = resolve(import.meta.dirname, '../..');
  // Inside the repo, not os.tmpdir(): astro renames assets from <root>/.astro into the outDir, which
  // fails with EXDEV when /tmp is another filesystem (CI). .cache/ is gitignored, so ls-files skips it
  mkdirSync(join(root, '.cache'), { recursive: true });
  const tmp = mkdtempSync(join(root, '.cache', 'lighthouse-scope-'));
  try {
    // Tracked and untracked files that git does not ignore: what a checkout of this tree builds from
    const files = git(['ls-files', '-z', '--cached', '--others', '--exclude-standard'], root).filter((f) => existsSync(join(root, f)));
    const removed = files.filter(isDocsOnly);
    const repo = join(tmp, 'repo');
    for (const f of files.filter((f) => !isDocsOnly(f))) {
      mkdirSync(dirname(join(repo, f)), { recursive: true });
      cpSync(join(root, f), join(repo, f));
    }
    symlinkSync(join(root, 'node_modules'), join(repo, 'node_modules'), 'dir');

    console.log(`Building with all files (${files.length})…`);
    build(root, join(tmp, 'full'));
    console.log(`Building without the ${removed.length} DOCS_ONLY files (${DOCS_ONLY.map((p) => p.pattern).join(', ')})…`);
    try {
      build(repo, join(tmp, 'docs-removed'));
    } catch {
      console.error('The build fails without DOCS_ONLY files (error above): narrow DOCS_ONLY in scripts/ci/lighthouse-scope.mjs.');
      process.exitCode = 1;
      return;
    }

    const full = hashTree(join(tmp, 'full'));
    const diff = treeDiff(full, hashTree(join(tmp, 'docs-removed')));
    if (diff.length) {
      console.error(`dist/ changes when DOCS_ONLY files are removed (${diff.length} files):`);
      for (const d of diff.slice(0, 50)) console.error(`  ${d}`);
      console.error('The build reads a DOCS_ONLY file: narrow DOCS_ONLY in scripts/ci/lighthouse-scope.mjs.');
      process.exitCode = 1;
      return;
    }
    console.log(`DOCS_ONLY verified: removing ${removed.length} files leaves all ${full.size} dist/ files identical.`);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

function changed() {
  const files = changedFiles();
  const { skip, outside } = scope(files);
  console.log(`Changed files (${files.length}):\n${files.map((f) => `  ${f}`).join('\n')}`);
  console.log(
    skip
      ? `All in DOCS_ONLY (${DOCS_ONLY.map((p) => p.pattern).join(', ')}): skip Lighthouse.`
      : `Run Lighthouse: ${outside.length} file(s) outside DOCS_ONLY, e.g. ${outside[0] ?? '(no changed files)'}.`,
  );
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `skip=${skip}\n`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [mode] = process.argv.slice(2);
  if (mode === '--verify') verify();
  else if (mode === '--changed') changed();
  else {
    console.error('Usage: node scripts/ci/lighthouse-scope.mjs --changed | --verify');
    process.exit(2);
  }
}
