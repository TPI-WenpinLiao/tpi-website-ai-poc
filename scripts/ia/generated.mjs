// Helpers shared by scripts/ia/sitemap.mjs, scripts/ia/navigation.mjs and scripts/ia/redirects.mjs.

import { readFile, writeFile } from 'node:fs/promises';

// URL rule from docs/decisions/0002-url-and-locale.md: lowercase kebab-case segments or {placeholder}, no trailing slash
export const PATH_PATTERN = /^\/$|^(\/([a-z0-9]+(-[a-z0-9]+)*|\{[a-z]+\}))+$/;

// Old slug normalized per ADR 0002: lowercased, runs of "-" collapsed, edge "-" trimmed
export const normalizeSlug = (s) => s.toLowerCase().replace(/-+/g, '-').replace(/^-|-$/g, '');

// Key of `routes` (a Map keyed by route) matching `key`: an exact route, else the longest "/prefix/*" pattern
export function matchRoute(routes, key) {
  if (routes.has(key)) return key;
  let best;
  for (const route of routes.keys()) {
    if (route.endsWith('/*') && key.startsWith(route.slice(0, -1)) && (!best || route.length > best.length)) best = route;
  }
  return best;
}

// Distance from the root of the sitemap (home is 0)
export function depth(n, byId) {
  let d = 0;
  for (let cur = n; cur.parent; cur = byId.get(cur.parent)) d++;
  return d;
}

// Replace the text between two marker comments in `doc` (read from `path`), markers included;
// `section` must start and end with them
export function replaceSection(doc, path, start, end, section) {
  const from = doc.indexOf(start);
  const to = doc.indexOf(end);
  if (from < 0 || to < from) throw new Error(`${path}: generated section markers not found`);
  return doc.slice(0, from) + section + doc.slice(to + end.length);
}

// Write each [path, content] pair, or with `check` only compare them to the files on disk and report
// the ones that differ (missing files included), naming `rerun` as the fix. Check mode never writes.
// Returns the stale paths.
export async function emit(outputs, { check, rerun }) {
  if (!check) {
    for (const [path, content] of outputs) await writeFile(path, content);
    return [];
  }
  const stale = [];
  for (const [path, content] of outputs) {
    const current = await readFile(path, 'utf8').catch((e) => (e.code === 'ENOENT' ? null : Promise.reject(e)));
    if (current !== content) stale.push(path);
  }
  for (const path of stale) console.error(`${path} is out of date; run: ${rerun}`);
  return stale;
}
