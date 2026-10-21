// Helpers shared by scripts/ia/sitemap.mjs and scripts/ia/navigation.mjs.

import { readFile, writeFile } from 'node:fs/promises';

// Distance from the root of the sitemap (home is 0)
export function depth(n, byId) {
  let d = 0;
  for (let cur = n; cur.parent; cur = byId.get(cur.parent)) d++;
  return d;
}

// Replace the text between two marker comments, markers included; `section` must start and end with them
export function replaceSection(doc, start, end, section) {
  const from = doc.indexOf(start);
  const to = doc.indexOf(end);
  if (from < 0 || to < from) throw new Error(`generated section markers not found: ${start}`);
  return doc.slice(0, from) + section + doc.slice(to + end.length);
}

// Write each [path, content] pair, or with `check` only compare them to the files on disk and report
// the ones that differ (missing files included), naming `rerun` as the fix. Check mode never writes.
// Returns the stale paths.
export async function emit(outputs, { check, rerun }) {
  if (!check) {
    for (const [path, content] of outputs) await writeFile(path, content);
    return [];
  }
  const stale = [];
  for (const [path, content] of outputs) {
    const current = await readFile(path, 'utf8').catch((e) => (e.code === 'ENOENT' ? null : Promise.reject(e)));
    if (current !== content) stale.push(path);
  }
  for (const path of stale) console.error(`${path} is out of date; run: ${rerun}`);
  return stale;
}
