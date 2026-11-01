# 設計原則與參考（#166）

這一版依 `taste-skill` 的 house rules 改過（2026-11-01，使用者決定）：原則本身與依據不變，「會怎麼呈現」「不會怎麼呈現」與「原則與現有限制」改成不違反 house rules 的做法，衝突時的處理見 `.claude/skills/design-concept/SKILL.md`「用 `taste-skill` 檢查原型」。第三輪再改一次（2026-11-01，使用者決定）：品牌色（紫、品紅、橘）完整使用，影像改成 HTML 產品介面片段與 SVG 架構圖解，不用開放圖庫的照片；三個方向由 `design-director` 以軟體、技術公司的網站為參考定義，寫在 `docs/strategy/concepts/directions.md`。

**定案（2026-11-01，`design-approved`）**：使用者選定第四輪的 `ribbon-route`（`docs/strategy/concepts/ribbon-route/`）。第四輪要做出品牌形象網站的驚豔感，下列放寬已寫進各條原則與「原則與現有限制」，製作階段（#167）照這一版做：

- 漸層只用在串起接點的緞帶（紫→品紅→橘），文字、按鈕、底色仍平塗（P3、P4）
- WebGL 渲染的系統地圖可以當首頁的主要影像，介面片段改用在產品、案例頁（P3、P5）
- 首頁 5 段，每段一句標題加最多一句說明或一則事實，細節移到產品、產業頁（P5）
- 標題用中文襯線 webfont，只取用到的字（P1）

本檔是分階段流程設計概念階段的第一份產出（`.claude/skills/design-concept/SKILL.md`「1. 設計原則」「2. 參考對照」）。它決定試點頁（`docs/strategy/site-profile.md`「試點頁面」）在畫面上要傳達什麼，用來否決不符合的設計。各方向的首頁原型（`docs/strategy/concepts/<direction>/`），每個主要視覺決定都要指到這裡的一條原則（P1…P5）；`reviewer` 的設計 rubric D2「與設計原則一致」也拿本檔評分。各方向共用的論點與文案在 `docs/strategy/concepts/argument.md`、`docs/strategy/concepts/copy-deck.md`。

- 輸入：`docs/strategy/messaging.md`（#165，`strategy-approved`）的定位句、`DM-1`～`DM-7`、`IT-1`～`IT-8` 與「語氣與用詞」；`docs/strategy/briefs/home.md` 的段落結構與 CTA，另兩份 brief（`digirunner.md`、`finance.md`）；`docs/strategy/competitors.md` 與 `docs/strategy/competitors/*.png`；現有設計系統（`design-system` skill、`src/styles/tokens.css`、`docs/design/motion.md`、ADR 0003、`docs/design/brand-assets.md`）
- 原則限制「傳達什麼」，不規定唯一的樣式。每條原則最後一列寫各方向可以在哪裡不同；亮色或深色、有沒有 3D、用不用插圖，都不是原則決定的事
- 「會怎麼呈現」寫的是原則在 house rules 之內的做法；版面、字體與配色的實際數值照 `docs/strategy/concepts/directions.md` 的方向定義
- 事實寫成反引號包住的 `fact:` 加事實 id，只用 `docs/strategy/facts.yaml` 裡 `locale: zh-TW`、`status: confirmed` 的條目。本檔不寫文案；原型的文字照 brief 與 messaging，缺的標為待補

## 原則一覽

| # | 原則 | 主要依據 |
|---|---|---|
| P1 | 第一屏用文字說出服務對象與做的事，影像只能幫腔 | 定位句；`competitors.md`「本站缺」第 1 項 |
| P2 | 證據長得像紀錄：事實原文、條件與出處擺在一起，跟表述分開 | messaging 開頭的規則、「語氣」；`DM-2`、`DM-6` |
| P3 | 畫的是「接進既有系統」，不是「全新的未來」 | 定位句「接進既有系統」；`IT-4`、`DM-4`、`IT-6` |
| P4 | 克制與可預期：光與動態只標示資料、狀態與下一步 | `DM-1`、`DM-3`、`IT-5`；決策者「評估風險」的任務 |
| P5 | 版面照讀者的判斷順序分輕重，每段回答一個問題 | `briefs/home.md`「段落結構」的排序理由 |

## P1 第一屏用文字說出服務對象與做的事，影像只能幫腔

