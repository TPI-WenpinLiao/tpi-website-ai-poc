# Loud and flat（`loud-flat-poster`）

`draw.mjs --direction loud-flat-poster` 發出的 direction sheet 加上 redraw 後的版本（seed 456567933，2026-11-01）。最後一節「Direction sheet」是 `draw.mjs --show` 的原樣輸出（英文）；前面幾節是本站的補充。共用的論點與文案在 [`../argument.md`](../argument.md)、[`../copy-deck.md`](../copy-deck.md)，參數在 [`../options.md`](../options.md)。

## Redraw

| # | 位置 | 原本發的 | 換成 | 理由 |
|---|---|---|---|---|
| 1 | `section:list` | `list-giant-word-bar-rows`（一個大字加 6–9 條可展開的橫條） | `list-day-tabs-banded-agenda` | 第 2 段只有金融、政府兩個產業，湊不出 6–9 條分類。換的版型左側是一排頁籤、右側是該頁籤的列：兩個頁籤（金融、政府與公部門）各 3 列規範與案例原文，正好裝得下；講者頭像的部分不做 |
| 2 | `section:work` | `work-names-as-paragraph`（10–18 個案例名稱排成一段大字） | `work-oversized-visual-small-cluster` | 案例只有 3 則（brief 第 3 段），排不成 10–18 個名字的段落，也不補範例案例。換的版型是三到四個區塊、每塊一則案例 |
| 3 | `section:about` | `about-pinned-title-portraits`（標題固定、人像照片一張張捲過） | `about-photo-tile-facts` | 原本要最多六位人物的照片，本站沒有人物照片，也不用圖庫人像（P2）。換的版型是一張橫幅照片、一塊色塊上的地圖與四組標籤和值：照片放公司所在的城市，地圖標出據點（`fact:office-names`），四組值放年份紀錄 |
| 4 | `section:cta` | `cta-first-step-already-open`（產品的建立對話框，按鈕帶到註冊） | `cta-reply-card` | 原本是自助註冊產品的第一個畫面；本站的主要轉換是聯絡業務、到 `/contact-us` 填表，不是註冊產品。換的版型是一張回函卡，卡上一個「聯絡業務」動作 |

## Idea 句

> On this page, **the rule books and the old machines TPI's products are built against — the FSC open-banking rules, the NDC common API specification, the financial-inspection checklist, core banking systems and old mainframes** becomes **a row of flat street posters: each panel shouts one rule or one old system by name, with an archival photograph of that machine or paper form cut out and stuck on**.

中文：昕力的產品對應的法規文件與被接進來的舊系統（`argument.md` 清點第 5、6、8 項），成為一張張平塗的街頭海報，舊機器或紙本表單的老照片剪下來貼上去。

Competitor test：把 Syscom（也做金融、政府系統整合）放進第一格，「大型主機的照片」這一半仍然成立，屬於類別；「每張海報喊出一條法規的名稱」這一半不成立，`competitors.md` 記錄的四家首頁都沒有提法規。所以 idea 要靠法規名稱撐住，海報上不能只放舊機器的照片。

## 可以操作的一件事

`showcase`（OrientAI）的放大控制項做成「離線運行」開關：切換時整段底色在兩個 palette 色之間換，標題的一個詞跟著換，下方顯示 `fact:orientai-aidaptiv` 的原文。沒有 script 時顯示開啟狀態與原文。

## 照本站規則的調整

