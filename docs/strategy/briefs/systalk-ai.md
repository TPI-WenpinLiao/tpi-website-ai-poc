# Content brief：SysTalk.ai 產品家族頁 `/products/systalk-ai`（#199）

- 模板：`hub`（產品家族 hub）；內容檔：`src/content/hub/zh-TW/family-ai.md`；節點 `family-ai`，parent `products`
- 主張 id 指 `docs/strategy/messaging.md`；事實的寫法見 `content-strategy` skill「引用事實的寫法」，只用 `docs/strategy/facts.yaml` 裡 zh-TW、`status: confirmed` 的條目
- 版型與 `layout` 值照 `docs/strategy/design-principles.md`「內頁的版型」與 `src/content.config.ts` 的 `pageSection`
- 狀態：#199 策略階段。content-strategist 初稿，seo-strategist 補了「搜尋意圖」「內部連結」「title 與 description 方向」與「取捨」的意見欄、最後決定，之後等 `strategy-approved`。使用者在 PR #204 回覆（2026-11-05）決定 `/products/systalk-ai-phison` 講的不是 AISO，這頁的事實全部由本頁承接、`/aiso` 不再引用；本 brief 因此新增第 6 段（地端一體機），改成 8 段，搜尋意圖、內部連結、description、取捨第 1、3、7、12 項與待確認第 5 項跟著改。seo-strategist 複核了取捨第 1、3、7 項，並依新的承接改了 title（加「地端一體機」，取捨第 13 項）與 description

## 這頁的事實從哪裡來

hub 的事實段只放這頁自己的事實，子頁的事實不搬上來，子頁用索引列連過去（#199 使用者指定）。「這頁自己」指 `family-ai` 的兩個來源頁：

| 來源頁 | zh-TW confirmed 事實 | 用了幾則 |
|---|--:|--:|
| `https://www.tpisoftware.com/products/systalk-ai` | 11 | 9 |
| `https://www.tpisoftware.com/products/systalk-ai-phison`（SysTalk.ai 搭配群聯 aiDAPTIV 的一體機方案，併入本頁，`docs/research/content-audit.md` 第 79 行） | 12 | 11 |

併入頁的事實全部由本頁承接，`/aiso` 不引用（使用者決定，#199，PR #204）。沒用的 3 則與理由見「取捨」第 3 項。hero 另放一則出自關於我們頁的獎項，使用者決定採用（#199），見「取捨」第 4 項。

子節點（`docs/ia/nodes.csv`）：SysTalk.Chat、SysTalk.VIKI、SysTalk.Coach、SysTalk.Audit、SysTalk.ICR、SysTalk.RPA、AI 智能理賠解決方案、AI 智慧建檔解決方案、SysTalk.Detect（備註「待確認：不在導覽，是否仍銷售」）、OrientAI。第 2 段的對應表連到其中 5 個，其餘由第 7 段的索引列列出。

## 受眾與任務

依 `docs/research/audience-and-goals.md`「受眾分群」：

| 受眾 | 來這頁做什麼 | 這頁要讓他做到的事 |
|---|---|---|
| 決策者（金融、政府的 CIO、CTO、部門主管），主要 | 了解 SysTalk.ai 家族能處理哪些部門的 AI 工作；確認資料與權限的風險怎麼處理；確認誰負責導入；決定要不要聯絡業務 | 第 2 段一列一個工作找到對應的產品並連過去；第 3 段讀到資料不上公有雲與權限稽核；第 4 段讀到導入前、中、後三階段；找得到聯絡業務 |
| IT 主管、專案負責人，次要 | 確認部署方式、模型能不能選、平台有哪些模組；要買地端一體機時，確認機型與跑得動的模型 | hero 讀到雲地端；第 5 段讀到平台模組與支援的 LLM；第 6 段讀到一體機的機型規格（VRAM、知識庫規模、LLM 級距、適用場景）與導入服務 |

主要轉換：聯絡業務（`heroCta: contact`）。

## 搜尋意圖

依 `docs/strategy/search-intent.md`「SysTalk.ai 產品家族 `/products/systalk-ai`」，加上首頁一節的「台灣 AI 解決方案 公司」「企業主權 AI 地端部署 方案」。沒有 Search Console 數據，取捨只依受眾與頁面主題，不依搜尋量。hub 承接品牌詞與「還沒決定要哪一個產品」的查詢；單一產品的類別詞由子頁主要承接，這頁用第 2 段的對應表連過去。

### 這頁承接的查詢

