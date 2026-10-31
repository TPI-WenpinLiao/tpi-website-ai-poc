---
name: site-research
description: 分階段流程的研究階段使用：從現站擷取事實到事實庫、盤點現站有而新站沒有的段落、競品分析、搜尋意圖研究。由 researcher agent 執行，產出放在 docs/strategy/。
---

# Site research

分階段流程的第一個階段（`docs/workflow.md`「分階段流程」）。產出後面所有階段的素材：策略只能引用這裡的事實，設計概念引用這裡的競品分析。

本站的公司、現站網址、試點頁面都讀 [`docs/strategy/site-profile.md`](../../../docs/strategy/site-profile.md)，本 skill 不寫死。

## 輸入

| 輸入 | 位置 |
|---|---|
| 本站設定 | `docs/strategy/site-profile.md` |
| 現站頁面清單與處置 | `docs/research/inventory.csv`、`docs/research/content-audit.md` |
| 新站已有的內容 | `src/content/`、`src/data/`；沒搬的段落記在 `docs/content/*.md` 的「待確認」 |
| 受眾與轉換 | `site-profile.md` 連到的受眾文件 |
| 事實庫格式與檢查 | `docs/strategy/facts.yaml` 開頭的欄位說明；schema 在 `src/data/facts.ts`，檢查是 `scripts/strategy/facts.mjs`（#163） |

## 產出物

| 產出物 | 位置 | 關卡 |
|---|---|---|
| 事實庫 | `docs/strategy/facts.yaml` 與候選報告 `docs/strategy/facts-candidates.md`，都由 `scripts/strategy/extract-facts.mjs` 從 `scripts/strategy/facts-source.yaml` 產生 | `node scripts/strategy/facts.mjs` 與 `node scripts/strategy/facts.mjs --sources` 通過 |
| 未搬內容盤點 | `docs/strategy/unmigrated.md` | 涵蓋 `site-profile.md` 的每個試點頁面 |
| 競品分析 | `docs/strategy/competitors.md`，截圖由 `scripts/strategy/competitor-shots.mjs` 存到 `docs/strategy/competitors/` | 每項觀察附來源網址 |
| 搜尋意圖 | `docs/strategy/search-intent.md` | 每組查詢附觀察日期與來源 |

## 1. 事實庫

事實是可以查證的陳述：數字、百分比、客戶名、認證、獎項、產品功能、案例成果。標題、口號、形容詞不是事實，不收。

1. 哪一句是事實要判斷，所以挑選的結果寫在輸入檔 `scripts/strategy/facts-source.yaml`（格式在檔頭），`node scripts/strategy/extract-facts.mjs` 產生 `facts.yaml`，不手改 `facts.yaml`（`CLAUDE.md`「工作原則」）。script 逐筆確認 quote 在來源頁上，有一筆不在就失敗、不寫檔；重跑結果相同。頁面已引用的 id 不能改，`node scripts/strategy/facts.mjs` 會擋下被引用但消失的 id
   - 頁面先由 `scripts/strategy/source-pages.mjs` 抓取並快取到 `.cache/facts`；`--offline` 只讀快取。quote 不在 HTML 時會找頁面載入的 Nuxt chunk（`/success-story` 的案例卡片只在 chunk 裡），`facts.mjs --sources` 用同一套
   - 某個語系的現站連不上時（例如 `www.tpisoftware.vn`），兩支都加 `--locales zh-TW,en`，只驗證這些語系，其他語系照原樣寫出並列為未驗證
   - 漏收靠候選報告 `facts-candidates.md` 檢查：`inventory.csv` 中 zh-TW 的首頁、關於、產品、解決方案、服務、案例頁，每頁列出含數字、認證、獎項、客戶與產業名稱的文字區塊，標出收進哪些 id，或被 `facts-source.yaml` 的 `ignore` 規則略過（附原因）。完成條件是「未收」0 筆。報告只看 4 字以上的文字區塊，不看 `<script>` 裡的資料：一個字一個 tag 的表格（digiRunner v.s. Kong）、首頁 banner（Nuxt payload）要人工補看
