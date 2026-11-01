# 第四輪的兩個方向（#166）

> 定案（2026-11-01，`design-approved`）：使用者選定 `ribbon-route`。`t-gateway` 的原型已刪除，最後的版本在 git 歷史 `443e440:docs/strategy/concepts/t-gateway/`；本檔保留兩個方向的定義，當選擇的紀錄。

本檔定義設計概念第四輪的兩個首頁方向，交給建原型的 agent 各自做成 `docs/strategy/concepts/<id>/index.html`。方向由 `design-director` 以科技品牌網站為參考定義，不用 `taste-skill` 的 `draw.mjs` 發牌（`.claude/skills/design-concept/SKILL.md`「用 `taste-skill` 檢查原型」）。

- 依據：使用者 2026-11-01 的決定（`design-concept` skill 衝突表「第四輪」一列）、`docs/strategy/design-principles.md` 的 P1–P5、`docs/strategy/messaging.md` 的定位句、`docs/strategy/concepts/copy-deck.md` 的 5 段文字（另一個 agent 同時在改，段落的標題與事實以它為準）
- 本檔不寫文案。下文提到「第 N 段的大標題」「第 N 段的事實」時，指 `copy-deck.md` 對應段落的文字；本檔舉的事實 id 只說明版面放什麼，實際用哪一則照 `copy-deck.md`

## 第四輪要做到什麼

使用者看完第三輪的意見：「目前的設計感覺都不像官方的形象網站，文字都很多，我希望有更加凸出的設計，讓人驚豔的網站設計」。

第四輪的目標：

1. 像品牌形象網站：首頁是 5 個全螢幕段落，每段一句大標題，最多再加一句說明或一則事實。細節留給產品頁與產業頁
2. 有一個訪客離開後還記得的畫面：用 three.js（WebGL）做沉浸式 hero，用 GSAP ScrollTrigger 做捲動敘事
3. 大標題用中文 webfont，字很大，只取頁面用到的字
4. 兩個方向，亮暗、場景、敘事方式、字體都不同，每個做深

5 段的內容固定（使用者決定）：

| 段 | 內容 | 讀者在這段判斷 |
|---|---|---|
| 1 | Hero 品牌主張 | 這家公司做什麼、給誰 |
| 2 | 產業：金融、政府入口 | 是不是為我的產業做 |
| 3 | AI 成果三則 | 做得到嗎 |
| 4 | 產品平台：產品家族加 OrientAI | 用什麼做 |
| 5 | 信任與聯絡 | 找這家安不安心、下一步 |

### 上一輪的教訓

第三輪三個方向（gateway-console 4.0、system-map 4.2、layer-fields 4.2）rubric 都過門檻，使用者仍覺得像產品說明頁。原因與本輪的對策：

| 第三輪的做法 | 結果 | 第四輪的對策 |
|---|---|---|
| 8 段照 brief，每段有引言、項目與事實原文 | 一頁約 1,000 字，讀起來像產品型錄 | 5 段，每段畫面上只有一句大標題加一句話 |
| 影像是介面片段與架構圖，尺寸比照內文 | 正確但不搶眼，沒有一個畫面記得住 | 一個全螢幕的 3D 場景貫穿全頁，用場景的變化說故事，介面片段不再當主角 |
| 字級最大 96px，中文用系統字 | system-map 的 h2 和段內項目同大（D3 只得 3 分），系統字撐不起品牌感 | 大標題用中文 webfont，1280 寬 112–128px，每段只有一個大字，段內沒有第二層標題 |
| 不用漸層、光暈、動態只做進場 | 克制但平淡 | 光與漸層有條件地放寬，只用在「資料與 AI 的流動」上（見各方向的「色彩與光」） |
| 接點畫成細線（system-map 的 `.wires`，D2 扣分） | 細線在大畫面上看不見 | 接點是 3D 場景裡有體積的東西：光的脈衝（`t-gateway`）或緞帶（`ribbon-route`） |

保留第三輪做對的事：第一屏只靠文字就說得出替誰做什麼（system-map D1 5 分）；既有系統用中性色、昕力用紫、接點用橘、AI 用品紅的對應；事實照原文、數字直接寫在 HTML。

## 兩個方向一覽

| id | 一句話 | 驚豔點 |
|---|---|---|
| `t-gateway` | 昕力 logo 的 T 是一道閘門：深色空間裡，既有系統的資料從下方流進 T，經過它接到新的服務與 AI，捲動時鏡頭穿過這道閘門 | 第一屏一座發著紫色邊光的巨大 T 站在灰色系統群上，橘色與品紅的光脈衝從系統流進 T；往下捲，鏡頭俯衝穿過 T 的柱身，最後一段所有零件收攏成 logo 本身 |
| `ribbon-route` | 白色的系統地圖上，一條品牌色的緞帶從既有系統出發，彎過每一段，把它們接上新的服務 | 第一屏載入時，紫到品紅到橘的緞帶從灰白方塊之間畫出來；往下捲，鏡頭升到正上方，再沿著緞帶走到三則 AI 成果，緞帶最後穿出地圖，停在「聯絡業務」 |

### 參考的網站

2026-11-01 查看。這個 session 只連得到部分網域：stripe.com、anthropic.com、oxide.computer 用 Playwright（Chromium，1280 與 375 寬）截圖目視，截圖只在查看時用，沒有存進 repo。apple.com、linear.app、vercel.com、cloudflare.com、nvidia.com 在這個 session 連不上（WebFetch 回 DNS 解析失敗，curl 回 proxy 403），標「未查看」，下表不寫它們的畫面。