| 查詢 | 意圖類型 | 承接 | `search-intent.md` 的條目 |
|---|---|---|---|
| `SysTalk.ai` | 導航型。英文名跟 SysAgent、AI SmartTalk 等相近名稱的產品混在一起 | 主要。前幾名缺的 Chat 以外的產品由第 2 段、雲端與地端部署由第 1 段、導入流程由第 4 段回答。title、h1 都照官方寫法「SysTalk.ai」，不拆字 | 「SysTalk.ai」 |
| `SysTalk 昕力 AI 產品` | 資訊型（昕力的 AI 產品有哪些） | 主要。前幾名的新聞一次只講一兩個產品，缺各產品分工的一頁整理，第 2 段的對應表就是 | 「SysTalk 昕力 AI 產品」 |
| `台灣 AI 解決方案 公司` | 商業型 | 次要，沒有主要承接頁（首頁也是次要，`home.md`「取捨」第 14 項）。第 2 段讓找廠商的人一頁看到能處理哪些部門的工作 | 「台灣 AI 解決方案 公司」（首頁一節） |
| `AI 智能客服 推薦 台灣 企業` | 比較型 | 次要；主要 `/products/systalk-chat`（取捨第 11 項）。第 2 段客服列連過去 | 「AI 智能客服 推薦 台灣 企業」 |
| `AI 語音質檢 客服中心` | 資訊型偏商業型 | 次要；主要 `/products/systalk-audit`。第 2 段質檢列連過去 | 「AI 語音質檢 客服中心」 |
| `AI 業務培訓 對練 保險` | 資訊型偏商業型 | 次要；主要 `/products/systalk-coach`。第 2 段培訓列連過去 | 「AI 業務培訓 對練 保險」 |
| `企業 生成式 AI 平台 地端部署 RAG` | 資訊型偏商業型 | 次要；主要 `/products/systalk-viki`。第 3 段（資料不上公有雲、不限 Token、權限控管）與第 5 段（RAG、Rerank 模組、可選的 LLM）回答前幾名缺的台灣廠商地端方案、不限 Token 與權限控管 | 「企業 生成式 AI 平台 地端部署 RAG」 |
| `企業主權 AI 地端部署 方案` | 資訊型與商業型 | 次要；主要 `/aiso`。第 3 段的地端方案回答資料主權的子題，第 6 段回答前幾名缺的硬體規格 | 「企業主權 AI 地端部署 方案」（首頁一節） |
| `aiDAPTIV SysTalk.ai` | 導航型 | 主要（#199 brief 定案）。前幾名缺的「SysTalk.ai 搭配 aiDAPTIV 的一體機」本身：規格與 aiDAPTIV 的作用（第 6 段）、支援的模型與內建模組（第 5 段） | 「aiDAPTIV SysTalk.ai」 |
| `地端 AI 伺服器 企業 LLM` | 資訊型帶商業型 | 主要（#199 使用者決定，原本給 `/aiso`）。前幾名缺的規格與模型大小對照、軟硬體一起交付（第 6 段），不限 Token（第 3 段） | 「地端 AI 伺服器 企業 LLM」 |
| `AI 一體機 企業 地端 交機即用` | 商業型（找可買的一體機） | 主要（#199 使用者決定，原本給 `/aiso`）；「為什麼需要一體機」由 `/blog/why-enterprises-need-ai-appliance` 回答，`/aiso` 次要。前幾名缺的機型規格與知識庫規模、導入時廠商做的工作（第 6 段），內建的模組清單（第 5 段） | 「AI 一體機 企業 地端 交機即用」 |
| `企業 地端 LLM 建置 成本` | 資訊型（評估成本），帶比較型 | 次要，沒有主要承接頁（#199 使用者決定，原本次要給 `/aiso`）。沒有價格事實，只用第 6 段（硬體內建軟體、省去分開詢價）與第 3 段（不限 Token）回答前幾名缺的成本結構，不寫金額 | 「企業 地端 LLM 建置 成本」 |
| `AI Agent 地端部署 Token 成本` | 資訊型 | 次要；主要 `/orient-ai`。第 3 段的不限 Token 回答一部分（#199 使用者決定後從 `/aiso` 移過來的事實） | 「AI Agent 地端部署 Token 成本」（OrientAI 一節） |

### 不由這頁承接的查詢

| 查詢 | 交給 | 理由 |
|---|---|---|
| `AI 智能客服 推薦 台灣 企業`、`AI 語音質檢 客服中心`、`AI 業務培訓 對練 保險`、`企業 生成式 AI 平台 地端部署 RAG`（主要） | 各子頁 | hub 不搬子頁的事實；子頁的節點名就含這些類別詞 |
| `AI 客服機器人 怎麼選` | 次要 `/products/systalk-chat`，沒有主要承接頁，不另寫文章 | 選購指南的前幾名已有繁中文章，產品比較的事實沒有；SysTalk.Chat 頁改版時寫前幾名缺的「導入後維護 AI 大腦」（`fact:systalk-chat-brain-tools`）就能次要承接（取捨第 11 項） |
| `企業 AI 導入` | `/blog/enterprise-ai-adoption` | 資訊型，#173 已寫文章；本頁第 4 段是文章結語連過來的目的地 |
| `AISO 主權 AI`、`昕力 群聯 AISO 聯盟`、`企業主權 AI 地端部署 方案`（主要） | `/aiso` | AISO 的軟體是 OrientAI，本頁第 6 段的一體機是 SysTalk.ai 搭配群聯 aiDAPTIV 的另一個方案（取捨第 12 項） |

## 這頁要讓讀者相信什麼

客服、員工培訓、質檢、知識整理與文件辨識，在 SysTalk.ai 家族裡各有產品（`DM-9`）；導入前、中、後由昕力負責（`DM-4`）。地端方案的資料不上公有雲，權限與稽核內建（`DM-3`），模型依場景選（`IT-8`），雲端與地端都能部署（`IT-1`）。要買地端一體機的企業，硬體內建軟體、由昕力導入（`DM-10`），機型照知識庫規模與模型級距挑（`IT-10`）。

## 段落結構

順序照決策者的判斷：家族有什麼、資料安不安全、誰導入，最後是給 IT 主管的平台細節、地端一體機的機型與子頁入口。

「影像」欄照 `design-principles.md`「內頁共用的規則」。介面片段（`data-ui`、標「示意」）只畫事實寫得出的功能名稱、設定項目與狀態名稱。

