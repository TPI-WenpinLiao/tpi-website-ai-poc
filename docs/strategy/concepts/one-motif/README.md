# One motif（`one-motif`）

#166 第 3 階段的首頁原型。發牌結果與 redraw 見 [`sheet.md`](sheet.md)（seed 259476857）；文字照 [`../copy-deck.md`](../copy-deck.md)，五個方向相同。

> logo 符號灰色塊的斜切頂邊（左低右高的一道弧），成為全頁唯一的形狀：hero 與案例的資料夾頁籤、每張圖與介面片段的遮罩、按鈕的上緣、產品與 OrientAI 之間那條全寬色帶、清單的項目符號、頁尾用色塊拼出的 TPISOFTWARE。

- 打開：`index.html`（從 `file://` 離線可開；CSS 在 `style.css`，JS 在 `main.js`，字型、logo、圖片在 `assets/`）
- 截圖：`shot-375-first.png`、`shot-1280-first.png`（第一屏）、`shot-375.jpg`、`shot-1280.jpg`（整頁，`node scripts/strategy/concept-shots.mjs --only one-motif` 產生）
- 可以操作的一件事：第 2 段金融的「金融檢查」列，`fact:digirunner-financial-inspection` 原文拆成 9 個可勾選的項目，勾選後下方列出勾了哪些。沒有 script 時清單照樣全部顯示，也能勾選
- signature move：「Index with preview」。滑鼠指到第 2 段的某一列（或鍵盤焦點進到該列），左欄的那張圖換成這一列的場域，其他列退成次要色；圖說跟著換

## 主要視覺決定

| 決定 | 怎麼做 | 原則 |
|---|---|---|
| 第一屏只有字與資料夾 | 深橄欖底，h1 置中兩行（1280 寬 115px、375 寬 41px），說明句緊接在下；下半部是五個資料夾，頁籤寫段落短名，最前面那個打開，裝著「聯絡業務」與「依產業看方案」。沒有任何影像搶 h1 | P1 |
| 同一個形狀只用在「動作」與「證據的容器」 | 頁籤、按鈕上緣、圖片遮罩、色帶都取 logo 灰色塊的同一條曲線（`index.html` 開頭的 `#m-tab`、`#m-plate`、`#m-btn`），沒有第二種裝飾形狀 | P4 |
| 事實是原文，放在固定位置 | 第 2 段「短標＋「原文」」一列一條；案例是「頁籤（案例名）→ 作業 → 成果原文 → 連結」；穩定度是「原文＋年份」兩欄。原文用內文字體與「」，表述用標題字體 | P2 |
| 介面片段畫「接上」 | DigiLism 片段是 AI Gateway 上的 MCP 協定與企業 API 開關；理賠片段是「解析診斷書 → 理賠立案 → 派件」；OrientAI 是部署在企業端的管控開關。標籤只用事實裡的詞 | P3 |
| 段落順序照讀者的判斷 | 是不是為我做（hero、產業）→ 做得到嗎（案例、產品）→ 全寬色帶 → 安不安心（OrientAI、導入、穩定度）→ 聯絡。色帶就是兩半的分界 | P5 |
| 色彩：一個橄欖色系 | 骨白底、橄欖字；資料夾與欄位用同一橄欖的四個明度（`#4a5720`、`#5d683a`、`#b9bc9d`、`#d3d1c7`）。品牌紫只在 logo 與「聯絡業務」 | P4 |
| 動態只標示狀態 | 資料夾載入時依序升起；段落內容隨捲動依閱讀順序進場；色帶隨捲動長高；指到列換圖；勾選時符號填色 | P4 |

## 與現有限制的差異

