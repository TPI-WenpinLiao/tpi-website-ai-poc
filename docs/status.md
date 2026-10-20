# 專案狀態

最後更新：2026-10-20

## 目前 milestone

**M0 基礎建設**（進行中）

## 進度

| Milestone | 狀態 |
|---|---|
| M0 基礎建設 | 進行中：骨架、品質關卡、雲端 session hook、CLAUDE.md、skills、issue forms、workflows、bootstrap 資料 |
| M1 盤點與研究 | 未開始 |
| M2 資訊架構 | 未開始 |
| M3 設計系統 | 未開始 |
| M4 開發骨架 | 未開始 |
| M5 內容遷移 | 未開始 |
| M6 功能 | 未開始 |
| M7 多語系 | 未開始 |
| M8 驗收 | 未開始 |

## 下一步

1. 合併 M0 PR，完成 `docs/onboarding.md` 的首次設定
2. 手動執行 `bootstrap` workflow，建立 labels、milestones、issues
3. 從 M1-01 開始

## 待辦備忘

- Node 26 預計 2026-10-28 進入 Active LTS，屆時將 `.nvmrc` 升為 `26`（同步 Cloudflare Pages 的 `NODE_VERSION`）
- 正式網域未定；`astro.config.mjs` 的 `site` 目前以 `SITE_URL` 環境變數覆寫，預設 `https://tpi-website-ai-poc.pages.dev`
