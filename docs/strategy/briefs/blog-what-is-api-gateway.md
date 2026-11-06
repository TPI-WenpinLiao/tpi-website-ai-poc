# Content brief：blog 文章「API Gateway 是什麼」`/blog/what-is-api-gateway`（#173）

- 模板：`article`（節點 `blog-post`，`docs/ia/nodes.csv`）；內容檔：`src/content/blog/zh-TW/what-is-api-gateway.md`（製作階段才建）
- 主張 id 指 `docs/strategy/messaging.md`；事實的寫法見 `content-strategy` skill「引用事實的寫法」，只用 `docs/strategy/facts.yaml` 裡 zh-TW、`status: confirmed` 的條目
- 狀態：策略定案，使用者已確認（2026-11-03，#173 留言）。content-strategist 寫段落結構、CTA、schema 缺口與待確認；seo-strategist 補了「搜尋意圖」「內部連結」「title 與 description 方向」與「取捨」的意見欄，新增取捨第 11–13 項；content-strategist 填了「取捨」的最後決定，第 3、11、12、13 項改了段落表、CTA 與內部連結，並同步 `docs/strategy/briefs/digirunner.md` 第 11 段。本 issue 不做的事列在文末「延伸事項」
- 來由：`docs/strategy/briefs/digirunner.md`「三件待決事項」第 1 項決定用 blog 承接 `API Gateway 是什麼`，「內部連結」的「建議新增」列了這篇

## 文章設定

| 欄位 | 值 | 說明 |
|---|---|---|
| slug | `what-is-api-gateway` | |
| 路徑 | `/blog/what-is-api-gateway` | 節點 `blog-post` 的 `/blog/{slug}` |
| `category` | `enterprise-management` | 節點 `blog-enterprise-management`（企業管理），跟 `/blog/enterprise-grade-apim` 同類 |
| `tags` | `[api-management]` | `src/content/tags.yaml` 的「API 管理」 |
| `relatedOfferings` | `[zh-TW/digirunner]` | 文章頁的「相關產品」卡片連到 `/products/digirunner`；產品頁第 11 段由這個欄位反查出本文（「取捨」第 6 項） |
| `author`、`authorType` | `TPIsoftware`、`Organization` | |
| `coverImage` | `src/assets/design/cover-integration.webp` | 沿用設計影像，內容檔裡寫相對路徑 |
| `sourceUrl` | `[]` | 新寫的文章，不是搬移；所以不填 `migratedAt` |
| `facts` | 第 8、9 段引用的事實 id | 見段落結構的「事實」欄。`sourceUrl: []` 的內容檔會被 `node scripts/strategy/facts.mjs` 檢查阿拉伯數字（「不能寫的句子」） |
| 語系 | 只做 zh-TW | en、vi 列為後續事項（`site-profile.md`「語系」） |
| `publishedAt` | `2026-11-03` | 製作階段定 |

## 受眾與任務

依 `docs/research/audience-and-goals.md`「受眾分群」與 messaging「價值主張：IT 主管」：

| 受眾 | 來這篇做什麼 | 這篇要讓他做到的事 |
|---|---|---|
| IT 主管、專案負責人，主要 | 搞清楚 API Gateway 做什麼、跟手上的系統有什麼關係；評估自己架開源 Gateway 夠不夠，還是要一套 API 管理平台 | 第 1–6 段讀完能說出 Gateway 在請求路徑上做的五件事；第 7–9 段讀完知道自架要承擔什麼、Gateway 掛掉怎麼辦、Gateway 跟 API 管理平台差在哪；有下一步可以點（產品頁、試用） |
| 決策者（CIO、CTO），次要 | 聽到團隊提 API Gateway，想知道這是什麼、要不要編預算 | 第 1 段一句話懂定義；第 9 段知道 Gateway 只是 API 管理的一部分 |

這篇是資訊型文章，不直接承接主要轉換（聯絡業務）。文末導向產品頁，次要導向試用（`IT-7`）。

## 搜尋意圖

依 `docs/strategy/search-intent.md`「digiRunner 產品頁 `/products/digirunner`」底下的條目。沒有 Search Console 數據，取捨只依受眾與頁面主題，不依搜尋量。

### 這篇承接的查詢

| 查詢 | 意圖類型 | 承接 | `search-intent.md` 的條目 |
|---|---|---|---|
| `API Gateway 是什麼` | 資訊型（前幾名是 iT 邦幫忙、Medium 的教學文與 AWS 的文件） | 主要。`search-intent.md`「對應到頁面」與 `digirunner.md`「三件待決事項」第 1 項都指給 blog | 「API Gateway 是什麼」 |
| `API 管理平台` | 資訊型（前幾名是「什麼是 API 管理」的定義文） | 次要，主要仍是 `/products/digirunner`。產品頁依 `digirunner.md`「取捨」第 3 項不寫通用定義，這組的定義子題（生命週期、開發者入口網站、分析）由本文第 9 段的通用部分回答。title 帶「API 管理平台」，讓查定義的讀者有一頁對得上；產品頁 title 以產品名開頭（`digiRunner API 管理平台與 AI Gateway`），兩頁的意圖不同，不互搶 | 「API 管理平台」 |

`search-intent.md`「對應到頁面」的 `API 管理平台` 一列，要補上次要承接頁 `/blog/what-is-api-gateway`。那份檔是研究產出，本 issue 不改，也不影響本文（「延伸事項」第 1 項）。

### 不由這篇承接的查詢

