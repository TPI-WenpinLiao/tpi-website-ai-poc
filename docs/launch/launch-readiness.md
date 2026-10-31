# 上線準備（M8-02）

> **範圍外**：本專案驗證 AI 開發官網的品質，不上線，不做 Google Search Console、GTM 的實際設定（`CLAUDE.md`「專案目標」，#162）。本檔保留 M8-02 當時的判斷供參考，不再更新，待決事項也不追蹤。

M8-02（#44）整理新站上線前要做的事，讓決策者判斷能不能上線。內容包括上線步驟、風險和待決事項。驗收結果見 [`audit.md`](audit.md)（M8-01），本檔只引用結論。

- 日期：2026-10-29
- 依據：`main` `d4aaa56`（含 #36）。`npm run check` 在這個 commit 上 exit 0
- 負責人欄寫「待確認」的項目，由專案負責人指派

## 結論：目前不能上線

程式品質已經達到上線標準：`npm run check` 全部通過，`npm run lighthouse:all` 測的 485 頁全部達標，見 `audit.md`。目前卡住上線的是內容、外部設定和幾項還沒做的決定。下列 6 項全部完成前，不建議上線：

1. 決定正式網域，並決定 `www.tpisoftware.vn` 要不要保留（待決 D1、D2）
2. 聯絡表單要能送到有人收的地方。目前的 `logAdapter` 只把送出的資料寫進 log，業務收不到（待決 D4、風險 R1）
3. 已完成：導覽連到的頁面都已建出。現站有內容的 4 頁（`/cloudservice`、`/outsourcing`、`/chatgpt-enterprise`、`/resource`）已搬移（#159），沒有內容來源的 8 頁已從導覽拿掉（#138），redirect 目標沒建出的 12 列已處理（#137）
4. 部署 `_redirects`（見「`_redirects` 部署與否」）。比對方式已在 preview 實測（#139），現在的產出可以照原樣部署
5. 內容負責人回覆各內容類型的「待確認」，至少要確認客戶名稱與 logo 的授權、圖片授權和法務頁（待決 D8、D9）
6. #101 合併後，在 `main` 重跑 `npm run check` 與 `npm run lighthouse:all`，結果補進 `audit.md`（`audit.md`「待 #36、#101 合併後重驗」，#36 已合併）

追蹤碼（GTM）不是上線的必要條件。沒有設定 `PUBLIC_GTM_ID` 時，網站不顯示同意橫幅，也不載入 GTM（ADR 0007）。代價是上線初期沒有流量資料（風險 R5）。

## 上線步驟

前提：「結論」列的條件已經完成。依下列順序執行，每一步都要先驗證過再做下一步。除了第 6 步的 repo 修改，其他步驟都在 Cloudflare 或 GTM 操作，雲端 session 做不到，由人執行。

