// The nodes.csv nodes that have a page in each locale, by the same rules src/pages/[...path].astro
// and src/pages/index.astro build pages (a change to which pages those build belongs here too): entries of the node-based collections (offering, hub, page,
// whitepaper) for their node once their locale has interface copy, every listing, contact and
// utility node and the home page in each locale with interface copy. Links read this through
// localeHref() (src/lib/ia/navigation.ts), so a link never points at an en or vi page that was not
// built (ADR 0002「缺翻譯的頁面」).
import { getCollection } from 'astro:content';
import { entryLocale, isPublished } from '../content/entries';
import { LOCALES, type Locale } from '../i18n/locales';
import { hasStrings } from '../../data/strings';
import { nodes } from './nodes';
import { UTILITY_ELSEWHERE } from './utility';

// Built from nodes.csv alone in every locale with interface copy. The utility pages built elsewhere
// are the zh-TW-only 404 and the per-offering download pages
const NODE_TEMPLATES = new Set(['home', 'listing', 'contact', 'utility']);
const elsewhere: readonly string[] = UTILITY_ELSEWHERE;
const SELF_BUILT = nodes.filter((n) => NODE_TEMPLATES.has(n.template) && !elsewhere.includes(n.id)).map((n) => n.id);

// page entries build a page of their own only on content nodes; the contact page is in SELF_BUILT
const entries = (
  await Promise.all([
    getCollection('offering'),
    getCollection('hub'),
    getCollection('page', (e) => nodes.find((n) => n.id === e.data.node)?.template === 'content'),
    getCollection('whitepaper'),
  ])
).flat();

export const builtNodes: ReadonlyMap<Locale, ReadonlySet<string>> = new Map(
  LOCALES.map((locale) => [
    locale,
    new Set(
      hasStrings(locale)
        ? [...SELF_BUILT, ...entries.filter((e) => entryLocale(e.id) === locale && isPublished(e)).map((e) => e.data.node)]
        : [],
    ),
  ]),
);
