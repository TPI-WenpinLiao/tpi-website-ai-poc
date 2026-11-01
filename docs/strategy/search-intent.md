# 搜尋意圖（試點三頁）

試點三頁（`docs/strategy/site-profile.md`「試點頁面」）各列 8 組查詢詞，記錄搜尋結果前幾名的頁面類型、共同涵蓋的子題，以及昕力現站有沒有出現。分階段流程的研究產出，交給 `seo-strategist` 在策略階段使用。

## 限制

- 沒有 Search Console、GA4 的數據（`docs/research/seo-baseline.md`、`site-profile.md`「限制」）。本檔不寫搜尋量，不估流量，查詢詞的取捨只依受眾（`docs/research/audience-and-goals.md`）與試點頁的主題
- 觀察日期：2026-10-31
- 搜尋來源：24 組查詢全部是 WebSearch（US）。原定的 Bing 台灣繁中（`cc=TW&setlang=zh-Hant&mkt=zh-TW`）回傳 200，但結果跟查詢無關，不能用，見下方「Bing 的結果不能用」
- WebSearch（US）是美國地區的結果，不是台灣使用者看到的排名，也不是 Google。工具回傳的是連結清單（約 7–22 筆），沒有標示名次；本檔的「名次」指清單中的順序，只能當作大致的前後
- 「昕力現站是否出現」只看 `www.tpisoftware.com` 與 `www.tpisoftware.vn` 的網址。第三方頁面提到昕力另外註明

### Bing 的結果不能用

`scripts/strategy/serp.mjs` 用 Playwright 開 Bing 台灣繁中的搜尋頁，抓前 10 筆。2026-10-31 的實測：

| 查詢 | 取得方式 | 前幾筆的實際內容 |
|---|---|---|
| `digiRunner` | curl | 0050 ETF 的股價頁（Yahoo 股市、玩股網、元大投信） |
| `digiRunner` | Playwright | 科羅拉多落磯隊（維基百科、Yahoo 運動、MLB.com） |
| `昕力資訊` | curl | 南極洲（維基百科、百度百科） |
| `昕力資訊` | Playwright，從 Bing 首頁輸入 | Yahoo 股市報價頁 |
| `昕力資訊` | Playwright | 知乎的台灣旅遊、台北 101 討論 |
| `昕力資訊`、`digiRunner`、`開放銀行 API` | `serp.mjs` | 中華電信客服、台積電股價、Google 說明中心與 WordReference 論壇 |

頁面標題與搜尋框都顯示正確的查詢詞，結果卻每次換一組無關的主題。判斷 Bing 對這個環境的請求回了不是真實排名的結果，所以改用 WebSearch。重現：

```bash
node scripts/strategy/serp.mjs "昕力資訊" "digiRunner" "開放銀行 API"
```

輸出的 `related` 欄位標示每筆的標題、摘要或網址是否含查詢詞的任一個字詞。`開放銀行 API` 有 2 筆 `related: true`，是網址裡碰巧有 `api` 一類字串，內容仍是 Google 說明中心的頁面。之後在別的環境重跑，若結果跟查詢相關，可以用 Bing 重做本檔的觀察。

## 欄位

每組查詢記錄：

- 類型：品牌（含公司或產品名）、類別（產品類別或產業）、問題（問句或「怎麼做」）
- 意圖：資訊型、比較型、商業型、導航型，後面寫判斷依據
- 前幾名的頁面類型、前幾名共同涵蓋的子題
- 昕力現站：是否出現與名次
- 來源：WebSearch 的查詢詞，以及用來判斷的前幾名網址

## 首頁 `/`

選詞理由：首頁承接品牌詞，以及決策者還沒想到特定產品時的類別詞（`audience-and-goals.md` 的決策者「了解產品與方案」）。昕力現站的產品線是 AI、數位轉型、資安、ESG（`docs/ia/nodes.csv` 的 `family-*`），所以類別詞挑「數位轉型」「AI 導入」「系統整合」，再加上 `nodes.csv` 有 `/aiso` 節點的「主權 AI」。

