// metaProblems in scripts/seo/meta.mjs and sitemapXml in src/lib/seo/sitemap.ts.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { OG_LOCALES } from '../../src/lib/i18n/locales.ts';
import { localeFromPath } from '../../src/lib/i18n/paths.ts';
import { sitemapXml } from '../../src/lib/seo/sitemap.ts';
import { metaProblems, readSitemap } from './meta.mjs';

const ORIGIN = 'https://example.com';
const url = (path) => `${ORIGIN}${path}`;

// A page head as Seo.astro writes it; `omit` drops tags, `extra` adds some
function page(path, { title = `T ${path}`, description = `D ${path}`, alternates = [], omit = [], extra = '' } = {}) {
  const tags = {
    title: `<title>${title}</title>`,
    description: `<meta name="description" content="${description}">`,
    canonical: `<link rel="canonical" href="${url(path)}">`,
    'og:url': `<meta property="og:url" content="${url(path)}">`,
    og: ['type', 'title', 'description', 'image', 'site_name'].map((p) => `<meta property="og:${p}" content="x">`).join(''),
    'og:locale': `<meta property="og:locale" content="${OG_LOCALES[localeFromPath(path)]}">`,
    twitter: ['card', 'title', 'description'].map((n) => `<meta name="twitter:${n}" content="x">`).join(''),
    hreflang: alternates.map(([lang, p]) => `<link rel="alternate" hreflang="${lang}" href="${url(p)}">`).join(''),
    jsonld: '<script type="application/ld+json">{"@context":"https://schema.org","@graph":[{"@type":"BreadcrumbList"}]}</script>',
  };
  const head = Object.entries(tags).filter(([k]) => !omit.includes(k)).map(([, v]) => v).join('');
  return `<!doctype html><html><head>${head}${extra}</head><body></body></html>`;
}

const self = (path, lang = 'zh-TW') => [[lang, path], ...(lang === 'zh-TW' ? [['x-default', path]] : [])];
const site = (paths) => sitemapXml(paths, new URL(ORIGIN));

test('pages written as Seo.astro writes them, with the sitemap built from them, pass', () => {
  const both = [['zh-TW', '/about'], ['en', '/en/about'], ['x-default', '/about']];
  const pages = new Map([
    ['/', page('/', { alternates: self('/') })],
    ['/about', page('/about', { alternates: both })],
    ['/en/about', page('/en/about', { alternates: both })],
    ['/design-system', page('/design-system', { alternates: self('/design-system') })],
  ]);
  assert.deepEqual(metaProblems(pages, site([...pages.keys()])), []);
});

test('the sitemap leaves out internal and flow pages, and carries each page\'s hreflang', () => {
  const entries = readSitemap(site(['/', '/about', '/en/about', '/design-system', '/templates/hub', '/en/design-system', '/404']));
  assert.deepEqual(entries.map((e) => e.loc), [url('/'), url('/about'), url('/en/about')]);
  assert.deepEqual(entries[1].alternates, [
    { hreflang: 'zh-TW', href: url('/about') },
    { hreflang: 'en', href: url('/en/about') },
    { hreflang: 'x-default', href: url('/about') },
  ]);
});

test('a missing canonical, title or OG tag is reported', () => {
  const problems = metaProblems(new Map([['/', page('/', { alternates: self('/'), omit: ['canonical', 'title', 'og'] })]]), site(['/']));
  assert.ok(problems.includes('/: expected 1 canonical, found 0'));
  assert.ok(problems.includes('/: expected 1 non-empty title, found 0'));
  assert.ok(problems.some((p) => p.includes('og:image')));
});

test('an og:locale that does not match the URL locale is reported', () => {
  const wrong = page('/en', { alternates: self('/en', 'en') }).replace('content="en_US"', 'content="en"');
  assert.deepEqual(metaProblems(new Map([['/en', wrong]]), site(['/en'])), ['/en: og:locale en, expected en_US']);
});

