# 動態規範

全站動態的參考：有哪些效果、用在哪些頁面、偏好減少動態時怎麼呈現，以及 3D 的效能預算。寫法規則（tokens、scroll-driven animation 的 longhand）在 [`design-system` skill 的「動態」](../../.claude/skills/design-system/SKILL.md#動態)，3D 的載入策略在 [ADR 0003](../decisions/0003-3d-island-loading.md)。

M3-08（#55）依 M3-07 選定的方向 B Modular Stack 整理。

## Tokens

只能用 `src/styles/tokens.css` 的值。`npm run check:design` 的 `token-usage.mjs` 擋下帶單位的時間、easing 關鍵字（`ease`、`ease-in-out`、`cubic-bezier()`、`steps()` 等），以及沒有指定 timing function、會套用瀏覽器預設 `ease` 的 `transition` 與 `animation`。

值與減少動態時的覆寫寫在 `tokens.css` 的 Motion 區塊與文末的 `@media (prefers-reduced-motion: reduce)`，`/design-system` 的「動態」「動態數值」「3D 場景」三組會顯示目前的值。

| token | 用途 | 減少動態時 |
|---|---|---|
| `--duration-fast` | 顏色、底線、caret 等小範圍的狀態變化 | 歸零 |
| `--duration-base` | 影片按鈕上浮、連結箭頭、`Faq` 的展開符號 | 歸零 |
| `--duration-slow` | 3D canvas 淡入 | 歸零 |
| `--ease-standard` | 顏色、透明度、展開等狀態變化 | 不變 |
| `--ease-out-expo` | 位移：上浮、箭頭 | 不變 |
| `--reveal-distance` | `Reveal` 進場時往上移的距離 | 不變（動畫本身不執行） |
| `--reveal-stagger` | `Reveal` 的 `delay` 每一級把捲動範圍的起點往後推的量 | 不變（動畫本身不執行） |
| `--tilt` | 目前沒有元件使用（#187 拿掉 `Card` 的傾斜） | 歸零 |
| `--lift` | 影片按鈕 hover 時的上浮 | 歸零 |

- scroll-driven animation 的 timing function 寫 `linear`：進度就是捲動位置，再加 easing 會讓捲動和畫面對不上。`token-usage.mjs` 只在同一條規則有 `animation-timeline` 時允許 `linear`
- `Reveal` 的錯開量是捲動距離，不是時間，所以用 `--reveal-stagger`，不用 `--delay-step`
- 3D 場景的運動（鏡頭路徑、方塊的拆解與漂浮、捲動進度的阻尼 `PROGRESS_DAMPING`）由捲動進度與經過時間算出，數值寫在 `src/lib/scene/`。這些不是 CSS 動畫，不用 tokens；偏好減少動態時整個場景不載入（見下方）

## 效果清單

「頁面」欄寫的是模板，模板對應哪些頁面見 `docs/ia/nodes.csv` 的 `template`。

| 效果 | 元件 | 頁面 | 觸發 | 減少動態時 |
|---|---|---|---|---|
| 3D 捲動場景（ribbon-route） | `HomeTemplate`、`src/lib/scene/ribbon/` | 首頁的 hero、產業與 AI 成果段，只有桌機（ADR 0003「ribbon-route」） | 捲動：鏡頭升到俯視再跟著頁面平移、hero 文字淡出、AI 成果逐則切換；載入後緞帶畫出一次（1.2 秒） | 不載入 three.js，顯示同一個世界渲染的靜態圖；執行中切換成減少動態時停止場景並回到靜態版 |
| 捲動進場 | `Reveal` | 首頁、offering、hub、listing、article、case-study 模板的卡片與區塊 | 元素捲進畫面 | 直接顯示在最終位置 |
| 捲動進度條 | `ScrollProgress` | `PageLayout` 的每一頁 | 頁面捲動 | 不輸出進度條 |
| 卡片標題換色 | `Card` | 有卡片的頁面 | hover、focus | 沒有傾斜、上浮與外框（#187），標題換色並加底線，減少動態時一樣 |
| 按鈕換色 | `Button` | 全站 | hover | 平塗，只換底色（#187），沒有上浮與光暈 |
| 影片按鈕上浮 | `VideoFacade` 的播放按鈕 | 有影片的頁面 | hover、focus | `--lift` 歸零，只換顏色，沒有過場 |
| 箭頭位移 | `Link`（獨立連結）、`FormPanel` 的錯誤連結 | 全站 | hover | 箭頭直接移到 hover 位置，沒有過場 |
| 展開符號旋轉 | `Faq`、`SiteHeader` 的 caret | offering 模板的 FAQ、header 選單 | 展開、收合 | 直接換成展開或收合的角度 |
| 開關滑動 | `ConsentBanner` 的類別開關 | 設定 GTM ID 時的每一頁 | 切換 | 直接換位置 |
| 顏色與底線變化 | `Breadcrumb`、`FilterBar`、`Pagination`、`SiteHeader` 等 | 全站 | hover、選取 | 直接換顏色 |
| 頁首換色 | `SiteHeader`、`InPageNav` | 全站 | 頁首下緣經過紫色段落（`data-surface="dark"`）時換成深色 surface，離開時換回（#179）；64rem 以上黏在頁首下方的目錄列一起換，觸發線在目錄列下緣；`--duration-fast` | 直接換色 |

只有 hover、focus 與展開時改變狀態的效果，減少動態時保留狀態的差異、拿掉過場（`--duration-*` 歸零）。狀態本身（箭頭的位置、展開的角度）是操作的回饋，不算動態。

### 3D 的使用範圍

真 3D 只用在首頁桌機版（ribbon-route 的緞帶場景，ADR 0003「ribbon-route」）。其他頁面與其他區塊：

- 要表達場景時用同一個世界渲染的靜態圖（`src/assets/design/ribbon/`，`scripts/design/ribbon-capture.mjs`）或 `Surface pattern="grid"` 的格線
- 閱讀頁（blog、法務、長文）不加裝飾性動態，只保留 `ScrollProgress`、`Reveal` 與互動元件的狀態變化

新的頁面類型要用真 3D 時，先在 issue 寫出理由，並照下方「效能預算」量測。

## 效能預算

| 項目 | 預算 | 目前 | 量測方式 |
|---|---|---|---|
| 每頁初始 JS（gzip） | 6 KB | 最大 3.0 KB（`/search`），3D 頁 2.7 KB | `node scripts/design/scene-budget.mjs`（`npm run check`） |
| 3D 延後載入的 JS（gzip） | 140 KB | 135.0 KB（`src/lib/scene/ribbon/runtime.ts`、`world.ts` 加 three.js，沒有 GSAP；2026-11-01，#167） | 同上 |
| 3D 頁的 Lighthouse performance（行動版） | ≥ 0.95 | 見下方 | `npm run check` 的 LHCI（`lighthouserc.cjs`）、`node scripts/design/lighthouse-3d.mjs` |
| 3D 初始化的每個 task（不節流） | 50 ms 以下 | 14–22 ms（ADR 0003「初始化的長任務」） | Chrome trace（headless Chromium，412×823、DPR 1.75）。`lighthouse-3d.mjs` 的「3D 長任務」欄是 Lighthouse 模擬節流後的時間（乘 4），會計入 TBT |
| 3D 等待上限 | fence 與 shader 的等待各有上限，超過就照常上頁 | `src/lib/scene/ribbon/runtime.ts` 的 `WAIT_LIMIT_MS`（ADR 0003「等待的上限」） | `node scripts/design/scene-wait.mjs`（`npm run check`） |
| LCP 元素 | hero 靜態圖，3D chunk 在 LCP 與 `load` 之後才請求 | 符合 | `lighthouse-3d.mjs` 不符合時 exit 1 |

- 「目前」的數字：main `f9ff8c1`、2026-10-29、`npm run build` 的輸出
- `scene-budget.mjs` 量 `dist/` 每個公開頁面（略過 `/design-system` 等內部頁）。初始 JS 是 HTML 引用的 module script、它們靜態 import 的 chunk，以及 inline script（JSON-LD 不算）；延後載入的 JS 是這些檔案以 `import()` 載入的 chunk 與它們的 import。壓縮用 zlib 預設的 gzip 等級，和 `scripts/lib/static-server.mjs` 相同，1 KB = 1024 bytes
- 超過預算時 `npm run check` 失敗。要調高預算，在 PR 寫出理由，並同時改 `scene-budget.mjs` 的 `INITIAL_BUDGET`、`DEFERRED_BUDGET` 與本表的「預算」欄；兩邊不一致時 `scene-budget.mjs` 也會失敗

### Lighthouse

`node scripts/design/lighthouse-3d.mjs`（雲端 session、headless Chromium 以 SwiftShader 軟體算圖、Lighthouse 預設的模擬節流，每頁 3 次取中位數）：

| 頁面 | 行動版 | 桌機 |
|---|---|---|
| `/` | 0.98（0.97、0.98、0.98；TBT 0 ms，不載 3D） | 0.71（0.71、0.71、0.71；TBT 1,102 ms） |

2026-11-02，#167 階段二（ribbon-route）。行動版量到的是靜態版；桌機的長任務落在 3D 上頁後 1.2 秒的緞帶畫出動畫，細節見 ADR 0003「ribbon-route」的「結果（#167 階段二）」。產品頁不再有 3D。

headless Chromium 的 TBT 偏高，當成上限看；真機待 preview 部署後量測（ADR 0003「結果」）。

### 行動版降級

手機、觸控裝置與 64rem 以下的視窗不載入 3D，顯示同一個世界渲染的靜態圖（`src/lib/scene/tiers.ts` 的 `LIVE`，ADR 0003「ribbon-route」）。以下情況也完全不載入 3D：`prefers-reduced-motion: reduce`、`navigator.connection.saveData`、瀏覽器不支援 WebGL 2。

## 改到動態後要跑的檢查

- 改 tokens 或元件的動態：`npm run check:design`
- 改 `src/lib/scene/` 或首頁的 3D 段落：`lighthouse-3d.mjs`、`a11y-smoke.mjs`（ADR 0003「量測」）與 `npm run check` 的 `scene-wait.mjs`；改了世界或 `--map-*`、`--ribbon-*` 時重跑 `node scripts/design/ribbon-capture.mjs` 更新靜態圖
- 改 `Reveal`、`ScrollProgress`：`node scripts/design/a11y-smoke.mjs`（含 reduced motion），以及 `npm run check` 的 `axe.mjs`（以 reduced motion 執行）
