// Checks the <head> of every built page (dist/**/*.html) and dist/sitemap.xml against
// seo-checklist「每頁必備」: one non-empty title and description, both unique across the site;
// canonical is the page's own absolute URL; the Open Graph and Twitter tags are there; no robots
// meta with noindex (the site is kept out of search engines by _headers and robots.txt only);
// hreflang lists the page itself, every target was built and lists the same set back, x-default
// points at the zh-TW version exactly when there is one; every JSON-LD block parses; the sitemap
// lists exactly the non-internal pages, by canonical, with the same hreflang as their <head>.
// Lighthouse only samples a few pages, so this covers all of them.
// Run after `astro build`: node scripts/seo/meta.mjs [dist]

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parse } from 'node-html-parser';
import { DEFAULT_LOCALE } from '../../src/lib/i18n/locales.ts';
import { localeFromPath } from '../../src/lib/i18n/paths.ts';
import { inSitemap } from '../../src/lib/seo/indexing.ts';
import { urlPath } from '../i18n/routes.mjs';

const REQUIRED_META = [
  'property="og:type"',
  'property="og:title"',
  'property="og:description"',
  'property="og:image"',
  'property="og:locale"',
  'property="og:site_name"',
  'name="twitter:card"',
  'name="twitter:title"',
  'name="twitter:description"',
];

const sameSet = (a, b) => a.length === b.length && a.every((x) => b.includes(x));
const altKey = (a) => `${a.hreflang} ${a.href}`;

/**
 * The SEO-relevant parts of one page's <head>.
 * @param {string} html
 */
export function readHead(html) {
  const head = parse(html).querySelector('head');
  const all = (selector) => head?.querySelectorAll(selector) ?? [];
  const content = (selector) => all(selector).map((el) => el.getAttribute('content') ?? el.getAttribute('href') ?? '');
  return {
    titles: all('title').map((t) => t.text.trim()),
    descriptions: content('meta[name="description"]'),
    canonicals: content('link[rel="canonical"]'),
    ogUrls: content('meta[property="og:url"]'),
    meta: Object.fromEntries(REQUIRED_META.map((attr) => [attr, content(`meta[${attr}]`)])),
    robots: all('meta').filter((m) => /^(robots|googlebot)$/i.test(m.getAttribute('name') ?? '')).map((m) => m.getAttribute('content') ?? ''),
    alternates: all('link[rel="alternate"][hreflang]').map((l) => ({ hreflang: l.getAttribute('hreflang') ?? '', href: l.getAttribute('href') ?? '' })),
    jsonLd: all('script[type="application/ld+json"]').map((s) => s.text),
  };
}

/**
 * The <url> entries of a sitemap.xml written by src/lib/seo/sitemap.ts.
 * @param {string} xml
 */
export function readSitemap(xml) {
  return [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, body]) => ({
    loc: /<loc>([^<]*)<\/loc>/.exec(body)?.[1] ?? '',
    alternates: [...body.matchAll(/<xhtml:link rel="alternate" hreflang="([^"]*)" href="([^"]*)"\/>/g)].map(([, hreflang, href]) => ({ hreflang, href })),
  }));
}

/**
 * SEO problems across built pages.
 * @param {Map<string, string>} pages URL path → HTML
 * @param {string | null} sitemap sitemap.xml contents, null when the file is missing
 * @returns {string[]}
 */
