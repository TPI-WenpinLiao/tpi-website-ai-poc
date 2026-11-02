# 評審與驗證報告（#168）

用 `site-review` 的三份 rubric 比較試點三頁的新版、舊版、現站，以及兩家競品首頁，看分階段流程（#162–#167）做出來的頁面有沒有比較好，還差在哪裡，以及流程的哪一段沒擋住問題。

## 結論

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

- 依 `site-review`「做法」第 1 步，每頁開一個新的 `reviewer`，共 11 個。評分用的是本 PR 修改前（eb0592e）的 rubric 與 `site-review`；本 PR 改了 D1 錨點，補了 4、2 分的給法與 C3、C4、S6 的提示（見「流程回寫」），之後用新 rubric 重評的分數不能和這一輪直接比較。prompt 只給截圖、HTML、`docs/strategy/` 的依據與 rubric，不給其他組的分數。評審結果原文存在 `evaluation/reviews/<組>-<頁>.md`，只調整標題層級
- 新版、舊版、現站都是昕力的頁面，三份 rubric 全評，對照同一份 brief，量的是離 brief 多遠
- 競品沒有 brief，也不適用昕力的設計原則：D2、C5、S1、S2、S5 標不適用，平均只算其餘項目。競品的平均和昕力頁面的平均算的項目不同，只能大致比較
- 每頁另請評審寫「評審依據不足」：哪些項目因為文件寫得不清楚而難以判斷。流程回寫主要依據這一節

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

評審的「評審依據不足」整理成下表。每一列是一個流程缺口：哪個階段的產出物不夠用、哪個關卡沒擋住，以及這次改了什麼。

| # | 缺口 | 階段 | 證據 | 這次的修改 |
|---|---|---|---|---|
| 1 | 設計原則只寫首頁的「會怎麼呈現」，產品頁、產業頁沒有依據 | 設計概念 | 6 份評審都提到（new-digirunner、new-finance、old-digirunner、old-finance、current-digirunner、current-finance） | `design-concept`：原則要為 `site-profile.md` 的每個試點模板寫「會怎麼呈現」 |
| 2 | 原則定案後，`design-system` 的元件表沒有跟著改，還在規定 eyebrow 與編號 | 設計概念 → 製作 | new-digirunner D2、new-finance D2 | `design-concept`：寫回 `design-system` 時，列出和「不會怎麼呈現」衝突的元件，寫進製作 issue；`design-system` 元件表的 `PageHero`、`SectionHeading`、`Card` 標「待改（#187）」 |
| 3 | 製作階段的關卡只有 `npm run check`，原則違反到評審階段才抓到 | 製作 | 同上 | `issue-ship` 第 8 步與 `docs/workflow.md`「分階段流程」：製作 issue 改到試點頁用的模板、元件或內容時，轉 ready 前每頁由新的 `reviewer` 評設計 rubric，D2 < 3 先修 |
| 4 | brief 在製作階段改了段落結構，但只在開頭加一段「製作階段的版本」，段落表、CTA 表、連出表沒有同步；原則 P5 也還寫 8 段 | 製作 | new-home、old-home、current-home 第 1 項 | `content-strategy`：製作階段改了段落就改寫 brief 的段落表與相關表格，不另加版本段落 |
| 5 | brief 與原則、brief 與 messaging 互相衝突（金融頁 eyebrow、digiRunner hero 的「免費」） | 策略、設計概念 | old-finance、new-digirunner | `design-concept`：原則定案後逐份對照 brief，衝突寫進 brief 的「取捨」；`content-strategy`：hero 證據點要符合 messaging 的限制 |
| 6 | brief 沒寫每段放什麼圖 | 策略 | new-digirunner 第 2 項 | `content-strategy`：段落表加「影像」欄，設計概念階段填 |
| 7 | messaging 的證據點不一定支撐主張的關鍵詞（`DM-2` 收了沒提到 AI 的阻詐平台） | 策略 | new-home C3 與第 5 項 | `content-strategy`：證據點的原文要直接支撐主張的關鍵詞 |
| 8 | 競品分析只看首頁，產品頁與產業頁的 D1、S2 沒有對照 | 研究 | 7 份評審 | `site-research`：競品分析涵蓋每個試點模板；搜尋意圖記錄前幾名缺了哪些子題 |
| 9 | rubric 只有 5、3、1 的錨點，「取低的」讀法不一，D1 的 3 與 1 重疊 | 評審 | 4 份評審 | `site-review`「Rubric」寫出 4、2 分的判斷方式；`design.md` 的 D1 錨點改為 3 分「看得出做什麼，但看不出給誰或跟競品的差別」、1 分「只看得出是軟體或科技公司」；內頁的 D1、D2 照該模板的原則，D2 包含共用元件 |
| 10 | C3 沒說 `to_confirm`、messaging 排除的事實、原文後接加強句怎麼算 | 評審 | current-home、current-digirunner、old-digirunner | `copy-marketing.md` 評分提示補上 |
| 11 | C4 的主要轉換：`site-profile.md` 與 brief 不同時以哪個為準 | 評審 | old-digirunner、current-digirunner | `copy-marketing.md`：brief 指定時以 brief 為準 |
| 12 | S6 沒寫缺整個必要類型、欄位要多少才算一致 | 評審 | current-home、new-digirunner | `seo.md` 評分提示：以 `content-model.md` 規定的類型與欄位為準 |
| 13 | 減少動態下的空白、淡出、只在 hover 出現的內容怎麼算；S5 的「連入」只有一頁 HTML 評不了 | 評審 | old-home、current-finance、current-digirunner | `site-review`「評審對象的準備」：截圖以減少動態截取，看不到的內容當實際呈現評；hover 才出現的不算看得到；連入用 grep 查整份 `dist/` |
| 14 | 評審素材要手動準備，整頁長圖縮小後讀不到字 | 評審 | 本次執行 | `site-review` 新增「評審對象的準備」，用 `eval-shots.mjs` 產生匿名代號與切段，`eval-scores.mjs` 產生分數表；`site-review`「做法」第 5 步與 `reviewer` agent 要求每份評審寫「評審依據不足」 |

不改的：

- 匿名化對現站不完全（缺口無法用流程解決，現站的 markup 本身就看得出來）。報告註明，分數照用
- 「事實原文照引時能不能加標點、拆成清單」（new-finance 第 6 項）。這是內容規則的取捨，改了會影響 `facts.mjs` 的比對方式，列在 #186 由使用者決定

### 後續 issue

- #186 策略文件同步：產品頁與產業頁的「會怎麼呈現」、`briefs/home.md` 改成 5 段版、`DM-2` 的證據點、brief 的衝突、競品內頁研究（`strategy-approved` 關卡）
- #187 試點三頁依本報告修正並重評，依賴 #186
- #188 決定其他頁面是否照分階段流程重做

## 限制

- 每頁只有一位評審評一次，沒有量評審之間的一致性。新版 digiRunner 的 C 平均 3.8、金融的 SEO 3.8，接近門檻，換一位評審可能翻轉
- 首頁評的是減少動態的靜態版，3D 版的第一屏與捲動敘事沒有評到
- 只評 zh-TW；en、vi 首頁還是舊文案（#177）
- 5 秒測試是模擬，見「方法」
