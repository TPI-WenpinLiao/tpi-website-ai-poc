// Gives every built page its own serif heading font (#167, src/lib/fonts/serif.ts): after the build,
// each HTML file's serif characters are cut from the source subset
// src/assets/fonts/noto-serif-tc-700.woff2 with subset-font (harfbuzz in WebAssembly, no Python), and
// the page's <head> gets an inline @font-face for that file. Pages with the same characters share a
// file, named by a hash of the characters, so the same pages give the same dist/
// (scripts/ci/lighthouse-scope.mjs --verify). A page with no serif text loads no font.
// A character the source subset lacks shows in the fallback serif; scripts/design/font-subsets.mjs
// fails the check before that can ship.
import { createHash } from 'node:crypto';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';
import subsetFont from 'subset-font';
import { fontFace, serialize, serifChars } from '../lib/fonts/serif.ts';

const SOURCE = new URL('../assets/fonts/noto-serif-tc-700.woff2', import.meta.url);
const OUT_DIR = '_astro/';

export default function serifFonts(): AstroIntegration {
  return {
    name: 'tpi-serif-fonts',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const source = await readFile(SOURCE);
        const root = fileURLToPath(dir);
        const files = (await readdir(root, { recursive: true })).filter((f) => f.endsWith('.html') && !f.startsWith('pagefind'));
        await mkdir(new URL(OUT_DIR, dir), { recursive: true });
        // characters → published URL, so pages with the same headings share one file
        const fonts = new Map<string, string>();
        let bytes = 0;
        for (const file of files.sort()) {
          const path = new URL(file, dir);
          const html = await readFile(path, 'utf8');
          const chars = serialize(serifChars(html));
          if (!chars) continue;
          let url = fonts.get(chars);
          if (!url) {
            const name = `serif-${createHash('sha256').update(chars).digest('hex').slice(0, 12)}.woff2`;
            const font = await subsetFont(source, chars, { targetFormat: 'woff2' });
            await writeFile(new URL(`${OUT_DIR}${name}`, dir), font);
            bytes += font.length;
            url = `/${OUT_DIR}${name}`;
            fonts.set(chars, url);
          }
          if (!html.includes('</head>')) throw new Error(`serif fonts: ${file} has no </head>`);
          await writeFile(path, html.replace('</head>', `<style>${fontFace(url)}</style></head>`));
        }
        logger.info(`${fonts.size} serif fonts for ${files.length} pages, ${(bytes / 1024).toFixed(0)} KB in all`);
      },
    },
  };
}
