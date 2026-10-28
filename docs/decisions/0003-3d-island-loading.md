# 0003. 3D island 的載入策略

- 狀態：已採用
- 日期：2026-10-21
- issue：#54（M3-07）

## 背景

M3-02 把敘事頁定為深色場景，hero 底下要有隨捲動變化的 3D 場景（`design-system` skill「設計方向」）。M3-07 用 three.js 做了兩個方向的原型：A Data Flow（光點與光束的網路）與 B Modular Stack（等角視角的方塊隨捲動拆解、翻轉、重組）。人工選定 B，A 的頁面與場景已刪除。M3-04（#17）把 B 做成首頁 `/`，原型頁 `/prototypes/modular-stack` 已刪除。

three.js 是本站第一個大型 client 依賴。ADR 0001 定了「預設零 client JS，互動才用 island」，Lighthouse 關卡要求 performance ≥ 0.95。實測 `npm run build` 的輸出：

| chunk | 內容 | 大小（gzip） |
|---|---|---|
| `Scene3D.astro_astro_type_script_*.js` | 判斷條件、延後載入 | 1.5 KB |
| `runtime.*.js` | `src/lib/scene/runtime.ts`＋three.js | 130 KB（未壓縮 528 KB） |
| `modular-stack.*.js` | 方向 B 的場景 | 1.9 KB |

## 決策

3D 場景是裝飾性的 island，頁面在沒有它時內容完整。

1. **靜態圖是 LCP 與完整的替代版本**：hero 的 `Backdrop`（`priority`）先顯示，3D 只疊在上面，不取代 HTML 內容。靜態圖與 3D 用同一個視角：three.js 相機從 `--scene-angle-x`、`--scene-angle-z` 換算仰角與方位角，從 `--perspective` 換算視角（FOV），主體位置對齊 `Backdrop fade="hero"` 的構圖
2. **首屏之後才載入**：`Scene3D` 的 loader 依序等 `load` 事件、hero 靜態圖 `decode()` 完成後的兩個 animation frame 與它的 LCP entry（圖已經畫上畫面，見「載入時序的修正」）、`requestIdleCallback`（最多 2 秒），才 `import()` runtime 與場景模組。three.js 只在這個 chunk 裡，不在任何頁面的初始 JS。只等 `load` 不夠：桌機實測 `load` 在 151 ms、chunk 在 200 ms 請求，LCP 卻在 208 ms 才畫出
3. **不載入的條件**：`prefers-reduced-motion: reduce`、`navigator.connection.saveData`、瀏覽器不支援 WebGL 2（three.js r163 起只支援 WebGL 2）。執行中切換成減少動態時，停止場景、移除 canvas，回到靜態圖
4. **初始化拆成多個 task**：見「初始化的長任務（#127）」
5. **第一個 frame 畫完才淡入**：track 加上 `data-scene="ready"` 後 canvas 淡入（`--duration-slow`），靜態圖不做任何動畫
6. **不在畫面上就不畫**：IntersectionObserver 在 track 離開畫面時停止 `requestAnimationFrame`，分頁隱藏（`visibilitychange`）時也停止
7. **行動版降級**：`(width < 64rem), (pointer: coarse)` 用 `TIERS.mobile`，在場景啟動時決定；視窗縮放讓這個條件改變時，`Scene3D` 等 200 ms 後重建場景（見「產品頁（M3-05）」）。構圖（主體偏右或偏上）只看寬度 `(width < 64rem)`，和 CSS 的 `--bp-lg-down` 一致，視窗縮放跨過斷點時跟著改；橫向平板是桌機構圖、行動版預算。行動版降低 `devicePixelRatio` 上限與方塊數量、關掉 antialias 與滑鼠視差、鏡頭只沿一個方向移動，數值只寫在 `src/lib/scene/tiers.ts` 的 `TIERS`

8. **3D 上的文字要能讀**：canvas 上蓋一層和 `Backdrop fade="hero"` 相同的 scrim，文字側維持 `--color-bg`；chapter 的文字放在玻璃面板（`--glass-bg`）上
9. **量測**：`npm run check` 的 LHCI 測 `lighthouserc.cjs` 的 `PAGES`（ADR 0004），3D 頁面的 performance 與其他頁面一樣是 `error`（#127）；它不檢查 3D 的載入時序與 3D 上的文字。改到 `Scene3D`、`src/lib/scene/` 或原型頁後，跑以下 script
   - `node scripts/design/lighthouse-3d.mjs`：performance 與 3D chunk 的長任務，並檢查 LCP 元素是靜態圖、3D chunk 的請求時間晚於實測 LCP 與 `load`，不符合時 exit 1
   - `node scripts/design/a11y-smoke.mjs /`：不開減少動態、等場景畫出第一個 frame，在 track 的 0／25／50／75／100% 量 track 內每行文字和背後最不利像素的對比（375×800、1280×860）
   - `node scripts/design/scene-capture.mjs <dir>`：減少動態時沒有 canvas、沒有 3D chunk 請求；場景執行中切到減少動態時 canvas 被移除
   - `node scripts/design/scene-wait.mjs`（在 `npm run check` 裡）：fence 一直不完成、shader 一直不 ready 時，canvas 仍在上限內上頁（見「等待的上限」）

