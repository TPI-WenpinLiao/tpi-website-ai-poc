# Content brief：blog 文章「企業 AI 導入」`/blog/enterprise-ai-adoption`（#173）

- 模板：`article`（`blog-post` 節點）；內容檔：`src/content/blog/zh-TW/enterprise-ai-adoption.md`（製作階段建立，本步驟不建）
- 主張 id 指 `docs/strategy/messaging.md`；事實的寫法見 `content-strategy` skill「引用事實的寫法」，只用 `docs/strategy/facts.yaml` 裡 zh-TW、`status: confirmed` 的條目
- 狀態：策略定案，使用者已確認（2026-11-03，#173 留言）。content-strategist 寫完「受眾與任務」「段落結構」「CTA」「schema 缺口」「待確認」與「取捨」的前兩欄；seo-strategist 補了「搜尋意圖」「內部連結」「title 與 description 方向」與「取捨」的意見欄，新增取捨第 9–12 項；content-strategist 填了「取捨」的最後決定，第 4、9、11 項改了文章設定、段落表、CTA 與內部連結。本 issue 不做的事列在文末「延伸事項」

## 文章設定

| 欄位 | 值 | 說明 |
|---|---|---|
| slug | `enterprise-ai-adoption` | 已定 |
| 路徑 | `/blog/enterprise-ai-adoption` | `nodes.csv` 的 `blog-post`（`/blog/{slug}`） |
| `category` | `ai` | 已定（`blog-ai` 節點，`/blog/ai`） |
| `tags` | `[ai-application]` | `src/content/tags.yaml` 的「AI 應用」。zh-TW 的 `category: ai` 文章都只用這個 tag，跟同分類一致（「取捨」第 9 項） |
| `author`、`authorType` | `TPIsoftware`、`Organization` | 已定 |
| `coverImage` | `src/assets/design/cover-platform.webp` | 已定，沿用。內文不放圖：blog 內文是 Markdown，沒有段落圖欄位，本文的段落也不需要圖才讀得懂 |
| `sourceUrl` | `[]` | 新寫的文章，沒有現站來源；不填 `migratedAt` |
| `facts` | 段落表「事實」欄的所有 id | `sourceUrl: []` 的內容檔受 `node scripts/strategy/facts.mjs` 檢查：內文的阿拉伯數字與客戶名稱要出現在引用的事實裡 |
| `relatedOfferings` | `[zh-TW/orient-ai]` | `src/content/offering/zh-TW/orient-ai.md` 存在。主要連結目標是 `/orient-ai`，文章填了之後 OrientAI 頁的相關文章反查得到。不加 `zh-TW/digirunner`：`digirunner.md` 第 11 段列的是 API Gateway 與 AI Gateway 的文章，本文只有第 7 段跟 digiRunner 有關。不加 `zh-TW/aiso`：本文只有第 6 段的一句連到 `/aiso`（「取捨」第 4 項）。`/products/systalk-ai` 是 hub（`family-ai`），不是 offering，放不進這個欄位，見「內部連結」 |
| 連結目標 | 主要 `/orient-ai`，次要 `/products/systalk-ai`（issue 預設的 `/aiso` 改掉）；`/aiso` 只在第 6 段當一個內文連結 | 主要：第 6 段的資料留在企業內與治理層，事實多數出自 OrientAI 頁，第 5 段的治理也接到這裡。次要：第 8 段的導入服務事實出自 AI 產品家族頁。`/aiso`：第 6 段談部署在企業端，是 `企業主權 AI 地端部署 方案` 的子題。理由見「取捨」第 4 項 |
| 語系 | 只做 zh-TW | en、vi 列為後續事項（`site-profile.md`「語系」） |
| `publishedAt` | 製作階段寫入當天日期 | |

## 受眾與任務

依 `docs/research/audience-and-goals.md`「受眾分群」：

| 受眾 | 從搜尋點進來做什麼 | 這篇要讓他做到的事 |
|---|---|---|
| 決策者（金融、政府與公部門的 CIO、CTO、高階主管），主要 | 了解企業導入 AI 要怎麼開始、要先決定哪些事、風險在哪裡 | 讀完知道導入的順序、怎麼跟事業目標對齊、成效要先定義怎麼衡量；看到受監管產業的資料與稽核問題有現成做法；找得到聯絡業務的入口 |
| IT 主管、專案負責人，主要 | 確認導入時技術面要先準備什麼：部署位置、使用紀錄、模型選擇、治理機制 | 每個技術問題有一段寫做法與要準備的東西；需要產品時，連到對應的產品頁 |

製造業是 `audience-and-goals.md` 的受眾之一，但定位句不點名製造業（messaging「定位不說的事」），本文舉例只寫金融與政府。

主要轉換：聯絡業務。這篇是資訊型文章，讀者多半還在研究階段，文章的工作是把人送到產品頁或聯絡頁，不在內文放表單。

## 搜尋意圖

依 `docs/strategy/search-intent.md`「首頁 `/`」底下的「企業 AI 導入」條目。沒有 Search Console 數據，取捨只依受眾與頁面主題，不依搜尋量。

### 這篇承接的查詢

| 查詢 | 意圖類型 | 承接 | `search-intent.md` 的條目 |
|---|---|---|---|
| `企業 AI 導入` | 資訊型（前幾名是 SAP 台灣、PRO360 的導入指南，與工商時報、iThome 的調查報導） | 主要。`search-intent.md`「對應到頁面」指給文章；首頁與產品頁都不承接（`home.md`「不由這頁承接的查詢」、`digirunner.md`「三件待決事項」第 1 項） | 「企業 AI 導入」 |

現站同主題文章 `https://www.tpisoftware.com/blog/ai/implementationguide` 的處置是 `drop`，本文不轉址承接它，只承接查詢。

### 相關但不由這篇承接的查詢

本文有段落回答這些查詢的子題，但主要承接頁另有其頁，本文不在 title 放它們的詞：

| 查詢 | 主要承接 | 本文的關係 |
|---|---|---|
| `金融業 AI 應用` | `/industries/finance` | 第 6、7 段回答這組前幾名都沒有的兩項（地端部署讓資料不出企業、AI 使用紀錄留給監管查核），但這組問的是金融業的應用領域，本文寫的是導入流程。title 不放「金融」（金融頁的 title 有「金融業 AI 應用」，`finance.md`「取捨」第 2 項）。金融頁要不要把本文列進 `featuredPosts` 見「取捨」第 12 項與「延伸事項」 |
| `企業主權 AI 地端部署 方案` | `/aiso` | 第 6 段談部署在企業端，跟這組的共同子題「部署形式」重疊；本文不寫主權 AI 的定義與硬體容量，第 6 段連到 `/aiso`（「取捨」第 4 項） |
| `台灣 AI 解決方案 公司` | 次要 `/`、`/products/systalk-ai`，沒有主要承接頁 | 商業型（找廠商），本文不承接；第 8 段連到 `/products/systalk-ai` |

