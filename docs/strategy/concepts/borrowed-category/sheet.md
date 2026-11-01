# Dressed as something else（`borrowed-category`）

`draw.mjs --direction borrowed-category` 發出的 direction sheet（seed 1677797083，2026-11-01），沒有 redraw。最後一節「Direction sheet」是 `draw.mjs --show` 的原樣輸出（英文）；前面幾節是本站的補充。共用的論點與文案在 [`../argument.md`](../argument.md)、[`../copy-deck.md`](../copy-deck.md)，參數在 [`../options.md`](../options.md)。

## Redraw

沒有。每段的 blueprint 都裝得下真實內容，以下兩段的內容比 blueprint 少，照實做、不補範例：

- `list`（`list-lineup-one-size`）寫 12–40 列，第 2 段有 6 列。blueprint 自己寫了少於 8 列時字級提高到 3vw；兩個產業當作「日」的標題，每個產業 3 列
- `work`（`work-big-names-fixed-preview`）寫 5–9 個名字，案例只有 3 則。三個名字加右側固定的預覽框，幾何仍然成立

## 借來的類別

一個詞：**音樂祭節目單**。API 管理與合規軟體給人的感覺是乾、悶、怕出錯；音樂祭海報與節目單有的是「誰上台、在哪一台、幾點」的直接與熱鬧。照 sheet 的 composition，結構維持 hero 加四到六段，每段都用節目單的手法：大字排在鈷藍底上、節目表一行一列、一個詞就是按鈕。

## Idea 句

> On this page, **the rules TPI's products are built to and the named projects that prove it — the FSC open-banking rules, the NDC common API specification, financial inspection, Taipei City Government, Taishin Bank** becomes **a festival line-up: the rules are billed as the headliners in heavy type on electric cobalt, and the programme rows read rule, product, industry, link**.

中文：昕力的產品對應的法規與具名案例（`argument.md` 清點第 5、9 項），像音樂祭的卡司一樣掛在鈷藍色的海報上，節目表一列是一條規範、對應的產品、產業與連結。

Competitor test：把 GSS（也是自有產品加導入）放進第一格，GSS 的首頁沒有寫任何法規（`competitors.md`），卡司排不出來，所以這個 idea 屬於昕力。風險是語氣：音樂祭的熱鬧和 P4「克制與可預期」的距離最遠，交 reviewer 與人判斷。

## 可以操作的一件事

`showcase`（OrientAI）的放大控制項做成「消除影子 AI」開關：切換時整段底色在兩個 palette 色之間換，標題的一個詞跟著換，下方顯示 `fact:orientai-governance-layer` 的原文。沒有 script 時顯示開啟狀態與原文。

## 照本站規則的調整

- 品牌紫：sheet 的 accent（黃 `#e9e34a`）原本是全頁唯一的另一個顏色，用在按鈕。照使用者決定，主要 CTA 改用品牌紫 `#662e8d`。紫色和鈷藍底（`#0034eb`）的對比只有 1.15:1，紫色按鈕放在鈷藍上看不出形狀，所以 hero 的按鈕放在底部的第二色帶上，`cta` 整段的底色用紫、字用白。黃色只留給一個非按鈕的點（例如節目表當前的那一列）。這是五個方向裡品牌紫衝突最大的一個，交人決定
- 字體：Chivo 只有拉丁字母，中文落到系統字的最粗字重。h1 的「uppercase」對中文沒有作用
- hero 的 h1：blueprint 要 12vw、欄寬約 62%、16 個拉丁字元以內；共用的 h1 第一行 8 個全形字寬。先加寬欄寬到滿版（左右 20px 邊距），12vw 下 8 字約 1229px 放得下。375 寬改 11vw（約 42px）
- hero 的拱形照片：blueprint 讓照片疊在 h1 第一行的最後幾個字上面，違反 house rule「沒有東西壓在標題上」。照片改成貼著 h1 的右緣、不蓋字，仍然跨過兩個色帶的接縫
- `how-it-works`（`Many into one`）：三欄的詞照 `copy-deck.md` 第 6 段的導入順序，拆成「導入前」「導入中」與「同一家負責」，不另編流程名稱
- `about`（`Two columns, highlighted words`）：110–160 字的段落用第 7 段的 6 條原文串成，螢光筆標出年份、地點與認證；串接的字是表述，原文不改
- 介面片段：根元素標 `data-ui`，標籤只用事實裡的詞；版面是原型畫的，不是產品的真實畫面
- 字型與圖片都放進方向目錄，原型離線打開

