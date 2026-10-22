// Tests for scripts/status/check.mjs. Run: npm run test:scripts

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { statusProblems } from './check.mjs';

test('accepts completed and stage-one lines, and prose quoting the word', () => {
  const md =
    '- M2-03 URL 規則完成（#10）\n- M3-04 首頁高保真（#17），階段一，等待 design-approved\n' +
    '- 規則完成（#94）：script 擋下「待合併」\n';
  assert.deepEqual(statusProblems(md), []);
});

test('reports lines with another PR still open', () => {
  const md = '# 專案狀態\n\n- M4-01 Content collections（#20，PR #91），待合併\n';
  assert.deepEqual(statusProblems(md), [
    'line 3: open PR state ("待合併") does not belong in status.md: - M4-01 Content collections（#20，PR #91），待合併',
  ]);
});
