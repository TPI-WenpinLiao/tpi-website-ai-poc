# 搜尋意圖（試點三頁與第一批 7 頁）

試點三頁（`docs/strategy/site-profile.md`「試點頁面」）各列 8 組查詢詞，#199 的第一批 7 頁（AI 智能理賠、AI 智慧建檔、SysTalk.ai、OrientAI、AISO、GreenSwift、DigiLism）各列 7–8 組，記錄搜尋結果前幾名的頁面類型、共同涵蓋的子題、前幾名都沒有的子題，以及昕力現站有沒有出現。分階段流程的研究產出，交給 `seo-strategist` 在策略階段使用。

## 限制

- 沒有 Search Console、GA4 的數據（`docs/research/seo-baseline.md`、`site-profile.md`「限制」）。本檔不寫搜尋量，不估流量，查詢詞的取捨只依受眾（`docs/research/audience-and-goals.md`）與各頁的主題
- 觀察日期：試點三頁是 2026-10-31，第一批 7 頁是 2026-11-05（#199，52 組查詢：AI 產品線四頁 29 組、AISO、GreenSwift、DigiLism 三頁 23 組，其中 GreenSwift 的 1 組結果不能用，見該條）。第一批 7 頁的各欄都是 2026-11-05 的觀察，「前幾名都沒有」引用的事實是 #199 補過事實庫後的 id。試點三頁的「前幾名都沒有」一欄是 #186 補的，2026-11-03 用同樣的 24 組查詢重查 WebSearch（US）後寫成。重查時多數查詢的前幾名與 2026-10-31 相同；組成有變的（`企業數位轉型 軟體公司`、`API 管理 金融業`）在該條的「前幾名都沒有」寫出變動，其他欄位仍是 2026-10-31 的觀察
- 搜尋來源：試點三頁的 24 組與第一批 7 頁的 52 組全部是 WebSearch（US）。原定的 Bing 台灣繁中（`cc=TW&setlang=zh-Hant&mkt=zh-TW`）回傳 200，但結果跟查詢無關，不能用，見下方「Bing 的結果不能用」
- WebSearch（US）是美國地區的結果，不是台灣使用者看到的排名，也不是 Google。工具回傳的是連結清單（約 7–22 筆），沒有標示名次；本檔的「名次」指清單中的順序，只能當作大致的前後
- 「前幾名都沒有」只依 WebSearch 回傳的標題、網址與摘要判斷，沒有逐頁讀完前幾名的全文，所以「沒有」指的是標題與摘要裡沒有，不保證頁面內文也沒有
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
- 前幾名都沒有：前幾名的標題與摘要都沒提到、跟這組查詢有關的子題（SEO rubric S2 的「競品沒有的資訊」對照這一項）。後面寫事實庫有沒有對應的 `confirmed` 事實（寫成 `fact:` 加上 id）；事實庫沒有的，寫要先收什麼。這一欄只記錄缺口與素材，哪一頁要不要補由 `seo-strategist` 決定
- 昕力現站：是否出現與名次
- 來源：WebSearch 的查詢詞，以及用來判斷的前幾名網址

## 首頁 `/`

選詞理由：首頁承接品牌詞，以及決策者還沒想到特定產品時的類別詞（`audience-and-goals.md` 的決策者「了解產品與方案」）。昕力現站的產品線是 AI、數位轉型、資安、ESG（`docs/ia/nodes.csv` 的 `family-*`），所以類別詞挑「數位轉型」「AI 導入」「系統整合」，再加上 `nodes.csv` 有 `/aiso` 節點的「主權 AI」。

### 昕力資訊

- 類型：品牌
- 意圖：導航型（查公司名），但前幾名全是財經新聞，實際滿足的是「這家公司最近怎麼了」的資訊需求
- 頁面類型：財經與科技新聞（上櫃申請、財報、私募、合作）
- 共同子題：申請上櫃、半年報虧損與營收、與群聯合作的企業主權 AI、半導體供應鏈資格、加入英特爾夥伴聯盟
- 前幾名都沒有：公司做什麼的整理（產品線、服務的產業）、客戶與案例、得獎紀錄。前幾名的新聞只寫上櫃、財報、合作。事實庫有 `fact:company-industries`、`fact:company-offerings`、`fact:company-founded`、`fact:award-taiwan-excellence-2024`
- 昕力現站：未出現
- 來源：WebSearch（US）`昕力資訊`。前幾名 https://uanalyze.com.tw/articles/9951253851 、https://technews.tw/?p=1427915 、https://finance.technews.tw/2026/03/10/enterprise-sovereignty-ai/ 、https://udn.com/news/story/7240/9368649 、https://m.cnyes.com/news/id/6116531

### TPIsoftware

- 類型：品牌
- 意圖：導航型。英文品牌名的結果偏向海外的公司資料與評論平台
- 頁面類型：公司名錄與評論平台（Gartner Peer Insights、G2、DesignRush、The Manifest、CB Insights）、新聞稿（台灣精品獎、越南 Sao Khue 獎）、股價頁（GuruFocus、MarketScreener）、徵才頁（ITviec）、合作夥伴頁（Intel）
- 共同子題：台灣精品獎、digiRunner 與 DigiLism 等產品名、Intel 合作夥伴、股票代號
- 前幾名都沒有：英文的產品線總覽與客戶案例。名錄的員工數互相矛盾（2026-11-03 的摘要寫 DesignRush 500–999、Prospeo 101–200），都沒寫來源。事實庫有 `fact:company-employees-630`（數字的年份是 2020），但它是 zh-TW；`/en` 要用，得先收 en 的事實
- 昕力現站：未出現
- 來源：WebSearch（US）`TPIsoftware`。前幾名 https://itviec.com/nha-tuyen-dung/tpisoftware-co-ltd 、https://www.intel.com/content/www/us/en/partner/showcase/storefront/a5Scv0000002hYjEAI/tpisoftware.html 、https://kyodonewsprwire.jp/release/202312073963 、https://www.gartner.com/reviews/vendor/tpisoftware 、https://technode.global/?p=98918

### 昕力資訊 官網

- 類型：品牌
- 意圖：導航型（明確要找官網）
- 頁面類型：新聞、媒體的標籤頁（CIO Taiwan）、股票資訊站（nstock）、求職評論（interview.tw）
- 共同子題：公司成立年份與地址、四條產品線、月營收、與群聯的私募
- 前幾名都沒有：官方網址本身，以及聯絡方式。摘要的地址取自股票資訊站。事實庫有 `fact:company-email`
- 昕力現站：未出現。WebSearch 的摘要寫明「搜尋結果中沒有找到昕力資訊的官方網址」
- 來源：WebSearch（US）`昕力資訊 官網`。前幾名 https://interview.tw/i/62b2b8adf2869d1d09444220 、https://www.cio.com.tw/tag/%e6%98%95%e5%8a%9b%e8%b3%87%e8%a8%8a/ 、https://www.ctee.com.tw/news/20260424700179-439901 、https://www.nstock.tw/%E6%98%95%E5%8A%9B%E8%B3%87*%E5%81%9A%E4%BB%80%E9%BA%BC.html

### 企業數位轉型 軟體公司

- 類型：類別
- 意圖：資訊型為主，帶商業型。前幾名一半是「數位轉型是什麼」的說明頁，一半是國際廠商的方案頁，沒有廠商列表或比較文
- 頁面類型：國際廠商的方案頁（AWS、Oracle、Siemens、Dynatrace）、定義文（Trend Micro「什麼是」）、碩士論文、新聞
- 共同子題：轉型不只是導入技術（組織與文化）、雲端、資安融入每個階段、以整合平台取代單點系統
- 前幾名都沒有：台灣廠商的方案頁；既有核心系統（大型主機、ESB）怎麼接上新系統；金融等受監管產業的轉型案例。2026-11-03 重查時前幾名換成碩士論文、Micro Focus 新聞、Dynatrace 與 Oracle 的方案頁，AWS、Siemens 不在清單裡，上面三項仍然沒有。事實庫有 `fact:digilism-protocol-integration`、`fact:digilism-system-integration`
- 昕力現站：未出現
- 來源：WebSearch（US）`企業數位轉型 軟體公司`。前幾名 https://aws.amazon.com/tw/enterprise/transformation/ 、https://www.trendmicro.com/zh_tw/what-is/what-is-data-security/digital-transformation.html 、https://www.siemens.com/zh-tw/technology/digital-transformation/ 、https://www.oracle.com/tw/cloud/digital-transformation/

### 台灣 AI 解決方案 公司

- 類型：類別
- 意圖：商業型（要找廠商），但結果沒有名錄，前幾名是個別廠商的新聞與展會報導
- 頁面類型：新聞、展會報導、研討會頁
- 共同子題：地端部署、資料主權、中小企業降低成本、AI 基礎架構與大型模型
- 前幾名都沒有：廠商名錄或比較；導入後的成果數字與具名案例（新聞只寫發表了幾項方案）。事實庫有 `fact:smartclaim-result`、`fact:smartfilling-case-bank`
- 昕力現站：未出現
- 來源：WebSearch（US）`台灣 AI 解決方案 公司`。前幾名 https://uanalyze.com.tw/articles/7336633743 、https://www.cna.com.tw/postwrite/chi/408723 、https://finance.technews.tw/2025/07/16/ai-wave-show-taiwan-ai/ 、https://finance.technews.tw/2025/09/09/d-e-e-p-tech-day-2025-taiwan-mobile/

### 企業 AI 導入

- 類型：問題（「怎麼導入」的簡寫）
- 意圖：資訊型。前幾名是導入步驟的指南與調查報導
- 頁面類型：教學、指南（SAP 台灣、PRO360）、新聞與調查（工商時報、iThome）、Podcast
- 共同子題：導入步驟、與事業目標對齊、ROI 與失敗比例、AI 治理與風險框架（NIST AI RMF）、企業成熟度調查
- 前幾名都沒有：受監管產業導入時資料留在企業內的做法；AI 使用紀錄怎麼留給稽核；導入前、導入中各做哪些事的服務項目（前幾名只寫通用步驟）。事實庫有 `fact:systalk-ai-onboarding`、`fact:digirunner-ai-usage-log`、`fact:systalk-viki-on-prem`
- 昕力現站：未出現。現站有同主題文章 https://www.tpisoftware.com/blog/ai/implementationguide （「企業導入 AI 的 4 個階段與 3 大應用」），`inventory.csv` 的處置是 `drop`
- 來源：WebSearch（US）`企業 AI 導入`。前幾名 https://www.sap.com/taiwan/resources/effective-ai-implementation-in-business 、https://www.ctee.com.tw/news/20261005701716-431204 、https://www.ithome.com.tw/news/150234 、https://www.pro360.com.tw/guide/how_ai

### 系統整合 廠商 推薦

- 類型：類別
- 意圖：比較型（「推薦」）。前幾名是英文的 Top 10 列表與原廠夥伴頁，沒有台灣在地的列表
- 頁面類型：列表文（Euvic「Top 10 Best System Integration Companies」）、原廠夥伴頁（Rockwell Automation）、市調報告頁（GII）
- 共同子題：整合方式（點對點、雲端平台、ESB）、找整合商前先寫清楚需求
- 前幾名都沒有：台灣在地的整合商列表；銀行核心系統、ESB 這類整合情境。前幾名是製造業原廠夥伴頁與歐美的 Top 10 列表。事實庫有 `fact:digilism-protocol-integration`、`fact:company-industries`
- 昕力現站：未出現
- 來源：WebSearch（US）`系統整合 廠商 推薦`。前幾名 https://rockwellautomation.com/zh-tw/company/partnernetwork/system-integrator-partners.html 、https://www.us.euvic.com/post/best-system-integration-companies 、https://www.gii.tw/report/smrc1359042-system-integration-market-forecasts-global.html

### 企業主權 AI 地端部署 方案

- 類型：類別
- 意圖：資訊型與商業型都有。前幾名是部署模式的指南，也有台灣廠商的發表新聞
- 頁面類型：指南（Scality、Zerve、Ertas 的繁中文章）、新聞與標籤頁（INSIDE）、活動議程
- 共同子題：主權 AI 的定義（不依賴外國基礎設施與法律管轄）、部署形式（自有資料中心、主權雲、氣隙隔離）、海外雲自行託管不算主權、整合業務流程的工作量
- 前幾名都沒有：硬體規格與容量（GPU 數、VRAM）；Token 用量的成本；平台內建哪些模組。前幾名講定義與部署形式，台灣廠商的部分只有新聞。事實庫有 `fact:aiso-servers`、`fact:aiso-no-token-limit`、`fact:aiso-modules`
- 昕力現站：未出現。WebSearch 的摘要提到第三方頁面寫了昕力資訊與群聯組成的 AISO 主權 AI 聯盟
- 來源：WebSearch（US）`企業主權 AI 地端部署 方案`。前幾名 https://www.inside.com.tw/tag/28626-%E5%9C%B0%E7%AB%AF%E9%83%A8%E7%BD%B2 、https://www.solved.scality.com/enterprise-private-ai-deployment-models-guide/ 、https://www.ertas.ai/zh-Hant/blog/sovereign-ai-enterprise-guide-2026

## digiRunner 產品頁 `/products/digirunner`

選詞理由：`digiRunner` 與 `digiRunner API 管理平台` 是品牌詞；`API 管理平台`、`API Gateway 是什麼` 是不知道產品名的 IT 主管會查的類別詞與問題；`API 管理 金融業` 對應主要受眾的產業；比較型的三組（比較、Kong 替代、開源推薦）對應選型階段。現站有 digiRunner 開源版（WebSearch 的 `digiRunner API 管理平台` 結果有開源專案頁），所以加上「開源 API Gateway 推薦」。

### digiRunner

- 類型：品牌
- 意圖：導航型。但結果被同名的遊戲與 App 佔滿，沒有任何 API 產品的結果
- 頁面類型：遊戲下載頁（itch.io）、App Store 頁、維基百科
- 共同子題：無（與 API 無關）
- 前幾名都沒有：所有跟 API 有關的子題，最基本的是「digiRunner 是 API 管理平台」這個類別說明。事實庫有 `fact:cert-digirunner-aws`
- 昕力現站：未出現
- 來源：WebSearch（US）`digiRunner`。前幾名 https://partlymanu.itch.io/digirunner 、https://keromas.itch.io/digrunner 、https://apps.apple.com/app/id6741570714

### digiRunner API 管理平台

- 類型：品牌加類別
- 意圖：導航型與商業型。前幾名是評論平台與 Marketplace，查的人已經知道產品、在看評價與購買管道
- 頁面類型：評論平台（Gartner Peer Insights、GetApp）、AWS Marketplace 商品頁、產品文件（`docs.tpi.dev` 的內容，出現的網址是第三方鏡像 `backiee.wasmer.app`）、開源專案頁（SourcePulse）
- 共同子題：OpenAPI、OAuth 2.0、OIDC；API 生命週期管理；本地與雲端部署、Kubernetes；AWS 與 ISO 27001 認證；開源版的安裝方式；AI Gateway；評論提到的授權方式與 API Composer
- 前幾名都沒有：具名的客戶案例；台灣法規（金管會開放銀行、金融檢查、國發會共通性 API 規範）的對應；效能數字與它的條件。前幾名是評論、Marketplace 與第三方鏡像的文件。事實庫有 `fact:digirunner-case-taishin`、`fact:digirunner-open-banking-fsc`、`fact:digirunner-ndc-spec`、`fact:digirunner-tps`
- 昕力現站：未出現。`docs.tpi.dev` 本身也沒有出現，只出現鏡像網址
- 來源：WebSearch（US）`digiRunner API 管理平台`。前幾名 https://www.gartner.com/reviews/product/digirunner 、https://aws.amazon.com/marketplace/pp/prodview-pmlw6yaa37dju 、https://www.getapp.com/it-management-software/a/digirunner/ 、https://backiee.wasmer.app/https_docs_tpi_dev/overview 、https://www.sourcepulse.org/projects/30878706

### API 管理平台

- 類型：類別
- 意圖：資訊型。前幾名是「什麼是 API 管理」的定義文與 glossary
- 頁面類型：定義文（Google Cloud 的簡中、繁中版）、產品文件（Workato、WSO2）、glossary 與百科頁
- 共同子題：API 生命週期、API Gateway、開發者入口網站、分析與計費、部署在本地、雲端或混合環境、代表產品（Apigee、Kong、MuleSoft、Azure、AWS 等）
- 前幾名都沒有：台灣法規要求；把 AI 模型的流量也納入 API 管理（AI Gateway）；台灣或亞洲的代表產品（2026-11-03 摘要列的商業與開源產品都是歐美廠商）。事實庫有 `fact:digirunner-ai-gateway`、`fact:digirunner-financial-inspection`
- 昕力現站：未出現
- 來源：WebSearch（US）`API 管理平台`。前幾名 https://cloud.google.com/learn/what-is-api-management?hl=zh-cn 、https://cloud.google.com/learn/what-is-api-management?hl=zh-TW 、https://docs.workato.com/en/features/api-management 、https://wso2.com/integration-platform/docs/manage/cloud/api-management/overview

### API Gateway 是什麼

