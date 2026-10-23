// Disk cache for current-site responses, so a re-run reads the same input without hitting the site.
// Only 2xx responses are cached; failures are retried on the next run. --refresh bypasses reads.
import { createHash } from 'node:crypto';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

export const CACHE_DIR = '.cache/migrate';

/**
 * @param {(url: string, init?: RequestInit) => Promise<Response>} request
 * @param {{ dir?: string, refresh?: boolean }} [options]
 */
export function cachedFetcher(request, { dir = CACHE_DIR, refresh = false } = {}) {
  /** @returns {Promise<{ ok: boolean, status: number, contentType: string, body: Buffer }>} */
  return async function get(url, init = {}) {
    const key = createHash('sha256')
      .update(JSON.stringify([init.method ?? 'GET', url, init.headers ?? {}, init.body ?? '']))
      .digest('hex');
    const meta = join(dir, `${key}.json`);
    const data = join(dir, `${key}.bin`);
    if (!refresh) {
      try {
        const { status, contentType } = JSON.parse(await readFile(meta, 'utf8'));
        return { ok: true, status, contentType, body: await readFile(data) };
      } catch {
        // not cached yet
      }
    }
    const res = await request(url, init);
    const body = Buffer.from(await res.arrayBuffer());
    const contentType = res.headers.get('content-type') ?? '';
    if (res.ok) {
      await mkdir(dir, { recursive: true });
      // Body first, then meta: a run killed in between leaves no meta, so the entry is just re-fetched
      await writeAtomic(data, body);
      await writeAtomic(meta, JSON.stringify({ url, status: res.status, contentType }));
    }
    return { ok: res.ok, status: res.status, contentType, body };
  };
}

/** Write through a temp file and rename, so an interrupted run never leaves a half-written file. */
export async function writeAtomic(path, content) {
  const tmp = `${path}.tmp-${process.pid}`;
  await writeFile(tmp, content);
  await rename(tmp, path);
}
