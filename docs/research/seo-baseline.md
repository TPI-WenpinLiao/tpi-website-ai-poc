# 現站 SEO 基線（M1-03）

現站 https://www.tpisoftware.com（zh-TW、en）與 https://www.tpisoftware.vn（vi）的 SEO 現況，作為新站的比較基準與 M2 redirect 優先順序依據。

## 資料來源與量測時間

| 資料 | 檔案 | 量測時間 | 工具與方式 |
|---|---|---|---|
| 全站 meta | [`seo-pages.csv`](./seo-pages.csv)、[`seo-summary.json`](./seo-summary.json) | 2026-10-20 07:12 UTC 起 | `scripts/inventory/seo.mjs`，Node v24.22.0 抓 SSR HTML（不執行 JavaScript），1,290 頁，0 失敗 |
| Lab 效能 | [`lighthouse-baseline.json`](./lighthouse-baseline.json) | 2026-10-20 07:22 UTC 起 | `scripts/inventory/lighthouse.mjs`，Lighthouse 12.6.1、headless Chromium 141，14 頁 × mobile／desktop × 3 次取中位數 |
| Field CWV | [`crux-field-manual.json`](./crux-field-manual.json) | 2026-10-20 15:20（台北時間），涵蓋最近 28 天 | PageSpeed Insights 網頁版，使用者手動查詢後提供截圖 |

輸入範圍：[`inventory.csv`](./inventory.csv)（M1-01）中 `status` = 200 的 HTML 頁，排除 PDF。

## 重現方式

```bash
npm ci
node scripts/inventory/seo.mjs              # 全站 meta，2026-10-20 實測約 10 分鐘；--limit N 試跑
node scripts/inventory/lighthouse.mjs       # lab 量測，2026-10-20 實測約 30 分鐘；--runs N、--only <網址片段>
```

- 兩支 script 都會覆寫產出檔；重跑前先跑 `crawl.mjs` 與 `audit.mjs` 更新 `inventory.csv`，`seo-pages.csv` 的 `disposition` 欄才會是最新的
- `lighthouse.mjs` 的完整報告寫到 `.lighthouse-baseline/`（不進 repo），需要看單一 audit 細節時開這裡的 JSON
- 有設定 `HTTPS_PROXY` 時，`seo.mjs` 會自動讓 Node fetch 走 proxy，`lighthouse.mjs` 會把 proxy 傳給 Chromium
- Field CWV 需要 Google API key 才能用 API 自動取得；本次未設 key，改由人工查詢（見「待補資料」）

## 站層級

| 項目 | tpisoftware.com | tpisoftware.vn |
|---|---|---|
| `robots.txt` | 200，`User-agent: *` / `Disallow:`（全部允許），未宣告 sitemap | 同左 |
| `/sitemap.xml` | 500 | 200，299 個 URL（只含 vi blog 文章） |

搜尋引擎在 `.com` 只能靠連結發現頁面。新聞、產品、en 版都不在任何 sitemap。

## Meta 使用狀況

數字來自 `seo-summary.json` 的 `all`、`byLocale`、`byPageType`。「重複」指同一語系內有 2 頁以上相同的值。

| 項目 | zh-TW（525 頁） | en（323 頁） | vi（442 頁） | 全站（1,290 頁） |
|---|--:|--:|--:|--:|
| title 缺漏 | 0 | 0 | 0 | 0 |
| title 重複（頁數） | 23 | 26 | 19 | 68 |
| description 缺漏 | 54 | 20 | 15 | 89 |
| description 重複（頁數） | 34 | 30 | 23 | 87 |
| canonical 缺漏 | 503 | 304 | 423 | 1,230 |
| canonical 指向自己 | 11 | 5 | 6 | 22 |
| canonical 指向其他頁 | 11 | 14 | 13 | 38 |
| 有 hreflang | 365 | 236 | 129 | 730 |
| hreflang 正確 | 305 | 186 | 73 | 564 |

### title 與 description

