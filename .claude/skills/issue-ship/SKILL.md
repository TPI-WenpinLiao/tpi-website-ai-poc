---
name: issue-ship
description: issue 的實作完成、要收尾時使用（/issue-ship）。驗證 npm run check、更新 docs/status.md、依專案格式 commit、push 到工作 branch，並開 PR（needs-design 階段一開 draft，否則 ready for review）。
---

# Issue ship

使用者呼叫 `/issue-ship` 即視為同意本次 commit、push 與開 PR。若是 Claude 自行判斷要收尾，先問使用者，不要直接執行。

## 1. 確認範圍

```bash
git status -sb
git diff --stat origin/main...HEAD
git diff --stat
```

- 目前 branch 不得是 `main`
- 從對話或 branch 上的 commit 找出對應的 issue 編號；找不到就問
- `origin/main...HEAD` 包含 [`checkpoint`](../checkpoint/SKILL.md) 推過的 `wip:` commit，範圍確認要涵蓋它們
- 進度檔「目前狀態」有「待刪除的舊 branch」時記下來，第 7 步列進 PR 的「待確認」
- 刪除 `.claude/progress/<N>.md`（`git rm`）；進度檔不得進入 `main`
- 未追蹤或修改的檔案逐一確認是本 issue 的產出；scratchpad、`.lighthouseci/`、`.lhci-dist/` 等暫存不得 commit
- 掃一次 diff，不得包含 secrets、token、個人資料

## 2. 品質檢查

執行 `npm run check`（Bash timeout 600000 ms，輸出導到 scratchpad）。**失敗就停下回報，不得 commit 或 push**

## 3. 更新 `docs/status.md`

`status.md` 描述 main 的狀態。PR 的內容在合併那一刻才進 main，所以 PR 裡寫的是**這個 PR 合併後**的狀態。本節是 `status.md` 寫法的唯一規則；`/issue-start` 的對照與 `/pr-review` 的固定檢查都依本節判斷。

- 「最後更新」改為今天。與其他 PR 衝突時取較新的日期
- 「進度」表只寫 milestone 層級的狀態：未開始／進行中／完成
- 「Issue」段落一個 issue 一行，已關閉的 issue 與有 open PR 的 issue 都要列。放在所屬 milestone 的小標下，依 bootstrap-id（`M2-03`）排序；沒有 bootstrap-id 的排在該小標最後。沒有 milestone 的 issue（例如 `[chore]`）放在 issue 關閉當時「進度」表中編號最大的「進行中」milestone；還沒關閉的（包括本 issue）以寫入當下為準
- 本 issue 寫成合併後的狀態：`M2-03 URL 規則與語系策略完成（#10）`
  - 不寫 PR 編號：開 PR 前還不知道編號，PR 可從 issue 的 `closed_by_pull_requests` 查到。既有條目的 PR 編號保留
  - `needs-design` 階段一的 draft PR 合併前要先拿到 approved label，這時還不算完成，寫成 `M3-01 wireframe（#13），階段一，等待 wireframe-approved`；階段二的 PR 再改成完成
- 其他 issue 依 GitHub 實際狀態寫：issue 已關閉的寫完成；有 open PR 的寫 `M2-04 內容模型（#11，PR #61），待合併`，不得寫完成
- 「下一步」用無編號清單
  - 移除本 issue 的項目
  - 加上合併後才成立的項目，例如「M2-06 可以開始」。寫之前用 `mcp__github__issue_read` 確認該 issue「## 依賴」的其他 issue 都已關閉，只差本 issue
  - 加上本 issue 產生的待決事項
- 「待辦備忘」只放跨 issue、需要記住的事

## 4. 出貨前自我 review

執行 `/pr-review`（不帶參數，審查目前 branch）。依該 skill 的規定交給子代理執行。固定檢查與分類規則只寫在 [`../pr-review/SKILL.md`](../pr-review/SKILL.md)，本步驟不另列。

- Act on：修正後重跑第 2 步，再跑一次 `/pr-review`
- Consider：寫進 PR 的「待確認」
- 本步驟不在 PR 上留言（此時還沒有 PR）

## 5. Commit

訊息格式（與既有 history 一致）：

```
<type>: <摘要>（#N）

- 變更 1
- 變更 2

<系統指示要求的 attribution trailer>
```

- `type`：`feat`／`fix`／`content`／`docs`／`chore`，依 issue 的 `type:*` label
- 摘要用正體中文，不寫模型名稱；依 `writing-style` 去除空話
- 一張 issue 原則上一個 commit；修正 review 意見時另開 commit，不 amend 已 push 的 commit
- branch 上有 `wip:` commit 且還沒開 PR 時，先 `git reset --soft "$(git merge-base origin/main HEAD)"`，再用上述格式 commit 成一個。用 merge-base 而不是 `origin/main`：`main` 在這之後有新 commit 時，reset 到 `origin/main` 會把那些變更反向寫進這個 commit。`main` 用 merge commit 合併 PR，不合併的話 `wip:` 會留在 `main` 的歷史

## 6. Push

```bash
git push -u origin <工作 branch>
```

工作 branch 由 [`issue-start` 第 1 步](../issue-start/SKILL.md#1-同步-branch)決定。只在網路錯誤時重試，最多 4 次（間隔 2s、4s、8s、16s）。不得 push `main`、不得 force push 到他人的 branch。

第 5 步合併過 `wip:` commit 時，改用 `git push --force-with-lease -u origin <branch>`。這時還沒開 PR，branch 只有本 session 在用，改寫歷史不影響別人。PR 開了之後就不再 force push。

## 7. 開 PR

用 `mcp__github__create_pull_request`，base 為 `main`。

- **title**：issue 標題（含 `[Mx-xx]` 或 `[chore]` 前綴）
- **draft**：issue 有 `needs-design` 且尚無 `design-approved`（或 M2／M3 對應的 approved label）→ `true`；其他 → `false`
- **body** 必含以下段落：

```markdown
Closes #N

## 變更摘要
- …（交付物與主要數字）

## 驗收方式
- 對照 issue 的每條驗收條件，寫出怎麼驗證、結果
- `npm run check` 通過

## Preview 檢查重點
- 要看的頁面路徑與斷點（375／768／1280）；沒有頁面變更時寫「無頁面變更」，改列 review 時要看的文件段落

## 待確認
- 不確定的內容、與計畫不同之處（沒有就省略）
```

最後附上系統指示要求的 PR attribution。

### `needs-design` 階段一

PR body 另列「設計決策」與「待確認問題」。開完 draft PR 後**停下**，告知使用者等待設計確認，不得進入階段二。

### `needs-design` 階段二

使用者告知已加上 approved label 後，補齊 SEO、無障礙、內容，`npm run check` 通過後 push，再用 `mcp__github__update_pull_request` 把 `draft` 設為 `false`。

## 8. 回報

- PR 連結（完整 URL 的 markdown link）
- 一兩句摘要與 review 重點
- 詢問是否要用 `subscribe_pr_activity` 監看 CI 與 review 留言
