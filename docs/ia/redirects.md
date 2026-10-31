# 舊站轉址對照（M2-05）

現站網址到新站路徑的對照，上線時轉成 Cloudflare Pages `_redirects`。路徑規則依 [ADR 0002](../decisions/0002-url-and-locale.md)，新路徑依 [`sitemap.md`](./sitemap.md) 的節點。

- 對照表：[`redirects.csv`](./redirects.csv)，由 `node scripts/ia/redirects.mjs` 產生，不要手改
- 輸入：[`inventory.csv`](../research/inventory.csv)、[`page-map.csv`](./page-map.csv)、[`nodes.csv`](./nodes.csv)、[`drop-targets.csv`](./drop-targets.csv)、[`redirect-overrides.csv`](./redirect-overrides.csv)
- 改了輸入或重跑 `sitemap.mjs` 後重跑本 script；`npm run check:ia` 會檢查 `redirects.csv` 是不是最新的

## 欄位

| 欄位 | 內容 |
|---|---|
| `from` | 現站網址，`inventory.csv` 的 `url` 原樣（含網域）；最後 3 列是含 `*` 的萬用規則 |
| `to` | 新站路徑 |
| `status` | `301`：要轉址；`200`：路徑不變，不需轉址，轉換時略過 |
| `note` | 依據：`<disposition>：<節點 id>`，drop 列寫找到目標的方式；目標由 `redirect-overrides.csv` 指定的列加上 `（redirect-overrides.csv）` |

列數、`301` 與 `200` 的筆數，以及 `_redirects` 的規則數，看 `node scripts/ia/redirects.mjs` 的輸出。

## 對照規則

keep、rewrite、merge 的列導到 `page-map.csv` 對應節點的路徑，en 加 `/en`、vi 加 `/vi` 前綴：

- 大寫路徑轉小寫，例如 `/products/gadoDIDO` → `/products/gadodido`
- blog 文章 `/blog/{category}/{slug}` → `/blog/{blog_slug}`，`blog_slug` 取自 `page-map.csv`；merge 的文章用合併目標的 slug
- 新聞 `/media-center/{id}` 沿用現站 id；其他集合節點（ESG 顧問、成功案例、下載中繼頁）沿用現站最後一段，依 ADR 0002 正規化
- vi：`www.tpisoftware.vn/*` 與 `www.tpisoftware.com/vn/*` 導到 `/vi/*`
- 下載檔案（`kind` 為 `asset` 的節點）保留原檔路徑，不加語系前綴

節點的頁面在某語系沒有建出時（沒有內容檔、offering 沒有 `downloads`），或 inventory 判錯語系時（現站 `/pdf/` 的 en 法務 PDF 沒有語系前綴，判為 zh-TW），在 [`redirect-overrides.csv`](./redirect-overrides.csv) 指定目標（#137）：

- `url` 是 `inventory.csv` 的 keep、rewrite、merge 列；`unbuilt` 是這一列原本的目標，也就是沒建出的頁面，判錯語系的列留空；`to` 是改轉過去的新站頁面路徑（含語系前綴），可以是其他語系的頁面節點，例如 `/en/privacy`，有沒有建出由 `redirect-targets.mjs` 檢查；`reason` 寫為什麼要覆寫
- 被覆寫的原目標不算新站存在的頁面，drop 列找上層頁時不會找到它
- `url` 重複、不是 keep、rewrite、merge 列、`unbuilt` 不是這一列原本的目標、`to` 不是新站的頁面，或 `reason` 空白時 exit 1
- 頁面之後建出了（例如補了內容檔），刪掉那一列重跑；沒刪的話，`redirect-targets.mjs` 發現 `unbuilt` 已在 `dist/` 建出就會失敗

drop 的列導到同語系最接近的上層頁：

1. 從路徑往上一層一層找，第一個在新站同語系存在的頁面就是目標，例如 `/media-center/123` → `/media-center`
2. 找不到上層頁的，對照寫在 [`drop-targets.csv`](./drop-targets.csv)：`route` 用去掉語系前綴的小寫路徑，可用 `/prefix/*`；`node` 是目標節點 id
3. 兩者都沒有就 exit 1，不會默默導到首頁
4. 日文版不支援，`/ja`、`/ja/*` 一律導到 `/en`

