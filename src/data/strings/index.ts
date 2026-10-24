// Interface copy by locale (content-model.md「不建 collection 的模板」). A locale without a file
// fails the build of its first page instead of falling back to zh-TW text.
import type { Locale } from '../../lib/i18n/locales';
import { zhTW, type Strings } from './zh-TW';
import { en } from './en';

const STRINGS: Partial<Record<Locale, Strings>> = { 'zh-TW': zhTW, en };

export function strings(locale: Locale): Strings {
  const s = STRINGS[locale];
  if (!s) throw new Error(`src/data/strings has no ${locale} file`);
  return s;
}

// Locales whose interface copy exists; pages built from nodes alone (listing, utility, contact) are
// built only for these
export const hasStrings = (locale: Locale) => STRINGS[locale] !== undefined;

// Description of a listing, utility or contact page (src/data/strings `pages`)
export function pageDescription(locale: Locale, id: string): string {
  const description = strings(locale).pages[id];
  if (!description) throw new Error(`src/data/strings/${locale}.ts has no pages['${id}']`);
  return description;
}
