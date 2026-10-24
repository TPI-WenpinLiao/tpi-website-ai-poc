// Home page copy by locale. Each file is named after its locale and exports `home`; every locale
// with interface copy (src/data/strings) needs one, so a missing file fails the build of that
// locale's first page instead of falling back to zh-TW text.
import { isLocale, type Locale } from '../../lib/i18n/locales';
import type { Home } from './zh-TW';

const HOME: Partial<Record<Locale, Home>> = Object.fromEntries(
  Object.entries(import.meta.glob<Home>(['./*.ts', '!./index.ts'], { eager: true, import: 'home' })).map(([file, h]) => {
    const locale = file.replace(/^\.\/|\.ts$/g, '');
    if (!isLocale(locale)) throw new Error(`src/data/home/${locale}.ts is not named after a locale in src/lib/i18n/locales.ts`);
    return [locale, h];
  }),
);

export function home(locale: Locale): Home {
  const h = HOME[locale];
  if (!h) throw new Error(`src/data/home has no ${locale} file`);
  return h;
}
