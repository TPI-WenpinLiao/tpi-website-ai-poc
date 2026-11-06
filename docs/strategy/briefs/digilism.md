# Content brief：DigiLism 產品家族頁 `/products/digilism`（#199）

- 模板：`hub`（產品家族 hub，節點 `family-dx`）；內容檔：`src/content/hub/zh-TW/family-dx.md`
- 主張 id 指 `docs/strategy/messaging.md`；事實的寫法見 `content-strategy` skill「引用事實的寫法」，只用 `docs/strategy/facts.yaml` 裡 zh-TW、`status: confirmed` 的條目
- 狀態：#199 策略階段。content-strategist 初稿，seo-strategist 補了「搜尋意圖」「內部連結」「title 與 description 方向」與「取捨」的意見欄、最後決定，之後等 `strategy-approved`

## 這頁從哪裡推出來

現站家族頁的 hero 說明、整合綜效 4 項、服務能力 5 項、5 張產品卡的說明都沒搬，新站只有「DigiLism 為何與眾不同？」6 項，其中「100 % SLA」那一項還沒確認（`unmigrated.md`「DigiLism 產品家族頁」）。

本 brief 從讀者在家族頁要回答的問題往回推：DigiLism 是什麼、由哪些產品組成、接不接得上核心系統、安全與維運怎麼做、撐不撐得住。

### 這頁的事實只用家族層級的

事實段只放 DigiLism 家族本身的事實，不把子頁（digiRunner、digiLogs 等產品頁）的事實搬上來；子頁用索引列連過去。本 brief 把「家族本頁的事實」定為：

| 來源 | 事實 | 在本頁 |
|---|---|---|
| 現站 `/products/digilism` | 22 筆，其中 19 筆 confirmed（含 5 張產品卡的說明 `digilism-family-*`） | 用 17 筆，不用 2 筆（取捨第 4 項） |
| 現站 `/products/digirunner`，但主詞是家族 | `digilism-patents-7`（「DigiLism 產品系列擁有7項發明專利」） | hero 的證據點，使用者決定當家族事實（#199，取捨第 2 項） |
| 現站 `/about-us` 的獎項，點名 digiRunner、digiLogs | `award-taiwan-excellence-2023`、`award-taiwan-excellence-2024`、`award-innovative-business-2022` | 第 7 段，使用者決定採用（#199，取捨第 2 項） |

## 受眾與任務

依 `docs/research/audience-and-goals.md`「受眾分群」：

| 受眾 | 來這頁做什麼 | 這頁要讓他做到的事 |
|---|---|---|
| 決策者（金融、保險業的 CIO、CTO），主要 | 了解 DigiLism 是什麼、由哪些產品組成；確認昕力的產品有外部評選；決定要不要聯絡業務或往下看單一產品 | 第一屏讀到 DigiLism 的類別（整合中台、iPaaS）與服務對象；一段寫家族涵蓋的面向；一列一個產品連到子頁；找得到聯絡業務 |
| IT 主管、專案負責人，主要 | 確認接得上核心系統與傳統 ESB、部署環境、驗身與日誌、高可用的機制 | 接上既有系統、驗身與日誌、尖峰與擴容各有一段寫機制 |

主要轉換：聯絡業務（`heroCta: contact`、模板的 `ContactCta`）。

## 搜尋意圖

依 `docs/strategy/search-intent.md`「DigiLism 產品家族 `/products/digilism`」，加上首頁一節的「企業數位轉型 軟體公司」。沒有 Search Console 數據，取捨只依受眾與頁面主題，不依搜尋量。hub 承接品牌詞與「整合中台」這一層的類別詞；單一產品的查詢由子頁承接。

### 這頁承接的查詢

