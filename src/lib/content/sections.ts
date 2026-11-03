// What an offering or hub page's `sections` (#187, src/content.config.ts pageSection) link to: the
// templates leave those pages out of their own lists (child pages, related offerings), so a page is
// not offered twice.
import type { CollectionEntry } from 'astro:content';

type Section = NonNullable<CollectionEntry<'offering'>['data']['sections']>[number];

/** Node ids the sections link to: their links, items, index rows and table rows. */
export function linkedNodes(sections: readonly Section[]): Set<string> {
  return new Set(
    sections.flatMap((sec) => [
      sec.link?.node,
      ...('items' in sec && sec.items ? sec.items.map((i) => ('node' in i ? i.node : undefined)) : []),
      ...('index' in sec && sec.index ? sec.index.map((i) => i.node) : []),
      ...('rows' in sec && sec.rows ? sec.rows.map((r) => r.link?.node) : []),
    ]).filter((id): id is string => id !== undefined),
  );
}
