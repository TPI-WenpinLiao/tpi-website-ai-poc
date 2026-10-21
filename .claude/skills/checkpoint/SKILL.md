---
name: checkpoint
description: 實作中途保存進度時使用（/checkpoint）。把目前的工作以 WIP commit push 到工作 branch，並更新 `.claude/progress/<N>.md`，讓容器回收或 session 中斷後能用 /issue-start 接續。每個計畫階段完成時、停下等使用者回覆之前都要執行。
---

# Checkpoint

雲端容器閒置一段時間會被回收，沒 push 的工作會消失。checkpoint 把工作和進度檔一起 push 到工作 branch（`/issue-start` 第 1 步決定），新的 session 執行 `/issue-start <N>` 時從這裡接續，接續流程見 [`issue-start` 第 1 步](../issue-start/SKILL.md#1-同步-branch)。

## 何時執行

- 計畫中的一個階段完成時
- 停下找人之前（見下方「停下找人」）
- 使用者輸入 `/checkpoint` 時

## 授權

使用者確認 `/issue-start` 的計畫（自動模式下是輸入 `/issue-start N`），就同意了這張 issue 的 checkpoint commit 與 push，範圍只限工作 branch。checkpoint 不開 PR、不 push `main`。

## 停下找人

停止條件只寫在這裡，`issue-start`、`issue-ship` 連過來：

- 實作中出現計畫外、需要使用者選的取捨，或修正需要改變計畫範圍
- `needs-input` 的內容要由使用者提供
- `/issue-ship` 的審查迴圈跑滿 3 輪，最新一輪的結論行仍不是全部 0

`needs-design` 階段一出貨後的停下不走這裡，照 [`issue-ship` 的「`needs-design` 的兩個階段」](../issue-ship/SKILL.md#needs-design-的兩個階段)。

做法：

1. 執行本 skill 第 1–3 步（階段做到一半就寫 `進行中`）
2. 留言寫問題、選項與推薦，以及推薦的理由：已開 PR 就留在 PR（`mcp__github__add_issue_comment`，PR 編號），還沒開就留在 issue。第一行寫「需要你決定」，結尾附系統指示要求的 attribution footer
3. 在 issue 加上 `needs-decision` label（`mcp__github__issue_write`，`update`，保留原有 label）
4. 用 `PushNotification` 推播一行：issue 編號、要決定什麼。環境裡沒有這個工具時略過，靠第 2、3 步的留言與 label
5. 在對話中寫出同樣的問題，停下等回覆
6. 使用者回覆後（在原 session，或在新 session 用 `/issue-start N` 接續後回覆都一樣）：拿掉 `needs-decision`，把決定寫進進度檔「目前狀態」，「待使用者決定」改回「無」，馬上 checkpoint 一次，再繼續。審查迴圈中的停下例外：照 `issue-ship` 第 7 步，回覆後的第一個 commit 直接刪除進度檔
7. 因審查迴圈達輪數上限而停下時，使用者的回覆可能是：
   - 繼續修：輪數從 1 重新計算
   - 接受現狀：照 [`issue-ship` 第 8 步](../issue-ship/SKILL.md#8-完成條件轉-ready)的「使用者接受現狀」轉 ready

## 1. 更新進度檔

路徑 `.claude/progress/<N>.md`，進版控。沒有就建立，有就整份改寫成目前的狀態：

```markdown
# #<N> <issue 標題>

- Branch：`<目前的 branch>`
- 最後更新：<YYYY-MM-DD>

## 階段

| # | 階段 | 完成條件 |
|---|---|---|
| 1 | … | … |

## 目前狀態

<做到哪裡、下一步要做什麼。寫到新 session 不看對話也能接手：要改的檔案、已經決定的做法、試過但放棄的做法>

- 待刪除的舊 branch：<接續時留下的舊 branch；沒有就省略這行>

## 待使用者決定

- <沒有就寫「無」>
```

- 「階段」與「完成條件」照抄確認過的計畫，建立後不再修改；編號從 1 連續。計畫有變動時，在「目前狀態」寫出改了什麼、使用者何時同意
- 表格沒有狀態欄。每個階段的狀態由 commit message 推算（第 3 步），用 `node scripts/checkpoint/status.mjs <N>` 查看
- 使用者在對話中做的決定寫進「目前狀態」，接續的 session 看不到對話

## 2. 檢查

checkpoint 不跑 `npm run check`：還沒開 PR 時 push 不會觸發 CI（`quality-gate.yml` 只在 `pull_request` 事件執行），Lighthouse 每次又要數分鐘。開 PR 前仍要通過，見 `issue-ship` 第 2 步。

- `git status --short`：只 stage 本 issue 的產出與進度檔；scratchpad、`.lighthouseci/`、`.lhci-dist/` 等暫存不得 commit
- 掃一次 `git diff --cached`，不得包含 secrets、token、個人資料
- 階段的完成條件有指定檢查（例如重跑 script、`npm run build`）時照跑，結果寫進進度檔

## 3. Commit 與 push

```
wip: 階段 <k> 完成：<摘要>（#N）

<系統指示要求的 attribution trailer>
```

- 階段完成時寫 `完成`；階段做到一半、停下等回覆時寫 `進行中`
- commit 後、push 前跑 `node scripts/checkpoint/status.mjs <N>`（審查迴圈停下時的 commit 不寫階段，跳過這項檢查，見 [`issue-ship` 第 7 步](../issue-ship/SKILL.md#7-審查迴圈)），確認輸出的狀態符合預期；不符時 `git commit --amend` 修正 message（還沒 push，不影響別人）。`wip:` commit 的 message 不符合這個格式時 script 會失敗，接續的 session 也會停下

push 方式與重試規則同 [`issue-ship` 第 5 步](../issue-ship/SKILL.md#5-push)。開 PR 一律經過 `/issue-ship`（`needs-design` 階段一也是），`wip:` commit 由 [`issue-ship` 第 4 步](../issue-ship/SKILL.md#4-commit)在開 PR 前合併成一個 commit，不會進入 `main`。

branch 已經有 open PR 時（例如 `needs-design` 階段二），PR 開了就不能再改寫歷史，`wip:` 合併不掉。這時 commit message 的 `wip` 換成 issue 的 type，例如 `feat: 階段 2 完成：<摘要>（#N）`，script 一樣能推算；進度檔照寫，`/issue-ship` 收尾時刪除。

## 4. 回報

一行即可：已完成的階段、commit SHA、下一步。
