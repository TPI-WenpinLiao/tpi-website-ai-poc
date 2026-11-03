# 評審：試點新版首頁

評審時的代號 r04，對象是 `main`（eb0592e）build 出的 `/`，對照 `docs/strategy/briefs/home.md`。`reviewer` 只看匿名化的截圖與 `dist/` 的 HTML，不知道這一組是什麼，也沒看到其他組的分數。以下是評審的原文，只調整標題層級。評審寫的 SEO 平均是 4.3，照表內分數算是 4.2（25 ÷ 6 = 4.17），標題已改正，不影響門檻判斷。

截圖：[`../new/home-1280-first.jpg`](../new/home-1280-first.jpg)、[`../new/home-375-first.jpg`](../new/home-375-first.jpg)、整頁 [`1280`](../new/home-1280-full.jpg)、[`375`](../new/home-375-full.jpg)。首頁以 `prefers-reduced-motion: reduce` 截取，顯示的是靜態的緞帶圖，不是桌機的 3D 場景。理由裡的 `page-<width>-partNN.jpg` 是整頁圖由上而下每 1600 px（375 寬是 1400 px）切成的段落。

第一印象：只看第一屏，5 秒內就看得懂。h1「金融與政府的既有系統／原地接上 API 與 AI」寫出服務對象和要做的事，說明句交代昕力自己研發也負責導入。亮底白色方塊城市上有一條緞帶，和競品的深色發光晶片、光流差別很大。1280 寬的第一屏只露出城市上緣，緞帶和接點標籤要往下捲才看得到（`page-1280-first.jpg` 下緣）。

## 設計：平均 4.2，通過

| 項目 | 分數 | 理由 |
|---|---|---|
| D1 第一屏的辨識度 | 5 | 1280 與 375 的第一屏都看得到 h1、說明句、「聯絡業務」與「依產業看方案」（`page-1280-first.jpg`、`page-375-first.jpg`）。h1 寫了「金融與政府」「既有系統」「API 與 AI」。四家競品第一屏都沒寫服務對象，視覺上也都是發光科技物件（`competitors.md`）。換掉 logo 後，靠文字和亮底系統地圖仍分得出不是競品 |
| D2 與設計原則一致 | 4 | 主要決定都對得到原則。P1：h1 是面積最大的元素，兩行，沒有 eyebrow，說明句緊接在下方。P3：系統地圖標了「核心系統／既有系統／昕力的產品／AI 模型／新的服務」，漸層只用在緞帶（`page-1280-part01.jpg`）。P2：穩定度寫成年份加原文的紀錄列，數字是靜態的（`part04`）。P4：底色平塗，按鈕平塗。輕微違反 house rules 的有：footer 的「EMAIL」是大寫加字距的小標籤；header 下緣和 footer 分隔用細線（`page-1280-part04.jpg` footer）。案例和產品縮圖都是同一座城市的裁切，屬於 P5 允許的「沿緞帶的近景」，但圖本身沒有畫出各作業的內容 |
| D3 視覺層級 | 4 | 每屏都有一個主標題當焦點，順序和 brief 一致：hero、產業、案例、產品、OrientAI、紀錄。產業段在 1280 有區塊搶焦點：h2「規範要求，已做進產品」和兩個產業入口之間，約 300px 高的橘色緞帶占了最大面積。真正可點的「金融」「政府與公部門」只是內文字級的 h3 加一行文字，視覺上比緞帶弱（`page-1280-part01.jpg` 下半） |
| D4 版面與節奏 | 4 | 底色依序是白、白、淺灰（案例）、白（產品）、紫（OrientAI）、深紫（紀錄與 footer），長頁面有節奏，間距也一致。鬆散的地方：產品段左欄只有 h2，下方約 400px 空著，右欄才是清單（`page-1280-part03.jpg` 上半），碰到 P5「一段的文字擠在一側、另一半空著」。案例段每列文字垂直置中，列與列之間空白偏多（`part02`） |
| D5 證據的呈現 | 4 | 案例成果的「80%」「40%」加粗。紀錄段的年份用標題字級排成三欄，有具名客戶（華南銀行）和第三方評選（FT 2022、台灣精品獎 2024），像紀錄，讓人信任（`part04`）。不足的是案例段：右側城市近景占半欄，視覺權重比左側的成果原文高。產業段的法規事實只是 h3 下方的一行內文，不容易被看到 |
| D6 窄螢幕 | 4 | 375 寬有重新排過，不是縮小版：h1 兩行，CTA 並排；產品清單改成小縮圖加名稱；案例改成文字在上、圖在下。產業入口和第一則案例都在兩次捲動內出現（`page-375-part01`、`part02`）。有三個問題：(1) 產業段在 375 仍是兩欄，每行只剩 5–7 個字（「digiRunner API 管／理平台反應台灣開…」），讀起來吃力；(2) h2 和產業入口之間的橘色緞帶占了約 200px；(3) 系統地圖右側的標籤被裁掉，「AI 模型」貼著邊緣，「新的服務」沒有出現（`page-375-first.jpg`） |

