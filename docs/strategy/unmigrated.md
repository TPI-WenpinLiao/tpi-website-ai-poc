# 未搬內容盤點（試點三頁與第一批 7 頁）

現站有、新站還沒有的段落，作為 content brief 的素材（`.claude/skills/site-research/SKILL.md`「2. 未搬內容盤點」）。前三節是試點三頁（`docs/strategy/site-profile.md`「試點頁面」），後七節是 #199 的第一批 7 頁：AI 智能理賠、AI 智慧建檔、SysTalk.ai、OrientAI、AISO、GreenSwift、DigiLism。

- 只盤點，不判斷要不要放回新站，那是策略階段的事（試點三頁是 #165）
- 試點三頁：對照日期 2026-10-31。現站頁面讀自 `scripts/strategy/extract-facts.mjs` 的快取（`.cache/facts`），新站讀 `src/data/home/zh-TW.ts`、`src/content/offering/zh-TW/digirunner.md`、`src/content/hub/zh-TW/industry-finance.md`
- 第一批 7 頁：對照日期 2026-11-05。現站頁面用 curl 讀取，內容取自 SSR HTML、頁面載入的 `/_nuxt/*.js` chunk 與 `window.__NUXT__` payload，不是 `.cache/facts` 的快取。新站讀各節「新站有」寫的內容檔（`src/content/offering/zh-TW/`、`src/content/hub/zh-TW/`）
- 「事實 id」是 `docs/strategy/facts.yaml` 的 id。標 ⚠ 的是 `to_confirm`，頁面還不能用，原因寫在該筆的 `note`。「—」表示這段沒有事實，只有表述
- 「沒搬的原因」引用當時的紀錄；沒有紀錄的寫「無紀錄」
- 第一批 7 頁的「事實 id」是 #199 把缺的句子補進事實庫之後的狀態。仍然沒收的句子與原因列在最後一節「第一批 7 頁沒收的句子」

## 首頁 `/`

現站來源：https://www.tpisoftware.com/

新站首頁（M3-04，#17）的結構是 hero、產品家族、OrientAI、產業、三則案例、最新文章與新聞、聯絡 CTA，照 M3-01 wireframe 做，沒有逐段對照現站。下表的「沒搬的原因」因此大多是「新站首頁結構沒有這一區」，引用 `docs/status.md` 的 M3-04。

| 段落 | 事實 id | 沒搬的原因 |
|---|---|---|
| 首頁 banner 輪播（8 則）：主權 AI、攜手 OpenAI、群聯越南 AI、GreenSwift 通過溫室氣體盤查、產品碳足跡 AUP 與 ISO 27701、SysTalk.VIKI、DigiLism 新形象、昕力通過 ISO27701、digiRunner 開源專案 | 沒有收：banner 文字只在頁面的 Nuxt payload（`<script>`），`facts-candidates.md` 不掃 script；相關事實另見 `cert-greenswift-aup`（GreenSwift 頁）、`aiso-*`（AISO 頁）、`cert-iso27001-product-platform` | 新站 hero 改成一句定位，不放輪播。banner 影片的處理寫在 `docs/research/features.md`「自架 MP4：首頁 banner」 |
| 案例亮點 10 則中的 7 則：遠距投保平台、智慧健康管理平台、電子點數兌換平台、iTalent 職能管理平台、業務績效管理平台、網站內容管理平台、行動網銀整合平台 | `remote-insurance-title`、`remote-insurance-result`、`smart-health-title`、`smart-health-result`、`e-points-title`、`e-points-result`、`italent-title`、`italent-result`、`sales-performance-title`、`sales-performance-result`、`web-cms-title`、`web-cms-result`、`mobile-banking-title`、`mobile-banking-result` | 新站只放 3 則（`src/data/home/zh-TW.ts` 的 `cases`），無其他紀錄 |
| 「屢獲肯定 也是我們追求創新的承諾」：介紹句加獎項圖片 | 介紹句沒有事實。獎項本身收在關於我們頁：`award-taiwan-excellence-2023` ⚠、`award-taiwan-excellence-2024` ⚠、`award-ft-high-growth-2022` ⚠、`award-gartner-cool-vendor-2018` ⚠ 等 14 筆，全部 ⚠（年份與獎項可能過時） | 新站首頁結構沒有這一區（M3-04）。現站首頁的獎項是圖片，沒有文字 |
| 「深耕台灣，邁向全球市場 為企業打造不同凡響的成功案例」：成功案例輪播 | 客戶名稱 `client-*` 57 筆，全部 ⚠（客戶名稱用於行銷要確認授權） | 新站首頁以 3 則案例亮點取代；案例本身在 `/success-stories`（M5-03，#28） |
| 客戶證言 5 則：政大金融科技研究中心、國泰金控、卓新工業、微笑單車、新光銀行，含說話人姓名與職稱 | `testimonial-nccu-fintech` ⚠、`testimonial-nccu-fintech-speaker` ⚠、`testimonial-cathay-fhc` ⚠、`testimonial-cathay-fhc-speaker` ⚠、`testimonial-excellence-wire` ⚠、`testimonial-excellence-wire-speaker` ⚠、`testimonial-youbike` ⚠、`testimonial-youbike-speaker` ⚠、`testimonial-shin-kong-bank` ⚠、`testimonial-shin-kong-bank-speaker` ⚠、`client-youbike-operator` ⚠ | 新站首頁結構沒有這一區（M3-04）；證言含真實人名與職稱，授權未確認 |
| 服務客戶 logo 牆 | logo 是圖片，沒有文字；名稱見 `client-*` ⚠ | 新站首頁結構沒有這一區（M3-04）；客戶 logo 的授權列在 `docs/design/brand-assets.md` 指向的 M5-03 待確認 |
| IDC 報告下載表單：「以軟體創新為企業掌握數位發展」，留資料索取 IDC 對昕力的分析報告 | 沒有收：報告名稱與 IDC 調查只在表單說明，沒有可查證的結論 | 現站是全站共用彈窗（`docs/research/features.md`「IDC 報告索取彈窗」）；`docs/research/audience-and-goals.md` 計畫合併成共用的內容下載表單，新站還沒有 |

