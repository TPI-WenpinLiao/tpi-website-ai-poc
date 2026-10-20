# 現站功能盤點（M1-04）

現站 https://www.tpisoftware.com（zh-TW、en）與 https://www.tpisoftware.vn（vi）的互動功能與第三方服務，以及新站的對應做法。M6 實作功能時以本檔為輸入；「待確認」的項目要先問到答案才能定案。

## 資料來源與量測時間

| 資料 | 檔案 | 量測時間 | 工具與方式 |
|---|---|---|---|
| 逐請求明細 | [`features-requests.csv`](./features-requests.csv) | 2026-10-20 10:27 UTC 起 | `scripts/inventory/features.mjs`，puppeteer-core 24.43.1、headless Chromium 141，134 頁，0 失敗，約 33 分鐘 |
| 彙整 | [`features-summary.json`](./features-summary.json) | 同上 | 同上 |

`features-summary.json` 的欄位：

| 欄位 | 內容 |
|---|---|
| `trackingIds` | 從請求 URL 與 inline script 擷取的 GTM、GA4、UA、Google Ads、Facebook Pixel ID |
| `thirdPartyHosts` | 每個第三方網域的出現頁數、page_type、資源類型、是否連線失敗 |
| `firstPartyApis` | 頁面載入時實際送出的同源 XHR／fetch |
| `apiClient` | 從 Nuxt bundle 解析的 API client 方法、HTTP method、路徑，以及哪些 chunk 呼叫它、哪些取樣頁面載入了該 chunk |
| `pages` | 每頁渲染後的表單欄位、iframe、video、全域變數（`dataLayer`、`fbq` 等）、第三方 script、搜尋測試結果 |

`features-requests.csv` 只保留第三方請求與同源的 document／XHR／fetch，不含同源的圖片、CSS、JS。

## 重現方式

```bash
npm ci
node scripts/inventory/features.mjs                    # 全部取樣頁，2026-10-20 實測約 33 分鐘
node scripts/inventory/features.mjs --only /contact-us # 只跑網址含此片段的頁面
```

- 需要 `CHROME_PATH`。雲端 session 由 `scripts/session-start.sh` 設定
- 有設定 `HTTPS_PROXY` 時，script 會把 proxy 傳給 Chromium，bundle 下載也走 proxy
- 重跑會覆寫兩個產出檔。`inventory.csv` 更新後重跑，取樣清單會跟著變

### 取樣規則

輸入是 [`inventory.csv`](./inventory.csv)（M1-01）中 `status` = 200 的 HTML 頁，排除 PDF，取以下兩類的聯集：

1. `forms` 或 `embedded_media` 非空的頁面：95 頁，全部取樣
2. 每個 page_type × locale 依網址排序取第一頁

合計 134 頁（zh-TW 52、en 41、vi 41），涵蓋 21 種 page_type。

### 量測時的動作

- 每頁開新的 browser context，不帶 cookie，等同第一次造訪的訪客
- 載入到 network idle 後捲到頁尾，再等 4 秒，讓 lazy load 與延遲載入的 script 送出請求
- 搜尋頁在搜尋框輸入 `API` 後按 Enter，記錄搜尋呼叫的 API
- 不送出任何表單。表單的送出端點從 JS bundle 靜態解析，不實際呼叫

### 限制

- 雲端 session 的 proxy 擋下除了 `fonts.googleapis.com`、`fonts.gstatic.com`、`s3.amazonaws.com` 以外的第三方網域。瀏覽器仍會送出請求，所以網域與 URL 都有記錄（`failure` 欄為 `net::ERR_TUNNEL_CONNECTION_FAILED`）。但第三方 script 沒有執行，它們再載入的下一層請求看不到。例如 GTM 容器內設定的 tag、評價 badge 的實際內容
- 表單的資料在後端寄給誰、寫進哪個系統，從前端無法得知。本檔只寫前端看得到的端點
- `/download/digimars`（3 個語系）在頁面載入時會自己呼叫 `GET /tpi/api/FileDownload/DigiMars` 與 `POST /tpi/api/DigiMars/UpdateStatus`。本次量測載入了這 3 頁，等於呼叫了這兩支 API 各 3 次。script 沒有點擊或填寫任何東西

## 功能總覽

