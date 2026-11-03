# 競品分析（#164、#186）

比較同市場 IT 服務商的首頁，以及試點頁另兩個模板的同類頁面（API 管理平台的產品頁、金融產業頁）怎麼說自己、怎麼排段落、怎麼放證據、怎麼引導聯絡，給 messaging（`content-strategy`）與設計概念（`design-concept`）階段引用。做法依 `.claude/skills/site-research/SKILL.md`「3. 競品分析」。首頁的對照在「選擇理由」到「對本站的意義」，產品頁與產業頁在最後兩節「產品頁對照」「產業頁對照」。

- 觀察日期：首頁 2026-10-31（SYSTEX 的 `tw.systex.com` 同日稍晚放行後補看）；產品頁與產業頁 2026-11-03（#186；Kong 產品頁在 `konghq.com` 同日稍晚放行後補看）
- 方法：Playwright（Chromium）開頁面，user agent 用桌機 Chrome 130（Windows）。第一屏截圖用 viewport 375×812 與 1280×800，不截整頁；等 networkidle（最多 30 秒）再等 3 秒後截圖。截圖由 `node scripts/strategy/competitor-shots.mjs` 產生，重跑會覆蓋同名檔；`--template offering,hub` 只重跑內頁。回應不是 2xx 時不存檔、最多試 3 次（#186 加上：FPT 產業頁第一次截到 proxy 的「upstream request failed」頁）。頁面結構另用 Playwright 捲動整頁、讀 heading、按鈕與表單欄位
- 截圖沒有關掉任何 cookie banner 或彈窗。首頁四家在截圖時都沒有出現 cookie banner
- 範圍：#164 只看首頁，另看各家的聯絡頁或案例連結確認表單長度。#168 評審指出產品頁與產業頁的 D1、S2 沒有對照，#186 補上「產品頁對照」「產業頁對照」兩節
- 引用：不複製文案。引用原文每處最多一句並加引號
- 限制：本 session 的網路只放行競品主網域、`cloud.google.com` 與 `konghq.com`（`konghq.com` 在 2026-11-03 稍晚放行），第三方網域（例如 `cdnjs.cloudflare.com`、`www.googletagmanager.com`、`go.fptsoftware.com`、`www.gstatic.com`）連不上。依賴這些網域的元件（cookie banner、數字動畫、嵌入表單、部分圖片）可能沒有出現，下文逐處註明

## 選擇理由

| 公司 | 首頁 | 選擇理由 |
|---|---|---|
| 精誠資訊 SYSTEX | https://www.systex.com/ | 台灣最大的 IT 服務商之一，客群與產業重疊最多 |
| 叡揚資訊 GSS | https://www.gss.com.tw/ | 自有軟體產品加導入服務，模式最接近昕力。首頁四大分類下列的是自家產品（人資、公文、對話機器人等） |
| 凌群電腦 Syscom | https://www.syscom.com.tw/ | 金融、政府系統整合，與受眾重疊 |
| FPT Software | https://www.fptsoftware.com/ | 亞太（越南）IT 服務，對應 vi 市場。總部登記在河內（首頁 footer） |

## 精誠資訊 SYSTEX

截圖：[375](competitors/systex-375.png)、[1280](competitors/systex-1280.png)

`https://www.systex.com/` 回 301，轉址到 `https://tw.systex.com/systex/ch/index`，以下觀察都在轉址後的頁面。第一次截圖時 `tw.systex.com` 未放行（2026-10-31 13:29 UTC 連不上），放行後同日重跑 `node scripts/strategy/competitor-shots.mjs --only systex` 取得截圖。

| 面向 | 觀察 | 來源 |
|---|---|---|
| 定位說法 | 第一屏是全幅影片背景，疊一句短標「萬物皆數」與一行副標（AI 生成），沒寫公司做什麼、為誰做。頁面的 h1 是空的。hero 下緣是一排分類頁籤（全球IT服務、Ai4iA、Service、ESG、Data、Cloud、Cybersecurity、IT Infra.），1280 寬時露出在第一屏底部 | https://tw.systex.com/systex/ch/index |
| 首頁結構 | 依序為：影片 hero → 分類頁籤，每個頁籤一段說明與「更多」連結（預設是全球IT服務）→ 媒體曝光（新聞輪播，含獎項與合作消息）→ 服務版圖（四個規模數字）→ 合作夥伴 logo 牆 → 最新動向（新聞中心、全球IT服務、科技講堂三個入口）→ footer（完整網站地圖） | https://tw.systex.com/systex/ch/index |
| 證據呈現 | 規模數字（企業客戶、據點、員工、合併營收）放在首頁中段，做成數字動畫；讀取時數值還在跳動，本文不記錄數值。合作夥伴 logo 牆是技術原廠（例如 Adobe、HPE、Fortinet），不是客戶。獎項放在媒體曝光的新聞裡。首頁沒有案例段，成功案例只在導覽列 | https://tw.systex.com/systex/ch/index、https://tw.systex.com/systex/ch/app/landingpage/22714 |
| 轉換路徑 | 首頁沒有表單，「聯絡我們」只在 footer。右下角固定一個紅色圓形的 AI 對話按鈕（錨點 `#chatai`）。聯絡表單 7 個欄位加隱私同意（姓名、電話、Email、公司、部門、職稱、需求），部門與職稱是下拉選單，職稱選項從 CEO 到學生 | https://tw.systex.com/systex/ch/index、https://tw.systex.com/systex/ch/app/mailform/edit?module=mailform&id=22210 |
| 視覺語言 | 深色科技感影片（發光的晶片方塊），白字，品牌紅（`rgb(223, 51, 37)`）只用在小面積（logo 的 X、對話按鈕、數字）。字體 Noto Sans TC，數字用 Audiowide。hero 以下是白底與淺灰底交替，媒體曝光段用斜切的照片拼貼。截圖時沒有 cookie banner；本次讀取沒有發現被擋的資源造成畫面缺漏 | https://tw.systex.com/systex/ch/index |