| 查詢 | 意圖類型 | 承接 | `search-intent.md` 的條目 |
|---|---|---|---|
| `DigiLism` | 導航型，但前幾名被 Digitalism 樂團等無關主題佔滿 | 主要。前幾名缺的類別說明由 h1「DigiLism 企業服務中台」與第 1、2 段回答。title、h1、站內錨點都讓「DigiLism」跟類別詞一起出現（取捨第 5 項），同 digiRunner 跟「API 管理平台」並列的做法 | 「DigiLism」 |
| `DigiLism 昕力` | 導航型 | 主要。前幾名缺的「底下有哪些產品」由第 3 段回答，「專利與認證」由 hero 的專利數與第 7 段的獎項回答 | 「DigiLism 昕力」 |
| `企業服務中台` | 資訊型 | 主要（現站頁面標題就是這個詞）。前幾名缺的台灣廠商、「中台包含哪些模組」（第 2、5 段）、部署環境（第 4 段）、金融與保險的情境（第 2 段）都在本頁 | 「企業服務中台」 |
| `iPaaS 平台 台灣` | 商業型（找廠商） | 主要。前幾名缺的台灣廠商、可裝在地端或混合環境、金融保險的情境由 hero 證據點（`fact:digilism-ipaas`）回答，接傳統 ESB 由第 4 段回答 | 「iPaaS 平台 台灣」 |
| `ESB 替代 微服務 架構` | 資訊型 | 主要。前幾名全是英文；第 4 段寫核心銀行系統與大型主機的資料與通訊機制轉換、可代替 ESB，第 6 段寫可替代 ESB 的產品怎麼做高可用，都是前幾名缺的。ESB 的通用遷移步驟本頁不寫，建議交文章（「建議新增」） | 「ESB 替代 微服務 架構」 |
| `中台 是什麼 業務中台 技術中台` | 資訊型（定義） | 次要，沒有主要承接頁。本頁不寫定義；第 2 段（整合中台由哪些面向組成）與第 6 段（技術中台的微服務框架、前幾名缺的專利）回答一部分。定義建議交文章 | 「中台 是什麼 業務中台 技術中台」 |
| `銀行 核心系統 現代化 大型主機 微服務` | 資訊型 | 次要；主要 `/industries/finance`。第 4 段回答前幾名缺的「處理大型主機資料轉換與通訊機制的中介產品」「與傳統 ESB 的介接」，第 5 段回答「日誌集中與追查」 | 「銀行 核心系統 現代化 大型主機 微服務」 |
| `企業數位轉型 軟體公司` | 資訊型為主，帶商業型 | 次要，沒有主要承接頁（`home.md`「取捨」第 14 項）。「數位轉型」只出現在麵包屑與選單的節點名，title 不放（`messaging.md`「本站不用的字」） | 「企業數位轉型 軟體公司」（首頁一節） |

### 不由這頁承接的查詢

| 查詢 | 交給 | 理由 |
|---|---|---|
| `中台 是什麼 業務中台 技術中台`（主要）、ESB 的通用遷移步驟 | 建議新增的 blog 文章 | 定義與通用步驟不是昕力的事實；家族頁的每段要指到受眾任務 |
| `銀行 核心系統 現代化 大型主機 微服務`（主要） | `/industries/finance` | 產業詞由產業頁承接；本頁第 4 段連過去 |
| digiRunner、digiLogs 等單一產品的品牌與功能查詢 | 各產品頁 | 家族頁不搬子頁的事實；第 3 段用節點名連過去 |

## 這頁要讓讀者相信什麼

企業整合中台的各塊工作（API、日誌、資料庫、表單流程、醫療資料交換）在 DigiLism 裡各有產品，金融與保險業的服務應用中台由這些產品組成（`DM-13`）；它接得上核心銀行系統、大型主機與傳統 ESB，不必先汰換（`IT-4`），部署環境由企業決定（`IT-1`），驗身與日誌內建（`IT-2`、`IT-5`），尖峰與擴容有專利機制（`IT-3`）。

## 段落結構

順序照讀者在家族頁的判斷順序：是什麼、有哪些產品、接不接得上、安不安全、撐不撐得住，最後是外部評選。

「版型」欄照 `docs/strategy/design-principles.md`「內頁的版型」的 10 種，括號裡是 `src/content.config.ts` 的 `pageSection` 的 `layout` 值；索引列不是 `sections` 的 layout，寫出對應的欄位。「影像」欄照同一節「內頁共用的規則」：介面片段（`data-ui`、標「示意」）只畫事實寫得出的功能名稱、設定項目與狀態名稱。

