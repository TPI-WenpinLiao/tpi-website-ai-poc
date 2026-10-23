# 現站內容稽核（M1-02）

- 對象：M1-01 盤點的 [`inventory.csv`](./inventory.csv) 全部 1,306 列（#2）
- 交付物：
  - `inventory.csv` 新增三欄：`disposition`（keep／rewrite／merge／drop）、`disposition_reason`、`to_confirm`
  - [`audit-overrides.csv`](./audit-overrides.csv)：規則無法判斷、需逐頁處理的人工覆寫
  - [`audit-summary.json`](./audit-summary.json)：統計與語系對應缺口
- 稽核日期：2026-10-20
- 原則：只判斷「要不要遷移、怎麼遷移」。疑似過時或矛盾的事實列在 `to_confirm`，不自行判定真偽（見 `.claude/skills/content-migration/SKILL.md`）

## 重現方式

```bash
node scripts/inventory/audit.mjs
```

- 讀 `inventory.csv` 的 crawl 欄位，套用規則與 `audit-overrides.csv`，再把三個稽核欄位寫回 `inventory.csv`（crawl 的 16 欄不變）
- `crawl.mjs` 重爬會整檔覆寫 `inventory.csv`，重爬後須再執行本 script
- 結果固定：同一份輸入重跑，輸出逐位元組相同
- 每列都必須有合法的處置與理由，覆寫檔的 URL 必須存在於 inventory，否則 script 以 exit 1 結束

## 處置定義

| 值 | 意義 |
|---|---|
| `keep` | 內容原文保留，只轉換格式與版面（blog 文章、新聞、人物頁、下載資產） |
| `rewrite` | 保留事實，依新 IA 與內容模型重寫結構；功能頁由 M6 重做 |
| `merge` | 內容併入另一頁，理由中註明合併目標；新站對原 URL 做 301 |
| `drop` | 不遷移 |

## 統計

### 處置 × 語系

| | zh-TW | en | vi | ja | 合計 |
|---|--:|--:|--:|--:|--:|
| keep | 178 | 123 | 348 | 0 | 649 |
| rewrite | 64 | 51 | 49 | 0 | 164 |
| merge | 36 | 24 | 20 | 0 | 80 |
| drop | 257 | 126 | 28 | 2 | 413 |
| **合計** | **535** | **324** | **445** | **2** | **1,306** |

遷移量（keep + rewrite）：zh-TW 242、en 174、vi 397。zh-TW 實際需要重寫的是 64 頁；en／vi 的翻譯在 M7。

本節數字已反映 M2-01（#8）的決策：landing page、`/carbon`、開放銀行、開放政府、`/genai-solution` 改為 merge（見 [`docs/ia/sitemap.md`](../ia/sitemap.md)「決策紀錄」）。

### 處置 × 頁面類型

| page_type | keep | rewrite | merge | drop |
|---|--:|--:|--:|--:|
| news | 150 | 0 | 0 | 381 |
| blog-post | 467 | 0 | 2 | 0 |
| product | 0 | 56 | 19 | 0 |
| blog-category | 3 | 0 | 52 | 0 |
| service | 25 | 16 | 5 | 3 |
| newsletter | 0 | 0 | 0 | 25 |
| solution | 0 | 21 | 0 | 0 |
| utility | 0 | 15 | 0 | 0 |
| download | 0 | 15 | 0 | 0 |
| pdf | 2 | 8 | 1 | 0 |
| about | 0 | 6 | 0 | 1 |
| home | 0 | 3 | 0 | 1 |
| campaign | 0 | 0 | 1 | 2 |
| blog-index、contact、events、news-index、product-index、resource、search、case-study | 0 | 各 3 | 0 | 0 |
| subsite | 2 | 0 | 0 | 0 |

`to_confirm` 非空：204 列。

## 規則

