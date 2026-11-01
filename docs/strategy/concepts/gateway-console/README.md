# 方向 gateway-console：深色主控台

深色主控台：每一段都用一塊 digiRunner 或 OrientAI 的介面片段，示範請求怎麼通過規範、接進既有系統。規格見 [`../directions.md`](../directions.md)「方向 1：`gateway-console`」，文字照 [`../copy-deck.md`](../copy-deck.md)。

- 原型：`index.html`、`style.css`、`app.js`（從 `file://` 直接打開，不連外部網址，`<head>` 有 `noindex, nofollow`）
- 素材：`assets/inter-latin-wght-normal.woff2`、`assets/LICENSE-inter.txt`（`npm pack @fontsource-variable/inter` 5.3.0）、`assets/logo-horizontal-white.svg`（`src/assets/brand/` 複製）
- 截圖：`shot-375.png`、`shot-375-first.png`、`shot-1280.png`、`shot-1280-first.png`（`node scripts/strategy/concept-shots.mjs --only gateway-console`，exit 0）

## 主要視覺決定

| 面向 | 決定 | 原則 |
|---|---|---|
| 版面 | hero 7:5：左邊 h1（72px，白）、說明句、「聯絡業務」與「依產業看方案」；右邊 A1 片段，頂端對齊 h1，高度比 h1 到按鈕的距離短。h1 是第一屏最大、最亮的東西 | P1 |
| 版面 | 相鄰段落的版型都不同：hero 分欄、產業入口 5:7 加兩塊 `--ink-900` 底的產業列、案例三欄、產品家族索引加 sticky 片段、OrientAI 左右對調、服務兩欄清單、穩定度全寬表格、聯絡整片紫 | P5 |
| 版面 | 案例段不放片段，成果原文用 lead 字級，是這段最醒目的字；產品家族只用 lead 當家族名、small 當產品連結，權重比案例低 | P5、P2 |
| 字體 | Inter Variable 加系統中文字，標題 600、內文 400。全頁五種字級（72／40／21／16／14，375 寬 40／28／19／16／14），片段、按鈕、頁尾都只用這五個變數 | P4 |
| 色彩 | 全頁 `--ink-950`，片段 `--ink-850`、片段標題列與產業列 `--ink-800`／`--ink-900`，只靠底色一階分開。既有系統（核心銀行系統、過時大型機、現有的 WAF）是中性色塊，昕力的產品（digiRunner、GreenSwift、gadoDIDO）與主要按鈕是 `--purple-300`，接點、流量與「通過」是 `--orange-400`，AI（AI Gateway、AI 模型、SysTalk.ai、OrientAI）是 `--magenta-400` | P3、P4 |
| 證據 | 事實全頁一種格式：8px 橘色實心方塊加原文，放在主張下方，白字。穩定度是真正的 `<table>`，年份欄用 tabular-nums | P2 |
| 影像 | 5 塊 HTML 介面片段（A1；A3 四塊；A4），沒有點陣圖、沒有 SVG 架構圖、沒有 3D。片段畫的是請求逐列通過規範、轉送到核心銀行系統，以及既有系統經 digiRunner 路由到新的服務 | P3 |
| 動態 | signature move：A1 的列在載入後每 120ms 一列變成「通過」，最後出現「轉送：核心銀行系統」，只跑一次（純 CSS）。每段標題、文字、圖錯開 75ms 上移 20px 淡入，只觸發一次；第 4 段右側片段跟著讀到的家族換內容。h1 與說明句不動 | P4 |
| 互動 | A1 的「金融／政府」頁籤（`role="tablist"`，左右鍵、Home、End）。沒有 JS 時兩個列表都顯示 | P1、P3 |
| 375 寬 | A1 只留頁籤、兩列與「轉送」列；產品家族的片段只放 DigiLism 那塊，插在第一個家族後面；路由列改成可換行的直式；表格改成上下堆疊 | P5 |

## 375 寬的實際位置

用 Playwright（375×812，減少動態）量 `getBoundingClientRect().top + scrollY`：

| 位置 | 預估（directions.md） | 實際 y（px） | 上限 |
|---|--:|--:|--:|
| header 結束 | 56 | 64 | — |
| A1 精簡版結束（hero 結束） | 610 | 586 | 760 |
| 第 2 段 h2 | 690 | 658 | 840 |
| 第 2 段結束 | 1,100 | 1,196 | — |
| 第 3 段 h2 | 1,180 | **1,268** | 1,300 |
| 第一則成果原文 | 1,330 | **1,472** | 1,560 |