- 每頁都有 `<title>`。zh-TW 長度中位數 33 字，en 63 字元，vi 61 字元（`titleLength`）
- 品牌後綴不一致：zh-TW 有 `昕力資訊TPIsoftware`（50 頁）、`昕力資訊 TPIsoftware`（11 頁）、`昕力資訊`（2 頁），157 頁沒有後綴
- 重複最多的是 ESG 顧問個人頁：`/esg-advisory/*` 的顧問頁沿用總覽頁的 title 與 description（en 10 頁、zh-TW 9 頁、vi 9 頁）
- description 缺漏集中在 blog 分類頁（52 頁）與電子報（25 頁）
- description 偏長：zh-TW 中位數 130 字、en 311 字元，超過 `seo-checklist` 的 60–80 字／120–160 字元

### canonical

- 指向自己的 22 頁是三語首頁、媒體中心首頁、11 個產品頁、3 個服務頁、1 個活動頁與 `/tpu` 子站（`byPageType`）
- blog 文章（469 頁）、新聞（531 頁）、解決方案（21 頁）全部沒有
- 38 頁指向其他頁：25 個 ESG 顧問個人頁指向 `/esg-advisory`（等於要求搜尋引擎不收錄個人頁），10 個產品子頁指向 `/products/digirunner-cloud` 或 `/products/gadodido`，3 個 utility 頁指向首頁
- 沒有相對路徑或多個 canonical 的頁面

### hreflang

`hreflang_check` 欄位的判定：列出自己、有 `x-default`、對方有連回來、目標是 200 頁，全部符合才算 `ok`。

- blog 文章、blog 分類頁、電子報都沒有 hreflang
- 新聞頁的 hreflang 只列自己與 `x-default`（531 頁都是 `ok`），沒有對應其他語系
- 125 頁的 hreflang 指向非 200 的網址，其中 123 頁是因為 `ja`（`/ja/*` 回 500，見 `inventory.md`）
- 52 頁對方沒有連回來；47 頁沒有列出自己，主要是 ESG 顧問個人頁（hreflang 寫的是總覽頁）
- `/hr` 沒有 `x-default`

### 其他

| 項目 | 結果 |
|---|---|
| `<html lang>` | en、vi 全部正確；zh-TW 有 26 頁沒有 `lang`（全是 `/epaper/*` 電子報），1 頁為 `zh` |
| robots meta／`X-Robots-Tag` | 0 頁 noindex |
| Open Graph | 0 頁七項齊全。`og:locale` 1,289 頁缺；`og:url` 564 頁缺（新聞 531 頁全缺） |
| Twitter card | 0 頁 |
| h1 | 1,181 頁剛好一個；89 頁沒有（服務 25、電子報 25、utility 15）；20 頁多個 |
| JSON-LD | 1,263 頁有，但全部只有 `WebSite` 一種；沒有 `Organization`、`Product`、`BlogPosting`、`NewsArticle`、`BreadcrumbList` |
| 圖片 | SSR HTML 中 26,114 個 `<img>`：1,439 個沒有 `alt` 屬性，25,660 個沒有 `width`／`height` |

圖片數包含 header、footer 等每頁重複的圖，與 `inventory.csv` 的 `image_count`（只算內容區）不同。blog 文章內文由 client 端載入，內文圖片不在這個統計內。

## 效能（Core Web Vitals）

### Lab 數據（Lighthouse）

來源：[`lighthouse-baseline.json`](./lighthouse-baseline.json)，2026-10-20 07:22 UTC 起量測。每列是 3 次量測的中位數；分數 × 100。mobile 用 Lighthouse 預設的模擬節流（慢速 4G、CPU 4 倍降速），desktop 用 desktop preset。