### 昕力資訊

- 類型：品牌
- 意圖：導航型（查公司名），但前幾名全是財經新聞，實際滿足的是「這家公司最近怎麼了」的資訊需求
- 頁面類型：財經與科技新聞（上櫃申請、財報、私募、合作）
- 共同子題：申請上櫃、半年報虧損與營收、與群聯合作的企業主權 AI、半導體供應鏈資格、加入英特爾夥伴聯盟
- 昕力現站：未出現
- 來源：WebSearch（US）`昕力資訊`。前幾名 https://uanalyze.com.tw/articles/9951253851 、https://technews.tw/?p=1427915 、https://finance.technews.tw/2026/03/10/enterprise-sovereignty-ai/ 、https://udn.com/news/story/7240/9368649 、https://m.cnyes.com/news/id/6116531

### TPIsoftware

- 類型：品牌
- 意圖：導航型。英文品牌名的結果偏向海外的公司資料與評論平台
- 頁面類型：公司名錄與評論平台（Gartner Peer Insights、G2、DesignRush、The Manifest、CB Insights）、新聞稿（台灣精品獎、越南 Sao Khue 獎）、股價頁（GuruFocus、MarketScreener）、徵才頁（ITviec）、合作夥伴頁（Intel）
- 共同子題：台灣精品獎、digiRunner 與 DigiLism 等產品名、Intel 合作夥伴、股票代號
- 昕力現站：未出現
- 來源：WebSearch（US）`TPIsoftware`。前幾名 https://itviec.com/nha-tuyen-dung/tpisoftware-co-ltd 、https://www.intel.com/content/www/us/en/partner/showcase/storefront/a5Scv0000002hYjEAI/tpisoftware.html 、https://kyodonewsprwire.jp/release/202312073963 、https://www.gartner.com/reviews/vendor/tpisoftware 、https://technode.global/?p=98918

### 昕力資訊 官網

- 類型：品牌
- 意圖：導航型（明確要找官網）
- 頁面類型：新聞、媒體的標籤頁（CIO Taiwan）、股票資訊站（nstock）、求職評論（interview.tw）
- 共同子題：公司成立年份與地址、四條產品線、月營收、與群聯的私募
- 昕力現站：未出現。WebSearch 的摘要寫明「搜尋結果中沒有找到昕力資訊的官方網址」
- 來源：WebSearch（US）`昕力資訊 官網`。前幾名 https://interview.tw/i/62b2b8adf2869d1d09444220 、https://www.cio.com.tw/tag/%e6%98%95%e5%8a%9b%e8%b3%87%e8%a8%8a/ 、https://www.ctee.com.tw/news/20260424700179-439901 、https://www.nstock.tw/%E6%98%95%E5%8A%9B%E8%B3%87*%E5%81%9A%E4%BB%80%E9%BA%BC.html

### 企業數位轉型 軟體公司

- 類型：類別
- 意圖：資訊型為主，帶商業型。前幾名一半是「數位轉型是什麼」的說明頁，一半是國際廠商的方案頁，沒有廠商列表或比較文
- 頁面類型：國際廠商的方案頁（AWS、Oracle、Siemens、Dynatrace）、定義文（Trend Micro「什麼是」）、碩士論文、新聞
- 共同子題：轉型不只是導入技術（組織與文化）、雲端、資安融入每個階段、以整合平台取代單點系統
- 昕力現站：未出現
- 來源：WebSearch（US）`企業數位轉型 軟體公司`。前幾名 https://aws.amazon.com/tw/enterprise/transformation/ 、https://www.trendmicro.com/zh_tw/what-is/what-is-data-security/digital-transformation.html 、https://www.siemens.com/zh-tw/technology/digital-transformation/ 、https://www.oracle.com/tw/cloud/digital-transformation/

### 台灣 AI 解決方案 公司

