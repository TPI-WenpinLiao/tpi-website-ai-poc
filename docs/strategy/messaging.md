# Messaging framework（#165）

本站要說什麼、對誰說、用哪些事實撐住。試點三頁（`docs/strategy/site-profile.md`「試點頁面」）與第一批 7 頁（同檔「第一批」）的 content brief 用本檔的主張 id（`DM-1`、`IT-2` 等）指回來。做法依 `.claude/skills/content-strategy/SKILL.md`「1. Messaging framework」。

- 範圍：zh-TW。en、vi 列為後續事項（`site-profile.md`「語系」）
- 事實一律寫成反引號包住的 `fact:` 加事實 id，對應 `docs/strategy/facts.yaml` 裡 `locale: zh-TW`、`status: confirmed` 的條目。`node scripts/strategy/facts.mjs` 會檢查每個引用
- 定位句與主張是表述，可以改寫；主張裡不放數字、客戶名或最高級說法，這些只能出現在引用的事實裡
- #186 依 #168 的評審改了 `DM-2` 的證據點，新增「一句話的產品描述算事實」與「缺少證據的主張」第 15 項
- #199 為第一批 7 頁補了既有主張的證據點與「用在」，新增 `DM-9` 到 `DM-13`、`IT-9` 到 `IT-11`，以及「缺少證據的主張」第 16 到 22 項
- #199 依使用者在 PR #204 的回覆（2026-11-05）改了：AISO 的軟體核心確定是 OrientAI（第 17 項結算，`DM-10` 加兩筆新聞內文的證據點）；新聞可以當事實來源（第 18 項）；OrientAI 的部署寫法（`DM-3`、`IT-1`）與新增的第 23 項
- #199 依使用者同一天的再決定（PR #204）改了：`/products/systalk-ai-phison`（SysTalk.ai 搭配群聯 aiDAPTIV 的一體機方案）講的不是 AISO，這頁的事實全部由 `/products/systalk-ai` 承接，`/aiso` 不再引用。`DM-10` 改寫主張並加 `fact:orientai-aidaptiv`，`DM-3`、`DM-4`、`IT-5`、`IT-10` 的寫法與「用在」跟著改，新增「缺少證據的主張」第 24 項
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

### DM-2 AI 用在理賠、建檔這類核心作業，成果寫得出來

昕力的 AI 不停在展示，已用在金融保險的理賠與文件建檔，案例有可以引用的成果。

- `fact:smartfilling-case-bank`：金融業以 AI 取代傳統二登流程，原文寫出節省的委外成本與維運人力
- `fact:smartclaim-technologies`：結合 NLP、AI OCR、RPA 讓保險理賠流程自動化
- `fact:smartclaim-title` 與 `fact:smartclaim-result`：現站首頁同一則案例。標題是「AI 智慧理賠」，成果是理賠立案到派件自動化
- `fact:smartfilling-title` 與 `fact:smartfilling-result`：現站首頁同一則案例。標題是「AI 智慧建檔」，成果是免模板辨識醫療單據
- `fact:smartclaim-quality`：AI 再訓練機制讓模型維持準確率，用在理賠審核與理賠決定（#199）
- `fact:smartfilling-documents`：AI + OCR 用在金融業的基金配息單、居留證等收件流程（#199）

`fact:smartclaim-title` 與 `fact:smartfilling-title` 那兩點的成果原文沒有「AI」，AI 寫在同一則案例的標題裡，所以兩筆事實算一個證據點。頁面引用這兩則成果時，標題要在同一則裡一起出現，不能只把成果原文放在 AI 的段落標題底下。

第一批 7 頁的寫法（#199）：

- `/solutions/smartclaim` 的成果只有 `fact:smartclaim-result` 這一筆可以用（首頁同一則案例）。理賠解決方案頁自己的成效數字還沒確認（「缺少證據的主張」第 16 項），頁面不另寫成效數字。`fact:smartclaim-case-medical-documents` 可以放在案例段當情境說明，但原文沒有 AI、沒有可引用的成果，不放在 AI 或成果的段落標題底下
- `/solutions/smartfilling` 引用 `fact:smartfilling-case-bank` 時，同一則一起放案例標題 `fact:smartfilling-case-bank-title`，讓讀者知道是金融業的案例

#186 移出的證據點（#168 評審指出證據點原文要支撐主張的關鍵詞，new-home C3）：

- `fact:fraud-platform-result`：原文寫的是標準化聯防流程與詐騙事件即時共享，沒有提到 AI。其他主張的關鍵詞（法規、既有系統、Gateway、部署）也不在原文裡，所以不併進別的主張。頁面要用時當金融業的案例，放在案例段，不放在 AI 的段落（`briefs/finance.md` 第 8 段）；首頁第 3 段改用 `fact:smartfilling-case-bank`（`briefs/home.md`「取捨」第 9 項）。要放回 AI 的段落，得先有原文寫出平台用了 AI，見「缺少證據的主張」第 15 項
- `fact:smartclaim-case-medical-documents`：原文寫「自然語言技術」，沒有寫 AI，「作業效率大幅的提升」也沒有可引用的成果。理賠用的自研 NLP 改由 `IT-8` 的 `fact:smartclaim-nlp` 說

用在：`/`、`/industries/finance`、`/solutions/smartclaim`、`/solutions/smartfilling`、`/products/systalk-ai`（子頁卡片的理賠、建檔兩個方案）。`competitors.md`「本站已有」第 1 項：GSS、FPT 也把案例成果放在首頁前段，這是基本盤，不是差異點。

### DM-3 企業 AI 留在自己的環境，資料、權限與用量都在掌控內

OrientAI、SysTalk.VIKI 與地端一體機方案把 AI 留在企業端，資料不交給外部；權限、影子 AI、Token 與算力用量都有管控。

- `fact:orientai-on-prem-data`：OrientAI 只部署於企業端，資料掌控權為企業所有
- `fact:orientai-governance-layer`：Agent 統一管控、Token 用量監控、消除影子 AI
- `fact:orientai-governance`：AI 治理
- `fact:orientai-token-cost`：Token 成本控管
- `fact:orientai-aidaptiv`：結合群聯 aiDAPTIV，地端架構離線仍可運行
- `fact:aiso-no-token-limit`：地端 AI 不限 Token 流量
- `fact:orientai-shadow-ai-lifecycle`：影子 AI 統一納管，建立身分驗證與資料存取邊界（#199）
- `fact:orientai-token-transparency`：掌握 Token 消耗率，設定用量上限（#199）
- `fact:orientai-privacy-industries`：OrientAI 適用於對數據隱私要求高的產業（#199）
- `fact:systalk-viki-on-prem`：SysTalk.VIKI 地端部署，查詢與回應都在企業內部（#199）
- `fact:systalk-phison-hw-sw-integrated`：軟硬一體，私密資料不上公有雲（#199）
- `fact:systalk-phison-local-audit`：AI 運算在地化、數據不出門，內建權限管理與存取控管（#199）
- `fact:aiso-compute-control`：租戶隔離、分層用量上限與自動出帳（#199）
- `fact:aiso-agent-governance`：統一納管不同來源的 AI Agent（#199）

寫法（#199）：

- `fact:orientai-privacy-industries` 的原文點名醫療、金融、製造業。照原文引用，但不把製造業寫進標題或產業入口（「定位不說的事」）
- `fact:aiso-no-token-limit`、`fact:systalk-phison-hw-sw-integrated`、`fact:systalk-phison-local-audit` 的來源是 `/products/systalk-ai-phison`（SysTalk.ai 搭配群聯 aiDAPTIV 的一體機方案）。使用者決定這頁講的不是 AISO（#199，PR #204），三筆只用在 `/products/systalk-ai`，`/aiso` 不引用，也不寫成 OrientAI 的功能
- `/aiso` 只用這條裡原文講 AISO 或 OrientAI 的證據點：`fact:orientai-on-prem-data`、`fact:orientai-privacy-industries`、`fact:aiso-agent-governance`、`fact:aiso-compute-control`。前兩筆出自 OrientAI 頁，`/aiso` 寫成 AISO 的軟體核心 OrientAI 的說法（AISO 以 OrientAI 為軟體核心，`DM-10`）
- OrientAI 的部署位置（#199 使用者說明）：OrientAI 本身部署在企業端（`fact:orientai-on-prem-data`）；`fact:orientai-execution-layer` 的「支援雲地靈活部署架構」跟在「彈性整合多種大語言模型」後面，指的是接的模型可以在雲端或地端，兩筆不矛盾。表述不寫 OrientAI 本身可以部署在雲端。「可以使用雲端 LLM API」現站沒有原文，頁面不寫（「缺少證據的主張」第 23 項）

