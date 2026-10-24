# 專案狀態

最後更新：2026-10-24

## 目前 milestone

**M3 設計系統**、**M4 開發骨架**、**M5 內容遷移**

## 進度

| Milestone | 狀態 |
|---|---|
| M0 基礎建設 | 完成 |
| M1 盤點與研究 | 完成 |
| M2 資訊架構 | 完成 |
| M3 設計系統 | 進行中 |
| M4 開發骨架 | 進行中 |
| M5 內容遷移 | 進行中 |
| M6 功能 | 未開始 |
| M7 多語系 | 未開始 |
| M8 驗收 | 未開始 |

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
- M3-07 3D scroll 視覺方向原型完成（#54，`design-approved`）：選定方向 B Modular Stack，原型頁 `/prototypes/modular-stack`（three.js，`Scene3D` island），A Data Flow 已刪除；ADR 0003 載入策略；`node scripts/design/lighthouse-3d.mjs` 行動版 0.99、桌機 1，`a11y-smoke.mjs` 加上 3D 場景上的文字對比
- `issues.yml` 與 GitHub issue 對齊完成（#88）：補 M3-07～09、M3-04/05 的依賴改為 M3-02、M3-07；`node scripts/bootstrap/diff.mjs` 比對兩邊，目前差異 0、重跑 bootstrap 不會新建 issue
- `needs-design` 階段一改走 `/issue-ship` 完成（#84）：`CLAUDE.md`、`issue-start`、`checkpoint`、`workflow.md` 都連到 `issue-ship` 的「`needs-design` 的兩個階段」，`wip:` 合併只寫在 `issue-ship` 第 4 步。#16 留在 `main` 的 `wip:` commit（`1b3a5fe`、`a2508f8`）不改寫
- `status.md` 不再列其他 open PR 完成（#94）：「Issue」段落只列已關閉的 issue，進行中的用 `/next-issue` 查；`node scripts/status/check.mjs` 在 `npm run check` 擋下「待合併」

### M4 開發骨架

- M4-01 content collections 與 Zod schema 完成（#20）：`src/content.config.ts` 定義 9 個內容類型與 `tag`，每個 collection 一筆 zh-TW 範例；不合法的 frontmatter（含不存在的 `ref`）讓 `astro check` 與 build 失敗；tag 清單由 `node scripts/content/tags.mjs` 產生。寫法見 `docs/ia/content-model.md`「Astro 實作」
- M4-02 i18n 路由完成（#21）：語系設定與路徑工具在 `src/lib/i18n/`（`astro.config.mjs` 的 `locales` 從這裡 import），語系切換元件 `LocaleSwitcher`；未翻譯的頁面不產生，切換時連到該語系首頁，連首頁都沒有的語系不列（ADR 0002）；`node scripts/i18n/routes.mjs` 在 build 後檢查 `<html lang>` 與切換連結
- M4-03 共用 SEO 層完成（#22）：head 的 title、description、canonical、hreflang、OG/Twitter、JSON-LD 只由 `src/components/seo/Seo.astro` 輸出，頁面把資料傳給 `BaseLayout`（寫法見 `seo-checklist`「頁面怎麼寫」）；JSON-LD 產生函式依 `content-model.md` 涵蓋全部內容類型（`src/lib/seo/jsonld/`）；hreflang 列出實際存在的語系版本與 `x-default`；`src/integrations/sitemap.ts` 在 build 時寫 `dist/sitemap.xml`，排除內部頁（`src/lib/seo/indexing.ts`），沒有新增套件；`node scripts/seo/meta.mjs` 在 `npm run check` 檢查每頁 head 與 sitemap
- M4-04 各模板 layout 完成（#23，`design-approved`）：共用 `PageLayout`（header、footer、捲動進度），11 個模板在 `src/layouts/templates/`，collection 頁、listing（每頁 12 筆，`/page/n`）、contact、utility 都由 `src/pages/[...path].astro` 產生（draft 不產生）；`/templates` 用範例資料預覽每個模板。語系版本只由 `pageLocales()` 決定，header、footer、麵包屑與 JSON-LD 的連結都加上語系前綴（`scripts/i18n/routes.mjs` 擋下跨語系連結）；非首頁都有 `BreadcrumbList`（`scripts/seo/meta.mjs` 檢查）；sitemap 排除流程頁（`src/lib/seo/indexing.ts` 的 `FLOW_PATHS`）。header 選單補上焦點移出收合、行動版選單的 `inert` 與焦點、`aria-current`。CSS 分層（`src/styles/base.css`）由 `scripts/design/css-structure.mjs` 檢查。M3-01 wireframe 已刪除

