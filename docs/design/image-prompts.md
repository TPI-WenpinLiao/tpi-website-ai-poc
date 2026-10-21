# 圖片素材提示詞（M3-02）

`/design-system` 第二版審核意見是「看起來太單調」。目前畫面只有 CSS 畫的格線、漸層與玻璃面板，缺少有質感的影像。本檔列出要用生圖工具產生的素材、每張的用途與提示詞。圖由使用者產生後放進 repo，再由 Claude 接進元件。

## 共用規格

- 色彩：只用品牌色，背景接近 `#0a0812`（帶紫的近黑）；主色紫 `#662e8d`、亮紫 `#bf9de8`、品紅 `#b824d1`、橘 `#ff6329`（只當少量光點，不大面積使用）
- 風格：抽象 3D 渲染，玻璃與發光材質、體積光、淺景深、乾淨的暗部；科技感但不是科幻海報
- 不要：文字、數字、logo、浮水印、人物、手、螢幕畫面或 UI、地圖、真實產品或品牌、雜亂的電路板紋理
- 視角：與 `tokens.css` 的 `--scene-angle-x`／`--scene-angle-z` 一致，從右上方往下看的等角（isometric）3/4 視角，鏡頭仰角約 30°
- 交件格式：PNG 或品質 90 以上的 JPG，依下表尺寸；Claude 用 `astro:assets` 轉成 AVIF／WebP
- 放置位置：`src/assets/design/`，檔名用下表的「檔名」

通用負面提示詞（工具支援時加上）：

```
text, letters, numbers, watermark, logo, signature, people, hands, faces, UI, screen, map, cluttered circuit board, neon sign, cyberpunk city, lens flare overload, low contrast, washed out, jpeg artifacts
```

## 素材清單

| # | 檔名 | 用途 | 尺寸 | 優先 |
|---|---|---|---|---|
| 1 | `hero-data-flow.png` | 首頁 hero 靜態圖（方向 A Data Flow），也是 3D 載入前的 LCP 圖 | 2400×1350（16:9） | 高 |
| 2 | `hero-modular-stack.png` | 首頁 hero 靜態圖（方向 B Modular Stack） | 2400×1350（16:9） | 高 |
| 3 | `hero-data-flow-mobile.png`、`hero-modular-stack-mobile.png` | 1、2 的手機版構圖 | 1080×1350（4:5） | 高 |
| 4 | `ambient-glow-1.png`、`ambient-glow-2.png` | 深色區塊的背景光暈，放在格線下面 | 2400×1350（16:9） | 中 |
| 5 | `cover-*.png`（4 張） | 卡片封面的抽象圖（產品、方案、案例、文章的預設圖） | 1600×900（16:9） | 中 |
| 6 | `reading-header.png` | 亮色閱讀頁（blog、法務）頂部的淡色背景 | 2400×800（3:1） | 低 |

構圖要求：1、2 的主體放在畫面右側約 55%，左側 45% 保持深色留白放標題；3 的主體放在上半部，下半部留白。

## 提示詞

### 1. Hero：Data Flow（方向 A）

```
Abstract 3D render of a luminous data network floating in deep dark space, background near-black with a purple tint (#0a0812). Thousands of tiny glowing particles flow along smooth curved light beams that branch and converge into a few bright nodes. Beams glow in a gradient from violet (#7d45a3) through magenta (#b824d1) to warm orange (#ff6329) at the tips. Isometric three-quarter view from upper right, camera elevation about 30 degrees. Subject occupies the right 55% of the frame, left side fades into empty dark negative space. Volumetric light, subtle depth of field, soft bloom, clean dark shadows, high-end tech product visual, minimal, elegant, 8k detail, no text.
```

### 2. Hero：Modular Stack（方向 B）

```
Abstract 3D render of a stack of four thin translucent frosted-glass panels floating in deep dark space, background near-black with a purple tint (#0a0812). Panels are slightly separated vertically, each etched with a faint fine grid, edges catching rim light in soft lavender (#bf9de8). A single thin vertical beam of light passes through the centers of all panels, glowing magenta (#b824d1) to orange (#ff6329), with a small bright orange node where it meets each panel. Isometric three-quarter view from upper right, camera elevation about 30 degrees. Subject occupies the right 55% of the frame, left side is empty dark negative space. Volumetric haze, soft purple glow behind the stack, shallow depth of field, premium minimal tech aesthetic, 8k detail, no text.
```

### 3. Hero 手機版

用 1、2 的提示詞，把構圖那一句換成：

```
Vertical 4:5 composition. Subject centered in the upper half of the frame, lower half fades into empty dark negative space.
```

### 4. 深色區塊背景光暈

```
Soft abstract ambient light on a near-black background with a purple tint (#0a0812). One large blurred glow of deep violet (#662e8d) and magenta (#b824d1) in the upper right, a faint warm orange (#ff6329) haze in the lower left, very subtle film grain. No objects, no shapes, no lines. Smooth gradients only, very dark overall so white text stays readable on top. 16:9.
```

第二張把光的位置對調（左上紫、右下橘）。

### 5. 卡片封面（4 張一組，同一風格）

共用開頭：

```
Minimal abstract 3D render on a near-black purple-tinted background (#0a0812), soft violet and magenta glow, a small accent of orange light (#ff6329), frosted glass material, soft studio lighting, isometric view, centered composition with generous margins, no text. 16:9.
```

各張接在後面的主體：

- `cover-platform.png`：`A single translucent glass cube with a softly glowing core.`
- `cover-integration.png`：`Two glass blocks connected by a thin glowing beam of light.`
- `cover-data.png`：`A small cluster of glowing particles flowing in a gentle arc between glass layers.`
- `cover-security.png`：`A glass sphere enclosed in a thin glowing ring, calm and solid.`

主體只是抽象意象，不代表特定產品功能；正式內容頁有真實素材時優先用真實素材。

### 6. 亮色閱讀頁頂部背景

```
Very light, airy abstract background, off-white with a faint lavender tint (#f6f5fa). Extremely soft, blurred pastel glow of lavender (#d9c4f2) at the top right fading to white, a barely visible fine grid. No objects, no text. Must stay very low contrast so dark body text on top remains easy to read. 3:1 wide banner.
```

## 接進來之後

- 1、2、3：放進 `PageHero` 的 `visual` slot，取代 `LayerStack` 當作 3D 場景載入前與減少動態時的靜態圖。也是 M3-07（#54）驗收條件「LCP 元素是靜態圖」要用的圖
- 4：`Surface` 加背景圖選項，壓在格線下方
- 5：`Card` 沒有 `image` 時的預設封面
- 6：亮色 `Surface` 的頂部背景
- 每張圖接上後重跑 `npm run check:design`，確認文字疊在圖上的區塊仍用 glass 或 scrim，對比照 `contrast.mjs` 的最壞情況計算
