// The weight of a case section's heading (#231): src/lib/content/cases.ts. Part of `npm run test:scripts`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { caseWeight } from '../../src/lib/content/cases.ts';

test('one case without a result or an award takes a secondary heading', () => {
  assert.equal(caseWeight([{}]), 'secondary');
  assert.equal(caseWeight([{ result: undefined, award: undefined }]), 'secondary');
});

test('a result, an award or a second case keeps the heading primary', () => {
  assert.equal(caseWeight([{ result: '節省 80% 人力' }]), 'primary');
  assert.equal(caseWeight([{ award: 'Global Finance 2020' }]), 'primary');
  assert.equal(caseWeight([{}, {}]), 'primary');
  assert.equal(caseWeight([]), 'primary');
});