| # | 段落 | 目的 | 依據（受眾任務／主張 id） | 搜尋子題 | 事實 | 預估長度 | 版型（`layout`） | 影像 |
|---|---|---|---|---|---|---|---|---|
| 1 | Hero：SysTalk.ai 處理哪些 AI 工作 | h1 見「取捨」第 5 項。上方不放小標，上層「產品」由麵包屑表示。tagline 寫家族處理的工作類別（客服、培訓、知識、文件），說明句寫對象（金融與政府的部門）與部署方式。證據點兩則：雲地端方案、SysTalk.ai 的獎項（寫年份）。主要動作「聯絡業務」實心按鈕 | 決策者任務「確認這是不是我要找的產品家族」；`DM-9`、`IT-1`、`DM-8`；主要轉換 | `SysTalk.ai`：品牌導航，英文名跟相近名稱的產品混在一起；`SysTalk 昕力 AI 產品`：昕力的 AI 產品有哪些；`台灣 AI 解決方案 公司`（次要） | `fact:systalk-ai-service`、`fact:award-taiwan-excellence-2024`（後者使用者決定採用，見「取捨」第 4 項） | tagline 20–35 字；說明 30–50 字；證據點 2 則 | 第一屏（不屬於 10 種版型，照「內頁共用的規則」的第一屏） | 同一個世界渲染的靜態圖，要新做 `page-systalk-ai.webp`（`scripts/design/ribbon-capture.mjs`），取代現有的 `family-ai.webp`。HTML 標籤用第 2 段事實的用詞：客服機器人、語音質檢、會議紀錄、理賠資料自動建檔（`ai0`–`ai2`、`service`），SysTalk.ai（`product`）。不載 3D |
| 2 | 每個部門的 AI 工作，各有一個產品 | 一列一個工作：工作名稱（表述，例如「客服中心」「員工培訓與考核」「客服質檢」「產品知識與會議紀錄」「單據辨識與建檔」）在左，對應產品的原文在中，連到子頁在右。原文出自現站這頁的「一日應用情境」，每則寫出產品名與它處理的工作；「智能理賠專利」「兩腦一流程專利」照原文，不改寫成「多項專利」（`DM-9` 寫法） | 決策者任務「了解產品與方案」；`DM-9` | `SysTalk.ai`：前幾名沒有家族裡 Chat 以外的產品；`SysTalk 昕力 AI 產品`：各產品分工的一頁整理（前幾名沒有）；`AI 智能客服 推薦 台灣 企業`、`AI 語音質檢 客服中心`、`AI 業務培訓 對練 保險`（次要，主要在子頁） | 客服 `fact:systalk-ai-chat-patent`；培訓 `fact:systalk-ai-day-coach`；質檢 `fact:systalk-ai-day-audit`；知識與會議 `fact:systalk-ai-day-scenarios`；單據辨識 `fact:systalk-ai-claim-patent` | 引言 30–50 字；5 列，每列照原文 | 對應表（`spec`，每列帶 `link` 到子頁），`fill: subtle` | 無（對應表不放圖，同金融頁第 2 段） |
| 3 | 資料與權限留在企業內 | 地端 AI 不限 Token 流量；軟硬一體，私密資料不上公有雲；內建權限管理、存取控管與稽核紀錄。說明句寫的是地端方案（第 6 段的一體機），不寫成 SysTalk.ai 每一種部署都在地端（hero 的證據點寫的是雲地端都有） | 決策者任務「確認風險在哪裡被處理掉」；`DM-3`；稽核紀錄也支撐 IT 主管「維運得動」（`IT-5`） | `企業 生成式 AI 平台 地端部署 RAG`：地端的理由是資料不離開企業、不限 Token、權限控管（前幾名缺台灣廠商的地端方案，次要，主要在 `/products/systalk-viki`）；`企業主權 AI 地端部署 方案`（次要，主要在 `/aiso`）；`地端 AI 伺服器 企業 LLM`、`企業 地端 LLM 建置 成本`：不限 Token；`AI Agent 地端部署 Token 成本`（次要，主要在 `/orient-ai`） | `fact:aiso-no-token-limit`、`fact:aiso-hw-sw-integrated`、`fact:aiso-local-audit` | 說明 40–60 字；事實 3 則 | 介面片段（`ui`） | 介面片段 1：權限與稽核的設定面板，列是權限管理、存取控管、稽核紀錄（`on`），用詞取自 `fact:aiso-local-audit`。不畫使用者名單與操作筆數 |
| 4 | 導入前、中、後都由昕力負責 | 三階段各一列：導入前的情境分析、方案搭配建議、效益評估；導入中的模型評估、選擇與 fine-tune；導入後的 AI 大腦健檢、回答品質與準確率檢測、Prompt 健檢。動作「聯絡業務」 | 決策者任務「決定要不要聯絡業務」；`DM-4` | `SysTalk.ai`：前幾名沒有導入流程；`企業 AI 導入`（主要是 `/blog/enterprise-ai-adoption`，這段是文章連過來的目的地） | `fact:systalk-ai-onboarding`、`fact:systalk-ai-onboarding-finetune`、`fact:systalk-ai-after-onboarding` | 主張一句 15–25 字；三階段照原文 | 色帶（`band`，淺紫，`fill: brand`），`link` 到 `contact` | 介面片段 2：導入後的健檢面板，列是 AI 大腦健檢優化、回答品質與準確率檢測、Prompt 健檢、問題診斷報告（用詞取自 `fact:systalk-ai-after-onboarding`）。有片段，不另放段落圖 |
| 5 | 平台的模組與可選的模型 | SysTalk.ai 企業級 AI 應用平台以功能模組依產業搭配；15 個模組照原文排成兩欄短詞清單；支援主流開源與企業級 LLM，依場景選模型 | IT 主管任務「確認模型能不能選、平台有哪些功能」；`IT-8` | `企業 生成式 AI 平台 地端部署 RAG`：RAG 的組成（生成模型、embedding、reranker）；`AI 客服機器人 怎麼選`：技術面向（次要，主要在 `/products/systalk-chat`） | `fact:aiso-systalk-platform`、`fact:aiso-modules`、`fact:aiso-llm-support` | 說明 40–60 字；模組清單 15 項；LLM 一則 | 介面片段（`ui`，`flip: true`，和第 3 段左右對調） | 介面片段 3：LLM 與模組的設定面板，列是 LLM 設置模組、RAG 模組、Rerank 模組、Guardrail 模組、Prompt 管理模組（取自 `fact:aiso-modules`），只畫名稱。375 寬只留片段的主要一塊，完整清單排成兩欄 |
| 6 | 地端一體機：硬體內建軟體，機型照知識庫規模挑 | 說明句寫 SysTalk.ai 搭配群聯 aiDAPTIV 的地端一體機：硬體內建軟體，省去分開詢價、規格對接與人工導入；昕力提供導入規劃、模型設定、建置與應用模組設計。下面一張表，兩個機型並排：品名、VRAM、特性（知識庫規模與 LLM 級距）、適用場景（單一部門與 PoC，或跨部門 AI 中台）；表下一行寫 aiDAPTIV 以記憶體管理與資料調度，在相同 GPU 條件下支援更大的模型規模，只寫機制，不寫快幾倍（`IT-10` 寫法）。不寫成 AISO 或 OrientAI 的機型（「不能寫的句子」） | IT 主管任務「確認要買哪一台、跑得動多大的模型」；決策者任務「確認要找幾家廠商」；`IT-10`、`DM-10`、`DM-4` | `地端 AI 伺服器 企業 LLM`：前幾名缺的規格與模型大小對照、軟硬體一起交付；`AI 一體機 企業 地端 交機即用`：各機型的規格與知識庫規模、導入時廠商做的工作；`aiDAPTIV SysTalk.ai`：一體機的規格與 aiDAPTIV 的作用；`企業 地端 LLM 建置 成本`：軟硬體分開採購的時間成本 | `fact:aiso-bundled`、`fact:aiso-onboarding`、`fact:aiso-servers`、`fact:aiso-use-cases`、`fact:aiso-memory-optimization` | 說明 40–60 字；事實 2 則；表 4 列（品名、VRAM、特性、適用場景），加一行技術說明 | 規格表（`spec`），`fill: subtle` | 表格的兩欄是兩個機型，沒有段落圖（表本身已佔滿 12 欄） |
| 7 | 其他產品與解決方案 | 子頁索引列：第 2 段沒連到的子節點（SysTalk.RPA、AI 智能理賠解決方案、AI 智慧建檔解決方案、OrientAI，SysTalk.Detect 見「待確認」）。一列一項，名稱、一句（模板讀各 offering 的 `description`）、連結；理賠與建檔兩項讓讀者找到 AI 用在核心作業的成果 | 決策者任務「了解產品與方案」；`DM-2`（理賠、建檔兩個子頁） | `SysTalk 昕力 AI 產品`：各產品的入口 | 無（子頁的事實由子頁管） | 4–5 列 | 索引列（模板的子頁卡片，排除段落已連到的節點） | 無 |
| 8 | 聯絡業務 | 頁尾的主要轉換，標題寫談部門的 AI 需求 | 主要轉換：聯絡業務 | — | 無 | 沿用模板的 `ContactCta` | 色帶（深紫） | 無 |