## digiRunner 產品頁 `/products/digirunner`

現站來源：https://www.tpisoftware.com/products/digirunner（舊網址 `/digirunner-api-management` 轉址到這裡）

新站有：tagline、四個「零」（features）、五個產業頁籤的標題與第一行（useCases）、demo CTA。其餘段落的紀錄在 `docs/content/products.md` 第 60 行（M3-05、M5-01）：「現站的 AI Gateway、AI Governance、五大應用、四大機制、API Composer／沙盒／即時主控台、資安、金檢合規段落沒有欄位」。

| 段落 | 事實 id | 沒搬的原因 |
|---|---|---|
| hero 的兩個證據點：DigiLism 7 項發明專利、ISO27001 認證；hero CTA「30 天免費試用」「預約演示」 | `digilism-patents-7` ⚠、`cert-iso27001-digirunner`、`digirunner-trial-30-days` | offering schema 的 hero 只有 tagline，沒有證據點欄位（`docs/content/products.md` 第 60 行未列，無紀錄） |
| 「API + AI 助力企業 靈活 API 管理」：AI Gateway（負載平衡、資料安全、模型配置、透明管理）與 AI Governance（內容審查、流量管理、商業應用） | `digirunner-ai-gateway`、`digirunner-ai-model-config`、`digirunner-ai-usage-log`、`digirunner-ai-governance`、`digirunner-ai-content-review`、`digirunner-ai-traffic` | schema 沒有欄位（`docs/content/products.md` 第 60 行） |
| 「開放數位治理的最佳實踐」：API 生命週期、Open API、OAuth2.0／OIDC | `digirunner-api-lifecycle` | 無紀錄 |
| 部署方式：地端、雲端、K8s；APIM 雲端多雲與混合雲 | `digirunner-deployment`、`digirunner-multi-cloud` | 無紀錄。雲端版另有 `/products/digirunner-cloud` |
| 五個產業頁籤的其餘 5–6 行（新站每個頁籤只搬了第一行）：金融 7 行、保險 7 行、醫療 7 行、物聯網 7 行、政府 7 行 | `digirunner-finance-compliance-100` ⚠、`digirunner-insurance-compliance-100` ⚠、`digirunner-fhir`；其他行是表述，頁籤標語由 `ignore` 規則略過 | `useCases` 每項只有 title 與 body；`useCases.industry` 沒有保險、醫療、物聯網（`docs/content/products.md` 第 60 行） |
| 「五大應用 強化數位轉型」：API Gateway、既有系統重構、企業中台建構、異質系統整合、開放 API 應用 | `digirunner-five-applications` | schema 沒有欄位（`docs/content/products.md` 第 60 行） |
| 「四大機制 獨家技術」：智慧快取、負載平衡、平行處理、容器延展 | `digirunner-smart-caching`、`digirunner-smart-caching-patent`、`digirunner-load-balancing`、`digirunner-parallel-processing`、`digirunner-container-scaling` | schema 沒有欄位（同上） |
| API Composer、API 沙盒模擬測試、API 即時主控台 | `digirunner-api-composer`、`digirunner-sandbox`、`digirunner-console` | schema 沒有欄位（同上） |
| 「控管系統安全 企業資安守門員」：OAuth 2.0、OIDC、API Key、mTLS、JWT、HSM | `digirunner-security` | schema 沒有欄位（同上） |
| 「國內唯一符合遵循金管會法令」：金融檢查的 9 項 API 管理作業 | `digirunner-claim-fsc-only` ⚠、`digirunner-financial-inspection` | schema 沒有欄位（同上）；「國內唯一」是最高級宣稱，⚠ |
| 「digiRunner v.s. Kong」比較表：整合性、導入效率、可視化管理、合規性、維運負擔 | `digirunner-vs-kong-integration` ⚠、`digirunner-vs-kong-adoption` ⚠、`digirunner-vs-kong-visibility` ⚠、`digirunner-vs-kong-compliance` ⚠、`digirunner-vs-kong-operations` ⚠ | 無紀錄。M3-05 之後才出現在現站的可能性高（`docs/content/products.md` 第 60 行沒有列） |
| 「深受企業客戶讚譽、信賴」：成功案例 3 則（台新銀行現金業務 API 平台，獲 Global Finance 2020 獎；臺北市政府 API 管理平台；Pharmacity API 服務管理平台） | `digirunner-case-taishin` ⚠、`award-global-finance-2020` ⚠、`digirunner-case-taipei-city` ⚠、`digirunner-case-pharmacity` ⚠、`client-taishin-bank` ⚠、`client-taipei-city` ⚠、`client-pharmacity` ⚠ | 各產品頁的成功案例段落留給 M5-03（`docs/content/products.md` 第 49 行）；案例在 `/success-stories` 另有頁面，產品頁沒有連過去 |
| 「立即解鎖以 APIM 開啟企業創新」：digiRunner Enterprise／Cloud 兩個版本，產品資訊、文件中心、白皮書、快訊的連結 | 沒有事實，只有連結 | 無紀錄。白皮書是 `/whitepaper/api-strategies`（gated-download） |
| 「進一步掌握 API 管理最新趨勢」：相關 blog 文章 | — | 產品頁的相關文章改讀 `blog.relatedOfferings`，目前沒有文章填這個欄位（`docs/status.md`，#101） |

## 金融產業頁 `/industries/finance`

現站沒有金融產業頁。新站節點寫「承接 /products/open-banking 內容，其餘介紹需人工提供」（`docs/ia/nodes.csv`），所以對照的現站來源是 https://www.tpisoftware.com/products/open-banking。

新站有：tagline「昕力資訊實現三階段開放銀行規範」、description、四項 highlights（三個階段各一段，加上「安全合規的技術架構」）。紀錄在 `docs/content/products.md` 第 83 行：「開放銀行說明、傳統與開放銀行比較、授權流程圖未搬；產業頁其餘介紹需人工提供」。

