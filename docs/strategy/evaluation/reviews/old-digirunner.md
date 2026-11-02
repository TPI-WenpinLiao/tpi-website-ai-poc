# 評審：試點舊版 digiRunner 產品頁

評審時的代號 r10，對象是 PR #176 合併前的 `main`（818988f）build 出的 `/products/digirunner`，對照 `docs/strategy/briefs/digirunner.md`。`reviewer` 只看匿名化的截圖與 `dist/` 的 HTML，不知道這一組是什麼，也沒看到其他組的分數。以下是評審的原文，只調整標題層級。

截圖：[`../old/digirunner-1280-first.jpg`](../old/digirunner-1280-first.jpg)、[`../old/digirunner-375-first.jpg`](../old/digirunner-375-first.jpg)、整頁 [`1280`](../old/digirunner-1280-full.jpg)、[`375`](../old/digirunner-375-full.jpg)。理由裡的 `page-<width>-partNN.jpg` 是整頁圖由上而下每 1600 px（375 寬是 1400 px）切成的段落。

第一印象：5 秒內看得出這是「digiRunner API 管理平台」這個產品，但看不出給誰用（沒有金融或政府）、為什麼選它。主視覺是發光的疊層玻璃板，`design-principles.md` P1 點名過這張圖跟 SYSTEX 的發光方塊同屬一類。往下捲，四張功能卡各佔一屏的左半邊，右半邊和卡片之間都是大片空白。整頁內容幾乎就是 brief「與現有頁面的差異」表列為要改的舊版：四個「零」、五個產業頁籤、tagline「專為關鍵系統應用而生」都還在。

## 設計：平均 1.8，未通過

| 項目 | 分數 | 理由 |
|---|---|---|
| D1 第一屏的辨識度 | 3 | `page-1280-first.jpg` 與 `page-375-first.jpg` 都看得到 h1「digiRunner API 管理平台」，看得出產品類別。但沒有服務對象（金融、政府），說明句「專為關鍵系統應用而生」說不出差別。右半邊的發光疊層玻璃板（`hero-modular-stack.webp`）在 P1「不會怎麼呈現」第 1 項被點名「和 SYSTEX 的發光方塊同屬深色科技物件，換掉 logo 後不容易分辨」。辨識度只靠 h1 的產品名撐住 |
| D2 與設計原則一致 | 1 | 多處明顯違反原則的「不會怎麼呈現」：(1) h1 上方有 mono 大寫的 eyebrow「DIGILISM」加橘點（P1、house rules）；(2) 功能卡用「01 DIGIRUNNER API 管理平台」的等寬編號 eyebrow，外加細線框、陰影（P2、P4）；(3) 發光玻璃物件當主視覺（P1、P3「發光或玻璃質感」）；(4) 功能段四次出現「一段文字擠在左側、另一半螢幕空著」與超過半屏的空白（P5，`page-1280-part01`～`part03`）；(5) 應用情境是一排五張等大的卡片（P5「no rows of identical cards」）；(6) 聯絡框外圈有靜態光暈（`page-1280-part04` 的 CONTACT 框，P4）；(7) 產品頁沒有任何介面片段或架構圖解，P5 要求產品頁至少 4 張。找不到哪個視覺決定指得到 P2 或 P3 |
| D3 視覺層級 | 2 | hero 的焦點清楚。功能段每屏只有一張小卡，空白比內容搶眼；四張卡權重完全相同，讀不出哪一段重要。頁尾聯絡框的 h2「您的需求，我們用心傾聽」字級比所有內容段的標題都大，最重的視覺落在一句空話上。brief 的閱讀順序在頁面上看不到，因為那些段落不存在 |
| D4 版面與節奏 | 1 | 1280 寬時每張功能卡之間約 800px 空白（`part01` 下半到 `part03` 上半），375 寬時約 550px（`page-375-part02`、`part03`），整體極度鬆散。接著應用情境是緊密的卡片格，鬆緊切換顯得隨意，不是設計出來的節奏 |
| D5 證據的呈現 | 1 | 全頁沒有數字、客戶名、案例、認證或獎項。brief 指定的 hero 三個證據點（ISO27001、30 天試用、專利數）和案例段（台新、臺北市政府、Pharmacity）都沒有出現。視覺上唯一的大面積元素是裝飾性的 3D 圖 |
| D6 窄螢幕 | 3 | 375 寬沒有跑版。hero 改成圖在上、文字在下，h1 兩行，主要 CTA 在第一屏內（`page-375-first.jpg`）。但下面只是單欄堆疊，功能卡之間同樣是大片空白，應用情境堆成五張長卡，沒有為窄螢幕重新安排 |

