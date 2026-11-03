# 評審：現站首頁

評審時的代號 r07，對象 `https://www.tpisoftware.com/`，對照 `docs/strategy/briefs/home.md`。`reviewer` 只看匿名化的截圖與 HTML（渲染後的 DOM），不知道這一組是什麼，也沒看到其他組的分數。以下是評審的原文，只調整標題層級。

截圖：[`../current/home-1280-first.jpg`](../current/home-1280-first.jpg)、[`../current/home-375-first.jpg`](../current/home-375-first.jpg)、整頁 [`1280`](../current/home-1280-full.jpg)、[`375`](../current/home-375-full.jpg)。理由裡的 `page-<width>-partNN.jpg` 是整頁圖由上而下每 1600 px（375 寬是 1400 px）切成的段落。

第一印象：第一屏是深色科幻走廊的全幅輪播（8 個圓點），配一句口號「定義軟硬整合新標準　開啟主權 AI 新時代」、股票代號與 logo。5 秒內只看得出「跟 AI 有關、是上市櫃公司」，看不出做什麼、替誰做。整體跟 `competitors.md` 記錄的 SYSTEX（深色科技影片加一句短標）屬於同一類。

## 設計：平均 1.7，未通過

| 項目 | 分數 | 理由 |
|---|---|---|
| D1 第一屏的辨識度 | 1 | 只看 `page-1280-first.jpg`、`page-375-first.jpg`：h1 是口號，沒寫服務對象（金融、政府），也沒寫做的事（把 API、AI 接進既有系統）。主視覺是和業務無關的科幻走廊，加上輪播。這正是 `competitors.md`「比較」表裡 SYSTEX 的寫法（影片 hero 加一句短標，沒寫做什麼、為誰做），換掉 logo 後分不出是哪一家 |
| D2 與設計原則一致 | 1 | 多處違反各原則的「不會怎麼呈現」：P1 禁的輪播 banner 加氛圍短標（hero 有 8 張）。P3 禁的無關科技圖與圖庫照：走廊、光流、發光花朵、城市夜景大橋、圖庫人像（`page-1280-part01/02/03.jpg`）。P4 禁的自動輪播、浮動聊天入口（右下角「聯絡我們」泡泡），以及只在 hover 才看得到的關鍵資訊：產品卡的成果文字在 HTML 裡有，截圖上卻只有標題。P5 禁的等大卡片格子（10 張同款卡）。另外有 P2 禁的輪播客戶 logo 牆 |
| D3 視覺層級 | 2 | hero 的焦點是口號，不是定位。OrientAI 帶狀區的焦點清楚。產品區 10 張卡等大、沒有主次（`page-1280-part01` 下半到 `part02` 上半）。案例段整屏都是大橋照片，唯一的元素是「所有成功案例」按鈕，段落標題在截圖上看不到（`page-1280-part03` 上半）。「服務客戶」標題是淺灰字，幾乎看不見（`part03` 底部）。閱讀順序沒有照 brief 的「是不是為我做 → 做得到嗎 → 安不安心」 |
| D4 版面與節奏 | 2 | 產品格上下各有約 200px 沒內容的灰底（`part01` 1120–1330px、`part02` 920–1140px）。最後一列只有 2 張卡，右半邊空著（`part02`）。證言下方到「服務客戶」之間也有大段空白（`part03`）。段落雖然換了底色，但間距看起來隨意 |
| D5 證據的呈現 | 2 | 獎項只有 logo 圖，沒寫年份與得獎產品，讀不出是誰、哪年、得了什麼獎（`part02` 底部）。三則 AI 案例的成果數字（80%、40%）在截圖上看不到，只在 hover 或 HTML 裡。客戶 logo 是淺色輪播。卓新證言寫出說話人姓名與職稱，是本頁最可信的證據，但放在輪播裡，一次只看得到一則 |
| D6 窄螢幕 | 2 | h1 在 375 寬斷在詞中間（「定義軟硬整合新標準　開／啟主權 AI 新時代」，`page-375-first.jpg`）。浮動聊天泡泡蓋住 OrientAI logo 的「AI」（`page-375-part01.jpg` 約 y=740）。產品區改成橫向輪播，一次只看得到一張卡加一條邊。獎項只顯示 2 個 logo。沒有橫向捲動，但版面只是把桌機版縮成輪播，沒有為窄螢幕重新安排 |

要改的地方：
- D1：第一屏要用文字寫出服務對象與做的事（定位句短版），影像不能撐起辨識度。現在的口號加科幻圖，換掉 logo 就跟 SYSTEX 一樣
- D2：拿掉 hero 輪播、浮動聊天泡泡、圖庫照與無關的科技圖，拿掉 hover 才看得到的成果文字。這些都是設計原則明列不做的事
- D3：每段要有一個第一眼的焦點，段落順序照 brief 的判斷順序。案例段不能只有照片和一個按鈕，「服務客戶」標題要看得見
- D4：補掉產品格上下的空白和最後一列的半排空位，產品區不要用 10 張等大卡片
- D5：獎項要用文字寫出年份與得獎產品，案例成果數字要直接看得到，證言不要放在輪播裡
- D6：375 寬的 h1 不能斷在詞中間，浮動元素不能蓋住內容。窄螢幕要把產業入口與第一則案例排在前兩屏

