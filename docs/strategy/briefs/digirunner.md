# Content brief：digiRunner 產品頁 `/products/digirunner`（#165）

- 模板：`offering`（`kind: product`）；內容檔：`src/content/offering/zh-TW/digirunner.md`
- 主張 id 指 `docs/strategy/messaging.md`；事實的寫法見 `content-strategy` skill「引用事實的寫法」，只用 `docs/strategy/facts.yaml` 裡 zh-TW、`status: confirmed` 的條目
- 狀態：#165 加上 `strategy-approved`。#186 依 #168 的評審（`docs/strategy/evaluation.md`「新版還不夠好的地方」「交給 #186 的單頁問題」）改了段落表（加「影像」欄，第 1、2、6、9、10 段）、CTA、連出（產業頁、雲端版與案例的錨點）、連入、schema 缺口、取捨第 10–14 項與待確認，新增「照原文列清單的段落」「不能寫的句子」

## 受眾與任務

依 `docs/research/audience-and-goals.md`「受眾分群」與 messaging「價值主張：IT 主管」：

| 受眾 | 來這頁做什麼 | 這頁要讓他做到的事 |
|---|---|---|
| IT 主管、專案負責人，主要 | 確認 digiRunner 裝得進現有環境、資安過得了關、上線後維運得動；決定要不要先試用或約 demo | 每個疑問（既有系統、部署、資安、尖峰與故障、軌跡、AI 串接）各有一段回答，寫機制與條件；找得到試用與預約 demo |
| 決策者（金融、政府），次要 | 確認法規要求有沒有被處理；找案例；決定要不要聯絡業務 | 一段寫清楚金融與政府規範對應的功能，連到產業頁；看得到案例 |

主要轉換：預約 demo（內容檔 `cta: demo`，送到聯絡頁）。次要：試用（`IT-7`）。

## 搜尋意圖

依 `docs/strategy/search-intent.md`「digiRunner 產品頁 `/products/digirunner`」。沒有 Search Console 數據，取捨只依受眾與頁面主題，不依搜尋量。

### 這頁承接的查詢

| 查詢 | 意圖類型 | 承接 | `search-intent.md` 的條目 |
|---|---|---|---|
| `digiRunner API 管理平台` | 導航型與商業型（在看評價與購買管道） | 主要；次要 `/products/digirunner-cloud`（AWS Marketplace） | 「digiRunner API 管理平台」 |
| `digiRunner` | 導航型 | 主要，但前幾名被同名遊戲佔滿；頁面只能靠 title、h1、錨點一律帶「API 管理平台」讓搜尋引擎分得出來 | 「digiRunner」 |
| `API 管理平台` | 資訊型（前幾名是定義文） | 主要。不寫通用定義，用第 2–8 段回答「API 管理平台包含什麼」，見「取捨」第 3 項 | 「API 管理平台」 |
| `API 管理 金融業` | 資訊型為主，帶商業型 | 次要；主要是 `/industries/finance`。本頁第 6 段寫規範對應的功能 | 「API 管理 金融業」 |
| `API 管理平台 比較` | 比較型 | 次要。本頁寫 digiRunner 自己的選型條件（部署、授權與試用、AI 功能），不做比較表，見「三件待決事項」 | 「API 管理平台 比較」 |
| `Kong 替代方案 API Gateway` | 比較型 | 次要，同上；Kong 比較的事實都未確認 | 「Kong 替代方案 API Gateway」 |
| `銀行 API 平台` | 資訊型與商業型 | 次要；主要是 `/industries/finance` | 「銀行 API 平台」 |

比較型三組都只是次要承接：前幾名是列表文與比較文，一個產品頁滿足不了「比較」的意圖。本頁能做的是讓選型時會比的條件（部署方式、授權與試用、AI 功能、資安標準）都寫在頁面上，讀者從列表文點進來時找得到。

### 不由這頁承接的查詢

| 查詢 | 交給 | 理由 |
|---|---|---|
| `API Gateway 是什麼` | `/blog/{slug}`，建議新增文章 | 資訊型，前幾名是教學文；產品頁的段落要指到 IT 主管任務，不寫定義。見「三件待決事項」第 1 項 |
| `開源 API Gateway 推薦` | 暫不承接 | 前幾名是列表文，要進列表靠的是專案本身。開源版的事實已收（#174），本頁只在第 9 段提一句並連到 `tpi.dev`；見「三件待決事項」第 3 項 |
| `API 管理 金融業`、`銀行 API 平台`（主要） | `/industries/finance` | 產業框架與法規對應由金融頁寫，本頁第 6 段只寫功能並連過去（「取捨」第 5 項） |

## 這頁要讓讀者相信什麼

digiRunner 接得上既有系統（`IT-4`），部署環境由企業決定（`IT-1`），資安機制內建（`IT-2`），尖峰與故障有機制處理（`IT-3`），AI 流量和 API 走同一道 Gateway（`IT-6`）；導入前可以先試用，費用條件寫得清楚（`IT-7`）。對金融與政府，規範要求已經做在產品裡（`DM-1`）。

## 段落結構

順序照 IT 主管評估的順序：做什麼、接不接得上、裝在哪、安不安全、合不合規、撐不撐得住、查不查得到，最後是試用與案例。

「影像」欄照 `docs/strategy/design-principles.md`「各模板怎麼呈現」的「offering：digiRunner 產品頁」，版型名稱指同一節的「內頁的版型」。介面片段（`data-ui`、標「示意」）只畫事實寫得出的功能名稱、設定項目與狀態名稱，不畫筆數、時間與曲線。

