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
      '20 color function rgb(',
      '20 length or duration 200ms',
      '21 length or duration 40em',
      '22 undefined token --color-gone',
    ],
  );
});
