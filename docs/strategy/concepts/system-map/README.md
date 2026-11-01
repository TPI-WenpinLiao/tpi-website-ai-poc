# 方向 system-map：一張架構圖貫穿全頁

一張架構圖貫穿全頁：白底，hero 下方是「既有系統、昕力的產品、新的服務」的全寬架構圖，之後每段放大圖上的一塊。方向定義見 [`../directions.md`](../directions.md)「方向 2：`system-map`」，文字照 [`../copy-deck.md`](../copy-deck.md)。

- 原型：`index.html`、`style.css`、`main.js`（從 `file://` 直接打開，不連外部網址）
- 截圖：`shot-375.png`、`shot-375-first.png`、`shot-1280.png`、`shot-1280-first.png`（`node scripts/strategy/concept-shots.mjs --only system-map`，exit 0）
- 字型與 logo：`assets/geist-latin-wght-normal.woff2`、`assets/LICENSE-geist.txt`（SIL OFL 1.1）、`assets/logo-horizontal-color.svg`（從 `src/assets/brand/` 複製）

## 主要視覺決定

| 面向 | 決定 | 原則 |
|---|---|---|
| 版面 | hero 上半是 h1（96px，左 8 欄），說明句與兩個動作在右 4 欄、對齊 h1 底部；下半是出血到兩側的 `--ink-50` 架構圖帶（M0），1280 寬第一屏露出整張圖的節點。拿掉圖，第一屏只看字也懂 | P1 |
| 版面 | 段落的版型依序是：產業兩欄、案例列表（名稱左 5 欄、成果右 7 欄）、產品家族 2×2 小圖、OrientAI 左文右圖、導入段的 M3 橫帶加三欄清單、穩定度左文右 2×3 紀錄、聯絡段整片紫。相鄰兩段版型都不同 | P5 |
| 版面 | 底色分三組判斷：第 1–2 段白、第 3–5 段 `--ink-50`、第 6–7 段白、第 8 段 `--purple-700`；沒有 sticky 目錄 | P5、P4 |
| 字體 | Geist Variable 700／400 加系統中文字；五種字級 96／44／22／17／14（375 寬 40／28／19／16／14），只用 CSS 的五個變數 | P1 |
| 色彩 | 既有系統中性（`--ink-200` 節點）、昕力的產品紫（`--purple-700` 節點，白字 8.97:1）、接線與接點橘（`--orange-700`，3px）、AI 品紅（`--magenta-500`），全頁同一套意思；平塗，沒有漸層、陰影 | P3、P4 |
| 證據 | 全頁事實同一種格式：`--orange-700` 實心圓點加原文，圓點和架構圖的接點同形。案例成果用 lead（22px）是第 3 段最醒目的字，其餘事實用 body | P2 |
| 影像 | M0 主圖（hero）、M1 四張「輸入 → 產品 → 輸出」小圖（產品家族）、M2「企業端」區塊（OrientAI）、M3 再出現的主圖（導入段，產品與導入服務同為紫）。介面片段 U1–U4 只當圖上的註記 | P3 |
| 動態 | hero 的接線在載入後依序畫出（700ms，每條錯開 90ms）；M1、M2 的接線用 CSS scroll-driven animation（`animation-timeline: view()`）隨捲動畫出；各段標題、文字、圖依序錯開 75ms 上移 20px 淡入，只觸發一次。h1 與說明句不動；減少動態時全部停在完成狀態 | P4 |
| 互動 | M0 的 10 個節點是 `<button>`，點了在圖下方顯示該節點那一組的事實原文與連結（預設 digiRunner）；沒有 JS 時三組依序列出 | P3、P2 |
| 375 寬 | M0 換成直式三列（每列一行字，高約 200px），不放節點互動與 U1；案例改成名稱、成果、連結上下排；家族小圖與片段改成直式；導入段不放 M3 | P1、P5 |

## 與另外兩個方向的差異

| 面向 | system-map | gateway-console | layer-fields |
|---|---|---|---|
| 版面 | 單欄寬版，全寬架構圖帶與文字列交替 | 左文右片段的分欄為主 | 三章整片色塊 |
| 色彩 | 全頁白，圖帶與第 3–5 段 `--ink-50` | 全頁 `--ink-950` | 紫、白、淡橘三章 |
| 影像 | SVG／HTML 架構圖為主，介面片段只當註記 | 介面片段為主，沒有架構圖 | 分層圖 1 張加大尺寸片段 |
| 字體 | Geist Variable 700，字級最大（h1 96px） | Inter Variable 600 | IBM Plex Sans 400／600 |

## 與現有限制的差異（量到的數字）

| 限制 | 處理 |
|---|---|
| 中文 webfont | 照現有，不載。中文用 `"PingFang TC", "Microsoft JhengHei", "Noto Sans TC", sans-serif` |
| 拉丁字型 | 放寬：Inter 換成 Geist Variable（`@fontsource-variable/geist` 5.3.0，`npm pack` 取得）。1 個檔，latin subset 的 wght normal，29,400 bytes（28.7 KB）；production 還要加 latin-ext、vietnamese subset，`base.css` 與 `font-subsets.mjs` 要改 |
| JS 預算 | 照現有：`main.js` 1,639 bytes，gzip 689 bytes（節點互動與進場），接線動畫不用 JS |
| 3D | 放寬：首頁不用 3D 與 `Backdrop` |
| 色彩 token | 照現有的值；`--orange-700` 從焦點色擴大到接線與事實標記。調整兩處：既有系統節點用 `--ink-200`（directions 寫 `--ink-100`，在 `--ink-50` 帶上幾乎看不出邊界），M2 企業端區塊用 `--purple-100`（directions 寫 `--purple-50`，和 `--ink-50` 底色差不到一階）。字對底的對比：`--ink-900` 對 `--ink-200` 13.68:1、對 `--purple-100` 14.73:1；Agent 節點白字對 `--magenta-500` 4.99:1 |
| 影像規範 | 放寬：抽象 3D 渲染換成含文字的架構圖。M0 是 HTML 節點加兩塊 inline SVG 接線（橫式）與另一份直式 HTML；M1、M2、M3 是 HTML 節點加 CSS 接線。代價：圖有橫式與直式兩份，三語各一份，產品改名要改圖 |

