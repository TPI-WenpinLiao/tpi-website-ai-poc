# One motif（`one-motif`）

`draw.mjs --direction one-motif` 發出的 direction sheet 加上 redraw 後的版本（seed 259476857，2026-11-01）。最後一節「Direction sheet」是 `draw.mjs --show` 的原樣輸出（英文）；前面幾節是本站的補充。共用的論點與文案在 [`../argument.md`](../argument.md)、[`../copy-deck.md`](../copy-deck.md)，參數在 [`../options.md`](../options.md)。

## Redraw

| # | 位置 | 原本發的 | 換成 | 理由 |
|---|---|---|---|---|
| 1 | `section:about` | `about-shaped-portrait-panel`（深色面板加人像照片） | `about-side-facts-wide-paragraph` | 原本要一張人物或工作室的照片，本站沒有；第 7 段是 6 條年份與項目的紀錄，原本的兩個 300px 文字塊放不下。換的版型是「左欄標籤與值、右側一段文字、下面一列紀錄」，不需要照片 |
| 2 | `section:cta` | `cta-blank-in-the-sentence`（句子裡嵌 email 欄位） | `cta-idea-restated-inverted` | 原本把 email 欄位當表單送出；本站的主要轉換是到 `/contact-us` 填完整的聯絡表單（brief「CTA」），原型沒有後端，也不另做一份只收 email 的表單。換的版型是一句呼應 hero 的收尾加一個按鈕 |

沒有 redraw 但內容比 blueprint 少的段落：

- `work`（`work-stacked-folders-tabs`）寫 4–6 個資料夾，案例只有 3 則（brief 第 3 段）。sticky 堆疊的幾何 3 層也成立，照 3 則做，不補範例案例
- `list`（`list-statement-table-pushed-right`）寫 5–14 列，第 2 段有 6 列（兩個產業各 3 列，`copy-deck.md` 第 2 段），每 3 列一組

## Idea 句

> On this page, **the slanted top cut and the big rounded corner of the TPI logo symbol** becomes **the one motif: the tab of every folder in the hero and the case stack, the mask on every picture, the top corners of the primary button, and the single full-width band between “做得到嗎” and “安不安心”**.

中文：logo 符號的斜切頂邊與大圓角（`argument.md` 清點第 1 項），成為全頁唯一的形狀。

Competitor test：把 SYSTEX、GSS、Syscom、FPT 放進第一格，句子說的是另一個 logo 的形狀，不再是同一句話，所以這個形狀只屬於昕力。弱點是「用 logo 當 motif」這個手法本身任何公司都能用；能不能讀成昕力，靠的是形狀上放的內容（規範、案例、年份），不是形狀。

## 可以操作的一件事

第 2 段金融那一組的「金融檢查」列展開成 9 項清單（`fact:digirunner-financial-inspection` 原文拆成項目，字不改），訪客逐項勾選，每項旁邊顯示那一項的原文片段；沒有 script 時清單直接全部展開。

## 照本站規則的調整

- 品牌紫：sheet 的 accent（橄欖綠 `#38450f`）不放在按鈕上，主要 CTA「聯絡業務」改用品牌紫 `#662e8d`，logo 照彩色版；其餘的字、motif 與頁尾照 sheet。inspector 加 `--allow palette-purple`。紫色按鈕和骨白底（`#ecebe7`）的對比是 7.52:1，白字對紫底是 8.97:1
- 字體：Libre Franklin 與 Source Serif 4 只有拉丁字母，中文落到系統字（例如 PingFang TC、Noto Sans CJK TC）。h1 的「uppercase」對中文沒有作用。中文 webfont 照 `design-principles.md`「原則與現有限制」第 1 列，原型不載
- hero 的 h1：blueprint 要一行、10vw、約 12 個拉丁字元；共用的 h1 是兩行、第一行 8 個全形字寬（`copy-deck.md` 第 1 段）。桌機改成兩行，欄寬加寬到資料夾的 86%，10vw 下 8 字約 1024px 放得下；375 寬改 11vw（約 42px），兩行
- hero 的五個資料夾：頁籤用段落短名（產業、案例、產品、OrientAI、紀錄），頁籤的斜邊照 logo 的斜切角度
- `features` 的 8 塊板子：一塊放標題，其餘 7 塊放第 4 段四個家族的介面片段（例如 digiRunner 的 API 列、gadoDIDO 的無密碼登入），標籤照事實原文
- 介面片段：根元素標 `data-ui`，標籤只用事實裡的詞；版面是原型畫的，不是產品的真實畫面（`design-principles.md`「待確認」第 4 項）
- 字型與圖片都放進方向目錄，原型離線打開（`design-concept` skill 第 3 節第 4 步）

