// Sitemap rules in src/lib/seo/indexing.ts.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { parseCsv } from '../inventory/csv.mjs';
import { FLOW_PATHS, inSitemap } from '../../src/lib/seo/indexing.ts';

const nodePaths = new Set(parseCsv(readFileSync(new URL('../../docs/ia/nodes.csv', import.meta.url), 'utf8').replace(/^﻿/, '')).map((n) => n.path));

test('every flow page left out of the sitemap is a nodes.csv path', () => {
  for (const path of FLOW_PATHS) assert.ok(nodePaths.has(path), `${path} is not a path in docs/ia/nodes.csv`);
});

test('flow pages, in every locale, and internal pages are left out; other pages stay', () => {
  assert.equal(inSitemap('/thanks'), false);
  assert.equal(inSitemap('/en/search'), false);
  assert.equal(inSitemap('/templates/hub'), false);
  assert.equal(inSitemap('/subscribe'), true);
  assert.equal(inSitemap('/blog'), true);
});
