# Content brief：AI 智慧建檔解決方案 `/solutions/smartfilling`（#199）

- 模板：`offering`（`kind: solution`）；內容檔：`src/content/offering/zh-TW/smartfilling.md`；節點 `smartfilling`，parent `family-ai`
- 主張 id 指 `docs/strategy/messaging.md`；事實的寫法見 `content-strategy` skill「引用事實的寫法」，只用 `docs/strategy/facts.yaml` 裡 zh-TW、`status: confirmed` 的條目
- 版型與 `layout` 值照 `docs/strategy/design-principles.md`「內頁的版型」與 `src/content.config.ts` 的 `pageSection`
- 狀態：#199 策略階段。content-strategist 初稿，seo-strategist 補了「搜尋意圖」「內部連結」「title 與 description 方向」與「取捨」的意見欄、最後決定，之後等 `strategy-approved`

## 受眾與任務

依 `docs/research/audience-and-goals.md`「受眾分群」。現站的案例是金融業：

| 受眾 | 來這頁做什麼 | 這頁要讓他做到的事 |
|---|---|---|
| 決策者（銀行、保險的數位金融與營運主管、CIO），主要 | 確認紙本文件建檔能不能交給 AI、有沒有金融業的成果；決定要不要聯絡業務 | 第 2 段讀到兩則成果原文，第一則寫明是金融業；找得到聯絡業務 |
| IT 主管、專案負責人，主要 | 確認文件版型一直變時要不要重建模板、辨識結果怎麼進內部系統、模型上線後誰維護 | 第 3 段讀到免模板與自建模型；第 4 段看到從收件到介接的接點；第 5 段讀到再訓練機制 |

主要轉換：聯絡業務（內容檔 `cta: contact`）。

## 搜尋意圖

依 `docs/strategy/search-intent.md`「AI 智慧建檔解決方案 `/solutions/smartfilling`」。沒有 Search Console 數據，取捨只依受眾與頁面主題，不依搜尋量。和 `/products/systalk-icr` 的分工見「取捨」第 4 項：本頁承接「文件建檔這件作業」的查詢，ICR 頁承接辨識技術本身的查詢。

### 這頁承接的查詢

| 查詢 | 意圖類型 | 承接 | `search-intent.md` 的條目 |
|---|---|---|---|
| `AI OCR 文件辨識 自動建檔` | 商業型（找工具） | 主要。前幾名缺的金融業二登與委外建檔由第 2 段回答，人工校對回饋再訓練由第 2 段第一則與第 5 段回答，擷取後整合內部系統由第 4 段回答 | 「AI OCR 文件辨識 自動建檔」 |
| `昕力 智慧建檔 SysTalk.ICR` | 導航型，前幾名是新聞 | 主要；次要 `/products/systalk-icr`。前幾名沒有「智慧建檔」這個詞本身，h1 與 title 都有；前幾名缺的建檔流程與金融業案例由第 2、4 段回答。SysTalk.ICR 的名稱出現在 hero 證據點與第 5 段的原文 | 「昕力 智慧建檔 SysTalk.ICR」 |
| `銀行 文件 數位化 手寫 辨識 開戶 申請書` | 資訊型偏商業型 | 次要，沒有主要承接頁；另一個次要是 `/industries/finance`。第 2 段第一則（金融業的二登流程）回答前幾名缺的台灣銀行業導入成效，第 4 段回答辨識結果介接內部系統；原文沒寫開戶，不寫成開戶申請書（「不能寫的句子」），所以只算次要 | 「銀行 文件 數位化 手寫 辨識 開戶 申請書」 |
| `OCR 辨識率 提升 模型 再訓練` | 資訊型（技術做法，讀者偏工程師） | 次要，沒有主要承接頁。前幾名是工程師自己微調模型的教學；第 5 段寫前幾名都沒有的「企業自己再訓練」與自動增加訓練資料，回答一部分。SysTalk.PUZZLE 再訓練機制的原文在本頁（`fact:smartfilling-icr-puzzle`），所以次要給本頁，不給 ICR 頁 | 「OCR 辨識率 提升 模型 再訓練」 |
| `免模板 OCR 辨識` | 資訊型偏比較型 | 次要；主要 `/products/systalk-icr`。第 3 段寫自建模型不必依版型建模板，第 4 段寫前幾名缺的影像前處理 | 「免模板 OCR 辨識」 |
| `智慧文件處理 IDP 是什麼` | 資訊型（定義） | 次要。本頁不寫定義；第 3 段回答「與範本式自動化的差異」，第 5 段回答前幾名缺的「企業自己再訓練模型」。定義建議交文章（「建議新增」） | 「智慧文件處理 IDP 是什麼」 |