要改的地方：
- D2：footer 的「EMAIL」改成和「電話」一樣的一般寫法，header 與 footer 的細線分隔改用底色色差，讓全頁都符合 house rules
- D3：產業段的焦點要落在兩個產業入口，不是緞帶。brief 的第 2 段是決策者「找自己的產業」的入口，目前最大的面積給了裝飾
- D4：產品段左欄的大片空白要處理，例如讓 h2 和清單的高度對應，或改變分欄比例，避免半個螢幕空著
- D5：案例段的成果原文要比旁邊的城市近景先被看到。產業段的法規事實要有自己的呈現，不能只是一行內文
- D6：375 寬的產業段改成上下排列，讓整句原文讀得順。系統地圖的標籤在窄螢幕要全部看得到，至少要有「新的服務」，它是 P3「接上」的終點

## 文案與行銷：平均 4.3，通過

| 項目 | 分數 | 理由 |
|---|---|---|
| C1 定位清楚 | 5 | h1 寫了為誰（金融與政府）和做什麼（既有系統原地接上 API 與 AI）；說明句寫了為什麼選這家（自行研發產品，也負責導入規劃與建置，對應 `DM-4`）。和 messaging 定位的短版一致，沒用「賦能」「頂尖」 |
| C2 對受眾的價值 | 4 | 產業段的 h2「規範要求，已做進產品」（`DM-1`）、案例段「AI 已用在每天的作業」（`DM-2`）、OrientAI 段的問答「資料會離開企業嗎？」（`DM-3`）、紀錄段「合作得久，有紀錄可查」（`DM-6`），都是決策者在意的風險與成果。產品段是例外：h2「API、AI、資安與碳管理，各有產品」加四個產品名稱，是公司角度的清單，看不出各產品替讀者解決什麼問題 |
| C3 證據支撐 | 4 | 抽查 9 則，都和 `facts.yaml` 的 `source.quote` 一字不差：`smartclaim-result`、`smartfilling-result`、`fraud-platform-result`、`digirunner-open-banking-fsc`、`digirunner-ndc-spec`、`orientai-on-prem-data`、`company-milestone-2008-finance`、`company-employees-630`（有寫出 2020 年，符合 note）、`award-ft-high-growth-2022`、`award-taiwan-excellence-2024`、`cert-iso27001-product-platform`，全部是 confirmed。不足有兩處。(1) h1 的核心主張「原地接上」（不必汰換既有系統），頁面上沒有任何一則事實撐住；`digilism-protocol-integration` 這類 `IT-4` 的事實不在頁面上。(2) 「金融聯防阻詐平台」放在 h2「AI 已用在每天的作業」底下，但它的 title 和 result 原文都沒提到 AI，這則歸類屬於主張超出事實 |
| C4 CTA 與轉換路徑 | 4 | 主要 CTA「聯絡業務」連 `/contact-us`，符合 `site-profile.md` 的主要轉換。它出現在 hero，也出現在紀錄段之後（讀者評估完穩定度的位置），header 也有入口。不足有兩處。(1) header 寫「聯絡我們」，hero 與頁尾寫「聯絡業務」，同一個動作用了兩種文字。(2) 頁尾的 CTA 只有按鈕，沒有一句話說明點了之後能做什麼，例如談需求、預約 demo（brief CTA 表的文案方向） |
| C5 符合 brief | 5 | 照 brief「製作階段的版本」的 5 段逐段對上。Hero 的 h1 與 brief 一字不差，說明句帶到 `DM-4`，次要動作是「依產業看方案」。產業段有金融、政府各一則原文，沒有引言。AI 成果段有三則原文，理賠、建檔各連解決方案頁，阻詐連成功案例。產品段有 4 個帶類別詞的產品名加縮圖；OrientAI 段用問句承接「不會。」。紀錄段有 6 則，依年份排，認證放最後，一個「聯絡業務」，加「關於昕力」連結。沒有多出 brief 已刪的段落（最新文章、服務卡片） |
| C6 語氣與文字品質 | 4 | 表述的部分精簡，沒有 AI 腔或空話。標點與格式不一致的地方：h2「企業要用 AI，資料留在企業端。」結尾有句號，其他 h2 都沒有；產業段金融那句沒有句號，政府那句有，還帶【】括號；金融那句以「昕力資訊」開頭，和 hero 說明句重複。原文本身的瑕疵（「反應」應為「反映」；「2020年以「TPIsoftware」 邁入國際」「流程 獲ISO27001」的空格）因為照引事實而留在畫面上，讀起來粗糙 |

