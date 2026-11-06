# Content brief：AI 智能理賠解決方案 `/solutions/smartclaim`（#199）

- 模板：`offering`（`kind: solution`）；內容檔：`src/content/offering/zh-TW/smartclaim.md`；節點 `smartclaim`，parent `family-ai`
- 主張 id 指 `docs/strategy/messaging.md`；事實的寫法見 `content-strategy` skill「引用事實的寫法」，只用 `docs/strategy/facts.yaml` 裡 zh-TW、`status: confirmed` 的條目
- 版型與 `layout` 值照 `docs/strategy/design-principles.md`「內頁的版型」與 `src/content.config.ts` 的 `pageSection`
- 狀態：#199 策略階段。content-strategist 初稿，seo-strategist 補了「搜尋意圖」「內部連結」「title 與 description 方向」與「取捨」的意見欄、最後決定，之後等 `strategy-approved`

## 受眾與任務

依 `docs/research/audience-and-goals.md`「受眾分群」。這頁的產業是金融（保險）：

| 受眾 | 來這頁做什麼 | 這頁要讓他做到的事 |
|---|---|---|
| 決策者（保險公司的理賠與營運主管、CIO），主要 | 確認 AI 能不能接手理賠作業、有沒有寫得出來的成果；決定要不要聯絡業務 | 第一屏看懂這是保險理賠用的方案；第 2 段讀到成果原文；第 5 段看到保險業醫療文件的情境；找得到聯絡業務 |
| IT 主管、專案負責人，主要 | 確認方案接得上理賠流程與理賠引擎、演算法是誰的、模型上線後誰維護 | 第 3 段看到從掃描建檔到派件的接點；第 4 段讀到自研 NLP；第 6 段讀到再訓練機制 |

主要轉換：聯絡業務（內容檔 `cta: contact`）。

## 搜尋意圖

依 `docs/strategy/search-intent.md`「AI 智能理賠解決方案 `/solutions/smartclaim`」，加上同檔「金融產業頁」的「保險科技 AI 理賠」。沒有 Search Console 數據，取捨只依受眾與頁面主題，不依搜尋量。

### 這頁承接的查詢

| 查詢 | 意圖類型 | 承接 | `search-intent.md` 的條目 |
|---|---|---|---|
| `AI 智能理賠 解決方案` | 商業型（找可採購的方案） | 主要。節點名稱就是這組詞。前幾名的國際方案都是車險與財產險，缺台灣醫療理賠（診斷書、各醫院單據）的方案說明，由第 3、4 段回答 | 「AI 智能理賠 解決方案」 |
| `昕力 智能理賠` | 導航型，前幾名是新聞，實際滿足的是資訊需求 | 主要。前幾名寫的金漾獎由第 1 段的證據點對上，NLP、RPA 由第 3、4 段對上；前幾名缺的立案到派件步驟由第 2、3 段回答 | 「昕力 智能理賠」 |
| `保險科技 AI 理賠` | 資訊型 | 主要；次要 `/industries/finance`。前幾名多是車險影像定損，第 4 段回答前幾名缺的醫療理賠文件辨識 | 「保險科技 AI 理賠」（金融產業頁一節） |
| `保險理賠 RPA 自動化` | 資訊型偏商業型 | 主要；次要 `/products/systalk-rpa`。前幾名把 RPA 和 AI 分開講，第 3 段把掃描建檔、系統分析與 RPA 跨系統執行寫在同一條流程 | 「保險理賠 RPA 自動化」 |
| `醫療理賠 診斷書 OCR 辨識` | 資訊型（了解技術做不做得到） | 主要；次要 `/products/systalk-icr`。本頁寫理賠情境（第 4 段：各醫院格式不同的診斷書與單據），辨識技術本身由 ICR 頁寫（取捨第 9 項） | 「醫療理賠 診斷書 OCR 辨識」 |
| `保險 理賠 NLP 自然語言處理 應用` | 資訊型 | 主要。前幾名全是英文，第 4 段寫自研 NLP 解析各醫院的診斷書 | 「保險 理賠 NLP 自然語言處理 應用」 |
| `保險理賠流程 如何自動化` | 資訊型（怎麼做） | 次要，沒有主要承接頁。前幾名是廠商的導入指南；本頁不寫通用步驟，用第 3 段（流程接點、理賠人員做最後確認）與第 6 段（前幾名都沒有的模型再訓練）回答，不另寫文章（取捨第 12 項） | 「保險理賠流程 如何自動化」 |
| `壽險 理賠 AI 案例 台灣` | 資訊型（看同業做了什麼） | 次要，沒有主要承接頁；另一個次要是 `/industries/finance`。第 2 段的立案到派件成果與第 5 段的情境回答一半；沒有具名案例，接不住「案例」（「待確認」第 2 項） | 「壽險 理賠 AI 案例 台灣」 |

