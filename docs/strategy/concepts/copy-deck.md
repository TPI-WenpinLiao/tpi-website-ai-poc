# 首頁共用文案（#166）

`taste-skill` run 的第 5 步（`.claude/skills/taste-skill/SKILL.md`「5. Write the words」）。兩個設計方向（沉浸式 3D 場景、捲動敘事）的原型都用這一份文字，讓方向之間的差異集中在設計。來源是 `docs/strategy/briefs/home.md` 與 `docs/strategy/messaging.md`，寫法照 `writing-style` 與 taste-skill 的 `references/copy.md`。

## 第四輪：偏離 brief 的地方

使用者看過前三輪原型的評語是「不像官方的形象網站，文字都很多」。使用者 2026-11-01 決定：首頁精簡成 5 個全螢幕段落，每段一句大標題，加最多一句說明或一則事實，細節移到產品頁與產業頁。本檔因此偏離 `briefs/home.md` 的 8 段。brief 等方向選定後再同步，本輪不改 brief。

| # | brief 寫的 | 本檔 | 理由 |
|---|---|---|---|
| 1 | 8 段 | 5 段：Hero、產業、AI 成果、產品平台、信任與聯絡 | 使用者決定 |
| 2 | 第 1 段次要動作「依產業看方案」→ `#industries` | 「看產品」→ `#products` | 使用者指定。產業段緊接在 hero 後，捲一次就到 |
| 3 | 第 3 段連到兩個解決方案頁與成功案例列表 | 只連成功案例列表 | 每段一個出口。兩個解決方案頁由產品頁與成功案例承接 |
| 4 | 第 3 段有引言 | 沒有引言，h2 直接說結論 | 每段最多一句說明；這段的文字留給三則成果原文 |
| 5 | 第 4 段四個產品家族，各一句說明加一則事實，列出導覽裡的產品 | 一句 h2 加 4 個產品名稱，不放家族名、說明與事實 | 產品功能屬於事實，一句說明就要一則原文；名稱本身帶類別詞，已說出產品做什麼。家族與功能留給 `/products` 與各產品頁 |
| 6 | 第 5 段 OrientAI 獨立一段，4 項特色 | 併入產品平台段，一句「資料留在企業端」加連結 | 使用者指定 |
| 7 | 第 6 段產品與導入、服務卡片 | 拿掉。「自己研發、也負責導入」移到 hero 說明句 | 六項服務都沒有說明可寫（第三輪待補第 2 項）；`DM-4` 的主張用一句帶過 |
| 8 | 第 7 段 6 項穩定度事實 | 3 項，併入聯絡段 | 使用者指定 3–4 項。挑法見第 5 段 |
| 9 | 第 8 段 h2「談需求，或預約 demo」與兩個動作 | 只有「聯絡業務」 | 兩個動作都連 `/contact-us`，目的相同，第三輪評審要求只留一個 |
| 10 | 頁面總長約 1,000 字以上 | 約 310 字（算法見「規則」），目標 250 字 | 使用者決定。超出的原因與可刪的地方見「需要人決定」第 1 項 |

## 規則

- 文字分兩種。**表述**（標題、說明、連結文字）是本檔原創，由人審。**事實**是「」括起來的原文，照 `docs/strategy/facts.yaml` 的 `text` 一字不改，後面標 `fact:<id>`；只用 zh-TW 的 `confirmed`
- 表述裡沒有數字與客戶名。表述背後有事實撐住、但事實不顯示時，標在「依據（不顯示）」
- 每則事實全頁只顯示一次，版型不在別處複製（例如 hero 旁放年份、頁尾再放電話）
- 同一個東西只用一個名稱：「既有系統」（不寫「現有系統」）、稱公司用「昕力」或「昕力資訊」（不寫「這家公司」「我們」）、主要動作只叫「聯絡業務」
- 缺的寫「待補」。不放範例數字、範例客戶、範例證言或統計
- 標題在每個寬度都不超過兩行。中文一個字約佔 1 個字級寬，拉丁字母約 0.55 個；中文約 16 個全形字寬一行
- 字數：中文字與標點各算 1，一個拉丁單字或一組數字算 1（例如 `digiRunner`、`2005`、`ISO27001`）。只算畫面上的表述與事實原文，連結文字（含產品名稱）另列，不含導覽與頁尾。第三輪按字母計，本輪改按單字，因為閱讀負擔看的是詞數
- 每段的「畫面提示」是給設計方向的參考，不規定版面
- 版型需要的長度和本檔不同時，不改字，照 `references/copy.md` §2 先加寬欄寬、最後才縮字級，並寫進該方向 `sheet.md` 的「調整」

## title 與 description

- title：昕力資訊 TPIsoftware｜金融與政府的 API 與 AI 軟體
- description：昕力資訊（TPIsoftware）研發並導入自有軟體，替金融與政府把 API、資料與 AI 安全接進既有系統，產品家族涵蓋 AI、數位轉型（DigiLism）、資安與 ESG。
- 依據（不顯示）：`fact:company-industries`、`fact:products-families`、`fact:company-offerings`

