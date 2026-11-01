# Dressed as something else（`borrowed-category`）

第 3 階段的首頁原型（#166）。direction sheet 見 [`sheet.md`](sheet.md)（seed 1677797083，沒有 redraw），共用文字照 [`../copy-deck.md`](../copy-deck.md)，原則照 [`../../design-principles.md`](../../design-principles.md)。

打開 `index.html`（`file://` 可離線開，不連外部網址）。截圖：`shot-1280-first.png`、`shot-375-first.png`（第一屏），`shot-1280.jpg`、`shot-375.jpg`（整頁），由 `node scripts/strategy/concept-shots.mjs --only borrowed-category` 產生。

## Idea 句

> On this page, **the rules TPI's products are built to and the named projects that prove it — the FSC open-banking rules, the NDC common API specification, financial inspection, Taipei City Government** becomes **a festival line-up: the rules are billed as the headliners in heavy type on electric cobalt, and the programme rows read rule, product, industry, link**.

借來的類別：音樂祭節目單。可以操作的一件事：OrientAI 段的「消除影子 AI」開關。

## 主要視覺決定

| 決定 | 做法 | 原則 |
|---|---|---|
| 第一屏 | h1「金融與政府的系統／接上 API 與 AI」以 10vw（1440 寬 144px）壓在鈷藍色場上，說明句與「聯絡業務」在底部白色色帶；產業名稱在 h1 裡 | P1 |
| 拱形照片 | 臺北市政府大樓（藍色單色調）貼在 h1 第二行右側、跨過色帶接縫，不蓋字；是規範與具名案例發生的場域，不是昕力的辦公室 | P1、P3 |
| 節目表 | 第 2 段是一張真的 `<table>`：每列是規範或案例、產品、產業、連結，下一列是事實原文；產業是「日」的標題（黃色，sticky） | P2、P5 |
| 案例索引 | 三個案例名稱用大字排成索引，hover 或 focus 換右側固定預覽框的圖；成果原文一直顯示在名稱下方，不藏在互動裡 | P2、P4 |
| 產品看板 | 6 塊平塗色磚，每塊放一個放大的介面片段（`data-ui`）加家族名稱、要解決的問題與一條原文；不用 icon 卡片 | P3、P5 |
| OrientAI 開關 | 一個真的 `role="switch"` 按鈕放大到約 45vh，切換整段底色（白／黑）、標題的一個詞（自己的／外部的）與值（開啟／關閉）；沒有 script 時停在開啟 | P4、P3 |
| 導入 | 140 個方塊從散落、收成一條帶子、再排成整齊的列，三欄文字是 SysTalk.ai AI 導入的原文片段 | P3、P4 |
| 穩定度 | 兩欄的整段文字，6 條事實原文串成一段，年份、客戶、認證用平塗螢光標出 | P2 |
| 聯絡 | 整段紫色色帶是一個連結，單字「聯絡業務」約 22vw；hover／focus 時紫白互換 | P4、P5 |
| 頁尾 | 白底鈷藍字，四欄連結與聯絡資料，最下方 TPIsoftware 字標滿版 | P4 |
| 品牌紫 | 只用在 logo、hero 白帶上的主要按鈕、header 按鈕的字與 CTA 色帶 | P4 |

## 品牌紫的位置

紫 `#662e8d` 對鈷藍 `#0034eb` 只有約 1.15:1，放在鈷藍上看不出按鈕形狀。所以：

- hero 的主要按鈕放在底部白色色帶上：紫對白 9.0:1，白字對紫 9.0:1
- header 的「聯絡業務」是白底紫字的方塊：白對鈷藍 7.8:1，紫字對白 9.0:1
- 第 8 段整段紫底白字（9.0:1），不在鈷藍上放紫色元素

這是五個方向裡品牌紫衝突最大的一個：主要動作在鈷藍場上永遠要借另一個色帶。交人決定。

## 與現有限制的差異

