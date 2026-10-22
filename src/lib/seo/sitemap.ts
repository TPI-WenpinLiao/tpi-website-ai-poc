// sitemap.xml (seo-checklist): one <url> per page, with the same hreflang alternates the page's
// <head> carries (Seo.astro). Built by src/integrations/sitemap.ts after the build; robots.txt keeps
// Disallow: / and gets no Sitemap: line, so nothing points crawlers here before launch.
import { localeLinks } from '../i18n/alternates.ts';
import { normalizePath } from '../i18n/paths.ts';
import { hreflangAlternates } from './hreflang.ts';
import { inSitemap } from './indexing.ts';
import { canonicalUrl } from './meta.ts';

const escapeXml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c] ?? c);

/** @param paths URL paths of every built page (normalized or not) */
export function sitemapXml(paths: readonly string[], site: URL): string {
  const routes = new Set(paths.map(normalizePath));
  const urls = [...routes]
    .filter(inSitemap)
    .toSorted()
    .map((path) => {
      const links = hreflangAlternates(localeLinks({ path, routes }), site).map(
        (a) => `    <xhtml:link rel="alternate" hreflang="${escapeXml(a.hreflang)}" href="${escapeXml(a.href)}"/>`,
      );
      return ['  <url>', `    <loc>${escapeXml(canonicalUrl(path, site))}</loc>`, ...links, '  </url>'].join('\n');
    });
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n');
}