| 類別 | 功能 | 現站做法 | 新站建議 |
|---|---|---|---|
| 表單 | 聯絡、預約 demo、白皮書下載、報價、電子報等 16 種 | Nuxt 元件，POST 到同源 `/tpi/api/*` | 見「表單」 |
| 搜尋 | 站內搜尋 | `GET /api/search`，zh-TW 與 en 回 500 | 見「搜尋」 |
| 影片 | YouTube 嵌入、自架 MP4 | iframe、`<video>` | 見「影片與地圖」 |
| 地圖 | Google Maps | iframe | 見「影片與地圖」 |
| 追蹤碼 | GTM、GA4、Facebook Pixel、Ahrefs | 每頁載入 | 重新規劃，見「追蹤碼」 |
| 第三方嵌入 | 評價 badge、WOVN、jQuery、Google Fonts | 每頁載入 | 見「其他第三方嵌入」 |
| 聊天 | 無 | 取樣頁面沒有聊天 widget | 不需要 |
| Cookie 同意 | 無 | 取樣頁面沒有同意橫幅或同意管理 script | 隨追蹤碼重新規劃一併決定 |
| 子站 | `/tpu`、`/hr` | 獨立應用程式，有登入、註冊、職缺 API | 見「子站」 |

## 表單

現站是 Nuxt 2 SPA，表單由 Vue 元件呼叫 `$api.<方法>()` 送出。下表的端點來自 `features-summary.json` 的 `apiClient`。「對應依據」欄說明怎麼確認是這個元件呼叫這支 API。

### 全站共用

| 表單 | 出現位置 | 欄位（* 必填） | 送出端點 | 對應依據 |
|---|---|---|---|---|
| 浮動按鈕「聯絡我們」（`#contactusch`、`#contactusen`、`#contactusvn`） | 首頁、about、service、blog 等 92 個取樣頁 | 姓名*、Email*、公司*、電話*、訊息* | `POST /tpi/api/Utility/ContactUs` | 元件 `FixedContact`：觸發按鈕不是 bookademo 時呼叫 `postFixedContact`，送出時附 `captchaToken`，成功後導向 `/thanks` |
| 浮動按鈕「預約 Demo」（`#bookademoch`、`#bookademoen`、`#bookademovn`） | 產品頁與產品總覽，39 個取樣頁 | 姓名*、Email*、公司*、電話*、產品勾選（zh-TW 17 項、en 4 項、vi 4 項）、訊息* | `POST /tpi/api/Utility/BookADemo` | 同一個 `FixedContact` 元件，觸發按鈕 id 為 `bookademo*` 時呼叫 `postBookDemo` |
| IDC 報告索取彈窗（`.popup-form`） | 首頁、`/products/digilism`、`/subscribe`，3 個語系 | 姓名*、電話*、Email*、產業（選單，資料來自 `GET /tpi/api/IDC/IndustryList`）*、公司*、職稱*、Market Note、Vendor Spotlight、個資同意 | `POST /tpi/api/IDC/SendMail` | chunk `141043d.js` 的表單欄位為 `industryId`、`job`、`model`，並呼叫 `sendIDCMail` |
| 取消訂閱彈窗（`.modal-content`，每頁 3 個） | 全站 | Email* | `POST /tpi/api/Newsletter/SendCancelMail`、`POST /tpi/api/Utility/SendCancelMail`、`POST /tpi/api/DigiMars/SendCancelMail` | layout chunk 內 `#cancelModal`、`#cancelContactModal`、`#canceldigiMarsModal` 三個彈窗，分別呼叫三支 cancel API |

`zh-TW` 的「預約 Demo」產品清單有 17 項，en 與 vi 只有 DigiLism 系列 4 項。

### 特定頁面

