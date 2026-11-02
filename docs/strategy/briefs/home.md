# Content brief：首頁 `/`（#165）

- 模板：`home`；文案位置：`src/data/home/zh-TW.ts`（型別 `Home`，en、vi 檔要滿足同一型別）
- 主張 id 指 `docs/strategy/messaging.md`；事實的寫法見 `content-strategy` skill「引用事實的寫法」，只用 `docs/strategy/facts.yaml` 裡 zh-TW、`status: confirmed` 的條目
- 狀態：已確認（#165 加上 `strategy-approved`）

## 製作階段的版本（#167）

#166 使用者決定首頁精簡成 5 段（`docs/strategy/concepts/copy-deck.md`「第四輪：偏離 brief 的地方」），#167 照選定的 `ribbon-route` 原型做進 production（`src/layouts/templates/HomeTemplate.astro`、`src/data/home/zh-TW.ts`）。下面的段落結構保留 #165 的版本，當作 5 段的依據；兩者的對照：

| 首頁的段 | 對應 brief 的段 | 差異 |
|---|---|---|
| 1 Hero | 1 | h1「金融與政府的既有系統／原地接上 API 與 AI」，說明句帶到 `DM-4`（自行研發、也負責導入）；次要動作「依產業看方案」 |
| 2 產業入口 | 2 | 金融、政府與公部門各一則事實原文；沒有段落引言，h2 直接說結論 |
| 3 AI 成果 | 3 | 三則成果原文，每則一個連結（理賠、建檔各連解決方案頁，阻詐連成功案例） |
| 4 產品與 OrientAI | 4、5 | 4 個產品名稱（帶類別詞）＋縮圖，不放家族說明；OrientAI 一句主張加 `fact:orientai-on-prem-data` 原文，前面加一句問句承接原文的「不會。」 |
| 5 紀錄與聯絡 | 7、8 | 6 則紀錄，依年份排、認證放最後：成立年份、跨足金融、2020 年員工數、FT 2022（`DM-6`）、台灣精品獎 2024（`DM-8`）、ISO27001（#183 從 3 則加到 6 則）；一個動作「聯絡業務」 |

移出首頁的內容不新增頁面，由已有的頁面承接：

| 移出的內容 | 承接的頁面 |
|---|---|
| 第 4 段四個家族各一句說明與事實 | `/products` 與各家族頁 |
| 第 5 段 OrientAI 的權限、Token、離線等特色 | `/orient-ai` |
| 第 6 段產品與導入、服務卡片 | 說明句的「也負責導入規劃與建置」；服務在 header 的「服務」選單 |
| 第 7 段子公司、國際品牌、Google Cloud 合作夥伴 | `/about-us` |

en、vi 首頁還是 #167 之前的文案，新版面沒有對應文字的段落不輸出（`src/data/home/types.ts`），列為 #167 的後續事項。

## 受眾與任務

依 `docs/research/audience-and-goals.md`「受眾分群」：

| 受眾 | 來首頁做什麼 | 首頁要讓他做到的事 |
|---|---|---|
| 決策者（金融、政府與公部門、製造業的 CIO、CTO、高階主管），主要 | 判斷昕力做什麼、是不是為他的產業做；找成功案例；決定要不要聯絡業務 | 第一屏看懂昕力替誰做什麼；兩次捲動內找到自己的產業入口與一則有成果的案例；隨時找得到聯絡業務 |
| IT 主管、專案負責人，主要 | 找到對應的產品，確認裝得進現有環境 | 依問題（API、AI、碳管理、資安）找到產品家族與產品頁 |
| 既有客戶、媒體與投資人，次要 | 未定（`audience-and-goals.md` 問題 1） | 本頁不為他們設段落，靠 header 與 footer 的導覽 |

主要轉換：聯絡業務。次要：預約 demo、試用（在產品頁發生，首頁只負責把人送過去）。

## 搜尋意圖

依 `docs/strategy/search-intent.md`「首頁 `/`」。沒有 Search Console 數據，取捨只依受眾與頁面主題，不依搜尋量（`search-intent.md`「限制」）。

### 這頁承接的查詢

