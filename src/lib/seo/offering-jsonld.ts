// JSON-LD for offering pages (M3-05, #18), as docs/ia/content-model.md「offering」maps it:
// SoftwareApplication for products, Service for solutions and services, BreadcrumbList from the
// nodes.csv trail, and FAQPage when the entry has questions. Only fields the entry, nodes.csv or
// the organization data file hold are written; no offers or ratings (no real data for them).
// M4-03 (#22) moves JSON-LD into the shared SEO layer.
import type { CollectionEntry } from 'astro:content';
import type { IaNode } from '../ia/nodes';

type Offering = CollectionEntry<'offering'>['data'];
type Organization = CollectionEntry<'organization'>['data'];

interface OfferingJsonLdInput {
  offering: Offering;
  org: Organization;
  /** Absolute site origin (Astro.site) */
  site: URL;
  /** The page's canonical URL */
  url: string;
  /** Absolute URL of the page's image: heroImage, else ogImage, else the site default */
  imageUrl: string;
  /** Breadcrumb trail from home to this page (src/lib/ia/navigation.ts breadcrumb()) */
  trail: IaNode[];
  /** Page language (BCP 47), e.g. zh-TW */
  inLanguage: string;
}

export function offeringJsonLd({ offering, org, site, url, imageUrl, trail, inLanguage }: OfferingJsonLdInput) {
  // Same @id as the home page's Organization (home-jsonld.ts), so the two describe one entity
  const provider = { '@type': 'Organization', '@id': `${site.href}#organization`, name: org.name, url: site.href };
  const common = { '@id': `${url}#offering`, name: offering.title, description: offering.description, image: imageUrl, url, inLanguage };
  const main =
    offering.kind === 'product'
      ? { '@type': 'SoftwareApplication', ...common, applicationCategory: 'BusinessApplication', publisher: provider }
      : { '@type': 'Service', ...common, serviceType: offering.title, provider };
  const breadcrumb = {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((n, i) => ({ '@type': 'ListItem', position: i + 1, name: n.title, item: new URL(n.path, site).href })),
  };
  const faq = offering.faq?.length
    ? [
        {
          '@type': 'FAQPage',
          mainEntity: offering.faq.map((q) => ({ '@type': 'Question', name: q.question, acceptedAnswer: { '@type': 'Answer', text: q.answer } })),
        },
      ]
    : [];
  return { '@context': 'https://schema.org', '@graph': [main, breadcrumb, ...faq] };
}
