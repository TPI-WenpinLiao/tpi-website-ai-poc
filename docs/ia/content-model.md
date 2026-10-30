# 內容模型（M2-04）

新站每種內容類型的欄位、型別、必填與對應的 JSON-LD。M4-01 依本檔寫 Astro content collections 的 Zod schema，M5 依本檔寫遷移 script。

- 輸入：[`sitemap.md`](./sitemap.md) 的節點與模板（[`nodes.csv`](./nodes.csv)、[`templates.csv`](./templates.csv)）、[`blog-categories.csv`](./blog-categories.csv)、[`content-migration`](../../.claude/skills/content-migration/SKILL.md) 的 frontmatter 規則
- 範圍：本檔只定欄位。URL 形式與語系前綴見 [ADR 0002](../decisions/0002-url-and-locale.md)（M2-03），目錄結構與 schema 寫法見 [Astro 實作](#astro-實作m4-01)（M4-01），選單由 M2-02 決定
- 範例值都取自現站 2026-10-20 的實際資料，每個範例附來源。現站沒有內容的類型，範例只列欄位，值寫「待人工提供」

## 原則

1. 一個內容類型對應一個 collection（或一個資料檔），一個模板可以服務多個內容類型（`article` 模板服務 `blog` 與 `news`）
2. 階層只存在 `nodes.csv`。單頁內容用 `node` 指回節點，不在 frontmatter 重複 parent、排序或所屬家族。麵包屑、子頁卡片、所屬家族都由 `node` 從 `nodes.csv` 推出
3. 能從檔案路徑推出的值（語系、slug）不寫進 frontmatter
4. 重複出現的結構（功能、應用情境、據點、經歷）放 frontmatter 陣列，敘述文字放 Markdown 內文。卡片與 JSON-LD 需要結構化資料。內文用 Markdown，不導入 MDX（M4-01）
5. 分類、tag、新聞類型都用受控清單（enum 或資料檔），不開放自由輸入
6. JSON-LD 只用頁面上真的有的資料。沒有真實來源的價格、評分、地址不輸出

型別寫法：`string`、`number`、`boolean`、`date`（`YYYY-MM-DD`）、`image`（`astro:assets` 的 `image()`，圖檔放 `src/assets/`）、`ref(collection)`（指向另一個 collection 的項目，跨語系用 `translationKey`）、`'a' | 'b'`（enum）、`T[]`（陣列）、`{ … }`（物件）。

## 內容類型總覽

| 內容類型 | 模板 | 節點 | 遷移列數 | JSON-LD |
|---|---|---|--:|---|
| [`offering`](#offering產品解決方案服務) | `offering` | 32 個 `offering` 節點 | 102 | 產品 `SoftwareApplication`；解決方案與服務 `Service` |
| [`hub`](#hub產品家族產業方案服務總覽) | `hub` | 11 個 `hub` 節點 | 22 | `CollectionPage` |
| [`case-study`](#case-study成功案例) | `case-study` | `case-study` | 0 | `Article` |
| [`blog`](#blog部落格文章) | `article` | `blog-post` | 60 | `BlogPosting` |
| [`news`](#news新聞) | `article` | `news-article` | 28 | `NewsArticle` |
| [`page`](#page公司頁與法務頁) | `content`、`contact` | `about`、`partners`、`contact`、法務 4 頁 | 17 | `AboutPage`、`ContactPage`、`WebPage` |
| [`person`](#personesg-顧問) | `person` | `esg-advisor` | 25 | `ProfilePage` + `Person` |
| [`whitepaper`](#whitepaper白皮書) | `gated-download` | 4 個 `whitepaper-*` 節點 | 9 | `WebPage` + `DigitalDocument` |
| [`organization`](#organization公司資料檔)（資料檔） | 全站 | — | — | `Organization`、`WebSite` |

遷移列數取自 [`sitemap-summary.json`](./sitemap-summary.json) 與 [`page-map.csv`](./page-map.csv)，含 merge 列。`home`、`listing`、`utility` 三個模板不建 collection，見[不建 collection 的模板](#不建-collection-的模板)。

所有非首頁另輸出 `BreadcrumbList`，項目由 `node` 沿 `nodes.csv` 的 `parent` 往上推出（`group` 節點略過）。

## 共用欄位

所有 collection 都有下列欄位，各類型的欄位表不再重複列出。

| 欄位 | 型別 | 必填 | 說明 |
|---|---|---|---|
| `title` | `string` | 是 | 頁面主題，也是 h1。`<title>` 由版型組成 `{title}｜TPIsoftware 昕力資訊` |
| `seoTitle` | `string` | 否 | `<title>` 要和 h1 不同時才填 |
| `description` | `string` | 是 | meta description，也用於 `og:description` 與卡片摘要 |
| `translationKey` | `string` | 是 | 同一份內容的各語系版本填相同值，M7 用來輸出 hreflang。慣例：有 `node` 欄位的類型（offering、hub、page、whitepaper）填節點 id；case-study、blog、person 填 zh-TW 版的 slug；新聞用 zh-TW 版的新聞 id，沒有 zh-TW 版時用該語系自己的 id |
| `ogImage` | `image` | 否 | 沒填時依序用類型自己的主圖（`coverImage` 等），再用全站預設圖 |
| `draft` | `boolean` | 否，預設 `false` | `true` 時不輸出頁面 |
| 語系 | — | 推出 | 由檔案路徑推出（`zh-TW`、`en`、`vi`），不寫在 frontmatter |
| slug | — | 推出 | 不寫在 frontmatter。有 `node` 欄位的類型，URL 取 `nodes.csv` 的 `path`，檔名不影響 URL；case-study、blog、news、person 由檔名推出。URL 組法見 ADR 0002；blog 文章的 slug 取 `page-map.csv` 的 `blog_slug` |

## 遷移追蹤欄位

所有 collection 都有。M5 遷移與 review 時用來對照現站。

| 欄位 | 型別 | 必填 | 說明 |
|---|---|---|---|
| `sourceUrl` | `string \| string[]` | 是 | 現站來源頁的 URL，取 `inventory.csv` 的 `final_url`（內容實際所在的頁面；`url` 欄是盤點時發現的網址，可能經過轉址）。多頁合併時用陣列，第一個是主要來源。新頁（現站沒有對應頁）明確寫 `[]` |
| `migratedAt` | `date` | `sourceUrl` 非空時必填 | 擷取現站內容的日期 |
| `sourceUpdatedAt` | `date` | 否 | 現站內容的最後更新日，取 `inventory.csv` 的 `last_updated`。現站沒有資料時不填 |

`sourceUrl` 一律必填，用 `[]` 表示新頁，是為了讓漏填被 schema 擋下，不會和新頁混淆。M2-05 的 301 對照以 `page-map.csv` 為來源，不讀這些欄位；新聞的現站 id 可從 `sourceUrl`（`/media-center/{id}`）取得，不另設欄位。

一對一：

```yaml
sourceUrl: https://www.tpisoftware.com/products/digirunner
migratedAt: 2026-11-03
```

多頁合併（landing page 併入產品頁，見 `sitemap.md`「決策紀錄」）：

```yaml
sourceUrl:
  - https://www.tpisoftware.com/products/digirunner-cloud
  - https://www.tpisoftware.com/products/digirunner/awsmarketplace
migratedAt: 2026-11-03
```

新頁：

```yaml
sourceUrl: []
```

## offering（產品、解決方案、服務）

32 個 `offering` 節點共用。`kind` 區分產品、解決方案、服務，模板依 `kind` 切換 JSON-LD 與 CTA 文字。

| 欄位 | 型別 | 必填 | 說明 | 現站來源 |
|---|---|---|---|---|
| `node` | `string` | 是 | `nodes.csv` 的 `id`。所屬家族、上層產品（例如 `digirunner-cloud` 在 `digirunner` 底下）由節點推出 | `page-map.csv` 的 `node` |
| `kind` | `'product' \| 'solution' \| 'service'` | 是 | 產品是可授權的軟體；解決方案是產品加導入的組合；服務是人力或顧問服務 | `inventory.csv` 的 `page_type`（`product`、`solution`、`service`），M5 逐頁確認 |
| `tagline` | `string` | 否 | hero 標語 | 現站 hero 區 |
| `heroImage` | `image` | 否 | hero 主圖 | 現站 hero 區 |
| `features` | `{ title: string; body: string; icon?: image }[]` | 否 | 功能或服務項目 | 現站功能區 |
| `useCases` | `{ title: string; body: string; industry?: 'finance' \| 'government' \| 'manufacturing' }[]` | 否 | 應用情境。`industry` 讓產業頁（`hub`）反查相關產品 | 現站情境區 |
| `faq` | `{ question: string; answer: string }[]` | 否 | 常見問題 | 現站 FAQ 區（少數頁有） |
| `cta` | `'contact' \| 'demo'` | 是 | 主要 CTA：聯絡業務或預約 demo。表單端點由 M6 依此決定 | `features.md`「表單」 |
| `relatedCaseStudies` | `ref(case-study)[]` | 否 | 精選案例與排序。留空時由 `case-study.offerings` 反查；關聯以 `case-study.offerings` 為準，這裡只列其中的項目 | — |
| `relatedPosts` | `ref(blog)[]` | 否 | 精選文章與排序。留空時由 `blog.relatedOfferings` 反查；關聯以 `blog.relatedOfferings` 為準，這裡只列其中的項目 | — |
| `downloads` | `{ label: string; file: string }[]` | 否 | 下載檔（例如 `digirunner-aws-guide` 的 PDF），也是 `download` 中繼頁的資料來源。白皮書不列在這裡，由 `whitepaper.offeringNode` 反查 | 現站下載按鈕 |

範例（`kind: product`，取自 <https://www.tpisoftware.com/products/digirunner>，`useCases` 只列兩項）：

```yaml
title: digiRunner API 管理平台
description: 昕力資訊 digiRunner 企業級 API 管理平台，為現有後端服務設立一致性的 API 閘道，提供完整 API 開發設計、部署發佈、權限控管、資安管理、API 組合與串接等，滿足全方位的管理需求，可說是企業數位轉型的利器！
translationKey: digirunner
node: digirunner
kind: product
tagline: 專為關鍵系統應用而生
useCases:
  - title: 彈性架構 活化金融應用
    body: 零信任架構傳輸更安全
    industry: finance
  - title: 內外通達 實現政府數位治理
    body: 打造高效、便民數位服務
    industry: government
cta: demo
sourceUrl: https://www.tpisoftware.com/products/digirunner
migratedAt: 2026-11-03
```

範例中的 `description` 是現站原文，M5 改寫時依 `seo-checklist` 的長度規則調整。

JSON-LD：

| schema 屬性 | `kind: product` → `SoftwareApplication` | `kind: solution`／`service` → `Service` |
|---|---|---|
| `name` | `title` | `title` |
| `description` | `description` | `description` |
| `image` | `heroImage` 或 `ogImage` | `heroImage` 或 `ogImage` |
| `url` | 頁面 canonical | 頁面 canonical |
| `applicationCategory` | 固定 `BusinessApplication` | — |
| `serviceType` | — | `title` |
| `provider`／`publisher` | `organization` 資料檔 | `organization` 資料檔 |
| `inLanguage` | 語系 | 語系 |
| `FAQPage` | 有 `faq` 時另輸出 | 有 `faq` 時另輸出 |

產品用 `SoftwareApplication` 不用 `Product`：產品都是企業軟體，而 `Product` 的主要屬性（價格、評分）本站沒有真實資料。`offers`、`aggregateRating` 不輸出，因此不會產生 Google rich result，但 schema 有效。

## hub（產品家族、產業方案、服務總覽）

11 個 `hub` 節點共用：`products`、4 個產品家族、`industries`、3 個產業、`services`、`resources`。子頁卡片由 `nodes.csv` 推出，不在 frontmatter 列。

| 欄位 | 型別 | 必填 | 說明 | 現站來源 |
|---|---|---|---|---|
| `node` | `string` | 是 | `nodes.csv` 的 `id` | `page-map.csv` |
| `tagline` | `string` | 否 | hero 標語 | 現站 hero 區 |
| `heroImage` | `image` | 否 | hero 主圖 | 現站 hero 區 |
| `industry` | `'finance' \| 'government' \| 'manufacturing'` | 產業頁必填 | 產業頁用這個值反查 `offering.useCases[].industry` 與 `case-study.industry`，列出相關產品與案例 | — |
| `highlights` | `{ title: string; body: string }[]` | 否 | 介紹區塊。金融、政府頁承接開放銀行、開放政府頁的內容 | `/products/open-banking`、`/products/open-government` |
| `featuredCaseStudies` | `ref(case-study)[]` | 否 | 指定精選案例；沒填時用 `industry` 反查 | — |
| `featuredPosts` | `ref(blog)[]` | 否 | 指定精選文章 | — |

範例（新頁，現站沒有內容）：

```yaml
title: 製造業
description: 待人工提供
translationKey: industry-manufacturing
node: industry-manufacturing
industry: manufacturing
sourceUrl: []
```

JSON-LD：`CollectionPage`，`name` ← `title`、`description` ← `description`、`hasPart` ← 子節點頁面（`WebPage` 的 `name` 與 `url`）、`inLanguage` ← 語系。

## case-study（成功案例）

現站沒有案例內頁。案例是 `/success-story` 列表上的卡片，資料寫在 Nuxt 的 JS chunk 裡（client 端渲染），每筆只有標題、logo、現站分類與一段描述，沒有日期。M5-03（#28）由 `node scripts/content/migrate/case-studies.mjs` 轉成每筆一個內容檔，每筆都有內頁；用法見 [`docs/content/migration.md`「成功案例」](../content/migration.md#成功案例)。

| 欄位 | 型別 | 必填 | 說明 | 現站來源 |
|---|---|---|---|---|
| `client` | `{ name: string; disclosed: boolean; logo?: image }` | 是 | `disclosed: false` 時頁面與 JSON-LD 只顯示 `industry` 與 `clientDescription`，不出現 `name` 與 `logo`。`name` 仍要填，供內部 review 對照 | `name`：描述裡的客戶寫法（`case-studies.yaml` 依 logo 對照）；`logo`：卡片 logo。M5-03 依使用者決定照現站顯示（`disclosed: true`），授權待確認 |
| `clientDescription` | `string` | `disclosed: false` 時必填 | 匿名描述，例如「某壽險公司」。待人工提供 | — |
| `industry` | `'finance' \| 'government' \| 'manufacturing' \| 'other'` | 是 | 產業頁反查用 | 卡片的 `type`：`financial`、`insurance` → `finance`；`gov` → `government`；其餘（`tel`、`tech`、`transport`、`medical`、`other`）→ `other`（M5-03 使用者決定） |
| `offerings` | `ref(offering)[]` | 否 | 使用的產品或服務，產品頁反查用 | 描述明確點名、且 offering 內容檔已存在時才填 |
| `challenge` | `string` | 否 | 客戶遇到的問題 | — |
| `solution` | `string` | 否 | 導入內容，顯示在內文之前 | — |
| `results` | `{ label: string; value: string }[]` | 否 | 成果。只能填客戶授權公開的數字 | — |
| `coverImage` | `image` | 否 | 主圖 | — |
| `publishedAt` | `date` | 否 | 發布日。列表依此新到舊排，沒有的排在後面 | 現站沒有 |
| `order` | `number` | 否 | 沒有 `publishedAt` 的案例在列表上的順序 | 卡片在現站陣列的位置 |

內文是現站卡片的描述原文。`challenge`、`solution`、`publishedAt` 原本必填，現站沒有這些資料，M5-03 改為選填（使用者決定）；沒有 `challenge` 時內頁不輸出「挑戰」段落。

JSON-LD：`Article`，`headline` ← `title`、`description` ← `description`、`datePublished` ← `publishedAt`（沒有就不輸出）、`image` ← `coverImage`、`about` ← `offerings` 對應的 `SoftwareApplication`／`Service`、`publisher` ← `organization`。`client.disclosed: false` 時不輸出客戶名稱。

## blog（部落格文章）

zh-TW 14 列、en 9 列、vi 37 列（`page-map.csv` 的 `blog-post` 節點；M5-05 起只保留 2026 年的文章）。

| 欄位 | 型別 | 必填 | 說明 | 現站來源（blog API） |
|---|---|---|---|---|
| `category` | `'ai' \| 'digital-transformation' \| 'enterprise-management' \| 'esg' \| 'use-cases'` | 是 | 新分類，對應 `nodes.csv` 的 `blog-*` 節點。每篇只有一個 | `page-map.csv` 的 `blog_category` 去掉 `blog-` 前綴 |
| `tags` | `string[]` | 否 | 值必須在 tag 清單內（見下表） | `blog-categories.csv` 的 `sub_category` |
| `featured` | `boolean` | 否，預設 `false` | 列表頁置頂 | 現站 `Featured` 分類 |
| `publishedAt` | `date` | 是 | 發布日 | `atcDate` |
| `updatedAt` | `date` | 否 | 內容有實質修改時才填 | — |
| `author` | `string` | 是 | 顯示用作者，保留現站寫法 | `authorName` |
| `authorType` | `'Person' \| 'Organization'` | 是 | JSON-LD `author` 的型別。`author` 是公司名稱時填 `Organization` | 依 `authorName` 判斷，M5 確認 |
| `coverImage` | `image` | 是 | 封面，也是列表卡片圖 | `coverImage` |
| `relatedOfferings` | `ref(offering)[]` | 否 | 相關產品，產品頁反查文章用 | — |

範例（取自 blog API `/cms/api/v1/f/article/home`，`X-Lang: ZH-TW`，文章 <https://www.tpisoftware.com/blog/ai/customer-complaint-ai-tool-selection-guide>）：

```yaml
title: 降低客訴 AI 工具選型指南：為什麼傳統質檢防不住客訴？
description: 降低客訴 AI 工具怎麼選？本文解析金融客服常見客訴風險、人工抽檢與關鍵字檢核的限制，並說明 AI 自動化語音質檢如何透過通話語意分析、情緒辨識與服務品質 AI 稽核，協助企業提早發現高風險互動，提升客服質檢效率與服務品質。
translationKey: customer-complaint-ai-tool-selection-guide
category: ai
tags: [ai-application]
publishedAt: 2026-09-11
author: TPIsoftware
authorType: Organization
coverImage: ../../../assets/blog/zh-TW/customer-complaint-ai-tool-selection-guide/cover.webp   # 原圖 https://tpi.dev/tpi-dev/private/article/IMG/1f1aaad1-2937-612a-81f6-0b7fa23ee3a6.png
sourceUrl: https://www.tpisoftware.com/blog/ai/customer-complaint-ai-tool-selection-guide
migratedAt: 2026-11-03
sourceUpdatedAt: 2026-09-11
```

現站沒有的欄位：文章頁的 `keywords` meta 不搬（搜尋引擎不使用）；`views` 瀏覽數不搬；blog API 沒有跨語系對應，各語系的 `translationKey` 預設各自獨立。M7 沒有人工對應。已對應的文章與要對應時怎麼改，見 `docs/ia/blog-slugs.csv` 與 ADR 0002「路徑命名」（見「待確認」）。

### tag 清單

tag 用英文 slug，三語共用。初始清單由現站子分類合併同義項而來，數字是 `blog-categories.csv` 的文章數。子分類與新分類同名時（zh-TW `smartm/esg`、en `smartmgmt/esg-sustainability`）不另設 tag，由 `category: esg` 表示。現站有子分類但沒有文章的（`icr`、`aichatbot`、`cloud-service`、`enterprise-security`）不列入。

| tag | zh-TW | en | vi |
|---|---|---|---|
| `ai-application` | `ai/AIapplication`（11） | `artifintell/aiapplication`（10） | — |
| `chatbot` | `ai/chatbot`（9） | — | — |
| `rpa` | `ai/rpa`（6） | — | — |
| `data` | `dx/datadevelop`（1） | `dt/datadev`（2） | — |
| `enterprise-innovation` | `dx/enterinnovation`（3） | `dt/enterprise-innovation`（1） | `digital-transformation/enterprise-innovation`（72） |
| `fintech` | `dx/fintech`（11） | `dt/financialtech`（7） | `digital-transformation/fintech`（35） |
| `insurtech` | `dx/insurtech`（2） | `dt/insurancetech`（1） | — |
| `smart-healthcare` | `dx/smarthealth`（7） | `dt/smarthealthc`（6） | — |
| `ai-solutions` | `scenario/aisolution`（3） | `businessscenario/aisolutions`（5） | — |
| `enterprise-solutions` | `scenario/enterprisesolution`（4） | `businessscenario/enterpsolutions`（4） | — |
| `api-management` | `smartm/apim`（26） | `smartmgmt/apimgmt`（21） | `enterprise-management/api-management`（81） |
| `log-management` | `smartm/logm`（7） | `smartmgmt/logmgmt`（5） | `enterprise-management/log-management`（65） |
| `open-banking` | `smartm/openbanking`（3） | `smartmgmt/openbank`（2） | `enterprise-management/open-banking`（4） |
| `green-growth` | — | — | `green-transformation/green-growth`（11） |
| `energy-management` | — | — | `green-transformation/smart-energy-management`（1） |
| `sustainable-development` | — | — | `green-transformation/sustainable-development`（29） |
| `neo4j` | `Featured/Neo4j`（3，另設 `featured: true`） | — | — |

tag 清單與三語顯示名稱放在 `src/content/tags.yaml`，由 `node scripts/content/tags.mjs` 依上表產生，名稱取現站分類 API 的子分類名稱，不手改。上表某語系是 `—` 的 tag 沒有該語系的名稱。

JSON-LD：`BlogPosting`

| schema 屬性 | 欄位 |
|---|---|
| `headline` | `title` |
| `description` | `description` |
| `image` | `coverImage` |
| `datePublished` | `publishedAt` |
| `dateModified` | `updatedAt`，沒有時用 `publishedAt` |
| `author` | `{ "@type": authorType, "name": author }` |
| `publisher` | `organization` 資料檔 |
| `articleSection` | `category` 的顯示名稱 |
| `keywords` | `tags` 的顯示名稱 |
| `inLanguage` | 語系 |
| `mainEntityOfPage` | 頁面 canonical |

## news（新聞）

zh-TW 10 列、en 9 列、vi 9 列（`page-map.csv` 的 `news-article` 節點；M5-05 起只保留 2026 年的新聞）。

| 欄位 | 型別 | 必填 | 說明 | 現站來源（新聞 API） |
|---|---|---|---|---|
| `newsType` | `'press' \| 'product' \| 'newsletter'` | 是 | 新聞類型，見下表 | `newsTypeId` |
| `publishedAt` | `date` | 是 | 發布日 | `showDate` |
| `updatedAt` | `date` | 否 | 內容有實質修改時才填。現站 `updateDate` 是後台編輯時間，不一定是內容更新，不直接搬 | — |
| `coverImage` | `image` | 是 | 封面 | `imagePath` |
| `relatedOfferings` | `ref(offering)[]` | 否 | 相關產品 | — |

`description` 取 API 的 `summary`，超過 meta description 長度時 M5 改寫。`translationKey` 用 zh-TW 版的新聞 id：API 的 `langTW`、`langEN`、`langVN` 記錄三語版本的 id，三個版本填相同值。沒有 zh-TW 版（`langTW` 為空，例如 en 的 455、456、522、542）時用該語系自己的 id。

| `newsType` | 現站 `newsTypeId` | 現站名稱 | 保留的 zh-TW 篇數 |
|---|---|---|--:|
| `press` | 1 | 新聞快報 | 10 |
| `product` | 3 | 產品消息 | 0 |
| `newsletter` | 7 | 電子報 | 0 |
| （不建） | 2 | 未知 | 0 |

en、vi 的 `newsTypeId` 是另外編號的，依現站名稱對到同一個 `newsType`（M5-04 加入，待內容負責人確認）：

| `newsType` | en `newsTypeId`（名稱） | vi `newsTypeId`（名稱） |
|---|---|---|
| `press` | 4（News） | 9（Tin tức） |
| `product` | 6（Products） | 11（Sản phẩm） |
| `newsletter` | 8（Newsletter） | — |
| （不建） | 5（不出現在媒體中心頁面） | 10（不出現在媒體中心頁面） |

現站名稱取自 <https://www.tpisoftware.com/media-center>、<https://www.tpisoftware.com/en/media-center>、<https://www.tpisoftware.vn/media-center> 頁面資料的 `newsType`。`page-map.csv` 保留的 en、vi 新聞沒有 5 與 10。`newsTypeId: 2` 有 55 篇已發布，但不出現在媒體中心頁面，日期在 2018–2022 年，多為活動與技術小聚，M1-02 稽核後沒有任何一篇保留，因此不建這個值。篇數取自新聞 API 與 `page-map.csv` 的交集；M5-05 改為只保留 2026 年的新聞後，三個語系保留的都是 `press`，`product`、`newsletter` 留在 schema 給之後的新聞。

範例（取自新聞 API `/tpi/api/News?languages=tw` 的 id 585，文章 <https://www.tpisoftware.com/media-center/585>）：

```yaml
title: 昕力資訊 AI 專用機七箭齊發 搶攻企業與校園應用市場
description: 昕力資訊（7781）發表七款 AI 專用機並同步於 AISO 官網上架，涵蓋法務、人資、教育與企業 AI 治理四大場域，此次產品組合結合自研 OrientAI 系列軟體與地端硬體，將合約審閱、人事作業、教學與學習，以及 AI 使用管理等需求整合為一體機方案，協助企業與學校依工作場景導入 AI，減少自行整合軟硬體的負擔。
translationKey: "585"   # en 版 586、vi 版 587 填同一個值
newsType: press
publishedAt: 2026-10-15
coverImage: ../../../assets/news/zh-TW/585/cover.webp   # 原圖 /images/news/585/news-2026-10-15-1792036052577.jpg
sourceUrl: https://www.tpisoftware.com/media-center/585
migratedAt: 2026-11-03
sourceUpdatedAt: 2026-10-16
```

JSON-LD：`NewsArticle`，屬性對應同 `BlogPosting`，差別是 `author` 固定為 `organization`，`articleSection` ← `newsType` 的顯示名稱。

## page（公司頁與法務頁）

`about`、`partners`、`contact` 與 4 個法務頁共用一個 collection。版面差異大的區塊放 `sections`，由 `node` 決定用哪個版型。

| 欄位 | 型別 | 必填 | 說明 | 現站來源 |
|---|---|---|---|---|
| `node` | `string` | 是 | `about`、`partners`、`contact`、`privacy`、`terms`、`disclaimer`、`security-policy` | `page-map.csv` |
| `heroImage` | `image` | 否 | hero 主圖 | 現站 hero 區 |
| `sections` | `{ heading: string; body: string; items?: { title: string; body?: string; image?: image }[] }[]` | 否 | 願景、核心價值、里程碑、合作夥伴計畫等區塊 | 現站各區塊 |
| `effectiveDate` | `date` | 法務頁必填 | 生效日 | 現站 PDF |
| `pdf` | `string` | 否 | 原始 PDF 的保留路徑，法務頁轉成 HTML 後仍提供下載時才填 | 現站 `/pdf/*.pdf` |

據點與聯絡方式放在 `organization` 資料檔，`about` 與 `contact` 都從資料檔讀，不在頁面內容重複。

`partners` 現站是合作夥伴招募頁（en 版有「Why Become a TPIsoftware Partner」「Partner Onboarding Journey」等區塊），不是夥伴名單，所以用 `sections`，不設夥伴清單欄位。zh-TW 版內容需人工提供。

範例（取自 <https://www.tpisoftware.com/about-us>，`sections` 只列一項）：

```yaml
title: 關於我們
description: 昕力資訊憑藉軟體研發實力、模組化設計與 AI 核心科技，自主研發 DigiLism 企業服務中台、SysTalk.ai 交談 AI 及、ESGswift 永續及 GadoSecurity 企業安全防護等企業創新軟體產品，銷售通路遍及海內外。同時擁有跨國大型專案建置的經驗，靈活因應市場，為企業實現數位轉型，贏得客戶信賴與多個國際獎項肯定。
translationKey: about
node: about
sections:
  - heading: 核心價值
    body: 信賴、完美、創新
sourceUrl: https://www.tpisoftware.com/about-us
migratedAt: 2026-11-03
```

JSON-LD：

| 節點 | 類型 | 屬性 |
|---|---|---|
| `about` | `AboutPage` | `name` ← `title`、`description`、`mainEntity` ← `organization` |
| `contact` | `ContactPage` | `name` ← `title`、`description`、`mainEntity` ← `organization`（含 `contactPoint`、`address`） |
| `partners`、法務頁 | `WebPage` | `name` ← `title`、`description`、`datePublished` ← `effectiveDate`（法務頁） |

## person（ESG 顧問）

`esg-advisor` 節點，zh-TW 8 列、en 9 列、vi 8 列。

`title` 填姓名。

| 欄位 | 型別 | 必填 | 說明 | 現站來源 |
|---|---|---|---|---|
| `jobTitle` | `string` | 是 | 在昕力的職稱 | 頁面標題區 |
| `affiliation` | `string` | 否 | 其他任職單位 | 頁面標題區 |
| `order` | `number` | 否 | 在服務頁「ESG 顧問團隊」的順序 | 卡片在現站服務頁團隊列表的位置 |
| `photo` | `image` | 否 | 照片，需確認授權 | 頁面照片 |
| `experience` | `string[]` | 否 | 經歷 | 「經歷」 |
| `education` | `string[]` | 否 | 學歷 | 「學歷」 |
| `expertise` | `string[]` | 否 | 專長 | 「專長」 |
| `certifications` | `string[]` | 否 | 證照 | 「證照」 |

現站顧問頁的 `<title>` 與 description 都是 ESG 服務頁的值，沒有個人化。`description` 由轉換 script 用頁面上的姓名、職稱、單位與專長組成（#107，[`migration.md`「ESG 顧問服務」](../content/migration.md#esg-顧問服務)）。

範例（取自 <https://www.tpisoftware.com/esg-advisory/chen-zhengrui>，陣列只列前兩項）：

```yaml
title: 陳政叡
description: 陳政叡（顧問｜國立高雄科技大學生態工程科技中心），昕力資訊 ESG 顧問團隊成員。專長：永續發展、碳輔導(減碳策略培育)、能源轉型、數據轉型、工業工程。
translationKey: chen-zhengrui
jobTitle: 顧問
affiliation: 國立高雄科技大學生態工程科技中心
order: 0
experience:
  - 叡至資訊科技有限公司 執行長
  - TAISE台灣企業永續獎見習評審
education:
  - 國立中山大學 海洋環境與工程系所｜博士生
  - 國立高雄科技大學 資訊管理所｜碩士
expertise: [永續發展, 碳輔導(減碳策略培育), 能源轉型, 數據轉型, 工業工程, 海事工程]
certifications:
  - CQI/IRCA ISO 14001 環境管理主任稽核員
  - CQI&IRCA ISO 50001能源管理系統主任稽核員
sourceUrl: https://www.tpisoftware.com/esg-advisory/chen-zhengrui
migratedAt: 2026-10-24
```

JSON-LD：`ProfilePage`，`mainEntity` 為 `Person`：`name` ← `title`、`jobTitle`、`image` ← `photo`、`worksFor` ← `organization`、`knowsAbout` ← `expertise`、`hasCredential` ← `certifications`（`EducationalOccupationalCredential` 的 `name`）。

## whitepaper（白皮書）

4 個 `whitepaper-*` 節點（`gated-download` 模板）。使用者填表後取得檔案。

| 欄位 | 型別 | 必填 | 說明 | 現站來源 |
|---|---|---|---|---|
| `node` | `string` | 是 | `whitepaper-*` 節點 id | `page-map.csv` |
| `offeringNode` | `string` | 是 | 對應產品的 `nodes.csv` 節點 id（`offering` 或 `hub` 節點），產品頁與家族頁反查白皮書用。AI Playbook 涵蓋整個 SysTalk.ai 家族，填 `family-ai` | 現站頁面 |
| `coverImage` | `image` | 是 | 白皮書封面 | 現站頁面 |
| `summary` | `string[]` | 否 | 內容重點 | 現站頁面 |
| `file` | `string` | 是 | 送出表單後提供的檔案 | 現站下載流程，待確認 |
| `form` | `'whitepaper' \| 'ai-playbook'` | 是 | 表單種類。digiRunner、digiLogs、GreenSwift 用 `whitepaper`；AI Playbook 多一個「導入 AI 遇到的問題」複選欄位，用 `ai-playbook`（`features.md`）。端點由 M6 決定 | `features.md`「表單」 |

範例（取自 <https://www.tpisoftware.com/whitepaper/api-strategies>）：

```yaml
title: 佈局 API 策略藍圖 賦能關鍵系統應用
description: 在快速變化的數位經濟中，API 策略是企業成功轉型的關鍵。我們深入探討如何有效整合 API 管理策略，如何透過 API 賦能企業關鍵系統應用，幫助企業在數位轉型中淬礪企業韌性，開創數位新局！立即下載 API 管理白皮書，我們將分析當前趨勢、面臨的挑戰及最佳實踐，為您的業務提升提供實用的見解。
translationKey: whitepaper-digirunner
node: whitepaper-digirunner
offeringNode: digirunner
form: whitepaper
file: 待確認
sourceUrl: https://www.tpisoftware.com/whitepaper/api-strategies
migratedAt: 2026-11-03
```

JSON-LD：`WebPage`，`mainEntity` 為 `DigitalDocument`：`name` ← `title`、`description`、`image` ← `coverImage`、`publisher` ← `organization`、`about` ← `offeringNode` 對應的頁面。檔案在表單後面，不輸出 `url`。

## organization（公司資料檔）

每個語系一份資料檔（`src/content/organization/<locale>.yaml`），供首頁、`about`、`contact`、footer 與所有 JSON-LD 的 `publisher` 使用。

| 欄位 | 型別 | 必填 | 說明 |
|---|---|---|---|
| `name` | `string` | 是 | 公司名稱 |
| `alternateName` | `string[]` | 否 | 其他名稱 |
| `logo` | `image` | 是 | logo |
| `sameAs` | `string[]` | 否 | 官方社群帳號 URL |
| `offices` | `{ id: string; name: string; address: string; phone?: string; country: string; headquarters?: boolean }[]` | 是 | 據點 |

範例（取自 <https://www.tpisoftware.com/about-us>「昕力據點」，`offices` 只列兩項）：

```yaml
name: 昕力資訊
alternateName: [TPIsoftware]
offices:
  - id: taipei
    name: 台北總部
    address: 114台北市內湖區瑞光路335號12樓
    phone: +886 2 2658 0508
    country: TW
    headquarters: true
  - id: singapore
    name: 新加坡
    address: "7 Straits View, Marina One East Tower, #05-01, Singapore 018936"
    phone: +65 8737 4703
    country: SG
```

JSON-LD：

- 首頁：`Organization`（`name`、`alternateName`、`logo`、`url` ← `Astro.site`、`sameAs`、`address` ← `headquarters: true` 的據點、`contactPoint` ← 各據點電話）＋ `WebSite`（`name`、`url`、`inLanguage`）
- 站內搜尋（M6）上線後，`WebSite` 再加 `potentialAction`（`SearchAction`）

## 不建 collection 的模板

| 模板 | 理由 |
|---|---|
| `home` | 首頁由其他 collection 組成（精選產品、案例、文章、新聞）。標題與描述等少量文案放在 i18n 字串檔，位置由 M4-04（#23）建模板時決定 |
| `listing` | 列表頁（blog 首頁與分類、媒體中心、活動、成功案例列表）的內容是其他 collection 的項目。標題與描述依節點寫在 i18n 字串檔；blog 分類頁的標題取 `nodes.csv` 的 `title` |
| `utility` | 搜尋、訂閱流程、感謝頁、下載中繼頁、404 是功能頁，文案放 i18n 字串檔，行為由 M6 決定。下載中繼頁（`/download/{product}`）的產品與檔案取自 `offering.downloads[].file` |

活動（`events`）列表的項目來源（現站是否有活動資料、要不要建 `event` collection）在 M6 決定。

## Astro 實作（M4-01）

schema 在 [`src/content.config.ts`](../../src/content.config.ts)。改本檔的欄位時，同一個 PR 也要改 schema。

| 項目 | 寫法 |
|---|---|
| collection 名稱 | 同內容類型：`offering`、`hub`、`case-study`、`blog`、`news`、`page`、`person`、`whitepaper`、`organization`，tag 清單是 `tag` |
| 內容檔位置 | `src/content/<collection>/<locale>/<slug>.md`，例如 `src/content/news/zh-TW/585.md`。entry id 是 `<locale>/<slug>` |
| 有 `node` 的類型 | 檔名用節點 id（`src/content/offering/zh-TW/digirunner.md`），URL 仍取 `nodes.csv` 的 `path` |
| `ref(collection)` | 寫 entry id，含語系：`offerings: [zh-TW/digirunner]`；tag 寫 tag id：`tags: [ai-application]`。schema 不擋引用 `draft: true` 的項目，模板（M4-04）列出引用時要濾掉 draft |
| `node`、`offeringNode`、blog `category` | 合法值由 `nodes.csv` 推出（[`src/lib/ia/nodes.ts`](../../src/lib/ia/nodes.ts)），新增節點不用改 schema |
| 圖片 | 圖檔放 `src/assets/<content-type>/<locale>/<slug>/`（不同語系可能有相同 slug），frontmatter 寫相對於內容檔的路徑 |
| `organization` | `src/content/organization/<locale>.yaml`，entry id 是語系。只有本表欄位，沒有共用欄位與遷移追蹤欄位 |
| 範例內容 | 每個 collection 各一筆 zh-TW，取自本檔的範例。含「待人工提供」等暫代值的設 `draft: true` |

下列情況 `astro check` 與 `astro build` 會失敗：

- 缺必填欄位、型別或 enum 不符
- 日期不是存在的 `YYYY-MM-DD`：留空、數字、`10/20/2026`、`2026-02-30`、帶時間的 `2026-10-20T00:00:00Z` 都會失敗。YAML 會把沒加引號的 `2026-02-30` 進位成 `2026-03-02`、把 datetime 轉成 `Date`，所以 [`scripts/content/dates.mjs`](../../scripts/content/dates.mjs) 用和 Astro 相同的 YAML 選項讀原始 frontmatter，凡是會被讀成日期的值，原文都必須是存在的 `YYYY-MM-DD`；TOML（`+++`）frontmatter 不接受
- 出現本檔沒有的欄位（所有物件都不接受未定義的欄位）
- 語系目錄不是 `zh-TW`、`en`、`vi`，或 slug 不是小寫英數與 `-`
- `node`、`offeringNode`、`category` 不在 `nodes.csv` 對應的節點裡，tag 不在 `tags.yaml`
- `ref` 指到不存在的內容檔。Astro 的 `reference()` 遇到不存在的 id 只記錄錯誤、build 仍然 exit 0（Astro 7.4.1 實測），所以 schema 先檢查檔案存在
- 本檔寫的條件必填：`sourceUrl` 非空時的 `migratedAt`、產業 hub 的 `industry`（必須等於節點 id 去掉 `industry-`）、`client.disclosed: false` 時的 `clientDescription`、法務頁的 `effectiveDate`
- `organization.offices` 不是剛好一個 `headquarters: true`，或據點 id 重複

## 待確認

| 項目 | 誰確認 | 影響 |
|---|---|---|
| blog `author` 的現站資料品質。M5-05 只遷移 2026 年的文章後剩下：vi 34 篇作者（API 的 `authorName`）為 `kay`，部分文章的後台帳號（`uidName`）是 `Kay Tăng Tấn Khôi`，`kay` 是否就是此人、要不要顯示全名 | 內容負責人 | `author` 與 `authorType` 怎麼填 |
| `商業週刊`、`科技報橘` 為作者的 6 篇是否有轉載授權：M5-05 的保留門檻後 6 篇都在 2026 年以前、不遷移，不再需要確認 | — | — |
| blog 三語版本的對應：API 沒有跨語系欄位，M7 沒有對應，各語系的文章之間沒有 hreflang（已對應的見 `docs/ia/blog-slugs.csv`） | 內容負責人 | `docs/ia/blog-slugs.csv` 的 slug（`translationKey` 跟著 slug） |
| 白皮書檔案的實際位置（現站在表單送出後提供） | 後端負責人 | `whitepaper.file` |
| tag 清單（上表）的合併方式與顯示名稱。`src/content/tags.yaml` 目前的名稱取自現站，例如 `ai-solutions` 的 zh-TW 名稱是「人工智慧」 | 專案負責人 | 改上表後重跑 `node scripts/content/tags.mjs` |
| 現站案例分類對應到 `case-study.industry` 的方式：M5-03 依使用者決定先照上表對應；群創光電（現站「科技」）、卓新工業（「其他」）是否改為 `manufacturing` | 內容負責人 | 產業頁列出的案例 |
| `offering.kind` 的歸類：`inventory.csv` 的 `page_type` 是依 URL 推定，例如 `/solutions/smartclaim` 與 `/solutions/insurering` 實際是否為產品；`systalk-chat` 的現站頁面同時判為 product 與 service（各 3 列）、`greenswift` 有 1 列 campaign、`uiux` 判為 solution 但內容是設計服務 | 內容負責人 | M5 |