### 不由這頁承接的查詢

| 查詢 | 交給 | 理由 |
|---|---|---|
| `免模板 OCR 辨識`、`ICR OCR 差別` | `/products/systalk-icr` | 辨識技術本身的查詢；本頁只寫理賠作業（取捨第 9 項，分工同 `smartfilling.md`「取捨」第 4 項） |
| `金融業 AI 應用` | `/industries/finance` | 產業層級的查詢；本頁是金融頁第 4 段連過來的目的地 |
| 保險理賠流程的通用導入步驟（IDP、直通式處理、FNOL） | 不承接 | 通用知識不是昕力的事實，寫出來只剩表述（取捨第 12 項） |

## 這頁要讓讀者相信什麼

AI 已經用在保險理賠，從立案到派件都能自動執行，成果寫得出來（`DM-2`）；文件格式一直變，企業自己就能再訓練模型、維持準確率（`IT-9`）。演算法是昕力自研的（`IT-8`），方案經過外部評選（`DM-8`）。

## 段落結構

順序照讀者的判斷：這是什麼、做得到嗎、接得上嗎、怎麼讀懂文件、用在哪、上線後誰維護。

「影像」欄照 `design-principles.md`「內頁共用的規則」。介面片段（`data-ui`、標「示意」）只畫事實寫得出的功能名稱、設定項目與狀態名稱，不畫筆數、時間、金額與曲線。

