---
name: next-issue
description: 找出下一張可以開始的 issue 並產生開場提示詞時使用（/next-issue）。依 milestone 順序、issue 的「## 依賴」與關卡 label 判斷哪些 issue 已解除阻擋。使用者問「下一個任務」「下一張 issue」時也適用。
---

# Next issue

本 skill 是唯讀的：只查詢與輸出，不修改 repo、issue 或 label。

## 1. 取得 issue

用 `mcp__github__list_issues`（`state: OPEN`、`orderBy: CREATED_AT`、`direction: ASC`、`fields: [number, title, labels, body]`），依 `pageInfo.endCursor` 翻頁到底。依賴中出現、但不在 open 清單的 issue，用 `mcp__github__issue_read` 確認狀態與 label。

再用 `mcp__github__list_pull_requests`（`state: open`、`fields: [number, title, body, draft]`）取得 open PR，body 含 `Closes #N` 的 issue 歸入「進行中」，不列入可開始；目前 session 正在處理的 issue 也一樣。`docs/status.md` 不列進行中的 issue（[`issue-ship` 第 3 步](../issue-ship/SKILL.md#3-更新-docsstatusmd)），這份清單只由本 skill 從 GitHub 查。

## 2. 判斷可否開始

對每張 open issue：

1. 解析 body 的 `## 依賴` 段落中的 `#N`；寫「無」代表沒有依賴
2. 每個依賴都必須是 closed
3. 依賴的 issue 有 `## 關卡` 段落時，還要帶對應的 approved label（`ia-approved`／`wireframe-approved`／`design-approved`）
4. 排序：milestone（M1 → M8），再依 body 的 `<!-- bootstrap-id: Mx-yy -->`；沒有 bootstrap-id 的（例如 `[chore]`）排在同 milestone 最後，沒有 milestone 的排最前

分類：

| 類別 | 條件 |
|---|---|
| 需人工決定 | 帶 `needs-decision`：Claude 停下等人決定，問題在 issue 或 PR 的最新留言（不論依賴，都列在最前面） |
| 進行中 | 有 open PR（body 含 `Closes #N`）。issue 帶 `needs-design` 或 issue 本身有「## 關卡」段落，且還沒有對應的 approved label 時，註明「等待 `<label>`」 |
| 可開始 | 依賴全部滿足，且沒有 `needs-input` |
| 需人工提供 | 依賴滿足，但有 `needs-input`（Claude 只能整理與提問） |
| 等待中 | 有依賴未滿足（列出卡在哪幾張） |

「等待中」只列最近的 milestone，不要整份倒出來。

## 3. 輸出

1. 一句結論：推薦先做哪一張與理由（依賴鏈最長、會擋住最多後續 issue 的優先）
2. 「可開始」清單：可以平行開不同 session 的 issue 註明可平行
3. 推薦 issue 的開場提示詞，放在 code block，讓使用者直接貼到新 session：

```
/issue-start <N>
```

需要額外提醒時（例如要連現站、需要 API key、有 `needs-design`），在提示詞下方列出，並寫進提示詞第二行起的補充說明，例如：

```
/issue-start 4
補充：本 issue 需要連到現站並量測 Lighthouse／CWV；需要 API key 時列為 needs-input，不要要求貼上 credentials。
```

4. 「需人工決定」列在結論之前，附 issue 或 PR 留言的連結
5. 「進行中」每張一行：issue、PR 連結、draft 或 ready，等待 approved label 的寫出 label，這些是等人工設計確認的關卡
6. 「需人工提供」與「等待中」各用一兩行帶過
