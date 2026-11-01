# Content brief：金融產業頁 `/industries/finance`（#165）

- 模板：`hub`（產業 hub，`industry: finance`）；內容檔：`src/content/hub/zh-TW/industry-finance.md`
- 主張 id 指 `docs/strategy/messaging.md`；事實的寫法見 `content-strategy` skill「引用事實的寫法」，只用 `docs/strategy/facts.yaml` 裡 zh-TW、`status: confirmed` 的條目
- 狀態：已確認（#165 加上 `strategy-approved`）

## 這頁從哪裡推出來

現站沒有金融產業頁。`docs/ia/nodes.csv` 的 `industry-finance` 寫「承接 /products/open-banking 內容，其餘介紹需人工提供」，所以新站現在的內容只是開放銀行頁換了位置。本 brief 不從開放銀行頁往外擴，改從金融決策者的任務往回推：

1. 決策者的三個任務（了解產品與方案、找成功案例、聯絡業務）在金融業各要回答什麼
2. messaging 指給這頁的主張（`DM-1`、`DM-2`、`DM-5`，次要 `DM-4`、`IT-2`、`IT-4`、`IT-8`）各需要一段
3. 每段從事實庫找已確認的金融事實。事實分散在 digiRunner（開放銀行）、智能理賠、智慧建檔、阻詐平台、InsureBrick、InsureRing、gadoDIDO 等現站頁面

開放銀行從「整頁的主題」降為第 2 段的一部分。「其餘介紹需人工提供」的部分，本 brief 用事實庫既有的金融事實補上，不新增事實；內容負責人另外想放的主題列在「待確認」。

### 哪些產品能在這頁介紹

`nodes.csv` 裡 `industry-finance` 的子節點只有 `insurebrick`、`insurering`。使用者已確認兩者仍在銷售（#165），`nodes.csv` 的備註已改為「仍在銷售」。模板的子頁卡片只會列這兩個。其他金融相關的產品掛在產品家族下：

| 產品 | 節點的 parent | 在這頁的處理 |
|---|---|---|
| digiRunner | `family-dx` | 第 2、3 段與第 4 段段末介紹並連過去；不是子節點，不會出現在子頁卡片 |
| DigiLism（家族頁） | `products` | 第 3 段的核心系統串接是家族層級的功能，連到家族頁 |
| AI 智能理賠解決方案、AI 智慧建檔解決方案 | `family-ai` | 第 4 段介紹並連過去 |
| gadoDIDO | `family-security` | 第 5 段介紹並連過去 |
| InsureBrick、InsureRing | `industry-finance` | 第 6 段介紹，子頁卡片由模板產生 |

在段落裡介紹不屬於子節點的產品，是內容層的連結，不改 `nodes.csv` 的階層。模板要怎麼列這些產品見「schema 缺口」。

## 受眾與任務

依 `docs/research/audience-and-goals.md`「受眾分群」：

| 受眾 | 來這頁做什麼 | 這頁要讓他做到的事 |
|---|---|---|
| 決策者（銀行、保險、證券的 CIO、CTO、高階主管），主要 | 了解昕力在金融業能處理哪些問題；找金融業的案例；決定要不要聯絡業務 | 依業務問題（法規、既有核心系統、AI 作業、身分驗證、保險商品）各看到一段，每段連到對應的產品頁；看到金融案例；找得到聯絡業務 |
| IT 主管、專案負責人，主要 | 確認產品能接上核心系統、資安與法規要求有對應 | 第 2、3 段寫出機制，細節連到 digiRunner 產品頁 |

主要轉換：聯絡業務。

## 搜尋意圖

依 `docs/strategy/search-intent.md`「金融產業頁 `/industries/finance`」。沒有 Search Console 數據，取捨只依受眾與頁面主題，不依搜尋量。

### 這頁承接的查詢

