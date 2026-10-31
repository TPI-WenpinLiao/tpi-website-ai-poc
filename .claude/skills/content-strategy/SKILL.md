---
name: content-strategy
description: 分階段流程的策略與製作階段使用：messaging framework、每頁的 content brief（受眾、搜尋意圖、段落結構、CTA、內部連結），以及依 brief 寫頁面文案。由 content-strategist 與 seo-strategist agent 執行。
---

# Content strategy

分階段流程的策略階段（`docs/workflow.md`「分階段流程」）。把研究階段的事實與觀察，變成「這個網站要說什麼」與「每一頁放什麼」。製作階段的頁面文案也照本 skill。

本站的受眾、試點頁面讀 [`docs/strategy/site-profile.md`](../../../docs/strategy/site-profile.md)，本 skill 不寫死。

## 輸入

| 輸入 | 位置 |
|---|---|
| 本站設定、受眾與轉換 | `docs/strategy/site-profile.md` 與它連到的受眾文件 |
| 事實庫 | `docs/strategy/facts.yaml`（只能引用 `status: confirmed` 的事實） |
| 未搬內容、競品分析、搜尋意圖 | `docs/strategy/unmigrated.md`、`competitors.md`、`search-intent.md` |
| 頁面階層與導覽 | `docs/ia/nodes.csv`、`docs/ia/navigation.csv` |
| 內容欄位 | `docs/ia/content-model.md`、`src/content.config.ts` |

## 產出物

| 產出物 | 位置 | 負責的 agent |
|---|---|---|
| messaging framework | `docs/strategy/messaging.md` | `content-strategist` |
| content brief | `docs/strategy/briefs/<page>.md`，每個試點頁面一份 | `content-strategist` 主筆，`seo-strategist` 寫搜尋與連結的段落 |
| 頁面文案（製作階段） | 照頁面的資料檔或內容檔（`src/data/`、`src/content/`） | `content-strategist` |

策略階段的關卡是人工加上 `strategy-approved`，之後才進設計概念階段。

## 1. Messaging framework

`messaging.md` 依序寫：

1. **定位**：一句話寫出做什麼、為誰做、跟競品哪裡不同。下面列依據：事實 id、`competitors.md` 的哪一項觀察
2. **價值主張**：每個主要受眾一組。每個主張至少 2 個證據點，證據點是事實 id，不是形容詞
3. **證據對照表**：主張 × 事實 id，讓審查者一眼看出哪個主張證據不足
4. **語氣與用詞**：要用與不要用的字，和 `writing-style` 的「網站文案」一致，不另立規則。只補本站特有的用詞（產品名寫法、不要用的行話）

主張找不到 `confirmed` 的事實支撐時，不寫進 messaging，列在文末「缺少證據的主張」，讓人工決定要不要補事實。

## 2. Content brief

每份 brief 從受眾與搜尋意圖推出段落，不是照現有模板填空。依序寫：

| 段落 | 寫什麼 | 誰寫 |
|---|---|---|
| 受眾與任務 | 這頁主要給誰、他來做什麼（引用受眾文件） | `content-strategist` |
| 搜尋意圖 | 這頁承接哪些查詢、意圖類型（連到 `search-intent.md` 的條目） | `seo-strategist` |
| 這頁要讓讀者相信什麼 | 一兩句，引用 messaging 的主張 | `content-strategist` |
| 段落結構 | 每段一列：目的、要放的事實 id、預估長度、對應的意圖或子題 | 兩者 |
| CTA | 主要與次要 CTA、各放在哪一段、連到哪裡 | `content-strategist` |
| 內部連結 | 連出與連入的頁面、錨點文字，路徑取 `nodes.csv` | `seo-strategist` |
| title 與 description 方向 | 要涵蓋的詞與要傳達的主張；字數規則照 `seo-checklist` | `seo-strategist` |
| schema 缺口 | 現有欄位放不下的段落，列出要新增的欄位與型別 | `content-strategist` |
| 取捨 | 兩個角色意見不同的地方（例如 SEO 要的子題與 messaging 不合）：雙方理由、最後怎麼決定、為什麼 | 兩者 |

每段都要能回答「這段為什麼在這裡」：指到一個受眾任務、一個搜尋子題，或一個 messaging 主張。指不到的段落刪掉。

## 3. 頁面文案（製作階段）

- 文案分兩種：
  - 事實（數字、客戶名、認證、獎項、功能、成果）：只能引用事實庫，寫法照 `CLAUDE.md`「內容規則」
  - 表述（標題、價值主張、段落敘事、CTA）：可以原創，依 messaging 與 `writing-style` 寫
- 每段文案對應到 brief 的一段；brief 沒有的段落不寫
- 先寫 zh-TW；en、vi 照 `content-migration` 的「多語系內容」另做，不在同一步

## 不做的事

- 不新增事實：事實庫沒有的，列為缺少證據，不寫進文案
- 不決定視覺與版面：brief 寫段落的目的與內容，不寫版型、顏色、元件
- 不做技術 SEO（canonical、hreflang、JSON-LD 的實作），那些照 `seo-checklist`
