// Lighthouse CI config. `npm run lighthouse` (part of `npm run check`) audits the pages listed in
// PAGES; `npm run lighthouse:all` (LHCI_ALL=1) audits every HTML file in dist/ once. Why only these
// pages: docs/decisions/0004-lighthouse-scope.md
const ALL = process.env.LHCI_ALL === '1';

// One page per src/layouts/templates/ file: the lowest performance score of that template in the
// full-site run of 2026-10-25 (ADR 0004), plus every home page and 404. `scene` marks the pages
// that load the 3D scene, whose performance only warns until #127 brings their TBT down.
// Paths end in .html: LHCI's static server does not add the extension.
const PAGES = [
  { template: 'home', path: '/index.html', scene: true },
  { template: 'home', path: '/en.html', scene: true },
  { template: 'home', path: '/vi.html', scene: true },
  { template: 'offering', path: '/products/systalk-chat.html', scene: true },
  // Service pages use the offering template without the scene
  { template: 'offering', path: '/vi/aiso.html' },
  { template: 'hub', path: '/vi/products.html' },
  { template: 'content', path: '/en/about-us.html' },
  // No whitepaper is built yet, so its template preview stands in
  { template: 'gated-download', path: '/templates/gated-download.html' },
  { template: 'article', path: '/vi/media-center/561.html' },
  { template: 'case-study', path: '/en/success-story/anz-interactive-credit-card-digital-platform.html' },
  { template: 'person', path: '/en/esg-advisory/chen-zhengrui.html' },
  { template: 'listing', path: '/vi/media-center.html' },
  { template: 'contact', path: '/en/contact-us.html' },
  { template: 'utility', path: '/vi/download/digirunner-cloud.html' },
  { template: 'utility', path: '/404.html' },
];

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const pattern = (pages) => `^[a-z]+://[^/]+(${pages.map((p) => escape(p.path)).join('|')})$`;
const score = (level, minScore) => [level, { minScore }];

module.exports = {
  PAGES,
  ci: {
    collect: {
      staticDistDir: './.lhci-dist',
      ...(ALL
        ? { numberOfRuns: 1, maxAutodiscoverUrls: 0, staticDirFileDiscoveryDepth: 10 }
        : { numberOfRuns: 3, url: PAGES.map((p) => p.path) }),
    },
    assert: {
      assertMatrix: [
        {
          matchingUrlPattern: '.*',
          assertions: {
            'categories:accessibility': score('error', 0.95),
            'categories:best-practices': score('error', 0.95),
            'categories:seo': score('error', 1),
          },
        },
        {
          // The full-site run asserts every page; the scene exception applies to the listed ones
          matchingUrlPattern: ALL ? '.*' : pattern(PAGES.filter((p) => !p.scene)),
          assertions: { 'categories:performance': score('error', 0.95) },
        },
        ...(ALL ? [] : [{ matchingUrlPattern: pattern(PAGES.filter((p) => p.scene)), assertions: { 'categories:performance': score('warn', 0.95) } }]),
      ],
    },
    upload: {
      target: 'filesystem',
      outputDir: './.lighthouseci',
    },
  },
};
