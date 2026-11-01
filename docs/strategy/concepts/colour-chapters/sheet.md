# Colour chapters（`colour-chapters`）

`draw.mjs --direction colour-chapters` 發出的 direction sheet 加上 redraw 後的版本（seed 759717745，2026-11-01）。最後一節「Direction sheet」是 `draw.mjs --show` 的原樣輸出（英文）；前面幾節是本站的補充。共用的論點與文案在 [`../argument.md`](../argument.md)、[`../copy-deck.md`](../copy-deck.md)，參數在 [`../options.md`](../options.md)。

## Redraw

| # | 位置 | 原本發的 | 換成 | 理由 |
|---|---|---|---|---|
| 1 | `hero` | `Tabbed folder stack`（標題下面疊五個資料夾） | `Giant cropped shape` | 和 `one-motif` 發到同一個 hero，兩個方向的第一屏只差顏色與字體。`design-concept` skill 第 3 節第 2 步規定方向之間要明顯不同、只換顏色不算，所以重發這一格 |
| 2 | `section:list` | `list-poster-lines`（4–7 個項目一行一個，10vw 大字） | `list-statement-table-pushed-right` | 第 2 段只有金融、政府兩個產業，湊不出 4–7 行；把規範的原文縮成 10vw 的短詞會丟掉事實。換的版型是標題加推到右側的表格，6 列原文分兩組。這個 blueprint 和 `one-motif` 的 `list` 相同：列表類的其他 blueprint 不是要 12 列以上、要照片，就是已經用在別的方向，這裡重複一段 |
| 3 | `section:work` | `work-staggered-tiles-empty-cells`（八個案例的交錯格） | `work-panels-midline-row` | 原本的格子是為 8 個案例設計的，案例只有 3 則，也不補範例案例。換的版型是每則案例一整個畫面、同一列文字固定在畫面中線，3 則就是 3 個畫面（blueprint 寫 4–7 個，幾何 3 個也成立） |

`hero` 重發後，motion 仍然是「Index with preview」，和 `one-motif` 相同；兩個方向的差異在 hero、配色、字體與六段的版型。

## Idea 句

> On this page, **the line between what a bank or agency already runs (core banking systems, mainframes, the ESB, its WAF) and what TPI connects to it** becomes **the chapter colours: grey chapters are the existing systems, orange chapters are TPI's part, and the hard edge where two flat fields meet is the connection; in the hero the pair is two giant shapes overlapping by a quarter**.

中文：既有系統和昕力接上去的部分之間那條界線（`argument.md` 清點第 8 項，P3），變成段落的顏色：灰色的段落是銀行或機關原本的系統，橘色的段落是昕力的部分，兩片平塗色碰在一起的硬邊就是接點；hero 裡是兩個重疊四分之一的大形狀。

sheet 的橘（`#ff6831`）和昕力的品牌橘（`--orange-500` `#ff6329`）幾乎相同。使用者決定配色照發牌，所以照 sheet 用 `#ff6831`，不換。

Competitor test：把 Syscom（金融、政府系統整合）放進第一格，「既有系統與新東西的界線」這件事系統整合商都能說，屬於類別的部分較多；能撐住的是兩點：橘色和昕力的品牌橘幾乎相同，以及每一段灰色裡寫的是昕力事實裡點名的系統（核心銀行系統、大型主機、ESB、F5 與 No Name Security 的 WAF）。這是五個方向裡 competitor test 最弱的一個。

## 可以操作的一件事

`showcase`（OrientAI）的放大控制項做成「Token 用量監控」開關：切換時整段在灰與橘之間換色，標題的一個詞跟著換，下方顯示 `fact:orientai-governance-layer` 的原文。沒有 script 時顯示開啟狀態與原文。

## 照本站規則的調整