要改的地方：
- D1：第一屏要用文字說出服務對象，至少點名金融或政府，加上 brief 第 1 段的類別與用途句和證據點。不能讓發光物件承擔辨識度
- D2：拿掉 h1 上方的 eyebrow、01–04 的等寬編號標籤、細線框卡片、靜態光暈。功能段改用畫「接進既有系統」的介面片段或架構圖解
- D3、D4：功能段不能一屏只放一張半寬小卡、旁邊留大片空白。段落權重要照 brief 的評估順序分出輕重；聯絡段的標題不要比內容段搶眼
- D5：把 brief 指定的證據（hero 證據點、具名案例、獎項）放上頁面，照 P2 用「紀錄」格式呈現
- D6：375 寬時去掉功能段的空白，讓證據點與第一則案例在前幾屏內出現

## 文案與行銷：平均 2.0，未通過

| 項目 | 分數 | 理由 |
|---|---|---|
| C1 定位清楚 | 3 | h1 說出做什麼（API 管理平台），副標「專為關鍵系統應用而生」沒有對象，也沒有差異。brief「與現有頁面的差異」第 1 列已經要求改寫這句。messaging 的定位在 hero 完全沒有出現 |
| C2 對受眾的價值 | 2 | brief 列出 IT 主管的六個疑問，頁面沒有逐一回答。四張功能卡以「零停機」「零失誤」這類口號當標題，內文是功能描述。應用情境五張卡只有標題加一句口號，例如「建立投保到理賠的智慧化」「打造高效、便民數位服務」，沒有讀者的任務或成果 |
| C3 證據支撐 | 2 | 抽查 4 條：(1)「零信任防護」卡內文與 `fact:digirunner-zero-trust` 原文完全一致。(2)「零停機服務」卡前半與 `fact:digirunner-zero-downtime` 原文一致，但後面接了原文沒有的「確保關鍵業務系統能持續穩定運行，達到服務不中斷」，把事實加強成可用性保證。(3)「零失誤監控」卡前半是 `fact:digirunner-low-code` 原文，後面加了「有效協助系統管理與維運作業」；標題「零失誤」在事實庫沒有依據。(4)「零阻塞運行」卡前半是 `fact:digirunner-zero-blocking` 原文，後面加了事實沒有的成效宣稱。另外，應用情境的「實現國際 FHIR 格式轉換」在事實庫只見於 digiCare、DigiLism 的事實，沒有 digiRunner 的依據。全頁沒有數字、客戶或案例成果 |
| C4 CTA 與轉換路徑 | 3 | 主要 CTA「預約演示」出現在 hero 與頁尾，連到 `/contact-us`，符合 brief 的主要轉換。但次要按鈕是「看功能」（`#features`），brief 的 CTA 表明確要求改成試用 digiRunner on Cloud；全頁沒有任何試用入口（`IT-7`）。頁尾標題與說明是泛用文案，沒說約了 demo 會發生什麼 |
| C5 符合 brief | 1 | brief 12 段大多沒做到：第 1 段缺證據點與試用 CTA；第 2–5 段與第 7–9 段都不存在，brief 要求拆掉的四個「零」原樣保留；第 6 段被五個產業頁籤取代，brief 要求刪除的醫療、物聯網仍在；第 10 段案例、第 11 段相關文章都沒有。只有第 12 段（預約演示）有對應 |
| C6 語氣與文字品質 | 1 | 大段照抄現站：tagline、四個「零」與內文、五個應用情境標題。出現 messaging「本站不用的字」與 writing-style 的 AI 高頻詞：「打造」、「一站整合」、「引領創新」、「輕鬆」、「創造流暢的使用體驗」。頁尾「您的需求，我們用心傾聽」是空話 |

