# Content brief：GreenSwift 產品頁 `/products/greenswift`（#199）

- 模板：`offering`（`kind: product`）；內容檔：`src/content/offering/zh-TW/greenswift.md`
- 主張 id 指 `docs/strategy/messaging.md`；事實的寫法見 `content-strategy` skill「引用事實的寫法」，只用 `docs/strategy/facts.yaml` 裡 zh-TW、`status: confirmed` 的條目
- 狀態：#199 策略階段。content-strategist 初稿，seo-strategist 補了「搜尋意圖」「內部連結」「title 與 description 方向」與「取捨」的意見欄、最後決定，之後等 `strategy-approved`

## 這頁從哪裡推出來

現站有 `/products/greenswift` 與推廣頁 `/carbon`（併入本頁，`nodes.csv` 的 `greenswift`）。新站的內容檔搬了三張方案卡、四個頁籤與 11 題 FAQ，方案表、六大步驟、儀表板說明、試用與顧問協作都沒搬（`unmigrated.md`「GreenSwift 產品頁」）。FAQ 的答案裡還有規劃中的功能與沒收進事實庫的句子（同檔「第一批 7 頁沒收的句子」）。

本 brief 從要做碳盤查或回應 CBAM 的企業在選平台時的問題往回推：涵蓋哪些盤查、照什麼標準、產出什麼、誰在平台上做、資料安不安全、能不能先試。

事實的來源：GreenSwift 產品頁本身 32 筆中 31 筆 confirmed，加上現站新聞 580 標題的 2 筆（和鼎隆建築）、`/products` 頁的 1 筆，共 34 筆 confirmed（`/carbon` 是 campaign 頁，整頁沒收）。

## 受眾與任務

依 `docs/research/audience-and-goals.md`「受眾分群」。本頁不點名產業（`messaging.md`「定位不說的事」），受眾寫負責碳盤查與 CBAM 的人：

| 受眾 | 來這頁做什麼 | 這頁要讓他做到的事 |
|---|---|---|
| 決策者（高階主管、永續或 ESG 負責人），主要 | 確認 GreenSwift 處理得了組織型碳盤查、產品碳足跡與 CBAM；看有沒有人用過；決定要不要約 demo 或試用 | 第一屏讀到三種盤查與申報在同一個平台；一段寫三個方案各做什麼；看到具名案例；找得到預約演示與試用 |
| IT 主管、專案負責人，主要 | 確認部門與顧問怎麼一起用、帳號與權限、資安與可用性、跟既有系統怎麼接 | 帳號、顧問分權、資安與可用性各有一段寫機制；寫清楚目前不直接串接 ERP、HR 系統 |

主要轉換：預約演示（內容檔 `cta: demo`）。次要：試用（`IT-7`）。

## 搜尋意圖

依 `docs/strategy/search-intent.md`「GreenSwift 產品頁 `/products/greenswift`」。沒有 Search Console 數據，取捨只依受眾與頁面主題，不依搜尋量。產品頁承接品牌詞與選平台的查詢；教學型的問題（怎麼計算、怎麼申報）交給已上線的 blog 文章，本頁第 10 段連過去。

### 這頁承接的查詢

| 查詢 | 意圖類型 | 承接 | `search-intent.md` 的條目 |
|---|---|---|---|
| `GreenSwift 碳盤查` | 導航型，前幾名全是新聞，實際滿足的是「這個產品是什麼」的資訊需求 | 主要。前幾名缺的方案分別（第 2 段）、試用方式與審核時間（第 9 段）、可用性 SLA（第 6 段）、環保署登錄平台格式（第 4 段）都在本頁；前幾名提到的和鼎案例由第 8 段對上 | 「GreenSwift 碳盤查」 |
| `碳盤查 平台 系統 推薦` | 比較型 | 主要。一個產品頁滿足不了「推薦」，本頁寫選平台時會比的條件，而且都是前幾名缺的：支援的標準（第 3 段）、帳號與組織邊界的數量（第 5 段）、外部顧問能不能一起作業（第 7 段）、環保署格式與目前不直接串接 ERP（第 4 段）、試用方式（第 9 段）。不做比較表 | 「碳盤查 平台 系統 推薦」 |
| `產品碳足跡 計算 軟體` | 商業型（找軟體） | 主要。第 2 段的碳足跡方案回答前幾名缺的「與組織型碳盤查放在同一個平台」，第 3 段回答係數定期更新。不用 ISO 14067 承接（取捨第 9 項） | 「產品碳足跡 計算 軟體」 |
| `ISO 14064-1 碳盤查 步驟` | 資訊型 | 主要。`/whitepaper/greenswift` 依 #138 不產生頁面（`navigation.csv`），由本頁承接：第 3 段的六大步驟、標準與 GWP 切換，第 4 段的盤查清冊，回答前幾名缺的「用系統做盤查時每一步怎麼做」。範疇的說明由第 10 段連到 `/blog/what-is-scope3` | 「ISO 14064-1 碳盤查 步驟」 |
| `CBAM 申報 怎麼做 台灣 出口商` | 資訊型 | 次要；主要 `/blog/cbam-carbon-compliance-guide`。第 2 段的 CBAM 方案回答前幾名缺的「出口商用什麼工具整理數據」 | 「CBAM 申報 怎麼做 台灣 出口商」 |
| `碳盤查 費用 中小企業` | 資訊型帶商業型 | 次要，沒有主要承接頁（取捨第 11 項）。第 9 段的試用條件、第 7 段的顧問與平台分工回答前幾名缺的一部分；不寫價格 | 「碳盤查 費用 中小企業」 |
| `溫室氣體排放量 申報 環境部 登錄平台 表單` | 無法判斷（結果不能用） | 第 4 段的 `fact:greenswift-epa-format` 對應這組；之後在別的環境重查再定 | 「溫室氣體排放量 申報 環境部 登錄平台 表單（結果不能用）」 |

