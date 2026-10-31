// Tests for scripts/content/migrate/offerings.mjs. Run: npm run test:scripts

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { serializeFrontmatter } from './frontmatter.mjs';
import {
  extractAiso,
  extractChatGptEnterprise,
  extractCloudService,
  extractOrientAi,
  extractOutsourcing,
  extractResource,
  extractSolution,
  groupEntries,
  hubFrontmatter,
  offeringFrontmatter,
  parseOverrides,
} from './offerings.mjs';

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
    features: [{ title: 'AI OCR 助快速登打', body: '可自動統整保戶診斷書及單據格式。' }],
    useCases: [{ title: '保險業 - 醫療文件解析', body: '藉由自然語言技術，分析診斷證明書。' }],
  });
});

test('extractSolution fails when the template changed instead of writing empty fields', () => {
  assert.throws(() => extractSolution(PAGE.replace('class="slogan"', 'class="motto"')), /not found on the page.*tagline/);
  assert.throws(() => extractSolution(PAGE.replace('class="contents">可自動', 'class="text">可自動')), /features\.0/);
  assert.throws(() => extractSolution(PAGE.replace('class="list-item__content"', 'class="text"')), /useCases\.0/);
});

test('offeringFrontmatter applies overrides and links use cases to industries', () => {
  const page = extractSolution(PAGE);
  const data = offeringFrontmatter({
    node: 'smartclaim',
    sourceUrl: 'https://www.tpisoftware.com/solutions/smartclaim',
    page,
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
  const base = { node: 'smartclaim', sourceUrl: 'https://x', page };
  assert.throws(() => offeringFrontmatter({ ...base, override: { useCaseIndustry: { 3: 'finance' } } }), /use cases the page does not have: 3/);
  assert.throws(() => offeringFrontmatter({ ...base, override: { frontmatter: { summary: 'x' } } }), /unknown frontmatter keys summary/);
  assert.equal(offeringFrontmatter({ ...base, override: { frontmatter: { seoTitle: 'Short' } } }).seoTitle, 'Short');
});

test('parseOverrides checks entry ids, keys and industries', () => {
  assert.deepEqual(parseOverrides(''), {});
  assert.deepEqual(parseOverrides('zh-TW/gis:\n  useCaseIndustry:\n    0: finance\n'), { 'zh-TW/gis': { useCaseIndustry: { 0: 'finance' } } });
  assert.throws(() => parseOverrides('offering/zh-TW/gis: {}\n'), /is not <locale>\/<node>/);
  assert.throws(() => parseOverrides('zh-TW/gis:\n  alt: {}\n'), /unknown keys alt/);
  assert.throws(() => parseOverrides('zh-TW/gis:\n  useCaseIndustry:\n    0: insurance\n'), /useCaseIndustry 0: insurance/);
});

// https://www.tpisoftware.com/orient-ai, trimmed to one card and two questions (data-v-* attributes dropped)
const ORIENT_AI = `<html><head><title>OrientAI 企業級 Agentic AI 平台 - 昕力資訊TPIsoftware</title>
<meta name="description" content="OrientAI 為企業級 Agentic AI 平台。"></head><body>
<div class="banner"><img src="/images/orient-ai/logo.png" alt> <h1 class="h1">安全可控的企業級 Agentic AI 平台</h1>
<div class="sp-text-wrapper desktop"><span class="sp-text">從任務執行到全局治理，OrientAI 讓企業 AI 真正可管、可控、可擴展</span> <span class="sp-text sp-text-front">從任務執行到全局治理，OrientAI 讓企業 AI 真正可管、可控、可擴展</span></div>
<div class="sp-text-wrapper mobile"><span class="sp-text">從任務執行到全局治理
OrientAI 讓企業 AI</span></div></div>
<div class="section01"><h2 class="h2 desktop">OrientAI｜從 AI 執行到治理</h2><div class="card-grid"><div class="card"><img src="/images/orient-ai/section01/icon01.svg" alt="多代理協作" class="card-logo"> <h3 class="h3">多代理協作</h3> <div class="card-content">
  協調專業 Agent 自主執行任務，順暢運行在多個系統間
</div></div></div></div>
<div class="section06"><h2 class="h2">FAQ 常見問題</h2><ul class="ul">
<li tabindex="0" class="li"><h3 class="h3">資料會被拿來訓練第三方模型嗎？</h3> <div class="p"><p class="answer-text">不會。OrientAI 只會部署於企業端。</p></div></li>
<li tabindex="0" class="li"><h3 class="h3">企業導入 AI Agent 常面臨哪些瓶頸？</h3> <div class="p"><p class="answer-text">常見瓶頸包含：</p> <ul class="answer-list"><li class="answer-list__item"><strong class="answer-list__title">協作斷點</strong> <span class="answer-list__description">缺乏統一平台管理</span></li><li class="answer-list__item"><strong class="answer-list__title">資安疑慮</strong> <span class="answer-list__description">導致潛在外洩風險。</span></li></ul></div></li>
</ul></div></body></html>`;

test('extractOrientAi reads the orient-ai template and appends answer lists', () => {
  assert.deepEqual(extractOrientAi(ORIENT_AI), {
    title: 'OrientAI 企業級 Agentic AI 平台',
    tagline: '從任務執行到全局治理，OrientAI 讓企業 AI 真正可管、可控、可擴展',
    description: 'OrientAI 為企業級 Agentic AI 平台。',
    features: [{ title: '多代理協作', body: '協調專業 Agent 自主執行任務，順暢運行在多個系統間' }],
    faq: [
      { question: '資料會被拿來訓練第三方模型嗎？', answer: '不會。OrientAI 只會部署於企業端。' },
      { question: '企業導入 AI Agent 常面臨哪些瓶頸？', answer: '常見瓶頸包含：協作斷點：缺乏統一平台管理。資安疑慮：導致潛在外洩風險。' },
    ],
  });
  const en = ORIENT_AI.replace('企業導入 AI Agent 常面臨哪些瓶頸？', 'What are the common challenges?').replace('<strong class="answer-list__title">協作斷點</strong> <span class="answer-list__description">缺乏統一平台管理</span>', '<strong class="answer-list__title">Silos</strong> <span class="answer-list__description">No unified platform</span>');
  assert.match(extractOrientAi(en).faq[1].answer, / Silos: No unified platform\. /);
  assert.throws(() => extractOrientAi(ORIENT_AI.replace('class="card-content"', 'class="text"')), /features\.0/);
  assert.throws(() => extractOrientAi(ORIENT_AI.replace('sp-text-wrapper desktop', 'sp-text-wrapper')), /not found on the page.*tagline/);
  assert.throws(() => extractOrientAi(ORIENT_AI.replace('class="answer-text">不會', 'class="text">不會')), /faq\.0/);
  assert.throws(() => extractOrientAi(ORIENT_AI.replace('class="section06"', 'class="section08"')), /not found on the page.*faq$/);
});

// https://www.tpisoftware.com/aiso, trimmed to one card (data-v-* attributes and the icon dropped)
const AISO = `<html><head><title>昕力資訊</title></head><body>
<section id="aiso-hero" class="hero hero--extended"><div class="hero-content"><div class="hero-content-heading"><h1 class="hero-content-title"><span class="hero-content-title-content"><img src="/images/aiso/wordmark.png" alt="AISO" class="wordmark">主權 AI 解決方案</span></h1></div> <p class="hero-content-description">集結 AI 軟體與硬體廠商打造的 AI 整合生態系
協助企業快速建置可落地、可擴充、可合規的地端 AI 平台</p>
<ul class="solutions"><li class="solutions-card"><div class="solutions-card-heading"><span class="solutions-card-tag">法務</span></div> <h3 class="solutions-card-title">法務 AI 合約審閱</h3> <p class="solutions-card-description">整合合約審閱、擬約與條款檢索，於企業內部完成合約全流程處理。</p> <a href="https://aisoportal.com/zh-tw/bundled-solution/contract-review" class="solutions-card-more">了解更多</a></li></ul>
</div></section></body></html>`;

test('extractAiso reads the hero and the solution cards, the hero text standing in for the description', () => {
  const tagline = '集結 AI 軟體與硬體廠商打造的 AI 整合生態系 協助企業快速建置可落地、可擴充、可合規的地端 AI 平台';
  assert.deepEqual(extractAiso(AISO), {
    title: 'AISO 主權 AI 解決方案',
    tagline,
    description: tagline,
    features: [{ title: '法務 AI 合約審閱', body: '整合合約審閱、擬約與條款檢索，於企業內部完成合約全流程處理。' }],
  });
  assert.throws(() => extractAiso(AISO.replace('class="solutions-card"', 'class="card"')), /features$/);
});

test('groupEntries puts merge rows into the target entry sourceUrl', () => {
  const rows = [
    { url: 'https://www.tpisoftware.com/vn/orient-ai', locale: 'vi', node: 'orient-ai', disposition: 'rewrite' },
    { url: 'https://www.tpisoftware.vn/orient-aI', locale: 'vi', node: 'orient-ai', disposition: 'merge' },
    { url: 'https://www.tpisoftware.com/aiso', locale: 'zh-TW', node: 'aiso', disposition: 'rewrite' },
  ];
  const inventory = new Map([
    ['https://www.tpisoftware.com/vn/orient-ai', { final_url: 'https://www.tpisoftware.vn/orient-ai', to_confirm: '' }],
    ['https://www.tpisoftware.com/aiso', { final_url: 'https://www.tpisoftware.com/aiso', to_confirm: '疑似未翻譯' }],
  ]);
  assert.deepEqual(groupEntries(rows, inventory), [
    { id: 'vi/orient-ai', row: rows[0], sourceUrl: ['https://www.tpisoftware.vn/orient-ai', 'https://www.tpisoftware.vn/orient-aI'], toConfirm: [] },
    { id: 'zh-TW/aiso', row: rows[2], sourceUrl: 'https://www.tpisoftware.com/aiso', toConfirm: ['疑似未翻譯'] },
  ]);
  assert.throws(() => groupEntries([rows[1]], inventory), /vi\/orient-ai: needs exactly one keep or rewrite row, has 0/);
});

test('offeringFrontmatter writes kind, faq and cta for the orient-ai and aiso pages', () => {
  const data = offeringFrontmatter({ node: 'orient-ai', sourceUrl: ['https://a', 'https://b'], page: extractOrientAi(ORIENT_AI), kind: 'product', cta: 'demo' });
  assert.deepEqual(Object.keys(data), ['title', 'description', 'translationKey', 'node', 'kind', 'tagline', 'features', 'useCases', 'faq', 'cta', 'sourceUrl']);
  assert.equal(data.useCases, undefined);
  assert.equal(data.kind, 'product');
  assert.equal(data.faq.length, 2);
  assert.equal(data.cta, 'demo');
});

// https://www.tpisoftware.com/cloudservice, trimmed to one card per list (data-v-* attributes dropped)
const CLOUD = `<html><head><title>Cloud Service 雲端服務 - 昕力資訊TPIsoftware</title>
<meta name="description" content="雲端服務（Cloud Service）為企業實現靈活的系統轉換。"></head><body>
<h1 class="top-banner-title"><span class="title">Cloud Service</span> <span class="subtitle">雲端整合服務</span></h1>
<div class="top-banner-info"><h3 class="slogan">全域整合 ⬝ 靈活佈署</h3></div>
<div class="solutions__card-container"><div class="solutions__card-item"><img alt="雲端企業應用中台" class="card-img">
<h3 class="card-title">雲端企業應用中台</h3> <h4 class="card-subtitle">優化客戶體驗 加速創新打造新商模</h4>
<p class="card-text">DigiLism 完善企業雲端服務中台。</p></div><div class="solutions__card-item solutions__card-item--empty"></div></div>
<div class="applications__card-container"><div class="applications__card-item"><h3 class="card-title">BNPL 一站式雲端方案</h3>
<div class="card-text--md-container"><p class="card-text--md-container__text">以雲端 BNPL 因應全球在地化。</p></div></div>
<div class="applications__card-item applications__card-item--empty"></div></div></body></html>`;

test('extractCloudService reads the solution and industry cards and skips the empty grid cells', () => {
  assert.deepEqual(extractCloudService(CLOUD), {
    title: 'Cloud Service 雲端服務',
    tagline: '全域整合 ⬝ 靈活佈署',
    description: '雲端服務（Cloud Service）為企業實現靈活的系統轉換。',
    features: [{ title: '雲端企業應用中台', body: 'DigiLism 完善企業雲端服務中台。' }],
    useCases: [{ title: 'BNPL 一站式雲端方案', body: '以雲端 BNPL 因應全球在地化。' }],
  });
  assert.throws(() => extractCloudService(CLOUD.replaceAll('applications__card-item', 'item')), /useCases/);
});

// https://www.tpisoftware.com/outsourcing, trimmed to one expertise card
const OUTSOURCING = (slogan) => `<html><head><title>IT Outsourcing - TPIsoftware</title><meta name="description" content="TPIsoftware outsourcing."></head><body>
<h1 class="top-banner-title"><span class="title">OUTSOURCING</span> <span class="subtitle">Empower Your Business with Top Tech Talents</span></h1>
<div class="top-banner-info"><h3 class="slogan">${slogan}</h3></div>
<div class="expertise-cards"><div class="card-item"><div class="card-header purple">
  Back-End Development
  <a href="#expBackend" class="collapse-plus collapsed"></a></div><div class="card-content collapse"><p class="card-description">
  We build scalable and secure web and app:
</p> <ul class="card-list"><li>Java, C#</li> <li>
  Framework:<br>
  Spring, .NET
</li></ul></div></div></div></body></html>`;

test('extractOutsourcing joins each card description and list, and takes the h1 line when the slogan is empty', () => {
  assert.deepEqual(extractOutsourcing(OUTSOURCING('')), {
    title: 'IT Outsourcing',
    tagline: 'Empower Your Business with Top Tech Talents',
    description: 'TPIsoftware outsourcing.',
    features: [{ title: 'Back-End Development', body: 'We build scalable and secure web and app: Java, C#; Framework: Spring, .NET.' }],
  });
  assert.equal(extractOutsourcing(OUTSOURCING('專業團隊 ⬝ 量身打造')).tagline, '專業團隊 ⬝ 量身打造');
  const zh = OUTSOURCING('').replace('We build scalable and secure web and app:', '開發網頁與應用程式：').replace('Framework:', '框架：');
  assert.equal(extractOutsourcing(zh).features[0].body, '開發網頁與應用程式：Java, C#；框架：Spring, .NET。');
});

// https://www.tpisoftware.com/chatgpt-enterprise, trimmed to one item per section
const CHATGPT = `<html><head><title>ChatGPT Enterprise - 昕力資訊TPIsoftware</title></head><body>
<div class="banner"><h2 class="h2">ChatGPT Enterprise</h2> <h1 class="h1">企業AI升級 一站到位</h1></div>
<div class="section01"><h5 class="h5 desktop">ChatGPT Enterprise 專為企業設計，提供安全的 AI 能力</h5><h5 class="h5 mobile">ChatGPT Enterprise 專為企業設計 提供安全的 AI 能力</h5>
<div class="card"><h3 class="h3">企業級資安架構</h3><ul class="ul"><li class="li">不使用企業資料進行模型訓練</li><li class="li">企業級加密機制</li></ul></div></div>
<div class="section03"><ul class="ul"><li class="li"><div class="li-content"><h3 class="h3">直通原廠快速通道</h3><p class="p">大幅縮短申請時程，
並提供明確的資格評估。</p></div></li></ul></div>
<div class="section05"><ul class="ul"><li class="li"><h3 class="h3">是否有最低採購數量？</h3><p class="p">可依企業需求進行規劃與報價。</p></li></ul></div></body></html>`;

test('extractChatGptEnterprise reads the capability cards, the services and the FAQ', () => {
  assert.deepEqual(extractChatGptEnterprise(CHATGPT), {
    title: 'ChatGPT Enterprise',
    tagline: '企業AI升級 一站到位',
    description: 'ChatGPT Enterprise 專為企業設計，提供安全的 AI 能力',
    features: [
      { title: '企業級資安架構', body: '不使用企業資料進行模型訓練、企業級加密機制。' },
      { title: '直通原廠快速通道', body: '大幅縮短申請時程，並提供明確的資格評估。' },
    ],
    faq: [{ question: '是否有最低採購數量？', answer: '可依企業需求進行規劃與報價。' }],
  });
  assert.throws(() => extractChatGptEnterprise(CHATGPT.replace('section05', 'section06')), /faq/);
});

test('extractResource reads the name and line of /resource, and hubFrontmatter writes a hub entry', () => {
  const html = (title) => `<html><head><title>${title}</title></head><body><div class="resource-banner"><h6>Share good resources.</h6></div></body></html>`;
  const page = extractResource(html('TPIsoftware | Resource Center'));
  assert.deepEqual(page, { title: 'Resource Center', tagline: 'Share good resources.', description: 'Share good resources.' });
  assert.equal(extractResource(html('資源中心 - 昕力資訊 TPIsoftware')).title, '資源中心');
  assert.throws(() => extractResource(html('x').replace('resource-banner', 'banner')), /tagline/);

  const data = hubFrontmatter({ node: 'resources', sourceUrl: 'https://x', page, override: { frontmatter: { description: 'Rewritten' } } });
  assert.deepEqual(Object.entries(data), [
    ['title', 'Resource Center'],
    ['description', 'Rewritten'],
    ['translationKey', 'resources'],
    ['node', 'resources'],
    ['tagline', 'Share good resources.'],
    ['sourceUrl', 'https://x'],
  ]);
  assert.throws(() => hubFrontmatter({ node: 'resources', sourceUrl: 'https://x', page, override: { useCaseIndustry: { 0: 'finance' } } }), /no use cases/);
  assert.throws(() => hubFrontmatter({ node: 'resources', sourceUrl: 'https://x', page, override: { frontmatter: { kind: 'x' } } }), /unknown frontmatter keys kind/);
});