### 變化查詢不列為承接

「AI 導入步驟」「AI 導入 金融業」「AI 治理框架」不列為次要承接。`search-intent.md` 沒有觀察過這幾組的前幾名，不知道意圖類型與共同子題，列了也沒有可以對照的依據。本文的 h2 本來就會用到「導入步驟」「AI 治理」「NIST AI RMF」這些詞，這些查詢若有人查，靠 h2 對得到。要正式承接，先請 researcher 照 `site-research` skill 補觀察，再回來改這一段。

### 子題對應到哪一段

段落結構下的「共同子題對照」沒有問題，照用。補充三點：

- 共同子題五項都有段落，其中「ROI 與失敗比例」「企業成熟度調查」是部分涵蓋，缺的是數字，被事實規則擋下（「取捨」第 1、2 項）。本文跟前幾名的差別放在前幾名都沒有的三項（第 6–8 段），三項都有 confirmed 事實
- 部分涵蓋的子題，詞要出現在 heading：第 4 段 h2 保留「ROI」；第 2 段的自我檢查清單用 h3，標題帶「成熟度」（「取捨」第 2 項）；第 5 段 h2 帶「AI 治理」，「NIST AI RMF」放 h2 或該段第一句（「取捨」第 3 項）
- 第 6、7 段的 h2 寫成讀者的問題（例如「受監管產業：資料怎麼留在企業內」「AI 使用紀錄怎麼留給稽核」），這兩句就是前幾名都沒有的子題，讀者掃 h2 就看得到這篇多回答了什麼

### heading 跟既有文章分開

`/blog/what-is-ai-agent-management-platform` 的 title 是「AI Agent 管理平台是什麼？企業導入原因與落地步驟解析」。本文的 title 與 h2 不用「AI Agent」與「落地」（messaging「統一用詞」也不用「落地」），用「企業 AI 導入」「導入步驟」，兩篇在搜尋結果上看得出範圍不同（「取捨」第 5 項）。

## 這頁要讓讀者相信什麼

企業導入 AI 要先對齊事業目標、定義衡量方式、建好治理，再擴大使用；受監管產業最難的兩件事（資料留在企業內、AI 使用紀錄留給稽核）已有產品做法（`DM-3`、`IT-5`），導入前與導入中要做的事，昕力也提供服務（`DM-4`）。

## 段落結構

文章的主體（第 1–5 段）是導入的通用解說，全部是表述，不帶數字、不提產品。昕力的產品與服務只出現在第 6–8 段，這三段回答 `search-intent.md` 寫的「前幾名都沒有」的三個子題，每句產品描述都引用事實原文。順序照讀者的判斷順序：先知道要做什麼（第 2–3 段）、怎麼知道做得好不好（第 4 段）、怎麼控管風險（第 5 段），再看受監管產業的具體做法（第 6–7 段）與可以找誰協助（第 8 段）。

