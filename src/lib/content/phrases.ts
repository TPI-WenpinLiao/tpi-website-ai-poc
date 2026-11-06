// Where short display text may break (#202). src/styles/base.css sets headings and .text-phrase to
// `word-break: keep-all`, so Chinese breaks only at spaces and punctuation and never inside a word
// (數位轉／型). A run with no punctuation (產出清冊與申報格式) then has no break opportunity at all,
// and when it is wider than its column `overflow-wrap: anywhere` breaks it at any character
// (申報格／式). This puts a <wbr> between the words of such a run in a heading, so it breaks between
// words and `text-wrap: balance` has places to balance at. Words come from Intl.Segmenter (the ICU dictionary,
// as src/lib/search/segment.ts uses for the search index). A one-character word (與, 的, or a word
// the dictionary splits, 汰／換) keeps to both its neighbours, so a line never starts or ends on it.
// src/middleware.ts applies it to every page's headings.
import { HTMLElement, parse, TextNode } from 'node-html-parser';
import type { Locale } from '../i18n/locales.ts';

const HAN_WORD = /^\p{Script=Han}+$/u;
// A run of Han words this long or shorter fits a heading line even at 375 wide and stays whole, so a
// compound the dictionary splits (生命／週期) isn't broken; only a longer run gets break opportunities
const LONG_RUN = 8;

const escapeText = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * The text split into the pieces a line may break between: only inside a run of more than LONG_RUN Han
 * characters with no space or punctuation, and only between two words of two or more characters.
 */
export function phrases(text: string, locale: Locale): string[] {
  const words = [...new Intl.Segmenter(locale, { granularity: 'word' }).segment(text)].map((s) => s.segment);
  // The length of the Han run each word belongs to (0 for spaces, punctuation and Latin words)
  const runOf = words.map(() => 0);
  for (let i = 0; i < words.length; ) {
    let j = i;
    let chars = 0;
    while (j < words.length && HAN_WORD.test(words[j] ?? '')) chars += [...(words[j++] ?? '')].length;
    for (let k = i; k < j; k++) runOf[k] = chars;
    i = j > i ? j : i + 1;
  }
  const breakable = (i: number) => HAN_WORD.test(words[i] ?? '') && [...(words[i] ?? '')].length > 1 && (runOf[i] ?? 0) > LONG_RUN;
  const out: string[] = [];
  words.forEach((w, i) => {
    if (out.length > 0 && breakable(i - 1) && breakable(i)) out.push(w);
    else if (out.length > 0) out[out.length - 1] += w;
    else out.push(w);
  });
  return out;
}

// Headings, where base.css's keep-all meets a long run in a narrow column. Lead text (.text-phrase)
// is set smaller in a wider measure and reads better broken at its punctuation, so it is left alone
const SELECTOR = 'h1, h2, h3, h4, h5, h6';

/** A page's HTML with <wbr> between the words of the long runs in its headings. Only zh-TW pages change. */
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
