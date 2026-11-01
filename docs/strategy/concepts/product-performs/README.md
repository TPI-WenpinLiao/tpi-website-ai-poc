# The product performs（`product-performs`）

#166 第 3 階段的首頁原型。發牌結果、redraw 與 idea 句在 [`sheet.md`](sheet.md)，共用文字照 [`../copy-deck.md`](../copy-deck.md)。直接用瀏覽器打開 `index.html`（`file://`，不連外部網址）。

## Idea 句

digiRunner 針對金融檢查的 API 管理清單，以及它前面接的既有系統，做成 hero 中間那條影格帶裡真的會動的介面片段：捲動時，一個 API 請求一格一格通過識別認證與金融檢查，最後接進核心銀行系統（`argument.md` 清點第 6、8 項）。

可以操作的一件事：第 6 段「產品和導入，同一家負責」的拖曳條。它是真的 `<input type="range">`，有四個停點，對應 SysTalk.ai 的 AI 導入順序（`fact:systalk-ai-onboarding`）。拖動或按方向鍵時，左邊的句子與右邊的導入清單一起換狀態；點階段名稱也可以跳過去。手機上拇指是 40px。沒有 script 時拖曳條不出現，四個階段直接列成清單。

## 主要視覺決定

| 決定 | 畫面上的做法 | 原則 |
|---|---|---|
| 第一屏是一句被影格切開的 h1 | 「金融與政府的系統」貼左、「接上 API 與 AI」貼右，中間 35vw 是介面影格帶；說明句與「聯絡業務」緊接在左半句下方 | P1 |
| 影像主角是照事實文字做的介面片段 | 9 個 `data-ui` 片段（hero 3 格、產品家族 4 個、OrientAI 5 個、導入 1 個，hero 第 4 格是照片）。標籤只用事實原文、產品名與規範名，每個片段的標題列都寫「介面示意」 | P3 |
| 「接進既有系統」畫成請求的路徑 | 影格依序是識別認證 → 金融檢查 9 項 → 主控台軌跡與 DigiLism 轉送 → 一張真實的大型主機照片 | P3 |
| 證據和表述分開 | 產業段每列左邊是事實原文（16px、完整文字色），右邊是短標（灰）；案例段的成果原文放在作業名稱上方的固定位置；穩定度是年份加原文的兩欄紀錄 | P2 |
| 狀態只用一個色相 | 片段裡只有「目前這一列」用藍 `#1d5fbf`，其餘是黑白灰（app sheet「Achromatic ledger」）；頁面只有古銅標記與紫色按鈕 | P4 |
| 每段版型不同，依判斷順序排輕重 | hero（分割句）→ 產業（灰底色帶上的兩端列）→ 案例（固定舞台，左索引右照片）→ 產品（窄欄的小證明）→ OrientAI（橫向一排，只有中間那個亮）→ 導入（50/50 拖曳）→ 紀錄（側欄事實加兩欄列表）→ 聯絡（近乎空白的一句話） | P5 |
| 動態只表達狀態 | hero 與案例是兩段 `position: sticky` 的固定舞台；片段的「待檢查」變「通過」；各段標題、文字、面板依序上移淡入；照片慢慢縮放。減少動態時全部停在完成狀態 | P4 |

## 與 sheet 不同的調整

sheet 已記錄的調整（品牌紫、字體、h1 拆成左右、片段內容）照做。這一階段另外改了下面幾處：

