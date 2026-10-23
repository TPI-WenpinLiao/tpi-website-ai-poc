// Converts the current site's legal PDFs into the page entries of the legal nodes (M5-06, #31):
// src/content/page/zh-TW/{privacy,terms,disclaimer,security-policy}.md. The PDF text (pdftotext
// -layout, from poppler-utils) becomes the Markdown body; title, description and effectiveDate
// come from DOCS below. Before writing, the body is checked against the PDF: with whitespace and
// the Markdown added here removed, it must equal the PDF text character for character, so the
// conversion only changes line breaks and structure.
// Rerunning writes the same files. --check writes nothing and exits 1 when a file is out of date.
// Needs network access to www.tpisoftware.com, so it is not part of `npm run check`.
//
//   node scripts/content/legal-pdf.mjs [--check]
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const OUT = new URL('../../src/content/page/zh-TW/', import.meta.url);
const MIGRATED_AT = '2026-10-23';

// One per legal node. The en and vi PDFs are not converted: the en ones date from 2020 and differ
// from the 2026 zh-TW text (which already carries an English translation), and the vi one is a
// candidate privacy notice, not the website's (PR #31「待確認」).
// effectiveDate is the date the PDF states; `dateNote` explains one that comes from elsewhere.
// `dropFrom` ends the body at that line (what follows is not text).
const DOCS = [
  {
    node: 'privacy',
    url: 'https://www.tpisoftware.com/pdf/1-1PrivacyPolicy(tw).pdf',
    title: '隱私權政策',
    description: '昕力資訊網站的隱私權聲明：蒐集個人資料的目的與類別、利用期間、地區、對象及方式，當事人權利與行使方式，以及 Cookie 與第三方網站的說明。',
  },
  {
    node: 'terms',
    url: 'https://www.tpisoftware.com/pdf/2-1Use(tw).pdf',
    title: '使用條款',
    description: '昕力資訊網站使用條款：網站內容的所有權與使用規範、帳號安全、免責聲明、責任限制、違反條款的處理，以及準據法與管轄法院。',
  },
  {
    node: 'disclaimer',
    url: 'https://www.tpisoftware.com/pdf/3-1Disclaimer(tw).pdf',
    title: '免責聲明',
    description: '昕力資訊網站免責聲明：網頁所載資料僅供參考，本公司不保證資料準確無誤，也不對使用網頁或連結至其他機構網頁所引致的損害負責。',
  },
  {
    node: 'security-policy',
    url: 'https://www.tpisoftware.com/pdf/%E8%B3%87%E8%A8%8A%E5%AE%89%E5%85%A8%E6%94%BF%E7%AD%96.pdf',
    title: '資訊安全政策',
    description: '昕力資訊依 ISO/IEC 27001 與 ISO/IEC 27701 訂定的資訊安全政策：目的、依據、適用範圍、各項控制措施、適用性聲明書與實施方式。',
    effectiveDate: '2025-09-15',
    dateNote: 'The PDF states no date; this is its ModDate (pdfinfo). To be confirmed by the policy owner.',
    dropFrom: '七、佐證資料',
    // 「二、依據」lists its sources as 1.–9.; the sections are numbered 一、二、…
    numberedHeadings: false,
  },
];

const CJK = /[　-鿿＀-￯]/;
const LEADING_PUNCT = /^[、，。；：！？）」』】〉》]/;
const BULLET = /^(?:l|⮚|●|•)\s+/;
const CLAUSE = /^(\d+(?:\.\d+)+)\.?(?:\s+|$)/;
const SECTION = /^(?:\d+\.\s|[一二三四五六七八九十]+、)/;

