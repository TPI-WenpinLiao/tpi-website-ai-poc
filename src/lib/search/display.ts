// Undoes segment.ts's spaces for display (M6-02, #34): the zh-TW index has a space between every
// two words, so Pagefind's titles and excerpts read 協助 企業 實現. A space between two CJK
// characters (Han, CJK punctuation, full-width forms) is removed, also when a <mark> tag of the
// excerpt sits next to it. Spaces next to Latin letters or digits stay, as in AI 核心.
const CJK = String.raw`[\p{Script=Han}　-〿＀-￯]`;
const TAG = '(?:</?mark>)*';
const BETWEEN = new RegExp(`(?<=${CJK}${TAG}) (?=${TAG}${CJK})`, 'gu');

export const despace = (text: string) => text.replace(BETWEEN, '');