- 品牌紫：sheet 的 accent（綠 `#18bc42`）不放在按鈕上，主要 CTA 改用品牌紫 `#662e8d`。海報段落的底色（珊瑚紅、黑、骨白、綠、黃）照 sheet；紫色按鈕和黑底（`#1a1a1a`）的對比是 1.94:1、和珊瑚紅（`#ed4b44`）是 2.43:1，都低於 3:1，所以按鈕只放在骨白（6.82:1）或黃底（5.34:1）的段落。inspector 加 `--allow palette-purple`
- 字體：Panchang 與 Switzer 只有拉丁字母，中文落到系統字的最粗字重。h1 的「uppercase」對中文沒有作用
- hero 的 h1：blueprint 要 11.4vw、欄寬約 60%；共用的 h1 第一行 8 個全形字寬，60% 欄寬放不下。照 `references/copy.md` §2 先加寬欄寬：改成滿版（左右 24px 邊距），11.4vw 下 8 字約 1168px 放得下。375 寬改 11vw（約 42px）
- signature move「Masked headline」讓 h1 逐行升起，延後 h1 出現，碰到 P1「動態」與 LCP。原型照做，方向說明要寫出代價；不接受時改成只動說明句與按鈕
- `features`：一塊放標題，7 塊放第 4 段的介面片段，標籤照事實原文
- `how-it-works`：同一張卡片在四個色塊裡往前走，四個階段照 `copy-deck.md` 第 6 段（AI 導入情境分析、解決方案搭配建議、效益評估、模型評估與微調），卡片不寫負責人與日期（沒有這些事實）
- 介面片段：根元素標 `data-ui`，標籤只用事實裡的詞；版面是原型畫的，不是產品的真實畫面
- 照片旋轉 3–6 度、硬裁切，只用在兩到三張照片上，不壓在任何標題或說明句上（house rule）
- 字型與圖片都放進方向目錄，原型離線打開

## 需要的圖片

這個方向最依賴照片：hero、案例、穩定度都要真實圖片。

| 位置 | 要什麼 | 開放圖庫的查詢詞 |
|---|---|---|
| hero 升起的 3:4 照片 | 被接進來的舊系統：大型主機、打孔卡 | `IBM mainframe 1960s`、`IBM System/360`、`punched card` |
| `work` 三個區塊，各一張放大的主視覺加一張 16:10 小圖 | 每則案例讀的文件與作業的場域 | `medical certificate document`、`insurance claim form historical`、`bank ledger archive`、`hospital records room` |
| `about` 的 16:10 橫幅照片 | 公司所在的城市（只當城市，不當辦公室） | `Neihu Technology Park Taipei`、`Neihu District aerial` |
| `about` 的色塊地圖 | 程式畫的台灣與東南亞輪廓，點出據點 | 不找圖（`fact:office-names`、`fact:company-subsidiaries-sg-vn`） |
| `features` 7 塊、`showcase` 控制項、`how-it-works` 卡片 | HTML 介面片段 | — |

Scroll scene：sheet 沒有發，不需要 GSAP、Lenis。

## Direction sheet

````text
# DIRECTION SHEET — Loud and flat
seed 456567933 · drawn 2026-11-01 · redraws: 4 · sector saas
Brief: TPIsoftware (昕力資訊), a Taiwanese enterprise software maker that builds and deploys its own API management, integration and on-premises AI products for banks, insurers and government agencies, connecting them to the core systems they already run

| | |
| --- | --- |
| Direction | Loud and flat |
| Hero | Shouted headline, rising photograph |
| Type | Panchang / Switzer |
| Colour | Poster chapters |
| Sections | list (Day tabs, banded agenda) → work (Oversized visual, small cluster) → features (Close-ups on a board) → showcase (One control, blown up) → how-it-works (One card, four fields) → about (Wide photo, colour tile, facts) → cta (The reply card) → footer (Invitation over a cropped name) |
| Motion | Masked headline |
| Photographs | the "Architecture" set, as atmosphere |

This is the direction for this build. Adopt it. Do not blend it with the layout you would have made anyway,
and do not redraw because it is unfamiliar: unfamiliar is the point. Redraw a slot only when it conflicts
with a stated brand constraint or needs an asset that does not exist, and say why in your report.

The parts of this sheet were written separately and will disagree in small ways. Settle every disagreement in this order:
**house rules** (including type no smaller than 13px and body text of 16px or more) → **the direction** (the idea, the composition habits, where the
one accent goes) → **the type system and the palette** (which face does which job, the five size steps, which colour is the ground and where the
accent goes) → **the hero blueprint** → **the section blueprints**. Under each blueprint below, "Adjusted for this page" lists where it disagrees.
In practice: take geometry from blueprints (columns, proportions, what sits where) and take everything else from above them. Map every size a
blueprint names onto one of your five type steps instead of adding a sixth. Use one button shape, one corner radius and one pair of page margins on
the whole page, whatever individual blueprints say. If a blueprint names a kind of typeface (a light serif, a heavy grotesk), use the dealt face.

## 1. The idea
A page with the directness of a street poster: flat saturated colour, the heaviest type you can find, short blunt statements, and photographs cut out and stuck on. It is for subjects with a voice. Write the page as things a person would actually say out loud, and let the design say them at full volume. The craft is in the control beneath the noise: a strict grid, two or three colours, and exact alignment keep it from becoming a mess.