## 導覽

- wordmark：logo 橫式中英（`src/assets/brand/logo-horizontal-color.svg`，深色底用 `logo-horizontal-white.svg`）
- 連結：產業（`#industries`）、案例（`#cases`）、產品（`#products`）、關於昕力（`/about-us`）
- 動作：聯絡業務 → `/contact-us`
- 段落短名（給要用段落名稱當進度標示的版型）：昕力、產業、案例、產品、聯絡

## 1. Hero

- h1：金融與政府的既有系統<br>原地接上 API 與 AI
  - 兩行在 `<br>` 處斷開，讀起來是一句。字寬：第一行 10、第二行約 7.9
  - 「原地」說的是系統不必搬、不必換，接上新的能力
  - 依據（不顯示）：`fact:company-industries`、`fact:digilism-protocol-integration`
- 說明句：昕力資訊（TPIsoftware）自行研發產品，也負責導入規劃與建置。
  - 依據（不顯示）：`fact:company-offerings`、`fact:aiso-onboarding`、`DM-4`
- 主要動作（按鈕）：聯絡業務 → `/contact-us`
- 次要動作（文字連結）：看產品 → `#products`
- 預估字數：h1 17，說明句 23，全段約 40
- 畫面提示：一套既有系統（主機、資料庫、櫃台）不動，新的 API 與 AI 從外側接上；3D 方向可做成三層系統逐一接上線路的場景，捲動方向可做成接上的那一刻

## 2. 產業（`#industries`）

- h2：規範要求，已做進產品

### 金融 → `/industries/finance`

- 事實：「昕力資訊 digiRunner API 管理平台反應台灣開放銀行金管會法規要求」`fact:digirunner-open-banking-fsc`
- 連結：看金融業方案

### 政府與公部門 → `/industries/government`

- 事實：「符合國家發展委員會【共通性應用程式介面規範】。」`fact:digirunner-ndc-spec`
- 連結：看政府與公部門方案
- 這則原文沒有主詞，靠 h2 的「產品」承接；兩則都講 API 管理平台，排在同一段讀起來是同一個產品過兩套規範

- 預估字數：h2 10，金融 27（名稱 2、事實 25），政府 29（名稱 6、事實 23），全段約 66
- 畫面提示：兩扇大入口並排或上下，各自只有產業名與一行原文；整塊都是連結

## 3. AI 成果（`#cases`）

- h2：AI 已接手每天的作業
  - 依據（不顯示）：`DM-2`

| 作業名稱 | 成果原文 |
|---|---|
| 「AI 智慧理賠」`fact:smartclaim-title` | 「全自動執行理賠立案到派件，精確解析診斷書，節省逾80%​人工作業時間」`fact:smartclaim-result` |
| 「AI 智慧建檔」`fact:smartfilling-title` | 「透過免模板辨識醫療單據​解決格式變動痛點，提升辨識率並降低40%維護人力」`fact:smartfilling-result` |
| 「金融聯防阻詐平台」`fact:fraud-platform-title` | 「標準化聯防流程，詐騙事件即時共享，提升跨行交換的效率與透明度」`fact:fraud-platform-result` |

- 段落連結：看所有成功案例 → `/success-story`
- 三則都沒有客戶名，也不加；數字只在原文裡，不另外拉成大字
- 預估字數：h2 9，三則 112（理賠 36、建檔 38、阻詐 38），全段約 121
- 畫面提示：三張依序出現的作業卡，作業名稱放大、原文在下；原文裡的「80%」「40%」可以用字重強調，但不拆出原文、不做計數動畫（數字一定要和原文一起出現）

## 4. 產品平台（`#products`）

- h2：API、AI、資安與碳管理，各有產品
- 產品（連結文字用節點名稱，含類別詞；順序對應 h2）：
  - digiRunner API 管理平台 → `/products/digirunner`
  - SysTalk.VIKI 企業生成式 AI 應用平台 → `/products/systalk-viki`
  - gadoDIDO 無密碼身分驗證 → `/products/gadodido`
  - GreenSwift 智慧碳管理平台 → `/products/greenswift`
- OrientAI 一句：企業要用 AI，資料留在企業端。
  - 連結：認識 OrientAI 企業級 Agentic AI 平台 → `/orient-ai`
  - 依據（不顯示）：`fact:orientai-on-prem-data`、`DM-3`
- 段落連結：產品總覽 → `/products`
- 預估字數：h2 15，OrientAI 一句 13，全段約 28；連結文字另計（4 個產品名稱約 17 詞）
- 畫面提示：四個產品名稱排成一組大字清單或四塊平台，OrientAI 一句單獨成一塊、跟四個產品分開；3D 方向可把四個產品當成接在既有系統上的四層模組

## 5. 信任與聯絡（`#contact`）

- h2：合作得久，有紀錄可查
- 紀錄（年份取自同一列的原文，不另外加）：

