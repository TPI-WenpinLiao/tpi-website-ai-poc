# Content brief：OrientAI 產品頁 `/orient-ai`（#199）

- 模板：`offering`（`kind: product`）；內容檔：`src/content/offering/zh-TW/orient-ai.md`；節點 `orient-ai`，parent `family-ai`（zh-TW 導覽是獨立的 Agentic AI 群組）
- 主張 id 指 `docs/strategy/messaging.md`；事實的寫法見 `content-strategy` skill「引用事實的寫法」，只用 `docs/strategy/facts.yaml` 裡 zh-TW、`status: confirmed` 的條目
- 版型與 `layout` 值照 `docs/strategy/design-principles.md`「內頁的版型」與 `src/content.config.ts` 的 `pageSection`
- 狀態：#199 策略階段。content-strategist 初稿，seo-strategist 補了「搜尋意圖」「內部連結」「title 與 description 方向」與「取捨」的意見欄、最後決定，之後等 `strategy-approved`。使用者在 PR #204 回覆（2026-11-05）後，改了第 7 段連到 `/aiso` 的錨點（雙向）、部署的寫法（取捨第 4 項）與待確認第 3、4 項

## 受眾與任務

依 `docs/research/audience-and-goals.md`「受眾分群」：

| 受眾 | 來這頁做什麼 | 這頁要讓他做到的事 |
|---|---|---|
| 決策者（金融、政府的 CIO、CTO），主要 | 確認企業導入 AI Agent 時，資料、權限、影子 AI 與 Token 成本管得住；決定要不要約 demo | 第 4、5、6、8 段各回答一個風險（Agent 權限與影子 AI、資料在哪、用量與行為、Token 成本），寫機制；找得到預約演示 |
| IT 主管、專案負責人，主要 | 確認 OrientAI 怎麼把任務分給 Agent、接不接得進現有業務系統、支援哪些模型與部署、要配什麼硬體 | 第 2 段讀到執行層的功能；第 3 段看到從對話到跨系統完成的接點；第 7 段依團隊規模查硬體 |

主要轉換：預約演示（內容檔 `cta: demo`，送到聯絡頁）。

## 搜尋意圖

依 `docs/strategy/search-intent.md`「OrientAI 企業級 Agentic AI 平台 `/orient-ai`」，加上首頁一節的「企業主權 AI 地端部署 方案」「台灣 AI 解決方案 公司」。沒有 Search Console 數據，取捨只依受眾與頁面主題，不依搜尋量。和 `/aiso` 的分工依查詢的主題，不依 AISO 一體機的軟體核心（取捨第 11 項，與 `aiso.md`「取捨」第 11 項一致）：本頁承接 Agent 平台、治理、Token 成本控管與 MCP 的查詢，`/aiso` 承接 AISO 品牌與主權 AI 方案的查詢；地端 AI 伺服器與一體機的查詢，#199 使用者決定後由 `/products/systalk-ai` 主要承接（機型規格在那頁）。

### 這頁承接的查詢

| 查詢 | 意圖類型 | 承接 | `search-intent.md` 的條目 |
|---|---|---|---|
| `OrientAI` | 導航型。英文單字跟同名的加密貨幣 Agent 文件站、Orient 手錶撞名，前幾名是昕力的新聞 | 主要。title、h1 都寫節點名「OrientAI 企業級 Agentic AI 平台」，產品名跟類別詞並列，跟同名產品分開。前幾名缺的產品頁本身與硬體規格建議由第 2–8 段、第 7 段回答 | 「OrientAI」 |
| `企業級 Agentic AI 平台` | 商業型偏比較型 | 主要。節點名就是這組詞。前幾名缺的繁中平台說明、地端部署與硬體搭配（第 5、7 段）、Token 成本（第 8 段）都在本頁；共同子題的多 Agent 協調與系統整合由第 2、3 段回答，可觀測性由第 6 段回答 | 「企業級 Agentic AI 平台」 |
| `AI Agent 治理 影子 AI 企業` | 資訊型 | 主要。前 9 筆全是英文；第 4 段把治理寫成平台功能（統一納管、授權、跨部門權限），第 6 段寫日誌與稽核 | 「AI Agent 治理 影子 AI 企業」 |
| `多代理協作 AI Agent 平台 企業 導入` | 資訊型偏商業型 | 主要。第 3 段寫前幾名缺的「Agent 跨企業內部系統執行任務」，第 5 段寫高監管產業的資料掌控權 | 「多代理協作 AI Agent 平台 企業 導入」 |
| `AI Agent 地端部署 Token 成本` | 資訊型（成本怎麼算、怎麼控） | 主要；次要 `/aiso`（不限 Token），延伸閱讀 `/blog/ai-token-cost-management`（第 9 段）。第 8 段寫前幾名缺的部門層級用量監控與用量上限；不寫省多少成本（「待確認」第 1 項） | 「AI Agent 地端部署 Token 成本」 |
| `OrientAI 昕力 群聯 Agentic AI` | 資訊型（了解產品與合作） | 主要；次要 `/aiso`。第 7 段回答前幾名缺的「群聯 aiDAPTIV 在 OrientAI 裡的作用」，第 5 段回答「資料是否離開企業」。新聞寫的合作與海外規劃不寫（取捨第 9 項） | 「OrientAI 昕力 群聯 Agentic AI」 |
| `MCP 企業 導入 AI Agent 整合` | 資訊型（問題型） | 次要，沒有主要承接頁。第 2 段寫前幾名缺的「MCP 跟權限納管、Token 監控放在同一個平台」；MCP 的通用概念本頁不寫，建議交文章（「建議新增」，取捨第 10 項） | 「MCP 企業 導入 AI Agent 整合」 |
| `Agentic AI 是什麼` | 資訊型（定義） | 次要；主要 `/blog/what-is-agentic-ai-platform`（取捨第 10 項）。第 3、4 段回答前幾名缺的「企業導入時的治理」 | 「Agentic AI 是什麼」 |
| `企業主權 AI 地端部署 方案` | 資訊型與商業型 | 次要；主要 `/aiso`。第 5 段寫資料掌控權歸企業 | 「企業主權 AI 地端部署 方案」（首頁一節） |
| `台灣 AI 解決方案 公司` | 商業型 | 次要，沒有主要承接頁（`home.md`「取捨」第 14 項） | 「台灣 AI 解決方案 公司」（首頁一節） |