| 項目 | 這個原型 | 現有限制 |
|---|---|---|
| 字型 | Chivo variable（latin，100–900）1 個檔，33,220 bytes（`@fontsource-variable/chivo` 5.3.0）。中文用系統字，不載中文 webfont | 要放寬字型就是新增一個西文 webfont；中文仍是系統字 |
| JS | `script.js` 2,443 bytes（未壓縮），沒有任何函式庫，不用 GSAP | 沒有超過預算的疑慮 |
| CSS | `style.css` 23,397 bytes | — |
| 3D | 沒有 | 現行 hero 的 3D 場景不用 |
| 色彩 token | 新增鈷藍 `#0034eb`、`#002fd6`、淡藍 `#c5d0ff`、黃 `#e9e34a`、近黑 `#111111`，方塊圖另用 `#6f88f5`；品牌紫 `#662e8d` | 需要一整套新的色彩 token，底色從現有設計換成鈷藍 |
| 影像 | 4 張開放圖庫的真實圖片，全部轉成藍色單色調（ImageMagick 灰階後對應到 `#001466`–`#e6ecff`），合計約 576 KB；另有 2 張程式畫的 SVG | 影像規範要加「單色調處理」與開放圖庫出處的規則 |

量法：`ls -l` 看檔案大小。

## 與 sheet 不同的調整

- **h1 字級**：sheet.md 寫 12vw 滿版，實作改 10vw（1440 寬 144px、768 寬 77px），375 寬 10.6vw（約 40px）。12vw 時第一行佔滿全寬，拱形照片只能疊在字上（house rule 禁止）或移出第一屏；10vw 讓照片放在第二行右側、第一行下方。照片高度上限 33vw
- **照片頂端**：blueprint 要照片頂端出血到畫面外。照片放到第一行下方以後做不到，改成從第一行下方開始、下緣跨過接縫
- **平板直向（700–1023 寬）**：照片照手機的做法放大到 54vw 貼右緣，否則第一屏中段空掉
- **節目表的字重**：blueprint 說「一個字重、不加粗」，idea 句說規範是用粗字排的頭牌。照 sheet 的優先順序（direction 高於 blueprint），規範、產品、產業三欄用 900
- **節目表的事實列**：blueprint 每列只有一行字；P2 要求原文擺在旁邊，所以每列下面多一列原文，用內文字級（桌面 19px）
- **案例段的時間欄**：案例沒有年份事實，名稱右側只放作業（表述），不放年份
- **產品看板**：blueprint 是 8 塊，這裡 6 塊（標題、DigiLism、SysTalk.ai、ESGswift、gadoScout、GadoSecurity），沒有空格。各家族的產品清單沒有放，只放「產品總覽」連結（見待補）
- **OrientAI 段**：blueprint 要左下三分之一留空；copy-deck 要求四項特色都要出現，所以左欄放特色清單。切換的兩個顏色是白與近黑 `#111111`（都在 palette 裡）；鈷藍和 `#002fd6` 太接近，切換時看不出來
- **頁尾**：blueprint 要整屏高、`position: sticky` 從後面露出。整屏高會在中間留下超過半屏的空白，sticky 會讓 `concept-shots.mjs` 的整頁截圖把頁尾畫在 CTA 後面，所以都拿掉
- **字型**：Chivo 有 npm 套件，沒有換字型。用 variable 版，一個檔涵蓋 400、700、900
- **黃色**：sheet 說黃色只用在一個地方。實際用在節目表的產業標題、介面片段裡的開啟狀態，以及 focus 外框與 hover；都不是按鈕
- **影片**：沒有放（見 inspector）

## Festival line-up 的語氣與 P4

風險：音樂祭的熱鬧和 P4「克制與可預期」最遠。金融與政府的決策者看到鈷藍滿版、巨大的粗字與黃色標題，可能把它讀成活動或消費品牌，而不是要交出核心系統的廠商。

壓低的做法：

- 借的是節目單的**結構**，不是音樂祭的裝飾：沒有貼紙、傾斜文字、霓虹或循環動畫。唯一傾斜的是拱形照片（5 度）
- 節目表的每一列是規範名稱加金管會、國發會規範的原文，熱鬧的形式裡裝的是最「受控」的內容
- 動態只有一次性的進場、hover／focus 回饋、照片的開幕（shutter）與一張圖隨捲動微移，沒有自動播放、輪播或背景影片；`prefers-reduced-motion` 時全部停在完成狀態
- 文字層級只有大與小兩種在做事，內文都是完整白色，對比都在 4.5:1 以上
- 照片全轉藍色單色調，跟色場同一個色系，不搶文字