| 年份或項目 | 原文 |
|---|---|
| 2005 | 「昕力資訊創立於 2005 年」`fact:company-founded` |
| 2008 | 「2008 年首度跨足金融產業，為華南銀行建置 CRM 系統」`fact:company-milestone-2008-finance` |
| 資安認證 | 「企業產品中台之開發流程 獲ISO27001 認證」`fact:cert-iso27001-product-platform` |

- 挑法：年份說做得久，2008 那則是金融讀者會認得的具名銀行，ISO27001 說開發流程有第三方認證。沒選的候選（都是 confirmed，可替換）：「分別在2017、2019年設立新加坡與越南子公司」`fact:company-subsidiaries-sg-vn`、「正式成為 Google Cloud 合作夥伴」`fact:company-google-cloud-partner`
- 主要動作（按鈕）：聯絡業務 → `/contact-us`
- 直接聯絡（全頁只在這裡出現）：
  - Email：「service@tpisoftware.com」`fact:company-email`
  - 電話：「+886 2 2658 0508」`fact:office-taipei-phone`
- 連結：關於昕力 → `/about-us`
- 數字直接寫在 HTML，不做計數動畫
- 預估字數：h2 10，三則紀錄 45，聯絡方式 2，全段約 57
- 畫面提示：三個年份或項目的大字（2005、2008、ISO27001）各帶一行原文，下面接一顆放大的「聯絡業務」與兩行聯絡方式；整段是頁面的收尾，可呼應 hero 的接線畫面

## 頁尾

- wordmark：logo 橫式中英
- 連結：
  - 產業：金融 → `/industries/finance`、政府與公部門 → `/industries/government`
  - 產品：產品總覽 → `/products`、AI（SysTalk.ai）→ `/products/systalk-ai`、數位轉型（DigiLism）→ `/products/digilism`、ESG 與能源（ESGswift）→ `/products/esgswift`
  - 公司：關於我們 → `/about-us`、成功案例 → `/success-story`、聯絡我們 → `/contact-us`
- 台北總部：「114台北市內湖區瑞光路335號12樓」`fact:office-taipei-address`（全頁只在這裡出現；email 與電話在第 5 段）
- 版權：「©2026 TPIsoftware All rights reserved」`fact:company-copyright`
- 圖片出處：開放圖庫的圖在第 3 階段下載後，用 `assets.mjs --credits` 產生，一行小字放在頁尾。待補

## 字數與字寬

| 段落 | 標題 | 標題字寬 | 預估字數 |
|---|---|--:|--:|
| 1 Hero | 金融與政府的既有系統／原地接上 API 與 AI | 10／約 7.9 | 40 |
| 2 產業 | 規範要求，已做進產品 | 10 | 66 |
| 3 AI 成果 | AI 已接手每天的作業 | 約 9.6 | 121 |
| 4 產品平台 | API、AI、資安與碳管理，各有產品 | 約 15.3 | 28（另有產品名稱的連結文字） |
| 5 信任與聯絡 | 合作得久，有紀錄可查 | 10 | 57 |
| 合計 | | | 約 312 |

段落標題除了第 4 段都在 10 個字寬左右；第 4 段約 15.3，375 寬、28px 的 h2（每行約 12 字）會斷成兩行，斷在「，」後。

## 需要人決定

| # | 事項 | 選項 |
|---|---|---|
| 1 | 全頁約 312 字，超過 250 字的目標 | 第 3 段的三則原文就佔 112 字，使用者指定照引。要降到約 250：第 2 段兩則事實改成短表述、事實留給產業頁（約 −30），加上第 5 段拿掉 2008 那則（約 −21）。兩項都會少掉頁面上的證據，所以預設保留 |
| 2 | h1 用「原地接上」 | 備選：「金融與政府的系統不必換／就能接上 API 與 AI」（說得更直白，字寬 11／約 8.9）；或第三輪的「金融與政府的系統／接上 API 與 AI」 |
| 3 | 產品平台段挑的 4 個產品 | 依 h2 的四個領域各挑一個：API（digiRunner）、AI（SysTalk.VIKI）、資安（gadoDIDO）、碳管理（GreenSwift）。AI 也可以換成 SysTalk.Chat AI 智能客服；digiRunner 要保留，它是兩則產業事實講的產品 |
| 4 | 第 5 段要不要加客戶證言或獎項 | brief「待確認」第 1 項，仍未定；本輪為了字數不加 |
| 5 | 「看產品」連頁內 `#products` 還是 `/products` | 本檔用頁內錨點；第 4 段另有「產品總覽」連到 `/products` |
| 6 | 聯絡後多久回覆 | brief「待確認」第 4 項，沒有事實，第 5 段不寫 |
| 7 | 金融與政府的排序 | brief「待確認」第 5 項，目前金融在前 |
| 8 | `argument.md` 與 brief 的同步 | `argument.md` 仍是 8 段的論證，brief 也還是 8 段。方向選定後由主 session 決定同步哪一份 |
| 9 | 開放圖庫圖片的出處 | 第 3 階段才下載 |