第 2–6 段是事實段，共 5 段。相鄰兩段的版型都不同；規格表 2 次（第 2、6 段，不相鄰）、介面片段 2 次（`ui`）加色帶裡 1 張，共 3 張，見「取捨」第 2 項。

### 照原文列清單的段落

- 第 6 段：`fact:aiso-servers`、`fact:aiso-use-cases` 的原文是攤平的表格。製作階段照 `.claude/skills/site-research/SKILL.md` 第 2 條在 `scripts/strategy/facts-source.yaml` 把 `text` 拆成每行一格，重跑 `node scripts/strategy/extract-facts.mjs`，再排成兩欄的表（原本寫在 `aiso.md`，#199 使用者決定後移過來）

### 不能寫的句子

| 段落 | 不能寫 | 為什麼 |
|---|---|---|
| 1 | 「已服務超過 1.4 億用戶」 | 沒寫統計時間，未確認（「待確認」第 1 項） |
| 1 | 「企業級 AI Agent 應用平台」當 h1 或家族的定義 | 現有 title 的說法，事實庫沒有這句；事實庫的原文是「SysTalk.ai 企業級 AI 應用平台」（`fact:aiso-systalk-platform`），只在第 5 段照原文引用 |
| 3 | 「100% AI 主控權」 | 口號式的 100%，未確認（「待確認」第 2 項） |
| 3、5、6 | 搭配群聯 aiDAPTIV 的效能比較（快幾倍、能跑多大的模型、和其他品牌比） | 合作夥伴提供的估算，未確認（「待確認」第 3 項） |
| 2 | 「多項專利」「擁有多項 AI 專利」 | 原文是功能層級的「智能理賠專利」「兩腦一流程專利」，照原文引用（`DM-9` 寫法） |
| 3、6 | 「AISO 一體機」「搭載 OrientAI」「AISO 主權 AI 的機型」 | 第 3、6 段是 SysTalk.ai 搭配群聯 aiDAPTIV 的方案，不是 AISO；AISO 的軟體是 OrientAI（使用者決定，#199） |
| 6 | 「2025 AI AWARD 得獎」 | 只在併入頁的 meta description，未收進事實庫（「待確認」第 4 項） |

### 與現有頁面的差異

對照現有的 `src/content/hub/zh-TW/family-ai.md`：

| 現有 | 處理 | 理由 |
|---|---|---|
| title「SysTalk.ai 企業級 AI Agent 應用平台」 | h1 改寫（「取捨」第 5 項）；`<title>` 交 seo-strategist | 「AI Agent 應用平台」不是事實庫的說法，家族也不是單一平台 |
| tagline「企業級 AI Agent 應用平台 從整合到應用，全面升級企業服務」 | 改寫成家族處理的工作類別 | 「全面升級」是形容，沒說家族做什麼 |
| description（現站 meta description，含「全方位」） | 交 seo-strategist | 「全方位」是本站不用的字 |
| highlights 3 項（取自併入頁的三項好處） | 第 1、3 項的原文移到第 3 段；第 2 項（硬體內建軟體）移到第 6 段 | 第 2 項回答軟硬體分開採購的問題，和機型規格一起放在一體機的段落（`DM-10`，#199 使用者決定後由本頁承接） |
| hub 模板依 `nodes.csv` 產生的 10 張子頁卡片 | 5 個子頁移進第 2 段的對應表，其餘改成第 7 段的索引列 | 卡片格是 `design-principles.md` 不用的版型；對應表先說每個工作用哪個產品，子頁入口才有上下文 |
| 現站沒搬的一日應用情境、雲地端方案、導入前中後（`unmigrated.md`） | 放回第 1、2、4 段 | 各對應一個受眾任務 |
| 併入頁沒搬的模組清單、LLM 支援（`unmigrated.md`） | 放進第 5 段 | 回答 IT 主管「平台有哪些功能、模型能不能選」 |
| 併入頁的方案表（aiDAPTIV 4-GPU、8-GPU Server）、導入服務、aiDAPTIV 的機制 | 放進第 6 段 | 回答 IT 主管「要買哪一台」；#199 使用者決定併入頁的事實由本頁承接 |
| 併入頁的 FAQ、產業清單 | 不放 | 見「取捨」第 3 項 |
| 現站頁尾的報價信箱 | 不放 | 見「取捨」第 6 項 |

## CTA

