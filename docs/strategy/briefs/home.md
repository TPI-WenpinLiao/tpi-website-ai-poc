# Content brief：首頁 `/`（#165）

- 模板：`home`；文案位置：`src/data/home/zh-TW.ts`（型別 `Home`，在 `src/data/home/types.ts`，en、vi 檔要滿足同一型別），版面在 `src/layouts/templates/HomeTemplate.astro`
- 主張 id 指 `docs/strategy/messaging.md`；事實的寫法見 `content-strategy` skill「引用事實的寫法」，只用 `docs/strategy/facts.yaml` 裡 zh-TW、`status: confirmed` 的條目
- 狀態：#165 加上 `strategy-approved`。#166 使用者決定首頁精簡成 5 段（`docs/strategy/concepts/copy-deck.md`「第四輪：偏離 brief 的地方」），#167 照 `ribbon-route` 原型做進 production。#186 把段落表、CTA 表與連出表改寫成 production 的 5 段，#165 的 8 段怎麼併成 5 段寫在「取捨」第 8 項；兩組類別詞改為次要承接（「取捨」第 14 項），「schema 缺口」加了 `WebSite` 的 `potentialAction`
- en、vi 首頁還是 #167 之前的文案，5 段版沒有對應文字的段落不輸出（`src/data/home/types.ts`），列為 #177

## 受眾與任務

依 `docs/research/audience-and-goals.md`「受眾分群」：

| 受眾 | 來首頁做什麼 | 首頁要讓他做到的事 |
|---|---|---|
| 決策者（金融、政府與公部門、製造業的 CIO、CTO、高階主管），主要 | 判斷昕力做什麼、是不是為他的產業做；找成功案例；決定要不要聯絡業務 | 第一屏看懂昕力替誰做什麼；兩次捲動內找到自己的產業入口與一則有成果的案例；隨時找得到聯絡業務 |
| IT 主管、專案負責人，主要 | 找到對應的產品，確認裝得進現有環境 | 依問題（API、AI、資安、碳管理）找到產品頁 |
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
| `台灣 AI 解決方案 公司` | 商業型 | 次要（取捨第 14 項）。沒有主要承接頁；首頁用 description 與段落文字回答「哪家公司、為誰做」，第 3 段的 AI 成果回答前幾名都沒有的「導入後的成果與案例」。另外次要：`/products/systalk-ai`、`/orient-ai` | 「台灣 AI 解決方案 公司」 |
| `企業數位轉型 軟體公司` | 資訊型為主，帶商業型 | 次要（取捨第 14 項）。沒有主要承接頁；查的是「哪家公司」，新站只有首頁回答，靠 description 的家族名「數位轉型（DigiLism）」與 h1 的「既有系統原地接上」。另外次要：`/products/digilism` | 「企業數位轉型 軟體公司」 |
| `企業主權 AI 地端部署 方案` | 資訊型與商業型 | 次要；主要是 `/aiso` | 「企業主權 AI 地端部署 方案」 |

品牌詞的前幾名是新聞與評論平台，官網一筆都沒出現（`search-intent.md`「跨頁的觀察」）。首頁能做的是讓 title、h1 附近的文字與 description 清楚寫出公司名、服務對象與做的事；「公司近況」這類新聞需求由 `/media-center` 承接，首頁不設段落。

兩組類別詞的前幾名是定義文、國際廠商頁與新聞，首頁不寫定義去搶，title 也不放類別詞（取捨第 1 項），所以列為次要：只靠 description 與段落文字回答「這家公司做什麼、為誰做」。首頁的主要承接只有三組品牌詞，title 的「主要查詢用詞」指公司名的兩種寫法（取捨第 14 項）。

### 不由這頁承接的查詢

| 查詢 | 交給 | 理由 |
|---|---|---|
| `企業 AI 導入` | `/blog/{slug}`，建議新增文章（見 `digirunner.md`「取捨」的「三件待決事項」） | 資訊型，前幾名是導入步驟的指南；首頁沒有步驟可寫，硬加段落會偏離受眾任務 |
| `系統整合 廠商 推薦` | 暫由 `/cloudservice` 次要承接（description 寫了系統整合）；`/services` 上線後改指 `/services` | 比較型，前幾名是英文列表文，首頁不適合。`search-intent.md`「對應到頁面」建議的 `/services` 依 #138 不產生頁面，不能當承接頁 |
| `昕力資訊 金融` | `/industries/finance` | 品牌加產業，首頁第 2 段只連過去 |
| `企業主權 AI 地端部署 方案`（主要） | `/aiso` | `nodes.csv` 的 AISO 主權 AI 節點；首頁第 4 段的 OrientAI 只涵蓋資料主權的子題，見「取捨」第 4 項 |

## 這頁要讓讀者相信什麼

昕力替金融與政府，把 API、資料與 AI 接進既有系統（定位句）；AI 已用在理賠與建檔這類核心作業並有成果（`DM-2`），企業 AI 可以留在自己的環境（`DM-3`），產品和導入由同一家負責（`DM-4`），而且這家公司的穩定度看得到（`DM-6`）。

## 段落結構

