// Navigation read from docs/ia/navigation.csv (the single source of the navigation, see
// docs/ia/navigation.md), with nodes from nodes.ts. Links go to the node's path; the M3-01
// wireframes (src/lib/wireframe/ia.ts) map them to wireframe pages instead.
import navCsv from '../../../docs/ia/navigation.csv?raw';
import { nodes, readRows, type IaNode } from './nodes';

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

// A node's own page; external entries (e.g. /tpu) keep their path
export const pageHref: NavHref = (n) => n.path || undefined;

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

// Breadcrumb trail from home to `id`; group nodes have no page and are skipped
export function breadcrumb(id: string): IaNode[] {
  const trail: IaNode[] = [];
  for (let cur = byId.get(id); cur; cur = byId.get(cur.parent)) if (cur.kind !== 'group') trail.unshift(cur);
  return trail;
}

export const children = (id: string) => nodes.filter((n) => n.parent === id && n.kind !== 'asset');
