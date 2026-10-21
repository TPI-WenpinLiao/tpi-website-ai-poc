// Checks the built CSS (dist/) for `animation` shorthands that carry a scroll-driven timeline.
// Lightning CSS folds `animation` + `animation-timeline` into `animation: ... view()`, but browsers
// only accept animation-timeline as a longhand, so the whole declaration is dropped and the
// animation never runs (the scroll progress bar sat at 100%). Write scroll-driven animations as
// longhands; this script catches the shorthand form in the output.
// Run after `astro build`: node scripts/design/dist-css.mjs [dist]

import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const TIMELINE = /\b(?:scroll|view)\(|(?:^|\s)--[\w-]+(?=\s|$)/;

/** Returns every `animation:` value in the CSS that names a timeline. @param {string} css */
export function findTimelineShorthands(css) {
  return [...css.matchAll(/(?<![\w-])animation\s*:\s*([^;}]*)/g)].map((m) => m[1].trim()).filter((v) => TIMELINE.test(v));
}

/** @param {string} dir @returns {string[]} */
function files(dir) {
  return readdirSync(dir, { recursive: true })
    .map(String)
    .filter((f) => f.endsWith('.css') || f.endsWith('.html'))
    .map((f) => join(dir, f));
}

/** @param {string[]} args */
function main([dist = resolve(import.meta.dirname, '../../dist')]) {
  let count = 0;
  for (const file of files(dist)) {
    for (const value of findTimelineShorthands(readFileSync(file, 'utf8'))) {
      console.log(`${file}: animation: ${value}`);
      count += 1;
    }
  }
  console.log(`${count} animation shorthands with a scroll timeline`);
  if (count) process.exitCode = 1;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) main(process.argv.slice(2));
