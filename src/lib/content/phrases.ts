// Where short display text may break (#202). src/styles/base.css sets headings and .text-phrase to
// `word-break: keep-all`, so Chinese breaks only at spaces and punctuation and never inside a word
// (數位轉／型). A run with no punctuation (產出清冊與申報格式) then has no break opportunity at all,
// and when it is wider than its column `overflow-wrap: anywhere` breaks it at any character
// (申報格／式). This puts a <wbr> between the words of such a run in a heading, so it breaks between
// words and `text-wrap: balance` has places to balance at. Words come from Intl.Segmenter (the ICU dictionary,
// as src/lib/search/segment.ts uses for the search index). A word the dictionary splits into two single
// characters (控／管, 監／控) is put back together first, so the run still has a break before it
// (集中／控管, #225); a one-character word left on its own (與, 的, 都) keeps to both its neighbours,
// so a line never starts or ends on it. src/middleware.ts applies it to every page's
// headings and .text-phrase text (names, taglines, footer links), where base.css's keep-all would
// otherwise leave a long run nothing but a break at any character. A run is everything between spaces
// and punctuation, so Han mixed with Latin counts as one (現金業務API管理平台, Card+信用卡行動服務:
// keep-all gives no break between API and 管 either), and a Latin word is a word it may break beside.
import { HTMLElement, parse, TextNode } from 'node-html-parser';
import type { Locale } from '../i18n/locales.ts';
import { textWidth } from './lists.ts';

const HAN_WORD = /^\p{Script=Han}+$/u;
const LATIN_WORD = /^[\p{L}\p{N}]{2,}$/u;
// One-character function words: particles, conjunctions, prepositions and quantifiers that belong to
// the words around them and never start or end a line on their own
const FUNCTION_CHAR = /[的之與及和或在從各於是了也都就而並把被對向為以由將讓等其所此該每再更最很又亦即但若如因可]/u;
// What ends a run: a space or a punctuation mark, where keep-all already lets a line break
const RUN_END = /^[\s\p{P}]+$/u;
// A run this wide or narrower (in full-width characters, textWidth) fits a heading line even at 375
// wide and stays whole, so a compound the dictionary splits (生命／週期) isn't broken; only a longer
// run gets break opportunities
const LONG_RUN = 8;

const escapeText = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * The text split into the pieces a line may break between: only inside a run wider than LONG_RUN with no
 * space or punctuation, and only between two words, each a Han word of two or more characters or a Latin word.
 */
export function phrases(text: string, locale: Locale): string[] {
  // Exactly two one-character Han words side by side, neither a function word, are one word the
  // dictionary doesn't know (控／管 → 控管, 監／控 → 監控). A function word (的, 與, 各) stays on
  // its own and keeps to its neighbours, and so does a longer string of single characters, which is
  // more likely a phrase the dictionary got wrong than one word: joining it would let a line start
  // on 的 (聰明／的碳, #228)
  const segments = [...new Intl.Segmenter(locale, { granularity: 'word' }).segment(text)].map((s) => s.segment);
  const single = (w: string | undefined) => w !== undefined && HAN_WORD.test(w) && [...w].length === 1;
  const words: string[] = [];
  for (let i = 0; i < segments.length; i++) {
    const [a, b] = [segments[i] ?? '', segments[i + 1]];
    const pair = single(a) && single(b) && !single(segments[i - 1]) && !single(segments[i + 2]);
    if (pair && !FUNCTION_CHAR.test(a + b)) {
      words.push(a + b);
      i++;
    } else words.push(a);
  }
  // The width of the run each word belongs to (0 for spaces and punctuation)
  const runOf = words.map(() => 0);
  for (let i = 0; i < words.length; ) {
    let j = i;
    let width = 0;
    while (j < words.length && !RUN_END.test(words[j] ?? '')) width += textWidth(words[j++] ?? '');
    for (let k = i; k < j; k++) runOf[k] = width;
    i = j > i ? j : i + 1;
  }
  // A Han word of two or more characters, or a Latin word, in a long run
  const breakable = (i: number) => {
    const w = words[i] ?? '';
    const word = HAN_WORD.test(w) ? [...w].length > 1 : LATIN_WORD.test(w);
    return word && (runOf[i] ?? 0) > LONG_RUN;
  };
  const out: string[] = [];
  words.forEach((w, i) => {
    if (out.length > 0 && breakable(i - 1) && breakable(i)) out.push(w);
    else if (out.length > 0) out[out.length - 1] += w;
    else out.push(w);
  });
  return out;
}

// Where keep-all meets a long run in a narrow column: headings, the names, taglines and labels marked
// .text-phrase, and table cells (Prose keeps their words whole). Only runs longer than LONG_RUN change, so text that breaks at its
// punctuation reads as before (#225)
const SELECTOR = 'h1, h2, h3, h4, h5, h6, .text-phrase, td, th';

/** A page's HTML with <wbr> between the words of the long runs in its headings and .text-phrase text. Only zh-TW pages change. */
export function phrasedHtml(html: string, locale: Locale): string {
  if (locale !== 'zh-TW') return html;
  const root = parse(html, { comment: true, blockTextElements: { script: true, style: true, noscript: true, pre: true } });
  let changed = false;
  // A heading can sit inside another matching element: each text once
  const done = new WeakSet<TextNode>();
  const walk = (node: HTMLElement) => {
    for (const child of node.childNodes) {
      if (child instanceof TextNode && !done.has(child)) {
        done.add(child);
        const parts = phrases(child.text, locale);
        if (parts.length > 1) {
          child.rawText = parts.map(escapeText).join('<wbr>');
          changed = true;
        }
      } else if (child instanceof HTMLElement) walk(child);
    }
  };
  for (const el of root.querySelectorAll(SELECTOR)) walk(el);
  return changed ? root.toString() : html;
}
