# 動態規範

全站動態的參考：有哪些效果、用在哪些頁面、偏好減少動態時怎麼呈現，以及 3D 的效能預算。寫法規則（tokens、scroll-driven animation 的 longhand）在 [`design-system` skill 的「動態」](../../.claude/skills/design-system/SKILL.md#動態)，3D 的載入策略在 [ADR 0003](../decisions/0003-3d-island-loading.md)。

M3-08（#55）依 M3-07 選定的方向 B Modular Stack 整理。

## Tokens

只能用 `src/styles/tokens.css` 的值。`npm run check:design` 的 `token-usage.mjs` 擋下帶單位的時間、easing 關鍵字（`ease`、`ease-in-out`、`cubic-bezier()`、`steps()` 等），以及沒有指定 timing function、會套用瀏覽器預設 `ease` 的 `transition` 與 `animation`。

值與減少動態時的覆寫寫在 `tokens.css` 的 Motion 區塊與文末的 `@media (prefers-reduced-motion: reduce)`，`/design-system` 的「動態」「動態數值」「3D 場景」三組會顯示目前的值。

| token | 用途 | 減少動態時 |
|---|---|---|
| `--duration-fast` | 顏色、底線、caret 等小範圍的狀態變化 | 歸零 |
| `--duration-base` | 按鈕上浮、連結箭頭、`Faq` 的展開符號 | 歸零 |
| `--duration-slow` | 卡片傾斜、3D canvas 淡入 | 歸零 |
| `--duration-loop` | 循環動畫的一個週期（`LayerStack` 節點的脈動） | 歸零 |
| `--delay-step` | 依序開始的元素之間的間隔（`LayerStack` 的節點） | 歸零 |
| `--ease-standard` | 顏色、透明度、展開等狀態變化 | 不變 |
| `--ease-out-expo` | 位移：上浮、傾斜、箭頭 | 不變 |
| `--reveal-distance` | `Reveal` 進場時往上移的距離 | 不變（動畫本身不執行） |
| `--reveal-stagger` | `Reveal` 的 `delay` 每一級把捲動範圍的起點往後推的量 | 不變（動畫本身不執行） |
| `--tilt` | 卡片 hover 時的傾斜 | 歸零 |
| `--lift` | 卡片、按鈕、影片按鈕 hover 時的上浮 | 歸零 |

- scroll-driven animation 的 timing function 寫 `linear`：進度就是捲動位置，再加 easing 會讓捲動和畫面對不上。`token-usage.mjs` 只允許這一個關鍵字
- `Reveal` 的錯開量是捲動距離，不是時間，所以用 `--reveal-stagger`，不用 `--delay-step`
- 3D 場景的運動（鏡頭路徑、方塊的拆解與漂浮、捲動進度的阻尼 `PROGRESS_DAMPING`）由捲動進度與經過時間算出，數值寫在 `src/lib/scene/`。這些不是 CSS 動畫，不用 tokens；偏好減少動態時整個場景不載入（見下方）

## 效果清單

「頁面」欄寫的是模板，模板對應哪些頁面見 `docs/ia/nodes.csv` 的 `template`。

| 效果 | 元件 | 頁面 | 觸發 | 減少動態時 |
|---|---|---|---|---|
| 3D 捲動場景 | `Scene3D`、`SceneChapter` | 首頁；offering 模板中 parent 屬於 `SCENE_FAMILIES`（`src/lib/scene/families.ts`）的產品與解決方案頁，只用在 hero 與功能章節。目前 60 個公開頁面 | 捲動、時間、滑鼠（只有桌機 tier） | 不載入 three.js，只顯示 hero 的靜態圖 `Backdrop`；執行中切換成減少動態時停止場景並移除 canvas。章節背景維持不透明 |
| 3D canvas 淡入 | `Scene3D` | 同上 | 第一個 frame 畫完 | 不發生（場景不載入） |
| CSS 偽 3D 圖層 | `LayerStack` | 首頁的 Orient AI 區塊 | 捲動分開圖層與光束；節點循環脈動 | 圖層疊在一起、光束不拉長，節點不脈動 |
| 捲動進場 | `Reveal` | 首頁、offering、hub、listing、article、case-study 模板的卡片與區塊 | 元素捲進畫面 | 直接顯示在最終位置 |
| 捲動進度條 | `ScrollProgress` | `PageLayout` 的每一頁 | 頁面捲動 | 不輸出進度條 |
| 卡片傾斜與上浮 | `Card` | 有卡片的頁面 | hover、focus | `--tilt`、`--lift` 歸零，只剩漸層外框與光暈，沒有過場 |
| 按鈕上浮 | `Button`、`VideoFacade` 的播放按鈕 | 全站 | hover、focus | `--lift` 歸零，只換顏色，沒有過場 |
| 箭頭位移 | `Link`（獨立連結）、`FormPanel` 的錯誤連結 | 全站 | hover | 箭頭直接移到 hover 位置，沒有過場 |
| 展開符號旋轉 | `Faq`、`SiteHeader` 的 caret | offering 模板的 FAQ、header 選單 | 展開、收合 | 直接換成展開或收合的角度 |
| 開關滑動 | `ConsentBanner` 的類別開關 | 設定 GTM ID 時的每一頁 | 切換 | 直接換位置 |
| 顏色與底線變化 | `Breadcrumb`、`FilterBar`、`Pagination`、`SiteHeader` 等 | 全站 | hover、選取 | 直接換顏色 |

只有 hover、focus 與展開時改變狀態的效果，減少動態時保留狀態的差異、拿掉過場（`--duration-*` 歸零）。狀態本身（箭頭的位置、展開的角度）是操作的回饋，不算動態。

### 3D 的使用範圍

真 3D（`Scene3D`）只用在上表的頁面，而且只放 hero 與緊接在後的章節（ADR 0003「與『預設零 client JS』的關係」）。其他頁面與其他區塊：

- 要表達層次或模組時用 CSS 偽 3D：`LayerStack`、`Card` 的傾斜，視角共用 `--perspective` 與 `--scene-angle-*`
- 要表達場景時用 `Surface pattern="grid"` 的格線或 `Backdrop` 的靜態圖
- 閱讀頁（blog、法務、長文）不加裝飾性動態，只保留 `ScrollProgress`、`Reveal` 與互動元件的狀態變化

新的頁面類型要用真 3D 時，先在 issue 寫出理由，並照下方「效能預算」量測。

## 效能預算

| 項目 | 預算 | 目前 | 量測方式 |
|---|---|---|---|
| 每頁初始 JS（gzip） | 6 KB | 最大 3.0 KB（`/search`），3D 頁 2.7 KB | `node scripts/design/scene-budget.mjs`（`npm run check`） |
| 3D 延後載入的 JS（gzip） | 140 KB | 130.6 KB（runtime 加 three.js 128.5 KB，場景 2.1 KB） | 同上 |
| 3D 頁的 Lighthouse performance（行動版） | ≥ 0.95 | 見下方 | `npm run check` 的 LHCI（`lighthouserc.cjs`）、`node scripts/design/lighthouse-3d.mjs` |
| 3D 初始化的每個 task（不節流） | 50 ms 以下 | 14–22 ms（ADR 0003「初始化的長任務」） | Chrome trace（headless Chromium，412×823、DPR 1.75）。`lighthouse-3d.mjs` 的「3D 長任務」欄是 Lighthouse 模擬節流後的時間（乘 4），會計入 TBT |
| 3D 等待上限 | fence、shader 各 1 秒 | `WAIT_LIMIT_MS = 1000` | `node scripts/design/scene-wait.mjs`（`npm run check`） |
| LCP 元素 | hero 靜態圖，3D chunk 在 LCP 與 `load` 之後才請求 | 符合 | `lighthouse-3d.mjs` 不符合時 exit 1 |

- 「目前」的數字：main `f9ff8c1`、2026-10-29、`npm run build` 的輸出
- `scene-budget.mjs` 量 `dist/` 每個公開頁面（略過 `/design-system` 等內部頁）。初始 JS 是 HTML 引用的 module script、它們靜態 import 的 chunk，以及 inline script（JSON-LD 不算）；延後載入的 JS 是這些檔案以 `import()` 載入的 chunk 與它們的 import。壓縮用 zlib 預設的 gzip 等級，和 `scripts/lib/static-server.mjs` 相同，1 KB = 1024 bytes
- 超過預算時 `npm run check` 失敗。要調高預算，在 PR 寫出理由，並同時改 `scene-budget.mjs` 的 `INITIAL_BUDGET`、`DEFERRED_BUDGET` 與本表的「預算」欄；兩邊不一致時 `scene-budget.mjs` 也會失敗

### Lighthouse

`node scripts/design/lighthouse-3d.mjs`（雲端 session、headless Chromium 以 SwiftShader 軟體算圖、Lighthouse 預設的模擬節流，每頁 3 次取中位數）：

| 頁面 | 行動版 | 桌機 |
|---|---|---|
| `/` | 0.99（0.98、0.99、0.99；TBT 55 ms） | 1（TBT 0 ms） |
| `/products/digirunner` | 0.98（0.98、0.98、0.98；TBT 17 ms） | 1（TBT 0 ms） |

2026-10-29，main `f9ff8c1` 加上本 issue 的 token 與檢查（3D 的程式沒有改）。四次量測的 LCP 元素都是 hero 靜態圖，3D chunk 都在實測 LCP 與 `load` 之後才請求。

headless Chromium 的 TBT 偏高，當成上限看；真機待 preview 部署後量測（ADR 0003「結果」）。

### 行動版降級

`(width < 64rem), (pointer: coarse)` 的裝置用行動版 tier（`src/lib/scene/tiers.ts` 的 `LOW_POWER`），在場景啟動時決定，視窗縮放跨過條件時重建。行動版降低 `devicePixelRatio` 上限（`maxDpr`）與方塊數量（`density`），關掉 antialias 與滑鼠視差（`parallax`），鏡頭只沿一個方向移動（`path: 'dolly'`）。數值只寫在 `tiers.ts` 的 `TIERS`。

以下情況完全不載入 3D，只顯示靜態圖：`prefers-reduced-motion: reduce`、`navigator.connection.saveData`、瀏覽器不支援 WebGL 2。

## 改到動態後要跑的檢查

- 改 tokens 或元件的動態：`npm run check:design`
- 改 `Scene3D`、`src/lib/scene/` 或用到它們的頁面：ADR 0003「量測」的 script（`lighthouse-3d.mjs`、`a11y-smoke.mjs`、`scene-capture.mjs`），`scene-capture.mjs` 也檢查減少動態時沒有 canvas、沒有 3D chunk 的請求
- 改 `Reveal`、`LayerStack`、`ScrollProgress`：`node scripts/design/a11y-smoke.mjs`（含 reduced motion），以及 `npm run check` 的 `axe.mjs`（以 reduced motion 執行）
