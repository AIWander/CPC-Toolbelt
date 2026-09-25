---
name: toolbelt-doctor
description: Use when CPC Toolbelt fails to load, Hands is missing from Available Tools, CPC_CACHE looks wrong, or paths need verification on Windows.
---

# CPC Toolbelt doctor

Run from the plugin root:

```bash
node scripts/toolbelt-doctor.mjs
```

When the plugin is installed, the same file is `node ${CURSOR_PLUGIN_ROOT}/scripts/toolbelt-doctor.mjs`.

The script reads `CPC_ROOT` and `CPC_CACHE` from the environment (plugin variables). Defaults: `C:\CPC`, `C:\CPC\cache`. It prints one JSON object and always exits 0. `ok: false` means a required path missed. A shared-host probe never flips `ok`.

## What it checks

1. `CPC_ROOT` is a directory.
2. `%CPC_ROOT%\servers\hands.exe` exists. The JSON `hands_exe.spawn` field is the exact command the host would start.
3. `CPC_CACHE` is a directory. The script does not create it. Create the directory only if the user says yes.
4. Shared host: if `%CPC_ROOT%\shared-mcp` is a directory, TCP-probe `127.0.0.1:7772` (Hands on that daemon). Report `open`, `closed`, or `skipped`. Closed, timeout, and skipped are advisory. If `shared-mcp` is absent, skip the probe.

## After the script

5. Confirm `cpc-hands` appears under Available Tools. Cache is **not** an MCP entry in v1.
6. If a tool fails, show the exact command from `hands_exe.spawn` and the OS error — do not guess.
7. Optionals: only diagnose servers the user enabled (`voice.exe`, `workflow.exe`, `manager.exe`).
8. Never claim an `autocache.exe` / `cpc-cache` MCP exists unless discovered on disk.

## Do not

- Do not read Volumes.
- Do not open files under `shared-mcp` (those configs name a separate paid product).
- Do not contact any port other than 7772, and only when the `shared-mcp` directory is present.
- Do not brand Toolbelt or Hands as autonomous.
