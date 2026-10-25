// Checks that every site-internal reference in the built pages (dist/**/*.html) resolves: links
// (a, area, link), images and sources (src, srcset, poster, og:image, twitter:image) and scripts
// point at a file in dist, resolved like Cloudflare Pages (scripts/lib/static-server.mjs), and a
// #fragment points at an id (or a[name]) on the target page. Internal means relative, root-relative
// or on the origin of the page's canonical URL; external URLs are not fetched (the cloud proxy and
// the old site make that flaky).
// Links to nodes in docs/ia/nodes.csv that have no page yet (hub pages waiting for content, the
// external sub-sites such as /tpu) are listed separately and do not fail: they are planned pages,
// not mistakes. scripts/i18n/routes.mjs checks the locale side of the same links.
// Part of `npm run check`, after the build: node scripts/seo/links.mjs [dist]

import { readFileSync, readdirSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parse } from 'node-html-parser';
import { parseCsv } from '../inventory/csv.mjs';
import { fileKind, servedFile } from '../lib/static-server.mjs';
import { urlPath } from '../i18n/routes.mjs';

const SHOWN = 5;

/** Every URL a page references, as written. @param {import('node-html-parser').HTMLElement} root */
export function references(root) {
  const refs = [];
  const attr = (selector, name) => {
    for (const el of root.querySelectorAll(selector)) refs.push(el.getAttribute(name) ?? '');
  };
  attr('a[href], area[href], link[href]', 'href');
  attr('img[src], script[src], source[src], iframe[src], video[src], audio[src], track[src]', 'src');
  attr('video[poster]', 'poster');
  attr('meta[property="og:image"], meta[name="twitter:image"]', 'content');
  for (const el of root.querySelectorAll('[srcset]')) {
    for (const candidate of (el.getAttribute('srcset') ?? '').split(',')) refs.push(candidate.trim().split(/\s+/)[0] ?? '');
  }
  return refs.filter((r) => r.trim() !== '');
}

/** Fragment targets of a page. @param {import('node-html-parser').HTMLElement} root */
const anchors = (root) => new Set([...root.querySelectorAll('[id]').map((el) => el.id), ...root.querySelectorAll('a[name]').map((el) => el.getAttribute('name') ?? '')]);

/**
 * Unresolved internal references, grouped by target.
 * @param {object} site
 * @param {Map<string, string>} site.pages dist-relative .html file → HTML
 * @param {(file: string) => 'file' | 'dir' | undefined} site.kind what a dist-relative path is
 * @param {ReadonlySet<string>} [site.planned] URL paths of nodes that have no page yet
 * @returns {{ broken: Map<string, Set<string>>, planned: Map<string, Set<string>>, checked: number }} target → URL paths of the pages referencing it
 */
export function linkProblems({ pages, kind, planned = new Set() }) {
  const roots = new Map([...pages].map(([file, html]) => [file, parse(html)]));
  /** @type {Map<string, Set<string>>} */
  const ids = new Map();
  const idsOf = (file) => {
    let set = ids.get(file);
    if (!set) ids.set(file, (set = anchors(roots.get(file) ?? parse(''))));
    return set;
  };
  const broken = new Map();
  const plannedHits = new Map();
  const add = (map, key, page) => map.set(key, (map.get(key) ?? new Set()).add(page));
  let checked = 0;
  for (const [file, root] of roots) {
    const page = urlPath(file);
    const canonical = URL.parse(root.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? '');
    const origin = canonical?.origin ?? 'http://site.invalid';
    const base = new URL(page, origin);
    for (const ref of references(root)) {
      const url = URL.parse(ref, base);
      if (!url || url.origin !== origin) continue;
      checked += 1;
      const path = decodeURIComponent(url.pathname);
      const target = servedFile(path, kind);
      if (!target) {
        add(planned.has(path) ? plannedHits : broken, url.pathname, page);
        continue;
      }
      const fragment = decodeURIComponent(url.hash.slice(1));
      if (fragment && target.endsWith('.html') && !idsOf(target).has(fragment)) add(broken, `${url.pathname}${url.hash}`, page);
    }
  }
  return { broken, planned: plannedHits, checked };
}

/** URL paths of the nodes in docs/ia/nodes.csv @param {string} csv */
export function nodePaths(csv) {
  return new Set(parseCsv(csv.replace(/^\uFEFF/, '')).map((/** @type {Record<string, string>} */ n) => n.path).filter(Boolean));
}

/** @param {string[]} pages */
const sample = (pages) => `${pages.slice(0, SHOWN).join(', ')}${pages.length > SHOWN ? `, … (${pages.length - SHOWN} more)` : ''}`;

/** @param {string[]} args */
function main([dist = resolve(import.meta.dirname, '../../dist')]) {
  const files = readdirSync(dist, { recursive: true, withFileTypes: true })
    .filter((d) => d.isFile() && d.name.endsWith('.html'))
    .map((d) => relative(dist, join(d.parentPath, d.name)).split('\\').join('/'));
  const pages = new Map(files.map((f) => [f, readFileSync(join(dist, f), 'utf8')]));
  const planned = nodePaths(readFileSync(resolve(import.meta.dirname, '../../docs/ia/nodes.csv'), 'utf8'));
  const { broken, planned: plannedHits, checked } = linkProblems({ pages, kind: fileKind(dist), planned });
  const byTarget = (map) => [...map].map(([target, from]) => [target, [...from].sort()]).sort(([a], [b]) => a.localeCompare(b));
  if (broken.size) {
    console.log(`Broken internal links: ${broken.size} targets`);
    for (const [target, from] of byTarget(broken)) console.log(`  ${target}\n    ← ${from.length} page(s): ${sample(from)}`);
  }
  if (plannedHits.size) {
    const targets = byTarget(plannedHits);
    console.log(`Planned pages not built yet (docs/ia/nodes.csv, not an error): ${targets.map(([t, from]) => `${t} (${from.length})`).join(', ')}`);
  }
  console.log(`${pages.size} pages, ${checked} internal references checked, ${broken.size} broken targets`);
  if (broken.size) process.exitCode = 1;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) main(process.argv.slice(2));
