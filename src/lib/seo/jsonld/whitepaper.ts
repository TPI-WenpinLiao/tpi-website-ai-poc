// JSON-LD for whitepaper pages (docs/ia/content-model.md「whitepaper」): WebPage whose mainEntity
// is the DigitalDocument, plus BreadcrumbList. The file sits behind the form, so it has no url.
import type { CollectionEntry } from 'astro:content';
import { breadcrumbList, graph, organizationRef, type PageContext } from './shared.ts';

type Whitepaper = CollectionEntry<'whitepaper'>['data'];

interface WhitepaperJsonLdInput extends PageContext {
  whitepaper: Whitepaper;
  /** Absolute URL of coverImage */
  imageUrl: string;
  /** The page of offeringNode */
  about: { name: string; url: string };
}

export function whitepaperJsonLd({ whitepaper, org, site, url, inLanguage, trail, imageUrl, about }: WhitepaperJsonLdInput) {
  const page = {
    '@type': 'WebPage',
    '@id': `${url}#page`,
    name: whitepaper.title,
    description: whitepaper.description,
    url,
    inLanguage,
    mainEntity: {
      '@type': 'DigitalDocument',
      name: whitepaper.title,
      description: whitepaper.description,
      image: imageUrl,
      publisher: organizationRef(org, site),
      about: { '@type': 'WebPage', name: about.name, url: about.url },
    },
  };
  return graph(page, breadcrumbList(trail, site, inLanguage));
}