| 查詢 | 意圖類型 | 承接 | `search-intent.md` 的條目 |
|---|---|---|---|
| `昕力資訊` | 導航型（前幾名實際是公司近況的新聞） | 主要 | 「昕力資訊」 |
| `TPIsoftware` | 導航型 | 主要（en 版 `/en`） | 「TPIsoftware」 |
| `昕力資訊 官網` | 導航型 | 主要 | 「昕力資訊 官網」 |
| `台灣 AI 解決方案 公司` | 商業型 | 主要；次要 `/products/systalk-ai`、`/orient-ai` | 「台灣 AI 解決方案 公司」 |
| `企業數位轉型 軟體公司` | 資訊型為主，帶商業型 | 主要（查的是「哪家公司」，只有首頁回答）；次要 `/products/digilism` | 「企業數位轉型 軟體公司」 |
| `企業主權 AI 地端部署 方案` | 資訊型與商業型 | 次要；主要是 `/aiso` | 「企業主權 AI 地端部署 方案」 |

品牌詞的前幾名是新聞與評論平台，官網一筆都沒出現（`search-intent.md`「跨頁的觀察」）。首頁能做的是讓 title、h1 附近的文字與 description 清楚寫出公司名、服務對象與做的事；「公司近況」這類新聞需求由 `/media-center` 承接，首頁不設段落。

兩組類別詞的前幾名是定義文與國際廠商頁，首頁不寫定義去搶，只靠 title、description 與段落文字回答「這家公司做什麼、為誰做」。

### 不由這頁承接的查詢

| 查詢 | 交給 | 理由 |
|---|---|---|
| `企業 AI 導入` | `/blog/{slug}`，建議新增文章（見 `digirunner.md`「取捨」的「三件待決事項」） | 資訊型，前幾名是導入步驟的指南；首頁沒有步驟可寫，硬加段落會偏離受眾任務 |
| `系統整合 廠商 推薦` | 暫由 `/cloudservice` 次要承接（description 寫了系統整合）；`/services` 上線後改指 `/services` | 比較型，前幾名是英文列表文，首頁不適合。`search-intent.md`「對應到頁面」建議的 `/services` 依 #138 不產生頁面，不能當承接頁 |
| `昕力資訊 金融` | `/industries/finance` | 品牌加產業，首頁第 2 段只連過去 |
| `企業主權 AI 地端部署 方案`（主要） | `/aiso` | `nodes.csv` 的 AISO 主權 AI 節點；首頁第 5 段只涵蓋資料主權的子題，見「取捨」第 4 項 |

## 這頁要讓讀者相信什麼

昕力替金融與政府，把 API、資料與 AI 接進既有系統（定位句）；AI 已用在核心作業並有成果（`DM-2`），企業 AI 可以留在自己的環境（`DM-3`），產品和導入由同一家負責（`DM-4`），而且這家公司的穩定度看得到（`DM-6`）。

## 段落結構

順序是讀者的判斷順序：先確認「是不是為我做」（hero、產業），再看「做得到嗎」（案例、產品、OrientAI），最後看「找這家安不安心」（導入、穩定度）再聯絡。

