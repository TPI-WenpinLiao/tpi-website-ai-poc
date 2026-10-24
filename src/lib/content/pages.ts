// Every page src/pages/[...path].astro builds, other than the home and 404 pages (ADR 0002):
// - one per published collection entry, in the entry's locale once that locale has interface copy
//   (src/data/strings). Node-based entries (offering, hub, page, whitepaper) live at their nodes.csv
//   path and the node's template picks the layout; blog, news, case-study and person entries fill
//   their collection node's path (src/lib/content/urls.ts)
// - listing, contact and utility nodes in every locale with interface copy (src/data/strings);
//   listings are split into pages at {path}/page/{n}. The contact page takes the locale's `page`
//   entry for its node when there is one
// - a download page per offering with downloads (/download/{product})
// A page's `translations` are its other locale versions that are built too, so hreflang and the
// language menu never point at a page that doesn't exist (a listing with fewer pages in en, say).
// builtPaths() adds the static pages, for links that must only go to pages a locale has.
import { getCollection, type CollectionEntry } from 'astro:content';
import { node } from '../ia/navigation';
import { duplicates, entryLocale, isPublished, pagePath, paginate, translationPaths } from './entries';
import { nodes } from '../ia/nodes';
import { isUtilityPage, UTILITY_ELSEWHERE, type UtilityPage } from '../ia/utility';
import { LOCALES, type Locale } from '../i18n/locales';
import { localizePath } from '../i18n/paths';
import { staticRoutes } from '../i18n/routes';
import { listing } from './listings';
import type { EntryCard } from './cards';
import { hasStrings } from '../../data/strings';
import { entryPath, nodeEntryPath } from './urls';

export type Page =
  | { kind: 'offering'; entry: CollectionEntry<'offering'> }
  | { kind: 'hub'; entry: CollectionEntry<'hub'> }
  | { kind: 'page'; entry: CollectionEntry<'page'> }
  | { kind: 'whitepaper'; entry: CollectionEntry<'whitepaper'> }
  | { kind: 'blog'; entry: CollectionEntry<'blog'> }
  | { kind: 'news'; entry: CollectionEntry<'news'> }
  | { kind: 'case-study'; entry: CollectionEntry<'case-study'> }
  | { kind: 'person'; entry: CollectionEntry<'person'> }
  | { kind: 'listing'; id: string; locale: Locale; items: EntryCard[]; featured: EntryCard | undefined; page: number; pages: number }
  | { kind: 'contact'; locale: Locale; entry: CollectionEntry<'page'> | undefined }
  | { kind: 'utility'; id: UtilityPage; locale: Locale }
  | { kind: 'download'; entry: CollectionEntry<'offering'> };
export type PageProps = Page & { translations: string[] };

interface BuiltPage {
  params: { path: string };
  props: PageProps;
}