要改的地方：
- C2：產品段要讓讀者看出每個產品解決什麼問題，或 h2 改寫成讀者的任務，不只宣告「各有產品」
- C3：h1 的「原地接上」要在頁面某處有事實撐住，例如接既有核心系統的那類 confirmed 事實。阻詐平台要嘛換到 AI 以外的脈絡，要嘛 h2 不要把三則都說成 AI，否則主張超出原文
- C4：header 和頁面內的聯絡動作統一用一個名稱。頁尾 CTA 補一句，說清楚聯絡之後的下一步
- C6：統一 h2 的結尾標點和產業兩句的句尾。照引原文的錯字與空格是否能修，交給事實庫處理，頁面不要自己改

## SEO：平均 4.2，通過

| 項目 | 分數 | 理由 |
|---|---|---|
| S1 搜尋意圖對應 | 4 | 品牌導航查詢（`昕力資訊`、`TPIsoftware`、`昕力資訊 官網`）點進來，第一屏就得到「這家公司做什麼、為誰做」。`台灣 AI 解決方案 公司` 有 OrientAI 地端與資料主權段承接。但 `search-intent.md` 記錄 `昕力資訊` 的實際需求是公司近況新聞，brief 把它交給 `/media-center`，`<main>` 裡卻沒有任何往媒體中心的入口，只在 footer |
| S2 主題涵蓋 | 4 | 有涵蓋的子題：成立年份（2005）、台灣精品獎、digiRunner 產品名、地端部署與資料主權、法規要求（競品沒有）。涵蓋不足的：`昕力資訊 官網` 的「四條產品線」只看得到 h2 的四個類別詞和四個產品，DigiLism 這個名稱只出現在 description 與 footer。`企業數位轉型 軟體公司` 的「以整合平台取代單點系統」幾乎沒碰到 |
| S3 title、description 與 h1 | 5 | title「昕力資訊 TPIsoftware｜金融與政府的 API 與 AI 軟體」，公司名兩種寫法放在最前面，有服務對象與做的事，沒有類別詞。description 有公司名並列、服務對象、「研發並導入」、家族名「數位轉型（DigiLism）」，寫得讓人想點。h1 與兩者一致，且依 brief 取捨第 3 項不含品牌詞 |
| S4 heading 結構 | 4 | h1、h2、h3 不跳級。h2「規範要求，已做進產品」「AI 已用在每天的作業」「API、AI、資安與碳管理，各有產品」「企業要用 AI，資料留在企業端。」都說得出段落內容。但三則案例和四個產品名都不是 heading，只掃 heading 看不出頁面涵蓋哪些作業與產品。「合作得久，有紀錄可查」偏口號 |
| S5 內部連結 | 4 | `<main>` 的連結有 /contact-us（×2）、#industries、/industries/finance、/industries/government、/solutions/smartclaim、/solutions/smartfilling、/success-story、/products/digirunner、/products/systalk-viki、/products/gadodido、/products/greenswift、/products、/orient-ai、/about-us。錨點文字都描述目的地，digiRunner 有帶類別詞「API 管理平台」。brief「連出」表列的 `/products/gadoscout` 沒有連，家族頁（systalk-ai、digilism、esgswift）也沒有。家族頁依「製作階段的版本」可以理解為已移出，gadoscout 則對不上 |
| S6 結構化資料與內容一致 | 4 | 有 `Organization`（name、alternateName、logo、url、address、7 個 contactPoint）加 `WebSite`，類型符合 `content-model.md` 的首頁規定，電話和 footer 一致。欄位比規定少：`content-model.md` 寫站內搜尋（M6）上線後 `WebSite` 要加 `potentialAction`（SearchAction），頁面 header 有搜尋入口，JSON-LD 卻沒有；`sameAs` 沒有輸出 |