萬用規則接住 inventory 以外的舊網址：`/ja/*` → `/en`、`/vn/*` → `/vi/:splat`、`www.tpisoftware.vn/*` → `/vi/:splat`。

script 另外檢查：

- 每個 inventory `url` 恰好一列
- `to` 是新站同語系存在的頁面，且符合 ADR 0002 的路徑格式
- 產出的 `_redirects` 規則（含萬用規則）不會比對到新站的頁面。Cloudflare Pages 不論檔案是否存在都會套用轉址，比對到新頁面就會蓋掉該頁或形成迴圈
- 數量與長度在 Cloudflare Pages 的上限內：靜態 2,000 筆、動態 100 筆、每行 1,000 字元

`npm run check` 在 build 後另外執行 `node scripts/ia/redirect-targets.mjs`（M8-01）：每一列的 `to`（含 200 列）都要在 `dist/` 建出，也不能又是另一條規則的來源（轉址鏈）；`redirect-overrides.csv` 的 `unbuilt` 在 `dist/` 有建出時也失敗。上面的檢查只看節點，看不到某語系有沒有內容檔、offering 有沒有 `downloads`，沒建出的目標改寫在 `redirect-overrides.csv`。外部節點與 `scripts/seo/links.mjs` 的 `PENDING` 不算錯誤，`PENDING` 的頁面建出後要從清單拿掉。

## 轉成 `_redirects`

```bash
node scripts/ia/redirects.mjs --redirects public/_redirects
```

- 輸出 `www.tpisoftware.com` 的 301 列：靜態規則在前，萬用規則在後（Cloudflare 對同一來源採用最上面一條）
- `www.tpisoftware.vn` 的列不輸出：`_redirects` 不支援網域層級轉址。`.vn` 網域上線後是否保留（ADR 0002「影響」）決定後，用 Cloudflare Bulk Redirects 或 `.vn` 網域自己的設定處理
- 目前不寫進 `public/`。上線時是否部署由 M8-02 launch-readiness（#44）決定

### Cloudflare 的比對方式

#139 在 Cloudflare Pages 的 preview 上實測（2026-10-31，`public/_redirects` 是本 script 的完整產出）：

| 請求 | 結果 | 結論 |
|---|---|---|
| `/products/gadodido`、`/orient-ai` | 200 | 比對區分大小寫，只差大小寫的規則不會比對到目標頁，沒有迴圈 |
| `/products/gadoDIDO`、`/orient-aI` | 301 → 小寫路徑 | 大寫的來源比對得到 |
| `/pdf/%E8%B3%87%E8%A8%8A%E5%AE%89%E5%85%A8%E6%94%BF%E7%AD%96.pdf` | 301 → `/security-policy` | `%` 編碼的來源用編碼後的路徑比對 |
| `/pdf/資訊安全政策.pdf`（curl 送出未編碼的 UTF-8） | 404 | 未編碼的請求比對不到。瀏覽器送出前會先編碼，實際流量不受影響 |

沒有規則時，`/products/gadoDIDO`、`/orient-aI` 在 production 回 404（同一天實測），Cloudflare 找靜態檔也區分大小寫，所以只差大小寫的規則要保留。

`toRedirects` 現有的檢查符合這個結果，不用修改：來源與新頁面路徑完全相同才算比對到。來源取自 `new URL().pathname`，未編碼的非 ASCII 字元會轉成大寫十六進位的 `%` 編碼；inventory 已編碼的網址保留原樣，目前只有 1 條，是大寫。小寫十六進位（`%e8`）的請求沒有實測。

## 待確認

- `www.tpisoftware.vn` 對 `/vn/*` 也回 200，內容與 `/*` 相同（`scripts/inventory/crawl.mjs`）。萬用規則 `www.tpisoftware.vn/*` → `/vi/:splat` 會把 `/vn/products/gadodido` 導到不存在的 `/vi/vn/products/gadodido`。`.vn` 網域的處理方式決定時，先把 `/vn/*` 去掉前綴再轉
