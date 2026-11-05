# Content brief：AISO 主權 AI `/aiso`（#199）

- 模板：`offering`（`kind: product`）；內容檔：`src/content/offering/zh-TW/aiso.md`
- 主張 id 指 `docs/strategy/messaging.md`；事實的寫法見 `content-strategy` skill「引用事實的寫法」，只用 `docs/strategy/facts.yaml` 裡 zh-TW、`status: confirmed` 的條目
- 狀態：#199 策略階段。content-strategist 初稿，seo-strategist 補了「搜尋意圖」「內部連結」「title 與 description 方向」與「取捨」的意見欄、最後決定，之後等 `strategy-approved`

## 這頁從哪裡推出來

現站 `/aiso` 只有 hero 兩句與 8 張方案卡片（`unmigrated.md`「AISO 主權 AI」），新站的內容檔照搬了這些。本 brief 不從 8 張卡片往外擴，改從決策者與 IT 主管評估地端 AI 時的問題往回推：我的部門能用它做什麼、要找幾家廠商、資料會不會出去、要買哪台機器。

事實的來源有三處：

| 來源 | 事實 | 在本頁 |
|---|---|---|
| `/aiso` 本頁 | `aiso-ecosystem` 與 8 張方案卡片的 8 筆，共 9 筆 | 全部使用 |
| `/products/systalk-ai-phison`（IA 上併入 `/products/systalk-ai`，`aiso-*` 大多取自這頁） | 20 筆 `aiso-*`，其中 12 筆 confirmed | 使用 9 筆；不用 3 筆，見「取捨」第 2 項 |
| 現站新聞 559 的標題 | `aiso-alliance` | hero 的證據點 |

`messaging.md`「缺少證據的主張」第 17 項確認前，本頁不寫一體機的軟體核心是哪一套。

## 受眾與任務

依 `docs/research/audience-and-goals.md`「受眾分群」：

| 受眾 | 來這頁做什麼 | 這頁要讓他做到的事 |
|---|---|---|
| 決策者（CIO、CTO、高階主管），主要 | 了解地端 AI 能用在哪些部門、要找幾家廠商、資料與成本風險在哪裡被處理；決定要不要聯絡業務 | 第一屏讀到「軟硬體一起交付、昕力負責導入」；看到各部門現成的方案；看到資料留在企業內與用量管控的機制；找得到聯絡業務 |
| IT 主管、專案負責人，主要 | 確認要買哪一台機器、跑得動多大的模型、權限與稽核怎麼做 | 機型規格表寫出 VRAM、知識庫規模與 LLM 級距；權限、存取控管與稽核紀錄寫成機制 |

主要轉換：聯絡業務（內容檔 `cta: contact`）。本頁沒有試用與案例的事實，所以沒有次要轉換。

## 搜尋意圖

依 `docs/strategy/search-intent.md`「AISO 主權 AI `/aiso`」，加上首頁一節的「企業主權 AI 地端部署 方案」。沒有 Search Console 數據，取捨只依受眾與頁面主題，不依搜尋量。和 `/orient-ai` 的分工依查詢的主題，不依一體機的軟體核心（取捨第 11 項）：本頁承接硬體、軟硬體交付與地端部署的查詢，`/orient-ai` 承接 Agent 平台、治理與 Token 成本控管的查詢。

### 這頁承接的查詢