| # | 段落 | 目的 | 依據（受眾任務／主張 id） | 搜尋子題 | 事實 | 預估長度 |
|---|---|---|---|---|---|---|
| 1 | Hero：替誰、做什麼 | 第一屏說出服務對象（金融與政府；不點名製造業，messaging「定位不說的事」）與做的事（把 API 與 AI 安全接進既有系統）。h1 寫定位句，不含品牌詞；說明的第一句以「昕力資訊（TPIsoftware）」開頭（取捨第 3 項）。換掉現行的「以頂尖科技為企業賦能」。附主要 CTA 與「依產業看方案」的次要動作 | 決策者任務「判斷昕力做什麼、是不是為我做」；定位句；`competitors.md`「本站缺」第 1 項（四家第一屏都沒寫服務對象） | 品牌導航（`昕力資訊`、`TPIsoftware`、`昕力資訊 官網`）要的「這家公司做什麼」；`台灣 AI 解決方案 公司`、`企業數位轉型 軟體公司` 要的「哪家公司、為誰做」 | `fact:company-industries` | 標題 15–25 字，說明 40–60 字 |
| 2 | 產業入口 | 只列有頁面的金融、政府兩個產業，每個一句「這個產業得到什麼」（規範要求已做在產品裡），連到產業頁。製造業不列（頁面是 draft，定位句也不點名）。從現行的第四區提前到 hero 後 | 決策者任務「找自己的產業」；`DM-1`；`competitors.md`「本站已有」第 2 項（產業入口可能是差異點） | —（不承接子題，把 `昕力資訊 金融`、`API 管理 金融業` 等產業查詢的讀者送到產業頁） | `fact:digirunner-open-banking-fsc`、`fact:digirunner-ndc-spec` | 段落引言 20–40 字；每個產業 25–40 字 |
| 3 | AI 用在核心作業的成果 | 三則案例，每則一個作業（理賠、建檔、阻詐）加一句成果。說明這些是已上線的作業，不是展示。連到解決方案頁或成功案例列表。客戶名稱已可用（使用者決定，#165），但已確認的具名案例講的是 API 平台與規則引擎（`DM-1`、`IT-4`、`DM-5`），不是 AI 作業，所以這段維持三則 AI 案例；具名案例放在產品頁與金融頁 | 決策者任務「找成功案例」；`DM-2`、`IT-8` | —（`保險科技 AI 理賠` 的「理賠文件審閱自動化」由 `/solutions/smartclaim` 承接，本段只連過去） | `fact:smartclaim-title`、`fact:smartclaim-result`、`fact:smartfilling-title`、`fact:smartfilling-result`、`fact:fraud-platform-title`、`fact:fraud-platform-result` | 引言 20–40 字；每則沿用事實原文 |
| 4 | 產品家族 | 每個家族一句「解決什麼問題」，不寫形容詞：DigiLism 寫接既有系統與 AI 串接，SysTalk.ai 寫 AI 模型可選，ESGswift 寫碳盤查範圍，GadoSecurity 寫身分驗證與異常偵測。列出導覽裡的產品，產品連結的錨點帶類別詞（例如「digiRunner API 管理平台」）；保留到產品總覽的入口 | IT 主管任務「依問題找產品」；決策者任務「了解產品與方案」；`IT-4`、`IT-6`、`IT-8`、`DM-7` | `昕力資訊 官網`：四條產品線；`TPIsoftware`：digiRunner、DigiLism 等產品名；`企業數位轉型 軟體公司`：以整合平台取代單點系統 | `fact:products-families`、`fact:digilism-protocol-integration`、`fact:digilism-family-digirunner`、`fact:aiso-llm-support`、`fact:greenswift-scope`、`fact:gadodido-passwordless`、`fact:gadoscout-ml-detection` | 每個家族 20–40 字 |
| 5 | OrientAI：企業 AI 留在自己的環境 | 主軸從「讓 AI 真正做事」改成資料與權限的掌控：只部署在企業端、權限與影子 AI 管控、Token 用量看得到、離線可運行。連到 OrientAI 頁 | 決策者任務「了解產品與方案」；`DM-3`，次要 `IT-8` | `台灣 AI 解決方案 公司`：地端部署、資料主權；`企業主權 AI 地端部署 方案`：部署形式（次要，主要在 `/aiso`） | `fact:orientai-on-prem-data`、`fact:orientai-governance-layer`、`fact:orientai-token-cost`、`fact:orientai-aidaptiv`、`fact:orientai-mcp` | 標題 15–25 字，說明 40–80 字，特色 3–4 項 |
| 6 | 產品與導入同一家 | 一段說明昕力自己研發產品，也做導入規劃、建置與顧問，決策者不必在原廠和導入商之間協調。下面接服務總覽的卡片（現有的服務區） | 決策者任務「決定要不要聯絡業務」（評估導入風險）；`DM-4` | — | `fact:company-offerings`、`fact:aiso-onboarding`、`fact:systalk-ai-onboarding` | 40–80 字，加服務卡片 |
| 7 | 合作對象的穩定度 | 列出成立年份、首度跨足金融產業的年份、新加坡與越南子公司、國際品牌、ISO27001 認證、Google Cloud 合作夥伴，連到關於我們。數字直接輸出在 HTML，不做數字動畫 | 決策者任務「決定要不要聯絡業務」（評估長期合作風險）；`DM-6`；`competitors.md`「本站缺」第 2 項（新站首頁沒有第三方證據） | `昕力資訊 官網`：公司成立年份 | `fact:company-founded`、`fact:company-subsidiaries-sg-vn`、`fact:company-milestone-2020-brand`、`fact:cert-iso27001-product-platform`、`fact:company-google-cloud-partner`、`fact:company-milestone-2008-finance` | 引言 20–30 字；6 項，每項沿用事實原文 |
| 8 | 聯絡業務 | 頁尾的主要轉換。標題寫讀者的下一步（談需求、預約 demo），不寫「用心傾聽」這類感受句 | 主要轉換：聯絡業務 | — | 無（回覆時間沒有事實，見「待確認」） | 標題 10–20 字，說明 30–50 字 |

