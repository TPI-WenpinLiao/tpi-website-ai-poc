// Checks dates in Markdown frontmatter as written. YAML turns 2026-02-30 into 2026-03-02 and a datetime
// into a Date before the content schema runs, so src/content.config.ts runs this on the raw file: every
// value Astro reads as a date must be written as an existing YYYY-MM-DD.
import { extractFrontmatter } from '@astrojs/internal-helpers/frontmatter';
import { parseDocument, visit } from 'yaml';

// The options of Astro's parseYaml (@astrojs/internal-helpers yaml.js), so a value is checked exactly
// when Astro turns it into a Date; dates.test.mjs compares the two
export const YAML_OPTIONS = { customTags: ['timestamp'], merge: true, schema: 'core' };

export function frontmatterDateErrors(source) {
  const frontmatter = extractFrontmatter(source);
  if (frontmatter === undefined) return [];
  // Astro parses frontmatter between +++ fences as TOML, which has its own datetime type; content uses YAML.
  // trimStart() also drops a BOM.
  if (source.trimStart().startsWith('+++')) return ['frontmatter must be YAML between --- fences'];
  const errors = [];
  visit(parseDocument(frontmatter, YAML_OPTIONS), {
    Scalar(_key, node) {
      if (!(node.value instanceof Date)) return;
      const value = String(node.source).trim();
      const valid = /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(node.value.getTime()) && node.value.toISOString().slice(0, 10) === value;
      if (!valid) errors.push(`"${value}" is not an existing YYYY-MM-DD date`);
    },
  });
  return errors;
}