### M5 內容遷移

- M5-01 產品內容遷移完成（#26）：現站 zh-TW 產品頁搬進 `offering` 19 筆（digirunner 沿用 M3-05）與 `hub` 7 筆（products、四個產品家族、金融與政府產業頁；family-security 是 draft 新頁），en、vi 交給 M7。依使用者決定只填 schema 既有欄位、不改模板，放不下的段落逐頁列在 `docs/content/products.md`「待確認」。不放 `heroImage`（現站 banner 多為含人物的圖庫照，授權未確認），OG 用站內預設圖。`node scripts/design/offering-content.mjs` 改為也比對 hub 與 merge 的多個 `sourceUrl`，有意修正的現站錯字寫在 `CORRECTIONS`（合併 M5-02 後三語 756/756）；AWS 買家指南 PDF 由 `node scripts/content/offering-files.mjs` 下載到 `public/` 底下的現站路徑（下載檔保留原網址）；產品內容檔建立後重跑 `node scripts/content/migrate/case-studies.mjs`，6 筆 zh-TW 案例補上 offerings
- M5-02 解決方案內容遷移完成（#27）：`node scripts/content/migrate/offerings.mjs` 把 7 個解決方案頁（三語共 21 篇）轉成 offering 內容檔，人工修正在 `scripts/content/migrate/offering-overrides.yaml`（zh-TW 的 description 縮到 80 字內）；zh-TW 7 頁在 `/solutions/*` 產生，en、vi 進版控不產生頁面。介紹段、流程架構圖、三項優勢、適用產業、服務客戶 logo、影片在 offering schema 沒有欄位，使用者決定先不搬（與 digiRunner 相同）。hero 背景圖沒有寫進 `heroImage`：模板只拿它當 `og:image`，banner 的寬高比約 3:1，不是 1200×630。不在導覽的方案照樣發布，是否仍銷售列在 PR。`node scripts/design/offering-content.mjs` 改為比對三個語系，`scripts/lib/page-text.mjs` 補解碼 `&quot;` 等 entity。用法見 `docs/content/migration.md`「解決方案頁」
- M5-03 客戶案例遷移完成（#28）：現站沒有案例內頁，`/success-story` 的卡片資料在 Nuxt JS chunk 裡，`node scripts/content/migrate/case-studies.mjs` 轉成每筆一個有內頁的內容檔（zh-TW 61、en 61、vi 58，vi 少 3 筆 RPA 案例）與 logo。使用者決定：每案都有內頁；`case-study` 的 `challenge`、`solution`、`publishedAt`、`offerings` 改選填並加上 `order`；客戶名稱與 logo 照現站顯示（`disclosed: true`），授權待確認；產業對應金融、保險 → `finance`，政府 → `government`，其餘 → `other`。客戶名稱與 zh-TW description 寫在 `case-studies.yaml`，用法見 `docs/content/migration.md`「成功案例」
- M5-04 部落格與新聞批次轉換 script 完成（#29）：`node scripts/content/migrate/migrate.mjs` 依 `page-map.csv` 把現站 blog 與新聞轉成內容檔，圖片下載到 `src/assets/<type>/<locale>/<slug>/`（內容圖的目錄規則改為含語系，whitepaper 範例一起搬）；人工修正寫在 `scripts/content/migrate/overrides.yaml`，重跑結果不變。用法與報告欄位見 `docs/content/migration.md`。全量試跑 622 列（併入 merge 列後 620 篇）：轉出 533 篇、`astro check` 通過；失敗 87 篇，其中 69 篇的圖片網域被雲端環境的 network policy 擋下、15 篇 vi 現站沒有作者、3 篇不在 blog API。試跑產出不 commit，只重新產生兩筆範例。en、vi 的 `newsTypeId` 依現站名稱對應（`content-model.md`「news」，待確認）。html-validate 的 `valid-id` 改為 `relaxed`（數字開頭的標題產生的 id）
- M5-05 部落格與新聞遷移完成（#30）：使用者決定 blog 與新聞只遷移 2026-01-01 起的文章，`scripts/inventory/audit.mjs` 的保留門檻改為 2026-01-01（新聞原為 2024-01-01），重跑後 `inventory.csv`、`page-map.csv`、`redirects.csv` 跟著更新，舊文章 301 到列表頁。`migrate.mjs` 轉出 83 篇（blog zh-TW 13、en 8、vi 34，新聞 zh-TW 10、en 9、vi 9）與 128 張圖，失敗 5 篇列在 PR；全量執行會刪掉不在 `page-map.csv` 的內容檔。圖片下載後縮到最大寬 1600 px、存成 WebP。`overrides.yaml` 新增 `dropImagesFrom`（依主機或圖片網址拿掉圖與圖說）。zh-TW 的 `description`、內文圖 alt 寫進 `overrides.yaml`；en、vi 延到 M7。collection 頁只對有字串檔的語系產生（en、vi 的內容先進版控，M7 補字串檔後產生頁面），內文跨語系連結改成本篇語系的同一頁。抽查用 `node scripts/content/migrate/spot-check.mjs`（`docs/content/migration.md`「抽查」）
- M5-06 公司頁內容遷移完成（#31）：zh-TW 的關於我們、聯絡我們、合作夥伴與 4 個法務頁上線（`/about-us`、`/contact-us`、`/partners`、`/privacy`、`/terms`、`/disclaimer`、`/security-policy`）。公司頁手寫，`node scripts/content/page-content.mjs` 逐行對照現站；法務頁由 `node scripts/content/legal-pdf.mjs` 從現站 PDF 轉換，寫檔前逐字比對 PDF 文字（`docs/content/company-pages.md`）。`organization/zh-TW.yaml` 補齊現站 8 個據點。現站 zh-TW 合作夥伴頁是空的，改用 en 版翻譯。en、vi 的 about、partners、contact 進版控，不產生頁面。en 法務 PDF（2020 年版）、vi 隱私權 PDF（內容是應徵者個資告知）沒有搬
- `issues.yml` 的 `dependsOn` 能寫沒有 bootstrap id 的 issue 完成（#108）：`{ issue: <編號>, note: <說明> }` 輸出成 `- #<編號>（<說明>）`，`validate` 檢查編號與說明。M5-07（#32）的依賴補上 #106、#107，`node scripts/bootstrap/diff.mjs` 差異回到 0
- `orient-ai`、`aiso` 服務頁內容遷移完成（#106）：`node scripts/content/migrate/offerings.mjs` 另外轉這兩個服務頁（三語 6 篇，版型各自的 extractor 在 `TEMPLATES`），`page-map.csv` 的 merge 列（`/orient-aI`）接在 `sourceUrl` 後面；zh-TW 的 `/orient-ai`、`/aiso` 上線，`/products/systalk-ai` 子頁卡片的失效連結補上。`page_type` 是 service，`kind` 依使用者決定填 `product`；family-ai hub 的 `highlights` 沒有移到 aiso（要改 `page-map.csv` 的合併目標），列在 `docs/content/products.md`。沒有欄位的段落見 `docs/content/migration.md`「服務頁」。`offering-content.mjs` 三語 866/866

