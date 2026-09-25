# Changelog

## 0.1.0 — 2026-09-25
- Initial publishable CPC Toolbelt Cursor plugin (root-as-plugin).
- MCP: `cpc-hands` only.
- Cache v1: `CPC_CACHE` path + skills/hooks (default suggest `C:\CPC\cache`); no `cpc-cache` MCP.
- Hooks: sessionStart, beforeSubmitPrompt, beforeMCPExecution, stop (doctor nudge gated).
- Skills: toolbelt-setup, toolbelt-doctor, cache-first, enable-optional, add-programmer, hands-check.
- Programmer never default on Cursor.
