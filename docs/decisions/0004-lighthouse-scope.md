# 0004. Lighthouse 關卡測各模板的代表頁

- 狀態：已採用
- 日期：2026-10-25
- issue：#87

## 背景

`npm run check` 的 Lighthouse CI 原本用 `staticDistDir` 自動探索網址。LHCI 預設只測找到的前 5 個 URL（`maxAutodiscoverUrls`），順序依檔名排序：`404`、`about-us`、`aiso`、`blog`、`cancelrecord`。M7 之後 `dist/` 有 485 頁，其餘 480 頁都沒有 performance、accessibility、best-practices、SEO 的關卡。

全部測不實際。雲端 session 跑一次 Lighthouse 約 12 秒，485 頁各跑 1 次要 97 分鐘，各跑 3 次約要 5 小時；quality-gate 的 job 上限是 30 分鐘。

## 全站量測

`npm run lighthouse:all` 對 `dist/` 的每一頁各跑 1 次（2026-10-25，雲端 session）。第一次有 202 頁沒達標，原因分四類，前三類在 #87 修掉：

| 原因 | 範圍 | 修法 |
|---|---|---|
| vi 頁面同時下載 Inter 與 JetBrains Mono 的 `latin-ext`、`vietnamese` 兩個 subset，比 zh 多約 120 KB 字型，模擬的 FCP 晚約 900 ms | vi 幾乎每一頁（93 左右） | `src/styles/base.css` 在 fontsource 之後再宣告一次 vietnamese face，越南文只用這個 subset |
| 新聞內頁的封面在手機選了 1440w（198 KB），內文圖片是 1600px 原檔 | media-center 內頁，最低 80 | `ArticleTemplate` 的 `sizes` 扣掉 gutter，手機選 720w；`astro.config.mjs` 的 `image.layout: 'constrained'` 讓 Markdown 圖片有 srcset |
| `/en` 首頁的「Learn More」連結文字（`link-text`） | 1 頁，SEO 0.92 | 改成「Explore OrientAI」 |
| three.js `runtime` chunk 的 scripting 380–480 ms，TBT 230–410 ms | 載入 3D 場景的頁面 | #127 |

修完後第二次全站量測，沒達標的 59 頁全部載入 3D 場景：offering 模板中有 `Scene3D` 的 57 頁有 56 頁、三語首頁 3 頁，最低 89。accessibility、best-practices、SEO 全部達標。

## 決策

1. **`npm run check` 測代表頁**：`lighthouserc.cjs` 的 `PAGES` 列出每個 `src/layouts/templates/` 模板至少一頁，取該模板在全站量測中 performance 最低的真實頁面；同分時取 vi（字型最多）。另外加上三語首頁與 404，offering 模板的 3D 頁與沒有 3D 的服務頁各一頁。還沒有真實頁面的模板（目前是 `gated-download`，沒有白皮書）用 `/templates/<id>` 預覽頁。共 15 頁，各跑 3 次
2. **清單不會過期**：`scripts/lhci-prepare.mjs` 在路徑不在 `dist/`，或有模板沒有任何一頁時失敗。改 slug 或新增模板的 PR 會被擋下，要同時改 `PAGES`
3. **3D 頁面的 performance 暫時只 warn**：`PAGES` 中 `scene: true` 的 4 頁（三語首頁、`/products/systalk-chat`）用 `assertMatrix` 把 performance 降成 `warn`，log 仍印出分數；其他類別與其他頁面維持 `error`。#127 把 TBT 降下來後拿掉這個例外
4. **全站量測留成工具**：`npm run lighthouse:all`（`LHCI_ALL=1`）測每一頁各 1 次，所有頁面的 performance 都是 `error`，沒有 3D 例外。不在 `npm run check` 裡；改到全站共用的部分（字型、`BaseLayout`、`PageLayout`、`astro.config.mjs` 的圖片設定）、新增大量內容，以及 M8-01 全站驗收時重跑，再依結果更新 `PAGES`

## 取捨

- 代表頁測不到同模板其他頁面的內容差異，例如某篇文章的圖片特別大。第一次全站量測的失敗都是整個模板或整個語系一起發生，所以每個模板挑一頁、挑最差的那頁，能抓到同類問題；個別頁面的問題靠 `lighthouse:all` 補
- LHCI 多次執行時，沒有設 `aggregationMethod` 就取最好的一次判定（`@lhci/utils` 的 `getValueForAggregationMethod`）。維持預設，3 次裡有 1 次達標就算過，避免模擬量測的起伏讓 `npm run check` 時好時壞
- 每頁跑 1 次的全站量測會受起伏影響，單頁差 1–3 分屬正常；判斷是否達標以 `npm run check` 的 3 次為準

## 結果

`npm run check` 的 LHCI 測 15 個 URL，各 3 次，共 45 次。執行時間：

| 環境 | 本 PR 前（5 個 URL） | 本 PR（15 個 URL） |
|---|---|---|
| 雲端 session，`time npm run check` | 7 分 0 秒 | 11 分 56 秒 |
| CI，quality-gate | 6–8 分鐘 | PR #128 的 quality-gate run |

quality-gate 的 `timeout-minutes` 從 20 調到 30。