| 查詢 | 意圖類型 | 承接 | `search-intent.md` 的條目 |
|---|---|---|---|
| `昕力資訊 金融` | 資訊型（查昕力在金融業做什麼） | 主要 | 「昕力資訊 金融」 |
| `API 管理 金融業` | 資訊型為主，帶商業型 | 主要；次要 `/products/digirunner` | 「API 管理 金融業」 |
| `銀行 API 平台` | 資訊型與商業型 | 主要；次要 `/products/digirunner` | 「銀行 API 平台」 |
| `開放銀行 API` | 資訊型 | 主要（`industry-finance` 承接現站 `/products/open-banking`）。本頁不寫定義文，只寫起源一句與 digiRunner 的對應功能 | 「開放銀行 API」 |
| `金融業 AI 應用` | 資訊型 | 主要。第 4 段用理賠、建檔、阻詐三個作業回答 | 「金融業 AI 應用」 |
| `金融科技 解決方案 台灣` | 資訊型 | 次要。前幾名是新聞與展會報導，產業頁只在 description 與段落用到「身分驗證」「法遵」等子題 | 「金融科技 解決方案 台灣」 |
| `金融業 數位轉型` | 資訊型 | 次要。前幾名是 2020–2022 年的媒體評論，產業頁不寫評論 | 「金融業 數位轉型」 |
| `保險科技 AI 理賠` | 資訊型 | 次要；主要是 `/solutions/smartclaim` | 「保險科技 AI 理賠」 |
| `台灣 開放銀行 第三方業者 API 金管會` | 資訊型 | 次要。第 2 段寫「三階段規範」與 TSP 授權不留存帳密，不寫台灣時程 | 「台灣 開放銀行 第三方業者 API 金管會」 |

### 不由這頁承接的查詢

| 查詢 | 交給 | 理由 |
|---|---|---|
| `台灣 開放銀行 第三方業者 API 金管會`（主要） | 之後的 blog 文章（`/blog/{slug}`），台灣時程的事實確認後才寫 | 前幾名是制度說明的新聞，需要寫時程；時程的四筆事實是 `to_confirm`（「待確認」第 2 項）。決定見 `digirunner.md`「取捨」的「三件待決事項」第 1 項 |
| `保險科技 AI 理賠`（主要） | `/solutions/smartclaim` | 解決方案頁寫理賠流程，本頁第 4 段只寫成果並連過去（「取捨」第 4 項） |
| digiRunner 的品牌與功能查詢 | `/products/digirunner` | 本頁不展開功能清單 |

## 這頁要讓讀者相信什麼

金融業的法規要求已經做在昕力的產品裡（`DM-1`），而且 AI 已經用在理賠、建檔與阻詐，成果寫得出來（`DM-2`）；導入時接得上既有核心系統（`IT-4`），也由同一家公司負責規劃與建置（`DM-4`）。

## 段落結構

