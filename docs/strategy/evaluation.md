# 評審與驗證報告（#168）

用 `site-review` 的三份 rubric 比較試點三頁的新版、舊版、現站，以及兩家競品首頁，看分階段流程（#162–#167）做出來的頁面有沒有比較好，還差在哪裡，以及流程的哪一段沒擋住問題。

## 結論

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
- `SiteFooter` 在深紫聯絡帶下方與版權列上方各有一條細線（D2，全站共用）

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

## 限制

- 每頁只有一位評審評一次，沒有量評審之間的一致性。新版 digiRunner 的 C 平均 3.8、金融的 SEO 3.8，接近門檻，換一位評審可能翻轉
- 首頁評的是減少動態的靜態版，3D 版的第一屏與捲動敘事沒有評到
- 只評 zh-TW；en、vi 首頁還是舊文案（#177）
- 5 秒測試是模擬，見「方法」