### 與現有頁面的差異

對照 `src/data/home/zh-TW.ts` 與 `src/layouts/templates/HomeTemplate.astro`：

| 現有 | 處理 | 理由 |
|---|---|---|
| Hero「以頂尖科技為企業賦能」與說明「以客戶利益為導向…」 | 改寫 | 沒寫服務對象與做的事；「頂尖」「賦能」是 messaging「本站不用的字」 |
| 產品家族在 hero 後第一區 | 保留，移到第 4 段 | 決策者先確認產業與成果，再看產品；IT 主管從 header 或這段都找得到產品 |
| OrientAI 區（多 Agent、AI 治理、Token 成本） | 保留，改主軸 | 依 `DM-3` 改寫成資料留在企業端；「讓 AI 不只會回答」說的是功能，不是決策者在意的風險 |
| 產業、服務、案例三個入口共用一區 | 拆開：產業到第 2 段，案例到第 3 段，服務併入第 6 段 | 三者回答不同的問題；服務卡片沒有說明，單獨放推不出理由，接在 `DM-4` 後面才有意義 |
| 最新文章與新聞（2 篇 blog、1 則新聞） | 刪除 | 指不到主要受眾的任務，也指不到主張；次要受眾（媒體、投資人）的任務未定。blog 與媒體中心在 header 導覽裡 |
| 聯絡 CTA「您的需求，我們用心傾聽」 | 改寫 | 感受句，沒說下一步 |
| 產業段列出三個產業，製造業卡片沒有文案也沒有連結 | 拿掉製造業卡片，只留金融、政府 | 使用者決定定位句不保留製造業（#165）；製造業頁是 draft，沒有案例可寫。GreenSwift 的碳盤查改在第 4 段的 ESGswift 家族句（`DM-7`）說，不點名產業 |

## CTA

| CTA | 文案方向 | 位置 | 連到 |
|---|---|---|---|
| 主要：聯絡業務 | 談需求或預約 demo | 第 1 段 hero、第 8 段 | `/contact-us`（`contact`） |
| 次要：依產業看方案 | 找自己的產業 | 第 1 段 hero，取代現行的「產品總覽」按鈕 | 頁內第 2 段；產業卡片各自連到 `/industries/finance`、`/industries/government` |
| 次要：看案例 | 看所有成功案例 | 第 3 段 | `/success-story`（`success-stories`） |
| 次要：認識 OrientAI | 進產品頁 | 第 5 段 | `/orient-ai`（`orient-ai`） |
| 次要：關於昕力 | 看公司資料 | 第 7 段 | `/about-us`（`about`） |

hero 的次要按鈕從「產品總覽」改成「依產業看方案」：決策者依產業分群（`audience-and-goals.md`），產品總覽在 header 與第 4 段都有入口。

## 內部連結

路徑取 `docs/ia/nodes.csv`，只列會產生頁面的節點。#138 決定不上線的 `/services`、`/industries`、`/industries/manufacturing`、`/products/gadosecurity` 不當連結目標（`navigation.csv` 的「不進導覽」）。錨點文字寫目的地是什麼，不用「了解更多」「點此」。

### 連出