- 品牌紫：sheet 的 accent（薄荷綠 `#a7ff9c`）原本也是按鈕色，主要 CTA 改用品牌紫 `#662e8d`。紫和白底的對比是 8.97:1、和薄荷綠是 7.45:1、和灰（`#c5c5c5`）是 5.20:1、和黑是 2.34:1，所以按鈕不放在黑底段落上。`cta`（`One word is the button`）整段的底色用紫、字用白。inspector 加 `--allow palette-purple`
- 字體：Cabinet Grotesk 只有拉丁字母，中文落到系統字的最粗字重
- hero 的 h1：blueprint 要第 1–6 欄、6.4vw、每行約 12 個拉丁字元；共用的 h1 第一行 8 個全形字寬，6.4vw（約 82px）時約 656px，比第 1–6 欄寬一些。先加寬到第 1–7 欄，仍放不下時字級降到 5.6vw。375 寬改 10.5vw（約 39px）
- hero 的形狀：灰色的大形狀是既有系統，橘色的第二個形狀重疊四分之一是昕力。形狀用平塗，`mix-blend-mode: multiply` 只用在兩個形狀重疊處，不用漸層
- `features`（`Four cards dealt into a fan`）：四張卡片就是四個產品家族，名稱、一張圖、一句話照 `copy-deck.md` 第 4 段；固定的舞台最多兩到三個畫面高（sheet 的調整）
- `how-it-works`（`Tiles that grow`）：四個階段照 `copy-deck.md` 第 6 段，每塊放同一張 AI 導入卡片的介面片段，從空白到完成
- `about`（`Two columns, highlighted words`）：110–160 字的段落用第 7 段的 6 條原文串成，螢光筆標出年份、地點與認證；串接的字是表述，原文不改
- 頁尾（`Name first, places under it`）：地點與聯絡方式用 `fact:office-taipei-address`、`fact:office-taipei-phone`、`fact:company-email`；sheet 已註明不裁掉字母的上緣
- 介面片段：根元素標 `data-ui`，標籤只用事實裡的詞；版面是原型畫的，不是產品的真實畫面
- 字型與圖片都放進方向目錄，原型離線打開

## 需要的圖片

段落底色是平塗色時，裡面的照片轉成黑白（sheet「Colour」）。

| 位置 | 要什麼 | 開放圖庫的查詢詞 |
|---|---|---|
| `work` 三個整頁畫面 | 每則案例讀的文件或作業的場域，裁得很近 | `medical certificate close-up`、`insurance claim form historical`、`bank ledger archive` |
| `features` 四張卡片的圖 | DigiLism：大型主機；ESGswift：工廠煙囪或電廠；GadoSecurity：硬體安全金鑰；SysTalk.ai：介面片段 | `IBM mainframe`、`power plant chimney`、`hardware security key` |
| `how-it-works` 四塊、`showcase` 控制項 | HTML 介面片段 | — |
| hero | 兩個平塗形狀，不用照片 | — |

Scroll scene：sheet 沒有發，不需要 GSAP、Lenis。`features` 的扇形與 signature move「Index with preview」用 `position: sticky` 與原生 script 做。

## Direction sheet

````text
# DIRECTION SHEET — Colour chapters
seed 759717745 · drawn 2026-11-01 · redraws: 3 · sector saas
Brief: TPIsoftware (昕力資訊), a Taiwanese enterprise software maker that builds and deploys its own API management, integration and on-premises AI products for banks, insurers and government agencies, connecting them to the core systems they already run

