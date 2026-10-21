# 專案狀態

最後更新：2026-10-21

## 目前 milestone

**M1 盤點與研究**（剩 M1-06 收尾）；M2、M3 進行中

## 進度

| Milestone | 狀態 |
|---|---|
| M0 基礎建設 | 完成 |
| M1 盤點與研究 | 進行中（剩 M1-06 收尾） |
| M2 資訊架構 | 進行中 |
| M3 設計系統 | 進行中 |
| M4 開發骨架 | 未開始 |
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
- 雲端 session 品質關卡修正完成（#47，PR #48），已驗證新 session 不需手動設定即可通過 `npm run check`
- 工作流程 skills 與 pstack 導入完成（#50，PR #51）

### M2 資訊架構

- M2-01 sitemap 與模板對應完成（#8，`ia-approved`）
- M2-02 導覽定案完成（#9，`ia-approved`，PR #60）
- M2-03 URL 規則與語系策略完成（#10，ADR 0002，PR #59）
- M2-04 內容模型完成（#11，PR #61）
- PR 審查 skill `/pr-review` 完成（#62，PR #65）
- `status.md` 改寫合併後的狀態完成（#67）
- 長時間任務的 checkpoint 機制完成（#69，PR #70）
- 自動開發到 PR 完成：審查迴圈與合併判斷摘要完成（#71）
- IA script 接進 `npm run check` 完成（#63）
- `issue-ship` 審查迴圈等目前 head 的 CI、PR body 不預寫 CI 結果完成（#74）
- 導覽第四層節點與 footer 法務位置對齊完成（#64）：法務定為 footer 最底列，`navigation.mjs` 檢查不限深度
- footer 最底列的法務順序改成現站順序完成（#77）：資訊安全政策、隱私權政策、使用條款、免責聲明

### M3 設計系統

- M3-01 wireframe（#14），階段一，等待 wireframe-approved：11 個模板與導覽的 wireframe 在 `/wireframes`；en、vi 選單寬度實測見 `docs/design/nav-fit.md`；第一層 6 項時 en、vi 放不下，「成功案例」改放「資源」底下（三語統一，`navigation.csv` 已改）

## 下一步

- 回覆 `docs/ia/content-model.md` 文末「待確認」，特別是 tag 清單
- M2-05 redirect map（#12）的依賴（#8、#10）都已完成，可以開始；轉址規則依 ADR 0002，blog 文章的新 slug 用 `docs/ia/page-map.csv` 的 `blog_slug` 欄
- Review M3-01 wireframe（preview 的 `/wireframes`），確認後在 #14 加上 `wireframe-approved`
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
- M1-04：表單建議沿用現站 `/tpi/api/*` 後端，需後端開放新站網域的 CORS 並確認 reCAPTCHA 設定；GTM 等追蹤碼由新站重新規劃，不沿用現站 4 個容器；.com 站內搜尋 API 目前回 500（見 `docs/research/features.md`）
- M1-05：主要轉換為聯絡業務；新站只用 GTM、需要 cookie 同意機制、Facebook Pixel 與 Ahrefs 不沿用；成功指標包含自然搜尋流量，但沒有 GA4／Search Console 權限，量測方式待定（見 `docs/research/audience-and-goals.md`）
- M2-04：產品 JSON-LD 定為 `SoftwareApplication`、解決方案與服務為 `Service`（`seo-checklist` 的 JSON-LD 對照改為連到 `content-model.md`）；新頁的 `sourceUrl` 寫 `[]`。blog 作者資料品質、轉載授權、三語版本對應、白皮書檔案位置待確認（見 `docs/ia/content-model.md`「待確認」）
- M2-03：三語系同網域，vi 從 `www.tpisoftware.vn` 改為 `/vi`；`.vn` 網域上線後是否保留為轉址來源，與正式網域一起決定。`og:locale` 的 en、vi 值要改成「語言_地區」格式，M7 處理
- 正式網域未定；`astro.config.mjs` 的 `site` 目前以 `SITE_URL` 環境變數覆寫，預設 `https://tpi-website-ai-poc.pages.dev`
- M3-01 的 wireframe 頁（`src/pages/wireframes/`、`src/components/wireframe/`、`src/layouts/WfLayout.astro`、`src/lib/wireframe/`）在 M4-04 各模板 layout 完成後刪除；`tokens.css` 的 `--wf-*` 由 M3-02 的正式 token 取代。`@media` 不能用 custom property，斷點 64rem 目前以字面值寫在 media query，機制由 M3-02 決定
- `docs/design/nav-fit.md` 的量測依賴容器字型與 wireframe 的暫定間距，M3-02 定字型與 token 後重跑 `node scripts/wireframe/nav-fit.mjs`
