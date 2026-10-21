// Tests for scripts/design/contrast.mjs. Run: npm run test:scripts

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseTokens, parseSurfaces, parseColor, resolveColor, contrastRatio, checkPairs } from './contrast.mjs';

const CSS = `
/* --ignored: #000; */
:root {
  --white: #fff;
  --ink: #1b1a1f;
  --orange: #ff6329;
  --color-text: var(--ink);
  --color-bg: var(--white);
  --color-accent: var(--orange);
  --glass-bg: rgb(255 255 255 / 0.5);
  --scene-worst: #000000;
  --shadow: 0 1px 2px rgb(0 0 0 / 0.1);
  --loop-a: var(--loop-b);
  --loop-b: var(--loop-a);
}
[data-surface="dark"] {
  --color-text: var(--white);
  --color-bg: var(--ink);
}
@media (prefers-reduced-motion: reduce) { :root { --color-bg: #ff0000; } }
`;
const tokens = parseTokens(CSS);

test('parseTokens reads only the top-level block for the selector and skips comments', () => {
  assert.equal(tokens.get('--color-bg'), 'var(--white)');
  assert.equal(tokens.has('--ignored'), false);
  assert.equal(parseTokens(CSS, '[data-surface="dark"]').get('--color-bg'), 'var(--ink)');
  assert.throws(() => parseTokens(CSS, '.missing'), /no top-level/);
});

test('parseSurfaces lets the dark surface override :root and inherit the rest', () => {
  const [light, dark] = parseSurfaces(CSS);
  assert.equal(resolveColor(light.tokens, '--color-bg'), '#fff');
  assert.equal(resolveColor(dark.tokens, '--color-bg'), '#1b1a1f');
  assert.equal(resolveColor(dark.tokens, '--color-accent'), '#ff6329');
});

test('parseColor reads hex and rgb() with alpha', () => {
  assert.deepEqual(parseColor('#abc'), [170, 187, 204, 1]);
  assert.deepEqual(parseColor('rgb(18 15 29 / 0.85)'), [18, 15, 29, 0.85]);
  assert.throws(() => parseColor('red'), /not a hex or rgb/);
});

test('resolveColor follows var() chains and rejects undefined, non-color and circular tokens', () => {
  assert.equal(resolveColor(tokens, '--color-text'), '#1b1a1f');
  assert.throws(() => resolveColor(tokens, '--missing'), /not defined/);
  assert.throws(() => resolveColor(tokens, '--shadow'), /not a hex or rgb/);
  assert.throws(() => resolveColor(tokens, '--loop-a'), /circular/);
});

test('contrastRatio matches WCAG reference values', () => {
  assert.equal(contrastRatio('#000000', '#ffffff').toFixed(2), '21.00');
  // #767676 is the lightest grey that passes 4.5:1 on white
  assert.equal(contrastRatio('#767676', '#ffffff').toFixed(2), '4.54');
  assert.throws(() => contrastRatio('#000', 'rgb(0 0 0 / 0.5)'), /must be opaque/);
});

test('checkPairs flags failures and composites translucent backgrounds over the backdrop', () => {
  const [text, accent, glass] = checkPairs(tokens, [
    { fg: '--color-text', bg: '--color-bg', min: 4.5 },
    { fg: '--color-accent', bg: '--color-bg', min: 4.5 },
    { fg: '--color-text', bg: '--glass-bg', min: 4.5, over: '--scene-worst' },
  ]);
  assert.equal(text.ok, true);
  assert.equal(accent.ok, false);
  assert.equal(accent.ratio.toFixed(2), '2.97');
  // 50% white over black is #808080; #1b1a1f on it is about 4.7:1
  assert.equal(glass.ratio.toFixed(2), contrastRatio('#1b1a1f', '#808080').toFixed(2));
});
