// Navigation read from docs/ia/navigation.csv (the single source of the navigation, see
// docs/ia/navigation.md), with nodes from nodes.ts. Links go to the node's page (`href`, in the
// page's locale for the header and footer). Names are in the page's locale: zh-TW from nodes.csv and
// navigation.csv, en and vi from docs/i18n/glossary.csv (src/lib/i18n/glossary.ts).
import navCsv from '../../../docs/ia/navigation.csv?raw';
import { nodes, readRows, type IaNode } from './nodes';
import { DEFAULT_LOCALE, type Locale } from '../i18n/locales';
import { localizePath, stripLocale } from '../i18n/paths';
import { hasNodeTitle, navLabel, nodeTitle } from '../i18n/glossary';

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

const titled = (n: IaNode, locale: Locale): IaNode => (locale === DEFAULT_LOCALE ? n : { ...n, title: nodeTitle(n.id, n.title, locale) });

// Node `id`, titled in `locale`
export function node(id: string, locale: Locale = DEFAULT_LOCALE): IaNode {
  const n = byId.get(id);
  if (!n) throw new Error(`unknown node: ${id}`);
  return titled(n, locale);
}

// A navigation.csv label in `locale`: its own glossary row, or the row of the node it names
// (a label that is some node's title has no row of its own, docs/i18n/glossary.md「分類」)
function label(text: string, locale: Locale): string {
  const named = nodes.find((n) => n.title === text);
  return named ? titled(named, locale).title : navLabel(text, locale);
}

// A node's own page in `locale` (ADR 0002); external entries (e.g. /tpu) keep their path
export const localeHref =
  (locale: Locale): NavHref =>
  (n) =>
    !n.path ? undefined : n.kind === 'external' ? n.path : localizePath(n.path, locale);

export const pageHref = localeHref(DEFAULT_LOCALE);

// Whether a page in `locale` may link to node n's page. zh-TW links every node, built or not yet
// (pages still to be made are tracked as issues); en and vi only link pages built in that locale,
// since an untranslated page is never built (ADR 0002), and external sub-sites (zh-TW apps such as
// /tpu) once the glossary names them in that locale. `built`: src/lib/content/pages.ts builtPaths()
// Takes the node untitled, so a page that can't be linked never needs a name in `locale`.
export const linkable =
  (locale: Locale, built: ReadonlySet<string>) =>
  (n: IaNode): boolean => {
    if (locale === DEFAULT_LOCALE) return true;
    if (n.kind === 'external') return hasNodeTitle(n.id, locale);
    const href = localeHref(locale)(n);
    return href !== undefined && built.has(href);
  };

// The URL of node `id`'s page in `locale`
export function nodeHref(id: string, locale: Locale): string {
  const href = localeHref(locale)(node(id));
  if (!href) throw new Error(`node ${id} has no page`);
  return href;
}

// With `built` (the URL paths of the built pages), an entry whose page can't be linked from `locale`
// (linkable) keeps its label without a link while entries under it are left, and is left out
// otherwise; so is a label whose entries are all left out
export function navTree(area: string, { locale = DEFAULT_LOCALE, built }: { locale?: Locale; built?: ReadonlySet<string> } = {}): NavItem[] {
  const rows = navRows.filter((r) => r.area === area);
  const href = localeHref(locale);
  const canLink = built ? linkable(locale, built) : () => true;
  const build = (parent: string): NavItem[] =>
    rows
      .filter((r) => r.parent === parent)
      .flatMap((r) => {
        const n = r.node ? node(r.node) : undefined;
        const key = r.node || r.label;
        const to = n && canLink(n) ? href(n) : undefined;
        const items = build(key);
        const hasEntries = rows.some((c) => c.parent === key);
        if (!to && (hasEntries ? !items.length : n?.path)) return [];
        const text = r.label ? label(r.label, locale) : n ? titled(n, locale).title : key;
        return [{ key, label: text, href: to, external: n?.kind === 'external', note: r.note, children: items }];
      });
  return build('');
}

export const utility = navTree('utility');
export const header = navTree('header');
export const footer = navTree('footer');
export const footerBottom = navTree('footer-bottom');

// The same trees in `locale`, for the header and footer of a page in that locale; only entries whose
// page is built in that locale (`built`, src/lib/content/pages.ts builtPaths())
export const localizedNav = (area: 'header' | 'footer' | 'footer-bottom', locale: Locale, built: ReadonlySet<string>) => navTree(area, { locale, built });

// Breadcrumb trail from home to `id`, titled in `locale`; group nodes have no page and are skipped
export function breadcrumb(id: string, locale: Locale = DEFAULT_LOCALE): IaNode[] {
  const trail: IaNode[] = [];
  for (let cur = byId.get(id); cur; cur = byId.get(cur.parent)) if (cur.kind !== 'group') trail.unshift(titled(cur, locale));
  return trail;
}

// Trail of a collection entry's page (blog post, news item, …): the collection node's trail with
// the entry in place of the node itself, at the entry's own path
export function entryTrail(id: string, current: { title: string; path: string }, locale: Locale = DEFAULT_LOCALE): IaNode[] {
  const trail = breadcrumb(id, locale);
  const last = trail.at(-1);
  if (last?.id !== id) throw new Error(`node ${id} is not in its own trail`);
  return [...trail.slice(0, -1), { ...last, title: current.title, path: stripLocale(current.path) }];
}

// Child nodes of `id`, titled in `locale`; `keep` picks them before they are titled (linkable), so a
// child left out needs no name in that locale
export const children = (id: string, locale: Locale = DEFAULT_LOCALE, keep: (n: IaNode) => boolean = () => true) =>
  nodes.filter((n) => n.parent === id && n.kind !== 'asset' && keep(n)).map((n) => titled(n, locale));