要改的地方：
- C1：hero 說明句要寫出類別、用途與對象，對應 messaging 定位與 brief 第 1 段
- C2：改成照 IT 主管疑問排的段落，每段寫機制與條件，不用口號標題
- C3：功能內文只用事實原文，拿掉接在事實後面的成效句與「零失誤」標題。補上 brief 指定的事實。FHIR 這句不是 digiRunner 的事實，要刪
- C4：hero 的次要 CTA 換成試用 digiRunner on Cloud，並寫清楚試用條件。頁尾標題寫出下一步
- C5：照 brief 的 12 段重建內容
- C6：換掉照抄現站的文案與禁用詞，依 messaging「語氣」寫機制，不寫形容詞

## SEO：平均 2.7，未通過

| 項目 | 分數 | 理由 |
|---|---|---|
| S1 搜尋意圖對應 | 3 | 頁面類型是產品頁，符合導航型與商業型意圖。但查這組詞的人在看評價與購買管道，頁面沒有部署、試用、購買管道等資訊。深度不足 |
| S2 主題涵蓋 | 2 | 只碰到 OIDC/OAuth2 與雲原生、橫向擴展。沒有 OpenAPI、API 生命週期、地端／雲端／Kubernetes 部署、AWS、ISO 27001、AI Gateway、API Composer、自助註冊與登入、授權與試用。也沒有競品沒有的資訊 |
| S3 title、description 與 h1 | 3 | title「digiRunner API 管理平台｜TPIsoftware 昕力資訊」符合 brief 的第二個示例，h1「digiRunner API 管理平台」帶類別詞。description 是現站舊句，brief 明說要重寫。它沒涵蓋 AI Gateway、部署方式與試用，也跟頁面可見內容對不上 |
| S4 heading 結構 | 3 | 結構正確：單一 h1，h2 下面接 h3，不跳級。但 heading 文字是口號或泛稱：h2「功能」（sr-only）、h3「零停機服務」「零失誤監控」「零阻塞運行」「零信任防護」、h2「應用情境」、h2「您的需求，我們用心傾聽」 |
| S5 內部連結 | 2 | `main` 裡的連結只有：麵包屑、`/contact-us` 兩次、`#features`、`/industries/finance` 與 `/industries/government`（錨點只有產業名）、`/products/digirunner-cloud`。缺 brief 列的兩篇 AI Gateway 文章、各案例內頁、`/success-story`、DigiLism 內文連結 |
| S6 結構化資料與內容一致 | 3 | JSON-LD 的 `SoftwareApplication` 加 `BreadcrumbList`，類型符合 `content-model.md`。但欄位很少：`description` 用的是頁面上看不到的 meta description，`image` 是預設 OG 圖 |

要改的地方：
- S1、S2：補上 search-intent 列的子題，照 brief 第 2–9 段寫
- S3：照 brief「description」方向重寫
- S4：h3 改用機制名稱
- S5：補上 brief「連出」表的連結，錨點文字寫出目的地是什麼
- S6：內容補齊後，確認 JSON-LD 的 description 對得上頁面可見內容

## 門檻判斷

設計 1.8、文案與行銷 2.0、SEO 2.7，三份都未通過。根本原因是頁面內容停在 brief 之前的版本：四個「零」、五個產業頁籤、舊 tagline 與舊 description 都沒換。設計上的大片空白像是捲動場景章節（`scene-chapter`）在減少動態時沒有留下替代畫面，但評審只看得到截圖呈現的結果。

## 評審依據不足

1. 主要轉換互相衝突：C4 錨點寫「主要 CTA 符合 `site-profile.md` 的主要轉換」（聯絡業務），`briefs/digirunner.md` 卻定這頁的主要轉換是預約 demo。rubric 沒說 brief 可以蓋過 site-profile，本次以 brief 為準
2. 設計原則以首頁為主：P5 的「會怎麼呈現」幾乎都以首頁的 8 段為例；產品頁只有「至少 4 張圖」一句。`briefs/digirunner.md` 只有段落順序、沒有標出哪幾段權重最高
3. 產品頁能不能沿用 hero 3D 圖沒有寫清楚：P1 點名的 `hero-modular-stack.webp` 是在講首頁 hero；「原則與現有限制」又寫真 3D 可以用在「部分 offering 頁的 hero 與功能章節」
4. C3 沒說怎麼處理加長的事實原文：「事實原文後面接上表述性的成效句」算有支撐還是加強事實
5. 競品對照只有首頁：`competitors.md` 沒有 API 管理產品頁（例如 Kong、Apigee）的對照，D1 與 S2「競品沒有的資訊」無從判斷