| 段落 | 事實 id | 沒搬的原因 |
|---|---|---|
| 開頭的開放銀行定義：在客戶同意下以 OpenAPI 把資料開放給 TSP | — | 未搬（`docs/content/products.md` 第 83 行）；新站首頁的產業 tagline 用了這句（`src/data/home/zh-TW.ts` 的 `industryLines`） |
| 「什麼是開放銀行」：PSD2、英國、各國法令與台灣金管會三階段的起源 | `open-banking-history`、`open-banking-taiwan-2019` ⚠ | 未搬（同上）；時程可能過時 |
| 「台灣開放銀行三階段」時間軸：2019、2020、2021 Q1 | `open-banking-stage-1` ⚠、`open-banking-stage-2` ⚠、`open-banking-stage-3` ⚠ | 新站 highlights 只搬了各階段的 digiRunner 說明，沒有搬時間軸；時程可能過時（`docs/content/products.md` 第 83 行） |
| digiRunner 賦能金融機構與 TSP 的導言段 | `digirunner-open-banking-fsc` | 無紀錄（新站 description 用了同頁另一句） |
| 「傳統銀行 VS 開放銀行」比較圖 | —（圖中的文字是表述，由 `ignore` 規則略過） | 未搬（`docs/content/products.md` 第 83 行） |
| 「安全合規的技術架構」的授權流程圖（Figure A，TSP、OAuth Server、Resource Server 的步驟） | `digirunner-open-banking-no-credentials`；流程圖標籤由 `ignore` 規則略過 | 未搬（同上）；新站只搬了段落說明 `digirunner-open-banking-consulting` |
| 「如何選擇 API 管理平台？」：選擇平台的考量（介接格式、圖形化介面、合作夥伴權限、OAuth2） | —（一般性的選購建議，不是昕力的事實） | 無紀錄 |
| 「TPI digiRunner 協助打造 API 平台戰略」：強化資安保護、彈性擴充服務、貼近使用者、服務安全穩定、豐富經驗實例 | `digirunner-oauth2`；其他四項的事實 id 見 `facts.yaml` 的「Open Banking (digiRunner)」group | 無紀錄 |
| 金融業的其他產品與方案：現站散在 InsureBrick、InsureRing、智慧理賠、智慧建檔、systalk-icr 等頁，不在開放銀行頁 | `insurebrick-*`、`insurering-*`、`smartclaim-*`、`smartfilling-*` | 不是未搬：這些是 `industry-finance` 的子節點或有自己的頁面（`docs/ia/nodes.csv`）。產業頁要不要整理成一段，留給策略階段 |
| 金融客戶的成功案例（ANZ、國泰、新光、台新等） | `client-*` ⚠、`digirunner-case-taishin` ⚠ | 案例在 `/success-stories`，可依 `industry: finance` 篩選（M5-03）；產業頁沒有連過去，無紀錄 |

## AI 智能理賠 `/solutions/smartclaim`

現站來源：https://www.tpisoftware.com/solutions/smartclaim（對照日期 2026-11-05）

新站有：title、tagline、description（改寫自介紹段）、features 4 項（AI OCR 助快速登打、文件高辨識解析能力、RPA 流程自動化、協助理賠審核判讀）、useCases 1 項（保險業 - 醫療文件解析）、contact CTA（`src/content/offering/zh-TW/smartclaim.md`）。內容檔沒有 `facts` 欄位；features「協助理賠審核判讀」的原文收為 `smartclaim-review-engine`。紀錄在 `docs/content/migration.md` 第 199 行（M5-02）：「offering schema 沒有欄位的段落不搬：介紹段、「流程架構」圖、三項優勢、適用產業、服務客戶 logo、影片（smartclaim）」。這次對照時現站頁面上沒有看到「適用產業」與「服務客戶 logo」。現站新聞 457 的標題「昕力資訊 AI 智能理賠解決方案獲 2024 金漾獎」另收為 `award-golden-yang-2024-smartclaim`，不是這頁的段落。

| 段落 | 事實 id | 沒搬的原因 |
|---|---|---|
| 介紹段「全球保險業的轉型新未來 核心業務智能化是為主要關鍵」：保險理賠需大量人力、AI 是轉型策略 | — | 介紹段沒有欄位（`docs/content/migration.md` 第 199 行）；新站 description 改寫了這段 |
| 「AI 保險智能理賠解決方案」：結合 NLP、AI OCR、RPA 技術讓保險理賠流程自動化（features 的區塊標題） | `smartclaim-technologies` | 無紀錄。features 的四項本身已搬，區塊標題沒有欄位 |
| 「AI 文本分析技術 引領保險業趨勢」：自主研發 NLP、多模型集成學習、獨家 AI 進化系統「一鍵優化」，配一支自架 MP4（`/images/solution/smartclaim/feature05.mp4`）與「欲獲知更多獨家AI進化系統應用 請與我們聯繫」 | `smartclaim-nlp`、`smartclaim-ensemble`、`smartclaim-one-click-retraining` | 影片沒有欄位（`docs/content/migration.md` 第 199 行）；影片的處理見 `docs/research/features.md` 第 139 行「自架 MP4：產品與服務頁」 |
| 「流程架構」：流程圖，加一句「業者獲取保戶診斷書及單據資料證明後，只需要進行掃描建檔……」 | `smartclaim-flow` | 「流程架構」圖沒有欄位（`docs/content/migration.md` 第 199 行） |
| 三項優勢「我們為理賠業務打造最佳決策系統」：省時省力（人力成本節省達 80% 以上）、品質保證、完善流程（串接自動立案、自動理算、自動派件） | `smartclaim-80-percent` ⚠、`smartclaim-quality`、`smartclaim-end-to-end` | 三項優勢沒有欄位（`docs/content/migration.md` 第 199 行） |
| 頁尾導流「引領企業前進，導入 DigiLism 企業服務中台 (iPaaS)，開啟數位轉型之旅。」連到 DigiLism | — | 無紀錄 |

