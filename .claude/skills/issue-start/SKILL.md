---
name: issue-start
description: 開始處理一張 GitHub issue 時使用（/issue-start <issue 編號>）。讀取 issue 與專案文件、檢查依賴與 label、對照 status.md 與 GitHub 實際狀態、執行環境檢查，全部通過後以 Plan 模式提出計畫並等待確認；branch 上有 checkpoint 進度檔時改為接續。使用者說「處理 issue #N」時也適用。
---

# Issue start

參數：issue 編號（例如 `/issue-start 4`）。沒有給編號就先問，不要猜。

**本 skill 只到「提出計畫」為止。** 使用者確認計畫前不得修改 repo 內的檔案、commit 或 push。接續先前 checkpoint 的工作時例外，見第 1 步。

## 1. 同步 branch

本步驟決定**工作 branch**：之後的 checkpoint、`/issue-ship` 都 push 到這裡。預設是 session 指定的 branch（雲端 session 的系統指示會寫明）；沒有指定時用 `<type>/<N>-<slug>`，type 依 issue 的 `type:*` label。接續既有 PR 時改為 PR 的 head branch（見下方）。

先用 `mcp__github__issue_read`（`get`）讀 issue 的 `state` 與 `closed_by_pull_requests`，依序判斷：

**有 OPEN 的 PR：工作 branch 是 PR 的 head**

用 `mcp__github__pull_request_read`（`get`）取得 head branch，`git fetch origin <head> && git checkout -B <head> origin/<head>`。其他 branch 上的進度檔一律不看。回報時寫明「工作 branch 是 PR head `<head>`，不是 session branch」。

- head 上有進度檔：照下方「接續」第 3 步起執行
- 沒有（例如 `needs-design` 階段一已出貨，或要修 review 意見）：停下說明 PR 狀態。使用者確認繼續後，在這個 branch 上照第 2–6 步提出下一段的計畫

**沒有 OPEN 的 PR，但 issue 已關閉或有 MERGED／CLOSED 的 PR：停下**

舊 branch 刪不掉（雲端 session 刪除 remote branch 會被 403 擋下，#70 實測），上面的進度檔可能已經過時，也可能是先前「重做」留下、還沒開 PR 的進度，不能自動接續。

1. 執行下方「找進度檔」的迴圈，排除這些 MERGED／CLOSED PR 的 head branch
2. 停下回報 issue 與 PR 狀態（含 PR 關閉時間），並列出剩下帶進度檔的 ref 與各自 `git log -1 --format=%ci` 的時間
3. 問使用者：接續其中一個 ref，或重做
   - 接續：照下方「接續」第 2 步起執行
   - 重做：`git checkout -B <工作 branch> origin/main`，照第 2–6 步提出新計畫。列出的 ref 扣掉 `origin/<工作 branch>` 後，寫進第一次 checkpoint 的「待刪除的舊 branch」。`origin/<工作 branch>` 本身在清單裡時（同一個 session 重啟），重做會捨棄它上面的進度，第一次 checkpoint 要用 `git push --force-with-lease`；問使用者時先講明這一點

**issue 開著、沒有任何 PR：找進度檔**

新的 session 會拿到新的 branch 名稱，所以要找遍 remote：

```bash
git fetch --prune origin
for ref in $(git for-each-ref --format='%(refname:short)' refs/remotes/origin | grep -v '^origin$'); do
  git cat-file -e "$ref:.claude/progress/<N>.md" 2>/dev/null && echo "$ref"
done
git status -sb
```

找到進度檔時接續（[`checkpoint`](../checkpoint/SKILL.md)）：