| 段落 | 連到 | 建議錨點文字 | 說明 |
|---|---|---|---|
| 1 | 頁內第 2 段（`#industries`） | 依產業看方案 | 頁內錨點，不是新頁 |
| 1、8 | `/contact-us` | 聯絡業務、預約 demo | 主要轉換 |
| 2 | `/industries/finance` | 金融業（卡片標題用節點名「金融」，錨點含產業名即可） | 也是 `昕力資訊 金融`、`API 管理 金融業` 的承接頁，首頁的連結是它最重要的連入之一 |
| 2 | `/industries/government` | 政府與公部門 | |
| 3 | `/solutions/smartclaim` | AI 智能理賠解決方案 | 用節點的正式名稱，對應 `保險科技 AI 理賠` 的承接頁 |
| 3 | `/solutions/smartfilling` | AI 智慧建檔解決方案 | |
| 3 | `/success-story` | 看所有成功案例 | 阻詐平台沒有自己的頁面，連列表 |
| 4 | `/products/systalk-ai`、`/products/digilism`、`/products/esgswift` | 家族名稱：SysTalk.ai、DigiLism、ESGswift | GadoSecurity 家族頁不產生，欄標題不加連結（同 header） |
| 4 | 家族下的產品頁，至少 `/products/digirunner`、`/products/gadodido`、`/products/gadoscout`、`/products/greenswift` | 產品名加類別，例如「digiRunner API 管理平台」 | digiRunner 單獨出現時跟同名遊戲撞名（`search-intent.md`「digiRunner」），錨點要帶類別詞 |
| 4 | `/products` | 產品總覽 | hero 拿掉「產品總覽」按鈕後，第 4 段要保留這個入口 |
| 5 | `/orient-ai` | 認識 OrientAI | 節點名是「OrientAI 企業級 Agentic AI 平台」，錨點可用短名 |
| 6 | `/aiso`、`/outsourcing`、`/cloudservice`、`/chatgpt-enterprise`、`/solutions/uiux`、`/esg-advisory` | 各服務的節點名稱，例如「AISO 主權 AI」 | 服務卡片逐一連到服務頁；沒有服務總覽可連 |
| 7 | `/about-us` | 關於昕力 | |

### 連入

首頁由每頁的 logo 與麵包屑連入，不需要另外安排。

### 建議新增

無。首頁不需要新頁面；`企業 AI 導入` 的文章見「不由這頁承接的查詢」。

## title 與 description 方向

規則照 `seo-checklist`「每頁必備」。首頁自己寫完整 title（`titleSuffix={false}`），zh-TW 約 20–32 個全形字，description 約 60–80 個全形字；半形英數約算半個全形字。改寫位置是 `src/data/home/zh-TW.ts` 的 `meta`。

### title

- 要涵蓋：公司名兩種寫法（昕力資訊、TPIsoftware），服務對象（金融、政府），做的事（API、AI）
- 傳達的主張：定位句的短版（替金融與政府，把 API 與 AI 安全接進既有系統）
- 公司名放最前面：首頁承接的主要查詢都是品牌導航
- 不放「數位轉型」「解決方案」「賦能」「頂尖」：前兩個是 messaging 限定用法，後兩個是「本站不用的字」；現行 title「TPIsoftware 昕力資訊｜以頂尖科技為企業賦能」要換掉
- 示例：
  - `昕力資訊 TPIsoftware｜金融與政府的 API 與 AI 軟體`
  - `TPIsoftware 昕力資訊｜把 API 與 AI 安全接進既有系統`

### description

- 要涵蓋：公司名並列、服務對象、產品家族名稱（AI、數位轉型（DigiLism）、資安、ESG），「研發並導入」
- 傳達的主張：定位句、`DM-4`；有餘裕時帶 `DM-1`
- 依據的事實：`fact:company-industries`、`fact:products-families`、`fact:company-offerings`。描述裡只寫這些事實能撐住的範圍，不寫數字
- 「數位轉型」只以家族名「數位轉型（DigiLism）」出現，這樣同時涵蓋 `企業數位轉型 軟體公司` 的用詞，又不當價值主張
- 示例：
  - `昕力資訊（TPIsoftware）研發並導入自有軟體，替金融與政府把 API、資料與 AI 安全接進既有系統，產品家族涵蓋 AI、數位轉型（DigiLism）、資安與 ESG。`
  - `昕力資訊（TPIsoftware）替金融與政府研發並導入 API 管理、企業 AI 與碳管理軟體，規範要求做在產品裡，導入也由同一家負責。`

## schema 缺口

首頁不建 collection，文案在 `src/data/home/<locale>.ts`，型別是該檔匯出的 `Home`。改型別時 en、vi 檔要一起補，模板 `HomeTemplate.astro` 要一起改（主 session 實作）。

