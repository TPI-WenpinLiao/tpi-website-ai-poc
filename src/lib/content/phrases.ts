// Where short display text may break (#202). src/styles/base.css sets headings and .text-phrase to
// `word-break: keep-all`, so Chinese breaks only at spaces and punctuation and never inside a word
// (數位轉／型). A run with no punctuation (產出清冊與申報格式) then has no break opportunity at all,
// and when it is wider than its column `overflow-wrap: anywhere` breaks it at any character
// (申報格／式). This puts a <wbr> between the words of such a run, so it breaks between words and
// `text-wrap: balance` has places to balance at. Words come from Intl.Segmenter (the ICU dictionary,
// as src/lib/search/segment.ts uses for the search index). A one-character word (與, 的, or a word
// the dictionary splits, 汰／換) keeps to both its neighbours, so a line never starts or ends on it.
// src/middleware.ts applies it to every page's headings and .text-phrase elements.
import { HTMLElement, parse, TextNode } from 'node-html-parser';
import type { Locale } from '../i18n/locales.ts';

const HAN_WORD = /^\p{Script=Han}+$/u;

const escapeText = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** The text split into the pieces a line may break between (only between two Han words of two or more characters). */
export function phrases(text: string, locale: Locale): string[] {
  const words = [...new Intl.Segmenter(locale, { granularity: 'word' }).segment(text)].map((s) => s.segment);
  const breakable = (w: string) => HAN_WORD.test(w) && [...w].length > 1;
  const out: string[] = [];
  words.forEach((w, i) => {
    const before = words[i - 1];
    if (out.length > 0 && before !== undefined && breakable(before) && breakable(w)) out.push(w);
    else if (out.length > 0) out[out.length - 1] += w;
    else out.push(w);
  });
  return out;
}

// The elements base.css sets to keep-all
const SELECTOR = 'h1, h2, h3, h4, h5, h6, .text-phrase';

/** A page's HTML with <wbr> between the words of its headings and .text-phrase text. Only zh-TW pages change. */
export function phrasedHtml(html: string, locale: Locale): string {
  if (locale !== 'zh-TW') return html;
  const root = parse(html, { comment: true, blockTextElements: { script: true, style: true, noscript: true, pre: true } });
  let changed = false;
  // A matching element can sit inside another (a .text-phrase in a heading): each text once
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