## 需要的圖片

全頁至少 4 張真實圖片（介面片段算，SVG 不算）。都放在 motif 形狀的遮罩裡。

| 位置 | 要什麼 | 開放圖庫的查詢詞（第 3 階段跑 `assets.mjs`） |
|---|---|---|
| `work` 三個資料夾各一張 16:10 | 每則案例讀的文件或作業的場域：診斷書、醫療單據、銀行櫃檯 | `medical certificate document`、`hospital receipt archive`、`bank counter Taiwan archive` |
| `list` 左下的 4:5 圖（可選） | 公司所在的城市 | `Neihu Technology Park Taipei` |
| `showcase` 方形圖 | OrientAI 部署在企業端：機房與機櫃 | `server rack`、`on-premises server room` |
| `features` 7 塊、`how-it-works` 4 張卡片 | HTML 介面片段，不找圖 | — |
| 可選的氣氛照（最多 2 張） | sheet 的 Architecture 組（picsum.photos） | 照 sheet，用到時列進報告 |

Scroll scene：sheet 沒有發，不需要 GSAP、Lenis。signature move 是「Index with preview」，用原生 script 做。

## Direction sheet

````text
# DIRECTION SHEET — One motif
seed 259476857 · drawn 2026-11-01 · redraws: 2 · sector saas
Brief: TPIsoftware (昕力資訊), a Taiwanese enterprise software maker that builds and deploys its own API management, integration and on-premises AI products for banks, insurers and government agencies, connecting them to the core systems they already run

| | |
| --- | --- |
| Direction | One motif |
| Hero | Tabbed folder stack |
| Type | Libre Franklin / Source Serif 4 |
| Colour | Olive on bone |
| Sections | list (Statement, table pushed right) → work (Stacked folders with tabs) → features (Close-ups on a board) → showcase (Square plate, spare text) → how-it-works (One card, four fields) → about (Side facts, wide paragraph) → cta (The idea again, inverted) → footer (The mark, built large) |
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
Take one shape from the subject and let it run the whole system. A drilling tool's octagonal cross-section becomes the buttons, the image masks and the loader. A two-account money app becomes two circles that recur as icon, inline dot and section colour. A café's striped awning becomes every band on the page. Look at the product, the logo, the object or the word in the headline and find the simplest geometry in it (a circle, an arc, a chamfer, a stripe, a notch, a ring). Then use only that shape, at three or four very different scales, everywhere a designer would normally reach for a generic rounded rectangle.

Before anything else, write one sentence in your notes: "On this page, <the subject's own material> becomes <the device>."
Fill the first blank from your inventory of what only this client has (its name and what it means, its street, its numbers, its
constraint), then put the nearest competitor in the sentence: if it still works, the idea is the category's, not the client's.
Then name the one live thing the visitor can do on the page (SKILL.md step 4).

## 2. Composition
Hero: the motif appears once at enormous scale as a flat filled shape, cropped by the viewport (a circle 120vh across entering from the right, a chamfered block filling the lower half), with a short headline at 6–8vw and one supporting sentence set on the remaining ground, left-aligned on a shared margin. Through the page the motif returns as: the mask for every photograph (via `clip-path` or `border-radius` made from the same geometry), the shape of the primary button, the bullet beside list items at text size, and one full-width band that separates the two halves of the page. Sections use simple two-column or single-column layouts so the shape is the only thing with character.

