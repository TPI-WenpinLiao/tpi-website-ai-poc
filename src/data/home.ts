// Home page copy (M3-04, #17). Every line comes from the current site: `source.url` is the page it
// was taken from and `source.quote` the verbatim excerpt (omitted when `text` is the excerpt
// itself). `node scripts/design/home-content.mjs` fetches each source and fails when a quote is no
// longer on the page; it ignores whitespace and U+200B, so a heading the current site splits over
// two elements (「AI」「智慧理賠」) still matches.
// Names, paths and order come from docs/ia (src/lib/ia/navigation.ts), not from here.
// Blocks the current site has no copy for are left out and listed as 待確認 in the PR.

import { HOME, quoted, type Sourced } from './site.ts';
import type { Locale } from '../lib/i18n/locales.ts';

const ABOUT = 'https://www.tpisoftware.com/about-us';
const CONTACT = 'https://www.tpisoftware.com/contact-us';
const CONTACT_EN = 'https://www.tpisoftware.com/en/contact-us';

export interface HomeCopy {
  // <title> and meta description; the home page writes its own title (no site-name suffix)
  title: string;
  description: string;
  hero: { title: Sourced; description: Sourced };
  // One line per product family, keyed by node id
  familyLines: Record<string, Sourced>;
  orientAi: { node: string; eyebrow: Sourced; title: Sourced; features: Sourced[]; action: Sourced };
  // Industry taglines, keyed by node id
  industryLines: Record<string, Sourced>;
  // Case highlights from the current home page. They name no client. `node` is the page the
  // current site links to; the highlight without a link goes to the success-story listing.
  cases: { node: string; title: Sourced; summary: Sourced }[];
}

const zhTW: HomeCopy = {
  title: 'TPIsoftware 昕力資訊｜以頂尖科技為企業賦能',
  description:
    '昕力資訊以客戶利益為導向，致力於提供創新技術及軟體解決方案：AI、數位轉型、資安、ESG 與能源四個產品家族，以及委外、雲端整合、UI/UX 設計與 ESG 顧問等服務。',
  hero: {
    // U+200B marks the only break point the title may take (PageHero)
    title: quoted('以頂尖科技\u200b為企業賦能', ABOUT),
    description: quoted(
      '以客戶利益為導向，致力於提供創新技術及軟體解決方案。',
      HOME,
      '更以客戶利益為導向，致力於提供創新技術及軟體解決方案',
    ),
  },
  // family-security is a new page with no copy yet
  familyLines: {
    'family-ai': quoted('企業級 AI Agent 應用平台', 'https://www.tpisoftware.com/products/systalk-ai'),
    'family-dx': quoted('專為關鍵應用設計的\u200b高可用性數位中台', 'https://www.tpisoftware.com/products/digilism'),
    'family-esg': quoted('碳管理 × 能源管理，助企業邁向低碳永續', 'https://www.tpisoftware.com/products/esgswift'),
  },
  orientAi: {
    node: 'orient-ai',
    eyebrow: quoted('企業級 Agentic AI 平台', HOME),
    title: quoted('讓 AI 不只會回答\u3000更能真正做事', HOME),
    features: [quoted('多 Agent 協作', HOME), quoted('AI 治理', HOME), quoted('Token 成本控管', HOME)],
    action: quoted('探索 OrientAI', HOME),
  },
  // industry-manufacturing has no current-site copy
  industryLines: {
    'industry-finance': quoted(
      '開放銀行：以開放應用程式介面（OpenAPI）共享相關數據資料，為客戶提供更多元及便利的服務。',
      'https://www.tpisoftware.com/products/open-banking',
      '以開放應用程式介面（OpenAPI）共享相關數據資料，為客戶提供更多元及便利的服務',
    ),
    'industry-government': quoted('智慧政府 Open API 開放資料應用', 'https://www.tpisoftware.com/products/open-government'),
  },
  cases: [
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
  ],
};

