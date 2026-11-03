# CPC Toolbelt — pack matrix

## Naming
- **Product:** CPC Toolbelt
- **Publisher:** AIwander
- **Tagline:** Tools Cursor/Grok reach for when you ask
- **MCP key prefix:** `cpc-`
- **User-facing cache name:** Cache
- **Do not brand as:** autonomous, agent-unattended, hands-off

## Components

| MCP key / product | Binary / path under the Hands home | Required where |
|---|---|---|
| `cpc-hands` | `servers/hands.exe` | All Toolbelt clients (stdio MCP) |
| **Cache** (product) | `CPC_CACHE`, or `<Hands home>/cache` | All clients — **v1: path + skills only, no MCP wire** |
| `cpc-voice` | `servers/voice.exe` | Optional |
| `cpc-workflow` | `servers/workflow.exe` | Optional |
| `cpc-manager` | `servers/manager.exe` (Beta) | Optional |
| `cpc-programmer` | `servers/programmer.exe` | **Claude Desktop pack only** by default |

The Hands home is `HANDS_HOME`, else `CPC_ROOT` when that older variable is set, else `%LOCALAPPDATA%\AIWander\Hands` (or the current user's application-data directory plus `AIWander/Hands`).

## Binaries
A Toolbelt install home contains `servers/hands.exe`. Voice, Workflow, Manager, and Programmer are optional binaries in that same `servers` directory. There is no Cache MCP binary in v1. Do not invent one. Cache is a directory.

## Cache v1 rule (locked)
- Store Cache at `CPC_CACHE` when set, otherwise `<Hands home>/cache`
- Skills / hooks: prefer Cache before network when an asset may be cached
- Do **not** add `cpc-cache` to `mcp.json` until a real Cache MCP binary exists
- Deferred wire example kept only as `mcp.cache.example.json` (stdio, labeled deferred)

## Client profiles

### Cursor (this plugin — CPC-Toolbelt)
- Wire MCP: `cpc-hands` only (v1), stdio
- Cache via the resolved Cache path + skills/hooks (not MCP)
- Optional: Voice, Workflow, Manager
- Programmer: **never** default; only via `add-programmer` skill if the user asks

### Claude Desktop
- Wire MCP: Hands + **Programmer**, stdio, paths filled at install time
- Cache path + skills (same v1 rule)
- Optional: Voice, Workflow, Manager
- Install face: [CPC-Toolbelt-Claude](https://github.com/AIWander/CPC-Toolbelt-Claude)

### Grok Build CLI (CPC-Toolbelt-Grok)
- Skills/hooks namespaced `toolbelt-*` (alongside GrokCLI `cpc-*` protocol layer)
- Wire MCP: Hands (+ optionals), stdio; Cache path only for v1
- Programmer: only if the user or agent is directed to add it
- Snippets live in that repo's `mcp-snippets/` and must use install-time variables, not a fixed machine path

### Codex / GPT
- Same stdio wiring as Grok for local MCP
- Programmer available when directed
- Install face: [CPC-Toolbelt-Codex](https://github.com/AIWander/CPC-Toolbelt-Codex)

## Freemium
Free core capabilities (Hands, Cache path, Voice, Workflow, Manager Beta, Programmer) may ship free.
**Do not** sell or name this pack as “autonomous” — that remains a separate product.

## Transport

- **Plugin default:** stdio — `${HANDS_HOME}/servers/<name>.exe`, or the same command with the path written into the user's private MCP config at install time.
- Plugin-local hook scripts use `${CURSOR_PLUGIN_ROOT}` (other clients may use `${CLAUDE_PLUGIN_ROOT}`).
- Do not ship absolute paths, and do not publish a host port map. A private tunnel for remote use is covered by the `getting-started` skill.