| CTA | 文案方向 | 位置 | 連到 |
|---|---|---|---|
| 主要：聯絡業務 | 按鈕寫「聯絡業務」（全站同名）；第 8 段的標題談部門的 AI 需求 | 第 1 段 hero（實心按鈕）、第 4 段色帶的動作、第 8 段 | `/contact-us`（`contact`） |
| 次要：看子頁 | 第 2 段每列的連結錨點寫目標產品做什麼，不只寫產品名（錨點由 seo-strategist 定） | 第 2 段右欄、第 7 段索引列 | 各子節點的 `path` |

## 內部連結

路徑取 `docs/ia/nodes.csv`，只列會產生頁面的節點。錨點文字寫目的地是什麼，不用「了解更多」。子頁的錨點用節點名：每個節點名都寫出產品做什麼（「AI 智能客服」「AI 語音質檢」「AI 業務培訓」），也是各子頁主要承接的查詢用詞。麵包屑沿 `parent` 連到 `/products`，模板產生，不必另寫。

### 連出

| 段落 | 連到 | 建議錨點文字 | 說明 |
|---|---|---|---|
| 1、4、8 | `/contact-us` | 聯絡業務 | 主要轉換，全站同名；第 4 段是色帶的動作 |
| 2（客服列） | `/products/systalk-chat` | SysTalk.Chat AI 智能客服 | `rows[].link` 的 `label` 用節點名。客服類查詢的主要承接頁（取捨第 11 項） |
| 2（培訓列） | `/products/systalk-coach` | SysTalk.Coach AI 業務培訓 | 節點名。`AI 業務培訓 對練 保險` 的主要承接頁 |
| 2（質檢列） | `/products/systalk-audit` | SysTalk.Audit AI 語音質檢 | 節點名。`AI 語音質檢 客服中心` 的主要承接頁 |
| 2（知識與會議列） | `/products/systalk-viki` | SysTalk.VIKI 企業生成式 AI 應用平台 | 節點名。`企業 生成式 AI 平台 地端部署 RAG` 的主要承接頁 |
| 2（單據辨識列） | `/products/systalk-icr` | SysTalk.ICR AI 智慧光學字元辨識 | 節點名。原文 `fact:systalk-ai-claim-patent` 出自家族頁 SysTalk.ICR 那一列 |
| 7 | `/products/systalk-rpa`、`/solutions/smartclaim`、`/solutions/smartfilling`、`/orient-ai` | 節點名 | 索引列，模板排除第 2 段已連的 5 個節點（「schema 缺口」第 1 列）。SysTalk.Detect（`/solutions/textualanalysis`）仍產生頁面時也會列出（「待確認」第 6 項） |
| 3、6 | 不連 `/aiso` | — | 取捨第 12 項：AISO 的軟體是 OrientAI（第 17 項已結算，#199），第 3、6 段是 SysTalk.ai 搭配 aiDAPTIV 的地端方案，不是 AISO，不連 |

### 連入

| 從 | 建議錨點文字 | 狀態 |
|---|---|---|
| header「產品」選單的欄標題、footer「產品」 | 節點名「AI（SysTalk.ai）」 | 已有 |
| `/products` 的子頁卡片 | 節點名 | 已有 |
| 10 個子節點的麵包屑 | 節點名 | 已有（模板產生） |
| `/blog/enterprise-ai-adoption` 結語 | SysTalk.ai 的 AI 導入服務與產品 | 已有（#173），錨點寫出目的地有導入服務與產品，不必改 |
| 首頁 | — | 5 段版不連家族頁（`home.md`「內部連結」），不改 |

### 建議新增

無。`AI 客服機器人 怎麼選` 不另寫文章（「不由這頁承接的查詢」）；`/whitepaper/systalk-ai` 依 #138 不產生頁面，不當連結目標。

## title 與 description 方向

規則照 `seo-checklist`「每頁必備」：zh-TW title 約 20–32 個全形字（含後綴「｜TPIsoftware 昕力資訊」，後綴約佔 11 字），description 約 60–80 個全形字；半形英數約算半個全形字。

### title

- 節點名「AI（SysTalk.ai）」是選單的欄標題，不適合當 title；h1 改成「SysTalk.ai 產品家族」（取捨第 5 項），加後綴約 20.5 字。用 `seoTitle` 加上「企業 AI」與「地端一體機」：`SysTalk 昕力 AI 產品` 的「AI」「產品」，以及 #199 使用者決定後由本頁主要承接的 `AI 一體機 企業 地端 交機即用`、`地端 AI 伺服器 企業 LLM` 的「地端」「一體機」都在 title 裡（取捨第 7、13 項）
- 要涵蓋：「SysTalk.ai」照官方寫法（撞名）、「AI」、「產品」、「地端一體機」
- 傳達的主張：`DM-9`、`DM-10`。「一體機」的依據是 `fact:aiso-bundled`（硬體內建軟體），出自併入本頁的 `/products/systalk-ai-phison`
- 不放：子頁的類別詞（「智能客服」「語音質檢」「業務培訓」「生成式 AI 平台」）：子頁的 title 已有，hub 放了會跟子頁搶同一組詞，分法同 digiRunner 頁與金融頁（`digirunner.md`「取捨」第 5 項）。一體機不是子頁，沒有搶詞的問題。也不放「AISO」「OrientAI」「主權 AI」（`/aiso`、`/orient-ai` 的詞，本頁的一體機是 SysTalk.ai 搭配群聯 aiDAPTIV 的方案）、「企業級 AI Agent 應用平台」（不在事實庫）、「解決方案」「全方位」、效能倍數
- 示例（含後綴）：
  - `SysTalk.ai 企業 AI 產品家族與地端一體機｜TPIsoftware 昕力資訊`（約 30.5 字，建議用這個）
  - `SysTalk.ai 企業 AI 產品家族｜TPIsoftware 昕力資訊`（約 24.5 字，不放一體機；一體機的查詢只靠 description 與第 6 段的 h2，主要承接偏弱）

### description

