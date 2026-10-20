#!/usr/bin/env bash
# SessionStart hook: install dependencies in Claude Code cloud sessions.
# Local sessions are skipped; CLAUDE_CODE_REMOTE is "true" only in cloud environments.
set -uo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0

HASH_FILE="node_modules/.package-lock.sha256"
LOG_FILE="${TMPDIR:-/tmp}/session-start-npm-ci.log"

current_hash="$(sha256sum package-lock.json 2>/dev/null | cut -d' ' -f1)"

# Skip reinstall on resume when the lockfile has not changed.
if [ -n "$current_hash" ] && [ -f "$HASH_FILE" ] && [ "$(cat "$HASH_FILE")" = "$current_hash" ]; then
  exit 0
fi

npm ci --no-audit --no-fund >"$LOG_FILE" 2>&1
status=$?
if [ "$status" -eq 0 ]; then
  printf '%s' "$current_hash" >"$HASH_FILE"
  exit 0
fi

log_excerpt="$(head -n 25 "$LOG_FILE")"
node_version="$(node -v 2>/dev/null || echo 'not found')"
expected_node="$(cat .nvmrc 2>/dev/null || echo 'unknown')"

# Exit 0 with JSON so both the user (systemMessage) and Claude (additionalContext) see the failure;
# a non-zero exit would hide stderr from Claude.
SUMMARY="npm ci failed (exit ${status}). Node ${node_version}, expected major ${expected_node}. Log: ${LOG_FILE}" \
LOG_EXCERPT="$log_excerpt" \
node -e '
const summary = process.env.SUMMARY;
const excerpt = process.env.LOG_EXCERPT;
process.stdout.write(JSON.stringify({
  systemMessage: `[session-start] ${summary}`,
  hookSpecificOutput: {
    hookEventName: "SessionStart",
    additionalContext:
      `Dependency installation failed in the SessionStart hook: ${summary}\n` +
      `Do not start implementation. Report this to the user, then retry with \`npm ci\` and inspect the log.\n` +
      `First lines of the log:\n${excerpt}`,
  },
}));
' 2>/dev/null || {
  # Fallback when node itself is unavailable.
  echo "[session-start] npm ci failed (exit ${status}). Log: ${LOG_FILE}" >&2
  echo "$log_excerpt" >&2
  exit 2
}
exit 0
