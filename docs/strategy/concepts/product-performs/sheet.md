# The product performs（`product-performs`）

`draw.mjs --direction product-performs` 發出的 direction sheet 加上 redraw 後的版本（seed 1858352818，2026-11-01）。最後一節「Direction sheet」是 `draw.mjs --show` 的原樣輸出（英文）；前面幾節是本站的補充。共用的論點與文案在 [`../argument.md`](../argument.md)、[`../copy-deck.md`](../copy-deck.md)，參數在 [`../options.md`](../options.md)。

## Redraw

| # | 位置 | 原本發的 | 換成 | 理由 |
|---|---|---|---|---|
| 1 | `section:about` | `about-founders-letter`（創辦人第一人稱的信，附頭像與署名） | `about-side-facts-wide-paragraph` | 沒有創辦人的信；創辦人的事實是 `to_confirm`；messaging「語氣」也不用「我們」開頭的長句。第 7 段是 6 條年份與項目的紀錄，換成「左欄標籤與值、右側一段文字、下面一列紀錄」的版型 |
| 2 | `section:cta` | `cta-blank-in-the-sentence`（句子裡嵌 email 欄位） | `cta-plain-sentence-one-action` | 原本把 email 欄位當表單送出；本站的主要轉換是到 `/contact-us` 填完整的聯絡表單，原型沒有後端，也不另做只收 email 的表單。換的版型是一句話加一個「聯絡業務」按鈕，和這個方向安靜的頁尾一致 |

沒有 redraw 但內容比 blueprint 少的段落：`list`（`list-two-ended-rows`）寫 10–40 列，第 2 段有 6 列，分金融、政府兩組。

## Idea 句

> On this page, **digiRunner's financial-inspection checklist — transaction limits, connection identifiers, service certificates, API Key, OAuth 2.0 — and the old systems it fronts (core banking systems, mainframes, the existing WAF)** becomes **the working fragment in the hero's reel: one API request passes each check, one frame at a time, on its way into a core banking system**.

中文：digiRunner 針對金融檢查的 API 管理清單與它前面接的既有系統（`argument.md` 清點第 6、8 項），做成 hero 中間那條影格帶裡真的會動的介面片段：一個 API 請求一格一格通過檢查，接進核心銀行系統。

Competitor test：把 SYSTEX、Syscom 放進第一格，兩家的首頁都沒有自己的 API 管理產品、也沒提金融檢查（`competitors.md`），句子不成立，所以 idea 屬於昕力。風險在片段本身：本站沒有 digiRunner 的截圖，片段是照事實文字畫的，不能讓人以為是產品的真實畫面（`design-principles.md`「待確認」第 4 項）。

## 可以操作的一件事

`how-it-works`（`Drag through the stages`）：一條真的 range input，四個停點是 SysTalk.ai 的 AI 導入順序（AI 導入情境分析、解決方案搭配建議、效益評估、模型評估與微調，`fact:systalk-ai-onboarding`）。拖動或用方向鍵時，左邊的句子與右邊片段的狀態一起換。沒有 script 時四個階段直接列出。

## 照本站規則的調整

- 品牌紫：sheet 的 accent（古銅 `#a08672`）不放在按鈕上，主要 CTA 改用品牌紫 `#662e8d`；古銅只留在小標記上。紫色按鈕放在近黑底（`#111111`）上，按鈕形狀和底色的對比是 2.10:1，低於 WCAG 1.4.11 的 3:1，要靠按鈕的白字與位置辨認。這是要交人決定的取捨。inspector 加 `--allow palette-purple`
- 字體：Jost 只有拉丁字母，中文落到系統字。h1 的「uppercase」對中文沒有作用
- hero 的 h1：blueprint 把一句話拆成左右兩半、中間是影格。共用的 h1 本來就是兩行，第一行「金融與政府的系統」放左、第二行「接上 API 與 AI」放右。1280 寬 3.6vw（約 46px）時，兩半加中間 35% 的影格約 1124px，放得下 1216px 的內寬。375 寬兩半上下排、中間是影格，9vw（約 34px）每半一行
- hero 影格帶的 3–4 格：照事實文字做的 digiRunner 片段，例如「API 請求通過金融檢查的各項」（`fact:digirunner-financial-inspection`）、「即時主控台保留 API 活動與軌跡」（`fact:digirunner-console`）、「AI 使用歷程的紀錄」（`fact:digirunner-ai-usage-log`）
- `showcase`（`Lit panel, dark row`）要 5–7 個面板：用 `copy-deck.md` 第 5 段的五項（含第五項「成本」）
- 介面片段：根元素標 `data-ui`，標籤只用事實裡的詞；不放進瀏覽器或筆電外框，不用灰色長條假裝資料
- 字型與圖片都放進方向目錄，原型離線打開