| # | 段落 | 目的 | 依據（受眾任務／主張 id） | 搜尋子題 | 事實 | 預估長度 | 版型（`layout`） | 影像 |
|---|---|---|---|---|---|---|---|---|
| 1 | Hero：保險理賠交給 AI 處理 | h1 是節點名「AI 智能理賠解決方案」，上方不放小標，屬於 SysTalk.ai 由麵包屑表示。tagline 寫用途（保險理賠的文件與流程），不寫機制；說明句寫對象（保險業的理賠作業）。兩則證據點：技術組合一則、獎項一則，獎項寫出年份，不寫組別與名次（`DM-8` 寫法）。一個動作：聯絡業務 | 決策者任務「確認是不是我要找的方案」；`DM-2`、`DM-8`；主要轉換 | `昕力 智能理賠`：前幾名是新聞，寫的是金漾獎與 NLP、RPA；`AI 智能理賠 解決方案`：類別詞 | `fact:smartclaim-technologies`、`fact:award-golden-yang-2024-smartclaim` | tagline 15–25 字；說明 30–50 字；證據點 2 則 | 第一屏（不屬於 10 種版型，照「內頁共用的規則」的第一屏） | 同一個世界渲染的靜態圖，要新做 `page-smartclaim.webp`（`scripts/design/ribbon-capture.mjs`）。HTML 標籤用第 3 段事實的用詞：診斷書及單據（`legacy`）、AI 智能理賠解決方案（`product`）、自動理賠引擎（`service`）。不載 3D |
| 2 | 理賠從立案到派件自動執行 | 一則成果：作業名稱與成果原文放在同一則，數字加粗。引言一句寫讀者得到什麼（理賠人員不必逐件登打與派件），不另寫成效數字（`DM-2` 寫法：這頁只能用這一筆成果） | 決策者任務「AI 做得到嗎」；`DM-2` | `壽險 理賠 AI 案例 台灣`：前幾名缺「立案、派件自動化」的案例，這則回答一半（沒有客戶名）；`AI 智能理賠 解決方案`：從報案到結案的全流程 | `fact:smartclaim-title`（作業名稱）、`fact:smartclaim-result`（成果） | 引言 30–50 字；成果照原文 | 成果（`results`），1 則 | 介面片段 1：理賠案件的狀態列，三個狀態是立案、解析診斷書、派件（用詞取自 `fact:smartclaim-result`）。不畫案件數與時間 |
| 3 | 從掃描建檔到理賠引擎，接進現有流程 | 說明句寫機制：業者掃描建檔後由系統分析，理賠人員做最後確認；RPA 跨系統執行；資料可串接自動立案、自動理算、自動派件與自動理賠引擎。清單照原文，每段 2–6 項 | IT 主管任務「確認接得上既有系統」；`DM-2` | `保險理賠 RPA 自動化`：RPA 與文件辨識串在同一條理賠流程（前幾名分開講）；`保險理賠流程 如何自動化`：低信心度案件交人工、從報案到結案；`AI 智能理賠 解決方案`：台灣醫療理賠（診斷書、單據）的方案說明 | `fact:smartclaim-flow`、`fact:smartclaim-end-to-end`、`fact:smartclaim-rpa`、`fact:smartclaim-review-engine` | 說明 40–60 字；清單 4 項 | 接點圖（`junction`） | SVG 三欄：左（`legacy`）保戶診斷書及單據、掃描建檔；中（`product`）AI 智能理賠解決方案、系統自動分析、跨系統自動化；右（`new`）自動立案、自動理算、自動派件、自動理賠引擎。圖的 caption 寫理賠人員做最後確認（`fact:smartclaim-flow`） |
| 4 | 自研 NLP 讀懂各醫院的診斷書 | 各醫院的診斷書與單據格式不同，自研 NLP 解析語意與敘述情境，填進對應欄位。寫機制，不寫「準確率多少」 | IT 主管任務「確認演算法是誰的」；`IT-8` | `保險 理賠 NLP 自然語言處理 應用`：繁中 NLP、自有演算法（前幾名全英文）；`醫療理賠 診斷書 OCR 辨識`：各院格式不同的診斷書（前幾名沒有台灣的情境） | `fact:smartclaim-nlp`、`fact:smartclaim-ensemble`、`fact:smartclaim-auto-filing` | 說明 40–60 字；事實 3 則 | 介面片段（`ui`） | 介面片段 2：文件解析面板，分頁是診斷書、單據；列是解析多樣語意、敘述情境、多模型之集成學習、輸入對應欄位（用詞取自本段三則事實）。畫出的接點：文件進來後先經 NLP 解析，再填進欄位 |
| 5 | 保險業的醫療文件解析 | 情境說明：保險業用自然語言技術分析診斷證明書與單據。標題寫情境，不寫 AI 或成果；這則原文沒有可引用的成果（`DM-2` 寫法） | 決策者任務「了解方案用在哪」；`DM-2` 的寫法限制 | `壽險 理賠 AI 案例 台灣`：保險業的情境（次要，沒有客戶名，見「待確認」） | `fact:smartclaim-case-medical-documents-title`、`fact:smartclaim-case-medical-documents` | 說明 20–40 字；原文 1 則加標題 | 主張與原文（`claim`） | 無 |
| 6 | 文件格式變了，企業自己再訓練模型 | 各醫院收據、發票格式不一，AI 再訓練機制維持準確率；AI 進化系統讓再訓練「一鍵優化」。表述寫「自己再訓練」「自主維運」，不加百分比，不寫「完全不需要外部」（`IT-9` 寫法） | IT 主管任務「確認上線後維運得動」；`IT-9` | `保險理賠流程 如何自動化`：前幾名沒有模型上線後的再訓練維運；`AI 智能理賠 解決方案`：各醫院收據格式不一 | `fact:smartclaim-retraining`、`fact:smartclaim-one-click-retraining`、`fact:smartclaim-quality` | 說明 40–60 字；事實 3 則 | 介面片段（`ui`，`flip: true`，和第 4 段左右對調） | 介面片段 3：AI 進化系統的面板，分頁是收據、發票；列是 AI 再訓練機制（`on`）、一鍵優化（`next`）。只畫功能與狀態名稱 |
| 7 | 相關產品 | 理賠方案用到的辨識與流程自動化產品，以及金融產業頁。一列一項：名稱、一句、連結。一句由各頁自己的 description 或表述寫，不另引用事實 | 決策者與 IT 主管任務「了解產品與方案」；`search-intent.md`「對應到頁面」把 `systalk-icr`、`systalk-rpa` 列為次要承接頁 | `醫療理賠 診斷書 OCR 辨識`（次要 `/products/systalk-icr`）；`保險理賠 RPA 自動化`（次要 `/products/systalk-rpa`）；`保險科技 AI 理賠`（次要 `/industries/finance`） | 無 | 3 列 | 索引列（現有 `pageSection` 沒有，見「schema 缺口」） | 無 |
| 8 | 聯絡業務 | 頁尾的主要轉換，標題寫談理賠作業的下一步 | 主要轉換：聯絡業務 | — | 無 | 標題 10–20 字，說明 30–50 字 | 色帶（深紫），模板的 `ContactCta` | 無 |

