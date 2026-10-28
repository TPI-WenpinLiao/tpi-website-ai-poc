# 全站驗收（M8-01）

M8-01（#43）對全站逐項驗收的結果與問題清單。上線步驟、風險與待決事項的負責人在 M8-02 launch-readiness（#44）整理。

- 驗收對象：本 PR 合併 `main` `6f8c823`（含 #136）後的 head。`npm run check` 在這個 head 上執行；全站 Lighthouse 在 #136 合併前的 `753ed04` 上量測，成功案例 logo 的修正另外抽測
- 日期：2026-10-27（全站 Lighthouse）、2026-10-28（`npm run check`），雲端 session，Node `v24.22.1`
- 範圍：`dist/` 的 485 頁（zh-TW 170、en 144、vi 171）與 `docs/ia/redirects.csv` 的 1,309 列

## 結論

`npm run check` 全部通過，redirect map 1,306 列都驗證過，全站 Lighthouse 485 頁中 483 頁達標，另外 2 頁重跑後達標。找到 5 個問題：2 個已在本 PR 修正，另外 3 個無法在本 PR 修正，各開 issue 追蹤（見「問題清單」）。

上線前還要處理：導覽連到的 12 頁沒有內容（#138）；12 列 redirect 的目標要補內容或改轉址規則（#137）；`_redirects` 的比對方式要在 preview 實測（#139）；各內容類型的「待確認」也還沒回覆（「內容待確認」）。追蹤碼與 consent（#36）、首頁與產品頁的最新文章（#101）合併後要重驗。

## `npm run check`

`npm run check` exit 0。下表是每個子檢查的輸出摘要，重跑 `npm run check` 會印出同樣的行。

| 項目 | 檢查 | 範圍 | 結果 |
|---|---|---|---|
| IA 資料 | `npm run check:ia` | 359 列對到 81 個節點中的 73 個；導覽 header 52、footer 30、footer 最底列 4 項；1,306 個現站網址 | 產出都是最新的 |
| 翻譯詞彙表 | `node scripts/i18n/glossary.mjs --check` | 189 列 | 通過；`confirmed` 26、`to-confirm` 26、`draft` 137（見「內容待確認」） |
| `status.md` | `node scripts/status/check.mjs` | | 通過 |
| design | `npm run check:design` | 90 組對比、53 個 CSS 檔、31 個元件、167 個 token | 0 個問題 |
| scripts 測試 | `npm run test:scripts` | 316 個測試 | 全部通過 |
| 型別 | `astro check` | 225 個檔案 | 0 errors、0 warnings、2 hints（`scripts/` 裡沒用到的參數，不影響產出） |
| 輸出 CSS | `node scripts/design/dist-css.mjs` | | 0 個問題 |
| heading | `node scripts/seo/headings.mjs` | 485 頁 | 0 個問題 |
| 語系路由 | `node scripts/i18n/routes.mjs` | 485 頁 | 0 個問題 |
| head 與 sitemap | `node scripts/seo/meta.mjs` | 485 頁與 `sitemap.xml`（457 個網址） | 0 個問題 |
| 站內連結 | `node scripts/seo/links.mjs` | 485 頁、72,887 個站內參照 | 0 個斷連；`PENDING` 的 12 頁與外部節點不算錯誤，見問題 2 |
| redirect 目標 | `node scripts/ia/redirect-targets.mjs`（本 PR 新增） | 1,306 列 | 見「redirect map」 |
| 水平捲動 | `node scripts/design/overflow.mjs` | 485 頁 × 4 種寬度 | 0 頁溢出 |
| 無障礙 | `node scripts/design/axe.mjs` | 485 頁，axe-core 4.14.0，WCAG 2.0／2.1 A、AA 與 2.2 AA | 0 個違規 |
| 影片 facade | `node scripts/design/video-facade.mjs` | 1 頁 | 0 個問題 |
| 3D 等待上限 | `node scripts/design/scene-wait.mjs`（#136 新增） | `/products/systalk-chat` | fence 與 shader 永遠不完成時，3D 都在上限內上頁（上限＝未改動時的耗時加上 `WAIT_LIMIT_MS` 與容許誤差，每次量測不同；本機一次為 1,101 ms、1,156 ms，上限 2,656 ms） |
| 站內搜尋 | `node scripts/search/pagefind.mjs` | 索引 zh-TW 133、en 122、vi 146 頁；15 頁確認沒有載入 `/pagefind/` | 0 個問題 |
| 表單 | `node scripts/forms/contact.mjs` | 4 頁 | 0 個問題 |
| 視覺回歸 | `npm run test:visual` | 首頁三語與 10 個模板預覽頁 × 3 種寬度 | 只在 CI 比對（`docs/workflow.md`「視覺回歸」），以本 PR 的 quality-gate 為準 |
| HTML | `npm run validate:html` | `dist/**/*.html` | 0 個問題 |
| Lighthouse 代表頁 | `npm run lighthouse` | 16 頁 × 3 次 | 全部達標 |

另外確認：

- 不被收錄：`public/robots.txt` 是 `Disallow: /`，`public/_headers` 對 `/*` 送 `X-Robots-Tag: noindex, nofollow`，`dist/` 的 HTML 沒有 `noindex` meta（Lighthouse 要量 SEO 分數）
- build 的警告：`runtime.*.js` 超過 500 kB。這個 chunk 是 three.js，gzip 後 131,110 bytes，與 ADR 0003 記錄的 130 KB 相同，在閒置時才載入，不算問題