- 類型：類別
- 意圖：商業型（要找廠商），但結果沒有名錄，前幾名是個別廠商的新聞與展會報導
- 頁面類型：新聞、展會報導、研討會頁
- 共同子題：地端部署、資料主權、中小企業降低成本、AI 基礎架構與大型模型
- 昕力現站：未出現
- 來源：WebSearch（US）`台灣 AI 解決方案 公司`。前幾名 https://uanalyze.com.tw/articles/7336633743 、https://www.cna.com.tw/postwrite/chi/408723 、https://finance.technews.tw/2025/07/16/ai-wave-show-taiwan-ai/ 、https://finance.technews.tw/2025/09/09/d-e-e-p-tech-day-2025-taiwan-mobile/

### 企業 AI 導入

- 類型：問題（「怎麼導入」的簡寫）
- 意圖：資訊型。前幾名是導入步驟的指南與調查報導
- 頁面類型：教學、指南（SAP 台灣、PRO360）、新聞與調查（工商時報、iThome）、Podcast
- 共同子題：導入步驟、與事業目標對齊、ROI 與失敗比例、AI 治理與風險框架（NIST AI RMF）、企業成熟度調查
- 昕力現站：未出現。現站有同主題文章 https://www.tpisoftware.com/blog/ai/implementationguide （「企業導入 AI 的 4 個階段與 3 大應用」），`inventory.csv` 的處置是 `drop`
- 來源：WebSearch（US）`企業 AI 導入`。前幾名 https://www.sap.com/taiwan/resources/effective-ai-implementation-in-business 、https://www.ctee.com.tw/news/20261005701716-431204 、https://www.ithome.com.tw/news/150234 、https://www.pro360.com.tw/guide/how_ai

### 系統整合 廠商 推薦

- 類型：類別
- 意圖：比較型（「推薦」）。前幾名是英文的 Top 10 列表與原廠夥伴頁，沒有台灣在地的列表
- 頁面類型：列表文（Euvic「Top 10 Best System Integration Companies」）、原廠夥伴頁（Rockwell Automation）、市調報告頁（GII）
- 共同子題：整合方式（點對點、雲端平台、ESB）、找整合商前先寫清楚需求
- 昕力現站：未出現
- 來源：WebSearch（US）`系統整合 廠商 推薦`。前幾名 https://rockwellautomation.com/zh-tw/company/partnernetwork/system-integrator-partners.html 、https://www.us.euvic.com/post/best-system-integration-companies 、https://www.gii.tw/report/smrc1359042-system-integration-market-forecasts-global.html

### 企業主權 AI 地端部署 方案

- 類型：類別
- 意圖：資訊型與商業型都有。前幾名是部署模式的指南，也有台灣廠商的發表新聞
- 頁面類型：指南（Scality、Zerve、Ertas 的繁中文章）、新聞與標籤頁（INSIDE）、活動議程
- 共同子題：主權 AI 的定義（不依賴外國基礎設施與法律管轄）、部署形式（自有資料中心、主權雲、氣隙隔離）、海外雲自行託管不算主權、整合業務流程的工作量
- 昕力現站：未出現。WebSearch 的摘要提到第三方頁面寫了昕力資訊與群聯組成的 AISO 主權 AI 聯盟
- 來源：WebSearch（US）`企業主權 AI 地端部署 方案`。前幾名 https://www.inside.com.tw/tag/28626-%E5%9C%B0%E7%AB%AF%E9%83%A8%E7%BD%B2 、https://www.solved.scality.com/enterprise-private-ai-deployment-models-guide/ 、https://www.ertas.ai/zh-Hant/blog/sovereign-ai-enterprise-guide-2026

## digiRunner 產品頁 `/products/digirunner`

選詞理由：`digiRunner` 與 `digiRunner API 管理平台` 是品牌詞；`API 管理平台`、`API Gateway 是什麼` 是不知道產品名的 IT 主管會查的類別詞與問題；`API 管理 金融業` 對應主要受眾的產業；比較型的三組（比較、Kong 替代、開源推薦）對應選型階段。現站有 digiRunner 開源版（WebSearch 的 `digiRunner API 管理平台` 結果有開源專案頁），所以加上「開源 API Gateway 推薦」。

