---
name: toolbelt-setup
description: Configure HANDS_HOME, the Cache path, Hands MCP, and optional Voice/Workflow/Manager
---

Run the `toolbelt-setup` skill. Resolve the Hands home (`HANDS_HOME`, else `CPC_ROOT`, else the per-user AIWander Hands directory) and Cache (`CPC_CACHE` or `<Hands home>/cache`). Wire Hands only, as stdio. Enable optionals only if the user opts in. Do not add Programmer unless asked.
