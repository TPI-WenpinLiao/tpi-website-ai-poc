# 現站內容盤點（M1-01）

- 對象：https://www.tpisoftware.com（zh-TW、en、ja）與 https://www.tpisoftware.vn（vi）
- 交付物：
  - [`inventory.csv`](./inventory.csv)：一列一個頁面或 PDF 資產，共 1,306 列
  - [`broken-links.csv`](./broken-links.csv)：頁內連結指向、但無法開啟的 URL 與出現頁面，共 59 筆（供 M1-02 稽核）
  - [`inventory-summary.json`](./inventory-summary.json)：統計與擷取紀錄
- 擷取日期：2026-10-20（Node v22.22.0）

## 重現方式

```bash
npm ci
node scripts/inventory/crawl.mjs            # 完整擷取，約 20–30 分鐘
node scripts/inventory/crawl.mjs --limit 30 # 試跑：只抓前 30 頁
```

- 輸出覆寫 `docs/research/` 下的三個檔案，以 url 排序，diff 可直接比較
- 有設定 `HTTPS_PROXY` 時（例如雲端 session），script 會自動以 `NODE_USE_ENV_PROXY=1` 重新啟動，讓 fetch 走 proxy
- 雲端環境需要 Allowed domains：`www.tpisoftware.com`、`tpisoftware.com`、`www.tpisoftware.vn`、`tpisoftware.vn`（見 `docs/onboarding.md`）
- 禮貌爬取：同時 2 個請求、請求間隔至少 500ms；連線被 reset 或 502/503/504 時退避重試 4 次（1s、2s、4s、8s）。現站約每 5–6 個請求就有一次 reset，重試後皆可取得

## 擷取方式

現站是 Nuxt 2 SSR。`/sitemap.xml` 回 500、`robots.txt` 未宣告 sitemap，因此改由以下來源合併出 URL 清單，再逐頁請求：

| 來源 | `discovered_via` | 內容 |
|---|---|---|
| 語系首頁 | `home` | `/`、`/en`、`/ja`、`https://www.tpisoftware.vn/` |
| 導覽 | `nav` | 首頁 SSR 的 header／footer 連結，以及 header 下拉選單設定（下拉選單在 client 端渲染，設定以物件字面值存在 layout bundle 的 `navbar:[…]`，script 轉成 JSON 解析，不執行遠端程式碼） |
| Nuxt router | `router` | bundle 內註冊的所有靜態路由（含導覽未連到的頁面） |
| Blog API | `blog-api` | `POST /cms/api/v1/f/article/{category,home}`，`X-Lang` 為 `ZH-TW`／`EN-US`／`VI-VN`；文章 URL = 主分類 `custUrl` + `/` + `articleCustUrl`。日期在未來的排程文章現站不顯示，也不列入 |
| 新聞 API | `news-api` | `GET /tpi/api/News?languages={tw,en,vn}`，詳細頁為 `/media-center/:id`、`/en/media-center/:id`、`tpisoftware.vn/media-center/:id`；只列 `status=1`（已發布） |
| Sitemap | `sitemap` | `https://www.tpisoftware.vn/sitemap.xml`（只含 vi blog 文章） |
| 頁內連結 | `link` | 以上所有頁面中，指向兩個站內網域的 `<a href>`（BFS 持續展開） |

URL 正規化：去除 query 與 hash、去除結尾斜線。`www.tpisoftware.com/vn/*` 會 301 到 `www.tpisoftware.vn/*`；`www.tpisoftware.vn/vn/*` 與 `www.tpisoftware.vn/*` 內容相同（皆 200、無轉址），統一記為不含 `/vn` 的形式。轉址後落在同一個 `final_url` 的請求合併成一列，原始網址記在 `notes` 的 `redirected from`。

## 欄位定義

