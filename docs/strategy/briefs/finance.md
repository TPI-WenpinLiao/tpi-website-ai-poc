# Content brief：金融產業頁 `/industries/finance`（#165）

- 模板：`hub`（產業 hub，`industry: finance`）；內容檔：`src/content/hub/zh-TW/industry-finance.md`
- 主張 id 指 `docs/strategy/messaging.md`；事實的寫法見 `content-strategy` skill「引用事實的寫法」，只用 `docs/strategy/facts.yaml` 裡 zh-TW、`status: confirmed` 的條目
- 狀態：#165 加上 `strategy-approved`。#186 依 #168 的評審（`docs/strategy/evaluation.md`「新版還不夠好的地方」「交給 #186 的單頁問題」）與 `design-principles.md`「各模板怎麼呈現」改了段落表（加「影像」欄，第 1、2、4、6、7、8 段）、搜尋意圖（`金融業 AI 應用`、`金融科技 解決方案 台灣` 兩列）、CTA、連出、title 與 description 方向、schema 缺口（含 `hasPart`）、取捨第 6 項與第 11–17 項、待確認

## 這頁從哪裡推出來

現站沒有金融產業頁。`docs/ia/nodes.csv` 的 `industry-finance` 寫「承接 /products/open-banking 內容，其餘介紹需人工提供」，所以新站現在的內容只是開放銀行頁換了位置。本 brief 不從開放銀行頁往外擴，改從金融決策者的任務往回推：

1. 決策者的三個任務（了解產品與方案、找成功案例、聯絡業務）在金融業各要回答什麼
2. messaging 指給這頁的主張（`DM-1`、`DM-2`、`DM-5`，次要 `DM-4`、`IT-2`、`IT-4`、`IT-8`）各需要一段
3. 每段從事實庫找已確認的金融事實。事實分散在 digiRunner（開放銀行）、智能理賠、智慧建檔、阻詐平台、InsureBrick、InsureRing、gadoDIDO 等現站頁面

開放銀行從「整頁的主題」降為第 2 段的一部分。「其餘介紹需人工提供」的部分，本 brief 用事實庫既有的金融事實補上，不新增事實；內容負責人另外想放的主題列在「待確認」。

現站 `/products/open-banking` 轉址到本頁（`docs/ia/redirects.csv`）。評審拿現站那一頁和本頁比較時，照本 brief 評：舊網址的訪客會落在本頁，本頁要回答的是這份 brief 的受眾任務，不是開放銀行頁原本的意圖。開放銀行頁的內容只在本 brief 第 2 段用到的範圍內算數（#168 current-finance「評審依據不足」第 1 項，「取捨」第 16 項）。

### 哪些產品能在這頁介紹

`nodes.csv` 裡 `industry-finance` 的子節點只有 `insurebrick`、`insurering`。使用者已確認兩者仍在銷售（#165），`nodes.csv` 的備註已改為「仍在銷售」。模板的子頁卡片只會列這兩個。其他金融相關的產品掛在產品家族下：

| 產品 | 節點的 parent | 在這頁的處理 |
|---|---|---|
| digiRunner | `family-dx` | 第 2、3 段與第 4 段段末介紹並連過去；不是子節點，不會出現在子頁卡片 |
| DigiLism（家族頁） | `products` | 第 3 段的核心系統串接是家族層級的功能，連到家族頁 |
| AI 智能理賠解決方案、AI 智慧建檔解決方案 | `family-ai` | 第 4 段介紹並連過去 |
| gadoDIDO | `family-security` | 第 5 段介紹並連過去 |
| InsureBrick、InsureRing | `industry-finance` | 第 6 段介紹，段末用索引列連到兩個子頁 |

在段落裡介紹不屬於子節點的產品，是內容層的連結，不改 `nodes.csv` 的階層。模板用 `industry` 反查出來的產品（production 的「產品總覽」段）不另成一段，見「取捨」第 12 項。

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
| `金融業 AI 應用` | 資訊型 | 主要。第 4 段用理賠、建檔兩個作業回答「營運自動化」，段末一列用 AI 使用歷程與治理回答共同子題「監管」，也是前幾名都沒有的「AI 使用紀錄留給監管查核」。阻詐平台的原文沒提到 AI，不算這組的答案（取捨第 13 項） | 「金融業 AI 應用」 |
| `金融科技 解決方案 台灣` | 資訊型 | 次要。前幾名是新聞與展會報導，產業頁只在 description 與段落用到「身分驗證」「法遵」等子題；前幾名都沒有的「具名的金融機構導入案例與成果」由第 6 段的保險案例與第 8 段的案例列（含阻詐平台）回答 | 「金融科技 解決方案 台灣」 |
| `金融業 數位轉型` | 資訊型 | 次要。前幾名是 2020–2022 年的媒體評論，產業頁不寫評論 | 「金融業 數位轉型」 |
| `保險科技 AI 理賠` | 資訊型 | 次要；主要是 `/solutions/smartclaim` | 「保險科技 AI 理賠」 |
| `台灣 開放銀行 第三方業者 API 金管會` | 資訊型 | 次要。第 2 段寫「三階段規範」與 TSP 授權不留存帳密，不寫台灣時程 | 「台灣 開放銀行 第三方業者 API 金管會」 |

### 不由這頁承接的查詢

| 查詢 | 交給 | 理由 |
|---|---|---|
| `台灣 開放銀行 第三方業者 API 金管會`（主要） | 之後的 blog 文章（`/blog/{slug}`） | 前幾名是制度說明的新聞，需要寫時程；時程的四筆事實已在 #180 改為 `confirmed`（「待確認」第 2 項）。決定見 `digirunner.md`「取捨」的「三件待決事項」第 1 項 |
| `保險科技 AI 理賠`（主要） | `/solutions/smartclaim` | 解決方案頁寫理賠流程，本頁第 4 段只寫成果並連過去（「取捨」第 4 項） |
| digiRunner 的品牌與功能查詢 | `/products/digirunner` | 本頁不展開功能清單 |

## 這頁要讓讀者相信什麼

金融業的法規要求已經做在昕力的產品裡（`DM-1`），而且 AI 已經用在理賠與建檔，成果寫得出來（`DM-2`）；導入時接得上既有核心系統（`IT-4`），也由同一家公司負責規劃與建置（`DM-4`）。

## 段落結構

「影像」欄照 `docs/strategy/design-principles.md`「各模板怎麼呈現」的「hub：金融產業頁」，版型名稱指同一節的「內頁的版型」。介面片段（`data-ui`、標「示意」）只畫事實寫得出的功能名稱、設定項目與狀態名稱，全頁 4 張（第 4 段 2 張、第 6 段 1 張、第 8 段 1 張）。