### 照原文列清單的段落

第 3、4、6 段的清單是事實原文，說明句是表述，說明句照 `content-strategy` skill「全頁的寫法」。

### 不能寫的句子

| 段落 | 不能寫 | 為什麼 |
|---|---|---|
| 1、2 | 任何「節省幾成人力成本」的句子，除了第 2 段 `fact:smartclaim-result` 的原文 | 理賠頁自己的成效數字還沒確認（「待確認」第 1 項，`messaging.md`「缺少證據的主張」第 16 項） |
| 1 | 「獲金漾獎智慧應用組佳作」 | 組別與名次是媒體寫的，不在事實庫（`DM-8` 寫法） |
| 5 | 把第 5 段放在「AI 成果」「效率提升」這類標題底下 | 原文沒有寫 AI，「作業效率大幅的提升」也不是可引用的成果（`DM-2` 寫法） |
| 6 | 「100% 自主維運」「不需要任何外部協助」 | 沒有依據（`IT-9` 寫法） |

### 與現有頁面的差異

對照現有的 `src/content/offering/zh-TW/smartclaim.md`：

| 現有 | 處理 | 理由 |
|---|---|---|
| title「SysTalk.ai AI 智能理賠解決方案」 | h1 改用節點名「AI 智能理賠解決方案」；`<title>` 交 seo-strategist | 家族名由麵包屑表示（`design-principles.md`「內頁共用的規則」第一屏） |
| tagline「整合 AI 加速理賠流程 持續進化」 | 改寫，寫用途與對象 | 沒說出保險理賠，讀者要讀到 features 才知道 |
| description（改寫自介紹段） | 交 seo-strategist | 介紹段是產業背景，沒寫方案做什麼 |
| features 4 項（AI OCR、文件辨識、RPA、理賠審核） | 拆進第 3、4、6 段，改成 `sections` | 每項都是事實原文，但四項排成同一種雙欄條列；拆開後各回答一個 IT 主管的疑問 |
| useCases「保險業 - 醫療文件解析」（`industry: finance`） | 移到第 5 段 | 原文沒有成果，當情境說明；連到金融產業頁改由第 7 段的索引列（見「取捨」第 7 項） |
| 現站沒搬的「流程架構」、三項優勢、AI 進化系統段落（`unmigrated.md`） | 放回第 3、4、6 段 | 事實已收進事實庫，各對應一個受眾任務 |
| 現站的介紹段、頁尾導流到 DigiLism | 不放 | 介紹段是產業背景，沒有事實；導流到 DigiLism 指不到這頁的受眾任務 |