1. 找到多個 ref 時，取 `git log -1 --format=%ci` 最新的一個；時間相同時優先取 session branch，否則任取，並在回報中列出其他 ref
2. `git checkout -B <工作 branch> <該 ref>`。舊 branch 刪不掉，第一次 checkpoint 時寫進進度檔「目前狀態」的「待刪除的舊 branch」，`/issue-ship` 會列進 PR 請人工刪除。要寫的是：進度檔原本列的舊 branch，加上這次迴圈找到的所有 ref，扣掉 `origin/<工作 branch>` 本身（同一個 session 重啟時就是它，不能刪）
3. 執行 `node scripts/checkpoint/status.mjs <N>`，取得每個階段的狀態與下一步；script 失敗（exit 非 0）就停下回報錯誤，不要自己從 commit 推測。再讀進度檔的「目前狀態」與「待使用者決定」，照常執行第 2、3、5 步（第 4 步的 `status.md` 對照已在原計畫做過，略過）
4. 回報環境檢查表、已完成的階段、下一步與「待使用者決定」，**不進 Plan 模式**：計畫已確認過，寫在進度檔裡
5. 「待使用者決定」不是「無」時停下等回覆；否則從下一個階段繼續實作

沒有找到進度檔時：

- `git log --oneline origin/main..HEAD` 沒有輸出（新 branch、落後 `main`，或先前的 PR 已合併且之後沒有新 commit）：`git checkout -B <工作 branch> origin/main`
- 有輸出：停下說明狀況，問使用者要接續還是重開

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

## 4. 對照 `docs/status.md`

`status.md` 應該描述 main 目前的狀態。對照 GitHub 找出對不上的地方，在本 issue 的 PR 一起修，不另開同步 PR。判斷規則見 [`issue-ship` 第 3 步](../issue-ship/SKILL.md#3-更新-docsstatusmd)。

1. 列出 `status.md`「待辦備忘」以外每個 `#N`、`PR #N`，以及寫的狀態（完成／待合併／階段一／可以開始）
2. 用 `mcp__github__issue_read`（`get`）與 `mcp__github__pull_request_read`（`get`）查實際狀態；「可以開始」的 issue 另外查它的依賴是否都已關閉
3. 用 `mcp__github__list_pull_requests`（`state: open`）列出 open PR。body 有 `Closes #N` 時，`status.md` 沒寫 `PR #N`，或 `#N` 沒有自己一行寫出狀態，都算對不上；只在別的句子裡提到 `#N` 不算有列
4. 用 `mcp__github__list_issues`（`state: CLOSED`）列出已關閉的 issue，「Issue」段落沒有這張 issue 的一行也算對不上

對不上的寫進計畫的「`status.md` 同步」一項。這一步不擋計畫，沒有對不上的就在環境檢查表寫「一致」。

## 5. 環境檢查

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

## 6. 提出計畫

先在對話中輸出環境檢查表：

| 項目 | 結果 |
|---|---|
| `node -v` | `vX.Y.Z`（`.nvmrc` = N）✅／❌ |
| `npm run check` | exit 0 ✅／失敗原因 ❌ |
| 依賴 | #N closed ✅ … |
| 現站連線（需要時） | 200 ✅／… |
| `status.md` 對照 | 一致 ✅／列出對不上的項目 |

接著呼叫 `EnterPlanMode`，把計畫寫進 plan 檔，再呼叫 `ExitPlanMode` 請使用者確認。計畫必須包含：

- **Context**：issue 目標、前置產出、為什麼要做
- **做法**：每個交付物怎麼產出；能重跑的資料處理寫成 script（放 `scripts/`），不要手改產出檔
- **階段**：把實作拆成可各自驗證的階段，每個階段寫出完成條件。每個階段完成時執行 [`checkpoint`](../checkpoint/SKILL.md)；只有一個階段的小 issue 也要寫
- **驗收對照**：issue 的每一條驗收條件分別如何驗證
- **`status.md` 同步**：第 4 步找到的不一致與修法（沒有就省略）
- **需使用者決定**：有推薦的選項時寫出推薦與理由，不要只列選項
- **branch**：使用第 1 步決定的 branch
- **收尾**：完成後以 `/issue-ship` 收尾

如果 `ExitPlanMode` 失敗（例如 worker 重啟後已不在 plan mode），把計畫摘要直接貼在對話中，等使用者確認，**不得自行開始實作**。