## 叡揚資訊 GSS

截圖：[375](competitors/gss-375.png)、[1280](competitors/gss-1280.png)

| 面向 | 觀察 | 來源 |
|---|---|---|
| 定位說法 | 第一屏左欄是一句定位「雲地兼備 數位轉型領導者」，下面列四個服務分類（企業e化、資安及治理、雲端及巨資、運帷服務），沒有寫為哪些產業或角色服務。h1 是英文公司名 Galaxy Software Services | https://www.gss.com.tw/ |
| 首頁結構 | 依序為：四個服務分類（每類一段說明、「了解更多」、自家產品連結）→ 最新消息（新聞與活動，含資安通報、研討會）→ 成功案例（四則，每則有客戶名、標題、摘要、受訪者）→ 精彩影音（三支客戶影片）→ footer（據點、電話、關於與 ESG 連結） | https://www.gss.com.tw/ |
| 證據呈現 | 證據集中在成功案例段：每則寫出客戶名稱與成果百分比，配受訪者職稱與照片，連到 `/userstory/` 的完整案例。客戶影片另成一段。認證徽章（含 CMMI DEV/3）放在 footer 最底部。首頁沒有客戶 logo 牆與公司規模數字 | https://www.gss.com.tw/、https://www.gss.com.tw/userstory |
| 轉換路徑 | 首頁沒有表單，「聯絡我們」在 footer 出現兩次。聯絡頁表單 9 個欄位加隱私同意（姓名、公司、部門、職稱、Email、電話、兩題問卷、備註）。右下角固定一個吉祥物造型的 AI 對話視窗，可輸入問題與上傳檔案 | https://www.gss.com.tw/、https://www.gss.com.tw/about/contact-us |
| 視覺語言 | 深藍底加黃色強調字，字體 PingFang TC／微軟正黑體。左側固定的深藍欄放語系切換（EN、中、簡、日），主視覺是科技感圖庫照片（手指、機房、雲端 3D 圖示、辦公室人像），捲動時切換。375 寬時定位句與服務分類並排在第一屏上方 | https://www.gss.com.tw/ |

## 凌群電腦 Syscom

截圖：[375](competitors/syscom-375.png)、[1280](competitors/syscom-1280.png)

| 面向 | 觀察 | 來源 |
|---|---|---|
| 定位說法 | 第一屏是左右切換的 banner，截圖時的一張主打 GenAI 系統整合服務，文字做在圖片裡，頁面沒有 h1。沒有一句說明公司做什麼、為誰做。375 寬時 banner 圖裁切，標題只剩一半 | https://www.syscom.com.tw/ |
| 首頁結構 | 依序為：輪播 banner → 「多元專業解決方案」六張色卡（SYSCOM GO、雲端、ESG、智慧零售雲、AI、更多產品與服務）→ 「熱門焦點」六個圓形入口（教育訓練、電子報、社群頻道、Podcast）→ 公司聯絡資訊加獎項圖 → 聯絡表單 → footer。頁面很短（1280 寬約 3,300 px） | https://www.syscom.com.tw/ |
| 證據呈現 | 首頁唯一的證據是聯絡資訊旁的一張獎項圖（國家品質獎、台灣精品獎）。沒有案例、客戶名稱、客戶 logo 或數字 | https://www.syscom.com.tw/ |
| 轉換路徑 | 表單直接放在首頁底部：公司名稱、姓名、電話、Email、訊息 5 個欄位加個資同意，按鈕「立即聯繫」，表單上方一句說明會派顧問聯絡。導覽列沒有聯絡入口 | https://www.syscom.com.tw/ |
| 視覺語言 | 字體 Noto Sans TC。導覽列是白色半透明圓角膠囊浮在 banner 上。banner 是紫藍光流的抽象圖，解決方案卡片每張一個飽和色（紫、藍、綠、青、黃、紅）加大號英文字。沒有人物照片 | https://www.syscom.com.tw/ |

## FPT Software

截圖：[375](competitors/fpt-375.png)、[1280](competitors/fpt-1280.png)

