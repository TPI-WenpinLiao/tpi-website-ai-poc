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
    lead: '昕力資訊（TPIsoftware）自行研發產品，也負責導入規劃與建置。',
    secondary: '依產業看方案',
  },
  mapLabels: { core: '核心系統', legacy: '既有系統', product: '昕力的產品', model: 'AI 模型', service: '新的服務' },
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
      { node: 'success-stories', name: fact('fraud-platform-title'), result: fact('fraud-platform-result'), link: '看所有成功案例' },
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
  // ContactCta on the other pages (the current site's wording, kept from M3-04)
  contactCta: {
    title: '您的需求，我們用心傾聽',
    description: '若有任何問題或建議，請留下聯絡資訊，我們會請專人向您進一步說明。',
  },
  contact: {
    title: '合作得久，有紀錄可查',
    records: [
      { label: '2005', text: fact('company-founded') },
      { label: '2008', text: fact('company-milestone-2008-finance') },
      { label: '資安認證', text: fact('cert-iso27001-product-platform') },
    ],
    action: '聯絡業務',
  },
};
