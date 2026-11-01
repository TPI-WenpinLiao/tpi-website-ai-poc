# Loud and flat（`loud-flat-poster`）

#166 第 3 階段的首頁原型。發牌結果、redraw 與本站的調整在 [`sheet.md`](sheet.md)，文字照 [`../copy-deck.md`](../copy-deck.md)。

Idea 句：昕力的產品對應的法規文件與被接進來的舊系統，成為一張張平塗的街頭海報，舊機器或紙本的老圖剪下來貼上去。

可以操作的一件事：OrientAI 段的「離線運行」大開關。切換時整段底色在綠與骨白之間換，下方引用的原文在 `fact:orientai-aidaptiv`（開）與 `fact:orientai-on-prem-data`（關）之間換；沒有 script 時停在「開」並顯示原文。

打開方式：直接用瀏覽器開 `index.html`（`file://`），不連任何外部網址。截圖：`shot-1280-first.png`、`shot-375-first.png`（第一屏），`shot-1280.jpg`、`shot-375.jpg`（整頁，減少動態），由 `node scripts/strategy/concept-shots.mjs --only loud-flat-poster` 產生。

## 主要視覺決定

| 決定 | 原則 |
|---|---|
| hero 是整片黃色平塗，h1「金融與政府的系統／接上 API 與 AI」滿版兩行（1280 寬約 143px，375 寬 11vw），說明句、聯絡業務按鈕緊接在 h1 下方；h1 在首次繪製就完整可讀 | P1 |
| hero 的老圖放在 h1 下方、傾斜 3 度、被畫面底邊裁掉，不壓在任何文字上；換掉它第一屏的意思不變 | P1、P3 |
| 產業段開頭一排不等寬的平塗海報，每張喊出一條法規或一個舊系統的名稱（開放銀行、金融檢查、共通性 API 規範、通訊機制），下方小字是事實原文；電報機的老照片剪下貼在「通訊機制」海報上 | P3、P2 |
| 產業段的頁籤加色帶：左欄短標、右欄事實原文，原文下方一行出處；金融與政府各三列 | P2、P5 |
| 三則案例各一張大圖（場域：醫院病房、帳簿、銀行大廳）加一個 HTML 介面片段，再接「作業 → 成果原文 → 連結」 | P2、P3 |
| 產品家族做成一塊色塊拼板，每塊放大一個介面元件並被邊緣裁切，標籤只用事實裡的詞；依要解決的問題排 | P3、P5 |
| AI 導入的同一張卡片在四個色塊裡往前走，四個階段照 `fact:systalk-ai-onboarding` 的片段，旁邊寫明是 SysTalk.ai 的 AI 導入 | P3、P4 |
| 穩定度段：城市照片加台北總部地址、珊瑚紅色塊上程式畫的台灣輪廓與五個據點、六組年份或項目加原文，年份用 tabular-nums | P2 |
| 色彩只有 sheet 的五個平塗色加品牌紫；紫只用在 logo 與聯絡業務按鈕，按鈕只放在骨白或黃底 | P4 |
| 頁尾整片黃色，「從既有系統談起」加聯絡業務，最底下的 TPIsoftware 字被畫面裁掉 | P4、P5 |

## 與 sheet 不同的調整

sheet「照本站規則的調整」之外，製作時另做的調整：

1. **字型**：Panchang、Switzer 都是 Fontshare 字型，npm 沒有。改用 `@fontsource-variable/archivo` 的 latin `wdth` 檔（寬度 62–125%、字重 100–900）一個檔案做兩件事：標題用寬度 125%、字重 900（代替 Panchang），內文用寬度 100%（代替 Switzer）。inspector 因此回報 `font-not-dealt`（WARN）。中文用系統字，粗體是瀏覽器合成的
2. **signature move 移出 h1**（P1）：「Masked headline」原本讓 h1 逐行從基線升起，會延後 h1 出現。改成 h1 靜止、首次繪製就完整；同樣的遮罩升起用在 hero 的老圖（從 h1 基線下方升起，900ms）與每段的 h2（捲到時一次）。h1 與說明句、按鈕都不做進場動畫，所以 LCP 不受動畫延後
3. **hero 的說明句與事實**：blueprint 把說明句放在第一屏左下、離底邊 32px。copy-deck 與 P1 要說明句緊接在 h1 下方，所以說明句、按鈕與右側的事實都改成在 h1 下方 36px 起排
4. **圖片改用博物館的老圖**：sheet 建議的 IBM System/360、打孔卡、日文診斷書、台北天際線都在 Wikimedia Commons，本次 session 從共用的對外 IP 一直收到 HTTP 429（以及 Openverse 逾時），約 40 分鐘內一張都沒下載成功。改用 The Met 與芝加哥藝術博物館的 CC0 館藏（見「圖片出處」）。因此：
   - hero 是 1876 年石版畫的蒸汽印刷機局部，不是大型主機
   - 原本「大型主機」那張海報改成「通訊機制」，配 1840 年代電報機，下方原文是 `fact:digilism-protocol-integration` 的片段「…處理核心銀行系統或過時大型機的資料轉換及通訊機制變更…」
   - 穩定度段的城市照片是約 1868 年的台灣山徑，不是台北。這張最弱，建議換成台北或內湖的照片（`openverse:080ae365-7685-44f7-aea1-0469571f3e61`「Taipei, Taiwan CBD Skyline」，CC BY-SA 4.0，已在搜尋結果裡，網路恢復後 `--get` 即可）
