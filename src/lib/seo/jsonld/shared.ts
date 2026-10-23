// Building blocks shared by every page's JSON-LD (docs/ia/content-model.md): the organization
// node every page points at, BreadcrumbList from the nodes.csv trail, FAQPage, and the @graph
// wrapper. Pure functions; src/components/seo/Seo.astro serializes the result.
import type { CollectionEntry } from 'astro:content';
import type { IaNode } from '../../ia/nodes';
import type { Locale } from '../../i18n/locales.ts';
import { localizePath } from '../../i18n/paths.ts';

export type Organization = CollectionEntry<'organization'>['data'];
export type JsonLdNode = Record<string, unknown>;
export interface JsonLdGraph {
  '@context': 'https://schema.org';
  '@graph': JsonLdNode[];
}

export const graph = (...nodes: JsonLdNode[]): JsonLdGraph => ({ '@context': 'https://schema.org', '@graph': nodes });

// The home page's Organization carries this @id, so every other page's publisher, provider or
// worksFor refers to the same entity
export const organizationId = (site: URL) => `${site.href}#organization`;

// The full Organization (content-model.md「organization」): only fields the data file holds
export function organizationNode(org: Organization, site: URL, logoUrl: string): JsonLdNode {
  const headquarters = org.offices.find((o) => o.headquarters);
  return {
    '@type': 'Organization',
    '@id': organizationId(site),
    name: org.name,
    ...(org.alternateName?.length ? { alternateName: org.alternateName } : {}),
    url: site.href,
    logo: logoUrl,
    ...(org.sameAs?.length ? { sameAs: org.sameAs } : {}),
    ...(headquarters
      ? { address: { '@type': 'PostalAddress', streetAddress: headquarters.address, addressCountry: headquarters.country } }
      : {}),
    contactPoint: org.offices
      .filter((o) => o.phone)
      .map((o) => ({ '@type': 'ContactPoint', name: o.name, telephone: o.phone, areaServed: o.country })),
  };
}

// A reference to that Organization from another node (publisher, provider, worksFor)
export const organizationRef = (org: Organization, site: URL): JsonLdNode => ({
  '@type': 'Organization',
  '@id': organizationId(site),
  name: org.name,
  url: site.href,
});

// Every page except home (content-model.md「內容類型總覽」); trail is home → this page, group nodes
// left out. Items are the pages in the page's own locale, as the visible breadcrumb links
export const breadcrumbList = (trail: readonly IaNode[], site: URL, locale: Locale): JsonLdNode => ({
  '@type': 'BreadcrumbList',
  itemListElement: trail.map((n, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: n.title,
    item: new URL(localizePath(n.path, locale), site).href,
  })),
});

export const faqPage = (faq: readonly { question: string; answer: string }[]): JsonLdNode => ({
  '@type': 'FAQPage',
  mainEntity: faq.map((q) => ({ '@type': 'Question', name: q.question, acceptedAnswer: { '@type': 'Answer', text: q.answer } })),
});

// schema.org Date: YYYY-MM-DD
export const isoDate = (date: Date) => date.toISOString().slice(0, 10);

// What every page node carries besides its own fields; url is the page canonical
export interface PageContext {
  /** Absolute site origin (Astro.site) */
  site: URL;
  /** The page's canonical URL (canonicalUrl() in ../meta.ts) */
  url: string;
  /** Page language (BCP 47), e.g. zh-TW */
  inLanguage: Locale;
  org: Organization;
  /** Breadcrumb trail from home to this page (src/lib/ia/navigation.ts breadcrumb()) */
  trail: readonly IaNode[];
}

// JSON inside <script type="application/ld+json">: a "<" in the data could close the element
export const serializeJsonLd = (data: JsonLdGraph) => JSON.stringify(data).replaceAll('<', '\\u003c');