| # | 段落 | 目的 | 依據（受眾任務／主張 id） | 搜尋子題 | 事實 | 預估字數 |
|---|---|---|---|---|---|---|
| 1 | 導言：企業導入 AI 要先回答的問題 | 說出這篇的範圍：整個企業怎麼導入 AI（生成式 AI、知識問答、文件辨識、Agent 都算），不是單一工具或 Agent 平台的介紹。列出讀完會知道的事（步驟、目標對齊、衡量方式、治理、資料與紀錄、可以找誰協助），讓從搜尋進來的人判斷這篇是否回答他的問題。不寫「AI 浪潮來襲」這類開場 | 決策者任務「了解產品與方案」 | 導入步驟（總覽） | 無（表述） | 150–200 |
| 2 | 先對齊事業目標，再選場景 | 導入從要解決的業務問題開始，不從模型開始。寫怎麼挑第一個場景：流程清楚、重複性高、有資料可用、有明確的負責單位、成果看得出來。寫事業單位與 IT 各自要決定的事。接一份不帶分數的自我檢查清單（有沒有盤點過場景與資料、有沒有負責人、有沒有使用規範），讓讀者判斷組織在哪個階段 | 決策者任務「了解產品與方案」 | 與事業目標對齊；企業成熟度調查（改用自我檢查清單回答，見「取捨」第 2 項） | 無（表述） | 350–450 |
| 3 | 導入步驟：從盤點、驗證到擴大 | 依序寫：盤點場景與資料、決定部署位置與模型、小範圍驗證、上線與擴大、持續監控與調整。每一步寫要產出什麼（場景清單、資料清單、驗證的成功條件、上線的權限設定），不寫空泛的「持續優化」。「決定部署位置」一步只點出要先決定，細節留給第 6 段。結尾一句連到 `/blog/what-is-ai-agent-management-platform`，給要導入 AI Agent 的讀者看 Agent 專用的落地步驟 | IT 主管任務「確認裝得進現有環境」；決策者任務「了解產品與方案」 | 導入步驟 | 無（表述） | 450–550 |
| 4 | 衡量成效：先定義衡量方式，再談 ROI | 寫 ROI 要在驗證前定好：比較的基準（導入前的作業時間、人力、錯誤）、要看的指標（處理時間、人工介入、使用量與成本）、誰來看、多久看一次。寫專案卡在驗證階段的常見原因（沒有成功條件、沒接上實際流程、成本算不出來），不寫比例或調查數字。用量成本的細節連到 `/blog/ai-token-cost-management` | 決策者任務「了解產品與方案」（評估投資） | ROI 與失敗比例（改用不帶數字的表述回答，見「取捨」第 1 項） | 無（表述） | 350–450 |
| 5 | AI 治理：用公開框架整理風險 | 寫導入時要有的治理項目：誰能用哪些 AI、資料邊界、輸入與輸出的檢查、使用紀錄、出事時的責任歸屬，以及員工自行使用外部 AI 工具（影子 AI）的處理。提到 NIST AI RMF 是美國國家標準暨技術研究院發布的 AI 風險管理框架，可以寫出它的四個核心功能名稱（Govern、Map、Measure、Manage），用來整理上面的治理項目。不寫昕力的產品符合或對應這個框架（「取捨」第 3 項）。這段不提產品，產品做法在第 6、7 段 | 決策者任務「了解產品與方案」（風險在哪裡被處理）；IT 主管任務「確認資安過得了關」 | AI 治理與風險框架（NIST AI RMF） | 無（表述） | 400–500 |
| 6 | 受監管產業：讓資料留在企業內 | 金融與政府導入 AI 時，先問資料會不會離開企業。寫兩種做法的差別（呼叫外部雲端模型、部署在企業端），以及部署在企業端要準備的事（硬體依使用人數選、模型與知識庫在企業內、用量成本的算法不同）。「部署在企業端」的通用句連到 `/aiso`，錨點「AISO 主權 AI 解決方案」。接著用事實寫昕力的做法，h3 寫內容（例如「昕力的產品怎麼讓資料留在企業內」），不寫「昕力的做法」。h3 下第一句用節點名交代三個產品各是什麼（OrientAI 企業級 Agentic AI 平台、SysTalk.VIKI 企業生成式 AI 應用平台、SysTalk.ai AI 產品家族），不寫比較。事實：OrientAI 只部署在企業端，引用時連同原文所在的 FAQ 問句「資料會被拿來訓練第三方模型嗎？」一起寫，因為原文以「不會。」開頭；SysTalk.VIKI 的查詢與回應在企業內部進行；OrientAI 治理層的四項照原文列，引言寫「治理層管這幾件事」，不把第 5 段的影子 AI 定義（員工把資料貼到外部工具）套到治理層上；硬體兩級前面寫依使用人數選規格；aiDAPTIV 前面寫離線也能運行；地端 AI 不限 Token 流量。`/aiso` 的連結不放在引用 `fact:aiso-no-token-limit` 的句子（那則事實出自 `/products/systalk-ai-phison`（企業 AI 一體機軟硬整合解決方案，新站併入 `/products/systalk-ai`））。段末連到 `/orient-ai`（主要），錨點「OrientAI 的地端部署與治理層」；SysTalk.VIKI 那句連到 `/products/systalk-viki`。公有雲 AI 的風險細節連到 `/blog/why-enterprises-need-ai-appliance` | 決策者任務「確認風險在哪裡被處理」；IT 主管任務「確認裝得進現有環境」；`DM-3` | 前幾名都沒有：受監管產業導入時資料留在企業內的做法 | `fact:orientai-on-prem-data`、`fact:systalk-viki-on-prem`、`fact:orientai-governance-layer`、`fact:orientai-hardware-small`、`fact:orientai-hardware-large`、`fact:aiso-no-token-limit`、`fact:orientai-aidaptiv` | 400–500，事實 5–7 則 |
| 7 | AI 使用紀錄怎麼留給稽核 | 寫稽核會問的事：誰在什麼時候用了哪個模型、輸入輸出有沒有檢查、權限怎麼設。寫紀錄要在導入時就設計，不是出事後補；「AI 呼叫經過同一個入口」是通用句，跟 digiRunner 的例子分開寫，不讓讀者讀成 digiRunner 就是那個入口（引用的事實沒有寫統一入口）。接著用事實寫做法，引言只說這幾項跟紀錄、內容檢查與流量監控有關：digiRunner 記錄 AI 使用歷程、輸入與輸出前自動檢測、即時監控 AI 流量；SysTalk.VIKI 有權限控管與審核機制。段末連到 `/products/digirunner`，錨點「digiRunner API 管理平台的 AI 使用歷程紀錄」。AI Gateway 的權限與稽核細節連到 `/blog/ai-gateway-for-enterprise-ai-security` | IT 主管任務「確認上線後維運得動」「確認資安過得了關」；`IT-5`、`IT-6` | 前幾名都沒有：AI 使用紀錄怎麼留給稽核 | `fact:digirunner-ai-usage-log`、`fact:digirunner-ai-content-review`、`fact:digirunner-ai-traffic`、`fact:systalk-viki-permissions` | 300–400，事實 4 則 |
| 8 | 導入前與導入中，昕力做哪些事 | 對照第 3 段的步驟，用事實列出昕力的服務項目：導入前的情境分析、解決方案搭配建議、效益評估、AI 服務導入；導入中的模型評估與微調；導入規劃、模型設定、建置與應用模組設計；依場景選模型。`fact:systalk-ai-onboarding` 已拆成兩行，照原文列成兩項。列完後只把原文說得到的對到第 3 段的步驟名稱：「AI 導入情境分析」對盤點場景與資料（挑場景），「模型評估」與 `fact:aiso-llm-support` 的依場景選模型對「決定部署位置與模型」這一步的選模型部分（不涵蓋部署位置）；`fact:aiso-onboarding` 寫成規劃與建置的工作，不硬對單一步驟；`fact:aiso-llm-support`、`fact:aiso-onboarding` 出自 `/products/systalk-ai-phison`，文中寫明是 SysTalk.ai 的企業 AI 一體機軟硬整合解決方案（選擇地端部署時），不寫成所有導入都有的服務；效益評估、微調等其他項目不對。段末連到 `/products/systalk-ai`，錨點「SysTalk.ai 的 AI 導入服務與產品」 | 決策者任務「決定要不要聯絡業務」；`DM-4`、`IT-8` | 前幾名都沒有：導入前、導入中各做哪些事的服務項目 | `fact:systalk-ai-onboarding`、`fact:aiso-onboarding`、`fact:aiso-llm-support` | 250–350，事實 3 則 |
| 9 | 下一步 | 一兩句收尾，寫讀者接下來可以做的事：帶著第 2 段挑出的場景與自我檢查的結果來談。主要動作「聯絡業務」，次要動作「認識 OrientAI 企業級 Agentic AI 平台」。不寫「攜手共創未來」這類套話 | 主要轉換：聯絡業務 | — | 無（表述） | 80–120 |

合計約 2,700–3,500 字。

### 寫作規則

- 第 1–5 段與第 9 段是表述，不寫阿拉伯數字。標題寫「導入步驟」不寫「5 個步驟」：`sourceUrl: []` 的內容檔，`facts.mjs` 會擋下沒出現在引用事實裡的數字。步驟用編號清單即可
- 第 6–8 段的產品描述是事實（messaging「一句話的產品描述算事實」），照事實原文引用，不改寫成更強的說法。說明句寫讀者得到什麼，事實原文放在說明句後面
- 事實原文裡的「確保」「符合監管要求」（`fact:digirunner-ai-usage-log`）照原文出現，表述不延伸成「符合金管會規範」或「通過稽核」
- `fact:digirunner-ai-usage-log` 的原文是「完整錄所有AI使用歷程」，少一個「記」字，照原文引用，不補字（見「待確認」第 5 項）
- 不定義 AI Agent、Agentic AI，也不重寫既有文章的段落，需要時連過去（見下節）
- 用詞照 messaging「統一用詞」：「導入」不寫「落地」，「部署」不寫「佈署」（事實原文除外），「地端」不寫「本地端」
- 產品名照 messaging「產品與公司名寫法」：OrientAI、SysTalk.VIKI、SysTalk.ai、digiRunner；digiRunner 出現時帶「API 管理平台」

