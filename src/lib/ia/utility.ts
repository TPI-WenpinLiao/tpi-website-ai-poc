// The utility pages (templates.csv「utility」) UtilityTemplate knows how to draw. The route builds
// one page per utility node in nodes.csv and fails the build on a node not listed here, so a new
// utility node can't silently go unbuilt (#23 review round 2: /unsubscribe, /cancelrecord).
// not-found is src/pages/404.astro; download is built per offering from offering.downloads.
export const UTILITY_PAGES = ['search', 'subscribe', 'subscribe-result', 'unsubscribe', 'cancelrecord', 'thanks'] as const;

export type UtilityPage = (typeof UTILITY_PAGES)[number];

export const isUtilityPage = (id: string): id is UtilityPage => (UTILITY_PAGES as readonly string[]).includes(id);

// Utility nodes built elsewhere
export const UTILITY_ELSEWHERE = ['not-found', 'download'] as const;
