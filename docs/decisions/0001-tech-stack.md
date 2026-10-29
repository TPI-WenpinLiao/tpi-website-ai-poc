# 0001. 技術棧

- 狀態：已採用
- 日期：2026-10-20

## 背景

官網以內容為主（產品、解決方案、案例、部落格、新聞），需要高 SEO 與效能分數、多語系（zh-TW / en / vi），並且要能讓 Claude 在雲端 session 中穩定實作、讓人工容易 review。

## 決策

| 項目 | 選擇 |
|---|---|
| 框架 | Astro，`output: 'static'`，預設零 client-side JS，需要互動時才加 client JS |
| 語言 | TypeScript strict（`astro/tsconfigs/strict`） |
| 樣式 | CSS custom properties 作為 design tokens；不使用 UI framework 或 utility CSS framework |
| 套件管理 | npm，`package-lock.json` 入版控，CI 與雲端 session 用 `npm ci` |
| Node | `.nvmrc` 固定為目前的 LTS major（2026-10-20 為 24） |
| 部署 | Cloudflare Pages Git integration，只用 `*.pages.dev` 與 PR preview |
| 動態功能 | Cloudflare Pages Functions（M6 表單） |
| 品質關卡 | `astro check` → build → html-validate → Lighthouse CI |
| 搜尋 | Pagefind（M6，靜態索引） |

## 理由

- **Astro static**：內容站不需要 SSR；靜態輸出讓 Lighthouse 分數穩定、部署簡單，content collections + Zod 提供型別安全的內容模型；i18n 路由內建
- **零 JS 預設**：效能預算由架構保證，而不是事後優化
- **CSS custom properties**：沒有 build-time 依賴，tokens 可直接在展示頁呈現；避免 UI framework 的樣式與元件鎖定，讓設計系統由本專案定義
- **npm**：Cloudflare Pages 與雲端 session 原生支援，不需額外設定
- **Cloudflare Pages**：PR preview 自動產生，Pages Functions 可處理表單，`_headers` 可統一加上 `X-Robots-Tag`

## 影響

- 互動寫在元件內的 `<script>`（Astro 打包，不用 `client:*`），加 client JS 時在 PR 中說明理由。M6 定案的寫法見 `CLAUDE.md`「功能模組」
- 不可被收錄的要求以 `_headers` + `robots.txt` 實作；Lighthouse 在本機 dist 副本上執行，需移除 `robots.txt` 才能驗證 SEO（見 `scripts/lhci-prepare.mjs`）
- Node 升級時需同步更新 `.nvmrc` 與 Cloudflare Pages 的 `NODE_VERSION`