### 不由這頁承接的查詢

| 查詢 | 交給 | 理由 |
|---|---|---|
| `免模板 OCR 辨識`（主要） | `/products/systalk-icr` | 免模板是辨識技術的特性，ICR 頁的節點名就是「光學字元辨識」（取捨第 4 項） |
| `ICR OCR 差別` | 建議新增的 blog 文章；次要 `/products/systalk-icr` | 名詞比較的問題型查詢，前 10 筆全是英文；產品頁不寫定義（取捨第 9 項） |
| `智慧文件處理 IDP 是什麼`（主要） | 建議新增的 blog 文章 | 定義型，前幾名是大廠的定義頁（取捨第 9 項） |
| `醫療理賠 診斷書 OCR 辨識` | `/solutions/smartclaim` | 理賠情境由理賠頁寫；本頁第 2 段第二則雖是醫療單據，作業是建檔，不是理賠 |

## 這頁要讓讀者相信什麼

AI 已經用在金融業的文件建檔，委外成本與維運人力的成果寫得出來（`DM-2`）；辨識模型是昕力自建的，不必依版型建模板（`IT-8`）；文件變了，企業自己就能再訓練模型（`IT-9`）。SysTalk.ICR 是 SysTalk.ai 家族的產品，其他部門的 AI 需求在家族頁找得到（`DM-9`）。

## 段落結構

順序照讀者的判斷：這是什麼、做得到嗎、版型變了怎麼辦、怎麼接進內部系統、上線後誰維護。

「影像」欄照 `design-principles.md`「內頁共用的規則」。介面片段（`data-ui`、標「示意」）只畫事實寫得出的功能名稱、設定項目與狀態名稱，不畫筆數、辨識率、時間與曲線。

