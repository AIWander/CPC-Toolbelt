---
name: hands-check
description: Use when verifying cpc-hands MCP health — confirm hands.exe path and run a trivial Hands health check if available.
---

# Hands check

1. Resolve `CPC_ROOT` (default `C:\CPC`).
2. Confirm `%CPC_ROOT%\servers\\hands.exe` exists.
3. Confirm MCP key `cpc-hands` is configured.
4. If `hands_health` (or equivalent) is available, call it.
5. Report pass/fail with the exact path and error text — no guessing.
