# 首頁共用文案（#166）

`taste-skill` run 的第 5 步（`.claude/skills/taste-skill/SKILL.md`「5. Write the words」）。每個方向的原型都用這一份文字，讓方向之間的差異集中在設計。段落順序與每段的主張照 [`argument.md`](argument.md)，來源是 `docs/strategy/briefs/home.md` 與 `docs/strategy/messaging.md`，寫法照 `writing-style` 與 taste-skill 的 `references/copy.md`。

## 第三輪修正

上一輪五份評審共同指出的文案問題，逐點的改法：

| # | 問題 | 改法 |
|---|---|---|
| 1 | 第 2 段太長，375 寬的第一則案例被推到第 4–5 屏 | 改回 brief 的長度：引言一句，金融、政府各一句「得到什麼」加一則短事實與產業頁連結。拿掉金融檢查清單、惡意行為防護、三階段開放銀行與臺北市政府案例（留給產業頁）。顯示文字從約 400 字降到約 130 字 |
| 2 | 沒有標點的清單式原文照引，讀起來像錯字 | 換成能單獨成句的事實：ESGswift 改用 `fact:greenswift-standards`；OrientAI 的管控改用短條目 `fact:orientai-governance`、`fact:orientai-token-cost`；GadoSecurity 改用 `fact:gadodido-device-only-data`。刪掉 greenswift-scope、orientai-governance-layer（只留作不顯示的依據）、digirunner-financial-inspection、office-names、systalk-ai-onboarding 的照引 |
| 3 | 後設句 | 刪掉「每一則都有可以引用的成果」「是評估長期合作風險的資料」「成果照案例原文列出」這類句子，第 3、7 段引言改寫成讀者得到的判斷 |
| 4 | 重複 | 每則事實全頁只顯示一次：hero 說明句拿掉「規範要求做在產品功能裡」（留給第 2 段）；「2005 年創立」只在第 7 段；第 6 段說明句不再重述 `fact:aiso-onboarding` 的內容；阻詐案例不另放連結，只留段落的「看所有成功案例」；email、電話只在第 8 段，地址與版權只在頁尾 |
| 5 | 第 4 段產品家族 | 每個家族一句「解決什麼問題」加一則事實，產品連結寫節點名稱（含類別詞）與路徑 |
| 6 | 第 5 段 OrientAI | 特色定為 4 項，每項是決策者在意的掌控結果，各配一則短事實；拿掉 MCP 擴充那一項 |
| 7 | 第 6 段服務 | 服務名稱旁標「說明待補」，不另寫說明 |
| 8 | 第 8 段標題與動作不對應 | 加上第二個動作「預約 demo」，兩個動作的連結目的都寫明 |
| 9 | h1 與說明句 | h1 維持「金融與政府的系統／接上 API 與 AI」兩行；說明句以「昕力資訊（TPIsoftware）」開頭 |

## 規則

- 文字分兩種。**表述**（標題、說明、連結文字）是本檔原創，由人審。**事實**是「」括起來的原文，照 `docs/strategy/facts.yaml` 的 `text` 一字不改，後面標 `fact:<id>`；只用 zh-TW 的 `confirmed`
- 表述裡沒有數字與客戶名。表述背後有事實撐住、但事實不顯示時，標在「依據（不顯示）」
- 每則事實全頁只顯示一次。版型想在別處再放同一則事實（例如 hero 旁的數字、頁尾的聯絡方式），改放本檔指定的位置，不複製
- 缺的寫「待補」。不放範例數字、範例客戶、範例證言或統計（使用者決定，覆蓋 `references/copy.md` §5 允許範例內容的說法）
- 標題在每個寬度都不超過兩行。中文一個字約佔 1 個字級寬，拉丁字母約 0.55 個；`references/copy.md` §2 的「約 32 個字元」換成中文約 16 個全形字寬。下表的「字寬」用這個算法
- 預估字數算畫面上顯示的文字（表述加事實原文），不含連結文字與「依據」
- 主要動作一律叫「聯絡業務」，第二個動作只有第 8 段的「預約 demo」
- 版型需要的長度和本檔不同時（例如 hero blueprint 要 12 個拉丁字元以內），不改字，照 `references/copy.md` §2 先加寬欄寬、最後才縮字級，並寫進該方向 `sheet.md` 的「調整」

