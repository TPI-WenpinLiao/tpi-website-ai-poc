#!/bin/sh
# Chromium for .claude/skills/taste-skill's scripts (inspect.mjs, scenes.mjs) in the cloud session (#166).
# The session runs as root, where Chromium refuses to start without --no-sandbox, and the skill's
# scripts take the browser only from CHROME_PATH. The skill is vendored unchanged, so the flag is
# added here instead:  CHROME_PATH=scripts/strategy/chromium.sh node .claude/skills/taste-skill/scripts/inspect.mjs <page>
# Uses the Playwright Chromium that the environment provides (/opt/pw-browsers), or CHROMIUM_BIN.
exec "${CHROMIUM_BIN:-/opt/pw-browsers/chromium}" --no-sandbox "$@"
