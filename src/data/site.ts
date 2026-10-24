// Site-wide copy from the current site (M3-04, #17), with the page each line was taken from.
// `node scripts/design/home-content.mjs` checks it with the home page copy (src/data/home/<locale>.ts),
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

// Email and copyright, as in the current site's footer. The phone number lives with the offices in
// src/content/organization (one place for company data)
export const company = {
  email: quoted('service@tpisoftware.com', HOME),
  copyright: quoted('©2026 TPIsoftware All rights reserved', HOME),
};
