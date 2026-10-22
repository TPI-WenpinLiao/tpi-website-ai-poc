# 0002. URL 規則與語系策略

- 狀態：已採用
- 日期：2026-10-20
- issue：#10（M2-03）

## 背景

新站有 zh-TW、en、vi 三個語系，頁面階層與暫定路徑已在 M2-01 定好（[`docs/ia/sitemap.md`](../ia/sitemap.md)、[`docs/ia/nodes.csv`](../ia/nodes.csv)）。M2-05 的 redirect map、M4 的路由、M7 的 hreflang 都需要一套固定的 URL 規則。

現站的做法（[`docs/research/inventory.md`](../research/inventory.md)、[`seo-baseline.md`](../research/seo-baseline.md)）：

- zh-TW 沒有語系前綴，en 用 `/en`，vi 在另一個網域 `www.tpisoftware.vn`（`www.tpisoftware.com/vn/*` 301 過去）
- 路徑沒有尾斜線
- hreflang 的 `x-default` 指向 zh-TW 首頁
- 大小寫不同的路由都回 200，例如 `/products/gadoDIDO` 與 `/products/gadodido`
- blog 文章路徑含分類：`/blog/{category}/{slug}`

限制：

- ADR 0001 定為 `output: 'static'`。Astro 7.4 的 `i18n.domains`（語系對應到不同網域）需要 `output: 'server'` 且不能有 prerender 頁面，所以三個語系只能放在同一個網域
- Cloudflare Pages 會把 `/contact.html` 以 `/contact` 提供，把 `/about/index.html` 以 `/about/` 提供（官方文件 Serving Pages 的「Route matching」）。尾斜線由 build 出來的檔名決定

## 決策

### 語系路徑

| 語系 | Astro locale | URL 前綴 | 首頁 | `<html lang>` | hreflang |
|---|---|---|---|---|---|
| 繁體中文（預設） | `zh-TW` | 無 | `/` | `zh-TW` | `zh-TW` |
| 英文 | `en` | `/en` | `/en` | `en` | `en` |
| 越南文 | `vi` | `/vi` | `/vi` | `vi` | `vi` |

- 三個語系在同一個網域，用路徑前綴區分
- 同一頁在各語系的路徑只差前綴：`/products/digirunner`、`/en/products/digirunner`、`/vi/products/digirunner`
- 不支援日文。`/ja/*` 由 M2-05 301 到 `/en`（M2-01 決定）

### 路徑命名

- 只用小寫英文字母、數字與 `-`；`-` 只能出現在兩個字元之間，不能連續、不能在開頭或結尾；不用底線、大寫、空白或非 ASCII 字元
- 沿用現站 slug 時依序正規化：轉小寫、連續的 `-` 合併為一個、去掉開頭與結尾的 `-`（例如 `logmanagement--insurance` → `logmanagement-insurance`）
- 有現站頁面的沿用現站路徑，只做上述正規化（例如 `/whitepaper/digiLogs` → `/whitepaper/digilogs`）。新頁依 IA 階層命名（`/industries/finance`、`/services`、`/products/gadosecurity`）
- 頁面路徑的 slug 三語共用，不翻譯
- blog 文章：`/blog/{slug}`，不含分類，slug 沿用現站並正規化。分類頁為 `/blog/{category}`
- 合併掉的重複文章（inventory 的 merge 列）用合併目標的 slug，301 到目標文章
- `/blog/` 底下的保留字：各分類頁的 slug（`nodes.csv` 中 parent 為 `blog` 的節點）與 `page`。文章 slug 與保留字相同時，前面加上現站分類路徑段（vi 的 `/blog/digital-transformation/AI` → `/vi/blog/digital-transformation-ai`）；新文章不用保留字
- 新聞：`/media-center/{id}`，沿用現站的數字 id
- 列表分頁：第一頁不帶頁碼；第 2 頁起為 `/{列表路徑}/page/{n}`，例如 `/blog/page/2`、`/blog/ai/page/2`
- 篩選以分類頁的路徑呈現，不用 query string 產生要被收錄的頁面
- `node scripts/ia/sitemap.mjs` 檢查 `nodes.csv` 的 `path` 欄，並依上述規則算出每篇 blog 文章的新 slug，寫到 `docs/ia/page-map.csv` 的 `blog_slug` 欄。格式不符、撞到保留字、同語系重複，或 merge 列在同語系找不到合併目標時 exit 1

### 尾斜線

不加尾斜線，根目錄 `/` 除外。`/about/` 由 Cloudflare Pages 轉到 `/about`。

### canonical

每頁指向自己，用絕對網址，沒有尾斜線、`.html` 或 query string。由 `src/layouts/BaseLayout.astro` 產生。

### hreflang 與 x-default

- 每頁列出實際存在的語系版本，包含自己；沒有內容的語系不列
- `x-default` 指向 zh-TW 版本。該頁沒有 zh-TW 版本時（例如只有 vi 的 blog 文章）不輸出 `x-default`
- 實作在 M7

