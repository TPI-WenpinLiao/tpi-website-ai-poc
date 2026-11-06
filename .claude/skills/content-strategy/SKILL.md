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

### 引用事實的寫法

messaging 與 brief 引用事實一律寫成 `` `fact:<id>` ``（對應 TS 資料檔的 `fact('<id>')`），跟路徑、節點 id 等反引號字串分開。`node scripts/strategy/facts.mjs`（在 `npm run check` 裡）檢查 `docs/strategy/messaging.md` 與 `docs/strategy/briefs/*.md` 的每個引用：事實要存在、是 zh-TW、`status: confirmed`。`to_confirm` 的事實只能寫在標題含「缺少證據」或「待確認」的段落（含其子段落），寫在其他地方就失敗。

## 照原文引用事實

事實照 `facts.yaml` 的 `text` 引用（`CLAUDE.md`「內容規則」）。現站原文常帶 FAQ 的應答、「我們」開頭的句子、錯字，或是從句子中間截出的片段，照下表處理（#214）。`text` 怎麼從 `source.quote` 產生見 `site-research` skill 第 2 條；表中的裁切位置、錯字與截斷由 `node scripts/strategy/facts.mjs` 檢查。

| 原文的狀況 | 怎麼處理 | 不能做的 |
|---|---|---|
| 開頭是應答或語氣詞（「是的，」「不會。」「你可以」） | 在 `facts-source.yaml` 的 `text` 裁掉，裁在標點處 | 刪句子中間的字、把「你」換成「您」 |
| 結尾是空話子句（「為您提供全方位的環境影響洞察」） | `text` 裁到前一個標點 | 改寫成更具體的說法 |
| 句中的「我們」（「我們將得到年度總排放量」） | 照引。同一段有別則事實撐得住同一個主張時，改用那一則 | 換成「昕力」 |
| 錯字 | 只修 `facts.mjs` 錯字表 `TYPOS` 列的字（「佈署」改「部署」、「混和」改「混合」）。要修新的字，先把它加進表，在 PR 寫理由 | 修表外的字、調換詞序（「地雲混合」不改成「雲地混合」） |
| 多餘的空格、缺標點 | `text` 刪空格或補標點（「新舊兼容 弭平」改「新舊兼容，弭平」） | 加字 |
| 截斷：從原句中間截出，或現站原文本身就是半句（新聞內文的片段） | `facts-source.yaml` 標 `partial: true`，`note` 寫缺了什麼。頁面只把它放在標籤、介面片段的列、規格表的格，或放進表述句當引語 | 單獨成一則清單項目（`items`）、當 hero 證據點（`heroPoints`） |

`messaging.md`「語氣」管表述。事實照 `text` 引用時不套語氣規則，評審也不因原文的語氣扣分；裁掉開頭結尾後仍讀不通的原文就不用。事實在畫面上要不要標成引文、標出處，由 `design-principles.md` P2 決定（#213），不在文案裡加引號或「現站寫道」。

## 全頁的寫法

brief 與頁面文案都適用，brief 不在個別段落重述：

- 說明句（hero 的 `heroLead`、每段 h2 下的 `body`）寫讀者得到什麼，不描述頁面怎麼排。「以下照原文列出」「條件寫在下面」是製作備註，不是文案。照原文列清單的段落也一樣：清單是事實原文，說明句是表述，C2 評的是說明句（#202 的 DigiLism 第一次評審看不出這條管不管全頁）
- 表述裡的範圍詞（產業、對象、部署方式、產品類別）要出現在同一段引用的事實裡，見「2. Content brief」

## 1. Messaging framework

`messaging.md` 依序寫：

1. **定位**：一句話寫出做什麼、為誰做、跟競品哪裡不同。下面列依據：事實 id、`competitors.md` 的哪一項觀察
2. **價值主張**：每個主要受眾一組。每個主張至少 2 個證據點，證據點是事實 id，不是形容詞。證據點的原文要直接支撐主張的關鍵詞：主張寫「AI 用在核心作業」，原文就要提到 AI（#168：`DM-2` 收了原文沒提到 AI 的阻詐平台，首頁因此把它放在 AI 段底下）
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
| 段落結構 | 每段一列：目的、要放的事實 id、預估長度、對應的意圖或子題、影像（設計概念階段填：這段放什麼圖，產品頁的介面片段畫哪個接點） | 兩者 |
| CTA | 主要與次要 CTA、各放在哪一段、連到哪裡。按鈕名稱照 messaging「統一用詞」：offering 頁寫內容檔 `cta` 的值（`demo` 或 `contact`），不另取名稱 | `content-strategist` |
| 內部連結 | 連出與連入的頁面、錨點文字，路徑取 `nodes.csv` | `seo-strategist` |
| title 與 description 方向 | 要涵蓋的詞與要傳達的主張；字數規則照 `seo-checklist` | `seo-strategist` |
| schema 缺口 | 現有欄位放不下的段落，列出要新增的欄位與型別 | `content-strategist` |
| 取捨 | 兩個角色意見不同的地方（例如 SEO 要的子題與 messaging 不合）：雙方理由、最後怎麼決定、為什麼 | 兩者 |

每段都要能回答「這段為什麼在這裡」：指到一個受眾任務、一個搜尋子題，或一個 messaging 主張。指不到的段落刪掉。

h2 與說明句是表述，但其中的範圍詞（產業、對象、部署方式、產品類別）要出現在同一段引用的事實裡。段落表的「目的」寫了範圍詞，同一列的事實 id 就要撐得住它：#201 的 AISO、OrientAI 說明句寫「金融與政府」，同段原文只有「醫療、金融、製造業」，評審扣 C3。撐不住就改成事實寫到的範圍，或刪掉範圍詞。別頁的 `description` 是表述，不能借來當產品描述；產品描述照 messaging「一句話的產品描述算事實」引用事實，沒有事實就只寫節點名（#202 的 digiLogs 列）。

段落要放的事實，要符合 messaging 對那則事實的限制。例如 messaging 規定寫「免費」要連同試用條件，brief 就不能只把「30 天免費試用」列為 hero 證據點（#168 的 digiRunner 頁）。

## 3. 頁面文案（製作階段）

- 文案分兩種：
  - 事實（數字、客戶名、認證、獎項、功能、成果）：只能引用事實庫，寫法照 `CLAUDE.md`「內容規則」：TS 資料檔用 `fact('<id>')`，內容檔在 frontmatter 寫 `facts: [<id>]`（沒有事實也寫 `[]`，見 `content-migration`「搬移與改寫」）。`node scripts/strategy/facts.mjs` 擋下沒有引用事實的數字與客戶名稱
  - 表述（標題、價值主張、段落敘事、CTA）：可以原創，依 messaging 與 `writing-style` 寫
- 每段文案對應到 brief 的一段；brief 沒有的段落不寫
- 製作時改了段落（合併、刪減、換順序），就改寫 brief 的段落表，CTA、內部連結表一起改，不在 brief 開頭另加一段「製作階段的版本」。#167 這樣加，段落表、CTA 表、連出表還是舊的 8 段，評審不知道要對照哪一版（#168）
- 說明句與範圍詞照「全頁的寫法」；事實原文的語氣、錯字與截斷照「照原文引用事實」
- 先寫 zh-TW；en、vi 照 `content-migration` 的「多語系內容」另做，不在同一步

## 不做的事

- 不新增事實：事實庫沒有的，列為缺少證據，不寫進文案
- 不決定視覺與版面：brief 寫段落的目的與內容，不寫版型、顏色、元件
- 不做技術 SEO（canonical、hreflang、JSON-LD 的實作），那些照 `seo-checklist`
