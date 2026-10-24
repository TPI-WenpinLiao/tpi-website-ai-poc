// Tests for scripts/content/migrate/frontmatter.mjs. Run: npm run test:scripts

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { applyOverrides, blogFrontmatter, Commented, Day, frontmatterNotes, newsFrontmatter, serializeFrontmatter, tagLookup } from './frontmatter.mjs';

const tagOf = tagLookup([
  { id: 'ai-application', paths: { 'zh-TW': '/blog/ai/AIapplication', en: '/blog/artifintell/aiapplication' } },
  { id: 'neo4j', paths: { 'zh-TW': '/blog/Featured/Neo4j' } },
]);

// Blog API article (POST /cms/api/v1/f/article/home, X-Lang: ZH-TW), trimmed
const article = {
  authorName: 'TPIsoftware',
  atcDate: '2026/09/11 00:00:00',
  title: '降低客訴 AI 工具選型指南：為什麼傳統質檢防不住客訴？ ',
  description: '降低客訴 AI 工具怎麼選？',
  coverImage: 'https://tpi.dev/tpi-dev/private/article/IMG/1f1aaad1.png',
};

test('tagLookup ignores the /en prefix of blog-categories.csv paths', () => {
  assert.equal(tagOf('en', '/en/blog/artifintell/aiapplication'), 'ai-application');
  assert.equal(tagOf('zh-TW', '/blog/smartm/esg'), undefined);
});

test('blog frontmatter follows the content-model field table', () => {
  const { data, notes } = blogFrontmatter({
    locale: 'zh-TW',
    slug: 'customer-complaint-ai-tool-selection-guide',
    category: 'blog-ai',
    article,
    categories: { main_category: '/blog/ai', sub_category: '/blog/ai/AIapplication' },
    tagOf,
    sourceUrl: 'https://www.tpisoftware.com/blog/ai/customer-complaint-ai-tool-selection-guide',
    sourceUpdatedAt: '2026-09-11',
  });
  assert.deepEqual(notes, []);
  assert.equal(data.title, '降低客訴 AI 工具選型指南：為什麼傳統質檢防不住客訴？');
  assert.equal(data.category, 'ai');
  assert.deepEqual(data.tags, ['ai-application']);
  assert.equal(data.featured, undefined);
  assert.deepEqual(data.publishedAt, new Day('2026-09-11'));
  assert.equal(data.authorType, 'Organization');
});

test('the Featured category sets featured and a person author is Person', () => {
  const { data } = blogFrontmatter({
    locale: 'zh-TW',
    slug: 'fraud-detection-neo4j-1',
    category: 'blog-use-cases',
    article: { ...article, authorName: '王小明' },
    categories: { main_category: '/blog/Featured', sub_category: '/blog/Featured/Neo4j' },
    tagOf,
    sourceUrl: 'https://www.tpisoftware.com/blog/Featured/fraud-detection-neo4j-1',
    sourceUpdatedAt: '',
  });
  assert.equal(data.featured, true);
  assert.deepEqual(data.tags, ['neo4j']);
  assert.equal(data.authorType, 'Person');
  assert.equal(data.sourceUpdatedAt, undefined);
});

// News API item (/tpi/api/News?languages=tw, id 585), trimmed
const item = { id: '585', title: '昕力資訊 AI 專用機七箭齊發', summary: '昕力資訊（7781）發表七款 AI 專用機', newsTypeId: '1', showDate: '2026-10-15', langTW: '585' };

test('news frontmatter maps newsTypeId and uses the zh-TW id as translationKey', () => {
  const { data, notes } = newsFrontmatter({ item: { ...item, id: '586', langTW: '585' }, sourceUrl: 'https://www.tpisoftware.com/en/media-center/586', sourceUpdatedAt: '2026-10-16' });
  assert.equal(data.newsType, 'press');
  assert.equal(data.translationKey, '585');
  assert.deepEqual(notes, []);
});

test('news without a zh-TW version keeps its own id; old news and unknown types are flagged', () => {
  const { data, notes } = newsFrontmatter({ item: { ...item, id: '455', langTW: '', showDate: '2023-05-02' }, sourceUrl: 'x', sourceUpdatedAt: '' });
  assert.equal(data.translationKey, '455');
  assert.deepEqual(notes, ['publishedAt 2023-05-02 is before 2026-01-01']);
  assert.throws(() => newsFrontmatter({ item: { ...item, newsTypeId: 2 }, sourceUrl: 'x', sourceUpdatedAt: '' }), /newsTypeId 2/);
});

test('frontmatterNotes flags long descriptions per locale', () => {
  assert.deepEqual(frontmatterNotes('zh-TW', { description: '字'.repeat(81), authorType: 'Organization' }), ['description is 81 characters (max 80)']);
  assert.deepEqual(frontmatterNotes('en', { description: 'a'.repeat(160) }), []);
});

test('overrides replace values, null removes them', () => {
  assert.deepEqual(applyOverrides({ a: 1, b: 2 }, { b: null, c: 3 }), { a: 1, b: undefined, c: 3 });
});

