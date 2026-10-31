// Site-wide copy. The email and copyright are facts from the fact library (docs/strategy/facts.yaml,
// #163), as in the current site's footer; `node scripts/strategy/facts.mjs` checks this file with
// the home page copy.

import { fact } from './facts.ts';

// The phone number lives with the offices in src/content/organization (one place for company data)
export const company = {
  email: fact('company-email'),
  copyright: fact('company-copyright'),
};
