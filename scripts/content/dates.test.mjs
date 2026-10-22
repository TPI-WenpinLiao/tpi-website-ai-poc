// Tests for scripts/content/dates.mjs. Run: npm run test:scripts

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FRONTMATTER, unquotedDateErrors } from './dates.mjs';

const md = (frontmatter) => `---\n${frontmatter}\n---\n\nBody 2026-02-30\n`;

test('accepts existing dates, quoted values and non-date fields', () => {
  assert.deepEqual(unquotedDateErrors(md('publishedAt: 2026-10-20\nmigratedAt: 2026-10-21 # note\nupdatedAt: "2026-02-30"\ntitle: 2026 年報\ntranslationKey: "585"')), []);
});

test('reports dates YAML would roll over and unquoted datetimes', () => {
  assert.deepEqual(unquotedDateErrors(md('publishedAt: 2026-02-30\nmigratedAt: 2026-13-45 # typo\nupdatedAt: 2026-10-20T00:00:00Z\nsourceUpdatedAt: 2026-10-20 10:00:00')), [
    '"2026-02-30" is not an existing YYYY-MM-DD date',
    '"2026-13-45" is not an existing YYYY-MM-DD date',
    '"2026-10-20T00:00:00Z" is not an existing YYYY-MM-DD date',
    '"2026-10-20 10:00:00" is not an existing YYYY-MM-DD date',
  ]);
});

test('checks nested keys and list items, ignores the body', () => {
  assert.deepEqual(unquotedDateErrors(md('client:\n  since: 2026-2-1\ndates:\n  - 2026-04-31')), [
    '"2026-2-1" is not an existing YYYY-MM-DD date',
    '"2026-04-31" is not an existing YYYY-MM-DD date',
  ]);
});

test('sees through quoted keys, anchors, tags and a BOM', () => {
  assert.deepEqual(unquotedDateErrors(`\uFEFF${md(`"a": 2026-02-30\n'b': 2026-02-31\nc: &d 2026-04-31\nd: !!timestamp 2026-06-31`)}`), [
    '"2026-02-30" is not an existing YYYY-MM-DD date',
    '"2026-02-31" is not an existing YYYY-MM-DD date',
    '"2026-04-31" is not an existing YYYY-MM-DD date',
    '"2026-06-31" is not an existing YYYY-MM-DD date',
  ]);
});

test('block scalars and flow lists: text stays text, dates are checked', () => {
  assert.deepEqual(unquotedDateErrors(md('challenge: |\n  2026-10-20 10:00\nsummary: >\n  2026-02-30\ndates: [2026-02-29, x]')), [
    '"2026-02-29" is not an existing YYYY-MM-DD date',
  ]);
});

test('finds frontmatter after leading blank lines and rejects TOML frontmatter', () => {
  assert.deepEqual(unquotedDateErrors(`\n\n${md('publishedAt: 2026-02-30')}`), ['"2026-02-30" is not an existing YYYY-MM-DD date']);
  assert.deepEqual(unquotedDateErrors('+++\npublishedAt = 2026-10-20T10:00:00Z\n+++\n'), ['frontmatter must be YAML between --- fences']);
});

test('FRONTMATTER finds the same block as Astro', async () => {
  // Astro's helper is a dependency of astro, not of this repo; a newer Astro that changes the regex fails here
  const { extractFrontmatter } = await import('@astrojs/internal-helpers/frontmatter');
  const samples = ['---\na: 1\n---\n', '\uFEFF---\na: 1\n---\n', '\n  \n---\na: 1\n---\n', '+++\na = 1\n+++\n', 'text\n---\na: 1\n---\n', 'no frontmatter'];
  for (const s of samples) assert.equal(FRONTMATTER.exec(s)?.[2], extractFrontmatter(s), JSON.stringify(s));
});