| # | 段落 | 目的 | 依據（受眾任務／主張 id） | 搜尋子題 | 事實 | 預估長度 | 影像 |
|---|---|---|---|---|---|---|---|
| 1 | Hero：昕力替金融業處理什麼 | h1 是節點名「金融」，上方不放「產業方案」小標，上層由麵包屑表示（取捨第 6 項）。tagline 一句寫出對象（銀行、保險、證券）與兩件事：規範要求做在產品裡、AI 用在核心作業。說明句寫出昕力提供的產品類別（API 管理平台、AI），讓第一屏讀得出昕力賣什麼。一則證據點：昕力進入金融業的年份。主要動作「聯絡業務」實心按鈕（取捨第 11 項）。取代 #167 之前的「昕力資訊實現三階段開放銀行規範」（那是開放銀行頁的標語） | 決策者任務「確認這頁是為我的產業寫的」；定位句；`DM-1`、`DM-2`、`DM-6`；主要轉換：聯絡業務 | `昕力資訊 金融`：昕力在金融業做什麼；`金融業 數位轉型`、`金融科技 解決方案 台灣` 的類別詞只出現在 title、description，不寫進 tagline（「取捨」第 2 項） | `fact:company-milestone-2008-finance`（證據點）；tagline 與說明句是表述 | tagline 20–35 字；說明 30–50 字；證據點 1 則 | 同一個世界渲染的靜態圖 `src/assets/design/ribbon/page-finance.webp`。HTML 標籤寫金融業的系統類別：核心銀行系統、大型主機（`fact:digilism-protocol-integration` 的用詞）、第三方服務業者（`fact:digirunner-open-banking-no-credentials` 的 TSP）、AI 作業（理賠、建檔）。不載 3D |
| 2 | 法規要求已做在產品裡 | 開放銀行（金管會法規、三階段規範、TSP 授權時不留存帳密）與金融檢查的 API 管理作業，各對應 digiRunner 的哪些功能；傳輸層、資料層、行為層的防護。開頭一句交代開放銀行的起源當背景，再寫台灣金管會 2019 年定案的三階段時程，每階段一項，年份寫在事實原文裡，標題不重複（#183，「待確認」第 2 項）。不寫財金公司 Open API 規範的名稱，也不寫「符合」該規範（取捨第 10 項）。連到 digiRunner 產品頁。拆成兩塊：三階段時程一列一階段（有順序的 `<ol>`），後面接一列一個要求的對應表（開放銀行法規、金融檢查、三層防護），不寫成一欄 9 個條列（new-finance D2、D3）。金融檢查照原文每行一項列出；`fact:digirunner-financial-inspection` 已含「採用 OAuth 2.0」，#165 列的 `fact:digirunner-oauth2` 不再另放 | 決策者任務「了解產品與方案」；`DM-1`、`IT-2` | `API 管理 金融業`：台灣法規（API 盤點、認證與防禦、端對端加密），對應 `fact:digirunner-financial-inspection` 的定期盤點與 OAuth 2.0、`fact:digirunner-open-banking-security` 的傳輸層防護；`開放銀行 API`：定義的起源（PSD2）、客戶授權第三方存取的流程；`台灣 開放銀行 第三方業者 API 金管會`：三階段推動（寫出各階段的年份）、第三方服務業者（TSP）；`銀行 API 平台`：保護、監控 API | 引言 `fact:open-banking-history`、`fact:open-banking-taiwan-2019`；時間列 `fact:open-banking-stage-1`、`fact:open-banking-stage-2`、`fact:open-banking-stage-3`；對應表 `fact:digirunner-open-banking-fsc`、`fact:digirunner-open-banking-3-stages`、`fact:digirunner-open-banking-no-credentials`、`fact:digirunner-financial-inspection`、`fact:digirunner-open-banking-security` | 300–400 字；375 寬不超過 2 個螢幕高 | 時間列接對應表，沒有圖 |
| 3 | 接上核心系統，不必先汰換 | 核心銀行系統與大型主機的資料轉換、通訊機制可以透過微服務與 API 接進來（DigiLism 的功能，連到 DigiLism 家族頁）；API 組合與資料庫配置、金融業常用的高可用架構（digiRunner 的功能，連到 digiRunner 產品頁） | IT 主管任務「確認接得上核心系統」；`IT-4` | `銀行 API 平台`：建立 API，把帳戶、支付等核心系統的資料開放給金融科技業者 | `fact:digilism-protocol-integration`、`fact:digirunner-api-composer`、`fact:digirunner-redis-storage` | 100–160 字 | 接點圖。SVG：核心銀行系統、大型主機在左，DigiLism 的資料轉換與通訊機制、digiRunner 的 API 組合在中，金融科技業者與通路在右（`fact:digilism-protocol-integration`、`fact:digirunner-api-composer`） |
| 4 | AI 用在理賠與建檔 | 引言用「金融業 AI 應用」的說法帶出兩個作業（取捨第 2 項）。兩個作業各一則，照「成果」版型：作業名稱、成果原文（數字加粗）、作業名稱下方一行寫昕力自研的模型、連結。理賠用自研 NLP，連到 AI 智能理賠解決方案頁；金融業的文件建檔用自建的 AI 辨識模型，連到 AI 智慧建檔解決方案頁。兩則的名稱或原文都寫出 AI（`DM-2` 的寫法）。段末一列紀錄寫 AI 接進金融作業時，使用歷程完整記錄、AI 應用有治理機制，供稽核與監管查核（取捨第 7、15 項），連到 digiRunner 產品頁。阻詐平台的原文沒提到 AI，移到第 8 段（取捨第 13 項） | 決策者任務「找成功案例」「了解產品與方案」；`DM-2`、`IT-8`；段末一列依據 `IT-5`、`IT-6` | `金融業 AI 應用`：營運自動化、監管（AI 使用紀錄留給監管查核，`search-intent.md` 記錄前幾名都沒有）；`保險科技 AI 理賠`：理賠文件審閱自動化（次要，主要在 `/solutions/smartclaim`） | 理賠 `fact:smartclaim-title`、`fact:smartclaim-result`、`fact:smartclaim-nlp`；建檔 `fact:smartfilling-case-bank-title`、`fact:smartfilling-case-bank`、`fact:smartfilling-template-free`；段末 `fact:digirunner-ai-usage-log`、`fact:digirunner-ai-governance` | 引言 30–50 字；每則 60–110 字；段末一列 50–70 字 | 成果。每則一張介面片段。片段 1：理賠案件從立案到派件的狀態（`fact:smartclaim-result`）；片段 2：文件辨識後把欄位介接到內部系統（`fact:smartfilling-case-bank`、`fact:smartfilling-template-free`） |
| 5 | 金融通路的身分驗證 | gadoDIDO 給金融集團統一的身分驗證，一次註冊、跨通路使用；列出適用的金融業務（網銀、數位帳戶、證券開戶等）與保險投保流程。這是證券業唯一有具體事實的段落。適用業務的原文是一串名詞，拆成每行一項再排成清單（「schema 缺口」最後一列） | 決策者任務「了解產品與方案」（銀行、證券、保險通路）；`IT-2` | `金融科技 解決方案 台灣`：身分驗證 | `fact:gadodido-finance-group`、`fact:gadodido-finance-uses`、`fact:gadodido-insurance`、`fact:gadodido-fido-certified`、`fact:gadodido-passwordless` | 80–130 字 | 規格表，h2 旁放段落圖 `sec-identity`（#187 使用者決定，`design-principles.md`「內頁共用的規則」段落圖）。適用的金融業務排成兩欄的短詞清單，認證一列 |
| 6 | 保險業務的專用模組 | InsureBrick 依保險業務拆成模組、只買需要的模組；InsureRing 是保險產業的規則引擎，因應商品上下架、核保規則與法令調整。各帶一則具名案例（新光金保代、新光人壽），案例數字照事實原文、加粗。段末用索引列連到兩個子頁（InsureBrick、InsureRing），不另成子頁卡片段 | 決策者任務「了解產品與方案」（保險）、「找成功案例」；`DM-5`、`IT-4` | — | `fact:insurebrick-platform`、`fact:insurebrick-28-modules`、`fact:insurebrick-scenarios`、`fact:insurebrick-buy-modules`、`fact:insurebrick-case-online-insurance`、`fact:insurebrick-case-shin-kong`、`fact:insurering-rule-engine`、`fact:insurering-automated-rules`、`fact:insurering-case-shin-kong-life` | 150–220 字，加 2 列索引 | 介面片段 3：InsureRing 的規則設定，項目是商品上下架、核保規則、法令調整（`fact:insurering-automated-rules`）。兩則具名案例照紀錄格式放在片段旁 |
| 7 | 規劃與導入由同一家負責 | 昕力的顧問協助規劃符合各國開放銀行規範的架構，AI 導入有情境分析、效益評估與模型微調；產品與導入不必分兩家找。AI 導入的原文分「導入前」「導入中」兩組，拆成清單（「schema 缺口」最後一列） | 決策者任務「決定要不要聯絡業務」；`DM-4` | — | `fact:digirunner-open-banking-consulting`、`fact:systalk-ai-onboarding`、`fact:company-offerings` | 60–100 字 | 色帶（淺紫），圖位放段落圖 `sec-planning`（#187 使用者決定） |
| 8 | 金融業成功案例 | 照「案例列」一則一列：客戶名、作業、成果、連結，有成果的排前面（取捨第 14 項）。精選 4 則具名金融案例（`featuredCaseStudies`，使用者確認，#165）：台新銀行現金業務 API 管理平台（`taishin-cash-sales-api-management-platform`，作業與成果照 `fact:digirunner-case-taishin`，Global Finance 獎項放同一列、寫出年份）、安泰銀行 API 管理平台（`entie-bank-api-management-platform`）、國泰世華 AI 智能客服（`cathay-united-bank-ai-intelligent-customer-service-system`）、臺灣銀行 RPA（`bank-of-taiwan-robotic-process-automation-rpa`）。後三則事實庫沒有成果，只放客戶名、案例標題與連結（「待確認」第 8 項）。台新之後接金融聯防阻詐平台一列：作業名稱與成果照原文，沒有客戶名稱與案例頁，這列不加連結（取捨第 13 項，「待確認」第 9 項）。第 6 段的保險案例已在段落文字裡，不重複。列後接新光銀行的證言：原文加說話人，不配人像（`design-principles.md`「待確認」第 3 項交給本 brief 決定，使用者確認保留，#186）。最後一個連結到成功案例列表（錨點「看所有成功案例」），不列出全部 | 決策者任務「找成功案例」；`DM-1`、`IT-4`、`DM-8` | `昕力資訊 金融`：昕力在金融業的實績；`金融科技 解決方案 台灣`：具名的金融機構導入案例與成果（`search-intent.md` 記錄前幾名都沒有） | 台新 `fact:client-taishin-bank`、`fact:digirunner-case-taishin`、`fact:award-global-finance-2020`；阻詐 `fact:fraud-platform-title`、`fact:fraud-platform-result`；`fact:client-entie-bank`、`fact:client-cathay-united-bank`、`fact:client-bank-of-taiwan`；證言 `fact:testimonial-shin-kong-bank`、`fact:testimonial-shin-kong-bank-speaker` | 5 列，每列照事實原文；證言照原文 | 案例列。介面片段 4：第一則台新銀行的現金管理 API 平台示意（文字照 `fact:digirunner-case-taishin`） |
| 9 | 聯絡業務 | 頁尾的主要轉換 | 主要轉換：聯絡業務 | — | 無 | 沿用模板的 `ContactCta` | 色帶（深紫），沒有圖 |

