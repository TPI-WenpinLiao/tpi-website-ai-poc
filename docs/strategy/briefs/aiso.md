# Content brief：AISO 主權 AI `/aiso`（#199）

- 模板：`offering`（`kind: product`）；內容檔：`src/content/offering/zh-TW/aiso.md`
- 主張 id 指 `docs/strategy/messaging.md`；事實的寫法見 `content-strategy` skill「引用事實的寫法」，只用 `docs/strategy/facts.yaml` 裡 zh-TW、`status: confirmed` 的條目
- 狀態：#199 策略階段。content-strategist 初稿，seo-strategist 補了「搜尋意圖」「內部連結」「title 與 description 方向」與「取捨」的意見欄、最後決定，之後等 `strategy-approved`。使用者在 PR #204 回覆（2026-11-05）後，依「AISO 的軟體是 OrientAI」改了 hero、第 3 段、內部連結、取捨第 2、9 項與待確認。同一天使用者再決定 `/products/systalk-ai-phison` 講的不是 AISO，這頁的事實全部移到 `/products/systalk-ai`（取捨第 2 項），本 brief 依剩下的事實重排成 7 段；seo-strategist 複核了重排後的取捨第 1、11、13 項，並改了 title 的建議與連入錨點

## 這頁從哪裡推出來

現站 `/aiso` 只有 hero 兩句與 8 張方案卡片（`unmigrated.md`「AISO 主權 AI」），新站的內容檔照搬了這些。本 brief 不從 8 張卡片往外擴，改從決策者與 IT 主管評估地端 AI 時的問題往回推：我的部門能用它做什麼、裝的是什麼軟體、資料會不會出去、AI 用量管不管得住、要配什麼硬體。

事實的來源有三處：

| 來源 | 事實 | 在本頁 |
|---|---|---|
| `/aiso` 本頁 | `aiso-ecosystem` 與 8 張方案卡片的 8 筆，共 9 筆 | 全部使用 |
| 現站新聞 559 的標題，575、585 的內文 | `aiso-alliance`、`aiso-software-orientai`、`aiso-orientai-hardware`，共 3 筆 | 全部使用：hero 的證據點、第 3 段 |
| `/orient-ai`（AISO 的軟體核心 OrientAI 的產品頁） | 5 筆：`orientai-on-prem-data`、`orientai-privacy-industries`、`orientai-hardware-small`、`orientai-hardware-large`、`orientai-aidaptiv` | 第 3、5 段；採用的理由見「取捨」第 13 項 |

`/products/systalk-ai-phison`（SysTalk.ai 加群聯 aiDAPTIV 的方案，IA 上併入 `/products/systalk-ai`）的事實一筆都不用：使用者決定這頁講的不是 AISO，全部由 `/products/systalk-ai` 承接（取捨第 2 項）。

一體機的軟體核心是 OrientAI（`messaging.md`「缺少證據的主張」第 17 項已結算，使用者決定，#199）。新聞可以當事實來源（同一次決定），本頁照兩則新聞內文寫出 OrientAI，並連到 `/orient-ai`。

## 受眾與任務

依 `docs/research/audience-and-goals.md`「受眾分群」：

| 受眾 | 來這頁做什麼 | 這頁要讓他做到的事 |
|---|---|---|
| 決策者（CIO、CTO、高階主管），主要 | 了解地端 AI 能用在哪些部門、裝的是什麼軟體、資料與用量風險在哪裡被處理；決定要不要聯絡業務 | 第一屏讀到「OrientAI 軟體與地端硬體一起交付」；看到各部門現成的方案；看到 OrientAI 部署在企業端、AI Agent 與算力統一納管；找得到聯絡業務 |
| IT 主管、專案負責人，主要 | 確認軟體核心、要配什麼硬體、Agent 與算力怎麼管 | 第 3 段讀到軟體核心與部署位置並連到 `/orient-ai`；第 5 段照團隊人數讀到硬體配置與 aiDAPTIV 的作用；第 4 段讀到納管與分攤的機制。AISO 自己的機型規格（VRAM、可跑的模型級距）現站沒有原文，本頁不寫（「待確認」第 7 項） |

主要轉換：聯絡業務（內容檔 `cta: contact`）。本頁沒有試用與案例的事實，所以沒有次要轉換。

## 搜尋意圖

依 `docs/strategy/search-intent.md`「AISO 主權 AI `/aiso`」，加上首頁一節的「企業主權 AI 地端部署 方案」。沒有 Search Console 數據，取捨只依受眾與頁面主題，不依搜尋量。和 `/orient-ai` 的分工依查詢的主題（取捨第 11 項）：本頁承接 AISO 品牌與主權 AI 方案的查詢，`/orient-ai` 承接 Agent 平台、治理與 Token 成本控管的查詢。硬體規格與一體機的查詢，因為機型規格、硬體內建軟體與不限 Token 的事實都出自 `/products/systalk-ai-phison`，#199 使用者決定後改由 `/products/systalk-ai` 主要承接，本頁次要。

### 這頁承接的查詢