| # | 段落 | 目的 | 依據（受眾任務／主張 id） | 搜尋子題 | 事實 | 預估長度 | 影像 |
|---|---|---|---|---|---|---|---|
| 1 | Hero：digiRunner 是什麼 | h1 是節點名「digiRunner API 管理平台」，上方不放小標，產品屬於 DigiLism 由麵包屑表示。tagline 寫用途（關鍵系統的 API 與 AI 串接），說明句寫機制，並讓服務對象在第一屏讀得到：「金融」「政府」寫進說明句，或在動作下方寫成連到兩個產業頁的文字連結。附三個證據點（ISO27001、部署方式、DigiLism 的發明專利數）與兩個動作（預約演示、試用 digiRunner on Cloud）。「30 天免費試用」不放 hero，移到第 9 段和條件寫在一起（取捨第 10 項） | IT 主管任務「確認這是不是我要找的產品」；`IT-2`、`IT-1`；決策者任務「確認是不是為我的產業做」 | `digiRunner`、`digiRunner API 管理平台` 的品牌導航（產品名與類別詞並列，跟同名遊戲分開）；`API 管理平台` 的類別詞；`digiRunner API 管理平台` 的「ISO 27001 認證」 | `fact:cert-iso27001-digirunner`、`fact:digirunner-deployment`、`fact:digilism-patents-7` | tagline 15–25 字，說明 40–60 字，證據點 3 項 | 同一個世界渲染的靜態圖 `src/assets/design/ribbon/page-digirunner.webp`，digiRunner 那一格頂面是紫色。圖上的 HTML 標籤寫既有系統、digiRunner、AI 模型、新的服務，用詞照事實（例如 `fact:digirunner-ai-gateway` 的「AI Gateway」）。不載 3D |
| 2 | 接上既有系統，不必先汰換 | 開頭一句列出 digiRunner 涵蓋的範圍（API Gateway、API 生命週期管理、AI Gateway），用產品自己的功能回答「API 管理平台包含什麼」，不寫通用定義（取捨第 3 項）。接著說明 digiRunner 在既有系統前面做什麼：API 組合與格式轉換、圖形化串接各種協定、可沿用現有 WAF、使用者自助註冊與登入（取捨第 7 項）。自助註冊只寫原文的「使用者自助註冊與登入」，不寫是誰註冊、註冊後做什麼（取捨第 13 項）。列出可用的情境（既有系統重構、企業中台建構） | IT 主管任務「確認裝得進現有環境」；`IT-4` | `API 管理平台`：API Gateway 與管理層包含什麼；`digiRunner API 管理平台`：評論提到的 API Composer；`Kong 替代方案 API Gateway`：換掉現有 Gateway 的原因之一「整合」 | `fact:digirunner-five-applications`、`fact:digirunner-api-lifecycle`、`fact:digirunner-ai-gateway`、`fact:digirunner-api-composer`、`fact:digirunner-gov-protocols`、`fact:digirunner-nginx-waf`、`fact:digirunner-low-code`、`fact:digirunner-gov-portal` | 150–230 字，加 2–5 個情境 | 接點圖。SVG：DB、FTP 等既有系統在左，digiRunner 在中（API 組合與格式轉換、沿用現有 WAF），新的服務在右（`fact:digirunner-gov-protocols`、`fact:digirunner-api-composer`、`fact:digirunner-nginx-waf`） |
| 3 | AI 流量走同一道 Gateway | 企業接 AI 模型時，負載、模型配置、內容審查與流量監控沿用 API 管理的機制；MCP 讓 AI 模型串接企業 API | IT 主管任務「確認 AI 串接要另外處理什麼」；`IT-6` | `digiRunner API 管理平台`：AI Gateway；`API 管理平台 比較`：依 AI 功能選型 | `fact:digirunner-ai-gateway`、`fact:digirunner-ai-model-config`、`fact:digirunner-ai-content-review`、`fact:digirunner-ai-traffic`、`fact:digirunner-ai-governance`、`fact:digilism-family-digirunner` | 120–200 字，功能 4–6 項 | 介面片段 1：AI Gateway 的設定面板，三個項目是模型配置、內容審查、流量監控（`fact:digirunner-ai-model-config`、`fact:digirunner-ai-content-review`、`fact:digirunner-ai-traffic`）。畫出的接點：企業的 API 與 AI 模型之間隔著同一道 Gateway |
| 4 | 部署環境由企業決定 | 地端、雲端、Kubernetes、多雲與混合雲；雲端版支援的平台與部署方式，連到 digiRunner on Cloud | IT 主管任務「確認裝得進現有環境」；`IT-1` | `API 管理平台`：部署在本地、雲端或混合環境；`digiRunner API 管理平台`：本地與雲端部署、Kubernetes、AWS；`API 管理平台 比較`：依雲端環境、自架或混合部署選型 | `fact:digirunner-deployment`、`fact:digirunner-multi-cloud`、`fact:digirunner-cloud-platforms`、`fact:digirunner-cloud-containers` | 80–150 字 | 規格表，h2 旁放段落圖 `sec-deployment`（#187 使用者決定，`design-principles.md`「內頁共用的規則」段落圖）。表的列是地端、雲端、Kubernetes、多雲與混合雲，雲平台一列 |
| 5 | 資安機制內建 | 列出支援的認證、授權與加密標準，零信任存取防護，惡意行為防護，產品本身的 ISO27001 認證。寫標準名稱，不寫「固若金湯」這類形容 | IT 主管任務「確認資安過得了關」；`IT-2` | `digiRunner API 管理平台`：OpenAPI、OAuth 2.0、OIDC，API 生命週期管理；`API 管理平台`：API 生命週期；`API Gateway 是什麼`：認證授權（API 金鑰、OAuth、JWT、mTLS）（次要）；`API 管理 金融業`：認證與防禦 | `fact:digirunner-zero-trust`、`fact:digirunner-security`、`fact:digirunner-auth-methods`、`fact:digirunner-api-lifecycle`、`fact:digirunner-gov-threat-protection`、`fact:cert-iso27001-digirunner` | 120–200 字，標準清單 | 介面片段 2（和第 3 段左右對調）：一支 API 的認證方式設定，選項照 `fact:digirunner-auth-methods` 原文。畫出的接點：外部呼叫進到 Gateway 時先過認證。標準清單放在片段旁 |
| 6 | 金融與政府的規範要求 | 一列一個規範，寫「哪個規範、對應什麼功能」，右欄連到產業頁。三列：台灣開放銀行（金管會法規與三階段規範）、金融檢查（照原文每行一項列出要做的 API 管理作業）、政府與公部門（國發會共通性 API 規範，加上同一頁原文的 OpenAPI Specification）。這段給決策者，不寫百分比或「唯一」（取捨第 11 項） | 決策者任務「確認法規要求有沒有被處理」；`DM-1` | `API 管理 金融業`：台灣法規（次要，主要在金融頁）。事實庫沒有「財金公司 Open API 規範」的對應，不寫成符合該規範；`銀行 API 平台`：保護、監控 API（次要） | 開放銀行列 `fact:digirunner-open-banking-fsc`、`fact:digirunner-open-banking-3-stages`；金融檢查列 `fact:digirunner-financial-inspection`；政府列 `fact:digirunner-ndc-spec`、`fact:digirunner-oas` | 規範名稱各 5–10 字；對應功能照事實原文 | 對應表，沒有圖，不做成卡片 |
| 7 | 尖峰流量與單點故障 | 高可用架構、故障自動分流、依尖離峰擴縮、內建負載平衡、專利智慧快取、平行處理；資料庫配置與金融業常用的 Active/Standby。TPS 數字要連同「取決於環境配置」一起寫，條件是原文的一部分，不另寫一句製作備註交代（「不能寫的句子」） | IT 主管任務「確認上線後維運得動」；`IT-3` | `API Gateway 是什麼`：限流、快取（次要）；`Kong 替代方案 API Gateway`：換掉現有 Gateway 的原因之一「效能」 | `fact:digirunner-zero-downtime`、`fact:digirunner-failover`、`fact:digirunner-container-scaling`、`fact:digirunner-load-balancing`、`fact:digirunner-smart-caching-patent`、`fact:digirunner-parallel-processing`、`fact:digirunner-redis-storage`、`fact:digirunner-tps` | 150–250 字，機制 4–6 項 | 接點圖。SVG：兩台 digiRunner，一台故障時請求分流到另一台，後面是 Active/Standby 的資料庫（`fact:digirunner-failover`、`fact:digirunner-redis-storage`）。硬體規格與 TPS 用規格表的一列接在圖下，條件同列（`fact:digirunner-tps`） |
| 8 | API 與 AI 的使用軌跡 | 即時主控台、監控與告警、AI 使用歷程紀錄；出問題查得到來源，稽核拿得出紀錄 | IT 主管任務「確認上線後維運得動」；`IT-5` | `API Gateway 是什麼`：監控（次要）；`API 管理平台`：分析 | `fact:digirunner-console`、`fact:digirunner-ai-usage-log`、`fact:digirunner-cloud-opensearch` | 80–120 字 | 介面片段 3：主控台，「API 活動與軌跡」「AI 使用歷程」兩個分頁（`fact:digirunner-console`、`fact:digirunner-ai-usage-log`）。只畫分頁與欄位名稱 |
| 9 | 先試用再決定 | 試用天數、試用期間各方案功能都能用、不收授權費；雲端版的費用條件（AWS 仍收基礎設施費用、到期自動轉付費）緊貼在「免費」旁邊，同一處讀完。沙盒讓開發人員不影響現行服務就能測。列出 digiRunner on Cloud 的方案名稱，不放價格。子節點 digiRunner on Cloud 的入口併進這段的動作 | IT 主管任務「決定要不要先試用」；`IT-7`；次要轉換：試用 | `API 管理平台 比較`：依預算與授權選型；`digiRunner API 管理平台`：AWS Marketplace 的購買管道；`銀行 API 平台`：沙盒 | `fact:digirunner-trial-30-days`、`fact:digirunner-cloud-trial-terms`、`fact:digirunner-trial-all-features`、`fact:digirunner-cloud-trial-full`、`fact:digirunner-sandbox`、`fact:digirunner-cloud-plans` | 80–150 字 | 色帶（淺紫）。介面片段 4：digiRunner on Cloud 的方案清單（`fact:digirunner-cloud-plans`），試用條件原文緊貼在旁（`fact:digirunner-cloud-trial-terms`） |
| 10 | 案例 | 一則一列：客戶名、作業、成果、連結（`design-principles.md`「案例列」）。台新銀行的現金管理 API 平台（金融，`IT-4`），Global Finance 獎項放在同一列，寫出年份；臺北市政府的 API 管理平台與管理制度（政府，`DM-1`、`DM-4`）；Pharmacity 的雲端 API 管理平台（`IT-1`，zh-TW 沒有案例頁，這列沒有內頁連結）；安泰銀行的 API 管理平台（由 `case-study.offerings` 反查出來，事實庫沒有成果，成果那一行不放，見「待確認」第 8 項）。有成果的排前面，最後一個連結到成功案例列表 | 決策者任務「找成功案例」；`DM-1`、`IT-4`、`IT-1`、`DM-8` | — | `fact:client-taishin-bank`、`fact:digirunner-case-taishin`、`fact:award-global-finance-2020`；`fact:client-taipei-city`、`fact:digirunner-case-taipei-city`；`fact:client-pharmacity`、`fact:digirunner-case-pharmacity`；`fact:client-entie-bank` | 4 列，每列照事實原文 | 案例列。第一則台新銀行配一張片段（現金管理 API 平台的示意，文字照 `fact:digirunner-case-taishin`），不算進第 3、5、8、9 段的 4 張 |
| 11 | 相關文章 | API 與 AI Gateway 的延伸閱讀：講 AI Gateway 與 AI 治理的兩篇 2026 年文章，給要深入了解第 3 段的讀者；`/blog/what-is-api-gateway`（#173），給想先弄清楚 API Gateway 做什麼、跟 API 管理平台差在哪的讀者，本頁不寫這段通用定義（取捨第 3 項）。模板依 `blog.relatedOfferings` 反查產生，順序照新到舊，不寫文案 | IT 主管任務「確認 AI 串接要另外處理什麼」；`IT-6`；IT 主管評估要不要一套 API 管理平台時需要的前置知識（`/blog/what-is-api-gateway` 的受眾任務） | `API 管理平台`：定義子題（生命週期、開發者入口網站、分析）由 `/blog/what-is-api-gateway` 第 9 段回答，本頁不寫 | 無（文章本身的事實由文章管） | 3 則 | 索引列，文章自己的封面縮圖 |
| 12 | 預約演示 | 頁尾的主要轉換，標題寫下一步（約 demo、談導入） | 主要轉換：預約 demo | — | 無 | 標題 10–20 字，說明 30–50 字 | 色帶（深紫），沒有圖 |

