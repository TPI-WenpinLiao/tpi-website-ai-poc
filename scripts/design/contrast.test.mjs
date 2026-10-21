// Tests for scripts/design/contrast.mjs. Run: npm run test:scripts

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseTokens, resolveColor, contrastRatio, checkPairs } from './contrast.mjs';

const CSS = `
/* --ignored: #000; */
:root {
  --white: #fff;
  --ink: #1b1a1f;
  --orange: #ff6329;
  --color-text: var(--ink);
  --color-bg: var(--white);
  --color-accent: var(--orange);
  --shadow: 0 1px 2px rgb(0 0 0 / 0.1);
  --loop-a: var(--loop-b);
  --loop-b: var(--loop-a);
}
@media (prefers-reduced-motion: reduce) { :root { --color-bg: #000; } }
`;
const tokens = parseTokens(CSS);

test('parseTokens reads only the first :root block and skips comments', () => {
  assert.equal(tokens.get('--color-bg'), 'var(--white)');
  assert.equal(tokens.has('--ignored'), false);
});

test('resolveColor follows var() chains and normalizes case', () => {
  assert.equal(resolveColor(tokens, '--color-text'), '#1b1a1f');
  assert.equal(resolveColor(new Map([['--a', '#ABCDEF']]), '--a'), '#abcdef');
});

test('resolveColor rejects undefined, non-hex and circular tokens', () => {
  assert.throws(() => resolveColor(tokens, '--missing'), /not defined/);
  assert.throws(() => resolveColor(tokens, '--shadow'), /not a hex color/);
  assert.throws(() => resolveColor(tokens, '--loop-a'), /circular/);
});

test('contrastRatio matches WCAG reference values', () => {
  assert.equal(contrastRatio('#000000', '#ffffff').toFixed(2), '21.00');
  assert.equal(contrastRatio('#fff', '#fff').toFixed(2), '1.00');
  // #767676 is the lightest grey that passes 4.5:1 on white
  assert.equal(contrastRatio('#767676', '#ffffff').toFixed(2), '4.54');
});

test('checkPairs flags pairs below their minimum', () => {
  const [text, accent] = checkPairs(tokens, [
    { fg: '--color-text', bg: '--color-bg', min: 4.5 },
    { fg: '--color-accent', bg: '--color-bg', min: 4.5 },
  ]);
  assert.equal(text.ok, true);
  assert.equal(accent.ok, false);
  assert.equal(accent.ratio.toFixed(2), '2.97');
});