| 查詢 | 意圖類型 | 承接 | `search-intent.md` 的條目 |
|---|---|---|---|
| `AISO 主權 AI` | 導航型，前幾名全是聯盟新聞，實際滿足的是資訊需求 | 主要。節點名就是這組詞。前幾名缺的硬體規格（第 5 段）、內建的方案（第 2 段）、導入工作（第 3 段）、適用產業（第 4 段）由本頁回答；聯盟本身的消息交給新聞頁（取捨第 12 項） | 「AISO 主權 AI」 |
| `企業主權 AI 地端部署 方案` | 資訊型與商業型 | 主要（首頁 brief 已指給本頁）。前幾名缺的硬體規格（第 5 段）、Token 用量的成本（第 4 段）、平台內建的方案（第 2 段） | 「企業主權 AI 地端部署 方案」（首頁一節） |
| `地端 AI 伺服器 企業 LLM` | 資訊型帶商業型 | 主要。前幾名缺的規格與模型大小對照（第 5 段）、軟硬體一起交付（第 3 段）、不限 Token（第 4 段） | 「地端 AI 伺服器 企業 LLM」 |
| `AI 一體機 企業 地端 交機即用` | 商業型（找可買的一體機） | 主要；「為什麼需要一體機」由 `/blog/why-enterprises-need-ai-appliance` 回答（第 7 段）。前幾名缺的機型規格與知識庫規模（第 5 段）、內建的應用清單（第 2 段）、導入時廠商做的工作（第 3 段）都在本頁。承接頁不隨軟體核心改變（取捨第 11 項） | 「AI 一體機 企業 地端 交機即用」 |
| `昕力 群聯 AISO 聯盟` | 導航型與資訊型 | 主要；聯盟成立的消息由 `/media-center/559` 承接（取捨第 12 項）。第 5 段的 aiDAPTIV 機制（`fact:aiso-memory-optimization`）回答前幾名缺的「aiDAPTIV 實際做什麼」 | 「昕力 群聯 AISO 聯盟」 |
| `企業 地端 LLM 建置 成本` | 資訊型（評估成本），帶比較型 | 次要，沒有主要承接頁。沒有價格事實，只能用第 3 段（軟硬體不必分開採購）與第 4 段（不限 Token）回答前幾名缺的成本結構，不寫金額（「待確認」第 5 項） | 「企業 地端 LLM 建置 成本」 |
| `aiDAPTIV SysTalk.ai` | 導航型 | 次要，沒有主要承接頁。本頁寫得出 aiDAPTIV（第 5 段），軟體核心確認前不寫 SysTalk.ai（「待確認」第 1 項）；確認是 SysTalk.ai 之後，本頁才接得住這組 | 「aiDAPTIV SysTalk.ai」 |
| `主權 AI 是什麼` | 資訊型（定義） | 次要。本頁不寫定義（取捨第 7 項），第 4 段回答前幾名缺的企業層級（哪些產業需要、資料不出門）；定義建議交文章（「建議新增」） | 「主權 AI 是什麼」 |
| `生成式 AI 私有化部署 金融業` | 資訊型 | 次要；主要 `/industries/finance`。第 4 段的稽核紀錄與適用產業回答一部分 | 「生成式 AI 私有化部署 金融業」 |
| `AI Agent 地端部署 Token 成本` | 資訊型 | 次要；主要 `/orient-ai`。第 4 段的不限 Token、第 6 段的分層用量上限回答一部分 | 「AI Agent 地端部署 Token 成本」（OrientAI 一節） |

### 不由這頁承接的查詢

| 查詢 | 交給 | 理由 |
|---|---|---|
| `AI Agent 地端部署 Token 成本`（主要）、`AI Agent 治理 影子 AI 企業`、`企業級 Agentic AI 平台` | `/orient-ai` | Agent 平台的成本控管與治理是 OrientAI 的主題；前幾名缺的部門層級用量監控在那頁（取捨第 11 項） |
| AISO 聯盟的成立、成員與簽約 | `/media-center/559` | 新聞的內容；事實庫只有標題（取捨第 12 項） |
| `主權 AI 是什麼`（主要） | 建議新增的 blog 文章 | 定義型，前幾名從國家層級講 |
| `企業 生成式 AI 平台 地端部署 RAG` | `/products/systalk-viki`，次要 `/products/systalk-ai` | RAG 與模組清單不在本頁（取捨第 2 項） |

## 這頁要讓讀者相信什麼

要把 AI 放在自己機房的企業，買到的是軟硬體已整合好的方案，昕力負責導入，不必分開採購再對接（`DM-10`、`DM-4`）；法務、人資等部門有現成的方案可以用，AI Agent 與算力也管得住（`DM-11`）；資料與用量都留在企業內（`DM-3`、`IT-5`），機型照團隊規模挑（`IT-10`）。

## 段落結構

順序照決策者的判斷順序：能用在哪些部門、要找幾家、資料留不留得住，再給 IT 主管機型與治理的細節。

「版型」欄照 `docs/strategy/design-principles.md`「內頁的版型」的 10 種，括號裡是 `src/content.config.ts` 的 `pageSection` 的 `layout` 值；案例列與索引列不是 `sections` 的 layout，寫出對應的欄位。「影像」欄照同一節「內頁共用的規則」：介面片段（`data-ui`、標「示意」）只畫事實寫得出的功能名稱、設定項目與狀態名稱，不畫筆數、時間與曲線。