## inspector 與 lint 的最終結果

`CHROME_PATH=$PWD/scripts/strategy/chromium.sh node .claude/skills/taste-skill/scripts/inspect.mjs docs/strategy/concepts/system-map/index.html --out .taste-skill/system-map/inspect --allow palette-purple`：0 FAIL、2 WARN。`lint.mjs`：0 FAIL、0 WARN。

| 保留的 WARN | 理由 |
|---|---|
| `no-real-pictures` | 本專案不用開放圖庫照片（`design-concept`「用 `taste-skill` 檢查原型」衝突表），影像改由 4 塊介面片段（U1–U4，每塊至少 300×200）與架構圖滿足 |
| `no-footage` | 同上，沒有昕力自己的影片素材；也不載站外影片 |

過程中修掉的 FAIL：第 2 段引言被判成「政府與公部門」上方的 eyebrow（引言改放在 h2 正下方），375 寬第 6 段最後一個「說明待補」被判成第 7 段標題的 eyebrow（段距加大）。

## 介面片段（全部是示意）

每塊根元素有 `data-ui`，標題列右側寫「示意」，`role="img"` 加說明。片段裡沒有數字（事實原文裡的 FIDO2 除外）。

| # | 位置 | 內容 | 文字來源 |
|---|---|---|---|
| U1 | hero M0 右側 | digiRunner 主控台：一列事實原文，三列「來源 → 去處」 | `fact:digirunner-console` 原文；其餘是 M0 的節點名稱 |
| U2 | 產品家族 SysTalk.ai 小圖的輸出端 | 模型選擇：「主流開源」「企業級 LLM」兩個選項與「選擇」 | 從 `fact:aiso-llm-support` 取的名稱（原文已在同段照引） |
| U3 | 產品家族 GadoSecurity 小圖的輸出端 | 登入確認：「FIDO2 無密碼」「零信任身分驗證」與「登入」 | `fact:gadodido-passwordless` 原文拆成兩列 |
| U4 | OrientAI 的企業端區塊 | 用量：Agent／權限、Token／用量、企業的資料／企業端 | 名稱與介面用語，不重複同段已照引的原文 |

## 375 寬的實際位置

Playwright，375×812，`reducedMotion: 'reduce'`，字型載入後量（`getBoundingClientRect().top + scrollY`）：

| 位置 | 實際 y（px） | 上限 |
|---|--:|--:|
| hero 結束（含 M0 直式） | 602 | 760 |
| 第 2 段 h2 | 666 | 840 |
| 第 3 段 h2 | 1,294 | 1,300 |
| 第一則案例的成果原文 | 1,442 | 1,560 |

第 3 段 h2 只比上限少 6px：第 2 段文字或間距再加長就會超過。字級種數：375 寬 5 種（40／28／19／16／14），1280 寬 5 種（96／44／22／17／14），inspector 在 1440 寬量到同樣 5 種。

## 與 directions.md 不同的調整

- U1 放在 M0 的右側 3 欄（與整張圖同高），不是緊貼 digiRunner 節點：貼在節點旁會讓新服務那一欄下方出現空洞
- hero 的接線改成載入後畫出一次，不隨捲動：M0 在第一屏內，用 scroll-driven 時載入當下的接線只畫了一半，看起來像壞掉。M1、M2、M3 與 375 寬的接線照 directions 隨捲動畫出
- 穩定度改成左文右 2×3，不是六項橫排：1280 寬六欄每欄約 177px，44px 的「2017、2019」放不下一行
- 節點的事實：每則事實全頁只顯示一次，所以 DigiLism、核心銀行系統、大型主機、ESB 這一組不重複 `fact:digilism-protocol-integration`，改成一句表述加連到產品段的連結。digiRunner 與既有的 WAF 顯示 `fact:digirunner-nginx-waf`，AI Gateway 與新服務顯示 `fact:digilism-family-digirunner`
- 第 4 段家族名稱用 lead（22px），不用 head，讓案例段的權重高於產品家族
- 導覽連結照 copy-deck 寫「產業、案例、產品、關於昕力」（directions 寫「成功案例」）

## 原型與 production 的差距

- 連結都是站內路徑，原型裡打不開；375 寬的「選單」只跳到頁尾導覽
- 事實手打進 HTML；production 用 `fact('<id>')`
- 樣式直接寫 token 的原始值，production 改用語意 token 與 `Surface` 元件
- 節點互動的 `aria-live` 只在桌機寬出現；375 寬沒有互動

## 待補與想讓人決定的事

- 第 8 段的回覆時間「待補」；第 6 段六項服務的說明「待補」（copy-deck「待補與待確認」第 1、2 項）
- 圖上的表述（「既有系統」「新的服務」「場景」「據點與設備」「申報資料」「使用者」「企業端」）要由人審
- 產品家族 2×2 的左欄（DigiLism、ESGswift）比右欄（帶片段的 SysTalk.ai、GadoSecurity）短，1280 寬左欄下方各有一塊空白；要補平可以把片段改放在左欄，或四格都放片段
- 375 寬沒有節點互動，`fact:digirunner-nginx-waf`、`fact:digilism-family-digirunner`、`fact:digirunner-console` 在手機上看不到。要放的話第 3 段 h2 會超過 1,300px
