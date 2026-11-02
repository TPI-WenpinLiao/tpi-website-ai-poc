# Messaging framework（#165）

本站要說什麼、對誰說、用哪些事實撐住。試點三頁（`docs/strategy/site-profile.md`「試點頁面」）的 content brief 用本檔的主張 id（`DM-1`、`IT-2` 等）指回來。做法依 `.claude/skills/content-strategy/SKILL.md`「1. Messaging framework」。

- 範圍：zh-TW。en、vi 列為後續事項（`site-profile.md`「語系」）
- 事實一律寫成反引號包住的 `fact:` 加事實 id，對應 `docs/strategy/facts.yaml` 裡 `locale: zh-TW`、`status: confirmed` 的條目。`node scripts/strategy/facts.mjs` 會檢查每個引用
- 定位句與主張是表述，可以改寫；主張裡不放數字、客戶名或最高級說法，這些只能出現在引用的事實裡
- 受眾依 `docs/research/audience-and-goals.md`：主要受眾是金融、政府與公部門、製造業的決策者與 IT 主管，主要轉換是聯絡業務。定位句只點名金融與政府（使用者決定，#165），理由見「定位不說的事」

## 定位

> 昕力資訊研發並導入自有軟體，幫金融機構與政府單位把 API、資料與 AI 安全接進既有系統；金融與政府的規範要求，直接做在產品功能裡。

短版（給 brief 寫 hero 方向時參考，實際文案由 brief 與製作階段決定）：替金融與政府，把 API 與 AI 安全接進既有系統。

### 定位句的依據

| 定位句的部分 | 事實 | `competitors.md` 的觀察 |
|---|---|---|
| 研發並導入自有軟體 | `fact:products-families`、`fact:company-offerings`、`fact:aiso-onboarding` | 「選擇理由」：叡揚 GSS 也是自家產品加導入服務，模式最接近。所以「自有產品加導入」本身不是差異，差異在下兩列 |
| 金融與政府 | `fact:company-industries`、`fact:aiso-industries` | 「比較」表的「定位說法」：四家都沒在定位句寫服務對象。「本站缺」第 1 項：第一屏點出產業可能是區隔的機會；「本站已有」第 2 項：產業入口可能是差異點 |
| 把 API、資料與 AI 接進既有系統 | `fact:digilism-protocol-integration`、`fact:digilism-family-digirunner`、`fact:digirunner-ai-gateway` | 「比較」表的「定位說法」：SYSTEX 只有短標，GSS 寫服務分類，Syscom 只有單一服務 banner，FPT 寫 AI 定位，都沒寫具體做什麼 |
| 規範要求做在產品功能裡 | `fact:digirunner-open-banking-fsc`、`fact:digirunner-financial-inspection`、`fact:digirunner-ndc-spec` | 「比較」表的「定位說法」：四家的定位句都沒提到法規或合規（本檔的推論，依該列記錄的內容） |

### 定位不說的事

- 不說「第一」「唯一」「領先」「頂尖」：事實庫沒有 `confirmed` 的依據，見「缺少證據的主張」
- 不點名製造業（使用者決定，#165）：製造業的證據只有產業清單，沒有製造業案例（「缺少證據的主張」第 13 項），`/industries/manufacturing` 也是 draft、沒有頁面。定位句、hero 與產業入口都只寫金融與政府。GreenSwift 的碳盤查改由 `DM-7` 以 ESG 產品的角度說，不框成製造業的主張

## 價值主張：決策者

給 CIO、CTO、高階主管。他們來官網了解產品與方案、找成功案例、決定要不要聯絡業務（`audience-and-goals.md`「受眾分群」）。主張回答「選昕力，我的組織得到什麼、風險在哪裡被處理掉」。

### DM-1 金融與政府的規範要求，已經做在產品裡

導入 digiRunner 時，開放銀行、金融檢查與政府 API 規範的要求已有對應功能，專案不必從零設計合規架構，昕力的顧問也協助規劃。

- `fact:digirunner-open-banking-fsc`：digiRunner 反應台灣開放銀行的金管會法規要求
- `fact:digirunner-open-banking-3-stages`：實現三階段開放銀行規範
- `fact:digirunner-financial-inspection`：針對金融檢查列出的 API 管理作業
- `fact:digirunner-ndc-spec`：符合國發會共通性應用程式介面規範
- `fact:digirunner-open-banking-consulting`：顧問團隊協助規劃符合各國開放銀行規範的技術架構
- `fact:digirunner-case-taipei-city`：為臺北市政府建置符合統一標準的 API 管理平台，並協助建立 API 管理制度（具名案例）