### 與 #167 之前頁面的差異

對照 #167 之前的 `src/content/hub/zh-TW/industry-finance.md`（#168 評審的「試點舊版」，`main` 818988f）。#167 之後的 production 和本 brief 的差異寫在「取捨」第 11–17 項：

| 現有 | 處理 | 理由 |
|---|---|---|
| tagline「昕力資訊實現三階段開放銀行規範」 | 改寫成產業層級的一句；這句改放第 2 段當事實 | 產業頁的 hero 要回答「昕力替金融業做什麼」，開放銀行只是其中一件 |
| description（digiRunner 反應開放銀行法規…） | 交 seo-strategist 依新段落重寫 | 只寫了開放銀行 |
| highlights 第一到第三階段各一段 | 併成第 2 段 | 三段大多在重述 digiRunner 的資安與授權功能，決策者不需要逐階段讀 |
| 第一階段 highlight 的「提升高達 50%」（未確認的成效數字，來自現站的熱部署說法） | 已刪除（#165，zh-TW、en、vi 三語內容檔） | 沒有量測方式或比較基準（messaging「缺少證據的主張」第 7 項）；內容檔沒有 `facts` 欄位，`facts.mjs` 原本擋不到。改寫時補上 `facts` 欄位後就會被檢查 |
| highlights「安全合規的技術架構」 | 移到第 7 段 | 講的是顧問協助規劃，屬於 `DM-4` |
| 子頁卡片只有 InsureBrick、InsureRing，沒有說明 | 改成第 6 段段末的索引列 | 兩者仍在銷售（使用者確認，#165）；第 6 段先說保險業務得到什麼，子頁入口才有上下文。卡片格是 `design-principles.md` 不用的版型 |
| 案例區列出所有 `industry: finance` 的案例（目前 44 則） | 改為精選 | 44 則卡片會蓋過前面的段落；決策者要的是跟自己問題相關的幾則 |
| 現站開放銀行頁的「什麼是開放銀行」、台灣三階段時間軸、傳統銀行與開放銀行比較圖、「如何選擇 API 管理平台」（`unmigrated.md`） | 不放 | 起源只留一句當背景；時間軸的事實是 `to_confirm`；比較圖與選購建議是通用知識，不是昕力的事實，指不到決策者任務 |

