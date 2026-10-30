// Tests for scripts/content/migrate/migrate.mjs. Run: npm run test:scripts

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Day } from './frontmatter.mjs';
import { blogSource, entryRows, entryText, latinPunctuation, parseOverrides } from './migrate.mjs';

test('entryText keeps migratedAt when nothing else changed, and updates it when something did', () => {
  const data = { title: 'A', publishedAt: new Day('2026-09-11'), migratedAt: undefined };
  const first = entryText(data, 'body', null, '2026-10-20');
  assert.match(first, /^migratedAt: 2026-10-20$/m);
  assert.equal(entryText(data, 'body', first, '2026-11-03'), first);
  assert.match(entryText(data, 'new body', first, '2026-11-03'), /^migratedAt: 2026-11-03$/m);
  assert.match(entryText({ ...data, migratedAt: new Day('2026-10-01') }, 'body', null, '2026-11-03'), /^migratedAt: 2026-10-01$/m);
});

test('an empty body writes frontmatter only', () => {
  assert.equal(entryText({ title: 'A' }, '', null, '2026-10-20'), '---\ntitle: A\nmigratedAt: 2026-10-20\n---\n');
});

test('parseOverrides checks entry ids and keys', () => {
  assert.deepEqual(parseOverrides(''), {});
  assert.deepEqual(parseOverrides('news/zh-TW/585:\n  alt:\n    cover.jpg: 七款專用機\n'), { 'news/zh-TW/585': { alt: { 'cover.jpg': '七款專用機' } } });
  assert.throws(() => parseOverrides('zh-TW/585:\n  alt: {}\n'), /is not <blog\|news>/);
  assert.throws(() => parseOverrides('news/zh-TW/585:\n  title: x\n'), /unknown keys title/);
  assert.deepEqual(parseOverrides('blog/zh-TW/zta:\n  dropImagesFrom: [blog.tpisoftware.com]\n'), { 'blog/zh-TW/zta': { dropImagesFrom: ['blog.tpisoftware.com'] } });
  assert.throws(() => parseOverrides('blog/zh-TW/zta:\n  dropImagesFrom: blog.tpisoftware.com\n'), /must be a list of hosts or image URLs/);
});

test('entryRows groups merge rows under their keep row, keep first', () => {
  const row = (url, disposition, slug) => ({ url, locale: 'en', node: 'blog-post', disposition, blog_slug: slug });
  const pageMap = [
    row('https://www.tpisoftware.com/en/blog/smartmgmt/financial-examination', 'merge', 'financial-examination-en'),
    row('https://www.tpisoftware.com/en/blog/smartmgmt/financial-examination-en', 'keep', 'financial-examination-en'),
    row('https://www.tpisoftware.com/en/blog/x/old', 'drop', 'old'),
    { url: 'https://www.tpisoftware.com/en/media-center/586', locale: 'en', node: 'news-article', disposition: 'keep', blog_slug: '' },
  ];
  assert.deepEqual(
    entryRows(pageMap, 'blog', 'en').map((g) => [g.slug, g.rows.map((r) => r.disposition)]),
    [['financial-examination-en', ['keep', 'merge']]],
  );
  assert.deepEqual(entryRows(pageMap, 'news', 'en').map((g) => g.slug), ['586']);
});

