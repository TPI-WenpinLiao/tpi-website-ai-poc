// JSON-LD for offering pages (M3-05, #18), as docs/ia/content-model.md「offering」maps it:
// SoftwareApplication for products, Service for solutions and services, BreadcrumbList from the
// nodes.csv trail, and FAQPage when the entry has questions. Only fields the entry, nodes.csv or
// the organization data file hold are written; no offers or ratings (no real data for them).
import type { CollectionEntry } from 'astro:content';
import { breadcrumbList, faqPage, graph, organizationRef, type JsonLdNode, type PageContext } from './shared.ts';

type Offering = CollectionEntry<'offering'>['data'];

const offeringType = (kind: Offering['kind']) => (kind === 'product' ? 'SoftwareApplication' : 'Service');
const offeringId = (url: string) => `${url}#offering`;

// Points at an offering page's main node from another page (case-study `about`)
export const offeringRef = (o: { kind: Offering['kind']; name: string; url: string }): JsonLdNode => ({
  '@type': offeringType(o.kind),
  '@id': offeringId(o.url),
  name: o.name,
  url: o.url,
});

interface OfferingJsonLdInput extends PageContext {
  offering: Offering;
  /** Absolute URL of the page's image: heroImage, else ogImage, else the site default */
  imageUrl: string;
}

export function offeringJsonLd({ offering, org, site, url, imageUrl, trail, inLanguage }: OfferingJsonLdInput) {
  const provider = organizationRef(org, site);
  const common = { '@id': offeringId(url), name: offering.title, description: offering.description, image: imageUrl, url, inLanguage };
  const main =
    offering.kind === 'product'
      ? { '@type': offeringType(offering.kind), ...common, applicationCategory: 'BusinessApplication', publisher: provider }
      : { '@type': offeringType(offering.kind), ...common, serviceType: offering.title, provider };
  const faq = offering.faq?.length ? [faqPage(offering.faq)] : [];
  return graph(main, breadcrumbList(trail, site), ...faq);
}