## CTA

| CTA | 文案方向 | 位置 | 連到 |
|---|---|---|---|
| 主要：聯絡業務 | 按鈕寫「聯絡業務」（全站同名，`home.md`「取捨」第 10 項）；第 9 段的標題談金融業的需求 | 第 1 段 hero（實心按鈕，取捨第 11 項）、第 9 段（模板的 `ContactCta`） | `/contact-us`（`contact`） |
| 次要：看 digiRunner | 法規對應、API 組合與高可用架構的細節 | 第 2、3 段、第 4 段段末 | `/products/digirunner`（`digirunner`） |
| 次要：看 DigiLism | 核心銀行系統與大型主機的串接 | 第 3 段 | `/products/digilism`（`family-dx`） |
| 次要：看 AI 解決方案 | 理賠、建檔的做法 | 第 4 段 | `/solutions/smartclaim`（`smartclaim`）、`/solutions/smartfilling`（`smartfilling`） |
| 次要：看 gadoDIDO | 身分驗證 | 第 5 段 | `/products/gadodido`（`gadodido`） |
| 次要：看所有成功案例 | 看所有成功案例（列表沒有產業篩選，不寫「金融業案例」；金融案例的入口是第 8 段的精選卡片） | 第 8 段，案例列的最後一個連結 | `/success-story`（`success-stories`） |

## 內部連結

路徑取 `docs/ia/nodes.csv`，只列會產生頁面的節點。父節點 `/industries` 依 #138 不產生頁面，麵包屑在「產業方案」不加連結（`hasPage()`），本頁的連入只能靠導覽、首頁與其他頁的內文。錨點文字寫目的地是什麼，不用「了解更多」。

### 連出

| 段落 | 連到 | 建議錨點文字 | 說明 |
|---|---|---|---|
| 2 | `/products/digirunner` | digiRunner API 管理平台的法規對應功能 | 主要連出，也是 `API 管理 金融業` 次要承接頁。production 的錨點是段落標題「台灣的開放銀行」，沒描述目標頁（new-finance S5），#187 改成左列的錨點，標題本身不當連結 |
| 3 | `/products/digirunner` | digiRunner API 管理平台如何接上核心系統 | 站內連到 digiRunner 的錨點都帶「API 管理平台」（`digirunner.md`「取捨」第 6 項，跟同名遊戲分開） |
| 3 | `/products/digilism` | DigiLism：核心銀行系統與大型主機的串接 | 第 3 段的第一個事實 `fact:digilism-protocol-integration` 寫的是 DigiLism，CTA 表只列 digiRunner，見「取捨」第 8 項 |
| 4 | `/solutions/smartclaim` | AI 智能理賠解決方案 | 用 `nodes.csv` 的節點名稱，一字不改（「智能」，不是作業名稱 `fact:smartclaim-title` 的「智慧」），`保險科技 AI 理賠` 的承接頁。作業名稱照事實原文寫在連結上方，連結文字用節點名，兩者不同是預期的。production 寫「AI 智慧理賠」（new-finance S5），#187 改 |
| 4 | `/solutions/smartfilling` | AI 智慧建檔解決方案 | 節點名稱。production 寫「金融業應用－傳統文件數位化管理第一步」（作業名稱當錨點，new-finance S5），#187 改 |
| 4 | `/products/digirunner` | digiRunner API 管理平台的 AI 使用歷程紀錄與 AI 治理 | 第 4 段段末一列（取捨第 7、15 項） |
| 8 | `/success-story` | 看所有成功案例 | 列表頁沒有產業篩選，錨點不能寫「金融業案例」，見「取捨」第 9 項。第 4 段不再連這裡：阻詐平台移到第 8 段且不加連結（取捨第 13 項），#168 評審指出它連到列表頁不對（new-finance S5） |
| 5 | `/products/gadodido` | gadoDIDO 無密碼身分驗證 | |
| 6 | `/products/insurebrick`、`/solutions/insurering` | 節點名稱 | 第 6 段段末的索引列 |
| 8 | 精選案例內頁（`/success-story/{slug}`） | 客戶名稱加案例標題：`<a>` 的文字是案例檔的 `client.name`、全形冒號、案例檔的 `title`；`title` 已經以客戶名開頭時只用 `title`。4 則是「台新銀行：現金業務API管理平台」「安泰銀行：API 管理平台」「國泰世華銀行：AI智能客服」「臺灣銀行 RPA 流程自動化」。#213 改：客戶名稱與案例標題分兩行放在同一個 h3 與 `<a>`（第一行客戶名稱、第二行案例檔的 `title`），不再用全形冒號接成一行，標題已含客戶名也照放，見 `design-principles.md`「案例列」的「heading 與錨點」；頁面與 `CaseList` 由 #210 改 | `featuredCaseStudies` 照段落結構第 8 段的 4 則。客戶名要在 `<a>` 裡面，不是只排在連結旁邊（new-finance S5）。案例列若每列有 heading，heading 也用同一串文字（new-finance S4：h3「AI智能客服」「API 管理平台」看不出客戶）。案例標題的中英文間空格是案例檔的問題，錨點照檔案組，不另寫一份 |
| 8 | 不加連結 | — | 金融聯防阻詐平台那一列：沒有案例頁也沒有產品頁，這列不加連結，也不連到 `/success-story`（取捨第 13 項）。錨點寫「金融聯防阻詐平台」卻連到列表頁，讀者會以為是平台的頁面（new-finance S5） |
| 1、9 | `/contact-us` | 聯絡業務 | 主要轉換；第 9 段的標題寫談金融業的需求。production 第 9 段的連結寫「聯絡我們」（new-finance S5），按鈕統一成「聯絡業務」（`home.md`「取捨」第 10 項） |

### 連入

| 從 | 建議錨點文字 | 狀態 |
|---|---|---|
| header 與 footer 的「產業方案」 | 節點名「金融」 | 已有 |
| 首頁第 2 段的產業卡片 | 金融（卡片說明寫這個產業得到什麼） | 首頁 brief 已列 |
| `/products/digirunner` 第 6 段 | 金融業的開放銀行與金融檢查要求 | digiRunner brief 已列；`useCases` 帶 `industry: finance` 時模板也會連 |
| 其他 `useCases` 帶 `industry: finance` 的產品頁（gadoDIDO、AI 智慧建檔解決方案、SysTalk.ICR） | 產業名 | 已有（`OfferingTemplate` 依 `industry` 連到產業頁） |
| `/solutions/smartclaim` | 產業名 | 已有：#167 補了帶 `industry: finance` 的 `useCases`（「待確認」第 5 項），模板依 `industry` 連過來，錨點是模板的產業名 |
| `/blog/customer-complaint-ai-tool-selection-guide` | 金融業的 AI 應用 | 可選：文章寫金融客服，見「取捨」第 5 項 |