- 要涵蓋：家族處理的工作（客服、員工培訓、語音質檢、知識整理、文件辨識）、地端一體機（硬體內建軟體、機型依知識庫規模），有餘裕時帶地端方案的資料與權限、導入。title 已有「地端一體機」，description 要說出一體機是什麼，不能只在 title 出現
- 傳達的主張：`DM-9`、`DM-10`、`IT-10`，有餘裕時帶 `DM-3`、`DM-4`
- 依據的事實：`fact:systalk-ai-chat-patent`、`fact:systalk-ai-day-coach`、`fact:systalk-ai-day-audit`、`fact:systalk-ai-day-scenarios`、`fact:systalk-ai-claim-patent`、`fact:aiso-bundled`、`fact:aiso-servers`、`fact:aiso-onboarding`；第二個示例另依 `fact:aiso-hw-sw-integrated`、`fact:aiso-local-audit`
- 寫地端時寫明是地端方案或一體機，不寫成每一種部署都在地端（取捨第 8 項）。不寫累計用戶數（「待確認」第 1 項）、「100% AI 主控權」、2025 AI AWARD、效能倍數、VRAM 數字（放不下條件，留給第 6 段的表）、AISO 或 OrientAI、「全方位」「協助企業數位轉型」（現行 description 有，要重寫）
- 示例：
  - `SysTalk.ai 是昕力資訊的 AI 產品家族，客服、培訓、質檢、知識與文件辨識各有產品；地端一體機硬體內建軟體，機型依知識庫規模挑選，導入由昕力負責。`（建議用這個）
  - `客服、員工培訓、語音質檢、知識整理與文件辨識，SysTalk.ai 各有產品；地端一體機硬體內建軟體，私密資料不上公有雲，權限與稽核內建，導入由昕力資訊負責。`

## schema 缺口

hub schema（`src/content.config.ts`）已有 `heroLead`、`heroPoints`、`heroLabels`、`heroCta`、`sections`（`pageSection`）、`featuredPosts`。

| 段落 | 缺什麼 | 新增的欄位或要改的地方 | 型別 |
|---|---|---|---|
| 2、7 | 第 2 段用 `spec` 的 `rows[].link` 連到 5 個子頁；`HubTemplate` 排除「段落已連到的節點」時，要把 `rows[].link` 也算進去，否則這 5 個子頁會在第 7 段的索引列重複出現 | 不加欄位；主 session 確認模板算已連節點的範圍包含 `rows[].link` | — |
| 6 | `fact:aiso-servers`、`fact:aiso-use-cases` 的 `text` 是一串，放不進表格的格子 | 不是 schema 缺口 | 照「照原文列清單的段落」拆 `text` |
| 5 | `fact:aiso-modules` 的原文是 15 個模組名接成一行，排成清單讀不通 | 不是 schema 缺口 | 照 `.claude/skills/site-research/SKILL.md` 第 2 條在 `scripts/strategy/facts-source.yaml` 把 `text` 拆成每行一項，重跑 `node scripts/strategy/extract-facts.mjs`。`fact:systalk-ai-after-onboarding` 的 4 項同樣拆行（第 4 段片段與清單用） |
| — | 內容檔沒有 `facts` | `facts`（共用欄位已有） | 照段落表列出的 21 則補上 |
| — | `highlights` 由 `sections` 取代 | 不加欄位 | 內容檔改寫時刪 `highlights` |

## 取捨

第 1–10 項是 content-strategist 寫的，第 11–13 項是 seo-strategist 加的（`search-intent.md`「待 seo-strategist 決定的事」跟這頁有關的條目）。兩方意見相同的項目，最後決定照 content-strategist 的立場；第 4 項由使用者決定採用（#199，PR #204 的回覆）；第 11–13 項由 seo-strategist 定案。

