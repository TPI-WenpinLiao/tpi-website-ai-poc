# 本站設定（site profile）

分階段流程（`docs/workflow.md`「分階段流程」）的 agent 與 skill 只讀本檔取得本站專屬的值，自己不寫死公司名稱、網址或頁面路徑。換一個網站套用這套流程時，只替換本檔。

## 公司

| 欄位 | 值 |
|---|---|
| 公司名稱 | 昕力資訊（TPIsoftware） |
| 結構化資料 | `src/content/organization/<locale>.yaml`（名稱、據點、聯絡方式以這裡為準） |

## 現站

| 語系 | 網址 | 說明 |
|---|---|---|
| zh-TW | https://www.tpisoftware.com | 事實擷取的主要來源 |
| en | https://www.tpisoftware.com/en | |
| vi | https://www.tpisoftware.vn | 新站改為 `/vi`（ADR 0002） |

現站的頁面清單與處置看 `docs/research/inventory.csv`，舊網址在新站的位置看 `docs/ia/page-map.csv`。

## 受眾與轉換

受眾分群、主要任務與轉換目標以 [`docs/research/audience-and-goals.md`](../research/audience-and-goals.md) 為準，本檔只列摘要：

- 主要受眾：金融、政府與公部門、製造業的決策者（CIO、CTO、高階主管）與 IT 主管
- 主要轉換：聯絡業務；次要：預約 demo、試用與詢價

## 語系

zh-TW 優先。分階段流程的產出物（事實庫、messaging、brief、文案）先做 zh-TW，en、vi 列為後續事項。

## 試點頁面

分階段流程先套用在這三頁，評審（`site-review`）也以這三頁為對象：

| 頁面 | 路徑 | 模板 |
|---|---|---|
| 首頁 | `/` | home |
| digiRunner 產品頁 | `/products/digirunner` | offering |
| 金融產業頁 | `/industries/finance` | hub |

## 限制

- 不上線、不可被搜尋引擎收錄（`CLAUDE.md`「專案目標」）
- 沒有 GA4、Search Console 的權限，搜尋相關的研究不寫搜尋量與流量（`docs/research/seo-baseline.md`）
- 公司沒有 VI 手冊，品牌素材只有 logo（`docs/design/brand-assets.md`）