| # | 段落 | 目的 | 依據（受眾任務／主張 id） | 搜尋子題 | 事實 | 預估長度 |
|---|---|---|---|---|---|---|
| 1 | Hero：昕力替金融業處理什麼 | 一句寫出對象（銀行、保險、證券）與兩件事：規範要求做在產品裡、AI 用在核心作業。取代現行「昕力資訊實現三階段開放銀行規範」（那是開放銀行頁的標語） | 決策者任務「確認這頁是為我的產業寫的」；定位句；`DM-1`、`DM-2` | `昕力資訊 金融`：昕力在金融業做什麼；`金融業 數位轉型`、`金融科技 解決方案 台灣` 的類別詞只出現在 title、description，不寫進 tagline（「取捨」第 2 項） | 無（表述） | tagline 20–35 字 |
| 2 | 法規要求已做在產品裡 | 開放銀行（金管會法規、三階段規範、TSP 授權時不留存帳密）與金融檢查的 API 管理作業，各對應 digiRunner 的哪些功能；傳輸層、資料層、行為層的防護。開頭一句交代開放銀行的起源當背景，不寫台灣時程。不寫財金公司 Open API 規範的名稱，也不寫「符合」該規範（取捨第 10 項）。連到 digiRunner 產品頁 | 決策者任務「了解產品與方案」；`DM-1`、`IT-2` | `API 管理 金融業`：台灣法規（API 盤點、認證與防禦、端對端加密），對應 `fact:digirunner-financial-inspection` 的定期盤點與 OAuth 2.0、`fact:digirunner-open-banking-security` 的傳輸層防護；`開放銀行 API`：定義的起源（PSD2）、客戶授權第三方存取的流程；`台灣 開放銀行 第三方業者 API 金管會`：三階段推動（只寫「三階段規範」）、第三方服務業者（TSP）；`銀行 API 平台`：保護、監控 API | `fact:digirunner-open-banking-fsc`、`fact:digirunner-open-banking-3-stages`、`fact:digirunner-open-banking-no-credentials`、`fact:digirunner-financial-inspection`、`fact:digirunner-open-banking-security`、`fact:digirunner-oauth2`、`fact:open-banking-history` | 200–300 字 |
| 3 | 接上核心系統，不必先汰換 | 核心銀行系統與大型主機的資料轉換、通訊機制可以透過微服務與 API 接進來（DigiLism 的功能，連到 DigiLism 家族頁）；API 組合與資料庫配置、金融業常用的高可用架構（digiRunner 的功能，連到 digiRunner 產品頁） | IT 主管任務「確認接得上核心系統」；`IT-4` | `銀行 API 平台`：建立 API，把帳戶、支付等核心系統的資料開放給金融科技業者 | `fact:digilism-protocol-integration`、`fact:digirunner-api-composer`、`fact:digirunner-redis-storage` | 100–160 字 |
| 4 | AI 用在理賠、建檔與阻詐 | 引言用「金融業 AI 應用」的說法帶出三個作業（取捨第 2 項）。三個作業各一項：做了什麼、成果是什麼、用的是昕力自研的 NLP 或辨識模型。連到智能理賠、智慧建檔解決方案頁；阻詐平台連成功案例列表。段末一句寫 AI 接進金融作業時，使用歷程可完整記錄、AI 應用有治理機制，供稽核與監管查核（取捨第 7 項），連到 digiRunner 產品頁 | 決策者任務「找成功案例」「了解產品與方案」；`DM-2`、`IT-8`；段末一句依據 `IT-5`、`IT-6` | `金融業 AI 應用`：風險與詐欺、營運自動化；`保險科技 AI 理賠`：反詐欺、理賠文件審閱自動化（次要，主要在 `/solutions/smartclaim`） | `fact:smartclaim-result`、`fact:smartclaim-case-medical-documents`、`fact:smartclaim-nlp`、`fact:smartfilling-case-bank-title`、`fact:smartfilling-case-bank`、`fact:smartfilling-template-free`、`fact:fraud-platform-title`、`fact:fraud-platform-result`、`fact:digirunner-ai-usage-log`、`fact:digirunner-ai-governance` | 引言 30–50 字；每項 60–100 字；段末一句 30–50 字 |
| 5 | 金融通路的身分驗證 | gadoDIDO 給金融集團統一的身分驗證，一次註冊、跨通路使用；列出適用的金融業務（網銀、數位帳戶、證券開戶等）與保險投保流程。這是證券業唯一有具體事實的段落 | 決策者任務「了解產品與方案」（銀行、證券、保險通路）；`IT-2` | `金融科技 解決方案 台灣`：身分驗證 | `fact:gadodido-finance-group`、`fact:gadodido-finance-uses`、`fact:gadodido-insurance`、`fact:gadodido-fido-certified`、`fact:gadodido-passwordless` | 80–130 字 |
| 6 | 保險業務的專用模組 | InsureBrick 依保險業務拆成模組、只買需要的模組；InsureRing 是保險產業的規則引擎，因應商品上下架、核保規則與法令調整。各帶一則具名案例（新光金保代、新光人壽），案例數字照事實原文。這段與子頁卡片合併 | 決策者任務「了解產品與方案」（保險）、「找成功案例」；`DM-5`、`IT-4` | — | `fact:insurebrick-platform`、`fact:insurebrick-28-modules`、`fact:insurebrick-scenarios`、`fact:insurebrick-buy-modules`、`fact:insurebrick-case-online-insurance`、`fact:insurebrick-case-shin-kong`、`fact:insurering-rule-engine`、`fact:insurering-automated-rules`、`fact:insurering-case-shin-kong-life` | 150–220 字，加子頁卡片 |
| 7 | 規劃與導入由同一家負責 | 昕力的顧問協助規劃符合各國開放銀行規範的架構，AI 導入有情境分析、效益評估與模型微調；產品與導入不必分兩家找。作為聯絡前的最後一段 | 決策者任務「決定要不要聯絡業務」；`DM-4` | — | `fact:digirunner-open-banking-consulting`、`fact:systalk-ai-onboarding`、`fact:company-offerings` | 60–100 字 |
| 8 | 金融業成功案例 | 精選 4 則具名金融案例（`featuredCaseStudies`，使用者確認，#165），依段落對應：第 2、3 段對應台新銀行現金業務 API 管理平台（`taishin-cash-sales-api-management-platform`）、安泰銀行 API 管理平台（`entie-bank-api-management-platform`）；第 4 段對應國泰世華 AI 智能客服（`cathay-united-bank-ai-intelligent-customer-service-system`）、臺灣銀行 RPA（`bank-of-taiwan-robotic-process-automation-rpa`）。第 6 段的保險案例已在段落文字裡，卡片不重複。連到成功案例列表（錨點「看所有成功案例」），不列出全部；引言可帶昕力進入金融業的年份 | 決策者任務「找成功案例」；`DM-1`、`IT-4`、`DM-6` | `昕力資訊 金融`：昕力在金融業的實績 | `fact:digirunner-case-taishin`、`fact:client-taishin-bank`、`fact:client-entie-bank`、`fact:client-cathay-united-bank`、`fact:client-bank-of-taiwan`、`fact:company-milestone-2008-finance` | 引言 20–40 字；卡片 3–6 則 |
| 9 | 聯絡業務 | 頁尾的主要轉換 | 主要轉換：聯絡業務 | — | 無 | 沿用模板的 `ContactCta` |