| # | 段落 | 目的 | 依據（受眾任務／主張 id） | 搜尋子題 | 事實 | 預估長度 | 版型（`layout`） | 影像 |
|---|---|---|---|---|---|---|---|---|
| 1 | Hero：紙本文件辨識後直接建檔 | h1 是節點名「AI 智慧建檔解決方案」，上方不放小標，屬於 SysTalk.ai 由麵包屑表示。tagline 寫用途（紙本文件的辨識與建檔），說明句寫對象（金融業的收件與建檔流程）。一則證據點：自建的辨識模型與再訓練機制。一個動作：聯絡業務 | 決策者任務「確認是不是我要找的方案」；`IT-8`、`IT-9`；主要轉換 | `昕力 智慧建檔 SysTalk.ICR`：前幾名沒有「智慧建檔」這個詞本身；`AI OCR 文件辨識 自動建檔`：類別詞 | `fact:smartfilling-icr-puzzle` | tagline 15–25 字；說明 30–50 字；證據點 1 則 | 第一屏（不屬於 10 種版型，照「內頁共用的規則」的第一屏） | 同一個世界渲染的靜態圖，要新做 `page-smartfilling.webp`（`scripts/design/ribbon-capture.mjs`）。HTML 標籤用第 4 段事實的用詞：基金配息單、居留證（`legacy`）、AI 智慧建檔解決方案（`product`）、內部系統（`service`）。不載 3D |
| 2 | 金融業與醫療單據的建檔成果 | 兩則成果，一則一列：作業名稱與成果原文在同一則，數字加粗。金融業那則排第一（受眾的產業），作業名稱用案例標題，讓讀者知道是金融業（`DM-2` 寫法）；第二則是首頁同一則案例，作業名稱與成果一起出現。引言一句寫讀者得到什麼 | 決策者任務「AI 做得到嗎」「找成功案例」；`DM-2`；第一則的三校反饋也支撐 `IT-9` | `銀行 文件 數位化 手寫 辨識 開戶 申請書`：前幾名缺台灣銀行業的導入成效（這則是二登流程，不寫成開戶申請書）；`昕力 智慧建檔 SysTalk.ICR`：前幾名沒有金融業的案例；`AI OCR 文件辨識 自動建檔`：金融業的二登與委外建檔 | 第一則 `fact:smartfilling-case-bank-title`、`fact:smartfilling-case-bank`；第二則 `fact:smartfilling-title`、`fact:smartfilling-result` | 引言 30–50 字；每則照原文 | 成果（`results`），2 則 | 每則一張介面片段。片段 1：辨識結果介接內部系統，列是二登流程（`off`）、AI 辨識（`on`）、三校反饋再學習（`on`）、介接內部系統（`next`），用詞取自 `fact:smartfilling-case-bank`。片段 2：醫療單據的免模板辨識，列是醫療單據、免模板辨識（用詞取自 `fact:smartfilling-result`） |
| 3 | 文件版型變了，不必重建模板 | 自建的 AI 演算法模型改良 OCR 坐標定位的限制，不必依版型建模板；模型依企業需求建構。寫機制，不寫辨識率 | IT 主管任務「確認版型變動時要做什麼」；`IT-8` | `免模板 OCR 辨識`：模板式 OCR 遇版面變動就失準（次要，主要承接 `/products/systalk-icr`）；`ICR OCR 差別`：改善傳統 OCR 辨識困難（次要）；`智慧文件處理 IDP 是什麼`：與範本式自動化的差異（次要） | `fact:smartfilling-template-free`、`fact:smartfilling-custom-model` | 說明 40–60 字；事實 2 則 | 介面片段（`ui`） | 介面片段 3：辨識設定面板，列是依文件版型建立模板（`off`）、AI 演算法模型（`on`）（用詞取自 `fact:smartfilling-template-free`）。畫出的接點：同一個模型處理不同版型的文件 |
| 4 | 從收件到內部系統：前處理、辨識、校正 | 說明句寫機制：基金配息單、居留證這類收件文件，先經前處理校正影像瑕疵與色彩，辨識後用 AI 文本分析校正資料，減少手動登打。清單照原文，每段 2–6 項 | IT 主管任務「確認接得上既有系統」；`DM-2`（`fact:smartfilling-documents` 原文寫 AI + OCR） | `AI OCR 文件辨識 自動建檔`：擷取後整合內部系統；`免模板 OCR 辨識`：影像歪斜、陰影的前處理（前幾名沒有）；`銀行 文件 數位化 手寫 辨識 開戶 申請書`：辨識結果介接內部系統（前幾名沒有） | `fact:smartfilling-documents`、`fact:smartfilling-preprocessing`、`fact:smartfilling-text-analysis`、`fact:smartfilling-less-keying` | 說明 40–60 字；清單 4 項 | 接點圖（`junction`） | SVG 三欄：左（`legacy`）基金配息單、居留證；中（`product`）AI 智慧建檔解決方案、前處理、AI 文本分析；右（`new`）內部系統。用詞取自本段事實與 `fact:smartfilling-case-bank` 的「介接內部系統」 |
| 5 | 模型由企業自己再訓練 | SysTalk.ICR 加上再訓練機制，企業自主維運優化模型；內建自動增加訓練資料，模擬不同情境影像。表述寫「自己再訓練」「自主維運」，不加百分比，不寫「完全不需要外部」（`IT-9` 寫法） | IT 主管任務「確認上線後維運得動」；`IT-9` | `OCR 辨識率 提升 模型 再訓練`：企業不寫程式就能再訓練（前幾名都是工程師自己訓練）；`智慧文件處理 IDP 是什麼`：企業自己再訓練模型（前幾名沒有） | `fact:smartfilling-flow`、`fact:smartfilling-data-augmentation` | 說明 40–60 字；事實 2 則 | 介面片段（`ui`，`flip: true`，和第 3 段左右對調） | 介面片段 4：模型再訓練面板，列是自動增加訓練資料（`on`）、模擬不同情境影像（`on`）、再訓練（`next`）。只畫功能與狀態名稱，不畫辨識率曲線 |
| 6 | 相關產品 | SysTalk.ICR 的產品頁（辨識技術本身）與金融產業頁。一列一項：名稱、一句、連結。一句由各頁自己的 description 或表述寫，不另引用事實 | `DM-9`（SysTalk.ICR 屬於 SysTalk.ai 家族）；決策者任務「了解產品與方案」 | `昕力 智慧建檔 SysTalk.ICR`、`免模板 OCR 辨識`（主要或次要 `/products/systalk-icr`）；`銀行 文件 數位化 手寫 辨識 開戶 申請書`（次要 `/industries/finance`） | 無 | 2 列 | 索引列（現有 `pageSection` 沒有，見「schema 缺口」） | 無 |
| 7 | 聯絡業務 | 頁尾的主要轉換，標題寫談文件建檔的下一步 | 主要轉換：聯絡業務 | — | 無 | 標題 10–20 字，說明 30–50 字 | 色帶（深紫），模板的 `ContactCta` | 無 |

