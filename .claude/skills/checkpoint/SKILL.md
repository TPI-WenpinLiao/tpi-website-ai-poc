---
name: checkpoint
description: 實作中途保存進度時使用（/checkpoint）。把目前的工作以 WIP commit push 到 session branch，並更新 `.claude/progress/<N>.md`，讓容器回收或 session 中斷後能用 /issue-start 接續。每個計畫階段完成時、停下等使用者回覆之前都要執行。
---

# Checkpoint

雲端容器閒置一段時間會被回收，沒 push 的工作會消失。checkpoint 把工作和進度檔一起 push 到 session branch，新的 session 執行 `/issue-start <N>` 時從這裡接續，接續流程見 [`issue-start` 第 1 步](../issue-start/SKILL.md#1-同步-branch)。

## 何時執行

- 計畫中的一個階段完成時
- 停下等使用者回覆之前（計畫外的取捨、`needs-input` 提問、`needs-design` 階段一以外的任何暫停）
- 使用者輸入 `/checkpoint` 時

## 授權

使用者確認 `/issue-start` 的計畫，就同意了這張 issue 的 checkpoint commit 與 push，範圍只限 session branch。checkpoint 不開 PR、不 push `main`。

## 1. 更新進度檔

路徑 `.claude/progress/<N>.md`，進版控。沒有就建立，有就整份改寫成目前的狀態：

```markdown
# #<N> <issue 標題>

- Branch：`<目前的 branch>`
- 最後更新：<YYYY-MM-DD>

## 階段

| # | 階段 | 完成條件 | 狀態 |
|---|---|---|---|
| 1 | … | … | 完成／進行中／未開始 |

## 目前狀態

<做到哪裡、下一步要做什麼。寫到新 session 不看對話也能接手：要改的檔案、已經決定的做法、試過但放棄的做法>

## 待使用者決定

- <沒有就寫「無」>
```

- 「階段」與「完成條件」照抄確認過的計畫，只改狀態欄。計畫有變動時，在「目前狀態」寫出改了什麼、使用者何時同意
- 使用者在對話中做的決定寫進「目前狀態」，接續的 session 看不到對話

## 2. 檢查

checkpoint 不跑 `npm run check`：還沒開 PR 時 push 不會觸發 CI（`quality-gate.yml` 只在 `pull_request` 事件執行），Lighthouse 每次又要數分鐘。開 PR 前仍要通過，見 `issue-ship` 第 2 步。

- `git status --short`：只 stage 本 issue 的產出與進度檔；scratchpad、`.lighthouseci/`、`.lhci-dist/` 等暫存不得 commit
- 掃一次 `git diff --cached`，不得包含 secrets、token、個人資料
- 階段的完成條件有指定檢查（例如重跑 script、`npm run build`）時照跑，結果寫進進度檔

## 3. Commit 與 push

```
wip: <階段摘要>（#N）

<系統指示要求的 attribution trailer>
```

push 方式與重試規則同 [`issue-ship` 第 6 步](../issue-ship/SKILL.md#6-push)。`wip:` commit 會在 `/issue-ship` 時合併成一個 commit，不會進入 `main`。

branch 已經有 open PR 時（例如 `needs-design` 階段二），PR 開了就不能再改寫歷史，`wip:` 合併不掉。這時 commit message 改用 [`issue-ship` 第 5 步](../issue-ship/SKILL.md#5-commit)的格式；進度檔照寫，`/issue-ship` 收尾時刪除。

## 4. 回報

一行即可：已完成的階段、commit SHA、下一步。