| # | 段落 | 目的 | 依據（受眾任務／主張 id） | 搜尋子題 | 事實 | 預估長度 | 版型 | 影像 |
|---|---|---|---|---|---|---|---|---|
| 1 | Hero：AISO 是什麼、給誰 | h1 用節點名「AISO 主權 AI」（取捨第 3 項）。tagline 寫用途：地端 AI 的軟體與硬體一起交付。說明句寫對象（要把 AI 放在自己機房的企業）與做的事（軟硬體整合好、昕力負責導入、各部門有現成方案），不寫軟體名稱。兩則證據點，一個動作「聯絡業務」 | 決策者任務「確認這是不是我要找的方案」；`DM-10`；主要轉換：聯絡業務 | `AISO 主權 AI`：這個聯盟與方案是什麼；`企業主權 AI 地端部署 方案`：部署形式 | `fact:aiso-ecosystem`、`fact:aiso-alliance` | tagline 15–25 字；說明 40–60 字；證據點 2 則 | 第一屏（`tagline`、`heroLead`、`heroPoints`） | 同一個世界渲染的靜態圖（新圖，檔名與構圖由設計概念階段決定，比照 `page-digirunner.webp`）。HTML 標籤（`heroLabels`）只用事實寫得出的詞：硬體、軟體、地端 AI 平台（`fact:aiso-ecosystem`、`fact:aiso-bundled`），不標軟體名稱。不載 3D |
| 2 | 各部門有現成的 AI 方案 | 說明句寫讀者得到什麼：法務、人資、教育、醫療與人才培育的工作，不必從空白平台開始。一列一個方案：方案名稱一欄，說明原文一欄。教育與醫療照原文列出，不寫成產業入口（`DM-11` 寫法） | 決策者任務「了解產品與方案」；`DM-11` | `AI 一體機 企業 地端 交機即用`：前幾名缺的內建應用清單（`/aiso` 的方案卡）；`AISO 主權 AI`：平台內建哪些模組；`主權 AI 是什麼`：企業層級怎麼做到（病歷整合、備課） | `fact:aiso-legal-contract`、`fact:aiso-hr-labor-law`、`fact:aiso-hr-employee-service`、`fact:aiso-teaching`、`fact:aiso-medical-records`、`fact:aiso-talent` | 說明句 30–50 字；表 6 列，照原文 | 規格表（`spec`），`fill: subtle` | 段落圖（緞帶世界，新圖，h2 旁的最後 4 欄，375 寬不顯示） |
| 3 | 軟體與硬體一起交付，導入由昕力負責 | 不必分開詢價、對接規格；軟硬一體消除相容性風險；導入規劃、模型設定、建置與應用模組設計由昕力做。寫「軟體」「平台」，不寫哪一套（`DM-10` 寫法） | 決策者任務「確認要找幾家廠商、風險在哪裡被處理」；`DM-10`、`DM-4` | `AI 一體機 企業 地端 交機即用`：軟硬體預先整合、導入時廠商做哪些工作；`企業 地端 LLM 建置 成本`：軟硬體分開採購的時間成本；`地端 AI 伺服器 企業 LLM`：軟硬體一起交付、免另外對接 | `fact:aiso-bundled`、`fact:aiso-hw-sw-integrated`、`fact:aiso-onboarding` | 說明句 40–70 字；事實 3 則 | 主張與原文（`claim`） | 無 |
| 4 | 資料與用量留在企業內 | AI 運算在地、數據不出門；權限管理、存取控管與稽核紀錄內建；地端不限 Token 流量。適用產業照原文列在段末，不把製造業寫進標題（`DM-3` 寫法） | 決策者任務「確認資料風險在哪裡被處理」；IT 主管任務「確認權限與稽核」；`DM-3`、`IT-5` | `企業主權 AI 地端部署 方案`：資料主權；`地端 AI 伺服器 企業 LLM`：不限 Token、角色權限與稽核；`企業 地端 LLM 建置 成本`：Token 不計量的成本結構；`主權 AI 是什麼`：哪些產業需要；`生成式 AI 私有化部署 金融業`：AI 使用紀錄怎麼留給稽核（次要，主要在金融頁） | `fact:aiso-local-audit`、`fact:aiso-no-token-limit`、`fact:aiso-industries` | 說明句 30–50 字；事實 3 則 | 介面片段（`ui`） | 介面片段 1：權限與稽核的設定面板，項目是權限管理、存取控管、稽核紀錄（`fact:aiso-local-audit`），一列「Token 流量：不限」（`fact:aiso-no-token-limit`）。畫出的接點：AI 運算與資料都在企業內這一側 |
| 5 | 機型照知識庫規模與模型級距挑 | 兩個機型並排：VRAM、適用的知識庫規模與 LLM 級距、適用場景（單一部門與 PoC，或跨部門 AI 中台）；一列寫 aiDAPTIV 用記憶體管理與資料調度，在相同 GPU 條件下支援更大的模型，只寫機制，不寫快幾倍（`IT-10` 寫法） | IT 主管任務「確認要買哪一台、跑得動多大的模型」；`IT-10` | `地端 AI 伺服器 企業 LLM`：前幾名缺的規格與模型大小對照；`AI 一體機 企業 地端 交機即用`：各機型的規格與知識庫規模；`AISO 主權 AI`：硬體規格；`昕力 群聯 AISO 聯盟`：aiDAPTIV 實際做什麼 | `fact:aiso-servers`、`fact:aiso-use-cases`、`fact:aiso-memory-optimization` | 說明句 20–40 字；表 4 列（品名、VRAM、特性、適用場景），加一列技術說明 | 規格表（`spec`），`fill: subtle` | 表格的兩欄是兩個機型，沒有段落圖（表本身已佔滿 12 欄） |
| 6 | AI Agent 與算力管得住 | 不同來源的 AI Agent 統一納管；算力以租戶隔離、分層用量上限與自動出帳分攤或計費 | 決策者任務「確認風險在哪裡被處理」；IT 主管任務「確認上線後維運得動」；`DM-11`、`DM-3` | `AI Agent 地端部署 Token 成本`：用量上限（次要，主要在 `/orient-ai`）；`AI Agent 治理 影子 AI 企業`（次要，主要在 `/orient-ai`） | `fact:aiso-agent-governance`、`fact:aiso-compute-control` | 說明句 30–50 字；事實 2 則 | 介面片段（`ui`，`flip: true`，和第 4 段左右對調） | 介面片段 2：算力與 Agent 的管理面板，項目是 AI Agent 統一納管、租戶隔離、分層用量上限、自動出帳（`fact:aiso-agent-governance`、`fact:aiso-compute-control`）。只畫項目名稱與開關狀態，不畫租戶名稱與用量數字 |
| 7 | 相關文章 | 給想先弄清楚「企業為什麼需要 AI 一體機」的讀者。模板依 `blog.relatedOfferings` 反查產生，不寫文案 | 決策者任務「了解產品與方案」的前置知識 | `AI 一體機 企業 地端 交機即用`：問「為什麼需要」的交給文章（`search-intent.md`「對應到頁面」） | 無（文章的事實由文章管） | 1 則 | 索引列（`relatedPosts` 反查） | 文章自己的封面縮圖 |
| 8 | 聯絡業務 | 頁尾的主要轉換，標題寫下一步（談部門需求與機型） | 主要轉換：聯絡業務 | — | 無 | 標題 10–20 字；說明 30–50 字 | 色帶，深紫（模板的 `ContactCta`） | 無 |