仍然存在的風險：第一屏的鈷藍滿版與 144px 粗字本身就是音樂祭海報的語氣，這一點沒有壓，壓了就不是這個方向。交 reviewer 與人判斷。

## Inspector 結果

最後一次（`CHROME_PATH=$PWD/scripts/strategy/chromium.sh node .claude/skills/taste-skill/scripts/inspect.mjs docs/strategy/concepts/borrowed-category/index.html --out .taste-skill/borrowed-category/inspect --allow palette-purple`）：**0 FAIL、1 WARN**。`lint.mjs`：0 FAIL、0 WARN。

- `palette-purple`：以 `--allow` 放行，品牌紫只在 logo 與主要 CTA（design-concept skill 的衝突表）
- WARN `no-footage`（頁面沒有影片）：保留。P4 的「不會怎麼呈現」排除背景影片與自動播放；開放圖庫也沒有不冒充客戶的金融或政府作業片段
- lint 的 `shadow`：兩條 `box-shadow` 在 `data-ui` 介面片段的鍵帽上，加了 `taste-skill-ignore` 註解

`node scripts/strategy/concept-shots.mjs --only borrowed-category`：exit 0。第一次跑失敗，原因是 `<link rel="preload" ... crossorigin>` 從 `file://` 載字型被 CORS 擋下；拿掉 preload 後 `@font-face` 照常載入（`document.fonts.check('900 40px Chivo')` 為 true）。

## 評語（taste-skill 第 8 步，最後一輪）

```
ROUND 3
Seen in one second: 鈷藍海報上的巨大白字「金融與政府的系統 接上 API 與 AI」，右邊一張傾斜的拱形市政府照片，底部白帶上一個紫色按鈕。
Idea (one sentence): 規範與具名案例像音樂祭卡司一樣排在鈷藍節目單上，一列是規範、產品、產業、連結。
Live thing: OrientAI 的「消除影子 AI」開關，切換底色、標題的一個詞與值。
Layout words by section: hero=poster shout + seam photo / industries=programme table / cases=big-name index + sticky frame / products=tile board / orientai=one giant switch / services=squares diagram + three columns / about=two-column highlighted statement / contact=one-word band / footer=columns + full-width wordmark
Scores: design 7.5 · usability 7.5 · creativity 8 · content 7 → overall 7.5
Caps applied: 無（0 FAIL；4 張真實圖片；有 live thing；第一屏有按鈕）
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. 桌面第一屏左下約 1000×300px 是空的鈷藍場（desktop-fold.jpg）。h1 已從 8.6vw 放大到 10vw、照片改貼第二行，再大第一行就會碰到照片。視為整頁唯一一次刻意的留白；要再收，得讓 h1 改成三行或照片移出第一屏，都違反規則
2. 產品看板的說明字是 13–14px 的小字，色磚裡的內容讀起來比其他段吃力（desktop-page-02.jpg）。看板的字級來自 blueprint 的 18px／15px 對到本頁的五個字級
3. 節目表的產業欄（金融、政府）和上方的產業標題重複（desktop-page-01.jpg）。保留是因為 idea 句的「rule, product, industry, link」四欄；若要精簡，可改成規範來源，但事實庫沒有每條規範的主管機關欄位
```

前兩輪修掉的：產品看板的介面片段被磚的邊緣切掉文字（covered-text FAIL）、案例與節目表的小字被判成 eyebrow（FAIL）、節目表欄寬由 colspan 列決定導致「惡意行為防護」斷行、OrientAI 開關的「開啟」直排、字級從 11 種收到 6 種、平板直向第一屏的空洞與 CTA 色帶中段的空白（blank-gap WARN）、手機看板標題孤字。

## 圖片出處

`node .claude/skills/taste-skill/scripts/assets.mjs --credits --to docs/strategy/concepts/borrowed-category/assets` 的輸出，頁尾也有同樣的出處：

