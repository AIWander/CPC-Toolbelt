---
name: toolbelt-doctor
description: Use when CPC Toolbelt fails to load, Hands is missing from Available Tools, the Cache path looks wrong, or install paths need verification.
---

# CPC Toolbelt doctor

Run from the plugin root:

```bash
node scripts/toolbelt-doctor.mjs
```

When the plugin is installed, the same file is `node ${CURSOR_PLUGIN_ROOT}/scripts/toolbelt-doctor.mjs`.

The script resolves paths at runtime. Hands home is `HANDS_HOME`, else `CPC_ROOT`, else `%LOCALAPPDATA%\AIWander\Hands` (or the current user's application-data directory plus `AIWander/Hands`). Cache is `CPC_CACHE`, else `<Hands home>/cache`. It prints one JSON object and always exits 0. `ok: false` means a required path missed. A shared-host probe never flips `ok`.

## What it checks

1. The Hands home is a directory. JSON field: `hands_home` (`source` is `HANDS_HOME`, `CPC_ROOT`, or `default`). `cpc_root` mirrors `hands_home` for older callers.
2. `<Hands home>/servers/hands.exe` exists. The JSON `hands_exe.spawn` field is the exact command the host would start.
3. The Cache directory exists. The script does not create it. Create the directory only if the user says yes.
4. Shared host: if `<Hands home>/shared-mcp` is a directory **and** `HANDS_SHARED_PORT` is set, TCP-probe `127.0.0.1` on that port. Report `open`, `closed`, or `skipped`. There is no built-in port. Closed, timeout, and skipped are advisory. If `shared-mcp` is absent, or the port variable is unset, skip the probe.

## After the script

5. Confirm `cpc-hands` appears under Available Tools. It is stdio. Cache is **not** an MCP entry in v1.
6. If a tool fails, show the exact command from `hands_exe.spawn` and the OS error — do not guess.
7. Optionals: only diagnose servers the user enabled (`voice.exe`, `workflow.exe`, `manager.exe`).
8. Never claim a Cache MCP server exists unless a binary is actually on disk.

## Do not

- Do not read Volumes.
- Do not open files under `shared-mcp`.
- Do not contact any port unless the user set `HANDS_SHARED_PORT`, and only when the `shared-mcp` directory is present.
- Do not brand Toolbelt or Hands as autonomous.
