#!/usr/bin/env node
// Spot check after a full migrate.mjs run (M5-05, #30): compares every converted entry with its
// current-site body (text length, image count), picks a fixed sample per type × locale for manual
// review, and lists internal links in zh-TW bodies that lead to no page in dist/.
// How to read it: docs/content/migration.md「抽查」.
// Usage: node scripts/content/migrate/spot-check.mjs --report <migrate report.csv> --out <spot-check.md>
//        [--screenshots <dir>]   (zh-TW sample pages at 375 and 1280 px; needs `npm run build` first)
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import { readCsv } from '../../inventory/csv.mjs';
import { parse } from 'node-html-parser';
import { squash } from '../../lib/page-text.mjs';
import { cachedFetcher } from './cache.mjs';
import { blogBody, newsBody, newsItems } from './sources.mjs';

const SAMPLE_SIZE = 5;
const SEED = 'm5-05';
// Converted text shorter than this share of the source is flagged; captions and embeds removed on
// purpose stay well above it
const MIN_TEXT_RATIO = 0.9;
const DIST = resolve('dist');

/** Plain text of a Markdown body: no image, link target, emphasis, heading, table or HTML markup. */
export function markdownText(markdown) {
  return markdown
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    // Only real tags: body text can hold a bare < (Levi's Water<Less®)
    .replace(/<\/?[a-z][a-z0-9-]*(?:\s[^>]*)?\/?>/gi, ' ')
    .replace(/^#{1,6}\s/gm, '')
    .replace(/\\([\\`*_{}[\]()#+\-.!|<>~])/g, '$1')
    .replace(/^\s*\|?[-:| ]+\|[-:| ]*$/gm, '')
    .replace(/[*_|~`]/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');
}

/**
 * Source body text with entities decoded (Vietnamese news writes &aacute; and the like). Embeds do not
 * survive conversion, so they are left out of this side of the comparison too.
 */
function sourceText(html) {
  const root = parse(html);
  for (const el of root.querySelectorAll('script, style, iframe, video, audio, object, embed')) el.remove();
  return root.text.replace(/[*_|~`]/g, '');
}

/** <img> count without WordPress emoji, which conversion turns into text (html-to-markdown.mjs). */
export const sourceImageCount = (html) => parse(html).querySelectorAll('img').filter((img) => !/\/\/s\.w\.org\/images\/core\/emoji\//.test(img.getAttribute('src') ?? '')).length;

/** Converted text length over source text length, whitespace ignored. */
export const textRatio = (markdown, html) => squash(markdownText(markdown)).length / Math.max(1, squash(sourceText(html)).length);

/** The same SAMPLE_SIZE entries every run: lowest sha256(seed + id) per type × locale. */
export function sample(entries, size = SAMPLE_SIZE) {
  const hash = (e) => createHash('sha256').update(`${SEED}:${e.type}/${e.id}`).digest('hex');
  const groups = new Map();
  for (const e of entries) groups.set(`${e.type} ${e.locale}`, [...(groups.get(`${e.type} ${e.locale}`) ?? []), e]);
  return [...groups.values()].flatMap((g) => g.sort((a, b) => hash(a).localeCompare(hash(b))).slice(0, size));
}

/** Site path of an entry (docs/ia/nodes.csv blog-post and news-article). */
export const pagePath = (type, id) => {
  const [locale, slug] = id.split('/');
  return `${locale === 'zh-TW' ? '' : `/${locale}`}${type === 'blog' ? '/blog' : '/media-center'}/${slug}`;
};

/**
 * Site-internal links in converted bodies (Markdown links and the href of tables kept as HTML) that
 * resolve to no file, as { page, href }. Header and footer links are not content, so they are not read.
 */
export function brokenLinks(bodies, exists) {
  const broken = [];
  for (const [page, body] of bodies) {
    for (const [, md, html] of body.matchAll(/\]\((\/[^)\s]*)\)|href="(\/[^"]*)"/g)) {
      const raw = md ?? html;
      if (raw.startsWith('//')) continue;
      const path = decodeURIComponent(raw.split(/[?#]/)[0]).replace(/\/$/, '') || '/';
      if (!exists(path)) broken.push({ page, href: raw });
    }
  }
  return broken;
}

const distHas = (path) => path === '/' || [`${path}.html`, `${path}/index.html`, path].some((f) => existsSync(join(DIST, f)));

async function screenshots(dir, entries) {
  const { default: puppeteer } = await import('puppeteer-core');
  const { serve } = await import('../../lib/static-server.mjs');
  await mkdir(dir, { recursive: true });
  const server = await serve(DIST);
  const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH, headless: true, args: ['--no-sandbox'] });
  try {
    for (const e of entries) {
      for (const width of [375, 1280]) {
        const page = await browser.newPage();
        await page.setViewport({ width, height: 900 });
        await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
        await page.goto(`http://127.0.0.1:${server.address().port}${pagePath(e.type, e.id)}`, { waitUntil: 'networkidle0' });
        // Lazy images below the fold would be blank in a full-page capture
        await page.evaluate(async () => {
          for (const img of document.images) img.loading = 'eager';
          await Promise.all([...document.images].map((img) => img.decode().catch(() => null)));
        });
        await page.screenshot({ path: join(dir, `${e.type}-${e.id.replace('/', '-')}-${width}.png`), fullPage: true });
        await page.close();
      }
    }
  } finally {
    await browser.close();
    server.close();
  }
}

async function main() {
  const { values: args } = parseArgs({ options: { report: { type: 'string' }, out: { type: 'string' }, screenshots: { type: 'string' } } });
  if (!args.report || !args.out) throw new Error('usage: spot-check.mjs --report <migrate report.csv> --out <spot-check.md> [--screenshots <dir>]');
  // Imported here: http.mjs re-executes the process with proxy support on import
  const { request } = await import('../../inventory/http.mjs');
  const get = cachedFetcher(request);
  const report = await readCsv(args.report);
  const entries = report.filter((r) => r.status === 'written' || r.status === 'unchanged');
  const news = new Map();

  const rows = [];
  const bodies = new Map();
  for (const r of entries) {
    const url = r.source_url.split(' ')[0];
    let html;
    if (r.type === 'blog') html = await blogBody(get, url);
    else {
      if (!news.has(r.locale)) news.set(r.locale, await newsItems(get, r.locale));
      html = await newsBody(get, news.get(r.locale).get(url).htmlpath);
    }
    const markdown = (await readFile(`src/content/${r.type}/${r.id}.md`, 'utf8')).replace(/^---\n[\s\S]*?\n---\n/, '');
    // Only zh-TW has pages until en and vi get interface copy (src/data/strings)
    if (r.locale === 'zh-TW') bodies.set(pagePath(r.type, r.id), markdown);
    const notes = r.notes.split(' ; ');
    const removed = notes.filter((n) => n.startsWith('image dropped')).length + Number(notes.find((n) => n.startsWith('tracking pixels removed'))?.split(': ')[1] ?? 0);
    const sourceImages = sourceImageCount(html);
    const images = (markdown.match(/!\[[^\]]*\]\(/g) ?? []).length;
    rows.push({ ...r, ratio: textRatio(markdown, html), sourceImages, images, removed });
  }

  const flagged = rows.filter((r) => r.ratio < MIN_TEXT_RATIO || r.images !== r.sourceImages - r.removed);
  const picked = sample(rows);
  const broken = existsSync(DIST) ? brokenLinks(bodies, distHas) : null;
  const pct = (x) => `${Math.round(x * 100)}%`;
  const out = [
    '# 抽查報告',
    '',
    `- 比對 ${rows.length} 篇（migrate 報告的 written、unchanged）`,
    `- 文字比例低於 ${pct(MIN_TEXT_RATIO)} 或圖片數對不上：${flagged.length} 篇`,
    `- 抽樣：每個 type × locale ${SAMPLE_SIZE} 篇，共 ${picked.length} 篇（seed \`${SEED}\`）`,
    broken ? `- zh-TW 內文連到 dist/ 沒有的站內頁面：${broken.length} 個` : '- dist/ 不存在，沒有檢查站內連結',
    '',
    '## 需要看的文章',
    '',
    '| entry | 文字比例 | 圖片（現站／移除／產出） |',
    '|---|---|---|',
    ...flagged.map((r) => `| ${r.type}/${r.id} | ${pct(r.ratio)} | ${r.sourceImages}／${r.removed}／${r.images} |`),
    '',
    '## 抽樣',
    '',
    '| entry | 現站 | 新站路徑 | 文字比例 | 圖片（現站／移除／產出） |',
    '|---|---|---|---|---|',
    ...picked.map((r) => `| ${r.type}/${r.id} | ${r.source_url.split(' ')[0]} | ${pagePath(r.type, r.id)} | ${pct(r.ratio)} | ${r.sourceImages}／${r.removed}／${r.images} |`),
    '',
    ...(broken?.length ? ['## 內文連不到的站內頁面', '', '| 頁面 | href |', '|---|---|', ...broken.map((b) => `| ${b.page} | ${b.href} |`), ''] : []),
  ];
  await writeFile(args.out, out.join('\n'));
  console.log(out.slice(2, 7).join('\n'));
  if (args.screenshots) await screenshots(args.screenshots, picked.filter((r) => r.locale === 'zh-TW'));
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) await main();
