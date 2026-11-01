# 五個方向的發牌結果（#166）

`taste-skill` run 的第 3 步（`.claude/skills/taste-skill/SKILL.md`「3. Draw the direction」）。`draw.mjs --options 5` 從符合 brief 的方向裡隨機發出五個；五個全部做成原型，不在這一步替人選（`design-concept` skill「用 `taste-skill` 做原型」）。每個方向的完整 direction sheet、redraw 與 idea 句在 `<direction>/sheet.md`。

## 參數與理由

```bash
node .claude/skills/taste-skill/scripts/draw.mjs --sector saas \
  --brief "TPIsoftware (昕力資訊), a Taiwanese enterprise software maker that builds and deploys its own API management, integration and on-premises AI products for banks, insurers and government agencies, connecting them to the core systems they already run" \
  --sections list,work,features,showcase,how-it-works,about,cta,footer --options 5
```

| 參數 | 值 | 理由 |
|---|---|---|
| `--sector` | `saas` | 昕力是賣自有軟體的公司；`finance` 是給銀行與金融產品本身的，`dev-tool` 的讀者是開發者，本站的主要讀者是決策者 |
| `--sections` | `list,work,features,showcase,how-it-works,about,cta,footer` | 照 `argument.md`「論點」的段落順序：產業入口、AI 案例、產品家族、OrientAI、產品與導入、穩定度、聯絡業務、頁尾 |
| `--have` | 不帶 | 沒有產品介面截圖、沒有公司自己的照片；`src/assets/design/` 只有抽象 3D 渲染，不是這個主題的照片或插圖 |
| `--keep` | 不帶 | 使用者決定配色與字體照發牌，品牌紫只留在 logo 與主要 CTA |
| `--tone` | 不帶 | brief 沒有明確要求某一種語氣 |

發牌日期 2026-11-01。發牌前 `~/.taste-skill/history.json` 不存在，沒有因為最近用過而避開的方向。

## 輸出

```text
# 5 directions dealt for this brief

Choose the one whose way of composing can best carry an idea from your inventory (SKILL.md steps 1 and 4), not the
most familiar one. Then deal it in full with the same command plus `--direction <id>` (and without --options).

## `one-motif` — One motif
Idea engine: Take one shape from the subject and let it run the whole system. A drilling tool's octagonal cross-section becomes the buttons, the image masks and the loader.
Composition: Hero: the motif appears once at enormous scale as a flat filled shape, cropped by the viewport (a circle 120vh across entering from the right, a chamfered block filling the lower half), with a short headline at 6–8vw and one supporting sentence set on the remaining ground, left-aligned on a shared margin. Through the page the motif returns as: the mask for every photograph (via `clip-path` or `border-radius` made from the same geometry), the shape of the primary button, the bullet beside list items at text size, and one full-width band that separates the two halves of the page.

## `loud-flat-poster` — Loud and flat
Idea engine: A page with the directness of a street poster: flat saturated colour, the heaviest type you can find, short blunt statements, and photographs cut out and stuck on. It is for subjects with a voice.
Composition: Hero: a statement of three to six words in ultra-heavy type at 11–15vw, filling the width, lines stacked tight (leading 0.85), flush left with 20–28px margins, on a flat saturated ground. One cut-out or hard-cropped photograph overlaps the type from the right or bottom, tilted 3–6 degrees.

## `borrowed-category` — Dressed as something else
Idea engine: Art-direct the subject as if it belonged to a different, more vivid category. A money app is sold like a streetwear drop.
Composition: Depends on the borrowed category, so decide it explicitly and write it in your notes. Fashion drop: one shouted condensed headline across the full width, a single cropped image under it, then product facts as a blunt list.

## `product-performs` — The product performs
Idea engine: Software is most convincing when it is doing its job in front of you. Instead of describing features, put small, true, working fragments of the product on the page: the actual control, with real content, responding to the pointer.
Composition: Hero: a short plain headline (4–6vw, left-aligned, upper-left third) and one sentence; the rest of the first screen is the main fragment at actual interface size, sitting directly on the page or on one flat stage colour, large enough to read every label. The fragment is built in HTML and works.

## `colour-chapters` — Colour chapters
Idea engine: Every section is a chapter with its own flat colour, floor to ceiling. The page reads like a set of posters hung in a row, held together by one typeface and one grid.
Composition: Sections are full-bleed fields, each at least 90svh tall, butted directly against each other with no gap and no divider. Inside every field the same 12-column grid and the same margins apply, and each field holds one thing: a huge heading (8–12vw) with a small paragraph, or one photograph with a caption, or one list.

```

## 五個方向的完整 sheet

每個方向都用同一組參數加 `--direction <id>` 發完整的 sheet，工作檔在 `.taste-skill/<id>/direction.json`（已 gitignore）。

| 方向 | sheet | seed | redraw |
|---|---|---|---|
| `one-motif` | [one-motif/sheet.md](one-motif/sheet.md) | 259476857 | 2 次 |
| `loud-flat-poster` | [loud-flat-poster/sheet.md](loud-flat-poster/sheet.md) | 456567933 | 4 次 |
| `borrowed-category` | [borrowed-category/sheet.md](borrowed-category/sheet.md) | 1677797083 | 0 次 |
| `product-performs` | [product-performs/sheet.md](product-performs/sheet.md) | 1858352818 | 2 次 |
| `colour-chapters` | [colour-chapters/sheet.md](colour-chapters/sheet.md) | 759717745 | 3 次 |
