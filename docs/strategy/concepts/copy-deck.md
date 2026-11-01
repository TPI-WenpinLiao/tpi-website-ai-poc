# 首頁共用文案（#166）

`taste-skill` run 的第 5 步（`.claude/skills/taste-skill/SKILL.md`「5. Write the words」）。五個方向的原型都用這一份文字，讓方向之間的差異集中在設計。段落順序與每段的主張照 [`argument.md`](argument.md)，來源是 `docs/strategy/briefs/home.md` 與 `docs/strategy/messaging.md`，寫法照 `writing-style` 與 taste-skill 的 `references/copy.md`。

## 規則

- 文字分兩種。**表述**（標題、說明、連結文字）是本檔原創，由人審。**事實**是「」括起來的原文，照 `docs/strategy/facts.yaml` 的 `text` 一字不改，後面標 `fact:<id>`；只用 zh-TW 的 `confirmed`
- 表述裡沒有數字與客戶名。表述背後有事實撐住時，標在「依據」
- 缺的寫「待補」。不放範例數字、範例客戶、範例證言或統計（使用者決定，覆蓋 `references/copy.md` §5 允許範例內容的說法）
- 標題在每個寬度都不超過兩行。中文一個字約佔 1 個字級寬，拉丁字母約 0.55 個；`references/copy.md` §2 的「約 32 個字元」換成中文約 16 個全形字寬。下表的「字寬」用這個算法
- 同一個動作全頁只用一個名稱：主要動作一律是「聯絡業務」
- 版型需要的長度和本檔不同時（例如 hero blueprint 要 12 個拉丁字元以內），不改字，照 `references/copy.md` §2 先加寬欄寬、最後才縮字級，並寫進該方向 `sheet.md` 的「調整」

## title 與 description

原型的 `<title>` 與 meta description，照 brief「title 與 description 方向」的示例：

- title：昕力資訊 TPIsoftware｜金融與政府的 API 與 AI 軟體
- description：昕力資訊（TPIsoftware）研發並導入自有軟體，替金融與政府把 API、資料與 AI 安全接進既有系統，產品家族涵蓋 AI、數位轉型（DigiLism）、資安與 ESG。
- 依據：`fact:company-industries`、`fact:products-families`、`fact:company-offerings`

## 導覽

- wordmark：logo 橫式中英（`src/assets/brand/logo-horizontal-color.svg`，深色底用 `logo-horizontal-white.svg`）
- 連結：產業（`#industries`）、案例（`#cases`）、產品（`#products`）、關於昕力（`#about`）
- 動作：聯絡業務 → `/contact-us`
- 段落短名（給要用段落名稱當頁籤、資料夾標籤的版型）：產業、案例、產品、OrientAI、導入、紀錄、聯絡

## 1. Hero

- h1：金融與政府的系統<br>接上 API 與 AI
  - 兩行在 `<br>` 處斷開，讀起來是一句「金融與政府的系統接上 API 與 AI」。字寬：第一行 8、第二行約 6.7，共約 14.7（以文字計 16 字，在 brief 的 15–25 字內）
  - 375 寬（左右邊距 16px，可用 343px）：第一行 8 字寬，字級 42px 以下放得下。1280 寬：第一行 8 字寬，字級 120px 以下放得下 960px 的欄寬
  - 安全、既有、API 管理平台這幾個詞放進說明句，h1 不再加字
- 說明句（緊接在 h1 下方）：昕力資訊（TPIsoftware）研發並導入自有軟體，把 API、資料與 AI 安全接進既有系統；規範要求直接做在產品功能裡。
  - 依據：`fact:company-industries`、`fact:products-families`、`fact:company-offerings`、`fact:digilism-protocol-integration`、`fact:digirunner-open-banking-fsc`、`fact:digirunner-ndc-spec`
- 主要動作（按鈕）：聯絡業務 → `/contact-us`
- 次要動作（文字連結）：依產業看方案 → `#industries`

## 2. 產業入口（`#industries`）