1. **主要 CTA 的紫色**：sheet 寫品牌紫 `#662e8d` 放在 `#111111` 上（2.10:1，不到 3:1）。原型改用品牌紫亮一階的 `#8a4fb8`：按鈕對底色 3.50:1、對 `#1c1c1c` 3.16:1，白字對按鈕 5.40:1；hover 時 `#9459c2`，白字 4.73:1。logo 在深底上用白色版（`logo-horizontal-white.svg`），所以頁面上看得到的紫只有按鈕。要不要把這個色階加進 tokens，交人決定
2. **說明句的位置**：hero blueprint 把說明句放在左下角。taste-skill 的 house rule 要求說明句緊接在 h1 下方 32–48px，依優先順序照 house rule，放在左半句下方 32px；左下角不放東西
3. **影格的比例**：blueprint 說影格是 16:9，又說上下鄰格只露 60px。兩者在 800–900px 高的視窗裡無法同時成立；16:9（448×252）也放不下 9 項檢查。桌機改成 `min(100svh − 176px, 35vw × 1.1)` 高（1440 寬約 504×554），上下鄰格露出約 150px；手機照 blueprint 用 4:3
4. **h1 字級**：blueprint 是 `clamp(40px, 3.6vw, 60px)`、medium。1280 寬時 3.6vw 的左半句（8 個字寬）塞不進影格旁的欄寬，改成 `clamp(34px, 3.3vw, 60px)`，字重照 type system 用 700。CJK 的字距用 −0.02em、行高 1.05（type system 的 −0.03em 與 0.9 是給拉丁大寫用的）
5. **字級對應**：全頁五級，`small` 13–14、`body` 17–19、`lead` 20–26、`display` 34–60（h1、h2）、`poster` 38–76（案例段標題與導入段的句子）。blueprint 寫的 15px、24–28px、80–120px 都對應到這五級；案例標題要在 38% 的欄裡排成兩行，最大只到 4.4vw
6. **OrientAI 一排**：blueprint 用 22% 不透明度表示沒亮的面板。sheet 的調整規定看得到的文字要完整對比，所以沒亮的面板改用產品的深色主題（文字 `#d9d9d9`、`#a3a3a3`），只有中間那個是亮色主題。另加「上一項／下一項」兩個按鈕給鍵盤使用者
7. **段落標題**：showcase、how-it-works、about 的 blueprint 都說「沒有標題」，house rule 要求每段有標題，三段都加了 copy-deck 的 h2；聯絡段的 h2 用 `lead` 字級，維持 blueprint「這段沒有標題大小的字」
8. **頁尾**：blueprint 要求單行、不放 logo。copy-deck 的頁尾聯絡資訊移到聯絡段的一行小字；頁尾下面加一行圖片出處
9. **產業段**加一整片 `#1c1c1c` 色帶，否則 hero 結束後那一屏不到 20% 有內容（inspector `empty-screens`）
10. **進場動畫**：頁面最後的服務連結、穩定度的側欄與紀錄、聯絡段不做進場動畫。inspector 只捲 12 屏，手機版的頁面約 14 屏，最後幾段如果還在等進場，會被量成空白

## 與現有限制的差異

| 限制 | 現有規則 | 這個原型 | 量法 |
|---|---|---|---|
| 字型 | Inter、JetBrains Mono 的 latin／vietnamese／greek 子集，不載中文 webfont | Jost variable 的 latin 子集 1 個檔，**26,576 bytes**（26 KB）；中文用系統字（PingFang TC、Noto Sans TC、微軟正黑體）。Jost 是 Futura 系的幾何字，和 Inter 不同，選定時要換掉 Inter | `wc -c assets/jost-latin-wght-normal.woff2` |
| JS | 每頁初始 6 KB（gzip） | `page.js` **7,557 bytes，gzip 2,891 bytes**，沒有 library（不用 GSAP、Lenis） | `wc -c page.js`、`gzip -c page.js \| wc -c` |
| CSS | — | `style.css` 30,167 bytes，gzip 7,431 bytes | 同上 |
| 3D | 首頁 hero 用真 3D，靜態圖是 LCP | **不用 3D**，省下延後載入的 3D JS。hero 的 LCP 是 h1 與第一個介面片段（HTML 文字），不是圖片 | — |
| 色彩 token | 品牌三色沿用現站，橘當裝飾 | 換成 sheet 的 Lunar and bronze：底 `#111111`、面 `#1c1c1c`、字 `#f2f2f2`、次要 `#8f8f8f`（底上 5.84:1）、古銅 `#a08672`（只用在列首圓點、拖曳條拇指、導入段的色場、焦點框）。新增 CTA 紫 `#8a4fb8`。片段內另一組亮色主題 token，加一個狀態藍 `#1d5fbf` | WCAG 對比用相對亮度公式算 |
| 影像 | 只用抽象 3D 渲染，不放文字、人物、真實產品 | **放寬**：9 個 HTML 介面片段（帶文字），加 4 張開放圖庫的真實照片（3 張有人物或場域，都是 1903–1960 年代的檔案照，不是昕力的客戶或員工）。照片共 692 KB | `du -cb assets/*.jpg` |

## inspector 的最終結果

```
CHROME_PATH=$PWD/scripts/strategy/chromium.sh node .claude/skills/taste-skill/scripts/inspect.mjs \
  docs/strategy/concepts/product-performs/index.html --out .taste-skill/product-performs/inspect --allow palette-purple
```

**0 FAIL、4 WARN**（1440、768、390 三個寬度）。會動的元素：1440 寬 78 個（下限 8、建議 16）。`lint.mjs`：0 FAIL、0 WARN。

保留的 WARN：

