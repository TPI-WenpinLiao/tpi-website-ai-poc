// Tests for scripts/content/migrate/case-studies.mjs. Run: npm run test:scripts

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { align, caseEntry, caseSlug, INDUSTRY, jsString, logoKey, mentionedOfferings, OVERRIDES, parseCards, parseOverrides, slugs } from './case-studies.mjs';
import { serializeFrontmatter } from './frontmatter.mjs';

// The success-story chunk as the site minifies it (/_nuxt/1afac71.js, trimmed): double and single quotes, escapes
const CHUNK = `storyList:[{title:"現金業務API管理平台",logo:"/images/logo/taishin02.png",type:"financial",description:"與台新銀行合作，以digiRunner模組開發API管理平台。該平台獲全球金融雜誌 (Global Finance)頒發「The Innovators 2020 Cash Management」獎。"},{title:"AI intelligent customer service system",logo:"/images/logo/cub02.png",type:"financial",description:'TPIsoftware assisted Cathay United Bank in creating the Chatbot "Alpha"\\u002Fdone.'}]`;

test('parseCards reads both quote styles and decodes escapes', () => {
  const cards = parseCards(CHUNK);
  assert.equal(cards.length, 2);
  assert.deepEqual(cards[1], { title: 'AI intelligent customer service system', logo: '/images/logo/cub02.png', type: 'financial', description: 'TPIsoftware assisted Cathay United Bank in creating the Chatbot "Alpha"/done.' });
  assert.equal(jsString(`'it\\'s'`), "it's");
});

test('parseCards returns null for other chunks and throws when cards stop matching the pattern', () => {
  assert.equal(parseCards('var a={title:"x"}'), null);
  assert.throws(() => parseCards(`${CHUNK},{title:"x",logo:"/images/a.png",type:"gov",summary:"y"}`), /3 logos but 2 cards/);
});

test('logoKey drops the locale variants of a logo file', () => {
  assert.equal(logoKey('/images/logo/fe02.png'), 'fe');
  assert.equal(logoKey('/images/success/bnp_en.png'), 'bnp');
  assert.equal(logoKey('/images/success/tokio-marine-newa-zh.png'), 'tokio-marine-newa');
  assert.equal(logoKey('/images/success/logo-FJCUH.png'), 'logo-fjcuh');
  assert.equal(logoKey('/images/logo/china_life_insurance.png'), 'china-life-insurance');
  // 保德信 and 英國保誠 stay apart
  assert.notEqual(logoKey('/images/logo/prudential03.png'), logoKey('/images/success/logo-prudential-en.png'));
});

test('align pairs cards by logo and type and leaves out the ones a locale lacks', () => {
  const card = (logo, type) => ({ title: logo, logo: `/images/logo/${logo}.png`, type, description: '' });
  const zh = [card('a', 'gov'), card('b', 'tel'), card('b', 'tel'), card('c', 'other')];
  const vi = [card('a02', 'gov'), card('b', 'tel'), card('c_en', 'other')];
  assert.deepEqual(align(zh, vi), [0, 1, 3]);
  assert.deepEqual(align(zh, [card('x', 'gov')]), [null]);
});

test('caseSlug starts with the client, skips title words the client slug has, and stays within 60 characters', () => {
  assert.equal(caseSlug('hua-nan-bank', 'Hua Nan Bank Digital Banking Platform'), 'hua-nan-bank-digital-banking-platform');
  assert.equal(caseSlug('cathay-life', 'CRM 2.0'), 'cathay-life-crm-2-0');
  const long = caseSlug('taiwan-mobile', 'Value-Added Service and Mobile Customer Service System');
  assert.ok(long.length <= 60 && !long.endsWith('-'), long);
  const clientOf = () => ({ slug: 'taishin' });
  const base = [{ title: 'a' }, { title: 'b' }];
  assert.deepEqual(slugs(base, [{ title: 'Same' }, { title: 'Same' }], clientOf), ['taishin-same', 'taishin-same-2']);
  assert.throws(() => slugs(base, [{ title: 'Same' }], clientOf), /no en card for zh-TW「b」/);
});

test('every card type has an industry from the #28 decision', () => {
  assert.deepEqual(INDUSTRY, { financial: 'finance', insurance: 'finance', gov: 'government', tel: 'other', tech: 'other', transport: 'other', medical: 'other', other: 'other' });
});

