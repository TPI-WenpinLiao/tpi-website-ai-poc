// Checks the fact library (docs/strategy/facts.yaml) and that page copy only states facts from it (#163).
// Copy is either a fact (number, client, certification, award, feature, case result, company data),
// which must come from the library, or wording, which may be original (CLAUDE.md「內容規則」).
//
//   node scripts/strategy/facts.mjs             offline, part of `npm run check`:
//     - every entry matches the schema in src/data/facts.ts (fields listed in facts.yaml's header)
//     - a confirmed fact's text keeps the quote's words: only punctuation, spaces and line breaks added
//     - every fact a page uses exists, is confirmed and is in the page's locale
//     - a page whose copy has an Arabic number (80%, 1,200, 3.5) or the name of a `client` fact
//       uses a fact whose text has it; otherwise the number or name is not traceable and fails
//   node scripts/strategy/facts.mjs --sources [--locales zh-TW,en]   fetches every source.url and fails when its
//     source.quote is no longer on the page, its Nuxt chunks nor its news body (needs www.tpisoftware.com
//     and .vn, not in `npm run check`); always fetches, the cache of extract-facts.mjs is only written
//
// Pages checked: src/data/home/<locale>.ts and src/data/site.ts (every exported string; facts used
// via fact('<id>') in the source), and the Markdown entries of src/content that are not verbatim
// migrations: `sourceUrl: []` or a `facts` field (frontmatter strings and body; facts listed in `facts`).
// Strategy documents (#165, #166, #186): docs/strategy/messaging.md, design-principles.md, briefs/*.md and the
// research documents competitors.md and search-intent.md cite facts as
// `fact:<id>`; each must exist and be zh-TW, and confirmed unless it sits under a heading that names
// it as missing evidence (缺少證據) or to confirm (待確認).
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parse } from 'yaml';
import { FACTS_FILE, factsSchema } from '../../src/data/facts.ts';
import { LOCALES } from '../../src/lib/i18n/locales.ts';

const ROOT = resolve(import.meta.dirname, '../..');

/**
 * Format problems of the parsed facts.yaml (the schema in src/data/facts.ts)
 * @param {unknown} data
 * @returns {string[]}
 */
export function validateFacts(data) {
  const result = factsSchema.safeParse(data);
  if (result.success) {
    // A page may cite a confirmed fact whose text names a client; checkPage then accepts the name,
    // so a client still to_confirm (license) must not appear in a confirmed fact's text
    const pending = result.data.filter((c) => c.type === 'client' && c.status !== 'confirmed');
    return result.data.flatMap((f) => {
      // `text` may trim the quote or add break points, but its numbers are the quote's
      const quoted = numbers(f.source.quote);
      const extra = numbers(f.text)
        .filter((n) => !quoted.includes(n))
        .map((n) => `${FACTS_FILE} ${f.id}: ${n} in text is not in source.quote`);
      const named =
        f.status === 'confirmed'
          ? pending.filter((c) => c.locale === f.locale && f.text.includes(c.text)).map((c) => `${FACTS_FILE} ${f.id}: confirmed text names client ${c.text}, which is ${c.status} (${c.id})`)
          : [];
      // A readable `text` may add punctuation, spaces or line breaks to a fragment quote (#186), but
      // keeps its words: without them, text is part of the quote. Only confirmed facts reach pages
      const reworded =
        f.status === 'confirmed' && !wording(f.source.quote).includes(wording(f.text))
          ? [`${FACTS_FILE} ${f.id}: text changes or adds words of source.quote (only punctuation, spaces and line breaks may be added)`]
          : [];
      return [...extra, ...named, ...reworded];
    });
  }
  return result.error.issues.map((i) => {
    const entry = typeof i.path[0] === 'number' ? data[i.path[0]] : undefined;
    const where = typeof i.path[0] === 'number' ? `entry ${i.path[0] + 1}${typeof entry?.id === 'string' ? ` (${entry.id})` : ''}` : 'file';
    const field = i.path.slice(1).join('.');
    return `${FACTS_FILE} ${where}${field ? ` ${field}` : ''}: ${i.message}`;
  });
}

/**
 * The words of a string: full-width folded, whitespace, U+200B and punctuation dropped
 * 「2019 第一階段 公開資訊開放」and「2019 年第一階段：公開資訊開放」differ only by 年
 * @param {string} s
 */
export const wording = (s) => s.normalize('NFKC').replace(/[\s​\p{P}]/gu, '');

/**
 * Arabic numbers in a string, full-width digits folded, thousands separators dropped:
 * 「節省逾80%」→ ['80%'], 'NT$1,200 and 3.5x' → ['1200', '3.5']
 * @param {string} s
 * @returns {string[]}
 */
export const numbers = (s) => [...s.normalize('NFKC').matchAll(/\d+(?:,\d{3})*(?:\.\d+)?%?/g)].map((m) => m[0].replaceAll(',', ''));

/**
 * Whether a number from a page is in a fact's text: 80% needs 80%, a bare 80 is covered by 80 or 80%
 * @param {string} n
 * @param {string[]} factNumbers
 */