比較型的 `碳盤查 平台 系統 推薦` 只能做到「讓會比的條件都寫在頁面上」，同 `digirunner.md`「搜尋意圖」對比較型查詢的處理。

### 不由這頁承接的查詢

| 查詢 | 交給 | 理由 |
|---|---|---|
| `產品碳足跡 ISO 14067 怎麼計算` | `/blog/carbonfootprint-quick-implementation-sme`，次要 `/blog/carbonfootprint` | 教學型。前者寫了選指標產品、生命週期邊界（ISO 14067:2018 的部分碳足跡）、盤點數據、用平台計算的步驟；本頁第 10 段連過去（取捨第 12 項）。本頁不寫 ISO 14067（「待確認」第 1 項） |
| `CBAM 申報 怎麼做 台灣 出口商`（主要） | `/blog/cbam-carbon-compliance-guide` | 教學型 |
| ESG 顧問輔導、依 ISO 14064-1 輔導碳盤查的服務 | `/esg-advisory` | 本頁是平台，昕力的顧問服務在另一頁；第 7 段連過去（取捨第 4 項） |

## 這頁要讓讀者相信什麼

碳盤查、產品碳足跡與 CBAM 申報有現成的工具，盤查標準與係數內建（`DM-7`）；企業各部門與外部顧問在同一個平台分工，帳號與組織邊界不設上限（`DM-12`）；平台採零信任架構（`IT-2`）；審核通過後可以先試用，條件寫得清楚（`IT-7`）。

## 段落結構

順序照選平台時的判斷順序：涵蓋哪些、照什麼標準、產出什麼、誰在上面做、安不安全、顧問怎麼進來，最後是案例與試用。

「版型」欄照 `docs/strategy/design-principles.md`「內頁的版型」的 10 種，括號裡是 `src/content.config.ts` 的 `pageSection` 的 `layout` 值；案例列與索引列不是 `sections` 的 layout，寫出對應的欄位。「影像」欄照同一節「內頁共用的規則」：介面片段（`data-ui`、標「示意」）只畫事實寫得出的功能名稱、設定項目與狀態名稱，不畫筆數、時間與曲線。

