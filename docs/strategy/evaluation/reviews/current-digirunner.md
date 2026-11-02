# 評審：現站 digiRunner 產品頁

評審時的代號 r06，對象 `https://www.tpisoftware.com/products/digirunner`（`page-map.csv` 的舊網址 `/digirunner-api-management` 轉址到這裡），對照 `docs/strategy/briefs/digirunner.md`。`reviewer` 只看匿名化的截圖與 HTML（渲染後的 DOM），不知道這一組是什麼，也沒看到其他組的分數；從 canonical 與 Nuxt 的 markup 認出這是現站。以下是評審的原文，只調整標題層級。

截圖：[`../current/digirunner-1280-first.jpg`](../current/digirunner-1280-first.jpg)、[`../current/digirunner-375-first.jpg`](../current/digirunner-375-first.jpg)、整頁 [`1280`](../current/digirunner-1280-full.jpg)、[`375`](../current/digirunner-375-full.jpg)。理由裡的 `page-<width>-partNN.jpg` 是整頁圖由上而下每 1600 px（375 寬是 1400 px）切成的段落。

第一印象：第一屏是兩個人走在機房裡的圖庫照片，上面疊 digiRunner 的 logo 與「專為關鍵系統應用而生」。5 秒內看得出這是一個叫 digiRunner 的軟體產品，但看不出它是 API 管理平台，也看不出給誰用。整頁很長，口號式標題多，有幾個區塊在截圖裡是空白的。

## 設計：平均 1.8，未通過

| 項目 | 分數 | 理由 |
|---|---|---|
| D1 第一屏的辨識度 | 2 | `page-1280-first.jpg` 與 `page-375-first.jpg` 都只有 logo、口號與兩個按鈕，沒有「API 管理平台」這個類別詞，也沒有金融、政府或 IT 主管。主視覺是機房加人像的圖庫照片，375 寬還疊了半透明人像。這和 `competitors.md` 記的同業科技圖是同一類，換掉 logo 認不出是誰。勉強看得出是軟體或基礎設施產品，所以給 2，不給 1 |
| D2 與設計原則一致 | 1 | 明顯違反多條原則的「不會怎麼呈現」：P3「不用開放圖庫的照片」：hero 的機房人像、「四大機制」右側的人像（`1280-part04`）、金檢段的背景照（`1280-part06`）都是圖庫照片。P1 與 P2 的 no eyebrows：h2 上方有橘色小標，例如「Flexible Deployment」「API Composer」「國內唯一符合遵循金管會法令」。P2 不用左側色條：「AI Gateway」各項（`1280-part01`）與「四大機制」都用了左側橘色條。P3 no icon-topped feature cards：「五大應用」（`1280-part03/04`）與「零停機…零信任」四格都是 icon 加螢光筆底線的卡片。P4 的輪播與浮動元素：客戶 logo 跑馬燈、文章卡片輪播（`1280-part08`），以及右下角浮動的「預約演示」吉祥物按鈕。P4 的陰影：文章卡片與主控台截圖有陰影 |
| D3 視覺層級 | 2 | hero 的第一眼焦點是照片裡的人，不是文字。各段的 h2 用細字灰色，上方的橘色粗體小標反而更搶眼（`1280-part02`）。段落順序是 AI、四個「零」、平台、部署、產業頁籤、五大應用、四大機制、Composer、沙盒與主控台、資安、金檢、Kong 比較、客戶、案例，和 brief 依 IT 主管評估順序排的「接得上 → 部署 → 資安 → 合規 → 尖峰 → 軌跡 → 試用 → 案例」對不上。1280 寬的「成功案例」標題下約 450px 完全空白（`1280-part07`），重要的證據被藏住 |
| D4 版面與節奏 | 2 | 底色有變化，但有多處大面積空白：「成功案例」下方空白（`1280-part07`）；「API Composer」左半只有字距拉很開的「A P I C o m p o s e r」與兩個 CSV、XML 標籤，其餘是空的（`1280-part04`）；「API 沙盒模擬測試」下方只剩一個空框，圖沒有出現（`1280-part05`）。header 的「投資」被搜尋 icon 蓋住（`1280-first`）。標題與行距在各段之間不一致 |
| D5 證據的呈現 | 2 | hero 下方的兩個證據點（7 項發明專利、ISO27001，`1280-part01`）清楚可見，這是優點。其他證據的問題：客戶只出現在跑馬燈的 logo 牆裡；案例卡在 1280 寬看不到（空白），375 寬淡到幾乎讀不出來（`375-part11`）；Global Finance 獎項埋在案例內文的最後一句；最醒目的「證據」是 Kong 比較表加皇冠圖示（`1280-part06`），內容都是 `to_confirm`，觀感上像自己宣稱勝出，不像紀錄 |
| D6 窄螢幕 | 2 | 沒有橫向溢出。主要問題：hero 文字壓在照片與疊加的人像上（`375-first`），主要 CTA「預約演示」用深色膠囊，不易辨識；「五大應用」直接堆成一長串置中的 icon 卡（`375-part06`）；案例區的文字與 logo 停在低透明度（`375-part11`），看起來進場動畫沒有照減少動態的設定完成；重點（法規、案例）被推到第 9–11 屏以後 |

