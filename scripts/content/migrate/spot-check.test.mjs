// Tests for scripts/content/migrate/spot-check.mjs. Run: npm run test:scripts

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { brokenLinks, markdownText, pagePath, sample, sourceImageCount, textRatio } from './spot-check.mjs';

test('markdownText keeps only the words', () => {
  const md = '## 標題\n\n**粗體**與[連結](/blog/a)\\[註\\]\n\n![圖](../../a.png)\n\n| a | b |\n|---|---|\n| 1 | 2 |\n\n<strong>強調</strong>';
  assert.equal(markdownText(md).replace(/\s+/g, ''), '標題粗體與連結[註]ab12強調');
  assert.equal(markdownText('Water<Less® giảm 96%, <br> xong >').replace(/\s+/g, ' '), 'Water<Less® giảm 96%, xong >');
});

test('textRatio compares converted text with the source body, embeds left out', () => {
  const html = '<h2>標題</h2><p><strong>粗體</strong>與<a href="x">連結</a></p><iframe src="y"></iframe>';
  assert.equal(textRatio('## 標題\n\n**粗體**與[連結](/x)', html), 1);
  assert.equal(textRatio('## 標題', html), 2 / 7);
  assert.equal(textRatio('Tin tức', '<p>Tin t&uacute;c</p>'), 1);
});

test('sourceImageCount leaves out WordPress emoji', () => {
  assert.equal(sourceImageCount('<img src="https://s.w.org/images/core/emoji/14.0.0/svg/2728.svg" alt="✨"><img src="https://tpi.dev/a.jpg">'), 1);
});

test('sample is stable and takes at most n per type × locale', () => {
  const entries = ['a', 'b', 'c', 'd'].flatMap((s) => [
    { type: 'blog', locale: 'zh-TW', id: `zh-TW/${s}` },
    { type: 'news', locale: 'en', id: `en/${s}` },
  ]);
  const picked = sample(entries, 2);
  assert.equal(picked.length, 4);
  assert.deepEqual(sample([...entries].reverse(), 2).map((e) => e.id).sort(), picked.map((e) => e.id).sort());
});

test('pagePath follows nodes.csv and the locale prefix rule', () => {
  assert.equal(pagePath('blog', 'zh-TW/zta'), '/blog/zta');
  assert.equal(pagePath('news', 'en/600'), '/en/media-center/600');
});

test('brokenLinks lists body links to missing pages only', () => {
  const bodies = new Map([['/blog/a', '[b](/blog/b) [c](/blog/c#x) [x](https://x.com/) <a href="/media-center/9">9</a> [home](/)']]);
  const exists = (p) => ['/', '/blog/b'].includes(p);
  assert.deepEqual(brokenLinks(bodies, exists), [
    { page: '/blog/a', href: '/blog/c#x' },
    { page: '/blog/a', href: '/media-center/9' },
  ]);
});
