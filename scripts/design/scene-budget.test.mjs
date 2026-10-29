// Tests for scripts/design/scene-budget.mjs. Run: npm run test:scripts

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gzipSync } from 'node:zlib';
import { readFileSync } from 'node:fs';
import { chunkImports, DEFERRED_BUDGET, documentedBudgets, INITIAL_BUDGET, pageBudget, pageScripts } from './scene-budget.mjs';

test('reads module sources and inline scripts, skipping JSON-LD', () => {
  const html =
    '<script type="application/ld+json">{"@type":"Organization"}</script>' +
    '<script type="module" src="/_astro/a.js"></script>' +
    '<script type="module">console.log(1)</script><script>  </script>';
  assert.deepEqual(pageScripts(html), { sources: ['/_astro/a.js'], inline: ['console.log(1)'] });
});

test('tells static imports from import()', () => {
  const code = 'import{t as e}from"./helper.js";import"./side.js";const m=()=>e(()=>import(`./scene.js`),__vite__mapDeps([0]))';
  assert.deepEqual(chunkImports(code), { static: ['./helper.js', './side.js'], dynamic: ['./scene.js'] });
});

test('counts static imports as initial and import() chunks, with their imports, as deferred', () => {
  const files = {
    '/_astro/loader.js': 'import{t}from"./helper.js";()=>import("./scene.js")',
    '/_astro/helper.js': 'export const t=1',
    '/_astro/scene.js': 'import{r}from"./runtime.js";import{t}from"./helper.js"',
    '/_astro/runtime.js': 'export const r="three"'.repeat(50),
  };
  const read = (/** @type {string} */ p) => files[/** @type {keyof typeof files} */ (p)];
  const size = (/** @type {string} */ t) => gzipSync(t).length;
  const b = pageBudget('<script type="module" src="/_astro/loader.js"></script><script>x()</script>', read);
  assert.deepEqual(b.initialFiles, ['/_astro/loader.js', '/_astro/helper.js']);
  assert.deepEqual(b.deferredFiles, ['/_astro/scene.js', '/_astro/runtime.js']);
  assert.equal(b.initial, size(files['/_astro/loader.js']) + size(files['/_astro/helper.js']) + size('x()'));
  assert.equal(b.deferred, size(files['/_astro/scene.js']) + size(files['/_astro/runtime.js']));
});

test('a page without scripts has no JS', () => {
  assert.deepEqual(pageBudget('<p>static</p>', () => ''), { initial: 0, deferred: 0, initialFiles: [], deferredFiles: [] });
});

test('follows import() inside deferred chunks', () => {
  const files = {
    '/_astro/loader.js': '()=>import("./scene.js")',
    '/_astro/scene.js': '()=>import("./extra.js");()=>import("./loader.js")',
    '/_astro/extra.js': 'export const x=1',
  };
  const b = pageBudget('<script type="module" src="/_astro/loader.js"></script>', (p) => files[/** @type {keyof typeof files} */ (p)]);
  assert.deepEqual(b.initialFiles, ['/_astro/loader.js']);
  assert.deepEqual(b.deferredFiles, ['/_astro/scene.js', '/_astro/extra.js']);
});

test('reads the budgets from the motion.md table', () => {
  const md = '| 項目 | 預算 |\n|---|---|\n| 每頁初始 JS（gzip） | 6 KB | x |\n| 3D 延後載入的 JS（gzip） | 140 KB | y |\n';
  assert.deepEqual(documentedBudgets(md), { initial: 6 * 1024, deferred: 140 * 1024 });
  assert.deepEqual(documentedBudgets('no table'), { initial: undefined, deferred: undefined });
});

test('motion.md lists the budgets the script enforces', () => {
  const md = readFileSync(new URL('../../docs/design/motion.md', import.meta.url), 'utf8');
  assert.deepEqual(documentedBudgets(md), { initial: INITIAL_BUDGET, deferred: DEFERRED_BUDGET });
});