### 不由這頁承接的查詢

| 查詢 | 交給 | 理由 |
|---|---|---|
| `Agentic AI 是什麼`（主要） | `/blog/what-is-agentic-ai-platform` | 定義型；新站已有這篇（2026-06），不另寫。本頁第 9 段列出它 |
| `企業 AI 導入` | `/blog/enterprise-ai-adoption` | 資訊型，#173 已寫；文章已填 `relatedOfferings: [zh-TW/orient-ai]`，也在內文連到本頁 |
| `AISO 主權 AI`、`企業主權 AI 地端部署 方案` | `/aiso` | AISO 品牌與主權 AI 方案的查詢；本頁第 7 段段末連到 `/aiso`（取捨第 8、11 項） |
| `AI 一體機 企業 地端 交機即用`、`地端 AI 伺服器 企業 LLM` | `/products/systalk-ai`，次要 `/aiso` | 機型規格與軟硬體交付的事實在 hub 第 6 段（#199 使用者決定）；本頁第 7 段只寫 OrientAI 自己的硬體建議，h2 不用「AI 伺服器」「機型」 |
| `MCP 企業 導入 AI Agent 整合`（通用概念） | 建議新增的 blog 文章 | 前幾名全英文，繁中有缺口；產品頁不寫通用定義 |

## 這頁要讓讀者相信什麼

使用者用一句對話發起任務，OrientAI 拆解後分派給合適的 Agent，在現有的多個業務系統之間完成（`IT-11`）；同時 Agent 的權限、影子 AI、使用行為與 Token 用量都在企業的管控內，資料掌控權歸企業（`DM-3`）。模型可以選、能用 MCP 擴充（`IT-8`），OrientAI 部署在企業端、接的模型可以在雲端或地端（`IT-1`），硬體依團隊規模選（`IT-10`），操作有日誌與稽核（`IT-5`）。

## 段落結構

順序照讀者的判斷：OrientAI 做什麼、任務怎麼跑、怎麼管、資料在哪、看得到什麼、裝在什麼硬體上、成本怎麼控。

「影像」欄照 `design-principles.md`「內頁共用的規則」。介面片段（`data-ui`、標「示意」）只畫事實寫得出的功能名稱、設定項目與狀態名稱，不畫 Token 數、金額、筆數、時間與曲線（現站的 3 張儀表板截圖不沿用，見「取捨」第 6 項）。