## AI 智慧建檔 `/solutions/smartfilling`

現站來源：https://www.tpisoftware.com/solutions/smartfilling（對照日期 2026-11-05）

新站有：title、tagline、description（取自現站 meta description）、features 4 項（前處理模組、企業專屬 AI 模型、資料增強、內部自主訓練維運）、useCases 1 項（金融業應用－傳統文件數位化管理第一步）、contact CTA（`src/content/offering/zh-TW/smartfilling.md`）。內容檔沒有 `facts` 欄位。紀錄同上：`docs/content/migration.md` 第 199 行。另外 `docs/content/products.md` 第 72 行記了 systalk-icr 頁上「AI 智慧建檔與智能理賠兩個解決方案」沒有搬進 systalk-icr。

| 段落 | 事實 id | 沒搬的原因 |
|---|---|---|
| 介紹段「實現類比資料數位格式智慧化 SysTalk.ICR 技術與商業模式領先市場」：獨家自建 AI 演算法模型，建構 SysTalk.ICR 與 SysTalk.PUZZLE 模型再訓練機制 | `smartfilling-icr-puzzle`；標題「技術與商業模式領先市場」是宣稱，沒有收（最後一節） | 介紹段沒有欄位（`docs/content/migration.md` 第 199 行） |
| 「高效人工智慧 全面改造資料建檔流程」：為客戶建構獨家 AI 模型，改善傳統 OCR 辨識困難（features 的區塊標題） | `smartfilling-custom-model` | 無紀錄。features 的四項本身已搬 |
| 「流程架構」：流程圖，加一句「SysTalk.ICR 加上再訓練機制，高辨識、高精準度……」 | `smartfilling-flow` | 「流程架構」圖沒有欄位（`docs/content/migration.md` 第 199 行） |
| 三項優勢「借助 AI 人工智慧 推動企業革新力」：前沿技術（基金配息單、居留證等收件流程）、賦能員工、精準快速（AI 文本分析） | `smartfilling-documents`（前沿技術）、`smartfilling-less-keying`（賦能員工）、`smartfilling-text-analysis` | 三項優勢沒有欄位（`docs/content/migration.md` 第 199 行） |
| 頁尾導流「引領企業前進，導入 DigiLism 企業服務中台 (iPaaS)，開啟數位轉型之旅。」 | — | 無紀錄 |

## SysTalk.ai 產品家族頁 `/products/systalk-ai`

現站來源：https://www.tpisoftware.com/products/systalk-ai（對照日期 2026-11-05）。新站內容檔另外併入 https://www.tpisoftware.com/products/systalk-ai-phison（`docs/research/content-audit.md` 第 79 行，不在導覽的行銷 landing page），下表後半列出那頁的段落。

新站有：title、description（現站 meta description）、tagline、hero 圖（`family-ai.webp`）、highlights 3 項（取自 systalk-ai-phison 的三項好處；第 3 項的原文收為 `aiso-hw-sw-integrated`），以及 hub 模板依 `nodes.csv` 產生的子頁卡片（systalk-chat 到 orient-ai 共 10 個子節點，卡片文字是各 offering 的 description）（`src/content/hub/zh-TW/family-ai.md`）。內容檔沒有 `facts` 欄位。紀錄在 `docs/content/products.md` 第 79 行（M5-01）：「主頁的「已為全球超過 1.4億用戶」、一日應用情境、SysTalk.Service 導入前中後未搬；`highlights` 取自併入的 `systalk-ai-phison`……該頁 FAQ 4 題、方案表、影片 2 支未搬」。

| 段落 | 事實 id | 沒搬的原因 |
|---|---|---|
| hero 的證據點「已為全球超過 1.4億用戶 協助企業推進 AI 化營運」，與英文標語「The Right AI, The Right Decisions, The Best Results」 | `systalk-ai-140-million-users` ⚠ | 未搬（`docs/content/products.md` 第 79 行）；hub schema 沒有證據點欄位 |
| 一日應用情境「讓AI彈性融入企業全日應用 Your Perfect Day with Generative AI」：SysTalk.Coach、ICR、VIKI、Audit、Chat 在一天裡的用法（含「智能理賠專利」「兩腦一流程專利」） | `systalk-ai-products`、`systalk-ai-claim-patent`、`systalk-ai-chat-patent`、`systalk-ai-day-scenarios`（VIKI）、`systalk-ai-day-coach`、`systalk-ai-day-audit` | 未搬（`docs/content/products.md` 第 79 行） |
| 「生成式 AI x 分辨式 AI x SysTalk. Service」：打造企業雲／地端 AI 完整解決方案 | `systalk-ai-service` | 無紀錄 |
| 「企業數位轉型不再拼拼湊湊」：SysTalk.ai 革新企業內外部營運流程，三張圖卡「操作零門檻」「提升企業效率」「顧問式導入」 | — | 無紀錄 |
| 「專業AI導入團隊 提供企業級 SysTalk.Service」：導入前、導入中、導入後三階段 | `systalk-ai-onboarding`、`systalk-ai-onboarding-finetune`（導入中後半）、`systalk-ai-after-onboarding` | 未搬（`docs/content/products.md` 第 79 行） |
| 頁尾「探索更多 SysTalk.ai 人工智慧產品與解決方案……取得報價：aiagent@tpisoftware.com」 | `systalk-ai-quote-email` | 無紀錄 |
| （併入頁）hero「別再受限於「通用型 AI」 打造真正由企業掌控的「私有 AI 核心」」：100% AI 主控權、CIO 調查三個數字（超過 60%、80%、24%） | `aiso-100-percent-control` ⚠、`aiso-cio-survey` ⚠ | 無紀錄（`docs/content/products.md` 第 79 行只寫了 highlights 的來源） |
| （併入頁）「企業轉型不該卡在「硬體太貴」或「軟體太難」」：三個「怕」與對應說明（群聯 aiDAPTIV、搭載 SysTalk.ai、運算在地化） | `aiso-phison-patent` ⚠、`aiso-systalk-platform`、`aiso-local-audit` | 無紀錄 |
| （併入頁）「昕力資訊打造聚焦企業級 AI 應用功能模組」15 個模組；「各產業皆可用!」5 個產業 | `aiso-modules`、`aiso-industries` | 無紀錄 |
| （併入頁）「PHISON 獨家專利技術 突破記憶體容量限制」：LLM fine-tune 效能比較、70B 模型、Dell／HPE 比較、回應快 25 倍、52 秒縮短到 2 秒，配 2 支自架 MP4 | `aiso-finetune-benchmark` ⚠、`aiso-70b-on-4-gpus` ⚠、`aiso-10x-dell-hpe` ⚠、`aiso-25x-response` ⚠、`aiso-52-to-2-seconds` ⚠ | 影片 2 支未搬（`docs/content/products.md` 第 79 行）；效能比較段落無紀錄 |
| （併入頁）「AISO 打造 — All-in-one 訓練一體機方案」方案表：aiDAPTIV 4-GPU／8-GPU Server | `aiso-servers`、`aiso-use-cases`（適用場景）；「方案特色」列只有「高性價比」「高性能」，是表述 | 方案表未搬（`docs/content/products.md` 第 79 行） |
| （併入頁）「我們擁有豐富 AI 轉型經驗與實力」 | —（標題下沒有文字） | 無紀錄 |
| （併入頁）FAQ 4 題：成本、為何能跑更大模型、支援哪些模型、沒有 AI 團隊能否導入 | `aiso-memory-optimization`、`aiso-llm-support`、`aiso-onboarding`；第 1 題（成本）沒有收（最後一節） | 未搬（`docs/content/products.md` 第 79 行） |