| # | 步驟 | 在哪裡做 | 驗證 |
|---|---|---|---|
| 1 | 在 Pages 專案的 Environment variables 把 `SITE_URL` 設成正式網域（例如 `https://www.tpisoftware.com`），production 與 preview 都要設。canonical、hreflang、`og:url`、`sitemap.xml` 都從這個值產生（`astro.config.mjs`，ADR 0002「影響」） | Cloudflare Pages | 重新部署後，任一頁的 `<link rel="canonical">` 都是正式網域 |
| 2 | 確認 Pages 的 `NODE_VERSION` 和 `.nvmrc` 一致（目前是 `26`，ADR 0001「影響」） | Cloudflare Pages | build log 印出的 Node 主版號 |
| 3 | 表單：建立 Turnstile widget，網域加上正式網域，再設定 `PUBLIC_TURNSTILE_SITE_KEY`、`TURNSTILE_SECRET_KEY`（ADR 0005「設定」）。送出 adapter 依 D4 的決定換掉 `logAdapter`（ADR 0005「之後」），這部分要另開 issue | Cloudflare dashboard；repo | 在 preview 送出 `/contact-us` 一次，導到 `/thanks`，收件端有收到 |
| 4 | 追蹤（要開才做）：填好 `src/data/consent.ts` 的類別與三語文案並改成 `draft: false`，在 GTM 設定 tag 的同意條件，再設定 `PUBLIC_GTM_ID`（ADR 0007「設定」） | repo；GTM；Cloudflare Pages | `node scripts/consent/gtm.mjs`；在 preview 確認按下同意前沒有送往 `googletagmanager.com` 的請求 |
| 5 | 轉址：照「`_redirects` 部署與否」產生並 commit `public/_redirects`。`.vn` 網域依 D2 的決定設定 Bulk Redirects，或在 `.vn` 那邊自己轉址（`docs/ia/redirects.md`「轉成 `_redirects`」） | repo；Cloudflare | `npm run check`（`redirects.mjs --check`、`redirect-targets.mjs`）；preview 上抽測 #139 列的 curl |
| 6 | 開放收錄，用一個 PR 完成：<br>・`public/_headers` 的 `X-Robots-Tag: noindex, nofollow` 從 `/*` 改成只套用在 `*.pages.dev`，例如 `https://:project.pages.dev/*` 與 preview 的 `https://:version.:project.pages.dev/*`。加上 custom domain 後，`tpi-website-ai-poc.pages.dev` 照樣提供服務，整條刪掉的話它會和正式網域一起被收錄。host 規則的寫法以 Cloudflare Pages 的 Headers 文件為準（雲端 session 連不到官方文件，本檔沒有查證）<br>・`public/robots.txt` 改成 `Allow: /`，加上 `Sitemap: <正式網域>/sitemap.xml`<br>・`CLAUDE.md`「專案目標」裡「不可被搜尋引擎收錄」與「只部署到 `*.pages.dev`」兩句，改成上線後的規則<br>・寫著「不可收錄」或「`_headers`、`robots.txt` 不得放寬」的規則與說明一起改：`.claude/skills/pr-review/SKILL.md` 的固定檢查（不改的話，這個 PR 會被審查迴圈判成違規）、`.claude/skills/seo-checklist/SKILL.md`、`README.md`、ADR 0001「影響」、`public/_headers` 開頭的註解<br>・`Seo.astro`、`scripts/seo/meta.mjs`、`src/lib/seo/sitemap.ts` 的註解寫著網站靠 `_headers` 與 `robots.txt` 擋收錄，一起改。`scripts/lhci-prepare.mjs` 刪掉 `.lhci-dist/` 的這兩個檔案，檔案改了以後照樣能跑，不用改 | repo | `npm run check`；`curl -sI <正式網域>/` 沒有 `X-Robots-Tag`；`curl -sI https://tpi-website-ai-poc.pages.dev/` 仍有 `X-Robots-Tag: noindex, nofollow`；`curl <正式網域>/robots.txt` |
| 7 | 在 Pages 專案的 Custom domains 加上正式網域，DNS 指到 Pages。這一步做完就切換流量了，現站從此不再提供服務 | Cloudflare | 見「上線後檢查」 |
| 8 | 在 Google Search Console 驗證網域並提交 `sitemap.xml` | Search Console | Search Console 顯示 sitemap 已讀取，網址數與 `dist/sitemap.xml` 相同 |

第 6 步的 PR 要和第 7 步一起執行。第 6 步合併後、第 7 步完成前，正式網域還指向現站，新站只能從 `*.pages.dev` 連到。這時 `*.pages.dev` 仍有 noindex，但 `robots.txt` 已經指向還沒切換的正式網域 sitemap。合併前先確認第 7 步可以馬上接著做。

### `_redirects` 部署與否

推薦部署。現站有 1,306 個網址列在 `docs/ia/redirects.csv`，不部署的話，外部連結和搜尋結果裡的舊網址上線後都會變成 404，累積的 SEO 權重也會流失。數量在上限內：靜態 784 條（上限 2,000）、動態 2 條（上限 100），由 `redirects.mjs --check` 確認。

部署的前提 #137、#138、#139、#159 都已完成。#139 在 preview 實測，Cloudflare 比對來源區分大小寫，`%` 編碼的來源也比對得到，所以照現在的產出部署：`node scripts/ia/redirects.mjs --redirects public/_redirects`。實測結果見 `docs/ia/redirects.md`「Cloudflare 的比對方式」。

`_redirects` 只對 Pages 專案收到的請求生效，所以第 7 步把正式網域指過來以後，舊網址才會開始轉址。

### 上線後檢查

第 7 步完成後馬上執行。`<網域>` 是正式網域：

