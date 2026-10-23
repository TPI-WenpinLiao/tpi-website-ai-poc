#!/usr/bin/env node
// Converts the current site's blog posts and news into src/content/blog and src/content/news (M5-04, #29).
// Which posts, their slugs and categories come from docs/ia/page-map.csv; how to run it and what the
// report means: docs/content/migration.md.
// Usage: node scripts/content/migrate/migrate.mjs [--type blog|news] [--locale zh-TW|en|vi] [--only <slug>]
//        [--refresh] [--report <file.csv>]
import { existsSync } from 'node:fs';
import { mkdir, readFile, readdir, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import { parse as parseYaml } from 'yaml';
import { readCsv, csvCell } from '../../inventory/csv.mjs';
import { parseTagTable } from '../tags.mjs';
import { cachedFetcher, writeAtomic } from './cache.mjs';
import { applyOverrides, blogFrontmatter, Commented, Day, frontmatterNotes, newsFrontmatter, serializeFrontmatter, tagLookup } from './frontmatter.mjs';
import { prepare, toMarkdown } from './html-to-markdown.mjs';
import { dataUrlBytes, fileNames, imageExt, optimizeImage } from './images.mjs';
import { linkResolver } from './links.mjs';
import { blogArticles, blogBody, newsBody, newsImageUrl, newsItems } from './sources.mjs';

const TYPES = ['blog', 'news'];
const LOCALES = ['zh-TW', 'en', 'vi'];
const NODE = { blog: 'blog-post', news: 'news-article' };
// Entries converted at once; http.mjs keeps requests to the site 500 ms apart regardless
const CONCURRENCY = 4;
export const OVERRIDES = 'scripts/content/migrate/overrides.yaml';

const contentFile = (type, id) => `src/content/${type}/${id}.md`;
// Per locale: the same slug can exist in two locales (aiagent in zh-TW and en)
const assetDir = (type, id) => `src/assets/${type}/${id}`;
// Content files sit at src/content/<type>/<locale>/<slug>.md
const assetRef = (type, id, file) => `../../../assets/${type}/${id}/${file}`;

/** Today in Taiwan, the date written to migratedAt for new or changed entries. */
export const today = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Taipei' }).format(new Date());

/**
 * The entry text, keeping the existing file's migratedAt when nothing else changed, so a re-run
 * writes the same bytes.
 * @param {Record<string, unknown>} data frontmatter without migratedAt
 * @param {string} body
 * @param {string | null} existing current file content
 * @param {string} date today
 */
export function entryText(data, body, existing, date) {
  const text = (migratedAt) => `${serializeFrontmatter({ ...data, migratedAt: data.migratedAt ?? new Day(migratedAt) })}${body ? `\n${body}\n` : ''}`;
  const previous = existing?.match(/^migratedAt: (\d{4}-\d{2}-\d{2})$/m)?.[1];
  if (previous && text(previous) === existing) return existing;
  return text(date);
}

/**
 * Overrides file: entry id → { frontmatter?: {...}, alt?: { <image file>: <alt> }, dropImagesFrom?: [<host or image URL>] }.
 * @returns {Record<string, { frontmatter?: Record<string, unknown>, alt?: Record<string, string>, dropImagesFrom?: string[] }>}
 */
export function parseOverrides(text) {
  const all = parseYaml(text) ?? {};
  for (const [id, o] of Object.entries(all)) {
    if (!/^(?:blog|news)\/(?:zh-TW|en|vi)\/[a-z0-9-]+$/.test(id)) throw new Error(`${OVERRIDES}: "${id}" is not <blog|news>/<locale>/<slug>`);
    const extra = Object.keys(o ?? {}).filter((k) => !['frontmatter', 'alt', 'dropImagesFrom'].includes(k));
    if (extra.length) throw new Error(`${OVERRIDES}: ${id} has unknown keys ${extra.join(', ')} (frontmatter, alt, dropImagesFrom)`);
    const drop = o?.dropImagesFrom;
    if (drop !== undefined && !(Array.isArray(drop) && drop.length && drop.every((h) => typeof h === 'string'))) throw new Error(`${OVERRIDES}: ${id} dropImagesFrom must be a list of hosts or image URLs`);
  }
  return all;
}

/** Download every image (cover first), downscaled and re-encoded; throws on the first one that fails. */
async function fetchImages(get, urls) {
  const images = [];
  for (const url of urls) {
    let bytes;
    if (url.startsWith('data:')) bytes = dataUrlBytes(url);
    else {
      const res = await get(url).catch((error) => {
        throw new Error(`image ${url}: network error (${error.message.replace(`${url}: `, '')}; the host may be blocked by the network policy)`);
      });
      if (!res.ok) throw new Error(`image ${url}: HTTP ${res.status}`);
      bytes = res.body;
    }
    const ext = imageExt(bytes);
    if (!ext) throw new Error(`image ${url.slice(0, 120)}: not a format astro:assets reads`);
    images.push({ url, ...(await optimizeImage(bytes, ext)) });
  }
  return images;
}

/** Write the images that changed and remove files the entry no longer uses. */
async function syncImages(dir, images, names) {
  await mkdir(dir, { recursive: true });
  const keep = new Set();
  for (const { url, bytes } of images) {
    const file = names.get(url);
    keep.add(file);
    const path = join(dir, file);
    if (!existsSync(path) || !bytes.equals(await readFile(path))) await writeAtomic(path, bytes);
  }
  for (const f of await readdir(dir)) if (!keep.has(f)) await rm(join(dir, f));
}

/**
 * Convert one entry: images, body, frontmatter. Nothing is written when any step fails.
 * @returns {Promise<{ status: 'written' | 'unchanged', notes: string[] }>}
 */
export async function convert({ get, type, id, slug, coverUrl, html, base, frontmatter, override, resolveLink, date }) {
  const notes = [];
  const drop = override?.dropImagesFrom ?? [];
  const prepared = prepare(html, base, { drop });
  const unusedDrop = drop.filter((d) => !prepared.dropped.some((url) => url === d || new URL(url).hostname === d));
  if (unusedDrop.length) throw new Error(`${OVERRIDES}: dropImagesFrom entries the entry has no images from: ${unusedDrop.join(', ')}`);
  notes.push(...prepared.notes);
  const images = await fetchImages(get, [coverUrl, ...prepared.images]);
  const names = fileNames(images);
  const altFor = override?.alt ?? {};
  const files = new Set(names.values());
  const unknownAlt = Object.keys(altFor).filter((f) => !files.has(f));
  if (unknownAlt.length) throw new Error(`${OVERRIDES}: alt for images the entry does not have: ${unknownAlt.join(', ')}`);

  const missingAlt = [];
  const { markdown, notes: mdNotes } = toMarkdown(prepared.html, {
    image: (url) => {
      const file = names.get(url);
      const alt = altFor[file];
      return { path: assetRef(type, id, file), alt, file };
    },
    link: (href) => {
      const r = resolveLink(href, base, id.split('/')[0]);
      if (r.note) notes.push(r.note);
      return r.href;
    },
  });
  notes.push(...mdNotes);
  for (const m of markdown.matchAll(/!\[\]\(([^)]+)\)/g)) missingAlt.push(m[1].split('/').pop());
  if (missingAlt.length) notes.push(`images without alt: ${missingAlt.length}`);

  const cover = new Commented(assetRef(type, id, names.get(coverUrl)), coverUrl);
  const data = applyOverrides({ ...frontmatter, coverImage: cover }, override?.frontmatter);
  // The site has posts without an author; the schema requires one and it cannot be made up
  const empty = ['title', 'description', 'author'].filter((k) => k in data && !data[k]);
  if (empty.length) throw new Error(`empty on the current site: ${empty.join(', ')}; set it in ${OVERRIDES}`);
  const locale = id.split('/')[0];
  notes.push(...frontmatterNotes(locale, data));

  const path = contentFile(type, id);
  const existing = existsSync(path) ? await readFile(path, 'utf8') : null;
  const text = entryText(data, markdown, existing, date);
  await syncImages(assetDir(type, id), images, names);
  const unique = [...new Set(notes)];
  if (text === existing) return { status: 'unchanged', notes: unique };
  await mkdir(dirname(path), { recursive: true });
  await writeAtomic(path, text);
  return { status: 'written', notes: unique };
}

