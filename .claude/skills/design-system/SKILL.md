---
name: design-system
description: 撰寫或修改任何樣式、元件時使用。說明亮暗雙 surface、光與景深、動態、token 分層與命名、斷點、基礎元件與檢查方式。
---

# Design system

> tokens、基礎元件、3D 方向 B Modular Stack 與動態規範在 M3 定案（#15、#54、#55），之後新增的元件都列在「基礎元件」。

## 設計方向

網站是有景深的場景：敘事頁（首頁、產品、方案）放在深色 surface 上，底下是 3D 捲動場景（方向 B Modular Stack：等角視角的方塊隨捲動拆解、翻轉，再重組成各產品家族的模組），內容是浮在場景上的玻璃圖層；閱讀頁（blog、法務、長文）用亮色 surface。

- 光標示資料與互動：紫、品紅、橘的能量漸層與光點只用在線條、外框、焦點、hover，不當文字的底色
- 動態跟著捲動：進場、圖層分離、進度條都用 CSS scroll-driven animation，不加 client JS

## 規則

- 所有樣式值（色彩、字級、行高、間距、圓角、陰影、斷點、角度、動畫時間）只能引用 `src/styles/tokens.css` 的 CSS custom properties
- 需要新 token 時先加到 `tokens.css` 並在 PR 中說明用途，不得在元件內寫死數值
- 不使用 UI framework 或 utility CSS framework
- 元件樣式寫在 `.astro` 的 scoped `<style>`。傳給子元件的元素會帶上父層的 scope，父層的 class 名稱不要和子元件內部的 class 重複（#17 實測：頁面的 `.grid` 套到 `Surface pattern="grid"`、header 的 `.primary` 套到 `Button` 的 primary）。全域樣式與共用規則的分層見下方「CSS 分層」
- 中文換行：標題與 `.text-phrase`（hero 與區塊的引言、卡片說明、`Tag`）只在空格與標點斷行，不會把「數位轉型」斷成「數位轉／型」。內文段落不加。沒有空格與標點的標題用 U+200B 標出可斷行的位置（見 `PageHero`）
- 頁面元件在 `src/components/ui/`，新元件同步加到 `/design-system`，寫法見「展示頁」

## CSS 分層

樣式分四層，越上層越共用。新樣式先找能放的最上層，不要在頁面裡再寫一份。

| 層 | 位置 | 放什麼 |
|---|---|---|
| tokens | `src/styles/tokens.css`、`media.css` | design tokens（三層，見「Token 分層」）與斷點 |
| base | `src/styles/base.css`（只由 `BaseLayout` import） | reset（`box-sizing`、`body`）、標題與 `.text-phrase` 的換行、`[data-surface='dark']` 的底色、`:focus-visible`、跨元件的工具類（`.sr-only`、`.anchor-target`、`.signal-dot`、`.ruled-list`） |
| 元件 | `src/components/ui/*.astro` 的 scoped `<style>` | 跨頁共用的區塊：卡片格線（`CardGrid`）、表單面板（`FormPanel`）、標籤列（`TagList`）、長文排版（`Prose`）等 |
| 模板與頁面 | `src/layouts/templates/`、`src/pages/` 的 scoped `<style>` | 只屬於這個模板或頁面的版面 |

- 兩個以上的模板或頁面要用同一組樣式時，抽成元件（有結構、有 props）或 `base.css` 的工具類（只有一兩條、套在任何元素上都成立，例如捲動定位）。不要複製
- 元件不改別的元件：不用 `:global(.其他元件的 class)` 伸進去調整，要調整就給那個元件加 prop（例：`Card` 的 `date`、`SectionHeading` 的 `action` slot、`CardGrid` 的 `compact`）
- `:global()` 只能接在自己的 class 後面，作用在 slot 或 Markdown 帶進來的元素（`.prose :global(h2)`、`.card-grid > :global(li)`）。整個選擇器都是 `:global` 的規則會影響元件外部，只有不得不時才寫，並在前一行寫 `/* global-ok: 理由 */`（例：`SiteHeader` 展開選單時鎖住 `<html>` 的捲動）
- 不寫 `<style is:global>`；全域樣式只進 `base.css`
- 兩個元件刻意共用同一組宣告、又抽不出來時（例：`FilterBar` 與 `Pagination` 的選取狀態，`base.css` 的 class 會被元件 scoped 的 specificity 蓋掉），在規則前一行寫 `/* shared-ok: 理由 */`