| # | 段落 | 目的 | 依據（受眾任務／主張 id） | 搜尋子題 | 事實 | 預估長度 | 版型（`layout`） | 影像 |
|---|---|---|---|---|---|---|---|---|
| 1 | Hero：讓 AI Agent 做事，也管得住 | h1 是節點名「OrientAI 企業級 Agentic AI 平台」，頁面最大的字，上方不放小標。tagline 寫用途（AI Agent 跨系統執行任務，並由企業統一管控），說明句寫對象（對資料隱私要求高的金融與政府單位）。三則證據點是現站首頁 OrientAI 段的三個功能名。主要動作「預約演示」 | 決策者任務「確認是不是我要找的平台」；`IT-11`、`DM-3`；主要轉換 | `OrientAI`：品牌導航，英文名跟同名產品撞名；`企業級 Agentic AI 平台`：節點名就是這組詞 | `fact:orientai-multi-agent`、`fact:orientai-governance`、`fact:orientai-token-cost` | tagline 20–35 字；說明 30–50 字；證據點 3 則 | 第一屏（不屬於 10 種版型，照「內頁共用的規則」的第一屏） | 同一個世界渲染的靜態圖。已有首頁用的 `orientai.webp`，是否沿用或新做 `page-orient-ai.webp` 由設計概念階段決定（「取捨」第 7 項）。HTML 標籤用第 3 段事實的用詞：業務系統（`legacy`）、OrientAI（`product`）、AI Agent（`ai0`–`ai2`）。不載 3D |
| 2 | 執行層：知識問答、跨系統任務與多種模型 | OrientAI 讓 AI 做什麼：RAG 知識問答與文件解析、AI Agent 跨系統任務自動化、整合多種大語言模型、雲地部署架構（原文照引；「雲地」指接的模型，說明句不寫 OrientAI 本身可以部署在雲端，`messaging.md` `IT-1` 寫法）；四個應用場景；用 MCP 擴充功能模組 | IT 主管任務「確認平台做得到什麼、模型能不能選」；`IT-8`、`IT-1` | `企業級 Agentic AI 平台`：多 Agent 協調、系統整合；`MCP 企業 導入 AI Agent 整合`：MCP 跟權限、Token 監控放在同一個平台（前幾名沒有繁中來源） | `fact:orientai-execution-layer`、`fact:orientai-execution-scenarios`、`fact:orientai-mcp` | 說明 40–60 字；事實 3 則 | 介面片段（`ui`） | 介面片段 1：執行層的設定面板，列是 RAG 知識問答與文件解析、AI Agent 跨系統任務自動化、彈性整合多種大語言模型、MCP 擴充應用（用詞取自本段事實）。畫出的接點：模型與工具接在 OrientAI 底下 |
| 3 | 一句對話發起，Agent 跨系統完成 | 三步驟寫成接點：對話式任務發起，理解語意與資料需求；自動拆解任務、調用合適的 Agent，跨系統協作；統一控管 Agent 的權限、成本與資安。說明句寫 Agent 接進現有業務系統與流程，打通跨部門的數據孤島 | IT 主管任務「確認接不接得進現有系統」；`IT-11` | `多代理協作 AI Agent 平台 企業 導入`：Agent 跨企業內部系統執行任務的具體例子（前幾名沒有）；`企業級 Agentic AI 平台`：多 Agent 協調、系統整合；`Agentic AI 是什麼`（次要，主要給 blog）：代理式 AI 自主規劃、用工具 | `fact:orientai-task-intake`、`fact:orientai-agent-dispatch`、`fact:orientai-agent-management`、`fact:orientai-collaboration`、`fact:orientai-data-silos` | 說明 40–60 字；事實 5 則 | 接點圖（`junction`） | SVG 三欄：左（`legacy`）現有業務系統與流程；中（`product`）OrientAI，節點是對話式任務發起、AI Agent 分派與執行、Agent 管理與治理；右（`new`）AI Agent（用詞取自本段事實）。caption 寫跨系統協作完成工作 |
| 4 | Agent 與影子 AI 統一納管 | Agent 統一管控與授權、消除影子 AI、跨部門權限與資料治理；對 AI 模型與 Agent 全週期管理，建立身分驗證與資料存取邊界；四個治理應用場景 | 決策者任務「確認風險在哪裡被處理掉」；`DM-3` | `AI Agent 治理 影子 AI 企業`：把治理做成平台功能（統一納管、授權、跨部門權限，前幾名全英文）；`Agentic AI 是什麼`：企業導入時的治理（前幾名沒有） | `fact:orientai-governance-layer`、`fact:orientai-shadow-ai-lifecycle`、`fact:orientai-governance-scenarios` | 說明 40–60 字；事實 3 則 | 介面片段（`ui`，`flip: true`，和第 2 段左右對調） | 介面片段 2：Agent 管理面板，列是 AI Agent 統一管控與授權標準化、消除影子 AI、跨部門統一權限管理與資料治理（用詞取自 `fact:orientai-governance-layer`）。不畫 Agent 名單與使用者 |
| 5 | 資料掌控權歸企業 | OrientAI 部署於企業端，資料掌控權為企業所有；適用於對數據隱私要求高的產業。原文點名製造業，照原文引用，標題與說明句只寫金融與政府（`DM-3` 寫法）。和第 2 段的「雲地部署」不矛盾，寫法見「取捨」第 4 項 | 決策者任務「確認資料會不會外流」；`DM-3` | `OrientAI 昕力 群聯 Agentic AI`：資料是否離開企業（前幾名沒有）；`企業主權 AI 地端部署 方案`（次要，主要在 `/aiso`） | `fact:orientai-on-prem-data`、`fact:orientai-privacy-industries` | 說明 30–50 字；原文 2 則 | 主張與原文（`claim`） | 無 |
| 6 | 使用行為與異常看得到 | 角色權限控管、日誌追蹤與稽核、異常行為即時告警；即時檢視 AI 回覆品質、任務執行狀態與使用行為 | IT 主管任務「確認上線後維運得動、稽核拿得出紀錄」；`IT-5` | `AI Agent 治理 影子 AI 企業`：可見性、問責；`企業級 Agentic AI 平台`：可觀測性 | `fact:orientai-governance-controls`、`fact:orientai-risk-insight` | 說明 40–60 字；事實 2 則 | 介面片段（`ui`） | 介面片段 3：監控面板，分頁是 AI 回覆品質、任務執行狀態、使用行為；列是角色權限控管、日誌追蹤與稽核、異常行為即時告警（用詞取自本段事實）。只畫分頁與列名，不畫筆數與曲線 |
| 7 | 硬體依團隊規模選 | 1–5 人團隊、5 人以上的跨部門應用各配什麼設備；結合群聯 aiDAPTIV 記憶體擴充，地端架構離線仍可運行。aiDAPTIV 只寫機制，不寫效能提升多少（「不能寫的句子」）。段末連到 `/aiso`，錨點寫出 AISO 以 OrientAI 為軟體核心（引用 `fact:aiso-software-orientai`，見「內部連結」）；`/aiso` 沒有機型規格，`/aiso` 第 5 段引用本段同一組硬體建議（取捨第 8 項） | IT 主管任務「確認要配什麼硬體」；`IT-10`、`DM-3`；連結的錨點 `DM-10` | `OrientAI`：前幾名缺硬體規格建議（幾人團隊配什麼設備）；`企業級 Agentic AI 平台`：地端部署與硬體搭配（前幾名沒有）；`OrientAI 昕力 群聯 Agentic AI`：群聯 aiDAPTIV 在 OrientAI 裡的作用 | `fact:orientai-hardware-small`、`fact:orientai-hardware-large`、`fact:orientai-aidaptiv`；連結的錨點 `fact:aiso-software-orientai` | 說明 30–50 字；表 3 列 | 規格表（`spec`），`fill: subtle`；`link` 到 `aiso` | 表的列是 1-5 人團隊、5 人以上、記憶體擴充。可在 h2 旁放段落圖（沿用 `sec-deployment` 或新做，由設計概念階段決定） |
| 8 | Token 用量與成本控得住 | 掌握 Token 消耗率、設定用量上限；依任務複雜度自動分派模型與 Agent。不寫省下多少成本（「待確認」第 1 項）。這段在頁尾聯絡前，主張一句後接動作「預約演示」，讓讀到成本的決策者直接進到下一步 | 決策者任務「確認成本管得住」「決定要不要約 demo」；`DM-3`；主要轉換 | `AI Agent 地端部署 Token 成本`：部門層級的用量監控、設用量上限（前幾名沒有部門層級）；`企業級 Agentic AI 平台`：Token 成本（前幾名沒有） | `fact:orientai-token-transparency`、`fact:orientai-token-allocation` | 主張一句 15–25 字；事實 2 則 | 色帶（`band`，淺紫，`fill: brand`），`fragment` 放片段，`link` 到 `contact` | 介面片段 4（色帶的 `fragment`）：Token 額度設定面板，列是設定 Token 用量上限（`on`）、依據任務複雜度自動分派模型與 Agent（`next`），用詞取自本段兩則事實。不畫 Token 數與金額 |
| 9 | 相關文章 | Agentic AI、AI Agent 管理平台、Token 成本與企業 AI 導入的延伸閱讀，給要先弄清楚概念或導入步驟的讀者。模板依 `blog.relatedOfferings` 反查，順序照新到舊，最多 3 則，不寫文案 | IT 主管與決策者評估前需要的前置知識；`search-intent.md` 把 `Agentic AI 是什麼` 交給 blog | `Agentic AI 是什麼`、`企業 AI 導入`（主要在 blog） | 無（文章的事實由文章管） | 3 則 | 索引列（模板的相關文章區） | 文章自己的封面縮圖 |
| 10 | 預約演示 | 頁尾的主要轉換，標題寫下一步（看 Agent 怎麼在自己的系統裡跑） | 主要轉換：預約演示 | — | 無 | 標題 10–20 字，說明 30–50 字 | 色帶（深紫），模板的 `ContactCta` | 無 |

