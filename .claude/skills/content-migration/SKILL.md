---
name: content-migration
description: 從現站 https://www.tpisoftware.com 擷取、改寫或搬移內容到本專案時使用。規範事實保留、依新 IA 重寫結構、圖片處理與 frontmatter。
---

# Content migration

## 原則

1. **保留事實**：產品名稱、功能、數據、客戶名稱、認證、獎項、日期只能取自現站或使用者提供的資料。不得新增、推測或「潤飾」成更強的說法。
2. **依新 IA 重寫結構**：依 M2 的 sitemap 與內容模型重新組織段落與 heading，不照搬現站版面；文字可改寫以提升可讀性，但語意不可改變。
3. **無法確認就標記**：現站內容疑似過時、互相矛盾或來源不明時，保留原文並在 PR 中列為「待確認」，不要自行判斷。
4. **一頁一來源**：每個內容檔記錄來源 URL，方便 review 時對照。

## 放到哪裡

現站每一頁的去處由 M2 決定，搬移時照表做，不自行判斷：

- 只搬 `inventory.csv` 的 `disposition` 為 `keep`、`rewrite`、`merge` 的頁面。`drop` 不搬，舊網址由 [`redirects.csv`](../../../docs/ia/redirects.csv) 轉址
- [`page-map.csv`](../../../docs/ia/page-map.csv) 的每一列對應一個現站網址，寫出它在新站的節點（`node`）、模板、blog 分類與 `blog_slug`。`merge` 列指向合併目標，內容併入目標的內容檔，`sourceUrl` 寫成陣列
- 新頁的 URL 取 [`nodes.csv`](../../../docs/ia/nodes.csv) 的 `path`，blog 文章取 `blog_slug`，不沿用現站 URL（規則見 [ADR 0002](../../../docs/decisions/0002-url-and-locale.md)）
- 內文裡連到現站的連結，用 `redirects.csv` 的 `from` → `to` 改成新站路徑；對照不到的列為待確認，不要留現站網址

## Frontmatter

每個遷移的內容檔都必須包含下列欄位。各內容類型的完整欄位見 [`docs/ia/content-model.md`](../../../docs/ia/content-model.md)，實際寫法以 M4-01 的 Zod schema 為準：

```yaml
sourceUrl: https://www.tpisoftware.com/...   # 現站原始頁面
migratedAt: 2026-10-20                       # 擷取日期
```

多頁合併、新頁等 `sourceUrl` 的寫法見 [`content-model.md`「遷移追蹤欄位」](../../../docs/ia/content-model.md#遷移追蹤欄位)。

## 圖片

- 下載到 `src/assets/<content-type>/<slug>/`，檔名用小寫 kebab-case 英文
- 用 `astro:assets` 的 `<Image>` / `<Picture>` 輸出，不放 `public/`
- 必須補上描述性 alt（依圖片實際內容撰寫，不寫「圖片」「banner」）
- 低解析度或帶浮水印的圖不直接使用，在 PR 列為待替換
- 客戶 logo、人物照片需確認授權，未確認者列為待確認

## 不搬移的內容

- 追蹤碼、第三方嵌入 script（由 M6 統一處理）
- `disposition` 為 `drop` 的頁面（已失效的活動、過期新聞等，理由見 `disposition_reason`）
- 現站的導覽、頁尾等共用區塊（由 layout 提供）

## 驗收方式

- 抽查內容檔與 `sourceUrl` 對照，事實一致
- `npm run check` 通過
- PR 列出：遷移頁數、略過的頁面與原因、待確認清單
