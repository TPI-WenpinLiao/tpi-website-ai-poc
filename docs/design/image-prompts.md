# 圖片素材提示詞

本檔有兩批素材。現在的網站（`ribbon-route`，亮底、平塗、緞帶）用的是第一節「#187：緞帶世界的段落圖」；第二節以後是 M3-02 時期深色方向的素材，只剩 `/design-system` 與 `Backdrop` 的範例在用，正式頁面不用。

## #187：緞帶世界的段落圖

#187 的設計確認時，使用者看 preview 覺得內頁「都是文字組成、過於單調」。產品頁與產業頁的介面片段、接點圖仍由 HTML 畫（`design-principles.md`「內頁共用的規則」影像：片段的文字只能用事實原文），這批圖補的是規格表、時間列、色帶與案例列旁邊空著的那一欄，以及沒有 hero 圖的產品頁。

- 風格：首頁 3D 的「緞帶世界」：白色等角方塊、白底、平塗、只有緞帶有紫→品紅→橘的漸層，幾個方塊頂面塗紫、品紅或橘。圖裡不放文字；要說明接點時，由 `MapPicture` 一類的 HTML 標籤疊上去
- 生成方式：使用者用 ChatGPT 產生，上傳 `src/assets/design/ribbon/page-finance.webp` 當風格參考圖。收到 1448×1086（直式 1086×1448）的 PNG，用 `scripts/design/import-image.mjs` 轉成 `src/assets/design/<檔名>.webp`
- 接進頁面：段落的 `image` 欄位（spec 放在 h2 旁的最後 4 欄，沒有介面片段的 band 放在片段的位置，375 寬不顯示，`PageSections`）、產品家族 hub 的 `heroImage`（沒有 hero 圖的產品頁沿用所屬家族的圖，`OfferingTemplate`）。圖是裝飾，alt 留空；哪些段落能放、每頁幾張，見 `design-principles.md`「內頁共用的規則」段落圖

| 檔名 | 用在 | 這張圖要表達的事 |
|---|---|---|
| `sec-deployment.webp` | digiRunner「部署環境由企業決定」 | 同一個產品放在三種環境 |
| `sec-identity.webp` | 金融「金融通路的身分驗證」 | 一次驗證，跨多個通路 |
| `sec-planning.webp` | 金融「規劃與導入由同一家負責」（淺紫色帶，圖的地面也是淺紫） | 規劃與導入是同一條線 |
| `family-dx.webp`、`family-ai.webp`、`family-security.webp`、`family-esg.webp` | 四個產品家族頁的 hero，以及家族底下沒有 hero 圖的產品頁 | 各產品家族一張識別圖，只換頂面的顏色 |

另外產生過 `sec-open-banking`（三階段的台階）與 `sec-cases`（案例列旁的直式圖），第二輪重評時評審指出時間列旁與案例列旁的圖把內容推後、和案例搶焦點，使用者決定不用，圖檔已刪除。

每張的提示詞是下面的共用風格接上主體，再接負面描述，整段一次貼上：

```
Isometric 3D render in a clean architectural-model style, landscape 4:3 (1600x1200). Pure white matte blocks of varied heights on a white ground (#ffffff), soft ambient occlusion, very light cool-grey shadows (#e9e7ef), flat shading, no glow, no bloom, no reflections, no gradients anywhere except one smooth ribbon. The ribbon is a flat band colored with a gradient from purple (#662e8d) through magenta (#b824d1) to orange (#ff6329). Camera: isometric three-quarter view from the upper left, pitch about 35 degrees, slight top-down. Scene: <主體>. Calm, precise, generous white space, high-end minimal. Absolutely no text, letters, numbers, Chinese characters, logos, watermarks, people, hands, faces, screens, user interfaces, dashboards, charts or icons. Avoid glow, neon, bloom, lens flare, dark backgrounds, cyberpunk, sci-fi, photorealistic cities, clutter and noise.
```

