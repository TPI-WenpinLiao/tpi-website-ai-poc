import assert from 'node:assert/strict';
import { test } from 'node:test';
import { fontFaces, pageText, parseRanges, uncovered } from './font-subsets.mjs';

test('parseRanges reads single code points and ranges, padded or not', () => {
  assert.deepEqual(parseRanges('U+0000-00FF,U+0131, U+1EA0-1EF9'), [
    [0, 255],
    [305, 305],
    [0x1ea0, 0x1ef9],
  ]);
  assert.deepEqual(parseRanges('U+0-FF'), [[0, 255]]);
  assert.deepEqual(parseRanges('U+??,U+1F??'), [
    [0, 255],
    [0x1f00, 0x1fff],
  ]);
});

test('fontFaces groups the unicode-range of each face by family', () => {
  const css = `@font-face{font-family:Inter Variable;unicode-range:U+0-FF}
    @font-face { font-family: 'Inter Variable'; unicode-range: U+102-103, U+20AB; }
    @font-face{font-family:"Other";src:url(x.woff2)}`;
  assert.deepEqual([...fontFaces(css)], [['Inter Variable', [[[0, 255]], [[0x102, 0x103], [0x20ab, 0x20ab]]]]]);
});

test('uncovered lists characters the font has but the loaded subsets do not', () => {
  const all = parseRanges('U+0-FF,U+100-2BA,U+1EA0-1EF9');
  const loaded = parseRanges('U+0-FF,U+1EA0-1EF9');
  // ō is latin-ext; ệ is loaded; 中 is not in the font at all
  assert.deepEqual([...uncovered('2-chōme Việt 中文', all, loaded)], ['ō']);
});

test('pageText decodes entities and skips script and style', () => {
  const html = '<html><head><style>a{}</style></head><body><p>Ch&#x14d;me</p><script>"ō"</script></body></html>';
  assert.equal(pageText(html).trim(), 'Chōme');
});