| 項目 | 原型 | 現有限制與代價 |
|---|---|---|
| 西文字型 | 3 個 woff2，共 57,580 bytes：Libre Franklin 700（15,960）、Source Serif 4 400（20,088）、600（21,532），只有 latin subset | 現站用的是系統字與既有字型設定；這個方向要加兩個字族，`font-subsets.mjs` 的預算要重算 |
| 中文字型 | 不載 webfont，落到系統字（截圖環境是 WenQuanYi Zen Hei，Mac 會是 PingFang TC）。內文想要的明體在多數 Windows、Linux 上沒有，會落到黑體 | 照現有限制。標題與內文的中文在不同平台長相不同，「報紙頭版」的配對只在拉丁字母上成立 |
| JS | `main.js` 3,776 bytes（gzip 約 1.7 KB），沒有函式庫 | 在現有 JS 預算內 |
| 3D | 不用 | 不需要 ADR 0003 的 3D 載入 |
| 色彩 token | 新增骨白、橄欖與四個明度，品牌紫只留兩處 | 要換掉 `tokens.css` 的整組底色與文字色；深色科技感（現行 hero）整個不用 |
| 影像規範 | 圖與介面片段都套 logo 曲線的遮罩（`clip-path`），不是方角 | `design-system`「影像」目前沒有遮罩規則，要新增一條「只有這一個形狀」 |
| 動態 | 進場用 CSS scroll-driven animation（`animation-timeline: view()`），只往前填，不支援的瀏覽器直接顯示完成狀態 | `docs/design/motion.md` 沒有 scroll-driven 的寫法，要補 |

### 按鈕對比

- 紫色按鈕在骨白底：7.52:1；白字對紫底：8.97:1
- 紫色對橄欖底只有 1.15:1，所以深色區不直接放紫色按鈕：hero 的按鈕放在打開的骨白資料夾裡，聯絡段的按鈕放在骨白的 motif 色塊上，header 是骨白色帶
- 其他：橄欖字對骨白 8.69:1；次要色 `#5d683a` 只用在骨白底（5.02:1）；深色底的次要字用 `#c3c7a8`（5.95:1）

## Inspector 最終結果

`CHROME_PATH=$PWD/scripts/strategy/chromium.sh node .claude/skills/taste-skill/scripts/inspect.mjs docs/strategy/concepts/one-motif/index.html --out .taste-skill/one-motif/inspect --allow palette-purple`

**0 FAIL、3 WARN**（1440、768、390）。`lint.mjs`：0 FAIL、0 WARN。`concept-shots.mjs --only one-motif`：exit 0。

保留的 WARN：

| WARN | 理由 |
|---|---|
| `card-rows`（1440、768） | 第 6 段照 blueprint「One card, four fields」：同一張導入卡出現四次，每次往前一步。卡片相同是要點，不是卡片格 |
| `no-footage` | 開放圖庫找不到誠實的片段：NASA 影片庫連不上，Wikimedia Commons 整段 session 都回 429。也沒有昕力自己的影片 |
| `ragged-edges`（768） | 平板寬的第 2 段是「左欄引言＋圖、右欄產業與表格」三條起始線，加上案例與產品板的內距。桌機與手機沒有這個警告 |

## 最後一輪評語

```
ROUND 3
Seen in one second: 深橄欖底上兩行大字「金融與政府的系統 接上 API 與 AI」，下面一疊有頁籤的資料夾，最前面那個是開著的、裡面有紫色的「聯絡業務」。
Idea (one sentence): logo 灰色塊的斜切弧，成為頁籤、按鈕、圖片遮罩、全寬色帶與頁尾字塊的唯一形狀。
Live thing: 勾選金融檢查的 9 項 API 管理作業（原文），下方列出勾了哪些。
Layout words by section: hero=資料夾堆 / 產業=陳述加右推的表格與預覽框 / 案例=有頁籤的資料夾帶 / 產品=特寫拼板 / OrientAI=方形色塊與分頁 / 導入=一張卡四個欄位 / 穩定度=側欄事實加寬段落 / 聯絡=反色收尾 / 頁尾=用 motif 拼出的字
Scores: design 7 · usability 7 · creativity 7 · content 6 → overall 6.8
Caps applied: 無
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. 第 2 段的表格欄位很窄，臺北市政府那條原文在 1440 寬排成六行，整段看起來是一長串小字（desktop-page-01）。修法：把右欄加寬到 7/12 並讓長原文跨到短標下方，或把具名案例移到案例段
2. 圖片只有三張真實的（銀行券、帳簿、臺北市政府），其中銀行券出現兩次；案例與 OrientAI 用介面片段補（desktop-page-02）。修法：Commons 不限流後補診斷書、病歷檔、機房的照片（見「待補」）
3. hero 的打開資料夾下半部是空的骨白（desktop-fold），375 寬說明句與資料夾之間有一段空的橄欖。修法：把「依產業看方案」改成兩個產業的入口連結（金融、政府與公部門），填滿打開的資料夾
```