用在：`/industries/finance`、`/products/digirunner`。對應 `search-intent.md` 的「API 管理 金融業」（共同子題含台灣法規）。

### DM-2 AI 用在理賠、建檔、阻詐這類核心作業，成果寫得出來

昕力的 AI 不停在展示，已用在金融保險的日常作業，案例有可以引用的成果。

- `fact:smartclaim-result`：理賠立案到派件自動化的成果
- `fact:smartfilling-result`：免模板辨識醫療單據的成果
- `fact:smartfilling-case-bank`：金融業以 AI 取代傳統二登流程的成果
- `fact:fraud-platform-result`：金融聯防阻詐平台的成果
- `fact:smartclaim-case-medical-documents`：以自然語言技術分析診斷證明書等文件

用在：`/`、`/industries/finance`。`competitors.md`「本站已有」第 1 項：GSS、FPT 也把案例成果放在首頁前段，這是基本盤，不是差異點。

### DM-3 企業 AI 留在自己的環境，資料、權限與用量都在掌控內

OrientAI 部署在企業端，資料不交給外部；權限、影子 AI 與 Token 用量都有管控。

- `fact:orientai-on-prem-data`：OrientAI 只部署於企業端，資料掌控權為企業所有
- `fact:orientai-governance-layer`：Agent 統一管控、Token 用量監控、消除影子 AI
- `fact:orientai-governance`：AI 治理
- `fact:orientai-token-cost`：Token 成本控管
- `fact:orientai-aidaptiv`：結合群聯 aiDAPTIV，地端架構離線仍可運行
- `fact:aiso-no-token-limit`：地端 AI 不限 Token 流量

用在：`/`。對應 `search-intent.md` 的「企業主權 AI 地端部署 方案」（共同子題：資料主權、部署形式）。

### DM-4 產品與導入由同一家公司負責

昕力自己研發產品，也負責導入規劃、建置與顧問，決策者不必在產品原廠與導入廠商之間協調。

- `fact:company-offerings`：從企業服務中台、交談式 AI、雲服務到軟體解決方案
- `fact:products-families`：四個自有產品家族
- `fact:aiso-onboarding`：導入規劃、模型設定、建置與應用模組設計服務
- `fact:systalk-ai-onboarding`：導入前的情境分析、效益評估，導入中的模型評估與微調
- `fact:digirunner-open-banking-consulting`：顧問團隊協助規劃技術架構
- `fact:digirunner-case-taipei-city`：昕力顧問團隊協助臺北市政府建立 API 管理制度，輔導各機關導入上線（具名案例）

用在：`/`、`/industries/finance`。

### DM-5 保險業務有專用的產品模組

保險公司與保經代不必從通用平台改起：昕力有依保險業務拆好的模組與規則引擎。

- `fact:insurebrick-platform`：專為產壽險公司及保經代打造的保險科技平台
- `fact:insurebrick-28-modules`：模組數量
- `fact:insurebrick-scenarios`：適用的保險場景
- `fact:insurering-rule-engine`：保險產業的規則引擎
- `fact:insurering-automated-rules`：自動化檢核因應商品上下架、核保規則與法令
- `fact:insurebrick-case-online-insurance`：以微服務建立網路投保平台的案例
- `fact:insurebrick-case-shin-kong`：新光金保代核心系統以 InsureBrick 模組整合業務流程（具名案例）
- `fact:insurering-case-shin-kong-life`：為新光人壽建置集中化規則引擎的成果（具名案例，數字照事實原文引用）

用在：`/industries/finance`。InsureBrick、InsureRing 仍在銷售（使用者確認，#165）；`docs/ia/nodes.csv` 已改為「仍在銷售」。

### DM-6 合作對象的穩定度看得到

成立年份、海外子公司、資安認證、雲端夥伴關係，以及外部單位對公司本身的評選，讓決策者評估長期合作的風險。

- `fact:company-founded`：創立年份
- `fact:company-subsidiaries-sg-vn`：新加坡與越南子公司
- `fact:company-milestone-2020-brand`：以 TPIsoftware 品牌進入國際
- `fact:cert-iso27001-product-platform`：企業產品中台的開發流程獲 ISO27001 認證
- `fact:company-google-cloud-partner`：Google Cloud 合作夥伴
- `fact:company-milestone-2008-finance`：2008 年首度跨足金融產業（具名客戶，#165 起已確認）
- `fact:award-ft-high-growth-2022`：入選英國金融時報亞太地區快速成長企業（公司獎，#182）
- `fact:award-cx-asia-2021`：新加坡 CX Asia Excellence Awards 的供應商獎（公司獎，#182）

