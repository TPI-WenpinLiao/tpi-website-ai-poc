# 方向 layer-fields：整片品牌色分章

整頁用三片品牌色分章：紫色、白色、淡橘三章對應「是不是為我做、做得到嗎、安不安心」，每章開頭一張大的介面片段或分層圖。

- 原型：`index.html`、`style.css`、`main.js`（從 `file://` 直接打開，不連外部網址，`<head>` 有 `noindex, nofollow`）
- 截圖：`shot-375.png`、`shot-375-first.png`、`shot-1280.png`、`shot-1280-first.png`（`node scripts/strategy/concept-shots.mjs --only layer-fields`，exit 0）
- 規格：`../directions.md`「方向 3：`layer-fields`」；文字照 `../copy-deck.md`，事實照 `docs/strategy/facts.yaml`（zh-TW、confirmed），U+200B 照事實庫保留

## 主要視覺決定

| 面向 | 決定 | 原則 |
|---|---|---|
| 版面 | 第一屏整片 `--purple-900`：左 7 欄 h1（80px，白）、說明句、白底「聯絡業務」與「依產業看方案」；右 5 欄 L0 分層圖。h1 是第一屏最大、最亮的東西 | P1 |
| 版面 | 第 2 段在同一片紫底延續，h2 與引言 4 欄、金融與政府各 4 欄。紫底到第 2 段結束，「是不是為我做」一章只靠底色分 | P1、P5 |
| 版面 | 第二章（白）開頭是案例：三則 `--ink-50` 底色的紀錄並排，作業名稱（head）、成果原文（lead，這一章最大的字）、連結 | P2、P5 |
| 版面 | 第 4 段 L1：左邊四個問題（`role="tablist"`），右邊 7 欄是對應家族的說明、事實、介面片段與產品連結；第 5 段 L2 左片段右文字，相鄰兩段版型不同 | P3、P5 |
| 版面 | 第三章（`--orange-50`）：產品與導入（左文右 L4 片段，服務清單三欄），穩定度是真正的 `<table>`（L3），表頭 `--orange-100` | P2、P5 |
| 版面 | 聯絡段回到 `--purple-900`，和 hero 同一套 7:5 構圖，頭尾呼應 | P4、P5 |
| 字體 | IBM Plex Sans 400／600 加系統中文字；五個字級變數，375 寬 40／28／19／16／14，1280 寬 80／40／22／17／14。h1 字距 -0.02em、行高 1.05；h2、h3 用 `text-wrap: balance` 避免單字成行 | P1、P4 |
| 色彩 | 中性色＝既有系統，紫＝昕力的產品與主要動作，橘＝接點與事實標記，品紅＝AI。全部平塗，沒有漸層、陰影、光暈、細線 | P3、P4 |
| 證據 | 事實全頁同一格式：body 字級、前面 8px 實心方塊，方塊在紫底 `--orange-300`、白底與淡橘底 `--orange-700`（案例成果原文在 lead，是唯一例外，因為它是案例段的焦點） | P2 |
| 影像 | L0 分層圖（三層平塗橫條，由上而下新的服務、昕力資訊、既有系統，層間是橘色接點，AI 那一條是品紅）；介面片段 L1（四塊）、L2、L4、L5，根元素 `data-ui`，每塊標「示意」 | P3 |
| 動態 | signature move：載入後昕力那一層從右側滑進兩層之間（600ms，只動 transform），接著接點出現。每段標題、文字、片段錯開 75ms 上移 20px 淡入一次；`prefers-reduced-motion` 時全部就位；h1 與說明句不動 | P4 |
| 互動 | 第 4 段四個問題切換片段：方向鍵、Home、End 可操作；375 寬改成展開清單（問題與片段交錯排）；沒有 JS 時四塊全部顯示 | P3、P5 |

## 與另外兩個方向的差異

| 面向 | layer-fields | gateway-console | system-map |
|---|---|---|---|
| 版面 | 三章整片色塊，每章開頭一個大片段 | 左文右片段的分欄 | 單欄寬版，架構圖帶與文字列交替 |
| 色彩 | 亮暗交替：紫、白、淡橘，聯絡段回到紫 | 全頁 `--ink-950` | 全頁白，架構圖帶 `--ink-50` |
| 影像 | 1 張分層圖加 6 塊介面片段 | 6 塊介面片段 | SVG 架構圖為主 |
| 字體 | IBM Plex Sans 400／600 | Inter Variable 600 | Geist Variable 700 |

## 與現有限制的差異（量到的數字）

