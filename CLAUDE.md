# CLAUDE.md

## 專案目標

重新設計並開發 TPIsoftware（昕力資訊）官方網站，素材來源為 https://www.tpisoftware.com。本專案同時驗證「AI 輔助開發工作流程」：需求以 GitHub issue 管理，Claude 在雲端 session 實作，人工負責設計確認與 review。

- 可上線品質的真實開發，但目前只部署到 Cloudflare Pages（`*.pages.dev`），不上正式網域
- 本站是現站的改版複製品，**不可被搜尋引擎收錄**：`public/_headers` 與 `public/robots.txt` 不得移除或放寬
- 語系：zh-TW、en、vi 三語上線（M7），zh-TW 優先。URL 與語系路徑規則見 `docs/decisions/0002-url-and-locale.md`，多語系內容的維護規則見 `content-migration` skill 的「多語系內容」
- 目前 milestone、進度與下一步以 `docs/status.md` 為準
- M0–M8 的規劃 milestone 結束後進入維運：新需求用 issue form 開，不掛 milestone，流程照「雲端 session 工作規則」。正式上線照 `docs/launch/launch-readiness.md`「上線步驟」；開放收錄的 PR 依第 6 步，同時改本節「不可被搜尋引擎收錄」「只部署到 `*.pages.dev`」兩句與列在那裡的規則（`pr-review` 的固定檢查、`seo-checklist`、`README.md` 等）

## 技術棧

Astro（`output: 'static'`，預設零 client JS，互動才用 island）、TypeScript strict、CSS custom properties 作為 design tokens、不使用 UI framework、npm、Node 版本見 `.nvmrc`。決策理由見 `docs/decisions/`。

## 目錄結構

```
src/pages/        首頁（index.astro、[locale]/）、404、內容與節點頁面的 [...path].astro、內部頁（design-system/、templates/）
src/layouts/      BaseLayout（head）、PageLayout（header、footer）、templates/（11 個模板）
src/components/   ui/（元件，列在 design-system skill 的元件表）、seo/Seo.astro（head 的 SEO 標籤）
src/content/      content collections 的內容檔（schema 在 src/content.config.ts）
src/data/         site.ts、strings/<locale>.ts（介面字串）、home/<locale>.ts（首頁文案）、consent.ts（cookie 類別與三語文案，draft）
src/lib/          i18n/（語系與路徑）、ia/（nodes.csv、導覽、已產生的頁面）、content/（entry、列表、網址）、seo/（meta、hreflang、JSON-LD、sitemap、排除收錄的頁面）、scene/（3D 場景）、forms/（表單規則、Function 的處理、Turnstile、adapter、頁面 script，ADR 0005）、search/（站內搜尋索引的 zh-TW 斷詞與結果顯示，ADR 0006）、consent/（cookie 同意的儲存、GTM 載入、PageLayout 用的設定，ADR 0007）
src/integrations/ sitemap.ts（build 時寫 dist/sitemap.xml）、pagefind.ts（build 時寫 dist/pagefind/ 站內搜尋索引）
functions/        Cloudflare Pages Functions：api/contact.ts（聯絡表單的送出，判斷在 src/lib/forms/handler.ts）
src/assets/       brand/（logo，`import-brand.mjs` 產生）、design/（設計影像，`import-image.mjs` 匯入）、blog/、news/、case-study/、whitepaper/（內容圖，依語系與 slug 分目錄）
src/styles/       tokens.css（design tokens）、media.css（斷點）、base.css（reset 與全域工具類）
public/           靜態檔（_headers、robots.txt）
scripts/          session-start.sh（SessionStart hook）、lhci-prepare.mjs、Lighthouse 單次量測的時間上限 `lhci-run.mjs`、content/（日期檢查、tag 清單、blog、新聞、成功案例、解決方案與服務頁、ESG 顧問頁轉換 `migrate/`、產品下載檔 `offering-files.mjs`、公司頁對照 `page-content.mjs`、法務 PDF 轉換 `legal-pdf.mjs`）、design/（對比、token 使用、輸出 CSS 檢查、字型 subset 檢查 `font-subsets.mjs`、render-blocking CSS 量測 `css-blocking.mjs`、預設 OG 圖、圖片匯入、瀏覽器無障礙實測、頁面橫向溢出 `overflow.mjs`、全站 axe `axe.mjs`、影片 facade 檢查 `video-facade.mjs`、3D 初始化等待上限 `scene-wait.mjs`、offering 與 hub 內容對照 `offering-content.mjs`）、seo/（heading 檢查、每頁 head 與 sitemap 檢查、站內連結 `links.mjs`）、i18n/（語系路由檢查、翻譯詞彙表 `glossary.mjs`、測試語系 build `locale-fixture.mjs`）、forms/（表單規則與 Function 的單元測試、瀏覽器裡的表單檢查 `contact.mjs`）、search/（站內搜尋的索引、斷詞、載入範圍與無障礙檢查 `pagefind.mjs`）、consent/（同意狀態的單元測試、有 GTM ID 時的瀏覽器檢查 `gtm.mjs`）、lib/（共用的靜態伺服器）、inventory/（現站盤點與稽核）、ia/（sitemap、導覽、轉址對應、build 後的轉址目標檢查 `redirect-targets.mjs`）、checkpoint/（進度推算）、bootstrap/（`issues.yml` 與 GitHub issue 的比對）、status/（`status.md` 檢查）、ci/（quality-gate 是否跳過 Lighthouse `lighthouse-scope.mjs`）、docs/（本檔目錄結構的檢查 `claude-md.mjs`）
docs/             status.md、launch/（全站驗收 `audit.md`、上線準備 `launch-readiness.md`）、decisions/（ADR）、onboarding.md、workflow.md（工作流程使用說明）、research/、ia/（資訊架構，見「IA 與 URL」）、content/（內容轉換的使用說明）、design/（品牌素材、影像提示詞、選單寬度實測）、i18n/（翻譯詞彙表 `glossary.csv`）
tests/visual/      Playwright 視覺回歸與 baseline（`__screenshots__/`）
.claude/skills/   issue-start、issue-ship、checkpoint、pr-review、next-issue（工作流程）；seo-checklist、design-system、content-migration、typescript-best-practices、writing-style
.github/          ISSUE_TEMPLATE、workflows、bootstrap（labels / milestones / issues）
```