## 與「預設零 client JS」的關係

ADR 0001 的原則不變：頁面預設沒有 client JS。3D 場景是明確選擇的 island，條件是：

- 只放在敘事頁的 hero 與緊接在後的章節。M3-04 起用在首頁；M3-05（#18）決定產品頁也用，但只放 hero 與功能章節，其餘區塊用 CSS（`LayerStack`、`Surface pattern="grid"`）
- 沒有它頁面內容完整，關掉它的條件由使用者偏好與裝置決定
- 初始載入只多 1.5 KB 的 loader，three.js 不影響 FCP 與 LCP

不用 Astro 的 `client:idle`／`client:visible`：那是 UI framework 元件的 hydration 指令，本站不用 UI framework。`<script>` 加動態 `import()` 可以自己控制「靜態圖畫出之後、閒置時、條件成立才載入」。

## 結果

`node scripts/design/lighthouse-3d.mjs`（2026-10-21，commit `9a130f1`，雲端 session，Lighthouse 12.6.1，3 次取中位數）：

| 頁面 | 行動版 | 桌機 |
|---|---|---|
| `/prototypes/modular-stack` | 0.99（TBT 73 ms） | 1（TBT 0 ms） |

LCP 都是 hero 靜態圖，3D chunk 在實測 LCP 與 `load` 之後請求。同一頁的 SEO、accessibility、best-practices 在行動版與桌機都是 1。headless Chromium 用 SwiftShader 軟體算圖，TBT 偏高；真機待 preview 部署後量測。

`a11y-smoke.mjs` 的 3D 文字對比 10 個量測點都通過。拿掉 scrim 與面板玻璃再量，375×800 的 25% 位置與 1280×860 的 100% 位置會失敗（例如 eyebrow 1.14:1），確認這項檢查量得到場景的影響。

## 產品頁（M3-05）

- `Scene3D` 加上 `family`（0–3，順序在 `src/lib/scene/families.ts`），場景只畫該家族的一個模組：hero 顯示完整的模組，第一章拆開、翻轉後重組，之後持續播放該家族的動態，每一章點亮一組對角的方塊並往外推。組數等於 track 裡 `SceneChapter`（`data-scene-chapter`）的數量
- 載入策略、降級、減少動態的規則與首頁相同；three.js chunk 由兩頁共用，換頁時從快取讀取
- `scene-capture.mjs` 的 `PATHS` 加上 `/products/digirunner`，`lighthouse-3d.mjs` 一併量測

`node scripts/design/lighthouse-3d.mjs / /products/digirunner`（2026-10-22，雲端 session，3 次取中位數）：

| 頁面 | 行動版 | 桌機 |
|---|---|---|
| `/` | 0.97（TBT 93 ms） | 1（TBT 26 ms） |
| `/products/digirunner` | 0.98（TBT 90 ms） | 1（TBT 18 ms） |

兩頁的 LCP 都是 hero 靜態圖，3D chunk 在實測 LCP 與 `load` 之後請求。`a11y-smoke.mjs /products/digirunner` 的 3D 文字對比 10 個量測點都通過。

### 窄螢幕的取景

審核時量到三個問題（PR #96，head `20b5f04`）：麵包屑跟著文字被推到 hero 中段；768 寬的 CTA 在第一屏外；3D 方塊被頁內導覽列蓋住。原因是窄螢幕的構圖寫死成比例：文字從 `62vw` 開始，場景中心往上移 0.3 × 畫布高度，兩者都不知道 hero 上方還有哪些列。