### 和既有文章的差別

zh-TW 的 `category: ai` 已有 8 篇 2026 年文章，其中 6 篇和本文的子題相鄰。本文是「企業 AI 導入」的總覽，每個子題寫一段後連到深入的那篇，不重寫：

| 既有文章 | 那篇寫什麼 | 本文怎麼分開 |
|---|---|---|
| `/blog/what-is-ai-agent-management-platform` | AI Agent 管理平台的定義、和單一 Agent 的差別、Agent 專用的導入迷思與落地步驟 | 本文的步驟涵蓋所有 AI 導入（不限 Agent），多了部署位置、衡量方式與治理；不定義 Agent。第 3 段連過去 |
| `/blog/what-is-agentic-ai-platform` | Agentic AI 與 AI Agent 的定義、多 Agent 的管理挑戰、平台的四個維度 | 本文不談多 Agent 架構。第 5 段的治理項目只寫企業層級的規範，不寫 Agent 的編排與觀測 |
| `/blog/ai-token-cost-management` | Token 成本、AI ROI 與管理策略 | 本文第 4 段只寫 ROI 要先定義衡量方式，用量成本連過去 |
| `/blog/why-enterprises-need-ai-appliance` | 公有雲 AI 的資料外洩風險、AI 一體機 | 本文第 6 段寫受監管產業的部署選擇與要準備的事，公有雲風險的細節連過去 |
| `/blog/ai-gateway-for-enterprise-ai-security` | digiRunner AI Gateway 的 RBAC、Guardrail、行為稽核 | 本文第 7 段只寫稽核要什麼紀錄與 digiRunner 的事實原文，Gateway 的細節連過去 |
| `/blog/ai-infrastructure-operations-governance` | 用 AI Gateway 管理生成式 AI 與模型整合的成本與維運 | 本文不寫 AI 基礎架構的維運，內文也不連：第 7 段已經連一篇 AI Gateway 的文章（「內部連結」的不連頁面表） |

### 共同子題對照

`search-intent.md`「企業 AI 導入」的共同子題與「前幾名都沒有」的三項：

| 子題 | 段落 | 怎麼回答 |
|---|---|---|
| 導入步驟 | 第 3 段（第 1 段總覽） | 通用步驟，表述 |
| 與事業目標對齊 | 第 2 段 | 表述 |
| ROI 與失敗比例 | 第 4 段 | 部分涵蓋。寫衡量方式與專案卡住的常見原因，不寫比例或調查數字。事實庫沒有外部統計，`facts.yaml` 的每筆事實要有現站來源，第三方調查目前收不進來（「取捨」第 1 項、「待確認」第 1 項） |
| AI 治理與風險框架（NIST AI RMF） | 第 5 段 | 表述，寫框架名稱與四個核心功能名稱，不寫產品對應框架 |
| 企業成熟度調查 | 第 2 段的自我檢查清單 | 部分涵蓋。不引用調查數字：事實庫唯一的調查 `aiso-cio-survey` 是 `to_confirm`，現站沒寫調查年份（「待確認」第 2 項）。改用不帶分數的檢查清單，讓讀者自己判斷所在階段 |
| 前幾名都沒有：資料留在企業內 | 第 6 段 | 事實，`DM-3` |
| 前幾名都沒有：AI 使用紀錄留給稽核 | 第 7 段 | 事實，`IT-5`、`IT-6` |
| 前幾名都沒有：導入前、導入中的服務項目 | 第 8 段 | 事實，`DM-4`、`IT-8` |

### 候選事實沒用的理由

| 事實 | 沒用的理由 |
|---|---|
| `fact:orientai-execution-layer` | 原文最後一項「支援雲地靈活部署架構」，跟第 6 段引用的 `fact:orientai-on-prem-data`「只會部署於企業端」放在同一篇會互相矛盾。原文是一整串，不能只取前三項（見「待確認」第 3 項） |
| `fact:orientai-five-features` | 跟 `fact:orientai-governance-layer` 重複（存取權控管、影子 AI、Token 用量），另一項「多代理協作」是 Agent 的主題，由既有兩篇 Agent 文章寫 |
| `fact:aiso-modules` | 15 個模組的清單放進文章，第 8 段會變成產品頁。第 8 段只需要「應用模組設計服務」（`fact:aiso-onboarding`）與依場景選模型（`fact:aiso-llm-support`） |

## CTA

| CTA | 文案方向 | 位置 | 連到 |
|---|---|---|---|
| 主要：聯絡業務 | 「聯絡業務」，前一句寫可以帶什麼來談（場景與檢查結果）。按鈕名稱照 messaging「統一用詞」 | 第 9 段 | `/contact-us`（`contact`） |
| 次要：認識 OrientAI | 第 9 段寫「認識 OrientAI 企業級 Agentic AI 平台」（節點名，首頁第 4 段同一個錨點）。第 6 段段末另連一次，錨點「OrientAI 的地端部署與治理層」（「取捨」第 11 項） | 第 6 段段末、第 9 段 | `/orient-ai`（`orient-ai`） |
| 次要：看 AI 產品家族 | 錨點寫目標頁的內容，例如「SysTalk.ai 的 AI 導入服務與產品」，不只寫家族名 | 第 8 段段末 | `/products/systalk-ai`（`family-ai`） |

主要 CTA 用「聯絡業務」，不用 OrientAI 頁的 `cta: demo`（預約演示）：本文涵蓋多個產品與導入服務，讀者還沒選定產品；預約演示留在產品頁發生。

blog 模板（`ArticleTemplate.astro`）沒有頁尾的 `ContactCta`，第 9 段的聯絡業務寫成內文連結。要不要讓模板輸出 `ContactCta`，見「schema 缺口」。

## 內部連結

路徑取 `docs/ia/nodes.csv`，blog 文章取 `docs/ia/page-map.csv` 的 `blog_slug`，新文章用本文的 slug。錨點寫目的地是什麼；產品名照節點名或帶類別詞，digiRunner 一律帶「API 管理平台」。同一篇裡連到同一頁兩次時，兩個錨點各寫各的內容（「取捨」第 11 項）。每個子題段落最多一篇延伸閱讀的文章，讀者才知道深入該讀哪篇。

### 連出