| 查詢 | 意圖類型 | 承接 | `search-intent.md` 的條目 |
|---|---|---|---|
| `AISO 主權 AI` | 導航型，前幾名全是聯盟新聞，實際滿足的是資訊需求 | 主要。節點名就是這組詞。前幾名缺的內建方案（第 2 段）、軟體核心與資料歸屬（第 3 段）、AI Agent 與算力的管理（第 4 段）、硬體配置（第 5 段）由本頁回答；聯盟本身的消息交給新聞頁（取捨第 12 項） | 「AISO 主權 AI」 |
| `企業主權 AI 地端部署 方案` | 資訊型與商業型 | 主要（首頁 brief 已指給本頁）。前幾名缺的平台內建方案（第 2 段）、部署在企業端與資料歸屬（第 3 段）、依團隊規模的硬體（第 5 段）。前幾名缺的機型規格與 Token 成本，事實出自併入頁，在 `/products/systalk-ai` | 「企業主權 AI 地端部署 方案」（首頁一節） |
| `昕力 群聯 AISO 聯盟` | 導航型與資訊型 | 主要；聯盟成立的消息由 `/media-center/559` 承接（取捨第 12 項）。第 5 段的 aiDAPTIV 原文（`fact:orientai-aidaptiv`）回答前幾名缺的「aiDAPTIV 實際做什麼」 | 「昕力 群聯 AISO 聯盟」 |
| `地端 AI 伺服器 企業 LLM` | 資訊型帶商業型 | 次要；主要 `/products/systalk-ai`（#199 使用者決定）。第 5 段的團隊規模與硬體配置、第 3 段的軟硬體組合回答一部分 | 「地端 AI 伺服器 企業 LLM」 |
| `AI 一體機 企業 地端 交機即用` | 商業型（找可買的一體機） | 次要；主要 `/products/systalk-ai`（#199 使用者決定），「為什麼需要一體機」由 `/blog/why-enterprises-need-ai-appliance` 回答（第 6 段）。本頁回答前幾名缺的內建應用清單（第 2 段）與硬體配置（第 5 段） | 「AI 一體機 企業 地端 交機即用」 |
| `OrientAI 昕力 群聯 Agentic AI` | 導航型與資訊型 | 次要；主要 `/orient-ai`。第 3 段寫 OrientAI 是 AISO 的軟體核心，第 5 段寫 OrientAI 結合 aiDAPTIV | 「OrientAI 昕力 群聯 Agentic AI」 |
| `主權 AI 是什麼` | 資訊型（定義） | 次要。本頁不寫定義（取捨第 7 項），第 3 段回答前幾名缺的企業層級（資料掌控權歸企業、哪些產業需要）；定義建議交文章（「建議新增」） | 「主權 AI 是什麼」 |
| `生成式 AI 私有化部署 金融業` | 資訊型 | 次要；主要 `/industries/finance`。第 3 段的部署位置與產業原文（點名金融）回答一部分 | 「生成式 AI 私有化部署 金融業」 |
| `AI Agent 地端部署 Token 成本` | 資訊型 | 次要；主要 `/orient-ai`。第 4 段的分層用量上限與自動出帳回答一部分；「不限 Token」的原文出自併入頁，在 `/products/systalk-ai` | 「AI Agent 地端部署 Token 成本」（OrientAI 一節） |

### 不由這頁承接的查詢

| 查詢 | 交給 | 理由 |
|---|---|---|
| `AI Agent 地端部署 Token 成本`（主要）、`AI Agent 治理 影子 AI 企業`、`企業級 Agentic AI 平台` | `/orient-ai` | Agent 平台的成本控管與治理是 OrientAI 的主題；前幾名缺的部門層級用量監控在那頁（取捨第 11 項） |
| `地端 AI 伺服器 企業 LLM`、`AI 一體機 企業 地端 交機即用`（主要）、`企業 地端 LLM 建置 成本`、`aiDAPTIV SysTalk.ai` | `/products/systalk-ai` | 前幾名缺的機型規格、硬體內建軟體、不限 Token 與導入服務，事實都出自 `/products/systalk-ai-phison`，#199 使用者決定由 `/products/systalk-ai` 承接（取捨第 2 項） |
| AISO 聯盟的成立、成員與簽約 | `/media-center/559` | 新聞的內容；新聞可以當事實來源，但事實庫只收了標題，成員與簽約還沒收（取捨第 12 項） |
| `主權 AI 是什麼`（主要） | 建議新增的 blog 文章 | 定義型，前幾名從國家層級講 |
| `企業 生成式 AI 平台 地端部署 RAG` | `/products/systalk-viki`，次要 `/products/systalk-ai` | RAG 與模組清單不在本頁（取捨第 2 項） |

## 這頁要讓讀者相信什麼

要把 AI 放在自己機房的企業，拿到的是昕力自研的 OrientAI 軟體與地端硬體組成的方案，由 AISO 聯盟的軟硬體廠商整合交付（`DM-10`）；法務、人資等部門有現成的方案，AI Agent 與算力也管得住（`DM-11`）；OrientAI 部署在企業端，資料掌控權歸企業（`DM-3`），硬體照團隊規模配（`IT-10`）。

## 段落結構

順序照決策者的判斷順序：能用在哪些部門、裝的是什麼軟體與資料留不留得住、用量管不管得住，再給 IT 主管硬體的配置。

「版型」欄照 `docs/strategy/design-principles.md`「內頁的版型」的 10 種，括號裡是 `src/content.config.ts` 的 `pageSection` 的 `layout` 值；索引列不是 `sections` 的 layout，寫出對應的欄位。「影像」欄照同一節「內頁共用的規則」：介面片段（`data-ui`、標「示意」）只畫事實寫得出的功能名稱、設定項目與狀態名稱，不畫筆數、時間與曲線。