## OrientAI `/orient-ai`

現站來源：https://www.tpisoftware.com/orient-ai（`/orient-aI` 併入，對照日期 2026-11-05）

新站有：title、tagline、description（現站 meta description）、features 5 項（第一段的 5 張卡片）、FAQ 5 題、demo CTA（`src/content/offering/zh-TW/orient-ai.md`）。內容檔沒有 `facts` 欄位；新站已顯示的卡片說明與 FAQ 原文收為 `orientai-token-transparency`、`orientai-risk-insight`、`orientai-privacy-industries`、`orientai-shadow-ai-lifecycle`、`orientai-data-silos`、`orientai-token-allocation`。紀錄在 `docs/content/migration.md` 第 222 行（#106）：「作業效率 40-60% 等三個數字、執行層與治理層兩張卡片（含應用場景）、「實現人與 AI Agent 的協作」三組條列與截圖、「OrientAI + AI 硬體」（群聯 aiDAPTIV、AI PC／Workstation／AI Server）、白皮書與 blog 的連結」。

| 段落 | 事實 id | 沒搬的原因 |
|---|---|---|
| 效益三個數字：作業效率 40-60%、營運成本 20-30%、治理風險 90% | `orientai-benefits` ⚠ | 沒有欄位（`docs/content/migration.md` 第 222 行） |
| 「OrientAI 建構從意圖輸入到任務完成 再到全局治理的完整閉環」：三步驟（對話式任務發起、AI Agent 分派與執行、Agent 管理與治理），加上執行層「讓 AI 做事」與治理層「讓 AI 可控」兩張卡片，各 4 項功能與 4 個應用場景 | `orientai-task-intake`、`orientai-agent-dispatch`、`orientai-agent-management`（三步驟）、`orientai-execution-layer`、`orientai-governance-layer`、`orientai-execution-scenarios`、`orientai-governance-scenarios` | 沒有欄位（`docs/content/migration.md` 第 222 行） |
| 「OrientAI｜實現人與 AI Agent 的協作 創造可衡量、最大化的 AI ROI」：Agent 協作無間、強化 AI 治理、優化 ROI 效益三組條列與 3 張儀表板截圖 | `orientai-collaboration`、`orientai-governance-controls`、`orientai-roi-controls`；截圖沒有文字 | 沒有欄位（`docs/content/migration.md` 第 222 行） |
| 「OrientAI + AI 硬體：應用、治理、算力 一應俱全」：群聯 aiDAPTIV 記憶體擴充、1-5 人團隊用 AI PC／Workstation、5 人以上用 Workstation／AI Server，按鈕「立即探索一體機方案」連到 `https://aisoportal.com/hardware` | `orientai-aidaptiv`、`orientai-hardware-small`、`orientai-hardware-large`；句尾「同級模型 AI 推論效能與回應速度大幅提升」沒有收（最後一節） | 沒有欄位（`docs/content/migration.md` 第 222 行） |
| 「打造高效自動化 Agentic Workflow」引言，兩個按鈕：「深入瞭解產業應用場景」連 `/whitepaper/systalk-ai`、「解鎖企業 AI Agent 落地路徑」連 `/blog/ai/what-is-ai-agent-management-platform` | — | 白皮書與 blog 的連結沒有欄位（`docs/content/migration.md` 第 222 行）。新站有這篇 blog（`src/content/blog/zh-TW/what-is-ai-agent-management-platform.md`），但它沒有把 orient-ai 寫進 `relatedOfferings`；`whitepaper-systalk-ai` 節點在 `nodes.csv`，`src/content/whitepaper/zh-TW/` 沒有內容檔 |

## AISO 主權 AI `/aiso`

現站來源：https://www.tpisoftware.com/aiso（對照日期 2026-11-05）

新站有：title、tagline、description（現站沒有 meta description，用 tagline）、features 8 項（8 張方案卡片的標題與說明）、contact CTA（`src/content/offering/zh-TW/aiso.md`）。內容檔沒有 `facts` 欄位。紀錄在 `docs/content/migration.md` 第 223 行（#106）：「方案卡片的領域標籤（法務、人力資源等）與連到 `aisoportal.com` 的「了解更多」」。

