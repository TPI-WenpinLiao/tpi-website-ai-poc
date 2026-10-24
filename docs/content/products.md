# 產品內容遷移

M5-01（#26）把現站的產品頁搬進 `offering` 與 `hub` collection，只做 zh-TW。產品頁不像 blog 與新聞有 script 轉換，內容檔是手寫的：文字取自現站，依 [`content-model.md`](../ia/content-model.md) 的欄位重組。搬移規則見 [`content-migration` skill](../../.claude/skills/content-migration/SKILL.md)。

## 範圍

`page-map.csv` 中 zh-TW、`page_type` 為 `product` 或 `product-index` 的 32 列，加上併入產品頁的 `/carbon`、`/genai-solution`，共 34 頁，以及 AWS 買家指南 PDF。

| collection | 內容檔 | 備註 |
|---|---|---|
| `offering` | digirunner、digirunner-cloud、digilogs、digilogs-iso27001、digilogs-detection、digimars、digiflexis、digicare、systalk-chat、systalk-viki、systalk-coach、systalk-audit、systalk-icr、systalk-rpa、gadodido、gadoscout、greenswift、electriswift、insurebrick | digirunner 沿用 M3-05 的版本 |
| `hub` | products、family-ai、family-dx、family-esg、family-security、industry-finance、industry-government | family-security 是 `draft: true` 的新頁 |

不在範圍：`/solutions/*` 的頁面（M5-02），en、vi（M7-02、M7-03），以及 `orient-ai`、`aiso`。後兩頁的 `page_type` 是 `service`，由 #106 用 `offerings.mjs` 轉換（[`migration.md`「服務頁」](migration.md#服務頁)）。

## 寫法

- 只填 schema 既有的欄位，不改 schema 與模板（計畫確認時由使用者決定）。現站放不下的段落列在下方「待確認」
- `sourceUrl` 取 `inventory.csv` 的 `final_url`；`page-map.csv` 的 merge 列寫成陣列，主要來源在前
- `kind` 全部是 `product`，照 `inventory.csv` 的 `page_type`
- `cta`：現站有「預約演示」「預約 Demo」「免費試用」的寫 `demo`，其餘寫 `contact`
- `description` 從現站 meta description 修到 `seo-checklist` 的長度（全形 60–80 字）；現站 description 與頁面主題不符時，改從頁面內文取句
- `features`、`useCases`、`faq`、`highlights` 的文字照抄現站；FAQ 去掉「Q1：」「A：」這類前綴。內容檔的註解寫出每個欄位取自現站哪一段
- `useCases.industry` 只在情境明確屬於金融、政府、製造業時填
- 不放 `heroImage`：現站 banner 幾乎都是含人物的圖庫照，授權未確認；模板的 `heroImage` 只用作 OG 圖，沒填時用站內預設 OG 圖，和 M3-05 的 digirunner 一樣
- 影片不搬（M6-03）；問卷與下載表單不搬（M6）

## 工具

```bash
# 比對內容檔的 tagline、features、useCases、faq、highlights 是否仍在現站（需要連到現站）
node scripts/design/offering-content.mjs

# 下載 downloads 列出的檔案到 public/ 底下的現站路徑（清單在 scripts/content/offering-files.yaml）
node scripts/content/offering-files.mjs
```

下載檔保留現站網址（[`redirects.md`](../ia/redirects.md)「對照規則」），所以檔案放在 `public/` 底下與現站相同的路徑，內容檔的 `downloads[].file` 寫該路徑（百分比編碼）。

`offering-content.mjs` 的一行文字只要出現在該內容檔任一個 `sourceUrl` 頁面上就算找到。內容檔修正了現站錯字時，把〔現站寫法, 內容檔寫法〕加進 script 的 `CORRECTIONS`。2026-10-23 合併 M5-02 後，三語 offering 與 hub 的結果是 756/756（55 個來源頁）；#106 加上 orient-ai、aiso 後是 866/866（63 個來源頁）。

## 待確認

### 全部頁面

