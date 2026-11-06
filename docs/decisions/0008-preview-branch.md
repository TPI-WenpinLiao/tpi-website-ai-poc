# 0008. preview 只在需要時部署到 `preview` branch

- 狀態：已採用
- 日期：2026-11-06
- issue：#219

## 背景

ADR 0001 選 Cloudflare Pages 的理由之一是 PR preview 自動產生。Pages 專案 `tpi-website-ai-poc` 原本對所有 branch 啟用 Preview deployments：push 到任何 branch 都會 build 一次，包括還沒開 PR 的 `wip:` checkpoint。

Cloudflare Pages Free plan 每月 500 次 build，這個帳號還有其他專案共用額度。雲端 session 每個階段 checkpoint 一次，審查迴圈每輪修正又 push 一次，一張 issue 會 build 好幾次，大多沒有人看。

使用者 2026-11-06 先關閉 Preview deployments，只部署 `main`。只在本機看頁面有幾個缺口：沒辦法用手機真機看、沒辦法給不跑 `npm run dev` 的人一個網址，`_headers`、`_redirects`、Pages Functions 這些 Cloudflare 上才有的行為也要等合併後才測得到。

## 決策

Preview deployments 只建 `preview` 一個 branch（Cloudflare 的 Custom branches，include `preview`），其他 branch 的 push 不 build：

- 需要 preview 時，把 PR head 推到 `preview`，網址固定是 `https://preview.tpi-website-ai-poc.pages.dev`（branch alias）：

  ```bash
  git push --force origin HEAD:preview
  ```

- `preview` 每次都重設成一個 PR 的 head，不合併。合併會讓 `preview` 堆進好幾個 PR 與 `wip:` commit，看到的頁面不等於任何一個 PR，也會一直衝突
- 推 `preview` 的時機只有兩種：`needs-design` 或本身有「## 關卡」段落的 issue，階段一開完 draft PR 時與依設計意見修改後（`issue-ship`「`needs-design` 的兩個階段」）；使用者明確要求時。由 Claude 在 session 裡推，`CLAUDE.md`「雲端 session 工作規則」第 3 條寫明這個例外
- 其他時候在本機看頁面：`npm run dev`，或 `npm run build` 後 `npm run preview`。步驟見 `docs/workflow.md`「看頁面」
- PR body 的「preview 檢查重點」改成「頁面檢查重點」，內容不變：要看哪些頁面、哪些斷點。推了 `preview` 時另外寫推的 commit
- `main` 合併後照樣部署到 `https://tpi-website-ai-poc.pages.dev`

## 不採用的做法

- **GitHub Actions + wrangler，在審查時才部署 preview**：例如 PR 加上 label 才跑 `wrangler pages deploy`。要在 GitHub Actions secrets 存 Cloudflare API token、多一支 workflow 要維護。使用者決定不做
- **PR 加 label，由 workflow 用 `GITHUB_TOKEN` 把 head 推到 `preview`**：不需要 Cloudflare token，但多一支 workflow。使用者選了由 Claude 直接推，只要多一條規則
- **只在本機看**：背景列的缺口
- **對所有 branch 開 Preview deployments**：額度會被沒人看的 `wip:` push 用掉

## 影響

- `preview` 只有一個位置。兩個 PR 同時要看時，後推的蓋掉先推的；看之前對一下 PR body 寫的 commit 與 Cloudflare 部署的 commit
- `preview` 不能設 branch protection，要能 force push
- 本 repo 沒有 `push` 觸發的 workflow（`quality-gate` 只跑 `pull_request`），推 `preview` 不會跑 CI
- `preview` 的網址同樣套用 `public/_headers` 的 `X-Robots-Tag: noindex, nofollow`
- `npm run preview` 是 Astro 的靜態伺服器，不套用 `_headers`、`_redirects`，也不跑 `functions/`。這些行為要在 `preview` 或 `main` 的 `*.pages.dev` 確認
