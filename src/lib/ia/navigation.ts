// Navigation read from docs/ia/navigation.csv (the single source of the navigation, see
// docs/ia/navigation.md), with nodes from nodes.ts. Links go to the node's page (`href`, in the
// page's locale for the header and footer).
import navCsv from '../../../docs/ia/navigation.csv?raw';
import { nodes, readRows, type IaNode } from './nodes';
import { DEFAULT_LOCALE, type Locale } from '../i18n/locales';
import { localizePath, stripLocale } from '../i18n/paths';

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

export function node(id: string): IaNode {
  const n = byId.get(id);
  if (!n) throw new Error(`unknown node: ${id}`);
  return n;
}

// A node's own page in `locale` (ADR 0002); external entries (e.g. /tpu) keep their path
export const localeHref =
  (locale: Locale): NavHref =>
  (n) =>
    !n.path ? undefined : n.kind === 'external' ? n.path : localizePath(n.path, locale);

export const pageHref = localeHref(DEFAULT_LOCALE);

// The URL of node `id`'s page in `locale`
export function nodeHref(id: string, locale: Locale): string {
  const href = localeHref(locale)(node(id));
  if (!href) throw new Error(`node ${id} has no page`);
  return href;
}

export function navTree(area: string, href: NavHref = pageHref): NavItem[] {
  const rows = navRows.filter((r) => r.area === area);
  const build = (parent: string): NavItem[] =>
    rows
      .filter((r) => r.parent === parent)
      .map((r) => {
        const n = r.node ? node(r.node) : undefined;
        const key = r.node || r.label;
        return {
          key,
          label: r.label || n?.title || key,
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
export const localizedNav = (area: 'header' | 'footer' | 'footer-bottom', locale: Locale) => navTree(area, localeHref(locale));

// Breadcrumb trail from home to `id`; group nodes have no page and are skipped
export function breadcrumb(id: string): IaNode[] {
  const trail: IaNode[] = [];
  for (let cur = byId.get(id); cur; cur = byId.get(cur.parent)) if (cur.kind !== 'group') trail.unshift(cur);
  return trail;
}

// Trail of a collection entry's page (blog post, news item, …): the collection node's trail with
// the entry in place of the node itself, at the entry's own path
export function entryTrail(id: string, current: { title: string; path: string }): IaNode[] {
  const trail = breadcrumb(id);
  const last = trail.at(-1);
  if (last?.id !== id) throw new Error(`node ${id} is not in its own trail`);
  return [...trail.slice(0, -1), { ...last, title: current.title, path: stripLocale(current.path) }];
}

export const children = (id: string) => nodes.filter((n) => n.parent === id && n.kind !== 'asset');
