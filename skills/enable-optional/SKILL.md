---
name: enable-optional
description: Use when the user wants to enable optional CPC Toolbelt MCP servers — Voice, Workflow, and/or Manager (Beta).
---

# Enable optional Toolbelt servers

Ask yes/no for each:

| Key | Binary |
|---|---|
| `cpc-voice` | `%CPC_ROOT%\servers\\voice.exe` |
| `cpc-workflow` | `%CPC_ROOT%\servers\\workflow.exe` |
| `cpc-manager` | `%CPC_ROOT%\servers\\manager.exe` (Beta) |

## Cursor
Merge accepted entries from `mcp.optionals.example.json` into the user's MCP config (or plugin overlay). Do not merge Programmer here.

## Grok / GPT
Copy accepted snippets from `mcp-snippets/` into the Grok MCP config.

Verify each opted binary exists before wiring. Manager is Beta — say so.
