// Break opportunities between the words of long runs in zh-TW headings and .text-phrase text (#202, #225):
// src/lib/content/phrases.ts. Part of `npm run test:scripts`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { phrasedHtml, phrases } from '../../src/lib/content/phrases.ts';

test('a long run without punctuation breaks between its words, not inside one', () => {
  assert.deepEqual(phrases('自動計算，產出清冊與申報格式', 'zh-TW'), ['自動計算，產出', '清冊與申報', '格式']);
});

test('a run of eight Han characters or fewer stays whole, so a split compound (生命／週期) is not broken', () => {
  assert.deepEqual(phrases('API 生命週期管理與 AI Gateway', 'zh-TW'), ['API 生命週期管理與 AI Gateway']);
  assert.deepEqual(phrases('數位轉型（DigiLism）', 'zh-TW'), ['數位轉型（DigiLism）']);
});

test('a one-character word keeps to both neighbours', () => {
  for (const p of phrases('顧問公司登入同一個平台輔導', 'zh-TW')) assert.notEqual([...p].length, 1, p);
});

test('a word the dictionary splits into two single characters is put back together, so the run breaks before it', () => {
  assert.deepEqual(phrases('驗身與日誌都集中控管', 'zh-TW'), ['驗身與日誌都集中', '控管']);
  assert.deepEqual(phrases('進行資源與服務監控作業', 'zh-TW'), ['進行', '資源與服務', '監控', '作業']);
});

test('a function word is not joined to the next character, so no piece starts on it (#228)', () => {
  const cases = ['中小企業最聰明的碳管理策略', '一站式管理企業的與能源相關的碳排放數據', '金融業的開放銀行交易量的效能', '可串接客戶內外部系統', '在集團內各通路'];
  for (const text of cases) {
    for (const p of phrases(text, 'zh-TW').slice(1)) assert.doesNotMatch(p, /^[的之與及和或在從各於可]/u, `${text}: ${p}`);
  }
  assert.deepEqual(phrases('中小企業最聰明的碳管理策略', 'zh-TW'), ['中小企業最聰明的碳管理', '策略']);
});

test('a run mixing Han and Latin counts as one, and breaks beside its Latin words too', () => {
  assert.deepEqual(phrases('現金業務API管理平台', 'zh-TW'), ['現金', '業務', 'API', '管理', '平台']);
  assert.deepEqual(phrases('Card+信用卡行動服務', 'zh-TW'), ['Card+信用卡', '行動', '服務']);
  assert.deepEqual(phrases('ISO27001 日誌存錄', 'zh-TW'), ['ISO27001 日誌存錄']);
});

test('only headings, .text-phrase and table cells on zh-TW pages get <wbr>; the rest of the page is left as it was', () => {
  const html = '<!doctype html><html lang="zh-TW"><body><h2 class="t">產出清冊與申報格式</h2><p>產出清冊與申報格式</p><p class="description text-phrase">產出清冊與申報格式</p><h3><a href="/x">顧問公司登入同一個平台 &amp; AI</a></h3><table><tr><td>產出清冊與申報格式</td></tr></table></body></html>';
  const out = phrasedHtml(html, 'zh-TW');
  assert.match(out, /^<!doctype html>/i);
  assert.match(out, /<h2 class="t">產出<wbr>清冊與申報<wbr>格式<\/h2>/);
  assert.match(out, /<p>產出清冊與申報格式<\/p>/);
  assert.match(out, /<p class="description text-phrase">產出<wbr>清冊與申報<wbr>格式<\/p>/);
  assert.match(out, /<a href="\/x">顧問<wbr>公司<wbr>登入同一個<wbr>平台 &amp; AI<\/a>/);
  assert.match(out, /<td>產出<wbr>清冊與申報<wbr>格式<\/td>/);
  assert.equal(phrasedHtml(html, 'en'), html);
});

test('a heading inside another heading-like wrapper is split once', () => {
  const out = phrasedHtml('<html lang="zh-TW"><body><h2><span>產出清冊與申報格式</span></h2></body></html>', 'zh-TW');
  assert.match(out, /<span>產出<wbr>清冊與申報<wbr>格式<\/span>/);
});

test('a hyphenated Latin word in a heading or .text-phrase stays on one line (#233)', () => {
  const html = '<html lang="zh-TW"><body><table><tr><th class="name text-phrase">aiDAPTIV 4-GPU Server</th><td>calc(var(--space-6) + var(--touch-target))</td></tr></table><h2>ISO 14064-1 與 GHG Protocol</h2><p>aiDAPTIV 4-GPU Server</p></body></html>';
  const out = phrasedHtml(html, 'zh-TW');
  assert.match(out, /<th class="name text-phrase">aiDAPTIV <span class="text-nowrap">4-GPU<\/span> Server<\/th>/);
  assert.match(out, /<h2>ISO <span class="text-nowrap">14064-1<\/span> 與 GHG Protocol<\/h2>/);
  assert.match(out, /<td>calc\(var\(--space-6\) \+ var\(--touch-target\)\)<\/td>/);
  assert.match(out, /<p>aiDAPTIV 4-GPU Server<\/p>/);
  assert.equal(phrasedHtml(html, 'en'), html);
});

test('a heading inside a table cell still keeps its hyphenated words whole', () => {
  const out = phrasedHtml('<html lang="zh-TW"><body><table><tr><td><h3>aiDAPTIV 4-GPU Server</h3></td></tr></table></body></html>', 'zh-TW');
  assert.match(out, /<h3>aiDAPTIV <span class="text-nowrap">4-GPU<\/span> Server<\/h3>/);
});

test('code in a heading may still break at its hyphens', () => {
  const html = '<html lang="zh-TW"><body><h3><code>--color-bg-brand-subtle</code></h3></body></html>';
  assert.equal(phrasedHtml(html, 'zh-TW'), html);
});
