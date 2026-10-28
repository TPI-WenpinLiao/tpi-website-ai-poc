# 品牌素材與視覺資產（M3-09）

新站用到的品牌素材、來源與使用授權。素材由人工提供，本檔只記錄現況；還沒提供或還沒確認的項目列在「待確認」。

範圍是品牌與設計素材。從現站搬來的內容圖片（客戶 logo、blog 與新聞的圖、關於我們的照片）不在這裡，授權各自列在搬移時的待確認：客戶 logo 見 M5-03（#28），blog 與新聞圖片見 M5-05（#30），公司頁照片見 M5-06（#31），產品頁 banner 見 `docs/content/products.md`。

## 素材放在哪裡

| 位置 | 放什麼 | 怎麼進來 |
|---|---|---|
| `src/assets/brand/` | 網站實際使用的 logo，檔名 `logo-<版本>-<顏色>.svg`；JSON-LD 用的 `logo-vertical-color.png` | `node scripts/design/import-brand.mjs <AI 檔資料夾>`，不手動放檔 |
| `public/favicon.png`、`public/apple-touch-icon.png` | 瀏覽器分頁與 iOS 主畫面圖示 | 同上，由彩色符號產生 |
| `public/og/default.png` | 沒有自己 OG 圖的頁面使用的預設分享圖 | `node scripts/design/og-image.mjs`，由反白橫式 logo 與 `tokens.css` 產生 |
| `src/assets/design/` | 設計用的抽象影像 | `node scripts/design/import-image.mjs`（見 `docs/design/image-prompts.md`） |
| 不進 repo | 行銷部門的原始交付檔（AI 檔、PNG 匯出檔） | 需要時向行銷部門索取，再匯入 |

原始交付檔不進 repo，是為了不讓 repo 帶著網站用不到的大型二進位檔。

## Logo

來源：公司行銷部門的 AI 檔（檔名 `TPI_Logo_OL_<Color|White|Black> <版本>.ai`），使用者在 #122 轉交。AI 檔是 PDF 相容格式，`import-brand.mjs` 用 `pdftocairo`（poppler-utils）轉成 SVG，再做三件事：

1. 反白版的 AI 檔有一塊畫板大小的深色底（`#231815`，行銷部門預覽白色 logo 用），script 刪掉這塊底。哪些檔應該有底寫在 `LOGOS` 的 `background`，數量不符就失敗
2. 刪掉沒有外框的空字形（彩色直式的 AI 檔內嵌 PingFang TC，只用來畫一個空白字元）
3. `viewBox` 裁到圖形範圍，等同裁掉 PNG 的透明邊

M3-04（#17）到 #122 之前，網站用的是行銷部門的 PNG 匯出檔，轉出的 SVG 與 PNG 目視一致。

授權：公司自有商標，新站可以使用。

使用規範：行銷部門沒有 logo 使用規範（使用者 2026-10-25 確認）。新站的用法以目前的實作為準：深色底用反白版、亮色底用彩色版，header 高 `--logo-height`（2rem）、footer 高 `--logo-height-lg`（3rem）。

| 檔案 | 版本 | viewBox 尺寸 | 用在哪裡 | 原始檔名 |
|---|---|---|---|---|
| `logo-symbol-white.svg` | 符號、反白 | 327.8×191 | `SiteHeader`（深色 header） | `TPI_Logo_OL_White Symbol.ai` |
| `logo-horizontal-white.svg` | 橫式中英、反白 | 447.9×108.7 | `SiteFooter`、`public/og/default.png` | `TPI_Logo_OL_White Horizontal Logo_Ch-En.ai` |
| `logo-vertical-color.svg` | 直式中文、彩色 | 279.9×241.6 | 產生 JSON-LD 用的 PNG | `TPI_Logo_OL_Color Vertical Logo_Ch.ai` |
| `logo-symbol-color.svg` | 符號、彩色 | 327.8×191 | 產生 favicon 與 apple-touch-icon | `TPI_Logo_OL_Color Symbol.ai` |
| `logo-horizontal-color.svg` | 橫式中英、彩色 | 448.5×109 | 目前頁面沒有用到，留給亮色頁面 | `TPI_Logo_OL_Color Horizontal Logo_Ch-En.ai` |

JSON-LD 的 `logo` 用 PNG。Google 要求 Organization logo 是 Google 圖片支援的格式、至少 112×112；SVG 是否支援沒有從 Google 原文確認（#122 的 session 連不到 `developers.google.com`），所以使用者決定改用 PNG（2026-10-25）。