2. 每一筆都要有來源網址與原文（`source.url`、`source.quote`），原文逐字照抄現站；`text` 是頁面要顯示的字，可以加 U+200B 斷行點或截掉原文的前後文，數字與名稱不改（`facts.mjs` 擋下 `text` 有、`source.quote` 沒有的數字）。`--sources` 比對原文時忽略空白與 U+200B
3. `status`：
   - `confirmed`：現站原文明確寫出，且不涉及授權
   - `to_confirm`：授權不明（人物照片、客戶 logo、客戶名稱用於行銷）、可能過時（年份、數字、價格）、或現站各語系說法不一致。理由寫在該筆的 `note`（schema 要求）
4. en、vi 的事實是各自的一筆（`locale` 不同，id 加 `-en`、`-vi`），來源取該語系的現站頁面；頁面只能用自己語系的事實
5. 同一個事實在多頁出現時只收一筆，來源取最完整的一頁
6. 數字只收現站寫出的，不換算、不四捨五入、不合併

## 2. 未搬內容盤點

每個試點頁面，對照現站頁面與新站頁面，列出現站有、新站沒有的段落：

| 欄位 | 寫什麼 |
|---|---|
| 新站頁面 | 路徑 |
| 現站來源 | 網址 |
| 段落 | 現站的段落標題或第一句 |
| 事實 id | 這段包含的事實；沒有事實的段落寫「—」 |
| 沒搬的原因 | schema 沒有欄位、遷移時略過等，引用 `docs/content/*.md` 的紀錄 |

只盤點，不判斷要不要放回新站；那是策略階段的事。

## 3. 競品分析

1. 選 3–5 家，與本站同市場、同客群（看 `site-profile.md` 的受眾）。每家寫選擇理由
2. 每家比較同一組面向：

   | 面向 | 看什麼 |
   |---|---|
   | 定位說法 | 首頁第一屏怎麼說自己做什麼、為誰做 |
   | 首頁結構 | 段落順序、每段的目的 |
   | 證據呈現 | 數字、案例、客戶 logo、認證放在哪裡、怎麼呈現 |
   | 轉換路徑 | 主要 CTA、出現幾次、表單長度 |
   | 視覺語言 | 字體、色彩、影像風格、動態 |

3. 每家附首頁第一屏截圖（375、1280 寬）與截圖日期，用 `node scripts/strategy/competitor-shots.mjs [--only <slug>]` 產生；競品網域要先在環境的 Allowed domains 放行（含轉址後的網域，例如 `tw.systex.com`）
4. 只記錄觀察與來源網址，不複製文案。引用原文時限一句並加引號
5. 最後一節「對本站的意義」：哪些做法本站已有、哪些缺、哪些不適合，供策略與設計概念階段引用。這一節是推論，跟觀察分開寫

## 4. 搜尋意圖

1. 每個試點頁面的主題各列 5–10 組查詢詞，含品牌詞、類別詞、問題型
2. 每組查詢用公開的搜尋結果判斷：
   - 意圖：資訊型、比較型、商業型、導航型
   - 前幾名的頁面類型（產品頁、比較文、教學、列表）
   - 前幾名共同涵蓋的子題
3. 寫明觀察日期與搜尋地區、語系。Bing 台灣繁中在雲端 session 回傳與查詢無關的結果（#164 實測，`node scripts/strategy/serp.mjs` 重現），這時改用 WebSearch，但它只有美國地區、沒有名次，要在文件開頭寫明
4. 沒有 Search Console 等數據時，不寫搜尋量、不估流量，文件開頭寫明這個限制
5. 最後一節對應到頁面：每組查詢應該由哪一頁承接，交給 `seo-strategist` 在策略階段確認

## 不做的事

- 不寫文案、不寫價值主張：研究只記錄事實與觀察
- 不改 `src/`：研究的產出都在 `docs/strategy/` 與 `scripts/strategy/`
- 不補現站沒寫的事實，不從競品推測本站的數字