| 面向 | 觀察 | 來源 |
|---|---|---|
| 定位說法 | 第一屏 h1「We are an AI-First Company」，下面一行大寫副標列三個動作（現代化、資安、擴展）。說自己做什麼，沒有在第一屏寫服務對象 | https://www.fptsoftware.com/ |
| 首頁結構 | 依序為：全幅 hero（動態背景、「Scroll to Explore」）→ 自家 AI 平台 FleziPT 介紹 → 三個預設問題按鈕的 AI 導覽 → 三則產業 AI 案例（醫療、保險、油氣）→ 十個產業與服務分類 → 全球據點與規模數字 → 客戶與合作夥伴高層的姓名與職稱輪播 → 「Get Case Study Free」→ 雇主品牌（四項）→ 十則新聞 → footer。整頁很長（1280 寬約 11,100 px） | https://www.fptsoftware.com/ |
| 證據呈現 | 案例放在首頁第三段，三則以分頁切換，預設顯示的醫療案例摘要寫出成果百分比，另兩則的連結網址也含百分比，都連到 `/resource-center/case-studies/`。規模數字（據點、客戶、員工、國家）做成數字動畫；本 session 第三方 script 連不上，數字停在「1+」，實際數字未觀察到。另有 26 位客戶與合作夥伴高層的姓名與職稱輪播（讀到的文字只有姓名與職稱），新聞段列獎項與分析機構報告 | https://www.fptsoftware.com/ |
| 轉換路徑 | 第一屏右側固定一個 FleziPT 對話面板，給三個入口（依產業找方案、看服務、看案例），右下另有收合按鈕。導覽列有 Contact，footer 有「Contact us」。聯絡頁先選來意（產品服務、合作、求職、網站回饋），表單嵌在 `go.fptsoftware.com` 的 iframe，本 session 連不上，欄位數未觀察到。聯絡頁寫明送出後 24–72 小時內回覆 | https://www.fptsoftware.com/、https://fptsoftware.com/contact-us |
| 視覺語言 | 品牌橘（`rgb(243, 112, 33)`）加深紫藍漸層，hero 是橘到紫的動態背景，字體 BR Omega 與 Inter。黑色導覽列放 FPT 集團標誌，語系切換是地球圖示。截圖時沒有 cookie banner，但 footer 有「Cookie Setting」，banner 可能由連不上的第三方 script 載入 | https://www.fptsoftware.com/ |

## 比較

| 面向 | 精誠 SYSTEX | 叡揚 GSS | 凌群 Syscom | FPT Software |
|---|---|---|---|---|
| 定位說法 | 影片 hero 加一句短標，沒寫做什麼、為誰做，h1 是空的 | 一句定位加四個服務分類，沒寫服務對象 | 輪播 banner 主打單一服務，沒有公司定位句，沒有 h1 | 一句 AI 定位加三個動作，沒寫服務對象 |
| 首頁結構 | 分類頁籤 → 新聞 → 規模數字 → 原廠 logo → 入口，中等長度 | 服務分類 → 新聞活動 → 案例 → 影音，中等長度 | 解決方案卡片 → 社群入口 → 聯絡表單，很短 | 平台 → AI 導覽 → 案例 → 產業服務 → 規模 → 高層輪播 → 雇主 → 新聞，很長 |
| 證據呈現 | 規模數字動畫、原廠 logo 牆、獎項在新聞裡；首頁沒有案例 | 具名客戶案例加成果百分比加受訪者，認證在 footer | 只有一張獎項圖 | 案例成果百分比、規模數字動畫、具名高層輪播 |
| 轉換路徑 | 首頁無表單，聯絡頁 7 欄加下拉職稱；AI 對話按鈕常駐 | 首頁無表單，聯絡頁 9 欄加問卷；AI 對話視窗常駐 | 首頁底部 5 欄表單 | 第一屏 AI 導覽面板；聯絡頁先選來意，寫明回覆時間 |
| 視覺語言 | 深色科技影片、白字、紅色小面積點綴 | 深藍加黃、圖庫照片、左側固定欄 | 飽和色卡片、抽象光流 banner、無人物 | 品牌橘加紫藍漸層、動態 hero、深色基調 |

## 對本站的意義

本節是推論，依上面的觀察與本站狀況推出，給策略與設計概念階段參考，不是觀察。本站狀況以現站 https://www.tpisoftware.com 首頁（2026-10-31 用同一方法讀取）、新站 `src/data/home/zh-TW.ts`、`src/layouts/templates/HomeTemplate.astro` 與 `docs/research/audience-and-goals.md` 為準。

### 本站已有

- 首頁有案例段：新站首頁的案例段用事實庫的案例標題與成果（`smartclaim-result` 等）。GSS 與 FPT 都把案例放在首頁前段並寫出成果數字，本站的做法方向一致。SYSTEX 首頁沒有案例段，改用規模數字與原廠 logo
- 產業入口：新站首頁有產業段（金融、政府）。GSS、Syscom 首頁只依服務或產品分類，FPT 有產業分類但與服務混在一起。本站受眾按產業分群（`audience-and-goals.md`），產業入口可能是差異點
- 自家產品線：新站首頁有產品家族段與 OrientAI 段，模式接近 GSS（自家產品加服務）

### 本站缺

- 第一屏沒寫服務對象：四家都沒在第一屏寫為誰服務，本站新站 hero 也沒有。受眾是金融、政府、製造業的決策者，第一屏點出產業可能是讓本站跟四家區隔的機會（交 messaging 決定）
- 第三方證據的位置：現站首頁有獎項段（「屢獲肯定」，獎項是圖片）、客戶證言、服務客戶 logo，新站首頁目前只有案例段，沒有獎項、客戶名或 logo。GSS 的具名客戶加受訪者職稱、FPT 的具名高層輪播，都比單純 logo 牆說得多。SYSTEX 的 logo 牆是技術原廠，說的是合作關係而不是客戶，本站若放原廠或夥伴 logo，要跟客戶 logo 分開標示。本站要放哪些證據，取決於事實庫有哪些 `confirmed` 的客戶名與認證
- 回覆時間的說明：FPT 聯絡頁寫明多久回覆。本站這件事還沒有答案（`audience-and-goals.md` 問題 3），有答案後可以放在聯絡 CTA 附近
- 首頁上的轉換入口：Syscom 把短表單放在首頁，GSS、SYSTEX、FPT 用常駐的對話入口。新站首頁只有底部的聯絡 CTA；現站有浮動「聯絡我們」與「預約 Demo」。新站要不要保留浮動入口，交設計概念決定

### 不適合本站

