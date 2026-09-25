---
name: add-programmer
description: Use only when the user explicitly asks to add Programmer (cpc-programmer). Never default on Cursor; Claude Desktop includes it by default (installer future).
---

# Add Programmer (directed only)

Programmer is **default on Claude Desktop Toolbelt only** (document in pack matrix; Claude installer is future).

On Cursor / Grok / GPT:
1. Confirm the user wants `cpc-programmer` on this client.
2. Locate `programmer.exe` under `CPC_ROOT\servers`.
3. Add MCP key `cpc-programmer` pointing at that binary.
4. Verify tools appear.

Never add Programmer proactively on Cursor.
