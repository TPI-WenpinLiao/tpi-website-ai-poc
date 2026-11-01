// Home page copy in en (M7-02, #39), written like the zh-TW file (see its header): facts through
// fact('<id>'), the rest is wording, still the current en site's. `meta.title` is the current en
// home page's <title> with this site's separator; `meta.description` translates the zh-TW one, cut
// to 160 characters.
// #167 rebuilt the home page in five sections (src/data/home/types.ts) for zh-TW only: this file
// keeps its earlier copy where a section has a place for it, and the sections and headings it has no
// copy for are left out or named after their node, until the en copy is written (#167 follow-up).

import { fact } from '../facts.ts';
import type { Home } from './types.ts';

const hero = {
  // The en about page's hero, where the zh-TW title comes from too
  title: 'Reinventing with AI for a Greener Future',
  description: 'We strive to provide innovative technologies and software solutions.',
};

const orientAi = {
  node: 'orient-ai',
  title: 'Operationalizing AI for Value',
  // The current page's "Learn More" fails Lighthouse's link-text audit; worded like the zh-TW「探索 OrientAI」
  action: 'Explore OrientAI',
};

const industryLines: Record<string, string> = {
  'industry-finance':
    'Under the agreement of the banking customer, usage of information is provided to a Third-Party Service Provider through the OpenAPI.',
  'industry-government': 'Open API Applications for Smart Government',
};

const cases: { node: string; title: string; summary: string }[] = [
  { node: 'smartclaim', title: fact('smartclaim-title-en'), summary: fact('smartclaim-result-en') },
  { node: 'smartfilling', title: fact('smartfilling-title-en'), summary: fact('smartfilling-result-en') },
  { node: 'success-stories', title: fact('fraud-platform-title-en'), summary: fact('fraud-platform-result-en') },
];

// The current page goes on with "Fill out the form below and a team member will get back to you
// within 24h", which reads wrong away from the form; left out
const contactCta = {
  title: 'Get the Most Out of What We Have to Offer',
  description: 'Your inquiry and opinion matter to us.',
};

export const home: Home = {
  meta: {
    title: 'TPIsoftware | Leading Enterprise Software Solutions Provider',
    description:
      'TPIsoftware provides innovative technologies and software solutions: AI, digital transformation, security, and ESG and energy product families, plus services.',
  },
  hero: { title: hero.title, lead: hero.description },
  industries: {
    entries: Object.fromEntries(Object.entries(industryLines).map(([node, text]) => [node, { text }])),
  },
  cases: { items: cases.map((c) => ({ node: c.node, name: c.title, result: c.summary })) },
  products: { nodes: ['digirunner', 'systalk-viki', 'gadodido', 'greenswift'] },
  orientAi: { node: orientAi.node, title: orientAi.title, link: orientAi.action },
  contactCta,
  contact: { title: contactCta.title, description: contactCta.description },
};
