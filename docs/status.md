# 專案狀態

最後更新：2026-10-20

## 目前 milestone

**M1 盤點與研究**（進行中）

## 進度

| Milestone | 狀態 |
|---|---|
| M0 基礎建設 | 完成：PR #1 已合併；bootstrap 已執行（10 labels、8 milestones、44 issues） |
| M1 盤點與研究 | 進行中：M1-01 現站內容盤點完成（#2，PR #46）；雲端 session 品質關卡修正（#47，PR #48，已驗證新 session 不需手動設定即可通過 `npm run check`）；M1-02 內容稽核完成（#3） |
| M2 資訊架構 | 未開始 |
| M3 設計系統 | 未開始 |
| M4 開發骨架 | 未開始 |
| M5 內容遷移 | 未開始 |
| M6 功能 | 未開始 |
| M7 多語系 | 未開始 |
| M8 驗收 | 未開始 |

## 下一步

1. Review M1-02 稽核結果，回覆 `docs/research/content-audit.md`「需人工決定的項目」
2. 依序處理 M1 其餘 issue（以 `/next-issue` 找出可開始的 issue）

## 待辦備忘

- Node 26 預計 2026-10-28 進入 Active LTS，屆時將 `.nvmrc` 升為 `26`（同步 Cloudflare Pages 的 `NODE_VERSION`）；雲端 session 的 SessionStart hook 會自動依 `.nvmrc` 切換
- 現站 `/sitemap.xml` 與 `/ja` 回 500，盤點改以導覽與連結爬取為準（見 `docs/research/inventory.md`）
- M1-02 稽核的 M2 待決事項（不在導覽的產品是否仍銷售、主題重疊頁面是否合併、舊 `/solutions/*` 路由、blog 分類）見 `docs/research/content-audit.md`
- 工作流程 skills：`/issue-start`、`/issue-ship`、`/next-issue`，使用說明見 `docs/workflow.md`（#50）
- 已從 pstack 導入 `typescript-best-practices`、`writing-style`、`CLAUDE.md` 工作原則、`/issue-ship` 自我 review（#50）。pstack 的 `create-verification-skill`（以 Playwright 實際操作網站並留存證據）待 M4-05（#24）品質關卡擴充時評估
- 待 M2 決定：新站是否支援日文版。現站 `/ja`、`/ja/partners` 回 500，日文版目前只有這兩個路由（M1-01 盤點，#2）
- 正式網域未定；`astro.config.mjs` 的 `site` 目前以 `SITE_URL` 環境變數覆寫，預設 `https://tpi-website-ai-poc.pages.dev`