- AI 對話視窗（GSS、SYSTEX、FPT）：要載入第三方或自建的對話服務，本站規定頁面載入時不連站外網域（`CLAUDE.md`「功能模組」），也沒有後端可接，不跟進
- 數字動畫（SYSTEX、FPT）：數字靠 script 才顯示，FPT 在 script 沒載入時只剩「1+」，SYSTEX 讀取當下數值還在跳動，本次觀察都遇到。本站若放規模數字，應直接輸出在 HTML，不靠動畫
- 文字做在 banner 圖裡的輪播（Syscom）與空的 h1（SYSTEX）：頁面沒有可讀的 h1，Syscom 在 375 寬時文字還被裁切，違反本站的 SEO 底線（單一 h1）與無障礙要求
- 很長的首頁（FPT 約 11,100 px）：FPT 把雇主品牌、新聞都放進首頁。本站受眾不含求職者（`audience-and-goals.md`），雇主品牌段不需要

## 產品頁對照：API 管理平台（offering）

對照試點頁 `/products/digirunner`（offering 模板）。觀察日期 2026-11-03。

### 選擇理由（產品頁）

國際廠商看兩家。Kong（`konghq.com`）在 `search-intent.md` 的比較型查詢裡最常被當成比較對象（`Kong 替代方案 API Gateway`、`開源 API Gateway 推薦`），現站也有一張 digiRunner 與 Kong 的比較表（事實庫標 `to_confirm`）。2026-11-03 第一次讀取時 `konghq.com` 連不上（curl 經 proxy 時 CONNECT 回 403，WebFetch 回 `getaddrinfo ENOTFOUND`），同日稍晚在環境放行後補看。Kong 連不上時先看的 Apigee 保留，當第二家國際廠商：它是全生命週期的 APIM 平台，跟以 Gateway 為主的 Kong 是兩種寫法。同日用 curl 試過的其他國際 APIM 廠商首頁（`tyk.io`、`www.gravitee.io`、`wso2.com`、`www.mulesoft.com`、`api7.ai`、`apisix.apache.org`、`aws.amazon.com`、`azure.microsoft.com`、`www.ibm.com`、`www.axway.com`）都連不上，沒有看。

台灣廠商找不到自有 API 管理平台的產品頁：WebSearch（US）`精誠資訊 API 管理平台 API Gateway 解決方案` 只找到 SYSTEX 代理 Axway APIM 的案例報導（`cio.com.tw`，本 session 連不上），`凌群電腦 API 管理 OR API Gateway 產品` 沒有凌群的結果；GSS 對一般請求回 410。凌群「解決方案」頁的金融類有一個「金融服務通道整合平台-BanTalk」，做的是把網路銀行、ATM 等通路的訊息與核心系統分開處理，跟 digiRunner「接上既有系統」的用途重疊，但它不是 API 管理平台。所以台灣同業用 BanTalk 代表，比較時注意類別不同。

| 公司 | 頁面 | 選擇理由 |
|---|---|---|
| Kong Inc.（Kong Gateway） | https://konghq.com/products/kong-gateway | 國際 APIM 廠商，比較型查詢最常出現的比較對象；現站的比較表也以它為對象 |
| Google Cloud（Apigee） | https://cloud.google.com/apigee?hl=zh-TW | 國際 APIM 廠商，WebSearch 的 `API 管理平台`、`API 管理平台 比較`、`Kong 替代方案 API Gateway` 都列為代表產品；有繁中版 |
| 凌群電腦 Syscom（BanTalk） | https://www.syscom.com.tw/Products_Solution_Detail.aspx?id=77 | 首頁對照的競品，台灣銀行的通路整合產品，客群與 digiRunner 的金融受眾重疊 |

### Kong Gateway

截圖：[375](competitors/kong-product-375.png)、[1280](competitors/kong-product-1280.png)

觀察日期 2026-11-03（`konghq.com` 放行後）。頁面只有英文。

| 面向 | 觀察 | 來源 |
|---|---|---|
| 定位說法 | h1 是一句最高級的類別說法（開源 API Gateway 裡採用最多），副標一句說開發者喜愛、企業信任，下面兩個 CTA。第一屏沒寫產業或角色，也沒有產品介面圖。最上方是一條跑馬燈公告列（合作消息、活動回顧、Gartner 評價），下面是全站導覽與產品子導覽（Overview、Documentation、Plugin Hub） | https://konghq.com/products/kong-gateway |
| 頁面結構 | 依序為：hero → 三個特性（輕量、彈性、部署快），其中一項寫每節點的每秒交易量 → Gartner Magic Quadrant 評價加報告連結 →「Why Kong Gateway?」五個編號段落（APIOps 自動化、部署環境、Plugin 擴充、Kubernetes、政策與資料轉換），每段兩點加一個連結 → 開源版、Enterprise、Konnect 三個版本的功能對照表 → 客戶引言輪播 → 文件、更新、網路研討會三個資源入口 → FAQ 8 題 → 結尾 CTA → footer。1280 寬約 10,100 px | https://konghq.com/products/kong-gateway |
| 證據呈現 | 第三方評價放在第二段之後：Gartner 連續幾年列為 Leader，連到報告頁。效能數字（每節點每秒交易量）寫在特性段，頁面上沒寫測試條件。客戶證據是輪播，每張是一位具名人士（姓名、職稱、公司）的引言加一則成果標題（其中一則是營運負擔下降的百分比）與「View the Full Story」；連結指向 Australia Post 與 UnitedHealth Group 的案例，跟引言的公司（PEXA、Mercedes-Benz）不同。頁面的圖片放在 `prd-mktg-konghq-com.imgix.net`，本 session 連不上，有沒有客戶 logo 牆未觀察到 | https://konghq.com/products/kong-gateway |
| 轉換路徑 | 主要 CTA「Book Demo」出現在 header、hero 與結尾三處，連到 `/contact-sales`；次要 CTA「Get Started」連到 Konnect 的註冊頁。`/contact-sales` 的表單由連不上的第三方 script（`munchkin.marketo.net` 等）載入，欄位數未觀察到。導覽列另有 Pricing | https://konghq.com/products/kong-gateway、https://konghq.com/contact-sales |
| 視覺語言 | 淺灰綠底、黑色粗體無襯線大字，品牌色是螢光黃綠（主按鈕與 logo），次按鈕是框線膠囊。版面有細格線與十字標記，左側固定一排切換鈕（Human／Agent、顯示模式）。截圖時沒有 cookie banner，cookie 同意的 script（`api.consentjs.datagrail.io`）連不上 | https://konghq.com/products/kong-gateway |