用在：`/`、`/orient-ai`、`/aiso`（只用上一則寫法列的 4 筆）、`/products/systalk-ai`。對應 `search-intent.md` 的「企業主權 AI 地端部署 方案」（共同子題：資料主權、部署形式）、「AI Agent 治理 影子 AI 企業」、「AI Agent 地端部署 Token 成本」、「地端 AI 伺服器 企業 LLM」。

### DM-4 產品與導入由同一家公司負責

昕力自己研發產品，也負責導入規劃、建置與顧問，決策者不必在產品原廠與導入廠商之間協調。

- `fact:company-offerings`：從企業服務中台、交談式 AI、雲服務到軟體解決方案
- `fact:products-families`：四個自有產品家族
- `fact:aiso-onboarding`：導入規劃、模型設定、建置與應用模組設計服務
- `fact:systalk-ai-onboarding`：導入前的情境分析、效益評估，導入中的模型評估與微調
- `fact:systalk-ai-onboarding-finetune`：協助評估、選擇模型，針對企業專業領域 fine-tune（#199）
- `fact:systalk-ai-after-onboarding`：導入後的 AI 大腦健檢、回答品質與準確率檢測、Prompt 健檢（#199）
- `fact:digirunner-open-banking-consulting`：顧問團隊協助規劃技術架構
- `fact:digirunner-case-taipei-city`：昕力顧問團隊協助臺北市政府建立 API 管理制度，輔導各機關導入上線（具名案例）

用在：`/`、`/industries/finance`、`/products/systalk-ai`（導入前、中、後三階段，與一體機段落的 `fact:aiso-onboarding`）。`fact:aiso-onboarding` 出自 `/products/systalk-ai-phison`，使用者決定這頁講的不是 AISO（#199，PR #204），所以 `/aiso` 不用這條：AISO 由誰導入，現站沒有原文（「缺少證據的主張」第 24 項）。

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
- `fact:greenswift-footprint-plan`：產品碳足跡計算與產品生命週期碳排放報告（#199）
- `fact:greenswift-epa-format`：內建碳排計算公式，可下載為環保署登錄平台的表單格式（#199）
- `fact:greenswift-case-hedinglong` 與 `fact:client-hedinglong`：GreenSwift 智慧碳管理平台用在和鼎隆建築（現站新聞標題與客戶名，算一個證據點，#199）

寫法（#199）：

- 和鼎隆建築的案例只有新聞標題，沒有成果。頁面照標題寫「用在哪家公司」，不寫減了多少碳或省了多少時間；客戶名要連同 `fact:client-hedinglong` 一起引用
- 寫碳足跡時不寫 ISO 14067，寫 CBAM 時不寫查證機構名稱，理由見「缺少證據的主張」第 21 項
- `fact:cert-greenswift-aup` 的機構與效期還沒確認，照原文寫「國際查證機構」，不補機構名

用在：`/` 的 ESG 產品家族段、`/products/greenswift`。對應 `search-intent.md` 的「GreenSwift 碳盤查」「碳盤查 平台 系統 推薦」「產品碳足跡 計算 軟體」「ISO 14064-1 碳盤查 步驟」。

### DM-8 自有產品經過外部單位評選

digiRunner、SysTalk 與 AI 智能理賠解決方案等自有產品經過外部單位評選，台新以 digiRunner 建置的平台另獲 Global Finance 的獎項；決策者評估產品時，有昕力以外的說法可以參考。

- `fact:award-taiwan-excellence-2023`：digiRunner、digiLogs、SysTalk.Chat 獲台灣精品獎
- `fact:award-taiwan-excellence-2024`：digiRunner、digiLogs、SysTalk.ai 獲台灣精品獎
- `fact:award-innovative-business-2022`：創新商務獎，digiRunner 與 SysTalk.Chat 各獲一個獎項
- `fact:award-global-finance-2020`：台新銀行以 digiRunner 建置的平台獲 Global Finance 獎項（具名案例的獎）
- `fact:award-golden-yang-2024-smartclaim`：AI 智能理賠解決方案獲 2024 金漾獎（現站新聞標題，#199）

新增這條、不併進 `DM-6` 的理由：決策者來官網的任務是「了解產品與方案、找成功案例」與「決定要不要聯絡業務」（`audience-and-goals.md`「受眾分群」）。`DM-6` 回答後者裡「這家公司能不能長期合作」，產品獎回答的是前者「這個產品有沒有外部肯定」，而且每一筆都點名產品，用在產品頁比用在公司介紹更直接。併進 `DM-6` 會讓一條主張同時說公司與產品，brief 挑證據時分不開。

寫法：

- 頁面引用時寫出年份（使用者決定，#180），照事實原文寫獎名與得獎產品，不合併成「屢獲大獎」這類說法
- 獎名裡的「最佳技術創新獎」「最佳產品創新獎」是事實原文，只能出現在引用 `fact:award-innovative-business-2022` 的地方；標題、引言與 CTA 不用「最佳」
- `fact:award-global-finance-2020` 是台新案例平台的獎，頁面放在台新案例旁（`IT-4` 的 `fact:digirunner-case-taishin`），不單獨列成產品獎
- `fact:award-golden-yang-2024-smartclaim` 只有新聞標題。媒體寫的組別不在事實庫，頁面只寫「獲 2024 金漾獎」，不寫組別或名次（「缺少證據的主張」第 16 項）
- 產品家族頁只引用點名家族內產品的獎：`/products/systalk-ai` 用 2023、2024 台灣精品獎與創新商務獎裡的 SysTalk 產品，`/products/digilism` 用同幾筆裡的 digiRunner、digiLogs。同一筆事實的原文也點名別的家族的產品，照原文引用，不刪字

沒收進這條的有年份獎項：

- `fact:award-gartner-cool-vendor-2018`：不用在試點頁。決策者評估的是現在的產品，這筆是 2018 年對 AI Chatbot 產品的肯定，得獎產品不是現行產品家族的名稱，和 2023、2024 的獎並列寫出年份時，讀者會先看到它的年份久。留給公司沿革（關於我們的里程碑）使用
- `fact:award-sbir-2022`、`fact:award-digital-finance-2021`：不用。確認的原文只有年份與獎名，沒寫得獎的產品或類別；寫出產品或類別的同一個獎（事實庫的 `award-sbir-29`、`award-digital-finance-1st`）沒寫年份，仍是 `to_confirm`，頁面不能拿來補。「第一屆」也容易被讀成最高級說法
- `fact:award-104-employer-2024`：不用。雇主品牌獎回答的是求職者的問題，求職者不在本站受眾內（`audience-and-goals.md`「受眾分群」）

用在：`/products/digirunner`（台灣精品獎、創新商務獎點名 digiRunner；Global Finance 的獎放在第 10 段台新案例旁）、`/`（信任段，和 `DM-6` 一起用）、`/solutions/smartclaim`（金漾獎）、`/products/systalk-ai`、`/products/digilism`。

### DM-9 客服、員工培訓、質檢、知識整理與文件辨識，各有 SysTalk.ai 產品

決策者不必為每個部門的 AI 需求另找廠商：客服中心、業務與員工培訓、客服質檢、內部知識與文件建檔，在 SysTalk.ai 產品家族裡各有對應的產品（#199）。

- `fact:systalk-ai-chat-patent`：SysTalk.Chat 是智能語音、文字客服機器人
- `fact:systalk-ai-day-coach`：SysTalk.Coach 用在員工知識與應對測驗、季度考核
- `fact:systalk-ai-products`：SysTalk.Coach 模擬銷售情境；SysTalk.ICR 自動辨識報支單據、醫療理賠資料自動建檔
- `fact:systalk-ai-day-audit`：SysTalk.Audit 產出智能客服語音質檢報告
- `fact:systalk-ai-day-scenarios`：SysTalk.VIKI 用在新產品知識學習、會議紀錄與摘要