- 窄螢幕的 hero 由上而下是「麵包屑 → 視覺區 → 文字」。視覺區是 `PageHero` 輸出的空元素 `data-hero-visual`，高 `--space-section` ＋ `--hero-narrow-offset`（`min(62vw, 22rem)`，上限讓 768 寬的 CTA 留在第一屏）
- 靜態圖寬度也加上同比例的上限（`--hero-narrow-image-max`），有麵包屑時往下移一列（`--hero-image-drop`），主體中心落在視覺區中央。麵包屑在窄螢幕固定一列（目前頁只給螢幕閱讀器讀，h1 就在下面），列高才能先算進 CSS
- runtime 在每次 resize 量視覺區（捲動位置 0 時、換算成畫布座標），場景中心放在視覺區中央，隨頁面捲動一起往上，視覺區捲出畫面時漸漸改回章節的構圖（`FOCUS_SHIFT.narrow`）。鏡頭距離由 `SceneContext.fitDistance()` 算出，讓 hero 的方塊佔視覺區高度的 80%。runtime 不寫 header 或頁內導覽列的高度
- 首頁沒有麵包屑，視覺區從 hero 頂端開始，375 與 1280 寬的靜態版面與改動前逐像素相同；768 寬因為上限變短 124 px。首頁的窄螢幕 3D 方塊塔改由 `fitDistance` 決定大小，和改動前不同
- tier（方塊數、運鏡、DPR）在場景啟動時決定。視窗縮放跨過 `LOW_POWER` 時，`Scene3D` 等 200 ms 後 `mount()` 新的場景，新 canvas 畫出第一個 frame 時才停掉舊的（#127 起 mount 分成多個 task，先停舊的會空白約 0.2 秒）；重建期間 `data-scene` 保持 `ready`，靜態圖不會閃出來。`pointer: coarse` 的裝置不因寬度改變換 tier。`scene-capture.mjs` 加上 mobile → desktop、desktop → mobile 兩個情境，檢查 `data-scene-tier`，以及重建期間 host 一直有 canvas

改動後重量（與本節同一個 commit）：`lighthouse-3d.mjs` 的 `/` 行動版第一輪 0.95（其中一次 0.78，TBT 170 ms），重跑 0.97；桌機 1。`/products/digirunner` 行動版 0.97、桌機 1。LCP 仍是 hero 靜態圖。

## 初始化的長任務（#127）

#87 的全站量測中，載入 3D 的 59 頁是唯一沒達到 performance 0.95 的頁面（最低 0.89），扣分來自 TBT 230–410 ms。3D 在 LCP 之後才載入，但初始化的長任務仍落在 TBT 的量測範圍內。

### 原因

不節流的 Chrome trace（headless Chromium，412×823、DPR 1.75，main `ba55e0c`）中，3D 啟動時的主執行緒 task：

| task | 時間 | 內容 |
|---|---|---|
| WebGL 偵測（`requestIdleCallback`） | 15 ms | 建立一個 context，只用來判斷，之後丟掉 |
| runtime 的 `import()` 完成後 | 23 ms | `WebGLRenderer` 建立第二個 context 並初始化 |
| 同上（`setTimeout`） | 17 ms | 場景建構、量尺寸 |
| 第一個 frame | 58 ms | JS 12 ms，`Commit` 中的 `GLES2::ReadPixels` 44 ms |

headless Chromium 用軟體合成，compositor 每個 frame 都把 canvas 讀回主執行緒。第一次 draw 時 SwiftShader 才把 shader 編成機器碼，讀回要等它完成，所以第一個 frame 的 task 特別長。Lighthouse 行動版的模擬把主執行緒的 task 時間乘 4，58 ms 變成約 250 ms 的長任務。

### 決策

畫面、tier、載入條件都不變，只改初始化的順序與 task 的切法（`src/lib/scene/runtime.ts` 的 `mount`、`src/lib/scene/tiers.ts`）：

1. **每一步各自一個 task**：建立 renderer、建構場景、編譯 shader、第一個 frame 之間用 `setTimeout(0)` 讓出主執行緒。`mount()` 仍同步回傳 stop，啟動途中呼叫也會停止並釋放資源
2. **canvas 上頁面前先畫完第一個 frame**：`renderer.compileAsync()` 之後在還沒加進 DOM 的 canvas 上畫一個 frame，用 WebGL 2 的 fence（`fenceSync`，每個 task 檢查一次）等 GPU 做完，才把 canvas 加到 host。不在頁面上的 canvas 不會被 compositor 讀回，等 shader 的時間不在主執行緒上
3. **只建立一個 context**：`Scene3D` 偵測 WebGL 2 時用 `createSurface(tier)` 建立 canvas 與 context，屬性和 `WebGLRenderer` 自己建立 context 時相同（three r186），第一次 mount 直接交給 renderer。tier 已經不同（下載 three.js 期間跨過 `LOW_POWER`）或 tier 切換重建時，runtime 自己建立新的 context（antialias 依 tier 不同）

真機的 GPU 合成不會每個 frame 讀回 canvas，這三項在真機上的效果比在雲端小；shader 編譯不擋主執行緒、少建一個 context 仍然有效。

### 結果