第 2、3、5 段的情境、功能與標準清單由事實組成，製作階段用事實原文，不改寫成更強的說法。

### 照原文列清單的段落

第 2、3、5、6、7 段的清單是事實原文，說明句是表述（#168 new-digirunner「評審依據不足」第 6 項）。寫法：

- 說明句寫讀者讀完這段得到什麼答案（例如「既有系統不必先汰換，digiRunner 在前面做組合、轉換與串接」），不寫「以下列出」這類交代版面的句子（`content-strategy` skill「3. 頁面文案」）
- 清單只放回答這段問題的事實，不把同一頁所有相關事實都列進來；每段 2–6 項
- 原文是一串名詞的事實，照 `.claude/skills/site-research/SKILL.md` 第 2 條在 `scripts/strategy/facts-source.yaml` 把 `text` 拆成每行一項，再重跑 `node scripts/strategy/extract-facts.mjs`；模板把多行的 `text` 排成清單。#186 已拆好：`fact:digirunner-financial-inspection`（第 6 段）與 `fact:digirunner-five-applications`（第 2 段，API Gateway、既有系統重構、企業中台建構各一行）；製作階段只需要讓模板把多行的 `text` 排成清單
- 評 C2 時，說明句看的是有沒有寫出讀者得到什麼；清單是 brief 要求的事實原文，清單本身不扣 C2，但清單的項目要能回答段落標題的問題

### 不能寫的句子

#168 的評審在 production 抓到的句子（new-digirunner C3、C6）。前三句是製作備註，描述頁面怎麼排；第四句比事實原文多了主詞與結果。

| 段落 | 不能寫 | 為什麼 | 改寫的方向 |
|---|---|---|---|
| 5 | 「以下是支援的標準。」 | 交代版面，讀者讀完沒得到答案 | 寫讀者得到什麼：認證、授權、加密與惡意行為防護都內建，不必另外拼裝 |
| 7 | 「效能數字取決於環境配置，以下照原文列出。」 | 「以下照原文列出」是製作備註；條件已在 `fact:digirunner-tps` 原文裡，不用另一句交代 | 說明句寫機制（故障時自動分流、尖離峰時擴縮）；TPS 照原文，條件跟數字在同一處 |
| 9 | 「雲端版的試用條件寫在下面，包括到期後的計費方式。」 | 交代條件放在哪，讀者還是要往下找 | 寫讀者得到什麼（導入前先用完整功能試），條件原文直接緊貼在「免費」旁 |
| 2 | 「外部夥伴也能自己註冊、登入後接上 API。」 | `fact:digirunner-gov-portal` 只寫「支援使用者自助註冊與登入」，沒寫是外部夥伴，也沒寫註冊後接上 API | 只寫原文的範圍：使用者可以自助註冊與登入 |

### 與 #167 之前頁面的差異