| 項目 | 誰確認 |
|---|---|
| 現站產品頁的 banner 圖庫照能否沿用、是否要另外製作產品主視覺（`heroImage`） | 內容負責人 |
| 各頁的「成功案例」段落都有客戶名稱，留給 M5-03（#28）處理；客戶 logo 牆未搬 | 內容負責人 |
| `features` 每一項在產品頁是一個捲動章節，數量 4–11 項（gadoscout 11、systalk-audit 10）。M3-05 核准時 digirunner 是 4 項，項目多的頁面捲動很長，是否刪減 | 設計、內容負責人 |
| 還沒有頁面的節點，在那些頁產生前是失效連結：header 導覽（`main` 上已經如此）；`/products` 的子頁卡片與 gadodido、gadoscout 的麵包屑與 `BreadcrumbList` 連到 draft 的 `/products/gadosecurity`；金融、政府產業頁與 insurebrick 的麵包屑連到 `/industries`；electriswift 的製造業情境連到 draft 的 `/industries/manufacturing`（family-ai 的子頁卡片連到 `/orient-ai` 的失效連結已由 #106 補上內容檔） | 專案負責人 |
| 金融（13 字）、政府與公部門、產品總覽、ISO27001 日誌存錄、digiLogs 日誌分析的 `<title>` 短於 `seo-checklist` 的 20–32 字；產業頁是新頁，現站沒有可沿用的標題，要不要加 `seoTitle`、寫什麼 | 內容負責人 |

### 各頁

沒有欄位的段落未搬，列出來讓內容負責人決定刪減或擴充 content model。