- `assets/banknote-specimen.jpg`: "Specimen Sheet of Bank Note Engraving" by Asher Brown Durand, ca. 1828, public domain (CC0), via The Metropolitan Museum of Art. https://www.metmuseum.org/art/collection/search/339836 （阻詐平台的預覽）
- `assets/receipt-1865.jpg`: "Receipt" by Charles Meryon, January 23, 1865, public domain (CC0), via Art Institute of Chicago. https://www.artic.edu/artworks/63740 （智慧建檔的預覽）
- `assets/hospital-middlesex.jpg`: "Hospital, Middlesex" by Thomas Rowlandson, April 1, 1809, public domain (CC0), via The Metropolitan Museum of Art. https://www.metmuseum.org/art/collection/search/744472 （智慧理賠的預覽）
- `assets/taipei-city-hall.jpg`: "Taipei City Hall front 20230417" by Yu tptw, CC BY-SA 4.0, via Wikimedia Commons. https://commons.wikimedia.org/w/index.php?curid=130819377 （hero 的拱形照片）

說明：

- 臺北市政府的照片用 `assets.mjs --get` 下載時 Wikimedia 一直回 HTTP 429，改用 curl 直接下載 Commons 的 1920px 縮圖，`credits.json` 那一筆是手動補上的（`notes` 有記錄）
- 四張都裁切並轉成藍色單色調。CC BY-SA 4.0 的那張改過以後要以同一授權分享，頁尾已註明
- 三張案例預覽是十九世紀的版畫、收據與鈔票樣張，呈現理賠（醫院）、單據、跨行金融的場域，不是昕力或客戶的文件；臺北市政府大樓是具名案例的機關，不是昕力的辦公室
- 方塊圖 `flow-wide.svg`、`flow-tall.svg` 是程式畫的（產生器在 session 的 `/tmp`，沒有放進 repo），不算進真實圖片

## 介面片段（`data-ui`）哪些是示意

版面全部是原型畫的，不是產品的真實畫面。

| 片段 | 用到的字 | 示意的部分 |
|---|---|---|
| DigiLism 磚 | digiRunner、AI Gateway、企業 API、資料、業務流程、MCP 協定（取自 `fact:digilism-family-digirunner`） | 開關的排列與「全部開啟」的狀態 |
| SysTalk.ai 磚 | LLM、70B（取自 `fact:aiso-llm-support` 的「如 70B 模型」） | 滑桿與它的位置 |
| ESGswift 磚 | 碳盤查、CBAM、碳足跡（取自 `fact:greenswift-scope`） | 分段切換與選中 CBAM |
| gadoScout 磚 | 異常（取自 `fact:gadoscout-ml-detection`） | 狀態方塊 |
| GadoSecurity 磚 | FIDO2、無密碼（取自 `fact:gadodido-passwordless`） | 鍵帽與按下的狀態 |
| OrientAI 開關 | 消除影子 AI（取自 `fact:orientai-governance-layer`） | 開關本身與「開啟／關閉」；切到關閉時標題換成「外部的」是表述 |

## 待補

- 聯絡後多久回覆：頁面寫「回覆時間：待補」（copy-deck 待補第 1 項）
- 第 6 段六項服務各一句說明：只放了連結（copy-deck 待補第 2 項）
- 各產品家族的產品清單（節點名稱的連結）沒有放進看板；要放的話需要另一種版型，或把清單做進介面片段
- copy-deck 待補第 3–6 項（證言、第 2 段多出的四條事實、h1 長度、金融與政府的排序）照 copy-deck，原型沒有另外處理

## 想讓人決定的事

1. 品牌紫在鈷藍場上看不出形狀，主要動作永遠要放在白帶或整段紫色上。可以接受，還是這個方向的配色要改
2. 節目表的音樂祭語氣對金融與政府決策者是否太熱鬧（見上面 P4 一節）
3. OrientAI 開關切到「關閉」時，標題變成「企業 AI 留在外部的環境」，用負面狀態說明影子 AI 的風險。這個寫法要不要
4. 開放圖庫的十九世紀版畫與收據放在 AI 案例旁邊，是否會讓人讀成「舊」而不是「既有」