要改的地方：
- D1：第一屏用文字寫出「API 管理平台」與它處理的事。換掉機房人像照，改成畫「接進既有系統」的介面片段或圖解
- D2：拿掉圖庫照片、eyebrow 小標、左側色條、icon 卡片格、輪播、浮動按鈕與陰影
- D3：照 brief 的段落順序重排。每段的 h2 要是該段最醒目的文字。案例要在畫面上看得到
- D4：處理空白區塊（案例、API Composer、沙盒圖），統一標題樣式與段距
- D5：案例改成具名的「作業 → 成果 → 連結」紀錄格式，獎項跟台新案例寫在一起。拿掉以 `to_confirm` 內容組成的 Kong 比較表
- D6：375 寬重新安排，把 hero 的類別說明與 CTA 放在不壓照片的位置。確認案例在減少動態時直接顯示

## 文案與行銷：平均 1.8，未通過

| 項目 | 分數 | 理由 |
|---|---|---|
| C1 定位清楚 | 1 | h1 是「專為關鍵系統應用而生」，hero 沒有副標說明類別、對象或差異。messaging 的定位與 brief 第 1 段要求的「類別（API 管理平台）＋用途」都沒有出現在第一屏 |
| C2 對受眾的價值 | 2 | 部分段落對得上 IT 主管的疑問（資安標準清單、沙盒、即時主控台、金檢清單），但多數是功能清單或公司自述。例如「五大應用」的說明是「在當今的數位時代，企業面臨極大的競爭壓力…保持領先地位」，「API 管理為核心 共塑產業生態新未來」也是。沒有用 IT 主管的任務組織段落 |
| C3 證據支撐 | 2 | 抽查 4 筆 confirmed 事實，頁面文字都與 `facts.yaml` 的 `source.quote` 一致：`digilism-patents-7`、`cert-iso27001-digirunner`、`digirunner-security`、`digirunner-case-taishin` 加 `award-global-finance-2020`。但頁面同時放了多個 `to_confirm` 的主張：「國內唯一符合遵循金管會法令」（`digirunner-claim-fsc-only`）、金融頁籤的「100 % 符合金融檢查規範」、Kong 比較表五列（`digirunner-vs-kong-*`）。「零失誤監控」也沒有事實依據。TPS 等可以撐住「零停機」「零阻塞」的事實沒有出現 |
| C4 CTA 與轉換路徑 | 3 | hero 有「預約演示」（主要轉換）與「30 天免費試用」，右下角有浮動的預約演示，頁尾有「與聯絡我們」與電話。問題：hero 的兩個按鈕是 `<button>`，HTML 裡看不出會到哪裡；試用沒有寫出條件（雲端版的 AWS 費用）；中段多個 CTA 只寫「了解更多」；頁尾收束寫的是「導入 DigiLism 企業服務中台 (iPaaS)」，不是這一頁的 demo |
| C5 符合 brief | 2 | brief 第 3、4、5、6、8、10 段有對應的內容，但這些段落的寫法正是 brief「與現有頁面的差異」要求改掉的：四個「零」沒有拆開；醫療、物聯網、保險頁籤還在；Kong 比較表還在；沒有政府規範的對應；沒有第 9 段「先試用再決定」；第 7 段沒有 TPS 與故障分流；第 11 段是舊文章；第 12 段的預約演示收束沒有做 |
| C6 語氣與文字品質 | 1 | messaging「本站不用的字」與 AI 腔大量出現：「無縫」「一站式」「領先地位」「數位轉型」「打造」「全方位」「國內唯一」「毫無畏懼！」「無死角」「強力引擎」「共塑產業生態新未來」；用「我們協助業者…」；「生命周期」與「生命週期」並存，表述也用了「佈署」。整頁文案與 `facts.yaml` 記錄的現站原文相同 |

