// Tests for scripts/content/tags.mjs. Run: npm run test:scripts

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTags, categoryNames, parseTagTable } from './tags.mjs';

const model = `## blog

### tag 清單

| tag | zh-TW | en | vi |
|---|---|---|---|
| \`ai-application\` | \`ai/AIapplication\`（11） | \`artifintell/aiapplication\`（10） | — |
| \`neo4j\` | \`Featured/Neo4j\`（3，另設 \`featured: true\`） | — | — |

tag 的顯示名稱放在資料檔。

| schema 屬性 | 欄位 |
|---|---|
| \`headline\` | \`title\` |

## news
`;

test('parseTagTable reads tag ids and per-locale category paths', () => {
  assert.deepEqual(parseTagTable(model), [
    { id: 'ai-application', paths: { 'zh-TW': '/blog/ai/AIapplication', en: '/blog/artifintell/aiapplication' } },
    { id: 'neo4j', paths: { 'zh-TW': '/blog/Featured/Neo4j' } },
  ]);
});

test('parseTagTable fails without the tag section', () => {
  assert.throws(() => parseTagTable('## blog\n'), /tag 清單/);
});

test('buildTags takes names from main categories and subcategories', () => {
  const zh = categoryNames([
    { custUrl: '/blog/ai', categoryName: 'AI 人工智慧', subcategories: [{ custUrl: '/blog/ai/AIapplication', categoryName: 'AI 應用' }] },
    { custUrl: '/blog/Featured/Neo4j', categoryName: 'Neo4j ' },
  ]);
  const en = categoryNames([{ custUrl: '/en/blog/artifintell/aiapplication', categoryName: 'AI Application' }]);
  assert.deepEqual(buildTags(parseTagTable(model), { 'zh-TW': zh, en, vi: new Map() }), [
    { id: 'ai-application', name: { 'zh-TW': 'AI 應用', en: 'AI Application' } },
    { id: 'neo4j', name: { 'zh-TW': 'Neo4j' } },
  ]);
});

test('buildTags fails when the current site no longer has a category', () => {
  assert.throws(() => buildTags(parseTagTable(model), { 'zh-TW': new Map(), en: new Map(), vi: new Map() }), /not found/);
});