### Google Cloud Apigee

截圖：[375](competitors/apigee-product-375.png)、[1280](competitors/apigee-product-1280.png)

| 面向 | 觀察 | 來源 |
|---|---|---|
| 定位說法 | 第一屏最上方是一條活動 banner，下面是 logo 加產品名（這行是 h1「Apigee API 管理平台」，字比標題小），大標題是 h2，說的是管理 API 的擴充性、安全性與效能。副標寫出做什麼（建立、管理、保護 API）與適用範圍（各種用途、環境、規模），沒寫產業或角色。1280 寬時右側是「產品亮點」三點（AI 控管、支援的 API 樣式、計費方式）加一支 5 分鐘介紹影片 | https://cloud.google.com/apigee?hl=zh-TW |
| 頁面結構 | 依序為：活動 banner → hero（產品名、標題、兩個 CTA、產品亮點）→「功能」五項，每項一段說明加影片或教學連結（Gemini Code Assist、API 通用目錄、Advanced API Security、高效能 API Proxy、混合雲／多雲端部署）→ 自家四個 API 產品的選擇表（Apigee、Apigee Hybrid、Cloud Endpoints、API Gateway，每個寫適用情境）→「運作方式」一張架構圖 → 五個使用情境（雲端優先開發、翻新舊版應用、發布 API 產品並營利、混合雲與多雲、網頁與 API 安全）→ 定價 → 試用與資源入口 → FAQ 6 題 → footer（「選用 Google 的理由」連結群，含客戶個案與分析師報告的入口）。1280 寬約 10,900 px | https://cloud.google.com/apigee?hl=zh-TW |
| 證據呈現 | 頁面本文沒有客戶名稱、客戶 logo、案例或分析機構評價，只有 footer 連到 Google Cloud 全站的客戶個案與分析師報告。證據是功能說明加示範影片、公開的價目（Pay-as-you-go 依 API 呼叫數、環境、Proxy 部署計價，寫出起始價；訂閱制三個方案寫「聯絡我們」），以及 FAQ 回答「什麼是 API 管理」這類定義題。部署段寫出 Hybrid 可在自家資料中心或 Kubernetes 叢集執行 | https://cloud.google.com/apigee?hl=zh-TW |
| 轉換路徑 | hero 兩個 CTA：「免費開始使用」（主要）與「聯絡我們」，下面一行寫 60 天沙箱免費試用。375 寬時 header 下方另有「聯絡我們」「免費試用」兩個按鈕。定價段另有價格計算機與客製化報價入口，頁尾前有「開始驗證概念」 | https://cloud.google.com/apigee?hl=zh-TW |
| 視覺語言 | 白底文件站版型，藍色實心主按鈕、白底框線次按鈕，左側一條細線分隔目錄。圖片與 logo 來自 `www.gstatic.com`，本 session 連不上，截圖裡只剩 alt 文字。沒有人物照片，插圖是產品介面與架構圖 | https://cloud.google.com/apigee?hl=zh-TW |

### 凌群電腦 Syscom（BanTalk）

截圖：[375](competitors/syscom-bantalk-375.png)、[1280](competitors/syscom-bantalk-1280.png)

| 面向 | 觀察 | 來源 |
|---|---|---|
| 定位說法 | h1 是每個解決方案頁共用的「解決方案」，產品名「金融服務通道整合平台-BanTalk」是 h3，`<title>` 是全站共用的「凌群電腦THE SYSCOM GROUP」。第一屏是一大段說明文字，先講銀行核心系統的背景，再講產品做什麼；服務對象（銀行）寫在內文 | https://www.syscom.com.tw/Products_Solution_Detail.aspx?id=77 |
| 頁面結構 | 麵包屑 → 產業標籤「金融」→ 產品名 → 三段說明文字加一張架構圖 → 採用的客戶名稱 → 聯絡窗口 → footer。整頁 1280 寬約 1,100 px，沒有功能清單、規格、FAQ 或下載 | https://www.syscom.com.tw/Products_Solution_Detail.aspx?id=77 |
| 證據呈現 | 內文寫一個導入後核心主機負荷下降的百分比，沒寫統計方式。說明文字下面以純文字列出三家採用的銀行名稱，沒有 logo、沒有案例連結 | https://www.syscom.com.tw/Products_Solution_Detail.aspx?id=77 |
| 轉換路徑 | 沒有表單或按鈕。頁尾寫一位業務窗口的姓名、電話分機與 Email；header 的「聯絡我們」是 `mailto:` 連結 | https://www.syscom.com.tw/Products_Solution_Detail.aspx?id=77 |
| 視覺語言 | 固定寬度的舊式版型（內容區約 925 px 置中），頂部導覽是圖片按鈕，左側橘色側欄列「產品&服務」子選單。375 寬時版面不縮放，右半邊被裁掉 | https://www.syscom.com.tw/Products_Solution_Detail.aspx?id=77 |