| # | 段落 | 目的 | 依據（受眾任務／主張 id） | 搜尋子題 | 事實 | 預估長度 | 版型 | 影像 |
|---|---|---|---|---|---|---|---|---|
| 1 | Hero：AISO 是什麼、給誰 | h1 用節點名「AISO 主權 AI」（取捨第 3 項）。tagline 寫用途：OrientAI 軟體與地端硬體一起交付。說明句寫對象（要把 AI 放在自己機房的企業）與做的事（軟硬體廠商一起交付、各部門有現成方案）。三則證據點，其中一則照原文寫出 OrientAI 系列軟體與地端硬體（`DM-10` 寫法），一個動作「聯絡業務」 | 決策者任務「確認這是不是我要找的方案」；`DM-10`；主要轉換：聯絡業務 | `AISO 主權 AI`：這個聯盟與方案是什麼、搭載什麼軟體；`企業主權 AI 地端部署 方案`：部署形式 | `fact:aiso-ecosystem`、`fact:aiso-orientai-hardware`、`fact:aiso-alliance` | tagline 15–25 字；說明 40–60 字；證據點 3 則 | 第一屏（`tagline`、`heroLead`、`heroPoints`） | 同一個世界渲染的靜態圖（新圖，檔名與構圖由設計概念階段決定，比照 `page-digirunner.webp`）。HTML 標籤（`heroLabels`）只用事實寫得出的詞：硬體、地端 AI 平台（`fact:aiso-ecosystem`）、OrientAI（`fact:aiso-orientai-hardware`）。不載 3D |
| 2 | 各部門有現成的 AI 方案 | 說明句寫讀者得到什麼：法務、人資、教育、醫療與人才培育的工作，不必從空白平台開始。一列一個方案：方案名稱一欄，說明原文一欄。教育與醫療照原文列出，不寫成產業入口（`DM-11` 寫法） | 決策者任務「了解產品與方案」；`DM-11` | `AI 一體機 企業 地端 交機即用`：前幾名缺的內建應用清單（次要，主要在 `/products/systalk-ai`）；`AISO 主權 AI`、`企業主權 AI 地端部署 方案`：平台內建哪些方案；`主權 AI 是什麼`：企業層級怎麼做到（病歷整合、備課） | `fact:aiso-legal-contract`、`fact:aiso-hr-labor-law`、`fact:aiso-hr-employee-service`、`fact:aiso-teaching`、`fact:aiso-medical-records`、`fact:aiso-talent` | 說明句 30–50 字；表 6 列，照原文 | 規格表（`spec`），`fill: subtle` | 段落圖（緞帶世界，新圖，h2 旁的最後 4 欄，375 寬不顯示） |
| 3 | 軟體核心是 OrientAI，部署在企業端 | 說明句寫 AISO 搭載的軟體與資料留在哪裡：此系列方案以 OrientAI 為軟體核心；OrientAI 只部署於企業端，資料掌控權為企業所有；適用於對數據隱私要求高的產業。產業原文點名製造業，照原文引用，h2 與說明句只寫金融與政府（`DM-3` 寫法）。段落的 `link` 連到 `/orient-ai`，讓想看軟體細節的讀者過去 | 決策者任務「確認資料風險在哪裡被處理」；IT 主管任務「確認裝的是什麼軟體」；`DM-10`、`DM-3` | `AISO 主權 AI`：搭載什麼軟體；`企業主權 AI 地端部署 方案`：資料主權、部署形式；`主權 AI 是什麼`：企業層級的資料歸屬與哪些產業需要；`生成式 AI 私有化部署 金融業`（次要，主要在金融頁）；`OrientAI 昕力 群聯 Agentic AI`（次要，主要在 `/orient-ai`） | `fact:aiso-software-orientai`、`fact:orientai-on-prem-data`、`fact:orientai-privacy-industries` | 說明句 40–60 字；事實 3 則 | 主張與原文（`claim`），`link` 到 `orient-ai` | 無 |
| 4 | AI Agent 與算力管得住 | 不同來源的 AI Agent 統一納管，掌握企業內部的 AI 使用狀況；算力以租戶隔離、分層用量上限與自動出帳分攤或計費 | 決策者任務「確認風險在哪裡被處理」；IT 主管任務「確認上線後維運得動」；`DM-11`、`DM-3` | `AI Agent 地端部署 Token 成本`：用量上限（次要，主要在 `/orient-ai`）；`AI Agent 治理 影子 AI 企業`（次要，主要在 `/orient-ai`）；`AISO 主權 AI`：方案怎麼管 | `fact:aiso-agent-governance`、`fact:aiso-compute-control` | 說明句 30–50 字；事實 2 則 | 介面片段（`ui`） | 介面片段 1：算力與 Agent 的管理面板，項目是 AI Agent 統一納管、租戶隔離、分層用量上限、自動出帳（`fact:aiso-agent-governance`、`fact:aiso-compute-control`）。只畫項目名稱與開關狀態，不畫租戶名稱與用量數字 |
| 5 | 幾個人用，配什麼硬體 | 一列一種規模：1-5 人團隊的輕量運算配 AI PC 或 Workstation；5 人以上的跨部門應用配 Workstation 或 AI Server；一列寫 OrientAI 結合群聯 aiDAPTIV 的記憶體擴充，地端架構離線仍可運行。說明句寫這是 OrientAI 建議的硬體配置，不寫成 AISO 的機型規格（`IT-10` 寫法）；aiDAPTIV 只寫機制，不寫快幾倍 | IT 主管任務「確認要配什麼硬體」；`IT-10`、`DM-10` | `昕力 群聯 AISO 聯盟`：aiDAPTIV 實際做什麼；`地端 AI 伺服器 企業 LLM`、`AI 一體機 企業 地端 交機即用`：依規模的硬體（次要，主要在 `/products/systalk-ai`）；`AISO 主權 AI`：硬體 | `fact:orientai-hardware-small`、`fact:orientai-hardware-large`、`fact:orientai-aidaptiv` | 說明句 20–40 字；表 3 列（項目一欄、原文一欄） | 規格表（`spec`），`fill: subtle` | 可在 h2 旁放段落圖（新圖，或沿用 `/orient-ai` 第 7 段的圖，由設計概念階段決定；和第 2 段不相鄰，全頁 2 張） |
| 6 | 相關文章 | 給想先弄清楚「企業為什麼需要 AI 一體機」的讀者。模板依 `blog.relatedOfferings` 反查產生，不寫文案 | 決策者任務「了解產品與方案」的前置知識 | `AI 一體機 企業 地端 交機即用`：問「為什麼需要」的交給文章（`search-intent.md`「對應到頁面」） | 無（文章的事實由文章管） | 1 則 | 索引列（`relatedPosts` 反查） | 文章自己的封面縮圖 |
| 7 | 聯絡業務 | 頁尾的主要轉換，標題寫下一步（談部門需求與硬體配置） | 主要轉換：聯絡業務 | — | 無 | 標題 10–20 字；說明 30–50 字 | 色帶，深紫（模板的 `ContactCta`） | 無 |

第 2–5 段是事實段，共 4 段，各 6、3、2、3 則。介面片段 1 張（第 4 段），不到「至少 4 張」，見「取捨」第 5 項。相鄰兩段的版型都不同；規格表 2 次（第 2、5 段，不相鄰）、主張與原文 1 次、介面片段 1 次。

### 照原文列清單的段落

- 第 2 段：8 張卡片的原文是「方案名稱 說明」一串，表格的兩欄把名稱與說明分開，字不改
- 第 5 段：`fact:orientai-hardware-small`、`fact:orientai-hardware-large` 的原文是「規模 用途 首選或必備的設備」一串，表格的項目欄放規模（1-5人團隊、5人以上），原文欄放其餘的字，字不改；第 3 列項目欄寫「記憶體擴充」（表述），原文欄放 `fact:orientai-aidaptiv`。排法同 `/orient-ai` 第 7 段
- 第 3 段：`fact:orientai-on-prem-data` 的原文以 FAQ 的「不會。」開頭。`orient-ai.md`「schema 缺口」第 5 段已列在 `scripts/strategy/facts-source.yaml` 裁掉這兩個字，裁一次兩頁共用
- 說明句寫讀者得到什麼，不寫「以下列出」這類交代版面的句子（`content-strategy` skill「3. 頁面文案」）

### 不能寫的句子

