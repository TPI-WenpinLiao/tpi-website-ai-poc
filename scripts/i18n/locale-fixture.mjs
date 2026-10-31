// Builds the site with a test locale turned on, to show that the shared layer (#114) is ready for
// en and vi: only interface copy and home copy are added, nothing in src/ is changed for the locale.
// Works on a copy of the repo in a temporary directory (node_modules linked), so nothing here is
// written to the working tree:
// - src/data/strings/<locale>.ts and src/data/home/<locale>.ts with placeholder copy: glossary.csv
//   values for interface strings, `[<locale>] <path>` for the rest
// - empty <locale> cells of docs/i18n/glossary.csv filled with `[<locale>] <id>`
// - src/content/organization/<locale>.yaml copied from zh-TW with `[<locale>] <path>` for every text
//   holding Han characters (#39, #40 write the real ones)
// The locale's content files stay, so its offering, blog and other pages are built as well; with
// --no-content they are removed from the copy, which checks the shared layer alone (problems left
// with content are the locale's own content: links in post bodies, descriptions, for #39 and #40).
// Then it runs `astro build`, scripts/i18n/routes.mjs and scripts/seo/meta.mjs on the copy, and
// checks that the locale's pages show no Han characters (no zh-TW text leaking in from the shared
// layer) and that the header shows the glossary names. With --no-content the whole page is checked,
// text and attributes such as alt, aria-label and meta content; with content only the header,
// footer and breadcrumbs, since content files may quote names in other scripts. Not part of `npm run check`:
// it builds the site a second time.
//
//   node scripts/i18n/locale-fixture.mjs <en|vi> [--no-content] [--keep]
// --keep leaves the temporary copy in place and prints its path.

import { execFileSync } from 'node:child_process';
import { cpSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parse } from 'node-html-parser';
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';
import { parseCsv } from '../inventory/csv.mjs';
import { toCsv } from './glossary.mjs';
import { urlPath } from './routes.mjs';

const ROOT = resolve(import.meta.dirname, '../..');
// Build output and caches of the working tree; the copy makes its own
const SKIP = new Set(['node_modules', '.git', 'dist', '.astro', '.lighthouseci', '.lhci-dist']);
const HAN = /\p{Script=Han}/u;

/** Parameter names of an arrow function, as glossary.mjs flattenStrings reads them @param {Function} fn */
const params = (fn) =>
  fn
    .toString()
    .match(/^\(?([^)=]*)\)?\s*=>/)?.[1]
    .split(',')
    .map((p) => p.trim().split(':')[0].trim())
    .filter(Boolean) ?? [];

/**
 * TypeScript source of `value` with every string and function replaced by `leaf(path, value)`'s
 * source; objects keep their keys
 * @param {unknown} value
 * @param {(path: string, value: string | Function) => string} leaf
 * @param {string} [path]
 * @returns {string}
 */
export function toSource(value, leaf, path = '') {
  if (typeof value === 'string' || typeof value === 'function') return leaf(path, value);
  if (Array.isArray(value)) return `[${value.map((v, i) => toSource(v, leaf, `${path}.${i}`)).join(', ')}]`;
  if (value && typeof value === 'object') {
    const entries = Object.entries(value).map(([k, v]) => `${JSON.stringify(k)}: ${toSource(v, leaf, path ? `${path}.${k}` : k)}`);
    return `{ ${entries.join(', ')} }`;
  }
  return JSON.stringify(value);
}

/**
 * src/data/strings/<locale>.ts: glossary values for interface strings ({n} placeholders become the
 * function's parameters), `[<locale>] pages.<id>` for page descriptions
 * @param {object} zhStrings the zh-TW `strings`
 * @param {Map<string, string>} names glossary id → value in the locale
 * @param {string} locale
 */
export function stringsSource(zhStrings, names, locale) {
  const body = toSource(zhStrings, (path, value) => {
    if (path.startsWith('pages.')) return JSON.stringify(`[${locale}] ${path}`);
    const text = names.get(`ui:${path}`) ?? `[${locale}] ${path}`;
    if (typeof value === 'string') return JSON.stringify(text);
    const args = params(value);
    const template = text.replaceAll('`', '\\`').replace(/\{(\w+)\}/g, (_, p) => `\${${p}}`);
    return `(${args.map((a) => `${a}: number`).join(', ')}) => \`${template}\``;
  });
  return `import type { Strings } from './zh-TW';\n\nexport const strings: Strings = ${body};\n`;
}