test('a canonical pointing elsewhere and duplicate titles are reported', () => {
  const wrong = page('/a', { title: 'same', alternates: self('/a') }).replace(`href="${url('/a')}"`, `href="${url('/a/')}"`);
  const pages = new Map([['/a', wrong], ['/b', page('/b', { title: 'same', alternates: self('/b') })]]);
  const problems = metaProblems(pages, site(['/a', '/b']));
  assert.ok(problems.some((p) => p.startsWith('/a: canonical')));
  assert.ok(problems.includes('/b: title "same" is also used by /a'));
});

test('versions of one page in other locales may share a title, other pages may not', () => {
  const versions = [['en', '/en/x'], ['vi', '/vi/x']];
  const pages = new Map([
    ['/en/x', page('/en/x', { title: 'Bo-Yuan Zhao', alternates: versions })],
    ['/vi/x', page('/vi/x', { title: 'Bo-Yuan Zhao', alternates: versions })],
    ['/vi/y', page('/vi/y', { title: 'Bo-Yuan Zhao', alternates: self('/vi/y', 'vi') })],
  ]);
  const titles = metaProblems(pages, site(['/en/x', '/vi/x', '/vi/y'])).filter((p) => p.includes('title "'));
  assert.deepEqual(titles, ['/vi/y: title "Bo-Yuan Zhao" is also used by /en/x']);
});

test('a noindex robots meta is reported', () => {
  const pages = new Map([['/', page('/', { alternates: self('/'), extra: '<meta name="robots" content="noindex, nofollow">' })]]);
  assert.ok(metaProblems(pages, site(['/']))[0].includes('robots meta'));
});

test('one-way hreflang, a target that was not built and a missing x-default are reported', () => {
  const pages = new Map([
    ['/about', page('/about', { alternates: [['zh-TW', '/about'], ['en', '/en/about'], ['vi', '/vi/about']] })],
    ['/en/about', page('/en/about', { alternates: [['en', '/en/about'], ['zh-TW', '/about'], ['x-default', '/about']] })],
  ]);
  const problems = metaProblems(pages, site([...pages.keys()]));
  assert.ok(problems.includes('/about: hreflang="vi" points at https://example.com/vi/about, which was not built'));
  assert.ok(problems.includes('/about: hreflang set differs from the one on /en/about'));
  assert.ok(problems.some((p) => p.startsWith('/about: x-default')));
});

test('a page without a zh-TW version must not have x-default', () => {
  const pages = new Map([['/vi/x', page('/vi/x', { alternates: [['vi', '/vi/x'], ['x-default', '/vi/x']] })]]);
  assert.ok(metaProblems(pages, site(['/vi/x'])).some((p) => p.startsWith('/vi/x: x-default')));
});

test('JSON-LD that does not parse is reported', () => {
  const pages = new Map([['/', page('/', { alternates: self('/'), omit: ['jsonld'], extra: '<script type="application/ld+json">{"@context":</script>' })]]);
  assert.ok(metaProblems(pages, site(['/']))[0].includes('JSON-LD block 1 does not parse'));
});

test('a missing sitemap, or one that lists an internal page, is reported', () => {
  const pages = new Map([['/', page('/', { alternates: self('/') })], ['/design-system', page('/design-system', { alternates: self('/design-system') })]]);
  assert.deepEqual(metaProblems(pages, null), ['sitemap.xml was not built']);
  const listed = site(['/']).replace('</urlset>', `<url><loc>${url('/design-system')}</loc></url></urlset>`);
  assert.ok(metaProblems(pages, listed).includes(`sitemap.xml: ${url('/design-system')} is not a built, listable page`));
});

test('a page without a BreadcrumbList is reported; home, 404 and internal pages need none', () => {
  const bare = (path) => page(path, { alternates: self(path), omit: ['jsonld'] });
  const pages = new Map([
    ['/', bare('/')],
    ['/404', bare('/404')],
    ['/design-system', bare('/design-system')],
    ['/about', bare('/about')],
  ]);
  assert.deepEqual(metaProblems(pages, site([...pages.keys()])), ['/about: no BreadcrumbList JSON-LD']);
});