test('offerings come only from product names the text spells out and that have an entry', () => {
  const exists = (id) => id === 'zh-TW/digirunner';
  assert.deepEqual(mentionedOfferings('以digiRunner模組開發，並導入 digiLogs', 'zh-TW', exists), { found: ['zh-TW/digirunner'], missing: ['digilogs'] });
  assert.deepEqual(mentionedOfferings('RPA流程自動化', 'zh-TW', exists), { found: [], missing: [] });
});

test('caseEntry keeps the description as the body and notes what a reviewer has to check', () => {
  const [card] = parseCards(CHUNK);
  const client = { slug: 'taishin', name: { 'zh-TW': '台新銀行' } };
  const { data, body, notes } = caseEntry({ locale: 'zh-TW', slug: 'taishin-x', card, order: 1, client, logoFile: 'logo.webp', override: undefined, offeringExists: (id) => id === 'zh-TW/digirunner' });
  assert.equal(body, card.description);
  assert.deepEqual(data.client, { name: '台新銀行', disclosed: true, logo: '../../../assets/case-study/zh-TW/taishin-x/logo.webp' });
  assert.deepEqual(data.offerings, ['zh-TW/digirunner']);
  assert.equal(data.industry, 'finance');
  assert.equal(data.seoTitle, '台新銀行：現金業務API管理平台');
  assert.equal(data.sourceUrl, 'https://www.tpisoftware.com/success-story');
  assert.ok(notes.some((n) => n.startsWith('dated: 該平台獲全球金融雜誌')));
  assert.ok(notes.some((n) => /^description is \d+ characters/.test(n)));
  const other = caseEntry({ locale: 'zh-TW', slug: 'x', card, order: 1, client: { slug: 'x', name: { 'zh-TW': '彰化銀行' } }, logoFile: 'logo.png', override: { description: '短描述' }, offeringExists: () => false });
  assert.ok(other.notes.includes('client name "彰化銀行" is not in the description'));
  assert.equal(other.data.description, '短描述');
  assert.equal(other.data.offerings, undefined);
  assert.throws(() => caseEntry({ locale: 'vi', slug: 'x', card, order: 1, client, logoFile: 'logo.png', offeringExists: () => false }), /no vi name/);
});

test('the client mapping serializes to one frontmatter line', () => {
  const text = serializeFrontmatter({ client: { name: 'Taiwan Mobile Co., Ltd.', disclosed: true, logo: '../a/logo.webp' } });
  assert.equal(text, '---\nclient: { name: "Taiwan Mobile Co., Ltd.", disclosed: true, logo: ../a/logo.webp }\n---\n');
});

test('parseOverrides checks clients and entries', () => {
  assert.deepEqual(parseOverrides(''), { clients: {}, entries: {} });
  assert.throws(() => parseOverrides('client: {}\n'), /unknown top-level keys client/);
  assert.throws(() => parseOverrides('clients:\n  a: { name: { zh-TW: A } }\n'), /needs a lowercase slug/);
  assert.throws(() => parseOverrides('clients:\n  a: { slug: a, name: { ja: A } }\n'), /needs name/);
  assert.throws(() => parseOverrides('entries:\n  taishin-x: { description: d }\n'), /is not <locale>\/<slug>/);
  assert.throws(() => parseOverrides('entries:\n  zh-TW/x: { industry: other }\n'), /unknown keys industry/);
});

test('case-studies.yaml parses', () => {
  const { clients } = parseOverrides(readFileSync(OVERRIDES, 'utf8'));
  assert.ok(Object.keys(clients).length > 0);
});

test('cardDescription replaces the card text for the body, offerings and description', () => {
  // The parsed card's description names digiRunner, which would add an offering
  const [card] = parseCards(CHUNK);
  const client = { slug: 'cathay-life', name: { 'zh-TW': '國泰人壽' } };
  const { data, body, notes } = caseEntry({ locale: 'zh-TW', slug: 'x', card, order: 1, client, logoFile: 'logo.png', override: { cardDescription: '協助國泰人壽建置日誌平台。' }, offeringExists: () => true });
  assert.equal(body, '協助國泰人壽建置日誌平台。');
  assert.equal(data.description, '協助國泰人壽建置日誌平台。');
  assert.equal(data.offerings, undefined);
  assert.equal('cardDescription' in data, false);
  assert.ok(notes.includes('card description replaced (cardDescription)'));
});
