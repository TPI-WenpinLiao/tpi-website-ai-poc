// Current-site API fields → blog and news frontmatter, per the field tables in docs/ia/content-model.md
// ("blog（部落格文章）", "news（新聞）"). Key order follows the sample entries in src/content/.
import { parse as parseYaml, stringify } from 'yaml';
import { YAML_OPTIONS } from '../dates.mjs';
import { pageTitle } from '../../../src/lib/seo/meta.ts';

// authorName values that are the company itself → authorType Organization (content-model.md: 依 authorName 判斷)
export const ORGANIZATION_AUTHORS = new Set(['TPIsoftware', '昕力資訊', '昕力資訊 TPIsoftware', 'TPIsoftware 昕力資訊']);

// content-model.md「news」: newsTypeId → newsType. Each locale has its own ids. Ids the media center page
// does not show (zh-TW 2, en 5, vi 10) have no value.
export const NEWS_TYPES = { 1: 'press', 3: 'product', 7: 'newsletter', 4: 'press', 6: 'product', 8: 'newsletter', 9: 'press', 11: 'product' };

// content-audit.md「已知限制」: news published before this day were kept on updateDate and need a check.
// Same date as NEWS_CUTOFF in scripts/inventory/audit.mjs; change both together
export const NEWS_REVIEW_BEFORE = '2026-01-01';

