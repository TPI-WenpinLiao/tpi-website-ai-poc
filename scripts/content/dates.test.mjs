// Tests for scripts/content/dates.mjs. Run: npm run test:scripts

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { unquotedDateErrors } from './dates.mjs';

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