const covers = (n, factNumbers) => factNumbers.some((f) => f === n || (!n.endsWith('%') && f === `${n}%`));

/**
 * Problems of one page: facts it uses that don't exist, aren't confirmed or are in another locale,
 * and numbers or client names in its copy that none of its facts has
 * @param {{ name: string, locale?: string, strings: string[], uses: string[] }} page
 * @param {Map<string, { type: string, text: string, locale: string, status: string }>} facts
 * @returns {string[]}
 */
export function checkPage(page, facts) {
  const errors = [];
  const used = [];
  for (const id of new Set(page.uses)) {
    const f = facts.get(id);
    if (!f) errors.push(`${page.name}: fact ${id} is not in ${FACTS_FILE}`);
    else if (f.status !== 'confirmed') errors.push(`${page.name}: fact ${id} is ${f.status}, pages only use confirmed facts`);
    else if (page.locale && f.locale !== page.locale) errors.push(`${page.name}: fact ${id} is ${f.locale}, the page is ${page.locale}`);
    else used.push(f);
  }
  const usedNumbers = used.flatMap((f) => numbers(f.text));
  const usedText = used.map((f) => f.text.toLowerCase()).join('\n');
  const clients = [...facts.values()].filter((f) => f.type === 'client' && (!page.locale || f.locale === page.locale));
  for (const s of page.strings) {
    for (const n of numbers(s)) {
      if (!covers(n, usedNumbers)) errors.push(`${page.name}: ${n} in "${s}" is in none of the page's facts`);
    }
    for (const c of clients) {
      const name = c.text.toLowerCase();
      if (s.toLowerCase().includes(name) && !usedText.includes(name)) errors.push(`${page.name}: client ${c.text} in "${s}" is in none of the page's facts`);
    }
  }
  return errors;
}

// Frontmatter fields that hold ids, paths, URLs or dates rather than copy
const NOT_COPY = new Set(['translationKey', 'node', 'sourceUrl', 'migratedAt', 'sourceUpdatedAt', 'publishedAt', 'updatedAt', 'facts', 'tags', 'industry', 'href', 'url', 'image', 'cover', 'ogImage', 'logo', 'file', 'slug', 'id']);
const PATH_OR_URL = /^(?:\.{0,2}\/|https?:|mailto:|tel:)/;

/**
 * Copy strings of a value: every string, skipping `NOT_COPY` keys, paths and URLs; functions are skipped
 * @param {unknown} value
 * @returns {string[]}
 */
export function copyStrings(value) {
  if (typeof value === 'string') return PATH_OR_URL.test(value) ? [] : [value];
  if (Array.isArray(value)) return value.flatMap(copyStrings);
  if (value && typeof value === 'object' && !(value instanceof Date)) {
    return Object.entries(value).flatMap(([k, v]) => (NOT_COPY.has(k) ? [] : copyStrings(v)));
  }
  return [];
}

/**
 * Markdown body as copy: code, HTML tags, link and image targets, ordered-list markers dropped
 * @param {string} body
 */
