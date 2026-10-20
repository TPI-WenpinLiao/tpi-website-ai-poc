---
name: seo-checklist
description: 新增或修改任何頁面、版型、內容時使用。列出每頁必備的 SEO 項目（title、description、canonical、OG/Twitter、heading、圖片、JSON-LD、hreflang、內部連結）與驗收方式。
---

# SEO checklist

本站不可被收錄（`_headers` 的 `X-Robots-Tag` 與 `robots.txt`），但頁面本身仍須做到可上線的 SEO 品質。**不得在 HTML 內加 `noindex` meta**，否則 Lighthouse SEO 會失敗、上線時也容易遺漏移除。

## 每頁必備

| 項目 | 規則 |
|---|---|
| `<title>` | 全站唯一；zh-TW 約 20–32 個全形字（en 50–60 字元）；格式 `頁面主題｜TPIsoftware 昕力資訊`，首頁可例外 |
| meta description | 全站唯一；zh-TW 約 60–80 個全形字（en 120–160 字元）；描述頁面內容，不堆砌關鍵字 |
| canonical | 絕對 URL，以 `Astro.site` 組出；與實際路徑一致（尾斜線規則一致） |
| `lang` | `<html lang>` 對應頁面語系（`zh-TW` / `en` / `vi`） |
| Open Graph | `og:type`、`og:title`、`og:description`、`og:url`、`og:image`（1200×630，M3 後必填）、`og:locale`、`og:site_name` |
| Twitter | `twitter:card`（有圖用 `summary_large_image`）、`twitter:title`、`twitter:description` |
| h1 | 每頁恰好一個，描述頁面主題 |
| heading 層級 | 依序不跳級（h2 → h3，不可 h2 → h4）；不用 heading 做視覺樣式 |
| 圖片 | 有意義的圖必有描述性 `alt`；裝飾圖 `alt=""`；必有 `width`/`height`；用 `astro:assets` 輸出 AVIF/WebP；首屏以下 `loading="lazy"` |
| 連結 | 內部連結用相對路徑或站內絕對路徑；錨點文字有意義（不用「點此」）；不得有斷連 |
| 結構化資料 | 依下表輸出 JSON-LD |
| hreflang | M7 起：每頁列出所有語系版本與 `x-default`，雙向對應 |

## JSON-LD 類型對照

| 頁面類型 | Schema |
|---|---|
| 首頁 | `Organization` + `WebSite` |
| 產品頁 | `SoftwareApplication` |
| 解決方案、服務 | `Service` |
| 客戶案例 | `Article`（或 `CreativeWork`） |
| 部落格 / 新聞 | `BlogPosting` / `NewsArticle` |
| 公司頁（關於、聯絡） | `AboutPage` / `ContactPage` + `Organization` |
| 徵才 | `JobPosting`（僅在有真實職缺資料時） |
| 所有非首頁 | `BreadcrumbList` |

各類型的 schema 屬性與內容欄位對應見 [`docs/ia/content-model.md`](../../../docs/ia/content-model.md)。

不得在 JSON-LD 寫入頁面上不存在的資訊（評分、價格、地址等需有真實來源）。

## 驗收方式

1. `npm run check` 通過（Lighthouse SEO = 1、html-validate 無錯誤）
2. 用瀏覽器檢視原始碼，確認上表各項存在且值正確
3. JSON-LD 貼到 [Schema Markup Validator](https://validator.schema.org/) 無錯誤
4. PR 的 preview 檢查重點列出新增 / 變更頁面的 title 與 description