1. `curl -sI <網域>/`：回 200，沒有 `X-Robots-Tag`。`curl -sI https://tpi-website-ai-poc.pages.dev/` 仍有 `X-Robots-Tag: noindex, nofollow`
2. `curl -sI <網域>/products/gadoDIDO`：回 301，`Location` 是 `/products/gadodido`；`curl -sI <網域>/products/gadodido` 回 200
3. 從 `redirects.csv` 中 `www.tpisoftware.com` 的 301 列隨機抽 20 列，各 curl 一次，都轉到 `to`。`www.tpisoftware.vn` 的 398 列不在 `_redirects` 裡，依 D2 的做法另外檢查
4. `<網域>/sitemap.xml` 裡的網址都以正式網域開頭
5. 三語首頁與 `/contact-us` 各開一次，表單送出一次
6. 有設定 GTM 時，確認按下同意前沒有送往 `googletagmanager.com` 的請求，同意後才有
7. 用 PageSpeed Insights 量首頁與一個產品頁的實際使用者 CWV。上線前只有 headless Chrome 的實驗室數字（風險 R6）

## 風險

| # | 風險 | 影響 | 降低方式 | 相關 |
|---|---|---|---|---|
| R1 | 聯絡表單沒有接後端，送出的資料只寫進 Function log | 主要轉換「聯絡業務」（`docs/research/audience-and-goals.md`）的資料沒有人收到 | 上線前依 D4 換掉 `logAdapter` | ADR 0005、`docs/research/features.md`「待確認」1–3 |
| R2 | 導覽連到的 4 頁沒有建出，`redirects.csv` 另有 13 列舊網址的目標是這些頁 | 使用者從選單點到 404；舊網址轉到 404 | 已處理：4 頁從現站搬內容（#159）。沒有內容來源的 8 頁已從導覽拿掉，白皮書舊網址改轉到產品頁（#138）。`scripts/seo/links.mjs` 不再有豁免清單，連到沒建出的頁面一律失敗 | #159、#138 |
| R3 | 12 列 redirect 的目標沒建出：digiMars、digiRunner 的下載頁三語，5 篇遷移失敗的 blog，`/vi/privacy` | 這些舊網址轉到 404 | 已處理（#137）：vi 2 篇 blog 補上內容，其他 10 列改轉到產品頁、分類列表頁與 `/en/privacy`；之後不在 blog API 的 3 篇改讀文章頁，zh-TW、en 各 1 篇轉出，vi 1 篇早於保留門檻改為 drop | #137、`docs/ia/redirect-overrides.csv` |
| R4 | Cloudflare 比對 `_redirects` 的方式和 #139 實測時不同 | 只差大小寫的 5 條規則形成迴圈；`%` 編碼的 1 條比對不到 | #139 已實測：區分大小寫、編碼的來源比對得到。上線後在正式網域再確認一次，見「上線後檢查」第 2 項 | #139、`docs/ia/redirects.md`「Cloudflare 的比對方式」 |
| R5 | 沒有 GA4、Search Console 的權限，也還沒決定新站的 GTM | 上線前後的自然搜尋流量沒辦法比較；成功指標無法量測 | 上線前取得 Search Console 權限，至少保留現站的基準數字（D6） | `docs/research/seo-baseline.md`、`audience-and-goals.md` |
| R6 | 效能只在 headless Chrome 量過，沒有在 preview 用真機量測，也沒有現站 origin 層級的 field CWV | 實際使用者的 LCP、INP 可能和實驗室數字不同 | 上線後檢查第 7 項；有問題再開 issue | ADR 0004、`docs/status.md`「待辦備忘」 |
| R7 | 內容的「待確認」還沒回覆：客戶名稱與 logo 的授權、圖片授權、en 法務頁的英譯、AI 草擬的 en、vi 譯文 | 授權有問題的內容需要下架；譯文錯誤 | 上線前回覆 D8、D9 | `audit.md`「內容待確認」 |
| R8 | 換網域時 `SITE_URL` 沒設定或設錯 | canonical、hreflang、sitemap 全部指向 `*.pages.dev`，搜尋引擎把舊網域當成正式版本 | 上線步驟第 1 步驗證過再繼續 | `astro.config.mjs` |
| R9 | 開放收錄時把 `*.pages.dev` 的 noindex 一起拿掉，或第 6、7 步的順序弄錯 | `*.pages.dev` 被收錄，和正式網域形成重複內容 | 第 6 步只對正式網域開放，`*.pages.dev` 保留 noindex；第 6、7 步一起執行，上線後檢查第 1 項確認 | `public/_headers`、`public/robots.txt` |
| R10 | `www.tpisoftware.vn` 的舊網址沒有處理。`_redirects` 不支援網域層級的轉址，萬用規則還會把 `/vn/*` 轉到不存在的 `/vi/vn/*` | vi 的舊網址和外部連結失效 | D2 決定後設定 Bulk Redirects，先去掉 `/vn/` 前綴再轉 | `docs/ia/redirects.md`「待確認」第 3 項 |

