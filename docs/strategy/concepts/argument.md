# 首頁的清點與論點（#166）

> 第二輪的紀錄，之後沒有更新：第二輪的五個方向與 `sheet.md` 已刪除；品牌色在第三輪改為完整使用，「品牌紫只用在 logo 與主要 CTA」不再適用；第四輪起首頁改為 5 段，文字以 `copy-deck.md` 為準，選定的方向見 `ribbon-route/` 與 `design-principles.md` 開頭的「定案」。

`taste-skill` run 的第 1、2 步（`.claude/skills/taste-skill/SKILL.md`「1. Read the brief and the project」「2. Write the argument」），五個方向共用。清點是 idea 的來源（每個方向的 idea 句寫在 `<direction>/sheet.md` 開頭），論點決定首頁有哪些段落、什麼順序。文案在 [`copy-deck.md`](copy-deck.md)。

- 輸入：`docs/strategy/briefs/home.md`（段落結構）、`docs/strategy/messaging.md`（主張 id）、`docs/strategy/competitors.md`、`docs/strategy/facts.yaml`、`docs/design/brand-assets.md`
- 事實寫成反引號包住的 `fact:` 加事實 id，只用 `facts.yaml` 裡 `locale: zh-TW`、`status: confirmed` 的條目。`node scripts/strategy/facts.mjs` 不掃 `concepts/`，本檔的引用另用「檢查引用」的指令確認
- 清點只寫事實庫與品牌素材裡有的東西。taste-skill 建議找的名稱由來、街景、材料、天氣，事實庫沒有的就不寫

## 讀法

| 項目 | 本站的情況 |
|---|---|
| 主題 | 昕力資訊（TPIsoftware）：研發並導入自有軟體，替金融與政府把 API、資料與 AI 接進既有系統（messaging「定位」） |
| 讀者 | 金融、政府的決策者（CIO、CTO）與 IT 主管（brief「受眾與任務」）。他們知道 API 管理、開放銀行規範是什麼，不需要定義 |
| 要讀者做的一件事 | 聯絡業務（`/contact-us`） |
| 品牌 | logo（紫色 T 加灰色斜切塊）與品牌紫 `#662e8d`。沒有 VI 手冊（`site-profile.md`「限制」）。品牌紫只用在 logo 與主要 CTA（使用者決定，2026-11-01） |
| 真實存在的影像 | 沒有產品介面截圖、沒有公司自己的照片；`src/assets/design/` 只有抽象 3D 渲染。所以 `draw.mjs` 不帶 `--have`，sheet 會要求用 HTML 做的介面片段、開放圖庫的真實圖片與程式畫的物件 |

## 主題清點

12 項只屬於昕力的東西。每一項都不在 `competitors.md` 記錄的四家首頁上（SYSTEX、GSS、Syscom、FPT）。最後一欄是之後在開放圖庫找圖的查詢詞（第 3 階段跑 `assets.mjs`），找到的圖只呈現這個領域，不冒充昕力的產品、客戶或人物。