test('serializeFrontmatter writes the same shape as the hand-written samples', () => {
  const text = serializeFrontmatter({
    title: '昕力資訊 AI 專用機七箭齊發 搶攻企業與校園應用市場',
    translationKey: '585',
    tags: ['ai-application'],
    featured: undefined,
    publishedAt: new Day('2026-10-15'),
    coverImage: new Commented('../../../assets/news/585/cover.jpg', 'https://www.tpisoftware.com/file/images/news/585/a.jpg'),
    sourceUrl: ['https://www.tpisoftware.com/en/blog/a-en', 'https://www.tpisoftware.com/en/blog/a'],
    migratedAt: new Date('2026-10-20'),
  });
  assert.equal(
    text,
    [
      '---',
      'title: 昕力資訊 AI 專用機七箭齊發 搶攻企業與校園應用市場',
      'translationKey: "585"',
      'tags: [ai-application]',
      'publishedAt: 2026-10-15',
      '# https://www.tpisoftware.com/file/images/news/585/a.jpg',
      'coverImage: ../../../assets/news/585/cover.jpg',
      'sourceUrl:',
      '  - https://www.tpisoftware.com/en/blog/a-en',
      '  - https://www.tpisoftware.com/en/blog/a',
      'migratedAt: 2026-10-20',
      '---',
      '',
    ].join('\n'),
  );
});

test('values YAML would misread are quoted', () => {
  assert.match(serializeFrontmatter({ title: 'AI: 下一步 #1' }), /^title: "AI: 下一步 #1"$/m);
  assert.match(serializeFrontmatter({ title: '2026-10-15' }), /^title: "2026-10-15"$/m);
});

test('serializeFrontmatter writes arrays of objects as block lists, leaving out undefined fields', async () => {
  const { parse } = await import('yaml');
  const { YAML_OPTIONS } = await import('../dates.mjs');
  const features = [{ title: '零停機服務', body: 'a: b' }, { title: 'x', body: 'y', industry: undefined }];
  const text = serializeFrontmatter({ features });
  assert.equal(text, ['---', 'features:', '  - title: 零停機服務', '    body: "a: b"', '  - title: x', '    body: y', '---', ''].join('\n'));
  assert.deepEqual(parse(text.replace(/^---\n|---\n$/g, ''), YAML_OPTIONS).features, [{ title: '零停機服務', body: 'a: b' }, { title: 'x', body: 'y' }]);
});

test('serializeFrontmatter writes string arrays as block lists when a flow list would not read back or is long', async () => {
  const { parse } = await import('yaml');
  const { YAML_OPTIONS } = await import('../dates.mjs');
  assert.equal(serializeFrontmatter({ tags: ['ai', 'esg'] }), '---\ntags: [ai, esg]\n---\n');
  const certifications = ['TUV-NORD, ISO27001:2013 Lead Auditor Training course', 'a: b'];
  const text = serializeFrontmatter({ certifications });
  assert.equal(text, ['---', 'certifications:', '  - TUV-NORD, ISO27001:2013 Lead Auditor Training course', '  - "a: b"', '---', ''].join('\n'));
  assert.deepEqual(parse(text.replace(/^---\n|---\n$/g, ''), YAML_OPTIONS).certifications, certifications);
  assert.match(serializeFrontmatter({ experience: ['x'.repeat(60), 'y'.repeat(60)] }), /^experience:\n {2}- x+\n {2}- y+$/m);
});

test('tricky strings read back unchanged with the options Astro parses frontmatter with', async () => {
  const { parse } = await import('yaml');
  const { YAML_OPTIONS } = await import('../dates.mjs');
  for (const title of ['yes', 'null', '0123', '- 清單', '"引號"', "it's", 'a # b', '100%: 達成', '[標籤]', '*星號', '2026-02-30']) {
    const text = serializeFrontmatter({ title }).replace(/^---\n|---\n$/g, '');
    assert.equal(parse(text, YAML_OPTIONS).title, title);
  }
});

test('line breaks in API titles and descriptions become spaces; multi-line values are refused', () => {
  const { data } = newsFrontmatter({ item: { ...item, summary: 'TPIsoftware was honored. \r\n\r\nOrganized by the Ministry' }, sourceUrl: 'x', sourceUpdatedAt: '' });
  assert.equal(data.description, 'TPIsoftware was honored. Organized by the Ministry');
  assert.throws(() => serializeFrontmatter({ description: 'a\nb' }), /spans lines/);
});

test('long <title> is flagged unless seoTitle is short enough, with the site-name suffix of the locale', () => {
  const long = 'a'.repeat(60);
  // " | TPIsoftware" is 14 characters, ｜TPIsoftware 昕力資訊 is 17
  assert.deepEqual(frontmatterNotes('en', { title: long }), ['<title> is 74 characters (max 70): set seoTitle']);
  assert.deepEqual(frontmatterNotes('zh-TW', { title: 'a'.repeat(54) }), ['<title> is 71 characters (max 70): set seoTitle']);
  assert.deepEqual(frontmatterNotes('en', { title: 'a'.repeat(56) }), []);
  assert.deepEqual(frontmatterNotes('en', { title: long, seoTitle: 'short' }), []);
  // Counted as the HTML writes it: each & becomes &amp; (56 + 4 + 14 = 74)
  assert.deepEqual(frontmatterNotes('en', { title: `${'a'.repeat(55)}&` }), ['<title> is 74 characters (max 70): set seoTitle']);
});
