// URL path helpers for the rules in ADR 0002: zh-TW unprefixed, en and vi under /en and /vi, no
// trailing slash except the root. Free of Astro runtime imports so node --test can load them.
import { DEFAULT_LOCALE, isLocale, type Locale } from './locales.ts';

// build.format 'file' makes Astro.url.pathname end in .html (/about.html, /index.html); page URLs
// drop the extension, a trailing /index and the trailing slash
export function normalizePath(pathname: string): string {
  return (
    pathname
      .replace(/\.html$/, '')
      .replace(/(^|\/)index$/, '')
      .replace(/\/+$/, '') || '/'
  );
}

function firstSegment(path: string): string {
  return path.split('/')[1] ?? '';
}

export function localeFromPath(path: string): Locale {
  const segment = firstSegment(normalizePath(path));
  return isLocale(segment) && segment !== DEFAULT_LOCALE ? segment : DEFAULT_LOCALE;
}

// The locale-neutral path shared by every version of a page: /en/products/x → /products/x
export function stripLocale(path: string): string {
  const normalized = normalizePath(path);
  const locale = localeFromPath(normalized);
  if (locale === DEFAULT_LOCALE) return normalized;
  return normalized.slice(locale.length + 1) || '/';
}

// The URL of a locale-neutral path in one locale: ('/products/x', 'en') → /en/products/x, ('/', 'vi') → /vi
export function localizePath(path: string, locale: Locale): string {
  const neutral = stripLocale(path);
  if (locale === DEFAULT_LOCALE) return neutral;
  return neutral === '/' ? `/${locale}` : `/${locale}${neutral}`;
}