export function metaProblems(pages, sitemap) {
  const problems = [];
  const heads = new Map([...pages].map(([path, html]) => [path, readHead(html)]));
  const origins = new Set();
  const byPath = new Map();
  const seen = { title: new Map(), description: new Map() };

  for (const [path, h] of heads) {
    const p = (msg) => problems.push(`${path}: ${msg}`);
    for (const [kind, values] of [['title', h.titles], ['description', h.descriptions]]) {
      if (values.length !== 1 || !values[0]) p(`expected 1 non-empty ${kind}, found ${values.length}`);
      else if (seen[kind].has(values[0])) p(`${kind} "${values[0]}" is also used by ${seen[kind].get(values[0])}`);
      else seen[kind].set(values[0], path);
    }
    if (h.canonicals.length !== 1) p(`expected 1 canonical, found ${h.canonicals.length}`);
    const canonical = h.canonicals[0];
    if (canonical) {
      const url = URL.parse(canonical);
      if (!url || url.pathname !== path || url.search || url.hash) p(`canonical ${canonical} is not this page's own URL`);
      else {
        origins.add(url.origin);
        byPath.set(path, canonical);
      }
      if (h.ogUrls.length !== 1 || h.ogUrls[0] !== canonical) p(`og:url ${h.ogUrls.join(', ') || '(missing)'} differs from canonical`);
    }
    for (const [attr, values] of Object.entries(h.meta)) if (values.length !== 1 || !values[0]) p(`expected 1 non-empty meta[${attr}], found ${values.length}`);
    for (const r of h.robots) if (/noindex/i.test(r)) p(`robots meta "${r}": the site is kept out of search engines by _headers and robots.txt, not by noindex`);
    for (const [i, json] of h.jsonLd.entries()) {
      try {
        if (JSON.parse(json)['@context'] !== 'https://schema.org') p(`JSON-LD block ${i + 1} has no schema.org @context`);
      } catch (e) {
        p(`JSON-LD block ${i + 1} does not parse: ${e.message}`);
      }
    }
  }
  if (origins.size > 1) problems.push(`canonical URLs use more than one origin: ${[...origins].join(', ')}`);

  // hreflang: versions are compared by URL path, so the check does not depend on the origin
  const pathOf = (href) => URL.parse(href)?.pathname ?? href;
  for (const [path, h] of heads) {
    const p = (msg) => problems.push(`${path}: ${msg}`);
    const versions = h.alternates.filter((a) => a.hreflang !== 'x-default');
    const self = versions.find((a) => pathOf(a.href) === path);
    if (!self || self.hreflang !== localeFromPath(path)) p(`hreflang does not list the page itself as ${localeFromPath(path)}`);
    for (const a of versions) {
      if (localeFromPath(pathOf(a.href)) !== a.hreflang) p(`hreflang="${a.hreflang}" points at ${a.href}, a page of another locale`);
      const target = heads.get(pathOf(a.href));
      if (!target) p(`hreflang="${a.hreflang}" points at ${a.href}, which was not built`);
      else if (!sameSet(target.alternates.map(altKey), h.alternates.map(altKey))) p(`hreflang set differs from the one on ${pathOf(a.href)}`);
    }
    const defaults = h.alternates.filter((a) => a.hreflang === 'x-default');
    const zh = versions.find((a) => a.hreflang === DEFAULT_LOCALE);
    if (zh ? defaults.length !== 1 || defaults[0].href !== zh.href : defaults.length) {
      p(`x-default must point at the ${DEFAULT_LOCALE} version when there is one, and be left out otherwise`);
    }
  }

  if (sitemap === null) problems.push('sitemap.xml was not built');
  else {
    const entries = readSitemap(sitemap);
    const expected = [...byPath].filter(([path]) => inSitemap(path)).map(([, canonical]) => canonical);
    const locs = entries.map((e) => e.loc);
    for (const loc of expected) if (!locs.includes(loc)) problems.push(`sitemap.xml: missing ${loc}`);
    for (const e of entries) {
      if (!expected.includes(e.loc)) problems.push(`sitemap.xml: ${e.loc} is not a built, listable page`);
      else if (locs.indexOf(e.loc) !== locs.lastIndexOf(e.loc)) problems.push(`sitemap.xml: ${e.loc} is listed twice`);
      const head = heads.get(pathOf(e.loc));
      if (head && !sameSet(e.alternates.map(altKey), head.alternates.map(altKey))) problems.push(`sitemap.xml: hreflang for ${e.loc} differs from the page's <head>`);
    }
  }
  return [...new Set(problems)];
}

/** @param {string[]} args */
function main([dist = resolve(import.meta.dirname, '../../dist')]) {
  const pages = new Map(
    readdirSync(dist, { recursive: true })
      .map(String)
      .filter((f) => f.endsWith('.html'))
      .map((f) => [urlPath(f), readFileSync(join(dist, f), 'utf8')]),
  );
  const file = join(dist, 'sitemap.xml');
  const problems = metaProblems(pages, existsSync(file) ? readFileSync(file, 'utf8') : null);
  for (const p of problems) console.log(p);
  console.log(`${pages.size} pages and sitemap.xml checked, ${problems.length} SEO problems`);
  if (problems.length) process.exitCode = 1;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) main(process.argv.slice(2));