| 段落 | 連到 | 建議錨點文字 | 說明 |
|---|---|---|---|
| 3 | `/blog/what-is-ai-agent-management-platform` | AI Agent 管理平台的導入步驟 | 段末一句，給要導入 AI Agent 的讀者。那篇的 h2「AI Agent 管理平台要怎麼落地？」就是錨點寫的內容 |
| 4 | `/blog/ai-token-cost-management` | AI Token 成本與 ROI 怎麼算 | 用量成本那一句 |
| 6 | `/aiso` | AISO 主權 AI 解決方案 | 放在「部署在企業端」的通用句，不放在引用 `fact:aiso-no-token-limit` 那一句：那則事實出自 `/products/systalk-ai-phison`（企業 AI 一體機軟硬整合解決方案，新站併入 `/products/systalk-ai`），連到 `/aiso` 會讓讀者以為事實出自那頁（「取捨」第 4 項）。錨點用目標頁的 `title` |
| 6 | `/products/systalk-viki` | SysTalk.VIKI 企業生成式 AI 應用平台 | 節點名，放在引用 `fact:systalk-viki-on-prem` 那一句 |
| 6 | `/blog/why-enterprises-need-ai-appliance` | 公有雲 AI 的資料外洩風險與 AI 一體機 | 錨點寫那篇回答的問題，比文章標題的問句好懂 |
| 6 | `/orient-ai` | OrientAI 的地端部署與治理層 | 段末。錨點寫第 6 段引用的 OrientAI 事實在產品頁的哪些內容，跟第 9 段的錨點不同（「取捨」第 11 項） |
| 7 | `/products/digirunner` | digiRunner API 管理平台的 AI 使用歷程紀錄 | 段末。第 7 段引用 `fact:digirunner-ai-usage-log`，錨點寫讀者到產品頁要看的那一段；跟 `finance.md` 第 4 段的錨點分開（那段另外引用了 AI 治理） |
| 7 | `/blog/ai-gateway-for-enterprise-ai-security` | 企業 AI 如何防止權限失控與資料外洩 | 沿用 `digirunner.md` 的錨點；那篇寫行為稽核，接得上第 7 段 |
| 8 | `/products/systalk-ai` | SysTalk.ai 的 AI 導入服務與產品 | 段末，見「CTA」。第 8 段的 3 則事實出自現站 `/products/systalk-ai` 與 `/products/systalk-ai-phison`，後者在新站併入 `family-ai`（`docs/ia/page-map.csv`） |
| 9 | `/contact-us` | 聯絡業務 | 主要轉換，放在第 9 段第一個連結（「取捨」第 8 項） |
| 9 | `/orient-ai` | 認識 OrientAI 企業級 Agentic AI 平台 | 次要動作，節點名（首頁第 4 段同一個錨點） |

不連的頁面：

| 頁面 | 理由 |
|---|---|
| `/blog/what-is-agentic-ai-platform` | 第 5 段只寫企業層級的治理項目，不談多 Agent 的編排；本文不定義 Agentic AI |
| `/blog/ai-infrastructure-operations-governance` | 第 7 段已經有一篇 AI Gateway 的延伸閱讀，再連一篇主題相近的（兩篇都講 AI Gateway），讀者分不出該讀哪篇。同分類的「相關文章」可能列出它 |
| `/industries/finance`、`/industries/government` | 第 6、7 段的金融與政府是舉例，產業頁寫的是產業的整體方案；連過去的錨點寫不出跟這兩段相關的目的地 |
| NIST 的官方頁 | 可選，製作階段決定。第 5 段提到 NIST AI RMF 時可以連到 NIST 的框架頁當出處（站外連結，不是事實引用），網址製作時確認 |

文章頁的「相關產品」卡片（`relatedOfferings`）與文末「相關文章」由模板產生，不算在上表。

### 連入

| 從 | 錨點文字 | 狀態 |
|---|---|---|
| `/orient-ai` 的「相關文章」 | 文章標題（模板產生） | 本 issue：本文填 `relatedOfferings: [zh-TW/orient-ai]` 後由 `OfferingTemplate.astro` 反查列出 |
| `category: ai` 其他文章的文末「相關文章」 | 文章標題（模板產生） | 自動。`ArticleTemplate.astro` 列同分類最新 3 篇，本文發布時是最新的，會出現在同分類其他文章的文末 |
| `/blog/ai`、`/blog` | 文章標題（模板產生） | 自動 |
| `/products/systalk-ai`（`family-ai` hub）的 `featuredPosts` | 文章標題（模板產生） | 建議加，另開 issue（「取捨」第 10 項、「延伸事項」第 1 項） |
| `/industries/finance` 的 `featuredPosts` | 文章標題（模板產生） | 建議加，但要改 `finance.md`「取捨」第 5 項的決定，先請使用者確認，另開 issue（「取捨」第 12 項、「延伸事項」第 2 項） |
| `/blog/what-is-ai-agent-management-platform` 的「AI Agent 管理平台要怎麼落地？」開頭 | 企業 AI 導入的步驟與治理 | 可選，不在本 issue 改（「延伸事項」第 3 項）。那篇的內文是從現站搬來的（`sourceUrl` 有值），加連結等於改搬移的內文，要不要改由主 session 依 `content-migration` 決定 |
| `/blog/ai-token-cost-management` 談 AI ROI 的段落 | 導入 AI 前怎麼定義成效的衡量方式 | 可選，同上 |

第 6、7 段連到的其他既有文章（`why-enterprises-need-ai-appliance`、`ai-gateway-for-enterprise-ai-security`）不建議改內文連回：同分類的「相關文章」已經連入，再改搬移的內文，得到的只是多一條重複的連結。

## title 與 description 方向

規則照 `seo-checklist`「每頁必備」：zh-TW title 約 20–32 個全形字（含後綴「｜TPIsoftware 昕力資訊」，後綴約 11 字），description 約 60–80 個全形字；半形英數與空格約算半個全形字（同 `digirunner.md` 的算法）。內容檔是 `sourceUrl: []`，title 與 description 都不寫阿拉伯數字（「寫作規則」第 1 條）。

### title

