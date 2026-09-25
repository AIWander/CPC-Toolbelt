# Changelog

## Unreleased
- Docs: `RELATIONSHIP.md` lane map; `mcp.shared-http.example.json` shared-host port map (no autonomous/7771 in free wire); PACK_MATRIX transport note.
- Doctor: `scripts/toolbelt-doctor.mjs` checks `CPC_ROOT`, `hands.exe`, and `CPC_CACHE`. If `%CPC_ROOT%\shared-mcp` exists it TCP-probes `127.0.0.1:7772` and stays fail-open when that port is closed. No Volumes read and no port 7771.
- README Related links `RELATIONSHIP.md`.

## 0.1.0 — 2026-09-25
- Initial publishable CPC Toolbelt Cursor plugin (root-as-plugin).
- MCP: `cpc-hands` only.
- Cache v1: `CPC_CACHE` path + skills/hooks (default suggest `C:\CPC\cache`); no `cpc-cache` MCP.
- Hooks: sessionStart, beforeSubmitPrompt, beforeMCPExecution, stop (doctor nudge gated).
- Skills: toolbelt-setup, toolbelt-doctor, cache-first, enable-optional, add-programmer, hands-check.
- Programmer never default on Cursor.