Before anything else, write one sentence in your notes: "On this page, <the subject's own material> becomes <the device>."
Fill the first blank from your inventory of what only this client has (its name and what it means, its street, its numbers, its
constraint), then put the nearest competitor in the sentence: if it still works, the idea is the category's, not the client's.
Then name the one live thing the visitor can do on the page (SKILL.md step 4).

## 2. Composition
Hero: a statement of three to six words in ultra-heavy type at 11–15vw, filling the width, lines stacked tight (leading 0.85), flush left with 20–28px margins, on a flat saturated ground. One cut-out or hard-cropped photograph overlaps the type from the right or bottom, tilted 3–6 degrees. A single chunky button in the contrasting flat colour. Sections are solid panels in alternating palette colours: one is a row of short statements each on its own panel of unequal width; one is a single photograph bleeding off two edges with a caption block set over a solid colour bar; one is a large plain list. Panels meet edge to edge. Corners are square or use one large radius (28–40px) consistently.

## 3. Type — Panchang / Switzer
A flat-sided extended grotesk in heavy capitals, wide enough that two words fill the screen, with a neutral sans kept small. Suits portfolios, real estate, travel and brand sites that want a broad, confident wordmark.
```html
<link rel="preconnect" href="https://api.fontshare.com">
<link rel="preconnect" href="https://cdn.fontshare.com" crossorigin>
<link href="https://api.fontshare.com/v2/css?f[]=panchang@700&display=swap" rel="stylesheet">
<link href="https://api.fontshare.com/v2/css?f[]=switzer@400,500&display=swap" rel="stylesheet">
```
- Display: **Panchang** — weight 700 · tracking -0.02em · leading 1.0 · uppercase; four words or fewer per line because the face is very wide
- Text: **Switzer** — 400 for body, 500 for emphasis · leading 1.5 · tracking 0
```css
:root {
  --step-small: clamp(0.8125rem, 0.79rem + 0.1vw, 0.875rem);
  --step-body: clamp(1.0625rem, 1rem + 0.25vw, 1.1875rem);
  --step-lead: clamp(1.25rem, 1.1rem + 0.7vw, 1.625rem);
  --step-head: clamp(2rem, 1.3rem + 3.2vw, 4rem);
}
```
The heaviest weight available, set tight, mostly lowercase or mostly uppercase (choose one). Body text is a plain grotesk at 18–20px.
The direction decides sizes and how many of them; the type system decides how this face is set. Where the two give different tracking or leading, use the values of the type system: they are tuned to this face.
The display size itself comes from the hero blueprint below.

## 4. Colour — Poster chapters
```css
:root {
  --bg: #e6e0d2;
  --surface: #dcd5c5;
  --ink: #1a1a1a;
  --muted: #5f5b52;
  --accent: #18bc42;
  --accent-ink: #1a1a1a;
  --field-1: #ed4b44;  --field-1-ink: #0f0f0f;
  --field-2: #1a1a1a;  --field-2-ink: #e6e0d2;
  --field-3: #18bc42;  --field-3-ink: #1a1a1a;
  --field-4: #f2c21a;  --field-4-ink: #1a1a1a;
  --field-5: #e6e0d2;  --field-5-ink: #1a1a1a;
}
```
Each chapter takes one flat field in turn (coral red, near-black, bone, green, yellow) with black or bone type and no tints between them. Green doubles as the accent for the one button when the ground is bone or black.
Three or four flat colours at full strength including black or white. Each panel is one colour; text on it is one other.

## 5. Imagery
**This subject is software and there are no screenshots, so its pictures are its own interface.** Wherever this sheet says photograph, image or object, build a believable fragment of the product in HTML at real size (real labels, numbers that add up, one item hovered or selected) by the app-screen rules (references/app-screens.md: deal its style once with `node <skill>/scripts/draw.mjs --app --kind <kind> --keep palette,type --out .taste-skill/app`, and build it with assets/app.css and assets/charts.js), put the attribute `data-ui` on its root, and crop or scale it the way the blueprint treats a photograph: a full-bleed close crop, a tile, the fixed half of a split. Where a fragment makes no sense, use a flat colour field with type on it. Never a fake dashboard of grey bars, never a device frame. If the product works on something physical (ships, plants, buildings, a city), one real picture of that world can carry a section: find it with `node /home/user/tpi-website-ai-poc/.claude/skills/taste-skill/scripts/assets.mjs "<that world>"`, download it with `--get`, credit it on the page, and never let it pass for the product or its customers.

