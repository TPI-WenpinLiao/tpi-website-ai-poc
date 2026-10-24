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
  eyebrow: string;
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
  eyebrow: categoryTitle(e.data.category, entryLocale(e.id)),
  image: { src: e.data.coverImage, alt: '' },
  date: isoDate(e.data.publishedAt),
});

export const newsCard = (e: CollectionEntry<'news'>): EntryCard => ({
  title: e.data.title,
  href: entryPath('news', e),
  eyebrow: strings(entryLocale(e.id)).newsTypes[e.data.newsType],
  image: { src: e.data.coverImage, alt: '' },
  date: isoDate(e.data.publishedAt),
});

// An undisclosed client is never named (content-model.md「case-study」)
export const caseCard = (e: CollectionEntry<'case-study'>): EntryCard => ({
  title: e.data.title,
  href: entryPath('case-study', e),
  eyebrow: industryTitle(e.data.industry, entryLocale(e.id)),
  description: e.data.client.disclosed ? e.data.client.name : e.data.clientDescription,
  ...(e.data.coverImage ? { image: { src: e.data.coverImage, alt: '' } } : {}),
});
