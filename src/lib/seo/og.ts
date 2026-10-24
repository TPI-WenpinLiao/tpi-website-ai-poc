// Site-wide default social image (content-model.md `ogImage`), rendered by
// scripts/design/og-image.mjs. BaseLayout falls back to it; JSON-LD `image` does too. Its alt is the
// site name of the page's locale.
import type { Locale } from '../i18n/locales.ts';
import { siteName } from './meta.ts';

export interface OgImage {
  // Site-relative path or absolute URL
  src: string;
  width: number;
  height: number;
  alt: string;
}

export const defaultOgImage = (locale: Locale): OgImage => ({ src: '/og/default.png', width: 1200, height: 630, alt: siteName(locale) });
