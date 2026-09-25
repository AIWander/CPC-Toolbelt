---
name: cache-first
description: Use when fetching skills, files, logos, binaries, or other assets — prefer CPC_CACHE path before network. Explains Cache v1 path-only model.
---

# Cache-first (v1 path + skills only)

## Locked rule
Cache in CPC Toolbelt v1 is **not** an MCP server. There is no `cpc-cache` in `mcp.json`.

1. Read `CPC_CACHE` (default suggest `C:\CPC\cache`).
2. Before downloading or fetching an asset, check whether it already exists under that path (and common subfolders).
3. Prefer the local copy when present and fresh enough for the task.
4. Only then use network / browser / installers.

## What Cache is not (v1)
- Not `autocache.exe`
- Not an MCP wire
- Not “autonomous memory”

Hooks (`cache_first_prompt`, `cache_before_mcp`) reinforce this softly and never block tools.