test('convert: overrides, a second run is unchanged, a failed download writes nothing', async (t) => {
  const { mkdtemp, readFile, readdir } = await import('node:fs/promises');
  const { existsSync } = await import('node:fs');
  const { tmpdir } = await import('node:os');
  const { join } = await import('node:path');
  const { convert } = await import('./migrate.mjs');
  const { newsFrontmatter } = await import('./frontmatter.mjs');
  const cwd = process.cwd();
  process.chdir(await mkdtemp(join(tmpdir(), 'migrate-')));
  t.after(() => process.chdir(cwd));

  const { default: sharp } = await import('sharp');
  // A real image: images are decoded to be downscaled and stored as WebP
  const png = await sharp({ create: { width: 2, height: 2, channels: 3, background: '#336699' } }).png().toBuffer();
  const ok = async () => ({ ok: true, status: 200, contentType: 'application/octet-stream', body: png });
  const failing = async (url) => (url.endsWith('photo.png') ? { ok: false, status: 404, contentType: '', body: Buffer.alloc(0) } : ok());
  const item = { id: '585', title: '標題', summary: '摘要', newsTypeId: '1', showDate: '2026-10-15', langTW: '585' };
  const args = (get, override) => ({
    get,
    type: 'news',
    id: 'zh-TW/585',
    slug: '585',
    coverUrl: 'https://www.tpisoftware.com/file/images/news/585/c.jpg',
    html: '<p>內文<a href="https://www.tpisoftware.com/nope">連結</a></p><p><img src="/file/upload/photo.png"></p>',
    base: 'https://www.tpisoftware.com/media-center/585',
    frontmatter: newsFrontmatter({ item, sourceUrl: 'https://www.tpisoftware.com/media-center/585', sourceUpdatedAt: '' }).data,
    override,
    resolveLink: (href) => ({ href, note: `unmapped ${href}` }),
    date: '2026-10-20',
  });

  await assert.rejects(convert(args(failing)), /photo\.png: HTTP 404/);
  assert.equal(existsSync('src/content/news/zh-TW/585.md'), false);
  assert.equal(existsSync('src/assets/news/zh-TW/585'), false);

  const override = { frontmatter: { description: '改寫後' }, alt: { 'photo.webp': '產品照' } };
  const first = await convert(args(ok, override));
  assert.equal(first.status, 'written');
  assert.deepEqual(first.notes, ['unmapped https://www.tpisoftware.com/nope']);
  const text = await readFile('src/content/news/zh-TW/585.md', 'utf8');
  assert.match(text, /^description: 改寫後$/m);
  assert.match(text, /^coverImage: \.\.\/\.\.\/\.\.\/assets\/news\/zh-TW\/585\/cover\.webp$/m);
  assert.match(text, /!\[產品照\]\(\.\.\/\.\.\/\.\.\/assets\/news\/zh-TW\/585\/photo\.webp\)/);
  assert.deepEqual((await readdir('src/assets/news/zh-TW/585')).sort(), ['cover.webp', 'photo.webp']);

  assert.equal((await convert({ ...args(ok, override), date: '2026-11-03' })).status, 'unchanged');
  await assert.rejects(convert(args(ok, { alt: { 'missing.png': 'x' } })), /alt for images the entry does not have: missing\.png/);

  // dropImagesFrom: the image is never fetched, so a host that fails is no longer a failure
  const dropped = await convert(args(failing, { dropImagesFrom: ['www.tpisoftware.com'] }));
  assert.equal(dropped.status, 'written');
  assert.ok(dropped.notes.includes('image dropped (dropImagesFrom): https://www.tpisoftware.com/file/upload/photo.png'));
  assert.doesNotMatch(await readFile('src/content/news/zh-TW/585.md', 'utf8'), /photo\.png/);
  assert.deepEqual(await readdir('src/assets/news/zh-TW/585'), ['cover.webp']);
  await assert.rejects(convert(args(ok, { dropImagesFrom: ['blog.tpisoftware.com'] })), /dropImagesFrom entries the entry has no images from: blog\.tpisoftware\.com/);
});

test('convert refuses empty required values unless overrides fill them', async (t) => {
  const { mkdtemp } = await import('node:fs/promises');
  const { tmpdir } = await import('node:os');
  const { join } = await import('node:path');
  const { convert } = await import('./migrate.mjs');
  const cwd = process.cwd();
  process.chdir(await mkdtemp(join(tmpdir(), 'migrate-')));
  t.after(() => process.chdir(cwd));
  const { default: sharp } = await import('sharp');
  // A real image: images are decoded to be downscaled and stored as WebP
  const png = await sharp({ create: { width: 2, height: 2, channels: 3, background: '#336699' } }).png().toBuffer();
  const args = (override) => ({
    get: async () => ({ ok: true, status: 200, contentType: '', body: png }),
    type: 'blog',
    id: 'vi/bright-data',
    slug: 'bright-data',
    coverUrl: 'https://tpi.dev/a.png',
    html: '<p>x</p>',
    base: 'https://www.tpisoftware.vn/blog/digital-transformation/bright-data',
    frontmatter: { title: 'T', description: 'D', author: '', authorType: 'Person', coverImage: null },
    override,
    resolveLink: (href) => ({ href }),
    date: '2026-10-20',
  });
  await assert.rejects(convert(args()), /empty on the current site: author/);
  assert.equal((await convert(args({ frontmatter: { author: 'TPIsoftware', authorType: 'Organization' } }))).status, 'written');
});

test('latinPunctuation turns full-width punctuation into ASCII, with the space a colon needs', () => {
  assert.equal(latinPunctuation('1. Assessment：Map the APIs'), '1. Assessment: Map the APIs');
  assert.equal(latinPunctuation('Pharmacy ＆ Science（Tainan）'), 'Pharmacy & Science(Tainan)');
  assert.equal(latinPunctuation('Ends：'), 'Ends:');
  const day = new Day('2026-10-20');
  assert.deepEqual(latinPunctuation({ list: ['a：b'], migratedAt: day }), { list: ['a: b'], migratedAt: day });
  assert.match(entryText({ title: 'A：B' }, 'x＆y', null, '2026-10-20', 'en'), /title: "A: B"[\s\S]*x&y/);
  assert.match(entryText({ title: 'A：B' }, '', null, '2026-10-20'), /title: A：B/);
});

