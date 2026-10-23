// Page URLs of collection entries (ADR 0002, content-model.md「slug」): node-based entries live at
// their node's path; blog, news, case-study and person entries fill the {slug} or {id} of their
// collection node's path (nodes.csv: /blog/{slug}, /media-center/{id}, …). Prefixed by the entry's
// locale.
import type { CollectionEntry } from 'astro:content';
import { node } from '../ia/navigation';
import { localizePath } from '../i18n/paths';
import { entryLocale, entrySlug } from './entries';

// The nodes.csv node whose path pattern each slug-based collection fills
export const COLLECTION_NODES = { blog: 'blog-post', news: 'news-article', 'case-study': 'case-study', person: 'esg-advisor' } as const;

type SlugCollection = keyof typeof COLLECTION_NODES;

export function entryPath(collection: SlugCollection, entry: { id: string }): string {
  const pattern = node(COLLECTION_NODES[collection]).path;
  if (!/\{[a-z]+\}/.test(pattern)) throw new Error(`nodes.csv path of ${COLLECTION_NODES[collection]} has no {slug}: ${pattern}`);
  return localizePath(pattern.replace(/\{[a-z]+\}/, entrySlug(entry.id)), entryLocale(entry.id));
}

export const nodeEntryPath = (entry: CollectionEntry<'offering' | 'hub' | 'page' | 'whitepaper'>) =>
  localizePath(node(entry.data.node).path, entryLocale(entry.id));
