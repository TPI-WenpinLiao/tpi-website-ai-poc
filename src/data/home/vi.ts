// Home page copy in vi (M7-03, #40), written like the zh-TW file (see its header): facts through
// fact('<id>'), the rest is wording, still taken from the current site's vi pages
// (www.tpisoftware.vn) at the places the zh-TW lines come from; `meta` is this site's own wording.
// #167 rebuilt the home page in five sections (src/data/home/types.ts) for zh-TW only: this file
// keeps its earlier copy where a section has a place for it, and the sections and headings it has no
// copy for are left out or named after their node, until the vi copy is written (#167 follow-up).

import { fact } from '../facts.ts';
import type { Home } from './types.ts';

const hero = {
  // The subtitle of the about page's h1, as in zh-TW
  title: 'Tái Định Hình Với AI Cho Một Tương Lai Xanh Hơn',
  description: 'Không ngừng nỗ lực mang đến những công nghệ và giải pháp phần mềm đổi mới.',
};

const orientAi = {
  node: 'orient-ai',
  title: 'Hiện thực hóa giá trị thực tiễn từ AI',
  action: 'Tìm hiểu thêm',
};

const industryLines: Record<string, string> = {
  'industry-finance':
    'Ngân hàng mở: dưới sự đồng ý của khách hàng của ngân hàng, việc sử dụng thông tin được cung cấp cho Nhà cung cấp dịch vụ Bên thứ ba (TSP) thông qua API mở.',
  'industry-government': 'Ứng dụng API mở cho Chính phủ thông minh',
};

// The vi home page's case highlights at the places of the zh-TW ones
const cases: { node: string; title: string; summary: string }[] = [
  { node: 'smartclaim', title: fact('smartclaim-title-vi'), summary: fact('smartclaim-result-vi') },
  { node: 'smartfilling', title: fact('smartfilling-title-vi'), summary: fact('smartfilling-result-vi') },
  { node: 'success-stories', title: fact('fraud-platform-title-vi'), summary: fact('fraud-platform-result-vi') },
];

const contactCta = {
  title: 'Chúng tôi luôn sẵn sàng lắng nghe bạn!',
  description: 'Nếu bạn có bất kỳ câu hỏi hay thắc mắc nào, đừng ngần ngại liên hệ.',
};

export const home: Home = {
  meta: {
    // The vi home page's <title>, with this site's separator
    title: 'TPIsoftware | Dẫn đầu về giải pháp phần mềm cho doanh nghiệp',
    // The vi home page's meta description, cut to the seo-checklist length
    description:
      'TPIsoftware cung cấp nền tảng trung gian iPaaS DigiLism, dòng AI hội thoại SysTalk.ai, nền tảng quản lý bền vững ESGswift và nền tảng bảo mật GadoSecurity.',
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
