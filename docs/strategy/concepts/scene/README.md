# 方向 scene：場景上的層

延續 M3 選定的方向 B Modular Stack，改的是內容與構圖，不是材質。深色 surface、玻璃卡片、系統中文字都照現有設計系統。改變的地方：hero 的疊層靜態圖加上 HTML 標籤，由下而上寫「既有系統、digiRunner API 管理平台、AI Gateway、新的服務」，讓疊層讀得出「接進既有系統」，不再只是發光物件（P1、P3）；文字放在影像讓出的左側，產業名稱直接出現在 hero。這個方向最接近現在的網站，改版成本最低，也最像同業的深色科技物件。

- 原型：`index.html`（從 `file://` 直接打開，不連外部網址）
- 截圖：`shot-375.png`、`shot-375-first.png`、`shot-1280.jpg`（整頁 PNG 超過 1 MB，script 改存 JPEG）、`shot-1280-first.png`

## 主要視覺決定

| 面向 | 決定 | 原則 |
|---|---|---|
| 版面 | hero 左文右圖：文字佔左側 30rem，影像在右側 64% 寬，兩者不重疊。h1、說明、兩個按鈕、「產業：金融／政府與公部門」標籤都在第一屏 | P1 |
| 版面 | 產業兩張大卡片緊接在 hero 後；案例三張卡片；產品家族四欄索引；穩定度 3×2 紀錄格。各段卡片的大小與密度不同，不是同一種格子重複 | P5 |
| 字體 | 照現有：中文系統字、拉丁字 Inter、資料標籤與年份用 JetBrains Mono。h1 用比 `--font-size-h1` 小一級的上限（3.5rem），讓「安全接進既有系統」在 1280 寬不斷行 | P1 |
| 色彩 | 全頁深色 surface（`[data-surface="dark"]` 的值），能量漸層只畫在卡片上緣 2px 與 hover 光暈，按鈕用 purple-300。事實標記是橘 400 左線 | P4 |
| 影像 | hero 用 `hero-modular-stack.webp`（375 寬用 `-mobile`），四層各加一個 HTML 標籤，標籤以橘線指向該層。影像本身不改，文字不壓在影像上 | P3、P1 |
| 影像 | 產品家族各有一個小的等角模組 icon；OrientAI 段用 CSS 偽 3D 的三層平面（Agent 與權限、Token 用量、企業端的資料），對應 production 的 `LayerStack` | P3 |
| 動態 | 按鈕 hover 上浮（`--lift`）；OrientAI 的三層平面隨捲動從疊在一起分開（CSS scroll-driven animation，不用 JS）。減少動態時不上浮，平面直接停在分開的完成狀態 | P4 |
| 證據呈現 | 案例卡片：作業標籤、案例名、成果原文、連結；事實晶片：橘線＋標籤＋原文。穩定度用 3×2 的玻璃格，年份或項目用 mono 大字、底下是原文 | P2 |
| 375 寬的重排 | 文字先、影像後：hero 文字與產業標籤在上，疊層圖裁成一條 1122:600 的橫帶放在按鈕下方，四個層標籤改成靠左；產業卡片改成上下兩張；案例、產品、紀錄改成單欄；聯絡改成 sticky 的底部列。第一則案例在 1580 px 開始（兩次捲動 = 1624 px 內） | P1、P5 |

## 與另外兩個方向的差異