### digiRunner

- 類型：品牌
- 意圖：導航型。但結果被同名的遊戲與 App 佔滿，沒有任何 API 產品的結果
- 頁面類型：遊戲下載頁（itch.io）、App Store 頁、維基百科
- 共同子題：無（與 API 無關）
- 昕力現站：未出現
- 來源：WebSearch（US）`digiRunner`。前幾名 https://partlymanu.itch.io/digirunner 、https://keromas.itch.io/digrunner 、https://apps.apple.com/app/id6741570714

### digiRunner API 管理平台

- 類型：品牌加類別
- 意圖：導航型與商業型。前幾名是評論平台與 Marketplace，查的人已經知道產品、在看評價與購買管道
- 頁面類型：評論平台（Gartner Peer Insights、GetApp）、AWS Marketplace 商品頁、產品文件（`docs.tpi.dev` 的內容，出現的網址是第三方鏡像 `backiee.wasmer.app`）、開源專案頁（SourcePulse）
- 共同子題：OpenAPI、OAuth 2.0、OIDC；API 生命週期管理；本地與雲端部署、Kubernetes；AWS 與 ISO 27001 認證；開源版的安裝方式；AI Gateway；評論提到的授權方式與 API Composer
- 昕力現站：未出現。`docs.tpi.dev` 本身也沒有出現，只出現鏡像網址
- 來源：WebSearch（US）`digiRunner API 管理平台`。前幾名 https://www.gartner.com/reviews/product/digirunner 、https://aws.amazon.com/marketplace/pp/prodview-pmlw6yaa37dju 、https://www.getapp.com/it-management-software/a/digirunner/ 、https://backiee.wasmer.app/https_docs_tpi_dev/overview 、https://www.sourcepulse.org/projects/30878706

### API 管理平台

- 類型：類別
- 意圖：資訊型。前幾名是「什麼是 API 管理」的定義文與 glossary
- 頁面類型：定義文（Google Cloud 的簡中、繁中版）、產品文件（Workato、WSO2）、glossary 與百科頁
- 共同子題：API 生命週期、API Gateway、開發者入口網站、分析與計費、部署在本地、雲端或混合環境、代表產品（Apigee、Kong、MuleSoft、Azure、AWS 等）
- 昕力現站：未出現
- 來源：WebSearch（US）`API 管理平台`。前幾名 https://cloud.google.com/learn/what-is-api-management?hl=zh-cn 、https://cloud.google.com/learn/what-is-api-management?hl=zh-TW 、https://docs.workato.com/en/features/api-management 、https://wso2.com/integration-platform/docs/manage/cloud/api-management/overview

### API Gateway 是什麼

- 類型：問題
- 意圖：資訊型
- 頁面類型：教學與技術文章（iT 邦幫忙 3 篇、Medium）、雲端廠商的產品頁與文件（AWS）、廠商的入門頁（Gravitee）
- 共同子題：反向代理與路由、認證授權（API 金鑰、OAuth、JWT、mTLS）、限流與配額、快取、監控、開源選項（NGINX、Kong、Traefik、HAProxy）
- 昕力現站：未出現。現站有同主題文章 https://www.tpisoftware.com/blog/smartm/api-gateway-ch （「API Gateway：現代企業的最佳解決方案」），處置是 `drop`
- 來源：WebSearch（US）`API Gateway 是什麼`。前幾名 https://aws.amazon.com/tw/api-gateway/ 、https://medium.com/@developerjoy/api-gateway-78ed082e5aa1 、https://ithelp.ithome.com.tw/articles/10393856 、https://docs.aws.amazon.com/zh_tw/apigateway/latest/developerguide/welcome.html

### API 管理 金融業

