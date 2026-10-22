// Writes dist/sitemap.xml from the pages Astro built (src/lib/seo/sitemap.ts). In the repo instead
// of @astrojs/sitemap so the sitemap's hreflang comes from the same functions as each page's <head>.
import { writeFile } from 'node:fs/promises';
import type { AstroIntegration } from 'astro';
import { sitemapXml } from '../lib/seo/sitemap.ts';

export default function sitemap(): AstroIntegration {
  let site: URL | undefined;
  return {
    name: 'tpi-sitemap',
    hooks: {
      'astro:config:done': ({ config }) => {
        site = config.site ? new URL(config.site) : undefined;
      },
      'astro:build:done': async ({ pages, dir, logger }) => {
        if (!site) throw new Error('astro.config.mjs must set site for sitemap URLs');
        const xml = sitemapXml(pages.map((p) => `/${p.pathname}`), site);
        await writeFile(new URL('sitemap.xml', dir), xml);
        logger.info(`sitemap.xml: ${xml.match(/<url>/g)?.length ?? 0} URLs`);
      },
    },
  };
}