依據：messaging「定位」（替金融與政府，把 API、資料與 AI 安全接進既有系統）與「定位句的依據」第 2 列；`competitors.md`「比較」表的「定位說法」列（四家第一屏都沒寫服務對象，SYSTEX 的 h1 是空的、Syscom 的文字做在 banner 圖裡）；`briefs/home.md` 第 1 段（h1 寫定位句，說明第一句以「昕力資訊（TPIsoftware）」開頭，次要動作是「依產業看方案」）。rubric D1 要求只看第一屏就說得出公司做什麼、給誰。

會怎麼呈現：

| 面向 | 做法 |
|---|---|
| 版面 | h1（定位句）是第一屏面積最大、最先被讀到的元素。375 與 1280 寬的第一屏都看得到 h1、緊接在 h1 下方的說明句、主要 CTA，以及「金融」「政府」兩個產業名稱。產業名稱寫在 h1 或說明句裡，或做成次要動作的文字連結；它是可點的入口，不做成 h1 上方的小標或膠囊標籤（house rule：no eyebrows） |
| 字體 | h1 在每個寬度都不超過兩行（house rule），文案控制在約 16 個全形字寬（`concepts/copy-deck.md`「hero」的換行計算），字級照方向的 type 系統，字重足以在影像上獨立成立。說明句緊接在 h1 下方、跟 h1 一起出現，一句交代公司與做法；48rem 以上排成一行，按鈕放在說明句下方（使用者 2026-11-01 指定）。h1 不把其中一個詞改成斜體、別的顏色或底線（house rule：no styled accent word） |
| 色彩 | 文字與背後最不利像素的對比照 WCAG 2.2 AA；文字側的背景由版面讓出，或是一整片平塗色，不靠加深遮罩硬撐（`design-system`「影像」）。照片上的文字只能墊中性遮罩，不用漸層（house rule：no gradients 的唯一例外） |
| 影像 | 影像、介面片段或圖解放在文字旁或文字之後，換掉它第一屏的意思不變。影像表達的是 P3 的「接進既有系統」，不是一般的科技感；沒有東西壓在 h1 或說明句上面 |
| 動態 | h1 與 hero 靜態圖不做會延後出現的進場動畫（LCP，`design-system`「動態」）；第一屏的動態不能延後文字出現。方向的 signature move 若是 h1 的進場，要在方向說明寫出 LCP 的代價 |

不會怎麼呈現：

- 只有一句氛圍短標配全幅影片或發光物件（SYSTEX 的「萬物皆數」加晶片方塊，`competitors/systex-1280.png`）。現行 hero 的疊層玻璃板（`src/assets/design/hero-modular-stack.webp`）和 SYSTEX 的發光方塊同屬深色科技物件，換掉 logo 後不容易分辨；保留 3D 的方向要讓文字與產業入口承擔辨識度，不能讓物件承擔
- 輪播 banner、把標題做在圖片裡（Syscom），或 375 寬時 h1 被裁切、被推出第一屏、斷成三行以上
- h1 放公司名或口號（GSS 的 h1 是英文公司名）。品牌詞由 title 與說明第一句承擔（brief「取捨」第 3 項）
- h1 上方的 eyebrow、膠囊標籤、「New」小標，或用大寫小字加字距的標籤（house rules）
- 第一屏出現「數位轉型」「頂尖」「賦能」等 messaging「本站不用的字」當主視覺文字

各方向可以不同的地方：hero 的構圖（文字左右分欄、句子被畫面拆開、文字壓在平塗色塊上、文字加下方的介面片段）、影像的種類、深色或亮色的底色。

## P2 證據長得像紀錄：事實原文、條件與出處擺在一起，跟表述分開

依據：messaging 開頭的規則（主張裡不放數字、客戶名或最高級說法，這些只能出現在引用的事實裡）與「語氣」（數字連同事實裡的條件一起寫，例如 `fact:digirunner-tps` 的「取決於不同環境的配置」、`fact:digirunner-cloud-trial-terms` 的費用說明）；`DM-2`（成果寫得出來）、`DM-6`（穩定度看得到）；`competitors.md`「不適合本站」的數字動畫（FPT 在 script 沒載入時只剩「1+」）與「本站缺」第 2 項（GSS 的具名客戶加受訪者職稱比 logo 牆說得多）。rubric D5 評證據是否容易看到、讓人信任。