| # | 段落 | 目的 | 依據（受眾任務／主張 id） | 搜尋子題 | 事實 | 預估長度 | 版型 | 影像 |
|---|---|---|---|---|---|---|---|---|
| 1 | Hero：GreenSwift 是什麼 | h1 是節點名「GreenSwift 智慧碳管理平台」。tagline 寫用途：碳盤查、產品碳足跡與 CBAM 申報資料在同一個平台處理。說明句寫機制（內建盤查標準與係數、部門與顧問一起作業），不點名產業。兩則證據點，兩個動作：預約演示（實心）、申請試用（跳到第 9 段，取捨第 3 項） | 決策者任務「確認這是不是我要找的工具」；`DM-7`；主要轉換：預約演示 | `GreenSwift 碳盤查`：這個產品是什麼；`碳盤查 平台 系統 推薦`：類別詞 | `fact:cert-greenswift-aup`、`fact:greenswift-seven-ghg` | tagline 15–25 字；說明 40–60 字；證據點 2 則 | 第一屏（`tagline`、`heroLead`、`heroPoints`、`secondaryCta`） | 同一個世界渲染的靜態圖（新圖，檔名與構圖由設計概念階段決定；首頁產品索引已有 `prod-greenswift.webp` 可參考）。HTML 標籤只用事實寫得出的詞：碳盤查、CBAM、碳足跡（`fact:greenswift-scope`）。不載 3D |
| 2 | 碳盤查、CBAM 與碳足跡，各有方案 | 一列一個方案：盤查範圍原文一格、方案內容原文一格。寫出碳盤查涵蓋跨地區、廠區、設備與系統，CBAM 提供報表格式下載與進出口供應鏈的數據，碳足跡計算產品與供應鏈碳足跡。碳足跡列不寫 ISO 14067（`DM-7` 寫法） | 決策者任務「了解產品與方案」；`DM-7` | `GreenSwift 碳盤查`：前幾名缺的方案分別與各方案內容；`產品碳足跡 計算 軟體`：係數自動更新、與組織型碳盤查放在同一個平台；`CBAM 申報 怎麼做 台灣 出口商`：出口商用什麼工具整理數據（次要，主要在文章）；`碳盤查 平台 系統 推薦`：帳號與組織邊界的數量限制 | `fact:greenswift-scope`、`fact:greenswift-carbon-plan`、`fact:greenswift-cbam-plan`、`fact:greenswift-footprint-plan` | 說明句 30–50 字；表 3 列，照原文 | 規格表（`spec`），`fill: subtle` | 段落圖（緞帶世界，新圖，h2 旁的最後 4 欄，375 寬不顯示） |
| 3 | 盤查標準與步驟已經內建 | 六大步驟系統化管理類別一至類別四排放源；GHG Protocol 與 ISO 14064-1:2018 可以切換，IPCC 係數定期更新；全球暖化潛勢（GWP）可快速切換；範疇一到三各管什麼 | 決策者任務「確認照得到標準」；IT 主管任務「確認系統怎麼帶著做」；`DM-7` | `ISO 14064-1 碳盤查 步驟`：前幾名缺的「用系統做盤查時每一步怎麼做」、GHG Protocol 與 ISO 14064-1 能不能切換、GWP 版本切換；`碳盤查 平台 系統 推薦`：支援的標準 | `fact:greenswift-six-steps`、`fact:greenswift-categories`、`fact:greenswift-standards`、`fact:greenswift-gwp-switch`、`fact:greenswift-scopes` | 說明句 30–50 字；片段旁事實 4 則 | 介面片段（`ui`） | 介面片段 1：盤查流程的步驟列，六個步驟照 `fact:greenswift-six-steps` 原文，各步驟只標狀態（已完成、進行中、未開始）；一列標準切換「GHG Protocol／ISO 14064-1:2018」（`fact:greenswift-standards`）。片段旁放 `fact:greenswift-categories`、`fact:greenswift-standards`、`fact:greenswift-gwp-switch`、`fact:greenswift-scopes` |
| 4 | 自動計算，產出盤查清冊與申報格式 | 已整理好的資料從介面匯入並上傳佐證；系統內建計算公式，產出年度總排放量、活動數據總表與盤查清冊，可一鍵下載環保署登錄平台的表單格式，AI 一鍵生成溫室氣體報告，報告依 ISO 14064-1:2018 寫出數據鑑別與計算方法；過往年度的資料可以帶入新年度。目前不直接串接 ERP、HR 系統，這句照原文寫在圖下，不藏起來（取捨第 8 項） | IT 主管任務「確認跟既有系統怎麼接」；決策者任務「確認產出什麼」；`DM-7` | `ISO 14064-1 碳盤查 步驟`：盤查清冊的產出內容；`溫室氣體排放量 申報 環境部 登錄平台 表單`（結果不能用，但 `fact:greenswift-epa-format` 對應這組）；`碳盤查 平台 系統 推薦`：能否直接匯出環保署登錄格式、不能做什麼（ERP 整合） | `fact:greenswift-no-erp-integration`、`fact:greenswift-epa-format`、`fact:greenswift-inventory-output`、`fact:greenswift-ai-report`、`fact:greenswift-report-method`、`fact:greenswift-file-center` | 說明句 40–60 字；圖下事實 6 則，兩欄 | 接點圖（`junction`） | SVG：左欄是企業已整理好的資料與佐證資料（中性色，用 `fact:greenswift-no-erp-integration` 的用詞，不畫 ERP），中欄是 GreenSwift 的碳排計算（紫），右欄是產出：環保署登錄平台表單格式、盤查清冊、溫室氣體報告（`fact:greenswift-epa-format`、`fact:greenswift-inventory-output`、`fact:greenswift-ai-report`） |
| 5 | 各部門在同一個平台分工 | 權責分工、系統主動提醒，各部門協作完成數據收集；內部人員與外部顧問在雲端共同編輯指標文稿；主要管理者與子管理者帳號，使用者數量與組織邊界數量都沒有上限 | IT 主管任務「確認帳號與權限怎麼設」；決策者任務「確認跨部門收得到數據」；`DM-12` | `碳盤查 平台 系統 推薦`：前幾名缺的帳號與組織邊界數量限制 | `fact:greenswift-collaboration`、`fact:greenswift-cloud-collaboration`、`fact:greenswift-accounts` | 說明句 30–50 字；片段旁事實 3 則 | 介面片段（`ui`，`flip: true`） | 介面片段 2：帳號管理面板，項目是主要管理者帳號、子管理者帳號、使用者數量「不限」、組織邊界數量「不限」（`fact:greenswift-accounts`）。不畫人名與部門名稱 |
| 6 | 資安、可用性與語言 | 零信任架構、研發過程符合 ISO 27001；雲端 SaaS 的可用性與它依據的 Amazon SLA 條件同一格；支援繁中與英文，導入後有英文支援 | IT 主管任務「確認資安過得了關、上線後維運得動」；`IT-2` | `GreenSwift 碳盤查`：前幾名缺的可用性 SLA | `fact:greenswift-zero-trust-iso27001`、`fact:greenswift-sla-99`、`fact:greenswift-languages` | 說明句 20–40 字；表 3 列 | 規格表（`spec`），`fill: subtle` | 段落圖（緞帶世界，新圖），和第 2 段不相鄰 |
| 7 | 顧問公司登入同一個平台輔導 | 顧問可以登入，替輔導的客戶線上盤點；同一顧問公司內的顧問帳號可分權，非共同輔導的資料不互通；專業輔導由合作的顧問公司執行，GreenSwift 提供操作教學影片。不寫成昕力提供碳盤查輔導（`DM-12` 寫法，取捨第 4 項） | 決策者任務「確認輔導怎麼安排」；IT 主管任務「確認外部人員的資料權限」；`DM-12` | `碳盤查 平台 系統 推薦`：外部顧問能不能一起在平台上作業；`碳盤查 費用 中小企業`：顧問輔導與平台怎麼分工 | `fact:greenswift-consultant-accounts`、`fact:greenswift-consultant-access`、`fact:greenswift-consulting-partners`、`fact:greenswift-cloud-consultants` | 說明句 30–50 字；片段旁事實 4 則 | 介面片段（`ui`） | 介面片段 3：一個顧問帳號的權限設定，兩列「所輔導客戶的資料：可查看」「非共同輔導的資料：不互通」（`fact:greenswift-consultant-access`）。不畫顧問與客戶的名稱 |
| 8 | 案例 | 一則一列（`design-principles.md`「案例列」）：客戶名「和鼎隆建築」、作業照新聞標題原文、連到新聞 580。事實庫沒有成果，成果那一行不放（`DM-7` 寫法，「待確認」第 5 項） | 決策者任務「找成功案例」；`DM-7` | `GreenSwift 碳盤查`：前幾名提到的和鼎案例 | `fact:client-hedinglong`、`fact:greenswift-case-hedinglong` | 1 列，照原文 | 案例列（`caseNotes`） | 沒有片段：案例只有標題，畫不出作業的介面 |
| 9 | 先試用再決定 | 註冊後一個工作日內審核，審核通過後試用 30 天，到期自動關閉帳號權限；可以用 Gmail 登入，試用期間所有功能都能用，下載報告書時有浮水印。條件緊貼在「試用」旁，同一處讀完，不寫「免費」（`IT-7` 寫法）。動作連到試用申請頁 | IT 主管任務「決定要不要先試用」；`IT-7`；次要轉換：試用 | `GreenSwift 碳盤查`：前幾名缺的試用方式與審核時間；`碳盤查 平台 系統 推薦`：試用方式的比較；`碳盤查 費用 中小企業`：試用方式 | `fact:greenswift-review-one-day`、`fact:greenswift-trial-30-days`、`fact:greenswift-trial` | 說明句 20–40 字；條件 3 則 | 色帶，淺紫（`band`） | 介面片段 4：試用申請的狀態列，依序是註冊、審核、試用中、到期關閉帳號權限（狀態名稱照 `fact:greenswift-review-one-day`、`fact:greenswift-trial-30-days`），條件原文緊貼在旁 |
| 10 | 相關文章 | 給要深入碳足跡與 CBAM 計算的讀者。模板依 `blog.relatedOfferings` 反查，順序照新到舊，不寫文案 | 決策者任務「了解產品與方案」的前置知識 | `產品碳足跡 ISO 14067 怎麼計算`、`CBAM 申報 怎麼做 台灣 出口商`：由文章承接，產品頁連過去（`search-intent.md`「對應到頁面」） | 無（文章的事實由文章管） | 3 則 | 索引列（`relatedPosts` 反查） | 文章自己的封面縮圖 |
| 11 | 預約演示 | 頁尾的主要轉換，標題寫下一步（看平台怎麼帶盤查） | 主要轉換：預約演示 | — | 無 | 標題 10–20 字；說明 30–50 字 | 色帶，深紫（模板的 `ContactCta`） | 無 |