| 段落 | 不能寫 | 為什麼 | 改寫的方向 |
|---|---|---|---|
| 全頁 | 「搭載 SysTalk.ai」、SysTalk.ai 的 15 個模組、「支援主流開源與企業級 LLM（如 70B 模型）」 | 出自 SysTalk.ai 加群聯 aiDAPTIV 的方案（`fact:aiso-systalk-platform`、`fact:aiso-modules`、`fact:aiso-llm-support`），不是 AISO（`messaging.md` `DM-10` 寫法） | 軟體寫 OrientAI，照 `fact:aiso-software-orientai`、`fact:aiso-orientai-hardware` 的原文 |
| 全頁 | 「硬體內建軟體，省去分開詢價」「軟硬一體消除相容性風險」「昕力提供導入規劃、模型設定、建置」「地端不限 Token 流量」「內建權限管理、存取控管與稽核紀錄」、aiDAPTIV 4-GPU 與 8-GPU Server 的 VRAM 與模型級距、「金融服務業 科技製造業 政府部門」的產業清單 | 都出自 `/products/systalk-ai-phison`（`fact:aiso-bundled`、`fact:aiso-hw-sw-integrated`、`fact:aiso-onboarding`、`fact:aiso-no-token-limit`、`fact:aiso-local-audit`、`fact:aiso-servers`、`fact:aiso-industries` 等），使用者決定這頁講的不是 AISO（取捨第 2 項）。表述也不寫成同義的說法（「不必分開採購」「昕力負責導入」「不限用量」） | 交付寫 `fact:aiso-alliance` 的「整合式交付」與 `fact:aiso-orientai-hardware` 的「結合…軟體與地端硬體」；資料寫 `fact:orientai-on-prem-data`；用量寫 `fact:aiso-compute-control`；硬體寫第 5 段的 OrientAI 硬體建議 |
| 5 | 「AISO 機型」「AISO 一體機的規格」 | 第 5 段的原文出自 OrientAI 頁的硬體建議，不是 AISO 的機型規格（`messaging.md` `IT-10` 寫法，「待確認」第 7 項） | 寫「OrientAI 建議的硬體配置」 |
| 1、3 | 「OrientAI 可以部署在雲端」「可以使用雲端 LLM API」 | OrientAI 部署在企業端；「雲端 LLM API」現站沒有原文（`messaging.md` `IT-1` 寫法、「缺少證據的主張」第 23 項） | 不寫部署以外的說法；OrientAI 的細節交給 `/orient-ai` |
| 3 | 製造業寫進 h2、說明句或產業入口 | `fact:orientai-privacy-industries` 的原文點名製造業，但定位不點名製造業（`messaging.md`「定位不說的事」、`DM-3` 寫法） | 原文照引；h2 與說明句只寫金融與政府 |
| 1 | 「100% AI 主控權」 | 口號，沒有量測依據，而且出自併入頁（「待確認」第 2 項） | 寫機制：OrientAI 部署在企業端、資料掌控權歸企業 |
| 1、3 | 聯盟的成員家數、成立日期、簽約客戶 | 在新聞 559 的內文，新聞可以當來源，但還沒收進事實庫（「待確認」第 2 項） | 只用 `fact:aiso-alliance` 的標題原文 |
| 5 | 「速度快 N 倍」「同級模型推論效能大幅提升」「比 Dell、HPE 能跑更大的模型」 | 群聯提供的估算與點名競品的比較；`fact:orientai-aidaptiv` 現站原文的後半句也沒收進事實庫（「待確認」第 3 項） | 只寫 `fact:orientai-aidaptiv` 的機制原文 |
| 全頁 | 表述用「落地」「生態系」 | `messaging.md`「統一用詞」與 `writing-style` 的 AI 高頻詞；`fact:aiso-ecosystem` 原文裡的這兩個詞照引 | 表述寫「導入」「軟硬體廠商」 |

### 與現有頁面的差異

對照現在的 `src/content/offering/zh-TW/aiso.md`：

| 現有 | 處理 | 理由 |
|---|---|---|
| title「AISO 主權 AI 解決方案」 | h1 改用節點名「AISO 主權 AI」 | 「解決方案」只用在正式名稱（`messaging.md`「本站不用的字」），節點名沒有這三個字；title 的寫法交 seo-strategist（取捨第 3 項） |
| tagline 照搬 `fact:aiso-ecosystem` 原文 | tagline 改寫成表述，原文移到 hero 證據點 | tagline 是表述，事實原文放證據點才看得出是事實（P2） |
| 8 個 `features`，每項標題加一句 | 6 項併成第 2 段的表；AI Agent 治理、算力管控 2 項移到第 4 段 | 前 6 項是部門的工作，後 2 項是 IT 的管理機制，回答不同的問題 |
| 只有 8 張卡片，沒有軟體核心、資料歸屬、硬體 | 新增第 3、5 段 | 事實取自新聞內文與 OrientAI 頁（取捨第 13 項），現站 `/aiso` 沒放；各回答一個受眾任務 |
| 內容檔沒有 `facts` 欄位 | 補 `facts: [...]` | 讓 `facts.mjs` 檢查這頁 |
| 現站每張卡片的「了解更多」連到 `aisoportal.com` | 不放 | 見「取捨」第 8 項 |

## CTA

| CTA | 文案方向 | 位置 | 連到 |
|---|---|---|---|
| 主要：聯絡業務 | 按鈕寫「聯絡業務」（全站同名，`messaging.md`「統一用詞」）；第 7 段的標題談部門需求與硬體配置 | 第 1 段 hero（實心按鈕）、第 7 段 | `/contact-us`（`contact`） |

沒有次要 CTA：本頁沒有試用、價格與案例的事實。hero 只放一個按鈕，頁內導覽（`InPageNav`）提供跳到方案與硬體的入口。

## 內部連結

路徑取 `docs/ia/nodes.csv`，新聞取 `news-article` 的 `/media-center/{id}`，blog 取 `page-map.csv` 的 `blog_slug`。父節點 `/services` 依 #138 不產生頁面，麵包屑在「服務總覽」不加連結，本頁的連入只能靠 header 與 footer 的「服務」選單和其他頁的內文。錨點文字寫目的地是什麼，不用「了解更多」。

### 連出