### 與現有頁面的差異

對照 `src/content/hub/zh-TW/industry-finance.md`：

| 現有 | 處理 | 理由 |
|---|---|---|
| tagline「昕力資訊實現三階段開放銀行規範」 | 改寫成產業層級的一句；這句改放第 2 段當事實 | 產業頁的 hero 要回答「昕力替金融業做什麼」，開放銀行只是其中一件 |
| description（digiRunner 反應開放銀行法規…） | 交 seo-strategist 依新段落重寫 | 只寫了開放銀行 |
| highlights 第一到第三階段各一段 | 併成第 2 段 | 三段大多在重述 digiRunner 的資安與授權功能，決策者不需要逐階段讀 |
| 第一階段 highlight 的「提升高達 50%」（未確認的成效數字，來自現站的熱部署說法） | 已刪除（#165，zh-TW、en、vi 三語內容檔） | 沒有量測方式或比較基準（messaging「缺少證據的主張」第 7 項）；內容檔沒有 `facts` 欄位，`facts.mjs` 原本擋不到。改寫時補上 `facts` 欄位後就會被檢查 |
| highlights「安全合規的技術架構」 | 移到第 7 段 | 講的是顧問協助規劃，屬於 `DM-4` |
| 子頁卡片只有 InsureBrick、InsureRing，沒有說明 | 保留，接在第 6 段後面 | 兩者仍在銷售（使用者確認，#165）；第 6 段先說保險業務得到什麼，卡片才有上下文 |
| 案例區列出所有 `industry: finance` 的案例（目前 44 則） | 改為精選 | 44 則卡片會蓋過前面的段落；決策者要的是跟自己問題相關的幾則 |
| 現站開放銀行頁的「什麼是開放銀行」、台灣三階段時間軸、傳統銀行與開放銀行比較圖、「如何選擇 API 管理平台」（`unmigrated.md`） | 不放 | 起源只留一句當背景；時間軸的事實是 `to_confirm`；比較圖與選購建議是通用知識，不是昕力的事實，指不到決策者任務 |

## CTA

| CTA | 文案方向 | 位置 | 連到 |
|---|---|---|---|
| 主要：聯絡業務 | 談金融業的需求 | 第 9 段（模板的 `ContactCta`）；hero 是否加按鈕交設計概念 | `/contact-us`（`contact`） |
| 次要：看 digiRunner | 法規對應、API 組合與高可用架構的細節 | 第 2、3 段、第 4 段段末 | `/products/digirunner`（`digirunner`） |
| 次要：看 DigiLism | 核心銀行系統與大型主機的串接 | 第 3 段 | `/products/digilism`（`family-dx`） |
| 次要：看 AI 解決方案 | 理賠、建檔的做法 | 第 4 段 | `/solutions/smartclaim`（`smartclaim`）、`/solutions/smartfilling`（`smartfilling`） |
| 次要：看 gadoDIDO | 身分驗證 | 第 5 段 | `/products/gadodido`（`gadodido`） |
| 次要：看所有成功案例 | 看所有成功案例（列表沒有產業篩選，不寫「金融業案例」；金融案例的入口是第 8 段的精選卡片） | 第 4 段（阻詐平台）、第 8 段 | `/success-story`（`success-stories`） |

## 內部連結

路徑取 `docs/ia/nodes.csv`，只列會產生頁面的節點。父節點 `/industries` 依 #138 不產生頁面，麵包屑在「產業方案」不加連結（`hasPage()`），本頁的連入只能靠導覽、首頁與其他頁的內文。錨點文字寫目的地是什麼，不用「了解更多」。

