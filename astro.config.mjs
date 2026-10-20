// @ts-check
import { defineConfig } from 'astro/config';

// Placeholder origin until a production domain is decided; Cloudflare Pages serves *.pages.dev.
const SITE = process.env.SITE_URL ?? 'https://tpi-website-ai-poc.pages.dev';

export default defineConfig({
  site: SITE,
  output: 'static',
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
  i18n: {
    locales: ['zh-TW', 'en', 'vi'],
    defaultLocale: 'zh-TW',
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
