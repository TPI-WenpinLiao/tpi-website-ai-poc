# 評審與驗證報告（#168）

用 `site-review` 的三份 rubric 比較試點三頁的新版、舊版、現站，以及兩家競品首頁，看分階段流程（#162–#167）做出來的頁面有沒有比較好，還差在哪裡，以及流程的哪一段沒擋住問題。

## 結論

- 第一批（#202）：照 brief 重做的 GreenSwift 與 DigiLism 產品家族頁，兩頁三份 rubric 都通過，設計都剛好 4.0（見「第一批（#202）」）
- 第一批（#201）：照 brief 重做的 OrientAI 與 AISO 頁，兩頁三份 rubric 都通過（見「第一批（#201）」）
- 第一批（#200）：照 brief 重做的 AI 理賠、AI 建檔與 SysTalk.ai 產品家族頁，三頁三份 rubric 都通過（見「第一批（#200）」）
- 第二輪（#187）：試點三頁依本報告修正後重評，三頁三份 rubric 都通過（見「第二輪（#187）」），兩輪用的 rubric 版本不同，分數不能直接比較
- 新版首頁三份 rubric 都通過（設計 4.2、文案與行銷 4.3、SEO 4.2）。舊版、現站、競品的首頁三份都沒過，最高的是舊版的 SEO 3.2
- 新版 digiRunner 與金融頁沒過。兩頁的設計都是 3.0，卡在 D2 = 2：offering 與 hub 模板沿用 M3 的元件，留著設計原則明列不做的 mono 大寫 eyebrow、`01` 編號、細線與框線卡片。文案分別是 3.8、3.7，差在幾處做得不完整：製作備註式的句子、hero 的「免費」沒寫條件、brief 要的事實沒放、錨點沒照 brief
- 比舊版進步最多的是定位與照 brief 做（C1、C5）。舊版三頁的內容停在 brief 之前，C5 都是 1 分；新版首頁是 5 分，另兩頁是 4、3 分
- 5 秒測試（模擬）：只有新版第一屏答得出「為金融與政府做、做什麼」。舊版只看得出「軟體公司」，現站只看得出「跟主權 AI 有關的上市公司」
- 流程最大的缺口：設計原則只為首頁寫了「會怎麼呈現」，`design-system` 的元件表還在規定 eyebrow 與編號，製作階段做 offering、hub 模板時沒有依據可以擋。另一個缺口是製作階段的關卡只有 `npm run check`，原則違反到評審階段才被抓出來。修正寫在「流程回寫」

## 方法

### 評審對象

| 組 | 頁面 | 來源 |
|---|---|---|
| 試點新版 | `/`、`/products/digirunner`、`/industries/finance` | `main` eb0592e（含 #183 的事實補充）build 的 `dist/` |
| 試點舊版 | 同上三頁 | PR #176 合併前的 `main` 818988f build 的 `dist/` |
| 現站 | `https://www.tpisoftware.com/`、`/products/digirunner`、`/products/open-banking` | `docs/ia/page-map.csv` 對應到這三個節點的現站網址。現站沒有金融產業頁，開放銀行頁是併入 `/industries/finance` 的那一頁 |
| 競品 | SYSTEX（`tw.systex.com`）、Syscom（`www.syscom.com.tw`）首頁 | `competitors.md` 四家裡客群與昕力重疊最多的兩家台灣廠商。GSS 對一般請求回 410，FPT 是越南市場 |

觀察日期 2026-11-02。

### 素材

`node scripts/strategy/eval-shots.mjs` 產生所有截圖，存在 `docs/strategy/evaluation/<組>/`：

- 375×812 與 1280×800 兩種寬度，各存第一屏（`-first.jpg`）與整頁（`-full.jpg`）
- 以 `prefers-reduced-motion: reduce` 截取。新版首頁因此是靜態的緞帶圖，不是桌機的 3D 場景；headless Chromium 用軟體算 WebGL，畫面和訪客看到的不同
- 給評審的 HTML 與整頁切段（每 1600 px 一張，375 寬是 1400 px）只放在 `--work` 目錄，不 commit：現站與競品是第三方內容。新版、舊版的 HTML 是 `dist/` 原檔，現站與競品是渲染後的 DOM
- `--work/blind/` 把每頁換成中性代號，評審看不到組別名稱。現站可以從 Nuxt 的 markup 與 canonical 認出來，現站 digiRunner 與金融頁的評審在結果開頭寫了這件事，這一點匿名化沒做到
- 這一輪評審用的代號，是 script 加入 `blind/` 之前用一次性指令配的，記在每份評審檔的開頭（例如 SYSTEX 是 r01，5 秒測試的新版是 f3）。照下方「重現」重跑時，`blind/map.tsv` 產生的代號不同，從代號回頭追評審檔時以評審檔開頭為準

重現：

```bash
npm run build && cp -r dist <scratch>/new-dist
git worktree add --detach <scratch>/old 818988f
ln -s "$PWD/node_modules" <scratch>/old/node_modules
(cd <scratch>/old && npm run build)
node scripts/strategy/eval-shots.mjs --new <scratch>/new-dist --old <scratch>/old/dist --work <scratch>/work
```

新版、舊版重跑後截圖逐位元相同；現站與競品會隨網站內容改變。

### 評分

- 依 `site-review`「做法」第 1 步，每頁開一個新的 `reviewer`，共 11 個。評分用的是本 PR 修改前（eb0592e）的 rubric 與 `site-review`；本 PR 改了 D1 錨點，補了 4、2 分的給法與 C3、C4、S1、S2、S6 的提示（見「流程回寫」），之後用新 rubric 重評的分數不能和這一輪直接比較。prompt 只給截圖、HTML、`docs/strategy/` 的依據與 rubric，不給其他組的分數。評審結果原文存在 `evaluation/reviews/<組>-<頁>.md`，只調整標題層級
- 新版、舊版、現站都是昕力的頁面，三份 rubric 全評，對照同一份 brief，量的是離 brief 多遠
- 競品沒有 brief，也不適用昕力的設計原則：D2、C5、S1、S2、S5 標不適用，平均只算其餘項目。競品的平均和昕力頁面的平均算的項目不同，只能大致比較
- 昕力的 9 頁另請評審寫「評審依據不足」（競品沒有 brief 與設計原則可對照，不寫）：哪些項目因為文件寫得不清楚而難以判斷。流程回寫主要依據這一節

分數表由 `node scripts/strategy/eval-scores.mjs --write` 從評審檔的表格重算，`npm run check` 確認表格沒有過期、每份評審檔頭寫的平均與通過與否和表內分數一致。新版首頁的 SEO，評審寫 4.3，重算是 4.2（25 ÷ 6），評審檔已改正。

### 5 秒測試（模擬）

另開 3 個 `reviewer`，只給新版、舊版、現站首頁的第一屏截圖（1280 與 375），不給 HTML 與 repo 內的文件，以金融或政府 IT 主管的角度回答 6 個問題。這是模擬：評審是語言模型，會讀完截圖上的每個字，沒有真人 5 秒內的注意力限制，結果不能取代真人測試。

## 分數

<!-- eval-scores:start -->
| 組 | 頁面 | 設計 | 文案與行銷 | SEO |
|---|---|---|---|---|
| 試點新版 | [首頁](evaluation/reviews/new-home.md) | 4.2 通過 | 4.3 通過 | 4.2 通過 |
| 試點新版 | [digiRunner](evaluation/reviews/new-digirunner.md) | 3.0 未通過（D2 = 2） | 3.8 未通過 | 4.3 通過 |
| 試點新版 | [金融](evaluation/reviews/new-finance.md) | 3.0 未通過（D2 = 2） | 3.7 未通過 | 3.8 未通過 |
| 試點舊版 | [首頁](evaluation/reviews/old-home.md) | 2.0 未通過（5 項低於 3） | 1.8 未通過（5 項低於 3） | 3.2 未通過（S3 = 2） |
| 試點舊版 | [digiRunner](evaluation/reviews/old-digirunner.md) | 1.8 未通過（4 項低於 3） | 2.0 未通過（4 項低於 3） | 2.7 未通過（S2 = 2、S5 = 2） |
| 試點舊版 | [金融](evaluation/reviews/old-finance.md) | 2.2 未通過（4 項低於 3） | 1.7 未通過（6 項低於 3） | 2.8 未通過（3 項低於 3） |
| 現站 | [首頁](evaluation/reviews/current-home.md) | 1.7 未通過（6 項低於 3） | 1.8 未通過（5 項低於 3） | 2.0 未通過（5 項低於 3） |
| 現站 | [digiRunner](evaluation/reviews/current-digirunner.md) | 1.8 未通過（6 項低於 3） | 1.8 未通過（5 項低於 3） | 2.2 未通過（4 項低於 3） |
| 現站 | [金融（開放銀行頁）](evaluation/reviews/current-finance.md) | 1.3 未通過（6 項低於 3） | 1.5 未通過（6 項低於 3） | 1.8 未通過（5 項低於 3） |
| 競品 | [SYSTEX 首頁](evaluation/reviews/competitors-systex.md) | 2.6 未通過（D1 = 2、D6 = 2） | 2.0 未通過（5 項低於 3） | 1.0 未通過（3 項低於 3） |
| 競品 | [Syscom 首頁](evaluation/reviews/competitors-syscom.md) | 2.0 未通過（5 項低於 3） | 2.4 未通過（3 項低於 3） | 1.3 未通過（3 項低於 3） |
| 第二輪（#187） | [首頁](evaluation/reviews/r2-new-home.md) | 4.0 通過 | 4.5 通過 | 4.5 通過 |
| 第二輪（#187） | [digiRunner](evaluation/reviews/r2-new-digirunner.md) | 4.3 通過 | 4.7 通過 | 4.7 通過 |
| 第二輪（#187） | [金融](evaluation/reviews/r2-new-finance.md) | 4.2 通過 | 4.2 通過 | 4.7 通過 |
| 第一批（#200） | [AI 智能理賠](evaluation/reviews/b1-new-smartclaim.md) | 4.2 通過 | 4.5 通過 | 4.8 通過 |
| 第一批（#200） | [AI 智慧建檔](evaluation/reviews/b1-new-smartfilling.md) | 4.0 通過 | 4.7 通過 | 4.7 通過 |
| 第一批（#200） | [SysTalk.ai 產品家族](evaluation/reviews/b1-new-systalk-ai.md) | 4.2 通過 | 4.5 通過 | 5.0 通過 |
| 第一批（#201） | [OrientAI 企業級 Agentic AI 平台](evaluation/reviews/b1-new-orient-ai.md) | 4.2 通過 | 4.5 通過 | 4.8 通過 |
| 第一批（#201） | [AISO 主權 AI](evaluation/reviews/b1-new-aiso.md) | 4.2 通過 | 4.2 通過 | 4.3 通過 |
| 第一批（#202） | [GreenSwift 智慧碳管理平台](evaluation/reviews/b1-new-greenswift.md) | 4.0 通過 | 4.7 通過 | 4.8 通過 |
| 第一批（#202） | [DigiLism 企業服務中台](evaluation/reviews/b1-new-digilism.md) | 4.0 通過 | 4.5 通過 | 4.7 通過 |
<!-- eval-scores:end -->