### 連出

| 段落 | 連到 | 建議錨點文字 | 說明 |
|---|---|---|---|
| 2 | `/products/digirunner` | digiRunner API 管理平台的法規對應功能 | 主要連出，也是 `API 管理 金融業` 次要承接頁 |
| 3 | `/products/digirunner` | digiRunner 如何接上核心系統 | |
| 3 | `/products/digilism` | DigiLism：核心銀行系統與大型主機的串接 | 第 3 段的第一個事實 `fact:digilism-protocol-integration` 寫的是 DigiLism，CTA 表只列 digiRunner，見「取捨」第 8 項 |
| 4 | `/solutions/smartclaim` | AI 智能理賠解決方案 | 用節點正式名稱，`保險科技 AI 理賠` 的承接頁 |
| 4 | `/solutions/smartfilling` | AI 智慧建檔解決方案 | |
| 4 | `/products/digirunner` | digiRunner 的 AI 使用歷程紀錄與 AI 治理 | 第 4 段段末一句（取捨第 7 項） |
| 4、8 | `/success-story` | 看所有成功案例 | 列表頁沒有產業篩選，錨點不能寫「金融業案例」，見「取捨」第 9 項 |
| 5 | `/products/gadodido` | gadoDIDO 無密碼身分驗證 | |
| 6 | `/products/insurebrick`、`/solutions/insurering` | 節點名稱 | 子頁卡片由模板產生 |
| 8 | 精選案例內頁（`/success-story/{slug}`） | 案例標題（含客戶名稱） | `featuredCaseStudies` 照段落結構第 8 段的 4 則 |
| 9 | `/contact-us` | 聯絡業務，談金融業的需求 | 主要轉換 |

### 連入

| 從 | 建議錨點文字 | 狀態 |
|---|---|---|
| header 與 footer 的「產業方案」 | 節點名「金融」 | 已有 |
| 首頁第 2 段的產業卡片 | 金融（卡片說明寫這個產業得到什麼） | 首頁 brief 已列 |
| `/products/digirunner` 第 6 段 | 金融業的開放銀行與金融檢查要求 | digiRunner brief 已列；`useCases` 帶 `industry: finance` 時模板也會連 |
| 其他 `useCases` 帶 `industry: finance` 的產品頁（gadoDIDO、AI 智慧建檔解決方案、SysTalk.ICR） | 產業名 | 已有（`OfferingTemplate` 依 `industry` 連到產業頁） |
| `/solutions/smartclaim` | 金融業的 AI 應用 | 建議補：內容檔沒有帶 `industry: finance` 的 `useCases`，補上後模板會連（「待確認」第 5 項） |
| `/blog/customer-complaint-ai-tool-selection-guide` | 金融業的 AI 應用 | 可選：文章寫金融客服，見「取捨」第 5 項 |

### 建議新增

| 頁面 | 位置 | 理由 |
|---|---|---|
| 台灣開放銀行制度的 blog 文章 | `/blog/{slug}` | 承接 `台灣 開放銀行 第三方業者 API 金管會`，文末連到本頁。台灣時程的事實確認後才寫（`digirunner.md`「取捨」的「三件待決事項」第 1 項） |

## title 與 description 方向

規則照 `seo-checklist`「每頁必備」：zh-TW title 約 20–32 個全形字（含後綴「｜TPIsoftware 昕力資訊」，後綴約佔 11 字），description 約 60–80 個全形字；半形英數約算半個全形字。

### title

- 現行的頁面主題是 `title`「金融」，加後綴只有約 13 字，低於下限，也沒有任何查詢的用詞。要加 `seoTitle`；h1 是否沿用「金融」見「取捨」第 6 項
- 要涵蓋：「金融業」、「開放銀行」或「API 管理」、「AI 應用」
- 傳達的主張：`DM-1`、`DM-2`
- 不放「digiRunner」（產品頁的詞）、「數位轉型」「解決方案」（messaging 限定用法），見「取捨」第 2、5 項
- 示例（含後綴）：
  - `金融業的開放銀行、API 管理與 AI 應用｜TPIsoftware 昕力資訊`
  - `金融業 API 管理與 AI 應用｜TPIsoftware 昕力資訊`

### description

