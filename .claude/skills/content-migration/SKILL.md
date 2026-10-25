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

- 只搬 [`inventory.csv`](../../../docs/research/inventory.csv) 的 `disposition` 為 `keep`、`rewrite`、`merge` 的頁面（`drop` 見「不搬移的內容」）
- [`page-map.csv`](../../../docs/ia/page-map.csv) 的每一列對應一個現站網址，寫出它在新站的節點（`node`）、模板、blog 分類與 `blog_slug`。`merge` 列指向合併目標，內容併入目標的內容檔，`sourceUrl` 寫成陣列
- 新頁的 URL 取 [`nodes.csv`](../../../docs/ia/nodes.csv) 的 `path`，blog 文章取 `blog_slug`，不沿用現站 URL（規則見 [ADR 0002](../../../docs/decisions/0002-url-and-locale.md)）
- 內文裡連到現站的連結，用 `redirects.csv` 的 `from` → `to` 改成新站路徑；對照不到的列為待確認，不要留現站網址
- 內文裡的失效連結列在 [`broken-links.csv`](../../../docs/research/broken-links.csv)（`found_on` 是所在頁面），依 [`content-audit.md`「失效連結」](../../../docs/research/content-audit.md#失效連結)的類型修正或移除

## 依內容類型選工具

能用 script 轉換的類型用 script，人工修正寫進對應的 overrides 檔，不直接改產出檔；手寫的類型也要用 script 對照現站。

| 內容 | 產生方式 | 人工修正寫在 | 說明 |
|---|---|---|---|
| blog、新聞 | `node scripts/content/migrate/migrate.mjs` | `scripts/content/migrate/overrides.yaml`（alt、description、`authorType`、`dropImagesFrom`） | [`migration.md`](../../../docs/content/migration.md) |
| 成功案例 | `node scripts/content/migrate/case-studies.mjs` | `scripts/content/migrate/case-studies.yaml`（客戶名稱、zh-TW description） | [`migration.md`「成功案例」](../../../docs/content/migration.md#成功案例) |
| 解決方案頁（`page_type` 為 `solution`）、`orient-ai`、`aiso` | `node scripts/content/migrate/offerings.mjs` | `scripts/content/migrate/offering-overrides.yaml` | [`migration.md`「解決方案頁」](../../../docs/content/migration.md#解決方案頁) |
| ESG 顧問服務頁與顧問頁 | `node scripts/content/migrate/esg-advisory.mjs` | `scripts/content/migrate/esg-advisory-overrides.yaml` | [`migration.md`「ESG 顧問服務」](../../../docs/content/migration.md#esg-顧問服務) |
| 產品頁、產品 hub | 手寫，`node scripts/design/offering-content.mjs` 對照現站；下載檔用 `node scripts/content/offering-files.mjs` | 內容檔本身；有意修正的現站錯字登記在 `offering-content.mjs` 的 `CORRECTIONS` | [`products.md`](../../../docs/content/products.md) |
| 關於我們、聯絡我們、合作夥伴 | 手寫，`node scripts/content/page-content.mjs` 對照現站 | 內容檔本身；改寫句登記在 `page-content.mjs` 的 `REWRITTEN`，翻譯頁登記在 `TRANSLATED` | [`company-pages.md`](../../../docs/content/company-pages.md) |
| 法務頁 | `node scripts/content/legal-pdf.mjs` 從現站 PDF 轉換，寫檔前逐字比對 | script 的 `DOCS` | [`company-pages.md`「由 PDF 轉換的法務頁」](../../../docs/content/company-pages.md#由-pdf-轉換的法務頁) |

新的內容類型要搬時，同樣先寫成 script（[`CLAUDE.md`「工作原則」](../../../CLAUDE.md#工作原則)）。對照現站的 script 都要連到現站，不在 `npm run check` 裡，改了內容檔就重跑，結果寫進 PR。

## schema 沒有欄位的段落不搬

預設只填 [`content.config.ts`](../../../src/content.config.ts) 既有的欄位，不為了放下某一段而改 schema 或模板（M5-01、M5-02、#106）。要改時寫進計畫或 PR，由使用者確認，例如 M5-03 依使用者決定把 case-study 的 `challenge` 等欄位改成選填並加上 `order`，#107 在 PR 裡為顧問列表加上 `person.order` 與 `OfferingTemplate` 的段落。沒搬的段落逐頁寫進該類型的說明文件（例如 [`products.md`「待確認」](../../../docs/content/products.md#待確認)），並列進 PR 的待確認，由內容負責人決定刪減或另開 issue 擴充 content model。

## 搬移前先看稽核結果

- 該頁在 `inventory.csv` 的 `to_confirm` 有值時（未翻譯、title 錯誤、授權未確認等），照抄進 PR 的待確認，處理方式見 [`content-audit.md`「內容負責人要確認」](../../../docs/research/content-audit.md#內容負責人要確認)
- blog 文章與新聞的內文在 client 端渲染，不在 SSR 的 DOM 裡：blog 內文取自 SSR HTML 中 Nuxt payload（`window.__NUXT__`）的 `content` 字串，新聞內文取自新聞 API 的 `htmlpath` 對應的 `/file{htmlpath}`，見 [`inventory.md`「已知限制」](../../../docs/research/inventory.md#已知限制)
- 新聞的 `publishedAt` 來源見 [`content-model.md`](../../../docs/ia/content-model.md) 的新聞欄位表。blog 與新聞只遷移 2026-01-01 起的文章（M5-05 由使用者決定，規則在 `scripts/inventory/audit.mjs`）。新聞依 `inventory.csv` 的 `last_updated`（API 的 `updateDate`，是後台編輯時間）判斷，發布日早於門檻的在 `audit-overrides.csv` 改為 drop，`migrate.mjs` 的報告也會標出，見 [`content-audit.md`「已知限制」](../../../docs/research/content-audit.md#已知限制)

## Frontmatter

每個遷移的內容檔都必須包含下列欄位。各內容類型的完整欄位見 [`docs/ia/content-model.md`](../../../docs/ia/content-model.md)，實際寫法以 [`src/content.config.ts`](../../../src/content.config.ts) 為準，內容檔位置與 `ref` 的寫法見 [`content-model.md`「Astro 實作」](../../../docs/ia/content-model.md#astro-實作m4-01)：

```yaml
sourceUrl: https://www.tpisoftware.com/...   # 現站原始頁面
migratedAt: 2026-10-20                       # 擷取日期
```

多頁合併、新頁等 `sourceUrl` 的寫法見 [`content-model.md`「遷移追蹤欄位」](../../../docs/ia/content-model.md#遷移追蹤欄位)。

## 圖片

- 下載到 `src/assets/<content-type>/<locale>/<slug>/`（不同語系可能有相同 slug），檔名用小寫 kebab-case 英文；frontmatter 寫相對於內容檔的路徑（`coverImage: ../../../assets/news/zh-TW/585/cover.webp`）。內文引用外部網域的圖片（`blog.tpisoftware.com`、`tpi.dev`、`s3.amazonaws.com` 等）也一樣下載，不直接引用外部網址（[`features.md`「其他第三方嵌入」](../../../docs/research/features.md#其他第三方嵌入)）
- 存檔前的縮圖與壓縮規則見 [`docs/content/migration.md`「圖片」](../../../docs/content/migration.md#圖片)
- 用 `astro:assets` 的 `<Image>` / `<Picture>` 輸出，不放 `public/`
- 必須補上描述性 alt（依圖片實際內容撰寫，不寫「圖片」「banner」）
- 低解析度或帶浮水印的圖不直接使用，在 PR 列為待替換
- 客戶 logo、人物照片需確認授權，未確認者列為待確認。產品 banner 的圖庫照（M5-01）與顧問個人照（#107）在授權確認前不放；blog 與新聞內文裡的人物照保留，列為待確認（M5-05）；客戶名稱與 logo 依使用者決定照現站顯示（M5-03）
- offering 與 hub 的 `heroImage` 只拿來當 `og:image`，不裁切，寬高比不符的 banner 不填，見 [`migration.md`「解決方案頁」](../../../docs/content/migration.md#解決方案頁)
- 雲端 session 的 network policy 可能擋下部分圖片網域。下載失敗的文章不寫入，列進 PR，不改成引用外部網址

## 多語系內容

zh-TW、en、vi 都已上線（M7）。頁面只對有字串檔（`src/data/strings/<locale>.ts`）與首頁文案（`src/data/home/<locale>.ts`）的語系產生，加上這兩個檔就啟用該語系，不用改共用檔案（#114）。聯絡頁與產品頁另外要有該語系的公司資料 `src/content/organization/<locale>.yaml`，沒有時 build 失敗。改了 layout、元件或 `src/lib/ia/` 這些共用的部分後，用 `node scripts/i18n/locale-fixture.mjs <en|vi> --no-content` 確認 en、vi 頁面沒有漏翻的 zh-TW 文字（會再 build 一次，不在 `npm run check` 裡）。

### 內容從哪裡來

依序選第一個有的來源：

1. 現站有該語系的頁面：照搬，與 zh-TW 用同一個轉換或對照 script（上方「依內容類型選工具」）。現站 en、vi 的錯字照抄，要改時登記成有意修正（例如 `offering-content.mjs` 的 `CORRECTIONS`）
2. 現站只有其他語系：從那個語系翻譯，登記在對照 script 的 `TRANSLATED`（`offering-content.mjs`、`page-content.mjs`），對照時跳過，並在 PR 列為待確認。例如 vi 的 6 個產品頁與 2 個 hub 從 zh-TW 翻譯（M7-03）、zh-TW 合作夥伴頁從 en 翻譯（M5-06）
3. 都沒有，或內容過時、對不上：不產生該語系的頁面，連結會改連到 zh-TW 版（ADR 0002「缺翻譯的頁面」）。目前 vi 沒有法務頁，en 沒有免責聲明、資訊安全政策與現站 en 沒有的產品頁（[`company-pages.md`「沒有轉換的 PDF」](../../../docs/content/company-pages.md#沒有轉換的-pdf)、`docs/status.md` 的 M7-02）

### 用語與標點

- 產品名、頁面名稱、選單標籤與介面字串以 [`docs/i18n/glossary.csv`](../../../docs/i18n/glossary.csv) 為準，規則與確認流程見 [`glossary.md`](../../../docs/i18n/glossary.md)。詞彙表沒有的專有名詞，暫譯列進 `glossary.md` 的待確認表，不要每頁各自翻
- 轉換 script 寫 en、vi 時用 `latinPunctuation`（`scripts/content/migrate/migrate.mjs`）把全形標點換成半形。`node scripts/i18n/routes.mjs` 擋下 en、vi 頁面上的漢字與全形標點，`lang="zh-TW"` 的元素除外
- 同一份內容的各語系版本填相同的 `translationKey`，hreflang 與語系切換靠它對應，慣例見 [`content-model.md`「共用欄位」](../../../docs/ia/content-model.md#共用欄位)。blog 的現站 API 沒有跨語系對應，各語系目前各自獨立

### 修正寫在哪裡

en、vi 的 description、`seoTitle`、內文圖 alt 與 zh-TW 一樣寫進該類型的 overrides 檔（`overrides.yaml`、`case-studies.yaml`、`offering-overrides.yaml`、`esg-advisory-overrides.yaml`），重跑 script，不改產出的內容檔。長度上限：description zh-TW 80 字、en 與 vi 160 字元；`<title>` 加上後綴後 70 字元，以 HTML 跳脫後的長度計算，超過時寫 `seoTitle`（`scripts/content/migrate/frontmatter.mjs` 的報告會標出）。

### 改了 zh-TW 之後

- 改了內容檔的事實（產品功能、數字、聯絡資訊等）時，同一個 `translationKey` 的 en、vi 檔一起改；不確定譯法時照改事實，譯文列進 PR 的待確認
- 改了 `docs/ia/nodes.csv`、`navigation.csv` 或 `src/data/strings/zh-TW.ts` 時重跑 `node scripts/i18n/glossary.mjs`，新列與 zh-TW 改過的列是 `to-confirm`，補上 en、vi 後照抄進 `en.ts`、`vi.ts`（`glossary.mjs` 檢查兩邊一致）。節點與選單標籤沒有 en、vi 譯名時 build 失敗

## 不搬移的內容

- 追蹤碼、第三方嵌入 script（由 M6 統一處理）
- `disposition` 為 `drop` 的頁面（已失效的活動、過期新聞等，理由見 `disposition_reason`），舊網址由 [`redirects.csv`](../../../docs/ia/redirects.csv) 轉址
- 現站的導覽、頁尾等共用區塊（由 layout 提供）

## 驗收方式

- 抽查內容檔與 `sourceUrl` 對照，事實一致
- `npm run check` 通過
- PR 列出：遷移頁數、略過的頁面與原因、待確認清單