| # | 項目 | content-strategist 的立場 | 理由 | seo-strategist 的意見 | 最後決定 |
|---|---|---|---|---|---|
| 1 | 段數 | 8 段：hero、5 個事實段、子頁索引列、聯絡色帶 | 這頁自己的 zh-TW confirmed 事實有 23 則（現站家族頁 11 則、併入頁 12 則），用了 20 則；hero 另放 1 則關於我們頁的獎項，共引用 21 則。hero 放 2 則；其餘 19 則分成 5 段：工作與產品的對應 5 則、資料與權限 3 則、導入三階段 3 則、平台與模型 3 則、地端一體機 5 則，每段至少 2 則。第 6 段是 #199 使用者決定併入頁的事實全部由本頁承接後加的：原本留給 `/aiso` 的 5 則（`fact:aiso-bundled`、`fact:aiso-onboarding`、`fact:aiso-servers`、`fact:aiso-use-cases`、`fact:aiso-memory-optimization`）回答同一個問題「地端一體機長什麼樣、要買哪一台」，併成一段；導入服務沒有放進第 4 段，因為第 4 段是淺紫色帶，照「內頁的版型」最多放 1–2 則，已經放了 3 則。子頁的事實（各產品頁的功能與案例）不搬上來，由第 2 段的連結與第 7 段的索引列連過去 | 原意見（7 段時）：同意。兩組品牌詞前幾名缺的子題（Chat 以外的產品、雲地端、導入流程、各產品分工）都在第 1、2、4 段；子頁的類別詞由子頁承接，hub 不必為它們加段。複核第 6 段：同意加。`地端 AI 伺服器 企業 LLM`、`AI 一體機 企業 地端 交機即用`、`aiDAPTIV SysTalk.ai` 改由本頁主要承接，前幾名缺的機型規格與模型級距、軟硬體一起交付、導入時廠商做的工作都只在這一段，沒有這段就接不住。這段是一個產品的細節放在家族頁，所以 h2 要自己說得出主題（現在的「地端一體機：硬體內建軟體，機型照知識庫規模挑」可以），並加 `id`（例如 `appliance`）讓 `InPageNav` 列出，讀者與搜尋結果的頁內連結都找得到。表頭用機型名稱（`aiDAPTIV 4-GPU Server`、`aiDAPTIV 8-GPU Server`），原本在 `aiso.md` 取捨第 10 項的意見移到這裡 | 8 段（#199 使用者決定後加第 6 段，seo-strategist 複核同意）；第 6 段加 `id` |
| 2 | 介面片段只有 3 張，不到「內頁共用的規則」的 4 張 | 3 張（第 3 段、第 4 段色帶、第 5 段） | 第 2 段是對應表，照版型表不放圖。第 4 張要嘛畫子頁產品的介面（那是子頁的事實），要嘛把對應表改成介面片段，兩種都不符合這頁的範圍 | 對搜尋沒有影響。第 2 段維持表格：產品名與連結是純文字，比畫在片段裡更容易被讀到 | 採納，3 張 |
| 3 | 這頁自己的事實沒用的 3 則 | 不用 | `fact:systalk-ai-products`：原文把 SysTalk.Coach 與 SysTalk.ICR 接在同一句，`fact:systalk-ai-day-coach` 與 `fact:systalk-ai-claim-patent` 已涵蓋兩列的主要內容，同一列不重複。`fact:systalk-ai-quote-email`：見第 6 項。`fact:aiso-industries`：產業清單含製造業（`messaging.md`「定位不說的事」），也沒有主張需要它。初稿另有 5 則不用（`fact:aiso-bundled`、`fact:aiso-onboarding`、`fact:aiso-servers`、`fact:aiso-use-cases`、`fact:aiso-memory-optimization`），理由是留給 `/aiso` 的 `DM-10`、`IT-10`；#199 使用者決定併入頁講的不是 AISO 後，這 5 則放進第 6 段 | 初稿意見（不用 8 則時）：不用的事實對應的查詢（`地端 AI 伺服器 企業 LLM`、`AI 一體機 企業 地端 交機即用`）主要由 `/aiso` 承接，這頁放了會跟 `/aiso` 搶同一組詞。#199 使用者決定後這兩組改由本頁主要承接（`search-intent.md`「對應到頁面」），不再有搶詞的問題。複核：同意只剩 3 則不用。`fact:aiso-industries` 不用沒有損失：`企業主權 AI 地端部署 方案`、`主權 AI 是什麼` 要的「哪些產業需要」由 `/aiso` 第 3 段的 OrientAI 產業原文回答，本頁不必再寫一次 | 採納，不用 3 則（#199 使用者決定後從 8 則改成 3 則，seo-strategist 複核同意） |
| 4 | hero 的獎項 `fact:award-taiwan-excellence-2024` 出自關於我們頁，不是這頁的來源頁 | 放 hero 的證據點（使用者已確認，見最後決定） | 使用者的規則管的是事實段，hero 不算事實段；這則點名的是 SysTalk.ai 家族本身，不是某個子頁的產品，搬上來不會把子頁的事實帶到家族頁。`DM-8` 寫法也把 2023、2024 台灣精品獎與創新商務獎指給這頁，但 2023 與 2022 的兩則點名的是 SysTalk.Chat（子頁的產品），照使用者的規則不放。使用者不同意時，hero 只留 `fact:systalk-ai-service` 一則 | 從 SEO 看放了比較好：`SysTalk.ai` 前幾名的第一筆就是台灣精品獎的頁面，從那裡點進來的讀者第一屏就對得上。但這則算不算「這頁自己的事實」是使用者規則的解讀，SEO 不能代為決定；不放也不影響兩組品牌詞的承接 | 使用者決定採用（#199，PR #204 的回覆）：不是本頁來源頁的獎項可以放，hero 放 `fact:award-taiwan-excellence-2024`，寫年份 |
| 5 | h1 用什麼 | 「SysTalk.ai 產品家族」（`title` 跟著改），`<title>` 由 seo-strategist 用 `seoTitle` 處理 | 節點名「AI（SysTalk.ai）」是選單用的欄標題；現有 title 的「企業級 AI Agent 應用平台」不在事實庫。「產品家族」是 `messaging.md`「統一用詞」的說法，跟首頁與 `/products/digilism` 一致 | 同意。title 見第 13 項 | 採納，h1「SysTalk.ai 產品家族」 |
| 6 | 報價信箱 `fact:systalk-ai-quote-email` 不放 | 不放 | 主要轉換是聯絡業務，`audience-and-goals.md` 規定所有產品線的轉換統一；頁尾另放一個信箱會把詢問分到兩個入口 | 同意，對搜尋沒有影響 | 採納 |
| 7 | 併入頁的事實由本頁還是 `/aiso` 承接 | 全部由本頁承接：第 3 段用 `DM-3` 的三則，第 5 段用原文點名 SysTalk.ai 的兩則與模組清單，第 6 段用軟硬體交付、導入服務與硬體規格的五則 | 初稿時 AISO 一體機的軟體核心未確認（`messaging.md`「缺少證據的主張」第 17 項），這頁先只用原文寫明 SysTalk.ai 的事實與 `DM-3` 指給這頁的三則，軟硬體交付與硬體規格留給 `/aiso`。使用者決定（#199，PR #204，2026-11-05）：AISO 的軟體是 OrientAI，併入頁是 SysTalk.ai 搭配群聯 aiDAPTIV 的一體機方案，講的不是 AISO，所以併入頁的事實全部由本頁承接，`/aiso` 不再引用，不再有兩頁分工的問題 | 初稿意見：查詢分工不跟著軟體核心變，`企業 生成式 AI 平台 地端部署 RAG` 次要給這頁（第 3、5 段），`地端 AI 伺服器 企業 LLM`、`AI 一體機 企業 地端 交機即用` 主要給 `/aiso`。#199 使用者決定後，前幾名缺的機型規格、硬體內建軟體與導入服務都只在本頁，這兩組改由本頁主要承接，`/aiso` 次要（`aiso.md`「取捨」第 11 項）。複核：同意。承接跟著事實走，機型規格只在本頁，`/aiso` 主要承接也接不住。代價是 hub 要多接一個產品類別的查詢，所以 title 加「地端一體機」（第 13 項），description 寫出一體機與機型；`/aiso` 的 title 不用「一體機」，`/orient-ai` 連到 `/aiso` 的錨點也改成「地端 AI 方案」，三頁不搶同一個詞。本頁第 3、6 段仍不連 `/aiso`（第 12 項），兩個一體機是不同方案 | 全部由本頁承接（使用者決定，#199，seo-strategist 複核同意）；title 加「地端一體機」 |
| 8 | 第 3 段的「私密資料不上公有雲」和 hero 的「雲/地端」放在同一頁 | 第 3 段的說明句寫明講的是地端方案 | 兩則原文都對，但出自不同情境（家族頁寫雲地端都有，併入頁寫地端一體機）。不寫清楚，讀者會讀成兩句互相矛盾 | 同意。description 也照這樣寫「地端方案的資料不上公有雲」 | 採納 |
| 9 | 相關文章（`featuredPosts`）不放 | 不放 | `/blog/enterprise-ai-adoption` 已在內文連到這頁；放成一段索引列會和第 7 段的子頁索引列相鄰，違反「內頁共用的規則」的相鄰版型規則。這頁的讀者要找的是產品入口 | 同意。`企業 AI 導入` 由文章主要承接，文章結語已連到這頁，這頁不必反連來分擔這組查詢 | 採納 |
| 10 | 子頁索引列的一句讀各 offering 的 `description` | 照模板做法，這份 brief 不改子頁的 description | 子頁的 description 有些含未確認或本站不用的說法（例如「一站式」「高準確率」），是各子頁 brief 的範圍（`DM-9` 寫法：子頁卡片的文字由 hub 模板讀各 offering 的 description） | 同意。這兩頁在本批改寫：`smartclaim.md`、`smartfilling.md` 的 description 示例已不含這些說法；其他子頁（例如 `/products/systalk-viki` 的「一站式」）在各自改版時處理 | 採納 |
| 11 | 客服類查詢（`AI 智能客服 推薦 台灣 企業`、`AI 客服機器人 怎麼選`）由哪頁承接（`search-intent.md` 待決條目） | 第 2 段的客服列把 `AI 智能客服 推薦 台灣 企業` 列為次要子題 | — | 主要給 `/products/systalk-chat`。`nodes.csv` 備註「併入 /genai-solution 導入服務」說的是現站 `/genai-solution` 併入這個節點（`docs/ia/page-map.csv`），`systalk-chat` 本身會產生頁面（`src/content/offering/zh-TW/systalk-chat.md`），節點名「SysTalk.Chat AI 智能客服」就含查詢用詞。這頁第 2 段客服列連過去，次要承接 `AI 智能客服 推薦 台灣 企業`。`AI 客服機器人 怎麼選` 沒有主要承接頁，次要給 `/products/systalk-chat`，不另寫文章：前幾名已有繁中選購指南，產品比較的事實沒有 | 定案 |
| 12 | 第 3 段要不要連到 `/aiso` | 沒有提（第 7 項只決定事實的分工） | — | 不連，第 17 項確認後再決定。連過去對 `企業主權 AI 地端部署 方案` 有幫助，但放在 SysTalk.ai 的地端段落裡，讀者會讀成 AISO 用的是 SysTalk.ai，正是第 17 項還不能寫的事 | 定案：不連。第 17 項已結算（#199）：AISO 的軟體是 OrientAI，第 3 段講的是 SysTalk.ai 搭配群聯 aiDAPTIV 的地端方案，連到 `/aiso` 會讓讀者以為 AISO 搭載 SysTalk.ai。第 6 段（一體機的機型）同樣不連 |
| 13 | title 用什麼 | `<title>` 由 seo-strategist 用 `seoTitle` 處理（第 5 項） | — | `seoTitle`「SysTalk.ai 企業 AI 產品家族」。不放子頁的類別詞，避免 hub 跟子頁搶同一組詞。#199 使用者決定後改：`地端 AI 伺服器 企業 LLM`、`AI 一體機 企業 地端 交機即用` 由本頁主要承接，而且沒有子頁承接一體機（不是 `nodes.csv` 的節點），title 加「地端一體機」：「SysTalk.ai 企業 AI 產品家族與地端一體機」。子頁類別詞仍不放 | 定案（#199 使用者決定後改），見「title 與 description 方向」 |

