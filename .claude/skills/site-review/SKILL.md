---
name: site-review
description: 分階段流程的評審階段使用，設計概念階段評三個方向時也用：依設計、文案與行銷、SEO 三份 rubric 為頁面或原型評分，判斷是否達到門檻。由 reviewer agent 執行，只評審不修改。
---

# Site review

評「做出來的東西好不好」，不評工程品質（那是 `npm run check` 與 `/pr-review` 的事）。用在兩個地方（`docs/workflow.md`「分階段流程」）：

- 設計概念階段：為三個方向的原型評分，供人選擇
- 評審階段：為製作完成的頁面評分，低於門檻就退回製作

評審對象的頁面清單讀 [`docs/strategy/site-profile.md`](../../../docs/strategy/site-profile.md)，本 skill 不寫死。

## Rubric

| rubric | 檔案 | 適用 |
|---|---|---|
| 設計 | [`rubrics/design.md`](rubrics/design.md) | 原型與頁面 |
| 文案與行銷 | [`rubrics/copy-marketing.md`](rubrics/copy-marketing.md) | 原型與頁面 |
| SEO | [`rubrics/seo.md`](rubrics/seo.md) | 只評頁面；原型沒有 head 與連結，不評 |

每個項目 1–5 分，rubric 寫出 5、3、1 的錨點。4 與 2 這樣給：

- 4：3 的描述全部做到，5 的描述只差一兩處，並在理由寫出差在哪
- 2：1 的描述不成立，但 3 的描述沒有全部做到
- 判斷不了是哪一個時取低的

## 門檻

每份 rubric 分別判斷，全部通過才算通過：

- 平均 ≥ 4.0
- 沒有任何一項 < 3

評審階段沒通過時退回製作：主 session 依「要改的地方」修正，修正後由新的 `reviewer` 重評，不沿用上一輪的分數。設計概念階段不判斷通過與否，分數只供人選擇方向。

## 輸入

只給評審看產出物，不給製作過程：

| 給 | 不給 |
|---|---|
| 頁面網址（PR preview 或 `npm run preview`）、`dist/` 的 HTML、原型檔案 | PR 對話、issue 留言、進度檔、製作者的說明或自評 |
| 375、1280 寬的截圖 | 上一輪或其他組的評分 |
| `docs/strategy/` 的 messaging、brief、設計原則、事實庫（評「有沒有做到」要對照的依據） | |
| 本 skill 與 rubric | |

呼叫評審的主 session 照上表準備 prompt，不在 prompt 裡寫自己的判斷或預期分數。

### 評審對象的準備

比較多組頁面時（新版與舊版、現站、競品），用 `node scripts/strategy/eval-shots.mjs` 產生素材，用法寫在 script 開頭。它做三件事：

- 截第一屏與整頁圖，存在 `docs/strategy/evaluation/<組>/`
- 把整頁切成每 1600 px 一張（375 寬是 1400 px）。整頁長圖縮小後讀不到字
- 在 `--work/blind/` 把每頁換成中性代號，評審看不到組別。代號與組別的對照在 `blind/map.tsv`，只給主 session 看

prompt 給 `blind/<代號>/` 的路徑，不寫組別或版本。評審結果存成 `docs/strategy/evaluation/reviews/<組>-<頁>.md`，rubric 的標題升成 `## <rubric>：平均 <x.x>，<通過／未通過>`。報告的分數表用 `node scripts/strategy/eval-scores.mjs --write` 產生（`npm run check` 檢查表格是否過期，以及評審寫的平均和表內分數是否一致）。

截圖時的規則，評審照這些規則評：

- 截圖以 `prefers-reduced-motion: reduce` 截取。減少動態時留白、停在淡出、被色塊蓋住的內容，當成頁面實際的呈現評：減少動態的訪客看到的就是這樣
- 只在 hover 才出現的內容不算「看得到」（D5、C3）
- 評連入（S5）時看整份 `dist/`：用 grep 找哪些頁面連到這一頁。現站與競品沒有整份 HTML，只評連出

## 做法

1. 每一組評審對象（例如一個方向、一個頁面、一個競品）各開一個新的 `reviewer` subagent，不帶前一組的結果
2. 先看截圖，寫下第一印象（5 秒內能看出這家公司做什麼嗎），再看 HTML 與文件
3. 逐項評分，每項都寫理由，理由要指到畫面或文字的具體位置（段落、元素、截圖區域）
4. 每項低於 4 分的，寫「要改的地方」：改什麼、為什麼，不寫怎麼實作
5. 最後寫「評審依據不足」：哪些項目因為 brief、messaging、設計原則或 rubric 寫得不清楚、互相衝突而難以判斷，指出是哪份文件的哪裡。沒有就寫「無」。這一節是流程回寫的依據，見 `docs/workflow.md`「分階段流程」的評審

## 產出物

評審把結果回傳給主 session，由主 session 貼到 PR 或寫進報告。格式：

```markdown
## 評審：<對象>

第一印象：<一兩句>

### <rubric 名稱>：平均 <x.x>，<通過／未通過>

| 項目 | 分數 | 理由 |
|---|---|---|
| … | 4 | … |

要改的地方：
- <項目>：<改什麼、為什麼>

### 評審依據不足

- <文件與位置>：<哪一項、為什麼判斷不了>
```

## 不做的事

- 不修改任何檔案，只輸出評分
- 不讀製作過程的對話與說明，避免被作者的解釋影響
- 不評工程品質（效能、無障礙的自動檢查、程式碼），那些由 `npm run check` 與 `/pr-review` 負責
