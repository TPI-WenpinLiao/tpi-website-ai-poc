# 0004. Lighthouse 關卡測各模板的代表頁

- 狀態：已採用
- 日期：2026-10-25
- issue：#87

## 背景

`npm run check` 的 Lighthouse CI 原本用 `staticDistDir` 自動探索網址。LHCI 預設只測找到的前 5 個 URL（`maxAutodiscoverUrls`），順序依檔名排序：`404`、`about-us`、`aiso`、`blog`、`cancelrecord`。M7 之後 `dist/` 有 485 頁，其餘 480 頁都沒有 performance、accessibility、best-practices、SEO 的關卡。

全部測不實際。雲端 session 跑一次 Lighthouse 約 12 秒，485 頁各跑 1 次要 97 分鐘，各跑 3 次約要 5 小時；quality-gate 的 job 上限是 20 分鐘（本 PR 調為 30 分鐘）。

## 全站量測

`npm run lighthouse:all` 對 `dist/` 的每一頁各跑 1 次（2026-10-25，雲端 session）。第一次有 202 頁沒達標，原因分四類，前三類在 #87 修掉：

| 原因 | 範圍 | 修法 |
|---|---|---|
| vi 頁面同時下載 Inter 與 JetBrains Mono 的 `latin-ext`、`vietnamese` 兩個 subset，比 zh 多約 120 KB 字型，模擬的 FCP 晚約 900 ms | vi 幾乎每一頁（93 左右） | `src/styles/base.css` 在 fontsource 之後再宣告一次 vietnamese face，越南文只用這個 subset |
| 新聞內頁的封面在手機選了 1440w（198 KB），內文圖片是 1600px 原檔 | media-center 內頁，最低 80 | `ArticleTemplate` 的 `sizes` 扣掉 gutter，手機選 720w；`astro.config.mjs` 的 `image.layout: 'constrained'` 讓 Markdown 圖片有 srcset |
| `/en` 首頁的「Learn More」連結文字（`link-text`） | 1 頁，SEO 0.92 | 改成「Explore OrientAI」 |
| three.js `runtime` chunk 的 scripting 380–480 ms，TBT 230–410 ms | 載入 3D 場景的頁面 | #127 |

修完後第二次全站量測，沒達標的 59 頁全部載入 3D 場景：offering 模板中有 `Scene3D` 的 57 頁有 56 頁、三語首頁 3 頁，最低 89。accessibility、best-practices、SEO 全部達標。

### M8-01 重跑（#43）

2026-10-27 在 `main` `753ed04` 上重跑 `npm run lighthouse:all`，雲端 session 共 96 分 20 秒。485 頁中 483 頁達標：

- performance：2 頁 0.93，`/en/products/systalk-coach`、`/vi/solutions/smartfilling`。這兩頁的 TBT 約 258 ms，同一頁的其他語系只有 12–36 ms。用 `node scripts/design/lighthouse-3d.mjs` 各重跑 3 次，行動版都是 0.98（TBT 20 ms、11 ms），判定是單次量測的起伏
- accessibility、SEO 全部 1
- best-practices：182 頁 0.96，達標但不是滿分。其中 180 頁是成功案例內頁，原因是客戶 logo 只輸出 1x（`image-size-responsive`），在 DPR 2 的螢幕上會模糊。`CaseStudyTemplate` 的 logo 從 `layout="none"` 改成 `layout="fixed"`（`srcset` 有 1x、2x 兩個寬度；`densities` 不能和 `layout` 一起用，型別不允許）後，抽測兩頁都是 1。另外 2 頁是 `/templates/*` 預覽頁的範例圖，不是正式頁面

`PAGES` 不變：除了上述 2 頁，其他頁面的 performance 都在 0.95 以上（0.95 的 4 頁：`/vi`、`/en/contact-us`、`/vi/contact-us`、`/media-center/572`），沒有新的未達標頁面要補進代表頁。