| 頁面 | 裝置 | 效能 | 無障礙 | 最佳做法 | SEO | LCP | CLS | TBT | FCP |
|---|---|--:|--:|--:|--:|--:|--:|--:|--:|
| 首頁 zh-TW `/` | mobile | 46 | 86 | 93 | 92 | 24.6 秒 | 0.005 | 415 ms | 7.9 秒 |
| | desktop | 63 | 82 | 96 | 85 | 8.8 秒 | 0.002 | 107 ms | 1.2 秒 |
| 首頁 en `/en` | mobile | 47 | 86 | 93 | 85 | 24.7 秒 | 0 | 366 ms | 7.7 秒 |
| | desktop | 63 | 82 | 96 | 77 | 8.7 秒 | 0.003 | 98 ms | 1.1 秒 |
| 首頁 vi（.vn `/`） | mobile | 46 | 86 | 93 | 92 | 25.4 秒 | 0.016 | 464 ms | 6.3 秒 |
| | desktop | 63 | 82 | 96 | 85 | 9.3 秒 | 0.003 | 131 ms | 1.1 秒 |
| 產品總覽 `/products` | mobile | 47 | 87 | 93 | 92 | 15.1 秒 | 0 | 383 ms | 7.4 秒 |
| | desktop | 69 | 84 | 96 | 83 | 3.7 秒 | 0 | 38 ms | 1.3 秒 |
| 產品頁 `/products/digilism` | mobile | 42 | 77 | 93 | 83 | 31.5 秒 | 0.049 | 693 ms | 3.6 秒 |
| | desktop | 63 | 84 | 96 | 83 | 9.4 秒 | 0.004 | 108 ms | 1.4 秒 |
| 解決方案 `/solutions/smartclaim` | mobile | 52 | 83 | 93 | 92 | 16.6 秒 | 0 | 225 ms | 7.2 秒 |
| | desktop | 63 | 80 | 96 | 83 | 5.7 秒 | 0 | 86 ms | 1.4 秒 |
| 服務 `/aiso` | mobile | 41 | 87 | 93 | 83 | 16.9 秒 | 0 | 590 ms | 8.0 秒 |
| | desktop | 63 | 84 | 96 | 75 | 4.4 秒 | 0 | 74 ms | 2.4 秒 |
| 客戶案例 `/success-story` | mobile | 51 | 87 | 93 | 92 | 15.6 秒 | 0 | 362 ms | 7.8 秒 |
| | desktop | 68 | 84 | 96 | 83 | 3.9 秒 | 0 | 112 ms | 1.4 秒 |
| Blog 首頁 `/blog` | mobile | 48 | 85 | 93 | 83 | 44.0 秒 | 0 | 511 ms | 6.1 秒 |
| | desktop | 62 | 76 | 96 | 75 | 6.5 秒 | 0 | 132 ms | 1.3 秒 |
| Blog 文章 `/blog/ai/ai-gateway-for-enterprise-ai-security` | mobile | 28 | 88 | 93 | 92 | 13.0 秒 | 0.470 | 355 ms | 7.5 秒 |
| | desktop | 48 | 76 | 96 | 83 | 4.4 秒 | 0.383 | 102 ms | 1.4 秒 |
| 媒體中心 `/media-center` | mobile | 50 | 83 | 89 | 92 | 12.4 秒 | 0.049 | 367 ms | 3.6 秒 |
| | desktop | 59 | 84 | 96 | 85 | 4.4 秒 | 0 | 42 ms | 2.7 秒 |
| 新聞 `/media-center/585` | mobile | 26 | 90 | 93 | 92 | 13.7 秒 | 0.521 | 510 ms | 3.8 秒 |
| | desktop | 41 | 86 | 96 | 83 | 4.9 秒 | 0.465 | 69 ms | 2.3 秒 |
| 關於我們 `/about-us` | mobile | 50 | 82 | 93 | 92 | 17.9 秒 | 0 | 256 ms | 8.0 秒 |
| | desktop | 70 | 77 | 96 | 83 | 3.6 秒 | 0 | 62 ms | 1.2 秒 |
| 聯絡我們 `/contact-us` | mobile | 49 | 81 | 89 | 92 | 16.1 秒 | 0 | 356 ms | 7.3 秒 |
| | desktop | 65 | 81 | 96 | 83 | 4.2 秒 | 0 | 45 ms | 2.1 秒 |

