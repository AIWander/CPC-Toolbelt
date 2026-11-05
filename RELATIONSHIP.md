# CPC lanes — how the pieces relate

Publisher contact: `contact@aiwander.ai`

| Lane | Where | Role |
|---|---|---|
| **Suite** | [CPC-Suite](https://github.com/AIWander/CPC-Suite) | Signed installers for the local package used by Claude Desktop and Codex |
| **CPC-Toolbelt** | [AIWander/CPC-Toolbelt](https://github.com/AIWander/CPC-Toolbelt) | **Cursor plugin + distribution face** (this repo) |
| **CPC-Toolbelt-Grok** | [AIWander/CPC-Toolbelt-Grok](https://github.com/AIWander/CPC-Toolbelt-Grok) | **Grok walkthrough** / `toolbelt-*` skills |
| **CPC-Toolbelt-Claude** | [AIWander/CPC-Toolbelt-Claude](https://github.com/AIWander/CPC-Toolbelt-Claude) | **Claude** skills and setup |
| **CPC-Toolbelt-Codex** | [AIWander/CPC-Toolbelt-Codex](https://github.com/AIWander/CPC-Toolbelt-Codex) | **Codex / ChatGPT** plugin |
| **GrokCLI** | [AIWander/GrokCLI](https://github.com/AIWander/GrokCLI) | **Protocol layer** (`cpc-*`) — coexist; do **not** replace |
| **Autonomous** | Paid product (separate) | **Never** free-pack branding, and **never** wire it into free Toolbelt examples |

Paths are per user. The Hands home and Cache directory resolve at runtime (`HANDS_HOME`, with `CPC_ROOT` / `CPC_CACHE` as back-compat overrides). This map does not name a developer machine or a private checkout.

## Coexistence rules

1. Toolbelt (Cursor), Toolbelt-Grok, Toolbelt-Claude, and Toolbelt-Codex are install/wiring faces. They teach Hands, the Cache path, and optionals.
2. GrokCLI stays the protocol/behavior layer (`cpc-*` skills/hooks). Install Toolbelt-Grok **alongside** GrokCLI when you want both.
3. CPC-Suite is the installer for the local binaries. It is not this GitHub plugin root, and it is not a path on one person's disk.
4. Autonomous is a separate paid product. Free Toolbelt docs and examples must not advertise it as an installable free MCP server.

## MCP wiring default

- **Default:** stdio via `${HANDS_HOME}/servers/*.exe` (see `mcp.json`, `mcp.optionals.example.json`). Fill `HANDS_HOME` at install time, or write the resolved command into the user's private MCP config.
- Hook and skill files that live in a plugin use a plugin-root variable (`${CURSOR_PLUGIN_ROOT}` here, `${CLAUDE_PLUGIN_ROOT}` on Claude).
- Do not commit absolute paths. Do not publish a shared-host port list. Remote access is a private tunnel the user signs into themselves (`getting-started` skill).