### 缺翻譯的頁面

- 不設定 Astro 的 `i18n.fallback`。fallback 會在缺翻譯的語系產生轉址頁或內容重複的頁面。en、vi 沒有對應的頁面檔或內容，就不產生頁面
- 語言切換的目標，依序判斷：
  1. 目標語系有這一頁：連到這一頁
  2. 沒有這一頁，但有該語系首頁：連到該語系首頁
  3. 連首頁都沒有（M7 翻譯前的 en、vi）：不列這個語系，不產生指向不存在頁面的連結。只剩目前語系時不輸出切換元件
- 「有這一頁」的判斷：`src/pages/` 的靜態頁面檔由 build 時列出；動態路由（content collection）的頁面由頁面依 `translationKey` 傳入其他語系版本的路徑
- 實作在 M4-02（#21）：語系設定與路徑工具在 `src/lib/i18n/`，切換元件是 `src/components/ui/LocaleSwitcher.astro`。`node scripts/i18n/routes.mjs` 在 build 後檢查每頁的 `<html lang>` 與 URL 前綴相符、切換連結都指到 build 出來的頁面

### Astro 設定

`astro.config.mjs`：

```js
export default defineConfig({
  site: SITE,
  output: 'static',
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
  i18n: {
    locales: ['zh-TW', 'en', 'vi'],
    defaultLocale: 'zh-TW',
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
```

| 設定 | 作用 |
|---|---|
| `prefixDefaultLocale: false` | zh-TW 頁面放在 `src/pages/` 根目錄，en、vi 放在 `src/pages/en/`、`src/pages/vi/` |
| `locales` 用 `vi` | 目錄名稱與 URL 前綴都是 `vi` |
| `build.format: 'file'` | `src/pages/about.astro` 與 `src/pages/about/index.astro` 都輸出 `about.html`，`src/pages/en/index.astro` 輸出 `en.html`，Cloudflare Pages 以無尾斜線的路徑提供 |
| `trailingSlash: 'never'` | dev server 也用無尾斜線的路徑，與正式環境一致（Astro 文件建議 `file` 搭配 `never`） |

`locales` 與 `defaultLocale` 從 `src/lib/i18n/locales.ts` import，語系清單只寫在那裡。

`build.format: 'file'` 時 `Astro.url.pathname` 會帶 `.html`，canonical、hreflang、語言切換連結都要去掉 `.html` 與結尾的 `/index`：一律用 `src/lib/i18n/paths.ts` 的 `normalizePath`。

## 理由

- **vi 用 `/vi` 而不是現站的 `/vn`**：`vi` 是語言代碼，和 `lang`、hreflang 一致；`vn` 是國碼。vi 現在在 `www.tpisoftware.vn`，搬到新網域後 URL 本來就全部改變，用 `/vn` 也省不了轉址
- **同一網域**：static 輸出不能用 `i18n.domains`；同一網域也只需要一份 `_headers`、`robots.txt` 與部署設定
- **不加尾斜線**：與現站一致，減少轉址
- **沿用現站路徑**：保留既有排名與外部連結，301 數量最少。代價是 URL 不完全反映 IA 階層，例如服務頁在根目錄、`/solutions/smartclaim` 屬於 AI 家族。麵包屑與導覽依 IA，不從 URL 推導
- **blog 文章不含分類**：M2-01 已經改了分類，分類日後還可能調整；不含分類的 URL 不會因此改變。472 篇文章中，2 篇與分類頁撞名、2 篇的 `-` 需要正規化，依上方規則處理後同語系沒有重複（vi 的 `AI-viet-van-ban` 是大小寫重複，已 merge 到 `ai-viet-van-ban`），由 `sitemap.mjs` 檢查。代價是所有 blog 文章都要 301，約 470 筆，在 Cloudflare Pages `_redirects` 的靜態規則上限 2,000 筆以內
- **x-default 指 zh-TW**：與現站相同；zh-TW 是預設語系，內容最完整

## 影響

- M2-05 redirect map 的轉址來源：`www.tpisoftware.com/vn/*` 與 `www.tpisoftware.vn/*` → `/vi/*`；大寫路徑 → 小寫；`/blog/{category}/{slug}` → `/blog/{slug}`；`/ja/*` → `/en`
- `www.tpisoftware.vn` 網域在新站上線後是否保留為轉址來源，與正式網域一起決定
- M4 路由依本 ADR 建立 `src/pages/` 結構；分頁路徑用 `page/[n]`
- M4-02 實作語言切換，M4-03 輸出 hreflang（用同一份語系版本清單），M7 補翻譯內容與驗證 hreflang、`x-default`。`og:locale` 需要「語言_地區」格式（例如 `en_US`、`vi_VN`），目前 `BaseLayout.astro` 對 en、vi 輸出的是 `en`、`vi`，M7 一併修正
- 正式網域決定後只改 `astro.config.mjs` 的 `site`（或 `SITE_URL` 環境變數），路徑規則不變
