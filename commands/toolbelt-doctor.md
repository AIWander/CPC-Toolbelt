---
name: toolbelt-doctor
description: Verify CPC_ROOT, hands.exe, and CPC_CACHE for CPC Toolbelt
---

Run the `toolbelt-doctor` skill. Execute `node scripts/toolbelt-doctor.mjs` and report its JSON. Required checks: `CPC_ROOT`, `%CPC_ROOT%\servers\hands.exe`, and `CPC_CACHE`. If `%CPC_ROOT%\shared-mcp` exists, the script probes `127.0.0.1:7772` and does not fail when that port is closed. Cache is path-only in v1.
