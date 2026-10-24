// Names of nodes and menu labels in en and vi, read from docs/i18n/glossary.csv (M7-01, #38), the
// single source of those names: zh-TW comes from nodes.csv and navigation.csv. A page that shows a
// name with no translation in its locale fails the build instead of showing the zh-TW text.
import glossaryCsv from '../../../docs/i18n/glossary.csv?raw';
import { readRows } from '../ia/nodes';
import { DEFAULT_LOCALE, type Locale } from './locales';

const rows = readRows(glossaryCsv, 'glossary.csv', ['id', 'zh-TW', 'en', 'vi']);
const byId = new Map(rows.map((r) => [r.id, r]));

// The `id` row's text in `locale`; `zh` is the zh-TW text, which the source file owns
function translate(id: string, zh: string, locale: Locale): string {
  if (locale === DEFAULT_LOCALE) return zh;
  const text = byId.get(id)?.[locale];
  if (!text) throw new Error(`docs/i18n/glossary.csv has no ${locale} for ${id} (${zh})`);
  return text;
}

export const nodeTitle = (id: string, zh: string, locale: Locale) => translate(`node:${id}`, zh, locale);

// Whether node `id` has a name in `locale`
export const hasNodeTitle = (id: string, locale: Locale) => locale === DEFAULT_LOCALE || !!byId.get(`node:${id}`)?.[locale];

export const navLabel = (label: string, locale: Locale) => translate(`nav:${label}`, label, locale);
