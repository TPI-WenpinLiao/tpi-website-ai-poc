// zh-TW word segmentation for the Pagefind index (M6-02, #34). Pagefind segments zh-* pages with
// a dictionary of simplified Chinese, so traditional text comes out one character a word (企業 →
// 企 業), while its browser search splits the query with Intl.Segmenter (企業 stays one word): a
// zh-TW query then matches almost nothing. So the integration indexes zh-TW pages as a language
// Pagefind does not segment, with the words already split by Intl.Segmenter (the same ICU word
// rules the browser uses) and joined with spaces, and renames that index back to zh-tw, the index
// the browser loads for <html lang="zh-TW">. Only the copy given to Pagefind changes, not dist/.
// The spaces end up in the result titles and excerpts; SearchResults removes them (display.ts).
import { HTMLElement, parse, TextNode } from 'node-html-parser';
import type { Locale } from '../i18n/locales.ts';

// Locales whose index is built from pre-segmented text: the language code Pagefind indexes them
// under (not zh-*, so it doesn't segment them again) and the index name the browser asks for
export const SEGMENTED: Partial<Record<Locale, { indexAs: string; index: string }>> = {
  'zh-TW': { indexAs: 'zhtw', index: 'zh-tw' },
};

const escapeText = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const HAN = /\p{Script=Han}/u;

// Splits text into ICU words and puts a space between two words that meet at a Han character with
// no space between them: Pagefind already splits Latin words at spaces and punctuation (UI/UX)
export function segmentText(text: string, locale: Locale): string {
  const words = [...new Intl.Segmenter(locale, { granularity: 'word' }).segment(text)].map((s) => s.segment);
  const gap = (before: string, word: string) => (HAN.test(before.at(-1) ?? '') || HAN.test(word[0] ?? '')) && !/\s$/.test(before) && !/^\s/.test(word);
  return words.reduce((out, w) => (out !== '' && gap(out, w) ? `${out} ${w}` : out + w), '');
}

const SKIP = ['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE'];

function segmentNodes(el: HTMLElement, locale: Locale): void {
  for (const child of el.childNodes) {
    if (child instanceof TextNode) child.rawText = escapeText(segmentText(child.text, locale));
    else if (child instanceof HTMLElement && !SKIP.includes(child.tagName)) segmentNodes(child, locale);
  }
}

// The page's HTML as Pagefind should index it: every text node of <body> segmented, and <html lang>
// set to the code the locale is indexed under. Pages of other locales come back unchanged.
export function indexedHtml(html: string, locale: Locale): string {
  const segmented = SEGMENTED[locale];
  if (!segmented) return html;
  const root = parse(html, { blockTextElements: { script: true, style: true, noscript: true } });
  const page = root.querySelector('html');
  const body = root.querySelector('body');
  if (!page || !body) throw new Error('indexedHtml: the page has no <html> or <body>');
  page.setAttribute('lang', segmented.indexAs);
  segmentNodes(body, locale);
  return root.toString();
}