## 各組的主要差異

### 新版對舊版

舊版三頁是 M3–M5 的版本：文案照抄現站，結構由 schema 決定。三位評審都指出舊版的內容就是 brief「與現有頁面的差異」表裡「現有、要改寫」的那一欄。差異集中在四處：

- 定位（C1、D1）：舊版首頁的 h1 是「以頂尖科技為企業賦能」，金融頁的 tagline 只講開放銀行；新版首頁 h1 寫出「金融與政府」「既有系統」「API 與 AI」，金融頁寫出銀行、保險、證券與兩件事
- 照 brief 做（C5）：舊版三頁都是 1 分；新版首頁 5 分，digiRunner 4 分，金融 3 分
- 證據（C3、D5）：舊版 digiRunner 頁沒有任何數字、客戶或認證，四個「零」的內文在事實原文後面接上加強的成效句；新版各頁抽查的事實都和 `source.quote` 逐字相符
- 版面：舊版的 3D 章節（`scene-chapter`）在減少動態時留下半屏以上的空白，三位評審都扣了 D4；新版移除了 Modular Stack，沒有這個問題

SEO 的差距最小。舊版首頁的 S5、S6 是 4 分，金融頁的 S6 是 5 分（`hasPart` 有輸出），新版金融頁的 S6 反而退到 3 分：`hasPart` 是空陣列，因為 #167 讓 `sections` 已連到的子頁不再列在子頁卡片，JSON-LD 跟著少了子頁。

### 新版對現站

現站三頁在各組裡分數最低，設計平均 1.3–1.8。共同的問題：第一屏是口號加圖庫或科幻影像，h1 是口號或隱藏，heading 結構混亂（首頁 2 個 h1、37 個 h2），用了事實庫標為 `to_confirm` 的主張（「國內唯一符合遵循金管會法令」、Kong 比較表、「提升高達 50%」）。新版拿掉了這些，事實只用 `confirmed` 的。

現站 digiRunner 頁的子題涵蓋（S2 = 3）比舊版（2）好，因為現站的內容比 M5 搬過來的多；新版照 brief 補齊後是 5。

### 競品

兩家競品首頁三份 rubric 都沒過，SEO 分別是 1.0、1.3：SYSTEX 只有一個空的 h1、沒有 meta description、沒有 JSON-LD，Syscom 沒有 h1、title 是「HOME - 凌羣電腦」。兩家的第一屏都沒說出服務對象，和 `competitors.md` 的觀察一致。新版首頁的 D1 得 5 分，理由之一就是「四家競品第一屏都沒寫服務對象」。

## 5 秒測試的結果

全文在 `evaluation/reviews/five-second-<組>.md`。

| 問題 | 新版 | 舊版 | 現站 |
|---|---|---|---|
| 這家公司做什麼 | 讓金融與政府不必換掉舊系統，就能接上 API 與 AI；自己研發產品，也負責導入 | 提供軟體解決方案的科技公司，看不出哪一類 | 跟「主權 AI」「軟硬整合」有關的上市公司，看不出賣什麼 |
| 為誰做 | 金融業與政府，標題第一個詞就點出來 | 只看得出「企業」 | 看不出來 |
| 記得什麼 | 大標題、公司名與「自行研發、也負責導入」、紫色「聯絡業務」按鈕 | 大標「以頂尖科技為企業賦能」、發紫光的網格板、公司名與兩個按鈕 | 科幻走廊大圖、口號、股票代號 |
| 困惑的地方 | 接的是哪個產品看不出來；桌機下方的白色方塊城市沒有標示，像裝飾；「聯絡我們」與「聯絡業務」兩個名稱；沒有客戶或數字 | 口號任何公司都能用；沒有可信度訊號；網格板讀不出代表什麼 | 口號看不出做什麼；兩排選單重複；「投資…」被搜尋圖示蓋住；輪播 8 張 |
| 手機與桌機 | 手機的地圖有標籤、緞帶串起接點，比桌機好懂；桌機第一屏沒有往下捲的線索 | 內容相同；手機底部約 1/6 是空的 | 手機主標在「開／啟」中間斷行，浮動泡泡蓋住內容 |

新版桌機第一屏的系統地圖只露出沒有標籤的城市上緣，緞帶與接點標籤要往下捲才看得到，所以桌機的影像在 5 秒內沒有傳達意思。首頁的評審（D1 第一印象）也看到同一件事。這張截圖是減少動態的靜態圖；3D 版的第一屏要在真機上另外確認。

## 新版還不夠好的地方

依影響範圍排序。每一項的出處寫在括號裡，指到評審檔的項目。

### 模板與元件違反設計原則（digiRunner、金融）

兩頁的 D2 都是 2 分，扣分的元素大多來自共用元件，不是這兩頁自己寫的：

- h1 上方的 eyebrow（「● DIGILISM」「● 產業方案」）來自 `PageHero`
- 區塊標題上的 mono 大寫英文小標（「USE CASES」「SUCCESS STORIES」「PRODUCTS」「CONTACT」）、`01` 編號與短線來自 `SectionHeading`；`design-system` 的元件表到現在還寫著「`index`（`01`）＋mono eyebrow＋漸層線」
- 細框、同尺寸的卡片列來自 `Card`；分隔線、背景格線、按鈕陰影散在模板裡

`design-principles.md` P1、P2、P5 都把這些列為「不會怎麼呈現」。#167 重寫了首頁模板，offering 與 hub 模板沿用這些元件，所以首頁 D2 是 4 分，另兩頁是 2 分。（new-digirunner D2、new-finance D2）

### 內頁的版型單調、缺圖

- digiRunner 頁 7 個功能段、金融頁 6 段，都是同一種「左標題、右條列」雙欄，P5 要相鄰段落不用同一種版型（new-digirunner D4、new-finance D4）
- digiRunner 頁只有 hero 一張圖。P5 要產品頁至少 4 張介面片段或架構圖，brief 的段落表沒寫哪一段放什麼圖（new-digirunner D2）
- 案例卡只有標題與客戶名，沒有 P2 要的「作業 → 成果 → 連結」（new-digirunner D5、new-finance D5）

### 文案沒做完的地方

- digiRunner 頁有三句製作備註漏進文案：「以下是支援的標準。」「效能數字取決於環境配置，以下照原文列出。」「雲端版的試用條件寫在下面…」（new-digirunner C6）
- digiRunner hero 的「30 天免費試用」旁邊沒有雲端版的費用條件，messaging `IT-7` 要求一起寫；brief 第 1 段又把這一點列為 hero 證據點，兩份文件衝突（new-digirunner C3）
- digiRunner 第 2 段「外部夥伴也能自己註冊、登入後接上 API」比事實原文多了「外部夥伴」「接上 API」；brief 第 10 段的 Pharmacity 案例沒放（new-digirunner C3）
- 金融頁「AI 的使用歷程與治理」底下只有使用歷程，沒有治理的事實；第 4 段少了自研 NLP 與辨識模型；多了 brief 沒有的「產品總覽」段（new-finance C3、C5）
- 首頁 h1 的「原地接上」沒有事實撐住；「金融聯防阻詐平台」的原文沒提到 AI，卻放在「AI 已用在每天的作業」底下。後者來自 messaging `DM-2` 的歸類（new-home C3）
- header 寫「聯絡我們」，頁面寫「聯絡業務」（new-home C4、five-second-new）

### SEO

- 錨點文字沒照 brief：產業頁的錨點只有「金融」，案例連結沒有客戶名，金融頁的阻詐平台錨點連到成功案例列表（new-digirunner S5、new-finance S5）
- 金融頁 `CollectionPage` 的 `hasPart` 是空陣列（new-finance S6）
- 首頁 `WebSite` 沒有 `potentialAction`。`content-model.md` 寫站內搜尋上線後要加，站內搜尋在 M6 已上線（new-home S6）

### 首頁的細節

- 產業段在兩個產業入口之前有一段約 300 px 的緞帶，面積比入口大（new-home D3）
- 產品段左欄 h2 下方約 400 px 空白（new-home D4）
- 375 寬的產業段仍是兩欄，每行 5–7 字；系統地圖右側的「新的服務」被裁掉（new-home D6）

## 流程回寫

評審的「評審依據不足」裡，影響多份評審或卡住某一階段的項目整理成下表；只影響單頁的依據問題列在表後的「交給 #186 的單頁問題」。每一列是一個流程缺口：哪個階段的產出物不夠用、哪個關卡沒擋住，以及這次改了什麼。

