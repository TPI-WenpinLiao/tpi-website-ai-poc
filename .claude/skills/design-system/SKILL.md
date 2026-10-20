---
name: design-system
description: 撰寫或修改任何樣式、元件時使用。說明 design tokens 與元件規則。目前為佔位，M3 定案後補齊。
---

# Design system

> 狀態：佔位。token 數值、元件清單與展示頁將在 M3（M3-02、M3-03）定案後補齊，並由 M3 收尾 issue 更新本檔。

## 目前生效的規則

- 所有樣式值（色彩、字級、行高、間距、圓角、陰影、斷點、動畫時間）只能引用 `src/styles/tokens.css` 的 CSS custom properties
- 需要新 token 時先加到 `tokens.css` 並在 PR 中說明用途，不得在元件內寫死數值
- 不使用 UI framework 或 utility CSS framework
- 元件樣式寫在 `.astro` 的 scoped `<style>`；全域樣式只放在 layout

## M3 後補齊

- token 分層（primitive → semantic）與命名規則
- 元件清單、props 與使用範例
- design-system 展示頁路徑與新增元件的流程
- 響應式斷點與無障礙要求（對比、focus 樣式、動態減少偏好）
