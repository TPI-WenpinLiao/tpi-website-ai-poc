// Tests for scripts/design/token-usage.mjs. Run: npm run test:scripts

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findViolations } from './token-usage.mjs';

const SOURCE = `---
const x = '#fff 12px'; // frontmatter is not CSS
---
<p style="color: #000">inline styles are out of scope</p>
<style>
  @import '../../styles/media.css';
  /* 16px in a comment is fine */
  .a {
    color: var(--color-text);
    padding: var(--space-2) 0;
    line-height: 1.5;
    flex: 1 1 0%;
    aspect-ratio: 16 / 9;
    grid-template-columns: auto 1fr;
    transform: translateX(var(--space-1));
  }
  .b { color: #662E8D; margin: -0.5rem; }
  .c { background: rgb(0 0 0 / 0.1); transition: color 200ms; }
  @media (min-width: 40em) { .d { width: 100%; } }
</style>
`;

test('allows tokens, unitless numbers, percentages, fr and comments', () => {
  const lines = findViolations(SOURCE).map((v) => v.line);
  assert.ok(lines.every((l) => l >= 17), `unexpected violation on lines ${lines}`);
});

test('reports hex, color functions, lengths and durations with their line', () => {
  assert.deepEqual(
    findViolations(SOURCE).map((v) => `${v.line} ${v.rule} ${v.text}`),
    [
      '17 hex color #662E8D',
      '17 length or duration -0.5rem',
      '18 color function rgb(',
      '18 length or duration 200ms',
      '19 length or duration 40em',
    ],
  );
});
