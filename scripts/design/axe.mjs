// Runs axe-core on every built page (dist/**/*.html) and fails on any WCAG 2.2 A/AA violation.
// Lighthouse's accessibility score samples a few pages and only fails below a threshold; this
// checks every rule on every page. Only axe's "violations" fail: "incomplete" results (text over
// images, where axe cannot tell the background) are measured by a11y-smoke.mjs instead.
// Pages load at 1280px with prefers-reduced-motion: reduce, so the 3D scene shows its static
// version (ADR 0003) and nothing is mid-animation.
// The report groups violations by rule: impact, the rule's help page, how many pages and
// elements, and the first pages with the first failing element's selector.
// Part of `npm run check`, after the build: node scripts/design/axe.mjs [path prefix=/]
// Uses CHROME_PATH (set by the SessionStart hook), else CHROME_BIN (set on GitHub's runners), else the installed Chrome.

import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import axe from 'axe-core';
import puppeteer from 'puppeteer-core';
import { serve } from '../lib/static-server.mjs';
import { urlPath } from '../i18n/routes.mjs';

const DIST = resolve(import.meta.dirname, '../../dist');
const TABS = 4;
const SHOWN = 5;
export const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
const IMPACTS = ['critical', 'serious', 'moderate', 'minor'];

/**
 * @typedef {{ id: string, impact?: string | null, help: string, helpUrl: string, nodes: { target: unknown[], failureSummary?: string }[] }} Violation
 * @typedef {{ path: string, violations: Violation[] }} PageResult
 */

/**
 * Violations grouped by rule, most severe first.
 * @param {PageResult[]} results
 */
export function groupByRule(results) {
  /** @type {Map<string, { id: string, impact: string, help: string, helpUrl: string, summary: string, pages: { path: string, target: string }[], elements: number }>} */
  const rules = new Map();
  for (const { path, violations } of results) {
    for (const v of violations) {
      const rule = rules.get(v.id) ?? { id: v.id, impact: v.impact ?? 'minor', help: v.help, helpUrl: v.helpUrl, summary: v.nodes[0]?.failureSummary ?? '', pages: [], elements: 0 };
      rule.pages.push({ path, target: v.nodes[0]?.target.map(String).join(' ') ?? '' });
      rule.elements += v.nodes.length;
      rules.set(v.id, rule);
    }
  }
  return [...rules.values()].sort((a, b) => IMPACTS.indexOf(a.impact) - IMPACTS.indexOf(b.impact) || b.pages.length - a.pages.length || a.id.localeCompare(b.id));
}

/** @param {ReturnType<typeof groupByRule>} rules @returns {string[]} */
export function report(rules) {
  const lines = [];
  for (const r of rules) {
    lines.push(`${r.id} (${r.impact}): ${r.help}`, `  ${r.helpUrl}`, `  ${r.pages.length} page(s), ${r.elements} element(s)`);
    for (const p of [...r.pages].sort((a, b) => a.path.localeCompare(b.path)).slice(0, SHOWN)) lines.push(`    ${p.path}  ${p.target}`);
    if (r.pages.length > SHOWN) lines.push(`    … ${r.pages.length - SHOWN} more page(s)`);
    if (r.summary) lines.push(...r.summary.split('\n').map((l) => `  | ${l}`));
  }
  return lines;
}

/** @param {string[]} args */
async function main([prefix = '/']) {
  const paths = readdirSync(DIST, { recursive: true })
    .map(String)
    .filter((f) => f.endsWith('.html'))
    .map(urlPath)
    .filter((p) => p.startsWith(prefix))
    .sort();
  const server = await serve(DIST);
  const { port } = /** @type {import('node:net').AddressInfo} */ (server.address());
  const executablePath = process.env.CHROME_PATH || process.env.CHROME_BIN;
  const chrome = executablePath ? { executablePath } : { channel: /** @type {const} */ ('chrome') };
  const browser = await puppeteer.launch({ ...chrome, headless: true, args: ['--no-sandbox'] });
  /** @type {PageResult[]} */
  const results = [];
  const queue = [...paths];
  async function worker() {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 860 });
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    for (let path; (path = queue.shift()); ) {
      await page.goto(`http://localhost:${port}${path}`, { waitUntil: 'load' });
      await page.evaluate(axe.source);
      const violations = await page.evaluate(
        (tags) => /** @type {any} */ (window).axe.run(document, { runOnly: { type: 'tag', values: tags }, resultTypes: ['violations'] }).then((/** @type {any} */ r) => r.violations),
        TAGS,
      );
      results.push({ path, violations });
    }
    await page.close();
  }
  try {
    await Promise.all(Array.from({ length: TABS }, worker));
  } finally {
    await browser.close();
    server.close();
  }
  const rules = groupByRule(results);
  for (const line of report(rules)) console.log(line);
  const failing = new Set(rules.flatMap((r) => r.pages.map((p) => p.path))).size;
  console.log(`${paths.length} pages checked with axe-core ${axe.version} (${TAGS.join(', ')}), ${rules.length} rules violated on ${failing} pages`);
  if (rules.length) process.exitCode = 1;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) await main(process.argv.slice(2));
