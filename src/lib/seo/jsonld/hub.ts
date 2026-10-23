// JSON-LD for hub pages (docs/ia/content-model.md「hub」): CollectionPage whose parts are the
// child node pages, plus BreadcrumbList.
import type { CollectionEntry } from 'astro:content';
import { breadcrumbList, graph, type PageContext } from './shared.ts';

type Hub = CollectionEntry<'hub'>['data'];

interface HubJsonLdInput extends PageContext {
  hub: Hub;
  /** The child node pages the hub lists, with absolute URLs */
  parts: readonly { name: string; url: string }[];
}

export function hubJsonLd({ hub, site, url, inLanguage, trail, parts }: HubJsonLdInput) {
  const page = {
    '@type': 'CollectionPage',
    '@id': `${url}#page`,
    name: hub.title,
    description: hub.description,
    url,
    inLanguage,
    hasPart: parts.map((p) => ({ '@type': 'WebPage', name: p.name, url: p.url })),
  };
  return graph(page, breadcrumbList(trail, site, inLanguage));
}
