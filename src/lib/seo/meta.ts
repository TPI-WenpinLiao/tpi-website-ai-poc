import { DEFAULT_LOCALE, type Locale } from '../i18n/locales.ts';
import { normalizePath } from '../i18n/paths.ts';

// Site name for <title> and og:site_name (seo-checklist「每頁必備」). en and vi use the company name
// alone (docs/i18n/glossary.csv brand:tpisoftware)
export const siteName = (locale: Locale) => (locale === DEFAULT_LOCALE ? 'TPIsoftware 昕力資訊' : 'TPIsoftware');

// Between the parts of a <title> or of a one-line label (job title｜affiliation): full-width in
// zh-TW, spaced ASCII in en and vi
export const titleSeparator = (locale: Locale) => (locale === DEFAULT_LOCALE ? '｜' : ' | ');

// 頁面主題｜TPIsoftware 昕力資訊 in zh-TW, "Subject | TPIsoftware" in en and vi; the home page writes
// its own title instead
export const pageTitle = (subject: string, locale: Locale) => `${subject}${titleSeparator(locale)}${siteName(locale)}`;

// A page's canonical URL (ADR 0002): absolute, no .html, /index or trailing slash. Seo.astro, the
// JSON-LD url/@id and sitemap.xml <loc> all use it, so they cannot drift apart
export const canonicalUrl = (pathname: string, site: URL) => new URL(normalizePath(pathname), site).href;
