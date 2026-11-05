// A fact text split into items, one per line (site-research 第 2 條), shown as a list: a text of
// LIST_LINES lines or more is a list, led by its first line when that line ends in a colon. The items
// go in two columns, so short items don't make one tall column (design-principles.md「內頁共用的規則」
// 375 寬: short-word lists in two columns). SpecTable and PageSections use it.
const LIST_LINES = 5;

export function factList(
  text: string,
): { lead: string | undefined; items: string[] } | undefined {
  const lines = text.split("\n");
  if (lines.length < LIST_LINES) return undefined;
  const led = /[:：]$/.test(lines[0] ?? "");
  return {
    lead: led ? lines[0] : undefined,
    items: led ? lines.slice(1) : lines,
  };
}