- 類型：問題
- 意圖：資訊型
- 頁面類型：教學與技術文章（iT 邦幫忙 3 篇、Medium）、雲端廠商的產品頁與文件（AWS）、廠商的入門頁（Gravitee）
- 共同子題：反向代理與路由、認證授權（API 金鑰、OAuth、JWT、mTLS）、限流與配額、快取、監控、開源選項（NGINX、Kong、Traefik、HAProxy）
- 前幾名都沒有：Gateway 和完整 API 管理平台差在哪（這一點出現在 `API 管理 金融業` 的結果，不在這組）；伺服器故障時的自動分流；繁中的在地產品例子。事實庫有 `fact:digirunner-failover`、`fact:digirunner-load-balancing`、`fact:digirunner-api-lifecycle`
- 昕力現站：未出現。現站有同主題文章 https://www.tpisoftware.com/blog/smartm/api-gateway-ch （「API Gateway：現代企業的最佳解決方案」），處置是 `drop`
- 來源：WebSearch（US）`API Gateway 是什麼`。前幾名 https://aws.amazon.com/tw/api-gateway/ 、https://medium.com/@developerjoy/api-gateway-78ed082e5aa1 、https://ithelp.ithome.com.tw/articles/10393856 、https://docs.aws.amazon.com/zh_tw/apigateway/latest/developerguide/welcome.html

### API 管理 金融業

- 類型：類別
- 意圖：資訊型為主，帶商業型（白皮書下載、案例）
- 頁面類型：台灣資安新聞（iThome）、廠商部落格與學習中心（Tyk 4 筆）、白皮書下載表單（IBM）、案例（LTTS）、指南（Infopulse、HES FinTech）
- 共同子題：台灣法規（財金公司 Open API 規範：API 盤點、認證與防禦、端對端加密、OWASP API Top 10 檢測）、殭屍 API 與影子 API、Gateway 與完整 API 管理平台的差別、生命週期、開發者入口網站
- 前幾名都沒有：台灣金融檢查要求的 API 管理項目；開放銀行三階段的對應；台灣銀行的具名案例。2026-11-03 重查時 iThome 的台灣法規新聞與 IBM 白皮書不在清單裡，前幾名剩 Tyk（4 筆）與其他英文指南，台灣來源一筆都沒有。事實庫有 `fact:digirunner-financial-inspection`、`fact:digirunner-open-banking-3-stages`、`fact:digirunner-case-taishin`
- 昕力現站：未出現
- 來源：WebSearch（US）`API 管理 金融業`。前幾名 https://www.ithome.com.tw/news/168669 、https://www.ibm.com/forms/mkt-whitepaper-6315a 、https://tyk.io/blog/future-proofing-api-management-in-financial-services-a-roadmap-for-2025-and-beyond/ 、https://tyk.io/learning-center/enterprise-api-management-fintech/

### API 管理平台 比較

- 類型：類別
- 意圖：比較型
- 頁面類型：廠商寫的比較文與比較頁（Gravitee、Chakray、Jitterbit）、日文比較表、Capterra 比較頁。沒有繁中的比較文
- 共同子題：Gateway、管理層、開發者入口的架構；依雲端環境、預算與授權、自架或混合部署、AI 功能選型
- 前幾名都沒有：繁中的比較文；台灣或亞洲廠商；在地法規支援與地端部署這兩個比較維度。現站的 digiRunner 與 Kong 比較表在事實庫是 `to_confirm`，不能用；可以用的是部署與法規的事實，例如 `fact:digirunner-deployment`、`fact:digirunner-open-banking-fsc`
- 昕力現站：未出現
- 來源：WebSearch（US）`API 管理平台 比較`。前幾名 https://chakray.com/?p=36135 、https://www.gravitee.io/comparison 、https://www.jitterbit.com/blog/best-api-management-tools/ 、https://book.st-hakky.com/hakky/apigee-comparison

### Kong 替代方案 API Gateway

- 類型：類別（競品名加「替代」）
- 意圖：比較型
- 頁面類型：「alternatives」列表文（API7、BytePlus、FitGap、Toolradar）、GitHub wiki
- 共同子題：Apache APISIX、Envoy、雲端代管的 Gateway、Apigee、Tyk、MuleSoft、3scale、WSO2；換掉 Kong 的原因（規模變大後的價格、整合、效能、缺少的功能）
- 前幾名都沒有：台灣廠商；從 Kong 換過來的遷移步驟；在地支援與法規。前幾名的考量只有價格、整合、效能與缺少的功能。digiRunner 與 Kong 的比較同上一組，是 `to_confirm`；法規的對應有 `fact:digirunner-open-banking-fsc`、`fact:digirunner-ndc-spec`
- 昕力現站：未出現
- 來源：WebSearch（US）`Kong 替代方案 API Gateway`。前幾名 https://www.byteplus.com/en/topic/551973 、https://api7.ai/blog/top-kong-alternatives 、https://us.fitgap.com/products/009625/kong-gateway/alternative

### 開源 API Gateway 推薦

- 類型：類別
- 意圖：比較型
- 頁面類型：列表與比較文（Moesif 2026 Roundup、API7、BytePlus）、替代品目錄（OpenAlternative）
- 共同子題：Kong、APISIX、Tyk、KrakenD、WSO2；開源免授權費但要自己維運，需要 SLA 時看商業版
- 前幾名都沒有：digiRunner 開源版（列表都沒有它）；繁中的開源版安裝說明。事實庫沒有開源版的事實，要寫得先從現站或 `docs.tpi.dev` 收
- 昕力現站：未出現。digiRunner 開源版也沒有出現在列表裡
- 來源：WebSearch（US）`開源 API Gateway 推薦`。前幾名 https://api7.ai/learning-center/api-gateway-guide/open-source-vs-commercial-api-gateway 、https://www.byteplus.com/en/topic/552732 、https://www.moesif.com/blog/api-engineering/api-gateways/Open-Source-API-Gateway-Roundup

## 金融產業頁 `/industries/finance`

選詞理由：`nodes.csv` 的 `industry-finance` 節點承接現站 `/products/open-banking`，所以開放銀行有 3 組（概念、台灣法規、銀行 API 平台）；`industry-finance` 的子節點有 InsureBrick、InsureRing，所以加保險科技；金融業是主要受眾的第一個產業（`audience-and-goals.md`），加上「數位轉型」「AI 應用」兩組大類別詞；品牌詞用「昕力資訊 金融」。`台灣 開放銀行 第三方業者 API 金管會` 是因為 `開放銀行 API` 的結果沒有台灣來源而加的在地化查詢。

### 金融業 數位轉型

- 類型：類別
- 意圖：資訊型
- 頁面類型：媒體報導與評論（數位時代、自由財經、經理人、CIO Taiwan、INSIDE）、碩士論文（政大、台大）
- 共同子題：不轉型的長期風險、生態圈競爭、數位化到數位轉型的階段、障礙（反洗錢、資安、個資保護）、純網銀的鯰魚效應、資訊人才需求。多數是 2020–2022 年的文章
- 前幾名都沒有：2022 年以後的進展（AI、開放銀行第三階段之後）；核心系統怎麼接上新服務的做法；具名的金融業案例。事實庫有 `fact:digilism-protocol-integration`、`fact:smartfilling-case-bank`、`fact:company-milestone-2008-finance`
- 昕力現站：未出現
- 來源：WebSearch（US）`金融業 數位轉型`。前幾名 https://www.bnext.com.tw/article/67240/finance-digital-transfer 、https://ec.ltn.com.tw/article/breakingnews/3381018 、https://www.managertoday.com.tw/articles/view/64779 、https://www.cio.com.tw/?p=7598

### 開放銀行 API

- 類型：類別
- 意圖：資訊型。前幾名是定義文與越南的法規問答，沒有台灣來源
- 頁面類型：定義文與 glossary（PhotonPay 香港、Solidgate）、法規問答（越南 Thư viện Pháp luật 2 筆、Luật Việt An）、銀行的創新中心文件（印度 Union Bank）
- 共同子題：開放銀行的定義、客戶授權第三方存取的流程、PSD2、API 類型（支付發起、餘額查詢）、越南央行 64/2024/TT-NHNN 通函
- 前幾名都沒有：台灣的制度與時程（2026-11-03 的摘要也寫結果沒有涵蓋台灣）；第三方業者取得授權時不存帳密的做法；API 的資安分層。事實庫有 `fact:open-banking-taiwan-2019`、`fact:open-banking-stage-1`、`fact:open-banking-stage-2`、`fact:open-banking-stage-3`、`fact:digirunner-open-banking-no-credentials`、`fact:digirunner-open-banking-security`
- 昕力現站：未出現
- 來源：WebSearch（US）`開放銀行 API`。前幾名 https://www.photonpay.com/hk/blog/article/open-banking-api 、https://thuvienphapluat.vn/hoi-dap-phap-luat/ngan-hang-co-bat-buoc-phai-cong-khai-thong-tin-open-api-tren-trang-thong-tin-dien-tu-khong-138043899.html 、https://solidgate.com/glossary/open-banking/

### 台灣 開放銀行 第三方業者 API 金管會

- 類型：問題（台灣制度怎麼運作）
- 意圖：資訊型
- 頁面類型：新聞（數位時代 2 筆、工商時報、鉅亨網、公視、科技新報 2 筆），全部是 2019 年前後
- 共同子題：三階段推動（公開資料查詢、消費者資訊查詢、交易面資訊）、財金公司訂技術與資安標準、銀行公會訂第三方業者（TSP）自律規範、開放 API 平台上線、API 規格標準化
- 前幾名都沒有：第二、三階段後來的時程（前幾名停在 2019 年前後）；銀行端要做的 API 管理與資安項目。事實庫有 `fact:open-banking-stage-2`、`fact:open-banking-stage-3`、`fact:digirunner-open-banking-security`
- 昕力現站：未出現
- 來源：WebSearch（US）`台灣 開放銀行 第三方業者 API 金管會`。前幾名 https://www.bnext.com.tw/article/55095 、https://ctee.com.tw/news/finance/113492.html 、https://news.cnyes.com/news/id/4226603 、https://technews.tw/2019/10/17/openbanking-2-questions/

### 銀行 API 平台

- 類型：類別
- 意圖：資訊型與商業型。前幾名有列表文、廠商產品文件，也有銀行自己的開發者入口
- 頁面類型：列表文（Apidog 日文「best bank API management platforms」）、廠商比對平台（Celent VendorMatch）、產品文件（Oracle Banking APIs）、新聞（DBS 開發者平台）、銀行開發者入口（UCO Bank）
- 共同子題：建立、保護、監控、變現 API；把帳戶、支付、存款、貸款開放給金融科技業者；開發者入口網站與沙盒；API 分類
- 前幾名都沒有：台灣銀行的例子（前幾名是新加坡、印度、美國的銀行與廠商）；平台背後的資料庫與高可用架構。事實庫有 `fact:digirunner-case-taishin`、`fact:digirunner-redis-storage`
- 昕力現站：未出現
- 來源：WebSearch（US）`銀行 API 平台`。前幾名 https://apidog.com/jp/blog/best-bank-api-management-platforms/ 、https://celent.com/vendormatch/discovery/solutions/919438237 、https://docs.oracle.com/cd/F18559_01/webhelp/Content/obdx/obapintroduction.htm 、https://www.retailbankerinternational.com/news/dbs-launches-new-api-developer-platform/

### 金融科技 解決方案 台灣

- 類型：類別
- 意圖：資訊型。查詢帶「解決方案」，但前幾名是產業新聞與展會報導，不是廠商方案頁
- 頁面類型：新聞、展會報導（新加坡金融科技節台灣館）、市調報告頁、顧問公司 insight（KPMG）
- 共同子題：金融科技創新園區（FinTechSpace）、保險理賠聯盟鏈、身分驗證、支付、資安、法遵科技
- 前幾名都沒有：廠商的方案頁本身；具名的金融機構導入案例與成果（前幾名是園區、展會與市調）。事實庫有 `fact:gadodido-finance-group`、`fact:insurering-case-shin-kong-life`、`fact:fraud-platform-result`
- 昕力現站：未出現
- 來源：WebSearch（US）`金融科技 解決方案 台灣`。前幾名 https://technews.tw/?p=536621 、https://www.bnext.com.tw/article/66531/2021fintechspace 、https://www.inside.com.tw/article/33367-fintechspace-sff-2023 、https://kpmg.com/tw/zh/home/insights/2020/06/tw-insights-of-fintech.html

### 保險科技 AI 理賠

- 類型：類別
- 意圖：資訊型。前幾名多為英文的案例新聞
- 頁面類型：英文新聞與案例（Insurance Times、Claims Journal、FinTech Global）、行銷文章（Upwork）、黑客松專案頁、中山大學講座 PDF、LINE TODAY
- 共同子題：影像定損與即時結案、災後空拍分類、反詐欺、理賠文件審閱自動化
- 前幾名都沒有：醫療理賠的文件辨識（診斷書、收據），以及台灣各醫院單據格式不一的問題。前幾名多是車險影像定損與災後空拍。事實庫有 `fact:smartclaim-result`、`fact:smartclaim-auto-filing`、`fact:smartclaim-retraining`
- 昕力現站：未出現
- 來源：WebSearch（US）`保險科技 AI 理賠`。前幾名 https://stacker.com/stories/ai/ai-insurance-7-trillion-rebuild 、https://www.insurancetimes.co.uk/news/polish-insurer-taps-tractables-artificial-intelligence-platform/1440506.article 、https://amp.claimsjournal.com/news/international/2017/05/24/278597.htm

### 金融業 AI 應用

- 類型：類別
- 意圖：資訊型
- 頁面類型：雲端與硬體廠商的說明頁（Google Cloud、Supermicro、Microsoft）、調查報告報導（NVIDIA 金融業 AI 調查）、媒體（CIO Taiwan、iThome）、顧問 insight
- 共同子題：個人化服務、風險與詐欺、反洗錢誤報、法規遵循、營運自動化、交易與投資；監管（歐盟 AI Act 的高風險場景、模型可解釋性）
- 前幾名都沒有：地端部署讓資料不出企業；AI 使用紀錄留給監管查核；用台灣金融法規用語做客服質檢。前幾名講應用領域與歐盟 AI Act。事實庫有 `fact:systalk-coach-on-prem`、`fact:digirunner-ai-usage-log`、`fact:systalk-audit-finance-compliance`
- 昕力現站：未出現
- 來源：WebSearch（US）`金融業 AI 應用`。前幾名 https://www.cio.com.tw/91482/ 、https://cloud.google.com/discover/finance-ai?hl=zh-TW 、https://www.supermicro.com/zh_tw/glossary/ai-in-finance 、https://adoption.microsoft.com/zh-tw/scenario-library/financial-services/

### 昕力資訊 金融

- 類型：品牌
- 意圖：資訊型（查昕力在金融業做什麼），前幾名是新聞
- 頁面類型：新聞稿與新聞（iThome PR、科技新報、CIO Taiwan 3 筆、鉅亨網、經濟日報）
- 共同子題：媒體引述的金融業客戶比重、Thinknova LLM、防詐、OrientAI、營收與轉盈目標。這些是媒體寫的內容，不是事實庫的事實，新站要用必須先進 `docs/strategy/facts.yaml`
- 前幾名都沒有：昕力在金融業的產品與案例整理（新聞只寫營收比重、LLM 與防詐合作）。事實庫有 `fact:company-milestone-2008-finance`、`fact:digirunner-case-taishin`、`fact:insurebrick-case-shin-kong`
- 昕力現站：未出現
- 來源：WebSearch（US）`昕力資訊 金融`。前幾名 https://www.ithome.com.tw/pr/161970 、https://finance.technews.tw/2026/03/10/enterprise-sovereignty-ai/ 、https://www.cio.com.tw/94496/ 、https://finance.technews.tw/2025/07/16/tpisoftware/

## AI 智能理賠解決方案 `/solutions/smartclaim`

選詞理由：#199 研究階段補的 AI 產品線四頁之一。`/solutions/smartclaim` 的主題是保險理賠文件辨識與流程自動化（`docs/ia/nodes.csv` 的 `smartclaim` 節點），受眾是保險業的理賠與 IT 主管。已有的 `保險科技 AI 理賠` 不重查。觀察日期 2026-11-05，WebSearch（US），限制同本檔「限制」一節。

### 昕力 智能理賠

- 類型：品牌
- 意圖：導航型（找昕力的理賠產品），前幾名是新聞，實際滿足的是「這個產品得過什麼、怎麼做」的資訊需求
- 頁面類型：科技與財經新聞（科技新報 2 筆、CIO Taiwan 4 筆、鉅亨網、經濟日報）
- 共同子題：2024 金漾獎智慧應用組佳作、ICR 取代傳統 OCR、把理賠文件解析成 ICD-9／10 與健保手術代碼、RPA 串接理賠引擎、少量資料訓練與自主維運；另有公司營收與主權 AI 的新聞。獎項組別與 ICD 代碼是媒體寫的內容；事實庫的金漾獎是現站新聞標題 `fact:award-golden-yang-2024-smartclaim`（沒寫組別），ICD 只在 SysTalk.ICR 頁有 `fact:systalk-icr-medical-24h`
- 前幾名都沒有：產品頁本身、理賠流程從立案到派件的步驟、導入方式。事實庫有 `fact:smartclaim-flow`、`fact:smartclaim-review-engine`、`fact:smartclaim-end-to-end`、`fact:smartclaim-technologies`、`fact:smartclaim-case-medical-documents`、`fact:smartclaim-result`
- 昕力現站：未出現
- 來源：WebSearch（US）`昕力 智能理賠`。前幾名 https://technews.tw/?p=1261297 、https://www.cio.com.tw/?p=75252 、https://technews.tw/2024/07/31/tpisoftware-young-2024/ 、https://www.cio.com.tw/the-2023-taiwan-boutique-award-information-software-winner-three-independent-research-and-development-products-won-the-prize/ 、https://m.cnyes.com/news/id/6116531