// <title> is pageTitle(seoTitle ?? title, locale) from src/lib/seo/meta.ts, and html-validate's
// long-title rule allows 70 characters. It counts the title as written in the HTML, where Astro
// escapes & " ' < > (&amp; is 5 characters), so the length is taken after the same escaping (#40)
export const TITLE_MAX = 70;
const ESCAPED = { '&': '&amp;', '"': '&quot;', "'": '&#39;', '<': '&lt;', '>': '&gt;' };
const htmlLength = (text) => text.replace(/[&"'<>]/g, (c) => ESCAPED[c]).length;

// seo-checklist: zh-TW about 60–80 full-width characters, en 120–160 characters (vi follows en)
export const DESCRIPTION_MAX = { 'zh-TW': 80, en: 160, vi: 160 };

/** A YYYY-MM-DD date written unquoted, so YAML reads it as a date like the hand-written samples. */
export class Day {
  constructor(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error(`expected YYYY-MM-DD, got "${value}"`);
    this.value = value;
  }
}

/** A value written with a comment line above it (the cover image's original URL). */
export class Commented {
  constructor(value, comment) {
    this.value = value;
    this.comment = comment;
  }
}

/** Titles and descriptions are single-line meta values; the APIs keep the editor's line breaks. */
const oneLine = (s) => s?.replace(/\s+/g, ' ').trim();

/** '2026/09/11 00:00:00' or '2026-10-15 09:59:03' → Day('2026-09-11') */
export const apiDay = (s) => new Day(String(s).slice(0, 10).replace(/\//g, '-'));

/**
 * Tag ids by current-site subcategory path, from parseTagTable (scripts/content/tags.mjs).
 * The table writes paths without the /en prefix, so blog-categories.csv paths are looked up the same way.
 * @param {{ id: string, paths: Record<string, string> }[]} tags
 */
export function tagLookup(tags) {
  const byPath = new Map();
  for (const { id, paths } of tags) for (const [locale, path] of Object.entries(paths)) byPath.set(`${locale} ${path}`, id);
  return (locale, path) => byPath.get(`${locale} ${path.replace(/^\/(?:en|vi)(?=\/)/, '')}`);
}

/**
 * @param {object} p
 * @param {string} p.locale
 * @param {string} p.slug blog_slug from page-map.csv
 * @param {string} p.category blog_category from page-map.csv (blog-ai)
 * @param {object} p.article blog API article
 * @param {{ main_category: string, sub_category: string } | undefined} p.categories blog-categories.csv row
 * @param {(locale: string, path: string) => string | undefined} p.tagOf
 * @param {string | string[]} p.sourceUrl
 * @param {string} p.sourceUpdatedAt inventory.csv last_updated ('' when unknown)
 * coverImage is left null for the caller, which knows the downloaded file's name.
 */
export function blogFrontmatter({ locale, slug, category, article, categories, tagOf, sourceUrl, sourceUpdatedAt }) {
  const notes = [];
  const tag = categories?.sub_category ? tagOf(locale, categories.sub_category) : undefined;
  const author = article.authorName?.trim() ?? '';
  const data = {
    title: oneLine(article.title),
    description: oneLine(article.description),
    translationKey: slug,
    category: category.replace(/^blog-/, ''),
    tags: tag ? [tag] : undefined,
    featured: categories?.main_category?.endsWith('/Featured') ? true : undefined,
    publishedAt: apiDay(article.atcDate),
    author,
    authorType: ORGANIZATION_AUTHORS.has(author) ? 'Organization' : 'Person',
    coverImage: null,
    sourceUrl,
    migratedAt: undefined,
    sourceUpdatedAt: sourceUpdatedAt ? new Day(sourceUpdatedAt) : undefined,
  };
  if (!categories) notes.push('not in blog-categories.csv: no tags');
  return { data, notes };
}

/**
 * @param {object} p
 * @param {object} p.item news API item
 * @param {string | string[]} p.sourceUrl
 * @param {string} p.sourceUpdatedAt
 * coverImage is left null, as in blogFrontmatter.
 */
export function newsFrontmatter({ item, sourceUrl, sourceUpdatedAt }) {
  const notes = [];
  const newsType = NEWS_TYPES[item.newsTypeId];
  if (!newsType) throw new Error(`newsTypeId ${item.newsTypeId} has no newsType (content-model.md「news」)`);
  const publishedAt = new Day(item.showDate);
  if (publishedAt.value < NEWS_REVIEW_BEFORE) notes.push(`publishedAt ${publishedAt.value} is before ${NEWS_REVIEW_BEFORE}`);
  const data = {
    title: oneLine(item.title),
    description: oneLine(item.summary),
    // content-model.md: the zh-TW id; the item's own id when there is no zh-TW version
    translationKey: String(item.langTW || item.id),
    newsType,
    publishedAt,
    coverImage: null,
    sourceUrl,
    migratedAt: undefined,
    sourceUpdatedAt: sourceUpdatedAt ? new Day(sourceUpdatedAt) : undefined,
  };
  return { data, notes };
}

/** Problems a reviewer has to look at; schema errors are left to astro check. */
export function frontmatterNotes(locale, data) {
  const notes = [];
  const max = DESCRIPTION_MAX[locale];
  if (data.description && [...data.description].length > max) notes.push(`description is ${[...data.description].length} characters (max ${max})`);
  const length = htmlLength(pageTitle(data.seoTitle ?? data.title, locale));
  if (length > TITLE_MAX) notes.push(`<title> is ${length} characters (max ${TITLE_MAX}): set seoTitle`);
  if (data.authorType === 'Person') notes.push(`authorType Person for author "${data.author}"`);
  return notes;
}

/**
 * Apply an overrides.yaml entry: each key replaces the generated value, null removes it.
 * @param {Record<string, unknown>} data
 * @param {Record<string, unknown> | undefined} overrides
 */
export function applyOverrides(data, overrides = {}) {
  const out = { ...data };
  for (const [key, value] of Object.entries(overrides)) {
    if (!(key in out) && value === null) continue;
    out[key] = value === null ? undefined : value;
  }
  return out;
}

const scalar = (v) => {
  if (v instanceof Day) return v.value;
  // An unquoted date in overrides.yaml parses as a Date
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  if (Array.isArray(v)) return `[${v.map(scalar).join(', ')}]`;
  // A nested object (case-study `client`) as a one-line flow mapping; yaml quotes values that need it there
  if (v && typeof v === 'object') return stringify(v, { ...YAML_OPTIONS, lineWidth: 0, collectionStyle: 'flow' }).trimEnd();
  // Same schema as Astro's parser, so a string that reads as a date there ("2026-10-15") gets quoted.
  // lineWidth 0 keeps long descriptions on one line like the samples.
  const out = stringify(v, { ...YAML_OPTIONS, lineWidth: 0 }).trimEnd();
  if (out.includes('\n')) throw new Error(`frontmatter value spans lines: ${out.slice(0, 80)}`);
  return out;
};

const isRecord = (v) => typeof v === 'object' && v !== null && Object.getPrototypeOf(v) === Object.prototype;

// A flow list ([a, b]) only when it reads back as the same items and stays short: an item with a
// comma ("TUV-NORD, ISO27001:2013 Lead Auditor Training course", an en certification) would split in two
const FLOW_MAX = 100;
const flowSafe = (key, value) => {
  const line = `${key}: ${scalar(value)}`;
  return line.length <= FLOW_MAX && JSON.stringify(parseYaml(line, YAML_OPTIONS)?.[key]) === JSON.stringify(value);
};

/**
 * Frontmatter block; undefined values are left out. Arrays of URLs, and string arrays that don't fit a
 * flow list (flowSafe), are written as block lists, arrays of objects (offering features) as block
 * lists of single-line fields.
 */
export function serializeFrontmatter(data) {
  const lines = ['---'];
  for (const [key, raw] of Object.entries(data)) {
    if (raw === undefined) continue;
    const value = raw instanceof Commented ? raw.value : raw;
    if (raw instanceof Commented && raw.comment) lines.push(`# ${raw.comment}`);
    if (Array.isArray(value) && (key === 'sourceUrl' || (value.every((v) => typeof v === 'string') && !flowSafe(key, value)))) {
      lines.push(`${key}:`, ...value.map((v) => `  - ${scalar(v)}`));
    } else if (Array.isArray(value) && value.length && value.every(isRecord)) {
      lines.push(`${key}:`);
      for (const item of value) {
        Object.entries(item)
          .filter(([, v]) => v !== undefined)
          .forEach(([k, v], i) => lines.push(`${i ? '    ' : '  - '}${k}: ${scalar(v)}`));
      }
    } else {
      lines.push(`${key}: ${scalar(value)}`);
    }
  }
  lines.push('---');
  return `${lines.join('\n')}\n`;
}