5 段，順序是讀者的判斷順序：先確認「是不是為我做」（hero、產業入口），再看「做得到嗎」（AI 成果、產品與 OrientAI），最後看「找這家安不安心」（紀錄）再聯絡。每段一句標題，加最多一句說明或一則事實，細節由產品頁、產業頁承接（`design-principles.md` 開頭的「定案」）。#165 版的 8 段怎麼併成這 5 段、移出的內容由哪些頁承接，見「取捨」第 8 項。

「影像」欄照 `design-principles.md` 的 P3「影像」、P5「影像」與 `concepts/ribbon-route/README.md`「5 段的畫面與捲動」；圖檔在 `src/assets/design/ribbon/`，由 `scripts/design/ribbon-capture.mjs` 產生。

| # | 段落 | 目的 | 依據（受眾任務／主張 id） | 搜尋子題 | 事實 | 預估長度 | 影像 |
|---|---|---|---|---|---|---|---|
| 1 | Hero：替誰、做什麼 | h1 兩行寫出服務對象與做的事（「金融與政府的既有系統／原地接上 API 與 AI」），不含品牌詞，不點名製造業（messaging「定位不說的事」）。說明句以「昕力資訊（TPIsoftware）」開頭，寫昕力自己研發產品、也負責導入規劃與建置（取捨第 3 項）。兩個動作：「聯絡業務」按鈕、「依產業看方案」文字連結（跳到第 2 段） | 決策者任務「判斷昕力做什麼、是不是為我做」；定位句、`DM-4`；h1 的「原地接上」依據 `IT-4`（取捨第 11 項）；`competitors.md`「本站缺」第 1 項（四家第一屏都沒寫服務對象） | 品牌導航（`昕力資訊`、`TPIsoftware`、`昕力資訊 官網`）要的「這家公司做什麼」；`台灣 AI 解決方案 公司`、`企業數位轉型 軟體公司` 要的「哪家公司、為誰做」 | 無（表述）。說明句的依據是 `fact:company-offerings`、`fact:aiso-onboarding`，h1 的依據是 `fact:digilism-protocol-integration`、`fact:digirunner-nginx-waf`，兩者都不在畫面上引用 | h1 兩行，每行約 10 字；說明 25–35 字 | 系統地圖：桌機載 3D 緞帶場景（ADR 0003），手機、減少動態與 3D 載入前用同一個世界渲染的靜態圖（`hero-wide.webp`、`hero-tall.webp`）。圖上用 HTML 標籤寫系統類別（核心系統、既有系統、昕力的產品、AI 模型、新的服務，`src/data/strings/zh-TW.ts` 的 `mapLabels`）。圖在文字之後，換掉它第一屏的意思不變（P1） |
| 2 | 產業入口 | 只列有頁面的金融、政府兩個產業，製造業不列（頁面是 draft，定位句也不點名）。每個產業是一個整塊可點的入口：節點名稱、一則事實原文、連結文字。h2 直接說結論（「規範要求，已做進產品」），沒有段落引言 | 決策者任務「找自己的產業」；`DM-1`；`competitors.md`「本站已有」第 2 項（產業入口可能是差異點） | —（不承接子題，把 `昕力資訊 金融`、`API 管理 金融業` 等產業查詢的讀者送到產業頁） | `fact:digirunner-open-banking-fsc`（金融）、`fact:digirunner-ndc-spec`（政府） | h2 約 10 字；每個產業：名稱、原文 23–25 字、連結 6–9 字 | 緞帶分岔的靜態圖（`fork-wide.webp`、`fork-tall.webp`），裝飾用，`alt=""`。#168 評審指出分岔圖的面積比兩個入口大（new-home D3），由 #187 調整 |
| 3 | AI 已用在核心作業的成果 | 三則 AI 作業，每則是作業名稱、成果原文、一個連結（P2 的「作業 → 成果 → 連結」）。三則的名稱或原文都寫出 AI（`DM-2` 的寫法）：理賠、醫療單據建檔、金融業的文件建檔。第三則取代原本的「金融聯防阻詐平台」，見取捨第 9 項。客戶名稱已可用（#165），但已確認的具名案例講的是 API 平台與規則引擎（`DM-1`、`IT-4`、`DM-5`），不是 AI 作業，具名案例放在產品頁與金融頁 | 決策者任務「找成功案例」；`DM-2` | —（`保險科技 AI 理賠` 的「理賠文件審閱自動化」由 `/solutions/smartclaim` 承接，本段只連過去） | 第 1 則 `fact:smartclaim-title`、`fact:smartclaim-result`；第 2 則 `fact:smartfilling-title`、`fact:smartfilling-result`；第 3 則 `fact:smartfilling-case-bank-title`、`fact:smartfilling-case-bank` | h2 約 9 字；每則照事實原文，36–75 字 | 每則一張沿緞帶的近景（`case-1.webp`～`case-3.webp`），亮起這則作業的方塊，標籤寫作業名稱。桌機的 3D 版在這段停住三個螢幕高，一次顯示一則（`count` 的「第 {n} 則，共 {total} 則」）。#168 評審指出三張近景看不出各自的作業（`concepts/ribbon-route/review.md` D2），留給 #187 |
| 4 | 產品與 OrientAI | 前半是產品索引：4 個產品各一列，只放節點名稱（含類別詞）與縮圖，不放描述句（取捨第 12、13 項），段末連到產品總覽。後半是 OrientAI 的深紫帶：一句主張（資料留在企業端），加一句問句「資料會離開企業嗎？」承接 `fact:orientai-on-prem-data` 原文開頭的「不會。」，連到 OrientAI 頁 | IT 主管任務「依問題找產品」；決策者任務「了解產品與方案」；`DM-3`；4 個產品各自對應 `IT-4`、`IT-6`（digiRunner）、`IT-8`（SysTalk.VIKI）、`IT-2`（gadoDIDO）、`DM-7`（GreenSwift） | `昕力資訊 官網`：產品線；`TPIsoftware`：digiRunner 等產品名；`台灣 AI 解決方案 公司`：地端部署、資料主權；`企業主權 AI 地端部署 方案`：部署形式（次要，主要在 `/aiso`） | `fact:orientai-on-prem-data` | h2 兩行約 15 字；產品名照節點名稱；OrientAI 標題約 13 字，問句加原文約 50 字 | 4 張產品縮圖（`prod-digirunner.webp`、`prod-viki.webp`、`prod-gadodido.webp`、`prod-greenswift.webp`），`alt=""`；OrientAI 帶旁邊一張同一個世界的圖（`orientai.webp`）。#168 評審指出四張縮圖是同一條緞帶的裁切、分不出產品（review.md D2），左欄 h2 下方約 400 px 空白（new-home D4），留給 #187 |
| 5 | 紀錄與聯絡 | 6 則紀錄，依年份排、認證放最後：成立、首度跨足金融、2020 年員工數、公司獎、產品獎、ISO27001。每則是年份或項目加原文，數字直接輸出在 HTML，不做數字動畫。接著唯一的動作「聯絡業務」與「關於昕力」連結。h2 寫讀者能確認什麼（「合作得久，有紀錄可查」） | 決策者任務「決定要不要聯絡業務」（評估長期合作風險）；`DM-6`、`DM-8`；`competitors.md`「本站缺」第 2 項（新站首頁沒有第三方證據）；主要轉換：聯絡業務 | `昕力資訊 官網`：公司成立年份 | `fact:company-founded`、`fact:company-milestone-2008-finance`、`fact:company-employees-630`、`fact:award-ft-high-growth-2022`、`fact:award-taiwan-excellence-2024`、`fact:cert-iso27001-product-platform` | h2 約 11 字；6 則照事實原文；按鈕與連結 | 無圖。整段是深紫帶，貫穿全頁的緞帶在聯絡按鈕旁以橘色收尾（`HomeTemplate.astro` 的 `band`） |