| # | 缺口 | 階段 | 證據 | 這次的修改 |
|---|---|---|---|---|
| 1 | 設計原則只寫首頁的「會怎麼呈現」，產品頁、產業頁沒有依據 | 設計概念 | 6 份評審都提到（new-digirunner、new-finance、old-digirunner、old-finance、current-digirunner、current-finance） | `design-concept`：原則要為 `site-profile.md` 的每個試點模板寫「會怎麼呈現」 |
| 2 | 原則定案後，`design-system` 的元件表沒有跟著改，還在規定 eyebrow 與編號 | 設計概念 → 製作 | new-digirunner D2、new-finance D2 | `design-concept`：寫回 `design-system` 時，列出和「不會怎麼呈現」衝突的元件，寫進製作 issue；`design-system` 元件表的 `PageHero`、`SectionHeading`、`Card` 標「待改（#187）」 |
| 3 | 製作階段的關卡只有 `npm run check`，原則違反到評審階段才抓到 | 製作 | 同上 | `issue-ship` 第 8 步與 `docs/workflow.md`「分階段流程」：製作 issue 改到試點頁用的模板、元件或內容時，轉 ready 前每頁由新的 `reviewer` 評設計 rubric，D2 < 3 先修 |
| 4 | brief 在製作階段改了段落結構，但只在開頭加一段「製作階段的版本」，段落表、CTA 表、連出表沒有同步；原則 P5 也還寫 8 段 | 製作 | new-home、old-home、current-home 第 1 項 | `content-strategy`：製作階段改了段落就改寫 brief 的段落表與相關表格，不另加版本段落 |
| 5 | brief 與原則、brief 與 messaging 互相衝突（金融頁 eyebrow、digiRunner hero 的「免費」） | 策略、設計概念 | old-finance、new-digirunner | `design-concept`：原則定案後逐份對照 brief，衝突寫進 brief 的「取捨」；`content-strategy`：hero 證據點要符合 messaging 的限制 |
| 6 | brief 沒寫每段放什麼圖 | 策略 | new-digirunner 第 2 項 | `content-strategy`：段落表加「影像」欄，設計概念階段填 |
| 7 | messaging 的證據點不一定支撐主張的關鍵詞（`DM-2` 收了沒提到 AI 的阻詐平台） | 策略 | new-home C3 與第 5 項 | `content-strategy`：證據點的原文要直接支撐主張的關鍵詞 |
| 8 | 競品分析只看首頁，產品頁與產業頁的 D1、S2 沒有對照 | 研究 | 6 份評審（new-finance、old-home、old-digirunner、old-finance、current-digirunner、current-finance） | `site-research`：競品分析涵蓋每個試點模板；搜尋意圖記錄前幾名缺了哪些子題。`seo.md` 的 S2 提示改為對照這一項 |
| 9 | rubric 只有 5、3、1 的錨點，「取低的」讀法不一，D1 的 3 與 1 重疊 | 評審 | 4 份評審；共用元件算不算進 D2 來自 new-home 第 4 項 | `site-review`「Rubric」寫出 4、2 分的判斷方式；`design.md` 的 D1 錨點改為 3 分「看得出做什麼，但看不出給誰或跟競品的差別」、1 分「只看得出是軟體或科技公司」；內頁的 D1、D2 照該模板的原則，D2 包含共用元件 |
| 10 | C3 沒說 `to_confirm`、messaging 排除的事實、原文後接加強句怎麼算 | 評審 | current-home、current-digirunner、old-digirunner | `copy-marketing.md` 評分提示補上 |
| 11 | C4 的主要轉換：`site-profile.md` 與 brief 不同時以哪個為準 | 評審 | old-digirunner、current-digirunner | `copy-marketing.md`：brief 指定時以 brief 為準 |
| 12 | S6 沒寫缺整個必要類型、欄位要多少才算一致 | 評審 | current-home、new-digirunner | `seo.md` 評分提示：以 `content-model.md` 規定的類型與欄位為準 |
| 13 | 減少動態下的空白、淡出、只在 hover 出現的內容怎麼算；S5 的「連入」只有一頁 HTML 評不了 | 評審 | old-home、current-finance、current-digirunner、current-home 第 4 項 | `site-review`「評審對象的準備」：截圖以減少動態截取，看不到的內容當實際呈現評；hover 才出現的不算看得到；連入用 grep 查整份 `dist/` |
| 14 | 評審素材要手動準備，整頁長圖縮小後讀不到字 | 評審 | 本次執行 | `site-review` 新增「評審對象的準備」，用 `eval-shots.mjs` 產生匿名代號與切段，`eval-scores.mjs` 產生分數表；`site-review`「做法」第 5 步與 `reviewer` agent 要求每份評審寫「評審依據不足」 |
| 15 | S1 要照實際搜尋結果的意圖，還是照 brief 決定承接的查詢 | 評審 | new-home 第 7 項 | `seo.md` 評分提示：brief 決定不承接的查詢，S1 照 brief 評，不扣分 |
| 16 | 製作備註漏進文案（「以下照原文列出」） | 製作 | new-digirunner C6 | `content-strategy`「3. 頁面文案」：說明句寫讀者得到什麼，不描述頁面怎麼排 |

不改的：

- 匿名化對現站不完全（缺口無法用流程解決，現站的 markup 本身就看得出來）。報告註明，分數照用
- 「事實原文照引時能不能加標點、拆成清單」（new-finance 第 6 項）。這是內容規則的取捨，改了會影響 `facts.mjs` 的比對方式，列在 #186 由使用者決定
- 站內搜尋算不算已上線（new-home 第 8 項）。不是流程缺口：站內搜尋在 M6 已上線（`docs/status.md`「M6 功能」），首頁 `WebSite` 少了 `potentialAction` 是製作的漏項，列在「新版還不夠好的地方」，由 #187 修

### 交給 #186 的單頁問題

這些依據問題只影響一頁，答案要寫進該頁的 brief 或設計原則，由 #186 一併處理：

- digiRunner brief 第 6 段：拆成 5 張卡算不算偏離，`fact:digirunner-oas` 放哪裡；brief 要求照原文列清單的段落，C2 怎麼評（new-digirunner 第 4、6 項）
- 金融 brief：hero 要不要放聯絡按鈕；「產品總覽」段是不是 `industry` 反查的獨立一段；子頁卡片不顯示時 `hasPart` 要不要保留；案例卡要不要寫成果（new-finance 第 3、4、5、8 項）
- 首頁 brief 第 4 段：4 個產品是哪 4 個（new-home 第 2 項）；類別詞進不進 title（current-home 第 2 項）
- 舊網址併入新頁時，評審照哪一份 brief（current-finance 第 1 項）
- 產品頁能不能沿用首頁 hero 的 3D 物件（old-digirunner 第 3 項）
- 一句話的產品描述算事實還是表述（old-home 第 4 項）
- C4 的「普通」與「埋在頁面極下方」、S1 整組主要查詢沒回答時給幾分（old-finance 第 4、5 項）。這兩項是錨點的寫法，`site-review`「Rubric」補的 4、2 分給法已涵蓋，#186 不另處理

### 後續 issue

- #186 策略文件同步：產品頁與產業頁的「會怎麼呈現」、`briefs/home.md` 改成 5 段版、`DM-2` 的證據點、brief 的衝突、競品內頁研究（`strategy-approved` 關卡）
- #187 試點三頁依本報告修正並重評，依賴 #186
- #188 決定其他頁面是否照分階段流程重做

## 第二輪（#187）

#187 依本報告「新版還不夠好的地方」修正試點三頁後，三頁各由新的 `reviewer` 用三份 rubric 重評。評審檔是 [`r2-new-home`](evaluation/reviews/r2-new-home.md)、[`r2-new-digirunner`](evaluation/reviews/r2-new-digirunner.md)、[`r2-new-finance`](evaluation/reviews/r2-new-finance.md)，分數在上方「分數」表的「第二輪」三列。

### 方法

- 用的是 #168 修改後的 rubric 與 `site-review`（4、2 分的給法、D1 錨點、C3、C4、S1、S2、S6 的提示、評審對象的準備）。第一輪用的是修改前的版本，兩輪的分數不能直接比較：第一輪的分數說明「修改前的頁面離 brief 多遠」，第二輪說明「修改後的頁面是否達到門檻」
- 素材由 `node scripts/strategy/eval-shots.mjs --only new --group <組>` 產生，截圖存在 `evaluation/r2-new/`（第一次）與 `evaluation/r2b-new/`（最後一次），第一輪的 `evaluation/new/` 不動。prompt 只給匿名代號的截圖、`dist/` 的 HTML 與 `docs/strategy/`，不給第一輪的分數與製作過程
- 每頁一個新的 `reviewer`，三份 rubric 一起評。評審寫錯平均時，以評審自己在「門檻判斷」的更正為準，`eval-scores.mjs` 檢查標題與分數一致

### 結果

同一輪評了兩次。第一次（PR #191 `177237c`，評審檔在 [`evaluation/r2-attempt1/`](evaluation/r2-attempt1/)）首頁、digiRunner 三份都通過，金融頁設計 3.5、文案與行銷 3.8（C3 = 2）未通過。依評審修正後（`f47eba0`），三頁再各由新的 `reviewer` 評一次，三份 rubric 都通過：

| 頁面 | 設計 | 文案與行銷 | SEO |
|---|---|---|---|
| 首頁 | 4.0（D3 = 3） | 4.5 | 4.5 |
| digiRunner | 4.3 | 4.7 | 4.7 |
| 金融 | 4.2 | 4.2 | 4.7 |

兩次之間修的是：

- 金融頁的 description 寫了「以 AI 處理理賠、建檔與阻詐」，阻詐平台的原文沒有提到 AI（`messaging.md`「缺少證據的主張」第 15 項），C3 因此只有 2 分。改成 brief 的示例，同時修正 S3、S6
- 段落裝飾圖：使用者在 #187 設計確認時覺得內頁「都是文字組成、過於單調」，用 ChatGPT 產生 5 張緞帶世界的段落圖。第一次評審兩位都把它們算成違反 P5（每張圖都要是那一段的內容）：時間列旁、案例列旁的圖把內容推後、和案例搶焦點。使用者決定保留部署、身分驗證、規劃與導入三張，拿掉另外兩張，`design-principles.md`「內頁共用的規則」新增「段落圖」一列寫明用法與上限，兩份 brief 的影像欄跟著改。第二次評審照新的原則評
- 案例列的 heading 改成連到案例的「客戶名：案例標題」，獎項不再是淡色小字，證言降一級；保險段補 InsureBrick 的模組事實；事實裡的百分比加粗；digiRunner 的 OAS 併入政府列

### 還不夠好的地方

評審給 4 分的扣分處，沒有低於門檻，留給之後的 issue：

- 首頁 D3 = 3：產業段的分岔緞帶與 AI 成果的近景圖仍比入口與成果文字搶眼；三張近景、四張產品縮圖都是同一條緞帶的裁切，看不出各自的作業或產品
- digiRunner 與金融：第 2、3、5、7 段下半部的事實原文同字級排成兩欄，看不出主次；375 寬有幾段超過 1.5 個螢幕高；hero 圖沒有「新的服務」標籤（取景放寬後方塊太小，只放寬到 digiRunner 第 4 個錨點）
- 金融：第 6 段 InsureBrick 與 InsureRing 的事實沒分組；第 8、9 段的標題沒有帶出金融業；時間列的年份與原文開頭的年份重複
- 事實原文有漏字：`fact:digirunner-deployment`「支援地、雲端部署」、`fact:digirunner-ai-usage-log`「完整錄所有AI使用歷程」。照規則不能改字，前者在 digiRunner 第一屏，評審讀成錯字

### 評審依據不足

六份評審（兩次 × 三頁）的「評審依據不足」裡重複出現的：