## 3. Type — Libre Franklin / Source Serif 4
An American gothic for headings over a sober transitional serif for reading, the pairing of a newspaper front page. Suits essays, annual reports, archives and finance pages that have real paragraphs.
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@700&family=Source+Serif+4:ital,wght@0,400;0,600;1,400;1,600&display=swap" rel="stylesheet">
```
- Display: **Libre Franklin** — weight 700 · tracking -0.035em · leading 0.92 · uppercase for the title, sentence case for section headings
- Text: **Source Serif 4** — 400 for body, 600 for emphasis, italic for quotations · leading 1.55 · tracking 0
```css
:root {
  --step-small: clamp(0.8125rem, 0.79rem + 0.1vw, 0.875rem);
  --step-body: clamp(1.0625rem, 1rem + 0.25vw, 1.1875rem);
  --step-lead: clamp(1.25rem, 1.1rem + 0.7vw, 1.625rem);
  --step-head: clamp(2rem, 1.3rem + 3.2vw, 4rem);
}
```
A clean geometric or grotesk face that echoes the shape (round bowls for circles, squared terminals for chamfers). Medium weight; headings 6–8vw in the hero and 3–4vw after.
The direction decides sizes and how many of them; the type system decides how this face is set. Where the two give different tracking or leading, use the values of the type system: they are tuned to this face.
The display size itself comes from the hero blueprint below.

## 4. Colour — Olive on bone
```css
:root {
  --bg: #ecebe7;
  --surface: #e1dfd9;
  --ink: #38450f;
  --muted: #5d683a;
  --accent: #38450f;
  --accent-ink: #ecebe7;
  --field-1: #38450f;  --field-1-ink: #ecebe7;
}
```
A bone page with every word, large or small, in one olive green; the footer inverts to a solid olive field with bone text. Photography supplies all other colour, and the button is the same olive, filled.
The motif carries the accent colour at large scale, flat. Everything else is ground and ink. A second motif colour is allowed only if the subject has a real pair (two accounts, two modes).

## 5. Imagery
**This subject is software and there are no screenshots, so its pictures are its own interface.** Wherever this sheet says photograph, image or object, build a believable fragment of the product in HTML at real size (real labels, numbers that add up, one item hovered or selected) by the app-screen rules (references/app-screens.md: deal its style once with `node <skill>/scripts/draw.mjs --app --kind <kind> --keep palette,type --out .taste-skill/app`, and build it with assets/app.css and assets/charts.js), put the attribute `data-ui` on its root, and crop or scale it the way the blueprint treats a photograph: a full-bleed close crop, a tile, the fixed half of a split. Where a fragment makes no sense, use a flat colour field with type on it. Never a fake dashboard of grey bars, never a device frame. If the product works on something physical (ships, plants, buildings, a city), one real picture of that world can carry a section: find it with `node /home/user/tpi-website-ai-poc/.claude/skills/taste-skill/scripts/assets.mjs "<that world>"`, download it with `--get`, credit it on the page, and never let it pass for the product or its customers.

Photographs appear inside the motif's shape. If there is product interface to show, it sits on a flat colour stage shaped by the motif. Draw the shape with CSS or a simple inline SVG path; do not draw illustrations.

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
- `https://picsum.photos/id/193/1600/1000` — Gothic stone college building facing a striped green lawn · mid tone · lawn green, sandstone, sky blue · calm area: bottom · native landscape · photo: Vadim Sherbakov
The last two path numbers are width and height: request the exact crop you render (`/1200/1500` for a 4:5 portrait, `/2400/1350` for a hero) and
add `?grayscale` to desaturate. Use at most two. Always set `width`, `height`, `alt` and `loading="lazy"` (not on the hero image).
Other sets that fit this brief: fog-and-quiet, sky-and-space — `node draw.mjs --photos <set>` prints one in full; `--photos list` shows all sets. Taking photographs from another set is your call and is not a redraw; keep them to one light and one treatment.