### AI 智能理賠 解決方案

- 類型：類別
- 意圖：商業型（找可採購的方案），前幾名混了廠商頁與新聞
- 頁面類型：新聞（科技新報的昕力金漾獎報導排第一、Sedgwick、Tractable 日本導入）、AWS Marketplace 產品頁、香港 unwire 的 AWS Bedrock 示範、港交所文件 PDF、Milliman 的導入步驟 insight
- 共同子題：文件數位化與解析、車險影像定損、從報案到結案的全流程、複雜案件保留人工覆核、導入步驟
- 前幾名都沒有：台灣醫療理賠（診斷書、各醫院收據格式不一）的方案說明；國際方案都是車險與財產險。事實庫有 `fact:smartclaim-flow`（保戶診斷書與單據掃描建檔後由系統分析）、`fact:smartclaim-auto-filing`、`fact:smartclaim-retraining`、`fact:smartclaim-nlp`
- 昕力現站：未出現（第三方報導排第一）
- 來源：WebSearch（US）`AI 智能理賠 解決方案`。前幾名 https://technews.tw/?p=1261297 、https://www.moomoo.com/news/post/37535486/sedgwick-enters-next-phase-of-ai-technology-development-to-transform 、https://aws.amazon.com/marketplace/pp/prodview-dwtub4lo2ycds 、https://www.globalreinsurance.com/tractables-ai-solution-to-save-adjusters-360000-hours-annually-as-insurer-partner-deploys-it-across-japan/1435240.article 、https://www.milliman.com/ja-JP/insight/8-steps-successful-ai-adoption-strategy-claims-departments

### 醫療理賠 診斷書 OCR 辨識

- 類型：類別
- 意圖：資訊型（了解技術做不做得到），結果全是英文
- 頁面類型：學術論文（處方箋 OCR）、OCR 廠商部落格（Datalogics、ABBYY）、EHR 說明文件（NextGen）、研討會頁
- 共同子題：影像前處理降低錯誤率、保險卡欄位擷取、醫學術語轉代碼、Google Vision／AWS Textract 評估
- 前幾名都沒有：繁中、台灣診斷證明書與醫院收據的辨識；格式各院不同時免建模板。事實庫有 `fact:smartclaim-auto-filing`、`fact:systalk-icr-template-free`、`fact:systalk-icr-three-technologies`、`fact:systalk-icr-medical-24h`
- 昕力現站：未出現
- 來源：WebSearch（US）`醫療理賠 診斷書 OCR 辨識`。前幾名 https://archives.christuniversity.in/items/show/25625 、https://datalogics.com/blog-ocr-for-healthcare-documents 、https://docs.nextgen.com/en-US/nextgenc2ae-enterprise-ehr-help-3240205/using-ocr-to-update-patient-information-and-insurance-358710 、https://content.abbyy.com/company/news/3m-360-encompass-system-for-healthcare-now-with-text-recognition-from-abbyy

### 保險理賠 RPA 自動化

- 類型：類別
- 意圖：資訊型偏商業型（RPA 廠商的應用頁）
- 頁面類型：RPA 廠商的產業頁與部落格（Automation Anywhere、UiPath、Keyence、Bardeen）、顧問與名詞頁（BDO、ValueLabs、Prioxis）
- 共同子題：從表單、醫療報告、帳單擷取資料並更新理賠系統；結合 AI 做詐欺分流；RPA 只照規則跑、不會自我改進；核保與保單管理等其他後台流程
- 前幾名都沒有：繁中與台灣保險業的做法；RPA 與文件辨識、NLP 串在同一條理賠流程（前幾名把 RPA 跟 AI 分開講）。事實庫有 `fact:smartclaim-rpa`、`fact:smartclaim-review-engine`、`fact:smartclaim-technologies`、`fact:smartclaim-end-to-end`、`fact:systalk-rpa-insurance`
- 昕力現站：未出現
- 來源：WebSearch（US）`保險理賠 RPA 自動化`。前幾名 https://www.automationanywhere.com/company/blog/product-insights/how-automation-transforms-insurance-claims-processing 、https://www.keyence.com/products/software/rpa/industries/insurance.jsp 、https://www.uipath.com/blog/industry-solutions/robotic-process-automation-insurance-companies-core-processes 、https://www.bdo.com/insights/industries/insurance/an-introduction-to-robotic-process-automation-for-insurers

### 保險理賠流程 如何自動化

- 類型：問題
- 意圖：資訊型（怎麼做）
- 頁面類型：廠商的導入指南與案例頁（Kuse 繁中、Flowable、Arcee、FlowForma、Activepieces、Beam）
- 共同子題：IDP（OCR＋NLP）擷取文件、LLM 比對保單條款與產生案件摘要、FNOL 上傳照片、直通式處理（STP）、低信心度與爭議案件交人工、先盤點流程瓶頸再設計
- 前幾名都沒有：壽險與健康險的醫療文件（多數例子是車險）；模型上線後的再訓練維運。事實庫有 `fact:smartclaim-retraining`、`fact:smartclaim-one-click-retraining`、`fact:smartclaim-quality`、`fact:smartclaim-flow`、`fact:smartclaim-case-medical-documents`、`fact:smartclaim-end-to-end`
- 昕力現站：未出現
- 來源：WebSearch（US）`保險理賠流程 如何自動化`。前幾名 https://www.kuse.ai/zh-tw/use-cases/insurance-claims-automation 、https://www.flowable.com/blog/business/software-for-automating-insurance-claims-workflows 、https://www.arcee.ai/blog/automated-insurance-claims-a-practical-guide 、https://metavert.io/industry/workflow-automation-for-insurance

### 壽險 理賠 AI 案例 台灣

- 類型：類別
- 意圖：資訊型（看同業做了什麼），前幾名全是台灣新聞
- 頁面類型：財經新聞（工商時報 5 筆、旺得富、中央社、iThome）
- 共同子題：台灣人壽的理賠 AI 平台與詐欺辨識、工研院分拆的慧保科技理賠試算與壽險公會的爭議、壽險公會宣布理賠全程無紙化、勤業眾信的壽險業 AI 採用率調查、理賠人員詐領案
- 前幾名都沒有：理賠文件辨識與立案、派件的自動化案例（新聞講的是詐欺、試算、無紙化）；技術供應商的角度。事實庫有 `fact:smartclaim-case-medical-documents`（沒有客戶名）；要寫客戶名得先從現站收 smartclaim 的客戶案例（事實庫有保險業的 `client-*`，但沒有對應到 smartclaim 的案例）
- 昕力現站：未出現
- 來源：WebSearch（US）`壽險 理賠 AI 案例 台灣`。前幾名 https://www.ctee.com.tw/news/20250515700179-430305 、https://www.ctee.com.tw/news/20241211701235-430305 、https://www.cna.com.tw/news/afe/202411190356.aspx 、https://www.ithome.com.tw/news/123542

### 保險 理賠 NLP 自然語言處理 應用

- 類型：類別
- 意圖：資訊型
- 頁面類型：英文的廠商白皮書與部落格（expert.ai、em360tech、Strada）、Medium 文章、名詞頁（Metavert）
- 共同子題：從非結構化理賠敘述與醫療紀錄擷取資訊、詐欺訊號、減少人工輸入錯誤、聊天機器人產生 FNOL、保險專用語言模型
- 前幾名都沒有：繁中 NLP（診斷書的中文病名、醫院用語）；自有演算法而非通用模型。事實庫有 `fact:smartclaim-nlp`、`fact:smartclaim-ensemble`、`fact:smartclaim-case-medical-documents`
- 昕力現站：未出現
- 來源：WebSearch（US）`保險 理賠 NLP 自然語言處理 應用`。前幾名 https://www.expert.ai/blog/nlp_streamlines_insurance_claims_process/ 、https://medium.com/ubiai-nlp/nlp-use-cases-in-the-insurance-industry-7eab6de4baae 、https://em360tech.com/whitepaper/applying-natural-language-understanding-complex-insurance-problem 、https://metavert.io/natural-language-processing-for-insurance

## AI 智慧建檔解決方案 `/solutions/smartfilling`

選詞理由：`smartfilling` 節點的主題是用 SysTalk.ICR 把紙本文件辨識後建檔（免模板、模型再訓練），現站的案例是金融業的二登流程。查詢詞挑 OCR、ICR、IDP 這些類別詞與問題詞。觀察日期 2026-11-05，WebSearch（US）。

### 昕力 智慧建檔 SysTalk.ICR

- 類型：品牌
- 意圖：導航型，前幾名是新聞
- 頁面類型：新聞（經濟日報、數位時代 2 筆、CIO Taiwan 5 筆、聯合新聞網）
- 共同子題：SysTalk.ICR 是 AI 光學字元辨識產品、保險理賠的診斷證明書免模板辨識與 ICD 代碼、與 SysTalk.VIKI 等產品的整合生態、2023 台灣精品獎
- 前幾名都沒有：「智慧建檔」這個詞本身（WebSearch 摘要寫明結果沒有出現）；建檔流程、金融業的案例。事實庫有 `fact:smartfilling-flow`、`fact:smartfilling-documents`、`fact:smartfilling-icr-puzzle`、`fact:smartfilling-case-bank`、`fact:smartfilling-case-bank-title`、`fact:systalk-icr-filling`
- 昕力現站：未出現
- 來源：WebSearch（US）`昕力 智慧建檔 SysTalk.ICR`。前幾名 https://money.udn.com/money/story/5613/9103926 、https://www.bnext.com.tw/article/81131/tpisoftware202411 、https://www.cio.com.tw/100722/ 、https://www.cio.com.tw/the-2023-taiwan-boutique-award-information-software-winner-three-independent-research-and-development-products-won-the-prize/

### AI OCR 文件辨識 自動建檔

- 類型：類別
- 意圖：商業型（找工具），前幾名多是產品頁
- 頁面類型：SaaS 產品頁與定價頁（fileAI、G2 討論）、Product Hunt 類的產品榜、開源工具文件（paperless-gpt）、整合目錄（OCR.space）、104 學習的 RPA＋OCR 發票文章
- 共同子題：發票、合約、採購單的擷取與分類；整合 ERP、CRM；免模板；手寫與簽名準確率；地端部署與權限
- 前幾名都沒有：金融業的二登與委外建檔流程；人工校對結果回饋給模型再訓練。事實庫有 `fact:smartfilling-case-bank`、`fact:smartfilling-documents`（基金配息單、居留證）、`fact:smartfilling-less-keying`、`fact:smartfilling-text-analysis`、`fact:systalk-icr-puzzle`
- 昕力現站：未出現
- 來源：WebSearch（US）`AI OCR 文件辨識 自動建檔`。前幾名 https://basicamente.pt/en/pages/software-e-ia-gestao-documental-com-ia-e-ocr 、https://hunted.space/product/fileai-ai-ocr 、https://docsearch.algolia.com/mcp/docs/repo/icereed/paperless-gpt 、https://nabi.104.com.tw/room/ability_10044877 、https://file.ai/pricing

### 免模板 OCR 辨識

- 類型：類別
- 意圖：資訊型偏比較型（模板式與 AI 式哪個適合）
- 頁面類型：比較文（Veryfi 的模板式 vs AI 式）、Tesseract 教學（Medium）、OCR 元件產品頁（Aspose、SimpleOCR）、名詞頁
- 共同子題：模板式 OCR 遇版面變動就失準、建模板耗時；AI 式用神經網路、不依賴固定版面；Tesseract LSTM 可訓練
- 前幾名都沒有：繁中的「免模板」說明（WebSearch 摘要寫明沒有以此為主題的文章）；文件影像歪斜、陰影的前處理；訓練資料不足時的資料增量。事實庫有 `fact:smartfilling-template-free`、`fact:smartfilling-preprocessing`、`fact:smartfilling-data-augmentation`、`fact:systalk-icr-template-free`
- 昕力現站：未出現
- 來源：WebSearch（US）`免模板 OCR 辨識`。前幾名 https://www.veryfi.com/technology/template-based-vs-ai-based-ocr/ 、https://medium.com/ntt-data-idi-platform/%E4%BD%BF%E7%94%A8-opencv-%E5%8F%8A-tesseract-%E9%80%B2%E8%A1%8C-ocr-%E8%BE%A8%E8%AD%98-3-%E4%BD%BF%E7%94%A8-tesseract-%E9%80%B2%E8%A1%8C-ocr-%E8%BE%A8%E8%AD%98-aacdcb9f47a8 、https://www.componentsource.com/zh-hant/product/aspose-ocr-for-java

### ICR OCR 差別

- 類型：問題
- 意圖：資訊型（名詞比較）。WebSearch 把「差別」當成歧視（日文摘要），但連結清單本身都是 ICR 與 OCR 的比較文
- 頁面類型：英文比較文（Apryse、Adobe 2 筆、GdPicture、Accusoft、Filestack、Arya.ai、Lido）
- 共同子題：OCR 讀印刷字、ICR 讀手寫字並用機器學習；ICR 誤認率較高、支援語言較少；ICR 靠學習提升準確率
- 前幾名都沒有：繁中的比較文（前 10 筆全是英文）；中文手寫的難點；兩者在同一條建檔流程怎麼搭配。事實庫有 `fact:systalk-icr-template-free`（寫明 ICR 改善傳統 OCR 的限制）、`fact:smartfilling-custom-model`
- 昕力現站：未出現
- 來源：WebSearch（US）`ICR OCR 差別`。前幾名 https://apryse.com/blog/icr-vs-ocr-differences-use-cases 、https://www.adobe.com/acrobat/hub/difference-between-icr-vs-ocr.html 、https://www.gdpicture.com/?p=19298 、https://arya.ai/blog/ocr-vs-icr

### 智慧文件處理 IDP 是什麼

- 類型：問題
- 意圖：資訊型（定義）
- 頁面類型：大廠的定義頁（OpenText 繁中、AWS 繁中與英文）、評論平台分類頁（PeerSpot）、市場報告（GII 繁中）、廠商部落格（Procys、Capacity、BytePlus、Workist）
- 共同子題：IDP 結合 OCR、機器學習、NLP 做擷取、分類、驗證；與規則或範本式自動化的差異；擷取後送進財務、人資系統；市場規模預測
- 前幾名都沒有：台灣金融業的應用（例子是發票、履歷、物流單據）；企業自己再訓練模型、不靠第三方。事實庫有 `fact:smartfilling-case-bank-title`、`fact:smartfilling-icr-puzzle`；「100% 自主維運」是 `smartfilling-self-maintained`，status 為 to_confirm，不能用
- 昕力現站：未出現
- 來源：WebSearch（US）`智慧文件處理 IDP 是什麼`。前幾名 https://www.opentext.com/tw/what-is/intelligent-document-processing 、https://aws.amazon.com/tw/what-is/intelligent-document-processing/ 、https://gii.tw/report/go1551457-intelligent-document-processing-idp.html 、https://www.workist.com/en/blog/what-is-intelligent-document-processing-idp-explained

### 銀行 文件 數位化 手寫 辨識 開戶 申請書

- 類型：類別
- 意圖：資訊型偏商業型（找金融業可用的手寫辨識）
- 頁面類型：手寫 OCR 產品頁（moge.ai 繁中、Runsystem OCR Studio）、PDF 軟體的銀行頁與白皮書（UPDF、Foxit）、學術資料（中研院、台大碩論）、開發者指南（Unstract）
- 共同子題：多種手寫風格辨識、保留表格結構、API 整合、地端部署（Runsystem 的韓國銀行案例）、PDF 表單欄位限制輸入
- 前幾名都沒有：台灣銀行業的導入案例與成效（WebSearch 摘要寫明沒有找到開戶申請書的具體案例）；辨識結果介接內部系統。事實庫有 `fact:smartfilling-case-bank`、`fact:smartfilling-case-bank-title`、`fact:smartfilling-documents`；開戶進件的 `systalk-icr-account-opening-40` 是 to_confirm，不能用
- 昕力現站：未出現
- 來源：WebSearch（US）`銀行 文件 數位化 手寫 辨識 開戶 申請書`。前幾名 https://moge.ai/tw/product/handwriting-ocr 、https://updf.com/hk/banking/ 、https://runsystem.net/en/products/ocr-studio 、https://tdr.lib.ntu.edu.tw/jspui/handle/123456789/65083

### OCR 辨識率 提升 模型 再訓練