| 欄位 | 說明 |
|---|---|
| `url` | 可開啟的網址（有轉址時為原始網址之一） |
| `final_url` | 轉址後的實際網址 |
| `status` | HTTP 狀態碼；`fetch-error` 表示重試後仍無法連線 |
| `locale` | `zh-TW`／`en`／`ja`／`vi`，依網域與路徑前綴判斷，其餘取 `<html lang>` |
| `page_type` | 依路徑規則分類，blog 與新聞依 API 來源標記。值：home、product-index、product、solution-index、solution、service、case-study、blog-index、blog-category、blog-post、news-index、news、events、campaign、download、about、contact、resource、search、utility、subsite、pdf、other |
| `title` | `<title>` |
| `h1` | 內容區所有 `<h1>`，多個以 ` \| ` 串接 |
| `last_updated` | blog 用 API 的 `atcDate`、新聞用 `updateDate`，其次 `article:modified_time`／`published_time` meta，其次 `Last-Modified` header；都沒有則留空（現站 HTML 頁面大多沒有） |
| `last_updated_source` | 上欄的來源 |
| `word_count` | 內容區文字量：CJK 字元每字算 1，其餘以空白分詞。內容區 = `.layout` 扣除 header、footer、modal、script／style |
| `image_count` | 內容區不重複的 `<img>` 數（CSS 背景圖不計） |
| `embedded_media` | 內容區的 iframe／video／audio，格式 `youtube:1;google-maps:8;video:1` |
| `forms` | 內容區 `<form>` 數與可見欄位數，格式 `form:1;fields:7`；有欄位但沒有 `<form>` 的元件也會列出欄位數 |
| `nav_location` | 出現在導覽的位置，如 `header: 公司 > 媒體中心`、`footer: 關於我們`，多處以 ` \| ` 串接。不在導覽時：blog 文章為 `blog listing`、新聞為 `media-center listing`，其餘為 `not in nav` |
| `discovered_via` | 見上表，多個來源以 `;` 串接 |
| `notes` | `no h1`、`h1 xN`、`error page`、PDF 大小、轉址來源等 |

## 涵蓋範圍

### 各語系 × 頁面類型

| page_type | zh-TW | en | vi | ja | 合計 |
|---|--:|--:|--:|--:|--:|
| news | 289 | 173 | 69 | 0 | 531 |
| blog-post | 105 | 66 | 298 | 0 | 469 |
| product | 31 | 23 | 21 | 0 | 75 |
| blog-category | 25 | 18 | 12 | 0 | 55 |
| service | 17 | 16 | 16 | 0 | 49 |
| newsletter | 25 | 0 | 0 | 0 | 25 |
| solution | 7 | 7 | 7 | 0 | 21 |
| utility | 5 | 5 | 5 | 0 | 15 |
| download | 6 | 5 | 4 | 0 | 15 |
| pdf | 9 | 0 | 2 | 0 | 11 |
| about | 2 | 2 | 2 | 1 | 7 |
| home | 1 | 1 | 1 | 1 | 4 |
| campaign | 3 | 0 | 0 | 0 | 3 |
| blog-index、contact、events、news-index、product-index、resource、search、case-study | 各 1 | 各 1 | 各 1 | 0 | 24 |
| subsite | 2 | 0 | 0 | 0 | 2 |
| **合計** | **535** | **324** | **445** | **2** | **1,306** |

- HTTP 200：1,301 列；500：5 列（見下節）
- 導覽（header／footer）可達的 115 個站內 URL 全部收錄（`inventory-summary.json` 的 `navTargetsMissing` 為空）
- vn `sitemap.xml` 的 299 個 URL 全部收錄
- blog 文章數與 API 總數一致：zh-TW 105、en 66、vi 298
- 新聞：API 已發布 523 篇全部收錄；另有 8 篇 zh-TW 新聞（`/media-center/151` 等）不在 API 清單，但由內文連結可達且回 200，一併列入

### 導覽位置

