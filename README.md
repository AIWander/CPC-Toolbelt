# CPC Toolbelt

**Publisher:** AIwander  
**Tagline:** Tools Cursor/Grok reach for when you ask

Cursor marketplace-ready plugin. This repository **root** is the plugin (not a nested multi-plugin marketplace).

## What you get

| Piece | How it ships (v1) |
|---|---|
| Hands | Required MCP: `cpc-hands` → `%CPC_ROOT%\servers\\hands.exe` |
| Cache | Path `CPC_CACHE` (suggest `C:\CPC\cache`) + skills/hooks — **no MCP** |
| Voice / Workflow / Manager | Optional — merge from `mcp.optionals.example.json` |
| Programmer | **Never** default on Cursor — `add-programmer` skill only if asked |

Do **not** brand as autonomous.

## Install (local / marketplace)

1. Install or open this plugin in Cursor.
2. Set plugin variables `CPC_ROOT` (default `C:\CPC`) and `CPC_CACHE` (default `C:\CPC\cache`).
3. Confirm `cpc-hands` appears under Available Tools.
4. Run the `toolbelt-setup` skill (or `/toolbelt-setup` command).
5. Optionally enable Voice / Workflow / Manager via `enable-optional`.

## Layout

- `.cursor-plugin/plugin.json` — manifest
- `mcp.json` — Hands only
- `hooks/` — Cursor hooks (`sessionStart`, cache-first, stop nudge)
- `skills/`, `rules/`, `commands/`, `assets/`


## Shared-host MCP (optional)

Plugin **v1 default** is **stdio**: `${CPC_ROOT}/servers/*.exe` (see `mcp.json` / `mcp.optionals.example.json`).

On machines that already run the `cpc` shared-mcp daemon, you may instead point Cursor at localhost ports. Owner-verified BEE port map (do **not** invent HTTP paths — copy the real endpoint from that machine’s Cursor `mcp.json`):

| Service | Port | Free Toolbelt? |
|---|---|---|
| autonomous | 7771 | **No** — paid wedge; never wire into free examples |
| hands | 7772 | Yes (required) |
| local | 7773 | Host lane (not a Toolbelt free-pack default) |
| manager | 7774 | Optional |
| workflow | 7775 | Optional |
| voice | 7776 | Optional (may be cold) |
| programmer | 7777 | Directed only |
| ops | 7778 | Host lane |
| stocks | 7779 | Host lane |

See `mcp.shared-http.example.json`. Prefer stdio for plugin v1.

## Related

<<<<<<< HEAD
- Lane map: [`RELATIONSHIP.md`](./RELATIONSHIP.md)

=======
- Lane map (Suite, this plugin, Grok, protocol): [RELATIONSHIP.md](RELATIONSHIP.md)
>>>>>>> f7af622 (doctor: fail-open checks for CPC_ROOT, hands.exe, CPC_CACHE, and optional 7772)
- Grok install layer: [CPC-Toolbelt-Grok](https://github.com/AIWander/CPC-Toolbelt-Grok) (sibling repo)
- Protocol skills (separate): [GrokCLI](https://github.com/AIWander/GrokCLI) — install alongside if you want both
- Human tour: [StartHERE](https://github.com/AIWander/StartHERE)
- Signed installers: [CPC-Suite](https://github.com/AIWander/CPC-Suite)

## Validate

```bash
node scripts/validate.mjs
```
