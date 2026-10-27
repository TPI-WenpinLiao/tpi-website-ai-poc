// zh-TW segmentation of the Pagefind index and its undoing for display (M6-02, #34):
// src/lib/search/segment.ts and display.ts. Part of `npm run test:scripts`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { indexedHtml, segmentText } from '../../src/lib/search/segment.ts';
import { despace } from '../../src/lib/search/display.ts';

test('zh-TW text is split into words with a space wherever a Han character meets another word', () => {
  assert.equal(segmentText('協助企業實現數位轉型。', 'zh-TW'), '協助 企業 實現 數位 轉型 。');
  assert.equal(segmentText('AI核心科技', 'zh-TW'), 'AI 核心 科技');
});

test('Latin words and existing spaces are left as they are', () => {
  assert.equal(segmentText('UI/UX 數位', 'zh-TW'), 'UI/UX 數位');
  assert.equal(segmentText('digiRunner API', 'zh-TW'), 'digiRunner API');
});

test('a zh-TW page is indexed under zhtw with its body text segmented, scripts and templates untouched', () => {
  const html = indexedHtml(
    '<!doctype html><html lang="zh-TW"><head><title>標題測試</title></head><body><main><h1>關於我們</h1><p>A &amp; B 企業</p><script>var s="中文字"</script><template><p>模板內容</p></template></main></body></html>',
    'zh-TW',
  );
  assert.match(html, /<html lang="zhtw">/);
  assert.match(html, /<h1>關於 我們<\/h1>/);
  assert.match(html, /<p>A &amp; B 企業<\/p>/);
  assert.match(html, /var s="中文字"/);
  assert.match(html, /<p>模板內容<\/p>/);
  assert.match(html, /<title>標題測試<\/title>/);
});

test('pages of other locales are indexed as they are', () => {
  const html = '<html lang="en"><body><p>Digital transformation</p></body></html>';
  assert.equal(indexedHtml(html, 'en'), html);
});

test('despace() removes the spaces between CJK characters, also next to <mark>', () => {
  assert.equal(despace('協助 <mark>企業</mark> 實現 數位 轉型 。'), '協助<mark>企業</mark>實現數位轉型。');
  assert.equal(despace('AI 核心 科技'), 'AI 核心科技');
  assert.equal(despace('digiRunner API'), 'digiRunner API');
});

test('despace() of segmentText() gives back text without spaces between Han characters', () => {
  const text = '昕力資訊為企業數位轉型軟體領導品牌';
  assert.equal(despace(segmentText(text, 'zh-TW')), text);
});