## title 與 description

原型的 `<title>` 與 meta description，照 brief「title 與 description 方向」的示例：

- title：昕力資訊 TPIsoftware｜金融與政府的 API 與 AI 軟體
- description：昕力資訊（TPIsoftware）研發並導入自有軟體，替金融與政府把 API、資料與 AI 安全接進既有系統，產品家族涵蓋 AI、數位轉型（DigiLism）、資安與 ESG。
- 依據（不顯示）：`fact:company-industries`、`fact:products-families`、`fact:company-offerings`

## 導覽

- wordmark：logo 橫式中英（`src/assets/brand/logo-horizontal-color.svg`，深色底用 `logo-horizontal-white.svg`）
- 連結：產業（`#industries`）、案例（`#cases`）、產品（`#products`）、關於昕力（`#about`）
- 動作：聯絡業務 → `/contact-us`
- 段落短名（給要用段落名稱當頁籤、資料夾標籤的版型）：產業、案例、產品、OrientAI、導入、紀錄、聯絡

## 1. Hero

- 目的：第一屏說出替誰做、做什麼，給主要動作
- h1：金融與政府的系統<br>接上 API 與 AI
  - 兩行在 `<br>` 處斷開，讀起來是一句。字寬：第一行 8、第二行約 6.7
  - 375 寬（可用 343px）：字級 42px 以下放得下兩行。1280 寬：字級 120px 以下放得下 960px 的欄寬
- 說明句：昕力資訊（TPIsoftware）研發並導入自有軟體，替銀行、保險公司與政府單位，把 API、資料與 AI 安全接進現有的系統。
  - 依據（不顯示）：`fact:company-industries`、`fact:company-offerings`、`fact:digilism-protocol-integration`
- 主要動作（按鈕）：聯絡業務 → `/contact-us`
- 次要動作（文字連結）：依產業看方案 → `#industries`
- 預估字數：h1 16 字，說明句約 55 字

## 2. 產業入口（`#industries`）

- 目的：決策者確認「是不是為我的產業做」，再送到產業頁。具名案例與規範細節在產業頁
- h2：規範要求，已做進產品
- 引言：銀行與政府單位導入新系統，先要過合規這一關。
  - 依據（不顯示）：`DM-1`

### 金融

- 說明：銀行導入 API 管理平台，不必從零設計開放銀行的合規架構。
- 事實：「昕力資訊 digiRunner API 管理平台反應台灣開放銀行金管會法規要求」`fact:digirunner-open-banking-fsc`
- 連結：看金融業方案 → `/industries/finance`

### 政府與公部門

- 說明：機關建置 API 管理平台，介面規範的要求已經對應好。
- 事實：「符合國家發展委員會【共通性應用程式介面規範】。」`fact:digirunner-ndc-spec`
- 連結：看政府與公部門方案 → `/industries/government`

- 預估字數：引言約 22 字；金融約 60 字（說明 27、事實 33）；政府約 45 字（說明 24、事實 21）；全段約 130 字（brief：引言 20–40，每個產業 25–40 字的說明加事實）

## 3. AI 案例（`#cases`）

- 目的：決策者找到一則有成果的案例
- h2：AI 已用在理賠、建檔與阻詐
- 引言：AI 接手的是金融保險每天都要做的作業，不是展示用的範例。
  - 依據（不顯示）：`DM-2`

| 案例名稱 | 成果原文 | 連結 |
|---|---|---|
| 「AI 智慧理賠」`fact:smartclaim-title` | 「全自動執行理賠立案到派件，精確解析診斷書，節省逾80%​人工作業時間」`fact:smartclaim-result` | AI 智能理賠解決方案 → `/solutions/smartclaim` |
| 「AI 智慧建檔」`fact:smartfilling-title` | 「透過免模板辨識醫療單據​解決格式變動痛點，提升辨識率並降低40%維護人力」`fact:smartfilling-result` | AI 智慧建檔解決方案 → `/solutions/smartfilling` |
| 「金融聯防阻詐平台」`fact:fraud-platform-title` | 「標準化聯防流程，詐騙事件即時共享，提升跨行交換的效率與透明度」`fact:fraud-platform-result` | 無（沒有自己的頁面，由段落連結承接） |