// Listing, contact and utility pages: no entry, so a locale has them once its interface copy exists.
// Their translations are every other locale's version; pages() drops the ones that aren't built.
async function nodePages(): Promise<BuiltPage[]> {
  const locales = LOCALES.filter(hasStrings);
  const versions = (path: string, locale: Locale) => locales.filter((l) => l !== locale).map((l) => localizePath(path, l));
  const utilities = nodes.filter((n) => n.template === 'utility' && !(UTILITY_ELSEWHERE as readonly string[]).includes(n.id));
  const unknown = utilities.filter((n) => !isUtilityPage(n.id)).map((n) => n.id);
  if (unknown.length) throw new Error(`utility nodes without a UtilityTemplate page: ${unknown.join(', ')} (src/lib/ia/utility.ts)`);
  const out: BuiltPage[] = [];
  for (const locale of locales) {
    for (const n of nodes.filter((n) => n.template === 'listing')) {
      const { items, featured } = await listing(n.id, locale);
      const pages = paginate(items);
      const listPath = localizePath(n.path, locale);
      out.push(
        ...pages.map((pageItems, i) => {
          const path = pagePath(listPath, i + 1);
          return {
            params: { path: path.slice(1) },
            props: {
              kind: 'listing',
              id: n.id,
              locale,
              items: pageItems,
              featured: i === 0 ? featured : undefined,
              page: i + 1,
              pages: pages.length,
              translations: versions(path, locale),
            } satisfies PageProps,
          };
        }),
      );
    }
    const contact = localizePath(node('contact').path, locale);
    const entries = await getCollection('page', (e) => e.data.node === 'contact' && entryLocale(e.id) === locale && isPublished(e));
    if (entries.length > 1) throw new Error(`more than one published ${locale} page entry for the contact node: ${entries.map((e) => e.id).join(', ')}`);
    out.push({ params: { path: contact.slice(1) }, props: { kind: 'contact', locale, entry: entries[0], translations: versions(contact, locale) } });
    for (const id of utilities.map((n) => n.id).filter(isUtilityPage)) {
      const path = localizePath(node(id).path, locale);
      out.push({ params: { path: path.slice(1) }, props: { kind: 'utility', id, locale, translations: versions(path, locale) } });
    }
  }
  return out;
}

function route<E extends { id: string; data: { translationKey: string; draft: boolean } }>(
  all: E[],
  pathOf: (e: E) => string,
  page: (e: E) => Page,
): BuiltPage[] {
  // Templates need the locale's interface copy, so entries of a locale without it are content only:
  // no page, and no hreflang pointing at one
  const built = all.filter((e) => hasStrings(entryLocale(e.id)));
  return built.filter(isPublished).map((e) => ({
    params: { path: pathOf(e).slice(1) },
    props: { ...page(e), translations: translationPaths(e, built, pathOf) },
  }));
}

async function buildPages(): Promise<BuiltPage[]> {
  const paths = [
    ...route(await getCollection('offering'), nodeEntryPath, (entry) => ({ kind: 'offering', entry })),
    ...route(await getCollection('hub'), nodeEntryPath, (entry) => ({ kind: 'hub', entry })),
    // The contact page is built with the other node pages below (nodePages), entry or not
    ...route(await getCollection('page', (e) => node(e.data.node).template === 'content'), nodeEntryPath, (entry) => ({ kind: 'page', entry })),
    ...route(await getCollection('whitepaper'), nodeEntryPath, (entry) => ({ kind: 'whitepaper', entry })),
    ...route(await getCollection('blog'), (e) => entryPath('blog', e), (entry) => ({ kind: 'blog', entry })),
    ...route(await getCollection('news'), (e) => entryPath('news', e), (entry) => ({ kind: 'news', entry })),
    ...route(await getCollection('case-study'), (e) => entryPath('case-study', e), (entry) => ({ kind: 'case-study', entry })),
    ...route(await getCollection('person'), (e) => entryPath('person', e), (entry) => ({ kind: 'person', entry })),
    ...(await nodePages()),
    ...route(
      await getCollection('offering', (o) => (o.data.downloads ?? []).length > 0),
      (e) => localizePath(node('download').path.replace('{product}', e.data.node), entryLocale(e.id)),
      (entry) => ({ kind: 'download', entry }),
    ),
  ];
  // Two pages on one URL would leave only one built (a blog slug named like a category, say)
  const clashes = duplicates(paths.map((p) => p.params.path));
  if (clashes.length) throw new Error(`more than one page builds to: /${clashes.join(', /')}`);
  const built = new Set(paths.map((p) => `/${p.params.path}`));
  return paths.map((p) => ({ ...p, props: { ...p.props, translations: p.props.translations.filter((t) => built.has(t)) } }));
}

let cached: Promise<BuiltPage[]> | undefined;
export const pages = () => (cached ??= buildPages());

// URL paths of every built page, static pages included
export async function builtPaths(): Promise<ReadonlySet<string>> {
  return new Set([...staticRoutes, ...(await pages()).map((p) => `/${p.params.path}`)]);
}