會怎麼呈現：

| 面向 | 做法 |
|---|---|
| 版面 | 事實用固定的「紀錄」格式，全頁一致。案例寫成「作業 → 成果 → 連結」三個部分，用位置與留白分開，不畫框（brief 第 3 段的 `fact:smartclaim-result`、`fact:smartfilling-result`、`fact:fraud-platform-result`）；穩定度寫成一列年份或項目加原文（brief 第 7 段的 `fact:company-founded`、`fact:company-milestone-2008-finance`、`fact:company-subsidiaries-sg-vn`、`fact:cert-iso27001-product-platform`、`fact:company-google-cloud-partner`）。條件小字緊貼在數字下方，不放到註腳 |
| 字體 | 事實與表述用同一個內文字體，靠位置、字級與字重分開：例如事實原文固定放在表述的下方或右側、用內文字級，表述用標題字級。年份與數字用等寬數字（`font-variant-numeric: tabular-nums`），不用等寬字體（house rule：no monospace）。標籤用一般大小寫、可讀的字級，不用大寫小字加字距。成果原文照引，不改寫成更強的短句 |
| 色彩 | 證據區塊用底色的一階色差或一整片平塗色和其他段落分開，不用細框線、左側色條或陰影（house rules：no thin rules、no shadows）。品牌色（紫、品紅、橘）可以當 accent 標出事實的類別、狀態與重點，同一種事實全頁用同一個顏色；成果數字不塗成漸層 |
| 影像 | 具名客戶以文字呈現客戶名稱（`fact:digirunner-case-taishin`、`fact:digirunner-case-taipei-city` 這類具名案例），合作夥伴與客戶分開標示（`competitors.md`「本站缺」第 2 項）。證言若採用（見「待確認」第 3 項），寫出說話人與原文，不配圖庫人像 |
| 動態 | 數字直接輸出在 HTML，不做數字跳動或計數動畫（brief 第 7 段）。證據可以在段落進場時上移淡入一次，減少動態時直接顯示 |

不會怎麼呈現：

- 把一個百分比放大成整屏的主視覺而省略事實原文的其他部分，或拿掉條件（例如只寫 TPS 數字、不寫「取決於不同環境的配置」）
- 數字動畫、輪播的客戶 logo 牆、沒有標示是客戶還是原廠的 logo 牆（SYSTEX）
- 用裝飾圖、icon 或形容詞大標取代證據（「值得信賴的夥伴」這類標題底下沒有事實）
- 等寬字的資料標籤、eyebrow 小標、01／02／03 的編號、細線框起來的卡片、一排同樣大小的證據卡（house rules）。有順序時用真正的 `<ol>` 或位置表示
- 把 `to_confirm` 的獎項、員工數、專案數放進畫面（messaging「缺少證據的主張」第 2、3 項）；原型裡也不放假數字、範例客戶或範例證言佔位，缺的寫「待補」

各方向可以不同的地方：紀錄格式的長相（表格、時間軸、整段文字裡的標示、頁邊註記）、證據段在頁面上的位置與面積。

## P3 畫的是「接進既有系統」，不是「全新的未來」

依據：定位句「把 API、資料與 AI 安全接進既有系統」；`IT-4`（接上既有系統，不必先汰換）、`IT-6`（AI 流量和 API 走同一道 Gateway）、`DM-4`（產品與導入由同一家負責）；`briefs/home.md` 第 4 段（每個產品家族寫解決什麼問題）與第 6 段。`competitors.md` 的「視覺語言」列：四家用的是晶片、手指、光流、漸層這類和業務無關的科技圖。

會怎麼呈現：

