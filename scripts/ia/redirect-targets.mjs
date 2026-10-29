// Checks docs/ia/redirects.csv against the build (M8-01, #43): every row's target, the 200 rows
// included, must be a page or file in dist, resolved like Cloudflare Pages
// (scripts/lib/static-server.mjs), and no target may itself be the source of another redirect
// (a chain). scripts/ia/redirects.mjs only knows the nodes; whether a locale has the content entry,
// or an offering has downloads, shows only in the build: a page that isn't built gets a row in
// docs/ia/redirect-overrides.csv (#137). A redirect source on the main host that is built fails
// too, since the redirect would hide that page, e.g. once an overridden page gets built.
// Not an error: targets on external nodes (sub-sites such as /tpu) and the PENDING pages of
// scripts/seo/links.mjs in any locale. A PENDING page that gets built fails, until it is taken off the list.
// Part of `npm run check`, after the build: node scripts/ia/redirect-targets.mjs [dist]

import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { readCsv } from '../inventory/csv.mjs';
import { fileKind, servedFile } from '../lib/static-server.mjs';
import { externalPaths } from '../i18n/routes.mjs';
import { PENDING } from '../seo/links.mjs';
import { MAIN_HOST } from './redirects.mjs';

/** The target path without its locale prefix @param {string} path */
const unprefixed = (path) => path.replace(/^\/(en|vi)(?=\/|$)/, '') || '/';

/**
 * @param {object} site
 * @param {Record<string, string>[]} site.rows docs/ia/redirects.csv
 * @param {(file: string) => 'file' | 'dir' | undefined} site.kind what a dist-relative path is
 * @param {ReadonlySet<string>} [site.external] paths of external nodes
 * @param {string[]} [site.pending] PENDING pages, without locale prefix
 */
export function redirectProblems({ rows, kind, external = new Set(), pending = [] }) {
  /** @type {Map<string, string[]>} target → sources */
  const missing = new Map();
  /** @type {Map<string, string[]>} */
  const known = new Map();
  const chains = [];
  const built = (path) => {
    try {
      return servedFile(decodeURIComponent(path), kind) !== undefined;
    } catch {
      // Malformed percent-encoding: no file can serve it
      return false;
    }
  };
  const add = (map, key, from) => map.set(key, [...(map.get(key) ?? []), from]);
  // Sources that redirect, on the host the new site replaces; other hosts never reach these paths
  const sources = new Set(rows.filter((r) => r.status === '301' && new URL(r.from).host === MAIN_HOST && !r.from.includes('*')).map((r) => new URL(r.from).pathname));
  let checked = 0;
  for (const r of rows) {
    // Catch-alls (/ja/* → /en, /vn/* → /vi/:splat) have no single target
    if (r.from.includes('*')) continue;
    checked += 1;
    if (sources.has(r.to)) chains.push(`${r.from} → ${r.to}, which redirects again`);
    if (built(r.to)) continue;
    if (external.has(r.to) || pending.includes(unprefixed(r.to))) add(known, r.to, r.from);
    else add(missing, r.to, r.from);
  }
  const shadowed = [...sources].filter((path) => built(path));
  const stale = pending.filter((p) => built(p));
  return { checked, missing, known, chains, shadowed, stale };
}

/** @param {string[]} args */
async function main([dist = resolve(import.meta.dirname, '../../dist')]) {
  const rows = await readCsv(resolve(import.meta.dirname, '../../docs/ia/redirects.csv'));
  const { checked, missing, known, chains, shadowed, stale } = redirectProblems({
    rows,
    kind: fileKind(dist),
    external: externalPaths(),
    pending: PENDING,
  });
  for (const [to, from] of missing) console.log(`not built: ${to} ← ${from.join(', ')}`);
  for (const line of chains) console.log(`chain: ${line}`);
  for (const path of shadowed) console.log(`${path} is built, but a redirect hides it: drop its row from docs/ia/redirect-overrides.csv if it has one`);
  for (const path of stale) console.log(`${path} is built now: remove it from PENDING in scripts/seo/links.mjs`);
  const knownRows = [...known.values()].reduce((n, from) => n + from.length, 0);
  console.log(`${checked} redirect rows checked: ${missing.size} targets not built, ${chains.length} chains, ${shadowed.length} built pages redirected; ${knownRows} rows to external nodes or PENDING targets (${known.size} targets), not an error`);
  if (missing.size || chains.length || shadowed.length || stale.length) process.exitCode = 1;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) await main(process.argv.slice(2));