| 限制 | 處理 |
|---|---|
| 中文 webfont | 照現有，不載；中文用 `"PingFang TC", "Microsoft JhengHei", "Noto Sans TC"` |
| 拉丁字型 | 放寬：Inter 換成 IBM Plex Sans（`npm pack @fontsource/ibm-plex-sans@5.3.0`）。原型只放 latin subset 2 個檔：400 是 22,588 bytes、600 是 24,252 bytes，合計 46,840 bytes（約 45.7 KB），授權檔 `assets/IBM-Plex-Sans-LICENSE.txt`。production 要加 vietnamese subset，`base.css` 的 `@font-face` 與 `font-subsets.mjs` 要改 |
| JS 預算 | 照現有：`main.js` 2,078 bytes，gzip 1,018 bytes（`gzip -c main.js \| wc -c`），另有 `<head>` 一行 inline 加 `js` class。在 4 KB 內 |
| 3D | 放寬：首頁不用 3D 與 `Backdrop` |
| 色彩 token | 照現有的值（`style.css` 開頭照抄 `tokens.css` 的原始值）。放寬用法：`--purple-900` 當第一章與聯絡段的整片底色，`--orange-50` 當第三章底色。另外用到 directions.md 沒列的組合，先算過對比：L5 片段 `--purple-800` 底白字 11.62、`--purple-200` 字 7.27；`--purple-700` 字對 `--orange-50` 8.30；`--ink-600` 字對 `--orange-50` 7.30、對 `--ink-50` 7.27；L0 的 AI 標記 `--magenta-400` 對紫底 4.57（只當圖形）|
| 影像規範 | 放寬：抽象 3D 渲染換成分層圖與介面片段。L0 用 HTML 畫，不是 directions.md 寫的 SVG：這樣層裡的字能沿用五個字級變數，375 寬改成三條橫向精簡版而不是整張縮小 |

## 與 directions.md 不同的調整

| # | 調整 | 理由 |
|---|---|---|
| 1 | 加了兩塊 directions.md 沒列的介面片段：L4（第 6 段「導入」：產品、導入規劃、模型設定、建置、應用模組設計，每列都是「昕力資訊」）與 L5（第 8 段聯絡表單示意：產業「金融／政府與公部門」、現有系統、想接上的服務） | inspector 的圖片下限只算畫面上看得到、300×200 以上的 `data-ui`。L1 是頁籤，同時只顯示一塊，實際只算 1 塊；不加的話只有 L1 與 L2 兩塊，`few-pictures` 會 FAIL。L4 的標籤取自 `fact:aiso-onboarding`（同段已照引，片段只放名稱），表達「同一家負責」；L5 的欄名取自第 8 段說明句。第三章開頭因此也有一個片段，和「每章開頭一張大片段」的一句話一致 |
| 2 | L3 表格兩欄（年份或項目／紀錄），不是三欄 | copy-deck 第 7 段只有一個「關於昕力」連結，沒有每列的連結；連結放在 h2 同一列的右端。表頭「紀錄」是新寫的表述 |
| 3 | 第 3 段「看所有成功案例」放在三則案例下方，不在引言旁 | 375 寬的距離預算：第一版（連結在引言下方、章界內距 64px）第一則成果在 1,587px，超過上限；和第 4 項一起改後是 1,496px |
| 4 | 章與章交界的上下內距在 375 寬是 48px（同一章內的段距仍是 64px） | 同上；換底色已經分開兩章，兩邊加起來 96px 仍大於段距 |
| 5 | 頁尾的地址與版權用 small，並加事實方塊 | 頁尾整體用 small；事實格式的方塊保留，字級例外 |
| 6 | 介面用語另用了：碳盤查標準、標準、國際係數、驗證資料、產業、現有系統、想接上的服務、產品 | 都是事實原文或 copy-deck 文字裡出現的詞，沒有數字 |

## 375 寬的實際位置

以 Playwright 在 375×812、`reducedMotion: reduce` 量 `getBoundingClientRect().top + scrollY`：

| 位置 | 實際 y（px） | 上限 |
|---|--:|--:|
| hero 結束（L0 下緣） | 576 | 760 |
| 第 2 段 h2 | 640 | 840 |
| 第 2 段結束（紫底結束前） | 1,180 | — |
| 第 3 段 h2 | 1,276 | 1,300 |
| 第一則案例的成果原文 | 1,496 | 1,560 |

1280×800：第 2 段 h2 在 612（第一屏內），第 3 段 h2 在 1,100，第一則成果在 1,296。整頁高度 375 寬 7,373px、1280 寬 5,533px。

字級種數：375 寬 5 種（40／28／19／16／14），1280 寬 5 種（80／40／22／17／14），量的是所有顯示中、含文字節點元素的 `font-size`。

## taste-skill 檢查

- `lint.mjs`：0 FAIL、0 WARN
- `inspect.mjs --allow palette-purple`（1440、768、390）：0 FAIL、4 WARN，保留的理由：

| WARN | 理由 |
|---|---|
| `no-real-pictures`、`no-footage` | 本專案不用開放圖庫的照片與影片，影像由介面片段與分層圖承擔（`design-concept` skill 的衝突表） |
| `off-centre`（1440：左 48、右 69） | 版心兩側都是 48px（header 的按鈕、片段、表格、L0 都到右邊距）；inspector 取右緣的第 98 百分位，段落設了 36em 的行寬上限，右緣比較短 |
| `card-rows`（390） | 兩列分別是 L0 的三條層（圖）與案例的三則紀錄（directions.md 指定 `--ink-50` 一階底色分開）；不是 icon 卡片 |