- h2：規範要求，已做進產品
- 引言：開放銀行、金融檢查與政府 API 規範的要求，digiRunner 已有對應功能，專案不必從零設計合規架構。
  - 依據：`fact:digirunner-open-banking-fsc`、`fact:digirunner-financial-inspection`、`fact:digirunner-ndc-spec`

### 金融

- 說明：銀行與保險公司導入 API 管理平台時，開放銀行與金融檢查的要求已經對應好。
- 事實列（左欄是表述的短標，右欄是原文）：

| 短標 | 原文 |
|---|---|
| 開放銀行 | 「昕力資訊 digiRunner API 管理平台反應台灣開放銀行金管會法規要求」`fact:digirunner-open-banking-fsc` |
| 開放銀行 | 「昕力資訊實現三階段開放銀行規範」`fact:digirunner-open-banking-3-stages` |
| 金融檢查 | 「針對金融檢查，完善 API 管理： API 生命週期作業 訂定交易限制 訂定連線識別名稱產製方式 定期盤點作業及風險評估 進行資源與服務監控作業 完善之服務憑證管理規範 進行分類分級管理 API Key 識別認證 採用 OAuth 2.0」`fact:digirunner-financial-inspection` |

- 連結：看金融業方案 → `/industries/finance`

### 政府與公部門

- 說明：政府單位建置 API 管理平台時，共通性規範與惡意行為防護已經內建。
- 事實列：

| 短標 | 原文 |
|---|---|
| 共通性規範 | 「符合國家發展委員會【共通性應用程式介面規範】。」`fact:digirunner-ndc-spec` |
| 惡意行為防護 | 「具備惡意行為防護功能，可以識別程式碼注入、跨站台腳本攻擊、SQL 攻擊語法與 XML、JSON 結構語法威脅；並能搭配防毒軟體偵測病毒攻擊。」`fact:digirunner-gov-threat-protection` |
| 臺北市政府 | 「為臺北市政府建置符合統一標準的API管理平台，使各機關的異質應用系統資料介接，讓市府推動資料開放政策，拓展創新應用之可行性，極大化開放資料加值應用與民眾參與公共政策。此外，昕力顧問團隊更協助市府建立API管理制度，並輔導各級機關一一導入上線。」`fact:digirunner-case-taipei-city` |

- 連結：看政府與公部門方案 → `/industries/government`

比 brief 多的事實：brief 第 2 段只列 `fact:digirunner-open-banking-fsc`、`fact:digirunner-ndc-spec`。taste-skill 要求每段寫滿內容，所以從 messaging `DM-1`、`IT-2` 補上其他四條，每個產業各三列。要不要用，交人決定（見「待補與待確認」）。

## 3. AI 案例（`#cases`）

- h2：AI 已用在理賠、建檔與阻詐
- 引言：三則案例都是金融保險的日常作業，每一則都有可以引用的成果。
  - 依據：`DM-2`

| 案例名稱 | 作業（表述） | 成果原文 | 連結 |
|---|---|---|---|
| 「AI 智慧理賠」`fact:smartclaim-title` | 理賠立案到派件 | 「全自動執行理賠立案到派件，精確解析診斷書，節省逾80%​人工作業時間」`fact:smartclaim-result` | AI 智能理賠解決方案 → `/solutions/smartclaim` |
| 「AI 智慧建檔」`fact:smartfilling-title` | 醫療單據建檔 | 「透過免模板辨識醫療單據​解決格式變動痛點，提升辨識率並降低40%維護人力」`fact:smartfilling-result` | AI 智慧建檔解決方案 → `/solutions/smartfilling` |
| 「金融聯防阻詐平台」`fact:fraud-platform-title` | 跨行詐騙聯防 | 「標準化聯防流程，詐騙事件即時共享，提升跨行交換的效率與透明度」`fact:fraud-platform-result` | 看所有成功案例 → `/success-story` |

- 段落連結：看所有成功案例 → `/success-story`
- 案例沒有客戶名：brief 第 3 段說明這三則是 AI 作業，已確認的具名案例講的是 API 平台與規則引擎，放在第 2 段與產品頁