新增的理由：`/products/systalk-ai` 是產品家族頁，讀者來看「這個家族能處理哪些工作」，既有主張都只說單一產品（`DM-3` 的 OrientAI、`DM-2` 的理賠與建檔）或公司層級（`DM-4`）。五筆原文都來自現站這頁的「一日應用情境」，每筆寫出產品名與它處理的工作。

寫法：

- 原文的「智能理賠專利」「兩腦一流程專利」是功能層級的專利說法，照原文引用，不改寫成「多項專利」
- 子頁卡片的文字由 hub 模板讀各 offering 的 description，本主張只給家族頁自己的段落用

用在：`/products/systalk-ai`、`/solutions/smartfilling`（SysTalk.ICR 屬於這個家族）。對應 `search-intent.md` 的「SysTalk.ai」「SysTalk 昕力 AI 產品」。

### DM-10 地端 AI 的軟體與硬體組成同一套方案交付

要把 AI 放在自己機房的企業，拿到的是軟體與地端硬體已經組好的方案，不必自己分頭找軟體、找硬體（#199）。

- `fact:aiso-ecosystem`：集結 AI 軟體與硬體廠商，協助企業建置地端 AI 平台（`/aiso` 本頁）
- `fact:aiso-alliance`：AISO 主權 AI 產業聯盟成軍，主打整合式交付（新聞 559 的標題）
- `fact:aiso-orientai-hardware`：產品組合結合自研 OrientAI 系列軟體與地端硬體（新聞 585 的內文，#199 使用者確認）
- `fact:orientai-aidaptiv`：OrientAI 結合群聯 aiDAPTIV 記憶體擴充技術，地端架構離線仍可運行（OrientAI 頁，#199 使用者決定後加）
- `fact:aiso-software-orientai`：此系列方案以昕力自主研發的企業級 Agentic AI 平台 OrientAI 為軟體核心（新聞 575 的內文，#199 使用者確認）
- `fact:aiso-bundled`：硬體內建軟體，省去分開詢價、規格對接與人工導入（`/products/systalk-ai-phison`）
- `fact:systalk-phison-hw-sw-integrated`：軟硬一體消除相容性風險（`/products/systalk-ai-phison`）

新增的理由：`DM-3` 回答「資料留不留在企業端」，回答不了 `search-intent.md`「AI 一體機 企業 地端 交機即用」「AISO 主權 AI」的共同子題（軟硬體一起交付、搭載什麼軟體）。每筆原文都直接寫出軟硬體廠商、整合式交付、軟體與硬體的組合，或軟體核心。

兩個方案各用自己的證據點（使用者決定，#199，PR #204：`/products/systalk-ai-phison` 講的不是 AISO）：

- `/aiso`（AISO，軟體是 OrientAI）：`fact:aiso-ecosystem`、`fact:aiso-alliance`、`fact:aiso-orientai-hardware`、`fact:orientai-aidaptiv`、`fact:aiso-software-orientai`。其中 `fact:aiso-orientai-hardware`、`fact:orientai-aidaptiv` 原文直接寫出 OrientAI 與硬體（地端硬體、群聯 aiDAPTIV 的記憶體擴充與地端架構），`fact:aiso-ecosystem` 出自 AISO 頁本身，寫出軟體與硬體廠商
- `/products/systalk-ai`（SysTalk.ai 搭配群聯 aiDAPTIV 的一體機）：`fact:aiso-bundled`、`fact:systalk-phison-hw-sw-integrated`

寫法：

- `/aiso` 可以寫出軟體核心是 OrientAI（第 17 項已結算，使用者決定，#199）。照 `fact:aiso-software-orientai` 的原文寫「以 OrientAI 為軟體核心」，或照 `fact:aiso-orientai-hardware` 寫「OrientAI 系列軟體與地端硬體」；寫到 OrientAI 時連到 `/orient-ai`
- `/aiso` 不寫「硬體內建軟體」「不必分開詢價、規格對接」「昕力負責導入」：這些原文出自 `/products/systalk-ai-phison`，`/aiso` 只能寫 `fact:aiso-alliance` 的「整合式交付」與 `fact:aiso-orientai-hardware` 的「結合…軟體與地端硬體」。AISO 由誰導入、硬體是否預裝軟體，現站沒有原文（「缺少證據的主張」第 24 項）
- `fact:orientai-aidaptiv` 只寫原文的機制，不寫效能提升多少（第 9 項）
- `/products/systalk-ai` 寫一體機時不寫 AISO 或 OrientAI；同一頁點名 SysTalk.ai 的 `fact:aiso-llm-support`、`fact:systalk-phison-platform`、`fact:aiso-modules` 屬於這個方案
- 原文「可落地、可擴充、可合規」照引；表述不用「落地」（「統一用詞」），也不把「可合規」擴寫成符合哪條法規
- 不寫 AISO 聯盟的成員、成立日期與簽約客戶（「缺少證據的主張」第 18 項）

用在：`/aiso`、`/products/systalk-ai`（第 6 段的地端一體機）、`/orient-ai`（只用 `fact:aiso-software-orientai`，寫在第 7 段連到 `/aiso` 的錨點）。對應 `search-intent.md` 的「AISO 主權 AI」「AI 一體機 企業 地端 交機即用」「企業 地端 LLM 建置 成本」。

### DM-11 法務、人資、教育、醫療與 AI 治理，各有對應的 AI 方案

部門主管不必從空白平台開始：合約審閱、勞動法遵、員工問答、備課、病歷整合、Agent 治理與算力分攤，都有現成的方案（#199）。

- `fact:aiso-legal-contract`：法務 AI 合約審閱，在企業內部完成合約全流程處理
- `fact:aiso-hr-labor-law`：人資 AI 勞動法遵，整合勞動法令與薪資試算
- `fact:aiso-hr-employee-service`：人資 AI 員工服務，依企業制度回應員工提問
- `fact:aiso-teaching`：教學備課 AI，整合備課、命題與行政文書
- `fact:aiso-medical-records`：醫療 AI 病歷整合，轉換為 FHIR 標準格式
- `fact:aiso-talent`：AI 人才培育，以多模型比對與 RAG 知識庫培育人才
- `fact:aiso-agent-governance`：企業 AI Agent 治理，統一納管不同來源的 AI Agent
- `fact:aiso-compute-control`：企業 AI 算力管控，租戶隔離、分層用量上限與自動出帳

新增的理由：這八張方案卡是 `/aiso` 頁本身僅有的內容，決策者來看「我的部門能用它做什麼」。每筆原文都寫出領域與做的事。

寫法：

- 現站卡片的「了解更多」連到 `aisoportal.com`，各方案的細節不在事實庫，頁面只寫卡片原文
- 教育與醫療不在本站主要受眾的產業裡，照原文列出，不寫成產業入口

用在：`/aiso`。

### DM-12 企業各部門與外部顧問，在同一個碳盤查平台上協作

碳盤查要跨部門收數據、要顧問輔導：GreenSwift 讓各部門分工、顧問登入協助，帳號與組織邊界不設上限（#199）。

- `fact:greenswift-cloud-collaboration`：企業內部人員與外部顧問團隊在雲端共同編輯指標文稿
- `fact:greenswift-collaboration`：權責分工、系統主動提醒，確保各部門協作完成數據收集
- `fact:greenswift-consultant-accounts`：顧問公司可以登入，替輔導的客戶線上盤點
- `fact:greenswift-consultant-access`：同一顧問公司內的顧問帳號可分權，非共同輔導的資料不互通
- `fact:greenswift-accounts`：主要管理者與子管理者帳號，沒有使用者數量與組織邊界數量的上限
- `fact:greenswift-consulting-partners`：專業的碳盤查輔導由合作的顧問公司執行

新增的理由：`DM-7` 說 GreenSwift 處理哪些盤查與申報，`search-intent.md`「碳盤查 平台 系統 推薦」記下前幾名缺的是試用、顧問協作與帳號限制。試用由 `IT-7` 說，顧問協作與帳號需要自己的主張。

寫法：

- 輔導由合作顧問公司執行（`fact:greenswift-consulting-partners`），GreenSwift 頁不寫成昕力提供碳盤查輔導。要介紹昕力的顧問服務時連到 `/esg-advisory`

用在：`/products/greenswift`。

### DM-13 企業整合中台的各塊工作，在 DigiLism 裡各有產品

API 管理、日誌、資料庫維運、表單流程與醫療資料交換，都在同一個產品家族裡；金融與保險業要的服務應用中台，由這些產品組成（#199）。