- 要涵蓋：查詢原文「企業 AI 導入」，放在最前面，詞序照查詢（不寫成「企業導入 AI」）；「步驟」（第一個共同子題，也是前幾名指南的類型）；「成效衡量」或「ROI」與「治理」（第 4、5 段）
- 傳達的主張：導入先對齊目標、定義衡量方式、建好治理，再擴大使用（「這頁要讓讀者相信什麼」的前半句）
- 不放：產品名（OrientAI、digiRunner、SysTalk.ai）、「AI Agent」與「落地」（跟 `/blog/what-is-ai-agent-management-platform` 分開，「取捨」第 5 項）、「金融」（`金融業 AI 應用` 由金融頁承接）、「完整攻略」「一次看懂」、「N 個步驟」
- h1 用內容檔的 `title`，title 的頁面主題跟 h1 相同，不用 `seoTitle`
- 示例（含後綴）：
  - `企業 AI 導入怎麼開始？步驟、成效衡量與治理｜TPIsoftware 昕力資訊`（約 32 字，建議用這個。問句對應「怎麼導入」的查詢意圖）
  - `企業 AI 導入步驟：目標對齊、ROI 衡量與治理｜TPIsoftware 昕力資訊`（約 32 字。帶「ROI」，對應共同子題的用詞）

### description

- 要涵蓋：「企業 AI 導入」、事業目標、成效衡量、治理、導入步驟；再加前幾名都沒有的兩項：資料留在企業內、AI 使用紀錄留給稽核
- 傳達的主張：同 title，加上受監管產業的兩件難事有做法（`DM-3`、`IT-5` 的表述，不寫產品名）
- 不寫：數字、產品名、「符合法規」「通過稽核」（`fact:digirunner-ai-usage-log` 原文只寫「符合監管要求」，description 不引用事實）
- 示例：
  - `企業 AI 導入要先對齊事業目標、定義成效怎麼衡量、建好治理，再擴大使用。本文整理導入步驟，並說明金融與政府怎麼讓資料留在企業內、把 AI 使用紀錄留給稽核。`（約 75 字，建議用這個）
  - `從挑選場景、小範圍驗證到擴大使用，整理企業 AI 導入的步驟、成效衡量方式與 AI 治理項目，也說明受監管產業怎麼讓資料留在企業內、留下 AI 使用紀錄。`（約 69 字）

第一個示例的第一句就是本文的主張，第二句寫範圍與差異化；「金融與政府」寫在 description 不寫在 title，搜尋結果上讀得到本文適合受監管產業，又不跟金融頁搶 title 的詞。

## schema 缺口

blog schema（`src/content.config.ts`）的欄位放得下本文：內文是 Markdown，`facts`、`relatedOfferings`、`tags` 都有。

| 段落 | 缺什麼 | 建議 | 型別 |
|---|---|---|---|
| 9 | `ArticleTemplate.astro` 沒有頁尾的 `ContactCta`，blog 文章讀完沒有固定的聯絡入口 | 本 issue 先用內文連結，不改模板。要讓所有 blog 文章都有頁尾聯絡入口時，由主 session 在 `ArticleTemplate.astro` 加 `ContactCta`（會影響所有 blog 頁與 `/templates/article` 的視覺回歸 baseline，建議另開 issue） | 無新欄位 |

## 取捨

第 1–8 項是 content-strategist 預寫的衝突與立場，第 9–12 項是 seo-strategist 加的（「content-strategist 的立場」欄寫的是初稿的寫法）。「最後決定」欄由 content-strategist 定案：

- 第 1–3、5–8 項 seo-strategist 同意初稿，做法不變；第 2、3 項補的 heading 與 NIST AI RMF 寫法照收
- 第 4、9、11 項採納 seo-strategist 的意見，改了做法：第 6 段在部署在企業端的通用句連一次 `/aiso`；`tags` 改成 `[ai-application]`；第 6、9 段連 `/orient-ai` 的錨點分開
- 「內部連結」連出表的錨點（`/aiso` 用頁面 title、第 6 段 `/orient-ai`、第 7 段 `/products/digirunner`、第 8 段 `/products/systalk-ai`）全部採納，段落表與 CTA 表已改成同一組錨點
- 第 10、12 項是改既有頁面的 `featuredPosts`，不在本 issue 做，列在「延伸事項」
- 改了做法的項目已反映到文章設定、段落結構（第 6–8 段）、CTA 與內部連結

