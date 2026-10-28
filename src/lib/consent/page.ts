// What PageLayout passes to ConsentBanner and the footer (M6-04, #36, ADR 0007). Without
// PUBLIC_GTM_ID nothing is tracked, so there is nothing to ask: no banner, no footer button, and the
// built pages don't change. With it, the build fails on an ID that isn't a GTM container ID, and while
// src/data/consent.ts is still a draft (placeholder categories and copy must not go live).
// CONSENT_ALLOW_DRAFT=1 lifts the draft check for the test build of scripts/consent/gtm.mjs only.
import { consent } from '../../data/consent';
import { localNode, nodeHref } from '../ia/navigation';
import type { Locale } from '../i18n/locales';

const GTM_ID = /^GTM-[A-Z0-9]+$/;
// ConsentBanner's id: its dialog is `${ID}-dialog`, which the footer's button opens
const ID = 'consent';

export interface ConsentConfig {
  gtmId: string;
  version: number;
  categories: typeof consent.categories;
}

function gtmId(): string | undefined {
  const id: unknown = import.meta.env.PUBLIC_GTM_ID;
  if (id === undefined || id === '') return undefined;
  if (typeof id !== 'string' || !GTM_ID.test(id)) throw new Error(`PUBLIC_GTM_ID must look like GTM-XXXXXXX, got "${String(id)}"`);
  if (consent.draft && process.env.CONSENT_ALLOW_DRAFT !== '1') {
    throw new Error(
      'PUBLIC_GTM_ID is set but src/data/consent.ts is still a draft: replace its placeholder categories and copy, then set draft: false (ADR 0007)',
    );
  }
  return id;
}

export function consentProps(locale: Locale) {
  const id = gtmId();
  if (!id) return undefined;
  const text = consent.text[locale];
  const privacy = localNode('privacy', locale);
  return {
    id: ID,
    config: { gtmId: id, version: consent.version, categories: consent.categories } satisfies ConsentConfig,
    categories: consent.categories.map((c) => {
      const t = text.categories[c.id];
      if (!t) throw new Error(`src/data/consent.ts has no ${locale} text for category ${c.id}`);
      return { id: c.id, required: c.required, ...t };
    }),
    copy: { ...text, policy: { href: nodeHref('privacy', locale), label: privacy.title } },
    footer: { label: text.footerLink, dialog: `${ID}-dialog` },
  };
}
