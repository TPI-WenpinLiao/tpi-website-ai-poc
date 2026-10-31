// The fact library (docs/strategy/facts.yaml, #163). Copy is a fact or wording: a fact (number,
// client, certification, award, feature, case result, company data) comes from the library through
// fact('<id>'), wording is written as a plain string (CLAUDE.md「內容規則」).
// `node scripts/strategy/facts.mjs` checks the library with this schema and fails when a data file's
// copy has a number or client name that none of the facts it uses has.

import { readFileSync } from 'node:fs';
import { z } from 'astro/zod';
import { parse } from 'yaml';
import { LOCALES } from '../lib/i18n/locales.ts';

export const FACTS_FILE = 'docs/strategy/facts.yaml';
export const FACT_TYPES = ['metric', 'client', 'certification', 'award', 'feature', 'case', 'company'] as const;

const nonEmpty = z.string().trim().min(1);

export const factSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'lowercase letters, digits and -'),
    type: z.enum(FACT_TYPES),
    text: nonEmpty,
    source: z.object({ url: z.url({ protocol: /^https$/ }), quote: nonEmpty }).strict(),
    locale: z.enum(LOCALES),
    status: z.enum(['confirmed', 'to_confirm']),
    // Why a fact is to_confirm (license, possibly outdated, locales disagree), or any other remark
    note: nonEmpty.optional(),
  })
  .strict()
  .refine((f) => f.status !== 'to_confirm' || f.note, { path: ['note'], message: 'a to_confirm fact needs a note saying why' });

export type Fact = z.infer<typeof factSchema>;

export const factsSchema = z.array(factSchema).superRefine((facts, ctx) => {
  const seen = new Set<string>();
  facts.forEach((f, i) => {
    if (seen.has(f.id)) ctx.addIssue({ code: 'custom', path: [i, 'id'], message: `duplicate id ${f.id}` });
    seen.add(f.id);
  });
});

// Read once per process; paths are relative to the repository root, like content.config.ts
let cache: Map<string, Fact> | undefined;
function library(): Map<string, Fact> {
  cache ??= new Map(factsSchema.parse(parse(readFileSync(FACTS_FILE, 'utf8'))).map((f) => [f.id, f]));
  return cache;
}

// The text of a confirmed fact; an unknown or unconfirmed id fails the build
export function fact(id: string): string {
  const f = library().get(id);
  if (!f) throw new Error(`fact('${id}') is not in ${FACTS_FILE}`);
  if (f.status !== 'confirmed') throw new Error(`fact('${id}') is ${f.status}; pages only use confirmed facts`);
  return f.text;
}
