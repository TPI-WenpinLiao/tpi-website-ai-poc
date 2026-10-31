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
| 事實庫格式與檢查 | `docs/strategy/facts.yaml` 的格式與 `scripts/strategy/facts.mjs`（#163 定義；還沒有時停下，不自己定格式） |

## 產出物

| 產出物 | 位置 | 關卡 |
|---|---|---|
| 事實庫 | `docs/strategy/facts.yaml`，由擷取 script 產生 | `node scripts/strategy/facts.mjs` 通過 |
| 未搬內容盤點 | `docs/strategy/unmigrated.md` | 涵蓋 `site-profile.md` 的每個試點頁面 |
| 競品分析 | `docs/strategy/competitors.md`，截圖放 `docs/strategy/competitors/` | 每項觀察附來源網址 |
| 搜尋意圖 | `docs/strategy/search-intent.md` | 每組查詢附觀察日期與來源 |

## 1. 事實庫

事實是可以查證的陳述：數字、百分比、客戶名、認證、獎項、產品功能、案例成果。標題、口號、形容詞不是事實，不收。

1. 擷取寫成 script（放 `scripts/strategy/`），可以重跑，結果相同（`CLAUDE.md`「工作原則」）。不手改 `facts.yaml`；要修正的寫進 script 讀的覆寫檔
2. 每一筆都要有來源網址與原文（`source.url`、`source.quote`），原文逐字照抄現站
3. `status`：
   - `confirmed`：現站原文明確寫出，且不涉及授權
   - `to_confirm`：授權不明（人物照片、客戶 logo、客戶名稱用於行銷）、可能過時（年份、數字、價格）、或現站各語系說法不一致。理由寫在該筆的備註欄
4. 同一個事實在多頁出現時只收一筆，來源取最完整的一頁
5. 數字只收現站寫出的，不換算、不四捨五入、不合併

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

3. 每家附首頁第一屏截圖（375、1280 寬）與截圖日期
4. 只記錄觀察與來源網址，不複製文案。引用原文時限一句並加引號
5. 最後一節「對本站的意義」：哪些做法本站已有、哪些缺、哪些不適合，供策略與設計概念階段引用。這一節是推論，跟觀察分開寫

## 4. 搜尋意圖

1. 每個試點頁面的主題各列 5–10 組查詢詞，含品牌詞、類別詞、問題型
2. 每組查詢用公開的搜尋結果判斷：
   - 意圖：資訊型、比較型、商業型、導航型
   - 前幾名的頁面類型（產品頁、比較文、教學、列表）
   - 前幾名共同涵蓋的子題
3. 寫明觀察日期與搜尋地區、語系
4. 沒有 Search Console 等數據時，不寫搜尋量、不估流量，文件開頭寫明這個限制
5. 最後一節對應到頁面：每組查詢應該由哪一頁承接，交給 `seo-strategist` 在策略階段確認

## 不做的事

- 不寫文案、不寫價值主張：研究只記錄事實與觀察
- 不改 `src/`：研究的產出都在 `docs/strategy/` 與 `scripts/strategy/`
- 不補現站沒寫的事實，不從競品推測本站的數字