第 5 段 6 則紀錄的取捨（#183）：台灣精品獎 2023 與 2024 的得獎產品重疊，只放 2024；Gartner 2018 不用（`messaging.md` `DM-8`「沒收進這條的有年份獎項」）；子公司、國際品牌、Google Cloud 合作夥伴移到 `/about-us`（取捨第 8 項）。

### 與 #167 之前首頁的差異

對照 #167 之前的 `src/data/home/zh-TW.ts` 與 `HomeTemplate.astro`（#168 評審的「試點舊版」，`main` 818988f）：

| #167 之前 | 處理 | 理由 |
|---|---|---|
| Hero「以頂尖科技為企業賦能」與說明「以客戶利益為導向…」 | 改寫成第 1 段 | 沒寫服務對象與做的事；「頂尖」「賦能」是 messaging「本站不用的字」 |
| 產品家族在 hero 後第一區 | 移到第 4 段，只列 4 個產品 | 決策者先確認產業與成果，再看產品；IT 主管從 header 或這段都找得到產品 |
| OrientAI 區（多 Agent、AI 治理、Token 成本） | 併進第 4 段，改主軸 | 依 `DM-3` 改寫成資料留在企業端；「讓 AI 不只會回答」說的是功能，不是決策者在意的風險 |
| 產業、服務、案例三個入口共用一區 | 產業到第 2 段，AI 案例到第 3 段，服務卡片刪除 | 三者回答不同的問題；服務在 header 的「服務」選單（取捨第 8 項） |
| 最新文章與新聞（2 篇 blog、1 則新聞） | 刪除 | 指不到主要受眾的任務，也指不到主張；次要受眾（媒體、投資人）的任務未定。blog 與媒體中心在 header 導覽裡 |
| 聯絡 CTA「您的需求，我們用心傾聽」 | 改寫，併進第 5 段 | 感受句，沒說下一步。其他頁頁尾的 `ContactCta` 改成「談需求，或預約演示」（`src/data/home/zh-TW.ts` 的 `contactCta`） |
| 產業段列出三個產業，製造業卡片沒有文案也沒有連結 | 拿掉製造業，只留金融、政府 | 使用者決定定位句不保留製造業（#165）；製造業頁是 draft，沒有案例可寫 |

## CTA

主要轉換的按鈕全站叫「聯絡業務」（取捨第 10 項）。

