// Checks every built page (dist/**/*.html) against the locale rules in ADR 0002: <html lang>
// matches the URL prefix, so an en or vi URL never serves a zh-TW fallback page, and every locale
// switcher link points at a page that was built, in the language it claims.
// Run after `astro build`: node scripts/i18n/routes.mjs [dist]

import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parse } from 'node-html-parser';
import { localeFromPath, normalizePath } from '../../src/lib/i18n/paths.ts';

/** URL path of a dist file: index.html → /, en.html → /en. @param {string} file */
export const urlPath = (file) => normalizePath(`/${file.split('\\').join('/')}`);

/**
 * Locale problems across built pages, keyed by URL path.
 * @param {Map<string, string>} pages URL path → HTML
 * @returns {string[]}
 */
export function routeProblems(pages) {
  const problems = [];
  for (const [path, html] of pages) {
    const root = parse(html);
    const expected = localeFromPath(path);
    const lang = root.querySelector('html')?.getAttribute('lang');
    if (lang !== expected) problems.push(`${path}: <html lang="${lang ?? ''}">, expected ${expected}`);
    for (const a of root.querySelectorAll('nav.locale-switcher a[href]')) {
      const href = a.getAttribute('href') ?? '';
      if (href.startsWith('#')) continue;
      if (!pages.has(normalizePath(href))) problems.push(`${path}: locale switcher links to ${href}, which was not built`);
      const linkLang = a.getAttribute('lang');
      if (linkLang !== localeFromPath(href)) problems.push(`${path}: locale switcher link ${href} has lang="${linkLang ?? ''}"`);
    }
  }
  return problems;
}

/** @param {string[]} args */
function main([dist = resolve(import.meta.dirname, '../../dist')]) {
  const pages = new Map(
    readdirSync(dist, { recursive: true })
      .map(String)
      .filter((f) => f.endsWith('.html'))
      .map((f) => [urlPath(f), readFileSync(join(dist, f), 'utf8')]),
  );
  const problems = routeProblems(pages);
  for (const p of problems) console.log(p);
  console.log(`${pages.size} pages checked, ${problems.length} locale problems`);
  if (problems.length) process.exitCode = 1;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) main(process.argv.slice(2));