## 文案與行銷：平均 1.8，未通過

| 項目 | 分數 | 理由 |
|---|---|---|
| C1 定位清楚 | 1 | h1「定義軟硬整合新標準　開啟主權 AI 新時代」只是口號，沒寫做什麼、為誰做、為什麼選昕力，跟 messaging 的定位句（替金融與政府，把 API 與 AI 安全接進既有系統）無關。另一個 h1 是空的 |
| C2 對受眾的價值 | 2 | 產品區畫面上只有產品名（「業務績效 管理平台」「電子點數 兌換平台」），等於一張產品清單。獎項段的說明「昕力資訊深耕業界多年…致力於提供創新技術及軟體解決方案…」是公司自述。只有卓新證言從客戶角度寫成果。沒有一段回應決策者「是不是為我的產業做」的問題 |
| C3 證據支撐 | 2 | 抽查 6 筆，前 4 筆和 `facts.yaml` 的 `source.quote` 一致：`smartclaim-result`、`smartfilling-result`、`fraud-platform-result`、`testimonial-excellence-wire`。另外 2 筆有問題：`award-taiwan-excellence-2024` 只放 logo，沒寫原文裡的得獎產品；Gartner Cool Vendor 2018 雖然是 confirmed，messaging `DM-8` 明定不用在試點頁。事實庫查不到的有：「股票代號: 7781」（hero）、Future Commerce Award 2022 的 logo。沒有依據的主張有：title 的「領導品牌」、description 的「贏得…多個國際獎項肯定」、「數位金融科技實踐家」。證據分布不均，部分無法追溯 |
| C4 CTA 與轉換路徑 | 3 | 主要轉換「聯絡我們」（→ `/contact-us`）只出現在 header 按鈕和浮動泡泡，hero 與頁尾都沒有聯絡段。文字是泛稱，沒說點了會發生什麼。內文連結有 4 個是「了解更多」 |
| C5 符合 brief | 2 | brief（含製作階段的 5 段版）要的 hero 定位句、產業入口（金融、政府）、產品家族各一句「解決什麼問題」、穩定度紀錄（成立年份、跨足金融、員工數等）與頁尾聯絡段都沒有。有對到的是三則 AI 案例與 OrientAI 段，但 OrientAI 還是 brief 明說要換掉的「讓 AI 不只會回答」主軸。多出 brief 沒有的段落：hero 新聞輪播、7 張非 AI 產品卡、客戶 logo |
| C6 語氣與文字品質 | 1 | 用到 messaging「本站不用的字」與 writing-style 的空話：「領導品牌」（title）、「打造最佳雙隊伍合作模式」「打造企業級 AI 解決方案」（hero 的 h2）、「不同凡響的成功案例」、「屢獲肯定」、「致力於提供創新技術」。description 有錯字「SysTalk.ai 交談 AI 及、ESGswift」。整頁文字與現站首頁相同（事實庫的來源網址都是 `https://www.tpisoftware.com/`，原文逐字一致），屬於照抄現站 |

要改的地方：
- C1：hero 要寫 messaging 的定位：服務對象、做的事、差異（規範要求做在產品裡，產品與導入同一家）
- C2：每段要從決策者與 IT 主管的任務寫，例如這個產業得到什麼、導入後處理掉哪個風險，不要只列產品名
- C3：拿掉事實庫沒有的股票代號、Future Commerce 獎和「領導品牌」，Gartner 2018 照 `DM-8` 不放。獎項用原文寫出年份與產品
- C4：hero 與頁尾要放聯絡業務的 CTA，文字寫讀者的下一步（談需求、預約 demo），「了解更多」改成說明目的地的文字
- C5：照 brief 補上 hero 定位、產業入口、產品家族、穩定度紀錄與聯絡段，刪掉新聞輪播與多餘的產品卡
- C6：依 messaging 與 writing-style 重寫，拿掉最高級說法與空話，修正錯字，不沿用現站文句

## SEO：平均 2.0，未通過

