# 公司頁與法務頁

`page` collection（[`content-model.md`「page」](../ia/content-model.md#page公司頁與法務頁)）的內容檔有兩種來源：

| 節點 | 來源 | 產生方式 |
|---|---|---|
| `about`、`partners`、`contact` | 現站網頁 | 手寫內容檔，用 `page-content.mjs` 對照現站 |
| `privacy`、`terms`、`disclaimer`、`security-policy` | 現站 PDF | `legal-pdf.mjs` 轉換，不手改 |

兩支 script 都要連到現站，不在 `npm run check` 裡。搬移規則見 [`content-migration` skill](../../.claude/skills/content-migration/SKILL.md)。

## 手寫的公司頁

據點與電話不寫在頁面內容，放在 `src/content/organization/<locale>.yaml`（`about`、`contact` 與 JSON-LD 都讀這裡）。

改了內容檔後，對照現站：

```bash
node scripts/content/page-content.mjs
```

script 檢查每個語系每個 entry 的 `sections`（標題、段落、卡片的標題與內文）都出現在第一個 `sourceUrl` 的頁面文字裡，比對時忽略空白與標點。`description` 是為 meta 寫的摘要，不檢查。每行輸出一個結果：

- `ok`：找到
- `MISS`：找不到，exit 1。改內容檔，或確認是改寫後登記到 `REWRITTEN`
- `edit`：登記在 `REWRITTEN` 的改寫句，附上由哪些元素組成
- `skip`：登記在 `TRANSLATED` 的翻譯頁（zh-TW `partners` 譯自 en 版，現站 zh-TW 頁是空的）

## 由 PDF 轉換的法務頁

```bash
node scripts/content/legal-pdf.mjs           # 下載 PDF，重寫 4 個內容檔
node scripts/content/legal-pdf.mjs --check   # 不寫檔；內容檔與 PDF 不一致時 exit 1
```

需要 `pdftotext`（poppler-utils）。script 用 `pdftotext -layout` 抽文字，轉成 Markdown：

- 章節標題（`1. …`、`一、…`）轉成 h2，條次標題（`4.1 資訊安全及隱私政策`）轉成 h3
- 換行接回段落；中文與英文對照的段落分開
- 條列符號（`l`、`⮚`）轉成清單，清單項目的英譯留在同一項
- 第一行（文件標題）與頁碼拿掉，標題由 `title` 提供

寫檔前，script 會把內文去掉空白與轉換加上的 Markdown，和 PDF 文字逐字比對，不一致就停下。所以轉換只改換行與結構，不會改到條文。比對不含上面拿掉的行：第一行、只有數字的行（頁碼），以及 `dropFrom` 之後的內容。

`title`、`description` 寫在 script 的 `DOCS`。`effectiveDate` 取 PDF 裡寫的修訂日；PDF 沒寫日期時在 `DOCS` 指定，並用 `dateNote` 寫出來源（目前只有資訊安全政策，取 PDF 的修改時間）。

現站換了 PDF 後重跑一次，用 `git diff` 看條文改了什麼。轉換規則不符時改 script（測試在 `scripts/content/legal-pdf.test.mjs`），不改產出的內容檔。

### 沒有轉換的 PDF

| PDF | 原因 |
|---|---|
| `1-2PrivacyPolicy(en).pdf`、`2-2Use(en).pdf`、`3-2Disclaimer(en).pdf` | 2020 年版，與 2026 年的 zh-TW 版內容不同。zh-TW 的隱私權政策與使用條款已附英譯 |
| `tpisoftware.vn/pdf/1-2PrivacyPolicy(vn).pdf` | 內容是應徵者個資告知（Candidate Privacy Notice），不是網站隱私權政策 |
| 資訊安全政策「七、佐證資料」 | 兩張證書掃描圖，不是文字 |
