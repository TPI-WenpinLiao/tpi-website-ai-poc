// JSON-LD for company and legal pages (docs/ia/content-model.md「page」): about → AboutPage and
// contact → ContactPage, both with the full Organization (offices, phones, address) as mainEntity;
// partners and legal pages → WebPage, legal pages dated by effectiveDate.
import type { CollectionEntry } from 'astro:content';
import { breadcrumbList, graph, isoDate, organizationNode, type PageContext } from './shared.ts';

type Page = CollectionEntry<'page'>['data'];

interface PageJsonLdInput extends PageContext {
  // Only the fields the JSON-LD uses, so the contact page, which has no entry, passes its node's
  page: Pick<Page, 'title' | 'description' | 'node' | 'effectiveDate'>;
  /** Absolute URL of the organization logo file */
  logoUrl: string;
}

const TYPES: Partial<Record<Page['node'], string>> = { about: 'AboutPage', contact: 'ContactPage' };

export function pageJsonLd({ page, org, site, url, inLanguage, trail, logoUrl }: PageJsonLdInput) {
  const type = TYPES[page.node] ?? 'WebPage';
  const main = {
    '@type': type,
    '@id': `${url}#page`,
    name: page.title,
    description: page.description,
    url,
    inLanguage,
    ...(type === 'WebPage' ? {} : { mainEntity: organizationNode(org, site, logoUrl) }),
    ...(page.effectiveDate ? { datePublished: isoDate(page.effectiveDate) } : {}),
  };
  return graph(main, breadcrumbList(trail, site, inLanguage));
}
