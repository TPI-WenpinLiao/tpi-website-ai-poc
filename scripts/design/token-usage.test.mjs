// Tests for scripts/design/token-usage.mjs. Run: npm run test:scripts

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findViolations, declaredProperties } from './token-usage.mjs';

const TOKENS = declaredProperties(':root { --color-text: #000; --space-1: 0.25rem; --space-2: 0.5rem; }');
const SOURCE = `---
const x = '#fff 12px'; // frontmatter is not CSS
---
<p style="color: #000">inline styles are out of scope</p>
<style>
  @import '../../styles/media.css';
  /* 16px in a comment is fine */
  .a {
    --local: 1;
    color: var(--color-text);
    padding: var(--space-2) 0;
    line-height: 1.5;
    flex: 1 1 0%;
    aspect-ratio: 16 / 9;
    grid-template-columns: auto 1fr;
    transform: translateX(var(--space-1));
    order: var(--local);
  }
  .b { color: #662E8D; margin: -0.5rem; }
  .c { background: rgb(0 0 0 / 0.1); transition: color 200ms; }
  @media (min-width: 40em) { .d { width: 100%; } }
  .e { color: var(--color-gone); }
</style>
`;

test('allows tokens, local custom properties, unitless numbers, percentages, fr and comments', () => {
  const lines = findViolations(SOURCE, TOKENS).map((v) => v.line);
  assert.ok(lines.every((l) => l >= 19), `unexpected violation on lines ${lines}`);
});

test('reports hex, color functions, lengths, durations and undefined tokens with their line', () => {
  assert.deepEqual(
    findViolations(SOURCE, TOKENS).map((v) => `${v.line} ${v.rule} ${v.text}`),
    [
      '19 hex color #662E8D',
      '19 length or duration -0.5rem',
      '20 implicit easing transition: color 200ms',
      '20 color function rgb(',
      '20 length or duration 200ms',
      '21 length or duration 40em',
      '22 undefined token --color-gone',
    ],
  );
});

test('easing comes from --ease-* tokens; linear is allowed for scroll-driven animations', () => {
  const source = `<style>
  .ok {
    transition:
      transform var(--duration-base) var(--ease-out-expo),
      color var(--duration-fast) var(--ease-standard);
  }
  .ok-longhand { transition-property: opacity; transition-duration: var(--duration-slow); transition-timing-function: var(--ease-standard); }
  .ok-scroll { animation-name: a; animation-timing-function: linear; animation-timeline: view(); }
  .ok-loop { animation: pulse var(--duration-loop) var(--ease-standard) infinite alternate; }
  .ok-none { transition: none; }
  .keyword { transition: color var(--duration-fast) ease-in-out; }
  .bezier { transition-timing-function: cubic-bezier(0.2, 0, 0, 1); transition-duration: var(--duration-fast); }
  .default { transition: color var(--duration-fast); }
  .longhand { transition-property: transform; transition-duration: var(--duration-fast); }
  .anim { animation-name: a; animation-duration: var(--duration-slow); }
  .linear-transition { transition: color var(--duration-fast) linear; }
</style>`;
  const tokens = declaredProperties(':root { --duration-fast: 1ms; --duration-base: 1ms; --duration-slow: 1ms; --duration-loop: 1ms; --ease-standard: x; --ease-out-expo: x; }');
  assert.deepEqual(
    findViolations(source, tokens).map((v) => `${v.line} ${v.rule} ${v.text}`),
    [
      '11 implicit easing transition: color var(--duration-fast) ease-in-out',
      '11 easing ease-in-out',
      '12 easing cubic-bezier(',
      '13 implicit easing transition: color var(--duration-fast)',
      '14 implicit easing transition-duration without transition-timing-function',
      '15 implicit easing animation-name without animation-timing-function',
      '16 implicit easing transition: color var(--duration-fast) linear',
    ],
  );
});
