// Home page copy in vi (#177), section by section like zh-TW.ts (see its header): facts through
// fact('<id>') from the current vi pages (www.tpisoftware.vn, the `-vi` facts in
// docs/strategy/facts.yaml), the rest is wording, written for this site after the zh-TW lines and
// docs/strategy/messaging.md. Names of products and pages come from docs/i18n/glossary.csv.

import { fact } from '../facts.ts';
import type { Home } from './types.ts';

export const home: Home = {
  meta: {
    title: 'TPIsoftware | Phần mềm API và AI cho tài chính và chính phủ',
    description:
      'TPIsoftware tự phát triển và triển khai phần mềm, kết nối API, dữ liệu và AI một cách an toàn vào hệ thống hiện có của ngành tài chính và chính phủ.',
  },
  hero: {
    title: 'API và AI cho\ntài chính, chính phủ',
    mapAlt:
      'Bản đồ hệ thống gồm các khối trắng: một dải ruy băng xuất phát từ hệ thống lõi màu xám đậm, đi qua các sản phẩm TPIsoftware có mặt trên màu tím, mô hình AI màu hồng tím và dịch vụ mới màu cam, chuyển từ tím sang hồng tím rồi sang cam, và chạy xuống khỏi mép trước của bản đồ.',
    lead: 'TPIsoftware tự phát triển sản phẩm, đồng thời lập kế hoạch và triển khai cho khách hàng.',
    secondary: 'Giải pháp theo ngành',
  },
  industries: {
    // Short like zh-TW (see en.ts)
    title: 'Quy định,\nđã tích hợp',
    entries: {
      'industry-finance': { text: fact('digirunner-open-banking-fsc-vi'), link: 'Giải pháp cho ngành tài chính' },
      'industry-government': { text: fact('digirunner-ndc-spec-vi'), link: 'Giải pháp cho chính phủ' },
    },
  },
  cases: {
    title: 'AI trong công việc\nhằng ngày',
    count: '{n} / {total}',
    items: [
      { node: 'smartclaim', name: fact('smartclaim-title-vi'), result: fact('smartclaim-result-vi') },
      { node: 'smartfilling', name: fact('smartfilling-title-vi'), result: fact('smartfilling-result-vi') },
      // The bank result, as in zh-TW (#187)
      { node: 'industry-finance', name: fact('smartfilling-case-bank-title-vi'), result: fact('smartfilling-case-bank-vi'), link: 'AI trong ngành tài chính' },
    ],
  },
  products: {
    title: 'Sản phẩm cho API, AI,\nbảo mật và carbon',
    nodes: ['digirunner', 'systalk-viki', 'gadodido', 'greenswift'],
  },
  orientAi: {
    node: 'orient-ai',
    // Like en.ts: the vi FAQ asks about training, not whether the data leaves the company
    title: 'AI doanh nghiệp,\ndữ liệu là của bạn.',
    quote: `Dữ liệu của tôi có được sử dụng để huấn luyện các mô hình của bên thứ ba không? “${fact('orientai-data-yours-vi')}”`,
    link: 'Tìm hiểu OrientAI, nền tảng AI tự chủ cho doanh nghiệp',
  },
  contactCta: {
    title: 'Trao đổi nhu cầu hoặc đặt lịch demo',
    description:
      'Hãy cho chúng tôi biết hệ thống hiện tại và vấn đề bạn muốn giải quyết. Đội ngũ kinh doanh và tư vấn của TPIsoftware sẽ liên hệ để sắp xếp buổi giới thiệu hoặc demo.',
  },
  contact: {
    title: 'Hợp tác lâu dài, có hồ sơ để kiểm chứng',
    records: [
      { label: '2005', text: fact('company-founded-vi') },
      { label: '2008', text: fact('company-milestone-2008-finance-vi') },
      { label: '2020', text: fact('company-employees-630-vi') },
      { label: '2022', text: fact('award-ft-high-growth-2022-vi') },
      { label: '2024', text: fact('award-taiwan-excellence-2024-vi') },
      { label: 'Chứng nhận', text: fact('cert-iso27001-digilism-vi') },
    ],
    action: 'Liên hệ kinh doanh',
    about: 'Về TPIsoftware',
  },
};
