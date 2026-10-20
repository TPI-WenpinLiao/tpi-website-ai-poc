// Idempotently creates labels, milestones and issues from .github/bootstrap/*.yml.
// Existing items are matched by name / title and skipped.
const { readFileSync } = require('node:fs');
const path = require('node:path');
const YAML = require('yaml');
const { postLauncherComment } = require('./launcher.cjs');

const DATA_DIR = path.join(__dirname, '..', 'bootstrap');
const load = (file) => YAML.parse(readFileSync(path.join(DATA_DIR, file), 'utf8'));

// GitHub asks for >= 1s between content-creating requests to avoid secondary rate limits.
const pause = () => new Promise((resolve) => setTimeout(resolve, process.env.BOOTSTRAP_PAUSE_MS ? Number(process.env.BOOTSTRAP_PAUSE_MS) : 1000));

const issueTitle = (issue) => `[${issue.id}] ${issue.title}`;

function renderBody(issue, idToNumber) {
  const list = (items) => items.map((i) => `- ${i}`).join('\n');
  const deps = issue.dependsOn?.length
    ? issue.dependsOn.map((id) => (idToNumber.has(id) ? `- #${idToNumber.get(id)}（${id}）` : `- ${id}`)).join('\n')
    : '無';
  const sections = [
    `<!-- bootstrap-id: ${issue.id} -->`,
    `## 目標\n\n${issue.goal}`,
    `## 交付物\n\n${list(issue.deliverables)}`,
    `## 驗收條件\n\n${issue.acceptance.map((a) => `- [ ] ${a}`).join('\n')}`,
    `## 依賴\n\n${deps}`,
  ];
  if (issue.gate) {
    sections.push(`## 關卡\n\n本 issue 為關卡 issue：人工審核通過後加上 \`${issue.gate}\`，後續 issue 才能開始。`);
  }
  return sections.join('\n\n');
}

function validate(labels, milestones, issues) {
  const labelNames = new Set(labels.map((l) => l.name));
  const milestoneIds = new Set(milestones.map((m) => m.id));
  const seen = new Set();
  const errors = [];
  for (const issue of issues) {
    if (seen.has(issue.id)) errors.push(`${issue.id}: duplicate id`);
    if (!milestoneIds.has(issue.milestone)) errors.push(`${issue.id}: unknown milestone ${issue.milestone}`);
    for (const l of [...issue.labels, ...(issue.gate ? [issue.gate] : [])]) {
      if (!labelNames.has(l)) errors.push(`${issue.id}: unknown label ${l}`);
    }
    for (const d of issue.dependsOn ?? []) {
      if (!seen.has(d)) errors.push(`${issue.id}: dependency ${d} must be defined earlier`);
    }
    for (const key of ['title', 'goal', 'deliverables', 'acceptance']) {
      if (!issue[key]) errors.push(`${issue.id}: missing ${key}`);
    }
    seen.add(issue.id);
  }
  if (errors.length) throw new Error(`Invalid bootstrap data:\n${errors.join('\n')}`);
}

module.exports = async function bootstrap({ github, context, core }) {
  const { owner, repo } = context.repo;
  const labels = load('labels.yml');
  const milestones = load('milestones.yml');
  const issues = load('issues.yml');
  validate(labels, milestones, issues);

  // Labels
  const existingLabels = new Set(
    (await github.paginate(github.rest.issues.listLabelsForRepo, { owner, repo, per_page: 100 })).map((l) => l.name),
  );
  for (const label of labels) {
    if (existingLabels.has(label.name)) {
      core.info(`label exists: ${label.name}`);
      continue;
    }
    await github.rest.issues.createLabel({ owner, repo, ...label });
    core.info(`label created: ${label.name}`);
  }

  // Milestones
  const milestoneNumbers = new Map(
    (await github.paginate(github.rest.issues.listMilestones, { owner, repo, state: 'all', per_page: 100 })).map(
      (m) => [m.title, m.number],
    ),
  );
  const milestoneById = new Map();
  for (const m of milestones) {
    if (!milestoneNumbers.has(m.title)) {
      const { data } = await github.rest.issues.createMilestone({ owner, repo, title: m.title, description: m.description });
      milestoneNumbers.set(m.title, data.number);
      core.info(`milestone created: ${m.title}`);
    } else {
      core.info(`milestone exists: ${m.title}`);
    }
    milestoneById.set(m.id, milestoneNumbers.get(m.title));
  }

  // Issues (pull requests are returned by the issues API too; exclude them)
  const existingIssues = new Map(
    (await github.paginate(github.rest.issues.listForRepo, { owner, repo, state: 'all', per_page: 100 }))
      .filter((i) => !i.pull_request)
      .map((i) => [i.title, i.number]),
  );
  const idToNumber = new Map();
  let created = 0;
  for (const issue of issues) {
    const title = issueTitle(issue);
    if (existingIssues.has(title)) {
      idToNumber.set(issue.id, existingIssues.get(title));
      core.info(`issue exists: ${title}`);
      continue;
    }
    const { data } = await github.rest.issues.create({
      owner,
      repo,
      title,
      body: renderBody(issue, idToNumber),
      labels: issue.labels,
      milestone: milestoneById.get(issue.milestone),
    });
    idToNumber.set(issue.id, data.number);
    created += 1;
    await pause();
    core.info(`issue created: #${data.number} ${title}`);
    // Issues created with GITHUB_TOKEN do not trigger issue-launcher, so comment here.
    if (await postLauncherComment({ github, owner, repo, number: data.number, title })) await pause();
  }

  await core.summary
    .addHeading('Bootstrap')
    .addList([
      `labels: ${labels.length}`,
      `milestones: ${milestones.length}`,
      `issues: ${issues.length}（本次新建 ${created}）`,
    ])
    .write();
};

module.exports.validate = validate;
module.exports.renderBody = renderBody;
module.exports.load = load;