## 下一步

- M3-06 M3 收尾（#19）可以開始
- M3-08 動態規範（#55）可以開始
- [chore] LHCI 涵蓋所有頁面（#87）可以開始
- M4-05 品質關卡擴充（#24）可以開始
- `esg-advisory` 服務頁與 ESG 顧問頁內容遷移（#107）可以開始；顧問頁是 `page-map.csv` 的 zh-TW 8、en 9、vi 8 列，現在只有 M4-01 的範例 `person/zh-TW/chen-zhengrui.md`
- M5-07 M5 收尾（#32）在 #107 完成後可以開始
- 回覆 #106 PR 的「待確認」：family-ai hub 的 `highlights` 是否移到 aiso、未搬的段落（數字、AI 硬體方案）、en、vi aiso 現站 `<title>` 是「昕力資訊」
- 回覆 M5-02（#27）PR 的「待確認」：不在導覽的方案是否仍銷售、`uiux` 等的 `kind`、略過的段落要不要擴充 content model、案例中客戶名稱的授權
- 回覆 M5-05（#30）PR 的「待確認」：圖片授權與人物、失敗的 5 篇、作者 `authorType`
- 首頁與產品頁的最新文章改讀 content collections（#101）可以開始
- 回覆 M5-06（#31）PR 的「待確認」：合作夥伴頁的翻譯、法務文件是否要法務審閱、資訊安全政策的生效日、en 法務頁的英譯、關於我們的圖片授權
- 回覆 M5-03（#28）PR 的「待確認」：客戶名稱與 logo 的使用授權、內頁內容只有一段描述、獎項與年份、產業對應
- 回覆 `docs/content/products.md`「待確認」（M5-01）：banner 圖庫照能否沿用、各頁未搬的段落要刪減或擴充 content model、feature 數量多的產品頁捲動長度、價格與認證等可能過時的說法
- M6-01 表單（#33）、M6-02 Pagefind 站內搜尋（#34）、M6-03 影片延遲載入（#35）、M6-04 GTM 與 consent 管理（#36）可以開始；表單與搜尋框的版面已在 contact、gated-download、utility 模板，沒有 `action`
- 回覆 PR #98「待確認問題」：listing、utility、contact 頁的暫定描述（`src/data/strings/zh-TW.ts` 的 `pages`）、聯絡表單的諮詢產品選項、個資同意與 AI Playbook 欄位文案、`industry: other` 的顯示名稱
- 回覆 `docs/ia/content-model.md` 文末「待確認」，特別是 tag 清單（`src/content/tags.yaml` 的名稱目前取自現站）
- M4 部署 `_redirects` 時實測 Cloudflare Pages 比對來源路徑是否區分大小寫、`%` 編碼怎麼比對（見 `docs/ia/redirects.md`「待確認」）
- Review M1-02 稽核結果，回覆 `docs/research/content-audit.md`「內容負責人要確認」
- Review M1-03 SEO 基線（`docs/research/seo-baseline.md`）
- Review M1-04 功能盤點（`docs/research/features.md`），向後端負責人與行銷確認文末「待確認」
- 回答 `docs/research/audience-and-goals.md`「尚未回答的問題」其餘 6 題（第 2、5 題已在 M2-01 暫定）
- 以 `/next-issue` 找出下一張可開始的 issue