第 2–6 段是事實段，共 5 段。介面片段 2 張（第 4、6 段），不到「至少 4 張」，見「取捨」第 5 項。相鄰兩段的版型都不同；規格表 2 次、介面片段 2 次、主張與原文 1 次。

### 照原文列清單的段落

- 第 2 段：8 張卡片的原文是「方案名稱 說明」一串，表格的兩欄把名稱與說明分開，字不改
- 第 5 段：`fact:aiso-servers`、`fact:aiso-use-cases` 的原文是攤平的表格。製作階段照 `.claude/skills/site-research/SKILL.md` 第 2 條在 `scripts/strategy/facts-source.yaml` 把 `text` 拆成每行一格，重跑 `node scripts/strategy/extract-facts.mjs`，再排成兩欄的表
- 說明句寫讀者得到什麼，不寫「以下列出」這類交代版面的句子（`content-strategy` skill「3. 頁面文案」）

### 不能寫的句子

| 段落 | 不能寫 | 為什麼 | 改寫的方向 |
|---|---|---|---|
| 1、3 | 「搭載 SysTalk.ai」「以 OrientAI 為核心」 | 軟體核心還沒確認（`messaging.md`「缺少證據的主張」第 17 項） | 寫「軟體」「平台」 |
| 1 | 「100% AI 主控權」 | 口號，沒有量測依據（「待確認」第 2 項） | 寫機制：資料不出門、權限與稽核內建 |
| 1、3 | 聯盟的成員家數、成立日期、簽約客戶 | 只在新聞 559 的內文，不在事實庫（「待確認」第 2 項） | 只用 `fact:aiso-alliance` 的標題原文 |
| 5 | 「速度快 N 倍」「比 Dell、HPE 能跑更大的模型」 | 群聯提供的估算與點名競品的比較（「待確認」第 3 項） | 只寫 `fact:aiso-memory-optimization` 的機制原文 |
| 全頁 | 表述用「落地」「生態系」 | `messaging.md`「統一用詞」與 `writing-style` 的 AI 高頻詞；`fact:aiso-ecosystem` 原文裡的這兩個詞照引 | 表述寫「導入」「軟硬體廠商」 |

### 與現有頁面的差異

對照現在的 `src/content/offering/zh-TW/aiso.md`：

| 現有 | 處理 | 理由 |
|---|---|---|
| title「AISO 主權 AI 解決方案」 | h1 改用節點名「AISO 主權 AI」 | 「解決方案」只用在正式名稱（`messaging.md`「本站不用的字」），節點名沒有這三個字；title 的寫法交 seo-strategist（取捨第 3 項） |
| tagline 照搬 `fact:aiso-ecosystem` 原文 | tagline 改寫成表述，原文移到 hero 證據點 | tagline 是表述，事實原文放證據點才看得出是事實（P2） |
| 8 個 `features`，每項標題加一句 | 6 項併成第 2 段的表；AI Agent 治理、算力管控 2 項移到第 6 段 | 前 6 項是部門的工作，後 2 項是 IT 的管理機制，回答不同的問題 |
| 只有 8 張卡片，沒有交付方式、資料、機型 | 新增第 3、4、5 段 | 事實都在 `/products/systalk-ai-phison`，現站 `/aiso` 沒放；各回答一個受眾任務 |
| 內容檔沒有 `facts` 欄位 | 補 `facts: [...]` | 讓 `facts.mjs` 檢查這頁 |
| 現站每張卡片的「了解更多」連到 `aisoportal.com` | 不放 | 見「取捨」第 8 項 |

