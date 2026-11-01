# Colour chapters（`colour-chapters`）原型

#166 第 3 階段的首頁原型。發牌結果與 redraw 見 [`sheet.md`](sheet.md)，文字照 [`../copy-deck.md`](../copy-deck.md)，原則見 [`../../design-principles.md`](../../design-principles.md)。

打開方式：直接用瀏覽器開 `index.html`（`file://`，不連外部網址）。截圖 `shot-1280*.png|jpg`、`shot-375*.png|jpg` 由 `node scripts/strategy/concept-shots.mjs --only colour-chapters` 產生（reduced motion，看到的是動態的結束狀態）。

## Idea 句

> On this page, **the line between what a bank or agency already runs (core banking systems, mainframes, the ESB, its WAF) and what TPI connects to it** becomes **the chapter colours: grey chapters are the existing systems, orange chapters are TPI's part, and the hard edge where two flat fields meet is the connection; in the hero the pair is two giant shapes overlapping by a quarter**.

可以操作的一件事：`#orientai` 的「Token 用量監控」開關。切換時整段在橘（開啟）與灰（關閉）之間換色，標題「企業 AI 留在自己的環境」的「自己的」換成「誰的」，開關旁的值在「開啟」「關閉」之間換。沒有 script 時是開啟狀態，所有原文都在左欄。

## 灰、橘與硬邊在每一章怎麼看得出來

sheet 寫明這個方向的 competitor test 最弱，所以每一章都不只換底色，而是讓灰、橘兩片色在同一個畫面裡碰在一起：

| 章 | 灰（既有系統） | 橘（昕力接上的部分） | 硬邊（接點） |
|---|---|---|---|
| hero | 右上的切角灰色方塊，標「既有系統」，裡面是 `fact:digilism-protocol-integration` 原文（核心銀行系統、過時大型機、ESB） | 右下的大圓，標「昕力接上的部分」 | 兩者 `multiply` 重疊的帶狀區，標「接點」 |
| 產業 | 整段灰底：規範與機關原本的防護（`fact:digirunner-nginx-waf`，點名 F5、No Name Security） | 右側 5 欄的橘色平塗區，放 digiRunner 已做到的 6 列原文 | 灰與橘的垂直硬邊 |
| 案例 | 三張轉成灰階的舊文件（證書、發票、帳冊），也就是 AI 要讀的紙 | 每張畫面中線的橘色帶，放案例名稱與成果原文 | 橘帶上下兩條邊 |
| 產品 | 每張卡片上的灰色圖版（電報機、工廠煙囪、門鎖），家族說明裡的灰色區塊放 ESB 原文 | 卡片本身是橘或白，家族原文放在橘色區塊 | 圖版與卡片的邊 |
| OrientAI | 關閉狀態整段灰 | 開啟狀態整段橘 | 切換本身 |
| 導入 | 導入前兩塊灰色 tile | 後兩塊橘色 tile，同一張導入卡片從空白到完成 | tile 尺寸與顏色同時變 |
| 紀錄 | 螢光筆的灰（華南銀行的 CRM） | 螢光筆的橘（ISO27001） | — |

薄荷綠只當「紀錄」這一章的底色（中性的資料），黑是產品與頁尾，紫只在主要動作。

## 主要視覺決定

| 決定 | 原則 |
|---|---|
| 第一屏只有兩行 h1、一句說明、一個紫色按鈕；兩個大形狀不放照片，只標「既有系統／接點／昕力接上的部分」 | P1、P3 |
| 每一章一片平塗色，灰＝既有系統、橘＝昕力的部分，兩片色在同一畫面碰出硬邊（上表） | P3 |
| 事實原文一律放在橘色或灰色的平塗區塊裡，表述（標題、說明）放在章節底色上，兩者一眼分得開 | P2 |
| 案例用一整個畫面一則，成果原文放在固定的中線列；舊文件照片只標「手繪證書，1800 年」這類說明，不冒充客戶文件 | P2、P3 |
| 動態只有三件：產業表的 index with preview（指到一列，左側框換成那條規範對應的文件）、產品卡片隨捲動發成扇形、OrientAI 開關；其餘是一次性的進場 | P4 |
| 章節順序照 `argument.md`：產業 → 案例 → 產品 → OrientAI → 導入 → 紀錄 → 聯絡，主要動作「聯絡業務」只有一個名稱 | P5 |
| 一種字體、五個字級（14／19／26／88／331px，inspector 量到的）、單一 0 圓角、單一紫色方形按鈕 | P4 |

## 品牌紫與 CTA 對比

| 位置 | 前景 | 背景 | 對比 |
|---|---|---|---|
| header 與 hero 的「聯絡業務」按鈕 | 白 `#ffffff` | 紫 `#662e8d` | 8.97:1 |
| 按鈕對頁面（白底） | 紫 | 白 | 8.97:1 |
| `cta` 整段（One word is the button） | 白字 | 紫底；hover／focus 時反轉成白底紫字 | 8.97:1 |