第 2–9 段是事實段，共 8 段。介面片段 4 張（第 3、5、7、9 段）。相鄰兩段的版型都不同；介面片段版型 3 次、規格表 2 次、接點圖、案例列、色帶各 1 次。段落圖 2 張（第 2、6 段）。

### 照原文列清單的段落

- 第 2 段：`fact:greenswift-scope` 的原文是三個方案攤平成一串，`fact:greenswift-carbon-plan`、`fact:greenswift-cbam-plan`、`fact:greenswift-footprint-plan` 是一串名詞。製作階段照 `.claude/skills/site-research/SKILL.md` 第 2 條在 `scripts/strategy/facts-source.yaml` 把 `text` 拆成每行一項，重跑 `node scripts/strategy/extract-facts.mjs`
- 第 3 段：`fact:greenswift-six-steps` 拆成每行一步，`fact:greenswift-scopes` 拆成範疇一到三各一行
- 說明句寫讀者得到什麼（例如「三種盤查與申報各有方案，數據在同一個平台」），不寫「以下列出」

### 不能寫的句子

| 段落 | 不能寫 | 為什麼 | 改寫的方向 |
|---|---|---|---|
| 1、9 | 「免費試用」 | 原文沒有「免費」，試用有審核、到期關閉與浮水印的條件（`IT-7` 寫法） | 寫「申請試用」，條件緊貼在旁 |
| 7 | 「昕力的顧問團隊協助盤查」 | 輔導由合作顧問公司執行（`fact:greenswift-consulting-partners`） | 寫「合作的顧問公司」；介紹昕力自己的顧問服務時連到 `/esg-advisory`，錨點寫明是昕力的 ESG 顧問服務 |
| 2 | 「支援 ISO 14067」 | 現站寫「未來還將整合」（「待確認」第 1 項） | 碳足跡列只用 `fact:greenswift-footprint-plan` 的原文 |
| 8 | 和鼎隆建築減了多少碳、通過哪家機構查證 | 只有新聞標題，查證機構與成果不在事實庫（「待確認」第 5 項） | 照標題寫用在哪家公司 |
| 全頁 | 表述用「一站式」「助力」 | `writing-style` 的 AI 高頻詞；現有 tagline「AI 助力 企業高效碳管理」要改 | 寫做了什麼：三種盤查在同一個平台 |
| 4 | 「可串接 ERP」 | 原文寫目前不支援直接整合 | 照 `fact:greenswift-no-erp-integration` 原文：整理好的資料從介面匯入 |

### 與現有頁面的差異

對照現在的 `src/content/offering/zh-TW/greenswift.md`：

