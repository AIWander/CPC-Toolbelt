---
name: toolbelt-setup
description: Use when installing or configuring CPC Toolbelt — set CPC_ROOT and CPC_CACHE, verify Hands MCP, or enable optional Voice/Workflow/Manager.
---

# CPC Toolbelt setup

## Fixed pack (v1)
- Wire MCP: `cpc-hands` only (`%CPC_ROOT%\servers\\hands.exe`)
- Cache: collect `CPC_CACHE` path + skills/hooks — **no** `cpc-cache` MCP server

## Ask the user
1. Confirm `CPC_ROOT` (default `C:\CPC`).
2. Confirm `CPC_CACHE` (default suggest `C:\CPC\cache` — exists on reference BEE).
3. Optional yes/no: Voice, Workflow, Manager (Beta).

## Enable optionals
Merge entries from `mcp.optionals.example.json` (Cursor) or `mcp-snippets/` (Grok) only for accepted optionals.

## Do not
- Do not add `cpc-programmer` unless the user explicitly asks (use `add-programmer` skill).
- Do not brand as autonomous.
- Do not invent `autocache.exe` — binary truth has no Cache MCP binary yet.