## 需要的圖片

這個方向的圖大部分是 HTML 介面片段（taste-skill 把介面片段算進 4 張下限）；真實照片只在案例段。

| 位置 | 要什麼 | 開放圖庫的查詢詞 |
|---|---|---|
| `work` 右側整高的照片，三張輪換 | 每則案例的作業場域：保險理賠、醫院病歷、銀行 | `insurance office archive`、`hospital records room`、`bank branch Taipei` |
| hero 影格 3–4 格、`features` 4 個面板、`showcase` 5 個面板、`how-it-works` 片段 | HTML 介面片段 | — |
| 可選的氣氛照（最多 2 張） | sheet 的 Architecture 組（picsum.photos） | 照 sheet，用到時列進報告 |

Scroll scene：sheet 沒有發，不需要 GSAP、Lenis。signature move「Pinned story」用 `position: sticky` 與原生 script 做。

## Direction sheet

````text
# DIRECTION SHEET — The product performs
seed 1858352818 · drawn 2026-11-01 · redraws: 2 · sector saas
Brief: TPIsoftware (昕力資訊), a Taiwanese enterprise software maker that builds and deploys its own API management, integration and on-premises AI products for banks, insurers and government agencies, connecting them to the core systems they already run

| | |
| --- | --- |
| Direction | The product performs |
| Hero | Sentence split by a frame |
| Type | Jost |
| Colour | Lunar and bronze |
| Sections | list (Two-ended rows, narrow column) → work (Small index, large picture) → features (Small proof beside text) → showcase (Lit panel, dark row) → how-it-works (Drag through the stages) → about (Side facts, wide paragraph) → cta (A plain sentence, one action) → footer (A single quiet line) |
| Motion | Pinned story |
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
Software is most convincing when it is doing its job in front of you. Instead of describing features, put small, true, working fragments of the product on the page: the actual control, with real content, responding to the pointer. A colour picker's loupe reads the page's own background and prints its value. A list tool lets you tick an item right there. A type-scale plugin sets the page's own headings. Find the one interaction that is the product and make the hero that interaction; then show each further capability as another fragment at real size. No dashboard collage, no browser frame, no screenshots shrunk until unreadable.

Before anything else, write one sentence in your notes: "On this page, <the subject's own material> becomes <the device>."
Fill the first blank from your inventory of what only this client has (its name and what it means, its street, its numbers, its
constraint), then put the nearest competitor in the sentence: if it still works, the idea is the category's, not the client's.
Then name the one live thing the visitor can do on the page (SKILL.md step 4).

## 2. Composition
Hero: a short plain headline (4–6vw, left-aligned, upper-left third) and one sentence; the rest of the first screen is the main fragment at actual interface size, sitting directly on the page or on one flat stage colour, large enough to read every label. The fragment is built in HTML and works. Below, capabilities are a single-column sequence, each a row of two parts on a 5/7 split: a two-line statement on one side and the relevant fragment on the other, with the fragments varying in size and shape so the column never becomes a zigzag of equal blocks. Fragments are cropped pieces of interface (a menu, a row, a control, a panel edge), not whole windows. One section pins a fragment while three short statements change it.