前四條由 `node scripts/design/css-structure.mjs`（`npm run check:design`）擋下：`src` 下多出的樣式表、`<style is:global>`、沒有 `global-ok:` 的全域選擇器、`:global()` 裡出現別的 `.astro` 定義的 class、同一組 4 條以上的宣告出現在兩個檔案（沒有 `shared-ok:`）。lint 抓不到的（抽成元件還是工具類、`global-ok:`／`shared-ok:` 的理由是否成立）在 `/pr-review` 的固定檢查人工判斷。

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
- 字型：`--font-sans` 是 Inter＋系統中文字；`--font-mono`（JetBrains Mono）只用在編號、eyebrow、資料標籤。兩者的 `@font-face` 只寫在 `base.css` 開頭，只宣告 latin、vietnamese、greek 三個 subset，不 import fontsource 的整包 CSS，不載中文 webfont。頁面文字碰到哪個 subset，首次繪製前就下載哪個檔，contact 頁曾因一個「ō」多下載 83 KB（#143）。`npm run check` 的 `font-subsets.mjs` 在頁面出現這三個 subset 以外的字元、或範圍與套件的 `unicode.json` 不一致時失敗，例外列在它的 `ALLOWED`
- 3D：`--scene-angle-x`、`--scene-angle-z` 是共用的等角視角，`--perspective` 是共用透視距離。`Scene3D` 的 three.js 相機從這些值換算（`src/lib/scene/runtime.ts`），靜態版與 3D 版才會重疊；顏色從 `--gradient-energy`、`--color-bg`、`--color-border-brand` 讀，方塊材質從 `--scene-block-*`、`--scene-rim-*` 讀（`SceneContext.readNumber`），TS 不寫色碼

## Token 命名

名稱用小寫英文與 `-`，前面是類別，後面依序接用途、變體、狀態，用不到的段省略。現有名稱見 `tokens.css`，新 token 先找同類的既有名稱照著取：

| 段 | 寫法 | 例 |
|---|---|---|
| 類別 | primitive 用色名；semantic 用 `color`、`glass`、`glow`、`shadow`、`gradient`；scale 用屬性名 | `--purple-700`、`--color-*`、`--font-size-*`、`--radius-*` |
| 用途 | 色彩的角色：`text`、`bg`、`border`、`action`、`link`、`brand`、`accent`、`focus`、`success`、`error`、`disabled`、`grid` | `--color-text`、`--color-bg`、`--color-error` |
| 變體 | 強弱用 `subtle`、`muted`、`soft`、`strong`；指定色系用 `brand`、`accent`；配對的前景或背景用 `text`、`bg` | `--color-bg-brand-subtle`、`--color-border-strong`、`--color-error-bg` |
| 狀態 | `hover`、`active`，放在最後 | `--color-action-hover`、`--color-action-subtle-hover`、`--scene-rim-glow-active` |

