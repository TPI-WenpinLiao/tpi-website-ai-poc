# 舊站轉址對照（M2-05）

現站網址到新站路徑的對照，上線時轉成 Cloudflare Pages `_redirects`。路徑規則依 [ADR 0002](../decisions/0002-url-and-locale.md)，新路徑依 [`sitemap.md`](./sitemap.md) 的節點。

- 對照表：[`redirects.csv`](./redirects.csv)，由 `node scripts/ia/redirects.mjs` 產生，不要手改
- 輸入：[`inventory.csv`](../research/inventory.csv)、[`page-map.csv`](./page-map.csv)、[`nodes.csv`](./nodes.csv)、[`drop-targets.csv`](./drop-targets.csv)
- 改了輸入或重跑 `sitemap.mjs` 後重跑本 script；`npm run check:ia` 會檢查 `redirects.csv` 是不是最新的

## 欄位

| 欄位 | 內容 |
|---|---|
| `from` | 現站網址，`inventory.csv` 的 `url` 原樣（含網域）；最後 3 列是含 `*` 的萬用規則 |
| `to` | 新站路徑 |
| `status` | `301`：要轉址；`200`：路徑不變，不需轉址，轉換時略過 |
| `note` | 依據：`<disposition>：<節點 id>`，drop 列寫找到目標的方式 |

目前 1,309 列：inventory 1,306 列加 3 列萬用規則，其中 1,086 列 `301`、223 列 `200`（`node scripts/ia/redirects.mjs` 的輸出）。

## 對照規則

keep、rewrite、merge 的列導到 `page-map.csv` 對應節點的路徑，en 加 `/en`、vi 加 `/vi` 前綴：

- 大寫路徑轉小寫，例如 `/products/gadoDIDO` → `/products/gadodido`
- blog 文章 `/blog/{category}/{slug}` → `/blog/{blog_slug}`，`blog_slug` 取自 `page-map.csv`；merge 的文章用合併目標的 slug
- 新聞 `/media-center/{id}` 沿用現站 id；其他集合節點（ESG 顧問、成功案例、下載中繼頁）沿用現站最後一段，依 ADR 0002 正規化
- vi：`www.tpisoftware.vn/*` 與 `www.tpisoftware.com/vn/*` 導到 `/vi/*`
- 下載檔案（`kind` 為 `asset` 的節點）保留原檔路徑，不加語系前綴

drop 的列導到同語系最接近的上層頁：

1. 從路徑往上一層一層找，第一個在新站同語系存在的頁面就是目標，例如 `/media-center/123` → `/media-center`
2. 找不到上層頁的，寫在 `drop-targets.csv`（`route` 用去掉語系前綴的小寫路徑，可用 `/prefix/*`）：`/epaper/*` → 電子報訂閱 `/subscribe`，`/2023tpiday`、`/2024tpiday` → 活動 `/events`
3. 兩者都沒有就 exit 1，不會默默導到首頁
4. 日文版不支援，`/ja`、`/ja/*` 一律導到 `/en`

萬用規則接住 inventory 以外的舊網址：`/ja/*` → `/en`、`/vn/*` → `/vi/:splat`、`www.tpisoftware.vn/*` → `/vi/:splat`。

script 另外檢查：

- 每個 inventory `url` 恰好一列
- `to` 是新站同語系存在的頁面，且符合 ADR 0002 的路徑格式
- 301 的來源不是新站的頁面。Cloudflare Pages 不論檔案是否存在都會套用轉址，來源等於新頁面就會蓋掉該頁或形成迴圈
- 數量與長度在 Cloudflare Pages 的上限內：靜態 2,000 筆、動態 100 筆、每行 1,000 字元

## 轉成 `_redirects`

```bash
node scripts/ia/redirects.mjs --redirects public/_redirects
```

- 輸出 `www.tpisoftware.com` 的 301 列：靜態規則在前，萬用規則在後（Cloudflare 對同一來源採用最上面一條）。目前 686 筆靜態、2 筆動態
- `www.tpisoftware.vn` 的 398 列不輸出：`_redirects` 不支援網域層級轉址。`.vn` 網域上線後是否保留（ADR 0002「影響」）決定後，用 Cloudflare Bulk Redirects 或 `.vn` 網域自己的設定處理
- 新路由在 M4 才建立，目前不寫進 `public/`

## 待確認

- Cloudflare Pages `_redirects` 比對來源路徑是否區分大小寫，官方文件沒有寫。不區分的話，`/products/gadoDIDO /products/gadodido 301` 這類規則會變成迴圈。M4 部署 `_redirects` 時在 preview 實測
- 含 `%` 編碼的來源（例如 `/pdf/%E8%B3%87%E8%A8%8A%E5%AE%89%E5%85%A8%E6%94%BF%E7%AD%96.pdf`）在 `_redirects` 是用編碼前還是編碼後的路徑比對，同上一起實測
