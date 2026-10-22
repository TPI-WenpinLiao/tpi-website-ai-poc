// Tests for scripts/content/dates.mjs. Run: npm run test:scripts

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseYaml } from '@astrojs/internal-helpers/yaml';
import { parseDocument } from 'yaml';
import { YAML_OPTIONS, frontmatterDateErrors } from './dates.mjs';

const md = (frontmatter) => `---\n${frontmatter}\n---\n\nBody 2026-02-30\n`;
const bad = (value) => `"${value}" is not an existing YYYY-MM-DD date`;

test('accepts existing dates, quoted values and non-date fields', () => {
  assert.deepEqual(frontmatterDateErrors(md('publishedAt: 2026-10-20\nmigratedAt: 2026-10-21 # note\nupdatedAt: "2026-02-30"\ntitle: 2026 年報\ntranslationKey: "585"')), []);
});

test('reports dates YAML would roll over and datetimes', () => {
  assert.deepEqual(
    frontmatterDateErrors(md('publishedAt: 2026-02-30\nmigratedAt: 2026-13-45 # typo\nupdatedAt: 2026-10-20T00:00:00Z\nsourceUpdatedAt: 2026-10-20 10:00:00\nx: 2026-10-20T10:0:0')),
    [bad('2026-02-30'), bad('2026-13-45'), bad('2026-10-20T00:00:00Z'), bad('2026-10-20 10:00:00'), bad('2026-10-20T10:0:0')],
  );
});

test('checks nested keys, list items, quoted keys, anchors and !!timestamp tags', () => {
  assert.deepEqual(
    frontmatterDateErrors(md(`client:\n  since: 2026-2-1\ndates:\n  - 2026-04-31\n"a": 2026-02-30\nb: &d 2026-02-31\nc: !!timestamp "2026-06-31"`)),
    [bad('2026-2-1'), bad('2026-04-31'), bad('2026-02-30'), bad('2026-02-31'), bad('2026-06-31')],
  );
});

test('block scalars stay text, flow lists are checked', () => {
  assert.deepEqual(frontmatterDateErrors(md('challenge: |\n  2026-10-20 10:00\nsummary: >\n  2026-02-30\ndates: [2026-02-29, x]')), [bad('2026-02-29')]);
});

test('finds frontmatter after a BOM or blank lines and rejects TOML frontmatter', () => {
  assert.deepEqual(frontmatterDateErrors(`\uFEFF${md('publishedAt: 2026-02-30')}`), [bad('2026-02-30')]);
  assert.deepEqual(frontmatterDateErrors(`\n\n${md('publishedAt: 2026-02-30')}`), [bad('2026-02-30')]);
  assert.deepEqual(frontmatterDateErrors('+++\npublishedAt = 2026-10-20T10:00:00Z\n+++\n'), ['frontmatter must be YAML between --- fences']);
});

test('YAML_OPTIONS parse values the same way as Astro', () => {
  // A newer Astro that changes its YAML options fails here instead of silently letting dates through
  const samples = ['a: 2026-10-20', 'a: 2026-02-30', 'a: 2026-10-20T10:0:0', 'a: !!timestamp "2026-02-30"', 'a: "2026-10-20"', 'b: &x 1\nc: *x', 'base: &b {x: 1}\nd: {<<: *b, y: 2}'];
  for (const s of samples) assert.deepEqual(parseDocument(s, YAML_OPTIONS).toJS(), parseYaml(s), s);
});