5. **案例大圖不出血**：blueprint 要大圖超出左側頁緣、放大 120%。inspector 的版面量測不計超出畫面的圖，會把這三段判為 `lopsided`（FAIL），所以大圖收在左右邊距內、不放大。三張案例圖也不旋轉，旋轉只留給 hero 與電報機兩張
6. **回函卡不旋轉**：blueprint 要卡片轉 2 度，direction 規定旋轉只用在圖片、不用在文字塊，照 direction。卡片仍被段落底邊裁掉
7. **OrientAI 的標題不換詞**：sheet 要切換時換標題裡的一個詞。能換的詞（「外部的環境」之類）都會變成 messaging 與事實庫沒有的主張，所以標題固定，換的是開關的值（開／關）、底色與引用的原文
8. **進場動畫的起點是淡色而不是隱形**：`[data-reveal]` 從 opacity 0.25、下移 28px 開始。script 沒跑或捲動跳過時內容仍看得到（inspector 只走前 11 屏，完全隱形的起點在長頁面上會被判為空白）
9. **圖片不用 `loading="lazy"`**：整頁截圖時延後載入的圖不會出現。正式頁面應恢復
10. **產品拼板的邊距**：blueprint 的 10px 外側邊距改成全頁共用的 24px（手機 16px），維持左右相等的邊距
11. **產品節點名稱**：拼板放不下 18 個產品的完整節點名稱，總覽塊只列產品短名，完整節點名稱連結留給製作階段

## 與現有限制的差異

| 項目 | 現有限制 | 這個原型 | 量測方式 |
|---|---|---|---|
| 字型檔 | Inter、JetBrains Mono 的 latin 等 subset | Archivo variable latin 一個檔，90,104 bytes（88 KB）；不載中文 webfont | `ls -l assets/*.woff2` |
| JS | 每頁初始 6 KB（gzip） | inline 2,409 bytes，gzip 1,213 bytes（頁籤、開關、進場），不用 GSAP | 取出 `<script>` 內容後 gzip |
| CSS | — | inline 28,391 bytes，gzip 6,536 bytes | 同上 |
| 3D | 首頁 hero 有 3D，靜態圖是 LCP | 沒有 3D，省下延後載入的 JS；接點改用介面片段與老圖表達 | — |
| 色彩 token | 品牌三色、橘 500 只當裝飾 | 換成 sheet 的五個平塗色（`#e6e0d2`、`#dcd5c5`、`#1a1a1a`、`#ed4b44`、`#18bc42`、`#f2c21a`）加品牌紫 `#662e8d`；要新增 token | — |
| 影像規範 | `src/assets/design/` 的 3D 渲染與影像提示詞 | 六張開放館藏的老圖（共約 1.5 MB JPEG，最大 566 KB），全部是 CC0；hero 老圖傾斜 3 度 | `du -ch assets/*.jpg` |

品牌紫按鈕的對比：紫對骨白底 6.82:1、對黃底 5.34:1，白字對紫 9 以上。紫對黑底 1.94:1、對珊瑚紅 2.43:1，所以聯絡業務按鈕只放在 header 與 hero（黃）、回函卡（骨白）、頁尾（黃）。黑底與珊瑚紅段落裡的次要按鈕用黑底骨白字（「看金融業方案」）。inspector 加 `--allow palette-purple`。