- `fact:digilism-solution-areas`：DigiLism 系列提供 API 管理、日誌管理及大數據管理三大面向
- `fact:digilism-api-first`：基於 API 優先與雲原生架構，滿足企業打造整合中台所需
- `fact:digilism-bfsi`：為 BFSI 全應用場景提供服務應用中台，滿足企業 API 治理需求
- `fact:digilism-family-digirunner`：digiRunner 讓 AI 模型安全串接企業 API、資料與業務流程
- `fact:digilism-family-digimars`：digiMars 把 MongoDB 社群版升級到商用等級，提供監控、告警與備份還原
- `fact:digilism-family-digiflexis`：digiFlexis 以零代碼建立數位表單與自動化流程
- `fact:digilism-family-digicare`：digiCare 以 HL7 FHIR 整併異質系統資料，跨院交換

新增的理由：`/products/digilism` 是產品家族頁。既有主張用到 DigiLism 的事實都是單一機制（`IT-1` 的部署、`IT-4` 的協定轉換、`IT-5` 的日誌），沒有一條回答「這個家族由哪些產品組成、合起來做什麼」。

寫法：

- digiLogs 在現站家族頁的說明含「業界唯一」，還沒確認（「缺少證據的主張」第 22 項）。家族頁寫 digiLogs 時只用節點名稱，說明交給子頁卡片
- 「BFSI」第一次出現時寫出是銀行、金融服務與保險；這是表述的補充，不改事實原文

用在：`/products/digilism`。對應 `search-intent.md` 的「DigiLism」「DigiLism 昕力」「企業服務中台」「iPaaS 平台 台灣」。

## 價值主張：IT 主管

給 IT 主管與專案負責人。他們要確認產品裝得進現有環境、資安過得了關、上線後維運得動。主張回答「導入後我的團隊要承擔什麼」。

### IT-1 部署環境由企業決定

digiRunner 與 DigiLism 可裝在地端、雲端或 Kubernetes，多雲與混合雲都支援；SysTalk.ai 有雲端與地端的方案，OrientAI 部署在企業端，接的模型可以在雲端或地端。

- `fact:digirunner-deployment`：支援地端、雲端部署及 K8s 微服務架構
- `fact:digirunner-multi-cloud`：支援多雲和混合雲，整合 Kubernetes
- `fact:digirunner-cloud-platforms`：雲端版支援的雲平台
- `fact:digilism-ipaas`：DigiLism 可在雲端、地端及混合環境部署
- `fact:digilism-system-integration`：支援地端、雲端、混合與多雲架構，介接傳統 ESB
- `fact:digirunner-case-pharmacity`：為 Pharmacity 在雲端建構 API 管理平台（具名案例）
- `fact:systalk-ai-service`：SysTalk.ai 提供雲端與地端的 AI 方案（#199）
- `fact:orientai-execution-layer`：OrientAI 整合多種大語言模型，支援雲地部署架構（#199）

寫法（#199 使用者說明）：

- `fact:orientai-execution-layer` 的「雲地」指 OrientAI 接的模型可以在雲端或地端，OrientAI 本身部署在企業端（`fact:orientai-on-prem-data`），兩筆不矛盾。引用時照原文，表述不寫 OrientAI 本身可以部署在雲端，也不把 OrientAI 和 digiRunner、DigiLism 寫成同一種「部署環境自選」
- 「OrientAI 可以使用雲端 LLM API」現站沒有原文，頁面不寫（「缺少證據的主張」第 23 項）

用在：`/products/digirunner`、`/products/digilism`、`/products/systalk-ai`、`/orient-ai`。

### IT-2 安全機制內建，對應常用的認證與加密標準

API 的存取防護、認證授權與加密（digiRunner），使用者的身分驗證（gadoDIDO），以及整合平台的驗身與單一登入（DigiLism），都不必另外拼裝；產品本身通過資安或 FIDO 認證，或研發過程符合 ISO 27001（GreenSwift）。

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
- `fact:digilism-auth-module`：DigiLism 整合多元身分驗證、訪問控制、資料加密與單一登入（#199）
- `fact:greenswift-zero-trust-iso27001`：GreenSwift 採零信任架構，研發過程符合 ISO 27001（#199）

用在：`/products/digirunner`、`/industries/finance`（金融頁第 2 段用 digiRunner 的事實，第 5 段用 gadoDIDO 的事實）、`/products/digilism`、`/products/greenswift`。

### IT-3 尖峰流量與單點故障有機制處理

高可用架構、自動分流與橫向擴展是內建功能，不靠事後補強。

- `fact:digirunner-zero-downtime`：雲原生容器化、橫向擴展叢集、高可用性架構
- `fact:digirunner-failover`：伺服器故障時自動分流，無需人為操作
- `fact:digirunner-container-scaling`：依尖、離峰動態擴充或縮減
- `fact:digirunner-load-balancing`：內建負載平衡，介面設定即時啟動
- `fact:digirunner-smart-caching-patent`：專利智慧快取，依負載動態儲存多節點數據
- `fact:digirunner-redis-storage`：資料庫配置與金融業常用的 Active/Standby 架構
- `fact:digirunner-tps`：硬體規格與每秒交易量（要連同「取決於環境配置」的條件一起寫）
- `fact:digilism-patent-background-processing`：DigiLism 的專利背景運算，處理瞬間大量的數據或請求（#199）
- `fact:digilism-patent-resource-scheduling`：專利的運算資源調度機制，提高系統可用性（#199）
- `fact:digilism-microservice-framework`：以 K8S 滿足高可用性，自有自動擴容專利技術（#199）

DigiLism 的「100% SLA」說法還沒確認，寫 DigiLism 的高可用時只用上面三筆（「缺少證據的主張」第 22 項）。

用在：`/products/digirunner`、`/products/digilism`。

### IT-4 接上既有系統，不必先汰換

核心系統、大型主機與各種協定可以透過 API 接進來，既有的 WAF 也能沿用。

- `fact:digilism-protocol-integration`：處理核心銀行系統或大型主機的資料轉換與通訊機制，可代替 ESB
- `fact:digirunner-api-composer`：拖拉組合 API，支援多種格式轉換
- `fact:digirunner-gov-protocols`：圖形化串接 DB、FTP 等協定，支援 JSON、XML、SOAP 轉換
- `fact:digirunner-nginx-waf`：可整合現有的 WAF 廠商
- `fact:insurebrick-buy-modules`：只買需要的模組，可串接內外部系統
- `fact:digirunner-case-taishin`：與台新銀行以 digiRunner 開發 API 管理平台，整合現金管理業務模組（具名案例）
- `fact:digilism-compatibility`：弭平既有系統與現代化框架的差異（#199）

用在：`/`、`/products/digirunner`、`/industries/finance`、`/products/digilism`。

### IT-5 API 與 AI 的使用軌跡都看得到

即時監控、告警與完整日誌，出問題時查得到來源，稽核時拿得出紀錄。

- `fact:digirunner-console`：即時主控台保留 API 活動與軌跡
- `fact:digirunner-low-code`：即時監控 API 運行與異常告警
- `fact:digirunner-cloud-opensearch`：可視化的 OpenSearch 圖表
- `fact:digirunner-ai-usage-log`：記錄所有 AI 使用歷程，符合監管要求
- `fact:digilism-log-audit`：集中控管各系統日誌，即時監控告警
- `fact:orientai-governance-controls`：OrientAI 的角色權限控管、日誌追蹤與稽核、異常行為即時告警（#199）
- `fact:orientai-risk-insight`：即時檢視 AI 回覆品質、任務執行狀態與使用行為，建立異常預警（#199）
- `fact:systalk-phison-local-audit`：內建稽核紀錄，每筆操作有跡可查（#199）

`fact:systalk-phison-local-audit` 出自 `/products/systalk-ai-phison`，使用者決定這頁講的不是 AISO（#199，PR #204），只用在 `/products/systalk-ai`。`/aiso` 沒有其他證據點撐這條，不用。

用在：`/products/digirunner`、`/products/digilism`、`/orient-ai`、`/products/systalk-ai`（第 3 段的稽核紀錄）。

### IT-6 AI 流量和 API 走同一道 Gateway 管理

企業接 AI 模型時，負載、權限、內容審查與流量監控沿用 API 管理的同一套機制。

