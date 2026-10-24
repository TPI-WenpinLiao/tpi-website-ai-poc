// Tests for scripts/content/migrate/esg-advisory.mjs. Run: npm run test:scripts

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extractPerson, extractService, parseOverrides, personDescription, personFrontmatter, serviceFrontmatter, splitList, teamNotes } from './esg-advisory.mjs';

// https://www.tpisoftware.com/esg-advisory, trimmed to two team cards, one strategy card and two questions
// (data-v-* attributes dropped)
const SERVICE = `<html><head><meta data-n-head="ssr" name="description" content="面對氣候變遷和相關社經議題的關注增加，
企業減碳行動刻不容緩。"></head><body>
<section class="esg-advisory__wrapper"><h1 class="esg-advisory__title"><span class="title">ESG Consulting Services</span>
  <span class="subtitle">ESG 永續發展與顧問服務</span></h1><div class="esg-advisory__info"><h3 class="slogan"></h3></div></section>
<h2 class="section01__title">面對氣候變遷，<br>減碳行動刻不容緩。 </h2>
<ul class="section03__list">
  <li class="section03__list-item"><a href="/esg-advisory/chen-zhengrui" class="section03-card section03-card--link">
    <div class="section03-card-text"><span class="section03-card__name">陳政叡</span> <span class="section03-card__job">顧問</span></div></a></li>
  <li class="section03__list-item"><div class="section03-card">
    <div class="section03-card-text"><span class="section03-card__name">鄭迦聲</span> <span class="section03-card__job">講師</span></div></div></li>
</ul>
<ul class="section04__list"><li class="section04__list-item"><div class="section04-card"><div class="section04-card__number">1</div>
  <div class="section04-card__title">訂立目標<br>永續承諾 </div>
  <p class="section04-card__content">
    透過 ESG 三大面向分析企業當前表現， 以法規趨勢為立基。
  </p></div></li></ul>
<div class="faq-list">
  <div class="faq-item"><h4 class="faq-item__question">
    Q1：為什麼要做 ESG？
  </h4> <div class="faq-item__answer"><a class="answer-content">
    因應國際減碳協議與國內淨零政策。
  </a></div></div>
  <div class="faq-item"><h4 class="faq-item__question">Q2：誰需要做 ESG ?</h4>
  <div class="faq-item__answer"><a class="answer-content">A：隨著金管會發布「上市櫃公司永續發展路徑圖」。</a></div></div>
</div>
</body></html>`;

// https://www.tpisoftware.com/en/esg-advisory/huang-zhijun, trimmed to one item per section
const PERSON = `<html><body>
<div class="banner-info"><div class="banner__name">Chih-Chun Huang</div> <div class="banner__job">Adjunct Assistant Professor</div></div>
<div class="banner__detail">
  National Kaohsiung First University of Science and Technology
</div>
<ul class="section01__list"><li class="section01__list-item">
  <div class="section01-section"><div class="section01__title">Professional Experience</div>
    <ul class="section01-section__list"><li class="section01-section__list-item">External ESG auditor &amp; instructor at TUV-NORD</li></ul></div>
  <div class="section01-section"><div class="section01__title">Education</div>
    <ul class="section01-section__list"><li class="section01-section__list-item">M.S. in Computer and Communication Engineering</li></ul></div>
</li><li class="section01__list-item">
  <div class="section01-section"><div class="section01__title">Expertise</div>
    <ul class="section01-section__list no-disc"><li class="section01-section__list-item">ESG auditing, ESG consulting</li></ul></div>
  <div class="section01-section"><div class="section01__title">Certification</div>
    <ul class="section01-section__list"><li class="section01-section__list-item">TUV-NORD ESG Verifier</li></ul></div>
</li></ul>
</body></html>`;

test('extractService reads the ESG advisory page', () => {
  assert.deepEqual(extractService(SERVICE), {
    title: 'ESG 永續發展與顧問服務',
    tagline: '面對氣候變遷，減碳行動刻不容緩。',
    description: '面對氣候變遷和相關社經議題的關注增加， 企業減碳行動刻不容緩。',
    features: [{ title: '訂立目標 永續承諾', body: '透過 ESG 三大面向分析企業當前表現，以法規趨勢為立基。' }],
    faq: [
      { question: '為什麼要做 ESG？', answer: '因應國際減碳協議與國內淨零政策。' },
      { question: '誰需要做 ESG ?', answer: '隨著金管會發布「上市櫃公司永續發展路徑圖」。' },
    ],
    team: [
      { name: '陳政叡', slug: 'chen-zhengrui' },
      { name: '鄭迦聲', slug: undefined },
    ],
  });
});

test('extractService strips the en and vi question numbers', () => {
  const en = SERVICE.replace('Q1：為什麼要做 ESG？', 'Q1: Why does ESG matter?').replace('A：隨著', 'A: 隨著');
  assert.equal(extractService(en).faq[0].question, 'Why does ESG matter?');
  assert.equal(extractService(en).faq[1].answer, '隨著金管會發布「上市櫃公司永續發展路徑圖」。');
  const vi = SERVICE.replace('Q1：為什麼要做 ESG？', 'Câu 1: Tại sao ESG lại quan trọng?').replace('Q2：', 'Câu hỏi 2: ');
  assert.deepEqual(
    extractService(vi).faq.map((f) => f.question),
    ['Tại sao ESG lại quan trọng?', '誰需要做 ESG ?'],
  );
});

