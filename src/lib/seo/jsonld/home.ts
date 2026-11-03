// JSON-LD for the home page (M3-04, #17): Organization and WebSite, from the organization data file
// (docs/ia/content-model.md「organization」). Only fields that file holds are written; nothing is
// added that isn't on the page or in the data.
import { graph, organizationNode, type Organization } from './shared.ts';

interface HomeJsonLdInput {
  org: Organization;
  /** Absolute site origin (Astro.site) */
  site: URL;
  /** Absolute URL of the organization logo file */
  logoUrl: string;
  /** Page language (BCP 47), e.g. zh-TW */
  inLanguage: string;
  /** Absolute URL of the locale's search page when it is built, for the SearchAction */
  searchUrl?: string | undefined;
}

export function homeJsonLd({ org, site, logoUrl, inLanguage, searchUrl }: HomeJsonLdInput) {
  const organization = organizationNode(org, site, logoUrl);
  const website = {
    '@type': 'WebSite',
    '@id': `${site.href}#website`,
    name: org.name,
    url: site.href,
    inLanguage,
    publisher: { '@id': organization['@id'] },
    // The site search (M6) as a SearchAction (content-model.md「首頁」, #187): `q` is what
    // SearchResults reads
    ...(searchUrl
      ? {
          potentialAction: {
            '@type': 'SearchAction',
            target: { '@type': 'EntryPoint', urlTemplate: `${searchUrl}?q={search_term_string}` },
            'query-input': 'required name=search_term_string',
          },
        }
      : {}),
  };
  return graph(organization, website);
}