### 建議新增

| 頁面 | 位置 | 理由 |
|---|---|---|
| 台灣開放銀行制度的 blog 文章 | `/blog/{slug}` | 承接 `台灣 開放銀行 第三方業者 API 金管會`，文末連到本頁。台灣時程的事實已確認（#180），可以另開 issue 寫（`digirunner.md`「取捨」的「三件待決事項」第 1 項） |

## title 與 description 方向

規則照 `seo-checklist`「每頁必備」：zh-TW title 約 20–32 個全形字（含後綴「｜TPIsoftware 昕力資訊」，後綴約佔 11 字），description 約 60–80 個全形字；半形英數約算半個全形字。

### title

- 頁面主題 `title`「金融」加後綴只有約 13 字，低於下限，也沒有任何查詢的用詞，所以用 `seoTitle`（#167 已加，用第一個示例）；h1 沿用「金融」見「取捨」第 6 項。#186 的段落調整不影響 title：「AI 應用」由第 4 段的理賠、建檔與段末的使用歷程回答，不靠阻詐
- 要涵蓋：「金融業」、「開放銀行」或「API 管理」、「AI 應用」
- 傳達的主張：`DM-1`、`DM-2`
- 不放「digiRunner」（產品頁的詞）、「數位轉型」「解決方案」（messaging 限定用法），見「取捨」第 2、5 項
- 示例（含後綴）：
  - `金融業的開放銀行、API 管理與 AI 應用｜TPIsoftware 昕力資訊`
  - `金融業 API 管理與 AI 應用｜TPIsoftware 昕力資訊`

### description

- 要涵蓋：銀行、保險、證券，開放銀行與金融檢查，AI 用在理賠與建檔，身分驗證或導入
- 傳達的主張：`DM-1`、`DM-2`，有餘裕時帶 `IT-4` 或 `DM-4`
- 依據的事實：`fact:digirunner-open-banking-fsc`、`fact:digirunner-financial-inspection`、`fact:smartclaim-result`、`fact:smartfilling-case-bank`、`fact:digirunner-ai-usage-log`、`fact:digilism-protocol-integration`、`fact:gadodido-finance-uses`、`fact:digirunner-open-banking-consulting`。不寫數字、客戶名、「唯一」「100%」
- 不寫「AI 用在阻詐」或把阻詐和理賠、建檔並列在 AI 底下：阻詐平台的原文沒提到 AI（取捨第 13 項，`messaging.md`「缺少證據的主張」第 15 項）。它是第 8 段的一則案例，description 不列案例
- production 的 description（#167 照舊版第一個示例寫）有「以 AI 處理理賠、建檔與阻詐」，#187 改成下面的示例
- 示例：
  - `昕力資訊替銀行、保險與證券業者，把開放銀行與金融檢查的 API 管理要求做進 digiRunner，以 AI 處理理賠與文件建檔，也提供身分驗證與導入規劃。`
  - `金融業的開放銀行與金融檢查要求，昕力資訊已做在 API 管理平台裡；AI 用在理賠與建檔並留下使用紀錄，接得上既有核心系統，規劃與導入由同一家負責。`

## schema 缺口

hub schema（`src/content.config.ts`）現有 `tagline`、`heroImage`、`industry`、`highlights[]{title, body}`、`featuredCaseStudies`、`featuredPosts`。模板（`HubTemplate.astro`）依序輸出 highlights、子頁卡片、白皮書、案例、相關文章、`ContactCta`。

| 段落 | 缺什麼 | 新增的欄位 | 型別 |
|---|---|---|---|
| 2–7 | `highlights` 只有標題與一段文字，放不下「說明 + 清單 + 連到產品頁」 | `sections`，取代這頁的 `highlights` | `{ heading: string; body: string; items?: { title: string; body?: string; node?: string }[]; node?: string }[]`，`node` 取 `nodes.csv` 的節點 id。形狀跟 `page.sections` 一致，多一個 `node` |
| 2–5 | 這頁介紹的產品不是子節點，模板只列子節點 | 不加欄位 | 產品由第 2–5 段的 `sections[].items[].node` 與 `sections[].link` 連到，不靠模板另列。#167 照 `content-model.md`「hub」的規則加了 `industry` 反查的產品列（「產品總覽」段），這頁不輸出那一段（取捨第 12 項）；`content-model.md` 要不要跟著改交主 session |
| 8 | `featuredCaseStudies` 已有，但卡片只有標題與客戶名；台新的作業原文與獎項、阻詐平台（沒有案例頁）放不進反查出來的卡片；證言沒有位置 | `caseNotes`、`testimonial` | `caseNotes` 和 `digirunner.md`「schema 缺口」第 10 段同一個型別：`{ client?: string; work: string; result?: string; caseStudy?: string }[]`，這頁的阻詐平台沒有 `client` 與 `caseStudy`，所以 `client` 要是選填。`testimonial`：`{ quote: string; speaker: string }`，兩個都是事實原文 |
| — | 內容檔沒有 `facts` 欄位，`facts.mjs` 不檢查這頁的數字 | `facts`（共用欄位已有） | #167 已補 `facts: [...]` |
| 1 | hub 的 hero 只有 `tagline`，放不下說明句、證據點與按鈕 | `heroLead`、`heroPoints`、`heroCta` | 和 offering 的 `heroLead`、`heroPoints` 同形；`heroCta` 是 `'contact'`。`casesIntro` 原本放 `fact:company-milestone-2008-finance`，移到 `heroPoints` 後 `casesIntro` 可以不填 |
| 2–8 | 段落的版型與影像要能逐段指定（`design-principles.md`「和新寫法衝突的共用元件」的「段落的版型怎麼選」） | 由 #187 決定 | 段落表的「影像」欄就是這個值 |
| 6（JSON-LD） | `CollectionPage` 的 `hasPart` 是空陣列（new-finance S6）：`HubTemplate` 先用 `sections` 已連到的節點過濾子頁卡片，再拿過濾後的清單產生 `hasPart`。第 6 段的索引列連到 InsureBrick、InsureRing，兩個子節點因此同時從卡片與 `hasPart` 消失 | 不加欄位，改模板 | 照 `content-model.md`「hub」的 JSON-LD 規則：`hasPart` ← 子節點頁面，跟子頁卡片顯不顯示無關。#187 在 `HubTemplate` 把兩份清單分開：`hasPart` 用 `children(self.id, locale)` 裡 `kind === 'page'` 的全部節點（這頁是 InsureBrick、InsureRing），子頁卡片才再排除 `sections` 已連到的節點。改在模板，所以全部 hub 一起適用。`hasPart` 只列子節點：digiRunner、gadoDIDO、AI 智能理賠解決方案等第 2–5 段連到的產品是產品家族的子節點，由家族頁的 `hasPart` 列，這頁不列，否則同一頁會同時是兩個 collection 的一部分，也和 `content-model.md` 的規則不合。兩個子節點在第 6 段的索引列看得到，`hasPart` 和可見內容一致。`content-model.md`「hub」的 `sections` 說明（「段落已連到的子頁不再列在子頁卡片」）可以補一句「`hasPart` 不受影響」，交主 session |
| 5、7 | `fact:gadodido-finance-uses`、`fact:systalk-ai-onboarding` 的原文是一串名詞，接成一行讀不通（new-finance C6） | 不是 schema 缺口 | #186 已照 `.claude/skills/site-research/SKILL.md` 第 2 條改好 `text`：`gadodido-finance-uses` 每行一項；`systalk-ai-onboarding` 分兩層，「導入前（AI 應用規劃與導入）」一行列出 4 個步驟，「導入中」一行。製作階段只需要讓模板把多行的 `text` 排成清單，不要再拆 |