### 比較（產品頁）

| 面向 | Kong Gateway | Apigee | Syscom BanTalk |
|---|---|---|---|
| 定位說法 | h1 是最高級的類別說法，沒寫產業 | h1 是產品名，h2 大標寫做什麼與適用範圍，沒寫產業 | h1 是共用的「解決方案」，產品名在 h3，第一屏是背景說明 |
| 頁面結構 | 特性 → 分析機構評價 → 五個能力段 → 版本對照表 → 客戶引言 → FAQ，很長 | 功能 → 自家產品選擇表 → 架構圖 → 用途 → 定價 → FAQ，很長 | 三段說明加架構圖加客戶名，很短 |
| 證據呈現 | 分析機構評價放在前段、沒寫條件的效能數字、具名人士引言加成果標題 | 沒有客戶與案例；用示範影片、公開價目與 FAQ | 一個沒寫統計方式的百分比、三家銀行名稱 |
| 轉換路徑 | 預約 demo 為主（3 處），註冊試用為次 | 免費試用（60 天）為主、聯絡為次，375 寬時 header 下方也有 | 只有業務窗口的電話與 Email |
| 視覺語言 | 淺灰綠底、螢光黃綠按鈕、粗體大字、格線 | 白底文件站、藍色按鈕、產品介面圖 | 固定寬度舊版型，不支援手機寬度 |

### 對本站的意義（產品頁）

本節是推論，依上面的觀察與本站狀況推出，不是觀察。本站狀況以新站 `src/content/offering/zh-TW/digirunner.md`、`src/layouts/templates/OfferingTemplate.astro` 與 `docs/strategy/briefs/digirunner.md` 為準。

#### 本站已有

- 具名案例與獎項：新站寫出台新銀行的案例與它得的獎（`fact:digirunner-case-taishin`、`fact:award-global-finance-2020`）。Apigee 頁沒有客戶與案例，BanTalk 只列銀行名稱。Kong 有具名人士的引言與成果標題，但引言和連到的案例不是同一家公司，讀者要點進去才知道哪個客戶做了什麼。新站是客戶名、做了什麼、得獎寫在同一段
- 在地法規的對應：新站有「金融與政府的規範要求」段（`fact:digirunner-open-banking-fsc`、`fact:digirunner-financial-inspection`、`fact:digirunner-ndc-spec`）。Apigee 只寫一般的法規遵循，Kong 的能力段與 FAQ 講安全機制但沒有任何地區的法規，BanTalk 沒寫法規
- 試用與 demo 入口：Apigee 把免費試用當主要 CTA 並寫出天數，Kong 以預約 demo 為主、註冊試用為次。新站 hero 的證據點有 `fact:digirunner-trial-30-days`，次要 CTA 連到 digiRunner on Cloud，方向一致
- 部署環境：Apigee 用一段講 Hybrid 在自家資料中心與 Kubernetes 執行，Kong 的「Deployment agnostic」段寫地端、雲端、Kubernetes 與 serverless。新站有「部署環境由企業決定」段（`fact:digirunner-deployment`、`fact:digirunner-multi-cloud`）

#### 本站缺

- 產品或版本之間怎麼選：Apigee 用一張表說明自家四個 API 產品各適合什麼情境，Kong 用一張表對照開源版、Enterprise、Konnect 三個版本的功能。新站 digiRunner 頁連到 digiRunner on Cloud，但沒有說明地端版與雲端版怎麼選；方案名稱在事實庫有（`fact:digirunner-cloud-plans`）
- 回答定義題的 FAQ：Apigee 頁尾有 6 題 FAQ，回答「為什麼要用 API」「Apigee 和其他 API 管理方案有何不同」這類問題；Kong 有 8 題，回答部署在哪裡、怎麼保護 API、能不能接 CI/CD 與 Kubernetes 這類導入前的問題。兩家都對應 `search-intent.md` 的 `API 管理平台`（前幾名是定義文）。新站 digiRunner 頁沒有 FAQ 段，offering schema 有 `faq` 欄位但 `digirunner.md` 沒用
- 運作方式的圖：Apigee 用一張架構圖說明 Proxy 擋在後端前面。新站用文字說明「放在既有系統前面」，沒有架構圖
- 第三方評價的位置：Kong 把分析機構的評價放在第二段之後並連到報告。事實庫有一筆分析機構的獎項（`fact:award-gartner-cool-vendor-2018`，頒給公司，不是 digiRunner），引用時寫出年份（#180）；新站 digiRunner 頁沒有放。要不要放在產品頁交策略決定
- 價格：Apigee 公開起始價，Kong 在導覽列有 Pricing 頁。事實庫的 digiRunner Cloud 價格是 `to_confirm`，新站不能寫，這一項要等授權確認

#### 不適合本站

