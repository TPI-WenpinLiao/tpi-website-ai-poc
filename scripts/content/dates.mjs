// Checks unquoted date values in Markdown frontmatter. YAML turns an unquoted 2026-02-30 into 2026-03-02
// and an unquoted datetime into a Date before the content schema runs, so src/content.config.ts runs this
// on the raw file: unquoted date-like values must be existing YYYY-MM-DD dates.
import { parseDocument, visit } from 'yaml';

// What YAML 1.1 (Astro's frontmatter parser) reads as a timestamp
const TIMESTAMP = /^\d{4}-\d{1,2}-\d{1,2}(?:(?:[Tt]|[ \t]+)\d{1,2}:\d{2}:\d{2}(?:\.\d*)?(?:[ \t]*(?:Z|[-+]\d{1,2}(?::\d{2})?))?)?$/;

export function unquotedDateErrors(source) {
  const frontmatter = source.replace(/^﻿/, '').match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1];
  if (frontmatter === undefined) return [];
  const errors = [];
  // Walk the parsed scalars rather than lines: keys may be quoted, values may carry anchors or tags, and
  // block scalars (|, >) are text even when a line looks like a date. `source` is the text as written.
  visit(parseDocument(frontmatter), {
    Scalar(key, node) {
      if (key === 'key' || node.type !== 'PLAIN' || typeof node.source !== 'string') return;
      const value = node.source.trim();
      if (!TIMESTAMP.test(value)) return;
      const parsed = new Date(value);
      const valid = /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
      if (!valid) errors.push(`"${value}" is not an existing YYYY-MM-DD date`);
    },
  });
  return errors;
}
