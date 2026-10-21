---
name: design-system
description: 撰寫或修改任何樣式、元件時使用。說明亮暗雙 surface、光與景深、捲動動態、token 分層與命名、斷點、基礎元件與檢查方式。
---

# Design system

> 狀態：M3-02（#15）定案 tokens 與基礎元件，M3-03（#16）補齊 `/design-system` 展示頁。3D 方向專屬的細節（粒子色、方塊材質）等 M3-07 選定後在 M3-04 補上，M3 收尾 issue 再更新本檔。

## 設計方向

網站是有景深的場景：敘事頁（首頁、產品、方案）放在深色 surface 上，底下是 3D 捲動場景（M3-07），內容是浮在場景上的玻璃圖層；閱讀頁（blog、法務、長文）用亮色 surface。

- 光標示資料與互動：紫、品紅、橘的能量漸層與光點只用在線條、外框、焦點、hover，不當文字的底色
- 動態跟著捲動：進場、圖層分離、進度條都用 CSS scroll-driven animation，不加 client JS

## 規則

- 所有樣式值（色彩、字級、行高、間距、圓角、陰影、斷點、角度、動畫時間）只能引用 `src/styles/tokens.css` 的 CSS custom properties
- 需要新 token 時先加到 `tokens.css` 並在 PR 中說明用途，不得在元件內寫死數值
- 不使用 UI framework 或 utility CSS framework
- 元件樣式寫在 `.astro` 的 scoped `<style>`；全域樣式只放在 `BaseLayout`（`box-sizing`、`body`、`[data-surface='dark']`、`:focus-visible`、`.sr-only`）
- 頁面元件在 `src/components/ui/`，新元件同步加到 `/design-system`，寫法見「展示頁」

## 尺寸計算

`BaseLayout` 把所有元素設成 `box-sizing: border-box`：`min-height`、`width` 包含 padding 與邊框。

- 元件的 `min-height: var(--touch-target)` 就是實際高度，不必扣 padding
- `max-width` 代表內容寬度、外面再加左右 padding 的容器（`Surface` 的 `.inner`），寫 `box-sizing: content-box`，讓 `--content-max-width`、`--reading-max-width` 維持內容寬度
- 沒有這條規則時，`<a>` 按鈕與 `input` 是 content-box，`<button>`、`<select>` 在瀏覽器預設樣式裡是 border-box，同一個元件會因輸出的標籤不同而高度不同（#16 實測：`<a>` 的 lg 按鈕 76px，應為約 48px）

## 亮暗 surface

`:root` 是亮色 surface。任何元素加上 `data-surface="dark"`，底下所有語意色彩 token 都換成深色值，`BaseLayout` 也會替它畫上底色與文字色。元件不寫深色變體，一律用語意 token。

- 頁面區塊用 `Surface`（`tone="dark" | "light"`）切換，不要自己寫 `data-surface`
- 新增語意色彩 token 時，`:root` 與 `[data-surface="dark"]` 兩邊都要給值
- 新增會疊在一起使用的色彩 token 時，把前景／背景配對加進 `scripts/design/contrast.mjs` 的 `PAIRS`；兩個 surface 都會檢查

## Token 分層

| 層 | 命名 | 誰能用 |
|---|---|---|
| primitive | `--purple-*`、`--magenta-*`、`--orange-*`、`--ink-*`、`--red-*`、`--green-*` | 只在 `tokens.css` 內被引用 |
| semantic | `--color-*`、`--glass-*`、`--glow-*`、`--gradient-energy`、`--shadow-*` | 元件 |
| scale | `--font-size-*`、`--space-*`、`--radius-*`、`--duration-*`、`--scene-*` 等 | 元件直接用 |

- 品牌色沿用現站（2026-10-21 審核確認）：紫 `--purple-700`（`#662e8d`）、品紅 `--magenta-500`（`#b824d1`）、橘 `--orange-500`（`#ff6329`）。橘 500 對白只有 2.97:1，只當裝飾（`--color-accent`）
- glass（`--glass-bg`）是半透明面板，背後可能是 3D 場景最亮的地方。對比以 `--scene-worst`（該 surface 最不利的背景）合成後計算
- 字型：`--font-sans` 是 Inter＋系統中文字；`--font-mono`（JetBrains Mono）只用在編號、eyebrow、資料標籤。兩者都在 `BaseLayout` import，不載中文 webfont
- 3D：`--scene-angle-x`、`--scene-angle-z` 是共用的等角視角，`--perspective` 是共用透視距離。M3-07 的 three.js 相機要對齊這兩個值，靜態版與 3D 版才會重疊
- `--wf-*` 只給 M3-01 wireframe 用，M4-04 後隨 wireframe 刪除，新元件不得引用