| | |
| --- | --- |
| Direction | Colour chapters |
| Hero | Giant cropped shape |
| Type | Cabinet Grotesk |
| Colour | Grey, mint, orange |
| Sections | list (Statement, table pushed right) → work (Full panels, one midline row) → features (Four cards dealt into a fan) → showcase (One control, blown up) → how-it-works (Tiles that grow) → about (Two columns, highlighted words) → cta (One word is the button) → footer (Name first, places under it) |
| Motion | Index with preview |
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
Every section is a chapter with its own flat colour, floor to ceiling. The page reads like a set of posters hung in a row, held together by one typeface and one grid. The colours are not decoration: they come from the subject (the brand's packaging, the artist's record sleeves, the product's own colour ways, the categories of the content) and each chapter's colour means that chapter. Decide the sequence like a designer orders a book: a strong opener, a quiet second, a surprise in the middle, a dark or very light closer.

Before anything else, write one sentence in your notes: "On this page, <the subject's own material> becomes <the device>."
Fill the first blank from your inventory of what only this client has (its name and what it means, its street, its numbers, its
constraint), then put the nearest competitor in the sentence: if it still works, the idea is the category's, not the client's.
Then name the one live thing the visitor can do on the page (SKILL.md step 4).

## 2. Composition
Sections are full-bleed fields, each at least 90svh tall, butted directly against each other with no gap and no divider. Inside every field the same 12-column grid and the same margins apply, and each field holds one thing: a huge heading (8–12vw) with a small paragraph, or one photograph with a caption, or one list. Text colour is chosen per field for strong contrast (ink or paper, never grey). Headings start on the same left edge in every chapter, so the eye feels the system as colours change. The navigation and the footer take the colours of the first and last chapter.

## 3. Type — Cabinet Grotesk
A heavy sans with tight joins and an eccentric lowercase, friendly but loud. Suits bookshops, food, consumer subscriptions and marketing studios.
```html
<link rel="preconnect" href="https://api.fontshare.com">
<link rel="preconnect" href="https://cdn.fontshare.com" crossorigin>
<link href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,800&display=swap" rel="stylesheet">
```
- Display: **Cabinet Grotesk** — weight 800 · tracking -0.035em · leading 0.9 · lowercase or sentence case, one or two words per line
- Text: **Cabinet Grotesk** — 400 for body, 500 for emphasis · leading 1.5 · tracking 0
```css
:root {
  --step-small: clamp(0.8125rem, 0.79rem + 0.1vw, 0.875rem);
  --step-body: clamp(1.0625rem, 1rem + 0.25vw, 1.1875rem);
  --step-lead: clamp(1.25rem, 1.1rem + 0.7vw, 1.625rem);
  --step-head: clamp(2.5rem, 1.2rem + 5vw, 5.5rem);
}
```
One typeface in two weights. Headings very large and tight; body 18–20px. Because colour is loud, the type stays plain: no italics, no second face.
The direction decides sizes and how many of them; the type system decides how this face is set. Where the two give different tracking or leading, use the values of the type system: they are tuned to this face.
The display size itself comes from the hero blueprint below.

## 4. Colour — Grey, mint, orange
```css
:root {
  --bg: #ffffff;
  --surface: #f5f5f5;
  --ink: #000000;
  --muted: #666666;
  --accent: #a7ff9c;
  --accent-ink: #000000;
  --field-1: #c5c5c5;  --field-1-ink: #000000;
  --field-2: #a7ff9c;  --field-2-ink: #000000;
  --field-3: #ff6831;  --field-3-ink: #000000;
  --field-4: #000000;  --field-4-ink: #ffffff;
}
```
Black on white to start, then whole sections flood with flat mid-grey, acid mint and orange in turn. Photographs inside a flooded section are shown in black-and-white, and mint is also the button colour on white and black.
Four to six flat fields used at full strength, one per section, each with its assigned text colour. No tints, no gradients between them: the hard edge where two fields meet is the look.

## 5. Imagery
**This subject is software and there are no screenshots, so its pictures are its own interface.** Wherever this sheet says photograph, image or object, build a believable fragment of the product in HTML at real size (real labels, numbers that add up, one item hovered or selected) by the app-screen rules (references/app-screens.md: deal its style once with `node <skill>/scripts/draw.mjs --app --kind <kind> --keep palette,type --out .taste-skill/app`, and build it with assets/app.css and assets/charts.js), put the attribute `data-ui` on its root, and crop or scale it the way the blueprint treats a photograph: a full-bleed close crop, a tile, the fixed half of a split. Where a fragment makes no sense, use a flat colour field with type on it. Never a fake dashboard of grey bars, never a device frame. If the product works on something physical (ships, plants, buildings, a city), one real picture of that world can carry a section: find it with `node /home/user/tpi-website-ai-poc/.claude/skills/taste-skill/scripts/assets.mjs "<that world>"`, download it with `--get`, credit it on the page, and never let it pass for the product or its customers.

Sparing. One photograph or object per chapter at most, either cut out and sitting directly on the colour, or a plain rectangle with generous colour around it. Photographs should be simple enough not to fight the field.

**Floor (the inspector checks it):** at least four real pictures on the page, usually six to twelve; SVG drawings do not count. One moving picture where an honest clip exists: `node <skill>/scripts/assets.mjs --video "<query>"`, used as a muted loop with a poster frame. Whatever this direction says about pictures, it is carried out with real ones.

Optional atmosphere, two at most, from the "Architecture" set (structure, lines, bridges, facades and building interiors). The page does not need them.
Order of preference for imagery: (1) the project's own photographs and product shots; (2) images you generate, if an image tool is
available; (3) real pictures of the subject's world found in the open collections (assets.mjs, downloaded and credited on the page);
(4) drawings of the subject in code; (5) these. They are real photographs (Unsplash licence, served by picsum.photos) of places, light and
texture. They are atmosphere, never a stand-in for a specific product, dish, person or interface. List the ones you use in your report so
they can be replaced.
- `https://picsum.photos/id/1081/1600/1000` — Stepped white modern building corner rising into a pale blue sky · light tone · white, pale blue, soft grey · calm area: top · native landscape · photo: Julien Moreau
- `https://picsum.photos/id/942/1600/1000` — White angular concrete building against a black sky · dark tone · black, white, pale grey · black-and-white · calm area: top · native landscape · photo: Carl Nenzen Loven
- `https://picsum.photos/id/893/1600/1000` — Curved latticed building facade forming sweeping lines, black and white · dark tone · black, white, grey · black-and-white · native landscape · photo: Samuel Zeller
- `https://picsum.photos/id/743/1600/1000` — Narrow wedge-shaped building corner seen from below against a teal sky · mid tone · teal blue, sandstone, warm brown · calm area: left · native landscape · photo: Anthony DELANOIX
The last two path numbers are width and height: request the exact crop you render (`/1200/1500` for a 4:5 portrait, `/2400/1350` for a hero) and
add `?grayscale` to desaturate. Use at most two. Always set `width`, `height`, `alt` and `loading="lazy"` (not on the hero image).
Other sets that fit this brief: fog-and-quiet, sky-and-space — `node draw.mjs --photos <set>` prints one in full; `--photos list` shows all sets. Taking photographs from another set is your call and is not a redraw; keep them to one light and one treatment.

## 6. Hero — Giant cropped shape
A plain ground with one flat shape at enormous scale. The shape is the simplest geometry found in the subject (a circle, a ring segment, a chamfered block, an arch), drawn in CSS or as a single inline SVG path and filled with the accent colour. It is about 120vh across and enters from the right, centred near 78% of the width and 55% of the height, so the top, right and bottom edges of the viewport crop it and its left boundary reaches column 7. If the subject has a true pair (two accounts, two modes), a second shape in a second flat colour overlaps the first by a quarter with `mix-blend-mode: multiply`. The headline sits on the bare ground on columns 1–6, vertically centred, flush left at 8% from the left edge: two lines at clamp(64px, 6.4vw, 100px), heavy weight, tracking -0.03em. Beneath it comes one supporting sentence at 19px, then the single action as a solid button cut to the same shape. A bold wordmark sits top-left at 32px; up to three text links sit top-right in the ground colour.

On a phone: The shape moves to the bottom: 130vw across, centred horizontally, its top at 56svh, cropped by the left, right and bottom edges. The headline sits above it at 11.5vw on two lines at a 16px margin, starting 15% down, with the sentence at 16px and the motif-shaped button beneath. Wordmark top-left; the links collapse to one word top-right.
Headline: Two lines of two or three words each, up to about 12 characters per line at 6.4vw.

## 7. Sections, in order
Each is a composition to rebuild with this project's content. Keep the geometry; change the subject. Re-order or drop a
section when the argument of the page needs it (see references/copy.md), never to fall back to a card grid.

### 1. list — Statement, table pushed right (table)
A heading of four to six words spans the full width on two lines at clamp(40px, 4.5vw, 68px), left-aligned with its first line indented 3vw and leading 0.98. 96px below, the table is pushed into the right-hand five columns (8–12) and the left stays open. One plain word naming the table (offices, hours, rates) hangs at 14px in column 7, top-aligned with the first row. Each row is a three-part line at 15–16px with 26px between rows: the kind or day in the soft ink at the left of the measure, the place or service at 30%, and the address, time or price right-aligned, with a small arrow where the row links. Rows are separated by space only; every fourth row has 44px above it to form groups. In columns 1–4, bottom-aligned with the last row, one 4:5 photograph 22vw wide may sit alone. Holds 5–14 rows.
On a phone: Heading at 9.5vw without the indent. The table takes the full width at 16px; each row stacks the kind above the place, with the value right-aligned on the first line. The naming word is dropped because the heading already says it. The photograph follows at 60% width on the right margin.

### 2. work — Full panels, one midline row (full-bleed)
Four to seven consecutive panels, each 100vw by 100svh, butted together with no gap. Each panel is one photograph of the project cropped much tighter than its frame (`object-fit: cover` with the image scaled to 130%), so a detail fills the screen. The same three-part text row sits at exactly 50% of the height on every panel, in white with `mix-blend-mode: difference` or over a neutral dark scrim band 90px tall: the date or year at the left margin at 15px, the project title in capitals at clamp(22px, 2vw, 30px) starting 10% in from the left, and one fact (location, client, number of pieces) at the right margin at 15px. Because the row never moves, scrolling reads like turning plates in a book. Panels may be `position: sticky; top: 0` so each slides over the last. There is no section heading; the first panel's title row is the heading.
On a phone: Panels are 100vw by 82svh. The row drops to the bottom of each panel, 20px above its edge: the title at 22px on the first line, then date at the left and fact at the right on a second line at 13px, over the same scrim band.

Adjusted for this page:
- It names a kind of typeface: use the dealt faces (display Cabinet Grotesk, text Cabinet Grotesk) and their settings; capitals only where the type system sets them.
- It names colours (white): map them onto this palette's roles (ground `--bg`, panels `--surface` and the fields, text `--ink`/`--muted`, the accent `--accent` on the primary action only).
- It blends text with `difference`: over anything but black, white or grey that gives random hues. Use a solid ink chosen for each ground instead.

### 3. features — Four cards dealt into a fan (pinned)
Four values, rules or features, each on a card dealt onto the table as the page scrolls. A wrapper about 400svh tall holds a sticky stage of 100svh on the page's darkest flat ground. Each card is a portrait panel of 340×400px with a 20px radius, filled with its own palette colour (four colours that differ clearly in lightness), no border, no shadow. On a card, with 28px padding: its name at 32px in heavy capitals on one or two lines at the top, a photograph or a single picture of the thing at 60% of the card's width in the middle, and one sentence at 16px at the foot. Card one lands alone at the centre; each further quarter of the wrapper deals the next from below the bottom edge, landing 250px to the right of the one before, rotated between -4 and 4 degrees and overlapping only its right 90px, until the four form a fan about 1,090px wide centred on the stage. Keep each card's name, picture and sentence inside its left 240px, so no card ever covers another's words. In the study the cards overlap by two thirds and bury the earlier titles; here nothing lies on top of text. The heading, two to four words at clamp(40px, 4vw, 60px), sits top-left on the stage on the 32px margin with one sentence at 17px under it. The stage releases after the fourth card has settled; under reduced motion the fan is simply there.
On a phone: No pin. The cards sit in one row that scrolls sideways with scroll-snap, each 82% of the width with the next peeking in at the right edge, all upright. The heading and sentence sit above the row.

Adjusted for this page:
- It names its own corners: use the one radius of this page (square unless the direction says otherwise) and one button shape.
- It names a kind of typeface: use the dealt faces (display Cabinet Grotesk, text Cabinet Grotesk) and their settings; capitals only where the type system sets them.
- It draws lines or borders: keep them only inside a table, a form or a `data-ui` fragment; elsewhere separate with space or a change of ground.
- It mentions a shadow: only on something open above the page (a menu, a dialog), never on a resting element.
- It pins something for three screens or more: hold a pin for two or three screens at most, give every screen under it its own content, and let nothing pass over the pinned words (the inspector checks all three).

### 4. showcase — One control, blown up (full-bleed)
A flat saturated field, full-bleed and 92svh tall, holds one working control from the product: the toggle, slider, segmented switch or record button the whole product turns on. Build it at true proportions with every dimension in em, mark its root data-ui, then raise that root's font-size until the control stands about 46vh tall. Anchor it right of centre so the section's right and bottom edges crop about a fifth of it (overflow: hidden on the section). It keeps its real label and value, now at poster size, and it works: operating it swaps the field between two palette colours and changes one word of the heading. The heading, two to four words at clamp(28px, 2.6vw, 40px), sits top-left on the page margin with one sentence at 17px beneath it. The lower-left third of the field stays empty.
On a phone: The field is 86svh. Heading and sentence sit top-left at 26px and 16px. The control is enlarged to about 130vw wide and anchored bottom-left, so the right edge crops its far end while its thumb or active segment stays within reach. It still works and still swaps the field colour.

### 5. how-it-works — Tiles that grow (grid)
Order is carried by size. Three flat colour tiles stand in one row, bottom-aligned (align-items: end) with 10px gaps, each larger than the one before: columns 1–3 at 30vh tall, columns 4–7 at 44vh, columns 8–12 at 60vh. Each tile holds one photograph of the subject at that stage (raw, in progress, finished), centred and scaled so the object grows from tile to tile; on light tiles mix-blend-mode: multiply removes a white studio background. One palette colour per tile. Text sits under the tiles, outside them, aligned to each tile's left edge: a stage name at 20px medium whose wording carries the order ('Picked', 'Pressed', 'Poured') and two lines at 16px in the soft ink. The heading, two to four words at 40–52px, occupies the empty ground above the two smaller tiles, top-aligned with the tallest tile. A fourth stage is possible with spans of 2, 3, 3 and 4 columns.
On a phone: Tiles stack in order and grow in height instead: 34vw, 46vw and 62vw tall, each at full width. The name and text sit under each tile at 18px and 16px. The heading comes first at 30px. 28px between stages.

### 6. about — Two columns, highlighted words (statement)
The story is set as text far larger than anything else on the page: 110–160 words at clamp(22px, 2.1vw, 32px), tight leading 1.18, in the soft ink, flowing through two columns that fill the full width between 24px margins (`columns: 2; column-gap: 32px`, justified, with hyphenation on). No heading. The name at the start is in full ink. Six or seven single words or short phrases carry a flat highlighter background in three or four palette colours, built with an inline `background-color`, `box-decoration-break: clone` and 0.1em of horizontal padding; they mark the facts a scanning reader wants (a place, a year, a client, a skill). The final short sentence is highlighted entire in the strongest colour and is the link to contact. Padding 120px top and bottom. No image and no portrait.
On a phone: One column at 20px, left-aligned and unjustified, leading 1.25, with 18px margins. Keep four or five highlights so no line carries two. The final highlighted sentence sits on its own line with 24px above it and works as a full-width tap target.

### 7. cta — One word is the button (band)
The entire band is one link. A full-bleed field in the accent colour, about 60svh tall, contains a single verb of four to eight letters set at 24–30vw in the heaviest weight, tight tracking, sized with `clamp()` so it spans the content width on one line with its baseline 24px above the bottom edge. The `<a>` wraps the whole band; on hover and focus the field and the word swap colours instantly. In the top-left corner, at 20px, one sentence says what happens next; in the top-right, an arrow drawn as a simple inline SVG, 48px, points up and right. There is no other button anywhere in the section. In a page with a motif, the band's top corners take the motif's shape (a large radius, or a chamfer cut with `clip-path`). Keep the word honest: the action itself, not a slogan.
On a phone: The band is 46svh tall. The word is set at whatever size fills the width on one line; choose a shorter verb rather than going below 22vw. Sentence top-left at 17px across two lines, arrow top-right at 32px. The whole band stays tappable.

### 8. footer — Name first, places under it (list)
The wordmark opens the footer instead of closing it. On a full-bleed field in the page's inverse or final chapter colour, the name spans the full content width as the first thing, its cap line pushed 8% above the footer's top edge so the tops of the letters are sliced off by the section (`overflow: hidden` and a negative top margin in `em`). 72px beneath, a two-part row: columns 1–5 list the places or ways to reach the studio (cities, or email and telephone), one per line at 32–36px in the accent ink, each a link; columns 7–12 hold three columns of small links at 15px, top-aligned with the first place. A final row 96px lower carries the legal line at the left and a back-to-top text link at the right, both 13px. The field is about 90svh tall, and nothing sits between the wordmark and the row but space.
On a phone: The sliced wordmark stays at the top, fitted to the width. Places follow as a list at 26px, then the link columns two across at 15px. Legal line and back-to-top link share the last row at 12px, at opposite margins.

Adjusted for this page:
- It sets text at 12px: use your small step (13px or more) instead.
- It crops letters along their top: the inspector fails that (jurors read it as broken). Crop at the bottom edge or a side instead.

## 8. Motion — Index with preview
Rows of text are the navigation through the work; pointing at a row brings up its image in one fixed frame and dims the other rows. On touch screens each row shows its image inline instead. Fast and exact (about 240ms crossfade), no lag behind the pointer. Recipe: 'Index with preview, anchored to the row' in references/motion.md.
This is the signature move, the one loud moment. Around it the page still needs the rest of the motion layer (SKILL.md step 9): an entrance for the parts of every section, feedback on every control, and one moving picture. The inspector fails a page that barely moves. Recipes: references/motion.md.

## 10. Where the richness comes from
Colour at scale. A whole screen of one saturated colour is rich on its own, so a chapter needs few elements; it still needs its content at full size, because a coloured screen with one small line on it reads as empty.

## 11. How this direction goes wrong
Check contrast on every field with the palette's assigned ink. Do not put cards on the fields. Do not use more than six colours. Two neighbouring fields should differ clearly in lightness as well as hue.

## 12. Real references
Studied sites that work this way. Take the principle, never the specifics: no names, copy, images or signature assets of theirs.
- **Paul Kalkbrenner** (Awwwards Site of the Day, studied score 8.1) `aww-paul-kalkbrenner`
  Idea: Swiss poster typography for a techno artist: the name as one black line with a photo set inside it like a glyph, then every chapter gets its own flat colour and visible grid.
  Hero: Pure white viewport. The artist's name sits on one line at exact vertical centre in bold black neo-grotesk, about 10.4vw, spanning roughly 78% of the width with equal side margins. The space between first and last name is replaced by a small landscape black-and-white photo, x-height tall and resting on the baseline. Top-left is a tiny circular monogram; eight nav links in 13px bold are spread at even intervals across the right half of the top edge. Bottom edge: equaliser bars with a grey label over a track title at left, a three-line bold blurb starting just left of centre, a sound toggle hard right. About 85% is empty.
  Worth taking: Replace the space between the two words of a giant name with a small photo cropped to x-height.
- **Ai in Design Report 2026** (Awwwards Site of the Day, studied score 8.4) `aww-ai-in-design-report-2026`
  Idea: A research report laid out like a colour-blocked print annual: a thermal-blurred video collage on top, an oversized tight grotesk title, and flat orange, lilac, sage and black blocks carrying stats, quotes and chapters.
  Hero: The top 53% is a full-width video band: blurred, heat-map-like abstract footage in orange, lilac and sage, overlaid with four or five hard-edged rectangles of the same footage in grey or green, two tagged with tiny mono labels in white boxes. The header sits flush on top: a black logo block at far left, an orange link tab running to 40% of the width, two plain links at right. Below the band, on white: a two-line deck at about 1.4vw on a 1% left margin, and from 42% across a two-line title at 8.3vw, medium weight, tracking -0.06em. Bottom row: mono credit left, scroll cue and arrow aligned to the title column.
  Worth taking: Start most headings and text at a fixed column line about 42% across, leaving the left for small decks, credits and chapter numbers.
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

Saved to /home/user/tpi-website-ai-poc/.taste-skill/colour-chapters/direction.json · reprint with `node draw.mjs --show`
````
