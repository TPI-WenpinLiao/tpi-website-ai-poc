// Shared by issue-launcher.yml and bootstrap.yml.
// Builds the "open in Claude Code" deep link documented at
// https://code.claude.com/docs/en/web-quickstart (prompt / repositories / environment).

const ENVIRONMENT = 'tpi-website-ai-poc';
const MARKER = '<!-- claude-code-launcher -->';

// The issue-start skill (.claude/skills/issue-start) reads the issue, checks the environment and plans.
function buildPrompt(number, title) {
  return `/issue-start ${number}\n處理 issue #${number}：${title}。`;
}

function buildLauncherUrl({ owner, repo, number, title }) {
  const params = [
    `prompt=${encodeURIComponent(buildPrompt(number, title))}`,
    `repositories=${owner}/${repo}`,
    `environment=${encodeURIComponent(ENVIRONMENT)}`,
  ];
  return `https://claude.ai/code?${params.join('&')}`;
}

function buildCommentBody(args) {
  return [
    MARKER,
    `**[在 Claude Code 開啟](${buildLauncherUrl(args)})**`,
    '',
    `會以 \`${ENVIRONMENT}\` 環境開啟新的雲端 session，並帶入處理本 issue 的 prompt。`,
  ].join('\n');
}

// Idempotent: skips when a launcher comment already exists on the issue.
async function postLauncherComment({ github, owner, repo, number, title }) {
  const comments = await github.paginate(github.rest.issues.listComments, {
    owner,
    repo,
    issue_number: number,
    per_page: 100,
  });
  if (comments.some((c) => c.body?.includes(MARKER))) return false;
  await github.rest.issues.createComment({
    owner,
    repo,
    issue_number: number,
    body: buildCommentBody({ owner, repo, number, title }),
  });
  return true;
}

module.exports = { buildLauncherUrl, buildCommentBody, postLauncherComment, MARKER };