## CTA

| CTA | 文案方向 | 位置 | 連到 |
|---|---|---|---|
| 主要：聯絡業務 | 按鈕寫「聯絡業務」（全站同名，`messaging.md`「統一用詞」）；第 8 段的標題談理賠作業 | 第 1 段 hero（實心按鈕）、第 8 段 | `/contact-us`（`contact`） |
| 次要：相關產品 | 錨點寫目標頁的內容，不只寫產品名（錨點由 seo-strategist 定） | 第 7 段 | `/products/systalk-icr`、`/products/systalk-rpa`、`/industries/finance` |

hero 不放次要按鈕：這頁沒有試用，也沒有需要另一頁承接的動作（`IT-7` 的試用事實只有 digiRunner 與 GreenSwift）。

## 內部連結

路徑取 `docs/ia/nodes.csv`，只列會產生頁面的節點。錨點文字寫目的地是什麼，不用「了解更多」；連到產品頁時用節點名，節點名本身帶類別詞（「光學字元辨識」「流程自動化」）。麵包屑沿 `parent` 連到 `/products` 與 `/products/systalk-ai`，模板產生，不必另寫。

### 連出

| 段落 | 連到 | 建議錨點文字 | 說明 |
|---|---|---|---|
| 1、8 | `/contact-us` | 聯絡業務 | 主要轉換，全站同名 |
| 7 | `/products/systalk-icr` | SysTalk.ICR AI 智慧光學字元辨識 | 節點名。`醫療理賠 診斷書 OCR 辨識` 的次要承接頁；連結旁的一句讀 ICR 頁的 `description` |
| 7 | `/products/systalk-rpa` | SysTalk.RPA 流程自動化 | 節點名。`保險理賠 RPA 自動化` 的次要承接頁 |
| 7 | `/industries/finance` | 金融業的 AI 應用與法規對應 | 錨點寫金融頁回答的事，不只寫「金融」。`保險科技 AI 理賠` 的次要承接頁；取代拿掉 `useCases` 後的 `industry: finance` 反查（取捨第 7 項） |
| 1 | 不加連結 | — | 金漾獎的證據點出自現站新聞 457，新站的 `src/content/news/zh-TW/` 沒有這篇，證據點不加連結（取捨第 10 項） |

### 連入

| 從 | 建議錨點文字 | 狀態 |
|---|---|---|
| header「產品」選單的 SysTalk.ai 欄 | 節點名「AI 智能理賠解決方案」 | 已有 |
| 首頁第 3 段（AI 成果） | AI 智能理賠解決方案 | 首頁 brief 已列（`home.md`「內部連結」第 3 段） |
| `/industries/finance` 第 4 段 | AI 智能理賠解決方案 | 金融頁 brief 已列 |
| `/products/systalk-ai` 第 6 段的索引列 | 節點名 | 本批 `systalk-ai.md`「內部連結」已列 |
| `/products/systalk-icr`、`/products/systalk-rpa` | AI 智能理賠解決方案 | 建議：兩頁改版時，在講理賠應用的地方連過來，讓次要承接頁把理賠情境的讀者送到這頁。不在 #199 範圍 |

### 建議新增

無。`保險理賠流程 如何自動化` 不另寫文章（取捨第 12 項）；`壽險 理賠 AI 案例 台灣` 要等可具名的理賠客戶案例收進事實庫（「待確認」第 2 項），到時第 5 段改成案例列即可，不開新頁。

## title 與 description 方向

規則照 `seo-checklist`「每頁必備」：zh-TW title 約 20–32 個全形字（含後綴「｜TPIsoftware 昕力資訊」，後綴約佔 11 字），description 約 60–80 個全形字；半形英數約算半個全形字。

### title

