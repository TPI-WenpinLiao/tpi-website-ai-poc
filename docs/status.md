# 專案狀態

最後更新：2026-10-29

## 目前 milestone

**維運**

M0–M8 都已完成（M6 收尾 #37）。之後的需求用 issue form 開，不掛 milestone，寫在「Issue」的「維運」小標（`issue-ship` 第 3 步）。正式上線照 `docs/launch/launch-readiness.md`「上線步驟」。

## 進度

| Milestone | 狀態 |
|---|---|
| M0 基礎建設 | 完成 |
| M1 盤點與研究 | 完成 |
| M2 資訊架構 | 完成 |
| M3 設計系統 | 完成 |
| M4 開發骨架 | 完成 |
| M5 內容遷移 | 完成 |
| M6 功能 | 完成 |
| M7 多語系 | 完成 |
| M8 驗收 | 完成 |

## Issue

寫法見 [`issue-ship` 第 3 步](../.claude/skills/issue-ship/SKILL.md#3-更新-docsstatusmd)。只列已關閉的 issue；有 open PR 的 issue 不在這裡，用 `/next-issue` 查。

### M0 基礎建設

- 基礎建設完成（PR #1）；bootstrap 已執行（10 labels、8 milestones、44 issues）

### M1 盤點與研究

- M1-01 現站內容盤點完成（#2，PR #46）
- M1-02 內容稽核完成（#3）
- M1-03 SEO 基線完成（#4）
- M1-04 功能盤點完成（#5）
- M1-05 受眾與轉換目標完成（#6）
- M1-06 M1 收尾完成（#7）：`content-migration` 補上 `to_confirm`、失效連結、blog 與新聞內文來源、新聞發布日、外部網域圖片的規則
- 雲端 session 品質關卡修正完成（#47，PR #48），已驗證新 session 不需手動設定即可通過 `npm run check`
- 工作流程 skills 與 pstack 導入完成（#50，PR #51）

### M2 資訊架構

- M2-01 sitemap 與模板對應完成（#8，`ia-approved`）
- M2-02 導覽定案完成（#9，`ia-approved`，PR #60）
- M2-03 URL 規則與語系策略完成（#10，ADR 0002，PR #59）
- M2-04 內容模型完成（#11，PR #61）
- M2-05 舊站 redirect map 完成（#12）：`docs/ia/redirects.csv` 涵蓋 inventory 全部網址，可用 `node scripts/ia/redirects.mjs --redirects <file>` 轉成 `_redirects`
- M2-06 M2 收尾完成（#13，PR #81）：IA 與 URL 規則寫進 `CLAUDE.md`、`seo-checklist`、`content-migration`
- PR 審查 skill `/pr-review` 完成（#62，PR #65）
- `status.md` 改寫合併後的狀態完成（#67）
- 長時間任務的 checkpoint 機制完成（#69，PR #70）
- 自動開發到 PR 完成：審查迴圈與合併判斷摘要完成（#71）
- IA script 接進 `npm run check` 完成（#63）
- `issue-ship` 審查迴圈等目前 head 的 CI、PR body 不預寫 CI 結果完成（#74）
- 導覽第四層節點與 footer 法務位置對齊完成（#64）：法務定為 footer 最底列，`navigation.mjs` 檢查不限深度
- footer 最底列的法務順序改成現站順序完成（#77）：資訊安全政策、隱私權政策、使用條款、免責聲明

### M3 設計系統

- M3-01 各模板低保真 wireframe 完成（#14，`wireframe-approved`）：11 個模板與導覽的 wireframe（M4-04 完成後刪除）；en、vi 選單寬度實測見 `docs/design/nav-fit.md`；第一層 6 項時 vi 與 en 長譯名放不下，「成功案例」改放「資源」底下（三語統一，`navigation.csv` 已改）
- M3-02 design tokens 與元件庫完成（#15，`design-approved`）：深色場景與亮色閱讀頁的雙 surface、光與景深、捲動動態、12 個元件與 `/design-system` 審核頁；影像素材與提示詞見 `docs/design/image-prompts.md`
- M3-03 design-system 展示頁完成（#16，`design-approved`）：`/design-system` 列出全部 152 個 token（三層分組）與 5 個互動元件的狀態矩陣；全域改為 `box-sizing: border-box`
- M3-04 首頁高保真完成（#17，`design-approved`）：方向 B 的場景做成首頁 `/`（原型頁已刪除），結構照 `/wireframes/home`；文案取自現站（`src/data/home.ts`、`src/data/site.ts`，`node scripts/design/home-content.mjs` 逐筆比對現站）；新元件 `SiteHeader`（原生 `<details>` 選單，零 client JS，含「跳到主要內容」）、`SiteFooter`，`Card` 加上 `size="sm"`；公司 logo 由 `node scripts/design/import-brand.mjs` 匯入；首頁 JSON-LD（`Organization`、`WebSite`）讀 `organization` collection；方塊材質 tokens `--scene-block-*`、`--scene-rim-*`
- M3-05 產品頁高保真完成（#18，`design-approved`）：digiRunner 做成 `/products/digirunner`，結構照 `/wireframes/offering`，內容讀 offering collection（`node scripts/design/offering-content.mjs` 比對現站）；新元件 `Breadcrumb`、`InPageNav`、`Faq`、`SceneChapter`，`Card` 可以不帶 `href`；`Scene3D` 加上 `family`，窄螢幕依 `PageHero` 的視覺區取景、跨斷點時重建 tier（ADR 0003）；JSON-LD `SoftwareApplication`＋`BreadcrumbList`（M4-03 移到 `src/lib/seo/jsonld/offering.ts`）；header 選單一次只開一個，點選單外或按 Esc 收起
- M3-06 M3 收尾完成（#19）：`design-system` skill 補上「Token 命名」（類別－用途－變體－狀態）與「新增元件」流程，元件表補 `LocaleSwitcher`；`node scripts/design/showcase.mjs` 改為也檢查 skill 的「基礎元件」表與 `src/components/ui/` 一致（漏列的元件、已刪除元件的列）。`CLAUDE.md` 拿掉「新元件必須同步加到 design-system 展示頁」的「（M3 後生效）」
- M3-07 3D scroll 視覺方向原型完成（#54，`design-approved`）：選定方向 B Modular Stack，原型頁 `/prototypes/modular-stack`（three.js，`Scene3D` island），A Data Flow 已刪除；ADR 0003 載入策略；`node scripts/design/lighthouse-3d.mjs` 行動版 0.99、桌機 1，`a11y-smoke.mjs` 加上 3D 場景上的文字對比
- M3-08 動態規範完成（#55）：`docs/design/motion.md` 列出全站的動態效果、適用頁面、減少動態時的呈現與 3D 的效能預算；`tokens.css` 加上 `--duration-loop`、`--delay-step`、`--reveal-stagger`（數值與原本寫在元件裡的相同，畫面不變）；`token-usage.mjs` 擋下 easing 關鍵字與省略 timing function 的 `transition`、`animation`；`npm run check` 加上 `scripts/design/scene-budget.mjs`，每頁初始 JS 6 KB、延後載入的 JS 140 KB（gzip，目前最大 3.0 KB、130.6 KB）；`design-system` skill 的「捲動動態」改寫成「動態」
- M3-09 品牌素材與視覺資產完成（#56）：`docs/design/brand-assets.md` 列出 logo、衍生圖、品牌色、字體、設計影像與 3D 的來源與授權。logo 來自公司行銷部門（只有 AI 檔與 PNG），沒有 logo 使用規範、VI 手冊、色票與指定字體，新站以 `tokens.css` 與 Inter 為基準；不做立體 logo。`src/assets/design/` 的影像由 ChatGPT Enterprise 產生，合約允許使用，沿用不重做
- `issues.yml` 與 GitHub issue 對齊完成（#88）：補 M3-07～09、M3-04/05 的依賴改為 M3-02、M3-07；`node scripts/bootstrap/diff.mjs` 比對兩邊，目前差異 0、重跑 bootstrap 不會新建 issue
- `needs-design` 階段一改走 `/issue-ship` 完成（#84）：`CLAUDE.md`、`issue-start`、`checkpoint`、`workflow.md` 都連到 `issue-ship` 的「`needs-design` 的兩個階段」，`wip:` 合併只寫在 `issue-ship` 第 4 步。#16 留在 `main` 的 `wip:` commit（`1b3a5fe`、`a2508f8`）不改寫
- `status.md` 不再列其他 open PR 完成（#94）：「Issue」段落只列已關閉的 issue，進行中的用 `/next-issue` 查；`node scripts/status/check.mjs` 在 `npm run check` 擋下「待合併」

### M4 開發骨架

- M4-01 content collections 與 Zod schema 完成（#20）：`src/content.config.ts` 定義 9 個內容類型與 `tag`，每個 collection 一筆 zh-TW 範例；不合法的 frontmatter（含不存在的 `ref`）讓 `astro check` 與 build 失敗；tag 清單由 `node scripts/content/tags.mjs` 產生。寫法見 `docs/ia/content-model.md`「Astro 實作」
- M4-02 i18n 路由完成（#21）：語系設定與路徑工具在 `src/lib/i18n/`（`astro.config.mjs` 的 `locales` 從這裡 import），語系切換元件 `LocaleSwitcher`；未翻譯的頁面不產生，切換時連到該語系首頁，連首頁都沒有的語系不列（ADR 0002）；`node scripts/i18n/routes.mjs` 在 build 後檢查 `<html lang>` 與切換連結
- M4-03 共用 SEO 層完成（#22）：head 的 title、description、canonical、hreflang、OG/Twitter、JSON-LD 只由 `src/components/seo/Seo.astro` 輸出，頁面把資料傳給 `BaseLayout`（寫法見 `seo-checklist`「頁面怎麼寫」）；JSON-LD 產生函式依 `content-model.md` 涵蓋全部內容類型（`src/lib/seo/jsonld/`）；hreflang 列出實際存在的語系版本與 `x-default`；`src/integrations/sitemap.ts` 在 build 時寫 `dist/sitemap.xml`，排除內部頁（`src/lib/seo/indexing.ts`），沒有新增套件；`node scripts/seo/meta.mjs` 在 `npm run check` 檢查每頁 head 與 sitemap
- M4-04 各模板 layout 完成（#23，`design-approved`）：共用 `PageLayout`（header、footer、捲動進度），11 個模板在 `src/layouts/templates/`，collection 頁、listing（每頁 12 筆，`/page/n`）、contact、utility 都由 `src/pages/[...path].astro` 產生（draft 不產生）；`/templates` 用範例資料預覽每個模板。語系版本只由 `pageLocales()` 決定，header、footer、麵包屑與 JSON-LD 的連結都加上語系前綴（`scripts/i18n/routes.mjs` 擋下跨語系連結）；非首頁都有 `BreadcrumbList`（`scripts/seo/meta.mjs` 檢查）；sitemap 排除流程頁（`src/lib/seo/indexing.ts` 的 `FLOW_PATHS`）。header 選單補上焦點移出收合、行動版選單的 `inert` 與焦點、`aria-current`。CSS 分層（`src/styles/base.css`）由 `scripts/design/css-structure.mjs` 檢查。M3-01 wireframe 已刪除
- M4-05 品質關卡擴充完成（#24）：`npm run check` 加上站內連結檢查 `scripts/seo/links.mjs`（只豁免 `nodes.csv` 的 external 節點與 `PENDING` 明列的 12 個還沒有內容的頁面，其他連到不存在頁面的連結都失敗）、全站 axe `scripts/design/axe.mjs`（WCAG 2.2 A／AA，485 頁 0 violations）、Playwright 視覺回歸 `tests/visual/`（首頁三語與 10 個模板預覽頁 × 375／768／1280）。視覺回歸只在 CI 的 Playwright image 裡比對，baseline 由 PR 的 `update-visual-baseline` label 觸發 `visual-baseline.yml` 產生（`docs/workflow.md`「視覺回歸」）；雲端 session 與 CI 對貼近換行門檻的行換法不同，所以不共用；quality-gate 改在同一個 image 裡跑，失敗時上傳 `playwright-report` artifact
- M4-06 M4 收尾完成（#25）：`CLAUDE.md` 的目錄結構補上 M4 新增的 `src/` 目錄，新增「頁面與元件」（頁面由 `[...path].astro` 依節點模板產生、`BaseLayout`／`PageLayout`／模板三層、`/templates` 預覽與視覺回歸）；`seo-checklist` 補上 `scripts/seo/links.mjs` 的檢查範圍與 `PENDING` 豁免

### M5 內容遷移

- M5-01 產品內容遷移完成（#26）：現站 zh-TW 產品頁搬進 `offering` 19 筆（digirunner 沿用 M3-05）與 `hub` 7 筆（products、四個產品家族、金融與政府產業頁；family-security 是 draft 新頁），en、vi 交給 M7。依使用者決定只填 schema 既有欄位、不改模板，放不下的段落逐頁列在 `docs/content/products.md`「待確認」。不放 `heroImage`（現站 banner 多為含人物的圖庫照，授權未確認），OG 用站內預設圖。`node scripts/design/offering-content.mjs` 改為也比對 hub 與 merge 的多個 `sourceUrl`，有意修正的現站錯字寫在 `CORRECTIONS`（合併 M5-02 後三語 756/756）；AWS 買家指南 PDF 由 `node scripts/content/offering-files.mjs` 下載到 `public/` 底下的現站路徑（下載檔保留原網址）；產品內容檔建立後重跑 `node scripts/content/migrate/case-studies.mjs`，6 筆 zh-TW 案例補上 offerings
- M5-02 解決方案內容遷移完成（#27）：`node scripts/content/migrate/offerings.mjs` 把 7 個解決方案頁（三語共 21 篇）轉成 offering 內容檔，人工修正在 `scripts/content/migrate/offering-overrides.yaml`（zh-TW 的 description 縮到 80 字內）；zh-TW 7 頁在 `/solutions/*` 產生，en、vi 進版控不產生頁面。介紹段、流程架構圖、三項優勢、適用產業、服務客戶 logo、影片在 offering schema 沒有欄位，使用者決定先不搬（與 digiRunner 相同）。hero 背景圖沒有寫進 `heroImage`：模板只拿它當 `og:image`，banner 的寬高比約 3:1，不是 1200×630。不在導覽的方案照樣發布，是否仍銷售列在 PR。`node scripts/design/offering-content.mjs` 改為比對三個語系，`scripts/lib/page-text.mjs` 補解碼 `&quot;` 等 entity。用法見 `docs/content/migration.md`「解決方案頁」
- M5-03 客戶案例遷移完成（#28）：現站沒有案例內頁，`/success-story` 的卡片資料在 Nuxt JS chunk 裡，`node scripts/content/migrate/case-studies.mjs` 轉成每筆一個有內頁的內容檔（zh-TW 61、en 61、vi 58，vi 少 3 筆 RPA 案例）與 logo。使用者決定：每案都有內頁；`case-study` 的 `challenge`、`solution`、`publishedAt`、`offerings` 改選填並加上 `order`；客戶名稱與 logo 照現站顯示（`disclosed: true`），授權待確認；產業對應金融、保險 → `finance`，政府 → `government`，其餘 → `other`。客戶名稱與 zh-TW description 寫在 `case-studies.yaml`，用法見 `docs/content/migration.md`「成功案例」
- M5-04 部落格與新聞批次轉換 script 完成（#29）：`node scripts/content/migrate/migrate.mjs` 依 `page-map.csv` 把現站 blog 與新聞轉成內容檔，圖片下載到 `src/assets/<type>/<locale>/<slug>/`（內容圖的目錄規則改為含語系，whitepaper 範例一起搬）；人工修正寫在 `scripts/content/migrate/overrides.yaml`，重跑結果不變。用法與報告欄位見 `docs/content/migration.md`。全量試跑 622 列（併入 merge 列後 620 篇）：轉出 533 篇、`astro check` 通過；失敗 87 篇，其中 69 篇的圖片網域被雲端環境的 network policy 擋下、15 篇 vi 現站沒有作者、3 篇不在 blog API。試跑產出不 commit，只重新產生兩筆範例。en、vi 的 `newsTypeId` 依現站名稱對應（`content-model.md`「news」，待確認）。html-validate 的 `valid-id` 改為 `relaxed`（數字開頭的標題產生的 id）
- M5-05 部落格與新聞遷移完成（#30）：使用者決定 blog 與新聞只遷移 2026-01-01 起的文章，`scripts/inventory/audit.mjs` 的保留門檻改為 2026-01-01（新聞原為 2024-01-01），重跑後 `inventory.csv`、`page-map.csv`、`redirects.csv` 跟著更新，舊文章 301 到列表頁。`migrate.mjs` 轉出 83 篇（blog zh-TW 13、en 8、vi 34，新聞 zh-TW 10、en 9、vi 9）與 128 張圖，失敗 5 篇列在 PR；全量執行會刪掉不在 `page-map.csv` 的內容檔。圖片下載後縮到最大寬 1600 px、存成 WebP。`overrides.yaml` 新增 `dropImagesFrom`（依主機或圖片網址拿掉圖與圖說）。zh-TW 的 `description`、內文圖 alt 寫進 `overrides.yaml`；en、vi 延到 M7。collection 頁只對有字串檔的語系產生（en、vi 的內容先進版控，M7 補字串檔後產生頁面），內文跨語系連結改成本篇語系的同一頁。抽查用 `node scripts/content/migrate/spot-check.mjs`（`docs/content/migration.md`「抽查」）
- M5-06 公司頁內容遷移完成（#31）：zh-TW 的關於我們、聯絡我們、合作夥伴與 4 個法務頁上線（`/about-us`、`/contact-us`、`/partners`、`/privacy`、`/terms`、`/disclaimer`、`/security-policy`）。公司頁手寫，`node scripts/content/page-content.mjs` 逐行對照現站；法務頁由 `node scripts/content/legal-pdf.mjs` 從現站 PDF 轉換，寫檔前逐字比對 PDF 文字（`docs/content/company-pages.md`）。`organization/zh-TW.yaml` 補齊現站 8 個據點。現站 zh-TW 合作夥伴頁是空的，改用 en 版翻譯。en、vi 的 about、partners、contact 進版控，不產生頁面。en 法務 PDF（2020 年版）、vi 隱私權 PDF（內容是應徵者個資告知）沒有搬
- M5-07 M5 收尾完成（#32）：`content-migration` 改為依內容類型列出轉換或對照現站的 script、人工修正的位置與說明文件（產品頁、公司頁、法務頁補上）；新增 schema 沒有欄位的段落不搬、`heroImage` 與 OG 圖、人物照授權、network policy 擋圖、en 與 vi 內容檔先進版控的規則。`CLAUDE.md`「內容規則」指向這些規則
- `issues.yml` 的 `dependsOn` 能寫沒有 bootstrap id 的 issue 完成（#108）：`{ issue: <編號>, note: <說明> }` 輸出成 `- #<編號>（<說明>）`，`validate` 檢查編號與說明。M5-07（#32）的依賴補上 #106、#107，`node scripts/bootstrap/diff.mjs` 差異回到 0
- `esg-advisory` 服務頁與 ESG 顧問頁內容遷移完成（#107）：`node scripts/content/migrate/esg-advisory.mjs` 把 `/esg-advisory` 三語轉成 `offering`（`kind: service`，tagline、轉型策略三階段、FAQ），顧問頁轉成 `person`（zh-TW 8、en 9、vi 8，取代 M4-01 的 draft 範例）；照片授權未確認不放，`description` 由頁面上的姓名、職稱、單位與專長組成。`OfferingTemplate` 加上「ESG 顧問團隊」段落（只在 person 節點的上層是這個 offering 時出現，依新的 `person.order` 排序），只用既有 `Card`。zh-TW 服務頁的 4 位顧問沒有個人頁，依使用者決定不建內容檔。`offering-content.mjs` 改為也比對 person（1261/1261）。`serializeFrontmatter` 的字串陣列在 flow 寫法讀不回原值時改寫成 block list。用法見 `docs/content/migration.md`「ESG 顧問服務」
- `orient-ai`、`aiso` 服務頁內容遷移完成（#106）：`node scripts/content/migrate/offerings.mjs` 另外轉這兩個服務頁（三語 6 篇，版型各自的 extractor 在 `TEMPLATES`），`page-map.csv` 的 merge 列（`/orient-aI`）接在 `sourceUrl` 後面；zh-TW 的 `/orient-ai`、`/aiso` 上線，`/products/systalk-ai` 子頁卡片的失效連結補上。`page_type` 是 service，`kind` 依使用者決定填 `product`；family-ai hub 的 `highlights`（取自 `systalk-ai-phison`）依使用者決定維持在 family-ai，不移到 aiso。沒有欄位的段落見 `docs/content/migration.md`「服務頁」。`offering-content.mjs` 新增 110 行，含 #107 的 person 全部是 1371/1371

### M6 功能

- M6-01 表單完成（#33）：`/contact-us`（三語）的表單送到 Pages Function `functions/api/contact.ts`。規則表 `src/lib/forms/rules.ts` 的 `validate()` 前後端共用，伺服器為準；順序是 secret 檢查（沒設定就拒絕）→ 欄位驗證 → Turnstile → adapter，預設的 log adapter 只記表單 id、欄位名稱與時間。Turnstile 在第一次 focus 進表單時才載入，預留空間寬度不到 300px 用 compact。成功後導到該語系的 `/thanks`。表單狀態（錯誤摘要、欄位與多選題錯誤、送出中、送出失敗）用新元件 `FormGroup` 與 `FormPanel` 的 `errors`、`message`、`form`。`node scripts/forms/contact.mjs` 接進 `npm run check`（ADR 0005）
- M6-02 Pagefind 站內搜尋完成（#34，`design-approved`）：`src/integrations/pagefind.ts` 在 `astro build` 時產生 `dist/pagefind/`（zh-tw 133、en 122、vi 146 頁，依 `<html lang>` 分開）；索引範圍由 `PageLayout` 的 `searchTrail` 決定（七個內容模板，首頁、listing、contact、utility 不進）。Pagefind 的中文字典是簡體，繁體會切成單字，zh-TW 頁改用 `Intl.Segmenter` 預先斷詞後建索引（`src/lib/search/segment.ts`，「企業」從 7 頁變 53 頁）。`/search` 的結果由新元件 `SearchResults` 畫，只有它載入 Pagefind；頁首搜尋框是送到 `/search` 的 GET 表單。`node scripts/search/pagefind.mjs` 接進 `npm run check`，`/search?q=企業` 加進 LHCI 的 `PAGES`（16 頁）（ADR 0006）
- M6-03 影片延遲載入完成（#35）：新元件 `VideoFacade`。初始只有本機 poster 與原生按鈕，播放器（YouTube 用 `youtube-nocookie.com` 的 iframe，自架 MP4 用 `<video>`）放在 `<template>`，點擊後才換上並取得焦點；poster 不用 YouTube 縮圖，首次載入不連任何站外網域。`node scripts/design/video-facade.mjs` 接進 `npm run check`，對每個有 facade 的頁面檢查載入時沒有站外請求、鍵盤 Tab＋Enter 能換上有 `title` 的播放器並取得焦點。目前只有 `/design-system` 使用：現站影片在產品、服務、about 頁，offering schema 沒有影片欄位，M5 決定不搬
- M6-04 GTM 與 consent 管理完成（#36，`design-approved`）：新元件 `ConsentBanner`（底部的深色橫幅，加上原生 `<dialog>` 的偏好設定）與頁尾的「Cookie 設定」，只在 build 有 `PUBLIC_GTM_ID` 時由 `PageLayout` 輸出。同意至少一個非必要類別前不載入 gtm.js，也沒有 `dataLayer`，不用 Consent Mode 的 advanced 模式；選擇存在 `localStorage` 的 `tpi-consent`，撤回時重新載入頁面。類別與三語文案在 `src/data/consent.ts`，目前是 `draft: true` 的佔位內容，有 ID 但還是 draft 時 build 失敗。`node scripts/consent/gtm.mjs` 接進 `npm run check`：用測試 ID 另外 build 一份，在瀏覽器檢查同意前沒有站外請求、拒絕、同意、撤回與鍵盤操作（ADR 0007）
- M6-05 M6 收尾完成（#37）：`CLAUDE.md` 新增「功能模組」：互動寫在元件內的 `<script>`、不碰 DOM 的判斷放 `src/lib/<模組>/` 寫單元測試、頁面載入時不連站外網域、secret 只放環境變數，以及表單、站內搜尋、影片、cookie 同意與 GTM 各一條規則（細節連到 ADR 0005–0007 與 `design-system` 元件表）。「技術棧」、ADR 0001 與 `typescript-best-practices` 的「互動才用 island（`client:*`）」改成實際寫法（`src/` 沒有 `client:*`）。`pr-review` 固定檢查加上站外請求與 secret 一列
- `dist/` 沒變時不重跑 Lighthouse 完成（#149）：`npm run lighthouse` 通過後把 `.lhci-dist/` 與量測設定（`scripts/lhci-pass.mjs` 的 `INPUTS` 與 `LHCI_*` 環境變數）的 key 寫到 `.lighthouseci/passed-dist.sha256`，下次 key 相同就跳過並印出 key，`LIGHTHOUSE_FORCE=1` 強制重量，`lighthouse:all` 不受影響。quality-gate 用同一個 key 做 cache，同一個 PR 量過且通過的 `dist/` 不重量，job summary 寫明。`issue-start` 的環境檢查改跑 `npm run check:before-lighthouse`（ADR 0004「例外：量過且通過的 `dist/` 不重量」）

### M7 多語系

- M7-01 翻譯詞彙表完成（#38）：`docs/i18n/glossary.csv` 列出產品、頁面、選單標籤與介面字串的 zh-TW／en／vi 對照（155 列），由 `node scripts/i18n/glossary.mjs` 依 `nodes.csv`、`navigation.csv`、`src/data/strings/zh-TW.ts` 產生，`--check` 在 `npm run check` 擋下過期與不合格的列。產品與頁面名稱的 en、vi 只取現站寫法（en、vi 內容檔的 `title`、`inventory.csv` 的選單文字），現站沒有就留空；介面字串與選單標籤由 AI 草擬（`draft`）。使用者決定產品名不加描述、en 與 vi 一律用產品名，公司名用 TPIsoftware，這 26 列已是 `confirmed`；沒有產品名的 product 列、page 列與 AI 草擬的介面字串在 M7-02、M7-03 翻譯時確認（`docs/i18n/glossary.md`「已確認的規則」）
- M7-02 en 翻譯完成（#39）：加上 `src/data/strings/en.ts`、`src/data/home/en.ts`、`organization/en.yaml`，en 共 144 頁（全站 314 頁）。產品頁 17 篇與 hub 6 篇從現站 en 版手寫（`offering-content.mjs` 1731/1731）；隱私權政策與使用條款由 `legal-pdf.mjs` 取 zh-TW PDF 的英譯（每段比對 PDF）；blog、新聞、案例、方案頁補 `seoTitle`、description、alt（寫在各轉換 script 的 overrides），轉換 script 寫 en、vi 時把全形標點換成半形（`latinPunctuation`）。`glossary.mjs` 檢查 en、vi 字串檔與詞彙表一致，`routes.mjs` 擋下 en、vi 頁面上的中文與全形標點。en 名稱多為 AI 草擬（`draft`）。現站 en 沒有的 digicare、systalk-audit、systalk-icr、digilogs-detection、chatgpt-enterprise 與免責聲明、資訊安全政策沒有 en 頁，選單連到 zh-TW 版
- M7-03 vi 翻譯完成（#40）：vi 頁面上線（`src/data/strings/vi.ts`、`src/data/home/vi.ts`）。產品頁與 hub 的 vi 內容檔：現站 vi 有對應頁的照抄 vi 頁（`offering-content.mjs` 對照），沒有的 8 頁從 zh-TW 翻譯（登記在 `TRANSLATED`）；`glossary.csv` 的 vi 欄補齊（AI 草擬或取自現站，仍是 `to-confirm`／`draft`）（`glossary.mjs` 的字串檔檢查見 M7-02）。既有 vi 內容的 description、`seoTitle`、內文圖 alt 寫進各 migrate script 的 overrides；`organization/vi.yaml` 取自現站 vi 關於我們。`migrate` 的 title 長度改用 HTML 跳脫後的長度，`html-to-markdown` 跳脫文字中的 `<`。法務頁不產生 vi 版。待確認見 `docs/content/products.md`「vi（M7-03）」與 `docs/i18n/glossary.md`「vi 待確認」
- M7-04 hreflang 驗證完成（#41）：既有的 `node scripts/seo/meta.mjs` 已檢查單向、指向沒有 build 的頁面與 `x-default`。這次補上兩項：同一路徑（去掉語系前綴後相同）的其他語系版本已經 build、hreflang 卻沒列出（例如 dynamic route 忘了傳 `translations`），以及同一個 hreflang 值重複。結尾輸出各語系頁數（目前 485 頁：zh-TW 170、en 144、vi 171）。`package.json` 的 `check` 串接沒改
- M7-05 M7 收尾完成（#42）：`content-migration` 的「en、vi 的內容檔」改寫成「多語系內容」：en、vi 內容的來源順序（現站該語系 → 決定要有這一頁時從其他語系翻譯並登記 `TRANSLATED` → 其他情況不產生頁面、連到 zh-TW 版，法務文件不由 AI 翻譯）、用語照 `glossary.csv`、description 與 `seoTitle` 等修正寫在各類型的 overrides、改了 zh-TW 之後要跟著改的地方；`seo-checklist` 加上「多語系頁面」；`CLAUDE.md` 的語系、IA 與內容規則指向這兩處。blog 三語的 `translationKey` 在 M7 沒有對應，仍列在 `content-model.md`「待確認」
- M7 語系共用基礎完成（#114）：加上 `src/data/strings/<locale>.ts` 與 `src/data/home/<locale>.ts` 就啟用該語系，不用改共用檔案。選單、footer、麵包屑與 `BreadcrumbList` 的名稱在 en、vi 讀 `docs/i18n/glossary.csv`，沒有譯名時 build 失敗（`docs/ia/navigation.md`「語系」）；首頁改為 `HomeTemplate` 加 `src/pages/[locale]/index.astro`；`og:locale` 是 `zh_TW`／`en_US`／`vi_VN`，en、vi 的 title 後綴是 ` | TPIsoftware`；站內連結在該語系沒有頁面時連到 zh-TW 版（`src/lib/ia/built.ts`），listing 的 hreflang 依各語系實際頁數；`routes.mjs` 新增 en、vi 連到未產生頁面與檔案連結的檢查。`node scripts/i18n/locale-fixture.mjs <en|vi> --no-content` 用測試字串檔驗證，兩語都通過

### M8 驗收

- M8-01 全站驗收完成（#43）：`docs/launch/audit.md` 逐項記錄 `npm run check` 每個子檢查、redirect map、全站 Lighthouse 與內容待確認的結果。新增 `scripts/ia/redirect-targets.mjs`（`npm run check`）：`redirects.csv` 每一列的目標都要在 `dist/` 建出、沒有轉址鏈，已知沒建出的目標列在 `UNBUILT`（#137）。`npm run lighthouse:all` 485 頁中 483 頁達標，另外 2 頁重跑後 0.98；成功案例的客戶 logo 加上 2x（ADR 0004「M8-01 重跑」）。無法當場修的問題開 #137、#138、#139
- M8-02 launch-readiness 報告完成（#44）：`docs/launch/launch-readiness.md` 的結論是目前不能上線，列出上線前要完成的 6 個條件、8 個上線步驟（`SITE_URL`、Turnstile、GTM、`_redirects`、開放收錄、切換網域）、上線後的 curl 檢查、10 項風險與 12 個待決事項，負責人都寫「待確認」。`_redirects` 推薦部署，前提是 #137、#138、#139 完成，#139 的實測結果決定能不能照現在的產出部署
- M8-03 M8 收尾完成（#45）：`CLAUDE.md` 的目錄結構補上 `src/assets/`、`docs/design/`、`launch-readiness.md`，新增 `node scripts/docs/claude-md.mjs`（`npm run check`），目錄結構漏列頂層目錄或 `src/`、`src/lib/`、`scripts/`、`docs/`、`public/`、`functions/`、`tests/`、`.github/` 的直接子目錄時失敗；`.github/scripts/`、`public/` 的 `og/`、`pdf/` 一起補上。「專案目標」寫明 M8 之後的維運（issue form 開需求、不掛 milestone）與上線照 `launch-readiness.md`，開放收錄的 PR 同時改哪些規則；「文件維護」改成維運期間由改了架構或流程的 PR 自己更新。`issue-ship` 第 3 步補上沒有進行中 milestone 時寫在「維運」小標；拿掉 skills 裡只在開發中途成立的 milestone 寫法（`seo-checklist`、`content-migration`、`writing-style`、`design-system`），README 的 network access 改連到 `onboarding.md`
- logo 改用 AI 檔轉出的 SVG 完成（#122）：`node scripts/design/import-brand.mjs <AI 檔資料夾>` 用 `pdftocairo` 把行銷部門的 AI 檔轉成 SVG，刪掉反白版的預覽底色與空字形、裁掉留白，產生 `src/assets/brand/logo-*.svg`、favicon 與 apple-touch-icon；header、footer 與 `public/og/default.png` 改用 SVG，顯示高度不變；JSON-LD 的 organization `logo` 用 script 從 SVG 產生的 PNG。AI 原始檔不進 repo（`docs/design/brand-assets.md`）
- `npm run check` 的 LHCI 涵蓋所有模板完成（#87）：`lighthouserc.cjs` 的 `PAGES` 是每個模板在全站量測中分數最低的一頁，加上三語首頁與 404，共 15 頁；`scripts/lhci-prepare.mjs` 在路徑不存在或有模板沒有代表頁時失敗（ADR 0004）。`npm run lighthouse:all` 測全部 485 頁，第一次 202 頁沒達標，修掉 vi 字型（多下載 `latin-ext` subset）、新聞內頁圖片（手機下載 1440w 封面與 1600px 內文原檔）與 `/en` 的「Learn More」連結文字後，剩下載入 3D 的 59 頁，交給 #127，這段期間 3D 頁的 performance 只 warn
- 只改文件的 PR 在 quality-gate 跳過 Lighthouse 完成（#129）：變更的檔案全部在 `scripts/ci/lighthouse-scope.mjs` 的 `DOCS_ONLY` 白名單內時，quality-gate 不跑 Lighthouse，改跑 `node scripts/ci/lighthouse-scope.mjs --verify`：拿掉這些檔案重新 build，`dist/` 逐檔相同才通過，白名單失效時會在這裡失敗。job summary 寫明原因。`npm run check` 拆成 `check:before-lighthouse` 與 `lighthouse`，本機行為不變（ADR 0004「例外」）
- 3D 場景頁面的 TBT 降到 Lighthouse performance 門檻內完成（#127）：3D 初始化的每一步各自一個 task，canvas 上頁面前先畫完第一個 frame 並等 GPU 做完（headless Chromium 的 compositor 讀回 canvas 時要等 SwiftShader 編譯 shader，原本是一個約 250 ms 的模擬長任務），WebGL 偵測建立的 context 直接交給 renderer；`Scene3D` 等 hero 圖的 LCP entry 才載入 3D。`npm run lighthouse:all` 485 頁全部 performance ≥ 0.95，3D 的 60 頁 0.97–0.99；`lighthouserc.cjs` 拿掉 3D 頁的 warn。`scripts/lib/static-server.mjs` 加上 gzip，`lighthouse-3d.mjs` 的數字和 LHCI 一致（ADR 0003「初始化的長任務」）
- quality-gate 的 Lighthouse 卡住時提早失敗完成（#136）：`npm run lighthouse` 經過 `scripts/lhci-run.mjs`，單次量測超過 3 分鐘就印出 URL、Chrome 的 process 與 DevTools targets 並 exit 1，job summary 寫出卡住的頁面，CI 的 Lighthouse step 另有 15 分鐘上限。卡住的位置推測是 Lighthouse 測 BFCache 時沒有上限的導頁（`BFCacheFailures`），依使用者決定跳過 weight 0 的 `bf-cache` audit。原本推測的 3D 等待已排除，仍各加 1 秒上限（`scripts/design/scene-wait.mjs` 接進 `npm run check`）。Chrome flags 的環境變數改名為 `LHCI_SETTINGS__CHROME_FLAGS`，舊名會蓋掉 `lighthouserc.cjs` 的 `settings`（ADR 0004「卡住的量測與時間上限」、ADR 0003「等待的上限」）
- 剛好 0.95 的頁面在 Lighthouse 門檻留出餘裕完成（#143）：4 頁卡住的原因是首次繪製或 LCP 前下載的字型與圖片，不是 CSS。字型改由 `src/styles/base.css` 只宣告 Inter、JetBrains Mono 的 latin、vietnamese、greek subset，contact 頁不再為地址的「ō」下載 83 KB 的 `latin-ext`；`scripts/design/font-subsets.mjs`（`npm run check`）擋下這三個 subset 以外的字元，例外列在 `ALLOWED`。文章頁的「More」區塊加 `content-visibility: auto`，封面 `quality={70}`。本機行動版 `/en/contact-us`、`/vi/contact-us`、`/vi` 0.98，`/media-center/572` 0.97；`npm run lighthouse:all` 485 頁全部達標，performance 最低 0.97。quality-gate 在 Lighthouse 失敗時上傳 artifact `lighthouse-report`。CSS 全部 inline 只多 0.01–0.02 分，不採用（ADR 0004「剛好 0.95 的頁面」）

### 維運

- redirect 目標頁沒有建出的 12 列完成（#137）：`dropImagesFrom` 拿掉現站也是 404 的 Google 圖片縮圖後，vi 的 `nosql-la-gi`、`server-la-gi` 補上內容。其他 10 列沒有內容可補，寫在手寫的 `docs/ia/redirect-overrides.csv`，`redirects.mjs` 用它取代 `page-map.csv` 的目標：不在現站 blog API 的 3 篇轉到分類列表頁，digiMars、digiRunner 的下載頁三語轉到產品頁（現站下載走 API，沒有可搬的檔案），`/vi/privacy` 轉到 `/privacy`（vi PDF 不是網站的隱私權政策）。`redirect-targets.mjs` 刪掉 `UNBUILT`，`www.tpisoftware.com` 的 301 來源在 `dist/` 有建出時失敗（`docs/ia/redirects.md`「對照規則」）

## 下一步

- 指派 `docs/launch/launch-readiness.md`「待決事項」D1–D12 的負責人並回覆，其中正式網域（D1）與表單送出到哪裡（D4）會卡住上線
- 回覆 #137 PR 的「待確認」：`/vi/privacy` 轉到 zh-TW 的 `/privacy`、vi 兩篇 blog 縮短的 `seoTitle` 與 `description`
- 提供導覽連到但沒有建出的 12 頁的內容（#138，needs-input）
- 回覆 M7-03（#40）PR 的「待確認」：越南文審稿（詞彙表 vi 欄、從 zh-TW 翻譯的 8 頁、`glossary.md`「vi 待確認」的專有名詞）、現站 vi 與 zh-TW 的事實差異（`docs/content/products.md`「vi 待確認」）、vi footer 電話
- 回覆 #106 PR 的「待確認」：未搬的段落（數字、AI 硬體方案）、en、vi aiso 現站 `<title>` 是「昕力資訊」
- 回覆 #107 PR 的「待確認」：顧問是否仍合作中、照片授權、三語顧問名單的差異（zh-TW 沒有 huang-zhijun、vi 的 li-shuhui 連結拼錯）、zh-TW 服務頁 4 位沒有個人頁的顧問、黃煒盛兩處單位不同、服務頁沒搬的段落
- 回覆 M5-02（#27）PR 的「待確認」：不在導覽的方案是否仍銷售、`uiux` 等的 `kind`、略過的段落要不要擴充 content model、案例中客戶名稱的授權
- 回覆 M5-05（#30）PR 的「待確認」：圖片授權與人物、失敗的 5 篇、作者 `authorType`
- 首頁與產品頁的最新文章改讀 content collections（#101）可以開始
- 回覆 M5-06（#31）PR 的「待確認」：合作夥伴頁的翻譯、法務文件是否要法務審閱、資訊安全政策的生效日、en 法務頁的英譯、關於我們的圖片授權
- 回覆 M5-03（#28）PR 的「待確認」：客戶名稱與 logo 的使用授權、內頁內容只有一段描述、獎項與年份、產業對應
- 回覆 `docs/content/products.md`「待確認」（M5-01）：banner 圖庫照能否沿用、各頁未搬的段落要刪減或擴充 content model、feature 數量多的產品頁捲動長度、價格與認證等可能過時的說法
- 回覆 M6-04（#36）PR 的「待確認」：cookie 同意要遵循的法規或公司政策、cookie 要分哪幾類（跟 GTM 放哪些 tag 有關）、三語文案由誰提供；提供後填進 `src/data/consent.ts` 並改成 `draft: false`
- 回覆 M6-02（#34）PR 的「待確認」：en、vi 搜尋字串的譯文（`glossary.csv` 的 `draft`）、是否要加分類篩選
- 回覆 M6-01（#33）PR 的「待確認」：錯誤訊息與「閱讀隱私權政策」的文案、en、vi 新字串的譯文；表單改送 `/tpi/api/*` 要等 `docs/research/features.md` 待確認 1、2
- 回覆 M6-03（#35）PR 的「待確認」：現站產品、服務、about 頁的影片要不要放回新站（要在 offering schema 加影片欄位、改模板、下載自架 MP4）
- 回覆 PR #98「待確認問題」：listing、utility、contact 頁的暫定描述（`src/data/strings/zh-TW.ts` 的 `pages`）、聯絡表單的諮詢產品選項、個資同意與 AI Playbook 欄位文案、`industry: other` 的顯示名稱
- 回覆 `docs/ia/content-model.md` 文末「待確認」，特別是 tag 清單（`src/content/tags.yaml` 的名稱目前取自現站）
- 在 preview 實測 `_redirects` 的大小寫與 `%` 編碼比對（#139）可以開始
- Review M1-02 稽核結果，回覆 `docs/research/content-audit.md`「內容負責人要確認」
- Review M1-03 SEO 基線（`docs/research/seo-baseline.md`）
- Review M1-04 功能盤點（`docs/research/features.md`），向後端負責人與行銷確認文末「待確認」
- 回答 `docs/research/audience-and-goals.md`「尚未回答的問題」其餘 6 題（第 2、5 題已在 M2-01 暫定）
- 回覆 #39 PR 的「待確認」：glossary 的 AI 草擬譯名、en 頁面沒搬的段落與照抄的錯字、不在詞彙表的專有名詞、現站 en 沒有的產品頁、en 法務頁是否需法務審閱
- 以 `/next-issue` 找出下一張可開始的 issue

## 待辦備忘

- M1-03 沒有流量與外部連結資料（無 GA4／Search Console 權限），重要頁面無法依流量排序；M2 的 redirect 對照要涵蓋所有 `keep`／`rewrite`／`merge` 頁面，不能只做 P1／P2。.com origin 層級的 field CWV 尚未取得
- Node 26 預計 2026-10-28 進入 Active LTS，屆時將 `.nvmrc` 升為 `26`（同步 Cloudflare Pages 的 `NODE_VERSION`）；雲端 session 的 SessionStart hook 會自動依 `.nvmrc` 切換
- 現站 `/sitemap.xml` 與 `/ja` 回 500，盤點改以導覽與連結爬取為準（見 `docs/research/inventory.md`）
- M1-02 稽核的 M2 待決事項（日文版、不在導覽的產品、主題重疊頁面、舊 `/solutions/*` 路由、blog 分類）已在 M2-01 依推薦決定，見 `docs/ia/sitemap.md`「決策紀錄」；不在導覽的 6 個產品／方案是否仍銷售，M5 前需內容負責人確認
- 工作流程 skills：`/issue-start`、`/checkpoint`、`/issue-ship`、`/pr-review`、`/next-issue`，使用說明見 `docs/workflow.md`（#50、#62、#69、#71）。沒有 `needs-design`、`needs-input`，計畫也沒有待決事項的 issue 走自動模式，人工只負責啟動、回覆 `needs-decision`、看合併判斷摘要後合併。專案固定檢查只寫在 `.claude/skills/pr-review/SKILL.md`
- 已從 pstack 導入 `typescript-best-practices`、`writing-style`、`CLAUDE.md` 工作原則、`/issue-ship` 自我 review（#50，#62 移到 `/pr-review`）。pstack 的 `create-verification-skill`（以 Playwright 實際操作網站並留存證據）M4-05（#24）沒有導入：M4-05 的檢查都是對 build 產出的靜態比對（axe、連結、截圖），M6 的互動流程也沒有導入，改由各模組自己的 Playwright script 驗證（`scripts/forms/contact.mjs`、`scripts/search/pagefind.mjs`、`scripts/design/video-facade.mjs`、`scripts/consent/gtm.mjs`，都在 `npm run check`）
- 日文版：M2-01 決定不支援，M2-05 將 `/ja/*` 301 到 `/en`（現站 `/ja`、`/ja/partners` 回 500）
- M2-05：`www.tpisoftware.vn` 的轉址不能放進 `_redirects`（不支援網域層級），`.vn` 網域去留決定後改用 Bulk Redirects 等方式處理
- M1-04：表單建議沿用現站 `/tpi/api/*` 後端，需後端開放新站網域的 CORS 並確認 reCAPTCHA 設定；GTM 等追蹤碼由新站重新規劃，不沿用現站 4 個容器；.com 站內搜尋 API 目前回 500（見 `docs/research/features.md`）
- M1-05：主要轉換為聯絡業務；新站只用 GTM、需要 cookie 同意機制、Facebook Pixel 與 Ahrefs 不沿用；成功指標包含自然搜尋流量，但沒有 GA4／Search Console 權限，量測方式待定（見 `docs/research/audience-and-goals.md`）
- M2-04：產品 JSON-LD 定為 `SoftwareApplication`、解決方案與服務為 `Service`（`seo-checklist` 的 JSON-LD 對照改為連到 `content-model.md`）；新頁的 `sourceUrl` 寫 `[]`。blog 作者資料品質、轉載授權、三語版本對應、白皮書檔案位置待確認（見 `docs/ia/content-model.md`「待確認」）
- M2-03：三語系同網域，vi 從 `www.tpisoftware.vn` 改為 `/vi`；`.vn` 網域上線後是否保留為轉址來源，與正式網域一起決定
- i18n 字串檔在 `src/data/strings/<locale>.ts`（M4-04 決定）：介面字串與 listing、utility、contact 頁的描述。這些頁沒有內容檔，只為有字串檔的語系產生；描述是暫定文案，上線前由內容負責人替換。有字串檔就算啟用該語系，同時要有首頁文案 `src/data/home/<locale>.ts`（#114）
- 正式網域未定；`astro.config.mjs` 的 `site` 目前以 `SITE_URL` 環境變數覆寫，預設 `https://tpi-website-ai-poc.pages.dev`
- M3-02 改為深色場景＋亮色閱讀頁的雙 surface，3D 共用視角寫在 `tokens.css` 的 `--scene-angle-*`、`--perspective`；M3-07（#54）的 three.js 相機已從這兩個值換算（`src/lib/scene/runtime.ts`），方向 B 的方塊材質在 M3-04 寫成 `--scene-block-*`、`--scene-rim-*`
- `SiteHeader`、`SiteFooter` 在 `PageLayout`；選單的鍵盤操作依 `docs/ia/navigation.md`「無障礙」完成（M4-04），axe 檢查由 M4-05（#24）接手。正式 header 的 en、vi 寬度已實測（`node scripts/design/header-fit.mjs`，`docs/design/nav-fit.md`「正式 header」），`en-long` 在 1024px 只剩 2px。logo 是行銷部門 AI 檔轉出的 SVG（`node scripts/design/import-brand.mjs <AI 檔資料夾>` 匯入 `src/assets/brand/`、favicon，OG 圖由 `og-image.mjs` 產生），沒有使用規範（`docs/design/brand-assets.md`）
- 首頁行動版 Lighthouse performance 中位數 0.94（`node scripts/design/lighthouse-3d.mjs /`，2026-10-23，各跑 3 次），單次在 0.91–0.96 之間浮動；#127 後是 0.99（2026-10-26，量測的 server 加上 gzip 後）。M4-04 比較了三種 CSS 載入方式：現狀（3 個 CSS 檔）、`build.inlineStylesheets: 'always'`、小檔 inline，分數都是 0.94；全部 inline 讓 FCP 快約 450 ms、LCP 快約 150 ms，但每頁 HTML 從 23 KB 變 89 KB、換頁沒有 CSS 快取，所以維持現狀。#143 在 contact 頁重比，全部 inline 只多 0.01–0.02 分，同樣不採用；剛好 0.95 的頁面卡在首次繪製前下載的字型與圖片，不是 CSS（ADR 0004「剛好 0.95 的頁面」）。preview 上的真機量測還沒做
- 首頁的最新文章與新聞由 `src/lib/latest-posts.ts` 從 `inventory.csv` 選出，卡片封面暫用抽象圖；文章已在 M5-05 遷移，改讀 content collections 並刪除這個檔案的工作在「下一步」。`src/lib/ia/navigation.ts` 是正式頁面用的導覽讀取（節點讀 `src/lib/ia/nodes.ts`，與 #91 的同名檔相同），刪 wireframe 時保留
- OfferingTemplate、ContentTemplate、HubTemplate 直接拿 `heroImage`（或 `ogImage`）當 `og:image`，不裁成 seo-checklist 要的 1200×630。M5-02 因此沒有把現站 banner（寬高比約 3:1）寫進解決方案頁的 `heroImage`；模板裁切後再補，banner 位置見 `docs/content/migration.md`「解決方案頁」
- M3-05、M5-01：現站產品頁有 content-model 沒有欄位的段落（digiRunner 的 AI Gateway、五大應用等，其他產品的方案表、導入流程、數字等），M5-01 依使用者決定只填既有欄位，逐頁列在 `docs/content/products.md`「待確認」；要擴充 content model 時另開 issue。`useCases.industry` 沒有保險、醫療、物聯網，這些情境沒有產業連結
- 本專案是 PoC，不設定 Cloudflare 的 Turnstile 與環境變數（使用者 2026-10-27 決定）。聯絡表單在 preview 上送出一律失敗（沒有 `TURNSTILE_SECRET_KEY` 時 fail closed），表單行為由 `npm run check` 的 `scripts/forms/contact.mjs` 驗證。正式上線時照 ADR 0005「設定」建立 widget、設定 `PUBLIC_TURNSTILE_SITE_KEY` 與 `TURNSTILE_SECRET_KEY`，見 `docs/launch/launch-readiness.md`「上線步驟」第 3 步
- 正式上線要開追蹤時照 ADR 0007「設定」：填好 `src/data/consent.ts` 的類別與三語文案並改成 `draft: false`、在 GTM 設定 tag 的同意條件、在 Cloudflare 設定 `PUBLIC_GTM_ID`；沒有設定 ID 時不顯示同意橫幅，也不載入 GTM。見 `docs/launch/launch-readiness.md`「上線步驟」第 4 步
- 正式上線時 `robots.txt` 改成允許收錄並加上 `Sitemap:` 行（M4-03 起 `dist/sitemap.xml` 已產生，上線前 `robots.txt` 不指向它），見 `docs/launch/launch-readiness.md`「上線步驟」第 6 步
- M8-01 的全站驗收在 #36（GTM／consent）、#101（最新文章改讀 collection）合併前執行，這兩處的結果標「待這兩張合併後重驗」。兩張都合併後在 `main` 重跑 `npm run check` 與 `npm run lighthouse:all`，結果補進 `docs/launch/audit.md`