| 缺口 | 文件 | 出現在 |
|---|---|---|
| 事實原文本身漏字時，照引與 C6「沒有錯字」衝突 | `CLAUDE.md`「內容規則」、`site-research`、`copy-marketing.md` C6 | digiRunner 兩次 |
| 介面片段段落的事實超過 4 則時放哪裡；375 寬「一段不超過約 1.5 個螢幕高」和照原文列清單的段落衝突 | `design-principles.md`「內頁的版型」「內頁共用的規則」、兩份 brief | digiRunner、金融 |
| 對應表算不算「真的表格」，能不能有列線 | `design-principles.md`「內頁的版型」 | 金融兩次 |
| 時間列的年份欄與原文開頭的年份重複時怎麼處理 | `design-principles.md` 時間列、`briefs/finance.md` 第 2 段 | 金融 |
| `heroLabels` 落在圖外就不輸出，和原則要求的標籤清單衝突 | `design-principles.md`、`content-model.md` | digiRunner |
| S3 的 h1 要含查詢詞，brief 決定 h1 只寫節點名時算不算扣分 | `rubrics/seo.md` S3 | 金融 |
| meta description 與 JSON-LD 的文字算不算 C3 的主張 | `rubrics/copy-marketing.md` C3 | 金融 |

這些是規則文件之間的衝突，不是單頁的修正，#187 不改，列在 PR 的後續事項。

## 第一批（#200）

`docs/workflow.md`「分階段流程」的後續批次第一張製作 issue：`/solutions/smartclaim`、`/solutions/smartfilling`、`/products/systalk-ai` 照 #199 的 brief 重做後，每頁由新的 `reviewer` 用三份 rubric 評分。評審檔是 [`b1-new-smartclaim`](evaluation/reviews/b1-new-smartclaim.md)、[`b1-new-smartfilling`](evaluation/reviews/b1-new-smartfilling.md)、[`b1-new-systalk-ai`](evaluation/reviews/b1-new-systalk-ai.md)，分數在上方「分數」表的「第一批（#200）」三列。

### 方法

- 用的 rubric 與 `site-review` 和第二輪（#187）相同。素材由 `node scripts/strategy/eval-shots.mjs --only new --group <組> --pages <slug>=<path>,…` 產生（`--pages` 是本批加的，讓後續批次的頁面也能用同一支 script），prompt 只給匿名代號的截圖、`dist/` 的 HTML 與 `docs/strategy/`，不給上一次的分數與製作過程
- 一頁沒過就修正，修正後由新的 `reviewer` 重評。同一頁較早的評審檔放在 [`evaluation/b1-attempt1/`](evaluation/b1-attempt1/)，截圖依次在 `evaluation/b1-new/`、`b1b-new/`、`b1c-new/`

### 結果

| 頁面 | 第一次（`c4ce310`） | 第二次（`c835b72`） | 第三次（`6e3ca36`） |
|---|---|---|---|
| AI 智能理賠 | 4.2／4.2／4.8 | 3.8（D4 = 3）／4.3／4.8 | 4.2／4.5／4.8 |
| AI 智慧建檔 | 4.0（D4 = 3）／4.5／4.5 | 4.0／4.7／4.7 | — |
| SysTalk.ai 產品家族 | 3.8（D2 = 3）／4.2／4.8 | 4.2／4.5／5.0 | — |

分數依序是設計／文案與行銷／SEO。第一次之後修的是：

- SysTalk.ai 第 2 段的事實原文用空白接成一行，讀起來像錯字（D2）：在 `facts-source.yaml` 把產品名與各項拆成分行，只加換行
- 介面片段那一側半欄空白（D2、D4）：ui 段加 `itemsBelow`，事實排到片段與主張下方兩欄；拆行的清單在兩欄裡佔滿一列
- 三位評審都指出頁尾聯絡段的標題是全站通用句，沒照 brief 寫這一頁的下一步（C4）：`ContactCta` 加 `title`，內容檔加 `contactTitle`
- smartclaim、smartfilling 全頁白底，看不出判斷組（D2、D4）：用 `fill: subtle` 分組
- tagline 與第 2 段 h2 重複、第 3 段 h2 沒點出地端（D3、S4）、說明句「給…：」的開頭與 ICR 索引列的交代版面句子（C6）

第二次之後修 smartclaim 的 D4：索引列改成標題在左、清單在右，h2 改成每個分句放得進一行（「引擎」「解析」不再被拆開），第 6 段的事實排到下方，第 3 段說明句不再重講掃描建檔。smartfilling 的索引列跟著變成左右排，這是它第二次評審之後的改動，沒有再評

同一頁兩次評審的設計分數差了 0.4（smartclaim 第一次 4.2、第二次 3.8，中間的修正沒有動到第二次扣分的地方）。評審之間的落差比門檻的間距大，這一批每頁只評到通過為止，分數接近 4.0 的頁面（smartfilling 設計 4.0）換一位評審可能不通過

### 還不夠好的地方

評審給 4 分的扣分處，沒有低於門檻，留給之後的 issue：

- 成果段只有一則（smartclaim）或成果原文用內文字級時，旁邊介面片段的黑色標題列比成果搶眼（D3、D5，三頁都提到）
- 介面片段把旁邊的事實清單原樣再列一次（SysTalk.ai 第 4、5 段），沒有畫出清單以外的東西（D2）；狀態只用色塊表示，畫面上沒有文字（D5）
- 375 寬保留每一張片段，沒照「介面片段只留主要的一塊」；說明句照詞組斷行時拆開「AI 進化系統」這類名稱
- SysTalk.ai hero 的證據點「打造企業 雲/地端 AI 完整解決方案」讀起來像口號；說明句的「金融與政府」沒有事實支撐（C3）
- `SiteFooter` 在深紫聯絡帶下方與版權列上方各有一條細線（D2，全站共用）。#212 已改，見「頁尾（#212）」

### 評審依據不足

九份評審（smartclaim 三次、另兩頁各兩次）的「評審依據不足」裡重複出現的：

| 缺口 | 文件 | 出現在 |
|---|---|---|
| 「各模板怎麼呈現」只寫 digiRunner 與金融頁，沒有 `kind: solution` 的方案頁與產品家族 hub | `design-principles.md` | 每一份 |
| brief 把介面片段降到 3 張、色帶放 3 則事實，寫「交設計概念階段」，原則沒有回寫確認結果 | `design-principles.md`、三份 brief 的取捨 | 每一份 |
| 「P5 的判斷組之間換底色」沒寫內頁怎麼分組，brief 的段落表也沒有底色欄 | `design-principles.md`「段落的分隔」、brief | smartclaim、smartfilling |
| 成果版型一則一張片段時，375 寬要不要只留一張；只有一則成果時左欄的留白 | `design-principles.md`「內頁的版型」「375 寬」 | smartclaim、smartfilling |
| 索引列在 1280 寬佔幾欄、另一側空著怎麼處理 | `design-principles.md`「內頁的版型」 | smartclaim |
| `search-intent.md` 的共同子題（導入步驟、手寫準確率、地端部署）事實庫沒有，brief 沒說是刻意不寫 | `search-intent.md`、brief、`rubrics/seo.md` S2 | smartclaim、smartfilling |
| DM-2 規定成果的 h3 用案例標題原文，和 S4「heading 自己說得出內容」衝突 | `messaging.md` DM-2、`rubrics/seo.md` S4 | smartfilling |

本 issue 只改頁面，這些規則文件之間的衝突列在 PR 的後續事項。

## 第一批（#201）

同一批的第二張製作 issue：`/orient-ai`、`/aiso` 照 #199 的 brief 重做後，每頁由新的 `reviewer` 用三份 rubric 評分。評審檔是 [`b1-new-orient-ai`](evaluation/reviews/b1-new-orient-ai.md)、[`b1-new-aiso`](evaluation/reviews/b1-new-aiso.md)，分數在上方「分數」表的「第一批（#201）」兩列。

### 方法

- 用的 rubric、素材的產生方式與 prompt 和「第一批（#200）」相同：`node scripts/strategy/eval-shots.mjs --only new --group b1-201-new --pages orient-ai=/orient-ai,aiso=/aiso`，截圖在 `evaluation/b1-201-new/`
- 階段一開 draft PR 前，兩頁先各由一個 `reviewer` 只評設計 rubric（D2 ≥ 3 才開 PR，`docs/workflow.md`「分階段流程」的製作），結果在 PR #206 的 body，不列在這裡
- 一頁沒過就修正，修正後由新的 `reviewer` 重評。同一頁較早的評審檔放在 [`evaluation/b1-201-attempt1/`](evaluation/b1-201-attempt1/)。兩次的截圖都存在 `b1-201-new/`，重評時覆蓋了第一次的

### 結果

| 頁面 | 第一次（`9121f11`） | 第二次 |
|---|---|---|
| OrientAI 企業級 Agentic AI 平台 | 3.7（D2、D4、D5 = 3）／4.3／4.7 | 4.2／4.5／4.8（`4fa09f0`） |
| AISO 主權 AI | 4.0（D2 = 3）／4.2（C6 = 3）／4.8 | 4.2／4.2（C6 = 3）／4.3（`0a07bcd`） |

分數依序是設計／文案與行銷／SEO。OrientAI 第一次之後修的是：

- 第 2、4 段把事實排到片段下方跨整列，標題欄空著（D2、D4）：先拿掉片段已經列出、文字欄又重列一次的事實，剩下的事實收回標題那一欄
- 第 3 段事實兩欄高度不齊（D4）：調換順序
- 「因此，OrientAI 適用於…」單獨成項，「因此」接不上前文（C6）：和前一則原文併成同一項，照現站原本的順序。AISO 第 3 段一起改
- 頁尾標題用「你」（C6，`messaging.md`「語氣」不用「你」）：改成 brief 的「自己的系統」
- 第 2、6 段 h2 沒帶出查詢用詞（S4）：改成「RAG 問答與 Agent 任務」「監控、日誌與異常告警」

AISO 第一次三份都通過，但 D2、C6 是 3 分。`4fa09f0` 改了這兩項扣分的地方：第 3 段 h2 縮到兩行內、說明句改寫，介面片段「自動出帳」和其他列同樣是已啟用，以及上面那項「因此」的合併。PR 審查第 1 輪指出評審檔評的是改之前的版本、截圖也已被覆蓋，所以由新的 `reviewer` 在 `0a07bcd` 重評。D2 升到 4，C6 仍是 3：hero 證據點照引新聞片段、第一屏重複「軟硬體一起交付」、第 4 段說明句和原文、片段說同一串機制。

兩次評審的 SEO 差了 0.5（4.8、4.3），差在 S1、S5 是否因為沒有連到新聞 559 扣分，頁面在這兩處沒有改動。和「第一批（#200）」一樣，評審之間的落差比門檻的間距大。

### 還不夠好的地方

評審給 3、4 分的扣分處，沒有低於門檻，留給之後的 issue：