## 需要的圖片

照片都轉成藍色單色調，或縮成小圖（sheet「Colour」）。

| 位置 | 要什麼 | 開放圖庫的查詢詞 |
|---|---|---|
| hero 的 3:4 拱形照片 | 規範與具名案例的場域：政府機關、銀行 | `Taipei City Hall`、`Financial Supervisory Commission Taiwan`、`Taiwan bank building archive` |
| `work` 預覽框三張 4:5 | 每則案例讀的文件與作業的場域 | `medical certificate document`、`insurance claim form historical`、`bank counter archive` |
| `features` 7 塊、`showcase` 控制項 | HTML 介面片段 | — |
| `how-it-works` 的圖 | 程式畫的方塊（SVG，不算進 4 張下限） | — |

Scroll scene：sheet 沒有發，不需要 GSAP、Lenis。signature move「Shutter image」用 `clip-path` 與原生 script 做。

## Direction sheet

````text
# DIRECTION SHEET — Dressed as something else
seed 1677797083 · drawn 2026-11-01 · sector saas
Brief: TPIsoftware (昕力資訊), a Taiwanese enterprise software maker that builds and deploys its own API management, integration and on-premises AI products for banks, insurers and government agencies, connecting them to the core systems they already run

| | |
| --- | --- |
| Direction | Dressed as something else |
| Hero | Flush-left shout, seam photograph |
| Type | Chivo |
| Colour | Cobalt field |
| Sections | list (Line-up at one type size) → work (Big names, fixed preview) → features (Close-ups on a board) → showcase (One control, blown up) → how-it-works (Many into one) → about (Two columns, highlighted words) → cta (One word is the button) → footer (Columns above, wordmark below) |
| Motion | Shutter image |
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
Art-direct the subject as if it belonged to a different, more vivid category. A money app is sold like a streetwear drop. An industrial roaster is presented like a design object. Drilling hardware gets the calm of a watch brand. A parcel-locker service becomes a fairground of stickers. Choose the borrowed category by asking what feeling the audience is missing from this kind of product (swagger, calm, glamour, play) and which category owns that feeling. Then take its manners completely: its type, its pacing, its way of photographing things. The contrast between dull subject and vivid dress is what people remember.

Before anything else, write one sentence in your notes: "On this page, <the subject's own material> becomes <the device>."
Fill the first blank from your inventory of what only this client has (its name and what it means, its street, its numbers, its
constraint), then put the nearest competitor in the sentence: if it still works, the idea is the category's, not the client's.
Then name the one live thing the visitor can do on the page (SKILL.md step 4).

## 2. Composition
Depends on the borrowed category, so decide it explicitly and write it in your notes. Fashion drop: one shouted condensed headline across the full width, a single cropped image under it, then product facts as a blunt list. Watch or perfume: a centred object on a dark field, a small serif name, very few words, long vertical pauses. Poster or zine: flat colour blocks, heavy type, tilted cut-out images. Museum: one item per screen on a plinth-like band of colour with a short label beside it. Whichever you choose, the page structure stays simple (four to six sections) and every section uses the borrowed manners, including pricing and the footer.