- `fact:digirunner-ai-gateway`：AI Gateway 的負載平衡、安全防護與監控
- `fact:digirunner-ai-model-config`：依需求調配不同 AI 模型
- `fact:digirunner-ai-content-review`：輸入與輸出前自動檢測不適當內容
- `fact:digirunner-ai-traffic`：整合企業內部 AI 應用，即時監控 AI 流量
- `fact:digirunner-ai-governance`：AI Governance 確保 AI 應用合規
- `fact:digilism-family-digirunner`：整合 MCP 協定與 AI Gateway 架構
- `fact:digilism-family-digirunner-ai`：協助企業落實 AI 治理與流量控管（#199）

用在：`/products/digirunner`、`/`、`/products/digilism`（digiRunner 的段落）。

### IT-7 先試用再決定

IT 團隊可以在不影響現行服務的環境裡先試完整功能，再決定要不要導入。

- `fact:digirunner-trial-30-days`：免費試用
- `fact:digirunner-trial-all-features`：試用期間各方案功能皆可使用，不收授權費
- `fact:digirunner-cloud-trial-full`：雲端版完整功能試用
- `fact:digirunner-cloud-trial-terms`：試用條件（AWS 仍收基礎設施費用、到期自動轉付費），寫「免費」時要一起寫
- `fact:digirunner-sandbox`：沙盒讓開發人員在不影響現行服務下測試
- `fact:greenswift-trial-30-days`：GreenSwift 審核通過後開始試用，到期自動關閉帳號權限（#199）
- `fact:greenswift-trial`：試用期間可用所有功能，下載報告書時有浮水印（#199）
- `fact:greenswift-review-one-day`：申請在一個工作日內審核（#199）

GreenSwift 的試用沒有「免費」字樣。頁面寫試用時，三筆的條件（審核、到期關閉、浮水印）一起寫，不寫成「免費試用」。

用在：`/products/digirunner`（次要轉換：試用）、`/products/greenswift`（次要轉換：試用）。

### IT-8 AI 模型可選，核心演算法自研

企業可以依場景選模型、用 MCP 擴充；理賠與建檔用的 NLP、OCR 是昕力自己的演算法。

- `fact:aiso-llm-support`：支援主流開源與企業級 LLM，依場景選模型
- `fact:orientai-execution-layer`：整合多種大語言模型，支援雲地部署
- `fact:orientai-mcp`：MCP 擴充應用
- `fact:smartclaim-nlp`：自主研發的 NLP 技術
- `fact:smartfilling-icr-puzzle`：自建 AI 演算法模型與再訓練機制
- `fact:smartfilling-template-free`：不需依文件版型建立模板
- `fact:smartfilling-preprocessing`：自研的前處理技術，自動校正文件影像瑕疵（#199）

`fact:aiso-llm-support` 的來源是 SysTalk.ai 搭配群聯 aiDAPTIV 的方案（`/products/systalk-ai-phison`），講的是另一個方案，不是 AISO，只用在 `/products/systalk-ai`，`/aiso` 不引用（`DM-10` 寫法）。`fact:orientai-execution-layer` 的「雲地」寫法見 `IT-1`。

用在：`/`、`/industries/finance`、`/solutions/smartclaim`、`/solutions/smartfilling`、`/orient-ai`、`/products/systalk-ai`。

### IT-9 模型上線後，企業自己就能再訓練、維持準確率

理賠與建檔的 AI 模型內建再訓練機制，文件格式變了，IT 團隊不必每次找外部重建模型（#199）。

- `fact:smartclaim-retraining`：各醫院收據格式不一，AI 再訓練機制維持準確率
- `fact:smartclaim-one-click-retraining`：AI 進化系統的介面讓再訓練「一鍵優化」，持續維運 AI 模型
- `fact:smartfilling-icr-puzzle`：自建 SysTalk.ICR 與 SysTalk.PUZZLE 模型再訓練機制
- `fact:smartfilling-flow`：SysTalk.ICR 加上再訓練機制，自主維運優化模型
- `fact:smartfilling-data-augmentation`：內建自動增加訓練資料機制，模擬不同情境影像
- `fact:smartfilling-case-bank`：金融業案例在三校時反饋系統再學習訓練模型，降低維運人力（原文含數字，照原文引用）

新增的理由：IT 主管要確認「上線後維運得動」（本節開頭），`IT-8` 說演算法是自研的，沒說模型上線後誰維護。`search-intent.md`「OCR 辨識率 提升 模型 再訓練」的讀者要找的就是這件事。六筆原文都寫出再訓練或再學習。

寫法：

- 現站寫的「100% 自主維運」還沒確認（「缺少證據的主張」第 19 項）。表述寫「自己再訓練」「自主維運」，不加百分比，也不寫「完全不需要外部」
- `fact:smartfilling-case-bank` 引用時照 `DM-2` 的寫法，同一則放案例標題

用在：`/solutions/smartclaim`、`/solutions/smartfilling`。

### IT-10 地端 AI 的硬體，依使用人數與知識庫規模選

IT 主管可以照團隊大小、知識庫規模與要跑的模型級距挑機型，不必自己估 GPU 配置（#199）。

- `fact:aiso-servers`：aiDAPTIV 4-GPU 與 8-GPU Server 的 VRAM、適用的知識庫規模與 LLM 級距
- `fact:systalk-phison-use-cases`：單一部門與 PoC，或跨部門 AI 中台，各有適用的機型
- `fact:orientai-hardware-small`：1-5 人團隊的輕量運算，用 AI PC 或 Workstation
- `fact:orientai-hardware-large`：5 人以上的跨部門應用，用 Workstation 或 AI Server
- `fact:aiso-memory-optimization`：群聯 aiDAPTIV 以記憶體管理與資料調度，在相同 GPU 條件下支援更大的模型規模

新增的理由：`search-intent.md`「地端 AI 伺服器 企業 LLM」「AI 一體機 企業 地端 交機即用」的前幾名都缺「各機型的規格與適用的知識庫規模」，事實庫有這些規格，但沒有主張接住。

寫法：

- `fact:aiso-servers`、`fact:systalk-phison-use-cases`、`fact:aiso-memory-optimization` 的來源是 `/products/systalk-ai-phison`（SysTalk.ai 搭配群聯 aiDAPTIV 的一體機），使用者決定這頁講的不是 AISO（#199，PR #204），三筆只用在 `/products/systalk-ai`
- `fact:orientai-hardware-small`、`fact:orientai-hardware-large` 的來源是 OrientAI 頁，用在 `/orient-ai` 與 `/aiso`。`/aiso` 寫成「OrientAI 建議的硬體配置」（AISO 以 OrientAI 為軟體核心），不寫成 AISO 的機型規格；AISO 自己的機型現站沒有原文（「缺少證據的主張」第 24 項）
- 兩組各寫在自己的產品底下，不合併成同一張規格表，也不在 `/aiso` 引用 aiDAPTIV 4-GPU、8-GPU Server 的規格
- 群聯提供的效能比較數字還沒確認（「缺少證據的主張」第 9 項），`fact:aiso-memory-optimization` 只寫機制，不寫快幾倍

用在：`/aiso`（只用 OrientAI 頁的兩筆）、`/orient-ai`、`/products/systalk-ai`（只用併入頁的三筆）。

### IT-11 AI Agent 拆解任務、跨系統執行

使用者用對話發起任務，OrientAI 拆解後分派給合適的 Agent，在現有的多個業務系統之間完成工作（#199）。

- `fact:orientai-task-intake`：對話式任務發起，理解自然語意與資料需求
- `fact:orientai-agent-dispatch`：自動拆解任務、調用合適的 AI Agent，跨系統協作完成工作
- `fact:orientai-collaboration`：整合現有業務系統與流程，自動分派 Agent，避免運行衝突
- `fact:orientai-five-features`：多代理協作，順暢運行在多個系統間
- `fact:orientai-multi-agent`：多 Agent 協作
- `fact:orientai-data-silos`：以標準化架構整合多套系統，打通跨部門的數據孤島

新增的理由：`DM-3` 說 OrientAI 管得住，沒說 OrientAI 做什麼。`search-intent.md`「企業級 Agentic AI 平台」「多代理協作 AI Agent 平台 企業 導入」要的是 Agent 怎麼分工、接不接得進現有系統，IT 主管看的是機制。

寫法：