| # | 東西 | 依據 | 圖片查詢詞 |
|---|---|---|---|
| 1 | 公司名與 logo 符號：紫色 T 的右上大圓角，灰色塊的斜切頂邊與橢圓缺口 | `docs/design/brand-assets.md`「Logo」、`src/assets/brand/logo-symbol-color.svg`（品牌素材，不是事實） | 不找圖，用 logo 的幾何畫 |
| 2 | 台北總部的地址：內湖區瑞光路 | `fact:office-taipei-address` | `Neihu Technology Park Taipei`、`Ruiguang Road Neihu`、`Neihu District aerial` |
| 3 | 據點清單：台北總部、新加坡、越南、日本，以及新竹、台中的專案管理中心與台南、高雄的開發中心；新加坡辦公室在 Marina One East Tower | `fact:office-names`、`fact:office-singapore-address`、`fact:office-vietnam-address`、`fact:office-japan-address` | `Marina One Singapore`、`Ho Chi Minh City District 10`、`Taiwan map` |
| 4 | 年份紀錄：2005 創立、2008 首度跨足金融（華南銀行 CRM）、2011 第一個產品 TPRS 推薦系統、2017 與 2019 設新加坡與越南子公司、2020 以 TPIsoftware 品牌邁入國際 | `fact:company-founded`、`fact:company-milestone-2008-finance`、`fact:company-milestone-2011-tprs`、`fact:company-subsidiaries-sg-vn`、`fact:company-milestone-2020-brand` | 不找圖，排成年份紀錄 |
| 5 | 產品對應的規範文件：金管會的開放銀行法規、三階段開放銀行規範、國發會【共通性應用程式介面規範】 | `fact:digirunner-open-banking-fsc`、`fact:digirunner-open-banking-3-stages`、`fact:digirunner-ndc-spec` | `Financial Supervisory Commission Taiwan`、`National Development Council Taiwan`、`government gazette document` |
| 6 | 金融檢查的 API 管理作業清單（交易限制、定期盤點、服務憑證管理、OAuth 2.0 等 9 項） | `fact:digirunner-financial-inspection` | 不找圖，清單本身就是畫面上的物件 |
| 7 | AI 讀的文件：診斷書、醫療單據 | `fact:smartclaim-result`、`fact:smartfilling-result`、`fact:smartclaim-case-medical-documents` | `medical certificate document`、`hospital receipt archive`、`insurance claim form historical` |
| 8 | 被接進來的既有系統：核心銀行系統、過時的大型主機、企業服務匯流排（ESB）、既有的 WAF（F5、No Name Security） | `fact:digilism-protocol-integration`、`fact:digirunner-nginx-waf` | `IBM mainframe`、`mainframe computer room archive`、`bank data center` |
| 9 | 具名案例：臺北市政府的 API 管理平台與管理制度、台新銀行的現金管理業務模組 | `fact:digirunner-case-taipei-city`、`fact:digirunner-case-taishin` | `Taipei City Hall`（只當場域，不當客戶的畫面） |
| 10 | 限制：OrientAI 只部署在企業端；搭配群聯 aiDAPTIV，地端架構離線仍可運行 | `fact:orientai-on-prem-data`、`fact:orientai-aidaptiv` | `server rack`、`on-premises server room` |
| 11 | 帶條件的規格：4 Core CPU／8GB RAM 的 digiRunner 每秒交易量 300–1000 TPS，實際取決於環境配置 | `fact:digirunner-tps` | 不找圖，規格與條件一起排 |
| 12 | 導入的順序：導入前（情境分析、解決方案搭配建議、效益評估、AI 服務導入），導入中（模型評估、微調） | `fact:systalk-ai-onboarding` | 不找圖，順序本身是版面 |

清點沒有收的東西：

- 公司名稱的由來、創辦人：事實庫沒有 `confirmed` 的條目（創辦人的條目 `company-founder` 是 `to_confirm`）
- 員工數、專案數、獎項：`to_confirm`（messaging「缺少證據的主張」第 2、3 項）
- 總部大樓的外觀、內湖的街景：事實庫只有地址。開放圖庫的內湖照片只能當「公司所在的城市」，不能當成昕力的辦公室

## 論點

先回答 `references/copy.md` §1 的五個問題：

| 問題 | 回答 |
|---|---|
| 誰在讀，他已經知道什麼 | 金融、政府的 CIO、CTO 與 IT 主管；知道 API 管理、開放銀行與政府 API 規範 |
| 這是什麼（像對朋友說） | 昕力自己做軟體，幫銀行、保險公司和政府單位把 API 與 AI 接進現在用的系統 |
| 看完一屏要相信什麼 | 這家是替金融與政府做的，接的是既有系統，不是要整套換掉 |
| 什麼讓他相信 | 規範文件的名稱、具名案例、案例成果的原文、公司的年份紀錄 |
| 下一步做什麼 | 聯絡業務 |

首頁每一段寫成「主張 → 證明」，順序照 `briefs/home.md`「段落結構」的 8 段（讀者的判斷順序：是不是為我做、做得到嗎、安不安心）。主張是表述；證明是事實，只用括號裡的事實 id。

