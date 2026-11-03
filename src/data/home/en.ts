// Home page copy in en (#177), section by section like zh-TW.ts (see its header): facts through
// fact('<id>') from the current en pages (the `-en` facts in docs/strategy/facts.yaml), the rest is
// wording, written for this site after the zh-TW lines and docs/strategy/messaging.md. Names of
// products and pages come from docs/i18n/glossary.csv.

import { fact } from '../facts.ts';
import type { Home } from './types.ts';

export const home: Home = {
  meta: {
    title: 'TPIsoftware | API and AI Software for Finance and Government',
    description:
      'TPIsoftware develops and implements its own software, connecting APIs, data and AI securely to existing systems in finance and government.',
  },
  hero: {
    // Two lines like zh-TW, so the map stays in the first screen; finance and government, which
    // don't fit, are in the lead
    title: 'APIs and AI, wired\ninto core systems',
    mapAlt:
      'A system map of white blocks: a ribbon starts at the dark grey core system, passes TPIsoftware products topped in purple, magenta AI models and orange new services, turns from purple to magenta to orange, and runs down off the front edge of the map.',
    lead: 'TPIsoftware builds its own products for finance and government, and plans and delivers their implementation too.',
    secondary: 'Solutions by industry',
  },
  industries: {
    // Short like zh-TW: below 48rem the heading spans the column over the ribbon's fork
    title: 'Regulations,\nbuilt in',
    entries: {
      'industry-finance': { text: fact('digirunner-open-banking-fsc-en'), link: 'Solutions for finance' },
      'industry-government': { text: fact('digirunner-ndc-spec-en'), link: 'Solutions for government' },
    },
  },
  cases: {
    title: 'AI at work in\neveryday operations',
    count: '{n} of {total}',
    items: [
      { node: 'smartclaim', name: fact('smartclaim-title-en'), result: fact('smartclaim-result-en') },
      { node: 'smartfilling', name: fact('smartfilling-title-en'), result: fact('smartfilling-result-en') },
      // The bank result, as in zh-TW (#187)
      { node: 'industry-finance', name: fact('smartfilling-case-bank-title-en'), result: fact('smartfilling-case-bank-en'), link: 'AI in finance' },
    ],
  },
  products: {
    title: 'A product for each:\nAPI, AI, security, carbon',
    nodes: ['digirunner', 'systalk-viki', 'gadodido', 'greenswift'],
  },
  orientAi: {
    node: 'orient-ai',
    // The en page has no "does the data leave the company?" (zh-TW); its FAQ asks about training
    // instead, so the heading says the data stays the company's, not that it stays on premises
    title: 'Enterprise AI,\nyour data stays yours.',
    quote: `Will my data be used to train third-party models? “${fact('orientai-data-yours-en')}”`,
    link: 'Explore the OrientAI Enterprise Agentic AI Platform',
  },
  contactCta: {
    title: 'Talk to sales, or book a demo',
    description:
      'Tell us about your current systems and the problem you want to solve. Our sales team and consultants will contact you to arrange a briefing or a demo.',
  },
  contact: {
    title: 'Long partnerships, on the record',
    records: [
      { label: '2005', text: fact('company-founded-en') },
      { label: '2008', text: fact('company-milestone-2008-finance-en') },
      { label: '2020', text: fact('company-employees-630-en') },
      { label: '2022', text: fact('award-ft-high-growth-2022-en') },
      { label: '2024', text: fact('award-taiwan-excellence-2024-en') },
      { label: 'Certification', text: fact('cert-iso27001-digilism-en') },
    ],
    action: 'Contact sales',
    about: 'About TPIsoftware',
  },
};
