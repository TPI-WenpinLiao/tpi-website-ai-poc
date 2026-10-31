// Placeholder images the current site's CMS holds in place of a real cover (#101): 14 vi blog posts
// have a loading spinner as their cover. Each placeholder is known by two hashes: the decoded pixels
// of the source image (the source files differ byte for byte, their pixels don't), which
// migrate/migrate.mjs checks while converting, and the WebP file it was once stored as, which this
// script finds under src/assets/.
// An entry whose cover is a placeholder gets one of the abstract design covers instead, chosen by its
// slug; the source URL stays as the coverImage comment until the content owner supplies the real one
// (docs/content/migration.md「圖片」).
// Run: node scripts/content/placeholder-covers.mjs [--fix] (part of npm run check, without --fix)

import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { readdir, readFile, rm, rmdir, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { pathToFileURL } from 'node:url';
import sharp from 'sharp';

export const PLACEHOLDERS = [
  {
    name: 'loading spinner',
    example: 'https://tpi.dev/tpi-dev/private/article/IMG/1f1bcb0a-798d-63f6-81f6-0b7fa23ee3a6.png',
    pixels: 'a016b5dd3465ca9d7d3d75f28ba533b415b2c58018e92975a170a7fde940d280',
    stored: 'd1ee3a77d9b12049c7c6d5556c985bb34a24f6b3c9292c2a9bfee0d21e901de7',
  },
];

const PIXELS = new Set(PLACEHOLDERS.map((p) => p.pixels));
const STORED = new Set(PLACEHOLDERS.map((p) => p.stored));
const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');

/** Whether a source image's decoded pixels are a known placeholder. @param {Buffer} bytes */
export async function isPlaceholderSource(bytes, hashes = PIXELS) {
  const { data } = await sharp(bytes).raw().toBuffer({ resolveWithObject: true });
  return hashes.has(sha256(data));
}

const FALLBACKS = ['cover-data.webp', 'cover-integration.webp', 'cover-platform.webp', 'cover-security.webp'];

/** The abstract design cover (src/assets/design/) an entry gets in place of a placeholder; the same slug always gets the same one */
export const fallbackCover = (slug) => FALLBACKS[createHash('sha256').update(slug).digest()[0] % FALLBACKS.length];

/** coverImage value of a content file at src/content/<type>/<locale>/<slug>.md */
export const fallbackRef = (slug) => `../../../assets/design/${fallbackCover(slug)}`;

// Content images that are migrated from the current site
const ASSET_ROOTS = ['blog', 'news', 'case-study', 'whitepaper'].map((t) => `src/assets/${t}`);

async function* files(dir) {
  if (!existsSync(dir)) return;
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, e.name);
    if (e.isDirectory()) yield* files(path);
    else yield path;
  }
}

/** Stored images under the content asset roots that are a known placeholder. */
export async function findPlaceholders(roots = ASSET_ROOTS, hashes = STORED) {
  const found = [];
  for (const root of roots) for await (const path of files(root)) if (hashes.has(sha256(await readFile(path)))) found.push(path);
  return found;
}

/**
 * Point the coverImage of the blog or news entry that uses a placeholder at its fallback cover and
 * delete the placeholder, as a re-run of migrate.mjs would. Throws for any other use of the file.
 * @param {string} asset src/assets/<type>/<locale>/<slug>/<file>
 */
export async function fixPlaceholder(asset) {
  const m = /^src\/assets\/(blog|news)\/([^/]+)\/([^/]+)\/([^/]+)$/.exec(asset);
  if (!m) throw new Error(`${asset}: only blog and news covers can be fixed; replace it by hand`);
  const [, type, locale, slug, file] = m;
  const content = `src/content/${type}/${locale}/${slug}.md`;
  const text = await readFile(content, 'utf8');
  const ref = `../../../assets/${type}/${locale}/${slug}/${file}`;
  const cover = `coverImage: ${ref}\n`;
  if (!text.includes(cover)) throw new Error(`${asset}: ${content} does not use it as coverImage`);
  const fixed = text.replace(cover, `coverImage: ${fallbackRef(slug)}\n`);
  if (fixed.includes(ref)) throw new Error(`${asset}: ${content} also uses it in the body`);
  await writeFile(content, fixed);
  await rm(asset);
  const dir = join('src/assets', type, locale, slug);
  if (!(await readdir(dir)).length) await rmdir(dir);
  return content;
}

async function main() {
  const fix = process.argv.includes('--fix');
  const found = await findPlaceholders();
  if (!found.length) {
    console.log(`placeholder covers: none under ${ASSET_ROOTS.join(', ')}`);
    return;
  }
  if (fix) {
    for (const asset of found) console.log(`${relative('.', await fixPlaceholder(asset))}: coverImage → design cover (${asset} removed)`);
    return;
  }
  console.error(`${found.length} placeholder images (scripts/content/placeholder-covers.mjs PLACEHOLDERS):`);
  for (const path of found) console.error(`  ${path}`);
  console.error('Run node scripts/content/placeholder-covers.mjs --fix');
  process.exitCode = 1;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) await main();
