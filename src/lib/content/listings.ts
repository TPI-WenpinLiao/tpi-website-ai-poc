// What each listing node lists (templates.csv「listing」), newest first: the blog and its category
// pages list blog posts, 媒體中心 lists news, 成功案例 lists case studies; 活動 has no collection yet,
// so it lists nothing. Only published entries of the page's locale. The blog's first featured post
// is lifted out to the top of its first page.
import { getCollection } from 'astro:content';
import type { Locale } from '../i18n/locales';
import { node } from '../ia/navigation';
import { caseCard, newsCard, postCard, type EntryCard } from './cards';
import { entryLocale, isPublished } from './entries';

export interface Listing {
  items: EntryCard[];
  featured?: EntryCard;
}

// Sort order of dated entries everywhere they are listed: newest first
export const newest = (a: { data: { publishedAt: Date } }, b: { data: { publishedAt: Date } }) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf();

export async function listing(id: string, locale: Locale): Promise<Listing> {
  const inLocale = (e: { id: string; data: { draft: boolean } }) => entryLocale(e.id) === locale && isPublished(e);
  const n = node(id);
  if (id === 'blog' || n.parent === 'blog') {
    const category = id === 'blog' ? undefined : id.replace(/^blog-/, '');
    const posts = (await getCollection('blog', (b) => inLocale(b) && (!category || b.data.category === category))).toSorted(newest);
    const featured = id === 'blog' ? posts.find((p) => p.data.featured) : undefined;
    return { items: posts.filter((p) => p !== featured).map(postCard), ...(featured ? { featured: postCard(featured) } : {}) };
  }
  if (id === 'media-center') return { items: (await getCollection('news', inLocale)).toSorted(newest).map(newsCard) };
  if (id === 'success-stories') return { items: (await getCollection('case-study', inLocale)).toSorted(newest).map(caseCard) };
  if (id === 'events') return { items: [] };
  throw new Error(`listing node ${id} has no content source; add it to src/lib/content/listings.ts`);
}
