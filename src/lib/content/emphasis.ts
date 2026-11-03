// Numbers in a fact text stand out in bold, the text itself unchanged (design-principles.md P2: a
// number is bolded, never enlarged into the main visual). Parts alternate plain and strong.
export interface Part {
  part: string;
  strong: boolean;
}

const split = (text: string, pattern: RegExp): Part[] => text.split(pattern).map((part, i) => ({ part, strong: i % 2 === 1 }));

/** Every number, with its % when it has one: a result's figures (home AI results, CaseList). */
export const numbers = (text: string): Part[] => split(text, /(\d[\d,.]*\s?%?)/);

/** Only percentages: facts that also hold version numbers, specs or standards (RFC-7519, 2 Core CPU),
 * where only the outcome figures should stand out (PageSections). */
export const percentages = (text: string): Part[] => split(text, /(\d[\d,.]*\s?%)/);