## 決策

1. **`npm run check` 測代表頁**：`lighthouserc.cjs` 的 `PAGES` 列出每個 `src/layouts/templates/` 模板至少一頁，取該模板在全站量測中 performance 最低的真實頁面；同分時取 vi（字型最多）。另外加上三語首頁與 404，offering 模板的 3D 頁與沒有 3D 的服務頁各一頁，以及帶查詢字串、會載入 Pagefind 的 `/search?q=企業`（M6-02，#34；`lhci-prepare.mjs` 檢查路徑時去掉 `?` 之後）。還沒有真實頁面的模板（目前是 `gated-download`，沒有白皮書）用 `/templates/<id>` 預覽頁。共 16 頁，各跑 3 次
2. **清單不會指到不存在的頁面**：`scripts/lhci-prepare.mjs` 在路徑不在 `dist/`，或有模板沒有任何一頁時失敗。改 slug 或新增模板的 PR 會被擋下，要同時改 `PAGES`。它不檢查頁面實際用哪個模板：頁面換模板時，`template` 要手動改
3. **3D 頁面的 performance 暫時只 warn**（#127 已拿掉）：`PAGES` 中載入 3D 的 4 頁（三語首頁、`/products/systalk-chat`）原本用 `assertMatrix` 把 performance 降成 `warn`。#127 把 3D 初始化拆成多個 task（ADR 0003「初始化的長任務」）後，所有頁面的 performance 都是 `error`
4. **全站量測留成工具**：`npm run lighthouse:all`（`LHCI_ALL=1`）測每一頁各 1 次，所有頁面的 performance 都是 `error`。不在 `npm run check` 裡；改到全站共用的部分（字型、`BaseLayout`、`PageLayout`、`astro.config.mjs` 的圖片設定）、新增大量內容，以及 M8-01 全站驗收時重跑，再依結果更新 `PAGES`

## 取捨

- 代表頁測不到同模板其他頁面的內容差異，例如某篇文章的圖片特別大。第一次全站量測的失敗都是整個模板或整個語系一起發生，所以每個模板挑一頁、挑最差的那頁，能抓到同類問題；個別頁面的問題靠 `lighthouse:all` 補
- LHCI 多次執行時，沒有設 `aggregationMethod` 就取最好的一次判定（`@lhci/utils` 的 `getValueForAggregationMethod`）。維持預設，3 次裡有 1 次達標就算過，避免模擬量測的起伏讓 `npm run check` 時好時壞
- 每頁跑 1 次的全站量測會受起伏影響，單頁差 1–3 分屬正常；判斷是否達標以 `npm run check` 的 3 次為準

## 結果

`npm run check` 的 LHCI 測 15 個 URL，各 3 次，共 45 次。執行時間：

| 環境 | 本 PR 前（5 個 URL） | 本 PR（15 個 URL） |
|---|---|---|
| 雲端 session，`time npm run check` | 7 分 0 秒 | 11 分 56 秒 |
| CI，quality-gate job | 6–8 分鐘 | 14 分 19 秒，其中 Lighthouse 8 分 45 秒（PR #128） |

quality-gate 的 `timeout-minutes` 從 20 調到 30。

### 例外：只改文件的 PR 不跑 Lighthouse（#129）

變更的檔案全部在白名單內的 PR，quality-gate 跳過 Lighthouse，其他檢查照跑。這類 PR 不會改變 `dist/`，Lighthouse 量到的頁面和 base 相同。

