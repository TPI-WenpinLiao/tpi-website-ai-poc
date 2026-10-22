// Site-wide copy from the current site (M3-04, #17), with the page each line was taken from.
// `node scripts/design/home-content.mjs` checks it with the home page copy (src/data/home.ts),
// which also explains `source.quote`.

export interface Sourced {
  text: string;
  source: { url: string; quote?: string };
}

export const HOME = 'https://www.tpisoftware.com/';

export const quoted = (text: string, url: string, quote?: string): Sourced => ({
  text,
  source: quote ? { url, quote } : { url },
});

// Company contact details and copyright, as in the current site's footer
export const company = {
  phone: quoted('+886 2 2658 0508', HOME),
  email: quoted('service@tpisoftware.com', HOME),
  copyright: quoted('©2026 TPIsoftware All rights reserved', HOME),
};
