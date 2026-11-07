// Bolded numbers in fact texts (#208): src/lib/content/emphasis.ts. Part of `npm run test:scripts`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { quantities } from '../../src/lib/content/emphasis.ts';

const strong = (text) =>
  quantities(text)
    .filter((p) => p.strong)
    .map((p) => p.part);

test('counts, years and percentages stand out', () => {
  assert.deepEqual(strong('DigiLism 產品系列擁有7項發明專利'), ['7']);
  assert.deepEqual(strong('2008 年首度跨足金融產業，為華南銀行建置 CRM 系統'), ['2008']);
  assert.deepEqual(strong('準確率 99% 以上'), ['99%']);
  assert.deepEqual(strong('節省 80 % 人力'), ['80 %']);
  assert.deepEqual(strong('處理 1,200 件'), ['1,200']);
});

test('a number inside a name stays plain', () => {
  assert.deepEqual(strong('通過 ISO27001 資訊安全認證'), []);
  assert.deepEqual(strong('支援地、雲端部署及 K8s 微服務架構'), []);
  assert.deepEqual(strong('符合 RFC-7519 標準'), []);
  assert.deepEqual(strong('通過 ISO 27001 認證'), []);
  assert.deepEqual(strong('依 ISO 14064-1:2018 標準盤查'), []);
  assert.deepEqual(strong('符合國際標準 BPMN 2.0 規範'), []);
  assert.deepEqual(strong('a top FT 500 Asia-Pacific company'), []);
});

test('a range stands out whole, and a unit after the number does not stop it', () => {
  assert.deepEqual(strong('效能可達 300-1000 TPS'), ['300-1000']);
  assert.deepEqual(strong('建議 2 Core CPU'), ['2']);
  assert.deepEqual(strong('在 2008 年。'), ['2008']);
  assert.deepEqual(strong('It began in 2008.'), ['2008']);
  assert.deepEqual(strong('Over 20 years of experience'), ['20']);
  assert.deepEqual(strong('透過 AI 24 小時監控設備運行狀態'), ['24']);
  assert.deepEqual(strong('GRI、SASB 和 TCFD 3 種國際通用準則'), ['3']);
});

test('the parts put back together are the text unchanged', () => {
  const text = 'digiRunner、digiLogs、SysTalk.ai 獲得「2024 台灣精品獎」';
  assert.equal(
    quantities(text)
      .map((p) => p.part)
      .join(''),
    text,
  );
  assert.deepEqual(strong(text), ['2024']);
});