- 白名單只寫在 `scripts/ci/lighthouse-scope.mjs` 的 `DOCS_ONLY`，這裡不另列。`docs/` 不整個列入：build 會讀 `docs/ia/nodes.csv`、`docs/i18n/glossary.csv` 等 CSV
- 判斷：`lighthouse-scope.mjs --changed` 比對 PR 的 merge commit 與它的第一個 parent（base）。用 `--no-renames`，把 `src/` 的檔案移到 `docs/` 也算改到 `src/`
- 白名單的依據：跳過時改跑 `lighthouse-scope.mjs --verify`。它把白名單內的檔案全部拿掉再 build 一次，和完整 build 的 `dist/` 逐檔比對 sha256；build 失敗或有任何檔案不同就失敗。之後 build 開始讀某個 `.md` 時，第一個只改文件的 PR 會在這裡失敗，不會默默跳過。本機也能執行；CI 上約 10 秒（#131 的 run）
- job summary 寫明跳過的原因、白名單、`--verify` 的結果與變更的檔案
- 本機與雲端 session 的 `npm run check` 不受影響，仍包含 Lighthouse。`npm run check` = `npm run check:before-lighthouse` 加 `npm run lighthouse`，quality-gate 把兩段分開執行

### 卡住的量測與時間上限（#136）

10-27 起 quality-gate 有 3 次在單次量測卡住：log 停在某一次的 `Run #k...`，直到 job 的 `timeout-minutes: 30` 被取消，只留下 `context canceled`。3 次都是載入 3D 的頁面（`/products/systalk-chat` 兩次、`/en` 一次），同一個 commit 重跑都通過。

**原因**：LHCI 0.15.1 spawn Lighthouse 時沒有 timeout（`@lhci/cli/src/collect/node-runner.js`），stderr 也要等 Lighthouse 結束才會用到。Lighthouse 12.6.1 的大部分等待有上限（載入 45 秒、每個 CDP 指令 30 秒），但 `BFCacheFailures` gatherer 測 BFCache 時把頁面導到 `chrome://terms` 再返回，等 load 事件與 `frameNavigated` 都沒有上限，也不會因為 `Inspector.targetCrashed` 失敗。頁面在這一步 crash 時，Lighthouse 就永遠停住。

本機能穩定重現這種卡住，但只在一種 CI 不用的呼叫方式（把 puppeteer 的 page 傳給 Lighthouse）：3D canvas 上頁後每次都在 `chrome://terms` 那一步 crash，#127 之前的 build 也一樣，關掉 BackForwardCache 就不會。用 CI 的方式（`lhci collect`）量 `/products/systalk-chat` 30 次沒有卡住，所以 CI 的 3 次是不是同一件事沒有直接證據。#136 原本推測的 3D 初始化等待（`gpuDone`、`compileAsync`）已排除：讓兩者永遠不結束，Lighthouse 仍在 7 秒內正常完成（ADR 0003「等待的上限」）。

**決策**：

1. **跳過 `bf-cache` audit**：`lighthouserc.cjs` 的 `collect.settings.skipAudits`。Lighthouse 只為這個 audit 執行 `BFCacheFailures`，跳過後就不再導頁。它在 performance 的 weight 是 0，四個分數都不變；少掉的是「能不能進 BFCache」的診斷，改到這方面時用 Chrome DevTools 檢查
2. **單次量測 3 分鐘上限**：`npm run lighthouse` 與 `lighthouse:all` 經過 `scripts/lhci-run.mjs`。它轉送 LHCI 的輸出，每一次 `Run #k...` 開始時重設計時；超過 3 分鐘就印出 URL 與第幾次、Chrome 各 process 的 CPU 與 DevTools targets（頁面停在哪個網址、還有沒有回應、3D 的狀態），停掉 LHCI、Lighthouse 與 Chrome，exit 1。不自動重試，重試會把卡住藏起來。正常一次 11–13 秒，Lighthouse 自己的上限加起來約 2 分鐘。LHCI 在同一個 `Run #k` 裡會重試失敗的 Lighthouse，最多 3 次（`runUntilSuccess`）：失敗 1 次再成功約 2 分 15 秒，仍在 3 分鐘內；要失敗 2 次以上才會超過，這時那一頁本來就有問題，當成卡住回報。`LHCI_RUN_TIMEOUT_SECONDS` 可以調短，用來測試
3. **CI 的 Lighthouse step 15 分鐘上限**：quality-gate 的 step `timeout-minutes: 15`，正常 8–9 分鐘。它是 `lhci-run.mjs` 本身出問題時的保險，不影響本機
4. **job summary 寫出卡住的頁面**：`lhci-run.mjs` 在每一次量測開始時寫 `.lhci-progress.json`，`.github/scripts/lighthouse-summary.mjs` 讀它，沒有完成時寫出 URL、第幾次與診斷。job 被取消時檔案也已經寫好

