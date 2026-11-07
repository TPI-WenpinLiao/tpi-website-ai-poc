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

/** Counts, years, ranges and percentages that stand on their own. A number that is part of a name
 * stays plain: one touching a Latin letter, a digit or a joining mark (ISO27001, K8s, RFC-7519,
 * 14064-1:2018), and one right after an all-caps abbreviation (ISO 27001); after an ordinary word it
 * is a quantity again (in 2008, Over 20 years). A Latin word after the number is its unit and does not
 * stop it (300-1000 TPS, 2 Core). For short fact texts where every quantity should stand out
 * (PageHero's evidence). */
export const quantities = (text: string): Part[] =>
  split(text, /(?<![A-Za-z\d.,:/-])(?<![A-Z]{2,}\s)(\d(?:[\d,.]*\d)?(?:\s?[-–~]\s?\d(?:[\d,.]*\d)?)?(?:\s?%)?)(?![A-Za-z\d])/);