- 段落連結：看所有成功案例 → `/success-story`
- 案例沒有客戶名：已確認的具名案例講的是 API 平台與規則引擎，放在產業頁與產品頁（brief 第 3 段）
- 預估字數：引言約 28 字；三則案例約 115 字；全段約 145 字

## 4. 產品家族（`#products`）

- 目的：IT 主管依要解決的問題找到產品家族與產品頁
- h2：依要解決的問題找產品

### 數位轉型（DigiLism）→ `/products/digilism`

- 解決的問題：核心銀行系統與老舊大型主機不必汰換，經由 API 接上新服務。
- 事實：「以微服務架構的 DigiLism 專門協助處理核心銀行系統或過時大型機的資料轉換及通訊機制變更，可代替企業服務匯流排（ESB）」`fact:digilism-protocol-integration`
- 產品連結：digiRunner API 管理平台 → `/products/digirunner`、digiLogs 集中化日誌管理平台 → `/products/digilogs`、digiMars 大數據管理平台 → `/products/digimars`、digiFlexis 企業流程管理平台 → `/products/digiflexis`、digiCare 智慧醫療服務 → `/products/digicare`

### AI（SysTalk.ai）→ `/products/systalk-ai`

- 解決的問題：客服、質檢與文件辨識用同一個 AI 產品家族，模型依場景挑選。
- 事實：「SysTalk.ai 支援主流開源與企業級 LLM（如 70B 模型），企業可依場景選擇最合適的模型」`fact:aiso-llm-support`
- 產品連結：SysTalk.Chat AI 智能客服 → `/products/systalk-chat`、SysTalk.VIKI 企業生成式 AI 應用平台 → `/products/systalk-viki`、SysTalk.Coach AI 業務培訓 → `/products/systalk-coach`、SysTalk.Audit AI 語音質檢 → `/products/systalk-audit`、SysTalk.ICR AI 智慧光學字元辨識 → `/products/systalk-icr`、SysTalk.RPA 流程自動化 → `/products/systalk-rpa`
- 導覽裡同家族的 OrientAI、AI 智能理賠解決方案、AI 智慧建檔解決方案，連結已在第 3、5 段，這裡不重複（見「待補與待確認」第 5 項）

### ESG 與能源（ESGswift）→ `/products/esgswift`

- 解決的問題：碳盤查照國際標準計算，係數更新不必自己追。
- 事實：「系統內建最新的碳盤查標準和國際係數，可自由切換使用 GHG Protocol 及 ISO 14064-1:2018 標準，並定期更新 IPCC 的最新係數」`fact:greenswift-standards`
- 產品連結：GreenSwift 智慧碳管理平台 → `/products/greenswift`、ElectriSwift 智慧能源管理系統 → `/products/electriswift`

### 資安（GadoSecurity），家族頁不產生，不加連結

- 解決的問題：登入不靠密碼，使用者的驗證資料不集中在伺服器上。
- 事實：「個人驗證資料只存放於用戶裝置」`fact:gadodido-device-only-data`
- 產品連結：gadoDIDO 無密碼身分驗證 → `/products/gadodido`、gadoScout AI 異常偵測系統 → `/products/gadoscout`

- 段落連結：產品總覽 → `/products`
- 預估字數：DigiLism 約 95 字（說明 27、事實 68）；SysTalk.ai 約 70 字（說明 30、事實 42）；ESGswift 約 95 字（說明 20、事實 75）；GadoSecurity 約 40 字（說明 26、事實 14）；不含產品連結（brief：每個家族的說明 20–40 字）

## 5. OrientAI（`#orientai`）

- 目的：決策者確認企業 AI 的資料、權限與用量都在自己手上
- h2：企業 AI 留在自己的環境
- 說明：OrientAI 是企業級 Agentic AI 平台，部署在企業端。要用 AI，不必先把機敏資料交給外部服務。
  - 依據（不顯示）：`DM-3`、`fact:orientai-governance-layer`
- 特色（4 項，左欄是掌控結果，右欄是撐住它的事實）：

