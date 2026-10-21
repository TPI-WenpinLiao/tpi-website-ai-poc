# 0003. 3D island 的載入策略

- 狀態：提議（M3-07 選定方向後改為已採用）
- 日期：2026-10-21
- issue：#54（M3-07）

## 背景

M3-02 把敘事頁定為深色場景，hero 底下要有隨捲動變化的 3D 場景（`design-system` skill「設計方向」）。M3-07 用 three.js 做了兩個方向的原型：`/prototypes/data-flow`、`/prototypes/modular-stack`。

three.js 是本站第一個大型 client 依賴。ADR 0001 定了「預設零 client JS，互動才用 island」，Lighthouse 關卡要求 performance ≥ 0.95。實測 `npm run build` 的輸出：

| chunk | 內容 | 大小（gzip） |
|---|---|---|
| `Scene3D.astro_astro_type_script_*.js` | 判斷條件、延後載入 | 1.5 KB |
| `runtime.*.js` | `src/lib/scene/runtime.ts`＋three.js | 131 KB（未壓縮 533 KB） |
| `data-flow.*.js`、`modular-stack.*.js` | 各方向的場景 | 2.1 KB、1.5 KB |

## 決策

3D 場景是裝飾性的 island，頁面在沒有它時內容完整。

1. **靜態圖是 LCP 與完整的替代版本**：hero 的 `Backdrop`（`priority`）先顯示，3D 只疊在上面，不取代 HTML 內容。靜態圖與 3D 用同一個視角：three.js 相機從 `--scene-angle-x`、`--scene-angle-z` 換算仰角與方位角，從 `--perspective` 換算視角（FOV），主體位置對齊 `Backdrop fade="hero"` 的構圖
2. **首屏之後才載入**：`Scene3D` 的 loader 等 `load` 事件，再等 `requestIdleCallback`（最多 2 秒），才 `import()` runtime 與場景模組。three.js 只在這個 chunk 裡，不在任何頁面的初始 JS
3. **不載入的條件**：`prefers-reduced-motion: reduce`、`navigator.connection.saveData`、瀏覽器不支援 WebGL。執行中切換成減少動態時，停止場景、移除 canvas，回到靜態圖
4. **第一個 frame 畫完才淡入**：track 加上 `data-scene="ready"` 後 canvas 淡入（`--duration-slow`），靜態圖不做任何動畫
5. **不在畫面上就不畫**：IntersectionObserver 在 track 離開畫面時停止 `requestAnimationFrame`，分頁隱藏（`visibilitychange`）時也停止
6. **行動版降級**：`(width < 64rem), (pointer: coarse)` 用 `TIERS.mobile`

   | 設定 | 桌機 | 行動版 |
   |---|---|---|
   | `devicePixelRatio` 上限 | 2 | 1.5 |
   | 粒子、方塊數量 | 1 | 0.35（Modular Stack 的模組由 3×3×3 改為 2×2×2） |
   | antialias | 開 | 關 |
   | 鏡頭路徑 | 環繞（方位角擺動、推近） | 只沿一個方向移動 |
   | 滑鼠視差 | 開 | 關 |

7. **量測**：原型頁不進 `npm run check` 的 LHCI（`staticDistDir` 只自動測 5 個 URL），改用 `node scripts/design/lighthouse-3d.mjs`。它檢查 LCP 元素是靜態圖、3D chunk 的請求時間晚於實測 LCP 與 `load`，不符合時 exit 1

## 與「預設零 client JS」的關係

ADR 0001 的原則不變：頁面預設沒有 client JS。3D 場景是明確選擇的 island，條件是：

- 只放在敘事頁的 hero（M3-04 決定哪些模板使用）
- 沒有它頁面內容完整，關掉它的條件由使用者偏好與裝置決定
- 初始載入只多 1.5 KB 的 loader，three.js 不影響 FCP 與 LCP

不用 Astro 的 `client:idle`／`client:visible`：那是 UI framework 元件的 hydration 指令，本站不用 UI framework。`<script>` 加動態 `import()` 可以自己控制「load 之後、閒置時、條件成立才載入」。

## 結果

`node scripts/design/lighthouse-3d.mjs`（2026-10-21，雲端 session，Lighthouse 12.6.1，3 次取中位數）：

| 頁面 | 行動版 | 桌機 |
|---|---|---|
| `/prototypes/data-flow` | 0.98 | 1 |
| `/prototypes/modular-stack` | 0.98 | 1 |

行動版 TBT 約 150 ms，來自 three.js 解析與 shader 編譯。headless Chromium 用 SwiftShader 軟體算圖，這個數字偏高；真機待 preview 部署後量測。

## 取捨

- three.js 131 KB gzip 是在閒置時下載，行動網路上仍會用到流量。Save-Data 開啟時不載入；要更省，可以改成捲動接近 hero 底部時才載入，代價是第一次捲動時場景還沒出現
- canvas 固定在 viewport（`position: fixed`），讓場景在 chapter 捲過時持續播放。track 裡在 hero 之後的區塊要在 ready 後改成透明背景，否則會擋住場景。這個寫法目前只在原型頁，M3-04 決定是否做成元件的 slot
- 3D 上的文字對比無法用 `contrast.mjs` 或 `a11y-smoke.mjs` 檢查（`a11y-smoke` 以減少動態執行，量到的是靜態圖）。目前靠和 `Backdrop` 相同的 scrim 讓文字側維持 `--color-bg`，以及 chapter 的玻璃面板。需要 needs-design 階段二補檢查方式
