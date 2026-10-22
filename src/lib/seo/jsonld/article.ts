// JSON-LD for article-like pages (docs/ia/content-model.md): case-study → Article, blog →
// BlogPosting, news → NewsArticle, each with BreadcrumbList. Display names (category, tags, news
// type) and absolute image URLs are resolved by the page and passed in.
import type { CollectionEntry } from 'astro:content';
import { offeringRef } from './offering.ts';
import { breadcrumbList, graph, isoDate, organizationRef, type PageContext } from './shared.ts';

type CaseStudy = CollectionEntry<'case-study'>['data'];
type Blog = CollectionEntry<'blog'>['data'];
type News = CollectionEntry<'news'>['data'];

interface CaseStudyJsonLdInput extends PageContext {
  caseStudy: CaseStudy;
  /** Absolute URL of coverImage, when there is one */
  imageUrl?: string;
  /** The offerings the case is about, with their page URLs */
  offerings: readonly { kind: CollectionEntry<'offering'>['data']['kind']; name: string; url: string }[];
}

// The client is not written: content-model.md maps no property to it, and an undisclosed client
// must not appear anywhere
export function caseStudyJsonLd({ caseStudy, org, site, url, inLanguage, trail, imageUrl, offerings }: CaseStudyJsonLdInput) {
  const article = {
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: caseStudy.title,
    description: caseStudy.description,
    datePublished: isoDate(caseStudy.publishedAt),
    ...(imageUrl ? { image: imageUrl } : {}),
    about: offerings.map(offeringRef),
    publisher: organizationRef(org, site),
    inLanguage,
    mainEntityOfPage: url,
  };
  return graph(article, breadcrumbList(trail, site));
}

interface PostInput extends PageContext {
  /** Absolute URL of coverImage */
  imageUrl: string;
  /** articleSection: the category or news type display name */
  section: string;
}

function posting(type: 'BlogPosting' | 'NewsArticle', post: Blog | News, author: Record<string, unknown>, input: PostInput) {
  const { org, site, url, inLanguage, imageUrl, section } = input;
  return {
    '@type': type,
    '@id': `${url}#article`,
    headline: post.title,
    description: post.description,
    image: imageUrl,
    datePublished: isoDate(post.publishedAt),
    dateModified: isoDate(post.updatedAt ?? post.publishedAt),
    author,
    publisher: organizationRef(org, site),
    articleSection: section,
    inLanguage,
    mainEntityOfPage: url,
  };
}

interface BlogJsonLdInput extends PostInput {
  post: Blog;
  /** Display names of post.tags */
  tagNames?: readonly string[];
}

export function blogPostingJsonLd(input: BlogJsonLdInput) {
  const { post, tagNames = [], site, trail } = input;
  const main = posting('BlogPosting', post, { '@type': post.authorType, name: post.author }, input);
  return graph({ ...main, ...(tagNames.length ? { keywords: tagNames } : {}) }, breadcrumbList(trail, site));
}

interface NewsJsonLdInput extends PostInput {
  post: News;
}

// News is always written by the company
export function newsArticleJsonLd(input: NewsJsonLdInput) {
  const { post, org, site, trail } = input;
  return graph(posting('NewsArticle', post, organizationRef(org, site), input), breadcrumbList(trail, site));
}