`sections` 與 `items[].node` 若也用在 digiRunner 頁（見 `digirunner.md`「schema 缺口」的替代方案），兩個模板共用同一個型別。

## 取捨

第 1–5 項是 content-strategist 預寫的衝突，第 6–10 項是 seo-strategist 加的。「最後決定」欄由 content-strategist 定案，#165 時全部採納 seo-strategist 的意見，已反映到段落結構（第 2、3、4、8 段）、CTA 與內部連結。第 6 項在 #186 依 `design-principles.md` 改寫。第 11 項起是 #186 依 #168 的評審與 `design-principles.md`「各模板怎麼呈現」補的，seo-strategist 在 #186 補了意見欄，第 11–17 項都同意，最後決定不變。

| # | 可能的衝突 | content-strategist 的立場 | 理由 | seo-strategist 的意見 | 最後決定 |
|---|---|---|---|---|---|
| 1 | 「開放銀行 API」「台灣 開放銀行 第三方業者 API 金管會」是資訊型查詢，SEO 可能要一段開放銀行說明與台灣三階段時程 | 只留一句起源當背景；完整說明交給 blog | 台灣時程的事實當時是 `to_confirm`（#180 改為 `confirmed`）；決策者（銀行 CIO）不需要定義；搜尋結果的繁中來源停在 2019 年前後，舊時程寫進產業頁容易過時 | 同意。起源那一句用 `fact:open-banking-history`（已確認，含 PSD2），剛好涵蓋 `開放銀行 API` 的「定義的起源」子題；TSP 授權不留存帳密（`fact:digirunner-open-banking-no-credentials`）涵蓋「客戶授權第三方存取的流程」。台灣制度的 blog 等時程確認後再寫，決定見 `digirunner.md`「取捨」的「三件待決事項」第 1 項 | 採納。產業頁只寫起源一句與 TSP 授權；台灣制度交給之後的 blog。時程在 #180 確認，第 2 段可以寫出三階段的年份 |
| 2 | 「金融業 數位轉型」「金融科技 解決方案 台灣」「金融業 AI 應用」是類別詞，SEO 可能要放進標題與段落 | 放 title、description 與段落引言；不當段落主張 | messaging：「數位轉型」不當價值主張，「解決方案」只用在正式名稱。第 4 段本身就在回答「金融業 AI 應用」，用具體作業寫，不用類別詞堆疊 | 部分同意。三個詞分開處理：「金融業 AI 應用」放 title 與第 4 段引言，因為第 4 段真的在回答它；「金融業 數位轉型」「金融科技 解決方案 台灣」不放 title，只在 description 或引言自然帶到「金融業」即可。這兩組的前幾名是 2020–2022 年的媒體評論與展會新聞，產業頁的 title 拿去配這兩個詞，會擠掉「開放銀行」「API 管理」這些本頁真的能回答的詞 | 採納。「金融業 AI 應用」進 title 與第 4 段引言（已寫進段落表）；「數位轉型」「解決方案」不進 title |
| 3 | 「API 管理 金融業」「銀行 API 平台」金融頁與 digiRunner 頁都可能承接 | 金融頁承接（產業框架加法規對應），digiRunner 頁第 6 段只寫功能並連過來 | 兩頁不寫同一段；`search-intent.md`「對應到頁面」也主指金融頁 | 同意。title 也分開：本頁不放「digiRunner」，digiRunner 頁不放「金融」 | 採納。本頁主要承接；本頁 title 不放「digiRunner」 |
| 4 | 「保險科技 AI 理賠」主承接頁是 `/solutions/smartclaim`，金融頁第 4 段可能與它搶同一組詞 | 第 4 段只寫成果與連結，不展開理賠流程 | 細節留給解決方案頁，金融頁當入口 | 同意。連到 `/solutions/smartclaim` 的錨點用正式名稱「AI 智能理賠解決方案」，讓連結本身帶到這組查詢的用詞 | 採納。第 4 段只寫成果與連結，錨點用「AI 智能理賠解決方案」 |
| 5 | SEO 可能想用 `featuredPosts` 放金融科技、開放銀行的文章 | 有對應搜尋子題的 2026 年文章才放 | 段落要指到任務或子題；現站舊的開放銀行文章處置是 `drop` | 同意這個條件。現有 2026 年文章裡只有 `/blog/customer-complaint-ai-tool-selection-guide`（金融客服的客訴風險與 AI 語音質檢）沾得上 `金融業 AI 應用`。它介紹的是 SysTalk.Audit，本頁沒有提這個產品，放進來會多一條本頁不說明的產品線。提議先不放，等台灣開放銀行或金融業 AI 的文章寫好再放 | 採納。先不放 `featuredPosts` |
| 6 | h1 是 `title`「金融」，只有兩個字；#165 的意見靠 h1 上方的 eyebrow「產業方案」補語境，`design-principles.md` P1 與「hub：金融產業頁」不用 eyebrow（#168 old-finance「評審依據不足」） | h1 維持「金融」，不加 eyebrow，以設計原則為準 | 跟選單、首頁產業入口的節點名一致；「替銀行、保險、證券做什麼」由第 1 段 tagline 說。eyebrow 是 house rules 與 P1 不用的元素，new-finance D2 也因為它扣分；上層節點由麵包屑表示，讀者一樣看得出這是產業方案底下的一頁 | #165 的意見：`HubTemplate` 的 h1 取 `title`，eyebrow 取父節點名「產業方案」，畫面上是「產業方案／金融」，讀者看得懂；`<title>` 改用 `seoTitle` 補足字數與查詢詞。不建議改 `title`：選單與首頁的產業卡片用節點名「金融」，h1 跟它一致，讀者從選單點進來比較好認。hero tagline 是 h1 下面第一句可讀文字，寫出銀行、保險、證券就補上了「金融業」的語境 | #186 改寫：h1 維持「金融」、加 `seoTitle`（#165 的決定不變）；eyebrow 不用，「產業方案」只出現在麵包屑。h1 下方的 tagline 寫出銀行、保險、證券，承擔原本 eyebrow 補的語境 |
| 7 | 「金融業 AI 應用」的共同子題有監管（AI Act、模型可解釋性），段落表沒有 | 在第 4 段段末加一句，不加段落 | 金融決策者導入 AI 時會問稽核怎麼過；兩筆事實已確認，屬於 `IT-5`、`IT-6`。只寫「使用歷程可記錄、有治理機制」，不寫 AI Act 或模型可解釋性（事實庫沒有） | 不加段落列。事實庫有「完整記錄所有 AI 使用歷程，符合監管要求」（`fact:digirunner-ai-usage-log`）與 AI Governance（`fact:digirunner-ai-governance`），提議 content-strategist 考慮在第 2 或第 4 段加一句，涵蓋「AI 用在金融作業也要能稽核」這個子題；不加也可以 | 加一句：第 4 段段末，用 `fact:digirunner-ai-usage-log`、`fact:digirunner-ai-governance`，連到 digiRunner 產品頁；已寫進段落表、CTA 與內部連結 |
| 8 | 第 3 段的事實 `fact:digilism-protocol-integration` 是 DigiLism 的功能，CTA 表的第 3 段只連 digiRunner | 同意加連 | 事實寫的是 DigiLism，連結要指到出處，否則讀者在 digiRunner 頁找不到這句 | 第 3 段要連到 `/products/digilism`，讀者讀到「核心銀行系統、可代替 ESB」時找得到出處；digiRunner 的連結保留給 API Composer 與資料庫配置那兩句。CTA 表是 content-strategist 的段落，本項只指出，不改 | 採納。第 3 段加連 `/products/digilism`，digiRunner 的連結留給 API 組合與資料庫配置；已改 CTA 表與段落表 |
| 9 | CTA 表「看所有案例」的文案方向寫「依金融篩選的案例」，但 `/success-story` 沒有產業篩選 | 原文寫錯，改 | 列表頁沒有產業篩選，原寫法會讓讀者以為只看到金融案例 | `ListingTemplate` 的產業只是卡片上的標籤，列表頁內篩選還沒做，也沒有產業分類頁的路徑。連結錨點與文案寫「看所有成功案例」，不寫「金融業案例」，否則讀者點進去看到的是全部產業。要做金融案例的入口，第 8 段的精選卡片就是 | 採納。CTA 與錨點寫「看所有成功案例」，金融案例的入口是第 8 段的精選卡片；已改 CTA 表 |
| 10 | 第 2 段可能被寫成「符合財金公司 Open API 規範」 | 同意不寫 | 事實庫沒有這項對應，寫「符合」就是新增事實 | `API 管理 金融業` 的前幾名提到財金公司的 Open API 資安規範，但事實庫沒有 digiRunner 對應這份規範的事實。第 2 段只寫已確認的「金管會法規要求」「金融檢查的 API 管理作業」，搜尋子題欄寫的對應（盤點、認證、傳輸層防護）是功能層面的重疊，文案不能寫成「符合」該規範 | 採納。不寫財金公司規範的名稱，已寫進第 2 段的目的 |
| 11 | hero 要不要放聯絡按鈕（new-finance「評審依據不足」第 3 項；#165 的 CTA 表交給設計概念） | 放，「聯絡業務」實心按鈕，沒有次要動作 | `design-principles.md`「hub：金融產業頁」已決定加：P4 規定聯絡入口放在 hero、header、頁尾；首頁 hero 也有；這頁的主要轉換是聯絡業務 | 同意。對 SEO 沒有衝突：hero 的按鈕寫「聯絡業務」，跟第 9 段與全站的按鈕同名，錨點描述的是下一步。hero 只有一個按鈕，不會讓 h1 下方第一段可讀文字（tagline 與說明句）被動作擠掉 | 放。已寫進第 1 段與 CTA 表 |
| 12 | production 多了一段「產品總覽」（`HubTemplate` 用 `industry` 反查 `offering.useCases[].industry` 列出的產品卡），brief 沒有這段（new-finance C5、「評審依據不足」第 4 項） | 不留。#165 的「schema 缺口」寫的反查只是讓模板找得到產品的資料來源，不是要另成一段 | 反查出的 digiRunner、gadoDIDO、AI 智能理賠、AI 智慧建檔都已在第 2–5 段介紹並連到產品頁，再列一次是重複；剩下的 SysTalk.ICR 這頁沒有介紹，單獨列出會多一條讀者看不懂的產品線（取捨第 5 項同樣的理由）。`design-principles.md` 也不要這段做成一排產品卡 | 同意。反查出的產品卡用產品名當錨點，連到第 2–5 段已經用描述性錨點連過的同一批頁面，多出的是較弱的重複連結；SysTalk.ICR 那張卡會讓這頁多一條沒有段落支撐的連出，跟第 5 項不放 SysTalk.Audit 文章是同一個理由。`hasPart` 不受影響：這些產品不是本頁的子節點，本來就不在 `hasPart`（「schema 缺口」第 6 段 JSON-LD 那一列） | 這頁不輸出「產品總覽」段。#187 讓 `HubTemplate` 照子頁卡片的做法略過段落已連到的產品，略過後只剩這頁沒介紹的產品時整段不輸出 |
| 13 | messaging `DM-2` 在 #186 拿掉 `fact:fraud-platform-result`（原文沒提到 AI），第 4 段的阻詐那則怎麼處理 | 從第 4 段移出，放第 8 段的案例列，排在台新之後 | 第 4 段的標題與引言講 AI，阻詐平台的原文只寫聯防流程與詐騙事件即時共享（new-home C3 的同一個問題）。它仍是金融業有成果的作業，回答決策者「找成功案例」，也是 `金融科技 解決方案 台灣` 前幾名缺的「金融機構導入案例與成果」裡事實庫有的一則（`search-intent.md`）；沒有客戶名稱與案例頁，所以這列不加連結，也不連到成功案例列表（new-finance S5） | 同意。`金融業 AI 應用` 仍由第 4 段主要承接：理賠、建檔回答「營運自動化」，段末的使用歷程與治理回答「監管」與前幾名都沒有的「AI 使用紀錄留給監管查核」，少了阻詐也還在回答這組查詢；共同子題「風險與詐欺」本頁不再用 AI 回答，事實庫沒有原文前不補。SEO 段落一起改：「這頁承接的查詢」的 `金融業 AI 應用` 列與 description 方向不再寫 AI 用在阻詐，阻詐那列改記在 `金融科技 解決方案 台灣`（具名的導入案例與成果）。不加連結也對：沒有目標頁時，連到列表頁的錨點會描述錯目標 | 第 4 段改成理賠與建檔兩則；阻詐平台放第 8 段第二列，沒有連結。缺的客戶名稱、案例頁與 AI 原文列在「待確認」第 9 項 |
| 14 | 案例卡要不要寫成果；4 則精選案例只有台新有作業與成果原文（new-finance「評審依據不足」第 8 項） | 要寫成果（`design-principles.md`「案例列」）。維持使用者選的 4 則，缺成果的 3 則不補，列進「待確認」 | 改選有成果事實的案例行不通：事實庫裡有成果的金融案例只有台新（`fact:digirunner-case-taishin`）、新光金保代與新光人壽（第 6 段已用，沒有案例頁）、`fact:smartfilling-case-bank`（第 4 段已用，沒有客戶名）。安泰、國泰世華、臺灣銀行有案例頁與客戶名稱，換掉它們會讓第 8 段只剩一則具名案例 | 同意。4 則都有客戶名稱與案例頁，`昕力資訊 金融` 要的「昕力在金融業的實績」與 `金融科技 解決方案 台灣` 前幾名缺的具名案例都靠它們；換掉會少連出也少客戶名。沒有成果的 3 則，SEO 上要補的是錨點與 heading 帶客戶名（「內部連結」第 8 段案例內頁那一列），不是補成果 | 4 則照舊，台新排第一，作業、成果與 Global Finance 獎項同一列；其他 3 則只放客戶名、案例標題與連結，成果那一行不放。缺的成果列在「待確認」第 8 項。使用者確認維持這 4 則（#186，2026-11-03） |
| 15 | 第 4 段少了自研 NLP 與辨識模型；「AI 的使用歷程與治理」底下只有使用歷程（new-finance C3、C5） | 補事實，標題不改 | 兩者都有 confirmed 事實：自研 NLP 是 `fact:smartclaim-nlp`，自建的 AI 辨識模型是 `fact:smartfilling-template-free`，治理是 `fact:digirunner-ai-governance`（「AI Governance 確保AI應用合規，強化企業風險控管」） | 同意。治理那一句補上後，`金融業 AI 應用` 的「監管」子題才有內容（new-finance S2 扣分的原因是「治理有標題沒有內容」）。段末一列的連結照「內部連結」第 4 段：錨點「digiRunner API 管理平台的 AI 使用歷程紀錄與 AI 治理」 | 第 4 段兩則各在作業名稱下方加一行自研模型；段末一列放 `fact:digirunner-ai-usage-log` 與 `fact:digirunner-ai-governance`，標題照舊 |
| 16 | 現站 `/products/open-banking` 併入本頁，評審比較時照哪一份 brief（current-finance「評審依據不足」第 1 項） | 照本 brief | 舊網址 301 轉到本頁（`docs/ia/redirects.csv`），訪客落在本頁，本頁要完成的是本 brief 的受眾任務；開放銀行頁的內容只在第 2 段用到的範圍算數 | 同意。301 讓舊網址的搜尋訊號集中到本頁，舊頁原本承接的 `開放銀行 API` 在本頁仍是主要承接，由第 2 段的起源一句、TSP 授權與三階段時程回答；舊頁的定義文、比較圖與選購建議，本頁照取捨第 1 項不寫。評 S1 時照本 brief 的「這頁承接的查詢」（`rubrics/seo.md` 評分提示：brief 決定不承接的查詢不扣分） | 照本 brief 評。已寫進「這頁從哪裡推出來」 |
| 17 | hero 的證據點與案例段引言都想放進入金融業的年份（`fact:company-milestone-2008-finance`） | 放 hero，案例段不再放 | `design-principles.md`「hub：金融產業頁」的證據點舉的就是這則；放在第一屏，決策者一進來就看到昕力在金融業做了多久。同一則事實一頁出現一次 | 同意。這則放在第一屏，`昕力資訊 金融`（查昕力在金融業做什麼）的讀者一進來就讀到年份，比放在第 8 段更早回答這組查詢 | 放 hero 的證據點；第 8 段的引言（`casesIntro`）不放 |