對照 #167 之前的 `src/content/offering/zh-TW/digirunner.md`（#168 評審的「試點舊版」，`main` 818988f）。#167 之後的 production 和本 brief 的差異寫在「取捨」第 10–14 項與「不能寫的句子」：

| 現有 | 處理 | 理由 |
|---|---|---|
| tagline「專為關鍵系統應用而生」 | 保留方向，改寫成含類別詞的一句 | 沒說出「API 管理平台」，讀者要看 h1 才知道類別 |
| 四個「零」（零停機、零失誤監控、零阻塞、零信任） | 拆進第 2、5、7、8 段 | 「零失誤」是說法不是機制，事實庫也沒有「零失誤」的依據；四段各回答 IT 主管一個疑問，比四個口號說得多 |
| 五個產業頁籤（金融、保險、醫療、物聯網、政府），每項只有標題與一行 | 金融、政府併入第 6 段；保險併入第 6 段的金融項；醫療、物聯網刪除 | 醫療與物聯網不是本站受眾的產業（`audience-and-goals.md`）；頁籤的其餘行數多是 `to_confirm` 的「100% 合規」 |
| 現站有、新站沒搬的 AI Gateway、部署、資安、四大機制、API Composer／沙盒／主控台、金檢段落（`unmigrated.md`） | 放回第 2–9 段 | 各對應一個 IT 主管任務或主張 |
| 現站的「digiRunner v.s. Kong」比較表 | 不放 | 比較事實全部 `to_confirm`，見「待確認」第 4 項 |
| 現站的「立即解鎖」版本連結區 | 不另設段落 | 雲端版由 hero 的試用按鈕與第 4、9 段連結，子節點 digiRunner on Cloud 的入口併進第 9 段的動作，不另成「相關產品」段（`design-principles.md`「offering：digiRunner 產品頁」）；白皮書是 draft |
| 現站的「進一步掌握 API 管理最新趨勢」相關文章區 | 保留為第 11 段，列 3 則 | 已有兩篇 2026 年文章（`/blog/ai-gateway-for-enterprise-ai-security`、`/blog/ai-infrastructure-operations-governance`）內文連到本頁，但沒填 `relatedOfferings`，所以模板反查不到。製作階段在兩篇文章補 `relatedOfferings: [zh-TW/digirunner]`（取捨第 9 項）。#173 新寫的 `/blog/what-is-api-gateway` 也填了 `relatedOfferings: [zh-TW/digirunner]`，第 11 段因此列出 3 則，目的從「AI Gateway 的延伸閱讀」放寬成「API 與 AI Gateway 的延伸閱讀」（`docs/strategy/briefs/blog-what-is-api-gateway.md`「取捨」第 6 項） |

## CTA

| CTA | 文案方向 | 位置 | 連到 |
|---|---|---|---|
| 主要：預約演示 | 約 demo、談導入（沿用 `cta: demo` 的「預約演示」） | 第 1 段 hero、第 12 段 | `/contact-us`（`contact`） |
| 次要：試用 | hero 寫「試用 digiRunner on Cloud」，不寫天數與「免費」；第 9 段寫試用天數與「免費」時，費用條件緊貼在旁（取捨第 10 項） | 第 1 段 hero（取代 #165 之前的「看功能」）、第 9 段 | `/products/digirunner-cloud`（`digirunner-cloud`） |
| 次要：看產業頁 | 錨點寫目標頁的內容（連出表），不只寫產業名 | 第 6 段的對應表右欄；hero 說明句下方的產業連結（第 1 段） | `/industries/finance`、`/industries/government` |

hero 的次要按鈕從「看功能」（`#features`）改成試用：`IT-7` 是這頁的次要轉換，頁內導覽（`InPageNav`）已經提供跳到功能的入口。試用要連到哪一頁見「待確認」第 6 項。

## 內部連結

路徑取 `docs/ia/nodes.csv`，blog 文章取 `docs/ia/page-map.csv` 的 `blog_slug`。只列會產生頁面的節點：digiRunner 白皮書（`/whitepaper/api-strategies`）是 draft，不當連結目標。錨點文字寫目的地是什麼，提到 digiRunner 時帶「API 管理平台」或版本名，不單寫「digiRunner」（跟同名遊戲撞名）。

### 連出

| 段落 | 連到 | 建議錨點文字 | 說明 |
|---|---|---|---|
| 1、9 | `/products/digirunner-cloud` | 試用 digiRunner on Cloud | 錨點要寫出是雲端版，讀者才知道會進到 AWS Marketplace 的版本（試用入口的問題見「待確認」第 6 項）。第 9 段寫「30 天免費試用」時，條件緊貼在旁（取捨第 10 項），按鈕本身不寫「免費」 |
| 1、12 | `/contact-us` | 預約演示 | 主要轉換 |
| 2 | `/products/digilism` | DigiLism 數位轉型產品家族 | 麵包屑已連到家族頁；第 2 段提到「可代替 ESB」這類家族層級的能力時（`fact:digilism-protocol-integration` 是 DigiLism 的事實），在內文連過去 |
| 3 | `/blog/ai-gateway-for-enterprise-ai-security` | 企業 AI 如何防止權限失控與資料外洩 | 已上線的 2026 年文章，內文已連回本頁；在文章補 `relatedOfferings` 後由第 11 段列出（取捨第 9 項） |
| 3 | `/blog/ai-infrastructure-operations-governance` | 用 AI Gateway 管理生成式 AI 與模型整合 | 同上 |
| 4 | `/products/digirunner-cloud` | digiRunner on Cloud 支援的雲平台與部署方式 | 第 4 段「部署環境由企業決定」連到雲端版的錨點（production 是 `features` 的第 3 項）。production 寫「看 digiRunner on Cloud」（new-digirunner S5），#187 改成左列的錨點。第 1、9 段的試用按鈕維持「試用 digiRunner on Cloud」，兩個錨點各寫各的目的 |
| 6 | `/industries/finance` | 金融業的開放銀行與金融檢查要求 | 第 6 段開放銀行列與金融檢查列的右欄，兩列連同一頁時只放一個連結（放在開放銀行列），不要同一個錨點連兩次。#168 評審指出 production 用 `Tag` 標「金融」，錨點只有產業名，出現三次（new-digirunner C4、S5）；#187 拿掉 `Tag`，改成左列的錨點 |
| 6 | `/industries/government` | 政府與公部門的共通性 API 規範 | 第 6 段政府列的右欄。production 寫「政府與公部門」（節點名），#187 改 |
| 1 | `/industries/finance`、`/industries/government` | 金融業方案、政府與公部門方案 | 只在第 1 段用文字連結露出服務對象時才有（段落表第 1 段的兩種做法之一）；說明句已寫出「金融」「政府」時不加，第 6 段的連結就夠。hero 放不下第 6 段那麼長的錨點，用首頁第 2 段同一組寫法（`home.md`「CTA」的「看金融業方案」去掉動詞），仍寫出目標是產業頁，不只寫「金融」 |
| 10 | 各案例內頁（`/success-story/{slug}`，由 `relatedCaseStudies` 或 `case-study.offerings` 產生） | 客戶名稱加案例標題：`<a>` 的文字是案例檔的 `client.name`、全形冒號、案例檔的 `title`。3 則是「台新銀行：現金業務API管理平台」「臺北市政府：API管理平臺」「安泰銀行：API 管理平台」 | 客戶名要在 `<a>` 裡面（new-digirunner S5：客戶名不在 `<a>` 裡）。案例列若每列有 heading，heading 也用同一串文字（new-digirunner S4：h3「API管理平臺」「API 管理平台」分不出是哪個案例）。規則和 `finance.md`「內部連結」第 8 段相同，兩個模板共用 `caseNotes` 時一起做。`taishin-cash-sales-api-management-platform`、`entie-bank-api-management-platform` 已有 `offerings: [zh-TW/digirunner]`；`taipei-city-api-management-platform` 要補，見「schema 缺口」。Pharmacity 沒有案例頁，那一列不加連結。案例標題的中英文間空格與「平臺」「平台」是案例檔的問題，錨點照檔案組 |
| 10 | `/success-story` | 看所有成功案例 | 案例列的最後一個連結 |