觀察：

- 28 組的效能分數都低於 0.95（本專案新站的 Lighthouse 門檻）；mobile 26–52，desktop 41–70
- mobile LCP 全部超過 12 秒。首頁 LCP 元素是以 CSS 背景圖呈現的區塊（`.homepage__orient-ai`），首頁傳輸量約 7.4 MB（`total-byte-weight`）
- Blog 文章與新聞的 CLS 為 0.38–0.52，與 .vn field 數據 CLS 超標的方向一致；內文由 client 端載入後推擠版面是可能原因，未逐一驗證
- 在 SEO 類別，28 組全部扣分於 `crawlable-anchors`（有無法爬取的連結）；15 組扣 `image-alt`，4 組扣 `meta-description`
- 無障礙類別最常見的問題：`link-name`（28 組）、`button-name`（20）、`color-contrast`（19）、`heading-order`（16）

Lab 數值與 field 數據差距大（例如 .com 首頁 mobile LCP：lab 24.6 秒、field 4.4 秒）。lab 是模擬慢速網路下的最壞情況，加上量測環境經 proxy；用途是新舊站在同一環境下比較，不要拿來估計真實使用者體驗。

另一份 lab 參考：使用者在 PageSpeed Insights 網頁版（Google 機器）量到的首頁分數，記錄在 `crux-field-manual.json` 的 `psiLabScores`。.com mobile 效能 27、desktop 40；.vn mobile 27、desktop 37。兩者都低於本機量測（46／63），趨勢一致。

### Field 數據（CrUX）

來源：[`crux-field-manual.json`](./crux-field-manual.json)。資料期間為最近 28 天。兩站的範圍不同，不可直接比較：

- tpisoftware.com：「這個網址」，只代表首頁
- tpisoftware.vn：「來源」，代表整個 origin；首頁的「這個網址」沒有足夠資料

| 網站 | 裝置 | LCP | INP | CLS | FCP | TTFB | CWV 評估 |
|---|---|--:|--:|--:|--:|--:|---|
| .com 首頁 | 行動 | 4.4 秒 | 255 ms | 0 | 1.2 秒 | 0.3 秒 | 失敗 |
| .com 首頁 | 電腦 | 2.5 秒 | 74 ms | 0 | 1.3 秒 | 0.3 秒 | 失敗 |
| .vn origin | 行動 | 3.9 秒 | 323 ms | 0.18 | 2.6 秒 | 1.1 秒 | 失敗 |
| .vn origin | 電腦 | 2.4 秒 | 59 ms | 0.23 | 1.6 秒 | 0.7 秒 | 失敗 |

CWV 門檻（良好）：LCP ≤ 2.5 秒、INP ≤ 200 ms、CLS ≤ 0.1。

- .com 首頁行動版 LCP 4.4 秒落在「不佳」（> 4 秒）；TTFB 只有 0.3 秒，慢在前端資源與渲染
- .vn 兩種裝置的 CLS 都超標
- 兩站行動版 INP 都超過 200 ms

## 重要頁面清單

`seo-pages.csv` 的 `priority` 欄依 URL 在導覽中的位置與頁面類型分級，作為 M2 redirect 對照的處理順序：

| 等級 | 規則 | zh-TW | en | vi |
|---|---|--:|--:|--:|
| P1 | 首頁，或出現在 header 導覽 | 44 | 31 | 29 |
| P2 | 出現在 footer 導覽，或為產品、解決方案、服務、案例、關於、聯絡、列表頁等類型 | 28 | 30 | 29 |
| P3 | 其餘（blog 文章、新聞、blog 分類、電子報等） | 453 | 262 | 384 |

篩選方式：用試算表開 `seo-pages.csv`，依 `locale`、`priority` 篩選。P1 共 104 頁，除了 `/tpu` 子站是 `keep`，其餘 M1-02 處置都是 `rewrite`，網址會改變的機率高，都需要 redirect。