| 網站 | 查看結果 | 給哪個方向 | 借鏡什麼 | 不借鏡什麼 |
|---|---|---|---|---|
| https://oxide.computer/ | 已查看 | `t-gateway` | 深色底（近黑），第一屏右半是自家機櫃的寫實渲染，左下是兩行很大的細字 h1「On-prem that feels like the public cloud」；物件就是產品本身，不是抽象科技圖。往下每段一句大字標題，標題下才是小字 | 等寬字的圖號與標籤（「FIG. 1」）、細線連接、綠色終端機配色（house rules：no monospace、no thin rules） |
| https://www.anthropic.com/ | 已查看 | `ribbon-route` | 淺色紙面底，第一屏只有一段很大的字：前半句粗的無襯線，後半句襯線，下方一大塊淺色面板裡放一張插圖。字是主角，影像只有一張、放在面板中 | 膠囊形的導覽按鈕（house rule：no pill nav）、主張後面接一長段說明 |
| https://stripe.com/ | 部分查看：CSS 與圖片從 CDN 載不到，截圖只有未套樣式的 HTML | `ribbon-route` | 只確認了 HTML：h1 是一句「Financial infrastructure to grow your revenue.」加說明，頁面有 `<canvas>` 元素，CSS class 名稱裡有大量 `gradient`。動態漸層的實際畫面沒看到，本方向的漸層不照它的樣子做，只借「品牌漸層承擔品牌記憶」這個想法 | 看不到的部分不借 |
| Apple 產品頁（例如 https://www.apple.com/macbook-pro/） | 未查看 | `ribbon-route` | 本檔只借一般公認的做法：亮底、一個產品物件、捲動時鏡頭繞物件移動，每一屏一句大字。實際畫面待能連線時補看 | — |
| https://linear.app/、https://vercel.com/ | 未查看 | `t-gateway` | 只借一般公認的類型：暗底、光只出現在物件邊緣與流動的東西上。實際畫面待能連線時補看 | — |
| https://www.nvidia.com/、https://www.cloudflare.com/ | 未查看 | — | 不引用 | — |

要補看 apple.com、linear.app、vercel.com 時，需要在 session 的網路設定放行這些網域（見「待人決定」第 6 項）。

## 兩個方向共用的規則

### 色彩的意思全頁固定

沿用第三輪的對應，兩個方向一樣，只換底色與比例。品牌色完整使用。

| 代表 | 顏色 | 用在 |
|---|---|---|
| 既有系統（核心系統、大型主機、WAF 這類事實裡出現的系統） | 中性色 `--ink-*` | 3D 場景裡的方塊、平板 |
| 昕力（logo 的 T、產品、主要動作「聯絡業務」） | 紫 `--purple-*` | T 本體、緞帶起點、按鈕 |
| API 與資料的流動 | 橘 `--orange-*` | 光脈衝、緞帶終點、接上的服務 |
| AI 的流動與 AI 產品（AI 成果、OrientAI） | 品紅 `--magenta-*` | AI 路徑、第 3 段的標記 |

對比值用 WCAG 2.x 相對亮度公式從 `src/styles/tokens.css` 的色碼算出（本檔撰寫時以 node 計算），各方向的表列出實際用的組合，原型不另加組合；要加先算。

### 每段的文字量

- 每段畫面上只有：一句大標題（h1 或 h2）、最多一句說明或一則事實、需要時一個動作或連結。照 `copy-deck.md`
- 事實照原文，帶條件，全頁每則只出現一次。數字直接寫在 HTML，不做跳數字
- 第 3 段的三則成果、第 4 段的產品家族，是一段裡唯一允許的多個項目。項目一次只顯示一則（場景依序換），或排成一列小字索引，不排成同大小的卡片格
- 段內沒有第二層標題：大標題是全段唯一的大字（第三輪 D3 的教訓）

### 第一屏與無障礙

- h1、說明句、「聯絡業務」按鈕在 HTML 裡，第一個 frame 就畫出來，不等 WebGL、不等字型（taste-skill motion 規則 1；P1）
- 文字下方的場景區域在構圖時就留空，不靠加深遮罩硬撐；窄螢幕文字與場景重疊時，文字下墊平塗底色（不是漸層、不是玻璃）
- 每個 pin 的段落都有真正的標題（h2）與 `aria-label`；鍵盤、捲軸照常運作，不攔截滾輪（`references/scenes.md` §7 第 3 條）
- 不用 preloader、計數器、自訂游標、打字機與亂碼效果

### 減少動態、沒有 WebGL、script 失敗時

三種情況都顯示同一個「靜態版」，靜態版是設計過的完成畫面，不是殘缺版：

- 每段放一張 `<img>`：從同一個 3D 場景在該段的停止點渲染出來的靜態圖（WebP，放 `assets/`），有 `width`、`height`、`alt`
- 文字全部在 HTML，排版照桌機與手機各自的靜態版面
- `concept-shots.mjs` 以 `prefers-reduced-motion: reduce` 截圖（`scripts/strategy/concept-shots.mjs` 第 1 點），reviewer 主要看的就是這個靜態版。靜態圖要渲染得跟動態版的最佳畫面一樣好
- 靜態圖是 `<img>`，taste-skill inspector 會算成圖片（`lib/probe.mjs` 的 `realPictures`），5 段各一張就滿足 `few-pictures` 的 4 張下限；`<canvas>` 不算圖片

### 字體的載入

- 中文大標題的 webfont 只放頁面大標題用到的字。內文的中文用系統字（PingFang TC、Microsoft JhengHei、Noto Sans TC），不載字檔
- 做法見「交給建原型的 agent」第 3 項
- `font-display: swap`。另宣告一個 `size-adjust` 過的 fallback `@font-face`（local 系統字），讓換字時的版面位移變小
- 兩個方向的字體家族都控制在兩種以內（中文標題字＋拉丁字），系統字不算

## 方向一：`t-gateway`

### 概念

一句話：昕力 logo 的 T 是一道閘門。深色空間裡，既有系統的資料從下方流進 T，經過它接到新的服務與 AI；捲動時鏡頭穿過這道閘門。

驚豔點：

- 第一眼：畫面右側一座巨大的立體 T，紫黑色本體、邊緣一圈紫光，站在一片灰色的系統方塊上。橘色的光脈衝從方塊沿著 T 的柱身往上流，在橫樑分岔流向右邊的新服務；品紅的脈衝走 T 右端那道往上掃的弧線（logo 本來就有的曲線），流向一塊 AI 模型
- 捲動時：鏡頭俯衝、穿過 T 的柱身，出來後路徑分成金融與政府兩條；之後 T 拆成產品家族的模組；最後所有零件收攏成 logo 的符號（紫色的 T、灰色的橢圓與方塊），停在聯絡段

像哪一類網站：Oxide 的「暗底＋自家物件的寫實渲染＋大字」（已查看），Linear、Vercel 一類「光只出現在物件邊緣與流動的東西上」的暗色光影（未查看，只借類型）。

