// @ts-check
import { defineConfig } from 'astro/config';
import { DEFAULT_LOCALE, LOCALES } from './src/lib/i18n/locales.ts';
import sitemap from './src/integrations/sitemap.ts';

// Placeholder origin until a production domain is decided; Cloudflare Pages serves *.pages.dev.
const SITE = process.env.SITE_URL ?? 'https://tpi-website-ai-poc.pages.dev';

export default defineConfig({
  site: SITE,
  output: 'static',
  trailingSlash: 'never',
  integrations: [sitemap()],
  build: {
    format: 'file',
  },
  // Gives Markdown body images (and <Image> without widths) a srcset: without it a phone downloads
  // the 1600px original of every news and blog photo (#87). Fixed-height logos opt out with
  // layout="none"; responsiveStyles stays off, so no image gets styles it did not ask for
  image: {
    layout: 'constrained',
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