| # | 段落 | 目的 | 依據（受眾任務／主張 id） | 搜尋子題 | 事實 | 預估長度 | 版型 | 影像 |
|---|---|---|---|---|---|---|---|---|
| 1 | Hero：DigiLism 是什麼、給誰 | h1 沿用 `title`「DigiLism 企業服務中台」（取捨第 5 項），上方不放小標，上層「產品」由麵包屑表示。tagline 寫對象與用途：金融與保險業的整合中台，接得上核心系統。說明句寫家族由哪些產品組成（API 管理、日誌、資料庫、流程），讓第一屏讀得出昕力賣什麼。兩則證據點，一個動作「聯絡業務」 | 決策者任務「確認這是不是我要找的產品」；`DM-13`、`IT-1`；主要轉換：聯絡業務 | `DigiLism`、`DigiLism 昕力`：前幾名缺的「DigiLism 是企業服務中台／iPaaS 產品系列」類別說明（品牌名撞名，產品名要跟類別詞一起出現）；`iPaaS 平台 台灣`：可以裝在地端或混合環境 | `fact:digilism-ipaas`、`fact:digilism-patents-7` | tagline 15–30 字；說明 40–60 字；證據點 2 則 | 第一屏（`tagline`、`heroLead`、`heroPoints`、`heroCta`） | 同一個世界渲染的靜態圖（新圖，檔名與構圖由設計概念階段決定，比照 `page-finance.webp`；取代現在的 `family-dx.webp`）。HTML 標籤只用事實寫得出的詞：核心銀行系統、大型主機、傳統 ESB（`fact:digilism-protocol-integration`、`fact:digilism-system-integration`）、DigiLism。不載 3D |
| 2 | API、日誌與大數據管理，組成整合中台 | 家族涵蓋的三個面向；基於 API 優先與雲原生架構；為 BFSI 全應用場景提供服務應用中台。「BFSI」第一次出現時在表述裡寫出是銀行、金融服務與保險（`DM-13` 寫法） | 決策者任務「了解產品與方案」；`DM-13` | `企業服務中台`：前幾名缺的「中台實際包含哪些模組」、金融與保險的使用情境；`iPaaS 平台 台灣`：金融、保險的適用情境；`DigiLism`：類別說明 | `fact:digilism-solution-areas`、`fact:digilism-api-first`、`fact:digilism-bfsi` | 說明句 30–50 字；事實 3 則 | 主張與原文（`claim`） | 無 |
| 3 | DigiLism 的產品 | 一列一個子頁：節點名稱、一句、連結。一句用家族頁現站產品卡的原文：digiRunner、digiMars、digiFlexis、digiCare 各一則；digiRunner 那一列放卡片原文的前後兩句（AI Gateway 與 MCP，AI 治理與流量控管），讓 `IT-6` 在家族頁有一處對應。digiLogs 只寫節點名稱，不放一句（`DM-13` 寫法，「待確認」第 1 項；#202 評審指出 digiLogs 頁的 description 不是事實，又有「一站式」，所以不借用）。互動式健康管理服務平台是否列出見「待確認」第 3 項 | 決策者任務「了解產品與方案」「往下看單一產品」；`DM-13`、`IT-6` | `DigiLism 昕力`：前幾名缺的「底下有哪些產品」 | `fact:digilism-family-digirunner`、`fact:digilism-family-digirunner-ai`、`fact:digilism-family-digimars`、`fact:digilism-family-digiflexis`、`fact:digilism-family-digicare` | 5 列，每列照原文 | 索引列（子頁卡片，需要「schema 缺口」第 1 列的欄位） | 無縮圖 |
| 4 | 接上核心系統與傳統 ESB，不必先汰換 | 核心銀行系統與過時大型機的資料轉換、通訊機制變更，可代替 ESB；介接大型企業的傳統 ESB，支援地端、雲端、雲地混合與多雲；弭平既有系統與現代化框架的差異 | IT 主管任務「確認接得上核心系統」；`IT-4`、`IT-1` | `ESB 替代 微服務 架構`：前幾名缺的中文內容、核心銀行系統與大型主機的資料與協定轉換；`銀行 核心系統 現代化 大型主機 微服務`：處理大型主機資料轉換與通訊機制的中介產品、與傳統 ESB 的介接（次要，主要在金融頁）；`iPaaS 平台 台灣`：接傳統 ESB 的做法 | `fact:digilism-protocol-integration`、`fact:digilism-system-integration`、`fact:digilism-compatibility` | 說明句 40–60 字；圖下事實 3 則 | 接點圖（`junction`） | SVG：左欄核心銀行系統、過時大型機、傳統 ESB（中性色，`fact:digilism-protocol-integration`、`fact:digilism-system-integration`）；中欄 DigiLism 的資料轉換與通訊機制變更（紫）；右欄現代化框架與新興技術（`fact:digilism-compatibility` 的用詞）。部署環境（地端、雲端、雲地混合、多雲）用圖下事實寫，不畫進圖 |
| 5 | 驗身、單一登入與日誌集中控管 | 多元身分驗證、訪問控制、資料加密、單一登入與組織階層管理整合在一起；各系統的日誌集中控管、即時監控告警，IT 人員查得到問題來源 | IT 主管任務「確認資安過得了關、上線後維運得動」；`IT-2`、`IT-5` | `企業服務中台`：前幾名缺的中台模組（身分驗證、日誌）；`銀行 核心系統 現代化 大型主機 微服務`：維運端的日誌集中與追查 | `fact:digilism-auth-module`、`fact:digilism-log-audit` | 說明句 30–50 字；片段旁事實 2 則 | 介面片段（`ui`） | 介面片段 1：驗證整合模組的設定面板，項目是多元身分驗證、訪問控制、資料加密、單一登入（SSO）、組織階層管理（`fact:digilism-auth-module`）。只畫項目名稱與開關狀態 |
| 6 | 尖峰流量與擴容有專利機制 | 一列一個機制：專利的背景服務運算處理（瞬間大量請求）、專利的運算資源調度、以 K8S 做高可用與自有的自動擴容專利。不寫 100% SLA（`IT-3` 寫法：DigiLism 的高可用只用這三筆） | IT 主管任務「確認上線後撐得住」；`IT-3` | `ESB 替代 微服務 架構`：ESB 成為瓶頸與單點故障、可替代 ESB 的產品的高可用做法；`中台 是什麼 業務中台 技術中台`：技術中台的微服務框架、前幾名缺的專利 | `fact:digilism-patent-background-processing`、`fact:digilism-patent-resource-scheduling`、`fact:digilism-microservice-framework` | 說明句 20–40 字；表 3 列 | 規格表（`spec`），`fill: subtle` | 段落圖（緞帶世界，新圖，h2 旁的最後 4 欄，375 寬不顯示） |
| 7 | 家族的產品經過外部評選 | 照原文列三個獎項，寫出年份與得獎產品；原文也點名 SysTalk 的產品，照原文引用，不刪字。標題與說明句不用「最佳」（`DM-8` 寫法） | 決策者任務「確認產品有昕力以外的說法」；`DM-8` | `DigiLism 昕力`：前幾名缺的專利與認證（次要） | `fact:award-taiwan-excellence-2023`、`fact:award-taiwan-excellence-2024`、`fact:award-innovative-business-2022` | 說明句 20–30 字；事實 3 則 | 主張與原文（`claim`） | 無 |
| 8 | 聯絡業務 | 頁尾的主要轉換，標題寫下一步（談整合中台與核心系統的串接） | 主要轉換：聯絡業務 | — | 無 | 沿用模板的 `ContactCta` | 色帶，深紫 | 無 |