為什麼用 T：P3 要求畫「接進既有系統」，不畫泛科技物件。T 的形狀本身就是「一根柱子接住下方、一根橫樑分給兩邊」，跟閘道的路由是同一個形狀；用 logo 的形狀當閘門，物件換掉 logo 就不成立，解決 P1「不容易和 SYSTEX 的發光方塊分辨」的問題。

### 5 段的畫面

全頁只有一個 WebGL canvas（`position: fixed`，在內容之下），三個 scene 都是同一個 3D 世界的不同鏡頭。中間的第 3 段是安靜段，canvas 暫停並淡出。

| 段 | 1280 寬的畫面 | 捲動時發生什麼（GSAP ScrollTrigger） | 375 寬 |
|---|---|---|---|
| 1 Hero | 左 5 欄：h1（兩行）、說明句、「聯絡業務」按鈕、「依產業看方案」文字連結，下方是平的暗底。右 7 欄：立體 T 從左下仰角 20° 看過去，佔畫面高度約 75%。T 的形狀用 `src/assets/brand/logo-symbol-color.svg` 紫色那條 path，以 `SVGLoader` 讀進來、`ExtrudeGeometry` 擠出深度，小斜角（bevel），保留 logo 的斜切與圓角。T 下方是 4×4 的灰色平板（既有系統），其中 2–3 塊旁有 HTML 標籤（系統名稱用事實裡出現過的詞，例如核心系統、大型主機）。T 右側是 3 片淺灰半透明的薄板（新的服務），橫樑右端那道弧線通往一塊品紅的方塊（AI 模型）。橘色脈衝（短膠囊，`InstancedMesh`）一直沿柱身往上流 | Scene 1，pin 2 個螢幕高（第 1、2 段共用），scrub 鎖在捲軸上、線性。0–0.15：h1 等文字往上移出（`--ease-exit`，文字讀完才動）。0.15–0.5：鏡頭從仰角往下、往前推，穿進 T 的柱身，脈衝從鏡頭兩側擦過。0.5–0.6：鏡頭從柱身另一端出來，接第 2 段 | 不做穿越。T 改成正面、放在第一屏上半（高度約 40svh），文字在下半，壓在平塗的 `--ink-950` 上。脈衝數量減半，`devicePixelRatio` 上限 1.5，不開 bloom。捲動時只讓鏡頭往上仰 10°（scrub），再淡出到第 2 段 |
| 2 產業 | 鏡頭出了柱身後，路徑分成兩條：左邊一條紫色邊光的通道通往標著「金融」的系統群，右邊通往「政府」。畫面中央是第 2 段的大標題，兩條通道的終點各有一行 HTML：產業名、一則事實（例如 `fact:digirunner-open-banking-fsc`、`fact:digirunner-ndc-spec`，以 `copy-deck.md` 為準）與產業頁連結 | Scene 1 的後段。0.6–0.75：兩條通道從中間向左右長出來，脈衝分流。0.75–1.0：停住，文字可讀（至少 0.25 螢幕不動）。離開 pin 時 canvas 淡到 0.3 透明度 | 兩個產業上下排，每個一塊全寬的平塗區（`--ink-900`），左邊一條 4px 寬的紫或灰色帶表示通道（不是細線，是色帶）。場景停在 rest（`phone: 'rest'`），不 pin |
| 3 AI 成果 | 安靜段，canvas 暫停（`IntersectionObserver`）並隱藏。底色換成平塗 `--ink-900`。左邊是大標題，右邊三列成果，每列：案例名稱（小字）、成果原文（lead 字級，例如 `fact:smartclaim-result`）、連結。每列左側一個品紅方塊標「AI」 | 不 pin。標題用 masked line reveal（逐行從基線升起，800ms，`--ease-expo`）；三列依序上移淡入，間隔 90ms，各一次 | 同一個版面改單欄，三列上下排，不變 |
| 4 產品平台 | T 回到畫面中央，柱身拆成 4 段垂直模組，依序排開（DigiLism、SysTalk.ai、ESGswift、GadoSecurity，名稱照 `copy-deck.md`），每段模組的本體顏色跟 T 一樣，亮起時邊光變亮。模組下方仍是灰色系統平板，橘色脈衝從平板流進亮起的模組。最後一個畫面：品紅的 AI 模組被 4 面從地板升起的牆圍住，牆上寫「企業端」，對應 OrientAI 的事實（例如 `fact:orientai-on-prem-data`） | Scene 2，pin 3 個螢幕高。0–0.2：T 從遠處拉近、柱身裂成 4 段（`references/scenes.md` 的 scene 數值內，可以大幅位移）。0.2–0.7：一次亮一個模組，畫面左下顯示該家族的一句話與產品家族頁連結，旁邊一行一般字「第 2 個，共 4 個」（不用 01／04）。0.7–1.0：牆升起圍住 AI 模組，大標題換成 OrientAI 那一句與事實 | 不 pin。4 個家族改成橫向可拖曳的列（`scroll-snap`），每張是該模組的靜態圖加一句話。OrientAI 的牆用一張靜態圖加事實，接在列後面 |
| 5 信任與聯絡 | 所有零件收攏：T 回到原形，灰色系統平板合成 logo 右下的灰色方塊，AI 模組變成 logo 的灰色橢圓，三者排成 logo 符號，放在畫面右側，光脈衝停止。左側是第 5 段的大標題、一則事實（例如 `fact:company-founded`，以 `copy-deck.md` 為準）、「聯絡業務」與「預約 demo」。往下是平塗 `--purple-900` 的頁尾 | Scene 3，pin 1 個螢幕高。0–0.6：零件收攏（`--ease-in-out` 的感覺，但 scrub 是線性的，用位置曲線表現）。0.6–1.0：停住，文字可讀 | logo 符號放在文字上方（高度約 30svh），不 pin，進入畫面時播一次收攏（1.2s），減少動態時直接是完成狀態 |

Scene 數量：3 個，pin 共 6 個螢幕高（2＋3＋1），加上第 3 段與頁尾，全頁約 9 個螢幕，scene 佔約 67%，會觸發 inspector 的 `scene-heavy`（scene 超過頁面 60%）。這是本方向刻意的取捨：整頁就是一個世界。若 reviewer 看起來太長，先把 scene 2 縮成 2 個螢幕。

