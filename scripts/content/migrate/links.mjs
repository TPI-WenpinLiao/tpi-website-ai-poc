// Links in migrated bodies: current-site URLs → new-site paths via docs/ia/redirects.csv
// (content-migration skill「放到哪裡」). Unmapped current-site links and known broken links are reported.

const SITE_HOSTS = { 'tpisoftware.com': 'www.tpisoftware.com', 'www.tpisoftware.com': 'www.tpisoftware.com', 'tpisoftware.vn': 'www.tpisoftware.vn', 'www.tpisoftware.vn': 'www.tpisoftware.vn' };
// Locale homes are not rows of redirects.csv (the inventory lists them under their final URL)
const HOMES = { 'https://www.tpisoftware.com/': '/', 'https://www.tpisoftware.com/en': '/en', 'https://www.tpisoftware.vn/': '/vi' };

/** Comparable form of a current-site URL: https, www host, no query, hash or trailing slash. */
export function siteKey(url) {
  const host = SITE_HOSTS[url.hostname.toLowerCase()];
  if (!host) return null;
  const path = url.pathname.length > 1 ? url.pathname.replace(/\/+$/, '') : '/';
  return `https://${host}${path}`;
}

/**
 * @param {{ from: string, to: string }[]} redirects rows of redirects.csv
 * @param {{ url: string }[]} broken rows of broken-links.csv
 * @param {{ url: string, final_url: string }[]} inventory rows of inventory.csv
 * @returns {(href: string, base: string) => { href: string, note?: string }}
 */
export function linkResolver(redirects, broken, inventory = []) {
  const to = new Map(Object.entries(HOMES));
  for (const r of redirects) {
    const key = siteKey(new URL(r.from));
    if (key) to.set(key, r.to);
  }
  // redirects.csv is keyed by the URL the inventory found (…com/vn/about-us); posts link to where it
  // lands (…vn/about-us), so the final URL maps to the same target unless it has a row of its own
  for (const r of inventory) {
    if (!r.final_url || r.final_url === r.url) continue;
    const from = siteKey(new URL(r.url));
    const final = siteKey(new URL(r.final_url));
    if (from && final && to.has(from) && !to.has(final)) to.set(final, to.get(from));
  }
  const brokenKeys = new Set(broken.map((b) => siteKey(new URL(b.url)) ?? new URL(b.url).href));
  return (href, base) => {
    let url;
    try {
      url = new URL(href, base);
    } catch {
      return { href, note: `link is not a URL: ${href}` };
    }
    if (!/^https?:$/.test(url.protocol)) return { href };
    const key = siteKey(url);
    if (brokenKeys.has(key ?? url.href)) return { href: url.href, note: `broken link (broken-links.csv): ${url.href}` };
    if (!key) return { href: url.href };
    const mapped = to.get(key);
    if (!mapped) return { href: url.href, note: `current-site link not in redirects.csv: ${url.href}` };
    return { href: `${mapped}${url.hash}` };
  };
}