第 2、4、5、6、7 段是事實段，共 5 段；第 3 段是索引列，不算事實段。介面片段 1 張（第 5 段），見「取捨」第 7 項。相鄰兩段的版型都不同；主張與原文 2 次（第 2、7 段，不相鄰）。段落圖 1 張（第 6 段）。

### 照原文列清單的段落

- 第 4 段：`fact:digilism-system-integration` 是一串名詞（DevOps 與 CI/CD、API 管理、BPM、日誌管理、部署環境、ESB），製作階段照 `.claude/skills/site-research/SKILL.md` 第 2 條在 `scripts/strategy/facts-source.yaml` 拆成每行一項，重跑 `node scripts/strategy/extract-facts.mjs`
- 第 3 段的每一句照原文，不加長、不合併成「多項產品」的概括
- 說明句寫讀者得到什麼，不寫「以下列出」

### 不能寫的句子

| 段落 | 不能寫 | 為什麼 | 改寫的方向 |
|---|---|---|---|
| 6 | 「100 % SLA」「確保 100% 符合服務水平協議」 | 沒有依據（「待確認」第 2 項）；現在的內容檔有一項 highlight 就叫「100 % SLA」 | 只寫三個專利機制的原文 |
| 3 | 「digiLogs 以業界唯一的鏈路追蹤技術……」 | 最高級說法還沒確認（「待確認」第 1 項） | 只寫節點名稱，說明交給 digiLogs 產品頁 |
| 4 | 「已協助某銀行完成核心系統現代化」 | 事實庫沒有 DigiLism 的銀行核心案例（「待確認」第 4 項） | 只寫機制 |
| 1、2 | 表述把「數位轉型」當主張 | `messaging.md`「本站不用的字」：只當家族名稱與搜尋詞 | 寫整合中台做什麼 |
| 7 | 標題「屢獲最佳獎項肯定」 | `DM-8` 寫法：不合併成「屢獲大獎」，「最佳」只出現在引用 `fact:award-innovative-business-2022` 的地方 | 標題寫有外部單位的評選，獎名照原文列 |

### 與現有頁面的差異

對照現在的 `src/content/hub/zh-TW/family-dx.md`：

| 現有 | 處理 | 理由 |
|---|---|---|
| tagline「專為關鍵應用設計的高可用性數位中台」 | 改寫成寫出對象與用途的一句 | 沒說出給誰、由什麼組成 |
| highlights 6 項（「DigiLism 為何與眾不同？」） | 改成 `sections`：微服務開發框架併入第 6 段；驗證整合模組、日誌及稽核管理併入第 5 段；API 管理模組併入第 2 段；通訊協定整合併入第 4 段；「100 % SLA」刪除 | 「100 % SLA」沒有依據；其他 5 項各併進回答同一個問題的段落 |
| highlights 的「驗證整合模組」多了「符合企業用戶管理需求，有效保護企業資料安全性」，「日誌及稽核管理」「通訊協定整合」也多了後半句 | 只用事實原文 | 多出的句子不在事實庫 |
| 子頁卡片的文字是各 offering 的 description | digiRunner、digiMars、digiFlexis、digiCare 改用家族頁現站產品卡的原文；digiLogs 維持 description | `DM-13` 的證據是家族頁的產品卡原文 |
| 現站沒搬的 hero 說明（BFSI）、整合綜效 4 項、5 張產品卡的說明（`unmigrated.md`） | BFSI 放第 2 段；整合綜效裡的新舊兼容放第 4 段、兩個專利機制放第 6 段；產品卡放第 3 段 | 各對應一個受眾任務或主張 |
| 現站的服務能力 5 項 | 不放 | 見「取捨」第 4 項 |
| 現站的 IDC 報告下載 | 不放 | 只有表單說明，沒有報告結論，不在事實庫 |
| 內容檔沒有 `facts` 欄位 | 補 `facts: [...]` | 讓 `facts.mjs` 檢查這頁 |

