# 未搬內容盤點（試點三頁）

現站有、新站還沒有的段落，作為 content brief 的素材（`.claude/skills/site-research/SKILL.md`「2. 未搬內容盤點」）。試點頁面依 `docs/strategy/site-profile.md`。

- 只盤點，不判斷要不要放回新站，那是策略階段（#165）的事
- 對照日期 2026-10-31。現站頁面讀自 `scripts/strategy/extract-facts.mjs` 的快取（`.cache/facts`），新站讀 `src/data/home/zh-TW.ts`、`src/content/offering/zh-TW/digirunner.md`、`src/content/hub/zh-TW/industry-finance.md`
- 「事實 id」是 `docs/strategy/facts.yaml` 的 id。標 ⚠ 的是 `to_confirm`，頁面還不能用，原因寫在該筆的 `note`。「—」表示這段沒有事實，只有表述
- 「沒搬的原因」引用當時的紀錄；沒有紀錄的寫「無紀錄」

## 首頁 `/`

現站來源：https://www.tpisoftware.com/

新站首頁（M3-04，#17）的結構是 hero、產品家族、OrientAI、產業、三則案例、最新文章與新聞、聯絡 CTA，照 M3-01 wireframe 做，沒有逐段對照現站。下表的「沒搬的原因」因此大多是「新站首頁結構沒有這一區」，引用 `docs/status.md` 的 M3-04。

| 段落 | 事實 id | 沒搬的原因 |
|---|---|---|
| 首頁 banner 輪播（8 則）：主權 AI、攜手 OpenAI、群聯越南 AI、GreenSwift 通過溫室氣體盤查、產品碳足跡 AUP 與 ISO 27701、SysTalk.VIKI、DigiLism 新形象、昕力通過 ISO27701、digiRunner 開源專案 | 沒有收：banner 文字只在頁面的 Nuxt payload（`<script>`），`facts-candidates.md` 不掃 script；相關事實另見 `cert-greenswift-aup`（GreenSwift 頁）、`aiso-*`（AISO 頁）、`cert-iso27001-product-platform` | 新站 hero 改成一句定位，不放輪播。banner 影片的處理寫在 `docs/research/features.md`「自架 MP4：首頁 banner」 |
| 案例亮點 9 則中的 6 則：遠距投保平台、智慧健康管理平台、電子點數兌換平台、iTalent 職能管理平台、業務績效管理平台、網站內容管理平台、行動網銀整合平台 | `remote-insurance-title`、`remote-insurance-result`、`smart-health-title`、`smart-health-result`、`e-points-title`、`e-points-result`、`italent-title`、`italent-result`、`sales-performance-title`、`sales-performance-result`、`web-cms-title`、`web-cms-result`、`mobile-banking-title`、`mobile-banking-result` | 新站只放 3 則（`src/data/home/zh-TW.ts` 的 `cases`），無其他紀錄 |
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
