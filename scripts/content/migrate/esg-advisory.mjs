#!/usr/bin/env node
// Converts the current site's ESG advisory page into src/content/offering/<locale>/esg-advisory.md and its
// advisor pages into src/content/person/<locale>/<slug>.md (#107). Which pages: page-map.csv rows with
// node esg-advisory and esg-advisor. Both are Nuxt SSR pages with all the copy in the HTML, so fields are
// read by class name, as in offerings.mjs. Sections the offering schema has no field for (the ESG intro,
// the regulation timeline, the GreenSwift block) and the advisors' photos (permission not confirmed) are
// left out: docs/content/migration.md「ESG 顧問服務」.
// Usage: node scripts/content/migrate/esg-advisory.mjs [--locale zh-TW|en|vi] [--refresh]
import { existsSync } from 'node:fs';
import { mkdir, readFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import { parse } from 'node-html-parser';
import { parse as parseYaml } from 'yaml';
import { readCsv } from '../../inventory/csv.mjs';
import { cachedFetcher, writeAtomic } from './cache.mjs';
import { applyOverrides, DESCRIPTION_MAX, frontmatterNotes } from './frontmatter.mjs';
import { entryText, today } from './migrate.mjs';

const LOCALES = ['zh-TW', 'en', 'vi'];
export const OVERRIDES = 'scripts/content/migrate/esg-advisory-overrides.yaml';
const SERVICE_NODE = 'esg-advisory';
const PERSON_NODE = 'esg-advisor';

const contentFile = (id) => `src/content/${id}.md`;

/** Text on one line. <br> becomes a space; a space after full-width punctuation is dropped. */
const text = (el) =>
  el?.text
    .replace(/\s+/g, ' ')
    .replace(/([，。、：；！？])\s+/g, '$1')
    .trim() ?? '';
const page = (html) => parse(html.replace(/<br\b[^>]*>/g, ' '));

/** Path of a team card's link, without the locale prefix (/en/esg-advisory/x → x). */
const advisorSlug = (href) => /\/esg-advisory\/([^/?#]+)$/.exec(href ?? '')?.[1];

/**
 * Copy of the ESG advisory page.
 * @param {string} html
 */
export function extractService(html) {
  const root = page(html);
  const features = root.querySelectorAll('.section04-card').map((card) => ({
    title: text(card.querySelector('.section04-card__title')),
    body: text(card.querySelector('.section04-card__content')),
  }));
  // zh-TW「Q1：」「A：」, en「Q1:」「A:」, vi「Câu 1:」「Câu hỏi 2:」 and no answer prefix
  const faq = root.querySelectorAll('.faq-item').map((item) => ({
    question: text(item.querySelector('.faq-item__question')).replace(/^(?:Q|Câu(?: hỏi)?\s*)\d+\s*[:：]\s*/, ''),
    answer: text(item.querySelector('.faq-item__answer')).replace(/^A\s*[:：]\s*/, ''),
  }));
  // The team section: cards with a link have an advisor page, the others only a name
  const team = root.querySelectorAll('.section03-card').map((card) => ({
    name: text(card.querySelector('.section03-card__name')),
    slug: advisorSlug(card.getAttribute('href')),
  }));
  const data = {
    title: text(root.querySelector('h1 .subtitle')),
    // The hero's slogan is empty on all three locales; the first section's heading is the page's line
    tagline: text(root.querySelector('.section01__title')),
    description: root.querySelector('meta[name="description"]')?.getAttribute('content')?.replace(/\s+/g, ' ').trim() ?? '',
    features,
    faq,
    team,
  };
  const empty = [
    ...['title', 'tagline', 'description'].filter((k) => !data[k]),
    ...Object.entries({ features, faq, team }).filter(([, items]) => items.length === 0).map(([k]) => k),
    ...features.flatMap((f, i) => (f.title && f.body ? [] : [`features.${i}`])),
    ...faq.flatMap((f, i) => (f.question && f.answer ? [] : [`faq.${i}`])),
    ...team.flatMap((t, i) => (t.name ? [] : [`team.${i}`])),
  ];
  if (empty.length) throw new Error(`not found on the page (template changed?): ${empty.join(', ')}`);
  return data;
}

// Section headings of an advisor page, per locale
const SECTIONS = {
  experience: ['經歷', 'Professional Experience', 'Kinh nghiệm'],
  education: ['學歷', 'Education', 'Trình độ học vấn'],
  expertise: ['專長', 'Expertise', 'Chuyên môn'],
  certifications: ['證照', 'Certification', 'Certifications', 'Chứng nhận'],
};

/** Split the one-line expertise list at 、 or commas outside parentheses. */
export function splitList(s) {
  const out = [];
  let depth = 0;
  let current = '';
  for (const ch of s) {
    if ('(（'.includes(ch)) depth++;
    if (')）'.includes(ch)) depth = Math.max(0, depth - 1);
    if (depth === 0 && '、,，'.includes(ch)) {
      out.push(current);
      current = '';
    } else current += ch;
  }
  out.push(current);
  return out.map((x) => x.trim()).filter(Boolean);
}

/**
 * Copy of one advisor page.
 * @param {string} html
 */
export function extractPerson(html) {
  const root = page(html);
  const data = {
    name: text(root.querySelector('.banner__name')),
    jobTitle: text(root.querySelector('.banner__job')),
    affiliation: text(root.querySelector('.banner__detail')) || undefined,
  };
  for (const section of root.querySelectorAll('.section01-section')) {
    const title = text(section.querySelector('.section01__title'));
    const key = Object.keys(SECTIONS).find((k) => SECTIONS[k].includes(title));
    if (!key) throw new Error(`unknown section "${title}" (add it to SECTIONS)`);
    const items = section.querySelectorAll('.section01-section__list-item').map(text).filter(Boolean);
    data[key] = key === 'expertise' ? items.flatMap(splitList) : items;
  }
  const empty = ['name', 'jobTitle'].filter((k) => !data[k]);
  if (empty.length) throw new Error(`not found on the page (template changed?): ${empty.join(', ')}`);
  return data;
}

// One sentence from the page's facts: name, title and affiliation, as many expertise items as fit
const DESCRIPTION = {
  'zh-TW': { lead: (p) => `${p.name}（${[p.jobTitle, p.affiliation].filter(Boolean).join('｜')}），昕力資訊 ESG 顧問團隊成員。`, more: '專長：', sep: '、', end: '。' },
  en: { lead: (p) => `${p.name} (${[p.jobTitle, p.affiliation].filter(Boolean).join(', ')}) is a member of TPIsoftware's ESG consulting team.`, more: ' Expertise: ', sep: ', ', end: '.' },
  vi: { lead: (p) => `${p.name} (${[p.jobTitle, p.affiliation].filter(Boolean).join(', ')}) là thành viên đội ngũ tư vấn ESG của TPIsoftware.`, more: ' Chuyên môn: ', sep: ', ', end: '.' },
};

/**
 * Without the affiliation when the lead alone is too long (en and vi translate the long ones word for word).
 * @param {string} locale @param {ReturnType<typeof extractPerson>} p
 */
export function personDescription(locale, p) {
  const d = DESCRIPTION[locale];
  const max = DESCRIPTION_MAX[locale];
  const fits = (s) => [...s].length <= max;
  const lead = [d.lead(p), d.lead({ ...p, affiliation: undefined })].find(fits) ?? d.lead({ ...p, affiliation: undefined });
  let best = lead;
  for (let n = 1; n <= (p.expertise?.length ?? 0); n++) {
    const s = `${lead}${d.more}${p.expertise.slice(0, n).join(d.sep)}${d.end}`;
    if (!fits(s)) break;
    best = s;
  }
  return best;
}

/**
 * Overrides file: <offering|person>/<locale>/<slug> → { frontmatter: {...} }.
 */
export function parseOverrides(source) {
  const all = parseYaml(source) ?? {};
  for (const [id, o] of Object.entries(all)) {
    if (!/^(?:offering|person)\/(?:zh-TW|en|vi)\/[a-z0-9-]+$/.test(id)) throw new Error(`${OVERRIDES}: "${id}" is not <offering|person>/<locale>/<slug>`);
    const extra = Object.keys(o ?? {}).filter((k) => k !== 'frontmatter');
    if (extra.length) throw new Error(`${OVERRIDES}: ${id} has unknown keys ${extra.join(', ')} (frontmatter)`);
  }
  return all;
}

function withOverrides(data, override) {
  const unknownKeys = Object.keys(override?.frontmatter ?? {}).filter((k) => !(k in data));
  if (unknownKeys.length) throw new Error(`${OVERRIDES}: unknown frontmatter keys ${unknownKeys.join(', ')}`);
  return applyOverrides(data, override?.frontmatter);
}

/** Frontmatter of the offering entry, key order as in src/content/offering/zh-TW/digirunner.md. */
export function serviceFrontmatter({ sourceUrl, page: p, override }) {
  return withOverrides(
    {
      title: p.title,
      description: p.description,
      translationKey: SERVICE_NODE,
      node: SERVICE_NODE,
      kind: 'service',
      tagline: p.tagline,
      features: p.features,
      faq: p.faq,
      cta: 'contact',
      sourceUrl,
    },
    override,
  );
}

/** Frontmatter of a person entry, key order as in docs/ia/content-model.md「person」. No photo: permission not confirmed. */
export function personFrontmatter({ locale, slug, order, sourceUrl, page: p, override }) {
  return withOverrides(
    {
      title: p.name,
      description: personDescription(locale, p),
      // content-model.md: the zh-TW slug. The slugs are the same in all locales, and an advisor without
      // a zh-TW page (huang-zhijun) uses their own
      translationKey: slug,
      jobTitle: p.jobTitle,
      affiliation: p.affiliation,
      order,
      experience: p.experience,
      education: p.education,
      expertise: p.expertise,
      certifications: p.certifications,
      sourceUrl,
    },
    override,
  );
}

/** Team cards against the page-map rows of the same locale, for the report. */
export function teamNotes(team, slugs) {
  const notes = [];
  const linked = team.filter((t) => t.slug);
  const noPage = team.filter((t) => !t.slug).map((t) => t.name);
  if (noPage.length) notes.push(`team cards without an advisor page: ${noPage.join(', ')}`);
  const unmapped = linked.filter((t) => !slugs.includes(t.slug)).map((t) => `${t.name} → ${t.slug}`);
  if (unmapped.length) notes.push(`team links not in page-map.csv: ${unmapped.join(', ')}`);
  const unlisted = slugs.filter((s) => !linked.some((t) => t.slug === s));
  if (unlisted.length) notes.push(`page-map.csv advisors not linked from the team: ${unlisted.join(', ')}`);
  return notes;
}

const slugOf = (url) => advisorSlug(new URL(url).pathname);

async function migrateEntry({ get, row, inventory, overrides, date, slugs, order }) {
  const isService = row.node === SERVICE_NODE;
  const slug = isService ? SERVICE_NODE : slugOf(row.url);
  const id = `${isService ? 'offering' : 'person'}/${row.locale}/${slug}`;
  const inv = inventory.get(row.url);
  const sourceUrl = inv?.final_url || row.url;
  const notes = inv?.to_confirm ? [`to_confirm: ${inv.to_confirm}`] : [];
  try {
    const res = await get(sourceUrl);
    if (!res.ok) throw new Error(`${sourceUrl}: HTTP ${res.status}`);
    const html = res.body.toString('utf8');
    let data;
    if (isService) {
      const p = extractService(html);
      data = serviceFrontmatter({ sourceUrl, page: p, override: overrides[id] });
      notes.push(...teamNotes(p.team, slugs));
    } else {
      data = personFrontmatter({ locale: row.locale, slug, order: order.get(slug), sourceUrl, page: extractPerson(html), override: overrides[id] });
      if (data.order === undefined) notes.push('not linked from the team list: no order');
    }
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
  const { values: args } = parseArgs({ options: { locale: { type: 'string' }, refresh: { type: 'boolean' } } });
  if (args.locale && !LOCALES.includes(args.locale)) throw new Error(`--locale must be one of ${LOCALES.join(', ')}`);
  // Imported here: http.mjs re-executes the process with proxy support on import
  const { request } = await import('../../inventory/http.mjs');
  const get = cachedFetcher(request, { refresh: args.refresh });
  const rows = (await readCsv('docs/ia/page-map.csv')).filter(
    (r) => [SERVICE_NODE, PERSON_NODE].includes(r.node) && ['keep', 'rewrite', 'merge'].includes(r.disposition) && (!args.locale || r.locale === args.locale),
  );
  const merged = rows.filter((r) => r.disposition === 'merge');
  if (merged.length) throw new Error(`merge rows are not supported: ${merged.map((r) => r.url).join(', ')}`);
  const inventory = new Map((await readCsv('docs/research/inventory.csv')).map((r) => [r.url, r]));
  const overrides = existsSync(OVERRIDES) ? parseOverrides(await readFile(OVERRIDES, 'utf8')) : {};
  const date = today();
  const slugsOf = (locale) => rows.filter((r) => r.locale === locale && r.node === PERSON_NODE).map((r) => slugOf(r.url));

  // Team order per locale, from the service page (cached, so converting it again below costs nothing)
  const orders = new Map();
  for (const row of rows.filter((r) => r.node === SERVICE_NODE)) {
    const res = await get(inventory.get(row.url)?.final_url || row.url);
    const team = res.ok ? extractService(res.body.toString('utf8')).team : [];
    orders.set(row.locale, new Map(team.flatMap((t, i) => (t.slug ? [[t.slug, i]] : []))));
  }

  const report = [];
  for (const row of rows) {
    report.push(await migrateEntry({ get, row, inventory, overrides, date, slugs: slugsOf(row.locale), order: orders.get(row.locale) ?? new Map() }));
  }
  if (!args.locale) {
    const stale = Object.keys(overrides).filter((id) => !report.some((r) => r.id === id));
    if (stale.length) report.push({ id: '-', status: 'failed', notes: [`${OVERRIDES} has entries that are not migrated: ${stale.join(', ')}`] });
  }
  for (const r of report.sort((a, b) => a.id.localeCompare(b.id))) console.log(`${r.status.padEnd(9)} ${r.id}${r.notes.length ? `: ${r.notes.join(' ; ')}` : ''}`);
  const count = (s) => report.filter((r) => r.status === s).length;
  console.log(`written ${count('written')}, unchanged ${count('unchanged')}, failed ${count('failed')}`);
  if (count('failed')) process.exitCode = 1;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) await main();
