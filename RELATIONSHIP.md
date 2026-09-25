# CPC lanes — how the pieces relate

Publisher contact: `contact@aiwander.ai`

| Lane | Where | Role |
|---|---|---|
| **Suite** | Josep local: `C:\CPC\suite_attempts\cursor-20260924` | Local package path for **Claude Desktop + Codex** |
| **CPC-Toolbelt** | [AIWander/CPC-Toolbelt](https://github.com/AIWander/CPC-Toolbelt) | **Cursor plugin + distribution face** (this repo) |
| **CPC-Toolbelt-Grok** | [AIWander/CPC-Toolbelt-Grok](https://github.com/AIWander/CPC-Toolbelt-Grok) | **Grok walkthrough** / `toolbelt-*` skills |
| **GrokCLI** | [AIWander/GrokCLI](https://github.com/AIWander/GrokCLI) | **Protocol layer** (`cpc-*`) — coexist; do **not** replace |
| **Autonomous** | Paid wedge (separate product) | **Never** free-pack branding; **never** wire port **7771** into free Toolbelt examples |

## Coexistence rules

1. Toolbelt (Cursor) and Toolbelt-Grok are install/wiring faces. They teach Hands, Cache path, and optionals.
2. GrokCLI stays the protocol/behavior layer (`cpc-*` skills/hooks). Install Toolbelt-Grok **alongside** GrokCLI when you want both.
3. Suite on Josep is the local package tree for Claude Desktop / Codex — not this GitHub plugin root.
4. Autonomous is a paid wedge. Free Toolbelt docs and examples must not advertise it as installable free MCP, and must not include `7771` in free wire examples.

## MCP wiring default

- **Plugin v1 default:** stdio via `${CPC_ROOT}/servers/*.exe` (see `mcp.json`, `mcp.optionals.example.json`).
- **Optional advanced:** shared-host HTTP when a machine already runs the `cpc` shared-mcp daemon — see `mcp.shared-http.example.json` (port map only; copy real URL paths from that machine’s Cursor `mcp.json`).
