---
name: toolbelt-doctor
description: Verify the Hands home, hands.exe, and the Cache directory for CPC Toolbelt
---

Run the `toolbelt-doctor` skill. Execute `node scripts/toolbelt-doctor.mjs` and report its JSON. Required checks: Hands home, `<Hands home>/servers/hands.exe`, and the Cache directory. `HANDS_HOME` wins over `CPC_ROOT`. When both are unset, the home is `%LOCALAPPDATA%\AIWander\Hands`. A shared-host TCP probe runs only when `HANDS_SHARED_PORT` is set and `<Hands home>/shared-mcp` exists, and a closed port does not fail the doctor. Cache is path-only in v1.