| 表單 | 頁面 | 欄位（* 必填） | 送出端點 |
|---|---|---|---|
| 聯絡我們 | `/contact-us`（3 語系） | 姓名*、電話*、Email*、公司*、諮詢產品（可複選，至少一項）、主旨*、需求說明、個資同意 | `POST /tpi/api/Utility/SendMail` |
| 委外服務報價 | `/outsourcing`（3 語系） | 姓名*、公司*、Email*、地區*、產業*、諮詢項目*、需求說明*、得知管道、同意 | `POST /tpi/api/Outsourcing/SendMailByQuote`；選項來自 `POST /tpi/api/Outsourcing/GetListSource` |
| 白皮書下載：digiRunner | `/whitepaper/api-strategies`（3 語系） | 姓名*、電話*、Email*、公司*、職稱*、個資同意 | `POST /tpi/api/DigiRunner/DownloadWhitePaper` |
| 白皮書下載：digiLogs | `/whitepaper/digiLogs`（3 語系） | 同上 | `POST /tpi/api/DigiLogs/DownloadWhitePaper` |
| 白皮書下載：GreenSwift | `/whitepaper/greenswift`（zh-TW） | 同上 | `POST /tpi/api/GreenSwift/DownloadCarbonFootprintGuide` |
| AI Playbook 下載 | `/whitepaper/systalk-ai`（zh-TW、en） | 同上，加「導入 AI 遇到的問題」（可複選） | `POST /tpi/api/AIPlaybook/Download` |
| digiMars 下載試用 | `/products/digimars`（3 語系） | 姓名*、電話*、Email*、公司*、同意 | `POST /tpi/api/DigiMars/SendMail` |
| SysTalk.RPA 諮詢 | `/products/systalk-rpa`（3 語系） | 姓名*、電話*、公司*、Email* | `POST /tpi/api/Chatbot/SendMailInformation` |
| SysTalk.Chat 洽詢彈窗 | `/products/systalk-chat`（zh-TW） | 姓名*、電話*、Email*、公司*、需求說明、個資同意 | 待確認：該頁只載入全站共用的 chunk，無法從中判斷這個彈窗呼叫哪一支 API |
| RPA 企業診斷問卷 | `/products/systalk-rpa/enterp-diagnosis`（zh-TW） | 職務、流程名稱、工時、評分題、文件類型等多步驟問卷 | `POST /tpi/api/RPA/AnalyzeData` |
| SysTalk.VIKI 問卷與方案詢價 | `/products/systalk-viki`（zh-TW、vi） | 導入現況、計畫、痛點等問卷；聯絡欄位與方案選單 | `POST /tpi/api/SysTalk/VIKISurvey` |
| 電子報訂閱 | `/subscribe`（3 語系） | 頁面以 iframe 嵌入 `/subscribemodal/{index,en,vn}.html`，表單由第三方服務產生（見下方） | zh-TW、en：Benchmark Email（`lb.benchmarkemail.com` 的 `lbformnew.js`）；vi：MISA AMIS（`amismisa.misacdn.net` 的 `form-renderer.js`） |

電子報另有一個 `Subscribe` 元件（chunk `22bcb3d.js`）呼叫 `POST /tpi/api/Newsletter/SendMail`，但本次取樣頁面的 DOM 沒有出現這個元件的表單，不確定在哪裡顯示。

### 有 API 但取樣頁面沒有呼叫的端點

以下方法在 API client 中有定義，但取樣頁面載入的 chunk 都沒有呼叫：`DigiRunner/ApplyForLicenseKey`、`DigiRunner/SendMail`、`DigiRunner/SendMailInformation`、`DigiLogs/SendMailInformation`、`DigiLogs/SendMailLogDetection`、`Outsourcing/SendMailInformation`、`Audit/Submit`、`account`（GET／POST／PATCH）。可能是已下架頁面留下的程式，也可能在取樣以外的頁面使用。

### 不是表單的項目

`inventory.csv` 中 `solution` 頁的 `form:0;fields:4` 是功能介紹區的分頁切換（4 個 radio），不送出資料。新站用一般的分頁元件或直接展開內容即可。

### 新站建議

- 新站部署在 Cloudflare Pages（靜態），沒有自己的後端。建議表單繼續送到現有的 `/tpi/api/*`，資料去向與後續流程不變。需要後端開放新站網域的 CORS，並確認 reCAPTCHA 的網域設定（見「待確認」）。最後做法在 M6 決定
- 浮動「聯絡我們」與「預約 Demo」共用欄位，可以做成一個表單元件，用參數切換送出端點與產品清單
- 白皮書下載 4 種表單的基本欄位相同，AI Playbook 另多一個「導入 AI 遇到的問題」複選欄位；端點與檔案不同，可以共用元件、用參數加上額外欄位
- 「預約 Demo」zh-TW 與 en／vi 的產品清單不同，新站要統一或分語系維護，交 M2 決定
- 表單是新站少數需要 client JS 的地方，以 Astro island 實作

## 搜尋