## CTA

| CTA | 文案方向 | 位置 | 連到 |
|---|---|---|---|
| 主要：聯絡業務 | 按鈕寫「聯絡業務」（全站同名，`messaging.md`「統一用詞」）；第 8 段的標題談部門需求與機型 | 第 1 段 hero（實心按鈕）、第 8 段 | `/contact-us`（`contact`） |

沒有次要 CTA：本頁沒有試用、價格與案例的事實。hero 只放一個按鈕，頁內導覽（`InPageNav`）提供跳到機型與方案的入口。

## 內部連結

路徑取 `docs/ia/nodes.csv`，新聞取 `news-article` 的 `/media-center/{id}`，blog 取 `page-map.csv` 的 `blog_slug`。父節點 `/services` 依 #138 不產生頁面，麵包屑在「服務總覽」不加連結，本頁的連入只能靠 header 與 footer 的「服務」選單和其他頁的內文。錨點文字寫目的地是什麼，不用「了解更多」。

### 連出

| 段落 | 連到 | 建議錨點文字 | 說明 |
|---|---|---|---|
| 1、8 | `/contact-us` | 聯絡業務 | 主要轉換，全站同名 |
| 3 | `/media-center/559` | AISO 主權 AI 產業聯盟成軍的新聞 | 第 3 段寫整合式交付，新聞 559 的標題主打同一件事（`fact:aiso-alliance`）；聯盟的成員與簽約讀者在新聞讀得到，本頁不寫（取捨第 12 項）。`sections[].link` 只接受節點，連到新聞要加欄位，形狀同 `greenswift.md`「schema 缺口」第 8 段 `caseNotes` 的 `news`（`ref('news')`）。不加欄位就不放這個連結，不影響其他段落 |
| 7 | `/blog/why-enterprises-need-ai-appliance` | 文章標題（模板產生） | 在文章補 `relatedOfferings: [zh-TW/aiso]` 後由第 7 段列出（「schema 缺口」第 7 段） |
| 6 | 不連 `/orient-ai` | — | 取捨第 9、11 項：軟體核心確認前，第 6 段的 Agent 納管連到 OrientAI，讀者會讀成 AISO 用的是 OrientAI |
| 2 | 不連 `aisoportal.com` | — | 取捨第 8 項 |

### 連入

| 從 | 建議錨點文字 | 狀態 |
|---|---|---|
| header 與 footer 的「服務」選單 | 節點名「AISO 主權 AI」 | 已有 |
| `/blog/enterprise-ai-adoption`（部署在企業端的段落） | 現在是「AISO 主權 AI 解決方案」 | 已有（#173）。建議改成節點名「AISO 主權 AI」：「解決方案」不是正式名稱（取捨第 3 項），連結文字跟 h1 一致。文章下次改版時改，不另開 issue |
| `/media-center/585` | 現在是網址文字「https://www.tpisoftware.com/aiso」 | 已有。新聞是照現站搬的原文，錨點不改 |
| `/orient-ai` 第 7 段段末 | 建議「軟硬體一起交付的地端 AI：AISO 主權 AI」 | 由 `orient-ai.md` 決定。錨點寫目的地是地端方案，不寫兩者的關係（第 17 項確認前） |
| `/products/systalk-ai` | 不連 | `systalk-ai.md`「取捨」第 12 項 |
| 首頁 | 不連 | `home.md`「取捨」第 4 項：5 段版沒有服務卡片 |

### 建議新增

| 頁面 | 位置 | 理由 |
|---|---|---|
| 「主權 AI 是什麼」的 blog 文章（企業層級） | `/blog/{slug}`（新的 `blog-post`，分類建議 `blog-ai`） | 承接 `主權 AI 是什麼`：前幾名多從國家層級講，企業層級的做法（哪些產業需要、地端部署後由誰導入與維運）沒有人寫。用已確認的 `fact:aiso-industries`、`fact:aiso-local-audit`、`fact:aiso-onboarding` 等，不需要新事實；文末連到本頁，填 `relatedOfferings: [zh-TW/aiso]`，第 7 段會變成 2 則。另開 issue（取捨第 7 項） |

## title 與 description 方向

規則照 `seo-checklist`「每頁必備」：zh-TW title 約 20–32 個全形字（含後綴「｜TPIsoftware 昕力資訊」，後綴約佔 11 字），description 約 60–80 個全形字；半形英數約算半個全形字。

### title

