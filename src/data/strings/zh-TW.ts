// Interface copy of the shared layout in zh-TW (M4-04, #23): landmark names, screen-reader text and
// labels that are not page content. The en and vi files (M7) satisfy the same Strings type, so a
// missing string fails astro check.

// Listing, utility and contact page descriptions, keyed by nodes.csv id (content-model.md「不建 collection
// 的模板」). Interim wording that states no facts; the content owner replaces it before launch.
const pages: Record<string, string> = {
  blog: '昕力資訊部落格：AI、數位轉型、企業管理、ESG 與應用情境的文章。',
  'blog-ai': '昕力資訊部落格的 AI 文章。',
  'blog-digital-transformation': '昕力資訊部落格的數位轉型文章。',
  'blog-enterprise-management': '昕力資訊部落格的企業管理文章。',
  'blog-esg': '昕力資訊部落格的 ESG 與綠色轉型文章。',
  'blog-use-cases': '昕力資訊部落格的應用情境文章。',
  'media-center': '昕力資訊的新聞快報、產品消息與電子報。',
  events: '昕力資訊舉辦與參與的活動。',
  'success-stories': '昕力資訊的客戶成功案例。',
  contact: '聯絡昕力資訊：留下聯絡資訊與需求，我們會請專人向您說明。',
  search: '搜尋昕力資訊網站的產品、解決方案、文章與新聞。',
  subscribe: '訂閱昕力資訊電子報。',
  'subscribe-result': '昕力資訊電子報的訂閱結果。',
  unsubscribe: '取消訂閱昕力資訊電子報。',
  cancelrecord: '取消昕力資訊的訂閱紀錄。',
  thanks: '感謝您與昕力資訊聯絡。',
  'not-found': '找不到您要的頁面，可以從搜尋或常用入口繼續瀏覽。',
  download: '昕力資訊產品文件下載。',
};

export const strings = {
  skipToMain: '跳到主要內容',
  mainNav: '主選單',
  mobileNavSuffix: '（行動版）',
  menu: '選單',
  language: '語言',
  languagePrefix: '語言：',
  externalSite: '（獨立網站）',
  // Screen-reader text after a Link that leaves the site
  externalLink: '（外部網站）',
  homeLogoAlt: 'TPIsoftware 昕力資訊（回首頁）',
  footerNav: '頁尾選單',
  legal: '法務資訊',
  phone: '電話',
  email: 'Email',
  breadcrumb: '麵包屑',
  toc: '本頁目錄',
  relatedPosts: '相關文章',
  otherIndustry: '其他產業',
  // content-model.md「news」: the current site's names
  newsTypes: { press: '新聞快報', product: '產品消息', newsletter: '電子報' },
  hub: {
    highlights: '重點',
    parts: '探索',
    whitepapers: '白皮書',
  },
  article: {
    author: '作者',
    published: '發布日期',
    updated: '更新日期',
    tags: '標籤',
    moreNews: '其他新聞',
  },
  caseStudy: {
    results: '成果',
    challenge: '挑戰',
    solution: '做法',
    offerings: '使用的產品與服務',
    others: '其他案例',
  },
  person: {
    expertise: '專長',
    experience: '經歷',
    education: '學歷',
    certifications: '證照',
    backToTeam: '回到 ESG 顧問團隊',
  },
  content: {
    effectiveDate: '生效日期',
    pdf: '下載 PDF',
  },
  // VideoFacade: the visible button text, and the start of its accessible name before the video title
  video: {
    play: '播放影片',
    playPrefix: '播放影片：',
  },
  // Field names of the current site's forms (docs/research/features.md「表單」)
  form: {
    name: '姓名',
    phone: '電話',
    email: 'Email',
    company: '公司',
    jobTitle: '職稱',
    consent: '個資同意',
    // Mark after the label of a required field
    required: '必填',
    // Link to the privacy policy under the consent checkbox; the whole phrase is the link text
    privacyLink: '閱讀隱私權政策',
    // Heading of the error summary at the top of a form that failed validation
    errorSummary: '請修正以下欄位後再送出',
    // Submit button while the form is being sent
    pending: '送出中…',
    // Server or network failure; the fields keep what was typed
    failed: '送出失敗，請稍後再試。您填寫的內容仍保留在表單中。',
    // The spam check (Cloudflare Turnstile) above the submit button
    challenge: '安全驗證',
    errors: {
      required: (label: string) => `請填寫${label}`,
      tooLong: (label: string, max: string) => `${label}最多 ${max} 個字`,
      email: '請輸入正確的 Email，例如 name@example.com',
      phone: '電話只能包含數字、空格與 + - ( )',
      choose: '請至少選擇一項',
      consent: '請勾選同意後再送出',
      challenge: '安全驗證未通過，請重新驗證後再送出',
    },
  },
  download: {
    summary: '內容重點',
    request: '索取文件',
    submit: '送出並下載',
  },
  listing: {
    filter: '篩選',
    all: '全部',
    featured: '精選文章',
    pagination: '分頁',
    previous: '上一頁',
    next: '下一頁',
    pageSuffix: (n: number) => `（第 ${n} 頁）`,
    empty: '目前還沒有內容',
    emptyText: '這裡的內容正在整理中，可以先看看其他資源。',
  },
  contact: {
    request: '聯絡表單',
    offerings: '諮詢產品',
    subject: '主旨',
    message: '需求說明',
    submit: '送出',
    offices: '據點',
  },
  utility: {
    searchLabel: '搜尋關鍵字',
    searchSubmit: '搜尋',
    searchPending: '輸入關鍵字開始搜尋',
    notFound: '找不到這個頁面',
    commonLinks: '常用入口',
    recommended: '推薦內容',
    downloads: '下載檔案',
    subscribeSubmit: '訂閱',
    unsubscribeSubmit: '取消訂閱',
  },
  pages,
  offering: {
    demo: '預約演示',
    seeFeatures: '看功能',
    features: '功能',
    useCases: '應用情境',
    related: '相關產品',
    team: 'ESG 顧問團隊',
    downloads: '下載',
    faq: '常見問題',
  },
};

export type Strings = typeof strings;