| # | 可能的衝突 | content-strategist 的立場 | 理由 | seo-strategist 的意見 | 最後決定 |
|---|---|---|---|---|---|
| 1 | 「ROI 與失敗比例」是共同子題，前幾名用調查數字回答，SEO 可能要求寫出比例 | 不寫數字。第 4 段寫衡量方式與專案卡住的常見原因 | 事實庫沒有這類統計；`facts.yaml` 的每筆事實要有現站來源與原文，第三方調查目前收不進來。`orientai-benefits` 的成效百分比是 `to_confirm`，messaging「缺少證據的主張」第 7 項記錄使用者決定不用（#180）。要寫數字，得先決定事實庫能不能收外部來源（「待確認」第 1 項） | 同意，接受這個子題部分涵蓋。前幾名的比例多出自調查報導，本文拿不到同等的素材；讀者查比例背後要的是「怎麼不讓專案卡在驗證」，第 4 段的衡量方式與卡住的原因回答的就是這個。第 4 段 h2 保留「ROI」，子題的詞在 heading 上。title、description 不寫比例。外部統計收進事實庫之後，在第 4 段補一句即可，不影響段落結構 | 採納。第 4 段不寫比例與調查數字，h2 保留「ROI」；外部統計列在「待確認」第 1 項 |
| 2 | 「企業成熟度調查」是共同子題，SEO 可能要求引用調查 | 不引用調查，第 2 段改放不帶分數的自我檢查清單 | 事實庫唯一的調查 `aiso-cio-survey` 是 `to_confirm`，現站沒寫調查年份。檢查清單是表述，回答的是讀者查調查背後的問題「我的組織在哪個階段」 | 同意。補一個做法：清單用 h3，標題帶「成熟度」，例如「自我檢查：組織的 AI 導入成熟度到哪裡」，子題的詞出現在 heading，不必引用調查。清單不給分數、不分「第幾級」，分級要有框架或調查當依據 | 採納。第 2 段的自我檢查清單用 h3，標題帶「成熟度」；不給分數、不分級 |
| 3 | NIST AI RMF 要寫多深 | 寫框架名稱、發布單位、四個核心功能名稱，用它整理第 5 段的治理項目。不寫版本、年份與細項，不寫昕力的產品符合或對應這個框架 | 框架名稱是公開資訊，可以當表述；產品「符合」框架是事實主張，事實庫沒有。版本號與年份是阿拉伯數字，`facts.mjs` 會擋 | 同意這個深度。補兩點寫法：一、第一次出現時寫全名「NIST AI Risk Management Framework（AI RMF）」並附中文「AI 風險管理框架」，讀者與前幾名兩種寫法都用；二、四個核心功能寫英文名再加中文說明（治理、對應、衡量、管理），用來整理第 5 段的治理項目。h2 帶「AI 治理」，「NIST AI RMF」放 h2 或該段第一句都可以。要連 NIST 的官方頁當出處，見「內部連結」的不連頁面表 | 採納。第一次出現寫全名、縮寫與中文；四個核心功能寫英文名加中文說明。不寫版本、年份，不寫產品符合或對應框架 |
| 4 | 次要連結目標：issue 預設 `/aiso`，`search-intent.md` 也把 `企業主權 AI 地端部署 方案` 指給 `/aiso` | 次要連結改成 `/products/systalk-ai`；`/aiso` 只在第 6 段當一個內文連結（錨點用節點名「AISO 主權 AI」），連不連由 seo-strategist 決定 | 第 8 段的事實（`fact:systalk-ai-onboarding`、`fact:aiso-onboarding`、`fact:aiso-llm-support`）與第 6 段的 `fact:aiso-no-token-limit` 都出自現站 `/products/systalk-ai` 與 `/products/systalk-ai-phison`，後者在新站併入 `family-ai`（`page-map.csv`）。id 前綴雖然是 `aiso-`，`facts.yaml` 裡沒有任何一筆的來源是現站 `/aiso`，所以文章寫不出 `/aiso` 頁上可驗證的內容 | 部分同意。次要 CTA 改成 `/products/systalk-ai` 同意，第 8 段的事實出處決定了連結目標。但第 6 段仍建議連一次 `/aiso`，錨點「AISO 主權 AI 解決方案」：連結不是事實引用，不需要事實出自 `/aiso`；`search-intent.md` 把 `企業主權 AI 地端部署 方案` 指給 `/aiso`，第 6 段談部署在企業端，正是這組的共同子題「部署形式」，從主題相符的段落連過去，`/aiso` 多一個有意義的連入（首頁依 `home.md`「取捨」第 4 項不連 `/aiso`）。連結放在部署在企業端的通用句，不放在引用 `fact:aiso-no-token-limit` 那句，讀者才不會以為那則事實出自 `/aiso`。`relatedOfferings` 不加 `zh-TW/aiso`：本文只有一句跟它相關，文章頁的「相關產品」卡片不必列它 | 採納。次要 CTA 是 `/products/systalk-ai`；第 6 段在部署在企業端的通用句連一次 `/aiso`，錨點用頁面 title「AISO 主權 AI 解決方案」，不放在引用 `fact:aiso-no-token-limit` 的句子。初稿擔心的是讀者把事實的出處讀成 `/aiso`，連結放在不引用事實的通用句就避開了；第 6 段的主題本來就是部署形式，連過去讀者得到的是延伸的部署方案，錨點寫得出目的地。`relatedOfferings` 不加 `zh-TW/aiso` |
| 5 | 本文跟 6 篇既有 AI 文章的子題相鄰，可能互搶查詢；`what-is-ai-agent-management-platform` 的 title 也有「企業導入」「落地步驟」 | 本文當總覽，每個子題一段後連到深入的那篇；不定義 Agent，不重寫既有段落 | 見「和既有文章的差別」。`home.md`「三件待決事項」第 1 項已判斷那篇範圍較窄，不拿它承接 `企業 AI 導入` | 同意。補三點：一、本文的 title 與 h2 不用「AI Agent」與「落地」，跟那篇的 title 在搜尋結果上看得出範圍不同（「搜尋意圖」）；二、本文填 `category: ai` 後，模板會在同分類其他文章的文末「相關文章」列出本文，不改既有文章也已經有連入；三、`/blog/ai-infrastructure-operations-governance` 不從內文連（「內部連結」的不連頁面表）。既有文章連回本文列為可選的後續事項（「內部連結」的連入），不在本 issue 改 | 採納。title 與 h2 不用「AI Agent」「落地」；不連 `/blog/ai-infrastructure-operations-governance`；既有文章連回本文列在「延伸事項」第 3 項 |
| 6 | SEO 或業務可能希望加一段「OrientAI 介紹」或產品比較 | 不加。產品只出現在第 6–8 段，每句引用事實，回答前幾名都沒有的子題 | issue 要求文章是資訊型、不寫成產品頁；產品介紹由 `/orient-ai` 承接 | 同意。前幾名是中立的指南，本文加產品介紹段，會從資訊型變成產品頁，查導入步驟的讀者會跳出。產品出現在第 6–8 段，剛好是前幾名都沒有的三個子題，那裡的產品句是在回答問題 | 採納。不加產品介紹段與比較 |
| 7 | 要不要加 FAQ 段 | 不加 | 第 2–8 段已回答共同子題；`digirunner.md`「取捨」第 4 項記錄 FAQ 複合式結果只對知名政府與醫療網站顯示 | 同意不加。理由同 `digirunner.md`「取捨」第 4 項；blog schema 也沒有 `faq` 欄位。第 6、7 段的 h2 寫成讀者的問題（「搜尋意圖」），已經有 FAQ 想達到的效果 | 採納。不加 FAQ 段 |
| 8 | 主要 CTA 用「聯絡業務」還是 OrientAI 頁的「預約演示」 | 聯絡業務 | 主要轉換是聯絡業務（`audience-and-goals.md`）；本文橫跨多個產品與導入服務，讀者還沒選定產品 | 同意聯絡業務。補一點：第 9 段有聯絡業務與 OrientAI 兩個連結，聯絡業務放前面、自成一句，讀者讀到的第一個連結是主要動作 | 採納。主要 CTA 是聯絡業務，第 9 段第一個連結，自成一句；OrientAI 在後 |
| 9 | `tags` 要不要加 `ai-application` | `[ai-solutions]`，要不要加交 seo-strategist（「文章設定」） | 同分類的 2026 年文章多用 `ai-application` | 建議改成 `[ai-application]`。zh-TW 的 `category: ai` 文章（8 篇）都只用 `ai-application`，沒有一篇用 `ai-solutions`。tag 沒有自己的列表頁，只顯示在文章頁並輸出成 JSON-LD 的 `keywords`（`content-model.md`），對搜尋的影響很小，所以這裡以跟同分類一致為準。兩個都加也可以，不影響其他頁 | 採納，`tags: [ai-application]`，不加 `ai-solutions`。只加一個：同分類沒有文章用 `ai-solutions`，多加一個 tag 只多一個沒有其他文章共用的 `keywords`，讀者與搜尋都得不到東西。「文章設定」已改 |
| 10 | `/products/systalk-ai`（`family-ai` hub）要不要把本文列進 `featuredPosts` | 交 seo-strategist（「內部連結」初稿的連入表） | hub schema 有 `featuredPosts` | 建議加，列為後續事項，不在本 issue 改：本文第 8 段引用的事實出自這個 hub，也從第 8 段連過去，hub 列回本文，兩頁互連。`family-ai` 現在沒有 `featuredPosts`，加了之後 `HubTemplate.astro` 會多出「相關文章」一段，是改既有頁面，不是 `relatedOfferings` 的反查（hub 不是 offering），所以另開 issue 或由主 session 決定 | 採納，建議加，不在本 issue 改，列在「延伸事項」第 1 項。本文第 8 段的事實出自這個 hub，第 8 段也連過去，hub 列回本文，讀者兩個方向都走得通 |
| 11 | 第 6、9 段都連 `/orient-ai` | 兩處用同一個錨點「認識 OrientAI 企業級 Agentic AI 平台」（「CTA」次要列） | 節點名，首頁第 4 段同一個錨點 | 兩處都連，錨點分開寫：第 6 段寫讀者到 OrientAI 頁要看的內容（「OrientAI 的地端部署與治理層」，對應這段引用的 `fact:orientai-on-prem-data`、`fact:orientai-governance-layer`），第 9 段維持節點名。同一個錨點連同一頁兩次，第二次沒有多給資訊（`digirunner.md`「內部連結」第 6 段同樣的規則） | 採納。第 6 段段末錨點「OrientAI 的地端部署與治理層」，第 9 段錨點「認識 OrientAI 企業級 Agentic AI 平台」。第 6 段的錨點只寫這段引用的兩則 OrientAI 事實講的內容，不寫雲地部署（「待確認」第 3 項）。CTA 表與段落表已改 |
| 12 | `/industries/finance` 要不要把本文列進 `featuredPosts` | `finance.md`「取捨」第 5 項：先不放，等金融業 AI 的文章寫好再放 | 有對應搜尋子題的 2026 年文章才放；`/blog/customer-complaint-ai-tool-selection-guide` 沒放，因為它介紹金融頁沒提的 SysTalk.Audit | 可選，交 content-strategist 依 `finance.md`「取捨」第 5 項判斷，列為後續事項。支持放的理由：第 6、7 段回答 `金融業 AI 應用` 前幾名都沒有的兩項，符合那項的條件。不支持的理由：本文也介紹 OrientAI、SysTalk.VIKI，金融頁沒提，跟客訴文章被拒的理由相同。我傾向放：本文的主題是導入流程，不是單一產品，產品只出現在回答子題的段落 | 建議放，但不在本 issue 改，先請使用者確認，列在「延伸事項」第 2 項。本文符合 `finance.md`「取捨」第 5 項的條件（第 6、7 段回答 `金融業 AI 應用` 前幾名都沒有的兩項）。客訴文章被拒，是因為整篇在介紹 SysTalk.Audit；本文的 OrientAI、SysTalk.VIKI 只出現在第 6 段，用來回答資料怎麼留在企業內，主題是導入流程，情況不同。只是這等於修改已核准的 `finance.md` 決定：要放，就在另開的 issue 一起把那項的條件改寫成「文章主題是導入流程或產業問題、產品只在回答子題的段落出現的可以放；整篇介紹金融頁沒提的產品的不放」 |