| 查詢 | 交給 | 理由 |
|---|---|---|
| `開源 API Gateway 推薦` | 暫不承接（`digirunner.md`「不由這頁承接的查詢」） | 比較型，前幾名是列表文。第 7 段只列名稱（「取捨」第 2 項）；title、description、h2 都不放「推薦」「比較」 |
| `API 管理 金融業` | `/industries/finance`，次要 `/products/digirunner` | 本文只借這組的一個子題（Gateway 與完整 API 管理平台的差別），不寫金融法規（「取捨」第 7 項） |
| `API 管理平台 比較`、`Kong 替代方案 API Gateway` | `/products/digirunner`（次要） | 比較型；第 7 段不比較、不評價 |

### 子題對應到哪一段

`API Gateway 是什麼` 的對照照段落結構下的「共同子題對照」，沒有問題：六項共同子題都有段落，前幾名都沒有的三項放在第 8、9 段，digiRunner 只出現在這兩段，產品出現的位置就是差異化的位置。

次要承接的 `API 管理平台`，共同子題與前幾名都沒有的子題對應如下：

| 子題 | 來源 | 段落 | 說明 |
|---|---|---|---|
| API 生命週期 | 共同子題 | 9 | 通用部分寫設計、發布、版本、下架 |
| API Gateway | 共同子題 | 全文 | |
| 開發者入口網站 | 共同子題 | 9 | 通用部分直接用這個詞，再用一句解釋它做什麼；digiRunner 的例子不寫這一項，也不引用 `fact:digirunner-gov-portal`（「取捨」第 12 項） |
| 分析與計費 | 共同子題 | 4、6、9 | 第 4 段的分級收費、第 6 段的監控、第 9 段的使用紀錄與分析 |
| 部署在本地、雲端或混合環境 | 共同子題 | 不涵蓋 | 產品頁第 4 段寫；本文不需要 |
| 代表產品 | 共同子題 | 7（部分） | 只有開源的四個名稱；商業產品（Apigee、MuleSoft 等）不列，列了就變成比較 |
| 把 AI 模型的流量也納入 API 管理 | 前幾名都沒有 | 9 | 通用部分一句，digiRunner 的例子用 `fact:digirunner-ai-gateway` |
| 台灣或亞洲的代表產品 | 前幾名都沒有 | 8、9 | digiRunner 的例子 |
| 台灣法規要求 | 前幾名都沒有 | 不涵蓋 | 金融頁與產品頁第 6 段寫（「取捨」第 7 項） |

### heading

- h1 是內容檔的 `title`，跟 title 的頁面主題相同（見「title 與 description 方向」）
- 第 2–6 段的 h2 用子題的名稱（路由、認證與授權、限流與配額、快取、監控），跟前幾名的共同子題同一套詞，讀者掃 h2 就知道涵蓋了哪些
- 第 8、9 段的 h2 寫成問題並帶「API Gateway」，例如「API Gateway 故障時怎麼辦」「API Gateway 跟 API 管理平台差在哪」。不要每個 h2 都塞「API Gateway」
- 第 1 段第一句就是定義（「取捨」第 9 項），它也是搜尋摘要最可能取的句子

## 這頁要讓讀者相信什麼

API Gateway 是所有 API 呼叫的入口，認證、限流、快取與監控集中在這裡做；但它只管執行期的流量，上線後的故障處理（`IT-3`）、API 的生命週期與使用軌跡（`IT-5`），以及 AI 流量的管理（`IT-6`），要看 API 管理平台。評估時可以從 digiRunner 這個在地的例子看一套平台涵蓋哪些範圍。

## 段落結構

順序照讀者理解的順序：先一句話的定義，再看 Gateway 在請求路徑上做的事（路由、認證授權、限流、快取、監控），然後是選型時會遇到的問題（自己架、故障、跟管理平台的差別），最後是下一步。

第 1–7 段是通用概念的解說，全部是表述：不帶數字、不寫廠商具名的事實。digiRunner 只出現在第 8、9 段，用來回答前幾名都沒有的子題，是例子，不是產品介紹（「取捨」第 1 項）。

「影像」欄由設計概念階段填。