- 要涵蓋：銀行、保險、證券，開放銀行與金融檢查，AI 用在理賠、建檔、阻詐，身分驗證或導入
- 傳達的主張：`DM-1`、`DM-2`，有餘裕時帶 `IT-4` 或 `DM-4`
- 依據的事實：`fact:digirunner-open-banking-fsc`、`fact:digirunner-financial-inspection`、`fact:smartclaim-result`、`fact:smartfilling-case-bank`、`fact:fraud-platform-title`、`fact:gadodido-finance-uses`、`fact:digirunner-open-banking-consulting`。不寫數字、客戶名、「唯一」「100%」
- 現行 description 只寫開放銀行，要依新段落重寫
- 示例：
  - `昕力資訊替銀行、保險與證券業者，把開放銀行與金融檢查的 API 管理要求做進 digiRunner，並以 AI 處理理賠、建檔與阻詐，也提供身分驗證與導入規劃。`
  - `金融業的開放銀行與金融檢查要求，昕力資訊已做在 API 管理平台裡；AI 用在理賠、建檔與阻詐，接得上既有核心系統，規劃與導入由同一家負責。`

## schema 缺口

hub schema（`src/content.config.ts`）現有 `tagline`、`heroImage`、`industry`、`highlights[]{title, body}`、`featuredCaseStudies`、`featuredPosts`。模板（`HubTemplate.astro`）依序輸出 highlights、子頁卡片、白皮書、案例、相關文章、`ContactCta`。

| 段落 | 缺什麼 | 新增的欄位 | 型別 |
|---|---|---|---|
| 2–7 | `highlights` 只有標題與一段文字，放不下「說明 + 清單 + 連到產品頁」 | `sections`，取代這頁的 `highlights` | `{ heading: string; body: string; items?: { title: string; body?: string; node?: string }[]; node?: string }[]`，`node` 取 `nodes.csv` 的節點 id。形狀跟 `page.sections` 一致，多一個 `node` |
| 2–5 | 這頁介紹的產品不是子節點，模板只列子節點 | 不加欄位，改模板（建議）；或加 `featuredOfferings` | 建議：`HubTemplate` 照 `content-model.md`「hub」已寫的規則，用 `industry` 反查 `offering.useCases[].industry` 列出相關產品（目前沒實作）。現有 `useCases` 帶 `industry: finance` 的是 digiRunner、gadoDIDO、智慧建檔、SysTalk.ICR，智能理賠要補一項 `useCases`。替代方案：`featuredOfferings: string[]`（offering 節點 id） |
| 8 | `featuredCaseStudies` 已有 | 無 | 沿用，挑選見「待確認」第 1 項 |
| — | 內容檔沒有 `facts` 欄位，`facts.mjs` 不檢查這頁的數字 | `facts`（共用欄位已有） | 製作階段改寫時補上 `facts: [...]`，不是 schema 缺口，是內容檔要加 |

`sections` 與 `items[].node` 若也用在 digiRunner 頁（見 `digirunner.md`「schema 缺口」的替代方案），兩個模板共用同一個型別。

## 取捨

第 1–5 項是 content-strategist 預寫的衝突，第 6 項起是 seo-strategist 加的。「最後決定」欄由 content-strategist 定案，本頁全部採納 seo-strategist 的意見，已反映到段落結構（第 2、3、4、8 段）、CTA 與內部連結。

