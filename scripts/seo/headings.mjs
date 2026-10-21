// Checks every built page (dist/**/*.html) for the heading rules in seo-checklist: exactly one h1,
// and no skipped levels going down (h2 → h4). Going back up (h4 → h2) is fine. Lighthouse only
// samples a few pages, so this covers all of them.
// Run after `astro build`: node scripts/seo/headings.mjs [dist]

import { readFileSync, readdirSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parse } from 'node-html-parser';

/** Heading problems in one HTML document. @param {string} html @returns {string[]} */
export function headingProblems(html) {
  const levels = parse(html)
    .querySelectorAll('h1, h2, h3, h4, h5, h6')
    .map((h) => ({ level: Number(h.tagName[1]), text: h.text.trim().slice(0, 40) }));
  const problems = [];
  const h1 = levels.filter((h) => h.level === 1).length;
  if (h1 !== 1) problems.push(`expected 1 h1, found ${h1}`);
  levels.forEach((h, i) => {
    const prev = levels[i - 1];
    if (prev && h.level > prev.level + 1) problems.push(`h${prev.level} → h${h.level} skips a level at "${h.text}"`);
  });
  return problems;
}

/** @param {string[]} args */
function main([dist = resolve(import.meta.dirname, '../../dist')]) {
  const pages = readdirSync(dist, { recursive: true })
    .map(String)
    .filter((f) => f.endsWith('.html'));
  let count = 0;
  for (const page of pages) {
    for (const p of headingProblems(readFileSync(join(dist, page), 'utf8'))) {
      console.log(`${relative(process.cwd(), join(dist, page))}: ${p}`);
      count += 1;
    }
  }
  console.log(`${pages.length} pages checked, ${count} heading problems`);
  if (count) process.exitCode = 1;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) main(process.argv.slice(2));