| # | 段落 | 目的 | 依據（受眾任務／主張 id） | 搜尋子題 | 事實 | 預估長度 | 影像 |
|---|---|---|---|---|---|---|---|
| 1 | 導言：API Gateway 是什麼 | 第一句直接回答定義：所有 API 呼叫進到後端服務前經過的單一入口，負責轉送請求並集中處理共同的規則。第二、三句寫它解決的問題：沒有 Gateway 時，每個後端服務各自做認證、限流與紀錄，規則不一致也難查。不寫情境故事開場（「取捨」第 9 項） | IT 主管任務「搞清楚 API Gateway 做什麼」；決策者任務「一句話懂定義」 | `API Gateway 是什麼` 的定義本身 | 無（表述） | 80–120 字 | |
| 2 | 路由與反向代理 | 說明 Gateway 怎麼依路徑、主機名或標頭把請求轉到對應的後端服務；對外只露出一個網址，後端搬家或拆成微服務時，呼叫端不必改。可以提到格式或協定轉換是常見的延伸功能，不展開 | IT 主管任務「搞清楚跟手上的系統有什麼關係」 | 反向代理與路由 | 無（表述） | 150–200 字 | |
| 3 | 認證與授權 | 分清楚「認證」（你是誰）與「授權」（你能做什麼），再各用一兩句說明 API 金鑰、OAuth、JWT、mTLS 在 Gateway 上分別解決什麼。只寫用途，不寫版本號、RFC 編號，不評比哪個比較安全（「取捨」第 4 項） | IT 主管任務「確認資安要在哪一層處理」 | 認證授權（API 金鑰、OAuth、JWT、mTLS） | 無（表述） | 200–260 字 | |
| 4 | 限流與配額 | 說明限流（每段時間能呼叫幾次）與配額（每個呼叫方的總用量）的差別；兩者保護的是後端不被尖峰或單一呼叫方拖垮，也是對外開放 API 時分級收費或分級服務的基礎。不寫範例數字與 HTTP 狀態碼 | IT 主管任務「確認上線後撐得住」 | 限流與配額 | 無（表述） | 120–180 字 | |
| 5 | 快取 | 說明 Gateway 把常被呼叫、內容不常變的回應暫存起來，後端少處理重複的請求；寫出快取要注意的條件（資料多久要更新、哪些回應不能快取） | IT 主管任務「確認上線後撐得住」 | 快取 | 無（表述） | 100–150 字 | |
| 6 | 監控與紀錄 | 說明所有呼叫都經過 Gateway，所以它是看流量、錯誤率與延遲最集中的地方；出問題時從 Gateway 的紀錄追到是哪個呼叫方、哪支 API。不寫範例數字 | IT 主管任務「確認上線後維運得動」 | 監控 | 無（表述） | 100–150 字 | |
| 7 | 自己架：開源 Gateway | 列出常見的開源選項名稱（NGINX、Kong、Traefik、HAProxy），說明自己架代表安裝、設定、升級、高可用架構與監控都由團隊負責。不比較、不評價、不寫任何數字（「取捨」第 2、3 項）。最後一句帶到第 8、9 段：自己架之後，接著要回答的是 Gateway 自己掛掉怎麼辦，以及 Gateway 以外還缺什麼 | IT 主管任務「評估自己架開源 Gateway 夠不夠」 | 開源選項 | 無（表述） | 100–150 字 | |
| 8 | Gateway 自己故障時怎麼辦 | 先寫通用概念：所有流量都經過 Gateway，它就成了單點，所以實務上會部署多台、前面做負載平衡、狀態資料放在共用的資料庫。再用 digiRunner 當例子，照原文寫高可用架構下的自動分流、內建負載平衡、橫向擴展，以及資料庫的 Active/Standby 配置。這段的例子只寫機制，不寫 TPS 與可用率（「不能寫的句子」） | IT 主管任務「確認上線後撐得住」；`IT-3` | 前幾名都沒有：伺服器故障時的自動分流；繁中的在地產品例子 | `fact:digirunner-failover`、`fact:digirunner-load-balancing`、`fact:digirunner-zero-downtime`、`fact:digirunner-redis-storage` | 通用 80–120 字，例子 100–150 字 | |
| 9 | API Gateway 跟 API 管理平台差在哪 | 先寫通用概念：Gateway 管的是執行期的流量；API 管理平台在 Gateway 之外，還管 API 的生命週期（設計、發布、版本、下架）、開發者入口網站（一句解釋：讓要呼叫 API 的人申請與取得存取權限的地方）、使用紀錄與分析。企業開始用 AI 模型後，AI 的呼叫也是一種要管理的流量，這一句連到 `/blog/ai-infrastructure-operations-governance`。再用 digiRunner 當例子，照原文寫它把 API Gateway 列為應用之一，並提供 API 生命週期管理、即時主控台的 API 活動與軌跡、AI Gateway。例子不寫開發者入口網站，也不寫使用者自助註冊與登入（「取捨」第 12 項）。例子的最後一句連到 `/products/digirunner`，錨點寫例子提到的功能（「內部連結」） | IT 主管任務「評估要不要一套 API 管理平台」；決策者任務「知道要不要編預算」；`IT-5`、`IT-6` | 前幾名都沒有：Gateway 與完整 API 管理平台的差別（「API 管理 金融業」的共同子題）；繁中的在地產品例子。`API 管理平台` 的共同子題：生命週期、開發者入口網站、分析 | `fact:digirunner-five-applications`、`fact:digirunner-api-lifecycle`、`fact:digirunner-console`、`fact:digirunner-ai-gateway` | 通用 120–180 字，例子 80–130 字 | |
| 10 | 結語：評估時先問的問題 | 用 3–5 個問題收尾，讓讀者帶回去評估：Gateway 要裝在哪裡、要接哪些既有系統、故障時誰處理、需不需要生命週期與使用紀錄、AI 模型的呼叫要不要一起管。問題是表述，不附答案，也不寫 digiRunner 的功能。接著放 CTA | IT 主管任務「決定下一步」；次要轉換：試用（`IT-7`） | — | 無（表述） | 問題 3–5 個，說明 40–80 字 | |

第 8、9 段的例子由事實組成，製作階段用事實原文，不改寫成更強的說法。說明句寫讀者得到什麼答案（例如「故障時請求自動轉到另一台，不必有人值班切換」），不寫「以下是 digiRunner 的做法」這類交代版面的句子（`content-strategy` skill「全頁的寫法」）。

### 共同子題對照

`search-intent.md`「API Gateway 是什麼」的共同子題與前幾名都沒有的子題，各對應到哪一段：

| 子題 | 來源 | 段落 | 說明 |
|---|---|---|---|
| 反向代理與路由 | 共同子題 | 2 | |
| 認證授權（API 金鑰、OAuth、JWT、mTLS） | 共同子題 | 3 | 四個名詞都寫，只寫用途 |
| 限流與配額 | 共同子題 | 4 | |
| 快取 | 共同子題 | 5 | |
| 監控 | 共同子題 | 6 | 第 9 段的「即時主控台」是 digiRunner 的例子，第 6 段不放 |
| 開源選項（NGINX、Kong、Traefik、HAProxy） | 共同子題 | 7 | 只列名稱與自架的意思，不比較（「取捨」第 2 項） |
| Gateway 與完整 API 管理平台的差別 | 前幾名都沒有（出自「API 管理 金融業」） | 9 | 本文的主要差異化 |
| 伺服器故障時的自動分流 | 前幾名都沒有 | 8 | |
| 繁中的在地產品例子 | 前幾名都沒有 | 8、9 | digiRunner 只出現在這兩段 |

共同子題全部涵蓋，沒有略過的。

### 不能寫的句子