## 3. Type — Chivo
A black grotesque in capitals with letters nearly colliding, and only two sizes on the page: enormous and small. Suits agencies, city and culture projects and musicians who want the type to land like a headline.
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Chivo:wght@400;700;900&display=swap" rel="stylesheet">
```
- Display: **Chivo** — weight 900 · tracking -0.05em · leading 0.88 · uppercase
- Text: **Chivo** — 400 for paragraphs, 700 for navigation, tags and links · leading 1.35 · tracking -0.01em
```css
:root {
  --step-small: clamp(0.8125rem, 0.79rem + 0.1vw, 0.875rem);
  --step-body: clamp(1.0625rem, 1rem + 0.25vw, 1.1875rem);
  --step-lead: clamp(1.25rem, 1.1rem + 0.7vw, 1.625rem);
  --step-head: clamp(2.5rem, 1.2rem + 5vw, 5.5rem);
}
```
The borrowed category's type, fully committed: condensed and loud, or refined and small. No halfway.
The direction decides sizes and how many of them; the type system decides how this face is set. Where the two give different tracking or leading, use the values of the type system: they are tuned to this face.
The display size itself comes from the hero blueprint below.

## 4. Colour — Cobalt field
```css
:root {
  --bg: #0034eb;
  --surface: #002fd6;
  --ink: #ffffff;
  --muted: #c5d0ff;
  --accent: #e9e34a;
  --accent-ink: #111111;
}
```
One electric cobalt fills everything, with white and pale-blue type; photographs are tinted into blue monotone or kept as small thumbnails. A single yellow dot or button is the only other colour on the page.
The borrowed category's palette, which will be unlike the subject's sector norm. That mismatch is intended.

## 5. Imagery
**This subject is software and there are no screenshots, so its pictures are its own interface.** Wherever this sheet says photograph, image or object, build a believable fragment of the product in HTML at real size (real labels, numbers that add up, one item hovered or selected) by the app-screen rules (references/app-screens.md: deal its style once with `node <skill>/scripts/draw.mjs --app --kind <kind> --keep palette,type --out .taste-skill/app`, and build it with assets/app.css and assets/charts.js), put the attribute `data-ui` on its root, and crop or scale it the way the blueprint treats a photograph: a full-bleed close crop, a tile, the fixed half of a split. Where a fragment makes no sense, use a flat colour field with type on it. Never a fake dashboard of grey bars, never a device frame. If the product works on something physical (ships, plants, buildings, a city), one real picture of that world can carry a section: find it with `node /home/user/tpi-website-ai-poc/.claude/skills/taste-skill/scripts/assets.mjs "<that world>"`, download it with `--get`, credit it on the page, and never let it pass for the product or its customers.

Photograph the subject the way the borrowed category would be photographed. With the dealt set, choose images for attitude, not literal relevance, and crop them hard.

**Floor (the inspector checks it):** at least four real pictures on the page, usually six to twelve; SVG drawings do not count. One moving picture where an honest clip exists: `node <skill>/scripts/assets.mjs --video "<query>"`, used as a muted loop with a poster frame. Whatever this direction says about pictures, it is carried out with real ones.

Optional atmosphere, two at most, from the "Architecture" set (structure, lines, bridges, facades and building interiors). The page does not need them.
Order of preference for imagery: (1) the project's own photographs and product shots; (2) images you generate, if an image tool is
available; (3) real pictures of the subject's world found in the open collections (assets.mjs, downloaded and credited on the page);
(4) drawings of the subject in code; (5) these. They are real photographs (Unsplash licence, served by picsum.photos) of places, light and
texture. They are atmosphere, never a stand-in for a specific product, dish, person or interface. List the ones you use in your report so
they can be replaced.
- `https://picsum.photos/id/1081/1600/1000` — Stepped white modern building corner rising into a pale blue sky · light tone · white, pale blue, soft grey · calm area: top · native landscape · photo: Julien Moreau
- `https://picsum.photos/id/942/1600/1000` — White angular concrete building against a black sky · dark tone · black, white, pale grey · black-and-white · calm area: top · native landscape · photo: Carl Nenzen Loven
- `https://picsum.photos/id/315/1600/1000` — View straight up a dark building lightwell to bright sky · dark tone · dark brown, white, olive · native landscape · photo: Liam Andrew
- `https://picsum.photos/id/101/1600/1000` — Concrete bunker-like building against a pale teal sky · mid tone · pale teal, concrete grey · calm area: top · native landscape · photo: Christian Bardenhorst
The last two path numbers are width and height: request the exact crop you render (`/1200/1500` for a 4:5 portrait, `/2400/1350` for a hero) and
add `?grayscale` to desaturate. Use at most two. Always set `width`, `height`, `alt` and `loading="lazy"` (not on the hero image).
Other sets that fit this brief: fog-and-quiet, sky-and-space — `node draw.mjs --photos <set>` prints one in full; `--photos list` shows all sets. Taking photographs from another set is your call and is not a redraw; keep them to one light and one treatment.