- 類型：類別
- 意圖：資訊型為主，帶商業型（白皮書下載、案例）
- 頁面類型：台灣資安新聞（iThome）、廠商部落格與學習中心（Tyk 4 筆）、白皮書下載表單（IBM）、案例（LTTS）、指南（Infopulse、HES FinTech）
- 共同子題：台灣法規（財金公司 Open API 規範：API 盤點、認證與防禦、端對端加密、OWASP API Top 10 檢測）、殭屍 API 與影子 API、Gateway 與完整 API 管理平台的差別、生命週期、開發者入口網站
- 昕力現站：未出現
- 來源：WebSearch（US）`API 管理 金融業`。前幾名 https://www.ithome.com.tw/news/168669 、https://www.ibm.com/forms/mkt-whitepaper-6315a 、https://tyk.io/blog/future-proofing-api-management-in-financial-services-a-roadmap-for-2025-and-beyond/ 、https://tyk.io/learning-center/enterprise-api-management-fintech/

### API 管理平台 比較

- 類型：類別
- 意圖：比較型
- 頁面類型：廠商寫的比較文與比較頁（Gravitee、Chakray、Jitterbit）、日文比較表、Capterra 比較頁。沒有繁中的比較文
- 共同子題：Gateway、管理層、開發者入口的架構；依雲端環境、預算與授權、自架或混合部署、AI 功能選型
- 昕力現站：未出現
- 來源：WebSearch（US）`API 管理平台 比較`。前幾名 https://chakray.com/?p=36135 、https://www.gravitee.io/comparison 、https://www.jitterbit.com/blog/best-api-management-tools/ 、https://book.st-hakky.com/hakky/apigee-comparison

### Kong 替代方案 API Gateway

- 類型：類別（競品名加「替代」）
- 意圖：比較型
- 頁面類型：「alternatives」列表文（API7、BytePlus、FitGap、Toolradar）、GitHub wiki
- 共同子題：Apache APISIX、Envoy、雲端代管的 Gateway、Apigee、Tyk、MuleSoft、3scale、WSO2；換掉 Kong 的原因（規模變大後的價格、整合、效能、缺少的功能）
- 昕力現站：未出現
- 來源：WebSearch（US）`Kong 替代方案 API Gateway`。前幾名 https://www.byteplus.com/en/topic/551973 、https://api7.ai/blog/top-kong-alternatives 、https://us.fitgap.com/products/009625/kong-gateway/alternative

### 開源 API Gateway 推薦

- 類型：類別
- 意圖：比較型
- 頁面類型：列表與比較文（Moesif 2026 Roundup、API7、BytePlus）、替代品目錄（OpenAlternative）
- 共同子題：Kong、APISIX、Tyk、KrakenD、WSO2；開源免授權費但要自己維運，需要 SLA 時看商業版
- 昕力現站：未出現。digiRunner 開源版也沒有出現在列表裡
- 來源：WebSearch（US）`開源 API Gateway 推薦`。前幾名 https://api7.ai/learning-center/api-gateway-guide/open-source-vs-commercial-api-gateway 、https://www.byteplus.com/en/topic/552732 、https://www.moesif.com/blog/api-engineering/api-gateways/Open-Source-API-Gateway-Roundup

## 金融產業頁 `/industries/finance`

選詞理由：`nodes.csv` 的 `industry-finance` 節點承接現站 `/products/open-banking`，所以開放銀行有 3 組（概念、台灣法規、銀行 API 平台）；`industry-finance` 的子節點有 InsureBrick、InsureRing，所以加保險科技；金融業是主要受眾的第一個產業（`audience-and-goals.md`），加上「數位轉型」「AI 應用」兩組大類別詞；品牌詞用「昕力資訊 金融」。`台灣 開放銀行 第三方業者 API 金管會` 是因為 `開放銀行 API` 的結果沒有台灣來源而加的在地化查詢。

### 金融業 數位轉型

- 類型：類別
- 意圖：資訊型
- 頁面類型：媒體報導與評論（數位時代、自由財經、經理人、CIO Taiwan、INSIDE）、碩士論文（政大、台大）
- 共同子題：不轉型的長期風險、生態圈競爭、數位化到數位轉型的階段、障礙（反洗錢、資安、個資保護）、純網銀的鯰魚效應、資訊人才需求。多數是 2020–2022 年的文章
- 昕力現站：未出現
- 來源：WebSearch（US）`金融業 數位轉型`。前幾名 https://www.bnext.com.tw/article/67240/finance-digital-transfer 、https://ec.ltn.com.tw/article/breakingnews/3381018 、https://www.managertoday.com.tw/articles/view/64779 、https://www.cio.com.tw/?p=7598