相鄰兩段的版型都不同（第 7 段規格表、第 8 段淺紫色帶、第 9 段索引列、第 10 段深紫色帶）。介面片段 4 張：`ui` 版型 3 次（第 2、4、6 段），加上第 8 段色帶裡 1 張，見「取捨」第 2 項。

### 照原文列清單的段落

第 2、3、4、6、8 段的事實原文多是功能名接成一行（例如 `fact:orientai-execution-layer`、`fact:orientai-governance-layer`、`fact:orientai-governance-controls`），排成清單前要照 `.claude/skills/site-research/SKILL.md` 第 2 條在 `scripts/strategy/facts-source.yaml` 拆成每行一項，再重跑 `node scripts/strategy/extract-facts.mjs`。說明句寫讀者讀完得到的答案，不寫「以下列出」。

### 不能寫的句子

| 段落 | 不能寫 | 為什麼 |
|---|---|---|
| 1、8 | 「作業效率提升 40–60%」「營運成本降低 20–30%」「治理風險降低 90%」 | 現站的效益數字沒有量測方式與基準（「待確認」第 1 項） |
| 7 | 「同級模型 AI 推論效能與回應速度大幅提升」 | `fact:orientai-aidaptiv` 原文的後半句，沒有比較基準，不在事實庫（`unmigrated.md`「第一批 7 頁沒收的句子」） |
| 2、5 | 「OrientAI 可以部署在雲端」「可以裝在公有雲」 | OrientAI 本身部署在企業端（`fact:orientai-on-prem-data`）；第 2 段原文的「雲地」指接的模型（使用者說明，#199，「待確認」第 3 項已結算，`messaging.md` `IT-1` 寫法） |
| 2、5 | 「可以使用雲端 LLM API」「可以接雲端的模型服務」 | 使用者說明可以，但現站沒有原文（`messaging.md`「缺少證據的主張」第 23 項）。收進事實庫前不寫 |
| 1、5 | 「適用醫療、金融、製造業」寫在標題、tagline 或產業入口 | 製造業不寫進標題與產業入口（`messaging.md`「定位不說的事」），原文只在第 5 段照引 |
| 1 | 「AISO 一體機以 OrientAI 為軟體核心」寫在 hero 或 title | 事實已確認（`fact:aiso-software-orientai`），但 AISO 是 `/aiso` 的主題（取捨第 11 項），本頁只在第 7 段連到 `/aiso` 的錨點寫出關係 |

### 與現有頁面的差異

對照現有的 `src/content/offering/zh-TW/orient-ai.md`：

| 現有 | 處理 | 理由 |
|---|---|---|
| tagline「從任務執行到全局治理，OrientAI 讓企業 AI 真正可管、可控、可擴展」 | 改寫，寫用途與對象 | 「真正可管、可控、可擴展」是形容，沒說機制 |
| description（現站 meta description） | 交 seo-strategist | 「降低治理風險」沒有依據可以寫成數字，description 要依新段落寫 |
| features 5 項（多代理協作、Agent 統一納管、Token 用量透明化、AI 風險洞察、MCP 擴充應用） | 拆進第 2、4、6、8 段，改成 `sections` | 五項排成同一種雙欄條列；拆開後各回答一個疑問，並補上現站沒搬的執行層、治理層、三步驟與硬體 |
| FAQ 5 題 | 不放，答案裡的事實移進段落 | 見「取捨」第 5 項 |
| 現站沒搬的三步驟、執行層與治理層、協作與治理條列、硬體（`unmigrated.md`） | 放回第 2、3、4、6、7 段 | 事實已收進事實庫，各對應一個受眾任務 |
| 現站的白皮書與 blog 按鈕 | blog 改由第 9 段反查；白皮書不連 | `whitepaper-systalk-ai` 沒有內容檔，不產生頁面（`navigation.csv` 備註「未上線」） |

## CTA

| CTA | 文案方向 | 位置 | 連到 |
|---|---|---|---|
| 主要：預約演示 | 沿用 `cta: demo` 的「預約演示」；第 10 段的標題寫看 Agent 在自己的系統裡怎麼跑 | 第 1 段 hero（實心按鈕）、第 8 段色帶的動作、第 10 段 | `/contact-us`（`contact`） |
| 次要：看以 OrientAI 為軟體核心的地端一體機 | 錨點寫出兩者的關係與目標頁的節點名（「以 OrientAI 為軟體核心的地端 AI 方案：AISO 主權 AI」），引用 `fact:aiso-software-orientai`；不只寫「AISO」 | 第 7 段段末 | `/aiso`（`aiso`） |

hero 不放次要按鈕：OrientAI 沒有試用的事實；地端硬體是 IT 主管讀到第 7 段才需要的下一步。

## 內部連結

路徑取 `docs/ia/nodes.csv`，blog 取 `page-map.csv` 的 `blog_slug`，新聞取 `/media-center/{id}`。只列會產生頁面的節點：`/whitepaper/systalk-ai` 依 #138 不產生頁面，不當連結目標。錨點文字寫目的地是什麼，不用「了解更多」；提到本頁時用節點名「OrientAI 企業級 Agentic AI 平台」，產品名跟類別詞並列（撞名）。麵包屑沿 `parent` 連到 `/products` 與 `/products/systalk-ai`，模板產生，不必另寫。

