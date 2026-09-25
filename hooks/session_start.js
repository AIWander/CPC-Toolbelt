#!/usr/bin/env node
'use strict';
/**
 * sessionStart — CPC Toolbelt
 * Fail-open. Cursor sessionStart: additional_context + env.
 */
const fs = require('fs');

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
    readInput();
    const cpcRoot = process.env.CPC_ROOT || 'C:\\CPC';
    const cpcCache = process.env.CPC_CACHE || 'C:\\CPC\\cache';
    const missingHints = [];
    if (!process.env.CPC_ROOT) missingHints.push('CPC_ROOT unset (default C:\\CPC)');
    if (!process.env.CPC_CACHE) missingHints.push('CPC_CACHE unset (default C:\\CPC\\cache)');

    const lines = [
      'CPC Toolbelt is active.',
      'Prefer the Cache path (CPC_CACHE) before downloading skills, files, or assets.',
      'Hands (cpc-hands) is the wired MCP server for this pack.',
      'Do not brand Toolbelt or Hands as autonomous, unattended, or hands-off.',
      'Cache v1 is path + skills only — there is no cpc-cache MCP server in mcp.json.',
      'If CPC_ROOT or CPC_CACHE look wrong, run the toolbelt-doctor skill.',
    ];
    if (missingHints.length) {
      lines.push('Hint: ' + missingHints.join('; ') + '.');
    }

    const ctx = lines.join(' ');
    const env = {};
    if (process.env.CPC_ROOT) env.CPC_ROOT = process.env.CPC_ROOT;
    else env.CPC_ROOT = cpcRoot;
    if (process.env.CPC_CACHE) env.CPC_CACHE = process.env.CPC_CACHE;
    else env.CPC_CACHE = cpcCache;

    const payload = {
      additional_context: ctx,
      additionalContext: ctx,
      env,
    };
    process.stdout.write(JSON.stringify(payload) + '\n');
  } catch {
    process.stdout.write('{}\n');
  }
}

main();
