# 內容的批次轉換

blog 與新聞見以下各節；成功案例見[「成功案例」](#成功案例)，解決方案頁見[「解決方案頁」](#解決方案頁)。

`scripts/content/migrate/migrate.mjs` 把現站的 blog 文章與新聞轉成 `src/content/blog/`、`src/content/news/` 的內容檔，圖片下載到 `src/assets/`。要搬哪些文章、slug 與分類，都照 [`page-map.csv`](../ia/page-map.csv)，script 不自行判斷。搬移規則見 [`content-migration` skill](../../.claude/skills/content-migration/SKILL.md)，欄位見 [`content-model.md`](../ia/content-model.md)。

## 執行

需要連到現站（`www.tpisoftware.com`、`www.tpisoftware.vn`，圖片另外會連到 `tpi.dev` 等網域）。

```bash
# 全部（blog、新聞，三個語系）
node scripts/content/migrate/migrate.mjs --report <file.csv>

# 只跑一部分
node scripts/content/migrate/migrate.mjs --type news --locale en
node scripts/content/migrate/migrate.mjs --type blog --locale zh-TW --only customer-complaint-ai-tool-selection-guide
```

| 參數 | 說明 |
|---|---|
| `--type blog\|news` | 只轉一種內容類型 |
| `--locale zh-TW\|en\|vi` | 只轉一個語系 |
| `--only <slug>` | 只轉一篇。blog 是 `page-map.csv` 的 `blog_slug`，新聞是新聞 id |
| `--refresh` | 不讀快取，重新抓現站 |
| `--report <file.csv>` | 每篇一列的報告，見「報告」 |

結束時 stdout 會印出各類型、各語系的 `written`、`unchanged`、`removed`、`skipped`、`failed` 篇數。不帶參數的全量執行會刪掉已經不在 `page-map.csv` 的內容檔與圖片資料夾（例如保留門檻改了），報告記為 `removed`。有任何一篇 `failed` 時 exit code 是 1。

轉完要跑 `npx astro check`。schema 不合的內容檔（缺欄位、tag 不在清單）會在這一步擋下，script 不重複檢查 schema。

## 轉換規則

### 來源

| 類型 | 列表與欄位 | 內文 |
|---|---|---|
| blog | `POST /cms/api/v1/f/article/home`（`X-Lang`：`ZH-TW`、`EN-US`、`VI-VN`） | 文章頁 SSR HTML 裡 Nuxt payload 的 `content` 字串 |
| 新聞 | `GET /tpi/api/News?languages=tw\|en\|vn` | `/file{htmlpath}` |

只轉 `page-map.csv` 中 `node` 為 `blog-post`、`news-article`，且 `disposition` 為 `keep`、`rewrite`、`merge` 的列。`merge` 列併入同一個 slug 的 `keep` 列，`sourceUrl` 寫成陣列，主要來源在前。API 列出、但 `page-map.csv` 沒有的文章，報告記為 `skipped`。這些是 M1-02 判定 `drop` 的文章，或日期在未來的排程文章。

### frontmatter

欄位對應照 `content-model.md` 的 blog 與 news 欄位表，以下只列需要判斷的部分：

- `tags`：`blog-categories.csv` 的 `sub_category` 對到 `content-model.md`「tag 清單」。對不到的子分類（例如 `smartm/esg`，由 `category: esg` 表示）不加 tag
- `featured`：`main_category` 是 `/blog/Featured` 時為 `true`
- `authorType`：`authorName` 列在 `frontmatter.mjs` 的 `ORGANIZATION_AUTHORS` 時為 `Organization`，其他都是 `Person`，報告會列出作者名稱
- 新聞的 `translationKey`：API 的 `langTW`，沒有 zh-TW 版時用自己的 id
- `sourceUrl` 取 `inventory.csv` 的 `final_url`，`sourceUpdatedAt` 取 `last_updated`
- `migratedAt`：內容檔第一次寫入或內容有變時，寫執行當天（台灣時間）。內容沒變時保留原值

### 內文

- 移除 inline style、`class`、`span`、`font` 與空段落；整個標題都是粗體時，拿掉粗體
- 內文的 `h1` 降成 `h2`，往下跳級的 heading 往上補齊（`h2` 之後的 `h4` 變 `h3`）。頁面的 `h1` 是 `title`，`scripts/seo/headings.mjs` 會檢查
- 粗體、斜體在中文標點旁邊時，CommonMark 不會把 `**` 當成標記，這時改寫成 `<strong>`、`<em>`
- 表格沒有合併儲存格、清單或巢狀表格時，轉成 Markdown 表格；否則保留成移除樣式的 HTML 表格。HTML 表格裡有圖片時，整篇記為 `failed`，因為 `astro:assets` 不處理 HTML 裡的圖
- `iframe`、`video` 等嵌入內容會移除並寫進報告。影片由 M6-03（#35）的 facade 處理
- en、vi 的全形標點（「：」「＆」「（）」等）換成半形，冒號、逗號、分號後面補空格。現站英文、越南文內文混用全形標點，`scripts/i18n/routes.mjs` 擋下 en、vi 頁面上的全形標點。換法寫在 `migrate.mjs` 的 `latinPunctuation`，成功案例、解決方案與服務頁、ESG 顧問頁的 script 寫檔時也套用，`offering-content.mjs` 比對現站時同樣換過再比
- 連到現站的連結依 `redirects.csv` 換成新站路徑。換完落在其他語系時（例如越南文文章連到英文產品頁），改成本篇語系的同一頁，並寫進報告：現站跨語系連結是因為缺頁，新站三語在同一個網域，`scripts/i18n/routes.mjs` 不允許跨語系連結。對不到的連結保留原網址，並寫進報告。列在 `broken-links.csv` 的連結也寫進報告

### 圖片

- 封面與內文圖都下載到 `src/assets/<blog|news>/<locale>/<slug>/`。封面叫 `cover.<ext>`，內文圖用原始檔名轉成小寫 kebab-case，沒有英數字時叫 `image`，撞名時加 `-2`、`-3`
- 下載後縮到最大寬 1600 px，存成 WebP（quality 85）。模板最寬只用到 1440 px（文章封面），頁面上的圖由 `astro:assets` 另外產生。SVG、GIF、動畫圖不處理；寬度在 1600 px 以內、轉成 WebP 反而變大的圖保留原檔
- 副檔名依檔案內容判斷（現站部分圖片的 content-type 是 `application/octet-stream`）。不是 `astro:assets` 能讀的格式時，整篇記為 `failed`
- 任何一張圖下載失敗，整篇都不寫入，既有的檔案也不動。`overrides.yaml` 的 `dropImagesFrom` 列出的主機例外，見「人工修正」
- 資料夾裡不再使用的圖片會刪除
- alt 沿用現站。現站大多是空的，報告會列出缺 alt 的張數，補法見「人工修正」

## 重跑

script 可以重複執行。輸入沒變時，第二次跑的結果全部是 `unchanged`，`git status` 不會有變化。

- 現站的回應快取在 `.cache/migrate/`（不進版控）。現站更新後用 `--refresh` 重抓
- 檔案先寫到暫存檔再改名，中途中斷後重跑，結果和一次跑完相同
- 不要直接改產出的內容檔，下次執行會被覆蓋。要改的內容寫進 `overrides.yaml`

## 人工修正

`scripts/content/migrate/overrides.yaml` 以 entry id（`<blog|news>/<locale>/<slug>`）為 key：

```yaml
news/zh-TW/585:
  frontmatter:
    description: 改寫後的 description
    authorType: Person   # 值為 null 時刪除該欄位
  alt:
    news-2026-10-15-1792045444257.webp: 圖片內容的描述
  dropImagesFrom: [blog.tpisoftware.com]
```

- `frontmatter` 的值取代 script 產生的值
- `alt` 以 `src/assets/<type>/<locale>/<slug>/` 裡的檔名為 key，只用在內文圖。封面在文章模板裡是裝飾圖（`alt=""`），不用寫
- `dropImagesFrom` 列出的主機或圖片網址，內文圖不下載，直接從內文移除，連同只包著這張圖的連結與圖說（緊接在圖後、整段斜體的段落，或 `figcaption`），報告會列出移除的圖說。用在源站壞掉、圖片拿不到，而且圖只是配圖的文章（M5-05 的 `blog.tpisoftware.com`），或不能直接使用的圖（帶浮水印，見 `content-migration`「圖片」，寫圖片網址）。源站恢復或換好圖後刪掉這一行再重跑，圖就會補回來
- 寫了不存在的 entry id、文章沒有的圖片檔名，或 `dropImagesFrom` 的項目在文章裡找不到對應的圖，該篇記為 `failed`。不帶參數的全量執行，也會檢查是否有沒用到的 entry id

## 報告

`--report` 輸出 CSV，欄位為 `type`、`locale`、`id`、`status`、`source_url`、`notes`。`notes` 以 ` ; ` 分隔，內容有：

| notes | 要做什麼 |
|---|---|
| `images without alt: N` | 在 `overrides.yaml` 補 alt |
| `<title> is N characters (max 70): set seoTitle` | 在 `overrides.yaml` 寫較短的 `seoTitle`，否則 `npm run check` 的 html-validate（`long-title`）會失敗 |
| `description is N characters (max M)` | 改寫 description，寫進 `overrides.yaml`（上限見 `seo-checklist`） |
| `image dropped (dropImagesFrom): …` | 確認拿掉圖後內文仍讀得懂；源站恢復後刪掉 `dropImagesFrom` 重跑 |
| `authorType Person for author "…"` | 確認作者是人還是公司 |
| `headings changed: …` | 對照現站，確認層級調整後語意沒有變 |
| `link moved into <locale>: … → …` | 確認目標頁在該語系存在；不存在時 build 後的連結會改連到 zh-TW 版（`scripts/i18n/routes.mjs` 檢查） |
| `current-site link not in redirects.csv: …` | 列為待確認：補 `redirects.csv` 的對照，或改連結 |
| `broken link (broken-links.csv): …` | 依 `content-audit.md`「失效連結」修正或移除 |
| `embed removed: …` | 確認影片是否要放回（M6-03） |
| `table kept as HTML …` | 檢查表格的顯示 |
| `publishedAt … is before 2026-01-01` | 新聞發布日早於保留門檻（`audit.mjs`），在 `audit-overrides.csv` 改為 drop 後重跑 IA script |
| `to_confirm: …` | `inventory.csv` 的待確認，照抄進 PR |
| `not in blog-categories.csv: no tags` | 確認文章的子分類 |

## 抽查

全量轉換後，用 `spot-check.mjs` 讀 `--report` 的輸出，產生抽查報告（Markdown）：

```bash
node scripts/content/migrate/spot-check.mjs --report <file.csv> --out <spot-check.md>
# 先 npm run build，再加上 zh-TW 抽樣頁的截圖（375、1280 px）
node scripts/content/migrate/spot-check.mjs --report <file.csv> --out <spot-check.md> --screenshots <dir>
```

- **需要看的文章**：轉換後的純文字比現站內文少 10% 以上，或圖片張數對不上（現站張數扣掉 `dropImagesFrom` 移除的圖與追蹤像素）。逐篇對照現站，找出漏掉的內容
- **抽樣**：每個 type × locale 固定抽 5 篇（以 entry id 的雜湊排序，重跑結果相同），人工對照現站的標題、日期、作者、內文、圖片、表格與連結。zh-TW 看截圖（`--screenshots` 只拍 zh-TW），en、vi 看 `npm run build` 後的頁面
- **連不到頁面的站內連結**：`dist/` 有 build 產出時，列出指向不存在頁面的 `<a href>`，例如連到沒有轉換的文章

## 成功案例

`scripts/content/migrate/case-studies.mjs` 把現站 `/success-story` 的案例卡片轉成 `src/content/case-study/` 的內容檔，logo 下載到 `src/assets/case-study/<locale>/<slug>/logo.*`（M5-03，#28）。現站沒有案例內頁，`page-map.csv` 也沒有案例的列：卡片資料（標題、logo、分類、描述）寫在列表頁的一個 Nuxt JS chunk 裡，script 從三語列表頁（zh-TW、en 在 `www.tpisoftware.com`，vi 在 `www.tpisoftware.vn`）找出這個 chunk 再解析。每張卡片轉成一筆有內頁的內容檔（使用者決定）。

```bash
node scripts/content/migrate/case-studies.mjs --report <file.csv>
node scripts/content/migrate/case-studies.mjs --dry-run   # 不寫檔，只看筆數與報告
```

`--refresh` 不讀快取。每次都是全量執行：沒有卡片對應的內容檔與 logo 會刪掉，報告記為 `removed`。

### 轉換規則

- **配對**：en、vi 的卡片以 zh-TW 為準，依 logo（去掉 `02`、`_en`、`-zh` 等語系版本的差異）與分類對齊。vi 少的卡片記為 `missing`
- **slug**：`case-studies.yaml` 的客戶 slug 加上 en 標題，三語相同，也是 `translationKey`
- **欄位**：內文是卡片描述原文。現站卡片文字有誤時（例如 vi 國泰人壽集中日誌案例照抄了新光銀行那筆，#40），在 `case-studies.yaml` 的 `entries` 寫 `cardDescription` 取代整段卡片文字，內文、`offerings`、description 都改用它，報告記 `card description replaced`；`client.name` 取 `case-studies.yaml` 的 `clients`，`disclosed: true`；`industry` 依 `content-model.md`「case-study」的對應表；`order` 是卡片在現站的順序；`offerings` 只在描述寫出產品名稱、且該語系有 offering 內容檔時填（`MENTIONS`），產品頁遷移後重跑就會補上
- **`seoTitle`**：不同客戶有同名案例（例如兩筆「網路投保系統」），所以寫成「客戶：標題」；標題已有客戶名稱時不寫
- **`description` 與 `seoTitle`**：卡片描述大多超過 seo-checklist 的長度（zh-TW 80 字、en 與 vi 160 字元），濃縮版寫在 `case-studies.yaml` 的 `entries`，只刪減不加內容。`<client>: <title>` 加上後綴超過 70 字元的，同一處另寫 `seoTitle`。zh-TW 在 M5-03，en 在 M7-02（#39），vi 在 M7-03（#40）

### 報告

| 備註 | 意思 |
|---|---|
| `logo W×H` | 原始 logo 尺寸。內頁以 48 px 高顯示 |
| `client name "…" is not in the description` | 客戶名稱與描述的寫法不同，或描述沒寫客戶（名稱取自 logo），或描述寫的是別的客戶 |
| `names … (no <locale> offering entry yet)` | 描述寫了產品，但該產品還沒有內容檔 |
| `dated: …` | 提到獎項或年份的句子，要確認是否過時 |
| `description is N characters` | 超過 seo-checklist 的長度 |
| `<title> is N characters` | 加上網站名稱後超過 70 字（以 HTML 跳脫後的長度計算） |
| `card description replaced (cardDescription)` | 卡片文字已由 `cardDescription` 取代 |

## 解決方案頁

`scripts/content/migrate/offerings.mjs` 把 `page-map.csv` 中 `page_type` 為 `solution` 的頁面（7 個節點 × 3 語系）轉成 `src/content/offering/<locale>/<node>.md`（M5-02，#27），另外轉 `orient-ai`、`aiso` 兩個服務頁（#106，見「服務頁」）。`/solutions/greenswift`、`/solutions/insurebrick` 的 `page_type` 是 product，不在這裡。

`page-map.csv` 的 merge 列（例如大小寫不同的 `/orient-aI`）不另外抓，網址接在合併目標的 `sourceUrl` 後面。

```bash
node scripts/content/migrate/offerings.mjs
node scripts/content/migrate/offerings.mjs --locale zh-TW --only smartclaim
```

參數 `--locale`、`--refresh` 同上，`--only` 寫節點 id。快取與 `migratedAt` 的規則同「重跑」。

### 欄位對應

7 頁共用現站同一個版型，SSR HTML 就有全部文字，script 依 class 讀取：

| 欄位 | 現站來源 |
|---|---|
| `title` | `h1` |
| `tagline` | hero 的 `.slogan` |
| `description` | `<meta name="description">` |
| `features` | `.solution__feature01-item` 的 `h3` 與 `.contents`（4 項） |
| `useCases` | 「應用情境」或「應用案例」的 `.list-item` 標題與內文 |
| `kind`、`cta` | 固定 `solution`、`contact` |

offering schema 沒有欄位的段落不搬：介紹段、「流程架構」圖、三項優勢、適用產業、服務客戶 logo、影片（smartclaim）。要搬時先擴充 [`content-model.md`](../ia/content-model.md) 的 offering 欄位與模板。

hero 背景圖（現站 `/images/solution/<node>/banner.png`）也不搬。offering 模板的 hero 用固定的場景圖，`heroImage` 只拿來當 `og:image`，而 banner 的寬高比約 3:1（1920×650 等），不符合 seo-checklist 的 1200×630；模板裁切前不寫 `heroImage`，頁面用預設 OG 圖。

找不到上表任何一項時，script 判定現站版型改了，該頁失敗且不寫檔。

### 服務頁

`orient-ai`、`aiso` 各有自己的版型，script 依節點選 extractor（`offerings.mjs` 的 `TEMPLATES`）：

| 欄位 | `orient-ai` | `aiso` |
|---|---|---|
| `title` | `<title>` 去掉「 - 昕力資訊TPIsoftware」等站名 | `h1` 的 wordmark alt（AISO）加上文字 |
| `tagline` | `h1` 下方的副標（`.sp-text-wrapper.desktop`） | hero 的 `.hero-content-description` |
| `description` | `<meta name="description">` | 現站沒有，用 `tagline` |
| `features` | 第一段的 5 張卡片（`.section01 .card`） | 方案卡片的標題與說明（`.solutions-card`） |
| `faq` | FAQ 5 題。答案有條列時，條列接在段落後面，寫成「標題：說明。」 | 無 |
| `kind`、`cta` | `product`、`demo`（現站 hero 是「預約DEMO」） | `product`、`contact` |

`inventory.csv` 的 `page_type` 是 `service`，`kind` 依使用者決定（PR #110）兩頁都填 `product`，JSON-LD 是 `SoftwareApplication`。

沒有欄位的段落不搬：

- `orient-ai`：作業效率 40-60% 等三個數字、執行層與治理層兩張卡片（含應用場景）、「實現人與 AI Agent 的協作」三組條列與截圖、「OrientAI + AI 硬體」（群聯 aiDAPTIV、AI PC／Workstation／AI Server）、白皮書與 blog 的連結
- `aiso`：方案卡片的領域標籤（法務、人力資源等）與連到 `aisoportal.com` 的「了解更多」

### 人工修正

寫在 `scripts/content/migrate/offering-overrides.yaml`，key 是 `<locale>/<node>`：

- `frontmatter`：同 blog 的 `overrides.yaml`，取代產生的值，`null` 拿掉欄位。zh-TW 的 `description` 超過 80 字時在這裡改寫，只刪減，不加現站沒有的事實
- `useCaseIndustry`：`{ <useCases 的索引>: finance|government|manufacturing }`，把應用情境連到產業頁，不用複製整段文字

### 比對現站

```bash
node scripts/design/offering-content.mjs
```

逐筆確認每個非 draft 的 offering 與 hub（三個語系）的 `tagline`、`features`、`useCases`、`faq`、`highlights` 文字仍在任一個 `sourceUrl` 的頁面上，找不到的列 `MISS` 並以 exit 1 結束。FAQ 答案整段找不到時，改以句子與「標題：說明」為單位比對，因為服務頁的答案是段落與條列接成的。`description` 有改寫，不在比對範圍，在 PR 列出原文對照。

## ESG 顧問服務

`scripts/content/migrate/esg-advisory.mjs` 把 `page-map.csv` 中節點為 `esg-advisory` 的服務頁（3 語系）轉成 `src/content/offering/<locale>/esg-advisory.md`，節點為 `esg-advisor` 的顧問頁（zh-TW 8、en 9、vi 8）轉成 `src/content/person/<locale>/<slug>.md`（#107）。

```bash
node scripts/content/migrate/esg-advisory.mjs
node scripts/content/migrate/esg-advisory.mjs --locale zh-TW
```

參數 `--locale`、`--refresh` 同上。快取與 `migratedAt` 的規則同「重跑」。

### 服務頁的欄位對應

| 欄位 | 現站來源 |
|---|---|
| `title` | `h1 .subtitle` |
| `tagline` | 第一段的標題 `.section01__title`（三個語系的 hero `.slogan` 都是空的） |
| `description` | `<meta name="description">` |
| `features` | 「轉型策略三階段」的 `.section04-card` 標題與內文 |
| `faq` | `.faq-item`，去掉「Q1：」「A：」「Câu 1:」等前綴 |
| `kind`、`cta` | 固定 `service`、`contact` |

offering schema 沒有欄位的段落不搬：ESG 說明段、法規時程（2023～2050）、GreenSwift 推廣區塊、hero 背景圖。顧問團隊段落由 person 內容檔產生（下一節）。

### 顧問頁的欄位對應

| 欄位 | 現站來源 |
|---|---|
| `title` | `.banner__name` |
| `jobTitle`、`affiliation` | `.banner__job`、`.banner__detail` |
| `experience`、`education`、`expertise`、`certifications` | 依段落標題（經歷／學歷／專長／證照，en、vi 各自的標題見 script 的 `SECTIONS`）讀出每一行；專長是一行，依「、」與括號外的逗號拆開 |
| `order` | 服務頁團隊列表中這張卡片的位置，`OfferingTemplate` 的「ESG 顧問團隊」依它排序 |
| `description` | 現站沒有個人化的 description，script 用頁面上的姓名、職稱、單位與專長組成一句，超過 seo-checklist 的字數時先少列專長，再拿掉單位 |
| `translationKey` | slug（三語共用；`huang-zhijun` 沒有 zh-TW 版，也用自己的 slug） |

照片（`photo`）不搬：授權未確認。服務頁上沒有連結的團隊卡片（沒有個人頁）不建內容檔，報告會列出；服務頁的團隊連結與 `page-map.csv` 對不上時也會列出。

### 人工修正

寫在 `scripts/content/migrate/esg-advisory-overrides.yaml`，key 是 `<offering|person>/<locale>/<slug>`，只有 `frontmatter`，規則同「解決方案頁」。

### 比對現站

`node scripts/design/offering-content.mjs` 同時比對服務頁的 `tagline`、`features`、`faq`，以及每個 person 內容檔的姓名、職稱、單位與四個清單。