## 4. 產品家族（`#products`）

- h2：依要解決的問題找產品

| 家族（連結） | 解決的問題（表述） | 一條原文 | 產品連結（節點名稱） |
|---|---|---|---|
| 數位轉型（DigiLism）→ `/products/digilism` | 核心系統與大型主機透過 API 接進來，AI 模型也走同一道 Gateway。依據：`fact:digilism-protocol-integration`、`fact:digilism-family-digirunner` | 「整合 MCP 協定與 AI Gateway 架構，讓 AI 模型安全串接企業 API、資料與業務流程」`fact:digilism-family-digirunner` | digiRunner API 管理平台、digiLogs 集中化日誌管理平台、digiMars 大數據管理平台、digiFlexis 企業流程管理平台、digiCare 智慧醫療服務 |
| AI（SysTalk.ai）→ `/products/systalk-ai` | 依場景選擇合適的大語言模型，從智能客服、語音質檢到文件辨識都有產品。依據：`fact:aiso-llm-support` | 「SysTalk.ai 支援主流開源與企業級 LLM（如 70B 模型），企業可依場景選擇最合適的模型」`fact:aiso-llm-support` | OrientAI 企業級 Agentic AI 平台、SysTalk.Chat AI 智能客服、SysTalk.VIKI 企業生成式 AI 應用平台、SysTalk.Coach AI 業務培訓、SysTalk.Audit AI 語音質檢、SysTalk.ICR AI 智慧光學字元辨識、SysTalk.RPA 流程自動化、AI 智能理賠解決方案、AI 智慧建檔解決方案 |
| ESG 與能源（ESGswift）→ `/products/esgswift` | 碳盤查、產品碳足跡與 CBAM 申報資料，用同一套平台整理。依據：`fact:greenswift-scope` | 「碳盤查 盤查企業自身碳排放 包括跨地區/廠區/設備/系統 CBAM 自動文件資訊化碳排 並產出申報清冊 碳足跡 計算企業產品碳足跡 計算相關供應鏈碳足跡」`fact:greenswift-scope` | GreenSwift 智慧碳管理平台、ElectriSwift 智慧能源管理系統 |
| 資安（GadoSecurity），家族頁不產生，不加連結 | 使用者登入不必用密碼，系統日誌裡的入侵與攻擊由機器學習找出來。依據：`fact:gadodido-passwordless`、`fact:gadoscout-ml-detection` | 「FIDO2 無密碼 零信任身分驗證」`fact:gadodido-passwordless`；「利用機器學習模型分析日誌並檢測異常，能快速識別入侵與攻擊」`fact:gadoscout-ml-detection` | gadoDIDO 無密碼身分驗證、gadoScout AI 異常偵測系統 |

- 段落連結：產品總覽 → `/products`
- 產品連結的錨點用節點名稱（含類別詞），例如「digiRunner API 管理平台」，不只寫產品名（brief「取捨」第 7 項）
- 原文 `fact:greenswift-scope` 是三組「名稱加說明」用空格連起來的，排版時可以拆成三行（碳盤查、CBAM、碳足跡），字不改

## 5. OrientAI（`#orientai`）

- h2：企業 AI 留在自己的環境
- 說明：OrientAI 只部署在企業端，資料的掌控權在企業手上。Agent 的權限、影子 AI 與 Token 用量都有管控；搭配群聯 aiDAPTIV，地端架構離線也能運行。
  - 依據：`fact:orientai-on-prem-data`、`fact:orientai-governance-layer`、`fact:orientai-token-cost`、`fact:orientai-aidaptiv`
- 特色（前四項必放，第五項給要五到七個面板的版型）：

