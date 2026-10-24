#!/usr/bin/env node
// Converts the current site's success stories into src/content/case-study (M5-03, #28). The site has
// no case pages: /success-story lists cards whose data (title, logo, type, description) is written into
// one of the page's Nuxt JS chunks. Every card becomes an entry with its own page (user decision in #28).
// How to run it and what the report means: docs/content/migration.md「成功案例」.
// Usage: node scripts/content/migrate/case-studies.mjs [--refresh] [--dry-run] [--report <file.csv>]
import { existsSync } from 'node:fs';
import { mkdir, readFile, readdir, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import { parse as parseYaml } from 'yaml';
import { csvCell } from '../../inventory/csv.mjs';
import { cachedFetcher, writeAtomic } from './cache.mjs';
import { applyOverrides, frontmatterNotes } from './frontmatter.mjs';
import sharp from 'sharp';
import { imageExt, optimizeImage } from './images.mjs';
import { entryText, syncImages, today } from './migrate.mjs';
import { COM, VN } from './sources.mjs';

export const OVERRIDES = 'scripts/content/migrate/case-studies.yaml';
const LOCALES = ['zh-TW', 'en', 'vi'];
// The list page per locale (inventory.csv final_url), also each entry's sourceUrl
export const SOURCES = { 'zh-TW': `${COM}/success-story`, en: `${COM}/en/success-story`, vi: `${VN}/success-story` };

// Card `type` → industry (user decision in #28): finance and insurance are finance, the rest other.
// content-model.md「case-study」lists the same table
export const INDUSTRY = { financial: 'finance', insurance: 'finance', gov: 'government', tel: 'other', tech: 'other', transport: 'other', medical: 'other', other: 'other' };

// Product names a description has to spell out for the case to list that offering (content-model.md:
// only offerings the text names). Written only when the offering entry exists in the locale
export const MENTIONS = [
  [/digiRunner/i, 'digirunner'],
  [/digiLogs?\b/i, 'digilogs'],
  [/SysTalk\.Chat/i, 'systalk-chat'],
  [/SysTalk\.RPA/i, 'systalk-rpa'],
  [/InsureBrick/i, 'insurebrick'],
];
// Sentences a reviewer should check for being dated: awards and years
const DATED = /[^。！!]*(?:榮獲|頒發|Awards?\b|giải thưởng|\b(?:19|20)\d{2}\b)[^。！!]*[。！!]?/giu;

const contentFile = (id) => `src/content/case-study/${id}.md`;
const assetDir = (id) => `src/assets/case-study/${id}`;
const assetRef = (id, file) => `../../../assets/case-study/${id}/${file}`;

/** Decode a JS string literal ("…" or '…') as the minified chunks write them. */
export function jsString(literal) {
  const body = literal.slice(1, -1);
  return body.replace(/\\(u\{[0-9a-fA-F]+\}|u[0-9a-fA-F]{4}|x[0-9a-fA-F]{2}|[\s\S])/g, (_, e) => {
    if (e[0] === 'u') return String.fromCodePoint(parseInt(e.replace(/[u{}]/g, ''), 16));
    if (e[0] === 'x') return String.fromCharCode(parseInt(e.slice(1), 16));
    return { n: '\n', t: '\t', r: '\r', b: '\b', f: '\f', v: '\v', 0: '\0' }[e] ?? e;
  });
}

const STR = `(?:"(?:[^"\\\\]|\\\\.)*"|'(?:[^'\\\\]|\\\\.)*')`;
const CARD = new RegExp(`\\{title:(${STR}),logo:(${STR}),type:(${STR}),description:(${STR})\\}`, 'g');

/**
 * The success-story cards in a JS chunk, in list order; null when the chunk has none. Throws when the
 * chunk has card-like objects the pattern misses, so a change on the site cannot drop cards silently.
 * @returns {{ title: string, logo: string, type: string, description: string }[] | null}
 */
export function parseCards(js) {
  const cards = [...js.matchAll(CARD)].map((m) => ({ title: jsString(m[1]), logo: jsString(m[2]), type: jsString(m[3]), description: jsString(m[4]) }));
  const logos = (js.match(/logo:["']\/images\//g) ?? []).length;
  if (!logos) return null;
  if (cards.length !== logos) throw new Error(`chunk has ${logos} logos but ${cards.length} cards parse; the card format changed`);
  return cards;
}

/** The logo file name without the locale variants the site uses (fe02, bnp_en, tokio-marine-newa-zh). */
export function logoKey(logo) {
  const stem = logo.split('/').pop().replace(/\.[a-z]+$/i, '').toLowerCase();
  return stem.replace(/[-_](?:en|zh|tw)$/, '').replace(/\d+$/, '').replace(/_/g, '-');
}

const pairKey = (c) => `${logoKey(c.logo)}|${c.type}`;

/**
 * Align another locale's cards to the zh-TW ones (longest common subsequence on logo and type).
 * @returns {(number | null)[]} for each card of `other`, the index of its zh-TW card, or null
 */
export function align(base, other) {
  const a = base.map(pairKey);
  const b = other.map(pairKey);
  const lcs = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--) for (let j = b.length - 1; j >= 0; j--) lcs[i][j] = a[i] === b[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
  const out = new Array(b.length).fill(null);
  for (let i = 0, j = 0; i < a.length && j < b.length; ) {
    if (a[i] === b[j]) out[j++] = i++;
    else if (lcs[i + 1][j] >= lcs[i][j + 1]) i++;
    else j++;
  }
  return out;
}

const kebab = (s) =>
  s
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/**
 * `<client slug>-<en title>`, cut at a word boundary to 60 characters. Leading title words the client
 * slug already has are left out (hua-nan-bank + Hua Nan Bank Digital Banking Platform).
 */
export function caseSlug(clientSlug, enTitle) {
  const own = new Set(clientSlug.split('-'));
  const words = kebab(enTitle).split('-');
  while (words.length > 1 && own.has(words[0])) words.shift();
  let slug = `${clientSlug}-${words.join('-')}`;
  if (slug.length > 60) slug = slug.slice(0, 61).replace(/-[^-]*$/, '');
  return slug;
}

/**
 * Slugs for the zh-TW cards from their en titles; a repeated slug (same client, same title) gets -2, -3….
 * Throws when a zh-TW card has no en card: a Chinese title leaves nothing for the slug.
 */
export function slugs(base, en, clientOf) {
  const taken = new Set();
  return base.map((card, i) => {
    if (!en[i]) throw new Error(`no en card for zh-TW「${card.title}」(logo ${card.logo}), so it has no slug`);
    const slug = caseSlug(clientOf(card).slug, en[i].title);
    let out = slug;
    for (let n = 2; taken.has(out); n++) out = `${slug}-${n}`;
    taken.add(out);
    return out;
  });
}

/**
 * case-studies.yaml: `clients` (logo key → slug and the client's name per locale, as the descriptions
 * write it) and `entries` (entry id → frontmatter that replaces the generated values).
 */
export function parseOverrides(text) {
  const { clients = {}, entries = {}, ...rest } = parseYaml(text) ?? {};
  if (Object.keys(rest).length) throw new Error(`${OVERRIDES}: unknown top-level keys ${Object.keys(rest).join(', ')} (clients, entries)`);
  for (const [key, c] of Object.entries(clients)) {
    if (!/^[a-z0-9-]+$/.test(c?.slug ?? '')) throw new Error(`${OVERRIDES}: client ${key} needs a lowercase slug`);
    const bad = Object.entries(c.name ?? {}).filter(([l, n]) => !LOCALES.includes(l) || typeof n !== 'string' || !n.trim());
    if (!c.name || bad.length) throw new Error(`${OVERRIDES}: client ${key} needs name: { <locale>: <name> }`);
  }
  for (const [id, o] of Object.entries(entries)) {
    if (!/^(?:zh-TW|en|vi)\/[a-z0-9-]+$/.test(id)) throw new Error(`${OVERRIDES}: "${id}" is not <locale>/<slug>`);
    const extra = Object.keys(o ?? {}).filter((k) => !['title', 'seoTitle', 'description'].includes(k));
    if (extra.length) throw new Error(`${OVERRIDES}: ${id} has unknown keys ${extra.join(', ')} (title, seoTitle, description)`);
  }
  return { clients, entries };
}

/** Offerings a description names, split into the ones with an entry in the locale and the ones without. */
export function mentionedOfferings(description, locale, exists) {
  const ids = [...new Set(MENTIONS.filter(([re]) => re.test(description)).map(([, id]) => id))];
  return { found: ids.filter((id) => exists(`${locale}/${id}`)).map((id) => `${locale}/${id}`), missing: ids.filter((id) => !exists(`${locale}/${id}`)) };
}

/**
 * Frontmatter, body and reviewer notes for one card. The body is the description as the site writes it.
 * @returns {{ data: Record<string, unknown>, body: string, notes: string[] }}
 */
export function caseEntry({ locale, slug, card, order, client, logoFile, override, offeringExists }) {
  const notes = [];
  const name = client.name[locale];
  if (!name) throw new Error(`${OVERRIDES}: client ${client.slug} has no ${locale} name`);
  if (!card.description.toLowerCase().includes(name.toLowerCase())) notes.push(`client name "${name}" is not in the description`);
  const { found, missing } = mentionedOfferings(card.description, locale, offeringExists);
  if (missing.length) notes.push(`names ${missing.join(', ')} (no ${locale} offering entry yet)`);
  for (const m of card.description.match(DATED) ?? []) notes.push(`dated: ${m.trim()}`);
  const id = `${locale}/${slug}`;
  // Several clients have cases with the same title (網路投保系統), and every page needs its own <title>
  const seoTitle = card.title.toLowerCase().includes(name.toLowerCase()) ? undefined : `${name}${locale === 'zh-TW' ? '：' : ': '}${card.title}`;
  const data = applyOverrides(
    {
      title: card.title,
      seoTitle,
      description: card.description,
      translationKey: slug,
      client: { name, disclosed: true, logo: assetRef(id, logoFile) },
      industry: INDUSTRY[card.type],
      offerings: found.length ? found : undefined,
      order,
      sourceUrl: SOURCES[locale],
      migratedAt: undefined,
    },
    override,
  );
  if (!data.industry) throw new Error(`card type "${card.type}" has no industry in INDUSTRY`);
  notes.push(...frontmatterNotes(locale, data));
  return { data, body: card.description, notes };
}

/** The cards of one locale: the list page, then the chunk among its scripts that holds them. */
async function fetchCards(get, locale) {
  const page = SOURCES[locale];
  const res = await get(page);
  if (!res.ok) throw new Error(`${page}: HTTP ${res.status}`);
  const html = res.body.toString('utf8');
  const chunks = [...new Set([...html.matchAll(/<script[^>]+src="(\/_nuxt\/[^"]+\.js)"/g)].map((m) => new URL(m[1], page).href))];
  const found = [];
  for (const url of chunks) {
    const js = await get(url);
    if (!js.ok) throw new Error(`${url}: HTTP ${js.status}`);
    const cards = parseCards(js.body.toString('utf8'));
    if (cards) found.push({ url, cards });
  }
  if (found.length !== 1) throw new Error(`${page}: expected one chunk with success-story cards, found ${found.length}`);
  return { origin: new URL(page).origin, ...found[0] };
}

async function fetchLogo(get, url) {
  const res = await get(url);
  if (!res.ok) throw new Error(`logo ${url}: HTTP ${res.status}`);
  const ext = imageExt(res.body);
  if (!ext) throw new Error(`logo ${url}: not a format astro:assets reads`);
  const { width, height } = await sharp(res.body).metadata();
  return { ...(await optimizeImage(res.body, ext)), width, height };
}

async function main() {
  const { values: args } = parseArgs({ options: { refresh: { type: 'boolean' }, 'dry-run': { type: 'boolean' }, report: { type: 'string' } } });
  // Imported here: http.mjs re-executes the process with proxy support on import
  const { request } = await import('../../inventory/http.mjs');
  const get = cachedFetcher(request, { refresh: args.refresh });
  const { clients, entries: overrides } = parseOverrides(existsSync(OVERRIDES) ? await readFile(OVERRIDES, 'utf8') : '');
  const offeringExists = (id) => existsSync(`src/content/offering/${id}.md`);
  const date = today();

  const sources = {};
  for (const locale of LOCALES) sources[locale] = await fetchCards(get, locale);
  const base = sources['zh-TW'].cards;
  const clientOf = (card) => {
    const c = clients[logoKey(card.logo)];
    if (!c) throw new Error(`${OVERRIDES}: no client for logo ${card.logo} (key ${logoKey(card.logo)})`);
    return c;
  };
  const enIndex = align(base, sources.en.cards);
  const en = base.map((_, i) => sources.en.cards[enIndex.indexOf(i)]);
  const baseSlugs = slugs(base, en, clientOf);

  const report = [];
  const seen = new Set();
  for (const locale of LOCALES) {
    const { origin, url: chunk, cards } = sources[locale];
    const index = locale === 'zh-TW' ? cards.map((_, i) => i) : align(base, cards);
    const paired = new Set(index);
    base.forEach((card, i) => {
      if (!paired.has(i)) report.push({ locale, id: '', status: 'missing', sourceUrl: SOURCES[locale], notes: [`no ${locale} card for zh-TW「${card.title}」(${baseSlugs[i]})`] });
    });
    for (const [j, card] of cards.entries()) {
      const i = index[j];
      const row = { locale, id: '', status: 'failed', sourceUrl: SOURCES[locale], notes: [] };
      report.push(row);
      try {
        if (i === null) throw new Error(`no zh-TW card with logo ${card.logo} and type ${card.type} at this position (${chunk})`);
        const slug = baseSlugs[i];
        const id = `${locale}/${slug}`;
        row.id = id;
        seen.add(id);
        const logo = await fetchLogo(get, new URL(card.logo, origin).href);
        const logoFile = `logo.${logo.ext}`;
        const { data, body, notes } = caseEntry({ locale, slug, card, order: i, client: clientOf(card), logoFile, override: overrides[id], offeringExists });
        row.notes.push(`logo ${logo.width}×${logo.height}`, ...notes);
        const path = contentFile(id);
        const existing = existsSync(path) ? await readFile(path, 'utf8') : null;
        const text = entryText(data, body, existing, date, locale);
        row.status = text === existing ? 'unchanged' : 'written';
        if (args['dry-run']) continue;
        await syncImages(assetDir(id), [{ url: card.logo, bytes: logo.bytes }], new Map([[card.logo, logoFile]]));
        if (text !== existing) {
          await mkdir(dirname(path), { recursive: true });
          await writeAtomic(path, text);
        }
      } catch (error) {
        row.status = 'failed';
        row.notes.unshift(error.message);
      }
    }
  }

  // Entries no card produces any more (and the hand-written sample): remove them and their logos
  for (const locale of LOCALES) {
    const dir = `src/content/case-study/${locale}`;
    if (!existsSync(dir)) continue;
    for (const file of (await readdir(dir)).filter((f) => f.endsWith('.md'))) {
      const id = `${locale}/${file.slice(0, -3)}`;
      if (seen.has(id)) continue;
      if (!args['dry-run']) {
        await rm(join(dir, file));
        await rm(assetDir(id), { recursive: true, force: true });
      }
      report.push({ locale, id, status: 'removed', sourceUrl: '', notes: ['no card on the current site'] });
    }
  }
  const stale = Object.keys(overrides).filter((id) => !seen.has(id));
  if (stale.length) report.push({ locale: '', id: '', status: 'failed', sourceUrl: '', notes: [`${OVERRIDES} has entries that are not migrated: ${stale.join(', ')}`] });

  printSummary(report);
  if (args.report) await writeReport(args.report, report);
  if (report.some((r) => r.status === 'failed')) process.exitCode = 1;
}

function printSummary(report) {
  for (const locale of LOCALES) {
    const c = { written: 0, unchanged: 0, removed: 0, missing: 0, failed: 0 };
    for (const r of report.filter((r) => r.locale === locale)) c[r.status] += 1;
    console.log(`${locale}: written ${c.written}, unchanged ${c.unchanged}, removed ${c.removed}, missing ${c.missing}, failed ${c.failed}`);
  }
  for (const r of report.filter((r) => r.status === 'failed')) console.log(`failed ${r.id || r.locale}: ${r.notes[0]}`);
}

async function writeReport(path, report) {
  const header = ['locale', 'id', 'status', 'source_url', 'notes'];
  const lines = report.map((r) => [r.locale, r.id, r.status, r.sourceUrl, r.notes.join(' ; ')].map(csvCell).join(','));
  await mkdir(dirname(path), { recursive: true });
  await writeAtomic(path, `${[header.join(','), ...lines].join('\n')}\n`);
  console.log(`report: ${path} (${report.length} rows)`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) await main();