### 連出

| 段落 | 連到 | 建議錨點文字 | 說明 |
|---|---|---|---|
| 1、8、10 | `/contact-us` | 預約演示 | 主要轉換（`cta: demo`）；第 8 段是色帶的動作 |
| 7 | `/aiso` | 以 OrientAI 為軟體核心的地端 AI 方案：AISO 主權 AI | 第 7 段 `spec` 的 `link`。錨點寫「方案」不寫「一體機」：一體機的查詢由 `/products/systalk-ai` 主要承接，錨點不把這個詞送到次要承接頁（`aiso.md`「取捨」第 11 項）。錨點寫出兩者的關係，帶 `/aiso` 的節點名，依據 `fact:aiso-software-orientai`（「待確認」第 4 項已結算，使用者決定，#199）。內容檔的 `facts` 要列這筆。和 `aiso.md`「內部連結」連入表同一串文字。`/aiso` 第 3 段反連本頁，雙向（`aiso.md`「取捨」第 9 項） |
| 9 | `/blog/enterprise-ai-adoption`、`/blog/ai-token-cost-management`、`/blog/what-is-agentic-ai-platform` | 文章標題（模板產生） | 後兩篇補 `relatedOfferings: [zh-TW/orient-ai]`（取捨第 13 項）；依新到舊排序就是這三篇 |

### 連入

| 從 | 建議錨點文字 | 狀態 |
|---|---|---|
| header「產品」選單的 SysTalk.ai 欄（Agentic AI 標記） | 節點名「OrientAI 企業級 Agentic AI 平台」 | 已有 |
| 首頁第 4 段 | 認識 OrientAI 企業級 Agentic AI 平台 | 首頁 brief 已列 |
| `/products/systalk-ai` 第 6 段的索引列 | 節點名 | 本批 `systalk-ai.md`「內部連結」已列 |
| `/blog/enterprise-ai-adoption` | 「OrientAI 的地端部署與治理層」「認識 OrientAI 企業級 Agentic AI 平台」 | 已有（#173） |
| `/blog/ai-token-cost-management` | 立即探索 OrientAI，打造企業級 AI Token 治理機制 | 已有 |
| `/blog/what-is-agentic-ai-platform`、`/blog/what-is-ai-agent-management-platform` | 建議「OrientAI 企業級 Agentic AI 平台」 | 兩篇都有一節標題寫 OrientAI，但內文沒有連到本頁。前一篇補 `relatedOfferings` 後由本頁第 9 段連過去；文章內文要不要加連結，見取捨第 13 項 |
| `/media-center/571`、`/media-center/575`、`/media-center/582`、`/media-center/585` | OrientAI 或「企業級 Agentic AI 平台 OrientAI」 | 已有。新聞是照現站搬的原文，錨點不改 |
| `/aiso` 第 3 段 | 「AISO 的軟體核心：OrientAI 企業級 Agentic AI 平台」 | `aiso.md` 已改（「取捨」第 9 項）：第 17 項結算後雙向連結 |

### 建議新增

| 頁面 | 位置 | 理由 |
|---|---|---|
| 企業導入 MCP 的 blog 文章 | `/blog/{slug}`（新的 `blog-post`，分類建議 `blog-ai`） | 承接 `MCP 企業 導入 AI Agent 整合`：前幾名全英文，繁中沒有人寫「MCP 接上企業系統後，權限與用量怎麼管」。通用概念加上本頁已確認的 `fact:orientai-mcp`、`fact:orientai-governance-layer`，不需要新事實；填 `relatedOfferings: [zh-TW/orient-ai]`，文末連到本頁。另開 issue（取捨第 10 項）。填了之後第 9 段依新到舊會換掉最舊的一篇 |

## title 與 description 方向

規則照 `seo-checklist`「每頁必備」：zh-TW title 約 20–32 個全形字（含後綴「｜TPIsoftware 昕力資訊」，後綴約佔 11 字），description 約 60–80 個全形字；半形英數約算半個全形字。

### title

- 節點名「OrientAI 企業級 Agentic AI 平台」加後綴約 26 字，符合規則，已涵蓋品牌詞與 `企業級 Agentic AI 平台` 整組詞。建議不加 `seoTitle`，title 跟 h1 一致
- 要涵蓋：「OrientAI」與類別詞並列（撞名）、「企業級 Agentic AI 平台」
- 傳達的主張：`IT-11`、`DM-3`（由 description 展開）
- 不放：「一體機」「地端 AI 伺服器」（`/products/systalk-ai` 的詞）、「主權 AI」（`/aiso` 的詞，取捨第 11 項）、「AISO」、效益數字、「群聯」（合作夥伴名放第 7 段的事實原文就夠）
- 示例（含後綴）：
  - `OrientAI 企業級 Agentic AI 平台｜TPIsoftware 昕力資訊`（約 26 字，不加 `seoTitle`）
  - `OrientAI 企業級 Agentic AI 平台：Agent 治理｜TPIsoftware 昕力資訊`（約 32 字，到上限；要把 `AI Agent 治理 影子 AI 企業` 的用詞放進 title 時才用）

### description

