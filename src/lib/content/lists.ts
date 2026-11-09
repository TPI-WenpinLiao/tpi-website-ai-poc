// A fact text split into items, one per line (site-research 第 2 條), shown as a list: a text of
// LIST_LINES lines or more is a list, led by its first line when that line ends in a colon. The items
// go in two columns, so short items don't make one tall column (design-principles.md「內頁共用的規則」
// 375 寬: short-word lists in two columns). A list with an item wider than SHORT_ITEM is `long`: its
// items are sentences, not short words, and FactText puts it in one column on narrow screens, where
// half a 375 column fits about 10 characters and a longer item would break with one character left
// on its last line (design-principles.md「斷行」, #225). FactText renders it.
const LIST_LINES = 5;
const SHORT_ITEM = 8;

/** How wide a text sets, in full-width characters: a Han or other full-width character is 1, the rest ½. */
export function textWidth(text: string): number {
  return [...text].reduce((w, c) => w + (/[\p{Script=Han}　-〿＀-￯]/u.test(c) ? 1 : 0.5), 0);
}

export function factList(
  text: string,
): { lead: string | undefined; items: string[]; long: boolean } | undefined {
  const lines = text.split("\n");
  if (lines.length < LIST_LINES) return undefined;
  const led = /[:：]$/.test(lines[0] ?? "");
  const items = led ? lines.slice(1) : lines;
  return {
    lead: led ? lines[0] : undefined,
    items,
    long: items.some((item) => textWidth(item) > SHORT_ITEM),
  };
}
