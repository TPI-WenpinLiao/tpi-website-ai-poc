// Old-site redirect map for M2-05 (#12).
// Reads docs/research/inventory.csv, docs/ia/page-map.csv (scripts/ia/sitemap.mjs), docs/ia/nodes.csv and the
// hand-written docs/ia/drop-targets.csv and docs/ia/redirect-overrides.csv, maps every inventory URL to its new path (rules: docs/decisions/0002-url-and-locale.md)
// and writes docs/ia/redirects.csv. Rows whose path doesn't change get status 200 and no redirect rule.
// Re-run after editing any input or re-running scripts/ia/sitemap.mjs: node scripts/ia/redirects.mjs
// With --check it validates the same way but only compares the output to the file on disk (npm run check:ia).
// With --redirects <file> it also writes the Cloudflare Pages _redirects rules for www.tpisoftware.com.

import { writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { readCsv, csvCell } from '../inventory/csv.mjs';
import { routeKey } from '../inventory/routes.mjs';
import { PATH_PATTERN, emit, matchRoute, normalizeSlug } from './generated.mjs';

const INVENTORY = 'docs/research/inventory.csv';
const PAGE_MAP = 'docs/ia/page-map.csv';
const NODES = 'docs/ia/nodes.csv';
const DROP_TARGETS = 'docs/ia/drop-targets.csv';
export const OVERRIDES = 'docs/ia/redirect-overrides.csv';
const REDIRECTS = 'docs/ia/redirects.csv';

// The host the new site replaces; _redirects can only match paths, so other hosts (www.tpisoftware.vn) need domain-level rules
export const MAIN_HOST = 'www.tpisoftware.com';
const PREFIX = { 'zh-TW': '', en: '/en', vi: '/vi' };
// Cloudflare Pages _redirects limits (developers.cloudflare.com/pages/configuration/redirects)
const MAX_STATIC = 2000;
const MAX_DYNAMIC = 100;
const MAX_LINE = 1000;

// Catch-alls for old URLs outside the inventory (ADR 0002 "影響"); Japanese is not supported, so /ja goes to the en home
const FALLBACKS = [
  { from: `https://${MAIN_HOST}/ja/*`, to: '/en', note: '日文版不支援（ADR 0002）' },
  { from: `https://${MAIN_HOST}/vn/*`, to: '/vi/:splat', note: 'vi 改用 /vi 前綴（ADR 0002）' },
  { from: 'https://www.tpisoftware.vn/*', to: '/vi/:splat', note: 'vi 改用 /vi 前綴（ADR 0002）；網域層級，不在 _redirects' },
];

const withPrefix = (locale, path) => (PREFIX[locale] + (path === '/' ? '' : path)) || '/';

// New path of a kept / rewritten / merged row, placeholders filled from the old URL
function newPath(row, node) {
  // Downloadable files keep their file path and are not localized
  if (node.kind === 'asset') return new URL(row.url).pathname;
  const last = new URL(row.url).pathname.split('/').filter(Boolean).at(-1);
  const path = node.path.replace(/\{([a-z]+)\}/, (_, name) => (name === 'slug' && row.blog_slug) || normalizeSlug(last));
  return withPrefix(row.locale, path);
}

export function buildRedirects({ inventory, pageMap, nodes, dropTargets, overrides = [] }) {
  const errors = [];
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const mapped = new Map(pageMap.map((r) => [r.url, r]));
  const dropRoutes = new Map(dropTargets.map((d) => [d.route, d.node]));
  // Kept rows whose page the build doesn't have (no content entry, no downloads): url → that page and the one to send them to
  const overrideOf = new Map();
  for (const o of overrides) {
    if (overrideOf.has(o.url)) errors.push(`${OVERRIDES}: duplicate url: ${o.url}`);
    if (!o.reason?.trim()) errors.push(`${OVERRIDES}: no reason: ${o.url}`);
    overrideOf.set(o.url, o);
  }

  // Pass 1: keep / rewrite / merge rows; their targets are the pages the new site has in each locale
  const targets = new Map();
  const exists = new Set();
  for (const row of inventory.filter((r) => r.disposition !== 'drop')) {
    const m = mapped.get(row.url);
    const node = m && byId.get(m.node);
    if (!node) {
      errors.push(`missing from ${PAGE_MAP}: ${row.url}`);
      continue;
    }
    const to = newPath(m, node);
    const override = overrideOf.get(row.url);
    const overridden = override && { to: override.to, note: `${row.disposition}：${node.id}（redirect-overrides.csv）` };
    // An empty `unbuilt`: the page this row maps to is built, but in the wrong locale (en PDFs the inventory files under zh-TW)
    if (override?.unbuilt) {
      // scripts/ia/redirect-targets.mjs fails once `unbuilt` gets built, so it must be the page this row maps to
      if (override.unbuilt !== to) errors.push(`${OVERRIDES}: unbuilt is "${override.unbuilt}", the row maps to "${to}": ${row.url}`);
      // The node's page is not built, so it is not a target dropped rows may use either
      targets.set(row.url, overridden);
      continue;
    }
    if (node.kind === 'page' || node.kind === 'collection') {
      if (!PATH_PATTERN.test(to)) errors.push(`new path "${to}" breaks the URL rule (ADR 0002): ${row.url}`);
      exists.add(to);
    }
    targets.set(row.url, overridden || { to, note: `${row.disposition}：${node.id}` });
  }
  const kept = new Set(inventory.filter((r) => r.disposition !== 'drop').map((r) => r.url));
  // An override may also send a row to a page node in any locale, such as another locale's legal page;
  // scripts/ia/redirect-targets.mjs checks that it is built
  const nodePages = new Set(nodes.filter((n) => n.kind === 'page' && n.path).flatMap((n) => Object.keys(PREFIX).map((l) => withPrefix(l, n.path))));
  for (const { url, to } of overrideOf.values()) {
    if (!kept.has(url)) errors.push(`${OVERRIDES}: not a keep / rewrite / merge row of ${INVENTORY}: ${url}`);
    else if (!exists.has(to) && !nodePages.has(to)) errors.push(`${OVERRIDES}: "${to}" is not a page of the new site: ${url}`);
  }

  // Pass 2: dropped rows go to the nearest parent page the new site has in the same locale
  for (const row of inventory.filter((r) => r.disposition === 'drop')) {
    const key = routeKey(row.url).toLowerCase();
    if (row.locale === 'ja') {
      targets.set(row.url, { to: '/en', note: 'drop：日文版不支援（ADR 0002）' });
      continue;
    }
    let to;
    let note;
    const override = dropRoutes.get(matchRoute(dropRoutes, key));
    if (override) {
      if (!byId.has(override)) {
        errors.push(`${DROP_TARGETS}: node "${override}" not found: ${row.url}`);
        continue;
      }
      to = withPrefix(row.locale, byId.get(override).path);
      note = `drop：${DROP_TARGETS}`;
    } else {
      const segments = key.split('/').filter(Boolean);
      for (let n = segments.length - 1; n > 0 && !to; n--) {
        const parent = withPrefix(row.locale, `/${segments.slice(0, n).join('/')}`);
        if (exists.has(parent)) to = parent;
      }
      note = 'drop：上層頁';
    }
    if (!to || !exists.has(to)) {
      errors.push(`dropped row without a parent page in ${row.locale}; add it to ${DROP_TARGETS}: ${row.url}`);
      continue;
    }
    targets.set(row.url, { to, note });
  }

  const rows = inventory.filter((r) => targets.has(r.url)).map((r) => {
    const { to, note } = targets.get(r.url);
    const url = new URL(r.url);
    const same = url.host === MAIN_HOST && url.pathname === to;
    return { from: r.url, to, status: same ? '200' : '301', note: same ? `${note}（路徑不變）` : note };
  });
  rows.push(...FALLBACKS.map((f) => ({ ...f, status: '301' })));

  const sources = new Set();
  for (const r of rows) {
    if (sources.has(r.from)) errors.push(`duplicate redirect source: ${r.from}`);
    sources.add(r.from);
  }
  // Pages redirect-overrides.csv says are not built, so a rule may start from them (toRedirects)
  const unbuilt = new Set(overrides.map((o) => o.unbuilt).filter(Boolean));
  return { rows, errors, unbuilt };
}

// Cloudflare Pages _redirects: static rules first, then splats; only paths on the main host.
// `nodes` (docs/ia/nodes.csv) adds the new pages no redirect points to, in every locale, to the loop check;
// `unbuilt` (buildRedirects) takes out the node paths redirect-overrides.csv says are not built, which
// scripts/ia/redirect-targets.mjs fails on once they are.
export function toRedirects(rows, nodes = [], unbuilt = new Set()) {
  const errors = [];
  const rules = rows
    .filter((r) => r.status !== '200' && new URL(r.from).host === MAIN_HOST)
    .map((r) => {
      const source = new URL(r.from).pathname;
      return { source, line: `${source} ${r.to} ${r.status}`, dynamic: source.endsWith('/*') };
    });
  // A rule must not match a page of the new site: Cloudflare follows redirects even when an asset matches,
  // so it would shadow the page or loop
  const pages = new Set(rows.map((r) => r.to));
  for (const n of nodes.filter((x) => (x.kind === 'page' || x.kind === 'collection') && x.path)) {
    for (const locale of Object.keys(PREFIX)) pages.add(withPrefix(locale, n.path));
  }
  for (const path of unbuilt) pages.delete(path);
  for (const { source, line, dynamic } of rules) {
    const hit = dynamic ? [...pages].find((p) => p.startsWith(source.slice(0, -1))) : pages.has(source) && source;
    if (hit) errors.push(`redirect matches the new page ${hit} (loop or shadowed page): ${line}`);
  }
  const staticRules = rules.filter((r) => !r.dynamic);
  const dynamicRules = rules.filter((r) => r.dynamic);
  if (staticRules.length > MAX_STATIC) errors.push(`${staticRules.length} static redirects, Cloudflare Pages allows ${MAX_STATIC}`);
  if (dynamicRules.length > MAX_DYNAMIC) errors.push(`${dynamicRules.length} dynamic redirects, Cloudflare Pages allows ${MAX_DYNAMIC}`);
  for (const { line } of rules) if (line.length > MAX_LINE) errors.push(`redirect longer than ${MAX_LINE} characters: ${line}`);
  const text = [`# generated by scripts/ia/redirects.mjs from ${REDIRECTS}`, ...staticRules.map((r) => r.line), ...dynamicRules.map((r) => r.line), ''].join('\n');
  return { text, static: staticRules.length, dynamic: dynamicRules.length, errors };
}

async function main() {
  const inventory = await readCsv(INVENTORY);
  const nodes = await readCsv(NODES);
  const { rows, errors, unbuilt } = buildRedirects({
    inventory,
    pageMap: await readCsv(PAGE_MAP),
    nodes,
    dropTargets: await readCsv(DROP_TARGETS),
    overrides: await readCsv(OVERRIDES),
  });
  const redirects = toRedirects(rows, nodes, unbuilt);
  errors.push(...redirects.errors);
  if (errors.length) {
    console.error(errors.join('\n'));
    process.exit(1);
  }

  const columns = ['from', 'to', 'status', 'note'];
  const csv = [columns.join(','), ...rows.map((r) => columns.map((c) => csvCell(r[c])).join(','))].join('\n');
  const check = process.argv.includes('--check');
  const stale = await emit([[REDIRECTS, `﻿${csv}\n`]], { check, rerun: 'node scripts/ia/redirects.mjs' });
  if (stale.length) process.exit(1);

  const flag = process.argv.indexOf('--redirects');
  const out = flag < 0 ? undefined : process.argv[flag + 1];
  if (flag >= 0) {
    if (!out) throw new Error('--redirects needs an output path');
    await writeFile(out, redirects.text);
  }
  const count = (s) => rows.filter((r) => r.status === s).length;
  const otherHost = rows.filter((r) => r.status === '301' && new URL(r.from).host !== MAIN_HOST).length;
  console.log(`${inventory.length} inventory URLs → ${count('301')} redirects (incl. ${FALLBACKS.length} catch-alls), ${count('200')} unchanged; _redirects: ${redirects.static} static, ${redirects.dynamic} dynamic, ${otherHost} on other hosts left out${check ? ', output up to date' : ''}${out && !check ? `, written to ${out}` : ''}`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) await main();