## Inspector

`CHROME_PATH=$PWD/scripts/strategy/chromium.sh node .claude/skills/taste-skill/scripts/inspect.mjs docs/strategy/concepts/loud-flat-poster/index.html --out .taste-skill/loud-flat-poster/inspect --allow palette-purple`

最終結果：**0 FAIL、3 WARN**（1440、768、390）。字級 14／19／26／36／64／161／374 px，內文 19px。

| WARN | 保留理由 |
|---|---|
| `card-rows`：3 列相同的框 | 是 blueprint 本身：同一張 AI 導入卡片在四個色塊裡重複（how-it-works），以及三則案例各一個同款介面片段。重複是為了讓人看出同一張卡在往前走 |
| `no-footage`：沒有影片 | Internet Archive 連不上，Wikimedia 429；也沒找到誠實對應的片段。主要的動態圖是穩定度照片的緩慢平移 |
| `font-not-dealt`：用 Archivo 不是 Panchang／Switzer | 見調整第 1 項，npm 上沒有這兩個字型 |

`node scripts/strategy/concept-shots.mjs --only loud-flat-poster`：exit 0（`file://` 開啟，沒有外部請求、缺檔、console error，375 與 1280 都沒有橫向溢出）。

## 評語（第三輪，`references/critique.md` §4）

```
ROUND 3
Seen in one second: 整片黃色海報上兩行巨大的「金融與政府的系統／接上 API 與 AI」，下面一張歪貼的老印刷機。
Idea (one sentence): 法規名稱與舊系統成為平塗海報，老機器、老文件的圖剪貼上去。
Live thing: OrientAI 的「離線運行」大開關，切換底色與引用的原文。
Layout words by section: hero=滿版喊話加升起的老圖 / 產業=不等寬海報列加頁籤色帶 / 案例=大圖加小叢集 / 產品=色塊拼板的介面特寫 / OrientAI=被裁切的巨大開關 / 導入=四色帶同一張卡 / 穩定度=照片加色塊地圖加紀錄 / 聯絡=被裁切的回函卡 / 頁尾=邀請加裁切的名字
Scores: design 7.5 · usability 8 · creativity 7.5 · content 7 → overall 7.6.
Caps applied: 無（0 FAIL、四張以上真實圖片、有可操作的一件事）。
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. 穩定度段的台灣山徑照片和「台北總部」地址放在一起，讀起來不像公司所在的城市（shot-1280.jpg 下段）。修法：網路恢復後換台北天際線照片（調整第 4 項）。
2. hero 的老圖是蒸汽印刷機，不是 idea 句說的大型主機；1280 第一屏圖只佔約 22%，左下與右下的黃色留白偏大（shot-1280-first.png）。修法：換 IBM System/360 操作台照片（commons:79431969），並把圖再放大到第 4–10 欄。
3. 中文標題只有系統字的合成粗體，和 Archivo 900 寬體的拉丁字母重量不一致，「接上 API 與 AI」一行裡中英粗細落差明顯（shot-1280-first.png）。修法：放寬中文 webfont（例如 Noto Sans TC Black 的子集），代價是字型檔大小，交人決定。
```

前兩輪修過的問題：海報「金融檢查」斷行、案例大圖出血造成的 `lopsided`、手機穩定度段溢出、tablet 產品拼板過高、導入四色帶在手機上的空白、OrientAI 開關的值被裁掉、台灣輪廓過於粗糙、聯絡段上方空白過大、頁尾出處小字拉低內文字級。

## 圖片出處

`node .claude/skills/taste-skill/scripts/assets.mjs --credits --to docs/strategy/concepts/loud-flat-poster/assets` 的輸出（`progress-century.jpg`、`the-bank.jpg`、`met-ledger.jpg`、`hospital-armory.jpg` 是裁切過的局部）。頁尾 `.legal` 也有同樣的出處。圖片只呈現產業與場域，不代表昕力的產品、客戶、辦公室或人物。

