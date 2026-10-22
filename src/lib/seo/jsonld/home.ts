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
}

export function homeJsonLd({ org, site, logoUrl, inLanguage }: HomeJsonLdInput) {
  const organization = organizationNode(org, site, logoUrl);
  const website = {
    '@type': 'WebSite',
    '@id': `${site.href}#website`,
    name: org.name,
    url: site.href,
    inLanguage,
    publisher: { '@id': organization['@id'] },
  };
  return graph(organization, website);
}