Photographs with attitude, cropped hard or cut to a simple shape with `clip-path` (circle, arch, blunt polygon), slightly rotated, overlapping the type. Two or three on the page.

**Floor (the inspector checks it):** at least four real pictures on the page, usually six to twelve; SVG drawings do not count. One moving picture where an honest clip exists: `node <skill>/scripts/assets.mjs --video "<query>"`, used as a muted loop with a poster frame. Whatever this direction says about pictures, it is carried out with real ones.

Optional atmosphere, two at most, from the "Architecture" set (structure, lines, bridges, facades and building interiors). The page does not need them.
Order of preference for imagery: (1) the project's own photographs and product shots; (2) images you generate, if an image tool is
available; (3) real pictures of the subject's world found in the open collections (assets.mjs, downloaded and credited on the page);
(4) drawings of the subject in code; (5) these. They are real photographs (Unsplash licence, served by picsum.photos) of places, light and
texture. They are atmosphere, never a stand-in for a specific product, dish, person or interface. List the ones you use in your report so
they can be replaced.
- `https://picsum.photos/id/942/1600/1000` — White angular concrete building against a black sky · dark tone · black, white, pale grey · black-and-white · calm area: top · native landscape · photo: Carl Nenzen Loven
- `https://picsum.photos/id/1081/1600/1000` — Stepped white modern building corner rising into a pale blue sky · light tone · white, pale blue, soft grey · calm area: top · native landscape · photo: Julien Moreau
- `https://picsum.photos/id/193/1600/1000` — Gothic stone college building facing a striped green lawn · mid tone · lawn green, sandstone, sky blue · calm area: bottom · native landscape · photo: Vadim Sherbakov
- `https://picsum.photos/id/951/1600/1000` — Building facade of red, yellow and white rectangular panels · light tone · red, yellow, white · native landscape · photo: Sérgio Rola
The last two path numbers are width and height: request the exact crop you render (`/1200/1500` for a 4:5 portrait, `/2400/1350` for a hero) and
add `?grayscale` to desaturate. Use at most two. Always set `width`, `height`, `alt` and `loading="lazy"` (not on the hero image).
Other sets that fit this brief: fog-and-quiet, sky-and-space — `node draw.mjs --photos <set>` prints one in full; `--photos list` shows all sets. Taking photographs from another set is your call and is not a redraw; keep them to one light and one treatment.

## 6. Hero — Shouted headline, rising photograph
Borrowed from a fashion drop. A near-white or single flat colour field. Navigation is one compact line at the top on 24px margins: condensed wordmark left, three text links centred, the single action right. Directly beneath, a two-line uppercase headline in a bold condensed face at clamp(88px, 11.4vw, 176px), centred, leading 0.88, tracking -0.02em, about 60% of the viewport wide; it occupies the band from 12% to 43% of the height. Immediately under the second line, pulled up with a negative margin of -1.2vw so its top edge tucks behind the letters' baseline, a single portrait photograph rises: 27% of the viewport wide (columns 5-8), 3:4, square corners, object-fit: cover, cropped by the bottom edge so only its upper two thirds show. The photograph is the only colour on the screen. The flanks either side of it stay empty apart from one supporting sentence at 17px bottom-left in a 280px column, and the price or key fact at the same size bottom-right, both on a baseline 32px above the bottom edge.

On a phone: The headline sets at 17vw on two lines, flush to 16px margins and filling the width, in the top third of the screen. The photograph widens to 64% of the width, centred, 3:4, starting directly under the headline and running off the bottom. The supporting sentence and the key fact move below the fold. Navigation collapses to the wordmark and the action.
Headline: A blunt 2-4 word statement in condensed capitals, at most 22 characters, one or two words per line.

Adjusted for this page:
- It names a kind of typeface: use the dealt faces (display Panchang, text Switzer) and their settings; capitals only where the type system sets them.
- It names colours (white): map them onto this palette's roles (ground `--bg`, panels `--surface` and the fields, text `--ink`/`--muted`, the accent `--accent` on the primary action only).

