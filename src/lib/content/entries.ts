// Collection entry helpers shared by the dynamic routes (M4-04): an entry id is <locale>/<slug>
// (content-model.md「Astro 實作」), drafts build no page, and the other locale versions of a page are
// the published entries sharing its translationKey. Pure functions; node --test loads them.
import { isLocale, type Locale } from '../i18n/locales.ts';

interface Entry {
  id: string;
  data: { translationKey: string; draft: boolean };
}

export function entryLocale(id: string): Locale {
  const locale = id.split('/')[0] ?? '';
  if (!isLocale(locale)) throw new Error(`entry id ${id} does not start with a locale`);
  return locale;
}

export const entrySlug = (id: string) => id.slice(id.indexOf('/') + 1);

export const isPublished = (entry: { data: { draft: boolean } }) => !entry.data.draft;

// URL paths of the entry's other published locale versions, as PageLayout's `translations`
export function translationPaths<E extends Entry>(entry: E, all: readonly E[], pathOf: (e: E) => string): string[] {
  return all
    .filter((e) => e.id !== entry.id && isPublished(e) && e.data.translationKey === entry.data.translationKey)
    .map(pathOf);
}

// Listing pages (ADR 0002「列表分頁」): page 1 at the listing's own path, page n at
// {path}/page/{n}. A listing without items still has its first page, which shows the empty state.
export const PAGE_SIZE = 12;

export const pagePath = (listPath: string, n: number) => (n === 1 ? listPath : `${listPath === '/' ? '' : listPath}/page/${n}`);

export function paginate<T>(items: readonly T[], size = PAGE_SIZE): T[][] {
  const pages: T[][] = [];
  for (let i = 0; i < items.length; i += size) pages.push(items.slice(i, i + size));
  return pages.length ? pages : [[]];
}
