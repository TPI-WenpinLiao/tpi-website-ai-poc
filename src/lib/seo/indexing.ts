// Internal pages: the design and review pages that stay out of navigation and the sitemap
// (design-system skill「展示頁」). Their URLs are locale-neutral paths and everything under them.
import { stripLocale } from '../i18n/paths.ts';

export const INTERNAL_PATHS = ['/design-system', '/wireframes', '/prototypes'] as const;

export function isInternal(path: string): boolean {
  const neutral = stripLocale(path);
  return INTERNAL_PATHS.some((p) => neutral === p || neutral.startsWith(`${p}/`));
}

// Pages listed in the sitemap: everything built except internal pages and the 404 page
export const inSitemap = (path: string) => !isInternal(path) && stripLocale(path) !== '/404';