## 3. Type — Jost
The pointed, circular geometry of the 1920s in bold capitals, with the same family at reading size. Suits space, science, museums, architecture and anything that should feel like a mid-century poster.
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Jost:wght@400;500;700&display=swap" rel="stylesheet">
```
- Display: **Jost** — weight 700 · tracking -0.03em · leading 0.9 · uppercase
- Text: **Jost** — 400 for body, 500 for emphasis · leading 1.5 · tracking 0
```css
:root {
  --step-small: clamp(0.8125rem, 0.79rem + 0.1vw, 0.875rem);
  --step-body: clamp(1.0625rem, 1rem + 0.25vw, 1.1875rem);
  --step-lead: clamp(1.25rem, 1.1rem + 0.7vw, 1.625rem);
  --step-head: clamp(2rem, 1.3rem + 3.2vw, 4rem);
}
```
The marketing type matches the product's interface type so the fragments and the page feel like one thing. Headline modest; interface text at its true size (13–15px) inside fragments.
The direction decides sizes and how many of them; the type system decides how this face is set. Where the two give different tracking or leading, use the values of the type system: they are tuned to this face.
The display size itself comes from the hero blueprint below.

## 4. Colour — Lunar and bronze
```css
:root {
  --bg: #111111;
  --surface: #1c1c1c;
  --ink: #f2f2f2;
  --muted: #8f8f8f;
  --accent: #a08672;
  --accent-ink: #111111;
}
```
Soft black holds the page with panels one step lighter, white text and grey secondary lines, so photographs supply all the colour. Muted bronze goes on small markers and the one button only.
Neutral ground. The product's own interface colours provide the colour. At most one flat stage colour behind fragments.

## 5. Imagery
**This subject is software and there are no screenshots, so its pictures are its own interface.** Wherever this sheet says photograph, image or object, build a believable fragment of the product in HTML at real size (real labels, numbers that add up, one item hovered or selected) by the app-screen rules (references/app-screens.md: deal its style once with `node <skill>/scripts/draw.mjs --app --kind <kind> --keep palette,type --out .taste-skill/app`, and build it with assets/app.css and assets/charts.js), put the attribute `data-ui` on its root, and crop or scale it the way the blueprint treats a photograph: a full-bleed close crop, a tile, the fixed half of a split. Where a fragment makes no sense, use a flat colour field with type on it. Never a fake dashboard of grey bars, never a device frame. If the product works on something physical (ships, plants, buildings, a city), one real picture of that world can carry a section: find it with `node /home/user/tpi-website-ai-poc/.claude/skills/taste-skill/scripts/assets.mjs "<that world>"`, download it with `--get`, credit it on the page, and never let it pass for the product or its customers.

The interface fragments are the main imagery: build them carefully with real labels, real numbers and sensible states (one hovered, one selected). Around them, two or three real pictures of the customer's world (found with scripts/assets.mjs), never stock of people at laptops.

**Floor (the inspector checks it):** at least four real pictures on the page, usually six to twelve; SVG drawings do not count. One moving picture where an honest clip exists: `node <skill>/scripts/assets.mjs --video "<query>"`, used as a muted loop with a poster frame. Whatever this direction says about pictures, it is carried out with real ones.

Optional atmosphere, two at most, from the "Architecture" set (structure, lines, bridges, facades and building interiors). The page does not need them.
Order of preference for imagery: (1) the project's own photographs and product shots; (2) images you generate, if an image tool is
available; (3) real pictures of the subject's world found in the open collections (assets.mjs, downloaded and credited on the page);
(4) drawings of the subject in code; (5) these. They are real photographs (Unsplash licence, served by picsum.photos) of places, light and
texture. They are atmosphere, never a stand-in for a specific product, dish, person or interface. List the ones you use in your report so
they can be replaced.
- `https://picsum.photos/id/1081/1600/1000` — Stepped white modern building corner rising into a pale blue sky · light tone · white, pale blue, soft grey · calm area: top · native landscape · photo: Julien Moreau
- `https://picsum.photos/id/942/1600/1000` — White angular concrete building against a black sky · dark tone · black, white, pale grey · black-and-white · calm area: top · native landscape · photo: Carl Nenzen Loven
- `https://picsum.photos/id/101/1600/1000` — Concrete bunker-like building against a pale teal sky · mid tone · pale teal, concrete grey · calm area: top · native landscape · photo: Christian Bardenhorst
- `https://picsum.photos/id/743/1600/1000` — Narrow wedge-shaped building corner seen from below against a teal sky · mid tone · teal blue, sandstone, warm brown · calm area: left · native landscape · photo: Anthony DELANOIX
The last two path numbers are width and height: request the exact crop you render (`/1200/1500` for a 4:5 portrait, `/2400/1350` for a hero) and
add `?grayscale` to desaturate. Use at most two. Always set `width`, `height`, `alt` and `loading="lazy"` (not on the hero image).
Other sets that fit this brief: fog-and-quiet, sky-and-space — `node draw.mjs --photos <set>` prints one in full; `--photos list` shows all sets. Taking photographs from another set is your call and is not a redraw; keep them to one light and one treatment.

