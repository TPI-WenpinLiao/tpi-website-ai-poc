// IA nodes read from docs/ia/nodes.csv, the single source of the page hierarchy (CLAUDE.md "IA 與 URL").
import { parseCsv } from '../../../scripts/inventory/csv.mjs';
import nodesCsv from '../../../docs/ia/nodes.csv?raw';

export interface IaNode {
  id: string;
  parent: string;
  title: string;
  template: string;
  kind: string;
  path: string;
  note: string;
}

const COLUMNS = ['id', 'parent', 'title', 'template', 'kind', 'path', 'note'] as const;

export const nodes: IaNode[] = parseCsv(nodesCsv.replace(/^﻿/, '')).map((row: Record<string, unknown>, i: number) =>
  Object.fromEntries(
    COLUMNS.map((c) => {
      const v = row[c];
      if (typeof v !== 'string') throw new Error(`nodes.csv row ${i + 2}: missing column ${c}`);
      return [c, v];
    }),
  ) as Record<(typeof COLUMNS)[number], string>,
);

// Node ids matching `pick`, as a non-empty tuple for z.enum(); an empty result means nodes.csv changed
// in a way the content schema does not expect, so fail the build instead of accepting nothing.
export function nodeIds(pick: (n: IaNode) => boolean, label: string): [string, ...string[]] {
  const [first, ...rest] = nodes.filter(pick).map((n) => n.id);
  if (first === undefined) throw new Error(`nodes.csv has no ${label} nodes`);
  return [first, ...rest];
}
