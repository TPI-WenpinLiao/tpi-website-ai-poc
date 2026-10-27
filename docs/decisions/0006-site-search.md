# 0006. 站內搜尋：Pagefind 的索引、zh-TW 斷詞與載入時機

- 狀態：已採用
- 日期：2026-10-27
- issue：#34（M6-02）

## 背景

現站的搜尋（`GET /api/search`）在 zh-TW、en 回 500。M1-04（`docs/research/features.md`「搜尋」）建議改用 build 時產生的靜態索引，ADR 0001 選了 Pagefind。M6-02 的驗收條件：

- 支援 zh-TW 斷詞
- 各語系分開索引
- 不影響未使用搜尋頁面的效能分數

Pagefind 1.5.2 依每頁的 `<html lang>` 分開索引，瀏覽器端也依 `<html lang>` 只載入同語系的索引，第二條不用另外處理。npm 套件附的是 extended 版，會對 `zh-*` 頁面斷詞。實測 zh-TW 卻幾乎搜不到：「企業」在 133 頁裡只命中 7 頁。原因是兩端的斷詞不同：

- 建索引時，Pagefind 用簡體中文的字典斷詞，繁體字大多被切成單字（「企業」→「企」「業」，「數位轉型」→「數」「位」「轉」「型」）
- 瀏覽器端搜尋時，Pagefind 用 `Intl.Segmenter`（ICU）切查詢，「企業」仍是一個詞，跟索引裡的單字對不上

## 決策

1. **build 時產生，不另外跑指令**：`src/integrations/pagefind.ts` 在 `astro:build:done` 用 Pagefind 的 Node API 寫 `dist/pagefind/`。`npm run build`、CI、Cloudflare Pages 的 build 指令都不用改。頁面用網址路徑加入索引，不用 dist 的檔名：`build.format: 'file'` 把 `/about-us` 寫成 `about-us.html`，結果要連到 `/about-us`
2. **索引範圍由模板決定**：`PageLayout` 的 `searchTrail` 有值時，`<main>` 加 `data-pagefind-body`。進索引的是 Offering、Hub、Article、CaseStudy、Person、Content、GatedDownload 七個模板。首頁、listing、contact、utility 與內部頁不進：listing 只有其他頁的摘要，utility 沒有內容。`Breadcrumb`、有連結的 `Card`（摘要另一頁，該頁自己有索引）、`ContactCta`（每頁相同）標 `data-pagefind-ignore`。結果的分類標籤是麵包屑的上一層（部落格、媒體中心、產品家族），寫在 `data-pagefind-meta="section:…"`
3. **zh-TW 用 ICU 預先斷詞**：`src/lib/search/segment.ts` 的 `indexedHtml()` 處理交給 Pagefind 的 zh-TW 頁副本，`dist/` 的 HTML 不變。做法：
   1. 用 `Intl.Segmenter` 斷詞，跟瀏覽器端查詢用的是同一套 ICU 規則
   2. 在碰到漢字的詞界插入空格
   3. `<html lang>` 改成 `zhtw`，Pagefind 不會再斷一次詞
   4. 寫完索引後，把 `pagefind-entry.json` 的 `zhtw` 改名為 `zh-tw`，也就是瀏覽器在 `<html lang="zh-TW">` 頁面上找的索引名稱

   修正後「企業」53 頁、「數位轉型」19 頁、「昕力資訊」37 頁。插入的空格會出現在結果的標題與摘要裡，`src/lib/search/display.ts` 的 `despace()` 會拿掉漢字之間的空格；拉丁字母與漢字之間的空格留著（`AI 核心`）
4. **結果自己畫**：不用 Pagefind 附的 Default UI 或 Component UI。附的 UI 自帶 CSS，違反「只用 tokens」與「不用 `:global()`」，介面字串也要另外翻譯。integration 會刪掉 Pagefind 寫出的 UI bundle。`SearchResults` 用 Pagefind 的 JS API 搜尋，結果的 DOM 從伺服器輸出的 `<template>` 複製，scoped style 才套得上。摘要只保留 `<mark>`，其他內容當文字插入
5. **只有 `/search` 載入 Pagefind**：
   - `SearchResults` 在第一次 focus 搜尋欄位，或網址有 `?q=` 時，才 `import('/pagefind/pagefind.js')`
   - 頁首的搜尋框是 `<details>` 裡的 GET 表單，送到該語系的 `/search?q=`。頁首只多一段 script：打開時把 focus 移到欄位
   - 不做每一頁都能用的即時搜尋 modal：那需要每頁載入搜尋的 JS
6. **輸出固定**：Pagefind 每次寫 `pagefind-entry.json` 的語系順序不同。integration 改寫成排序後的內容，同樣的頁面 build 出相同的 `dist/`，`scripts/ci/lighthouse-scope.mjs --verify` 才能比對

## 數字

2026-10-27，`npm run build` 的輸出：

| 項目 | 大小 |
|---|---|
| `SearchResults` 的 script | 2.6 KB（gzip 1.4 KB），只在 `/search` |
| `pagefind.js` | 45 KB（gzip 13 KB），只在 `/search` 第一次 focus 或帶 `?q=` 時載入 |
| `wasm.unknown.pagefind`（zh-tw、vi 用）、`wasm.en.pagefind` | 68 KB、72 KB（已壓縮） |
| `dist/pagefind/` 全部 | 2.7 MB，每次搜尋只下載用到的索引分片與結果的 fragment |

索引頁數：zh-tw 133、en 122、vi 146，與 dist 中各語系帶 `data-pagefind-body` 的頁數相同。

## 驗證

`node scripts/search/pagefind.mjs`（`npm run check` 的一部分，在 build 之後）在以下情況失敗：

- 索引頁數跟 dist 中各語系帶 `data-pagefind-body` 的頁數不同
- zh-TW 的「企業」「數位轉型」「昕力資訊」命中數低於下限（斷詞失效）
- 某個語系的 `/search` 連到其他語系的頁面
- `lighthouserc.cjs` 的 `PAGES` 中，`/search` 以外的頁面在載入時或打開頁首搜尋框時請求 `/pagefind/`
- 只用鍵盤無法從欄位走到結果，或「顯示更多結果」沒有把 focus 移到新加入的第一筆結果
- `/search` 有結果與沒有結果時，axe 找到 WCAG 2.2 A／AA 的違規

`/search?q=企業` 也列在 `lighthouserc.cjs` 的 `PAGES`，Lighthouse 量的是實際載入 Pagefind 並畫出結果的狀態（ADR 0004）。

## 取捨與限制

- ICU 字典沒有的詞會切成單字（「在地化」→「在」「地」「化」）。查詢也照同樣規則切，所以仍然找得到（「在地化」24 頁、「在地」32 頁）。但每個單字是分開比對的，只要這幾個字分散出現在同一頁，那一頁也會被找到
- 依賴 Node 與瀏覽器的 ICU 斷詞結果一致。兩邊版本不同時，少數詞可能切法不同；`pagefind.mjs` 的命中數下限會擋下大範圍的失效
- `astro dev` 沒有索引，`/search` 顯示載入失敗的狀態。要用 `npm run build && npm run preview` 看搜尋
- 升級 Pagefind 時要確認：Pagefind 是否仍會對 `zhtw` 以外的 `zh-*` 頁面斷詞、瀏覽器端是否仍依 `<html lang>` 找索引名稱，以及 `pagefind-entry.json` 的格式。`pagefind.mjs` 的命中數與索引頁數檢查會擋下這三種變化