- 類型：問題
- 意圖：資訊型（技術做法），讀者偏工程師
- 頁面類型：技術教學與文件（HackMD 的 Tesseract 微調、MathWorks、PaddleOCR README）、學術簡報（中研院 TANET2017）、廠商部落格（AskUI、UPDF）
- 共同子題：以現成模型微調而非從零訓練、控制訓練字集、字型與資料量影響辨識率、何時需要自訂模型
- 前幾名都沒有：企業不寫程式就能再訓練的機制；人工校對結果自動回饋訓練（前幾名都是工程師自己訓練）。事實庫有 `fact:systalk-icr-puzzle`、`fact:smartfilling-icr-puzzle`、`fact:smartfilling-flow`、`fact:smartfilling-data-augmentation`、`fact:smartfilling-case-bank`（含三校回饋再學習）
- 昕力現站：未出現
- 來源：WebSearch（US）`OCR 辨識率 提升 模型 再訓練`。前幾名 https://ascdc.sinica.edu.tw/download/TANET2017_CNN-OCR.pdf 、https://hackmd.io/@garyli-wd/rJ619THsO 、https://www.mathworks.com/help/vision/ug/train-custom-ocr-model-to-detect-seven-segment-digits.html 、https://glama.ai/mcp/servers/@PaddlePaddle/PaddleOCR/blob/46bfd1ef04e7545f33b2065525ffbc742f1a5930/readme/README_tcn.md

## SysTalk.ai 產品家族 `/products/systalk-ai`

選詞理由：`family-ai` 是 hub 頁，子頁是 SysTalk.Chat、VIKI、Coach、Audit、ICR、RPA 與兩個解決方案（`nodes.csv`）。hub 承接品牌詞與「還沒決定要哪一個產品」的類別詞，所以挑品牌詞 2 組，再各挑一組客服、質檢、陪練、生成式 AI 平台的類別詞，加一組問題詞。已有的 `台灣 AI 解決方案 公司`、`企業 AI 導入` 不重查。觀察日期 2026-11-05，WebSearch（US）。

### SysTalk.ai

- 類型：品牌
- 意圖：導航型。英文品牌名跟 SysAgent、AI SmartTalk、Talkie 等名稱相近的產品混在一起
- 頁面類型：獎項頁（台灣精品獎英文版）、昕力的舊產品頁（`tpi-website.azurewebsites.net`）、CIO Taiwan、軟體名錄（SoftwareWorld、G2、Capterra）、Product Hunt（無關產品）
- 共同子題：SysTalk.Chat 的 NLU、FAQ、FLOW「雙腦一流程」、Gartner Cool Vendor 2018、導入服務團隊、2023 年接 ChatGPT 生成語料；名錄寫「雲端、無公開 API」，可能過時
- 前幾名都沒有：家族裡 Chat 以外的產品（VIKI、Coach、Audit、ICR、RPA）；雲端與地端都能部署；導入流程。事實庫有 `fact:systalk-ai-products`、`fact:systalk-ai-day-scenarios`、`fact:systalk-ai-day-coach`、`fact:systalk-ai-day-audit`、`fact:systalk-ai-service`、`fact:systalk-ai-onboarding`、`fact:systalk-ai-onboarding-finetune`、`fact:systalk-ai-after-onboarding`、`fact:award-taiwan-excellence-2024`、`fact:award-gartner-cool-vendor-2018`（原文沒寫是哪個產品）
- 昕力現站：`www.tpisoftware.com` 未出現。清單第 2 筆是 `tpi-website.azurewebsites.net/product-inner-systalk-chat.html`，看起來是昕力的舊站或測試站，是否仍由昕力維護未確認
- 來源：WebSearch（US）`SysTalk.ai`。前幾名 https://ap1.taiwanexcellence.org/en/award/product/1120114 、https://tpi-website.azurewebsites.net/product-inner-systalk-chat.html 、https://www.cio.com.tw/?p=52927 、https://www.softwareworld.co/software/systalkchat-reviews/

### SysTalk 昕力 AI 產品

- 類型：品牌
- 意圖：資訊型（昕力的 AI 產品有哪些）
- 頁面類型：新聞與新聞稿（CIO Taiwan 5 筆、經濟日報、旺得富、PR Newswire 亞太）
- 共同子題：2025 年 10 月發表 SysTalk.Audit 與 SysTalk.Coach、VIKI 的地端部署與知識庫、ICR、Chat 接 ChatGPT、醫療場域四大應用、產品組成 Agentic AI 生態系。新聞的「市佔率領先」「節省 60% 以上人力」是媒體或新聞稿的說法，事實庫的 `genai-solution-60-percent` 是 to_confirm
- 前幾名都沒有：各產品的分工與適用情境的一頁整理（新聞一次只講一兩個產品）。事實庫有 `fact:systalk-ai-products`、`fact:systalk-ai-day-scenarios`、`fact:systalk-ai-day-coach`、`fact:systalk-ai-day-audit`、`fact:systalk-coach-overview`、`fact:systalk-viki-rag`、`fact:systalk-audit-llm-context`、`fact:systalk-icr-template-free`、`fact:systalk-chat-omnichannel`
- 昕力現站：未出現
- 來源：WebSearch（US）`SysTalk 昕力 AI 產品`。前幾名 https://www.cio.com.tw/100722/ 、https://money.udn.com/money/story/5613/9103926 、https://wantrich.chinatimes.com/news/20251029900278-420101 、https://www.prnewswire.com/apac/zh/news-releases/-systalk--ai--ai---302596509.html 、https://www.cio.com.tw/sydits-systalk-chat-integration-chatgpt-build-the-strongest-commercial-ai-smart-call/

### AI 智能客服 推薦 台灣 企業

- 類型：類別
- 意圖：比較型（找推薦），但前幾名沒有比較文或排行榜，是台灣企業自己上線 AI 客服的新聞
- 頁面類型：新聞（iThome 3 筆、工商時報 2 筆、經濟日報、鉅亨網、Yahoo 股市、旺得富）
- 共同子題：台灣大的中小企業 AI 客服與國台英客語混合辨識、台數科「哈妮」轉人工比例下降、中嘉、台新金控、長庚醫院、南山人壽的智能客服
- 前幾名都沒有：技術供應商的比較；導入步驟；文字與語音全通道。事實庫有 `fact:systalk-chat-omnichannel`、`fact:systalk-chat-eight-steps`、`fact:systalk-chat-solutions`、`fact:systalk-chat-case-sinyi`、`fact:systalk-chat-case-wemo`、`fact:award-taiwan-excellence-2023`
- 昕力現站：未出現
- 來源：WebSearch（US）`AI 智能客服 推薦 台灣 企業`。前幾名 https://www.ithome.com.tw/tags/%E6%99%BA%E8%83%BD%E5%AE%A2%E6%9C%8D 、https://money.udn.com/money/story/5607/8964735 、https://www.ctee.com.tw/news/20260616701385-430502 、https://www.ithome.com.tw/news/166112

### AI 語音質檢 客服中心

- 類型：類別
- 意圖：資訊型偏商業型
- 頁面類型：繁中產品文件（MaiAgent 2 筆）、英文部落格與名詞頁（callin.io、NICE、IONOS、TechRepublic）、新聞（工商時報的全球人壽案例）
- 共同子題：從人工抽樣改成全量檢核、ASR 轉文字後由 LLM 判斷合規、開場與身分確認等 SOP 檢核、語氣與禁語、結果匯入 BI 報表
- 前幾名都沒有：台灣混語（國台客英）的轉錄；換話術不必重設規則；地端部署。事實庫有 `fact:systalk-audit-languages`、`fact:systalk-audit-stt`、`fact:systalk-audit-no-rules`、`fact:systalk-audit-on-prem`、`fact:systalk-audit-coverage`、`fact:systalk-audit-sampling-2-percent`、`fact:systalk-audit-finance-compliance`
- 昕力現站：未出現
- 來源：WebSearch（US）`AI 語音質檢 客服中心`。前幾名 https://docs.maiagent.ai/application/voicecs/call-qa 、https://docs.maiagent.ai/tech/examples/call-center 、https://www.ctee.com.tw/news/20260312700356-439901 、https://nice.com/glossary/ai-driven-qa-in-customer-service

### AI 業務培訓 對練 保險

- 類型：類別
- 意圖：資訊型（看同業案例）偏商業型
- 頁面類型：保險公司新聞稿（富通保險 PDF）、新聞（iThome、經濟日報、旺得富）、海外廠商產品頁（Second Nature、Retorio、SmartWinnr）、Asia Insurance Review
- 共同子題：南山人壽自研業務員智能對練、富通的 AI Drill 虛擬場景與多面向回饋、AI 角色扮演練習報價與異議處理、合規說明
- 前幾名都沒有：企業依自己的產品與話術設定情境；主管依資歷指派練習；地端部署。事實庫有 `fact:systalk-coach-five-steps`、`fact:systalk-coach-persona`、`fact:systalk-coach-seniority`、`fact:systalk-coach-scoring`、`fact:systalk-coach-on-prem`、`fact:systalk-coach-industries`
- 昕力現站：未出現
- 來源：WebSearch（US）`AI 業務培訓 對練 保險`。前幾名 https://corpweb.ctflife.com.hk/pdf/tc/about-ctflife/FTLife-introduces-AI-Drill-an-training-tool.pdf 、https://www.ithome.com.tw/news/176100 、https://money.udn.com/money/story/5613/8963475 、https://secondnature.ai/insurance/

### 企業 生成式 AI 平台 地端部署 RAG

- 類型：類別
- 意圖：資訊型（架構）偏商業型
- 頁面類型：雲端廠商參考架構（Google Cloud，簡中與繁中）、開源專案（RAGstack GitHub）、平台文件（Apolo）、名詞頁、技術部落格
- 共同子題：RAG 的組成（生成模型、embedding、reranker、向量資料庫）、地端的理由是資料不離開企業、RAG 比微調便宜
- 前幾名都沒有：台灣廠商的地端方案（WebSearch 摘要寫明沒有中文或台灣的比較）；授權方式；不限 Token；權限控管。事實庫有 `fact:systalk-viki-rag`、`fact:systalk-viki-on-prem`、`fact:systalk-viki-no-token-limit`、`fact:systalk-viki-permissions`、`fact:systalk-viki-annual-license`、`fact:vikibundle-local`
- 昕力現站：未出現
- 來源：WebSearch（US）`企業 生成式 AI 平台 地端部署 RAG`。前幾名 https://docs.cloud.google.com/architecture/rag-reference-architectures?hl=zh-tw 、https://github.com/psychic-api/rag-stack?ref=aitoolnet.com 、https://docs.apolo.us/index/use-cases

### AI 客服機器人 怎麼選

- 類型：問題
- 意圖：比較型（選購指南）
- 頁面類型：選購指南與部落格（INSIDE 繁中、respond.io 繁中、Botpress 繁中、Udesk、Intercom、gnani.ai）、Google Cloud 繁中的用途頁
- 共同子題：先分清楚聊天機器人與能執行動作的 AI Agent、NLP 與機器學習、轉接真人、上線前測試、從技術、場景、服務三面向比較
- 前幾名都沒有：繁體中文語意理解的處理；導入後維護「大腦」（語料分類、衝突審核、模型準確度）的方法。事實庫有 `fact:systalk-chat-on-prem-llm`、`fact:systalk-chat-brain-tools`、`fact:systalk-chat-two-brains`、`fact:genai-solution-five-indicators`
- 昕力現站：未出現
- 來源：WebSearch（US）`AI 客服機器人 怎麼選`。前幾名 https://www.inside.com.tw/article/14790-ai-chatbot-customer-service 、https://respond.io/tw/blog/best-ai-chatbot-for-customer-service 、https://botpress.com/tw/blog/how-to-build-your-own-ai-chatbot 、https://www.udeskglobal.com/blog/how-to-choose-a-customer-service-robot-top-10-popular-brands-in-2025-recommended.html

## OrientAI 企業級 Agentic AI 平台 `/orient-ai`

選詞理由：`orient-ai` 節點是昕力 2026 年推出的 Agentic AI 平台，現站首頁與產品頁的重點是多 Agent 協作、AI 治理、Token 成本控管、MCP 擴充、地端部署（事實庫 `orientai-*`）。查詢詞挑品牌詞 2 組，類別與問題詞對應這幾個主題。已有的 `企業主權 AI 地端部署 方案`（首頁節）不重查。觀察日期 2026-11-05，WebSearch（US）。

### OrientAI

- 類型：品牌
- 意圖：導航型。英文單字查詢跟同名的加密貨幣交易 Agent 文件站、Orient 手錶、巴基斯坦 GDG 活動撞名，但前幾名是昕力的新聞
- 頁面類型：新聞（科技新報、工商時報、旺得富）、新聞稿（iThome PR）、同名無關的 GitBook 文件站與活動頁
- 共同子題：2026 年 6 月股東會發表、私有雲與地端部署並可接國際 LLM、依工作類型與資料敏感度路由模型、Token 儀表板與部門配額、工具呼叫留稽核紀錄、AISO 聯盟與群聯、大型金控 POC。新聞引用的效率、成本、風險數字在事實庫是 `orientai-benefits`，status 為 to_confirm，不能用
- 前幾名都沒有：產品頁本身與硬體規格建議（幾人團隊配什麼設備）。事實庫有 `fact:orientai-five-features`、`fact:orientai-governance-layer`、`fact:orientai-execution-layer`、`fact:orientai-hardware-small`、`fact:orientai-hardware-large`
- 昕力現站：未出現
- 來源：WebSearch（US）`OrientAI`。前幾名 https://finance.technews.tw/2026/06/04/orientai/ 、https://www.ctee.com.tw/news/20260605700258-430502 、https://orient-ai-documentation.gitbook.io/orient-ai/introduction/overview 、https://www.ithome.com.tw/pr/178180 、https://wantrich.chinatimes.com/news/20260604900483-420101

### OrientAI 昕力 群聯 Agentic AI

- 類型：品牌
- 意圖：資訊型（了解產品與合作）
- 頁面類型：新聞與新聞稿（科技新報 3 筆、工商時報、遠見 GVM、旺得富、聯合新聞網 2 筆、iThome PR 2 筆）
- 共同子題：鎖定政府、醫療、金融保險、製造等高監管產業；模型調度、工具整合、Agent 授權與稽核；AISO 系列 AI 筆電與一體機以 OrientAI 為軟體核心；海外市場規劃
- 前幾名都沒有：群聯 aiDAPTIV 技術在 OrientAI 裡的作用（新聞只寫合作與聯盟）；資料是否離開企業。事實庫有 `fact:orientai-aidaptiv`、`fact:orientai-on-prem-data`、`fact:aiso-industries`（AISO 頁的事實，用在 OrientAI 頁前要確認適用）
- 昕力現站：未出現
- 來源：WebSearch（US）`OrientAI 昕力 群聯 Agentic AI`。前幾名 https://finance.technews.tw/2026/06/04/orientai/ 、https://technews.tw/?p=1567303 、https://city.gvm.com.tw/article/131972 、https://udn.com/news/story/7254/9545652 、https://www.ithome.com.tw/pr/179728

### 企業級 Agentic AI 平台

- 類型：類別
- 意圖：商業型偏比較型（找平台、看評比）
- 頁面類型：廠商產品頁與影片（研華 AgentBuilder 繁中、Grid Dynamics）、分析師報告頁（Avasant 2026）、廠商的「最佳平台」列表文（Kore.ai、Quiq、Instaclustr）、名錄（SourceForge）、名詞頁（Cognigy）
- 共同子題：平台是 AI Agent 的「作業系統」、多 Agent 協調、系統整合、政策執行、可觀測性、權限與人在迴路
- 前幾名都沒有：繁中的平台比較（只有研華一家台灣廠商頁）；地端部署與硬體搭配；Token 成本。事實庫有 `fact:orientai-five-features`、`fact:orientai-execution-layer`、`fact:orientai-token-cost`、`fact:orientai-token-allocation`、`fact:orientai-roi-controls`、`fact:orientai-hardware-small`
- 昕力現站：未出現
- 來源：WebSearch（US）`企業級 Agentic AI 平台`。前幾名 https://www.advantech.com/es-ar/resources/video/agentbuilder-your-enterprise-ai-agent-platform-tc 、https://www.griddynamics.com/solutions/temporal-agentic-ai-platform 、https://avasant.com/report/agentic-ai-platforms-2026-product-assessment/ 、https://kore.ai/blog/7-best-agentic-ai-platforms

### Agentic AI 是什麼

- 類型：問題
- 意圖：資訊型（定義）
- 頁面類型：繁中說明文（香港 ud.hk 4 筆、gugu.fund、Kimi、moge.ai、creati.ai）、Uber 的 AI 解決方案頁
- 共同子題：代理式 AI 自主規劃、用工具、修正做法；與生成式 AI、聊天機器人、AI Agent 的差別；客服、IT、供應鏈的應用
- 前幾名都沒有：企業導入時的治理（權限、稽核、影子 AI）；成本。前幾名只講定義與應用。事實庫有 `fact:orientai-governance-layer`、`fact:orientai-shadow-ai-lifecycle`、`fact:orientai-token-cost`
- 昕力現站：未出現
- 來源：WebSearch（US）`Agentic AI 是什麼`。前幾名 https://school.gugu.fund/blog/ai-tools/2121431793 、https://www.ud.hk/zh-HK/resources/ai/2026-07-09-agentic-ai-operations 、https://www.kimi.com/zh-tw/resources/agentic-ai 、https://www.ud.hk/zh-HK/resources/ai/2026-04-28-agentic-ai-enterprise-framework

### AI Agent 治理 影子 AI 企業

