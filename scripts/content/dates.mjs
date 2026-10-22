// Checks unquoted date values in Markdown frontmatter. YAML turns an unquoted 2026-02-30 into 2026-03-02
// and an unquoted datetime into a Date before the content schema runs, so src/content.config.ts runs this
// on the raw file: unquoted date-like values must be existing YYYY-MM-DD dates.

const UNQUOTED_DATE = /^\s*(?:-\s+)?(?:[\w-]+:\s+)?(\d{4}-\d{1,2}-\d{1,2}(?:[Tt ][^\s#]\S*)?)\s*(?:#.*)?$/;

export function unquotedDateErrors(source) {
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
  return frontmatter.split(/\r?\n/).flatMap((line) => {
    const value = line.match(UNQUOTED_DATE)?.[1];
    if (value === undefined) return [];
    const parsed = new Date(value);
    const valid = /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
    return valid ? [] : [`"${value}" is not an existing YYYY-MM-DD date`];
  });
}