- 現有 title「AISO 主權 AI 解決方案」；h1 改成節點名「AISO 主權 AI」（取捨第 3 項），加後綴只有約 17 字，低於下限。用 `seoTitle`
- 要涵蓋：「AISO 主權 AI」、「地端 AI」、「一體機」（`AI 一體機 企業 地端 交機即用`）、「軟硬體」
- 傳達的主張：`DM-10`。「一體機」是類別詞，`fact:aiso-bundled` 的「硬體內建軟體」撐得住，現站的新聞與文章也這樣稱呼
- 不放：軟體名稱（第 17 項）；「Agentic」「Agent 平台」「Token」（`/orient-ai` 的詞，取捨第 11 項）；「解決方案」；「聯盟」（聯盟的消息交給新聞頁）；「100%」
- 示例（含後綴）：
  - `AISO 主權 AI：軟硬體整合的地端 AI 一體機｜TPIsoftware 昕力資訊`（約 31 字）
  - `AISO 主權 AI：軟硬體一起交付的地端 AI｜TPIsoftware 昕力資訊`（約 29.5 字，不用「一體機」的做法）

### description

- 要涵蓋：軟硬體一起交付、昕力負責導入、部門方案（法務、人資）、資料不出門與權限稽核、不限 Token、機型依知識庫規模
- 傳達的主張：`DM-10`、`DM-4`、`DM-11`、`DM-3`、`IT-10`
- 依據的事實：`fact:aiso-ecosystem`、`fact:aiso-bundled`、`fact:aiso-onboarding`、`fact:aiso-legal-contract`、`fact:aiso-hr-labor-law`、`fact:aiso-local-audit`、`fact:aiso-no-token-limit`、`fact:aiso-servers`
- 不寫：軟體名稱、效能倍數、「100% AI 主控權」、聯盟成員與簽約、價格；表述不用「落地」「生態系」。現行 description 照搬 `fact:aiso-ecosystem` 原文，有這兩個詞，也沒寫交付方式與機型，要重寫
- 示例：
  - `AISO 主權 AI 把地端 AI 的軟體與硬體一起交付，昕力負責導入規劃與建置；法務、人資等部門有現成方案，資料與權限留在企業內，地端不限 Token 流量，機型依知識庫規模挑選。`
  - `要把 AI 放在自己機房的企業，AISO 主權 AI 提供軟硬體整合好的地端 AI，由昕力負責導入；AI 運算與資料留在企業內，權限與稽核內建，各部門有現成的 AI 方案。`

## schema 缺口

offering schema（`src/content.config.ts`）已有 `heroLead`、`heroPoints`、`heroLabels`、`sections`（`spec`、`claim`、`ui` 都有）、`relatedPosts`。本頁的段落都放得下。

| 段落 | 缺什麼 | 處理 | 型別 |
|---|---|---|---|
| 全頁 | 內容檔沒有 `facts` 欄位 | 補 `facts`（共用欄位已有） | — |
| 5 | `fact:aiso-servers`、`fact:aiso-use-cases` 的 `text` 是一串，放不進表格的格子 | 不是 schema 缺口：照「照原文列清單的段落」拆 `text` | — |
| 7 | 相關文章由 `blog.relatedOfferings` 反查，`/blog/why-enterprises-need-ai-appliance` 沒填 | 不是 schema 缺口：在文章的內容檔補 `relatedOfferings: [zh-TW/aiso]` | — |
| 1 | hero 的靜態圖還沒有 | 不是 schema 缺口：設計概念階段產生新圖，`heroImage` 指過去 | — |

## 取捨

第 1–10 項是 content-strategist 寫的，第 11–12 項是 seo-strategist 加的（`search-intent.md`「待 seo-strategist 決定的事」跟這頁有關的條目）。seo-strategist 填了意見欄後定案；第 2 項要使用者決定，第 5、10 項交設計概念階段。

