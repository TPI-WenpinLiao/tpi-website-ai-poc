#!/usr/bin/env node
// Score table of docs/strategy/evaluation.md (#168), computed from the reviews in
// docs/strategy/evaluation/reviews/ so the averages in the report are never typed by hand.
//
//   1. every review file has one section per rubric, headed `## <rubric>：平均 <x.x>，<通過／未通過>…`,
//      with a table row per item: `| D1 … | 4 | … |`, the score being 1–5 or 不適用
//   2. the average of the scored items is rounded to one decimal; a rubric passes at ≥ 4.0 with no item
//      below 3 (.claude/skills/site-review「門檻」). The average and the verdict a reviewer wrote in the
//      heading must match the computed ones, so an arithmetic slip in a review fails the check
//   3. each rubric must list all six items, scored or 不適用
//   4. the table between <!-- eval-scores:start --> and <!-- eval-scores:end --> in the report must equal
//      the generated one; --write rewrites it
//
// Five-second test files (five-second-*.md) have no scores and are skipped.
//
// Usage: node scripts/strategy/eval-scores.mjs [--write]
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const REVIEWS = 'docs/strategy/evaluation/reviews';
const REPORT = 'docs/strategy/evaluation.md';
const START = '<!-- eval-scores:start -->';
const END = '<!-- eval-scores:end -->';

export const RUBRICS = /** @type {const} */ (['設計', '文案與行銷', 'SEO']);
const ITEM_PREFIX = { 設計: 'D', 文案與行銷: 'C', SEO: 'S' };

/** Rows of the table, in order: [group, page, file name without .md]. */
export const ROWS = [
  ['試點新版', '首頁', 'new-home'],
  ['試點新版', 'digiRunner', 'new-digirunner'],
  ['試點新版', '金融', 'new-finance'],
  ['試點舊版', '首頁', 'old-home'],
  ['試點舊版', 'digiRunner', 'old-digirunner'],
  ['試點舊版', '金融', 'old-finance'],
  ['現站', '首頁', 'current-home'],
  ['現站', 'digiRunner', 'current-digirunner'],
  ['現站', '金融（開放銀行頁）', 'current-finance'],
  ['競品', 'SYSTEX 首頁', 'competitors-systex'],
  ['競品', 'Syscom 首頁', 'competitors-syscom'],
];

/**
 * @typedef {{ id: string, score: number | null }} Item
 * @typedef {{ rubric: string, declared: number, declaredPass: boolean, items: Item[] }} Section
 */

/** Parses the rubric sections of a review. */
export function parseReview(markdown) {
  /** @type {Section[]} */
  const sections = [];
  let current;
  for (const line of markdown.split('\n')) {
    const heading = line.match(/^## (設計|文案與行銷|SEO)：平均 (\d\.\d)，(通過|未通過)/);
    if (heading) {
      current = { rubric: heading[1], declared: Number(heading[2]), declaredPass: heading[3] === '通過', items: [] };
      sections.push(current);
      continue;
    }
    if (line.startsWith('## ')) current = undefined;
    const row = current && line.match(/^\| ([DCS]\d) [^|]*\| (\d|不適用) \|/);
    if (row) current.items.push({ id: row[1], score: row[2] === '不適用' ? null : Number(row[2]) });
  }
  return sections;
}

/** Average rounded to one decimal, and whether the rubric passes (site-review「門檻」). */
export function score(items) {
  const scored = items.map((i) => i.score).filter((s) => s !== null);
  const average = Math.round((scored.reduce((a, b) => a + b, 0) / scored.length) * 10) / 10;
  const low = items.filter((i) => i.score !== null && i.score < 3).map((i) => `${i.id} = ${i.score}`);
  return { average, pass: average >= 4 && low.length === 0, low };
}

/** Problems in one review: missing rubrics or items, and headings that disagree with the scores. */
export function checkReview(name, sections) {
  const problems = [];
  for (const rubric of RUBRICS) {
    const section = sections.find((s) => s.rubric === rubric);
    if (!section) {
      problems.push(`${name}: no「## ${rubric}：平均 …」section`);
      continue;
    }
    const ids = section.items.map((i) => i.id).join(',');
    const want = [1, 2, 3, 4, 5, 6].map((n) => `${ITEM_PREFIX[rubric]}${n}`).join(',');
    if (ids !== want) problems.push(`${name} ${rubric}: items are ${ids || 'none'}, want ${want}`);
    const { average, pass } = score(section.items);
    if (average !== section.declared) {
      problems.push(`${name} ${rubric}: heading says ${section.declared.toFixed(1)}, the items average ${average.toFixed(1)}`);
    }
    if (pass !== section.declaredPass) {
      problems.push(`${name} ${rubric}: heading says ${section.declaredPass ? '通過' : '未通過'}, the scores say ${pass ? '通過' : '未通過'}`);
    }
  }
  return problems;
}

function cell({ average, pass, low }) {
  if (pass) return `${average.toFixed(1)} 通過`;
  if (low.length === 0) return `${average.toFixed(1)} 未通過`;
  return `${average.toFixed(1)} 未通過（${low.length <= 2 ? low.join('、') : `${low.length} 項低於 3`}）`;
}

/** The markdown table for the report. */
export function table(reviews) {
  const lines = ['| 組 | 頁面 | 設計 | 文案與行銷 | SEO |', '|---|---|---|---|---|'];
  for (const [group, page, file] of ROWS) {
    const sections = reviews.get(file);
    const cells = RUBRICS.map((r) => cell(score(sections.find((s) => s.rubric === r).items)));
    lines.push(`| ${group} | [${page}](evaluation/reviews/${file}.md) | ${cells.join(' | ')} |`);
  }
  return lines.join('\n');
}

async function main() {
  const write = process.argv.includes('--write');
  const files = (await readdir(REVIEWS)).filter((f) => f.endsWith('.md') && !f.startsWith('five-second-'));
  const reviews = new Map();
  const problems = [];
  for (const file of files) {
    const name = file.replace(/\.md$/, '');
    const sections = parseReview(await readFile(join(REVIEWS, file), 'utf8'));
    problems.push(...checkReview(name, sections));
    reviews.set(name, sections);
  }
  for (const [, , file] of ROWS) if (!reviews.has(file)) problems.push(`${REVIEWS}/${file}.md is missing`);
  for (const name of reviews.keys()) if (!ROWS.some((r) => r[2] === name)) problems.push(`${name}.md is not in ROWS`);
  if (problems.length) {
    for (const p of problems) console.error(`FAIL ${p}`);
    process.exit(1);
  }

  const report = await readFile(REPORT, 'utf8');
  const start = report.indexOf(START);
  const end = report.indexOf(END);
  if (start < 0 || end < start) {
    console.error(`FAIL ${REPORT}: no ${START} … ${END} block`);
    process.exit(1);
  }
  const block = `${START}\n${table(reviews)}\n${END}`;
  const next = report.slice(0, start) + block + report.slice(end + END.length);
  if (next === report) {
    console.log(`eval-scores: ${reviews.size} reviews, table in ${REPORT} is current`);
  } else if (write) {
    await writeFile(REPORT, next);
    console.log(`eval-scores: wrote the table in ${REPORT}`);
  } else {
    console.error(`FAIL ${REPORT}: the score table is stale; run node scripts/strategy/eval-scores.mjs --write`);
    process.exit(1);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) await main();