## 6. Hero — Flush-left shout, seam photograph
Borrowed from a street poster or zine. A saturated flat field covers the top 82% of the viewport; a second flat colour forms a band across the bottom 18%. The headline is two lines in an ultra-heavy face at clamp(80px, 12vw, 190px), flush left on a 20px margin, leading 0.84, reaching about 62% across the width; its first line starts 16% below the top. Right of centre one photograph is stuck on like a poster scrap: a 3:4 portrait 30% of the viewport wide (columns 8-11), clipped to an arch with clip-path or a large top border-radius, rotated 5 degrees, its top edge leaving the viewport and its lower edge straddling the seam so it sits on both colours. The photograph overlaps the last letters of the first line by about 4vw and lies above the type in the stacking order. On the bottom band, on one baseline: one supporting sentence at 20px on the left (max 40ch) and the single action, a chunky rectangle in the upper field's colour, at the right. The wordmark sits top-left at 20px; three text links top-right.

On a phone: The field takes the top 78% and the band the rest. The headline sets at 19vw on two lines flush to 16px margins, starting at 12% of the height. The arch photograph moves under the type: 58% of the width, pushed against the right edge and cropped by it, still tilted 5 degrees and straddling the seam. The sentence and the full-width action stack on the band.
Headline: A 2-4 word shout, at most 16 characters, lowercase or capitals throughout, one or two words per line.

Adjusted for this page:
- It names a kind of typeface: use the dealt faces (display Chivo, text Chivo) and their settings; capitals only where the type system sets them.
- It draws lines or borders: keep them only inside a table, a form or a `data-ui` fragment; elsewhere separate with space or a change of ground.

## 7. Sections, in order
Each is a composition to rebuild with this project's content. Keep the geometry; change the subject. Re-order or drop a
section when the argument of the page needs it (see references/copy.md), never to fall back to a card grid.

### 1. list — Line-up at one type size (table)
A full-bleed flat section. The programme is a four-column table spanning the full width between 24px margins, with every cell at one size, clamp(20px, 2.1vw, 30px), one weight, no bold: the act or session flush left, the format starting at 33%, the room or stage at 66%, and the time range right-aligned at the far edge with tabular figures. Rows are 1.5em tall and separated by nothing but that leading; the fixed column starts do the organising. Day or part headings are a single line at the same size in the accent ink with 72px above and 20px below, and may be `position: sticky; top: 0` on a strip of the section's ground colour so the current day stays in view. Breaks and changeovers are rows set in capitals in the soft ink. There is no other heading. Comfortably holds 12–40 rows; with fewer than eight, raise the size to 3vw.
On a phone: Each entry becomes two lines: the act at 22px on the first, then format, room and time on one line at 14px in the soft ink with the time right-aligned. 18px between entries. Day headings stay sticky at the top on the ground colour.

Adjusted for this page:
- It names a kind of typeface: use the dealt faces (display Chivo, text Chivo) and their settings; capitals only where the type system sets them.