### 開放銀行 API

- 類型：類別
- 意圖：資訊型。前幾名是定義文與越南的法規問答，沒有台灣來源
- 頁面類型：定義文與 glossary（PhotonPay 香港、Solidgate）、法規問答（越南 Thư viện Pháp luật 2 筆、Luật Việt An）、銀行的創新中心文件（印度 Union Bank）
- 共同子題：開放銀行的定義、客戶授權第三方存取的流程、PSD2、API 類型（支付發起、餘額查詢）、越南央行 64/2024/TT-NHNN 通函
- 昕力現站：未出現
- 來源：WebSearch（US）`開放銀行 API`。前幾名 https://www.photonpay.com/hk/blog/article/open-banking-api 、https://thuvienphapluat.vn/hoi-dap-phap-luat/ngan-hang-co-bat-buoc-phai-cong-khai-thong-tin-open-api-tren-trang-thong-tin-dien-tu-khong-138043899.html 、https://solidgate.com/glossary/open-banking/

### 台灣 開放銀行 第三方業者 API 金管會

- 類型：問題（台灣制度怎麼運作）
- 意圖：資訊型
- 頁面類型：新聞（數位時代 2 筆、工商時報、鉅亨網、公視、科技新報 2 筆），全部是 2019 年前後
- 共同子題：三階段推動（公開資料查詢、消費者資訊查詢、交易面資訊）、財金公司訂技術與資安標準、銀行公會訂第三方業者（TSP）自律規範、開放 API 平台上線、API 規格標準化
- 昕力現站：未出現
- 來源：WebSearch（US）`台灣 開放銀行 第三方業者 API 金管會`。前幾名 https://www.bnext.com.tw/article/55095 、https://ctee.com.tw/news/finance/113492.html 、https://news.cnyes.com/news/id/4226603 、https://technews.tw/2019/10/17/openbanking-2-questions/

### 銀行 API 平台

- 類型：類別
- 意圖：資訊型與商業型。前幾名有列表文、廠商產品文件，也有銀行自己的開發者入口
- 頁面類型：列表文（Apidog 日文「best bank API management platforms」）、廠商比對平台（Celent VendorMatch）、產品文件（Oracle Banking APIs）、新聞（DBS 開發者平台）、銀行開發者入口（UCO Bank）
- 共同子題：建立、保護、監控、變現 API；把帳戶、支付、存款、貸款開放給金融科技業者；開發者入口網站與沙盒；API 分類
- 昕力現站：未出現
- 來源：WebSearch（US）`銀行 API 平台`。前幾名 https://apidog.com/jp/blog/best-bank-api-management-platforms/ 、https://celent.com/vendormatch/discovery/solutions/919438237 、https://docs.oracle.com/cd/F18559_01/webhelp/Content/obdx/obapintroduction.htm 、https://www.retailbankerinternational.com/news/dbs-launches-new-api-developer-platform/

### 金融科技 解決方案 台灣

- 類型：類別
- 意圖：資訊型。查詢帶「解決方案」，但前幾名是產業新聞與展會報導，不是廠商方案頁
- 頁面類型：新聞、展會報導（新加坡金融科技節台灣館）、市調報告頁、顧問公司 insight（KPMG）
- 共同子題：金融科技創新園區（FinTechSpace）、保險理賠聯盟鏈、身分驗證、支付、資安、法遵科技
- 昕力現站：未出現
- 來源：WebSearch（US）`金融科技 解決方案 台灣`。前幾名 https://technews.tw/?p=536621 、https://www.bnext.com.tw/article/66531/2021fintechspace 、https://www.inside.com.tw/article/33367-fintechspace-sff-2023 、https://kpmg.com/tw/zh/home/insights/2020/06/tw-insights-of-fintech.html