| # | 段落（`draw.mjs` 的 role） | 主張 | 證明 | 證明在畫面上的樣子 |
|---|---|---|---|---|
| 1 | Hero（隱含） | 昕力替金融與政府，把 API 與 AI 安全接進既有系統（定位句） | `fact:company-industries`、`fact:products-families`、`fact:company-offerings`、`fact:digilism-protocol-integration` | h1 寫服務對象與做的事；旁邊是接點的畫面（P1、P3） |
| 2 | 產業入口（`list`） | 金融與政府的規範要求，已經做在產品裡（`DM-1`） | `fact:digirunner-open-banking-fsc`、`fact:digirunner-open-banking-3-stages`、`fact:digirunner-financial-inspection`、`fact:digirunner-ndc-spec`、`fact:digirunner-gov-threat-protection`、`fact:digirunner-case-taipei-city` | 兩個產業，各自列出對應的規範與案例原文，一列一條 |
| 3 | AI 案例（`work`） | AI 已用在理賠、建檔、阻詐這類日常作業，成果寫得出來（`DM-2`） | `fact:smartclaim-title`、`fact:smartclaim-result`、`fact:smartfilling-title`、`fact:smartfilling-result`、`fact:fraud-platform-title`、`fact:fraud-platform-result` | 三則案例，每則是作業名稱、成果原文、連結，配這個作業讀的文件 |
| 4 | 產品家族（`features`） | 依要解決的問題就找得到產品（`IT-4`、`IT-6`、`IT-8`、`DM-7`） | `fact:products-families`、`fact:digilism-protocol-integration`、`fact:digilism-family-digirunner`、`fact:aiso-llm-support`、`fact:greenswift-scope`、`fact:gadodido-passwordless`、`fact:gadoscout-ml-detection` | 四個家族，各一句問題加一條事實原文，下面列產品連結 |
| 5 | OrientAI（`showcase`） | 企業 AI 留在自己的環境，資料、權限與用量都在掌控內（`DM-3`） | `fact:orientai-on-prem-data`、`fact:orientai-governance-layer`、`fact:orientai-token-cost`、`fact:orientai-aidaptiv`、`fact:orientai-mcp` | 一個產品，四到五項特色的原文，一個可以操作的介面片段 |
| 6 | 產品與導入（`how-it-works`） | 產品與導入由同一家負責（`DM-4`） | `fact:company-offerings`、`fact:aiso-onboarding`、`fact:systalk-ai-onboarding` | 導入前、導入中的順序，接著六項服務的連結 |
| 7 | 穩定度（`about`） | 合作對象的穩定度看得到（`DM-6`） | `fact:company-founded`、`fact:company-milestone-2008-finance`、`fact:company-subsidiaries-sg-vn`、`fact:company-milestone-2020-brand`、`fact:cert-iso27001-product-platform`、`fact:company-google-cloud-partner` | 年份與項目加原文的紀錄，數字直接寫在 HTML |
| 8 | 聯絡業務（`cta`） | 談需求或預約 demo，都從聯絡表單開始（主要轉換） | 聯絡頁 `/contact-us`；`fact:company-email`、`fact:office-taipei-phone`、`fact:office-taipei-address` | 一個動作「聯絡業務」，旁邊是 email、電話與地址 |
| — | 頁尾（`footer`） | 不是論點，是收尾：名稱、導覽、聯絡方式、開放圖庫圖片的出處 | `fact:company-copyright`、`fact:office-taipei-address` | 照各方向的 footer blueprint |

傳給 `draw.mjs` 的 `--sections`：`list,work,features,showcase,how-it-works,about,cta,footer`（hero 是隱含的）。

### 檢查過、沒有刪的段落

taste-skill 要求刪掉沒有主張的段落。8 段都有主張與證明，沒有刪。逐段的判斷：

- 第 6 段：`competitors.md`「選擇理由」指出 GSS 也是自家產品加導入，所以 `DM-4` 不是差異點。它回答的是決策者「評估導入風險」的問題，證明也有三條事實，所以保留
- 第 8 段：聯絡是轉換，不是論證，但 brief 的主要轉換在這裡，證明是可以直接用的聯絡方式（三條事實），所以保留

### 沒有加的段落

- 客戶證言（`testimonial`）：`fact:testimonial-shin-kong-bank` 已是 `confirmed`，但 brief「待確認」第 1 項把要不要加交給設計概念與製作階段。五個方向都先不加，交人決定（見 `copy-deck.md`「待補與待確認」）
- 最新文章與新聞：brief 已刪

## 可以操作的一件事

taste-skill 第 4 步要求每頁有一件訪客可以操作的東西，用真實內容做。下面是從清點裡找得到的候選，各方向在 `sheet.md` 選一個：

| 候選 | 用到的清點 | 真實內容 |
|---|---|---|
| 選產業，看對應的規範與案例原文 | 第 5、6、9 項 | `copy-deck.md` 第 2 段的事實列 |
| 拖過導入的四個階段，看每個階段做什麼 | 第 12 項 | `fact:systalk-ai-onboarding` |
| 切換 OrientAI 的管控項目，看那一項的原文 | 第 10 項 | `fact:orientai-governance-layer`、`fact:orientai-aidaptiv` |
| 勾選金融檢查清單的項目，看 digiRunner 的對應 | 第 6 項 | `fact:digirunner-financial-inspection` 的 9 項 |

## 檢查引用

本檔與 `copy-deck.md` 的每個 `fact:` 都要在 `facts.yaml` 裡是 zh-TW 的 `confirmed`。在 repo 根目錄執行：

```bash
node -e '
const fs=require("fs");const y=fs.readFileSync("docs/strategy/facts.yaml","utf8");
const ok=new Set();for(const b of y.split(/\n(?=- id: )/)){const id=(b.match(/- id: (\S+)/)||[])[1];
if(/\n  locale: zh-TW/.test(b)&&/\n  status: confirmed/.test(b))ok.add(id)}
let bad=0;for(const f of ["argument.md","copy-deck.md"]){const t=fs.readFileSync("docs/strategy/concepts/"+f,"utf8");
for(const m of t.matchAll(/`fact:([a-z0-9-]+)`/g))if(!ok.has(m[1])){bad++;console.log(f,m[1])}}
console.log(bad?bad+" bad":"all confirmed");process.exit(bad?1:0)'
```
