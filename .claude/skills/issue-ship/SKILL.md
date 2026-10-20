---
name: issue-ship
description: issue 的實作完成、要收尾時使用（/issue-ship）。驗證 npm run check、更新 docs/status.md、依專案格式 commit、push 到 session branch，並開 PR（needs-design 階段一開 draft，否則 ready for review）。
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
- 未追蹤或修改的檔案逐一確認是本 issue 的產出；scratchpad、`.lighthouseci/`、`.lhci-dist/` 等暫存不得 commit
- 掃一次 diff，不得包含 secrets、token、個人資料

## 2. 品質檢查

1. 依變更類型對照 skill：頁面 → `seo-checklist`；樣式 → `design-system`（只用 tokens，不得寫死色碼、字級、間距）；遷移內容 → `content-migration`（不得捏造事實）
2. 有可重跑的 script 時，重跑一次確認輸出與 commit 內容一致
3. 執行 `npm run check`（Bash timeout 600000 ms，輸出導到 scratchpad）。**失敗就停下回報，不得 commit 或 push**

## 3. 更新 `docs/status.md`

- 「最後更新」改為今天
- 「進度」表加上本 issue（`M1-02 內容稽核完成（#3）` 的格式）
- 「下一步」移除已完成的項目；新增本 issue 產生的待決事項
- 「待辦備忘」只放跨 issue、需要記住的事

## 4. Commit

訊息格式（與既有 history 一致）：

```
<type>: <摘要>（#N）

- 變更 1
- 變更 2

<系統指示要求的 attribution trailer>
```

- `type`：`feat`／`fix`／`content`／`docs`／`chore`，依 issue 的 `type:*` label
- 摘要用正體中文，不寫模型名稱
- 一張 issue 原則上一個 commit；修正 review 意見時另開 commit，不 amend 已 push 的 commit

## 5. Push

```bash
git push -u origin <session 指定的 branch>
```

只在網路錯誤時重試，最多 4 次（間隔 2s、4s、8s、16s）。不得 push `main`、不得 force push 到他人的 branch。

## 6. 開 PR

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

## 7. 回報

- PR 連結（完整 URL 的 markdown link）
- 一兩句摘要與 review 重點
- 詢問是否要用 `subscribe_pr_activity` 監看 CI 與 review 留言
