import { normalizePath } from '../i18n/paths.ts';

// Site name for <title> and og:site_name (seo-checklist「每頁必備」)
export const SITE_NAME = 'TPIsoftware 昕力資訊';

// 頁面主題｜TPIsoftware 昕力資訊; the home page writes its own title instead
export const pageTitle = (subject: string) => `${subject}｜${SITE_NAME}`;

// A page's canonical URL (ADR 0002): absolute, no .html, /index or trailing slash. Seo.astro and the
// JSON-LD url/@id both use it, so the two cannot drift apart
export const canonicalUrl = (pathname: string, site: URL) => new URL(normalizePath(pathname), site).href;
