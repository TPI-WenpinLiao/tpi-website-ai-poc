// @ts-check
import { defineConfig } from 'astro/config';
import { DEFAULT_LOCALE, LOCALES } from './src/lib/i18n/locales.ts';

// Placeholder origin until a production domain is decided; Cloudflare Pages serves *.pages.dev.
const SITE = process.env.SITE_URL ?? 'https://tpi-website-ai-poc.pages.dev';

export default defineConfig({
  site: SITE,
  output: 'static',
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
  vite: {
    css: {
      // Lightning CSS resolves @custom-media breakpoints from src/styles/media.css (M3-02)
      transformer: 'lightningcss',
      lightningcss: { drafts: { customMedia: true } },
    },
  },
  i18n: {
    locales: [...LOCALES],
    defaultLocale: DEFAULT_LOCALE,
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
