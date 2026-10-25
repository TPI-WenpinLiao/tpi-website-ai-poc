// The visual regression baselines are taken and compared in Playwright's Docker image (#24): every
// workflow that runs them must use the image of the pinned @playwright/test, or the browser differs
// from the one the baselines were taken with. Run: npm run test:scripts

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '../..');
const read = (file) => readFileSync(resolve(root, file), 'utf8');

test('the workflows that run the visual tests use the image of the pinned @playwright/test', () => {
  const version = JSON.parse(read('package.json')).devDependencies['@playwright/test'];
  assert.match(version, /^\d+\.\d+\.\d+$/, '@playwright/test is pinned to an exact version');
  for (const workflow of ['.github/workflows/quality-gate.yml', '.github/workflows/visual-baseline.yml']) {
    const images = [...read(workflow).matchAll(/mcr\.microsoft\.com\/playwright:v([\d.]+)-noble/g)].map((m) => m[1]);
    assert.deepEqual(images, [version], `${workflow} runs in mcr.microsoft.com/playwright:v${version}-noble`);
  }
});