## redirect map

`node scripts/ia/redirect-targets.mjs` 對 `dist/` 逐列驗證 `redirects.csv`，含路徑不變的 200 列，萬用規則（`/ja/*`、`/vn/*`、`www.tpisoftware.vn/*`）沒有單一目標，不在範圍內。判斷頁面存在的方式與 `links.mjs` 相同，用 `scripts/lib/static-server.mjs` 的 `servedFile`。

| 結果 | 列數 |
|---|---|
| 目標有建出 | 1,270 |
| 目標是外部節點（`/hr`、`/tpu`） | 2 |
| 目標是 `PENDING` 的頁面 | 22 |
| 目標在 `UNBUILT`：已知沒建出，見問題 1 | 12 |
| 目標沒建出、也不在清單上 | 0 |
| 轉址鏈：目標又是另一條規則的來源 | 0 |

`redirects.mjs --check` 另外確認：每個現站網址恰好一列、`_redirects` 規則不會比對到新站頁面、數量在 Cloudflare Pages 的上限內（靜態 775 條、動態 2 條）。

只有 Cloudflare 本身能回答的兩項還沒驗證，見問題 3：

- 來源路徑是否區分大小寫：5 條規則只差大小寫，例如 `/products/gadoDIDO` → `/products/gadodido`
- `%` 編碼的來源怎麼比對：1 條，`/pdf/%E8%B3%87…%96.pdf` → `/security-policy`

`public/_redirects` 目前不存在。上線時用 `node scripts/ia/redirects.mjs --redirects public/_redirects` 產生，列在 #44。

## 全站 Lighthouse

`npm run lighthouse:all` 對 485 頁各跑 1 次（ADR 0004「決策」第 4 點指定 M8-01 重跑），雲端 session 共 96 分 20 秒。門檻與 `npm run check` 相同：performance、accessibility、best-practices 0.95，SEO 1。

| 類別 | 結果 |
|---|---|
| performance | 483 頁 ≥ 0.95；2 頁 0.93（`/en/products/systalk-coach`、`/vi/solutions/smartfilling`） |
| accessibility | 485 頁都是 1 |
| best-practices | 303 頁 1，182 頁 0.96 |
| SEO | 485 頁都是 1 |

performance 0.93 的 2 頁重跑 3 次都是 0.98，判定是單次量測的起伏。best-practices 0.96 的 182 頁都是 `image-size-responsive`，其中 180 頁是成功案例的客戶 logo，本 PR 已修正（問題 5）。

重跑的數字、logo 修正的抽測結果與 `PAGES` 不變的理由寫在 ADR 0004「M8-01 重跑」。

## 待 #36、#101 合併後重驗

這兩張 issue 還沒合併，下列項目在本次驗收的結果只代表目前的 `main`：

| 項目 | issue | 合併後要重驗 |
|---|---|---|
| 追蹤碼與 consent | #36 | 同意前不送出追蹤請求；consent banner 的 axe、水平捲動與 Lighthouse；GTM 對代表頁 performance 的影響 |
| 首頁與產品頁的最新文章卡片 | #101 | 卡片連結（`links.mjs`）、封面圖的 alt 與尺寸、首頁三語與 `/products/digirunner` 的 Lighthouse 與視覺回歸 |

重驗方式：兩張都合併後，在 `main` 重跑 `npm run check` 與 `npm run lighthouse:all`，結果補進本檔。

## 內容待確認

下列內容由內容負責人確認，程式無法修正。#44 launch-readiness 會為每一項指定負責人：

- `docs/status.md`「下一步」中「回覆…的『待確認』」各項：M5 各內容類型的遷移、M6 的表單、搜尋、影片文案，以及 M7 的 en、vi 翻譯
- `docs/research/inventory.csv` 有 108 列寫了 `to_confirm`（rewrite 55、keep 30、drop 14、merge 9），依據見 `docs/research/content-audit.md`
- `docs/i18n/glossary.csv` 有 163 列還沒確認（`to-confirm` 26、`draft` 137）
- `docs/ia/content-model.md`、`docs/research/features.md`、`docs/ia/redirects.md` 文末的「待確認」

## 問題清單

| # | 問題 | 處置 |
|---|---|---|
| 1 | `redirects.csv` 有 12 列的目標沒建出：`/download/digimars`、`/download/digirunner` 三語（offering 沒有 `downloads`）、5 篇遷移失敗的 blog、`/vi/privacy` | #137；目前列在 `scripts/ia/redirect-targets.mjs` 的 `UNBUILT` |
| 2 | 導覽連到但沒建出的 12 頁（`scripts/seo/links.mjs` 的 `PENDING`），另有 22 列 redirect 轉到這些頁面 | #138（needs-input） |
| 3 | Cloudflare Pages 的 `_redirects` 是否區分大小寫、`%` 編碼怎麼比對，雲端 session 連不到 `*.pages.dev` 無法實測 | #139 |
| 4 | redirect map 沒有對 build 產出驗證 | 已修正：本 PR 新增 `scripts/ia/redirect-targets.mjs`，接進 `npm run check` |
| 5 | 成功案例內頁的客戶 logo 只輸出 1x，Lighthouse `image-size-responsive` 不通過（180 頁） | 已修正：`CaseStudyTemplate` 的 logo 改成 `layout="fixed"`，`srcset` 有 1x、2x |