| 面向 | scene | ledger | switchboard |
|---|---|---|---|
| 版面 | 深色場景上的玻璃卡片，hero 左文右圖 | 編號欄＋主欄＋頁邊註記 | 超大 h1 加產業切換，全寬接點圖，左側固定目錄 |
| 字體 | 系統中文字（照現有） | 標題 Noto Serif TC | 全部 Noto Sans TC，標題 900 |
| 影像 | 3D 靜態圖加層標籤、CSS 偽 3D | 無影像，一張編號圖解 | 圖解是主要影像，出現在 hero、產品、OrientAI |
| 色彩 | 全頁深色 | 白紙、墨色 | 白、深色帶、淺灰三組底色 |
| 動態 | 按鈕上浮、圖層分開（production 另有 3D 捲動場景） | 無 | 接線隨捲動畫出 |
| 客戶證言 | 不放（第 7 段維持緊湊的六格紀錄，證言留給金融產業頁） | 頁邊註記放全文 | 第 7 段開頭的大字引言 |
| 固定聯絡入口 | 1280 寬：sticky header 的按鈕；375 寬：sticky 底部列「想談需求或預約 demo／聯絡業務」，放在頁面最後，不蓋住頁尾 | sticky header（375 寬收進選單） | 左側目錄底部的按鈕 |

## 放寬的限制

| 限制 | 處理 |
|---|---|
| 中文 webfont | 照現有：不載中文 webfont。woff2 只有 Inter 與 JetBrains Mono 的 latin 切片，共 87 KB |
| JS 預算（初始 6 KB／延後 140 KB gzip） | 照現有。原型沒有 `<script>`；production 保留 `Scene3D`，延後載入的 runtime 約 130 KB gzip（ADR 0003），在預算內 |
| 3D | 照現有，保留。原型用靜態圖代表 production 的首頁場景：`Scene3D`＋`src/lib/scene/modular-stack.ts`（方向 B Modular Stack），hero 的 LCP 是同一張 `Backdrop`（`hero-modular-stack.webp`）。OrientAI 的平面對應 `LayerStack`。新增的只有 HTML 層標籤：3D 場景在捲動時會拆解方塊，標籤要在場景 ready 後跟著淡出或只在 hero 的靜態構圖顯示，這部分要在製作階段用 `scene-capture.mjs` 與 `a11y-smoke.mjs` 驗證 |
| 色彩 token | 照現有：只用 `[data-surface="dark"]` 的語意值與現有的 `--gradient-energy`、`--glow-brand` |
| 影像規範 | 大致照現有：影像本身仍是不含文字的抽象 3D 渲染。放寬的部分是「影像上疊 HTML 標籤」：標籤是文字，可被讀取與翻譯，不在圖裡。代價是三語的標籤長度不同（en、vi 會更長），375 寬要重新確認不蓋到疊層 |

量測（本機，Lighthouse 行動版網路條件：150 ms RTT、1.6 Mbps、CPU 4 倍降速，3 次取中位數）：FCP 308 ms、LCP 528 ms（375 寬的 hero 圖，113 KB），woff2 共 87 KB。

## 原型與 production 的差距

- 沒有 three.js：hero 只有靜態圖，看不到捲動時方塊拆解、重組的效果
- 層標籤的位置是對靜態圖寫死的百分比；3D 場景的取景由 runtime 依 `data-hero-visual` 計算（ADR 0003「窄螢幕的取景」），標籤要改成跟著取景或只用在靜態狀態
- 連結都是 `#`；沒有 mega menu、語系切換、搜尋；375 寬的「選單」只跳到頁尾導覽
- 樣式直接寫 token 的原始值，production 改用語意 token 與 `data-surface="dark"`
- 事實手打進 HTML 並去掉 U+200B；production 用 `fact('<id>')`
- 系統字在截圖環境是 WenQuanYi Zen Hei，不是 PingFang TC 或微軟正黑體
- 對比用 axe-core（WCAG 2.1 AA）在 375、1280 寬檢查過，沒有違規；axe 不量壓在影像上的文字，hero 層標籤的對比要用 `a11y-smoke.mjs` 量

## 待補

- 第 8 段：聯絡後多久回覆（`briefs/home.md`「待確認」第 4 項），頁面上標了「待補」
- 第 6 段的服務只有名稱，沒有說明句
- 375 寬底部列的文字「想談需求或預約 demo」是新加的表述，要由人審
- 第 1 段 `fact:company-industries` 提到製造生產等其他產業，畫面上沒有引用（同 ledger）
