// hreflang alternates (ADR 0002「hreflang 與 x-default」): every locale version the page exists in,
// itself included, and x-default pointing at the zh-TW version when there is one. Locales whose
// switcher entry falls back to their home (target: 'home') have no version of this page.
import { DEFAULT_LOCALE } from '../i18n/locales.ts';
import type { LocaleLink } from '../i18n/alternates.ts';

export interface Alternate {
  hreflang: string;
  href: string;
}

export function hreflangAlternates(links: readonly LocaleLink[], site: URL): Alternate[] {
  const versions = links.filter((l) => l.target === 'page').map((l) => ({ hreflang: l.locale, href: new URL(l.href, site).href }));
  const fallback = versions.find((v) => v.hreflang === DEFAULT_LOCALE);
  return fallback ? [...versions, { hreflang: 'x-default', href: fallback.href }] : versions;
}