| 內容檔 | 待確認 |
|---|---|
| digirunner | 現站的 AI Gateway、AI Governance、五大應用、四大機制、API Composer／沙盒／即時主控台、資安、金檢合規段落沒有欄位（M3-05 已記）；`useCases.industry` 沒有保險、醫療、物聯網；`to_confirm`：內文含失效連結 2 筆，因內文未搬而不涉及 |
| digirunner-cloud | 方案價格表兩頁數字不一致：cloud 頁的 Enterprise（High Availability）寫 < 50 million、500GB、pod 1，AWS 頁寫 > 50 million、> 500GB、2~5；兩頁的 High Availability 每 pod 價格都低於 Standalone；cloud 頁有 AWS、GCP、Azure 頁籤，AWS 頁只有 AWS。價格表、部署教學影片、AWS Marketplace 外部連結未搬；FAQ「digiRunner 在哪些區域或網站？」去掉指向 Marketplace 的「現在點擊安裝，免費試用 30 天」；en 版買家指南 PDF 待 M7 |
| digilogs | 「業界唯一主動識別科技」照抄現站；治理困境、鏈路追蹤、多樣態偵測機制（Agent-based 等）、視覺化報表、ISO 27001 段落、導入顧問流程未搬 |
| digilogs-iso27001 | 影片 1 支未搬；現站 description 錯字「修福」已改「修復」 |
| digilogs-detection | 現站只有日誌管理問卷的入口（問卷的處理見 `audience-and-goals.md` 問題 4，M6），內容很少；`to_confirm`：不在導覽，是否仍銷售 |
| digimars | 試用下載表單（M6）、MongoDB 介紹、六大服務流程、分析設計到技術支援的服務清單未搬 |
| digiflexis | 流程架構、數位轉型等三項效益、適用領域清單未搬；修正現站錯字「APl」與半形逗號 |
| digicare | 「昕力堅實的服務實力」4 項提到醫院名稱（台中榮總、成大醫院、萬芳醫院）與合作單位（社團法人台北醫療聯盟協會、國立空中大學），授權與揭露待確認，未搬；FHIR 資料平台等 3 個頁籤未搬；醫療不是產業 hub，`useCases` 沒有 `industry` |
| systalk-chat | `kind`：產品頁是 product，併入的 `/genai-solution` 是 service（`content-model.md`「待確認」）；NLU 演算法步驟、八大導入流程、大腦健檢五大指標未搬；現站延伸閱讀的 5 篇 blog 都在 2026 年以前，未遷移；「電話機器人」情境列了政府機關，`industry` 填 government；description 錯字「對化」已改「對話」 |
| systalk-viki | 產品架構、產品服務內容（年授權、導入服務項目）、`vikibundle` 的 AI 一體機三級方案（硬體規格）與 Google 表單申請連結、HR／MIS 助理細項未搬 |
| systalk-coach | 「縮短 70% 新人養成週期」等數字、核心架構五步驟、四個維度的人才資產未搬 |
| systalk-audit | 「智能評分邏輯」內文後半與「全天候 24/7 自動分析」相同，疑似現站誤植（照抄）；「TCO 低於業界 40%」等數字與影片 3 支未搬；`quality-analysis` 與 `quiz` 是 Health Check 問卷（M6），meta description 寫「1% 抽樣」、頁面寫「2%」；問卷提到的《2026 客服質檢產業升級白皮書》是否要建 `whitepaper` |
| systalk-icr | Lite／Standard／Pro 方案比較、AI 智慧建檔與智能理賠兩個解決方案（M5-02 的 smartfilling、smartclaim）未搬；開戶與貸款文件的情境 `industry` 填 finance |
| systalk-rpa | Center、Studio、Agent 的細項、雲端方案部署於 GCP、SysTalk.RPA + AI 模組、六大導入步驟、導入諮詢表單未搬；`enterp-diagnosis` 是 RPA 適性分析問卷（M6） |
| gadodido | `/products/gadoDIDO` 與 `/products/gadodido` 內容相同；「FIDO Alliance Member」「通過 FIDO 認證」的有效期；FIDO2 驗證流程、四項效益（含「優於業界」）、安全交易流程、影片未搬；修正半形逗號 |
| gadoscout | 現站 `<title>` 寫「入侵預防系統」，導覽與 `nodes.csv` 寫「AI 異常偵測系統」；「彈性擴展」的內文講安全事件分析，和標題不符（照抄）；SRE 效能 3 項、影片 2 支未搬 |
| insurebrick | `to_confirm`：不在導覽，是否仍銷售；現站 description 講市場不講產品，改從頁面介紹取句；「業界唯一微服務設計的基礎架構」「28 個模組」、6 種導入領域未搬 |
| greenswift | 「通過國際查證機構核發 AUP 認證」的機構與效期（ESGswift 頁寫 ARES）；FAQ 有未來式的說法，可能已過時：「未來我們也會推出係數管理中心」「多場所報告書功能正在開發中」「未來還將整合 ISO 14067 和 ISO 14068」；方案表、六大盤查步驟、儀表板說明未搬；`/carbon` 的 `<title>` 與 description 是 vikibundle 頁的（現站錯誤），經濟型方案價格（每支產品 15 萬）、第三方查證機構名稱（愛法諾、亞瑞士）、5 題 FAQ、短網址申請連結未搬；修正半形句點 |
| electriswift | MODEL、CONVERGE 等五步驟、平均節電與電費節省的數字、能源管理法說明未搬；工業廠房情境 `industry` 填 manufacturing（製造業 hub 目前是 draft） |
| family-ai | 主頁的「已為全球超過 1.4億用戶」、一日應用情境、SysTalk.Service 導入前中後未搬；`highlights` 取自併入的 `systalk-ai-phison`，但該頁以 AISO 為名、介紹與群聯電子 aiDAPTIV+ 合作的 AI 一體機（2025 AI AWARD、回應快 25 倍、70B–200B 模型），曾考慮移到 `aiso` 節點，使用者在 #106（PR #110）決定維持在 family-ai；該頁 FAQ 4 題、方案表、影片 2 支未搬 |
| family-dx | IDC 報告下載（表單，M6）、整合綜效 4 項、服務能力 5 項未搬；`highlights` 只放「DigiLism 為何與眾不同？」6 項 |
| family-esg | ESG 國際認證標準清單、「降低 30% 人力成本」「平均節能 15%」等數字、ESG 顧問段落（`esg-advisory` 節點）未搬 |
| family-security | 新頁，介紹文字需人工提供；提供前是 draft |
| industry-finance | 承接 `/products/open-banking`，台灣開放銀行三階段的時程（2019–2021）可能過時；「專利的服務不中斷熱部署」「對接效率提升高達 50%」照抄；`to_confirm`：現站 title 拼錯「Bankning」；開放銀行說明、傳統與開放銀行比較、授權流程圖未搬；產業頁其餘介紹需人工提供 |
| industry-government | 承接 `/products/open-government`；「臺北市政府 API 平臺（昕力資訊建置）」等專案與客戶名稱、智慧政府 2.0 說明、API 規格清單未搬；`to_confirm`：現站 title 寫「開放銀行 Open Government」；產業頁其餘介紹需人工提供 |
| products | 現站 meta description 是舊的產品分組，改從四個家族頁籤寫；各產品的一句介紹沒有欄位，總覽卡片用各 `offering` 的 `description` |

## vi（M7-03）

M7-03（#40）補上產品頁與 hub 的 vi 內容檔，寫法同上，差別如下：