前兩輪修過的：第 7 段側欄事實與紀錄從 13px 改成內文字級（太小、看起來沒做完）；去掉案例段的 sticky 疊放（inspector 判定文字被蓋住）；平板與手機的段落高度改成依內容（空白段落）；進場改成 scroll-driven（手機頁面超過 inspector 走得到的 11 屏，原本用 IntersectionObserver 的內容在檢查時沒有出現）；頁尾字塊改成 inline SVG。

## 圖片出處

`node .claude/skills/taste-skill/scripts/assets.mjs --credits`（在本目錄執行）的輸出，頁尾也有同樣的出處：

- `assets/cityhall.jpg`：“Taipei City Hall front 20230417” by Yu tptw, CC BY-SA 4.0, via Wikimedia Commons. https://commons.wikimedia.org/w/index.php?curid=130819377 （縮成 1600px 寬，頁面上依框裁切；share-alike）
- `assets/ledger.jpg`：“Account Book Ledger” by John Carlin, 1835–56, public domain (CC0), via The Metropolitan Museum of Art. https://www.metmuseum.org/art/collection/search/20365
- `assets/banknotes.jpg`：“American Bank Notes of various denominations” by Asher Brown Durand, 1828–31, public domain (CC0), via The Metropolitan Museum of Art. https://www.metmuseum.org/art/collection/search/369614

圖用在哪裡、代表什麼：銀行券是「銀行」這個場域（開放銀行兩列、阻詐案例）；帳簿是「檢查與盤點」（金融檢查列）；臺北市政府大樓只當政府場域（共通性規範、惡意行為防護、臺北市政府三列），不代表昕力做的系統畫面。三張都不是昕力的產品、客戶或辦公室。

字型：Libre Franklin、Source Serif 4，SIL Open Font License 1.1（`assets/LICENSE-*.txt`）。logo：`src/assets/brand/logo-horizontal-color.svg`、`logo-horizontal-white.svg` 的複本。

## 介面片段（`data-ui`）哪些是示意

全部是原型畫的版面，不是產品的真實畫面；每個片段內都有「示意」標籤。標籤文字的來源：

| 片段 | 位置 | 標籤取自 |
|---|---|---|
| AI Gateway：MCP 協定、企業 API 開關 | 產品板 DigiLism | `fact:digilism-family-digirunner` |
| LLM：70B 模型 | 產品板 SysTalk.ai | `fact:aiso-llm-support` |
| FIDO2 開關 | 產品板 gadoDIDO | `fact:gadodido-passwordless` |
| 日誌／異常 | 產品板 gadoScout | `fact:gadoscout-ml-detection` |
| 碳盤查、CBAM、碳足跡 鍵帽 | 產品板 ESGswift | `fact:greenswift-scope` |
| 解析診斷書 → 理賠立案 → 派件 | 案例 AI 智慧理賠 | `fact:smartclaim-result` |
| 醫療單據：免模板辨識、格式變動 | 案例 AI 智慧建檔 | `fact:smartfilling-result` |
| OrientAI：企業端；AI Agent 統一管控、Token 用量監控、消除影子 AI、跨部門統一權限管理 | OrientAI 方形色塊 | `fact:orientai-on-prem-data`、`fact:orientai-governance-layer` |
| SysTalk.ai 的 AI 導入卡（導入前、導入中與四個項目） | 導入段 | `fact:systalk-ai-onboarding` |

開關的「開」、項目的「已完成」「目前」是示意狀態，不是產品的實際設定或進度。

## 與 sheet 不同的調整