### 照原文列清單的段落

第 4 段的清單與第 3、5 段的事實原文，寫法同 `briefs/digirunner.md`「照原文列清單的段落」：說明句寫讀者讀完得到的答案，不寫「以下列出」這類交代版面的句子。

### 不能寫的句子

| 段落 | 不能寫 | 為什麼 |
|---|---|---|
| 5 | 「100% 自主維運」「不需要任何第三方」 | 沒有依據（`IT-9` 寫法，「待確認」第 1 項） |
| 2 | 只放 `fact:smartfilling-case-bank` 的數字，不放案例標題 | 讀者看不出是哪個產業的成果（`DM-2` 寫法） |
| 2 | 把兩則的數字合成一句（例如「降低四成以上維運人力」） | 兩則是不同的作業，數字各有自己的原文，合併就是改寫事實 |
| 2 | 「銀行開戶申請書辨識」 | 第一則原文寫的是二登流程，沒寫開戶；開戶進件的數字是 `to_confirm`（「待確認」第 2 項） |
| 1 | 「技術與商業模式領先市場」 | 現站的介紹段標題，沒有比較依據，不在事實庫（`unmigrated.md`「第一批 7 頁沒收的句子」） |

### 與現有頁面的差異

對照現有的 `src/content/offering/zh-TW/smartfilling.md`：

| 現有 | 處理 | 理由 |
|---|---|---|
| title「SysTalk.ai AI 智慧建檔解決方案」 | h1 改用節點名「AI 智慧建檔解決方案」；`<title>` 交 seo-strategist | 家族名由麵包屑表示 |
| tagline「AI＋OCR 前所未有的資料建檔體驗」 | 改寫，寫用途與對象 | 「前所未有」是沒有依據的說法，也沒說出用在哪 |
| description（現站 meta description） | 交 seo-strategist | |
| features 4 項 | 前處理移到第 4 段，企業專屬 AI 模型移到第 3 段，資料增強移到第 5 段；第 4 項「內部自主訓練維運」整句不用 | 第 4 項的原文含未確認的百分比（「待確認」第 1 項）；它要說的再訓練由第 5 段的兩則已確認事實說 |
| useCases「金融業應用－傳統文件數位化管理第一步」（`industry: finance`） | 移到第 2 段第一則成果 | 這則有成果原文，照「成果」版型寫；連到金融產業頁改由第 6 段的索引列 |
| 現站沒搬的介紹段、「流程架構」、三項優勢（`unmigrated.md`） | 放回第 1、4、5 段 | 事實已收進事實庫，各對應一個受眾任務 |
| 現站的頁尾導流到 DigiLism | 不放 | 指不到這頁的受眾任務 |

## CTA

| CTA | 文案方向 | 位置 | 連到 |
|---|---|---|---|
| 主要：聯絡業務 | 按鈕寫「聯絡業務」（全站同名）；第 7 段的標題談文件建檔 | 第 1 段 hero（實心按鈕）、第 7 段 | `/contact-us`（`contact`） |
| 次要：相關產品 | 錨點寫目標頁的內容（錨點由 seo-strategist 定） | 第 6 段 | `/products/systalk-icr`、`/industries/finance` |

hero 不放次要按鈕：這頁沒有試用或 demo 的事實與入口。

## 內部連結

路徑取 `docs/ia/nodes.csv`，只列會產生頁面的節點。錨點文字寫目的地是什麼，不用「了解更多」；連到產品頁時用節點名。麵包屑沿 `parent` 連到 `/products` 與 `/products/systalk-ai`，模板產生，不必另寫。

### 連出