| 掌控結果（表述） | 事實 |
|---|---|
| 資料留在企業端 | 「資料會交給外部嗎？」之後接原文「不會。OrientAI 只會部署於企業端，資料掌控權為企業所有。」`fact:orientai-on-prem-data` |
| Agent 的權限由企業統一授權 | 「AI 治理」`fact:orientai-governance` |
| 用量與花費看得到、管得住 | 「Token 成本控管」`fact:orientai-token-cost` |
| 斷網也照常運作 | 「結合群聯 aiDAPTIV 獨家記憶體擴充技術，突破算力與容量限制，地端架構確保離線仍可穩定運行」`fact:orientai-aidaptiv` |

- 第一項的原文是現站問答的回答，以「不會。」開頭，所以前面一定要放問句「資料會交給外部嗎？」（表述），兩者一起出現
- 連結：認識 OrientAI → `/orient-ai`
- 預估字數：說明約 45 字；特色約 120 字（掌控結果 40、事實 80）；全段約 165 字

## 6. 產品與導入（`#services`）

- 目的：決策者評估導入風險，知道產品與導入找同一家
- h2：產品和導入，同一家負責
- 說明：產品是昕力自己研發的，導入也由昕力負責，出問題時不必在原廠和導入廠商之間來回協調。
  - 依據（不顯示）：`DM-4`
- 事實：「昕力資訊提供完整的導入規劃、模型設定、建置與應用模組設計服務」`fact:aiso-onboarding`
- 服務（連結用節點名稱，每項的說明都待補）：

| 服務 | 連到 | 說明 |
|---|---|---|
| AISO 主權 AI | `/aiso` | 說明待補 |
| 委外服務 | `/outsourcing` | 說明待補 |
| 雲端整合服務 | `/cloudservice` | 說明待補 |
| ChatGPT 企業服務 | `/chatgpt-enterprise` | 說明待補 |
| UI/UX 數位產品設計 | `/solutions/uiux` | 說明待補 |
| ESG 永續發展與顧問服務 | `/esg-advisory` | 說明待補 |

- 預估字數：說明約 42 字，事實約 32 字，全段約 75 字加服務名稱（brief：40–80 字加服務卡片）

## 7. 穩定度（`#about`）

- 目的：決策者評估長期合作的風險
- h2：合作得久，有紀錄可查
- 引言：這家公司做得夠久，海外有子公司，開發流程通過第三方認證。
  - 依據（不顯示）：`DM-6`
- 紀錄（左欄的年份取自同一列的原文，不另外加）：

| 年份或項目 | 原文 |
|---|---|
| 2005 | 「昕力資訊創立於 2005 年」`fact:company-founded` |
| 2008 | 「2008 年首度跨足金融產業，為華南銀行建置 CRM 系統」`fact:company-milestone-2008-finance` |
| 2017、2019 | 「分別在2017、2019年設立新加坡與越南子公司」`fact:company-subsidiaries-sg-vn` |
| 2020 | 「2020年以「TPIsoftware」 邁入國際」`fact:company-milestone-2020-brand` |
| 資安認證 | 「企業產品中台之開發流程 獲ISO27001 認證」`fact:cert-iso27001-product-platform` |
| 雲端夥伴 | 「正式成為 Google Cloud 合作夥伴」`fact:company-google-cloud-partner` |

- 連結：關於昕力 → `/about-us`
- 數字直接寫在 HTML，不做計數動畫
- 預估字數：引言約 28 字；六項約 105 字；全段約 135 字

## 8. 聯絡業務（`#contact`）

- 目的：主要轉換
- h2：談需求，或預約 demo
- 說明：寫下您的產業、現有系統與想接上的服務，昕力的業務會與您聯絡，安排需求會談或產品 demo。
- 回覆時間：待補（brief「待確認」第 4 項）
- 動作：
  - 主要（按鈕）：聯絡業務 → `/contact-us`
  - 次要（按鈕或文字連結）：預約 demo → `/contact-us`。新站沒有 demo 專用的頁面，兩個動作進同一張聯絡表單；表單要不要依動作預選主旨，見「待補與待確認」第 3 項
- 直接聯絡（全頁只在這裡出現）：
  - Email：「service@tpisoftware.com」`fact:company-email`
  - 電話：「+886 2 2658 0508」`fact:office-taipei-phone`