## 7. Sections, in order
Each is a composition to rebuild with this project's content. Keep the geometry; change the subject. Re-order or drop a
section when the argument of the page needs it (see references/copy.md), never to fall back to a card grid.

### 1. list — Day tabs, banded agenda (list)
A two-line heading at clamp(36px, 4vw, 60px), first line in the soft ink and second in full ink, with the booking button on the same row at the far right. 56px below, left: a 150px column of stacked day tabs, each a filled block 150 by 64px with 6px gaps showing the weekday at 16px and the date at 13px; the active tab takes the darkest fill with inverted text. Right, from 190px to the right margin: the day's sessions as alternating tone bands, each 76px tall with an 8px radius and 4px gaps, the two tones one step apart. Inside a band, on fixed column starts: the time at 20px with tabular figures, 20px from the left; the title at 18px in medium weight at 22%, with a one-line note at 13px in the soft ink under it; speaker names right-aligned at 14px beside up to three overlapping 32px round portraits.
On a phone: The heading stacks above a full-width button. Day tabs become a horizontal row of equal filled blocks, sticky under the top edge. Each band stacks time over title over speakers with 16px padding and grows to fit; portraits sit at the band's top-right corner.

Adjusted for this page:
- It names its own corners: use the one radius of this page (square unless the direction says otherwise) and one button shape.

### 2. work — Oversized visual, small cluster (split)
One project per block, three or four blocks, 140px apart. In each, one oversized visual fills columns 1–7 and bleeds off the left viewport edge: an object photograph scaled to 120% of its box and cropped by `overflow: hidden` on the section, 80svh tall, sitting on the page ground (use `mix-blend-mode: multiply` on a light ground so a white studio background disappears). The right third, columns 9–12, holds a small cluster bottom-aligned with the visual: a landscape image at 16:10 with 6px corners, then 28px below it a two-column row with the project title at clamp(28px, 3vw, 44px) on two lines at the left and a five-line description at 13–14px at the right. Column 8 stays empty. Blocks do not mirror; the second visual is 60svh tall and the third 90svh, so the rhythm changes while the structure holds. No section heading: each title leads its block.
On a phone: The visual comes first at 110% of the width, bleeding off the left edge in a 4:5 crop. Beneath it the title at 8vw, then the description at 15px, then the small landscape image at 70% width against the right margin. 88px between blocks.

### 3. features — Close-ups on a board (mosaic)
A board of filled tiles, each a macro view of one small part of the interface. A 12-column grid with 8px gaps, 104px rows and 10px outer margins, no empty cells, no outlines. Eight tiles in four sizes: 6×4, 6×2, 3×4 and 3×2 (columns × rows). Each tile is a flat palette colour with overflow: hidden and holds one real element, built in em and enlarged to 300–400% through the font-size of its data-ui root: a toggle, a pair of key caps, a status word on its block, one figure from a readout, a slider thumb on its track, three stacked initials discs. The element is pushed off-centre so two of the tile's edges crop it. Bottom-left in every tile, 20px in: the capability's name at 18px medium and one line at 15px. One 6×2 tile holds only the heading, two to four words at clamp(36px, 4vw, 60px), top-left.
On a phone: Two columns, 6px gaps, rows of 28vw. Large tiles span both columns and three rows; the rest are one column by two rows. The heading tile leads at full width, two rows tall, type at 9vw. Enlarged elements keep their scale and are cropped harder; captions stay bottom-left at 16px and 14px.

Adjusted for this page:
- It sets text at 10px: use your small step (13px or more) instead.

### 4. showcase — One control, blown up (full-bleed)
A flat saturated field, full-bleed and 92svh tall, holds one working control from the product: the toggle, slider, segmented switch or record button the whole product turns on. Build it at true proportions with every dimension in em, mark its root data-ui, then raise that root's font-size until the control stands about 46vh tall. Anchor it right of centre so the section's right and bottom edges crop about a fifth of it (overflow: hidden on the section). It keeps its real label and value, now at poster size, and it works: operating it swaps the field between two palette colours and changes one word of the heading. The heading, two to four words at clamp(28px, 2.6vw, 40px), sits top-left on the page margin with one sentence at 17px beneath it. The lower-left third of the field stays empty.
On a phone: The field is 86svh. Heading and sentence sit top-left at 26px and 16px. The control is enlarged to about 130vw wide and anchored bottom-left, so the right edge crops its far end while its thumb or active segment stays within reach. It still works and still swaps the field colour.

