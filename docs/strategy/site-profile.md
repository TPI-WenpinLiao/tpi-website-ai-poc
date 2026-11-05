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

## 後續批次

試點頁以外分批重做，做法見 `docs/workflow.md`「分階段流程」的「後續批次」。各 skill 寫給「試點頁面」的規則（未搬內容、搜尋意圖、brief、評審）也套用在批次的頁面，但只在這批自己的 issue 裡：研究與策略 issue 為這批頁面補研究、寫 brief，製作 issue 轉 ready 前評這批頁面的三份 rubric。其他 issue 要評的頁面（`site-review` 的評審對象，以及 `issue-ship` 第 8 步改到共用元件時的 D2 重評）仍然只有上面的試點頁面。只做 zh-TW。

### 第一批（#188）

挑 `messaging.md` 或 `search-intent.md`「對應到頁面」已點名的頁。研究與 brief 是 #199，製作是 #200–#202。

| 頁面 | 路徑 | 模板 | 製作 |
|---|---|---|---|
| AI 智能理賠解決方案 | `/solutions/smartclaim` | offering | #200 |
| AI 智慧建檔解決方案 | `/solutions/smartfilling` | offering | #200 |
| AI（SysTalk.ai）產品家族 | `/products/systalk-ai` | hub | #200 |
| OrientAI | `/orient-ai` | offering | #201 |
| AISO 主權 AI | `/aiso` | offering | #201 |
| GreenSwift | `/products/greenswift` | offering | #202 |
| 數位轉型（DigiLism）產品家族 | `/products/digilism` | hub | #202 |

## 限制

- 不上線、不可被搜尋引擎收錄（`CLAUDE.md`「專案目標」）
- 沒有 GA4、Search Console 的權限，搜尋相關的研究不寫搜尋量與流量（`docs/research/seo-baseline.md`）
- 公司沒有 VI 手冊，品牌素材只有 logo（`docs/design/brand-assets.md`）