| # | 可能的衝突 | content-strategist 的立場 | 理由 | seo-strategist 的意見 | 最後決定 |
|---|---|---|---|---|---|
| 1 | 「開放銀行 API」「台灣 開放銀行 第三方業者 API 金管會」是資訊型查詢，SEO 可能要一段開放銀行說明與台灣三階段時程 | 只留一句起源當背景；完整說明交給 blog | 台灣時程的事實是 `to_confirm`；決策者（銀行 CIO）不需要定義；搜尋結果的繁中來源停在 2019 年前後，舊時程寫進產業頁容易過時 | 同意。起源那一句用 `fact:open-banking-history`（已確認，含 PSD2），剛好涵蓋 `開放銀行 API` 的「定義的起源」子題；TSP 授權不留存帳密（`fact:digirunner-open-banking-no-credentials`）涵蓋「客戶授權第三方存取的流程」。台灣制度的 blog 等時程確認後再寫，決定見 `digirunner.md`「取捨」的「三件待決事項」第 1 項 | 採納。產業頁只寫起源一句與 TSP 授權；台灣制度交給之後的 blog，時程確認後才寫 |
| 2 | 「金融業 數位轉型」「金融科技 解決方案 台灣」「金融業 AI 應用」是類別詞，SEO 可能要放進標題與段落 | 放 title、description 與段落引言；不當段落主張 | messaging：「數位轉型」不當價值主張，「解決方案」只用在正式名稱。第 4 段本身就在回答「金融業 AI 應用」，用具體作業寫，不用類別詞堆疊 | 部分同意。三個詞分開處理：「金融業 AI 應用」放 title 與第 4 段引言，因為第 4 段真的在回答它；「金融業 數位轉型」「金融科技 解決方案 台灣」不放 title，只在 description 或引言自然帶到「金融業」即可。這兩組的前幾名是 2020–2022 年的媒體評論與展會新聞，產業頁的 title 拿去配這兩個詞，會擠掉「開放銀行」「API 管理」這些本頁真的能回答的詞 | 採納。「金融業 AI 應用」進 title 與第 4 段引言（已寫進段落表）；「數位轉型」「解決方案」不進 title |
| 3 | 「API 管理 金融業」「銀行 API 平台」金融頁與 digiRunner 頁都可能承接 | 金融頁承接（產業框架加法規對應），digiRunner 頁第 6 段只寫功能並連過來 | 兩頁不寫同一段；`search-intent.md`「對應到頁面」也主指金融頁 | 同意。title 也分開：本頁不放「digiRunner」，digiRunner 頁不放「金融」 | 採納。本頁主要承接；本頁 title 不放「digiRunner」 |
| 4 | 「保險科技 AI 理賠」主承接頁是 `/solutions/smartclaim`，金融頁第 4 段可能與它搶同一組詞 | 第 4 段只寫成果與連結，不展開理賠流程 | 細節留給解決方案頁，金融頁當入口 | 同意。連到 `/solutions/smartclaim` 的錨點用正式名稱「AI 智能理賠解決方案」，讓連結本身帶到這組查詢的用詞 | 採納。第 4 段只寫成果與連結，錨點用「AI 智能理賠解決方案」 |
| 5 | SEO 可能想用 `featuredPosts` 放金融科技、開放銀行的文章 | 有對應搜尋子題的 2026 年文章才放 | 段落要指到任務或子題；現站舊的開放銀行文章處置是 `drop` | 同意這個條件。現有 2026 年文章裡只有 `/blog/customer-complaint-ai-tool-selection-guide`（金融客服的客訴風險與 AI 語音質檢）沾得上 `金融業 AI 應用`。它介紹的是 SysTalk.Audit，本頁沒有提這個產品，放進來會多一條本頁不說明的產品線。提議先不放，等台灣開放銀行或金融業 AI 的文章寫好再放 | 採納。先不放 `featuredPosts` |
| 6 | h1 是 `title`「金融」，只有兩個字 | h1 維持「金融」 | 跟選單、首頁卡片的節點名一致；「替銀行、保險、證券做什麼」由第 1 段 tagline 說 | `HubTemplate` 的 h1 取 `title`，eyebrow 取父節點名「產業方案」，所以畫面上是「產業方案／金融」，讀者看得懂；`<title>` 改用 `seoTitle` 補足字數與查詢詞。不建議改 `title`：選單與首頁的產業卡片用節點名「金融」，h1 跟它一致，讀者從選單點進來比較好認。hero tagline（第 1 段）是 h1 下面第一句可讀文字，寫出銀行、保險、證券就補上了「金融業」的語境 | 採納。h1 維持「金融」；加 `seoTitle` |
| 7 | 「金融業 AI 應用」的共同子題有監管（AI Act、模型可解釋性），段落表沒有 | 在第 4 段段末加一句，不加段落 | 金融決策者導入 AI 時會問稽核怎麼過；兩筆事實已確認，屬於 `IT-5`、`IT-6`。只寫「使用歷程可記錄、有治理機制」，不寫 AI Act 或模型可解釋性（事實庫沒有） | 不加段落列。事實庫有「完整記錄所有 AI 使用歷程，符合監管要求」（`fact:digirunner-ai-usage-log`）與 AI Governance（`fact:digirunner-ai-governance`），提議 content-strategist 考慮在第 2 或第 4 段加一句，涵蓋「AI 用在金融作業也要能稽核」這個子題；不加也可以 | 加一句：第 4 段段末，用 `fact:digirunner-ai-usage-log`、`fact:digirunner-ai-governance`，連到 digiRunner 產品頁；已寫進段落表、CTA 與內部連結 |
| 8 | 第 3 段的事實 `fact:digilism-protocol-integration` 是 DigiLism 的功能，CTA 表的第 3 段只連 digiRunner | 同意加連 | 事實寫的是 DigiLism，連結要指到出處，否則讀者在 digiRunner 頁找不到這句 | 第 3 段要連到 `/products/digilism`，讀者讀到「核心銀行系統、可代替 ESB」時找得到出處；digiRunner 的連結保留給 API Composer 與資料庫配置那兩句。CTA 表是 content-strategist 的段落，本項只指出，不改 | 採納。第 3 段加連 `/products/digilism`，digiRunner 的連結留給 API 組合與資料庫配置；已改 CTA 表與段落表 |
| 9 | CTA 表「看所有案例」的文案方向寫「依金融篩選的案例」，但 `/success-story` 沒有產業篩選 | 原文寫錯，改 | 列表頁沒有產業篩選，原寫法會讓讀者以為只看到金融案例 | `ListingTemplate` 的產業只是卡片上的標籤，列表頁內篩選還沒做，也沒有產業分類頁的路徑。連結錨點與文案寫「看所有成功案例」，不寫「金融業案例」，否則讀者點進去看到的是全部產業。要做金融案例的入口，第 8 段的精選卡片就是 | 採納。CTA 與錨點寫「看所有成功案例」，金融案例的入口是第 8 段的精選卡片；已改 CTA 表 |
| 10 | 第 2 段可能被寫成「符合財金公司 Open API 規範」 | 同意不寫 | 事實庫沒有這項對應，寫「符合」就是新增事實 | `API 管理 金融業` 的前幾名提到財金公司的 Open API 資安規範，但事實庫沒有 digiRunner 對應這份規範的事實。第 2 段只寫已確認的「金管會法規要求」「金融檢查的 API 管理作業」，搜尋子題欄寫的對應（盤點、認證、傳輸層防護）是功能層面的重疊，文案不能寫成「符合」該規範 | 採納。不寫財金公司規範的名稱，已寫進第 2 段的目的 |

