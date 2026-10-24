---
name: seo-checklist
description: 新增或修改任何頁面、版型、內容時使用。列出每頁必備的 SEO 項目（title、description、canonical、OG/Twitter、heading、圖片、JSON-LD、hreflang、內部連結）與驗收方式。
---

# SEO checklist

本站不可被收錄（`_headers` 的 `X-Robots-Tag` 與 `robots.txt`），但頁面本身仍須做到可上線的 SEO 品質。**不得在 HTML 內加 `noindex` meta**，否則 Lighthouse SEO 會失敗、上線時也容易遺漏移除。

## 每頁必備

| 項目 | 規則 |
|---|---|
| `<title>` | 全站唯一，同一頁的不同語系版本（hreflang 互指）之間可以相同，例如人名、產品名；zh-TW 約 20–32 個全形字（en 50–60 字元）；格式 zh-TW 是 `頁面主題｜TPIsoftware 昕力資訊`，en、vi 是 `Subject \| TPIsoftware`（`src/lib/seo/meta.ts` 的 `pageTitle`），首頁可例外。頁面主題取內容的 `title`，要和 h1 不同時才用 `seoTitle`（`content-model.md`「共用欄位」） |
| meta description | 全站唯一（同一頁的不同語系版本之間可以相同）；zh-TW 約 60–80 個全形字（en 120–160 字元）；描述頁面內容，不堆砌關鍵字 |
| canonical | 指向自己的絕對 URL，以 `Astro.site` 組出；沒有尾斜線（`/` 除外）、`.html` 或 query string（ADR 0002，由 `Seo.astro` 產生） |
| `lang` | `<html lang>` 對應頁面語系（`zh-TW` / `en` / `vi`） |
| Open Graph | `og:type`、`og:title`、`og:description`、`og:url`、`og:image`（1200×630，M3 後必填）、`og:locale`（「語言_地區」格式：`zh_TW`、`en_US`、`vi_VN`，`src/lib/i18n/locales.ts` 的 `OG_LOCALES`，`scripts/seo/meta.mjs` 檢查）、`og:site_name` |
| Twitter | `twitter:card`（有圖用 `summary_large_image`）、`twitter:title`、`twitter:description` |
| h1 | 每頁恰好一個，描述頁面主題 |
| heading 層級 | 依序不跳級（h2 → h3，不可 h2 → h4）；不用 heading 做視覺樣式 |
| 圖片 | 有意義的圖必有描述性 `alt`；裝飾圖 `alt=""`；必有 `width`/`height`；用 `astro:assets` 輸出 AVIF/WebP；首屏以下 `loading="lazy"` |
| 連結 | 內部連結用站內絕對路徑，取 `nodes.csv` 的 `path`，blog 文章取 `page-map.csv` 的 `blog_slug` 組成 `/blog/{blog_slug}`（都加語系前綴），不寫現站路徑、尾斜線或 `.html`；錨點文字有意義（不用「點此」）；不得有斷連 |
| 導覽與麵包屑 | 選單連結以 `<a href>` 輸出在靜態 HTML，不在 client 端產生；麵包屑沿 `nodes.csv` 的 `parent` 產生（`navigation.md`「SEO」） |
| 列表分頁 | 第一頁不帶頁碼，第 2 頁起 `/{列表路徑}/page/{n}`，canonical 指向自己；篩選用分類頁路徑，不用 query string 產生要被收錄的頁面（ADR 0002） |
| 結構化資料 | 依下表輸出 JSON-LD |
| hreflang | 每頁列出實際存在的語系版本（含自己），雙向對應；`x-default` 指向 zh-TW 版，沒有 zh-TW 版的頁面不輸出 `x-default`（ADR 0002，由 `Seo.astro` 產生） |
| sitemap | `dist/sitemap.xml` 列出所有頁面的 canonical 與 hreflang，排除內部頁（`INTERNAL_PATHS`）與流程頁（`FLOW_PATHS`，404、搜尋、表單送出後與退訂的頁面），兩份清單都在 `src/lib/seo/indexing.ts`。由 build 時的 `src/integrations/sitemap.ts` 產生；`robots.txt` 不加 `Sitemap:` |

## 頁面怎麼寫

上表 head 裡的項目（title、description、canonical、hreflang、OG/Twitter、JSON-LD）只由 `src/components/seo/Seo.astro` 輸出，頁面把資料傳給 `BaseLayout`，不在頁面裡另寫 `<meta>` 或 `<script type="application/ld+json">`：

```astro
<BaseLayout title={data.seoTitle ?? data.title} description={data.description} image={ogImage} jsonLd={jsonLd}>
```

| prop | 說明 |
|---|---|
| `title` | 頁面主題；`Seo` 依語系補上站名後綴（zh-TW `｜TPIsoftware 昕力資訊`，en、vi ` \| TPIsoftware`）。首頁自己寫完整 title，加 `titleSuffix={false}` |
| `description` | meta description |
| `image` | OG 圖，沒傳時用全站預設圖（`src/lib/seo/og.ts`） |
| `type` | `og:type`，文章類（blog、news、case-study）傳 `article`，預設 `website` |
| `jsonLd` | `src/lib/seo/jsonld/` 產生函式的回傳值，`Seo` 負責序列化與跳脫 `<` |
| `translations` | dynamic route 建出的頁面傳其他語系版本的路徑（同 `LocaleSwitcher`），hreflang 才找得到；靜態頁不用傳 |

JSON-LD 產生函式一個內容類型一個（`home`、`offering`、`hub`、`article` 的 case-study／blog／news、`page`、`person`、`whitepaper`），共用的 `Organization` 參照與 `BreadcrumbList` 在 `jsonld/shared.ts`。圖片網址、分類名稱等由頁面解析後傳入，函式本身是純函式，測試在 `scripts/seo/jsonld.test.mjs`。

## JSON-LD 類型對照

各頁面類型的 schema（含首頁與 `BreadcrumbList`）與屬性對應只寫在 [`docs/ia/content-model.md`](../../../docs/ia/content-model.md)，見「內容類型總覽」與各類型的 JSON-LD 段落。內容模型沒有涵蓋的：

- 徵才：`JobPosting`，僅在有真實職缺資料時

不得在 JSON-LD 寫入頁面上不存在的資訊（評分、價格、地址等需有真實來源）。

## 驗收方式

1. `npm run check` 通過（`scripts/seo/meta.mjs` 檢查每頁 head 與 sitemap、`headings.mjs` 檢查 heading、Lighthouse SEO = 1、html-validate 無錯誤）
2. 用瀏覽器檢視原始碼，確認上表各項存在且值正確
3. JSON-LD 貼到 [Schema Markup Validator](https://validator.schema.org/) 無錯誤
4. PR 的 preview 檢查重點列出新增 / 變更頁面的 title 與 description
