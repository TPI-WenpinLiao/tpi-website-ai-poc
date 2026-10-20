# CLAUDE.md

## 專案目標

重新設計並開發 TPIsoftware（昕力資訊）官方網站，素材來源為 https://www.tpisoftware.com。本專案同時驗證「AI 輔助開發工作流程」：需求以 GitHub issue 管理，Claude 在雲端 session 實作，人工負責設計確認與 review。

- 可上線品質的真實開發，但目前只部署到 Cloudflare Pages（`*.pages.dev`），不上正式網域
- 本站是現站的改版複製品，**不可被搜尋引擎收錄**：`public/_headers` 與 `public/robots.txt` 不得移除或放寬
- 語系：zh-TW 優先；架構需支援 en、vi（M7 才翻譯）
- 目前 milestone、進度與下一步以 `docs/status.md` 為準

## 技術棧

Astro（`output: 'static'`，預設零 client JS，互動才用 island）、TypeScript strict、CSS custom properties 作為 design tokens、不使用 UI framework、npm、Node 版本見 `.nvmrc`。決策理由見 `docs/decisions/`。

## 目錄結構

```
src/pages/        路由頁面
src/layouts/      版型
src/styles/       tokens.css（design tokens）
public/           靜態檔（_headers、robots.txt）
scripts/          session-start.sh（SessionStart hook）、lhci-prepare.mjs
docs/             status.md、decisions/（ADR）、onboarding.md
.claude/skills/   seo-checklist、design-system、content-migration
.github/          ISSUE_TEMPLATE、workflows、bootstrap（labels / milestones / issues）
```

## 指令

| 指令 | 用途 |
|---|---|
| `npm run dev` | 本機開發 |
| `npm run build` | 產生 `dist/` |
| `npm run check` | astro check → build → html-validate → Lighthouse CI（推送前必跑） |

Lighthouse 對 `.lhci-dist/`（移除 robots.txt 與 _headers 的 dist 副本）執行；HTML 內不可放 `noindex` meta。

## 雲端 session 工作規則

1. 每個 session 對應一張 issue。開始前先讀 issue 內容、本檔、`docs/status.md`，以 Plan 模式提出計畫，等使用者確認後再實作。
2. 若 `node_modules` 不存在或 SessionStart hook 回報安裝失敗，先執行 `npm ci` 並回報結果，不要直接開始實作。
3. Branch 命名：`<type>/<issue-number>-<slug>`，type 取 `feat` / `fix` / `content` / `docs` / `chore`。例：`feat/12-header-nav`。
4. PR body 必含：`Closes #N`、變更摘要、驗收方式、preview 檢查重點（要看哪些頁面、哪些斷點）。
5. 推送前 `npm run check` 必須通過。不得 push `main`。

## 設計確認兩階段流程（issue 帶 `needs-design` 時適用）

**階段一：視覺與結構**
- 只做版面、視覺與元件結構
- push 後開 **draft PR**，body 列出設計決策與待確認問題
- 停下，告知使用者等待設計確認。**不得自行進入階段二**

**階段二：完成度**
- 使用者告知已加上 `design-approved` 後才繼續
- 補齊 SEO、無障礙、內容完整度
- `npm run check` 通過後將 PR 轉為 ready for review

M2、M3 的關卡 issue 改用對應的 label（`ia-approved`、`wireframe-approved`、`design-approved`），流程相同。

## SEO 底線

每頁必須有唯一的 title 與 description、canonical、OG/Twitter、單一 h1 且 heading 不跳級、圖片 alt 與尺寸。細節與驗收方式見 `.claude/skills/seo-checklist/SKILL.md`。

## 設計規則

- 樣式只能使用 `src/styles/tokens.css` 定義的 design tokens，不得寫死色碼、字級、間距
- 新元件必須同步加到 design-system 展示頁（M3 後生效）
- 細節見 `.claude/skills/design-system/SKILL.md`

## 內容規則

- 不得捏造產品功能、數據、客戶名稱、認證或獎項
- 不確定的內容在 PR 中列為「待確認」，不要自行補上
- 從現站搬移內容時依 `.claude/skills/content-migration/SKILL.md`

## 文件維護

- 架構決策記錄於 `docs/decisions/NNNN-<slug>.md`（ADR）
- 每個 milestone 結束時更新本檔與 skills（各 milestone 最後一張 issue）
- 進度變動時更新 `docs/status.md`