- h1 改成節點名「AI 智能理賠解決方案」後，頁面主題加後綴約 20.5 字，剛到下限，也沒有「保險」。建議用 `seoTitle` 加上「保險理賠流程自動化」；h1 維持節點名，title 跟 h1 不同，所以用 `seoTitle`（`content-model.md`「共用欄位」）
- 要涵蓋：節點名「AI 智能理賠解決方案」（`AI 智能理賠 解決方案`、`昕力 智能理賠`）、「保險理賠」與「自動化」（`保險理賠 RPA 自動化`、`保險理賠流程 如何自動化`、`保險科技 AI 理賠`）
- 傳達的主張：`DM-2`。「保險理賠流程自動化」是 `fact:smartclaim-technologies` 原文的說法
- 不放：「SysTalk.ai」（家族名由麵包屑表示，`SysTalk.ai` 的查詢由家族頁承接）、「金漾獎」（放 hero 證據點就夠，放進 title 會擠掉類別詞）、「OCR」「ICR」（ICR 頁的詞，取捨第 9 項）、「金融」（金融頁的詞）、成效數字
- 示例（含後綴）：
  - `AI 智能理賠解決方案：保險理賠流程自動化｜TPIsoftware 昕力資訊`（約 30.5 字）
  - `AI 智能理賠解決方案｜TPIsoftware 昕力資訊`（不加 `seoTitle` 的做法，約 20.5 字）

### description

- 要涵蓋：NLP、AI OCR、RPA；診斷書與單據；立案到派件；理賠引擎；企業自己再訓練模型
- 傳達的主張：`DM-2`、`IT-8`、`IT-9`
- 依據的事實：`fact:smartclaim-technologies`、`fact:smartclaim-nlp`、`fact:smartclaim-flow`、`fact:smartclaim-end-to-end`、`fact:smartclaim-review-engine`、`fact:smartclaim-result`、`fact:smartclaim-retraining`
- 不寫成效數字：`fact:smartclaim-result` 的數字只在第 2 段跟作業名稱一起出現（`DM-2` 寫法），放進 description 會離開作業名稱；理賠頁自己的成效數字未確認（「待確認」第 1 項）。也不寫金漾獎的組別
- 現行 description 寫的是產業背景，沒寫方案做什麼，要重寫
- 示例：
  - `AI 智能理賠解決方案結合 NLP、AI OCR 與 RPA，解析各醫院的診斷書與單據，從掃描建檔、立案到派件自動執行，接上自動理賠引擎；文件格式改變時，企業可以自己再訓練模型。`
  - `AI 智能理賠解決方案讓保險理賠的診斷書與單據掃描建檔後，由自研 NLP 解析並填入欄位，RPA 跨系統串接立案、理算與派件，理賠人員只做最後確認。`

## schema 缺口

offering schema（`src/content.config.ts`）已有 `heroLead`、`heroPoints`、`heroLabels`、`sections`（`pageSection` 的 `claim`、`junction`、`ui`、`spec`、`timeline`、`results`、`band`）、`caseNotes`。

| 段落 | 缺什麼 | 新增的欄位 | 型別 |
|---|---|---|---|
| 7 | `pageSection` 沒有獨立的索引列；`ui` 的 `index` 只能掛在介面片段段落底下，第 6 段講再訓練，掛 RPA 與金融產業頁會讓連結和段落主題對不上 | `pageSection` 加一種 `layout: 'index'` | `{ layout: 'index'; id?: string; heading: string; items: { node: string; body?: string }[] }`，`node` 取 `nodes.csv` 的節點 id，`body` 是表述。標題用次要段落的權重（`design-principles.md`「內頁共用的規則」段落標題）。`smartfilling.md` 第 6 段用同一個型別 |
| — | 內容檔沒有 `facts`，`facts.mjs` 不檢查這頁的數字 | `facts`（共用欄位已有） | 照段落表列出的 16 則補上 |

## 取捨

第 1–9 項是 content-strategist 寫的，第 10–12 項是 seo-strategist 加的（`search-intent.md`「待 seo-strategist 決定的事」跟這頁有關的條目）。兩方意見相同的項目，最後決定照 content-strategist 的立場；第 10–12 項由 seo-strategist 定案。