// Chinese lines can be mostly Latin (a list of subsidiaries' names); their full-width punctuation
// tells them from the English ones
const isZh = (s) => {
  const cjk = (s.match(/[㐀-鿿]/g) ?? []).length;
  const latin = (s.match(/[A-Za-z]/g) ?? []).length;
  return /[、，。；：「」（）]/.test(s) || (cjk > 0 && cjk >= latin * 0.3);
};
const ENDS_SENTENCE = /[。：；.:;!?！？」）)]$/;
// Joins two wrapped lines: no space between Chinese characters, before a full-width punctuation
// mark or after one; a space between English words
const FULL_WIDTH_PUNCT = /[、，。；：！？「」『』（）【】]/;
const join2 = (a, b) => {
  if (!a) return b;
  const tight = (CJK.test(a.at(-1)) && CJK.test(b[0])) || LEADING_PUNCT.test(b) || FULL_WIDTH_PUNCT.test(a.at(-1));
  return tight ? a + b : `${a} ${b}`;
};
const escape = (s) => s.replace(/([\\`*_[\]<>#|])/g, '\\$1');
const squash = (s) => s.replace(/\s+/g, '');

/** Lines of the PDF text without the title, page numbers and anything from dropFrom on. */
export function textLines(text, dropFrom) {
  const lines = text.replace(/\f/g, '\n').split('\n').map((l) => l.replace(/\s+$/, ''));
  const out = [];
  let title;
  for (const line of lines) {
    const t = line.trim();
    if (/^\d+$/.test(t)) continue;
    if (!title && t) {
      title = t;
      continue;
    }
    if (dropFrom && t === dropFrom) break;
    out.push(line);
  }
  return { title, lines: out };
}

/** Blocks: { kind: 'h2' | 'h3' | 'item' | 'p', text, extra?: string[] } */
export function blocks(lines, { numberedHeadings = true } = {}) {
  const out = [];
  let cur = null;
  let blank = true;
  const push = (b) => {
    out.push(b);
    cur = b;
  };
  for (const raw of lines) {
    const t = raw
      .trim()
      .replace(/\s+(?=[、，。；：！？）」』】])/g, '')
      .replace(/\s{2,}/g, ' ');
    const indent = raw.length - raw.trimStart().length;
    if (!t) {
      blank = true;
      continue;
    }
    const wasBlank = blank;
    blank = false;
    // A punctuation mark that pdftotext put on a line of its own belongs to the line before
    if (cur && LEADING_PUNCT.test(t)) {
      if (cur.extra?.length) cur.extra[cur.extra.length - 1] = join2(cur.extra.at(-1), t);
      else cur.text = join2(cur.text, t);
      continue;
    }
    const zh = isZh(t);
    if (BULLET.test(t)) {
      push({ kind: 'item', text: t.replace(BULLET, ''), zh, indent });
      continue;
    }
    // Without numbered headings, "1. …" starts an ordered list item
    if (!numberedHeadings && /^\d+\.\s/.test(t)) {
      push({ kind: 'ordered', text: t, zh, indent });
      continue;
    }
    if (SECTION.test(t) && !CLAUSE.test(t)) {
      push({ kind: 'h2', text: t, zh });
      continue;
    }
    const clause = CLAUSE.exec(t);
    if (clause) {
      // "4.1 資訊安全及隱私政策": a short title; "4.1.1 依營運要求…": a clause
      const rest = t.slice(clause[0].length);
      const isTitle = clause[1].split('.').length === 2 && rest && rest.length <= 30 && !/。$/.test(rest);
      push({ kind: isTitle ? 'h3' : 'p', text: t, zh, open: !rest });
      continue;
    }
    // A page break in mid-sentence leaves a blank line inside the paragraph
    if (cur && wasBlank && cur.kind !== 'h2' && cur.kind !== 'h3') {
      const extra = Boolean(cur.extra?.length);
      const last = extra ? cur.extra.at(-1) : cur.text;
      if (zh === (extra ? cur.extraZh : cur.zh) && !ENDS_SENTENCE.test(last)) {
        if (extra) cur.extra[cur.extra.length - 1] = join2(last, t);
        else cur.text = join2(last, t);
        continue;
      }
    }
    if (cur && !wasBlank) {
      // The English line under a Chinese section title is part of the title
      if (cur.kind === 'h2' && cur.zh && !zh && !cur.joined) {
        cur.text = `${cur.text} ${t}`;
        cur.joined = true;
        continue;
      }
      // A clause number alone on its line takes the next line as its text
      if (cur.open) {
        cur.text = `${cur.text} ${t}`;
        cur.open = false;
        continue;
      }
      if (cur.kind !== 'h2' && cur.kind !== 'h3') {
        const lastZh = cur.extra?.length ? cur.extraZh : cur.zh;
        if (zh === lastZh) {
          if (cur.extra?.length) cur.extra[cur.extra.length - 1] = join2(cur.extra.at(-1), t);
          else cur.text = join2(cur.text, t);
          continue;
        }
        // A list item wrapped onto an indented line mid-sentence, where the language changes
        if (cur.kind === 'item' && !cur.extra && indent > cur.indent + 1 && !ENDS_SENTENCE.test(cur.text)) {
          cur.text = join2(cur.text, t);
          continue;
        }
        // The translation of a list item stays in the item
        if (cur.kind === 'item' && !cur.extra) {
          cur.extra = [t];
          cur.extraZh = zh;
          continue;
        }
      }
    }
    push({ kind: 'p', text: t, zh });
  }
  return out;
}

export function markdown(bs) {
  const out = [];
  bs.forEach((b, i) => {
    const prev = bs[i - 1];
    if (b.kind === 'item') {
      // A blank line between items only where one has a translation paragraph
      if (out.length && (prev?.kind !== 'item' || prev.extra || b.extra)) out.push('');
      out.push(`- ${escape(b.text)}`, ...(b.extra ?? []).flatMap((e) => ['', `  ${escape(e)}`]));
      return;
    }
    if (out.length && !(b.kind === 'ordered' && prev?.kind === 'ordered')) out.push('');
    if (b.kind === 'ordered') out.push(escape(b.text));
    else if (b.kind === 'h2') out.push(`## ${escape(b.text)}`);
    else if (b.kind === 'h3') out.push(`### ${escape(b.text)}`);
    // A paragraph like "1. …" or "(1)…" must not turn into a list
    else out.push(escape(b.text).replace(/^(\d+)\. /, '$1\\. '));
  });
  return `${out.join('\n')}\n`;
}

