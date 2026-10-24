#!/usr/bin/env node
// Converts the current site's solution pages into src/content/offering (M5-02, #27), and the
// orient-ai and aiso service pages (#106).
// Which pages: page-map.csv rows with page_type solution, plus the nodes in TEMPLATES. The seven solution
// pages share one Nuxt template, orient-ai and aiso have one each; their SSR HTML has all the copy, so
// fields are read by class name. Merge rows add their URL to the target's sourceUrl. Sections the offering schema has no field
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

/** The fields that a template's extractor did not find, as a list for the error message. */
function missing(data) {
  const lists = ['features', 'useCases', 'faq'].filter((k) => data[k]);
  return [
    ...['title', 'tagline', 'description'].filter((k) => !data[k]),
    ...(data.features.length ? [] : ['features']),
    ...lists.flatMap((list) => data[list].flatMap((item, i) => (Object.values(item).every(Boolean) ? [] : [`${list}.${i}`]))),
  ];
}

/**
 * Copy of /orient-ai. Sections the offering schema has no field for are left out: the three figures,
 * the execution and governance layers, the bullet lists with screenshots, OrientAI + AI hardware, the
 * whitepaper and blog links (docs/content/migration.md「服務頁」).
 * @param {string} html
 */
export function extractOrientAi(html) {
  const root = parse(html);
  const data = {
    // <title> without the site name: 「OrientAI 企業級 Agentic AI 平台 - 昕力資訊TPIsoftware」
    title: text(root.querySelector('title')).replace(/\s+-\s+[^-]*TPIsoftware$/, ''),
    // The subtitle under the h1; the page has it four times (desktop, mobile, each drawn twice)
    tagline: text(root.querySelector('.sp-text-wrapper.desktop .sp-text')),
    description: root.querySelector('meta[name="description"]')?.getAttribute('content')?.replace(/\s+/g, ' ').trim() ?? '',
    features: root.querySelectorAll('.section01 .card').map((card) => ({
      title: text(card.querySelector('h3')),
      body: text(card.querySelector('.card-content')),
    })),
    // Answers with a list get its items appended as 「title：description。」 sentences
    faq: root.querySelectorAll('.section06 li.li').map((li) => {
      const question = text(li.querySelector('h3'));
      const cjk = /\p{Script=Han}/u.test(question);
      const items = li.querySelectorAll('.answer-list__item').map((item) => {
        const [title, body] = ['.answer-list__title', '.answer-list__description'].map((c) => text(item.querySelector(c)));
        return `${title}${cjk ? '：' : ': '}${body}${/[。.]$/.test(body) ? '' : cjk ? '。' : '.'}`;
      });
      return { question, answer: [text(li.querySelector('.answer-text')), ...items].join(cjk ? '' : ' ') };
    }),
  };
  const empty = missing(data);
  if (empty.length) throw new Error(`not found on the page (template changed?): ${empty.join(', ')}`);
  return data;
}

/**
 * Copy of /aiso: the hero and the bundled-solution cards. The cards' domain tags and their links to
 * aisoportal.com have no field. The page has no meta description, so it falls back to the hero text.
 * @param {string} html
 */
export function extractAiso(html) {
  const root = parse(html);
  const h1 = root.querySelector('h1');
  const tagline = text(root.querySelector('.hero-content-description'));
  const data = {
    // The h1 is the AISO wordmark image followed by text
    title: [h1?.querySelector('img')?.getAttribute('alt'), text(h1)].filter(Boolean).join(' '),
    tagline,
    description: root.querySelector('meta[name="description"]')?.getAttribute('content')?.replace(/\s+/g, ' ').trim() || tagline,
    features: root.querySelectorAll('.solutions-card').map((card) => ({
      title: text(card.querySelector('.solutions-card-title')),
      body: text(card.querySelector('.solutions-card-description')),
    })),
  };
  const empty = missing(data);
  if (empty.length) throw new Error(`not found on the page (template changed?): ${empty.join(', ')}`);
  return data;
}

