# Onboarding

新成員加入時依序完成。標示「管理員」的步驟只需由 repo / 組織管理員做一次。

## 1. Claude 帳號

1. 向管理員申請 Claude Team / Enterprise 座位，確認可使用 Claude Code
2. 開啟 https://claude.ai/code，確認可以建立雲端 session

## 2. 連接 GitHub

雲端 session 需要 GitHub 存取權才能 clone repo 與 push branch，二選一：

- **Claude GitHub App（建議）**（管理員）：安裝在本 repo。Auto-fix（PR 的 CI / review 自動修正）等功能需要 App
- **`/web-setup`**：在本機 Claude Code 執行，使用本機 `gh` CLI 的 token

確認自己對本 repo 有 push 權限。

## 3. 建立雲端環境 `tpi-website-ai-poc`

在 claude.ai/code 的 environment 設定中建立（Team / Enterprise 也可由管理員在 admin settings 的 Cloud environments 建立 shared environment）：

| 欄位 | 值 |
|---|---|
| 名稱 | `tpi-website-ai-poc`（issue 留言中的連結以此名稱預選環境，名稱必須一致） |
| Network access | **Limited**，勾選 **Allow package managers**（`npm ci` 需要），Allowed domains 加入 `www.tpisoftware.com`、`tpisoftware.com`、`www.tpisoftware.vn`、`tpisoftware.vn`（現站越南文版 `/vn` 轉址到獨立網域） |
| 環境變數 | 目前不需要。不要放任何 secret 或 token |
| Setup script | 目前不需要。依賴安裝由 repo 的 SessionStart hook 處理 |

### SessionStart hook 行為

`.claude/settings.json` 在 `startup` / `resume` 時執行 `scripts/session-start.sh`：

- 只在 `CLAUDE_CODE_REMOTE=true`（雲端）時執行；本機直接略過
- Node 主版號與 `.nvmrc` 不符時，以預裝的 nvm（`/opt/nvm`）安裝並切換，切換失敗時顯示警告，仍以原本的 Node 繼續
- 讓 `npm run check` 的 Lighthouse 可在雲端執行：指定預裝的 Chromium（`CHROME_PATH=/opt/pw-browsers/chromium`），並因以 root 執行而加上 `--no-sandbox`
- 以上設定寫入 `CLAUDE_ENV_FILE`，套用到 session 之後的每個 Bash 指令
- 執行 `npm ci`；`package-lock.json` 與 Node 主版號都未變更時略過重裝
- `npm ci` 失敗時在 transcript 顯示錯誤，並告知 Claude 先回報、不要開始實作
- 多 repo 的雲端 session 不會載入 hook，此時需手動執行：

  ```bash
  . /opt/nvm/nvm.sh --no-use && nvm install && npm ci
  export CHROME_PATH=/opt/pw-browsers/chromium
  export LHCI_COLLECT__SETTINGS__CHROME_FLAGS="--no-sandbox --headless=new"
  ```

## 4. 本機開發（選用）

```bash
nvm use
npm ci
npm run dev
```

推送前執行 `npm run check`（需要本機有 Chrome）。視覺回歸要用 `@playwright/test` 附帶的 Chromium，第一次先執行 `npx playwright install chromium`。baseline 是 Linux 的字型渲染，所以 macOS 與 Windows 上會 skip 視覺回歸，由 CI 比對；Linux 上字型和 CI 不同時會失敗，見 `docs/workflow.md`「視覺回歸」。雲端 session 的容器已經預裝這個 Chromium（`PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`），不用安裝。

## 5. 開始工作

1. 在 GitHub 開 issue（使用 issue form），或挑選既有 issue
2. 點 issue 留言中的「在 Claude Code 開啟」連結，會帶入 prompt、repo 與環境
3. 之後的流程（`/issue-start`、`/issue-ship`、`/next-issue` 與人工確認點）見 [`workflow.md`](./workflow.md)