兩筆公司獎放在這裡、不放 `DM-8` 的理由：它們評的是昕力這家公司的成長與供應商表現，回答的是本主張的問題（這家公司能不能長期合作），不是某個產品好不好用。頁面引用時寫出年份（使用者決定，#180）。

用在：`/`。`competitors.md`「本站缺」第 2 項：新站首頁沒有第三方證據；這組與具名案例（`DM-1`、`DM-5` 的案例事實）是首頁能用的信任證據。產品獲獎另列為 `DM-8`（#182），首頁的信任段可以兩條一起用。

### DM-7 碳盤查、產品碳足跡與 CBAM 申報有現成工具

要做溫室氣體盤查或回應 CBAM 的企業，有現成工具可用。GreenSwift 處理跨地區、跨據點的碳盤查、產品碳足跡與 CBAM 申報資料，內建常用的盤查標準。不點名產業（使用者決定定位句不保留製造業，#165）。

保留這條、不刪的理由：ESGswift 是四個自有產品家族之一，首頁第 4 段要寫它解決什麼問題，需要一條有證據的主張；事實都已確認，問題只在原本把它框成製造業。

- `fact:greenswift-scope`：碳盤查、CBAM、碳足跡的範圍，含跨地區、廠區、設備
- `fact:greenswift-cbam-plan`：提供進出口供應鏈符合 CBAM 要求的數據
- `fact:greenswift-standards`：內建 GHG Protocol 與 ISO 14064-1 標準，定期更新 IPCC 係數
- `fact:cert-greenswift-aup`：通過國際查證機構核發的 AUP 認證

用在：`/` 的 ESG 產品家族段。

### DM-8 自有產品經過外部單位評選

digiRunner、SysTalk 等自有產品經過國內外單位評選，決策者評估產品時，有昕力以外的說法可以參考。

- `fact:award-taiwan-excellence-2023`：digiRunner、digiLogs、SysTalk.Chat 獲台灣精品獎
- `fact:award-taiwan-excellence-2024`：digiRunner、digiLogs、SysTalk.ai 獲台灣精品獎
- `fact:award-innovative-business-2022`：創新商務獎，digiRunner 與 SysTalk.Chat 各獲一個獎項
- `fact:award-global-finance-2020`：台新銀行以 digiRunner 建置的平台獲 Global Finance 獎項（具名案例的獎）

新增這條、不併進 `DM-6` 的理由：決策者來官網的任務是「了解產品與方案、找成功案例」與「決定要不要聯絡業務」（`audience-and-goals.md`「受眾分群」）。`DM-6` 回答後者裡「這家公司能不能長期合作」，產品獎回答的是前者「這個產品有沒有外部肯定」，而且每一筆都點名產品，用在產品頁比用在公司介紹更直接。併進 `DM-6` 會讓一條主張同時說公司與產品，brief 挑證據時分不開。

寫法：

- 頁面引用時寫出年份（使用者決定，#180），照事實原文寫獎名與得獎產品，不合併成「屢獲大獎」這類說法
- 獎名裡的「最佳技術創新獎」「最佳產品創新獎」是事實原文，只能出現在引用 `fact:award-innovative-business-2022` 的地方；標題、引言與 CTA 不用「最佳」
- `fact:award-global-finance-2020` 是台新案例平台的獎，頁面放在台新案例旁（`IT-4` 的 `fact:digirunner-case-taishin`），不單獨列成產品獎

沒收進這條的有年份獎項：

- `fact:award-gartner-cool-vendor-2018`：不用在試點頁。決策者評估的是現在的產品，這筆是 2018 年對 AI Chatbot 產品的肯定，得獎產品不是現行產品家族的名稱，和 2023、2024 的獎並列寫出年份時，讀者會先看到它的年份久。留給公司沿革（關於我們的里程碑）使用
- `fact:award-sbir-2022`、`fact:award-digital-finance-2021`：不用。確認的原文只有年份與獎名，沒寫得獎的產品或類別；寫出產品或類別的同一個獎（事實庫的 `award-sbir-29`、`award-digital-finance-1st`）沒寫年份，仍是 `to_confirm`，頁面不能拿來補。「第一屆」也容易被讀成最高級說法
- `fact:award-104-employer-2024`：不用。雇主品牌獎回答的是求職者的問題，求職者不在本站受眾內（`audience-and-goals.md`「受眾分群」）

用在：`/products/digirunner`（台灣精品獎、創新商務獎點名 digiRunner；Global Finance 的獎放在第 10 段台新案例旁）、`/`（信任段，和 `DM-6` 一起用）。

## 價值主張：IT 主管

給 IT 主管與專案負責人。他們要確認產品裝得進現有環境、資安過得了關、上線後維運得動。主張回答「導入後我的團隊要承擔什麼」。