- 活動 banner 或公告列放在 h1 上面（Apigee 的活動 banner、Kong 的跑馬燈公告列）：第一屏先看到與產品無關的活動，跟 `design-principles.md` P1（第一屏用文字說出服務對象與做的事）衝突
- h1 只是產品名的小字、大標用 h2（Apigee）：本站的 h1 用節點名稱且是頁面最大的字，不跟進
- 共用的 h1 與 `<title>`、不支援手機寬度（BanTalk）：違反本站 SEO 底線（每頁唯一的 title、單一 h1）與無障礙要求
- h1 用最高級說法、效能數字不寫條件（Kong）：本站的「最」「第一」這類說法要事實庫有才能用，數字連同條件一起寫（`CLAUDE.md`「內容規則」、`design-principles.md` P2）。Kong 頁上的這些說法只是觀察，不是本站可引用的事實
- 客戶引言與連到的案例不是同一家（Kong）：證據的客戶名、做了什麼、成果要對得起來
- 沒寫統計方式的成效百分比（BanTalk）：本站的成效數字只能用事實庫有依據的（`CLAUDE.md`「內容規則」）

## 產業頁對照：金融（hub）

對照試點頁 `/industries/finance`（hub 模板）。觀察日期 2026-11-03。

### 選擇理由（產業頁）

三家都是首頁對照的競品，看它們網站上「金融」這個產業的入口頁。SYSTEX 與 Syscom 都沒有一頁專門講金融業的頁面，改看它們網站上點「金融」會到的那一頁，表內寫明頁面類型。GSS 對一般請求回 410，不看。

| 公司 | 頁面 | 頁面類型 |
|---|---|---|
| 精誠資訊 SYSTEX | https://tw.systex.com/systex/ch/app/data/list?module=moduleB0005&id=22224 | 「成功案例」依產業分類的「金融」列表頁（從 `/systex/ch/app/landingpage/22714` 的產業圖示進入） |
| 凌群電腦 Syscom | https://www.syscom.com.tw/Products_Solution.aspx | 「解決方案」頁，產業各一列下拉選單，金融是第二列 |
| FPT Software | https://fptsoftware.com/industries/banking-and-financial-services | 產業頁（首頁導覽 Industries 下的 Banking & Financial Services） |

### 精誠資訊 SYSTEX（金融案例列表）

截圖：[375](competitors/systex-finance-375.png)、[1280](competitors/systex-finance-1280.png)

| 面向 | 觀察 | 來源 |
|---|---|---|
| 定位說法 | 頁面標題「金融」是 h2，h1 是空的。標題下沒有任何說明，直接是關鍵字搜尋與案例卡片；沒寫精誠在金融業做什麼 | https://tw.systex.com/systex/ch/app/data/list?module=moduleB0005&id=22224 |
| 頁面結構 | 麵包屑（首頁 > 成功案例 > 金融）→ 標題 → 展開式關鍵字搜尋 → 案例卡片三欄（圖庫照片、標題、摘要），每頁 15 則，共 7 頁 → footer。第一頁 15 則裡有 4 則不是金融業（智慧校園選課、百貨超市電子發票、連鎖咖啡會員、量販店充電支付） | https://tw.systex.com/systex/ch/app/data/list?module=moduleB0005&id=22224 |
| 證據呈現 | 證據就是案例本身。卡片標題多數不寫客戶名，用「某產險業者」「A銀行」「S銀行」這類代稱；摘要寫背景與需求，卡片上沒有成果數字。看過的一則案例內頁（券商的 IT 委外）分「客戶背景與需求」「解決方案」「創造價值」三段 | 同上；該則案例內頁：https://tw.systex.com/systex/ch/app/data/view?module=moduleB0005&id=22224&serno=ac99b240-20f6-4d83-9775-77414858cba0 |
| 轉換路徑 | 頁面上沒有聯絡 CTA 或表單，只有右下角固定的紅色客服圖示（與首頁相同的對話入口）。上面那則案例內頁的文末寫了業務 Email | 同上 |
| 視覺語言 | 與首頁一致：白底、紅色細線標在標題左側、三欄卡片配科技感圖庫照片（光纖、手機上的聊天機器人）。375 寬時改為單欄 | 同上 |

### 凌群電腦 Syscom（解決方案頁的金融列）

截圖：[375](competitors/syscom-finance-375.png)、[1280](competitors/syscom-finance-1280.png)

| 面向 | 觀察 | 來源 |
|---|---|---|
| 定位說法 | h1「解決方案」，頁面沒有任何說明文字。九個產業各一列（雲端運算、金融、證券期貨、電信網路、醫療、政府與國防、交通運輸、資訊安全、企業應用），每列一個「請選擇解決方案名稱」下拉選單 | https://www.syscom.com.tw/Products_Solution.aspx |
| 頁面結構 | 金融列的下拉選單有 7 個產品（核心銀行系統、銷帳、偽卡風險、信用卡與 ATM 交易、BanTalk、無紙化報表、應用開發平台），選了才跳到產品頁。沒有產業的痛點、法規或案例段。整頁 1280 寬約 830 px | https://www.syscom.com.tw/Products_Solution.aspx |
| 證據呈現 | 頁面上沒有證據。客戶名稱只在個別產品頁（例：BanTalk 頁列出三家銀行） | https://www.syscom.com.tw/Products_Solution.aspx |
| 轉換路徑 | 沒有 CTA。header 的「聯絡我們」是 `mailto:` 連結 | https://www.syscom.com.tw/Products_Solution.aspx |
| 視覺語言 | 與 BanTalk 頁相同的固定寬度舊版型，產業名稱用橘色圓形標籤；375 寬時不縮放 | https://www.syscom.com.tw/Products_Solution.aspx |

### FPT Software（Banking & Financial Services）

截圖：[375](competitors/fpt-finance-375.png)、[1280](competitors/fpt-finance-1280.png)