## 待確認

#186 新增的項目。事實庫沒有這些內容，頁面不補、不寫成更強的說法（`design-principles.md`「案例列」）：

| # | 事項 | 卡在哪 | 影響的段落 |
|---|---|---|---|
| 8 | 安泰銀行 API 管理平台、國泰世華 AI 智能客服、臺灣銀行 RPA 三則案例的成果 | 事實庫只有客戶名稱（`fact:client-entie-bank`、`fact:client-cathay-united-bank`、`fact:client-bank-of-taiwan`），沒有這三則案例的作業或成果原文。案例列這三列只放客戶名、案例標題與連結 | 8 |
| 9 | 金融聯防阻詐平台的客戶名稱、案例頁與 AI 的原文 | `fact:fraud-platform-title`、`fact:fraud-platform-result` 只有平台名稱與成果，沒有客戶，現站也沒有案例頁，所以第 8 段這列不加連結。原文沒提到 AI，所以不放第 4 段（`messaging.md`「缺少證據的主張」第 15 項） | 4、8 |

### 已結算（#167、#180）

原本的 7 項在 #167、#180 結算（#180 為使用者決定，2026-11-02），編號保留，本文引用的「待確認第 N 項」對照下表：

| # | 事項 | 結果 |
|---|---|---|
| 1 | 第 8 段的精選案例 | 已決定（#165），照段落結構第 8 段的 4 則 |
| 2 | 台灣開放銀行時程（`fact:open-banking-taiwan-2019`、`fact:open-banking-stage-1`、`fact:open-banking-stage-2`、`fact:open-banking-stage-3`） | 改為 `confirmed`，第 2 段可以寫出三階段的年份（#183 已放） |
| 3 | 「國內唯一符合金管會法令」「100% 符合金融檢查規範」（`fact:digirunner-claim-fsc-only`、`fact:digirunner-finance-compliance-100`） | 不用，維持 `to_confirm` |
| 4 | 內容負責人想另外放的主題（證券業的專屬方案、金融業的客戶數等） | 現站沒有資料，不處理 |
| 5 | 智能理賠的 `useCases` 帶 `industry: finance` | #167 已補（`src/content/offering/zh-TW/smartclaim.md`） |
| 6 | 富邦人壽行動投保的案例（`fact:insurebrick-case-fubon-life`）、InsureRing 的「上架縮短 90%」（`fact:insurering-90-percent`） | 不用，維持 `to_confirm`。第 6 段用已確認的新光金保代、新光人壽案例 |
| 7 | 熱部署專利與「提升高達 50%」 | 已處理（#165）：專利收為 `fact:digirunner-hot-deploy-patent`，「提升高達 50%」不用 |
