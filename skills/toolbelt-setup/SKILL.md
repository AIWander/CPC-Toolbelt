---
name: toolbelt-setup
description: Use when installing or configuring CPC Toolbelt — set HANDS_HOME, confirm the Cache path, verify Hands MCP, or enable optional Voice/Workflow/Manager.
---

# CPC Toolbelt setup

Run the `getting-started` skill first if `hands_setup_status` has not been called this session.

## Fixed pack (v1)
- Wire MCP: `cpc-hands` only, stdio, command `${HANDS_HOME}/servers/hands.exe`
- Cache: `CPC_CACHE` if set, otherwise `<Hands home>/cache`. Skills and hooks only — **no** `cpc-cache` MCP server

## Ask the user
1. Confirm the Hands home: `HANDS_HOME`, else `CPC_ROOT` when they still use that variable, else `%LOCALAPPDATA%\AIWander\Hands` (current user's application-data directory plus `AIWander/Hands` when `LOCALAPPDATA` is unset).
2. Confirm Cache: `CPC_CACHE`, or `<Hands home>/cache` when they have not set one.
3. Optional yes/no: Voice, Workflow, Manager (Beta).

Write `HANDS_HOME` into the plugin variables when you know the directory. If the host cannot expand `${HANDS_HOME}`, put the resolved stdio command only in the user's private MCP config.

## Enable optionals
Merge entries from `mcp.optionals.example.json` (Cursor) or the Grok repo's `mcp-snippets/` only for accepted optionals. Those snippets must stay stdio and must not contain an absolute path.

## Do not
- Do not add `cpc-programmer` unless the user explicitly asks (use the `add-programmer` skill).
- Do not brand as autonomous.
- Do not invent a Cache MCP binary — v1 has none.
- Do not publish a port map or a public URL.