### IT-1 部署環境由企業決定

digiRunner 與 DigiLism 可裝在地端、雲端或 Kubernetes，多雲與混合雲都支援。

- `fact:digirunner-deployment`：支援地端、雲端部署及 K8s 微服務架構
- `fact:digirunner-multi-cloud`：支援多雲和混合雲，整合 Kubernetes
- `fact:digirunner-cloud-platforms`：雲端版支援的雲平台
- `fact:digilism-ipaas`：DigiLism 可在雲端、地端及混合環境部署
- `fact:digilism-system-integration`：支援地端、雲端、混合與多雲架構，介接傳統 ESB
- `fact:digirunner-case-pharmacity`：為 Pharmacity 在雲端建構 API 管理平台（具名案例）

用在：`/products/digirunner`。

### IT-2 安全機制內建，對應常用的認證與加密標準

API 的存取防護、認證授權與加密（digiRunner），以及使用者的身分驗證（gadoDIDO），都不必另外拼裝；產品本身通過資安或 FIDO 認證。

- `fact:digirunner-zero-trust`：零信任的 API 存取防護，支援 OIDC、OAuth2
- `fact:digirunner-security`：OAuth 2.0、OIDC、API Key、mTLS、JWT、HSM 介接
- `fact:digirunner-auth-methods`：支援的認證方式與 JWS、JWE 加解密
- `fact:digirunner-open-banking-security`：傳輸層、資料層、行為層的資安防護
- `fact:digirunner-gov-threat-protection`：識別程式碼注入、XSS、SQL 攻擊等威脅
- `fact:cert-iso27001-digirunner`：通過 ISO27001 資訊安全認證
- `fact:gadodido-fido-certified`：gadoDIDO 是通過 FIDO 認證的身分驗證應用
- `fact:gadodido-passwordless`：FIDO2 無密碼、零信任身分驗證
- `fact:gadodido-mfa`：結合 FIDO2、UAF 生物辨識與多因子核身流程
- `fact:gadodido-device-only-data`：個人驗證資料只存放在用戶裝置

用在：`/products/digirunner`、`/industries/finance`（金融頁第 2 段用 digiRunner 的事實，第 5 段用 gadoDIDO 的事實）。

### IT-3 尖峰流量與單點故障有機制處理

高可用架構、自動分流與橫向擴展是內建功能，不靠事後補強。

- `fact:digirunner-zero-downtime`：雲原生容器化、橫向擴展叢集、高可用性架構
- `fact:digirunner-failover`：伺服器故障時自動分流，無需人為操作
- `fact:digirunner-container-scaling`：依尖、離峰動態擴充或縮減
- `fact:digirunner-load-balancing`：內建負載平衡，介面設定即時啟動
- `fact:digirunner-smart-caching-patent`：專利智慧快取，依負載動態儲存多節點數據
- `fact:digirunner-redis-storage`：資料庫配置與金融業常用的 Active/Standby 架構
- `fact:digirunner-tps`：硬體規格與每秒交易量（要連同「取決於環境配置」的條件一起寫）

用在：`/products/digirunner`。

### IT-4 接上既有系統，不必先汰換

核心系統、大型主機與各種協定可以透過 API 接進來，既有的 WAF 也能沿用。

- `fact:digilism-protocol-integration`：處理核心銀行系統或大型主機的資料轉換與通訊機制，可代替 ESB
- `fact:digirunner-api-composer`：拖拉組合 API，支援多種格式轉換
- `fact:digirunner-gov-protocols`：圖形化串接 DB、FTP 等協定，支援 JSON、XML、SOAP 轉換
- `fact:digirunner-nginx-waf`：可整合現有的 WAF 廠商
- `fact:insurebrick-buy-modules`：只買需要的模組，可串接內外部系統
- `fact:digirunner-case-taishin`：與台新銀行以 digiRunner 開發 API 管理平台，整合現金管理業務模組（具名案例）

用在：`/`、`/products/digirunner`、`/industries/finance`。

### IT-5 API 與 AI 的使用軌跡都看得到

即時監控、告警與完整日誌，出問題時查得到來源，稽核時拿得出紀錄。

- `fact:digirunner-console`：即時主控台保留 API 活動與軌跡
- `fact:digirunner-low-code`：即時監控 API 運行與異常告警
- `fact:digirunner-cloud-opensearch`：可視化的 OpenSearch 圖表
- `fact:digirunner-ai-usage-log`：記錄所有 AI 使用歷程，符合監管要求
- `fact:digilism-log-audit`：集中控管各系統日誌，即時監控告警