| # | 可能的衝突 | content-strategist 的立場 | 理由 | seo-strategist 的意見 | 最後決定 |
|---|---|---|---|---|---|
| 1 | 段數 | 5 個事實段，加 hero、相關文章、聯絡色帶共 8 段 | 本頁可用的 confirmed 事實 19 則（`/aiso` 9 則、`/products/systalk-ai-phison` 9 則、新聞標題 1 則，hero 用 2 則；來源頁另有 3 則 confirmed 不用，見第 2 項）。每段至少 2 則：部門方案 6 則、交付 3 則、資料與用量 3 則、機型 3 則、Agent 與算力 2 則。沒有案例、試用、價格的事實，所以不設案例段與試用段，不照 digiRunner 的 12 段 | 同意。10 組查詢的子題都對得到第 2–6 段（段落表「搜尋子題」欄）；沒有案例與價格的事實，不為 SEO 加段 | 8 段 |
| 2 | `/products/systalk-ai-phison` 的 confirmed 事實哪些能用 | 12 筆 confirmed 用 9 筆：`fact:aiso-bundled`、`fact:aiso-hw-sw-integrated`、`fact:aiso-onboarding`、`fact:aiso-local-audit`、`fact:aiso-no-token-limit`、`fact:aiso-industries`、`fact:aiso-servers`、`fact:aiso-use-cases`、`fact:aiso-memory-optimization`（原文都沒點名軟體）。另外用新聞的 `fact:aiso-alliance`。不用 3 筆：`fact:aiso-llm-support`、`fact:aiso-systalk-platform`（原文點名 SysTalk.ai，`messaging.md` 第 17 項），以及 `fact:aiso-modules` | `fact:aiso-modules` 沒點名軟體，但列的 15 個模組是來源頁那套軟體的模組；軟體核心若是 OrientAI，這份清單就不對。`search-intent.md` 記下「內建的應用模組清單」是前幾名缺的子題，第 2 段改用 `/aiso` 本頁的 6 個方案回答。要不要用，請使用者決定（回報的「需要使用者決定的事」） | 同意暫不用。前幾名缺的「內建的應用清單」由第 2 段的 6 個方案回答，對 `AI 一體機 企業 地端 交機即用` 的商業型讀者來說，「哪個部門能用它做什麼」比 15 個模組名稱更貼近要找的東西；模組清單已在 `/products/systalk-ai` 第 5 段，兩頁不重複，也就不搶 `企業 生成式 AI 平台 地端部署 RAG` | 暫定不用 `fact:aiso-modules`，第 17 項確認後再決定；要不要用由使用者決定 |
| 3 | h1 與 title 用節點名「AISO 主權 AI」還是現有的「AISO 主權 AI 解決方案」 | h1 用節點名 | 選單、footer 用節點名，讀者點進來比較好認；「解決方案」不是正式名稱的一部分 | 同意 h1 用節點名。節點名加後綴只有約 17 字，title 用 `seoTitle`「AISO 主權 AI：軟硬體整合的地端 AI 一體機」，補上 `AI 一體機 企業 地端 交機即用`、`地端 AI 伺服器 企業 LLM` 的用詞，也不帶「解決方案」 | h1「AISO 主權 AI」；title 用 `seoTitle`，見「title 與 description 方向」 |
| 4 | 8 張方案卡片要不要照現站排成 8 張卡 | 不排卡片。部門方案 6 項排成第 2 段的表，Agent 治理與算力 2 項放第 6 段 | `design-principles.md` 不用等大卡片；表格一列一個方案，掃得到方案名稱與做的事 | 同意。表格的方案名稱是純文字，一列一個，讀者與搜尋引擎都讀得到；第 2 段的 h2 寫部門與方案，不寫「方案卡」 | 不排卡片 |
| 5 | 介面片段只有 2 張，不到「內頁共用的規則」的至少 4 張 | 不補 | 片段只能畫事實寫得出的設定項目。事實寫得出設定項目的只有第 4 段（權限、存取控管、稽核、Token）與第 6 段（Agent 納管、租戶隔離、用量上限、出帳）。第 2 段若改成介面片段（畫「法務 AI 合約審閱」的合約審閱、擬約、條款檢索）可以到 3 張，但 6 個方案擠在片段旁 2–4 則事實的位置讀起來比表差，所以維持規格表；第 3 段的交付方式、第 5 段的機型規格都不是介面 | 對搜尋沒有影響。若設計概念階段把第 2 段改成介面片段，6 個方案的名稱與說明仍要是 HTML 文字 | 暫定 2 張，交設計概念階段；若要把第 2 段改成介面片段，改這一列 |
| 6 | 教育與醫療的方案要不要放 | 照原文放在第 2 段的表裡 | `DM-11` 寫法：照原文列出，不寫成產業入口。h2 與說明句不點名教育、醫療產業 | 同意。`主權 AI 是什麼` 前幾名缺的「哪些產業需要」由第 4 段的產業原文回答；第 2 段的病歷整合、備課原文是企業層級做法的例子，放在表裡就夠 | 照原文放在第 2 段的表裡 |
| 7 | `主權 AI 是什麼` 要不要在本頁寫定義段 | 不寫 | 前幾名是定義文，從國家層級講；本頁只能回答企業層級的部分（第 4 段的資料不出門、適用產業），定義交給 blog（`search-intent.md`「對應到頁面」） | 同意不寫，理由同 `digirunner.md`「取捨」第 3 項。建議另寫一篇企業層級的文章承接定義（「建議新增」）：前幾名從國家層級講，企業層級是缺口 | 不寫定義段；文章只建議，另開 issue |
| 8 | 現站每張卡片連到 `aisoportal.com` 的「了解更多」要不要保留 | 不放 | 各方案的細節不在事實庫，連出站外後讀者離開本站，也離開聯絡業務的路徑。要不要在頁面某處放一個聯盟入口網站的連結，交 seo-strategist 決定 | 同意不放，頁面其他地方也不放。站外連結把商業型查詢的讀者帶離聯絡業務的路徑，對本頁的承接沒有幫助。想找聯盟入口網站的讀者，從第 3 段連到的新聞 559 就找得到（新聞 559、565、575 的內文都連到它） | 不放 |
| 9 | 和 `/orient-ai` 的關係要不要寫 | 不寫 | 新聞寫一體機以 OrientAI 為核心，事實庫的來源頁寫 SysTalk.ai，第 17 項確認前兩者的關係都不能寫。`/orient-ai` 的連結由 seo-strategist 依查詢分工決定 | 同意不寫，本頁也不連 `/orient-ai`：第 6 段的 Agent 納管連過去，讀者會讀成 AISO 用的是 OrientAI。查詢分工見第 11 項，不需要靠這個連結 | 不寫、不連；第 17 項確認後再決定 |
| 10 | 原則沒寫到的呈現方式 | 列出供設計概念階段確認 | 一、hero 圖是新圖，`design-principles.md` 只寫了 digiRunner 與金融頁的圖；二、第 5 段的規格表是兩個機型並排的兩欄，原則的規格表寫「項目一欄、原文一欄」；三、第 2 段的表把一則事實的原文拆成名稱與說明兩欄 | 第二點的 SEO 意見：第 5 段做成兩欄表時，表頭用機型名稱（`aiDAPTIV 4-GPU Server`、`aiDAPTIV 8-GPU Server`），列用 VRAM、特性、適用場景，`地端 AI 伺服器 企業 LLM` 的讀者掃得到規格。其他兩點沒有 SEO 意見 | 交設計概念階段 |
| 11 | `/aiso` 與 `/orient-ai` 的查詢分工（`search-intent.md` 待決條目） | 第 9 項：關係不寫，連結由 seo-strategist 決定 | 一體機的軟體核心未確認（第 17 項） | 依查詢的主題分，不依軟體核心。本頁主要承接硬體、軟硬體交付與地端部署的查詢：`AISO 主權 AI`、`企業主權 AI 地端部署 方案`、`地端 AI 伺服器 企業 LLM`、`AI 一體機 企業 地端 交機即用`、`昕力 群聯 AISO 聯盟`。`/orient-ai` 主要承接 Agent 平台、治理、Token 成本控管與 MCP；`AI Agent 地端部署 Token 成本` 主要給 `/orient-ai`（前幾名缺的部門層級用量監控在那頁），本頁第 4、6 段次要。title 也照這樣分：本頁不用「Agentic」「Agent」「Token」；建議 `orient-ai.md` 的 title 不用「一體機」。軟體核心確認後承接頁不變，只改本頁第 1、3 段要不要寫軟體名稱，以及要不要連 `/orient-ai` 或 `/products/systalk-ai` | 定案，分工如左 |
| 12 | AISO 聯盟的消息（成立、成員、簽約）由哪裡承接（`search-intent.md` 待決條目） | hero 證據點只用 `fact:aiso-alliance` 的標題原文；成員、日期、簽約不寫（「不能寫的句子」） | 那些內容只在新聞 559 的內文，不在事實庫 | 由 `/media-center/559` 承接：新站已有這篇新聞（`src/content/news/zh-TW/559.md`），不另開頁面或段落。本頁第 3 段連到新聞（「內部連結」，需要欄位）；`昕力 群聯 AISO 聯盟` 這組查詢仍由本頁主要承接，因為查的人要看的是方案本身 | 定案 |