| 段落 | 不能寫 | 為什麼 | 改寫的方向 |
|---|---|---|---|
| 1–7、10 | 任何阿拉伯數字：範例的每秒呼叫次數、HTTP 狀態碼（例如限流回應的狀態碼）、協定版本（「OAuth 2.0」）、「K8s」 | 第 1–7、10 段是表述，不帶數字。內容檔是 `sourceUrl: []`，`node scripts/strategy/facts.mjs` 會檢查每個阿拉伯數字有沒有在引用的事實裡；就算剛好出現在第 9 段的事實（`fact:digirunner-api-lifecycle` 有「OAuth2.0」）而通過檢查，也是借用 digiRunner 的事實寫通用段落 | 寫「OAuth」「Kubernetes」；限流寫「超過上限的請求會被拒絕」，不寫狀態碼 |
| 7 | 「Kong 要寫 Lua 擴充」「NGINX 效能最好」「開源 Gateway 不適合金融業」 | 比較與評價。digiRunner 與 Kong 的比較事實是 `to_confirm`，使用者決定不用（messaging「缺少證據的主張」第 6 項）；其他評價沒有來源 | 只寫自己架要承擔的工作，誰都適用 |
| 8 | digiRunner 的 TPS 或可用率 | `fact:digirunner-tps` 是 confirmed，但數字要連同環境條件一起寫，資訊型文章的例子段放不下這段脈絡；可用率的說法未確認 | 只寫機制 |
| 9 | 「digiRunner 提供開發者入口網站」「外部夥伴可以自己註冊後接上 API」，以及在例子裡寫「使用者自助註冊與登入」 | `fact:digirunner-gov-portal` 只寫「支援使用者自助註冊與登入」，沒寫是外部夥伴，也沒寫註冊後做什麼（`digirunner.md`「不能寫的句子」的第 2 段，與「取捨」第 7、13 項）。通用部分剛解釋完開發者入口網站，例子裡緊接著寫自助註冊，讀者會把兩者對起來，以為 digiRunner 有開發者入口網站（「取捨」第 12 項） | 通用部分用「開發者入口網站」一詞並解釋概念；digiRunner 的例子只寫生命週期管理、即時主控台與 AI Gateway，不跟通用部分逐項對照，也不寫「digiRunner 也涵蓋上面這幾項」這類句子 |
| 8、9 | 「digiRunner 比開源 Gateway 好維運」「只有 API 管理平台才安全」 | 比較與最高級說法，事實庫沒有 | 寫 digiRunner 做了什麼，讓讀者自己對照第 7 段 |
| 8 | 表述用「我們」 | messaging「語氣」：稱公司用「昕力」 | `fact:digirunner-redis-storage` 原文的「我們的金融產業合作夥伴」照原文引用，前後的說明句不用「我們」 |

## CTA

| CTA | 文案方向 | 位置 | 連到 |
|---|---|---|---|
| 主要：看產品 | 第 10 段錨點「digiRunner API 管理平台」，前面一句寫讀者能在那裡看到什麼（部署方式、資安機制、案例）。第 9 段例子的最後一句另連一次，錨點「digiRunner API 管理平台的 API 生命週期管理與 AI Gateway」（「取捨」第 13 項） | 第 10 段結尾；第 9 段例子的最後一句 | `/products/digirunner`（`digirunner`） |
| 次要：試用 | 「試用 digiRunner on Cloud」，不寫天數與「免費」。messaging `IT-7` 規定寫「免費」要連同 `fact:digirunner-cloud-trial-terms` 的條件，文末放不下，所以不寫 | 第 10 段，主要 CTA 之後 | `/products/digirunner-cloud`（`digirunner-cloud`） |
| 延伸閱讀 | 「用 AI Gateway 管理生成式 AI 與模型整合」（沿用 `digirunner.md` 連出第 3 段） | 第 9 段（AI 流量那一句） | `/blog/ai-infrastructure-operations-governance`（「取捨」第 11 項） |

不放「預約演示」或「聯絡業務」：讀者查的是定義，還在理解階段；產品頁已經有預約演示（`digirunner.md`「CTA」），從這裡先到產品頁。文章頁的「相關產品」卡片由 `relatedOfferings` 產生，跟第 10 段的連結重複，但位置在文章外，不刪。

次要 CTA 考慮過 `/blog/enterprise-grade-apim`，沒有選：那篇講 API 管理平台整合量子運算的應用情境，主題跟本文的讀者任務（評估 Gateway 與管理平台）距離遠。內文也不連（「取捨」第 10 項）。

## 內部連結

路徑取 `docs/ia/nodes.csv`，blog 文章取 `docs/ia/page-map.csv` 的 `blog_slug`，新文章用本文的 slug。錨點寫目的地是什麼；提到 digiRunner 時帶「API 管理平台」或版本名（`digirunner.md`「取捨」第 6 項）。同一篇裡連到同一頁兩次時，兩個錨點各寫各的內容，不用同一串文字（「取捨」第 13 項）。

### 連出

| 段落 | 連到 | 建議錨點文字 | 說明 |
|---|---|---|---|
| 9 | `/blog/ai-infrastructure-operations-governance` | 用 AI Gateway 管理生成式 AI 與模型整合 | 通用部分「AI 的呼叫也是要管理的流量」那一句，在 digiRunner 的例子之前。錨點沿用 `digirunner.md` 連出第 3 段（「取捨」第 11 項） |
| 9 | `/products/digirunner` | digiRunner API 管理平台的 API 生命週期管理與 AI Gateway | 例子的最後一句。錨點寫讀者在產品頁會看到第 9 段例子的哪些功能，跟第 10 段的錨點不同（「取捨」第 13 項）。兩個功能名都在第 9 段引用的事實裡（`fact:digirunner-api-lifecycle`、`fact:digirunner-ai-gateway`） |
| 10 | `/products/digirunner` | digiRunner API 管理平台 | 主要 CTA，前一句寫讀者在那裡看得到什麼（「CTA」） |
| 10 | `/products/digirunner-cloud` | 試用 digiRunner on Cloud | 次要 CTA，不寫天數與「免費」 |