- OrientAI 頁的效益數字（作業效率、營運成本、治理風險）還沒確認（「缺少證據的主張」第 7 項），這條只寫機制

用在：`/orient-ai`。

## 證據對照表

每個主張的證據數與用在哪些頁。每個主張至少 2 個證據點，每個證據點的原文要直接支撐主張的關鍵詞（`content-strategy` skill「1. Messaging framework」）；不到 2 個的主張不列在這裡，改列在「缺少證據的主張」。「數量」是證據點數，同一則案例的標題與成果算一個（`DM-2`），案例標題與客戶名也算一個（`DM-7`）。

「頁面」欄的簡稱：首頁 `/`、digiRunner `/products/digirunner`、金融 `/industries/finance`，第一批 7 頁是理賠 `/solutions/smartclaim`、建檔 `/solutions/smartfilling`、SysTalk.ai `/products/systalk-ai`、OrientAI `/orient-ai`、AISO `/aiso`、GreenSwift `/products/greenswift`、DigiLism `/products/digilism`。

| 主張 | 事實 id | 數量 | 頁面 |
|---|---|--:|---|
| DM-1 規範要求做在產品裡 | `fact:digirunner-open-banking-fsc`、`fact:digirunner-open-banking-3-stages`、`fact:digirunner-financial-inspection`、`fact:digirunner-ndc-spec`、`fact:digirunner-open-banking-consulting`、`fact:digirunner-case-taipei-city` | 6 | 金融、digiRunner |
| DM-2 AI 用在核心作業 | `fact:smartfilling-case-bank`、`fact:smartclaim-technologies`、`fact:smartclaim-title` 與 `fact:smartclaim-result`、`fact:smartfilling-title` 與 `fact:smartfilling-result`、`fact:smartclaim-quality`、`fact:smartfilling-documents` | 6 | 首頁、金融、理賠、建檔、SysTalk.ai |
| DM-3 AI 留在企業端 | `fact:orientai-on-prem-data`、`fact:orientai-governance-layer`、`fact:orientai-governance`、`fact:orientai-token-cost`、`fact:orientai-aidaptiv`、`fact:aiso-no-token-limit`、`fact:orientai-shadow-ai-lifecycle`、`fact:orientai-token-transparency`、`fact:orientai-privacy-industries`、`fact:systalk-viki-on-prem`、`fact:systalk-phison-hw-sw-integrated`、`fact:systalk-phison-local-audit`、`fact:aiso-compute-control`、`fact:aiso-agent-governance` | 14 | 首頁、OrientAI、AISO、SysTalk.ai |
| DM-4 產品與導入同一家 | `fact:company-offerings`、`fact:products-families`、`fact:aiso-onboarding`、`fact:systalk-ai-onboarding`、`fact:systalk-ai-onboarding-finetune`、`fact:systalk-ai-after-onboarding`、`fact:digirunner-open-banking-consulting`、`fact:digirunner-case-taipei-city` | 8 | 首頁、金融、SysTalk.ai |
| DM-5 保險專用模組 | `fact:insurebrick-platform`、`fact:insurebrick-28-modules`、`fact:insurebrick-scenarios`、`fact:insurering-rule-engine`、`fact:insurering-automated-rules`、`fact:insurebrick-case-online-insurance`、`fact:insurebrick-case-shin-kong`、`fact:insurering-case-shin-kong-life` | 8 | 金融 |
| DM-6 穩定度看得到 | `fact:company-founded`、`fact:company-subsidiaries-sg-vn`、`fact:company-milestone-2020-brand`、`fact:cert-iso27001-product-platform`、`fact:company-google-cloud-partner`、`fact:company-milestone-2008-finance`、`fact:award-ft-high-growth-2022`、`fact:award-cx-asia-2021` | 8 | 首頁 |
| DM-7 碳盤查與 CBAM 工具 | `fact:greenswift-scope`、`fact:greenswift-cbam-plan`、`fact:greenswift-standards`、`fact:cert-greenswift-aup`、`fact:greenswift-footprint-plan`、`fact:greenswift-epa-format`、`fact:greenswift-case-hedinglong` 與 `fact:client-hedinglong` | 7 | 首頁、GreenSwift |
| DM-8 產品經過外部評選 | `fact:award-taiwan-excellence-2023`、`fact:award-taiwan-excellence-2024`、`fact:award-innovative-business-2022`、`fact:award-global-finance-2020`、`fact:award-golden-yang-2024-smartclaim` | 5 | digiRunner、首頁、理賠、SysTalk.ai、DigiLism |
| DM-9 SysTalk.ai 各部門有產品 | `fact:systalk-ai-chat-patent`、`fact:systalk-ai-day-coach`、`fact:systalk-ai-products`、`fact:systalk-ai-day-audit`、`fact:systalk-ai-day-scenarios` | 5 | SysTalk.ai、建檔 |
| DM-10 地端 AI 軟硬體同一套方案交付 | `fact:aiso-ecosystem`、`fact:aiso-alliance`、`fact:aiso-orientai-hardware`、`fact:orientai-aidaptiv`、`fact:aiso-software-orientai`、`fact:aiso-bundled`、`fact:systalk-phison-hw-sw-integrated` | 7（AISO 用前 5 個，SysTalk.ai 用後 2 個） | AISO、SysTalk.ai、OrientAI |
| DM-11 部門各有 AI 方案 | `fact:aiso-legal-contract`、`fact:aiso-hr-labor-law`、`fact:aiso-hr-employee-service`、`fact:aiso-teaching`、`fact:aiso-medical-records`、`fact:aiso-talent`、`fact:aiso-agent-governance`、`fact:aiso-compute-control` | 8 | AISO |
| DM-12 部門與顧問同平台協作 | `fact:greenswift-cloud-collaboration`、`fact:greenswift-collaboration`、`fact:greenswift-consultant-accounts`、`fact:greenswift-consultant-access`、`fact:greenswift-accounts`、`fact:greenswift-consulting-partners` | 6 | GreenSwift |
| DM-13 整合中台各塊有產品 | `fact:digilism-solution-areas`、`fact:digilism-api-first`、`fact:digilism-bfsi`、`fact:digilism-family-digirunner`、`fact:digilism-family-digimars`、`fact:digilism-family-digiflexis`、`fact:digilism-family-digicare` | 7 | DigiLism |
| IT-1 部署環境自選 | `fact:digirunner-deployment`、`fact:digirunner-multi-cloud`、`fact:digirunner-cloud-platforms`、`fact:digilism-ipaas`、`fact:digilism-system-integration`、`fact:digirunner-case-pharmacity`、`fact:systalk-ai-service`、`fact:orientai-execution-layer` | 8 | digiRunner、DigiLism、SysTalk.ai、OrientAI |
| IT-2 安全機制內建 | `fact:digirunner-zero-trust`、`fact:digirunner-security`、`fact:digirunner-auth-methods`、`fact:digirunner-open-banking-security`、`fact:digirunner-gov-threat-protection`、`fact:cert-iso27001-digirunner`、`fact:gadodido-fido-certified`、`fact:gadodido-passwordless`、`fact:gadodido-mfa`、`fact:gadodido-device-only-data`、`fact:digilism-auth-module`、`fact:greenswift-zero-trust-iso27001` | 12 | digiRunner、金融、DigiLism、GreenSwift |
| IT-3 尖峰與故障 | `fact:digirunner-zero-downtime`、`fact:digirunner-failover`、`fact:digirunner-container-scaling`、`fact:digirunner-load-balancing`、`fact:digirunner-smart-caching-patent`、`fact:digirunner-redis-storage`、`fact:digirunner-tps`、`fact:digilism-patent-background-processing`、`fact:digilism-patent-resource-scheduling`、`fact:digilism-microservice-framework` | 10 | digiRunner、DigiLism |
| IT-4 接既有系統 | `fact:digilism-protocol-integration`、`fact:digirunner-api-composer`、`fact:digirunner-gov-protocols`、`fact:digirunner-nginx-waf`、`fact:insurebrick-buy-modules`、`fact:digirunner-case-taishin`、`fact:digilism-compatibility` | 7 | 首頁、digiRunner、金融、DigiLism |
| IT-5 軌跡看得到 | `fact:digirunner-console`、`fact:digirunner-low-code`、`fact:digirunner-cloud-opensearch`、`fact:digirunner-ai-usage-log`、`fact:digilism-log-audit`、`fact:orientai-governance-controls`、`fact:orientai-risk-insight`、`fact:systalk-phison-local-audit` | 8 | digiRunner、DigiLism、OrientAI、SysTalk.ai |
| IT-6 AI 走同一道 Gateway | `fact:digirunner-ai-gateway`、`fact:digirunner-ai-model-config`、`fact:digirunner-ai-content-review`、`fact:digirunner-ai-traffic`、`fact:digirunner-ai-governance`、`fact:digilism-family-digirunner`、`fact:digilism-family-digirunner-ai` | 7 | digiRunner、首頁、DigiLism |
| IT-7 先試用 | `fact:digirunner-trial-30-days`、`fact:digirunner-trial-all-features`、`fact:digirunner-cloud-trial-full`、`fact:digirunner-cloud-trial-terms`、`fact:digirunner-sandbox`、`fact:greenswift-trial-30-days`、`fact:greenswift-trial`、`fact:greenswift-review-one-day` | 8 | digiRunner、GreenSwift |
| IT-8 模型可選、演算法自研 | `fact:aiso-llm-support`、`fact:orientai-execution-layer`、`fact:orientai-mcp`、`fact:smartclaim-nlp`、`fact:smartfilling-icr-puzzle`、`fact:smartfilling-template-free`、`fact:smartfilling-preprocessing` | 7 | 首頁、金融、理賠、建檔、OrientAI、SysTalk.ai |
| IT-9 模型自己再訓練 | `fact:smartclaim-retraining`、`fact:smartclaim-one-click-retraining`、`fact:smartfilling-icr-puzzle`、`fact:smartfilling-flow`、`fact:smartfilling-data-augmentation`、`fact:smartfilling-case-bank` | 6 | 理賠、建檔 |
| IT-10 硬體依規模選 | `fact:aiso-servers`、`fact:systalk-phison-use-cases`、`fact:orientai-hardware-small`、`fact:orientai-hardware-large`、`fact:aiso-memory-optimization` | 5（AISO 只用 OrientAI 頁的 2 個） | AISO、OrientAI、SysTalk.ai |
| IT-11 Agent 跨系統執行 | `fact:orientai-task-intake`、`fact:orientai-agent-dispatch`、`fact:orientai-collaboration`、`fact:orientai-five-features`、`fact:orientai-multi-agent`、`fact:orientai-data-silos` | 6 | OrientAI |