- 要涵蓋：一句對話發起、任務拆解與 Agent 跨系統執行；Agent 統一納管與影子 AI；Token 用量上限；MCP 擴充；資料掌控權歸企業；日誌與稽核
- 傳達的主張：`IT-11`、`DM-3`、`IT-8`、`IT-5`
- 依據的事實：`fact:orientai-task-intake`、`fact:orientai-agent-dispatch`、`fact:orientai-governance-layer`、`fact:orientai-token-transparency`、`fact:orientai-token-allocation`、`fact:orientai-mcp`、`fact:orientai-execution-layer`、`fact:orientai-on-prem-data`、`fact:orientai-governance-controls`
- 不寫：效益數字（「待確認」第 1 項）、「降低治理風險」（現行 description 有，沒有依據寫成結果，要重寫）、「OrientAI 可以部署在雲端」「可以使用雲端 LLM API」（取捨第 4 項、`messaging.md`「缺少證據的主張」第 23 項）、只寫「支援雲地部署」而沒有前後文（讀者會讀成 OrientAI 本身裝在雲端）、「一體機」「AISO」
- 示例：
  - `OrientAI 企業級 Agentic AI 平台把一句對話拆成任務，分派 AI Agent 跨系統完成；Agent 統一納管、消除影子 AI，可設定 Token 用量上限，並以 MCP 擴充，資料掌控權歸企業。`
  - `企業導入 AI Agent 時，OrientAI 統一控管 Agent 的權限、成本與資安：角色權限、日誌追蹤與稽核、異常即時告警，掌握 Token 消耗並依任務複雜度分派模型，資料掌控權歸企業。`（#199 把原本結尾的「支援雲地部署」改掉，見取捨第 4 項）

## schema 缺口

offering schema（`src/content.config.ts`）已有 `heroLead`、`heroPoints`、`heroLabels`、`sections`（`pageSection`）與 `relatedPosts`；相關文章依 `blog.relatedOfferings` 反查。

| 段落 | 缺什麼 | 新增的欄位或要改的地方 | 型別 |
|---|---|---|---|
| 9 | 只有 `/blog/enterprise-ai-adoption` 填了 `relatedOfferings: [zh-TW/orient-ai]`；`/blog/what-is-agentic-ai-platform`、`/blog/ai-token-cost-management`、`/blog/what-is-ai-agent-management-platform` 的內文都提到 OrientAI（`ai-token-cost-management` 另有連到本頁），但沒填 | 不加欄位 | 在要列出的文章內容檔補 `relatedOfferings: [zh-TW/orient-ai]`，本頁的 `relatedPosts` 不填（同 `briefs/digirunner.md`「取捨」第 9 項的做法）。哪三篇由 seo-strategist 依承接的查詢定 |
| 5 | `fact:orientai-on-prem-data` 的原文以 FAQ 的「不會。」開頭，搬出 FAQ 後讀不通 | 不是 schema 缺口 | 在 `scripts/strategy/facts-source.yaml` 把 `text` 裁掉「不會。」（`facts.yaml` 檔頭：`text` 可以裁掉 quote 的一部分，不改字），重跑 `node scripts/strategy/extract-facts.mjs` |
| — | 內容檔沒有 `facts` | `facts`（共用欄位已有） | 照段落表列出的 24 則補上（OrientAI 頁與首頁的 23 則，加上第 7 段連結錨點用的 `fact:aiso-software-orientai`） |
| — | `faq` 不用 | 不加欄位 | 內容檔改寫時刪 `faq` |

## 取捨

第 1–9 項是 content-strategist 寫的，第 10–13 項是 seo-strategist 加的（`search-intent.md`「待 seo-strategist 決定的事」跟這頁有關的條目，與「schema 缺口」第 9 段留給 seo-strategist 的事）。兩方意見相同的項目，最後決定照 content-strategist 的立場；第 10–12 項由 seo-strategist 定案；第 13 項的文章內文連結要使用者決定。

