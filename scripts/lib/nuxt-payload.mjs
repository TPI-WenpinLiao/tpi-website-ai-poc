// Blog article bodies on the current site are not in the SSR DOM: they ship as an HTML string in the
// Nuxt payload (`content:"…"`) and are rendered client-side (docs/research/inventory.md「已知限制」).
// Used by scripts/inventory/crawl.mjs and scripts/content/migrate/.

import vm from 'node:vm';

/** Longest `content:"…"` string in the page's `window.__NUXT__` payload, decoded; null when absent. @param {string} html */
export function payloadArticleBody(html) {
  const start = html.indexOf('window.__NUXT__');
  if (start < 0) return null;
  const payload = html.slice(start);
  const strings = [...payload.matchAll(/content:"((?:[^"\\]|\\.)*)"/g)].map((m) => m[1]);
  if (!strings.length) return null;
  const raw = strings.reduce((a, b) => (b.length > a.length ? b : a));
  try {
    return JSON.parse(`"${raw.replace(/\\'/g, "'").replace(/\\x([0-9a-fA-F]{2})/g, '\\u00$1')}"`);
  } catch {
    return null;
  }
}

/**
 * The post page's `article` object (title, atcDate, authorName, coverImage, multiCate…, as the blog API
 * lists it) and its category tree as categoryNo → custUrl; null when the page has none. Used for posts
 * the blog API does not list (#137). The payload's values are arguments of an IIFE, so it is run in a vm
 * context instead of matched with a regex. vm is not a security boundary: the page is the current
 * site's own. No object or function of this realm enters the context (`window` is declared inside the
 * script) and only a JSON string comes out of it, so the payload cannot reach `process` through a
 * constructor or a replaced built-in; the timeout covers both the payload and the serialization.
 * Throws when the payload does not run.
 * @param {string} html
 * @returns {{ article: Record<string, any>, categoryUrls: Map<string, string> } | null}
 */
export function payloadArticle(html) {
  const start = html.indexOf('window.__NUXT__');
  if (start < 0) return null;
  const end = html.indexOf('</script>', start);
  const context = vm.createContext();
  let json;
  try {
    vm.runInContext(`var window = {};\n${html.slice(start, end < 0 ? undefined : end)}`, context, { timeout: 1000 });
    json = vm.runInContext('JSON.stringify(window.__NUXT__ ?? null)', context, { timeout: 1000 });
  } catch (error) {
    throw new Error(`page payload does not run: ${error.message}`);
  }
  if (typeof json !== 'string') throw new Error('page payload does not run: it does not serialize to JSON');
  const nuxt = JSON.parse(json);
  const article = nuxt?.data?.find((d) => d?.article)?.article;
  if (!article) return null;
  const categoryUrls = new Map();
  const walk = (cats) => {
    for (const c of cats ?? []) {
      if (c.categoryNo && c.custUrl) categoryUrls.set(c.categoryNo, c.custUrl);
      walk(c.subcategories);
    }
  };
  walk(nuxt.state?.categories);
  return { article, categoryUrls };
}
