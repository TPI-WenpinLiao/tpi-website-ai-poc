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

// Names whose number follows after a space: standards (ISO 27001, BPMN 2.0), product models
// (RTX 4060), list names (FT 500). Any other word before a number leaves it a quantity (AI 24 小時,
// TCFD 3 種, in 2008). Add a prefix here when a fact puts a new one in a hero point.
const NAMED = ['ISO', 'IEC', 'CNS', 'RFC', 'IEEE', 'NIST', 'BPMN', 'RTX', 'FT'];

const QUANTITY = new RegExp(
  `(?<![A-Za-z\\d.,:/-])(?<!\\b(?:${NAMED.join('|')})\\s)(\\d(?:[\\d,.]*\\d)?(?:\\s?[-–~]\\s?\\d(?:[\\d,.]*\\d)?)?(?:\\s?%)?)(?![A-Za-z\\d])`,
);

/** Counts, years, ranges and percentages that stand on their own. A number that is part of a name
 * stays plain: one touching a Latin letter, a digit or a joining mark (ISO27001, K8s, RFC-7519,
 * 14064-1:2018), and one after a NAMED prefix and a space (ISO 27001). A Latin word after the number
 * is its unit and does not stop it (300-1000 TPS, 2 Core). For short fact texts where every quantity
 * should stand out (PageHero's evidence). */
export const quantities = (text: string): Part[] => split(text, QUANTITY);