現站這頁的內文只有 hero 與 8 張卡片，SSR HTML 已經有全部文字。逐一確認過：頁面專屬的 chunk `/_nuxt/e59c0f5.js` 的字串與 HTML 相同（hero 兩句、8 個領域標籤、8 張卡片的標題與說明、8 個 `aisoportal.com/zh-tw/bundled-solution/*` 連結）；`window.__NUXT__` payload 只有 blog 分類，沒有這頁的內容；`<title>` 只有「昕力資訊」，沒有 meta description。`facts-candidates.md` 說這頁「沒有像事實的段落」，是因為內文沒有數字、認證、獎項、客戶名；hero 的定位句與 8 張卡片的說明是產品功能，#199 收進事實庫：`aiso-ecosystem`、`aiso-legal-contract`、`aiso-hr-labor-law`、`aiso-hr-employee-service`、`aiso-agent-governance`、`aiso-compute-control`、`aiso-talent`、`aiso-teaching`、`aiso-medical-records`，`source.url` 是這頁。其他 `aiso-*` 的來源不是這頁：20 筆是 `/products/systalk-ai-phison`，`aiso-alliance` 是現站新聞 559 的標題。

| 段落 | 事實 id | 沒搬的原因 |
|---|---|---|
| hero 的 AISO wordmark 圖（`/images/aiso/wordmark.png`，alt「AISO」） | — | 無紀錄。新站 title 用了 alt 文字（`docs/content/migration.md` 第 211 行） |
| 8 張方案卡片的領域標籤：法務、人力資源（2）、AI 治理（2）、教育（2）、醫療 | — | 沒有欄位（`docs/content/migration.md` 第 223 行） |
| 每張卡片的「了解更多」，連到 `aisoportal.com/zh-tw/bundled-solution/` 下的 8 頁（contract-review、hr-compliance、employee-services、enterprise-ai-agent-governance、enterprise-ai-metering、ai-talent-nurturing、teacher-preparation、clinical-records） | — | 沒有欄位（`docs/content/migration.md` 第 223 行）。各方案的詳細內容在 aisoportal.com，不是 tpisoftware.com 的頁面，不在事實庫的來源範圍 |

## GreenSwift 產品頁 `/products/greenswift`

現站來源：https://www.tpisoftware.com/products/greenswift（對照日期 2026-11-05）。新站內容檔另外併入 https://www.tpisoftware.com/carbon（`docs/research/content-audit.md` 第 86 行，GreenSwift 推廣頁），下表最後幾列是那頁的段落。

新站有：title、tagline、description（現站 meta description 刪減）、features 7 項（碳盤查、CBAM、碳足跡三張卡，加上清冊上傳、變更計算、雲端協作、檔案中心四個頁籤）、FAQ 11 題、demo CTA（`src/content/offering/zh-TW/greenswift.md`）。內容檔沒有 `facts` 欄位；新站已顯示的「檔案中心」與 FAQ 的原文收為 `greenswift-file-center`、`greenswift-report-method`、`greenswift-accounts`、`greenswift-collaboration`、`greenswift-consultant-access`、`greenswift-trial`。現站新聞 580 的和鼎隆建築案例標題另收為 `greenswift-case-hedinglong`、`client-hedinglong`，不是這頁的段落。紀錄在 `docs/content/products.md` 第 77 行（M5-01）：「方案表、六大盤查步驟、儀表板說明未搬；`/carbon` 的……經濟型方案價格（每支產品 15 萬）、第三方查證機構名稱（愛法諾、亞瑞士）、5 題 FAQ、短網址申請連結未搬」；待確認「通過國際查證機構核發 AUP 認證」的機構與效期。

| 段落 | 事實 id | 沒搬的原因 |
|---|---|---|
| hero CTA「預約演示」「申請試用」 | — | 新站只有一個 CTA，`cta: demo`；無紀錄 |
| 「AI 人工智慧 碳盤查效益全面提升 數據為軸心 啟動減碳齒輪」：介紹句、「通過國際查證機構核發AUP認證」、五項效益（精準掌握內部資訊……大幅提升企業形象，提高投資評級） | `cert-greenswift-aup`；五項效益是表述 | 無紀錄。AUP 的機構與效期待確認（`docs/content/products.md` 第 77 行） |
| 「一站全面盤查 輕鬆完成碳排放管理！」六大步驟：盤查計畫、組織邊界、排放源鑑別、排放量計算、盤查報告、查證作業 | `greenswift-six-steps` | 未搬（`docs/content/products.md` 第 77 行） |
| 「GreenSwift 一一為企業突破碳盤阻礙」：引言「不知道如何下手寫報告書？……」、顧問輔導（協助企業弭平資訊落差）、AI 協力（一鍵生成溫室氣體報告） | `greenswift-cloud-consultants`（引言）、`greenswift-ai-report`；顧問輔導那項只有「協助企業弭平資訊落差」一句，是表述 | 無紀錄 |
| 「打造綠色未來」的「儀表板」頁籤：圖形化介面，可整合七大溫室氣體排放，範疇一到範疇三的說明 | `greenswift-seven-ghg`、`greenswift-scopes` | 儀表板說明未搬（`docs/content/products.md` 第 77 行） |
| 「變更計算」頁籤裡另一行「通過國際查證機構核發AUP認證」 | `cert-greenswift-aup` | 無紀錄（新站「變更計算」只搬了說明段） |
| 「GreenSwift 產品方案」方案表：碳盤查會員、CBAM會員、碳足跡會員、全功能會員的功能內容，「立即試用」按鈕，顧問服務「請聯繫我們」 | `greenswift-plans`、`greenswift-carbon-plan`、`greenswift-cbam-plan`、`greenswift-footprint-plan`；全功能會員那欄沒有收（最後一節） | 方案表未搬（`docs/content/products.md` 第 77 行） |
| 導流區：「企業節電系統 ElectriSwift AI 智慧建築節能系統」、「碳盤查輔導認證服務 ESG 碳盤查顧問服務」；FAQ 後的 ESG 顧問導流「台灣最完整的顧問服務，匯聚淨零產學界專家……」連 `/esg-advisory` | `esg-advisory-claim-most-complete` ⚠ | 無紀錄。ElectriSwift、ESG 顧問在新站各有頁面 |
| 申請試用彈窗「碳焦慮我們懂，立即申請試用！」：六大步驟管理類別一至類別四排放源、註冊流程、一個工作日審核、30 天試用、聯絡信箱 | `greenswift-categories`、`greenswift-review-one-day`、`greenswift-trial-30-days` | 無紀錄。彈窗連到 `https://greenswift.tpisoftware.com/website/esg/ui` |
| （併入頁 `/carbon`）「讓碳足跡成為企業標配」GreenSwift 經濟型方案：20% 關鍵產品、執行週期 3-4 個月、方案價格每支產品 15 萬、第二支加價 10 萬、服務內容（1 支產品碳足跡，搖籃到大門） | 沒有收：`/carbon` 的 `page_type` 是 campaign，不在 `facts-candidates.md` 的範圍（59 頁），原因見最後一節 | 價格未搬（`docs/content/products.md` 第 77 行） |
| （併入頁 `/carbon`）三項：數位化精準管理（碳足跡完整功能一年使用）、專家手把手帶領（3 小時教育訓練 + 1 次專家現場實際盤查）、符合國際標準（第三方查證機構愛法諾、亞瑞士） | 沒有收（同上） | 查證機構名稱未搬（`docs/content/products.md` 第 77 行）；其他兩項無紀錄 |
| （併入頁 `/carbon`）FAQ 5 題：碳盤查與碳足跡的差別、搖籃到大門、沒有 PCR 也可以做、一定要做查證嗎、做完一支產品後可以延伸嗎 | 沒有收（同上） | 未搬（`docs/content/products.md` 第 77 行） |

