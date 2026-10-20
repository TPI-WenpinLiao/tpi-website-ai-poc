# 專案狀態

最後更新：2026-10-20

## 目前 milestone

**M1 盤點與研究**（進行中）

## 進度

| Milestone | 狀態 |
|---|---|
| M0 基礎建設 | 完成：PR #1 已合併；bootstrap 已執行（10 labels、8 milestones、44 issues） |
| M1 盤點與研究 | 進行中：M1-01 現站內容盤點完成（#2，PR #46）；雲端 session 品質關卡修正（#47，PR #48，已驗證新 session 不需手動設定即可通過 `npm run check`）；M1-02 內容稽核完成（#3）；M1-03 SEO 基線完成（#4）；M1-04 功能盤點完成（#5）；M1-05 受眾與轉換目標：現況與問題清單已整理，待業務／行銷回覆（#6） |
| M2 資訊架構 | 未開始 |
| M3 設計系統 | 未開始 |
| M4 開發骨架 | 未開始 |
| M5 內容遷移 | 未開始 |
| M6 功能 | 未開始 |
| M7 多語系 | 未開始 |
| M8 驗收 | 未開始 |

## 下一步

1. Review M1-02 稽核結果，回覆 `docs/research/content-audit.md`「需人工決定的項目」
2. Review M1-03 SEO 基線（`docs/research/seo-baseline.md`）
3. Review M1-04 功能盤點（`docs/research/features.md`），向後端負責人與行銷確認文末「待確認」
4. 請業務與行銷回答 `docs/research/audience-and-goals.md`「待回答問題」，回覆後補進該檔並完成 #6
5. 依序處理 M1 其餘 issue（以 `/next-issue` 找出可開始的 issue）

## 待辦備忘

- M1-03 沒有流量與外部連結資料（無 GA4／Search Console 權限），重要頁面無法依流量排序；M2 的 redirect 對照要涵蓋所有 `keep`／`rewrite`／`merge` 頁面，不能只做 P1／P2。.com origin 層級的 field CWV 尚未取得
- Node 26 預計 2026-10-28 進入 Active LTS，屆時將 `.nvmrc` 升為 `26`（同步 Cloudflare Pages 的 `NODE_VERSION`）；雲端 session 的 SessionStart hook 會自動依 `.nvmrc` 切換
- 現站 `/sitemap.xml` 與 `/ja` 回 500，盤點改以導覽與連結爬取為準（見 `docs/research/inventory.md`）
- M1-02 稽核的 M2 待決事項（不在導覽的產品是否仍銷售、主題重疊頁面是否合併、舊 `/solutions/*` 路由、blog 分類）見 `docs/research/content-audit.md`
- 工作流程 skills：`/issue-start`、`/issue-ship`、`/next-issue`，使用說明見 `docs/workflow.md`（#50）
- 已從 pstack 導入 `typescript-best-practices`、`writing-style`、`CLAUDE.md` 工作原則、`/issue-ship` 自我 review（#50）。pstack 的 `create-verification-skill`（以 Playwright 實際操作網站並留存證據）待 M4-05（#24）品質關卡擴充時評估
- 待 M2 決定：新站是否支援日文版。現站 `/ja`、`/ja/partners` 回 500，日文版目前只有這兩個路由（M1-01 盤點，#2）
- M1-04：表單建議沿用現站 `/tpi/api/*` 後端，需後端開放新站網域的 CORS 並確認 reCAPTCHA 設定；GTM 等追蹤碼由新站重新規劃，不沿用現站 4 個容器；.com 站內搜尋 API 目前回 500（見 `docs/research/features.md`）
- 正式網域未定；`astro.config.mjs` 的 `site` 目前以 `SITE_URL` 環境變數覆寫，預設 `https://tpi-website-ai-poc.pages.dev`
