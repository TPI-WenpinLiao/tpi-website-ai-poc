// JSON-LD for the home page (M3-04, #17): Organization and WebSite, from the organization data file
// (docs/ia/content-model.md「organization」). Only fields that file holds are written; nothing is
// added that isn't on the page or in the data. M4-03 (#22) moves JSON-LD into the shared SEO layer.
import type { CollectionEntry } from 'astro:content';

type Organization = CollectionEntry<'organization'>['data'];

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
  const url = site.href;
  const headquarters = org.offices.find((o) => o.headquarters);
  const organization = {
    '@type': 'Organization',
    '@id': `${url}#organization`,
    name: org.name,
    ...(org.alternateName?.length ? { alternateName: org.alternateName } : {}),
    url,
    logo: logoUrl,
    ...(org.sameAs?.length ? { sameAs: org.sameAs } : {}),
    ...(headquarters
      ? { address: { '@type': 'PostalAddress', streetAddress: headquarters.address, addressCountry: headquarters.country } }
      : {}),
    contactPoint: org.offices
      .filter((o) => o.phone)
      .map((o) => ({ '@type': 'ContactPoint', name: o.name, telephone: o.phone, areaServed: o.country })),
  };
  const website = {
    '@type': 'WebSite',
    '@id': `${url}#website`,
    name: org.name,
    url,
    inLanguage,
    publisher: { '@id': organization['@id'] },
  };
  return { '@context': 'https://schema.org', '@graph': [organization, website] };
}
