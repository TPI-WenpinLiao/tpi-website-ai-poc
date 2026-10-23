// Downloads the files that offering entries list in `downloads` (M5-01, #26) from the current site,
// as listed in scripts/content/offering-files.yaml, and stores them unchanged in public/files/<name>.
// Responses are cached in .cache/migrate, so a re-run writes the same files.
// Needs network access to www.tpisoftware.com on the first run.
//
//   node scripts/content/offering-files.mjs [--refresh]
import { mkdir, readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parse } from 'yaml';
import { cachedFetcher, writeAtomic } from './migrate/cache.mjs';

const ROOT = resolve(import.meta.dirname, '../..');
const MANIFEST = join(import.meta.dirname, 'offering-files.yaml');
const NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*\.[a-z0-9]+$/;

/**
 * Validate the manifest and work out where each file goes.
 * @param {{ files?: { name?: string, url?: string }[] }} manifest
 * @returns {{ url: string, path: string }[]}
 */
export function targets(manifest) {
  const out = (manifest.files ?? []).map((e, i) => {
    if (!NAME.test(e.name ?? '')) throw new Error(`files[${i}]: name "${e.name}" must be lowercase kebab-case with an extension`);
    return { url: new URL(e.url ?? '').href, path: `public/files/${e.name}` };
  });
  const seen = new Set();
  for (const t of out) {
    if (seen.has(t.path)) throw new Error(`more than one entry writes ${t.path}`);
    seen.add(t.path);
  }
  return out;
}

async function main(args) {
  const { request } = await import('../inventory/http.mjs');
  const get = cachedFetcher(request, { refresh: args.includes('--refresh') });
  let failed = 0;
  for (const t of targets(parse(await readFile(MANIFEST, 'utf8')))) {
    const res = await get(t.url);
    if (!res.ok) {
      console.error(`FAIL ${t.url}: HTTP ${res.status}`);
      failed += 1;
      continue;
    }
    await mkdir(dirname(join(ROOT, t.path)), { recursive: true });
    await writeAtomic(join(ROOT, t.path), res.body);
    console.log(`${t.path} (${(res.body.length / 1024).toFixed(0)} KB) <- ${t.url}`);
  }
  process.exitCode = failed ? 1 : 0;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(process.argv.slice(2)).catch((err) => {
    console.error(err instanceof Error ? err.message : err);
    process.exitCode = 1;
  });
}