## 待確認

事實庫沒有這些內容，頁面不補、不寫成更強的說法：

| # | 事項 | 卡在哪 | 影響的段落 |
|---|---|---|---|
| 1 | 一體機的軟體核心是 SysTalk.ai、OrientAI 或兩者 | `messaging.md`「缺少證據的主張」第 17 項。確認後才能決定 `fact:aiso-llm-support`、`fact:aiso-systalk-platform`、`fact:aiso-modules` 能不能用，以及 `/aiso` 與 `/products/systalk-ai` 誰承接 `/products/systalk-ai-phison` 的事實（第 5 段的機型規格若改由 `/products/systalk-ai` 承接，本頁跟著改） | 1、3、5 |
| 2 | AISO 聯盟的成員、成立日期與簽約客戶；「100% AI 主控權」；CIO 調查數字 | 第 18 項。成員與簽約只在新聞 559 的內文；`fact:aiso-100-percent-control` 是口號，`fact:aiso-cio-survey` 沒寫年份 | 1 |
| 3 | 群聯 aiDAPTIV 的效能比較數字 | 第 9 項。`fact:aiso-10x-dell-hpe`、`fact:aiso-52-to-2-seconds`、`fact:aiso-70b-on-4-gpus`、`fact:aiso-25x-response`、`fact:aiso-phison-patent`、`fact:aiso-finetune-benchmark` 都是合作夥伴的估算或點名競品的比較 | 5 |
| 4 | AISO 的具名導入案例與成果 | 事實庫沒有。新聞寫的簽約客戶不是導入成果。沒有案例前不設案例段 | — |
| 5 | 價格或報價方式 | 事實庫沒有。`企業 地端 LLM 建置 成本` 只能談成本結構（不限 Token、軟硬體一起買），不寫金額 | 4、5 |
| 6 | 2025 AI AWARD | 第 20 項：只在來源頁的 meta description，查不到獎項全名與頒發單位 | — |

## 後續

- en、vi 版另做，照 `content-migration` skill 的「多語系內容」，不在本 brief 範圍
