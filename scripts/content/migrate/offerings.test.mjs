// Tests for scripts/content/migrate/offerings.mjs. Run: npm run test:scripts

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Commented, serializeFrontmatter } from './frontmatter.mjs';
import { extractSolution, parseOverrides, solutionFrontmatter } from './offerings.mjs';

// https://www.tpisoftware.com/solutions/smartclaim, trimmed to one item per list (data-v-* attributes dropped)
const PAGE = `<html><head><meta data-n-head="ssr" name="description" content="過去在受理理賠案件時，
保險業者需投注大量人力成本。"></head><body>
<section class="solution__banner-wrapper" style="--bg-image:url(/images/solution/smartclaim/banner.png);--bg-image-mobile:url(/images/solution/smartclaim/banner-mobile.png);">
  <h1 class="solution__banner-title"><span class="title">SysTalk.ai</span>
    <span class="subtitle">AI 智能理賠解決方案</span></h1>
  <div class="solution__banner-info"><h3 class="slogan">整合 AI 加速理賠流程 持續進化</h3></div>
</section>
<section class="solution__slogan-wrapper"><h2 class="title">全球保險業的轉型新未來</h2><p class="contents">介紹段</p></section>
<ul class="solution__feature01-main">
  <li class="solution__feature01-item">
    <label class="feature01-item-control"><div class="control-title">AI OCR 助快速登打</div></label>
    <div class="feature01-item-content"><div class="title">自動建檔</div><h3 class="subtitle">AI OCR 助快速登打</h3>
      <p class="contents">可自動統整保戶診斷書及單據格式。</p></div>
  </li>
</ul>
<section class="solution__feature03-wrapper"><h3 class="feature03-item__title">省時省力</h3></section>
<ul class="solution__case-list"><div class="list-item">
  <div class="list-item__tag"><h3 class="list-item__tag--content">保險業 - 醫療文件解析</h3></div>
  <p class="list-item__content">藉由自然語言技術，分析診斷證明書。</p>
</div></ul>
</body></html>`;

test('extractSolution reads the shared solution template', () => {
  assert.deepEqual(extractSolution(PAGE), {
    title: 'SysTalk.ai AI 智能理賠解決方案',
    tagline: '整合 AI 加速理賠流程 持續進化',
    description: '過去在受理理賠案件時， 保險業者需投注大量人力成本。',
    banner: '/images/solution/smartclaim/banner.png',
    features: [{ title: 'AI OCR 助快速登打', body: '可自動統整保戶診斷書及單據格式。' }],
    useCases: [{ title: '保險業 - 醫療文件解析', body: '藉由自然語言技術，分析診斷證明書。' }],
  });
});

test('extractSolution fails when the template changed instead of writing empty fields', () => {
  assert.throws(() => extractSolution(PAGE.replace('class="slogan"', 'class="motto"')), /not found on the page.*tagline/);
  assert.throws(() => extractSolution(PAGE.replace('class="contents">可自動', 'class="text">可自動')), /item 0/);
});

test('solutionFrontmatter applies overrides and links use cases to industries', () => {
  const page = extractSolution(PAGE);
  const hero = new Commented('../../../assets/offering/zh-TW/smartclaim/hero.webp', 'https://www.tpisoftware.com/images/solution/smartclaim/banner.png');
  const data = solutionFrontmatter({
    node: 'smartclaim',
    sourceUrl: 'https://www.tpisoftware.com/solutions/smartclaim',
    page,
    hero,
    override: { frontmatter: { description: '改寫' }, useCaseIndustry: { 0: 'finance' } },
  });
  assert.equal(
    serializeFrontmatter(data),
    [
      '---',
      'title: SysTalk.ai AI 智能理賠解決方案',
      'description: 改寫',
      'translationKey: smartclaim',
      'node: smartclaim',
      'kind: solution',
      'tagline: 整合 AI 加速理賠流程 持續進化',
      '# https://www.tpisoftware.com/images/solution/smartclaim/banner.png',
      'heroImage: ../../../assets/offering/zh-TW/smartclaim/hero.webp',
      'features:',
      '  - title: AI OCR 助快速登打',
      '    body: 可自動統整保戶診斷書及單據格式。',
      'useCases:',
      '  - title: 保險業 - 醫療文件解析',
      '    body: 藉由自然語言技術，分析診斷證明書。',
      '    industry: finance',
      'cta: contact',
      'sourceUrl: https://www.tpisoftware.com/solutions/smartclaim',
      '---',
      '',
    ].join('\n'),
  );
  const base = { node: 'smartclaim', sourceUrl: 'https://x', page, hero };
  assert.throws(() => solutionFrontmatter({ ...base, override: { useCaseIndustry: { 3: 'finance' } } }), /use cases the page does not have: 3/);
  assert.throws(() => solutionFrontmatter({ ...base, override: { frontmatter: { summary: 'x' } } }), /unknown frontmatter keys summary/);
});

test('parseOverrides checks entry ids, keys and industries', () => {
  assert.deepEqual(parseOverrides(''), {});
  assert.deepEqual(parseOverrides('zh-TW/gis:\n  useCaseIndustry:\n    0: finance\n'), { 'zh-TW/gis': { useCaseIndustry: { 0: 'finance' } } });
  assert.throws(() => parseOverrides('offering/zh-TW/gis: {}\n'), /is not <locale>\/<node>/);
  assert.throws(() => parseOverrides('zh-TW/gis:\n  alt: {}\n'), /unknown keys alt/);
  assert.throws(() => parseOverrides('zh-TW/gis:\n  useCaseIndustry:\n    0: insurance\n'), /useCaseIndustry 0: insurance/);
});
