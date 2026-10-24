// Home page copy in en (M7-02, #39), from the current en site like the zh-TW file (see its header).
// `meta.title` is the current en home page's <title> with this site's separator; `meta.description`
// translates the zh-TW one, cut to 160 characters; `labels` are this site's own wording.

import { quoted, type Sourced } from '../site.ts';
import type { Home } from './zh-TW.ts';

const HOME_EN = 'https://www.tpisoftware.com/en';
const CONTACT_EN = 'https://www.tpisoftware.com/en/contact-us';

const hero = {
  // The en about page's hero, where the zh-TW title comes from too
  title: quoted('Reinventing with AI for a Greener Future', 'https://www.tpisoftware.com/en/about-us'),
  description: quoted(
    'We strive to provide innovative technologies and software solutions.',
    HOME_EN,
    'we strive to provide innovative technologies and software solutions',
  ),
};

// The taglines of the en family pages (src/content/hub/en)
const familyLines: Record<string, Sourced> = {
  'family-ai': quoted('AI-Driven Business Innovations', 'https://www.tpisoftware.com/en/products/systalk-ai'),
  'family-dx': quoted('An API-first digital middle platform for mission critical systems', 'https://www.tpisoftware.com/en/products/digilism'),
  'family-esg': quoted('Smart Carbon and Energy Management Toward Greener Future', 'https://www.tpisoftware.com/en/products/esgswift'),
};

const orientAi = {
  node: 'orient-ai',
  eyebrow: quoted('Enterprise Agentic AI Platform', HOME_EN),
  title: quoted('Operationalizing AI for Value', HOME_EN),
  features: [quoted('Agent Collaboration', HOME_EN), quoted('AI Governance', HOME_EN), quoted('Maximized ROI', HOME_EN)],
  action: quoted('Learn More', HOME_EN),
};

const industryLines: Record<string, Sourced> = {
  // The page writes "infromation"
  'industry-finance': quoted(
    'Under the agreement of the banking customer, usage of information is provided to a Third-Party Service Provider through the OpenAPI.',
    'https://www.tpisoftware.com/en/products/open-banking',
    'Under the agreement of the banking customer, usage of infromation is provided to a Third-Party Service Provider through the OpenAPI.',
  ),
  'industry-government': quoted('Open API Applications for Smart Government', 'https://www.tpisoftware.com/en/products/open-government'),
};

const cases: { node: string; title: Sourced; summary: Sourced }[] = [
  {
    node: 'smartclaim',
    title: quoted('AI-Enhanced Insurance Claims Process', HOME_EN),
    summary: quoted('Automate the insurance claims process with enhanced analysis and efficient claims management, reducing manual effort by 80%', HOME_EN),
  },
  {
    node: 'smartfilling',
    title: quoted('AI Optical Character Recognition', HOME_EN),
    summary: quoted('Reduce 40% of maintenance effort with recognition accuracy using an adaptive approach to varying layouts and formatting', HOME_EN),
  },
  {
    node: 'success-stories',
    title: quoted('Fraud Prevention', HOME_EN),
    summary: quoted(
      'Enhance interoperability and transparency with standardized fraud prevention measures and shared intelligence of identified patterns and anomalies',
      HOME_EN,
    ),
  },
];

// The page goes on with "Fill out the form below and a team member will get back to you within
// 24h", which reads wrong away from the form; left out
const contactCta = {
  title: quoted('Get the Most Out of What We Have to Offer', CONTACT_EN),
  description: quoted('Your inquiry and opinion matter to us.', CONTACT_EN),
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