### 5. how-it-works — One card, four fields (strip)
Four flat colour fields stand side by side across the full viewport, each 25vw wide and 84svh tall, butted together with no gaps; neighbours differ clearly in lightness. The same card from the product (a ticket, an order, a request) appears once in each field at the same height, 38% down, centred, 260px wide at true size, each copy marked data-ui. It is further along every time: bare as it arrives, then with an owner and a due date, then with its checklist half ticked, then closed with its final figure. Along the bottom of each field, 28px in, one clause at clamp(22px, 2vw, 32px) on two lines begins with its order word: 'First it lands here.' 'Then someone takes it.' The heading, two to four words at the same size in the heaviest weight, sits top-left in the first field only. On hover a field's card rises 6px over 150ms.
On a phone: The fields stack, each full width and 64svh tall, colours meeting edge to edge. In each: the clause at 24px top-left with 20px margins, then the card at true size, left-aligned, 32px below. The heading sits in the first field above its clause, at 24px in the heaviest weight.

### 6. about — Wide photo, colour tile, facts (mosaic)
Top: a heading of two to four words at clamp(40px, 4vw, 60px) on the left margin, then 24px below it a three-line lead paragraph at 21–22px across columns 1–6. 72px lower, two tiles sit side by side with a 16px gap. The left tile spans columns 1–8: a landscape photograph at 16:10 with one radius (0 or 10px). A short paragraph of up to 35 words at 16px is set in a solid paper-colour block 320px wide with 20px padding, placed over the photograph's top-right corner and flush with both edges. The right tile spans columns 9–12 and is a flat palette colour, 60% of the photograph's height: it holds a simple inline SVG outline of the region or the floor plan as one filled shape, with one solid dot marking the location. Under the colour tile, four label and value pairs at 14px in a two-by-two grid: altitude, distance, season, local time.
On a phone: Heading at 9vw, lead at 18px. The photograph goes full width at 4:3 and its overlaid paragraph moves beneath it as ordinary text. The colour tile follows at full width and 3:2, and the four label and value pairs sit under it in two columns.

Adjusted for this page:
- It sets text at 10px: use your small step (13px or more) instead.

### 7. cta — The reply card (split)
The invitation to act is a printed card lying on the page. On a dark or strongly coloured flat field about 80svh tall, a paper-coloured panel 44vw wide with 7:5 proportions sits in columns 6–12, rotated two degrees, with its lower edge hanging 60px past the section's bottom so the section crops it. On the card, with 48px padding, everything is centred the way stationery is: a heading of two to four words at 32px, one or two lines at 17px, then the action as a solid bar across the card's full inner width, 56px tall, in the ink colour with paper-coloured text. Columns 1–4 hold only a short paragraph at 20–24px in the field's light ink, bottom-aligned 64px above the edge. The card is a plain filled rectangle with square corners and no outline; its rotation and crop make it an object.
On a phone: The paragraph comes first at 20px. The card follows at 90% width, tilted one degree, centred, its bottom edge still cropped by the section. Heading at 24px, lines at 16px, and the action bar 52px tall across the full inner width of the card.

### 8. footer — Invitation over a cropped name (statement)
Close and footer in one full-viewport field of the inverse colour. Upper third, columns 1–7: a two-line invitation at about 5vw, three to five words, with one filled rectangular button beneath it. At columns 10–12, top-aligned with the invitation, three or four social or contact links stacked at 16px. The wordmark fills the bottom of the screen at 26–30vw on one line, `white-space: nowrap`, heavier and larger than the viewport can hold: it is pushed down with `transform: translateY(30%)` so the bottom edge cuts through the letters, and a long name also runs off the right edge. `overflow: hidden` on the footer does the cropping. One row of credits and legal links at 13px sits directly above the wordmark's cap line, spread left and right. The cropped name must be recognisable from its upper two-thirds alone; test that it is.
On a phone: Invitation at 11vw on two lines at the top with a full-width button. Links follow as one row of words at 15px. The wordmark sits at 34vw at the bottom, cropped by both the bottom and the right edge, with the legal row above it at 12px.

Adjusted for this page:
- It sets text at 12px: use your small step (13px or more) instead.

