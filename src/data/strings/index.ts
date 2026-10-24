// Interface copy by locale (content-model.md「不建 collection 的模板」). Each file is named after its
// locale and exports `strings`; adding src/data/strings/<locale>.ts turns the locale on, nothing else
// lists it. A locale without a file fails the build of its first page instead of falling back to
// zh-TW text.
import { isLocale, type Locale } from '../../lib/i18n/locales';
import type { Strings } from './zh-TW';

const STRINGS: Partial<Record<Locale, Strings>> = Object.fromEntries(
  Object.entries(import.meta.glob<Strings>(['./*.ts', '!./index.ts'], { eager: true, import: 'strings' })).map(([file, s]) => {
    const locale = file.replace(/^\.\/|\.ts$/g, '');
    if (!isLocale(locale)) throw new Error(`src/data/strings/${locale}.ts is not named after a locale in src/lib/i18n/locales.ts`);
    return [locale, s];
  }),
);

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