- 介面片段的狀態方塊每一列都一樣，畫面上看不出代表什麼（D2、D5，兩頁都提到，`UiFragment` 共用）
- h2 下方的說明句用次要文字色，P4 寫內文不用淺灰（D2，兩頁都提到，共用）；h1 和 h2 字級接近（D3）
- 1280 寬的 `InPageNav` 放不下 OrientAI 的 8 項，桌機上看不出還有（階段一的設計預評提到）
- hero 證據點：OrientAI 只有功能名（D5）；AISO 照引新聞片段，「此次產品組合…」和用空格斷句的原文放在第一屏讀起來不通順，第一屏重複「軟硬體一起交付」（C6，兩次都是 3）
- AISO 沒有路徑通往聯盟新聞 559（S2）：`nodeLink` 只能指節點，等 #202 加 news ref
- 375 寬 OrientAI 第 3 段（接點圖加 5 則事實）約 1.7 屏（D6）
- 相關文章的封面縮圖有發光方塊、觸控平板這類 P3 不用的科技圖（D2，縮圖來自文章封面）

### 評審依據不足

| 缺口 | 文件 | 出現在 |
|---|---|---|
| 規格表「整段墊淺灰」和「判斷組之間換底色」在規格表緊接淺灰組時衝突，沒寫哪條優先 | `design-principles.md`「內頁的版型」「段落的分隔」、`briefs/orient-ai.md` 第 7 段 | orient-ai 兩次 |
| brief 把介面片段降到 1 張（aiso）、寫「交設計概念階段」，原則沒有回寫確認結果；也沒寫事實較多時片段段落的事實放哪裡 | `design-principles.md`、`briefs/aiso.md` 取捨第 5 項 | aiso、orient-ai 第一次 |
| 「各模板怎麼呈現」只寫 digiRunner，沒有沒案例、沒數字的產品頁 | `design-principles.md` | 每一份 |
| P2「事實原文、條件與出處擺在一起」沒寫內頁要不要、怎麼顯示出處；brief 把聯盟查詢交給新聞 559，連結卻寫成有條件的 | `design-principles.md`、`briefs/aiso.md` 取捨第 12 項與「內部連結」 | aiso 兩次 |
| brief 要求 h2 與說明句寫「金融與政府」，旁邊的產業原文沒有政府；證據點照引不適合單獨放的原文時怎麼辦 | `briefs/aiso.md` 第 1、3 段、`content-strategy` | aiso 兩次 |
| D5、C3 的 5 分錨點以數字、案例、客戶為證據，沒寫只有功能事實的頁面最高幾分 | `rubrics/design.md`、`rubrics/copy-marketing.md` | 每一份 |
| `messaging.md`「統一用詞」寫主要按鈕都叫「聯絡業務」，brief 指定這頁用「預約演示」 | `messaging.md`、`briefs/orient-ai.md`「CTA」 | orient-ai 第一次 |
| 照引「支援雲地靈活部署架構」時怎麼避免和「只會部署於企業端」讀成矛盾；公司名並列的規則是否適用內頁 | `briefs/orient-ai.md` 第 2 段、`messaging.md` `IT-1`「產品與公司名寫法」 | orient-ai 第二次 |

本 issue 只改頁面，這些規則文件之間的衝突列在 PR 的後續事項。

## 第一批（#202）

同一批的第三張製作 issue：`/products/greenswift`、`/products/digilism` 照 #199 的 brief 重做後，每頁由新的 `reviewer` 用三份 rubric 評分。評審檔是 [`b1-new-greenswift`](evaluation/reviews/b1-new-greenswift.md)、[`b1-new-digilism`](evaluation/reviews/b1-new-digilism.md)，分數在上方「分數」表的「第一批（#202）」兩列。

### 方法

- 用的 rubric、素材的產生方式與 prompt 和「第一批（#200）」相同：`node scripts/strategy/eval-shots.mjs --only new --group b1-202-new --pages greenswift=/products/greenswift,digilism=/products/digilism`，截圖在 `evaluation/b1-202-new/`
- 第一次評審後兩頁都通過，但設計都剛好 4.0、文案的 C6 都是 3，DigiLism 的 D2 是 3。依計畫只修內容檔能修的地方，再由新的 `reviewer` 重評。第一次的評審檔放在 [`evaluation/b1-202-attempt1/`](evaluation/b1-202-attempt1/)，截圖在重評時覆蓋
- 評審前的設計確認時，使用者回報標題換行斷在詞的中間（申報格／式）。原因是標題的 `word-break: keep-all` 讓沒有標點的長串字沒有斷點，本 issue 加上 `src/lib/content/phrases.ts`，兩次評審的截圖都是修正後的

### 結果

| 頁面 | 第一次（`15d7198`） | 第二次（`fe1174e`） |
|---|---|---|
| GreenSwift 智慧碳管理平台 | 4.0／4.2（C6 = 3）／4.5 | 4.0（D5 = 3）／4.7／4.8 |
| DigiLism 企業服務中台 | 4.0（D2 = 3）／4.2（C6 = 3）／5.0 | 4.0（D3 = 3）／4.5／4.7 |

分數依序是設計／文案與行銷／SEO。第一次之後修的是：

- GreenSwift：第 4、6、9 段的說明句重述下方的流程、指著頁面講話（「期限與限制都寫在這裡」）或和三列內容對不上（C6、C2），改成寫讀者得到什麼；「同一個平台」出現五次以上，減少；第 3、5、7 段 h2 帶進 ISO 14064-1、GHG Protocol 與帳號的用詞（S4）；拿掉從原句中間截出的 `greenswift-cloud-consultants`，單獨成一則會讀成 GreenSwift 提供 ESG 顧問（C6）；`greenswift-ai-report` 的空格斷句加上逗號
- DigiLism：第 2 段說明句重述右欄第一則原文，第 3、7 段說明句描述清單本身、把「照原文列出」寫進畫面（C6），都改寫；第 3 段 digiLogs 那一列原本借用 digiLogs 頁的 description，不是事實又有「一站式」（C3、C6），改成只寫節點名

第二次文案都升到 4 以上。設計仍是 4.0，扣到 3 的兩項都來自共用元件，不是本頁內容能改的：GreenSwift 的 D5 是數字沒有加粗、只有新聞標題的案例列不像一筆紀錄；DigiLism 的 D3 是 hero 證據點整句加粗壓過 tagline、產品索引的標題用內文字級。

### 還不夠好的地方

評審給 3、4 分的扣分處，沒有低於門檻，留給之後的 issue：

- 介面片段的狀態方塊旁沒有文字（D2，兩頁兩次都提到，`UiFragment` 共用；#201 也提到）
- hero 的證據點整句黑色粗體，視線從 h1 跳過 tagline（D3，兩頁都提到，`PageHero` 共用）
- 事實裡的數字沒有加粗（GreenSwift 的 99%、一個工作日、30天，D5），內頁共用規則寫「數字只加粗」
- 只有新聞標題的案例列：客戶名不在最前面，視覺重量比下方的相關文章輕（GreenSwift D3、D5，`CaseList`）
- 產品索引段（`index` 版型）在 1280 寬左欄只有標題，下方大片空白；標題字級和產品名一樣（DigiLism D2、D3、D4）
- 介面片段段落的事實較多時排到片段下方，標題欄空出一塊（GreenSwift 第 3 段，D2、D4）
- 375 寬 GreenSwift 第 4 段（接點圖加 6 則事實）約兩屏、DigiLism 第 4 段約 1.6 屏（D6）；`InPageNav` 在 375 寬右緣沒露出下一項（DigiLism D6）
- DigiLism：description 沒寫出銀行與保險業（S3）；第 2 段說明句「不必各自找工具再串起來」比原文多走一步（C3）。重評後沒有再改，評審檔對得上目前的頁面
- GreenSwift：頁尾 `ContactCta` 的共用說明「系統現況」對碳盤查讀者不貼切（C4）。同一項扣分的另一點「第 9 段的試用連結沒標出會離開本站」，在 PR #207 審查第 1 輪後修好（段落的站外連結帶 ↗ 與「外部網站」），評審檔評的是修正前的版本
- 兩篇碳足跡文章的連入錨點寫「經濟型方案」，本頁沒有（S5，兩次都提到）；使用者決定本 issue 不改

### 評審依據不足

| 缺口 | 文件 | 出現在 |
|---|---|---|
| 「各模板怎麼呈現」沒有產品家族 hub，也沒有 GreenSwift 這種沒有既有系統可畫的產品頁 hero；brief 交給設計概念階段的取捨（片段張數、索引列標題字級、試用片段的天數、色帶裡放片段）沒有回寫 | `design-principles.md`、`briefs/greenswift.md` 取捨第 7、10 項、`briefs/digilism.md` 取捨第 7、9 項 | 每一份 |
| 「至少 4 張介面片段」和 brief 降到 1 張（DigiLism）衝突，原則沒寫例外 | `design-principles.md`「內頁共用的規則」、`briefs/digilism.md` 取捨第 7 項 | digilism 兩次 |
| 「案例列」要客戶名在最前面、襯線粗體，brief 寫客戶名已在新聞標題裡、不再前綴 | `design-principles.md`「案例列」、`briefs/greenswift.md`「內部連結」第 8 段 | greenswift 第二次 |
| 介面片段版型寫「2–4 則事實在 9–12 欄」，沒寫原文太長放不進時能不能移到片段下方；片段的狀態要不要有看得到的文字 | `design-principles.md`「內頁的版型」「內頁共用的規則」 | greenswift 兩次 |
| 事實照原文引用和 `messaging.md`「語氣」（用您、不用我們開頭、不留 FAQ 的「是的，」）衝突，沒寫能不能裁掉開頭的語氣詞；截斷的原文能不能單獨成一則 | `messaging.md`、`design-principles.md` P2、`content-strategy` | greenswift 兩次 |
| brief 讓 digiLogs 那一列借用產品頁的 description，和 messaging「一句話的產品描述算事實」「本站不用的字」衝突（#202 改成只寫節點名，brief 已同步） | `briefs/digilism.md` 第 3 段、`messaging.md` | digilism 第一次 |
| `omitParts` 規定 `hasPart` 仍列全部子節點，S6 寫「和可見內容一致才給 5」 | `content-model.md`「hub」、`rubrics/seo.md` S6 | digilism 第二次 |
| 連入錨點的問題 brief 已列「待使用者決定」時，S5 要不要扣分 | `rubrics/seo.md` S5、`briefs/greenswift.md` 取捨第 13 項 | greenswift 兩次 |
| brief「說明句寫讀者得到什麼」放在「照原文列清單的段落」底下，看不出是否管全頁 | `briefs/digilism.md` | digilism 第一次 |

本 issue 只改頁面，這些規則文件之間的衝突列在 PR 的後續事項。

## 頁尾（#212）

`SiteFooter` 拿掉兩條細線、底色改近黑（`--color-bg-deep`）之後，三個試點頁各由新的 `reviewer` 只評設計 rubric，確認 D2 不再因 footer 扣分（`issue-ship` 第 8 步）。這是共用元件的確認，不是評審階段，摘要在 PR #222 的 body，不另存評審檔、不進上方的分數表。