| sheet 寫的 | 原型 | 理由 |
|---|---|---|
| hero 頂列：wordmark 置中、最右一個文字連結 | 左邊 4 個連結、中間彩色 logo、右邊「聯絡業務」，放在骨白色帶上 | 任務要求 header 有 3–5 個連結與主要動作；紫色按鈕在橄欖底不夠對比 |
| h1 10vw、資料夾從 51% 高開始、每層錯開 64px | h1 9vw（1280 寬 115px），錯開 `clamp(36px, 5.2svh, 56px)`，資料夾從底部往上算 | 1280×800 時 10vw 的兩行 h1 加說明句會壓到資料夾，前面那個打開的資料夾與按鈕會掉出第一屏 |
| 頁籤高 40–44px | hero 52px、案例 60px | logo 曲線左端在頁籤高度約 40% 處，44px 的頁籤左半放不下 18–26px 的字 |
| 案例資料夾 `position: sticky` 疊起來 | 一般流動，下一個資料夾的頁籤壓在上一個的底邊 | sticky 疊放會蓋住上一則的成果原文，inspector 判 FAIL（covered-text）；保留資料夾的樣子，不保留捲動時疊起 |
| 案例三張 16:10 照片（診斷書、醫療單據、銀行櫃檯） | 前兩則是介面片段，第三則是銀行券 | Wikimedia Commons 整段 session 回 429，下載不到（見「待補」）；sheet §5 允許軟體公司用自己的介面片段當圖 |
| OrientAI 方形照片（機櫃） | OrientAI 管控片段放在 motif 形狀的鼠尾草色塊上 | 同上；sheet §5「有產品介面時放在 motif 形狀的平塗色塊上」 |
| `list` 每一列一張預覽圖、觸控時每列內嵌縮圖 | 三張圖對六列；手機只顯示一張靜態圖，放在表格後面、靠右 60% 寬 | 可用的圖只有三張；手機上六張內嵌圖會讓頁面再長一倍 |
| showcase 三個分頁 | 五個分頁（copy-deck 第 5 段的五項特色） | 寫滿內容；沒有 script 時五個面板全部顯示 |
| showcase 兩個動作格 | 「認識 OrientAI」與「AI（SysTalk.ai）產品」 | 第二格放「聯絡業務」就得用紫色，紫色在橄欖底不夠對比 |
| how-it-works 每欄底部一句以順序詞開頭的子句 | 「導入前，先做 AI 導入情境分析」等，是 `fact:systalk-ai-onboarding` 的片段加上順序詞 | 表述由人審；說明句與服務連結移到四欄下方 |
| about 側欄 13px、紀錄 13px、欄寬 160px | 內文字級，側欄 240px | 13px 的長原文看起來沒做完（第一輪評語） |
| footer 字塊用 HTML 方塊 | inline SVG，每塊用 motif 曲線切頂，字母挖空 | inspector 不把單一字母當內容，判成空白段 |
| 進場動畫用 IntersectionObserver | CSS scroll-driven，只往前填 | 手機頁面 16 屏，inspector 只走 11 屏，剩下的內容檢查時一直是透明的；改成「還沒捲到時就是完成狀態」 |
| 字型從 Google Fonts 載入 | `npm pack @fontsource/libre-franklin`、`@fontsource/source-serif-4`，只複製用到的 3 個 woff2 | 原型要離線開。沒有 preload：`file://` 下帶 `crossorigin` 的 preload 會被 CORS 擋 |

## 待補

| # | 事項 | 位置 |
|---|---|---|
| 1 | 案例的場域照片：診斷書（候選 `commons:194799169`）、病歷檔（`commons:141417949`）；OrientAI 的機櫃照片（`commons:55873130`）。Commons 回 429，沒有下載到 | 案例、OrientAI |
| 2 | 聯絡後多久回覆（頁面上寫「回覆時間：待補」） | 聯絡段 |
| 3 | 六項服務各一句說明（頁面上寫「每項服務的一句說明：待補」） | 導入段 |
| 4 | copy-deck「待補與待確認」的其他各項（證言、第 2 段多出的四條事實、h1 長度、金融與政府的排序） | 全頁 |
| 5 | 一段可以當 muted loop 的影片 | — |