| # | 項目 | content-strategist 的立場 | 理由 | seo-strategist 的意見 | 最後決定 |
|---|---|---|---|---|---|
| 1 | 段數 | 8 段：hero、5 個事實段、索引列、聯絡色帶 | 這頁有 16 則 zh-TW confirmed 事實（13 則來自現站理賠頁、2 則是首頁同一則案例的作業名稱與成果、1 則是新聞 457 的獎項標題），全部用上。hero 放 2 則；其餘 14 則依回答的問題分成 5 段：成果 2 則、流程接點 4 則、NLP 3 則、情境 2 則、再訓練 3 則，每段至少 2 則。沒有照 digiRunner 的 12 段：理賠頁沒有部署、資安、規範、試用、具名案例的事實，那些段落寫不出來 | 同意。8 組查詢的子題都對得到第 2–6 段（段落表「搜尋子題」欄）；部署、資安等沒有事實，也沒有查詢需要它們，不為 SEO 加段 | 採納，8 段 |
| 2 | 介面片段只有 3 張，不到「內頁共用的規則」的 4 張 | 3 張（第 2、4、6 段），加上 hero 的靜態圖與第 3 段的 SVG | 第 3 段回答「接得上嗎」，照版型表用接點圖；第 5 段的原文是一段情境敘述，畫成介面要補欄位名稱或案件內容，事實庫沒有。第 4 張要靠假資料（理算金額、案件筆數）才畫得出來，house rule 不允許 | 對搜尋沒有影響。片段裡的功能名稱是 HTML 文字，搜尋引擎讀得到，用詞照事實原文即可 | 採納，3 張；交設計概念階段確認 |
| 3 | 成果只放一則 | 只放首頁同一則案例的成果，和作業名稱寫在同一則 | `DM-2` 寫法：理賠頁自己的成效數字還沒確認，這頁不另寫成效數字（「待確認」第 1 項） | 同意。description 也不放數字（「title 與 description 方向」） | 採納 |
| 4 | 獎項放 hero 的證據點，不另成一段 | 放 hero，寫年份 | 只有一則獎項事實，撐不起一段；放第一屏讓決策者一進來就看到外部評選（`DM-8`）。新聞 457 只收了標題，組別不寫 | 同意。`昕力 智能理賠` 的前幾名多是金漾獎的報導，從新聞點進來的讀者第一屏就對得上。決定見第 10 項 | 採納 |
| 5 | hero 的靜態圖要新做 | 新做 `page-smartclaim.webp` | `design-principles.md`「各模板怎麼呈現」只寫了 digiRunner 與金融頁兩張，`src/assets/design/ribbon/` 沒有這頁的圖。原則沒寫到其他產品頁怎麼做，這裡照 digiRunner 的做法提出，由設計概念階段確認 | 沒有 SEO 意見。圖上的標籤用 HTML 文字，用詞照第 3 段的事實 | 交設計概念階段 |
| 6 | 現站 AI 進化系統的影片（`feature05.mp4`）不放 | 不放 | 影片沒有文字，第 6 段的介面片段已經畫出 AI 進化系統的再訓練與「一鍵優化」；`design-principles.md` 的內頁規則沒寫影片放哪。要放時用 `VideoFacade`，另外決定 | 同意。影片沒有文字，對搜尋沒有幫助；`保險理賠流程 如何自動化` 缺的再訓練由第 6 段的文字回答 | 採納，不放 |
| 7 | 拿掉 `useCases` 後，金融產業頁不再依 `industry: finance` 反查到這頁 | 改由第 7 段的索引列連到 `/industries/finance` | `briefs/finance.md`「內部連結」連入表記了這條反查；金融頁本身已在第 4 段以描述性錨點連過來，不靠反查。主 session 改模板時確認反查拿掉後沒有其他頁依賴它 | 同意。索引列的錨點寫「金融業的 AI 應用與法規對應」，比模板反查出來的產業名說得清楚 | 採納 |
| 8 | `fact:smartclaim-technologies`（NLP、AI OCR、RPA）放 hero，不放第 3 段 | 放 hero | 這則一句說完方案的技術組合，是第一屏「這是什麼」的答案；第 3 段改用流程與串接的四則，不重複 | 同意。這則原文含 NLP、AI OCR、RPA 三個查詢用詞，也是 title「保險理賠流程自動化」的出處，放第一屏最合適 | 採納 |
| 9 | 和 `/products/systalk-icr`、`/products/systalk-rpa` 的分工 | 這頁只用理賠頁自己的事實，不搬 ICR、RPA 頁的事實（例如 ICD 辨識） | `search-intent.md`「對應到頁面」把醫療理賠 OCR 與理賠 RPA 的主要承接給這頁、次要給兩個產品頁；細節由產品頁寫，這頁用第 7 段連過去 | 同意，查詢分工定案：理賠情境的查詢（診斷書、理賠流程、理賠 RPA、理賠 NLP）主要給本頁；辨識技術的查詢（`免模板 OCR 辨識`、`ICR OCR 差別`）給 ICR 頁；RPA 本身給 RPA 頁。本頁 title 不放「OCR」「ICR」，兩個產品頁改版時 title 不放「理賠」 | 採納，分工如左 |
| 10 | 金漾獎 `fact:award-golden-yang-2024-smartclaim` 要不要放進這頁（`search-intent.md` 待決條目） | 放 hero 的證據點，寫年份、不寫組別（第 4 項） | 同第 4 項 | 放。原文是現站新聞 457 的標題，已 `confirmed`；寫年份，不寫媒體報的組別與名次（「不能寫的句子」）。不放進 title。證據點不加連結：新站沒有新聞 457 | 定案：放 hero，不連結，組別待確認（「待確認」第 3 項） |
| 11 | title 用什麼 | h1 用節點名，`<title>` 交 seo-strategist（「與現有頁面的差異」） | 家族名由麵包屑表示 | 用 `seoTitle`：「AI 智能理賠解決方案：保險理賠流程自動化」。不帶「SysTalk.ai」，不放「金融」「OCR」 | 定案，見「title 與 description 方向」 |
| 12 | `保險理賠流程 如何自動化` 要不要寫 blog 文章承接（`search-intent.md` 待決條目） | 沒有提 | — | 不寫。前幾名是廠商的導入指南，寫的是 IDP、直通式處理、FNOL 這類通用步驟，不是昕力的事實，寫出來只剩表述。本頁第 3、6 段回答前幾名都沒有的醫療文件與模型再訓練，次要承接就夠。之後收到可具名的理賠案例時，再考慮寫案例型文章 | 定案：不寫文章，本頁次要承接 |

