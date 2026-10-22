// Which locale versions of a page exist, and where the locale switcher sends each locale
// (ADR 0002, 缺翻譯的頁面). There is no i18n.fallback, so a version exists only when a page was
// built for it. Pure functions; src/lib/i18n/routes.ts supplies the built paths.
import { LOCALES, type Locale } from './locales.ts';
import { localeFromPath, localizePath, normalizePath } from './paths.ts';

export interface LocaleLink {
  locale: Locale;
  href: string;
  // page: the same page in that locale; home: that locale's home, because the page isn't translated
  target: 'page' | 'home';
  current: boolean;
}

// The URL path a static page file builds to: /src/pages/en/index.astro → /en. null for files that
// build no page of their own: _-prefixed partials and dynamic routes ([slug]), whose paths come from
// getStaticPaths
export function routeFromPageFile(file: string): string | null {
  const route = file.replace(/^.*?\/src\/pages/, '').replace(/\.(astro|md|mdx)$/, '');
  if (route.split('/').some((segment) => segment.startsWith('_') || segment.includes('['))) return null;
  return normalizePath(route);
}

// Every locale whose switcher entry can point at a built page: the same page when that locale has
// it, else that locale's home; a locale without even a home is left out (no link to a page that
// was never built). `routes` holds every built URL path, prefixes included.
export function localeLinks({ path, routes }: { path: string; routes: ReadonlySet<string> }): LocaleLink[] {
  const current = localeFromPath(path);
  return LOCALES.flatMap((locale): LocaleLink[] => {
    const page = localizePath(path, locale);
    if (locale === current || routes.has(page)) return [{ locale, href: page, target: 'page', current: locale === current }];
    const home = localizePath('/', locale);
    if (routes.has(home)) return [{ locale, href: home, target: 'home', current: false }];
    return [];
  });
}
