---
name: issue-start
description: 開始處理一張 GitHub issue 時使用（/issue-start <issue 編號>）。讀取 issue 與專案文件、檢查依賴與 label、執行環境檢查，全部通過後以 Plan 模式提出計畫並等待確認。使用者說「處理 issue #N」時也適用。
---

# Issue start

參數：issue 編號（例如 `/issue-start 4`）。沒有給編號就先問，不要猜。

**本 skill 只到「提出計畫」為止。** 使用者確認計畫前不得修改 repo 內的檔案、commit 或 push。

## 1. 同步 branch

```bash
git fetch origin main
git status -sb
```

- 使用 session 指定的 branch（雲端 session 的系統指示會寫明）
- 若該 branch 先前的 PR 已合併，或 branch 落後 `main` 且沒有未合併的 commit：`git checkout -B <branch> origin/main`
- 若 branch 上有未合併的 commit，停下說明狀況，問使用者要接續還是重開

## 2. 讀取資料

1. 用 GitHub MCP 工具（`mcp__github__issue_read`，`method: get` 與 `get_comments`）讀 issue 內文、label、milestone 與留言。雲端 session 沒有 `gh` CLI
2. 讀 `CLAUDE.md`、`docs/status.md`
3. 讀 issue「交付物」提到的既有檔案，以及前置 issue 的產出（例如 `docs/research/`）
4. 依 issue 類型讀對應 skill：頁面或內容 → `seo-checklist`；樣式或元件 → `design-system`；搬移現站內容 → `content-migration`；TypeScript／Astro 程式 → `typescript-best-practices`；文件 → `writing-style`

## 3. 前置條件檢查

| 檢查 | 方式 | 不通過時 |
|---|---|---|
| 依賴 | issue「## 依賴」列出的每個 `#N` 都要是 closed（用 `issue_read` 逐一確認） | 停下，列出未完成的依賴 |
| 關卡 | 依賴的 issue 有「## 關卡」段落時，除了 closed，還要帶對應的 approved label（`ia-approved`／`wireframe-approved`／`design-approved`） | 停下，說明缺哪個 label |
| `needs-input` | 有此 label 時，內容必須由人工提供 | 不停下，但計畫只能整理與提問，不得自行補內容 |
| `needs-design` | 有此 label 時適用 `CLAUDE.md` 的兩階段流程 | 不停下；計畫只涵蓋階段一，除非已有 `design-approved` |

## 4. 環境檢查

依序執行，全部記錄結果：

```bash
node -v && cat .nvmrc        # 主版號必須一致
test -d node_modules && echo ok || echo missing
npm run check                # 記錄 exit code；失敗時保留最後 30 行輸出
```

- `node_modules` 不存在：先 `npm ci`，回報結果後再跑 `npm run check`
- `npm run check` 會跑 Lighthouse，耗時數分鐘；用 Bash 的長 timeout（600000 ms），輸出導到 scratchpad 再看結尾
- issue 需要連到現站（盤點、SEO、功能調查等）時，加測 `curl -sS -o /dev/null -w '%{http_code}\n' https://www.tpisoftware.com/` 與 `https://www.tpisoftware.vn/`；被 proxy 擋時依 `docs/onboarding.md` 的 Allowed domains 說明回報
- 不要手動 export 環境變數讓檢查通過；SessionStart hook（`scripts/session-start.sh`）應該已設定好。需要手動設定才會過，就算失敗

**任何一項失敗就停下回報**，不要進入 Plan 模式。

## 5. 提出計畫

先在對話中輸出環境檢查表：

| 項目 | 結果 |
|---|---|
| `node -v` | `vX.Y.Z`（`.nvmrc` = N）✅／❌ |
| `npm run check` | exit 0 ✅／失敗原因 ❌ |
| 依賴 | #N closed ✅ … |
| 現站連線（需要時） | 200 ✅／… |

接著呼叫 `EnterPlanMode`，把計畫寫進 plan 檔，再呼叫 `ExitPlanMode` 請使用者確認。計畫必須包含：

- **Context**：issue 目標、前置產出、為什麼要做
- **做法**：每個交付物怎麼產出；能重跑的資料處理寫成 script（放 `scripts/`），不要手改產出檔
- **驗收對照**：issue 的每一條驗收條件分別如何驗證
- **需使用者決定**：有推薦的選項時寫出推薦與理由，不要只列選項
- **branch**：使用 session 指定的 branch
- **收尾**：完成後以 `/issue-ship` 收尾

如果 `ExitPlanMode` 失敗（例如 worker 重啟後已不在 plan mode），把計畫摘要直接貼在對話中，等使用者確認，**不得自行開始實作**。