| 面向 | 觀察 | 來源 |
|---|---|---|
| 定位說法 | h1 是產業名「Banking & Financial Services」，副標一句說要讓銀行與金融業重新適應數位時代，下面一個「Let's talk」按鈕。1280 寬時右側的 FleziPT 對話面板蓋住 h1 的後半段；375 寬時面板沒有出現 | https://fptsoftware.com/industries/banking-and-financial-services |
| 頁面結構 | 依序為：hero → 產業現況（一段說明加三個產業統計數字）→ 四個挑戰分頁（舊系統整合、個人化體驗、成本與資源、資安與法遵），每個挑戰對應一個做法（例如以 API 串接舊核心系統）→「How We Can Help」四個子產業分頁（Retail、Corporate、Digital Banking、Fintech）→ Success Stories → Insights（新聞稿與部落格）→ 一則客戶證言 → Our Clients → Our Partners → Talk to Us → You Might Like → footer。1280 寬約 15,000 px | https://fptsoftware.com/industries/banking-and-financial-services |
| 證據呈現 | 三個統計數字講的是整個金融業（例如有多少比例的金融業者已啟動 AI 專案），不是 FPT 自己的數字，頁面上讀到的文字沒有標出處。客戶證言寫出說話人姓名、職稱與銀行名稱。Our Clients 是一張 logo 拼圖。Success Stories 段本 session 只讀到標題、一張封面圖與「See more」，「See more」連到的案例列表網址篩選條件是 Healthcare；頁尾「You Might Like」五則也都是醫療主題 | https://fptsoftware.com/industries/banking-and-financial-services |
| 轉換路徑 | hero 的「Let's talk」錨點到頁面下方的「Talk to Us」，表單嵌在 `go.fptsoftware.com` 的 iframe，本 session 連不上，欄位數未觀察到。FleziPT 面板給三個入口（依產業找方案、看服務、看案例）| https://fptsoftware.com/industries/banking-and-financial-services |
| 視覺語言 | 與首頁一致：深藍 hero 加點陣背景、橘色按鈕，h2 的關鍵字用綠到橘的漸層字。統計數字用大號彩色字。375 寬時 hero 下面接著就是統計數字 | https://fptsoftware.com/industries/banking-and-financial-services |

### 比較（產業頁）

| 面向 | SYSTEX | Syscom | FPT |
|---|---|---|---|
| 定位說法 | 沒有說明，h1 是空的 | 沒有說明，h1 是「解決方案」 | h1 是產業名，加一句副標 |
| 頁面結構 | 案例列表，混入非金融案例 | 九個產業的下拉選單 | 挑戰 → 做法 → 子產業 → 案例 → 證言 → 客戶 → 聯絡，很長 |
| 證據呈現 | 案例多用代稱，卡片上沒有成果 | 無 | 產業統計（不是自家數字、沒標出處）、具名證言、logo 拼圖；案例段連到醫療 |
| 轉換路徑 | 只有固定的客服圖示 | 只有 `mailto:` | hero CTA 錨點到嵌入表單，加 AI 面板 |
| 視覺語言 | 白底三欄卡片、圖庫照片 | 固定寬度舊版型 | 深藍 hero、漸層字、大號統計數字 |

### 對本站的意義（產業頁）

本節是推論，依上面的觀察與本站狀況推出，不是觀察。本站狀況以新站 `src/content/hub/zh-TW/industry-finance.md`、`src/layouts/templates/HubTemplate.astro` 與 `docs/strategy/briefs/finance.md` 為準。

#### 本站已有

- 一頁講完金融業：三家裡只有 FPT 有專門的產業頁，SYSTEX 與 Syscom 點「金融」只會到列表或選單。新站金融頁有六段（法規、核心系統、AI、身分驗證、保險模組、規劃與導入），每段連到對應產品
- 挑戰對應做法的結構：FPT 用「挑戰 → 做法」排段落。新站每段的標題寫做法、內容連到產品，方向一致；新站多了台灣的開放銀行時程與金融檢查（`fact:open-banking-taiwan-2019`、`fact:digirunner-financial-inspection`），三家都沒有在地法規
- 具名的金融案例：新站列出台新、安泰等銀行的案例（`fact:client-taishin-bank`、`fact:client-entie-bank`）。SYSTEX 的金融案例多用代稱

#### 本站缺

- 客戶證言：FPT 在產業頁放一則寫出姓名、職稱、銀行的證言。事實庫有一則金融業的證言與說話人（`fact:testimonial-shin-kong-bank`、`fact:testimonial-shin-kong-bank-speaker`），新站金融頁沒有用
- 子產業的入口：FPT 用 Retail、Corporate、Digital Banking、Fintech 分頁。新站的 tagline 寫銀行、保險與證券，但段落依需求分，訪客要自己找「保險」在哪一段（保險在「保險業務的專用模組」）；要不要依子產業分入口交策略決定

#### 不適合本站

- 沒標出處的產業統計（FPT）：本站的數字只能用事實庫有來源的（`CLAUDE.md`「內容規則」），不放產業統計
- 產業頁的案例或延伸閱讀連到別的產業（FPT 的 Success Stories 與 You Might Like 連到醫療、SYSTEX 的金融列表混入零售與教育）：新站的案例與內容依 `industry` 欄位挑選，這一點要維持
- 只有列表或下拉選單、沒有說明（SYSTEX、Syscom）：沒有可讀的 h1 或說明文字，搜尋引擎與訪客都看不出這頁講什麼
- 蓋住 h1 的 AI 面板（FPT）：同首頁的「不適合本站」第 1 項