這份分級沒有流量與外部連結資料。blog 文章與新聞全部落在 P3，但其中可能有流量最高的頁面，取得資料後要重新排序（見「待補資料」）。

## 新站必須保留或改善的項目

對照 `.claude/skills/seo-checklist/SKILL.md`。

### 保留

| 項目 | 現況 | 理由 |
|---|---|---|
| 舊網址可達 | P1 104 頁、全站 1,290 頁 200 | 搬遷時每個 P1／P2 網址都要 301 到新網址，P3 依 M2 決定的處置 |
| 首頁的 hreflang 結構 | zh-TW、en、vi、x-default 雙向對應 | 新站 M7 沿用同一組語系代碼 |
| 每頁有 title | 0 缺漏 | 新站維持；改寫時參考現有措辭 |
| `<html lang>` | en、vi 全對 | 新站 zh-TW 也要補齊 |
| 0 頁 noindex | 現站全部開放收錄 | 正式上線時移除本專案的 `_headers` 與 `robots.txt` 限制（不在本 POC 範圍） |
| 行動版 CLS（.com 首頁） | field 0 | 新站版面不可退步 |

### 改善

| 項目 | 現況 | 新站要求 |
|---|---|---|
| sitemap | `.com` 500，`.vn` 只含 blog | 每個語系產出完整 sitemap，`robots.txt` 宣告 |
| canonical | 1,230 / 1,290 頁缺漏 | 每頁自指 canonical |
| title／description 重複 | 68／87 頁 | 全站唯一；ESG 顧問頁要有各自的 title 與 description |
| description 缺漏與長度 | 89 頁缺漏；zh-TW 中位數 130 字 | 每頁都有，zh-TW 60–80 字、en 120–160 字元 |
| title 品牌後綴 | 4 種寫法 | 統一為 `頁面主題｜TPIsoftware 昕力資訊` |
| hreflang | blog、新聞沒有對應；123 頁指向回 500 的 `/ja/*` | M7 起每頁列出實際存在的語系版本；不輸出沒有內容的語系 |
| OG／Twitter | `og:locale` 全缺、新聞無 `og:url`、無 Twitter card | 每頁輸出完整 OG 與 Twitter card |
| JSON-LD | 只有 `WebSite` | 依頁面類型輸出 `Organization`、`Product`／`SoftwareApplication`、`BlogPosting`、`NewsArticle`、`BreadcrumbList` |
| h1 | 89 頁沒有、20 頁多個 | 每頁剛好一個 |
| 圖片尺寸與 alt | 98% 的 `<img>` 沒有尺寸；1,439 個沒有 `alt` | 全部有 `width`／`height` 與 `alt` |
| 效能 | 行動版 LCP、INP 未達標；.vn CLS 超標 | 所有 CWV 達「良好」；本專案的 Lighthouse 門檻為 performance ≥ 0.95 |

## 待補資料（needs-input）

| 資料 | 用途 | 取得方式 |
|---|---|---|
| 頁面流量（GA4 或 Search Console「成效」） | 重新排序重要頁面，找出 P3 中的高流量頁 | 內容負責人匯出近 12 個月、以網頁為維度的 CSV |
| 外部連結（Search Console「連結」） | 有外部連結的頁面優先 redirect | Search Console 匯出「熱門連結網頁」 |
| 其他頁面的 field CWV | 目前只有 .com 首頁與 .vn origin | 在 PageSpeed Insights 查 .com 的「來源」分頁；或設定 API key 後由 script 取得 |

## 已知限制

- Meta 擷取只看 SSR HTML。現站是 Nuxt 2，client 端可能再改寫 head，搜尋引擎渲染後看到的值可能不同
- Lab 量測在雲端容器經 proxy 執行，網路來回時間比一般使用者長，分數只適合新舊站在同一環境下比較，不代表真實使用者體驗
- 重要頁面清單只依導覽位置與頁面類型分級，沒有流量資料