| `nav_location` | 列數 |
|---|--:|
| header／footer | 115 |
| blog listing（文章與分類） | 524 |
| media-center listing | 531 |
| not in nav | 136 |

`not in nav` 的 136 列是 router 有註冊、或只能從內文連結到的頁面，例如 `/2023tpiday`、`/2024tpiday`、`/carbon`、`/products/insurebrick`、`/products/open-banking`、`/solutions/gis`、`/esg-advisory/<顧問>`、`/epaper/2018/04`～`/epaper/2020/06`（舊電子報）。是否保留由 M1-02 稽核決定。

### 重現性

初版 script 與最終版各完整擷取一次（同日）。兩次都存在的 1,273 個 URL 狀態碼完全一致；其餘差異只來自兩版之間的修正：blog／新聞改計內文（字數與圖片數改變）、跟隨內文連結（新增 33 列、失效連結移到 `broken-links.csv`）、重複斜線合併。

## 無法擷取或刻意排除的頁面

### 回應錯誤（列於 inventory）

| URL | 狀態 | 說明 |
|---|---|---|
| `/ja`、`/ja/partners` | 500 | 日文版只有這兩個路由，目前皆為伺服器錯誤 |
| `/outsourcing/dropdown`、`/en/outsourcing/dropdown`、`/vn/outsourcing/dropdown` | 500 | router 有註冊，頁面錯誤 |

### 現站本身的問題

- `/sitemap.xml` 回 500；`/en/sitemap.xml` 404；`robots.txt` 未宣告 sitemap
- 新聞 `/media-center/269`、`/media-center/279` 的內文檔（`/file/html/news/...`）不存在，頁面僅有標題
- 大小寫不同的重複路由都回 200，例如 `/products/gadoDIDO` 與 `/products/gadodido`、`/orient-aI` 與 `/orient-ai`，inventory 分別列出
- `www.tpisoftware.vn/vn/*` 與 `www.tpisoftware.vn/*` 內容重複
- 內文中有 59 個失效連結（見 `broken-links.csv`），包含舊站的 `.html`／`.doc` 路徑、拼錯的 vn 路徑、以及被誤植為 URL 的文字

### 刻意不擷取

| 範圍 | 原因 |
|---|---|
| `/tpu/`（昕力大學）、`/hr/`（人才招募網） | 掛在同網域下的獨立應用，各只列入口一列（`page_type=subsite`），不往內爬 |
| `ir.tpisoftware.com`（投資人專區） | 獨立網站，不在官網改版範圍 |
| `docs.tpisoftware.com`（產品文件中心） | 獨立文件站 |
| `blog.tpisoftware.com`、`blog.tpisoftware.vn` | 舊 blog 網域，現站內文仍有連結 |
| `tpi.dev`（OpenTPI）、`greenswift.tpisoftware.com` | 獨立產品站 |
| `tpisoftware.com`、`tpisoftware.vn`（無 www） | 內文有少數連結使用，apex 網域無 DNS 紀錄或無法連線 |
| `tpisoftware.piee.pw`、`*.pse.is` | 短網址服務 |
| 未發布新聞（`status≠1`，zh-TW 2 篇）與未來日期的 blog 排程文章 | 現站不顯示 |
| `/preview/:id`、`/search` 結果頁等動態路由的參數組合 | 非內容頁；`/search` 本身有列入 |

各外部網域被連結的情況記於 `inventory-summary.json` 的 `outOfScopeHosts`。

## 已知限制

- blog 文章內文取自 Nuxt payload 的 `content` 字串，新聞內文取自 `/file{htmlpath}`，兩者都是 client 端渲染；其他頁面只計 server 端輸出的 HTML，若有 tab 切換或捲動後才請求的內容，不會計入字數與圖片數
- `page_type` 是路徑規則推定，M1-02 稽核時再修正
- `last_updated` 對多數一般頁面無資料，現站沒有提供
- `word_count` 是相對指標，用來比較頁面份量，不等於可搬移的正文字數