| # | 項目 | content-strategist 的立場 | 理由 | seo-strategist 的意見 | 最後決定 |
|---|---|---|---|---|---|
| 1 | 段數 | 10 段：hero、7 個事實段（第 8 段是聯絡前的淺紫色帶）、相關文章、預約演示色帶 | 這頁有 25 則 zh-TW confirmed 事實（22 則來自現站 OrientAI 頁、3 則是現站首頁 OrientAI 段的功能名），用了 23 則。hero 放 3 則；其餘 20 則依回答的問題分成 7 段：執行層 3 則、任務流程 5 則、治理 3 則、資料歸屬 2 則、監控與稽核 2 則、硬體 3 則、Token 2 則，每段至少 2 則。沒用的 2 則：`fact:orientai-five-features` 原文把三張卡片接成一句，最後停在「Token 用量透明化」的標題，內容已由 `fact:orientai-governance-layer`、`fact:orientai-token-transparency`、`fact:orientai-collaboration` 涵蓋；`fact:orientai-roi-controls` 的「設定 Token 用量上限」與 `fact:orientai-token-transparency` 重複，拿掉後第 8 段的色帶照「內頁的版型」放 2 則（取捨第 2 項）。#199 第 17 項結算後，第 7 段連到 `/aiso` 的錨點另引用新聞 575 的 `fact:aiso-software-orientai`，不是事實段，段數不變 | 同意。10 組查詢的子題都對得到第 2–8 段（段落表「搜尋子題」欄）；每個事實段各回答一組主要承接的查詢（治理、多 Agent、Token、硬體），沒有只為 SEO 存在的段 | 採納，10 段 |
| 2 | 介面片段 4 張，但 `ui` 版型全頁最多 3 次 | 第 2、4、6 段用 `ui`；第 8 段 Token 改成聯絡前的淺紫色帶（`band`），片段放在色帶的 `fragment` | 「至少 4 張介面片段」和「同一種版型最多 3 次」要同時守住。`results` 版型要有作業成果，OrientAI 的效益數字未確認，用不了；`band` 的用途包含聯絡，Token 成本是決策者約 demo 前最後一個疑問，放在聯絡前接上「預約演示」的動作最順。色帶照「內頁的版型」放 2 則事實（`fact:orientai-token-transparency`、`fact:orientai-token-allocation`），片段兩列 | 同意。第 8 段改成色帶後仍要有 h2，標題寫 Token 用量與成本，`AI Agent 地端部署 Token 成本` 的讀者在標題層級就讀得到；片段裡的設定名稱是 HTML 文字 | 採納 |
| 3 | `IT-11` 是主要主張卻排在第 3 段 | 第 2 段先寫執行層，第 3 段寫任務怎麼跑 | 讀者先要知道 OrientAI 讓 AI 做什麼，才看得懂任務在系統間怎麼分派；兩段都屬於「讓 AI 做事」，合起來回答 `IT-11`。這個順序也讓相鄰兩段的版型不同（`ui`、`junction`、`ui`） | 同意。`IT-11` 由 hero 的 tagline 與證據點（`fact:orientai-multi-agent`）先在第一屏出現，description 也從任務拆解寫起，段落順序不影響承接 | 採納 |
| 4 | 第 2 段「支援雲地靈活部署架構」和第 5 段「只會部署於企業端」 | 兩則都照原文。第 5 段的說明句寫 OrientAI 部署在企業端、資料掌控權歸企業；第 2 段的說明句不寫 OrientAI 本身可以部署在雲端 | 已結算（使用者說明，#199）：OrientAI 部署在企業端（地端），「雲地」指接的模型可以在雲端或地端，兩則不矛盾。使用者另說明 OrientAI 可以使用雲端 LLM API，但現站沒有原文，頁面不寫（`messaging.md`「缺少證據的主張」第 23 項） | 初稿時同意不寫部署位置的結論。結算後：title、description 不寫 OrientAI 可以部署在雲端；description 示例改寫「資料掌控權歸企業」，不單獨寫「支援雲地部署」，免得讀成 OrientAI 本身裝在雲端 | 採納；部署寫法照 `messaging.md` `IT-1` |
| 5 | FAQ 不放 | 不放，答案裡已確認的事實移進第 4、5、8 段 | FAQ 的答案多是定義與背景（Agentic AI 是什麼、為什麼要統一平台），屬於 `Agentic AI 是什麼` 這類交給 blog 的資訊型查詢；答案裡的事實（影子 AI、數據孤島、Token 額度、資料歸屬）在段落裡寫一次就好。Google 只對知名政府與醫療網站顯示 FAQ 複合式結果（`briefs/digirunner.md`「取捨」第 4 項），加 `FAQPage` 拿不到展示。「OrientAI 跟 API 管理平台的差別」那題的答案不在事實庫 | 同意。定義由 `/blog/what-is-agentic-ai-platform` 承接，第 9 段列出它（第 10、13 項） | 採納，不放 |
| 6 | 現站「實現人與 AI Agent 的協作」的 3 張儀表板截圖不沿用 | 改畫第 4、6、8 段的介面片段 | 截圖有 Token 數、曲線與 Agent 名單這類資料，`design-principles.md`「內頁共用的規則」不畫靠假資料成立的畫面；截圖也沒有文字，事實庫收不到 | 同意。截圖沒有文字，對搜尋沒有幫助；片段的文字搜尋引擎讀得到 | 採納 |
| 7 | hero 的靜態圖 | 已有首頁用的 `orientai.webp`，沿用或新做由設計概念階段決定 | `design-principles.md`「各模板怎麼呈現」只寫了 digiRunner 與金融頁；原則沒寫到其他產品頁，也沒寫首頁的產品圖能不能當內頁 hero | 沒有 SEO 意見 | 交設計概念階段 |
| 8 | 硬體段和 `/aiso` 的關係 | 只寫 OrientAI 頁自己的兩則硬體事實與 aiDAPTIV，段末連到 `/aiso` | 使用者決定（#199，PR #204，2026-11-05）：`/products/systalk-ai-phison` 講的不是 AISO，那頁的機型規格（`fact:aiso-servers`、`fact:systalk-phison-use-cases`）移到 `/products/systalk-ai`，`/aiso` 沒有機型規格。`/aiso` 第 5 段改引用本段同一組事實（`fact:orientai-hardware-small`、`fact:orientai-hardware-large`、`fact:orientai-aidaptiv`），寫成 OrientAI 建議的硬體配置，不寫成 AISO 的機型（`messaging.md` `IT-10` 寫法）。兩頁因此重複：本段與 `/aiso` 第 5 段原文相同，本頁第 5 段（`fact:orientai-on-prem-data`、`fact:orientai-privacy-industries`）與 `/aiso` 第 3 段原文相同。照 `aiso.md`「取捨」第 13 項：兩頁的 h2 與說明句寫各自的問題（本頁是 OrientAI 要配什麼硬體，`/aiso` 是 AISO 裝什麼、配什麼硬體），原文相同但上下文不同；`/aiso` 不用這幾筆，就回答不了 IT 主管「裝什麼軟體、配什麼硬體」 | 初稿意見：合併了兩頁會搶 `地端 AI 伺服器 企業 LLM`。#199 使用者決定後，這組改由 `/products/systalk-ai` 主要承接（第 11 項），本頁與 `/aiso` 都不主要承接。複核（和 `aiso.md`「取捨」第 13 項一起）：重複的是短句，兩頁其他段落與 h2 不同，不會分散 `OrientAI` 的承接，條件是 `/aiso` 的 title 不放「OrientAI」、`/aiso` 第 3 段用本頁的節點名連過來（兩項 `aiso.md` 都已照做）。本段 h2 寫團隊規模，不用「AI 伺服器」「機型」，免得跟 hub 第 6 段搶 `地端 AI 伺服器 企業 LLM` | 採納；本段連到 `/aiso`，`/aiso` 第 3 段反連本頁（seo-strategist 複核同意） |
| 9 | 新聞寫的「大型金控 POC」「鎖定高監管產業」 | 不寫 | 新聞可以當事實來源（使用者決定，#199），但這兩句沒收進事實庫；`search-intent.md`「OrientAI」記下新聞的共同子題，頁面只能用事實庫裡 confirmed 的條目。要用時先收進 `scripts/strategy/facts-source.yaml` | 同意。`OrientAI 昕力 群聯 Agentic AI` 由第 5、7 段回答前幾名缺的子題（資料是否離開企業、aiDAPTIV 的作用），不需要新聞的說法 | 採納 |
| 10 | `Agentic AI 是什麼` 與 `MCP 企業 導入 AI Agent 整合` 要不要用 blog 文章承接（`search-intent.md` 待決條目） | 第 9 段把 `Agentic AI 是什麼` 交給 blog；MCP 列為第 2 段的子題 | — | `Agentic AI 是什麼`：由既有的 `/blog/what-is-agentic-ai-platform` 主要承接，不另寫；文章有定義、核心能力、多 Agent 管理三節，前幾名缺的企業治理也寫了。`MCP 企業 導入 AI Agent 整合`：建議另寫一篇（「建議新增」），前幾名全英文，現有文章都沒有以 MCP 為主題；本頁第 2 段次要承接。只建議，另開 issue | 定案：Agentic AI 交既有文章；MCP 文章只建議 |
| 11 | `/aiso` 與 `/orient-ai` 的查詢分工，OrientAI 這一半（`search-intent.md` 待決條目） | 第 8 項：硬體段只寫本頁事實，段末連到 `/aiso`；`不能寫的句子` 不寫一體機以 OrientAI 為核心 | 軟體核心未確認（`messaging.md`「缺少證據的主張」第 17 項） | 和 `aiso.md`「取捨」第 11 項一致，依查詢主題分，不依軟體核心。本頁主要承接 `OrientAI`、`OrientAI 昕力 群聯 Agentic AI`、`企業級 Agentic AI 平台`、`AI Agent 治理 影子 AI 企業`、`多代理協作 AI Agent 平台 企業 導入`、`AI Agent 地端部署 Token 成本`；`/aiso` 主要承接硬體、軟硬體交付與地端部署。本頁 title 不用「一體機」「主權 AI」，`/aiso` 的 title 不用「Agentic」「Agent」「Token」。連結：本頁第 7 段單向連到 `/aiso`，`/aiso` 不反連。另外，新站已搬的新聞 575、582、585（現站 `/media-center/575` 等）寫 AISO 一體機以 OrientAI 為軟體核心或可選搭載 OrientAI；這是第 17 項的線索，但事實庫沒收，頁面仍不寫。收進事實庫後，承接頁不變，只改第 7 段的錨點是否寫明關係、`/aiso` 是否反連 | 定案，分工如左。#199 使用者確認後已收進事實庫（`fact:aiso-software-orientai`、`fact:aiso-orientai-hardware`）：承接頁不變，第 7 段的錨點寫明關係，`/aiso` 第 3 段反連，雙向。同一天使用者再決定（#199，PR #204）：`/products/systalk-ai-phison` 講的不是 AISO，`/aiso` 沒有機型規格，`地端 AI 伺服器 企業 LLM`、`AI 一體機 企業 地端 交機即用` 改由 `/products/systalk-ai` 主要承接、`/aiso` 次要；`/aiso` 主要承接 `AISO 主權 AI`、`企業主權 AI 地端部署 方案`、`昕力 群聯 AISO 聯盟`。本頁的承接與 title 的用詞不變；`/aiso` 第 5 段引用本頁的硬體建議，重複的寫法見第 8 項。seo-strategist 複核後補：第 7 段連到 `/aiso` 的錨點改成「以 OrientAI 為軟體核心的地端 AI 方案：AISO 主權 AI」，不帶「一體機」 |
| 12 | title 用什麼 | 「與現有頁面的差異」：description 交 seo-strategist；h1 是節點名 | — | 節點名加後綴約 26 字，已涵蓋品牌詞與 `企業級 Agentic AI 平台`，不加 `seoTitle`，title 跟 h1 一致 | 定案，見「title 與 description 方向」 |
| 13 | 第 9 段列哪三篇文章（「schema 缺口」第 9 段留給 seo-strategist） | 補 `relatedOfferings` 的文章由 seo-strategist 依承接的查詢定 | — | 列 `/blog/enterprise-ai-adoption`（`企業 AI 導入`，已填）、`/blog/ai-token-cost-management`（`AI Agent 地端部署 Token 成本` 的延伸閱讀）、`/blog/what-is-agentic-ai-platform`（`Agentic AI 是什麼` 的主要承接頁）。後兩篇補 `relatedOfferings: [zh-TW/orient-ai]`。`/blog/what-is-ai-agent-management-platform` 不補：主題跟 Agentic AI 那篇重疊，而且最舊，依新到舊也排不進三則。另外，`what-is-agentic-ai-platform` 與 `what-is-ai-agent-management-platform` 各有一節標題寫 OrientAI，內文卻沒連到本頁；建議在那一節加連結，錨點用節點名。兩篇是照現站搬的文章，改內文要使用者決定 | 定案：三篇如左；文章內文的連結待使用者決定 |