## 6. Hero — Sentence split by a frame
A white or pale ground. One short sentence is broken in two and pushed to the edges: the first half flush to the 32px left margin, the second half flush to the right margin, both on the vertical centre line at clamp(40px, 3.6vw, 60px), medium weight. Between them, dead centre on columns 5–8, sits one media frame: 35% of the viewport wide, 16:9, corners 4px, holding a photograph or a working fragment of the product. The frame belongs to a vertical reel: the bottom 60px of the previous frame shows at the top edge of the viewport and the top 60px of the next at the bottom edge, same width, 24px gaps, so the centre column reads as a strip passing through the sentence. The stage is sticky; the reel advances three or four steps while the two halves of the sentence hold their place. Wordmark top-left; three text links and the single action as a small solid button top-right, all at 15px. Bottom-left on columns 1–4: one supporting sentence at 18px, its last line 32px above the bottom edge. The other corners stay empty.

On a phone: The halves stack: the first half of the sentence at 9vw flush left under the wordmark, then the frame at full width minus 16px margins and 4:3, then the second half flush right at 9vw. The neighbouring frames show as 28px slivers above and below. The supporting sentence and the action button follow at 16px. The links collapse to one word.
Headline: One sentence of four to six words split into two halves of up to about 14 characters each; the frame between them shows what it is about.

Adjusted for this page:
- It names colours (white): map them onto this palette's roles (ground `--bg`, panels `--surface` and the fields, text `--ink`/`--muted`, the accent `--accent` on the primary action only).
- It sets a sentence large over several lines: jurors read that as a long headline. Either cut it to a two-line headline at display size, or keep it a statement at 36px or less on three lines (24px, four lines on a phone).

## 7. Sections, in order
Each is a composition to rebuild with this project's content. Keep the geometry; change the subject. Re-order or drop a
section when the argument of the page needs it (see references/copy.md), never to fall back to a card grid.

### 1. list — Two-ended rows, narrow column (list)
A list in one narrow column, 520px wide, starting at 22% of the viewport width or centred. Every row is 34–38px tall with no box and nothing drawn between rows. Each row has two ends: at the left, a 16px round image (a face, a logo, a colour dot) followed after 8px by the name at 15–16px in full ink; at the far right of the column, a short value at 13px in the soft ink (a date, a price, a domain, an opening time) with tabular figures. Entries that need a sentence run to two lines at the left, and the value aligns with the first line. Groups are separated by 40px of space and begin with one plain word in the soft ink at the same size. A heading of two to four words at 24–28px in medium weight sits 32px above the first row. Holds 10–40 rows.
On a phone: The column fills the width with 20px margins. Rows are 44px tall for touch; the left image stays 16px. Long values wrap beneath the name at 13px, left-aligned with it, and the row grows. Group spacing is 32px.

### 2. work — Small index, large picture (pinned)
A sticky stage of 100svh split 38/62. The right 62%, from x 560 to the right viewport edge, is one photograph the full height of the stage, bleeding off the right, top and bottom edges, square corners: a staged picture of the current project in use, in a real place. The left column, from the 20px margin to x 520, holds the heading at the top, two lines at clamp(80px, 8.2vw, 120px), leading 0.95, 40px under the navigation; then empty ground; then, anchored to the bottom with a 32px margin, the index: three to six rows 44px tall, each with the project's name at 28px on the left and two or three disciplines at 16px right-aligned in the soft ink. The current row is in the full ink and the others at 40% opacity; rows are told apart by space only. Each project gets one viewport of scroll: as it arrives, its photograph wipes in from the bottom edge (`clip-path: inset(100% 0 0 0)` to `inset(0)` over 900ms) and the current row moves down the list. The empty middle of the left column is closed by the heading above it and the index below.
On a phone: The heading sits at the top at 14vw on two lines, then the photograph at full width at 4:5, sticky under the heading while the index rows below it change the picture; or let each project simply stack as photograph and row.

Adjusted for this page:
- It fades text: anything a visitor reads, inactive items of a list included, is `--ink` or `--muted` at full strength (contrast 4.5:1 or more). The active item is told apart by `--ink` against `--muted`, weight or the accent, not by fading the rest.