// en copy from the current en site; the title is the current en home page's <title> with the
// site's separator, the description a translation of the zh-TW one cut to 160 characters
const HOME_EN = 'https://www.tpisoftware.com/en';
const en: HomeCopy = {
  title: 'TPIsoftware | Leading Enterprise Software Solutions Provider',
  description:
    'TPIsoftware provides innovative technologies and software solutions: AI, digital transformation, security, and ESG and energy product families, plus services.',
  hero: {
    // The en about page's hero, where the zh-TW title comes from too
    title: quoted('Reinventing with AI for a Greener Future', 'https://www.tpisoftware.com/en/about-us'),
    description: quoted(
      'We strive to provide innovative technologies and software solutions.',
      HOME_EN,
      'we strive to provide innovative technologies and software solutions',
    ),
  },
  // The taglines of the en family pages (src/content/hub/en)
  familyLines: {
    'family-ai': quoted('AI-Driven Business Innovations', 'https://www.tpisoftware.com/en/products/systalk-ai'),
    'family-dx': quoted('An API-first digital middle platform for mission critical systems', 'https://www.tpisoftware.com/en/products/digilism'),
    'family-esg': quoted('Smart Carbon and Energy Management Toward Greener Future', 'https://www.tpisoftware.com/en/products/esgswift'),
  },
  orientAi: {
    node: 'orient-ai',
    eyebrow: quoted('Enterprise Agentic AI Platform', HOME_EN),
    title: quoted('Operationalizing AI for Value', HOME_EN),
    features: [quoted('Agent Collaboration', HOME_EN), quoted('AI Governance', HOME_EN), quoted('Maximized ROI', HOME_EN)],
    action: quoted('Learn More', HOME_EN),
  },
  industryLines: {
    // The page writes "infromation"
    'industry-finance': quoted(
      'Under the agreement of the banking customer, usage of information is provided to a Third-Party Service Provider through the OpenAPI.',
      'https://www.tpisoftware.com/en/products/open-banking',
      'Under the agreement of the banking customer, usage of infromation is provided to a Third-Party Service Provider through the OpenAPI.',
    ),
    'industry-government': quoted('Open API Applications for Smart Government', 'https://www.tpisoftware.com/en/products/open-government'),
  },
  cases: [
    {
      node: 'smartclaim',
      title: quoted('AI-Enhanced Insurance Claims Process', HOME_EN),
      summary: quoted('Automate the insurance claims process with enhanced analysis and efficient claims management, reducing manual effort by 80%', HOME_EN),
    },
    {
      node: 'smartfilling',
      title: quoted('AI Optical Character Recognition', HOME_EN),
      summary: quoted('Reduce 40% of maintenance effort with recognition accuracy using an adaptive approach to varying layouts and formatting', HOME_EN),
    },
    {
      node: 'success-stories',
      title: quoted('Fraud Prevention', HOME_EN),
      summary: quoted(
        'Enhance interoperability and transparency with standardized fraud prevention measures and shared intelligence of identified patterns and anomalies',
        HOME_EN,
      ),
    },
  ],
};

// Exported for scripts/design/home-content.mjs, which checks every quote
export const HOME_COPY: Partial<Record<Locale, HomeCopy>> = { 'zh-TW': zhTW, en };

export function homeCopy(locale: Locale): HomeCopy {
  const copy = HOME_COPY[locale];
  if (!copy) throw new Error(`src/data/home.ts has no ${locale} home copy`);
  return copy;
}

// The closing call to action of every page (ContactCta) and the contact page's hero, by locale
export const contactCta: Partial<Record<Locale, { title: Sourced; description: Sourced }>> = {
  'zh-TW': {
    title: quoted('您的需求，我們用心傾聽', CONTACT),
    description: quoted(
      '若有任何問題或建議，請留下聯絡資訊，我們會請專人向您進一步說明。',
      CONTACT,
      '若有任何問題或建議，請留下聯絡資訊我們會請專人向您進一步說明',
    ),
  },
  // The current en page goes on with "Fill out the form below and a team member will get back to
  // you within 24h", which reads wrong away from the form; left out
  en: {
    title: quoted('Get the Most Out of What We Have to Offer', CONTACT_EN),
    description: quoted('Your inquiry and opinion matter to us.', CONTACT_EN),
  },
};

export function contactCopy(locale: Locale) {
  const copy = contactCta[locale];
  if (!copy) throw new Error(`src/data/home.ts has no ${locale} contactCta`);
  return copy;
}