用在：`/products/digirunner`。

### IT-6 AI 流量和 API 走同一道 Gateway 管理

企業接 AI 模型時，負載、權限、內容審查與流量監控沿用 API 管理的同一套機制。

- `fact:digirunner-ai-gateway`：AI Gateway 的負載平衡、安全防護與監控
- `fact:digirunner-ai-model-config`：依需求調配不同 AI 模型
- `fact:digirunner-ai-content-review`：輸入與輸出前自動檢測不適當內容
- `fact:digirunner-ai-traffic`：整合企業內部 AI 應用，即時監控 AI 流量
- `fact:digirunner-ai-governance`：AI Governance 確保 AI 應用合規
- `fact:digilism-family-digirunner`：整合 MCP 協定與 AI Gateway 架構

用在：`/products/digirunner`、`/`。

### IT-7 先試用再決定

IT 團隊可以在不影響現行服務的環境裡先試完整功能，再決定要不要導入。

- `fact:digirunner-trial-30-days`：免費試用
- `fact:digirunner-trial-all-features`：試用期間各方案功能皆可使用，不收授權費
- `fact:digirunner-cloud-trial-full`：雲端版完整功能試用
- `fact:digirunner-cloud-trial-terms`：試用條件（AWS 仍收基礎設施費用、到期自動轉付費），寫「免費」時要一起寫
- `fact:digirunner-sandbox`：沙盒讓開發人員在不影響現行服務下測試

用在：`/products/digirunner`（次要轉換：試用）。

### IT-8 AI 模型可選，核心演算法自研

企業可以依場景選模型、用 MCP 擴充；理賠與建檔用的 NLP、OCR 是昕力自己的演算法。

- `fact:aiso-llm-support`：支援主流開源與企業級 LLM，依場景選模型
- `fact:orientai-execution-layer`：整合多種大語言模型，支援雲地部署
- `fact:orientai-mcp`：MCP 擴充應用
- `fact:smartclaim-nlp`：自主研發的 NLP 技術
- `fact:smartfilling-icr-puzzle`：自建 AI 演算法模型與再訓練機制
- `fact:smartfilling-template-free`：不需依文件版型建立模板

用在：`/`、`/industries/finance`。

## 證據對照表

每個主張的證據數與試點頁。少於 2 個 `confirmed` 事實的主張不列在這裡，改列在「缺少證據的主張」。

