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

// Parse a CSV and keep only `columns`, failing the build when one is missing
export function readRows<K extends string>(text: string, file: string, columns: readonly K[]): Record<K, string>[] {
  return parseCsv(text.replace(/^﻿/, '')).map((row: Record<string, unknown>, i: number) =>
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

// Node ids matching `pick`, as a non-empty tuple for z.enum(); an empty result means nodes.csv changed
// in a way the content schema does not expect, so fail the build instead of accepting nothing.
export function nodeIds(pick: (n: IaNode) => boolean, label: string): [string, ...string[]] {
  const [first, ...rest] = nodes.filter(pick).map((n) => n.id);
  if (first === undefined) throw new Error(`nodes.csv has no ${label} nodes`);
  return [first, ...rest];
}