| WARN | 理由 |
|---|---|
| `no-footage`（沒有影片） | 開放圖庫找不到誠實的影片（真實的銀行或理賠作業現場）；會動的圖由案例照片的慢速縮放與 hero 大型主機照片的慢速平移負責。另外 Wikimedia 這段時間對下載回 429，見「圖片出處」 |
| `side-scroll`（有一排橫向捲動、內容超出邊緣） | 這是 OrientAI 的橫向一排（blueprint「Lit panel, dark row」）：故意讓視窗邊緣切掉最外側的面板，表示還可以往旁邊捲；有捲動吸附、滑鼠拖曳、鍵盤（這一排可以 focus）與上一項／下一項按鈕 |
| `long-pin`（「AI 已用在理賠、建檔與阻詐」在 3 屏內都看得到） | 案例段是 250svh 的固定舞台，三則案例各佔一段捲動，每一段的照片、成果原文與目前列都會換，標題不變是 blueprint 的設計（Small index, large picture） |
| `pinned-over-picture`（390 寬：「接上 API 與 AI」壓在圖上） | 手機版的影格帶放在 h1 上下半句之間的窗口裡（`overflow: hidden`），窗口外的影格被裁掉、看不到。inspector 量的是被裁掉影格的矩形，畫面上沒有東西蓋在標題上（見 `shot-375-first.png`） |

`concept-shots.mjs --only product-performs`：**exit 0**（沒有外部請求、缺檔、console error、375／1280 都沒有橫向溢出）。中間曾因 `<link rel="preload" crossorigin>` 字型在 `file://` 被 CORS 擋下而失敗，拿掉 preload 後 `@font-face` 照常載入（`document.fonts` 回報 Jost `loaded`）。

## 最後一輪評語

照 `references/critique.md` 評了三輪，下面是第 3 輪。

```
ROUND 3
Seen in one second: 中間一張白色的 digiRunner 主控台片段，左右被一句話夾住。
Idea (one sentence): 一個 API 請求在 hero 的影格帶裡逐格通過識別認證、金融檢查，接進核心銀行系統。
Live thing: 導入段的拖曳條（四個階段），加上 OrientAI 那一排可以拖、可以用按鈕切換。
Layout words by section: hero=分割句加影格帶 / 產業=色帶上的兩端列 / 案例=固定舞台索引加大照片 / 產品=窄欄小證明 / OrientAI=橫向亮一格 / 導入=50/50 拖曳 / 紀錄=側欄加兩欄列表 / 聯絡=一句話 / 頁尾=單行
Scores: design 7.5 · usability 7.5 · creativity 8 · content 7 → overall 7.5
Caps applied: 無（0 FAIL；沒有 eyebrow、編號、漸層、靜止陰影、細線；4 張真實照片；有 live thing）
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. 產品家族段（desktop-page-02 右半）仍是一條窄欄，左右各留大片暗底；片段只有 480px 寬、內容 2–5 列。要更滿就把四個面板放大到 560px 並各多一層狀態，或換成兩欄
2. OrientAI 段（desktop-page-03 左上）色帶上半只有標題與一段文字，一排面板偏矮（約 180–260px），不是「畫面上最亮的東西」該有的份量。可以把中間那個面板放大到 520px、列高加大
3. 導入段的四個階段名稱（desktop-page-03 左下）是 16px 灰字，和上方 poster 級的句子差距太大，讀起來像註腳；拖曳條的灰色軌道在深底上也偏弱
```

前兩輪修掉的：hero 第一格下半是空白（改成 44px 的列高、底部固定的說明列、影格高度改成 1.1 倍寬）；案例段的成果文字重疊、左緣錯位（只顯示目前案例、對齊索引欄）；hero 結束那一屏與頁尾前近乎全空（產業段加色帶、聯絡段上方留白縮成 18svh、紀錄改成內文字級）；手機版下半句沒有靠右；平板的案例被誤判為 icon 卡片（勾號從 SVG 改成 CSS）。

第 3 輪 7.5 分，沒有到 8。上面三點沒有修，留給人看過方向之後決定。

## 圖片出處

`node .claude/skills/taste-skill/scripts/assets.mjs --credits --to docs/strategy/concepts/product-performs/assets` 的輸出（頁尾有同一份 HTML）：

- `assets/mainframe.jpg`：“IBM System 360 model 40 panel” by Darklanlan, CC0, via Wikimedia Commons. https://commons.wikimedia.org/wiki/File:IBM_System_360_model_40_panel.jpg（hero 第 4 格）
- `assets/insurance-office.jpg`：“StateLibQld 2 391473 Interior of South British Insurance Company on Queen Street, Brisbane, 1903”, Public domain, via Wikimedia Commons. https://commons.wikimedia.org/wiki/File:StateLibQld_2_391473_Interior_of_South_British_Insurance_Company_on_Queen_Street,_Brisbane,_1903.jpg（案例：AI 智慧理賠）
- `assets/medical-records.jpg`：“Medical records Mennonite Hospital La Junta CO (24307113179)” by Mennonite Church USA Archives, No restrictions, via Wikimedia Commons. https://commons.wikimedia.org/wiki/File:Medical_records_Mennonite_Hospital_La_Junta_CO_(24307113179).jpg（案例：AI 智慧建檔）
- `assets/bank-counter.jpg`：“StateLibQld 1 151711 Teller's counter at the Queensland National Bank, Brisbane, 1922”, Public domain, via Wikimedia Commons. https://commons.wikimedia.org/wiki/File:StateLibQld_1_151711_Teller%27s_counter_at_the_Queensland_National_Bank,_Brisbane,_1922.jpg（案例：金融聯防阻詐平台）