- 頁面底色的層次用 `--color-bg-<變體>`（`--color-bg-subtle`）。狀態色與互動色的配對用 `--color-<用途>-<text 或 bg>`：`--color-action-text` 是 `--color-action` 上的文字，`--color-error-bg` 是 `--color-error` 的底色。新增 warning 時照狀態色寫成 `--color-warning`、`--color-warning-bg`
- primitive 色階用數字，`0`（白）到 `950`，數字越大越深；級數之間需要中間值時取中間的數字（`--ink-850`）。只加實際用到的級數，不預先補滿
- 尺寸級距：字級用 `xs`、`sm`、`base`、`lg`、`xl` 與 `h1`–`h4`、`display`；間距用 4px 的倍數（`--space-4` 是 `1rem`）；圓角、陰影用 `sm`／`md`／`lg`（圓角另有 `xl`、`pill`），時間用 `fast`／`base`／`slow`。版面專用的間距用名稱說明用途（`--space-gutter`、`--space-section`）
- 只屬於一塊版面的值，以那塊版面命名：`--hero-*`（hero 的版面，`PageHero`、`Backdrop`、`Breadcrumb`、`SceneChapter` 共用）、`--scene-*`（3D 視角、方塊材質，以及玻璃面板對比用的背景 `--scene-worst`）、`--logo-height*`、`--header-height`、`--progress-height`。`LayerStack` 的 `--layer-gap`、`--node-size` 是早期沒有前綴的例外，新 token 不要照這樣取。先找能不能用既有的 scale 表達，不行才加；加了也要在 `tokens.css` 的註解寫出誰讀它
- 3D 場景的 TS 也讀 token：`src/lib/scene/runtime.ts` 讀 `--scene-angle-*` 的角度，`SceneContext.readNumber` 讀 `--scene-block-*`、`--scene-rim-*` 的無單位數字。新增給 TS 讀的 token 時，在 `tokens.css` 的註解寫出讀它的檔案
- 新 token 要能歸進 `scripts/design/token-groups.mjs` 的某一組（見「展示頁」），否則 `showcase.mjs` 會失敗

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

## 動態

效果清單、各效果用在哪些頁面、減少動態時的呈現與 3D 的效能預算在 [`docs/design/motion.md`](../../../docs/design/motion.md)。新增或改動效果時，同步更新那份清單。

- 時間、延遲與 easing 一律用 tokens：`--duration-*`（`fast`／`base`／`slow`，循環動畫的週期 `--duration-loop`）、`--delay-step`、`--ease-standard`（顏色、透明度、展開）、`--ease-out-expo`（位移）。`transition` 簡寫的每一段都寫 timing function，longhand 寫了 `transition-duration` 就要寫 `transition-timing-function`，不留給瀏覽器預設的 `ease`
- 偏好減少動態時，`tokens.css` 把 `--duration-*`、`--delay-*`、`--tilt`、`--lift` 歸零。hover、focus、展開的狀態差異保留，過場消失；位移與傾斜用 `--tilt`、`--lift` 寫，才會跟著歸零
- 捲動動態用 `animation-timeline: view()`、`scroll()` 或具名的 `view-timeline`，包在 `@supports (animation-timeline: view())` 與 `@media (prefers-reduced-motion: no-preference)` 裡；不支援或偏好減少動態時，畫面要停在完成狀態。timing function 寫 `linear`（進度就是捲動位置），錯開量用捲動距離（`Reveal` 的 `--reveal-stagger`），不用時間
- **只寫 longhand**（`animation-name`、`animation-timing-function`、`animation-fill-mode`、`animation-timeline`、`animation-range`），不要寫 `animation` shorthand。Lightning CSS 會把 shorthand 和 `animation-timeline` 合併成 `animation: … view()`，瀏覽器不接受，整個動畫失效；`scripts/design/dist-css.mjs` 會擋
- 循環動畫（`LayerStack` 的脈動）只放在 `@media (prefers-reduced-motion: no-preference)` 裡
- 不要讓 LCP 元素（hero 標題、hero 靜態圖）用 `Reveal` 或任何從透明開始的動畫
- 真 3D（`Scene3D`）只用在首頁與 offering 模板中屬於 `SCENE_FAMILIES` 的頁面，只放 hero 與功能章節；其他地方用 CSS 偽 3D（`LayerStack`、`Card` 的傾斜）或格線。範圍與預算見 `motion.md`

## 基礎元件

`src/components/ui/` 的每個元件都要在下表有一列，表裡也不能留已經刪除的元件，`node scripts/design/showcase.mjs` 兩種都會擋。