### 保險科技 AI 理賠

- 類型：類別
- 意圖：資訊型。前幾名多為英文的案例新聞
- 頁面類型：英文新聞與案例（Insurance Times、Claims Journal、FinTech Global）、行銷文章（Upwork）、黑客松專案頁、中山大學講座 PDF、LINE TODAY
- 共同子題：影像定損與即時結案、災後空拍分類、反詐欺、理賠文件審閱自動化
- 昕力現站：未出現
- 來源：WebSearch（US）`保險科技 AI 理賠`。前幾名 https://stacker.com/stories/ai/ai-insurance-7-trillion-rebuild 、https://www.insurancetimes.co.uk/news/polish-insurer-taps-tractables-artificial-intelligence-platform/1440506.article 、https://amp.claimsjournal.com/news/international/2017/05/24/278597.htm

### 金融業 AI 應用

- 類型：類別
- 意圖：資訊型
- 頁面類型：雲端與硬體廠商的說明頁（Google Cloud、Supermicro、Microsoft）、調查報告報導（NVIDIA 金融業 AI 調查）、媒體（CIO Taiwan、iThome）、顧問 insight
- 共同子題：個人化服務、風險與詐欺、反洗錢誤報、法規遵循、營運自動化、交易與投資；監管（歐盟 AI Act 的高風險場景、模型可解釋性）
- 昕力現站：未出現
- 來源：WebSearch（US）`金融業 AI 應用`。前幾名 https://www.cio.com.tw/91482/ 、https://cloud.google.com/discover/finance-ai?hl=zh-TW 、https://www.supermicro.com/zh_tw/glossary/ai-in-finance 、https://adoption.microsoft.com/zh-tw/scenario-library/financial-services/

### 昕力資訊 金融

- 類型：品牌
- 意圖：資訊型（查昕力在金融業做什麼），前幾名是新聞
- 頁面類型：新聞稿與新聞（iThome PR、科技新報、CIO Taiwan 3 筆、鉅亨網、經濟日報）
- 共同子題：媒體引述的金融業客戶比重、Thinknova LLM、防詐、OrientAI、營收與轉盈目標。這些是媒體寫的內容，不是事實庫的事實，新站要用必須先進 `docs/strategy/facts.yaml`
- 昕力現站：未出現
- 來源：WebSearch（US）`昕力資訊 金融`。前幾名 https://www.ithome.com.tw/pr/161970 、https://finance.technews.tw/2026/03/10/enterprise-sovereignty-ai/ 、https://www.cio.com.tw/94496/ 、https://finance.technews.tw/2025/07/16/tpisoftware/

## 跨頁的觀察

- 24 組查詢裡，`www.tpisoftware.com` 與 `www.tpisoftware.vn` 都沒有出現，品牌詞（`昕力資訊`、`TPIsoftware`、`昕力資訊 官網`、`digiRunner`）也一樣。這是 WebSearch（US）的結果，台灣地區的排名可能不同；可能的原因之一是 `seo-baseline.md`「站層級」寫的 `.com` 沒有可用的 sitemap
- 品牌詞的前幾名由新聞、評論平台（Gartner、G2、GetApp）、AWS Marketplace 佔據
- `digiRunner` 單獨查詢時跟同名遊戲撞名，要加上「API」才有產品結果
- 問題型與類別型的查詢，前幾名大多是雲端廠商（AWS、Google Cloud、Microsoft）的定義文與 iT 邦幫忙的技術文章
- 比較型的查詢（API 管理平台比較、Kong 替代、開源 Gateway）幾乎都是英文或簡中的廠商比較文，沒有繁中的比較文
- 開放銀行的查詢，繁中來源停在 2019 年前後的新聞；`API 管理 金融業` 的 iThome 新聞提到財金公司修訂的 Open API 資安規範
- 現站有承接這些問題型查詢的舊文章（`/blog/smartm/api-gateway-ch`、`/blog/smartm/open-banking-api-platform`、`/blog/smartm/apim-openbanking`、`/blog/dx/openfinance-api`、`/blog/ai/implementationguide`），`inventory.csv` 的處置都是 `drop`（2026-01-01 前的 blog 不遷移）