## 斷點

`@media` 不能讀 custom property，斷點寫在 `src/styles/media.css` 的 `@custom-media`，build 時由 Lightning CSS 展開（`astro.config.mjs` 的 `drafts.customMedia`）：

| 名稱 | 條件 |
|---|---|
| `--bp-sm-up` | `width >= 40rem` |
| `--bp-lg-up` | `width >= 64rem` |
| `--bp-lg-down` | `width < 64rem` |

用斷點的 `<style>` 要先 `@import` media.css（路徑相對於該檔），漏掉時 build 失敗：

```astro
<style>
  @import '../../styles/media.css';

  @media (--bp-lg-up) {
    .grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  }
</style>
```

## 捲動動態

- 用 `animation-timeline: view()`、`scroll()` 或具名的 `view-timeline`，包在 `@supports (animation-timeline: view())` 與 `@media (prefers-reduced-motion: no-preference)` 裡；不支援或偏好減少動態時，畫面要停在完成狀態
- **只寫 longhand**（`animation-name`、`animation-timing-function`、`animation-fill-mode`、`animation-timeline`、`animation-range`），不要寫 `animation` shorthand。Lightning CSS 會把 shorthand 和 `animation-timeline` 合併成 `animation: … view()`，瀏覽器不接受，整個動畫失效；`scripts/design/dist-css.mjs` 會擋
- 不要讓 LCP 元素（hero 標題、hero 靜態圖）用 `Reveal` 或任何從透明開始的動畫
- 時間一律用 `--duration-*`，`prefers-reduced-motion: reduce` 時在 `tokens.css` 歸零，`--tilt`、`--lift` 也歸零

## 基礎元件

| 元件 | 用途 | 重點 |
|---|---|---|
| `Surface` | 頁面區塊 | `tone` 切換亮暗；`pattern="grid"` 畫由上往下淡出的座標格線；`width="reading"` 收窄到閱讀寬度 |
| `PageHero` | 頁面開場 | 預設深色＋格線；輸出該頁唯一的 h1（display 字級）；`visual` slot 放 3D 場景或其靜態版本 |
| `LayerStack` | 3D 場景的靜態版本 | CSS 3D 玻璃圖層＋能量光束，捲出畫面時分開；裝飾用，`aria-hidden` |
| `SectionHeading` | 區塊標題 | `index`（`01`）＋mono eyebrow＋漸層線；`level` 由呼叫端指定，避免跳級；`size="display"` 每頁最多一次 |
| `Button` | 動作或按鈕樣式的連結 | 有 `href` 輸出 `<a>`，沒有輸出 `<button>`（預設 `type="button"`）；小圓角（`--radius-md`）；primary 發光上浮、secondary 漸層外框、text；`disabled` 只存在於 `<button>` |
| `Link` | 內文連結、獨立連結 | 內文連結一律底線；`external` 加 ↗ 與「（外部網站）」螢幕閱讀器文字 |
| `Tag` | 標籤 | `neutral`、`brand`、`node`（mono＋發光點，用於模組與技術關鍵字）；有 `href` 才是連結 |
| `Card` | 列表卡片 | 玻璃面板，hover／focus 時傾斜、亮起漸層外框；整卡可點，但只有標題一個連結；圖片 `alt` 必填 |
| `FormField` | 表單欄位 | `kind` 區分 text／email／tel／textarea／select／checkbox；hint、error 以 `aria-describedby` 連到欄位，error 加 `aria-invalid` |
| `Backdrop` | 區塊背景圖 | 放進 `Surface`／`PageHero` 的 `backdrop` slot；`fade`（`hero`／`bottom`／`none`）、`strength="soft"`、`priority`（LCP 圖才加）；alt 一律留空 |
| `Reveal` | 捲動進場 | `delay` 0–3 錯開同一列的元素 |
| `ScrollProgress` | 頁首捲動進度條 | 能量漸層；裝飾用 |

## 展示頁