第 3 段 h2「AI 已用在理賠、建檔與阻詐」在 375 寬、28px 是兩行，所以比預估晚。1280 寬：第 3 段 h2 1,125px、第一則成果 1,335px，整頁 5,458px。

## 與現有限制的差異

| 限制 | 處理與量到的數字 |
|---|---|
| 中文 webfont | 照現有，不載。中文用 `"PingFang TC", "Microsoft JhengHei", "Noto Sans TC", sans-serif` |
| 拉丁字型 | 照現有（Inter Variable）。1 個檔：latin subset 的 wght 可變字型 48,256 bytes（47.1 KB）。production 另有 latin-ext、vietnamese subset，不在原型裡 |
| JS 預算 | 照現有：`app.js` 2,932 bytes，gzip -9 後 1,326 bytes（6 KB 以內）。signature move 是 CSS，不算在 JS 裡 |
| 3D | 放寬：首頁不用 3D 與 `Backdrop`，`design-system`「設計方向」要改寫 |
| 色彩 token | 值照 `src/styles/tokens.css`；深色頁面沿用 `data-surface="dark"` 的做法。品紅與橘從裝飾改成固定意思的標記。對比照 directions.md 的組合，沒有新增組合 |
| 影像規範 | 放寬：抽象 3D 渲染換成 HTML 介面片段。代價：片段要跟產品畫面與事實一起維護，三語各一份 |

其他數字：`style.css` 19,993 bytes（gzip 5,108），`index.html` 18,437 bytes（gzip 5,738）。

## inspector 與 lint 的最終結果

`CHROME_PATH=$PWD/scripts/strategy/chromium.sh node .claude/skills/taste-skill/scripts/inspect.mjs docs/strategy/concepts/gateway-console/index.html --out .taste-skill/gateway-console/inspect --allow palette-purple`：**0 FAIL、3 WARN**。`lint.mjs`：**0 FAIL、1 WARN**。

| 結果 | 保留的理由 |
|---|---|
| inspect WARN `no-real-pictures` | 本專案不用開放圖庫照片，影像是介面片段（`design-concept`「用 `taste-skill` 檢查原型」的衝突表） |
| inspect WARN `no-footage` | 同上；本站沒有能代表產品的影片，影片也會加重首頁 |
| inspect WARN `off-centre`（1440 寬左 48px、右 64px） | inspector 量的是文字的左右邊界。右側最外的文字在片段裡（片段本身貼齊 48px 的右邊距，文字有 16px 內距），版心左右都是 48px |
| lint WARN `default-font`（`font-family: "Inter Variable"`） | Inter 是本站現有字型，directions.md 指定沿用；換字型列在 directions.md「待人決定」第 1 項 |

第一輪 inspector 有 1 個 FAIL（`eyebrow`）：1280 寬第 3 段的引言放在右欄，剛好落在第二、三則案例標題正上方，被判成 eyebrow。改成引言接在 h2 下方後通過。

## critique（`references/critique.md`）

```
ROUND 2
Seen in one second: h1「金融與政府的系統／接上 API 與 AI」
Idea (one sentence): 讀者看到的是 digiRunner 的規範面板一列列通過，最後轉送到核心銀行系統
Live thing: hero 片段的「金融／政府」頁籤
Layout words by section: hero=split / industries=index+rows / cases=three-column / products=index+sticky / orientai=split（左右對調）/ services=list / about=table / contact=field
Scores: design 7 · usability 8 · creativity 7 · content 7 → overall 7.3
Caps applied: 沒有真實照片（design 上限 6.5 的規則以介面片段代替，本專案決定）
Top three problems:
1. shot-1280.png 第 4 段：整頁截圖時 sticky 片段停在段落頂端，左欄四個家族比片段長，右下約 600px 是空的；實際捲動時片段跟著走
2. shot-1280.png 第 5 段：A4 只有三列，比右欄的四項特色短，下面同樣留空（實際捲動時 sticky）
3. shot-1280.png 第 2 段：產業列右欄只有 4 欄寬，說明句與事實各折成兩行，讀起來比其他段擠
```

修過的問題：第 1 輪的 eyebrow FAIL；375 寬路由片段的系統名稱被擠成直排（改成可換行的列）；第 2 段 h2 在 4 欄裡斷出孤字「品」（標題欄加寬到 5 欄）；第 4 段片段 min-height 從 520px 降到 440px，減少片段裡的空白。三輪內停在 7.3，低於 7.5，剩下的問題是上面三項。

## 介面片段（全部標「示意」）