| 段落 | 連到 | 建議錨點文字 | 說明 |
|---|---|---|---|
| 1、7 | `/contact-us` | 聯絡業務 | 主要轉換，全站同名 |
| 3 | `/media-center/559` | AISO 主權 AI 產業聯盟成軍的新聞 | 第 3 段寫 AISO 的軟體組成，新聞 559 的標題是同一組方案的整合式交付（`fact:aiso-alliance`，hero 的證據點）；聯盟的成員與簽約讀者在新聞讀得到，本頁不寫（取捨第 12 項）。`sections[].link` 只接受節點，連到新聞要加欄位，形狀同 `greenswift.md`「schema 缺口」第 8 段 `caseNotes` 的 `news`（`ref('news')`）。不加欄位就不放這個連結，不影響其他段落 |
| 3 | `/orient-ai` | AISO 的軟體核心：OrientAI 企業級 Agentic AI 平台 | 第 3 段 `claim` 的 `link`（`pageSection` 已有欄位）。錨點帶 `/orient-ai` 的節點名（OrientAI 撞名，產品名跟類別詞並列），前面寫出兩者的關係，依據 `fact:aiso-software-orientai`。和 `/orient-ai` 第 7 段連過來的連結形成雙向（取捨第 9 項） |
| 6 | `/blog/why-enterprises-need-ai-appliance` | 文章標題（模板產生） | 在文章補 `relatedOfferings: [zh-TW/aiso]` 後由第 6 段列出（「schema 缺口」第 6 段）。文章談企業為何要用一體機守護知識主權，沒有點名產品，和本頁的「主權 AI」同題 |
| 4、5 | 不另連 `/orient-ai` | — | 第 3 段已連，一頁連一次就夠。第 4 段的 Agent 納管與算力管控原文出自 `/aiso` 本頁，沒寫 OrientAI，連過去會讓讀者以為這兩項是 OrientAI 頁寫的功能；第 5 段的硬體原文和 `/orient-ai` 第 7 段相同，連過去讀者看到的是同一張表 |
| 5 | 不連 `/products/systalk-ai` | — | 機型規格在那頁，但那是 SysTalk.ai 搭配群聯 aiDAPTIV 的方案；連過去會讓讀者以為 AISO 用那幾台機器（取捨第 2 項） |
| 2 | 不連 `aisoportal.com` | — | 取捨第 8 項 |

### 連入

| 從 | 建議錨點文字 | 狀態 |
|---|---|---|
| header 與 footer 的「服務」選單 | 節點名「AISO 主權 AI」 | 已有 |
| `/blog/enterprise-ai-adoption`（部署在企業端的段落） | 現在是「AISO 主權 AI 解決方案」 | 已有（#173）。建議改成節點名「AISO 主權 AI」：「解決方案」不是正式名稱（取捨第 3 項），連結文字跟 h1 一致。文章下次改版時改，不另開 issue |
| `/media-center/585` | 現在是網址文字「https://www.tpisoftware.com/aiso」 | 已有。新聞是照現站搬的原文，錨點不改 |
| `/orient-ai` 第 7 段段末 | 「以 OrientAI 為軟體核心的地端 AI 方案：AISO 主權 AI」 | `orient-ai.md` 已改（第 17 項結算後寫出關係，引用 `fact:aiso-software-orientai`）。和本頁第 3 段連到 `/orient-ai` 的連結形成雙向。錨點寫「方案」不寫「一體機」：一體機的查詢由 `/products/systalk-ai` 主要承接（取捨第 11 項），錨點不把這個詞送到本頁；「此系列方案」也是原文的用詞 |
| `/products/systalk-ai` | 不連 | `systalk-ai.md`「取捨」第 12 項 |
| 首頁 | 不連 | `home.md`「取捨」第 4 項：5 段版沒有服務卡片 |

### 建議新增

| 頁面 | 位置 | 理由 |
|---|---|---|
| 「主權 AI 是什麼」的 blog 文章（企業層級） | `/blog/{slug}`（新的 `blog-post`，分類建議 `blog-ai`） | 承接 `主權 AI 是什麼`：前幾名多從國家層級講，企業層級的做法（哪些產業需要、資料掌控權在誰手上、各部門怎麼用）沒有人寫。用已確認的 `fact:orientai-on-prem-data`、`fact:orientai-privacy-industries`、`fact:aiso-medical-records`、`fact:aiso-legal-contract` 等，不需要新事實；文末連到本頁，填 `relatedOfferings: [zh-TW/aiso]`，第 6 段會變成 2 則。另開 issue（取捨第 7 項） |

## title 與 description 方向

規則照 `seo-checklist`「每頁必備」：zh-TW title 約 20–32 個全形字（含後綴「｜TPIsoftware 昕力資訊」，後綴約佔 11 字），description 約 60–80 個全形字；半形英數約算半個全形字。

### title

- 現有 title「AISO 主權 AI 解決方案」；h1 改成節點名「AISO 主權 AI」（取捨第 3 項），加後綴只有約 17 字，低於下限。用 `seoTitle`
- 要涵蓋：「AISO 主權 AI」（`AISO 主權 AI`、`企業主權 AI 地端部署 方案` 的「主權 AI」）、「地端」、「軟硬體」與「整合交付」
- 傳達的主張：`DM-10`。依據是 `fact:aiso-alliance`（「主打整合式交付」）與 `fact:aiso-orientai-hardware`（「結合自研 OrientAI 系列軟體與地端硬體」），都是本頁留下的事實；不再用移到 `/products/systalk-ai` 的 `fact:aiso-bundled`、`fact:aiso-hw-sw-integrated`
- 不放：「一體機」「AI 伺服器」（依據移走，查詢也改由 `/products/systalk-ai` 主要承接，hub 的 title 用「地端一體機」，取捨第 2、11 項）；「OrientAI」（`/orient-ai` 的品牌詞，title 放了會分散 `OrientAI` 的承接，取捨第 13 項；OrientAI 寫在 description 與第 3 段）；「Agentic」「Agent 平台」「Token」（`/orient-ai` 的詞）；「解決方案」；「聯盟」（聯盟的消息交給新聞頁）；「100%」
- 示例（含後綴）：
  - `AISO 主權 AI：軟硬體整合交付的地端 AI｜TPIsoftware 昕力資訊`（約 29.5 字，建議用這個）
  - `AISO 主權 AI：以 OrientAI 為核心的地端 AI｜TPIsoftware 昕力資訊`（約 31.5 字。寫出軟體核心，但跟 `/orient-ai` 搶「OrientAI」，不建議）

### description

- 要涵蓋：軟體核心是 OrientAI、結合地端硬體交付、部門方案（法務、人資等）、AI Agent 與算力統一納管、資料掌控權歸企業
- 傳達的主張：`DM-10`、`DM-11`、`DM-3`
- 依據的事實：`fact:aiso-software-orientai`、`fact:aiso-orientai-hardware`、`fact:aiso-legal-contract`、`fact:aiso-hr-labor-law`、`fact:aiso-agent-governance`、`fact:aiso-compute-control`、`fact:orientai-on-prem-data`
- 不寫：SysTalk.ai；併入頁的說法（不限 Token、硬體內建軟體、昕力負責導入、權限與稽核紀錄、機型規格）；OrientAI 部署在雲端或使用雲端 LLM API；效能倍數；「100% AI 主控權」；聯盟成員與簽約；價格；表述不用「落地」「生態系」。現行 description 照搬 `fact:aiso-ecosystem` 原文，有這兩個詞，也沒寫軟體與方案，要重寫
- 示例：
  - `AISO 主權 AI 以昕力自研的 OrientAI 為軟體核心，結合地端硬體交付；法務、人資等部門有現成的 AI 方案，AI Agent 與算力統一納管，資料掌控權留在企業。`
  - `要把 AI 放在自己機房的企業，AISO 主權 AI 提供 OrientAI 軟體與地端硬體的組合，OrientAI 部署在企業端；法務、人資、醫療與教學各有現成方案。`

