// Tests for scripts/content/migrate/migrate.mjs. Run: npm run test:scripts

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Day } from './frontmatter.mjs';
import { entryRows, entryText, parseOverrides } from './migrate.mjs';

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

  const png = Buffer.from('89504e470d0a1a0a0000', 'hex');
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

  const override = { frontmatter: { description: '改寫後' }, alt: { 'photo.png': '產品照' } };
  const first = await convert(args(ok, override));
  assert.equal(first.status, 'written');
  assert.deepEqual(first.notes, ['unmapped https://www.tpisoftware.com/nope']);
  const text = await readFile('src/content/news/zh-TW/585.md', 'utf8');
  assert.match(text, /^description: 改寫後$/m);
  assert.match(text, /^coverImage: \.\.\/\.\.\/\.\.\/assets\/news\/zh-TW\/585\/cover\.png$/m);
  assert.match(text, /!\[產品照\]\(\.\.\/\.\.\/\.\.\/assets\/news\/zh-TW\/585\/photo\.png\)/);
  assert.deepEqual((await readdir('src/assets/news/zh-TW/585')).sort(), ['cover.png', 'photo.png']);

  assert.equal((await convert({ ...args(ok, override), date: '2026-11-03' })).status, 'unchanged');
  await assert.rejects(convert(args(ok, { alt: { 'missing.png': 'x' } })), /alt for images the entry does not have: missing\.png/);
});

test('convert refuses empty required values unless overrides fill them', async (t) => {
  const { mkdtemp } = await import('node:fs/promises');
  const { tmpdir } = await import('node:os');
  const { join } = await import('node:path');
  const { convert } = await import('./migrate.mjs');
  const cwd = process.cwd();
  process.chdir(await mkdtemp(join(tmpdir(), 'migrate-')));
  t.after(() => process.chdir(cwd));
  const png = Buffer.from('89504e470d0a1a0a0000', 'hex');
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