### 字體

| 用途 | 字體 | 字重 | 1280 寬 | 375 寬 |
|---|---|---|---|---|
| 中文大標題（h1、各段 h2） | Noto Sans TC（`@fontsource/noto-sans-tc`，OFL-1.1） | 900（Black） | h1 `clamp(2.5rem, 1rem + 8.4vw, 8rem)`，1280 寬約 120px；h2 與 h1 同級或 96px | h1 40–42px（`copy-deck.md` 的換行計算：343px 可用寬、每行 8 字） |
| 拉丁字（標題裡的 API、AI、產品名；內文的拉丁字） | Inter Tight Variable（`@fontsource-variable/inter-tight`，OFL-1.1，latin subset） | 標題 800，內文 400 | 同上 | 同上 |
| 內文中文 | 系統字 | 400 | 18px | 17px |

- 字距：大標題 -0.02em，行高 1.0
- 全頁字級：display（h1／h2）、lead（成果原文與說明句，24px）、body（18px）、small（14px）。四種
- 選 Black 的理由：暗底上的大字要有重量才壓得住發光的 3D 物件；細字在暗底上會被光吃掉（P1：文字比物件先被讀到）

### 色彩與光

| 元素 | 色彩 | 對比 |
|---|---|---|
| 底色 | `--ink-950` #0a0812，平塗 | — |
| 大標題、內文 | `--ink-0` #ffffff | 19.88:1 |
| 次要文字 | `--ink-300` #b9b5cc | 9.98:1 |
| 「聯絡業務」按鈕 | `--purple-700` 底、白字 | 8.97:1 |
| 文字連結 | `--purple-300` #bf9de8 | 8.71:1 |
| 橘色標記（API 流動） | `--orange-500` #ff6329 | 6.69:1（圖形 3:1 以上） |
| 品紅標記（AI） | `--magenta-400` #d55ae9 | 6.12:1 |
| 第 3 段底色 | `--ink-900`，白字 18.89:1 | — |
| 頁尾 | `--purple-900` 底、白字 14.84:1 | — |

光的規則：

- 發光只出現在兩種東西上：T 的邊緣（紫，表示「這是昕力」）與流動的脈衝（橘、品紅，表示資料與 AI）。灰色的既有系統不發光、不反光，用平光
- 用 `UnrealBloomPass` 只對脈衝與 T 的邊光加光暈（selective bloom：場景分兩層 render，或把非發光物件的 emissive 設 0、門檻調高），強度低。文字、按鈕、HTML 元素一律沒有光暈與陰影
- 沒有 CSS 漸層。3D 裡光的衰減與霧（`FogExp2`，往 `--ink-950` 收）是光照的結果，不是裝飾漸層
- 脈衝只沿著路徑走，不做漂浮的粒子背景（P3、taste-skill scenes 規則 7「no decorative particles」）

### 對應原則與刻意放寬的地方

| 決定 | 對應 |
|---|---|
| 用 logo 的 T 當閘門，下方是灰色的既有系統，脈衝從系統流進 T 再分出去 | P3：畫的是接進既有系統，既有系統一直在畫面裡 |
| h1、說明句、按鈕在左欄、HTML 裡、第一個 frame 就有；T 在右欄 | P1 |
| 灰／紫／橘／品紅的對應全頁固定 | P4「每種顏色只代表一件事」 |
| 第 2 段兩條通道分流到金融、政府 | P5：第二個判斷「是不是為我做」 |
| 數字照原文、直接在 HTML | P2 |
| 放寬 P4「克制」與 house rules 的 no glow：T 邊光與脈衝有光暈，脈衝是常駐的循環動畫 | 理由：使用者要沉浸、驚豔。光仍然只標示資料與狀態（P4 原本的意思），循環只有一組，畫面外與分頁隱藏時暫停，減少動態時停止 |
| 放寬 P5 的 8 段、P2 的「紀錄格式」：每段只留一則事實 | 使用者 2026-11-01 決定 5 段精簡版；細節移到產品、產業頁 |
| 放寬 taste-skill 的 scene 長度（`scene-heavy`） | 理由見上方「Scene 數量」 |
| 放寬 ADR 0003 第 8 點「chapter 文字放在玻璃面板」 | 不用玻璃，改成構圖留空加平塗底，比原規則更嚴 |

### 效能與降級

| 情況 | 顯示什麼 |
|---|---|
| 一般桌機 | WebGL 場景＋3 個 scene |
| 手機（`(width < 64rem), (pointer: coarse)`） | 手機 tier：脈衝減半、DPR 上限 1.5、不開 bloom、不穿越；scene 照上表的 375 欄 |
| `prefers-reduced-motion: reduce`、不支援 WebGL 2、`saveData` | 不載 three.js 與 GSAP。每段一張靜態圖：第 1 段是 hero 的 T（仰角構圖、脈衝停在路徑上、光暈烘進圖裡），第 2 段是分流的兩條通道，第 4 段是 4 個模組加圍牆的組合圖，第 5 段是 logo 符號。第 3 段本來就沒有場景。文字照完成狀態排列 |
| script 失敗 | 同上（`html.js` class 沒加上時，CSS 顯示靜態版） |

JS 大小預估（gzip）：

| 項目 | 大小 | 來源 |
|---|---|---|
| three.js（tree-shaken）＋場景 runtime | 約 130 KB | ADR 0003「背景」的實測（`runtime.*.js`） |
| `SVGLoader`、`EffectComposer`、`UnrealBloomPass` | 約 15–25 KB | 估計，待原型實測 |
| GSAP 3.15.0 core | 28.3 KB | `npm pack gsap@3.15.0`，`gzip -9` 量 `dist/gsap.min.js` |
| ScrollTrigger | 18.0 KB | 同上，`dist/ScrollTrigger.min.js` |
| 本方向的場景程式 | 約 5–10 KB | 估計 |
| 合計 | 約 195–210 KB | 現有預算：初始 6 KB、延後載入 140 KB（`docs/design/motion.md`），延後載入超出約 55–70 KB |

字型：Noto Sans TC Black 只含大標題用到的字，預估 20–40 KB（取字工具可用時）；Inter Tight latin 約 20–30 KB。