| 元件 | 用途 | 重點 |
|---|---|---|
| `Surface` | 頁面區塊 | `tone` 切換亮暗；`pattern="grid"` 畫由上往下淡出的座標格線；`width="reading"` 收窄到閱讀寬度；同 tone 相鄰時後一個不留頂部 padding，間距只有一段 `--space-section` |
| `PageHero` | 頁面開場 | 預設深色＋格線；輸出該頁唯一的 h1（display 字級）；`visual` slot 放 3D 場景或其靜態版本；`breadcrumb` slot 是 hero 頂端獨立的一列；`size="compact"` 是閱讀頁的標題區（h1 用 `--font-size-h2`，底部只留 `--space-16`）；有 `backdrop` 時，窄螢幕在文字上方輸出視覺區 `data-hero-visual`（3D 依它取景，見「3D 場景」） |
| `LayerStack` | 3D 場景的靜態版本 | CSS 3D 玻璃圖層＋能量光束，捲出畫面時分開；裝飾用，`aria-hidden` |
| `SectionHeading` | 區塊標題 | `index`（`01`）＋mono eyebrow＋漸層線；`level` 由呼叫端指定，避免跳級；`size="display"` 每頁最多一次，`size="sm"` 用在面板裡的標題（表單的錯誤摘要）；`action` slot 放整區的連結（同一列靠右） |
| `Button` | 動作或按鈕樣式的連結 | 有 `href` 輸出 `<a>`，沒有輸出 `<button>`（預設 `type="button"`）；小圓角（`--radius-md`）；primary 發光上浮、secondary 漸層外框、text；`disabled` 只存在於 `<button>` |
| `Link` | 內文連結、獨立連結 | 內文連結一律底線；`external` 加 ↗ 與「（外部網站）」螢幕閱讀器文字 |
| `Tag` | 標籤 | `neutral`、`brand`、`node`（mono＋發光點，用於模組與技術關鍵字）；有 `href` 才是連結 |
| `Card` | 列表卡片 | 玻璃面板，hover／focus 時傾斜、亮起漸層外框；整卡可點，但只有標題一個連結；圖片 `alt` 必填；`size="sm"` 是只有標題、手機上一列兩張的短卡；`date` 在 meta 列顯示日期；沒有 `href` 是不能點的靜態面板（功能、應用情境），meta 裡的 `Tag` 連結各自可點 |
| `FormField` | 表單欄位 | `kind` 區分 text／email／tel／textarea／select／checkbox；hint、error 以 `aria-describedby` 連到欄位，error 加 `aria-invalid`；有連結的說明（個資同意的隱私權政策）放 `hint` slot |
| `FormGroup` | 多選題 | `fieldset`＋`legend`，選項是不帶 `required` 的 `FormField` checkbox，`--bp-sm-up` 起兩欄；`error` 屬於整組（至少選一項），以 `aria-describedby` 連到 fieldset，`id` 給錯誤摘要連結 |
| `Backdrop` | 區塊背景圖 | 放進 `Surface`／`PageHero` 的 `backdrop` slot；`fade`（`hero`／`bottom`／`none`）、`strength="soft"`、`priority`（LCP 圖才加）；alt 一律留空 |
| `Reveal` | 捲動進場 | `delay` 0–3 錯開同一列的元素 |
| `ScrollProgress` | 頁首捲動進度條 | 能量漸層；裝飾用 |
| `Scene3D` | three.js 3D 捲動場景 | 見下方「3D 場景」 |
| `SiteHeader` | 頁首 | 資料只讀 `navigation.csv`（`src/lib/ia/navigation.ts`）；選單是原生 `<details>`，共用同一個 `name`，一次只開一個；點選單外、按 Esc 收起由元件內的小段 script 處理（Esc 後焦點回到 summary）；`--header-height` 高、sticky 的深色玻璃列；寬度小於 64rem 收進「選單」 |
| `SiteFooter` | 頁尾 | 連結欄與法務列讀 `navigation.csv`，電話、Email、版權讀 `src/data/site.ts`；`consentSettings` 在法務列最後加上重新打開 `ConsentBanner` 偏好設定的按鈕（`PageLayout` 在有 GTM ID 時傳入） |
| `Breadcrumb` | 麵包屑 | 放在 `PageHero` 的 `breadcrumb` slot；項目由 `nodes.csv` 的 `parent` 推出（`breadcrumb()`），最後一項是目前頁面；collection 頁用 `current` 換成項目標題；連結帶目前語系的前綴 |
| `InPageNav` | 頁內錨點列 | 只列頁面有輸出的區塊；`stick="header"` 在 `--bp-lg-up` 固定在 header 下方，手機隨頁面捲走；`stick="top"` 給沒有 header 的頁面；選項多時在列內橫向捲動 |
| `Faq` | 常見問題 | 原生 `<details>`，零 JS |
| `CardGrid` | 卡片列表 | 手機一欄、`--bp-sm-up` 兩欄、`--bp-lg-up` 三欄（`cols`）；同一列等高；`compact` 讓手機也一列兩張短卡 |
| `ContactCta` | 每頁最後的聯絡區塊 | 文案取自現站；按鈕連到目前語系的聯絡我們，`label` 可換成「預約演示」 |
| `Prose` | 長文 | Markdown 內文的排版，`:global()` 只作用在自己內部 |
| `FilterBar` | 列表篩選 | 有 `href` 的項目是連結（blog 分類），沒有的是標籤；窄螢幕在列內橫向捲動 |
| `Pagination` | 列表分頁 | 第 2 頁起 `/page/n`（ADR 0002）；只有一頁不輸出 |
| `EmptyState` | 沒有項目時 | 虛線框、標題、說明與 `action` slot |
| `SearchResults` | `/search` 的搜尋結果 | Pagefind 的 island：`form` 是頁面 GET 搜尋表單的 id（欄位 `q`），第一次 focus 或網址有 `?q=` 才載入 `/pagefind/pagefind.js`，其他頁面不用。狀態 idle／loading／results／none／error 由 `data-state` 切換，每次顯示 10 筆加「顯示更多」；`level` 是結果標題與狀態標題的層級；`preview` 只給 `/design-system` 畫靜態狀態。索引範圍見 `PageLayout` 的 `searchTrail` |
| `FormPanel` | 頁面唯一的表單 | 有標題的面板，表單以標題命名；送出按鈕放 `actions` slot。標題下方是送出後的狀態區（`role="alert"`、`tabindex="-1"`）：`errors` 是錯誤摘要（`SectionHeading size="sm"` 的編號 eyebrow，下面每個錯誤一列、連到欄位，錯誤色只用在編號，不用淡紅底與左側粗線），`message` 是整張表單的訊息（送出失敗、安全驗證未通過）；`challenge` 在按鈕上方預留 Turnstile 的高度（窄螢幕 compact、`--bp-sm-up` 起 flexible，`--challenge-height*`），`preview` 在展示頁畫出預留框；`busy` 加 `aria-busy`。要送出的表單傳 `form`（`src/lib/forms/rules.ts` 的 id）、`action`、`next`：script 用同一套規則驗證、填入錯誤、第一次 focus 時載入 Turnstile、成功後導到 `next`（ADR 0005）；錯誤元素預先 render，script 才不會失去 scoped 樣式 |
| `TagList` | 一列標籤 | `Tag` 的清單，`label` 給沒有標題的列命名 |
| `SceneChapter` | 3D 場景上的章節 | 見「3D 場景」 |
| `VideoFacade` | 影片 | `video` 是 `{ kind: 'youtube', id }` 或 `{ kind: 'file', src }`（自架 MP4）；初始只有本機 `poster` 與原生 `<button>`，播放器在 `<template>` 裡，點擊後才換上並取得焦點，首次載入不請求第三方資源；`poster` 不用 YouTube 縮圖；`title` 是圖說、按鈕的 accessible name 與播放器的 `title`；`node scripts/design/video-facade.mjs` 檢查（`npm run check`） |
| `ConsentBanner` | cookie 同意 | 固定在視窗底部、不擋操作的深色橫幅，加上原生 `<dialog>` 的偏好設定（`showModal()` 鎖住焦點、Esc 關閉，關閉後焦點回到打開它的按鈕）；接受與拒絕同一個視覺層級；必要類別固定開啟，其他類別是 `role="switch"` 的 checkbox。只由 `PageLayout` 在 build 有 `PUBLIC_GTM_ID` 時放在 `body` 層級（放進有 transform 或 stacking context 的容器會被蓋住），內部頁不放；顯示時以 `scroll-padding-block-end` 與頁尾後的 spacer 留出橫幅高度，焦點不會被蓋住（WCAG 2.4.11），類別與文案來自 `src/data/consent.ts`，`config` 交給 script 儲存選擇與載入 GTM（ADR 0007）；任何帶 `data-consent-open="<id>-dialog"` 的按鈕都能打開對話框。`preview` 只給 `/design-system`，不儲存也不載入 |
| `LocaleSwitcher` | 語系切換 | 純連結，零 JS；連到同一頁的其他語系版本，沒有翻譯時連到該語系首頁，連首頁都沒有的語系不列，只剩目前語系時不輸出（ADR 0002）；語系名稱用各自的語言並加上 `lang`；同一頁有多個時用 `label` 給不同的 landmark 名稱 |

