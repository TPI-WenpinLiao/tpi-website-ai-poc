// Navigation read from docs/ia/navigation.csv (the single source of the navigation, see
// docs/ia/navigation.md), with nodes from nodes.ts. Links go to the node's page (`href`, in the
// page's locale for the header and footer). Names are the nodes.csv titles and navigation.csv
// labels in zh-TW, and their docs/i18n/glossary.csv rows in en and vi (navigation.md「語系」).
import navCsv from '../../../docs/ia/navigation.csv?raw';
import glossaryCsv from '../../../docs/i18n/glossary.csv?raw';
import { nodes, readRows, type IaNode } from './nodes';
import { DEFAULT_LOCALE, type Locale } from '../i18n/locales';
import { localizePath, stripLocale } from '../i18n/paths';
import { builtNodes } from './built';

export interface NavItem {
  key: string;
  label: string;
  href?: string;
  external: boolean;
  note: string;
  children: NavItem[];
}

export type NavHref = (n: IaNode) => string | undefined;

const byId = new Map(nodes.map((n) => [n.id, n]));
const navRows = readRows(navCsv, 'navigation.csv', ['area', 'parent', 'node', 'label', 'note']);
const glossary = new Map(readRows(glossaryCsv, 'glossary.csv', ['id', 'en', 'vi']).map((r) => [r.id, r]));

// A glossary row's name in a locale other than zh-TW. A missing or empty one fails the build of the
// page that shows it: no zh-TW text on an en or vi page
function translated(id: string, locale: Exclude<Locale, typeof DEFAULT_LOCALE>): string {
  const name = glossary.get(id)?.[locale];
  if (!name) throw new Error(`docs/i18n/glossary.csv has no ${locale} name for ${id} (docs/ia/navigation.md「語系」)`);
  return name;
}

// Group and asset nodes show no name of their own, so glossary.csv has no rows for them
const unnamed = (n: IaNode) => n.kind === 'group' || n.kind === 'asset';

// `n` with its name in `locale`
export const named = (n: IaNode, locale: Locale): IaNode =>
  locale === DEFAULT_LOCALE || unnamed(n) ? n : { ...n, title: translated(`node:${n.id}`, locale) };

// Node `id` with its name in `locale`, for pages that show the name
export const localNode = (id: string, locale: Locale) => named(node(id), locale);

// A navigation.csv label in `locale`; a label that is also a node title shares that node's row
// (glossary.md「分類」)
function labelIn(label: string, locale: Locale): string {
  if (locale === DEFAULT_LOCALE) return label;
  if (glossary.has(`nav:${label}`)) return translated(`nav:${label}`, locale);
  const n = nodes.find((x) => x.title === label);
  if (!n) throw new Error(`docs/i18n/glossary.csv has no row for the navigation.csv label ${label}`);
  return named(n, locale).title;
}

export function node(id: string): IaNode {
  const n = byId.get(id);
  if (!n) throw new Error(`unknown node: ${id}`);
  return n;
}

// A node's own page in `locale` (ADR 0002), or its zh-TW page while `locale` has none (an untranslated
// page, such as the vi legal pages); external entries (e.g. /tpu) keep their path
export const localeHref =
  (locale: Locale): NavHref =>
  (n) =>
    !n.path
      ? undefined
      : n.kind === 'external'
        ? n.path
        : localizePath(n.path, builtNodes.get(locale)?.has(n.id) ? locale : DEFAULT_LOCALE);

export const pageHref = localeHref(DEFAULT_LOCALE);

// The URL of node `id`'s page in `locale`
export function nodeHref(id: string, locale: Locale): string {
  const href = localeHref(locale)(node(id));
  if (!href) throw new Error(`node ${id} has no page`);
  return href;
}

export function navTree(area: string, locale: Locale = DEFAULT_LOCALE, href: NavHref = localeHref(locale)): NavItem[] {
  const rows = navRows.filter((r) => r.area === area);
  const build = (parent: string): NavItem[] =>
    rows
      .filter((r) => r.parent === parent)
      .map((r) => {
        const n = r.node ? node(r.node) : undefined;
        const key = r.node || r.label;
        return {
          key,
          label: r.label ? labelIn(r.label, locale) : n ? named(n, locale).title : key,
          href: n ? href(n) : undefined,
          external: n?.kind === 'external',
          note: r.note,
          children: build(key),
        };
      });
  return build('');
}

export const utility = navTree('utility');
export const header = navTree('header');
export const footer = navTree('footer');
export const footerBottom = navTree('footer-bottom');

// The same trees with links into `locale`, for the header and footer of a page in that locale
export const localizedNav = (area: 'header' | 'footer' | 'footer-bottom', locale: Locale) => navTree(area, locale);

// A breadcrumb item: the node named in the page's locale and the URL it links to (localeHref), the
// same for the visible Breadcrumb and the BreadcrumbList JSON-LD
export interface TrailNode extends IaNode {
  href: string | undefined;
}

// Breadcrumb trail from home to `id` for a page in `locale`; group nodes have no page and are skipped
export function breadcrumb(id: string, locale: Locale): TrailNode[] {
  const trail: IaNode[] = [];
  for (let cur = byId.get(id); cur; cur = byId.get(cur.parent)) if (cur.kind !== 'group') trail.unshift(cur);
  return trail.map((n) => ({ ...named(n, locale), href: localeHref(locale)(n) }));
}

// Trail of a collection entry's page (blog post, news item, …): the collection node's trail with
// the entry in place of the node itself, at the entry's own path
export function entryTrail(id: string, current: { title: string; path: string }, locale: Locale): TrailNode[] {
  const path = stripLocale(current.path);
  return [...breadcrumb(node(id).parent, locale), { ...node(id), title: current.title, path, href: localizePath(path, locale) }];
}

// Child nodes of `id`, named in `locale`
export const children = (id: string, locale: Locale) => nodes.filter((n) => n.parent === id && n.kind !== 'asset').map((n) => named(n, locale));