- 類型：類別
- 意圖：資訊型
- 頁面類型：英文廠商內容站（Gravitee 的 corpus 頁 8 筆，WebSearch 摘要指出其中夾雜不相關的內容）、Viviscape 新聞
- 共同子題：影子 AI 的定義（未經核准的 ChatGPT、IDE Agent、MCP 工具）、Agent 繼承人類權限的風險、可見性、控制、問責三目標、偵測方式
- 前幾名都沒有：繁中來源（前 9 筆全是英文）；把治理做成平台功能（統一納管、授權、跨部門權限）。事實庫有 `fact:orientai-shadow-ai-lifecycle`、`fact:orientai-agent-management`、`fact:orientai-governance-controls`、`fact:orientai-governance-layer`、`fact:orientai-five-features`、`fact:orientai-governance`
- 昕力現站：未出現
- 來源：WebSearch（US）`AI Agent 治理 影子 AI 企業`。前幾名 https://viviscape.com/news/shadow-agents-governance-crisis 、https://gravitee.io/corpus/gen-946/decision-management/shadow-ai-control.html 、https://gravitee.io/corpus/gen-1736/risk-factor-finance/shadow-ai-risk.html

### 多代理協作 AI Agent 平台 企業 導入

- 類型：類別
- 意圖：資訊型偏商業型
- 頁面類型：繁中導入指南（actgsys）、新聞（CrewAI 募資）、名詞頁（Cognigy、Xebia）、Product Hunt 類的產品頁（Multica，網域可疑）
- 共同子題：協調者、專業 Agent、通訊層、知識庫的架構；MCP 讓不同廠商的 Agent 混用；成效取決於整合與治理
- 前幾名都沒有：高監管產業的地端多 Agent；Agent 跨企業內部系統執行任務的具體例子。事實庫有 `fact:orientai-multi-agent`、`fact:orientai-agent-dispatch`、`fact:orientai-execution-scenarios`、`fact:orientai-privacy-industries`、`fact:orientai-five-features`、`fact:orientai-execution-layer`
- 昕力現站：未出現
- 來源：WebSearch（US）`多代理協作 AI Agent 平台 企業 導入`。前幾名 https://actgsys.com/zh/blog/multi-agent-ai-system-enterprise-guide-2026 、https://tfir.io/ai-multi-agent-platform-crewai-secures-18-million-in-funding/ 、https://www.cognigy.com/glossary/what-is-a-multi-agent-system 、https://xebia.com/glossary/multi-agent-collaboration-platforms/

### AI Agent 地端部署 Token 成本

- 類型：類別
- 意圖：資訊型（成本怎麼算、怎麼控）
- 頁面類型：英文的雲端與工具廠商指南（騰訊雲 ADP、Railway、MintMCP、MuleSoft、CloudZero、SoftServe 白皮書）
- 共同子題：Token 費用與主機費用、Agent 與多 Agent 的 Token 用量倍數、系統提示詞與 MCP 工具定義的隱藏成本、意圖路由與分級模型、設用量上限
- 前幾名都沒有：地端部署的成本（WebSearch 摘要寫明沒找到地端與 API 計費的比較）；部門層級的用量監控。事實庫有 `fact:orientai-token-cost`、`fact:orientai-token-transparency`、`fact:orientai-token-allocation`、`fact:orientai-governance-layer`、`fact:aiso-no-token-limit`、`fact:systalk-viki-no-token-limit`
- 昕力現站：未出現
- 來源：WebSearch（US）`AI Agent 地端部署 Token 成本`。前幾名 https://adp.tencentcloud.com/blog/enterprise-token-economics-agent-cost-optimization 、https://www.mintmcp.com/blog/track-ai-agent-usage 、https://docs.railway.com/guides/estimate-ai-agent-costs 、https://blogs.mulesoft.com/news/mcp-cost-management/ 、https://www.cloudzero.com/blog/agentic-ai-cost/

### MCP 企業 導入 AI Agent 整合

- 類型：問題
- 意圖：資訊型
- 頁面類型：英文媒體與廠商文章（techstrong.ai 4 筆、Streebo、Dataiku 日文、OneReach 的 Gartner 報告下載頁、Substack）
- 共同子題：MCP 取代逐一客製的連接器、「AI 的 USB-C」、接 CRM、ERP、資料湖、降低模型供應商鎖定、最小權限與治理
- 前幾名都沒有：繁中來源；MCP 跟權限納管、Token 監控放在同一個平台。事實庫有 `fact:orientai-mcp`、`fact:orientai-governance-layer`
- 昕力現站：未出現
- 來源：WebSearch（US）`MCP 企業 導入 AI Agent 整合`。前幾名 https://techstrong.ai/articles/building-smarter-ai-agents-the-role-of-model-context-protocol-in-dynamic-tool-integration/ 、https://www.streebo.com/mcp-development-services/ 、https://www.dataiku.com/ja/blog/the-business-case-for-mcp 、https://onereach.ai/whitepapers/mcp-ai-agents-enterprise-integration-roadmap/

## AISO 主權 AI `/aiso`

選詞理由：`AISO 主權 AI`、`昕力 群聯 AISO 聯盟`、`aiDAPTIV SysTalk.ai` 是品牌詞（事實庫的 `aiso-*` 取自 https://www.tpisoftware.com/products/systalk-ai-phison ，該頁以群聯 aiDAPTIV 搭配 SysTalk.ai 為主）；`地端 AI 伺服器 企業 LLM`、`AI 一體機 企業 地端 交機即用`、`生成式 AI 私有化部署 金融業` 是 IT 主管不知道產品名時的類別詞；`主權 AI 是什麼`、`企業 地端 LLM 建置 成本` 是問題型。首頁一節已查過的 `企業主權 AI 地端部署 方案` 不重查。觀察日期 2026-11-05，WebSearch（US），限制同本檔開頭。

### AISO 主權 AI

- 類型：品牌
- 意圖：導航型（查聯盟或方案名），前幾名全是新聞，實際滿足的是「這個聯盟是什麼、誰加入」的資訊需求
- 頁面類型：科技與財經新聞（INSIDE、數位時代、聯合報、科技新報、iThome 新聞稿、遠見）
- 共同子題：2026-03-23 聯盟簽署、昕力主導與群聯合作、成員家數與工研院指導、國泰金控與台達電簽約、整機交付模式、「AISO Inside」標準與名稱由來（AI for Sovereign）、2026-08 推出 AI 筆電與一體機
- 前幾名都沒有：硬體規格（GPU 數、VRAM、可跑的模型級距）；平台內建哪些模組；導入服務包含哪些工作；適用產業。新聞只寫聯盟與交付模式。事實庫有 `fact:aiso-servers`、`fact:aiso-modules`、`fact:aiso-onboarding`、`fact:aiso-industries`、`fact:aiso-bundled`，以及 `/aiso` 頁的 8 個方案（`fact:aiso-legal-contract`、`fact:aiso-hr-labor-law`、`fact:aiso-hr-employee-service`、`fact:aiso-agent-governance`、`fact:aiso-compute-control`、`fact:aiso-talent`、`fact:aiso-teaching`、`fact:aiso-medical-records`）。聯盟成軍收為 `fact:aiso-alliance`，只有現站新聞 https://www.tpisoftware.com/media-center/559 的標題；成立日期、成員、國泰金控與台達電簽約只在該頁的 Nuxt payload，仍不在事實庫
- 昕力現站：未出現。現站有同主題新聞 https://www.tpisoftware.com/media-center/559 ，與 iThome 新聞稿 https://www.ithome.com.tw/pr/174603 內容相近
- 來源：WebSearch（US）`AISO 主權 AI`。前幾名 https://www.inside.com.tw/article/40918-AISO%20AI%20%E7%94%A2%E6%A5%AD%E8%81%AF%E7%9B%9F%E6%88%90%E8%BB%8D 、https://www.bnext.com.tw/article/90396/TPIsoftware_AISO_2026-03 、https://udn.com/news/story/7240/9398000 、https://technews.tw/2026/03/23/aiso/ 、https://www.ithome.com.tw/pr/174603 、https://city.gvm.com.tw/article/132548

### 昕力 群聯 AISO 聯盟

- 類型：品牌
- 意圖：導航型與資訊型（查兩家公司的合作），結果偏投資人觀點
- 頁面類型：財經新聞（聯合報、經濟日報、工商時報、旺得富）、投資社群（CMoney）、媒體標籤頁（CIO Taiwan）
- 共同子題：聯盟成立與首波成員、群聯 aiDAPTIV 的角色（降低硬體與資金門檻）、第二波成員（安碁、騰雲、新漢與東南亞夥伴）、凱鈿取得日本總經銷、股價與營收預期
- 前幾名都沒有：aiDAPTIV 技術實際做什麼（記憶體管理與資料調度）；搭配的軟體支援哪些模型；買方怎麼評估。事實庫有 `fact:aiso-memory-optimization`、`fact:aiso-llm-support`、`fact:orientai-aidaptiv`。效能比較數字（`aiso-52-to-2-seconds`、`aiso-25x-response`、`aiso-10x-dell-hpe`）是 `to_confirm`，note 寫明是群聯提供的估算，要先確認對外使用的授權與量測條件
- 昕力現站：未出現
- 來源：WebSearch（US）`昕力 群聯 AISO 聯盟`。前幾名 https://udn.com/news/story/7240/9398024 、https://uanalyze.com.tw/articles/4758349448 、https://www.ctee.com.tw/news/20260612700181-430502 、https://money.udn.com/money/story/5607/9610376 、https://wantrich.chinatimes.com/news/20260707900080-420101

### aiDAPTIV SysTalk.ai

- 類型：品牌（事實庫 `aiso-*` 來源頁的產品組合）
- 意圖：導航型。但沒有任何一筆把 aiDAPTIV 與 SysTalk.ai 連在一起；結果是 SysTalk.ai 其他產品的獎項與新聞稿，其餘是名稱相近的無關產品（SysAid、SAP AI-Sys）
- 頁面類型：獎項頁（台灣精品獎 SysTalk.Chat）、英文新聞稿（SysTalk.Audit、SysTalk.Coach）、無關產品頁
- 共同子題：SysTalk.ai 產品系列（Chat、Audit、Coach、ICR、VIKI）、台灣精品獎
- 前幾名都沒有：「SysTalk.ai 搭配 aiDAPTIV 的一體機」這個組合本身，包括規格、支援的模型、內建模組。事實庫有 `fact:aiso-servers`、`fact:aiso-llm-support`、`fact:aiso-modules`、`fact:aiso-memory-optimization`
- 昕力現站：未出現。現站的來源頁 https://www.tpisoftware.com/products/systalk-ai-phison 不在結果中
- 來源：WebSearch（US）`aiDAPTIV SysTalk.ai`。前幾名 https://www.taiwanexcellence.org/en/award/product/1120114 、https://technode.global/prnasia/tpisoftware-unveils-genai-powered-quality-assurance-solution-systalk-audit-and-ai-coaching-platform-systalk-coach/ 、https://www.cio.com.tw/?p=52927

### 地端 AI 伺服器 企業 LLM

- 類型：類別
- 意圖：資訊型帶商業型。前幾名一半是分析文，一半是廠商方案與展會新聞
- 頁面類型：分析文（CIO Taiwan、Meta Intelligence）、廠商產品頁與 datasheet（Nutanix Enterprise AI、Ertas）、新聞與標籤頁（INSIDE、旺得富、癮科技）
- 共同子題：「資料不出公司」的需求、敏感產業（半導體、醫療、金融、政府）、用量大時地端單位成本反超雲端 API、RAG 品質與量化部署、多 GPU 管理與維運、角色權限與稽核
- 前幾名都沒有：伺服器規格與可跑模型大小的對照表（分析文只給一般級距）；軟硬體一起交付、免另外對接；不限 Token 用量。事實庫有 `fact:aiso-servers`、`fact:aiso-use-cases`、`fact:aiso-bundled`、`fact:aiso-hw-sw-integrated`、`fact:aiso-no-token-limit`、`fact:aiso-modules`
- 昕力現站：未出現。WebSearch 的摘要提到 AISO 聯盟（第三方頁面）
- 來源：WebSearch（US）`地端 AI 伺服器 企業 LLM`。前幾名 https://www.cio.com.tw/95907/ 、https://wantrich.chinatimes.com/news/20260527900681-420101 、https://www.meta-intelligence.tech/insight-on-premise-llm-deployment 、https://www.nutanix.com/zh_tw/products/nutanix-enterprise-ai 、https://www.cool3c.com/article/249294

### AI 一體機 企業 地端 交機即用

- 類型：類別
- 意圖：商業型（找可買的一體機），前幾名是各家廠商的產品新聞
- 頁面類型：新聞（工商時報、科技新報、DIGITIMES、遠見、T 客邦）、iThome 新聞稿
- 共同子題：軟硬體預先整合、資料留在企業內、零程式碼的 Agent Builder、雲地混合調度、雲端訂閱費上升促使 AI 移回地端、自建伺服器的維運門檻
- 前幾名都沒有：各機型的規格與適用的知識庫規模；內建的應用模組清單；導入時廠商做哪些工作。事實庫有 `fact:aiso-servers`、`fact:aiso-modules`、`fact:aiso-legal-contract` 等 `/aiso` 頁的 8 個方案、`fact:aiso-onboarding`、`fact:aiso-bundled`。另外：新聞寫 AISO 一體機以 OrientAI 為軟體核心，事實庫的 `aiso-*` 來源頁寫的是 SysTalk.ai 搭配 aiDAPTIV（`fact:aiso-systalk-platform`），`/aiso` 頁要寫哪一套軟體需要先跟現站確認；AI 筆電、「AISO 1」機型不在事實庫
- 昕力現站：未出現。第三方新聞寫到昕力（https://finance.technews.tw/2026/08/17/aiso-1/ 、DIGITIMES）。現站有同主題文章 https://www.tpisoftware.com/blog/ai/why-enterprises-need-ai-appliance （新站 `/blog/why-enterprises-need-ai-appliance`）與新聞 https://www.tpisoftware.com/media-center/575
- 來源：WebSearch（US）`AI 一體機 企業 地端 交機即用`。前幾名 https://www.ctee.com.tw/news/20260921700803-431202 、https://www.ithome.com.tw/pr/178180 、https://finance.technews.tw/2026/08/17/aiso-1/ 、https://www.digitimes.com.tw/tech/dt/n/shwnws.asp?CnlID=13&id=765406 、https://www.techbang.com/posts/129653-nexcom-hp-ai-smes-on-premise

### 主權 AI 是什麼

- 類型：問題
- 意圖：資訊型。前幾名是定義文與影音
- 頁面類型：定義文（roo.cash、OpenText、Oracle 主權 AI 頁）、影音（數位時代）、評論（Substack）、新聞
- 共同子題：定義（不依賴外國基礎設施、供應商與法律管轄）、開發、部署、控制三個面向、與數位主權的關係、國家層級的 GPU 投資（韓國）、台灣的資料在地化討論
- 前幾名都沒有：企業層級（不是國家層級）怎麼做到主權 AI：哪些產業需要、地端部署後由誰導入與維運。前幾名多從國家戰略講。事實庫有 `fact:aiso-industries`、`fact:aiso-local-audit`、`fact:aiso-ecosystem`、`fact:aiso-medical-records`、`fact:aiso-teaching`、`fact:aiso-onboarding`、`fact:systalk-viki-on-prem`。`aiso-100-percent-control`（「100% AI 主控權」）是 `to_confirm`
- 昕力現站：未出現。科技新報的 AISO 新聞（https://technews.tw/2026/03/23/aiso/ ）在結果中
- 來源：WebSearch（US）`主權 AI 是什麼`。前幾名 https://roo.cash/blog/sovereign-ai 、https://www.bnext.com.tw/video/1236 、https://www.oracle.com/tw/cloud/sovereign-ai/ 、https://www.opentext.com/tw/what-is/sovereign-ai 、https://www.ertas.ai/zh-Hant/blog/sovereign-ai-enterprise-guide

### 企業 地端 LLM 建置 成本

- 類型：問題
- 意圖：資訊型（評估成本），帶比較型（地端與雲端）
- 頁面類型：分析文（Meta Intelligence）、顧問公司的成本指南（TechAhead，美元報價）、學術論文（arXiv 的損益平衡分析）、整合商新聞稿（LLM.co）
- 共同子題：地端與雲端 API 的損益平衡點（用量大且穩定時一至兩年反超）、模型大小與 GPU 級距、資料準備與工程人力占成本大宗、先用雲端驗證再地端化
- 前幾名都沒有：台灣在地的方案與報價方式；Token 不計量的成本結構；軟硬體分開採購的時間成本。事實庫有 `fact:aiso-no-token-limit`、`fact:aiso-bundled`、`fact:aiso-hw-sw-integrated`、`fact:aiso-servers`。事實庫沒有價格，不補
- 昕力現站：未出現
- 來源：WebSearch（US）`企業 地端 LLM 建置 成本`。前幾名 https://www.meta-intelligence.tech/insight-on-premise-llm-deployment 、https://techaheadcorp.com/blog/custom-llm-development-cost/ 、https://arxiv.org/html/2509.18101v2 、https://www.barchart.com/story/news/35599170/private-llm-integrator-llm-co-releases-cost-range-estimates-for-custom-hybrid-and-private-llm-deployments

### 生成式 AI 私有化部署 金融業

