// Serves a built site (dist/) on a random local port, resolving /path to path.html or
// path/index.html like Cloudflare Pages. Used by the puppeteer checks in scripts/ and by the
// Playwright visual regression tests (tests/visual/). `routes` stands in for Pages Functions:
// "POST /api/contact" → a fetch-style handler (scripts/forms/contact.mjs).
// Text files are gzipped when the client accepts it, like Cloudflare Pages and LHCI's server:
// Lighthouse simulates the network from the transferred bytes, so uncompressed HTML and CSS
// would add about 0.6 s to the mobile FCP (#127).

import { createReadStream, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { createGzip } from 'node:zlib';
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

/** Whether a response of this content type is gzipped; images and fonts already are compressed. @param {string} type */
export const compressible = (type) => /^text\/|^image\/svg\+xml$/.test(type);

/** @typedef {(request: Request) => Promise<Response>} Route */

/** @param {import('node:http').IncomingMessage} req @param {import('node:http').ServerResponse} res @param {Route} route */
async function answer(req, res, route) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  /** @type {Record<string, string>} */
  const headers = {};
  for (const [name, value] of Object.entries(req.headers)) if (typeof value === 'string') headers[name] = value;
  const request = new Request(new URL(req.url ?? '/', `http://${req.headers.host}`), { method: req.method, headers, body: Buffer.concat(chunks) });
  const response = await route(request);
  res.writeHead(response.status, Object.fromEntries(response.headers));
  res.end(Buffer.from(await response.arrayBuffer()));
}

/**
 * @param {string} root absolute path
 * @param {number} [port] 0 picks a free port
 * @param {Record<string, Route>} [routes] keyed by "METHOD /path"
 * @returns {Promise<import('node:http').Server>}
 */
export function serve(root, port = 0, routes = {}) {
  const kind = fileKind(root);
  const server = createServer((req, res) => {
    const route = routes[`${req.method} ${new URL(req.url ?? '/', 'http://x').pathname}`];
    if (route) {
      answer(req, res, route).catch(() => res.writeHead(500).end());
      return;
    }
    const file = servedFile(decodeURIComponent(new URL(req.url ?? '/', 'http://x').pathname), kind);
    if (!file) {
      res.writeHead(404).end();
      return;
    }
    const type = TYPES[extname(file)] ?? 'application/octet-stream';
    const stream = createReadStream(join(root, file));
    if (compressible(type) && /\bgzip\b/.test(String(req.headers['accept-encoding'] ?? ''))) {
      res.writeHead(200, { 'content-type': type, 'content-encoding': 'gzip', vary: 'accept-encoding' });
      stream.pipe(createGzip()).pipe(res);
      return;
    }
    res.writeHead(200, { 'content-type': type });
    stream.pipe(res);
  });
  return new Promise((resolve) => server.listen(port, '127.0.0.1', () => resolve(server)));
}

// Playwright's webServer (playwright.config.ts): node scripts/lib/static-server.mjs <port>
if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const server = await serve(resolve(import.meta.dirname, '../../dist'), Number(process.argv[2]));
  const { port } = /** @type {import('node:net').AddressInfo} */ (server.address());
  console.log(`Serving dist/ on http://127.0.0.1:${port}`);
}