不連的頁面：

| 頁面 | 理由 |
|---|---|
| 第 2–7 段的任何產品頁 | 「取捨」第 1 項 |
| `/industries/finance` | 第 9 段不談金融，錨點寫不出目的地（「取捨」第 7 項） |
| `/blog/enterprise-grade-apim` | 同分類（`enterprise-management`），文末的「相關文章」已經列出（見下方連入），內文不另連；主題是量子運算，跟第 9 段的距離遠（「取捨」第 10 項） |
| `/blog/ai-gateway-for-enterprise-ai-security` | 第 9 段 AI 流量那一句改連 `/blog/ai-infrastructure-operations-governance`（「取捨」第 11 項）。兩篇都列在產品頁第 11 段，讀者到產品頁找得到 |
| `https://tpi.dev/` 與開源 Gateway 的官網 | 第 7 段只列名稱，不導流到任何一個專案；本文不提開源版 digiRunner（「取捨」第 3 項） |

文章頁的「相關產品」卡片（`relatedOfferings`）與文末「相關文章」由模板產生，不算在上表。

### 連入

| 從 | 錨點文字 | 狀態 |
|---|---|---|
| `/products/digirunner` 第 11 段「相關文章」 | 文章標題（模板產生） | 本 issue：本文填 `relatedOfferings: [zh-TW/digirunner]` 後由 `OfferingTemplate.astro` 反查列出。`digirunner.md` 第 11 段已同步成 3 則（「取捨」第 6 項） |
| `/blog/enterprise-grade-apim` 文末「相關文章」 | 文章標題（模板產生） | 自動。`ArticleTemplate.astro` 列同分類最新 3 篇，zh-TW 的 `enterprise-management` 只有這篇和本文，兩篇會互相列出 |
| `/blog/enterprise-management`、`/blog` | 文章標題（模板產生） | 自動 |
| `/blog/ai-infrastructure-operations-governance` 的「AI Gateway 是什麼？」小節 | API Gateway 是什麼 | 可選，不在本 issue 改（「延伸事項」第 2 項）。讀者在這節第一次碰到 Gateway 的概念，連到本文補基礎；本文第 9 段也連到那篇，兩篇互連。那篇的內文是從現站搬來的（`sourceUrl` 有值），加連結等於改搬移的內文，要不要改由主 session 依 `content-migration` 決定 |
| `/blog/enterprise-grade-apim` 第一段「APIM 作為中介層」 | API Gateway 與 API 管理平台的差別 | 不建議。文末的「相關文章」已經連入；那篇也是搬來的內文 |

`/products/digirunner` 第 2、5 段的內文連結（content-strategist 初稿的想法）做不到：offering 的段落連結（`features[].link` 與 `sections` 的連結，`src/content.config.ts`）只能指到 `nodes.csv` 的節點，blog 文章不是節點，要加得先改 schema。第 11 段的反查已經是連入，不必為此改 schema。

## title 與 description 方向

規則照 `seo-checklist`「每頁必備」：zh-TW title 約 20–32 個全形字（含後綴「｜TPIsoftware 昕力資訊」，後綴約 11 字），description 約 60–80 個全形字；半形英數與空格約算半個全形字（同 `digirunner.md` 的算法）。內容檔是 `sourceUrl: []`，title 與 description 都不寫阿拉伯數字（「不能寫的句子」第 1 列），也不寫「五大功能」這類用數量撐標題的說法。

### title

- 要涵蓋：查詢原文「API Gateway 是什麼」，放在最前面；「功能」（第 2–6 段）；「API 管理平台」（第 9 段的差異化子題，也是次要承接 `API 管理平台` 的用詞）
- 傳達的主張：Gateway 只是 API 管理的一部分（「這頁要讓讀者相信什麼」）
- 不放：digiRunner（主角是概念；產品名放進 title，查定義的讀者會以為是產品頁，也跟產品頁的 title 重疊）、「推薦」「比較」「開源」、「一次看懂」「完整攻略」
- h1 用內容檔的 `title`，title 的頁面主題跟 h1 相同，不用 `seoTitle`
- 示例（含後綴）：
  - `API Gateway 是什麼？跟 API 管理平台差在哪｜TPIsoftware 昕力資訊`（約 31 字，使用者確認採用：title 在 32 字內）
  - `API Gateway 是什麼？功能與 API 管理平台的差別｜TPIsoftware 昕力資訊`（約 33 字，不用：超過 32 字）
- 「功能」不在 title，由 description 與第 2–6 段的 h2 涵蓋

### description

- 要涵蓋：第 1 段的定義句、第 2–6 段的五個子題名稱、第 8 段的故障處理、第 9 段跟 API 管理平台的差別
- 傳達的主張：同 title
- 不寫：數字、digiRunner 的功能與產品名（description 的主角是概念）、「推薦」
- 示例：
  - `API Gateway 是所有 API 呼叫進到後端服務前的單一入口。說明它在路由、認證授權、限流、快取與監控各做什麼，Gateway 故障時怎麼處理，以及它跟 API 管理平台的差別。`（約 77 字）
  - `API Gateway 負責轉送請求，並集中處理認證授權、限流、快取與監控。本文說明這些功能、自己架開源 Gateway 要負責哪些事，以及 Gateway 和 API 管理平台差在哪。`（約 74 字，用第 7 段取代第 8 段的故障處理）

