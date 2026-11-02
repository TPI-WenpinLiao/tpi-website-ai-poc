// The serif heading face (#167): Noto Serif TC 700. Each page gets its own woff2 with only the
// characters it sets in serif (src/integrations/serif-fonts.ts), cut from the site's source subset
// src/assets/fonts/noto-serif-tc-700.woff2 (scripts/design/serif-subset.mjs). A shared file of every
// heading character on the site was 205 KB and cost the pages 0.05–0.15 of the Lighthouse
// performance score; a page's own file is about 10–40 KB.
import { parse } from 'node-html-parser';

/** The family name base.css's --font-serif lists first */
export const SERIF_FAMILY = 'Noto Serif TC Subset';
/** Elements set in the serif face (base.css「Typography」) */
export const SERIF_SELECTOR = 'h1, h2, h3, .serif';

/** Characters a page sets in serif. Whitespace other than the space is layout, not text. */
export function serifChars(html: string): Set<string> {
  const chars = new Set<string>();
  for (const el of parse(html).querySelectorAll(SERIF_SELECTOR)) {
    for (const c of el.text.replace(/\s+/g, ' ')) chars.add(c);
  }
  return chars;
}

/** Sorted by code point, one string */
export const serialize = (chars: Iterable<string>) => [...chars].sort((a, b) => (a.codePointAt(0) ?? 0) - (b.codePointAt(0) ?? 0)).join('');

/** The @font-face a page loads its own subset with */
export const fontFace = (url: string) =>
  `@font-face{font-family:'${SERIF_FAMILY}';font-style:normal;font-weight:700;font-display:swap;src:url(${url}) format('woff2')}`;