### 方法

- 用的 rubric 與 prompt 和「第一批（#200）」相同，只評設計。素材由 `node scripts/strategy/eval-shots.mjs --only new --group b212-pilot` 產生，截圖不進版控
- 比較基準是 PR #207 的試點頁重評。digiRunner 比基準低，照「門檻附近加評」另開一位 `reviewer` 加評

### 結果

| 頁面 | PR #207 | #212 | D2 |
|---|---|---|---|
| 首頁 | 4.0（D2 3） | 4.2 | 4 |
| digiRunner | 4.2（D2 4） | 4.0；加評 4.0 | 3；3 |
| 金融 | 4.0（D2 3） | 4.0 | 3 |

四份評審都寫 footer 是近黑、沒有細線、和深紫帶分得開，沒有因 footer 扣分。digiRunner 低 0.2，兩位評審扣在同樣的地方，都不是 footer：`CaseList` 的一行 heading 與整句加粗的獎項（#213 的案例列規則，#210 改），第 7 段 TPS 沒加粗（#208 的規則），hero 圖少「新的服務」標籤。這些規則在 PR #207 重評之後才定，PR #222 列為待確認，建議接受。

### 評審依據不足

| 缺口 | 文件 | 出現在 |
|---|---|---|
| 案例列的 heading：原則寫兩行、不組「客戶名：標題」，元件表的 `CaseList` 仍寫 `linkHeading` 輸出「客戶名：案例標題」 | `design-principles.md`「案例列」、`design-system` 元件表 | digiRunner 兩次、金融 |
| 375 寬「一段不超過約 1.5 個螢幕高」沒寫螢幕高用哪個 viewport，brief 要的字數與原文長度又很難壓進去 | `design-principles.md`「內頁共用的規則」 | digiRunner 兩次 |
| 「全頁最多一條深紫帶」只寫在內頁，首頁可以有幾條沒寫；P5 三組判斷換底色，首頁 brief 卻讓兩組都用深紫 | `design-principles.md` P5、`briefs/home.md` 第 4、5 段 | 首頁 |
| 時間列「年份在前」與 brief「年份寫在原文裡，標題不重複」衝突，原文以年份開頭時畫面出現兩次 | `design-principles.md`「內頁的版型」、`briefs/finance.md` 第 2 段 | 金融 |
| 色帶要「一個動作」，brief 沒替金融第 7 段指定動作；索引列的「一句」brief 沒給來源 | `design-principles.md`「內頁的版型」、`briefs/finance.md` 第 6、7 段 | 金融 |
| 1280 寬頁內導覽放不下時怎麼排、片段內的狀態色（故障紅）算不算一種顏色 | `design-principles.md`「頁內導覽」、P4「色彩」 | digiRunner |

本 issue 只改 footer，這些缺口不在範圍內。

## 數字加粗與案例列（#210）

事實原文的數字改成加粗（`quantities()`）、`CaseList` 的 heading 改成客戶名與標題原文兩行之後，GreenSwift 與兩個用 `CaseList` 的試點頁各由新的 `reviewer` 只評設計 rubric，確認 D5 不低於原分數（#210 驗收）。這是共用元件的確認，不是評審階段，摘要在 PR #223 的 body，不另存評審檔、不進上方的分數表。

### 方法

- 用的 rubric 與 prompt 和「第一批（#200）」相同，只評設計。素材由 `node scripts/strategy/eval-shots.mjs --new dist --only new --group b210 --pages greenswift=/products/greenswift,digirunner=/products/digirunner,finance=/industries/finance` 產生，截圖不進版控
- 比較基準：GreenSwift 是「第一批（#202）」的第二次（設計 4.0、D5 3），digiRunner 與金融是「頁尾（#212）」（設計都是 4.0，D5 單項沒有存檔）

### 結果

| 頁面 | 基準 | #210 | D5 | D2 |
|---|---|---|---|---|
| GreenSwift | 4.0（D5 3） | 3.5（D2、D3、D6 = 3） | 4 | 3 |
| digiRunner | 4.0 | 4.3 | 5 | 4 |
| 金融 | 4.0 | 4.0 | 4 | 3 |

D5 三頁都沒有因數字或案例列扣分：GreenSwift 的評審寫「99%」「一個工作日」「30」加粗、條件緊貼，客戶名在最前面；digiRunner 的評審寫 TPS 規格列加粗，獎項用內文字重、只有 2020 加粗。

GreenSwift 的設計平均比基準低 0.5，和 #210 有關的只有 D3：只有一則、沒有成果的案例列，份量仍比下方有縮圖的相關文章輕。評審建議縮小相關文章的縮圖或加重案例列。依推薦交給 #211（`IndexList` 的版面），原則的「案例列」不改。其他扣分在本次之前就有：hero 圖少資料來源與產出的標籤、第 5、7 段介面片段旁的空白（「內頁的版型」介面片段）、`UiFragment` 的狀態只有色塊（#209）、375 寬的單字斷行、案例段 h2 用分類名「成功案例」。金融的評審把沒有片段的案例列右半邊空著算成 `CaseList` 的扣分（D2、D4），這是 #187 起的排法，不算這項時分數不變。

### 評審依據不足

| 缺口 | 文件 | 出現在 |
|---|---|---|
| 375 寬「一段不超過約 1.5 個螢幕高」和 brief 要的事實量互相拉扯，又不能收進 `<details>` | `design-principles.md`「內頁共用的規則」、`briefs/digirunner.md` 第 2、7 段 | digiRunner、GreenSwift |
| 文章封面算不算在 P3、P4 的禁令內（AI 擬人化、光暈、樹葉與地球） | `design-principles.md` P3、P4、「索引列」 | digiRunner、GreenSwift |
| 頁內導覽沒寫位置與 1280 寬放不下時怎麼辦（#211 第 3 項） | `design-principles.md`「頁內導覽」 | digiRunner、GreenSwift |
| hero 圖能不能多加 brief 沒列的標籤，少一個算不算違反；GreenSwift brief 與原則的 hero 標籤要求不同 | `design-principles.md`「offering」兩節、`briefs/digirunner.md`、`briefs/greenswift.md` 第 1 段 | digiRunner、GreenSwift |
| 只有一則、沒有成果的案例段怎麼做到「份量不低於相關文章」，縮圖最大多大 | `design-principles.md`「案例列」、`design-system` 元件表 `IndexList` | GreenSwift |
| 案例段的 h2 能不能用分類名 | `design-principles.md`「段落標題」、brief 第 8 段 | GreenSwift |
| 案例列只有第一則配片段時，其他列的右側怎麼處理 | `design-principles.md`「案例列」排法、P5 | 金融 |
| 介面片段版型「超過 4 則排到下方」和 brief「具名案例放片段旁」衝突；片段裡的「未啟用」狀態代表什麼；色帶與索引列的動作、一句由誰給 | `design-principles.md`「內頁的版型」、`briefs/finance.md` 第 6、7 段 | 金融 |

本 issue 只改數字加粗與案例列，這些缺口不在範圍內。

## 索引列與頁內導覽（#211）

`IndexList` 的連結樣式、固定縮圖與兩欄，`index` 段落改成標題在上，`InPageNav` 改成淡出加箭頭之後，四頁各由新的 `reviewer` 只評設計 rubric，確認 #211 的驗收：digiRunner、金融的 D2 不低於 #210，DigiLism 的 D3 不低於「第一批（#202）」，加看 GreenSwift 的 D3。這和 #210 一樣是共用元件的確認，不是評審階段：摘要在 PR #224 的 body，不另存評審檔、不進上方的分數表，也不套「門檻附近加評」。

### 方法

- rubric 與 prompt 同 #210，只評設計。素材由 `node scripts/strategy/eval-shots.mjs --new dist --only new --group b211 --pages digilism=/products/digilism,greenswift=/products/greenswift,digirunner=/products/digirunner,finance=/industries/finance --work <scratchpad>` 產生（head `e35affe`），截圖不進版控
- 比較基準：digiRunner、金融、GreenSwift 是「數字加粗與案例列（#210）」，DigiLism 是「第一批（#202）」的第二次

### 結果

| 頁面 | 基準 | #211 | 驗收項 |
|---|---|---|---|
| digiRunner | 4.3（D2 4） | 4.2 | D2 4 |
| 金融 | 4.0（D2 3） | 4.0 → 4.2（重評） | D2 3 → 4 |
| DigiLism | 4.0（D3 3） | 4.2 | D3 4 |
| GreenSwift | 3.5（D3 3） | 3.8（D2 3） | D3 4 |

四項都不低於基準。評審寫到 #211 改的地方：DigiLism 的產品索引「h2 用 h2 字級，標題橫跨在上，列項目兩欄，名稱用連結色加底線」；三頁都寫頁內導覽「右緣淡出」，digiRunner 另寫「1280 寬有箭頭」。GreenSwift 的 D3 從 3 到 4，評審仍寫相關文章的紫色加底線襯線標題比只有一則的案例列重：縮圖縮到 120×80 之後，剩下的份量來自索引列名稱和案例客戶名同字級（見下方「評審依據不足」）。

評審指出、在本 PR 修掉的：金融第 6 段末的索引列（InsureBrick、InsureRing）在 1280 寬仍是一欄，和改過的「索引列」不一致，改成兩欄（`0d44aef`）。改完後由另一位新的 `reviewer` 重評金融（素材取自 `0d44aef` 之後、`fd5b2de` 之前的本機 build，`--group b211b`）：4.2，D2 4，仍不低於基準；這位評審寫兩欄的段末索引列名稱「用大號襯線加底線，反而是這段文字裡最顯眼的元素」，壓過同段的保險具名案例（D3 4），和 GreenSwift 的相關文章是同一個問題。GreenSwift 的評審把相關文章一欄算成違反「索引列」，評審讀到的是補上例外前的原則；原則已寫明帶縮圖的相關文章維持一欄。

其他扣分在本次之前就有，不在範圍內：GreenSwift 與金融內文最後一行只剩一個字或標點（`FactText`、`SiteFooter`、`SectionHeading` 說明句），GreenSwift 第 5、7 段片段旁的半欄空白與 hero 圖只有一個標籤，DigiLism hero 缺連到產品索引的次要連結、第 5 段 h2 斷出孤字（`phrases.ts` 沒收這個標題），digiRunner hero 圖少「新的服務」標籤與第 8 段片段的分頁和列項目重複，金融第 6 段兩個產品的事實交錯、具名案例沒放在片段旁。

### 評審依據不足

