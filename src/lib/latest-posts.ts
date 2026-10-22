// Latest blog posts and news for the home page (M3-04, #17), read from the current-site inventory
// at build time. Stand-in until M5 migrates the posts into content collections; then the home page
// reads the collections instead and this file goes.
// Only pages kept by the content audit (`keep`/`rewrite`), linked at their new path from
// docs/ia/redirects.csv.
import inventoryCsv from '../../docs/research/inventory.csv?raw';
import pageMapCsv from '../../docs/ia/page-map.csv?raw';
import redirectsCsv from '../../docs/ia/redirects.csv?raw';
import { readRows } from './ia/nodes';
import { node } from './ia/navigation';

export interface Post {
  kind: 'blog' | 'news';
  title: string;
  /** Category for blog posts (blog-category node title), 新聞 for news */
  label: string;
  /** YYYY-MM-DD, the current site's last update */
  date: string;
  href: string;
  sourceUrl: string;
}

const KINDS = { 'blog-post': 'blog', news: 'news' } as const;
const isKind = (t: string): t is keyof typeof KINDS => t in KINDS;

const inventory = readRows(inventoryCsv, 'inventory.csv', ['url', 'locale', 'page_type', 'h1', 'last_updated', 'disposition']);
const categoryOf = new Map(
  readRows(pageMapCsv, 'page-map.csv', ['url', 'blog_category']).map((r) => [r.url, r.blog_category]),
);
const targetOf = new Map(readRows(redirectsCsv, 'redirects.csv', ['from', 'to']).map((r) => [r.from, r.to]));

function toPost(row: (typeof inventory)[number]): Post | undefined {
  const type = row.page_type;
  const href = targetOf.get(row.url);
  if (!isKind(type) || !href || !row.last_updated || !row.h1) return undefined;
  const kind = KINDS[type];
  const category = categoryOf.get(row.url);
  return {
    kind,
    title: row.h1,
    label: kind === 'news' ? node('news-article').title : category ? node(category).title : node('blog').title,
    date: row.last_updated,
    href,
    sourceUrl: row.url,
  };
}

const posts = inventory
  .filter((r) => r.locale === 'zh-TW' && ['keep', 'rewrite'].includes(r.disposition))
  .map(toPost)
  .filter((p): p is Post => p !== undefined)
  .toSorted((a, b) => b.date.localeCompare(a.date) || a.href.localeCompare(b.href));

/** The newest `count` posts of `kind`, newest first; ties keep a stable order by path */
export const latest = (kind: Post['kind'], count: number) => posts.filter((p) => p.kind === kind).slice(0, count);