## 待決事項

負責人欄寫「待確認」的項目，由專案負責人指派後填上。推薦欄是 Claude 依現有文件提出的建議，不是已經做的決定。

| # | 事項 | 要決定什麼 | 推薦 | 負責人 | 相關文件 |
|---|---|---|---|---|---|
| D1 | 正式網域 | 上線用哪個網域；上線日期 | 沿用 `www.tpisoftware.com`，舊網址的權重可以透過 `_redirects` 接過來 | 待確認 | ADR 0002「影響」 |
| D2 | `www.tpisoftware.vn` | 保留為轉址來源，或停用 | 保留並轉到 `/vi`，用 Bulk Redirects 設定，去掉 `/vn/` 前綴 | 待確認 | `docs/ia/redirects.md`「待確認」 |
| D3 | `_redirects` | 上線時要不要部署 | 部署，前提的 #159 已完成（見「`_redirects` 部署與否」） | 待確認 | #139 |
| D4 | 表單送出到哪裡 | 沿用現站的 `/tpi/api/*`，或改用其他收件方式；收件信箱或 CRM | 沿用 `/tpi/api/*`。現站後端負責人要先回答 `features.md`「待確認」1–3（收件位置、CORS、reCAPTCHA） | 待確認 | ADR 0005「之後」、`docs/research/features.md` |
| D5 | 追蹤與 consent | 要遵循的法規或公司政策、cookie 分類、三語文案由誰提供、上線時要不要開 GTM | 先上線不開 GTM，consent 文案確定後再開 | 待確認 | ADR 0007、`src/data/consent.ts` |
| D6 | GA4、Search Console 權限 | 取得權限，並記錄現站的流量基準 | 上線前取得，保存上線前 3 個月的數字 | 待確認 | `docs/research/seo-baseline.md`、`docs/research/features.md`「待確認」6 |
| D7 | 導覽中沒有內容的 12 頁 | 每頁的內容來源，或從導覽拿掉；白皮書檔案的位置 | 已決定（2026-10-31）：現站有對應頁的 4 頁照搬（#159），其他 8 頁先從導覽拿掉（#138），要做時另開 issue | 使用者 | #138、#159 |
| D8 | 內容授權 | 客戶名稱與 logo、文章圖片與人物照、顧問照片的使用授權 | 上線前逐項確認，沒確認的先拿掉 | 待確認 | `docs/status.md`「下一步」中 M5-03、M5-05、#107 的「待確認」 |
| D9 | 內容與譯文審稿 | M5 各內容類型的「待確認」、`glossary.csv` 還沒確認的 162 列、en 法務頁是否要法務審閱、越南文審稿 | 法務頁與產品頁優先，blog 可以上線後再修 | 待確認 | `audit.md`「內容待確認」、`docs/i18n/glossary.md` |
| D10 | 不在導覽的產品與方案 | 6 個產品或方案是否還在賣 | 不賣的改成 drop，舊網址轉到上一層 | 待確認 | `docs/ia/sitemap.md`「決策紀錄」、`docs/research/content-audit.md` |
| D11 | 受眾與轉換目標的其餘問題 | `audience-and-goals.md`「尚未回答的問題」中還沒回答的 6 題 | 第 3 題（表單回覆時間與收件窗口）跟 D4 一起回答，其他題可以上線後再處理 | 待確認 | `docs/research/audience-and-goals.md` |
| D12 | 現站第三方服務 | 評價 badge 是否保留；WOVN.io、Benchmark Email、MISA AMIS 的合約與帳號 | badge 改成靜態圖加連結，其他服務上線後停用前先確認合約 | 待確認 | `docs/research/features.md`「待確認」4、9、10 |
