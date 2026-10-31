// Home page copy in zh-TW. Facts (case titles and results, OrientAI features) come from the fact
// library through fact('<id>') (docs/strategy/facts.yaml, #163); the rest is wording, written here.
// The wording is still the current site's (M3-04, #17) until the pages are rewritten from the
// messaging framework. `node scripts/strategy/facts.mjs` fails when a line here has a number or a
// client name that none of the facts this file uses has.
// Names, paths and order come from docs/ia (src/lib/ia/navigation.ts), not from here.
// The en and vi files (M7) satisfy the same Home type, so a missing line fails astro check.

import { fact } from '../facts.ts';

const hero = {
  // U+200B marks the only break point the title may take (PageHero)
  title: '以頂尖科技\u200b為企業賦能',
  description: '以客戶利益為導向，致力於提供創新技術及軟體解決方案。',
};

// One line per product family, keyed by node id; family-security is a new page with no copy yet
const familyLines: Record<string, string> = {
  'family-ai': '企業級 AI Agent 應用平台',
  'family-dx': '專為關鍵應用設計的\u200b高可用性數位中台',
  'family-esg': '碳管理 × 能源管理，助企業邁向低碳永續',
};

const orientAi = {
  node: 'orient-ai',
  eyebrow: '企業級 Agentic AI 平台',
  title: '讓 AI 不只會回答\u3000更能真正做事',
  features: [fact('orientai-multi-agent'), fact('orientai-governance'), fact('orientai-token-cost')],
  action: '探索 OrientAI',
};

// Industry taglines, keyed by node id; industry-manufacturing has no copy yet
const industryLines: Record<string, string> = {
  'industry-finance': '開放銀行：以開放應用程式介面（OpenAPI）共享相關數據資料，為客戶提供更多元及便利的服務。',
  'industry-government': '智慧政府 Open API 開放資料應用',
};

// Case highlights. They name no client. `node` is the page the current site links to; the
// highlight without a link goes to the success-story listing.
const cases: { node: string; title: string; summary: string }[] = [
  { node: 'smartclaim', title: fact('smartclaim-title'), summary: fact('smartclaim-result') },
  { node: 'smartfilling', title: fact('smartfilling-title'), summary: fact('smartfilling-result') },
  { node: 'success-stories', title: fact('fraud-platform-title'), summary: fact('fraud-platform-result') },
];

const contactCta = {
  title: '您的需求，我們用心傾聽',
  description: '若有任何問題或建議，請留下聯絡資訊，我們會請專人向您進一步說明。',
};

// A space between Chinese and an adjoining Latin letter, on that side only (「看 AI 產品家族」,
// 「看 ESG 與能源產品家族」)
const spaced = (word: string) => `${/^[A-Za-z]/.test(word) ? ' ' : ''}${word}${/[A-Za-z]$/.test(word) ? ' ' : ''}`;

export const home = {
  // <title> and description of the home page, which carries no site-name suffix
  meta: {
    title: 'TPIsoftware 昕力資訊｜以頂尖科技為企業賦能',
    description:
      '昕力資訊以客戶利益為導向，致力於提供創新技術及軟體解決方案：AI、數位轉型、資安、ESG 與能源四個產品家族，以及委外、雲端整合、UI/UX 設計與 ESG 顧問等服務。',
  },
  hero,
  familyLines,
  orientAi,
  industryLines,
  cases,
  contactCta,
  labels: {
    families: '產品家族',
    // Link under a family chapter; `family` is the family name without its brand
    familyLink: (family: string) => `看${spaced(family)}產品家族`,
    orientFeatures: 'OrientAI 特色',
    // Button to a listing; `listing` is its name
    all: (listing: string) => `所有${listing}`,
    latest: '最新文章與新聞',
  },
};

export type Home = typeof home;