## IA 與 URL

M2 定案的規則，細節以連結的文件為準：

- 頁面階層只寫在 `docs/ia/nodes.csv`。新增頁面先加節點，路徑取節點的 `path`；麵包屑、子頁卡片由 `parent` 推出，不從 URL 推導
- 導覽只讀 `docs/ia/navigation.csv`（`docs/ia/navigation.md`），不在元件裡另寫一份選單
- URL：zh-TW 不加前綴，en、vi 加 `/en`、`/vi`；路徑只用小寫英文、數字與 `-`，不加尾斜線（`/` 除外），slug 三語共用。完整規則見 ADR 0002
- 語系前綴與路徑正規化一律用 `src/lib/i18n/` 的函式，不在元件裡手接 `/en`；未翻譯的頁面不產生（不設 `i18n.fallback`）
- 有 `src/data/strings/<locale>.ts`、`src/data/home/<locale>.ts` 與 `src/content/organization/<locale>.yaml` 的語系才產生頁面。選單、footer、麵包屑的 en、vi 名稱讀 `docs/i18n/glossary.csv`，沒有譯名時 build 失敗；該語系沒有的頁面連到 zh-TW 版（`docs/ia/navigation.md`「語系」）
- 現站頁面在新站的位置看 `docs/ia/page-map.csv`，舊網址的轉址看 `docs/ia/redirects.csv`
- `page-map.csv`、`redirects.csv`、`sitemap-summary.json`、`blog-categories.csv` 與 `sitemap.md`、`navigation.md` 的自動產生段落由 `scripts/ia/` 產生，不手改；改了輸入就重跑對應 script。`npm run check:ia` 會擋下過期的產出，`blog-categories.csv` 要連現站，不在檢查範圍
- 內容類型的欄位與 JSON-LD 見 `docs/ia/content-model.md`

## 頁面與元件

M4 定案的寫法：

- 內容檔與 `nodes.csv` 的節點頁面（含 listing、contact、utility、下載頁）都由 `src/pages/[...path].astro` 產生，模板取節點的 `template`；`draft: true` 的內容不產生頁面。新增頁面是加節點與內容檔，不在 `src/pages/` 另寫一頁；新的 utility 節點要登記在 `src/lib/ia/utility.ts`，否則 build 失敗。改了這個 route 產生哪些頁面時，`src/lib/ia/built.ts`（站內連結判斷頁面是否存在）要一起改。`src/pages/` 的靜態頁會蓋過這個 route，只用於首頁、404 與內部頁（`src/lib/seo/indexing.ts` 的 `INTERNAL_PATHS`）
- 版型三層：`BaseLayout` 輸出 `<html>` 與 head，`PageLayout` 加上 header、footer 並決定這一頁有哪些語系版本，`src/layouts/templates/` 的模板只寫該類頁面的結構。頁面把 title、description、JSON-LD 等傳給 layout，head 只由 `Seo.astro` 輸出（`seo-checklist`「頁面怎麼寫」）
- 新增或改模板：`/templates/<id>` 用範例資料預覽首頁以外的每個模板（`src/pages/templates/[template].astro`），`HomeTemplate` 直接看首頁。這些頁面與三語首頁是視覺回歸的對象，baseline 照 `docs/workflow.md`「視覺回歸」更新
- 元件放 `src/components/ui/`，連結、導覽與語系一律用 `src/lib/ia/`、`src/lib/i18n/` 的函式；樣式規則與新增元件的步驟見 `design-system` skill
- 站內搜尋（Pagefind）只索引把麵包屑 trail 傳給 `PageLayout` 的 `searchTrail` 的頁面；新增要能被搜尋到的模板時要傳，跟其他頁面重複的區塊標 `data-pagefind-ignore`。索引範圍、zh-TW 斷詞與載入時機見 ADR 0006