Lighthouse 的代價（預估，原型 README 要寫實測或寫明未測）：three.js 照 ADR 0003 在 LCP 之後才載入時，LCP 是 h1 文字，不受影響；主要代價是 TBT（shader 編譯、bloom 的兩次 render），ADR 0003 的 Modular Stack 行動版 TBT 93 ms，本方向多了 bloom 與 SVG 擠出，行動版 TBT 預估更高，performance 可能低於 0.95。固定在背後的 canvas 每個 frame 都在畫，捲動時的 GPU 負擔比現行 hero 大。

## 方向二：`ribbon-route`

### 概念

一句話：白色的系統地圖上，一條品牌色的緞帶從既有系統出發，彎過每一段，把它們接上新的服務。

驚豔點：

- 第一眼：白底、上方一句很大的襯線中文。下半是一片低角度看過去的灰白方塊（既有系統，高低不一，像機房也像城市），一條寬緞帶在方塊之間彎過去，顏色從起點的紫、經過品紅、到終點的橘，終點接上幾塊頂面塗橘的方塊（新的服務）。載入時緞帶從起點畫到終點
- 捲動時：鏡頭升到正上方，地圖變成平面圖；第 3 段鏡頭沿著緞帶的品紅那一段走，停在三個亮起的方塊（三則 AI 成果）；最後一段，緞帶穿出地圖，以一條平塗的橘色帶進入整片紫色的聯絡段，終點就是「聯絡業務」按鈕

像哪一類網站：Apple 產品頁「亮底、一個物件、捲動時鏡頭繞著它走、每屏一句大字」（未查看，只借類型）；Anthropic 首頁「淺色紙面、字是主角、一張影像放在大面板裡」（已查看）；Stripe 首頁以品牌漸層當記憶點的做法（只看到 HTML，畫面未查看）。

為什麼用緞帶：P3 的「接上」要有體積才看得見（第三輪細線被扣分）。緞帶是一條連續、有寬度、有方向的東西，兩端是既有系統與新的服務；緞帶的末端切成 logo 的斜切角，轉彎處的弧度取 logo 的那道掃弧，讓它是昕力的緞帶，不是一般的光流。

### 5 段的畫面

WebGL 只用在第 1 段與第 3 段（兩個 scene），中間的第 2、4 段是安靜段，第 5 段是 CSS 的整片色塊。手機完全不載 WebGL（見 375 欄）。

| 段 | 1280 寬的畫面 | 捲動時發生什麼 | 375 寬 |
|---|---|---|---|
| 1 Hero | 上 45%：白底，h1 靠左（兩行），右下是說明句、「聯絡業務」按鈕與「依產業看方案」連結。下 55%：3D 地圖，正交相機（`OrthographicCamera`）約 30° 俯角。方塊是霧面的白與淺灰（`--ink-50`～`--ink-200`），柔和的環境光遮蔽（AO）讓方塊有體積。緞帶是一條平的帶狀 mesh（沿 `CatmullRomCurve3` 擠出的扁平截面），寬約方塊邊長的 0.3，顏色沿長度從 `--purple-500` 經 `--magenta-500` 到 `--orange-500`，起點貼著一塊標「核心系統」的深灰方塊（HTML 標籤），終點接到頂面塗 `--orange-500` 的方塊群 | 載入時（不等捲動）：緞帶從起點畫到終點，1.2 秒內完成（taste-skill motion 規則 1），h1 不動。Scene 1，pin 1 個螢幕高，scrub 線性：鏡頭從 30° 俯角升到 90°（正上方），h1 往上移出，地圖變成平面圖，緞帶在平面上看得出分岔成兩支，接第 2 段 | 不載 WebGL。第一屏上半是 h1、說明句與按鈕，下半是一張 hero 的靜態圖（同一個場景渲染的直式構圖，WebP）。整頁左邊距放一條 12px 寬的 SVG 緞帶（同樣的紫→品紅→橘），從 hero 往下一路連到第 5 段，捲動時用 `stroke-dashoffset` 畫出（scrub）。這條緞帶是手機版的主角 |
| 2 產業 | 安靜段，canvas 停在平面圖並淡出。白底分左右兩半，各一個超大的襯線字「金融」「政府」（產業名本身就是畫面，字級與 h1 同級），下面各一則事實與產業頁連結。中間一條平塗的紫色緞帶段從上方進來、在兩半之間分岔（SVG，`clip-path` 動畫） | 不 pin。緞帶分岔用 CSS scroll-driven animation（`animation-timeline: view()`，不支援時直接是完成狀態）。兩個大字用 masked line reveal 各一次 | 上下排，「金融」「政府」各一屏的上半，大字 72px；左邊的 SVG 緞帶在這裡分出一支短岔再合回 |
| 3 AI 成果 | Scene 2，回到 WebGL。鏡頭降到 45° 俯角，沿緞帶品紅的那一段往前走，經過三個方塊，方塊依序亮起品紅的頂面。每到一個方塊，畫面右側一塊平塗白底的說明板（無陰影、無框）顯示：案例名稱、成果原文（lead 字級）、連結；左上是本段的大標題，整段不換 | pin 3 個螢幕高（一則一屏），scrub 線性。說明板一次一塊，舊的往上退出（`--ease-exit`），新的從下方進來；每塊在畫面中央停至少 0.3 螢幕。說明板旁一行一般字「第 1 則，共 3 則」 | 三則改成三張靜態圖（同場景的三個停止點）各配說明，上下排，不 pin。左邊的 SVG 緞帶在這段變成品紅 |
| 4 產品平台 | 安靜段，白底。上半是大標題。下半是 5 列的大字索引：4 個產品家族加 OrientAI（OrientAI 那列字是品紅），每列一句「解決什麼問題」。滑鼠移到或 focus 到某一列，該列右側出現該家族在地圖上那一區的靜態圖（預先渲染的 WebP，不是即時 WebGL）。最後 OrientAI 那列之後，一塊整片 `--purple-900` 的面板從下方蓋上來（sheet over a held picture），裡面是 OrientAI 那一句與事實 | 不 pin。索引用 taste-skill motion「Index with preview, anchored to the row」。紫色面板是純 CSS 的 sticky 疊層，不用 script | 5 列改成手風琴，點開才顯示該列的圖與連結；紫色面板照常蓋上來 |
| 5 信任與聯絡 | 整片 `--purple-700` 的色塊（colour by chapter，邊緣硬切，header 的字色在 300ms 內變白）。超大的襯線大標題，一則事實，「聯絡業務」（白底紫字）與「預約 demo」。一條平塗的橘色帶（緞帶的終點色，SVG）從左側邊緣進來，停在「聯絡業務」按鈕左邊，末端是 logo 的斜切角 | 不 pin。橘色帶進入畫面時畫一次（800ms），減少動態時直接是完成狀態。頁尾用 curtain footer（`position: sticky; bottom: 0`） | 同一個版面改單欄；左邊那條 SVG 緞帶在這裡轉成橘色，接到按鈕 |