### 看截圖修了什麼（兩輪）

1. 第 2 段在 1440 寬時「政府與公部門」掉到 h2 下方，左半留洞：`nth-of-type` 算到 h2 的容器，改用 class 指定欄位
2. 案例紀錄設了固定高度，下方空約 90px：拿掉固定高度，三則仍等高
3. 1280 寬第 2 段 h2「規範要求，已做進產品」與案例名稱「金融聯防阻詐平台」最後一個字單獨成行：h2、h3 加 `text-wrap: balance`；段落加 `text-wrap: pretty`
4. 375 寬第 6 段最後一個「說明待補」被 inspector 當成第 7 段 h2 上方的 eyebrow：服務清單在窄寬改成名稱與「說明待補」同一列
5. 第 4 段沒選的頁籤也有底色，形成一排同款方塊：只有選中的頁籤用 `--purple-700` 平塗

最後一輪的評估（`references/critique.md` §4）：

```
ROUND 2
Seen in one second: 紫底上的白色 h1「金融與政府的系統／接上 API 與 AI」
Idea (one sentence): 昕力是夾在既有系統與新服務之間的一層，頁面用三片品牌色把讀者的三組判斷分開
Live thing: 第 4 段依問題切換產品家族的介面片段；載入時昕力那一層滑進兩層之間
Layout words by section: hero=split / 產業=three-column / 案例=tiles / 產品=index+panel / OrientAI=split(reversed) / 導入=split+list / 穩定度=table / 聯絡=split
Scores: design 7 · usability 8 · creativity 6.5 · content 7 → overall 7.2
Caps applied: 沒有真實照片，design 上限 6.5 的 cap 依本專案規則不適用（影像改由介面片段承擔）
Top three problems (remaining):
1. 第 4、5 段都是「文字＋片段」的分欄，雖然左右對調，掃讀時仍像同一種版型（desktop-page-01）
2. 第 5 段右欄文字比左邊的 L2 片段長約一倍，片段下方留白（desktop-page-01）
3. 案例段的引言在 1280 寬放在右欄，字小，和 h2 的距離遠（desktop-page-01）
```

## 介面片段（全部是示意）

| # | 段落 | 內容 | 文字來源 |
|---|---|---|---|
| L1 | 第 4 段 | DigiLism 路由（核心銀行系統、過時大型機、ESB → digiRunner／微服務架構）；SysTalk.ai 選擇（Chat、Audit、ICR 選開源或企業級 LLM）；GreenSwift 碳盤查標準（GHG Protocol／ISO 14064-1:2018、IPCC）；gadoDIDO 登入 | `fact:digilism-protocol-integration`、`fact:aiso-llm-support`、`fact:greenswift-standards`、`fact:gadodido-passwordless`、`fact:gadodido-device-only-data` 的名稱；產品名取自產品連結 |
| L2 | 第 5 段 | OrientAI 企業端：Agent 權限、Token 用量、資料位置，狀態都是「企業端」 | `fact:orientai-on-prem-data`、`fact:orientai-governance`、`fact:orientai-token-cost` |
| L4 | 第 6 段 | 導入：五列都由「昕力資訊」負責 | `fact:aiso-onboarding` |
| L5 | 第 8 段 | 聯絡表單示意（`role="img"`，不能操作） | copy-deck 第 8 段說明句 |

片段裡的選擇狀態（哪個系統選哪種 LLM、選 GHG Protocol）是為了讓片段看得出是介面而設的，不代表任何客戶的實際設定。

## 原型與 production 的差距

- 連結都是站內路徑，從 `file://` 點下去會找不到；沒有 mega menu、語系切換、搜尋。375 寬的「選單」展開同一組 4 個連結
- 樣式直接寫 token 的原始值，production 改用語意 token 與 `data-surface`
- 事實手打進 HTML；production 用 `fact('<id>')`
- L5 不是真的表單，production 要決定留不留（見「待人決定」）

## 待補

- 第 8 段：聯絡後多久回覆（頁面上標「回覆時間：待補」）
- 第 6 段：六項服務的說明句（頁面上標「說明待補」）
- 表述待人審：L0 的層名（新的服務、昕力資訊、既有系統）、第 4 段四個問題的頁籤文字（取自 directions.md）、表頭「年份或項目／紀錄」

## 待人決定

1. 要不要保留 L4、L5 兩塊 directions.md 沒列的片段。拿掉時 inspector 的 `few-pictures` 會 FAIL（L1 頁籤只算 1 塊），要嘛接受這個 FAIL，要嘛 L1 改成四塊同時顯示
2. L5 是聯絡表單的示意，看起來像表單但不能填；production 可以換成真的表單（`FormPanel`），或拿掉
3. 案例成果原文用 lead、其他事實用 body：是否接受這個例外