- 類型：類別（產業）
- 意圖：資訊型。前幾名全是英文的國外廠商內容
- 頁面類型：廠商電子書與部落格（Cohere、ibl.ai、Elastic）、TechCrunch 影音、日本銀行案例新聞（常陽銀行）、研究機構（CB Insights）
- 共同子題：合規與資料主權（SEC、FINRA、DORA、GDPR、歐盟 AI 法案）、部署形式（VPC、地端、氣隙）、延遲與營運連續性、混合架構、理賠與詐欺偵測等用途
- 前幾名都沒有：中文內容；台灣法規（金管會的 AI 指引）；台灣金融機構的導入案例；AI 使用紀錄怎麼留給稽核。事實庫有 `fact:aiso-industries`、`fact:aiso-local-audit`、`fact:digirunner-ai-usage-log`、`fact:systalk-viki-on-prem`。國泰金控簽約加入 AISO（新聞）不在事實庫：`fact:aiso-alliance` 只有現站新聞 559 的標題，簽約內容只在該頁的 Nuxt payload；金管會指引不是本站事實，研究不補
- 昕力現站：未出現
- 來源：WebSearch（US）`生成式 AI 私有化部署 金融業`。前幾名 https://cohere.com/lp/mastering-private-ai-deployments-cohere-ebook 、https://ibl.ai/blog/private-ai-for-financial-services-on-your-own-servers.md 、https://aeo.washinmura.jp/ai/%E6%A0%AA%E5%BC%8F%E4%BC%9A%E7%A4%BE%E3%82%81%E3%81%B6%E3%81%8D%E3%83%95%E3%82%A3%E3%83%8A%E3%83%B3%E3%82%B7%E3%83%A3%E3%83%AB%E3%82%B0%E3%83%AB%E3%83%BC%E3%83%97/en/news/2026-03-26-joyo-4 、https://www.plushcap.com/content/cohere/blog/cohere-6-reasons-banks-opt-for-private-ai-deployments

## GreenSwift 產品頁 `/products/greenswift`

選詞理由：`GreenSwift 碳盤查` 是品牌詞；`碳盤查 平台 系統 推薦`、`產品碳足跡 計算 軟體` 是選型階段的類別詞與比較詞；`CBAM 申報 怎麼做 台灣 出口商`、`ISO 14064-1 碳盤查 步驟`、`產品碳足跡 ISO 14067 怎麼計算`、`碳盤查 費用 中小企業` 是問題型，對應現站 GreenSwift 頁的三個方案（碳盤查、CBAM、碳足跡，`fact:greenswift-plans` 等）。另查了 `溫室氣體排放量 申報 環境部 登錄平台 表單`，結果與台灣無關，不能用（見該條）。觀察日期 2026-11-05，WebSearch（US）。

### GreenSwift 碳盤查

- 類型：品牌
- 意圖：導航型，前幾名全是新聞與新聞稿，滿足的是「這個產品是什麼」的資訊需求
- 頁面類型：新聞（工商時報、鉅亨網、CIO Taiwan、Taiwan News）、iThome 新聞稿、英文新聞稿轉載（Webull）
- 共同子題：SaaS 碳盤查平台、七大溫室氣體、範疇一到三、ISO 14064-1:2018 與 IPCC、AI 推薦排放係數與一鍵生成報告、和鼎營造案例（通過 Bureau Veritas 查證）、嘉南藥理大學人才培訓、越南上市與 MOU
- 前幾名都沒有：方案分別（碳盤查、CBAM、碳足跡）與各方案內容；試用方式與審核時間；可用性 SLA；環保署登錄平台格式的下載。事實庫有 `fact:greenswift-plans`、`fact:greenswift-carbon-plan`、`fact:greenswift-cbam-plan`、`fact:greenswift-footprint-plan`、`fact:greenswift-trial-30-days`、`fact:greenswift-trial`、`fact:greenswift-review-one-day`、`fact:greenswift-sla-99`、`fact:greenswift-epa-format`。和鼎案例收為 `fact:greenswift-case-hedinglong` 與 `fact:client-hedinglong`，只有現站新聞 https://www.tpisoftware.com/media-center/580 的標題（客戶名寫「和鼎隆建築」）；Bureau Veritas 查證不在事實庫。另外：新聞摘要寫報告可產出繁中、英文與越南文，`fact:greenswift-languages` 寫系統支援繁中與英文，兩者不同，越南文要先跟現站確認
- 昕力現站：未出現。現站有同主題新聞 https://www.tpisoftware.com/media-center/449 、https://www.tpisoftware.com/media-center/492 、https://www.tpisoftware.com/media-center/580
- 來源：WebSearch（US）`GreenSwift 碳盤查`。前幾名 https://www.ctee.com.tw/news/20240520701493-431202 、https://www.ithome.com.tw/pr/162975 、https://www.cio.com.tw/2024/12/83616/ 、https://m.cnyes.com/news/id/5819485 、https://www.ithome.com.tw/pr/178664

### 碳盤查 平台 系統 推薦

- 類型：類別（比較）
- 意圖：比較型（「推薦」）。前幾名是英文評比網站與台灣財經社群文，沒有中文的比較表
- 頁面類型：英文評比與列表（FitGap、HashMicro「15 Best」）、財經社群文（列出台灣系統整合商的平台）、SGS 的平台方案頁、Microsoft 文件
- 共同子題：台灣廠商的平台（精誠 Carbon EnVision、倍力碳管家、叡揚 Vital NetZero）、國際平台（Persefoni、Greenly、Watershed、Sphera）、支援的標準（ISO 14064、GHG Protocol）、盤查加能源管理、範疇三的供應商資料蒐集
- 前幾名都沒有：價格或試用方式的比較；外部顧問能不能一起在平台上作業；帳號與組織邊界的數量限制；能否直接匯出環保署登錄格式；不能做什麼（ERP 整合）。事實庫有 `fact:greenswift-trial-30-days`、`fact:greenswift-trial`、`fact:greenswift-consultant-accounts`、`fact:greenswift-consultant-access`、`fact:greenswift-cloud-consultants`、`fact:greenswift-cloud-collaboration`、`fact:greenswift-accounts`、`fact:greenswift-carbon-plan`、`fact:greenswift-epa-format`、`fact:greenswift-no-erp-integration`、`fact:cert-greenswift-aup`
- 昕力現站：未出現。現站有同主題文章 https://www.tpisoftware.com/blog/smartm/greenswiftguide （「中小企業碳盤查系統怎麼選？」），`inventory.csv` 的處置是 `drop`
- 來源：WebSearch（US）`碳盤查 平台 系統 推薦`。前幾名 https://hao.cnyes.com/post/40770 、https://us.fitgap.com//search/carbon-accounting-software 、https://www.hashmicro.com/ph/blog/?p=24506 、https://ticmall.sgs.com/tc/service_details/ba-s-carbon-comprehensive-digital-carbon-management-platform-essential-package

### 產品碳足跡 計算 軟體

- 類型：類別
- 意圖：商業型（找軟體），但前幾名是英文的國外廠商頁、評比目錄與案例新聞，沒有中文的工具頁
- 頁面類型：廠商產品頁（Pilario）、評比目錄（Net Zero Compare、Verdantix）、企業自建工具的新聞（Salzgitter、Lanxess）、定義頁（香港理工大學）、學術論文、台灣環境資訊中心新聞
- 共同子題：生命週期評估（原料到廢棄）、ISO 14067 與 GHG Protocol、一手數據與資料庫次級數據、產品類別的預建模型、第三方驗證
- 前幾名都沒有：中文介面的工具；排放係數（國際與台灣）的自動更新；供應鏈的碳足跡；與組織型碳盤查放在同一個平台。事實庫有 `fact:greenswift-footprint-plan`、`fact:greenswift-scope`、`fact:greenswift-standards`。是否支援 ISO 14067：`greenswift-roadmap-iso14067` 是 `to_confirm`（現站寫「未來還將整合」），不能寫成已支援
- 昕力現站：未出現
- 來源：WebSearch（US）`產品碳足跡 計算 軟體`。前幾名 https://e-info.org.tw/node/80816 、https://www.polyu.edu.hk/ise/ecodesign/product_carbon_footprint_c.html 、https://netzerocompare.com/software/dfge-pcf-software 、https://pilario.com/pcf 、https://atlas.verdantix.com/categories/product-carbon-footprint-software

### 產品碳足跡 ISO 14067 怎麼計算

- 類型：問題
- 意圖：資訊型。前幾名是驗證機構與顧問的教學文
- 頁面類型：教學（DQS 的四階段 LCA 文章、BSI 指南 PDF、GreenSutra 問答）、定義頁（香港理工大學、ClimatePartner、Net Zero Compare）
- 共同子題：LCA 四階段（目標與範圍、清單分析、影響評估、結果解讀）、搖籃到大門與搖籃到墳墓、功能單位、一手與次級數據（ecoinvent、GaBi）、數據品質、ISO 14064-3 查證、ISO 14067:2018 版本
- 前幾名都沒有：台灣的排放係數來源；計算結果怎麼接到 CBAM 申報；用軟體計算時各步驟對應到哪個功能（前幾名建議 SimaPro、openLCA 或委託顧問）。事實庫有 `fact:greenswift-footprint-plan`、`fact:greenswift-cbam-plan`、`fact:greenswift-consulting-partners`。ISO 14067 支援同上一條，`to_confirm`
- 昕力現站：未出現。現站有同主題文章 https://www.tpisoftware.com/blog/smartm/carbonfootprint （新站 `/blog/carbonfootprint`）、https://www.tpisoftware.com/blog/smartm/carbonfootprint-quick-implementation-sme （新站 `/blog/carbonfootprint-quick-implementation-sme`）
- 來源：WebSearch（US）`產品碳足跡 ISO 14067 怎麼計算`。前幾名 https://www.dqsglobal.com/hk/explorations/blog/iso-14067-four-stage-life-cycle-assessment 、https://www.bsigroup.com/globalassets/localfiles/zh-cn/pdf/2023/-iso-14067.pdf 、https://www.polyu.edu.hk/ise/ecodesign/iso14067_c.html 、https://greensutra.in/question/how-to-calculate-product-carbon-footprint/ 、https://www.climatepartner.com/index%2ephp/en/knowledge/glossary/iso-14067

### CBAM 申報 怎麼做 台灣 出口商

- 類型：問題
- 意圖：資訊型。前幾名是新聞、物流商的說明頁與產業刊物
- 頁面類型：新聞（工商時報、天下）、物流商說明頁（DHL）、百科頁（REccessary）、產業刊物（Fastener World 扣件）、學術 PDF
- 共同子題：申報人是歐盟進口商、罰則對象、每季報告的內容（進口數量、直接與間接碳含量、出口國已繳碳價）、2026 年起正式階段要買 CBAM 憑證、適用產品（鋼鐵、鋁、水泥、化肥、電力、氫）、國貿局的專線與說明會、台灣申報筆數
- 前幾名都沒有：出口商用什麼工具整理數據、產出歐盟要的報表格式；組織型盤查與產品碳含量怎麼共用同一份活動數據。多數前幾名是 2023–2024 的資料。事實庫有 `fact:greenswift-cbam-plan`、`fact:greenswift-scope`
- 昕力現站：未出現。現站有同主題文章 https://www.tpisoftware.com/blog/smartm/cbam-carbon-compliance-guide （新站 `/blog/cbam-carbon-compliance-guide`）
- 來源：WebSearch（US）`CBAM 申報 怎麼做 台灣 出口商`。前幾名 https://www.ctee.com.tw/news/20240423700122-431304 、https://www.cw.com.tw/article/5129648 、https://www.dhl.com/discover/zh-tw/logistics-advice/import-export-advice/how-the-eu-cbam-impacts-taiwan-businesses 、https://www.reccessary.com/zh-tw/reccpedia/eu-carbon-border-adjustment-mechanism 、https://fastener-world.com/en/article/8711.html

### ISO 14064-1 碳盤查 步驟

- 類型：問題
- 意圖：資訊型。前幾名是步驟說明與機關、學校的作業規劃
- 頁面類型：新聞與說明（REccessary）、大學校刊與作業規劃（淡江、海洋大學）、政府機關手冊 PDF（國土管理署）、會計師事務所文章（EY）、查證機構頁（IDFL）
- 共同子題：五步驟（邊界、排放源鑑別、數據收集與計算、報告、第三方查證）、組織邊界的控制權法與股權法、範疇三是否納入、類別二到六的重大性評估、ISO 14064-1:2018 與 CNS 14064-1:2021、與 GHG Protocol 的差別
- 前幾名都沒有：用系統做盤查時每一步怎麼做；GHG Protocol 與 ISO 14064-1 能不能在同一套工具切換；全球暖化潛勢（GWP）版本的切換；盤查清冊的產出內容。事實庫有 `fact:greenswift-six-steps`、`fact:greenswift-categories`、`fact:greenswift-standards`、`fact:greenswift-gwp-switch`、`fact:greenswift-inventory-output`、`fact:greenswift-report-method`
- 昕力現站：未出現
- 來源：WebSearch（US）`ISO 14064-1 碳盤查 步驟`。前幾名 https://www.reccessary.com/zh-tw/news/carbon-footprint-verification 、https://tkutimes.tku.edu.tw/fpdf/56197.pdf 、https://usrsdg.ntou.edu.tw/p/450-1103-98735,c0.php?Lang=en 、https://www.nlma.gov.tw/uploads/files/077692af23bbfa3af2d22aa36a01d30f.pdf 、https://www.ey.com/zh_tw/insights/performance-improvement/carbon-management-iso-standards

### 碳盤查 費用 中小企業

- 類型：問題
- 意圖：資訊型帶商業型（想知道要花多少），前幾名沒有公開的費用標準
- 頁面類型：財經與商業媒體報導（工商時報、數位時代、天下、商業周刊、遠見）、會計師事務所新聞（Crowe）
- 共同子題：實體查驗的價格區間與數位方案的報價（業者說法）、工總的自我宣告方案、中小企業尚未被強制盤查、供應鏈與外銷要求才是主要推力、碳費、成本難轉嫁
- 前幾名都沒有：SaaS 訂閱的費用結構；試用方式；顧問輔導與平台怎麼分工。事實庫有 `fact:greenswift-trial-30-days`、`fact:greenswift-trial`、`fact:greenswift-review-one-day`、`fact:greenswift-consulting-partners`、`fact:greenswift-cloud-consultants`、`fact:greenswift-plans`。事實庫沒有價格，不補
- 昕力現站：未出現。現站有同主題文章 https://www.tpisoftware.com/blog/smartm/carboninventory-qa （「中小企業如何快速落實碳盤查？」）與白皮書 https://www.tpisoftware.com/whitepaper/greenswift ；該文章 `inventory.csv` 的處置是 `drop`
- 來源：WebSearch（US）`碳盤查 費用 中小企業`。前幾名 https://ctee.com.tw/news/policy/730656.html 、https://www.bnext.com.tw/article/80226/carbon-footprint-verification-tw 、https://www.crowe.com/tw/news/news-article_20250819 、https://www.businessweekly.com.tw/carbon-reduction/indep/1004585 、https://www.gvm.com.tw/article/89957

### 溫室氣體排放量 申報 環境部 登錄平台 表單（結果不能用）

- 類型：問題
- 意圖：無法判斷。結果跟台灣現行申報幾乎無關：第一筆是 105 年已廢止的《溫室氣體排放量申報管理辦法》舊版條文，其餘是一份無關的報名表與法國、加拿大、以色列、北愛爾蘭的申報頁
- 前幾名都沒有：不判斷。這組查詢對應 `fact:greenswift-epa-format`（一鍵下載環保署登錄平台表單格式 3.0.0），之後在別的環境重查
- 昕力現站：未出現
- 來源：WebSearch（US）`溫室氣體排放量 申報 環境部 登錄平台 表單`。前幾筆 https://6laws.net/6law/law3/溫室氣體排放量申報管理辦法.htm 、https://www.canada.ca/en/environment-climate-change/services/climate-change/greenhouse-gas-emissions/facility-reporting/reporting/instructions.html

## DigiLism 產品家族 `/products/digilism`

選詞理由：`DigiLism`、`DigiLism 昕力` 是品牌詞；`企業服務中台`（現站頁面標題「DigiLism 企業服務中台」）、`iPaaS 平台 台灣`（`fact:digilism-ipaas`）是類別詞；`ESB 替代 微服務 架構`、`中台 是什麼 業務中台 技術中台` 是問題型；`銀行 核心系統 現代化 大型主機 微服務` 對應主要受眾的產業與 `fact:digilism-protocol-integration`。首頁一節已查過的 `企業數位轉型 軟體公司` 不重查。觀察日期 2026-11-05，WebSearch（US）。

### DigiLism

- 類型：品牌
- 意圖：導航型。但結果被同拼法或近似拼法的無關主題佔滿（Digitalism 樂團、藝術運動、印度網站設計公司）
- 頁面類型：維基百科、藝術家頁、公司名錄、論文
- 共同子題：無（與昕力無關）
- 前幾名都沒有：所有跟產品有關的子題，最基本的是「DigiLism 是企業服務中台／iPaaS 產品系列」這個類別說明。事實庫有 `fact:digilism-solution-areas`、`fact:digilism-ipaas`、`fact:digilism-bfsi`
- 昕力現站：未出現
- 來源：WebSearch（US）`DigiLism`。前幾名 https://en.wikipedia.org/wiki/Digitalism 、https://en.wikipedia.org/wiki/Digitality 、https://d7leadfinder.com/app/prospector/11765000/52fd04612c6657fc580b9f278da1c635/

