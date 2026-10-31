---
name: issue-ship
description: issue 的最後一個階段完成時自動執行（needs-design 或本身有「## 關卡」段落的 issue，階段一也是，開 draft PR 後停下），或使用者輸入 /issue-ship。驗證 npm run check、更新 docs/status.md、commit、push 到工作 branch、開 draft PR，跑審查迴圈直到符合完成條件，再轉 ready 並貼合併判斷摘要。
---

# Issue ship

計畫的最後一個階段完成時自動執行，不再詢問：使用者確認計畫時（自動模式下是輸入 `/issue-start N`）已同意本 issue 的 commit、push、開 PR 與審查迴圈。使用者輸入 `/issue-ship` 也一樣。合併由使用者決定，本 skill 不合併 PR。

## 1. 確認範圍

```bash
git status -sb
git diff --stat origin/main...HEAD
git diff --stat
```

- 目前 branch 不得是 `main`
- 從對話或 branch 上的 commit 找出對應的 issue 編號；找不到就問
- `origin/main...HEAD` 包含 [`checkpoint`](../checkpoint/SKILL.md) 推過的 `wip:` commit，範圍確認要涵蓋它們
- 進度檔「目前狀態」有「待刪除的舊 branch」時記下來，第 6 步列進 PR 的「待確認」
- 刪除 `.claude/progress/<N>.md`（`git rm`）；進度檔不得進入 `main`
- 未追蹤或修改的檔案逐一確認是本 issue 的產出；scratchpad、`.lighthouseci/`、`.lhci-dist/` 等暫存不得 commit
- 掃一次 diff，不得包含 secrets、token、個人資料

## 2. 品質檢查

執行 `npm run check`（Bash timeout 600000 ms，輸出導到 scratchpad）。**失敗就停下回報，不得 commit 或 push**

## 3. 更新 `docs/status.md`

`status.md` 描述 main 的狀態。PR 的內容在合併那一刻才進 main，所以 PR 裡寫的是**這個 PR 合併後**的狀態。本節是 `status.md` 寫法的唯一規則；`/issue-start` 的對照與 `/pr-review` 的固定檢查都依本節判斷。

- 「最後更新」改為今天。與其他 PR 衝突時取較新的日期
- 「進度」表只寫 milestone 層級的狀態：未開始／進行中／完成
- 「Issue」段落一個 issue 一行，只列已關閉的 issue 與本 issue。放在所屬 milestone 的小標下，依 bootstrap-id（`M2-03`）排序；沒有 bootstrap-id 的排在該小標最後。沒有 milestone 的 issue（例如 `[chore]`）放在 issue 關閉當時「進度」表中編號最大的「進行中」milestone；M0–M8 都完成、沒有進行中的 milestone 時（維運），放在「M8 驗收」之後的「### 維運」小標，依關閉順序排列；本 issue 以寫入當下為準
- 本 issue 寫成合併後的狀態：`M2-03 URL 規則與語系策略完成（#10）`
  - 不寫 PR 編號：開 PR 前還不知道編號，PR 可從 issue 的 `closed_by_pull_requests` 查到。既有條目的 PR 編號保留
  - `needs-design` 或本身有「## 關卡」段落的 issue，階段一的 draft PR 合併前要先拿到 approved label，這時還不算完成，寫成 `M3-01 wireframe（#13），階段一，等待 wireframe-approved`；階段二的 PR 再改成完成
- 其他已關閉的 issue 寫完成。`main` 上缺的行（`/issue-start` 第 4 步找到的）在本 PR 補上
- 其他 open PR 的 issue 不寫，也不寫「待合併」。那一行由那個 PR 自己寫成合併後的狀態，合併時帶進 `main`；哪些 issue 進行中由 `/next-issue` 從 GitHub 查。舊規則要求列出其他 open PR，平行的 session 每開一個 PR，其他 PR 的 `status.md` 就過時，每次 push 都多一輪審查與 CI（PR #90 連續兩輪被報 PR #91、#92、#93），各 PR 也互相衝突。`node scripts/status/check.mjs`（`npm run check` 的一部分）擋下含「待合併」的行
- 本 PR 開了之後，其他 PR 合併、issue 關閉，都不用回頭改本 PR 的 `status.md`：那些行由各自的 PR 帶進 `main`。`/pr-review` 的固定檢查依此判斷
- 「下一步」用無編號清單
  - 移除本 issue 的項目
  - 加上合併後才成立的項目，例如「M2-06 可以開始」。寫之前用 `mcp__github__issue_read` 確認該 issue「## 依賴」的其他 issue 都已關閉，只差本 issue
  - 加上本 issue 產生的待決事項
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
- 摘要用正體中文，不寫模型名稱；依 `writing-style` 去除空話
- 一張 issue 原則上一個 commit；修正 review 意見時另開 commit，不 amend 已 push 的 commit
- branch 上有 `wip:` commit 且還沒開 PR 時（包括 `needs-design` 階段一），先 `git reset --soft "$(git merge-base origin/main HEAD)"`，再用上述格式 commit 成一個。用 merge-base 而不是 `origin/main`：`main` 在這之後有新 commit 時，reset 到 `origin/main` 會把那些變更反向寫進這個 commit。`main` 用 merge commit 合併 PR，不合併的話 `wip:` 會留在 `main` 的歷史