| 現有 | 處理 | 理由 |
|---|---|---|
| tagline「AI 助力 企業高效碳管理」 | 改寫成含三種盤查的一句 | 「助力」是 AI 高頻詞，也沒說出做什麼 |
| description 寫「整合外部顧問與第三方查證團隊」 | 交 seo-strategist 依新段落重寫 | 「第三方查證團隊」不在事實庫，顧問是合作顧問公司 |
| 7 個 `features`（三張方案卡加四個頁籤） | 三張方案卡併入第 2 段；清冊上傳、檔案中心併入第 4 段；變更計算併入第 3 段；雲端協作併入第 5 段 | 每段回答一個選平台時的問題，不照現站頁籤分 |
| features 的「變更計算」多了「確保企業合規」，「雲端協作」多了「消除版本不一致的困擾……」 | 只用事實原文 | 多出的句子不在事實庫 |
| FAQ 11 題 | 不放 `faq`，答案裡已確認的事實分到第 3–9 段 | 見「取捨」第 2 項 |
| 只有一個 CTA（`cta: demo`） | 加 hero 的次要動作「申請試用」 | 現站 hero 有「申請試用」，試用是次要轉換 |
| 現站沒搬的方案表、六大步驟、儀表板、試用彈窗（`unmigrated.md`） | 放回第 2、3、9 段 | 各對應一個受眾任務或搜尋子題 |
| `/carbon` 的經濟型方案價格、執行週期、查證機構名稱 | 不放 | 沒收進事實庫（「待確認」第 4 項） |
| 內容檔沒有 `facts` 欄位 | 補 `facts: [...]` | 讓 `facts.mjs` 檢查這頁 |

## CTA

| CTA | 文案方向 | 位置 | 連到 |
|---|---|---|---|
| 主要：預約演示 | 沿用 `cta: demo` 的「預約演示」；第 11 段標題寫看平台怎麼帶盤查 | 第 1 段 hero（實心按鈕）、第 11 段 | `/contact-us`（`contact`） |
| 次要：申請試用（hero） | 寫「申請試用」，不寫天數與「免費」 | 第 1 段 hero（平塗淺底按鈕或文字連結） | 頁內第 9 段（`#trial`），讀者先讀到條件 |
| 次要：申請試用（第 9 段） | 寫「申請試用」，條件原文緊貼在旁 | 第 9 段的動作 | 現站的試用申請頁 `https://greenswift.tpisoftware.com/website/esg/ui`（站外，網址是否仍有效見「待確認」第 6 項） |

## 內部連結

路徑取 `docs/ia/nodes.csv`，新聞取 `news-article` 的 `/media-center/{id}`，blog 取 `page-map.csv` 的 `blog_slug`。`/whitepaper/greenswift` 依 #138 不產生頁面，不當連結目標。錨點文字寫目的地是什麼，不用「了解更多」。麵包屑沿 `parent` 連到 `/products` 與 `/products/esgswift`，模板產生，不必另寫。

### 連出

| 段落 | 連到 | 建議錨點文字 | 說明 |
|---|---|---|---|
| 1、11 | `/contact-us` | 預約演示 | 主要轉換（`cta: demo`） |
| 1 | `#trial`（頁內第 9 段） | 申請試用 | 第 9 段要有 `id: trial`；`scripts/seo/links.mjs` 檢查 `#錨點` 存在（取捨第 3 項） |
| 7 | `/esg-advisory` | 昕力的 ESG 永續發展與顧問服務 | 節點名前加「昕力的」，讀者分得出合作的顧問公司與昕力自己的顧問服務。放在第 7 段段末另起一句，不和合作顧問公司寫在同一句（取捨第 4 項）。兩頁都有「碳盤查」，這個連結也讓兩頁的主題分開：本頁是平台，顧問頁是輔導服務 |
| 8 | `/media-center/580` | 新聞標題原文「昕力資訊 GreenSwift 智慧碳管理平台助和鼎隆建築打造永續競爭力」（`fact:greenswift-case-hedinglong`） | 客戶名「和鼎隆建築」已在標題裡，也就在 `<a>` 裡，不再前綴客戶名（規則同 `finance.md`「內部連結」第 8 段）。需要 `caseNotes` 的 `news`（「schema 缺口」第 8 段） |
| 9 | 站外的試用申請頁 | 申請試用 | 不是站內連結，`links.mjs` 不檢查；網址待確認（「待確認」第 6 項） |
| 10 | `/blog/cbam-carbon-compliance-guide`、`/blog/carbonfootprint-quick-implementation-sme`、`/blog/what-is-scope3` | 文章標題（模板產生） | 三篇補 `relatedOfferings: [zh-TW/greenswift]`；`/blog/carbonfootprint` 不補（取捨第 12 項） |

### 連入

| 從 | 建議錨點文字 | 狀態 |
|---|---|---|
| header「產品」選單的 ESGswift 欄、`/products/esgswift` 的子頁卡片 | 節點名「GreenSwift 智慧碳管理平台」 | 已有 |
| 首頁第 4 段 | GreenSwift 智慧碳管理平台 | 首頁 brief 已列（`home.md`「內部連結」第 4 段） |
| `/blog/what-is-scope3` | 了解 GreenSwift 碳管理平台，預約演示 | 已有 |
| `/blog/carbonfootprint`、`/blog/carbonfootprint-quick-implementation-sme` | 現在是「立即了解 GreenSwift 經濟型方案……」「立即了解經濟型碳足跡方案……」 | 已有。錨點寫的「經濟型方案」是 `/carbon` 的方案名，本頁不寫（價格沒收），讀者點進來找不到；見取捨第 13 項 |
| `/media-center/580` | GreenSwift | 已有 |
| `/blog/cbam-carbon-compliance-guide` | — | 內文沒有連到本頁；補 `relatedOfferings` 後由本頁第 10 段連過去，文章內文不必改 |
| `/esg-advisory` | GreenSwift 智慧碳管理平台 | 建議：顧問頁改版時連回本頁，讓兩頁互指。不在 #199 範圍 |

### 建議新增