## schema 缺口

offering schema（`src/content.config.ts`）已有 `heroLead`、`heroPoints`、`heroLabels`、`sections`（`spec`、`claim`、`ui` 都有）、`relatedPosts`。本頁的段落都放得下。

| 段落 | 缺什麼 | 處理 | 型別 |
|---|---|---|---|
| 全頁 | 內容檔沒有 `facts` 欄位 | 補 `facts`（共用欄位已有），照段落表的 17 則 | — |
| 3 | 連到新聞 559 要 `ref('news')` 的欄位 | 見「內部連結」連出第 3 段；不加欄位就不放這個連結 | `ref('news')`，形狀同 `greenswift.md`「schema 缺口」第 8 段 |
| 3 | `fact:orientai-on-prem-data` 以「不會。」開頭 | 不是 schema 缺口：照 `orient-ai.md`「schema 缺口」第 5 段裁 `text` | — |
| 6 | 相關文章由 `blog.relatedOfferings` 反查，`/blog/why-enterprises-need-ai-appliance` 沒填 | 不是 schema 缺口：在文章的內容檔補 `relatedOfferings: [zh-TW/aiso]` | — |
| 1 | hero 的靜態圖還沒有 | 不是 schema 缺口：設計概念階段產生新圖，`heroImage` 指過去 | — |

## 取捨

第 1–10 項是 content-strategist 寫的，第 11–12 項是 seo-strategist 加的（`search-intent.md`「待 seo-strategist 決定的事」跟這頁有關的條目），第 13 項是 #199 使用者決定移走併入頁的事實後 content-strategist 加的。seo-strategist 填了意見欄後定案；第 2、9 項依使用者在 PR #204 的回覆（2026-11-05）結算，第 5、10 項交設計概念階段。第 1、11、13 項在重排後改過，seo-strategist 已複核。