| 檔名 | 主體 |
|---|---|
| `sec-deployment` | three separate low platforms placed side by side: a dense square cluster of short white blocks (on-premise data center), a loose cluster of rounded white blocks floating slightly above the ground (cloud), and a neat grid of identical small white cubes in rows (container cluster). On top of each platform stands one identical block with a flat purple (#662e8d) top; one ribbon passes through all three |
| `sec-identity` | one tall white block with a flat purple (#662e8d) top in the left third, like a single gate; from it the ribbon splits into four thinner branches fanning out to the right, each ending at a small cluster with one magenta (#b824d1) or orange (#ff6329) top |
| `sec-planning` | the ground is a very pale lavender (#f6f1fa); a low site-plan layout on the left with one purple-topped block, the same layout built up taller on the right with one orange-topped block; one unbroken ribbon joins them; empty space in the upper left |
| `family-*` | a single compact cluster of white blocks centered, one taller block in the middle with a flat top in the family's color (dx purple #662e8d, ai magenta #b824d1, security purple with a thin orange edge, esg orange #ff6329); the ribbon enters from the lower left, wraps once around the cluster and exits to the right |

## M3-02：深色方向的素材

`/design-system` 第二版審核意見是「看起來太單調」。目前畫面只有 CSS 畫的格線、漸層與玻璃面板，缺少有質感的影像。本檔列出要用生圖工具產生的素材、每張的用途與提示詞。圖由使用者產生後放進 repo，再由 Claude 接進元件。

### 共用規格

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

### 素材清單

| # | 檔名 | 用途 | 尺寸 | 優先 |
|---|---|---|---|---|
| 1 | `hero-data-flow.png` | 首頁 hero 靜態圖（方向 A Data Flow），也是 3D 載入前的 LCP 圖 | 2400×1350（16:9） | 高 |
| 2 | `hero-modular-stack.png` | 首頁 hero 靜態圖（方向 B Modular Stack） | 2400×1350（16:9） | 高 |
| 3 | `hero-data-flow-mobile.png`、`hero-modular-stack-mobile.png` | 1、2 的手機版構圖 | 1080×1350（4:5） | 高 |
| 4 | `ambient-glow-1.png`、`ambient-glow-2.png` | 深色區塊的背景光暈，放在格線下面 | 2400×1350（16:9） | 中 |
| 5 | `cover-*.png`（4 張） | 卡片封面的抽象圖（產品、方案、案例、文章的預設圖） | 1600×900（16:9） | 中 |
| 6 | `reading-header.png` | 亮色閱讀頁（blog、法務）頂部的淡色背景 | 2400×800（3:1） | 低 |

構圖要求：1、2 的主體放在畫面右側約 55%，左側 45% 保持深色留白放標題；3 的主體放在上半部，下半部留白。

### 提示詞

#### 1. Hero：Data Flow（方向 A）

```
Abstract 3D render of a luminous data network floating in deep dark space, background near-black with a purple tint (#0a0812). Thousands of tiny glowing particles flow along smooth curved light beams that branch and converge into a few bright nodes. Beams glow in a gradient from violet (#7d45a3) through magenta (#b824d1) to warm orange (#ff6329) at the tips. Isometric three-quarter view from upper right, camera elevation about 30 degrees. Subject occupies the right 55% of the frame, left side fades into empty dark negative space. Volumetric light, subtle depth of field, soft bloom, clean dark shadows, high-end tech product visual, minimal, elegant, 8k detail, no text.
```

#### 2. Hero：Modular Stack（方向 B）

```
Abstract 3D render of a stack of four thin translucent frosted-glass panels floating in deep dark space, background near-black with a purple tint (#0a0812). Panels are slightly separated vertically, each etched with a faint fine grid, edges catching rim light in soft lavender (#bf9de8). A single thin vertical beam of light passes through the centers of all panels, glowing magenta (#b824d1) to orange (#ff6329), with a small bright orange node where it meets each panel. Isometric three-quarter view from upper right, camera elevation about 30 degrees. Subject occupies the right 55% of the frame, left side is empty dark negative space. Volumetric haze, soft purple glow behind the stack, shallow depth of field, premium minimal tech aesthetic, 8k detail, no text.
```

#### 3. Hero 手機版

用 1、2 的提示詞，把構圖那一句換成：

```
Vertical 4:5 composition. Subject centered in the upper half of the frame, lower half fades into empty dark negative space.
```

#### 4. 深色區塊背景光暈

```
Soft abstract ambient light on a near-black background with a purple tint (#0a0812). One large blurred glow of deep violet (#662e8d) and magenta (#b824d1) in the upper right, a faint warm orange (#ff6329) haze in the lower left, very subtle film grain. No objects, no shapes, no lines. Smooth gradients only, very dark overall so white text stays readable on top. 16:9.
```

第二張把光的位置對調（左上紫、右下橘）。

#### 5. 卡片封面（4 張一組，同一風格）

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

#### 6. 亮色閱讀頁頂部背景

```
Very light, airy abstract background, off-white with a faint lavender tint (#f6f5fa). Extremely soft, blurred pastel glow of lavender (#d9c4f2) at the top right fading to white, a barely visible fine grid. No objects, no text. Must stay very low contrast so dark body text on top remains easy to read. 3:1 wide banner.
```

### 已收到的素材（2026-10-21）

使用者用生圖工具產生 10 張，`ambient-glow-2` 沒有做（一張就夠）。原始檔是 1–2MB 的 PNG，用 `scripts/design/import-image.mjs` 轉成 WebP 品質 95 存進 `src/assets/design/`（共 1.5MB，PSNR 41–45 dB）：

```bash
node scripts/design/import-image.mjs <來源.png> <檔名（不含副檔名）> [...]
```

| 檔名 | 尺寸 | 用在 |
|---|---|---|
| `hero-data-flow.webp`、`hero-data-flow-mobile.webp` | 1774×887、1122×1402 | `/design-system` hero（`Backdrop`，LCP） |
| `hero-modular-stack.webp`、`hero-modular-stack-mobile.webp` | 1672×941、1122×1402 | `/design-system`「影像」區塊 |
| `ambient-glow-1.webp` | 1672×941 | 深色區塊背景（`Backdrop strength="soft"`） |
| `cover-platform/integration/data/security.webp` | 1600×900 | 卡片封面範例、「影像」區塊 |
| `reading-header.webp` | 2172×724 | 亮色長文區塊頂部 |

尺寸比要求的小，網頁用夠：hero 最大輸出 1440px 寬。換圖時用同一個檔名重跑 script。

### 接進來的方式

- `Backdrop` 元件（`src/components/ui/Backdrop.astro`）放進 `Surface` 或 `PageHero` 的 `backdrop` slot；圖是裝飾，alt 一律留空
- hero：桌機版圖只佔右側 `--hero-image-share`（58%），左緣淡出，文字欄限制在 `--hero-copy-share`（45%）；手機版改用 4:5 圖，照原比例貼在頂部，文字從 `--hero-narrow-offset` 往下排。第一版讓圖 `cover` 鋪滿，光束跑到文字下面，1024px 時說明文字對比只有 1.63:1
- 文字壓在圖上的對比用 `node scripts/design/a11y-smoke.mjs` 實測（五種寬度、每個有背景圖的區塊，取文字範圍內最不利的像素），換圖或改 `Backdrop` 後要重跑
- M3-07（#54）選定方向後，hero 用該方向的圖當 3D 場景的 LCP 與減少動態時的版本