| CTA | 文案 | 位置 | 連到 |
|---|---|---|---|
| 主要：聯絡業務 | 聯絡業務 | 第 1 段 hero、第 5 段；header 的常駐按鈕也是同一個名稱 | `/contact-us`（`contact`） |
| 次要：依產業看方案 | 依產業看方案 | 第 1 段 hero，取代 #167 之前的「產品總覽」按鈕 | 頁內第 2 段（`#industries`） |
| 次要：產業入口 | 看金融業方案、看政府與公部門方案 | 第 2 段 | `/industries/finance`、`/industries/government` |
| 次要：AI 成果 | 每則一個連結，寫目的地（取捨第 9 項） | 第 3 段 | `/solutions/smartclaim`、`/solutions/smartfilling`、`/industries/finance` |
| 次要：看產品 | 產品節點名稱；產品總覽 | 第 4 段前半 | 4 個產品頁、`/products` |
| 次要：認識 OrientAI | 認識 OrientAI 企業級 Agentic AI 平台 | 第 4 段後半 | `/orient-ai`（`orient-ai`） |
| 次要：關於昕力 | 關於昕力 | 第 5 段 | `/about-us`（`about`） |

hero 的次要動作是「依產業看方案」，不是「產品總覽」：決策者依產業分群（`audience-and-goals.md`），產品總覽在 header 與第 4 段都有入口。

## 內部連結

路徑取 `docs/ia/nodes.csv`，只列會產生頁面的節點。#138 決定不上線的 `/services`、`/industries`、`/industries/manufacturing`、`/products/gadosecurity` 不當連結目標（`navigation.csv` 的「不進導覽」）。錨點文字寫目的地是什麼，不用「了解更多」「點此」。

### 連出

| 段落 | 連到 | 建議錨點文字 | 說明 |
|---|---|---|---|
| 1 | 頁內第 2 段（`#industries`） | 依產業看方案 | 頁內錨點，不是新頁 |
| 1、5 | `/contact-us` | 聯絡業務 | 主要轉換；header 的常駐按鈕同名（取捨第 10 項） |
| 2 | `/industries/finance` | 看金融業方案（入口標題是節點名「金融」） | 也是 `昕力資訊 金融`、`API 管理 金融業` 的承接頁，首頁的連結是它最重要的連入之一 |
| 2 | `/industries/government` | 看政府與公部門方案 | |
| 3 | `/solutions/smartclaim` | AI 智能理賠解決方案 | `nodes.csv` 的節點名稱，一字不改，不加「看」，也不縮成「方案」。對應 `保險科技 AI 理賠` 的承接頁。production 寫「看 AI 智慧理賠方案」：「智慧」來自作業名稱 `fact:smartclaim-title`（「AI 智慧理賠」），節點名是「智能」，由 #187 改。作業名稱照事實原文寫在卡片上，連結文字用節點名，兩者不同是預期的，不要把其中一個改成跟另一個一樣 |
| 3 | `/solutions/smartfilling` | AI 智慧建檔解決方案 | 節點名稱，一字不改。production 寫「看 AI 智慧建檔方案」，由 #187 改 |
| 3 | `/industries/finance` | 金融業的 AI 應用 | 第 3 則的出處 `fact:smartfilling-case-bank` 也在金融頁第 4 段（取捨第 9 項）；智慧建檔解決方案頁已由第 2 則連到，這則連產業頁，兩則的連結不重複。錨點寫目標頁回答的事（金融業的 AI 應用），不只寫「金融」；也是 `金融業 AI 應用` 承接頁的連入。#187 若替金融頁第 4 段加 `id`，可以連到那一段（`/industries/finance#<id>`，`scripts/seo/links.mjs` 會檢查 `#錨點` 存在），不加也可以 |
| 4 | `/products/digirunner`、`/products/systalk-viki`、`/products/gadodido`、`/products/greenswift` | 節點名稱：digiRunner API 管理平台、SysTalk.VIKI 企業生成式 AI 應用平台、gadoDIDO 無密碼身分驗證、GreenSwift 智慧碳管理平台 | 節點名稱本身帶類別詞；digiRunner 單獨出現時跟同名遊戲撞名（`search-intent.md`「digiRunner」，取捨第 7 項） |
| 4 | `/products` | 產品總覽 | hero 拿掉「產品總覽」按鈕後，第 4 段保留這個入口 |
| 4 | `/orient-ai` | 認識 OrientAI 企業級 Agentic AI 平台 | |
| 5 | `/about-us` | 關於昕力 | 子公司、國際品牌、Google Cloud 合作夥伴移到這頁 |

5 段版不再連出的頁面：產品家族頁（`/products/systalk-ai`、`/products/digilism`、`/products/esgswift`）、`/products/gadoscout`、6 個服務頁、`/success-story`。家族頁與 gadoScout 由 header 的「產品」選單與 `/products` 連入，服務頁由 header 的「服務」選單連入，成功案例列表由 header 的「資源」選單連入。#165 版第 3 段連 `/success-story` 是因為阻詐平台沒有自己的頁面，第 3 則換掉後不需要（取捨第 9 項）。

### 連入

首頁由每頁的 logo 與麵包屑連入，不需要另外安排。

### 建議新增

無。首頁不需要新頁面；`企業 AI 導入` 的文章見「不由這頁承接的查詢」。

## title 與 description 方向

規則照 `seo-checklist`「每頁必備」。首頁自己寫完整 title（`titleSuffix={false}`），zh-TW 約 20–32 個全形字，description 約 60–80 個全形字；半形英數約算半個全形字。改寫位置是 `src/data/home/zh-TW.ts` 的 `meta`。

### title