| # | 段落 | 畫什麼 | 字的來源 |
|---|---|---|---|
| A1 | 1 hero | digiRunner 規範面板，金融、政府兩個頁籤，每列橘色方塊、右邊「通過」，金融最後一列「轉送：核心銀行系統」 | 金融：`fact:digirunner-financial-inspection` 拆成列，只取 9 項裡的 5 項（API 生命週期作業、訂定交易限制、定期盤點作業及風險評估、API Key 識別認證、採用 OAuth 2.0），字不改；政府：`fact:digirunner-gov-auth`、`fact:digirunner-gov-sso`、`fact:digirunner-gov-threat-protection` 全文；「核心銀行系統」取自 `fact:digilism-protocol-integration`；介面用語：通過、轉送 |
| A3 DigiLism | 4 產品家族 | 路由列表：核心銀行系統、過時大型機、現有的 WAF、業務流程 → digiRunner／AI Gateway → API、資料、伺服器端點、AI 模型 | 名稱取自 `fact:digilism-protocol-integration`、`fact:digirunner-nginx-waf`、`fact:digilism-family-digirunner`；介面用語：路由 |
| A3 SysTalk.ai | 4 | 模型選擇：主流開源 LLM、企業級 LLM | `fact:aiso-llm-support` 的名稱；介面用語：選擇 |
| A3 ESGswift | 4 | 碳盤查標準選擇：GHG Protocol、ISO 14064-1:2018；IPCC 係數 → GreenSwift「更新」 | `fact:greenswift-standards` 的名稱與「更新」；介面用語：選擇 |
| A3 GadoSecurity | 4 | gadoDIDO 登入確認：「FIDO2 無密碼 零信任身分驗證」與「登入」按鈕 | `fact:gadodido-passwordless` 全文；介面用語：登入 |
| A4 | 5 OrientAI | 「企業端」面板：Agent 權限、Token 用量、資料位置三列，狀態都是「企業端」，開關開著 | `fact:orientai-on-prem-data`、`fact:orientai-governance`、`fact:orientai-token-cost` 的名稱；介面用語：企業端 |

穩定度的表格（A5）是真正的 `<table>`，不算片段。片段裡沒有數字、時間、ID 或使用者名稱，事實原文裡的（OAuth 2.0、ISO 14064-1:2018）除外。

## 與 directions.md 不同的調整

- A1 金融頁籤只列 9 項檢查要求裡的 5 項：全列會讓片段高過 h1 到按鈕的距離（directions.md 的上限）
- A3 DigiLism 片段的第 3 列目的地用「伺服器端點」（`fact:digirunner-nginx-waf` 原文的詞），第 4 列加了「業務流程 → AI Gateway → AI 模型」，用品紅標 AI 流量
- A3 ESGswift 片段用了「更新」（`fact:greenswift-standards` 的詞），不在 directions.md 的介面用語清單
- 第 2 段 1280 寬改成左 5 欄、右 7 欄（directions.md 寫 4:8），4 欄放不下 40px 的 h2 不斷孤字
- 第 5 段 A4 是 6 欄寬（directions.md 寫 7 欄），右欄留 5 欄給文字、中間空一欄；A4 在 1280 寬也是 sticky
- header 的「選單」在 1023px 以下出現（directions.md 只寫 375 寬）

## 原型與 production 的差距

- 連結都是站內路徑，原型裡打不開；「選單」只展開四個錨點連結
- 樣式直接寫 token 的原始值，production 改用語意 token 與 `data-surface="dark"`
- 事實手打進 HTML（保留 U+200B）；production 用 `fact('<id>')`
- 第 4 段的 sticky 切換在 1024px 以上才有；整頁截圖（含 `shot-1280.png`）看不到切換，只看到 DigiLism 那塊

## 想讓人決定的事

1. 第 4、5 段的 sticky 片段在整頁截圖上會留下右側空白（實際捲動時不會）。要接受，還是改成每個家族旁各放自己的片段（代價是四段同樣的左右分欄）
2. P5 要用底色分出三組判斷，directions.md 的本方向只有全頁 `--ink-950` 與聯絡段的紫；要不要把第 6–7 段（安不安心）放在 `--ink-900` 的帶上
3. 深色首頁和其他頁面的亮色模板怎麼銜接（directions.md「待人決定」第 2 項）

## 待補

- 第 8 段：聯絡後多久回覆，頁面標「待補」
- 第 6 段：六項服務的說明，頁面標「說明待補」
- 介面片段標「示意」後能不能在正式站使用，或要等產品團隊的真實截圖（`design-principles.md`「待確認」第 4 項）
