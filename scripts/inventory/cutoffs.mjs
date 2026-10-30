// Keep news and blog posts on or after these dates; older ones are not migrated (M1-02 set 2024 for news,
// M5-05 moved both to 2026, #30). audit.mjs drops older rows; scripts/content/migrate/ notes the ones
// audit.mjs cannot date (news kept on updateDate, blog posts the blog API does not list, #137).
export const NEWS_CUTOFF = '2026-01-01';
export const BLOG_CUTOFF = '2026-01-01';