// A post page's payload as the current site writes it: values are IIFE arguments (#137)
const postPage = (atcDate) => `<html><body><script>window.__NUXT__=(function(a,b,c,d){return {layout:"default",data:[{articleData:{},article:{atcNo:"1f14",authorName:"Fran Chen",atcDate:d,title:b,description:"摘要",coverImage:"https:\\u002F\\u002Ftpi.dev\\u002Fcover.jpg",coverAlt:b,content:"\\u003Cp\\u003E內文\\u003C\\u002Fp\\u003E",articleCustUrl:"what-is-ai-agent-management-platform",multiCate:[{mainCate:"020",secCate:c,mainCateName:"AI 人工智慧",secCateName:"AI 應用"}]}}],state:{categories:[{categoryNo:"01",custUrl:"\\u002Fblog",subcategories:[{categoryNo:"020",custUrl:"\\u002Fblog\\u002Fai",subcategories:[{categoryNo:c,custUrl:"\\u002Fblog\\u002Fai\\u002FAIapplication"}]}]}]}}}(null,"AI Agent 管理平台是什麼？","020031","${atcDate}"));</script></body></html>`;
const pageGet = (html) => async () => ({ ok: true, status: 200, contentType: 'text/html', body: Buffer.from(html) });
const POST = 'https://www.tpisoftware.com/blog/ai/what-is-ai-agent-management-platform';

test('blogSource uses the blog API article when the API lists the post', async () => {
  const article = { title: 'API' };
  const cats = { main_category: '/blog/ai', sub_category: '/blog/ai/rpa' };
  const get = async () => assert.fail('the page is not read for a listed post');
  const out = await blogSource({ get, source: new Map([[POST, article]]), categories: new Map([[POST, cats]]), urls: [POST, POST] });
  assert.deepEqual(out, { item: article, categories: cats, notes: [] });
});

test('blogSource reads a post the blog API does not list from its page payload', async () => {
  const { blogFrontmatter } = await import('./frontmatter.mjs');
  const out = await blogSource({ get: pageGet(postPage('2026/05/13 00:00:00')), source: new Map(), categories: new Map(), urls: [POST, POST] });
  assert.deepEqual(out.notes, ['not in the blog API: fields from the article page']);
  assert.deepEqual(out.categories, { main_category: '/blog/ai', sub_category: '/blog/ai/AIapplication' });
  assert.equal(out.item.coverImage, 'https://tpi.dev/cover.jpg');
  const { data } = blogFrontmatter({
    locale: 'zh-TW',
    slug: 'what-is-ai-agent-management-platform',
    category: 'blog-ai',
    article: out.item,
    categories: out.categories,
    tagOf: (locale, path) => (path === '/blog/ai/AIapplication' ? 'ai-application' : undefined),
    sourceUrl: POST,
    sourceUpdatedAt: '',
  });
  assert.equal(data.title, 'AI Agent 管理平台是什麼？');
  assert.equal(data.publishedAt.value, '2026-05-13');
  assert.equal(data.author, 'Fran Chen');
  assert.deepEqual(data.tags, ['ai-application']);
});

test('blogSource notes an unlisted post older than the retention cutoff, and fails without an article', async () => {
  const old = await blogSource({ get: pageGet(postPage('2025/02/13 15:39:54')), source: new Map(), categories: new Map(), urls: [POST, POST] });
  assert.ok(old.notes.includes('publishedAt 2025-02-13 is before 2026-01-01'));
  await assert.rejects(blogSource({ get: pageGet('<html><body>Blog by Thinker</body></html>'), source: new Map(), categories: new Map(), urls: [POST, POST] }), /not in the blog API, and the page payload has no article/);
});

test('a page payload runs without objects from this realm, and a payload that fails says why', async () => {
  const { payloadArticle } = await import('../../lib/nuxt-payload.mjs');
  // Through a host object's constructor a payload could reach process; window is the context's own object
  const escape = '<script>window.__NUXT__={data:[{article:{title:window.constructor.constructor("return typeof process")()}}]};</script>';
  assert.equal(payloadArticle(escape).article.title, 'undefined');
  // A replaced built-in never gets a function from this realm to call
  const replaced = '<script>window.__NUXT__={data:[]};Array.prototype.find=function(f){return {article:{title:f.constructor("return typeof process")()}}};</script>';
  assert.equal(payloadArticle(replaced), null);
  assert.throws(() => payloadArticle('<script>window.__NUXT__=(function(){ throw new Error("boom") }())</script>'), /page payload does not run: boom/);
});
