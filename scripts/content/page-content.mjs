// Checks that the copy in the page entries (company pages, M5-06 #31) of every locale is on their
// current-site page: every section heading, body paragraph and item of each entry that isn't a
// draft, against its first sourceUrl. Same matching as scripts/design/offering-content.mjs, but
// punctuation doesn't count either, since the migrated copy adds sentence punctuation where the
// site breaks lines. Legal pages come from PDFs and are checked by scripts/content/legal-pdf.mjs.
// description is a summary written for the meta tag, so it isn't checked.
// Needs network access to www.tpisoftware.com, so it is not part of `npm run check`.
//
//   node scripts/content/page-content.mjs
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { parse } from 'yaml';
import { request } from '../inventory/http.mjs';
import { pageText, squash } from '../lib/page-text.mjs';

const DIR = new URL('../../src/content/page/', import.meta.url);

// Lines rewritten from several site elements, with what they were built from
const REWRITTEN = {
  'zh-TW/about.md sections.1.body': '「海外服務據點」list: 總公司 | 台灣台北, 分公司 | 新加坡 / 越南胡志明 / 日本東京 / 泰國曼谷',
  'en/about.md sections.1.body': '「Locations」list: Headquarter | Taipei, Taiwan, Subsidiary | Singapore / Ho Chi Minh, Vietnam / Tokyo, Japan / Bangkok, Thailand, Sales Office | Jakarta, Indonesia',
  'vi/about.md sections.1.body': '「Trụ sở」list: Trụ sở chính | Đài Bắc, Đài Loan, Chi nhánh | Singapore / Hồ Chí Minh, Việt Nam / Tokyo, Nhật Bản / Bangkok, Thái Lan, Phòng kinh doanh | Jakarta, Indonesia',
  // Award cards have no title on the site; these name the award from the card's text (the item body)
  'en/about.md sections.6.items.11.title': 'the card「Awarded Cool Vendor 2018 in APAC by Gartner」',
  'en/about.md sections.6.items.12.title': 'the card「Named a Top Software Development Company by GoodFirms」',
  'en/about.md sections.6.items.13.title': 'the card「Named a Top Mobile App Development Company by GoodFirms」',
  'vi/about.md sections.6.items.2.title': 'the card「DigiLism được trao "Giải thưởng Sáng tạo cho Doanh nghiệp vừa và nhỏ tại Đài Loan năm 2022"」',
  'vi/about.md sections.6.items.6.title': 'the card「… "Giải thưởng Dịch vụ Tài chính Kỹ thuật số năm 2021"」',
  'vi/about.md sections.6.items.10.title': 'the card「Trở thành Đối tác chính thức của Google Cloud」',
  'vi/about.md sections.6.items.11.title': 'the card「Được Gartner trao giải Nhà cung cấp Tốt trong khu vực APAC năm 2018」',
  'vi/about.md sections.6.items.12.title': 'the card「Được GoodFirms vinh danh là Công ty phát triển phần mềm hàng đầu」',
  'vi/about.md sections.6.items.13.title': 'the card「Được GoodFirms vinh danh là Công ty phát triển ứng dụng di động hàng đầu」',
  // The onboarding journey has only its six step names on the site; this line introduces them
  'en/partners.md sections.2.body': 'the six steps 1 Enable … 6 Grow',
  'vi/partners.md sections.2.body': 'the six steps 1 Kích Hoạt … 6 Phát Triển',
};
// Entries translated from another locale's page, which is checked instead
const TRANSLATED = {
  'zh-TW/partners.md': 'en/partners.md (the zh-TW page on the current site has an empty content area)',
};

const frontmatter = (md) => parse(/^---\n([\s\S]*?)\n---/.exec(md)?.[1] ?? '');
const normalize = (s) => squash(s).replace(/[，。、；：！？「」『』【】（）()|｜,.;:!?–—\-_"'“”‘’]/g, '');

const checks = [];
const files = (await readdir(DIR.pathname, { recursive: true })).filter((f) => f.endsWith('.md')).sort();
for (const file of files) {
  const data = frontmatter(await readFile(join(DIR.pathname, file), 'utf8'));
  const url = [data.sourceUrl].flat()[0];
  if (TRANSLATED[file]) console.log(`skip ${file}: translated from ${TRANSLATED[file]}`);
  if (data.draft || !url || url.endsWith('.pdf') || TRANSLATED[file]) continue;
  const texts = (data.sections ?? []).flatMap((s, i) => [
    [`sections.${i}.heading`, s.heading],
    ...s.body.split(/\n\s*\n/).map((p, j) => [`sections.${i}.body${j ? `.${j}` : ''}`, p]),
    ...(s.items ?? []).flatMap((it, j) => [[`sections.${i}.items.${j}.title`, it.title], ...(it.body ? [[`sections.${i}.items.${j}.body`, it.body]] : [])]),
  ]);
  checks.push(...texts.map(([path, text]) => ({ file, path, text, url })));
}

const pages = new Map();
for (const url of new Set(checks.map((c) => c.url))) {
  const res = await request(url);
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  pages.set(url, normalize(pageText(await res.text())));
}
let failed = 0;
for (const c of checks) {
  const rewritten = REWRITTEN[`${c.file} ${c.path}`];
  const ok = rewritten || pages.get(c.url).includes(normalize(c.text));
  if (!ok) failed += 1;
  console.log(`${rewritten ? 'edit' : ok ? 'ok  ' : 'MISS'} ${c.file} ${c.path}: ${c.text}${rewritten ? ` (from ${rewritten})` : ''}`);
}
// A key that no longer names a line (sections or items were added or removed) would let another
// line through unchecked
const keys = new Set(checks.map((c) => `${c.file} ${c.path}`));
for (const key of Object.keys(REWRITTEN).filter((k) => !keys.has(k))) {
  failed += 1;
  console.log(`STALE REWRITTEN key "${key}": no such line; update it to the line it was written for`);
}
console.log(`${checks.length - failed}/${checks.length} lines found on ${pages.size} pages`);
process.exit(failed ? 1 : 0);
