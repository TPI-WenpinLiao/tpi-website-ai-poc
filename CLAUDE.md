# CLAUDE.md

## 專案目標

重新設計並開發 TPIsoftware（昕力資訊）官方網站，素材來源為 https://www.tpisoftware.com。本專案同時驗證「AI 輔助開發工作流程」：需求以 GitHub issue 管理，Claude 在雲端 session 實作，人工負責設計確認與 review。

- 可上線品質的真實開發，但目前只部署到 Cloudflare Pages（`*.pages.dev`），不上正式網域
- 本站是現站的改版複製品，**不可被搜尋引擎收錄**：`public/_headers` 與 `public/robots.txt` 不得移除或放寬
- 語系：zh-TW 優先；架構需支援 en、vi（M7 才翻譯）。URL 與語系路徑規則見 `docs/decisions/0002-url-and-locale.md`
- 目前 milestone、進度與下一步以 `docs/status.md` 為準

## 技術棧

Astro（`output: 'static'`，預設零 client JS，互動才用 island）、TypeScript strict、CSS custom properties 作為 design tokens、不使用 UI framework、npm、Node 版本見 `.nvmrc`。決策理由見 `docs/decisions/`。

## 目錄結構

```
src/pages/        路由頁面
src/layouts/      版型
src/styles/       tokens.css（design tokens）
public/           靜態檔（_headers、robots.txt）
scripts/          session-start.sh（SessionStart hook）、lhci-prepare.mjs、inventory/（現站盤點與稽核）、ia/（sitemap、導覽、轉址對應）、checkpoint/（進度推算）
docs/             status.md、decisions/（ADR）、onboarding.md、workflow.md（工作流程使用說明）、research/、ia/（資訊架構）
.claude/skills/   issue-start、issue-ship、checkpoint、pr-review、next-issue（工作流程）；seo-checklist、design-system、content-migration、typescript-best-practices、writing-style
.github/          ISSUE_TEMPLATE、workflows、bootstrap（labels / milestones / issues）
```

## 指令

| 指令 | 用途 |
|---|---|
| `npm run dev` | 本機開發 |
| `npm run build` | 產生 `dist/` |
| `npm run check` | IA 資料檢查 → scripts 測試 → astro check → build → html-validate → Lighthouse CI（推送前必跑） |
| `npm run check:ia` | 驗證 `docs/ia/` 的 IA 資料，並確認 `sitemap.mjs`、`navigation.mjs`、`redirects.mjs` 的產出是最新的（不寫檔） |

Lighthouse 對 `.lhci-dist/`（移除 robots.txt 與 _headers 的 dist 副本）執行；HTML 內不可放 `noindex` meta。

## 雲端 session 工作規則

1. 每個 session 對應一張 issue。以 `/issue-start <N>` 開始：讀 issue、本檔、`docs/status.md`，對照 `status.md` 與 GitHub 實際狀態，檢查依賴與環境，提出計畫。issue 沒有 `needs-design`、`needs-input`，計畫也沒有待使用者決定的事項時，計畫貼到 issue 留言後直接實作（自動模式）；否則以 Plan 模式等使用者確認。計畫拆成階段，每個階段完成時與停下等回覆前執行 `/checkpoint`（WIP commit 加進度檔）；session 中斷後再執行 `/issue-start <N>` 從進度檔接續。
2. 若 `node_modules` 不存在或 SessionStart hook 回報安裝失敗，先執行 `npm ci` 並回報結果，不要直接開始實作。
3. Branch：雲端 session 使用 session 指定的 branch，接續既有 PR 時用 PR 的 head branch（見 `issue-start` 第 1 步）；本機開發用 `<type>/<issue-number>-<slug>`，type 取 `feat` / `fix` / `content` / `docs` / `chore`。PR 標題以 issue 的 `[Mx-xx]` 或 `[chore]` 前綴開頭。
4. 最後一個階段完成後自動執行 `/issue-ship`：開 draft PR，跑審查迴圈直到符合完成條件，再轉 ready 並在 PR 貼合併判斷摘要。合併由使用者決定。PR body 必含：`Closes #N`、變更摘要、驗收方式、preview 檢查重點（要看哪些頁面、哪些斷點）。需要人決定時依 `checkpoint` skill 的「停下找人」處理。
5. 開 PR 前 `npm run check` 必須通過；checkpoint 的 push 不跑，規則見 `checkpoint` skill。不得 push `main`。
6. 找下一張可開始的 issue 用 `/next-issue`。

## 工作原則

> 改寫自 pstack 的 principle skills（MIT，見 `.claude/skills/THIRD_PARTY_NOTICES.md`）

- **驗證實際產出**：看實際輸出、exit code、產出檔案，不以「應該會過」、截斷的 log 或自己的轉述代替。數字要寫出來源與重現方式
- **非一次性的工作寫成工具**：資料處理、批次修改、檢查都寫成可重跑的 script，不手改產出檔。例：`scripts/inventory/audit.mjs`
- **操作可重複執行**：script 跑兩次、或上次中途失敗後重跑，結果都要相同
- **重複出現的錯誤改用結構防堵**：同一個提醒寫第二次時，改成 lint、型別、測試或 script 檢查；無法結構化才寫成文件
- **修根因**：先重現，再一路追到第一個出錯的地方修；不在症狀出現處加 guard 或吞掉錯誤。同類問題一次找齊
- **小步可驗證**：多步驟工作拆成各自能驗證的小單位，前一步通過才做下一步
- **最小變更**：用最小的 diff 解決問題；同一個決定只放在一個地方，不預先抽象

## 設計確認兩階段流程（issue 帶 `needs-design` 時適用）

**階段一：視覺與結構**
- 只做版面、視覺與元件結構
- push 後開 **draft PR**，body 列出設計決策與待確認問題
- 停下，告知使用者等待設計確認。**不得自行進入階段二**

**階段二：完成度**
- 使用者告知已加上 `design-approved` 後才繼續
- 補齊 SEO、無障礙、內容完整度
- 跑 `/issue-ship` 的審查迴圈，符合完成條件後將 PR 轉為 ready for review

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
- 工作流程（skills、人工關卡）變動時更新 `docs/workflow.md`
- 撰寫文件、PR 描述、commit message 依 `.claude/skills/writing-style/SKILL.md`