## 新增元件

依序做完每一步：

1. 先找既有的元件：上表能用的就用，差一點的就給它加 prop（「CSS 分層」），不要另寫一個相似的元件
2. 在 `src/components/ui/<Name>.astro` 建立元件，名稱用 PascalCase。檔頭用英文註解寫出用途、props 的意義與使用限制（例：`LocaleSwitcher`）
3. 樣式寫在 scoped `<style>`，只用 tokens（「規則」「Token 命名」）；用到斷點時 `@import` media.css（「斷點」）
4. 要放進狀態矩陣的元件（第 5 步），互動狀態的選擇器同時接受 `data-preview-state`（「展示頁」）
5. 在 `src/pages/design-system/index.astro` import 元件並放上範例。有 variant 或互動狀態（hover、focus、disabled、error）的元件，做成狀態矩陣：variant × 狀態，深淺兩個 surface 各一份，預覽的複本加 `inert`（「展示頁」）。沒有 variant 與互動狀態的元件，或狀態寫在元件內部、無法從外部設定的導覽元件（`Breadcrumb`、`InPageNav`、`SiteHeader`、`SiteFooter`），放一個範例即可
6. 在本檔的「基礎元件」表加一列：用途、重點（props、限制、跟哪個元件搭配）
7. 執行 `npm run check:design`。`showcase.mjs` 只檢查第 5 步的 import 與第 6 步的那一列，也會報出元件表裡已經沒有檔案的列。元件放在圖上、3D 場景上，或有 focus 樣式時，另外跑 `node scripts/design/a11y-smoke.mjs`
8. PR 寫出新元件、新 token 與用途；第 1 步與第 5 步的狀態矩陣、`inert` 沒有 script 檢查，由 `/pr-review` 人工判斷