| 項目 | 內容 |
|---|---|
| 頁面 | `/search`、`/en/search`、`tpisoftware.vn/search` |
| 現站做法 | 輸入關鍵字後呼叫 `GET /api/search?search=<關鍵字>&language=<tw/en/vn>` |
| 測試結果 | zh-TW、en：先 301 轉到 `/api/search/`，再回 500，搜尋沒有結果。vi：200 |
| 資料去向 | 搜尋關鍵字只送到同源 API，沒有送到第三方 |

新站建議：用建置時產生的靜態索引做站內搜尋，不依賴後端。搜尋現在在 .com 是壞的，新站上線前不需要相容舊的 API。用哪個工具在 M6 決定。

## 影片與地圖

| 類型 | 出現位置 | 現站做法 | 新站建議 |
|---|---|---|---|
| YouTube 嵌入 | 首頁、`/subscribe`、活動頁、部分產品頁與新聞，3 語系 | `youtube.com/embed/*` iframe，頁面載入時就載入 | 先顯示縮圖，點擊後才載入 iframe，避免每次載入都下載 YouTube player |
| 自架 MP4：首頁 banner | 首頁、`/subscribe` | `<video>`，檔案在 `/file/images/banner/<id>/`，zh-TW 8 支、en 與 vi 各 9 支 | M3 決定首頁 hero 是否保留影片。保留時加 poster、`preload="none"`，在 `prefers-reduced-motion` 下不自動播放 |
| 自架 MP4：產品與服務頁 | `/products/*`、`/solutions/smartclaim`、about、service | `<video>`，檔案在 `/images/products/*`、`/videos/*` | 同上；影片檔隨 M5 內容遷移搬移 |
| Google Maps | about-us（3 語系，每頁 8 個）、TPI Day 活動頁、1 篇新聞 | `google.com/maps/embed` iframe | 改成靜態地圖圖片或地址文字加「在 Google Maps 開啟」連結；保留 iframe 時加 `loading="lazy"` |

`/products/digirunner`（zh-TW、en）與 `tpisoftware.vn/digirunner-api-management` 各有一個 `src` 為空的 iframe，用途看不出來。

## 追蹤碼

新站的追蹤架構重新規劃，不沿用下列容器與帳號的設定。下表記錄現站狀況，作為規劃時的參考。

| 服務 | ID | 載入範圍 |
|---|---|---|
| Google Tag Manager | `GTM-MVJW9XS` | 全站（131 個取樣頁） |
| Google Tag Manager | `GTM-P8FCFGP` | zh-TW |
| Google Tag Manager | `GTM-WNJ3SMD` | en |
| Google Tag Manager | `GTM-PCKWWJS` | vi |
| Google Analytics 4（gtag.js） | `G-XCGV1B450D` | 只有 `/tpu` 子站 |
| Facebook Pixel | 本次沒有擷取到 Pixel ID | 全站（`fbevents.js`，131 頁有 `fbq`） |
| Ahrefs Web Analytics | 無 | vi（41 頁） |

- 每頁同時載入 2 個 GTM 容器：全站共用的 `GTM-MVJW9XS`，加上該語系的容器
- GTM 容器內設定了哪些 tag（例如 GA4、廣告轉換），因 proxy 擋下 `gtm.js` 而看不到。新站重新規劃，所以本次不再追查
- 取樣頁面沒有 cookie 同意機制

## 其他第三方嵌入

| 服務 | 網域 | 載入範圍 | 用途 | 新站建議 |
|---|---|---|---|---|
| Gartner Peer Insights | `www.gartner.com` | 全站 | 評價 badge widget | 待確認是否保留。保留時優先改用靜態 badge 圖片加連結，避免每頁載入第三方 script；需確認各服務的使用條款 |
| GoodFirms | `assets.goodfirms.co` | 全站 | 評價 badge widget | 同上 |
| Capterra | `brand-assets.capterra.com` | 全站 | 評價 badge 圖片 | 同上 |
| Software Outsourcing Journal | `softwareoutsourcing.com` | 全站 | badge script 與圖片 | 同上 |
| WOVN.io | `j.wovn.io` | zh-TW、en（vi 沒有） | 網站翻譯服務 | 新站自己處理多語系，預計不需要；用途待確認 |
| jQuery 3.6.0 | `code.jquery.com` | 全站 | 函式庫 | 不需要 |
| Google Fonts | `fonts.googleapis.com`、`fonts.gstatic.com` | 全站 | Inter、Roboto、Noto Sans TC | M3 決定字體與是否自行託管 |
| reCAPTCHA | `www.google.com/recaptcha` | `/contact-us`（3 語系）、vi 的 `/products/systalk-rpa`、`/hr` 載入時；浮動表單送出時帶 `captchaToken` | 表單防垃圾 | 新站表單要用後端能驗證的同一套機制，見「待確認」 |