建議用第一個：第一句跟第 1 段的定義句意思相同，搜尋摘要不論取 description 或段落，讀者讀到的定義一致；故障處理是前幾名都沒有的子題，比開源選項更能說明這篇跟前幾名的差別。

## schema 缺口

blog schema（`src/content.config.ts`）的內文是 Markdown，第 1 段是 h1 下的導言，不加 h2（h1 已經是「API Gateway 是什麼」，第一句直接接定義），第 2–10 段寫成 h2 加段落；第 3 段的四個名詞、第 10 段的問題用清單；CTA 寫成內文連結。現有欄位放得下，沒有缺口。

| 段落 | 狀況 | 處理 |
|---|---|---|
| 10 | 內文的 CTA 是一般連結，不是按鈕 | 不加欄位。文章頁的「相關產品」卡片（`relatedOfferings`）已經有一個明顯的入口 |
| 全文 | 沒有 `faq` 欄位，不能輸出 `FAQPage` | 不加，見「取捨」第 5 項 |

## 取捨

第 1–10 項是 content-strategist 預寫的衝突與立場，第 11–13 項是 seo-strategist 加的（「content-strategist 的立場」欄寫的是初稿的寫法）。「最後決定」欄由 content-strategist 定案：

- 第 1、2、4–10 項 seo-strategist 同意初稿，做法不變
- 第 3、11、13 項採納 seo-strategist 的意見，改了做法：本文不提開源版 digiRunner；第 9 段的延伸閱讀改連 `/blog/ai-infrastructure-operations-governance`；第 9、10 段連產品頁的錨點分開
- 第 12 項部分採納：通用部分用「開發者入口網站」一詞；不採納 digiRunner 的例子保留「使用者自助註冊與登入」，例子拿掉 `fact:digirunner-gov-portal`
- 改了做法的項目已反映到段落結構（第 9 段）、搜尋意圖的子題對應、不能寫的句子、CTA 與內部連結；第 6 項同步了 `digirunner.md` 第 11 段