## 8. Motion — Masked headline
On load, each line of the headline rises from behind its own baseline, about 900ms with a strong ease-out, the second line 110ms after the first; the supporting sentence and the action then fade up together. Nothing else on the page performs. Because headlines are two lines at most, you author the line breaks and wrap each line yourself. Recipe: 'Masked line reveal' in references/motion.md.
This is the signature move, the one loud moment. Around it the page still needs the rest of the motion layer (SKILL.md step 9): an entrance for the parts of every section, feedback on every control, and one moving picture. The inspector fails a page that barely moves. Recipes: references/motion.md.

## 10. Where the richness comes from
Colour mass, type mass, and overlap.

## 11. How this direction goes wrong
Headlines still obey the two-line rule: at 13vw that means very few words, which is correct for this voice. No outlines, no offset shadows, no sticker confetti. Rotation is for two or three images only, never for text blocks.

## 12. Real references
Studied sites that work this way. Take the principle, never the specifics: no names, copy, images or signature assets of theirs.
- **UGLYCASH** (One Page Love, studied score 7.4) `opl-uglycash`
  Idea: A money app sold like streetwear: one shouted condensed headline over the phone, then sticker-covered 3D props where feature icons would normally go.
  Hero: Near-white page. A floating light-grey nav bar only 35% of the viewport wide sits centred 20px from the top: condensed wordmark left, two social icons in the middle, an app button with a glowing magenta outline right. Directly beneath, a two-line uppercase headline in bold condensed grotesque at 11.4vw, centred, leading under 0.9, about 60% of the width, with a faint cyan and magenta fringe on the letter edges; it fills the band from 12% to 43% of the height. A single phone mockup 27% of the viewport wide rises immediately under the headline, centred, cut off by the bottom edge. Its magenta screen glow is the only colour.
  Worth taking: Make the nav a short floating bar a third of the viewport wide so the headline can start almost at the top edge.
- **Depo Budget App** (One Page Love, studied score 6.9) `opl-depo-budget-app`
  Idea: Budgeting reduced to one daily number, dressed in neo-brutalist sticker graphics: flat primaries, thick black outlines and a hard offset shadow on every box.
  Hero: Saturated blue field with a faint grid of 100px squares. A 72px header holds a white wordmark left and a black store badge right, above a 3px black rule. Left column, starting 7% in and vertically centred: a cream box with black border holding one line of uppercase mono, a two-line white headline in very heavy grotesque at 5.3vw, two lines of 20px white copy, and a coral button with black border and hard offset shadow. Right of centre: an illustrated phone tilted about 4 degrees, 24% of the width and nearly full height, thick black outline, star stickers on two corners. A lime marquee strip closes the bottom.
  Worth taking: Give each section its own flat saturated fill and separate them with a 3px black rule, so colour does the sectioning.
- **Illoca** (Awwwards Site of the Day, studied score 8.2) `aww-illoca`
  Idea: Software for architects sold as a drafting table: a two-colour illustrated studio on graph paper that the scroll camera pushes into until the drawing fills the screen.
  Hero: Captured on the preloader: a beige graph-paper field (12px grid) with a small cobalt logo tile dead centre, handwritten X/Y cursor coordinates top-left and an email in architect's hand lettering top-right. Loaded, a centred grotesk headline at 7.7vw in near-black sits at the top, breaking over two lines in the capture, with a tiny hand-lettered margin note and arrow beside its last word. Directly beneath, inset 12px from each side, a huge wide cel-shaded scene in only cobalt and beige: an architect at a drafting desk beside a window with a skyline. A small white nav capsule floats top-centre with logo, three mono links and a navy button.
  Worth taking: Restrict a detailed 3D scene to two flat colours (one ink, one paper) so it reads as a printed illustration rather than a render.
Full notes on any of them: `node draw.mjs --site <id>`.

## Always
Headlines two lines or fewer at every width. No eyebrow labels, no monospace, no 01/02/03, no thin rules, no gradients, no shadows at rest,
no cream-and-terracotta, no violet. The frame: one h1 on the first screen that says what this is, equal outer margins, no
section huddled on one side with the other half empty, no blank stretch over half a screen, a heading on every section.
`inspect.mjs` measures all of it.

Saved to /home/user/tpi-website-ai-poc/.taste-skill/loud-flat-poster/direction.json · reprint with `node draw.mjs --show`
````