## DigiLism 產品家族頁 `/products/digilism`

現站來源：https://www.tpisoftware.com/products/digilism（對照日期 2026-11-05）

新站有：title、tagline、description（現站 meta description 刪減，與「強力支援系統整合」段落同句）、hero 圖（`family-dx.webp`）、highlights 6 項（「DigiLism 為何與眾不同？」；「API 管理模組」的原文收為 `digilism-api-first`），以及 hub 模板依 `nodes.csv` 產生的子頁卡片（digirunner 到 interactivehealth，卡片文字是各 offering 的 description）（`src/content/hub/zh-TW/family-dx.md`）。內容檔沒有 `facts` 欄位。紀錄在 `docs/content/products.md` 第 80 行（M5-01）：「IDC 報告下載（表單，M6）、整合綜效 4 項、服務能力 5 項未搬；`highlights` 只放「DigiLism 為何與眾不同？」6 項」。

| 段落 | 事實 id | 沒搬的原因 |
|---|---|---|
| hero 的說明「昕力資訊能為 BFSI 全應用場景提供安全可靠、高效運作的服務應用中台……」與「下載 IDC 報告」按鈕 | `digilism-bfsi` | 無紀錄（說明句）；IDC 報告見最後一列 |
| 「DigiLism 發揮整合綜效 讓金融上雲無懈可擊」：iPaaS 說明與 4 項（新舊兼容、高效運行、資源整合、零停機） | `digilism-ipaas`、`digilism-patent-background-processing`、`digilism-patent-resource-scheduling`、`digilism-patent-load-balancing`、`digilism-patent-sla` ⚠、`digilism-compatibility`（新舊兼容） | 整合綜效 4 項未搬（`docs/content/products.md` 第 80 行） |
| 「強力支援系統整合 成就現代化核心」整段 | `digilism-system-integration` | 不是未搬：新站 description 用了這段的前半；段落本身無紀錄 |
| 「企業服務中台 引領金融科技的關鍵」：銀行、保險產業的新舊服務串接問題 | —（`facts-candidates.md` 略過：產業背景） | 無紀錄 |
| 「服務能力」5 項：服務能力、數位治理、可連接性、高安全性、可擴展性 | `digilism-five-capabilities` | 未搬（`docs/content/products.md` 第 80 行） |
| 「建構強大中台讓企業創新加速 實現服務規模化」聯絡 CTA | — | 無紀錄 |
| 「為企業整合最實用的應用中台」：DigiLism 系列三大面向，5 張產品卡（digiRunner、digiLogs、digiMars、digiFlexis、digiCare）的現站說明 | `digilism-solution-areas`、`digilism-family-digirunner`、`digilism-family-digilogs` ⚠、`digilism-family-digimars`、`digilism-family-digiflexis`、`digilism-family-digicare`、`digilism-family-digirunner-ai`（digiRunner 卡片後半）；digiFlexis 卡片後半沒有收（最後一節） | 不是未搬：新站以 hub 的子頁卡片取代，但卡片文字是各 offering 的 description，不是這 5 句；無紀錄 |
| 「我們為 BFSI 全應用場景提供安全可靠、高效運作的服務應用中台，滿足企業 API 治理需求。」導流 | — | 無紀錄 |
| IDC 報告索取表單「以軟體創新為 企業掌握數位發展」：下載 IDC 針對昕力資訊調查的分析報告 | 沒有收：只有表單說明，沒有報告的結論 | IDC 報告下載是表單（`docs/content/products.md` 第 80 行；`docs/research/features.md` 第 82 行「IDC 報告索取彈窗」） |

## 第一批 7 頁沒收的句子

2026-11-05 在現站頁面看到、#199 補過事實庫後仍不在 `docs/strategy/facts.yaml` 的句子（數字、認證、獎項、客戶、產品功能）。比對方式：頁面的每個文字區塊去掉空白後，不在事實庫任何一筆的 `source.quote` 裡。原文逐字照抄，多個文字區塊連成一句時以一個空格分隔。標「新站已顯示」的是新站內容檔已經放了這句，但內容檔沒有 `facts` 欄位，`facts.mjs` 不檢查。AI 智能理賠、SysTalk.ai 主頁與 `/aiso` 沒有剩下的句子。

### https://www.tpisoftware.com/solutions/smartfilling

