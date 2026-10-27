// Writes the site search index to dist/pagefind/ (M6-02, #34) with Pagefind's Node API, so
// `astro build` alone produces it and no build script changes. Only pages whose <main> has
// data-pagefind-body are indexed (PageLayout's `searchTrail`); Pagefind splits the index by each
// page's <html lang>.
// Pages go in with their URL path rather than the dist file, since build.format 'file' writes
// /about-us as about-us.html and results have to link to /about-us. zh-TW pages go in segmented
// with Intl.Segmenter under another language code, and that index is renamed to zh-tw afterwards
// (src/lib/search/segment.ts says why).
// The site draws its own results (SearchResults), so the UI bundles Pagefind writes are removed.
// pagefind-entry.json lists the languages in a different order on each run; it is rewritten
// sorted (with the renamed zh-tw), so the same pages give the same dist/
// (scripts/ci/lighthouse-scope.mjs --verify).
import { readFile, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';
import * as pagefind from 'pagefind';
import { localeFromPath, normalizePath } from '../lib/i18n/paths.ts';
import { indexedHtml, SEGMENTED } from '../lib/search/segment.ts';

const UNUSED = ['pagefind-ui', 'pagefind-modular-ui', 'pagefind-component-ui'].flatMap((f) => [`${f}.js`, `${f}.css`]).concat('pagefind-highlight.js');

interface Entry {
  languages: Record<string, { page_count: number }>;
}

function parseEntry(json: string): Entry {
  const entry: unknown = JSON.parse(json);
  const languages = typeof entry === 'object' && entry !== null && 'languages' in entry ? entry.languages : undefined;
  const valid =
    typeof languages === 'object' &&
    languages !== null &&
    Object.values(languages).every((l: unknown) => typeof l === 'object' && l !== null && 'page_count' in l && typeof l.page_count === 'number');
  if (!valid) throw new Error('Pagefind: pagefind-entry.json has no languages with page_count');
  return entry as Entry;
}

export default function search(): AstroIntegration {
  return {
    name: 'tpi-pagefind',
    hooks: {
      'astro:build:done': async ({ pages, dir, logger }) => {
        const out = new URL('pagefind/', dir);
        const { index, errors } = await pagefind.createIndex();
        if (!index) throw new Error(`Pagefind: ${errors.join('; ')}`);
        try {
          for (const { pathname } of pages) {
            const url = normalizePath(`/${pathname}`);
            const file = new URL(url === '/' ? 'index.html' : `${url.slice(1)}.html`, dir);
            const content = indexedHtml(await readFile(file, 'utf8'), localeFromPath(url));
            const added = await index.addHTMLFile({ url, content });
            if (added.errors.length > 0) throw new Error(`Pagefind ${url}: ${added.errors.join('; ')}`);
          }
          const written = await index.writeFiles({ outputPath: fileURLToPath(out) });
          if (written.errors.length > 0) throw new Error(`Pagefind: ${written.errors.join('; ')}`);
        } finally {
          await pagefind.close();
        }
        await Promise.all(UNUSED.map((f) => rm(new URL(f, out))));
        const entryFile = new URL('pagefind-entry.json', out);
        const entry = parseEntry(await readFile(entryFile, 'utf8'));
        const renamed = new Map(Object.values(SEGMENTED).map((s) => [s.indexAs, s.index]));
        entry.languages = Object.fromEntries(
          Object.entries(entry.languages)
            .map(([lang, value]) => [renamed.get(lang) ?? lang, value] as const)
            .sort(([a], [b]) => a.localeCompare(b)),
        );
        await writeFile(entryFile, JSON.stringify(entry));
        const counts = Object.entries(entry.languages).map(([lang, { page_count }]) => `${lang} ${page_count}`);
        logger.info(`pagefind/: ${counts.join(', ')} pages`);
      },
    },
  };
}