麵包屑沿 `parent` 連到 `/products` 與 `/products/digilism`，模板產生，不必另寫。

### 連入

| 從 | 建議錨點文字 | 狀態 |
|---|---|---|
| header「產品」選單、`/products`、`/products/digilism` 的子頁卡片 | 節點名「digiRunner API 管理平台」 | 已有 |
| 首頁第 4 段（DigiLism 家族的產品清單） | digiRunner API 管理平台 | 首頁 brief 已列 |
| `/industries/finance` 第 2、3、4 段 | digiRunner API 管理平台的法規對應功能、digiRunner API 管理平台如何接上核心系統、digiRunner API 管理平台的 AI 使用歷程紀錄與 AI 治理 | 金融頁 brief 已列 |
| `/industries/government` | digiRunner API 管理平台 | 建議補：現有內容多處提到 digiRunner，內文沒有連結（產品不是它的子節點，子頁卡片不會列） |
| `/products/digirunner-cloud` | digiRunner 地端與 Kubernetes 版本 | 麵包屑已連；內文沒有連結，建議補一處 |
| `/blog/ai-gateway-for-enterprise-ai-security`、`/blog/ai-infrastructure-operations-governance` | digiRunner | 已有（內文連到 `/products/digirunner`） |
| `/blog/enterprise-grade-apim` | digiRunner API 管理平台 | 建議補：文章主題是 API 管理平台（tag `api-management`），目前沒有連到本頁 |
| 有 `offerings: [zh-TW/digirunner]` 的案例內頁 | 產品名 | 已有（案例頁列出使用的產品） |

### 建議新增

| 頁面 | 位置 | 理由 |
|---|---|---|
| 「API Gateway 是什麼」的 blog 文章 | `/blog/{slug}`（新的 `blog-post`，分類建議 `blog-enterprise-management`，跟 `enterprise-grade-apim` 同類） | 承接 `API Gateway 是什麼`，文末連到本頁。見「三件待決事項」第 1 項 |

## title 與 description 方向

規則照 `seo-checklist`「每頁必備」：zh-TW title 約 20–32 個全形字（含後綴「｜TPIsoftware 昕力資訊」，後綴約佔 11 字），description 約 60–80 個全形字；半形英數約算半個全形字。

### title

- 要涵蓋：產品名 digiRunner、類別詞「API 管理平台」（永遠跟產品名並列）、「AI Gateway」
- 傳達的主張：`IT-6`（AI 流量和 API 走同一道 Gateway）
- 現行的頁面主題「digiRunner API 管理平台」加後綴約 22 字，已符合規則。建議用 `seoTitle` 加上 AI Gateway：`digiRunner API 管理平台與 AI Gateway`。h1 維持「digiRunner API 管理平台」（跟節點名稱一致），title 跟 h1 不同，所以用 `seoTitle`（`content-model.md`「共用欄位」）
- 不放「API Gateway 是什麼」這類資訊型詞，也不放「比較」「替代」
- 示例（含後綴）：
  - `digiRunner API 管理平台與 AI Gateway｜TPIsoftware 昕力資訊`
  - `digiRunner API 管理平台｜TPIsoftware 昕力資訊`（不加 `seoTitle` 的做法）

### description

- 要涵蓋：API 管理平台、API Gateway 或 AI Gateway、部署方式（地端、雲端、Kubernetes 或混合雲）、一項資安標準、試用
- 傳達的主張：`IT-6`、`IT-1`、`IT-2`、`IT-7`
- 依據的事實：`fact:digirunner-ai-gateway`、`fact:digirunner-deployment`、`fact:digirunner-multi-cloud`、`fact:digirunner-zero-trust`、`fact:digirunner-security`、`fact:digirunner-api-lifecycle`、`fact:digirunner-trial-30-days`
- 不寫「30 天免費」：試用條件放不進 description（雲端版的費用說明，`fact:digirunner-cloud-trial-terms`），只寫「可先試用」。也不寫「零失誤」「100% 合規」
- 現行 description 只寫 API 管理功能，沒寫部署、AI 與試用，要重寫
- 示例：
  - `digiRunner 是昕力資訊的 API 管理平台，把既有系統與 AI 模型的串接集中在同一道 Gateway 管理，支援地端、雲端與 Kubernetes 部署，內建零信任存取防護，可先試用再導入。`
  - `digiRunner API 管理平台提供 API Gateway、API 生命週期管理與 AI Gateway，支援 OAuth 2.0、OIDC 與 mTLS，可部署在地端、雲端或混合雲，並提供試用。`

## schema 缺口

offering schema（`src/content.config.ts`）現有 `tagline`、`features[]{title, body, icon?}`、`useCases[]{title, body, industry?}`、`faq`、`cta`、`relatedCaseStudies`、`downloads`。

| 段落 | 缺什麼 | 新增的欄位 | 型別 |
|---|---|---|---|
| 1 | hero 只有 tagline，放不下證據點（`unmigrated.md` 已記錄） | `heroPoints` | `string[]`（每項是事實原文） |
| 1、9 | 只有一個 CTA（`cta: 'contact' \| 'demo'`），試用沒有位置 | `secondaryCta` | `{ label: string; node: string }`，`node` 取 `nodes.csv` 的 offering 節點 id（這頁填 `digirunner-cloud`） |
| 2、3、5、7 | `features[].body` 是一段文字，放不下標準清單、情境清單與機制清單 | `features[].points` | `string[]`（選填，每項是事實原文） |
| 2–9 | 段落需要連到其他頁（雲端版、產業頁） | `features[].link` | `{ label: string; node: string }`（選填） |
| 6 | `useCases` 能承接（帶 `industry`，產業頁可反查），但 `body` 是一段文字，一列放不下兩則事實（開放銀行列、政府列各兩則） | `useCases[].points` | `string[]`（選填，每項是事實原文），和 `features[].points` 同形。改成三列後，金融檢查列的 `body` 是 `fact:digirunner-financial-inspection` 的多行 `text`，模板排成清單 |
| 10 | `relatedCaseStudies` 已有；臺北市政府 API 管理平台的案例檔（`src/content/case-study/zh-TW/taipei-city-api-management-platform.md`）沒有 `offerings`，反查不到；Pharmacity 在 zh-TW 沒有案例檔；案例的成果事實與獎項放不進反查出來的卡片 | `caseNotes` | `{ client?: string; work: string; result?: string; caseStudy?: string }[]`：`client`、`work`、`result` 是事實原文，`caseStudy` 是案例檔 id（有就連內頁，沒有就不加連結）。臺北市政府案例檔補 `offerings: [zh-TW/digirunner]`。金融頁第 8 段的阻詐平台用同一個欄位（`finance.md`「schema 缺口」），兩個模板共用型別 |
| 11 | 相關文章由 `blog.relatedOfferings` 反查，兩篇 AI Gateway 文章沒填 | 無 | 在兩篇 AI Gateway 文章的內容檔補 `relatedOfferings: [zh-TW/digirunner]`；`/blog/what-is-api-gateway`（#173）新寫時就填。三篇都填後列 3 則。本頁的 `relatedPosts` 只用來排序，不填，順序照新到舊 |
| 2–10 | 段落的版型與影像要能逐段指定（`design-principles.md`「和新寫法衝突的共用元件」的「段落的版型怎麼選」） | 由 #187 決定 | 段落表的「影像」欄就是這個值 |