LHCI 沒有單次量測的 timeout 設定，Lighthouse 的 `maxWaitForLoad` 只管載入，所以上限放在 LHCI 外面。

**Chrome flags 的環境變數**：本 issue 發現 `LHCI_COLLECT__SETTINGS__CHROME_FLAGS` 會讓 `lighthouserc.cjs` 的 `collect.settings` 整個失效：LHCI 用淺層展開把 `collect.*` 的環境變數蓋到 rc 檔上（`@lhci/cli/src/cli.js` 的 `mergeInCommandSpecificEnvironments`）。quality-gate、`scripts/session-start.sh` 與 `docs/onboarding.md` 改用 `LHCI_SETTINGS__CHROME_FLAGS`，yargs 會把它和 rc 檔合併。#136 之前開始的 session 環境裡還是舊名，`lhci-run.mjs` 會轉成新名並警告。

**本機的影響**：`npm run check` 也套用 3 分鐘上限與 `skipAudits`，正常情況下輸出與耗時不變。

**驗證方式**：模擬卡住用 `LHCI_RUN_TIMEOUT_SECONDS=3 npm run lighthouse`，第一次量測就會超時。

### 剛好 0.95 的頁面（#143）

M8-01 重跑時 performance 剛好 0.95 的 4 頁，任何 PR 都可能被擋下。PR #142 在 CI 上 3 次執行、9 次量測，`/en/contact-us` 的行動版都是 0.93，本機是 0.95。CI 當時沒有留下報告，差 2 分的原因無法直接確認。

**CI 留下報告**：quality-gate 的 Lighthouse step 失敗時，把 `.lighthouseci/`（每次量測的 HTML、JSON 報告）與 `.lhci-progress.json` 上傳成 artifact `lighthouse-report`，保留 14 天。Lighthouse step 失敗時，job summary 也會指向它（`LIGHTHOUSE_OUTCOME`，依 step 的結果判斷，不看分數：LHCI 3 次中有 1 次達標就算通過）。

**分數卡在哪裡**：這幾頁沒有長任務，TBT 0、CLS 0，分數由 FCP、LCP 決定。Lighthouse 模擬 FCP、LCP 時，悲觀的那一半會把實際載入中、在首次繪製（或 LCP）前開始的請求都算進頻寬，所以首次繪製前開始下載的字型與圖片也會拖慢模擬結果，即使它們不阻擋繪製。本機用 Lighthouse 的 `blockedUrlPatterns` 逐項拿掉請求來量（`main` `7f3ad26`）：

| 頁面 | 現狀 | 拿掉的請求 | 結果 |
|---|---|---|---|
| `/en/contact-us` | 0.95，FCP 2.41 s | 全部字型（約 180 KB） | 1，FCP 1.53 s |
| `/en/contact-us` | 同上 | 只有 Inter `latin-ext`（83 KB） | 0.98，FCP 1.82–1.96 s |
| `/media-center/572` | 0.95，LCP 2.72 s | 內文圖與 3 張「More」卡片圖（約 145 KB） | 0.97，LCP 2.26–2.34 s |

contact 頁的 `latin-ext` 只因為東京地址的「ō」（2-chōme）而下載。`/media-center/572` 的 LCP 是封面圖，卡片圖雖然是 `loading="lazy"`，但在手機上仍落在 Chrome 的 lazy load 距離內，和封面同時下載。`/vi` 本機已是 0.98，不需要處理。