| # | 可能的衝突 | content-strategist 的立場 | 理由 | seo-strategist 的意見 | 最後決定 |
|---|---|---|---|---|---|
| 1 | 段數 | 4 個事實段，加 hero、相關文章、聯絡色帶共 7 段 | #199 使用者決定移走 `/products/systalk-ai-phison` 的事實後（第 2 項），本頁可用的 confirmed 事實 17 則：`/aiso` 9 則、新聞 3 則（559 的標題、575 與 585 的內文）、OrientAI 頁 5 則（第 13 項）。hero 用 3 則，其餘 14 則分 4 段，每段至少 2 則：部門方案 6 則、軟體核心與部署 3 則、Agent 與算力 2 則、硬體 3 則。原本的「交付與導入」「資料與用量」兩段靠併入頁的事實撐，移走後剩下的新聞內文併進第 3 段，`fact:aiso-orientai-hardware` 改放 hero。沒有案例、試用、價格的事實，所以不設案例段與試用段，不照 digiRunner 的 12 段 | 複核後同意 7 段。本頁主要承接的 3 組（`AISO 主權 AI`、`企業主權 AI 地端部署 方案`、`昕力 群聯 AISO 聯盟`）前幾名缺的子題都還在：內建方案（第 2 段）、搭載什麼軟體與資料歸屬（第 3 段）、Agent 與算力怎麼管（第 4 段）、aiDAPTIV 的作用與依規模的硬體（第 5 段）。移走的機型規格、不限 Token、導入服務對應的查詢已改由 `/products/systalk-ai` 主要承接（第 11 項），本頁不必為它們留段；沒有案例與價格的事實，也不為 SEO 加段 | 7 段（#199 使用者決定後重排，seo-strategist 複核同意） |
| 2 | `/products/systalk-ai-phison` 的事實能不能用 | 一筆都不用 | 使用者決定（#199，PR #204，2026-11-05）：這頁是 SysTalk.ai 搭配群聯 aiDAPTIV 的一體機方案，IA 上併入 `/products/systalk-ai`，講的不是 AISO。這頁的事實全部移到 `/products/systalk-ai`，`/aiso` 不再引用。原本用的 9 筆（`fact:aiso-bundled`、`fact:aiso-hw-sw-integrated`、`fact:aiso-onboarding`、`fact:aiso-local-audit`、`fact:aiso-no-token-limit`、`fact:aiso-industries`、`fact:aiso-servers`、`fact:aiso-use-cases`、`fact:aiso-memory-optimization`）與先前已排除的 3 筆（`fact:aiso-llm-support`、`fact:aiso-systalk-platform`、`fact:aiso-modules`）都在內。影響：本頁不再寫「昕力負責導入」（`DM-4` 不用在本頁）、機型規格、不限 Token 與權限稽核；硬體與一體機的查詢改由 `/products/systalk-ai` 主要承接（第 11 項） | 初稿時同意不用點名 SysTalk.ai 的 3 筆，理由是模組清單已在 `/products/systalk-ai` 第 5 段，兩頁不重複，也就不搶 `企業 生成式 AI 平台 地端部署 RAG`。前幾名缺的「內建的應用清單」由第 2 段的 6 個方案回答，這點不變 | 全部不用，移到 `/products/systalk-ai`（使用者決定，#199） |
| 3 | h1 與 title 用節點名「AISO 主權 AI」還是現有的「AISO 主權 AI 解決方案」 | h1 用節點名 | 選單、footer 用節點名，讀者點進來比較好認；「解決方案」不是正式名稱的一部分 | 同意 h1 用節點名。節點名加後綴只有約 17 字，title 用 `seoTitle`，也不帶「解決方案」 | h1「AISO 主權 AI」；title 用 `seoTitle`，見「title 與 description 方向」（第 2 項之後不放「一體機」） |
| 4 | 8 張方案卡片要不要照現站排成 8 張卡 | 不排卡片。部門方案 6 項排成第 2 段的表，Agent 治理與算力 2 項放第 4 段 | `design-principles.md` 不用等大卡片；表格一列一個方案，掃得到方案名稱與做的事 | 同意。表格的方案名稱是純文字，一列一個，讀者與搜尋引擎都讀得到；第 2 段的 h2 寫部門與方案，不寫「方案卡」 | 不排卡片 |
| 5 | 介面片段只有 1 張，不到「內頁共用的規則」的至少 4 張 | 不補 | 片段只能畫事實寫得出的設定項目。剩下的事實裡寫得出設定項目的只有第 4 段（Agent 納管、租戶隔離、用量上限、出帳）。原本第 4 段的權限與稽核面板用的是 `fact:aiso-local-audit`，隨第 2 項移走。第 2 段若改成介面片段（畫「法務 AI 合約審閱」的合約審閱、擬約、條款檢索）可以到 2 張，但 6 個方案擠在片段旁 2–4 則事實的位置讀起來比表差，所以維持規格表；第 3 段是軟體與部署的說法，第 5 段是硬體配置，都不是介面，畫成選規模的介面要靠假的選單 | 對搜尋沒有影響。若設計概念階段把第 2 段改成介面片段，6 個方案的名稱與說明仍要是 HTML 文字 | 暫定 1 張，交設計概念階段；若要把第 2 段改成介面片段，改這一列 |
| 6 | 教育與醫療的方案要不要放 | 照原文放在第 2 段的表裡 | `DM-11` 寫法：照原文列出，不寫成產業入口。h2 與說明句不點名教育、醫療產業 | 同意。`主權 AI 是什麼` 前幾名缺的「哪些產業需要」由第 3 段的產業原文回答；第 2 段的病歷整合、備課原文是企業層級做法的例子，放在表裡就夠 | 照原文放在第 2 段的表裡 |
| 7 | `主權 AI 是什麼` 要不要在本頁寫定義段 | 不寫 | 前幾名是定義文，從國家層級講；本頁只能回答企業層級的部分（第 3 段的資料掌控權與適用產業），定義交給 blog（`search-intent.md`「對應到頁面」） | 同意不寫，理由同 `digirunner.md`「取捨」第 3 項。建議另寫一篇企業層級的文章承接定義（「建議新增」）：前幾名從國家層級講，企業層級是缺口 | 不寫定義段；文章只建議，另開 issue |
| 8 | 現站每張卡片連到 `aisoportal.com` 的「了解更多」要不要保留 | 不放 | 各方案的細節不在事實庫，連出站外後讀者離開本站，也離開聯絡業務的路徑。要不要在頁面某處放一個聯盟入口網站的連結，交 seo-strategist 決定 | 同意不放，頁面其他地方也不放。站外連結把商業型查詢的讀者帶離聯絡業務的路徑，對本頁的承接沒有幫助。想找聯盟入口網站的讀者，從第 3 段連到的新聞 559 就找得到（新聞 559、565、575 的內文都連到它） | 不放 |
| 9 | 和 `/orient-ai` 的關係要不要寫 | 寫：hero 的證據點引用 `fact:aiso-orientai-hardware`，第 3 段引用 `fact:aiso-software-orientai` 並以 `link` 連到 `/orient-ai`（#199 第 17 項結算後改；第 2 項之後兩筆新聞內文對調位置，hero 用寫出軟硬體的那筆） | 使用者確認 AISO 一體機的軟體是 OrientAI，新聞內文的兩則已是 confirmed。讀者評估方案時要知道裝的是什麼軟體，軟體細節在 `/orient-ai`，本頁不重寫 | 初稿時同意不寫、不連（軟體核心未確認）。結算後連結放在第 3 段，不放第 4 段：第 4 段的原文出自 `/aiso` 本頁，沒寫 OrientAI。查詢分工照第 11 項，不因這個連結改變 | 寫、雙向連結（第 3 段連 `/orient-ai`，`/orient-ai` 第 7 段連回本頁）；使用者決定，#199 |
| 10 | 原則沒寫到的呈現方式 | 列出供設計概念階段確認 | 一、hero 圖是新圖，`design-principles.md` 只寫了 digiRunner 與金融頁的圖；二、第 2 段的表把一則事實的原文拆成名稱與說明兩欄；三、第 5 段的表和 `/orient-ai` 第 7 段同一組原文，段落圖沿用還是新做 | 原本的第二點（兩個機型並排的兩欄表）隨第 2 項移到 `/products/systalk-ai`，意見一併移過去。其他兩點沒有 SEO 意見 | 交設計概念階段 |
| 11 | `/aiso` 與 `/orient-ai` 的查詢分工（`search-intent.md` 待決條目） | 第 9 項：關係不寫，連結由 seo-strategist 決定 | 一體機的軟體核心未確認（第 17 項） | 依查詢的主題分，不依軟體核心。本頁主要承接硬體、軟硬體交付與地端部署的查詢：`AISO 主權 AI`、`企業主權 AI 地端部署 方案`、`地端 AI 伺服器 企業 LLM`、`AI 一體機 企業 地端 交機即用`、`昕力 群聯 AISO 聯盟`。`/orient-ai` 主要承接 Agent 平台、治理、Token 成本控管與 MCP；`AI Agent 地端部署 Token 成本` 主要給 `/orient-ai`（前幾名缺的部門層級用量監控在那頁），本頁第 4 段次要。title 也照這樣分：本頁不用「Agentic」「Agent」「Token」；建議 `orient-ai.md` 的 title 不用「一體機」。軟體核心確認後承接頁不變，只改本頁第 1、3 段要不要寫軟體名稱，以及要不要連 `/orient-ai` 或 `/products/systalk-ai` | 定案，分工如左。第 17 項結算後（OrientAI）：第 1、3 段寫出 OrientAI，第 3 段連 `/orient-ai`（第 9 項），不連 `/products/systalk-ai`。第 2 項之後（#199 使用者決定）：`地端 AI 伺服器 企業 LLM`、`AI 一體機 企業 地端 交機即用` 前幾名缺的機型規格、硬體內建軟體與導入服務都出自併入頁，改由 `/products/systalk-ai` 主要承接，本頁次要（第 5 段的硬體配置、第 2 段的方案）；`企業 地端 LLM 建置 成本` 的次要承接也改給 `/products/systalk-ai`。本頁主要承接 `AISO 主權 AI`、`企業主權 AI 地端部署 方案`、`昕力 群聯 AISO 聯盟`；和 `/orient-ai` 的分工與 title 的用詞不變。seo-strategist 複核同意，補三點：一、硬體與一體機的查詢跟著事實走，本頁沒有機型規格，主要承接接不住，改給 `/products/systalk-ai` 是對的；本頁的分工改寫成「AISO 品牌與主權 AI 方案」，不再是「硬體與交付」。二、本頁 title、h2 不用「一體機」「AI 伺服器」，`/products/systalk-ai` 的 title 加「地端一體機」（`systalk-ai.md`「取捨」第 13 項），三頁各用自己的詞：本頁「主權 AI」、hub「一體機」、`/orient-ai`「Agentic AI 平台」。三、`/orient-ai` 第 7 段連過來的錨點改成「以 OrientAI 為軟體核心的地端 AI 方案：AISO 主權 AI」，不帶「一體機」，免得把一體機的錨點訊號送到次要承接頁（「內部連結」連入表） |
| 12 | AISO 聯盟的消息（成立、成員、簽約）由哪裡承接（`search-intent.md` 待決條目） | hero 證據點只用 `fact:aiso-alliance` 的標題原文；成員、日期、簽約不寫（「不能寫的句子」） | 那些內容只在新聞 559 的內文，不在事實庫 | 由 `/media-center/559` 承接：新站已有這篇新聞（`src/content/news/zh-TW/559.md`），不另開頁面或段落。本頁第 3 段連到新聞（「內部連結」，需要欄位）；`昕力 群聯 AISO 聯盟` 這組查詢仍由本頁主要承接，因為查的人要看的是方案本身 | 定案 |
| 13 | 用不用 OrientAI 頁的事實（`fact:orientai-on-prem-data`、`fact:orientai-privacy-industries`、`fact:orientai-hardware-small`、`fact:orientai-hardware-large`、`fact:orientai-aidaptiv`） | 用這 5 筆，放第 3、5 段 | 使用者允許採用其他頁面原文確實講 OrientAI 的事實（#199）。AISO 以 OrientAI 為軟體核心（`fact:aiso-software-orientai`），這 5 筆原文都直接講 OrientAI 本身的部署、適用產業、硬體與 aiDAPTIV，用在本頁時寫成 OrientAI 的說法，不寫成 AISO 的機型或規格（`messaging.md` `IT-10` 寫法）。沒用的 OrientAI 事實：治理、Token、任務流程是 `/orient-ai` 的主題（第 11 項），本頁第 4 段已有 `/aiso` 自己的 Agent 納管與算力管控。代價：第 3 段的兩筆與 `/orient-ai` 第 5 段相同，第 5 段的三筆與 `/orient-ai` 第 7 段相同。兩頁的 h2 與說明句寫各自的問題（本頁是「AISO 裝什麼、資料在哪、配什麼硬體」），原文相同但上下文不同；不用這 5 筆，本頁的事實段只剩第 2、4 段，回答不了 IT 主管「裝什麼軟體、配什麼硬體」 | 複核後同意採用。重複的原文是短句（第 3 段 2 則、第 5 段 3 則），兩頁其他段落與 h2 都不同，不構成整頁重複。會不會分散承接：一、`OrientAI`：本頁 title 不放「OrientAI」（「title 與 description 方向」），第 3 段的 `link` 用「OrientAI 企業級 Agentic AI 平台」的節點名連到 `/orient-ai`，告訴搜尋引擎 OrientAI 的主要頁在哪；本頁只寫 OrientAI 是 AISO 的軟體核心，不寫它的功能。二、`地端 AI 伺服器 企業 LLM`：第 5 段的 h2 寫團隊規模（「幾個人用，配什麼硬體」），不用「AI 伺服器」「機型」，原文裡的「AI Server」照引即可；主要承接在 `/products/systalk-ai` 第 6 段的機型規格。三、第 5 段不再連 `/orient-ai`（第 3 段已連，「內部連結」）。不用這 5 筆，本頁回答不了「搭載什麼軟體、資料在哪、配什麼硬體」，`AISO 主權 AI` 前幾名缺的子題就少一半 | 採用 5 筆（#199 使用者決定後加，seo-strategist 複核同意）；第 5 段 h2 不用「AI 伺服器」「機型」，title 不放「OrientAI」 |

