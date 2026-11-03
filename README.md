# CPC Toolbelt

**Publisher:** AIwander  
**Tagline:** Tools Cursor/Grok reach for when you ask

Cursor marketplace-ready plugin. This repository **root** is the plugin (not a nested multi-plugin marketplace).

## What you get

| Piece | How it ships (v1) |
|---|---|
| Hands | Required stdio MCP: `cpc-hands` → `${HANDS_HOME}/servers/hands.exe` |
| Cache | Path `CPC_CACHE`, or `<Hands home>/cache` when that variable is unset. Skills and hooks only — **no MCP** |
| Voice / Workflow / Manager | Optional stdio — merge from `mcp.optionals.example.json` |
| Programmer | **Never** default on Cursor — `add-programmer` skill only if asked |

Do **not** brand as autonomous.

## Paths

Resolved when a hook or `scripts/toolbelt-doctor.mjs` runs. Nothing in this repo points at one person's machine.

1. **Hands home:** `HANDS_HOME` if set, else `CPC_ROOT` (older installs), else `%LOCALAPPDATA%\AIWander\Hands`. When `LOCALAPPDATA` is unset, that is the current user's application-data directory plus `AIWander/Hands`.
2. **Cache:** `CPC_CACHE` if set, else `<Hands home>/cache`.
3. **Binaries:** `<Hands home>/servers/<name>.exe`.

`CPC_ROOT` and `CPC_CACHE` are back-compat environment overrides. Leave them empty on a new install.

## Install (local / marketplace)

1. Install or open this plugin in Cursor.
2. Run the `getting-started` skill (or `/getting-started`). It calls `hands_setup_status` before anything else.
3. Set the `HANDS_HOME` plugin variable to the resolved directory so `${HANDS_HOME}` expands. Leave it empty only if the host resolves the default itself. Set `CPC_CACHE` only when Cache should not live under that home.
4. Confirm `cpc-hands` appears under Available Tools.
5. Run `toolbelt-setup` if you still need optional Voice / Workflow / Manager.

Do not paste an absolute path back into this repository. If the host cannot expand variables, write the resolved stdio command only into the user's private MCP config.

## Layout

- `.cursor-plugin/plugin.json` — manifest
- `mcp.json` — Hands only (stdio)
- `hooks/` — Cursor hooks (`sessionStart`, cache-first, stop nudge)
- `skills/`, `rules/`, `commands/`, `assets/`

## MCP transport

Every MCP server shipped here is **stdio**. See `mcp.json` and `mcp.optionals.example.json`. Commands use `${HANDS_HOME}` (filled at install time) or, for files that live in the plugin, a plugin-root variable such as `${CURSOR_PLUGIN_ROOT}`.

This pack does not publish a shared-host port map. Remote use, when you need it, is a private tunnel you sign into yourself. The `getting-started` skill walks through that. There is no public link by default.

## Related

- Lane map: [`RELATIONSHIP.md`](./RELATIONSHIP.md)
- Grok install layer: [CPC-Toolbelt-Grok](https://github.com/AIWander/CPC-Toolbelt-Grok)
- Claude install layer: [CPC-Toolbelt-Claude](https://github.com/AIWander/CPC-Toolbelt-Claude)
- Codex install layer: [CPC-Toolbelt-Codex](https://github.com/AIWander/CPC-Toolbelt-Codex)
- Protocol skills (separate): [GrokCLI](https://github.com/AIWander/GrokCLI) — install alongside if you want both
- Human tour: [StartHERE](https://github.com/AIWander/StartHERE)
- Signed installers: [CPC-Suite](https://github.com/AIWander/CPC-Suite)

## Validate

```bash
node scripts/validate.mjs
```