| 主張 | 事實 id | 數量 | 試點頁 |
|---|---|--:|---|
| DM-1 規範要求做在產品裡 | `fact:digirunner-open-banking-fsc`、`fact:digirunner-open-banking-3-stages`、`fact:digirunner-financial-inspection`、`fact:digirunner-ndc-spec`、`fact:digirunner-open-banking-consulting`、`fact:digirunner-case-taipei-city` | 6 | 金融、digiRunner |
| DM-2 AI 用在核心作業 | `fact:smartclaim-result`、`fact:smartfilling-result`、`fact:smartfilling-case-bank`、`fact:fraud-platform-result`、`fact:smartclaim-case-medical-documents` | 5 | 首頁、金融 |
| DM-3 AI 留在企業端 | `fact:orientai-on-prem-data`、`fact:orientai-governance-layer`、`fact:orientai-governance`、`fact:orientai-token-cost`、`fact:orientai-aidaptiv`、`fact:aiso-no-token-limit` | 6 | 首頁 |
| DM-4 產品與導入同一家 | `fact:company-offerings`、`fact:products-families`、`fact:aiso-onboarding`、`fact:systalk-ai-onboarding`、`fact:digirunner-open-banking-consulting`、`fact:digirunner-case-taipei-city` | 6 | 首頁、金融 |
| DM-5 保險專用模組 | `fact:insurebrick-platform`、`fact:insurebrick-28-modules`、`fact:insurebrick-scenarios`、`fact:insurering-rule-engine`、`fact:insurering-automated-rules`、`fact:insurebrick-case-online-insurance`、`fact:insurebrick-case-shin-kong`、`fact:insurering-case-shin-kong-life` | 8 | 金融 |
| DM-6 穩定度看得到 | `fact:company-founded`、`fact:company-subsidiaries-sg-vn`、`fact:company-milestone-2020-brand`、`fact:cert-iso27001-product-platform`、`fact:company-google-cloud-partner`、`fact:company-milestone-2008-finance`、`fact:award-ft-high-growth-2022`、`fact:award-cx-asia-2021` | 8 | 首頁 |
| DM-7 碳盤查與 CBAM 工具 | `fact:greenswift-scope`、`fact:greenswift-cbam-plan`、`fact:greenswift-standards`、`fact:cert-greenswift-aup` | 4 | 首頁 |
| DM-8 產品經過外部評選 | `fact:award-taiwan-excellence-2023`、`fact:award-taiwan-excellence-2024`、`fact:award-innovative-business-2022`、`fact:award-global-finance-2020` | 4 | digiRunner、首頁 |
| IT-1 部署環境自選 | `fact:digirunner-deployment`、`fact:digirunner-multi-cloud`、`fact:digirunner-cloud-platforms`、`fact:digilism-ipaas`、`fact:digilism-system-integration`、`fact:digirunner-case-pharmacity` | 6 | digiRunner |
| IT-2 安全機制內建 | `fact:digirunner-zero-trust`、`fact:digirunner-security`、`fact:digirunner-auth-methods`、`fact:digirunner-open-banking-security`、`fact:digirunner-gov-threat-protection`、`fact:cert-iso27001-digirunner`、`fact:gadodido-fido-certified`、`fact:gadodido-passwordless`、`fact:gadodido-mfa`、`fact:gadodido-device-only-data` | 10 | digiRunner、金融 |
| IT-3 尖峰與故障 | `fact:digirunner-zero-downtime`、`fact:digirunner-failover`、`fact:digirunner-container-scaling`、`fact:digirunner-load-balancing`、`fact:digirunner-smart-caching-patent`、`fact:digirunner-redis-storage`、`fact:digirunner-tps` | 7 | digiRunner |
| IT-4 接既有系統 | `fact:digilism-protocol-integration`、`fact:digirunner-api-composer`、`fact:digirunner-gov-protocols`、`fact:digirunner-nginx-waf`、`fact:insurebrick-buy-modules`、`fact:digirunner-case-taishin` | 6 | 首頁、digiRunner、金融 |
| IT-5 軌跡看得到 | `fact:digirunner-console`、`fact:digirunner-low-code`、`fact:digirunner-cloud-opensearch`、`fact:digirunner-ai-usage-log`、`fact:digilism-log-audit` | 5 | digiRunner |
| IT-6 AI 走同一道 Gateway | `fact:digirunner-ai-gateway`、`fact:digirunner-ai-model-config`、`fact:digirunner-ai-content-review`、`fact:digirunner-ai-traffic`、`fact:digirunner-ai-governance`、`fact:digilism-family-digirunner` | 6 | digiRunner、首頁 |
| IT-7 先試用 | `fact:digirunner-trial-30-days`、`fact:digirunner-trial-all-features`、`fact:digirunner-cloud-trial-full`、`fact:digirunner-cloud-trial-terms`、`fact:digirunner-sandbox` | 5 | digiRunner |
| IT-8 模型可選、演算法自研 | `fact:aiso-llm-support`、`fact:orientai-execution-layer`、`fact:orientai-mcp`、`fact:smartclaim-nlp`、`fact:smartfilling-icr-puzzle`、`fact:smartfilling-template-free` | 6 | 首頁、金融 |

試點頁各自主要用的主張（brief 從這裡挑，不必全用）：

| 試點頁 | 主要主張 | 次要主張 |
|---|---|---|
| `/` | DM-2、DM-3、DM-4、DM-6 | DM-7、DM-8、IT-4、IT-6、IT-8 |
| `/products/digirunner` | IT-1、IT-2、IT-3、IT-6、IT-7 | DM-1、DM-8、IT-4、IT-5 |
| `/industries/finance` | DM-1、DM-2、DM-5 | DM-4、IT-2、IT-4、IT-8 |

## 語氣與用詞

規則照 `.claude/skills/writing-style/SKILL.md`（含「網站文案」）。本節只補本站特有的部分。

### 語氣

- 對決策者寫結果與風險：做了什麼、處理掉哪個風險。對 IT 主管寫機制：支援什麼、怎麼運作、要什麼條件
- 寫產品做的事，不寫形容詞。「內建負載平衡，介面設定即時啟動」優於「強大穩定的平台」
- 數字只出現在引用的事實裡，連同事實裡的條件一起寫（例如 `fact:digirunner-tps` 的「取決於不同環境的配置」、`fact:digirunner-cloud-trial-terms` 的費用說明）
- 稱呼讀者用「您」或直接省略主詞，不用「你」；稱公司用「昕力」或「昕力資訊」，不用「我們」開頭的長句

### 產品與公司名寫法

照官方寫法，不翻譯、不改大小寫。以 `facts.yaml` 與 `docs/ia/nodes.csv` 的名稱為準。