// Which extractor a row uses, by node; rows with page_type solution use SOLUTION. inventory.csv has
// page_type service for these two, but they are products by the user's decision on PR #110
const SOLUTION = { extract: extractSolution, kind: 'solution', cta: 'contact' };
export const TEMPLATES = {
  'orient-ai': { extract: extractOrientAi, kind: 'product', cta: 'demo' },
  aiso: { extract: extractAiso, kind: 'product', cta: 'contact' },
};

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
 * @param {{ node: string, sourceUrl: string | string[], page: { title: string, tagline: string, description: string, features: { title: string, body: string }[], useCases?: { title: string, body: string }[], faq?: { question: string, answer: string }[] }, kind?: string, cta?: string, override?: { frontmatter?: Record<string, unknown>, useCaseIndustry?: Record<string, string> } }} p
 */
export function offeringFrontmatter({ node, sourceUrl, page, kind = 'solution', cta = 'contact', override = {} }) {
  const industryOf = override.useCaseIndustry ?? {};
  const useCases = page.useCases ?? [];
  const unknown = Object.keys(industryOf).filter((i) => !useCases[Number(i)]);
  if (unknown.length) throw new Error(`${OVERRIDES}: useCaseIndustry for use cases the page does not have: ${unknown.join(', ')}`);
  const data = {
    title: page.title,
    description: page.description,
    translationKey: node,
    node,
    kind,
    tagline: page.tagline,
    features: page.features,
    useCases: useCases.length ? useCases.map((u, i) => ({ ...u, industry: industryOf[i] })) : undefined,
    faq: page.faq?.length ? page.faq : undefined,
    cta,
    sourceUrl,
  };
  const unknownKeys = Object.keys(override.frontmatter ?? {}).filter((k) => !(k in data));
  if (unknownKeys.length) throw new Error(`${OVERRIDES}: unknown frontmatter keys ${unknownKeys.join(', ')}`);
  return applyOverrides(data, override.frontmatter);
}

/**
 * One entry per <locale>/<node>: the keep or rewrite row is the source, merge rows only add their URL
 * to sourceUrl (primary first, content-model.md「遷移追蹤欄位」).
 * @param {Record<string, string>[]} rows page-map.csv rows
 * @param {Map<string, Record<string, string>>} inventory inventory.csv rows by url
 */
export function groupEntries(rows, inventory) {
  const url = (r) => inventory.get(r.url)?.final_url || r.url;
  const groups = Map.groupBy(rows, (r) => `${r.locale}/${r.node}`);
  return [...groups].map(([id, group]) => {
    const sources = group.filter((r) => r.disposition !== 'merge');
    if (sources.length !== 1) throw new Error(`${id}: needs exactly one keep or rewrite row, has ${sources.length}`);
    const [primary] = sources;
    const merged = group.filter((r) => r.disposition === 'merge').map(url);
    return { id, row: primary, sourceUrl: merged.length ? [url(primary), ...merged] : url(primary), toConfirm: group.map((r) => inventory.get(r.url)?.to_confirm).filter(Boolean) };
  });
}

async function migrateEntry({ get, entry, overrides, date }) {
  const { id, row, sourceUrl } = entry;
  const notes = entry.toConfirm.map((t) => `to_confirm: ${t}`);
  const template = TEMPLATES[row.node] ?? SOLUTION;
  const url = [sourceUrl].flat()[0];
  try {
    const res = await get(url);
    if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
    const page = template.extract(res.body.toString('utf8'));
    const data = offeringFrontmatter({ node: row.node, sourceUrl, page, kind: template.kind, cta: template.cta, override: overrides[id] });
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
    (r) =>
      (r.page_type === 'solution' || r.node in TEMPLATES) &&
      ['keep', 'rewrite', 'merge'].includes(r.disposition) &&
      (!args.locale || r.locale === args.locale) &&
      (!args.only || r.node === args.only),
  );
  const inventory = new Map((await readCsv('docs/research/inventory.csv')).map((r) => [r.url, r]));
  const overrides = existsSync(OVERRIDES) ? parseOverrides(await readFile(OVERRIDES, 'utf8')) : {};
  const date = today();

  const report = [];
  for (const entry of groupEntries(rows, inventory)) report.push(await migrateEntry({ get, entry, overrides, date }));
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