Scene 數量：2 個（第 1 段 1 個螢幕、第 3 段 3 個螢幕），中間隔著安靜段，符合 `references/scenes.md` §7 第 1 條。

### 字體

| 用途 | 字體 | 字重 | 1280 寬 | 375 寬 |
|---|---|---|---|---|
| 中文大標題（h1、各段 h2、第 2 段的產業名） | Noto Serif TC（`@fontsource/noto-serif-tc`，OFL-1.1） | 700 | h1 `clamp(2.5rem, 1rem + 7.5vw, 7rem)`，1280 寬約 112px；第 2 段產業名同級 | h1 40px，產業名 72px（只有兩個字） |
| 拉丁字（標題裡的 API、AI、產品名；內文） | Inter Variable（`node_modules/@fontsource-variable/inter`，已在專案裡，OFL-1.1，latin subset） | 標題 600，內文 400 | — | — |
| 內文中文 | 系統字 | 400 | 18px | 17px |

- 字距：大標題 0（襯線中文不壓字距），行高 1.1
- 全頁字級：display、lead（24px）、body（18px）、small（14px）。四種
- 選襯線的理由：白底、大字、少字的版面裡，襯線中文本身就是視覺，跟「官方形象」的正式感一致（使用者的意見），也跟 `t-gateway` 的 Black 無襯線分得最開。拉丁字沿用 Inter，跟現行網站的字一致
- 標題裡的拉丁字（API、AI、OrientAI）用 Noto Serif TC 自帶的拉丁字形，跟中文同一個字體，不混 Inter，避免 inspector 的 `mixed-font-headline`

### 色彩與光

| 元素 | 色彩 | 對比 |
|---|---|---|
| 底色 | `--ink-0` #ffffff；第 3 段的場景底 `--ink-50` #f6f5fa | — |
| 大標題、內文 | `--ink-900` #120f1d | 18.89:1（白底）、17.41:1（`--ink-50`） |
| 次要文字 | `--ink-600` #534e69 | 7.89:1 |
| 「聯絡業務」按鈕 | `--purple-700` 底、白字；第 5 段反過來，白底紫字 | 8.97:1 |
| 文字連結 | `--purple-700` | 8.97:1 |
| AI 標記、OrientAI 那列的字 | `--magenta-500` #b824d1 | 4.99:1（大字與 18px 以上可用；14px 小字不用品紅） |
| 橘色文字（少用） | `--orange-700` #b83a0b | 5.76:1。`--orange-500` 只當圖形與緞帶，不當白底上的字 |
| 第 4 段 OrientAI 面板 | `--purple-900` 底、白字 | 14.84:1 |
| 第 5 段 | `--purple-700` 底、白字 | 8.97:1 |

光與漸層的規則：

- 漸層只出現在緞帶上：紫→品紅→橘沿著緞帶的長度走，表示「從昕力出發、經過 AI、接到新的服務」的方向。這就是 `tokens.css` 已有的 `--gradient-energy`（紫 500、品紅 500、橘 500）的三個色，不另訂顏色。文字從不放在漸層上，大標題不做漸層字
- 3D 場景用柔和的方向光加環境光遮蔽，方塊有自然的明暗。這是 3D 光照，不是 CSS 陰影；HTML 元素一律沒有陰影
- 沒有光暈、沒有 bloom，亮底上不需要。和 `t-gateway` 的發光對比
- 不用玻璃：第 3 段的說明板是平塗白底

### 對應原則與刻意放寬的地方

| 決定 | 對應 |
|---|---|
| 緞帶從深灰的「核心系統」出發，終點接到橘色的新服務，既有系統的方塊一直在畫面裡 | P3 |
| h1 在白底上、在場景之上的空白區，第一個 frame 就有；載入動畫只畫緞帶 | P1 |
| 第 2 段用產業名當大字 | P1、P5（產業入口在第二屏就出現） |
| 第 3 段一次一則成果，原文照引 | P2 |
| 灰／紫／橘／品紅的對應全頁固定；緞帶的漸層順序就是這個對應 | P4 |
| 兩個 scene 之間有安靜段，第 5 段用整片色塊收尾 | P5 的節奏 |
| 放寬 house rules 的 no gradients：緞帶用品牌漸層 | 理由：漸層在這裡是資訊（流動的方向），不是背景裝飾；使用者要品牌感，三個品牌色同時出現在一條東西上最容易被記住。限制：只在緞帶上，不在底色、按鈕、文字上 |
| 放寬 P4 的「循環動畫只放一處」 | 本方向其實沒有循環：緞帶畫一次，之後只隨捲動移動，沒有放寬 |
| 放寬 P5 的 8 段、P2 的「紀錄格式」 | 同 `t-gateway` |
| 放寬設計系統「影像只用抽象 3D 渲染，不放文字」 | 3D 地圖上有 HTML 標籤（系統名稱），標籤在 HTML 層，不畫進圖裡 |

### 效能與降級

| 情況 | 顯示什麼 |
|---|---|
| 一般桌機 | WebGL 只在第 1、3 段建立；第 3 段離開畫面後停止 render |
| 手機（`(width < 64rem), (pointer: coarse)`） | 不載 three.js。hero 與第 3 段用靜態圖，左邊距的 SVG 緞帶隨捲動畫出（GSAP ScrollTrigger scrub，或 CSS scroll-driven animation 支援時不用 GSAP） |
| `prefers-reduced-motion: reduce`、不支援 WebGL 2、`saveData` | 不載 three.js 與 GSAP。第 1 段是 hero 地圖的靜態圖（30° 俯角、緞帶完整），第 2 段是分岔完成的 SVG，第 3 段是三張停止點的靜態圖上下排，第 4 段的索引全部展開、每列帶圖，第 5 段的橘色帶完整。左邊的 SVG 緞帶（手機）直接畫完 |
| script 失敗 | 同上 |