export const bodyCopy = (body) =>
  body
    .replace(/```[\s\S]*?```|`[^`\n]*`/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\]\([^)]*\)/g, ']')
    .replace(/^\[[^\]]+\]:.*$/gm, '')
    // Ordered-list markers (1. 2.) are formatting, not numbers
    .replace(/^\s*\d+[.)]\s+/gm, '');

/**
 * The page of a Markdown entry, or null when it is a verbatim migration (sourceUrl set, no `facts`)
 * @param {string} name repository-relative path, src/content/<collection>/<locale>/...
 * @param {string} source file contents
 */
export function markdownPage(name, source) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(source);
  if (!m) return null;
  const data = parse(m[1]) ?? {};
  const original = Array.isArray(data.sourceUrl) && data.sourceUrl.length === 0;
  if (!original && !('facts' in data)) return null;
  const locale = name.split('/')[3];
  return {
    name,
    locale: LOCALES.includes(locale) ? locale : undefined,
    strings: [...copyStrings(data), ...bodyCopy(m[2]).split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)],
    uses: Array.isArray(data.facts) ? data.facts.map(String) : [],
  };
}

/**
 * Facts a TypeScript data file uses: every fact('<id>') in its source outside comments
 * @param {string} source
 */
export const factCalls = (source) =>
  [...source.replace(/\/\*[\s\S]*?\*\/|^\s*\/\/.*$/gm, '').matchAll(/\bfact\(\s*(['"])([^'"]+)\1\s*\)/g)].map((m) => m[2]);

// Headings under which a strategy document may cite facts that are not confirmed yet
const PENDING_HEADING = /缺少證據|待確認/;

/**
 * Problems of a strategy document (messaging or content brief): every `fact:<id>` it cites must exist and be in
 * its locale, and be confirmed unless a heading above it (any level) is a missing-evidence or to-confirm section
 * @param {string} name
 * @param {string} md
 * @param {Map<string, { locale: string, status: string }>} facts
 * @param {string} [locale]
 * @returns {{ errors: string[], cited: string[] }}
 */
export function checkStrategyDoc(name, md, facts, locale = 'zh-TW') {
  const errors = [];
  const cited = [];
  /** @type {string[]} heading text by level - 1 */
  const headings = [];
  let fenced = false;
  md.split('\n').forEach((line, i) => {
    if (/^\s*```/.test(line)) fenced = !fenced;
    const h = fenced ? null : /^(#{1,6})\s+(.*)$/.exec(line);
    if (h) {
      headings.length = h[1].length - 1;
      headings[h[1].length - 1] = h[2];
    }
    // A citation in a heading is checked under that heading itself
    const pendingAllowed = headings.some((t) => t && PENDING_HEADING.test(t));
    for (const m of line.matchAll(/`fact:([^`\s]+)`/g)) {
      const id = m[1];
      const f = facts.get(id);
      const at = `${name}:${i + 1}`;
      cited.push(id);
      if (!f) errors.push(`${at}: fact ${id} is not in ${FACTS_FILE}`);
      else if (f.locale !== locale) errors.push(`${at}: fact ${id} is ${f.locale}, the document is ${locale}`);
      else if (f.status !== 'confirmed' && !pendingAllowed) errors.push(`${at}: fact ${id} is ${f.status}; cite it only under a 缺少證據 or 待確認 heading`);
    }
  });
  return { errors, cited };
}

function strategyDocs() {
  const briefs = join(ROOT, 'docs/strategy/briefs');
  const docs = ['messaging.md', 'design-principles.md', 'competitors.md', 'search-intent.md'];
  const files = [...docs.map((f) => join(ROOT, 'docs/strategy', f)), ...(existsSync(briefs) ? readdirSync(briefs).filter((f) => f.endsWith('.md')).map((f) => join(briefs, f)) : [])];
  return files.filter((p) => existsSync(p)).map((p) => ({ name: relative(ROOT, p).split('\\').join('/'), md: readFileSync(p, 'utf8') }));
}

function* walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else yield p;
  }
}

async function dataPages() {
  const files = [
    ...readdirSync(join(ROOT, 'src/data/home'))
      .filter((f) => f.endsWith('.ts') && f !== 'index.ts')
      .map((f) => [`src/data/home/${f}`, f.replace(/\.ts$/, '')]),
    ['src/data/site.ts', undefined],
  ];
  return Promise.all(
    files.map(async ([name, locale]) => {
      const path = join(ROOT, name);
      const mod = await import(pathToFileURL(path).href);
      return { name, locale, strings: copyStrings(mod), uses: factCalls(readFileSync(path, 'utf8')) };
    }),
  );
}

function contentPages() {
  return [...walk(join(ROOT, 'src/content'))]
    .filter((p) => /\.mdx?$/.test(p))
    .map((p) => markdownPage(relative(ROOT, p).split('\\').join('/'), readFileSync(p, 'utf8')))
    .filter((p) => p !== null);
}

async function checkSources(facts) {
  // Same reader as extract-facts.mjs: a quote may be in the Nuxt chunks or the news body of a client-rendered page
  const { pageReader } = await import('./source-pages.mjs');
  const reader = await pageReader({ refresh: true });
  let failed = 0;
  for (const f of facts) {
    const ok = await reader.has(f.source.url, f.source.quote);
    if (!ok) failed += 1;
    console.log(`${ok ? 'ok  ' : 'MISS'} ${f.id}: ${f.source.quote} (${f.source.url})`);
  }
  console.log(`${facts.length - failed}/${facts.length} quotes found on ${new Set(facts.map((f) => f.source.url)).size} pages`);
  return failed;
}

async function main() {
  const data = parse(readFileSync(join(ROOT, FACTS_FILE), 'utf8'));
  const formatErrors = validateFacts(data);
  if (formatErrors.length) {
    for (const e of formatErrors) console.error(e);
    process.exit(1);
  }
  if (process.argv.includes('--sources')) {
    // --locales zh-TW,en: only those locales' facts, e.g. while www.tpisoftware.vn is unreachable
    const i = process.argv.indexOf('--locales');
    const only = i > 0 ? new Set(process.argv[i + 1].split(',')) : undefined;
    const checked = only ? data.filter((f) => only.has(f.locale)) : data;
    if (only) console.log(`not checked (locale not in --locales): ${data.length - checked.length} facts`);
    process.exit((await checkSources(checked)) ? 1 : 0);
  }

  const facts = new Map(data.map((f) => [f.id, f]));
  const pages = [...(await dataPages()), ...contentPages()];
  const docs = strategyDocs().map((d) => ({ name: d.name, ...checkStrategyDoc(d.name, d.md, facts) }));
  const errors = [...pages.flatMap((p) => checkPage(p, facts)), ...docs.flatMap((d) => d.errors)];
  for (const e of errors) console.error(e);
  const used = new Set(pages.flatMap((p) => p.uses));
  const cited = new Set(docs.flatMap((d) => d.cited));
  console.log(`${facts.size} facts, ${pages.length} pages checked (${used.size} facts used), ${docs.length} strategy documents (${cited.size} facts cited), ${errors.length} problems`);
  process.exit(errors.length ? 1 : 0);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) await main();