**CSS 的比較**：`scripts/design/css-blocking.mjs` 列出每頁 render-blocking 的 CSS、大小與載入時用到的比例。contact 頁載入 6 個 CSS，gzip 後共 14.9 KB，載入時用到 33%。比較過的改法：

| 改法 | `/en/contact-us` | `/media-center/572` | contact 頁 HTML（gzip） |
|---|---|---|---|
| 現狀 | 0.95 | 0.95 | 7.6 KB |
| 全部 inline（`build.inlineStylesheets: 'always'`） | 0.97 | 0.96 | 19.2 KB |
| 只 inline 小檔 | 沒有變化：只要還有一個外部 CSS，就要多等一次往返。Astro 預設已 inline 4 KB 以下的 CSS | | |
| `@font-face` 移到非阻塞的 CSS（`media="print"` 再切換） | 1 與 0.95 間跳動：字型請求有時仍在首次繪製前開始 | | |

全部 inline 只多 0.01–0.02 分，代價是每頁 HTML 變成約 2.5 倍、CSS 不能跨頁快取，不採用（使用者 2026-10-28 決定）。

**決策**（使用者 2026-10-28 決定）：

1. **字型只宣告用到的 subset**：`BaseLayout` 不再 import fontsource 的整包 CSS。`src/styles/base.css` 自己宣告 Inter 與 JetBrains Mono 的 latin、vietnamese、greek 三個 subset，範圍抄自套件的 `unicode.json`。「ō」改由系統字型顯示。greek 保留給 SysTalk.Chat 產品名的「π」（3 頁的 h1，原本就下載 19 KB 的 greek 檔），以免 h1 的字型改變
2. **用檢查擋下新的字元**：`scripts/design/font-subsets.mjs`（`npm run check`）比對 build 出的 `@font-face` 與套件的 `unicode.json`，並在頁面文字有字型涵蓋、但這三個 subset 沒有的字元時失敗。例外寫在 `ALLOWED`，目前只有「ō」；沒有頁面用到的例外也會失敗。內容新增這類字元時，要決定加進 `ALLOWED` 還是多宣告一個 subset
3. **文章頁的「More」區塊延後繪製**：`ArticleTemplate` 的「More」Surface 加 `content-visibility: auto`（預留高度 `--offscreen-section-height`），卡片圖在區塊接近畫面時才下載
4. **文章封面 `quality={70}`**：`/media-center/572` 的 720w 封面從 76 KB 變成 59 KB，放大兩倍比對看不出差異。只做第 3 項是 0.96

**結果**：`node scripts/design/lighthouse-3d.mjs`，行動版各 3 次，取中位數：

| 頁面 | 改之前 | 改之後 | FCP | LCP |
|---|---|---|---|---|
| `/en/contact-us` | 0.95 | 0.98（0.98、0.98、0.98） | 1812 ms | 1812 ms |
| `/vi/contact-us` | 0.95 | 0.98（0.98、0.98、0.98） | 1968 ms | 1968 ms |
| `/vi` | 0.98 | 0.98（0.98、0.98、0.98） | 1813 ms | 1813 ms |
| `/media-center/572` | 0.95 | 0.97（0.97、0.97、0.98） | 1807 ms | 2258 ms |
| `/` | 0.99 | 0.99（0.99、0.99、0.99） | 1659 ms | 1659 ms |

CI 比本機低約 2 分，所以目標訂在本機 0.97 以上。2026-10-28 在本 PR 的 head 重跑 `npm run lighthouse:all`（雲端 session，96 分 59 秒）：485 頁全部達標，performance 最低 0.97（25 頁），其餘 0.98 以上；accessibility、SEO 全部 1，best-practices 最低 0.96。`PAGES` 不變
