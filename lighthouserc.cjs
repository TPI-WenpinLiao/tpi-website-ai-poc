// Lighthouse CI config. `npm run lighthouse` (part of `npm run check`) audits the pages listed in
// PAGES; `npm run lighthouse:all` (LHCI_ALL=1) audits every HTML file in dist/ once. Why only these
// pages: docs/decisions/0004-lighthouse-scope.md
const ALL = process.env.LHCI_ALL === '1';

// One page per src/layouts/templates/ file: the lowest performance score of that template in the
// full-site run of 2026-10-25 (ADR 0004), plus every home page, 404 and a search.
// Paths end in .html: LHCI's static server does not add the extension.
const PAGES = [
  { template: 'home', path: '/index.html' },
  { template: 'home', path: '/en.html' },
  { template: 'home', path: '/vi.html' },
  { template: 'offering', path: '/products/systalk-chat.html' },
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
  // The search page with a query: it loads Pagefind and draws results (M6-02, #34)
  { template: 'utility', path: '/search.html?q=%E4%BC%81%E6%A5%AD' },
];

const score = (level, minScore) => [level, { minScore }];

module.exports = {
  PAGES,
  ci: {
    collect: {
      staticDistDir: './.lhci-dist',
      // bf-cache navigates to chrome://terms and back with no time limit; a page that crashes there
      // stops Lighthouse for good. It has weight 0, so no score changes (#136, ADR 0004).
      // Chrome flags come from LHCI_SETTINGS__CHROME_FLAGS, which LHCI merges into this object.
      settings: { skipAudits: ['bf-cache'] },
      ...(ALL
        ? { numberOfRuns: 1, maxAutodiscoverUrls: 0, staticDirFileDiscoveryDepth: 10 }
        : { numberOfRuns: 3, url: PAGES.map((p) => p.path) }),
    },
    assert: {
      assertions: {
        'categories:performance': score('error', 0.95),
        'categories:accessibility': score('error', 0.95),
        'categories:best-practices': score('error', 0.95),
        'categories:seo': score('error', 1),
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: './.lighthouseci',
    },
  },
};
