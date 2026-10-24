// JSON-LD for person pages (docs/ia/content-model.md「person」): ProfilePage whose mainEntity is
// the Person, plus BreadcrumbList.
import type { CollectionEntry } from 'astro:content';
import { breadcrumbList, graph, organizationRef, type PageContext } from './shared.ts';

type Person = CollectionEntry<'person'>['data'];

interface PersonJsonLdInput extends PageContext {
  person: Person;
  /** Absolute URL of photo, when there is one */
  imageUrl?: string;
}

export function personJsonLd({ person, org, site, url, inLanguage, trail, imageUrl }: PersonJsonLdInput) {
  const profile = {
    '@type': 'ProfilePage',
    '@id': `${url}#page`,
    name: person.title,
    description: person.description,
    url,
    inLanguage,
    mainEntity: {
      '@type': 'Person',
      name: person.title,
      jobTitle: person.jobTitle,
      ...(imageUrl ? { image: imageUrl } : {}),
      worksFor: organizationRef(org, site),
      ...(person.expertise?.length ? { knowsAbout: person.expertise } : {}),
      ...(person.certifications?.length
        ? { hasCredential: person.certifications.map((name) => ({ '@type': 'EducationalOccupationalCredential', name })) }
        : {}),
    },
  };
  return graph(profile, breadcrumbList(trail, site));
}
