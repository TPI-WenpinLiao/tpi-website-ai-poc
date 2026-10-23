// Current-site article HTML → Markdown body. Blog bodies are Tiptap HTML from the Nuxt payload, news
// bodies are pasted WordPress HTML with inline styles on every tag (docs/content/migration.md).
// prepare() cleans the HTML and lists the images to download; toMarkdown() converts it once the caller
// has a local path for every image.
import { parse } from 'node-html-parser';
import TurndownService from 'turndown';

const KEEP_ATTRS = { a: ['href'], img: ['src', 'alt'], td: ['rowspan', 'colspan'], th: ['rowspan', 'colspan'] };
const EMBEDS = 'iframe, embed, object, video, audio';
const UNWRAP = 'span, font';

/** First URL of a srcset ("a.jpg, 768w" → "a.jpg"). A data: URL has commas of its own, so it ends at whitespace. */
const srcsetFirst = (srcset) => {
  const s = srcset?.trim() ?? '';
  return (s.startsWith('data:') ? s.split(/\s/)[0] : s.split(',')[0].trim().split(/\s+/)[0]).replace(/,$/, '');
};

// Newsletter open-tracking pixels (1×1 or hidden) are tracking code, not content (content-migration「不搬移的內容」)
const isTrackingPixel = (img) =>
  (Number(img.getAttribute('width')) <= 1 && Number(img.getAttribute('height')) <= 1) || /display:\s*none/i.test(img.getAttribute('style') ?? '');
// WordPress swaps emoji for SVGs from s.w.org; the alt is the emoji itself
const isEmoji = (img) => /(^|\s)(emoji|wp-smiley)(\s|$)/.test(img.getAttribute('class') ?? '') || /\/\/s\.w\.org\/images\/core\/emoji\//.test(img.getAttribute('src') ?? '');

/**
 * Clean the HTML: drop scripts and embeds, unwrap spans, keep only the attributes Markdown can carry,
 * fix heading levels (the page h1 is the title, so the body starts at h2 and never skips a level),
 * resolve image URLs against `base`.
 * @param {string} html
 * @param {string} base URL the HTML came from
 * @returns {{ html: string, images: string[], notes: string[] }}
 */
export function prepare(html, base) {
  const root = parse(html, { comment: false });
  const notes = [];
  for (const el of root.querySelectorAll('script, style, noscript')) el.remove();
  for (const el of root.querySelectorAll(EMBEDS)) {
    notes.push(`embed removed: <${el.rawTagName.toLowerCase()}> ${el.getAttribute('src') ?? el.querySelector('source')?.getAttribute('src') ?? ''}`.trim());
    el.remove();
  }
  for (const el of root.querySelectorAll(UNWRAP)) el.replaceWith(...el.childNodes);

  let prev = 1;
  const changed = [];
  for (const h of root.querySelectorAll('h1, h2, h3, h4, h5, h6')) {
    const from = Number(h.rawTagName[1]);
    const to = Math.min(Math.max(from, 2), prev + 1);
    if (to !== from) {
      changed.push(`h${from}→h${to}`);
      h.tagName = `h${to}`;
    }
    prev = to;
    // A heading that is bold all the way through is just the site's styling
    const bold = h.querySelectorAll('strong, b');
    if (bold.length && bold.map((b) => b.text).join('').trim() === h.text.trim()) for (const b of bold) b.replaceWith(...b.childNodes);
  }
  if (changed.length) notes.push(`headings changed: ${changed.join(' ')}`);

  const images = [];
  let pixels = 0;
  for (const img of root.querySelectorAll('img')) {
    if (isTrackingPixel(img)) {
      pixels += 1;
      img.remove();
      continue;
    }
    if (isEmoji(img)) {
      img.replaceWith(img.getAttribute('alt') ?? '');
      continue;
    }
    const src = img.getAttribute('src') || srcsetFirst(img.getAttribute('srcset'));
    if (!src) {
      notes.push('image without src removed');
      img.remove();
      continue;
    }
    const url = src.startsWith('data:') ? src : new URL(src, base).href;
    img.setAttribute('src', url);
    if (!images.includes(url)) images.push(url);
  }
  if (pixels) notes.push(`tracking pixels removed: ${pixels}`);
  for (const a of root.querySelectorAll('a')) {
    const href = a.getAttribute('href')?.trim();
    if (!href || /^javascript:/i.test(href)) a.replaceWith(...a.childNodes);
  }

  for (const el of root.querySelectorAll('*')) {
    const keep = KEEP_ATTRS[el.rawTagName.toLowerCase()] ?? [];
    for (const name of Object.keys(el.attributes)) if (!keep.includes(name.toLowerCase())) el.removeAttribute(name);
    for (const name of ['rowspan', 'colspan']) if (el.getAttribute(name) === '1') el.removeAttribute(name);
  }
  for (const p of root.querySelectorAll('p')) {
    if (!p.text.replace(/[\s ​]/g, '') && !p.querySelector('img')) p.remove();
  }
  return { html: root.toString(), images, notes };
}

