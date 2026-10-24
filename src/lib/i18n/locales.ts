// Locales and URL prefixes (ADR 0002). astro.config.mjs reads LOCALES and DEFAULT_LOCALE from here,
// so the i18n config and the path helpers cannot drift apart.
export const LOCALES = ['zh-TW', 'en', 'vi'] as const;

export type Locale = (typeof LOCALES)[number];

// No URL prefix; every other locale is prefixed with its own code (/en, /vi)
export const DEFAULT_LOCALE = 'zh-TW' satisfies Locale;

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

// og:locale values (language_TERRITORY, Open Graph protocol)
export const OG_LOCALES: Record<Locale, string> = {
  'zh-TW': 'zh_TW',
  en: 'en_US',
  vi: 'vi_VN',
};

// Each locale's name written in that language (docs/ia/navigation.md, 無障礙)
export const LOCALE_NAMES: Record<Locale, string> = {
  'zh-TW': '中文',
  en: 'English',
  vi: 'Tiếng Việt',
};
