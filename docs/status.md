# 專案狀態

最後更新：2026-10-22

## 目前 milestone

**M3 設計系統**、**M4 開發骨架**；M1 剩 M1-06 收尾（#7）

## 進度

| Milestone | 狀態 |
|---|---|
| M0 基礎建設 | 完成 |
| M1 盤點與研究 | 進行中（剩 M1-06 收尾） |
| M2 資訊架構 | 完成 |
| M3 設計系統 | 進行中 |
| M4 開發骨架 | 進行中 |
| M5 內容遷移 | 未開始 |
| M6 功能 | 未開始 |
| M7 多語系 | 未開始 |
| M8 驗收 | 未開始 |

## Issue

寫法見 [`issue-ship` 第 3 步](../.claude/skills/issue-ship/SKILL.md#3-更新-docsstatusmd)。

### M0 基礎建設

- 基礎建設完成（PR #1）；bootstrap 已執行（10 labels、8 milestones、44 issues）

### M1 盤點與研究

- M1-01 現站內容盤點完成（#2，PR #46）
- M1-02 內容稽核完成（#3）
- M1-03 SEO 基線完成（#4）
- M1-04 功能盤點完成（#5）
- M1-05 受眾與轉換目標完成（#6）
- M1-06 M1 收尾（#7，PR #92），待合併
- 雲端 session 品質關卡修正完成（#47，PR #48），已驗證新 session 不需手動設定即可通過 `npm run check`
- 工作流程 skills 與 pstack 導入完成（#50，PR #51）

### M2 資訊架構

- M2-01 sitemap 與模板對應完成（#8，`ia-approved`）
- M2-02 導覽定案完成（#9，`ia-approved`，PR #60）
- M2-03 URL 規則與語系策略完成（#10，ADR 0002，PR #59）
- M2-04 內容模型完成（#11，PR #61）
- M2-05 舊站 redirect map 完成（#12）：`docs/ia/redirects.csv` 涵蓋 inventory 全部網址，可用 `node scripts/ia/redirects.mjs --redirects <file>` 轉成 `_redirects`
- M2-06 M2 收尾完成（#13，PR #81）：IA 與 URL 規則寫進 `CLAUDE.md`、`seo-checklist`、`content-migration`
- PR 審查 skill `/pr-review` 完成（#62，PR #65）
- `status.md` 改寫合併後的狀態完成（#67）
- 長時間任務的 checkpoint 機制完成（#69，PR #70）
- 自動開發到 PR 完成：審查迴圈與合併判斷摘要完成（#71）
- IA script 接進 `npm run check` 完成（#63）
- `issue-ship` 審查迴圈等目前 head 的 CI、PR body 不預寫 CI 結果完成（#74）
- 導覽第四層節點與 footer 法務位置對齊完成（#64）：法務定為 footer 最底列，`navigation.mjs` 檢查不限深度
- footer 最底列的法務順序改成現站順序完成（#77）：資訊安全政策、隱私權政策、使用條款、免責聲明

### M3 設計系統

- M3-01 各模板低保真 wireframe 完成（#14，`wireframe-approved`）：11 個模板與導覽的 wireframe 在 `/wireframes`；en、vi 選單寬度實測見 `docs/design/nav-fit.md`；第一層 6 項時 vi 與 en 長譯名放不下，「成功案例」改放「資源」底下（三語統一，`navigation.csv` 已改）
- M3-02 design tokens 與元件庫完成（#15，`design-approved`）：深色場景與亮色閱讀頁的雙 surface、光與景深、捲動動態、12 個元件與 `/design-system` 審核頁；影像素材與提示詞見 `docs/design/image-prompts.md`
- M3-03 design-system 展示頁完成（#16，`design-approved`）：`/design-system` 列出全部 152 個 token（三層分組）與 5 個互動元件的狀態矩陣；全域改為 `box-sizing: border-box`
- M3-04 首頁高保真（#17，PR #93），階段一，等待 design-approved
- M3-07 3D scroll 視覺方向原型完成（#54，`design-approved`）：選定方向 B Modular Stack，原型頁 `/prototypes/modular-stack`（three.js，`Scene3D` island），A Data Flow 已刪除；ADR 0003 載入策略；`node scripts/design/lighthouse-3d.mjs` 行動版 0.99、桌機 1，`a11y-smoke.mjs` 加上 3D 場景上的文字對比
- `issues.yml` 與 GitHub issue 對齊完成（#88）：補 M3-07～09、M3-04/05 的依賴改為 M3-02、M3-07；`node scripts/bootstrap/diff.mjs` 比對兩邊，目前差異 0、重跑 bootstrap 不會新建 issue
- `needs-design` 階段一改走 `/issue-ship` 完成（#84）：`CLAUDE.md`、`issue-start`、`checkpoint`、`workflow.md` 都連到 `issue-ship` 的「`needs-design` 的兩個階段」，`wip:` 合併只寫在 `issue-ship` 第 4 步。#16 留在 `main` 的 `wip:` commit（`1b3a5fe`、`a2508f8`）不改寫

### M4 開發骨架

- M4-01 content collections 與 Zod schema 完成（#20）：`src/content.config.ts` 定義 9 個內容類型與 `tag`，每個 collection 一筆 zh-TW 範例；不合法的 frontmatter（含不存在的 `ref`）讓 `astro check` 與 build 失敗；tag 清單由 `node scripts/content/tags.mjs` 產生。寫法見 `docs/ia/content-model.md`「Astro 實作」
- M4-02 i18n 路由（#21，PR #90），待合併

## 下一步

- M3-05 產品頁高保真（#18）可以開始，以 3D 方向 B Modular Stack 製作
- M3-08 動態規範（#55）可以開始
- [chore] LHCI 涵蓋所有頁面（#87）可以開始
- M5-04 部落格與新聞批次轉換 script（#29）可以開始
- 回覆 `docs/ia/content-model.md` 文末「待確認」，特別是 tag 清單（`src/content/tags.yaml` 的名稱目前取自現站）
- M4 部署 `_redirects` 時實測 Cloudflare Pages 比對來源路徑是否區分大小寫、`%` 編碼怎麼比對（見 `docs/ia/redirects.md`「待確認」）
- Review M1-02 稽核結果，回覆 `docs/research/content-audit.md`「內容負責人要確認」
- Review M1-03 SEO 基線（`docs/research/seo-baseline.md`）
- Review M1-04 功能盤點（`docs/research/features.md`），向後端負責人與行銷確認文末「待確認」
- 回答 `docs/research/audience-and-goals.md`「尚未回答的問題」其餘 6 題（第 2、5 題已在 M2-01 暫定）
- 以 `/next-issue` 找出下一張可開始的 issue

## 待辦備忘

- M1-03 沒有流量與外部連結資料（無 GA4／Search Console 權限），重要頁面無法依流量排序；M2 的 redirect 對照要涵蓋所有 `keep`／`rewrite`／`merge` 頁面，不能只做 P1／P2。.com origin 層級的 field CWV 尚未取得
- Node 26 預計 2026-10-28 進入 Active LTS，屆時將 `.nvmrc` 升為 `26`（同步 Cloudflare Pages 的 `NODE_VERSION`）；雲端 session 的 SessionStart hook 會自動依 `.nvmrc` 切換
- 現站 `/sitemap.xml` 與 `/ja` 回 500，盤點改以導覽與連結爬取為準（見 `docs/research/inventory.md`）
- M1-02 稽核的 M2 待決事項（日文版、不在導覽的產品、主題重疊頁面、舊 `/solutions/*` 路由、blog 分類）已在 M2-01 依推薦決定，見 `docs/ia/sitemap.md`「決策紀錄」；不在導覽的 6 個產品／方案是否仍銷售，M5 前需內容負責人確認
- 工作流程 skills：`/issue-start`、`/checkpoint`、`/issue-ship`、`/pr-review`、`/next-issue`，使用說明見 `docs/workflow.md`（#50、#62、#69、#71）。沒有 `needs-design`、`needs-input`，計畫也沒有待決事項的 issue 走自動模式，人工只負責啟動、回覆 `needs-decision`、看合併判斷摘要後合併。專案固定檢查只寫在 `.claude/skills/pr-review/SKILL.md`
- 已從 pstack 導入 `typescript-best-practices`、`writing-style`、`CLAUDE.md` 工作原則、`/issue-ship` 自我 review（#50，#62 移到 `/pr-review`）。pstack 的 `create-verification-skill`（以 Playwright 實際操作網站並留存證據）待 M4-05（#24）品質關卡擴充時評估
- 日文版：M2-01 決定不支援，M2-05 將 `/ja/*` 301 到 `/en`（現站 `/ja`、`/ja/partners` 回 500）
- M2-05：`www.tpisoftware.vn` 的轉址不能放進 `_redirects`（不支援網域層級），`.vn` 網域去留決定後改用 Bulk Redirects 等方式處理
- M1-04：表單建議沿用現站 `/tpi/api/*` 後端，需後端開放新站網域的 CORS 並確認 reCAPTCHA 設定；GTM 等追蹤碼由新站重新規劃，不沿用現站 4 個容器；.com 站內搜尋 API 目前回 500（見 `docs/research/features.md`）
- M1-05：主要轉換為聯絡業務；新站只用 GTM、需要 cookie 同意機制、Facebook Pixel 與 Ahrefs 不沿用；成功指標包含自然搜尋流量，但沒有 GA4／Search Console 權限，量測方式待定（見 `docs/research/audience-and-goals.md`）
- M2-04：產品 JSON-LD 定為 `SoftwareApplication`、解決方案與服務為 `Service`（`seo-checklist` 的 JSON-LD 對照改為連到 `content-model.md`）；新頁的 `sourceUrl` 寫 `[]`。blog 作者資料品質、轉載授權、三語版本對應、白皮書檔案位置待確認（見 `docs/ia/content-model.md`「待確認」）
- M2-03：三語系同網域，vi 從 `www.tpisoftware.vn` 改為 `/vi`；`.vn` 網域上線後是否保留為轉址來源，與正式網域一起決定。`og:locale` 的 en、vi 值要改成「語言_地區」格式，M7 處理
- 正式網域未定；`astro.config.mjs` 的 `site` 目前以 `SITE_URL` 環境變數覆寫，預設 `https://tpi-website-ai-poc.pages.dev`
- M3-01 的 wireframe 頁（`src/pages/wireframes/`、`src/components/wireframe/`、`src/layouts/WfLayout.astro`、`src/lib/wireframe/`）在 M4-04 各模板 layout 完成後刪除，`tokens.css` 的 `--wf-*` 也一起刪。M3-02 起斷點寫在 `src/styles/media.css` 的 `@custom-media`，wireframe 的 media query 已改用
- M3-02 改為深色場景＋亮色閱讀頁的雙 surface，3D 共用視角寫在 `tokens.css` 的 `--scene-angle-*`、`--perspective`；M3-07（#54）的 three.js 相機已從這兩個值換算（`src/lib/scene/runtime.ts`），方向 B 專屬的細節（方塊材質、邊緣光）在 M3-04 補進 tokens
- M3-07 的原型頁（`src/pages/prototypes/modular-stack.astro`）在 M3-04 把場景做成正式首頁後刪除；`scene-capture.mjs`、`lighthouse-3d.mjs` 的預設路徑與 `showcase.mjs` 的 `/prototypes` 一起改
- M4-03（#22）加 sitemap 時排除 `/design-system`、`/wireframes`、`/prototypes`，做法見 `design-system` skill「展示頁」
- `npm run check` 的 LHCI 用 `staticDistDir` 自動探索，只測前 5 個 URL（M3-07 時 build 出 16 頁只測 5 頁），其餘頁面沒有 Lighthouse 關卡，由 #87 處理
- blog 封面圖放在 `tpi.dev`，雲端 session 的網路政策擋下（proxy 403）。M4-01 的 blog 範例暫用 `src/assets/design/cover-platform.webp`；M5-04 下載封面前要把 `tpi.dev` 加進環境的 Allowed domains，或改在本機執行
- `docs/design/nav-fit.md` 的量測用容器字型與 wireframe 的間距（`--wf-space-3` 仍是 12px），M3-02 後 `node scripts/wireframe/nav-fit.mjs --check` 仍通過；正式 header（M4-04）的選單間距與 Inter 字型要另外實測
