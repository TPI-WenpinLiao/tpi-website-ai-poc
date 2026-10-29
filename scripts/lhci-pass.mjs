// Lets `npm run lighthouse` skip pages it already measured (#149). After LHCI passes, lhci-run.mjs
// writes a key for what it measured to PASSED; the next run with the same key skips Lighthouse.
// The key covers .lhci-dist/ (what lhci-prepare.mjs copies from dist/) and the files that change
// how it is measured: the LHCI config, the package versions (LHCI, Lighthouse, Chromium through
// Playwright), the npm scripts, these scripts and every LHCI_* variable, which LHCI reads as config
// (LHCI_SETTINGS__CHROME_FLAGS). quality-gate restores PASSED from the cache under the same key.
// LIGHTHOUSE_FORCE=1 runs anyway; `npm run lighthouse:all` (LHCI_ALL=1) never skips. ADR 0004.
// Run: node scripts/lhci-pass.mjs --key   (after lhci-prepare.mjs; also writes key= to GITHUB_OUTPUT)

import { createHash } from 'node:crypto';
import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { hashTree } from './ci/lighthouse-scope.mjs';

// .lighthouseci/ is gitignored, and LHCI's collect only clears the lhr-*.json and HTML reports there
export const PASSED = '.lighthouseci/passed-dist.sha256';
export const DIST = '.lhci-dist';
export const INPUTS = ['lighthouserc.cjs', 'package.json', 'package-lock.json', 'scripts/lhci-prepare.mjs', 'scripts/lhci-run.mjs', 'scripts/lhci-pass.mjs'];

const sha256 = (data) => createHash('sha256').update(data).digest('hex');

/**
 * sha256 over every file under `dist`, every file in `inputs` and every LHCI_* variable in `env`,
 * each as name and content hash, in name order. The key does not depend on where `root` is.
 * @param {{ root?: string, dist?: string, inputs?: string[], env?: NodeJS.ProcessEnv }} [options]
 */
export function passKey({ root = '.', dist = DIST, inputs = INPUTS, env = process.env } = {}) {
  const files = [...hashTree(join(root, dist))].map(([path, hash]) => [`${dist}/${path}`, hash]);
  for (const f of inputs) files.push([f, sha256(readFileSync(join(root, f)))]);
  for (const [name, value] of Object.entries(env)) if (name.startsWith('LHCI_')) files.push([`env:${name}`, sha256(value ?? '')]);
  files.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
  return sha256(files.map(([path, hash]) => `${path}\0${hash}\n`).join(''));
}

/** The key of the last run that passed, if any. @param {string} [file] */
export function readPassed(file = PASSED) {
  return existsSync(file) ? readFileSync(file, 'utf8').trim() : undefined;
}

/** @param {string} key @param {string} [file] */
export function recordPass(key, file = PASSED) {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, `${key}\n`);
}

/**
 * What lhci-run.mjs does with the pages it is about to measure.
 * - skip: the same key already passed
 * - run: measure, and record the key when LHCI passes
 * - run-only: `lighthouse:all` measures every page once with other assertions, so its pass says
 *   nothing about `npm run lighthouse`
 * @param {NodeJS.ProcessEnv} env @param {string | undefined} key @param {string | undefined} passed
 * @returns {'skip' | 'run' | 'run-only'}
 */
export function decide(env, key, passed) {
  if (env.LHCI_ALL === '1') return 'run-only';
  if (env.LIGHTHOUSE_FORCE === '1') return 'run';
  return key && key === passed ? 'skip' : 'run';
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  if (process.argv[2] !== '--key') {
    console.error('Usage: node scripts/lhci-pass.mjs --key');
    process.exit(2);
  }
  const key = passKey();
  console.log(key);
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `key=${key}\n`);
}
