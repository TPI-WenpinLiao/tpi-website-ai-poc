// Reads blog posts and news from the current site's APIs, the same endpoints scripts/inventory/crawl.mjs
// uses (docs/research/inventory.md). `get` is a cachedFetcher (./cache.mjs).
import { payloadArticleBody } from '../../lib/nuxt-payload.mjs';

export const COM = 'https://www.tpisoftware.com';
export const VN = 'https://www.tpisoftware.vn';

// Blog API X-Lang and article origin per locale (same as crawl.mjs BLOG_SOURCES and tags.mjs API_LANG)
export const BLOG_SOURCES = {
  'zh-TW': { lang: 'ZH-TW', origin: COM },
  en: { lang: 'EN-US', origin: COM },
  vi: { lang: 'VI-VN', origin: VN },
};
// News API `languages` and article URL base per locale (same as crawl.mjs NEWS_SOURCES)
export const NEWS_SOURCES = {
  'zh-TW': { lang: 'tw', base: `${COM}/media-center/` },
  en: { lang: 'en', base: `${COM}/en/media-center/` },
  vi: { lang: 'vn', base: `${VN}/media-center/` },
};

async function json(get, url, init) {
  const res = await get(url, init);
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  return JSON.parse(res.body.toString('utf8'));
}

const cmsPost = (get, path, lang, body) =>
  json(get, `${COM}/cms/api/v1/f/article/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Lang': lang },
    body: JSON.stringify(body),
  });

/**
 * Every article the blog API lists for a locale, keyed by its current-site URL
 * (category custUrl + articleCustUrl, as crawl.mjs builds it).
 * @returns {Promise<Map<string, object>>}
 */
export async function blogArticles(get, locale) {
  const { lang, origin } = BLOG_SOURCES[locale];
  const cats = await cmsPost(get, 'category', lang, {});
  const catUrl = new Map();
  for (const c of cats.data.content) {
    catUrl.set(c.categoryNo, c.custUrl);
    for (const s of c.subcategories ?? []) catUrl.set(s.categoryNo, s.custUrl);
  }
  const articles = [];
  let total = 0;
  for (let page = 1; page < 100; page++) {
    const res = await cmsPost(get, 'home', lang, { page, limit: 50 });
    total = res.data.totalCount;
    articles.push(...res.data.content.articles);
    if (articles.length >= total || !res.data.content.articles.length) break;
  }
  const byUrl = new Map();
  for (const a of articles) {
    const cat = catUrl.get(a.multiCate?.[0]?.mainCate);
    if (cat) byUrl.set(new URL(`${cat}/${a.articleCustUrl}`, origin).href, a);
  }
  return byUrl;
}

/** Article body HTML from the post page's Nuxt payload; null when the page has none. */
export async function blogBody(get, url) {
  const res = await get(url);
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  return payloadArticleBody(res.body.toString('utf8'));
}

/**
 * Published news for a locale, keyed by its current-site URL.
 * @returns {Promise<Map<string, object>>}
 */
export async function newsItems(get, locale) {
  const { lang, base } = NEWS_SOURCES[locale];
  const res = await json(get, `${COM}/tpi/api/News?languages=${lang}`);
  return new Map(res.data.filter((n) => String(n.status) === '1').map((n) => [`${base}${n.id}`, n]));
}

/** News body HTML, a separate file the page fetches client-side from /file{htmlpath}. */
export async function newsBody(get, htmlpath) {
  const url = `${COM}/file${htmlpath}`;
  const res = await get(url);
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  return res.body.toString('utf8');
}

/** Absolute URL of a news API image path (/images/news/…), served under /file. */
export const newsImageUrl = (imagePath) => `${COM}/file${imagePath}`;
