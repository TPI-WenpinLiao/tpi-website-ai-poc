// Numbers in a fact text stand out in bold, the text itself unchanged (design-principles.md P2: a
// number is bolded, never enlarged into the main visual). Parts alternate plain and strong.
export interface Part {
  part: string;
  strong: boolean;
}

const split = (text: string, pattern: RegExp): Part[] => text.split(pattern).map((part, i) => ({ part, strong: i % 2 === 1 }));

/** Every number, with its % when it has one: the home page's AI results. */
export const numbers = (text: string): Part[] => split(text, /(\d[\d,.]*\s?%?)/);

// Names whose number follows after a space: standards (ISO 27001, BPMN 2.0), product models
// (RTX 4060), list names (FT 500), protocols (OAuth 2.0). Any other word before a number leaves it
// a quantity (AI 24 小時, TCFD 3 種, in 2008). Add a prefix here when a fact puts a new one on a page
// (emphasis-report.mjs lists what a build bolds).
const NAMED = ['ISO', 'IEC', 'CNS', 'RFC', 'IEEE', 'NIST', 'BPMN', 'RTX', 'FT', 'OAuth'];

// Units written against the number (4GB, 16 GB is covered by the space rule). Any other Latin letter
// touching a number makes it a name (K8s, ISO27001).
const UNITS = ['GB', 'MB', 'TB', 'KB', 'GHz', 'Mbps', 'Gbps', 'ms'];

// A figure: digits with separators, a range (300-1000), a pair (7×24, 7/24), a unit, a percent. A
// version (3.0.0, two dots or more) is a name, and so is a date (2024/10/01: no figure before a /).
const FIGURE = `(?!\\d+\\.\\d+\\.\\d)\\d(?:[\\d,.]*\\d)?(?:\\s?[-–~×]\\s?\\d(?:[\\d,.]*\\d)?|\\/\\d+)?(?:${UNITS.join('|')})?(?:\\s?%)?`;

// Chinese numerals count only before a unit of time (一個工作日, 三天, 兩年, 24 小時 is a figure), and
// not after 第 (第一年 is an order). Other words after them (一個平台, 一站式, 一次到位) are not counts.
const CJK = `(?<!第)[一二兩三四五六七八九十百千萬]+個?(?:工作日|小時|分鐘|個月|天|週|年)`;

const QUANTITY = new RegExp(
  `((?<![A-Za-z\\d.,:/-])(?<!\\b(?:${NAMED.join('|')})\\s)${FIGURE}(?![A-Za-z\\d/])|${CJK})`,
);

/** Counts, years, ranges, percentages and spans of time that stand on their own. A number that is
 * part of a name stays plain: one touching a Latin letter, a digit or a joining mark (ISO27001, K8s,
 * RFC-7519, 14064-1:2018), one after a NAMED prefix and a space (ISO 27001), and a version (3.0.0). A
 * Latin word after the number is its unit and does not stop it (300-1000 TPS, 2 Core), nor is a UNITS
 * unit written against it (4GB). Chinese numerals count before a unit of time (一個工作日, 30天 is a
 * figure). Every fact text uses it: FactText, SpecTable, CaseList, PageHero's evidence
 * (design-principles.md「內頁共用的規則」事實). */
export const quantities = (text: string): Part[] => split(text, QUANTITY);