## 5. Push

```bash
git push -u origin <工作 branch>
```

工作 branch 由 [`issue-start` 第 1 步](../issue-start/SKILL.md#1-同步-branch)決定。只在網路錯誤時重試，最多 4 次（間隔 2s、4s、8s、16s）。不得 push `main`、不得 force push 到他人的 branch。

第 4 步合併過 `wip:` commit 時，改用 `git push --force-with-lease -u origin <branch>`。這時還沒開 PR，branch 只有本 session 在用，改寫歷史不影響別人。PR 開了之後就不再 force push。

## 6. 開 draft PR

用 `mcp__github__create_pull_request`，base 為 `main`，**一律開 draft**：審查迴圈跑完才轉 ready。工作 branch 已經有 OPEN PR 時（接續既有 PR），不另開，push 後依需要用 `mcp__github__update_pull_request` 更新 body。

- **title**：issue 標題，含它的前綴，例如 `[Mx-xx]`、`[chore]`、issue form 的 `[需求]`、`[Bug]`
- **body** 必含以下段落：

```markdown
Closes #N

## 變更摘要
- …（交付物與主要數字）

## 驗收方式
- 對照 issue 的每條驗收條件，寫出怎麼驗證、結果（指令輸出、檔案、數字）
- 證據在 CI 裡的（CI 綠燈、CI log 的內容）寫「待 CI」
- `npm run check` 通過

## Preview 檢查重點
- 要看的頁面路徑與斷點（375／768／1280）；沒有頁面變更時寫「無頁面變更」，改列 review 時要看的文件段落

## 待確認
- 不確定的內容、與計畫不同之處（沒有就省略）
```

開 PR 時 CI 還沒跑，「待 CI」不得改寫成預期的結果。CI 跑完後，依第 7 步的「等 CI」補上證據。

最後附上系統指示要求的 PR attribution。開完後用 `subscribe_pr_activity` 監看，CI 結果與留言會喚醒 session。

### `needs-design` 的兩個階段

`needs-design` 的兩個階段各執行一次本 skill。issue 本身有「## 關卡」段落時（分階段流程的策略 issue，關卡是 `strategy-approved`）也一樣，approved label 取該段落寫的。`CLAUDE.md` 的兩階段流程、`issue-start` 的計畫、`checkpoint` 都連到這裡，做法不另外寫。

- 階段一：照第 1–6 步做，不跳步。第 4 步照常合併 `wip:` commit，第 5 步照常 `--force-with-lease`。body 另列「設計決策」與「待確認問題」。開完 draft PR 後**停下**，告知使用者等待設計確認，不進第 7 步的審查迴圈，不得進入階段二
- 階段二：使用者告知已加上 approved label 後，補齊 SEO、無障礙、內容（「## 關卡」的 issue 改為依使用者確認時的意見修正產出物），再從第 1 步走到第 9 步。這時 PR 已經開了，所以第 4 步只照一般格式 commit、不做 `wip:` 合併（階段二的 checkpoint 不用 `wip:`，見 [`checkpoint` 第 3 步](../checkpoint/SKILL.md#3-commit-與-push)），第 5 步不 force push，第 6 步不另開 PR，只更新 body

## 7. 審查迴圈

由主 session 執行：子代理不能再開子代理，所以不要把整個迴圈交給子代理。環境裡沒有 Agent tool 時，不要自己審自己的變更，照 [`checkpoint` 的「停下找人」](../checkpoint/SKILL.md#停下找人)處理。

每一輪：

1. 等 CI：目前 head 的 CI 跑完才開始這一輪，第 1 輪也一樣。審查者要看 CI log 才能確認的驗收條件，CI 沒跑完只會被報成缺證據
   - 判斷依據是 `mcp__github__pull_request_read` 的 `get_check_runs`（查的是目前 head），或 `head_sha` 等於目前 head 的 `check_suite.completed` 事件。事件可能晚到：PR #73 先收到舊 head `8442615` 的事件，之後才收到 `31e116c` 的。`head_sha` 不是目前 head 的事件不算，包括被 `cancel-in-progress` 取消的舊 run
   - 綠燈：用 `mcp__github__update_pull_request` 把 body 的 CI 證據改成目前 head 的 run 連結與 log 摘錄，再往下做。第 1 輪換掉「待 CI」；之後每輪換掉上一輪的 head 與連結
   - 失敗：先修 CI，push 後回到本項重新等
2. 用 Agent tool 開一個**新的**子代理執行 `/pr-review <PR 編號>`，依 [`pr-review`](../pr-review/SKILL.md) 的「在改動的 session 審查時交給子代理」給 prompt。第 2 輪起，把上一輪的 Act on 與「未修好」逐條原文附進 prompt
3. 由本 session 判斷每個發現是否成立（`pr-review` 第 6 步的原則），再用 `mcp__github__add_issue_comment` 把審查意見貼到 PR：第一行寫「AI 審查第 N 輪（head `<短 SHA>`，CI <run 連結>）」，最後是 `pr-review` 第 7 步的結論行，結尾附系統指示要求的 attribution footer
4. 依結論行決定：
   - 全部是 0：檢查第 8 步的完成條件
   - 不是 0 且已達輪數上限（[`checkpoint` 的「停下找人」](../checkpoint/SKILL.md#停下找人)）：照該節停下找人
   - 其他：修正。每個修正用一般 commit（`fix: <摘要>（#N）`），跑本檔第 2 步（`npm run check`），push（不 force push），進下一輪
5. Consider：是本 PR 引入的缺陷就當成 Act on 修；其他的記下來，寫進合併判斷摘要

在審查迴圈停下找人時，checkpoint 的 commit 不寫「階段」（`fix: 審查迴圈第 <N> 輪停下等決定（#N）`）：開 PR 時 `wip:` 已合併，`status.mjs` 推算不到之前的階段。進度檔「目前狀態」第一行寫「審查迴圈第 <N> 輪，等使用者決定」，`/issue-start` 接續時依此回到本步驟。使用者回覆後，不論是繼續修或接受現狀，回覆後的第一個 commit（`fix: 依審查決定繼續（#N）`）就 `git rm` 進度檔，不另做 checkpoint。

## 8. 完成條件，轉 ready

以下全部成立才算完成：

- 最新一輪審查的結論行全部是 0（沒有 Act on、沒有上一輪未修好、沒有缺證據的驗收條件），而且那一輪審的就是目前的 head。之後又 push 過（例如修了 Consider）就再跑一輪
- 最新的 head 上，本機 `npm run check` 通過，PR 上的 CI 也是綠的（判斷方式見第 7 步的「等 CI」）
- PR 裡沒有 `.claude/progress/`

例外：因審查迴圈達輪數上限停下找人，使用者回覆「接受現狀」時，結論行可以不是 0。合併判斷摘要的結論寫「需要你決定」，逐條列出還沒清零的發現。CI 綠燈與沒有進度檔兩項仍要成立。

成立後：

1. 用 `mcp__github__update_pull_request` 把 `draft` 設為 `false`，並更新 body 的「驗收方式」與「待確認」
2. 用 `mcp__github__add_issue_comment` 在 PR 貼合併判斷摘要（格式見下），結尾附 attribution footer
3. 用 `PushNotification` 推播一行：PR 編號與結論（環境裡沒有這個工具時略過）

### 合併判斷摘要

```markdown
## 合併判斷摘要

**結論**：建議合併／不建議合併（理由）／需要你決定（問題與推薦）

### 變更重點
- 3 到 5 行

### 驗收條件
- [x] <條件>：<證據>

### 審查紀錄
- 共 N 輪。第 1 輪：<修了什麼>；第 2 輪：…

### 沒有處理的 Consider
- <項目>：<一行理由>（沒有就寫「無」）

### 你要看的地方
- <preview 頁面與斷點，或要讀的文件段落>
```

## 9. 回報

在對話中寫出：PR 連結（完整 URL 的 markdown link）、合併判斷摘要的結論、審查輪數。保持 PR 的監看，直到 PR 合併或關閉。