- 要涵蓋：公司名兩種寫法（昕力資訊、TPIsoftware），服務對象（金融、政府），做的事（API、AI）
- 傳達的主張：定位句的短版（替金融與政府，把 API 與 AI 安全接進既有系統）
- 公司名放最前面：首頁主要承接的查詢只有品牌導航三組，兩組類別詞是次要（取捨第 14 項），所以 title 的「主要查詢用詞」就是「昕力資訊」「TPIsoftware」。「AI」「軟體」是做的事的表述，不是為了配類別詞
- 不放「數位轉型」「解決方案」「賦能」「頂尖」：前兩個是 messaging 限定用法，後兩個是「本站不用的字」；#167 之前的 title「TPIsoftware 昕力資訊｜以頂尖科技為企業賦能」已換掉
- 示例：
  - `昕力資訊 TPIsoftware｜金融與政府的 API 與 AI 軟體`（production 用這一個）
  - `TPIsoftware 昕力資訊｜把 API 與 AI 安全接進既有系統`

### description

- 要涵蓋：公司名並列、服務對象、產品家族名稱（AI、數位轉型（DigiLism）、資安、ESG），「研發並導入」
- 傳達的主張：定位句、`DM-4`；有餘裕時帶 `DM-1`
- 依據的事實：`fact:company-industries`、`fact:products-families`、`fact:company-offerings`。描述裡只寫這些事實能撐住的範圍，不寫數字
- 「數位轉型」只以家族名「數位轉型（DigiLism）」出現，這樣同時涵蓋 `企業數位轉型 軟體公司` 的用詞，又不當價值主張
- 示例：
  - `昕力資訊（TPIsoftware）研發並導入自有軟體，替金融與政府把 API、資料與 AI 安全接進既有系統，產品家族涵蓋 AI、數位轉型（DigiLism）、資安與 ESG。`（production 用這一個）
  - `昕力資訊（TPIsoftware）替金融與政府研發並導入 API 管理、企業 AI 與碳管理軟體，規範要求做在產品裡，導入也由同一家負責。`

## schema 缺口

5 段版的欄位在 #167 已加進 `src/data/home/types.ts`，本 brief 的改動不需要新欄位：

- 第 3 段第 3 則換成 `fact:smartfilling-case-bank`，`cases.items[].node` 填 `industry-finance`，只改 `src/data/home/zh-TW.ts` 的文案
- header 的按鈕名稱是 `docs/ia/navigation.csv` 第一列（`utility`、`contact`）的名稱欄，不是 `Home` 型別的欄位。改成「聯絡業務」時，en、vi 的譯名照 `docs/i18n/glossary.csv` 補（取捨第 10 項）
- JSON-LD（給 #187，不是內容欄位）：首頁的 `WebSite` 加 `potentialAction`。`content-model.md`「首頁」規定站內搜尋上線後要加，站內搜尋在 M6 已上線（new-home S6，`evaluation.md`「新版還不夠好的地方」）。值是 `SearchAction`，`target` 為 `EntryPoint`、`urlTemplate` 是該語系的 `/search?q={search_term_string}`（`/search` 是 `nodes.csv` 的 `search` 節點，`SearchResults` 讀 `q`；路徑用 `src/lib/i18n/` 組，en、vi 是 `/en/search`、`/vi/search`），`query-input` 是 `required name=search_term_string`。只在 `/search` 對該語系有 build 時輸出（`src/lib/ia/built.ts`）。Google 已不在搜尋結果顯示站內搜尋框，加這個欄位是為了照 `content-model.md` 讓 JSON-LD 和 header 的搜尋入口一致（S6），不是為了搜尋結果的展示
- `Organization.sameAs`（new-home S6 也提到沒有輸出）：產生函式已支援，但 `src/content/organization/<locale>.yaml` 沒有官方社群帳號的網址，新站 footer 也沒有社群連結。網址要由內容負責人提供後填進 `sameAs`，不從第三方頁面猜；沒有就不輸出，不算 #187 的漏項

## 取捨

第 1–7 項是 #165 的衝突：第 1–4 項由 content-strategist 預寫，第 5 項起是 seo-strategist 加的，「最後決定」欄由 content-strategist 定案，本頁全部採納 seo-strategist 的意見。第 4、6 項的決定在 #186 依 5 段版更新。第 8 項起是 #186 依 #168 的評審補的，seo-strategist 在 #186 補了意見欄，第 8–13 項都同意，最後決定不變；第 14 項由 seo-strategist 提出並決定（SEO 的承接分類）。

