// Card data for entries listed on other pages (hub, article, case-study, listing templates), so
// every page shows a blog post, a news item or a case study the same way.
import type { CollectionEntry } from 'astro:content';
import { localNode } from '../ia/navigation';
import type { Locale } from '../i18n/locales';
import { strings } from '../../data/strings';
import { entryLocale } from './entries';
import { entryPath } from './urls';
import { isoDate } from '../seo/jsonld/shared';

export interface EntryCard {
  title: string;
  href: string;
  category: string;
  description?: string;
  image?: { src: ImageMetadata; alt: string };
  /** YYYY-MM-DD */
  date?: string;
}

// Blog category display name: the title of its blog-<category> listing node
export const categoryTitle = (category: string, locale: Locale) => localNode(`blog-${category}`, locale).title;

// Industry display name: the industry hub's title; `other` has none
export function industryTitle(industry: CollectionEntry<'case-study'>['data']['industry'], locale: Locale) {
  return industry === 'other' ? strings(locale).otherIndustry : localNode(`industry-${industry}`, locale).title;
}

// Covers are decorative next to the title link, so alt is empty
export const postCard = (e: CollectionEntry<'blog'>): EntryCard => ({
  title: e.data.title,
  href: entryPath('blog', e),
  category: categoryTitle(e.data.category, entryLocale(e.id)),
  image: { src: e.data.coverImage, alt: '' },
  date: isoDate(e.data.publishedAt),
});

export const newsCard = (e: CollectionEntry<'news'>): EntryCard => ({
  title: e.data.title,
  href: entryPath('news', e),
  category: strings(entryLocale(e.id)).newsTypes[e.data.newsType],
  image: { src: e.data.coverImage, alt: '' },
  date: isoDate(e.data.publishedAt),
});

// A case's link text: the client's name, a full-width colon and the case title, so the anchor says
// whose case it is (briefs/digirunner.md「連出」第 10 段, #187); a title that starts with the client's
// name stays as it is, and an undisclosed client is never named
// (zh-TW's full-width colon, ': ' in en and vi)
export const caseLinkLabel = (e: CollectionEntry<'case-study'>) => {
  const colon = entryLocale(e.id) === 'zh-TW' ? '：' : ': ';
  return e.data.client.disclosed && !e.data.title.startsWith(e.data.client.name) ? `${e.data.client.name}${colon}${e.data.title}` : e.data.title;
};

// An undisclosed client is never named (content-model.md「case-study」)
export const caseCard = (e: CollectionEntry<'case-study'>): EntryCard => ({
  title: e.data.title,
  href: entryPath('case-study', e),
  category: industryTitle(e.data.industry, entryLocale(e.id)),
  description: e.data.client.disclosed ? e.data.client.name : e.data.clientDescription,
  ...(e.data.coverImage ? { image: { src: e.data.coverImage, alt: '' } } : {}),
});