## 待辦備忘

- M1-03 沒有流量與外部連結資料（無 GA4／Search Console 權限），重要頁面無法依流量排序；M2 的 redirect 對照要涵蓋所有 `keep`／`rewrite`／`merge` 頁面，不能只做 P1／P2。.com origin 層級的 field CWV 尚未取得
- Node 26 預計 2026-10-28 進入 Active LTS，屆時將 `.nvmrc` 升為 `26`（同步 Cloudflare Pages 的 `NODE_VERSION`）；雲端 session 的 SessionStart hook 會自動依 `.nvmrc` 切換
- 現站 `/sitemap.xml` 與 `/ja` 回 500，盤點改以導覽與連結爬取為準（見 `docs/research/inventory.md`）
- M1-02 稽核的 M2 待決事項（日文版、不在導覽的產品、主題重疊頁面、舊 `/solutions/*` 路由、blog 分類）已在 M2-01 依推薦決定，見 `docs/ia/sitemap.md`「決策紀錄」；不在導覽的 6 個產品／方案是否仍銷售，M5 前需內容負責人確認
- 工作流程 skills：`/issue-start`、`/checkpoint`、`/issue-ship`、`/pr-review`、`/next-issue`，使用說明見 `docs/workflow.md`（#50、#62、#69、#71）。沒有 `needs-design`、`needs-input`，計畫也沒有待決事項的 issue 走自動模式，人工只負責啟動、回覆 `needs-decision`、看合併判斷摘要後合併。專案固定檢查只寫在 `.claude/skills/pr-review/SKILL.md`
- 已從 pstack 導入 `typescript-best-practices`、`writing-style`、`CLAUDE.md` 工作原則、`/issue-ship` 自我 review（#50，#62 移到 `/pr-review`）。pstack 的 `create-verification-skill`（以 Playwright 實際操作網站並留存證據）待 M4-05（#24）品質關卡擴充時評估
- 日文版：M2-01 決定不支援，M2-05 將 `/ja/*` 301 到 `/en`（現站 `/ja`、`/ja/partners` 回 500）
- M2-05：`www.tpisoftware.vn` 的轉址不能放進 `_redirects`（不支援網域層級），`.vn` 網域去留決定後改用 Bulk Redirects 等方式處理
- M1-04：表單建議沿用現站 `/tpi/api/*` 後端，需後端開放新站網域的 CORS 並確認 reCAPTCHA 設定；GTM 等追蹤碼由新站重新規劃，不沿用現站 4 個容器；.com 站內搜尋 API 目前回 500（見 `docs/research/features.md`）
- M1-05：主要轉換為聯絡業務；新站只用 GTM、需要 cookie 同意機制、Facebook Pixel 與 Ahrefs 不沿用；成功指標包含自然搜尋流量，但沒有 GA4／Search Console 權限，量測方式待定（見 `docs/research/audience-and-goals.md`）
- M2-04：產品 JSON-LD 定為 `SoftwareApplication`、解決方案與服務為 `Service`（`seo-checklist` 的 JSON-LD 對照改為連到 `content-model.md`）；新頁的 `sourceUrl` 寫 `[]`。blog 作者資料品質、轉載授權、三語版本對應、白皮書檔案位置待確認（見 `docs/ia/content-model.md`「待確認」）
- M2-03：三語系同網域，vi 從 `www.tpisoftware.vn` 改為 `/vi`；`.vn` 網域上線後是否保留為轉址來源，與正式網域一起決定。`og:locale` 的 en、vi 值要改成「語言_地區」格式，M7 處理
- i18n 字串檔在 `src/data/strings/<locale>.ts`（M4-04 決定）：介面字串與 listing、utility、contact 頁的描述。這些頁沒有內容檔，只為有字串檔的語系產生；描述是暫定文案，上線前由內容負責人替換。首頁文案仍在 `src/data/home.ts`
- `LocaleSwitcher` 的 landmark 名稱（語言／Language／Ngôn ngữ）是暫定譯文，M7-01 詞彙表（#38）定案後替換
- M7 加 en、vi 字串檔前要處理（PR #98 審查第 1 輪）：listing、contact、utility 頁的 `translations` 現在把每個有字串檔的語系都算進去，en 的列表頁數比 zh-TW 少時，hreflang 與語言選單會指向不存在的 `/page/n`；`localeHref` 一律加語系前綴，不確認該語系有那一頁，部分翻譯時選單連結會 404；`scripts/i18n/routes.mjs` 的跨語系檢查會把 en、vi 頁上指向檔案的連結（下載頁）當成頁面連結誤報；聯絡頁只在有字串檔的語系找 contact entry，且只取第一筆，多的會被忽略；聯絡頁 hero 的說明（`src/data/home.ts` 的 `contactCta`）與 eyebrow「Contact」只有 zh-TW
- 正式網域未定；`astro.config.mjs` 的 `site` 目前以 `SITE_URL` 環境變數覆寫，預設 `https://tpi-website-ai-poc.pages.dev`
- M3-02 改為深色場景＋亮色閱讀頁的雙 surface，3D 共用視角寫在 `tokens.css` 的 `--scene-angle-*`、`--perspective`；M3-07（#54）的 three.js 相機已從這兩個值換算（`src/lib/scene/runtime.ts`），方向 B 的方塊材質在 M3-04 寫成 `--scene-block-*`、`--scene-rim-*`
- `SiteHeader`、`SiteFooter` 在 `PageLayout`；選單的鍵盤操作依 `docs/ia/navigation.md`「無障礙」完成（M4-04），axe 檢查由 M4-05（#24）接手。正式 header 的 en、vi 寬度已實測（`node scripts/design/header-fit.mjs`，`docs/design/nav-fit.md`「正式 header」），`en-long` 在 1024px 只剩 2px。logo 用使用者提供的 PNG（`node scripts/design/import-brand.mjs <dir>` 匯入 `src/assets/brand/`、favicon、OG 圖），SVG 原始檔與使用規範仍待 #56
- 首頁行動版 Lighthouse performance 中位數 0.94（`node scripts/design/lighthouse-3d.mjs /`，2026-10-23，各跑 3 次），單次在 0.91–0.96 之間浮動。M4-04 比較了三種 CSS 載入方式：現狀（3 個 CSS 檔）、`build.inlineStylesheets: 'always'`、小檔 inline，分數都是 0.94；全部 inline 讓 FCP 快約 450 ms、LCP 快約 150 ms，但每頁 HTML 從 23 KB 變 89 KB、換頁沒有 CSS 快取，所以維持現狀。扣分主要來自 3D chunk 的 TBT。preview 上的真機量測還沒做
- 首頁的最新文章與新聞由 `src/lib/latest-posts.ts` 從 `inventory.csv` 選出，卡片封面暫用抽象圖；文章已在 M5-05 遷移，改讀 content collections 並刪除這個檔案的工作在「下一步」。`src/lib/ia/navigation.ts` 是正式頁面用的導覽讀取（節點讀 `src/lib/ia/nodes.ts`，與 #91 的同名檔相同），刪 wireframe 時保留
- OfferingTemplate、ContentTemplate、HubTemplate 直接拿 `heroImage`（或 `ogImage`）當 `og:image`，不裁成 seo-checklist 要的 1200×630。M5-02 因此沒有把現站 banner（寬高比約 3:1）寫進解決方案頁的 `heroImage`；模板裁切後再補，banner 位置見 `docs/content/migration.md`「解決方案頁」
- M3-05、M5-01：現站產品頁有 content-model 沒有欄位的段落（digiRunner 的 AI Gateway、五大應用等，其他產品的方案表、導入流程、數字等），M5-01 依使用者決定只填既有欄位，逐頁列在 `docs/content/products.md`「待確認」；要擴充 content model 時另開 issue。`useCases.industry` 沒有保險、醫療、物聯網，這些情境沒有產業連結
- 正式上線時 `robots.txt` 改成允許收錄並加上 `Sitemap:` 行（M4-03 起 `dist/sitemap.xml` 已產生，上線前 `robots.txt` 不指向它），列進 M8-02 launch-readiness（#44）
- `npm run check` 的 LHCI 用 `staticDistDir` 自動探索，只測前 5 個 URL（M3-07 時 build 出 16 頁只測 5 頁），其餘頁面沒有 Lighthouse 關卡，由 #87 處理
- M5-04（#29）、M5-05（#30）：en、vi 的 blog 與新聞已進版控，但沒有字串檔所以不產生頁面。M7 補字串檔前要處理：`<title>` 接上 `｜TPIsoftware 昕力資訊` 後大多超過 70 字（要寫 `seoTitle`，或先決定 en、vi 的後綴規則）、description 過長、內文圖缺 alt，數字看 `migrate.mjs --report` 的 notes；vi 內文原本連到英文頁的連結已改成 `/vi/...`（報告記 24 筆），目標頁要在 vi 存在
- M5-06（#31）：en、vi 的 `page` 內容檔（about、partners、contact）已進版控。M7 產生這些頁面前要補 `organization/en.yaml`、`vi.yaml`（據點的英文地址取自現站 en 版關於我們）；en 法務頁沒有內容檔，zh-TW 隱私權政策與使用條款已附英譯，可從那裡拆出，或等法務提供；vi 現站 footer 電話（+886 2 8751 1610）與 zh-TW（+886 2 2658 0508）不同，要確認