| 面向 | 做法 |
|---|---|
| 版面 | 產品家族依「要解決的問題」排（接既有系統與 AI 串接、AI 模型、碳盤查、身分驗證，brief 第 4 段），不依內部組織排。能表達接點的地方用「既有系統、昕力的產品、新的服務」左中右或上中下的位置關係，用相鄰、重疊或一條平塗色帶表示接上，不畫細線箭頭 |
| 字體 | 圖解與介面片段裡的標籤用真實的系統類別名稱（核心系統、大型主機、WAF、AI 模型，取自 `fact:digilism-protocol-integration`、`fact:digirunner-nginx-waf` 等事實的用詞），產品名照 messaging「產品與公司名寫法」 |
| 色彩 | 既有系統用中性色，昕力的產品與接點用方向配色裡的 accent 或一個 field 色，讓「誰接了什麼」一眼分得出來。方塊與底色平塗，不用光暈；串起接點的緞帶用紫→品紅→橘的漸層，讀成資料從既有系統經過昕力的產品流到新的服務（定案的放寬，只用在緞帶）。品牌色完整使用：紫、品紅、橘可以分別標昕力的產品、AI 的流量與接點，全頁的對應固定，每個方向在 `concepts/directions.md` 寫明 |
| 影像 | 影像要能讀成「層」「接點」「管線」「閘道」。本站沒有產品截圖，接點用兩種東西畫：在 HTML 裡照事實文字做的產品介面片段（根元素標 `data-ui`，標「示意」，taste-skill `references/imagery.md` §7），以及 SVG 架構圖解（既有系統、昕力的產品、新的服務的位置關係）。不用開放圖庫的照片。`src/assets/design/` 的抽象渲染可以沿用，但它不畫接點，不當表達接點的主要影像。定案的首頁用 WebGL 渲染的系統地圖：白色方塊是既有系統，頂面上色的是昕力的產品與 AI 模型，標籤寫系統類別，手機與減少動態時用同一個世界渲染的靜態圖；介面片段留給產品、案例頁 |
| 動態 | 動態表達因果：捲動時片段的狀態往前走、模組歸位、流量通過閘道。動態停下來的畫面（減少動態時）仍然看得出接點 |

不會怎麼呈現：

- 和做的事無關的科技圖：晶片、手指觸控、地球網路、光流（GSS、SYSTEX、Syscom 的主視覺）
- 「全部推倒重來」的意象：空白的未來城市、從零長出的新平台，或只畫昕力的產品、沒有既有系統的圖
- AI 擬人化：機器人、發光大腦、對話泡泡當主視覺（AI 對話視窗本站也不做，`competitors.md`「不適合本站」）
- 把產品家族做成同一種卡片加 icon 的格子，讀不出各自解決什麼問題（house rule：no icon-topped feature cards）
- 灰色長條拼成的假儀表板、裝進筆電或瀏覽器外框的截圖、發光或玻璃質感的接點（house rules）

各方向可以不同的地方：用介面片段或 SVG 架構圖解表達接點；接點畫在 hero、案例段還是產品家族段。

## P4 克制與可預期：光與動態只標示資料、狀態與下一步

依據：`DM-1`（規範要求做在產品裡）、`DM-3`（資料、權限與用量都在掌控內）、`IT-5`（使用軌跡都看得到）；messaging「語氣」（寫產品做的事，不寫形容詞）；決策者來首頁「評估導入風險、長期合作風險」（`briefs/home.md` 第 6、7 段）。受眾是受監管的金融與公部門，畫面本身要像一個「受控」的系統。現有設計方向也已規定光只用在線條、外框、焦點與 hover（`design-system`「設計方向」）。

會怎麼呈現：

| 面向 | 做法 |
|---|---|
| 版面 | 一套格線、一組左右相等的外側邊距貫穿全頁，對齊清楚。header 是一條普通的橫列：wordmark、3–5 個文字連結、一個「聯絡業務」動作；聯絡業務的入口位置固定且可預期（hero、header、頁尾），讀者不用找 |
| 字體 | 層級少而明確：全頁最多五種字級，實際做事的是一個很大、一個小。字體最多兩種，照方向的 type 系統。不靠字體種類變化製造氣氛 |
| 色彩 | 一個底色、一個文字色、一個 accent，照方向的配色；段落可以換成一整片平塗色。品牌色（紫、品紅、橘）完整使用（使用者決定，2026-11-01），當 accent 標接點、狀態與重點，每種顏色在全頁只代表一件事；按鈕與文字的對比照 WCAG AA。內文用完整的文字色，不用淺灰 |
| 影像 | 每張圖都有任務（P3 的接點、P2 的證據或 P1 的幫腔），同一頁同一種裁切比例與處理方式 |
| 動態 | 動態只表達狀態與因果：hover、focus、展開、捲動時的接上與歸位，每段的元素進場一次（上移加淡入，只動 transform 與 opacity）。循環動畫只放在一處以內，減少動態時整頁停在完成狀態（`motion.md`） |

