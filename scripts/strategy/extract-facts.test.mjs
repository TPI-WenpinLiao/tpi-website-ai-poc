// Unit tests for scripts/strategy/extract-facts.mjs and source-pages.mjs (#164). No network.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parse } from 'yaml';
import { candidates, expand, render } from './extract-facts.mjs';
import { chunkStrings, textBlocks } from './source-pages.mjs';

const source = {
  groups: [
    {
      group: 'Home',
      url: 'https://www.tpisoftware.com/',
      locale: 'zh-TW',
      comment: 'first comment',
      facts: [
        { id: 'a', type: 'metric', quote: '節省逾80%人工作業時間' },
        { id: 'b', type: 'client', quote: '台新銀行', status: 'to_confirm', note: 'client name in marketing', comment: 'b comment' },
      ],
    },
    { group: 'En', url: 'https://www.tpisoftware.com/en', locale: 'en', facts: [{ id: 'a-en', type: 'metric', quote: 'by 80%', text: '80%', url: 'https://www.tpisoftware.com/en/x' }] },
  ],
};

test('expand applies group defaults and keeps the order', () => {
  const facts = expand(source).map((e) => e.fact);
  assert.deepEqual(facts[0], { id: 'a', type: 'metric', text: '節省逾80%人工作業時間', source: { url: 'https://www.tpisoftware.com/', quote: '節省逾80%人工作業時間' }, locale: 'zh-TW', status: 'confirmed' });
  assert.equal(facts[1].status, 'to_confirm');
  assert.equal(facts[1].note, 'client name in marketing');
  assert.deepEqual(facts[2].source, { url: 'https://www.tpisoftware.com/en/x', quote: 'by 80%' });
  assert.equal(facts[2].text, '80%');
});

test('expand rejects unknown fields', () => {
  assert.throws(() => expand({ groups: [{ group: 'g', url: 'https://x.test/', locale: 'zh-TW', facts: [{ id: 'a', type: 'metric', quote: 'q', txt: 'typo' }] }] }), /unknown field txt/);
});

test('render writes comments above entries and parses back to the facts', () => {
  const entries = expand(source);
  const out = render(entries);
  assert.match(out, /^# Fact library/);
  assert.match(out, /# --- Home ---\n# first comment\n- id: a\n/);
  assert.match(out, /# b comment\n- id: b\n/);
  assert.deepEqual(parse(out), entries.map((e) => e.fact));
  assert.equal(render(expand(source)), out, 'same input, same file');
});

test('textBlocks splits on tags, drops scripts and styles', () => {
  const html = '<html><style>.a{}</style><h2>通過 ISO27001</h2><p>節省逾<b>80%</b>人工</p><script>var x="7項";</script></html>';
  assert.deepEqual(textBlocks(html), ['通過 ISO27001', '節省逾', '80%', '人工']);
});

test('chunkStrings decodes JS string literals', () => {
  assert.deepEqual(chunkStrings(`a={t:"\\u53F0\\u65B0\\u9280\\u884C",u:'it\\'s',p:"\\u002Fx"}`), ['台新銀行', "it's", '/x']);
});

test('candidates keeps fact-like blocks and marks what covers them', () => {
  const blocks = ['擁有 7 項發明專利', '擁有 7 項發明專利', '了解更多', '服務超過 100 家', '台新銀行', '© 2026', 'ab'];
  const facts = [{ id: 'patents', quote: '7 項發明專利' }];
  const ignore = [{ match: /^服務超過/, reason: 'test rule' }];
  const rows = candidates(blocks, facts, ignore, new Set(['©2026']));
  assert.deepEqual(rows, [
    { block: '擁有 7 項發明專利', ids: ['patents'], reason: undefined },
    { block: '服務超過 100 家', ids: [], reason: 'test rule' },
    { block: '台新銀行', ids: [], reason: undefined },
  ]);
});