各頁主要用的主張（brief 從這裡挑，不必全用）：

| 頁面 | 主要主張 | 次要主張 |
|---|---|---|
| `/` | DM-2、DM-3、DM-4、DM-6 | DM-7、DM-8、IT-4、IT-6、IT-8 |
| `/products/digirunner` | IT-1、IT-2、IT-3、IT-6、IT-7 | DM-1、DM-8、IT-4、IT-5 |
| `/industries/finance` | DM-1、DM-2、DM-5 | DM-4、IT-2、IT-4、IT-8 |
| `/solutions/smartclaim` | DM-2、IT-9 | DM-8、IT-8 |
| `/solutions/smartfilling` | DM-2、IT-8、IT-9 | DM-9 |
| `/products/systalk-ai` | DM-9、DM-4 | DM-2、DM-3、DM-8、DM-10、IT-1、IT-5、IT-8、IT-10 |
| `/orient-ai` | DM-3、IT-11 | DM-10、IT-1、IT-5、IT-8、IT-10 |
| `/aiso` | DM-10、DM-11 | DM-3、IT-10（#199 使用者決定後，`DM-4`、`IT-5` 在本頁沒有可用的證據點，拿掉） |
| `/products/greenswift` | DM-7、DM-12 | IT-2、IT-7 |
| `/products/digilism` | DM-13、IT-4 | DM-8、IT-1、IT-2、IT-3、IT-5、IT-6 |

## 語氣與用詞

規則照 `.claude/skills/writing-style/SKILL.md`（含「網站文案」）。本節只補本站特有的部分。

### 語氣

- 對決策者寫結果與風險：做了什麼、處理掉哪個風險。對 IT 主管寫機制：支援什麼、怎麼運作、要什麼條件
- 寫產品做的事，不寫形容詞。「內建負載平衡，介面設定即時啟動」優於「強大穩定的平台」
- 數字只出現在引用的事實裡，連同事實裡的條件一起寫（例如 `fact:digirunner-tps` 的「取決於不同環境的配置」、`fact:digirunner-cloud-trial-terms` 的費用說明）
- 稱呼讀者用「您」或直接省略主詞，不用「你」；稱公司用「昕力」或「昕力資訊」，不用「我們」開頭的長句
- 以上管表述。事實照 `text` 引用，原文的「你」「我們」與 FAQ 的應答不套這幾條；哪些可以在 `text` 裁掉、哪些照引，照 `content-strategy` skill「照原文引用事實」（#214）

### 一句話的產品描述算事實

產業卡、產品索引、家族副標這類一句話的描述（#168 old-home「評審依據不足」第 4 項），照 `CLAUDE.md`「內容規則」分：

