import type { Locale } from '../i18n/locales.ts';
import { normalizePath } from '../i18n/paths.ts';

// Site name for <title> and og:site_name (seo-checklist「每頁必備」); en and vi use the company name
// alone (docs/i18n/glossary.csv brand:tpisoftware)
const SITE_NAMES: Record<Locale, string> = { 'zh-TW': 'TPIsoftware 昕力資訊', en: 'TPIsoftware', vi: 'TPIsoftware' };
const SEPARATORS: Record<Locale, string> = { 'zh-TW': '｜', en: ' | ', vi: ' | ' };

export const siteName = (locale: Locale) => SITE_NAMES[locale];

// 頁面主題｜TPIsoftware 昕力資訊, Page topic | TPIsoftware; the home page writes its own title instead.
// scripts/content/migrate/frontmatter.mjs measures titles with it too
export const pageTitle = (subject: string, locale: Locale) => `${subject}${SEPARATORS[locale]}${SITE_NAMES[locale]}`;

// A page's canonical URL (ADR 0002): absolute, no .html, /index or trailing slash. Seo.astro, the
// JSON-LD url/@id and sitemap.xml <loc> all use it, so they cannot drift apart
export const canonicalUrl = (pathname: string, site: URL) => new URL(normalizePath(pathname), site).href;
