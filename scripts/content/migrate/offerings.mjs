#!/usr/bin/env node
// Converts the current site's solution pages into src/content/offering (M5-02, #27).
// Which pages: page-map.csv rows with page_type solution. The seven pages share one Nuxt template whose
// SSR HTML has all the copy, so fields are read by class name. Sections the offering schema has no field
// for (intro, process diagram, benefits, industries, client logos, video) are left out, and so is the hero
// banner: heroImage only feeds og:image, which needs 1200×630 (docs/content/migration.md「解決方案頁」).
// Usage: node scripts/content/migrate/offerings.mjs [--locale zh-TW|en|vi] [--only <node>] [--refresh]
import { existsSync } from 'node:fs';
import { mkdir, readFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import { parse } from 'node-html-parser';
import { parse as parseYaml } from 'yaml';
import { readCsv } from '../../inventory/csv.mjs';
import { cachedFetcher, writeAtomic } from './cache.mjs';
import { applyOverrides, frontmatterNotes } from './frontmatter.mjs';
import { entryText, today } from './migrate.mjs';

const LOCALES = ['zh-TW', 'en', 'vi'];
export const OVERRIDES = 'scripts/content/migrate/offering-overrides.yaml';
const INDUSTRIES = ['finance', 'government', 'manufacturing'];

const contentFile = (id) => `src/content/offering/${id}.md`;

/** Text of an element on one line; the site breaks headings over spans and lines. */
const text = (el) => el?.text.replace(/\s+/g, ' ').trim() ?? '';

/**
 * Copy of one solution page.
 * @param {string} html
 * @returns {{ title: string, tagline: string, description: string, features: { title: string, body: string }[], useCases: { title: string, body: string }[] }}
 */
export function extractSolution(html) {
  const root = parse(html);
  const features = root.querySelectorAll('.solution__feature01-item').map((li) => ({
    title: text(li.querySelector('.feature01-item-content h3')),
    body: text(li.querySelector('.feature01-item-content .contents')),
  }));
  const useCases = root.querySelectorAll('.solution__case-list .list-item').map((item) => ({
    title: text(item.querySelector('.list-item__tag--content')),
    body: text(item.querySelector('.list-item__content')),
  }));
  const data = {
    title: text(root.querySelector('h1')),
    tagline: text(root.querySelector('.solution__banner-info .slogan')),
    description: root.querySelector('meta[name="description"]')?.getAttribute('content')?.replace(/\s+/g, ' ').trim() ?? '',
    features,
    useCases,
  };
  const empty = [
    ...['title', 'tagline', 'description'].filter((k) => !data[k]),
    ...(features.length ? [] : ['features']),
    ...Object.entries({ features, useCases }).flatMap(([list, items]) => items.flatMap((f, i) => (f.title && f.body ? [] : [`${list}.${i}`]))),
  ];
  if (empty.length) throw new Error(`not found on the page (template changed?): ${empty.join(', ')}`);
  return data;
}

/**
 * Overrides file: <locale>/<node> → { frontmatter?: {...}, useCaseIndustry?: { <index>: <industry> } }.
 * useCaseIndustry links a use case to an industry hub (content-model.md「offering」) without copying its text.
 */
export function parseOverrides(source) {
  const all = parseYaml(source) ?? {};
  for (const [id, o] of Object.entries(all)) {
    if (!/^(?:zh-TW|en|vi)\/[a-z0-9-]+$/.test(id)) throw new Error(`${OVERRIDES}: "${id}" is not <locale>/<node>`);
    const extra = Object.keys(o ?? {}).filter((k) => !['frontmatter', 'useCaseIndustry'].includes(k));
    if (extra.length) throw new Error(`${OVERRIDES}: ${id} has unknown keys ${extra.join(', ')} (frontmatter, useCaseIndustry)`);
    for (const [i, industry] of Object.entries(o?.useCaseIndustry ?? {})) {
      if (!/^\d+$/.test(i) || !INDUSTRIES.includes(industry)) throw new Error(`${OVERRIDES}: ${id} useCaseIndustry ${i}: ${industry} (index → ${INDUSTRIES.join('|')})`);
    }
  }
  return all;
}

/**
 * Frontmatter of one entry, key order as in src/content/offering/zh-TW/digirunner.md.
 * @param {{ node: string, sourceUrl: string, page: ReturnType<typeof extractSolution>, override?: { frontmatter?: Record<string, unknown>, useCaseIndustry?: Record<string, string> } }} p
 */
export function solutionFrontmatter({ node, sourceUrl, page, override = {} }) {
  const industryOf = override.useCaseIndustry ?? {};
  const unknown = Object.keys(industryOf).filter((i) => !page.useCases[Number(i)]);
  if (unknown.length) throw new Error(`${OVERRIDES}: useCaseIndustry for use cases the page does not have: ${unknown.join(', ')}`);
  const data = {
    title: page.title,
    description: page.description,
    translationKey: node,
    node,
    kind: 'solution',
    tagline: page.tagline,
    features: page.features,
    useCases: page.useCases.length ? page.useCases.map((u, i) => ({ ...u, industry: industryOf[i] })) : undefined,
    cta: 'contact',
    sourceUrl,
  };
  const unknownKeys = Object.keys(override.frontmatter ?? {}).filter((k) => !(k in data));
  if (unknownKeys.length) throw new Error(`${OVERRIDES}: unknown frontmatter keys ${unknownKeys.join(', ')}`);
  return applyOverrides(data, override.frontmatter);
}

async function migrateEntry({ get, row, inventory, overrides, date }) {
  const id = `${row.locale}/${row.node}`;
  const inv = inventory.get(row.url);
  const sourceUrl = inv?.final_url || row.url;
  const notes = inv?.to_confirm ? [`to_confirm: ${inv.to_confirm}`] : [];
  try {
    const res = await get(sourceUrl);
    if (!res.ok) throw new Error(`${sourceUrl}: HTTP ${res.status}`);
    const page = extractSolution(res.body.toString('utf8'));
    const data = solutionFrontmatter({ node: row.node, sourceUrl, page, override: overrides[id] });
    notes.push(...frontmatterNotes(row.locale, data));

    const path = contentFile(id);
    const existing = existsSync(path) ? await readFile(path, 'utf8') : null;
    const out = entryText(data, '', existing, date);
    if (out === existing) return { id, status: 'unchanged', notes };
    await mkdir(dirname(path), { recursive: true });
    await writeAtomic(path, out);
    return { id, status: 'written', notes };
  } catch (error) {
    return { id, status: 'failed', notes: [error.message, ...notes] };
  }
}

async function main() {
  const { values: args } = parseArgs({ options: { locale: { type: 'string' }, only: { type: 'string' }, refresh: { type: 'boolean' } } });
  if (args.locale && !LOCALES.includes(args.locale)) throw new Error(`--locale must be one of ${LOCALES.join(', ')}`);
  // Imported here: http.mjs re-executes the process with proxy support on import
  const { request } = await import('../../inventory/http.mjs');
  const get = cachedFetcher(request, { refresh: args.refresh });
  const rows = (await readCsv('docs/ia/page-map.csv')).filter(
    (r) => r.page_type === 'solution' && ['keep', 'rewrite', 'merge'].includes(r.disposition) && (!args.locale || r.locale === args.locale) && (!args.only || r.node === args.only),
  );
  const merged = rows.filter((r) => r.disposition === 'merge');
  if (merged.length) throw new Error(`merge rows are not supported yet: ${merged.map((r) => r.url).join(', ')}`);
  const inventory = new Map((await readCsv('docs/research/inventory.csv')).map((r) => [r.url, r]));
  const overrides = existsSync(OVERRIDES) ? parseOverrides(await readFile(OVERRIDES, 'utf8')) : {};
  const date = today();

  const report = [];
  for (const row of rows) report.push(await migrateEntry({ get, row, inventory, overrides, date }));
  if (!args.locale && !args.only) {
    const stale = Object.keys(overrides).filter((id) => !report.some((r) => r.id === id));
    if (stale.length) report.push({ id: '-', status: 'failed', notes: [`${OVERRIDES} has entries that are not migrated: ${stale.join(', ')}`] });
  }
  for (const r of report.sort((a, b) => a.id.localeCompare(b.id))) console.log(`${r.status.padEnd(9)} ${r.id}${r.notes.length ? `: ${r.notes.join(' ; ')}` : ''}`);
  const count = (s) => report.filter((r) => r.status === s).length;
  console.log(`written ${count('written')}, unchanged ${count('unchanged')}, failed ${count('failed')}`);
  if (count('failed')) process.exitCode = 1;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) await main();
