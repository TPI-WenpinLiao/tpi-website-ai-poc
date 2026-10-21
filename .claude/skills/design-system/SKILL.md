---
name: design-system
description: 撰寫或修改任何樣式、元件時使用。說明 design tokens 的分層與命名、斷點、基礎元件與檢查方式。
---

# Design system

> 狀態：M3-02（#15）定案 tokens 與基礎元件。展示頁流程由 M3-03 補齊，M3 收尾 issue 再更新本檔。

## 規則

- 所有樣式值（色彩、字級、行高、間距、圓角、陰影、斷點、動畫時間）只能引用 `src/styles/tokens.css` 的 CSS custom properties
- 需要新 token 時先加到 `tokens.css` 並在 PR 中說明用途，不得在元件內寫死數值
- 不使用 UI framework 或 utility CSS framework
- 元件樣式寫在 `.astro` 的 scoped `<style>`；全域樣式只放在 `BaseLayout`（`body`、`:focus-visible`、`.sr-only`）
- 頁面元件在 `src/components/ui/`，新元件同步加到 `/design-system`（`src/pages/design-system/index.astro`）

## Token 分層

| 層 | 命名 | 誰能用 |
|---|---|---|
| primitive | `--purple-700`、`--orange-500`、`--neutral-200`、`--red-700`、`--green-700` | 只在 `tokens.css` 內被引用 |
| semantic | `--color-text`、`--color-bg-brand`、`--color-action`、`--color-focus`… | 元件 |
| scale | `--font-size-*`、`--space-*`、`--radius-*`、`--shadow-*`、`--duration-*` | 元件直接用 |

- 品牌色沿用現站：主色紫 `--purple-700`（`#662e8d`）、強調橘 `--orange-500`（`#ff6329`）。橘 500 對白只有 2.97:1，只當裝飾（`--color-accent`）；橘色文字用 `--color-text-accent`（橘 700）
- 新增會疊在一起使用的色彩 token 時，把前景／背景配對加進 `scripts/design/contrast.mjs` 的 `PAIRS`
- 字型：`--font-sans` 拉丁字母與越南文用自行託管的 Inter（`@fontsource-variable/inter`，在 `BaseLayout` import），中文用系統字，不載中文 webfont
- `--wf-*` 只給 M3-01 wireframe 用，M4-04 後隨 wireframe 刪除，新元件不得引用

## 斷點

`@media` 不能讀 custom property，斷點寫在 `src/styles/media.css` 的 `@custom-media`，build 時由 Lightning CSS 展開（`astro.config.mjs` 的 `drafts.customMedia`）：

| 名稱 | 條件 |
|---|---|
| `--bp-sm-up` | `width >= 40rem` |
| `--bp-lg-up` | `width >= 64rem` |
| `--bp-lg-down` | `width < 64rem` |

用斷點的 `<style>` 要先 `@import` media.css（路徑相對於該檔），漏掉時 build 失敗：

```astro
<style>
  @import '../../styles/media.css';

  @media (--bp-lg-up) {
    .grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  }
</style>
```

## 基礎元件

| 元件 | 用途 | 重點 |
|---|---|---|
| `Button` | 動作或按鈕樣式的連結 | 有 `href` 輸出 `<a>`，沒有輸出 `<button>`（預設 `type="button"`）；`disabled` 只存在於 `<button>` |
| `Link` | 內文連結、獨立連結 | 內文連結一律底線；`external` 加 ↗ 與「（外部網站）」螢幕閱讀器文字；深色底用 `inverse` |
| `Tag` | 分類標籤 | 有 `href` 才是連結 |
| `SectionHeading` | 區塊標題 | `level` 由呼叫端指定，避免 heading 跳級 |
| `PageHero` | 內頁標題區 | 輸出該頁唯一的 h1；首頁 hero 另外設計（M3-04、M3-07） |
| `Card` | 列表卡片 | 整卡可點，但只有標題一個連結；圖片 `alt` 必填 |
| `FormField` | 表單欄位 | `kind` 區分 text／email／tel／textarea／select／checkbox；hint、error 以 `aria-describedby` 連到欄位，error 加 `aria-invalid` |

## 無障礙

- 對比：文字 4.5:1、UI 元件與 focus ring 3:1（WCAG 2.2 AA）
- focus：全站共用 `BaseLayout` 的 `:focus-visible`（`--color-focus`，`outline-offset` 讓外框落在周圍底色上）；深色底改用 `--color-focus-inverse`
- 點擊目標：按鈕、獨立連結、表單欄位最小高度 `--touch-target`（44px）
- 動畫：時間一律用 `--duration-*`，`prefers-reduced-motion: reduce` 時在 `tokens.css` 歸零

## 檢查

`npm run check:design`（包含在 `npm run check`）：

- `scripts/design/contrast.mjs`：`PAIRS` 每一組都要達到門檻
- `scripts/design/token-usage.mjs`：`src/components/ui/`、`src/pages/design-system/`、`BaseLayout` 的 `<style>` 不得有色碼、色彩函式、帶單位的長度與時間（`0`、無單位數字、`%`、`fr` 可以）