## 6. Hero — Tabbed folder stack
A dark flat ground. A slim top row at 24px holds the wordmark dead centre and one text link far right at 15px. The headline is one centred line of heavy condensed capitals at clamp(96px, 10vw, 160px), spanning about 70% of the width, its cap line 110px from the top. Under it one supporting sentence in a serif at 20px, centred, max 46ch. From 51% of the height down the screen is a stack of five file folders: flat colour bands 86% of the viewport wide, centred, each offset 64px below the one behind so only a strip of the back four shows. Every folder has one trapezoid tab rising 40px from its top edge, cut with `clip-path: polygon()`, at its own horizontal position and in its own colour, holding one section name at 18px. The front folder is open and runs off the bottom edge; it carries the single action as a solid button at its top-left with 32px padding. Each folder links to its section and lends that section its ground colour. The tab shape returns as the button's top corners.

On a phone: The headline sits 96px down at 17vw on one line, or two at 15vw, centred, with the supporting sentence at 16px beneath. The folder stack starts at 48svh at full width: bands offset 52px, tabs 32px tall with names at 15px, staggered left, centre and right. The front folder runs off the bottom with the action button at full width inside it.
Headline: The name or a two-word statement on one line of up to about 12 characters at 10vw; two lines allowed on a phone.

Adjusted for this page:
- It names a kind of typeface: use the dealt faces (display Libre Franklin, text Source Serif 4) and their settings; capitals only where the type system sets them.

## 7. Sections, in order
Each is a composition to rebuild with this project's content. Keep the geometry; change the subject. Re-order or drop a
section when the argument of the page needs it (see references/copy.md), never to fall back to a card grid.

### 1. list — Statement, table pushed right (table)
A heading of four to six words spans the full width on two lines at clamp(40px, 4.5vw, 68px), left-aligned with its first line indented 3vw and leading 0.98. 96px below, the table is pushed into the right-hand five columns (8–12) and the left stays open. One plain word naming the table (offices, hours, rates) hangs at 14px in column 7, top-aligned with the first row. Each row is a three-part line at 15–16px with 26px between rows: the kind or day in the soft ink at the left of the measure, the place or service at 30%, and the address, time or price right-aligned, with a small arrow where the row links. Rows are separated by space only; every fourth row has 44px above it to form groups. In columns 1–4, bottom-aligned with the last row, one 4:5 photograph 22vw wide may sit alone. Holds 5–14 rows.
On a phone: Heading at 9.5vw without the indent. The table takes the full width at 16px; each row stacks the kind above the place, with the value right-aligned on the first line. The naming word is dropped because the heading already says it. The photograph follows at 60% width on the right margin.

### 2. work — Stacked folders with tabs (band)
Projects are filed as folders: four to six full-width flat colour bands stacked so that each shows a 64px strip above the next, built with `position: sticky` and increasing `top` offsets (0, 64, 128px) so the bands pile up as the page scrolls. From the top-left edge of each band one or two tabs rise: filled shapes 44px tall and 200–320px wide with shouldered corners cut by `clip-path: polygon()` or an inline SVG path, side by side with 6px gaps, each in a flat colour that contrasts with its band. The project name sits inside the tab at 26–28px; the category sits right-aligned in the band's visible strip at 15px. An open band is 80svh: a 16:10 photograph in columns 1–7 and, top-aligned in columns 9–12, a 60-word description with a link. A two-word heading at 32px precedes the stack.
On a phone: Bands do not stick; they stack in normal flow, each led by one tab 40px tall with the name at 20px and the category beside it. Inside a band the photograph is full width at 4:3 with the description beneath at 16px and 20px padding.

### 3. features — Close-ups on a board (mosaic)
A board of filled tiles, each a macro view of one small part of the interface. A 12-column grid with 8px gaps, 104px rows and 10px outer margins, no empty cells, no outlines. Eight tiles in four sizes: 6×4, 6×2, 3×4 and 3×2 (columns × rows). Each tile is a flat palette colour with overflow: hidden and holds one real element, built in em and enlarged to 300–400% through the font-size of its data-ui root: a toggle, a pair of key caps, a status word on its block, one figure from a readout, a slider thumb on its track, three stacked initials discs. The element is pushed off-centre so two of the tile's edges crop it. Bottom-left in every tile, 20px in: the capability's name at 18px medium and one line at 15px. One 6×2 tile holds only the heading, two to four words at clamp(36px, 4vw, 60px), top-left.
On a phone: Two columns, 6px gaps, rows of 28vw. Large tiles span both columns and three rows; the rest are one column by two rows. The heading tile leads at full width, two rows tall, type at 9vw. Enlarged elements keep their scale and are cropped harder; captions stay bottom-left at 16px and 14px.