紫和黑底只有 2.34:1，所以紫色按鈕只放在白色章節（header、hero），沒有放在黑色的產品章與頁尾。`cta` 整段就是按鈕，用紫底白字，前後的章節是薄荷綠與黑，邊界靠色相與明度差分開。其他文字的對比：黑對橘 7.28:1、黑對灰 12.17:1、白對接點色 `#c5501f` 4.62:1、黑對薄荷綠 17.43:1。

## 與現有限制的差異

| 項目 | 原型 | 現有限制 | 代價 |
|---|---|---|---|
| 西文字型 | Bricolage Grotesque 400／500／800，latin subset，3 個 woff2 共 66,684 bytes（22,364＋22,476＋21,844） | `font-subsets.mjs` 的現有字型與 subset 規則 | sheet 發的 Cabinet Grotesk 只在 Fontshare，npm 上沒有，換成最接近的 fontsource 字型（同樣是粗、接點緊、小寫有個性的 grotesk）。inspector 因此留下 `font-not-dealt` WARN |
| 中文字型 | 系統字（PingFang TC、Noto Sans TC、Microsoft JhengHei；截圖環境落到 WenQuanYi Zen Hei），不載中文 webfont | 同 | 標題的中文沒有 800 字重，只有系統字的粗體；display 的效果主要靠拉丁字母與字級 |
| JS | `page.js` 4,239 bytes（未壓縮），原生 script，不用 GSAP、Lenis | `scene-budget.mjs` 的預算 | 遠低於預算 |
| CSS | `style.css` 28,420 bytes（未壓縮） | — | — |
| 3D | 無 | ADR 0003 | — |
| 色彩 token | 新增 `--grey #c5c5c5`、`--mint #a7ff9c`、`--orange #ff6831`（與品牌橘 `--orange-500 #ff6329` 幾乎相同）、`--join #c5501f`（灰×橘 multiply）；品牌紫 `#662e8d` 只在 logo 與主要動作 | `tokens.css` 的品牌色與中性色 | 要在 `tokens.css` 加章節色的 token，並讓 `check:design` 的對比檢查涵蓋每組章節底色與字色 |
| 影像規範 | 6 張開放圖庫的博物館藏品照片，全部轉灰階、壓到 1,600px 長邊（共約 924 KB）；介面片段用 HTML（`data-ui`） | `docs/design/` 的影像規範 | 圖庫的圖只呈現「紙、帳冊、機械、鎖」這類場域，正式站要決定是否接受非台灣、非當代的檔案影像 |

## Inspector 最終結果

`CHROME_PATH=$PWD/scripts/strategy/chromium.sh node .claude/skills/taste-skill/scripts/inspect.mjs docs/strategy/concepts/colour-chapters/index.html --out .taste-skill/colour-chapters/inspect --allow palette-purple`

**0 FAIL、3 WARN**（1440、768、390）。`lint.mjs` 0 FAIL、0 WARN。保留的 WARN：

| WARN | 理由 |
|---|---|
| `no-footage` | 找不到可用的影片：Internet Archive 在這個 session 連不上（fetch failed），Wikimedia Commons 回 429。頁面上的「會動的圖」是案例三張文件照片的慢速漂移（24 秒一個來回，reduced motion 時不動） |
| `font-not-dealt` | Cabinet Grotesk 不在 npm，依指示換成 Bricolage Grotesque（見上表） |
| `pinned-over-picture` | 產品章的固定舞台上，卡片（含圖版）由下往上發到標題下方；看過 inspector 每一張截圖，卡片停的位置與移動途中都在標題下方，沒有蓋到標題。固定時間是 1 個畫面（`200svh` 的外框），符合「兩到三個畫面以內」 |

`--allow palette-purple`：品牌紫用在 logo 與主要動作（`design-concept`「用 `taste-skill` 做原型」衝突表）。

`concept-shots.mjs --only colour-chapters`：exit 0。

## 最後一輪評語（`references/critique.md` §4）

