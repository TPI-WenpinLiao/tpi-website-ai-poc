# 0003. 3D island 的載入策略

- 狀態：已採用
- 日期：2026-10-21
- issue：#54（M3-07）

## 背景

M3-02 把敘事頁定為深色場景，hero 底下要有隨捲動變化的 3D 場景（`design-system` skill「設計方向」）。M3-07 用 three.js 做了兩個方向的原型：A Data Flow（光點與光束的網路）與 B Modular Stack（等角視角的方塊隨捲動拆解、翻轉、重組）。人工選定 B，A 的頁面與場景已刪除，原型頁是 `/prototypes/modular-stack`。

three.js 是本站第一個大型 client 依賴。ADR 0001 定了「預設零 client JS，互動才用 island」，Lighthouse 關卡要求 performance ≥ 0.95。實測 `npm run build` 的輸出：

| chunk | 內容 | 大小（gzip） |
|---|---|---|
| `Scene3D.astro_astro_type_script_*.js` | 判斷條件、延後載入 | 1.5 KB |
| `runtime.*.js` | `src/lib/scene/runtime.ts`＋three.js | 130 KB（未壓縮 528 KB） |
| `modular-stack.*.js` | 方向 B 的場景 | 1.6 KB |

## 決策

3D 場景是裝飾性的 island，頁面在沒有它時內容完整。

1. **靜態圖是 LCP 與完整的替代版本**：hero 的 `Backdrop`（`priority`）先顯示，3D 只疊在上面，不取代 HTML 內容。靜態圖與 3D 用同一個視角：three.js 相機從 `--scene-angle-x`、`--scene-angle-z` 換算仰角與方位角，從 `--perspective` 換算視角（FOV），主體位置對齊 `Backdrop fade="hero"` 的構圖
2. **首屏之後才載入**：`Scene3D` 的 loader 依序等 `load` 事件、hero 靜態圖 `decode()` 完成後的兩個 animation frame（圖已經畫上畫面）、`requestIdleCallback`（最多 2 秒），才 `import()` runtime 與場景模組。three.js 只在這個 chunk 裡，不在任何頁面的初始 JS。只等 `load` 不夠：桌機實測 `load` 在 151 ms、chunk 在 200 ms 請求，LCP 卻在 208 ms 才畫出
3. **不載入的條件**：`prefers-reduced-motion: reduce`、`navigator.connection.saveData`、瀏覽器不支援 WebGL。執行中切換成減少動態時，停止場景、移除 canvas，回到靜態圖
4. **第一個 frame 畫完才淡入**：track 加上 `data-scene="ready"` 後 canvas 淡入（`--duration-slow`），靜態圖不做任何動畫
5. **不在畫面上就不畫**：IntersectionObserver 在 track 離開畫面時停止 `requestAnimationFrame`，分頁隱藏（`visibilitychange`）時也停止
6. **行動版降級**：`(width < 64rem), (pointer: coarse)` 用 `TIERS.mobile`，在場景啟動時決定。構圖（主體偏右或偏上）只看寬度 `(width < 64rem)`，和 CSS 的 `--bp-lg-down` 一致，視窗縮放跨過斷點時跟著改；橫向平板是桌機構圖、行動版預算。行動版降低 `devicePixelRatio` 上限與方塊數量、關掉 antialias 與滑鼠視差、鏡頭只沿一個方向移動，數值只寫在 `src/lib/scene/runtime.ts` 的 `TIERS`

7. **3D 上的文字要能讀**：canvas 上蓋一層和 `Backdrop fade="hero"` 相同的 scrim，文字側維持 `--color-bg`；chapter 的文字放在玻璃面板（`--glass-bg`）上
8. **量測**：原型頁不進 `npm run check` 的 LHCI（`staticDistDir` 只自動測 5 個 URL），改用以下 script，改到 `Scene3D`、`src/lib/scene/` 或原型頁後要跑
   - `node scripts/design/lighthouse-3d.mjs`：performance，並檢查 LCP 元素是靜態圖、3D chunk 的請求時間晚於實測 LCP 與 `load`，不符合時 exit 1
   - `node scripts/design/a11y-smoke.mjs /prototypes/modular-stack`：不開減少動態、等場景畫出第一個 frame，在 track 的 0／25／50／75／100% 量 track 內每行文字和背後最不利像素的對比（375×800、1280×860）
   - `node scripts/design/scene-capture.mjs <dir>`：減少動態時沒有 canvas、沒有 3D chunk 請求；場景執行中切到減少動態時 canvas 被移除

## 與「預設零 client JS」的關係

ADR 0001 的原則不變：頁面預設沒有 client JS。3D 場景是明確選擇的 island，條件是：

- 只放在敘事頁的 hero（M3-04 決定哪些模板使用）
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

## 取捨

- three.js 130 KB gzip 是在閒置時下載，行動網路上仍會用到流量。Save-Data 開啟時不載入；要更省，可以改成捲動接近 hero 底部時才載入，代價是第一次捲動時場景還沒出現
- canvas 固定在 viewport（`position: fixed`），讓場景在 chapter 捲過時持續播放。track 裡在 hero 之後的區塊要在 ready 後改成透明背景，否則會擋住場景。這個寫法目前只在原型頁，M3-04 決定是否做成元件的 slot
- 3D 文字對比是在雲端的軟體算圖下量測，場景隨時間微動，量到的是當下那一格；改場景的亮度、位置或 scrim 後要重跑