衍生檔：

| 檔案 | 尺寸 | 產生方式 |
|---|---|---|
| `src/assets/brand/logo-vertical-color.png` | 560×483 | `import-brand.mjs`，彩色直式 SVG 以 2 倍大小點陣化；`src/content/organization/*.yaml` 的 `logo`（JSON-LD `Organization`） |
| `public/favicon.png` | 48×48 | `import-brand.mjs`，彩色符號 SVG 置中、透明背景 |
| `public/apple-touch-icon.png` | 180×180 | `import-brand.mjs`，彩色符號 SVG 置中、白色背景（iOS 會把透明填成黑色） |
| `public/og/default.png` | 1200×630 | `og-image.mjs`，反白橫式 SVG 加上 `tokens.css` 的場景圖樣，不含文字 |

行銷部門另有黑色版、反白直式與純中文版的 AI 檔，新站目前沒有用到，沒有匯入。

## 品牌色

來源：`src/styles/tokens.css` 的 primitives。

| token | 色碼 | 來源 |
|---|---|---|
| `--purple-700` | `#662e8d` | 現站 CSS 的主色 |
| `--magenta-500` | `#b824d1` | 現站 CSS（現站另有 `#a61ebc`，新站沒有用） |
| `--orange-500` | `#ff6329` | 現站 CSS |
| `--purple-*`、`--magenta-*`、`--orange-*` 其餘色階 | | M3-02（#15）由上面三色延伸 |
| `--ink-*`、`--red-*`、`--green-*` | | M3-02 設計的中性色與狀態色 |

公司沒有 VI 手冊與官方色票，新站以 `tokens.css` 為品牌色基準（使用者 2026-10-25 確認）。對比由 `npm run check:design` 檢查。

## 字體

| 字體 | 用途 | 來源 | 授權 |
|---|---|---|---|
| Inter Variable | 拉丁字母內文與標題（`--font-sans`） | npm `@fontsource-variable/inter`，`src/styles/base.css` 宣告 latin、vietnamese、greek subset（#143） | OFL-1.1 |
| JetBrains Mono Variable | 程式碼（`--font-mono`） | npm `@fontsource-variable/jetbrains-mono`，同上 | OFL-1.1 |
| PingFang TC、Microsoft JhengHei、Noto Sans TC | 中文 | 使用者裝置的系統字，網站不提供字檔 | 不需授權 |

字體在 M3-02 選定。公司沒有指定字體，新站以 Inter 為基準（使用者 2026-10-25 確認）。

## 設計影像

來源：使用者依 `docs/design/image-prompts.md` 的提示詞用生圖工具產生，M3-02（#15）用 `import-image.mjs` 轉成 WebP。

生圖工具：ChatGPT（使用者 2026-10-25 確認）。現有影像夠用，不重新產生；`image-prompts.md` 的素材清單裡只有 `ambient-glow-2` 沒做，M3-02 已決定一張光暈就夠，目前沒有要補的圖。

帳號方案：ChatGPT Enterprise（使用者 2026-10-25 確認）。

授權：公司的 ChatGPT Enterprise 合約允許使用生成的影像（使用者 2026-10-25 確認）。

| 檔案 | 用在哪裡 |
|---|---|
| `hero-modular-stack.webp`、`hero-modular-stack-mobile.webp` | `HomeTemplate`、`HubTemplate`、`OfferingTemplate` 的 hero |
| `cover-data.webp`、`cover-integration.webp`、`cover-platform.webp` | `HomeTemplate`、`OfferingTemplate` 的卡片封面 |
| `cover-security.webp`、`ambient-glow-1.webp`、`reading-header.webp` | 只在 `/design-system` |
| `hero-data-flow.webp`、`hero-data-flow-mobile.webp` | 只在 `/design-system`（方向 A，M3-07 沒有選用） |

## 3D

M3-07（#54）選定的方向 B Modular Stack 由 three.js 在瀏覽器產生抽象方塊（`src/lib/scene/`），材質與視角寫在 `tokens.css`，不需要外部 3D 模型。使用者決定不做立體 logo，沿用現有的 logo 圖檔（2026-10-25），也不評估 Blender MCP。日後需要 3D 模型時由使用者在本機產生後提供。

## 待確認

無。