JS 大小預估（gzip）：

| 項目 | 桌機 | 手機 | 來源 |
|---|---|---|---|
| three.js（tree-shaken）＋場景 runtime | 約 130 KB | 0 | ADR 0003「背景」的實測 |
| GSAP core＋ScrollTrigger | 46.3 KB | 46.3 KB（或 0，用 CSS scroll-driven） | `npm pack gsap@3.15.0` 實量 |
| 本方向的場景程式 | 約 5–8 KB | 約 2 KB | 估計 |
| 合計 | 約 180–185 KB | 約 0–50 KB | 延後載入預算 140 KB：桌機超出約 40–45 KB，手機在預算內 |

字型：Noto Serif TC 700 只含大標題用到的字，預估 25–50 KB（襯線字形較複雜，比黑體大）；Inter 沿用。

Lighthouse 的代價（預估）：Lighthouse 預設量行動版，本方向手機不載 three.js，行動版的代價主要是中文字型與 hero 靜態圖（LCP 可能是 hero 靜態圖或 h1，視哪個大）；桌機有 three.js，照 ADR 0003 延後載入時 LCP 不受影響，TBT 會增加。整體比 `t-gateway` 輕。

## 兩個方向的差異

| 面向 | `t-gateway` | `ribbon-route` |
|---|---|---|
| 亮暗 | 暗：`--ink-950` 為主，第 3 段 `--ink-900`，頁尾 `--purple-900` | 亮：白與 `--ink-50` 為主，第 4 段末的面板 `--purple-900`，第 5 段整片 `--purple-700` |
| 場景主體 | 一個物件：用 logo 擠出的立體 T，站在灰色系統平板上 | 一片地景：灰白方塊的系統地圖，加一條品牌色緞帶 |
| 接點怎麼畫 | 發光的脈衝沿 T 流動，有 bloom | 有寬度的緞帶，品牌漸層，沒有光暈 |
| 相機 | 透視相機，鏡頭穿過物件（fly-through），深度感強 | 正交相機，鏡頭升降、沿路徑平移，像在看一張地圖 |
| 捲動敘事 | 一個連續的世界：3 個 scene 共用一個固定 canvas，鏡頭一路往前，最後零件收攏成 logo | 章節式：2 個 scene 夾著安靜段，第 5 段用整片色塊收尾，緞帶從頭串到尾 |
| 手機 | 保留 WebGL（降級 tier） | 不載 WebGL，改成靜態圖加左邊距的 SVG 緞帶 |
| 中文標題字 | Noto Sans TC 900（Black），字距 -0.02em | Noto Serif TC 700，字距 0 |
| 拉丁字 | Inter Tight | Inter（標題用 Noto Serif TC 自帶的拉丁字） |
| signature move | 鏡頭穿過 T 的柱身 | 載入時緞帶從系統畫到新服務 |
| 放寬的 house rule | glow（只在 T 邊光與脈衝） | gradient（只在緞帶） |
| JS（gzip，桌機） | 約 195–210 KB | 約 180–185 KB（手機約 0–50 KB） |
| 參考 | Oxide（已查看）；Linear、Vercel 類型（未查看） | Anthropic（已查看）；Apple 產品頁類型（未查看）；Stripe（只看到 HTML） |

兩個方向在版面結構、字體、影像策略、色彩、動態五項都不同（`design-concept` skill 第 3 節第 2 步要求至少兩項）。

## 交給建原型的 agent

每個方向一個目錄 `docs/strategy/concepts/<id>/`，裡面放 `index.html`、`README.md`、`assets/`（字型、靜態圖、logo、打包好的 JS、授權檔），以及 `concept-shots.mjs` 產生的截圖。不改 `package.json`、`src/`、`scripts/`、`.claude/`。

1. file:// 下的 script：
   - `<script type="module" src="...">` 在 file:// 會被 CORS 擋（module script 要求 CORS，file:// 的 origin 是 null）。不要用
   - three.js 在 `node_modules/three`（0.186.1），只有 ES module build（`build/three.module.js`、`three.core.js`），沒有 UMD。打包成單一 classic script：在 `/tmp/<id>-build/` 寫一支入口檔（`import { ... } from 'three'`、場景程式、GSAP）與 vite config，用 repo 的 `node_modules/.bin/vite build` 的 lib 模式、`formats: ['iife']` 輸出一個 `assets/scene.js`，`index.html` 用一般的 `<script src="assets/scene.js" defer>`。`resolve` 要指到 repo 的 `node_modules`（入口檔在 `/tmp` 時，用 `resolve.alias` 或從 repo 根目錄執行 vite 並把 `root` 設成 `/tmp/<id>-build`）
   - 另一個做法是把打包結果 inline 在 HTML 的 `<script>` 裡；檔案會很大，README 要寫出來
   - GSAP 不在 `node_modules`：`cd /tmp && npm pack gsap@3.15.0`，解開後用 `dist/gsap.min.js`、`dist/ScrollTrigger.min.js`（classic script，可以直接 `<script src>`），或一起進 vite 的 bundle。GSAP 的授權是「Standard no-charge license」，套件裡沒有獨立的 LICENSE 檔，把 `README.md` 的 License 段與連結存成 `assets/LICENSE-gsap.txt`。three.js 附 `node_modules/three/LICENSE`
   - Lenis 不用（兩個方向都不需要平滑捲動，`references/motion.md` 的「native scroll」）
