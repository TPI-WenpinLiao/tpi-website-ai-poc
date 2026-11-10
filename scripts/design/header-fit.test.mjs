// Tests for scripts/design/header-fit.mjs. Run: npm run test:scripts
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { problems, renderSection } from './header-fit.mjs';

const row = (over = {}) => ({
  locale: 'vi',
  header: '首頁',
  path: '/vi',
  width: 1024,
  content: 900,
  available: 947,
  labels: [
    { text: 'Sản Phẩm', lines: 1 },
    { text: 'Liên hệ kinh doanh', lines: 1 },
  ],
  ...over,
});

test('a header that fits on one line has no problems', () => {
  assert.deepEqual(problems(row()), []);
});

test('a header wider than its bar is reported with both widths', () => {
  const found = problems(row({ content: 991, labels: [{ text: 'Sản Phẩm', lines: 2 }] }));
  assert.equal(found.length, 2);
  assert.match(found[0], /needs 991px, has 947px/);
  assert.match(found[1], /wraps: Sản Phẩm/);
});

test('labels that wrap while the widths say it fits mean the measurement is off (#240)', () => {
  const found = problems(row({ labels: [{ text: 'Liên hệ kinh doanh', lines: 2 }] }));
  assert.ok(found.some((p) => /no longer matches the header/.test(p)));
});

test('the section lists each locale once and marks rows that do not fit', () => {
  const section = renderSection([row(), row({ path: '/vi/about-us', header: '內頁', content: 991, available: 967 })]);
  assert.equal(section.match(/^- vi：/gm)?.length, 1);
  assert.match(section, /\| 1024 \| 991 \| 967 \| -24 \| ❌ \|/);
});