## 待確認

| # | 事項 | 卡在哪 | 影響的段落 |
|---|---|---|---|
| 1 | 第 8 段的精選案例：已決定（使用者確認，#165），照建議的 4 則，見段落結構第 8 段。排序與卡片文字在製作階段定 | 無 | 8 |
| 2 | 台灣開放銀行時程：`fact:open-banking-taiwan-2019`、`fact:open-banking-stage-1`、`fact:open-banking-stage-2`、`fact:open-banking-stage-3` | 要對照主管機關公告 | 2（目前只用「三階段規範」） |
| 3 | 「國內唯一符合金管會法令」「100% 符合金融檢查規範」：`fact:digirunner-claim-fsc-only`、`fact:digirunner-finance-compliance-100` | 最高級與 100% 沒有依據 | 2 |
| 4 | `nodes.csv` 寫「其餘介紹需人工提供」。本 brief 用事實庫既有的事實補了第 3–8 段；內容負責人若有其他想放的主題（例如證券業的專屬方案、金融業的客戶數），要先收進事實庫 | 事實庫沒有 | 新段落 |
| 5 | 智能理賠（`smartclaim`）的內容檔沒有 `useCases` 帶 `industry: finance`；若採用模板反查（「schema 缺口」建議），要補一項 | 內容檔變更，製作階段處理 | 4 |
| 6 | 保險產品其他未確認的說法：富邦人壽行動投保的案例（`fact:insurebrick-case-fubon-life`，含「3 分鐘成案」「最速、最佳」）、InsureRing 的「上架縮短 90%」（`fact:insurering-90-percent`） | 數字與最高級說法沒有量測依據；第 6 段改用已確認的新光金保代、新光人壽案例 | 6 |
| 7 | 現有頁面第一階段 highlight 還留著「專利的服務不中斷熱部署」。事實庫沒有單獨的熱部署專利條目，只出現在 `fact:digirunner-hot-deploy-50`（`to_confirm`，note 寫成效數字與「專利」都沒有依據）；但 `fact:digirunner-smart-caching-patent` 這類功能層級的專利說法是 `confirmed`（#164），兩者的判斷要由人工統一 | 熱部署的專利沒有可引用的 confirmed 事實 | 2（改寫時不寫熱部署專利，除非補進事實庫） |