文章內容引用的外部圖片（`blog.tpisoftware.com`、`tpi.dev`、`s3.amazonaws.com` 等）不是功能，隨 M5 內容遷移處理。

## 子站

`/tpu` 與 `/hr` 在 M1-01 被歸為獨立應用程式，只記錄入口頁。

| 子站 | 觀察到的功能 | 呼叫的 API |
|---|---|---|
| `/tpu` | 登入、註冊（興趣勾選）、電子報訂閱與取消、文章搜尋、語系切換；另外載入 GA4 `G-XCGV1B450D`、Facebook SDK、Font Awesome、`rawgit.com` 的 js-xss | `/tpu/login`、`/tpu/user/toRegister`、`POST /tpu/article/deleteRequestUrl` |
| `/hr` | 職缺頁，有關鍵字搜尋 | `/hr/api/erp_recruit/v1/Banners`、`Codes`、`Qrcodes/1` |

新站是否包含這兩個子站，或只放連結，交 M2 決定。

## 與 inventory.csv 的對照

`inventory.csv` 中有 `forms` 或 `embedded_media` 的 95 頁全部在取樣內。各欄位值對應到本檔的位置：

| `inventory.csv` 的值 | page_type | 本檔對應 |
|---|---|---|
| `form:1;fields:*`（各頁數量不同） | home、about、service、product、blog 等 | 全站共用表單（浮動聯絡、預約 Demo、IDC 彈窗、取消訂閱）加上該頁的特定表單 |
| `form:1;fields:20`、`fields:29` | contact | 聯絡我們 |
| `form:1;fields:6`、`fields:7` | download | 白皮書下載 |
| `form:0;fields:18`、`form:0;fields:4` | product | VIKI 問卷、分頁切換 |
| `form:0;fields:4` | solution | 分頁切換（不是表單） |
| `form:0;fields:1` | search | 搜尋 |
| `video:*`、`youtube:*` | product、service、solution、about、news | 影片 |
| `google-maps:*` | about、campaign、news | 地圖 |
| `iframe:1` | utility（`/subscribe`） | 電子報訂閱的 `/subscribemodal/*.html` |

`thirdPartyHosts` 的 24 個網域都已列在「追蹤碼」「其他第三方嵌入」「表單」「子站」或文章外部圖片中。

## 待確認

| # | 項目 | 要問誰 |
|---|---|---|
| 1 | `/tpi/api/*` 各表單端點收到資料後寄給哪些信箱、是否寫進 CRM 或資料庫 | 現站後端負責人 |
| 2 | 新站（`*.pages.dev`、未來正式網域）能否直接呼叫 `/tpi/api/*`：CORS 與 reCAPTCHA 網域設定 | 現站後端負責人 |
| 3 | reCAPTCHA 的版本（v2／v3）與 site key 歸屬的 Google 帳號 | 現站後端負責人 |
| 4 | Benchmark Email（zh-TW、en）與 MISA AMIS（vi）的電子報帳號歸屬，以及兩套名單是否要合併 | 行銷 |
| 5 | `Subscribe` 元件（`POST /tpi/api/Newsletter/SendMail`）在現站哪裡使用，與 Benchmark Email 名單的關係 | 現站前端或行銷 |
| 6 | 4 個 GTM 容器、GA4 `G-XCGV1B450D`、Facebook Pixel、Ahrefs 的帳號歸屬與管理者（重新規劃時要知道舊資料在哪裡） | 行銷 |
| 7 | `/products/systalk-chat` 洽詢彈窗的送出端點 | 現站前端 |
| 8 | 搜尋 API 在 zh-TW、en 回 500 的原因（只影響現站，新站不沿用） | 現站後端負責人 |
| 9 | 評價 badge（Gartner、GoodFirms、Capterra、Software Outsourcing Journal）是否保留，以及各服務對 badge 呈現方式的規定 | 行銷 |
| 10 | WOVN.io 的用途與合約狀態 | 行銷 |
| 11 | 取樣頁面沒有呼叫的 API（見「有 API 但取樣頁面沒有呼叫的端點」）是否還有頁面使用 | 現站前端 |
