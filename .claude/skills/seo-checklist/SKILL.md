---
name: seo-checklist
description: 新增或修改任何頁面、版型、內容時使用。列出每頁必備的 SEO 項目（title、description、canonical、OG/Twitter、heading、圖片、JSON-LD、hreflang、內部連結）與驗收方式。
---

# SEO checklist

本站不可被收錄（`_headers` 的 `X-Robots-Tag` 與 `robots.txt`），但頁面本身仍須做到可上線的 SEO 品質。**不得在 HTML 內加 `noindex` meta**，否則 Lighthouse SEO 會失敗、上線時也容易遺漏移除。

## 每頁必備

| 項目 | 規則 |
|---|---|
| `<title>` | 全站唯一；zh-TW 約 20–32 個全形字（en 50–60 字元）；格式 `頁面主題｜TPIsoftware 昕力資訊`，首頁可例外。頁面主題取內容的 `title`，要和 h1 不同時才用 `seoTitle`（`content-model.md`「共用欄位」） |
| meta description | 全站唯一；zh-TW 約 60–80 個全形字（en 120–160 字元）；描述頁面內容，不堆砌關鍵字 |
| canonical | 指向自己的絕對 URL，以 `Astro.site` 組出；沒有尾斜線（`/` 除外）、`.html` 或 query string（ADR 0002，由 `BaseLayout.astro` 產生） |
| `lang` | `<html lang>` 對應頁面語系（`zh-TW` / `en` / `vi`） |
| Open Graph | `og:type`、`og:title`、`og:description`、`og:url`、`og:image`（1200×630，M3 後必填）、`og:locale`（「語言_地區」格式，例如 `zh_TW`；en、vi 的值 M7 修正）、`og:site_name` |
| Twitter | `twitter:card`（有圖用 `summary_large_image`）、`twitter:title`、`twitter:description` |
| h1 | 每頁恰好一個，描述頁面主題 |
| heading 層級 | 依序不跳級（h2 → h3，不可 h2 → h4）；不用 heading 做視覺樣式 |
| 圖片 | 有意義的圖必有描述性 `alt`；裝飾圖 `alt=""`；必有 `width`/`height`；用 `astro:assets` 輸出 AVIF/WebP；首屏以下 `loading="lazy"` |
| 連結 | 內部連結用站內絕對路徑，取 `nodes.csv` 的 `path`，blog 文章取 `page-map.csv` 的 `blog_slug` 組成 `/blog/{blog_slug}`（都加語系前綴），不寫現站路徑、尾斜線或 `.html`；錨點文字有意義（不用「點此」）；不得有斷連 |
| 導覽與麵包屑 | 選單連結以 `<a href>` 輸出在靜態 HTML，不在 client 端產生；麵包屑沿 `nodes.csv` 的 `parent` 產生（`navigation.md`「SEO」） |
| 列表分頁 | 第一頁不帶頁碼，第 2 頁起 `/{列表路徑}/page/{n}`，canonical 指向自己；篩選用分類頁路徑，不用 query string 產生要被收錄的頁面（ADR 0002） |
| 結構化資料 | 依下表輸出 JSON-LD |
| hreflang | M7 起：每頁列出實際存在的語系版本（含自己），雙向對應；`x-default` 指向 zh-TW 版，沒有 zh-TW 版的頁面不輸出 `x-default`（ADR 0002） |

## JSON-LD 類型對照

各頁面類型的 schema（含首頁與 `BreadcrumbList`）與屬性對應只寫在 [`docs/ia/content-model.md`](../../../docs/ia/content-model.md)，見「內容類型總覽」與各類型的 JSON-LD 段落。內容模型沒有涵蓋的：

- 徵才：`JobPosting`，僅在有真實職缺資料時

不得在 JSON-LD 寫入頁面上不存在的資訊（評分、價格、地址等需有真實來源）。

## 驗收方式

1. `npm run check` 通過（Lighthouse SEO = 1、html-validate 無錯誤）
2. 用瀏覽器檢視原始碼，確認上表各項存在且值正確
3. JSON-LD 貼到 [Schema Markup Validator](https://validator.schema.org/) 無錯誤
4. PR 的 preview 檢查重點列出新增 / 變更頁面的 title 與 description
