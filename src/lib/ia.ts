// IA data read from docs/ia at build time, so pages and menus never drift from nodes.csv and
// navigation.csv (the single source of the navigation, see docs/ia/navigation.md). Links go to the
// node's path; the M3-01 wireframes (src/lib/wireframe/ia.ts) map them to wireframe pages instead.
import { parseCsv } from '../../scripts/inventory/csv.mjs';
import navCsv from '../../docs/ia/navigation.csv?raw';
import nodesCsv from '../../docs/ia/nodes.csv?raw';

export interface IaNode {
  id: string;
  parent: string;
  title: string;
  template: string;
  kind: string;
  path: string;
  note: string;
}

export interface NavItem {
  key: string;
  label: string;
  href?: string;
  external: boolean;
  note: string;
  children: NavItem[];
}

export type NavHref = (n: IaNode) => string | undefined;

// Parse a CSV and keep only `columns`, failing the build when one is missing
export function readRows<K extends string>(text: string, file: string, columns: readonly K[]): Record<K, string>[] {
  return parseCsv(text.replace(/^﻿/, '')).map((row, i) =>
    Object.fromEntries(
      columns.map((c) => {
        const v = row[c];
        if (typeof v !== 'string') throw new Error(`${file} row ${i + 2}: missing column ${c}`);
        return [c, v];
      }),
    ) as Record<K, string>,
  );
}

export const nodes: IaNode[] = readRows(nodesCsv, 'nodes.csv', ['id', 'parent', 'title', 'template', 'kind', 'path', 'note']);
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
