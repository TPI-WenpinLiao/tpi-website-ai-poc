// Home page copy (M3-04, #17). Every line comes from the current site: `source.url` is the page it
// was taken from and `source.quote` the verbatim excerpt (omitted when `text` is the excerpt
// itself). `node scripts/design/home-content.mjs` fetches each source and fails when a quote is no
// longer on the page; it ignores whitespace and U+200B, so a heading the current site splits over
// two elements (「AI」「智慧理賠」) still matches.
// Names, paths and order come from docs/ia (src/lib/ia.ts), not from here.
// Blocks the current site has no copy for are left out and listed as 待確認 in the PR.

import { HOME, quoted, type Sourced } from './site.ts';

const ABOUT = 'https://www.tpisoftware.com/about-us';
const CONTACT = 'https://www.tpisoftware.com/contact-us';

export const hero = {
  // U+200B marks the only break point the title may take (PageHero)
  title: quoted('以頂尖科技\u200b為企業賦能', ABOUT),
  description: quoted(
    '以客戶利益為導向，致力於提供創新技術及軟體解決方案。',
    HOME,
    '更以客戶利益為導向，致力於提供創新技術及軟體解決方案',
  ),
};

// One line per product family, keyed by node id; family-security is a new page with no copy yet
export const familyLines: Record<string, Sourced> = {
  'family-ai': quoted('企業級 AI Agent 應用平台', 'https://www.tpisoftware.com/products/systalk-ai'),
  'family-dx': quoted('專為關鍵應用設計的\u200b高可用性數位中台', 'https://www.tpisoftware.com/products/digilism'),
  'family-esg': quoted('碳管理 × 能源管理，助企業邁向低碳永續', 'https://www.tpisoftware.com/products/esgswift'),
};

export const orientAi = {
  node: 'orient-ai',
  eyebrow: quoted('企業級 Agentic AI 平台', HOME),
  title: quoted('讓 AI 不只會回答\u3000更能真正做事', HOME),
  features: [quoted('多 Agent 協作', HOME), quoted('AI 治理', HOME), quoted('Token 成本控管', HOME)],
  action: quoted('探索 OrientAI', HOME),
};

// Industry taglines, keyed by node id; industry-manufacturing has no current-site copy
export const industryLines: Record<string, Sourced> = {
  'industry-finance': quoted(
    '開放銀行：以開放應用程式介面（OpenAPI）共享相關數據資料，為客戶提供更多元及便利的服務。',
    'https://www.tpisoftware.com/products/open-banking',
    '以開放應用程式介面（OpenAPI）共享相關數據資料，為客戶提供更多元及便利的服務',
  ),
  'industry-government': quoted('智慧政府 Open API 開放資料應用', 'https://www.tpisoftware.com/products/open-government'),
};

// Case highlights from the current home page. They name no client. `node` is the page the
// current site links to; the highlight without a link goes to the success-story listing.
export const cases: { node: string; title: Sourced; summary: Sourced }[] = [
  {
    node: 'smartclaim',
    title: quoted('AI 智慧理賠', HOME),
    summary: quoted('全自動執行理賠立案到派件，精確解析診斷書，節省逾80%\u200b人工作業時間', HOME),
  },
  {
    node: 'smartfilling',
    title: quoted('AI 智慧建檔', HOME),
    summary: quoted('透過免模板辨識醫療單據\u200b解決格式變動痛點，提升辨識率並降低40%維護人力', HOME),
  },
  {
    node: 'success-stories',
    title: quoted('金融聯防阻詐平台', HOME),
    summary: quoted('標準化聯防流程，詐騙事件即時共享，提升跨行交換的效率與透明度', HOME),
  },
];

export const contactCta = {
  title: quoted('您的需求，我們用心傾聽', CONTACT),
  description: quoted(
    '若有任何問題或建議，請留下聯絡資訊，我們會請專人向您進一步說明。',
    CONTACT,
    '若有任何問題或建議，請留下聯絡資訊我們會請專人向您進一步說明',
  ),
};

