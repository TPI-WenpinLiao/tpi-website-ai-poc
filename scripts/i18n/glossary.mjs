// Translation glossary for M7-01 (#38): docs/i18n/glossary.csv, usage in docs/i18n/glossary.md.
// Adds a row for every product, navigation label and interface string, and keeps the columns people
// edit (en, vi, status, note). A new row's en and vi start from the current site's wording when the
// site has it: the title of an en or vi content file, else the header or footer label in
// docs/research/inventory.csv. Nothing is translated here.
// Re-run after changing nodes.csv, navigation.csv or src/data/strings/zh-TW.ts:
//   node scripts/i18n/glossary.mjs
// With --check it validates the file and only compares it to what a re-run would write (npm run check).

import { readFile, readdir } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { parse } from 'yaml';
import { csvCell, readCsv } from '../inventory/csv.mjs';
import { emit } from '../ia/generated.mjs';

const GLOSSARY = 'docs/i18n/glossary.csv';
const STRINGS = 'src/data/strings/zh-TW.ts';
const NAV = 'docs/ia/navigation.csv';
export const COLUMNS = ['id', 'category', 'zh-TW', 'en', 'vi', 'status', 'source', 'note'];
// Categories the script derives; brand and term rows are added by hand and kept as they are
const GENERATED = ['nav', 'product', 'page', 'ui'];
export const CATEGORIES = ['brand', 'term', ...GENERATED];
const ID_PREFIX = { brand: 'brand', term: 'term', nav: 'nav', product: 'node', page: 'node', ui: 'ui' };
export const STATUSES =['to-confirm', 'draft', 'confirmed'];
const LOCALES = ['en', 'vi'];
// Collections whose entries name their node (content-model.md「Astro 實作」)
const NODE_COLLECTIONS = ['offering', 'hub', 'page', 'whitepaper'];
// Interface strings that are page content, not interface copy; M7-02 and M7-03 translate them
const SKIP_STRINGS = new Set(['pages']);
// navigation.csv labels that are not visible text
const HIDDEN_LABEL = /^（.*）$/;

// Leaf strings of the zh-TW interface copy keyed by dotted path; functions are rendered with their
// parameter names as placeholders, e.g. pageSuffix(n) → （第 {n} 頁）
export function flattenStrings(obj, prefix = '') {
  const out = [];
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix + key;
    if (!prefix && SKIP_STRINGS.has(key)) continue;
    if (typeof value === 'string') out.push([path, value]);
    else if (typeof value === 'function') {
      const params = value.toString().match(/^\(?([^)=]*)\)?\s*=>/)?.[1].split(',').map((p) => p.trim().split(':')[0].trim()) ?? [];
      out.push([path, value(...params.map((p) => `{${p}}`))]);
    } else if (value && typeof value === 'object') out.push(...flattenStrings(value, `${path}.`));
  }
  return out;
}

// Labels in an inventory nav_location such as "footer: API Management | header: A > B > digiRunner":
// the last segment of each header path and each footer label. Header items nested under another item
// for the same URL are filters or anchors on that page (success-story's industry tabs), so only the
// shallowest header paths count.
export function navLabels(navLocation) {
  const paths = [];
  const footer = [];
  for (const part of navLocation.split(' | ')) {
    const m = part.match(/^(header|footer): (.+)$/);
    if (!m) continue;
    if (m[1] === 'footer') footer.push(m[2].trim());
    else paths.push(m[2].split(' > ').map((s) => s.trim()));
  }
  const shallowest = Math.min(...paths.map((p) => p.length));
  const header = paths.filter((p) => p.length === shallowest).map((p) => p.at(-1));
  return { header, footer };
}

// Current-site wording for one node in one locale: content file titles first, then header labels,
// then footer labels, each list in order of first appearance. Returns the candidates and their sources.
export function currentWording({ titles, urls, inventoryByUrl }) {
  const found = [];
  const add = (text, source) => {
    if (text && !found.some((f) => f.text === text)) found.push({ text, source });
  };
  for (const t of titles) add(t.title, t.file);
  const header = [];
  const footer = [];
  for (const url of urls) {
    const labels = navLabels(inventoryByUrl.get(url)?.nav_location ?? '');
    header.push(...labels.header.map((text) => ({ text, source: url })));
    footer.push(...labels.footer.map((text) => ({ text, source: url })));
  }
  for (const h of [...header, ...footer]) add(h.text, h.source);
  return found;
}