## CTA

| CTA | 文案方向 | 位置 | 連到 |
|---|---|---|---|
| 主要：聯絡業務 | 按鈕寫「聯絡業務」（全站同名，`messaging.md`「統一用詞」）；第 8 段標題談整合中台與核心系統的串接 | 第 1 段 hero（實心按鈕，`heroCta: contact`）、第 8 段（模板的 `ContactCta`） | `/contact-us`（`contact`） |
| 次要：看單一產品 | 用節點名稱，不寫「了解更多」 | 第 3 段的索引列 | 各子頁（`digirunner`、`digilogs`、`digimars`、`digiflexis`、`digicare`） |

## 內部連結

路徑取 `docs/ia/nodes.csv`，只列會產生頁面的節點。錨點文字寫目的地是什麼，不用「了解更多」；子頁的錨點用節點名，節點名本身寫出類別（「API 管理平台」「集中化日誌管理平台」）。麵包屑沿 `parent` 連到 `/products`，模板產生，不必另寫。

### 連出

| 段落 | 連到 | 建議錨點文字 | 說明 |
|---|---|---|---|
| 1、8 | `/contact-us` | 聯絡業務 | 主要轉換，全站同名 |
| 3 | `/products/digirunner` | digiRunner API 管理平台 | 節點名，帶類別詞（單寫「digiRunner」跟同名遊戲撞名，`digirunner.md`「取捨」第 6 項） |
| 3 | `/products/digilogs` | digiLogs 集中化日誌管理平台 | 節點名。這一列只有節點名與 digiLogs 頁的 description（取捨第 3 項） |
| 3 | `/products/digimars` | digiMars 大數據管理平台 | 節點名 |
| 3 | `/products/digiflexis` | digiFlexis 企業流程管理平台 | 節點名 |
| 3 | `/products/digicare` | digiCare 智慧醫療服務 | 節點名 |
| 3 | `/solutions/interactivehealth` | 節點名 | 是否列出見「待確認」第 3 項 |
| 4 | `/industries/finance` | 金融業如何接上核心銀行系統 | `銀行 核心系統 現代化 大型主機 微服務` 的主要承接頁。金融頁第 3 段已用「DigiLism：核心銀行系統與大型主機的串接」連過來，加上這個連結兩頁互指。放在第 4 段的 `link`（`pageSection` 已有欄位）。這是 seo-strategist 加的連出，見取捨第 10 項 |

### 連入

| 從 | 建議錨點文字 | 狀態 |
|---|---|---|
| header「產品」選單的欄標題、footer「產品」、`/products` 的子頁卡片 | 節點名「數位轉型（DigiLism）」 | 已有 |
| 子節點的麵包屑（digiRunner、digiLogs、digiMars、digiFlexis、digiCare） | 節點名 | 已有（模板產生） |
| `/industries/finance` 第 3 段 | DigiLism：核心銀行系統與大型主機的串接 | 金融頁 brief 已列 |
| `/products/digirunner` 第 2 段 | DigiLism 數位轉型產品家族 | digiRunner brief 已列 |
| 首頁 | — | 5 段版不連家族頁（`home.md`「內部連結」），不改 |

### 建議新增

| 頁面 | 位置 | 理由 |
|---|---|---|
| 中台與 ESB 的 blog 文章 | `/blog/{slug}`（新的 `blog-post`，分類建議 `blog-digital-transformation`） | 承接 `中台 是什麼 業務中台 技術中台` 與 `ESB 替代 微服務 架構` 的通用部分（中台的由來與分類、ESB 漸進遷移）。前幾名是簡中與英文，繁中有缺口。昕力的部分只用本頁已確認的事實（`fact:digilism-protocol-integration`、`fact:digilism-microservice-framework` 等），文末連到本頁。本頁是 hub，文章的 `relatedOfferings` 指不到這裡，改用內文連結；文章寫好後再決定要不要放進本頁的 `featuredPosts`（取捨第 6 項）。另開 issue |

## title 與 description 方向

規則照 `seo-checklist`「每頁必備」：zh-TW title 約 20–32 個全形字（含後綴「｜TPIsoftware 昕力資訊」，後綴約佔 11 字），description 約 60–80 個全形字；半形英數約算半個全形字。

### title