- 寫出產品做什麼（功能、支援的標準、部署方式、適用場景）就是「產品功能」，屬於事實：用事實原文並引用 `fact:` id，例如首頁產業入口的 `fact:digirunner-open-banking-fsc`。沒有對應事實的功能描述不寫
- 節點名稱裡的類別詞（「digiRunner API 管理平台」的「API 管理平台」、「gadoDIDO 無密碼身分驗證」）是 `docs/ia/nodes.csv` 的名稱，照名稱引用，不算描述，也不另外加長
- 只點出問題類別、不說產品怎麼做的句子是表述，例如首頁第 4 段的標題「API、AI、資安與碳管理，各有產品」。表述一加上機制（「以零信任防護 API」），就變成要引用事實的描述

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
| 聯絡業務（主要轉換的按鈕） | 聯絡我們（按鈕上） | header 的常駐按鈕，首頁、hub、產業頁的 hero 與頁尾按鈕都用這個名稱（#186，`briefs/home.md`「取捨」第 10 項）。offering 頁見下一列。聯絡頁本身的名稱仍是節點名「聯絡我們」 |
| 預約演示（offering 頁，內容檔 `cta: demo`） | 申請 Demo、預約展示 | offering 頁的 hero 與頁尾按鈕照內容檔的 `cta`：`demo` 顯示「預約演示」，`contact` 顯示「聯絡業務」（`OfferingTemplate.astro`），兩者都連到 `/contact-us`。哪一頁用哪個值由 brief 的「CTA」決定，brief 不另取按鈕名（#214） |
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
| 7 | 成效數字：開發效率提升、正常運行時間、OrientAI 的效率與成本改善、InsureRing 上架時間 | 沒有量測方式或比較基準（#164 的宣稱規則）。首頁案例的 `fact:smartclaim-result` 已確認，可以用；理賠解決方案頁的同類數字還沒有（第 16 項）。InsureRing 的具名案例成果（`fact:insurering-case-shin-kong-life`）已確認，產品頁的「上架縮短 90%」仍未確認。決定不用（使用者決定，#180） | `fact:digirunner-hot-deploy-50`、`fact:digirunner-uptime-999`、`fact:orientai-benefits`、`fact:insurering-90-percent`、`fact:smartclaim-80-percent` |
| 8 | DigiLism 擁有多項發明專利 | 已解決：`fact:digilism-patents-7` 改為 `confirmed`，現站沒寫統計時間，照現站的數字使用、不寫年份（使用者決定的例外，#180）。個別功能「具專利技術」的說法已確認（#165）；熱部署的「提升高達 50%」不用 | 無 |
| 9 | 搭配群聯 aiDAPTIV 的地端 AI 比其他硬體更快、能跑更大的模型 | 合作夥伴提供的估算與點名競品的比較，要確認授權與量測條件 | `fact:aiso-10x-dell-hpe`、`fact:aiso-52-to-2-seconds`、`fact:aiso-70b-on-4-gpus` |
| 10 | 台灣開放銀行的三階段時程 | 已解決：四筆時程改為 `confirmed`，可以寫出年份（使用者決定，#180） | 無 |
| 11 | 在東南亞與東北亞多國設有據點 | 據點清單兩處說法不一致（有沒有泰國）。DM-6 改用已確認的新加坡、越南子公司 | `fact:company-asia-presence`、`fact:company-offices-overseas` |
| 12 | digiRunner 有開源版，可以先自己裝來試 | 部分解決（#174）：zh-TW 可以寫開源版存在與授權（`fact:digirunner-open-source`、`fact:digirunner-oss-license`、`fact:opentpi-program`），開源版的功能說明只在 `tpi.dev`，是英文，只收成 en 事實（id 以 `digirunner-oss-` 開頭、`-en` 結尾）。跟 Enterprise、Cloud 版的差異在 `docs.tpi.dev` 與 GitHub repo 頁，雲端 session 連不到，還沒收；zh-TW 不能寫「輕量版」或比較兩版的功能 | 無（缺的是比較的事實，不是 `to_confirm`） |
| 13 | 製造業有導入案例與成果 | 事實庫只有產業清單（`fact:company-industries`）與 GreenSwift 功能，沒有製造業案例；`nodes.csv` 寫製造業頁「需人工提供」。因此定位句不點名製造業（使用者決定，#165）。現站沒有資料，不處理（使用者決定，#180） | 無 |
| 14 | 聯絡後多久回覆 | `audience-and-goals.md` 問題 3 未回答。`competitors.md`「本站缺」第 3 項：FPT 在聯絡頁寫明回覆時間。現站沒有資料，不處理；聯絡段不寫回覆時間（使用者決定，#180） | 無 |
| 15 | 金融聯防阻詐平台用 AI 偵測或共享詐騙事件 | 已確認的 `fact:fraud-platform-title`、`fact:fraud-platform-result` 只寫聯防流程、詐騙事件即時共享與跨行交換，沒有提到 AI，所以 #186 把它移出 `DM-2`。現站也沒有這個平台的案例頁與客戶名稱。要放回 AI 的段落，要先從現站或內容負責人取得寫出 AI 的原文 | 無 |
| 16 | AI 智能理賠解決方案有自己的成效數字與具名客戶案例（#199） | 理賠頁的「人力成本節省達 80% 以上」沒有量測方式與基準（第 7 項同類）。已確認的成果只有首頁案例 `fact:smartclaim-title` 與 `fact:smartclaim-result`，沒有客戶名。`search-intent.md`「壽險 理賠 AI 案例 台灣」要有具名案例才接得住，事實庫沒有。`fact:award-golden-yang-2024-smartclaim` 只收了新聞 457 的標題，媒體寫的組別不在事實庫。要先收：80% 的量測方式與比較基準、可具名的理賠客戶案例、新聞 457 內文寫的組別 | `fact:smartclaim-80-percent` |
| 17 | `/aiso` 寫出一體機的軟體核心（#199） | 已結算（使用者決定，#199）：AISO 一體機的軟體是 OrientAI。依據是新聞內文的兩筆 confirmed 事實：`fact:aiso-software-orientai`（新聞 575：「以昕力自主研發的企業級 Agentic AI 平台 OrientAI 為軟體核心」）與 `fact:aiso-orientai-hardware`（新聞 585：「結合自研 OrientAI 系列軟體與地端硬體」），已列為 `DM-10` 的證據點。`/products/systalk-ai-phison` 是 SysTalk.ai 加群聯 aiDAPTIV 的另一個方案（IA 上併入 `/products/systalk-ai`），同一天使用者再決定（PR #204）：那頁整頁講的都不是 AISO，所有事實（不只點名 SysTalk.ai 的 `fact:aiso-llm-support`、`fact:systalk-phison-platform`、`fact:aiso-modules`）都由 `/products/systalk-ai` 承接，`/aiso` 不引用；`DM-3`、`DM-4`、`DM-10`、`IT-5`、`IT-8`、`IT-10` 已照這個分法改寫，`/aiso` 因此缺的內容見第 24 項 | 無 |
| 18 | AISO 聯盟的成員、成立日期與簽約客戶；AISO 給企業 100% 的 AI 主控權（#199） | 「整合式交付」已補進 `fact:aiso-alliance` 的 text，列為 `DM-10` 的證據點。新聞可以當事實來源（使用者決定，#199），新聞內文也收得到（`fact:aiso-software-orientai` 就取自新聞 575 的內文）；但新聞 559 內文的成員、日期、國泰金控與台達電簽約還沒收進事實庫，頁面仍不能寫。「100% AI 主控權」是口號，CIO 調查沒寫年份。要收的事實：新聞 559 內文的成員家數、成立日期與簽約客戶，改 `scripts/strategy/facts-source.yaml` 後重跑 `extract-facts.mjs` | `fact:aiso-100-percent-control`、`fact:aiso-cio-survey` |
| 19 | 智慧建檔讓企業 100% 自主維運（#199） | 100% 沒有依據（#164 的宣稱規則）。`IT-9` 只寫「自己再訓練」「自主維運」，不加百分比 | `fact:smartfilling-self-maintained` |
| 20 | SysTalk.ai 一體機獲 2025 AI AWARD（#199） | 只出現在 `/products/systalk-ai-phison` 的 meta description，內文沒有，查不到獎項全名與頒發單位，不在事實庫（`unmigrated.md`「第一批 7 頁沒收的句子」）。要先收：寫出獎項全名、頒發單位與得獎產品的現站原文 | 無 |
| 21 | GreenSwift 支援 ISO 14067、產出越南文報告與多場所報告書，並公開方案價格與合作的查證機構（#199） | ISO 14067 現站寫「未來還將整合」；越南文只在新聞，`fact:greenswift-languages` 寫繁中與英文；多場所報告書現站寫開發中；`/carbon` 的價格與查證機構名稱沒有收；`fact:cert-greenswift-aup` 的機構與效期待確認。`search-intent.md`「產品碳足跡 計算 軟體」因此不能用標準名承接，「碳盤查 費用 中小企業」也沒有價格可寫。要先收：現站確認 14067 與報告語言的現況、多場所報告書是否上線、價格與查證機構名稱能否對外寫 | `fact:greenswift-roadmap-iso14067` |
| 22 | DigiLism 確保 100% 符合 SLA；digiLogs 用業界唯一的鏈路追蹤技術（#199） | 100% 與「業界唯一」都沒有依據（#164 的宣稱規則）。`IT-3` 只用 DigiLism 專利機制的事實，`DM-13` 寫 digiLogs 時只用節點名稱 | `fact:digilism-sla-100`、`fact:digilism-patent-sla`、`fact:digilism-family-digilogs` |
| 23 | OrientAI 部署在企業端，但可以使用雲端 LLM API（#199） | 使用者說明了 OrientAI 的部署方式（PR #204 的回覆），但現站沒有原文寫「雲端 LLM API」。已確認的只有 `fact:orientai-execution-layer` 的「彈性整合多種大語言模型 支援雲地靈活部署架構」與 `fact:orientai-on-prem-data` 的「只會部署於企業端」，`IT-1`、`DM-3` 照這兩筆寫，表述不寫 OrientAI 本身可以部署在雲端。要先收：現站寫出 OrientAI 可以呼叫雲端 LLM API 的原文，收進事實庫後才能寫 | 無（缺的是原文，不是 `to_confirm`） |
| 24 | AISO 的硬體預裝軟體、不必分開採購；昕力負責 AISO 的導入；AISO 的機型規格（VRAM、模型級距、知識庫規模）；AISO 不限 Token、內建權限與稽核紀錄（#199） | 這些說法原本用 `fact:aiso-bundled`、`fact:aiso-onboarding`、`fact:aiso-servers`、`fact:systalk-phison-use-cases`、`fact:aiso-no-token-limit`、`fact:systalk-phison-local-audit`，都出自 `/products/systalk-ai-phison`。使用者決定那頁講的不是 AISO（PR #204，2026-11-05），事實移到 `/products/systalk-ai`，`/aiso` 不能寫。現站 `/aiso` 與已收的新聞內文（`fact:aiso-alliance`、`fact:aiso-software-orientai`、`fact:aiso-orientai-hardware`）只寫到整合式交付與「OrientAI 系列軟體與地端硬體」。`/aiso` 的硬體改用 OrientAI 頁的 `fact:orientai-hardware-small`、`fact:orientai-hardware-large`，寫成 OrientAI 的硬體建議（`IT-10` 寫法）。要先收：新聞 575、585 或現站其他頁寫出 AISO 機型、交付方式與導入服務的原文 | 無（缺的是原文，不是 `to_confirm`） |