## 對應到頁面

以下是推論，不是觀察。每組查詢由新站哪一頁承接，交給 `seo-strategist` 在策略階段確認。路徑取自 `docs/ia/nodes.csv`。

| 查詢 | 建議承接頁 | 理由 |
|---|---|---|
| 昕力資訊 | `/` | 品牌導航 |
| TPIsoftware | `/`（en 為 `/en`） | 品牌導航；英文品牌名的結果偏海外 |
| 昕力資訊 官網 | `/` | 品牌導航 |
| 企業數位轉型 軟體公司 | `/`，次要 `/products/digilism` | 類別詞，首頁列出產品線；數位轉型產品線的 hub |
| 台灣 AI 解決方案 公司 | `/`，次要 `/products/systalk-ai` | 類別詞；AI 產品線的 hub |
| 企業 AI 導入 | `/blog/{slug}`（文章） | 前幾名是指南與教學，產品頁或首頁不符合資訊型意圖；現站同主題文章是 `drop`，要不要寫新文章由策略決定 |
| 系統整合 廠商 推薦 | `/services`，次要 `/outsourcing` | 比較型，結果是列表文；新站沒有對應的比較頁，`/services` 是最接近的頁面 |
| 企業主權 AI 地端部署 方案 | `/aiso` | `nodes.csv` 有 AISO 主權 AI 節點 |
| digiRunner | `/products/digirunner` | 品牌導航 |
| digiRunner API 管理平台 | `/products/digirunner`，次要 `/products/digirunner-cloud` | 前幾名有 AWS Marketplace，雲端版是 `digirunner-cloud` 節點 |
| API 管理平台 | `/products/digirunner` | 類別詞；結果是定義文，產品頁要能回答「API 管理平台包含什麼」才接得住 |
| API Gateway 是什麼 | `/blog/{slug}`（文章） | 資訊型，前幾名是教學；現站同主題文章是 `drop` |
| API 管理 金融業 | `/industries/finance`，次要 `/products/digirunner` | 產業加類別；結果涵蓋台灣金融法規 |
| API 管理平台 比較 | `/products/digirunner` | 比較型；新站沒有比較頁，是否新增由策略決定 |
| Kong 替代方案 API Gateway | `/products/digirunner` | 比較型；同上 |
| 開源 API Gateway 推薦 | `/products/digirunner` | 比較型；digiRunner 開源版目前在新站沒有獨立節點 |
| 金融業 數位轉型 | `/industries/finance` | 產業類別詞 |
| 開放銀行 API | `/industries/finance` | `industry-finance` 節點承接現站 `/products/open-banking` |
| 台灣 開放銀行 第三方業者 API 金管會 | `/industries/finance`，或 `/blog/{slug}` | 資訊型，產業頁要不要寫台灣制度由策略決定 |
| 銀行 API 平台 | `/industries/finance`，次要 `/products/digirunner` | 產業與產品的交集 |
| 金融科技 解決方案 台灣 | `/industries/finance` | 產業類別詞 |
| 保險科技 AI 理賠 | `/solutions/smartclaim`，次要 `/industries/finance` | `nodes.csv` 有 AI 智能理賠解決方案節點 |
| 金融業 AI 應用 | `/industries/finance` | 產業類別詞 |
| 昕力資訊 金融 | `/industries/finance` | 品牌加產業 |

待 `seo-strategist` 決定的事：

- 資訊型查詢（`企業 AI 導入`、`API Gateway 是什麼`、台灣開放銀行制度）要不要用 blog 文章承接；現站同主題的舊文章是 `drop`
- 比較型查詢（API 管理平台比較、Kong 替代、開源 Gateway）要不要新增比較頁，或只在 `/products/digirunner` 處理
- digiRunner 開源版要不要有自己的頁面或段落
