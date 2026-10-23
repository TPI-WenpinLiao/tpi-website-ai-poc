# blog 與新聞的批次轉換

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
| `link moved into <locale>: … → …` | 確認目標頁在該語系存在（M7 翻譯時） |
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
- **抽樣**：每個 type × locale 固定抽 5 篇（以 entry id 的雜湊排序，重跑結果相同），人工對照現站的標題、日期、作者、內文、圖片、表格與連結。zh-TW 看截圖，en、vi 的頁面還不會 build，看內容檔
- **連不到頁面的站內連結**：`dist/` 有 build 產出時，列出指向不存在頁面的 `<a href>`，例如連到沒有轉換的文章