### 2. work — Big names, fixed preview (index)
Project names are the index. In columns 1–8, five to nine names stack one per line at clamp(44px, 5.4vw, 80px), leading 1.0, each row a link with 10px of vertical padding. All names rest in the ink at 35% opacity except the active one, which is full ink; the first is active by default, and hover or keyboard focus moves the state. To the right of each name, on its baseline at 14px: the discipline and the year. In columns 9–12 a `position: sticky; top: 15vh` frame, 4:5 and 26vw wide with square corners, shows the active project's photograph; all images are stacked in the frame and swapped by opacity over 200ms. A two-word heading at 28px sits top-left, 48px above the first name. Nothing is drawn between rows: the size of the type and the dimming do the separating.
On a phone: Names at 9.5vw, all in full ink, one per line; discipline and year sit beneath each name at 13px. There is no sticky frame: each name is preceded by its own photograph at 16:10, full width, so the list becomes image then name, repeated, with 40px between projects.

Adjusted for this page:
- It fades text: anything a visitor reads, inactive items of a list included, is `--ink` or `--muted` at full strength (contrast 4.5:1 or more). The active item is told apart by `--ink` against `--muted`, weight or the accent, not by fading the rest.

### 3. features — Close-ups on a board (mosaic)
A board of filled tiles, each a macro view of one small part of the interface. A 12-column grid with 8px gaps, 104px rows and 10px outer margins, no empty cells, no outlines. Eight tiles in four sizes: 6×4, 6×2, 3×4 and 3×2 (columns × rows). Each tile is a flat palette colour with overflow: hidden and holds one real element, built in em and enlarged to 300–400% through the font-size of its data-ui root: a toggle, a pair of key caps, a status word on its block, one figure from a readout, a slider thumb on its track, three stacked initials discs. The element is pushed off-centre so two of the tile's edges crop it. Bottom-left in every tile, 20px in: the capability's name at 18px medium and one line at 15px. One 6×2 tile holds only the heading, two to four words at clamp(36px, 4vw, 60px), top-left.
On a phone: Two columns, 6px gaps, rows of 28vw. Large tiles span both columns and three rows; the rest are one column by two rows. The heading tile leads at full width, two rows tall, type at 9vw. Enlarged elements keep their scale and are cropped harder; captions stay bottom-left at 16px and 14px.

Adjusted for this page:
- It sets text at 10px: use your small step (13px or more) instead.

### 4. showcase — One control, blown up (full-bleed)
A flat saturated field, full-bleed and 92svh tall, holds one working control from the product: the toggle, slider, segmented switch or record button the whole product turns on. Build it at true proportions with every dimension in em, mark its root data-ui, then raise that root's font-size until the control stands about 46vh tall. Anchor it right of centre so the section's right and bottom edges crop about a fifth of it (overflow: hidden on the section). It keeps its real label and value, now at poster size, and it works: operating it swaps the field between two palette colours and changes one word of the heading. The heading, two to four words at clamp(28px, 2.6vw, 40px), sits top-left on the page margin with one sentence at 17px beneath it. The lower-left third of the field stays empty.
On a phone: The field is 86svh. Heading and sentence sit top-left at 26px and 16px. The control is enlarged to about 130vw wide and anchored bottom-left, so the right edge crops its far end while its thumb or active segment stays within reach. It still works and still swaps the field colour.