- `assets/progress-century.jpg`（hero）："The Progress of the Century – The Lightning Steam Press. The Electric Telegraph. The Locomotive. The Steamboat." by Currier & Ives, 1876, public domain (CC0), via The Metropolitan Museum of Art. https://www.metmuseum.org/art/collection/search/659890
- `assets/telegraph.jpg`（產業段「通訊機制」海報）："Telegraph Instrument", ca. 1837–44, public domain (CC0), via The Metropolitan Museum of Art. https://www.metmuseum.org/art/collection/search/8484
- `assets/hospital-armory.jpg`（案例：AI 智慧理賠）："Armory Square Hospital, Washington", 1863–65, public domain (CC0), via The Metropolitan Museum of Art. https://www.metmuseum.org/art/collection/search/268109
- `assets/met-ledger.jpg`（案例：AI 智慧建檔）："Account Book Ledger" by John Carlin, 1835–56, public domain (CC0), via The Metropolitan Museum of Art. https://www.metmuseum.org/art/collection/search/20365
- `assets/the-bank.jpg`（案例：金融聯防阻詐平台）："The Bank" by Thomas Rowlandson, January 1792, public domain (CC0), via The Metropolitan Museum of Art. https://www.metmuseum.org/art/collection/search/811056
- `assets/formosa-pass.jpg`（穩定度段）："A Mountain Pass in Formosa" by John Thomson, c. 1868, public domain (CC0), via Art Institute of Chicago. https://www.artic.edu/artworks/236402

其他檔案：`assets/archivo-latin-wdth-normal.woff2` 與 `assets/archivo-LICENSE.txt`（SIL Open Font License 1.1，來自 `@fontsource-variable/archivo` 5.3.0）；`assets/logo-horizontal-color.svg`、`assets/logo-horizontal-white.svg` 複製自 `src/assets/brand/`。

## 介面片段（`data-ui`）哪些是示意

所有片段的版面都是原型畫的，不是產品的真實畫面；每個片段的標題列或 `aria-label` 標「示意」。

| 位置 | 片段 | 用到的詞與來源 |
|---|---|---|
| 案例：AI 智慧理賠 | 三步驟作業清單 | 理賠立案、解析診斷書、派件（`fact:smartclaim-result`）；「自動」「處理中」是示意狀態 |
| 案例：AI 智慧建檔 | 三步驟作業清單 | 醫療單據、免模板辨識、格式變動、建檔（`fact:smartfilling-result`）；「辨識中」「待處理」是示意狀態 |
| 案例：金融聯防阻詐平台 | 三步驟作業清單 | 詐騙事件、即時共享、跨行交換、聯防流程、標準化（`fact:fraud-platform-result`）；「進行中」是示意狀態 |
| 產品拼板 | 路由清單、開關、狀態字、模型選單、按鍵、分段切換 | AI Gateway、MCP、AI 模型、企業 API、資料、業務流程（`fact:digilism-family-digirunner`）；無密碼（`fact:gadodido-passwordless`）；異常（`fact:gadoscout-ml-detection`）；開源 LLM、70B 模型、企業級 LLM（`fact:aiso-llm-support`）；碳盤查、CBAM、碳足跡（`fact:greenswift-scope`）；核心銀行系統、DigiLism、ESB（`fact:digilism-protocol-integration`）。「串接」標籤與選取狀態是示意 |
| OrientAI 開關 | 「離線運行 開／關」 | 「離線運行」取自 `fact:orientai-aidaptiv`；開關本身是示意 |
| 導入四色帶 | AI 導入卡片 | 四個階段照 `fact:systalk-ai-onboarding` 的片段；勾選進度是示意 |

## 待補與待確認

| # | 事項 | 位置 |
|---|---|---|
| 1 | 聯絡後多久回覆（頁面寫「回覆時間：待補」） | 聯絡段 |
| 2 | 六項服務各一句說明（頁面寫「說明待補」） | 導入段 |
| 3 | 導入四色帶下方的子句「先做／再提出／接著做／導入中做」是本原型加的表述，事實片段字不改，要人審 | 導入段 |
| 4 | 產業段海報上的短標（開放銀行、金融檢查、共通性 API 規範、通訊機制）是表述，下方小字是原文或原文片段（「…」表示截取） | 產業段 |
| 5 | 換回 sheet 原本要的照片：IBM System/360 操作台（hero）、打孔卡或 System/360 面板（海報）、日文診斷書（理賠案例）、台北天際線（穩定度）。都在 Wikimedia Commons，這次 429 下載不到 | 全頁 |
| 6 | 要不要放寬中文 webfont（標題的中文粗細與 Archivo 900 不一致） | 全頁 |
| 7 | copy-deck「待補與待確認」第 3–6 項（證言、第 2 段多的四條事實、h1 長度、金融與政府的排序）照 copy-deck，這裡沒有另做決定 | — |