## 待確認

事實庫沒有、但文章想寫的內容。頁面不補、不寫成更強的說法：

| # | 事項 | 卡在哪 | 影響的段落 |
|---|---|---|---|
| 1 | AI 導入的 ROI、失敗比例等外部統計 | 事實庫只收現站來源；要收第三方調查（例如前幾名引用的報告），要先決定 `facts.yaml` 能不能有站外來源、怎麼記錄調查年份。`fact:orientai-benefits` 是 `to_confirm`，使用者已決定不用（#180） | 4 |
| 2 | 企業 AI 成熟度的調查數字 | `fact:aiso-cio-survey` 是 `to_confirm`，現站沒寫調查年份 | 2 |
| 3 | OrientAI 的部署方式 | `fact:orientai-execution-layer` 寫「支援雲地靈活部署架構」，`fact:orientai-on-prem-data` 寫「只會部署於企業端」，兩則都出自現站 OrientAI 頁。本文第 6 段照後者寫，不用前者；要請內容負責人確認哪個是現況 | 6 |
| 4 | 台灣金融業與政府的 AI 使用規範（例如主管機關發布的 AI 指引） | 事實庫沒有這類規範的事實，也沒有昕力產品對應規範的事實。第 6、7 段不點名任何規範，只寫「監管要求」這個事實原文用到的詞 | 6、7 |
| 5 | `fact:digirunner-ai-usage-log` 的原文缺字 | 原文「完整錄所有AI使用歷程」少了「記」字。事實的字不能改，製作階段照原文引用；要修正得由內容負責人確認現站改了之後，重跑 `node scripts/strategy/extract-facts.mjs` | 7 |
| 6 | 昕力 AI 導入的具名案例 | 已確認的 AI 成果（`DM-2` 的理賠、建檔）講的是單一作業的成果，不是「企業導入 AI 的流程」；本文不放案例段。若要在第 8 段加一則導入案例，需要寫出導入過程的事實 | 8 |

## 延伸事項

本 issue 不做、要另開 issue 或由主 session 決定的事：

| # | 事項 | 為什麼不在本 issue 做 |
|---|---|---|
| 1 | `/products/systalk-ai`（`family-ai` hub）加 `featuredPosts`，列入本文 | 改既有頁面，`HubTemplate.astro` 會多出「相關文章」一段（「取捨」第 10 項） |
| 2 | `/industries/finance` 的 `featuredPosts` 列入本文，並改寫 `finance.md`「取捨」第 5 項的條件 | 要改已核准的金融頁決定，先請使用者確認（「取捨」第 12 項） |
| 3 | `/blog/what-is-ai-agent-management-platform`、`/blog/ai-token-cost-management` 加內文連結連回本文 | 可選。兩篇是從現站搬來的內文，加連結要依 `content-migration` 判斷（「內部連結」的連入） |
| 4 | `ArticleTemplate.astro` 加頁尾的 `ContactCta` | 影響所有 blog 頁與 `/templates/article` 的視覺回歸 baseline（「schema 缺口」） |
| 5 | researcher 補「AI 導入步驟」「AI 導入 金融業」「AI 治理框架」的搜尋觀察，再決定本文要不要列為次要承接 | `search-intent.md` 沒有這幾組的前幾名（「搜尋意圖」的「變化查詢不列為承接」） |
| 6 | en、vi 版本 | `site-profile.md`「語系」：先做 zh-TW |
