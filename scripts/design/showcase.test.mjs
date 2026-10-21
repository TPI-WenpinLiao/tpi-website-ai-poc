// Tests for scripts/design/showcase.mjs. Run: npm run test:scripts

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { missingComponents, internalNodes } from './showcase.mjs';
import { groupTokens } from './token-groups.mjs';
import { parseTokens } from './contrast.mjs';

const PAGE = `---
import Button from '../../components/ui/Button.astro';
import Card from "../../components/ui/Card.astro";
import Other from '../../components/wireframe/Tag.astro';
// import Tag from '../../components/ui/Tag.astro' is only mentioned in prose below
---
<p>Tag.astro</p>
`;

test('reports components the showcase page does not import', () => {
  assert.deepEqual(missingComponents(['Button.astro', 'Card.astro', 'Tag.astro'], PAGE.replace("// import Tag from '../../components/ui/Tag.astro'", '')), ['Tag.astro']);
});

test('imports from other folders do not count', () => {
  assert.deepEqual(missingComponents(['Tag.astro'], "import Tag from '../../components/wireframe/Tag.astro';"), ['Tag.astro']);
});

test('passes when every component is imported', () => {
  assert.deepEqual(missingComponents(['Button.astro', 'Card.astro'], PAGE), []);
});

test('groups tokens by prefix and by name with its "-" extensions, first match wins', () => {
  const groups = [
    { id: 'a', title: 'A', layer: 'scale', kind: 'length', patterns: ['--space-'] },
    { id: 'b', title: 'B', layer: 'semantic', kind: 'color', patterns: ['--color-text'], kinds: { '--color-text-muted': 'value' } },
  ];
  const r = groupTokens(['--space-1', '--color-text', '--color-text-muted', '--color-textual', '--wf-space-1'], groups);
  assert.deepEqual(r.groups.map((g) => g.tokens), [
    [{ name: '--space-1', kind: 'length' }],
    [
      { name: '--color-text', kind: 'color' },
      { name: '--color-text-muted', kind: 'value' },
    ],
  ]);
  assert.deepEqual(r.ungrouped, ['--color-textual']);
  assert.deepEqual(r.unused, []);
});

test('reports patterns that match no token, including ones shadowed by an earlier group', () => {
  const groups = [
    { id: 'a', title: 'A', layer: 'scale', kind: 'length', patterns: ['--space-'] },
    { id: 'b', title: 'B', layer: 'scale', kind: 'length', patterns: ['--space-1', '--radius-'] },
  ];
  assert.deepEqual(groupTokens(['--space-1'], groups).unused, ['b: --space-1', 'b: --radius-']);
});

test('every token in tokens.css is grouped', () => {
  const css = readFileSync(new URL('../../src/styles/tokens.css', import.meta.url), 'utf8');
  const r = groupTokens([...parseTokens(css).keys()]);
  assert.deepEqual([r.ungrouped, r.unused, r.mixed], [[], [], []]);
});

test('reports groups that mix value tokens with specimen kinds', () => {
  const groups = [
    { id: 'a', title: 'A', layer: 'scale', kind: 'length', patterns: ['--space-'], kinds: { '--space-max': 'value' } },
    { id: 'b', title: 'B', layer: 'scale', kind: 'value', patterns: ['--z-'] },
  ];
  assert.deepEqual(groupTokens(['--space-1', '--space-max', '--z-1'], groups).mixed, ['a']);
});

test('flags IA nodes at or below an internal page, not paths that only share the prefix', () => {
  const nodes = [
    { id: 'home', path: '/' },
    { id: 'ds', path: '/design-system' },
    { id: 'wf', path: '/wireframes/home' },
    { id: 'other', path: '/design-systems-guide' },
  ];
  assert.deepEqual(internalNodes(nodes).map((n) => n.id), ['ds', 'wf']);
});
