---
name: hands-check
description: Use when verifying cpc-hands MCP health — confirm the hands.exe path and run a trivial Hands health check if available.
---

# Hands check

1. Call `hands_setup_status` first when it is available.
2. Resolve the Hands home: `HANDS_HOME`, else `CPC_ROOT`, else `%LOCALAPPDATA%\AIWander\Hands` (current user's application-data directory plus `AIWander/Hands` when `LOCALAPPDATA` is unset).
3. Confirm `<Hands home>/servers/hands.exe` exists.
4. Confirm MCP key `cpc-hands` is configured as stdio. The command is `${HANDS_HOME}/servers/hands.exe` or the same path written into the user's private config at install time.
5. If `hands_health` (or equivalent) is available, call it.
6. Report pass/fail with the exact path and error text — no guessing.