| 缺口 | 文件 | 出現在 |
|---|---|---|
| 只有一則、沒有成果的案例列，在索引列名稱與客戶名同字級、索引列名稱又用連結色加底線時，怎麼做到「份量不低於相關文章」；段末索引列的名稱壓過同段的具名案例（#226 已處理，見下方「索引列名稱與案例列（#226）」） | `design-principles.md`「案例列」「索引列」 | GreenSwift、金融 |
| 文章封面算不算在 P3 的禁令內（擬人機器人、發光的 3D 圖） | `design-principles.md` P3、「索引列」 | digiRunner |
| 家族頁 hero 的次要連結：原則（#213）要有，brief 第 1 段只寫一個動作（#227 已處理，見下方「家族頁 hero 的次要連結（#227）」） | `design-principles.md`「hub：產品家族頁」、`briefs/digilism.md` | DigiLism |
| 斷詞表沒收的標題怎麼處理；內文最後一行只剩一字由哪個元件負責（#225 已處理，見下方「斷行（#225）」） | `design-principles.md`「斷行」 | DigiLism、GreenSwift、金融 |
| 段末索引列只有 2 項時，「一句」是否必填 | `design-principles.md`「索引列」、`briefs/finance.md` 第 6 段 | 金融 |
| GreenSwift hero 圖的標籤：原則要資料來源與產出去處，brief 只用事實寫得出的三個詞 | `design-principles.md`「offering：沒有既有系統可畫的產品頁」、`briefs/greenswift.md` 第 1 段 | GreenSwift |
| 375 寬「一段不超過約 1.5 個螢幕高」和 brief 的事實量互相拉扯 | `design-principles.md`「內頁共用的規則」 | digiRunner、GreenSwift、DigiLism |

## 斷行（#225）

內文改成 `text-wrap: pretty`、`SectionHeading` 說明句不用詞組斷行、`FactText` 長項目清單窄寬排一欄、`phrases.ts` 單字詞併回一個詞並擴到 `.text-phrase` 與表格儲存格之後，三頁各由新的 `reviewer` 只評設計 rubric，確認 #225 的驗收：評審不再指出孤字或孤標點，D2 不低於 #211（GreenSwift 3、金融 4、DigiLism 4）。和 #210、#211 一樣是共用元件的確認，摘要在 PR #228 的 body，不另存評審檔、不進上方的分數表，也不套「門檻附近加評」。

### 方法

- rubric 與 prompt 同 #211，只評設計。素材由 `node scripts/strategy/eval-shots.mjs --new dist --only new --group b225 --pages greenswift=/products/greenswift,finance=/industries/finance,digilism=/products/digilism --work <scratchpad>` 產生（head `65fc25b`），截圖不進版控
- 比較基準：三頁都是「索引列與頁內導覽（#211）」

### 結果

| 頁面 | #211 | #225 | 驗收項 |
|---|---|---|---|
| GreenSwift | 3.8（D2 3） | 3.7 | D2 3 |
| 金融 | 4.2（D2 4） | 4.2 | D2 4 |
| DigiLism | 4.2（D2 4） | 4.2 | D2 4 |

三位評審都沒有指出孤字或孤標點。評審寫到 #225 改的地方：金融「375 寬時 tagline 照詞組斷成兩行」「超過 8 字的清單排一欄、沒有縮小字級」；DigiLism「標題沒有孤字」。

GreenSwift 的平均比 #211 低 0.1，扣分都在本次之前就有：hero 圖只有一個標籤、第 5、7 段片段旁的單側空白（`PageSections` 的「超過 3 則」和原則的「超過 4 則，或文字比片段長」條件不同）、`UiFragment` 的「已啟用」只有紫色方塊、案例列比相關文章輕、第 4 段 375 寬約 1.7 個螢幕高。評審另外指出第 3 段「ISO 14064-1 與 GHG Protocol 的盤查步驟已內建」與第 5 段「部門分工收數據，帳號與組織邊界不設上限」的 h2 是三行（1280 寬，第 3 段 375 寬也是）。用 main（`8478e9f`）的 build 對照，兩個 h2 在 375、1280 的行數和本 PR 相同，是標題本身的長度，不是斷行規則造成的，不在 #225 範圍內。

### 評審依據不足

| 缺口 | 文件 | 出現在 |
|---|---|---|
| h2 含長英文標準名（ISO 14064-1、GHG Protocol）時，「兩行以內」要改文案還是可以例外 | `design-principles.md`「段落標題」、`briefs/greenswift.md` 第 3 段 | GreenSwift |
| 介面片段的事實何時排到片段下方：原則寫「超過 4 則，或文字比片段長」，`PageSections` 實作「超過 3 則」 | `design-principles.md`「內頁的版型」介面片段、`design-system` 元件表 | GreenSwift |
| 案例列只有第一則配片段時，其餘列在 1280 寬右欄怎麼處理，和 P5「另一半螢幕空著」互相拉扯 | `design-principles.md`「案例列」 | 金融 |
| 時間列「年份在前」和 brief「年份寫在事實原文裡」一起做，年份重複出現 | `design-principles.md`「內頁的版型」時間列、`briefs/finance.md` 第 2 段 | 金融 |
| 同一張段落圖能否跨頁沿用；白底段落圖放在淺灰段落的背景 | `design-principles.md`「內頁共用的規則」段落圖、`briefs/digilism.md` 第 6 段 | DigiLism |

## 介面片段的狀態（#209）

`UiFragment` 的狀態改成看得到的字（設定面板：已啟用、未啟用、故障；流程步驟：已完成、略過、下一步），色塊放在字前當色標之後，三頁各由新的 `reviewer` 只評設計 rubric，確認 #209 的驗收：digiRunner、金融的 D2 不低於目前分數（digiRunner 是 #211 的 4，金融是 #225 的 4），加看 GreenSwift（issue 舉的例子是它的試用片段）。和 #210–#225 一樣是共用元件的確認，摘要在 PR #229 的 body，不另存評審檔、不進上方的分數表，也不套「門檻附近加評」。

### 方法

- rubric 與 prompt 同 #225，只評設計。素材由 `node scripts/strategy/eval-shots.mjs --new dist --only new --group b209 --pages digirunner=/products/digirunner,finance=/industries/finance,greenswift=/products/greenswift --work <scratchpad>` 產生（head `d1fb631`），截圖不進版控
- 比較基準：digiRunner 是「索引列與頁內導覽（#211）」，金融、GreenSwift 是「斷行（#225）」

### 結果

| 頁面 | 基準 | #209 | 驗收項 |
|---|---|---|---|
| digiRunner | 4.2（D2 4） | 4.0 | D2 4 |
| 金融 | 4.2（D2 4） | 4.2 | D2 4 |
| GreenSwift | 3.7（D2 3） | 3.8 | D2 4 |

D2 都不低於基準，三位評審都沒有再指出「只有色塊的狀態」。digiRunner、金融的評審寫片段「狀態寫成字（已啟用、未啟用、故障）」「狀態用文字寫（已完成、下一步、已啟用、未啟用）」。

評審指出、在本 PR 修掉的：GreenSwift 第 3 段的「盤查流程」片段把「已完成、進行中、未開始」寫在列的 `value`，畫面上沒有色標，和同頁用元件狀態詞的試用片段不一致，也是內容檔自己寫狀態詞（#209 期望 2）。改成 `kind: steps`（前兩步 `on`、第三步 `next`，其餘不標），`briefs/greenswift.md` 第 3 段的影像欄跟著改；schema 擋下 `value` 寫成狀態詞，之後不會再出現。這項修正在評審之後，GreenSwift 沒有重評：扣在 D2 的三處之一，D2 已經是 4。

digiRunner 的平均比 #211 低 0.2，扣分都和片段的狀態無關，本次之前就有：hero 圖少「新的服務」標籤、第 2 段 `digirunner-five-applications` 的三行排成同一段、第 5 段與案例段 1280 寬的單側空白、相關文章的標題比案例列醒目、375 寬第 7 段約 2 個螢幕高。GreenSwift 只有 D3 低於 4（案例段被相關文章壓過、段落順序和 brief 不同），和 #225 相同，屬於 `IndexList`／`CaseList` 與本頁的段落順序，不在範圍內。

### 評審依據不足

| 缺口 | 文件 | 出現在 |
|---|---|---|
| 產品頁的主要段落一律用 `--font-size-h2`，和 P5「字級依段落重要性分級」互相拉扯 | `design-principles.md`「段落標題」、P5「字體」 | digiRunner |
| 名稱裡的年份（獎項名稱的 2020）算不算 `quantities()` 的例外 | `design-principles.md`「內頁共用的規則」事實 | digiRunner、金融 |
| 色帶規定 1–2 則事實與一個動作，`briefs/finance.md` 第 7 段是 3 則不同主題、沒有動作 | `design-principles.md`「內頁的版型」色帶、`briefs/finance.md` 第 7 段 | 金融 |
| 段落圖是白底，規格表段墊淺灰，兩者一起照做會出現白色方框 | `design-principles.md`「內頁共用的規則」段落圖 | 金融 |
| hero 圖的標籤：brief 只用 `fact:greenswift-scope` 的詞，原則要求左標資料來源、右標產出 | `briefs/greenswift.md` 第 1 段、`design-principles.md`「offering：沒有既有系統可畫的產品頁」 | GreenSwift |
| 頁內導覽「位置在 hero 下方」和 `InPageNav` 的 `stick="header"` | `design-principles.md`「內頁共用的規則」頁內導覽、`design-system` 元件表 | GreenSwift |
| 案例與試用的段落順序：brief 案例在前，「沒有既有系統可畫的產品頁」照 digiRunner 是試用在前（#226 已處理） | `briefs/greenswift.md`、`design-principles.md`「offering：digiRunner 產品頁」 | GreenSwift |
| 案例列只有第一則配片段時，1280 寬其餘各列的右半邊（#225 已列） | `design-principles.md`「案例列」 | digiRunner、金融 |

## 索引列名稱與案例列（#226）

`IndexList` 的名稱改成跟段落分級：次要段落降到 `--font-size-base` 的無襯線半粗；主要段落維持 `--font-size-text` 的襯線粗體，包括產品家族 hub 的產品索引、ESG 顧問頁的團隊、沒有 `sections` 的 hub 的子頁。GreenSwift 的案例照 brief 排在試用之前（offering 的 `casesBefore`）。改完後 GreenSwift 與金融各由新的 `reviewer` 只評設計 rubric，確認 #226 的驗收：評審不再指出索引列比案例重，D3 不低於 #211 的 4。和 #210、#211、#225、#209 一樣是共用元件的確認，摘要在 PR #230 的 body，不另存評審檔、不進上方的分數表，也不套「門檻附近加評」。

### 方法