- 頁面主題 `title`「DigiLism 企業服務中台」加後綴約 21.5 字，符合規則，h1 沿用（取捨第 5 項）。建議用 `seoTitle` 加上「iPaaS 整合平台」，補 `iPaaS 平台 台灣` 的用詞
- 要涵蓋：「DigiLism」與「企業服務中台」並列（撞名）、「iPaaS」
- 傳達的主張：`DM-13`、`IT-1`。「iPaaS」「整合平台」出自 `fact:digilism-ipaas` 的「應用整合服務平台（iPaaS）」
- 不放：「數位轉型」（`messaging.md`「本站不用的字」）、「ESB」（title 放不下，寫進 description）、「100% SLA」、子產品名稱（digiRunner 等是產品頁的詞）、「金融」（金融頁的詞）
- 示例（含後綴）：
  - `DigiLism 企業服務中台：iPaaS 整合平台｜TPIsoftware 昕力資訊`（約 29.5 字）
  - `DigiLism 企業服務中台｜TPIsoftware 昕力資訊`（不加 `seoTitle` 的做法，約 21.5 字）

### description

- 要涵蓋：企業服務中台或 iPaaS、組成的產品面向（API、日誌、大數據）、可代替 ESB、核心銀行系統與大型主機、部署環境、銀行與保險
- 傳達的主張：`DM-13`、`IT-4`、`IT-1`，有餘裕時帶 `IT-2` 或 `IT-3`
- 依據的事實：`fact:digilism-ipaas`、`fact:digilism-solution-areas`、`fact:digilism-protocol-integration`、`fact:digilism-system-integration`、`fact:digilism-bfsi`、`fact:digilism-auth-module`、`fact:digilism-log-audit`、`fact:digilism-patent-background-processing`
- 不寫：「100% SLA」、「業界唯一」、DigiLism 的銀行核心案例（「待確認」第 4 項）、把「數位轉型」當主張
- 現行 description 改寫自 `fact:digilism-system-integration`，沒寫「中台」「iPaaS」與服務對象，後半句「達到資料串流與服務整合」不在原文，要重寫
- 示例：
  - `DigiLism 是昕力資訊的企業服務中台，由 API 管理、日誌與大數據管理等產品組成，可代替 ESB 處理核心銀行系統與大型主機的資料轉換，支援地端、雲端與混合雲部署。`
  - `DigiLism 企業服務中台為銀行、金融服務與保險業提供服務應用中台：介接傳統 ESB 與核心系統，內建身分驗證、單一登入與日誌集中控管，以專利機制處理尖峰流量。`

## schema 缺口

hub schema（`src/content.config.ts`）已有 `heroLead`、`heroPoints`、`heroCta`、`heroLabels`、`sections`（`claim`、`junction`、`ui`、`spec` 都有）。

| 段落 | 缺什麼 | 新增的欄位 | 型別 |
|---|---|---|---|
| 3 | 子頁卡片的一句固定讀各 offering 的 description，放不進家族頁的產品卡原文；也不能選擇不列哪個子頁（互動式健康管理服務平台，「待確認」第 3 項） | `children`：子頁卡片的順序與一句 | `{ node: string; body?: string }[]`，`node` 限本 hub 的子節點，`body` 是事實原文，沒填時用該 offering 的 description（digiLogs 那一列不填）。沒有這個欄位時照現在的行為列出全部子節點。`hasPart` 不受影響，仍列全部子節點（`briefs/finance.md`「schema 缺口」JSON-LD 那一列的規則） |
| 3 | 替代做法 | 不加 `children`，改在第 2 段（`claim`）加 `index`，形狀同 `ui` 的 `index`（`{ body?: string; node: string }[]`） | 選哪個由主 session 依 `HubTemplate` 決定；brief 只要求第 3 段的一句放得下家族頁的原文 |
| 3 | #202 的做法 | 不加 `children`：第 3 段用既有的 `index` 版型（每列 `node` 加選填 `body`），digiLogs 那一列不填 `body`、只有節點名；不列的子頁用 hub 的 `omitParts`（互動式健康管理服務平台），`hasPart` 仍列全部子節點 | — |
| 全頁 | 內容檔沒有 `facts` 欄位 | 補 `facts`（共用欄位已有） | — |
| 全頁 | `highlights` 不再使用 | 不是 schema 缺口：改用 `sections`，刪掉 `highlights` | — |
| 4 | `fact:digilism-system-integration` 是一串名詞 | 不是 schema 缺口：照「照原文列清單的段落」拆 `text` | — |

## 取捨

第 1–9 項是 content-strategist 寫的，第 10 項是 seo-strategist 加的。seo-strategist 填了意見欄後定案；第 2 項由使用者決定採用（#199，PR #204 的回覆），第 7、9 項交設計概念階段。

