# 專案狀態

最後更新：2026-10-20

## 目前 milestone

**M1 盤點與研究**（進行中）

## 進度

| Milestone | 狀態 |
|---|---|
| M0 基礎建設 | 完成：PR #1 已合併；bootstrap 已執行（10 labels、8 milestones、44 issues） |
| M1 盤點與研究 | 進行中：M1-01 現站內容盤點完成（#2，PR #46）；雲端 session 品質關卡修正（#47） |
| M2 資訊架構 | 未開始 |
| M3 設計系統 | 未開始 |
| M4 開發骨架 | 未開始 |
| M5 內容遷移 | 未開始 |
| M6 功能 | 未開始 |
| M7 多語系 | 未開始 |
| M8 驗收 | 未開始 |

## 下一步

1. Review 並合併 #47，之後在新的雲端 session 確認 `npm run check` 不需手動設定即可通過
2. 以 `docs/research/inventory.csv`、`broken-links.csv` 為基礎進行 M1-02 內容稽核
3. 依序處理 M1 其餘 issue

## 待辦備忘

- Node 26 預計 2026-10-28 進入 Active LTS，屆時將 `.nvmrc` 升為 `26`（同步 Cloudflare Pages 的 `NODE_VERSION`）；雲端 session 的 SessionStart hook 會自動依 `.nvmrc` 切換
- 現站 `/sitemap.xml` 與 `/ja` 回 500，盤點改以導覽與連結爬取為準（見 `docs/research/inventory.md`）
- 待 M2 決定：新站是否支援日文版。現站 `/ja`、`/ja/partners` 回 500，日文版目前只有這兩個路由（M1-01 盤點，#2）
- 正式網域未定；`astro.config.mjs` 的 `site` 目前以 `SITE_URL` 環境變數覆寫，預設 `https://tpi-website-ai-poc.pages.dev`