無。`碳盤查 費用 中小企業` 要等 `/carbon` 的方案價格收進事實庫，才能決定由本頁加方案表或另寫文章（取捨第 11 項）。

## title 與 description 方向

規則照 `seo-checklist`「每頁必備」：zh-TW title 約 20–32 個全形字（含後綴「｜TPIsoftware 昕力資訊」，後綴約佔 11 字），description 約 60–80 個全形字；半形英數約算半個全形字。

### title

- 節點名「GreenSwift 智慧碳管理平台」加後綴約 23.5 字，符合規則，但沒有「碳盤查」「碳足跡」「CBAM」這些查詢用詞。建議用 `seoTitle`；h1 維持節點名
- 要涵蓋：「GreenSwift」、「碳盤查」（`GreenSwift 碳盤查`、`碳盤查 平台 系統 推薦`）、「碳足跡」（`產品碳足跡 計算 軟體`）、「CBAM」
- 傳達的主張：`DM-7`。三種盤查與申報的用詞出自 `fact:greenswift-scope`
- 不放：「ISO 14067」（「待確認」第 1 項）、「免費」、「一站式」「助力」、「ESG 顧問」（`/esg-advisory` 的詞）
- 示例（含後綴）：
  - `GreenSwift 碳盤查平台：碳足跡與 CBAM 申報｜TPIsoftware 昕力資訊`（約 31.5 字）
  - `GreenSwift 智慧碳管理平台｜TPIsoftware 昕力資訊`（不加 `seoTitle` 的做法，約 23.5 字）

### description

- 要涵蓋：碳盤查、產品碳足跡與 CBAM；內建的盤查標準與係數；盤查清冊或環保署登錄平台格式；部門與外部顧問在同一個平台；試用
- 傳達的主張：`DM-7`、`DM-12`、`IT-7`
- 依據的事實：`fact:greenswift-scope`、`fact:greenswift-standards`、`fact:greenswift-epa-format`、`fact:greenswift-inventory-output`、`fact:greenswift-collaboration`、`fact:greenswift-cloud-collaboration`、`fact:greenswift-review-one-day`、`fact:greenswift-trial-30-days`
- 不寫：「免費」、試用天數（條件放不下，`IT-7` 寫法）、「ISO 14067」、越南文、價格。現行 description 的「第三方查證團隊」不在事實庫，要重寫
- 示例：
  - `GreenSwift 智慧碳管理平台處理碳盤查、產品碳足跡與 CBAM 申報資料，內建 GHG Protocol 與 ISO 14064-1:2018 標準，可下載環保署登錄平台格式，審核後可申請試用。`
  - `GreenSwift 讓企業各部門與合作顧問在同一個平台完成碳盤查、產品碳足跡與 CBAM 申報資料，系統內建盤查標準與係數，自動計算並產出盤查清冊，審核通過後可申請試用。`

## schema 缺口

offering schema（`src/content.config.ts`）已有 `heroLead`、`heroPoints`、`heroLabels`、`secondaryCta`、`sections`（`spec`、`ui`、`junction`、`band` 都有）、`caseNotes`、`relatedPosts`。

| 段落 | 缺什麼 | 新增的欄位或處理 | 型別 |
|---|---|---|---|
| 1 | `secondaryCta` 只接受 `node`，連不到頁內的第 9 段 | `secondaryCta` 加 `href`（頁內錨點），和 `node` 二選一 | `{ label: string; node?: string; href?: string }`，`href` 限 `#` 開頭，指到某個 `sections[].id` |
| 9 | `band` 的 `link` 是 `nodeLink`，連不到站外的試用申請頁 | 段落的 `link` 加站外連結的形狀 | `{ label: string; node: string } \| { label: string; href: string }`，`href` 限 `https://`。頁面載入時不連站外網域，只是 `<a>`，不違反 `CLAUDE.md`「功能模組」 |
| 8 | `caseNotes[].caseStudy` 只能指 `case-study`；和鼎隆建築沒有案例頁，只有新聞 580 | `caseNotes` 加 `news` | `ref('news')`（選填），和 `caseStudy` 二選一，錨點規則同案例內頁（客戶名在 `<a>` 裡） |
| 全頁 | 內容檔沒有 `facts` 欄位 | 補 `facts`（共用欄位已有） | — |
| 全頁 | `faq` 不再使用 | 不是 schema 缺口：刪掉內容檔的 `faq` | — |
| 10 | 三篇文章（`/blog/carbonfootprint`、`/blog/carbonfootprint-quick-implementation-sme`、`/blog/cbam-carbon-compliance-guide`）沒填 `relatedOfferings` | 不是 schema 缺口：在三篇的內容檔補 `relatedOfferings: [zh-TW/greenswift]`；要不要三篇都列由 seo-strategist 決定 | — |
| 2、3 | 攤平的事實原文 | 不是 schema 缺口：照「照原文列清單的段落」拆 `text` | — |

## 取捨

第 1–10 項是 content-strategist 寫的，第 11–14 項是 seo-strategist 加的（`search-intent.md`「待 seo-strategist 決定的事」跟這頁有關的條目，與 schema 缺口第 10 段留給 seo-strategist 的事）。seo-strategist 填了意見欄後定案；第 13 項要使用者決定，第 7、10 項交設計概念階段。