| # | 可能的衝突 | content-strategist 的立場 | 理由 | seo-strategist 的意見 | 最後決定 |
|---|---|---|---|---|---|
| 1 | SEO 可能要在認證、限流、快取、監控段都提到 digiRunner 或連到產品頁，增加文章跟產品的關聯 | digiRunner 只出現在第 8、9 段；第 2–6 段不放產品事實、不放產品連結 | 讀者查的是定義，前幾名是中立的教學文；每段都帶產品會變成產品頁，讀者會跳出。digiRunner 放在前幾名都沒有的兩個子題，才是回答問題，不是插廣告。digiRunner 在認證、快取都有事實（`fact:digirunner-security`、`fact:digirunner-smart-caching-patent`），不用是刻意的 | 同意。第 2–6 段要跟前幾名比的是子題講得清不清楚；每段帶產品，h2 底下就變成產品說明，跟查定義的意圖不合，也讓本文跟產品頁第 5、7、8 段重疊。產品頁的連結有第 9、10 段各一次加上「相關產品」卡片，已經夠（「內部連結」） | 採納。digiRunner 只出現在第 8、9 段；第 2–7 段不放產品事實與產品連結 |
| 2 | `開源 API Gateway 推薦` 的前幾名是列表文，SEO 可能要第 7 段寫成比較或推薦 | 只列名稱與自架要承擔的工作，不比較、不評價、不寫數字 | 名稱是業界通用名詞，可以當表述；比較與評價要有來源，事實庫沒有。`digirunner.md`「不由這頁承接的查詢」也決定暫不承接這組 | 同意。四個名稱照寫，因為它們是 `API Gateway 是什麼` 的共同子題，前幾名都列。title、description、h2 不放「推薦」「比較」，本文不跟 `開源 API Gateway 推薦` 的列表文比；也不連到各專案的官網 | 採納。第 7 段列 NGINX、Kong、Traefik、HAProxy 四個名稱與自架要承擔的工作，不比較、不評價、不連官網；title、description、h2 不放「推薦」「比較」 |
| 3 | 開源版 digiRunner 要不要列進第 7 段的開源選項（事實庫有 `fact:digirunner-open-source`、`fact:digirunner-oss-license`，都是 confirmed） | 不列 | 列在通用的開源清單裡，等於把自己的產品放進推薦名單，跟第 7 段「不評價」的寫法衝突；開源版的功能範圍與跟其他版本的差異沒有 zh-TW 事實（messaging「缺少證據的主張」第 12 項），只能寫「有開源版」，讀者得不到資訊。要提的話，放第 9 段例子的最後一句，寫「digiRunner 也有開源版」並連到 `https://tpi.dev/`，由 seo-strategist 判斷值不值得 | 同意不列進第 7 段；第 9 段也不建議放，本文不提開源版。第 9 段回答 Gateway 與管理平台的範圍差別，開源版涵蓋哪些範圍沒有 zh-TW 事實（「待確認」第 3 項），放進來讀者不知道它在差別的哪一邊。事實只有「開源版 digiRunner」與授權名稱，一句話也撐不起 `開源 API Gateway 推薦` 前幾名都沒有的子題（要有安裝說明或功能範圍）。產品頁第 9 段已寫開源版並連 `https://tpi.dev/`（`digirunner.md`「三件待決事項」第 3 項），讀者從第 10 段到產品頁就找得到。開源版的 zh-TW 功能事實收進來後再談 | 採納，整篇不提開源版。初稿留的第 9 段選項拿掉：第 9 段問的是「Gateway 之外還管什麼」，只寫「有開源版」答不了開源版落在範圍的哪一邊，讀者得不到資訊；產品頁第 9 段已經寫開源版並連 `https://tpi.dev/`。開源版的 zh-TW 功能範圍收進事實庫後再評估（「待確認」第 3 項） |
| 4 | 協定名稱（OAuth、JWT、mTLS、API 金鑰）的寫法 | 當表述寫名稱與用途，不寫版本號、RFC 編號、評比 | 這些是業界通用名詞，不是昕力的事實；版本號會讓表述帶數字（「不能寫的句子」） | 同意。四個名稱是共同子題的用詞，都要出現在第 3 段內文；寫「OAuth」不寫「OAuth 2.0」不影響涵蓋 | 採納。第 3 段寫 API 金鑰、OAuth、JWT、mTLS 四個名稱與用途，不寫版本號、RFC 編號與評比 |
| 5 | SEO 可能要加 FAQ（`FAQPage` 結構化資料） | 不加 | 同 `digirunner.md`「取捨」第 4 項：Google 只對知名的政府與醫療網站顯示 FAQ 複合式結果；本文的 h2 已經是問題形式的子題；blog schema 也沒有 `faq` 欄位 | 同意不加。理由同 `digirunner.md`「取捨」第 4 項；第 1 段第一句就是定義（第 9 項），第 2–6 段的 h2 用子題名稱，搜尋摘要從段落取就夠，不需要 FAQ 段重複答一次 | 採納。不加 FAQ 段，不輸出 `FAQPage` |
| 6 | 本文填 `relatedOfferings: [zh-TW/digirunner]` 後，產品頁第 11 段「相關文章」會從 2 則（都講 AI Gateway，依據 `IT-6`）變成 3 則 | 照填 `relatedOfferings`；產品頁第 11 段的目的從「AI Gateway 的延伸閱讀」放寬成「API 與 AI Gateway 的延伸閱讀」 | `digirunner.md`「三件待決事項」第 1 項已決定新文章用 `relatedOfferings` 連回產品頁。本文回答產品頁不寫的定義，正好是產品頁讀者會想看的前置知識。要不要改 `digirunner.md` 第 11 段的「2 則」與依據，由 seo-strategist 與主 session 決定 | 同意照填，`digirunner.md` 要在本 issue 同步：第 11 段的目的改成「API 與 AI Gateway 的延伸閱讀」、依據加 IT 主管任務「評估要不要一套 API 管理平台」、預估長度「2 則」改「3 則」；「與 #167 之前頁面的差異」最後一列與「schema 缺口」第 11 段那列一併改。理由：本文一上線，產品頁就會列出 3 則，brief 跟 production 不一致時，評審不知道對照哪一版（`content-strategy` skill「3. 頁面文案」）。產品頁不填 `relatedPosts`，維持新到舊，本文排第一；不必為了讓 AI Gateway 的兩篇排前面而填 | 採納。本文填 `relatedOfferings: [zh-TW/digirunner]`；`digirunner.md` 已在本 issue 同步三處：第 11 段的段落表列（目的改成 API 與 AI Gateway 的延伸閱讀、依據加上本文承接產品頁不寫的通用定義、3 則）、「與 #167 之前頁面的差異」的相關文章列、「schema 缺口」第 11 段。產品頁不填 `relatedPosts` |
| 7 | 第 9 段的子題來自「API 管理 金融業」，SEO 可能要寫金融法規的角度（例如引用 `fact:digirunner-financial-inspection`）並連到 `/industries/finance` | 不寫金融法規，不連金融頁 | 本文的讀者不限金融業；金融檢查的 API 管理作業由金融頁與產品頁第 6 段寫。第 9 段只寫 Gateway 與管理平台的範圍差別 | 同意，不寫金融法規也不連金融頁。`API 管理 金融業` 主要由金融頁承接、次要是產品頁（`digirunner.md`「取捨」第 5 項），本文再寫金融法規，就是第三頁搶同一組詞。本文從這組借的只有「Gateway 與完整 API 管理平台的差別」一個子題，這個子題不分產業。第 9 段沒提金融，連金融頁的錨點也寫不出目的地 | 採納。不寫金融法規，不引用 `fact:digirunner-financial-inspection`，不連 `/industries/finance` |
| 8 | 第 8 段可能被要求寫效能數字（`fact:digirunner-tps`）讓例子更具體 | 不寫 | 數字要連同「取決於不同環境的配置」一起寫，資訊型文章的例子段放不下；第 8 段回答的是故障時怎麼辦，是機制，不是效能 | 同意。前幾名都沒有的子題是「伺服器故障時的自動分流」，回答它的是機制；description 也不寫數字 | 採納。第 8 段只寫機制，不寫 TPS 與可用率 |
| 9 | 教學文常用情境故事開場，SEO 可能要第 1 段第一句就是定義（搜尋結果的摘要） | 同意第一句就是定義，不寫情境開場 | 讀者查的就是定義，先回答再展開；這也是 IT 主管讀文件的習慣 | 同意。第一句定義也是搜尋摘要最可能取的句子，description 的第一句用同一個意思（「title 與 description 方向」的第一個示例），讀者在搜尋結果與頁面上讀到的定義一致 | 採納。第 1 段第一句是定義，description 的第一句用同一個意思 |
| 10 | 次要 CTA 的選擇 | 試用 digiRunner on Cloud；不選 `/blog/enterprise-grade-apim` | 見「CTA」最後一段 | 同意。`/blog/enterprise-grade-apim` 也不必當內文連結：它跟本文同屬 `enterprise-management`，`ArticleTemplate.astro` 的「相關文章」列同分類最新 3 篇，zh-TW 這個分類只有這兩篇，會互相列出 | 採納。次要 CTA 是試用 digiRunner on Cloud；`/blog/enterprise-grade-apim` 不當 CTA 也不當內文連結 |
| 11 | 第 9 段「AI 的呼叫也是要管理的流量」那一句的延伸閱讀連哪篇 | 連 `/blog/ai-gateway-for-enterprise-ai-security`，錨點「企業 AI 如何防止權限失控與資料外洩」 | 見「CTA」的延伸閱讀列 | 建議改連 `/blog/ai-infrastructure-operations-governance`，錨點「用 AI Gateway 管理生成式 AI 與模型整合」（沿用 `digirunner.md` 連出第 3 段）。這一句講的是 AI 呼叫也是一種流量，那篇有「AI Gateway 是什麼？」一節，把 AI Gateway 寫成應用系統與 AI 模型之間的統一控制層，是本文 Gateway 定義的直接延伸；`ai-gateway-for-enterprise-ai-security` 寫 RBAC、Guardrail 與行為稽核，偏資安。兩篇都在產品頁第 11 段，讀者到產品頁也找得到另一篇 | 採納，改連 `/blog/ai-infrastructure-operations-governance`，錨點「用 AI Gateway 管理生成式 AI 與模型整合」。這一句在通用部分，讀者要的是 AI 流量也走 Gateway 的延伸說明；資安的那篇回答的是權限與稽核，接在這裡跳了一步 |
| 12 | 第 9 段通用部分要不要用「開發者入口網站」這個詞 | 段落表寫「讓使用者申請與取得存取權限的入口」，沒寫這個詞；「不能寫的句子」允許通用部分解釋開發者入口的概念 | digiRunner 的事實只寫「支援使用者自助註冊與登入」（`fact:digirunner-gov-portal`） | 建議通用部分直接寫「開發者入口網站」，再用一句解釋它做什麼。它是 `API 管理平台`、`API 管理 金融業`、`銀行 API 平台` 三組共同子題的用詞，本文次要承接 `API 管理平台`，這個詞要出現在頁面上才對得到。digiRunner 的例子仍只寫「使用者自助註冊與登入」，兩句之間不寫成 digiRunner 提供開發者入口網站（「不能寫的句子」第 9 段那列） | 部分採納。通用部分直接寫「開發者入口網站」，接一句解釋它做什麼，`API 管理平台` 的共同子題因此在頁面上有對應。不採納例子保留「使用者自助註冊與登入」：通用部分依序講生命週期、開發者入口網站、使用紀錄與分析、AI 流量，例子若依序寫生命週期管理、自助註冊與登入、主控台、AI Gateway，兩串逐項對得起來，讀者會讀成 digiRunner 有開發者入口網站，就算兩句之間不寫，也跟 `digirunner.md`「取捨」第 7、13 項的決定衝突。例子拿掉 `fact:digirunner-gov-portal`，只寫 `fact:digirunner-five-applications`、`fact:digirunner-api-lifecycle`、`fact:digirunner-console`、`fact:digirunner-ai-gateway`；這三項功能已經說明 digiRunner 涵蓋 Gateway 之外的範圍，少一項不影響第 9 段的答案 |
| 13 | 第 9、10 段都連 `/products/digirunner` | 兩處用同一個錨點「digiRunner API 管理平台」 | 產品名跟類別詞並列（`digirunner.md`「取捨」第 6 項）；見「CTA」主要列 | 兩處都連，錨點分開寫：第 9 段寫讀者在產品頁會看到例子的哪些功能（「digiRunner API 管理平台的 API 生命週期管理與 AI Gateway」），第 10 段維持「digiRunner API 管理平台」。同一個錨點連同一頁兩次，第二次沒有多給讀者資訊，`digirunner.md`「內部連結」第 6 段也是同樣的規則。兩個錨點都帶「API 管理平台」 | 採納。第 9 段錨點「digiRunner API 管理平台的 API 生命週期管理與 AI Gateway」，第 10 段錨點「digiRunner API 管理平台」。第 9 段錨點裡的兩個功能名在例子引用的事實裡，拿掉自助註冊後也不受影響 |

