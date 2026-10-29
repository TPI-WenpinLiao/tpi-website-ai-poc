// Cookie consent categories and copy (M6-04, #36, ADR 0007). The banner only shows in builds with
// PUBLIC_GTM_ID (src/lib/consent/page.ts), and those builds fail while `draft` is true.
// Everything below is a placeholder and needs input (#36 PR「待確認問題」): the rules to follow
// decide the categories, the tags in the GTM container decide each category's consent types, and
// the copy is provided by the content owner in all three locales. Bump `version` whenever the
// categories or the copy change, so visitors who chose under the old text are asked again.
import type { Category } from '../lib/consent/state';
import type { Locale } from '../lib/i18n/locales';

export interface ConsentText {
  title: string;
  description: string;
  acceptAll: string;
  rejectAll: string;
  settings: string;
  dialogTitle: string;
  dialogDescription: string;
  save: string;
  close: string;
  alwaysOn: string;
  // The footer's button that reopens the preferences
  footerLink: string;
  categories: Record<string, { name: string; description: string }>;
}

export interface ConsentData {
  draft: boolean;
  version: number;
  categories: readonly Category[];
  text: Record<Locale, ConsentText>;
}

const TBC = '[TBC]';

export const consent: ConsentData = {
  draft: true,
  version: 1,
  // 待確認：placeholder categories
  categories: [
    { id: 'necessary', required: true, consentTypes: ['security_storage'] },
    { id: 'analytics', consentTypes: ['analytics_storage'] },
    { id: 'marketing', consentTypes: ['ad_storage', 'ad_user_data', 'ad_personalization'] },
  ],
  text: {
    'zh-TW': {
      title: '[待確認] Cookie 使用說明',
      description: '[待確認] 橫幅說明文字，由內容負責人提供。',
      acceptAll: '全部接受',
      rejectAll: '全部拒絕',
      settings: '偏好設定',
      dialogTitle: 'Cookie 偏好設定',
      dialogDescription: '[待確認] 偏好設定的說明文字，由內容負責人提供。',
      save: '儲存設定',
      close: '關閉',
      alwaysOn: '一律啟用',
      footerLink: 'Cookie 設定',
      categories: {
        necessary: { name: '[待確認] 必要', description: '[待確認] 類別說明。' },
        analytics: { name: '[待確認] 分析', description: '[待確認] 類別說明。' },
        marketing: { name: '[待確認] 行銷', description: '[待確認] 類別說明。' },
      },
    },
    en: {
      title: `${TBC} Cookies`,
      description: `${TBC} Banner text, provided by the content owner.`,
      acceptAll: `${TBC} Accept all`,
      rejectAll: `${TBC} Reject all`,
      settings: `${TBC} Preferences`,
      dialogTitle: `${TBC} Cookie preferences`,
      dialogDescription: `${TBC} Preferences text, provided by the content owner.`,
      save: `${TBC} Save`,
      close: `${TBC} Close`,
      alwaysOn: `${TBC} Always on`,
      footerLink: `${TBC} Cookie settings`,
      categories: {
        necessary: { name: `${TBC} Necessary`, description: `${TBC} Category text.` },
        analytics: { name: `${TBC} Analytics`, description: `${TBC} Category text.` },
        marketing: { name: `${TBC} Marketing`, description: `${TBC} Category text.` },
      },
    },
    vi: {
      title: `${TBC} Cookies`,
      description: `${TBC} Banner text, provided by the content owner.`,
      acceptAll: `${TBC} Accept all`,
      rejectAll: `${TBC} Reject all`,
      settings: `${TBC} Preferences`,
      dialogTitle: `${TBC} Cookie preferences`,
      dialogDescription: `${TBC} Preferences text, provided by the content owner.`,
      save: `${TBC} Save`,
      close: `${TBC} Close`,
      alwaysOn: `${TBC} Always on`,
      footerLink: `${TBC} Cookie settings`,
      categories: {
        necessary: { name: `${TBC} Necessary`, description: `${TBC} Category text.` },
        analytics: { name: `${TBC} Analytics`, description: `${TBC} Category text.` },
        marketing: { name: `${TBC} Marketing`, description: `${TBC} Category text.` },
      },
    },
  },
};
