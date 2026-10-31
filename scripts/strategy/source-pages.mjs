// Current-site pages as the fact scripts read them (#164): fetched through the inventory HTTP client,
// cached in .cache/facts so a re-run reads the same input, and turned into text blocks.
// Used by scripts/strategy/extract-facts.mjs and scripts/strategy/facts.mjs --sources.
import { pageText, squash } from '../lib/page-text.mjs';

export const CACHE_DIR = '.cache/facts';

// Some pages render their data client-side: the success-story cards are only in a Nuxt JS chunk
// (scripts/content/migrate/case-studies.mjs). A quote missing from the HTML is looked for in the
// same-origin chunks the page loads, decoded from their JS string literals.
const CHUNK = /<script[^>]+src="(\/_nuxt\/[^"]+\.js)"/g;

/** JS string literals of a minified chunk, decoded (\uXXXX, \xXX, \n and the like) */
export function chunkStrings(js) {
  return [...js.matchAll(/"((?:[^"\\\n]|\\.)*)"|'((?:[^'\\\n]|\\.)*)'/g)].map((m) =>
    (m[1] ?? m[2])
      .replace(/\\u\{([0-9a-fA-F]+)\}|\\u([0-9a-fA-F]{4})|\\x([0-9a-fA-F]{2})/g, (_, a, b, c) => String.fromCodePoint(parseInt(a ?? b ?? c, 16)))
      .replace(/\\n/g, '\n')
      .replace(/\\(.)/g, '$1'),
  );
}

/**
 * Whether a quote is on a page's HTML, ignoring tags, whitespace and U+200B
 * @param {string} html
 * @param {string} quote
 */
export const quoteOnPage = (html, quote) => squash(pageText(html)).includes(squash(quote));

/**
 * Text blocks of a page: the text between tags, one block per text node, trimmed; scripts and styles dropped
 * @param {string} html
 */
export const textBlocks = (html) =>
  pageText(html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '').replace(/<(?!\/?(?:br|wbr)\b)[^>]+>/g, '\u0000'))
    .split('\u0000')
    .map((s) => s.replace(/\s+/g, ' ').trim())
    .filter(Boolean);

/**
 * A reader of current-site pages
 * @param {{ offline?: boolean, refresh?: boolean }} [options] offline: only the cache, a page not in it
 *   fails; refresh: always fetch (the cache is still written)
 */
export async function pageReader({ offline = false, refresh = false } = {}) {
  const { cachedFetcher } = await import('../content/migrate/cache.mjs');
  const request = offline
    ? async (url) => {
        throw new Error(`${url} is not in ${CACHE_DIR}; run without --offline once`);
      }
    : (await import('../inventory/http.mjs')).request;
  const get = cachedFetcher(request, { dir: CACHE_DIR, refresh });
  const pages = new Map();
  const chunks = new Map();

  async function html(url) {
    if (!pages.has(url)) {
      const res = await get(url);
      if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
      pages.set(url, res.body.toString('utf8'));
    }
    return pages.get(url);
  }

  async function chunkText(url) {
    const page = await html(url);
    const texts = [];
    for (const m of new Set([...page.matchAll(CHUNK)].map((c) => new URL(c[1], url).href))) {
      if (!chunks.has(m)) {
        const res = await get(m);
        chunks.set(m, res.ok ? chunkStrings(res.body.toString('utf8')).join('\n') : '');
      }
      texts.push(chunks.get(m));
    }
    return texts.join('\n');
  }

  return {
    html,
    /** Whether a quote is on the page (HTML text first, then its chunks), ignoring whitespace and U+200B */
    async has(url, quote) {
      if (quoteOnPage(await html(url), quote)) return true;
      return squash(await chunkText(url)).includes(squash(quote));
    },
  };
}
