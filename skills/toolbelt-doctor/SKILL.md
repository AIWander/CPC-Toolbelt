---
name: toolbelt-doctor
description: Use when CPC Toolbelt fails to load, Hands is missing from Available Tools, CPC_CACHE looks wrong, or paths need verification on Windows.
---

# CPC Toolbelt doctor

1. Read `CPC_ROOT` and `CPC_CACHE` (env or plugin variables). Defaults: `C:\CPC`, `C:\CPC\cache`.
2. Verify `%CPC_ROOT%\servers\\hands.exe` exists.
3. Verify `CPC_CACHE` directory exists (create only with user OK).
4. Confirm `cpc-hands` appears under Available Tools. Cache is **not** an MCP entry in v1.
5. If a tool fails, show the exact command the host would spawn and the OS error — do not guess.
6. Optionals: only diagnose servers the user enabled (`voice.exe`, `workflow.exe`, `manager.exe`).
7. Never claim an `autocache.exe` / `cpc-cache` MCP exists unless discovered on disk.