| # | 可能的衝突 | content-strategist 的立場 | 理由 | seo-strategist 的意見 | 最後決定 |
|---|---|---|---|---|---|
| 1 | `search-intent.md` 的類別詞「企業數位轉型 軟體公司」「台灣 AI 解決方案 公司」可能被要求放進 h1 或 hero | 放 title、description 與產品家族名稱（「數位轉型（DigiLism）」本來就是家族名），不放 hero 主張 | messaging「本站不用的字」：「數位轉型」只當家族名與搜尋詞，「解決方案」只用在正式名稱；這兩個詞說不出昕力的差異 | 同意不放 h1 與 hero。再收窄一點：title 也不放這兩個類別詞，只放 description（以家族名出現）。兩組查詢的前幾名是定義文與國際廠商頁，首頁的 title 拿去搶類別詞，換來的是品牌導航的 title 變模糊；首頁的 title 先服務品牌查詢 | 採納。類別詞不進 h1、hero、title；description 只以家族名「數位轉型（DigiLism）」出現。#186：兩組類別詞在「這頁承接的查詢」改為次要，跟本項一致（第 14 項） |
| 2 | 刪掉最新文章與新聞，SEO 可能要保留，作為新內容的入口與站內連結 | 刪除；若 SEO 指得出首頁要承接的搜尋子題，再談換成和產品相關的精選文章 | 首頁每段要指到受眾任務或主張；blog 與媒體中心已在 header | 同意刪除。首頁承接的查詢裡沒有要靠文章回答的子題；新站有 sitemap（`src/integrations/sitemap.ts`），header 也連到 `/blog`，文章不靠首頁才被找到。資訊型查詢的文章（見 `digirunner.md`「取捨」的「三件待決事項」）寫好後，由產品頁與產業頁連過去，比首頁的「最新文章」更貼主題 | 採納。刪除，不換成精選文章 |
| 3 | h1 要不要含「昕力資訊」品牌詞 | 可以，只要同一句仍說出服務對象與做的事；品牌詞放 eyebrow 也可以，交 SEO 決定 | 品牌導航型查詢（`昕力資訊`、`TPIsoftware`）由首頁承接，定位句也要在第一屏 | h1 不必含品牌詞。品牌查詢靠 title 開頭的公司名、首頁的 `Organization` 結構化資料與 logo 對應；h1 留給定位句，字數才夠寫服務對象與做的事。公司名改放 hero 說明的第一句，用 messaging 規定的首次並列寫法「昕力資訊（TPIsoftware）」，讓品牌詞出現在第一屏的可讀文字裡 | 採納。h1 寫定位句，不含品牌詞；hero 說明第一句寫「昕力資訊（TPIsoftware）」，已寫進第 1 段的目的。不用 eyebrow（`design-principles.md` P1） |
| 4 | 「企業主權 AI 地端部署 方案」可能要求首頁加 AISO 段 | 不加；第 4 段 OrientAI 的資料主權主張已涵蓋，AISO 由 `/aiso` 承接 | `search-intent.md`「對應到頁面」把這組指給 `/aiso`；首頁再開一段會跟 OrientAI 重複 | 同意。#165 版第 6 段的 AISO 服務卡片錨點用節點名「AISO 主權 AI」，讓這組查詢的用詞出現在連往 `/aiso` 的連結上 | 採納不加 AISO 段。#186 更新：5 段版沒有服務卡片（第 8 項），首頁不連 `/aiso`，由 header 的「服務」選單連入 |
| 5 | 品牌詞的前幾名是新聞（上櫃、財報、與群聯的合作），首頁要不要回應 | 不回應 | 新聞內容不在事實庫，媒體與投資人的任務也未定（`audience-and-goals.md` 問題 1）；首頁每段要指到主要受眾的任務或主張 | 不回應。這些是媒體寫的公司近況，不是事實庫的事實，也不是主要受眾的任務；`/media-center` 在 header 的「公司」選單裡。首頁只確保公司名、服務對象、做的事在 title、description、第一屏寫清楚 | 採納。首頁不設新聞或公司近況段 |
| 6 | `search-intent.md`「對應到頁面」把 `系統整合 廠商 推薦` 指給 `/services`，但 `/services` 依 #138 不產生頁面 | 首頁不承接；同意暫交 `/cloudservice` | 現有服務頁裡，`/cloudservice` 的 description 明寫系統整合；`search-intent.md` 列的次要頁 `/outsourcing` 寫的是顧問與人力駐點，離「系統整合」更遠。`DM-4`（產品與導入同一家）加「系統整合」會把主張改成通用的 SI 說法 | 暫由 `/cloudservice` 次要承接（它的 description 寫了系統整合），`/services` 上線後改指。首頁不承接，也不加「系統整合」字樣。`search-intent.md` 的對應表要不要跟著改，交主 session | 採納。首頁不承接，第 1 段說明句（`DM-4`）不加「系統整合」字樣；暫由 `/cloudservice` 次要承接，`/services` 產生頁面後改指 `/services`。`search-intent.md` 的對應表已在 #165 更新 |
| 7 | 第 4 段連到產品頁時，digiRunner 只寫產品名 | 同意帶類別詞 | 節點名本來就是「digiRunner API 管理平台」，與 messaging 的統一用詞「API 管理平台」一致，不必另寫 | 連到 digiRunner 的錨點寫「digiRunner API 管理平台」，不只寫「digiRunner」：單獨查 `digiRunner` 的前幾名是同名遊戲（`search-intent.md`「digiRunner」），帶類別詞的錨點讓連結本身說清楚是 API 產品。其他產品照節點名稱 | 採納。產品錨點用節點名稱（含類別詞），已寫進第 4 段與連出表 |
| 8 | #166 使用者決定首頁精簡成 5 段，#165 的段落表是 8 段 | 照 5 段改寫段落表，8 段的內容併進 5 段或移到已有的頁面，不新增頁面 | 品牌形象網站的驚豔感要求每段一句標題加最多一句說明（`design-principles.md`「定案」）；細節放產品頁、產業頁讀者才找得到。對照：#165 的第 1 段 → 第 1 段；第 2 段 → 第 2 段（拿掉段落引言）；第 3 段 → 第 3 段；第 4 段產品家族與第 5 段 OrientAI → 第 4 段；第 6 段產品與導入 → 第 1 段的說明句（`DM-4`）；第 7 段穩定度與第 8 段聯絡 → 第 5 段。移出首頁的內容：四個家族各一句說明與事實由 `/products` 與各家族頁承接；OrientAI 的權限、Token、離線等特色由 `/orient-ai` 承接；服務卡片由 header 的「服務」選單承接；子公司、國際品牌、Google Cloud 合作夥伴由 `/about-us` 承接 | 同意。5 段版在 #168 的 SEO 是 4.2，沒有項目低於 3，承接的查詢都還有段落回答。代價是兩處涵蓋變少，接受：一、`昕力資訊 官網` 的「四條產品線」，家族名只出現在 description 與 footer（new-home S2）；這組是導航型，查的人要的是官網本身，第 4 段的 h2 與 4 個產品名已說出四類產品。二、首頁不再連家族頁與 `/products/gadoscout`，它們由 header 的「產品」選單與 `/products` 連入，不會成為孤立頁。連出表已照 5 段改寫，new-home S5 指出的「連出表還要求 gadoScout」不再發生 | 照 5 段。段落表、CTA 表、連出表已改寫；#167 在 brief 開頭加的「製作階段的版本」刪除，內容併進本列 |
| 9 | messaging `DM-2` 在 #186 拿掉 `fact:fraud-platform-result`（原文沒提到 AI），第 3 段的阻詐那則怎麼處理 | 換成 `fact:smartfilling-case-bank-title` 與 `fact:smartfilling-case-bank`（金融業以 AI 取代傳統二登流程），連到 `/industries/finance`，錨點「金融業的 AI 應用」 | 第 3 段的 h2 寫「AI 已用在每天的作業」，三則都要有寫出 AI 的原文（new-home C3）。維持三則：桌機 3D 版的停留長度、三張近景圖與 `count` 都照三則設計，改成兩則要改場景；換上的這則是事實庫裡唯一點出「金融業」、又寫出 AI 與成果的事實，連到金融頁也讓首頁的 AI 段多一條往產業頁的路。它和第 2 則同屬 AI 智慧建檔，但作業不同（醫療單據、銀行的二登流程），連結也不同 | 同意。換上的這則同時回答 `台灣 AI 解決方案 公司` 前幾名都沒有的「導入後的成果」（`search-intent.md` 列的就是 `fact:smartfilling-case-bank`）。連結用錨點「金融業的 AI 應用」連到 `/industries/finance`，讓首頁多一條描述性錨點的連入給金融頁的主要承接查詢 `金融業 AI 應用`；第 3 段不再連 `/success-story`，少了一條錨點與目標不符的連結 | 換成 `fact:smartfilling-case-bank`。名稱照事實原文；名稱在近景圖的標籤上放不下時，#187 可以改用不含數字與客戶名的短名（表述），原文照引。阻詐平台移到金融頁第 8 段的案例（`finance.md`「取捨」第 13 項）。`design-principles.md` P2「版面」舉例的事實跟著改 |
| 10 | header 寫「聯絡我們」，頁面按鈕寫「聯絡業務」（new-home C4、five-second-new） | 全站的聯絡按鈕統一叫「聯絡業務」：header 的常駐按鈕、hero、頁尾。聯絡頁本身的名稱（h1、footer 的連結、麵包屑）維持節點名「聯絡我們」 | 主要轉換是聯絡業務（`audience-and-goals.md`），按鈕寫出下一步是找業務，決策者不必猜會連到誰；`design-principles.md` P4 也規定 header 的動作是「聯絡業務」。5 秒測試困惑的是兩個按鈕名稱不同，統一按鈕就解決。頁面名稱不改：改節點名要動 `nodes.csv`、詞彙表與三語導覽，聯絡頁的表單也不只收業務需求 | 同意。全站連到 `/contact-us` 的按鈕錨點變成「聯絡業務」，寫的是點下去要做的事，仍描述得出目標頁；聯絡頁的 title、h1 維持「聯絡我們」，跟錨點不同不影響 S3、S5（錨點描述目的，不必和目標頁 title 同字）。footer 與麵包屑的「聯絡我們」照節點名，同一頁兩種錨點可以並存 | 「聯絡業務」。#187 改 `navigation.csv` 的 `utility` 列名稱與 en、vi 譯名；`messaging.md`「統一用詞」已加這一列 |
| 11 | h1 的「原地接上」沒有事實撐住（new-home C3） | 保留。「原地接上」是表述，說的是 `IT-4`「接上既有系統，不必先汰換」 | `IT-4` 有已確認的證據：`fact:digilism-protocol-integration`（處理核心銀行系統或過時大型機的資料轉換，可代替 ESB）、`fact:digirunner-nginx-waf`（可整合現有的 WAF）。hero 依 P1 只放 h1、說明句與動作，不放證據點；證據在第 2 段的產業入口與產業頁。h1 是 #166 使用者選定的原型文字 | 同意保留。h1 寫服務對象（金融與政府）與做的事（API 與 AI），跟 title「金融與政府的 API 與 AI 軟體」、description 的「替金融與政府把 API、資料與 AI 安全接進既有系統」用詞一致，new-home S3 給 5 分。「原地接上」也碰到 `企業數位轉型 軟體公司` 前幾名都沒有的「既有核心系統怎麼接上新系統」 | 保留 h1。依據寫進第 1 段的「依據」與「事實」欄，畫面上不引用 |
| 12 | 第 4 段的 4 個產品是哪 4 個（new-home「評審依據不足」第 2 項） | 照 production：digiRunner API 管理平台、SysTalk.VIKI 企業生成式 AI 應用平台、gadoDIDO 無密碼身分驗證、GreenSwift 智慧碳管理平台 | h2「API、AI、資安與碳管理，各有產品」一個問題配一個產品，四個產品分屬四個產品家族（DigiLism、SysTalk.ai、GadoSecurity、ESGswift），也就是 `fact:products-families` 的四個家族。每個家族挑有產品頁、而且有 messaging 主張的那一個：digiRunner 是 `IT-4`、`IT-6` 與試點頁；SysTalk.VIKI 是 SysTalk.ai 家族裡的生成式 AI 平台（`IT-8`）；gadoDIDO 有 FIDO 認證（`IT-2`）；GreenSwift 是 `DM-7`。不列家族頁：GadoSecurity 家族頁不產生（#138），四個家族裡只有三個能連。不列 gadoScout：資安只放一個，gadoDIDO 的證據較多。OrientAI 在同一段後半另有一條帶，不重複列 | 同意。4 個產品的錨點是節點名稱，都帶類別詞（取捨第 7 項）；digiRunner 是試點產品頁，從首頁連入對它最重要。不列 gadoScout 時，它由 header 與 `/products` 連入，不是孤立頁 | 照 production 的 4 個，順序對應 h2 |
| 13 | 一句話的產品描述算事實還是表述（old-home「評審依據不足」第 4 項） | 寫出產品做什麼就是事實，要引用事實原文；節點名稱的類別詞不算描述 | 規則寫在 `messaging.md`「一句話的產品描述算事實」。第 4 段只放節點名稱，不放描述句，所以這段沒有要引用的事實；第 2 段產業入口的那一句是事實原文 | 同意。節點名稱已帶類別詞（API 管理平台、企業生成式 AI 應用平台、無密碼身分驗證、智慧碳管理平台），錨點本身就說得出產品是什麼，不靠描述句也能回答 S5「錨點描述目標頁」 | 第 4 段不加描述句。之後要加時，每句引用事實 |
| 14 | 「這頁承接的查詢」把 `台灣 AI 解決方案 公司`、`企業數位轉型 軟體公司` 標成主要，取捨第 1 項卻決定類別詞不進 title；`rubrics/seo.md` S3 的 5 分要 title 含主要查詢的用詞（current-home「評審依據不足」第 2 項） | —（SEO 的承接分類，交 seo-strategist） | — | 兩組改為次要，title 照取捨第 1 項不放類別詞。理由：一、兩組的前幾名是定義文、國際廠商方案頁與新聞，沒有廠商列表，首頁跟它們的頁面類型不同，title 放類別詞對不上這組的意圖，反而讓品牌導航的 title 變模糊（第 1 項的理由）；二、「數位轉型」「解決方案」是 messaging 限定用法，放進 title 就得用成類別描述；三、新站沒有比首頁更適合的頁，所以寫成「沒有主要承接頁、首頁次要」，用 description 的家族名與第 1、3 段回答，S2 仍照 `search-intent.md` 的子題評。改成在 title 放類別詞的另一條路不採用 | 兩組改為次要（沒有主要承接頁）；title 照現行，不放類別詞。「這頁承接的查詢」、段落後的說明與 title 方向已改。`search-intent.md`「對應到頁面」仍把兩組指給 `/`，那一欄是推論，要不要加註「次要」交主 session |

