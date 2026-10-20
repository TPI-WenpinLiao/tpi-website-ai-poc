#!/usr/bin/env bash
# SessionStart hook: prepare Claude Code cloud sessions.
# - Switch to the Node major in .nvmrc (the image ships a different one)
# - Point Lighthouse CI at the preinstalled Chromium
# - Install dependencies
# Local sessions are skipped; CLAUDE_CODE_REMOTE is "true" only in cloud environments.
set -uo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0

HASH_FILE="node_modules/.package-lock.sha256"
LOG_FILE="${TMPDIR:-/tmp}/session-start-npm-ci.log"
NVM_LOG_FILE="${TMPDIR:-/tmp}/session-start-nvm.log"
CHROMIUM_PATH="/opt/pw-browsers/chromium"
warning=""

# Lines appended here run before every later Bash command in the session.
persist_env() {
  if [ -n "${CLAUDE_ENV_FILE:-}" ]; then
    echo "$1" >>"$CLAUDE_ENV_FILE"
  fi
}

# --- Node version -----------------------------------------------------------
expected_major="$(tr -dc '0-9' <.nvmrc 2>/dev/null)"
current_major="$(node -v 2>/dev/null | sed -E 's/^v([0-9]+).*/\1/')"
if [ -n "$expected_major" ] && [ "$current_major" != "$expected_major" ]; then
  export NVM_DIR="${NVM_DIR:-/opt/nvm}"
  # nvm.sh is not compatible with `set -u`.
  set +u
  # nvm.sh returns non-zero when no default alias exists, so check for the function instead.
  [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" --no-use >/dev/null 2>&1
  if command -v nvm >/dev/null && nvm install "$expected_major" >"$NVM_LOG_FILE" 2>&1; then
    node_bin="$(dirname "$(nvm which "$expected_major")")"
    export PATH="$node_bin:$PATH"
    persist_env "export PATH=\"$node_bin:\$PATH\""
  else
    warning="Could not switch to Node ${expected_major} (still $(node -v 2>/dev/null)). Log: ${NVM_LOG_FILE}"
  fi
  set -u
fi

# --- Lighthouse CI ----------------------------------------------------------
if [ -z "${CHROME_PATH:-}" ] && [ -x "$CHROMIUM_PATH" ]; then
  persist_env "export CHROME_PATH=$CHROMIUM_PATH"
fi
# Chromium refuses to start as root without --no-sandbox.
if [ "$(id -u)" = "0" ]; then
  persist_env 'export LHCI_COLLECT__SETTINGS__CHROME_FLAGS="--no-sandbox --headless=new"'
fi

warn_and_exit() {
  if [ -n "$warning" ]; then
    WARNING="$warning" node -e '
process.stdout.write(JSON.stringify({ systemMessage: `[session-start] ${process.env.WARNING}` }));
' 2>/dev/null || echo "[session-start] $warning" >&2
  fi
  exit 0
}

# --- Dependencies -----------------------------------------------------------
# Include the Node major so switching versions triggers a reinstall.
current_hash="$(sha256sum package-lock.json 2>/dev/null | cut -d' ' -f1)"
[ -n "$current_hash" ] && current_hash="${current_hash}-node$(node -v 2>/dev/null | sed -E 's/^v([0-9]+).*/\1/')"

# Skip reinstall on resume when the lockfile and Node major have not changed.
if [ -n "$current_hash" ] && [ -f "$HASH_FILE" ] && [ "$(cat "$HASH_FILE")" = "$current_hash" ]; then
  warn_and_exit
fi

npm ci --no-audit --no-fund >"$LOG_FILE" 2>&1
status=$?
if [ "$status" -eq 0 ]; then
  printf '%s' "$current_hash" >"$HASH_FILE"
  warn_and_exit
fi

log_excerpt="$(head -n 25 "$LOG_FILE")"
node_version="$(node -v 2>/dev/null || echo 'not found')"
expected_node="$(cat .nvmrc 2>/dev/null || echo 'unknown')"

# Exit 0 with JSON so both the user (systemMessage) and Claude (additionalContext) see the failure;
# a non-zero exit would hide stderr from Claude.
SUMMARY="npm ci failed (exit ${status}). Node ${node_version}, expected major ${expected_node}. Log: ${LOG_FILE}${warning:+. $warning}" \
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
