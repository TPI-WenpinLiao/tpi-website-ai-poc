// JSON-LD generators in src/lib/seo/jsonld/: the property mappings in docs/ia/content-model.md.
// Node strips the types; entries are plain objects shaped like the collection data.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { caseStudyJsonLd, blogPostingJsonLd, newsArticleJsonLd } from '../../src/lib/seo/jsonld/article.ts';
import { homeJsonLd } from '../../src/lib/seo/jsonld/home.ts';
import { hubJsonLd } from '../../src/lib/seo/jsonld/hub.ts';
import { offeringJsonLd } from '../../src/lib/seo/jsonld/offering.ts';
import { pageJsonLd } from '../../src/lib/seo/jsonld/page.ts';
import { personJsonLd } from '../../src/lib/seo/jsonld/person.ts';
import { serializeJsonLd } from '../../src/lib/seo/jsonld/shared.ts';
import { whitepaperJsonLd } from '../../src/lib/seo/jsonld/whitepaper.ts';

const site = new URL('https://example.com');
const org = {
  name: '昕力資訊',
  alternateName: ['TPIsoftware'],
  offices: [
    { id: 'taipei', name: '台北總部', address: '台北市', phone: '+886 2 0000 0000', country: 'TW', headquarters: true },
    { id: 'singapore', name: '新加坡', address: 'Singapore', country: 'SG' },
  ],
};
const node = (id, path) => ({ id, parent: '', title: id, template: '', kind: '', path, note: '' });
const ctx = (path) => ({ site, url: new URL(path, site).href, inLanguage: 'zh-TW', org, trail: [node('home', '/'), node('leaf', path)] });
const types = (doc) => doc['@graph'].map((n) => n['@type']);
const publisher = { '@type': 'Organization', '@id': 'https://example.com/#organization', name: '昕力資訊', url: 'https://example.com/' };

test('every non-home page ends with a BreadcrumbList of absolute URLs from home', () => {
  const doc = pageJsonLd({ ...ctx('/about'), page: { title: '關於', description: 'd', node: 'about' }, logoUrl: 'https://example.com/logo.png' });
  assert.deepEqual(doc['@graph'].at(-1), {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'home', item: 'https://example.com/' },
      { '@type': 'ListItem', position: 2, name: 'leaf', item: 'https://example.com/about' },
    ],
  });
});

test('home: Organization with headquarters address and office phones, WebSite pointing at it', () => {
  const doc = homeJsonLd({ org, site, logoUrl: 'https://example.com/logo.png', inLanguage: 'zh-TW' });
  const [organization, website] = doc['@graph'];
  assert.equal(organization['@id'], 'https://example.com/#organization');
  assert.deepEqual(organization.address, { '@type': 'PostalAddress', streetAddress: '台北市', addressCountry: 'TW' });
  assert.equal(organization.contactPoint.length, 1);
  assert.deepEqual(website.publisher, { '@id': 'https://example.com/#organization' });
});

test('offering: product → SoftwareApplication, service → Service, FAQPage only with questions', () => {
  const base = { title: 'X', description: 'd', faq: [{ question: 'q', answer: 'a' }] };
  const product = offeringJsonLd({ ...ctx('/products/x'), offering: { ...base, kind: 'product' }, imageUrl: 'i' });
  assert.deepEqual(types(product), ['SoftwareApplication', 'BreadcrumbList', 'FAQPage']);
  assert.deepEqual(product['@graph'][0].publisher, publisher);
  const service = offeringJsonLd({ ...ctx('/services/x'), offering: { ...base, kind: 'service', faq: undefined }, imageUrl: 'i' });
  assert.deepEqual(types(service), ['Service', 'BreadcrumbList']);
  assert.equal(service['@graph'][0].serviceType, 'X');
});

test('hub: CollectionPage lists the child pages', () => {
  const doc = hubJsonLd({ ...ctx('/industries/x'), hub: { title: '製造業', description: 'd' }, parts: [{ name: 'A', url: 'https://example.com/a' }] });
  assert.deepEqual(doc['@graph'][0].hasPart, [{ '@type': 'WebPage', name: 'A', url: 'https://example.com/a' }]);
});