- rubric 與 prompt 同 #209，只評設計。素材由 `node scripts/strategy/eval-shots.mjs --new dist --only new --group b226 --pages greenswift=/products/greenswift,finance=/industries/finance --work <scratchpad>` 產生（head `960c7cb`），截圖不進版控
- 比較基準：兩頁都是「介面片段的狀態（#209）」。驗收看的 D3 門檻是 #211 的 4（issue 驗收）；GreenSwift 在 #209 的 D3 是 3

### 結果

| 頁面 | 基準 | #226 | 驗收項 |
|---|---|---|---|
| 金融 | 4.2（D3 4） | 4.2 | D3 4 |
| GreenSwift | 3.8（D3 3） | 3.8 | D3 4 |

兩位評審都沒有再指出索引列比案例重。金融的評審寫「第 6 段末的索引列名稱是 base 字級的無襯線，比案例的客戶名小，沒有壓過保險案例」；GreenSwift 的評審寫「案例排在試用之前，不會被相關文章壓過；和鼎隆建築的襯線粗體比相關文章的標題大」，D2 的符合項也列了「案例列排在試用色帶之前」「相關文章標題用次要字級」。

GreenSwift 的 D3 仍扣在「成功案例」h2 用主要段落的字級、下面只有一行客戶名和一行連結，以及 8 個事實段的 h2 同級；這是段落標題的分級，不是索引列與案例列的份量（#209「評審依據不足」第 1 列的同類）。兩頁其他扣分在本次之前就有：GreenSwift 第 5、7 段片段旁的空白（`PageSections` 的「超過 3 則」和原則的條件不同）、hero 圖只有一個標籤、頁內導覽位置，金融第 3 段事實的排法、第 6 段兩個產品的事實交錯、案例列只有第一則配片段時的右半空白。

### 評審依據不足

| 缺口 | 文件 | 出現在 |
|---|---|---|
| 只有一則案例的段落，h2 用主要段落的字級，下面只有兩行，讀起來像大標下的註腳 | `design-principles.md`「段落標題」「案例列」 | GreenSwift |
| 一段裡有兩個產品的事實時，照產品分組還是照列排；「具名案例放片段旁」和「超過 4 則排到下方」（#211 已列） | `design-principles.md`「hub：金融產業頁」第 6 段、「內頁的版型」介面片段 | 金融 |
| 375 寬「螢幕高」沒有定義 px；成果版型每則各配片段，和「375 寬片段只留主要的一塊」衝突 | `design-principles.md`「hub：金融產業頁」、「內頁共用的規則」 | 金融 |
| 接點圖寫「SVG 架構圖」，HTML 的三欄色塊圖算不算 | `design-principles.md`「內頁的版型」接點圖 | GreenSwift |

hero 標籤、頁內導覽位置、片段事實排到下方的條件、案例列右欄，在 #225、#209 已列，不重複。

## 家族頁 hero 的次要連結（#227）

hub 加上 `secondaryCta`（只接受連到本頁某段的 `#id`），`HubTemplate` 把它輸出成「聯絡業務」按鈕後的文字連結（`Link variant="standalone"`），不做第二個按鈕。`/products/digilism` 寫「看 DigiLism 的產品」、`/products/systalk-ai` 寫「看 SysTalk.ai 的產品」，都連到 `#products`；兩份 brief 的第 1 段與「CTA」照「hub：產品家族頁」的動作回寫。改完後兩頁各由新的 `reviewer` 只評設計 rubric，確認 #227 的驗收：DigiLism 的 D2 不再因 hero 少了次要連結扣分、不低於 #211 的 4。和 #210–#226 一樣是確認，摘要在 PR body，不另存評審檔、不進上方的分數表，也不套「門檻附近加評」。

其他產品家族 hub 不加：ESGswift（三語）與 en、vi 的 DigiLism、SysTalk.ai 還沒照 brief 改版，hero 沒有任何動作，「主要 CTA 照 brief」沒有 brief 可照，改版時再套；GadoSecurity 是 draft，不產生頁面。

### 方法

- rubric 與 prompt 同 #226，只評設計。素材由 `node scripts/strategy/eval-shots.mjs --new dist --only new --group b227 --pages digilism=/products/digilism,systalk-ai=/products/systalk-ai --work <scratchpad>` 產生（head `2916370`），截圖不進版控
- 比較基準：DigiLism 是「斷行（#225）」，SysTalk.ai 是「第一批（#200）」的第二次

### 結果

| 頁面 | 基準 | #227 | 驗收項 |
|---|---|---|---|
| DigiLism | 4.2（D2 4） | 4.2 | D2 4 |
| SysTalk.ai | 4.2 | 3.8（D2 3） | — |

兩位評審都把 hero 的文字連結列為符合：DigiLism「次要動作是寫出目的地的文字連結，不是第二個按鈕」，SysTalk.ai「次要動作做成文字連結『看 SysTalk.ai 的產品』，沒有第二顆按鈕」。DigiLism 的 D2 扣在第 6 段段落圖在淺灰底上像空白卡片、hero 圖少了 brief 列的「大型主機」標籤，都和本次無關。

SysTalk.ai 比 #200 低 0.4，D2 的 3 扣在四處，都不在本次改動的 hero 範圍內（本 PR 只改了 hero 的動作列）：第 3 段 h2 在 1280 寬斷成三行、第一行只剩「地端」；第 2 段對應表右欄的連結名稱在詞中間斷行（「SysTalk.Coach AI 業／務培訓」），375 寬第 6 段表頭斷在「4-／GPU Server」；`InPageNav` 在 hero 上方；hero 圖沒有既有系統的標籤。評審把前三處算成共用元件（`SpecTable`、`phrases.ts`、`InPageNav`）的扣分，不算時是 4.0。#200 之後 #211、#225 才寫進頁內導覽與斷行的規則，這次的評審照新的原則看。這幾處要另開 issue，見 `status.md`「下一步」。

### 評審依據不足

| 缺口 | 文件 | 出現在 |
|---|---|---|
| 外部評選（獎項）段的份量：brief 用「主張與原文」，讓這頁唯一的外部證據落在最輕的版面 | `design-principles.md`「hub：產品家族頁」、`briefs/digilism.md` 第 7 段 | DigiLism |
| 接點圖在 375 寬改成上下疊時，怎麼保留左中右的接上順序 | `design-principles.md`「內頁的版型」接點圖 | DigiLism |
| h1 與 h2 至少差多少；兩行的 h2 份量和 h1 接近算不算違反 | `design-principles.md`「段落標題」 | DigiLism |
| hero 圖的標籤：原則寫「家族接上的既有系統類別」，`briefs/systalk-ai.md` 第 1 段指定用 AI 工作的詞；`briefs/digilism.md` 列了「大型主機」，原則只寫「例如」 | `design-principles.md`「hub：產品家族頁」影像、兩份 brief 第 1 段 | DigiLism、SysTalk.ai |
| 產品家族頁用對應表當產品索引時，模板輸出的子頁索引列算主要還是次要段落 | `design-principles.md`「hub：產品家族頁」段落第 1 點、「索引列」 | SysTalk.ai |
| 「375 寬」短詞清單排兩欄，和「斷行」超過 8 字的清單排一欄；模型參數規模（100B、70B）算不算數量 | `design-principles.md`「內頁共用的規則」375 寬、斷行、事實 | SysTalk.ai |

段落圖的白底與淺灰段、頁內導覽位置，在 #225、#209 已列，不重複。

## 單則案例的段落標題（#231）

內頁的段落標題分成主要（`--font-size-h2`）與次要（`--font-size-text`）兩級（`design-principles.md`「段落標題」）：只有一則、沒有成果也沒有獎項的案例段由模板降成次要（`src/lib/content/cases.ts` 的 `caseWeight()`），規格表段可設 `weight: secondary`，GreenSwift 第 6 段「資安、可用性與語言」照此設定。改完後 GreenSwift 由新的 `reviewer` 只評設計 rubric，確認 #231 的驗收：評審不再指出案例段的標題比內容大太多，D3 不低於 #226 的 4。和 #210–#227 一樣是共用元件的確認，摘要在 PR body，不另存評審檔、不進上方的分數表，也不套「門檻附近加評」。

### 方法

- rubric 與 prompt 同 #226，只評設計。素材由 `node scripts/strategy/eval-shots.mjs --new dist --only new --group b231 --pages greenswift=/products/greenswift --work <scratchpad>` 產生（head `d80937c`），截圖不進版控
- 比較基準：「索引列名稱與案例列（#226）」

### 結果

| 頁面 | 基準 | #231 | 驗收項 |
|---|---|---|---|
| GreenSwift | 3.8（D3 4） | 3.8 | D3 4 |

評審沒有再指出「成功案例」標題比下面兩行重，D2 的符合項列了「第 6、8、10 段的標題降成次要字級」。D3 的扣分換成兩處段落圖：第 6 段標題降成次要後，旁邊約 360×270 的段落圖比標題與表格搶眼；第 2 段的段落圖也比方案名搶眼。D5 提到案例段在 1280 寬只剩左上角兩行，「照案例列的降級規則，在視覺上很難被看到」。

其他扣分在本次之前就有：hero 圖只有一個標籤（D1、D2）；第 3 段 9–12 欄只剩標題與說明句、375 寬第 5、7、9 段的片段排在事實之後（D2、D6，評審算成 `PageSections` 的共用元件扣分，不算時 D2 是 4、平均 4.0）；第 3、5、7、8 段的單側空白（D4）；第 4 段 375 寬約 1450px。

### 評審依據不足

| 缺口 | 文件 | 出現在 |
|---|---|---|
| 段落圖在次要段落旁的份量：標題降成次要後，段落圖的大小不變，壓過標題與表格 | `design-principles.md`「內頁共用的規則」段落圖、「段落標題」 | GreenSwift |
| 段落圖要不要照 P4「色彩」的方塊配色（第 6 段的段落圖有品紅方塊） | `design-principles.md` P4「色彩」 | GreenSwift |
| 片段比文字欄短很多時的單側空白要怎麼處理 | `design-principles.md`「內頁的版型」介面片段、P5「不會怎麼呈現」 | GreenSwift |

hero 標籤（brief 與原則的衝突）、ui 段事實排到下方的門檻（原則寫超過 4 則，元件表寫超過 3 則），在 #209、#226 已列，不重複。

## 限制

- 每頁只有一位評審評一次，沒有量評審之間的一致性。新版 digiRunner 的 C 平均 3.8、金融的 SEO 3.8，接近門檻，換一位評審可能翻轉
- 首頁評的是減少動態的靜態版，3D 版的第一屏與捲動敘事沒有評到
- 只評 zh-TW；en、vi 首頁還是舊文案（#177）
- 5 秒測試是模擬，見「方法」