| 段落 | 缺什麼 | 新增的欄位 | 型別 |
|---|---|---|---|
| 2、3、4 | 段落沒有引言，`SectionHeading` 只吃節點名稱 | `intros` | `{ industries: string; cases: string; families?: string }` |
| 6 | 服務區沒有說明文字 | `services` | `{ title: string; description: string }` |
| 7 | 沒有穩定度的區塊 | `trust` | `{ title: string; description?: string; points: string[]; link: 'about' }`，`points` 每項用 `fact('<id>')` |
| 5 | OrientAI 現有 `title`、`features`、`action`，沒有說明句 | `orientAi.description` | `string` |
| 8 | `contactCta` 已有 `title`、`description` | 無 | 只改文案 |
| 1 | hero 的次要動作寫死為「產品總覽」 | `hero.secondary` | `{ label: string; href: '#industries' }`，或模板直接改為產業段的錨點 |
| — | 刪除最新文章與新聞 | 刪 `labels.latest` | 模板拿掉該區 |

`familyLines` 用節點 id 當 key，補 GadoSecurity 的句子不必改型別。

第 2 段只列有頁面的產業：`HomeTemplate.astro` 現在列 `children('industries')` 全部子節點（含 draft 的製造業），要改成只列 `hasPage()` 為真的節點。這是模板變更，不是欄位；`industryLines` 不再需要製造業的 key。

## 取捨

第 1–4 項是 content-strategist 預寫的衝突，第 5 項起是 seo-strategist 加的。「最後決定」欄由 content-strategist 定案，本頁全部採納 seo-strategist 的意見，已反映到段落結構（第 1、4 段）與內部連結。

| # | 可能的衝突 | content-strategist 的立場 | 理由 | seo-strategist 的意見 | 最後決定 |
|---|---|---|---|---|---|
| 1 | `search-intent.md` 的類別詞「企業數位轉型 軟體公司」「台灣 AI 解決方案 公司」可能被要求放進 h1 或 hero | 放 title、description 與產品家族名稱（「數位轉型（DigiLism）」本來就是家族名），不放 hero 主張 | messaging「本站不用的字」：「數位轉型」只當家族名與搜尋詞，「解決方案」只用在正式名稱；這兩個詞說不出昕力的差異 | 同意不放 h1 與 hero。再收窄一點：title 也不放這兩個類別詞，只放 description（以家族名出現）。兩組查詢的前幾名是定義文與國際廠商頁，首頁的 title 拿去搶類別詞，換來的是品牌導航的 title 變模糊；首頁的 title 先服務品牌查詢 | 採納。類別詞不進 h1、hero、title；description 只以家族名「數位轉型（DigiLism）」出現 |
| 2 | 刪掉最新文章與新聞，SEO 可能要保留，作為新內容的入口與站內連結 | 刪除；若 SEO 指得出首頁要承接的搜尋子題，再談換成和產品相關的精選文章 | 首頁每段要指到受眾任務或主張；blog 與媒體中心已在 header | 同意刪除。首頁承接的查詢裡沒有要靠文章回答的子題；新站有 sitemap（`src/integrations/sitemap.ts`），header 也連到 `/blog`，文章不靠首頁才被找到。資訊型查詢的文章（見 `digirunner.md`「取捨」的「三件待決事項」）寫好後，由產品頁與產業頁連過去，比首頁的「最新文章」更貼主題 | 採納。刪除，不換成精選文章 |
| 3 | h1 要不要含「昕力資訊」品牌詞 | 可以，只要同一句仍說出服務對象與做的事；品牌詞放 eyebrow 也可以，交 SEO 決定 | 品牌導航型查詢（`昕力資訊`、`TPIsoftware`）由首頁承接，定位句也要在第一屏 | h1 不必含品牌詞。品牌查詢靠 title 開頭的公司名、首頁的 `Organization` 結構化資料與 logo 對應；h1 留給定位句，字數才夠寫服務對象與做的事（第 1 段標題 15–25 字）。公司名改放 hero 說明的第一句，用 messaging 規定的首次並列寫法「昕力資訊（TPIsoftware）」，讓品牌詞出現在第一屏的可讀文字裡 | 採納。h1 寫定位句，不含品牌詞；hero 說明第一句寫「昕力資訊（TPIsoftware）」，已寫進第 1 段的目的 |
| 4 | 「企業主權 AI 地端部署 方案」可能要求首頁加 AISO 段 | 不加；第 5 段 OrientAI 的資料主權主張已涵蓋，AISO 由 `/aiso` 承接，第 6 段的服務卡片連得到 | `search-intent.md`「對應到頁面」把這組指給 `/aiso`；首頁再開一段會跟 OrientAI 重複 | 同意。第 6 段的 AISO 服務卡片錨點用節點名「AISO 主權 AI」，讓這組查詢的用詞出現在連往 `/aiso` 的連結上 | 採納。不加 AISO 段；服務卡片錨點用節點名「AISO 主權 AI」 |
| 5 | 品牌詞的前幾名是新聞（上櫃、財報、與群聯的合作），首頁要不要回應 | 不回應 | 新聞內容不在事實庫，媒體與投資人的任務也未定（`audience-and-goals.md` 問題 1）；首頁每段要指到主要受眾的任務或主張 | 不回應。這些是媒體寫的公司近況，不是事實庫的事實，也不是主要受眾的任務；`/media-center` 在 header 的「公司」選單裡。首頁只確保公司名、服務對象、做的事在 title、description、第一屏寫清楚 | 採納。首頁不設新聞或公司近況段 |
| 6 | `search-intent.md`「對應到頁面」把 `系統整合 廠商 推薦` 指給 `/services`，但 `/services` 依 #138 不產生頁面 | 首頁不承接；同意暫交 `/cloudservice` | 現有服務頁裡，`/cloudservice` 的 description 明寫系統整合；`search-intent.md` 列的次要頁 `/outsourcing` 寫的是顧問與人力駐點，離「系統整合」更遠。第 6 段寫的是 `DM-4`（產品與導入同一家），加「系統整合」會把主張改成通用的 SI 說法 | 暫由 `/cloudservice` 次要承接（它的 description 寫了系統整合），`/services` 上線後改指。首頁不承接，第 6 段也不加「系統整合」字樣。`search-intent.md` 的對應表要不要跟著改，交主 session | 採納。首頁不承接，第 6 段不加「系統整合」字樣；暫由 `/cloudservice` 次要承接，`/services` 產生頁面後改指 `/services`。`search-intent.md` 的對應表已在本 PR（#165）更新 |
| 7 | 第 4 段連到產品頁時，digiRunner 只寫產品名 | 同意帶類別詞 | 節點名本來就是「digiRunner API 管理平台」，與 messaging 的統一用詞「API 管理平台」一致，不必另寫 | 連到 digiRunner 的錨點寫「digiRunner API 管理平台」，不只寫「digiRunner」：單獨查 `digiRunner` 的前幾名是同名遊戲（`search-intent.md`「digiRunner」），帶類別詞的錨點讓連結本身說清楚是 API 產品。其他產品照節點名稱 | 採納。產品錨點用節點名稱（含類別詞），已寫進第 4 段的目的 |