- 收尾句（給要在最後呼應 hero 的版型，例如 One motif 的 `cta-idea-restated-inverted`）：從現有的系統談起
- 單一動詞（給整段是一個連結的版型，例如 `cta-giant-word-is-the-button`）：聯絡業務；這類版型的「預約 demo」放在大字下方的文字連結
- 預估字數：說明約 45 字，聯絡方式約 40 字

## 頁尾

- wordmark：logo 橫式中英
- 連結：
  - 產業：金融 → `/industries/finance`、政府與公部門 → `/industries/government`
  - 產品：產品總覽 → `/products`、AI（SysTalk.ai）→ `/products/systalk-ai`、數位轉型（DigiLism）→ `/products/digilism`、ESG 與能源（ESGswift）→ `/products/esgswift`
  - 公司：關於我們 → `/about-us`、成功案例 → `/success-story`、聯絡我們 → `/contact-us`
- 台北總部：「114台北市內湖區瑞光路335號12樓」`fact:office-taipei-address`（全頁只在這裡出現；email 與電話在第 8 段）
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
| 第 7 段 | 合作得久，有紀錄可查 | 10 |
| 第 8 段 | 談需求，或預約 demo | 約 9.5 |

段落標題都在 13 個字寬以內，以 375 寬、28px 的 h2 計算（每行約 12 字）最多兩行。

## 待補與待確認

| # | 事項 | 位置 | 卡在哪 |
|---|---|---|---|
| 1 | 聯絡後多久回覆 | 第 8 段 | brief「待確認」第 4 項，沒有事實 |
| 2 | 六項服務各一句說明 | 第 6 段 | brief 沒有寫，要從各服務頁的事實取 |
| 3 | 「預約 demo」連到哪裡 | 第 8 段 | 新站沒有 demo 頁，兩個動作都連 `/contact-us`。要不要讓表單依動作預選主旨（例如帶參數），是表單的實作，交主 session 決定 |
| 4 | 第 6 段不再放 SysTalk.ai 的導入順序 | 第 6 段 | brief 第 6 段列了 systalk-ai-onboarding，但原文是沒有標點的清單，照引讀起來像錯字；只引片段又等於改寫原文。`argument.md`「可以操作的一件事」的「拖過導入的四個階段」因此沒有文案可用，選這個互動的方向要改選其他候選 |
| 5 | 第 4 段 SysTalk.ai 家族不重列 OrientAI、AI 智能理賠解決方案、AI 智慧建檔解決方案 | 第 4 段 | brief 要「列出導覽裡的產品」；這三個連結已在第 3、5 段，為了縮短 375 寬的長度不重列。要照 brief 全列時，加回這三個連結即可 |
| 6 | ESGswift 的家族句改寫成「依國際標準計算」 | 第 4 段 | brief 要寫「碳盤查範圍」，原本用的 greenswift-scope 是清單式原文。範圍（跨廠區、CBAM、碳足跡）沒有能單獨成句的確認事實，改說標準與係數 |
| 7 | GadoSecurity 只用 gadoDIDO 的事實 | 第 4 段 | 家族頁是 draft，沒有家族介紹；gadoScout 的異常偵測由產品連結的節點名稱帶出，沒有另放事實 |
| 8 | `argument.md` 的證明欄仍列已不顯示的事實（第 2、4、5、6 段，以及清點第 3、6、9、12 項） | `argument.md` | 本次只改本檔。要不要同步 `argument.md`，交主 session |
| 9 | 要不要在第 7 段加客戶證言（testimonial-shin-kong-bank） | 第 7 段 | brief「待確認」第 1 項；事實庫的原文沒有說話人姓名與職稱，P2 要求證言寫出說話人 |
| 10 | h1 從 brief 建議的定位句短版（「替金融與政府，把 API 與 AI 安全接進既有系統」，約 20 字寬）縮成約 14.7 字寬，「安全」移到說明句 | 第 1 段 | taste-skill 的兩行規則；短版在 375 寬要縮到約 34px 才放得下兩行 |
| 11 | 金融與政府的排序 | 第 1、2 段 | brief「待確認」第 5 項，目前金融在前 |
| 12 | 開放圖庫圖片的出處 | 頁尾 | 第 3 階段才下載 |