## 待確認

事實庫沒有這些內容，頁面不補、不寫成更強的說法：

| # | 事項 | 卡在哪 | 影響的段落 |
|---|---|---|---|
| 1 | 理賠頁自己的成效數字「人力成本節省達 80% 以上」（`fact:smartclaim-80-percent`） | `to_confirm`：沒有量測方式與比較基準（`messaging.md`「缺少證據的主張」第 16 項）。要先收量測方式與基準 | 2 |
| 2 | 可具名的理賠客戶案例 | 事實庫沒有對應到這個方案的客戶名與案例頁，第 5 段只能寫情境；`壽險 理賠 AI 案例 台灣` 要有具名案例才接得住 | 5（之後可改成案例列） |
| 3 | 金漾獎的組別 | 新聞 457 只收了標題，內文在 Nuxt payload，`extract-facts.mjs` 不讀 | 1 |
| 4 | 「智能理賠專利」指的是不是這個方案 | `fact:systalk-ai-claim-patent` 已確認，但出自 SysTalk.ai 家族頁的 SysTalk.ICR 那一列，原文沒寫專利屬於哪個產品。確認前這頁不寫專利 | 1、4 |

## 後續

- en、vi 版另做，照 `content-migration` skill「多語系內容」，不在這份 brief 的範圍