| 段落 | 連到 | 建議錨點文字 | 說明 |
|---|---|---|---|
| 1、7 | `/contact-us` | 聯絡業務 | 主要轉換，全站同名 |
| 6 | `/products/systalk-icr` | SysTalk.ICR AI 智慧光學字元辨識 | 節點名。`免模板 OCR 辨識` 的主要承接頁，這個連結把查辨識技術的讀者送過去，是兩頁分工的一半（取捨第 4 項）；也表示 SysTalk.ICR 屬於同一個家族（`DM-9`，取捨第 3 項） |
| 6 | `/industries/finance` | 金融業的 AI 應用 | 第 2 段第一則是金融業的案例；首頁第 3 段連金融頁也用這個錨點，兩處指的都是金融頁第 4 段。取代拿掉 `useCases` 後的 `industry: finance` 反查（取捨第 7 項） |

### 連入

| 從 | 建議錨點文字 | 狀態 |
|---|---|---|
| header「產品」選單的 SysTalk.ai 欄 | 節點名「AI 智慧建檔解決方案」 | 已有 |
| 首頁第 3 段（AI 成果） | AI 智慧建檔解決方案 | 首頁 brief 已列（`home.md`「內部連結」第 3 段） |
| `/industries/finance` 第 4 段 | AI 智慧建檔解決方案 | 金融頁 brief 已列 |
| `/products/systalk-ai` 第 6 段的索引列 | 節點名 | 本批 `systalk-ai.md`「內部連結」已列 |
| `/products/systalk-icr` | AI 智慧建檔解決方案 | 建議：ICR 頁改版時，在講建檔應用的地方連過來，是分工的另一半（取捨第 4 項）。不在 #199 範圍 |

### 建議新增

| 頁面 | 位置 | 理由 |
|---|---|---|
| ICR、OCR 與智慧文件處理（IDP）的 blog 文章 | `/blog/{slug}`（新的 `blog-post`，分類建議 `blog-ai`） | 承接 `ICR OCR 差別` 與 `智慧文件處理 IDP 是什麼`：前者前 10 筆全是英文，後者是大廠定義頁，繁中台灣情境（金融業文件、企業自己再訓練）都沒有人寫。文章寫通用概念，加上 SysTalk.ICR 與本頁已確認的功能，不需要新事實。文章填 `relatedOfferings: [zh-TW/systalk-icr]`，內文連到本頁；本頁的段落表沒有相關文章段，不靠反查列出。另開 issue（取捨第 9 項） |

## title 與 description 方向

規則照 `seo-checklist`「每頁必備」：zh-TW title 約 20–32 個全形字（含後綴「｜TPIsoftware 昕力資訊」，後綴約佔 11 字），description 約 60–80 個全形字；半形英數約算半個全形字。

### title

- h1 改成節點名「AI 智慧建檔解決方案」後，頁面主題加後綴約 20.5 字，剛到下限。建議用 `seoTitle` 加上「OCR 文件辨識自動建檔」；h1 維持節點名
- 要涵蓋：節點名（含「智慧建檔」，`昕力 智慧建檔 SysTalk.ICR` 的前幾名沒有這個詞）、「OCR 文件辨識」與「自動建檔」（`AI OCR 文件辨識 自動建檔`）
- 傳達的主張：`DM-2`、`IT-8`。「OCR 文件辨識」「建檔」的依據是 `fact:smartfilling-documents`（AI + OCR 用在收件流程）與 `fact:smartfilling-less-keying`
- 不放：「免模板」「ICR」「光學字元辨識」（ICR 頁的詞，取捨第 4 項）、「SysTalk.ai」、「金融」（第 2 段第二則是醫療單據，title 放「金融」會窄掉；金融是金融頁的詞）、「前所未有」「領先」
- 示例（含後綴）：
  - `AI 智慧建檔解決方案：OCR 文件辨識自動建檔｜TPIsoftware 昕力資訊`（約 31.5 字）
  - `AI 智慧建檔解決方案｜TPIsoftware 昕力資訊`（不加 `seoTitle` 的做法，約 20.5 字）

### description

- 要涵蓋：自建的 AI 模型、不必依版型建模板、基金配息單與居留證這類收件文件、前處理與文本分析、介接內部系統、企業自己再訓練
- 傳達的主張：`IT-8`、`DM-2`、`IT-9`
- 依據的事實：`fact:smartfilling-icr-puzzle`、`fact:smartfilling-template-free`、`fact:smartfilling-documents`、`fact:smartfilling-preprocessing`、`fact:smartfilling-text-analysis`、`fact:smartfilling-case-bank`、`fact:smartfilling-flow`
- 不寫：成效數字（兩則成果的數字只跟各自的作業名稱一起出現在第 2 段，`DM-2` 寫法）、「100% 自主維運」（「待確認」第 1 項）、「開戶」（「待確認」第 2 項）、「免模板」這個詞（寫機制「不必依版型建模板」，詞留給 ICR 頁）
- 現行 description 的「獨家 Puzzle 自適應 AI 模型」不是事實原文的說法，要重寫
- 示例：
  - `AI 智慧建檔解決方案以自建的 AI 模型辨識基金配息單、居留證等文件，不必依版型建模板，經前處理與文本分析校正後介接內部系統；文件變了，企業可以自己再訓練模型。`
  - `金融業收件的基金配息單、居留證等文件，AI 智慧建檔解決方案先校正影像再辨識，以 AI 文本分析校正資料後介接內部系統，減少手動登打；模型由企業自己再訓練。`

