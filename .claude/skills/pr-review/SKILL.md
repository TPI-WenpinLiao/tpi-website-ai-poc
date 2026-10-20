---
name: pr-review
description: 審查 PR 或目前 branch 的變更時使用（/pr-review [PR 編號]）。對照 issue 驗收條件找反例、執行本專案固定檢查，程式碼交給 /code-review，發現依 Act on／Consider 分類並輸出可貼到 PR 的審查意見。使用者說「審查 PR」「review PR #N」「幫我看這個 PR」時也適用；/issue-ship 的出貨前自我 review 也用本 skill。
---

# PR review

> 判斷框架改寫自 pstack 的 `interrogate`（lead-judgment）與 `thermo-nuclear-review`，見 [`../THIRD_PARTY_NOTICES.md`](../THIRD_PARTY_NOTICES.md)

本 skill 預設唯讀：只把審查意見輸出到對話，不修改 repo，也不在 PR 上留言。使用者明確要求時才發留言（第 7 步）。

## 1. 決定審查對象

| 參數 | 對象 | diff 來源 | issue 來源 |
|---|---|---|---|
| PR 編號（`/pr-review 60`） | 該 PR | `mcp__github__pull_request_read`（`get`、`get_diff`、`get_files`） | body 的 `Closes #N` |
| git range（`/pr-review 949533f..36b3634`） | range 內的 commit | `git diff <base>..<head>`、`git log <base>..<head>` | commit message 的 `（#N）` |
| 無參數 | 目前 branch | `git diff origin/main...HEAD`、`git diff HEAD`，加上 `git status --short` 列出的未追蹤檔案（`git diff` 不含新檔，要直接讀） | commit message 或對話；找不到就問 |

- 無參數是 `/issue-ship` 開 PR 前的自我 review。git range 用於審查已合併 PR 的歷史版本
- git range 與無參數都視為尚未合併的狀態審查
- PR 已合併或關閉時，在結論註明，照常審查

## 2. 讀取資料

1. diff 與變更檔案清單
2. PR body（或 commit message）
3. 用 `mcp__github__issue_read` 讀 issue 內文與驗收條件
4. 需要時讀變更檔案的完整內容與它引用的資料檔，不只看 diff

先用一段話寫出這次變更的意圖（來自 issue、PR body 與 commit），後面每個發現都對照這個意圖判斷。

## 3. 驗收條件逐條找反例

對 issue 的每條驗收條件，找出不成立的例子：漏列的列、統計數字跟產出檔案對不上、PR body 宣稱的驗證沒有實際做、這次產出的東西反過來證明規則錯了。

## 4. 專案固定檢查

本專案唯一一份固定檢查清單，每次都逐項做。`/issue-ship` 引用這裡，不另列。

| 檢查 | 怎麼查 |
|---|---|
| `public/_headers`、`public/robots.txt` 沒有被移除或放寬 | diff 有動到這兩個檔案時逐行看；`X-Robots-Tag: noindex, nofollow` 與 `Disallow: /` 必須還在 |
| HTML 沒有 `noindex` meta | `grep -rn noindex src/` 沒有結果（不收錄只靠 `_headers` 與 `robots.txt`，Lighthouse 才能量 SEO 分數） |
| 樣式只用 design tokens | 新增或修改的樣式沒有寫死色碼、字級、間距（`design-system`） |
| 沒有捏造的內容 | 產品功能、數據、客戶名稱、認證、獎項都要能指到來源（`content-migration`） |
| 依變更類型套用 skill | 頁面 → `seo-checklist`；搬移內容 → `content-migration`；`.ts`／`.astro`／`.mjs` → `typescript-best-practices`；文件、PR 描述、commit message → `writing-style` |
| 產生檔與 script 一致 | diff 有 script 或它的產出檔時，重跑 script，`git diff --exit-code` 必須沒有差異；再跑一次結果相同 |
| 文件與資料來源一致 | 手寫的表格或清單在描述某個資料檔的某一類列時（例如「不進導覽的節點」對應 `navigation.csv` 的 `none` 列），把兩邊的 ID 各列成一份清單再比對：文件有、資料檔那一類沒有的，以及反過來的，都是發現。ID 只在別的資料檔（例如 `nodes.csv`）存在不算對上。手寫數字要從資料檔重新算一次。script 重跑沒有差異不代表手寫段落正確 |
| `docs/status.md` 寫的是合併後的狀態 | 依 [`issue-ship` 第 3 步](../issue-ship/SKILL.md#3-更新-docsstatusmd)，假設這個 diff 已合併，逐項查：(1) 本 issue 寫成完成（`needs-design` 階段一寫中間狀態），寫「待合併」也是發現 (2) 其他還沒合併的 PR 沒有寫成完成 (3) 列出的 issue 已關閉、PR 已合併的寫成完成 (4)「下一步」沒有留著本 issue 的項目；寫「可以開始」的 issue，依賴在合併後確實都已關閉。(2)–(4) 用 `mcp__github__issue_read`／`pull_request_read` 查 |
| 同一個決定只放在一個地方 | 同一份清單、數字、規則不得在兩個檔案各寫一份；第二份改為連結 |
| devex 沒有被破壞 | 環境變數名稱、npm scripts、`.nvmrc`、SessionStart hook 有變動時，`docs/onboarding.md` 或 `docs/workflow.md` 有同步更新 |

## 5. 程式碼變更

diff 有動到 `src/`、`scripts/`、`.github/` 或設定檔時，執行內建的 `/code-review`；審查對象是 PR 時傳入 PR 編號。動到表單、Pages Functions、`_headers`、secrets 讀取時，另外執行 `/security-review`。

兩者的發現與第 3、4 步的發現合併，一起依第 6 步分類。

## 6. 分類

每個發現歸入一類，附一行理由：

| 類別 | 意義 | 處理 |
|---|---|---|
| Act on | 影響正確性、安全或可維護性，真的會擋下 PR | 必須修正才能合併 |
| Consider | 合理，但不確定值得現在處理 | 寫進 PR 的「待確認」 |
| Noted | 正確但現階段不需處理 | 不列出 |
| Dismissed | 錯誤、吹毛求疵或缺乏脈絡 | 不列出 |

判斷時：
- 假設情境要追到真實的呼叫端或輸入才算數；型別或上游驗證已擋住的就 dismiss
- 「我會換個寫法」不是問題，除非能指出目前寫法的具體缺陷
- 安全與正確性的發現即使只有一個來源，也要多查一次再決定
- 沒有實質發現就直說沒有，不要湊數

## 7. 輸出

在對話中輸出一段可直接貼到 PR 的 markdown，依 `writing-style`：

```markdown
## Review

<一句結論：可以合併，或有幾項 Act on 要先修>

### Act on
- `<檔案>:<行>`：<問題>。<一行理由或反例>

### Consider
- `<檔案>:<行>`：<問題>。<一行理由>
```

- 沒有的類別整段省略；完全沒有發現時只寫結論
- 不列 Noted 與 Dismissed

使用者明確要求留言時，用 `mcp__github__add_issue_comment` 在 PR 發一則留言，內容同上，結尾附系統指示要求的 attribution footer。只發一則，不逐行留 review comment。