- 「SysTalk.ICR 技術與商業模式領先市場」：介紹段標題，是沒有比較依據的宣稱

### https://www.tpisoftware.com/products/systalk-ai-phison（併入 `/products/systalk-ai`）

- 「雲端 LLM 採用用量計費，隨著使用量成長，成本難以預測；本方案以一次性硬體投資+企業級平台授權為主，總持有成本，特別適合想規劃 AI 應用的企業。」：FAQ 第 1 題。這是跟雲端計費比較的說法，原文「總持有成本，」後面像是缺字，句意不完整
- 「此 AI 一體機方案在相同 GPU 規格下，回應速度提升 25 倍，並支援 70B 至 200B 大模型，解決雲端算力成本與資安風險。立即了解這套獲得 2025 AI AWARD 肯定的私有 AI 核心。」：「2025 AI AWARD」只在 `<meta name="description">` 與 `og:description`，頁面內文沒有，查不到獎項的全名與頒發單位（`docs/content/products.md` 第 79 行提過）。25 倍已有 `aiso-25x-response` ⚠

### https://www.tpisoftware.com/orient-ai

- 「同級模型 AI 推論效能與回應速度大幅提升」：`orientai-aidaptiv` 原文的後半句，是沒有比較基準的比較說法

### https://www.tpisoftware.com/products/greenswift

- 「全功能會員」「包含CBAM會員所有功能」「包含碳足跡會員所有功能」「碳足跡不限件數」：方案表的一欄。方案組合可能隨改版調整而過時，前三格只是參照其他方案
- 「如有查證需求，第三方查證機構將依據這些文件進行審核，最終核發查證聲明書。」：新站已顯示，FAQ 第 1 題的最後一句（前面收為 `greenswift-report-method`）。寫的是第三方查證機構的作業，不是 GreenSwift 的功能
- 「GreenSwift 提供係數更新服務和一個易於操作的係數管理介面，允許使用者在計算過程中進行針對性排放源進行更換。未來我們也會推出係數管理中心來進一步支持這項功能。這些服務均不會收取額外費用。」：新站已顯示，FAQ 第 3 題。係數管理中心是規劃中的功能，「不收取額外費用」是收費條件，可能過時（`docs/content/products.md` 第 77 行）
- 「並遵守相關的隱私和數據保護法規。GreenSwift 僅收集為實現服務功能所必需的數據，避免過度或不相關的數據收集，且客戶有權隨時查詢其個人數據的收集情況，並可通過指定渠道聯繫我們以獲取詳細信息。」：新站已顯示，FAQ 第 5 題中段。隱私與資料蒐集的承諾，屬隱私權政策的範圍，不是產品功能
- 「GreenSwift 支援多部門和跨廠區的運用。用戶可以自行設定帳號來用在不同的組織結構，目前多場所報告書功能正在開發中。」：新站已顯示，FAQ 第 7 題。多場所報告書是開發中的功能，可能過時（`docs/content/products.md` 第 77 行）
- 「GreenSwift 還支持靈活的組織分工和角色設定，促進數據彙整和報告產出，滿足多方利害關係人的需求。」：新站已顯示，FAQ 第 8 題的第二句。前一句已收為 `greenswift-collaboration`，這句是同一件事的概括
- 「如果需要進行測試或在試用過程中遇到任何問題，請隨時聯繫我們的支援團隊，您可以通過電子郵件發送至 greenswift@tpisoftware.com 以獲取協助。」：新站已顯示，FAQ 第 11 題的後半（前半收為 `greenswift-trial`）。聯絡方式，不是功能
- 「若超過一個工作天內未收到審核通知或有任何疑問，歡迎來信greenswift@tpisoftware.com。」：申請試用彈窗。聯絡方式；一個工作天的審核已有 `greenswift-review-one-day`

### https://www.tpisoftware.com/carbon（併入 `/products/greenswift`，campaign 頁，不在 `facts-candidates.md` 範圍）

整頁都沒收。

- 「拒絕亂槍打鳥！針對「會被點名」的那 20% 關鍵產品快速取證，保住 100% 的供應鏈信任」：行銷標語，20% 與 100% 沒有出處
- 「執行週期」「3 - 4 個月完成碳足跡報告書 依據是否有 碳足跡產品類別規則 (Product Category Rules, PCR) 而定」、「可以。 我們會依產品類型協助選用合適的方式，只是時程會從 3 個月延長至約 4 個月。」（FAQ 第 3 題）：方案的執行週期，可能隨方案調整而過時
- 「方案價格」「15」「萬／一支產品 第二支同類產品 加價」「10」「萬 不含內部稽核與查證（可依需求加購）」：方案價格，可能過時，對外公開要先確認
- 「服務內容」「1 支產品碳足跡 搖籃到大門 (原料 + 製造 + 運輸)」、「GreenSwift 數位平台(碳足跡完整功能一年使用)，精準產出碳數據。」、「顧問全程即時輔導 (含 3 小時教育訓練 + 1 次專家現場實際盤查)，新手也能輕鬆完成碳足跡。」：方案的服務範圍與限制，可能過時
- 「支援第三方查證機構 (愛法諾、亞瑞士) ，與國際標準接軌，避開合規風險。」：合作單位的名稱，使用授權不明
- 「可以。 平台支援多產品、多據點，完成第一支碳足跡產品後，做下一個產品更容易。」（FAQ 第 5 題）：campaign 頁的說法。「多據點」要跟 `/products/greenswift` FAQ 第 7 題「多場所報告書功能正在開發中」一起確認

### https://www.tpisoftware.com/products/digilism

- 「提升協作效率與決策透明度。」：digiFlexis 卡片的後半（前半是 `digilism-family-digiflexis`），是效益的表述，沒有具體功能
- 「採取數位優先(Digital-First)策略已成數位時代的致勝關鍵。下載 IDC 針對昕力資訊調查的分析報告以了解整合中台如何助攻軟體創新。」：IDC 報告的表單說明，沒有報告的結論