## 指令

| 指令 | 用途 |
|---|---|
| `npm run dev` | 本機開發 |
| `npm run build` | 產生 `dist/` |
| `npm run check` | IA 資料檢查 → 翻譯詞彙表檢查 → `status.md` 檢查 → 本檔目錄結構檢查 → design 檢查 → scripts 測試 → astro check → build → 輸出 CSS、字型 subset、heading、語系路由、head 與 sitemap、站內連結、轉址目標、水平捲動、axe、影片 facade、3D 等待上限、站內搜尋、表單、consent 與 GTM 檢查 → 視覺回歸（只在 CI 比對）→ html-validate → Lighthouse CI（推送前必跑） |
| `npm run check:before-lighthouse` | `npm run check` 去掉最後的 Lighthouse。quality-gate 分兩段執行，只改文件的 PR 跳過 Lighthouse（`scripts/ci/lighthouse-scope.mjs`，ADR 0004「例外」） |
| `npm run test:visual:update` | 重新產生視覺回歸的 baseline。只在 CI 執行（PR 加上 `update-visual-baseline` label），時機與流程見 `docs/workflow.md`「視覺回歸」 |
| `npm run check:design` | tokens 的 WCAG 對比、元件樣式沒有寫死的數值、CSS 分層（全域樣式、`:global`、重複宣告）、每個元件都在 `/design-system` 展示頁與 `design-system` skill 的元件表上 |
| `npm run lighthouse:all` | 對 `dist/` 每一頁各跑 1 次 Lighthouse，所有頁面的 performance 都是 error |
| `npm run check:ia` | 驗證 `docs/ia/` 的 IA 資料，並確認 `sitemap.mjs`、`navigation.mjs`、`redirects.mjs` 的產出是最新的（不寫檔） |

Lighthouse 對 `.lhci-dist/`（移除 robots.txt 與 _headers 的 dist 副本）執行；HTML 內不可放 `noindex` meta。`npm run check` 只測 `lighthouserc.cjs` 的 `PAGES`（每個模板的代表頁），全部頁面用 `npm run lighthouse:all`（約 97 分鐘，不在 `npm run check` 裡）；何時重跑與怎麼挑代表頁見 ADR 0004。`npm run lighthouse` 經過 `scripts/lhci-run.mjs`，單次量測超過 3 分鐘就失敗並印出卡住的 URL；Chrome flags 用 `LHCI_SETTINGS__CHROME_FLAGS`，不用 `LHCI_COLLECT__SETTINGS__*`（會蓋掉 `lighthouserc.cjs` 的 `settings`，ADR 0004「卡住的量測與時間上限」）。

## 雲端 session 工作規則

1. 每個 session 對應一張 issue。以 `/issue-start <N>` 開始：讀 issue、本檔、`docs/status.md`，對照 `status.md` 與 GitHub 實際狀態，檢查依賴與環境，提出計畫。issue 沒有 `needs-design`、`needs-input`，計畫也沒有待使用者決定的事項時，計畫貼到 issue 留言後直接實作（自動模式）；否則以 Plan 模式等使用者確認。計畫拆成階段，每個階段完成時與停下等回覆前執行 `/checkpoint`（WIP commit 加進度檔）；session 中斷後再執行 `/issue-start <N>` 從進度檔接續。
2. 若 `node_modules` 不存在或 SessionStart hook 回報安裝失敗，先執行 `npm ci` 並回報結果，不要直接開始實作。
3. Branch：雲端 session 使用 session 指定的 branch，接續既有 PR 時用 PR 的 head branch（見 `issue-start` 第 1 步）；本機開發用 `<type>/<issue-number>-<slug>`，type 取 `feat` / `fix` / `content` / `docs` / `chore`。PR 標題以 issue 的 `[Mx-xx]` 或 `[chore]` 前綴開頭。
4. 最後一個階段完成後自動執行 `/issue-ship`（`needs-design` 階段一也是，見下方兩階段流程）：開 draft PR，跑審查迴圈直到符合完成條件，再轉 ready 並在 PR 貼合併判斷摘要。合併由使用者決定。PR body 必含：`Closes #N`、變更摘要、驗收方式、preview 檢查重點（要看哪些頁面、哪些斷點）。需要人決定時依 `checkpoint` skill 的「停下找人」處理。
5. 開 PR 前 `npm run check` 必須通過；checkpoint 的 push 不跑，規則見 `checkpoint` skill。不得 push `main`。
6. 找下一張可開始的 issue 用 `/next-issue`。