| 寫法 | 不要寫成 |
|---|---|
| 昕力資訊（TPIsoftware）：頁面第一次出現時並列，之後用「昕力」或「昕力資訊」 | TPI Software、TPISoftware、昕力軟體 |
| digiRunner、digiRunner Cloud | DigiRunner、Digirunner、digirunner |
| DigiLism（產品家族） | digiLism、Digilism |
| digiLogs、digiMars、digiFlexis、digiCare | DigiLogs、Digimars |
| SysTalk.ai（產品家族）、SysTalk.Chat、SysTalk.VIKI、SysTalk.ICR、SysTalk.RPA、SysTalk.Coach、SysTalk.Audit | Systalk、SysTalk AI、SysTalk.AI |
| OrientAI | Orient AI、orientAI |
| ESGswift（產品家族）、GreenSwift、ElectriSwift | ESGSwift、Greenswift |
| GadoSecurity（產品家族）、gadoDIDO、gadoScout | GADO、GadoDIDO |
| InsureBrick、InsureRing | Insurebrick |
| 群聯 aiDAPTIV | aiDaptiv、AIDAPTIV |

### 統一用詞

同一個東西全站只用一個名稱。左欄是本站用法；事實原文的用詞不改（事實照 `text` 引用）。

| 用 | 不用 | 說明 |
|---|---|---|
| API 管理平台 | API 管理系統、APIM（首次出現） | digiRunner 的類別名，與 `nodes.csv` 一致；`search-intent.md` 的類別詞也是這個 |
| 地端 | 本地端、落地 | 事實庫多用「地端」 |
| 混合雲 | 雲地混和、地雲混合 | 表述統一用「混合雲」 |
| 部署 | 佈署、布署 | 事實原文有「佈署」，表述用「部署」 |
| 生命週期 | 生命周期 | |
| 開放銀行 | Open Banking（表述中） | 頁面第一次出現可並列英文 |
| 第三方服務業者（TSP） | 第三方業者、TSP（首次出現） | |
| 導入 | 落地、實施 | 「導入」是昕力與受眾的慣用說法 |
| 產品家族 | 產品系列、產品線（表述中） | 與首頁（`src/data/home/zh-TW.ts`）和 `nodes.csv` 的 `family-*` 節點一致；事實原文的「產品系列」照引 |

### 本站不用的字

`writing-style` 的 AI 高頻詞（賦能、打造、無縫、全方位、一站式等）都不用。本站另外要注意：

- 「賦能」「頂尖科技」：現行首頁 hero 與 meta 的用詞（`src/data/home/zh-TW.ts`），改寫時換掉
- 「第一」「唯一」「領先」「領導」「最佳」「國內首創」：最高級說法，事實庫沒有 `confirmed` 的依據
- 「100% 合規」「100% SLA」：現站有這些說法，但都是 `to_confirm`，見下節
- 「一站式」「無縫」：出現在部分事實原文（例如 `fact:digirunner-five-applications`、`fact:digirunner-cloud-20-minutes`），引用事實時保留原文，表述不用
- 「解決方案」：只用在產品或節點的正式名稱（例如「AI 智能理賠解決方案」），表述寫具體做什麼
- 「數位轉型」：只當產品家族名稱與搜尋詞用，不當價值主張（`search-intent.md`「企業數位轉型 軟體公司」的前幾名是定義文，這個詞說不出昕力的差異）

## 缺少證據的主張

想說但找不到 `confirmed` 事實的主張。這些不寫進上面的主張，也不寫進頁面文案。下表「相關事實」欄的事實 id 是 `to_confirm`，列出來是為了說明卡在哪（「卡在哪」欄提到的是已確認、可以用的事實）；要用時由人工確認後改 `scripts/strategy/facts-source.yaml` 並重跑 `node scripts/strategy/extract-facts.mjs`。