也可以不加 `features[].points`、`link`，改成跟 `page.sections` 同形的 `sections` 欄位；選哪個由主 session 依模板決定，brief 只要求第 2–9 段放得下「說明 + 清單 + 連結」。

#167 已加的欄位：`heroPoints`、`heroLead`、`secondaryCta`、`features[].points`、`features[].link`、`useCasesTitle`、`useCasesAfter`、`casesIntro`。案例改成案例列後，`casesIntro` 的 Global Finance 那一句移到台新那一列（`caseNotes`），`casesIntro` 不再需要。

## 取捨

第 1–5 項是 content-strategist 預寫的衝突，第 6–9 項是 seo-strategist 加的。「最後決定」欄由 content-strategist 定案：第 9 項改了做法（理由寫在該列），其餘採納，已反映到段落結構（第 2、11 段）、內部連結與 schema 缺口。第 10 項起是 #186 依 #168 的評審與 `design-principles.md`「各模板怎麼呈現」補的，seo-strategist 在 #186 補了意見欄，第 10–14 項都同意，最後決定不變。

| # | 可能的衝突 | content-strategist 的立場 | 理由 | seo-strategist 的意見 | 最後決定 |
|---|---|---|---|---|---|
| 1 | 比較型查詢（「API 管理平台 比較」「Kong 替代方案 API Gateway」）可能要求比較段或比較表 | 不放比較表；第 2、4、5 段寫 digiRunner 自己的部署、整合與資安條件，回答選型時會比的項目 | 與 Kong 的比較事實都是 `to_confirm`（messaging 缺少證據第 6 項）；寫自己的條件不需要比較基準 | 同意。比較文的共同子題是部署方式、預算與授權、AI 功能，對應本頁第 4、9、3 段，三段都已在段落表；第 9 段的試用條件就是「授權」子題的答案，要寫清楚。決定見下方「三件待決事項」第 2 項 | 採納。不放比較表或比較段；第 9 段把試用與授權條件寫清楚 |
| 2 | 「開源 API Gateway 推薦」可能要求寫開源版 | 不寫 | 事實庫沒有開源版的條目（messaging 缺少證據第 12 項），要先收進事實庫 | 同意現在不寫。但開源版是存在的產品（`search-intent.md` 的 `digiRunner API 管理平台` 結果有開源專案頁），建議由 researcher 從官方來源收進事實庫，見「三件待決事項」第 3 項 | 採納。現在不寫；開源版收進事實庫後，在第 9 段加一句 |
| 3 | 類別詞「API 管理平台」是資訊型（定義文佔前幾名），SEO 可能要加「什麼是 API 管理平台」的定義段 | 不加通用定義；第 2 段用 digiRunner 的功能回答「包含什麼」 | 定義文是 blog 的工作（`search-intent.md`「API Gateway 是什麼」也指給文章）；產品頁的每段要指到 IT 主管任務 | 同意不加定義段。補一個條件：第 1 段說明句或第 2 段開頭，直接寫出 digiRunner 涵蓋的範圍（API Gateway、API 生命週期管理、AI Gateway），用產品自己的功能說出類別包含什麼，不必另寫通用定義。這三項都有事實（`fact:digirunner-five-applications`、`fact:digirunner-api-lifecycle`、`fact:digirunner-ai-gateway`） | 採納。不加定義段；涵蓋範圍放在第 2 段開頭（第 1 段的說明句只有 40–60 字，留給類別與用途），已寫進段落表 |
| 4 | SEO 可能要 FAQ（`FAQPage` 結構化資料） | 有搜尋子題對應時再加，答案只用已確認的事實（例如部署、WAF、TPS、AWS 的 Pod 限制 `fact:digirunner-aws-pod-limit`） | FAQ 不能只為了結構化資料存在；答案與第 4、7 段重複時刪段落內的重複句，不重複寫兩次 | 同意，而且本頁現在不加 FAQ。理由：一、Google 從 2023 年 8 月起只對知名的政府與醫療網站顯示 FAQ 複合式結果，本站加 `FAQPage` 拿不到搜尋結果上的展示；二、列出的答案（部署、WAF、TPS）第 4、5、7 段都已回答；三、Pod 限制是 AWS Marketplace 版本的條件，`/products/digirunner-cloud` 已有 `faq`，放在那裡 | 採納。不加 FAQ；Pod 限制留在雲端版頁 |
| 5 | 「API 管理 金融業」「銀行 API 平台」由金融頁還是這頁承接 | 金融頁承接產業框架，這頁第 6 段只寫規範對應的功能並連過去 | 避免兩頁寫同一段；`search-intent.md`「對應到頁面」也把這兩組主指金融頁 | 同意。兩頁的 title 也分開：本頁 title 不放「金融」，金融頁 title 不放「digiRunner」，避免兩頁搶同一組詞 | 採納。金融頁主要承接，本頁次要；本頁 title 不放「金融」 |
| 6 | 單獨查 `digiRunner` 的前幾名是同名遊戲 | 同意產品名一律帶類別詞 | 與 messaging 統一用詞「API 管理平台」一致，也解決現有 tagline 沒說類別的問題 | title、h1、hero 說明、站內錨點都讓「digiRunner」跟「API 管理平台」一起出現。hero 的 tagline 方向（「改寫成含類別詞的一句」）已符合，製作階段照做 | 採納。title、h1、hero 說明與站內錨點的 digiRunner 都跟「API 管理平台」或版本名一起出現 |
| 7 | 「開發者入口網站」是 `API 管理平台`、`API 管理 金融業`、`銀行 API 平台` 三組的共同子題，段落表沒有 | 加一項到第 2 段的清單，不加段落 | 自助註冊與登入是讓外部夥伴接上 API 的一步，屬於 `IT-4`（接上既有系統與夥伴）；但事實只寫到註冊與登入，不能寫成完整的開發者入口網站 | 不加段落列。事實庫只有「支援使用者自助註冊與登入」（`fact:digirunner-gov-portal`，出自政府頁）與沙盒（`fact:digirunner-sandbox`，第 9 段已用），撐不起一段。提議 content-strategist 考慮把 `fact:digirunner-gov-portal` 放進第 2 或第 5 段的清單；不放也可以 | 第 2 段清單加一項「使用者自助註冊與登入」（`fact:digirunner-gov-portal`），已寫進段落表；不用「開發者入口網站」一詞 |
| 8 | 現有頁面的四個「零」標題（零停機、零阻塞等）可能被當成關鍵字保留 | 拆掉 | 見「與 #167 之前頁面的差異」：「零失誤」沒有事實依據，四個口號各拆成回答一個 IT 主管疑問的段落 | 同意拆掉（「與 #167 之前頁面的差異」）。四個「零」不是任何查詢的用詞，拆成機制段落後，段落標題能用到「高可用」「負載平衡」「監控」等子題的用詞 | 採納。拆掉，段落標題用機制名稱 |
| 9 | 「與 #167 之前頁面的差異」寫相關文章「目前沒有文章」 | 陳述錯了，已修正；但不採用「填 `relatedPosts`」 | `OfferingTemplate.astro` 在 `relatedPosts` 列了 `relatedOfferings` 沒指到本頁的文章時會讓 build 失敗，而 `content-model.md`「offering」也規定關聯以 `blog.relatedOfferings` 為準、`relatedPosts` 只排序。所以只填 `relatedPosts` 會失敗，要在兩篇文章補 `relatedOfferings` | 不正確。`/blog/ai-gateway-for-enterprise-ai-security` 與 `/blog/ai-infrastructure-operations-governance` 是 2026 年的文章，內文都連到 `/products/digirunner`，只是沒填 `blog.relatedOfferings`，所以反查不到。建議在本頁填 `relatedPosts`（offering schema 已有這個欄位），或在兩篇文章填 `relatedOfferings`，讓第 3 段之後有相關文章；不另設段落 | 改做法：兩篇 blog 內容檔補 `relatedOfferings: [zh-TW/digirunner]`，本頁不填 `relatedPosts`（兩篇的順序照新到舊即可）。相關文章列為第 11 段，依據 `IT-6` |
| 10 | hero 的證據點「30 天免費試用」（`fact:digirunner-trial-30-days`）旁邊沒有條件，messaging `IT-7` 規定寫「免費」要連同 `fact:digirunner-cloud-trial-terms` 的條件（new-digirunner C3、「評審依據不足」第 3 項） | 以 messaging 為準。hero 不放這則，移到第 9 段和條件寫在一起；hero 的第二個證據點換成 `fact:digirunner-deployment` | `content-strategy` skill「2. Content brief」：段落的事實要符合 messaging 對那則事實的限制。`design-principles.md`「offering：digiRunner 產品頁」也建議條件放不下時移到第 9 段：條件原文約 50 字，比 hero 的說明句還長，放進第一屏會擠掉 h1 下方的說明。部署方式回答 IT 主管的第一個疑問「裝得進現有環境嗎」，也是 description 已寫的子題。hero 的試用按鈕只寫「試用 digiRunner on Cloud」，沒有「免費」，不受這條限制 | 同意。title 與 description 的方向本來就不寫「30 天免費」（「title 與 description 方向」），hero 跟著拿掉後，搜尋結果的摘要、第一屏與第 9 段三處說法一致。換上的部署方式是 `digiRunner API 管理平台` 與 `API 管理平台 比較` 的共同子題（本地、雲端、Kubernetes），放第一屏對這兩組比試用天數更有用 | 以 messaging 為準：hero 的證據點是 ISO27001、部署方式、DigiLism 專利數；「30 天免費試用」只出現在第 9 段，條件緊貼在旁 |
| 11 | 第 6 段寫「金融、政府各一項」，production 拆成 5 張卡；`fact:digirunner-oas` 不屬於金融也不屬於政府（new-digirunner「評審依據不足」第 4 項） | 改成一列一個規範的對應表，三列。5 張卡算偏離：其中兩張不是獨立的規範，三階段規範是台灣開放銀行同一套規範，OAS 是國際標準；卡片也是 `design-principles.md` 不用的版型 | 決策者要確認的是「哪個規範有被處理」，一列一個規範最好對照。`fact:digirunner-oas` 的來源是現站的政府 API 頁（`/products/open-government`），和 `fact:digirunner-ndc-spec` 同一頁，所以放在政府列，當共通性 API 規範的第二則原文；文案不寫成兩者有從屬關係（事實庫沒有） | 同意。一列一個規範時，規範名稱就是 `API 管理 金融業` 的子題用詞（金管會、開放銀行、金融檢查）與政府的共通性 API 規範，掃表就讀得到；也是 `digiRunner API 管理平台` 前幾名都沒有的「台灣法規的對應」。右欄連到產業頁的錨點照「內部連結」第 6 段，金融兩列只連一次。這段不寫「符合財金公司 Open API 規範」（`finance.md`「取捨」第 10 項） | 三列：台灣開放銀行（`fact:digirunner-open-banking-fsc`、`fact:digirunner-open-banking-3-stages`）、金融檢查（`fact:digirunner-financial-inspection`）、政府與公部門（`fact:digirunner-ndc-spec`、`fact:digirunner-oas`）。已寫進段落表 |
| 12 | brief 要求照原文列清單，評審不知道 C2 要看說明句還是整段（new-digirunner「評審依據不足」第 6 項） | 說明句寫讀者得到什麼，清單是事實原文；片段式的原文照 `site-research` skill 第 2 條拆成每行一項 | 事實庫的 `text` 在 #186 起可以加標點、用換行拆清單，字不改；清單讀得通之後，C2 要評的是表述的部分 | 同意。對 SEO 的影響在 heading：段落標題（h3）照段落表寫機制或問題（「部署環境由企業決定」「尖峰流量與單點故障」），new-digirunner S4 認為這些標題自己就說得出內容；清單項目不做成 heading。說明句寫讀者得到的答案，也比「以下列出」更能當搜尋摘要的候選句 | 寫法見「照原文列清單的段落」 |
| 13 | 第 2 段 production 寫「外部夥伴也能自己註冊、登入後接上 API」，比 `fact:digirunner-gov-portal` 原文多了「外部夥伴」「接上 API」（new-digirunner C3） | 只寫原文的「使用者自助註冊與登入」 | 多出的主詞與結果是新增事實；第 7 項已決定不寫成開發者入口網站 | 同意。這句對 SEO 只有一個作用：讓「開發者入口網站」這個共同子題在頁面上有一項對應（第 7 項）。照原文寫「使用者自助註冊與登入」就夠，多寫的主詞與結果不增加涵蓋，只增加事實風險 | 第 2 段不寫是誰註冊、註冊後做什麼。這句列進「不能寫的句子」 |
| 14 | brief 第 10 段的 Pharmacity 案例沒做出來（new-digirunner C3） | 放第 10 段，一列，不加內頁連結 | `fact:digirunner-case-pharmacity` 是 `IT-1`（雲端建構）唯一的具名案例，zh-TW 沒有案例檔，反查不到；用 `caseNotes` 列出（「schema 缺口」） | 同意。四列都帶客戶名，回答 `digiRunner API 管理平台` 前幾名都沒有的「具名的客戶案例」；Pharmacity 也補上雲端建構的案例。有案例頁的三列錨點照「內部連結」第 10 段（客戶名加案例標題），Pharmacity 那列沒有連結，不連到 `/success-story` 代替 | 第 10 段四列：台新銀行、臺北市政府、Pharmacity、安泰銀行 |
### 三件待決事項