2. 不要用 `<link rel="preload" ... crossorigin>`：file:// 下會出錯，`concept-shots.mjs` 把 console error 算失敗。字型直接用 `@font-face` 的 `src: url(assets/...)`
3. 中文 webfont 只取用到的字：
   - 先從 `index.html` 抽出所有大標題的文字（含標點），去重
   - 首選：`pyftsubset`（fonttools）把 fontsource 的 woff2 切成只含這些字的單一 woff2。這個 session 沒有安裝 fonttools，可在 `/tmp` 建 venv 安裝（`python3 -m venv /tmp/ft && /tmp/ft/bin/pip install fonttools brotli`）；裝不上時用下一個做法
   - 備案：`npm pack @fontsource/noto-sans-tc`（或 `noto-serif-tc`）到 `/tmp`，讀它的 CSS 裡每個 `@font-face` 的 `unicode-range`，只複製含有用到的字的那幾個切片 woff2，`@font-face` 保留各自的 `unicode-range`。切片的總大小可能到數百 KB，README 要寫實際大小
   - `font-display: swap`，另加 `size-adjust` 過的 local fallback。授權檔 `assets/LICENSE-noto.txt`（OFL-1.1，套件裡的 LICENSE）
   - 改了大標題的文字要重新取字；README 寫取字的指令
4. `concept-shots.mjs` 以 `prefers-reduced-motion: reduce` 開 file://、等 `document.fonts.ready` 後截全頁與第一屏，任何非 file:// 的請求、console error、未捕捉的例外都算失敗。所以：
   - 減少動態時不建 WebGL、不 import 場景；每段顯示預先渲染的靜態圖。這是 reviewer 主要看的版本，要做得跟動態版一樣好
   - WebGL 不支援或建立失敗時，用 `console.warn` 或靜默降級，不要 `console.error`
   - 靜態圖用場景本身渲染：寫一支 capture script（放 `/tmp` 或 `.taste-skill/`，不進 repo 的 `scripts/`），用 Playwright 開動態版，捲到每段的停止點，`canvas.toDataURL()` 或截圖存成 WebP 到 `assets/`。WebGL 截圖每次可能不同，`concept-shots.mjs` 跑兩次 hash 不同不算失敗（`.claude/progress/166.md`「技術備註」）
   - 截圖超過 1 MB 會存成 JPEG，正常
5. taste-skill 檢查：
   - `CHROME_PATH=scripts/strategy/chromium.sh node .claude/skills/taste-skill/scripts/inspect.mjs docs/strategy/concepts/<id>/index.html --allow palette-purple`，再跑 `lint.mjs` 與 `scenes.mjs`。工作檔寫在 `.taste-skill/`
   - 預期會出現、可以在 README 寫理由的 FAIL 或 WARN：`t-gateway` 的 glow 相關與 `scene-heavy`；`ribbon-route` 的 `gradient`（只在緞帶的 SVG `linearGradient` 與 shader 上）。其他 FAIL 要修
   - inspector 不開減少動態時會跑 WebGL，headless Chromium 用 SwiftShader 軟體算圖，會慢；`scene-not-live`（scene 在桌機停在 rest）表示 script 沒跑起來，要修
6. `<head>` 要有 `<meta name="robots" content="noindex, nofollow">`、`<title>` 與 meta description 照 `copy-deck.md`
7. 3D 場景程式可以參考 `src/lib/scene/runtime.ts`（相機、tier、暫停）與 `tiers.ts`（手機降級的數值），但不 import `src/`：複製需要的部分到 `/tmp/<id>-build/`
8. `t-gateway` 的 T：讀 `src/assets/brand/logo-symbol-color.svg` 第一條 path（紫色，`fill="rgb(39.99939%, 17.999268%, 55.299377%)"`）。另外兩條灰色 path（右下的方塊、橢圓）是第 5 段收攏時的目標形狀。SVG 的 y 軸朝下，進 three.js 要翻轉
9. README 必寫：主要視覺決定各對到哪條原則、放寬了什麼與代價、JS 實際大小（gzip，`gzip -9c assets/scene.js | wc -c`）、字型實際大小、Lighthouse 是否量過（量過寫指令與分數，沒量寫「未測」與預估的理由）、inspector 結果與保留的 FAIL／WARN 理由

## 待人決定

| # | 事項 | 為什麼要人決定 | 影響 |
|---|---|---|---|
| 1 | `t-gateway` 把 logo 的 T 詮釋成「閘門」，最後一段把灰色方塊與橢圓詮釋成「既有系統」與「AI 模組」。這是本方向的設計詮釋，不是行銷部門的說法；公司沒有 VI 手冊，也沒有 logo 使用規範（`docs/design/brand-assets.md`「Logo」） | logo 被拆開、擠出成 3D、重新組合，品牌主是否接受 | 不接受時，`t-gateway` 改用一個不取自 logo 的閘門形狀，驚豔點的「收攏成 logo」要拿掉 |
| 2 | 中文大標題 webfont：黑體 Black（`t-gateway`）或襯線 700（`ribbon-route`），選定後全站的標題是否都用它 | 字型決定品牌的語氣，`design-system` skill 目前規定不載中文 webfont | 選定後要改 `design-system`、`scripts/design/font-subsets.mjs`，製作階段要做 build 時的取字 |
| 3 | JS 預算：兩個方向的延後載入都超出現行 140 KB（`t-gateway` 約多 55–70 KB，`ribbon-route` 桌機約多 40–45 KB）。是否接受，或要求製作時壓回預算（例如 GSAP 換成 CSS scroll-driven animation、拿掉 bloom） | Lighthouse performance ≥ 0.95 是 `npm run check` 的關卡（ADR 0004） | 選定後要改 `scripts/design/scene-budget.mjs` 的預算或改做法 |
| 4 | 首頁從 brief 的 8 段縮成 5 段：拿掉的服務與導入、穩定度細節放在哪一頁 | brief 是 `strategy-approved` 的產出，使用者已決定首頁精簡，但移出的內容的去處還沒定 | 選定方向後同步 `briefs/home.md` |
| 5 | 放寬的 house rule：`t-gateway` 放寬 glow，`ribbon-route` 放寬 gradient。選定後是否寫回 `design-principles.md` 的 P4 與「原則與現有限制」 | 原則是 `design-approved` 前要定案的文件 | 選定後改原則 |
| 6 | 參考網站有 5 個在這個 session 連不上（apple.com、linear.app、vercel.com、cloudflare.com、nvidia.com），stripe.com 的 CSS 與圖片載不到。要不要放行這些網域補看 | 要在 session 的網路設定放行 | 本檔「參考的網站」補上實際畫面；不放行也不影響原型製作 |