- 現站 vi（`www.tpisoftware.vn`）有對應頁的照抄 vi 頁的文字，`sourceUrl` 寫 vi 頁網址，`offering-content.mjs` 一起對照。vi 頁沒有 zh-TW 的項目時不補譯；vi 頁的事實和 zh-TW 不同時照 vi 頁寫，列在下方待確認
- 現站沒有 vi 頁的從 zh-TW 內容檔翻譯，`sourceUrl` 沿用 zh-TW 的值，登記在 `offering-content.mjs` 的 `TRANSLATED`（不對照現站），檔頭註解寫明是翻譯：offering 的 digicare、digilogs-detection、systalk-viki、systalk-coach、systalk-audit、systalk-icr，hub 的 family-ai、family-esg。翻譯用到、詞彙表沒有的專有名詞列在 [`glossary.md`「vi 待確認」](../i18n/glossary.md#vi-待確認)
- `title`：照抄現站 vi 的頁面取 vi 頁的標題，翻譯的頁面照 zh-TW 的結構寫「產品名＋vi 描述」；兩種都要含詞彙表 `confirmed` 的產品名寫法。選單與麵包屑的名稱另外讀詞彙表。`<title>` 超過 70 字時加 `seoTitle`
- family-security、industry-manufacturing 在 zh-TW 是 draft，不做 vi
- digirunner-cloud 的下載檔照 vi 頁連到英文版買家指南（`offering-files.yaml`）

### vi 待確認

| 內容檔 | 待確認 |
|---|---|
| 翻譯的 8 頁 | 越南文審稿；systalk-audit、systalk-viki、family-ai 的 description 為了字數刪了 zh-TW 的部分說法 |
| systalk-chat | vi 寫 Google BERT＋SysTalk 演算法（zh：大語言模型、地端部署）；vi 的 VIKI 項目是 FAQ 腦；「節省 60% 訓練成本」（zh：減少 60% 訓練團隊人力） |
| systalk-rpa | vi 才有「giảm gần 60% công việc、tiết kiệm 80% thời gian」；架構三項沒有 Center、Studio、Agent 的名稱 |
| insurebrick | vi 沒有 zh 的 7 項功能，改放 vi 自己的 8 項，含 vi 才有的「28 mô-đun」「新產品上市時間減少 90%」；title 的「môdun」改成「mô-đun」 |
| greenswift | FAQ：vi 寫「計畫取得 ISO 14067、14068 認證」，zh 寫「未來將整合」；Q6 是不同的問題；CBAM 沒提申報清冊 |
| digirunner-cloud | Q8「trên 99.9%」（zh 99.9%）、Q10 多了「30 ngày đầu tiên」、Q3 的快取說法不同；vi 沒有 zh 的 5 項功能與 tagline，改用 vi 頁的 4 項與「Tích Hợp Liền Mạch Trong 20 Phút」 |
| digirunner | 產業頁籤的 vi 標題拆成兩行，body 是第二行（讀起來接續標題）；vi 頁 hero 寫的是 DigiLism 的 7 項專利與 ISO 27001，疑似現站誤植，未搬 |
| digilogs | vi「ĐỘC QUYỀN」（zh「業界唯一」）、「hơn 10.000 EPS」（zh 10,000） |
| digilogs-iso27001 | tagline「Tuân thủ nguyên tắc Solid」與 zh「合規優先 決策必備」意思不同 |
| digimars | vi 沒有 LDAP 那一項；段落標題寫 5 項，底下列 6 項 |
| electriswift | zh「定期自動更新台電電價表」，vi「依各國定期更新的電價」 |
| gadoscout | vi 把「異常流量偵測」「智能告警」放在同一標題下，合成一項（10 項，zh 11 項）；vi 頁的 `<title>` 與 meta 是中文 |
| family-dx | 「100% SLA」的標題不同；API 管理模組內文較短 |
| industry-finance | vi 把顧問團隊寫成 digiRunner 的（zh：昕力資訊）；現站原文有「digiRunner;」「lớp truyền tải ngày」等誤植，照抄 |
| industry-government | 第 4 階段 vi 寫 ngoại tuyến（離線），zh 是線上自助申請；標題沒有「100% 合規」 |
| products | vi 頁沒有 tagline；meta 是 zh-TW 的舊文案，description 改用四個產品家族的分頁名稱 |
