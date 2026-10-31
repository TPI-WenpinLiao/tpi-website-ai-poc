# 競品分析（#164）

比較四家同市場 IT 服務商的首頁怎麼說自己、怎麼排段落、怎麼放證據、怎麼引導聯絡，給 messaging（`content-strategy`）與設計概念（`design-concept`）階段引用。做法依 `.claude/skills/site-research/SKILL.md`「3. 競品分析」。

- 觀察日期：2026-10-31（SYSTEX 的 `tw.systex.com` 同日稍晚放行後補看）
- 方法：Playwright（Chromium）開首頁，user agent 用桌機 Chrome 130（Windows）。第一屏截圖用 viewport 375×812 與 1280×800，不截整頁；等 networkidle（最多 30 秒）再等 3 秒後截圖。截圖由 `node scripts/strategy/competitor-shots.mjs` 產生，重跑會覆蓋同名檔。首頁結構另用 Playwright 捲動整頁、讀 heading、按鈕與表單欄位
- 截圖沒有關掉任何 cookie banner 或彈窗。四家首頁在截圖時都沒有出現 cookie banner
- 範圍：只看首頁，另看各家的聯絡頁或案例連結確認表單長度
- 引用：不複製文案。引用原文每處最多一句並加引號
- 限制：本 session 的網路只放行競品主網域，第三方網域（例如 `cdnjs.cloudflare.com`、`www.googletagmanager.com`、`go.fptsoftware.com`）連不上。依賴這些網域的元件（cookie banner、數字動畫、嵌入表單）可能沒有出現，下文逐處註明

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
- 第三方證據的位置：現站首頁有認證段、客戶證言、服務客戶 logo，新站首頁目前只有案例段，沒有認證、客戶名或 logo。GSS 的具名客戶加受訪者職稱、FPT 的具名高層輪播，都比單純 logo 牆說得多。SYSTEX 的 logo 牆是技術原廠，說的是合作關係而不是客戶，本站若放原廠或夥伴 logo，要跟客戶 logo 分開標示。本站要放哪些證據，取決於事實庫有哪些 `confirmed` 的客戶名與認證
- 回覆時間的說明：FPT 聯絡頁寫明多久回覆。本站這件事還沒有答案（`audience-and-goals.md` 問題 3），有答案後可以放在聯絡 CTA 附近
- 首頁上的轉換入口：Syscom 把短表單放在首頁，GSS、SYSTEX、FPT 用常駐的對話入口。新站首頁只有底部的聯絡 CTA；現站有浮動「聯絡我們」與「預約 Demo」。新站要不要保留浮動入口，交設計概念決定

### 不適合本站

- AI 對話視窗（GSS、SYSTEX、FPT）：要載入第三方或自建的對話服務，本站規定頁面載入時不連站外網域（`CLAUDE.md`「功能模組」），也沒有後端可接，不跟進
- 數字動畫（SYSTEX、FPT）：數字靠 script 才顯示，FPT 在 script 沒載入時只剩「1+」，SYSTEX 讀取當下數值還在跳動，本次觀察都遇到。本站若放規模數字，應直接輸出在 HTML，不靠動畫
- 文字做在 banner 圖裡的輪播（Syscom）與空的 h1（SYSTEX）：頁面沒有可讀的 h1，Syscom 在 375 寬時文字還被裁切，違反本站的 SEO 底線（單一 h1）與無障礙要求
- 很長的首頁（FPT 約 11,100 px）：FPT 把雇主品牌、新聞都放進首頁。本站受眾不含求職者（`audience-and-goals.md`），雇主品牌段不需要