## 3D 場景

`Scene3D` 是 three.js 的 island，載入策略與理由見 [ADR 0003](../../../docs/decisions/0003-3d-island-loading.md)。

- 放在 `PageHero` 的 `backdrop` slot、靜態 `Backdrop`（`priority`）之後；靜態圖是 LCP，也是減少動態、Save-Data、不支援 WebGL 時的完整版本
- hero 與要讓場景透出的區塊包在同一個 `data-scene-track` 元素裡，捲動進度以它計算。hero 之後的章節用 `SceneChapter`（每章佔滿一個 viewport、文字在玻璃面板上、場景 ready 後背景透明並疊在 hero 之上），不要自己寫透明背景
- 窄螢幕的取景由 runtime 量 `PageHero` 的 `data-hero-visual` 決定（中心與鏡頭距離 `fitDistance()`），不要在場景裡寫 header、頁內導覽列的高度；改到 hero 的版面後跑 `scene-capture.mjs`，它也檢查跨斷點 resize 後的 tier（ADR 0003「窄螢幕的取景」）
- 產品頁用 `Scene3D` 的 `family`（`sceneFamily()`，`src/lib/scene/families.ts`），只畫該家族的模組，每一章點亮一組方塊，組數取 track 裡 `SceneChapter` 的數量（M3-05）
- 場景上的文字放在玻璃面板（`--glass-bg`）或 scrim 那一側，不直接壓在方塊上
- 新場景寫成 `src/lib/scene/<名稱>.ts`，default export 一個 `SceneFactory`，加進 `Scene3D` 的 `LOADERS`；數量依 `tier.density` 減少，讓行動版降級生效（降級的數值只寫在 `tiers.ts` 的 `TIERS`）。factory 與 `update` 不做大量計算：`mount` 把初始化拆成多個 task，但 factory 本身是一個 task，Lighthouse 行動版把它的時間乘 4 計入 TBT（ADR 0003「初始化的長任務」）
- 改到 `Scene3D`、`src/lib/scene/` 或用到它的頁面後，跑 ADR 0003「量測」的三個 script