要改的地方：
- C1：hero 加一句寫出類別與用途的說明（brief 第 1 段），口號不能單獨當 h1 的唯一訊息
- C2：各段改成回答 IT 主管的一個疑問，寫機制與條件。刪掉「數位時代的競爭壓力」這類公司自述
- C3：拿掉所有 `to_confirm` 的主張（國內唯一、100%、Kong 比較、零失誤）。TPS 要連同「取決於不同環境的配置」一起寫
- C4：hero 的兩個動作要寫清楚去處與條件，中段的「了解更多」改成說明目的地。頁尾收束改成 digiRunner 的預約演示
- C5：照 brief 的 12 段重寫
- C6：照 messaging 的「語氣與用詞」與 `writing-style` 原創改寫，去掉禁用字與驚嘆號

## SEO：平均 2.2，未通過

| 項目 | 分數 | 理由 |
|---|---|---|
| S1 搜尋意圖對應 | 3 | 頁面類型（產品頁）與導航與商業意圖相符，title 有類別詞。但 h1 與 hero 沒有「API 管理平台」。選型會比的條件分散在各處，試用條件沒有寫 |
| S2 主題涵蓋 | 3 | 涵蓋了多數共同子題：OAuth 2.0、OIDC、生命週期、地端與雲端及 K8s、AWS、ISO 27001、AI Gateway、API Composer。缺的是開發者入口或自助註冊、TPS 與高可用的具體數字、MCP、政府 API 規範，以及授權與試用條件。競品沒有的資訊只有 Kong 比較表，但它是 `to_confirm`，不能算數 |
| S3 title、description 與 h1 | 2 | title「digiRunner API 管理平台 - 昕力資訊TPIsoftware」有主要查詢的用詞。description 沒有部署、AI Gateway、試用，結尾是「可說是企業數位轉型的利器！」。h1「專為關鍵系統應用而生」沒有產品名，也沒有類別詞，跟 title 不一致 |
| S4 heading 結構 | 2 | 跳級：h2 直接接 h4、h5；eyebrow 做成 h3，放在 h2 前面；產業頁籤的 h3、h4 因輪播複製重複了四次；彈窗的「感謝您」「取消訂閱」也是 h3；金檢段的標題不是 heading；多數 heading 是口號 |
| S5 內部連結 | 2 | `/products/digirunner-cloud` 三處的錨點都是「了解更多」或只寫「digiRunner Cloud」；`/products/digilism` 的錨點也是「了解更多」；舊 blog 文章都寫「閱讀更多」；沒有連到產業頁、聯絡頁、案例內頁；連到的 `/whitepaper/api-strategies` 在新站是 draft |
| S6 結構化資料與內容一致 | 1 | JSON-LD 只有全站的 `WebSite`（含 SearchAction），沒有 `content-model.md` 規定 `kind: product` 要輸出的 `SoftwareApplication` |

要改的地方：
- S1：h1 與 hero 讓「digiRunner」與「API 管理平台」並列。部署、試用與授權條件、AI 功能各自寫成可找到的段落
- S2：補 brief 列的子題：自助註冊與登入、TPS 加條件、故障分流、MCP、國發會共通性 API 規範、試用條件
- S3：h1 改為「digiRunner API 管理平台」。description 照 brief 的方向重寫
- S4：heading 不跳級，eyebrow 不做成 heading，刪掉重複與彈窗的 heading
- S5：補 brief 列的連出，錨點寫目的地內容。不連 draft 頁
- S6：輸出 `SoftwareApplication`，欄位與頁面可見內容一致

## 門檻判斷

設計 1.8（D1–D6 全部低於 3）、文案與行銷 1.8、SEO 2.2，三份都未通過。

## 評審依據不足

- `site-review/SKILL.md`「Rubric」寫「介於兩個錨點之間時取低的」，但錨點只有 5、3、1。不清楚 4 和 2 什麼時候可以給
- 設計原則 P1 與 P5 是以首頁寫的。產品頁的第一屏要不要點出產業，`briefs/digirunner.md` 第 1 段只要求類別與用途，兩份文件沒有交代
- D1 要對照 `competitors.md`，但它記錄的是競品首頁，沒有競品的 API 管理產品頁
- C3 的錨點沒處理「頁面放了事實庫標為 `to_confirm` 的主張」：它不是「沒有證據」，而是和事實庫的決定衝突。這次給 2，要不要直接給 1，rubric 沒寫
- C4 錨點寫「符合 `site-profile.md` 的主要轉換」（聯絡業務），brief 則把這頁的主要轉換定為預約 demo。這次採 brief
- D6 與 D3 沒有說明，截圖裡因為進場動畫沒完成而看不到或變淡的內容要怎麼算。這次當作讀者實際看到的畫面扣分
- S5 錨點的「連入」與「沒有孤立頁」需要看其他頁面，但評審輸入只有這一頁的 HTML，無法評連入
