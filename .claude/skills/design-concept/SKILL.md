---
name: design-concept
description: 分階段流程的設計概念階段使用：從 messaging 推出設計原則、整理參考對照、做三個方向的 HTML 原型，交給 reviewer 依 rubric 評分後由人選定。由 design-director agent 執行，不寫 production 程式。
---

# Design concept

分階段流程的設計概念階段（`docs/workflow.md`「分階段流程」）。目的是在改 `src/` 之前，先決定網站「要傳達什麼、為什麼長這樣」，並讓人從明顯不同的方向中選一個。

本站的試點頁面讀 [`docs/strategy/site-profile.md`](../../../docs/strategy/site-profile.md)，本 skill 不寫死。

## 輸入

| 輸入 | 位置 |
|---|---|
| messaging 與 brief（需已有 `strategy-approved`） | `docs/strategy/messaging.md`、`docs/strategy/briefs/` |
| 競品分析 | `docs/strategy/competitors.md` |
| 現有設計系統與限制 | `design-system` skill、`src/styles/tokens.css`、`docs/design/motion.md`、ADR 0003（3D 載入）、`scripts/design/scene-budget.mjs`、`scripts/design/font-subsets.mjs` |
| 品牌素材 | `docs/design/brand-assets.md` |

## 產出物

| 產出物 | 位置 |
|---|---|
| 設計原則 | `docs/strategy/design-principles.md` |
| 參考對照 | 同一份文件的「參考」一節 |
| 三個方向的原型 | `docs/strategy/concepts/<direction>/index.html`，截圖放同目錄 |

關卡：`reviewer` 依 `site-review` 的設計 rubric 為三個方向評分，結果附在 PR；人選定方向後加 `design-approved`，選定結果寫回 `design-system` skill 的「設計方向」。

## 1. 設計原則

寫 3–5 條。每條：

1. 原則本身，一句話
2. 從 messaging 哪一個主張推出來（引用 `messaging.md` 的段落）
3. 在畫面上**會**怎麼呈現：版面、字體、色彩、影像、動態各舉具體做法
4. 在畫面上**不會**怎麼呈現：最容易誤用的做法

原則要能用來否決設計。「簡潔現代」否決不了任何東西，不算原則。

## 2. 參考對照

- 引用 `competitors.md` 的觀察，不重做競品分析
- 另找 3–5 個非競品的參考網站，每個寫：借鏡什麼、對應哪一條原則、不借鏡什麼
- 附來源網址與截圖日期

## 3. 三個方向的原型

1. 只做首頁原型，文案用 brief 寫的段落結構與 messaging 的主張；事實照事實庫，不編數字
2. 三個方向之間要有明顯差異，至少兩項不同：版面結構、字體、影像策略、色彩、動態。只換顏色不算不同方向
3. 每個方向寫一段說明：
   - 主要視覺決定，每個指到一條設計原則
   - 要放寬哪些現有限制（中文 webfont、JS 預算、3D 與否、色彩 token），以及代價。不寫的視為照現有限制
4. 原型是單一 HTML 檔，可以直接在瀏覽器打開，不連 `src/`、不跑 `npm run check`。外部字型與圖片要能離線看時，放在同目錄
5. 每個方向附 375、1280 寬的截圖，用 Playwright 的 chromium 截（專案已安裝，不另裝瀏覽器）

## 不做的事

- 不改 `src/`、`public/`、`tokens.css`：選定方向後，由製作階段的主 session 實作
- 不寫文案：文案來自 brief 與 messaging，缺的列為待補
- 不自己選方向：評分交給 `reviewer`，選擇交給人
