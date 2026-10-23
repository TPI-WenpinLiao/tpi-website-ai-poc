// Internal pages: the design and review pages that stay out of navigation and the sitemap
// (design-system skill「展示頁」). Their URLs are locale-neutral paths and everything under them.
import { stripLocale } from '../i18n/paths.ts';

export const INTERNAL_PATHS = ['/design-system', '/prototypes', '/templates'] as const;

export function isInternal(path: string): boolean {
  const neutral = stripLocale(path);
  return INTERNAL_PATHS.some((p) => neutral === p || neutral.startsWith(`${p}/`));
}

// Site pages that are only steps of a flow, with no content of their own to find through search:
// 404, the search results and the pages after a form is sent (#23). nodes.csv paths, checked by
// scripts/seo/indexing.test.mjs
export const FLOW_PATHS = ['/404', '/search', '/thanks', '/subscribe/result'] as const;

// Pages listed in the sitemap: everything built except internal pages and flow pages
export const inSitemap = (path: string) => !isInternal(path) && !FLOW_PATHS.some((p) => p === stripLocale(path));