不會怎麼呈現：

- 自動播放的輪播、自動切換的頁籤、背景影片
- 大面積霓虹光暈、粒子特效、滑鼠跟隨的發光，或讓文字閃爍、跳動的效果
- 玻璃質感、背景模糊的面板、浮動的膠囊導覽，以及靜止元素上的陰影與光暈（house rules）
- 浮動聊天視窗、會遮住內容的彈出層（`competitors.md`「不適合本站」）
- 需要猜的互動：只有 hover 才看得到的關鍵資訊、沒有文字標籤的 icon 按鈕

各方向可以不同的地方：底色的深淺（深色場景、亮色紙面或整片的色塊）、平塗色塊的多寡、固定聯絡入口的形式（header 按鈕或段落裡的入口）。

## P5 版面照讀者的判斷順序分輕重，每段回答一個問題

依據：`briefs/home.md`「段落結構」的排序理由（先確認「是不是為我做」：hero、產業；再看「做得到嗎」：案例、產品、OrientAI；最後看「找這家安不安心」：導入、穩定度，再聯絡）與「受眾與任務」（兩次捲動內找到自己的產業入口與一則有成果的案例）。`competitors.md`「不適合本站」：FPT 約 11,100 px 的長首頁；`competitors.md`「首頁結構」：GSS、SYSTEX 每段用同一種卡片格。rubric D3 與 D4 評視覺層級與節奏。

會怎麼呈現：

| 面向 | 做法 |
|---|---|
| 版面 | 8 段各自有不同的版型密度：hero、產業入口、案例三段的視覺權重最高；產品家族是可掃讀的索引；穩定度是緊湊的紀錄列；聯絡是收束。375 寬重新安排，不是縮小版：產業入口與第一則案例在兩次捲動內出現 |
| 字體 | 每段都有一個標題，寫這段回答的問題的答案（文案在 `concepts/copy-deck.md`），兩行以內。字級依段落重要性分級，但全頁不超過五種字級；不是每段都用同一級 h2 樣式加同樣的留白 |
| 色彩 | 用底色的色差或整片平塗色標出三組判斷（是不是為我做、做得到嗎、安不安心），讓長頁面有節奏；不用分隔線，也不是每段交替黑白 |
| 影像 | 每段的圖都是這一段的內容（案例作業的介面片段、產品的介面片段、這一段的架構圖解），不是封面圖；產品與案例頁至少 4 張圖（taste-skill 的下限，由介面片段滿足，SVG 不算）；首頁的圖是系統地圖與沿緞帶的近景，不套這個下限 |
| 動態 | 進場動態只用在每段的主要元素（標題、文字、圖依序錯開 60–90ms），不讓每張卡片都依序飛入 |

不會怎麼呈現：

- 每段都是「標題 + 三或四張等大卡片」的重複格子，讀者分不出哪段重要；相鄰兩段用同一種版型（house rule：no rows of identical cards）
- 為了填版面加回 brief 已刪的段落（最新文章與新聞），或加 brief 沒有的段落（雇主品牌、新聞輪播）
- 超過半個螢幕高的空白，或一段的文字擠在一側、另一半螢幕空著（house rules）
- 375 寬時把桌機的多欄直接堆成一長串，產業入口被推到第四、五屏之後

各方向可以不同的地方：段落的分組方式、各段的版型（全寬、雙欄、索引表、整片色塊）、頁面總長度。

## 原則與現有限制

第 2 階段的方向說明要寫出放寬哪些現有限制與代價（`design-concept` skill 第 3 節第 3 步）。第一張表列出原則最可能碰到的現有限制，不代表要放寬。