| # | 可能的衝突 | content-strategist 的立場 | 理由 | seo-strategist 的意見 | 最後決定 |
|---|---|---|---|---|---|
| 1 | 段數 | 8 個事實段，加 hero、相關文章、預約演示共 11 段 | confirmed 事實 34 則，用 32 則：hero 2、方案 4、標準與步驟 5、計算與報告 6、部門協作 3、資安 3、顧問 4、案例 2、試用 3。每段至少 2 則，最多 6 則。不用的 2 則見第 6 項。事實最多的是盤查流程與產出，所以這兩段各自成段；部門協作與顧問分成兩段，因為一段回答內部帳號、一段回答外部人員的資料權限 | 同意。8 個事實段各對應一組以上查詢的子題（段落表「搜尋子題」欄），沒有只為 SEO 存在的段；部門協作與顧問分兩段，剛好對上 `碳盤查 平台 系統 推薦` 前幾名缺的兩個子題（帳號數量、外部顧問） | 11 段 |
| 2 | 現站有 11 題 FAQ，要不要保留 `faq` | 不保留，已確認的答案分到第 3–9 段 | FAQ 的答案裡有規劃中的功能（ISO 14067、係數管理中心、多場所報告書）、隱私承諾與聯絡信箱，都不在事實庫（`unmigrated.md`「第一批 7 頁沒收的句子」）；第 2 題整題是表述。把確認的答案放進段落，每段回答一個問題，不必讀兩遍。digiRunner 頁不加 FAQ 的理由（`digirunner.md`「取捨」第 4 項）也適用 | 同意不放。Google 的 FAQ 複合式結果只給知名的政府與醫療網站，本站加 `FAQPage` 拿不到搜尋結果上的展示；FAQ 原本回答的試用、顧問、帳號問題，正是 `碳盤查 平台 系統 推薦` 前幾名缺的子題，寫在第 5、7、9 段的文字裡一樣讀得到 | 不放 `faq` |
| 3 | hero 的「申請試用」連到哪裡 | 連到頁內第 9 段，不直接連站外 | 試用的條件（審核、30 天、到期關閉、浮水印）放不進第一屏；按鈕直接連到申請頁，讀者會跳過條件。digiRunner 頁的試用按鈕連到雲端版頁，條件在那一頁；本頁沒有另一頁，所以連到頁內 | 同意。頁內錨點不影響收錄；第 9 段加 `id: trial` 後，`InPageNav` 也列得到這段，`links.mjs` 會檢查錨點存在 | 連到 `#trial`，需要 `secondaryCta` 的 `href`（「schema 缺口」） |
| 4 | 第 7 段要不要連到 `/esg-advisory` | 可以連，但和合作顧問公司的句子分開 | `DM-12` 寫法：輔導由合作顧問公司執行，要介紹昕力的顧問服務時連到 `/esg-advisory`。兩者放在同一句會讓讀者以為合作顧問就是昕力；錨點要寫出目的地是昕力的 ESG 顧問服務。連不連、放哪裡由 seo-strategist 決定 | 連。放在第 7 段段末另起一句，錨點「昕力的 ESG 永續發展與顧問服務」。兩頁都有「碳盤查」（`/esg-advisory` 的 description 寫依 ISO 14064-1 輔導碳盤查），互相連結並各用自己的詞（平台、顧問服務），搜尋引擎與讀者都分得出兩頁做的事 | 連，段末另起一句，錨點如左 |
| 5 | 和鼎隆建築只有新聞標題，要不要設案例段 | 設，一列，連到新聞 580 | 決策者任務「找成功案例」；是本頁唯一的具名客戶。`design-principles.md`「案例列」：事實庫沒有成果時成果那一行不放 | 同意。`GreenSwift 碳盤查` 的前幾名就有和鼎案例的報導，從那裡來的讀者在本頁對得上。錨點用新聞標題，客戶名在 `<a>` 裡（「內部連結」第 8 段） | 設一列，連到 `/media-center/580` |
| 6 | 兩則 confirmed 事實不用 | 不用 `fact:greenswift-plans` 與 `fact:greenswift-one-stop` | `fact:greenswift-plans` 只有「碳盤查會員 CBAM會員」兩個名稱，缺碳足跡，第 2 段的列名改用 `fact:greenswift-scope` 的三個方案名；`fact:greenswift-one-stop` 出自 `/products` 頁的一句話描述，「一站式完成盤查、認證與報告」的「認證」沒說是誰認證，放在第 6 段旁容易讀成平台會發認證 | 同意。`fact:greenswift-one-stop` 的「一站式」也是本站不用的字，引用原文就會出現在頁面上；方案名改用 `fact:greenswift-scope` 的三個名稱，「碳足跡」這個查詢用詞才在第 2 段的列名出現 | 不用 |
| 7 | 第 9 段的片段寫了天數與審核時間，`design-principles.md`「內頁共用的規則」寫片段不畫時間 | 照畫，但只畫狀態名稱，天數與「一個工作日」寫在旁邊的條件原文裡 | 原則禁止的是要靠假資料才成立的時間戳記；試用的天數與審核時間是事實原文，也是讀者要的條件。原則沒寫到這種情況，交設計概念階段確認 | 沒有 SEO 意見。條件原文要是 HTML 文字，不畫進圖裡 | 交設計概念階段 |
| 8 | 「目前不支援直接整合 ERP、HR 系統」要不要寫在頁面上 | 寫，放在第 4 段的圖下 | IT 主管要確認跟既有系統怎麼接；`search-intent.md` 記下前幾名都沒寫「不能做什麼」。原文同一句也寫了替代做法（從介面匯入），照原文寫不會比現站更負面 | 同意寫。`碳盤查 平台 系統 推薦` 的前幾名都沒寫「不能做什麼」，選平台的人要這句才能比較；連同替代做法照原文寫 | 寫，放在第 4 段的圖下 |
| 9 | `產品碳足跡 計算 軟體` 要不要用 ISO 14067 承接 | 不用 | 現站寫「未來還將整合」（「待確認」第 1 項）；第 2 段用碳足跡方案的原文回答 | 同意不用。title、description、h2 都不寫 ISO 14067；`產品碳足跡 計算 軟體` 用「碳足跡」與「跟碳盤查在同一個平台」承接，`產品碳足跡 ISO 14067 怎麼計算` 交給文章（第 12 項） | 不用 |
| 10 | 原則沒寫到的呈現方式 | 列出供設計概念階段確認 | 一、hero 圖是新圖；二、第 3 段的片段是步驟列，`ui` 版型原則舉的例子是設定面板；三、第 8 段的案例列只有一列，沒有成果也沒有片段；四、第 9 段的色帶放了介面片段，原則的色帶寫「1–2 則事實與一個動作」，這段有 3 則條件 | 第二點的 SEO 意見：步驟列的六個步驟名稱要是 HTML 文字，`ISO 14064-1 碳盤查 步驟` 的讀者才讀得到。其他三點沒有 SEO 意見 | 交設計概念階段 |
| 11 | `碳盤查 費用 中小企業` 由哪頁承接（`search-intent.md` 待決條目，原本建議 `/whitepaper/greenswift`） | 第 7、9 段把這組列為次要子題 | 事實庫沒有價格（「待確認」第 4 項） | 沒有主要承接頁，本頁次要。`/whitepaper/greenswift` 依 #138 不產生頁面（`navigation.csv` 的 `none`），現站同主題文章是 `drop`。本頁用第 9 段的試用條件與第 7 段的顧問分工回答前幾名缺的一部分，不寫價格。`/carbon` 的價格收進事實庫後，再決定由本頁加方案表或另寫文章 | 定案 |
| 12 | 第 10 段列哪幾篇文章（「schema 缺口」第 10 段留給 seo-strategist） | 三篇（`/blog/carbonfootprint`、`/blog/carbonfootprint-quick-implementation-sme`、`/blog/cbam-carbon-compliance-guide`）補 `relatedOfferings`，要不要三篇都列由 seo-strategist 決定 | — | 列 `/blog/cbam-carbon-compliance-guide`（承接 `CBAM 申報 怎麼做 台灣 出口商`）、`/blog/carbonfootprint-quick-implementation-sme`（承接 `產品碳足跡 ISO 14067 怎麼計算`，有選指標產品、生命週期邊界、盤點數據、用平台計算的步驟）、`/blog/what-is-scope3`（範疇一到三、ISO 14064-1 與 GHG Protocol 的差別，接第 3 段與 `ISO 14064-1 碳盤查 步驟`）。三篇各對應一組查詢。`/blog/carbonfootprint` 的主題跟前兩篇重疊（CBAM 與碳足跡），內文已連到本頁，不補 `relatedOfferings`：補了的話，模板依新到舊會列它、擠掉 `what-is-scope3` | 定案：三篇如左補 `relatedOfferings`，`/blog/carbonfootprint` 不補 |
| 13 | 兩篇碳足跡文章的連入錨點寫「經濟型方案」 | 沒有提 | — | `/blog/carbonfootprint`、`/blog/carbonfootprint-quick-implementation-sme` 結尾的連結寫「GreenSwift 經濟型方案」「經濟型碳足跡方案」，指的是 `/carbon` 的方案；本頁不寫經濟型方案（價格沒收），讀者照錨點點進來找不到。建議改成「GreenSwift 智慧碳管理平台的碳足跡方案」。兩篇是照現站搬的文章，改不改由使用者決定 | 待使用者決定 |
| 14 | 報告語言（`search-intent.md` 待決條目的後半） | 第 6 段照 `fact:greenswift-languages` 寫繁中與英文；越南文列「待確認」第 3 項 | 越南文只在新聞 | 同意。title、description 都不寫語言；越南文跟現站確認前不寫 | 定案 |

