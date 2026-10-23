// Tests for scripts/content/migrate/html-to-markdown.mjs. Run: npm run test:scripts
// Fixtures are trimmed from real current-site bodies (blog customer-complaint-ai-tool-selection-guide, news 585).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { prepare, toMarkdown } from './html-to-markdown.mjs';

const BASE = 'https://www.tpisoftware.com/media-center/585';
const convert = (html, { image = (url) => ({ path: `./${url.split('/').pop()}` }), link = (h) => h } = {}) => {
  const p = prepare(html, BASE);
  return { ...p, ...toMarkdown(p.html, { image, link }), notes: [...p.notes] };
};

test('styles and spans are dropped, bold headings are plain headings', () => {
  const html = '<h2><span style="color: rgb(0, 0, 0)"><strong>一通沒有處理好的電話</strong></span></h2><p style="line-height: 1.7"><span style="color: rgb(0, 0, 0)">客服中心是第一線。</span></p>';
  assert.equal(convert(html).markdown, '## 一通沒有處理好的電話\n\n客服中心是第一線。');
});

test('h1 becomes h2 and skipped levels close up, with a note', () => {
  const r = convert('<h1>A</h1><h4>B</h4><h2>C</h2><h3>D</h3>');
  assert.equal(r.markdown, '## A\n\n### B\n\n## C\n\n### D');
  assert.deepEqual(r.notes, ['headings changed: h1→h2 h4→h3']);
});

test('bold that CommonMark would not parse next to CJK punctuation falls back to <strong>', () => {
  const html = '<p>重點不只是<strong>系統</strong>，<strong>能否分析客服錄音，</strong>而是<strong>能否提早辨識風險。</strong></p>';
  // The second run ends with ， right before 而, so it is not a closing delimiter; the third ends the paragraph
  assert.equal(convert(html).markdown, '重點不只是**系統**，<strong>能否分析客服錄音，</strong>而是**能否提早辨識風險。**');
});

test('empty paragraphs and nbsp-only paragraphs are removed', () => {
  assert.equal(convert('<p>a</p><p></p><p>&nbsp;</p><p>b</p>').markdown, 'a\n\nb');
});

test('images: srcset-only images resolve against the page, alt comes from the override first', () => {
  const html = '<figure><img class="wp-image-62730" style="height: auto" srcset="/file/upload/images/20261015/news-1.jpg, 768w" alt="" width="1024" height="639"></figure><p><img src="https://tpi.dev/a/b.png" alt="舊 alt"></p>';
  const p = prepare(html, BASE);
  assert.deepEqual(p.images, ['https://www.tpisoftware.com/file/upload/images/20261015/news-1.jpg', 'https://tpi.dev/a/b.png']);
  const { markdown } = toMarkdown(p.html, { image: (url) => ({ path: `./${url.split('/').pop()}`, alt: url.endsWith('b.png') ? '新的 [說明]' : undefined }), link: (h) => h });
  assert.equal(markdown, '![](./news-1.jpg)\n\n![新的 \\[說明\\]](./b.png)');
});

test('links go through the resolver; javascript: and empty links are unwrapped', () => {
  const html = '<p><strong><a href="https://www.tpisoftware.com/">昕力資訊</a></strong>（7781）<a href="javascript:void(0)">x</a><a>y</a></p>';
  const { markdown } = convert(html, { link: (h) => (h === 'https://www.tpisoftware.com/' ? '/' : h) });
  assert.equal(markdown, '**[昕力資訊](/)**（7781）xy');
});

test('embeds are removed and reported', () => {
  const r = convert('<p>a</p><iframe src="https://www.youtube.com/embed/abc"></iframe>');
  assert.equal(r.markdown, 'a');
  assert.deepEqual(r.notes, ['embed removed: <iframe> https://www.youtube.com/embed/abc']);
});

test('a plain table becomes a GFM table', () => {
  const html = '<table style="min-width: 75px"><colgroup><col><col></colgroup><tbody><tr><td><p><strong>質檢方式</strong></p></td><td><p>主要限制</p></td></tr><tr><td><p>人工抽檢</p></td><td><p>覆蓋率 | 人力</p><p>第二段</p></td></tr></tbody></table>';
  assert.equal(convert(html).markdown, '| **質檢方式** | 主要限制 |\n| --- | --- |\n| 人工抽檢 | 覆蓋率 \\| 人力<br>第二段 |');
});

test('a table with merged cells stays HTML without styles', () => {
  const html = '<table style="width: 100%"><tbody><tr><td colspan="2" style="color: red">A</td></tr><tr><td colspan="1">B</td><td>C</td></tr></tbody></table>';
  const r = toMarkdown(prepare(html, BASE).html, { image: () => ({ path: '' }), link: (h) => h });
  assert.equal(r.markdown, '<table><tbody><tr><td colspan="2">A</td></tr><tr><td>B</td><td>C</td></tr></tbody></table>');
  assert.deepEqual(r.notes, ['table kept as HTML (merged cells, lists or uneven rows)']);
});

test('lists keep their nesting', () => {
  assert.equal(convert('<ul><li><p>一</p><ul><li>二</li></ul></li><li>三</li></ul>').markdown, '-   一\n\n    -   二\n-   三');
});

test('tracking pixels are removed, WordPress emoji become text, data: URLs in srcset stay whole', () => {
  const html =
    '<p>電子報<img style="display: none;" src="/c/o?e=1765278&amp;c=151F9D" alt="" width="1" height="1"></p>' +
    '<p>Open Finance <img class="emoji" src="https://s.w.org/images/core/emoji/14.0.0/svg/2728.svg" alt="✨"></p>' +
    '<p><img srcset="data:image/jpeg;base64,/9j/4AAQ, 768w" alt=""></p>';
  const r = convert(html);
  assert.deepEqual(r.images, ['data:image/jpeg;base64,/9j/4AAQ']);
  assert.deepEqual(r.notes, ['tracking pixels removed: 1']);
  assert.equal(r.markdown.split('\n\n').slice(0, 2).join('\n\n'), '電子報\n\nOpen Finance ✨');
});