## 待確認

事實庫沒有這些內容，頁面不補、不寫成更強的說法：

| # | 事項 | 卡在哪 | 影響的段落 |
|---|---|---|---|
| 1 | 一體機的軟體核心是 SysTalk.ai、OrientAI 或兩者（已結算） | 已結算（使用者決定，#199）：軟體是 OrientAI，依據 `fact:aiso-software-orientai`、`fact:aiso-orientai-hardware`（`messaging.md`「缺少證據的主張」第 17 項）。同一天使用者再決定 `/products/systalk-ai-phison` 整頁都不是 AISO，那頁的事實全部移到 `/products/systalk-ai`（取捨第 2 項） | 1、3 |
| 2 | AISO 聯盟的成員、成立日期與簽約客戶 | 第 18 項。新聞可以當事實來源（使用者決定，#199），但成員與簽約還沒從新聞 559 的內文收進事實庫，收了才能寫。「100% AI 主控權」與 CIO 調查數字出自併入頁（`fact:aiso-100-percent-control`、`fact:aiso-cio-survey`），隨取捨第 2 項移到 `/products/systalk-ai` 的待確認 | 1 |
| 3 | 群聯 aiDAPTIV 的效能比較數字 | 第 9 項。`fact:aiso-10x-dell-hpe`、`fact:aiso-52-to-2-seconds`、`fact:aiso-70b-on-4-gpus`、`fact:aiso-25x-response`、`fact:aiso-phison-patent`、`fact:aiso-finetune-benchmark` 出自併入頁，隨取捨第 2 項移到 `/products/systalk-ai` 的待確認。本頁的 aiDAPTIV 只用 `fact:orientai-aidaptiv` 的機制原文 | 5 |
| 4 | AISO 的具名導入案例與成果 | 事實庫沒有。新聞寫的簽約客戶不是導入成果。沒有案例前不設案例段 | — |
| 5 | 價格或報價方式 | 事實庫沒有。`企業 地端 LLM 建置 成本` 改由 `/products/systalk-ai` 次要承接（取捨第 11 項），本頁不談成本 | — |
| 6 | AISO 自己的導入服務（誰負責導入規劃、建置） | 原本用 `fact:aiso-onboarding`，出自併入頁，隨取捨第 2 項移走。現站 `/aiso` 與已收的新聞內文都沒寫 AISO 由誰導入，本頁不寫「昕力負責導入」。要先收：寫出 AISO 導入服務的現站原文 | 3、7 |
| 7 | AISO 自己的機型規格（VRAM、可跑的模型級距、知識庫規模）與交付方式（硬體是否預裝軟體） | 原本用 `fact:aiso-servers`、`fact:aiso-use-cases`、`fact:aiso-bundled`，出自併入頁，隨取捨第 2 項移走。第 5 段改用 OrientAI 頁的硬體建議，寫成 OrientAI 的配置，不是 AISO 的機型。新聞的「AISO 系列 AI 筆電與一體機」「AISO 1」機型（`search-intent.md`「AI 一體機 企業 地端 交機即用」）不在事實庫。要先收：新聞 575、585 或現站其他頁寫出 AISO 機型與交付方式的原文，改 `scripts/strategy/facts-source.yaml` 後重跑 `extract-facts.mjs` | 1、5 |

## 後續

- en、vi 版另做，照 `content-migration` skill 的「多語系內容」，不在本 brief 範圍