## 待確認

事實庫沒有這些內容，頁面不補、不寫成更強的說法：

| # | 事項 | 卡在哪 | 影響的段落 |
|---|---|---|---|
| 1 | ISO 14067 是否已支援 | `fact:greenswift-roadmap-iso14067` 寫「未來還將整合」（`messaging.md`「缺少證據的主張」第 21 項） | 2 |
| 2 | AUP 認證的查證機構與效期 | `fact:cert-greenswift-aup` 照原文寫「國際查證機構」，不補機構名 | 1 |
| 3 | 報告是否產出越南文；多場所報告書是否上線 | 越南文只在新聞，`fact:greenswift-languages` 寫繁中與英文；多場所報告書現站寫開發中（第 21 項） | 4、6 |
| 4 | `/carbon` 的方案價格、執行週期與合作的查證機構名稱 | 整頁沒收（`unmigrated.md`「第一批 7 頁沒收的句子」）。`碳盤查 費用 中小企業` 因此沒有價格可寫 | 2 |
| 5 | 和鼎隆建築案例的成果與查證 | 新聞 580 的內文寫了查證機構與成果，事實庫只收標題 `fact:greenswift-case-hedinglong`。這列不放成果 | 8 |
| 6 | 試用申請頁的網址 | 現站彈窗連到 `https://greenswift.tpisoftware.com/website/esg/ui`，是否仍是正式的申請入口要確認 | 9 |

## 後續

- en、vi 版另做，照 `content-migration` skill 的「多語系內容」，不在本 brief 範圍