### 3. features — Small proof beside text (list)
One narrow module repeated four to six times down the page, never alternating sides. Each module is 640px wide at most and starts on the page's text margin (at about 22% of the viewport on an understated page). Left part: a flat panel 360px wide and 120 to 200px tall, one tone off the ground, radius 8px, holding one small exact demonstration: a cropped interface fragment at true size, or a tightly cropped photograph covering the panel. Right part, 20px away and top-aligned: a heading of one or two lines at 18px medium and two short paragraphs at 15px in the soft ink, in a column 250px wide. Panel heights vary with their content; text always hangs from the panel's top edge. 96–120px of empty ground between modules. The section heading is 24–28px, on the same left edge, 64px above the first module. In a column under 600px the text moves beneath its panel.
On a phone: Each module stacks: the panel at full width and natural height, then heading and paragraphs 16px below on the same left edge, at 17px and 15px. 64px between modules. Panels keep their true-size contents and crop from the right instead of scaling down.

Adjusted for this page:
- It names its own corners: use the one radius of this page (square unless the direction says otherwise) and one button shape.

### 4. showcase — Lit panel, dark row (carousel)
One dark field, 96svh tall. Across its middle runs a horizontal row of five to seven interface panels, each a different true-size fragment marked data-ui (an open menu, an inspector, a composer, a chart card), 320–460px wide at their natural heights, vertically centred and 26vw apart. The row scrolls sideways with scroll-snap-type: x mandatory and scroll-snap-align: center, and can be dragged. Only the panel at the centre is lit: full opacity, in the product's light theme, the brightest thing on screen. The others sit at 22% opacity and are inert. The viewport's edges crop the outermost panels. In the gap to the right of the centred panel, top-aligned with it, a 24ch column gives its name at 24px in a light weight and two lines at 16px in a lifted ink; this text changes as panels arrive. There is no heading above the row.
On a phone: The row is 62svh tall; panels snap one per screen at true size, capped at 86vw wide, with neighbours showing 7vw at each side at 22% opacity. The name and its two lines sit beneath the row on the left margin and change with the centred panel. Swiping moves the row.

Adjusted for this page:
- It fades text: anything a visitor reads, inactive items of a list included, is `--ink` or `--muted` at full strength (contrast 4.5:1 or more). The active item is told apart by `--ink` against `--muted`, weight or the accent, not by fading the rest.

### 5. how-it-works — Drag through the stages (split)
A 50/50 split, 88svh tall: two flat fields meeting on a clean vertical edge, and one slider that drives both. Left field: the current stage as a clause of three to six words at clamp(40px, 4.6vw, 76px) on two lines, top-left from column 1, starting with its order word; it serves as the heading. Right field: one fragment of the product at true size, about 440px wide, centred, root marked data-ui, in the state that matches the clause. Along the bottom, crossing both fields inside 28px margins, a real range `<input>` with four stops: a solid track 8px tall, the part already passed in full ink, and a square thumb 32px across in the accent. Under the track, four stage names at 16px, the current one in full ink. Dragging, or the arrow keys, swaps the clause and the fragment's state with a 200ms crossfade; nothing depends on scroll.
On a phone: The fragment's field comes first, 46svh, the fragment at true size and cropped to its active region. The slider follows directly beneath on the seam, thumb 40px. Then the clause field: the clause at 9vw on two lines, with the four stage names under it in a two-by-two block at 15px.

### 6. about — Side facts, wide paragraph (table)
Two rows share one vertical line at 34% of the viewport width. Row one: in a 160px column at the left margin, three label and value pairs stack with 20px between them, each a label in the soft ink with its value beneath in full ink, all at 13px (founded, based in, team size). From the 34% line a five-line paragraph at clamp(20px, 1.7vw, 26px), leading 1.35, runs to 90% of the width. Row two starts 120px lower and repeats the logic for the record of the practice: one plain word at 13px at the far left (awards, press, clients), then from the 34% line two list columns, each 260px wide with a 64px gutter, at 13px with 10px between lines: name at the left, year at the right in the soft ink. No heading; the paragraph opens the section. Each list comfortably holds 6–12 lines. No photographs are needed.
On a phone: Everything aligns to the left margin. The paragraph comes first at 19px. The three label and value pairs follow as a two-column grid at 14px. The two record lists stack with 40px between them, each opened by its plain word in full ink.

### 7. cta — A plain sentence, one action (stack)
The page ends on an almost empty screen. On the page ground, with no band and no panel, one sentence of eight to fourteen words is set at 18–22px in the regular weight, in the full ink, no wider than 34ch, on the same left edge as the page's text column (or centred only if the whole page is centred). 24px beneath it sits one small filled button, about 40px tall with 18px side padding, and optionally one text link beside it on the same baseline. That is all. Above the sentence leave at least 30svh of empty ground and below it at least 20svh before the footer line, so the emptiness reads as decided. The sentence is written as something a person would say, and it names the action plainly. No headline-sized type appears anywhere in this section.
On a phone: Identical in spirit: the sentence at 18px with 20px margins, the button beneath at its natural width (not full width), 44px tall. Keep 20svh of empty ground above the sentence and 14svh below the button, before the footer line.

