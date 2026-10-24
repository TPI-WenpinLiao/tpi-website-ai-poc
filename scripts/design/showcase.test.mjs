// Tests for scripts/design/showcase.mjs. Run: npm run test:scripts

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { missingComponents, tableComponents, tableProblems, internalNodes } from './showcase.mjs';
import { groupTokens, tokenNames } from './token-groups.mjs';

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

const SKILL = `# Design system

## 基礎元件

| 元件 | 用途 | 重點 |
|---|---|---|
| \`Button\` | 動作 | 見 \`Card\` |

## 新增元件

| \`Tag\` | listed under another heading | |
`;

test('reads component rows only from the skill component table', () => {
  assert.deepEqual(tableComponents(SKILL), ['Button']);
});

test('fails when the skill has no component table', () => {
  assert.throws(() => tableComponents('# Design system\n'), /no "## 基礎元件" section/);
});

test('reports components without a row and rows without a component', () => {
  assert.deepEqual(tableProblems(['Button.astro', 'Card.astro'], ['Button', 'Badge']), { undocumented: ['Card.astro'], stale: ['Badge'] });
});

test('the design-system skill table matches src/components/ui', () => {
  const skill = readFileSync(new URL('../../.claude/skills/design-system/SKILL.md', import.meta.url), 'utf8');
  const dir = new URL('../../src/components/ui/', import.meta.url);
  const components = readdirSync(dir).filter((f) => f.endsWith('.astro'));
  assert.deepEqual(tableProblems(components, tableComponents(skill)), { undocumented: [], stale: [] });
});

test('groups tokens by prefix and by name with its "-" extensions, first match wins', () => {
  const groups = [
    { id: 'a', title: 'A', layer: 'scale', kind: 'length', patterns: ['--space-'] },
    { id: 'b', title: 'B', layer: 'semantic', kind: 'color', patterns: ['--color-text'], kinds: { '--color-text-muted': 'value' } },
  ];
  const r = groupTokens(['--space-1', '--color-text', '--color-text-muted', '--color-textual'], groups);
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
  const r = groupTokens(tokenNames(css));
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
    { id: 'tpl', path: '/templates/hub' },
    { id: 'other', path: '/design-systems-guide' },
  ];
  assert.deepEqual(internalNodes(nodes).map((n) => n.id), ['ds', 'tpl']);
});

test('token names include ones declared only on the dark surface', () => {
  const css = ':root { --space-1: 1px; }\n[data-surface="dark"] { --space-1: 2px; --glow-dark: none; }';
  assert.deepEqual(tokenNames(css), ['--space-1', '--glow-dark']);
});
