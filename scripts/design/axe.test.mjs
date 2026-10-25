// Tests for scripts/design/axe.mjs. Run: npm run test:scripts

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { groupByRule, report } from './axe.mjs';

const violation = (id, impact, targets) => ({
  id,
  impact,
  help: `${id} help`,
  helpUrl: `https://dequeuniversity.com/rules/axe/4.14/${id}`,
  nodes: targets.map((t) => ({ target: [t], failureSummary: `Fix ${id}` })),
});

test('groups violations by rule, most severe first, then by how many pages', () => {
  const rules = groupByRule([
    { path: '/a', violations: [violation('region', 'moderate', ['div']), violation('link-name', 'serious', ['a.x', 'a.y'])] },
    { path: '/b', violations: [violation('region', 'moderate', ['main']), violation('image-alt', 'critical', ['img'])] },
    { path: '/c', violations: [violation('link-name', 'serious', ['a.z'])] },
  ]);
  assert.deepEqual(
    rules.map((r) => [r.id, r.pages.map((p) => p.path), r.elements]),
    [
      ['image-alt', ['/b'], 1],
      ['link-name', ['/a', '/c'], 3],
      ['region', ['/a', '/b'], 2],
    ],
  );
});

test('the report names the rule, its help page, counts and the first pages with a selector', () => {
  const results = Array.from({ length: 7 }, (_, i) => ({ path: `/p${i}`, violations: [violation('image-alt', 'critical', ['img.hero'])] }));
  assert.deepEqual(report(groupByRule(results)), [
    'image-alt (critical): image-alt help',
    '  https://dequeuniversity.com/rules/axe/4.14/image-alt',
    '  7 page(s), 7 element(s)',
    '    /p0  img.hero',
    '    /p1  img.hero',
    '    /p2  img.hero',
    '    /p3  img.hero',
    '    /p4  img.hero',
    '    … 2 more page(s)',
    '  | Fix image-alt',
  ]);
});

test('no violations, no report', () => {
  assert.deepEqual(report(groupByRule([{ path: '/', violations: [] }])), []);
});