| 現有限制 | 來源 | 可能碰到的原則 |
|---|---|---|
| 不載中文 webfont，`@font-face` 只有 Inter 與 JetBrains Mono 的 latin、vietnamese、greek | `design-system`「Token 分層」、`scripts/design/font-subsets.mjs` | P1、P2：中文標題與事實只能用系統字表現層級。改用中文 webfont 的方向要寫出字型檔大小與首次繪製的代價 |
| 每頁初始 JS 6 KB、延後載入 140 KB（gzip） | `motion.md`「效能預算」、`scripts/design/scene-budget.mjs` | P3：表達接點的互動圖解若要 JS，要放進預算 |
| 真 3D 只在首頁與部分 offering 頁的 hero 與功能章節，靜態圖是 LCP | ADR 0003、`motion.md`「3D 的使用範圍」 | P1、P3：3D 物件不能承擔第一屏的辨識度；拿掉 3D 的方向省下延後載入的 JS，但要另找表達接點的方式 |
| 色彩只用 `tokens.css` 的 token，品牌三色沿用現站，橘 500 只當裝飾 | `design-system`「規則」「Token 分層」、`docs/design/brand-assets.md`「品牌色」 | P2、P4：事實與接點的配色要在每一種底色上都過對比 |
| 影像只用抽象 3D 渲染，不放文字、數字、人物、真實產品 | `design-system`「影像」 | P3：用介面片段、SVG 架構圖解表達接點時要放寬 |

`taste-skill` 的 house rules 另外帶來下面的限制（使用者 2026-11-01 決定以 house rules 為準）。它們和上表的現有規則有幾處衝突，各方向的原型照這張表做，選定方向後由製作階段改 `design-system` skill 與 `tokens.css`。

| house rules 帶來的限制 | 和現有規則的關係 | 碰到的原則 |
|---|---|---|
| 品牌色（紫、品紅、橘）完整使用，可以當 accent 標接點、狀態與重點；inspector 加 `--allow palette-purple`（`design-concept` skill「用 `taste-skill` 檢查原型」） | 和現有規則一致：紫、品紅、橘用在連結、按鈕、資料標記與焦點。各色的對應與對比照 `concepts/directions.md` | P2、P3、P4 |
| 不用等寬字（真正的程式碼區塊除外） | 現有規則用 `--font-mono`（JetBrains Mono）排編號、eyebrow、資料標籤；照 house rules 這三種用法都拿掉，JetBrains Mono 的 `@font-face` 在首頁用不到 | P2 |
| 不用 eyebrow、01／02 編號、大寫小字加字距的標籤 | 現有元件 `SectionHeading` 的 `index`（「01」）與 mono `eyebrow` 要拿掉或改寫 | P1、P2、P5 |
| 不用細線、1px 框線、格線；靜止的元素不加陰影、光暈 | 現有規則的「光只用在線條、外框、焦點與 hover」不再適用，焦點框仍要看得到（無障礙） | P2、P3、P4 |
| 不用漸層（照片上文字的中性遮罩除外） | 定案放寬：漸層只用在緞帶（3D 場景與它的靜態圖），可以沿用 `--gradient-energy` 的三色；文字、按鈕、底色不用 | P3、P4 |
| 不用玻璃、背景模糊、浮動膠囊導覽 | 現行 `SiteHeader` 用 `backdrop-filter: blur(var(--glass-blur))`，要改成平塗底色 | P4 |
| 每頁至少 4 張圖，由介面片段滿足（SVG 不算），不用開放圖庫的照片 | 和「影像只用抽象 3D 渲染」衝突，要放寬；介面片段標「示意」，文字只用事實庫原文。定案後只用在產品、案例頁，首頁的主要影像是系統地圖 | P3、P5 |
| 版面與字體照 sheet：兩種字體以內、全頁五種字級以內，dealt 的 display 字體只有拉丁字母 | 中文仍落到系統字或另載中文 webfont，見上表第 1 列；拉丁 webfont 原型要放在方向目錄才能離線開 | P1、P2 |
| 動態層：每段進場、每個控制項有回饋、一張會動的圖，inspector 少於 8 個會動的元素就失敗 | `motion.md` 的預算與減少動態規則照舊；h1 的進場動畫碰到 LCP，見 P1「動態」 | P1、P4 |

## 參考

### 競品的觀察

以下引用 `competitors.md`（觀察日期 2026-10-31），不重做分析。