/**
 * src/data/home/<locale>.ts: `[<locale>] <path>` for every line, node ids kept
 * @param {object} zhHome the zh-TW `home`
 * @param {string} locale
 */
export function homeSource(zhHome, locale) {
  const body = toSource(zhHome, (path, value) => {
    // Node ids stay ids; every line of copy is a placeholder
    if (/(^|\.)node$/.test(path)) return JSON.stringify(value);
    if (typeof value === 'string') return JSON.stringify(`[${locale}] ${path}`);
    return `(...args: string[]) => ${JSON.stringify(`[${locale}] ${path} `)} + args.join(' ')`;
  });
  return `import type { Home } from './zh-TW';\n\nexport const home: Home = ${body};\n`;
}

/**
 * Glossary rows with every empty `locale` cell filled
 * @param {Record<string, string>[]} rows
 * @param {string} locale
 */
export const fillGlossary = (rows, locale) => rows.map((r) => (r[locale] ? r : { ...r, [locale]: `[${locale}] ${r.id}` }));

/**
 * Organization data with every string holding Han characters replaced by `[<locale>] <path>`
 * @param {unknown} value
 * @param {string} locale
 * @param {string} [path]
 * @returns {unknown}
 */
export function placeholderData(value, locale, path = '') {
  if (typeof value === 'string') return HAN.test(value) ? `[${locale}] ${path}` : value;
  if (Array.isArray(value)) return value.map((v, i) => placeholderData(v, locale, `${path}.${i}`));
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, placeholderData(v, locale, path ? `${path}.${k}` : k)]));
  return value;
}

// Attributes whose values are read out or shown
const TEXT_ATTRIBUTES = ['alt', 'aria-label', 'title', 'placeholder', 'content'];

/**
 * Names problems on the locale's built pages: Han characters (outside elements marked with another
 * lang) in the header, footer and breadcrumbs, or with `wholePage` anywhere in the page's text and
 * text attributes; and header labels missing from the home page
 * @param {Map<string, string>} pages URL path → HTML
 * @param {string} locale
 * @param {string[]} expected names the home page header must show
 * @param {{ wholePage?: boolean }} [options]
 */
export function nameProblems(pages, locale, expected, { wholePage = false } = {}) {
  const problems = [];
  const hanWords = (text) => [...new Set(text.split(/\s+/).filter((w) => HAN.test(w)))].slice(0, 5).join(' ');
  for (const [path, html] of pages) {
    if (path !== `/${locale}` && !path.startsWith(`/${locale}/`)) continue;
    const root = parse(html);
    // Locale names in the language menu are written in their own language and marked with lang
    for (const el of root.querySelectorAll('[lang], script, style')) if (el.tagName !== 'HTML') el.remove();
    const scopes = wholePage ? [root.querySelector('html') ?? root] : root.querySelectorAll('header.site-header, footer.site-footer, nav.breadcrumb');
    for (const el of scopes) {
      const where = `<${el.tagName.toLowerCase()}${el.getAttribute('class') ? ` class="${el.getAttribute('class')}"` : ''}>`;
      const text = hanWords(el.text);
      if (text) problems.push(`${path}: ${where} shows ${text}`);
      for (const child of el.querySelectorAll('*')) {
        for (const attr of TEXT_ATTRIBUTES) {
          const words = hanWords(child.getAttribute(attr) ?? '');
          if (words) problems.push(`${path}: ${attr} of <${child.tagName.toLowerCase()}> shows ${words}`);
        }
      }
    }
  }
  const home = pages.get(`/${locale}`);
  if (!home) problems.push(`/${locale} was not built`);
  else {
    const header = parse(home).querySelector('header.site-header')?.text ?? '';
    for (const name of expected) if (!header.includes(name)) problems.push(`/${locale}: header does not show ${name}`);
  }
  return problems;
}

