// Header label sets for the wireframe header. zh-TW comes from navigation.csv; en and vi are
// measurement fixtures for scripts/wireframe/nav-fit.mjs, not translations (menu copy is M7).
// en/vi labels reuse the current site's header wording (docs/research/inventory.csv nav_location);
// 產業方案 has no current-site equivalent, so it uses a provisional short and long rendering.
import { header, utility } from './ia';

export interface HeaderLabels {
  id: string;
  lang: string;
  // First-level header items, keyed by navigation.csv node or label
  items: Record<string, string>;
  locale: string;
  contact: string;
  search: string;
  menu: string;
}

const util = (key: string) => {
  const item = utility.find((u) => u.key === key);
  if (!item) throw new Error(`navigation.csv has no utility item ${key}`);
  return item.label;
};

export const zhTW: HeaderLabels = {
  id: 'zh-TW',
  lang: 'zh-TW',
  items: Object.fromEntries(header.map((h) => [h.key, h.label])),
  locale: '中文',
  contact: util('contact'),
  search: util('search'),
  menu: '選單',
};

const en: HeaderLabels = {
  id: 'en',
  lang: 'en',
  items: {
    產品: 'Products',
    產業方案: 'Industries',
    服務: 'Services',
    資源: 'Resources',
    公司: 'Company',
  },
  locale: 'English',
  contact: 'Contact Us',
  search: 'Search',
  menu: 'Menu',
};

const vi: HeaderLabels = {
  id: 'vi',
  lang: 'vi',
  items: {
    產品: 'Sản Phẩm',
    產業方案: 'Giải pháp ngành',
    服務: 'Dịch Vụ',
    資源: 'Nguồn',
    公司: 'Công Ty',
  },
  locale: 'Tiếng Việt',
  contact: 'Liên Hệ',
  search: 'Tìm kiếm',
  menu: 'Menu',
};

export const navFitSets: HeaderLabels[] = [
  zhTW,
  en,
  { ...en, id: 'en-long', items: { ...en.items, 產業方案: 'Industry Solutions' } },
  vi,
  { ...vi, id: 'vi-long', items: { ...vi.items, 產業方案: 'Giải pháp theo ngành' } },
];