Adjusted for this page:
- It sets text at 10px: use your small step (13px or more) instead.

### 4. showcase — Square plate, spare text (split)
One flat field split 50/50, at least 88svh tall. Left half: a single square photograph filling the half's width minus 40px margins, vertically centred, square corners. A large simple shape may be laid over it to turn the photograph into the object it stands for: a ring 86% of its width with a 6px stroke and a small solid dot at the centre makes a record; a notch cut by clip-path makes a ticket stub. Right half, a flex column with space-between: at the top a row of three plain text tabs at 18px (editions, years, variants), the active one in full ink and the others at 40%; in the middle the title, two to four words at 32–40px bold, with a 34ch description 48px below; along the bottom two filled rectangular cells side by side, each half the column wide and 72px tall, acting as the two actions, one in ink and one a tone off the field.
On a phone: The square photograph comes first at full width with 16px margins. The tabs sit under it as one row at 17px. Then the title at 28px, the description, and the two action cells stacked, each full width and 60px tall.

Adjusted for this page:
- It fades text: anything a visitor reads, inactive items of a list included, is `--ink` or `--muted` at full strength (contrast 4.5:1 or more). The active item is told apart by `--ink` against `--muted`, weight or the accent, not by fading the rest.

### 5. how-it-works — One card, four fields (strip)
Four flat colour fields stand side by side across the full viewport, each 25vw wide and 84svh tall, butted together with no gaps; neighbours differ clearly in lightness. The same card from the product (a ticket, an order, a request) appears once in each field at the same height, 38% down, centred, 260px wide at true size, each copy marked data-ui. It is further along every time: bare as it arrives, then with an owner and a due date, then with its checklist half ticked, then closed with its final figure. Along the bottom of each field, 28px in, one clause at clamp(22px, 2vw, 32px) on two lines begins with its order word: 'First it lands here.' 'Then someone takes it.' The heading, two to four words at the same size in the heaviest weight, sits top-left in the first field only. On hover a field's card rises 6px over 150ms.
On a phone: The fields stack, each full width and 64svh tall, colours meeting edge to edge. In each: the clause at 24px top-left with 20px margins, then the card at true size, left-aligned, 32px below. The heading sits in the first field above its clause, at 24px in the heaviest weight.

### 6. about — Side facts, wide paragraph (table)
Two rows share one vertical line at 34% of the viewport width. Row one: in a 160px column at the left margin, three label and value pairs stack with 20px between them, each a label in the soft ink with its value beneath in full ink, all at 13px (founded, based in, team size). From the 34% line a five-line paragraph at clamp(20px, 1.7vw, 26px), leading 1.35, runs to 90% of the width. Row two starts 120px lower and repeats the logic for the record of the practice: one plain word at 13px at the far left (awards, press, clients), then from the 34% line two list columns, each 260px wide with a 64px gutter, at 13px with 10px between lines: name at the left, year at the right in the soft ink. No heading; the paragraph opens the section. Each list comfortably holds 6–12 lines. No photographs are needed.
On a phone: Everything aligns to the left margin. The paragraph comes first at 19px. The three label and value pairs follow as a two-column grid at 14px. The two record lists stack with 40px between them, each opened by its plain word in full ink.

### 7. cta — The idea again, inverted (statement)
The close flips the page's colours: ink becomes the ground and the ground becomes the ink, across a full-bleed field at least 90svh tall. The page's opening idea returns as a headline of three to five words at 9–11vw on two lines, leading 0.9, flush left, positioned in the upper two-thirds; it should echo the hero's wording, not repeat it. Along the bottom, on one shared baseline 40px above the edge: one supporting sentence at 20px in columns 1–5 and one rectangular button in the accent colour, right-aligned in columns 10–12, about 56px tall. Nothing else: no image, no second button, no logo. The field's top edge is a hard horizontal line where it meets the section above. If the footer follows on the same inverted field, leave 160px before it so the close still reads as its own screen.
On a phone: The same inverted field at 80svh. Headline at 15vw on two lines at the top. The sentence sits lower at 17px, and the button spans the full width at the bottom, 56px tall, with 20px margins. Nothing else is added.

