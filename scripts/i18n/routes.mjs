// Checks every built page (dist/**/*.html) against the locale rules in ADR 0002: <html lang>
// matches the URL prefix, so an en or vi URL never serves a zh-TW fallback page, and every locale
// switcher link points at a page that was built, in the language it claims. Every other
// site-internal link stays in the page's locale whenever that locale has the page (navigation,
// breadcrumbs: no /about on an /en page once /en/about exists; until then the zh-TW page is the
// fallback), never points at an en or vi page that was not built, and a link to a file (a download,
// anything whose last path segment has an extension) points at a file in dist.
// Language links (the switcher's, and others carrying hreflang) and the external sub-sites in docs/ia/nodes.csv (kind
// external, e.g. /tpu) are not locale pages. Unbuilt zh-TW targets are nodes without content yet
// and are not reported here.
// en and vi pages show no Chinese text: no Han characters or full-width punctuation in text or in
// alt, title, aria-label, placeholder and meta content, except inside an element whose lang is zh-TW
// (the switcher's 中文, a link to a zh-TW fallback page) or Japanese (a company name in the legal
// text). A zh-TW name or string left untranslated fails here.
// Run after `astro build`: node scripts/i18n/routes.mjs [dist]

import { readFileSync, readdirSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parse } from 'node-html-parser';
import { parseCsv } from '../inventory/csv.mjs';
import { DEFAULT_LOCALE } from '../../src/lib/i18n/locales.ts';
import { localeFromPath, localizePath, normalizePath } from '../../src/lib/i18n/paths.ts';

/** URL path of a dist file: index.html → /, en.html → /en. @param {string} file */
export const urlPath = (file) => normalizePath(`/${file.split('\\').join('/')}`);

/** Paths of the external nodes in docs/ia/nodes.csv, which have no locale versions */
export function externalPaths(csv = readFileSync(resolve(import.meta.dirname, '../../docs/ia/nodes.csv'), 'utf8')) {
  return new Set(
    parseCsv(csv.replace(/^\uFEFF/, ''))
      .filter((/** @type {Record<string, string>} */ n) => n.kind === 'external')
      .map((/** @type {Record<string, string>} */ n) => n.path),
  );
}

/** A path to a file rather than a page: page paths never contain a dot (ADR 0002) @param {string} path */
const isFile = (path) => /\.[^/]*$/.test(path);

// Han characters, and CJK and full-width punctuation (｜, 「」, （）)
const CHINESE = /[\p{Script=Han}\u3000-\u303F\uFF00-\uFFEF]/u;
const TEXT_ATTRIBUTES = ['alt', 'title', 'aria-label', 'placeholder'];
/** @param {import('node-html-parser').HTMLElement} el */
const inChinese = (el) => {
  for (let cur = el; cur; cur = cur.parentNode) if (/^(?:zh|ja)\b/.test(cur.getAttribute?.('lang') ?? '')) return true;
  return false;
};

/**
 * Chinese text on a page that isn't zh-TW: each offending text, with where it is.
 * @param {import('node-html-parser').HTMLElement} root
 * @returns {string[]}
 */
export function chineseText(root) {
  const found = [];
  const walk = (/** @type {import('node-html-parser').Node} */ node) => {
    if (node.nodeType === 3) {
      const text = node.text.trim();
      if (CHINESE.test(text) && !inChinese(/** @type {any} */ (node.parentNode))) found.push(`text "${text.slice(0, 60)}"`);
      return;
    }
    const el = /** @type {import('node-html-parser').HTMLElement} */ (node);
    if (['script', 'style'].includes(el.rawTagName?.toLowerCase())) return;
    for (const name of TEXT_ATTRIBUTES) {
      const value = el.getAttribute?.(name);
      if (value && CHINESE.test(value) && !inChinese(el)) found.push(`${el.rawTagName} ${name}="${value.slice(0, 60)}"`);
    }
    if (el.rawTagName === 'meta' && CHINESE.test(el.getAttribute('content') ?? '')) found.push(`meta ${el.getAttribute('name') ?? el.getAttribute('property')}="${el.getAttribute('content')?.slice(0, 60)}"`);
    for (const child of el.childNodes ?? []) walk(child);
  };
  walk(root);
  return found;
}

/**
 * Locale problems across built pages, keyed by URL path.
 * @param {Map<string, string>} pages URL path → HTML
 * @param {ReadonlySet<string>} [external] locale-neutral paths (externalPaths())
 * @param {ReadonlySet<string>} [files] decoded URL paths of the other files in dist
 * @returns {string[]}
 */
export function routeProblems(pages, external = new Set(), files = new Set()) {
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
    for (const a of root.querySelectorAll('a[href^="/"]:not([hreflang])')) {
      const href = (a.getAttribute('href') ?? '').split(/[?#]/)[0];
      if (href.startsWith('//') || external.has(normalizePath(href)) || a.closest('nav.locale-switcher')) continue;
      if (isFile(href)) {
        if (!files.has(decodeURIComponent(href))) problems.push(`${path}: links to the file ${href}, which is not in dist`);
        continue;
      }
      const target = localeFromPath(href);
      if (target !== DEFAULT_LOCALE && !pages.has(normalizePath(href))) problems.push(`${path}: links to ${href}, which was not built`);
      else if (target !== expected && pages.has(localizePath(href, expected))) problems.push(`${path}: links to ${href}, outside its locale ${expected}, which has the page`);
    }
    if (expected !== DEFAULT_LOCALE) for (const t of chineseText(root)) problems.push(`${path}: Chinese ${t}`);
  }
  return problems;
}

/** @param {string[]} args */
function main([dist = resolve(import.meta.dirname, '../../dist')]) {
  const all = readdirSync(dist, { recursive: true, withFileTypes: true }).filter((d) => d.isFile()).map((d) => relative(dist, join(d.parentPath, d.name)));
  const pages = new Map(all.filter((f) => f.endsWith('.html')).map((f) => [urlPath(f), readFileSync(join(dist, f), 'utf8')]));
  const files = new Set(all.filter((f) => !f.endsWith('.html')).map((f) => `/${f.split('\\').join('/')}`));
  const problems = routeProblems(pages, externalPaths(), files);
  for (const p of problems) console.log(p);
  console.log(`${pages.size} pages checked, ${problems.length} locale problems`);
  if (problems.length) process.exitCode = 1;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) main(process.argv.slice(2));