| 短標（表述） | 原文 |
|---|---|
| 資料會交給外部嗎？ | 「不會。OrientAI 只會部署於企業端，資料掌控權為企業所有。」`fact:orientai-on-prem-data` |
| 統一管控 | 「AI Agent 統一管控與授權標準化 Token 用量監控與資源配置最佳化 消除影子 AI，防止機敏資料外洩 跨部門統一權限管理與資料治理」`fact:orientai-governance-layer` |
| 離線運行 | 「結合群聯 aiDAPTIV 獨家記憶體擴充技術，突破算力與容量限制，地端架構確保離線仍可穩定運行」`fact:orientai-aidaptiv` |
| 擴充 | 「MCP 擴充應用 標準化整合功能模組，彈性擴展業務，持續優化流程」`fact:orientai-mcp` |
| 成本 | 「Token 成本控管」`fact:orientai-token-cost` |

- 第一項的原文以「不會。」開頭，是現站問答的回答，所以短標寫成問句，兩者一起出現
- 連結：認識 OrientAI → `/orient-ai`

## 6. 產品與導入（`#services`）

- h2：產品和導入，同一家負責
- 說明：昕力自己研發產品，也負責導入規劃、模型設定、建置與應用模組設計，決策者不必在產品原廠和導入廠商之間協調。
  - 依據：`fact:aiso-onboarding`、`fact:company-offerings`
- 一條原文：「昕力資訊提供完整的導入規劃、模型設定、建置與應用模組設計服務」`fact:aiso-onboarding`
- 導入的順序（SysTalk.ai 的 AI 導入，原文是「導入前 AI應用規劃與導入 AI 導入情境分析 解決方案搭配建議 效益評估 AI 服務導入 導入中 模型評估、微調」`fact:systalk-ai-onboarding`）。要四個階段的版型照下表拆，字不改：

| 階段 | 原文的片段 |
|---|---|
| 導入前 | AI 導入情境分析 |
| 導入前 | 解決方案搭配建議 |
| 導入前 | 效益評估 |
| 導入中 | 模型評估、微調 |

- 這個順序是 SysTalk.ai 的導入服務，畫面上要寫明是 AI 導入，不寫成所有產品的導入流程
- 服務（連結，用節點名稱）：AISO 主權 AI → `/aiso`、委外服務 → `/outsourcing`、雲端整合服務 → `/cloudservice`、ChatGPT 企業服務 → `/chatgpt-enterprise`、UI/UX 數位產品設計 → `/solutions/uiux`、ESG 永續發展與顧問服務 → `/esg-advisory`
- 每項服務的一句說明：待補（brief 沒有寫，要從各服務頁的事實取）

## 7. 穩定度（`#about`）

- h2：評估長期合作的依據
- 引言：成立年份、海外子公司、資安認證與雲端夥伴關係，是評估長期合作風險的資料。
  - 依據：`DM-6`
- 紀錄（左欄的年份取自同一列的原文）：

| 年份或項目 | 原文 |
|---|---|
| 2005 | 「昕力資訊創立於 2005 年」`fact:company-founded` |
| 2008 | 「2008 年首度跨足金融產業，為華南銀行建置 CRM 系統」`fact:company-milestone-2008-finance` |
| 2017、2019 | 「分別在2017、2019年設立新加坡與越南子公司」`fact:company-subsidiaries-sg-vn` |
| 2020 | 「2020年以「TPIsoftware」 邁入國際」`fact:company-milestone-2020-brand` |
| 資安認證 | 「企業產品中台之開發流程 獲ISO27001 認證」`fact:cert-iso27001-product-platform` |
| 雲端夥伴 | 「正式成為 Google Cloud 合作夥伴」`fact:company-google-cloud-partner` |

- 版型要更多列或要地點時可加（都是 `confirmed`）：2011「2011年開發第一個 產品 – TPRS 推薦系統」`fact:company-milestone-2011-tprs`；據點「台北總部 新加坡 越南 日本 新竹專案管理中心 台中專案管理中心 台南開發中心 高雄開發中心」`fact:office-names`
- 連結：關於昕力 → `/about-us`
- 數字直接寫在 HTML，不做計數動畫

## 8. 聯絡業務（`#contact`）