test('case study: Article about its offerings, never naming the client', () => {
  const caseStudy = { title: 'T', description: 'd', publishedAt: new Date('2026-01-02'), client: { name: '機密客戶', disclosed: false } };
  const doc = caseStudyJsonLd({ ...ctx('/case-studies/x'), caseStudy, offerings: [{ kind: 'product', name: 'digiRunner', url: 'https://example.com/products/digirunner' }] });
  const [article] = doc['@graph'];
  assert.equal(article['@type'], 'Article');
  assert.equal(article.datePublished, '2026-01-02');
  assert.equal(article.image, undefined);
  assert.deepEqual(article.about, [
    { '@type': 'SoftwareApplication', '@id': 'https://example.com/products/digirunner#offering', name: 'digiRunner', url: 'https://example.com/products/digirunner' },
  ]);
  assert.ok(!JSON.stringify(doc).includes('機密客戶'));
});

test('blog: author from authorType, dateModified falls back to publishedAt, keywords only with tags', () => {
  const post = { title: 'T', description: 'd', publishedAt: new Date('2026-03-04'), author: '王小明', authorType: 'Person' };
  const plain = blogPostingJsonLd({ ...ctx('/blog/x'), post, imageUrl: 'i', section: 'AI' })['@graph'][0];
  assert.equal(plain['@type'], 'BlogPosting');
  assert.deepEqual(plain.author, { '@type': 'Person', name: '王小明' });
  assert.equal(plain.dateModified, '2026-03-04');
  assert.equal(plain.articleSection, 'AI');
  assert.equal('keywords' in plain, false);
  const tagged = blogPostingJsonLd({ ...ctx('/blog/x'), post: { ...post, updatedAt: new Date('2026-05-06') }, imageUrl: 'i', section: 'AI', tagNames: ['RAG'] })['@graph'][0];
  assert.equal(tagged.dateModified, '2026-05-06');
  assert.deepEqual(tagged.keywords, ['RAG']);
});

test('news: NewsArticle written by the organization', () => {
  const post = { title: 'T', description: 'd', publishedAt: new Date('2026-03-04') };
  const article = newsArticleJsonLd({ ...ctx('/media-center/x'), post, imageUrl: 'i', section: '新聞稿' })['@graph'][0];
  assert.equal(article['@type'], 'NewsArticle');
  assert.deepEqual(article.author, publisher);
});

test('page: about and contact carry the Organization; legal pages are dated WebPages', () => {
  const page = (node, extra = {}) =>
    pageJsonLd({ ...ctx(`/${node}`), page: { title: 'T', description: 'd', node, ...extra }, logoUrl: 'https://example.com/logo.png' })['@graph'][0];
  assert.equal(page('about')['@type'], 'AboutPage');
  assert.equal(page('contact').mainEntity['@id'], 'https://example.com/#organization');
  const legal = page('privacy', { effectiveDate: new Date('2025-07-01') });
  assert.equal(legal['@type'], 'WebPage');
  assert.equal(legal.datePublished, '2025-07-01');
  assert.equal('mainEntity' in legal, false);
});

test('person: ProfilePage with Person, credentials as EducationalOccupationalCredential', () => {
  const person = { title: '陳先生', description: 'd', jobTitle: '顧問', expertise: ['ESG'], certifications: ['ISO 14064'] };
  const { mainEntity } = personJsonLd({ ...ctx('/esg-advisors/x'), person })['@graph'][0];
  assert.equal(mainEntity['@type'], 'Person');
  assert.deepEqual(mainEntity.knowsAbout, ['ESG']);
  assert.deepEqual(mainEntity.hasCredential, [{ '@type': 'EducationalOccupationalCredential', name: 'ISO 14064' }]);
  assert.deepEqual(mainEntity.worksFor, publisher);
});

test('whitepaper: DigitalDocument about its offering page, without a file url', () => {
  const doc = whitepaperJsonLd({
    ...ctx('/whitepaper/x'),
    whitepaper: { title: 'T', description: 'd', file: '/files/x.pdf' },
    imageUrl: 'i',
    about: { name: 'digiRunner', url: 'https://example.com/products/digirunner' },
  });
  const { mainEntity } = doc['@graph'][0];
  assert.equal(mainEntity['@type'], 'DigitalDocument');
  assert.equal('url' in mainEntity, false);
  assert.ok(!JSON.stringify(doc).includes('/files/x.pdf'));
});

test('serializeJsonLd escapes < so the data cannot close the script element', () => {
  const out = serializeJsonLd({ '@context': 'https://schema.org', '@graph': [{ name: '</script><b>' }] });
  assert.ok(!out.includes('<'));
  assert.deepEqual(JSON.parse(out)['@graph'][0], { name: '</script><b>' });
});