## 待確認

事實庫沒有、但文章想寫的內容。這些不寫進段落：

| # | 事項 | 卡在哪 | 影響的段落 |
|---|---|---|---|
| 1 | 業界統計，例如企業平均的 API 數量、API 相關資安事件的比例、API 管理市場規模 | 事實庫沒有；要寫得先有可引用的原文與年份，收進 `scripts/strategy/facts-source.yaml` | 1、9 |
| 2 | digiRunner 的限流與配額功能 | 事實庫只有金融檢查清單裡的一項「訂定交易限制」（`fact:digirunner-financial-inspection`），沒寫限流的機制。現在第 4 段是通用概念，不影響；要在第 9 段例子加限流，得先有原文 | 4、9 |
| 3 | 開源版 digiRunner 的功能範圍、跟 Enterprise 與 Cloud 版的差異 | 只有 en 事實（id 以 `digirunner-oss-` 開頭、`-en` 結尾），zh-TW 沒有（messaging「缺少證據的主張」第 12 項） | 7、9（「取捨」第 3 項） |
| 4 | 文章的 `publishedAt` | 製作階段定 | — |

## 延伸事項

本 issue 不做、要另開 issue 或由主 session 決定的事：

| # | 事項 | 為什麼不在本 issue 做 |
|---|---|---|
| 1 | `docs/strategy/search-intent.md`「對應到頁面」的 `API 管理平台` 一列，補上次要承接頁 `/blog/what-is-api-gateway` | 研究階段的產出，本 issue 不改；不影響本文的寫法 |
| 2 | `/blog/ai-infrastructure-operations-governance` 的「AI Gateway 是什麼？」小節加一個連到本文的內文連結，錨點「API Gateway 是什麼」 | 可選。那篇是從現站搬來的內文，加連結要依 `content-migration` 判斷 |
| 3 | en、vi 版本 | `site-profile.md`「語系」：先做 zh-TW |
| 4 | 開源版 digiRunner 的 zh-TW 功能範圍收進事實庫後，評估本文要不要提開源版 | 現在只有 en 事實（「待確認」第 3 項、「取捨」第 3 項） |
