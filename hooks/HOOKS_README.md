# CPC Toolbelt hooks (Cursor)

Cursor Plugins can ship `hooks/hooks.json`. Events used here:

| Event | Script | Behavior |
|---|---|---|
| `sessionStart` | `session_start.js` | Inject Toolbelt context; set env defaults for `CPC_ROOT` / `CPC_CACHE` |
| `beforeSubmitPrompt` | `cache_first_prompt.js` | Soft cache-first `additional_context` on lookup-like prompts; always `continue: true` |
| `beforeMCPExecution` | `cache_before_mcp.js` | Soft `agent_message` nudge for network-ish tools; **always** `permission: allow` |
| `stop` | `stop_doctor_nudge.js` | Only if `CPC_TOOLBELT_DOCTOR_ON_STOP=1`; `loop_limit: 0` |

Commands use `node ${CURSOR_PLUGIN_ROOT}/hooks/...` because plugin hooks run with cwd = opened project, not the plugin install dir.

All scripts: Node, no deps, fail-open (`{}` / allow / continue).

## Diff vs GrokCLI
- Toolbelt-focused (Cache path, Hands, doctor) — **no** autonomous Volumes / CPC knowledge dependency
- Namespace is plugin-local under this repo; GrokCLI keeps separate `cpc-*` protocol skills/hooks
