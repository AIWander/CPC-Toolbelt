#!/usr/bin/env node
'use strict';
/**
 * sessionStart — CPC Toolbelt
 * Fail-open. Cursor sessionStart: additional_context + env.
 * Fills HANDS_HOME and CPC_CACHE only when unset, using runtime resolution.
 */
const fs = require('fs');
const { resolveToolbeltPaths } = require('../scripts/resolve-paths.cjs');

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
    const resolved = resolveToolbeltPaths();
    const missingHints = [];
    if (resolved.home.source === 'default') {
      missingHints.push('HANDS_HOME and CPC_ROOT unset; using the per-user Hands directory');
    }
    if (resolved.cache.source === 'default') {
      missingHints.push('CPC_CACHE unset; using <Hands home>/cache');
    }

    const lines = [
      'CPC Toolbelt is active.',
      'On first use, run the getting-started skill and call hands_setup_status before other Hands tools.',
      'Prefer the Cache path (CPC_CACHE, or <Hands home>/cache) before downloading skills, files, or assets.',
      'Hands (cpc-hands) is the wired MCP server for this pack. It is stdio.',
      'Do not brand Toolbelt or Hands as autonomous, unattended, or hands-off.',
      'Cache v1 is path + skills only — there is no cpc-cache MCP server in mcp.json.',
      'If the Hands home or Cache path looks wrong, run the toolbelt-doctor skill.',
    ];
    if (missingHints.length) {
      lines.push('Hint: ' + missingHints.join('; ') + '.');
    }

    const ctx = lines.join(' ');
    const env = {};
    if (!process.env.HANDS_HOME) env.HANDS_HOME = resolved.home.path;
    if (!process.env.CPC_CACHE) env.CPC_CACHE = resolved.cache.path;

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