## 展示頁

`/design-system`（`src/pages/design-system/`）是 tokens 與元件的參考頁，不在導覽與 sitemap 裡（內部頁清單在 `src/lib/seo/indexing.ts`）。

- Tokens 由 `tokens.css` 在 build 時讀出，依 `scripts/design/token-groups.mjs` 分組渲染（`_TokenGroup.astro`）。新增 token 時，讓它落進某一組；需要新的組時加在 `GROUPS`，並以 `kind` 指定範例的畫法
- 沒有合適範例的 token（z-index、比例、`clamp()` 高度等）用 `kind: 'value'`，放在整組都是 `value` 的組，渲染成名稱／值表格。同一組混用 `value` 與有範例的 kind 時，範例欄會空著，`showcase.mjs` 會擋
- 元件區以狀態矩陣呈現：每個元件的 variant × 預設、hover、focus（以及 disabled、error 等該元件有的狀態），深淺兩個 surface 各一份
- 互動狀態的選擇器同時接受 `data-preview-state`，讓展示頁不用操作就能畫出狀態，樣式只寫一份：

  ```css
  .primary:is(:hover, [data-preview-state='hover']) { … }
  ```

  focus 由 `BaseLayout` 的 `:focus-visible, [data-preview-state='focus']` 統一處理；元件自己畫 focus 的（`Card`）也要寫成同樣的形式。`data-preview-state` 只用在展示頁
- 預覽用的複本加 `inert`：不進 Tab 順序、不被報讀，可操作的是「預設」那一份（#16 實測：Tab 停點 109 → 65）。矩陣表格加 `caption.sr-only` 說明示意欄不能操作
- 內部頁（`src/lib/seo/indexing.ts` 的 `INTERNAL_PATHS`）不得出現在 `docs/ia/nodes.csv`（導覽只能指向節點），`showcase.mjs` 會擋。sitemap 由 build 出的頁面產生，排除這些路徑與流程頁（`FLOW_PATHS`），`scripts/seo/meta.mjs` 檢查 sitemap 的輸出

## 影像

- 抽象 3D 渲染，只用品牌色，不放文字、數字、人物、真實產品。提示詞、規格與素材清單見 `docs/design/image-prompts.md`
- 檔案放 `src/assets/design/`，用 `node scripts/design/import-image.mjs <來源> <檔名>` 轉成 WebP 品質 95，不直接放 PNG
- 公司 logo 在 `src/assets/brand/`，是 `node scripts/design/import-brand.mjs <AI 檔資料夾>` 從行銷部門的 AI 檔轉出的 SVG（刪掉反白版的預覽底色、裁掉留白），同時產生 `public/favicon.png`、`public/apple-touch-icon.png`。深色 surface 用白色版，亮色用彩色版；header 只放符號（`logo-symbol-white`，`--logo-height`），footer 放橫式中英版（`logo-horizontal-white`，`--logo-height-lg`）
- 文字壓在圖上時，圖要讓出文字的位置（hero 的 `--hero-image-share`／`--hero-copy-share`、手機的 `--hero-narrow-offset`），不靠加深遮罩硬撐。換圖後跑 `node scripts/design/a11y-smoke.mjs`