## 待確認

事實庫沒有這些內容，頁面不補、不寫成更強的說法：

| # | 事項 | 卡在哪 | 影響的段落 |
|---|---|---|---|
| 1 | SysTalk.ai 的累計用戶數（`fact:systalk-ai-140-million-users`） | `to_confirm`：沒寫統計時間 | 1 |
| 2 | 「100% AI 主控權」與 CIO 調查數字（`fact:aiso-100-percent-control`、`fact:aiso-cio-survey`） | `to_confirm`：口號式的 100%；第三方調查沒有年份（`messaging.md`「缺少證據的主張」第 18 項） | 3 |
| 3 | 搭配群聯 aiDAPTIV 的效能比較（`fact:aiso-phison-patent`、`fact:aiso-finetune-benchmark`、`fact:aiso-70b-on-4-gpus`、`fact:aiso-10x-dell-hpe`、`fact:aiso-25x-response`、`fact:aiso-52-to-2-seconds`） | `to_confirm`：合作夥伴的估算與點名競品的比較（`messaging.md`「缺少證據的主張」第 9 項） | 3、5、6 |
| 4 | 2025 AI AWARD | 只在併入頁的 meta description，查不到獎項全名與頒發單位，不在事實庫（`messaging.md`「缺少證據的主張」第 20 項） | 1 |
| 5 | AISO 一體機的軟體核心，以及併入頁的事實由 `/aiso` 還是這頁承接（已結算） | 使用者決定（#199）：AISO 的軟體是 OrientAI（`fact:aiso-software-orientai`、`fact:aiso-orientai-hardware`，`messaging.md`「缺少證據的主張」第 17 項）。同一天（PR #204，2026-11-05）再決定併入頁講的不是 AISO：併入頁的事實全部由這頁承接，`/aiso` 不引用（取捨第 7 項）。`aiDAPTIV SysTalk.ai`、`地端 AI 伺服器 企業 LLM`、`AI 一體機 企業 地端 交機即用` 改由這頁主要承接，`企業 地端 LLM 建置 成本` 次要（`search-intent.md`「對應到頁面」） | 3、5、6 |
| 6 | SysTalk.Detect 是否仍在銷售 | `nodes.csv` 備註「待確認：不在導覽，是否仍銷售」。仍產生頁面時會出現在第 7 段的索引列 | 7 |

## 後續

- en、vi 版另做，照 `content-migration` skill「多語系內容」，不在這份 brief 的範圍