四張都允許商用（CC0、公有領域、no known restrictions）。照片只呈現場域（保險公司辦公室、醫院病歷室、銀行櫃檯、大型主機），圖說寫地點與年份，沒有一張被說成昕力的產品、客戶或辦公室。

下載方式和其他方向不同，要說明：這段時間五個方向同時跑 `assets.mjs`，Wikimedia 的 API 與 `upload.wikimedia.org` 持續回 HTTP 429，`--get` 重試約 30 分鐘都沒成功。最後用 `/tmp` 下的一支 Node script（描述性 User-Agent，失敗後退避重試）讀 Commons API 的授權欄位，下載同一個檔案的標準縮圖（1280px 或 960px），再照 `assets.mjs --get` 的格式寫進 `assets/credits.json`，`--credits` 的輸出因此和 `--get` 下載的一樣。三張檔案照只有 960px 寬，桌機案例舞台（62vw）會放大約 1.2 倍，略軟。

sheet 發的 Architecture 組氣氛照（picsum.photos）沒有用。

## 介面片段：哪些是示意

所有 `data-ui` 片段都不是產品截圖，版面是照事實文字畫的示意，每個片段的標題列都標「介面示意」。

| 片段 | 用到的事實原文 | 示意（不是事實）的部分 |
|---|---|---|
| hero 第 1 格「識別認證」 | `fact:digirunner-security`（OAuth 2.0、OIDC、API Key、mTLS、JWT、HSM、Domain URL） | 分段控制的樣子、「通過／檢查中」的狀態字、OAuth 2.0 被選取 |
| hero 第 2 格「金融檢查」 | `fact:digirunner-financial-inspection` 的 9 項，字不改 | 把 9 項畫成逐項檢查的清單與狀態 |
| hero 第 3 格「即時主控台」 | `fact:digirunner-console`、`fact:digirunner-ai-usage-log`、`fact:digirunner-ai-governance`、`fact:digilism-protocol-integration` | 頁籤、軌跡列、「轉送：核心銀行系統」「已送達」「保留」「啟用」等狀態字 |
| 產品家族 4 個 | `fact:digilism-family-digirunner`、`fact:digilism-protocol-integration`、`fact:aiso-llm-support`、`fact:greenswift-scope`、`fact:gadodido-passwordless`、`fact:gadoscout-ml-detection`，產品名照 copy-deck | 下拉選單、頁籤、登入按鈕文字「以 FIDO2 驗證」、「已整合」「串接」「盤查中」「範圍」 |
| OrientAI 5 個 | `fact:orientai-on-prem-data`、`fact:orientai-governance-layer`、`fact:orientai-aidaptiv`、`fact:orientai-mcp`、`fact:orientai-token-cost` | 「部署位置：企業端」「資料掌控權：企業」的欄位形式、開關 |
| 導入清單 | `fact:systalk-ai-onboarding` 的四個片段 | 「完成／進行中／待進行」狀態 |

片段裡沒有數字、請求數、時間、路徑或客戶名。唯一的色相（藍）只標「目前這一列」。

## 待補

| # | 事項 | 位置 |
|---|---|---|
| 1 | 聯絡後多久回覆：頁面上寫「回覆時間：待補」 | 聯絡段（copy-deck 待補第 1 項） |
| 2 | 六項服務各一句說明：頁面只列服務名稱的連結 | 導入段（copy-deck 待補第 2 項） |
| 3 | digiRunner 真實的介面截圖：有了以後，hero 的影格要換成真的畫面，或確認示意可以保留 | hero、產品家族、OrientAI（`design-principles.md`「待確認」第 4 項） |
| 4 | CTA 紫 `#8a4fb8` 是否成為品牌紫的正式色階 | tokens |
| 5 | 檔案照的解析度：三張只有 960px，正式頁要換成解析度更高的版本或另找圖 | 案例段 |

## 想讓人決定的事

- 影格帶裡的片段是照文字畫的示意：決策者可能會把它當成 digiRunner 的真實畫面。標了「介面示意」是否就夠，還是要等真實截圖才採用這個方向
- 用 1903–1960 年代的檔案照呈現理賠、建檔、阻詐這些現代作業，是否合適；或改成現代的場域照
- 兩段固定舞台（hero 240svh、案例 250svh）讓桌機首頁變長（1440 寬約 12.6 屏），是否接受
