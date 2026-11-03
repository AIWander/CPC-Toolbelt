---
name: add-programmer
description: Use only when the user explicitly asks to add Programmer (cpc-programmer). Never default on Cursor; Claude Desktop includes it by default.
---

# Add Programmer (directed only)

Programmer is **default on Claude Desktop Toolbelt only** (see the pack matrix).

On Cursor / Grok / Codex:
1. Confirm the user wants `cpc-programmer` on this client.
2. Locate `programmer.exe` under `<Hands home>/servers`. The home is `HANDS_HOME`, else `CPC_ROOT`, else the per-user `AIWander/Hands` directory.
3. Add an stdio MCP entry:

```json
{
  "type": "stdio",
  "command": "${HANDS_HOME}/servers/programmer.exe",
  "args": []
}
```

If the host cannot expand `HANDS_HOME`, write the resolved command into the user's private MCP config only.
4. Verify tools appear.

Never add Programmer proactively on Cursor. Never commit an absolute path.