// Rows the script derives, in output order: navigation labels, then nodes in nodes.csv order, then
// interface strings
export function buildRows({ nodes, nav, strings, pageMap, inventory, titles }) {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const inventoryByUrl = new Map(inventory.map((r) => [r.url, r]));
  const rows = [];

  const navNodes = new Set();
  const navLabelRows = new Map();
  for (const r of nav) {
    if (r.node) navNodes.add(r.node);
    if (!r.label || HIDDEN_LABEL.test(r.label) || (!r.node && r.area === 'utility')) continue;
    if (r.node && byId.get(r.node)?.title === r.label) continue;
    if (!navLabelRows.has(r.label)) navLabelRows.set(r.label, { id: `nav:${r.label}`, category: 'nav', 'zh-TW': r.label, source: NAV });
  }
  rows.push(...navLabelRows.values());

  for (const n of nodes) {
    // Offerings and the product families under 產品總覽 carry product names; other nodes are pages
    const isProduct = n.template === 'offering' || (n.template === 'hub' && n.parent === 'products');
    if (!isProduct && n.template !== 'hub' && !navNodes.has(n.id)) continue;
    if (n.id === 'home') continue;
    const row = { id: `node:${n.id}`, category: isProduct ? 'product' : 'page', 'zh-TW': n.title, source: 'docs/ia/nodes.csv' };
    const sources = [];
    for (const locale of LOCALES) {
      const urls = pageMap.filter((p) => p.node === n.id && p.locale === locale).map((p) => p.url);
      const found = currentWording({ titles: titles.filter((t) => t.node === n.id && t.locale === locale), urls, inventoryByUrl });
      row[`candidates:${locale}`] = found;
      for (const f of found) if (!sources.includes(f.source)) sources.push(f.source);
    }
    if (sources.length) row.source = sources.join(' ');
    rows.push(row);
  }

  for (const [key, text] of strings) rows.push({ id: `ui:${key}`, category: 'ui', 'zh-TW': text, source: STRINGS });
  return rows;
}

// Merge derived rows into the existing glossary. People's columns (en, vi, status, note) are kept;
// a row whose zh-TW changed goes back to to-confirm. A new row takes the first current-site wording
// for en and vi and lists the other wordings in note. Hand-added categories stay in place, on top.
export function mergeRows(existing, derived) {
  const old = new Map(existing.map((r) => [r.id, r]));
  const out = existing.filter((r) => !GENERATED.includes(r.category)).map((r) => ({ ...r }));
  for (const d of derived) {
    const prev = old.get(d.id);
    const row = { id: d.id, category: d.category, 'zh-TW': d['zh-TW'], source: d.source };
    if (prev) {
      for (const c of ['en', 'vi', 'status', 'note']) row[c] = prev[c];
      if (prev['zh-TW'] !== d['zh-TW'] && prev.status === 'confirmed') row.status = 'to-confirm';
    } else {
      const notes = [];
      for (const locale of LOCALES) {
        const [first, ...others] = d[`candidates:${locale}`] ?? [];
        row[locale] = first?.text ?? '';
        if (others.length) notes.push(`現站 ${locale} 其他寫法：${others.map((o) => o.text).join('、')}`);
      }
      row.status = 'to-confirm';
      row.note = notes.join('；');
    }
    out.push(row);
  }
  return out;
}

export function validate(rows) {
  const errors = [];
  const seen = new Set();
  for (const r of rows) {
    const where = r.id || '(no id)';
    if (!r.id) errors.push('row without id');
    if (seen.has(r.id)) errors.push(`${where}: duplicate id`);
    seen.add(r.id);
    if (!CATEGORIES.includes(r.category)) errors.push(`${where}: category must be one of ${CATEGORIES.join(', ')}`);
    if (!STATUSES.includes(r.status)) errors.push(`${where}: status must be one of ${STATUSES.join(', ')}`);
    if (!r['zh-TW']) errors.push(`${where}: zh-TW is empty`);
    if (r.status === 'confirmed' && (!r.en || !r.vi)) errors.push(`${where}: a confirmed row needs both en and vi`);
    const prefix = ID_PREFIX[r.category];
    if (prefix && !r.id?.startsWith(`${prefix}:`)) errors.push(`${where}: a ${r.category} row's id starts with ${prefix}:`);
  }
  return errors;
}

export const toCsv = (rows) => [COLUMNS.join(','), ...rows.map((r) => COLUMNS.map((c) => csvCell(r[c])).join(','))].join('\n') + '\n';

async function contentTitles() {
  const out = [];
  for (const collection of NODE_COLLECTIONS) {
    for (const locale of LOCALES) {
      const dir = `src/content/${collection}/${locale}`;
      const files = await readdir(dir).catch((e) => (e.code === 'ENOENT' ? [] : Promise.reject(e)));
      for (const name of files.filter((f) => f.endsWith('.md')).sort()) {
        const file = `${dir}/${name}`;
        const fm = parse((await readFile(file, 'utf8')).match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '') ?? {};
        if (fm.node && fm.title) out.push({ node: fm.node, locale, title: fm.title, file });
      }
    }
  }
  return out;
}

async function main() {
  const check = process.argv.includes('--check');
  const { zhTW } = await import(pathToFileURL(STRINGS).href);
  const derived = buildRows({
    nodes: await readCsv('docs/ia/nodes.csv'),
    nav: await readCsv(NAV),
    strings: flattenStrings(zhTW),
    pageMap: await readCsv('docs/ia/page-map.csv'),
    inventory: await readCsv('docs/research/inventory.csv'),
    titles: await contentTitles(),
  });
  const existing = await readCsv(GLOSSARY).catch((e) => (e.code === 'ENOENT' ? [] : Promise.reject(e)));
  const rows = mergeRows(existing, derived);
  const errors = validate(rows);
  for (const e of errors) console.error(`${GLOSSARY}: ${e}`);
  const stale = await emit([[GLOSSARY, toCsv(rows)]], { check, rerun: 'node scripts/i18n/glossary.mjs' });
  if (errors.length || stale.length) process.exit(1);
  const count = (s) => rows.filter((r) => r.status === s).length;
  console.log(`${GLOSSARY}: ${rows.length} rows (${STATUSES.map((s) => `${s} ${count(s)}`).join(', ')})`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) await main();
