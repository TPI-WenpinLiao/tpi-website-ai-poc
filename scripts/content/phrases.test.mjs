// Break opportunities between the words of zh-TW headings (#202): src/lib/content/phrases.ts.
// Part of `npm run test:scripts`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { phrasedHtml, phrases } from '../../src/lib/content/phrases.ts';

test('a run without punctuation breaks between its words, not inside one', () => {
  assert.deepEqual(phrases('產出清冊與申報格式', 'zh-TW'), ['產出', '清冊與申報', '格式']);
  assert.deepEqual(phrases('數位轉型', 'zh-TW'), ['數位', '轉型']);
});

test('a one-character word keeps to both neighbours', () => {
  for (const p of phrases('接上核心系統與傳統 ESB，不必先汰換', 'zh-TW')) assert.notEqual([...p.trim()].length, 1, p);
});

test('punctuation and Latin words add no pieces of their own', () => {
  assert.deepEqual(phrases('GreenSwift 智慧碳管理平台', 'zh-TW').join(''), 'GreenSwift 智慧碳管理平台');
});

test('only headings and .text-phrase on zh-TW pages get <wbr>; the rest of the page is left as it was', () => {
  const html = '<!doctype html><html lang="zh-TW"><body><h2 class="t">產出清冊與申報格式</h2><p>產出清冊與申報格式</p><p class="description text-phrase">顧問公司登入同一個平台輔導</p><h3><a href="/x">數位轉型 &amp; AI</a></h3></body></html>';
  const out = phrasedHtml(html, 'zh-TW');
  assert.match(out, /^<!doctype html>/i);
  assert.match(out, /<h2 class="t">產出<wbr>清冊與申報<wbr>格式<\/h2>/);
  assert.match(out, /<p>產出清冊與申報格式<\/p>/);
  assert.match(out, /顧問<wbr>公司<wbr>登入/);
  assert.match(out, /<a href="\/x">數位<wbr>轉型 &amp; AI<\/a>/);
  assert.equal(phrasedHtml(html, 'en'), html);
});

test('a .text-phrase inside a heading is split once', () => {
  const out = phrasedHtml('<html lang="zh-TW"><body><h2><span class="text-phrase">數位轉型</span></h2></body></html>', 'zh-TW');
  assert.match(out, /<span class="text-phrase">數位<wbr>轉型<\/span>/);
});