### 5. how-it-works — Many into one (band)
A diagram drawn with one repeated shape instead of arrows. The heading (two to four words on two lines at clamp(36px, 4vw, 60px)) and a short paragraph at 17px sit in columns 1–4. Beneath, a wide inline SVG spans columns 1–12 at about 4.5:1. It is built from 120–160 small filled squares (or the page's own motif), each 10–14px. In the left third they are scattered loosely in two pale tones. In the middle third they are pulled into a tight horizontal ribbon three squares high. In the right third they fan out again into neat, evenly spaced rows in the accent colour. The eye reads disorder, compression, order, from left to right. Under the diagram, three text columns aligned to its thirds: a bold one-word name at 20px and two lines at 16px each; the words carry the sequence ('Gather', 'Reduce', 'Release'). No connecting marks.
On a phone: The diagram turns to run top to bottom: a 3:4 SVG with the scatter at the top, the ribbon as a vertical band in the middle and the ordered rows at the bottom. The three names and their text sit to its right in a 38vw column, each level with its zone.

### 6. about — Two columns, highlighted words (statement)
The story is set as text far larger than anything else on the page: 110–160 words at clamp(22px, 2.1vw, 32px), tight leading 1.18, in the soft ink, flowing through two columns that fill the full width between 24px margins (`columns: 2; column-gap: 32px`, justified, with hyphenation on). No heading. The name at the start is in full ink. Six or seven single words or short phrases carry a flat highlighter background in three or four palette colours, built with an inline `background-color`, `box-decoration-break: clone` and 0.1em of horizontal padding; they mark the facts a scanning reader wants (a place, a year, a client, a skill). The final short sentence is highlighted entire in the strongest colour and is the link to contact. Padding 120px top and bottom. No image and no portrait.
On a phone: One column at 20px, left-aligned and unjustified, leading 1.25, with 18px margins. Keep four or five highlights so no line carries two. The final highlighted sentence sits on its own line with 24px above it and works as a full-width tap target.

### 7. cta — One word is the button (band)
The entire band is one link. A full-bleed field in the accent colour, about 60svh tall, contains a single verb of four to eight letters set at 24–30vw in the heaviest weight, tight tracking, sized with `clamp()` so it spans the content width on one line with its baseline 24px above the bottom edge. The `<a>` wraps the whole band; on hover and focus the field and the word swap colours instantly. In the top-left corner, at 20px, one sentence says what happens next; in the top-right, an arrow drawn as a simple inline SVG, 48px, points up and right. There is no other button anywhere in the section. In a page with a motif, the band's top corners take the motif's shape (a large radius, or a chamfer cut with `clip-path`). Keep the word honest: the action itself, not a slogan.
On a phone: The band is 46svh tall. The word is set at whatever size fills the width on one line; choose a shorter verb rather than going below 22vw. Sentence top-left at 17px across two lines, arrow top-right at 32px. The whole band stays tappable.

### 8. footer — Columns above, wordmark below (stack)
The footer inverts ground and ink and fills a whole viewport (min-height 100svh), arranged as three rows in a grid (auto 1fr auto). Top row, 40px from the edge: four small columns on the 12-column grid (address, navigation, social, hours or contact), each a plain list at 15–16px with its first line in the full ink and the rest in the softer ink. Middle row: empty. Bottom row: the wordmark alone, sized to run from the left margin to the right margin on one line. Set it as inline SVG text with a `viewBox` fitted to the word and `width: 100%`, or tune `font-size` in `vw` to the letter count, so it never wraps; its baseline sits 20px above a single line of legal text at 13px. With `position: sticky; bottom: 0` and a lower `z-index` than the page, the last section slides away to uncover it.
On a phone: Columns become two by two at 15px with 32px between rows, at the top. A gap of about 20svh follows. The wordmark spans the full width at the bottom; a name longer than ten letters stacks on two lines, each fitted to the width. Legal line beneath at 12px.

Adjusted for this page:
- It sets text at 12px: use your small step (13px or more) instead.

## 8. Motion — Shutter image
The one hero or showcase image opens from an edge with a clip-path over about 1.1 seconds while the picture inside settles from 1.12 scale to rest. Use it once, on the image that matters most; later images simply are there. Recipe: 'Image shutter' in references/motion.md.
This is the signature move, the one loud moment. Around it the page still needs the rest of the motion layer (SKILL.md step 9): an entrance for the parts of every section, feedback on every control, and one moving picture. The inspector fails a page that barely moves. Recipes: references/motion.md.

## 10. Where the richness comes from
Attitude. The page has a recognisable voice from another world, applied to a subject nobody expected it for.

## 11. How this direction goes wrong
Name the borrowed category in one word before you start, or the result is merely loud. The content must still be clear: what it is, what it costs, how to get it. Avoid borrowing from 'tech startup', which is the default you are escaping.

## 12. Real references
Studied sites that work this way. Take the principle, never the specifics: no names, copy, images or signature assets of theirs.
- **UGLYCASH** (One Page Love, studied score 7.4) `opl-uglycash`
  Idea: A money app sold like streetwear: one shouted condensed headline over the phone, then sticker-covered 3D props where feature icons would normally go.
  Hero: Near-white page. A floating light-grey nav bar only 35% of the viewport wide sits centred 20px from the top: condensed wordmark left, two social icons in the middle, an app button with a glowing magenta outline right. Directly beneath, a two-line uppercase headline in bold condensed grotesque at 11.4vw, centred, leading under 0.9, about 60% of the width, with a faint cyan and magenta fringe on the letter edges; it fills the band from 12% to 43% of the height. A single phone mockup 27% of the viewport wide rises immediately under the headline, centred, cut off by the bottom edge. Its magenta screen glow is the only colour.
  Worth taking: Make the nav a short floating bar a third of the viewport wide so the headline can start almost at the top edge.
- **SSTR - Friction Reduction** (Awwwards Site of the Day, studied score 7.7) `aww-sstr-friction-reduction`
  Idea: Drilling hardware treated like precision consumer tech: a chamfered octagon taken from the tool's cross-section drives the buttons, icons and loader.
  Hero: The captured first viewport is the preloader: a 2 by 2 grid with hairline dividers, top-left quadrant solid orange with the slash-prefixed name at 5.6vw in black bold grotesk; top-right dark with a plus-sign dot grid and an orange square beside a percentage; bottom quadrants hold wireframe octagon stacks under small labels. The real hero is a full-bleed grey 3D render of a steel downhole tool rising from bottom centre. A two-line uppercase headline at about 3.5vw in light grotesk sits left-anchored at mid-height, with a short paragraph and an orange chamfered-corner button below. A slim bar holds logo left, five small caps links, globe and contact right.
  Worth taking: Derive one shape from the product (here a chamfered octagon) and reuse it for button corners, icons and loader graphics.
- **Butter** (Awwwards Site of the Day, studied score 7.6) `aww-butter`
  Idea: A video editor presented as a bunch of collectable objects: 3D keychain charms in the hero and squircle effect tiles that behave like app icons everywhere else.
  Hero: Soft grey vertical gradient, darker at the top, fading to near-white. Two floating light-grey rounded capsules form the nav: the left holds the script logo, five links and a kebab; the right holds Login and a black button. A 3D bunch of keychain charms (orange carabiner, black letter keycap, chrome ring, magenta disc, steel key, green script tag) hangs from the top edge at centre, overlapping the nav and stopping just above the headline. The headline is one centred line at 7.5vw in regular-weight grotesk spanning 75% of the width, with a 24px sub-line and a black rounded-rectangle button beneath. The bottom 35% is empty.
  Worth taking: Hang a cluster of 3D branded charms from the top edge so it overlaps the nav and points down at a one-line headline.
Full notes on any of them: `node draw.mjs --site <id>`.

## Always
Headlines two lines or fewer at every width. No eyebrow labels, no monospace, no 01/02/03, no thin rules, no gradients, no shadows at rest,
no cream-and-terracotta, no violet. The frame: one h1 on the first screen that says what this is, equal outer margins, no
section huddled on one side with the other half empty, no blank stretch over half a screen, a heading on every section.
`inspect.mjs` measures all of it.

Saved to /home/user/tpi-website-ai-poc/.taste-skill/borrowed-category/direction.json · reprint with `node draw.mjs --show`
````
