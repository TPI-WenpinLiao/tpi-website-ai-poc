// URL paths of the pages built from static files under src/pages, and each page's locale versions.
// Pages built from content through a dynamic route aren't in staticRoutes; they pass their other
// locale versions as `translations`. Keys only: the glob's lazy imports never run.
import { localeLinks, routeFromPageFile, type LocaleLink } from './alternates';
import { LOCALES } from './locales';
import { localizePath, normalizePath } from './paths';
import { hasStrings } from '../../data/strings';

// Locales with a home page: every locale with interface copy (src/pages/index.astro and
// src/pages/[locale]/index.astro)
export const homeLocales = LOCALES.filter(hasStrings);

export const staticRoutes: ReadonlySet<string> = new Set([
  ...Object.keys(import.meta.glob('/src/pages/**/*.{astro,md,mdx}')).flatMap((file) => routeFromPageFile(file) ?? []),
  ...homeLocales.map((locale) => localizePath('/', locale)),
]);

// The one place a page's locale versions are decided: hreflang (Seo), the header language menu
// and LocaleSwitcher all take this list, so they cannot disagree
export function pageLocales(pathname: string, translations: readonly string[] = []): LocaleLink[] {
  return localeLinks({ path: normalizePath(pathname), routes: new Set([...staticRoutes, ...translations.map(normalizePath)]) });
}