| 項目 | 分數 | 理由 |
|---|---|---|
| S1 搜尋意圖對應 | 2 | 頁面類型（品牌首頁）對得上品牌導航查詢。但 brief 要首頁回答「這家公司做什麼、為誰做」（品牌詞與「台灣 AI 解決方案 公司」「企業數位轉型 軟體公司」），可見內容沒有回答，查品牌的人點進來只看到口號和新聞輪播 |
| S2 主題涵蓋 | 3 | `search-intent.md` 列的子題有涵蓋到一部分：股票代號（hero）、digiRunner、DigiLism 等產品名（hero 的 h2、footer）、四條產品線（footer 欄名與 description）、台灣精品獎（logo）、主權 AI（h1）。沒涵蓋：成立年份、地端部署與資料主權的內容（只有「主權 AI」幾個字） |
| S3 title、description 與 h1 | 2 | title「昕力資訊TPIsoftware - 企業數位轉型軟體領導品牌」有兩種公司名和「企業數位轉型」，但用了最高級的「領導品牌」，沒寫服務對象，也違反 brief 的 title 方向（類別詞不進 title）。description 約 130 字，超過 brief 的 60–80 字，有錯字「交談 AI 及、」。h1 有兩個：第一個是空的 `<h1 class="title__title">`，第二個是口號，和 title、description 對不上 |
| S4 heading 結構 | 1 | HTML 有 2 個 h1、37 個 h2、34 個 h3。多個 h2 是空的。hero 輪播每張的標語都是 h2（含英文「The Right AI. The Right Decisions. The Best Result.」）。產品卡被拆成 h2「AI」加 h3「智慧建檔」。獎項段的整段說明寫成 h3。證言輪播的複製節點讓「digiRunner API 管理平台 API 管理平台」這類 h3 重複出現多次。彈窗的「感謝您」「取消訂閱」也是 h3。只掃 heading 讀不出頁面涵蓋什麼 |
| S5 內部連結 | 2 | 有連到 `/orient-ai`（「探索 OrientAI」）、`/solutions/smartfilling`、`/solutions/smartclaim`（錨點都是「了解更多」）、`/success-story`（案例段的連結沒有錨點文字）。footer 的產品連結帶類別詞，但「企業級 API 管理」沒寫產品名 digiRunner。brief 列的 `/industries/finance`、`/industries/government`、`/products` 與家族頁，內文都沒有連；`/about-us` 只在 footer |
| S6 結構化資料與內容一致 | 2 | 只有一段 `WebSite` 加 `SearchAction`。`content-model.md` 要求首頁輸出 `Organization`（name、alternateName、logo、sameAs、address、contactPoint）加 `WebSite`，但頁面上看得到的公司名、電話、email、社群連結，都沒有對應的 `Organization` |

要改的地方：
- S1：title、description 與第一屏文字要回答「做什麼、為誰做」，承接品牌導航與兩組類別詞
- S2：補上成立年份與地端部署、資料主權的內容，也就是 `search-intent.md` 首頁條目列的子題
- S3：只留一個 h1，寫定位句。title 拿掉「領導品牌」、照 brief 方向寫服務對象。description 縮到約 60–80 字並修正錯字，三者內容要一致
- S4：heading 只用在段落標題，h2 寫該段回答的問題。輪播標語、產品卡拆字、段落說明、彈窗都不要用 heading
- S5：照 brief 的「連出」表補上產業頁、產品家族頁、產品總覽、關於我們與聯絡頁的內文連結，錨點文字寫出目的地
- S6：補上 `Organization`，欄位照 `content-model.md`，並和頁面上的公司資料一致

## 門檻判斷

三份 rubric 都未通過：設計 1.7、文案與行銷 1.8、SEO 2.0，每份都有低於 3 的項目。

## 評審依據不足

1. 有兩個版本，不確定 C5 要對照哪一個：`docs/strategy/briefs/home.md` 開頭「製作階段的版本（#167）」寫首頁精簡成 5 段，但「段落結構」表仍是 #165 的 8 段，`design-principles.md` P5「會怎麼呈現」也還寫「8 段各自有不同的版型密度」。本次兩版都沒做到，分數不受影響；分數接近時會判不準
2. S3 的錨點和 brief 衝突：`rubrics/seo.md` S3 的 5 分錨點要求包含「主要查詢的用詞」，brief「這頁承接的查詢」也把「台灣 AI 解決方案 公司」「企業數位轉型 軟體公司」標為主要，但同一份 brief 的「取捨」第 1 項決定類別詞不進 title。title 放了「企業數位轉型」時，要加分還是扣分，rubric 沒說
3. C3 漏掉「confirmed 但 messaging 排除的事實」：C3 只看能不能追溯到事實庫。Gartner 2018 在 `facts.yaml` 是 confirmed，卻被 `messaging.md` `DM-8` 排除在試點頁外。用了這類事實該算進 C3 還是 C5，rubric 沒寫。另外，評對象若就是事實庫的來源頁，原文自然一致，「可追溯」這一條沒有鑑別力
4. 只在 hover 出現的內容，C3、D5 沒說怎麼算：截圖是靜態的，案例成果只在 HTML 或 hover 才出現。`design-principles.md` P4 把 hover 才看得到的關鍵資訊列為不做，但 D5 與 C3 沒說這種證據算不算「容易被看到」或「主張旁邊有事實」
5. S6 的錨點沒涵蓋「少了整個必要類型」：3 分錨點是「欄位比頁面內容少或不一致」，1 分是「沒有或與內容不符」。有 `WebSite`、卻缺 `content-model.md` 要求的整個 `Organization`，落在兩者之間，本次照規則取低分給 2