要改的地方：
- S1：`昕力資訊` 查詢背後是公司近況的需求，`<main>` 內需要有可被看見的路徑通到媒體中心，或確認 footer 的入口就夠
- S2：DigiLism（數位轉型家族）要在頁面內文出現。四條產品線要能從可見文字讀出來，不只靠 description 與 footer
- S4：案例與產品名稱要能從 heading 掃到
- S5：補上 brief 列的 `/products/gadoscout`，或在 brief 確認 4 個產品的清單
- S6：站內搜尋已上線的話，`WebSite` 補上 `potentialAction`，符合 `content-model.md`

## 門檻判斷

設計 4.2、文案與行銷 4.3、SEO 4.2，三份 rubric 都沒有任何一項低於 3，三份都通過，整體通過。

## 評審依據不足

1. `docs/strategy/briefs/home.md` 的「製作階段的版本」（5 段）和下方的「內部連結／連出」「CTA」表沒有同步。連出表仍要求家族頁、gadoscout、6 個服務頁，CTA 表仍有第 8 段，5 段版卻寫「一個動作『聯絡業務』」。S5、C4、C5 要自己判斷以哪一份為準
2. 同一份 brief 第 4 段的 5 段版只寫「4 個產品名稱（帶類別詞）」，沒寫是哪 4 個。頁面用 SysTalk.VIKI 而不是家族 SysTalk.ai，沒有 gadoScout，無法判斷是否符合
3. `docs/strategy/design-principles.md` 的 P5「版面」與「參考」仍寫「8 段」，P2「版面」列的穩定度事實（子公司、Google Cloud）也和定案的 6 則紀錄不同，和開頭「定案」的 5 段放寬互相矛盾
4. `design-principles.md` P4 規定 header 的動作是「聯絡業務」，header 寫「聯絡我們」。header、footer 是全站共用元件，rubric 沒寫評首頁時要不要把共用元件算進去（本次有算，但只當輕微扣分）
5. `docs/strategy/messaging.md` 的 `DM-2` 把 `fraud-platform-result` 列為「AI 用在核心作業」的證據，但該事實原文沒有提到 AI。C3 要評頁面還是評 messaging 本身的歸類，依據沒有說清楚
6. `rubrics/design.md` 只有 5、3、1 的錨點，沒有 4。SKILL.md 寫「介於兩個錨點之間時取低的」，但「只有一兩處輕微違反」同時符合 3 的描述，也可以讀成「介於 3 與 5 之間」，D2 這類情況該給 3 還是 4 沒有說明
7. `docs/strategy/search-intent.md` 記錄 `昕力資訊` 的實際結果是新聞，brief 決定不承接。S1 的錨點「搜尋者點進來能直接得到想要的」要依實際 SERP 意圖還是 brief 的取捨判斷，rubric 沒有說明
8. `docs/ia/content-model.md` 寫「站內搜尋（M6）上線後」`WebSite` 加 `potentialAction`，但評審的輸入裡沒有文件說明站內搜尋是否已算上線，S6 的扣分依據不完全確定
