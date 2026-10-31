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

每個項目 1–5 分，各分數的錨點寫在 rubric 裡。分數要對到錨點的描述，介於兩個錨點之間時取低的。

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

## 做法

1. 每一組評審對象（例如一個方向、一個頁面、一個競品）各開一個新的 `reviewer` subagent，不帶前一組的結果
2. 先看截圖，寫下第一印象（5 秒內能看出這家公司做什麼嗎），再看 HTML 與文件
3. 逐項評分，每項都寫理由，理由要指到畫面或文字的具體位置（段落、元素、截圖區域）
4. 每項低於 4 分的，寫「要改的地方」：改什麼、為什麼，不寫怎麼實作

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
```

## 不做的事

- 不修改任何檔案，只輸出評分
- 不讀製作過程的對話與說明，避免被作者的解釋影響
- 不評工程品質（效能、無障礙的自動檢查、程式碼），那些由 `npm run check` 與 `/pr-review` 負責