const PUNCT = /[\p{P}\p{S}]/u;
const SPACE = /\s/u;

/** Text character next to an inline node, looking through inline parents; '' at a block edge. */
function adjacentChar(node, dir) {
  const sibling = dir < 0 ? 'previousSibling' : 'nextSibling';
  for (let n = node; n; n = n.parentNode) {
    let s = n[sibling];
    while (s && !s.textContent) s = s[sibling];
    if (s) return dir < 0 ? s.textContent.at(-1) : s.textContent[0];
    if (!n.parentNode || n.parentNode.isBlock) return '';
  }
  return '';
}

/**
 * `**` only works when CommonMark sees it as a delimiter run. In CJK text a run that starts or ends
 * with punctuation next to a letter (…風險。**後續) is not one and shows up literally, so those fall
 * back to the HTML tag, which Markdown renders as-is.
 */
function emphasis(tag, mark) {
  return {
    filter: tag === 'strong' ? ['strong', 'b'] : ['em', 'i'],
    replacement(content, node) {
      const inner = content.trim();
      if (!inner) return content;
      const lead = content.slice(0, content.indexOf(inner[0]));
      const trail = content.slice(content.lastIndexOf(inner.at(-1)) + 1);
      const before = adjacentChar(node, -1);
      const after = adjacentChar(node, 1);
      const opens = !PUNCT.test(inner[0]) || !before || SPACE.test(before) || PUNCT.test(before);
      const closes = !PUNCT.test(inner.at(-1)) || !after || SPACE.test(after) || PUNCT.test(after);
      return opens && closes ? `${lead}${mark}${inner}${mark}${trail}` : `${lead}<${tag}>${inner}</${tag}>${trail}`;
    },
  };
}

const escapeAlt = (s) => s.replace(/[\[\]\\]/g, '\\$&').replace(/\s+/g, ' ').trim();

/**
 * @param {string} html output of prepare()
 * @param {object} options
 * @param {(url: string) => { path: string, alt?: string }} options.image local path (and alt override) for a prepared image URL
 * @param {(href: string) => string} options.link new href for a link
 * @returns {{ markdown: string, notes: string[] }}
 */
export function toMarkdown(html, { image, link }) {
  const notes = [];
  const td = new TurndownService({ headingStyle: 'atx', bulletListMarker: '-', codeBlockStyle: 'fenced', emDelimiter: '*', strongDelimiter: '**', br: '\\' });
  td.addRule('strong', emphasis('strong', '**'));
  td.addRule('em', emphasis('em', '*'));
  td.addRule('image', {
    filter: 'img',
    replacement(_content, node) {
      const { path, alt } = image(node.getAttribute('src'));
      const text = alt ?? node.getAttribute('alt') ?? '';
      return `![${escapeAlt(text)}](${path})`;
    },
  });
  td.addRule('link', {
    filter: (node) => node.nodeName === 'A' && node.getAttribute('href'),
    replacement(content, node) {
      if (!content.trim()) return content;
      return `[${content}](${link(node.getAttribute('href').trim()).replace(/[()\s]/g, encodeURIComponent)})`;
    },
  });
  td.addRule('table', {
    filter: 'table',
    replacement(_content, node) {
      // Turndown's DOM (domino) collections are array-like but not iterable
      const all = (tag) => Array.from(node.getElementsByTagName(tag));
      const cells = all('tr').map((r) => Array.from(r.childNodes).filter((c) => c.nodeName === 'TD' || c.nodeName === 'TH'));
      const merged = cells.flat().some((c) => c.getAttribute('rowspan') || c.getAttribute('colspan'));
      const simple =
        !merged && !all('table').length && !all('ul').length && !all('ol').length && cells.length > 0 && cells.every((r) => r.length === cells[0].length && r.length > 0);
      if (!simple) {
        if (all('img').length) throw new Error('image inside a table that cannot be a Markdown table');
        notes.push('table kept as HTML (merged cells, lists or uneven rows)');
        for (const c of all('colgroup')) c.remove();
        // Links here skip the link rule below, so map them the same way before writing the HTML out
        for (const a of all('a')) a.setAttribute('href', link(a.getAttribute('href').trim()));
        return `\n\n${node.outerHTML}\n\n`;
      }
      const md = (cell) =>
        td
          .turndown(cell.innerHTML)
          .replace(/\n+/g, '<br>')
          .replace(/\|/g, '\\|')
          .trim();
      const line = (r) => `| ${r.map(md).join(' | ')} |`;
      const [head, ...body] = cells;
      return `\n\n${[line(head), `| ${head.map(() => '---').join(' | ')} |`, ...body.map(line)].join('\n')}\n\n`;
    },
  });
  const markdown = td
    .turndown(html)
    .split('\n')
    .map((l) => l.trimEnd())
    .filter((l) => !/^[\s ​]+$/.test(l))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  return { markdown, notes };
}