/** @param {string} dir @param {string} script */
function run(dir, script, args = []) {
  try {
    const out = execFileSync(process.execPath, [script, ...args], { cwd: dir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    return { ok: true, out };
  } catch (e) {
    const err = /** @type {{ stdout?: string, stderr?: string }} */ (e);
    return { ok: false, out: `${err.stdout ?? ''}${err.stderr ?? ''}` };
  }
}

/** @param {string[]} args */
async function main(args) {
  const locale = args.find((a) => !a.startsWith('--'));
  const keep = args.includes('--keep');
  const noContent = args.includes('--no-content');
  if (locale !== 'en' && locale !== 'vi') throw new Error('usage: node scripts/i18n/locale-fixture.mjs <en|vi> [--no-content] [--keep]');
  for (const dir of ['src/data/strings', 'src/data/home']) {
    if (readdirSync(join(ROOT, dir)).includes(`${locale}.ts`)) throw new Error(`${dir}/${locale}.ts exists; the fixture is for a locale that is not on yet`);
  }

  const tmp = mkdtempSync(join(tmpdir(), `locale-fixture-${locale}-`));
  let failed = false;
  try {
    cpSync(ROOT, tmp, { recursive: true, filter: (src) => !SKIP.has(src.slice(ROOT.length + 1).split(/[\\/]/)[0] ?? '') });
    symlinkSync(join(ROOT, 'node_modules'), join(tmp, 'node_modules'), 'dir');

    const glossaryPath = join(tmp, 'docs/i18n/glossary.csv');
    const rows = fillGlossary(parseCsv(readFileSync(glossaryPath, 'utf8').replace(/^﻿/, '')), locale);
    writeFileSync(glossaryPath, toCsv(rows));
    const names = new Map(rows.map((r) => [r.id, r[locale]]));

    const { strings } = await import(pathToFileURL(join(ROOT, 'src/data/strings/zh-TW.ts')).href);
    const { home } = await import(pathToFileURL(join(ROOT, 'src/data/home/zh-TW.ts')).href);
    writeFileSync(join(tmp, `src/data/strings/${locale}.ts`), stringsSource(strings, names, locale));
    writeFileSync(join(tmp, `src/data/home/${locale}.ts`), homeSource(home, locale));
    const org = parseYaml(readFileSync(join(tmp, 'src/content/organization/zh-TW.yaml'), 'utf8'));
    writeFileSync(join(tmp, `src/content/organization/${locale}.yaml`), stringifyYaml(placeholderData(org, locale)));
    if (noContent) {
      for (const collection of readdirSync(join(tmp, 'src/content'), { withFileTypes: true }).filter((d) => d.isDirectory())) {
        rmSync(join(tmp, 'src/content', collection.name, locale), { recursive: true, force: true });
      }
    }

    console.log(`astro build in ${tmp}`);
    const build = run(tmp, join(tmp, 'node_modules/astro/bin/astro.mjs'), ['build']);
    if (!build.ok) {
      console.log(build.out.split('\n').slice(-30).join('\n'));
      throw new Error('astro build failed');
    }
    console.log(build.out.split('\n').filter((l) => /page\(s\) built/.test(l)).join('\n'));

    for (const script of ['scripts/i18n/routes.mjs', 'scripts/seo/meta.mjs']) {
      const r = run(tmp, join(tmp, script));
      console.log(`${script}: ${r.out.trim().split('\n').slice(-20).join('\n')}`);
      if (!r.ok) failed = true;
    }

    const dist = join(tmp, 'dist');
    const pages = new Map(
      readdirSync(dist, { recursive: true })
        .map(String)
        .filter((f) => f.endsWith('.html'))
        .map((f) => [urlPath(f), readFileSync(join(dist, f), 'utf8')]),
    );
    // The header's own labels (navigation.csv area header) in the locale: nav: rows, or the row of
    // the node whose title the label is
    const nodeTitles = parseCsv(readFileSync(join(tmp, 'docs/ia/nodes.csv'), 'utf8').replace(/^\uFEFF/, ''));
    const expected = parseCsv(readFileSync(join(tmp, 'docs/ia/navigation.csv'), 'utf8').replace(/^\uFEFF/, ''))
      .filter((r) => r.area === 'header' && r.label)
      .map((r) => names.get(`nav:${r.label}`) ?? names.get(`node:${nodeTitles.find((n) => n.title === r.label)?.id}`) ?? r.label);
    const problems = nameProblems(pages, locale, expected, { wholePage: noContent });
    for (const p of problems) console.log(p);
    const built = [...pages.keys()].filter((p) => p === `/${locale}` || p.startsWith(`/${locale}/`)).length;
    console.log(`${built} ${locale} pages checked for names, ${problems.length} problems`);
    if (problems.length) failed = true;
  } finally {
    if (keep) console.log(`kept ${tmp}`);
    else rmSync(tmp, { recursive: true, force: true });
  }
  if (failed) process.exitCode = 1;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) await main(process.argv.slice(2));