| # | 想說的主張 | 卡在哪 | 相關事實 |
|---|---|---|---|
| 1 | 昕力是台灣第一或領先的企業軟體公司 | 最高級自我宣稱，現站沒有排名依據 | `fact:company-claim-taiwan-first` |
| 2 | 規模：員工數、累積專案數、AI 服務用戶數 | 員工數已解決：原文寫出 2020 年，改為 `confirmed`，引用時寫出年份（使用者決定，#180）。專案數那句沒有年份，使用者決定不用；AI 服務用戶數沒寫統計時間，仍不能用 | `fact:company-projects-400`、`fact:systalk-ai-140-million-users` |
| 3 | 產品獲獎肯定（台灣精品獎、Gartner Cool Vendor 等） | 已升成主張，見 `DM-8`（產品獎）與 `DM-6`（公司獎）（#182）。有年份的獎項改為 `confirmed`，引用時寫出年份（使用者決定，#180）；哪些有年份的獎項不用、理由見 `DM-8`「沒收進這條的有年份獎項」。沒寫年份的 Best in Singapore、GoodFirms 仍不能用 | `fact:award-best-in-singapore`、`fact:award-goodfirms-software`、`fact:award-goodfirms-mobile` |
| 4 | 客戶證言（含說話人姓名與職稱） | 大部分已解決：使用者決定現站寫出的客戶名稱、證言與說話人姓名、職稱都視為已授權（#165），例如 `fact:testimonial-shin-kong-bank`、`fact:testimonial-excellence-wire` 已是 `confirmed`，可以當決策者「找成功案例」的第三方說法用。仍卡住的三則是因為內容：國泰金控的證言含當時的 50% 用戶服務量，可能過時；政大金融科技研究中心的證言有「第一家」、委外服務頁的國泰證言摘錄有「最佳技術」，都是最高級說法 | `fact:testimonial-cathay-fhc`、`fact:testimonial-nccu-fintech`、`fact:testimonial-cathay-fhc-excerpt` |
| 5 | digiRunner 是國內唯一符合金管會法令、100% 合規的 API 管理平台 | 最高級說法與 100% 都沒有依據。DM-1 只用「反應法規要求」「針對金融檢查」等已確認的說法。決定不用（使用者決定，#180） | `fact:digirunner-claim-fsc-only`、`fact:digirunner-finance-compliance-100`、`fact:digirunner-claim-gov-compliance-100` |
| 6 | digiRunner 比 Kong 好導入、好維運、更合規 | 與競品的比較沒有依據或比較日期；`search-intent.md` 的「Kong 替代方案 API Gateway」是比較型查詢，確認後可給 digiRunner 頁接住。決定不用，不加比較段落（使用者決定，#180） | `fact:digirunner-vs-kong-integration`、`fact:digirunner-vs-kong-adoption`、`fact:digirunner-vs-kong-compliance`、`fact:digirunner-vs-kong-operations` |
| 7 | 成效數字：開發效率提升、正常運行時間、OrientAI 的效率與成本改善、InsureRing 上架時間 | 沒有量測方式或比較基準（#164 的宣稱規則）。首頁案例的 `fact:smartclaim-result` 已確認，可以用；理賠解決方案頁的同類數字還沒有。InsureRing 的具名案例成果（`fact:insurering-case-shin-kong-life`）已確認，產品頁的「上架縮短 90%」仍未確認。決定不用（使用者決定，#180） | `fact:digirunner-hot-deploy-50`、`fact:digirunner-uptime-999`、`fact:orientai-benefits`、`fact:insurering-90-percent`、`fact:smartclaim-80-percent` |
| 8 | DigiLism 擁有多項發明專利 | 已解決：`fact:digilism-patents-7` 改為 `confirmed`，現站沒寫統計時間，照現站的數字使用、不寫年份（使用者決定的例外，#180）。個別功能「具專利技術」的說法已確認（#165）；熱部署的「提升高達 50%」不用 | 無 |
| 9 | 搭配群聯 aiDAPTIV 的地端 AI 比其他硬體更快、能跑更大的模型 | 合作夥伴提供的估算與點名競品的比較，要確認授權與量測條件 | `fact:aiso-10x-dell-hpe`、`fact:aiso-52-to-2-seconds`、`fact:aiso-70b-on-4-gpus` |
| 10 | 台灣開放銀行的三階段時程 | 已解決：四筆時程改為 `confirmed`，可以寫出年份（使用者決定，#180） | 無 |
| 11 | 在東南亞與東北亞多國設有據點 | 據點清單兩處說法不一致（有沒有泰國）。DM-6 改用已確認的新加坡、越南子公司 | `fact:company-asia-presence`、`fact:company-offices-overseas` |
| 12 | digiRunner 有開源版，可以先自己裝來試 | 事實庫沒有開源版的條目。`search-intent.md` 的「開源 API Gateway 推薦」與 `digiRunner API 管理平台` 結果提到開源專案頁，要先從現站或官方來源收進事實庫 | 無 |
| 13 | 製造業有導入案例與成果 | 事實庫只有產業清單（`fact:company-industries`）與 GreenSwift 功能，沒有製造業案例；`nodes.csv` 寫製造業頁「需人工提供」。因此定位句不點名製造業（使用者決定，#165）。現站沒有資料，不處理（使用者決定，#180） | 無 |
| 14 | 聯絡後多久回覆 | `audience-and-goals.md` 問題 3 未回答。`competitors.md`「本站缺」第 3 項：FPT 在聯絡頁寫明回覆時間。現站沒有資料，不處理；聯絡段不寫回覆時間（使用者決定，#180） | 無 |