`search-intent.md` 文末留給 seo-strategist 的三件事，在這裡一併決定（台灣開放銀行的部分也寫在 `finance.md`「取捨」）。「最後決定」欄由 content-strategist 定案，三項都採納 seo-strategist 的提議。

| # | 事項 | 限制 | seo-strategist 的提議 | 理由 | 最後決定 |
|---|---|---|---|---|---|
| 1 | 資訊型查詢要不要用 blog 承接 | 現站同主題的舊文章是 `drop`（2026-01-01 前的 blog 不遷移）；文章裡的數字、客戶名仍受事實規則管 | 用 blog 承接，但分三組處理：一、`API Gateway 是什麼`：新寫一篇，列為建議新增，文末連到本頁，本頁的 `relatedPosts` 也列進來；文章只寫通用概念（路由、認證授權、限流、快取、監控）與 digiRunner 已確認的功能，不需要新事實。二、`企業 AI 導入`：新寫一篇，連到 `/orient-ai`、`/aiso`；現有的 `/blog/what-is-ai-agent-management-platform` 寫的是 AI Agent 平台的導入步驟，範圍較窄，不拿它承接。三、台灣開放銀行制度：台灣三階段時程的四筆事實已改為 `confirmed`（#180，見 `finance.md`「待確認」第 2 項），可以寫文章，金融頁第 2 段也可以寫出年份 | 三組的前幾名都是教學、指南或新聞，產品頁、產業頁、首頁的段落要指到受眾任務，寫定義會偏離。開放銀行的繁中結果停在 2019 年前後，寫一篇更新的文章有機會，但時程不能用未確認的說法。三篇文章都不在 #165 範圍，建議另開 issue | 採納。用 blog 承接：`API Gateway 是什麼` 與 `企業 AI 導入` 各寫一篇（另開 issue，不在 #165），開放銀行的四筆時程事實已在 #180 確認，文章可以另開 issue 寫。新文章要連回本頁時，在文章填 `relatedOfferings`，不填本頁的 `relatedPosts`（取捨第 9 項） |
| 2 | 比較型查詢要不要新增比較頁 | 與 Kong 的比較事實都是 `to_confirm`；`nodes.csv` 沒有比較頁的節點 | 不新增比較頁，只在本頁處理：第 3、4、9 段寫 AI 功能、部署方式、授權與試用條件，對應比較文的選型子題。Kong 比較的事實決定不用（#180，「待確認」第 4 項），本頁不加比較段落；要比較兩家以上的產品時才考慮新節點 | 沒有已確認的比較基準，比較頁只剩表述，等於自己宣稱比較好，違反事實規則；繁中沒有比較文是機會，但要有可驗證的比較內容才能把握。單一競品的比較放產品頁就夠，新節點要改 IA | 採納。不新增比較頁；本頁第 3、4、9 段寫自己的選型條件；Kong 比較決定不用（#180） |
| 3 | digiRunner 開源版要不要有自己的頁面或段落 | 事實庫沒有開源版的條目；`nodes.csv` 沒有節點 | 現在不寫段落也不開頁面。請 researcher 從官方來源（`search-intent.md` 提到的產品文件 `docs.tpi.dev` 與開源專案頁）把開源版的授權與功能範圍收進 `scripts/strategy/facts-source.yaml`。確認後在第 9 段「先試用再決定」加一句，作為另一種試用方式，連到官方的開源專案頁（站外連結），不開獨立頁面 | 開源版的正式說明在產品文件與專案頁，官網再開一頁會跟它們重複，內容也會很薄；第 9 段回答的就是「導入前怎麼先試」，開源版放這裡最貼近 IT 主管的任務。`開源 API Gateway 推薦` 的前幾名是列表文，要進列表靠的是專案本身，不是官網的產品頁 | 採納。不開頁面也不寫段落；researcher 把開源版收進事實庫後，在第 9 段加一句並連到官方開源專案頁（站外連結）。#174 已收：製作階段可以在第 9 段加一句，寫開源版可以先自己裝來試，引用 `fact:digirunner-open-source` 與 `fact:digirunner-oss-license`（Apache License Version 2.0），連到 `https://tpi.dev/`（現站首頁 banner 與新聞 565 連的就是它）。開源版功能與跟 Enterprise、Cloud 版的差異沒有 zh-TW 事實，這句不寫功能範圍 |

