// Home page copy in en (M7-02, #39), written like the zh-TW file (see its header): facts through
// fact('<id>'), the rest is wording, still the current en site's. `meta.title` is the current en
// home page's <title> with this site's separator; `meta.description` translates the zh-TW one, cut
// to 160 characters; `labels` are this site's own wording.

import { fact } from '../facts.ts';
import type { Home } from './zh-TW.ts';

const hero = {
  // The en about page's hero, where the zh-TW title comes from too
  title: 'Reinventing with AI for a Greener Future',
  description: 'We strive to provide innovative technologies and software solutions.',
};

// The taglines of the en family pages (src/content/hub/en)
const familyLines: Record<string, string> = {
  'family-ai': 'AI-Driven Business Innovations',
  'family-dx': 'An API-first digital middle platform for mission critical systems',
  'family-esg': 'Smart Carbon and Energy Management Toward Greener Future',
};

const orientAi = {
  node: 'orient-ai',
  eyebrow: 'Enterprise Agentic AI Platform',
  title: 'Operationalizing AI for Value',
  features: [fact('orientai-multi-agent-en'), fact('orientai-governance-en'), fact('orientai-roi-en')],
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
  hero,
  familyLines,
  orientAi,
  industryLines,
  cases,
  contactCta,
  labels: {
    families: 'Product families',
    familyLink: (family: string) => `See the ${family} product family`,
    orientFeatures: 'OrientAI features',
    all: (listing: string) => `All ${listing}`,
    latest: 'Latest articles and news',
  },
};