| 對象 | 處置 | 說明 |
|---|---|---|
| HTTP 500（`/ja`、`/ja/partners`、`*/outsourcing/dropdown`） | drop | 現站錯誤頁，無內容 |
| 大小寫不同的重複路由（`/products/gadoDIDO`、`/orient-aI` 等 5 列） | merge | 依 `final_url` 判斷；正規版本取導覽有連到的一個，否則取小寫路由。正規版本不遷移時跟著 drop（vi blog `AI-viet-van-ban`，M5-05） |
| .vn 上與 .com 同名的 PDF | merge | 同一份 AWS Marketplace 買家指南 |
| 首頁、產品、服務、解決方案、關於、聯絡、列表頁 | rewrite | 依新 IA 重寫結構 |
| 不在導覽的產品／方案頁 | rewrite + 待確認 | 可能已停售 |
| 產品路由下的行銷 landing page（`systalk-ai-phison`、`vikibundle`、`quality-analysis`、`enterp-diagnosis`、`awsmarketplace`） | merge | 沒有投放廣告，併入所屬產品頁（M2-01 決定）；兩個問卷頁的問卷功能待 M6 |
| `/esg-advisory/<顧問>` | keep + 待確認 | 人物頁，確認合作狀態與照片授權 |
| 訂閱、退訂、感謝、搜尋、下載中繼頁、白皮書表單 | rewrite | M6 功能重做 |
| 隱私權、使用條款、免責聲明、資安政策 PDF | rewrite + 待確認 | 轉 HTML 頁，需法務確認版本 |
| `/tpu`、`/hr` | keep | 獨立應用，只保留入口連結 |
| `epaper/2018–2020` | drop | 已停刊的歷史電子報 |
| `2023tpiday`、`2024tpiday` | drop | 已結束活動 |
| `/carbon` | merge | GreenSwift 推廣頁，併入 GreenSwift 產品頁（M2-01 決定） |
| blog 分類頁 | merge | 併入 M2 定案的新 blog 分類 |
| blog 分類路由但 h1 為單篇文章（3 列） | keep + 待確認 | page_type 誤判；不在 blog API 清單 |
| blog 文章（2026-01-01 起） | keep | 57 篇；同標題重複的較舊一篇 merge 至較新一篇。保留門檻 M5-05（#30）由使用者決定 |
| blog 文章（2026-01-01 前） | drop | 412 篇 |
| 新聞（2026-01-01 起） | keep | 28 篇（zh-TW 10、en 9、vi 9）。M1-02 的門檻是 2024-01-01，M5-05（#30）由使用者改為 2026-01-01 |
| 新聞（2026-01-01 前） | drop | 503 篇，含 `updateDate` 在 2026 年、發布日在 2025 年的 14 篇（`audit-overrides.csv`） |
| 新聞內文檔不存在（`/media-center/269`、`279`） | drop | 頁面只有標題 |
| 不在新聞 API 的 8 篇 zh-TW 新聞（`/media-center/151` 等） | drop + 待確認 | 無日期、內容為英文 |

跨規則的自動標記（只加 `to_confirm`，不影響處置）：

- 要遷移的頁面（非 drop）內文含失效連結：48 列，遷移時修正或移除
- en／vi 頁面的 title 或 h1 含中文：9 列，疑似未翻譯
- 首頁 notes 有轉址來源（舊 `/solutions/*` 已轉到首頁）：3 列

## 需人工決定的項目

### M2 資訊架構要決定

以下 5 項已在 M2-01（#8）決定，結果見 [`docs/ia/sitemap.md`](../ia/sitemap.md)「決策紀錄」。

1. **日文版**：現站 `/ja`、`/ja/partners` 回 500，新站是否支援（已列入 `docs/status.md`）
2. **不在導覽的產品／方案是否仍銷售**（33 列）：zh-TW 的 `/products/insurebrick`、`/products/open-banking`、`/products/open-government`、`/products/digilogs/log-detection`、`/solutions/gis`、`/solutions/insurering`、`/solutions/interactivehealth`、`/solutions/textualanalysis`；en、vi 另有部分 zh-TW 在導覽、但該語系不在導覽的頁面
3. **主題重疊的頁面是否合併**：
   - `/genai-solution`（SysTalk.Chat 導入服務）與 `/products/systalk-chat`
   - `/products/open-banking`、`/products/open-government` 與 digiRunner 產品頁
   - `/products/esgswift` 與 GreenSwift、ElectriSwift 的產品關係
   - `/carbon` 與 `/products/greenswift`
4. **舊 `/solutions/*` 路由**：現站已將 `/solutions/bnpl`、`devops`、`ibmb`、`smartbuilding`、`smartpushnotifications` 轉址到首頁，新站是否需要對應頁面
5. **blog 分類**：現站三語分類各自命名（zh-TW `ai／dx／smartm…`、en `artifintell／dt／smartmgmt…`、vi `digital-transformation…`），新分類由 M2 定案後，52 個分類頁的 merge 目標才確定

### 內容負責人要確認

1. ~~**行銷 landing page 是否仍在投放**~~（10 列，M2-01 已決定併入產品頁）：`systalk-ai-phison`、`systalk-viki/vikibundle`、`systalk-audit/quality-analysis`（含 `/quiz`）、`systalk-rpa/enterp-diagnosis`、`digirunner/awsmarketplace`
2. **ESG 顧問**（25 列）：是否仍合作、經歷是否正確、照片授權。三語名單不一致：zh-TW 沒有 `huang-zhijun`；vi 清單連到拼錯的 `/esg-advisory/li-shuhi`（500），所以缺 `li-shuhui`
3. **法務文件**（8 列）：隱私權、使用條款、免責聲明（zh-TW／en／vi）與資訊安全政策的有效版本；轉為 HTML 是否需法務審閱
4. **成功案例**：三語 `/success-story` 內容區字數都很少（49–95），案例可能是 client 端渲染；遷移前要開頁確認案例清單與客戶名稱授權
5. **zh-TW `/partners`**：內容區幾乎為空（字數 1、無 h1），en／vi 有內容
6. **title 錯誤**：`/products/open-government` 的 title 寫「開放銀行 Open Government」；`/products/open-banking` 拼成「Open Bankning」；en／vi 兩頁共用通用 title「TPIsoftware | API Management Platform」
7. **疑似未翻譯**（9 列）：`/en/aiso`、`/en/products/gadoscout`、`/en/resource`、`/en/thanks`、vi `/aiso`、`/products/digilogs/log-detection`、`/products/gadoscout`、`/products/systalk-viki`、`/thanks`
8. **疑似未發布的 blog 文章**（3 列）：`/blog/ai/what-is-ai-agent-management-platform`、`/en/blog/artifintell/why-ai-needs-knowledge-boundary`、vi `/blog/enterprise-management/gemini-api`（vi 另有 `gemini-api-key` 一篇已發布）
9. **重複內容**：en blog `financial-examination`（2021）與 `financial-examination-en`（2023）同標題；en 新聞 `/en/media-center/455`、`456`（2024-05）與 `441`、`432`（2023）同標題，疑似重複發布
10. **2022 年前的 blog 文章**：M5-05 起 2026 年前的 blog 不遷移，不再需要確認
11. **新聞日期**：保留門檻依 API 的 `updateDate` 判斷，不是發布日（見「已知限制」）。M5-05 用發布日比對，`updateDate` 在 2026 年但發布日在 2025 年的 14 篇已在 `audit-overrides.csv` 改為 drop
12. **vi blog 數量**：vi 有 298 篇，其中 258 篇集中在 2025 年，遠多於 zh-TW（105）與 en（66）。全部列為 keep；是否有內容品質或 SEO 策略上的考量，需 vi 團隊確認