## 待確認

#186 新增的項目。事實庫沒有這些內容，頁面不補、不寫成更強的說法（`design-principles.md`「案例列」）：

| # | 事項 | 卡在哪 | 影響的段落 |
|---|---|---|---|
| 8 | 安泰銀行 API 管理平台案例的成果 | 事實庫只有客戶名稱 `fact:client-entie-bank`，沒有這個案例的作業或成果原文。案例列這一列只放客戶名、案例標題與連結，成果那一行不放 | 10 |
| 9 | Pharmacity 案例的內頁 | zh-TW 沒有案例檔，這一列沒有內頁連結 | 10 |

### 已結算（#180）

原本的 7 項在 #180 結算（使用者決定，2026-11-02），編號保留，本文引用的「待確認第 N 項」對照下表：

| # | 事項 | 結果 |
|---|---|---|
| 1 | DigiLism 發明專利數（`fact:digilism-patents-7`） | 改為 `confirmed`（使用者決定的例外：現站沒寫統計時間，照現站的數字使用、不寫年份），可以當 hero 的第三個證據點（#183 已放） |
| 2 | 台新案例的獎項（`fact:award-global-finance-2020`） | 改為 `confirmed`，可以在第 10 段的台新案例加一句，寫出年份（#183 已放，寫在 `casesIntro`） |
| 3 | 「100% 合規」「國內唯一符合金管會法令」（`fact:digirunner-finance-compliance-100`、`fact:digirunner-insurance-compliance-100`、`fact:digirunner-claim-fsc-only`） | 不用，維持 `to_confirm`。第 6 段只用已確認的規範對應 |
| 4 | 與 Kong 的比較（`fact:digirunner-vs-kong-integration`、`fact:digirunner-vs-kong-adoption`、`fact:digirunner-vs-kong-visibility`、`fact:digirunner-vs-kong-compliance`、`fact:digirunner-vs-kong-operations`） | 不用，維持 `to_confirm`。不加比較段落 |
| 5 | 成效數字（`fact:digirunner-hot-deploy-50`、`fact:digirunner-uptime-999`） | 不用，維持 `to_confirm` |
| 6 | 地端版的試用入口 | 現站沒有資料，不處理。第 9 段與 hero 的次要 CTA 維持連到 `/products/digirunner-cloud` |
| 7 | digiRunner 白皮書的檔案位置 | 現站沒有資料，不處理。白皮書維持 draft，下載區不出現 |
