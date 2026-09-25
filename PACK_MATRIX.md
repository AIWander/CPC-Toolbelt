# CPC Toolbelt — pack matrix

## Naming
- **Product:** CPC Toolbelt
- **Publisher:** AIwander
- **Tagline:** Tools Cursor/Grok reach for when you ask
- **MCP key prefix:** `cpc-`
- **User-facing cache name:** Cache
- **Do not brand as:** autonomous, agent-unattended, hands-off

## Components

| MCP key / product | Binary / path (default under `%CPC_ROOT%`) | Required where |
|---|---|---|
| `cpc-hands` | `servers/hands.exe` | All Toolbelt clients (MCP) |
| **Cache** (product) | Path via `CPC_CACHE` (default suggest `C:\CPC\cache`) | All clients — **v1: path + skills only, no MCP wire** |
| `cpc-voice` | `servers/voice.exe` | Optional |
| `cpc-workflow` | `servers/workflow.exe` | Optional |
| `cpc-manager` | `servers/manager.exe` (Beta) | Optional |
| `cpc-programmer` | `servers/programmer.exe` | **Claude Desktop pack only** by default |

## Binary truth (reference BEE, 2026-09-25)
Present under `C:\CPC\servers\\`: `hands.exe`, `voice.exe`, `workflow.exe`, `manager.exe`, `programmer.exe`.
**No** `autocache.exe`. Cache directory `C:\CPC\cache` exists. Do not invent a Cache MCP binary for v1.

## Cache v1 rule (locked)
- Collect and store `CPC_CACHE` (suggest `C:\CPC\cache`)
- Skills / hooks / AGENTS: prefer Cache before network when an asset may be cached
- Do **not** add `cpc-cache` to `mcp.json` until a real Cache MCP binary exists
- Deferred wire example kept only as `mcp.cache.example.json` / labeled deferred

## Client profiles

### Cursor (this plugin — CPC-Toolbelt)
- Wire MCP: `cpc-hands` only (v1)
- Cache via `CPC_CACHE` + skills/hooks (not MCP)
- Optional: Voice, Workflow, Manager
- Programmer: **never** default; only via `add-programmer` skill if user asks

### Claude Desktop (installer future)
- Wire MCP: Hands + **Programmer**
- Cache path + skills (same v1 rule)
- Optional: Voice, Workflow, Manager

### Grok Build CLI (CPC-Toolbelt-Grok)
- Skills/hooks namespaced `toolbelt-*` (alongside GrokCLI `cpc-*` protocol layer)
- Wire MCP: Hands (+ optionals); Cache path only for v1
- Programmer: only if user/agent is directed to add it

### GPT (local MCP host)
- Same as Grok for local MCP wiring
- Programmer available when directed

## Freemium
Free core capabilities (Hands, Cache path, Voice, Workflow, Manager Beta, Programmer) may ship free.
**Do not** sell or name this pack as “autonomous” — that remains a separate wedge.