async function loadInputs() {
  const pageMap = await readCsv('docs/ia/page-map.csv');
  const inventoryRows = await readCsv('docs/research/inventory.csv');
  const inventory = new Map(inventoryRows.map((r) => [r.url, r]));
  const categories = new Map((await readCsv('docs/ia/blog-categories.csv')).map((r) => [r.url, r]));
  const tagOf = tagLookup(parseTagTable(await readFile('docs/ia/content-model.md', 'utf8')));
  const resolveLink = linkResolver(await readCsv('docs/ia/redirects.csv'), await readCsv('docs/research/broken-links.csv'), inventoryRows);
  const overrides = existsSync(OVERRIDES) ? parseOverrides(await readFile(OVERRIDES, 'utf8')) : {};
  return { pageMap, inventory, categories, tagOf, resolveLink, overrides };
}

/**
 * page-map rows of one type and locale grouped into entries: one keep row plus the merge rows that
 * point at the same slug (content-migration skill: merge rows add to sourceUrl, primary first).
 */
export function entryRows(pageMap, type, locale) {
  const groups = new Map();
  for (const r of pageMap) {
    if (r.node !== NODE[type] || r.locale !== locale || !['keep', 'rewrite', 'merge'].includes(r.disposition)) continue;
    const slug = type === 'blog' ? r.blog_slug : new URL(r.url).pathname.split('/').pop();
    const group = groups.get(slug) ?? { slug, rows: [] };
    group.rows.push(r);
    groups.set(slug, group);
  }
  for (const g of groups.values()) g.rows.sort((a, b) => Number(a.disposition === 'merge') - Number(b.disposition === 'merge'));
  return [...groups.values()].sort((a, b) => a.slug.localeCompare(b.slug));
}

