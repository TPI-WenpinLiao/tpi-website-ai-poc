// Visible text of a current-site page, for checking that copy taken from it is still there
// (scripts/design/home-content.mjs, scripts/design/offering-content.mjs).

// Whitespace and U+200B don't count: the new site adds U+200B break points, and the current site
// splits some headings over two elements
export const squash = (s) => s.replace(/[\s​]+/g, '');

const ENTITIES = { nbsp: ' ', quot: '"', apos: "'", lt: '<', gt: '>' };

// Drop scripts, styles and tags, decode the entities the site uses (&amp; last, so &amp;quot; stays &quot;)
export function pageText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&(nbsp|quot|apos|lt|gt);/g, (_, name) => ENTITIES[name])
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&amp;/g, '&');
}
