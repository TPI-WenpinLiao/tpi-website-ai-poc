// Home page copy in vi (M7-03, #40), sourced like the zh-TW file: every Sourced line comes from the
// current site's vi pages (www.tpisoftware.vn) and `node scripts/design/home-content.mjs` checks it.
// Each line takes the vi page's text at the place the zh-TW line comes from; where the vi site says
// something different (OrientAI's third feature), its wording is kept and listed as 待確認 in the PR.
// The current site has no vi page for the AI and ESG product families, so they have no line, like
// family-security in zh-TW. `meta` and `labels` are this site's own wording.

import { quoted, type Sourced } from '../site.ts';
import type { Home } from './zh-TW';

const HOME = 'https://www.tpisoftware.vn/';
const ABOUT = 'https://www.tpisoftware.vn/about-us';
const CONTACT = 'https://www.tpisoftware.vn/contact-us';

const hero = {
  // The subtitle of the about page's h1, as in zh-TW
  title: quoted('Tái Định Hình Với AI Cho Một Tương Lai Xanh Hơn', ABOUT),
  description: quoted(
    'Không ngừng nỗ lực mang đến những công nghệ và giải pháp phần mềm đổi mới.',
    HOME,
    'chúng tôi không ngừng nỗ lực mang đến những công nghệ và giải pháp phần mềm đổi mới',
  ),
};

const familyLines: Record<string, Sourced> = {
  'family-dx': quoted('Nền tảng trung gian ưu tiên API dành cho các hệ thống quan trọng', 'https://www.tpisoftware.vn/products/digilism'),
};

const orientAi = {
  node: 'orient-ai',
  eyebrow: quoted('Nền tảng AI đa tác nhân cấp doanh nghiệp', HOME),
  title: quoted('Hiện thực hóa giá trị thực tiễn từ AI', HOME),
  // zh-TW's third feature is Token 成本控管; the vi page says Tối đa hóa ROI
  features: [quoted('Phối hợp đa tác nhân', HOME), quoted('Quản trị AI', HOME), quoted('Tối đa hóa ROI', HOME)],
  action: quoted('Tìm hiểu thêm', HOME),
};

const industryLines: Record<string, Sourced> = {
  'industry-finance': quoted(
    'Ngân hàng mở: dưới sự đồng ý của khách hàng của ngân hàng, việc sử dụng thông tin được cung cấp cho Nhà cung cấp dịch vụ Bên thứ ba (TSP) thông qua API mở.',
    'https://www.tpisoftware.vn/products/open-banking',
    'của khách hàng của ngân hàng, việc sử dụng thông tin được cung cấp cho Nhà cung cấp dịch vụ Bên thứ ba (TSP) thông qua API mở',
  ),
  'industry-government': quoted('Ứng dụng API mở cho Chính phủ thông minh', 'https://www.tpisoftware.vn/products/open-government'),
};

// The vi home page's case highlights at the places of the zh-TW ones; the vi titles span two lines
const cases: { node: string; title: Sourced; summary: Sourced }[] = [
  {
    node: 'smartclaim',
    title: quoted('Quy trình Bồi thường Bảo hiểm AI', HOME),
    summary: quoted(
      'Tự động hóa quy trình giải quyết bồi thường với khả năng phân tích nâng cao và quản lý hiệu quả, giúp giảm thiểu 80% thao tác thủ công.',
      HOME,
    ),
  },
  {
    node: 'smartfilling',
    title: quoted('Nhận dạng Ký tự Quang học (AI OCR)', HOME),
    summary: quoted(
      'Giảm 40% công sức bảo trì nhờ độ chính xác nhận dạng cao, sử dụng phương pháp thích ứng linh hoạt với các loại bố cục và định dạng khác nhau.',
      HOME,
    ),
  },
  {
    node: 'success-stories',
    title: quoted('Phòng chống Gian lận', HOME),
    summary: quoted(
      'Tăng cường khả năng liên thông và tính minh bạch thông qua các biện pháp phòng chống gian lận được tiêu chuẩn hóa.',
      HOME,
      'Tăng cường khả năng liên thông và tính minh bạch thông qua các biện pháp phòng chống gian lận được tiêu chuẩn hóa',
    ),
  },
];

const contactCta = {
  title: quoted('Chúng tôi luôn sẵn sàng lắng nghe bạn!', CONTACT),
  description: quoted('Nếu bạn có bất kỳ câu hỏi hay thắc mắc nào, đừng ngần ngại liên hệ.', CONTACT),
};

export const home: Home = {
  meta: {
    // The vi home page's <title>, with this site's separator
    title: 'TPIsoftware | Dẫn đầu về giải pháp phần mềm cho doanh nghiệp',
    // The vi home page's meta description, cut to the seo-checklist length
    description:
      'TPIsoftware cung cấp nền tảng trung gian iPaaS DigiLism, dòng AI hội thoại SysTalk.ai, nền tảng quản lý bền vững ESGswift và nền tảng bảo mật GadoSecurity.',
  },
  hero,
  familyLines,
  orientAi,
  industryLines,
  cases,
  contactCta,
  labels: {
    // 「Dòng Sản phẩm」 as on the vi contact form
    families: 'Dòng sản phẩm',
    familyLink: (family: string) => `Xem dòng sản phẩm ${family}`,
    orientFeatures: 'Tính năng OrientAI',
    all: (listing: string) => `Tất cả ${listing}`,
    latest: 'Bài viết và tin tức mới nhất',
  },
};