### 8. footer — The mark, built large (band)
On a flat colour field, the brand closes the page as a construction rather than as set type. Across the full content width and about 34svh tall, the wordmark is built from blocks: each letter is knocked out of its own solid rectangle in a palette colour, the rectangles differ in height (60–100% of the band) and butt together with 4px gaps, bottoms on one line. Where the project has a simple geometric mark or motif, enlarge that instead, drawn as inline SVG from flat rectangles, circles and quarter-arcs with the same 4px gaps. Below, 56px lower: four columns of plain links at 15px across columns 1–8, and two addresses or contact lines in columns 9–12. A last row carries the copyright at the left and one small filled button at the right. Space and the block construction do all the separating.
On a phone: The block wordmark spans the full width at about 22svh tall; a long name breaks into two rows of blocks. Link columns go two across at 15px, contact lines beneath at full width, then copyright and the small button on one row.

## 8. Motion — Index with preview
Rows of text are the navigation through the work; pointing at a row brings up its image in one fixed frame and dims the other rows. On touch screens each row shows its image inline instead. Fast and exact (about 240ms crossfade), no lag behind the pointer. Recipe: 'Index with preview, anchored to the row' in references/motion.md.
This is the signature move, the one loud moment. Around it the page still needs the rest of the motion layer (SKILL.md step 9): an entrance for the parts of every section, feedback on every control, and one moving picture. The inspector fails a page that barely moves. Recipes: references/motion.md.

## 10. Where the richness comes from
One shape at many sizes. The giant cropped shape gives the hero mass and colour without a single image.

## 11. How this direction goes wrong
One motif means one. A circle here, a hexagon there and a blob behind is the generated look this replaces. The motif must come from the subject and you must be able to say from where in one clause.

## 12. Real references
Studied sites that work this way. Take the principle, never the specifics: no names, copy, images or signature assets of theirs.
- **Midnight** (One Page Love, studied score 7.1) `opl-midnight-2`
  Idea: The headline's circles are literally pictured: one blurred dark ring, sliced into horizontal bands, becomes the hero, the demo panel, the session cards and the footer.
  Hero: No navigation at all. A canvas fills the full width and the top 90% of the viewport: a huge out-of-focus dark navy ring on drifting taupe, sage and terracotta, cut into horizontal bands about 78px tall that are slightly offset like blinds. On the vertical centre line, starting 58px from the left, sit a small rounded-square line icon and a one-line headline at 48px in cream. On the same baseline, starting 59% across, a two-line 17px statement whose first sentence is white and bold while the rest drops to half opacity. The cream page background shows as a 90px strip at the bottom. No button.
  Worth taking: Slice a soft blurred gradient into horizontal bands with small offsets so a familiar glow becomes a recognisable, ownable texture.
- **Superlocal 2026** (One Page Love, studied score 7.4) `opl-superlocal-2026`
  Idea: Everything is a circle: a dot-matrix logotype whose dots become floating photo circles and glowing orbs across a grey-to-orange field.
  Hero: Mid-grey field with a faint dot grid (one dot every 33px) that fades through the lower half into saturated orange at the bottom edge. The captured first paint contains one element: a 270×80px logotype dead centre, built from black ellipses of varying size, its letters progressively compressed to the right. No nav or text yet. After loading, a cluster of four small pills (one black, three white) appears top-centre; the logo turns white inside a 330px ring of about fifty tiny circles — round photo crops, glowing orbs, coins; and the bottom edge carries the event name left and dates right in an outlined dot-matrix face 40px tall.
  Worth taking: Build the logotype from a dot matrix of ellipses of varying size, then reuse the same matrix at screen-filling scale as the footer background.
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

Saved to /home/user/tpi-website-ai-poc/.taste-skill/one-motif/direction.json · reprint with `node draw.mjs --show`
````