## 工作原則

> 改寫自 pstack 的 principle skills（MIT，見 `.claude/skills/THIRD_PARTY_NOTICES.md`）

- **驗證實際產出**：看實際輸出、exit code、產出檔案，不以「應該會過」、截斷的 log 或自己的轉述代替。數字要寫出來源與重現方式
- **非一次性的工作寫成工具**：資料處理、批次修改、檢查都寫成可重跑的 script，不手改產出檔。例：`scripts/inventory/audit.mjs`
- **操作可重複執行**：script 跑兩次、或上次中途失敗後重跑，結果都要相同
- **重複出現的錯誤改用結構防堵**：同一個提醒寫第二次時，改成 lint、型別、測試或 script 檢查；無法結構化才寫成文件
- **修根因**：先重現，再一路追到第一個出錯的地方修；不在症狀出現處加 guard 或吞掉錯誤。同類問題一次找齊
- **小步可驗證**：多步驟工作拆成各自能驗證的小單位，前一步通過才做下一步
- **最小變更**：用最小的 diff 解決問題；同一個決定只放在一個地方，不預先抽象

## 設計確認兩階段流程（issue 帶 `needs-design` 時適用）

**階段一：視覺與結構**
- 只做版面、視覺與元件結構
- 最後一個階段完成後執行 `/issue-ship`，開 **draft PR** 後停下。做法見 `.claude/skills/issue-ship/SKILL.md` 的「`needs-design` 的兩個階段」
- 告知使用者等待設計確認。**不得自行進入階段二**

**階段二：完成度**
- 使用者告知已加上 `design-approved` 後才繼續
- 補齊 SEO、無障礙、內容完整度
- 再執行一次 `/issue-ship`（不另開 PR，做法見同一節），跑審查迴圈，符合完成條件後將 PR 轉為 ready for review

M2、M3 的關卡 issue 改用對應的 label（`ia-approved`、`wireframe-approved`、`design-approved`），流程相同。

## SEO 底線

每頁必須有唯一的 title 與 description、canonical、OG/Twitter、單一 h1 且 heading 不跳級、圖片 alt 與尺寸。細節與驗收方式見 `.claude/skills/seo-checklist/SKILL.md`。

## 設計規則

- 樣式只能使用 `src/styles/tokens.css` 定義的 design tokens，不得寫死色碼、字級、間距
- CSS 分層：tokens 與斷點在 `tokens.css`、`media.css`，reset 與跨元件工具類只在 `src/styles/base.css`，跨頁共用的樣式做成 `src/components/ui/` 的元件，模板與頁面只寫自己的版面。不複製樣式、不寫 `<style is:global>`、不用 `:global()` 改別的元件；`npm run check:design` 擋下違規
- 新元件要加到 `/design-system` 展示頁與 `design-system` skill 的元件表，步驟見該 skill 的「新增元件」
- 細節見 `.claude/skills/design-system/SKILL.md`

## 內容規則

- 不得捏造產品功能、數據、客戶名稱、認證或獎項
- 不確定的內容在 PR 中列為「待確認」，不要自行補上
- 從現站搬移內容時依 `.claude/skills/content-migration/SKILL.md`：各內容類型的轉換或對照 script、schema 沒有欄位的段落不搬；en、vi 內容的來源、用語與修正位置依同一個 skill 的「多語系內容」
- 現站每一頁的處置（`disposition`）與待確認（`to_confirm`）看 `docs/research/inventory.csv`，依據見 `docs/research/content-audit.md`

## 文件維護

- 架構決策記錄於 `docs/decisions/NNNN-<slug>.md`（ADR）
- 每個 milestone 結束時更新本檔與 skills（各 milestone 最後一張 issue）。維運期間沒有收尾 issue，改了架構、目錄或流程的 PR 自己更新本檔與對應的 skill；目錄結構漏列時 `node scripts/docs/claude-md.mjs`（`npm run check`）會擋下
- 進度變動時更新 `docs/status.md`
- 工作流程（skills、人工關卡）變動時更新 `docs/workflow.md`
- 撰寫文件、PR 描述、commit message 依 `.claude/skills/writing-style/SKILL.md`