test('extractService fails when the template changed instead of writing empty fields', () => {
  assert.throws(() => extractService(SERVICE.replace('class="section01__title"', 'class="heading"')), /not found on the page.*tagline/);
  assert.throws(() => extractService(SERVICE.replace('section04-card__content', 'text')), /features\.0/);
  assert.throws(() => extractService(SERVICE.replaceAll('faq-item"', 'qa-item"')), /faq/);
});

test('extractPerson reads the sections by their heading', () => {
  assert.deepEqual(extractPerson(PERSON), {
    name: 'Chih-Chun Huang',
    jobTitle: 'Adjunct Assistant Professor',
    affiliation: 'National Kaohsiung First University of Science and Technology',
    experience: ['External ESG auditor & instructor at TUV-NORD'],
    education: ['M.S. in Computer and Communication Engineering'],
    expertise: ['ESG auditing', 'ESG consulting'],
    certifications: ['TUV-NORD ESG Verifier'],
  });
  assert.throws(() => extractPerson(PERSON.replace('>Education<', '>Awards<')), /unknown section "Awards"/);
  assert.equal(extractPerson(PERSON.replace(/<div class="banner__detail">[\s\S]*?<\/div>/, '<div class="banner__detail"> </div>')).affiliation, undefined);
});

test('splitList splits at 、 and commas outside parentheses', () => {
  assert.deepEqual(splitList('永續發展、碳輔導(減碳策略培育)、能源轉型'), ['永續發展', '碳輔導(減碳策略培育)', '能源轉型']);
  assert.deepEqual(splitList('GHG (ISO 14064-1, ISO 14067), PCF'), ['GHG (ISO 14064-1, ISO 14067)', 'PCF']);
});

test('personDescription adds expertise items while the description fits, and drops a long affiliation', () => {
  const p = { name: '陳政叡', jobTitle: '顧問', affiliation: '國立高雄科技大學生態工程科技中心', expertise: ['永續發展', '碳輔導', '能源轉型'] };
  assert.equal(personDescription('zh-TW', p), '陳政叡（顧問｜國立高雄科技大學生態工程科技中心），昕力資訊 ESG 顧問團隊成員。專長：永續發展、碳輔導、能源轉型。');
  assert.equal(
    personDescription('zh-TW', { ...p, expertise: ['永續發展', '長'.repeat(40)] }),
    '陳政叡（顧問｜國立高雄科技大學生態工程科技中心），昕力資訊 ESG 顧問團隊成員。專長：永續發展。',
  );
  const long = personDescription('en', { name: 'Bo-Yuan Zhao', jobTitle: 'Project Manager', affiliation: 'x'.repeat(150), expertise: ['IoT'] });
  assert.equal(long, "Bo-Yuan Zhao (Project Manager) is a member of TPIsoftware's ESG consulting team. Expertise: IoT.");
});

test('frontmatter applies overrides and rejects unknown keys', () => {
  const page = extractService(SERVICE);
  const data = serviceFrontmatter({ sourceUrl: 'https://www.tpisoftware.com/esg-advisory', page, override: { frontmatter: { description: '短' } } });
  assert.deepEqual(Object.keys(data), ['title', 'description', 'translationKey', 'node', 'kind', 'tagline', 'features', 'faq', 'cta', 'sourceUrl']);
  assert.equal(data.description, '短');
  assert.equal(data.kind, 'service');
  assert.throws(() => serviceFrontmatter({ sourceUrl: '', page, override: { frontmatter: { heroImage: 'x' } } }), /unknown frontmatter keys heroImage/);

  const person = personFrontmatter({ locale: 'en', slug: 'huang-zhijun', sourceUrl: 'https://www.tpisoftware.com/en/esg-advisory/huang-zhijun', page: extractPerson(PERSON) });
  assert.equal(person.translationKey, 'huang-zhijun');
  assert.equal(person.title, 'Chih-Chun Huang');
  assert.ok(!('photo' in person));
});

test('parseOverrides checks the entry ids and keys', () => {
  assert.deepEqual(parseOverrides('person/zh-TW/chen-zhengrui:\n  frontmatter:\n    description: x\n'), { 'person/zh-TW/chen-zhengrui': { frontmatter: { description: 'x' } } });
  assert.throws(() => parseOverrides('zh-TW/chen-zhengrui:\n  frontmatter: {}\n'), /is not <offering\|person>/);
  assert.throws(() => parseOverrides('person/zh-TW/chen-zhengrui:\n  alt: {}\n'), /unknown keys alt/);
});

test('teamNotes compares the team cards with page-map.csv', () => {
  const team = [
    { name: '陳政叡', slug: 'chen-zhengrui' },
    { name: 'SHU-HUI LI', slug: 'li-shuhi' },
    { name: '鄭迦聲', slug: undefined },
  ];
  assert.deepEqual(teamNotes(team, ['chen-zhengrui', 'huang-zhijun']), [
    'team cards without an advisor page: 鄭迦聲',
    'team links not in page-map.csv: SHU-HUI LI → li-shuhi',
    'page-map.csv advisors not linked from the team: huang-zhijun',
  ]);
});
