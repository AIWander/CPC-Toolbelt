---
name: getting-started
description: First-run CPC Toolbelt setup — hands_setup_status, Hands home, and an optional private tunnel
---

Run the `getting-started` skill. Call `hands_setup_status` before any other Hands tool. Resolve `HANDS_HOME` (else `CPC_ROOT`, else the per-user AIWander Hands directory) and wire `cpc-hands` as stdio. If a remote tunnel is not set up and the user wants one, walk them through Tailscale or another private tunnel. The user signs in themselves. Never store keys. No public link by default.
