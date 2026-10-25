// Serves a built site (dist/) on a random local port, resolving /path to path.html or
// path/index.html like Cloudflare Pages. Used by the puppeteer checks in scripts/ and by the
// Playwright visual regression tests (tests/visual/).

import { createReadStream, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, posix, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.png': 'image/png',
};

/**
 * The file that serves a URL path, like Cloudflare Pages: path.html, else the file itself, else
 * path/index.html. Shared by the server and scripts/seo/links.mjs so both resolve links the same way.
 * @param {string} path decoded URL path
 * @param {(file: string) => 'file' | 'dir' | undefined} kind what a path relative to the root is
 * @returns {string | undefined} path relative to the root, without a leading slash
 */
export function servedFile(path, kind) {
  const rel = posix.normalize(`/${path}`).slice(1);
  const dir = rel === '' || rel.endsWith('/');
  if (!dir && kind(`${rel}.html`) === 'file') return `${rel}.html`;
  if (!dir && kind(rel) === 'file') return rel;
  const index = posix.join(rel, 'index.html');
  return kind(index) === 'file' ? index : undefined;
}

/** @param {string} root absolute path @returns {(file: string) => 'file' | 'dir' | undefined} */
export function fileKind(root) {
  return (file) => {
    const stat = statSync(join(root, file), { throwIfNoEntry: false });
    return stat?.isFile() ? 'file' : stat?.isDirectory() ? 'dir' : undefined;
  };
}

/** @param {string} root absolute path @param {number} [port] 0 picks a free port @returns {Promise<import('node:http').Server>} */
export function serve(root, port = 0) {
  const kind = fileKind(root);
  const server = createServer((req, res) => {
    const file = servedFile(decodeURIComponent(new URL(req.url ?? '/', 'http://x').pathname), kind);
    if (!file) {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
    createReadStream(join(root, file)).pipe(res);
  });
  return new Promise((resolve) => server.listen(port, '127.0.0.1', () => resolve(server)));
}

// Playwright's webServer (playwright.config.ts): node scripts/lib/static-server.mjs <port>
if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const server = await serve(resolve(import.meta.dirname, '../../dist'), Number(process.argv[2]));
  const { port } = /** @type {import('node:net').AddressInfo} */ (server.address());
  console.log(`Serving dist/ on http://127.0.0.1:${port}`);
}