## 失效連結

`broken-links.csv` 的 59 個失效 URL 分布在多個頁面，其中 48 個要遷移的頁面受影響（主要是 2024 年後的新聞與 vi blog）。依類型處理建議：

| 類型 | 例子 | 建議 |
|---|---|---|
| 舊站 `.html`／`.aspx`／`.doc` 路徑 | `/xamarin.html`、`/news/media-20190710.html`、`/doc/xamarin_basic_*.doc` | 連結所在頁面全部為 drop，不需處理 |
| 已不存在的 blog 文章路徑 | digiRunner 產品頁連到 `/blog/smartm/apim_openbanking`、`/blog/smartm/apim/oidc-api`；en 產品頁連到 `/en/blog/smartmgmt/apimgmt/oidc-apim` 等 | 重寫產品頁時改連到現存文章或移除 |
| 拼錯的 vn 路徑 | `/digilgos-logs-management`、`/products/electriwift`、`/esg-advisory/li-shuhi` | 遷移時改為正確路由 |
| 已下架的 vi blog 文章（500） | `/blog/digital-transformation/esg`、`/blog/enterprise-management/devops` | 確認文章是否刪除；連結改到相關文章或移除 |
| 被誤植為 URL 的文字 | vi blog 中一段越南文說明被當成 href | 改為正確連結或純文字 |
| 不存在的短路徑 | `/c/l`、`/c/opt`、`/c/s` 等（出現在保留的電子報型新聞） | 確認原意；無法確認則移除 |
| 不存在的產品頁 | `/en/products/systalk-icr`、vi `/products/systalk-icr` | en／vi 沒有 SysTalk.ICR 頁，見下節 |

## 語系對應缺口（給 M7）

zh-TW、en、vi 之間缺頁的內容路由（不含 merge 掉的重複路由，完整清單見 `audit-summary.json` 的 `localeGaps`）：

| 缺 en 與 vi | 只缺 vi | 只缺 en | 只缺 zh-TW |
|---|---|---|---|
| `/chatgpt-enterprise`、`/products/digicare`、`/products/systalk-audit`、`/products/systalk-icr` | `/products/esgswift`、`/products/systalk-ai`、`/products/systalk-coach`、`/esg-advisory/li-shuhui` | `/products/digilogs/log-detection` | `/esg-advisory/huang-zhijun` |

新站是否三語對齊由 M2／M7 決定，本次不處理。

## 給 M2 的輸入

- merge + drop 共 493 列（含 M2-01 改為 merge 的頁面）。其中 merge 的 80 列需要 301 到合併目標；drop 的頁面是否 301 到上層列表頁或回 410，由 M2 的轉址策略決定
- notes 的 `redirected from` 共記錄 98 個轉址來源（含 `www.tpisoftware.com/vn/*` 到 `www.tpisoftware.vn/*` 的鏡像），新站上線時一併納入轉址表
- `page_type` 修正：3 個分類路由實為單篇文章（見上）；`/carbon` 標為 campaign，實為產品推廣頁

## 已知限制

- 規則依 M1-01 的 crawl 欄位推定，沒有逐頁閱讀內文；事實正確性（數據、客戶、獎項、認證）沒有驗證，M5 遷移時逐頁確認
- 新聞與 blog 的時效只看 `last_updated`，沒有分析內文。新聞的 `last_updated` 是 API 的 `updateDate`（更新日，不是發布日），因此少數舊內容會因為後來被編輯而落在保留範圍，例如 `/media-center/451`「12月科技生活報」談 2024 巴黎奧運，日期卻是 2025-02-13。M5 遷移新聞時需人工確認實際發布日
- blog 分類頁無法從 URL 判斷底下有沒有文章（文章 URL 只帶主分類），因此沒有以「空分類」為由 drop
