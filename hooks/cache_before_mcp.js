#!/usr/bin/env node
'use strict';
/**
 * beforeMCPExecution — soft nudge to check CPC_CACHE for network-ish asset fetches.
 * Always permission: allow. Never deny.
 */
const fs = require('fs');

const NETWORKISH =
  /fetch|download|http|https|url|web|browser_navigate|browser_agent|pull|clone|curl|wget|install_skill|get_file|asset/i;

function readInput() {
  try {
    const chunks = [];
    const buf = Buffer.alloc(65536);
    let n;
    while ((n = fs.readSync(0, buf, 0, buf.length, null)) > 0) {
      chunks.push(Buffer.from(buf.subarray(0, n)));
    }
    const raw = Buffer.concat(chunks).toString('utf8').trim();
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function main() {
  try {
    const input = readInput();
    const server = String(input.mcp_server_name || '');
    const tool = String(input.tool_name || '');
    const tip = String(input.tool_input || '');
    const blob = server + ' ' + tool + ' ' + tip;
    const cache = process.env.CPC_CACHE || 'C:\\CPC\\cache';

    const out = { permission: 'allow' };
    if (NETWORKISH.test(blob)) {
      out.agent_message =
        'Soft nudge: before network fetch of skills/files/assets, check CPC_CACHE (' +
        cache +
        ') first. Cache v1 is path-only — no cpc-cache MCP. Always allowing this MCP call.';
    }
    process.stdout.write(JSON.stringify(out) + '\n');
  } catch {
    process.stdout.write(JSON.stringify({ permission: 'allow' }) + '\n');
  }
}

main();