### DigiLism 昕力

- 類型：品牌
- 意圖：導航型。結果有昕力的公司新聞，但沒有一筆提到 DigiLism；WebSearch 的摘要也無法確認 DigiLism 是昕力的產品
- 頁面類型：財經新聞（鉅亨網）、iThome 新聞稿（FT 亞太高成長企業）、數位時代作者頁、無關公司頁
- 共同子題：昕力的四條產品線、營收、醫療 AI、越南子公司、GreenSwift
- 前幾名都沒有：DigiLism 是什麼與底下有哪些產品；專利與認證。事實庫有 `fact:digilism-family-digirunner`、`fact:digilism-family-digimars`、`fact:digilism-family-digiflexis`、`fact:digilism-family-digicare`、`fact:digilism-patents-7`、`fact:cert-iso27001-product-platform`（digiLogs 的家族描述 `digilism-family-digilogs` 是 `to_confirm`）。另外：`aiDAPTIV SysTalk.ai` 結果中的台灣精品獎英文頁把昕力的整合平台寫成舊名 DigiFusion，現站 `/products/digifusion` 轉到 `/products/digilism`；改名經過不在事實庫，要寫得先從現站收
- 昕力現站：未出現。現站英文新聞 https://www.tpisoftware.com/en/media-center/512 標題有「iPaaS Middle Platform DigiLism」，不在結果中
- 來源：WebSearch（US）`DigiLism 昕力`。前幾名 https://www.ithome.com.tw/pr/161970 、https://m.cnyes.com/news/id/6116531 、https://www.bnext.com.tw/author/3036

### 企業服務中台

- 類型：類別
- 意圖：資訊型。結果沒有直接定義這個詞，多是英文的 Enterprise Service Management（ESM）與中國的開源專案
- 頁面類型：英文說明與列表（Kohezion、Item、Cleverence、Hexaware）、Gitee 開源專案、2020 年 Red Hat 論壇報導（科技新報）、華為頁
- 共同子題：「大中台、小前台」、整合 CRM、ERP 資料讓前台調用、ESM 的服務目錄、企業平台是數位轉型的基礎
- 前幾名都沒有：台灣廠商的中台產品；中台實際包含哪些模組（API、日誌、身分驗證、流程）；部署環境（地端、雲端、混合）；金融、保險的使用情境。事實庫有 `fact:digilism-solution-areas`、`fact:digilism-five-capabilities`、`fact:digilism-bfsi`、`fact:digilism-ipaas`、`fact:digilism-system-integration`、`fact:digilism-auth-module`、`fact:digilism-log-audit`
- 昕力現站：未出現
- 來源：WebSearch（US）`企業服務中台`。前幾名 https://gitee.com/kephi/enterprise_MidPlat 、https://kohezion.com/blog/enterprise-service-management 、https://technews.tw/2020/11/09/2020-red-hat-forum/ 、https://hexaware.com/blogs/why-enterprise-platform-services-matter-in-digital-transformation-the-backbone-of-modern-business-agility/

### iPaaS 平台 台灣

- 類型：類別
- 意圖：商業型（找廠商），但前幾名幾乎全是市調報告的銷售頁，沒有台灣廠商
- 頁面類型：市調報告頁（GII 多份）、國外廠商頁（Deposco、Xurrent）、騰訊雲文件
- 共同子題：全球市場規模與成長率、iPaaS 定義（串接地端與雲端的應用與資料）、主要廠商（Boomi、Informatica、MuleSoft、Microsoft、Oracle、IBM、SAP）
- 前幾名都沒有：台灣廠商；可以裝在地端或混合環境的 iPaaS（定義多半限定雲端服務）；金融、保險的適用情境；接傳統 ESB 的做法。事實庫有 `fact:digilism-ipaas`、`fact:digilism-bfsi`、`fact:digilism-compatibility`、`fact:digilism-system-integration`、`fact:digilism-protocol-integration`
- 昕力現站：未出現
- 來源：WebSearch（US）`iPaaS 平台 台灣`。前幾名 https://www.gii.tw/report/gis1650368-integration-platform-service-market-analysis.html 、https://gii.tw/report/kbv1586954-global-integration-platform-service-market-size.html 、https://www.xurrent.com/help/ipaas 、https://tencentcloud.com/document/product/1165/51570

### ESB 替代 微服務 架構

- 類型：問題
- 意圖：資訊型。前幾名全是英文的白皮書、技術書與技術媒體
- 頁面類型：白皮書（Pivotal）、技術書章節（Packt）、技術媒體（The New Stack、DZone）、研討會議程、廠商部落格（Axiata Digital Labs）
- 共同子題：「智慧端點、啞管道」與 ESB 的設計衝突、ESB 成為瓶頸與單點故障、五步驟漸進遷移（先共存）、API Gateway 與服務網格接手部分功能
- 前幾名都沒有：中文內容；核心銀行系統與大型主機的資料轉換、通訊協定轉換怎麼處理；可直接替代 ESB 的產品與它的高可用做法。事實庫有 `fact:digilism-protocol-integration`、`fact:digilism-compatibility`、`fact:digilism-api-first`、`fact:digilism-microservice-framework`、`fact:digilism-system-integration`、`fact:digilism-patent-load-balancing`
- 昕力現站：未出現
- 來源：WebSearch（US）`ESB 替代 微服務 架構`。前幾名 https://content.pivotal.io/white-papers/migrating-an-esb-to-a-cloud-native-platform 、https://subscription.packtpub.com/book/programming/9781789532364/16/ch16lvl1sec122/transformation-of-the-esb 、https://thenewstack.io/esb-migration-qa/ 、https://dzone.com/articles/is-enterprise-service-bus-esb-obsolete-after-micro

### 中台 是什麼 業務中台 技術中台

- 類型：問題
- 意圖：資訊型。前幾名是概念說明，簡體中文來源多
- 頁面類型：技術社群文章（iT 邦幫忙）、簡體中文產品經理網站（人人都是產品經理）、百科（實在智能）、英文 Medium 與分析文、股票資訊站
- 共同子題：阿里巴巴「大中台、小前台」的由來、共享與解耦、業務中台（用戶、訂單中心）與技術中台（微服務框架、DevOps、容器雲）、數據中台與 AI 中台、中台的爭議（邊界不清、組織阻力、成本中心）
- 前幾名都沒有：台灣企業（特別是金融、醫療）的中台案例；技術中台做成產品後包含哪些能力；專利與資安認證。事實庫有 `fact:digilism-solution-areas`、`fact:digilism-five-capabilities`、`fact:digilism-microservice-framework`、`fact:digilism-patents-7`、`fact:cert-iso27001-product-platform`、`fact:digicare-fhir-core`
- 昕力現站：未出現。現站有同主題文章 https://www.tpisoftware.com/blog/dx/healthcare-fhir-data-platform-7-steps （新站 `/blog/healthcare-fhir-data-platform-7-steps`，醫療的數據中台）
- 來源：WebSearch（US）`中台 是什麼 業務中台 技術中台`。前幾名 https://ithelp.ithome.com.tw/articles/10260521 、https://www.woshipm.com/it/4247080.html 、https://www.ai-indeed.com/encyclopedia/15661.html 、https://www.besthub.dev/articles/is-the-mid-platform-really-the-answer-to-enterprise-complexity-8b165c3f3ac5

### 銀行 核心系統 現代化 大型主機 微服務

- 類型：類別（產業）
- 意圖：資訊型。前幾名是台灣與海外的案例新聞及國外廠商白皮書
- 頁面類型：新聞（iThome 國泰世華核心現代化、Outlook Money SBI、The Asian Banker）、國外廠商白皮書與部落格（Zafin、Temenos、Red Hat、Ksolves）
- 共同子題：漸進式現代化而非一次替換、大型主機與微服務並存、以中台服務逐步瘦身核心（國泰世華）、外部化周邊功能、Kubernetes 拆分單體
- 前幾名都沒有：處理大型主機資料轉換與通訊機制變更的中介產品；與傳統 ESB 的介接；維運端的日誌集中與追查。事實庫有 `fact:digilism-protocol-integration`、`fact:digilism-compatibility`、`fact:digilism-system-integration`、`fact:digilism-microservice-framework`、`fact:digilogs-case-bank-path-map`。昕力的銀行核心案例不在 DigiLism 的事實裡；現站新聞 https://www.tpisoftware.com/media-center/420 寫的是保險核心系統（InsureBrick），要用得先收
- 昕力現站：未出現
- 來源：WebSearch（US）`銀行 核心系統 現代化 大型主機 微服務`。前幾名 https://www.ithome.com.tw/news/164534 、https://www.outlookmoney.com/amp/story/banking/sbi-outlines-two-year-plan-to-modernise-core-banking-systems 、https://www.theasianbanker.com/updates-and-articles/banks-shift-to-microservices-and-modernise-core-for-agility-tabinsights 、https://zafin.com/insights/banking-blueprints/white-paper-and-reports/modernize-what-matters-a-pragmatic-blueprint-for-core-banking-system-transformation/ 、https://www.ksolves.com/blog/microservices/banks-use-kubernetes-microservices-to-modernize-core-apis

## 跨頁的觀察

- 試點三頁的 24 組查詢裡，`www.tpisoftware.com` 與 `www.tpisoftware.vn` 都沒有出現，品牌詞（`昕力資訊`、`TPIsoftware`、`昕力資訊 官網`、`digiRunner`）也一樣。這是 WebSearch（US）的結果，台灣地區的排名可能不同；可能的原因之一是 `seo-baseline.md`「站層級」寫的 `.com` 沒有可用的 sitemap
- 品牌詞的前幾名由新聞、評論平台（Gartner、G2、GetApp）、AWS Marketplace 佔據
- `digiRunner` 單獨查詢時跟同名遊戲撞名，要加上「API」才有產品結果
- 問題型與類別型的查詢，前幾名大多是雲端廠商（AWS、Google Cloud、Microsoft）的定義文與 iT 邦幫忙的技術文章
- 比較型的查詢（API 管理平台比較、Kong 替代、開源 Gateway）幾乎都是英文或簡中的廠商比較文，沒有繁中的比較文
- 開放銀行的查詢，繁中來源停在 2019 年前後的新聞；`API 管理 金融業` 的 iThome 新聞提到財金公司修訂的 Open API 資安規範
- 現站有承接這些問題型查詢的舊文章（`/blog/smartm/api-gateway-ch`、`/blog/smartm/open-banking-api-platform`、`/blog/smartm/apim-openbanking`、`/blog/dx/openfinance-api`、`/blog/ai/implementationguide`），`inventory.csv` 的處置都是 `drop`（2026-01-01 前的 blog 不遷移）
- 第一批 7 頁的 52 組查詢（AI 產品線四頁 29 組、AISO、GreenSwift、DigiLism 三頁 23 組）裡，`www.tpisoftware.com` 一樣都沒有出現，品牌詞（`OrientAI`、`SysTalk.ai`、`AISO 主權 AI`、`GreenSwift 碳盤查`、`DigiLism`）的前幾名是新聞與新聞稿；現站同主題的新聞（`/media-center/559`、`/media-center/580`）也不在結果中。`SysTalk.ai` 的結果有 `tpi-website.azurewebsites.net` 的舊產品頁
- 英文品牌名容易撞名：`DigiLism` 的前幾名被 Digitalism 樂團、藝術運動等無關主題佔滿，`OrientAI`、`SysTalk.ai` 也混了同名或相近名稱的產品
- 第一批 7 頁的類別與問題型查詢，有 6 組的前幾名寫明全是英文或沒有中文內容（`醫療理賠 診斷書 OCR 辨識`、`ICR OCR 差別`、`AI Agent 治理 影子 AI 企業`、`MCP 企業 導入 AI Agent 整合`、`生成式 AI 私有化部署 金融業`、`ESB 替代 微服務 架構`），其他多組也以英文來源為主；「前幾名都沒有」多是繁中說明與台灣的情境（醫療單據、金融法規、高監管產業）

## 對應到頁面

以下是推論，不是觀察。每組查詢由新站哪一頁承接，交給 `seo-strategist` 在策略階段確認。路徑取自 `docs/ia/nodes.csv`。前 24 列是試點三頁的查詢，其後是第一批 7 頁（結果不能用的 1 組不列）。「理由」寫「#199 brief 定案」的列，由該頁 brief 的「搜尋意圖」與「取捨」定案；「沒有主要承接頁」表示列出的頁只是次要承接。

