// Home page copy in zh-TW (#167), from the approved ribbon-route prototype
// (docs/strategy/concepts/ribbon-route/index.html, README「與 copy-deck 不同的文字（已定案）」) and
// docs/strategy/briefs/home.md. Facts come from the fact library through fact('<id>')
// (docs/strategy/facts.yaml); the rest is wording, written here. `node scripts/strategy/facts.mjs`
// fails when a line here has a number or a client name that none of the facts this file uses has.

import { fact } from '../facts.ts';
import type { Home } from './types.ts';

export const home: Home = {
  meta: {
    title: '昕力資訊 TPIsoftware｜金融與政府的 API 與 AI 軟體',
    description:
      '昕力資訊（TPIsoftware）研發並導入自有軟體，替金融與政府把 API、資料與 AI 安全接進既有系統，產品家族涵蓋 AI、數位轉型（DigiLism）、資安與 ESG。',
  },
  hero: {
    title: '金融與政府的既有系統\n原地接上 API 與 AI',
    mapAlt: '白色方塊排成的系統地圖：一條緞帶從深灰色的核心系統出發，經過頂面塗紫的昕力產品、品紅的 AI 模型與橘色的新服務，由紫轉品紅再轉橘，從地圖前緣往下伸出。',
    lead: '昕力資訊（TPIsoftware）自行研發產品，也負責導入規劃與建置。',
    secondary: '依產業看方案',
  },
  industries: {
    title: '規範要求，\n已做進產品',
    entries: {
      'industry-finance': { text: fact('digirunner-open-banking-fsc'), link: '看金融業方案' },
      'industry-government': { text: fact('digirunner-ndc-spec'), link: '看政府與公部門方案' },
    },
  },
  cases: {
    title: 'AI 已用在\n每天的作業',
    count: '第 {n} 則，共 {total} 則',
    items: [
      { node: 'smartclaim', name: fact('smartclaim-title'), result: fact('smartclaim-result'), link: '看 AI 智慧理賠方案' },
      { node: 'smartfilling', name: fact('smartfilling-title'), result: fact('smartfilling-result'), link: '看 AI 智慧建檔方案' },
      // The third AI result names AI and its result in its own text (briefs/home.md「取捨」第 9 項, #187);
      // the fraud platform's text names no AI, so it moved to the finance page's cases
      { node: 'industry-finance', name: fact('smartfilling-case-bank-title'), result: fact('smartfilling-case-bank'), link: '金融業的 AI 應用' },
    ],
  },
  products: {
    title: 'API、AI、資安\n與碳管理，各有產品',
    nodes: ['digirunner', 'systalk-viki', 'gadodido', 'greenswift'],
  },
  orientAi: {
    node: 'orient-ai',
    title: '企業要用 AI，\n資料留在企業端。',
    // The fact is the current site's answer to "does the data leave the company?"; the question is
    // wording, so the answer's 不會 has something to answer (#167 plan)
    quote: `資料會離開企業嗎？「${fact('orientai-on-prem-data')}」`,
    link: '認識 OrientAI 企業級 Agentic AI 平台',
  },
  // ContactCta on the other pages and the contact page's lead (#167): the heading says the next
  // step (briefs/home.md「聯絡業務」, briefs/digirunner.md「預約演示」), not a feeling; no reply time,
  // which the fact library doesn't have
  contactCta: {
    title: '談需求，或預約演示',
    description: '留下您的系統現況與想解決的問題，昕力的業務與顧問會與您聯絡，安排說明或演示。',
  },
  // Records (#183): DM-6's facts plus the awards confirmed in #180, by year, the certificate last.
  // Six fill two rows of three. One award per prize: Taiwan Excellence 2024 only (2023 names the
  // same products); no Gartner 2018 (messaging.md DM-8)
  contact: {
    title: '合作得久，有紀錄可查',
    records: [
      { label: '2005', text: fact('company-founded') },
      { label: '2008', text: fact('company-milestone-2008-finance') },
      { label: '2020', text: fact('company-employees-630') },
      { label: '2022', text: fact('award-ft-high-growth-2022') },
      { label: '2024', text: fact('award-taiwan-excellence-2024') },
      { label: '資安認證', text: fact('cert-iso27001-product-platform') },
    ],
    action: '聯絡業務',
    about: '關於昕力',
  },
};
