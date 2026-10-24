// Compares .github/bootstrap/issues.yml with the issues on GitHub, so the yml stays usable as the
// issue list and re-running the bootstrap workflow never creates duplicates.
// An issue is matched by its `<!-- bootstrap-id: … -->` comment or its `[Mx-xx]` title prefix, then
// title, milestone, labels and each body section rendered by bootstrap.cjs are compared.
// Ignored: the bootstrap-id comment, acceptance checkbox state, labels used as a `gate` (review state)
// and needs-decision (a session waiting for its user, .claude/skills/checkpoint/SKILL.md).
// Also lists `[Mx-xx]` issues missing from the yml and the issues bootstrap would create (dry run).
// Exits 1 when anything differs.
// The repo is public, so the GitHub API is called without a token. If it ever becomes private, run
// this in a workflow with `GITHUB_TOKEN` instead of asking for a token in a session.
// Run: node scripts/bootstrap/diff.mjs [--issues <issues.json>]   (JSON = GET /repos/{o}/{r}/issues pages, concatenated)

import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const { validate, renderBody, load, issueTitle } = require('../../.github/scripts/bootstrap.cjs');

const REPO = 'TPI-WenpinLiao/tpi-website-ai-poc';
const ID_COMMENT = /<!-- bootstrap-id: (M\d+-\d+) -->/;
const ID_PREFIX = /^\[(M\d+-\d+)\] /;

export function splitSections(body) {
  const normalized = body
    .replace(/\r\n/g, '\n')
    .replace(ID_COMMENT, '')
    .replace(/^(\s*- )\[x\]/gim, '$1[ ]')
    .replace(/[ \t]+$/gm, '');
  const sections = new Map();
  for (const chunk of normalized.split(/^## /m).slice(1)) {
    const newline = chunk.indexOf('\n');
    const heading = (newline === -1 ? chunk : chunk.slice(0, newline)).trim();
    sections.set(heading, newline === -1 ? '' : chunk.slice(newline + 1).trim());
  }
  return sections;
}

// gh: GitHub issues (pull requests already excluded), [{ number, title, body, labels: [name], milestone: title|null }]
export function diffIssues({ issues, milestones, gh }) {
  const milestoneTitle = new Map(milestones.map((m) => [m.id, m.title]));
  const stateLabels = new Set(['needs-decision', ...issues.filter((i) => i.gate).map((i) => i.gate)]);
  const ymlIds = new Set(issues.map((i) => i.id));
  const ghTitles = new Set(gh.map((i) => i.title));

  const byId = new Map();
  const problems = [];
  for (const g of gh) {
    const id = ID_COMMENT.exec(g.body ?? '')?.[1] ?? ID_PREFIX.exec(g.title)?.[1];
    if (!id) continue;
    if (byId.has(id)) problems.push({ id, field: '對應', detail: `GitHub 上有多張：#${byId.get(id).number}、#${g.number}` });
    else byId.set(id, g);
  }
  const idToNumber = new Map([...byId].map(([id, g]) => [id, g.number]));

  for (const issue of issues) {
    const g = byId.get(issue.id);
    if (!g) {
      problems.push({ id: issue.id, field: '對應', detail: 'GitHub 上沒有' });
      continue;
    }
    const ref = `${issue.id} #${g.number}`;
    if (g.title !== issueTitle(issue)) {
      problems.push({ id: ref, field: '標題', expected: issueTitle(issue), actual: g.title });
    }
    const expectedMilestone = milestoneTitle.get(issue.milestone) ?? null;
    if (g.milestone !== expectedMilestone) {
      problems.push({ id: ref, field: 'milestone', expected: expectedMilestone, actual: g.milestone });
    }
    const labels = (list) => list.filter((l) => !stateLabels.has(l)).sort().join(', ');
    if (labels(issue.labels) !== labels(g.labels)) {
      problems.push({ id: ref, field: 'label', expected: labels(issue.labels), actual: labels(g.labels) });
    }
    const expected = splitSections(renderBody(issue, idToNumber));
    const actual = splitSections(g.body ?? '');
    for (const heading of new Set([...expected.keys(), ...actual.keys()])) {
      if (expected.get(heading) !== actual.get(heading)) {
        problems.push({ id: ref, field: heading, expected: expected.get(heading) ?? null, actual: actual.get(heading) ?? null });
      }
    }
  }

  for (const [id, g] of byId) {
    if (!ymlIds.has(id)) problems.push({ id: `${id} #${g.number}`, field: '對應', detail: 'issues.yml 沒有' });
  }

  const wouldCreate = issues.filter((i) => !ghTitles.has(issueTitle(i))).map(issueTitle);
  return { problems, wouldCreate };
}

export function format({ problems, wouldCreate }) {
  const show = (v) => (v === null ? '（無）' : v.includes('\n') ? `\n${v.replace(/^/gm, '      ')}` : v);
  const lines = problems.map((p) =>
    p.detail
      ? `- ${p.id} ${p.field}：${p.detail}`
      : `- ${p.id} ${p.field}\n    issues.yml：${show(p.expected)}\n    GitHub：${show(p.actual)}`,
  );
  lines.push('', `差異：${problems.length}`, `重跑 bootstrap 會新建的 issue：${wouldCreate.length}`);
  lines.push(...wouldCreate.map((t) => `- ${t}`));
  return lines.join('\n');
}

async function fetchIssues() {
  const all = [];
  for (let page = 1; ; page += 1) {
    const res = await fetch(`https://api.github.com/repos/${REPO}/issues?state=all&per_page=100&page=${page}`, {
      headers: { accept: 'application/vnd.github+json', 'user-agent': REPO },
    });
    if (!res.ok) throw new Error(`GitHub API ${res.status}: ${await res.text()}`);
    const batch = await res.json();
    all.push(...batch);
    if (batch.length < 100) return all;
  }
}

function toGh(raw) {
  return raw
    .filter((i) => !i.pull_request)
    .map((i) => ({
      number: i.number,
      title: i.title,
      body: i.body ?? '',
      labels: i.labels.map((l) => (typeof l === 'string' ? l : l.name)),
      milestone: i.milestone?.title ?? null,
    }));
}

async function main(args) {
  const fileIndex = args.indexOf('--issues');
  if (fileIndex === -1 && (process.env.HTTPS_PROXY || process.env.https_proxy) && !process.env.NODE_USE_ENV_PROXY) {
    // Node's fetch ignores HTTPS_PROXY unless NODE_USE_ENV_PROXY is set at startup (e.g. cloud sessions).
    const child = spawnSync(process.execPath, process.argv.slice(1), {
      stdio: 'inherit',
      env: { ...process.env, NODE_USE_ENV_PROXY: '1' },
    });
    process.exit(child.status ?? 1);
  }
  const issues = load('issues.yml');
  const milestones = load('milestones.yml');
  validate(load('labels.yml'), milestones, issues);
  const raw = fileIndex === -1 ? await fetchIssues() : JSON.parse(readFileSync(args[fileIndex + 1], 'utf8'));
  const result = diffIssues({ issues, milestones, gh: toGh(raw) });
  console.log(format(result));
  process.exitCode = result.problems.length || result.wouldCreate.length ? 1 : 0;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(process.argv.slice(2)).catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}