/** The body's text without Markdown syntax, for comparing with the PDF */
export const plain = (md) =>
  squash(
    md
      .split('\n')
      .map((l) => l.replace(/^#{2,3} |^- |^ {2}/, ''))
      .join('')
      .replace(/\\(.)/g, '$1'),
  );

function effectiveDate(text, doc) {
  if (doc.effectiveDate) return doc.effectiveDate;
  const m = /最近修訂日期.*?(\d{4})\/(\d{2})\/(\d{2})/.exec(text) ?? /最後更新時間為\s*(\d{4})\s*年\s*(\d{2})\s*月\s*(\d{2})\s*日/.exec(text);
  if (!m) throw new Error(`${doc.url}: no date found; set effectiveDate and dateNote in DOCS`);
  return `${m[1]}-${m[2]}-${m[3]}`;
}

function entry(doc, text) {
  const { lines } = textLines(text, doc.dropFrom);
  const body = markdown(blocks(lines, { numberedHeadings: doc.numberedHeadings ?? true }));
  // The PDF's bullet glyphs become Markdown list markers
  const expected = squash(lines.map((l) => l.trim().replace(BULLET, '')).join(''));
  if (plain(body) !== expected) {
    const a = plain(body);
    const at = [...a].findIndex((c, i) => c !== expected[i]);
    throw new Error(`${doc.node}: body differs from the PDF text at ${at}: "${a.slice(at, at + 20)}" vs "${expected.slice(at, at + 20)}"`);
  }
  const front = [
    '---',
    `title: ${doc.title}`,
    `description: ${doc.description}`,
    `translationKey: ${doc.node}`,
    `node: ${doc.node}`,
    ...(doc.dateNote ? [`# ${doc.dateNote}`] : []),
    `effectiveDate: ${effectiveDate(text, doc)}`,
    `sourceUrl: ${doc.url}`,
    `migratedAt: ${MIGRATED_AT}`,
    '---',
    '',
    '<!-- Generated by scripts/content/legal-pdf.mjs from sourceUrl; change the script, not this file -->',
    '',
    '',
  ];
  return front.join('\n') + body;
}

async function main(check) {
  // Loaded here: http.mjs re-runs the process under a proxy, which the tests importing this file don't want
  const { request } = await import('../inventory/http.mjs');
  const dir = mkdtempSync(join(tmpdir(), 'legal-pdf-'));
  let stale = 0;
  try {
    for (const doc of DOCS) {
      const res = await request(doc.url);
      if (!res.ok) throw new Error(`${doc.url}: HTTP ${res.status}`);
      const pdf = join(dir, `${doc.node}.pdf`);
      writeFileSync(pdf, Buffer.from(await res.arrayBuffer()));
      const text = execFileSync('pdftotext', ['-layout', '-enc', 'UTF-8', pdf, '-'], { encoding: 'utf8' });
      const file = new URL(`${doc.node}.md`, OUT);
      const next = entry(doc, text);
      const current = existsSync(file) ? readFileSync(file, 'utf8') : '';
      if (current === next) {
        console.log(`ok    ${doc.node}`);
      } else if (check) {
        stale += 1;
        console.log(`STALE ${doc.node}`);
      } else {
        writeFileSync(file, next);
        console.log(`wrote ${doc.node}`);
      }
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
  process.exit(stale ? 1 : 0);
}

if (import.meta.url === `file://${process.argv[1]}`) await main(process.argv.includes('--check'));
