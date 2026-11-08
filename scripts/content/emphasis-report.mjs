// Lists the bolded text (<strong>) in the <main> of every built page, to see what a change to the
// number rules in src/lib/content/emphasis.ts bolds (#210). Compare two builds to review a change:
//   node scripts/content/emphasis-report.mjs --out before.json      (on the old build)
//   node scripts/content/emphasis-report.mjs --diff before.json     (on the new build)
// Only lists; the rules themselves are tested in emphasis.test.mjs.
// Run after `astro build`: node scripts/content/emphasis-report.mjs [--out <file>] [--diff <file>] [--dist <dir>]

import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parse } from 'node-html-parser';

/** The bolded strings in one HTML document's <main>, in page order. @param {string} html @returns {string[]} */
export function strongTexts(html) {
  const main = parse(html).querySelector('main');
  return main ? main.querySelectorAll('strong').map((s) => s.text.replace(/\s+/g, ' ').trim()) : [];
}

/** @param {string} dist @returns {Record<string, string[]>} */
function report(dist) {
  /** @type {Record<string, string[]>} */
  const pages = {};
  for (const f of readdirSync(dist, { recursive: true }).map(String).filter((f) => f.endsWith('.html')).sort()) {
    const strongs = strongTexts(readFileSync(join(dist, f), 'utf8'));
    if (strongs.length) pages[f] = strongs;
  }
  return pages;
}

/** Strings in `after` but not `before` (+), and the other way (−), per page; a multiset difference. */
export function diff(/** @type {Record<string, string[]>} */ before, /** @type {Record<string, string[]>} */ after) {
  const minus = (/** @type {string[]} */ a, /** @type {string[]} */ b) => {
    const left = [...b];
    return a.filter((s) => {
      const i = left.indexOf(s);
      if (i === -1) return true;
      left.splice(i, 1);
      return false;
    });
  };
  /** @type {Record<string, { added: string[]; removed: string[] }>} */
  const out = {};
  for (const page of new Set([...Object.keys(before), ...Object.keys(after)])) {
    const added = minus(after[page] ?? [], before[page] ?? []);
    const removed = minus(before[page] ?? [], after[page] ?? []);
    if (added.length || removed.length) out[page] = { added, removed };
  }
  return out;
}

/** @param {string[]} args */
function main(args) {
  const opt = (/** @type {string} */ name) => {
    const i = args.indexOf(name);
    return i === -1 ? undefined : args[i + 1];
  };
  const dist = resolve(opt('--dist') ?? resolve(import.meta.dirname, '../../dist'));
  const now = report(dist);
  const out = opt('--out');
  const against = opt('--diff');
  if (out) writeFileSync(out, `${JSON.stringify(now, null, 2)}\n`);
  if (against) {
    const changes = diff(JSON.parse(readFileSync(against, 'utf8')), now);
    for (const [page, { added, removed }] of Object.entries(changes)) {
      console.log(page);
      if (added.length) console.log(`  + ${added.join(' | ')}`);
      if (removed.length) console.log(`  − ${removed.join(' | ')}`);
    }
    console.log(`${Object.keys(changes).length} pages changed`);
  } else if (!out) {
    for (const [page, strongs] of Object.entries(now)) console.log(`${page}: ${strongs.join(' | ')}`);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) main(process.argv.slice(2));
