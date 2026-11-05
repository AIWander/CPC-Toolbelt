# Changelog

## Unreleased
- Paths resolve at runtime: `HANDS_HOME`, else `CPC_ROOT`, else `%LOCALAPPDATA%\AIWander\Hands` (platform user-data dir when `LOCALAPPDATA` is unset). `CPC_CACHE` remains an optional override; otherwise Cache is `<Hands home>/cache`. No machine-specific fallback.
- MCP entries are stdio. Commands use `${HANDS_HOME}` (filled at install time). Removed the shared-host port example.
- `scripts/validate.mjs` rejects hard-coded machine paths instead of requiring one.
- Added the `getting-started` skill: call `hands_setup_status` first; walk through a private tunnel only when needed. The user signs in themselves. No stored keys. No public link by default.

## 0.1.0 — 2026-09-25
- Initial publishable CPC Toolbelt Cursor plugin (root-as-plugin).
- MCP: `cpc-hands` only.
- Cache v1: `CPC_CACHE` path + skills/hooks; no `cpc-cache` MCP.
- Hooks: sessionStart, beforeSubmitPrompt, beforeMCPExecution, stop (doctor nudge gated).
- Skills: toolbelt-setup, toolbelt-doctor, cache-first, enable-optional, add-programmer, hands-check.
- Programmer never default on Cursor.