- h2：談需求，或預約 demo
- 說明：填寫聯絡表單，說明您的產業、現有系統與想接上的服務，昕力的業務會與您聯絡。
- 回覆時間：待補（brief「待確認」第 4 項）
- 動作：聯絡業務 → `/contact-us`
- 直接聯絡：
  - Email：「service@tpisoftware.com」`fact:company-email`
  - 電話：「+886 2 2658 0508」`fact:office-taipei-phone`
  - 台北總部：「114台北市內湖區瑞光路335號12樓」`fact:office-taipei-address`
- 收尾句（給要在最後呼應 hero 的版型，例如 One motif 的 `cta-idea-restated-inverted`）：從既有系統談起
- 單一動詞（給整段是一個連結的版型，例如 `cta-giant-word-is-the-button`）：聯絡業務

## 頁尾

- wordmark：logo 橫式中英
- 連結：
  - 產業：金融 → `/industries/finance`、政府與公部門 → `/industries/government`
  - 產品：產品總覽 → `/products`、AI（SysTalk.ai）、數位轉型（DigiLism）、ESG 與能源（ESGswift）
  - 公司：關於我們 → `/about-us`、成功案例 → `/success-story`、聯絡我們 → `/contact-us`
- 聯絡：「114台北市內湖區瑞光路335號12樓」`fact:office-taipei-address`；「+886 2 2658 0508」`fact:office-taipei-phone`；「service@tpisoftware.com」`fact:company-email`
- 版權：「©2026 TPIsoftware All rights reserved」`fact:company-copyright`
- 圖片出處：開放圖庫的圖在第 3 階段下載後，用 `assets.mjs --credits` 產生，一行小字放在頁尾。待補

## 標題的字寬

| 位置 | 文字 | 字寬 |
|---|---|--:|
| h1 第一行 | 金融與政府的系統 | 8 |
| h1 第二行 | 接上 API 與 AI | 約 6.7 |
| 第 2 段 | 規範要求，已做進產品 | 10 |
| 第 3 段 | AI 已用在理賠、建檔與阻詐 | 約 12.4 |
| 第 4 段 | 依要解決的問題找產品 | 10 |
| 第 5 段 | 企業 AI 留在自己的環境 | 約 10.7 |
| 第 6 段 | 產品和導入，同一家負責 | 11 |
| 第 7 段 | 評估長期合作的依據 | 9 |
| 第 8 段 | 談需求，或預約 demo | 約 9.5 |

段落標題都在 13 個字寬以內，以 375 寬、28px 的 h2 計算（每行約 12 字）最多兩行。

## 待補與待確認

| # | 事項 | 位置 | 卡在哪 |
|---|---|---|---|
| 1 | 聯絡後多久回覆 | 第 8 段 | brief「待確認」第 4 項，沒有事實 |
| 2 | 六項服務各一句說明 | 第 6 段 | brief 沒有寫，要從各服務頁的事實取 |
| 3 | 要不要在第 7 段加客戶證言 `fact:testimonial-shin-kong-bank` | 第 7 段 | brief「待確認」第 1 項；事實庫的原文沒有說話人姓名與職稱，P2 要求證言寫出說話人 |
| 4 | 第 2 段比 brief 多四條事實（`fact:digirunner-open-banking-3-stages`、`fact:digirunner-financial-inspection`、`fact:digirunner-gov-threat-protection`、`fact:digirunner-case-taipei-city`） | 第 2 段 | brief 只列兩條；多的四條都是 messaging `DM-1`、`IT-2` 的事實，是為了讓表格型的版型有足夠的列 |
| 5 | h1 從 brief 建議的定位句短版（「替金融與政府，把 API 與 AI 安全接進既有系統」，約 20 字寬）縮成約 14.7 字寬，「安全」「既有」移到說明句 | 第 1 段 | taste-skill 的兩行規則；短版在 375 寬要縮到約 34px 才放得下兩行。要不要改回短版，交人決定 |
| 6 | 金融與政府的排序 | 第 1、2 段 | brief「待確認」第 5 項，目前金融在前 |
| 7 | 開放圖庫圖片的出處 | 頁尾 | 第 3 階段才下載 |
