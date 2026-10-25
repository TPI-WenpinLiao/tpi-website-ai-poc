// Tests for scripts/seo/links.mjs. Run: npm run test:scripts

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { builtPending, linkProblems } from './links.mjs';

const ORIGIN = 'https://example.pages.dev';
const head = (path) => `<head><link rel="canonical" href="${ORIGIN}${path}"></head>`;
const FILES = new Set(['index.html', 'about.html', 'blog/index.html', 'blog/post.html', '_astro/a.webp', '_astro/b.webp', 'pdf/x.pdf']);
const DIRS = new Set(['', 'blog', '_astro', 'pdf']);
const kind = (f) => (FILES.has(f) ? 'file' : DIRS.has(f) ? 'dir' : undefined);

/** @param {Record<string, string>} bodies dist file → body HTML */
function site(bodies, planned) {
  const pages = new Map(
    Object.entries({ 'index.html': '', 'about.html': '<h2 id="team">Team</h2><a name="old"></a>', 'blog/index.html': '', 'blog/post.html': '', ...bodies }).map(([file, body]) => [
      file,
      `<html>${head(file === 'index.html' ? '/' : `/${file.replace(/(\/index)?\.html$/, '')}`)}<body>${body}</body></html>`,
    ]),
  );
  const { broken, planned: plannedHits } = linkProblems({ pages, kind, planned });
  const plain = (map) => Object.fromEntries([...map].map(([k, v]) => [k, [...v]]));
  return { broken: plain(broken), planned: plain(plannedHits) };
}

test('accepts pages, directory indexes, files and absolute URLs on the canonical origin', () => {
  const body = `<a href="/about">a</a><a href="/blog">b</a><a href="/blog/post?x=1">c</a><a href="${ORIGIN}/about">d</a>
    <img src="/_astro/a.webp" srcset="/_astro/a.webp 1x, /_astro/b.webp 2x"><a href="/pdf/x.pdf">pdf</a>`;
  assert.deepEqual(site({ 'index.html': body }).broken, {});
});

test('reports targets that are not in dist, with the pages that reference them', () => {
  const { broken } = site({ 'index.html': '<a href="/missing">a</a><img src="/_astro/c.webp">', 'about.html': '<a href="/missing">a</a>' });
  assert.deepEqual(broken, { '/missing': ['/', '/about'], '/_astro/c.webp': ['/'] });
});

test('checks srcset candidates, og:image and relative links against the page URL', () => {
  const { broken } = site({
    'blog/post.html': '<meta property="og:image" content="/og/none.png"><img srcset="/_astro/a.webp 1x, /_astro/z.webp 2x"><a href="other">r</a><a href="../about">ok</a>',
  });
  assert.deepEqual(broken, { '/og/none.png': ['/blog/post'], '/_astro/z.webp': ['/blog/post'], '/blog/other': ['/blog/post'] });
});

test('reports a fragment without a matching id or a[name] on the target page, including the page itself', () => {
  const { broken } = site({ 'index.html': '<a href="/about#team">a</a><a href="/about#old">b</a><a href="/about#nope">c</a><a href="#here">d</a><span id="top"></span><a href="#top">e</a>' });
  assert.deepEqual(broken, { '/about#nope': ['/'], '/#here': ['/'] });
});

test('ignores other origins, mailto and tel, and trailing slashes are not pages (ADR 0002)', () => {
  const { broken } = site({ 'index.html': '<a href="https://www.tpisoftware.com/x">a</a><a href="mailto:a@b.c">m</a><a href="tel:+886">t</a><a href="//cdn.example/x">c</a><a href="/about/">s</a>' });
  assert.deepEqual(broken, { '/about/': ['/'] });
});

test('lists links to planned nodes separately instead of failing', () => {
  const { broken, planned } = site({ 'index.html': '<a href="/services">s</a><a href="/en/services">e</a>' }, new Set(['/services']));
  assert.deepEqual(planned, { '/services': ['/'] });
  assert.deepEqual(broken, { '/en/services': ['/'] });
});

test('reports malformed percent-encoding as broken instead of throwing', () => {
  const { broken } = site({ 'index.html': '<a href="/a%zz">a</a><a href="/about#%E0">b</a>' });
  assert.deepEqual(broken, { '/a%zz (malformed percent-encoding)': ['/'], '/about#%E0 (malformed percent-encoding)': ['/'] });
});

test('builtPending names the pending paths that have a page now', () => {
  assert.deepEqual(builtPending(['/about', '/services', '/blog'], kind), ['/about', '/blog']);
});