## 待確認

事實庫沒有這些內容，頁面不補、不寫成更強的說法：

| # | 事項 | 卡在哪 | 影響的段落 |
|---|---|---|---|
| 1 | OrientAI 的效益數字（`fact:orientai-benefits`） | `to_confirm`：沒有量測方式與基準（`messaging.md`「缺少證據的主張」第 7 項） | 1、8 |
| 2 | 具名客戶或導入案例 | 事實庫沒有 OrientAI 的客戶案例，這頁不設案例段 | — |
| 3 | 「企業端」包不包含私有雲（已結算） | 使用者說明（#199）：OrientAI 部署在企業端（地端），「雲地」指接的模型，兩則原文不矛盾。表述不寫 OrientAI 本身可以部署在雲端；「可以使用雲端 LLM API」現站沒有原文，收進事實庫前不寫（`messaging.md` `IT-1` 寫法、「缺少證據的主張」第 23 項，取捨第 4 項） | 2、5 |
| 4 | AISO 一體機的軟體核心是不是 OrientAI（已結算） | 是（使用者決定，#199，`fact:aiso-software-orientai`、`fact:aiso-orientai-hardware`；`messaging.md`「缺少證據的主張」第 17 項）。第 7 段連到 `/aiso` 的錨點寫明關係，`/aiso` 反連本頁 | 7 |
| 5 | OrientAI 可以使用雲端 LLM API 的現站原文 | `messaging.md`「缺少證據的主張」第 23 項。收進事實庫後，第 2 段可以寫出接雲端模型的方式 | 2 |

## 後續

- en、vi 版另做，照 `content-migration` skill「多語系內容」，不在這份 brief 的範圍