| # | 可能的衝突 | content-strategist 的立場 | 理由 | seo-strategist 的意見 | 最後決定 |
|---|---|---|---|---|---|
| 1 | 段數 | 5 個事實段，加 hero、產品索引列、聯絡色帶共 8 段 | 家族本頁的 confirmed 事實 19 則，加上主詞是家族的專利數 1 則、點名家族產品的獎項 3 則，共 23 則，用 21 則：hero 2、整合中台 3、產品索引列 5、接上既有系統 3、驗身與日誌 2、尖峰與擴容 3、外部評選 3。事實段每段 2–3 則。子頁的事實（例如 digiLogs、digiMars 的案例）不上來，所以不設案例段 | 同意。8 組查詢的子題都對得到第 1–7 段（段落表「搜尋子題」欄）；單一產品的查詢由子頁承接，家族頁不必為它們加段 | 8 段 |
| 2 | 哪些事實算「家族本頁的事實」 | 現站家族頁的 19 則 confirmed 都算；`fact:digilism-patents-7` 出自 digiRunner 頁，但主詞是 DigiLism 產品系列，算家族的事實，放 hero；3 則獎項出自關於我們頁，點名 digiRunner、digiLogs，放第 7 段 | 獎項不是從子頁搬來的，`messaging.md` `DM-8` 也指定家族頁引用點名 digiRunner、digiLogs 的獎。但獎項的主詞是單一產品，可能被讀成子頁的事實。使用者若認為不算，刪掉第 7 段，事實段剩 4 段，不影響其他段落 | 從 SEO 看保留比較好：`DigiLism 昕力` 的前幾名缺專利與認證；台灣精品獎的英文頁還用舊名 DigiFusion，本頁寫出 2023、2024 台灣精品獎與得獎產品名，品牌詞跟獎項就連在一起。但獎項算不算「家族本頁的事實」是使用者規則的解讀，SEO 不能代為決定；刪掉第 7 段，hero 的專利數仍回答「專利」這個子題，承接不受影響 | 使用者決定採用（#199，PR #204 的回覆）：不是本頁來源頁的獎項可以放，保留第 7 段；`fact:digilism-patents-7` 當家族事實，放 hero |
| 3 | 產品卡的一句用家族頁原文還是各 offering 的 description | 用家族頁原文，digiLogs 例外 | `DM-13` 的證據是家族頁的 5 張產品卡；子頁的 description 是子頁的文案，會在子頁改寫（#188 之後），不是家族的事實。digiLogs 的家族頁原文含「業界唯一」，照 `DM-13` 寫法只寫節點名稱，說明交給子頁卡片 | 同意。連結的錨點仍用節點名（「內部連結」第 3 段），原文是連結旁的一句；digiRunner 那一列的 AI Gateway、MCP 原文也讓家族頁有 AI 的用詞（第 8 項） | 用家族頁原文，digiLogs 例外；需要「schema 缺口」第 1 列 |
| 4 | 兩則 confirmed 事實不用 | 不用 `fact:digilism-five-capabilities` 與 `fact:digilism-patent-load-balancing` | 服務能力 5 項是第 4–6 段的概括（「核身授權及多種機制式全盤防護安全」），放進來會讓讀者讀兩次同樣的事，卻沒有機制；`search-intent.md`「企業服務中台」列了它，但「中台包含哪些模組」已由第 2、5 段回答。`fact:digilism-patent-load-balancing` 是確認過的專利說法，但 `IT-3` 寫法規定 DigiLism 的高可用只用三筆，它不在其中；要用得先改 messaging | 同意。`企業服務中台` 前幾名缺的「中台包含哪些模組」由第 2、5 段的機制回答，比服務能力 5 項的概括說得具體；`ESB 替代 微服務 架構` 的高可用子題由第 6 段的三筆回答，不缺負載平衡那一筆 | 不用 |
| 5 | h1 用節點名「數位轉型（DigiLism）」還是 `title`「DigiLism 企業服務中台」 | 用 `title` | 「DigiLism」單獨查會撞名（`search-intent.md`「DigiLism」），產品名要跟類別詞一起出現，比照 digiRunner 頁的「digiRunner API 管理平台」；「數位轉型」只當家族名稱，不當主張（`messaging.md`「本站不用的字」）。選單與麵包屑仍用節點名 | 同意。h1「DigiLism 企業服務中台」同時承接 `DigiLism` 的類別說明與 `企業服務中台`；title 用 `seoTitle` 再加「iPaaS 整合平台」（「title 與 description 方向」）。節點名「數位轉型（DigiLism）」的括號寫法不適合當 h1 或 title | h1 用 `title`「DigiLism 企業服務中台」；title 用 `seoTitle` |
| 6 | 要不要放案例與相關文章 | 都不放 | DigiLism 的案例都是單一產品的（例如 digiLogs 的案例頁），屬於子頁；家族層級沒有案例事實（「待確認」第 4 項）。2026 年的文章沒有寫 DigiLism 家族的；醫療的數據中台文章屬於 digiCare。要不要加 `featuredPosts` 由 seo-strategist 決定 | 同意都不放。現有文章沒有一篇回答家族層級的查詢：`/blog/healthcare-fhir-data-platform-7-steps` 屬於 digiCare，`/blog/what-is-api-gateway`、`/blog/enterprise-grade-apim` 屬於 digiRunner，放進來只是把子頁的延伸閱讀搬到家族頁。建議另寫中台與 ESB 的文章（「建議新增」），寫好後再考慮 `featuredPosts` | 都不放；文章寫好後再決定 `featuredPosts` |
| 7 | 介面片段只有 1 張，不到「內頁共用的規則」的至少 4 張 | 不補 | 家族本頁的事實寫得出設定項目的只有 `fact:digilism-auth-module`。日誌、專利機制、整合面向都不是介面；產品的介面屬於子頁。第 4 段用接點圖、第 6 段用規格表，每個事實段仍有圖或表 | 對搜尋沒有影響。第 4 段接點圖的節點名稱（核心銀行系統、大型主機、傳統 ESB）要是 HTML 文字，`ESB 替代 微服務 架構` 的用詞才讀得到 | 1 張，交設計概念階段 |
| 8 | `IT-6`（AI 走同一道 Gateway）要不要單獨成段 | 不單獨成段，放在第 3 段 digiRunner 那一列 | 家族頁的 AI 事實只有 digiRunner 產品卡的兩句，單獨成段只有 2 則、都在講一個子產品；細節在 digiRunner 產品頁 | 同意。AI Gateway 的查詢由 digiRunner 產品頁承接，家族頁單獨成段會跟產品頁搶同一組詞；放在第 3 段那一列，錨點「digiRunner API 管理平台」把讀者送到細節 | 不單獨成段 |
| 9 | 原則沒寫到的呈現方式 | 列出供設計概念階段確認 | 一、hero 圖是新圖，取代 `family-dx.webp`；二、第 3 段的索引列放在事實段之間（原則的索引列寫「次要段落」，這頁的產品索引是家族頁的主要入口），標題用 `--font-size-h2` 還是 `--font-size-text` 交設計概念階段 | 第二點的 SEO 意見：字級交設計，但 heading 層級用 h2。第 3 段是家族頁的主要入口，h2「DigiLism 的產品」讓 `DigiLism 昕力` 的子題「底下有哪些產品」在標題層級就讀得到；字級小不影響，heading 不能因為字小就改成非 heading 或跳級 | 交設計概念階段；heading 層級用 h2 |
| 10 | 第 4 段要不要連到 `/industries/finance` | 沒有提（CTA 表只列聯絡業務與子頁） | — | 連，錨點「金融業如何接上核心銀行系統」。`銀行 核心系統 現代化 大型主機 微服務` 由金融頁主要承接，本頁第 4 段是次要；金融頁第 3 段已連過來，兩頁互指，讀者從哪一頁進來都找得到另一頁。這不是轉換，不加進 CTA 表，寫在「內部連結」 | 定案：加這個連出 |