| 觀察 | 出處 | 對應原則 | 本站怎麼用 |
|---|---|---|---|
| 四家第一屏都沒寫服務對象；SYSTEX h1 是空的，Syscom 沒有 h1、文字做在 banner 圖裡 | 「比較」表「定位說法」列 | P1 | 第一屏用 h1 寫定位句與產業，這是最直接的區隔 |
| SYSTEX 第一屏是發光晶片方塊的影片，GSS 是手指與光流，Syscom 是紫藍光流 | 各家「視覺語言」列；`competitors/systex-1280.png`、`competitors/gss-1280.png` | P1、P3 | 深色科技物件是同業的共同語言，本站的影像要畫接點，不再加一種發光物件 |
| GSS 首頁案例寫出客戶名、成果百分比與受訪者職稱；FPT 案例在第三段 | GSS、FPT「證據呈現」列；「本站已有」第 1 項 | P2、P5 | 案例在 hero 與產業之後就出現，成果照事實原文 |
| SYSTEX、FPT 的規模數字靠動畫，讀取時一個在跳動、一個停在「1+」 | 「不適合本站」第 2 項 | P2 | 數字直接輸出在 HTML |
| SYSTEX 的 logo 牆是技術原廠，不是客戶 | SYSTEX「證據呈現」列；「本站缺」第 2 項 | P2 | 客戶與合作夥伴分開標示 |
| GSS、SYSTEX、FPT 都有常駐 AI 對話入口 | 「不適合本站」第 1 項 | P4 | 不做；固定的聯絡入口只連到聯絡頁 |
| FPT 首頁約 11,100 px，含雇主品牌與十則新聞 | 「不適合本站」第 4 項 | P5 | 只保留 brief 的 8 段 |
| 本站首頁已有產業入口，三家只依服務或產品分類 | 「本站已有」第 2 項 | P1、P5 | 產業入口提前到 hero 之後，並在第一屏露出產業名稱 |

### 非競品參考網站

只記錄查看日期，沒有截圖存進 repo。查看方式：2026-11-01 WebFetch 仍在 DNS 解析失敗，改用 `curl` 讀 HTML 文字，並用 Playwright（Chromium，1280 與 375 寬，第一屏與整頁）截圖目視，截圖只在查看時用，沒有保存。下表只寫頁面上看得到的東西；cohere.com 與 stripe.com/enterprise 有部分圖片或數字在截圖裡沒有畫出來，相關的視覺不寫。