```
ROUND 3
Seen in one second: 右側的灰色切角方塊與橘色大圓，重疊處寫著「接點」。
Idea (one sentence): 既有系統是灰、昕力接上的部分是橘，兩片平塗色碰在一起的硬邊就是接點，每一章都用這組顏色排。
Live thing: OrientAI 的「Token 用量監控」開關，整段在橘與灰之間換色，標題換一個詞。
Layout words by section: hero=giant shape / 產業=statement + table pushed right / 案例=full panels / 產品=fan / OrientAI=one control blown up / 導入=growing tiles / 紀錄=two-column statement / 聯絡=giant word / footer=name first
Scores: design 7.5 · usability 7.5 · creativity 7 · content 7 → overall 7.4
Caps applied: 沒有 FAIL；idea 對最近的競品（系統整合商）仍大致成立，creativity 上限 7。
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. 產品章的家族原文與產品清單（固定舞台之後）是四欄小字的密集區，和前後大色塊的節奏落差大（desktop-page-03、shot-1280）。正式版可把產品清單拆到各家族頁，或改成每家族一列。
2. 產業章左欄在灰底上放灰階文件，文件照片本身偏淡，框在 1440 寬只有 26rem，左欄下半仍有一段空灰（desktop-page-01）。可加大框或改成文件的局部特寫。
3. 開關這一章右上四分之一是空的橘（desktop-page-03），開關本身的裁切也比 blueprint 的五分之一少。可把開關再放大、往右下推。
```

前兩輪修掉的問題：第一輪是案例面板的 sticky 疊放蓋住標題（改成不固定）、本文 14px（改成 19px）、開關裡的長原文被段落裁掉（原文移到左欄的「統一管控」）、768 的卡片橫向捲動（改成格狀）；第二輪是手機 hero 的形狀標籤被裁、「接點」字落在灰區、導入 tile 在手機上不對齊、h1 在 reduced motion 時斷在「系／統」、「產品和導入，同一家負責」在 1280 斷成三行（標題移到 tile 上方整列）、頁尾 logo 太小與列表符號。

整體 7.4，低於 7.5。主要差距是 creativity：灰／橘／硬邊這套語法是類別層級的說法，能撐住的只有橘色接近品牌橘，以及灰色裡寫的是昕力事實點名的系統。

## 圖片出處（`assets.mjs --credits`）

全部是 CC0，允許商用。頁尾 `.credits` 一行列出每張圖的標題、作者、年份與來源連結。下載後轉成灰階並縮到 1,600px（記在 `assets/credits.json` 的 `notes`）。

| 檔案 | 用在哪 | 出處 |
|---|---|---|
| `assets/birth-certificate.jpg` | 案例一（AI 智慧理賠）、產業表「共通性規範」的預覽 | "Birth Certificate" by American maker, 1800, public domain (CC0), via The Metropolitan Museum of Art. https://www.metmuseum.org/art/collection/search/537 |
| `assets/invoice-from-ct-lesueur-horticulture-nursery-rouen.jpg` | 案例二（AI 智慧建檔）、產業表「開放銀行」「金融檢查」的預覽 | "Invoice from Ct. Lesueur, horticulture-nursery, Rouen, for fruit trees" by Lesueur Horticulteur-Pépiniériste, September 9, 1880, public domain (CC0), via The Metropolitan Museum of Art. https://www.metmuseum.org/art/collection/search/756878 |
| `assets/interior-decorator-s-account-book-of-hours.jpg` | 案例三（金融聯防阻詐平台）、產業表預設預覽 | "Interior Decorator’s Account Book of Hours Spent" by Jules-Edmond-Charles Lachaise, 1846, public domain (CC0), via The Metropolitan Museum of Art. https://www.metmuseum.org/art/collection/search/432618 |
| `assets/telegraph-instrument.jpg` | DigiLism 卡片、產業表「臺北市政府」的預覽 | "Telegraph Instrument", ca. 1837–44, public domain (CC0), via The Metropolitan Museum of Art. https://www.metmuseum.org/art/collection/search/8484 |
| `assets/factory-building-with-chimney-construction.jpg` | ESGswift 卡片 | "Factory Building with Chimney Construction", 19th century, public domain (CC0), via Art Institute of Chicago. https://www.artic.edu/artworks/33542 |
| `assets/lock-and-key.jpg` | GadoSecurity 卡片、產業表「惡意行為防護」的預覽 | "Lock and Key", 1700–1730, public domain (CC0), via The Metropolitan Museum of Art. https://www.metmuseum.org/art/collection/search/4803 |

sheet 建議的查詢詞（`IBM mainframe`、`hardware security key`、`power plant chimney`、`medical certificate`）只在 Wikimedia Commons 有合適的圖，但 Commons 在這個 session 一直回 429，縮圖網域 `thumb.wikimedia.org` 也被 proxy 擋下；Openverse 逾時。所以改用 The Met 與 Art Institute of Chicago 的館藏：大型主機換成電報機（DigiLism 原文講的是「通訊機制變更」），硬體金鑰換成門鎖與鑰匙，診斷書換成手繪證書。三者都只在說明裡寫出它是什麼，不冒充昕力的產品或客戶文件。sheet 列的 picsum 建築照片沒有用。

## 介面片段（`data-ui`）哪些是示意

