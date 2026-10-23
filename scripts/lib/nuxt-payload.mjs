// Blog article bodies on the current site are not in the SSR DOM: they ship as an HTML string in the
// Nuxt payload (`content:"…"`) and are rendered client-side (docs/research/inventory.md「已知限制」).
// Used by scripts/inventory/crawl.mjs and scripts/content/migrate/.

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
