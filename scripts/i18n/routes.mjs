// Checks every built page (dist/**/*.html) against the locale rules in ADR 0002: <html lang>
// matches the URL prefix, so an en or vi URL never serves a zh-TW fallback page, and every locale
// switcher link points at a page that was built, in the language it claims, and every other
// site-internal link stays in the page's locale (navigation, breadcrumbs: no /about on an /en page).
// Language links (the switcher's, and others carrying hreflang), the external sub-sites in docs/ia/nodes.csv (kind
// external, e.g. /tpu) and downloadable files (/upload/….pdf, kept at the current site's path) are
// not locale pages.
// en and vi pages show no Chinese text: no Han characters or full-width punctuation in text or in
// alt, title, aria-label, placeholder and meta content, except inside an element whose lang is zh-TW
// (the switcher's 中文) or Japanese (a company name in the legal text). A zh-TW name or string left
// untranslated fails here.
// Run after `astro build`: node scripts/i18n/routes.mjs [dist]

import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parse } from 'node-html-parser';
import { parseCsv } from '../inventory/csv.mjs';
import { localeFromPath, normalizePath } from '../../src/lib/i18n/paths.ts';

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

// Han characters, and CJK and full-width punctuation (｜, 「」, （）)
const CHINESE = /[\p{Script=Han}\u3000-\u303F\uFF00-\uFFEF]/u;
const TEXT_ATTRIBUTES = ['alt', 'title', 'aria-label', 'placeholder'];
// A file rather than a page: an extension other than .html
const FILE = /\.(?!html$)[a-z0-9]+$/i;

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
 * @returns {string[]}
 */
export function routeProblems(pages, external = new Set()) {
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
      if (href.startsWith('//') || FILE.test(href) || external.has(normalizePath(href)) || a.closest('nav.locale-switcher')) continue;
      if (localeFromPath(href) !== expected) problems.push(`${path}: links to ${href}, outside its locale ${expected}`);
    }
    if (expected !== 'zh-TW') for (const t of chineseText(root)) problems.push(`${path}: Chinese ${t}`);
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
  const problems = routeProblems(pages, externalPaths());
  for (const p of problems) console.log(p);
  console.log(`${pages.size} pages checked, ${problems.length} locale problems`);
  if (problems.length) process.exitCode = 1;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) main(process.argv.slice(2));