## 待確認

事實庫沒有這些內容，頁面不補、不寫成更強的說法：

| # | 事項 | 卡在哪 | 影響的段落 |
|---|---|---|---|
| 1 | digiLogs 在家族頁的說明 | `fact:digilism-family-digilogs` 含「業界唯一」（`messaging.md`「缺少證據的主張」第 22 項） | 3 |
| 2 | DigiLism 的 100% SLA | `fact:digilism-sla-100`、`fact:digilism-patent-sla` 沒有依據（第 22 項） | 6 |
| 3 | 互動式健康管理服務平台是否仍在銷售 | `nodes.csv` 的 `interactivehealth` 寫「待確認：不在導覽，是否仍銷售」；確認前第 3 段要不要列它由使用者決定 | 3 |
| 4 | DigiLism 的銀行核心系統案例 | `search-intent.md`「銀行 核心系統 現代化 大型主機 微服務」：昕力的銀行核心案例不在 DigiLism 的事實裡 | 4 |
| 5 | DigiLism 獲第 29 屆中小企業創新研究獎 | `fact:award-sbir-29` 沒寫年份；寫得出年份的 `fact:award-sbir-2022` 沒寫得獎的產品（`messaging.md` `DM-8`「沒收進這條的有年份獎項」） | 7 |
| 6 | `fact:cert-iso27001-product-platform` 的「企業產品中台」是否就是 DigiLism | 原文沒寫產品名，本頁不引用 | 5 |
| 7 | 舊名 DigiFusion 的改名經過 | `search-intent.md`「DigiLism 昕力」：台灣精品獎英文頁用舊名，事實庫沒有改名的原文 | — |

## 後續

- en、vi 版另做，照 `content-migration` skill 的「多語系內容」，不在本 brief 範圍