| 片段 | 位置 | 原文 | 示意的部分 |
|---|---|---|---|
| 模型選擇 | SysTalk.ai 卡片 | 「企業級 LLM（如 70B 模型）」取自 `fact:aiso-llm-support` | 「場景／模型」欄位、「智能客服」選項與版面都是畫的，標「示意」 |
| Token 用量監控開關 | OrientAI | 「Token 用量監控」取自 `fact:orientai-governance-layer`，「OrientAI 統一管控」是表述 | 開關、「開啟／關閉」與換色都是原型的互動，標「（示意）」，不是 OrientAI 的真實畫面 |
| AI 導入清單 | 導入的四塊 tile | 四個項目照 `fact:systalk-ai-onboarding` 拆的片段 | 勾選框、「AI 導入」標題與勾選進度都是示意，每張標「示意」 |

## 與 sheet 不同的調整

- 字體：Cabinet Grotesk → Bricolage Grotesque（npm 上沒有 Cabinet Grotesk）
- hero 的 h1：sheet 寫 6.4vw、靠左 8%。為了全頁只用一組左右邊距，h1 從頁邊距開始，字級對到第四級 `--step-head`（1440 寬 88px、1280 寬約 83px），兩行在 `<br>` 處斷開；說明句限寬 22em，避免碰到圓形
- hero 的兩個形狀：改成上下重疊（灰色切角方塊在上、橘色圓在下），而不是左右重疊，讓灰色區有位置放既有系統的原文，重疊帶有位置寫「接點」
- 產業表：sheet 的預覽照片在第 1–4 欄底部；這裡放在左欄、跟著捲動（sticky），指到哪一列就換成那一列的文件。表格放在一片延伸到右緣的橘色平塗區，作為灰與橘的接點
- 案例面板：sheet 允許 `position: sticky` 讓面板疊上前一張，但會蓋住案例標題（inspector `covered-text` FAIL），所以改成一般排列。章節標題「AI 已用在理賠、建檔與阻詐」放在第一張面板左上的黑色平塗塊上（house rules 要求每段有標題）
- 產品扇形：卡片顏色只用橘與白交替（sheet 要四個明度不同的色），圖版統一用灰，讓「灰＝既有、橘＝昕力」在卡片裡也成立。固定舞台縮成 1 個畫面（`200svh`），卡片文字限在左側 222px，不被下一張卡片蓋住。舞台之後補一段四欄的家族原文與產品清單，因為卡片放不下 copy deck 第 4 段的全部內容。1120px 以下改成 2 欄、手機 1 欄的格狀，不用橫向捲動
- OrientAI：blueprint 要求左下三分之一留空；這裡把 copy deck 第 5 段的五項原文放在左欄，空白讓給開關右上方
- 導入：標題移到 tile 上方整列（放在小 tile 上方時 1280 寬會斷成三行），說明與原文放在小 tile 上方
- 紀錄：blueprint 不放標題、兩欄左右對齊；這裡加了 h2（house rules），並改成靠左排（中英混排左右對齊時字距被拉開）
- 進場動態只在 900px 以上執行；手機上內容直接顯示（inspector 只走前 12 個畫面，手機頁長超過時，未觸發的進場會被量成空白；手機上不做進場也比較省）
- 頁尾的名稱用白色橫式 logo 撐滿內容寬，不裁字母上緣

## 待補與待確認

| # | 事項 | 位置 |
|---|---|---|
| 1 | 回覆時間：待補（copy deck 待補 #1） | 聯絡 |
| 2 | 六項服務各一句說明：待補（copy deck 待補 #2） | 導入 |
| 3 | 開關關閉時標題換成「企業 AI 留在誰的環境」：這個詞是原型自己寫的表述，要人審 | OrientAI |
| 4 | 原型自己加的短標：「既有系統」「接點」「昕力接上的部分」（hero）、「機關原本的防護」（產業）、「規範」（表格名稱）、「導入與服務」（導入）、「OrientAI 統一管控」（開關），以及紀錄段落裡串接原文的「的紀錄：」「接著」「往海外」「然後」「開發流程上」「雲端上」「今天的據點：」 | 各章 |
| 5 | 比 copy deck 多用的兩條事實：`fact:digilism-protocol-integration`（hero 灰色區、DigiLism 家族）與 `fact:digirunner-nginx-waf`（產業章灰色區）。都是 `confirmed`，是 sheet「每一段灰色裡寫的是昕力事實裡點名的系統」要求的 | hero、產業、產品 |
| 6 | 紀錄段落用了 `fact:office-names`（據點），copy deck 列為可加 | 紀錄 |
| 7 | 圖片是 18–19 世紀的歐美館藏，正式站是否接受這類檔案影像，或改用台灣的場域照片 | 案例、產品 |
| 8 | 產業表各列的預覽圖對應是原型自己配的（例如「臺北市政府」配電報機），只是場域氣氛 | 產業 |