## 無障礙

- 對比：文字 4.5:1、UI 元件與 focus ring 3:1（WCAG 2.2 AA），兩個 surface 都要過
- focus：全站共用 `BaseLayout` 的 `:focus-visible`（`--color-focus`，`outline-offset` 讓外框落在周圍底色上）；卡片由整張卡畫外框
- 點擊目標：按鈕、獨立連結、表單欄位最小高度 `--touch-target`（44px）
- 動態：見「動態」

## 檢查

`npm run check` 包含：

- `npm run check:design`
  - `scripts/design/contrast.mjs`：兩個 surface 各自檢查 `PAIRS` 每一組
  - `scripts/design/token-usage.mjs`：`src/components/ui/`、`src/layouts/`、`src/pages/` 所有 `.astro` 與 `src/styles/base.css` 的樣式不得有色碼、色彩函式、帶單位的長度、角度與時間（`0`、無單位數字、`%`、`fr` 可以），不得有 easing 關鍵字與函式（`linear` 只能用在有 `animation-timeline` 的規則），`transition`、`animation` 不得省略 timing function，`var()` 不得引用未定義的 token
  - `scripts/design/css-structure.mjs`：「CSS 分層」的規則
  - `scripts/design/showcase.mjs`：`src/components/ui/` 每個元件都要被 `/design-system` import，也要在本檔的「基礎元件」表有一列，表裡的元件都要有檔案；`tokens.css` 每個 token 都要歸進 `token-groups.mjs` 的某一組，pattern 不得失效，同一組不得混用 `value` 與其他 kind；內部頁（`INTERNAL_PATHS`）不得出現在 `docs/ia/nodes.csv`
- build 後的 `scripts/design/scene-budget.mjs`：每個公開頁面的初始 JS 與延後載入的 JS（gzip）不得超過 `motion.md`「效能預算」的預算
- build 後的 `scripts/seo/headings.mjs`：每頁恰好一個 h1、heading 不跳級
- build 後的 `scripts/design/dist-css.mjs`：輸出的 CSS 不得有帶 scroll timeline 的 `animation` shorthand
- build 後的 `scripts/design/font-subsets.mjs`：輸出的 `@font-face` 只能是 Inter 與 JetBrains Mono 的 latin、vietnamese、greek，範圍與套件的 `unicode.json` 相同；頁面文字不得有字型涵蓋、但這三個 subset 沒有的字元（例外在 `ALLOWED`）
- build 後的 `scripts/design/overflow.mjs`：每頁在 320、390、1024、1440px 寬都不得比 viewport 寬。常見原因：沒寫 `grid-template-columns` 的 grid，隱含的 `auto` 欄會被子元素的 min-content 撐開（`<input>` 預設 20 字寬、`<select>` 跟最長選項一樣寬，`FormField` 的 `.control` 因此設 `inline-size: 100%`）；內文裡的長網址或長英文字（`Prose` 設 `overflow-wrap: break-word`）
- build 後的 `scripts/design/axe.mjs`：每頁以 1280px、reduced motion 跑 axe-core（WCAG 2.2 A／AA），有任何 violation 就失敗
- build 後的 `scripts/design/video-facade.mjs`：每個有 `VideoFacade` 的頁面，載入時不得有站外的請求；用鍵盤 Tab 到 facade 按鈕、按 Enter 後，要換上有 `title` 的播放器，焦點落在播放器上
- build 後的 `npm run test:visual`：首頁與各模板預覽頁在 375、768、1280px 的截圖和 baseline 比對，只在 CI 執行（雲端 session 會 skip）。改樣式、token 或元件後預期會失敗，確認差異符合意圖後照 `docs/workflow.md`「視覺回歸」由 CI 更新 baseline

不在 `npm run check` 裡、依環境字型與 Chromium 的：`node scripts/design/a11y-smoke.mjs [path]`（圖上與 3D 場景上的文字對比、水平捲動、鍵盤 focus、reduced motion），改到 hero、`Backdrop`、`Surface`、`Scene3D` 或 focus 樣式後要跑。