### 8. footer — A single quiet line (strip)
No footer block at all. After at least 30svh of empty page ground, one baseline 30px above the bottom edge carries three items in the page's ordinary small text size (14–16px), the same size and weight as the navigation: at the left margin, what this is in three or four words; centred, two to five links separated by 24px of space; at the right margin, the year and a privacy link. Use a three-column grid (1fr auto 1fr) so the centre group is truly centred whatever the side lengths. No logo, no background change, no line above it, no columns. Links are in the full ink; the rest in the softer ink. If the page has a narrow text column, the three items may instead sit on that column's left edge as one wrapped line. The restraint only works if the page above has already made its invitation.
On a phone: Three short lines at 14px on the left margin with 8px between them: the description, the links on one wrapped line, then year and privacy. Links stay in the full ink. Leave 20svh of empty ground above and 24px below.

## 8. Motion — Pinned story
One element holds its place with `position: sticky` (a title, a frame, a product fragment) while the items that belong to it scroll past or swap inside it. The page's ordinary scrolling does the work; nothing is hijacked. Hold it for about one screen per step and three screens at most, two held stages per page at most, with a line of text on every held screen. Recipe: 'Pinned story' in references/motion.md.
This is the signature move, the one loud moment. Around it the page still needs the rest of the motion layer (SKILL.md step 9): an entrance for the parts of every section, feedback on every control, and one moving picture. The inspector fails a page that barely moves. Recipes: references/motion.md.

## 10. Where the richness comes from
Fidelity. A fragment with believable content and a real hover state is more interesting than any illustration. Spend the effort there.

## 11. How this direction goes wrong
A fake interface made of grey bars and circles is the worst outcome; if you cannot build a believable fragment, change direction. Mark each fragment's root element with the attribute data-ui: inside it the product's own conventions apply (1px control borders, small radii, a shadow on its open menu) and the inspector leaves them alone; outside it the house rules hold as usual. data-ui is for cropped fragments only, never for a page wrapper. Do not put the fragment in a browser or laptop frame.

## 12. Real references
Studied sites that work this way. Take the principle, never the specifics: no names, copy, images or signature assets of theirs.
- **Uni** (One Page Love, studied score 7.2) `opl-uni`
  Idea: The product lives in the laptop notch, so the page's navigation is a black notch and the hero is a laptop outline whose notch opens into the app.
  Hero: White page with the hero as a rounded-corner panel inset 24px on all sides, filled with a grainy pastel gradient (pink-peach centre, sky blue down the right edge, orange lower-left). A black pill 300×44px sits top-centre like a laptop notch, holding only the app icon; it is the entire nav. Centred below: a hand-scrawled caps eyebrow, a two-line 48px (3.3vw) headline, two white pill download buttons side by side, one line of tiny grey reassurance. The bottom 40% is a thick black outline of a laptop screen, 960px wide, cropped by the fold, its notch expanded into a dark input bar playing the demo.
  Worth taking: Shape the navigation like the product's own hardware habitat (here a black notch pill) so the nav itself demonstrates the product.
- **Typewave** (One Page Love, studied score 7.2) `opl-typewave`
  Idea: A plugin about type scales sold on a near-black page where flat saturated fields (orange, lime, blue) act as stages for the plugin's own dark interface.
  Hero: Near-black field. Nav row at the top: pixel-block logo and wordmark left, four plain links centred (one carrying a tiny lime tag), a cream rectangular button with a Figma glyph right. The headline sits centred around mid-height: three lines at about 6.7vw, medium weight, off-white, with the third line recoloured pale lime. Below it a three-line 18px paragraph held to about 45% of the width, then a small cream button repeating the nav action. About 150px lower, the top edge of a flat orange slab, 70% of the viewport wide with barely rounded corners, peeks over the fold; it holds the plugin window.
  Worth taking: Stage dark UI screenshots on flat saturated rectangles instead of on the page background, so the colour does the branding and the UI stays legible.
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

Saved to /home/user/tpi-website-ai-poc/.taste-skill/product-performs/direction.json · reprint with `node draw.mjs --show`
````