/** Run `fn` over `items`, at most `limit` at a time. Requests are still spaced by http.mjs. */
async function pool(items, limit, fn) {
  let next = 0;
  const worker = async () => {
    while (next < items.length) await fn(items[next++]);
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
}

/** One entry (a keep row and its merge rows) → a report row. */
async function migrateEntry({ get, type, locale, group, source, inventory, categories, tagOf, resolveLink, overrides, date }) {
  const { slug, rows } = group;
  const id = `${locale}/${slug}`;
  const inv = rows.map((r) => inventory.get(r.url));
  const sourceUrls = rows.map((r, i) => inv[i]?.final_url || r.url);
  const sourceUrl = sourceUrls.length === 1 ? sourceUrls[0] : sourceUrls;
  const toConfirm = inv.flatMap((r) => (r?.to_confirm ? [`to_confirm: ${r.to_confirm}`] : []));
  const row = { type, locale, id, sourceUrl: sourceUrls.join(' ') };
  try {
    const primary = rows[0];
    const item = source.get(primary.url) ?? source.get(sourceUrls[0]);
    if (!item) throw new Error(`not in the ${type} API`);
    const sourceUpdatedAt = inv[0]?.last_updated ?? '';
    let coverUrl, html, frontmatter, notes;
    if (type === 'blog') {
      coverUrl = item.coverImage;
      html = await blogBody(get, sourceUrls[0]);
      if (html === null) throw new Error('no article body in the page payload');
      const cats = categories.get(primary.url) ?? categories.get(sourceUrls[0]);
      ({ data: frontmatter, notes } = blogFrontmatter({ locale, slug, category: primary.blog_category, article: item, categories: cats, tagOf, sourceUrl, sourceUpdatedAt }));
    } else {
      coverUrl = newsImageUrl(item.imagePath);
      html = await newsBody(get, item.htmlpath);
      ({ data: frontmatter, notes } = newsFrontmatter({ item, sourceUrl, sourceUpdatedAt }));
    }
    const override = overrides[`${type}/${id}`];
    const result = await convert({ get, type, id, slug, coverUrl, html, base: sourceUrls[0], frontmatter, override, resolveLink, date });
    return { ...row, status: result.status, notes: [...notes, ...toConfirm, ...result.notes] };
  } catch (error) {
    return { ...row, status: 'failed', notes: [error.message, ...toConfirm] };
  }
}

async function main() {
  const { values: args } = parseArgs({
    options: { type: { type: 'string' }, locale: { type: 'string' }, only: { type: 'string' }, refresh: { type: 'boolean' }, report: { type: 'string' } },
  });
  if (args.type && !TYPES.includes(args.type)) throw new Error(`--type must be one of ${TYPES.join(', ')}`);
  if (args.locale && !LOCALES.includes(args.locale)) throw new Error(`--locale must be one of ${LOCALES.join(', ')}`);
  // Imported here: http.mjs re-executes the process with proxy support on import
  const { request } = await import('../../inventory/http.mjs');
  const get = cachedFetcher(request, { refresh: args.refresh });
  const { pageMap, inventory, categories, tagOf, resolveLink, overrides } = await loadInputs();
  const date = today();
  const report = [];
  const seen = new Set();

  for (const type of args.type ? [args.type] : TYPES) {
    for (const locale of args.locale ? [args.locale] : LOCALES) {
      const groups = entryRows(pageMap, type, locale).filter((g) => !args.only || g.slug === args.only);
      if (!groups.length) continue;
      const source = type === 'blog' ? await blogArticles(get, locale) : await newsItems(get, locale);
      const mapped = new Set();
      for (const { rows } of groups) for (const r of rows) mapped.add(r.url);
      let done = 0;
      await pool(groups, CONCURRENCY, async (group) => {
        seen.add(`${type}/${locale}/${group.slug}`);
        report.push(await migrateEntry({ get, type, locale, group, source, inventory, categories, tagOf, resolveLink, overrides, date }));
        done += 1;
        if (done % 25 === 0 || done === groups.length) console.log(`${type} ${locale}: ${done}/${groups.length}`);
      });
      // Listed by the API but not migrated: dropped in M1-02, or scheduled with a future date
      if (!args.only) {
        for (const url of source.keys()) {
          if (!mapped.has(url) && !pageMap.some((r) => r.url === url)) report.push({ type, locale, id: '', sourceUrl: url, status: 'skipped', notes: ['not in page-map.csv'] });
        }
      }
    }
  }

  if (!args.type && !args.locale && !args.only) {
    const stale = Object.keys(overrides).filter((id) => !seen.has(id));
    if (stale.length) report.push({ type: '', locale: '', id: '', sourceUrl: '', status: 'failed', notes: [`${OVERRIDES} has entries that are not migrated: ${stale.join(', ')}`] });
  }
  report.sort((a, b) => `${a.type} ${a.locale} ${a.id} ${a.sourceUrl}`.localeCompare(`${b.type} ${b.locale} ${b.id} ${b.sourceUrl}`));
  printSummary(report);
  if (args.report) await writeReport(args.report, report);
  if (report.some((r) => r.status === 'failed')) process.exitCode = 1;
}

function printSummary(report) {
  const counts = new Map();
  for (const r of report) {
    const key = `${r.type || '-'} ${r.locale || '-'}`;
    const c = counts.get(key) ?? { written: 0, unchanged: 0, skipped: 0, failed: 0 };
    c[r.status] += 1;
    counts.set(key, c);
  }
  for (const [key, c] of counts) console.log(`${key}: written ${c.written}, unchanged ${c.unchanged}, skipped ${c.skipped}, failed ${c.failed}`);
  for (const r of report.filter((r) => r.status === 'failed')) console.log(`failed ${r.type}/${r.id || r.sourceUrl}: ${r.notes[0]}`);
}

async function writeReport(path, report) {
  const header = ['type', 'locale', 'id', 'status', 'source_url', 'notes'];
  const lines = report.map((r) => [r.type, r.locale, r.id, r.status, r.sourceUrl, r.notes.join(' ; ')].map(csvCell).join(','));
  await mkdir(dirname(path), { recursive: true });
  await writeAtomic(path, `${[header.join(','), ...lines].join('\n')}\n`);
  console.log(`report: ${path} (${report.length} rows)`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) await main();