## 待確認

| # | 事項 | 卡在哪 | 影響的段落 |
|---|---|---|---|
| 5 | 金融與政府的排序 | `audience-and-goals.md` 問題 2，M2-01 暫定金融、政府、製造業 | 1、2 |

### 已結算（#180）

其餘項目在 #180 結算（使用者決定，2026-11-02），編號保留：

| # | 事項 | 結果 |
|---|---|---|
| 1 | 獎項能不能放首頁（`fact:award-taiwan-excellence-2023`、`fact:award-taiwan-excellence-2024`、`fact:award-gartner-cool-vendor-2018`） | 改為 `confirmed`，第 5 段可以加獎項，寫出年份。證言照 #165 可以直接加；委外服務頁國泰摘錄的「最佳技術」（`fact:testimonial-cathay-fhc-excerpt`）不用。#183 照 `messaging.md` 的 `DM-6`、`DM-8` 放了 FT 2022 與台灣精品獎 2024；Gartner 2018 不用（理由見 `DM-8`），台灣精品獎 2023 與 2024 的得獎產品重疊，首頁只放 2024 |
| 2 | 規模數字（`fact:company-employees-630`、`company-projects-400`） | 員工數改為 `confirmed`，原文寫出 2020 年，第 5 段可以用（#183 已放）。專案數那句沒有年份，維持 `to_confirm`、不用（使用者決定） |
| 3 | 製造業之後要不要回到首頁 | 現站沒有製造業內容，不處理。hero 與產業入口維持不點名製造業（#165） |
| 4 | 聯絡後多久回覆 | 現站沒有資料，不處理。聯絡段不寫回覆時間 |
| 6 | GadoSecurity 家族介紹 | 現站沒有資料，不處理。家族頁維持 draft，第 4 段只列 gadoDIDO 的產品頁 |