## schema 缺口

offering schema（`src/content.config.ts`）已有 `heroLead`、`heroPoints`、`heroLabels`、`sections`（`pageSection`），`results` 的每一則可以帶自己的 `fragment`。

| 段落 | 缺什麼 | 新增的欄位 | 型別 |
|---|---|---|---|
| 6 | `pageSection` 沒有獨立的索引列；`ui` 的 `index` 只能掛在介面片段段落底下 | `pageSection` 加一種 `layout: 'index'` | 和 `briefs/smartclaim.md`「schema 缺口」第 7 段同一個型別：`{ layout: 'index'; id?: string; heading: string; items: { node: string; body?: string }[] }` |
| — | 內容檔沒有 `facts`，`facts.mjs` 不檢查這頁的數字（現有 useCases 已有 52%、45%） | `facts`（共用欄位已有） | 照段落表列出的 13 則補上 |

## 取捨

第 1–7 項是 content-strategist 寫的，第 8–9 項是 seo-strategist 加的（`search-intent.md`「待 seo-strategist 決定的事」跟這頁有關的條目）。兩方意見相同的項目，最後決定照 content-strategist 的立場；第 4 項的關鍵字分工與第 8–9 項由 seo-strategist 定案。

| # | 項目 | content-strategist 的立場 | 理由 | seo-strategist 的意見 | 最後決定 |
|---|---|---|---|---|---|
| 1 | 段數 | 7 段：hero、4 個事實段、索引列、聯絡色帶 | 這頁有 13 則 zh-TW confirmed 事實（11 則來自現站建檔頁、2 則是首頁同一則案例的作業名稱與成果），全部用上。hero 放 1 則；其餘 12 則分成 4 段：成果 4 則（兩則作業各一組名稱與成果）、免模板 2 則、收件到介接 4 則、再訓練 2 則，每段至少 2 則 | 同意。6 組查詢的子題都對得到第 2–5 段；不加定義段（第 9 項） | 採納，7 段 |
| 2 | 介面片段 4 張 | 第 2 段 2 張、第 3 段 1 張、第 5 段 1 張，加上 hero 的靜態圖與第 4 段的 SVG | 符合「內頁共用的規則」的至少 4 張。四張都只畫原文裡的功能與狀態名稱 | 對搜尋沒有影響。片段裡的功能名稱是 HTML 文字，用詞照事實原文即可 | 採納 |
| 3 | `DM-9` 只靠第 6 段的索引列與麵包屑，不引用家族頁的事實 | 不引用 `fact:systalk-ai-products` | 這則原文把 SysTalk.Coach 的銷售情境和 SysTalk.ICR 的報支辨識寫在同一句，放在建檔頁要照原文整句引用，會多出一段和建檔無關的 Coach 文字。SysTalk.ICR 屬於家族由麵包屑與第 6 段的連結表示 | 同意。「SysTalk.ICR」這個名稱已在 hero 證據點（`fact:smartfilling-icr-puzzle`）與第 5 段（`fact:smartfilling-flow`）的原文裡，`昕力 智慧建檔 SysTalk.ICR` 的品牌詞涵蓋夠了；多一句 Coach 反而讓這頁的主題變散 | 採納 |
| 4 | 和 `/products/systalk-icr` 的分工（`search-intent.md` 留給 seo-strategist 的事） | 這頁只用建檔頁自己的事實，不搬 ICR 頁的事實；免模板在第 3 段寫，`免模板 OCR 辨識` 主要給 ICR 頁 | 建檔頁回答「文件建檔這件作業怎麼交給 AI」，ICR 頁回答辨識技術本身。兩頁的事實庫都有免模板與再訓練，各寫自己的原文；關鍵字分工由 seo-strategist 定 | 同意，關鍵字分工定案。本頁主要承接作業的查詢：`AI OCR 文件辨識 自動建檔`、`昕力 智慧建檔 SysTalk.ICR`；次要承接 `銀行 文件 數位化 手寫 辨識 開戶 申請書`、`OCR 辨識率 提升 模型 再訓練`、`免模板 OCR 辨識`、`智慧文件處理 IDP 是什麼`。ICR 頁主要承接辨識技術的查詢：`免模板 OCR 辨識`，以及文章寫好前的 `ICR OCR 差別`。用詞照這個分：本頁 title、h2 用「建檔」「文件辨識」「再訓練」，不用「免模板」「ICR」「光學字元辨識」當標題詞（第 3 段的 h2「不必重建模板」寫機制，可以保留）；ICR 頁改版時 title 用「ICR」「光學字元辨識」「免模板」，不用「建檔」。兩頁互相連結（「內部連結」） | 採納，分工如左 |
| 5 | 兩則成果的順序 | 金融業那則排第一 | 受眾是金融業的決策者；第一則有案例標題寫明是金融業，數字也較多。第二則是首頁同一則案例（醫療單據），首頁讀者點進來時對得上 | 同意。第一則的案例標題（`fact:smartfilling-case-bank-title`）與「介接內部系統」也是 `銀行 文件 數位化…` 與 `AI OCR 文件辨識 自動建檔` 前幾名缺的子題，排第一讀者先讀到 | 採納 |
| 6 | hero 的靜態圖要新做 | 新做 `page-smartfilling.webp` | `design-principles.md` 只寫了 digiRunner 與金融頁兩張；原則沒寫到其他產品頁怎麼做，這裡照 digiRunner 的做法提出，由設計概念階段確認 | 沒有 SEO 意見 | 新做。已由原則定案（#213）：`design-principles.md`「內頁共用的規則」影像 |
| 7 | 拿掉 `useCases` 後，金融產業頁不再依 `industry: finance` 反查到這頁 | 改由第 6 段的索引列連到 `/industries/finance` | 金融頁已在第 4 段以描述性錨點連過來，不靠反查；主 session 改模板時確認沒有其他頁依賴它 | 同意。索引列的錨點寫「金融業的 AI 應用」，比反查出來的產業名說得清楚 | 採納 |
| 8 | title 用什麼 | h1 用節點名，`<title>` 交 seo-strategist（「與現有頁面的差異」） | 家族名由麵包屑表示 | 用 `seoTitle`：「AI 智慧建檔解決方案：OCR 文件辨識自動建檔」。不帶「SysTalk.ai」，不用 ICR 頁的詞（第 4 項） | 定案，見「title 與 description 方向」 |
| 9 | 定義型查詢（`ICR OCR 差別`、`智慧文件處理 IDP 是什麼`）要不要用 blog 文章承接（`search-intent.md` 待決條目） | 沒有提；第 3 段把兩組列為次要子題 | — | 建議寫一篇文章承接兩組，另開 issue（「建議新增」）。本頁不加定義段，理由同 `digirunner.md`「取捨」第 3 項：產品頁的每段要指到受眾任務。兩組前幾名都沒有繁中台灣情境，文章有機會，但只能寫通用概念與已確認的功能 | 定案：只建議，不開新頁；本頁不加定義段 |

## 待確認

事實庫沒有這些內容，頁面不補、不寫成更強的說法：

| # | 事項 | 卡在哪 | 影響的段落 |
|---|---|---|---|
| 1 | 「100% 自主維運」（`fact:smartfilling-self-maintained`） | `to_confirm`：100% 沒有依據（`messaging.md`「缺少證據的主張」第 19 項） | 5 |
| 2 | 開戶進件的辨識與成果（`fact:systalk-icr-account-opening-40`） | `to_confirm`，出自 ICR 頁，沒有比較基準。`銀行 文件 數位化 手寫 辨識 開戶 申請書` 因此只能用二登流程的案例回答一部分 | 2 |
| 3 | 金融業案例的客戶名稱與案例頁 | 第 2 段第一則只有案例標題與成果，沒有客戶名，現站也沒有案例頁，所以照「成果」版型寫，不放進案例列 | 2 |

## 後續

- en、vi 版另做，照 `content-migration` skill「多語系內容」，不在這份 brief 的範圍
