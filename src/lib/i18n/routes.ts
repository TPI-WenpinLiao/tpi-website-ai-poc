// URL paths of the pages built from static files under src/pages, and each page's locale versions.
// Pages built from content through a dynamic route aren't in staticRoutes; they pass their other
// locale versions as `translations`. Keys only: the glob's lazy imports never run.
import { localeLinks, routeFromPageFile, type LocaleLink } from './alternates';
import { normalizePath } from './paths';

export const staticRoutes: ReadonlySet<string> = new Set(
  Object.keys(import.meta.glob('/src/pages/**/*.{astro,md,mdx}')).flatMap((file) => routeFromPageFile(file) ?? []),
);

// The one place a page's locale versions are decided: hreflang (Seo), the header language menu
// and LocaleSwitcher all take this list, so they cannot disagree
export function pageLocales(pathname: string, translations: readonly string[] = []): LocaleLink[] {
  return localeLinks({ path: normalizePath(pathname), routes: new Set([...staticRoutes, ...translations.map(normalizePath)]) });
}