| 網址 | 借鏡什麼 | 對應原則 | 不借鏡什麼 | 查看日期 |
|---|---|---|---|---|
| https://www.gov.uk/ | 第一屏只有一句 h1（「The best place to find government services and information」）加搜尋框，整片單一藍底，沒有影像。下面是「Popular on GOV.UK」6 個任務連結，再下面「Services and information」依主題列成清單，每列是連結加一行說明這類包含什麼，右側有箭頭。全頁幾乎沒有影像，只有「Featured」區的小 icon；沒有輪播 | P1（第一屏一句話說清楚這裡能做什麼）、P4（單色、沒有裝飾動態）、P5（入口依讀者的任務排，每個入口附一行說明） | 以搜尋框當第一屏的主要動作：本站的主要轉換是聯絡業務，不是搜尋。整頁都是同一種連結清單、沒有輕重：本站的案例與證據段需要比索引更高的視覺權重（P5） | 2026-11-01 |
| https://oxide.computer/ | 地端硬體廠商。第一屏 h1「On-prem that feels like the public cloud」，旁邊是標成「FIG. 1 OXIDE CLOUD COMPUTER」的機櫃圖與一個 CLI 終端畫面，用細線連在一起。往下用簡化的產品介面（虛擬機清單、資安驗證狀態、費用的「Included」表、Terraform 指令）當每張卡片的圖，不用抽象科技圖。「For finance」卡片畫的是交易所來源（NYSE、CME、NASDAQ、LSE）經過一個 normalizer 接到 instance 的線框圖。標籤、圖號、狀態用等寬字體，大寫小字 | P3（影像畫的是系統之間怎麼接，產業卡片用該產業的資料流示意，用簡化的產品介面而不是抽象科技圖）、P2（狀態與規格用固定格式，和標題文字分開） | 等寬字、大寫小字的圖號與狀態標籤，以及連接圖與介面的細線（taste-skill house rules：no monospace、no thin rules）。深色底加綠色等寬字的終端機風格：照搬會變成另一種「科技感」皮膚，本站的品牌色是紫、品紅、橘。第一屏下緣的 logo 列（「Powering the best teams」）只放 logo，不寫各家用了什麼、得到什麼：本站的具名客戶要連同案例事實出現（P2）。「2.4M MSG/SEC」這類示意數字沒有條件說明，本站的數字只能來自事實庫 | 2026-11-01 |
| https://cohere.com/ | 企業 AI 廠商。h1「Your AI. Your rules.」，說明句寫平台由企業控制、依企業的條件部署；導覽的 Deploy 欄列出「Private Deployments：On-prem or isolated VPCs」。每個產品段用等寬小字的 eyebrow（「COHERE MODELS」「MODEL VAULT」）加一句標題、一行說明、一個按鈕。產業段列 Financial services、Public Sector 等，HTML 文字裡每個產業下面列三件具體作業（例如 Public Sector 的「Automate case intake and routing」）。資安段把 SOC2、GDPR、ISO 27001 等認證用圖示加文字名稱並列 | P1、P4（對應 `DM-3`：第一屏就說掌控權在企業）、P5（產業入口下面寫具體作業，不只寫產業名）、P2（認證寫出名稱，不只放徽章圖） | 等寬小字的 eyebrow（taste-skill house rules：no eyebrows、no monospace），本站把產品名寫進標題或第一句。「Your AI. Your rules.」這種沒寫服務對象的口號式 h1：P1 要求寫出替誰、做什麼。「Trusted by industry leaders and developers worldwide」底下的一長串 logo（含 Oracle、SAP、Salesforce）只放 logo，看不出是客戶、合作夥伴還是通路，也不寫成果（P2）。第一屏上方的產品公告橫條 | 2026-11-01 |
| https://stripe.com/enterprise | 每個能力段都是同一組結構：左邊一張能力卡（標題寫結果，例如「Recover up to 55% of failed payments」，下面是產品名的標籤），右邊一欄依序是「Guide」、具名的「Customer story」（例如「FOX Sports Mexico sees 20% uplift in subscription revenue with Stripe Billing」）、一個數字加一句說明這個數字是什麼。分析機構的評價寫出機構名與引號原文（IDC MarketScape、The Forrester Wave）。另有「Use Stripe with your systems」一段，講接到既有的資料倉儲與 ERP | P2（成果數字和客戶名寫在同一句；第三方評價寫出出處與原文；證據欄位置固定）、P3（有一段專門講接進既有系統）、P5（每段固定「能力 → 案例 → 數字」的閱讀順序） | 「on average」「up to」這類數字沒有寫出統計方式與期間：本站照事實原文帶條件。HTML 裡的「8 sales reps available / Chat now with sales」業務對話入口（P4、`competitors.md`「不適合本站」第 1 項）。整頁截圖裡數字框是空的、HTML 文字裡才有數字（例如「350K+」），本站的數字直接畫在 HTML（P2）。頁面有多個 h1，違反本站 SEO 底線 | 2026-11-01 |

## 待確認

| # | 事項 | 卡在哪 | 影響 |
|---|---|---|---|
| 1 | 已解決：2026-11-01 放行四個網域後補上「非競品參考網站」 | — | — |
| 2 | 已解決：使用者選定 `ribbon-route`（2026-11-01），首頁保留 WebGL，但物件換成亮底的白色系統地圖與緞帶，不再是深色的 Modular Stack。ADR 0003 與 `design-system`「3D 場景」由 #167 改版 | — | — |
| 3 | 第 7 段要不要加一則客戶證言（`fact:testimonial-shin-kong-bank`）。P2 規定證言要寫出說話人與原文、不配圖庫人像 | `briefs/home.md`「待確認」第 1 項交設計概念與製作階段決定；證言原文長，放進緊湊的紀錄列會改變段落節奏 | 第 7 段的版面 |
| 4 | 產品介面截圖（例如 digiRunner 主控台）能不能當表達接點的影像，以及有沒有可用、已授權的截圖。taste-skill 在沒有截圖時改用 HTML 做的介面片段，片段的標籤只照事實文字寫，但版面是原型自己畫的，不是產品的真實畫面 | 現有影像規範不放真實產品；repo 裡沒有產品截圖 | P3 的影像做法；五個方向的介面片段 |
| 5 | 要不要保留固定的聯絡入口（現站有浮動「聯絡我們」與「預約 Demo」） | `competitors.md`「本站缺」第 4 項交設計概念決定；P4 只規定入口位置可預期、不遮內容。house rules 不用浮動的膠囊導覽，五個方向都把入口放在 header 的單一動作與 hero、頁尾 | 第 2 階段的方向說明，選定後寫回 `design-system` |