`/design-system`（`src/pages/design-system/`）是 tokens 與元件的參考頁，不在導覽與 sitemap 裡。

- Tokens 由 `tokens.css` 在 build 時讀出，依 `scripts/design/token-groups.mjs` 分組渲染（`_TokenGroup.astro`）。新增 token 時，讓它落進某一組；需要新的組時加在 `GROUPS`，並以 `kind` 指定範例的畫法
- 沒有合適範例的 token（z-index、比例、`clamp()` 高度等）用 `kind: 'value'`，放在整組都是 `value` 的組，渲染成名稱／值表格。同一組混用 `value` 與有範例的 kind 時，範例欄會空著，`showcase.mjs` 會擋
- 元件區以狀態矩陣呈現：每個元件的 variant × 預設、hover、focus（以及 disabled、error 等該元件有的狀態），深淺兩個 surface 各一份
- 互動狀態的選擇器同時接受 `data-preview-state`，讓展示頁不用操作就能畫出狀態，樣式只寫一份：

  ```css
  .primary:is(:hover, [data-preview-state='hover']) { … }
  ```

  focus 由 `BaseLayout` 的 `:focus-visible, [data-preview-state='focus']` 統一處理；元件自己畫 focus 的（`Card`）也要寫成同樣的形式。`data-preview-state` 只用在展示頁
- 預覽用的複本加 `inert`：不進 Tab 順序、不被報讀，可操作的是「預設」那一份（#16 實測：Tab 停點 109 → 65）。矩陣表格加 `caption.sr-only` 說明示意欄不能操作
- `/design-system`、`/wireframes` 不得出現在 `docs/ia/nodes.csv`（導覽只能指向節點，sitemap 也由節點產生），`showcase.mjs` 會擋。M4 加 sitemap 時要排除這兩個路徑，並把檢查接到 sitemap 的輸出

## 影像

- 抽象 3D 渲染，只用品牌色，不放文字、數字、人物、真實產品。提示詞、規格與素材清單見 `docs/design/image-prompts.md`
- 檔案放 `src/assets/design/`，用 `node scripts/design/import-image.mjs <來源> <檔名>` 轉成 WebP 品質 95，不直接放 PNG
- 文字壓在圖上時，圖要讓出文字的位置（hero 的 `--hero-image-share`／`--hero-copy-share`、手機的 `--hero-narrow-offset`），不靠加深遮罩硬撐。換圖後跑 `node scripts/design/a11y-smoke.mjs`

## 無障礙

- 對比：文字 4.5:1、UI 元件與 focus ring 3:1（WCAG 2.2 AA），兩個 surface 都要過
- focus：全站共用 `BaseLayout` 的 `:focus-visible`（`--color-focus`，`outline-offset` 讓外框落在周圍底色上）；卡片由整張卡畫外框
- 點擊目標：按鈕、獨立連結、表單欄位最小高度 `--touch-target`（44px）
- 動態：見「捲動動態」

## 檢查

`npm run check` 包含：

- `npm run check:design`
  - `scripts/design/contrast.mjs`：兩個 surface 各自檢查 `PAIRS` 每一組
  - `scripts/design/token-usage.mjs`：`src/components/ui/`、`src/pages/design-system/`、`BaseLayout` 的 `<style>` 不得有色碼、色彩函式、帶單位的長度、角度與時間（`0`、無單位數字、`%`、`fr` 可以），`var()` 不得引用未定義的 token
  - `scripts/design/showcase.mjs`：`src/components/ui/` 每個元件都要被 `/design-system` import；`tokens.css` 每個 token（`--wf-*` 除外）都要歸進 `token-groups.mjs` 的某一組，pattern 不得失效，同一組不得混用 `value` 與其他 kind；`/design-system`、`/wireframes` 不得出現在 `docs/ia/nodes.csv`
- build 後的 `scripts/seo/headings.mjs`：每頁恰好一個 h1、heading 不跳級
- build 後的 `scripts/design/dist-css.mjs`：輸出的 CSS 不得有帶 scroll timeline 的 `animation` shorthand

不在 `npm run check` 裡、依環境字型與 Chromium 的：`node scripts/design/a11y-smoke.mjs`（圖上文字對比、水平捲動、鍵盤 focus、reduced motion），改到 hero、`Backdrop`、`Surface` 或 focus 樣式後要跑。
