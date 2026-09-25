# Changelog

## Unreleased
- Docs: `RELATIONSHIP.md` lane map; `mcp.shared-http.example.json` shared-host port map (no autonomous/7771 in free wire); PACK_MATRIX transport note.

## 0.1.0 — 2026-09-25
- Initial publishable CPC Toolbelt Cursor plugin (root-as-plugin).
- MCP: `cpc-hands` only.
- Cache v1: `CPC_CACHE` path + skills/hooks (default suggest `C:\CPC\cache`); no `cpc-cache` MCP.
- Hooks: sessionStart, beforeSubmitPrompt, beforeMCPExecution, stop (doctor nudge gated).
- Skills: toolbelt-setup, toolbelt-doctor, cache-first, enable-optional, add-programmer, hands-check.
- Programmer never default on Cursor.