改後同一個 trace 的 3D task：WebGL 偵測 14 ms、`WebGLRenderer` 初始化 22 ms、場景建構與 shader 16 ms、第一個 frame 14 ms。`WebGLRenderer` 的初始化（擴充功能、capabilities、GL 狀態）沒辦法再拆。

`node scripts/design/lighthouse-3d.mjs`（雲端 session，3 次取中位數。`scripts/lib/static-server.mjs` 在本 issue 加上 gzip，和 LHCI 的 server 一樣；之前沒壓縮，行動版 FCP 多約 0.6 s，main 的數字是沒壓縮時量的）：

| 頁面 | main 行動版 | 改後行動版 | 改後桌機 |
|---|---|---|---|
| `/` | 0.94（TBT 151 ms） | 0.99（TBT 29 ms） | 1 |
| `/products/systalk-chat` | 0.93（TBT 141 ms） | 0.98（TBT 6 ms） | 1 |
| `/solutions/smartfilling` | – | 0.98（TBT 22 ms） | 1 |
| `/vi` | – | 0.98（TBT 34 ms） | 1 |

LCP 都是 hero 靜態圖，3D chunk 都在實測 LCP 與 `load` 之後請求。

`npm run lighthouse:all`（485 頁各 1 次，97 分鐘）：全部頁面 performance ≥ 0.95，載入 3D 的 60 頁 0.97–0.99、TBT 中位數 22 ms（最高 90 ms）。`lighthouserc.cjs` 拿掉 3D 頁的 `warn` 例外（ADR 0004）。

### 等待的上限（#136）

決策 2 的兩個等待原本沒有上限：`gpuDone` 每個 task 查一次 fence，`renderer.compileAsync()` 每 10 ms 查一次 shader 是否 ready（`KHR_parallel_shader_compile`），都直到完成為止。driver 一直不回報完成時，canvas 永遠不會上頁。`src/lib/scene/runtime.ts` 的 `WAIT_LIMIT_MS` 讓兩者各最多等 1 秒，超過就照常畫第一個 frame、把 canvas 放上頁面；`compileAsync` 超時後 three.js 仍會繼續查，那是每 10 ms 一個很短的 task，不處理。

這不是 quality-gate 卡住的原因（ADR 0004「卡住的量測與時間上限」）：讓 fence 永遠不完成、shader 永遠不 ready，Lighthouse 仍在 7 秒內正常結束；headless Chromium 也不支援 `KHR_parallel_shader_compile`，three.js 一開始就把 shader 當成 ready。上限是給真機上有問題的 driver 用的。

`node scripts/design/scene-wait.mjs` 用 `evaluateOnNewDocument` 模擬兩種情況，量 3D chunk 下載完到 track 加上 `data-scene="ready"` 的時間（雲端 session，`/products/systalk-chat`，390×844）：

| 情況 | 沒有上限 | 有上限 |
|---|---|---|
| 一般 | 134 ms | 156–211 ms |
| fence 一直不完成 | 20 秒內沒有上頁 | 1101–1107 ms |
| shader 一直不 ready | 20 秒內沒有上頁 | 1126–1130 ms |

`node scripts/design/lighthouse-3d.mjs / /products/systalk-chat /solutions/smartfilling /vi` 加上限後：行動版 0.99、0.98、0.98、0.99（TBT 2、18、7、1 ms），桌機都是 1，和 #127 的結果相同。

### 載入時序的修正

`lighthouse-3d.mjs` 檢查 3D chunk 的請求晚於實測 LCP，main 上只差約 20 ms，桌機偶爾失敗：`decode()` 之後的兩個 animation frame 不保證那一格已經送上畫面。支援 LCP 的瀏覽器，`Scene3D` 改成等 hero 圖的 `largest-contentful-paint` entry 才往下走（最多 1 秒，LCP 是別的元素時不會等到）；不支援的瀏覽器維持兩個 animation frame。改後差距 41–92 ms。

## 取捨

- three.js 130 KB gzip 是在閒置時下載，行動網路上仍會用到流量。Save-Data 開啟時不載入；要更省，可以改成捲動接近 hero 底部時才載入，代價是第一次捲動時場景還沒出現
- canvas 固定在 viewport（`position: fixed`），讓場景在 chapter 捲過時持續播放。M3-04 起 canvas 從 sticky header 下緣開始（`--header-height`），構圖和 header 下方的靜態主視覺一致；窄螢幕 hero 的取景依 `PageHero` 的視覺區決定（見「窄螢幕的取景」）。track 裡 hero 之後的區塊用 `SceneChapter`，它在 ready 後改成透明背景，不擋住場景；M3-05 起首頁與產品頁共用
- 3D 文字對比是在雲端的軟體算圖下量測，場景隨時間微動，量到的是當下那一格；改場景的亮度、位置或 scrim 後要重跑
