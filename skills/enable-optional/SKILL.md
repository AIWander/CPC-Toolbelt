---
name: enable-optional
description: Use when the user wants to enable optional CPC Toolbelt MCP servers — Voice, Workflow, and/or Manager (Beta).
---

# Enable optional Toolbelt servers

Ask yes/no for each. All of them are stdio. The Hands home is `HANDS_HOME`, else `CPC_ROOT`, else the per-user `AIWander/Hands` directory.

| Key | Binary |
|---|---|
| `cpc-voice` | `<Hands home>/servers/voice.exe` |
| `cpc-workflow` | `<Hands home>/servers/workflow.exe` |
| `cpc-manager` | `<Hands home>/servers/manager.exe` (Beta) |

## Cursor
Merge accepted entries from `mcp.optionals.example.json` into the user's MCP config (or plugin overlay). Commands stay `${HANDS_HOME}/servers/<name>.exe`. Do not merge Programmer here. Do not write an absolute path into the plugin repo.

## Grok / Codex
Copy accepted stdio snippets from that client's snippet file into the user MCP config. Fill the path at install time. Do not copy a sample that contains a fixed machine path.

Verify each opted binary exists before wiring. Manager is Beta — say so.
