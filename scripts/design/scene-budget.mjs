// JS size budget (docs/design/motion.md「效能預算」). For every page in dist/, sums the gzipped
// size of the JS it runs on load: module scripts under /_astro/ with their static imports, and
// inline scripts (JSON-LD is data, not counted). The chunks those files load with import() are the
// deferred JS; on pages with Scene3D that is the 3D runtime with three.js and the scene. Fails when
// a page's initial JS exceeds INITIAL_BUDGET or its deferred JS exceeds DEFERRED_BUDGET.
// Sizes are zlib's default gzip level, the same as scripts/lib/static-server.mjs and LHCI's server.
// Internal pages (src/lib/seo/indexing.ts: /design-system loads every island at once) are skipped.
// Pagefind's /pagefind/ files load only on /search and are outside /_astro/, so not counted.
// The budgets are also listed in docs/design/motion.md for readers; the run fails when that table
// and the constants below disagree, so the two can't drift apart.
// Run after `astro build`: node scripts/design/scene-budget.mjs [dist]

import { readFileSync, readdirSync } from 'node:fs';
import { join, posix, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { gzipSync } from 'node:zlib';
import { isInternal } from '../../src/lib/seo/indexing.ts';
import { urlPath } from '../i18n/routes.mjs';

const KB = 1024;
// Current sizes are in docs/design/motion.md「效能預算」. The budgets leave room for small changes;
// raising one is a decision for the PR, with the reason written there.
export const INITIAL_BUDGET = 6 * KB;
export const DEFERRED_BUDGET = 140 * KB;

/** `<script>` tags of a page: external module sources and inline bodies. @param {string} html */
export function pageScripts(html) {
  const sources = [];
  const inline = [];
  for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
    const attrs = m[1];
    if (/type=["']?application\/(?:ld\+)?json/.test(attrs)) continue;
    const src = attrs.match(/\bsrc=["']?([^"'\s>]+)/)?.[1];
    if (src) sources.push(src);
    else if (m[2].trim()) inline.push(m[2]);
  }
  return { sources, inline };
}

/**
 * Relative specifiers a chunk imports, split by how: `static` loads with the chunk, `dynamic`
 * through import(). Vite's mapDeps list names the dynamic chunk's own static imports as
 * "_astro/x.js"; they are reached again through the dynamic chunk, so they are skipped here.
 * @param {string} code
 */
export function chunkImports(code) {
  const stat = [...code.matchAll(/(?:\bfrom|\bimport)\s*["'`](\.\.?\/[^"'`]+)["'`]/g)].map((m) => m[1]);
  const dynamic = [...code.matchAll(/\bimport\(\s*["'`](\.\.?\/[^"'`]+)["'`]\s*\)/g)].map((m) => m[1]);
  return { static: stat, dynamic };
}

/**
 * Initial and deferred JS of one page, in bytes, and the files in each.
 * @param {string} html
 * @param {(path: string) => string} read returns a site path's file content ("/_astro/x.js")
 */
export function pageBudget(html, read) {
  const { sources, inline } = pageScripts(html);
  const size = (/** @type {string} */ text) => gzipSync(text).length;
  /** Walks static imports from `roots`; returns the files reached and the dynamic imports seen. */
  const walk = (/** @type {string[]} */ roots, /** @type {Set<string>} */ seen) => {
    const dynamic = [];
    const queue = [...roots];
    while (queue.length) {
      const path = /** @type {string} */ (queue.shift());
      if (seen.has(path)) continue;
      seen.add(path);
      const imports = chunkImports(read(path));
      const base = posix.dirname(path);
      queue.push(...imports.static.map((s) => posix.join(base, s)));
      dynamic.push(...imports.dynamic.map((s) => posix.join(base, s)));
    }
    return dynamic;
  };
  const initial = new Set();
  const lazy = walk(
    sources.filter((s) => s.startsWith('/_astro/')),
    initial,
  );
  // A deferred chunk can import() further chunks; follow them until none are new
  const deferred = new Set(initial);
  for (let next = lazy; next.length; ) next = walk(next, deferred);
  for (const p of initial) deferred.delete(p);
  const total = (/** @type {Set<string>} */ files) => [...files].reduce((sum, p) => sum + size(read(p)), 0);
  return {
    initial: total(initial) + inline.reduce((sum, code) => sum + size(code), 0),
    deferred: total(deferred),
    initialFiles: [...initial],
    deferredFiles: [...deferred],
  };
}

const MOTION_DOC = resolve(import.meta.dirname, '../../docs/design/motion.md');

/**
 * Budgets in motion.md's 效能預算 table, in bytes: the second column of the rows that start with
 * 每頁初始 JS and 3D 延後載入的 JS. Undefined for a row that is missing.
 * @param {string} markdown
 */
export function documentedBudgets(markdown) {
  const row = (/** @type {string} */ label) => {
    const m = markdown.match(new RegExp(`^\\| ${label}[^|]*\\| (\\d+(?:\\.\\d+)?) KB \\|`, 'm'));
    return m ? Number(m[1]) * KB : undefined;
  };
  return { initial: row('每頁初始 JS'), deferred: row('3D 延後載入的 JS') };
}

const kb = (/** @type {number} */ bytes) => `${(bytes / KB).toFixed(1)} KB`;

/** @param {string[]} args */
function main([dist = resolve(import.meta.dirname, '../../dist')]) {
  const pages = readdirSync(dist, { recursive: true })
    .map(String)
    .filter((f) => f.endsWith('.html') && !isInternal(urlPath(f)));
  const read = (/** @type {string} */ path) => readFileSync(join(dist, path), 'utf8');
  let failed = 0;
  let maxInitial = { page: '', bytes: 0 };
  let maxDeferred = { page: '', bytes: 0 };
  for (const page of pages) {
    const b = pageBudget(read(page), read);
    if (b.initial > maxInitial.bytes) maxInitial = { page, bytes: b.initial };
    if (b.deferred > maxDeferred.bytes) maxDeferred = { page, bytes: b.deferred };
    if (b.initial > INITIAL_BUDGET) {
      console.log(`${page}: initial JS ${kb(b.initial)} > ${kb(INITIAL_BUDGET)} (${b.initialFiles.join(', ')})`);
      failed += 1;
    }
    if (b.deferred > DEFERRED_BUDGET) {
      console.log(`${page}: deferred JS ${kb(b.deferred)} > ${kb(DEFERRED_BUDGET)} (${b.deferredFiles.join(', ')})`);
      failed += 1;
    }
  }
  console.log(`${pages.length} pages; largest initial JS ${kb(maxInitial.bytes)} (${maxInitial.page}), budget ${kb(INITIAL_BUDGET)}`);
  console.log(`largest deferred JS ${kb(maxDeferred.bytes)} (${maxDeferred.page}), budget ${kb(DEFERRED_BUDGET)}`);
  const documented = documentedBudgets(readFileSync(MOTION_DOC, 'utf8'));
  if (documented.initial !== INITIAL_BUDGET || documented.deferred !== DEFERRED_BUDGET) {
    console.log(`docs/design/motion.md lists ${JSON.stringify(documented)} bytes, but INITIAL_BUDGET is ${INITIAL_BUDGET} and DEFERRED_BUDGET ${DEFERRED_BUDGET}`);
    failed += 1;
  }
  if (failed) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main(process.argv.slice(2));