| 查詢 | 建議承接頁 | 理由 |
|---|---|---|
| 昕力資訊 | `/` | 品牌導航 |
| TPIsoftware | `/`（en 為 `/en`） | 品牌導航；英文品牌名的結果偏海外 |
| 昕力資訊 官網 | `/` | 品牌導航 |
| 企業數位轉型 軟體公司 | 次要 `/`、`/products/digilism`，沒有主要承接頁（#186，`briefs/home.md`「取捨」第 14 項） | 類別詞，前幾名是定義文、國際廠商頁與新聞，沒有廠商列表；首頁 title 不放類別詞 |
| 台灣 AI 解決方案 公司 | 次要 `/`、`/products/systalk-ai`，沒有主要承接頁（#186，`briefs/home.md`「取捨」第 14 項） | 類別詞，前幾名沒有廠商列表；首頁 title 不放類別詞 |
| 企業 AI 導入 | `/blog/enterprise-ai-adoption`（文章，#173） | 前幾名是指南與教學，產品頁或首頁不符合資訊型意圖；現站同主題文章是 `drop`，#173 新寫一篇（`briefs/blog-enterprise-ai-adoption.md`） |
| 系統整合 廠商 推薦 | `/cloudservice`（次要承接） | 比較型，結果是列表文；新站沒有對應的比較頁。原本建議的 `/services` 依 #138 不產生頁面，策略階段改交 `/cloudservice`，`/services` 建出後再改回（`briefs/home.md`「取捨」第 6 項） |
| 企業主權 AI 地端部署 方案 | `/aiso`，次要 `/`、`/products/systalk-ai`、`/orient-ai` | #199 brief 定案（`briefs/aiso.md`「搜尋意圖」）。承接頁不變。#199 使用者決定 `/products/systalk-ai-phison` 不是 AISO 後：前幾名缺的內建方案在 `/aiso`；硬體規格與 Token 成本的事實（`fact:aiso-servers`、`fact:aiso-no-token-limit`）出自該頁，改在次要的 `/products/systalk-ai` |
| digiRunner | `/products/digirunner` | 品牌導航 |
| digiRunner API 管理平台 | `/products/digirunner`，次要 `/products/digirunner-cloud` | 前幾名有 AWS Marketplace，雲端版是 `digirunner-cloud` 節點 |
| API 管理平台 | `/products/digirunner` | 類別詞；結果是定義文，產品頁要能回答「API 管理平台包含什麼」才接得住 |
| API Gateway 是什麼 | `/blog/what-is-api-gateway`（文章，#173） | 資訊型，前幾名是教學；現站同主題文章是 `drop`，#173 新寫一篇（`briefs/blog-what-is-api-gateway.md`） |
| API 管理 金融業 | `/industries/finance`，次要 `/products/digirunner` | 產業加類別；結果涵蓋台灣金融法規 |
| API 管理平台 比較 | `/products/digirunner` | 比較型；新站沒有比較頁，是否新增由策略決定 |
| Kong 替代方案 API Gateway | `/products/digirunner` | 比較型；同上 |
| 開源 API Gateway 推薦 | `/products/digirunner` | 比較型；digiRunner 開源版目前在新站沒有獨立節點 |
| 金融業 數位轉型 | `/industries/finance` | 產業類別詞 |
| 開放銀行 API | `/industries/finance` | `industry-finance` 節點承接現站 `/products/open-banking` |
| 台灣 開放銀行 第三方業者 API 金管會 | `/industries/finance`，或 `/blog/{slug}` | 資訊型，產業頁要不要寫台灣制度由策略決定 |
| 銀行 API 平台 | `/industries/finance`，次要 `/products/digirunner` | 產業與產品的交集 |
| 金融科技 解決方案 台灣 | `/industries/finance` | 產業類別詞 |
| 保險科技 AI 理賠 | `/solutions/smartclaim`，次要 `/industries/finance` | #199 brief 定案（`briefs/smartclaim.md`「搜尋意圖」）。前幾名多是車險，smartclaim 回答醫療理賠文件辨識 |
| 金融業 AI 應用 | `/industries/finance` | 產業類別詞 |
| 昕力資訊 金融 | `/industries/finance` | 品牌加產業 |
| 昕力 智能理賠 | `/solutions/smartclaim` | #199 brief 定案（`briefs/smartclaim.md`）。前幾名是金漾獎與技術的新聞，頁面有獎項證據點與 NLP、RPA 段落 |
| AI 智能理賠 解決方案 | `/solutions/smartclaim` | #199 brief 定案。商業型，節點名稱就是這組詞 |
| 醫療理賠 診斷書 OCR 辨識 | `/solutions/smartclaim`，次要 `/products/systalk-icr` | #199 brief 定案。理賠情境在 smartclaim，辨識技術在 ICR（`briefs/smartclaim.md`「取捨」第 9 項） |
| 保險理賠 RPA 自動化 | `/solutions/smartclaim`，次要 `/products/systalk-rpa` | #199 brief 定案。smartclaim 把文件辨識與 RPA 寫在同一條理賠流程 |
| 保險理賠流程 如何自動化 | 沒有主要承接頁；次要 `/solutions/smartclaim`，不寫文章 | #199 brief 定案（`briefs/smartclaim.md`「取捨」第 12 項）。前幾名的通用步驟不是昕力的事實；頁面回答前幾名缺的醫療文件與模型再訓練 |
| 壽險 理賠 AI 案例 台灣 | 沒有主要承接頁；次要 `/solutions/smartclaim`、`/industries/finance` | #199 brief 定案。沒有具名的理賠客戶案例，接不住「案例」（`briefs/smartclaim.md`「待確認」第 2 項） |
| 保險 理賠 NLP 自然語言處理 應用 | `/solutions/smartclaim` | #199 brief 定案。前幾名全英文，smartclaim 寫自研 NLP 解析診斷書 |
| 昕力 智慧建檔 SysTalk.ICR | `/solutions/smartfilling`，次要 `/products/systalk-icr` | #199 brief 定案（`briefs/smartfilling.md`「取捨」第 4 項）。「智慧建檔」是 smartfilling 的詞 |
| AI OCR 文件辨識 自動建檔 | `/solutions/smartfilling` | #199 brief 定案。商業型，建檔作業是 smartfilling 的主題 |
| 免模板 OCR 辨識 | `/products/systalk-icr`，次要 `/solutions/smartfilling` | #199 brief 定案（`briefs/smartfilling.md`「取捨」第 4 項）。辨識技術的查詢給 ICR |
| ICR OCR 差別 | 沒有主要承接頁（建議寫 blog 文章）；次要 `/products/systalk-icr` | #199 brief 定案（`briefs/smartfilling.md`「取捨」第 9 項）。文章只建議，另開 issue |
| 智慧文件處理 IDP 是什麼 | 沒有主要承接頁（建議寫 blog 文章，與上一列同一篇）；次要 `/solutions/smartfilling` | #199 brief 定案（`briefs/smartfilling.md`「取捨」第 9 項）。定義型，產品頁不寫定義 |
| 銀行 文件 數位化 手寫 辨識 開戶 申請書 | 沒有主要承接頁；次要 `/solutions/smartfilling`、`/industries/finance` | #199 brief 定案。smartfilling 的金融業案例是二登流程，原文沒寫開戶 |
| OCR 辨識率 提升 模型 再訓練 | 沒有主要承接頁；次要 `/solutions/smartfilling` | #199 brief 定案。讀者偏工程師；SysTalk.PUZZLE 再訓練的原文在 smartfilling |
| SysTalk.ai | `/products/systalk-ai` | #199 brief 定案（`briefs/systalk-ai.md`）。品牌導航 |
| SysTalk 昕力 AI 產品 | `/products/systalk-ai` | #199 brief 定案。hub 第 2 段是各產品分工的整理 |
| AI 智能客服 推薦 台灣 企業 | `/products/systalk-chat`，次要 `/products/systalk-ai` | #199 brief 定案（`briefs/systalk-ai.md`「取捨」第 11 項）。節點備註指現站 `/genai-solution` 併入 `systalk-chat`，`systalk-chat` 本身產生頁面 |
| AI 語音質檢 客服中心 | `/products/systalk-audit`，次要 `/products/systalk-ai` | #199 brief 定案。子產品類別詞，hub 第 2 段連過去 |
| AI 業務培訓 對練 保險 | `/products/systalk-coach`，次要 `/products/systalk-ai` | #199 brief 定案。子產品類別詞，hub 第 2 段連過去 |
| 企業 生成式 AI 平台 地端部署 RAG | `/products/systalk-viki`，次要 `/products/systalk-ai` | #199 brief 定案。RAG 與模組在 hub 第 5 段；`/aiso` 不寫模組清單（`briefs/aiso.md`「取捨」第 2 項），不列為次要 |
| AI 客服機器人 怎麼選 | 沒有主要承接頁；次要 `/products/systalk-chat`，不寫文章 | #199 brief 定案（`briefs/systalk-ai.md`「取捨」第 11 項）。前幾名已有繁中選購指南，產品比較的事實沒有 |
| OrientAI | `/orient-ai` | #199 brief 定案（`briefs/orient-ai.md`）。品牌導航；title 與 h1 用節點名，產品名跟類別詞並列，跟同名產品分開 |
| OrientAI 昕力 群聯 Agentic AI | `/orient-ai`，次要 `/aiso` | #199 brief 定案。`/orient-ai` 回答 aiDAPTIV 的作用與資料是否離開企業；新聞的合作說法不寫 |
| 企業級 Agentic AI 平台 | `/orient-ai` | #199 brief 定案。節點名稱就是這組詞 |
| Agentic AI 是什麼 | `/blog/what-is-agentic-ai-platform`，次要 `/orient-ai` | #199 brief 定案（`briefs/orient-ai.md`「取捨」第 10 項）。新站已有這篇，不另寫；`/orient-ai` 第 9 段列出它 |
| AI Agent 治理 影子 AI 企業 | `/orient-ai` | #199 brief 定案。前幾名全英文；`/orient-ai` 把治理寫成平台功能 |
| 多代理協作 AI Agent 平台 企業 導入 | `/orient-ai` | #199 brief 定案。`/orient-ai` 寫 Agent 跨企業內部系統執行任務 |
| AI Agent 地端部署 Token 成本 | `/orient-ai`，次要 `/aiso`、`/products/systalk-ai`，`/blog/ai-token-cost-management` 輔助 | #199 brief 定案（`briefs/orient-ai.md`「取捨」第 11 項、`briefs/aiso.md`「取捨」第 11 項）。部門層級的用量監控在 `/orient-ai`。#199 使用者決定：「不限 Token」（`fact:aiso-no-token-limit`）出自 `/products/systalk-ai-phison`，改由 `/products/systalk-ai` 次要承接；`/aiso` 留第 4 段的分層用量上限 |
| MCP 企業 導入 AI Agent 整合 | 沒有主要承接頁（建議寫 blog 文章）；次要 `/orient-ai` | #199 brief 定案（`briefs/orient-ai.md`「取捨」第 10 項）。前幾名全英文；文章只建議，另開 issue |
| AISO 主權 AI | `/aiso` | #199 brief 定案（`briefs/aiso.md`）。品牌詞，就是這一頁的名稱 |
| 昕力 群聯 AISO 聯盟 | `/aiso`，次要 `/media-center/559` | #199 brief 定案（`briefs/aiso.md`「取捨」第 12 項）。查的是合作與方案，`/aiso` 講方案本身；聯盟的成立、成員與簽約由新站已有的新聞 559 承接，`/aiso` 第 3 段連過去 |
| aiDAPTIV SysTalk.ai | `/products/systalk-ai` | #199 brief 定案。AISO 的軟體是 OrientAI（`messaging.md`「缺少證據的主張」第 17 項已結算），SysTalk.ai 搭配 aiDAPTIV 是併入 `/products/systalk-ai` 的另一個方案（現站 `/products/systalk-ai-phison`），所以 `/aiso` 不寫 SysTalk.ai，這組改由 `/products/systalk-ai` 承接。#199 使用者決定該頁的事實全部由 `/products/systalk-ai` 承接後，前幾名缺的規格、模型與模組都在那頁（第 5、6 段） |
| 地端 AI 伺服器 企業 LLM | `/products/systalk-ai`，次要 `/aiso` | #199 brief 定案（seo-strategist 複核同意；hub 的 title 加「地端一體機」，`/aiso` 的 title 與第 5 段 h2 不用「AI 伺服器」）。#199 使用者決定（PR #204，2026-11-05）：`/products/systalk-ai-phison` 講的不是 AISO，前幾名缺的規格與模型大小對照、軟硬體一起交付（`fact:aiso-servers`、`fact:aiso-bundled`）都出自該頁，改由 `/products/systalk-ai` 第 6 段主要承接（`briefs/systalk-ai.md`「取捨」第 7 項）。原本是 `/aiso`；`/aiso` 留第 5 段的 OrientAI 硬體建議，次要 |
| AI 一體機 企業 地端 交機即用 | `/products/systalk-ai`，次要 `/aiso`，`/blog/why-enterprises-need-ai-appliance` 輔助 | #199 brief 定案（seo-strategist 複核同意；hub 的 title 用「地端一體機」，`/aiso` 的 title 與 `/orient-ai` 連到 `/aiso` 的錨點都不用「一體機」）。#199 使用者決定（PR #204，2026-11-05）：前幾名缺的機型規格與知識庫規模、導入時廠商做的工作（`fact:aiso-servers`、`fact:aiso-onboarding`）出自 `/products/systalk-ai-phison`，改由 `/products/systalk-ai` 第 6 段主要承接（`briefs/aiso.md`「取捨」第 11 項）。原本是 `/aiso`；`/aiso` 的部門方案清單與硬體建議次要承接；問「為什麼需要」的交給文章 |
| 主權 AI 是什麼 | 沒有主要承接頁（建議寫企業層級的 blog 文章）；次要 `/aiso` | #199 brief 定案（`briefs/aiso.md`「取捨」第 7 項）。前幾名從國家層級講；文章只建議，另開 issue |
| 企業 地端 LLM 建置 成本 | 沒有主要承接頁；次要 `/products/systalk-ai` | #199 brief 定案（seo-strategist 複核同意）。#199 使用者決定（PR #204，2026-11-05）：成本結構的事實（不限 Token、硬體內建軟體，`fact:aiso-no-token-limit`、`fact:aiso-bundled`）出自 `/products/systalk-ai-phison`，次要承接從 `/aiso` 改成 `/products/systalk-ai`（第 3、6 段）。沒有價格事實，只談成本結構 |
| 生成式 AI 私有化部署 金融業 | `/industries/finance`，次要 `/aiso` | #199 brief 定案（`/aiso` 一側）。產業詞由產業頁承接 |
| GreenSwift 碳盤查 | `/products/greenswift` | #199 brief 定案（`briefs/greenswift.md`）。品牌詞 |
| 碳盤查 平台 系統 推薦 | `/products/greenswift` | #199 brief 定案。比較型，頁面寫選平台時會比的條件（試用、顧問協作、帳號限制、環保署格式），不做比較表 |
| 產品碳足跡 計算 軟體 | `/products/greenswift` | #199 brief 定案（`briefs/greenswift.md`「取捨」第 9 項）。用碳足跡方案承接，不用 ISO 14067 |
| 產品碳足跡 ISO 14067 怎麼計算 | `/blog/carbonfootprint-quick-implementation-sme`，次要 `/blog/carbonfootprint` | #199 brief 定案（`briefs/greenswift.md`「取捨」第 12 項）。前者有計算步驟；產品頁第 10 段連過去 |
| CBAM 申報 怎麼做 台灣 出口商 | `/blog/cbam-carbon-compliance-guide`，次要 `/products/greenswift` | #199 brief 定案。教學型問題由文章承接，產品頁承接 CBAM 方案 |
| ISO 14064-1 碳盤查 步驟 | `/products/greenswift`，`/blog/what-is-scope3` 輔助 | #199 brief 定案。`/whitepaper/greenswift` 依 #138 不產生頁面，由產品頁的六大步驟段落承接 |
| 碳盤查 費用 中小企業 | 沒有主要承接頁；次要 `/products/greenswift` | #199 brief 定案（`briefs/greenswift.md`「取捨」第 11 項）。`/whitepaper/greenswift` 不產生頁面，事實庫沒有價格 |
| DigiLism | `/products/digilism` | #199 brief 定案（`briefs/digilism.md`）。品牌詞撞名，h1 與 title 讓 DigiLism 跟「企業服務中台」並列 |
| DigiLism 昕力 | `/products/digilism` | #199 brief 定案。品牌詞，缺產品家族說明 |
| 企業服務中台 | `/products/digilism` | #199 brief 定案。h1 就是「DigiLism 企業服務中台」 |
| iPaaS 平台 台灣 | `/products/digilism` | #199 brief 定案。`digilism-ipaas` 直接對應，前幾名沒有台灣廠商 |
| ESB 替代 微服務 架構 | `/products/digilism` | #199 brief 定案。替代 ESB 是 `digilism-protocol-integration` 的內容；通用遷移步驟建議寫文章（與下一列同一篇） |
| 中台 是什麼 業務中台 技術中台 | 沒有主要承接頁（建議寫 blog 文章，分類 `blog-digital-transformation`）；次要 `/products/digilism` | #199 brief 定案（`briefs/digilism.md`「建議新增」）。定義型，hub 只能接「中台包含什麼」 |
| 銀行 核心系統 現代化 大型主機 微服務 | `/industries/finance`，次要 `/products/digilism` | #199 brief 定案（`/products/digilism` 一側）。產業詞由產業頁承接；兩頁互相連結（`briefs/digilism.md`「取捨」第 10 項） |

待 `seo-strategist` 決定的事：

前三項在 #165 決定，見 `briefs/digirunner.md`「取捨」的「三件待決事項」。第一批 7 頁的條目在 #199 的 brief 決定，下面寫決定在哪裡。全部條目都已決定。

- 已決定（#165）：資訊型查詢（`企業 AI 導入`、`API Gateway 是什麼`、台灣開放銀行制度）用 blog 文章承接；比較型查詢不新增比較頁；digiRunner 開源版不開頁面
- 已決定（#199）：第一批 7 頁的定義型與教學型查詢。建議寫 3 篇 blog 文章，都只建議、另開 issue：ICR、OCR 與 IDP 一篇（`ICR OCR 差別`、`智慧文件處理 IDP 是什麼`，`briefs/smartfilling.md`「取捨」第 9 項）；企業層級的主權 AI 一篇（`主權 AI 是什麼`，`briefs/aiso.md`「取捨」第 7 項）；中台與 ESB 一篇（`中台 是什麼 業務中台 技術中台`、`ESB 替代 微服務 架構` 的通用部分，`briefs/digilism.md`「建議新增」）。不寫文章：`保險理賠流程 如何自動化`（`briefs/smartclaim.md`「取捨」第 12 項）、`AI 客服機器人 怎麼選`（`briefs/systalk-ai.md`「取捨」第 11 項）。`產品碳足跡 ISO 14067 怎麼計算`、`CBAM 申報 怎麼做 台灣 出口商` 確認由既有文章承接、產品頁第 10 段連過去（`briefs/greenswift.md`「取捨」第 12 項）
- 已決定（#199）：`Agentic AI 是什麼` 由既有的 `/blog/what-is-agentic-ai-platform` 承接，不另寫；`MCP 企業 導入 AI Agent 整合` 建議另寫一篇，只建議、另開 issue。見 `briefs/orient-ai.md`「取捨」第 10 項
- 已決定（#199）：`/solutions/smartfilling` 與 `/products/systalk-icr` 的關鍵字分工，見 `briefs/smartfilling.md`「取捨」第 4 項
- 已決定（#199）：客服類查詢由 `/products/systalk-chat` 主要承接，見 `briefs/systalk-ai.md`「取捨」第 11 項
- 已決定（#199）：`/aiso` 與 `/orient-ai` 依查詢主題分工，不依軟體核心：`/aiso` 承接 AISO 品牌與主權 AI 方案，`/orient-ai` 承接 Agent 平台、治理、Token 成本控管與 MCP，地端 AI 伺服器與一體機由 `/products/systalk-ai` 主要承接（見本條後半）。三頁的 title 各用自己的詞：`/aiso`「主權 AI」、`/products/systalk-ai`「地端一體機」、`/orient-ai`「Agentic AI 平台」（`briefs/systalk-ai.md`「取捨」第 13 項）。見 `briefs/aiso.md`「取捨」第 11 項與 `briefs/orient-ai.md`「取捨」第 11 項。AISO 一體機的軟體核心已結算（使用者決定，#199）：是 OrientAI，依據新聞內文的 `fact:aiso-software-orientai`（新聞 575）與 `fact:aiso-orientai-hardware`（新聞 585），`messaging.md`「缺少證據的主張」第 17 項。承接頁不變；`/aiso` 第 1、3 段寫出 OrientAI，第 3 段連到 `/orient-ai`，`/orient-ai` 第 7 段的錨點寫明關係，兩頁雙向連結。同一天使用者再決定（PR #204）：`/products/systalk-ai-phison` 講的不是 AISO，該頁的事實全部由 `/products/systalk-ai` 承接，所以 `地端 AI 伺服器 企業 LLM`、`AI 一體機 企業 地端 交機即用` 改由 `/products/systalk-ai` 主要承接、`/aiso` 次要，`企業 地端 LLM 建置 成本` 的次要承接改給 `/products/systalk-ai`（見上表）
- 已決定（#199）：AISO 聯盟的消息由 `/media-center/559` 承接，見 `briefs/aiso.md`「取捨」第 12 項
- 已決定（#199）：金漾獎放進 `/solutions/smartclaim` 的 hero 證據點，寫年份、不寫組別，見 `briefs/smartclaim.md`「取捨」第 10 項
- 已決定（#199）：`碳盤查 費用 中小企業` 沒有主要承接頁，`/products/greenswift` 次要（`/whitepaper/greenswift` 依 #138 不產生頁面），見 `briefs/greenswift.md`「取捨」第 11 項
- 已決定（#199）：`產品碳足跡 計算 軟體` 不用 ISO 14067 承接（`briefs/greenswift.md`「取捨」第 9 項）；報告語言只寫繁中與英文，越南文跟現站確認前不寫（同檔「取捨」第 14 項）