## 待確認

| # | 事項 | 卡在哪 | 影響的段落 |
|---|---|---|---|
| 5 | 金融與政府的排序 | `audience-and-goals.md` 問題 2，M2-01 暫定金融、政府、製造業 | 1、2 |

### 已結算（#180）

其餘項目在 #180 結算（使用者決定，2026-11-02），編號保留：

| # | 事項 | 結果 |
|---|---|---|
| 1 | 獎項能不能放首頁（`fact:award-taiwan-excellence-2023`、`fact:award-taiwan-excellence-2024`、`fact:award-gartner-cool-vendor-2018`） | 改為 `confirmed`，第 7 段可以加獎項，寫出年份。證言照 #165 可以直接加；委外服務頁國泰摘錄的「最佳技術」（`fact:testimonial-cathay-fhc-excerpt`）不用。#183 照 `messaging.md` 的 `DM-6`、`DM-8` 放了 FT 2022 與台灣精品獎 2024；Gartner 2018 不用（理由見 `DM-8`），台灣精品獎 2023 與 2024 的得獎產品重疊，首頁只放 2024 |
| 2 | 規模數字（`fact:company-employees-630`、`company-projects-400`） | 員工數改為 `confirmed`，原文寫出 2020 年，第 7 段可以用（#183 已放）。專案數那句沒有年份，維持 `to_confirm`、不用（使用者決定） |
| 3 | 製造業之後要不要回到首頁 | 現站沒有製造業內容，不處理。hero 與產業入口維持不點名製造業（#165） |
| 4 | 聯絡後多久回覆 | 現站沒有資料，不處理。聯絡段不寫回覆時間 |
| 6 | GadoSecurity 家族介紹 | 現站沒有資料，不處理。家族頁維持 draft，第 4 段只用 gadoDIDO、gadoScout 的產品事實 |
