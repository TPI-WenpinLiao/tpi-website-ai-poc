// Imports a generated image (docs/design/image-prompts.md) into src/assets/design/<name>.webp.
// Sources arrive as multi-MB PNGs; they are stored as WebP quality 95 (visually lossless, about a
// tenth of the size) because astro:assets re-encodes them to AVIF/WebP at build time anyway and the
// repository keeps every version forever.
// sharp comes with Astro (its image service), so it is not a separate dependency.
// Rerunning with the same input writes the same file.
// Run: node scripts/design/import-image.mjs <source.png> <name> [<source.png> <name> ...]

import { mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import sharp from 'sharp';

const OUT = resolve(import.meta.dirname, '../../src/assets/design');
const NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** @param {string[]} args @returns {{ source: string, name: string }[]} */
export function parseArgs(args) {
  if (args.length === 0 || args.length % 2 !== 0) throw new Error('usage: import-image.mjs <source> <name> [<source> <name> ...]');
  const pairs = [];
  for (let i = 0; i < args.length; i += 2) {
    const [source, name] = [args[i], args[i + 1]];
    if (!NAME.test(name)) throw new Error(`name "${name}" must be lowercase words joined by "-", without extension`);
    pairs.push({ source, name });
  }
  return pairs;
}

async function main(args) {
  mkdirSync(OUT, { recursive: true });
  for (const { source, name } of parseArgs(args)) {
    const out = join(OUT, `${name}.webp`);
    const info = await sharp(source).webp({ quality: 95, smartSubsample: true }).toFile(out);
    console.log(`${source} -> ${out} (${info.width}×${info.height}, ${(info.size / 1024).toFixed(0)} KB)`);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(process.argv.slice(2)).catch((err) => {
    console.error(err instanceof Error ? err.message : err);
    process.exitCode = 1;
  });
}
